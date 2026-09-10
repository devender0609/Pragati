// ===========================================================================
// v0.77 — THE MATH STUDIO KIT (production).
//
// Promoted from the concept harness on integration. The concepts now
// re-export from here, so the approved screens and the harness that
// approved them cannot drift apart.
//
// §18 asks that Home, Learn and the lesson clearly belong to one
// product. The way to guarantee that is not a style guide, it is shared
// code: every studio surface in this round is built from the four things
// in this file, so a change to the canvas changes all three screens at
// once and none of them can drift into being its own experiment.
//
//   StudioField    the dark ground: ink, chapter-tinted light, lattice.
//   StudioHeader   one masthead, everywhere.
//   StudioCanvas   the working-size mathematics. Two layouts, because a
//                  390px phone cannot hold the strip, the line and the
//                  notation in one row — which was the first note on C2.
//   PracticeGlyph  24px marks drawn FOR 24px.
// ===========================================================================

import type { ReactNode } from 'react';
import { PragatiMark } from './Brand';

// ---------------------------------------------------------------------------

export function StudioField({
  accent,
  children,
  className = '',
}: {
  accent: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative bg-ink-950 ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(66% 86% at 74% 12%, ${accent}73 0%, transparent 60%), radial-gradient(56% 66% at 3% 94%, #0D948855 0%, transparent 56%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-lattice text-white/[0.075] [background-size:34px_34px]"
      />
      <div className="relative">{children}</div>
    </section>
  );
}

export function StudioHeader({
  studentName,
  gradeLabel,
  active,
  back,
}: {
  studentName: string;
  gradeLabel: string;
  active: 'Home' | 'Learn' | 'Practice' | 'Progress';
  /** Lesson surfaces replace the nav with a way back to the chapter. */
  back?: string;
}) {
  return (
    <header className="relative mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-6 py-6 lg:px-10">
      <div className="flex items-center gap-3">
        <PragatiMark className="h-9 w-9" />
        <span className="font-display text-xl font-extrabold tracking-tight text-white">
          Pragati
        </span>
      </div>
      {back ? (
        <p className="truncate text-sm font-semibold text-white/70">‹ {back}</p>
      ) : (
        // §13 — nav stays out of the hero on mobile; it belongs to the
        // app's bottom bar once this is implemented in the product.
        <nav className="hidden gap-1 rounded-full bg-white/10 p-1 text-sm font-semibold text-white/70 sm:flex">
          {(['Home', 'Learn', 'Practice', 'Progress'] as const).map((t) => (
            <span
              key={t}
              className={
                t === active
                  ? 'rounded-full bg-white px-4 py-1.5 text-ink-900'
                  : 'px-4 py-1.5'
              }
            >
              {t}
            </span>
          ))}
        </nav>
      )}
      <p className="whitespace-nowrap text-sm text-white/60">
        <span className="font-semibold text-white">{studentName}</span>
        <span className="mx-2 text-white/25">/</span>
        {gradeLabel}
      </p>
    </header>
  );
}

// ---------------------------------------------------------------------------
// The canvas
// ---------------------------------------------------------------------------

export const CHOICES: Array<[number, number]> = [
  [1, 2],
  [2, 3],
  [3, 4],
  [3, 5],
  [5, 6],
];

const SPOKEN: Record<number, [string, string]> = {
  2: ['half', 'halves'],
  3: ['third', 'thirds'],
  4: ['quarter', 'quarters'],
  5: ['fifth', 'fifths'],
  6: ['sixth', 'sixths'],
};

export function spoken(n: number, d: number) {
  const s = SPOKEN[d];
  return s ? `${n} ${n === 1 ? s[0] : s[1]}` : `${n} over ${d}`;
}

/**
 * Three representations of one number, at working size, in step.
 *
 * TWO LAYOUTS, for one reason. At 390 the first C2 put the strip, the
 * line and the 74px notation in one row and the notation squeezed the
 * diagram to about 220px — the mathematics lost the argument to its own
 * label. `stacked` gives the diagram the full width and drops the
 * notation onto its own row beneath, where it stays large.
 *
 * The dashed connector runs from the boundary of the shaded part of the
 * strip to the point on the line, so "these are the same number" is
 * drawn rather than claimed in a sentence.
 *
 * Motion is CSS on geometry only, so the global `prefers-reduced-motion`
 * rule in index.css removes the movement and every figure still lands in
 * the right place.
 */
export function StudioCanvas({
  n,
  d,
  layout,
  onPick,
  className = '',
}: {
  n: number;
  d: number;
  layout: 'wide' | 'stacked';
  onPick?: (n: number, d: number) => void;
  className?: string;
}) {
  const wide = layout === 'wide';
  const W = wide ? 720 : 400;
  const H = wide ? 330 : 400;
  const x0 = 26;
  const x1 = wide ? W - 168 : W - 26;
  const cell = (x1 - x0) / d;
  const edge = x0 + cell * n;
  const barY = wide ? 34 : 30;
  const barH = wide ? 100 : 84;
  const lineY = wide ? 244 : 200;
  const ease = 'cubic-bezier(.4,0,.2,1)';
  const notation = wide
    ? { x: W - 82, y: barY + 84, size: 74 }
    : { x: W / 2, y: 330, size: 78 };

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        role="img"
        aria-label={`A bar split into ${d} equal parts with ${n} shaded, and the same length marked on a number line: ${spoken(n, d)}.`}
      >
        <rect
          x={x0}
          y={barY}
          width={cell * n}
          height={barH}
          fill="#8B7BF7"
          style={{ transition: `width 420ms ${ease}` }}
        />
        {Array.from({ length: d }).map((_, i) => (
          <rect
            key={i}
            x={x0 + i * cell}
            y={barY}
            width={cell}
            height={barH}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={2.5}
            style={{ transition: `x 420ms ${ease}, width 420ms ${ease}` }}
          />
        ))}

        <line
          x1={edge}
          y1={barY + barH}
          x2={edge}
          y2={lineY}
          stroke="#F7BE4C"
          strokeWidth={2}
          strokeDasharray="5 7"
          opacity={0.7}
          style={{ transition: `x1 420ms ${ease}, x2 420ms ${ease}` }}
        />

        <line x1={x0} y1={lineY} x2={x1} y2={lineY} stroke="rgba(255,255,255,0.45)" strokeWidth={2.5} />
        {Array.from({ length: d + 1 }).map((_, i) => (
          <line
            key={i}
            x1={x0 + i * cell}
            y1={lineY - 11}
            x2={x0 + i * cell}
            y2={lineY + 11}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth={2}
            style={{ transition: `x1 420ms ${ease}, x2 420ms ${ease}` }}
          />
        ))}
        <line
          x1={x0}
          y1={lineY}
          x2={edge}
          y2={lineY}
          stroke="#F7BE4C"
          strokeWidth={6}
          strokeLinecap="round"
          style={{ transition: `x2 420ms ${ease}` }}
        />
        <circle cx={edge} cy={lineY} r={11} fill="#F7BE4C" style={{ transition: `cx 420ms ${ease}` }} />
        <text x={x0 - 4} y={lineY + 36} fill="rgba(255,255,255,0.5)" fontSize={18} fontFamily="Inter, sans-serif">
          0
        </text>
        <text x={x1 - 8} y={lineY + 36} fill="rgba(255,255,255,0.5)" fontSize={18} fontFamily="Inter, sans-serif">
          1
        </text>

        <g transform={`translate(${notation.x}, ${notation.y})`}>
          <text
            textAnchor="middle"
            y={-30}
            fill="#ffffff"
            fontSize={notation.size}
            fontWeight={700}
            fontFamily="Anek Latin, Inter, sans-serif"
          >
            {n}
          </text>
          <line x1={-40} x2={40} y1={-6} y2={-6} stroke="#F7BE4C" strokeWidth={5} strokeLinecap="round" />
          <text
            textAnchor="middle"
            y={62}
            fill="#ffffff"
            fontSize={notation.size}
            fontWeight={700}
            fontFamily="Anek Latin, Inter, sans-serif"
          >
            {d}
          </text>
          <text
            textAnchor="middle"
            y={98}
            fill="rgba(255,255,255,0.55)"
            fontSize={18}
            fontFamily="Inter, sans-serif"
          >
            {spoken(n, d)}
          </text>
        </g>
      </svg>

      {onPick ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-white/45">Try another:</span>
          {CHOICES.map(([cn, cd]) => {
            const on = cn === n && cd === d;
            return (
              <button
                key={`${cn}/${cd}`}
                type="button"
                onClick={() => onPick(cn, cd)}
                aria-pressed={on}
                className={`tap num rounded-full px-4 py-2 text-sm font-bold transition ${
                  on ? 'bg-saffron-400 text-ink-950' : 'bg-white/10 text-white/75 hover:bg-white/20'
                }`}
              >
                {cn}/{cd}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------

/**
 * A distinct glyph per practice activity.
 *
 * C2's first capture reused ChapterArtwork at 32px, which crushed a
 * three-representation drawing into a smudge — the "tiny icon" failure,
 * reintroduced by me at small size. These are drawn for 24px: four
 * strokes each, and each says which activity it is rather than saying
 * "fractions" four times.
 */
export function PracticeGlyph({ kind }: { kind: number }) {
  const S = {
    fill: 'none',
    stroke: 'rgba(255,255,255,0.92)',
    strokeWidth: 1.7,
    strokeLinejoin: 'round' as const,
  };
  const F = 'rgba(255,255,255,0.92)';
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      {kind === 0 && (
        <>
          <rect x={2} y={7} width={5} height={10} fill={F} />
          {[2, 7, 12, 17].map((x) => (
            <rect key={x} x={x} y={7} width={5} height={10} {...S} />
          ))}
        </>
      )}
      {kind === 1 && (
        <>
          <rect x={2} y={7} width={9} height={10} fill={F} />
          <rect x={2} y={7} width={9} height={10} {...S} />
          <rect x={13} y={7} width={9} height={10} {...S} />
          <rect x={13} y={7} width={4.5} height={10} fill={F} />
        </>
      )}
      {kind === 2 && (
        <>
          <rect x={2} y={4} width={10} height={6} fill={F} />
          <rect x={2} y={4} width={20} height={6} {...S} />
          <rect x={2} y={14} width={10} height={6} fill={F} />
          {[2, 7, 12, 17].map((x) => (
            <rect key={x} x={x} y={14} width={5} height={6} {...S} />
          ))}
        </>
      )}
      {kind === 3 && (
        <>
          <rect x={1} y={8} width={8} height={8} {...S} />
          <rect x={1} y={8} width={4} height={8} fill={F} />
          <path d="M11 12h4M13 10v4" stroke={F} strokeWidth={1.8} strokeLinecap="round" />
          <rect x={15} y={8} width={8} height={8} {...S} />
          <rect x={15} y={8} width={2.6} height={8} fill={F} />
        </>
      )}
    </svg>
  );
}
