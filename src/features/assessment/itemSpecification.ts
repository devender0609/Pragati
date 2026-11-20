// v0.51 §12 — Item specifications.
//
// WHY SPECIFICATIONS COME BEFORE ITEMS
//
// If you author items first and describe them afterwards, the test
// measures whatever the items happened to contain. The specification
// is the claim ("a correct response here is evidence of X"); the item
// is one attempt to elicit it. Writing the claim first is what makes
// the evidence argument reviewable — and what lets several genuinely
// different items be written from one specification without drifting
// apart in what they measure.
//
// FOUR THINGS THAT ARE NOT THE SAME
//
//   Competency        what a student can do. Stable across textbooks.
//   ItemSpecification the rules for writing an item that elicits
//                     evidence of one competency at one difficulty band.
//   Item              a concrete question authored from a specification.
//   Blueprint         how many items from which domains make a test.
//
// v0.50 conflated all four inside "ChapterBlueprint". They are separate
// here, and the types do not interchange.
//
// THE GATE
//
// A Growth item without a valid specification reference cannot be
// administered. `requireSpecification()` enforces it and the tests
// prove the enforcement.

import type { Grade } from '../../types';
import type { ItemUse } from './itemUse';

export type CognitiveDemand =
  | 'recall'
  | 'procedural_fluency'
  | 'conceptual_understanding'
  | 'application'
  | 'reasoning';

export type RepresentationType =
  | 'symbolic'
  | 'area_model'
  | 'set_model'
  | 'number_line'
  | 'table'
  | 'graph'
  | 'contextual_word'
  | 'diagram';

export type ItemFormat =
  // Implemented in v0.51.
  | 'single_select'
  | 'numeric_entry'
  | 'fraction_entry'
  // Declared for future work. Authoring against these is allowed;
  // ADMINISTERING them is refused until a scorer exists.
  | 'multi_select'
  | 'ordering'
  | 'matching'
  | 'number_line_response'
  | 'graph_response'
  | 'coordinate_response'
  | 'interactive_geometry'
  | 'constructed_response';

/** Formats with a real, defensible scorer today. */
export const IMPLEMENTED_FORMATS: readonly ItemFormat[] = [
  'single_select',
  'numeric_entry',
  'fraction_entry',
];

export function isImplementedFormat(f: ItemFormat): boolean {
  return IMPLEMENTED_FORMATS.includes(f);
}

export type LanguageLoad = 'minimal' | 'moderate' | 'high';
export type CalculatorPolicy = 'not_permitted' | 'permitted' | 'required';

export type SpecificationReviewStatus =
  | 'draft'
  | 'peer_reviewed'
  | 'expert_reviewed'
  | 'approved_for_authoring';

export type SpecificationCalibrationStatus =
  | 'not_applicable'
  | 'awaiting_field_test'
  | 'field_tested'
  | 'calibrated';

export type MisconceptionTarget = {
  code: string;
  description: string;
  /** How a distractor should embody it, so the wrong answer is
   *  diagnostic rather than merely wrong. */
  distractorGuidance: string;
};

export type ItemSpecification = {
  specificationId: string;
  competencyId: string;
  subcompetencyId: string | null;
  progressionNodeId: string | null;
  gradeRange: { from: Grade; to: Grade };
  /** What this specification's items are FOR. A specification written
   *  for Growth may not be used to author a practice item and vice
   *  versa — the security rules differ. */
  intendedUse: ItemUse;

  /** The measurement claim. "A correct response is evidence that…" */
  evidenceStatement: string;
  /** The mathematics actually being elicited. */
  knowledgeElicited: string;
  /** What an INCORRECT response may indicate. Forces the author to
   *  think about diagnosis, not just right/wrong. */
  incorrectResponseIndicates: string[];

  cognitiveDemand: CognitiveDemand;
  /** Author-intended band on the internal 1–10 ladder. NOT an
   *  empirical parameter — see PSYCHOMETRIC_VALIDATION_PLAN.md. */
  targetDifficultyBand: { min: number; max: number };

  allowedRepresentations: RepresentationType[];
  permittedFormats: ItemFormat[];
  /** Routes to the answer that bypass the intended reasoning. An item
   *  that can be solved by elimination or by reading the diagram
   *  without doing the mathematics does not measure the competency. */
  prohibitedShortcuts: string[];
  /** Cueing that would give the answer away. */
  inappropriateCueing: string[];

  languageLoad: LanguageLoad;
  stimulusRequirements: string[];
  visualRequirements: string[];
  calculatorPolicy: CalculatorPolicy;
  unitRequirements: string | null;

  misconceptionTargets: MisconceptionTarget[];
  distractorRationaleRequired: boolean;
  correctResponseRationale: string;

  scoringRule: string;
  accessibilityRequirements: string[];
  expectedResponseTimeSeconds: number;

  reviewStatus: SpecificationReviewStatus;
  reviewedBy: string[];
  sourceEvidence: string[];
  fieldTestEligible: boolean;
  calibrationStatus: SpecificationCalibrationStatus;
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate a specification. Returns human-readable errors.
 *
 * The rules encode the things that, if skipped, quietly produce a bad
 * item bank: unstated evidence claims, difficulty bands that mean
 * nothing, distractors with no rationale, and — most importantly —
 * review status claimed without a reviewer.
 */
export function validateSpecification(spec: ItemSpecification): string[] {
  const e: string[] = [];
  const at = (m: string) => `${spec.specificationId}: ${m}`;

  if (!spec.specificationId.trim()) e.push('specificationId is empty');
  if (!spec.competencyId.trim()) e.push(at('competencyId is required'));

  if (!spec.evidenceStatement.trim()) {
    e.push(at('evidenceStatement is required — an item with no stated claim cannot be reviewed'));
  }
  if (!spec.knowledgeElicited.trim()) {
    e.push(at('knowledgeElicited is required'));
  }
  if (spec.incorrectResponseIndicates.length === 0) {
    e.push(at('incorrectResponseIndicates is empty — a wrong answer should be diagnostic'));
  }

  const { min, max } = spec.targetDifficultyBand;
  if (min < 1 || max > 10 || min > max) {
    e.push(at(`targetDifficultyBand ${min}-${max} is outside 1-10 or inverted`));
  }

  if (spec.permittedFormats.length === 0) {
    e.push(at('permittedFormats is empty'));
  }
  if (spec.allowedRepresentations.length === 0) {
    e.push(at('allowedRepresentations is empty'));
  }
  if (spec.prohibitedShortcuts.length === 0) {
    e.push(at('prohibitedShortcuts is empty — state at least one way the item must NOT be solvable'));
  }
  if (!spec.correctResponseRationale.trim()) {
    e.push(at('correctResponseRationale is required'));
  }
  if (!spec.scoringRule.trim()) {
    e.push(at('scoringRule is required'));
  }
  if (spec.expectedResponseTimeSeconds <= 0) {
    e.push(at('expectedResponseTimeSeconds must be positive'));
  }

  // Distractor rationale is only meaningful for select formats.
  const hasSelect = spec.permittedFormats.some(
    (f) => f === 'single_select' || f === 'multi_select'
  );
  if (hasSelect && !spec.distractorRationaleRequired) {
    e.push(at('select-format specifications must require distractor rationales'));
  }
  if (hasSelect && spec.misconceptionTargets.length === 0) {
    e.push(at('select-format specifications must name at least one misconception target'));
  }
  for (const m of spec.misconceptionTargets) {
    if (!m.distractorGuidance.trim()) {
      e.push(at(`misconception ${m.code} has no distractorGuidance`));
    }
  }

  // Review claims must carry a reviewer. Same rule as curriculum
  // verification: a status string is not evidence.
  if (spec.reviewStatus !== 'draft' && spec.reviewedBy.length === 0) {
    e.push(at(`reviewStatus '${spec.reviewStatus}' claims review but reviewedBy is empty`));
  }

  // Field-test eligibility requires expert review and an implemented
  // format — you cannot field-test what cannot be scored.
  if (spec.fieldTestEligible) {
    if (spec.reviewStatus !== 'expert_reviewed' && spec.reviewStatus !== 'approved_for_authoring') {
      e.push(at('fieldTestEligible requires expert review'));
    }
    if (!spec.permittedFormats.some(isImplementedFormat)) {
      e.push(at('fieldTestEligible but no permitted format has a scorer'));
    }
  }

  if (spec.calibrationStatus === 'calibrated') {
    e.push(at('calibrationStatus cannot be "calibrated": Pragati has no calibration data. See docs/PSYCHOMETRIC_VALIDATION_PLAN.md'));
  }

  const from = Number(spec.gradeRange.from.replace('class', ''));
  const to = Number(spec.gradeRange.to.replace('class', ''));
  if (from > to) e.push(at('gradeRange is inverted'));

  return e;
}

// ---------------------------------------------------------------------------
// The authoring gate
// ---------------------------------------------------------------------------

export type SpecLookup = (id: string) => ItemSpecification | null;

/**
 * A Growth item may not exist without a valid specification.
 *
 * Applied to items whose `use` is secure. Instructional items are
 * exempt: practice questions predate this system and requiring
 * retrospective specifications for the whole existing bank would be
 * busywork with no measurement benefit.
 */
export function requireSpecification(
  item: { id: string; use?: string; specificationId?: string },
  lookup: SpecLookup
): string[] {
  const use = item.use;
  const isSecure = use === 'growth_field_test' || use === 'growth_operational';
  if (!isSecure) return [];

  if (!item.specificationId) {
    return [
      `${item.id}: Growth items require a specificationId. Author the ItemSpecification first.`,
    ];
  }
  const spec = lookup(item.specificationId);
  if (!spec) {
    return [`${item.id}: specificationId '${item.specificationId}' does not resolve.`];
  }
  const specErrors = validateSpecification(spec);
  if (specErrors.length > 0) {
    return [`${item.id}: its specification is invalid — ${specErrors.join('; ')}`];
  }
  if (spec.intendedUse !== use) {
    return [
      `${item.id}: specification intendedUse '${spec.intendedUse}' does not match item use '${use}'.`,
    ];
  }
  return [];
}

/** Validate a whole bank at once. Used as a content-validation test. */
export function validateItemBank(
  items: Array<{ id: string; use?: string; specificationId?: string }>,
  lookup: SpecLookup
): string[] {
  return items.flatMap((i) => requireSpecification(i, lookup));
}
