import { useMemo } from 'react';
import { ITEMS } from '../data/items';
import type { SubmissionState } from '../lib/accessCodes';
import {
  computeSkillProgress,
  suggestNextStep,
  type NextStepSuggestion,
} from '../lib/progression';
import {
  bandAccuracy,
  bandColor,
  bandDescription,
  computeBand,
  correctCount,
  growthIndicator,
  isMixedSession,
  sessionConfidence,
  summarizeBySkill,
  summarizeMisconceptions,
  summarizeSession,
  type GrowthIndicator,
} from '../lib/scoring';
import {
  getCompletedSessionsForStudent,
  loadSessions,
} from '../lib/storage';
import {
  ASSESSMENT_WINDOW_LABELS,
  SKILL_MODE_LABELS,
  type Session,
  type SkillId,
  type SkillMode,
} from '../types';
import { areSessionsComparable, comparabilityReason } from '../curriculum';
import { GrowthCard } from './common/GrowthCard';
import { NextStepCard } from './common/NextStepCard';
import { SessionFeedbackCard } from './common/SessionFeedbackCard';
import { SkillBreakdownCard } from './common/SkillBreakdownCard';
import { SkillChip } from './common/SkillChip';
import { StatCard } from './common/StatCard';
import { WrongAnswerFeedback } from './common/WrongAnswerFeedback';

// Results — the post-assessment student-facing screen. Performance band,
// per-skill breakdown (for mixed sessions), prototype change indicator,
// likely misconceptions, and a "Next Step for You" card. Extracted from
// App.tsx in v0.14. Behavior unchanged.
export function ResultsView({
  session,
  onAnotherSession,
  onTeacher,
  onHome,
  onOpenLesson,
  onStartAssessment,
  onOpenLearningPath,
  submissionState,
  onRetrySubmission,
  audience = 'teacher',
}: {
  session: Session;
  onAnotherSession: () => void;
  onTeacher: () => void;
  onHome: () => void;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
  // v0.17: opens the per-student learning path that focuses on the
  // weakest skill from this session. Optional so existing callers don't
  // need to pass it.
  onOpenLearningPath?: () => void;
  // v0.21: cloud-submission status pill + Retry button for sessions
  // that were taken from a joined classroom assignment.
  submissionState?: SubmissionState | null;
  onRetrySubmission?: () => void;
  /** v0.49 §14 — who is reading this screen. Student results use
   *  age-appropriate copy and move the measurement caveats into an
   *  "About this result" disclosure; the teacher view keeps the full
   *  caveat block visible, because that is where it belongs. Defaults
   *  to 'teacher' so no existing caller loses the disclaimer. */
  audience?: 'student' | 'teacher';
}) {
  const isStudent = audience === 'student';
  const band = computeBand(session.finalAbility);
  const correct = correctCount(session.responses);
  const total = session.responses.length;
  const misconceptions = summarizeMisconceptions(session.responses).slice(
    0,
    3
  );

  // Growth comparisons should only use prior sessions in the *same* skill
  // mode. A FR.06 session and an FR.07 session aren't comparable on
  // skill-specific axes (accuracy, difficulty, misconception rate).
  //
  // v0.29 — Also gate on areSessionsComparable() so a legacy `mixed`
  // Class 6 session and a future `mixed` Class 8 session are NOT
  // treated as comparable just because both have skillId === 'mixed'.
  const growth = useMemo<GrowthIndicator | null>(() => {
    const all = getCompletedSessionsForStudent(session.studentId);
    const prior = all.filter(
      (s) =>
        s.id !== session.id &&
        s.skillId === session.skillId &&
        areSessionsComparable(s, session) &&
        (s.completedAt ?? 0) < (session.completedAt ?? 0)
    );
    if (prior.length === 0) return null;
    const mostRecentPrior = prior.reduce((a, b) =>
      (a.completedAt ?? 0) > (b.completedAt ?? 0) ? a : b
    );
    return growthIndicator(mostRecentPrior, session);
  }, [session]);

  // v0.31 — If there IS a prior same-skill session but it's not
  // comparable (different grade/subject/scope), surface a visible
  // reason instead of silently hiding the growth card.
  const growthUnavailableReason = useMemo<string | null>(() => {
    if (growth) return null;
    const all = getCompletedSessionsForStudent(session.studentId);
    const priorSameSkill = all.filter(
      (s) =>
        s.id !== session.id &&
        s.skillId === session.skillId &&
        (s.completedAt ?? 0) < (session.completedAt ?? 0)
    );
    if (priorSameSkill.length === 0) return null; // No prior — that's fine, no message.
    const mostRecent = priorSameSkill.reduce((a, b) =>
      (a.completedAt ?? 0) > (b.completedAt ?? 0) ? a : b
    );
    return comparabilityReason(mostRecent, session);
  }, [growth, session]);

  const summary = summarizeSession(session);
  const conf = sessionConfidence(summary);

  const skillBreakdowns = useMemo(
    () => summarizeBySkill(session.responses, ITEMS),
    [session]
  );
  const showsMixedBreakdown =
    session.skillId === 'mixed' && isMixedSession(session.responses, ITEMS);

  // "Next Step for You" — runs on the just-completed session and on the
  // device-wide progression so we can suggest the right place to go next.
  const nextStep = useMemo<NextStepSuggestion>(() => {
    const allSessions = loadSessions();
    const progress = computeSkillProgress(allSessions, ITEMS);
    return suggestNextStep(session, ITEMS, progress);
  }, [session]);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {isStudent ? 'All done' : 'Assessment complete'}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {isStudent
            ? `Nice work, ${session.studentSnapshot.name}`
            : `${session.studentSnapshot.name}'s prototype estimate`}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span>
            {ASSESSMENT_WINDOW_LABELS[session.window]} session ·{' '}
            {session.studentSnapshot.grade}
            {session.studentSnapshot.school
              ? ` · ${session.studentSnapshot.school}`
              : ''}
          </span>
          <SkillChip mode={session.skillId} />
        </div>

        {/* v0.21: submission status pill for sessions from a classroom code. */}
        {submissionState && submissionState.state !== 'not_applicable' && (
          <SubmissionStatusPill
            status={submissionState}
            onRetry={onRetrySubmission}
          />
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Performance band"
            value={band}
            valueClass={`${bandColor(band)} ring-1`}
          />
          <StatCard label="Correct answers" value={`${correct} / ${total}`} />
          <StatCard
            label={isStudent ? 'Level right now' : 'Prototype ability estimate'}
            value={`${session.finalAbility.toFixed(1)} / 10`}
          />
        </div>

        <p className="mt-5 text-sm text-slate-600">
          {bandDescription(band, session.skillId)}
        </p>

        {conf.confidence === 'low' && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200">
            <span className="font-semibold">Low-confidence estimate.</span>{' '}
            {conf.reasons.join(' ')}
          </div>
        )}
      </div>

      <NextStepCard
        suggestion={nextStep}
        onOpenLesson={onOpenLesson}
        onStartAssessment={onStartAssessment}
      />

      {/* v0.40 — per-item feedback closes the assessment → understanding loop. */}
      <WrongAnswerFeedback
        responses={session.responses}
        onOpenLesson={onOpenLesson}
      />

      <SessionFeedbackCard sessionId={session.id} />

      {growth && <GrowthCard growth={growth} session={session} />}

      {!growth && growthUnavailableReason && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Growth comparison unavailable
          </div>
          <p className="mt-1">
            A prior session was found but Pragati refuses to compare
            it with this one — {growthUnavailableReason} Cross-context
            comparisons would be misleading, so the growth card is
            hidden.
          </p>
        </div>
      )}

      {showsMixedBreakdown && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Per-skill accuracy
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            This was a mixed session, so accuracy is split by skill bank
            below. Only skills with at least one item attempted are shown.
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
          Skills demonstrated
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Based on items answered on {SKILL_MODE_LABELS[session.skillId]}.
        </p>
        <BandAccuracyTable session={session} />
      </div>

      {misconceptions.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Likely misconception patterns
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            These are the patterns most consistent with the wrong answers
            chosen. Teacher review required before acting on any of them.
          </p>
          <ul className="mt-4 space-y-2">
            {misconceptions.map((m) => (
              <li
                key={m.code}
                className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {m.label}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    Seen on {m.count} item{m.count > 1 ? 's' : ''}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isStudent ? (
        <details className="rounded-2xl bg-white p-4 text-sm ring-1 ring-slate-200">
          <summary className="cursor-pointer font-medium text-slate-700">
            About this result
          </summary>
          <p className="mt-2 text-sm text-slate-600">
            This is practice, not an exam. It shows how today went and what to
            try next. Your teacher sees a fuller report.
          </p>
        </details>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <div className="font-semibold">Important disclaimer</div>
          <p className="mt-1">
            This is a prototype estimate based on seed difficulty values, not a
            calibrated score. Real reporting requires student response data and
            an IRT model fit, plus teacher review of every item. Do not use
            these bands to make placement, promotion, or remediation decisions.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {onOpenLearningPath && (
          <button onClick={onOpenLearningPath} className="btn-primary">
            Open my learning path
          </button>
        )}
        {!isStudent && (
          <button onClick={onTeacher} className="btn-secondary">
            Teacher view for {session.studentSnapshot.name}
          </button>
        )}
        <button onClick={onAnotherSession} className="btn-secondary">
          Another session for {session.studentSnapshot.name}
        </button>
        <button onClick={onHome} className="btn-secondary">
          Home
        </button>
      </div>
    </div>
  );
}

function BandAccuracyTable({ session }: { session: Session }) {
  const rows = bandAccuracy(session.responses, ITEMS);
  return (
    <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2">Band</th>
            <th className="px-4 py-2">Items attempted</th>
            <th className="px-4 py-2">Correct</th>
            <th className="px-4 py-2">Accuracy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((r) => (
            <tr key={r.band}>
              <td className="px-4 py-3 font-medium capitalize text-slate-900">
                {r.band}
              </td>
              <td className="px-4 py-3 text-slate-700">{r.attempted}</td>
              <td className="px-4 py-3 text-slate-700">{r.correct}</td>
              <td className="px-4 py-3 text-slate-700">
                {r.attempted === 0
                  ? '—'
                  : `${Math.round((r.correct / r.attempted) * 100)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// v0.22: full-width status card with explainer text. Replaces the small
// pill from v0.21 — the card surfaces "what this means" so a student or
// teacher can tell, at a glance, whether the teacher has it yet.
function SubmissionStatusPill({
  status,
  onRetry,
}: {
  status: SubmissionState;
  onRetry?: () => void;
}) {
  if (status.state === 'submitted') {
    return (
      <StatusCard
        tone="emerald"
        heading="Submitted to teacher"
        subline={`Sent at ${new Date(status.at).toLocaleTimeString()}`}
        body={
          <>
            Your teacher will see this session in their dashboard after their
            next sync — usually within a few minutes. Nothing more for you to
            do. You can close this page or take another assessment.
          </>
        }
      />
    );
  }
  if (status.state === 'local_only') {
    return (
      <StatusCard
        tone="slate"
        heading="Saved locally only"
        subline={status.reason}
        body={
          <>
            The session is safe on this device. It was not sent to a teacher
            because there's no joined classroom or no cloud connection. If
            you joined a classroom by code, ask your teacher to share the
            code with you again and re-join — then your next session will be
            submitted.
          </>
        }
      />
    );
  }
  if (status.state === 'failed') {
    return (
      <StatusCard
        tone="rose"
        heading="Submission failed"
        subline={status.reason}
        body={
          <>
            We could not reach the teacher's cloud, but the session is safe
            on this device. Tap <strong>Retry submission</strong> to try
            again. If it keeps failing, your teacher may need to refresh the
            classroom code or check their internet connection.
          </>
        }
        actions={
          onRetry && (
            <button
              onClick={onRetry}
              className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
            >
              Retry submission
            </button>
          )
        }
      />
    );
  }
  // not_applicable: render nothing (caller already gates on this state).
  return null;
}

function StatusCard({
  tone,
  heading,
  subline,
  body,
  actions,
}: {
  tone: 'emerald' | 'slate' | 'rose';
  heading: string;
  subline: string;
  body: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const tones: Record<
    string,
    { border: string; bg: string; dot: string; head: string; sub: string }
  > = {
    emerald: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      dot: 'bg-emerald-600',
      head: 'text-emerald-900',
      sub: 'text-emerald-700',
    },
    slate: {
      border: 'border-slate-200',
      bg: 'bg-slate-50',
      dot: 'bg-slate-400',
      head: 'text-slate-900',
      sub: 'text-slate-600',
    },
    rose: {
      border: 'border-rose-200',
      bg: 'bg-rose-50',
      dot: 'bg-rose-600',
      head: 'text-rose-900',
      sub: 'text-rose-700',
    },
  };
  const t = tones[tone];
  return (
    <div
      className={`mt-4 rounded-2xl border ${t.border} ${t.bg} p-4 text-sm`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 inline-block h-2.5 w-2.5 flex-none rounded-full ${t.dot}`} />
        <div className="flex-1">
          <div className={`text-sm font-semibold ${t.head}`}>{heading}</div>
          <div className={`mt-0.5 text-xs ${t.sub}`}>{subline}</div>
          <div className={`mt-2 text-xs leading-relaxed ${t.sub}`}>
            <span className="font-semibold uppercase tracking-wide">What this means: </span>
            <span className="font-normal">{body}</span>
          </div>
          {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
