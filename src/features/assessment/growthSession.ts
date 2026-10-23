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

/**
 * v0.57 §8 — accessibility supports.
 *
 * v0.56 had TWO models: a four-value `Accommodation` enum used by the
 * real UI, and the canonical categorised model in
 * assessmentGovernance.ts used only by tests. The UI model also carried
 * a blanket claim that an accommodated sitting "may not be directly
 * comparable" — over-cautious for magnification, under-cautious for a
 * calculator on a computation item.
 *
 * The canonical model is now the only one. `Accommodation` is retained
 * as a deprecated alias so stored sessions keep loading.
 */
export type { AccessibilitySupport, ComparabilityStatus, SupportCategory }
  from './assessmentGovernance';

/** @deprecated Use AccessibilitySupport ids from ACCESSIBILITY_SUPPORTS. */
export type Accommodation =
  | 'extended_time'
  | 'text_to_speech'
  | 'larger_text'
  | 'separate_room';

/** @deprecated Retained so pre-v0.57 stored sessions still render. */
export const ACCOMMODATION_LABELS: Record<Accommodation, string> = {
  extended_time: 'Extended time',
  text_to_speech: 'Read aloud',
  larger_text: 'Larger text',
  separate_room: 'Separate room',
};

/** What a formal session records about the supports used. */
export type SessionSupportRecord = {
  supportId: string;
  category: string;
  /** Comparability AT ADMINISTRATION TIME — the classification may
   *  change later as evidence accumulates, and a past session must
   *  still be interpretable under the rules that applied then. */
  comparabilityAtAdministration: string;
  assessmentSpecificationVersion: string;
};

/** Teacher-facing wording. Deliberately makes no blanket claim. */
export const SUPPORTS_EXPLANATION =
  'Supports are recorded with the session. Some are designed to remove access barriers without changing what is measured; others may require separate interpretation.';

/**
 * @deprecated v0.61 §3 — LEGACY. The formal assessment path uses
 * `FormalGrowthAssignment` (see `formalAssignmentStore.ts`), which
 * carries the frozen form, framework/blueprint versions, frozen roster,
 * and support policy that formal administration requires.
 *
 * This shape is retained ONLY so that assignment records written by
 * v0.51–v0.57 builds remain typed when read back from localStorage.
 * It must never be imported by active formal UI — enforced by
 * `__tests__/formalUiArchitecture.test.ts`.
 */
export type LegacyGrowthAssignment = {
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
/** @deprecated v0.61 §3 — legacy record helper. */
export function isLegacyGrowthAssignmentActive(
  a: LegacyGrowthAssignment,
  now: number
): boolean {
  return now >= a.opensAt && now <= a.closesAt;
}

/** @deprecated v0.61 §3 — legacy record helper. */
export function activeLegacyAssignmentFor(
  assignments: LegacyGrowthAssignment[],
  classroomId: string | null,
  now: number
): LegacyGrowthAssignment | null {
  if (!classroomId) return null;
  return (
    assignments.find(
      (a) => a.classroomId === classroomId && isLegacyGrowthAssignmentActive(a, now)
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
/**
 * @deprecated v0.59 §15 — LEGACY. Superseded by
 * `prepareGrowthAdministration()`, which is the only authoritative
 * preparation route.
 *
 * This function checked far less than the tested architecture did, and
 * for one release it was what the product actually ran — that
 * divergence is the exact failure mode this rename exists to prevent.
 *
 * Retained ONLY so its historical behaviour stays under test. No
 * production formal-assessment module may import it; a test asserts
 * that.
 */
export function legacyBuildGrowthPoolForCompatibilityOnly(args: {
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

/**
 * v0.52 §6 — how far a report may go in interpreting a domain.
 *
 * v0.51 had `MIN_ITEMS_FOR_DOMAIN_COMMENT = 4` and a
 * `sufficientForComment` flag. Four was invented. There is no evidence
 * that four items support reliable domain interpretation — that is
 * precisely the kind of unearned threshold this project exists to
 * avoid, and a `true` on that flag would have licensed a strength
 * claim downstream.
 *
 * The flag is replaced by a state that is currently constant:
 *
 *   observed_counts_only          — report what happened. Nothing more.
 *   interpretable_domain_estimate — reserved. Unreachable until
 *                                   calibration and precision evidence
 *                                   exist for the domain.
 */
export type DomainReportingState =
  | 'observed_counts_only'
  | 'interpretable_domain_estimate';

export type DomainEvidence = {
  domainId: string;
  domainTitle: string;
  itemsAdministered: number;
  correctResponses: number;
  /** Always 'observed_counts_only' today. */
  reportingState: DomainReportingState;
  /** The only sentence a report may currently make about this domain.
   *  Descriptive by construction: it states counts, never a judgement. */
  descriptiveSummary: string;
};

/**
 * Whether a domain estimate may be interpreted.
 *
 * Returns false unconditionally. Interpretation requires calibrated
 * items and a conditional standard error for the domain, neither of
 * which exists. The function is the single place that changes when
 * they do.
 */
export function mayInterpretDomain(): boolean {
  return false;
}

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
      reportingState: mayInterpretDomain()
        ? ('interpretable_domain_estimate' as const)
        : ('observed_counts_only' as const),
      // "4 of 5 sampled Fractions questions were answered correctly."
      // NOT "Fractions is a strength."
      descriptiveSummary: `${d.correct} of ${d.administered} sampled ${d.domainTitle} question${d.administered === 1 ? '' : 's'} answered correctly.`,
    })),
    reportStatus: REPORT_STATUS_LINE,
    limitations: [
      'This is not a calibrated assessment. The questions have not been field tested or analysed.',
      'No score, percentile, grade equivalent, or growth measure can be reported.',
      'Domain figures are counts of what was sampled. They are not estimates of strength or weakness, and a higher count in one domain than another is not evidence of a difference.',
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
