// v0.51 §13 — Item use classification and bank separation.
//
// WHY THIS IS NON-NEGOTIABLE
//
// A formal assessment is only as trustworthy as its item security. If a
// student can meet an operational Growth item during Learn or Practice,
// their Growth response measures recall of that encounter, not the
// competency. Once leaked, an item is permanently compromised — you
// cannot un-see a question — and any future calibration built on it is
// invalid.
//
// So this module does not "prefer" separation. It enforces it, and the
// tests prove the enforcement rather than trusting call sites.
//
// THE MODEL
//
// Every item carries a `use` classification. There are two disjoint
// worlds:
//
//   INSTRUCTIONAL  learning_example, guided_practice,
//                  independent_practice, classroom_check
//   SECURE         growth_field_test, growth_operational
//
// plus `retired`, which belongs to neither and may be administered
// nowhere.
//
// Promotion is one-way and manual: an instructional item may never
// become an operational Growth item automatically, because its
// exposure history is unknown and unbounded.

import type { Item } from '../../data/items';

export type ItemUse =
  | 'learning_example'
  | 'guided_practice'
  | 'independent_practice'
  | 'classroom_check'
  | 'growth_field_test'
  | 'growth_operational'
  | 'retired';

export const ITEM_USE_LABELS: Record<ItemUse, string> = {
  learning_example: 'Worked example (instructional)',
  guided_practice: 'Guided practice',
  independent_practice: 'Independent practice',
  classroom_check: 'Classroom check',
  growth_field_test: 'Growth — field test',
  growth_operational: 'Growth — operational',
  retired: 'Retired',
};

/** Uses that may appear in Learn and Practice. */
export const INSTRUCTIONAL_USES: readonly ItemUse[] = [
  'learning_example',
  'guided_practice',
  'independent_practice',
  'classroom_check',
];

/** Uses reserved for formal Growth administration. Never instructional. */
export const SECURE_USES: readonly ItemUse[] = [
  'growth_field_test',
  'growth_operational',
];

export function isSecureUse(use: ItemUse): boolean {
  return SECURE_USES.includes(use);
}

export function isInstructionalUse(use: ItemUse): boolean {
  return INSTRUCTIONAL_USES.includes(use);
}

/**
 * The `use` of an item.
 *
 * Every item authored before v0.51 predates this field. They were all
 * written for practice and have been shown to students, so the ONLY
 * safe default is instructional. Defaulting the other way would
 * silently promote the entire existing bank into the secure pool.
 */
export function useOf(item: Item): ItemUse {
  const declared = (item as { use?: string }).use;
  if (declared && (ITEM_USE_LABELS as Record<string, string>)[declared]) {
    return declared as ItemUse;
  }
  return 'independent_practice';
}

/** Context an item is about to be administered in. */
export type AdministrationContext =
  | 'learn'
  | 'practice'
  | 'classroom_check'
  | 'growth';

/**
 * The single authority on whether an item may be shown.
 *
 * Deliberately written as an allow-list: a `use` value nobody has
 * thought about yet is refused rather than permitted.
 */
export function mayAdminister(
  use: ItemUse,
  context: AdministrationContext
): boolean {
  if (use === 'retired') return false;
  if (context === 'growth') return isSecureUse(use);
  // learn / practice / classroom_check are instructional contexts.
  return isInstructionalUse(use);
}

/**
 * Filter a pool for a context. This is the function every launcher must
 * call — not an ad-hoc `.filter()` at the call site, because that is
 * how leaks happen.
 */
export function itemsFor(
  items: Item[],
  context: AdministrationContext
): Item[] {
  return items.filter((i) => mayAdminister(useOf(i), context));
}

/**
 * Assert no secure item is present in an instructional pool.
 *
 * Returns the offending item IDs. Callers in dev/test treat a non-empty
 * result as a hard failure; in production the pool is filtered instead,
 * so a bug degrades the session rather than compromising the bank.
 */
export function findLeakedSecureItems(
  items: Item[],
  context: AdministrationContext
): string[] {
  if (context === 'growth') return [];
  return items.filter((i) => isSecureUse(useOf(i))).map((i) => i.id);
}

// ---------------------------------------------------------------------------
// Exposure
// ---------------------------------------------------------------------------
//
// Exposure is recorded per item so that (a) over-exposed items can be
// rested or retired, and (b) a future calibration knows how much
// contamination each item carries. Stored separately from the item
// bank, which is static content.

export type ItemExposureRecord = {
  itemId: string;
  /** Times administered in a formal Growth session. */
  growthAdministrations: number;
  /** Times administered anywhere instructional. */
  instructionalAdministrations: number;
  lastAdministeredAt: number | null;
};

export type ExposureLog = Record<string, ItemExposureRecord>;

export function recordExposure(
  log: ExposureLog,
  itemId: string,
  context: AdministrationContext,
  now: number
): ExposureLog {
  const prev: ItemExposureRecord = log[itemId] ?? {
    itemId,
    growthAdministrations: 0,
    instructionalAdministrations: 0,
    lastAdministeredAt: null,
  };
  return {
    ...log,
    [itemId]: {
      ...prev,
      growthAdministrations:
        prev.growthAdministrations + (context === 'growth' ? 1 : 0),
      instructionalAdministrations:
        prev.instructionalAdministrations + (context === 'growth' ? 0 : 1),
      lastAdministeredAt: now,
    },
  };
}

/**
 * Whether an instructional item could ever be promoted to operational
 * Growth use.
 *
 * The answer is always NO for an item with instructional exposure. This
 * function exists to make that rule explicit and testable, not to
 * provide a promotion path.
 */
export function mayPromoteToOperational(
  use: ItemUse,
  exposure: ItemExposureRecord | undefined
): { allowed: false; reason: string } {
  if (isInstructionalUse(use)) {
    return {
      allowed: false,
      reason:
        'Instructional items cannot be promoted to operational Growth use: their exposure is unbounded and unrecorded, so responses would measure recall rather than competency.',
    };
  }
  if (use === 'growth_field_test') {
    return {
      allowed: false,
      reason:
        'Field-test items become operational only after calibration, which requires empirical data Pragati does not yet have. See docs/PSYCHOMETRIC_VALIDATION_PLAN.md.',
    };
  }
  if ((exposure?.instructionalAdministrations ?? 0) > 0) {
    return {
      allowed: false,
      reason:
        'This item has instructional exposure recorded and is permanently ineligible for operational Growth use.',
    };
  }
  return {
    allowed: false,
    reason:
      'Automatic promotion to operational Growth use is not implemented. Promotion is a deliberate, human, post-calibration decision.',
  };
}
