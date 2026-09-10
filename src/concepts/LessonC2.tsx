// ===========================================================================
// v0.77 §10-§16 — ONE REAL LESSON, IN THE STUDIO.
//
// CONTENT PROVENANCE. Every word of mathematics on this screen comes
// from `lessonFor('FR.02')` and `ITEMS` — the same authored content the
// shipped Learn view renders. Nothing was rewritten for the demo. Two
// pieces of framing are mine and are marked in the code where they
// appear: the stage names (which the shipped lesson already uses) and
// the Think deeper prompt, which is built FROM the authored common
// mistake rather than invented beside it.
//
// FR.02 is legacy skill content, not an official §7.x lesson. That is
// what a student can actually open today, so it is what a lesson demo
// should show. The chapter framing says so.
//
// THE STRUCTURE §11 ASKS FOR
//
// One stage dominates. The rail stays visible and every stage is
// reachable from it at all times — §11 is explicit that this must not
// become a wizard that traps the student, so the rail is a set of
// buttons, not a next-only stepper, and the student can leave for the
// chapter from the header at any point.
//
// The v0.75 lesson was 2,900px of stacked white cards; v0.76 made it
// 4,500px of staged bands, which was organised rather than short. A
// stage here is roughly one to one and a half screens.
// ===========================================================================

import { useState } from 'react';
import { lessonFor } from '../data/lessons';
import { ITEMS } from '../data/items';
import { chapterAccent } from '../design/ChapterMotif';
import { StudioCanvas, StudioField, StudioHeader } from './studio';
import type { ConceptData } from './main';

const STAGES = [
  'Learn the idea',
  'See it',
  'Worked examples',
  'Try it',
  'Think deeper',
] as const;

function StageRail({
  stage,
  onPick,
}: {
  stage: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="relative z-20 border-b border-white/10 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-[92rem] gap-2 overflow-x-auto px-6 py-3 lg:px-10">
        {STAGES.map((s, i) => {
          const on = i === stage;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onPick(i)}
              aria-current={on ? 'step' : undefined}
              className={`tap flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                on ? 'bg-saffron-400 text-ink-950' : 'text-white/55 hover:bg-white/10'
              }`}
            >
              <span
                className={`num grid h-5 w-5 place-items-center rounded-full text-[0.7rem] ${
                  on ? 'bg-ink-950/20 text-ink-950' : 'bg-white/10 text-white/60'
                }`}
              >
                {i + 1}
              </span>
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LessonC2({ data }: { data: ConceptData }) {
  const params = new URLSearchParams(window.location.search);
  const [stage, setStage] = useState(Number(params.get('stage') ?? '0') || 0);
  const [frac, setFrac] = useState<[number, number]>([3, 5]);
  const [picked, setPicked] = useState<number | null>(
    params.get('answer') ? Number(params.get('answer')) : null
  );

  const lesson = lessonFor('FR.02');
  const accent = chapterAccent(data.current.number);
  const items = lesson.practice
    .map((id) => ITEMS.find((it) => it.id === id))
    .filter((it): it is (typeof ITEMS)[number] => Boolean(it));
  const tryItem = items.find((it) => it.kind === 'mcq');
  const mistake = lesson.commonMistakes[0];

  return (
    <div className="min-h-screen bg-paper-100">
      <StudioField accent={accent} className="pb-0">
        <StudioHeader
          studentName={data.studentName}
          gradeLabel={data.gradeLabel}
          active="Learn"
          back={`${data.current.title} practice`}
        />
        <div className="mx-auto max-w-[92rem] px-6 pb-7 lg:px-10">
          <p className="font-display text-base font-bold text-saffron-300">
            {data.current.title} · practice activity
          </p>
          <h1 className="mt-2 max-w-[20ch] font-display text-[2.25rem] font-extrabold leading-[0.96] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem]">
            {lesson.reteach.title}
          </h1>
        </div>
        <StageRail stage={stage} onPick={setStage} />

        {/* ============ 1 · LEARN THE IDEA ============
            §12 — one idea, a short explanation, and mathematics on the
            screen at the same time as the words rather than after four
            paragraphs of them. */}
        {stage === 0 && (
          <div className="mx-auto grid max-w-[92rem] items-center gap-10 px-6 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-10 lg:py-16">
            <div>
              <p className="text-xl leading-relaxed text-white/80 lg:text-2xl">
                {lesson.intro}
              </p>
              <ol className="mt-9 space-y-4">
                {lesson.reteach.steps.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="num mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 font-display text-sm font-bold text-saffron-300">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-white/65">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div className="hidden lg:block">
                <StudioCanvas n={3} d={5} layout="wide" />
              </div>
              <div className="lg:hidden">
                <StudioCanvas n={3} d={5} layout="stacked" />
              </div>
            </div>
          </div>
        )}

        {/* ============ 2 · SEE IT ============
            §13 — the signature experience. The canvas is the stage, not
            an illustration inside it. */}
        {stage === 1 && (
          <div className="mx-auto max-w-[92rem] px-6 py-10 lg:px-10 lg:py-14">
            <p className="max-w-[60ch] text-xl leading-relaxed text-white/80">
              {lesson.visualExplanation.caption}
            </p>
            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center">
              <div>
                <div className="hidden lg:block">
                  <StudioCanvas
                    n={frac[0]}
                    d={frac[1]}
                    layout="wide"
                    onPick={(a, b) => setFrac([a, b])}
                  />
                </div>
                <div className="lg:hidden">
                  <StudioCanvas
                    n={frac[0]}
                    d={frac[1]}
                    layout="stacked"
                    onPick={(a, b) => setFrac([a, b])}
                  />
                </div>
              </div>
              <ol className="space-y-5">
                {lesson.visualExplanation.readingSteps.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="num mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saffron-400/20 font-display text-sm font-bold text-saffron-300">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-white/70">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* ============ 3 · WORKED EXAMPLES ============
            §14 — a workspace. The problem is set as mathematics, each
            step carries its reason on the same line, and the answer is
            the largest thing on the page. */}
        {stage === 2 && (
          <div className="mx-auto max-w-[92rem] space-y-8 px-6 py-12 lg:px-10 lg:py-16">
            {lesson.workedExamples.map((w, wi) => (
              <div key={w.problem} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                <div>
                  <p className="num font-display text-sm font-bold text-saffron-300">
                    Problem {wi + 1}
                  </p>
                  <p className="mt-3 font-display text-2xl font-bold leading-snug text-white lg:text-[1.75rem]">
                    {w.problem}
                  </p>
                  <div className="mt-8 inline-flex items-baseline gap-4 rounded-2xl bg-white/[0.06] px-6 py-4">
                    <span className="text-sm font-semibold text-white/40">
                      Answer
                    </span>
                    <span className="num font-display text-4xl font-extrabold text-saffron-300">
                      {w.answer}
                    </span>
                  </div>
                </div>
                {/* §6 — the rule used to be a border on the list, so on a
                    short example it ran past the final step into empty
                    space and read as an unfinished thread. It is now
                    drawn per step and omitted on the last one, so the
                    connector ends where the reasoning ends. */}
                <ol className="pl-7">
                  {w.steps.map((s, i) => (
                    <li key={s} className="relative pb-7 last:pb-0">
                      {i < w.steps.length - 1 ? (
                        <span
                          aria-hidden
                          className="absolute -left-7 top-7 h-full w-0.5 bg-white/10"
                        />
                      ) : null}
                      <span className="num absolute -left-[2.35rem] grid h-7 w-7 place-items-center rounded-full bg-ink-950 font-display text-sm font-bold text-white/70 ring-1 ring-white/20">
                        {i + 1}
                      </span>
                      <p className="text-lg leading-relaxed text-white/85">{s}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {/* ============ 4 · TRY IT ============
            §15 — minimal chrome, one question, and no styling that gives
            the answer away before a choice is made. All four options are
            drawn identically until the student commits. */}
        {stage === 3 && tryItem && tryItem.kind === 'mcq' && (
          <div className="mx-auto max-w-[60rem] px-6 py-12 lg:px-10 lg:py-20">
            <p className="text-sm font-semibold text-white/40">
              Question 1 of {items.length}
            </p>
            <p className="mt-4 font-display text-2xl font-bold leading-snug text-white lg:text-4xl">
              {tryItem.stem}
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {tryItem.options.map((o, i) => {
                const chosen = picked === i;
                const right = i === tryItem.correctIndex;
                // Before a choice: all four identical. After: only the
                // chosen one is marked, plus the correct one if the
                // student was wrong. Nothing about the layout leaks.
                const state =
                  picked === null
                    ? 'border-white/15 bg-white/[0.04] hover:border-white/40'
                    : chosen && right
                      ? 'border-practice-400 bg-practice-500/20'
                      : chosen
                        ? 'border-attend-400 bg-attend-500/15'
                        : right
                          ? 'border-practice-400/50 bg-white/[0.04]'
                          : 'border-white/10 bg-white/[0.02] opacity-60';
                return (
                  <button
                    key={o.text}
                    type="button"
                    onClick={() => setPicked(i)}
                    className={`tap rounded-2xl border-2 px-6 py-5 text-left text-lg font-semibold text-white transition ${state}`}
                  >
                    {o.text}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="mt-8 rounded-2xl bg-white/[0.06] p-7">
                {picked === tryItem.correctIndex ? (
                  <p className="text-lg text-white/85">
                    <span className="font-display font-bold text-practice-300">
                      That is right.
                    </span>{' '}
                    {lesson.visualExplanation.readingSteps.slice(-1)[0]}
                  </p>
                ) : (
                  <div>
                    <p className="font-display text-lg font-bold text-attend-300">
                      Not this one — here is the thing to fix.
                    </p>
                    {/* Targeted teaching, from the authored misconception
                        set rather than a generic "try again". */}
                    <p className="mt-2 leading-relaxed text-white/70">
                      {mistake.fix}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============ 5 · THINK DEEPER ============
            §16 — one task, and a different kind of task. The prompt is
            built from the authored common mistake, so the reasoning it
            asks for is the reasoning the content already identifies as
            the hard part. It is not a new mathematical claim. */}
        {stage === 4 && (
          <div className="mx-auto max-w-[64rem] px-6 py-12 lg:px-10 lg:py-20">
            <p className="font-display text-sm font-bold text-saffron-300">
              One question. No marks.
            </p>
            <p className="mt-5 font-display text-3xl font-bold leading-snug text-white lg:text-[2.75rem] lg:leading-[1.15]">
              Another student writes{' '}
              <span className="text-saffron-300">{mistake.example}</span>
            </p>
            <p className="mt-7 max-w-[58ch] text-xl leading-relaxed text-white/70">
              What would you say to them? Use the bar or the number line to
              explain it, not just the words.
            </p>
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
              <div className="hidden lg:block">
                <StudioCanvas n={3} d={5} layout="wide" />
              </div>
              <div className="lg:hidden">
                <StudioCanvas n={3} d={5} layout="stacked" />
              </div>
              <div className="rounded-2xl border-2 border-dashed border-white/20 p-7">
                <p className="text-white/40">
                  Write or say your explanation. There is no single right
                  wording — the test is whether the picture matches what you
                  said.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="h-16" />
      </StudioField>
    </div>
  );
}
