// ===========================================================================
// v0.84.0-c10.2 checkpoint 56 — DRAWING A COMPOSITE SOLID.
//
// Class 9 chose flat nets over perspective because a net states the
// mathematics and a perspective drawing only suggests it. The same judgement
// applies here: this draws a labelled vertical CROSS-SECTION, not a rendered
// solid, because the cross-section is where the join is visible and the
// dimensions can be read.
//
// The join is drawn as a dashed line and ALSO named in the surface table
// below it, because a student who cannot see the figure must still be able
// to answer which circle disappeared. Nothing here encodes "internal"
// through colour alone.
// ===========================================================================

import {
  exposedSurfaceArea,
  surfaceAccount,
  surfacesOf,
  type CompositeSolidSpec,
} from '../../curriculum/compositeSolidSpecification';

function Section({ spec }: { spec: CompositeSolidSpec }) {
  // A schematic cross-section: each component is drawn to its own stated
  // dimensions, stacked in declaration order.
  const W = 240;
  const unit = 10;
  const cx = W / 2;
  let y = 24;
  const parts: React.ReactElement[] = [];
  const joinYs: number[] = [];

  spec.components.forEach((c, i) => {
    const r = (c.dimensions.radius ?? c.dimensions.edge ?? c.dimensions.length ?? 2) * unit;
    const h = (c.dimensions.height ?? c.dimensions.edge ?? 0) * unit;
    if (c.kind === 'cylinder' || c.kind === 'cuboid' || c.kind === 'cube') {
      parts.push(
        <rect key={c.id} x={cx - r} y={y} width={2 * r} height={h} fill="none" stroke="currentColor" strokeWidth="1.5" />
      );
      y += h;
    } else if (c.kind === 'hemisphere') {
      parts.push(
        <path key={c.id} d={`M ${cx - r} ${y} A ${r} ${r} 0 0 0 ${cx + r} ${y}`} fill="none" stroke="currentColor" strokeWidth="1.5" />
      );
      y += r;
    } else if (c.kind === 'cone') {
      parts.push(
        <path key={c.id} d={`M ${cx - r} ${y} L ${cx} ${y - h} L ${cx + r} ${y} Z`} fill="none" stroke="currentColor" strokeWidth="1.5" />
      );
    } else if (c.kind === 'sphere') {
      parts.push(<circle key={c.id} cx={cx} cy={y + r} r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />);
      y += 2 * r;
    }
    if (i < spec.components.length - 1) joinYs.push(y);
  });

  return (
    <svg viewBox={`0 0 ${W} ${Math.max(y + 24, 120)}`} className="w-full max-w-xs text-slate-800" aria-hidden="true">
      {parts}
      {joinYs.map((jy, i) => (
        <line key={i} x1={24} y1={jy} x2={W - 24} y2={jy} stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" />
      ))}
    </svg>
  );
}

export function CompositeSolidFigure({ spec }: { spec: CompositeSolidSpec }) {
  const account = surfaceAccount(spec);
  const exposed = account.filter((a) => a.exposed);
  const internal = account.filter((a) => !a.exposed);

  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex justify-center">
        <Section spec={spec} />
      </div>

      {/* The surface account. This is the mathematics, not a legend: a reader
          who cannot see the drawing gets the same information from it. */}
      <table className="mt-3 w-full text-left text-sm">
        <caption className="sr-only">
          Every surface of the combined solid, and whether it is on the outside
        </caption>
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="py-1">Surface</th>
            <th scope="col" className="py-1">Area</th>
            <th scope="col" className="py-1">On the outside?</th>
          </tr>
        </thead>
        <tbody>
          {account.map((a) => (
            <tr key={`${a.component}-${a.surface}`} className="border-b border-slate-100 align-top">
              <th scope="row" className="py-1 font-medium text-slate-800">
                {`${a.surface} of the ${a.component}`}
              </th>
              <td className="py-1 font-mono text-slate-700">{a.formula}</td>
              <td className="py-1 text-slate-700">{a.exposed ? 'Yes — counted' : `No — ${a.reason.replace('internal \u2014 ', '')}`}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-2 text-xs text-slate-600">
        {`${exposed.length} surfaces counted, ${internal.length} internal.`}
      </p>
      <figcaption className="mt-2 text-sm text-slate-700">{spec.caption}</figcaption>
      <p className="sr-only">{spec.altText}</p>
    </figure>
  );
}

/** Exposed-area total, for a lesson that wants to print it beside the figure. */
export function exposedAreaOf(spec: CompositeSolidSpec): number {
  return exposedSurfaceArea(spec);
}

/** Every surface a component has, for prose that enumerates them. */
export { surfacesOf };
