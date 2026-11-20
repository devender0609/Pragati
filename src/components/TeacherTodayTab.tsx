// v0.25: TodayTab extracted from TeacherWorkflowHome.tsx, with v0.25
// declutter applied:
//   - ONE primary action (next-step CTA)
//   - ONE class snapshot (four headline tiles)
//   - ONE teaching recommendation (weakest skill, framed as next teaching
//     action)
//
// Secondary data (top misconceptions, recent activity, raw weakest-skill
// list, manual session start) lives behind a "View details" toggle so the
// first screen stays calm.

import { useState } from 'react';
import { SKILL_SHORT_LABELS, type WorkflowStep, type WorkflowStepId } from '../types';
import {
  friendlyCta,
  friendlyNextSubtitle,
  friendlyNextTitle,
  timeAgo,
  type TeacherHomeSummary,
} from './TeacherHomeSummary';

export function TeacherTodayTab({
  summary,
  next,
  stepHandlers,
  activePilot,
  onOpenPilotTab,
  onOpenAdminTab,
  onOpenPilotSetup,
  onOpenTeachingPlan,
  onStartManual,
}: {
  summary: TeacherHomeSummary['summary'];
  next: WorkflowStep | null;
  stepHandlers: Record<WorkflowStepId, () => void>;
  activePilot: boolean;
  onOpenPilotTab: () => void;
  onOpenAdminTab: () => void;
  onOpenPilotSetup: () => void;
  onOpenTeachingPlan: () => void;
  onStartManual: () => void;
}) {
  const accPct = Math.round(summary.averageAccuracy * 100);
  const [showDetails, setShowDetails] = useState(false);

  const recommendation = summary.weakestSkills[0] ?? null;

  return (
    <div className="space-y-6">
      {/* HERO — single next-step CTA. */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        {next ? (
          <>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Your next step
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {friendlyNextTitle(next.title, activePilot)}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
              {friendlyNextSubtitle(next.subtitle)}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={stepHandlers[next.id]}
                className="btn-primary text-base"
              >
                {friendlyCta(next.ctaLabel)} →
              </button>
              <button onClick={onOpenPilotTab} className="btn-secondary">
                Open pilot setup
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Everything's set
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your pilot is ready.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
              The guided steps are complete on this device. Open your teaching
              plan to plan tomorrow, or keep collecting evidence.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button onClick={onOpenTeachingPlan} className="btn-primary">
                Open teaching plan →
              </button>
              <button onClick={onOpenPilotTab} className="btn-secondary">
                Open pilot setup
              </button>
            </div>
          </>
        )}
      </section>

      {/* CLASS SNAPSHOT. */}
      {summary.rosterSize === 0 && summary.sessionsCompleted === 0 ? (
        <section className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Your class snapshot
          </div>
          <p className="mt-2">
            No students or sessions on this device yet. Use{' '}
            <button
              onClick={onOpenPilotSetup}
              className="text-brand-700 underline hover:no-underline"
            >
              Pilot setup
            </button>{' '}
            to start your first classroom pilot, or{' '}
            <button
              onClick={onOpenAdminTab}
              className="text-brand-700 underline hover:no-underline"
            >
              seed sample data
            </button>{' '}
            from the Admin tab to explore the dashboard.
          </p>
          <button
            onClick={onStartManual}
            className="mt-3 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
          >
            Start a session manually
          </button>
        </section>
      ) : (
        <section className="space-y-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                Your class snapshot
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                On this device
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              {summary.sessionsLast7d} session
              {summary.sessionsLast7d === 1 ? '' : 's'} this week
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SnapshotTile
              label="Students assessed"
              value={String(summary.students)}
              subtext={`${summary.rosterSize} in roster`}
            />
            <SnapshotTile
              label="Active classrooms"
              value={String(summary.activeClassrooms)}
            />
            <SnapshotTile
              label="Sessions completed"
              value={String(summary.sessionsCompleted)}
            />
            <SnapshotTile
              label="Average accuracy"
              value={`${accPct}%`}
              subtext={`${summary.averageTimeSec}s avg per item`}
            />
          </div>

          {/* ONE TEACHING RECOMMENDATION. */}
          {recommendation && (
            <div className="rounded-2xl border-2 border-brand-200 bg-brand-50/40 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                Recommended next teaching action
              </div>
              <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">
                  Re-teach{' '}
                  <span className="text-brand-700">
                    {SKILL_SHORT_LABELS[recommendation.skillId]}
                  </span>
                </div>
                <div className="text-xs font-semibold text-rose-700">
                  Class accuracy {Math.round(recommendation.accuracy * 100)}%
                  <span className="ml-1 font-normal text-slate-500">
                    ({recommendation.attempted} attempts)
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={onOpenTeachingPlan}
                  className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
                >
                  Open teaching plan →
                </button>
                <button
                  onClick={() => setShowDetails((v) => !v)}
                  className="rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
                  aria-expanded={showDetails}
                >
                  {showDetails ? 'Hide details' : 'View details'}
                </button>
              </div>
            </div>
          )}

          {/* SECONDARY DATA — hidden by default. */}
          {showDetails && (
            <div className="grid gap-4 lg:grid-cols-3">
              <ListCard title="Weakest skills" emptyMessage="Not enough attempts yet.">
                {summary.weakestSkills.length > 0 ? (
                  <ul className="space-y-1 text-xs">
                    {summary.weakestSkills.map((s) => (
                      <li key={s.skillId} className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-slate-800">{SKILL_SHORT_LABELS[s.skillId]}</span>
                        <span className="font-semibold text-rose-700">
                          {Math.round(s.accuracy * 100)}%{' '}
                          <span className="font-normal text-slate-500">({s.attempted})</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </ListCard>
              <ListCard title="Top misconceptions" emptyMessage="None tagged yet.">
                {summary.topMisconceptions.length > 0 ? (
                  <ul className="space-y-1 text-xs">
                    {summary.topMisconceptions.map((m) => (
                      <li key={m.code} className="flex items-baseline justify-between gap-2">
                        <span className="text-slate-800">{m.label}</span>
                        <span className="font-semibold text-amber-700">×{m.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </ListCard>
              <ListCard title="Recent activity" emptyMessage="No sessions yet.">
                {summary.recentActivity.length > 0 ? (
                  <ul className="space-y-1 text-xs">
                    {summary.recentActivity.map((a) => (
                      <li key={a.sessionId} className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-medium text-slate-800">{a.studentName}</span>
                        <span className="text-slate-500">{timeAgo(a.completedAt)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </ListCard>
            </div>
          )}

          {!showDetails && (
            <div className="text-xs text-slate-500">
              <button
                onClick={onOpenAdminTab}
                className="font-semibold text-brand-700 hover:underline"
              >
                See class dashboard, item review &amp; more →
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function SnapshotTile({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {subtext && (
        <div className="mt-0.5 text-[11px] text-slate-500">{subtext}</div>
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
  const empty = children === null || children === undefined;
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
