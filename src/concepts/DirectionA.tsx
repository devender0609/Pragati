// ===========================================================================
// v0.77 — DIRECTION A: "MATHEMATICAL EDITORIAL"
//
// THE IDEA
//
// A serious publication about mathematics, not a dashboard about a
// student. Scale, rules and whitespace do the grouping; there is not a
// single card on the page.
//
// The move that makes it work is TYPE AT PUBLICATION SCALE. v0.76's
// Home set its largest word at 52px in a 1344px page — magazine
// proportions would put it at three times that. Here the chapter title
// is 96px, the chapter numeral is set as a 380px ghost behind it, and
// the section numbers in the contents are display type rather than
// captions. Nothing is 12px except things that are genuinely secondary.
//
// The artwork is cropped by the page edge on purpose. A drawing that
// fits neatly inside its box reads as an illustration slot; a drawing
// that runs off the edge reads as a plate, and implies there is more of
// it than the page can hold.
//
// WHERE IT IS STRONG   calm, expensive, unmistakably about mathematics,
//                      ages up cleanly to Class 12.
// WHERE IT IS WEAK     it is a magazine, and a magazine does not convey
//                      progress. A student six chapters in has nothing
//                      here that feels like six chapters.
// ===========================================================================

import { ChapterArtwork } from '../design/ChapterArtwork';
import { chapterAccent, motifForChapter } from '../design/ChapterMotif';
import { PragatiMark } from '../design/Brand';
import type { ConceptData } from './main';

const ROMAN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export function DirectionA({ data }: { data: ConceptData }) {
  const accent = chapterAccent(data.current.number);
  const motif = motifForChapter(data.current.officialChapterId);

  return (
    <div className="min-h-screen bg-paper-100 text-ink-900">
      {/* MASTHEAD — a rule and some type. No bar, no card, no pills. */}
      <header className="mx-auto flex max-w-[92rem] items-center justify-between gap-6 border-b border-ink-900/10 px-6 py-5 lg:px-10">
        <div className="flex items-center gap-3">
          <PragatiMark className="h-9 w-9" />
          <span className="font-display text-xl font-extrabold tracking-tight">
            Pragati
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-[0.95rem] font-semibold sm:flex">
          <span className="border-b-2 border-saffron-400 pb-1 text-ink-900">Home</span>
          <span className="text-ink-400">Learn</span>
          <span className="text-ink-400">Practice</span>
          <span className="text-ink-400">Progress</span>
        </nav>
        <p className="text-sm text-ink-400">
          <span className="font-semibold text-ink-800">{data.studentName}</span>
          <span className="mx-2 text-ink-200">/</span>
          {data.gradeLabel}
        </p>
      </header>

      {/* HERO — full bleed ink, asymmetric, artwork cropped by the edge. */}
      <section className="relative overflow-hidden bg-ink-950">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(90% 120% at 12% 0%, ${accent}59 0%, transparent 60%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-lattice text-white/[0.10] [background-size:26px_26px]"
        />
        {/* The chapter numeral, set as a ghost plate behind the title. */}
        <span
          aria-hidden
          className="num pointer-events-none absolute right-[-2rem] top-1/2 hidden -translate-y-1/2 font-display font-extrabold leading-none text-white/[0.07] lg:block"
          style={{ fontSize: '32rem' }}
        >
          {String(data.current.number).padStart(2, '0')}
        </span>

        <div className="relative mx-auto grid max-w-[92rem] items-center gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-4 lg:px-10 lg:py-24">
          <div className="max-w-[34rem]">
            <p className="font-display text-xl font-bold text-saffron-300">
              Chapter {ROMAN[data.current.number] ?? data.current.number}
            </p>
            <h1 className="mt-4 font-display text-[3.5rem] font-extrabold leading-[0.92] tracking-[-0.035em] text-white sm:text-[5rem] lg:text-[6rem]">
              {data.current.title}
            </h1>
            <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-white/70">
              Build, compare and reason with fractions. {data.partsTotal}{' '}
              sections in this chapter; {data.practice.length} practice
              activities open now.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <button className="tap inline-flex items-center rounded-none bg-saffron-400 px-9 py-4 font-display text-lg font-bold text-ink-950 transition hover:bg-saffron-300">
                Explore {data.current.title}
              </button>
              <span className="text-sm text-white/50">{data.current.statusLine}</span>
            </div>
          </div>

          {/* Cropped plate. Scaled past its column and clipped by the
              section, so the drawing reads as bigger than the page. */}
          <div className="relative -mr-24 hidden lg:block">
            <ChapterArtwork
              motif={motif}
              accent={accent}
              tone="onDark"
              lattice={false}
              className="h-[30rem] w-full"
            />
          </div>
          <div className="lg:hidden">
            <ChapterArtwork
              motif={motif}
              accent={accent}
              tone="onDark"
              lattice={false}
              className="h-48 w-full"
            />
          </div>
        </div>
      </section>

      {/* CONTENTS — an editorial index. Display-scale numbers, hairlines,
          one offset rail. No boxes. */}
      <section className="mx-auto max-w-[92rem] px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-24">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight lg:text-[2.75rem]">
              Inside this chapter
            </h2>
            <p className="mt-3 max-w-[46ch] text-lg text-ink-500">
              {data.practice.length} of {data.partsTotal} parts are open. The rest
              are still being written.
            </p>
            <ul className="mt-10">
              {data.practice.map((p, i) => (
                <li
                  key={p.name}
                  className="group flex items-baseline gap-7 border-t border-ink-900/10 py-6 last:border-b"
                >
                  <span
                    className="num font-display text-4xl font-extrabold leading-none"
                    style={{ color: `${accent}66` }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-display text-xl font-bold leading-snug lg:text-2xl">
                    {p.name}
                  </span>
                  <span className="text-sm font-semibold text-ink-400 transition group-hover:text-ink-900">
                    Open
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:pt-4">
            <div className="border-t-4 border-saffron-400 pt-6">
              <h3 className="font-display text-2xl font-extrabold tracking-tight">
                Practise what you know
              </h3>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-500">
                Short sets built only from parts you have already worked
                through. Nothing appears here before you have met it.
              </p>
              <p className="mt-5 font-display text-lg font-bold text-ink-900 underline decoration-saffron-400 decoration-4 underline-offset-8">
                Start a set
              </p>
            </div>
            <div className="mt-14 border-t border-ink-900/10 pt-6">
              <h3 className="font-display text-xl font-extrabold tracking-tight">
                Where you are
              </h3>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-500">
                Nothing recorded yet. Your finished sets and answered
                questions will be counted here — never estimated.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* THE BOOK — plates on a ground, not tiles in a grid. */}
      <section className="bg-ink-900 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-[92rem] px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-6">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white lg:text-[2.75rem]">
              Ganita Prakash
            </h2>
            <p className="text-lg text-white/50">Ten chapters, in the book's order</p>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {data.chapters.map((c) => {
              const a = chapterAccent(c.number);
              return (
                <li key={c.officialChapterId}>
                  <div
                    className="rounded-2xl px-3 py-4"
                    style={{
                      background: c.available
                        ? `linear-gradient(155deg, ${a}E6, ${a}8C)`
                        : `${a}1F`,
                    }}
                  >
                    <ChapterArtwork
                      motif={motifForChapter(c.officialChapterId)}
                      accent={a}
                      tone="onDark"
                      lattice={false}
                      className="h-32 w-full lg:h-40"
                    />
                  </div>
                  <div className="mt-4 border-t border-white/15 pt-3">
                    <p className="num font-display text-sm font-bold text-saffron-300">
                      {String(c.number).padStart(2, '0')}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold leading-tight text-white">
                      {c.title}
                    </p>
                    <p className="mt-1 text-sm text-white/45">{c.statusLine}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
