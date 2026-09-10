// v0.18: teacher auth modal — sign-in, sign-up, and forgot-password tabs.
//
// New in v0.18: teachers no longer need to be pre-created in the Firebase
// console. The modal exposes three modes:
//
//   - signin  → existing flow (email + password → signInWithEmailAndPassword)
//   - signup  → create a new account (name + school + email + password +
//                confirm). On success a profile doc is written to
//                `teachers/{uid}/profile/profile` so teacher metadata is
//                visible across devices.
//   - forgot  → email-only reset flow (sendPasswordResetEmail).
//
// Inline validation, loading state, and friendly error messages are routed
// through the helpers in src/lib/firebase.ts so all callers behave the same.
//
// Local-demo mode (when Firebase env vars are not configured) renders an
// explanatory panel and lets the teacher dismiss — Pragati continues to work
// against localStorage in that case.

import { useEffect, useRef, useState } from 'react';
import {
  createTeacherAccount,
  currentTeacher,
  friendlyAuthError,
  isFirebaseEnabled,
  isValidEmail,
  sendTeacherPasswordReset,
  teacherLogin,
  teacherLogout,
  validatePasswordStrength,
} from '../lib/firebase';

type Mode = 'signin' | 'signup' | 'forgot';

export function TeacherLoginModal({
  open,
  onClose,
  initialMode = 'signin',
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const teacher = currentTeacher();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setInfo(null);
      setMode(initialMode);
      // Focus the first text field for keyboard users.
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [open, initialMode]);

  if (!open) return null;

  const enabled = isFirebaseEnabled();

  const switchMode = (next: Mode) => {
    setError(null);
    setInfo(null);
    setMode(next);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  };

  // -------------------------------------------------------------------------
  // Submit handlers
  // -------------------------------------------------------------------------

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      if (!isValidEmail(email)) throw new Error('Please enter a valid email address.');
      if (!password) throw new Error('Please enter your password.');
      await teacherLogin(email, password);
      setSubmitting(false);
      resetForm();
      onClose();
    } catch (err) {
      setError(friendlyAuthError(err));
      setSubmitting(false);
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      if (!name.trim()) throw new Error('Please enter your name.');
      if (!school.trim()) throw new Error('Please enter your school.');
      if (!isValidEmail(email)) throw new Error('Please enter a valid email address.');
      const pwErr = validatePasswordStrength(password);
      if (pwErr) throw new Error(pwErr);
      if (password !== confirm) throw new Error('The two password fields do not match.');
      await createTeacherAccount({ name, email, password, school });
      setSubmitting(false);
      resetForm();
      onClose();
    } catch (err) {
      setError(friendlyAuthError(err));
      setSubmitting(false);
    }
  };

  const onForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      if (!isValidEmail(email)) throw new Error('Please enter a valid email address.');
      await sendTeacherPasswordReset(email);
      setInfo(
        `If an account exists for ${email.trim()}, a password reset email has been sent. Check your inbox (and spam folder).`
      );
      setSubmitting(false);
    } catch (err) {
      setError(friendlyAuthError(err));
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSchool('');
    setEmail('');
    setPassword('');
    setConfirm('');
  };

  const onSignOut = async () => {
    await teacherLogout();
    onClose();
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {teacher
                ? 'Signed in'
                : mode === 'signup'
                  ? 'Create a teacher account'
                  : mode === 'forgot'
                    ? 'Reset your password'
                    : 'Teacher sign-in'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {teacher
                ? 'Manage your session here.'
                : mode === 'signup'
                  ? "Sign up so this device can sync to the cloud. You'll set your password yourself — Pragati never stores it."
                  : mode === 'forgot'
                    ? "Enter the email on your account. We'll send you a reset link."
                    : 'Sign in with your school email to sync this device with the cloud.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close auth dialog"
          >
            ×
          </button>
        </div>

        {!enabled && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <div className="font-semibold">Local demo mode</div>
            <p className="mt-1">
              Firebase isn't configured for this build, so cloud sign-in and
              sync are off. Pragati continues to work using localStorage only.
              To enable accounts, set the{' '}
              <code className="font-mono text-xs">VITE_FIREBASE_*</code>{' '}
              environment variables and rebuild.
            </p>
            <button
              onClick={onClose}
              className="mt-3 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Continue in local demo mode
            </button>
          </div>
        )}

        {enabled && teacher && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              Signed in as{' '}
              <span className="font-mono text-xs">{teacher.email ?? teacher.uid}</span>.
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onSignOut}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Sign out
              </button>
              <button
                onClick={onClose}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {enabled && !teacher && (
          <>
            {/* Mode tabs */}
            <div className="mt-4 flex gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <ModeTab label="Sign in" active={mode === 'signin'} onClick={() => switchMode('signin')} />
              <ModeTab label="Sign up" active={mode === 'signup'} onClick={() => switchMode('signup')} />
              <ModeTab label="Forgot?" active={mode === 'forgot'} onClick={() => switchMode('forgot')} />
            </div>

            {mode === 'signin' && (
              <form className="mt-4 space-y-3" onSubmit={onSignIn}>
                <TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={setEmail}
                  inputRef={firstFieldRef}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={setPassword}
                  required
                />
                {error && <Alert kind="error">{error}</Alert>}
                {info && <Alert kind="info">{info}</Alert>}
                <FormActions submitLabel={submitting ? 'Signing in…' : 'Sign in'} submitting={submitting} onCancel={onClose} />
              </form>
            )}

            {mode === 'signup' && (
              <form className="mt-4 space-y-3" onSubmit={onSignUp}>
                <TextField
                  label="Full name"
                  autoComplete="name"
                  value={name}
                  onChange={setName}
                  inputRef={firstFieldRef}
                  required
                />
                <TextField
                  label="School"
                  autoComplete="organization"
                  value={school}
                  onChange={setSchool}
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={setEmail}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={setPassword}
                  required
                  hint="At least 8 characters, with a letter and a number."
                />
                <TextField
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={setConfirm}
                  required
                />
                {error && <Alert kind="error">{error}</Alert>}
                {info && <Alert kind="info">{info}</Alert>}
                <p className="text-xs text-slate-500">
                  Your profile is stored at{' '}
                  <code className="font-mono text-[10px]">teachers/{'{your-uid}'}/profile</code>
                  . You can change your school or name later from your account menu.
                </p>
                <FormActions
                  submitLabel={submitting ? 'Creating account…' : 'Create account'}
                  submitting={submitting}
                  onCancel={onClose}
                />
              </form>
            )}

            {mode === 'forgot' && (
              <form className="mt-4 space-y-3" onSubmit={onForgot}>
                <TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={setEmail}
                  inputRef={firstFieldRef}
                  required
                />
                {error && <Alert kind="error">{error}</Alert>}
                {info && <Alert kind="info">{info}</Alert>}
                <FormActions
                  submitLabel={submitting ? 'Sending…' : 'Send reset email'}
                  submitting={submitting}
                  onCancel={onClose}
                />
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ModeTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 py-1.5 transition ${
        active
          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  );
}

function TextField({
  label,
  type = 'text',
  autoComplete,
  value,
  onChange,
  inputRef,
  required,
  hint,
}: {
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{label}</span>
      <input
        ref={inputRef}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function Alert({
  kind,
  children,
}: {
  kind: 'error' | 'info';
  children: React.ReactNode;
}) {
  const cls =
    kind === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-800'
      : 'border-brand-200 bg-brand-50 text-brand-800';
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border p-2.5 text-xs ${cls}`}>
      {children}
    </div>
  );
}

function FormActions({
  submitLabel,
  submitting,
  onCancel,
}: {
  submitLabel: string;
  submitting: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </div>
  );
}
