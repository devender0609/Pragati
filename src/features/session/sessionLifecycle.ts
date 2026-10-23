// v0.50 §1 — Session lifecycle.
//
// THE BUG THIS FIXES
//
// v0.49's Save & Exit told the student "come back later", then wrote
// `completedAt = Date.now()` on the partial attempt. Three consequences:
//
//   1. The promise was false — there was nothing to come back to.
//   2. A chapter check abandoned after 2 of 10 questions was stored as
//      a COMPLETED chapter check.
//   3. Every analytic that filters on `completedAt !== null` — growth
//      comparisons, chapter-check accuracy, teacher summaries — silently
//      absorbed those partial attempts as if they were finished work.
//
// (3) is the serious one: it contaminates reporting rather than merely
// misleading a student.
//
// THE MODEL
//
// `Session.lifecycle` is an explicit status. It is OPTIONAL, so every
// session written before v0.50 loads unchanged, and `lifecycleOf()`
// derives a correct status for those legacy records from `completedAt`.
//
//   in_progress — started, still resumable. completedAt stays null.
//   completed   — the student answered every item in the pool.
//   exited      — the student left early. Answers given are kept, but
//                 this is NOT a completed attempt and must be excluded
//                 from completion analytics unless partials are asked
//                 for explicitly.
//
// A legacy session with completedAt set reads as 'completed'. That is
// the honest default: we cannot retroactively tell which v0.49 records
// were abandoned early, and this is stated in the version report rather
// than papered over.

import type { Session } from '../../types';

export type SessionLifecycle = 'in_progress' | 'completed' | 'exited';

/** Resolve a session's lifecycle, including for pre-v0.50 records. */
export function lifecycleOf(session: Session): SessionLifecycle {
  const explicit = session.lifecycle;
  if (
    explicit === 'in_progress' ||
    explicit === 'completed' ||
    explicit === 'exited'
  ) {
    return explicit;
  }
  // Legacy fallback. Pre-v0.50 sessions have no lifecycle field.
  return session.completedAt !== null ? 'completed' : 'in_progress';
}

/** A genuinely finished attempt. This is the ONLY predicate that
 *  completion analytics should use — never a bare `completedAt` check,
 *  which counts abandoned attempts as finished. */
export function isCompletedAttempt(session: Session): boolean {
  return lifecycleOf(session) === 'completed';
}

/** Left early with some answers recorded. Real data, but partial. */
export function isExitedAttempt(session: Session): boolean {
  return lifecycleOf(session) === 'exited';
}

/** Still open and resumable. */
export function isResumable(session: Session): boolean {
  return (
    lifecycleOf(session) === 'in_progress' &&
    Array.isArray(session.resumePoolItemIds) &&
    session.resumePoolItemIds.length > 0
  );
}

/**
 * Sessions that count toward completion reporting.
 *
 * `includePartial` exists so a teacher can deliberately ask to see
 * abandoned attempts — §1 allows partials when they are shown AS
 * partials, never when they are silently pooled with finished work.
 */
export function completedAttempts(
  sessions: Session[],
  { includePartial = false }: { includePartial?: boolean } = {}
): Session[] {
  return sessions.filter((s) =>
    includePartial
      ? isCompletedAttempt(s) || isExitedAttempt(s)
      : isCompletedAttempt(s)
  );
}

/** The most recent resumable session for a student, if any. Drives the
 *  "Continue practice" action on Home. */
export function findResumableSession(
  sessions: Session[],
  studentId: string
): Session | null {
  const open = sessions
    .filter((s) => s.studentId === studentId && isResumable(s))
    .sort((a, b) => (b.lastActivityAt ?? b.startedAt) - (a.lastActivityAt ?? a.startedAt));
  return open[0] ?? null;
}

/** Student-facing description of a resumable set. Deliberately free of
 *  blueprint/purpose jargon. */
export function resumeSummary(session: Session): {
  answered: number;
  total: number;
  remaining: number;
} {
  const total = session.resumePoolItemIds?.length ?? 0;
  const answered = session.responses.length;
  return { answered, total, remaining: Math.max(0, total - answered) };
}
