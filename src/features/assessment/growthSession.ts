// v0.51 §6 + §7 + §8 — Pragati Growth sessions.
//
// WHAT MAKES A GROWTH SESSION DIFFERENT
//
// Not the UI. The rules. A Growth session:
//
//   - draws ONLY from the secure pool (growth_field_test /
//     growth_operational);
//   - locks instructional navigation for its duration;
//   - shows no hints, worked examples, or correctness feedback;
//   - records exposure for every item administered;
//   - reports only what the evidence supports.
//
// Practice sessions do none of these things, and that is correct —
// they make no measurement claim.
//
// This module is the single place those rules live, so a future screen
// cannot accidentally relax one.

import type { Item } from '../../data/items';
import { itemsFor, findLeakedSecureItems, recordExposure, type ExposureLog } from './itemUse';
import { requireSpecification, type SpecLookup } from './itemSpecification';
import type { AbilityEstimate } from './AssessmentRouter';

export type GrowthWindow = 'beginning_of_year' | 'mid_year' | 'end_of_year';

export const GROWTH_WINDOW_LABELS: Record<GrowthWindow, string> = {
  beginning_of_year: 'Beginning of year',
  mid_year: 'Mid year',
  end_of_year: 'End of year',
};

/** Accommodations recorded on the session. An accommodated
 *  administration may not be comparable to a standard one, so this is
 *  data, not a display setting. */
export type Accommodation =
  | 'extended_time'
  | 'text_to_speech'
  | 'larger_text'
  | 'separate_room';

export const ACCOMMODATION_LABELS: Record<Accommodation, string> = {
  extended_time: 'Extended time',
  text_to_speech: 'Read aloud',
  larger_text: 'Larger text',
  separate_room: 'Separate room',
};

export type GrowthAssignment = {
  id: string;
  classroomId: string;
  /** Which assessment. One today; named so more can exist. */
  assessmentId: 'pragati_growth_mathematics';
  window: GrowthWindow;
  opensAt: number;
  closesAt: number;
  accommodationsByStudentId: Record<string, Accommodation[]>;
  createdAt: number;
};

/** Is this assignment live for a student right now? Drives whether
 *  Home shows the Growth Check card — nothing else. */
export function isGrowthAssignmentActive(
  a: GrowthAssignment,
  now: number
): boolean {
  return now >= a.opensAt && now <= a.closesAt;
}

export function activeAssignmentFor(
  assignments: GrowthAssignment[],
  classroomId: string | null,
  now: number
): GrowthAssignment | null {
  if (!classroomId) return null;
  return (
    assignments.find(
      (a) => a.classroomId === classroomId && isGrowthAssignmentActive(a, now)
    ) ?? null
  );
}

// ---------------------------------------------------------------------------
// Building a Growth session
// ---------------------------------------------------------------------------

export type GrowthPoolResult =
  | { ok: true; pool: Item[] }
  | { ok: false; reason: string; detail: string[] };

/**
 * Assemble a Growth pool.
 *
 * Refuses on ANY of: no secure items, an item without a valid
 * specification, or a leaked instructional item. There is no partial
 * success — a compromised pool is not a smaller valid pool, it is an
 * invalid one.
 */
export function buildGrowthPool(args: {
  items: Item[];
  lookup: SpecLookup;
  targetLength: number;
}): GrowthPoolResult {
  const { items, lookup, targetLength } = args;

  const secure = itemsFor(items, 'growth');
  if (secure.length === 0) {
    return {
      ok: false,
      reason:
        'No Growth items are available. Pragati has no authored Growth item bank yet.',
      detail: [
        'Item specifications exist for the Rational Number strand, but no items have been authored from them.',
        'See docs/PRAGATI_GROWTH_ASSESSMENT_SPEC.md.',
      ],
    };
  }

  // Every secure item must trace to a valid specification.
  const specErrors = secure.flatMap((i) => requireSpecification(i, lookup));
  if (specErrors.length > 0) {
    return {
      ok: false,
      reason: 'Growth items are missing valid specifications.',
      detail: specErrors,
    };
  }

  if (secure.length < targetLength) {
    return {
      ok: false,
      reason: 'The Growth item bank is too small for this assessment.',
      detail: [
        `Requested ${targetLength} items; ${secure.length} available.`,
      ],
    };
  }

  return { ok: true, pool: secure.slice(0, targetLength) };
}

/** Belt and braces: assert a pool about to be administered
 *  instructionally carries no secure item. */
export function assertNoLeak(pool: Item[], context: 'learn' | 'practice'): void {
  const leaked = findLeakedSecureItems(pool, context);
  if (leaked.length > 0) {
    throw new Error(
      `Growth item(s) leaked into ${context}: ${leaked.join(', ')}. This compromises the item bank permanently.`
    );
  }
}

// ---------------------------------------------------------------------------
// Administration rules
// ---------------------------------------------------------------------------

export type AdministrationRules = {
  allowInstructionalNavigation: boolean;
  allowHints: boolean;
  allowWorkedExamples: boolean;
  allowImmediateCorrectnessFeedback: boolean;
  recordExposure: boolean;
};

/** Growth. Restrictive by construction. */
export const GROWTH_RULES: AdministrationRules = {
  allowInstructionalNavigation: false,
  allowHints: false,
  allowWorkedExamples: false,
  allowImmediateCorrectnessFeedback: false,
  recordExposure: true,
};

/** Practice. Permissive, because it claims nothing. */
export const PRACTICE_RULES: AdministrationRules = {
  allowInstructionalNavigation: true,
  allowHints: true,
  allowWorkedExamples: true,
  allowImmediateCorrectnessFeedback: true,
  recordExposure: false,
};

export function rulesFor(purpose: string): AdministrationRules {
  return purpose === 'growth' ? GROWTH_RULES : PRACTICE_RULES;
}

/** Record every administered item. Called once per response. */
export function logGrowthExposure(
  log: ExposureLog,
  itemId: string,
  now: number
): ExposureLog {
  return recordExposure(log, itemId, 'growth', now);
}

// ---------------------------------------------------------------------------
// §19 — Reporting
// ---------------------------------------------------------------------------

export type DomainEvidence = {
  domainId: string;
  domainTitle: string;
  itemsAdministered: number;
  correctResponses: number;
  /** True only when enough items were administered to say anything at
   *  all about this domain. Below the threshold we report the counts
   *  and explicitly decline to characterise performance. */
  sufficientForComment: boolean;
};

/** Minimum items in a domain before any characterisation is offered. */
export const MIN_ITEMS_FOR_DOMAIN_COMMENT = 4;

export type GrowthReport = {
  administeredAt: number;
  completed: boolean;
  itemsAdministered: number;
  correctResponses: number;
  competenciesSampled: string[];
  domainEvidence: DomainEvidence[];
  /** Fixed wording. Teacher/report context only — never a student screen. */
  reportStatus: string;
  limitations: string[];
};

export const REPORT_STATUS_LINE =
  'Prototype diagnostic evidence — not yet psychometrically calibrated.';

/**
 * Build a report containing only defensible evidence.
 *
 * There is deliberately no `score`, `percentile`, `abilityEstimate`, or
 * `growth` field. Absent fields cannot be rendered by accident; a field
 * called `score` set to null eventually gets displayed as 0.
 */
export function buildGrowthReport(args: {
  administeredAt: number;
  completed: boolean;
  responses: Array<{ itemId: string; correct: boolean }>;
  competenciesSampled: string[];
  domainCounts: Array<{ domainId: string; domainTitle: string; administered: number; correct: number }>;
  /** Accepted for interface stability; deliberately NOT reported. */
  estimate?: AbilityEstimate;
}): GrowthReport {
  const { administeredAt, completed, responses, competenciesSampled, domainCounts } = args;

  return {
    administeredAt,
    completed,
    itemsAdministered: responses.length,
    correctResponses: responses.filter((r) => r.correct).length,
    competenciesSampled: [...competenciesSampled],
    domainEvidence: domainCounts.map((d) => ({
      domainId: d.domainId,
      domainTitle: d.domainTitle,
      itemsAdministered: d.administered,
      correctResponses: d.correct,
      sufficientForComment: d.administered >= MIN_ITEMS_FOR_DOMAIN_COMMENT,
    })),
    reportStatus: REPORT_STATUS_LINE,
    limitations: [
      'This is not a calibrated assessment. The questions have not been field tested or analysed.',
      'No score, percentile, grade equivalent, or growth measure can be reported.',
      'Results should not be used for placement, promotion, streaming, or selection.',
      completed
        ? 'The student completed the full set of questions.'
        : 'The student did not complete the full set, so the evidence below is partial.',
    ],
  };
}

/** Claims that must never appear in a Growth report. Asserted in tests
 *  against the rendered report object. */
export const FORBIDDEN_REPORT_CLAIMS = [
  'percentile',
  'national percentile',
  'grade equivalent',
  'grade level',
  'calibrated ability',
  'ability estimate',
  'RIT',
  'growth score',
  'mastery',
  'predicted',
  'projected',
  'norm',
] as const;
