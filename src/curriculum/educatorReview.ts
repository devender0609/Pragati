import {
  PACKAGE_B_QUESTION_SET_VERSION,
  SECTION_7_4_ARTIFACT_VERSION,
  computeContentFingerprint,
} from './contentArtifact';
// v0.62 §2 — EDUCATOR REVIEW RECORDS.
//
// THE THREE STATES THAT MUST NEVER COLLAPSE INTO ONE
//
//   review_package_ready  — we wrote the questions
//   review_received       — a reviewer answered them
//   review_adjudicated    — someone resolved the answers into a decision
//
// v0.61 reached the first. It is tempting to treat "we sent it" as "it
// was reviewed", and that single elision is what would let unreviewed
// content reach a child. So the states are separate values, the
// progression is one-directional, and no function derives a later state
// from an earlier one.
//
// This is deliberately NOT an account system. A reviewer answers the
// markdown package, someone types or imports the decisions, and the
// record is a plain typed object.

export type ReviewDecision =
  | 'accept'
  | 'revise'
  | 'reject'
  | 'insufficient_evidence';

export type ReviewerRole =
  | 'practising_teacher'
  | 'curriculum_specialist'
  | 'mathematics_subject_expert'
  | 'accessibility_reviewer';

/** One reviewer's answer to one numbered item in a review package. */
export type ReviewItemResponse = {
  /** The item ID printed in the package — 'A1', 'B3', 'M5', 'V4'. */
  itemId: string;
  decision: ReviewDecision;
  /** Required. A decision without a reason cannot be adjudicated. */
  rationale: string;
};

/**
 * v0.75 §21 — package identity.
 *
 * The original two packages are named constants because there were two.
 * Section packages are keyed by their official section, so the set grows
 * with the chapter rather than by editing this union each time — and the
 * `S_section:` prefix keeps them distinguishable from the originals at a
 * glance and in a switch.
 */
export type ReviewPackageId =
  | 'A_curriculum'
  | 'B_demonstration'
  | `S_section:${string}`;

export type ReviewSubmission = {
  submissionId: string;
  packageId: ReviewPackageId;
  /** v0.65 §2/§4 — WHAT the reviewer saw, not merely which questions
   *  they were asked. A review is only evidence about the artifact in
   *  front of the reviewer at the time. */
  questionSetVersion?: number;
  contentArtifactId?: string;
  contentArtifactVersion?: number;
  contentFingerprint?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: ReviewerRole;
  /** ISO date the reviewer completed it. */
  reviewDate: string;
  responses: ReviewItemResponse[];
};

export type AdjudicationOutcome =
  | 'content_accepted'
  | 'content_revised'
  | 'content_rejected'
  | 'more_evidence_required'
  | 'reviewers_disagree_unresolved';

export type Adjudication = {
  itemId: string;
  outcome: AdjudicationOutcome;
  /** What actually changed in the product because of this. Empty is
   *  legitimate for `content_accepted`; anything else must say. */
  actionTaken: string;
  adjudicatedBy: string;
  adjudicationDate: string;
};

export type ReviewPackageState =
  | 'review_package_ready'
  | 'review_received'
  /** v0.63 §7 — answered and adjudicated, but not for every expected
   *  item. Previously this reported `review_adjudicated`, which read as
   *  "the review is done" when a reviewer had answered three of
   *  thirty-seven questions. The release gate already refused, but the
   *  LABEL was misleading, and labels get quoted in reports. */
  | 'review_partially_adjudicated'
  | 'review_adjudicated';

export type ReviewRecord = {
  packageId: ReviewPackageId;
  packageVersion: string;
  /** v0.65 §4 — the artifact this package's questions are about.
   *  Null for Package A, which asks about curriculum mapping rather
   *  than a specific lesson. */
  questionSetVersion?: number;
  contentArtifactId?: string | null;
  contentArtifactVersion?: number | null;
  /** Computed at import time from the CURRENT content, never stored
   *  stale — see `importReviewSubmission`. */
  expectedFingerprint?: () => string;
  /** Item IDs the package asks about. Used to detect partial returns. */
  expectedItemIds: string[];
  submissions: ReviewSubmission[];
  adjudications: Adjudication[];
};

// ---------------------------------------------------------------------------
// State — computed, never stored
// ---------------------------------------------------------------------------

/**
 * The state is DERIVED from what actually exists, so it cannot be set
 * optimistically. There is no `state` field to assign.
 */
export function packageState(r: ReviewRecord): ReviewPackageState {
  if (r.submissions.length === 0) return 'review_package_ready';
  if (!allItemsAdjudicated(r)) return 'review_received';
  // Every ANSWERED item is adjudicated. Whether the package is finished
  // depends on whether every EXPECTED item was answered.
  return unansweredItems(r).length === 0
    ? 'review_adjudicated'
    : 'review_partially_adjudicated';
}

export function allItemsAdjudicated(r: ReviewRecord): boolean {
  const answered = new Set(
    r.submissions.flatMap((s) => s.responses.map((x) => x.itemId))
  );
  if (answered.size === 0) return false;
  const adjudicated = new Set(r.adjudications.map((a) => a.itemId));
  for (const id of answered) if (!adjudicated.has(id)) return false;
  return true;
}

/** Items the package asked about that no reviewer answered. */
export function unansweredItems(r: ReviewRecord): string[] {
  const answered = new Set(
    r.submissions.flatMap((s) => s.responses.map((x) => x.itemId))
  );
  return r.expectedItemIds.filter((id) => !answered.has(id));
}

/** Items where reviewers reached different decisions. Adjudication
 *  exists precisely for these; they must not be silently averaged. */
export function conflictingItems(r: ReviewRecord): string[] {
  const byItem = new Map<string, Set<ReviewDecision>>();
  for (const s of r.submissions) {
    for (const resp of s.responses) {
      const set = byItem.get(resp.itemId) ?? new Set();
      set.add(resp.decision);
      byItem.set(resp.itemId, set);
    }
  }
  return [...byItem.entries()]
    .filter(([, d]) => d.size > 1)
    .map(([id]) => id);
}

/**
 * THE GATE. May content covered by this package move past
 * `authored_draft` toward student publication?
 *
 * Requires full adjudication AND no outcome that blocks. A single
 * `content_rejected` or `more_evidence_required` stops the whole
 * package — content is not shipped on a majority vote.
 */
export function mayAdvanceBeyondDraft(
  r: ReviewRecord
): { allowed: true } | { allowed: false; reasons: string[] } {
  const reasons: string[] = [];

  const state = packageState(r);
  if (state !== 'review_adjudicated') {
    reasons.push(`package state is '${state}', not 'review_adjudicated'`);
  }

  const unanswered = unansweredItems(r);
  if (unanswered.length > 0) {
    reasons.push(`${unanswered.length} package item(s) unanswered`);
  }

  const blocking = r.adjudications.filter(
    (a) =>
      a.outcome === 'content_rejected' ||
      a.outcome === 'more_evidence_required' ||
      a.outcome === 'reviewers_disagree_unresolved'
  );
  if (blocking.length > 0) {
    reasons.push(
      `${blocking.length} adjudication(s) block release: ${blocking
        .map((a) => `${a.itemId}=${a.outcome}`)
        .join(', ')}`
    );
  }

  return reasons.length > 0 ? { allowed: false, reasons } : { allowed: true };
}

// ---------------------------------------------------------------------------
// The actual records — empty, because no review has happened
// ---------------------------------------------------------------------------

/**
 * v0.62 §19 — NOT FABRICATED.
 *
 * Both packages were prepared in v0.61 and sent to nobody. These
 * records carry zero submissions and zero adjudications, so
 * `packageState` returns 'review_package_ready' and
 * `mayAdvanceBeyondDraft` refuses. Everything downstream stays
 * `authored_draft`, which is the honest state.
 */
export const REVIEW_RECORDS: ReviewRecord[] = [
  {
    packageId: 'A_curriculum',
    packageVersion: 'v0.61',
    questionSetVersion: 1,
    // Package A asks about curriculum mapping, not a lesson artifact.
    contentArtifactId: null,
    contentArtifactVersion: null,
    expectedItemIds: [
      'A1', 'A2', 'A3', 'A4', 'A5',
      'B1', 'B2', 'B3', 'B4', 'B5',
      'C1', 'C2', 'C3', 'C4', 'C5',
      'D1', 'D2', 'D3', 'D4', 'D5', 'D6',
    ],
    submissions: [],
    adjudications: [],
  },
  {
    packageId: 'B_demonstration',
    // The version the QUESTIONS were designed in. The content being
    // reviewed is identified separately below — conflating the two is
    // the defect v0.65 §2 exists to fix.
    packageVersion: 'v0.61',
    questionSetVersion: PACKAGE_B_QUESTION_SET_VERSION,
    contentArtifactId: 'ncert_gp_c6_s7_4_lesson',
    contentArtifactVersion: SECTION_7_4_ARTIFACT_VERSION,
    expectedFingerprint: computeContentFingerprint,
    expectedItemIds: [
      'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7',
      'S1', 'S2', 'S3',
      'A1', 'A2', 'A3', 'A4',
      'V1', 'V2', 'V3', 'V4', 'V5', 'V6',
      'X1', 'X2', 'X3', 'X4', 'X5', 'X6',
      'P1', 'P2', 'P3', 'P4',
      'T1', 'T2', 'T3', 'T4',
      'O1', 'O2', 'O3',
    ],
    submissions: [],
    adjudications: [],
  },
];

export function reviewRecordFor(
  packageId: 'A_curriculum' | 'B_demonstration'
): ReviewRecord {
  const r = REVIEW_RECORDS.find((x) => x.packageId === packageId);
  if (!r) throw new Error(`no review record for ${packageId}`);
  return r;
}

/** Reviewer-facing summary. Used by Admin; never shown to students. */
export function reviewStatusSummary(r: ReviewRecord): string {
  const state = packageState(r);
  switch (state) {
    case 'review_package_ready':
      return `Package prepared (${r.expectedItemIds.length} items). No reviewer response received.`;
    case 'review_received':
      return `${r.submissions.length} response(s) received; ${unansweredItems(r).length} item(s) unanswered; adjudication pending.`;
    case 'review_partially_adjudicated':
      return `Partially reviewed: every answered item is adjudicated, but ${unansweredItems(r).length} of ${r.expectedItemIds.length} package item(s) were never answered.`;
    case 'review_adjudicated':
      return `Adjudicated: ${r.adjudications.length} decision(s) across all ${r.expectedItemIds.length} package item(s).`;
  }
}

// ---------------------------------------------------------------------------
// v0.63 §7 — IMPORT
// ---------------------------------------------------------------------------

export type ImportResult =
  | { ok: true; submission: ReviewSubmission }
  | { ok: false; errors: string[] };

const DECISIONS: ReviewDecision[] = [
  'accept',
  'revise',
  'reject',
  'insufficient_evidence',
];

const ROLES: ReviewerRole[] = [
  'practising_teacher',
  'curriculum_specialist',
  'mathematics_subject_expert',
  'accessibility_reviewer',
];

/**
 * Validate and import a reviewer response.
 *
 * Strict on purpose. A malformed review that imports silently is worse
 * than one that fails loudly: the decisions it carries will be quoted
 * as evidence that content was checked.
 *
 * The submission is returned unchanged — this function never edits a
 * reviewer's words, and adjudication is stored separately so the
 * original response stays auditable.
 */
export function importReviewSubmission(
  record: ReviewRecord,
  raw: unknown
): ImportResult {
  const errors: string[] = [];
  const o = raw as Partial<ReviewSubmission> & { responses?: unknown };

  if (!o || typeof o !== 'object') {
    return { ok: false, errors: ['submission is not an object'] };
  }
  if (o.packageId !== record.packageId) {
    errors.push(
      `packageId '${String(o.packageId)}' does not match '${record.packageId}'`
    );
  }
  if (!o.reviewerId?.trim()) errors.push('reviewerId is required');
  if (!o.reviewerName?.trim()) errors.push('reviewerName is required');
  if (!o.reviewerRole || !ROLES.includes(o.reviewerRole)) {
    errors.push(`reviewerRole '${String(o.reviewerRole)}' is not recognised`);
  }
  if (!o.reviewDate || !/^\d{4}-\d{2}-\d{2}$/.test(o.reviewDate)) {
    errors.push('reviewDate must be an ISO date (YYYY-MM-DD)');
  }
  // v0.65 §4 — ARTIFACT IDENTITY. An old review must never silently
  // authorize newer content, so every mismatch is a hard rejection
  // with an explicit reason rather than a warning.
  if (record.questionSetVersion !== undefined) {
    if (o.questionSetVersion !== record.questionSetVersion) {
      errors.push(
        `questionSetVersion ${String(o.questionSetVersion)} does not match ${record.questionSetVersion}`
      );
    }
  }
  if (record.contentArtifactId) {
    if (o.contentArtifactId !== record.contentArtifactId) {
      errors.push(
        `contentArtifactId '${String(o.contentArtifactId)}' does not match '${record.contentArtifactId}'`
      );
    }
    if (o.contentArtifactVersion !== record.contentArtifactVersion) {
      errors.push(
        `contentArtifactVersion ${String(o.contentArtifactVersion)} does not match ${String(record.contentArtifactVersion)}`
      );
    }
    const expected = record.expectedFingerprint?.();
    if (expected && o.contentFingerprint !== expected) {
      // The content changed after the packet was sent. The review is
      // evidence about what the reviewer saw, which is no longer what
      // the product would publish.
      errors.push(
        `contentFingerprint '${String(o.contentFingerprint)}' does not match the current content '${expected}'. The lesson changed after this review was prepared; the affected items need re-review.`
      );
    }
  }

  if (!Array.isArray(o.responses) || o.responses.length === 0) {
    errors.push('responses must be a non-empty array');
    return { ok: false, errors };
  }

  const expected = new Set(record.expectedItemIds);
  const seen = new Set<string>();

  for (const [i, rr] of (o.responses as ReviewItemResponse[]).entries()) {
    const at = `responses[${i}]`;
    if (!rr?.itemId) {
      errors.push(`${at}: itemId is required`);
      continue;
    }
    if (!expected.has(rr.itemId)) {
      // An unknown ID means the reviewer answered a different version
      // of the package. Accepting it would attach their judgement to a
      // question they were not asked.
      errors.push(`${at}: '${rr.itemId}' is not an item in this package`);
    }
    if (seen.has(rr.itemId)) {
      errors.push(`${at}: duplicate response for '${rr.itemId}'`);
    }
    seen.add(rr.itemId);

    if (!DECISIONS.includes(rr.decision)) {
      errors.push(`${at}: decision '${String(rr.decision)}' is not recognised`);
    }
    if (!rr.rationale?.trim()) {
      // A decision without a reason cannot be adjudicated — there is
      // nothing to weigh against a conflicting reviewer.
      errors.push(`${at}: rationale is required`);
    }
  }

  // One reviewer, one submission per package.
  if (
    record.submissions.some(
      (s) => s.reviewerId === o.reviewerId && s.packageId === record.packageId
    )
  ) {
    errors.push(`reviewer '${String(o.reviewerId)}' has already submitted`);
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    submission: {
      submissionId: o.submissionId ?? `${o.reviewerId}-${o.reviewDate}`,
      packageId: record.packageId,
      questionSetVersion: o.questionSetVersion,
      contentArtifactId: o.contentArtifactId,
      contentArtifactVersion: o.contentArtifactVersion,
      contentFingerprint: o.contentFingerprint,
      reviewerId: o.reviewerId!,
      reviewerName: o.reviewerName!,
      reviewerRole: o.reviewerRole!,
      reviewDate: o.reviewDate!,
      responses: o.responses as ReviewItemResponse[],
    },
  };
}

/** Adjudication coverage, for the report and Admin. */
export function adjudicationGaps(r: ReviewRecord): {
  answered: number;
  adjudicated: number;
  unanswered: number;
  conflicts: string[];
} {
  const answered = new Set(
    r.submissions.flatMap((s) => s.responses.map((x) => x.itemId))
  );
  return {
    answered: answered.size,
    adjudicated: new Set(r.adjudications.map((a) => a.itemId)).size,
    unanswered: unansweredItems(r).length,
    conflicts: conflictingItems(r),
  };
}
