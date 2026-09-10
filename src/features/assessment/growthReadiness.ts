// v0.56 §12 — Growth readiness, derived from evidence.
//
// v0.55 hardcoded `growth = 'not_eligible'`. That was TRUE, and it is
// still the correct answer for every chapter today — but a hardcoded
// constant cannot become false when the evidence changes, so the day
// the first calibrated item exists someone has to remember to rewrite
// this. Constants that must be remembered are constants that get
// forgotten.
//
// The status is now computed from the same evidence the rest of the
// pipeline records. It returns `not_eligible` for everything because
// the evidence genuinely says so, not because it is written down.

import type { GrowthStatus } from '../../curriculum/readiness';
import { evaluateFrameworkEvidenceGate } from '../../curriculum/frameworkEvidenceGate';

export type GrowthReadinessInputs = {
  /** Is the pilot framework approved? Gates everything downstream. */
  frameworkApprovedForPilot: boolean;
  /** Specifications covering this chapter's competencies. */
  specificationCount: number;
  specificationsExpertReviewed: number;
  /** Secure items authored for this chapter. */
  secureItemCount: number;
  itemsExpertReviewed: number;
  itemsFieldTestEligible: number;
  itemsFieldTested: number;
  itemsCalibrated: number;
  operationalApproved: boolean;
};

export const NO_GROWTH_EVIDENCE: GrowthReadinessInputs = {
  frameworkApprovedForPilot: false,
  specificationCount: 0,
  specificationsExpertReviewed: 0,
  secureItemCount: 0,
  itemsExpertReviewed: 0,
  itemsFieldTestEligible: 0,
  itemsFieldTested: 0,
  itemsCalibrated: 0,
  operationalApproved: false,
};

export type GrowthReadinessResult = {
  status: GrowthStatus;
  /** Why it is not further along. Empty only when operational. */
  blockers: string[];
};

/**
 * Derive Growth readiness.
 *
 * Strictly monotonic: each stage requires everything before it. The
 * framework gate comes first, because items authored against an
 * unapproved framework may have to be retagged, which is the entire
 * reason item authoring is currently blocked.
 */
export function evaluateGrowthReadiness(
  inputs: GrowthReadinessInputs = NO_GROWTH_EVIDENCE
): GrowthReadinessResult {
  const blockers: string[] = [];

  if (!inputs.frameworkApprovedForPilot) {
    const gate = evaluateFrameworkEvidenceGate();
    blockers.push(
      `Pilot framework is not approved (evidence status: ${gate.status}).`
    );
    return { status: 'not_eligible', blockers };
  }
  if (inputs.specificationCount === 0) {
    blockers.push('No item specifications cover this chapter.');
    return { status: 'not_eligible', blockers };
  }
  if (inputs.specificationsExpertReviewed === 0) {
    blockers.push('No specification has been expert reviewed.');
    return { status: 'not_eligible', blockers };
  }
  if (inputs.secureItemCount === 0) {
    blockers.push('No secure Growth items authored.');
    return { status: 'specifications_ready', blockers };
  }
  if (inputs.itemsExpertReviewed < inputs.secureItemCount) {
    blockers.push('Not every authored item has been expert reviewed.');
    return { status: 'items_authored', blockers };
  }
  if (inputs.itemsFieldTestEligible === 0) {
    blockers.push('No item has passed the field-test eligibility gate.');
    return { status: 'expert_reviewed', blockers };
  }
  if (inputs.itemsFieldTested === 0) {
    blockers.push('Field testing has not been carried out.');
    return { status: 'field_test_ready', blockers };
  }
  if (inputs.itemsCalibrated === 0) {
    blockers.push('No item has been calibrated.');
    return { status: 'field_tested', blockers };
  }
  if (!inputs.operationalApproved) {
    blockers.push('Operational use has not been approved.');
    return { status: 'calibrated', blockers };
  }
  return { status: 'operational', blockers: [] };
}

/** Today's inputs for every chapter: nothing exists. */
export function currentGrowthReadinessFor(): GrowthReadinessResult {
  return evaluateGrowthReadiness(NO_GROWTH_EVIDENCE);
}


// ---------------------------------------------------------------------------
// v0.57 §6 + §7 — Scoped, coverage-driven readiness.
//
// The count-based version above answers "are there some specifications?"
// The right question is "is every competency the pilot scope requires
// actually covered, reviewed, and assemblable?" A strand with eight
// specifications covering three of its twelve competencies is not
// ready, however large the count.
//
// Scope also matters: v0.56's readiness was global, which was safe only
// while everything was `not_eligible`. The moment Fractions advanced, so
// would Geometry. Readiness is now per scope.
// ---------------------------------------------------------------------------

export type GrowthScope = {
  /** Pragati module, where one applies. */
  moduleId: string | null;
  /** Official chapter, where mapped. */
  officialChapterId: string | null;
  /** Competencies the pilot requires for this scope. */
  requiredCompetencyIds: string[];
  frameworkVersion: string;
  administrationSpecificationId: string;
};

export type ScopedGrowthEvidence = {
  frameworkApprovedForPilot: boolean;
  /** competencyId -> number of VALID specifications covering it. */
  specificationsByCompetency: Record<string, number>;
  /** competencyId -> number of EXPERT-REVIEWED specifications. */
  reviewedSpecificationsByCompetency: Record<string, number>;
  /** competencyId -> number of ELIGIBLE candidate items. */
  eligibleItemsByCompetency: Record<string, number>;
  /** Did the real AssessmentAssembler build a form? */
  assemblerSucceeded: boolean;
  assemblerUnmetConstraints: string[];
  itemsFieldTested: number;
  itemsCalibrated: number;
  operationalApproved: boolean;
};

export const NO_SCOPED_EVIDENCE: ScopedGrowthEvidence = {
  frameworkApprovedForPilot: false,
  specificationsByCompetency: {},
  reviewedSpecificationsByCompetency: {},
  eligibleItemsByCompetency: {},
  assemblerSucceeded: false,
  assemblerUnmetConstraints: [],
  itemsFieldTested: 0,
  itemsCalibrated: 0,
  operationalApproved: false,
};

export type ScopedGrowthReadiness = {
  scopeId: string;
  status: GrowthStatus;
  /** Blockers named by the competency or constraint responsible. */
  blockers: string[];
  competenciesWithoutSpecification: string[];
  competenciesWithoutReviewedSpecification: string[];
  competenciesWithoutItems: string[];
};

/**
 * Evaluate readiness for ONE scope.
 *
 * Coverage-driven: a competency the pilot requires but nothing covers
 * is named as the blocker. No arbitrary minimum item count is invented
 * — the only counts used come from the versioned administration
 * specification via the assembler.
 */
export function evaluateScopedGrowthReadiness(
  scope: GrowthScope,
  evidence: ScopedGrowthEvidence = NO_SCOPED_EVIDENCE
): ScopedGrowthReadiness {
  const scopeId = scope.moduleId ?? scope.officialChapterId ?? 'unscoped';
  const required = scope.requiredCompetencyIds;

  const competenciesWithoutSpecification = required.filter(
    (c) => (evidence.specificationsByCompetency[c] ?? 0) === 0
  );
  const competenciesWithoutReviewedSpecification = required.filter(
    (c) => (evidence.reviewedSpecificationsByCompetency[c] ?? 0) === 0
  );
  const competenciesWithoutItems = required.filter(
    (c) => (evidence.eligibleItemsByCompetency[c] ?? 0) === 0
  );

  const base = {
    scopeId,
    competenciesWithoutSpecification,
    competenciesWithoutReviewedSpecification,
    competenciesWithoutItems,
  };

  if (!evidence.frameworkApprovedForPilot) {
    return {
      ...base,
      status: 'not_eligible',
      blockers: ['The pilot framework has not been approved.'],
    };
  }
  if (required.length === 0) {
    return {
      ...base,
      status: 'not_eligible',
      blockers: ['No pilot competencies are defined for this scope.'],
    };
  }
  if (competenciesWithoutSpecification.length > 0) {
    return {
      ...base,
      status: 'not_eligible',
      blockers: [
        `No item specification covers: ${competenciesWithoutSpecification.join(', ')}.`,
      ],
    };
  }
  if (competenciesWithoutReviewedSpecification.length > 0) {
    return {
      ...base,
      status: 'specifications_ready',
      blockers: [
        `Specifications not expert reviewed for: ${competenciesWithoutReviewedSpecification.join(', ')}.`,
      ],
    };
  }
  if (competenciesWithoutItems.length > 0) {
    return {
      ...base,
      status: 'items_authored',
      blockers: [
        `No eligible items for: ${competenciesWithoutItems.join(', ')}.`,
      ],
    };
  }
  if (!evidence.assemblerSucceeded) {
    return {
      ...base,
      status: 'expert_reviewed',
      blockers: evidence.assemblerUnmetConstraints.length > 0
        ? evidence.assemblerUnmetConstraints
        : ['A balanced pilot form could not be assembled.'],
    };
  }
  if (evidence.itemsFieldTested === 0) {
    return { ...base, status: 'field_test_ready', blockers: ['Field testing not carried out.'] };
  }
  if (evidence.itemsCalibrated === 0) {
    return { ...base, status: 'field_tested', blockers: ['No item calibrated.'] };
  }
  if (!evidence.operationalApproved) {
    return { ...base, status: 'calibrated', blockers: ['Operational use not approved.'] };
  }
  return { ...base, status: 'operational', blockers: [] };
}

/**
 * Readiness for several scopes.
 *
 * The point of the signature: one advancing strand does not advance
 * another. Each scope is evaluated against its own evidence.
 */
export function evaluateGrowthReadinessByScope(
  scopes: Array<{ scope: GrowthScope; evidence?: ScopedGrowthEvidence }>
): ScopedGrowthReadiness[] {
  return scopes.map(({ scope, evidence }) =>
    evaluateScopedGrowthReadiness(scope, evidence ?? NO_SCOPED_EVIDENCE)
  );
}
