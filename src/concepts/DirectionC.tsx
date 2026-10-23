// ===========================================================================
// v0.77 — DIRECTION C2 HOME, refined after approval.
//
// The direction is settled; these are the six notes against the approved
// screen.
//
//   §1  the 390 hero put the strip, the line and the 74px notation in one
//       row, and the notation squeezed the diagram to about 220px. The
//       canvas now has a stacked layout: full-width diagram, notation on
//       its own row beneath, still large. Proved at 360, 390 and 430.
//   §2  "waiting on teacher review" is true and is a description of our
//       internal workflow. A Class 6 student is not the audience for our
//       approval process. Now: "Chapter lessons are being prepared.
//       Practice is available now."
//   §3  nine tiles repeating "Being written" was honest and repetitive.
//       The status moves to a shelf-level legend, stated once; upcoming
//       tiles keep their muted treatment and stay non-interactive. The
//       underlying status is unchanged.
//   §4  a returning state, from seeded activity, with the CTA derived
//       from what is actually unfinished.
//  §18  the field, header, canvas and glyphs now come from studio.tsx,
//       shared with Learn and the lesson.
// ===========================================================================

import { useState } from 'react';
import { ChapterArtwork } from '../design/ChapterArtwork';
import { chapterAccent, motifForChapter } from '../design/ChapterMotif';
import {
  CHOICES,
  PracticeGlyph,
  StudioCanvas,
  StudioField,
  StudioHeader,
} from './studio';
import type { ConceptData } from './main';

function shelfStatus(c: { hasOfficialLesson: boolean; hasPractice: boolean }) {
  // §4 of the previous round — "Ready to learn" is reserved for a chapter
  // with an official, student-eligible lesson from the current textbook.
  if (c.hasOfficialLesson) return 'Lessons available';
  if (c.hasPractice) return 'Practice available';
  return null; // §3 — said once, in the legend, not ten times in tiles.
}

export function DirectionC({ data }: { data: ConceptData }) {
  const seed = Number(new URLSearchParams(window.location.search).get('s') ?? '3');
  const initial = CHOICES[Math.min(Math.max(Number.isFinite(seed) ? seed : 3, 0), CHOICES.length - 1)];
  const [[n, d], setFrac] = useState<[number, number]>(initial);

  const accent = chapterAccent(data.current.number);
  const hasOfficialLesson = data.officialLessons.length > 0;
  const hasPractice = data.practice.length > 0;
  const unfinished = data.activity.unfinished;

  // §4/§5 — derived from what exists. Nothing unfinished means nothing
  // offers to continue, whatever it would do for the composition.
  const cta = unfinished
    ? 'Continue practice'
    : hasOfficialLesson
      ? `Start ${data.current.title}`
      : hasPractice
        ? `Explore ${data.current.title}`
        : 'Explore your curriculum';

  return (
    <div className="min-h-screen bg-paper-100">
      <StudioField accent={accent} className="pb-44 lg:pb-52">
        <StudioHeader
          studentName={data.studentName}
          gradeLabel={data.gradeLabel}
          active="Home"
        />

        <div className="mx-auto grid max-w-[92rem] items-center gap-8 px-6 pt-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14 lg:px-10 lg:pt-8">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="num font-display text-5xl font-extrabold leading-none text-white/25">
                {String(data.current.number).padStart(2, '0')}
              </span>
              <span className="font-display text-lg font-bold text-saffron-300">
                {data.current.title}
              </span>
            </div>
            <h1 className="mt-4 font-display text-[2.75rem] font-extrabold leading-[0.94] tracking-[-0.03em] text-white sm:text-[3rem] lg:text-[4.25rem]">
              See fractions in different ways
            </h1>
            <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-white/70">
              Build, compare and reason with fractions — through equal parts,
              number lines, equivalence, mixed fractions, and adding and
              subtracting.
            </p>
            {unfinished ? (
              <p className="num mt-5 inline-flex items-center gap-2 rounded-full bg-saffron-400/15 px-4 py-2 text-sm font-semibold text-saffron-200">
                {unfinished.remaining} question
                {unfinished.remaining === 1 ? '' : 's'} left in{' '}
                {unfinished.activityName}
              </p>
            ) : null}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button className="tap rounded-full bg-white px-9 py-4 font-display text-lg font-bold text-ink-950 transition hover:bg-saffron-100">
                {cta}
              </button>
              <span className="num text-sm text-white/45">
                {data.partsTotal} sections · {data.practice.length} practice
                activities open
              </span>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[3rem]"
              style={{ background: `radial-gradient(closest-side, ${accent}2B, transparent)` }}
            />
            {/* §1 — one canvas, two layouts. Below lg the diagram takes
                the full width and the notation sits under it. */}
            <div className="relative hidden lg:block">
              <StudioCanvas n={n} d={d} layout="wide" onPick={(a, b) => setFrac([a, b])} />
            </div>
            <div className="relative lg:hidden">
              <StudioCanvas n={n} d={d} layout="stacked" onPick={(a, b) => setFrac([a, b])} />
            </div>
          </div>
        </div>
      </StudioField>

      {/* ===================== THE STUDIO RAIL ===================== */}
      <section className="relative z-10 mx-auto -mt-36 max-w-[92rem] px-6 lg:-mt-40 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.74fr)_minmax(0,1fr)] lg:items-start">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-ink-800 p-7 lg:p-9">
            <div aria-hidden className="absolute inset-0 bg-lattice text-white/[0.09] [background-size:26px_26px]" />
            <div className="relative">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="font-display text-2xl font-extrabold text-white lg:text-3xl">
                  Practice you can do now
                </h2>
                <p className="text-sm text-white/45">
                  Related practice — not the chapter's lessons
                </p>
              </div>
              <ul className="mt-6 grid gap-x-9 sm:grid-cols-2">
                {data.practice.map((a, gi) => {
                  const done = data.activity.completedActivities.includes(a.name);
                  return (
                    <li key={a.name}>
                      <button
                        type="button"
                        className="tap group flex w-full items-center gap-4 border-b border-white/10 py-4 text-left transition hover:border-saffron-400/60"
                      >
                        <span
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                          style={{ background: `${accent}2E` }}
                        >
                          <PracticeGlyph kind={gi % 4} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[1.05rem] font-bold leading-snug text-white">
                            {a.name}
                          </span>
                          {done ? (
                            <span className="mt-0.5 block text-xs text-practice-300">
                              Practised
                            </span>
                          ) : null}
                        </span>
                        <span className="text-white/30 transition group-hover:text-saffron-300">›</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* §2/§3 — the chapter's own lessons, in a student's words. */}
              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="font-display text-lg font-bold text-white/85">
                  {data.current.title} lessons
                </p>
                <p className="mt-1.5 max-w-[64ch] leading-relaxed text-white/45">
                  Chapter lessons are being prepared. Practice is available now.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] bg-practice-600 p-7 text-white">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl font-extrabold">Practice sets</h2>
              <svg viewBox="0 0 60 40" className="h-10 w-16 shrink-0" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <rect
                    key={i}
                    x={2 + i * 14}
                    y={6}
                    width={13}
                    height={28}
                    rx={2}
                    fill={i < 3 ? 'rgba(255,255,255,0.85)' : 'none'}
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth={2}
                  />
                ))}
              </svg>
            </div>
            <p className="mt-3 leading-relaxed text-white/80">
              Short sets drawn only from activities you have already worked
              through. Nothing appears before you have met it.
            </p>
            <button className="tap mt-6 w-full rounded-full bg-white px-6 py-3 font-display text-base font-bold text-practice-800">
              Start a set
            </button>
          </div>
        </div>

        {/* §10 of the previous round — the record is a line of type. With
            real activity it carries counts; with none it says so once. */}
        <p className="mt-6 border-t border-ink-900/10 pt-5 text-[0.95rem] text-ink-400">
          <span className="font-semibold text-ink-700">Your learning record</span>
          <span className="mx-3 text-ink-200">/</span>
          {data.activity.completedSessions > 0 ? (
            <span className="num text-ink-600">
              {data.activity.completedSessions} sets finished ·{' '}
              {data.activity.answered} questions answered
            </span>
          ) : (
            'Completed practice and recent work will appear here.'
          )}
        </p>
      </section>

      {/* ===================== THE SHELF ===================== */}
      <section className="mx-auto max-w-[92rem] py-14 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-6 lg:px-10">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 lg:text-[2.5rem]">
              The rest of Class 6
            </h2>
            {/* §3 — said once. */}
            <p className="mt-2 text-ink-400">
              All ten chapters of Ganita Prakash, in the book's order. The ones
              drawn in outline are coming later.
            </p>
          </div>
          <p className="font-semibold text-brand-700">Explore all 10 chapters</p>
        </div>

        <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-10">
          {data.chapters.map((c) => {
            const a = chapterAccent(c.number);
            const live = c.hasPractice || c.hasOfficialLesson;
            const status = shelfStatus(c);
            return (
              <li
                key={c.officialChapterId}
                className="w-[64vw] shrink-0 snap-start overflow-hidden rounded-[1.5rem] sm:w-[38vw] lg:w-auto"
                style={{ background: live ? `linear-gradient(158deg, ${a}F2, ${a}A6)` : `${a}12` }}
              >
                <div className="px-4 pt-4">
                  <ChapterArtwork
                    motif={motifForChapter(c.officialChapterId)}
                    accent={a}
                    tone={live ? 'onDark' : 'quiet'}
                    className="h-28 w-full lg:h-32"
                  />
                </div>
                <div className="px-5 pb-5 pt-3">
                  <p className={`num text-xs font-bold ${live ? 'text-white/70' : 'text-ink-300'}`}>
                    Chapter {c.number}
                  </p>
                  <p
                    className={`mt-1 font-display text-base font-bold leading-tight ${
                      live ? 'text-white' : 'text-ink-400'
                    }`}
                  >
                    {c.title}
                  </p>
                  {status ? (
                    <p className="mt-1 text-xs text-white/75">{status}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
