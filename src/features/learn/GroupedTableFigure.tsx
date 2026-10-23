// ===========================================================================
// v0.84.0-c10.5 checkpoint 59 — THE GROUPED-FREQUENCY TABLE.
//
// Every cell is computed from the distribution, so a corrected frequency
// changes the whole table and its totals together.
//
// Real scope="col" and scope="row" headers, and a totals row marked as such,
// because a screen-reader user must be able to RECONSTRUCT the calculation
// rather than infer it from alignment. Dense tables scroll inside their own
// container, so the page itself never overflows sideways.
// ===========================================================================

import {
  derivedTable, totalFrequency, sumFx, sumFd, sumFu,
  type GroupedTableSpec,
} from '../../curriculum/groupedDistribution';

const HEAD: Record<string, string> = {
  classMark: 'Class mark x\u1d62',
  fx: 'f\u1d62x\u1d62',
  cumulative: 'Cumulative frequency',
  d: 'd\u1d62 = x\u1d62 \u2212 a',
  fd: 'f\u1d62d\u1d62',
  u: 'u\u1d62 = (x\u1d62 \u2212 a) / h',
  fu: 'f\u1d62u\u1d62',
};

const show = (v: number | null) =>
  v === null ? '' : Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4)));

export function GroupedTableFigure({ spec }: { spec: GroupedTableSpec }) {
  const rows = derivedTable(spec.distribution, spec.assumedMean);
  const a = spec.assumedMean;
  const totals: Record<string, number | null> = {
    frequency: totalFrequency(spec.distribution),
    fx: spec.columns.includes('fx') ? sumFx(spec.distribution) : null,
    fd: spec.columns.includes('fd') && a !== undefined ? sumFd(spec.distribution, a) : null,
    fu: spec.columns.includes('fu') && a !== undefined ? sumFu(spec.distribution, a) : null,
  };

  return (
    <figure className="my-4 rounded-2xl border border-slate-200 bg-white p-4">
      {a !== undefined && (
        <p className="mb-2 text-sm text-slate-700">{`Assumed mean a = ${a}`}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[18rem] text-left text-sm">
          <caption className="sr-only">{spec.caption}</caption>
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th scope="col" className="py-1 pr-3">{spec.distribution.quantity}</th>
              <th scope="col" className="py-1 pr-3">{`Number of ${spec.distribution.unitLabel}s (f\u1d62)`}</th>
              {spec.columns.map((c) => (
                <th key={c} scope="col" className="py-1 pr-3">{HEAD[c]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-slate-100">
                <th scope="row" className="py-1 pr-3 font-medium text-slate-800">{r.label}</th>
                <td className="py-1 pr-3 text-slate-700">{r.frequency}</td>
                {spec.columns.map((c) => (
                  <td key={c} className="py-1 pr-3 font-mono text-slate-700">
                    {show(r[c] as number | null)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t-2 border-slate-300 font-semibold">
              <th scope="row" className="py-1 pr-3 text-slate-900">Total</th>
              <td className="py-1 pr-3 text-slate-900">{totals.frequency}</td>
              {spec.columns.map((c) => (
                <td key={c} className="py-1 pr-3 font-mono text-slate-900">
                  {show((totals[c] ?? null) as number | null)}
                </td>
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
