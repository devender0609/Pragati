// ===========================================================================
// v0.76 §5/§6 — THE CURRICULUM AS A PLACE.
//
// v0.75's Learn screen was, in its own words, "ten repeated white rows".
// It had already been through two rounds of restyling — v0.69 made the
// rows prettier, v0.70 split them into three registers — and it still
// read as a list, because a list is what it was. Ten rectangles of the
// same size in one column is a list however they are decorated.
//
// The fix §6 asks for is a curriculum WORLD: a featured chapter given
// real space and real artwork, and the rest of the book laid out as
// something you look across rather than scroll down.
//
// So the unit here is a PLATE, not a card:
//
//   - the artwork is the plate, not an icon inside it;
//   - the chapter's hue colours the whole plate, not one chip on it;
//   - an upcoming chapter is the SAME plate drawn quietly, so the book
//     reads as ten real places of which one is open, rather than one
//     button and nine disabled boxes.
//
// The book's order is never rearranged inside a group and the chapter
// number is on every plate, so a student can always see where a chapter
// sits in Ganita Prakash.
// ===========================================================================

import { ChapterArtwork } from './ChapterArtwork';
import { chapterAccent, motifForChapter } from './ChapterMotif';
import { Band } from './Composition';

export type PlateChapter = {
  officialChapterId: string;
  number: number;
  title: string;
  available: boolean;
  /** Short factual line — "4 of 9 parts ready", "Being written". */
  statusLine: string;
};

// ---------------------------------------------------------------------------
// The hero band
// ---------------------------------------------------------------------------

/**
 * The featured chapter, as a field rather than a card.
 *
 * §4's complaint about v0.75 was precise: most of the page is white and
 * grey with one violet element on it. This is the answer — the top of
 * the page IS the chapter, in the chapter's own colour, with the
 * chapter's mathematics drawn at 38% of the composition on desktop.
 *
 * The artwork is not decoration behind the text. It has its own column,
 * because §5 asks for mathematical visuals as product identity and a
 * drawing at 12% opacity behind a headline is wallpaper.
 */
export function ChapterHeroBand({
  chapter,
  kicker,
  headline,
  detail,
  actionLabel,
  onAction,
  meta,
  aside,
}: {
  chapter: PlateChapter;
  /** Small line above the title — a chapter number, or where you left off. */
  kicker: string;
  /** Defaults to the chapter title. */
  headline?: string;
  detail?: string;
  actionLabel: string;
  onAction: () => void;
  /** A short factual line under the action — counts, never claims. */
  meta?: string;
  /** Optional second column of real content, shown at lg instead of art. */
  aside?: React.ReactNode;
}) {
  const accent = chapterAccent(chapter.number);
  const motif = motifForChapter(chapter.officialChapterId);
  return (
    <Band tone="chapter" accent={accent}>
      <div className="grid items-center gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_40%] lg:gap-12 lg:px-14 lg:py-12">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-saffron-300">{kicker}</p>
          <h1 className="mt-2 font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            {headline ?? chapter.title}
          </h1>
          {detail ? (
            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-white/80 lg:text-lg">
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
          {meta ? (
            <p className="mt-4 text-sm text-white/60">{meta}</p>
          ) : null}
        </div>

        {/* The mathematics, at the scale §5 asks for. Hidden below sm
            only if an aside replaces it — otherwise a phone still gets
            the drawing, simplified by its own smaller box rather than
            reduced to an icon. */}
        {aside ?? (
          <div className="relative order-first lg:order-none">
            <ChapterArtwork
              motif={motif}
              accent={accent}
              tone="onDark"
              lattice={false}
              className="h-44 w-full sm:h-60 lg:h-[19rem]"
            />
          </div>
        )}
      </div>
    </Band>
  );
}

// ---------------------------------------------------------------------------
// Plates
// ---------------------------------------------------------------------------

/**
 * One chapter, as a plate.
 *
 * `size` is a composition decision, not a status one: a wide plate says
 * "this is where the page wants you to look", never "this chapter is
 * better". Availability is carried by tone and by words.
 */
export function ChapterPlate({
  chapter,
  size = 'md',
  onOpen,
}: {
  chapter: PlateChapter;
  size?: 'md' | 'lg';
  onOpen?: (officialChapterId: string) => void;
}) {
  const accent = chapterAccent(chapter.number);
  const motif = motifForChapter(chapter.officialChapterId);
  // An upcoming chapter is drawn, not tappable.
  //
  // I briefly made these tappable so the plate could open the page that
  // explains what the chapter will cover, and the suite stopped me:
  // v0.63 §11 and v0.69 §34 both pin "unavailable chapters are
  // non-interactive", because a chapter that accepts a tap and then has
  // nothing in it was the original defect — a student tapping into an
  // empty room learns that the app lies about what it has. The tests
  // were right and I was wrong; reverted.
  //
  // §6's "beautifully muted" is satisfied by the drawing, which is the
  // same drawing the open chapters get, at a quieter tone.
  const open = chapter.available;
  const tappable = !!onOpen && open;

  const art = (
    <div
      className="relative overflow-hidden rounded-2xl"
      // The drawing needs its own field or it dissolves into the plate.
      // On a quiet plate that field is white, not more paper.
      style={{ backgroundColor: open ? `${accent}12` : '#FFFFFFAA' }}
    >
      <ChapterArtwork
        motif={motif}
        accent={accent}
        tone={open ? 'onLight' : 'quiet'}
        className={size === 'lg' ? 'h-44 w-full sm:h-56' : 'h-28 w-full'}
      />
    </div>
  );

  const label = (
    <div className="mt-4 min-w-0">
      <p className="num text-xs font-semibold tracking-wide" style={{ color: open ? accent : '#8A8172' }}>
        Chapter {chapter.number}
      </p>
      <p
        className={`mt-1 font-display font-bold leading-tight ${
          size === 'lg' ? 'text-xl sm:text-2xl' : 'text-[0.95rem]'
        } ${open ? 'text-ink-900' : 'text-ink-400'}`}
      >
        {chapter.title}
      </p>
      <p className={`mt-1.5 text-[0.8rem] ${open ? 'text-ink-500' : 'text-ink-300'}`}>
        {chapter.statusLine}
      </p>
    </div>
  );

  const skin = open
    ? 'bg-white shadow-[0_1px_2px_rgba(13,20,38,0.04),0_10px_30px_-12px_rgba(13,20,38,0.18)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(13,20,38,0.05),0_20px_44px_-14px_rgba(13,20,38,0.28)]'
    : 'bg-paper-200/70 hover:bg-paper-200';

  if (!tappable) {
    return (
      <div className={`rounded-3xl p-3 ${skin}`}>
        {art}
        {label}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen?.(chapter.officialChapterId)}
      className={`tap group block w-full rounded-3xl p-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${skin}`}
    >
      {art}
      {label}
    </button>
  );
}
