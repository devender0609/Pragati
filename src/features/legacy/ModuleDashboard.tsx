// v0.49 §12 — extracted from App.tsx.
//
// Behaviour is unchanged; only the file boundary moved. These are the
// LEGACY Class-6-shaped screens, still reachable from teacher preview
// and first-run compatibility paths. The canonical student journey is
// StudentRouteOutlet + StudentShell.

import { useMemo } from 'react';
import { ITEMS } from '../../data/items';
import { lessonFor } from '../../data/lessons';
import { computeSkillProgress, RECOMMENDED_ORDER, SKILL_STATUS_COLOR, SKILL_STATUS_LABELS, type SkillProgress, type SkillStatus } from '../../lib/progression';
import { STATIC_PREREQUISITES_BY_SKILL } from '../../lib/scoring';
import { loadSessions } from '../../lib/storage';
import {
  MODULE_FOR_SKILL,
  MODULE_LABELS,
  SKILLS_BY_MODULE,
  SKILL_IDS_ORDERED,
  SKILL_LABELS,
  type ModuleId,
  type SkillId,
  type SkillMode,
} from '../../types';
import { skillChipClass } from '../../components/common/SkillChip';

export function ModuleDashboard({
  moduleId,
  onOpenLesson,
  onStartAssessment,
  onBack,
}: {
  moduleId: ModuleId;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
  onBack: () => void;
}) {
  const skills = SKILLS_BY_MODULE[moduleId];
  const itemCount = ITEMS.filter((i) => MODULE_FOR_SKILL[i.skillId] === moduleId)
    .length;
  // Compute progression once so every SkillCard sees the same snapshot.
  const progress = useMemo(
    () => computeSkillProgress(loadSessions(), ITEMS),
    []
  );
  const focus = useMemo(() => {
    for (const s of skills) {
      if (progress[s].status !== 'strong') return s;
    }
    return null;
  }, [progress, skills]);
  const startedSkills = skills.filter(
    (s) => progress[s].status !== 'not_started'
  ).length;
  const strongSkills = skills.filter(
    (s) => progress[s].status === 'strong'
  ).length;

  const moduleMixedMode = `mixed_${moduleId}` as SkillMode;

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to Class 6 Math
        </button>
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 ring-1 ring-slate-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Class 6 · {MODULE_LABELS[moduleId]} module
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Learn and assess every {MODULE_LABELS[moduleId]} skill.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {skills.length} skills · {itemCount} items, with a short reteach
          lesson, a visual explanation, two worked examples, three
          common-mistake notes, and five practice questions for every skill.
          Pick a skill to study, or run a mixed-skills assessment.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => onStartAssessment(moduleMixedMode)}
            className="btn-primary"
          >
            Take the Mixed {MODULE_LABELS[moduleId]} Assessment
          </button>
          {focus !== null && (
            <button
              onClick={() => onOpenLesson(focus)}
              className="btn-secondary"
            >
              Continue with {focus}
            </button>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 ring-1 ring-slate-200">
            <span className="font-semibold text-slate-700">
              {strongSkills}/{skills.length}
            </span>
            <span>skills marked Strong on this device</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 ring-1 ring-slate-200">
            <span className="font-semibold text-slate-700">
              {startedSkills}/{skills.length}
            </span>
            <span>skills started</span>
          </span>
        </div>
      </div>

      <SkillProgressionStrip
        skills={skills}
        progress={progress}
        onOpenLesson={onOpenLesson}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((s) => (
          <SkillCard
            key={s}
            skillId={s}
            progress={progress[s]}
            onOpenLesson={onOpenLesson}
            onStartAssessment={onStartAssessment}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">Reminder</div>
        <p className="mt-1">
          The lessons here are content drafts for a prototype, not a published
          curriculum. They should be reviewed by a CBSE Class 6 math teacher
          before any real student sees them. Skill-status labels come from a
          rule-based heuristic on a small bank, not from a calibrated mastery
          study.
        </p>
      </div>
    </div>
  );
}

// Compact horizontal "recommended order" strip. Default shows every skill
// (RECOMMENDED_ORDER); a `skills` prop scopes it to one module's skills.
function SkillProgressionStrip({
  skills = RECOMMENDED_ORDER,
  progress,
  onOpenLesson,
}: {
  skills?: SkillId[];
  progress: Record<SkillId, SkillProgress>;
  onOpenLesson: (s: SkillId) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Recommended learning order
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Status pips are a prototype signal from session history on this device
        — not a calibrated mastery claim.
      </p>
      <ol className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 sm:gap-x-2">
        {skills.map((s, i) => {
          const p = progress[s];
          return (
            <li key={s} className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onOpenLesson(s)}
                className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ring-slate-200 hover:bg-slate-50"
                title={`${s} — status: ${SKILL_STATUS_LABELS[p.status]}`}
              >
                <span
                  className={`inline-flex h-2 w-2 flex-none rounded-full ${
                    p.status === 'strong'
                      ? 'bg-emerald-500'
                      : p.status === 'developing'
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                  {s}
                </span>
              </button>
              {i < skills.length - 1 && (
                <span className="text-slate-300">→</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// One row in the Fractions Module grid: a colourful card per skill, with
// item count, prereqs (if any), status pill + accuracy bar, a "Learn" CTA,
// and a quick-start assessment button. Locks (visual hint only — never
// gating) appear when prereqs haven't been started yet.
function SkillCard({
  skillId,
  progress,
  onOpenLesson,
  onStartAssessment,
}: {
  skillId: SkillId;
  progress: SkillProgress;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
}) {
  const itemCount = ITEMS.filter((i) => i.skillId === skillId).length;
  const prereqs = STATIC_PREREQUISITES_BY_SKILL[skillId] ?? [];
  const lesson = lessonFor(skillId);
  const accPct = Math.round(progress.accuracy * 100);
  return (
    <article className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${skillChipClass(skillId)}`}
            >
              {skillId}
            </span>
            <SkillStatusPill status={progress.status} />
          </div>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
            {SKILL_LABELS[skillId]}
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          {itemCount} item{itemCount === 1 ? '' : 's'}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {lesson.intro}
      </p>
      {progress.status !== 'not_started' && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Accuracy on this device · {progress.attempted} attempt
              {progress.attempted === 1 ? '' : 's'}
            </span>
            <span className="font-semibold text-slate-700">{accPct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                progress.status === 'strong' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.max(4, accPct)}%` }}
            />
          </div>
        </div>
      )}
      {prereqs.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Builds on:</span>
          {prereqs.map((p) => {
            const pCode = p.code;
            const isCurrSkill = (SKILL_IDS_ORDERED as string[]).includes(pCode);
            const remaining = progress.prereqsRemaining as readonly string[];
            const isRemaining = remaining.includes(pCode);
            return (
              <span
                key={pCode}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${
                  isCurrSkill && !isRemaining
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                    : 'bg-slate-100 ring-slate-200'
                }`}
                title={
                  isCurrSkill
                    ? isRemaining
                      ? `${pCode} not started yet`
                      : `${pCode} started`
                    : `${pCode} (outside this module)`
                }
              >
                {isCurrSkill && !isRemaining ? '✓' : isRemaining ? '○' : '·'} {pCode}
              </span>
            );
          })}
        </div>
      )}
      {!progress.unlocked && progress.prereqsRemaining.length > 0 && (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
          Tip: prerequisites not started yet ({progress.prereqsRemaining.join(', ')}). You can still open this skill — it just builds on those.
        </div>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <button
          onClick={() => onOpenLesson(skillId)}
          className="btn-primary text-sm"
        >
          Open Learn
        </button>
        <button
          onClick={() => onStartAssessment(skillId)}
          className="btn-secondary text-sm"
        >
          Start assessment
        </button>
      </div>
    </article>
  );
}

function SkillStatusPill({ status }: { status: SkillStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${SKILL_STATUS_COLOR[status]}`}
    >
      {SKILL_STATUS_LABELS[status]}
    </span>
  );
}

// ===========================================================================
// Learn view: per-skill reteach lesson + visual + practice + notes
// ===========================================================================


// (Field extracted to src/components/common/Field.tsx in v0.14.)

// (Visual / FractionBarSVG / AreaGridSVG extracted to
//  src/components/common/VisualRenderer.tsx in v0.13.)

// ===========================================================================
// Assessment
// ===========================================================================


// ===========================================================================
// Teacher: list of students with filters + export
