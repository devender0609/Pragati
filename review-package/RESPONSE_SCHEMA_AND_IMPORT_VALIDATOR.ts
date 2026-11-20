// ===========================================================================
// v0.84.0-review.1 checkpoint 48 — RESPONSES, AND WHETHER THEY STILL APPLY.
//
// The hard part of review is not collecting opinions. It is knowing, months
// later, whether a reviewer's "yes, correct" still refers to the lesson
// that exists now. So every response carries the identity of what was
// judged, and import checks it rather than trusting it.
//
// A response is never silently attached to a changed lesson. It is accepted,
// or it is quarantined with the reason — and a quarantined response is not
// worthless: a semantic change invalidates the mathematics answers while a
// provenance correction may leave them perfectly good. The reason says which.
// ===========================================================================

import type { ArtifactReviewCandidate } from './artifactReview';

export type ReviewerPerspective = 'practising_educator' | 'curriculum_specialist';

export type ReviewDisposition = 'approve' | 'approve_with_changes' | 'revise' | 'reject';

export type ReviewResponse = {
  reviewCode: string;
  contentArtifactId: string;
  contentArtifactVersion: number;
  semanticFingerprint: string;
  provenanceFingerprint: string;
  instrumentVersion: number;
  reviewBuildId: string;
  reviewerName: string;
  reviewerPerspective: ReviewerPerspective;
  submittedAt: string;
  answers: Array<{ questionId: string; verdict: 'yes' | 'no' | 'unsure'; comment?: string }>;
  /** The reviewer's own judgement. Never derived from the answers. */
  disposition: ReviewDisposition;
  comments: string;
};

export type ImportOutcome =
  | { state: 'accepted'; response: ReviewResponse }
  | { state: 'quarantined'; response: ReviewResponse; reasons: string[]; stillUsable: string[] };

/**
 * Check a response against the candidate it claims to judge.
 *
 * `presentationDependent` answers are the ones a review-build change
 * invalidates; the rest survive it, which is the whole reason the three
 * identities are kept apart.
 */
export function importReviewResponse(
  response: ReviewResponse,
  candidates: ArtifactReviewCandidate[],
  existing: ReviewResponse[] = []
): ImportOutcome {
  const reasons: string[] = [];
  const stillUsable: string[] = [];

  const candidate = candidates.find((c) => c.reviewCode === response.reviewCode);
  if (!candidate) {
    return {
      state: 'quarantined',
      response,
      reasons: [`review code ${response.reviewCode} matches no current candidate`],
      stillUsable: [],
    };
  }
  if (candidate.contentArtifactId !== response.contentArtifactId) {
    reasons.push('the response names a different artifact from the one this code identifies');
  }
  if (candidate.contentArtifactVersion !== response.contentArtifactVersion) {
    reasons.push(
      `the lesson is now version ${candidate.contentArtifactVersion}; this response judged version ${response.contentArtifactVersion}`
    );
  }
  if (candidate.semanticFingerprint !== response.semanticFingerprint) {
    reasons.push('the lesson content has changed since this response was written');
  } else if (candidate.provenanceFingerprint !== response.provenanceFingerprint) {
    // Provenance moved, content did not — a narrower invalidation.
    reasons.push('the source provenance has been corrected since this response was written');
    stillUsable.push(
      'the mathematics and instruction answers still refer to the current lesson content'
    );
  }
  if (candidate.instrumentVersion !== response.instrumentVersion) {
    reasons.push(
      `the question set is now version ${candidate.instrumentVersion}; this response answered version ${response.instrumentVersion}`
    );
  }
  if (candidate.reviewBuildId !== response.reviewBuildId) {
    const presentationIds = new Set(
      candidate.questions.filter((q) => q.presentationDependent).map((q) => q.id)
    );
    const answeredPresentation = response.answers.filter((a) => presentationIds.has(a.questionId));
    if (answeredPresentation.length > 0) {
      reasons.push(
        `the review build has changed, so ${answeredPresentation.length} answer(s) about what was rendered no longer apply`
      );
      stillUsable.push('answers that do not depend on rendering are unaffected');
    }
  }
  const duplicate = existing.find(
    (r) =>
      r.reviewCode === response.reviewCode &&
      r.reviewerName === response.reviewerName &&
      r.reviewerPerspective === response.reviewerPerspective
  );
  if (duplicate) {
    reasons.push('this reviewer has already submitted a response for this code');
  }

  return reasons.length === 0
    ? { state: 'accepted', response }
    : { state: 'quarantined', response, reasons, stillUsable };
}

/**
 * Pragati's own governance standard, stated as such: two independent
 * perspectives before an artifact is considered reviewed. This is an
 * internal policy choice, not an external regulatory requirement, and it is
 * adjudication input rather than an automatic verdict.
 */
export const CLASS9_REQUIRED_PERSPECTIVES: ReviewerPerspective[] = [
  'practising_educator',
  'curriculum_specialist',
];

export function perspectivesCovered(
  reviewCode: string,
  accepted: ReviewResponse[]
): { covered: ReviewerPerspective[]; missing: ReviewerPerspective[] } {
  const covered = [
    ...new Set(
      accepted.filter((r) => r.reviewCode === reviewCode).map((r) => r.reviewerPerspective)
    ),
  ];
  return {
    covered,
    missing: CLASS9_REQUIRED_PERSPECTIVES.filter((p) => !covered.includes(p)),
  };
}
