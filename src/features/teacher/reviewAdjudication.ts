// v0.54 §9 + §10 — Expert review adjudication.
//
// v0.53 required two independent reviewers, which is a sound INTERNAL
// governance choice. It is not an external regulatory requirement, and
// the documentation should not imply otherwise.
//
// What v0.53 lacked was what happens when reviewers disagree. Without
// adjudication, disagreement either blocks forever or gets quietly
// resolved by whoever writes the summary. Both are bad; the second is
// worse, because it looks like consensus.

export type ReviewPerspective =
  /** Practising Indian Mathematics educator for the target grades. */
  | 'practising_educator'
  /** Mathematics curriculum / teacher-education specialist. */
  | 'curriculum_specialist'
  /** Measurement specialist — advises on measurability, NOT on what
   *  the curriculum should contain. */
  | 'assessment_specialist';

export const PERSPECTIVE_LABELS: Record<ReviewPerspective, string> = {
  practising_educator: 'Practising Mathematics educator',
  curriculum_specialist: 'Mathematics curriculum / teacher-education specialist',
  assessment_specialist: 'Assessment / measurement specialist',
};

/** Perspectives required before the pilot framework may be frozen. */
export const REQUIRED_PERSPECTIVES: readonly ReviewPerspective[] = [
  'practising_educator',
  'curriculum_specialist',
];

export type ReviewPosition = 'approve' | 'approve_with_changes' | 'revise' | 'reject';

export type DecisionReview = {
  decisionId: string;
  reviewerId: string;
  reviewerName: string;
  perspective: ReviewPerspective;
  position: ReviewPosition;
  rationale: string;
  frameworkVersion: string;
  reviewDate: string;
};

export type Adjudication = {
  decisionId: string;
  reviewer1Position: ReviewPosition;
  reviewer1Rationale: string;
  reviewer2Position: ReviewPosition;
  reviewer2Rationale: string;
  evidenceConsidered: string[];
  adjudicatorName: string;
  adjudicatorPerspective: ReviewPerspective;
  finalDecision: ReviewPosition;
  rationale: string;
  frameworkVersionAffected: string;
  adjudicationDate: string;
};

export type DisagreementState =
  | 'no_reviews'
  | 'awaiting_second_review'
  | 'agreed'
  | 'disagreement_pending_adjudication'
  | 'adjudicated';

export function disagreementState(
  reviews: DecisionReview[],
  adjudications: Adjudication[],
  decisionId: string
): DisagreementState {
  const forDecision = reviews.filter((r) => r.decisionId === decisionId);
  if (forDecision.length === 0) return 'no_reviews';
  const distinct = new Set(forDecision.map((r) => r.reviewerId));
  if (distinct.size < 2) return 'awaiting_second_review';

  if (adjudications.some((a) => a.decisionId === decisionId)) return 'adjudicated';

  const positions = new Set(forDecision.map((r) => r.position));
  // "approve" and "approve_with_changes" are not the same outcome and
  // are not treated as agreement.
  return positions.size === 1 ? 'agreed' : 'disagreement_pending_adjudication';
}

/**
 * May the pilot framework be frozen?
 *
 * Requires: both required perspectives present, every decision either
 * agreed or adjudicated, and no outstanding reject.
 *
 * The critical rule: an unresolved disagreement can NEVER be silently
 * converted to approval.
 */
export function mayFreezeFramework(args: {
  decisionIds: string[];
  reviews: DecisionReview[];
  adjudications: Adjudication[];
  frameworkVersion: string;
}): { allowed: boolean; blockers: string[] } {
  const { decisionIds, reviews, adjudications, frameworkVersion } = args;
  const blockers: string[] = [];

  const current = reviews.filter((r) => r.frameworkVersion === frameworkVersion);
  if (current.length === 0) {
    blockers.push(`No reviews recorded for framework version '${frameworkVersion}'.`);
  }

  for (const p of REQUIRED_PERSPECTIVES) {
    if (!current.some((r) => r.perspective === p)) {
      blockers.push(`Missing review from a ${PERSPECTIVE_LABELS[p]}.`);
    }
  }

  for (const id of decisionIds) {
    const state = disagreementState(current, adjudications, id);
    if (state === 'no_reviews') blockers.push(`Decision '${id}' has no reviews.`);
    if (state === 'awaiting_second_review') {
      blockers.push(`Decision '${id}' has only one reviewer.`);
    }
    if (state === 'disagreement_pending_adjudication') {
      blockers.push(
        `Decision '${id}' has an unresolved reviewer disagreement and must go to adjudication.`
      );
    }
    const adj = adjudications.find((a) => a.decisionId === id);
    if (adj?.finalDecision === 'reject') {
      blockers.push(`Decision '${id}' was rejected at adjudication.`);
    }
    if (
      state === 'agreed' &&
      current.filter((r) => r.decisionId === id).some((r) => r.position === 'reject')
    ) {
      blockers.push(`Decision '${id}' was rejected by reviewers.`);
    }
  }

  return { allowed: blockers.length === 0, blockers };
}

/** Governance note. Kept in code so the claim travels with the rule. */
export const GOVERNANCE_BASIS =
  'Two independent reviewers plus adjudication is a Pragati internal governance standard. It is not presented as an external regulatory requirement, because no such requirement has been identified for this product.';

/** Nothing has been reviewed. Real reviewers replace these empties. */
export const CURRENT_REVIEWS: DecisionReview[] = [];
export const CURRENT_ADJUDICATIONS: Adjudication[] = [];
