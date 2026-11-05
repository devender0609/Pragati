// ===========================================================================
// v0.76 §4/§10 — COMPOSITION, NOT CARDS.
//
// THE DIAGNOSIS
//
// v0.75 shipped a good palette and a SURFACE vocabulary, and the screens
// still read as administrative software. The reason is structural rather
// than chromatic: every region of every screen was a rounded white
// rectangle with a hairline ring, sitting on grey. Twelve of those in a
// column is a form, whatever colour the accents are.
//
// §10 states the rule directly — before drawing a bordered rounded
// rectangle, ask whether it needs to be one. Almost nothing does. A
// heading with space under it groups content. A tint groups content. A
// coloured field groups content. A border is the weakest of the four and
// v0.75 reached for it every time.
//
// WHAT THIS MODULE PROVIDES
//
//   Band      a large field of colour that the content sits INSIDE.
//             Ink or a chapter hue, carrying the lattice. This is what
//             §4 means by "controlled areas of colour": the hero is not
//             a violet card on a grey page, the top third of the page IS
//             the hero.
//   Zone      an open tinted region. No border, no shadow, no card.
//             Semantic tone, because a Practice zone and a Learn zone
//             should not be the same colour.
//   Lede      a heading and its sentence. No all-caps eyebrow above it:
//             a tracked-out label over every heading is the single
//             commonest tell of template design, and v0.75 had one on
//             essentially every section in the product.
//   Frac      three-fifths, set the way the textbook prints it.
//
// None of these draws a border. That is the point.
// ===========================================================================

import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Band
// ---------------------------------------------------------------------------

export type BandTone = 'ink' | 'chapter';

/**
 * A full-width field of colour.
 *
 * Bleeds to the edges of the app's main padding — edge to edge on a
 * phone, container-wide on desktop. It deliberately does NOT use
 * `100vw`: that overflows the document by the scrollbar width on any
 * platform that reserves one, which is the class of bug the visual QA
 * harness exists to catch and which is cheaper not to write.
 */
export function Band({
  tone = 'ink',
  accent,
  children,
  className = '',
  rounded = true,
}: {
  tone?: BandTone;
  /** Required when tone is 'chapter'. The chapter's own hue. */
  accent?: string;
  children: ReactNode;
  className?: string;
  rounded?: boolean;
}) {
  // v0.76, second pass. The first attempt ran the chapter hue across the
  // whole field as a linear gradient, and for Fractions — whose hue is
  // violet — that reproduced the exact thing §4 complains about: one
  // violet rectangle. A hue smeared over 990×320 is not "an area of
  // colour", it is a wash.
  //
  // The field is now ink, with the chapter's hue arriving as light: a
  // broad glow from the upper left where the type sits, and a second,
  // tighter one behind the artwork. Ink stays dominant, the hue stays
  // identifiable, and two chapters in different hues read as two rooms
  // in the same building rather than two different products.
  const style =
    tone === 'chapter' && accent
      ? {
          backgroundColor: '#0D1426',
          backgroundImage: [
            `radial-gradient(120% 150% at 0% 0%, ${accent}D9 0%, ${accent}5C 34%, transparent 68%)`,
            `radial-gradient(70% 110% at 100% 88%, ${accent}66 0%, transparent 62%)`,
            'linear-gradient(160deg, #16204080 0%, #070B18 100%)',
          ].join(', '),
        }
      : {
          backgroundColor: '#0D1426',
          backgroundImage:
            'linear-gradient(140deg, #1A2544 0%, #0D1426 55%, #070B18 100%)',
        };

  return (
    <div
      className={`relative -mx-3 overflow-hidden text-white sm:-mx-4 ${
        rounded ? 'sm:rounded-[1.75rem]' : ''
      } ${className}`}
      style={style}
    >
      {/* The lattice. Sits over the gradient and under the content, at
          the alpha where it is felt rather than seen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-lattice [background-size:22px_22px] text-white/[0.17]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Zone
// ---------------------------------------------------------------------------

export type ZoneTone = 'learn' | 'practice' | 'progress' | 'attention' | 'paper';

const ZONE: Record<ZoneTone, string> = {
  // Tint only. No ring, no shadow, no border — a zone groups by colour,
  // which is what §4 asks for and what a card cannot do without also
  // adding a fourth visual edge to the screen.
  learn: 'bg-learn-50',
  practice: 'bg-practice-50',
  progress: 'bg-progress-50',
  attention: 'bg-attend-50',
  paper: 'bg-paper-200/70',
};

export function Zone({
  tone = 'paper',
  children,
  className = '',
  lattice = false,
  bleed = false,
}: {
  tone?: ZoneTone;
  children: ReactNode;
  className?: string;
  lattice?: boolean;
  /**
   * Run the tint to the edges of the app's padding.
   *
   * §4 asks for controlled AREAS of colour. A tint that stops 16px short
   * of the edge is a card with the border taken off; a tint that reaches
   * the edge is a region of the page.
   */
  bleed?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden ${
        bleed ? '-mx-3 sm:-mx-4 sm:rounded-3xl' : 'rounded-3xl'
      } ${ZONE[tone]} ${className}`}
    >
      {lattice ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-lattice-fine [background-size:14px_14px] text-ink-900/[0.06]"
        />
      ) : null}
      <div className="relative">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Lede
// ---------------------------------------------------------------------------

/**
 * A section heading and, optionally, the sentence that explains it.
 *
 * There is no eyebrow slot, on purpose. v0.75 set an uppercase tracked
 * label above almost every heading in the product — "IN FRACTIONS",
 * "YOUR CHAPTERS", "COMING SOON", "PRACTICE YOU CAN DO NOW" — and the
 * cumulative effect is a screen that shouts six small labels before it
 * says anything. Where a label genuinely carries information (a chapter
 * number, a section number) it is rendered as content, in sentence case,
 * next to the thing it labels.
 */
export function Lede({
  title,
  detail,
  action,
  level = 2,
  className = '',
}: {
  title: string;
  detail?: string;
  action?: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}) {
  const H = (level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3') as 'h1' | 'h2' | 'h3';
  const size =
    level === 1
      ? 'font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]'
      : level === 2
        ? 'font-display text-2xl font-bold leading-tight tracking-tight sm:text-[1.75rem]'
        : 'font-display text-base font-bold leading-tight sm:text-lg';
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-2 ${className}`}>
      <div className="min-w-0">
        <H className={`${size} text-ink-900`}>{title}</H>
        {detail ? (
          <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-ink-500">
            {detail}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fraction
// ---------------------------------------------------------------------------

/**
 * A fraction set as a fraction.
 *
 * "3/5" in running text is a division sign a Class 6 student has not met
 * yet, and it is not how the page in front of them is printed. This
 * stacks numerator over denominator with a real rule at the current type
 * size. The accessible name is spoken as the textbook says it, so a
 * screen reader gets "three fifths" rather than "three slash five".
 */
const NAMED_DENOMINATOR: Record<number, [string, string]> = {
  2: ['half', 'halves'],
  3: ['third', 'thirds'],
  4: ['quarter', 'quarters'],
  5: ['fifth', 'fifths'],
  6: ['sixth', 'sixths'],
  8: ['eighth', 'eighths'],
  10: ['tenth', 'tenths'],
};

export function spokenFraction(n: number, d: number): string {
  const named = NAMED_DENOMINATOR[d];
  if (!named) return `${n} over ${d}`;
  return `${n} ${n === 1 ? named[0] : named[1]}`;
}

export function Frac({
  n,
  d,
  className = '',
}: {
  n: number;
  d: number;
  className?: string;
}) {
  return (
    <span className={`frac ${className}`} role="math" aria-label={spokenFraction(n, d)}>
      <span className="frac-n" aria-hidden="true">
        {n}
      </span>
      <span className="frac-d" aria-hidden="true">
        {d}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Inline facts
// ---------------------------------------------------------------------------

/**
 * A number and what it counts, set inline rather than in a stat card.
 *
 * §10 — three numbers do not need three bordered boxes. They need to be
 * legible and adjacent.
 */
export function Fact({
  value,
  label,
  tone = 'text-ink-900',
}: {
  value: number | string;
  label: string;
  tone?: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={`num font-display text-2xl font-bold leading-none ${tone}`}>
        {value}
      </span>
      <span className="text-sm text-ink-500">{label}</span>
    </span>
  );
}
