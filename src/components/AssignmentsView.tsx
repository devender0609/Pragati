import {
  deleteAssignment,
  endAssignment,
  loadAssignments,
} from '../lib/storage';
import { ASSIGNMENT_TARGET_LABELS } from '../types';
import { formatDate } from '../lib/format';
import { MetricCard } from './common/MetricCard';
import { SkillChip } from './common/SkillChip';
import { publishClassroomAssignmentsToCode } from '../lib/accessCodes';

// Assessment Assignments — list view (v0.11). Extracted from App.tsx in
// v0.13. Behavior unchanged: same sort, same end / delete confirmations,
// same MetricCard tiles.
export function AssignmentsView({
  onBack,
  onCreate,
  onEdit,
  onChanged,
}: {
  onBack: () => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onChanged: () => void;
}) {
  const assignments = loadAssignments().sort(
    (a, b) => b.createdAt - a.createdAt
  );
  const activeCount = assignments.filter((a) => a.active).length;

  const handleEnd = (id: string) => {
    const a = assignments.find((x) => x.id === id);
    endAssignment(id);
    if (a?.classroomId) void publishClassroomAssignmentsToCode(a.classroomId);
    onChanged();
  };

  const handleDelete = (id: string) => {
    const ok = window.confirm(
      'Delete this assignment from this device? Existing completed sessions will remain.'
    );
    if (!ok) return;
    const a = assignments.find((x) => x.id === id);
    deleteAssignment(id);
    if (a?.classroomId) void publishClassroomAssignmentsToCode(a.classroomId);
    onChanged();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            onClick={onBack}
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            ← Back to teacher home
          </button>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Assign assessments
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Create focused student-facing assessment cards. Assignments are
            stored on this device only and are not a formal testing roster.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          New assignment
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Total assignments"
          value={String(assignments.length)}
        />
        <MetricCard label="Active now" value={String(activeCount)} />
        <MetricCard
          label="Completed/closed"
          value={String(assignments.length - activeCount)}
        />
      </div>

      {assignments.length === 0 ? (
        <div className="card text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No assignments yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Create one to make the student home show a clear recommended
            assessment.
          </p>
          <button
            onClick={onCreate}
            className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Create assignment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <article key={a.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {a.title}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${a.active ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-slate-200'}`}
                    >
                      {a.active ? 'Active' : 'Closed'}
                    </span>
                    {a.pilotModeOn && (
                      <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-semibold text-pink-700 ring-1 ring-pink-200">
                        Pilot tagged
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <SkillChip mode={a.skillMode} />
                    <span>{a.itemCount} items</span>
                    <span>Created {formatDate(a.createdAt)}</span>
                  </div>
                  {a.target && (
                    <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
                      For {ASSIGNMENT_TARGET_LABELS[a.target.kind].toLowerCase()}
                      {a.target.kind !== 'class' && a.target.label
                        ? `: ${a.target.label}`
                        : ''}
                    </div>
                  )}
                  {a.teacherNote && (
                    <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
                      {a.teacherNote}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onEdit(a.id)}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  {a.active && (
                    <button
                      onClick={() => handleEnd(a.id)}
                      className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
