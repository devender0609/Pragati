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
