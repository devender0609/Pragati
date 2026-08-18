// v0.49 §8 — Teacher Insights tab body, classroom-aware.
//
// v0.48 aggregated every completed session on the device and called
// the result a "Class-level view". It now defaults to the currently
// selected classroom, and when no classroom is selected it says
// "All local data" in the heading rather than implying a class.
//
// All filtering lives in the pure selector (`teacherInsights.ts`);
// this component only picks a scope and renders.

import { useMemo, useState } from 'react';
import { loadSessions, loadStudents } from '../../lib/storage';
import { loadClassrooms } from '../../lib/classroomStore';
import { ITEMS } from '../../data/items';
import { summarizeMisconceptions } from '../../lib/scoring';
import { PageHeader } from '../../design/primitives/PageHeader';
import { Card } from '../../design/primitives/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { scopeSessions, summarizeScopedSessions } from './teacherInsights';

const ITEM_SKILL = new Map(ITEMS.map((i) => [i.id, i.skillId as string]));
const itemSkillOf = (id: string) => ITEM_SKILL.get(id) ?? null;

export function TeacherInsightsBody({
  onOpenAssign,
  selectedClassroomId = null,
  onSelectClassroom,
}: {
  onOpenAssign: () => void;
  /** The classroom the teacher is currently working in. Insights
   *  defaults to it. */
  selectedClassroomId?: string | null;
  onSelectClassroom?: (id: string | null) => void;
}) {
  const classrooms = useMemo(() => loadClassrooms().filter((c) => !c.archived), []);
  const [classroomId, setClassroomId] = useState<string | null>(
    selectedClassroomId
  );

  const pick = (id: string | null) => {
    setClassroomId(id);
    onSelectClassroom?.(id);
  };

  const scoped = useMemo(
    () =>
      scopeSessions({
        sessions: loadSessions(),
        classrooms: loadClassrooms(),
        students: loadStudents(),
        scope: { classroomId },
      }),
    [classroomId]
  );

  const summary = useMemo(
    () => summarizeScopedSessions(scoped.sessions, itemSkillOf),
    [scoped.sessions]
  );

  const misconceptions = useMemo(
    () =>
      summarizeMisconceptions(scoped.sessions.flatMap((s) => s.responses)).slice(
        0,
        3
      ),
    [scoped.sessions]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Insights"
        // The heading states the scope. When nothing is selected it
        // reads "All local data" — never "class".
        title={scoped.isDeviceWide ? 'All local data' : scoped.scopeLabel}
        subtitle={
          scoped.isDeviceWide
            ? 'Every completed session stored on this device, across all classes and grades. Pick a class to narrow it.'
            : `${summary.distinctStudents} student${summary.distinctStudents === 1 ? '' : 's'} with completed sessions in this class.`
        }
      />

      <Card>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Class
        </label>
        <div className="mt-1 flex flex-wrap gap-1">
          <button
            onClick={() => pick(null)}
            aria-pressed={classroomId === null}
            className={`min-h-[44px] rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
              classroomId === null
                ? 'bg-brand-50 text-brand-700 ring-brand-200'
                : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            All local data
          </button>
          {classrooms.map((c) => (
            <button
              key={c.id}
              onClick={() => pick(c.id)}
              aria-pressed={classroomId === c.id}
              className={`min-h-[44px] rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
                classroomId === c.id
                  ? 'bg-brand-50 text-brand-700 ring-brand-200'
                  : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        {classrooms.length === 0 && (
          <p className="mt-2 text-xs text-slate-500">
            No classrooms on this device yet. Create one under Classes to
            scope these numbers to a class.
          </p>
        )}
      </Card>

      {summary.totalSessions === 0 ? (
        <EmptyState
          title={
            scoped.isDeviceWide
              ? 'No sessions completed yet'
              : 'No sessions in this class yet'
          }
          message="Once students complete a session, insights appear here."
          actionLabel="Create assignment"
          onAction={onOpenAssign}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Completed sessions
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {summary.totalSessions}
              </div>
            </Card>
            <Card>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Overall accuracy
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {Math.round(summary.overallAccuracy * 100)}%
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Across {summary.totalAnswered} answers.
              </p>
            </Card>
            <Card>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Top misconceptions
              </div>
              {misconceptions.length === 0 ? (
                <div className="mt-2 text-sm text-slate-600">
                  Nothing to flag.
                </div>
              ) : (
                <ul className="mt-2 space-y-1 text-sm">
                  {misconceptions.map((m) => (
                    <li key={m.code} className="flex justify-between gap-2">
                      <span>{m.code}</span>
                      <span className="text-slate-500">{m.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900">
              Weakest skills
            </h3>
            {summary.weakest.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">
                Not enough attempts on any single skill yet (minimum 3
                attempts each).
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-100 text-sm">
                {summary.weakest.map((w) => (
                  <li
                    key={w.skill}
                    className="flex flex-wrap justify-between gap-2 py-2"
                  >
                    <span>{w.skill}</span>
                    <span className="text-slate-500">
                      {Math.round(w.accuracy * 100)}% correct across{' '}
                      {w.attempted} attempts
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
