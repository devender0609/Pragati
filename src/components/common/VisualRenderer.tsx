import type {
  AreaGrid,
  FractionBar,
  VisualSpec,
} from '../../data/items';

// VisualRenderer — renders a fraction-bar or area-grid VisualSpec. Pulled
// out of App.tsx in v0.13. Behavior is byte-identical: same colours, same
// outer dimensions, same a11y labels, same caption format.
//
// Layout invariants preserved:
//   - All fraction bars share the same outer width so a 1/4 bar and a 1/8
//     bar represent the SAME whole. Only partition count changes.
//   - All area grids share the same outer square. Only the row × col
//     partition changes.

const BAR_OUTER_WIDTH = 280;
const BAR_OUTER_HEIGHT = 40;
const GRID_OUTER_SIZE = 168;

export function VisualRenderer({ visual }: { visual: VisualSpec }) {
  if (visual.kind === 'bars') {
    return (
      <div className="mt-1 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
        {visual.bars.map((bar, i) => (
          <FractionBarSVG key={i} bar={bar} />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-1 flex flex-wrap items-end gap-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      {visual.grids.map((grid, i) => (
        <AreaGridSVG key={i} grid={grid} />
      ))}
    </div>
  );
}

function FractionBarSVG({ bar }: { bar: FractionBar }) {
  const fillColor = '#2563eb'; // brand-600
  const strokeColor = '#1e3a8a'; // brand-900
  const cellWidth = BAR_OUTER_WIDTH / bar.denominator;
  const ariaLabel = `Fraction bar for ${bar.label}: a whole bar split into ${bar.denominator} equal parts, with ${bar.numerator} part${bar.numerator === 1 ? '' : 's'} shaded.`;
  return (
    <figure className="flex flex-col gap-1">
      <svg
        width={BAR_OUTER_WIDTH}
        height={BAR_OUTER_HEIGHT}
        viewBox={`0 0 ${BAR_OUTER_WIDTH} ${BAR_OUTER_HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className="block h-auto max-w-full"
      >
        <rect
          x={0.5}
          y={0.5}
          width={BAR_OUTER_WIDTH - 1}
          height={BAR_OUTER_HEIGHT - 1}
          fill="#ffffff"
          stroke={strokeColor}
          strokeWidth={1.5}
        />
        {Array.from({ length: bar.denominator }, (_, i) => (
          <rect
            key={i}
            x={i * cellWidth}
            y={0}
            width={cellWidth}
            height={BAR_OUTER_HEIGHT}
            fill={i < bar.numerator ? fillColor : 'transparent'}
            stroke={strokeColor}
            strokeWidth={1}
          />
        ))}
      </svg>
      <figcaption className="text-xs font-medium text-slate-700">
        {bar.label} — {bar.numerator} of {bar.denominator} equal parts shaded
      </figcaption>
    </figure>
  );
}

function AreaGridSVG({ grid }: { grid: AreaGrid }) {
  const fillColor = '#2563eb';
  const strokeColor = '#1e3a8a';
  const cellW = GRID_OUTER_SIZE / grid.cols;
  const cellH = GRID_OUTER_SIZE / grid.rows;
  const totalCells = grid.rows * grid.cols;
  const ariaLabel = `Area model for ${grid.label}: a whole rectangle split into a ${grid.rows} by ${grid.cols} grid (${totalCells} equal cells), with ${grid.shaded} cell${grid.shaded === 1 ? '' : 's'} shaded.`;
  return (
    <figure className="flex flex-col gap-1">
      <svg
        width={GRID_OUTER_SIZE}
        height={GRID_OUTER_SIZE}
        viewBox={`0 0 ${GRID_OUTER_SIZE} ${GRID_OUTER_SIZE}`}
        role="img"
        aria-label={ariaLabel}
        className="block h-auto max-w-full"
      >
        <rect
          x={0.5}
          y={0.5}
          width={GRID_OUTER_SIZE - 1}
          height={GRID_OUTER_SIZE - 1}
          fill="#ffffff"
          stroke={strokeColor}
          strokeWidth={1.5}
        />
        {Array.from({ length: totalCells }, (_, i) => {
          const r = Math.floor(i / grid.cols);
          const c = i % grid.cols;
          return (
            <rect
              key={i}
              x={c * cellW}
              y={r * cellH}
              width={cellW}
              height={cellH}
              fill={i < grid.shaded ? fillColor : 'transparent'}
              stroke={strokeColor}
              strokeWidth={1}
            />
          );
        })}
      </svg>
      <figcaption className="text-xs font-medium text-slate-700">
        {grid.label} — {grid.shaded} of {totalCells} equal cells shaded
      </figcaption>
    </figure>
  );
}
