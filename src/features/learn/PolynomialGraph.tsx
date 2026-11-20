// ===========================================================================
// v0.84.0-c10.9 checkpoint 63 — DRAWING A POLYNOMIAL.
//
// Every point on this curve is p(x) evaluated at that x. Nothing is
// authored, so the picture cannot show zeroes the algebra does not have.
//
// The x-intercepts are marked AND named in text beneath the axes, with the
// wording chosen by the algebra: a repeated zero is one point the curve
// touches, not two it crosses. A reader who cannot see the curve gets the
// same information.
// ===========================================================================

import {
  asQuadratic, evaluate, formatRational, rationalZeroes, realZeroNature,
  samplePoints, toNumber, yIntercept,
  type PolynomialGraphSpec,
} from '../../curriculum/polynomial';

export function PolynomialGraph({ spec }: { spec: PolynomialGraphSpec }) {
  const pts = samplePoints(spec, 120);
  const q = asQuadratic(spec.polynomial);
  const zeroes = q ? rationalZeroes(q) : [];
  const nature = q ? realZeroNature(q) : null;

  const W = 280;
  const H = 240;
  const pad = 26;
  const ys = pts.map((p) => p.y);
  const yLo = Math.min(0, ...ys);
  const yHi = Math.max(0, ...ys);
  const sx = (x: number) => pad + ((x - spec.xMin) / (spec.xMax - spec.xMin)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - yLo) / (yHi - yLo || 1)) * (H - 2 * pad);

  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x).toFixed(2)} ${sy(p.y).toFixed(2)}`).join(' ');

  const intercepts = {
    two_distinct: `The curve meets the x-axis at two points, ${zeroes.map((z) => `x = ${formatRational(z)}`).join(' and ')}.`,
    one_repeated: `The curve touches the x-axis at one point, x = ${zeroes.map(formatRational).join('')}, without crossing it.`,
    none_real: 'The curve does not meet the x-axis, so the polynomial has no real zeroes.',
  }[nature ?? 'two_distinct'];

  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs text-slate-800" aria-hidden="true">
          <line x1={sx(spec.xMin)} y1={sy(0)} x2={sx(spec.xMax)} y2={sy(0)} stroke="currentColor" strokeWidth="1" opacity="0.5" />
          {spec.xMin <= 0 && spec.xMax >= 0 && (
            <line x1={sx(0)} y1={sy(yLo)} x2={sx(0)} y2={sy(yHi)} stroke="currentColor" strokeWidth="1" opacity="0.5" />
          )}
          <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" />
          {zeroes.map((z) => (
            <circle key={formatRational(z)} cx={sx(toNumber(z))} cy={sy(0)} r="4" fill="currentColor" />
          ))}
        </svg>
      </div>

      <p className="mt-2 text-sm font-medium text-slate-800">{spec.polynomial.label}</p>
      {/* The reading, in words, so nothing rests on seeing the curve. */}
      <p className="mt-1 text-sm text-slate-700">{intercepts}</p>
      <p className="mt-1 text-sm text-slate-700">
        {`It meets the y-axis at ${yIntercept(spec.polynomial)}, which is p(0) and not a zero.`}
      </p>
      <figcaption className="mt-2 text-sm text-slate-700">{spec.caption}</figcaption>
      <p className="sr-only">{spec.altText}</p>
    </figure>
  );
}

/** Re-exported so a lesson and a test read the same evaluation. */
export { evaluate };
