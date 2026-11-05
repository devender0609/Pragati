// ===========================================================================
// v0.76 §3/§5 — CHAPTER ARTWORK.
//
// WHAT THIS REPLACES
//
// ChapterMotif draws each chapter's mathematics on a 24×24 grid. It is a
// good icon set and it is still used wherever an icon is the right
// answer — a list row, a nav item, a chip.
//
// It is not an identity. §5 asks for mathematical visuals that occupy
// 30-40% of a hero composition, and a 24px line drawing scaled to 300px
// is four hairlines and a lot of air. Everything a 24px icon leaves out
// — the construction marks, the labelled parts, the second figure that
// makes the first one mean something — is exactly what makes a drawing
// look like mathematics rather than like an app icon.
//
// So this is a separate, larger drawing per chapter, composed at
// 240×180 with real internal structure.
//
// THE LATTICE
//
// Every drawing sits on a visible dot lattice. A pulli kolam is drawn on
// a grid of dots set out on the threshold, and the figure is defined
// entirely by how one line travels around them. That is the oldest
// drawing-on-a-lattice practice there is, it is Indian, and it is what
// mathematics looks like before anybody writes it down.
//
// Practically, it does three things:
//   - it is the reason two chapters drawn in different hues still look
//     like the same product;
//   - it gives every figure a scale reference, so a partitioned bar and
//     a number line are visibly measured against the same unit;
//   - a screenshot with the wordmark removed still reads as Pragati,
//     which is §3's actual test.
//
// TONES
//
//   'onDark'   for ink fields and coloured heroes. Figure in white,
//              lattice and construction lines at low alpha.
//   'onLight'  for paper. Figure in the chapter's accent.
//   'quiet'    for a chapter that exists in the book and not yet in
//              Pragati. The SAME drawing, at low contrast — an upcoming
//              chapter must read as "written down, not written yet",
//              never as a control that failed to load. §6 is explicit
//              that these should be beautifully muted rather than grey
//              disabled boxes, and drawing them properly is the only
//              honest way to do that.
//
// ACCESSIBILITY
//
// Decorative in every use: the chapter number and title are always
// adjacent as real text, so the drawings are aria-hidden. A screen
// reader announcing "circle divided into fifths, Fractions" says the
// same thing twice and helps nobody.
// ===========================================================================

import type { MotifKey } from './ChapterMotif';

export type ArtTone = 'onDark' | 'onLight' | 'quiet';

type Tone = {
  /** The figure itself. */
  fig: string;
  /** Construction lines, axes, guides — always quieter than the figure. */
  con: string;
  /** Filled regions. */
  fill: string;
  /** The lattice. */
  dot: string;
  /** A second, contrasting emphasis used once per drawing at most. */
  mark: string;
  figW: number;
  conW: number;
};

function tones(tone: ArtTone, accent: string): Tone {
  if (tone === 'onDark') {
    return {
      fig: 'rgba(255,255,255,0.95)',
      con: 'rgba(255,255,255,0.34)',
      fill: 'rgba(255,255,255,0.22)',
      dot: 'rgba(255,255,255,0.22)',
      mark: '#F7BE4C',
      // Second pass: 2.1 at 240 units rendered as a hairline once the
      // drawing was scaled to 300px tall, and a hairline on a dark field
      // reads as faint rather than as drawn. Weight follows scale.
      figW: 3,
      conW: 1.6,
    };
  }
  if (tone === 'quiet') {
    return {
      fig: `${accent}8F`,
      con: `${accent}45`,
      fill: `${accent}1C`,
      dot: `${accent}40`,
      mark: `${accent}70`,
      figW: 1.9,
      conW: 1.1,
    };
  }
  return {
    fig: accent,
    con: `${accent}55`,
    fill: `${accent}26`,
    dot: `${accent}3A`,
    mark: '#DF8709',
    figW: 2.2,
    conW: 1.2,
  };
}

/** The pulli lattice: 20px pitch, inset so the figure has a margin. */
function Lattice({ color }: { color: string }) {
  const dots = [];
  for (let y = 20; y <= 160; y += 20) {
    for (let x = 20; x <= 220; x += 20) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} fill={color} />);
    }
  }
  return <g>{dots}</g>;
}

// ---------------------------------------------------------------------------
// The ten drawings
// ---------------------------------------------------------------------------
//
// Each is drawn to the lattice: vertices land on dots wherever the
// mathematics allows it, so the figures are visibly measured rather than
// sketched. Where a figure must not land on a dot — a circle's arc, a
// fraction of a bar — the departure is the point being made.

function Figure({ motif, t }: { motif: MotifKey; t: Tone }) {
  const S = {
    fill: 'none',
    stroke: t.fig,
    strokeWidth: t.figW,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const C = {
    fill: 'none',
    stroke: t.con,
    strokeWidth: t.conW,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (motif) {
    // CH1 — growing triangular numbers. The chapter opens with dot
    // patterns that grow by a rule; drawing 1, 3, 6, 10 as stacked rows
    // says "a pattern is a rule you can continue" without a caption.
    case 'patterns': {
      const rows = [1, 2, 3, 4, 5];
      const dots: JSX.Element[] = [];
      rows.forEach((n, r) => {
        for (let i = 0; i < n; i += 1) {
          dots.push(
            <circle
              key={`${r}-${i}`}
              cx={60 + i * 20 - (n - 1) * 10 + 60}
              cy={40 + r * 24}
              r={6.5}
              fill={r === rows.length - 1 ? t.mark : t.fig}
              opacity={r === rows.length - 1 ? 1 : 0.85 - r * 0.06}
            />
          );
        }
      });
      return (
        <g>
          <path d="M120 26 L44 152 M120 26 L196 152" {...C} />
          {dots}
        </g>
      );
    }

    // CH2 — one angle, properly drawn: two rays from a vertex, the arc
    // between them, and the protractor semicircle it would be measured
    // with. The arc is the chapter's whole object.
    case 'lines_angles':
      return (
        <g>
          <path d="M40 140 A80 80 0 0 1 200 140" {...C} />
          <path d="M20 140 L220 140" {...C} />
          {[0, 30, 60, 90, 120, 150, 180].map((d) => {
            const a = (Math.PI * (180 - d)) / 180;
            return (
              <path
                key={d}
                d={`M${120 + 80 * Math.cos(a)} ${140 - 80 * Math.sin(a)} L${
                  120 + 71 * Math.cos(a)
                } ${140 - 71 * Math.sin(a)}`}
                {...C}
              />
            );
          })}
          <path d="M120 140 L212 140" {...S} />
          <path d="M120 140 L173 65" {...S} />
          <path d="M164 140 A44 44 0 0 0 145 104" stroke={t.mark} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <circle cx={120} cy={140} r={4.2} fill={t.fig} />
        </g>
      );

    // CH3 — a 5×5 number grid with a "supercell" path traced through it.
    // Number Play is about arranging numbers and noticing which cell is
    // bigger than its neighbours; the traced route is that noticing.
    case 'number_play': {
      const cells: JSX.Element[] = [];
      for (let r = 0; r < 5; r += 1) {
        for (let c = 0; c < 5; c += 1) {
          const hot = (r === 1 && c === 3) || (r === 3 && c === 1);
          cells.push(
            <rect
              key={`${r}-${c}`}
              x={40 + c * 32}
              y={22 + r * 28}
              width={30}
              height={26}
              rx={4}
              fill={hot ? t.fill : 'none'}
              stroke={hot ? t.fig : t.con}
              strokeWidth={hot ? t.figW : t.conW}
            />
          );
        }
      }
      return (
        <g>
          {cells}
          <path
            d="M55 118 L87 118 L87 62 L151 62 L151 34"
            stroke={t.mark}
            strokeWidth={2.6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    }

    // CH4 — a bar chart with its axis and a pictograph row beneath, the
    // two representations the chapter asks students to move between.
    case 'data_handling': {
      const bars = [46, 88, 62, 116, 74];
      return (
        <g>
          <path d="M38 26 L38 132 L212 132" {...C} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M38 ${132 - i * 28} L212 ${132 - i * 28}`} {...C} opacity={0.5} />
          ))}
          {bars.map((h, i) => (
            <rect
              key={i}
              x={52 + i * 32}
              y={132 - h}
              width={22}
              height={h}
              rx={3}
              fill={i === 3 ? t.mark : t.fill}
              stroke={t.fig}
              strokeWidth={t.figW}
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={54 + i * 20} cy={154} r={5} fill={t.fig} opacity={i < 4 ? 0.9 : 0.3} />
          ))}
        </g>
      );
    }

    // CH5 — a factor tree resolving to primes, with the composite at the
    // top left whole. Prime Time is about decomposition, so the drawing
    // decomposes.
    case 'prime_time': {
      const node = (x: number, y: number, prime: boolean) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={15}
          fill={prime ? t.fill : 'none'}
          stroke={prime ? t.mark : t.fig}
          strokeWidth={t.figW}
        />
      );
      return (
        <g>
          <path d="M108 45 L70 82 M132 45 L170 82" {...S} />
          <path d="M58 112 L40 142 M82 112 L100 142" {...S} />
          {node(120, 30, false)}
          {node(60, 97, false)}
          {node(180, 97, true)}
          {node(30, 157, true)}
          {node(110, 157, true)}
        </g>
      );
    }

    // CH6 — one rectangle carrying both ideas at once: the boundary
    // traced heavily (perimeter) and the interior tiled in unit squares
    // (area). The chapter's entire difficulty is telling those apart.
    case 'perimeter_area': {
      const tiles: JSX.Element[] = [];
      for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 7; c += 1) {
          tiles.push(
            <rect
              key={`${r}-${c}`}
              x={40 + c * 22}
              y={44 + r * 22}
              width={22}
              height={22}
              fill={r < 2 && c < 4 ? t.fill : 'none'}
              stroke={t.con}
              strokeWidth={t.conW}
            />
          );
        }
      }
      return (
        <g>
          {tiles}
          <rect x={40} y={44} width={154} height={88} rx={2} fill="none" stroke={t.fig} strokeWidth={t.figW + 1.4} />
          <path d="M40 148 L194 148" stroke={t.mark} strokeWidth={2.4} strokeLinecap="round" fill="none" />
          <path d="M40 143 L40 153 M194 143 L194 153" stroke={t.mark} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      );
    }

    // CH7 — the chapter's three representations of one number, side by
    // side: a partitioned bar, a partitioned circle, and the same length
    // marked on a number line. Three-fifths, drawn three ways. This is
    // the flagship drawing, because Fractions is the flagship chapter.
    case 'fractions': {
      const barX = 26;
      const cellW = 22;
      return (
        <g>
          {/* the bar — 3 of 5 shaded */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={barX + i * cellW}
              y={26}
              width={cellW}
              height={40}
              fill={i < 3 ? t.fill : 'none'}
              stroke={t.fig}
              strokeWidth={t.figW}
            />
          ))}
          {/* the circle — the same fraction, a different whole */}
          <g transform="translate(180, 46)">
            <circle r={30} fill="none" stroke={t.fig} strokeWidth={t.figW} />
            {[0, 1, 2, 3, 4].map((i) => {
              const a0 = (2 * Math.PI * i) / 5 - Math.PI / 2;
              const a1 = (2 * Math.PI * (i + 1)) / 5 - Math.PI / 2;
              return (
                <path
                  key={i}
                  d={`M0 0 L${30 * Math.cos(a0)} ${30 * Math.sin(a0)} A30 30 0 0 1 ${
                    30 * Math.cos(a1)
                  } ${30 * Math.sin(a1)} Z`}
                  fill={i < 3 ? t.fill : 'none'}
                  stroke={t.fig}
                  strokeWidth={t.conW}
                />
              );
            })}
          </g>
          {/* the number line — the same fraction as a length from 0 */}
          <path d="M26 128 L214 128" {...S} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${26 + i * 34} 120 L${26 + i * 34} 136`} {...C} />
          ))}
          <path d="M26 128 L128 128" stroke={t.mark} strokeWidth={4} strokeLinecap="round" fill="none" />
          <circle cx={128} cy={128} r={5.5} fill={t.mark} />
          <path d="M26 118 L26 138" {...S} />
          <path d="M196 118 L196 138" {...S} />
        </g>
      );
    }

    // CH8 — the construction itself, mid-step: two compass arcs from the
    // endpoints of a segment, crossing, with the perpendicular drawn
    // through the crossings. The arcs are left visible, because in this
    // chapter the arcs are the work.
    case 'constructions':
      return (
        <g>
          {/* Two compass arcs, each struck from one END of the segment.
              The first draft drew both arcs between the same pair of
              points, which is a circle, not a construction — caught by
              looking at the render rather than at the path data. */}
          <path d="M120 78 A72 72 0 0 1 120 158" {...C} />
          <path d="M120 78 A72 72 0 0 0 120 158" {...C} />
          <path d="M36 118 L204 118" {...S} />
          <circle cx={60} cy={118} r={4} fill={t.fig} />
          <circle cx={180} cy={118} r={4} fill={t.fig} />
          <path d="M120 44 L120 170" stroke={t.mark} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <path d="M120 104 L134 104 L134 118" {...C} strokeWidth={t.conW + 0.6} />
          <circle cx={120} cy={78} r={4.5} fill={t.mark} />
          <circle cx={120} cy={158} r={4.5} fill={t.mark} />
          <circle cx={120} cy={118} r={4.5} fill={t.fig} />
        </g>
      );

    // CH9 — a kolam-like figure and its mirror across the axis, the
    // pattern language of the whole product turned into one chapter's
    // subject. Drawn on the lattice on purpose: kolam symmetry IS
    // lattice symmetry.
    case 'symmetry': {
      const half = 'M120 40 L80 62 L80 106 L120 128 M80 84 L44 84 M80 62 L48 46 M80 106 L48 122';
      return (
        <g>
          <path d="M120 22 L120 158" stroke={t.mark} strokeWidth={2} strokeDasharray="6 5" fill="none" />
          <path d={half} {...S} />
          <g transform="translate(240,0) scale(-1,1)">
            <path d={half} {...S} />
          </g>
          {[
            [80, 62], [80, 106], [44, 84], [48, 46], [48, 122],
            [160, 62], [160, 106], [196, 84], [192, 46], [192, 122],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={4} fill={t.fig} />
          ))}
          <circle cx={120} cy={40} r={5} fill={t.mark} />
          <circle cx={120} cy={128} r={5} fill={t.mark} />
        </g>
      );
    }

    // CH10 — the number line continued past zero, which is the whole
    // chapter. Zero is marked heavily; the negative side is drawn with
    // the same spacing so the symmetry is visible rather than asserted.
    case 'integers':
      return (
        <g>
          {/* Zero, and the same distance travelled either way from it.
              The reflection arc is the chapter's whole idea: the other
              side of zero is a mirror, not a different kind of number. */}
          <path d="M22 104 L218 104" {...S} />
          <path d="M22 104 L35 95 M22 104 L35 113 M218 104 L205 95 M218 104 L205 113" {...S} />
          {[-3, -2, -1, 1, 2, 3].map((n) => (
            <path key={n} d={`M${120 + n * 30} 96 L${120 + n * 30} 112`} {...C} />
          ))}
          <path d="M120 82 L120 126" {...S} />
          <circle cx={120} cy={104} r={7} fill={t.mark} />
          <circle cx={60} cy={104} r={6} fill={t.fig} />
          <circle cx={180} cy={104} r={6} fill={t.fig} />
          <path d="M60 96 A60 60 0 0 1 180 96" stroke={t.mark} strokeWidth={1.8} strokeDasharray="5 5" fill="none" />
          <path d="M48 146 L72 146" {...S} />
          <path d="M168 146 L192 146 M180 134 L180 158" {...S} />
        </g>
      );

    default:
      return (
        <g>
          <circle cx={120} cy={90} r={54} {...S} />
          <path d="M84 90 L156 90 M120 54 L120 126" {...S} />
        </g>
      );
  }
}

/**
 * Chapter artwork at composition scale.
 *
 * Sized by the caller with a className — the SVG is `w-full h-full` and
 * preserves its aspect, so a hero can give it 38% of its width and a
 * curriculum tile can give it the full tile without two components.
 */
export function ChapterArtwork({
  motif,
  accent,
  tone = 'onLight',
  className = '',
  lattice = true,
}: {
  motif: MotifKey;
  accent: string;
  tone?: ArtTone;
  className?: string;
  /** Off only where the artwork sits on a surface that already has one. */
  lattice?: boolean;
}) {
  const t = tones(tone, accent);
  return (
    <svg
      viewBox="0 0 240 180"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {lattice ? <Lattice color={t.dot} /> : null}
      <Figure motif={motif} t={t} />
    </svg>
  );
}
