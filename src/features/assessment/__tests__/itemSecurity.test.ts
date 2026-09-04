// v0.51 §13 + §21 — item bank separation.
//
// These are the tests that make the separation real rather than
// aspirational. If any of them fails, the Growth item pool is
// compromised and no calibration built on it would be valid.

import { describe, it, expect } from 'vitest';
import { ITEMS } from '../../../data/items';
import {
  useOf, mayAdminister, itemsFor, findLeakedSecureItems,
  isSecureUse, isInstructionalUse, mayPromoteToOperational,
  recordExposure, INSTRUCTIONAL_USES, SECURE_USES,
  type ItemUse, type ExposureLog,
} from '../itemUse';
import type { Item } from '../../../data/items';

// `use` is now a declared field on Item, so no cast is needed.
const secureItem = (id: string, use: ItemUse): Item => ({
  ...ITEMS[0],
  id,
  use,
});

const ALL_USES: ItemUse[] = [
  'learning_example', 'guided_practice', 'independent_practice',
  'classroom_check', 'growth_field_test', 'growth_operational', 'retired',
];

describe('§13 Growth items never reach instructional contexts', () => {
  for (const use of SECURE_USES) {
    for (const ctx of ['learn', 'practice', 'classroom_check'] as const) {
      it(`${use} is refused in ${ctx}`, () => {
        expect(mayAdminister(use, ctx)).toBe(false);
      });
    }
  }

  it('filters secure items out of a practice pool', () => {
    const pool = [
      secureItem('safe-1', 'independent_practice'),
      secureItem('secure-1', 'growth_operational'),
      secureItem('secure-2', 'growth_field_test'),
    ];
    const practice = itemsFor(pool, 'practice');
    expect(practice.map((i) => i.id)).toEqual(['safe-1']);
  });

  it('detects leakage explicitly so a bug fails loudly', () => {
    const pool = [
      secureItem('a', 'independent_practice'),
      secureItem('b', 'growth_operational'),
    ];
    expect(findLeakedSecureItems(pool, 'practice')).toEqual(['b']);
    expect(findLeakedSecureItems(pool, 'learn')).toEqual(['b']);
    // In a Growth context a secure item is not a leak — it belongs.
    expect(findLeakedSecureItems(pool, 'growth')).toEqual([]);
  });

  it('the real shipped item bank contains no secure items in practice', () => {
    // Guards the current content set: every authored item predates the
    // secure pool and must therefore be instructional.
    expect(findLeakedSecureItems(ITEMS, 'practice')).toEqual([]);
    expect(findLeakedSecureItems(ITEMS, 'learn')).toEqual([]);
  });
});

describe('§13 instructional items never reach a Growth session', () => {
  for (const use of INSTRUCTIONAL_USES) {
    it(`${use} is refused in growth`, () => {
      expect(mayAdminister(use, 'growth')).toBe(false);
    });
  }

  it('a Growth pool built from the current bank is empty', () => {
    // Correct and important: Pragati has NO operational Growth items,
    // so a Growth session cannot currently be assembled. Better an
    // empty pool than one silently filled with practice questions.
    expect(itemsFor(ITEMS, 'growth')).toEqual([]);
  });
});

describe('§13 retired items are administered nowhere', () => {
  for (const ctx of ['learn', 'practice', 'classroom_check', 'growth'] as const) {
    it(`retired is refused in ${ctx}`, () => {
      expect(mayAdminister('retired', ctx)).toBe(false);
    });
  }
});

describe('§13 every use is classified exactly once', () => {
  it('secure and instructional sets are disjoint and complete', () => {
    for (const use of ALL_USES) {
      if (use === 'retired') {
        expect(isSecureUse(use)).toBe(false);
        expect(isInstructionalUse(use)).toBe(false);
        continue;
      }
      expect(isSecureUse(use) !== isInstructionalUse(use)).toBe(true);
    }
  });

  it('legacy items with no declared use default to instructional', () => {
    // The only safe default: defaulting to secure would promote the
    // whole existing bank into the Growth pool.
    const legacy = { ...ITEMS[0] } as Item;
    delete (legacy as { use?: string }).use;
    expect(useOf(legacy)).toBe('independent_practice');
    expect(isInstructionalUse(useOf(legacy))).toBe(true);
  });

  it('an unrecognised use value falls back to instructional, not secure', () => {
    const odd = { ...ITEMS[0], use: 'something_new' } as unknown as Item;
    expect(isSecureUse(useOf(odd))).toBe(false);
  });
});

describe('§13 practice items are never auto-promoted to operational', () => {
  for (const use of INSTRUCTIONAL_USES) {
    it(`${use} cannot be promoted`, () => {
      const r = mayPromoteToOperational(use, undefined);
      expect(r.allowed).toBe(false);
      expect(r.reason).toMatch(/exposure|recall/i);
    });
  }

  it('field-test items are not promoted without calibration', () => {
    const r = mayPromoteToOperational('growth_field_test', undefined);
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/calibrat/i);
  });

  it('an item with instructional exposure is permanently ineligible', () => {
    const r = mayPromoteToOperational('growth_operational', {
      itemId: 'x', growthAdministrations: 0,
      instructionalAdministrations: 3, lastAdministeredAt: 1,
    });
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/permanently ineligible/i);
  });
});

describe('§13 exposure is recorded', () => {
  it('counts growth and instructional administrations separately', () => {
    let log: ExposureLog = {};
    log = recordExposure(log, 'i1', 'growth', 1000);
    log = recordExposure(log, 'i1', 'growth', 2000);
    log = recordExposure(log, 'i1', 'practice', 3000);
    expect(log['i1'].growthAdministrations).toBe(2);
    expect(log['i1'].instructionalAdministrations).toBe(1);
    expect(log['i1'].lastAdministeredAt).toBe(3000);
  });

  it('records exposure for previously unseen items', () => {
    const log = recordExposure({}, 'new', 'learn', 5);
    expect(log['new'].instructionalAdministrations).toBe(1);
    expect(log['new'].growthAdministrations).toBe(0);
  });
});
