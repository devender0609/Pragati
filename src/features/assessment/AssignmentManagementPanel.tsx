// v0.60 §14 + §15 — Assignment management and participation.
//
// v0.59 could create an assignment and then showed the teacher nothing.
// A formal assessment a teacher cannot see, monitor, or cancel is not
// administrable — and "who has not started yet" is the single most
// useful thing during a testing window.
//
// PARTICIPATION IS NOT PERFORMANCE. This panel reports started /
// in progress / completed / not started. It reports no responses, no
// correctness, and no score, because a field test produces none.

import { Card } from '../../design/primitives/Card';
import { PageHeader } from '../../design/primitives/PageHeader';
import { SecondaryButton } from '../../design/primitives/SecondaryButton';
import { GROWTH_WINDOW_LABELS } from './growthSession';
import { assignmentStatusAt, type FormalGrowthAssignment } from './formalAssignmentStore';
import type { FormalSessionState } from './formalSessionRunner';

export type ParticipationRow = {
  studentId: string;
  studentName: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  itemsAnswered: number;
  totalItems: number;
};

/**
 * Build participation from the frozen roster, not from sessions.
 *
 * Deriving it from sessions would omit exactly the students who matter
 * most — the ones who have not started.
 */
export function participationFor(
  assignment: FormalGrowthAssignment,
  sessions: FormalSessionState[],
  nameOf: (studentId: string) => string
): ParticipationRow[] {
  const total = assignment.form.itemIdsInOrder.length;
  return assignment.assignedStudentIds.map((studentId) => {
    const s = sessions.find(
      (x) => x.studentId === studentId && x.assignmentId === assignment.assignmentId
    );
    const status: ParticipationRow['status'] = !s
      ? 'not_started'
      : s.status === 'completed'
        ? 'completed'
        : s.status === 'abandoned'
          ? 'abandoned'
          : 'in_progress';
    return {
      studentId,
      studentName: nameOf(studentId),
      status,
      itemsAnswered: s?.responses.length ?? 0,
      totalItems: total,
    };
  });
}

const STATUS_LABEL: Record<ParticipationRow['status'], string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Finished',
  abandoned: 'Stopped early',
};

export function AssignmentManagementPanel({
  assignments,
  sessionsFor,
  nameOf,
  classroomNameOf,
  onCancel,
  now,
}: {
  assignments: FormalGrowthAssignment[];
  sessionsFor: (assignmentId: string) => FormalSessionState[];
  nameOf: (studentId: string) => string;
  classroomNameOf: (classroomId: string) => string;
  onCancel: (assignmentId: string) => void;
  now: number;
}) {
  if (assignments.length === 0) {
    return (
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">
          No Growth Checks assigned
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Assigned Growth Checks will appear here, with who has started and who
          has finished.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Assigned"
        title="Growth Checks"
        subtitle="Participation only. A field test produces no scores or results."
      />
      {assignments.map((a) => {
        const rows = participationFor(a, sessionsFor(a.assignmentId), nameOf);
        const status = assignmentStatusAt(a, now);
        const done = rows.filter((r) => r.status === 'completed').length;
        const started = rows.filter((r) => r.status !== 'not_started').length;
        return (
          <Card key={a.assignmentId}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">
                  {classroomNameOf(a.classroomId)} ·{' '}
                  {GROWTH_WINDOW_LABELS[a.window]}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {new Date(a.opensAt).toLocaleDateString()} –{' '}
                  {new Date(a.closesAt).toLocaleDateString()} ·{' '}
                  {a.form.itemIdsInOrder.length} questions
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {status === 'active'
                  ? 'Open now'
                  : status === 'scheduled'
                    ? 'Not open yet'
                    : status === 'expired'
                      ? 'Closed'
                      : 'Cancelled'}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-700">
              {started} of {rows.length} started · {done} finished
            </p>

            <ul className="mt-2 divide-y divide-slate-100">
              {rows.map((r) => (
                <li
                  key={r.studentId}
                  className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
                >
                  <span className="text-slate-800">{r.studentName}</span>
                  <span className="text-slate-500">
                    {STATUS_LABEL[r.status]}
                    {r.status === 'in_progress' &&
                      ` · ${r.itemsAnswered} of ${r.totalItems} answered`}
                  </span>
                </li>
              ))}
            </ul>

            {status !== 'cancelled' && status !== 'expired' && (
              <div className="mt-3">
                <SecondaryButton onClick={() => onCancel(a.assignmentId)}>
                  Cancel this Growth Check
                </SecondaryButton>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
