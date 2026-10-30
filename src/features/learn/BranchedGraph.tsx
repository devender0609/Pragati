// ===========================================================================
// v0.84.0-c11.11 checkpoint 82 — RENDERER FOR BRANCH-BASED FUNCTION GRAPHS.
//
// WHY THIS WAS MISSING
//
// Checkpoint 80 built `circular_graph` and checkpoint 81 built
// `real_function_graph`, both carrying branches already broken at every
// argument where the function has no value. Both were attached to lessons.
// Neither was ever added to `VisualSpec` or to the dispatch in
// LearnSectionView, so every one of them rendered as nothing at all.
//
// Unit tests checked the graph DATA and passed; no test asked whether the
// product could display it. The browser gate is what found this.
//
// One component serves both, because the two specs agree on the thing that
// matters here: a list of separate branches plus the arguments where the
// function stops. Each branch is its own polyline, so a curve is never drawn
// across a break — the discontinuity survives from the model into the DOM.
// ===========================================================================

import type { CircularGraph } from '../../curriculum/circularFunctions';
import type { RealFunctionGraph } from '../../curriculum/relationsFunctions';

type Branched = CircularGraph | RealFunctionGraph;

const xRange = (g: Branched): [number, number] =>
  g.type === 'circular_graph' ? [g.fromRadians, g.toRadians] : [g.from, g.to];

export function BranchedGraph({ spec }: { spec: Branched }) {
  const [xMin, xMax] = xRange(spec);
  const pts = spec.branches.flatMap((b) => b.points);
  if (!pts.length) return null;

  const W = 300, H = 230, pad = 28;
  const ys = pts.map((p) => p.y);
  const yLo = Math.min(-1, ...ys);
  const yHi = Math.max(1, ...ys);
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin || 1)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - yLo) / (yHi - yLo || 1)) * (H - 2 * pad);

  const label = spec.type === 'circular_graph' ? spec.functionName : spec.functionName;
  const rule = spec.type === 'real_function_graph' ? spec.rule : `${spec.functionName} x`;

  return (
    <figure className="my-4">
      {/*
        The figure carries its own accessible name. The description names the
        function and says what the breaks mean, so a reader who cannot see the
        drawing still learns that the curve stops rather than dips.
      */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W, height: 'auto' }}
        role="img"
        aria-label={spec.altText}
      >
        <title>{spec.altText}</title>
        <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="currentColor" strokeWidth={1} opacity={0.45} />
        <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="currentColor" strokeWidth={1} opacity={0.45} />
        {spec.branches.map((b, i) => (
          <polyline
            key={`branch-${i}`}
            points={b.points.map((p) => `${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          />
        ))}
        {/* An excluded argument is marked on the axis, not bridged. */}
        {spec.breaks.map((b, i) => (
          <circle
            key={`break-${i}`}
            cx={sx(b)} cy={sy(0)} r={3}
            fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.8}
          />
        ))}
      </svg>
      <figcaption className="mt-1 text-sm opacity-80">
        <span className="font-medium">{label}</span>
        {rule ? <span> — {rule}</span> : null}
        {spec.branches.length > 1 ? (
          <span>
            {' '}Drawn in {spec.branches.length} separate pieces
            {spec.breaks.length
              ? `, because the function has no value at ${spec.breaks.length} argument${spec.breaks.length > 1 ? 's' : ''} in this range.`
              : ', because the value jumps rather than sliding between them.'}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
