// ===========================================================================
// v0.84.0-c10.6 checkpoint 60 — DRAWING A PAIR OF LINEAR EQUATIONS.
//
// Every coordinate here is computed from the equations. Nothing is authored,
// so the picture cannot disagree with the algebra.
//
// Coincident pairs draw ONE line carrying both labels. Two strokes a pixel
// apart would say "two lines that nearly coincide", which is a different and
// false claim. The relationship is also stated in words beneath the axes, so
// it never depends on seeing which stroke is on top.
// ===========================================================================

import {
  clipToWindow, lineRelationship, uniqueSolution, toNumber, formatRational, windowOf,
  type LinearSystemGraphSpec,
} from '../../curriculum/linearSystem';

export function LinearSystemGraph({ spec }: { spec: LinearSystemGraphSpec }) {
  const s = spec.system;
  const w = windowOf(spec);
  const rel = lineRelationship(s);
  const W = 260;
  const H = 260;
  const pad = 26;
  const sx = (x: number) => pad + ((x - w.xMin) / (w.xMax - w.xMin)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - w.yMin) / (w.yMax - w.yMin)) * (H - 2 * pad);

  const firstEnds = clipToWindow(s.first, w);
  const secondEnds = clipToWindow(s.second, w);
  const sol = uniqueSolution(s);

  const line = (ends: Array<{ x: number; y: number }>, dash: string | undefined, key: string) =>
    ends.length === 2 ? (
      <line key={key} x1={sx(ends[0].x)} y1={sy(ends[0].y)} x2={sx(ends[1].x)} y2={sy(ends[1].y)}
        stroke="currentColor" strokeWidth="1.8" strokeDasharray={dash} />
    ) : null;

  const relationshipText = {
    intersecting: 'The two lines cross at one point.',
    distinct_parallel: 'The two lines are parallel and never meet.',
    coincident: 'Both equations describe the SAME line, drawn once below.',
  }[rel];

  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs text-slate-800" aria-hidden="true">
          {/* axes */}
          <line x1={sx(w.xMin)} y1={sy(0)} x2={sx(w.xMax)} y2={sy(0)} stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1={sx(0)} y1={sy(w.yMin)} x2={sx(0)} y2={sy(w.yMax)} stroke="currentColor" strokeWidth="1" opacity="0.5" />
          {line(firstEnds, undefined, 'first')}
          {/* A coincident pair is one line, not two. */}
          {rel !== 'coincident' && line(secondEnds, rel === 'distinct_parallel' ? undefined : '5 3', 'second')}
          {sol && (
            <circle cx={sx(toNumber(sol.x))} cy={sy(toNumber(sol.y))} r="4" fill="currentColor" />
          )}
        </svg>
      </div>

      {/* The relationship in words, so nothing rests on which stroke is seen. */}
      <p className="mt-2 text-sm font-medium text-slate-800">{relationshipText}</p>
      <ul className="mt-1 text-sm text-slate-700">
        <li>{rel === 'coincident' ? `${s.first.label} and ${s.second.label} \u2014 the same line` : s.first.label}</li>
        {rel !== 'coincident' && <li>{s.second.label}</li>}
      </ul>
      {sol && (
        <p className="mt-1 text-sm text-slate-700">
          {`They meet at (${formatRational(sol.x)}, ${formatRational(sol.y)}), which satisfies both equations.`}
        </p>
      )}
      <figcaption className="mt-2 text-sm text-slate-700">{spec.caption}</figcaption>
      <p className="sr-only">{spec.altText}</p>
    </figure>
  );
}
