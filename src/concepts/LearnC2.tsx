// ===========================================================================
// v0.77 §6-§9 — CLASS 6 LEARN, IN THE STUDIO.
//
// The shipped Learn screen is a hero plus a grid of tiles. It is tidier
// than v0.75's ten white rows and it is still a catalogue.
//
// The composition here has three registers rather than one, because a
// curriculum genuinely has three:
//
//   OPEN NOW      the chapter a student can actually work in, given a
//                 studio of its own — the same dark field as Home, the
//                 chapter's artwork at 40% of the composition, and the
//                 activities that genuinely open listed inside it.
//   THE BOOK      all ten chapters as a station rail. §9 said B's
//                 station idea may reduce repetition but the serpentine
//                 was rejected: this takes the node, not the path. A
//                 single straight rule with ten nodes on it carries
//                 book order without drawing a route through
//                 mathematics, and without a filled progress line —
//                 availability and progress stay separate.
//   THE CHAPTERS  the full plates below the rail, artwork at scale.
//
// Every one of the ten verified chapters appears in all three registers
// or in two of them; none is omitted, none is reordered, and nothing
// unavailable is interactive.
// ===========================================================================

import { ChapterArtwork } from '../design/ChapterArtwork';
import { chapterAccent, motifForChapter } from '../design/ChapterMotif';
import { PracticeGlyph, StudioCanvas, StudioField, StudioHeader } from './studio';
import type { ConceptChapter, ConceptData } from './main';

function StationRail({ chapters }: { chapters: ConceptChapter[] }) {
  return (
    <div className="relative px-6 lg:px-10">
      {/* One rule, ten nodes. No filled segment: this line says "the book
          is in this order", never "you have travelled this far". */}
      <div
        aria-hidden
        className="absolute left-6 right-6 top-[27px] h-px bg-ink-900/15 lg:left-10 lg:right-10"
      />
      <ol className="relative flex items-start justify-between gap-1">
        {chapters.map((c) => {
          const a = chapterAccent(c.number);
          const live = c.hasPractice || c.hasOfficialLesson;
          return (
            <li key={c.officialChapterId} className="flex min-w-0 flex-1 flex-col items-center">
              {/* §2 — the first version drew unavailable nodes as beige
                  discs with artwork at about a tenth of the contrast of
                  the live one. Muted had become invisible, which is the
                  same failure as a grey disabled box wearing better
                  clothes. The motif is now drawn at full chapter hue on a
                  tinted disc with a real outline; only saturation and the
                  ring separate available from upcoming. */}
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
              <span className={`num mt-2 text-xs font-bold ${live ? 'text-ink-900' : 'text-ink-500'}`}>
                {String(c.number).padStart(2, '0')}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function LearnC2({ data }: { data: ConceptData }) {
  const c = data.current;
  const accent = chapterAccent(c.number);
  const rest = data.chapters.filter((x) => x.officialChapterId !== c.officialChapterId);

  return (
    <div className="min-h-screen bg-paper-100">
      <StudioField accent={accent} className="pb-40 lg:pb-44">
        <StudioHeader
          studentName={data.studentName}
          gradeLabel={data.gradeLabel}
          active="Learn"
        />

        <div className="mx-auto max-w-[92rem] px-6 pt-4 lg:px-10 lg:pt-6">
          <p className="font-display text-lg font-bold text-saffron-300">Ganita Prakash</p>
          <h1 className="mt-2 max-w-[18ch] font-display text-[2.5rem] font-extrabold leading-[0.96] tracking-[-0.03em] text-white sm:text-5xl lg:text-[4rem]">
            Class 6 mathematics
          </h1>
          <p className="mt-4 max-w-[54ch] text-lg leading-relaxed text-white/65">
            Ten chapters, in the order your textbook teaches them. One is open
            for you to work in now.
          </p>
        </div>

        {/* OPEN NOW — a studio, not a tile. */}
        <div className="mx-auto mt-10 grid max-w-[92rem] items-center gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-14 lg:px-10">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="num font-display text-5xl font-extrabold leading-none text-white/25">
                {String(c.number).padStart(2, '0')}
              </span>
              <span className="font-display text-lg font-bold text-saffron-300">
                Open now
              </span>
            </div>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white lg:text-6xl">
              {c.title}
            </h2>
            <p className="mt-4 max-w-[42ch] text-lg leading-relaxed text-white/70">
              Equal parts, number lines, equivalence, mixed fractions, and
              adding and subtracting.
            </p>

            <ul className="mt-7 grid gap-x-8 sm:grid-cols-2">
              {data.practice.map((a, i) => (
                <li key={a.name}>
                  <button
                    type="button"
                    className="tap group flex w-full items-center gap-3 border-b border-white/10 py-3.5 text-left transition hover:border-saffron-400/60"
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
                    <span className="text-white/30 transition group-hover:text-saffron-300">›</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-white/45">
              Chapter lessons are being prepared. Practice is available now.
            </p>
            <button className="tap mt-7 rounded-full bg-white px-8 py-3.5 font-display text-base font-bold text-ink-950 transition hover:bg-saffron-100">
              Open {c.title}
            </button>
          </div>

          {/* §1/§5 — Learn opens the way Home opens. The static plate was
              pale line-art next to Home's filled, live figure, which made
              going deeper into the same chapter feel like arriving at a
              different product. It is now the same canvas, and it also
              occupies the ink that was dead to the right of the practice
              list. */}
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
      </StudioField>

      {/* THE BOOK — station rail, on a card that overlaps the field. */}
      <section className="relative z-10 mx-auto -mt-28 max-w-[92rem] px-6 lg:-mt-32 lg:px-10">
        <div className="overflow-hidden rounded-[1.75rem] bg-white py-7 shadow-[0_24px_70px_-34px_rgba(13,20,38,0.5)]">
          <p className="px-6 font-display text-lg font-bold text-ink-900 lg:px-10">
            The whole book, in order
          </p>
          <div className="mt-5 overflow-x-auto">
            <div className="min-w-[46rem]">
              <StationRail chapters={data.chapters} />
            </div>
          </div>
        </div>
      </section>

      {/* THE CHAPTERS */}
      <section className="mx-auto max-w-[92rem] py-14 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-6 lg:px-10">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 lg:text-[2.5rem]">
            Chapters coming later
          </h2>
          <p className="max-w-[46ch] text-ink-400">
            Every chapter of your textbook is here. These are being written —
            they open as they are ready.
          </p>
        </div>

        {/* §3/§4 — responsive composition, not one composition scaled.
            Below lg this is Home's snapping shelf, which took Learn from
            3,024px to a page a student can actually thumb through; at lg
            the richer plate grid stays. All ten chapters are present in
            both: the rail above carries the whole book, and nothing was
            dropped to shorten the page. */}
        <ul className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 lg:grid lg:grid-cols-3 lg:gap-7 lg:overflow-visible lg:px-10">
          {rest.map((x) => {
            const a = chapterAccent(x.number);
            return (
              <li
                key={x.officialChapterId}
                className="w-[64vw] shrink-0 snap-start overflow-hidden rounded-[1.5rem] sm:w-[38vw] lg:w-auto"
                style={{ background: `${a}12` }}
              >
                <div className="px-4 pt-5">
                  <ChapterArtwork
                    motif={motifForChapter(x.officialChapterId)}
                    accent={a}
                    tone="quiet"
                    className="h-28 w-full lg:h-40"
                  />
                </div>
                <div className="px-5 pb-6 pt-4">
                  <p className="num text-xs font-bold text-ink-300">
                    Chapter {x.number}
                  </p>
                  <p className="mt-1 font-display text-lg font-bold leading-tight text-ink-500 lg:text-xl">
                    {x.title}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
