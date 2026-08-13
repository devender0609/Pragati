// v0.17: Classroom management.
//
// Local-first roster UI. Each classroom is a {name, notes, studentIds[],
// archived} bag stored in localStorage and pushed to Firestore via the sync
// layer when a teacher is signed in. Students are pulled from the existing
// localStorage student list — no new entity types.

import { useEffect, useMemo, useState } from 'react';
import {
  deleteClassroom,
  loadClassrooms,
  saveClassroom,
} from '../lib/classroomStore';
import type { Classroom } from '../lib/cloudStore';
import { currentTeacher, isFirebaseEnabled } from '../lib/firebase';
import { generateId, loadStudents } from '../lib/storage';
import { pullClassrooms } from '../lib/sync';
import { formatDate } from '../lib/format';
import {
  assignAccessCodeToClassroom,
  classifyCode,
  DEFAULT_CODE_TTL_MS,
  generateAccessCode,
  generateLocalAccessCodeForClassroom,
  revokeAccessCode,
  setAccessCodeExpiry,
} from '../lib/accessCodes';
import { SubmissionsImportPanel } from './common/SubmissionsImportPanel';
import { buildClassroomSummary } from '../lib/classroomSummary';
import { loadAssignments, loadSessions } from '../lib/storage';
import { ITEMS } from '../data/items';
import { SKILL_SHORT_LABELS } from '../types';

export function ClassroomsView({ onBack }: { onBack: () => void }) {
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => loadClassrooms());
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((n) => n + 1);

  // Pull from cloud on mount if we're signed in. Cloud wins on collision.
  useEffect(() => {
    let active = true;
    (async () => {
      const res = await pullClassrooms();
      if (!active) return;
      if (res.kind === 'ok' && res.pulled > 0) {
        setClassrooms(loadClassrooms());
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Reload list whenever something changes.
  useEffect(() => {
    setClassrooms(loadClassrooms());
  }, [version]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const editing = useMemo(
    () => (editingId ? classrooms.find((c) => c.id === editingId) ?? null : null),
    [classrooms, editingId]
  );

  const onSave = (c: Classroom) => {
    saveClassroom(c);
    bump();
    setEditingId(null);
    setCreating(false);
  };

  const onDelete = (id: string) => {
    if (!window.confirm('Delete this classroom? Students themselves are not deleted; only the classroom grouping.')) return;
    deleteClassroom(id);
    bump();
    setEditingId(null);
  };

  const teacher = currentTeacher();
  const fbEnabled = isFirebaseEnabled();

  // -- Render -------------------------------------------------------------

  if (creating || editing) {
    return (
      <ClassroomForm
        existing={editing}
        onCancel={() => {
          setEditingId(null);
          setCreating(false);
        }}
        onSave={onSave}
      />
    );
  }

  const active = classrooms.filter((c) => !c.archived);
  const archived = classrooms.filter((c) => c.archived);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to teacher home
        </button>
        <button
          onClick={() => setCreating(true)}
          className="rounded-xl bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          + New classroom
        </button>
      </div>

      <header className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Teacher · Classroom management
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Your classrooms
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          A lightweight roster grouping. Group your students into classrooms so
          you can assign assessments to a whole class at once.
          {fbEnabled
            ? teacher
              ? ' Synced to your Firebase project.'
              : ' Sign in to sync these classrooms across devices.'
            : ' Running in local-only mode — classrooms stay on this device.'}
        </p>
      </header>

      {/* v0.21: full submissions-import panel above the classroom list. */}
      <SubmissionsImportPanel onImported={bump} />

      {active.length === 0 && archived.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          <div className="text-base font-semibold text-slate-800">
            No classrooms yet
          </div>
          <p className="mx-auto mt-1 max-w-md">
            Use the “+ New classroom” button to create your first classroom.
            Students are pulled from your existing roster on this device — you
            don't need to re-enter them.
          </p>
        </div>
      )}

      {active.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Active ({active.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {active.map((c) => (
              <ClassroomCard
                key={c.id}
                classroom={c}
                onEdit={() => setEditingId(c.id)}
                onArchive={() => {
                  saveClassroom({ ...c, archived: true, updatedAt: Date.now() });
                  bump();
                }}
                onDelete={() => onDelete(c.id)}
                onCodeChanged={bump}
              />
            ))}
          </div>
        </section>
      )}

      {archived.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Archived ({archived.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {archived.map((c) => (
              <ClassroomCard
                key={c.id}
                classroom={c}
                onEdit={() => setEditingId(c.id)}
                onUnarchive={() => {
                  saveClassroom({ ...c, archived: false, updatedAt: Date.now() });
                  bump();
                }}
                onDelete={() => onDelete(c.id)}
                onCodeChanged={bump}
                muted
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ClassroomCard
// ---------------------------------------------------------------------------

function ClassroomCard({
  classroom,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  onCodeChanged,
  muted,
}: {
  classroom: Classroom;
  onEdit: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  onDelete: () => void;
  onCodeChanged?: () => void;
  muted?: boolean;
}) {
  const fbEnabled = isFirebaseEnabled();
  const teacher = currentTeacher();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const onGenerateCode = async () => {
    if (busy) return;
    // v0.21: confirm before regenerating an existing code, since students
    // with the old code will silently lose access.
    if (
      classroom.accessCode &&
      !window.confirm(
        `Regenerate the code for "${classroom.name}"? The old code (${classroom.accessCode}) will stop working and any students using it will need the new one.`
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      if (fbEnabled && teacher) {
        const code = generateAccessCode();
        await assignAccessCodeToClassroom(classroom, code);
      } else {
        generateLocalAccessCodeForClassroom(classroom.id);
      }
      onCodeChanged?.();
    } finally {
      setBusy(false);
    }
  };

  const onCopyCode = async () => {
    if (!classroom.accessCode) return;
    try {
      await navigator.clipboard.writeText(classroom.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may not be available */
    }
  };

  const onRevoke = async () => {
    if (!classroom.accessCode) return;
    if (
      !window.confirm(
        `Revoke the code ${classroom.accessCode} for "${classroom.name}"? This is reversible (you can generate a new code), but students currently using the old code will be locked out immediately.`
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await revokeAccessCode(classroom.accessCode);
      onCodeChanged?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
        muted ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-base font-semibold text-slate-900">
            {classroom.name || '(Untitled classroom)'}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            {classroom.studentIds.length} student
            {classroom.studentIds.length === 1 ? '' : 's'} · updated{' '}
            {formatDate(classroom.updatedAt)}
          </div>
        </div>
        <button
          onClick={onEdit}
          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          Edit
        </button>
      </div>
      {classroom.notes && (
        <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-slate-600">
          {classroom.notes}
        </p>
      )}

      {/* v0.19: access code block */}
      <div className="mt-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Student access code
          </div>
          {!classroom.accessCode && (
            <button
              onClick={onGenerateCode}
              disabled={busy}
              className="rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
            >
              {busy ? 'Generating…' : 'Generate code'}
            </button>
          )}
        </div>
        {classroom.accessCode ? (
          <>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <code className="rounded-lg bg-white px-2.5 py-1 font-mono text-sm font-bold tracking-wider text-brand-700 ring-1 ring-brand-200">
                {classroom.accessCode}
              </code>
              <button
                onClick={onCopyCode}
                className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={onGenerateCode}
                disabled={busy}
                className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-50"
              >
                Regenerate
              </button>
              <button
                onClick={onRevoke}
                disabled={busy}
                className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 disabled:opacity-50"
              >
                Revoke
              </button>
            </div>
            {/* v0.23: explicit warning when the code is revoked. */}
            {classifyCode(classroom) === 'revoked' && (
              <div
                role="alert"
                className="mt-2 rounded-lg border border-rose-300 bg-rose-50 p-2 text-[11px] font-medium text-rose-900"
              >
                This classroom code is revoked. Regenerate a code before
                publishing assignments — students with the old code cannot
                join, and assignment edits will not republish to the cloud.
              </div>
            )}
            {/* v0.21: metadata strip — created, status, expiry, # published assignments. */}
            <AccessCodeMeta classroom={classroom} onChanged={onCodeChanged} />
          </>
        ) : (
          <p className="mt-1 text-[11px] text-slate-500">
            Share this code with students so they can join the classroom from the
            student home and see assigned work.
          </p>
        )}
      </div>

      {/* v0.19: classroom progress (collapsible) */}
      <ClassroomProgressPanel classroom={classroom} />

      <div className="mt-3 flex flex-wrap gap-2">
        {onArchive && (
          <button
            onClick={onArchive}
            className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
          >
            Archive
          </button>
        )}
        {onUnarchive && (
          <button
            onClick={onUnarchive}
            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"
          >
            Unarchive
          </button>
        )}
        <button
          onClick={onDelete}
          className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// v0.19: classroom progress panel
// ---------------------------------------------------------------------------

function ClassroomProgressPanel({ classroom }: { classroom: Classroom }) {
  const [open, setOpen] = useState(false);

  // v0.20: surface how many imported submissions belong to this classroom
  // (rough count: sessions whose studentId is in this classroom roster +
  // were imported via cloud submission). Cheap to compute on-demand.
  const importedCount = useMemo(() => {
    const ids = new Set(classroom.studentIds);
    return loadSessions().filter(
      (s) => ids.has(s.studentId) && s.completedAt !== null
    ).length;
  }, [classroom]);

  const summary = useMemo(() => {
    if (!open) return null;
    return buildClassroomSummary({
      classroom,
      students: loadStudents(),
      sessions: loadSessions(),
      assignments: loadAssignments(),
      items: ITEMS,
    });
  }, [open, classroom]);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-xl bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
        aria-expanded={open}
      >
        {open ? '▾' : '▸'} Classroom progress · {importedCount} session{importedCount === 1 ? '' : 's'} on file (prototype signal — teacher review required)
      </button>
      {open && summary && (
        <div className="mt-2 space-y-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <Metric label="Roster" value={`${summary.rosterSize}`} />
            <Metric label="Sessions" value={`${summary.completedSessions}`} subtext={`${summary.completedAssignments} from assignments`} />
            <Metric label="Avg accuracy" value={`${Math.round(summary.averageAccuracy * 100)}%`} />
            <Metric label="Needs support" value={`${summary.studentsNeedingSupport.length}`} subtext="< 50% accuracy" />
          </div>

          <Section title="Weakest skills">
            {summary.weakestSkills.length === 0 ? (
              <Empty>Not enough attempts in this classroom.</Empty>
            ) : (
              <ul className="space-y-1">
                {summary.weakestSkills.map((s) => (
                  <li key={s.skillId} className="flex items-baseline justify-between text-xs">
                    <span className="font-medium text-slate-800">{SKILL_SHORT_LABELS[s.skillId]}</span>
                    <span className="font-semibold text-rose-700">
                      {Math.round(s.accuracy * 100)}% <span className="text-slate-500">({s.attempted})</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Top misconceptions">
            {summary.topMisconceptions.length === 0 ? (
              <Empty>None tagged yet.</Empty>
            ) : (
              <ul className="space-y-1">
                {summary.topMisconceptions.map((m) => (
                  <li key={m.code} className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-800">{m.label}</span>
                    <span className="font-semibold text-amber-700">×{m.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Students needing support">
            {summary.studentsNeedingSupport.length === 0 ? (
              <Empty>No students below 50% accuracy in this classroom — nice.</Empty>
            ) : (
              <ul className="space-y-1">
                {summary.studentsNeedingSupport.slice(0, 5).map((s) => (
                  <li key={s.studentId} className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-800">{s.studentName}</span>
                    <span className="font-semibold text-rose-700">
                      {Math.round(s.accuracy * 100)}% <span className="text-slate-500">({s.sessions} session{s.sessions === 1 ? '' : 's'})</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Recent activity">
            {summary.recentSessions.length === 0 ? (
              <Empty>No sessions yet in this classroom.</Empty>
            ) : (
              <ul className="space-y-1">
                {summary.recentSessions.map((s) => (
                  <li key={s.sessionId} className="flex items-baseline justify-between text-xs">
                    <span className="font-medium text-slate-800">{s.studentName}</span>
                    <span className="text-slate-500">
                      {Math.round(s.accuracy * 100)}% · {new Date(s.completedAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Class trend (last 4 weeks)">
            <ul className="flex items-end justify-between gap-1">
              {summary.trend.map((b, i) => {
                const pct = Math.round(b.accuracy * 100);
                const height = Math.max(4, pct);
                return (
                  <li key={i} className="flex flex-col items-center text-[10px] text-slate-500" title={`${b.sessions} sessions`}>
                    <div className="w-6 rounded-t bg-brand-500" style={{ height: `${height}%` }} />
                    <span className="mt-1">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </Section>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-900">
            Pre-pilot signal only — not a calibrated metric. Teacher review required before any decision.
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 text-lg font-bold text-slate-900">{value}</div>
      {subtext && <div className="text-[10px] text-slate-500">{subtext}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] italic text-slate-500">{children}</div>;
}

// v0.21/v0.22: metadata strip under an access code. Shows created date,
// active/expired/revoked status (computed by classifyCode), the optional
// expiry date with relative time, and the number of active assignments
// published for this classroom. v0.22 also adds an inline expiry editor
// (+7 days / +30 days / pick date / never).
function AccessCodeMeta({
  classroom,
  onChanged,
}: {
  classroom: Classroom;
  onChanged?: () => void;
}) {
  const publishedCount = useMemo(
    () =>
      loadAssignments().filter(
        (a) => a.active && a.classroomId === classroom.id
      ).length,
    [classroom.id]
  );
  const status = classifyCode(classroom);
  const createdLabel = formatDate(classroom.createdAt);
  const expiresAt = classroom.accessCodeExpiresAt;
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const extendBy = async (ms: number) => {
    if (busy) return;
    setBusy(true);
    try {
      const base =
        typeof expiresAt === 'number' && expiresAt > Date.now()
          ? expiresAt
          : Date.now();
      await setAccessCodeExpiry(classroom.id, base + ms);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };
  const setNoExpiry = async () => {
    if (
      !window.confirm(
        `Remove the expiry on the code for "${classroom.name}"? The code will be valid until you revoke it manually.`
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await setAccessCodeExpiry(classroom.id, null);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };
  const setCustomExpiry = async (input: string) => {
    if (!input) return;
    const ts = new Date(input + 'T23:59:59').getTime();
    if (!Number.isFinite(ts)) return;
    setBusy(true);
    try {
      await setAccessCodeExpiry(classroom.id, ts);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
        <StatusTag status={status} />
        <span>Created {createdLabel}</span>
        <span>·</span>
        <span>
          {publishedCount} active assignment{publishedCount === 1 ? '' : 's'} published
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
        <span className="font-semibold uppercase tracking-wide text-slate-500">Expiry</span>
        <span>{expiryLabel(expiresAt)}</span>
        <button
          onClick={() => setEditing((e) => !e)}
          className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
        >
          {editing ? 'Done' : 'Change'}
        </button>
      </div>
      {editing && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-white p-2 text-[10px] ring-1 ring-slate-200">
          <button
            onClick={() => extendBy(7 * 24 * 60 * 60 * 1000)}
            disabled={busy}
            className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            +7 days
          </button>
          <button
            onClick={() => extendBy(DEFAULT_CODE_TTL_MS)}
            disabled={busy}
            className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            +30 days
          </button>
          <label className="inline-flex items-center gap-1">
            <span className="text-slate-500">Set to:</span>
            <input
              type="date"
              onChange={(e) => setCustomExpiry(e.target.value)}
              disabled={busy}
              className="rounded border border-slate-300 px-1 py-0.5 text-[10px]"
            />
          </label>
          <button
            onClick={setNoExpiry}
            disabled={busy}
            className="rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100 disabled:opacity-50"
          >
            Never expire
          </button>
        </div>
      )}
    </div>
  );
}

function expiryLabel(ts?: number): string {
  if (typeof ts !== 'number') return 'never (valid until revoked)';
  const now = Date.now();
  const delta = ts - now;
  const dateStr = new Date(ts).toLocaleDateString();
  if (delta < 0) {
    const days = Math.round(-delta / (24 * 60 * 60 * 1000));
    return `expired ${days}d ago (${dateStr})`;
  }
  const days = Math.round(delta / (24 * 60 * 60 * 1000));
  return days <= 1
    ? `expires in <1 day (${dateStr})`
    : `expires in ${days} day${days === 1 ? '' : 's'} (${dateStr})`;
}

function StatusTag({ status }: { status: 'active' | 'expired' | 'revoked' | 'none' }) {
  if (status === 'active') return <Tag tone="emerald">Active</Tag>;
  if (status === 'expired') return <Tag tone="amber">Expired</Tag>;
  if (status === 'revoked') return <Tag tone="rose">Revoked</Tag>;
  return <Tag tone="slate">No code</Tag>;
}

function Tag({
  tone,
  children,
}: {
  tone: 'emerald' | 'rose' | 'slate' | 'amber';
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    rose: 'bg-rose-100 text-rose-800 ring-rose-200',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    amber: 'bg-amber-100 text-amber-800 ring-amber-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

// (v0.20 ImportSubmissionsButton replaced by the shared
// SubmissionsImportPanel in v0.21 — see ./common/SubmissionsImportPanel.tsx.)

// ---------------------------------------------------------------------------
// ClassroomForm — create / edit
// ---------------------------------------------------------------------------

function ClassroomForm({
  existing,
  onCancel,
  onSave,
}: {
  existing: Classroom | null;
  onCancel: () => void;
  onSave: (c: Classroom) => void;
}) {
  const teacher = currentTeacher();
  const [name, setName] = useState(existing?.name ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    () => existing?.studentIds ?? []
  );

  const allStudents = useMemo(() => {
    const s = loadStudents();
    return [...s].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const now = Date.now();
    const c: Classroom = existing
      ? {
          ...existing,
          name: trimmedName,
          notes: notes.trim(),
          studentIds: selectedStudentIds,
          updatedAt: now,
        }
      : {
          id: generateId(),
          teacherUid: teacher?.uid ?? 'local-demo',
          name: trimmedName,
          notes: notes.trim(),
          studentIds: selectedStudentIds,
          archived: false,
          createdAt: now,
          updatedAt: now,
        };
    onSave(c);
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Cancel
        </button>
      </div>
      <header className="space-y-1">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Classroom
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {existing ? 'Edit classroom' : 'Create classroom'}
        </h1>
      </header>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm">
          <span className="font-medium text-slate-800">Classroom name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., 6A morning"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-800">Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything that's helpful — section, room, focus, etc."
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-slate-900">Roster</div>
            <p className="text-xs text-slate-500">
              Tick the students who belong to this classroom. Students come from
              your existing on-device roster.
            </p>
          </div>
          <div className="text-xs font-medium text-slate-500">
            {selectedStudentIds.length} selected
          </div>
        </div>

        {allStudents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No students on this device yet. Start an assessment for a new
            student to create their record, then come back to add them.
          </div>
        ) : (
          <ul className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
            {allStudents.map((s) => {
              const checked = selectedStudentIds.includes(s.id);
              return (
                <li key={s.id}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleStudent(s.id)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="font-medium text-slate-800">{s.name}</span>
                    <span className="text-xs text-slate-500">
                      · {s.grade}
                      {s.school ? ` · ${s.school}` : ''}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          {existing ? 'Save changes' : 'Create classroom'}
        </button>
      </div>
    </form>
  );
}
