// v0.46 Checkpoint 3 — Chapter landing page (reference implementation).
//
// The polished per-chapter overview Milestone 3 asks for. Uses the
// Class 6 Fractions chapter as the reference chapter because it's
// the only module with full hand-authored lessons.
//
// Layout:
//   - Header block with chapter identity, grade badge, and a single
//     large "Continue learning" primary CTA.
//   - "What you will learn" — human-readable list of skills.
//   - Concept map — skills as chips, coloured by status.
//   - Learning journey grid: Learn · Practice · Chapter check.
//   - Progress ring.
//
// The component is grade-aware via the ageStage tokens: on early
// primary the header illustration and copy are larger; on secondary
// they compress to a denser layout.

import { useMemo } from 'react';
import { ITEMS } from '../data/items';
import { computeSkillProgress } from '../lib/progression';
import { loadSessions } from '../lib/storage';
import {
  MODULE_LABELS,
  MODULE_DESCRIPTIONS,
  SKILLS_BY_MODULE,
  SKILL_LABELS,
  MODULE_GRADE,
  type ModuleId,
  type SkillId,
} from '../types';
import { GradeBadge, skillChipClass } from './common/SkillChip';
import { tokensForGrade } from '../design/ageStage';
import { SEMANTIC, TYPE, BUTTON } from '../design/tokens';
import { GRADE_COLORS } from './common/gradePalette';

export function ChapterLandingPage({
  moduleId,
  onStartLearn,
  onStartPractice,
  onStartAssessment,
  studentId,
  onBack,
}: {
  moduleId: ModuleId;
  /** Open the LearnView for a specific skill (usually first not-strong). */
  onStartLearn: (skillId: SkillId) => void;
  /** Start an untimed practice run over the module. */
  onStartPractice: () => void;
  /** Start the module's chapter-check assessment. Pass `null` when the
   *  chapter has no executable blueprint — the card is then replaced by
   *  a truthful "not ready yet" note rather than silently launching a
   *  different kind of session under the Chapter check label. */
  onStartAssessment: (() => void) | null;
  /** v0.49 §5 — when supplied, the progress ring and "next skill" pick
   *  are computed from THIS student's sessions only. Omitted in the
   *  teacher preview, which intentionally shows device-wide data. */
  studentId?: string;
  onBack: () => void;
}) {
  const grade = MODULE_GRADE[moduleId];
  const stage = tokensForGrade(grade);
  const skills = SKILLS_BY_MODULE[moduleId];
  const gradeColor = GRADE_COLORS[grade];
  const label = MODULE_LABELS[moduleId];
  const description = MODULE_DESCRIPTIONS[moduleId];

  // Roll up per-skill progress from all locally stored sessions.
  const progress = useMemo(() => {
    const all = loadSessions();
    const scoped = studentId
      ? all.filter((s) => s.studentId === studentId)
      : all;
    return computeSkillProgress(scoped, ITEMS);
  }, [studentId]);

  const startedCount = skills.filter(
    (s) => progress[s].status !== 'not_started'
  ).length;
  const strongCount = skills.filter((s) => progress[s].status === 'strong').length;
  const journeyPct = Math.round((strongCount / skills.length) * 100);

  // Pick the "next skill to learn" — first not-yet-strong.
  const nextSkill = skills.find((s) => progress[s].status !== 'strong') ?? skills[0];

  const itemCount = ITEMS.filter((it) => skills.includes(it.skillId as SkillId))
    .length;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className={`text-sm font-medium ${SEMANTIC.neutral.textMuted} hover:text-slate-700`}
      >
        ← Back to chapters
      </button>

      {/* HEADER — chapter identity + primary CTA. */}
      <header
        className={`overflow-hidden rounded-3xl ${gradeColor.header} p-5 shadow-card ring-1 ring-slate-200 sm:p-8`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <GradeBadge moduleId={moduleId} />
          <div className="text-xs font-semibold text-slate-600">
            {itemCount} practice item{itemCount === 1 ? '' : 's'} ·{' '}
            {skills.length} skill{skills.length === 1 ? '' : 's'}
          </div>
        </div>
        <h1
          className={`mt-3 ${stage.h1} ${gradeColor.text} leading-tight`}
        >
          {label}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
          {description}
        </p>

        {/* Progress ring + primary CTA */}
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <ProgressRing value={journeyPct} accent={gradeColor.accent} />
          <div className="flex-1 min-w-[200px]">
            <div className={TYPE.eyebrow}>Your journey</div>
            <div className="mt-0.5 text-sm text-slate-700">
              {strongCount} of {skills.length} skills strong ·{' '}
              {startedCount} started
            </div>
          </div>
          <button
            onClick={() => onStartLearn(nextSkill)}
            className={BUTTON.primary}
          >
            {startedCount === 0
              ? 'Start learning →'
              : 'Continue learning →'}
          </button>
        </div>
      </header>

      {/* WHAT YOU WILL LEARN */}
      <section>
        <h2 className={`${TYPE.h2} text-slate-900`}>What you will learn</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {skills.map((s) => {
            const p = progress[s];
            const isStrong = p.status === 'strong';
            return (
              <li
                key={s}
                className="flex items-center gap-2 rounded-lg bg-white p-3 ring-1 ring-slate-200"
              >
                <span
                  aria-hidden="true"
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                    isStrong
                      ? `${SEMANTIC.success.bg} text-white`
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isStrong ? '✓' : ''}
                </span>
                <span className="text-sm text-slate-900">
                  {SKILL_LABELS[s] ?? s}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* CONCEPT MAP — skills chips coloured by status */}
      <section>
        <h2 className={`${TYPE.h2} text-slate-900`}>Concept map</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${skillChipClass(s)}`}
              title={SKILL_LABELS[s] ?? s}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* LEARNING JOURNEY — 3 large action cards */}
      <section>
        <h2 className={`${TYPE.h2} text-slate-900`}>Learning journey</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <JourneyCard
            title="Learn"
            body="Concept, worked examples, and common mistakes for each skill."
            onClick={() => onStartLearn(nextSkill)}
            primary
          />
          <JourneyCard
            title="Practice"
            body="Short practice run drawn across the whole chapter."
            onClick={onStartPractice}
          />
          {onStartAssessment ? (
            <JourneyCard
              title="Chapter check"
              body="A check across every skill in this chapter. No hints."
              onClick={onStartAssessment}
            />
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-sm font-semibold text-slate-700">
                Chapter check
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Not ready for this chapter yet. Practice is available now.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// --- Small primitives used only by this file ----------------------------

function ProgressRing({
  value,
  accent,
}: {
  value: number;
  accent: string;
}) {
  // Fixed 64x64 SVG ring; matches the header row height.
  const size = 64;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  // accent is a Tailwind bg-* class — we use fill via matching text-* proxy.
  // For SVG stroke, translate bg-*-500 → text-*-500 → CSS via className.
  const strokeClass = accent.replace('bg-', 'text-');
  return (
    <div className="relative inline-block" aria-label={`${value}% complete`}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="text-slate-200"
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={strokeClass}
          stroke="currentColor"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
        {value}%
      </div>
    </div>
  );
}

function JourneyCard({
  title,
  body,
  onClick,
  primary = false,
}: {
  title: string;
  body: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex h-full flex-col items-start rounded-2xl p-4 text-left shadow-card ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
        primary
          ? `${SEMANTIC.primary.tintBg} ${SEMANTIC.primary.tintRing}`
          : 'bg-white'
      }`}
    >
      <h3 className="text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h3>
      <p className="mt-1.5 flex-1 text-sm text-slate-600">{body}</p>
      <span
        className={`mt-3 text-xs font-semibold ${
          primary ? SEMANTIC.primary.text : 'text-brand-700'
        } group-hover:underline`}
      >
        Open →
      </span>
    </button>
  );
}
