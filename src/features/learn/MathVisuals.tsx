// v0.61 §10/§13 — RENDERERS FOR MATHEMATICAL VISUAL SPECIFICATIONS.
//
// Every coordinate is DERIVED from the specification's exact rationals
// via `positionOnLine` and `shadedCount / denominator`. Nothing is
// positioned by hand, so a number line cannot be drawn with unequal
// intervals and a fraction strip cannot be shaded to contradict its own
// caption — the two silent errors that make maths illustration
// dangerous.
//
// These are NOT a one-off for the demonstration section. They are the
// basis for real Learn content and are deliberately generic over the
// spec types.

import type { GeometryFigureSpec } from '../../curriculum/visualSpecification';
import {
  positionOnLine,
  stripValue,
  toDecimal,
  type NumberLineSpec,
  type NumberGridSpec,
  supercellsFor,
  type FractionStripSpec,
  type ExactFraction,
} from '../../curriculum/visualSpecification';

const label = (f: ExactFraction) => `${f.numerator}/${f.denominator}`;

// ---------------------------------------------------------------------------
// Number line
// ---------------------------------------------------------------------------

export function NumberLineFigure({ spec }: { spec: NumberLineSpec }) {
  const W = 640;
  const H = spec.equivalenceTier ? 190 : 132;
  const PAD = 36;
  const span = W - PAD * 2;
  const baseY = spec.equivalenceTier ? 74 : 66;

  const x = (v: ExactFraction) =>
    PAD + positionOnLine(v, spec.min, spec.max) * span;

  // Ticks are generated from `partitions`, so they are equal by
  // construction. There is no code path that draws them otherwise.
  const ticks = Array.from({ length: spec.partitions + 1 }, (_, i) => {
    const t = i / spec.partitions;
    const value = toDecimal(spec.min) + t * (toDecimal(spec.max) - toDecimal(spec.min));
    return { x: PAD + t * span, i, value };
  });

  return (
    <figure className="my-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={spec.altText}
      >
        {spec.highlightFrom && spec.highlightTo && (
          <rect
            x={x(spec.highlightFrom)}
            y={baseY - 9}
            width={x(spec.highlightTo) - x(spec.highlightFrom)}
            height={18}
            className="fill-sky-200"
            rx={3}
          />
        )}

        <line
          x1={PAD} y1={baseY} x2={W - PAD} y2={baseY}
          className="stroke-slate-800" strokeWidth={2}
        />

        {ticks.map((t) => (
          <g key={`t${t.i}`}>
            <line
              x1={t.x} y1={baseY - 9} x2={t.x} y2={baseY + 9}
              className="stroke-slate-700" strokeWidth={1.5}
            />
            {spec.labelTicks && (
              <text
                x={t.x} y={baseY + 30} textAnchor="middle"
                className="fill-slate-600" fontSize={19}
              >
                {t.i === 0
                  ? String(toDecimal(spec.min))
                  : t.i === spec.partitions
                    ? String(toDecimal(spec.max))
                    : `${t.i}/${spec.partitions}`}
              </text>
            )}
          </g>
        ))}

        {spec.markedPoints.map((p, i) => (
          <g key={`m${i}`}>
            <circle
              cx={x(p.value)} cy={baseY} r={p.emphasis === 'muted' ? 4 : 7}
              className={
                p.emphasis === 'muted' ? 'fill-slate-400' : 'fill-rose-600'
              }
            />
            <text
              x={x(p.value)} y={baseY - 20} textAnchor="middle"
              className={
                p.emphasis === 'muted'
                  ? 'fill-slate-500'
                  : 'fill-rose-700 font-semibold'
              }
              fontSize={22}
            >
              {p.label ?? label(p.value)}
            </text>
          </g>
        ))}

        {/* Second tier: the same span, partitioned differently. Both
            tiers use the SAME position function, which is what makes
            the equivalence claim true rather than drawn. */}
        {spec.equivalenceTier && (
          <g>
            <line
              x1={PAD} y1={baseY + 52} x2={W - PAD} y2={baseY + 52}
              className="stroke-slate-800" strokeWidth={2}
            />
            {Array.from(
              { length: spec.equivalenceTier.partitions + 1 },
              (_, i) => {
                const tx = PAD + (i / spec.equivalenceTier!.partitions) * span;
                return (
                  <line
                    key={`e${i}`}
                    x1={tx} y1={baseY + 44} x2={tx} y2={baseY + 60}
                    className="stroke-slate-700" strokeWidth={1.5}
                  />
                );
              }
            )}
            {spec.equivalenceTier.markedPoints.map((p, i) => (
              <g key={`ep${i}`}>
                <circle
                  cx={x(p.value)} cy={baseY + 52} r={7}
                  className="fill-emerald-600"
                />
                <text
                  x={x(p.value)} y={baseY + 82} textAnchor="middle"
                  className="fill-emerald-700 font-semibold" fontSize={22}
                >
                  {p.label ?? label(p.value)}
                </text>
                <line
                  x1={x(p.value)} y1={baseY + 6} x2={x(p.value)} y2={baseY + 46}
                  className="stroke-emerald-500" strokeWidth={1}
                  strokeDasharray="3 3"
                />
              </g>
            ))}
          </g>
        )}
      </svg>
      <figcaption className="mt-1 text-sm text-slate-600">
        {spec.caption}
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Fraction strips
// ---------------------------------------------------------------------------

export function FractionStripFigure({ spec }: { spec: FractionStripSpec }) {
  const W = 640;
  const ROW_H = 46;
  const PAD = 60;
  const span = W - PAD - 20;
  const H = spec.strips.length * ROW_H + 16;

  return (
    <figure className="my-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={spec.altText}
      >
        {spec.strips.map((row, r) => {
          const y = r * ROW_H + 8;
          const cellW = span / row.denominator;
          return (
            <g key={`r${r}`}>
              <text
                x={PAD - 10} y={y + 20} textAnchor="end"
                className="fill-slate-700 font-medium" fontSize={19}
              >
                {row.label ?? label(stripValue(row))}
              </text>
              {Array.from({ length: row.denominator }, (_, c) => (
                <rect
                  key={`c${c}`}
                  x={PAD + c * cellW}
                  y={y}
                  width={cellW}
                  height={26}
                  // Shading is derived from shadedCount, so it cannot
                  // disagree with the value the strip reports.
                  className={
                    c < row.shadedCount
                      ? 'fill-sky-400 stroke-slate-700'
                      : 'fill-white stroke-slate-700'
                  }
                  strokeWidth={1.5}
                />
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-1 text-sm text-slate-600">
        {spec.caption}
      </figcaption>
    </figure>
  );
}

/**
 * v0.80 §A — NUMBER GRID.
 *
 * Draws the grid and, where the spec asserts them, rings the supercells.
 * The rings come from `supercellsFor()` — the same computation the
 * validator runs — so the picture cannot disagree with the caption. The
 * spec never stores which cells are supercells, precisely so that this
 * is impossible.
 *
 * ACCESSIBILITY. A grid is a table of numbers, and a screen reader that
 * gets a flat list of values learns nothing about adjacency, which is
 * the whole mathematical point. So the figure carries a real <table>
 * alongside the drawing, visually hidden: the SVG is `aria-hidden` and
 * the table is what assistive technology reads, with each supercell
 * announced as such.
 */
export function NumberGridFigure({ spec }: { spec: NumberGridSpec }) {
  const rows = spec.rows;
  const cols = rows[0]?.length ?? 0;
  const CELL = 64;
  const PAD = 12;
  const W = cols * CELL + PAD * 2;
  const H = rows.length * CELL + PAD * 2;
  const supers = new Set(
    (spec.assertsSupercellsAt ? supercellsFor(spec) : []).map(
      ([r, c]) => `${r},${c}`
    )
  );

  return (
    <figure className="my-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto h-auto w-full max-w-xl"
        aria-hidden="true"
        focusable="false"
      >
        {rows.map((row, r) =>
          row.map((cell, c) => {
            const x = PAD + c * CELL;
            const y = PAD + r * CELL;
            const isSuper = supers.has(`${r},${c}`);
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  className={
                    cell.highlighted
                      ? 'fill-sky-50 stroke-slate-700'
                      : 'fill-white stroke-slate-700'
                  }
                  strokeWidth={1.5}
                />
                {isSuper && (
                  <rect
                    x={x + 5}
                    y={y + 5}
                    width={CELL - 10}
                    height={CELL - 10}
                    rx={6}
                    className="fill-none stroke-amber-500"
                    strokeWidth={3.5}
                  />
                )}
                <text
                  x={x + CELL / 2}
                  y={y + CELL / 2 + 7}
                  textAnchor="middle"
                  fontSize={21}
                  className={
                    isSuper
                      ? 'fill-slate-900 font-bold'
                      : 'fill-slate-800 font-medium'
                  }
                >
                  {cell.value}
                </text>
              </g>
            );
          })
        )}
      </svg>

      <table className="sr-only">
        <caption>{spec.altText}</caption>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c}>
                  {cell.value}
                  {supers.has(`${r},${c}`) ? ' (supercell)' : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <figcaption className="mt-2 text-center text-sm text-slate-600">
        {spec.caption}
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 32 — GEOMETRY FIGURES FOR SECONDARY STAGE.
//
// A quadrilateral cannot be drawn with a number line or a fraction strip.
// This renders what the spec asserts and nothing else: the marks are the
// mathematics, so equal ticks, right angles and parallel arrows are drawn
// from the data rather than decided here. Colour never carries meaning on
// its own — every assertion is also a tick, a label or alt text.
// ---------------------------------------------------------------------------
export function GeometryFigure({ spec }: { spec: GeometryFigureSpec }) {
  const pts = Object.fromEntries(spec.points.map((p) => [p.id, p]));
  const xs = spec.points.map((p) => p.x);
  const ys = spec.points.map((p) => p.y);
  const PAD = 26;
  const minX = Math.min(...xs) - PAD;
  const minY = Math.min(...ys) - PAD;
  const W = Math.max(...xs) - minX + PAD;
  const H = Math.max(...ys) - minY + PAD;

  const tick = (a: { x: number; y: number }, b: { x: number; y: number }, n: number) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * 6;
    const ny = (dx / len) * 6;
    const step = 4;
    return Array.from({ length: n }, (_, i) => {
      const off = (i - (n - 1) / 2) * step;
      const cx = mx + (dx / len) * off;
      const cy = my + (dy / len) * off;
      return (
        <line
          key={i}
          x1={cx - nx}
          y1={cy - ny}
          x2={cx + nx}
          y2={cy + ny}
          stroke="currentColor"
          strokeWidth={2}
        />
      );
    });
  };

  // v0.84.0 checkpoint 33 — a circle is drawn from its centre and a point
  // on it, so the figure a reader sees matches what the spec asserts.
  const radiusOf = (c: { centre: string; through?: string; radius?: number }) => {
    const o = pts[c.centre];
    const on = c.through ? pts[c.through] : undefined;
    return on && o ? Math.hypot(on.x - o.x, on.y - o.y) : (c.radius ?? 0);
  };
  const circleById = Object.fromEntries((spec.circles ?? []).map((c) => [c.id, c]));

  return (
    <figure className="my-4">
      <svg
        viewBox={`${minX} ${minY} ${W} ${H}`}
        className="mx-auto h-auto w-full max-w-lg text-slate-700"
        role="img"
        aria-label={spec.altText}
      >
        {(spec.circles ?? []).map((c) => {
          const o = pts[c.centre];
          if (!o) return null;
          return (
            <circle
              key={`c${c.id}`}
              cx={o.x}
              cy={o.y}
              r={radiusOf(c)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            />
          );
        })}
        {(spec.arcs ?? []).map((a, i) => {
          const c = circleById[a.circle];
          const o = c ? pts[c.centre] : undefined;
          const p = pts[a.from];
          const q = pts[a.to];
          if (!c || !o || !p || !q) return null;
          const r = radiusOf(c);
          const cross = (p.x - o.x) * (q.y - o.y) - (p.y - o.y) * (q.x - o.x);
          const sweep = cross > 0 ? 1 : 0;
          return (
            <path
              key={`arc${i}`}
              d={`M ${p.x} ${p.y} A ${r} ${r} 0 0 ${sweep} ${q.x} ${q.y}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
              strokeOpacity={0.35}
            />
          );
        })}
        {(spec.shadedRegions ?? []).map((r, i) => {
          const ps = r.points.map((id) => pts[id]).filter(Boolean);
          if (ps.length < 3) return null;
          // v0.84.0 checkpoint 36 — a region's label is drawn at its centre.
          // The spec has carried `label` since checkpoint 32 and the renderer
          // dropped it, so a net could name its faces in data and show none
          // of those names on the page.
          const cx = ps.reduce((t, p) => t + p.x, 0) / ps.length;
          const cy = ps.reduce((t, p) => t + p.y, 0) / ps.length;
          return (
            <g key={`r${i}`}>
              <polygon
                points={ps.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="currentColor"
                fillOpacity={0.08}
                stroke="none"
              />
              {r.label ? (
                <text x={cx} y={cy} textAnchor="middle" fontSize={12} fill="currentColor">
                  {r.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {spec.segments.map((s, i) => {
          const a = pts[s.from];
          const b = pts[s.to];
          if (!a || !b) return null;
          return (
            <g key={`s${i}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray={s.mark === 'dashed' ? '5 4' : undefined}
              />
              {s.mark === 'single_tick' ? tick(a, b, 1) : null}
              {s.mark === 'double_tick' ? tick(a, b, 2) : null}
              {s.label ? (
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 - 6}
                  textAnchor="middle"
                  fontSize={13}
                  fill="currentColor"
                >
                  {s.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {(spec.angleMarks ?? []).map((m, i) => {
          const v = pts[m.at];
          if (!v) return null;
          // A right angle gets a square, not an arc: the mark itself says
          // which claim the figure is making.
          if (m.right) {
            const a = pts[m.from];
            const b = pts[m.to];
            if (a && b) {
              const u1 = Math.hypot(a.x - v.x, a.y - v.y) || 1;
              const u2 = Math.hypot(b.x - v.x, b.y - v.y) || 1;
              const s1 = { x: ((a.x - v.x) / u1) * 11, y: ((a.y - v.y) / u1) * 11 };
              const s2 = { x: ((b.x - v.x) / u2) * 11, y: ((b.y - v.y) / u2) * 11 };
              return (
                <polyline
                  key={`a${i}`}
                  points={`${v.x + s1.x},${v.y + s1.y} ${v.x + s1.x + s2.x},${v.y + s1.y + s2.y} ${v.x + s2.x},${v.y + s2.y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                />
              );
            }
          }
          return (
            <g key={`a${i}`}>
              <circle cx={v.x} cy={v.y} r={12} fill="none" stroke="currentColor" strokeWidth={1.5} />
              {m.label ? (
                <text x={v.x + 14} y={v.y - 10} fontSize={12} fill="currentColor">
                  {m.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {spec.points.map((p) => (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="currentColor" />
            <text x={p.x + 7} y={p.y - 7} fontSize={14} fill="currentColor">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-center text-sm text-slate-600">{spec.caption}</figcaption>
    </figure>
  );
}
