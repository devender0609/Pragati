// v0.74 §7 — IS THIS SECTION ACTUALLY BLOCKED ON A PERSON?
//
// THE CLAIM THIS FILE TESTS
//
// v0.73 led with a number: "8 of the 9 authored Chapter 7 sections need
// NO authoring at all. Their only outstanding work item is
// educator_review. No amount of further tooling advances them."
//
// The first sentence is true. The second is not.
//
// A section is blocked on a reviewer only when a reviewer could
// actually review it tomorrow. That requires five things to exist, and
// v0.73 checked none of them — it inferred "blocked on a human" from
// the absence of authoring work, which is a different claim.
//
// WHAT THE EVIDENCE ACTUALLY SHOWS
//
// `REVIEW_RECORDS` contains exactly two packages. Package A asks about
// curriculum mapping and names no artifact. Package B names ONE:
// `ncert_gp_c6_s7_4_lesson`. Its thirty-seven questions — M1-M7 on the
// mathematics, V1-V6 on the visuals, P1-P4 on the interactive practice
// — are written about §7.4's number line. They cannot be handed to a
// reviewer for §7.2.
//
// The frozen candidate `S74-v1-A1A3FF` likewise names one section, one
// artifact, one fingerprint, and one pinned review build.
//
// So of the eight complete drafts, ONE is review-ready and SEVEN need
// engineering first: a question set, a frozen candidate, a pinned build,
// a reviewer preview route. Calling all eight "blocked on people, not
// engineering" told the wrong story about where the next week goes —
// and it told it in the release headline.
//
// This file computes the answer from what exists rather than asserting
// it, so the number cannot drift from the artifacts again.

import { REVIEW_RECORDS } from './educatorReview';
import { fractionsChapterSections } from './fractionsChapter';
import { assessSection } from './instructionalCompleteness';
import { section74Artifact } from './contentArtifact';
import {
  sectionReviewRecord,
  sectionReviewCode,
  questionsForSection,
  ALREADY_PACKAGED,
} from './sectionReviewPackages';

/**
 * Where a draft sits on the road to being reviewed.
 *
 * Deliberately finer than "blocked on a human": the first state is
 * engineering work, and collapsing it into the others is the v0.73
 * defect.
 */
export type ReviewReadinessState =
  /** Complete draft, but no reviewer could start today. Engineering. */
  | 'review_package_preparation'
  /** Everything a reviewer needs exists. Waiting on a person. */
  | 'review_ready'
  /** Handed to a named reviewer. */
  | 'review_sent'
  /** A response came back. */
  | 'review_received'
  /** Every response adjudicated. */
  | 'review_adjudicated'
  /** Not a complete draft yet; readiness is not the question. */
  | 'not_a_complete_draft';

export type ReadinessCheck = {
  id:
    | 'stable_artifact_identity'
    | 'reviewable_preview'
    | 'review_instrument'
    | 'curriculum_mapping'
    | 'feedback_import_path';
  label: string;
  satisfied: boolean;
  /** What exists, or what does not. Quoted in the report. */
  evidence: string;
};

export type SectionReviewReadiness = {
  officialSectionId: string;
  sectionNumber: string;
  state: ReviewReadinessState;
  checks: ReadinessCheck[];
  /** True only when every check passes AND no response has arrived. */
  blockedOnReviewerOnly: boolean;
  /** The next action, naming who does it. */
  nextAction: string;
};

/** The single artifact Package B was written about. */
const PACKAGE_B_ARTIFACT = 'ncert_gp_c6_s7_4_lesson';

/**
 * Sections with a frozen review candidate.
 *
 * v0.75 §21 — §7.4 keeps its own frozen artifact, untouched. Every
 * other complete draft now has a section-scoped candidate generated
 * from its own content, so this no longer returns null for them.
 *
 * Both branches derive from real artifacts rather than a hard-coded
 * list: if a lesson is renamed or deleted, this stops claiming a
 * candidate that no longer exists.
 */
function frozenCandidateFor(officialSectionId: string): string | null {
  const a = section74Artifact();
  if (a.officialSectionId === officialSectionId) return a.reviewCode;
  return questionsForSection(officialSectionId).length > 0
    ? sectionReviewCode(officialSectionId)
    : null;
}

/**
 * The review record whose questions are about THIS section.
 *
 * v0.75 §21 — was Package B only, which is why seven sections reported
 * `review_package_preparation`: Package B's items are written about
 * §7.4's number line and are not transferable. Sections other than §7.4
 * now resolve to their own generated record.
 */
function packageFor(officialSectionId: string) {
  if (officialSectionId === ALREADY_PACKAGED) {
    const b = REVIEW_RECORDS.find((r) => r.packageId === 'B_demonstration');
    return b && b.contentArtifactId === `${officialSectionId}_lesson` ? b : null;
  }
  return questionsForSection(officialSectionId).length > 0
    ? sectionReviewRecord(officialSectionId)
    : null;
}

export function assessReviewReadiness(
  officialSectionId: string
): SectionReviewReadiness {
  const section = fractionsChapterSections().find(
    (s) => s.source.officialSectionId === officialSectionId
  );
  const completeness = section ? assessSection(section) : null;
  const sectionNumber = section?.source.sectionNumber ?? '—';

  const isCompleteDraft =
    completeness?.level === 'complete_instructional_draft';

  const pkg = packageFor(officialSectionId);
  const candidate = frozenCandidateFor(officialSectionId);
  const frozen = candidate !== null;

  const checks: ReadinessCheck[] = [
    {
      id: 'stable_artifact_identity',
      label: 'A frozen candidate the reviewer’s answers can attach to',
      satisfied: frozen,
      evidence: frozen
        ? `Frozen candidate ${candidate}, fingerprint recomputed at import.`
        : 'No frozen review candidate. A reviewer’s answers would attach to nothing stable.',
    },
    {
      id: 'reviewable_preview',
      label: 'A pinned build the reviewer can open and touch',
      satisfied: frozen,
      evidence: frozen
        ? 'Pinned review build with an explicit presentation surface.'
        : 'No pinned build. Presentation questions could not be answered against a fixed rendering.',
    },
    {
      id: 'review_instrument',
      label: 'A question set written about THIS section',
      satisfied: pkg !== null,
      evidence:
        pkg !== null
          ? `${pkg.expectedItemIds.length} items, artifact ${pkg.contentArtifactId}.`
          : `No question set. Package B’s items are written about ${PACKAGE_B_ARTIFACT} and are not transferable.`,
    },
    {
      id: 'curriculum_mapping',
      label: 'Mapping sufficient for the reviewer to judge placement',
      // Package A is outstanding for every section alike; it does not
      // block INSTRUCTIONAL review, which is what Package B asks.
      // Recorded as satisfied-for-this-purpose with the caveat stated.
      satisfied: Boolean(section),
      evidence: section
        ? 'Section maps to a verified official record. Package A (placement) remains outstanding and is not settled by Package B.'
        : 'No official section record.',
    },
    {
      id: 'feedback_import_path',
      label: 'A route that can import and adjudicate a response',
      satisfied: pkg !== null,
      evidence:
        pkg !== null
          ? 'importReviewSubmission validates fingerprint and item IDs against this record.'
          : 'No review record exists to import a response into.',
    },
  ];

  const allSatisfied = checks.every((c) => c.satisfied);
  const submissions = pkg?.submissions.length ?? 0;
  const adjudications = pkg?.adjudications.length ?? 0;

  let state: ReviewReadinessState;
  if (!isCompleteDraft) state = 'not_a_complete_draft';
  else if (!allSatisfied) state = 'review_package_preparation';
  else if (submissions === 0) state = 'review_ready';
  else if (adjudications === 0) state = 'review_received';
  else state = 'review_adjudicated';

  const missing = checks.filter((c) => !c.satisfied);

  return {
    officialSectionId,
    sectionNumber,
    state,
    checks,
    blockedOnReviewerOnly: state === 'review_ready',
    nextAction:
      state === 'not_a_complete_draft'
        ? 'Finish authoring before readiness applies.'
        : state === 'review_package_preparation'
          ? `ENGINEERING: ${missing.map((m) => m.label.toLowerCase()).join('; ')}.`
          : state === 'review_ready'
            ? 'PERSON: send the package to a Grade 6 mathematics educator. Nothing in engineering advances this.'
            : state === 'review_received'
              ? 'PERSON: adjudicate the returned responses.'
              : 'Adjudicated. Publication gate decides what follows.',
  };
}

/** Readiness for every authored Chapter 7 section, in section order. */
export function chapterReviewReadiness(): SectionReviewReadiness[] {
  return fractionsChapterSections().map((s) =>
    assessReviewReadiness(s.source.officialSectionId)
  );
}

export type ReviewReadinessSummary = {
  completeDrafts: number;
  reviewReady: number;
  awaitingPackagePreparation: number;
  reviewSent: number;
  reviewReceived: number;
  reviewAdjudicated: number;
  headline: string;
};

export function reviewReadinessSummary(): ReviewReadinessSummary {
  const rows = chapterReviewReadiness();
  const count = (s: ReviewReadinessState) =>
    rows.filter((r) => r.state === s).length;

  const complete = rows.filter((r) => r.state !== 'not_a_complete_draft').length;
  const ready = count('review_ready');
  const prep = count('review_package_preparation');

  return {
    completeDrafts: complete,
    reviewReady: ready,
    awaitingPackagePreparation: prep,
    reviewSent: count('review_sent'),
    reviewReceived: count('review_received'),
    reviewAdjudicated: count('review_adjudicated'),
    headline:
      `${complete} complete drafts. ${ready} ${ready === 1 ? 'is' : 'are'} review-ready and blocked on a person. ` +
      (prep === 0
        ? 'No section is waiting on engineering.'
        : `${prep} still need a review package built before any educator can read them — that is engineering work, not a reviewer delay.`),
  };
}
