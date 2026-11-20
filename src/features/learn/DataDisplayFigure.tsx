// ===========================================================================
// v0.84.0 checkpoint 37 — RENDERING A DATASET, NOT A PICTURE.
//
// Every bar's height here is computed from the dataset. Nothing in a lesson
// supplies a coordinate, so a bar cannot be drawn at the wrong height
// without the underlying number being wrong — which is the point: a bar of
// the wrong height does not look like a rendering bug to a student, it
// looks like a fact.
//
// The chart is followed by a real data table. That is not a fallback: for a
// reader using a screen reader the table IS the display, and it carries the
// totals a normalised chart deliberately discards.
// ===========================================================================

import type { DataSet, DataDisplaySpec } from '../../curriculum/dataDisplaySpecification';
import { categoryTotals, normalisedValues } from '../../curriculum/dataDisplaySpecification';

// Series are distinguished by fill pattern AND by legend text, never by
// colour alone — the figure is readable in one ink.
const PATTERNS = ['solid', 'hatch', 'dots', 'cross'] as const;

export function DataDisplayFigure({
  spec,
  data,
}: {
  spec: DataDisplaySpec;
  data: DataSet;
}) {
  const totals = categoryTotals(data);
  const normalised = normalisedValues(data);
  const stacked = spec.mode !== 'grouped';
  const max = stacked
    ? spec.mode === 'normalised_stacked'
      ? 100
      : Math.max(...totals)
    : Math.max(...data.series.flatMap((s) => s.values));

  const W = 320;
  const H = 180;
  const PAD_L = 34;
  const PAD_B = 28;
  const plotW = W - PAD_L - 8;
  const plotH = H - PAD_B - 10;
  const slot = plotW / data.categories.length;
  const barW = stacked ? Math.min(34, slot * 0.5) : Math.min(20, (slot * 0.7) / data.series.length);

  return (
    <figure className="my-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto h-auto w-full max-w-xl text-slate-700"
        role="img"
        aria-label={spec.altText}
      >
        <defs>
          <pattern id="dd-hatch" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0,6 l6,-6" stroke="currentColor" strokeWidth="1.6" />
          </pattern>
          <pattern id="dd-dots" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="currentColor" />
          </pattern>
          <pattern id="dd-cross" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0,6 l6,-6 M0,0 l6,6" stroke="currentColor" strokeWidth="1.2" />
          </pattern>
        </defs>
        {/* axes */}
        <line x1={PAD_L} y1={10} x2={PAD_L} y2={10 + plotH} stroke="currentColor" strokeWidth={1.4} />
        <line x1={PAD_L} y1={10 + plotH} x2={W - 8} y2={10 + plotH} stroke="currentColor" strokeWidth={1.4} />
        <text x={4} y={16} fontSize={9} fill="currentColor">
          {spec.mode === 'normalised_stacked' ? '100%' : String(Math.round(max))}
        </text>
        <text x={4} y={14 + plotH} fontSize={9} fill="currentColor">
          0
        </text>

        {data.categories.map((cat, ci) => {
          const centre = PAD_L + slot * ci + slot / 2;
          let cursor = 10 + plotH;
          return (
            <g key={cat}>
              {data.series.map((s, si) => {
                const raw = s.values[ci] ?? 0;
                const value = spec.mode === 'normalised_stacked' ? normalised[si][ci] : raw;
                const h = (value / max) * plotH;
                const pattern = PATTERNS[si % PATTERNS.length];
                const fill =
                  pattern === 'solid' ? 'currentColor' : `url(#dd-${pattern})`;
                const opacity = pattern === 'solid' ? 0.22 : 1;
                const x = stacked
                  ? centre - barW / 2
                  : centre - (barW * data.series.length) / 2 + si * barW;
                const top = stacked ? cursor - h : 10 + plotH - h;
                if (stacked) cursor -= h;
                return (
                  <rect
                    key={s.id}
                    x={x}
                    y={top}
                    width={barW}
                    height={Math.max(h, 0)}
                    fill={fill}
                    fillOpacity={opacity}
                    stroke="currentColor"
                    strokeWidth={1}
                  />
                );
              })}
              <text x={centre} y={H - 12} fontSize={9} textAnchor="middle" fill="currentColor">
                {cat}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend: pattern plus text, never colour alone. */}
      <ul className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
        {data.series.map((s, si) => (
          <li key={s.id}>
            {`${['filled', 'diagonal lines', 'dots', 'crosses'][si % 4]}: ${s.label}`}
          </li>
        ))}
      </ul>

      <figcaption className="mt-2 text-center text-sm text-slate-600">{spec.caption}</figcaption>

      {/* The data itself, for anyone who cannot or would rather not read a
          picture. It carries the totals, which a normalised chart drops. */}
      <table className="mx-auto mt-3 text-sm text-slate-700">
        <caption className="pb-1 text-xs text-slate-500">
          {`The same figures as a table — ${data.unit}`}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="px-2 text-left font-semibold">
              {data.categoryLabel}
            </th>
            {data.series.map((s) => (
              <th key={s.id} scope="col" className="px-2 text-right font-semibold">
                {s.label}
              </th>
            ))}
            <th scope="col" className="px-2 text-right font-semibold">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.categories.map((cat, ci) => (
            <tr key={cat}>
              <th scope="row" className="px-2 text-left font-normal">
                {cat}
              </th>
              {data.series.map((s, si) => (
                <td key={s.id} className="px-2 text-right">
                  {spec.mode === 'normalised_stacked'
                    ? `${Math.round(normalised[si][ci])}%`
                    : String(s.values[ci])}
                </td>
              ))}
              <td className="px-2 text-right">{String(totals[ci])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
