// v0.58 §10 + §11 — Formal field-test session runner.
//
// NOT "practice with buttons hidden".
//
// A formal session differs in what it GUARANTEES, not in what it
// displays: items come only from the frozen authorized form, exposure
// is recorded per administered item, response-quality metadata is
// captured, and resume returns the identical form rather than
// assembling a new one.
//
// RESUME (§11)
//
// The rule that matters: a resumed session NEVER produces a new form.
// The assignment holds a frozen item list, so resume replays it from
// the stored position. Reassembling would give the student a different
// instrument mid-sitting and silently invalidate their earlier
// responses.

import type { FormalGrowthAssignment } from './formalAssignmentStore';
import { isAssignmentLive } from './formalAssignmentStore';
import { GROWTH_RULES } from './growthSession';
import { recordExposure, type ExposureLog } from './itemUse';
import type { ResponseQualityMetadata } from './assessmentGovernance';

export type FormalSessionStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'abandoned'
  | 'window_expired';

export type FormalResponse = {
  itemId: string;
  /** §11 — per-item, measured. Not a placeholder. */
  interruptionCount?: number;
  longestInterruptionMs?: number;
  resumeEventCountAtAdministration?: number;
  /** Raw response. Scoring happens later; a field test collects
   *  evidence, it does not grade. */
  responseValue: string | number | null;
  omitted: boolean;
  responseTimeMs: number;
  administeredAt: number;
};

export type FormalSessionState = {
  sessionId: string;
  assignmentId: string;
  studentId: string;
  /** Copied from the assignment at start. Never re-derived. */
  formItemIdsInOrder: string[];
  currentIndex: number;
  responses: FormalResponse[];
  status: FormalSessionStatus;
  startedAt: number;
  lastActivityAt: number;
  interruptionCount: number;
  longestInterruptionMs: number;
  resumeEventCount: number;
  supportIdsUsed: string[];
  /** Frozen at start so a later policy change cannot rewrite history. */
  configurationSnapshotAtStart: FormalGrowthAssignment['configurationSnapshot'];
  supportComparabilityAtStart: string;
};

export type StartResult =
  | { ok: true; state: FormalSessionState }
  | { ok: false; reason: string };

/** Rules are fixed for formal sessions; exposed so the UI cannot
 *  accidentally soften them. */
export const FORMAL_RULES = GROWTH_RULES;

export function startFormalSession(args: {
  assignment: FormalGrowthAssignment;
  studentId: string;
  supportIds?: string[];
  newId: () => string;
  now: number;
}): StartResult {
  const { assignment, studentId, supportIds = [], newId, now } = args;

  if (!isAssignmentLive(assignment, now)) {
    return {
      ok: false,
      reason:
        now > assignment.closesAt
          ? 'This testing window has closed.'
          : 'This testing window has not opened yet.',
    };
  }
  if (assignment.form.itemIdsInOrder.length === 0) {
    return { ok: false, reason: 'This assignment has no form attached.' };
  }

  return {
    ok: true,
    state: {
      sessionId: newId(),
      assignmentId: assignment.assignmentId,
      studentId,
      // §12 — copied from the frozen form, in order.
      formItemIdsInOrder: [...assignment.form.itemIdsInOrder],
      currentIndex: 0,
      responses: [],
      status: 'in_progress',
      startedAt: now,
      lastActivityAt: now,
      interruptionCount: 0,
      longestInterruptionMs: 0,
      resumeEventCount: 0,
      supportIdsUsed: supportIds,
      configurationSnapshotAtStart: assignment.configurationSnapshot,
      supportComparabilityAtStart: supportIds.length === 0
        ? 'expected_comparable'
        : 'requires_evidence',
    },
  };
}

/** The item now due. Null when the form is finished. */
export function currentItemId(state: FormalSessionState): string | null {
  return state.formItemIdsInOrder[state.currentIndex] ?? null;
}

/** An item may be administered only if it is the one the frozen form
 *  says is next. Guards against any path that tries to inject an item. */
export function mayAdministerItem(
  state: FormalSessionState,
  itemId: string
): boolean {
  return currentItemId(state) === itemId;
}

export type RecordResponseResult = {
  state: FormalSessionState;
  exposure: ExposureLog;
  /** Set when the response was refused. */
  rejected?: string;
};

export function recordFormalResponse(args: {
  state: FormalSessionState;
  exposure: ExposureLog;
  itemId: string;
  responseValue: string | number | null;
  omitted: boolean;
  responseTimeMs: number;
  now: number;
  /** §8 — defaults to field test, the only context Pragati can run. */
  context?: 'growth_field_test' | 'growth_operational';
}): RecordResponseResult {
  const {
    state, exposure, itemId, responseValue, omitted, responseTimeMs, now,
    context = 'growth_field_test',
  } = args;

  if (state.status !== 'in_progress') {
    return { state, exposure, rejected: `Session is '${state.status}'.` };
  }
  if (!mayAdministerItem(state, itemId)) {
    return {
      state, exposure,
      rejected: `Item '${itemId}' is not the next item in the authorized form.`,
    };
  }

  const gap = now - state.lastActivityAt;
  // A long gap is recorded, never acted on — thresholds are an
  // empirical question (see PSYCHOMETRIC_VALIDATION_PLAN.md).
  const isInterruption = gap > 5 * 60 * 1000;

  const responses = [
    ...state.responses,
    {
      itemId, responseValue, omitted, responseTimeMs, administeredAt: now,
      // §11 — recorded PER ITEM. v0.59 emitted zeros here and then
      // reported those zeros as metadata, which is worse than omitting
      // the field: a zero reads as "no interruption occurred".
      interruptionCount: isInterruption ? 1 : 0,
      longestInterruptionMs: isInterruption ? gap : 0,
      resumeEventCountAtAdministration: state.resumeEventCount,
    },
  ];
  const nextIndex = state.currentIndex + 1;
  const finished = nextIndex >= state.formItemIdsInOrder.length;

  return {
    state: {
      ...state,
      responses,
      currentIndex: nextIndex,
      status: finished ? 'completed' : 'in_progress',
      lastActivityAt: now,
      interruptionCount: state.interruptionCount + (isInterruption ? 1 : 0),
      longestInterruptionMs: Math.max(state.longestInterruptionMs, isInterruption ? gap : 0),
    },
    // §8 — the PRECISE context. v0.59 passed the generic 'growth',
    // which meant a field-test administration could not be told apart
    // from an operational one in the exposure record — exactly the
    // distinction v0.59 introduced the split fields to make.
    exposure: recordExposure(exposure, itemId, context, now),
  };
}

export type ResumeResult =
  | { ok: true; state: FormalSessionState }
  | { ok: false; reason: string };

/**
 * Resume an interrupted sitting.
 *
 * Returns the SAME session with the SAME form. There is deliberately no
 * path here that calls the assembler.
 */
export function resumeFormalSession(args: {
  state: FormalSessionState;
  assignment: FormalGrowthAssignment;
  now: number;
}): ResumeResult {
  const { state, assignment, now } = args;

  if (state.status === 'completed') {
    return { ok: false, reason: 'This check is already finished.' };
  }
  if (!isAssignmentLive(assignment, now)) {
    return {
      ok: false,
      reason: 'This testing window has closed, so the check cannot be continued.',
    };
  }
  if (state.assignmentId !== assignment.assignmentId) {
    return { ok: false, reason: 'This session belongs to a different assignment.' };
  }

  const gap = now - state.lastActivityAt;
  const isInterruption = gap > 5 * 60 * 1000;

  return {
    ok: true,
    state: {
      ...state,
      status: 'in_progress',
      resumeEventCount: state.resumeEventCount + 1,
      interruptionCount: state.interruptionCount + (isInterruption ? 1 : 0),
      longestInterruptionMs: Math.max(state.longestInterruptionMs, isInterruption ? gap : 0),
      lastActivityAt: now,
      // Form and configuration are untouched, by construction.
    },
  };
}

/** Mark a sitting abandoned. Responses are kept as partial evidence. */
export function abandonFormalSession(
  state: FormalSessionState,
  now: number
): FormalSessionState {
  return { ...state, status: 'abandoned', lastActivityAt: now };
}

/**
 * Response-quality metadata for later empirical study. No verdict.
 *
 * §11 — values come from what was actually observed per item. Where a
 * response predates v0.60 the field is absent and reported as 0, which
 * is the honest reading: the data was not captured.
 */
export function qualityMetadata(state: FormalSessionState): ResponseQualityMetadata[] {
  return state.responses.map((r) => ({
    itemId: r.itemId,
    responseTimeMs: r.responseTimeMs,
    interruptionCount: r.interruptionCount ?? 0,
    longestInterruptionMs: r.longestInterruptionMs ?? 0,
    omitted: r.omitted,
    resumeEventCount: r.resumeEventCountAtAdministration ?? state.resumeEventCount,
  }));
}

/**
 * What a completed field-test sitting yields.
 *
 * Deliberately no score, ability, mastery, or percentile field — a
 * field test studies the instrument, not the student.
 */
export type FieldTestOutcome = {
  sessionId: string;
  assignmentId: string;
  itemsAdministered: number;
  itemsOmitted: number;
  status: FormalSessionStatus;
  evidenceType: 'field_test_response_data';
  note: string;
};

export function fieldTestOutcome(state: FormalSessionState): FieldTestOutcome {
  return {
    sessionId: state.sessionId,
    assignmentId: state.assignmentId,
    itemsAdministered: state.responses.length,
    itemsOmitted: state.responses.filter((r) => r.omitted).length,
    status: state.status,
    evidenceType: 'field_test_response_data',
    note: 'Pilot field test. These responses are research evidence for item calibration and produce no achievement, mastery, or growth result.',
  };
}
