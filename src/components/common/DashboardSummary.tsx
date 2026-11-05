// v0.18: teacher-dashboard summary widget.
//
// Surfaces the headline counts computed by lib/dashboardSummary.ts as a row
// of stat tiles + a few small lists. Renders at the top of
// TeacherWorkflowHome above the workflow steps. Empty states are explicit
// so a brand-new device doesn't look broken.

import { ITEMS } from '../../data/items';
import { buildDashboardSummary, type DashboardSummary } from '../../lib/dashboardSummary';
import {
  getActivePilot as _ignored, // noqa — surfaces an active-pilot marker elsewhere
} from '../../lib/storage';
import { loadClassrooms } from '../../lib/classroomStore';
import {
  loadItemReviews,
  loadSessions,
  loadStudents,
} from '../../lib/storage';
import { SKILL_SHORT_LABELS } from '../../types';
import { useMemo } from 'react';

void _ignored;

export function DashboardSummary() {
  const summary: DashboardSummary = useMemo(() => {
    return buildDashboardSummary({
      students: loadStudents(),
      sessions: loadSessions(),
      classrooms: loadClassrooms(),
      itemReviews: loadItemReviews(),
      items: ITEMS,
    });
  }, []);

  // Treat "nothing yet" specially.
  const isEmpty =
    summary.rosterSize === 0 &&
    summary.sessionsCompleted === 0 &&
    summary.activeClassrooms === 0;

  if (isEmpty) {
    return (
      <section className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600 sm:p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          At a glance
        </div>
        <p className="mt-2">
          No students or sessions yet on this device. Create a classroom and
          add students from the Classrooms view to get started, or seed sample
          data from below to explore the dashboard.
        </p>
      </section>
    );
  }

  const accPct = Math.round(summary.averageAccuracy * 100);
  const trendLabel = computeTrendLabel(summary.accuracyTrend);

  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            At a glance
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Your class on this device</h2>
        </div>
        <div className="text-xs text-slate-500">
          {summary.sessionsLast7d} session
          {summary.sessionsLast7d === 1 ? '' : 's'} in the last 7 days
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Students assessed" value={summary.students} subtext={`${summary.rosterSize} in roster`} />
        <StatTile label="Active classrooms" value={summary.activeClassrooms} />
        <StatTile label="Sessions completed" value={summary.sessionsCompleted} subtext={`${summary.sessionsLast7d} this week`} />
        <StatTile
          label="Average accuracy"
          value={`${accPct}%`}
          subtext={trendLabel}
          subtextClass={
            trendLabel.startsWith('↑')
              ? 'text-emerald-700'
              : trendLabel.startsWith('↓')
                ? 'text-rose-700'
                : 'text-slate-500'
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ListCard title="Weakest skills" emptyMessage="Not enough attempts yet.">
          {summary.weakestSkills.length > 0 && (
            <ul className="space-y-1.5 text-xs">
              {summary.weakestSkills.map((s) => (
                <li
                  key={s.skillId}
                  className="flex items-baseline justify-between gap-2"
                >
                  <span className="font-medium text-slate-800">{SKILL_SHORT_LABELS[s.skillId]}</span>
                  <span className="font-semibold text-rose-700">
                    {Math.round(s.accuracy * 100)}%{' '}
                    <span className="font-normal text-slate-500">
                      ({s.attempted})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ListCard>
        <ListCard
          title="Flagged misconceptions"
          emptyMessage="No misconceptions tagged yet."
        >
          {summary.topMisconceptions.length > 0 && (
            <ul className="space-y-1.5 text-xs">
              {summary.topMisconceptions.map((m) => (
                <li
                  key={m.code}
                  className="flex items-baseline justify-between gap-2"
                >
                  <span className="text-slate-800">{m.label}</span>
                  <span className="font-semibold text-amber-700">×{m.count}</span>
                </li>
              ))}
            </ul>
          )}
        </ListCard>
        <ListCard title="Recent activity" emptyMessage="No sessions yet.">
          {summary.recentActivity.length > 0 && (
            <ul className="space-y-1.5 text-xs">
              {summary.recentActivity.map((a) => (
                <li
                  key={a.sessionId}
                  className="flex items-baseline justify-between gap-2"
                >
                  <span className="truncate font-medium text-slate-800">
                    {a.studentName}
                  </span>
                  <span className="text-slate-500">
                    {timeAgoShort(a.completedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ListCard>
      </div>

      {summary.flaggedItemsCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <strong>{summary.flaggedItemsCount}</strong>{' '}
          item{summary.flaggedItemsCount === 1 ? ' has' : 's have'} been
          flagged as needing revision. Open <em>Item review</em> to clear the
          queue.
        </div>
      )}
    </section>
  );
}

function StatTile({
  label,
  value,
  subtext,
  subtextClass,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  subtextClass?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {subtext && (
        <div className={`mt-0.5 text-[11px] ${subtextClass ?? 'text-slate-500'}`}>
          {subtext}
        </div>
      )}
    </div>
  );
}

function ListCard({
  title,
  emptyMessage,
  children,
}: {
  title: string;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  const empty =
    children === null ||
    children === undefined ||
    (Array.isArray(children) && children.length === 0) ||
    (Array.isArray(children) && children.every((c) => !c));
  return (
    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="mt-2 min-h-[60px]">
        {empty ? (
          <div className="text-xs italic text-slate-500">{emptyMessage}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function computeTrendLabel(
  trend: { weekStartMs: number; accuracy: number; sessions: number }[]
): string {
  if (trend.length < 2) return 'this week';
  const last = trend[trend.length - 1];
  const prev = trend[trend.length - 2];
  if (last.sessions === 0 || prev.sessions === 0) return 'this week';
  const delta = last.accuracy - prev.accuracy;
  const pct = Math.round(delta * 100);
  if (pct >= 3) return `↑ ${pct}% vs. last week`;
  if (pct <= -3) return `↓ ${Math.abs(pct)}% vs. last week`;
  return 'stable vs. last week';
}

function timeAgoShort(ts: number): string {
  const delta = Date.now() - ts;
  if (delta < 60_000) return 'just now';
  const min = Math.round(delta / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}
