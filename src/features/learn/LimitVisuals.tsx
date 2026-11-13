// ===========================================================================
// v0.84.0-c11.17 checkpoint 86A — RENDERERS FOR LIMIT TABLES AND SECANTS.
//
// Written with the specs, per the rule checkpoints 82 and 84C paid for.
// Every number shown comes from the model: the table's rows are the model's
// approach steps, and the secant slopes are the model's slopes. Nothing is
// typed alongside the mathematics.
//
// A limit that does not exist is rendered in WORDS, never as NaN, Infinity
// or a blank.
// ===========================================================================

import type { LimitTableSpec, SecantGraphSpec } from '../../curriculum/limits';
import { describeLimit } from '../../curriculum/limits';

/**
 * Numbers as a reader would write them. Fixed decimals put spurious
 * precision on a slope of 2.5, which then reads as 2.5000 beside a plain 4.
 * Trailing zeros are trimmed, and only enough places are kept to separate
 * the samples from one another.
 */
const fmt = (v: number) => {
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
  return v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
};

export function LimitTable({ spec }: { spec: LimitTableSpec }) {
  const left = spec.approach.steps.filter((s) => s.side === 'left');
  const right = spec.approach.steps.filter((s) => s.side === 'right');
  return (
    <figure className="my-4" role="group" aria-label={spec.altText}>
      <div className="overflow-x-auto">
        <table className="text-sm">
          <caption className="sr-only">{spec.altText}</caption>
          <thead>
            <tr>
              <th scope="col" className="px-2 py-1 text-left">x</th>
              {[...left, ...right].map((s) => (
                <th key={`x-${s.x}`} scope="col" className="px-2 py-1 text-right">{fmt(s.x)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="px-2 py-1 text-left">{spec.functionRule}</th>
              {[...left, ...right].map((s) => (
                <td key={`v-${s.x}`} className="px-2 py-1 text-right">
                  {/* A hole is said in words, never left blank or shown as a value. */}
                  {s.value === null ? 'no value' : fmt(s.value)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <figcaption className="mt-1 text-sm opacity-80">
        As x approaches {fmt(spec.target)} from both sides, {describeLimit(spec.result)}.{' '}
        {spec.valueAtTarget === null
          ? `At x = ${fmt(spec.target)} itself the function has no value.`
          : `At x = ${fmt(spec.target)} itself the function value is ${fmt(spec.valueAtTarget)}.`}
      </figcaption>
    </figure>
  );
}

export function SecantGraph({ spec }: { spec: SecantGraphSpec }) {
  const S = spec.span, W = 300, H = 300, pad = 22;
  const sx = (x: number) => pad + ((x + S) / (2 * S)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y + S) / (2 * S)) * (H - 2 * pad);
  const a = spec.anchor;
  return (
    <figure className="my-4">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, height: 'auto' }}
        role="img" aria-label={spec.altText}>
        <title>{spec.altText}</title>
        <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="currentColor" strokeWidth={1} opacity={0.4} />
        <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="currentColor" strokeWidth={1} opacity={0.4} />
        <polyline fill="none" stroke="currentColor" strokeWidth={2}
          points={spec.curve.map((p) => `${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`).join(' ')} />
        {/* One secant per moving point, drawn from the model's own slopes. */}
        {spec.movers.map((m, i) => {
          const ext = 1.6;
          const x1 = a.x - (m.x - a.x) * ext, x2 = m.x + (m.x - a.x) * ext;
          return (
            <g key={`sec-${i}`}>
              <line x1={sx(x1)} y1={sy(a.y + m.slope * (x1 - a.x))}
                x2={sx(x2)} y2={sy(a.y + m.slope * (x2 - a.x))}
                stroke="currentColor" strokeWidth={1} strokeDasharray="4 3" opacity={0.75} />
              <circle cx={sx(m.x)} cy={sy(m.y)} r={2.8} fill="currentColor" opacity={0.75} />
            </g>
          );
        })}
        {spec.limitingSlope.kind === 'exists' ? (
          <line x1={sx(a.x - S)} y1={sy(a.y + spec.limitingSlope.value * -S)}
            x2={sx(a.x + S)} y2={sy(a.y + spec.limitingSlope.value * S)}
            stroke="currentColor" strokeWidth={2.2} />
        ) : null}
        <circle cx={sx(a.x)} cy={sy(a.y)} r={3.6} fill="currentColor" />
        <text x={sx(a.x) + 6} y={sy(a.y) - 6} fontSize={10} fill="currentColor">P</text>
      </svg>
      <figcaption className="mt-1 text-sm opacity-80">
        {spec.functionRule}. The dashed lines are secants through P, with slopes{' '}
        {spec.movers.map((m) => fmt(m.slope)).join(', ')} as the second point moves towards P.
        {spec.limitingSlope.kind === 'exists'
          ? ` The solid line is the tangent at P, whose slope is the value those secant slopes approach: ${fmt(spec.limitingSlope.value)}.`
          : ` ${describeLimit(spec.limitingSlope)}, so no tangent line is drawn.`}
      </figcaption>
    </figure>
  );
}
