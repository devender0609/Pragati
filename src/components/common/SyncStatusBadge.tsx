// v0.17: small pill that surfaces sync state in the nav bar.
//
//   - "Local demo mode" when Firebase is not configured
//   - "Sign in to sync" when Firebase is configured but no teacher is signed in
//   - "Synced 2m ago" + "Sync now" button when configured and signed in
//   - "Syncing…" while a sync is in flight
//   - "Sync error" with the message when the last sync failed

import { useEffect, useState } from 'react';
import {
  firebaseStatusReason,
  isFirebaseEnabled,
  subscribeToAuth,
  type TeacherUser,
} from '../../lib/firebase';
import { lastSyncedAt, syncAll, type SyncResult } from '../../lib/sync';

type Status =
  | { kind: 'local_only'; reason: string }
  | { kind: 'signed_out' }
  | { kind: 'idle'; lastAt: number | null; lastError: string | null }
  | { kind: 'syncing' };

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
      msg: `${r.errors.length} row(s) failed to sync`,
      isError: true,
    };
  }
  const { pushed, pulled } = r.totals;
  return { msg: `Synced ${pushed + pulled} record(s)`, isError: false };
}

export function SyncStatusBadge({
  onOpenSignIn,
}: {
  onOpenSignIn?: () => void;
}) {
  const fbEnabled = isFirebaseEnabled();
  const localReason = firebaseStatusReason();
  const [teacher, setTeacher] = useState<TeacherUser | null>(null);
  const [status, setStatus] = useState<Status>(() => {
    if (!fbEnabled) {
      return { kind: 'local_only', reason: localReason ?? 'Local demo mode' };
    }
    return { kind: 'signed_out' };
  });
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (!fbEnabled) return;
    const unsub = subscribeToAuth((u) => {
      setTeacher(u);
      if (u) {
        setStatus({ kind: 'idle', lastAt: lastSyncedAt(), lastError });
      } else {
        setStatus({ kind: 'signed_out' });
      }
    });
    return () => unsub();
    // lastError intentionally not in deps — we don't want auth resub on errors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fbEnabled]);

  // Refresh the relative timestamp every 30s.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const onSyncNow = async () => {
    setStatus({ kind: 'syncing' });
    const r = await syncAll();
    const summary = summarizeResult(r);
    setLastError(summary.isError ? summary.msg : null);
    setStatus({
      kind: 'idle',
      lastAt: lastSyncedAt(),
      lastError: summary.isError ? summary.msg : null,
    });
  };

  // --- Render -------------------------------------------------------------

  if (status.kind === 'local_only') {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
        title={`Local demo mode — ${status.reason}`}
      >
        <span className="h-2 w-2 rounded-full bg-slate-400" />
        Local demo mode
      </span>
    );
  }

  if (status.kind === 'signed_out') {
    return (
      <button
        onClick={onOpenSignIn}
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
      >
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        Sign in to sync
      </button>
    );
  }

  if (status.kind === 'syncing') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
        <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
        Syncing…
      </span>
    );
  }

  // idle
  const lastAt = status.lastAt;
  const errored = status.lastError;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        errored
          ? 'bg-rose-50 text-rose-700 ring-rose-200'
          : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      }`}
      title={
        errored
          ? `Last sync error: ${errored}`
          : teacher?.email ?? 'Signed in'
      }
    >
      <span
        className={`h-2 w-2 rounded-full ${
          errored ? 'bg-rose-500' : 'bg-emerald-500'
        }`}
      />
      {errored
        ? 'Sync error'
        : lastAt
          ? `Synced ${relativeFromNow(lastAt)}`
          : 'Not yet synced'}
      <button
        onClick={onSyncNow}
        className="ml-1 rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200 hover:bg-white"
      >
        Sync now
      </button>
    </span>
  );
}
