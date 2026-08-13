// Firebase plumbing for Pragati (v0.17).
//
// Behavior:
// - If any of the six VITE_FIREBASE_* env vars is missing, `getFirebase()`
//   returns { kind: 'local-only', reason } and ALL Firebase callers must
//   degrade gracefully. The app continues to work using localStorage.
// - If all six env vars are present, we initialise Firebase v11 (app, auth,
//   firestore) once, memoize it, and expose helpers for sign-in / sign-out
//   / current teacher.
//
// Security note: credentials are read at build time via Vite's
// `import.meta.env`. They are NEVER hardcoded in this file.

import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  type Firestore,
} from 'firebase/firestore';

export type FirebaseState =
  | { kind: 'local-only'; reason: string }
  | { kind: 'enabled'; app: FirebaseApp; auth: Auth; db: Firestore };

export type TeacherUser = {
  uid: string;
  email: string | null;
};

// ---------------------------------------------------------------------------
// Initialisation (memoized)
// ---------------------------------------------------------------------------

let cached: FirebaseState | null = null;

function readEnv(): {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
} {
  // import.meta.env is a Vite-injected object. In non-Vite contexts (Node test
  // harness, SSR) it may be undefined — fall back to empty.
  const env = (import.meta as unknown as { env?: Record<string, string> }).env ?? {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };
}

export function getFirebase(): FirebaseState {
  if (cached) return cached;
  const env = readEnv();
  const required: Array<[keyof typeof env, string]> = [
    ['apiKey', 'VITE_FIREBASE_API_KEY'],
    ['authDomain', 'VITE_FIREBASE_AUTH_DOMAIN'],
    ['projectId', 'VITE_FIREBASE_PROJECT_ID'],
    ['storageBucket', 'VITE_FIREBASE_STORAGE_BUCKET'],
    ['messagingSenderId', 'VITE_FIREBASE_MESSAGING_SENDER_ID'],
    ['appId', 'VITE_FIREBASE_APP_ID'],
  ];
  const missing = required.filter(([k]) => !env[k] || env[k] === '').map(
    ([, name]) => name
  );
  if (missing.length > 0) {
    cached = {
      kind: 'local-only',
      reason: `Missing env vars: ${missing.join(', ')}`,
    };
    return cached;
  }
  try {
    const app = initializeApp({
      apiKey: env.apiKey!,
      authDomain: env.authDomain!,
      projectId: env.projectId!,
      storageBucket: env.storageBucket!,
      messagingSenderId: env.messagingSenderId!,
      appId: env.appId!,
    });
    const auth = getAuth(app);
    const db = getFirestore(app);
    cached = { kind: 'enabled', app, auth, db };
    return cached;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    cached = {
      kind: 'local-only',
      reason: `Firebase init failed: ${msg}`,
    };
    return cached;
  }
}

export function isFirebaseEnabled(): boolean {
  return getFirebase().kind === 'enabled';
}

export function firebaseStatusReason(): string | null {
  const s = getFirebase();
  return s.kind === 'local-only' ? s.reason : null;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

const toTeacher = (u: User | null): TeacherUser | null =>
  u ? { uid: u.uid, email: u.email } : null;

let currentTeacherCached: TeacherUser | null = null;

// Wire up the auth observer once when Firebase is enabled, so that
// `currentTeacher()` is always in sync (and so subscribers fire reliably).
function ensureAuthObserver(state: FirebaseState) {
  if (state.kind !== 'enabled') return;
  // Subscribing once is fine — observers are not removed on hot reload in
  // the simple prototype, which is acceptable.
  onAuthStateChanged(state.auth, (u) => {
    currentTeacherCached = toTeacher(u);
  });
}

// First-time access of the auth state — sets up the observer.
const _bootAuth = (() => {
  ensureAuthObserver(getFirebase());
  return true;
})();
void _bootAuth;

export function subscribeToAuth(
  cb: (teacher: TeacherUser | null) => void
): () => void {
  const s = getFirebase();
  if (s.kind !== 'enabled') {
    // Local-only mode: fire once with null, return a noop unsubscribe.
    queueMicrotask(() => cb(null));
    return () => undefined;
  }
  const unsub = onAuthStateChanged(s.auth, (u) => {
    currentTeacherCached = toTeacher(u);
    cb(currentTeacherCached);
  });
  return unsub;
}

export function currentTeacher(): TeacherUser | null {
  return currentTeacherCached;
}

export async function teacherLogin(
  email: string,
  password: string
): Promise<TeacherUser> {
  const s = getFirebase();
  if (s.kind !== 'enabled') {
    throw new Error('Firebase is not configured. Set VITE_FIREBASE_* env vars to enable teacher login.');
  }
  const cred = await signInWithEmailAndPassword(s.auth, email.trim(), password);
  const teacher = toTeacher(cred.user)!;
  currentTeacherCached = teacher;
  return teacher;
}

export async function teacherLogout(): Promise<void> {
  const s = getFirebase();
  if (s.kind !== 'enabled') return;
  await signOut(s.auth);
  currentTeacherCached = null;
}

// ---------------------------------------------------------------------------
// v0.18: self-service signup, profile, password reset
// ---------------------------------------------------------------------------
//
// New in v0.18: teachers can create accounts themselves (no Firebase console).
// A profile doc is written at `teachers/{uid}/profile/profile` which fits the
// existing security rule that gates all `teachers/{teacherId}/**` paths on
// `request.auth.uid == teacherId`.

export type TeacherProfile = {
  uid: string;
  name: string;
  email: string;
  school: string;
  createdAt: number;
  updatedAt: number;
};

const PROFILE_DOC_PATH = (uid: string): [string, string, string, string] => [
  'teachers',
  uid,
  'profile',
  'profile',
];

/**
 * Map Firebase auth errors (and our own throws) to short, user-friendly text.
 */
export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string } | null)?.code ?? '';
  const message =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
      ? err
      : 'Unknown error';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists for this email. Try signing in instead.';
    case 'auth/invalid-email':
      return 'That email address does not look valid.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 8 characters with a number.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/user-not-found':
      return 'No account found for that email.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact your administrator.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in this Firebase project.';
    default:
      return message;
  }
}

/**
 * Returns a string describing what is wrong with the password, or null when OK.
 * Pragati requires at least 8 characters with at least one letter and one digit.
 */
export function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Za-z]/.test(password)) {
    return 'Password must include at least one letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one number.';
  }
  return null;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Create a new teacher account and write the profile doc.
 * Throws (with a code that friendlyAuthError can translate) on failure.
 */
export async function createTeacherAccount(input: {
  name: string;
  email: string;
  password: string;
  school: string;
}): Promise<TeacherUser> {
  const s = getFirebase();
  if (s.kind !== 'enabled') {
    throw new Error(
      'Firebase is not configured. Set VITE_FIREBASE_* env vars to enable teacher signup.'
    );
  }
  const email = input.email.trim();
  const name = input.name.trim();
  const school = input.school.trim();
  if (!name) throw new Error('Please enter your name.');
  if (!school) throw new Error('Please enter your school.');
  if (!isValidEmail(email)) throw new Error('That email address does not look valid.');
  const pwErr = validatePasswordStrength(input.password);
  if (pwErr) throw new Error(pwErr);

  const cred = await createUserWithEmailAndPassword(s.auth, email, input.password);
  // Best effort: set displayName so it shows up in the auth user record too.
  try {
    await updateProfile(cred.user, { displayName: name });
  } catch {
    // Non-fatal; profile doc still holds the canonical name.
  }
  const now = Date.now();
  const profile: TeacherProfile = {
    uid: cred.user.uid,
    name,
    email,
    school,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(s.db, ...PROFILE_DOC_PATH(cred.user.uid)), profile, {
    merge: true,
  });
  const teacher = toTeacher(cred.user)!;
  currentTeacherCached = teacher;
  return teacher;
}

/** Read the teacher's profile doc (null if missing). */
export async function loadTeacherProfile(
  uid: string
): Promise<TeacherProfile | null> {
  const s = getFirebase();
  if (s.kind !== 'enabled') return null;
  try {
    const snap = await getDoc(doc(s.db, ...PROFILE_DOC_PATH(uid)));
    return snap.exists() ? (snap.data() as TeacherProfile) : null;
  } catch {
    return null;
  }
}

/** Upsert the teacher's profile doc. */
export async function saveTeacherProfile(profile: TeacherProfile): Promise<void> {
  const s = getFirebase();
  if (s.kind !== 'enabled') return;
  await setDoc(
    doc(s.db, ...PROFILE_DOC_PATH(profile.uid)),
    { ...profile, updatedAt: Date.now() },
    { merge: true }
  );
}

/** Wrapper around sendPasswordResetEmail. */
export async function sendTeacherPasswordReset(email: string): Promise<void> {
  const s = getFirebase();
  if (s.kind !== 'enabled') {
    throw new Error('Firebase is not configured.');
  }
  if (!isValidEmail(email)) throw new Error('That email address does not look valid.');
  await sendPasswordResetEmail(s.auth, email.trim());
}
