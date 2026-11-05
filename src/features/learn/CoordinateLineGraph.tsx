// ===========================================================================
// v0.84.0-c11.13 checkpoint 84 — RENDERER FOR COORDINATE LINE GRAPHS.
//
// Written alongside the spec, per the rule checkpoint 82 established after
// finding two specs that validated and rendered nothing.
//
// Every stroke is computed from the line's exact coefficients. The drawn
// segment is a window onto an infinite line, which is why the caption
// describes the equation rather than the endpoints: a reader must not come
// away thinking the line stops where the picture does.
// ===========================================================================

import type { LineGraphSpec } from '../../curriculum/straightLine';
import { drawingEndpoints, generalForm } from '../../curriculum/straightLine';
import { toNumber } from '../../curriculum/coordinateGeometry';

export function CoordinateLineGraph({ spec }: { spec: LineGraphSpec }) {
  const S = spec.span;
  const W = 280, H = 280, pad = 22;
  const sx = (x: number) => pad + ((x + S) / (2 * S)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y + S) / (2 * S)) * (H - 2 * pad);
  const clamp = (v: number) => Math.max(-S, Math.min(S, v));

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
        <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="currentColor" strokeWidth={1} opacity={0.45} />
        <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="currentColor" strokeWidth={1} opacity={0.45} />
        <text x={W - pad + 2} y={sy(0) - 4} fontSize={9} fill="currentColor" opacity={0.7}>x</text>
        <text x={sx(0) + 4} y={pad - 4} fontSize={9} fill="currentColor" opacity={0.7}>y</text>
        {spec.lines.map((l, i) => {
          const [p, q] = drawingEndpoints(l, S);
          // Dashes distinguish a second line without relying on colour.
          const dashed = i > 0;
          return (
            <g key={l.id}>
              <line
                x1={sx(clamp(p.x))} y1={sy(clamp(p.y))}
                x2={sx(clamp(q.x))} y2={sy(clamp(q.y))}
                stroke="currentColor" strokeWidth={2}
                strokeDasharray={dashed ? '5 3' : undefined}
              />
            </g>
          );
        })}
        {[...spec.markedPoints, ...(spec.externalPoints ?? [])].map((m) => (
          <g key={m.id}>
            <circle cx={sx(toNumber(m.x))} cy={sy(toNumber(m.y))} r={3.5} fill="currentColor" />
            <text x={sx(toNumber(m.x)) + 6} y={sy(toNumber(m.y)) - 6} fontSize={10} fill="currentColor">
              {m.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-sm opacity-80">
        {spec.lines.map((l) => generalForm(l)).join('; ')}
        {spec.lines.length > 1 ? ' — the second line is drawn dashed.' : ''}
        {' The drawn segment is the part inside the window; the line itself continues in both directions.'}
      </figcaption>
    </figure>
  );
}
