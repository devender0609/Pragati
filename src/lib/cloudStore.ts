// Firestore CRUD wrappers for Pragati (v0.17).
//
// Path convention: `teachers/{uid}/{collection}/{doc}`. This lets us write
// the simplest possible security rule — "teacher can read/write only their
// own data" — without complex per-document checks.
//
// All callers must check `isFirebaseEnabled()` and `currentTeacher()` first;
// `requireDb()` throws clearly if neither holds. This keeps cloud paths
// strictly opt-in: when Firebase env vars are missing or no teacher is
// signed in, NONE of these functions are called and the app falls back to
// localStorage cleanly.

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import { currentTeacher, getFirebase } from './firebase';
import type {
  AssessmentAssignment,
  ItemReview,
  PilotMetadata,
  Session,
  SessionFeedback,
  Student,
} from '../types';

// ---------------------------------------------------------------------------
// Cloud-only types
// ---------------------------------------------------------------------------

export type Classroom = {
  id: string;
  teacherUid: string;
  name: string;
  notes: string;
  studentIds: string[];
  archived: boolean;
  createdAt: number;
  updatedAt: number;
  // v0.19: optional classroom-level access code that students enter to join.
  // Stored ALSO in a top-level `accessCodes/{code}` doc when synced to the
  // cloud, so students can look it up without needing teacherUid up-front.
  accessCode?: string;
  // v0.22: optional expiry timestamp (ms epoch) mirrored from
  // `accessCodes/{code}.expiresAt` to the local classroom record so the
  // Classrooms view can render the status pill offline too.
  accessCodeExpiresAt?: number;
  // v0.22: local mirror of `accessCodes/{code}.revoked` for the same reason.
  accessCodeRevoked?: boolean;
  // v0.26 — curriculum context. Optional so legacy Classroom records load
  // unchanged. When present, a Classroom carries the curriculum, grade,
  // subject, and academic year it belongs to, and access-code enrollment
  // uses THESE values instead of the historical hard-coded 'Class 6'.
  curriculumId?: string;
  gradeId?: string;
  subjectId?: string;
  academicYear?: string;
};

export type StoredPilotReport = {
  id: string;
  pilotId: string | null;
  generatedAt: number;
  summaryText: string;
  // The raw report payload, JSON-stringified by caller. Kept as a string so
  // Firestore doesn't need to flatten nested objects.
  jsonBlob: string;
};

export type CloudCollection =
  | 'classrooms'
  | 'students'
  | 'sessions'
  | 'assignments'
  | 'pilots'
  | 'itemReviews'
  | 'studentFeedback'
  | 'pilotReports';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requireDb(): { db: Firestore; uid: string } {
  const s = getFirebase();
  if (s.kind !== 'enabled') {
    throw new Error('Firebase not enabled. Cannot reach cloud.');
  }
  const teacher = currentTeacher();
  if (!teacher) {
    throw new Error('No signed-in teacher. Cannot reach cloud.');
  }
  return { db: s.db, uid: teacher.uid };
}

const teacherCol = (db: Firestore, uid: string, name: CloudCollection) =>
  collection(db, 'teachers', uid, name);

const teacherDoc = (
  db: Firestore,
  uid: string,
  name: CloudCollection,
  id: string
) => doc(db, 'teachers', uid, name, id);

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------

export async function upsertStudent(s: Student): Promise<void> {
  const { db, uid } = requireDb();
  await setDoc(teacherDoc(db, uid, 'students', s.id), s, { merge: true });
}

export async function listAllStudents(): Promise<Student[]> {
  const { db, uid } = requireDb();
  const snap = await getDocs(teacherCol(db, uid, 'students'));
  return snap.docs.map((d) => d.data() as Student);
}

export async function deleteStudentDoc(studentId: string): Promise<void> {
  const { db, uid } = requireDb();
  await deleteDoc(teacherDoc(db, uid, 'students', studentId));
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export async function upsertSession(s: Session): Promise<void> {
  const { db, uid } = requireDb();
  await setDoc(teacherDoc(db, uid, 'sessions', s.id), s, { merge: true });
}

export async function listAllSessions(): Promise<Session[]> {
  const { db, uid } = requireDb();
  const snap = await getDocs(teacherCol(db, uid, 'sessions'));
  return snap.docs.map((d) => d.data() as Session);
}

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

export async function upsertAssignment(a: AssessmentAssignment): Promise<void> {
  const { db, uid } = requireDb();
  await setDoc(teacherDoc(db, uid, 'assignments', a.id), a, { merge: true });
}

export async function listAllAssignments(): Promise<AssessmentAssignment[]> {
  const { db, uid } = requireDb();
  const snap = await getDocs(teacherCol(db, uid, 'assignments'));
  return snap.docs.map((d) => d.data() as AssessmentAssignment);
}

export async function deleteAssignmentDoc(id: string): Promise<void> {
  const { db, uid } = requireDb();
  await deleteDoc(teacherDoc(db, uid, 'assignments', id));
}

// ---------------------------------------------------------------------------
// Pilots
// ---------------------------------------------------------------------------

export async function upsertPilot(p: PilotMetadata): Promise<void> {
  const { db, uid } = requireDb();
  await setDoc(teacherDoc(db, uid, 'pilots', p.id), p, { merge: true });
}

export async function listAllPilots(): Promise<PilotMetadata[]> {
  const { db, uid } = requireDb();
  const snap = await getDocs(teacherCol(db, uid, 'pilots'));
  return snap.docs.map((d) => d.data() as PilotMetadata);
}

// ---------------------------------------------------------------------------
// Item reviews
// ---------------------------------------------------------------------------

export async function upsertItemReview(r: ItemReview): Promise<void> {
  const { db, uid } = requireDb();
  // Keyed by itemId (one review per item per teacher).
  await setDoc(teacherDoc(db, uid, 'itemReviews', r.itemId), r, { merge: true });
}

export async function listAllItemReviews(): Promise<ItemReview[]> {
  const { db, uid } = requireDb();
  const snap = await getDocs(teacherCol(db, uid, 'itemReviews'));
  return snap.docs.map((d) => d.data() as ItemReview);
}

// ---------------------------------------------------------------------------
// Session feedback
// ---------------------------------------------------------------------------

export async function upsertFeedback(f: SessionFeedback): Promise<void> {
  const { db, uid } = requireDb();
  // Keyed by sessionId (one feedback per session).
  await setDoc(teacherDoc(db, uid, 'studentFeedback', f.sessionId), f, {
    merge: true,
  });
}

export async function listAllFeedback(): Promise<SessionFeedback[]> {
  const { db, uid } = requireDb();
  const snap = await getDocs(teacherCol(db, uid, 'studentFeedback'));
  return snap.docs.map((d) => d.data() as SessionFeedback);
}

// ---------------------------------------------------------------------------
// Classrooms (cloud-first; localStorage cache via classroomStore.ts)
// ---------------------------------------------------------------------------

export async function upsertClassroom(c: Classroom): Promise<void> {
  const { db, uid } = requireDb();
  await setDoc(teacherDoc(db, uid, 'classrooms', c.id), c, { merge: true });
}

export async function listAllClassrooms(): Promise<Classroom[]> {
  const { db, uid } = requireDb();
  const snap = await getDocs(teacherCol(db, uid, 'classrooms'));
  return snap.docs.map((d) => d.data() as Classroom);
}

export async function deleteClassroomDoc(id: string): Promise<void> {
  const { db, uid } = requireDb();
  await deleteDoc(teacherDoc(db, uid, 'classrooms', id));
}

// ---------------------------------------------------------------------------
// Pilot reports
// ---------------------------------------------------------------------------

export async function upsertPilotReport(r: StoredPilotReport): Promise<void> {
  const { db, uid } = requireDb();
  await setDoc(teacherDoc(db, uid, 'pilotReports', r.id), r, { merge: true });
}

export async function listAllPilotReports(): Promise<StoredPilotReport[]> {
  const { db, uid } = requireDb();
  const snap = await getDocs(teacherCol(db, uid, 'pilotReports'));
  return snap.docs.map((d) => d.data() as StoredPilotReport);
}
