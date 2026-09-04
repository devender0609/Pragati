// v0.21: Teacher-facing visibility for the cloud submission import flow.
//
// Surfaces the most recent ImportSummary + per-code breakdown, plus a
// manual "Import now" button. Used from the Teacher workflow home and the
// Classrooms view. Local-demo mode renders a quiet explanatory state.

import { useState } from 'react';
import { currentTeacher, isFirebaseEnabled } from '../../lib/firebase';
import {
  importStudentSubmissions,
  loadTeacherImportStatus,
  type ImportSummary,
} from '../../lib/accessCodes';

export function SubmissionsImportPanel({
  onImported,
  compact = false,
}: {
  onImported?: () => void;
  compact?: boolean;
}) {
  const fbEnabled = isFirebaseEnabled();
  const teacher = currentTeacher();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(() => loadTeacherImportStatus());
  const [lastSummary, setLastSummary] = useState<ImportSummary | null>(
    () => status?.lastSummary ?? null
  );
  const disabled = !fbEnabled || !teacher || busy;

  const onClick = async () => {
    if (disabled) return;
    setBusy(true);
    try {
      const summary = await importStudentSubmissions();
      setStatus(loadTeacherImportStatus());
      setLastSummary(summary);
      onImported?.();
    } finally {
      setBusy(false);
    }
  };

  if (!fbEnabled) {
    return (
      <section className={panelClass(compact)}>
        <PanelHeading compact={compact}>Student submissions</PanelHeading>
        <p className="mt-1 text-xs text-slate-600">
          Local demo mode — nothing to import. Set up Firebase to receive
          submissions from students who joined via a classroom code.
        </p>
      </section>
    );
  }

  if (!teacher) {
    return (
      <section className={panelClass(compact)}>
        <PanelHeading compact={compact}>Student submissions</PanelHeading>
        <p className="mt-1 text-xs text-slate-600">
          Sign in to import student submissions from your classroom codes.
        </p>
      </section>
    );
  }

  return (
    <section className={panelClass(compact)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <PanelHeading compact={compact}>Student submissions</PanelHeading>
          <p className="mt-1 text-xs text-slate-600">
            Pull submissions from every classroom code you own and merge new
            sessions into your local store. Duplicates by session id are
            skipped; local records are never deleted.
          </p>
        </div>
        <button
          onClick={onClick}
          disabled={disabled}
          className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
        >
          {busy ? 'Importing…' : 'Import submissions now'}
        </button>
      </div>

      {status && lastSummary ? (
        <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <Stat label="Imported" value={lastSummary.imported} tone="emerald" />
            <Stat label="Duplicates skipped" value={lastSummary.skippedDuplicates} tone="slate" />
            <Stat label="Conflicts" value={lastSummary.conflicts} tone="amber" />
            <Stat label="Errors" value={lastSummary.errors} tone={lastSummary.errors > 0 ? 'rose' : 'slate'} />
          </div>
          <div className="text-[10px] text-slate-500">
            Last imported {new Date(status.lastImportedAt).toLocaleString()}
          </div>

          {lastSummary.perCode.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-1 pr-2">Classroom code</th>
                    <th className="py-1 pr-2">Imported</th>
                    <th className="py-1 pr-2">Skipped</th>
                    <th className="py-1 pr-2">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lastSummary.perCode.map((row) => (
                    <tr key={row.code}>
                      <td className="py-1 pr-2 font-mono font-semibold text-slate-700">{row.code}</td>
                      <td className="py-1 pr-2">{row.imported}</td>
                      <td className="py-1 pr-2">{row.skipped}</td>
                      <td className="py-1 pr-2">{row.errors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs italic text-slate-500">
          No imports yet. Click "Import submissions now" after at least one
          student has finished a classroom-bound assignment.
        </p>
      )}
    </section>
  );
}

function panelClass(compact: boolean): string {
  return compact
    ? 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
    : 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6';
}

function PanelHeading({ children, compact }: { children: React.ReactNode; compact: boolean }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
        Student submissions import
      </div>
      <h3 className={compact ? 'mt-0.5 text-sm font-semibold text-slate-900' : 'mt-1 text-lg font-bold text-slate-900'}>
        {children}
      </h3>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'emerald' | 'slate' | 'amber' | 'rose';
}) {
  const tones: Record<string, string> = {
    emerald: 'text-emerald-700',
    slate: 'text-slate-700',
    amber: 'text-amber-700',
    rose: 'text-rose-700',
  };
  return (
    <div className="rounded-lg bg-white p-2 ring-1 ring-slate-200">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-0.5 text-lg font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
