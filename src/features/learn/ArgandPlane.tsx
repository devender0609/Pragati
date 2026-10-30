// ===========================================================================
// v0.84.0-c11.12 checkpoint 83 — RENDERER FOR THE ARGAND PLANE.
//
// Written in the same checkpoint as the spec, because checkpoint 82 showed
// what happens otherwise: a visual that validates perfectly and displays
// nothing at all.
//
// Every coordinate here comes from the complex number the point carries. The
// figure cannot drift from the mathematics because it holds no mathematics
// of its own.
// ===========================================================================

import type { ArgandSpec } from '../../curriculum/complexNumbers';

export function ArgandPlane({ spec }: { spec: ArgandSpec }) {
  const xs = spec.points.map((p) => p.x);
  const ys = spec.points.map((p) => p.y);
  const span = Math.max(1, ...xs.map(Math.abs), ...ys.map(Math.abs)) * 1.35;

  const W = 280, H = 280, pad = 24;
  const sx = (x: number) => pad + ((x + span) / (2 * span)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y + span) / (2 * span)) * (H - 2 * pad);

  return (
    <figure className="my-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W, height: 'auto' }}
        role="img"
        aria-label={spec.altText}
      >
        <title>{spec.altText}</title>
        {/* The real axis is horizontal and the imaginary axis vertical. */}
        <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="currentColor" strokeWidth={1} opacity={0.5} />
        <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="currentColor" strokeWidth={1} opacity={0.5} />
        <text x={W - pad + 2} y={sy(0) - 4} fontSize={9} fill="currentColor" opacity={0.75}>Re</text>
        <text x={sx(0) + 4} y={pad - 4} fontSize={9} fill="currentColor" opacity={0.75}>Im</text>
        {spec.points.map((p, i) => (
          <g key={`pt-${i}`}>
            {spec.showVectors ? (
              <line
                x1={sx(0)} y1={sy(0)} x2={sx(p.x)} y2={sy(p.y)}
                stroke="currentColor" strokeWidth={1.5} opacity={0.7}
              />
            ) : null}
            <circle cx={sx(p.x)} cy={sy(p.y)} r={3.5} fill="currentColor" />
            <text x={sx(p.x) + 6} y={sy(p.y) - 6} fontSize={10} fill="currentColor">{p.label}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-sm opacity-80">
        {/* The coordinates are restated in text, so the figure's claim is
            readable without seeing it. */}
        {spec.points.map((p) => `${p.label} at (${p.x}, ${p.y})`).join('; ')}
      </figcaption>
    </figure>
  );
}
