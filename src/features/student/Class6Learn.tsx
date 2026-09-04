// v0.62 §3/§12/§16 — THE STUDENT CLASS 6 EXPERIENCE.
//
// Replaces a screen showing one card above two-thirds of empty
// viewport. All ten official chapters appear, in the book's order, with
// the five that have no content saying so plainly.
//
// COPY RULES (Classes 6-8 row of the age-stage standard)
//   - plain and direct, not childish
//   - no governance vocabulary: no 'unmapped', no 'authored_draft',
//     no 'competency_pending', no 'primary_verified'
//   - limited text per card; the chapter number and title do the work
//
// An unavailable chapter is not clickable and does not pretend
// otherwise. Nothing here fabricates a lesson to fill space.

import {
  class6ChapterCards,
  fractionsSectionCards,
  type StudentChapterCard,
} from '../../curriculum/studentChapterModel';
import { SECTION_7_4_PRACTICE } from '../../curriculum/fractionsPracticeItems';
import { PracticeItemView } from '../learn/PracticeItemView';
import { ChapterMotif, chapterAccent } from '../../design/ChapterMotif';
import { Lede } from '../../design/Composition';
import { ChapterHeroBand, ChapterPlate } from '../../design/CurriculumBlocks';

// ---------------------------------------------------------------------------
// Chapter list
// ---------------------------------------------------------------------------

// v0.70 §5/§6 — THE CURRICULUM AS A JOURNEY, NOT A SHOPPING LIST.
//
// v0.69 replaced ten identical white rectangles with ten *styled*
// rectangles. Better, and still one shape repeated ten times down a
// phone screen — which is what §5 means by a shopping list.
//
// The composition now has three distinct registers:
//
//   1. a FEATURED chapter, given real space and its own artwork;
//   2. the remaining AVAILABLE chapters as compact two-up tiles;
//   3. the COMING chapters, present and readable but visually quieter.
//
// All ten official chapters remain, in the book's order, with truthful
// availability. What changed is that the eye now has somewhere to land
// first, and the page stops being a single uniform rhythm.
//
// Grouping does NOT reorder the curriculum: each group is rendered in
// official chapter order, and the chapter number is on every tile, so a
// student can always see where a chapter sits in the book.

/** Register 2 — a compact tile. Two per row on a phone. */
export function Class6ChapterList({
  onOpenChapter,
}: {
  onOpenChapter: (officialChapterId: string) => void;
}) {
  const cards = class6ChapterCards();
  const ready = cards.filter((c) => c.availability === 'available');
  const coming = cards.filter((c) => c.availability !== 'available');
  const featured = ready[0] ?? null;
  const rest = featured ? ready.slice(1) : ready;

  const readyLine =
    ready.length === 0
      ? 'None are ready just yet.'
      : ready.length === 1
        ? '1 is ready for you.'
        : `${ready.length} are ready for you.`;

  const toPlate = (c: StudentChapterCard) => ({
    officialChapterId: c.officialChapterId,
    number: c.number,
    title: c.title,
    available: c.availability === 'available',
    statusLine: c.availability === 'available' ? c.statusLine : 'Being written',
  });

  // v0.76 §6 — THE CURRICULUM AS A WORLD.
  //
  // v0.75 rendered this as a violet rectangle on the left and nine
  // white rows stacked down the right, with the entire lower-left half
  // of a 1440 screen empty. It had already been restyled twice. The
  // problem was never the styling: nine identical rectangles in one
  // column is a list, and a list is not a curriculum.
  //
  // Three registers become two, and both are visual:
  //
  //   the open chapter, as a full field in its own colour with its
  //   mathematics drawn at 40% of the composition;
  //
  //   the rest of the book, as a grid of plates carrying the SAME
  //   artwork drawn quietly. §6 asks for upcoming chapters to be
  //   beautifully muted rather than grey disabled boxes, and the only
  //   honest way to do that is to draw them properly.
  //
  // The book's order and every chapter number stay on the page, so a
  // student can still see exactly where they are in Ganita Prakash.
  return (
    <div className="space-y-8 pb-20 sm:space-y-12">
      <Lede
        level={1}
        title="Ganita Prakash"
        detail={`Your Class 6 mathematics textbook. ${cards.length} chapters, in the book's own order. ${readyLine}`}
      />

      {featured && (
        <ChapterHeroBand
          chapter={toPlate(featured)}
          kicker={`Chapter ${featured.number}`}
          detail={featured.statusLine}
          actionLabel="Open this chapter"
          onAction={() => onOpenChapter(featured.officialChapterId)}
        />
      )}

      <section>
        <Lede
          title="The rest of the book"
          detail="Every chapter of your textbook is here. The quiet ones are being written now."
        />
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {[...rest, ...coming].map((c) => (
            <li key={c.officialChapterId}>
              <ChapterPlate
                chapter={toPlate(c)}
                onOpen={
                  c.availability === 'available' ? onOpenChapter : undefined
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function FractionsChapterLanding({
  onBack,
  onOpenPractice,
}: {
  onBack: () => void;
  onOpenPractice: (sectionId: string) => void;
}) {
  const sections = fractionsSectionCards();
  const open = sections.filter((s) => s.availability !== 'not_available_yet');
  const accent = chapterAccent(7);

  return (
    <section className="mx-auto max-w-2xl px-4 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="tap -ml-1 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 4 7 10l6 6" />
        </svg>
        All chapters
      </button>

      {/* §6 — a chapter header with the chapter's own identity, not a
          bare h1 above a list of boxes. */}
      <header
        className="mt-2 overflow-hidden rounded-xl3 p-5 text-white shadow-card sm:p-6"
        style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)` }}
      >
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl2 bg-white/15 text-white">
            <ChapterMotif motif="fractions" className="h-8 w-8" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Chapter 7
            </p>
            <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight">
              Fractions
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              A fraction counts equal parts of a whole. This chapter builds
              from sharing things equally all the way to adding fractions.
            </p>
          </div>
        </div>
      </header>

      {/* §6/§36 — factual only. Parts you can practise now, out of the
          parts the chapter has. Nothing here implies completion or
          mastery, because Pragati measures neither. */}
      <p className="mt-4 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">
          {open.length} of {sections.length} parts
        </span>{' '}
        are ready to practise.
      </p>

      {/* §6 — the nine parts as a pathway. The connecting rail makes the
          order visible: this chapter genuinely must be done in sequence,
          and a flat list of boxes does not say so. */}
      <ol className="relative mt-5 space-y-2.5 pl-8">
        <span
          className="absolute bottom-4 left-[15px] top-4 w-px bg-slate-200"
          aria-hidden="true"
        />
        {sections.map((sec, i) => {
          const ready = sec.availability !== 'not_available_yet';
          return (
            <li key={sec.officialSectionId} className="relative">
              <span
                className={`absolute -left-8 top-4 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 text-xs font-bold ${
                  ready
                    ? 'border-practice-500 bg-practice-500 text-white'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {ready ? (
                <button
                  type="button"
                  onClick={() => onOpenPractice(sec.officialSectionId)}
                  className="tap group w-full rounded-xl2 border border-slate-200 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-practice-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {sec.sectionNumber}
                  </p>
                  <p className="mt-0.5 font-semibold leading-snug text-slate-900">
                    {sec.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium text-practice-700">
                    {sec.statusLine}
                    <svg viewBox="0 0 20 20" className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 4l6 6-6 6" />
                    </svg>
                  </p>
                </button>
              ) : (
                <div className="rounded-xl2 border border-slate-200 bg-white/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {sec.sectionNumber}
                  </p>
                  <p className="mt-0.5 font-semibold leading-snug text-slate-500">
                    {sec.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">Coming soon</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ---------------------------------------------------------------------------
// §7.4 practice — the interactive set
// ---------------------------------------------------------------------------

export function Section74Practice({ onBack }: { onBack: () => void }) {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-16">
      <button
        type="button"
        onClick={onBack}
        className="min-h-11 text-sm font-medium text-slate-600"
      >
        ← Fractions
      </button>
      <h1 className="mt-2 text-xl font-bold text-slate-900">
        Fractions on a number line
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Practise placing fractions as lengths from 0.
      </p>
      <div className="mt-4 space-y-4">
        {SECTION_7_4_PRACTICE.map((item) => (
          <PracticeItemView key={item.itemId} item={item} />
        ))}
      </div>
    </section>
  );
}
