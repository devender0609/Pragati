import { useMemo, useState } from 'react';
import { StudioCanvas } from '../design/Studio';
import {
  ITEMS,
  MISCONCEPTION_LABELS,
  type Item,
  type VisualSpec,
} from '../data/items';
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
// v0.77.1 §5/§6 — THE STANDARD STAGE MODEL.
//
// v0.77 gave "Common mistakes" a stage of its own, which put a page of
// errors between the worked examples and the student's first attempt.
// That is the wrong place pedagogically: a misconception teaches when it
// is adjacent to the thing it corrupts, not when it is a chapter in its
// own right. It also meant a student met three ways to be wrong before
// being invited to be right once.
//
// The authored content is not deleted — §6. It moves to where it
// teaches:
//
//   procedure misconceptions  → inside Worked examples, as "Watch out
//                               for", directly under the steps they
//                               corrupt;
//   response misconceptions   → Try it feedback, which already selects
//                               the authored misconception matching the
//                               distractor the student actually chose;
//   concept misconceptions    → Think deeper, where one is handed back to
//                               the student as a reasoning task.
//
// This is the reusable model for current-curriculum chapters.
const LESSON_STAGES = [
  'Learn the idea',
  'See it',
  'Worked examples',
  'Try it',
  'Think deeper',
] as const;

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
  audience = 'student',
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
  /**
   * v0.77 §11 — who is reading this.
   *
   * The first attempt inferred it from `studentId`, and the production
   * capture caught the flaw immediately: App's legacy `view === 'learn'`
   * route renders this component for a student WITHOUT a studentId, so
   * "FR.02" and "Reteach:" appeared on a real student screen while the
   * unit test passed. Audience is now explicit and defaults to the
   * student, so a new call site cannot leak internal identifiers by
   * forgetting a prop — it has to ask for them.
   */
  audience?: 'student' | 'teacher';
}) {
  // §8 — five stages, one visible. "Common mistakes" keeps its authored
  // name in the content; the rail shows the student-facing sequence.
  const [stage, setStage] = useState(0);

  // v0.77 §10/§11 — WHOSE LANGUAGE IS THIS SCREEN IN?
  //
  // LearnView serves two audiences from one component: a student opening
  // an activity, and a teacher previewing it from Resources. The teacher
  // preview omits `studentId`, which is the only signal available, and it
  // is the right one — a teacher SHOULD see "FR.02" and "Reteach:",
  // because those identify the artifact they are reviewing.
  //
  // A Class 6 student should see neither. "Reteach" is our word for what
  // the lesson is FOR; "FR.02" is our filing system. Neither is a
  // mathematical claim, so presenting them differently changes no
  // content: the artifact keeps its identity and its provenance, and
  // only the visible title changes.
  const isStudent = audience === 'student';
  const displayTitle = (t: string) =>
    isStudent ? t.replace(/^\s*Reteach:\s*/i, '') : t;

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
  // §7 — derived from the authored spec, never chosen here.
  const studioFraction = fractionFromVisual(lesson.visualExplanation.visual);

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
    // v0.77.2 §5 — the lesson band clears the sticky masthead by design
    // rather than by a few pixels. The masthead is ~70px and
    // translucent; a band that starts under it reads as a rendering
    // fault even when the controls are reachable. This is the smallest
    // gap that looks deliberate at every width without a dead strip.
    <div className="mx-auto max-w-[68rem] space-y-6 pt-6 sm:pt-8">
      {/* v0.77.1 §10 — Back was a grey link floating on paper above the
          ink band, which left a pale empty strip across the top of every
          lesson at 1440 and made the control look like page furniture
          rather than lesson navigation. It now sits inside the field, as
          the first thing in the lesson. */}
      {/* v0.76 §8 — the lesson header is a field, not a card. */}
      <Band tone="ink">
        <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="tap inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white/10 px-4 text-sm font-semibold text-white/85 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          ← {backLabel ?? 'Back'}
        </button>
        <div className="flex flex-wrap gap-2 text-xs">
          {!isStudent && prevSkill && (
            <button
              onClick={() => onOpenLesson(prevSkill)}
              className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              ← {prevSkill}
            </button>
          )}
          {!isStudent && nextSkill && (
            <button
              onClick={() => onOpenLesson(nextSkill)}
              className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {nextSkill} →
            </button>
          )}
        </div>
      </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {!isStudent && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${skillChipClass(skill)}`}
            >
              {skill}
            </span>
          )}
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
                {isStudent ? p.name : `${p.code} — ${p.name}`}
              </button>
            ))}
          </div>
        )}
        {/* v0.77.1 §1/§2 — WHAT THIS BUTTON ACTUALLY LAUNCHES.
            Both actions called `onStartAssessment`, and the second was
            labelled "Take the Mixed assessment". Audited: `mixed` runs the
            ordinary adaptive item picker across skills — the same runner
            the Practice tab uses. It is practice. Calling it an
            assessment made a lesson page look like a test page, and it
            blurs the line with Pragati Growth, which is a governed
            instrument and is not this.

            The student hero now carries ONE action. The lesson already
            has a Try it stage; three parallel entry points at the top of
            a lesson is a menu, not an orientation. Mixed practice is not
            removed — it lives in the Practice tab, which is where a
            student goes for a set that spans skills.

            A teacher previewing the artifact still sees both, in the
            technical wording, because they are choosing what to assign. */}
        <div className="mt-7 flex flex-wrap gap-3">
          {/* v0.77.2 §6 — ONE PRACTICE MODEL PER LESSON.
              Audited: this launched the adaptive picker for the same
              skill the lesson teaches — the same questions the Try it
              stage now walks the student through, one at a time with
              feedback. Two doors to one room, and the hero's door was
              the worse one: a bare item run with no teaching around it.
              For a student the hero now points at the stage. The
              cross-skill set still exists and still lives in Practice.
              A teacher keeps the direct assessment launch, because
              assigning is their job. */}
          <button
            onClick={() => (isStudent ? setStage(3) : onStartAssessment(skill))}
            className="tap inline-flex items-center rounded-full bg-white px-7 text-base font-bold text-ink-900 shadow-lg transition hover:bg-saffron-100"
          >
            {isStudent ? 'Go to Try it' : `Start a ${skill} assessment`}
          </button>
          {!isStudent && (
            <button
              onClick={() => onStartAssessment('mixed')}
              className="tap inline-flex items-center rounded-full bg-white/10 px-6 text-base font-semibold text-white transition hover:bg-white/20"
            >
              Take the Mixed assessment
            </button>
          )}
        </div>
        </div>
      </Band>

      {/* v0.77 §8 — STAGED, NOT SCROLLED.
          The five stages were already authored. v0.76 stacked all five on
          one 4,500px page, which is organised rather than staged. They are
          now selected from a rail of BUTTONS — every stage is one tap from
          every other, so this is not the next-only wizard §8 forbids, and
          a student can leave for the chapter at any point via Back. */}
      <nav
        aria-label="Lesson stages"
        className="-mx-3 flex gap-2 overflow-x-auto px-3 py-1 sm:mx-0 sm:px-0"
      >
        {LESSON_STAGES.map((name, i) => {
          const on = i === stage;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setStage(i)}
              aria-current={on ? 'step' : undefined}
              className={`tap flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                on
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-500 hover:bg-paper-200 hover:text-ink-900'
              }`}
            >
              <span
                className={`num grid h-5 w-5 place-items-center rounded-full text-[0.7rem] ${
                  on ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-500'
                }`}
              >
                {i + 1}
              </span>
              {name}
            </button>
          );
        })}
      </nav>

      {stage === 0 && (
      <LessonStage n={1} name="Learn the idea" tone="paper" title={displayTitle(lesson.reteach.title)}>
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
      )}

      {stage === 1 && (
      <LessonStage
        n={2}
        name="See it"
        tone="learn"
        title="The same idea, drawn"
        detail={lesson.visualExplanation.caption}
      >
        {/* §7/§8 — PRESENTATION, NOT CONTENT.
            The authored visual is a fraction bar: 3 of 5. That number is
            read OUT of the authored spec, never chosen here, so the
            mathematics on screen is exactly the mathematics the lesson
            was written with — the renderer got richer, the claim did
            not. Where a lesson's visual is not a fraction (a grid with
            no fractional reading, say) the authored renderer still runs,
            because inventing a strip for it would be a new claim. */}
        <div className="mt-4">
          {studioFraction ? (
            <StudioPanel n={studioFraction.n} d={studioFraction.d} interactive />
          ) : (
            <VisualRenderer visual={lesson.visualExplanation.visual} />
          )}
        </div>
        <ol className="mt-5 space-y-2 text-sm text-slate-700">
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
      )}

      {stage === 2 && (
      <LessonStage
        n={3}
        name="Worked examples"
        tone="paper"
        title="Worked examples"
        detail="Each example walks through the steps to write down."
        meta={`${lesson.workedExamples.length} fully worked`}
      >
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="space-y-4">
          {lesson.workedExamples.map((ex, i) => (
            <WorkedExampleCard key={i} index={i + 1} example={ex} />
          ))}
        </div>
        {/* §3/§4 — the guidance is SUPPORTING material, so it takes a
            supporting column rather than the full width of the steps.
            At 1440 the stage was 1,861px with the lower right empty
            because three full-width panels were stacked under a
            two-column layout; the rail uses that canvas and shortens the
            page without shrinking a single typeface. Below lg it stacks,
            where a phone has no second column to give it. */}
        <aside className="mt-8 border-t border-slate-200 pt-6 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h4 className="font-display text-lg font-bold text-ink-900">
            Watch out for
          </h4>
          {isStudent ? (
            <ul className="mt-4 space-y-5">
              {lesson.commonMistakes.map((m, i) => (
                <StudentWatchOut key={i} mistake={m} />
              ))}
            </ul>
          ) : (
            <div className="mt-3 space-y-3">
              {lesson.commonMistakes.map((m, i) => (
                <CommonMistakeCard key={i} mistake={m} />
              ))}
            </div>
          )}
        </aside>
        </div>
      </LessonStage>
      )}

      {stage === 3 && (
      <LessonStage
        n={4}
        name="Try it"
        tone="practice"
        title="Practice questions"
        detail="One question at a time. Nothing here is scored."
        meta={`${practiceItems.length} questions, easy to hard`}
      >
        {isStudent ? (
          <PracticeSequence items={practiceItems} showIds={false} />
        ) : (
          // A teacher reviewing the artifact wants the whole item set on
          // one page with ids and solutions, which is the opposite of
          // what a student needs. Same content, two readings.
          <ol className="mt-4 space-y-3">
            {practiceItems.map((it, i) => (
              <PracticeItem key={it.id} index={i + 1} item={it} showIds />
            ))}
          </ol>
        )}
      </LessonStage>
      )}

      {stage === 4 && (
      <LessonStage
        n={5}
        name="Think deeper"
        tone="learn"
        title="One question. No marks."
        detail="This one asks you to explain, not to answer."
      >
        {/* §6 — a concept misconception, handed back to the student as
            the thing to reason about. The wording of the error and the
            correction are both authored; nothing mathematical is
            invented here. */}
        <div className="mt-4">
          <p className="font-display text-xl font-bold leading-snug text-ink-900 sm:text-2xl">
            Another student writes{' '}
            <span className="text-attend-700">
              {lesson.commonMistakes[0]?.example}
            </span>
          </p>
          <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-ink-600">
            What would you say to them? Use the bar or the number line to
            explain it, not just the words.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-center">
            {studioFraction ? (
              <StudioPanel n={studioFraction.n} d={studioFraction.d} />
            ) : (
              <div />
            )}
            <div className="rounded-2xl border-2 border-dashed border-ink-200 p-6">
              <p className="leading-relaxed text-ink-500">
                Write or say your explanation. There is no single right
                wording — the test is whether the picture matches what you
                said.
              </p>
            </div>
          </div>
        </div>
      </LessonStage>
      )}

      {/* v0.77.1 §3 — the teacher and parent notes are not addressed to
          the student. v0.76 folded them into an accordion, which made
          them quieter without making them appropriate: a Class 6 student
          opening a maths lesson should not find guidance written to the
          adult about them at the bottom of it.
          The content is untouched and still renders for the teacher
          audience, which is where it is useful. When a family-support
          surface exists, the parent note routes there too. */}
      {!isStudent && (
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
      )}

      {/* v0.77.1 §4 — the review disclaimer is governance, and governance
          is addressed to us. It told a child that their lesson is a
          prototype nobody has checked, which is true of our process and
          is not information a student can act on.
          It is NOT a substitute for the gate: the gate is
          `hasEligibleLearn`, which still holds every one of the nine
          official §7.x drafts out of the student product. Removing the
          sentence publishes nothing. Teachers and reviewers still see
          it, because for them it is the point. */}
      {!isStudent && (
        <p className="text-center text-xs text-slate-500">
          Lesson content is a prototype draft. Review with a CBSE Class 6 math
          teacher before classroom use.
        </p>
      )}
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

/**
 * v0.77.2 §1/§2 — THE AUDIENCE CONTRACT FOR A MISCONCEPTION.
 *
 * One authored record, three readings. The mathematics is stored once
 * and never duplicated; what changes is who is being spoken to.
 *
 *   STUDENT   "What can go wrong" / "Try this instead". Second person,
 *             short, and about the work rather than about the child.
 *   TEACHER   the authored `why` and `fix` — a diagnosis and an
 *             instructional response, which is what a teacher opened
 *             this page for.
 *   REVIEWER  the pattern label alongside the above, so a record can be
 *             identified when it is being checked.
 *
 * The bug this fixes: v0.77.1 removed the teacher accordion and the
 * governance footer from the student lesson and then rendered "WHY
 * STUDENTS DO THIS" and "HOW TO FIX IT" three times on the Worked
 * examples stage. Same audience error, one level deeper, and I only saw
 * it because the screenshot was read rather than the test count.
 *
 * §4 — the student treatment is a row with a saffron rule, not a pink
 * bordered box. Three red panels make a stage of things you got wrong;
 * wrong thinking here is a teaching move, not a failure state.
 */
function StudentWatchOut({ mistake }: { mistake: CommonMistake }) {
  const s = mistake.student;
  return (
    <li className="border-l-2 border-saffron-400 pl-4">
      <p className="text-[0.95rem] font-semibold leading-snug text-ink-800">
        {s ? s.watch : mistake.example}
      </p>
      {s ? (
        <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-500">
          <span className="font-semibold text-practice-700">Try this: </span>
          {s.tryThis}
        </p>
      ) : null}
    </li>
  );
}

function CommonMistakeCard({ mistake }: { mistake: CommonMistake }) {
  // Teacher / reviewer reading. Unchanged: the diagnostic framing is the
  // reason this view exists.
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


/**
 * v0.77 §13/§14 — THE TRY-IT SEQUENCE.
 *
 * The stage used to list every item at once with a "Show solution" link
 * beside each. That is a worksheet with the answers stapled to it: a
 * student can read the solution without attempting anything, and there
 * is no moment where they commit to an answer.
 *
 * This walks the items one at a time. Nothing is a score. The completion
 * line counts questions worked, because that is a fact; it does not
 * count how many were right, because a practice stage inside a lesson is
 * not an assessment and turning item progression into a mastery number
 * is exactly what §13 forbids.
 *
 * §14 — DIAGNOSTIC FEEDBACK ONLY WHERE THE RESPONSE SUPPORTS IT.
 * Every distractor carries a misconception code. When the student picks
 * one whose code is a real misconception, they get the teaching for THAT
 * misconception. When the code is `none` — a distractor that is simply
 * wrong rather than diagnostic — they get neutral corrective guidance,
 * because inferring a misconception from an answer that does not imply
 * one would be a guess dressed as a diagnosis.
 *
 * The four options are drawn identically until a choice is committed, so
 * styling cannot reveal which distractor is the diagnostic one.
 */

/**
 * v0.77.1 §7/§11 — the studio surface inside a lesson.
 *
 * DARK/LIGHT RULE, decided rather than inherited:
 *
 *   DARK  wherever a mathematical object is being demonstrated or
 *         manipulated at working size — the lesson hero, See it, and the
 *         canvas in Think deeper. Dark is what makes a drawn figure read
 *         as an instrument rather than as an illustration in a document.
 *   LIGHT wherever the student READS for more than a sentence — Learn
 *         the idea, the worked examples and their misconceptions, and
 *         the practice questions. Long prose on a dark ground is a
 *         developer console, not a textbook.
 *
 * The rule is about the ACTIVITY on the surface, not about which stage
 * it is, so it holds for lessons that are not this one.
 */
function StudioPanel({
  n,
  d,
  interactive = false,
}: {
  n: number;
  d: number;
  interactive?: boolean;
}) {
  const [frac, setFrac] = useState<[number, number]>([n, d]);
  const [a, b] = interactive ? frac : [n, d];
  return (
    <div className="overflow-hidden rounded-3xl bg-ink-950 p-5 sm:p-7">
      <div className="hidden sm:block">
        <StudioCanvas
          n={a}
          d={b}
          layout="wide"
          onPick={interactive ? (x, y) => setFrac([x, y]) : undefined}
        />
      </div>
      <div className="sm:hidden">
        <StudioCanvas
          n={a}
          d={b}
          layout="stacked"
          onPick={interactive ? (x, y) => setFrac([x, y]) : undefined}
        />
      </div>
    </div>
  );
}

/**
 * Read a fraction out of the authored visual spec, or nothing.
 *
 * §8 — this is the whole of the transformation. If the lesson's visual
 * is a fraction bar we know its numerator and denominator; if it is a
 * grid we know how many cells of how many are shaded. Anything else
 * returns null and the authored renderer runs unchanged.
 */
function fractionFromVisual(
  visual: VisualSpec
): { n: number; d: number } | null {
  if (visual.kind === 'bars' && visual.bars[0]) {
    const { numerator, denominator } = visual.bars[0];
    return denominator > 0 ? { n: numerator, d: denominator } : null;
  }
  if (visual.kind === 'grid' && visual.grids[0]) {
    const g = visual.grids[0];
    const total = g.rows * g.cols;
    return total > 0 ? { n: g.shaded, d: total } : null;
  }
  return null;
}

function PracticeSequence({
  items,
  showIds,
}: {
  items: Item[];
  showIds: boolean;
}) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [worked, setWorked] = useState(0);
  const [done, setDone] = useState(false);
  const item = items[i];

  if (done || !item) {
    return (
      <div className="mt-5 rounded-2xl bg-practice-50 p-6">
        <p className="font-display text-xl font-bold text-practice-900">
          You worked through {worked} of {items.length} questions.
        </p>
        <p className="mt-2 leading-relaxed text-practice-900/75">
          Nothing here is scored. When you want a set that is, open a
          practice assessment.
        </p>
        <button
          type="button"
          onClick={() => {
            setI(0);
            setPicked(null);
            setWorked(0);
            setDone(false);
          }}
          className="tap mt-5 rounded-full bg-practice-700 px-6 py-2.5 font-display text-sm font-bold text-white"
        >
          Start again
        </button>
      </div>
    );
  }

  const answered = picked !== null;
  const correct = item.kind === 'mcq' && picked === item.correctIndex;
  const code =
    item.kind === 'mcq' && picked !== null
      ? item.options[picked].misconception
      : 'none';
  const diagnostic = code !== 'none' ? MISCONCEPTION_LABELS[code] : null;

  const advance = () => {
    setWorked((w) => w + 1);
    setPicked(null);
    if (i + 1 >= items.length) setDone(true);
    else setI(i + 1);
  };

  return (
    <div className="mt-5">
      <p className="num text-sm font-semibold text-slate-500">
        {showIds
          ? `Question ${i + 1} of ${items.length} · ${item.id}`
          : `Question ${i + 1} of ${items.length}`}
      </p>
      <MathText as="div" className="mt-3 text-lg font-semibold text-slate-900">
        {item.stem}
      </MathText>
      {item.visual ? (
        <div className="mt-4">
          <VisualRenderer visual={item.visual} />
        </div>
      ) : null}

      {item.kind === 'mcq' ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {item.options.map((o, oi) => {
            const chosen = picked === oi;
            const right = oi === item.correctIndex;
            const skin = !answered
              ? 'border-slate-300 bg-white hover:border-brand-500'
              : chosen && right
                ? 'border-practice-500 bg-practice-50'
                : chosen
                  ? 'border-attend-500 bg-attend-50'
                  : right
                    ? 'border-practice-400 bg-white'
                    : 'border-slate-200 bg-white opacity-60';
            return (
              <button
                key={o.text}
                type="button"
                disabled={answered}
                onClick={() => setPicked(oi)}
                className={`tap rounded-2xl border-2 px-5 py-4 text-left font-semibold text-slate-900 transition ${skin}`}
              >
                {o.text}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          Write your answer down, then check it: {item.acceptedAnswers[0]}
        </p>
      )}

      {answered && item.kind === 'mcq' ? (
        <div className="mt-5 rounded-2xl bg-slate-50 p-5">
          {correct ? (
            <p className="font-semibold text-practice-800">That is right.</p>
          ) : diagnostic ? (
            <>
              <p className="font-semibold text-attend-800">
                Not this one — look at what happened.
              </p>
              <p className="mt-1.5 leading-relaxed text-slate-700">
                {diagnostic}
              </p>
            </>
          ) : (
            <p className="leading-relaxed text-slate-700">
              <span className="font-semibold text-attend-800">Not this one.</span>{' '}
              Work through it again from the picture, and check each step
              against the worked examples.
            </p>
          )}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={advance}
          className="tap rounded-full bg-ink-900 px-6 py-2.5 font-display text-sm font-bold text-white"
        >
          {i + 1 >= items.length ? 'Finish' : 'Next question'}
        </button>
      </div>
    </div>
  );
}

function PracticeItem({
  index,
  item,
  showIds,
}: {
  index: number;
  item: Item;
  /**
   * v0.77 §11 — item ids and difficulty ranks are authoring metadata.
   * "Q1 · FR.02-01 · diff. 1" tells a teacher which item they are
   * reviewing and tells a Class 6 student that they are inside a
   * database. A student sees the question number and nothing else.
   */
  showIds: boolean;
}) {
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
            {showIds
              ? `Q${index} · ${item.id} · diff. ${item.difficulty}`
              : `Question ${index}`}
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
