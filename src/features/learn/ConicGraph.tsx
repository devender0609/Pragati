// ===========================================================================
// v0.84.0-c11.15 checkpoint 85 — RENDERERS FOR CONICS AND CONE SECTIONS.
//
// Written alongside the specs, per the rule checkpoints 82 and 84C paid for:
// a semantic visual that renders nothing is a product defect, and that rule
// only works when it runs on the oldest family as well as the newest.
//
// Every coordinate comes from the conic object. The hyperbola's branches are
// separate polylines, so nothing downstream can join them.
// ===========================================================================

import type { ConeSectionSpec, ConicGraphSpec } from '../../curriculum/conicSections';
import { conicBranches, directrix, foci, parabolaFocus, standardEquation } from '../../curriculum/conicSections';

const n = (r: { num: number; den: number }) => r.num / r.den;

export function ConicGraph({ spec }: { spec: ConicGraphSpec }) {
  const S = spec.span, W = 300, H = 300, pad = 20;
  const sx = (x: number) => pad + ((x + S) / (2 * S)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y + S) / (2 * S)) * (H - 2 * pad);
  const branches = conicBranches(spec.conic, S);
  const con = spec.conic;

  const marks: Array<{ x: number; y: number; label: string }> = [];
  if (con.kind === 'circle') marks.push({ x: n(con.centre.x), y: n(con.centre.y), label: 'C' });
  if (con.kind === 'parabola') {
    marks.push({ x: n(con.vertex.x), y: n(con.vertex.y), label: 'V' });
    if (spec.showFoci) { const f = parabolaFocus(con); marks.push({ x: n(f.x), y: n(f.y), label: 'F' }); }
  }
  if ((con.kind === 'ellipse' || con.kind === 'hyperbola') && spec.showFoci) {
    for (const f of foci(con)) marks.push({ x: n(f.x), y: n(f.y), label: f.label });
  }
  const d = con.kind === 'parabola' && spec.showDirectrix ? directrix(con) : null;

  return (
    <figure className="my-4">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, height: 'auto' }} role="img" aria-label={spec.altText}>
        <title>{spec.altText}</title>
        <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="currentColor" strokeWidth={1} opacity={0.4} />
        <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="currentColor" strokeWidth={1} opacity={0.4} />
        {d ? (
          d.axis === 'x'
            ? <line x1={sx(n(d.at))} y1={pad} x2={sx(n(d.at))} y2={H - pad} stroke="currentColor" strokeWidth={1.5} strokeDasharray="5 3" />
            : <line x1={pad} y1={sy(n(d.at))} x2={W - pad} y2={sy(n(d.at))} stroke="currentColor" strokeWidth={1.5} strokeDasharray="5 3" />
        ) : null}
        {branches.map((b, i) => (
          <polyline key={`br-${i}`} fill="none" stroke="currentColor" strokeWidth={2}
            points={b.map((p) => `${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`).join(' ')} />
        ))}
        {marks.map((m, i) => (
          <g key={`m-${i}`}>
            <circle cx={sx(m.x)} cy={sy(m.y)} r={3.2} fill="currentColor" />
            <text x={sx(m.x) + 6} y={sy(m.y) - 5} fontSize={10} fill="currentColor">{m.label}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-sm opacity-80">
        {standardEquation(spec.conic)}
        {branches.length > 1 ? ` — drawn in ${branches.length} separate branches, which never meet.` : ''}
        {d ? ` The dashed line is the directrix, ${d.written}.` : ''}
      </figcaption>
    </figure>
  );
}

const CUT_WORDS: Record<ConeSectionSpec['cut'], string> = {
  perpendicular_to_axis: 'perpendicular to the axis',
  oblique_not_parallel_to_generator: 'oblique, cutting every generator',
  parallel_to_generator: 'parallel to one generator',
  parallel_to_axis: 'parallel to the axis, meeting both nappes',
};

export function ConeSection({ spec }: { spec: ConeSectionSpec }) {
  const W = 260, H = 240, cx = 130, apex = 120, slope = 70;
  const away: Record<ConeSectionSpec['cut'], [number, number, number, number]> = {
    perpendicular_to_axis: [30, 60, 230, 60],
    oblique_not_parallel_to_generator: [34, 44, 226, 80],
    parallel_to_generator: [40, 20, 210, 110],
    parallel_to_axis: [95, 12, 95, 228],
  };
  // Through the vertex the plane pivots onto the apex, so the picture shows
  // why the section collapses rather than merely asserting it.
  const through: Record<ConeSectionSpec['cut'], [number, number, number, number]> = {
    perpendicular_to_axis: [30, apex, 230, apex],
    oblique_not_parallel_to_generator: [34, apex - 18, 226, apex + 18],
    parallel_to_generator: [cx, apex, cx + slope, 228],
    parallel_to_axis: [cx, 12, cx, 228],
  };
  const [x1, y1, x2, y2] = (spec.throughVertex ? through : away)[spec.cut];
  return (
    <figure className="my-4">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, height: 'auto' }} role="img" aria-label={spec.altText}>
        <title>{spec.altText}</title>
        <polygon points={`${cx},${apex} ${cx - slope},12 ${cx + slope},12`} fill="none" stroke="currentColor" strokeWidth={1.6} />
        <polygon points={`${cx},${apex} ${cx - slope},228 ${cx + slope},228`} fill="none" stroke="currentColor" strokeWidth={1.6} />
        <ellipse cx={cx} cy={12} rx={slope} ry={9} fill="none" stroke="currentColor" strokeWidth={1.2} opacity={0.7} />
        <ellipse cx={cx} cy={228} rx={slope} ry={9} fill="none" stroke="currentColor" strokeWidth={1.2} opacity={0.7} />
        <line x1={cx} y1={12} x2={cx} y2={228} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={2.2} />
        {spec.throughVertex ? <circle cx={cx} cy={apex} r={3.4} fill="currentColor" /> : null}
        <text x={6} y={H - 4} fontSize={10} fill="currentColor">{spec.result}</text>
      </svg>
      <figcaption className="mt-1 text-sm opacity-80">
        A plane {CUT_WORDS[spec.cut]}
        {spec.throughVertex ? ', passing through the vertex,' : ''} cuts the double cone in{' '}
        {spec.result === 'ellipse' ? 'an' : 'a'} {spec.result}.
      </figcaption>
    </figure>
  );
}
