import { useMemo, useState } from 'react';
import { ITEMS, type Item } from '../data/items';
import {
  lessonFor,
  type CommonMistake,
  type Lesson,
  type WorkedExample,
} from '../data/lessons';
import {
  computeSkillProgress,
  type SkillStatus,
} from '../lib/progression';
import { STATIC_PREREQUISITES_BY_SKILL } from '../lib/scoring';
import { loadSessions } from '../lib/storage';
import {
  SKILL_IDS_ORDERED,
  SKILL_LABELS,
  type SkillId,
  type SkillMode,
} from '../types';
import { skillChipClass } from './common/SkillChip';
import { VisualRenderer } from './common/VisualRenderer';
import { MathText } from './common/MathText';
import type { ReactNode } from 'react';
import { Band, Zone, type ZoneTone } from '../design/Composition';

// Per-skill Learn page — reteach + visual + worked examples + common
// mistakes + practice. Extracted from App.tsx in v0.14. Behavior unchanged.
/**
 * v0.76 §8 — A LESSON STAGE.
 *
 * The v0.75 lesson was 2,900px of stacked white cards on grey: eleven
 * identical rectangles, no way to tell from the shape of the page which
 * part was the explanation and which was the practice. §8 asks for the
 * five stages to be visually distinct, and the honest reading of that is
 * that the stage must be a REGION with its own colour, not a card with a
 * different heading.
 *
 * The stages keep their order and all of their content stays in the DOM.
 * That is deliberate: hiding four stages behind tabs would make the
 * lesson feel shorter without making it shorter, and a student who wants
 * to re-read the worked example while answering question three should
 * not have to navigate to do it.
 */
function LessonStage({
  n,
  name,
  title,
  detail,
  meta,
  tone,
  children,
}: {
  n: number;
  name: string;
  title: string;
  detail?: string;
  meta?: string;
  tone: ZoneTone;
  children: ReactNode;
}) {
  return (
    <Zone tone={tone} className="scroll-mt-20 p-5 sm:p-7 lg:p-9" lattice={tone !== 'paper'}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div className="flex items-baseline gap-3">
          <span className="num font-display text-sm font-extrabold text-saffron-500">
            {n}
          </span>
          <span className="text-sm font-semibold text-ink-400">{name}</span>
        </div>
        {meta ? <span className="text-xs text-ink-400">{meta}</span> : null}
      </div>
      <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
        {title}
      </h2>
      {detail ? (
        <p className="mt-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink-500">
          {detail}
        </p>
      ) : null}
      <div className="mt-5">{children}</div>
    </Zone>
  );
}

export function LearnView({
  skill,
  onBack,
  onStartAssessment,
  onOpenLesson,
  studentId,
  backLabel,
}: {
  skill: SkillId;
  onBack: () => void;
  onStartAssessment: (mode: SkillMode) => void;
  onOpenLesson: (s: SkillId) => void;
  /** v0.49 §5 — scope the progress badge to one student. Omitted in
   *  the teacher preview, which shows device-wide progress on purpose. */
  studentId?: string;
  /** v0.49 §1 — the lesson now opens from any chapter, so the back
   *  label is supplied by the caller instead of being hard-coded to
   *  "Fractions Module". */
  backLabel?: string;
}) {
  // v0.34 → v0.35 — lessonFor() always returns a Lesson now.
  // Hand-authored lessons (LESSONS[skill]) are used when present;
  // starter skills without one get a synthesised lesson from the item
  // bank via synthesizeLesson() in lessonFor(). No skill hits the
  // "unavailable" fallback anymore.
  const lesson: Lesson = lessonFor(skill);
  const itemById = useMemo(
    () => new Map(ITEMS.map((it) => [it.id, it])),
    []
  );
  const practiceItems = lesson.practice
    .map((id) => itemById.get(id))
    .filter((it): it is Item => Boolean(it));
  const prereqs = STATIC_PREREQUISITES_BY_SKILL[skill] ?? [];
  const idx = SKILL_IDS_ORDERED.indexOf(skill);
  const prevSkill = idx > 0 ? SKILL_IDS_ORDERED[idx - 1] : null;
  const nextSkill =
    idx >= 0 && idx < SKILL_IDS_ORDERED.length - 1
      ? SKILL_IDS_ORDERED[idx + 1]
      : null;
  const progress = useMemo(() => {
    const all = loadSessions();
    const scoped = studentId
      ? all.filter((s) => s.studentId === studentId)
      : all;
    return computeSkillProgress(scoped, ITEMS)[skill];
  }, [skill, studentId]);

  return (
    // v0.76 §8 — a lesson is a reading surface, and at 1440 the app
    // container is 1344px wide. Prose set across 1344px is roughly 160
    // characters a line, which is unreadable for an eleven-year-old and
    // unreadable for anyone else. The lesson takes its own, narrower
    // measure; the zones inside it still bleed to that measure's edges,
    // so the staging reads as bands rather than as a narrow column.
    <div className="mx-auto max-w-[68rem] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          ← {backLabel ?? 'Back'}
        </button>
        <div className="flex flex-wrap gap-2 text-xs">
          {prevSkill && (
            <button
              onClick={() => onOpenLesson(prevSkill)}
              className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              ← {prevSkill}
            </button>
          )}
          {nextSkill && (
            <button
              onClick={() => onOpenLesson(nextSkill)}
              className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {nextSkill} →
            </button>
          )}
        </div>
      </div>

      {/* v0.76 §8 — the lesson header is a field, not a card. */}
      <Band tone="ink">
        <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${skillChipClass(skill)}`}
          >
            {skill}
          </span>
          <SkillStatusPill status={progress.status} />
          <span className="text-xs text-white/55">
            Learn · five stages, in order
          </span>
        </div>
        <h1 className="mt-4 max-w-[22ch] font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
          {SKILL_LABELS[skill]}
        </h1>
        <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-white/75">
          {lesson.intro}
        </p>
        {prereqs.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/70">
            <span className="font-medium text-white/80">
              Recommended prerequisites:
            </span>
            {prereqs.map((p) => (
              <button
                key={p.code}
                onClick={() => {
                  if ((SKILL_IDS_ORDERED as string[]).includes(p.code)) {
                    onOpenLesson(p.code as SkillId);
                  }
                }}
                disabled={!(SKILL_IDS_ORDERED as string[]).includes(p.code)}
                className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-white/85 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {p.code} — {p.name}
              </button>
            ))}
          </div>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={() => onStartAssessment(skill)}
            className="tap inline-flex items-center rounded-full bg-white px-7 text-base font-bold text-ink-900 shadow-lg transition hover:bg-saffron-100"
          >
            Start a {skill} assessment
          </button>
          <button
            onClick={() => onStartAssessment('mixed')}
            className="tap inline-flex items-center rounded-full bg-white/10 px-6 text-base font-semibold text-white transition hover:bg-white/20"
          >
            Take the Mixed assessment
          </button>
        </div>
        </div>
      </Band>

      <LessonStage n={1} name="Learn the idea" tone="paper" title={lesson.reteach.title}>
        <ol className="mt-3 space-y-2 text-sm text-slate-700">
          {lesson.reteach.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </LessonStage>

      <LessonStage
        n={2}
        name="See it"
        tone="learn"
        title="The same idea, drawn"
        detail={lesson.visualExplanation.caption}
      >
        <div className="mt-3">
          <VisualRenderer visual={lesson.visualExplanation.visual} />
        </div>
        <ol className="mt-4 space-y-2 text-sm text-slate-700">
          {lesson.visualExplanation.readingSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </LessonStage>

      <LessonStage
        n={3}
        name="Worked examples"
        tone="paper"
        title="Worked examples"
        detail="Each example walks through the steps to write down."
        meta={`${lesson.workedExamples.length} fully worked`}
      >
        <div className="mt-4 space-y-4">
          {lesson.workedExamples.map((ex, i) => (
            <WorkedExampleCard key={i} index={i + 1} example={ex} />
          ))}
        </div>
      </LessonStage>

      <LessonStage
        n={4}
        name="Common mistakes"
        tone="attention"
        title="Common mistakes"
        detail="Each row names the mistake, why it happens, and how to fix it."
      >
        <div className="mt-4 space-y-3">
          {lesson.commonMistakes.map((m, i) => (
            <CommonMistakeCard key={i} mistake={m} />
          ))}
        </div>
      </LessonStage>

      <LessonStage
        n={5}
        name="Try it"
        tone="practice"
        title="Practice questions"
        detail="Work through these before opening a full assessment. Solutions are one tap away."
        meta={`${practiceItems.length} items, easy to hard`}
      >
        <ol className="mt-4 space-y-3">
          {practiceItems.map((it, i) => (
            <PracticeItem key={it.id} index={i + 1} item={it} />
          ))}
        </ol>
      </LessonStage>

      {/* §8 — the teacher and parent notes are not addressed to the
          student and were sitting at the end of the student's lesson in
          full. They stay on the page, folded. */}
      <details className="group rounded-3xl bg-paper-200/70 p-5 sm:p-6">
        <summary className="tap cursor-pointer font-display font-bold text-ink-700">
          Notes for a teacher or parent
        </summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
        <NoteCard
          tone="teacher"
          label="For the teacher"
          body={lesson.teacherNote}
        />
        <NoteCard
          tone="parent"
          label="For the parent / home"
          body={lesson.parentNote}
        />
        </div>
      </details>

      <p className="text-center text-xs text-slate-500">
        Lesson content is a prototype draft. Review with a CBSE Class 6 math
        teacher before classroom use.
      </p>
    </div>
  );
}

function SkillStatusPill({ status }: { status: SkillStatus }) {
  const labels: Record<SkillStatus, string> = {
    not_started: 'Not started',
    developing: 'Developing',
    strong: 'Strong',
  };
  const tone: Record<SkillStatus, string> = {
    not_started: 'bg-slate-100 text-slate-600 ring-slate-200',
    developing: 'bg-amber-50 text-amber-700 ring-amber-200',
    strong: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${tone[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function WorkedExampleCard({
  index,
  example,
}: {
  index: number;
  example: WorkedExample;
}) {
  return (
    <article className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Worked example {index}
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        {example.problem}
      </p>
      <ol className="mt-3 space-y-2 text-sm text-slate-700">
        {example.steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex items-baseline gap-2 text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Answer
        </span>
        <span className="text-base font-bold text-slate-900">
          {example.answer}
        </span>
      </div>
    </article>
  );
}

function CommonMistakeCard({ mistake }: { mistake: CommonMistake }) {
  return (
    <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
        {mistake.pattern}
      </div>
      <p className="mt-1 text-sm font-medium text-rose-900">
        Looks like:{' '}
        <span className="font-normal italic">{mistake.example}</span>
      </p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Why students do this
          </dt>
          <dd className="mt-1 text-sm text-slate-700">{mistake.why}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            How to fix it
          </dt>
          <dd className="mt-1 text-sm text-slate-700">{mistake.fix}</dd>
        </div>
      </dl>
    </article>
  );
}

function PracticeItem({ index, item }: { index: number; item: Item }) {
  const [open, setOpen] = useState(false);
  const correctAnswerLabel =
    item.kind === 'mcq'
      ? `${String.fromCharCode(65 + item.correctIndex)} — ${item.options[item.correctIndex].text}`
      : item.acceptedAnswers[0];
  return (
    <li className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Q{index} · {item.id} · diff. {item.difficulty}
          </div>
          <MathText as="div" className="text-sm text-slate-900">
            {item.stem}
          </MathText>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          {open ? 'Hide solution' : 'Show solution'}
        </button>
      </div>
      {item.visual && (
        <div className="mt-3">
          <VisualRenderer visual={item.visual} />
        </div>
      )}
      {item.kind === 'mcq' && (
        <ol className="mt-3 grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2">
          {item.options.map((o, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200"
            >
              <span className="font-semibold text-slate-500">
                {String.fromCharCode(65 + i)}.
              </span>
              <span>{o.text}</span>
            </li>
          ))}
        </ol>
      )}
      {item.kind === 'numeric' && (
        <div className="mt-3 text-xs text-slate-500">
          Numeric entry · {item.inputHint}
        </div>
      )}
      {open && (
        <div className="mt-3 rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Correct answer
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            {correctAnswerLabel}
          </div>
          <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Worked solution
          </div>
          <MathText as="p" className="mt-1 text-sm text-slate-700">
            {item.solution}
          </MathText>
        </div>
      )}
    </li>
  );
}

function NoteCard({
  tone,
  label,
  body,
}: {
  tone: 'teacher' | 'parent';
  label: string;
  body: string;
}) {
  const ring =
    tone === 'teacher'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : 'border-violet-200 bg-violet-50 text-violet-900';
  return (
    <div className={`rounded-2xl border p-5 ${ring}`}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </div>
      <p className="mt-2 text-sm">{body}</p>
    </div>
  );
}
