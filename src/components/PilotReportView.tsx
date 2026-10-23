import { useMemo, useState } from 'react';
import { ITEMS } from '../data/items';
import {
  buildPilotReport,
  pilotReportToText,
  type PilotReport,
  type PilotReportScope,
} from '../lib/pilotReport';
import {
  loadItemReviews,
  loadPilots,
  loadSessionFeedback,
  loadSessions,
  loadStudents,
} from '../lib/storage';
import {
  MODULE_LABELS,
  SKILL_LABELS,
} from '../types';
import { MetricCard } from './common/MetricCard';
import { FlaggedBadge } from './common/FlaggedBadge';

type ScopeKey = string; // 'all' | pilot.id

const formatPercent = (x: number): string =>
  `${Math.round((Number.isFinite(x) ? x : 0) * 100)}%`;

const formatDate = (ms: number | null): string => {
  if (!ms) return '—';
  try {
    return new Date(ms).toLocaleDateString();
  } catch {
    return '—';
  }
};

export function PilotReportView({ onBack }: { onBack: () => void }) {
  const pilots = useMemo(() => loadPilots(), []);
  const [scopeKey, setScopeKey] = useState<ScopeKey>(() => {
    const active = pilots.find((p) => p.active);
    return active ? active.id : pilots[0]?.id ?? 'all';
  });

  const scope: PilotReportScope = useMemo(() => {
    if (scopeKey === 'all') return { kind: 'all' };
    const pilot = pilots.find((p) => p.id === scopeKey);
    if (!pilot) return { kind: 'all' };
    return { kind: 'pilot', pilot };
  }, [scopeKey, pilots]);

  const report: PilotReport = useMemo(
    () =>
      buildPilotReport(
        scope,
        loadStudents(),
        loadSessions(),
        loadSessionFeedback(),
        loadItemReviews()
      ),
    [scope]
  );

  const handleExportJSON = () => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const tag =
      scope.kind === 'pilot'
        ? scope.pilot.className.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()
        : 'all';
    a.href = url;
    a.download = `pragati-pilot-report-${tag}-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = async () => {
    const text = pilotReportToText(report);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        window.alert('Pilot report summary copied to clipboard.');
      } else {
        // Fallback for browsers without clipboard API.
        window.prompt('Copy pilot report summary:', text);
      }
    } catch {
      window.prompt('Copy pilot report summary:', text);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          ← Back to teacher home
        </button>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Pilot report
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          A class-summary view of one pilot (or all data on this device).
          Heuristic, prototype, not calibrated. A CBSE Class 6 maths teacher
          should review every figure before sharing.
        </p>
      </div>

      {/* Scope picker + actions */}
      <div className="card flex flex-wrap items-end justify-between gap-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Report scope
          </span>
          <select
            value={scopeKey}
            onChange={(e) => setScopeKey(e.target.value)}
            className="mt-1 min-w-[16rem] rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="all">All data on this device</option>
            {pilots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.className} — {p.teacherName}
                {p.active ? ' (active)' : ''}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopySummary}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Copy summary for teacher / admin
          </button>
          <button
            onClick={handleExportJSON}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Export pilot report JSON
          </button>
        </div>
      </div>

      {/* Pilot metadata (when scope is a specific pilot) */}
      {scope.kind === 'pilot' && (
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Pilot details
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <MetaRow label="Class" value={scope.pilot.className} />
            <MetaRow label="Teacher" value={scope.pilot.teacherName} />
            <MetaRow label="School" value={scope.pilot.school} />
            <MetaRow
              label="Pilot date"
              value={formatDate(scope.pilot.date)}
            />
            <MetaRow
              label="Default mode"
              value={scope.pilot.defaultMode}
            />
            <MetaRow
              label="Status"
              value={scope.pilot.active ? 'Active' : 'Closed'}
            />
            {scope.pilot.notes && (
              <div className="sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes
                </div>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
                  {scope.pilot.notes}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Headline metrics */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Students tested"
          value={String(report.studentsTested)}
        />
        <MetricCard
          label="Sessions completed"
          value={String(report.sessionsCompleted)}
        />
        <MetricCard
          label="Average accuracy"
          value={formatPercent(report.averageAccuracy)}
        />
        <MetricCard
          label="Avg time per item"
          value={`${report.averageTimePerItemSec}s`}
        />
      </section>

      {/* Modes used */}
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Assessment modes used
        </h2>
        {report.modesUsed.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            No completed sessions in scope yet.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {report.modesUsed.map((m) => (
              <li
                key={m.mode}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
              >
                {m.label} · {m.sessions}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Weakest skills */}
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Weakest skills
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Skills below 70% class accuracy with at least 3 attempts.
        </p>
        {report.weakestSkills.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            No skill in scope falls below the weak-accuracy threshold.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Skill</th>
                  <th className="px-3 py-2">Module</th>
                  <th className="px-3 py-2">Accuracy</th>
                  <th className="px-3 py-2">Attempts</th>
                  <th className="px-3 py-2">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.weakestSkills.map((w) => (
                  <tr key={w.skillId}>
                    <td className="px-3 py-2 font-semibold text-slate-800">
                      {w.skillId}{' '}
                      <span className="font-normal text-slate-500">
                        — {w.skillLabel}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">{w.moduleLabel}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {formatPercent(w.accuracy)}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {w.correct} / {w.attempted}
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      {w.studentsAffected}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Top misconceptions */}
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Top misconceptions
        </h2>
        {report.topMisconceptions.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            No misconception dominates the wrong answers in scope.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {report.topMisconceptions.map((m) => (
              <li
                key={m.code}
                className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
              >
                <div className="font-semibold text-slate-800">{m.label}</div>
                <div className="mt-1 text-xs text-slate-600">
                  {m.occurrences} occurrence(s) across {m.studentsAffected}{' '}
                  student(s) · {m.itemIds.length} item(s) involved
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Students needing support */}
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Students needing support
        </h2>
        {report.studentsNeedingSupport.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            No student in scope has a current weak-skill flag.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {report.studentsNeedingSupport.map((s) => (
              <li
                key={s.studentId}
                className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
              >
                <div className="font-semibold text-slate-800">{s.name}</div>
                <div className="mt-1 text-xs text-slate-600">
                  {s.weakSkillLabels.length === 0
                    ? 'Weak skills not pinpointed yet (needs more attempts).'
                    : `Weak skills: ${s.weakSkillLabels.join('; ')}`}
                  {s.lastSessionAt && (
                    <>
                      {' '}
                      · last session {formatDate(s.lastSessionAt)}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Flagged items used */}
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Flagged items used in scope
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Items with audit flags or low alignment confidence that students
          actually saw during these sessions.
        </p>
        {report.flaggedItemsUsed.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            No flagged items appeared in completed sessions in scope.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {report.flaggedItemsUsed.map((f) => (
              <li
                key={f.itemId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
              >
                <span className="font-mono text-xs text-slate-700">
                  {f.itemId}
                </span>
                <FlaggedBadge itemId={f.itemId} compact />
                <span className="text-xs text-slate-600">
                  {MODULE_LABELS[f.module]} · {f.skillId}{' '}
                  {SKILL_LABELS[f.skillId]} · {formatPercent(f.accuracy)} on{' '}
                  {f.attempts} attempt(s)
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Item review status */}
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Item review status
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Across the full bank of {ITEMS.length} items (review status is not
          per-pilot).
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <MetricCard
            label="Approved"
            value={String(report.itemReviewStatus.approved)}
          />
          <MetricCard
            label="Need revision"
            value={String(report.itemReviewStatus.needsRevision)}
          />
          <MetricCard
            label="Not reviewed"
            value={String(report.itemReviewStatus.notReviewed)}
          />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Reviewed: {formatPercent(report.itemReviewStatus.reviewedFraction)}{' '}
          of bank.
        </p>
      </section>

      {/* Feedback summary */}
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Student feedback summary
        </h2>
        {report.feedback.totalFeedback === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            No student feedback collected in scope yet.
          </p>
        ) : (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <MetricCard
                label="Easy"
                value={String(report.feedback.difficulty.easy)}
              />
              <MetricCard
                label="Okay"
                value={String(report.feedback.difficulty.okay)}
              />
              <MetricCard
                label="Hard"
                value={String(report.feedback.difficulty.hard)}
              />
            </div>
            <div className="mt-3 text-xs text-slate-600">
              Pictures helped — yes: {report.feedback.picturesHelped.yes},{' '}
              no: {report.feedback.picturesHelped.no}, mixed:{' '}
              {report.feedback.picturesHelped.mixed}, n/a:{' '}
              {report.feedback.picturesHelped.na}
            </div>
            {report.feedback.hardestPartSamples.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Hardest-part samples
                </div>
                <ul className="mt-1 space-y-1 text-sm text-slate-700">
                  {report.feedback.hardestPartSamples.map((s, i) => (
                    <li key={i} className="rounded-lg bg-slate-50 px-3 py-2">
                      “{s}”
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {report.feedback.confusingQuestionsSamples.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Confusing-questions samples
                </div>
                <ul className="mt-1 space-y-1 text-sm text-slate-700">
                  {report.feedback.confusingQuestionsSamples.map((s, i) => (
                    <li key={i} className="rounded-lg bg-slate-50 px-3 py-2">
                      “{s}”
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {/* Recommended next teaching action */}
      <section className="rounded-2xl border-2 border-brand-300 bg-brand-50/60 p-5 ring-1 ring-brand-100 sm:p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
          Recommended next teaching action
        </div>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          {report.recommendedNextAction.headline}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {report.recommendedNextAction.body}
        </p>
      </section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Pragati is a CBSE/NCERT-informed prototype. The numbers above are
        device-local heuristics. Not an official CBSE alignment, not a
        calibrated assessment. Teacher review required before any pilot
        decisions or external sharing.
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}
