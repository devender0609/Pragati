import { type ChainRuleSpec } from '../../curriculum/derivative';
import { type SpecialSumSpec } from '../../curriculum/sequences';
// ===========================================================================
// v0.84.0-c11.22 checkpoint 88 — RENDERERS FOR STAGE TREES AND ARRANGEMENTS.
//
// Written with the specs, per the rule earlier checkpoints paid for four
// times over. Every branch and every arrangement comes from the model: the
// tree's leaves are the stage product, and the arrangement list is the
// enumerated distinct arrangements, so a figure cannot show a count the
// semantics does not have.
// ===========================================================================

import type { CoefficientRowsSpec } from '../../curriculum/binomial';
import type { IndexedSequenceSpec } from '../../curriculum/sequences';
import { type DeviationTableSpec, type MethodComparisonSpec, deviationRows } from '../../curriculum/dispersion';
import {
  type Coordinate3DSpec, type Point3D, describePosition, formatDistance3D, orderedTriple,
  p3, planeEquation, planeName, project3D,
} from '../../curriculum/coordinateSpace';
import {
  type HalfPlaneRegionSpec, type NumberLineRegionSpec, boundaryEquation, boundaryIncluded,
  containsPoint, describeHalfPlane, describeRay, solve,
} from '../../curriculum/inequality';
import type { ArrangementSpec, StageTreeSpec } from '../../curriculum/counting';


export function StageTree({ spec }: { spec: StageTreeSpec }) {
  const stages = spec.choice.stages;
  const W = 320, rowH = 86, H = 40 + stages.length * rowH;
  // Positions are computed from the branching, never placed by hand.
  const levels: Array<Array<{ x: number; label: string; parent: number | null }>> = [];
  let previous: Array<{ x: number; label: string; parent: number | null }> = [{ x: W / 2, label: 'start', parent: null }];
  levels.push(previous);
  stages.forEach((s) => {
    const next: Array<{ x: number; label: string; parent: number | null }> = [];
    const span = W / (previous.length * s.choices + 1);
    previous.forEach((_parent, pi) => {
      for (let i = 0; i < s.choices; i += 1) {
        next.push({ x: span * (next.length + 1), label: `${s.name.charAt(0).toUpperCase()}${i + 1}`, parent: pi });
      }
    });
    levels.push(next);
    previous = next;
  });

  return (
    <figure className="my-4">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, height: 'auto' }}
        role="img" aria-label={spec.altText}>
        <title>{spec.altText}</title>
        {levels.slice(1).map((level, d) => (
          <g key={`lvl-${d}`}>
            {level.map((node, i) => {
              const parent = levels[d][node.parent ?? 0];
              const y = 24 + (d + 1) * rowH, py = 24 + d * rowH;
              return (
                <g key={`n-${d}-${i}`}>
                  <line x1={parent.x} y1={py + 6} x2={node.x} y2={y - 12} stroke="currentColor" strokeWidth={1.2} opacity={0.7} />
                  <circle cx={node.x} cy={y} r={3} fill="currentColor" />
                  <text x={node.x} y={y + 14} fontSize={9} textAnchor="middle" fill="currentColor">{node.label}</text>
                </g>
              );
            })}
          </g>
        ))}
        <circle cx={W / 2} cy={24} r={3.5} fill="currentColor" />
      </svg>
      <figcaption className="mt-1 text-sm opacity-80">
        {spec.choice.stages.map((s) => `${s.choices} ${s.name}`).join(' × ')} ={' '}
        {spec.totalText} outcomes, one for every path from the top to a last branch.
      </figcaption>
    </figure>
  );
}

export function Arrangement({ spec }: { spec: ArrangementSpec }) {
  const more = spec.totalCount - spec.shown.length;
  return (
    <figure className="my-4" role="group" aria-label={spec.altText}>
      <ol className="mt-1 flex flex-wrap gap-2 text-sm">
        {spec.shown.map((a) => (
          <li key={a} className="rounded border border-slate-300 px-2 py-1 font-mono">{a}</li>
        ))}
      </ol>
      <figcaption className="mt-1 text-sm opacity-80">
        {/* Every arrangement listed once: repeating one would be the exact
            overcount the division removes. */}
        {spec.totalText} distinct arrangements of{' '}
        {spec.arrangement.groups.map((g) => `${g.count} ${g.label}`).join(', ')}
        {more > 0 ? `; the first ${spec.shown.length} are shown.` : '.'}
      </figcaption>
    </figure>
  );
}

/**
 * v0.84.0-c11.24 checkpoint 89 — rows of binomial coefficients.
 *
 * A table, because that is what rows of numbers are. Every entry came from
 * `nCr`; nothing here is hand-written, so the figure cannot drift from the
 * theorem it illustrates.
 */
export function CoefficientRows({ spec }: { spec: CoefficientRowsSpec }) {
  return (
    <figure className="my-4" aria-label={spec.altText}>
      <table className="mx-auto text-sm">
        <caption className="sr-only">{spec.altText}</caption>
        <tbody>
          {spec.rows.map((row) => (
            <tr key={row.n}>
              <th scope="row" className="pr-3 text-right font-normal opacity-70">
                n = {row.n}
              </th>
              {row.entries.map((v, i) => (
                <td key={`${row.n}-${i}`} className="px-2 py-0.5 text-center font-mono">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-1 text-sm opacity-80">
        Row n holds nC0 up to nCn. Each entry is the number of ways to choose
        that many of the n factors to contribute the second symbol.
      </figcaption>
    </figure>
  );
}

/**
 * v0.84.0-c11.29 checkpoint 91C — a sequence read forward from its first
 * index. Real table semantics, so the index and the value are headed
 * columns rather than positions on a screen; the limiting value, when the
 * model found one, is stated below rather than placed in a row, because it
 * is not a term of the sequence.
 */
export function IndexedSequence({ spec }: { spec: IndexedSequenceSpec }) {
  return (
    <figure className="my-4" aria-label={spec.altText}>
      <table className="mx-auto text-sm">
        <caption className="sr-only">{spec.altText}</caption>
        <thead>
          <tr>
            <th scope="col" className="px-3 py-1 text-right font-semibold">{spec.indexLabel}</th>
            <th scope="col" className="px-3 py-1 text-right font-semibold">{spec.valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {spec.rows.map((row) => (
            <tr key={row.n}>
              <th scope="row" className="px-3 py-0.5 text-right font-normal opacity-70">{row.n}</th>
              <td className="px-3 py-0.5 text-right font-mono">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-1 text-sm opacity-80">
        {spec.approaches !== undefined
          ? `Each total is closer to ${spec.approaches} than the one before, and none of them reaches it. That value is the limit of this sequence, not a term in it.`
          : spec.divergenceReason !== undefined
            ? `These totals never settle: ${spec.divergenceReason}. There is no sum.`
            : `The first ${spec.rows.length} values of the sequence, read forward.`}
      </figcaption>
    </figure>
  );
}

/**
 * v0.84.0-c11.34 checkpoint 93E — the ungrouped deviation table.
 *
 * Real table semantics with scope="col" headers and each observation as a
 * row header, so the calculation can be reconstructed without reading
 * alignment. It scrolls inside its own container, so the page never
 * overflows sideways at 360px.
 */
export function DeviationTable({ spec }: { spec: DeviationTableSpec }) {
  const rows = deviationRows(spec);
  const HEAD: Record<string, [string, string]> = {
    deviation: ['x\u1d62 \u2212 a', 'deviation from the centre'],
    absolute: ['|x\u1d62 \u2212 a|', 'absolute deviation from the centre'],
    squared: ['(x\u1d62 \u2212 a)\u00b2', 'squared deviation from the centre'],
  };
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4))));
  const total = (k: 'deviation' | 'absolute' | 'squared') =>
    rows.reduce((a, r) => a + r[k], 0);
  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-4" data-visual-kind="deviation_table" aria-label={spec.altText}>
      <p className="mb-2 text-sm text-slate-700">
        {`Centre: the ${spec.centre.kind} = ${fmt(spec.centre.value)}`}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[16rem] text-left text-sm">
          <caption className="sr-only">{spec.caption}</caption>
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th scope="col" className="py-1 pr-3">
                <span aria-hidden="true">x&#x1d62;</span>
                <span className="sr-only">observation</span>
              </th>
              {spec.columns.map((c) => (
                <th key={c} scope="col" className="py-1 pr-3">
                  <span aria-hidden="true">{HEAD[c][0]}</span>
                  <span className="sr-only">{HEAD[c][1]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.x}_${i}`} className="border-b border-slate-100">
                <th scope="row" className="py-1 pr-3 font-medium text-slate-800">{fmt(r.x)}</th>
                {spec.columns.map((c) => (
                  <td key={c} className="py-1 pr-3 font-mono text-slate-700">{fmt(r[c])}</td>
                ))}
              </tr>
            ))}
            <tr className="border-t-2 border-slate-300 font-semibold">
              <th scope="row" className="py-1 pr-3 text-slate-900">Total</th>
              {spec.columns.map((c) => (
                <td key={c} className="py-1 pr-3 font-mono text-slate-900">{fmt(total(c))}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <figcaption className="mt-2 text-sm text-slate-700">{spec.caption}</figcaption>
      <p className="sr-only">{spec.altText}</p>
    </figure>
  );
}

/**
 * The two methods side by side. Both numbers come from one reconciliation
 * object, so the page cannot show agreement that the model does not have.
 */
export function MethodComparison({ spec }: { spec: MethodComparisonSpec }) {
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4))));
  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-4" data-visual-kind="method_comparison" aria-label={spec.altText}>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{spec.caption}</caption>
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="py-1 pr-3">Method</th>
            <th scope="col" className="py-1 pr-3">Variance</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <th scope="row" className="py-1 pr-3 font-medium text-slate-800">Direct method</th>
            <td className="py-1 pr-3 font-mono text-slate-700">{fmt(spec.directVariance)}</td>
          </tr>
          <tr>
            <th scope="row" className="py-1 pr-3 font-medium text-slate-800">
              {`Shortcut method (a = ${spec.assumedMean})`}
            </th>
            <td className="py-1 pr-3 font-mono text-slate-700">{fmt(spec.shortcutVariance)}</td>
          </tr>
        </tbody>
      </table>
      <figcaption className="mt-2 text-sm text-slate-700">
        {spec.agree
          ? `Both routes give ${fmt(spec.directVariance)}. They are two ways of computing one quantity, not two answers.`
          : 'These results disagree, so one of them contains an error.'}
      </figcaption>
      <p className="sr-only">{spec.altText}</p>
    </figure>
  );
}

/**
 * v0.84.0-c11.39 checkpoint 96 — a solution ray on the number line.
 *
 * The endpoint is drawn open or closed from the RELATION, so the picture
 * cannot contradict the algebra: there is no field to set wrongly. The
 * accessible text states the boundary value, whether it belongs, and the
 * direction — not "number line graphic".
 */
export function NumberLineRegion({ spec }: { spec: NumberLineRegionSpec }) {
  const ray = solve(spec.inequality);
  const { from, to } = spec;
  const W = 420; const H = 72; const pad = 24;
  const at = (x: number) => pad + ((x - from) / (to - from)) * (W - 2 * pad);
  const bx = at(ray.boundary);
  const endX = ray.direction === 'greater' ? W - pad : pad;
  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-4"
      data-visual-kind="number_line_region" aria-label={spec.altText}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={spec.altText}>
        <line x1={pad} y1={36} x2={W - pad} y2={36} stroke="currentColor" strokeWidth="1.5" />
        {Array.from({ length: to - from + 1 }, (_, i) => from + i).map((v) => (
          <g key={v}>
            <line x1={at(v)} y1={32} x2={at(v)} y2={40} stroke="currentColor" strokeWidth="1" />
            <text x={at(v)} y={56} textAnchor="middle" fontSize="11" fill="currentColor">{v}</text>
          </g>
        ))}
        <line x1={bx} y1={36} x2={endX} y2={36} stroke="currentColor" strokeWidth="5" opacity="0.45" />
        <circle cx={bx} cy={36} r="6" stroke="currentColor" strokeWidth="2"
          fill={ray.included ? 'currentColor' : 'white'} />
      </svg>
      <figcaption className="mt-1 text-sm text-slate-700">{spec.caption}</figcaption>
      <p className="mt-1 text-sm text-slate-700">
        {`The shaded part shows ${describeRay(spec.inequality)}. The circle at ${ray.boundary} is `
          + `${ray.included ? 'filled, because that value belongs to the solution set' : 'open, because that value does not belong'}.`}
      </p>
    </figure>
  );
}

/**
 * A region of the coordinate plane: one half-plane or the intersection of
 * several. What is drawn is the region clipped to the viewport; the
 * solution set itself is unbounded, and the caption says so.
 *
 * Shading is decided by testing a point against the inequality, so the
 * shaded side cannot drift from what the algebra says.
 */
export function HalfPlaneRegion({ spec }: { spec: HalfPlaneRegionSpec }) {
  const { xMin, xMax, yMin, yMax } = spec.viewport;
  const W = 300; const H = 300; const pad = 8;
  const px = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad);
  const py = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad);
  // The drawn region: grid cells whose centre satisfies every member.
  const step = (xMax - xMin) / 48;
  const cells: Array<{ x: number; y: number }> = [];
  for (let x = xMin; x < xMax; x += step) {
    for (let y = yMin; y < yMax; y += step) {
      const cx = x + step / 2; const cy = y + step / 2;
      if (spec.members.every((m) => containsPoint(m, cx, cy))) cells.push({ x, y });
    }
  }
  const cw = px(xMin + step) - px(xMin);
  const ch = py(yMin) - py(yMin + step);
  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-4"
      data-visual-kind="half_plane_region" aria-label={spec.altText}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs" role="img" aria-label={spec.altText}>
        {cells.map((c) => (
          <rect key={`${c.x}_${c.y}`} x={px(c.x)} y={py(c.y + step)} width={cw + 0.5} height={ch + 0.5}
            fill="currentColor" opacity="0.18" />
        ))}
        <line x1={px(xMin)} y1={py(0)} x2={px(xMax)} y2={py(0)} stroke="currentColor" strokeWidth="1" />
        <line x1={px(0)} y1={py(yMin)} x2={px(0)} y2={py(yMax)} stroke="currentColor" strokeWidth="1" />
        {spec.members.map((m) => {
          // General form throughout: a vertical boundary has no slope, and
          // dividing by b would fail on exactly that case.
          const pts = m.b === 0
            ? [[m.c / m.a, yMin], [m.c / m.a, yMax]]
            : [[xMin, (m.c - m.a * xMin) / m.b], [xMax, (m.c - m.a * xMax) / m.b]];
          return (
            <line key={m.id} x1={px(pts[0][0])} y1={py(pts[0][1])} x2={px(pts[1][0])} y2={py(pts[1][1])}
              stroke="currentColor" strokeWidth="2"
              strokeDasharray={boundaryIncluded(m.relation) ? undefined : '5 4'} />
          );
        })}
      </svg>
      <figcaption className="mt-1 text-sm text-slate-700">{spec.caption}</figcaption>
      <ul className="mt-1 text-sm text-slate-700">
        {spec.members.map((m) => (
          <li key={m.id}>{`${boundaryEquation(m)}: the shaded part is ${describeHalfPlane(m)}.`}</li>
        ))}
        {spec.members.length > 1 && (
          <li>{'The region shown is where all of these overlap, so every point in it satisfies every inequality.'}</li>
        )}
        <li>{'Only the part inside the axes is drawn; the solution set itself continues beyond them.'}</li>
      </ul>
    </figure>
  );
}

/**
 * v0.84.0-c11.42 checkpoint 97 — a three-dimensional coordinate figure.
 *
 * The projection happens HERE and only here. Every coordinate, octant and
 * distance shown is computed from the exact semantic points; nothing is
 * read back off the drawing. A screen reader cannot infer depth from a
 * flat projection, so the text states each point's coordinates outright.
 */
export function Coordinate3D({ spec }: { spec: Coordinate3DSpec }) {
  const SIZE = 300;
  const at = (p: Point3D) => project3D(p, spec.extent, SIZE);
  const axisEnd = (which: 'x' | 'y' | 'z') => project3D(
    p3('_e', which === 'x' ? spec.extent : 0, which === 'y' ? spec.extent : 0, which === 'z' ? spec.extent : 0, ''),
    spec.extent, SIZE,
  );
  // v0.84.0-c11.44 checkpoint 97D — the axis LETTER sits slightly beyond
  // the axis end, so it never lands among the plotted points. At 1280 the
  // y label was 7px covered by a point's coordinate text, leaving a 9px
  // label mostly hidden. The line itself is unchanged; only the letter
  // moves, and it moves by a fixed fraction of the extent, so the
  // placement stays deterministic.
  const axisLabelAt = (which: 'x' | 'y' | 'z') => project3D(
    p3('_l', which === 'x' ? spec.extent * 1.18 : 0, which === 'y' ? spec.extent * 1.18 : 0,
      which === 'z' ? spec.extent * 1.18 : 0, ''),
    spec.extent, SIZE,
  );
  const origin = project3D(p3('_o', 0, 0, 0, 'O'), spec.extent, SIZE);
  const byId = new Map(spec.points.map((p) => [p.id, p]));
  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-4"
      data-visual-kind="coordinate_3d" aria-label={spec.altText}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-xs" role="img" aria-label={spec.altText}>
        {(['x', 'y', 'z'] as const).map((which) => {
          const e = axisEnd(which);
          const lbl = axisLabelAt(which);
          return (
            <g key={which}>
              <line x1={origin.sx} y1={origin.sy} x2={e.sx} y2={e.sy}
                stroke="currentColor" strokeWidth="1.5"
                strokeDasharray={which === 'y' ? '4 3' : undefined} />
              <text x={lbl.sx} y={lbl.sy - 2} fontSize="11" textAnchor="middle" fill="currentColor">{which}</text>
            </g>
          );
        })}
        {spec.segments.map((s, i) => {
          const a = byId.get(s.from); const z = byId.get(s.to);
          if (!a || !z) return null;
          const pa = at(a); const pz = at(z);
          return (
            <line key={`${s.from}_${s.to}_${i}`} x1={pa.sx} y1={pa.sy} x2={pz.sx} y2={pz.sy}
              stroke="currentColor" strokeWidth="2"
              strokeDasharray={s.style === 'dashed' ? '5 4' : undefined} />
          );
        })}
        {(() => {
          /*
           * v0.84.0-c11.50 checkpoint 100C — DECLUTTER THE POINT LABELS.
           *
           * Every label used the same fixed +7/-5 offset. That is fine for
           * scattered points, but a divided segment puts A, P and B on one
           * line a short way apart, so their labels landed on top of each
           * other at 1280, 834 and 360 alike.
           *
           * Each label takes the first candidate offset that clears the
           * labels already placed. The geometry is untouched: only the text
           * moves, and each dot stays exactly where the projection puts it.
           */
          const placed: Array<{ x: number; y: number; w: number }> = [];
          const CHAR = 5.6; const LINE = 12;
          // The historical position first, so scattered figures are
          // unchanged; then mirrors, then progressively further away.
          const CANDIDATES: ReadonlyArray<readonly [number, number]> = [
            [7, -5], [7, 11], [-7, -5], [-7, 11],
            [7, -17], [7, 23], [-7, -17], [-7, 23],
          ];
          return spec.points.map((p) => {
            const s = at(p);
            const w = `${p.label} ${orderedTriple(p)}`.length * CHAR;
            let [dx, dy] = CANDIDATES[0];
            for (const [cx, cy] of CANDIDATES) {
              const x = cx < 0 ? s.sx + cx - w : s.sx + cx;
              const y = s.sy + cy;
              if (!placed.some((q) => Math.abs(y - q.y) < LINE && x < q.x + q.w && q.x < x + w)) {
                dx = cx; dy = cy; break;
              }
            }
            placed.push({ x: dx < 0 ? s.sx + dx - w : s.sx + dx, y: s.sy + dy, w });
            return (
              <g key={p.id}>
                <circle cx={s.sx} cy={s.sy} r="4" fill="currentColor" />
                <text x={s.sx + dx} y={s.sy + dy} fontSize="11" fill="currentColor"
                  textAnchor={dx < 0 ? 'end' : 'start'}>
                  {`${p.label} ${orderedTriple(p)}`}
                </text>
              </g>
            );
          });
        })()}
      </svg>
      <figcaption className="mt-1 text-sm text-slate-700">{spec.caption}</figcaption>
      <ul className="mt-1 text-sm text-slate-700">
        {spec.planes.map((pl) => (
          <li key={pl}>{`The ${planeName(pl)} is where ${planeEquation(pl)}.`}</li>
        ))}
        {spec.points.map((p) => (
          <li key={p.id}>{`${p.label} is at ${orderedTriple(p)}, ${describePosition(p)}.`}</li>
        ))}
        {spec.divides ? (() => {
          const d = spec.divides!;
          const P = byId.get(d.point); const A = byId.get(d.from); const B = byId.get(d.to);
          if (!P || !A || !B) return null;
          return (
            <li key="divides">
              {`${P.label} at ${orderedTriple(P)} lies on the segment from ${A.label} to ${B.label}, `
                + `dividing it internally so that ${A.label}${P.label} : ${P.label}${B.label} `
                + `= ${d.m1} : ${d.m2}.`}
            </li>
          );
        })() : null}
        {spec.distanceBetween ? (() => {
          const a = byId.get(spec.distanceBetween[0]); const z = byId.get(spec.distanceBetween[1]);
          if (!a || !z) return null;
          return (
            <li key="dist">
              {`The distance from ${a.label} to ${z.label} is exactly ${formatDistance3D(a, z)}.`}
            </li>
          );
        })() : null}
        <li>{'The drawing is flat, so depth is shown at an angle; the coordinates above are the exact positions.'}</li>
      </ul>
    </figure>
  );
}

/**
 * v0.84.0-c11.51 checkpoint 101 — one sum, written four ways.
 *
 * Reads only what the spec carries; every value there was derived from
 * `specialSum`, so this draws the mathematics rather than restating it.
 */
export function SpecialSumView({ spec }: { spec: SpecialSumSpec }) {
  const rows: Array<[string, string]> = [
    ['In sigma notation', `${spec.sigma}`],
    ['Written out', spec.expanded],
    ['Closed form', spec.closedForm],
    ['Exact total', spec.result],
  ];
  return (
    <figure className="my-3" data-visual-kind="special_sum" aria-label={spec.altText}>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-slate-200 last:border-0">
              <th scope="row" className="py-1 pr-3 text-left font-medium text-slate-600 align-top whitespace-nowrap">
                {label}
              </th>
              <td className="py-1 text-slate-900">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-1 text-sm text-slate-700">{spec.caption}</figcaption>
    </figure>
  );
}

/** v0.84.0-c11.55 checkpoint 102B — one composite derivative, in layers. */
export function ChainRuleView({ spec }: { spec: ChainRuleSpec }) {
  const s = spec.sample;
  const rows: Array<[string, string]> = [
    ['The composite', spec.composite],
    ['Inner function', spec.innerName],
    ['Outer function', spec.outerName],
    ['Derivative of the outer', spec.outerDerivative],
    ['Outer derivative at the inner', spec.outerDerivativeAtInner],
    ['Derivative of the inner', spec.innerDerivative],
    ['Multiply them', spec.derivative],
  ];
  return (
    <figure className="my-3" data-visual-kind="chain_rule" aria-label={spec.altText}>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-slate-200 last:border-0">
              <th scope="row" className="py-1 pr-3 text-left font-medium text-slate-600 align-top">{label}</th>
              <td className="py-1 text-slate-900">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 text-sm text-slate-700">
        {`At x = ${s.x}: the inner function is ${s.innerValue}, the outer derivative there is `
          + `${s.outerAtInner}, the inner derivative is ${s.inner}, and ${s.outerAtInner} × ${s.inner} = ${s.product}.`}
      </p>
      <figcaption className="mt-1 text-sm text-slate-700">{spec.caption}</figcaption>
    </figure>
  );
}
