// v0.65 §1/§8/§9 — THE EXECUTABLE PUBLICATION GATE.
//
// THE DEFECT THIS REPLACES
//
// `reviewDependencies.ts` declared that publishing §7.4 needs BOTH a
// Package A curriculum decision and a Package B instructional review.
// The executable check did neither of those things: it asked
// `mayAdvanceBeyondDraft(reviewRecordFor('B_demonstration'))` and then
// looked at a hand-maintained `mappingReviewStatus` flag.
//
// So the declared dependency and the enforced one had drifted apart —
// exactly the class of defect v0.63 fixed for section eligibility, in a
// place where the consequence is worse: unreviewed material reaching a
// child.
//
// TWO PRINCIPLES
//
// 1. REQUIRED SUBSETS, NOT WHOLE PACKAGES. Package A has 21 items; only
//    the ones about this section's alignment bear on it. Whether
//    `ratio_proportion` belongs at Grade 8 has nothing to do with §7.4,
//    and blocking on it would stall the pilot for no evidential gain.
//
// 2. NO SECOND TRUTH. Review status is DERIVED from the review record.
//    `mappingReviewStatus` is not consulted as an independent authority,
//    because two hand-maintained truths always diverge eventually.

import {
  reviewRecordFor,
  type ReviewRecord,
  type ReviewDecision,
  type AdjudicationOutcome,
} from './educatorReview';
import { sectionEligibility } from './eligibilityPolicy';
import { demonstrationSectionStatus } from './demonstrationSection';
import {
  isReadyForStudentPublication,
  blockingPublicationReadiness,
} from './contentStatus';

// ---------------------------------------------------------------------------
// §9 — what each outcome means for a gate
// ---------------------------------------------------------------------------

/**
 * Only `accept` satisfies a gate.
 *
 * `revise` is deliberately NOT satisfying. A reviewer saying "usable,
 * but change this" has not approved what they saw; they have described
 * a condition. Treating that as permission would let a developer make
 * an undocumented edit and ship on the strength of a review of
 * different content.
 *
 * The mechanism that closes this: a content-changing revision alters
 * the fingerprint, so the old submission no longer validates against
 * the new artifact and the affected items must be re-reviewed.
 */
export function decisionSatisfiesGate(d: ReviewDecision): boolean {
  return d === 'accept';
}

export function outcomeSatisfiesGate(o: AdjudicationOutcome): boolean {
  // `content_revised` means a revision was made — which changes the
  // fingerprint, which invalidates the review that prompted it. It
  // therefore cannot itself satisfy a gate.
  return o === 'content_accepted';
}

// ---------------------------------------------------------------------------
// §8 — the required item subsets, declared
// ---------------------------------------------------------------------------

/**
 * Package B items required for §7.4 instructional quality.
 *
 * All mathematics (M), source fidelity (S), age (A), visuals (V),
 * misconceptions (X) and practice (P) items — these are what
 * "instructional quality" means.
 *
 * Deliberately EXCLUDED: T1-T4 (teacher notes) and O1-O3 (overall
 * opinion). A reviewer who declines to answer "would you use this with
 * your own class" has not withheld evidence about whether the
 * mathematics is correct. Requiring an opinion question would let a
 * blank answer block a well-evidenced approval.
 */
export const PACKAGE_B_REQUIRED_FOR_PUBLICATION = [
  'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7',
  'S1', 'S2', 'S3',
  'A1', 'A2', 'A3', 'A4',
  'V1', 'V2', 'V3', 'V4', 'V5', 'V6',
  'X1', 'X2', 'X3', 'X4', 'X5', 'X6',
  'P1', 'P2', 'P3', 'P4',
] as const;

/**
 * Package A items required for §7.4 publication — the narrow set that
 * genuinely bears on THIS section.
 *
 *   C1 — is MIDDLE:C-1.4 the right primary competency for §7.4?
 *   C2 — is MIDDLE:C-1.6 justified as supporting?
 *   B1 — the Fractions section-coverage finding this section sits in.
 *
 * NOT required: A1-A5 (stage correction), B2-B5 (other chapters),
 * C3-C5 (other sections' competencies), D1-D6 (legacy disposition).
 * None of them changes whether §7.4 belongs where it claims.
 */
export const PACKAGE_A_REQUIRED_FOR_SECTION_7_4 = ['B1', 'C1', 'C2'] as const;

/**
 * v0.66 §7 — PUBLICATION POLICY IS PER SECTION, AND FAILS CLOSED.
 *
 * `mayPublishSection(id)` looked generic but hard-coded §7.4's Package A
 * subset. Called with §7.6 it would have applied §7.4's review
 * decisions to a different section — reusing an educator's judgement
 * about the number line to authorize content about equivalent
 * fractions.
 *
 * Every section now needs its own declared policy. A section with none
 * cannot be published, and says so.
 */
export type SectionPublicationPolicy = {
  officialSectionId: string;
  packageA: readonly string[];
  packageB: readonly string[];
  contentArtifactId: string;
  /** Does this section have an authored artifact under Package B
   *  review, or is it grandfathered legacy content? */
  kind: 'authored_artifact' | 'legacy_grandfathered';
};

export const PUBLICATION_REQUIREMENTS_BY_SECTION: Record<
  string,
  SectionPublicationPolicy
> = {
  ncert_gp_c6_s7_4: {
    officialSectionId: 'ncert_gp_c6_s7_4',
    packageA: PACKAGE_A_REQUIRED_FOR_SECTION_7_4,
    packageB: PACKAGE_B_REQUIRED_FOR_PUBLICATION,
    contentArtifactId: 'ncert_gp_c6_s7_4_lesson',
    kind: 'authored_artifact',
  },
  // No other section has a publication policy. §7.2, §7.5, §7.6 and
  // §7.8 carry grandfathered legacy content whose section verification
  // has not been done (39 lessons, 0 verified — see
  // grandfatheredLessons.ts). Adding them here would require their own
  // review evidence, not §7.4's.
};

export function publicationPolicyFor(
  officialSectionId: string
): SectionPublicationPolicy | null {
  return PUBLICATION_REQUIREMENTS_BY_SECTION[officialSectionId] ?? null;
}

// ---------------------------------------------------------------------------
// Gate evaluation
// ---------------------------------------------------------------------------

export type GateResult =
  | { satisfied: true }
  | { satisfied: false; reasons: string[] };

/**
 * Are the named items answered AND adjudicated with a satisfying
 * outcome?
 *
 * Note the order: an item that was never answered fails before its
 * adjudication is consulted, so an adjudication cannot stand in for a
 * missing review.
 */
export function requiredItemsSatisfied(
  record: ReviewRecord,
  requiredItemIds: readonly string[]
): GateResult {
  const reasons: string[] = [];

  const answers = new Map<string, ReviewDecision[]>();
  for (const s of record.submissions) {
    for (const r of s.responses) {
      answers.set(r.itemId, [...(answers.get(r.itemId) ?? []), r.decision]);
    }
  }
  const adjudications = new Map(
    record.adjudications.map((a) => [a.itemId, a.outcome])
  );

  for (const id of requiredItemIds) {
    const given = answers.get(id);
    if (!given || given.length === 0) {
      reasons.push(`${id}: not answered`);
      continue;
    }
    const outcome = adjudications.get(id);
    if (!outcome) {
      reasons.push(`${id}: answered but not adjudicated`);
      continue;
    }
    if (!outcomeSatisfiesGate(outcome)) {
      reasons.push(`${id}: adjudicated '${outcome}'`);
    }
  }

  return reasons.length === 0 ? { satisfied: true } : { satisfied: false, reasons };
}

export type PublicationDecision =
  | { mayPublish: true }
  | { mayPublish: false; blockers: string[] };

/**
 * v0.65 §1 — MAY THIS SECTION BE SHOWN TO STUDENTS?
 *
 * Four conditions, matching `reviewDependencies.ts` exactly:
 *
 *   A. the required Package A alignment items are adjudicated `accept`;
 *   B. the required Package B instructional items are adjudicated `accept`;
 *   C. instructional readiness passes;
 *   D. a student-facing artifact exists.
 *
 * Currently every one of A and B fails, because no review exists.
 */
export function mayPublishSection(
  officialSectionId: string
): PublicationDecision {
  const policy = publicationPolicyFor(officialSectionId);

  // v0.66 §7 — FAIL CLOSED. No policy means no evidence has been
  // scoped to this section, and §7.4's evidence is not transferable.
  if (!policy) {
    return {
      mayPublish: false,
      blockers: [
        `No publication policy defined for section '${officialSectionId}'. Review requirements must be declared per section; another section's review decisions cannot authorize this one.`,
      ],
    };
  }

  const blockers: string[] = [];

  // A — curriculum alignment
  const a = requiredItemsSatisfied(
    reviewRecordFor('A_curriculum'),
    policy.packageA
  );
  if (!a.satisfied) {
    blockers.push(
      `Package A (curriculum alignment) not satisfied: ${a.reasons.join('; ')}`
    );
  }

  // B — instructional quality
  const b = requiredItemsSatisfied(
    reviewRecordFor('B_demonstration'),
    policy.packageB
  );
  if (!b.satisfied) {
    blockers.push(
      `Package B (instructional quality) not satisfied: ${b.reasons.length} item(s) outstanding`
    );
  }

  // C — instructional readiness for the TRANSITION.
  //
  // v0.66 §1 — this asks whether the draft has been reviewed to the
  // required level, NOT whether it is already published. The previous
  // check used `isStudentLearningReady`, which requires every axis to
  // read `published` — so the gate asked "is it already published?"
  // before permitting publication.
  if (policy.kind === 'authored_artifact') {
    const status = demonstrationSectionStatus();
    if (!isReadyForStudentPublication(status)) {
      blockers.push(
        `Instructional readiness: ${blockingPublicationReadiness(status).join('; ')}`
      );
    }
  }

  // D — an artifact exists
  const e = sectionEligibility(officialSectionId);
  if (
    policy.kind === 'legacy_grandfathered' &&
    !e.hasEligibleLearn &&
    !e.hasEligiblePractice
  ) {
    blockers.push('No student-facing artifact exists for this section.');
  }

  return blockers.length === 0
    ? { mayPublish: true }
    : { mayPublish: false, blockers };
}

/**
 * §16 — instructional review may proceed independently of unrelated
 * Package A work. Used to confirm the pilot is not stalled by, say, the
 * Grade 8 ratio question.
 */
export function instructionalReviewIsBlocked(): boolean {
  // Nothing in Package A gates the ACT of reviewing §7.4 instruction.
  return false;
}
