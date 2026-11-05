// v0.51 §12/§3 — Pilot item specifications: Rational Number strand.
//
// A SMALL, DELIBERATE SET. Eight specifications spanning the strand
// from part-whole recognition to percentage relationships. The purpose
// is to prove the authoring system end to end, not to build a bank.
//
// Every specification here is `draft` with no reviewer, because none
// has been reviewed. That is not a placeholder to be tidied up later —
// it is the accurate state, and `validateSpecification` enforces that
// a review claim requires a named reviewer.
//
// None is `fieldTestEligible`, for the same reason.

import type { ItemSpecification } from './itemSpecification';

/** Shared defaults. Anything a specification does not deliberately
 *  vary is stated once here rather than copied eight times. */
const base = {
  subcompetencyId: null,
  progressionNodeId: null,
  intendedUse: 'growth_field_test' as const,
  distractorRationaleRequired: true,
  accessibilityRequirements: [
    'No meaning carried by colour alone.',
    'All visuals require a text alternative.',
    'Readable at 320px width.',
  ],
  reviewStatus: 'draft' as const,
  reviewedBy: [] as string[],
  fieldTestEligible: false,
  calibrationStatus: 'awaiting_field_test' as const,
  unitRequirements: null,
};

export const RATIONAL_NUMBER_SPECIFICATIONS: ItemSpecification[] = [
  {
    ...base,
    specificationId: 'SPEC.RAT.REPRESENT.01',
    competencyId: 'RAT.REPRESENT',
    gradeRange: { from: 'class4', to: 'class6' },
    evidenceStatement:
      'A correct response is evidence that the student can read a fraction from a partitioned region where the parts are equal.',
    knowledgeElicited:
      'Part-whole interpretation of a/b: the denominator names how many equal parts the whole is divided into, the numerator how many are taken.',
    incorrectResponseIndicates: [
      'May be counting shaded parts against unshaded parts rather than against the whole (part-part instead of part-whole).',
      'May not be checking that the parts are equal before applying fraction language.',
      'May be reversing numerator and denominator.',
    ],
    cognitiveDemand: 'conceptual_understanding',
    targetDifficultyBand: { min: 1, max: 3 },
    allowedRepresentations: ['area_model', 'set_model'],
    permittedFormats: ['single_select'],
    prohibitedShortcuts: [
      'The correct option must not be the only one whose denominator matches the visible number of parts.',
      'Distractors must not be eliminable by size alone without reading the diagram.',
    ],
    inappropriateCueing: [
      'Do not label the diagram with the fraction.',
      'Do not use a partition count that appears in only one option.',
    ],
    languageLoad: 'minimal',
    stimulusRequirements: [
      'One region or set, partitioned into 2-8 equal parts.',
      'Shaded portion clearly distinguishable without relying on hue.',
    ],
    visualRequirements: [
      'Parts must be visibly equal in area.',
      'Minimum 44px touch target per option.',
    ],
    calculatorPolicy: 'not_permitted',
    misconceptionTargets: [
      {
        code: 'part_part_confusion',
        description: 'Compares shaded parts to unshaded parts rather than to the whole.',
        distractorGuidance:
          'Include the shaded:unshaded ratio as a fraction, e.g. 2/3 when 2 of 5 are shaded.',
      },
      {
        code: 'numerator_denominator_reversal',
        description: 'Writes b/a instead of a/b.',
        distractorGuidance: 'Include the reversed fraction as an option.',
      },
    ],
    correctResponseRationale:
      'The student identifies the total number of equal parts as the denominator and the shaded count as the numerator.',
    scoringRule: 'Dichotomous: 1 for the correct option, 0 otherwise.',
    expectedResponseTimeSeconds: 45,
    sourceEvidence: [
      'Competency RAT.REPRESENT; Ganita Prakash Grade 6 Chapter 7 (secondary-source chapter list).',
    ],
  },
  {
    ...base,
    specificationId: 'SPEC.RAT.NUMBERLINE.01',
    competencyId: 'RAT.REPRESENT',
    gradeRange: { from: 'class5', to: 'class7' },
    evidenceStatement:
      'A correct response is evidence that the student can locate a fraction on a number line, treating the fraction as a magnitude rather than a pair of counts.',
    knowledgeElicited:
      'Measure interpretation of fractions: a/b is a point at distance a/b from zero, not two separate numbers.',
    incorrectResponseIndicates: [
      'May be counting tick marks rather than intervals — the classic off-by-one on a number line.',
      'May treat the fraction as two whole numbers rather than one magnitude.',
      'May assume the line always ends at 1.',
    ],
    cognitiveDemand: 'conceptual_understanding',
    targetDifficultyBand: { min: 3, max: 6 },
    allowedRepresentations: ['number_line'],
    permittedFormats: ['single_select'],
    prohibitedShortcuts: [
      'The line must not end at 1 in every item, or students learn to read the last tick as the whole.',
      'The correct point must not be the only labelled tick.',
    ],
    inappropriateCueing: [
      'Do not mark the answer position with a distinct colour or arrow.',
    ],
    languageLoad: 'minimal',
    stimulusRequirements: [
      'Number line with at least one endpoint labelled other than 0.',
      'Equal intervals; interval count not equal to the denominator in every item.',
    ],
    visualRequirements: [
      'Tick marks visually distinct from candidate points.',
      'Renders without horizontal scrolling at 320px.',
    ],
    calculatorPolicy: 'not_permitted',
    misconceptionTargets: [
      {
        code: 'tick_vs_interval',
        description: 'Counts tick marks instead of intervals.',
        distractorGuidance:
          'Place a distractor one interval away from the correct point.',
      },
      {
        code: 'line_ends_at_one',
        description: 'Assumes the right-hand end of the line is always 1.',
        distractorGuidance:
          'Use a line ending at 2 and include the point that would be correct if it ended at 1.',
      },
    ],
    correctResponseRationale:
      'The student determines the value of one interval and counts intervals from zero.',
    scoringRule: 'Dichotomous: 1 for the correct point, 0 otherwise.',
    expectedResponseTimeSeconds: 60,
    sourceEvidence: ['Competency RAT.REPRESENT.'],
  },
  {
    ...base,
    specificationId: 'SPEC.RAT.EQUIV.01',
    competencyId: 'RAT.EQUIV',
    gradeRange: { from: 'class5', to: 'class7' },
    evidenceStatement:
      'A correct response is evidence that the student can generate or recognise an equivalent fraction by multiplying or dividing numerator and denominator by the same non-zero number.',
    knowledgeElicited:
      'Equivalence as multiplicative structure, not as a memorised pair.',
    incorrectResponseIndicates: [
      'May be adding the same number to both parts instead of multiplying.',
      'May be scaling only one of numerator and denominator.',
    ],
    cognitiveDemand: 'procedural_fluency',
    targetDifficultyBand: { min: 3, max: 6 },
    allowedRepresentations: ['symbolic', 'area_model'],
    permittedFormats: ['single_select', 'fraction_entry'],
    prohibitedShortcuts: [
      'The correct option must not be the only one in lowest terms.',
      'Distractors must not be eliminable by parity alone.',
    ],
    inappropriateCueing: ['Do not show the scaling factor in the stem.'],
    languageLoad: 'minimal',
    stimulusRequirements: ['A fraction with denominator between 2 and 12.'],
    visualRequirements: [],
    calculatorPolicy: 'not_permitted',
    misconceptionTargets: [
      {
        code: 'additive_equivalence',
        description: 'Adds the same number to numerator and denominator.',
        distractorGuidance:
          'For 2/3, include 3/4 (added 1 to each) as a distractor.',
      },
      {
        code: 'one_sided_scaling',
        description: 'Scales only the numerator or only the denominator.',
        distractorGuidance: 'For 2/3, include 4/3 and 2/6.',
      },
    ],
    correctResponseRationale:
      'The student applies the same non-zero multiplier to both numerator and denominator.',
    scoringRule:
      'Dichotomous. For fraction_entry, any equivalent form is accepted unless the stem asks for lowest terms.',
    expectedResponseTimeSeconds: 45,
    sourceEvidence: [
      'Competency RAT.EQUIV; Ganita Prakash Grade 6 Chapter 7 (secondary-source chapter list).',
    ],
  },
  {
    ...base,
    specificationId: 'SPEC.RAT.COMPARE.01',
    competencyId: 'RAT.COMPARE',
    gradeRange: { from: 'class5', to: 'class8' },
    evidenceStatement:
      'A correct response is evidence that the student can order fractions with unlike denominators using magnitude reasoning.',
    knowledgeElicited:
      'Comparison via benchmarks, common denominators, or equivalence — not via numerator or denominator size alone.',
    incorrectResponseIndicates: [
      'May apply whole-number thinking: larger denominator means larger fraction.',
      'May compare numerators only.',
    ],
    cognitiveDemand: 'reasoning',
    targetDifficultyBand: { min: 4, max: 7 },
    allowedRepresentations: ['symbolic', 'number_line'],
    permittedFormats: ['single_select', 'ordering'],
    prohibitedShortcuts: [
      'Fractions must not be orderable by numerator alone.',
      'Fractions must not be orderable by denominator alone.',
      'Do not use a set where all denominators are already equal.',
    ],
    inappropriateCueing: ['Do not present the fractions in the correct order in the stem.'],
    languageLoad: 'minimal',
    stimulusRequirements: [
      'Three fractions with unlike denominators, at least two straddling 1/2.',
    ],
    visualRequirements: [],
    calculatorPolicy: 'not_permitted',
    misconceptionTargets: [
      {
        code: 'larger_denominator_larger',
        description: 'Applies whole-number ordering to denominators.',
        distractorGuidance:
          'Include the ordering produced by sorting denominators ascending.',
      },
      {
        code: 'numerator_only',
        description: 'Compares numerators and ignores denominators.',
        distractorGuidance: 'Include the ordering produced by numerator size.',
      },
    ],
    correctResponseRationale:
      'The student converts to a common basis or reasons from benchmarks such as 1/2 and 1.',
    scoringRule:
      'Dichotomous for single_select. Ordering format is authored but NOT administrable until an ordering scorer exists.',
    expectedResponseTimeSeconds: 75,
    sourceEvidence: ['Competency RAT.COMPARE.'],
  },
  {
    ...base,
    specificationId: 'SPEC.RAT.UNLIKE.01',
    competencyId: 'RAT.UNLIKE',
    gradeRange: { from: 'class6', to: 'class8' },
    evidenceStatement:
      'A correct response is evidence that the student can add or subtract fractions with unlike denominators.',
    knowledgeElicited:
      'Finding a common denominator and operating on numerators, with the meaning of the common unit intact.',
    incorrectResponseIndicates: [
      'May be adding numerators and denominators separately.',
      'May find a common denominator but forget to scale the numerators.',
    ],
    cognitiveDemand: 'procedural_fluency',
    targetDifficultyBand: { min: 4, max: 7 },
    allowedRepresentations: ['symbolic', 'area_model'],
    permittedFormats: ['single_select', 'fraction_entry'],
    prohibitedShortcuts: [
      'Denominators must not be equal.',
      'One denominator must not always be a multiple of the other.',
    ],
    inappropriateCueing: ['Do not state the common denominator in the stem.'],
    languageLoad: 'minimal',
    stimulusRequirements: ['Two proper fractions, denominators 2-12, unlike.'],
    visualRequirements: [],
    calculatorPolicy: 'not_permitted',
    misconceptionTargets: [
      {
        code: 'denominator_add',
        description: 'Adds numerators and denominators: a/b + c/d = (a+c)/(b+d).',
        distractorGuidance: 'Include (a+c)/(b+d) as a distractor.',
      },
      {
        code: 'unscaled_numerator',
        description: 'Uses the common denominator but leaves numerators unscaled.',
        distractorGuidance: 'Include (a+c)/lcm(b,d).',
      },
    ],
    correctResponseRationale:
      'The student rewrites both fractions over a common denominator and operates on the numerators.',
    scoringRule:
      'Dichotomous. Any form equal in value is accepted for fraction_entry unless lowest terms is requested.',
    expectedResponseTimeSeconds: 75,
    sourceEvidence: [
      'Competency RAT.UNLIKE; Ganita Prakash Grade 6 Chapter 7 (secondary-source chapter list).',
    ],
  },
  {
    ...base,
    specificationId: 'SPEC.RAT.DECIMAL.01',
    competencyId: 'RAT.DECIMAL',
    gradeRange: { from: 'class6', to: 'class8' },
    evidenceStatement:
      'A correct response is evidence that the student can connect a fraction to its decimal form and order across both representations.',
    knowledgeElicited:
      'Decimal place value as an extension of the same base-ten structure, and equivalence of the two notations.',
    incorrectResponseIndicates: [
      'May order decimals by digit count ("longer is larger").',
      'May not connect 1/4 and 0.25 as the same magnitude.',
    ],
    cognitiveDemand: 'conceptual_understanding',
    targetDifficultyBand: { min: 4, max: 7 },
    allowedRepresentations: ['symbolic', 'number_line'],
    permittedFormats: ['single_select', 'numeric_entry'],
    prohibitedShortcuts: [
      'Values must not be orderable by number of digits.',
      'Do not use only tenths.',
    ],
    inappropriateCueing: ['Do not present both forms of the same value in the stem.'],
    languageLoad: 'minimal',
    stimulusRequirements: [
      'A mixed set of at least one fraction and two decimals, values within 0-2.',
    ],
    visualRequirements: [],
    calculatorPolicy: 'not_permitted',
    misconceptionTargets: [
      {
        code: 'longer_decimal_larger',
        description: 'Treats 0.125 as larger than 0.3 because it has more digits.',
        distractorGuidance:
          'Include an ordering that sorts by digit count.',
      },
    ],
    correctResponseRationale:
      'The student converts to a common representation and compares magnitudes.',
    scoringRule: 'Dichotomous. Numeric entry accepts exact value only.',
    expectedResponseTimeSeconds: 60,
    sourceEvidence: [
      'Competency RAT.DECIMAL; Ganita Prakash Grade 7 Part 1 Chapter 3 (secondary-source chapter list).',
    ],
  },
  {
    ...base,
    specificationId: 'SPEC.RAT.RATIO.01',
    competencyId: 'RAT.RATIO',
    gradeRange: { from: 'class7', to: 'class9' },
    evidenceStatement:
      'A correct response is evidence that the student can express a situation as a ratio and distinguish multiplicative from additive comparison.',
    knowledgeElicited:
      'Ratio as a multiplicative relationship between quantities.',
    incorrectResponseIndicates: [
      'May compare by difference instead of by ratio.',
      'May reverse the order of the terms.',
    ],
    cognitiveDemand: 'application',
    targetDifficultyBand: { min: 4, max: 7 },
    allowedRepresentations: ['contextual_word', 'set_model', 'table'],
    permittedFormats: ['single_select'],
    prohibitedShortcuts: [
      'The context must not make the additive and multiplicative answers coincide.',
    ],
    inappropriateCueing: ['Do not use the word "ratio" alongside the correct option only.'],
    languageLoad: 'moderate',
    stimulusRequirements: [
      'A short context with two quantities; reading level at or below the lower grade in range.',
    ],
    visualRequirements: [],
    calculatorPolicy: 'not_permitted',
    misconceptionTargets: [
      {
        code: 'additive_comparison',
        description: 'Uses the difference between quantities rather than their ratio.',
        distractorGuidance: 'Include the difference expressed as a ratio-like pair.',
      },
      {
        code: 'reversed_terms',
        description: 'Writes b:a instead of a:b.',
        distractorGuidance: 'Include the reversed ratio.',
      },
    ],
    correctResponseRationale:
      'The student identifies the two quantities and expresses their multiplicative relationship in the stated order.',
    scoringRule: 'Dichotomous.',
    expectedResponseTimeSeconds: 75,
    sourceEvidence: ['Competency RAT.RATIO.'],
  },
  {
    ...base,
    specificationId: 'SPEC.RAT.PERCENT.01',
    competencyId: 'RAT.PERCENT',
    gradeRange: { from: 'class7', to: 'class10' },
    evidenceStatement:
      'A correct response is evidence that the student can apply a percentage as a rate per hundred to find a part, a whole, or a change.',
    knowledgeElicited:
      'Percentage as a proportional relationship, connected to fraction and decimal forms.',
    incorrectResponseIndicates: [
      'May treat percentage points and percentages as interchangeable.',
      'May apply the percentage to the wrong base after a change.',
    ],
    cognitiveDemand: 'application',
    targetDifficultyBand: { min: 5, max: 8 },
    allowedRepresentations: ['contextual_word', 'symbolic', 'table'],
    permittedFormats: ['single_select', 'numeric_entry'],
    prohibitedShortcuts: [
      'Do not use only 10%, 25%, or 50%, which are answerable by recall.',
      'The base must not be 100 in every item.',
    ],
    inappropriateCueing: ['Do not show the decimal equivalent in the stem.'],
    languageLoad: 'moderate',
    stimulusRequirements: ['A context with a stated base and percentage.'],
    visualRequirements: [],
    calculatorPolicy: 'not_permitted',
    misconceptionTargets: [
      {
        code: 'wrong_base_after_change',
        description:
          'Applies a percentage decrease to the new amount rather than the original.',
        distractorGuidance:
          'Include the value obtained by applying the rate to the changed amount.',
      },
    ],
    correctResponseRationale:
      'The student identifies the base and applies the rate per hundred to it.',
    scoringRule: 'Dichotomous. Numeric entry accepts the exact value.',
    expectedResponseTimeSeconds: 90,
    sourceEvidence: ['Competency RAT.PERCENT.'],
  },
];

const BY_ID = new Map(
  RATIONAL_NUMBER_SPECIFICATIONS.map((s) => [s.specificationId, s])
);

/** Specification lookup for `requireSpecification`. */
export function specificationById(id: string) {
  return BY_ID.get(id) ?? null;
}

export function specificationsForCompetency(competencyId: string) {
  return RATIONAL_NUMBER_SPECIFICATIONS.filter(
    (s) => s.competencyId === competencyId
  );
}
