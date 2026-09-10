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
} from '../../curriculum/studentChapterModel';
import { SECTION_7_4_PRACTICE } from '../../curriculum/fractionsPracticeItems';
import { PracticeItemView } from '../learn/PracticeItemView';
import { ChapterMotif, chapterAccent } from '../../design/ChapterMotif';
import { ChapterArtwork } from '../../design/ChapterArtwork';
import { motifForChapter } from '../../design/ChapterMotif';
import { PracticeGlyph, StudioCanvas, StudioField } from '../../design/Studio';
import { officialChapterLearnState } from '../../curriculum/eligibilityPolicy';
import { sectionsForChapter } from '../../curriculum/officialSections';
import { relatedPracticeForChapter } from '../../curriculum/sectionRouting';

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


  // v0.77 §6-§9 — CLASS 6 LEARN, IN THE STUDIO.
  //
  // Three registers, because a curriculum has three:
  //
  //   the open chapter as a studio of its own — the same dark field as
  //   Home, the same live canvas, and the activities that genuinely
  //   open listed inside it;
  //
  //   a station rail carrying all ten chapters in the book's order. §9
  //   allowed the station idea and rejected the serpentine, so this
  //   takes the node and not the path: one straight rule, and NO filled
  //   segment — the rail says "the book is in this order", never "you
  //   have come this far". Availability and progress stay separate;
  //
  //   the remaining chapters as plates, which snap horizontally on a
  //   phone and lay out as a grid on a desktop. Responsive composition,
  //   not one composition scaled: the plate wall took Learn past
  //   3,000px at 390 and no chapter was dropped to fix it.
  const accent = featured ? chapterAccent(featured.number) : '#4f46e5';
  const practice = featured
    ? relatedPracticeForChapter(
        sectionsForChapter(featured.officialChapterId).map((sec) => ({
          officialSectionId: sec.officialSectionId,
          sectionNumber: sec.sectionNumber,
        }))
      )
    : [];

  return (
    <div className="pb-20">
      <StudioField accent={accent} className="-mx-3 pb-36 sm:-mx-4 sm:rounded-[2rem] lg:pb-40">
        <div className="px-6 pt-8 lg:px-10 lg:pt-10">
          <p className="font-display text-lg font-bold text-saffron-300">
            Ganita Prakash
          </p>
          <h1 className="mt-2 max-w-[18ch] font-display text-[2.25rem] font-extrabold leading-[0.96] tracking-[-0.03em] text-white sm:text-5xl lg:text-[4rem]">
            Class 6 mathematics
          </h1>
          <p className="mt-4 max-w-[54ch] text-lg leading-relaxed text-white/65">
            {cards.length} chapters, in the order your textbook teaches them.{' '}
            {readyLine}
          </p>
        </div>

        {featured && (
          <div className="mt-10 grid items-center gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-14 lg:px-10">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="num font-display text-4xl font-extrabold leading-none text-white/25 sm:text-5xl">
                  {String(featured.number).padStart(2, '0')}
                </span>
                <span className="font-display text-lg font-bold text-saffron-300">
                  Open now
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl">
                {featured.title}
              </h2>

              <ul className="mt-7 grid gap-x-8 sm:grid-cols-2">
                {practice.map((a, i) => (
                  <li key={a.officialSectionId}>
                    <button
                      type="button"
                      onClick={() => onOpenChapter(featured.officialChapterId)}
                      className="tap group flex w-full items-center gap-3 border-b border-white/10 py-3.5 text-left transition hover:border-saffron-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
                    >
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                        style={{ background: `${accent}2E` }}
                      >
                        <PracticeGlyph kind={i % 4} />
                      </span>
                      <span className="flex-1 font-display text-[1rem] font-bold leading-snug text-white">
                        {a.name}
                      </span>
                      <span className="text-white/30 transition group-hover:text-saffron-300">
                        ›
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {officialChapterLearnState(featured.officialChapterId) ===
              'related_practice_available' ? (
                <p className="mt-5 text-white/45">
                  Chapter lessons are being prepared. Practice is available now.
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => onOpenChapter(featured.officialChapterId)}
                className="tap mt-7 rounded-full bg-white px-8 py-3.5 font-display text-base font-bold text-ink-950 transition hover:bg-saffron-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
              >
                Open this chapter
              </button>
            </div>

            <div className="relative order-first lg:order-none">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 rounded-[3rem]"
                style={{ background: `radial-gradient(closest-side, ${accent}30, transparent)` }}
              />
              <div className="relative hidden lg:block">
                <StudioCanvas n={3} d={5} layout="wide" />
              </div>
              <div className="relative lg:hidden">
                <StudioCanvas n={3} d={5} layout="stacked" />
              </div>
            </div>
          </div>
        )}
      </StudioField>

      <section className="relative z-10 -mt-24 lg:-mt-28">
        <div className="overflow-hidden rounded-[1.75rem] bg-white py-7 shadow-[0_24px_70px_-34px_rgba(13,20,38,0.5)]">
          <p className="px-6 font-display text-lg font-bold text-ink-900 lg:px-10">
            The whole book, in order
          </p>
          <div className="mt-5 overflow-x-auto">
            <div className="min-w-[44rem] px-6 lg:px-10">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute left-0 right-0 top-[27px] h-px bg-ink-900/15"
                />
                <ol className="relative flex items-start justify-between gap-1">
                  {cards.map((c) => {
                    const a = chapterAccent(c.number);
                    const live = c.availability === 'available';
                    return (
                      <li
                        key={c.officialChapterId}
                        className="flex min-w-0 flex-1 flex-col items-center"
                      >
                        <span
                          className={`grid h-14 w-14 place-items-center rounded-full ${
                            live ? 'ring-4 ring-saffron-400' : 'ring-1 ring-ink-900/15'
                          }`}
                          style={{ background: live ? a : `${a}1F` }}
                        >
                          <ChapterArtwork
                            motif={motifForChapter(c.officialChapterId)}
                            accent={a}
                            tone={live ? 'onDark' : 'onLight'}
                            lattice={false}
                            className="h-9 w-9"
                          />
                        </span>
                        <span
                          className={`num mt-2 text-xs font-bold ${
                            live ? 'text-ink-900' : 'text-ink-500'
                          }`}
                        >
                          {String(c.number).padStart(2, '0')}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 lg:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 lg:text-[2.5rem]">
            The rest of the book
          </h2>
          <p className="max-w-[46ch] text-ink-400">
            Every chapter of your textbook is here. The quiet ones are being
            written — they open as they are ready.
          </p>
        </div>

        <ul className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-3 lg:gap-7 lg:overflow-visible">
          {[...rest, ...coming].map((c) => {
            const a = chapterAccent(c.number);
            const live = c.availability === 'available';
            const plate = (
              <>
                <div className="px-4 pt-5">
                  <ChapterArtwork
                    motif={motifForChapter(c.officialChapterId)}
                    accent={a}
                    tone={live ? 'onLight' : 'quiet'}
                    className="h-28 w-full lg:h-40"
                  />
                </div>
                <div className="px-5 pb-6 pt-4">
                  <p className="num text-xs font-bold text-ink-300">
                    Chapter {c.number}
                  </p>
                  <p
                    className={`mt-1 font-display text-lg font-bold leading-tight lg:text-xl ${
                      live ? 'text-ink-900' : 'text-ink-500'
                    }`}
                  >
                    {c.title}
                  </p>
                  {/* v0.63 §11 / v0.69 §34 — every chapter carries its own
                      status here. The Home shelf says it once in a legend
                      because it is a preview; Learn is the curriculum, and
                      a student reading the book in order must be able to
                      tell, plate by plate, what is open and what is not. */}
                  <p className="mt-1 text-sm text-ink-500">
                    {live ? c.statusLine : 'Being written'}
                  </p>
                </div>
              </>
            );
            return (
              <li
                key={c.officialChapterId}
                className="w-[64vw] shrink-0 snap-start overflow-hidden rounded-[1.5rem] sm:w-[38vw] lg:w-auto"
                style={{ background: `${a}12` }}
              >
                {/* Unavailable chapters are drawn, never tappable. */}
                {live ? (
                  <button
                    type="button"
                    onClick={() => onOpenChapter(c.officialChapterId)}
                    className="tap block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
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
