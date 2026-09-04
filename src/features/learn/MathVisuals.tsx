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

import {
  positionOnLine,
  stripValue,
  toDecimal,
  type NumberLineSpec,
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
