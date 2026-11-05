// v0.18: unified Account dropdown for the nav bar.
//
// Replaces the duplicate "Sign-in" pill + "Sign-in" button pair in v0.17.
// One control surfaces, in priority order:
//
//   - Signed-in state (name + email + school + sync status + last sync +
//     Sync now + Sign out), or
//   - Signed-out state ("Sign in" + "Create account"), or
//   - Local-demo-mode badge (Firebase not configured).
//
// Profile metadata is pulled from the per-teacher profile doc written at
// signup (createTeacherAccount), with the email from the auth user as a
// fallback. No PII is ever surfaced beyond what the teacher entered.

import { useEffect, useRef, useState } from 'react';
import {
  firebaseStatusReason,
  isFirebaseEnabled,
  loadTeacherProfile,
  subscribeToAuth,
  teacherLogout,
  type TeacherProfile,
  type TeacherUser,
} from '../lib/firebase';
import { hasUnsyncedChanges, lastSyncedAt, syncAll, type SyncResult } from '../lib/sync';

function relativeFromNow(ts: number): string {
  const delta = Date.now() - ts;
  if (delta < 30_000) return 'just now';
  const min = Math.round(delta / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}

function summarizeResult(r: SyncResult): { msg: string; isError: boolean } {
  if (r.kind === 'skipped') return { msg: r.reason, isError: false };
  if (r.kind === 'error') return { msg: r.reason, isError: true };
  if (r.errors.length > 0) {
    return {
      msg: `Sync failed — ${r.errors.length} row(s) errored`,
      isError: true,
    };
  }
  // v0.19/0.20: surface push / pull / skipped / conflicts totals plus a
  // student-submissions import note when present.
  const { pushed, pulled, skipped, conflicts } = r.totals;
  const parts: string[] = [];
  if (pushed) parts.push(`${pushed} pushed`);
  if (pulled) parts.push(`${pulled} pulled`);
  if (skipped) parts.push(`${skipped} up-to-date`);
  if (conflicts) parts.push(`${conflicts} conflict${conflicts === 1 ? '' : 's'}`);
  const importN = r.submissionImport?.imported ?? 0;
  if (importN > 0) parts.push(`${importN} student submission${importN === 1 ? '' : 's'}`);
  const msg = parts.length === 0 ? 'Up to date' : parts.join(' · ');
  return { msg, isError: false };
}

export function AccountMenu({
  onOpenAuth,
  onOpenSignUp,
}: {
  onOpenAuth: () => void;
  onOpenSignUp: () => void;
}) {
  const fbEnabled = isFirebaseEnabled();
  const localReason = firebaseStatusReason();
  const [teacher, setTeacher] = useState<TeacherUser | null>(null);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(() => lastSyncedAt());
  const [, setTick] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Subscribe to auth changes; load profile on sign-in.
  useEffect(() => {
    if (!fbEnabled) return;
    const unsub = subscribeToAuth(async (u) => {
      setTeacher(u);
      if (u) {
        const p = await loadTeacherProfile(u.uid);
        setProfile(p);
        setLastSyncAt(lastSyncedAt());
      } else {
        setProfile(null);
      }
    });
    return () => unsub();
  }, [fbEnabled]);

  // Tick once a minute so "Synced 2m ago" stays fresh.
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const onSyncNow = async () => {
    if (syncing) return;
    setSyncing(true);
    const r = await syncAll();
    const summary = summarizeResult(r);
    setLastError(summary.isError ? summary.msg : null);
    setLastSyncAt(lastSyncedAt());
    setSyncing(false);
  };

  const onSignOut = async () => {
    await teacherLogout();
    setProfile(null);
    setOpen(false);
  };

  // ---- Local-only mode: just a badge, no menu. -----------------------------
  if (!fbEnabled) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
        title={`Local demo mode — ${localReason ?? 'Firebase not configured'}`}
      >
        <span className="h-2 w-2 rounded-full bg-slate-400" />
        Local demo mode
      </span>
    );
  }

  // ---- Signed-out: split button (Sign in / Sign up). -----------------------
  if (!teacher) {
    return (
      <div className="inline-flex items-center gap-1.5">
        <button
          onClick={onOpenAuth}
          className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
        >
          Sign in
        </button>
        <button
          onClick={onOpenSignUp}
          className="rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Create account
        </button>
      </div>
    );
  }

  // ---- Signed-in: pill + dropdown. ----------------------------------------
  const displayName = profile?.name ?? teacher.email ?? 'Signed in';
  const initial = (displayName || '?').trim().charAt(0).toUpperCase();
  const syncLabel = syncing
    ? 'Syncing…'
    : lastError
      ? 'Sync error'
      : lastSyncAt
        ? `Synced ${relativeFromNow(lastSyncAt)}`
        : 'Not yet synced';
  const pillRing = lastError
    ? 'ring-rose-200 bg-rose-50 text-rose-700'
    : syncing
      ? 'ring-brand-200 bg-brand-50 text-brand-700'
      : 'ring-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${pillRing} hover:brightness-105`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate sm:inline">{displayName}</span>
        <span
          className={`h-2 w-2 rounded-full ${
            syncing
              ? 'animate-pulse bg-brand-500'
              : lastError
                ? 'bg-rose-500'
                : 'bg-emerald-500'
          }`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-72 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-200"
        >
          <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Signed in as
            </div>
            <div className="mt-0.5 text-sm font-semibold text-slate-900">
              {profile?.name ?? 'Teacher'}
            </div>
            <div className="text-xs text-slate-600">{teacher.email}</div>
            {profile?.school && (
              <div className="mt-0.5 text-xs text-slate-500">{profile.school}</div>
            )}
          </div>
          <div className="mt-3 space-y-1.5 rounded-xl bg-white p-1 text-xs">
            <Row label="Cloud" value="Connected" valueClass="text-emerald-700" />
            <Row
              label="Sync status"
              value={
                syncing
                  ? 'Syncing…'
                  : lastError
                    ? 'Sync failed'
                    : hasUnsyncedChanges()
                      ? 'Unsynced changes'
                      : syncLabel
              }
              valueClass={
                lastError
                  ? 'text-rose-700'
                  : hasUnsyncedChanges() && !syncing
                    ? 'text-amber-700'
                    : 'text-slate-700'
              }
            />
            <Row
              label="Last synced"
              value={lastSyncAt ? new Date(lastSyncAt).toLocaleString() : '—'}
              valueClass="text-slate-700"
            />
            {lastError && (
              <div className="rounded-lg bg-rose-50 p-2 text-[11px] text-rose-800 ring-1 ring-rose-200">
                {lastError}
              </div>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onSyncNow}
              disabled={syncing}
              className="flex-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
            >
              {syncing ? 'Syncing…' : 'Sync now'}
            </button>
            <button
              onClick={onSignOut}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className={`text-[11px] font-semibold ${valueClass ?? 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  );
}
