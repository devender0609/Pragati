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
import { TeacherEmptyState, TeacherPageHeader, TeacherPanel } from '../../design/TeacherKit';
import { Card } from '../../design/primitives/Card';
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
      {/* v0.78 §9 — the all-caps "INSIGHTS" eyebrow above the heading is
          the template tell the student product removed in v0.76 and the
          teacher rail already answers. The heading states the SCOPE,
          which is the thing a teacher can get wrong: when nothing is
          selected it reads "All local data", never "class". */}
      <TeacherPageHeader
        title="Insights"
        detail={
          scoped.isDeviceWide
            ? 'Every completed session stored on this device, across all classes and grades. Pick a class to narrow it.'
            : `${summary.distinctStudents} student${summary.distinctStudents === 1 ? '' : 's'} with completed sessions in this class.`
        }
        scope={scoped.isDeviceWide ? 'All local data' : scoped.scopeLabel}
      />

      <Card>
        <label className="font-display text-sm font-bold text-ink-900">
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
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
        <TeacherEmptyState
          title={
            scoped.isDeviceWide
              ? 'No sessions completed yet'
              : 'No sessions in this class yet'
          }
          /* v0.78 §19 — an empty analytical dashboard tells a teacher
             nothing and offers nothing. This says what Insights will
             show once there is evidence, and gives the action that
             produces it. Note what it does NOT promise: no mastery, no
             growth, no proficiency. Pragati records what students did;
             it does not measure what they are. */
          detail="Insights show what students have worked on, which assignments were completed, who has been active, and where responses suggest taking a closer look. Assign some practice and this fills in from what they actually do."
          actions={[
            { label: 'Assign practice', onClick: onOpenAssign, primary: true },
          ]}
        />
        {/* The empty state says what will appear; this says what it will
            NOT. Both matter, and the second is the one a teacher is
            likely to assume wrongly — Pragati records what students did
            and does not measure what they are. */}
        <TeacherPanel title="What Insights will not show" tone="attention">
          <ul className="space-y-2.5 text-sm leading-relaxed text-ink-500">
            <li>
              <span className="font-semibold text-ink-700">No mastery or ability score.</span>{' '}
              Pragati records what a student did. Turning counts of correct
              answers into a measure of what they know needs a calibrated
              instrument, which is the Growth track and is not this.
            </li>
            <li>
              <span className="font-semibold text-ink-700">No class-level growth.</span>{' '}
              Growth is change measured on a stable scale over time. Nothing
              here establishes one.
            </li>
            <li>
              <span className="font-semibold text-ink-700">No diagnosis from a single wrong answer.</span>{' '}
              Where a response pattern points at a specific misconception the
              item was written to detect, it is named. Otherwise it is
              reported as a response, not a cause.
            </li>
          </ul>
        </TeacherPanel>
        </div>
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
