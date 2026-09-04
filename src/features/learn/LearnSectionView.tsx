// v0.61 §10 — THE LEARN SECTION RENDERER.
//
// This is the renderer for real Learn content, not a showcase built to
// display one demonstration. It takes the same content shape any
// future authored section will use, and the demonstration section is
// simply its first input.
//
// It is NOT reachable from the student product. Section 7.4 is
// `authored_draft` and no educator has reviewed it. The only entry
// points are Admin and a reviewer preview, both of which label the
// draft status prominently — and that label is deliberately confined
// to reviewer contexts so it can never leak into student UI.

import { useState } from 'react';
import { NumberLineFigure, FractionStripFigure } from './MathVisuals';
import {
  ConceptIntro,
  PriorKnowledge,
  IdeaCard,
  MathVisualCard,
  NoticeThis,
  CommonMistake,
  ReasoningChallenge,
  SummaryCard,
  MathText,
} from '../../design/LessonBlocks';
import type {
  NumberLineSpec,
  FractionStripSpec,
  VisualSpec,
} from '../../curriculum/visualSpecification';

export type LearnSectionContent = {
  officialReference: string;
  learningGoal: string;
  prerequisiteCheck: {
    prompt: string;
    checks: string[];
    ifNotReady: string;
  };
  explanation: string[];
  visuals: VisualSpec[];
  workedExamples: Array<{
    id: string;
    prompt: string;
    steps: Array<{ text: string; reasoning: string }>;
    answer: string;
    visualRef?: string;
  }>;
  misconceptions: Array<{
    id: string;
    misconception: string;
    studentFeedback: string;
  }>;
  guidedPractice: Array<{ prompt: string; hint: string; answer: string }>;
  independentPractice: Array<{ prompt: string; answer: string }>;
  reasoningApplication: Array<{
    prompt: string;
    expectedReasoning: string;
  }>;
  summary: string;
  nextStep: string;
};

function Visual({ spec }: { spec: VisualSpec }) {
  if (spec.type === 'number_line')
    return <NumberLineFigure spec={spec as NumberLineSpec} />;
  if (spec.type === 'fraction_strip')
    return <FractionStripFigure spec={spec as FractionStripSpec} />;
  return null;
}

/**
 * A worked example that reveals its reasoning one step at a time —
 * reading a finished solution is not the same as following one.
 *
 * v0.69 §8/§9 — progressive disclosure was already the behaviour; what
 * changed is that the steps are now numbered, separated and legible,
 * and the ANSWER is a distinct terminal band rather than the last
 * paragraph in the stack. A student scanning back for the answer used
 * to have to re-read the whole example.
 */
/**
 * v0.71 §13 — A WORKED EXAMPLE AS MATHEMATICS, NOT A COLOURED TEXT BOX.
 *
 * The v0.70 version numbered its steps and separated the answer, which
 * was an improvement on the paragraph run before it. It still rendered
 * each step as two lines of prose stacked in a list, so the structure of
 * the mathematics — this is the problem, this is the move, this is why
 * the move is legal — was carried entirely by typography weight.
 *
 * The hierarchy is now explicit and consistent:
 *
 *   PROBLEM   the question, on its own tinted surface
 *   STEP n    the move, in the largest type in the card
 *   WHY       the justification, visibly subordinate to the move
 *   ANSWER    a terminal band that cannot be confused with a step
 *
 * A connector runs down the step numbers so a reader sees a chain rather
 * than a list of equals.
 *
 * PROGRESSIVE DISCLOSURE IS KEPT. Reading a finished solution is not the
 * same as following one; a student who can see step 3 before attempting
 * step 2 will read step 3.
 *
 * NO SEMANTICS CHANGE. `text`, `reasoning` and `answer` are rendered
 * exactly as authored — this is presentation only, and the §7.4
 * fingerprint is asserted unchanged.
 */
function WorkedExample({
  index,
  example,
  visual,
}: {
  index: number;
  example: LearnSectionContent['workedExamples'][number];
  visual?: VisualSpec;
}) {
  const [shown, setShown] = useState(1);
  const done = shown >= example.steps.length;

  return (
    <section className="overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-card">
      {/* PROBLEM */}
      <div className="border-b border-slate-100 bg-learn-50/70 px-4 py-3.5">
        <p className="text-[0.7rem] font-bold uppercase tracking-wide text-learn-700">
          Worked example {index}
        </p>
        <p className="mt-1.5 text-[0.95rem] font-semibold leading-relaxed text-slate-900">
          <MathText>{example.prompt}</MathText>
        </p>
      </div>

      {visual && (
        <div className="border-b border-slate-100 px-4 py-3">
          <Visual spec={visual} />
        </div>
      )}

      {/* STEPS — a chain, with the move dominant and the reason
          subordinate. */}
      <ol className="relative px-4 py-1">
        {example.steps.slice(0, shown).map((s, i) => {
          const last = i === example.steps.length - 1;
          return (
            <li key={i} className="relative flex animate-rise-in gap-3 py-3">
              {/* The connector. Drawn only between steps, so the last
                  step does not trail a line into the answer band. */}
              {!last && (
                <span
                  className="absolute bottom-0 left-[13px] top-9 w-px bg-brand-200"
                  aria-hidden="true"
                />
              )}
              <span
                className="relative z-10 mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.95rem] font-medium leading-relaxed text-slate-900">
                  <MathText>{s.text}</MathText>
                </p>
                <p className="mt-1.5 border-l-2 border-slate-200 pl-2.5 text-[0.8rem] leading-relaxed text-slate-500">
                  <span className="font-semibold uppercase tracking-wide text-slate-400">
                    Why{' '}
                  </span>
                  <MathText>{s.reasoning}</MathText>
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {!done ? (
        <div className="border-t border-slate-100 px-4 py-3">
          <button
            type="button"
            onClick={() => setShown((n) => n + 1)}
            className="tap inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Next step
            <span className="text-white/60">
              {shown} of {example.steps.length}
            </span>
          </button>
        </div>
      ) : (
        <div className="flex animate-rise-in items-baseline gap-2.5 border-t-2 border-correct-300 bg-correct-50 px-4 py-3.5">
          <span className="text-[0.7rem] font-bold uppercase tracking-wide text-correct-700">
            Answer
          </span>
          <span className="text-base font-bold text-correct-900">
            <MathText>{example.answer}</MathText>
          </span>
        </div>
      )}
    </section>
  );
}

// v0.71 §12 — LESSON STAGES.
//
// The route-verified 390px capture in v0.70 showed the truth: 8,703px of
// continuous page. Explanation, two visuals, five worked examples, the
// common-mistakes list, guided practice, independent practice, reasoning
// and the summary, all rendered at once. That is a worksheet with
// colours, and a reviewer has to read nine of them.
//
// THE SHAPE
//
// Five stages following the pedagogy, not the data model:
//
//   Learn the idea  → what this is, and why
//   See it          → the mathematical representations
//   Worked examples → someone does it, step by step
//   Try it          → guided, then independent
//   Think deeper    → reasoning, and the one idea to leave with
//
// WHAT THIS IS NOT
//
// It is not 25 taps. Each stage is a full screen of related content, and
// a student moves between them with one control. Nothing is hidden that
// they need: the concept, the visuals and the worked examples all remain
// reachable at any moment from the stage bar, so a student stuck on
// practice can go back and look — which the single long page technically
// allowed and practically did not, because the thing they wanted was
// 4,000px away.
//
// NO CONTENT IS ALTERED. Every block receives exactly the authored
// values it received before. This is a change to what is on screen at
// once, nothing else.
const LESSON_STAGES = [
  { id: 'idea', label: 'Learn the idea' },
  { id: 'see', label: 'See it' },
  { id: 'examples', label: 'Worked examples' },
  { id: 'try', label: 'Try it' },
  { id: 'deeper', label: 'Think deeper' },
] as const;

type LessonStageId = (typeof LESSON_STAGES)[number]['id'];

/**
 * The stage bar.
 *
 * Every stage is reachable at any time — this is a table of contents a
 * student can steer with, not a wizard that locks them out of what they
 * have not "completed". Locking would be the gamified reading of this
 * change and the wrong one: a lesson is a reference as much as a path.
 */
function StageBar({
  active,
  onSelect,
}: {
  active: LessonStageId;
  onSelect: (id: LessonStageId) => void;
}) {
  const activeIndex = LESSON_STAGES.findIndex((s) => s.id === active);
  return (
    <nav
      aria-label="Lesson stages"
      className="sticky top-0 z-10 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur"
    >
      <ol className="flex gap-1.5 overflow-x-auto pb-1">
        {LESSON_STAGES.map((s, i) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-current={isActive ? 'step' : undefined}
                className={`tap whitespace-nowrap rounded-full px-3.5 text-xs font-bold transition ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : i < activeIndex
                      ? 'bg-brand-50 text-brand-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <span className="mr-1.5 opacity-60">{i + 1}</span>
                {s.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function LearnSectionView({
  content,
  visualsById,
}: {
  content: LearnSectionContent;
  visualsById: Record<string, VisualSpec>;
}) {
  const [stage, setStage] = useState<LessonStageId>('idea');
  const index = LESSON_STAGES.findIndex((s) => s.id === stage);
  const next = LESSON_STAGES[index + 1] ?? null;
  const prev = LESSON_STAGES[index - 1] ?? null;

  return (
    // §19 — at `lg` the lesson gains a contextual column carrying the
    // stage list and the learning goal, so desktop width holds
    // orientation rather than margin. The reading column keeps a
    // readable measure; prose is never stretched to fill the viewport.
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-8">
        <article className="min-w-0 max-w-2xl space-y-4">
          <StageBar active={stage} onSelect={setStage} />

          {stage === 'idea' && (
            <>
              <ConceptIntro
                eyebrow={content.officialReference}
                title={content.learningGoal}
                goal={content.prerequisiteCheck.prompt}
              />
              <PriorKnowledge items={content.prerequisiteCheck.checks} />
              <IdeaCard title="The idea" paragraphs={content.explanation} />
              {/* §14 — the common mistakes move UP, next to the idea
                  they are mistakes ABOUT. They used to sit after five
                  worked examples and before practice, which is the one
                  place they help least: too late to shape how a student
                  reads the examples, too early to answer a mistake they
                  have actually made. */}
              <CommonMistake
                items={content.misconceptions.map(
                  (m) => `${m.misconception} ${m.studentFeedback}`
                )}
              />
            </>
          )}

          {stage === 'see' && (
            <>
              {content.visuals.map((v, i) => (
                <MathVisualCard
                  key={i}
                  caption={i === 1 ? 'The same point, two names.' : undefined}
                >
                  <Visual spec={v} />
                </MathVisualCard>
              ))}
              {content.visuals.length === 0 && (
                <p className="text-sm text-slate-500">
                  This part has no diagram of its own.
                </p>
              )}
            </>
          )}

          {stage === 'examples' && (
            <>
              {content.workedExamples.map((w, i) => (
                <WorkedExample
                  key={w.id}
                  index={i + 1}
                  example={w}
                  visual={w.visualRef ? visualsById[w.visualRef] : undefined}
                />
              ))}
            </>
          )}

          {stage === 'try' && (
            <>
              {/* §14 — guided practice comes FIRST and keeps its hints;
                  that is what makes it guided. Independent practice
                  follows on the same stage, so the step up from "with
                  help" to "on your own" is visible rather than separated
                  by a scroll. */}
              {content.guidedPractice.length > 0 && (
                <section className="surface-practice">
                  <p className="text-xs font-semibold uppercase tracking-wide text-practice-800">
                    Try it together
                  </p>
                  <ol className="mt-2 space-y-2">
                    {content.guidedPractice.map((g, i) => (
                      <li key={i} className="rounded-lg bg-white/80 p-3">
                        <p className="text-sm leading-relaxed text-slate-800">
                          <span className="mr-1.5 font-semibold text-practice-700">
                            {i + 1}.
                          </span>
                          <MathText>{g.prompt}</MathText>
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-practice-800">
                          <span className="font-semibold">Hint: </span>
                          <MathText>{g.hint}</MathText>
                        </p>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {content.independentPractice.length > 0 && (
                <section className="rounded-xl2 border border-practice-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-practice-700">
                    Now you try
                  </p>
                  <ol className="mt-2 space-y-2">
                    {content.independentPractice.map((p, i) => (
                      <li key={i} className="text-sm leading-relaxed text-slate-800">
                        <span className="mr-1.5 font-semibold text-slate-400">
                          {i + 1}.
                        </span>
                        <MathText>{p.prompt}</MathText>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </>
          )}

          {stage === 'deeper' && (
            <>
              <ReasoningChallenge
                items={content.reasoningApplication.map((r, i) => ({
                  id: String(i),
                  prompt: r.prompt,
                }))}
              />
              <SummaryCard text={content.summary} />
              <NoticeThis>
                <MathText>{content.nextStep}</MathText>
              </NoticeThis>
            </>
          )}

          {/* One control, not twenty-five. */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {prev ? (
              <button
                type="button"
                onClick={() => setStage(prev.id)}
                className="tap rounded-xl2 border border-slate-300 px-4 text-sm font-semibold text-slate-700"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button
                type="button"
                onClick={() => setStage(next.id)}
                className="tap inline-flex items-center gap-1.5 rounded-xl2 bg-slate-900 px-5 text-sm font-bold text-white"
              >
                {next.label}
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 4l6 6-6 6" />
                </svg>
              </button>
            ) : (
              <span className="text-sm font-medium text-slate-500">
                That is the end of this part.
              </span>
            )}
          </div>
        </article>

        {/* §19 — the contextual column. Desktop only: on a phone the
            stage bar already carries this and a second copy would just
            push the lesson down. */}
        <aside className="hidden lg:block">
          <div className="sticky top-4 space-y-4">
            <div className="rounded-xl2 border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                In this part
              </p>
              <ol className="mt-2 space-y-1">
                {LESSON_STAGES.map((st, i) => (
                  <li key={st.id}>
                    <button
                      type="button"
                      onClick={() => setStage(st.id)}
                      className={`tap w-full rounded-lg px-2 text-left text-sm ${
                        st.id === stage
                          ? 'font-bold text-brand-700'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="mr-2 text-slate-400">{i + 1}</span>
                      {st.label}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-xl2 border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                What you are learning
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                <MathText>{content.learningGoal}</MathText>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
