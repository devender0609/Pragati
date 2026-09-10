// ===========================================================================
// v0.77 — STUDENT HOME, IN THE STUDIO (production).
//
// This replaces the v0.76 composition wholesale. There is no flag, no
// alternate route and no old branch left behind: a mixed-generation
// student product would be worse than either generation on its own.
//
// WHAT THE SCREEN IS NOW
//
//   1  a dark studio field carrying the chapter, its title at display
//      scale, and the mathematics at working size — a fraction strip, a
//      number line and the notation, moving together when the student
//      chooses a different fraction;
//   2  a studio rail that overlaps the field: what genuinely opens now,
//      and — separately and honestly — what the chapter's own lessons
//      are doing;
//   3  the record, as one line of type rather than a panel of nothing;
//   4  the book, as a shelf of chapter plates that snaps on a phone.
//
// WHAT IT IS NOT ALLOWED TO DO
//
// Every claim on this screen is derived, not written here.
// `officialChapterLearnState` decides what the chapter IS; `learnStateCta`
// decides what the button SAYS. This component chooses no wording of its
// own for either, because "Ready to learn" survived an earlier fix
// precisely by being decided in two places at once.
// ===========================================================================

import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  CHOICES,
  PracticeGlyph,
  StudioCanvas,
  StudioField,
} from '../../design/Studio';
import { ChapterArtwork } from '../../design/ChapterArtwork';
import { chapterAccent, motifForChapter } from '../../design/ChapterMotif';
import {
  LEARN_STATE_LABEL,
  type OfficialLearnState,
} from '../../curriculum/eligibilityPolicy';

export type HomePart = {
  officialSectionId: string;
  sectionNumber: string;
  title: string;
};

export type HomePractice = {
  /** Plain student-facing name. Never a skill id. */
  name: string;
  officialSectionId: string;
};

export type HomeChapter = {
  officialChapterId: string;
  number: number;
  title: string;
  available: boolean;
  state: OfficialLearnState;
};

export type StudentHomeViewProps = {
  /** The chapter the page is about, or null when nothing is open. */
  current: HomeChapter | null;
  currentState: OfficialLearnState;
  /** What the student can genuinely open in the current chapter. */
  practice: HomePractice[];
  onOpenPractice: (officialSectionId: string) => void;
  /** Official sections of the current chapter that are student-eligible. */
  officialLessons: HomePart[];
  onOpenLesson: (officialSectionId: string) => void;
  sectionsTotal: number;
  ctaLabel: string;
  onCta: () => void;
  /** A real unfinished set, or null. Never invented to fill the space. */
  unfinished: { label: string; remaining: number } | null;
  chapters: HomeChapter[];
  onOpenChapter: (officialChapterId: string) => void;
  onSeeAllChapters: () => void;
  onPractise: () => void;
  activity: { completedSessions: number; answered: number };
  /** Growth Check, when one is assigned. Takes the primary action. */
  growth: { inProgress: boolean; onStart: () => void } | null;
};

function RailPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-ink-800 p-6 sm:p-7 lg:p-9">
      <div
        aria-hidden
        className="absolute inset-0 bg-lattice text-white/[0.09] [background-size:26px_26px]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function StudentHomeView(props: StudentHomeViewProps) {
  const {
    current, currentState, practice, onOpenPractice,
    officialLessons, onOpenLesson, sectionsTotal, ctaLabel, onCta, unfinished,
    chapters, onOpenChapter, onSeeAllChapters, onPractise, activity, growth,
  } = props;

  const [[n, d], setFrac] = useState<[number, number]>(CHOICES[3]);
  const accent = current ? chapterAccent(current.number) : '#4f46e5';

  return (
    <div>
      <StudioField accent={accent} className="-mx-3 pb-40 sm:-mx-4 sm:rounded-[2rem] lg:pb-48">
        <div className="grid items-center gap-8 px-6 pt-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14 lg:px-10 lg:pt-10">
          <div>
            {/* The shell already greets the student directly above this
                field. v0.70 removed a duplicate greeting for exactly this
                reason and the production capture showed me reintroducing
                it — the studio field says who you are, the shell says it
                again eight pixels higher. The field yields. */}
            {current ? (
              <>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="num font-display text-4xl font-extrabold leading-none text-white/25 sm:text-5xl">
                    {String(current.number).padStart(2, '0')}
                  </span>
                  <span className="font-display text-lg font-bold text-saffron-300">
                    {current.title}
                  </span>
                </div>
                <h1 className="mt-4 font-display text-[2.5rem] font-extrabold leading-[0.95] tracking-[-0.03em] text-white sm:text-[3rem] lg:text-[4.25rem]">
                  See fractions in different ways
                </h1>
                <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-white/70">
                  Build, compare and reason with fractions — through equal
                  parts, number lines, equivalence, mixed fractions, and adding
                  and subtracting.
                </p>
              </>
            ) : (
              <h1 className="mt-5 font-display text-[2.25rem] font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
                Nothing to open just yet
              </h1>
            )}

            {growth ? (
              // v0.59 §17 / v0.68 §9 — the Growth Check takes the primary
              // action when one is assigned, and keeps the child-facing
              // wording the suite pins. Nothing here is new copy: it is
              // the same two sentences, moved into the studio field.
              <div className="mt-6 rounded-2xl bg-white/[0.07] p-5">
                <p className="font-display text-xl font-bold text-white">
                  {growth.inProgress
                    ? 'Continue your Growth Check'
                    : 'Your Math Growth Check is ready'}
                </p>
                <p className="mt-1.5 max-w-[46ch] leading-relaxed text-white/65">
                  A set of maths questions to see what you can do. It is not a
                  test you can fail.
                </p>
              </div>
            ) : unfinished ? (
              <p className="num mt-5 inline-flex rounded-full bg-saffron-400/15 px-4 py-2 text-sm font-semibold text-saffron-200">
                {unfinished.remaining} question
                {unfinished.remaining === 1 ? '' : 's'} left in {unfinished.label}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="button"
                onClick={growth ? growth.onStart : onCta}
                className="tap rounded-full bg-white px-8 py-4 font-display text-lg font-bold text-ink-950 transition hover:bg-saffron-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
              >
                {growth ? (growth.inProgress ? 'Continue' : 'Start') : ctaLabel}
              </button>
              {current ? (
                <span className="num text-sm text-white/45">
                  {sectionsTotal} sections · {practice.length} practice
                  activities open
                </span>
              ) : null}
            </div>
          </div>

          {current ? (
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 rounded-[3rem]"
                style={{ background: `radial-gradient(closest-side, ${accent}2B, transparent)` }}
              />
              {/* One canvas, two layouts. A phone cannot hold the strip,
                  the line and the notation in one row. */}
              <div className="relative hidden lg:block">
                <StudioCanvas n={n} d={d} layout="wide" onPick={(a, b) => setFrac([a, b])} />
              </div>
              <div className="relative lg:hidden">
                <StudioCanvas n={n} d={d} layout="stacked" onPick={(a, b) => setFrac([a, b])} />
              </div>
            </div>
          ) : null}
        </div>
      </StudioField>

      {/* THE STUDIO RAIL */}
      <section className="relative z-10 -mt-32 lg:-mt-36">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.74fr)_minmax(0,1fr)] lg:items-start">
          <RailPanel>
            {officialLessons.length > 0 ? (
              <>
                <h2 className="font-display text-2xl font-extrabold text-white lg:text-3xl">
                  Lessons open now
                </h2>
                <ul className="mt-6 grid gap-x-9 sm:grid-cols-2">
                  {officialLessons.map((p) => (
                    <li key={p.officialSectionId}>
                      <button
                        type="button"
                        onClick={() => onOpenLesson(p.officialSectionId)}
                        className="tap group flex w-full items-center gap-4 border-b border-white/10 py-4 text-left transition hover:border-saffron-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
                      >
                        <span className="num w-10 shrink-0 font-display text-sm font-bold text-saffron-300">
                          {p.sectionNumber}
                        </span>
                        <span className="flex-1 font-display text-[1.05rem] font-bold leading-snug text-white">
                          {p.title}
                        </span>
                        <span className="text-white/30 transition group-hover:text-saffron-300">›</span>
                      </button>
                    </li>
                  ))}

                </ul>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="font-display text-2xl font-extrabold text-white lg:text-3xl">
                    Practice you can do now
                  </h2>
                  {/* §12 — student framing for provenance. Not "legacy
                      skill content", not "§7.2 lesson". */}
                  <p className="text-sm text-white/45">
                    Related practice — not the chapter's lessons
                  </p>
                </div>
                <ul className="mt-6 grid gap-x-9 sm:grid-cols-2">
                  {practice.map((a, i) => (
                    <li key={a.officialSectionId}>
                      <button
                        type="button"
                        onClick={() => onOpenPractice(a.officialSectionId)}
                        className="tap group flex w-full items-center gap-4 border-b border-white/10 py-4 text-left transition hover:border-saffron-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
                      >
                        <span
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                          style={{ background: `${accent}2E` }}
                        >
                          <PracticeGlyph kind={i % 4} />
                        </span>
                        <span className="flex-1 font-display text-[1.05rem] font-bold leading-snug text-white">
                          {a.name}
                        </span>
                        <span className="text-white/30 transition group-hover:text-saffron-300">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {current && currentState === 'related_practice_available' ? (
              // §4 — student-friendly, and silent about our workflow.
              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="font-display text-lg font-bold text-white/85">
                  {current.title} lessons
                </p>
                <p className="mt-1.5 max-w-[64ch] leading-relaxed text-white/45">
                  Chapter lessons are being prepared. Practice is available now.
                </p>
              </div>
            ) : null}
          </RailPanel>

          <div className="overflow-hidden rounded-[1.75rem] bg-practice-600 p-6 text-white sm:p-7">
            <h2 className="font-display text-2xl font-extrabold">Practice sets</h2>
            <p className="mt-3 leading-relaxed text-white/80">
              Short sets drawn only from activities you have already worked
              through. Nothing appears before you have met it.
            </p>
            <button
              type="button"
              onClick={onPractise}
              className="tap mt-6 w-full rounded-full bg-white px-6 py-3 font-display text-base font-bold text-practice-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-practice-600"
            >
              Start a set
            </button>
          </div>
        </div>

        <p className="mt-6 border-t border-ink-900/10 pt-5 text-[0.95rem] text-ink-400">
          <span className="font-semibold text-ink-700">Your learning record</span>
          <span className="mx-3 text-ink-200">/</span>
          {activity.completedSessions > 0 ? (
            <span className="num text-ink-600">
              {activity.completedSessions} sets finished · {activity.answered}{' '}
              questions answered
            </span>
          ) : (
            'Completed practice and recent work will appear here.'
          )}
        </p>
      </section>

      {/* THE SHELF */}
      <section className="mt-14 lg:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 lg:text-[2.5rem]">
              Your chapters
            </h2>
            <p className="mt-2 text-ink-400">
              All ten chapters of Ganita Prakash, in the book's order. The ones
              drawn in outline are coming later.
            </p>
          </div>
          <button
            type="button"
            onClick={onSeeAllChapters}
            className="tap rounded-full px-4 py-2 font-semibold text-brand-700 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Explore all {chapters.length} chapters
          </button>
        </div>

        <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible">
          {chapters.map((c) => {
            const a = chapterAccent(c.number);
            const live = c.available;
            const plate = (
              <>
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
                  {live ? (
                    <p className="mt-1 text-xs text-white/75">
                      {LEARN_STATE_LABEL[c.state]}
                    </p>
                  ) : null}
                </div>
              </>
            );
            const skin = {
              background: live ? `linear-gradient(158deg, ${a}F2, ${a}A6)` : `${a}12`,
            };
            return (
              <li
                key={c.officialChapterId}
                className="w-[64vw] shrink-0 snap-start overflow-hidden rounded-[1.5rem] sm:w-[38vw] lg:w-auto"
                style={skin}
              >
                {/* An unavailable chapter is drawn, not tappable. v0.63 §11
                    and v0.69 §34 both pin this: a chapter that accepts a
                    tap and then has nothing in it was the original defect. */}
                {live ? (
                  <button
                    type="button"
                    onClick={() => onOpenChapter(c.officialChapterId)}
                    className="tap block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                  >
                    {plate}
                  </button>
                ) : (
                  plate
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
