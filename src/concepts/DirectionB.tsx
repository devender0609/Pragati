// ===========================================================================
// v0.77 — DIRECTION B: "LEARNING JOURNEY"
//
// THE IDEA
//
// The page is not a list of chapters. It is one continuous line that
// travels through all ten of them, and the student is somewhere on it.
//
// The line is drawn as a kolam is drawn: a single stroke that never
// lifts, threading a lattice of stations. That is not decoration here —
// it is the layout. Every chapter is a point ON the line, so book order,
// distance travelled and distance remaining are all read off one figure
// instead of being stated in three separate labels.
//
// The current chapter is a large station with its artwork inside it; the
// parts of that chapter branch off the line as short stops. Chapters
// still being written stay on the line, drawn quietly. The book is
// never rearranged and nothing unavailable is tappable (§17).
//
// WHERE IT IS STRONG   exploration and progress are the same picture.
//                      A student can see where they are. It is the only
//                      one of the three that gets better as a student
//                      accumulates history.
// WHERE IT IS WEAK     a path implies a fixed route through mathematics,
//                      which is a curriculum claim Pragati should be
//                      careful about making. It is also the hardest of
//                      the three to keep elegant at 390px.
// ===========================================================================

import { ChapterArtwork } from '../design/ChapterArtwork';
import { chapterAccent, motifForChapter } from '../design/ChapterMotif';
import { PragatiMark } from '../design/Brand';
import type { ConceptChapter, ConceptData } from './main';

/**
 * Station positions, in percentages of the journey box.
 *
 * A serpentine: left to right along the top, dropping and returning
 * right to left. Computed rather than hand-placed so ten chapters or
 * fourteen both lay out.
 */
function stations(n: number, wide: boolean) {
  const pts: { x: number; y: number }[] = [];
  if (wide) {
    const perRow = Math.ceil(n / 2);
    for (let i = 0; i < n; i += 1) {
      const row = Math.floor(i / perRow);
      const idx = i % perRow;
      const t = perRow === 1 ? 0.5 : idx / (perRow - 1);
      const x = row === 0 ? 8 + t * 84 : 92 - t * 84;
      const y = (row === 0 ? 26 : 74) + Math.sin(t * Math.PI * 2) * 9;
      pts.push({ x, y });
    }
  } else {
    for (let i = 0; i < n; i += 1) {
      const t = i / (n - 1);
      pts.push({ x: 50 + Math.sin(i * 1.05) * 30, y: 5 + t * 90 });
    }
  }
  return pts;
}

function pathThrough(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i += 1) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const mx = (p0.x + p1.x) / 2;
    d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function Journey({
  chapters,
  current,
  wide,
}: {
  chapters: ConceptChapter[];
  current: ConceptChapter;
  wide: boolean;
}) {
  const pts = stations(chapters.length, wide);
  return (
    <div className={`relative w-full ${wide ? 'aspect-[16/6.4]' : 'aspect-[3/5]'}`}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <path
          d={pathThrough(pts)}
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth={wide ? 0.5 : 0.9}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/*
          The first capture drew a saffron "travelled" segment from the
          start of the book to the open chapter. It looked good and it
          was a lie: this student has finished nothing, and a filled
          line through six chapters says they finished six. §17 —
          visual redesign must not alter what the product claims.
          The line is now uniform, and the only emphasis on it is the
          ring around the chapter that is genuinely open.
        */}
      </svg>

      {chapters.map((c, i) => {
        const p = pts[i];
        const isCurrent = c.officialChapterId === current.officialChapterId;
        const a = chapterAccent(c.number);
        return (
          <div
            key={c.officialChapterId}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {isCurrent ? (
              <div className="flex flex-col items-center">
                <div
                  className="relative grid h-32 w-32 place-items-center rounded-full ring-4 ring-saffron-400 sm:h-44 sm:w-44"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, ${a}CC, #0D1426 78%)`,
                  }}
                >
                  <ChapterArtwork
                    motif={motifForChapter(c.officialChapterId)}
                    accent={a}
                    tone="onDark"
                    lattice={false}
                    className="h-24 w-24 sm:h-32 sm:w-32"
                  />
                </div>
                <p className="num mt-3 text-xs font-bold text-saffron-300">
                  Chapter {c.number}
                </p>
                <p className="font-display text-lg font-extrabold text-white sm:text-2xl">
                  {c.title}
                </p>
                <button className="tap mt-3 rounded-full bg-white px-6 py-2 font-display text-sm font-bold text-ink-900">
                  Continue here
                </button>
              </div>
            ) : (
              <div className="flex w-28 flex-col items-center text-center sm:w-32">
                <span
                  className="grid h-20 w-20 place-items-center rounded-full ring-1 ring-white/15 sm:h-24 sm:w-24"
                  style={{ background: `radial-gradient(circle at 32% 26%, ${a}33, rgba(255,255,255,0.04) 72%)` }}
                >
                  <ChapterArtwork
                    motif={motifForChapter(c.officialChapterId)}
                    accent={a}
                    tone="onDark"
                    lattice={false}
                    className="h-16 w-16 opacity-70 sm:h-20 sm:w-20"
                  />
                </span>
                <span className="num mt-2 text-[0.7rem] font-bold text-white/45">
                  {String(c.number).padStart(2, '0')}
                </span>
                <span className="mt-0.5 text-[0.72rem] font-semibold leading-tight text-white/60">
                  {c.title}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DirectionB({ data }: { data: ConceptData }) {
  const accent = chapterAccent(data.current.number);
  return (
    <div className="min-h-screen bg-paper-100">
      {/* The journey occupies the whole first screen. */}
      <section className="relative overflow-hidden bg-ink-950 pb-16">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(80% 90% at 20% 10%, ${accent}4D 0%, transparent 62%), radial-gradient(60% 80% at 92% 96%, #0EA5E933 0%, transparent 60%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-lattice text-white/[0.09] [background-size:30px_30px]"
        />

        <header className="relative mx-auto flex max-w-[92rem] items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-3">
            <PragatiMark className="h-9 w-9" />
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              Pragati
            </span>
          </div>
          <nav className="hidden gap-1 rounded-full bg-white/10 p-1 text-sm font-semibold text-white/70 sm:flex">
            <span className="rounded-full bg-white px-4 py-1.5 text-ink-900">Home</span>
            <span className="px-4 py-1.5">Learn</span>
            <span className="px-4 py-1.5">Practice</span>
            <span className="px-4 py-1.5">Progress</span>
          </nav>
          <p className="text-sm text-white/60">
            <span className="font-semibold text-white">{data.studentName}</span>
            <span className="mx-2 text-white/25">/</span>
            {data.gradeLabel}
          </p>
        </header>

        <div className="relative mx-auto max-w-[92rem] px-6 pt-6 lg:px-10">
          <h1 className="max-w-[22ch] font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl">
            Your way through Class 6 mathematics
          </h1>
          <p className="mt-4 max-w-[52ch] text-lg text-white/65">
            Ten chapters, in the order your textbook teaches them. One is open
            for you now.
          </p>
        </div>

        <div className="relative mx-auto mt-4 hidden max-w-[92rem] px-6 lg:block lg:px-10">
          <Journey chapters={data.chapters} current={data.current} wide />
        </div>
        <div className="relative mx-auto mt-8 max-w-[26rem] px-6 lg:hidden">
          <Journey chapters={data.chapters} current={data.current} wide={false} />
        </div>
      </section>

      {/* The current leg, broken into its stops. */}
      <section className="mx-auto max-w-[92rem] px-6 py-14 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="num text-sm font-bold" style={{ color: accent }}>
              Chapter {data.current.number}
            </p>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink-900 lg:text-4xl">
              Practice on this leg
            </h2>
            <ol className="relative mt-8 pl-10">
              <span
                aria-hidden
                className="absolute bottom-6 left-[13px] top-6 w-[3px] rounded"
                style={{ background: `${accent}33` }}
              />
              {data.practice.map((p, i) => (
                <li key={p.name} className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-10 top-1 grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white"
                    style={{ background: accent }}
                  >
                    {i + 1}
                  </span>
                  <p className="mt-0.5 font-display text-xl font-bold text-ink-900">
                    {p.name}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-6 pl-10 text-ink-400">
              The chapter's own {data.partsTotal} lessons are awaiting review.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-practice-100 p-8">
              <h3 className="font-display text-2xl font-extrabold text-practice-900">
                Practise what you know
              </h3>
              <p className="mt-2 leading-relaxed text-practice-900/70">
                Short sets drawn only from stops you have already passed.
              </p>
              <button className="tap mt-5 rounded-full bg-practice-700 px-6 py-2.5 font-display text-sm font-bold text-white">
                Start a set
              </button>
            </div>
            <div className="rounded-[2rem] bg-ink-900 p-8 text-white">
              <h3 className="font-display text-2xl font-extrabold">
                Distance travelled
              </h3>
              <p className="mt-2 leading-relaxed text-white/60">
                Nothing recorded yet. As you finish sets, the line above fills
                in — from what you actually did, never estimated.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
