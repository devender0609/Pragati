import { useMemo } from 'react';
import { ITEMS } from '../data/items';
import {
  buildTeachingPlan,
  type TeachingPlan,
  type WeakSkill,
} from '../lib/teachingPlan';
import { loadSessions, loadStudents } from '../lib/storage';
import {
  SKILL_LABELS,
  type SkillId,
  type SkillMode,
} from '../types';
import { FlaggedBadge } from './common/FlaggedBadge';
import { SkillChip } from './common/SkillChip';

// Teaching Plan view (v0.8). Extracted from App.tsx in v0.13. Behavior
// unchanged — same buildTeachingPlan, same row layout, same prototype copy.
export function TeachingPlanView({
  onBack,
  onOpenStudent,
  onOpenLesson,
  onStartAssessment,
}: {
  onBack: () => void;
  onOpenStudent: (id: string) => void;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
}) {
  const plan = useMemo<TeachingPlan>(
    () => buildTeachingPlan(loadStudents(), loadSessions(), ITEMS),
    []
  );
  const itemById = useMemo(
    () => new Map(ITEMS.map((it) => [it.id, it])),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          ← Teacher dashboard
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-violet-50 via-white to-brand-50 p-6 ring-1 ring-violet-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-violet-700">
          Teacher planning
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Teaching plan
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Auto-generated from {plan.totalCompletedSessions} completed session
          {plan.totalCompletedSessions === 1 ? '' : 's'} across{' '}
          {plan.totalStudentsWithSessions} student
          {plan.totalStudentsWithSessions === 1 ? '' : 's'}. Each section is a
          starting point — review before acting.
        </p>
      </div>

      {plan.totalCompletedSessions === 0 && (
        <div className="card text-center">
          <p className="text-sm text-slate-600">
            No completed sessions yet. Once students take some sessions, the
            teaching plan will fill in.
          </p>
        </div>
      )}

      {plan.totalCompletedSessions > 0 && (
        <>
          <section className="card">
            <h2 className="h-section">Top weakest skills</h2>
            <p className="mt-1 text-sm text-slate-600">
              Skills with the lowest class-wide accuracy (and at least 3
              attempts to be confident the weakness is real).
            </p>
            {plan.weakestSkills.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No skill is weak enough to flag. Nice.
              </p>
            ) : (
              <ol className="mt-3 space-y-2">
                {plan.weakestSkills.map((w, i) => (
                  <WeakSkillRow
                    key={w.skillId}
                    rank={i + 1}
                    weak={w}
                    onOpenLesson={() => onOpenLesson(w.skillId)}
                    onStartAssessment={() => onStartAssessment(w.skillId)}
                  />
                ))}
              </ol>
            )}
          </section>

          <section className="card">
            <h2 className="h-section">Top misconceptions</h2>
            <p className="mt-1 text-sm text-slate-600">
              The most-common wrong-answer patterns across the class.
            </p>
            {plan.topMisconceptions.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No tagged misconceptions yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {plan.topMisconceptions.map((m) => (
                  <li
                    key={m.code}
                    className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
                  >
                    <div className="text-sm font-semibold text-slate-900">
                      {m.label}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {m.occurrences} occurrence
                      {m.occurrences === 1 ? '' : 's'} across{' '}
                      {m.studentsAffected} student
                      {m.studentsAffected === 1 ? '' : 's'} · seen on{' '}
                      {m.itemIds.length} item
                      {m.itemIds.length === 1 ? '' : 's'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2 className="h-section">Suggested small groups</h2>
            <p className="mt-1 text-sm text-slate-600">
              Students grouped by their personal weakest skill (in
              curriculum order).
            </p>
            {plan.suggestedGroups.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No groups of two or more students share a weak skill yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {plan.suggestedGroups.map((g) => (
                  <li
                    key={g.skillId}
                    className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <SkillChip mode={g.skillId} />
                      <span className="text-sm font-semibold text-slate-900">
                        {SKILL_LABELS[g.skillId]}
                      </span>
                      <span className="text-xs text-slate-500">
                        {g.studentNames.length} students
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {g.studentNames.join(', ')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {plan.reteachSkill && (
            <section className="card">
              <h2 className="h-section">Recommended reteach</h2>
              <p className="mt-1 text-sm text-slate-600">
                Start with the weakest skill in the class.
              </p>
              <div className="mt-3 rounded-xl bg-violet-50 p-4 ring-1 ring-violet-200">
                <div className="flex flex-wrap items-center gap-2">
                  <SkillChip mode={plan.reteachSkill} />
                  <span className="text-sm font-semibold text-slate-900">
                    {SKILL_LABELS[plan.reteachSkill]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => onOpenLesson(plan.reteachSkill!)}
                    className="btn-primary text-sm"
                  >
                    Open the {plan.reteachSkill} reteach lesson
                  </button>
                  <button
                    onClick={() => onStartAssessment(plan.reteachSkill!)}
                    className="btn-secondary text-sm"
                  >
                    Take a {plan.reteachSkill} assessment
                  </button>
                </div>
              </div>
            </section>
          )}

          {plan.recommendedPracticeItems.length > 0 && (
            <section className="card">
              <h2 className="h-section">Recommended practice items</h2>
              <p className="mt-1 text-sm text-slate-600">
                Hand-picked items from the lessons of the weakest skills.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {plan.recommendedPracticeItems.map((id) => {
                  const it = itemById.get(id);
                  return (
                    <li
                      key={id}
                      className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {id}
                        </span>
                        {it && <SkillChip mode={it.skillId} />}
                        {it && <span>diff. {it.difficulty}</span>}
                        <FlaggedBadge itemId={id} compact />
                      </div>
                      {it && (
                        <div className="mt-1 text-sm text-slate-700">
                          {it.stem}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {plan.studentsNeedingSupport.length > 0 && (
            <section className="card">
              <h2 className="h-section">Students needing support</h2>
              <p className="mt-1 text-sm text-slate-600">
                Each student is shown with the skills they're currently weak
                on. Click a name to open their detail page.
              </p>
              <ul className="mt-3 space-y-2">
                {plan.studentsNeedingSupport.map((s) => (
                  <li
                    key={s.studentId}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
                  >
                    <button
                      onClick={() => onOpenStudent(s.studentId)}
                      className="text-sm font-semibold text-slate-900 hover:underline"
                    >
                      {s.name} →
                    </button>
                    <div className="flex flex-wrap gap-1">
                      {s.weakSkills.map((skill) => (
                        <SkillChip key={skill} mode={skill} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <p className="text-xs text-slate-500">
        This plan is a prototype heuristic — useful as a starting point for a
        teacher conversation, not a calibrated diagnostic.
      </p>
    </div>
  );
}

function WeakSkillRow({
  rank,
  weak,
  onOpenLesson,
  onStartAssessment,
}: {
  rank: number;
  weak: WeakSkill;
  onOpenLesson: () => void;
  onStartAssessment: () => void;
}) {
  const accPct = Math.round(weak.accuracy * 100);
  return (
    <li className="rounded-xl bg-rose-50 p-4 ring-1 ring-rose-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
            {rank}
          </span>
          <SkillChip mode={weak.skillId} />
          <span className="text-sm font-semibold text-slate-900">
            {SKILL_LABELS[weak.skillId]}
          </span>
        </div>
        <span className="text-xs text-slate-600">
          {accPct}% across {weak.attempted} attempt
          {weak.attempted === 1 ? '' : 's'} · {weak.studentsAffected} student
          {weak.studentsAffected === 1 ? '' : 's'}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onOpenLesson} className="btn-primary text-xs">
          Open {weak.skillId} lesson
        </button>
        <button onClick={onStartAssessment} className="btn-secondary text-xs">
          Take {weak.skillId} assessment
        </button>
      </div>
    </li>
  );
}
