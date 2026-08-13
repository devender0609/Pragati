// v0.49 §12 — extracted from App.tsx.
//
// Behaviour is unchanged; only the file boundary moved. These are the
// teacher per-student detail screens, still reachable from teacher preview
// and first-run compatibility paths. The canonical student journey is
// StudentRouteOutlet + StudentShell.

import { useMemo, useState } from 'react';
import { ITEMS, MISCONCEPTION_LABELS } from '../../data/items';
import {
  areSessionsComparable,
} from '../../curriculum';
import {
  averageTimeSec,
  bandColor,
  bandDescription,
  computeBand,
  correctCount,
  growthIndicator,
  isMixedSession,
  recommendPrerequisites,
  summarizeBySkill,
  summarizeMisconceptions,
  summarizeSession,
  type GrowthIndicator,
  type SessionSummary,
} from '../../lib/scoring';
import { formatDate } from '../../lib/format';
import {
  deleteStudent,
  getCompletedSessionsForStudent,
  loadStudents,
} from '../../lib/storage';
import {
  ASSESSMENT_WINDOW_LABELS,
  type Session,
  type Student,
} from '../../types';
import { SkillChip } from '../../components/common/SkillChip';
import { BandPill } from '../../components/common/BandPill';
import { StatCard } from '../../components/common/StatCard';
import { SkillBreakdownCard } from '../../components/common/SkillBreakdownCard';

export function StudentDetail({
  studentId,
  onBack,
  onNewSession,
  onDeleted,
}: {
  studentId: string;
  onBack: () => void;
  onNewSession: (student: Student) => void;
  onDeleted: () => void;
}) {
  const student = loadStudents().find((s) => s.id === studentId);
  const sessions = student ? getCompletedSessionsForStudent(student.id) : [];
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!student) {
    return (
      <div className="card text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Student not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          That record may have been cleared from this browser.
        </p>
        <button onClick={onBack} className="btn-secondary mt-4">
          Back to students
        </button>
      </div>
    );
  }

  const latest = sessions[sessions.length - 1] ?? null;
  // Pair the latest session with the most-recent earlier session in the
  // same skill mode. Comparing across skills is misleading on a per-skill
  // accuracy axis.
  // v0.29 — also require the prior session to be comparable in
  // curriculum + grade + subject + scope-kind, so a legacy `mixed`
  // Class 6 record and a future `mixed` Class 8 record are never
  // silently compared just because the SkillMode string matches.
  const prevSameSkill = latest
    ? [...sessions]
        .reverse()
        .find(
          (s) =>
            s.id !== latest.id &&
            s.skillId === latest.skillId &&
            areSessionsComparable(s, latest)
        ) ?? null
    : null;
  const growth =
    latest && prevSameSkill ? growthIndicator(prevSameSkill, latest) : null;

  const handleDelete = () => {
    deleteStudent(student.id);
    onDeleted();
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← All students
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Student profile
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {student.name}
            </h1>
            <div className="mt-1 text-sm text-slate-600">
              {student.school ? `${student.school} · ` : ''}
              {student.grade} · {sessions.length} completed session
              {sessions.length === 1 ? '' : 's'}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNewSession(student)}
              className="btn-primary"
            >
              Start a new session
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-50"
            >
              Delete student
            </button>
          </div>
        </div>
      </div>

      {confirmingDelete && (
        <DeleteConfirm
          studentName={student.name}
          sessionCount={sessions.length}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      )}

      {sessions.length === 0 && (
        <div className="card text-center text-sm text-slate-600">
          No completed sessions yet for this student.
        </div>
      )}

      {sessions.length > 0 && (
        <GrowthHistory sessions={sessions} growthForLatest={growth} />
      )}

      {latest && <LatestSessionPanel session={latest} />}
    </div>
  );
}

function DeleteConfirm({
  studentName,
  sessionCount,
  onCancel,
  onConfirm,
}: {
  studentName: string;
  sessionCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 ring-1 ring-rose-200">
      <div className="text-sm font-semibold text-rose-900">
        Delete {studentName} and all of their {sessionCount} session
        {sessionCount === 1 ? '' : 's'}?
      </div>
      <p className="mt-1 text-sm text-rose-800">
        This cannot be undone. Their record and every response they have
        submitted will be removed from this device. Consider exporting the
        data first if you might need it.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={onConfirm}
          className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
        >
          Yes, delete {studentName}
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

function GrowthHistory({
  sessions,
  growthForLatest,
}: {
  sessions: Session[];
  growthForLatest: GrowthIndicator | null;
}) {
  const rows = [...sessions].reverse();
  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-900">
          Growth history
        </h2>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
          Prototype · not calibrated
        </span>
        {growthForLatest && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
              growthForLatest.confidence === 'low'
                ? 'bg-rose-50 text-rose-700 ring-rose-200'
                : 'bg-slate-50 text-slate-700 ring-slate-200'
            }`}
          >
            Latest comparison: {growthForLatest.confidence} confidence
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-600">
        One row per completed session. The "change vs. previous" column is an
        early signal on the 1–10 seed scale, not a validated growth metric;
        deltas are only computed against earlier sessions on the{' '}
        <span className="font-medium">same skill mode</span>. Practice
        sessions are included for completeness.
      </p>

      {growthForLatest && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
          {growthForLatest.summary}
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Window</th>
              <th className="px-3 py-2">Skill</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2">Correct</th>
              <th className="px-3 py-2">Avg. diff. attempted</th>
              <th className="px-3 py-2">Misconception rate</th>
              <th className="px-3 py-2">Band</th>
              <th className="px-3 py-2">Estimate</th>
              <th className="px-3 py-2">Δ vs. previous (same skill)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((s, idx) => {
              const summary: SessionSummary = summarizeSession(s);
              const band = computeBand(s.finalAbility);
              // Find previous session in the same skill mode (if any).
              const previous = rows
                .slice(idx + 1)
                .find((r) => r.skillId === s.skillId) ?? null;
              const delta = previous
                ? s.finalAbility - previous.finalAbility
                : null;
              return (
                <tr key={s.id}>
                  <td className="px-3 py-3 text-slate-700">
                    {formatDate(s.completedAt ?? s.startedAt)}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {ASSESSMENT_WINDOW_LABELS[s.window]}
                  </td>
                  <td className="px-3 py-3">
                    <SkillChip mode={s.skillId} />
                  </td>
                  <td className="px-3 py-3 text-slate-700">{summary.total}</td>
                  <td className="px-3 py-3 text-slate-700">
                    {summary.correct}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {summary.avgDifficulty.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {Math.round(summary.misconceptionRate * 100)}%
                  </td>
                  <td className="px-3 py-3">
                    <BandPill band={band} />
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {s.finalAbility.toFixed(1)} / 10
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {delta === null ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span
                        className={
                          Math.abs(delta) < 0.5
                            ? 'text-slate-700'
                            : delta > 0
                              ? 'text-emerald-700'
                              : 'text-rose-700'
                        }
                      >
                        {delta >= 0 ? '+' : '−'}
                        {Math.abs(delta).toFixed(1)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LatestSessionPanel({ session }: { session: Session }) {
  const itemById = useMemo(() => new Map(ITEMS.map((it) => [it.id, it])), []);
  const band = computeBand(session.finalAbility);
  const correct = correctCount(session.responses);
  const total = session.responses.length;
  const avgTime = averageTimeSec(session.responses);
  const misconceptions = summarizeMisconceptions(session.responses);
  const prereqs = recommendPrerequisites(session.responses);
  const skillBreakdowns = useMemo(
    () => summarizeBySkill(session.responses, ITEMS),
    [session]
  );
  const showsMixedBreakdown =
    session.skillId === 'mixed' && isMixedSession(session.responses, ITEMS);

  return (
    <>
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Most recent session
            </h2>
            <SkillChip mode={session.skillId} />
          </div>
          <span className="text-xs text-slate-500">
            {ASSESSMENT_WINDOW_LABELS[session.window]} ·{' '}
            {formatDate(session.completedAt ?? session.startedAt)}
          </span>
        </div>
        <div className="mt-4 grid gap-3 grid-cols-2 md:grid-cols-4">
          <StatCard
            label="Band"
            value={band}
            valueClass={`${bandColor(band)} ring-1`}
          />
          <StatCard label="Items attempted" value={String(total)} />
          <StatCard label="Correct" value={`${correct} / ${total}`} />
          <StatCard label="Avg. time / item" value={`${avgTime}s`} />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          {bandDescription(band, session.skillId)}
        </p>
      </div>

      {showsMixedBreakdown && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Per-skill accuracy (mixed session)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            FR.06 and FR.07 items appeared together in this session; the
            breakdown below is split by skill so the teacher can see whether
            one skill is pulling the other up or down.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {skillBreakdowns
              .filter((b) => b.attempted > 0)
              .map((b) => (
                <SkillBreakdownCard key={b.skillId} breakdown={b} />
              ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Item-by-item responses
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Every distractor is tagged with the misconception it represents. Use
          this as a starting point and adapt to what you already know about the
          student.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Diff.</th>
                <th className="px-3 py-2">Answered</th>
                <th className="px-3 py-2">Correct?</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Error / signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {session.responses.map((r) => {
                const it = itemById.get(r.itemId);
                const answered =
                  r.chosenIndex >= 0
                    ? `${String.fromCharCode(65 + r.chosenIndex)}`
                    : `"${r.chosenText ?? ''}"`;
                const correctAnswer =
                  it && it.kind === 'mcq'
                    ? `correct: ${String.fromCharCode(65 + it.correctIndex)}`
                    : it && it.kind === 'numeric'
                      ? `correct: ${it.acceptedAnswers[0]}`
                      : '';
                return (
                  <tr key={r.itemId} className="align-top">
                    <td className="px-3 py-3 font-medium text-slate-900">
                      <div>{r.itemId}</div>
                      <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                        {it?.stem}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {r.difficultyAtAttempt}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {answered}
                      {correctAnswer && (
                        <span className="ml-1 text-xs text-slate-500">
                          ({correctAnswer})
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {r.correct ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          Correct
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                          Incorrect
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {Math.round(r.timeMs / 1000)}s
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {r.correct
                        ? '—'
                        : MISCONCEPTION_LABELS[r.misconceptionTriggered]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {misconceptions.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Misconception summary &amp; suggested next steps
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            One row per observed misconception pattern, ordered by frequency.
            These are generic starting points derived from the misconception
            tag — teacher judgement always takes priority.
          </p>
          <ul className="mt-4 space-y-3">
            {misconceptions.map((m) => (
              <li
                key={m.code}
                className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {session.studentSnapshot.name} selected the "
                    {m.label.toLowerCase()}" pattern {m.count} time
                    {m.count > 1 ? 's' : ''}.
                  </div>
                  <div className="text-xs text-slate-500">
                    Items: {m.itemIds.join(', ')}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{m.nextStep}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {prereqs.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Prerequisite skills to consider revisiting
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Mapped from the misconception patterns above to direct prerequisite
            skills in the Class 6 Math skill tree. Confirm before assigning.
          </p>
          <ul className="mt-4 space-y-3">
            {prereqs.map((rec) => (
              <li
                key={rec.skill.code}
                className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {rec.skill.code} — {rec.skill.name}
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-700">{rec.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-500">
        <div className="font-semibold text-slate-700">
          Measurement note (read before sharing a result)
        </div>
        <p className="mt-1">
          All numbers here are derived from seed difficulty estimates, not from
          a calibrated IRT model. Treat the band as a conversation starter, not
          a diagnosis. Validity requires a cognitive-lab pilot with real
          students, item revision, and a calibration study (e.g., fitting a
          Rasch model to 200+ responses per item). See README for next steps.
        </p>
      </div>
    </>
  );
}





