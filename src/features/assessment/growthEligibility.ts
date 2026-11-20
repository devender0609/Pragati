// v0.52 §2 + §3 — Growth item eligibility.
//
// THE HOLE THIS CLOSES
//
// v0.51's `requireSpecification()` proved a secure item pointed at a
// syntactically valid specification. That is necessary and nowhere near
// sufficient. Under v0.51 an item could reach a field test with a
// DRAFT specification that nobody had reviewed, no content review, no
// language review, and no accessibility review — because none of those
// were checked anywhere.
//
// Eligibility is now a single authoritative function. Component code
// must never re-derive it: scattered checks drift, and the one that
// drifts is the one that lets a bad item through.
//
// FIELD TEST IS NOT OPERATIONAL
//
// v0.51 treated both secure uses as one `growth` context. They are
// different administrations with different purposes:
//
//   field test   — collects responses SO THAT items can be calibrated.
//                  Produces research evidence. Never an achievement
//                  result, because the instrument is what is being
//                  studied.
//   operational  — measures a student with calibrated items.
//                  Pragati cannot do this and will not be able to until
//                  the validation plan has actually been executed.

import type { ItemUse } from './itemUse';
import { isInstructionalUse, type ItemExposureRecord } from './itemUse';
import {
  validateSpecification,
  type ItemSpecification,
  type SpecLookup,
  isImplementedFormat,
} from './itemSpecification';

/** Administration contexts. v0.51's single `growth` is now two. */
export type GrowthContext = 'growth_field_test' | 'growth_operational';

/** Reviews an ITEM must pass, distinct from reviews of its
 *  specification. A sound specification does not make a particular
 *  item mathematically correct, readable, or accessible. */
export type ItemReviewKind =
  | 'mathematical_content'
  | 'curriculum_alignment'
  | 'language'
  | 'accessibility';

export const ITEM_REVIEW_LABELS: Record<ItemReviewKind, string> = {
  mathematical_content: 'Mathematical content review',
  curriculum_alignment: 'Curriculum / competency alignment review',
  language: 'Language review',
  accessibility: 'Accessibility review',
};

export type ItemLifecycleStatus =
  | 'authoring'
  | 'in_review'
  | 'approved_for_field_test'
  | 'in_field_test'
  | 'field_tested'
  | 'approved_for_operational'
  | 'suspended'
  | 'retired';

/** Calibration evidence. Every field is null until real analysis has
 *  been run — see docs/PSYCHOMETRIC_VALIDATION_PLAN.md. */
export type ItemCalibrationRecord = {
  calibrationVersion: string | null;
  isActiveCalibration: boolean;
  model: string | null;
  difficulty: number | null;
  discrimination: number | null;
  fitAcceptable: boolean | null;
  difReviewCompleted: boolean;
  difFlags: string[];
};

/** Assessment-side metadata attached to a Growth item. */
export type GrowthItemRecord = {
  itemId: string;
  use: ItemUse;
  specificationId: string | null;
  lifecycleStatus: ItemLifecycleStatus;
  completedReviews: ItemReviewKind[];
  calibration: ItemCalibrationRecord;
  /** Set when security is compromised — leak, over-exposure, publication. */
  securityFlags: string[];
  operationalApprovalBy: string | null;
};

export const REQUIRED_FIELD_TEST_REVIEWS: readonly ItemReviewKind[] = [
  'mathematical_content',
  'curriculum_alignment',
  'accessibility',
];

export type EligibilityResult = {
  eligible: boolean;
  context: GrowthContext;
  /** Every failed requirement, not just the first. An author fixing one
   *  problem at a time across four round-trips is how review fatigue
   *  starts. */
  reasons: string[];
};

/**
 * THE authoritative eligibility decision.
 *
 * Deny-by-default: an unrecognised state produces reasons, never
 * silent approval.
 */
export function evaluateGrowthItemEligibility(args: {
  record: GrowthItemRecord;
  context: GrowthContext;
  lookup: SpecLookup;
  exposure?: ItemExposureRecord;
}): EligibilityResult {
  const { record, context, lookup, exposure } = args;
  const reasons: string[] = [];
  const deny = (r: string) => reasons.push(r);

  // ---- Shared requirements -------------------------------------------

  if (record.use === 'retired' || record.lifecycleStatus === 'retired') {
    deny('Item is retired.');
  }
  if (record.lifecycleStatus === 'suspended') {
    deny('Item is suspended.');
  }
  if (isInstructionalUse(record.use)) {
    deny(
      `Item use '${record.use}' is instructional and can never be administered in a Growth context.`
    );
  }
  if (record.securityFlags.length > 0) {
    deny(`Security flags present: ${record.securityFlags.join(', ')}.`);
  }
  // Instructional exposure is permanent disqualification: the response
  // would measure recall of a previous encounter.
  if ((exposure?.instructionalAdministrations ?? 0) > 0) {
    deny(
      'Item has instructional exposure recorded; it is permanently ineligible for Growth use.'
    );
  }

  // ---- Specification --------------------------------------------------

  let spec: ItemSpecification | null = null;
  if (!record.specificationId) {
    deny('No ItemSpecification is referenced.');
  } else {
    spec = lookup(record.specificationId);
    if (!spec) {
      deny(`ItemSpecification '${record.specificationId}' does not resolve.`);
    } else {
      const specErrors = validateSpecification(spec);
      if (specErrors.length > 0) {
        deny(`ItemSpecification is invalid: ${specErrors.join('; ')}`);
      }
      if (spec.intendedUse !== record.use) {
        deny(
          `ItemSpecification intendedUse '${spec.intendedUse}' does not match item use '${record.use}'.`
        );
      }
      // The v0.51 hole, stated explicitly.
      if (spec.reviewStatus === 'draft' || spec.reviewStatus === 'peer_reviewed') {
        deny(
          `ItemSpecification review status is '${spec.reviewStatus}'; expert review is required before any Growth administration.`
        );
      }
      if (!spec.fieldTestEligible) {
        deny('ItemSpecification is not marked fieldTestEligible.');
      }
      if (!spec.permittedFormats.some(isImplementedFormat)) {
        deny('No permitted format of this specification has a scorer.');
      }
    }
  }

  // ---- Item-level reviews ---------------------------------------------

  for (const kind of REQUIRED_FIELD_TEST_REVIEWS) {
    if (!record.completedReviews.includes(kind)) {
      deny(`${ITEM_REVIEW_LABELS[kind]} has not been completed.`);
    }
  }
  // Language review is required when the specification carries real
  // reading load; a symbolic item does not need it.
  if (spec && spec.languageLoad !== 'minimal') {
    if (!record.completedReviews.includes('language')) {
      deny(
        `${ITEM_REVIEW_LABELS.language} has not been completed (specification language load is '${spec.languageLoad}').`
      );
    }
  }

  // ---- Context-specific ------------------------------------------------

  if (context === 'growth_field_test') {
    if (record.use !== 'growth_field_test') {
      deny(
        `Item use '${record.use}' cannot enter a field-test administration; field tests admit only 'growth_field_test' items.`
      );
    }
    if (
      record.lifecycleStatus !== 'approved_for_field_test' &&
      record.lifecycleStatus !== 'in_field_test'
    ) {
      deny(
        `Item lifecycle status '${record.lifecycleStatus}' does not permit field testing.`
      );
    }
  } else {
    // Operational.
    if (record.use !== 'growth_operational') {
      deny(
        `Item use '${record.use}' cannot enter an operational Growth administration.`
      );
    }
    if (
      record.lifecycleStatus !== 'field_tested' &&
      record.lifecycleStatus !== 'approved_for_operational'
    ) {
      deny(
        `Item has not completed field testing (status '${record.lifecycleStatus}').`
      );
    }
    const c = record.calibration;
    if (!c.calibrationVersion) deny('No calibration version recorded.');
    if (!c.isActiveCalibration) deny('Calibration is not the active version.');
    if (c.difficulty === null) deny('No calibrated difficulty parameter.');
    if (c.fitAcceptable !== true) deny('Item fit has not been accepted.');
    if (!c.difReviewCompleted) deny('Fairness / DIF review has not been completed.');
    if (c.difFlags.length > 0) {
      deny(`Unresolved DIF flags: ${c.difFlags.join(', ')}.`);
    }
    if (!record.operationalApprovalBy) deny('No operational approval recorded.');
  }

  return { eligible: reasons.length === 0, context, reasons };
}

/** Filter a bank to the items eligible for a context. */
export function eligibleItemsFor(args: {
  records: GrowthItemRecord[];
  context: GrowthContext;
  lookup: SpecLookup;
  exposureLog?: Record<string, ItemExposureRecord>;
}): { eligible: GrowthItemRecord[]; rejected: Array<{ itemId: string; reasons: string[] }> } {
  const { records, context, lookup, exposureLog = {} } = args;
  const eligible: GrowthItemRecord[] = [];
  const rejected: Array<{ itemId: string; reasons: string[] }> = [];
  for (const record of records) {
    const r = evaluateGrowthItemEligibility({
      record, context, lookup, exposure: exposureLog[record.itemId],
    });
    if (r.eligible) eligible.push(record);
    else rejected.push({ itemId: record.itemId, reasons: r.reasons });
  }
  return { eligible, rejected };
}

/**
 * Whether Pragati supports a context at all.
 *
 * Operational Growth is disabled at the product level, not merely
 * unpopulated: there is no calibration pipeline output, so no item
 * could pass the gate above even if one were marked operational.
 */
export function contextSupported(context: GrowthContext): {
  supported: boolean;
  reason: string;
} {
  if (context === 'growth_operational') {
    return {
      supported: false,
      reason:
        'Operational Growth administration is disabled. It requires calibrated items, and Pragati has completed no field test or calibration. See docs/PSYCHOMETRIC_VALIDATION_PLAN.md.',
    };
  }
  return { supported: true, reason: '' };
}

/** An empty calibration record — the honest default. */
export const NO_CALIBRATION: ItemCalibrationRecord = {
  calibrationVersion: null,
  isActiveCalibration: false,
  model: null,
  difficulty: null,
  discrimination: null,
  fitAcceptable: null,
  difReviewCompleted: false,
  difFlags: [],
};
