import type { SkillBreakdown } from '../../lib/scoring';
import { SkillChip } from './SkillChip';

// Per-skill summary card for mixed sessions, showing accuracy plus the
// most-frequent misconceptions on that skill. Used by ResultsView and
// LatestSessionPanel. Extracted from App.tsx in v0.14.
export function SkillBreakdownCard({
  breakdown,
}: {
  breakdown: SkillBreakdown;
}) {
  const accPct = Math.round(breakdown.accuracy * 100);
  const top = breakdown.misconceptions.slice(0, 2);
  return (
    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-2">
        <SkillChip mode={breakdown.skillId} />
        <div className="text-xs text-slate-500">
          {breakdown.attempted} item{breakdown.attempted === 1 ? '' : 's'}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-3xl font-bold text-slate-900">{accPct}%</div>
        <div className="text-sm text-slate-600">
          ({breakdown.correct}/{breakdown.attempted} correct)
        </div>
      </div>
      <div className="mt-1 text-xs text-slate-500">
        avg time {breakdown.avgTimeSec}s/item
      </div>
      {top.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Top misconception{top.length > 1 ? 's' : ''}
          </div>
          <ul className="mt-1 space-y-1 text-xs text-slate-700">
            {top.map((m) => (
              <li key={m.code} className="flex items-start gap-2">
                <span className="font-medium">{m.label}</span>
                <span className="text-slate-500">({m.count}×)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
