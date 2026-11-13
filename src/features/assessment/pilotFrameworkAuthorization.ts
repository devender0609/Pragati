// v0.58 §2 + §3 + §4 — Pilot framework authorization.
//
// THE HOLE THIS CLOSES
//
// v0.57's `prepareGrowthAdministration()` checked context, eligibility,
// metadata, and assembly. It never asked whether the FRAMEWORK those
// items were written against had been approved.
//
// So a bank of 100 perfectly-reviewed items would have produced a
// ready form while the domain structure was still unresolved — items
// tagged to domains that human review might yet merge, split, or
// delete. The form would have been assembled correctly against a
// blueprint nobody had agreed to.
//
// The full chain is now:
//
//   evidence gate → human review/adjudication → framework approved
//   → administration specification approved → item eligibility
//   → blueprint assembly → assignment
//
// Every link must hold. This module owns the first four.

import {
  evaluateFrameworkGate,
  type SourceInspectionRecord,
  type RequiredSource,
} from '../../curriculum/frameworkEvidenceGate';
import type {
  DecisionReview,
  Adjudication,
} from '../teacher/reviewAdjudication';
import type { PilotAdministrationSpecification } from './assessmentAssembler';

// ---------------------------------------------------------------------------
// §3 — Administration specification lifecycle
// ---------------------------------------------------------------------------

/**
 * A draft research hypothesis must never power a real assignment.
 *
 * v0.57's `PILOT_ADMINISTRATION_V1` is `status: 'draft'` and
 * `evidenceStatus: 'research_hypothesis'` — correctly so — yet the
 * pipeline would execute it. Draft specifications remain fully usable
 * for simulation, assembler tests, and bank-sufficiency planning;
 * they simply cannot create a student assignment.
 */
export type SpecificationLifecycle =
  | 'draft'
  | 'framework_review'
  | 'expert_review'
  | 'approved_for_field_test'
  | 'superseded';

export type SpecificationUse =
  /** Real student assignment. Requires approval. */
  | 'field_test_administration'
  /** Modelling, planning, tests. Draft is fine. */
  | 'simulation'
  | 'bank_planning'
  | 'research_diagnostics';

export function mayAdministerSpecification(
  spec: { status: string; version: string; specificationId: string },
  use: SpecificationUse = 'field_test_administration'
): { allowed: boolean; reason: string } {
  if (use !== 'field_test_administration') {
    return { allowed: true, reason: '' };
  }
  if (spec.status === 'approved_for_field_test') {
    return { allowed: true, reason: '' };
  }
  return {
    allowed: false,
    reason: `Administration specification '${spec.specificationId}' has status '${spec.status}'. Only 'approved_for_field_test' may create a student assignment. Draft specifications remain available for simulation and planning.`,
  };
}

// ---------------------------------------------------------------------------
// §4 — Unresolved framework decisions must not become executable
// ---------------------------------------------------------------------------

/**
 * A blueprint hypothesis. May contain candidate alternatives and may be
 * simulated. Cannot be administered.
 */
export type ResearchBlueprintHypothesis = {
  kind: 'research_hypothesis';
  specification: PilotAdministrationSpecification;
  /** Constructs whose framework status is unresolved. Their presence
   *  is exactly why this cannot be executed. */
  unresolvedConstructs: string[];
};

/**
 * A blueprint derived FROM an approved framework version.
 *
 * Direction matters: the approved blueprint is generated from the
 * frozen framework, never the other way round. v0.57's draft
 * hardcoded domains — including ones governance still marks
 * unresolved — and would have let assessment code silently decide
 * questions that belong to framework review.
 */
export type ApprovedFieldTestBlueprint = {
  kind: 'approved_field_test';
  specification: PilotAdministrationSpecification;
  /** The frozen framework this was generated from. */
  frameworkVersion: string;
  approvedBy: string;
  approvedAt: string;
};

export type BlueprintForUse =
  | ResearchBlueprintHypothesis
  | ApprovedFieldTestBlueprint;

export function isExecutableBlueprint(
  b: BlueprintForUse
): b is ApprovedFieldTestBlueprint {
  return b.kind === 'approved_field_test';
}

/**
 * Build a research hypothesis, recording which constructs remain open.
 *
 * Domains belonging to unresolved constructs are flagged rather than
 * quietly stripped: silently dropping RAT would change the blueprint's
 * meaning without anyone noticing.
 */
export function researchBlueprint(
  specification: PilotAdministrationSpecification,
  unresolvedConstructs: string[]
): ResearchBlueprintHypothesis {
  return { kind: 'research_hypothesis', specification, unresolvedConstructs };
}

// ---------------------------------------------------------------------------
// The authorization result
// ---------------------------------------------------------------------------

export type PilotFrameworkAuthorization = {
  authorized: boolean;
  frameworkStatus: string;
  humanReviewStatus: string;
  evidenceStatus: string;
  /** Non-technical, for a teacher. */
  teacherMessage: string;
  /** Precise, for Admin & Research. */
  adminBlockers: string[];
  /** The frozen framework version, when authorized. */
  frameworkVersion: string | null;
};

export const TEACHER_FRAMEWORK_NOT_READY =
  'The assessment framework has not been finalised yet, so a pilot form cannot be created.';

/**
 * Evaluate the upstream chain: evidence → human review → framework.
 *
 * Returns `authorized: false` today, and will until real sources are
 * inspected and real reviewers complete the workflow.
 */
export function authorizePilotFramework(args: {
  reviews: DecisionReview[];
  adjudications: Adjudication[];
  frameworkVersion: string;
  sources?: RequiredSource[];
  records?: SourceInspectionRecord[];
}): PilotFrameworkAuthorization {
  const gate = evaluateFrameworkGate(args);

  const authorized = gate.frameworkStatus === 'approved_for_pilot';

  return {
    authorized,
    frameworkStatus: gate.frameworkStatus,
    humanReviewStatus: gate.humanReview,
    evidenceStatus: gate.evidence.status,
    teacherMessage: authorized ? '' : TEACHER_FRAMEWORK_NOT_READY,
    adminBlockers: gate.blockers,
    frameworkVersion: authorized ? args.frameworkVersion : null,
  };
}
