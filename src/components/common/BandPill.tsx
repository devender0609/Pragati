import { bandColor, type Band } from '../../lib/scoring';

// BandPill — small pill that shows a performance band (Foundational /
// Developing / On Track / Advanced) with the matching colour ring.
// Extracted from App.tsx in v0.14.
export function BandPill({ band }: { band: Band }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${bandColor(band)}`}
    >
      {band}
    </span>
  );
}
