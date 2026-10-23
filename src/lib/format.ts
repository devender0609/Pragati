// Shared formatting helpers used across the UI. Extracted from App.tsx in
// v0.13 so the per-view component files don't each duplicate them.
//
// All functions are pure, defensive (never throw on bad input), and return
// plain strings ready to drop into JSX.

// Format a Date-like timestamp as "May 12, 2026". Returns "—" on bad input.
export function formatDate(ts: number | null | undefined): string {
  if (ts === null || ts === undefined || !Number.isFinite(ts)) return '—';
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

// Format a 0..1 fraction as a percent string ("57%"). Clamps NaN/Infinity to 0.
export function formatPercent(x: number, digits = 0): string {
  if (!Number.isFinite(x)) return '0%';
  const clamped = Math.max(0, Math.min(1, x));
  return `${(clamped * 100).toFixed(digits)}%`;
}

// Format a duration in milliseconds. Defaults to "Ms" (e.g. "32s", "1m 12s").
// Useful for response times in the assessment view and class dashboard.
export function formatMs(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '0s';
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

// Compact number formatter — "1,234" with locale grouping, falls back to
// String(n) if the locale isn't available.
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0';
  try {
    return n.toLocaleString();
  } catch {
    return String(n);
  }
}

// Pluralise a label by count: pluralise(1, 'student') === '1 student';
// pluralise(2, 'student') === '2 students'. Provide an explicit plural for
// irregulars: pluralise(1, 'analysis', 'analyses').
export function pluralise(
  count: number,
  singular: string,
  plural?: string
): string {
  const word = count === 1 ? singular : plural ?? `${singular}s`;
  return `${count} ${word}`;
}
