// ===========================================================================
// v0.76 §1A/§4/§7 — STUDENT HOME.
//
// One of the three flagship surfaces §1 asks to get right BEFORE the
// rest of the app is touched. Everything here is a composition decision;
// the data it renders is unchanged from v0.75 and still comes only from
// what Pragati actually records.
//
// WHAT CHANGED, AND WHY
//
// v0.75's Home at 1440 was: a white bar, a mint bar, one violet
// rectangle, a column of white cards down the right, and roughly 500×400
// of empty grey in the lower left. Every region was a rounded rectangle
// with a hairline ring. §4 named the failure exactly — most of the page
// is white and grey with one violet element on it.
//
// The composition is now layered, which is what §7 asks for:
//
//   1  a full-bleed chapter field carrying the chapter's own colour and
//      its mathematics at 38% of the hero — not a card on a page, the
//      top of the page IS the chapter;
//   2  what is inside that chapter, as an open list on paper with
//      hairline separators — no card, because a list of four links has
//      never needed a border;
//   3  practice and activity as tinted zones, side by side, so the
//      middle of the page has two colours rather than none;
//   4  the curriculum, as plates with real artwork.
//
// The empty lower-left is gone because the page is now composed across
// its full width rather than being a phone column with margins.
//
// WHAT DID NOT CHANGE
//
// No invented data. No streak, no mastery ring, no percentage. Every
// number on this screen is a count of something recorded, and the
// first-run branch still shows a genuinely different screen rather than
// zeroes.
// ===========================================================================

import type { ReactNode } from 'react';
import { Band, Zone, Lede, Fact } from '../../design/Composition';
import {
  ChapterHeroBand,
  ChapterPlate,
  type PlateChapter,
} from '../../design/CurriculumBlocks';
import { SectionDots, type SectionDotState } from '../../design/StudentHomeBlocks';

export type HomePart = {
  officialSectionId: string;
  sectionNumber: string;
  title: string;
};

export type StudentHomeViewProps = {
  studentName: string;
  /** 'growth' | 'resume' | 'chapter' | 'empty' — decided by the caller. */
  hero:
    | { kind: 'growth'; inProgress: boolean; onStart: () => void }
    | { kind: 'resume'; remaining: number; onResume: () => void }
    | {
        kind: 'chapter';
        chapter: PlateChapter;
        kicker: string;
        detail?: string;
        meta?: string;
        actionLabel: string;
        onOpen: () => void;
      }
    | { kind: 'empty'; onBrowse: () => void };
  /** Parts of the hero chapter that genuinely open right now. */
  parts: HomePart[];
  partsTotal: number;
  partsChapterTitle: string;
  onOpenPart: (officialSectionId: string) => void;
  chapters: PlateChapter[];
  onOpenChapter: (officialChapterId: string) => void;
  onSeeAllChapters: () => void;
  showPractice: boolean;
  onPractise: () => void;
  activity: { completedSessions: number; answered: number };
  dotStates: SectionDotState[];
  startedCount: number;
  dotsChapterTitle: string;
  firstRun: boolean;
};

/**
 * A dark field for the two states that are not a chapter.
 *
 * Growth Check and an unfinished set are both "the one thing to do
 * next", so they take the same shape as the chapter hero. They are ink
 * rather than a chapter hue because neither belongs to a chapter.
 */
function ActionBand({
  kicker,
  title,
  detail,
  actionLabel,
  onAction,
}: {
  kicker: string;
  title: string;
  detail?: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <Band tone="ink">
      <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <p className="text-sm font-semibold text-saffron-300">{kicker}</p>
        <h1 className="mt-2 max-w-[20ch] font-display text-[1.9rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {detail ? (
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-white/80">
            {detail}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onAction}
          className="tap mt-7 inline-flex items-center rounded-full bg-white px-7 text-base font-bold text-ink-900 shadow-lg transition hover:bg-saffron-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
        >
          {actionLabel}
        </button>
      </div>
    </Band>
  );
}

/**
 * One part of a chapter, as a row on paper.
 *
 * §10 — this was a white card inside a tinted card inside a column.
 * Three nested rectangles to render a link. It is now a row with a
 * hairline under it, which is what a list of links has looked like since
 * before software.
 */
function PartRow({
  part,
  onOpen,
}: {
  part: HomePart;
  onOpen: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="tap group flex w-full items-center gap-4 border-b border-ink-100 py-3.5 text-left transition hover:border-ink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <span className="num w-9 shrink-0 font-display text-sm font-bold text-learn-700">
          {part.sectionNumber}
        </span>
        <span className="min-w-0 flex-1 font-medium leading-snug text-ink-800">
          {part.title}
        </span>
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-learn-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 4l6 6-6 6" />
        </svg>
      </button>
    </li>
  );
}

export function StudentHomeView(props: StudentHomeViewProps): ReactNode {
  const {
    studentName, hero, parts, partsTotal, partsChapterTitle, onOpenPart,
    chapters, onOpenChapter, onSeeAllChapters, showPractice, onPractise,
    activity, dotStates, startedCount, dotsChapterTitle, firstRun,
  } = props;

  const remainingParts = partsTotal - parts.length;
  // §7 — the supporting column must hold something real or not exist.
  // v0.76's first capture left a 500px void beside the parts list when a
  // student had no recorded activity, which is the v0.75 failure this
  // release exists to remove. A student on day one gets the honest
  // orientation instead: what a part of a chapter actually contains.
  const hasSide = showPractice || !firstRun;
  const strip = [
    ...chapters.filter((c) => c.available),
    ...chapters.filter((c) => !c.available),
  ].slice(0, 5);

  return (
    <div className="space-y-8 sm:space-y-10">
      {hero.kind === 'chapter' && (
        <ChapterHeroBand
          chapter={hero.chapter}
          kicker={hero.kicker}
          detail={hero.detail}
          meta={hero.meta}
          actionLabel={hero.actionLabel}
          onAction={hero.onOpen}
        />
      )}
      {hero.kind === 'growth' && (
        <ActionBand
          kicker={`For you, ${studentName}`}
          title={
            hero.inProgress
              ? 'Continue your Growth Check'
              : 'Your Math Growth Check is ready'
          }
          detail="A set of maths questions to see what you can do. It is not a test you can fail."
          actionLabel={hero.inProgress ? 'Continue' : 'Start'}
          onAction={hero.onStart}
        />
      )}
      {hero.kind === 'resume' && (
        <ActionBand
          kicker="You stopped part way"
          title={`${hero.remaining} question${hero.remaining === 1 ? '' : 's'} left`}
          detail="Pick up exactly where you left off."
          actionLabel="Continue practice"
          onAction={hero.onResume}
        />
      )}
      {hero.kind === 'empty' && (
        <ActionBand
          kicker={`Hello, ${studentName}`}
          title="Nothing to open just yet"
          detail="Maths chapters for your class appear here as they are ready."
          actionLabel="Look around"
          onAction={hero.onBrowse}
        />
      )}

      {/* Layer 2 — what is actually inside the chapter, and what the
          student has actually done. Two columns at lg so the width
          carries content instead of margin. */}
      {(parts.length > 0 || showPractice || !firstRun) && (
        <div
          className={`grid gap-8 lg:gap-12 ${
            hasSide ? 'lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]' : ''
          }`}
        >
          {parts.length > 0 ? (
            <section className="min-w-0">
              <Lede
                title={`Inside ${partsChapterTitle}`}
                detail={
                  remainingParts > 0
                    ? `${parts.length} ${parts.length === 1 ? 'part is' : 'parts are'} open. ${remainingParts} ${remainingParts === 1 ? 'is' : 'are'} still being written.`
                    : undefined
                }
              />
              <ul className={`mt-5 ${hasSide ? '' : 'lg:columns-2 lg:gap-x-12'}`}>
                {parts.map((p) => (
                  <PartRow
                    key={p.officialSectionId}
                    part={p}
                    onOpen={() => onOpenPart(p.officialSectionId)}
                  />
                ))}
              </ul>
            </section>
          ) : (
            <div className="hidden lg:block" />
          )}

          <div className={`min-w-0 space-y-6 ${hasSide ? '' : 'hidden'}`}>
            {showPractice && (
              <Zone tone="practice" className="p-6" lattice>
                <h2 className="font-display text-lg font-bold text-practice-900">
                  Practise what you know
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-practice-800/90">
                  Short sets on things you have already worked through.
                </p>
                <button
                  type="button"
                  onClick={onPractise}
                  className="tap mt-4 inline-flex items-center rounded-full bg-practice-700 px-6 text-sm font-bold text-white transition hover:bg-practice-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-practice-600 focus-visible:ring-offset-2"
                >
                  Practise
                </button>
              </Zone>
            )}

            {!firstRun && (
              <Zone tone="progress" className="p-6">
                <h2 className="font-display text-lg font-bold text-progress-900">
                  What you have done
                </h2>
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                  <Fact value={activity.completedSessions} label="sets finished" />
                  <Fact value={activity.answered} label="questions answered" />
                </div>
                {dotStates.length > 0 && (
                  <div className="mt-5">
                    <SectionDots states={dotStates} accent="#0284c7" />
                    <p className="num mt-2 text-sm text-progress-900/80">
                      {dotsChapterTitle}: {startedCount} of {dotStates.length} parts
                      started
                    </p>
                  </div>
                )}
              </Zone>
            )}
          </div>
        </div>
      )}

      {/* §7 — first run gets a real orientation, not an empty column.
          Every line describes how a part of a chapter is actually built,
          so nothing here is a claim Pragati cannot keep. Set as a strip
          of five rather than a tinted box with a hole in it: the stages
          are a sequence, and a sequence reads across. */}
      {firstRun && (
        <Zone tone="learn" className="px-5 py-6 sm:px-8 sm:py-7" lattice bleed>
          <h2 className="font-display text-lg font-bold text-learn-900">
            What happens when you open a part
          </h2>
          <ol className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['Learn the idea', 'In plain words, with the vocabulary you need.'],
              ['See it', 'The same idea drawn — a bar, a circle, a number line.'],
              ['Worked examples', 'Full solutions, with the reasoning shown.'],
              ['Try it', 'Questions to work, solution one tap away.'],
              ['Think deeper', 'One harder question that asks you to explain.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="num mt-0.5 h-6 w-6 shrink-0 rounded-full bg-learn-200/70 text-center font-display text-sm font-bold leading-6 text-learn-800">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[0.95rem] font-bold leading-tight text-learn-900">
                    {t}
                  </span>
                  <span className="mt-1 block text-[0.82rem] leading-snug text-learn-900/70">
                    {d}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Zone>
      )}

      {/* Layer 3 — the book. */}
      {chapters.length > 0 && (
        <Zone tone="paper" bleed lattice className="px-5 py-8 sm:px-8 sm:py-10">
          <Lede
            title="Your chapters"
            detail="Pragati follows Ganita Prakash, chapter by chapter."
            action={
              <button
                type="button"
                onClick={onSeeAllChapters}
                className="tap inline-flex items-center rounded-full px-4 text-sm font-bold text-brand-700 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                All {chapters.length} chapters
              </button>
            }
          />
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {strip.map((c) => (
              <li key={c.officialChapterId}>
                <ChapterPlate
                  chapter={c}
                  onOpen={c.available ? onOpenChapter : undefined}
                />
              </li>
            ))}
          </ul>
        </Zone>
      )}
    </div>
  );
}
