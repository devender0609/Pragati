// v0.27 tests — blueprint-aware adaptive engine.

import { describe, expect, it } from 'vitest';
import {
  buildBlueprintSession,
  canFinishEarlyBlueprint,
  collectItemsForBlueprint,
  createInitialState,
  pickNextItem,
  shouldStopBlueprint,
  updateAbility,
} from '../../lib/adaptiveEngine';
import { getBlueprint, getBlueprints } from '../index';

describe('collectItemsForBlueprint', () => {
  it('pulls only items in the blueprint scope for Class 6 diagnostic', () => {
    const bp = getBlueprint('cbse_g06_math_diagnostic')!;
    expect(bp).toBeDefined();
    const items = collectItemsForBlueprint(bp);
    expect(items.length).toBeGreaterThan(0);
    // Every item must belong to a Class 6 skill (legacy skill ids on
    // items match the FR/DE/FM/RP/AL/GB module prefixes).
    for (const it of items) {
      expect(it.skillId).toMatch(/^(FR|DE|FM|RP|AL|GB)\./);
    }
  });

  it('pulls only Class 7 items for the Class 7 diagnostic', () => {
    const bp = getBlueprint('cbse_g07_math_diagnostic')!;
    expect(bp).toBeDefined();
    const items = collectItemsForBlueprint(bp);
    expect(items.length).toBeGreaterThan(0);
    for (const it of items) {
      expect(it.skillId).toMatch(/^(IR|FE|AE|LA|CQ|DH)\./);
    }
  });

  it('does not mix Class 6 and Class 7 items in one blueprint', () => {
    for (const grade of ['grade_06', 'grade_07'] as const) {
      const [bp] = getBlueprints(grade, 'mathematics');
      const items = collectItemsForBlueprint(bp);
      const gradeLetters = grade === 'grade_06'
        ? /^(FR|DE|FM|RP|AL|GB)\./
        : /^(IR|FE|AE|LA|CQ|DH)\./;
      for (const it of items) {
        expect(it.skillId).toMatch(gradeLetters);
      }
    }
  });
});

describe('buildBlueprintSession', () => {
  it('returns a pool with at least minItems for a valid blueprint', () => {
    const bp = getBlueprint('cbse_g06_math_diagnostic')!;
    const { config, pool } = buildBlueprintSession(bp);
    expect(pool.length).toBeGreaterThanOrEqual(bp.minItems);
    expect(config.minItems).toBe(bp.minItems);
    expect(config.maxItems).toBe(bp.maxItems);
    expect(config.eligibleItems.length).toBeGreaterThan(0);
  });

  it("refuses to start with 'not enough items' when a synthesised blueprint requests too many", () => {
    const bp = getBlueprint('cbse_g06_math_diagnostic')!;
    // Simulate a blueprint that wants more items than the entire bank has.
    const impossible = {
      ...bp,
      id: 'test_impossible',
      minItems: 100_000,
      maxItems: 100_000,
    };
    expect(() => buildBlueprintSession(impossible)).toThrow(/Refusing to start/);
  });
});

describe('shouldStopBlueprint / canFinishEarlyBlueprint', () => {
  it('honours the blueprint maxItems, not the engine default SESSION_SIZE', () => {
    const bp = getBlueprint('cbse_g06_math_diagnostic')!;
    const { config, pool } = buildBlueprintSession(bp);
    let state = createInitialState();
    // Simulate answering `maxItems` items.
    for (let i = 0; i < config.maxItems; i++) {
      const item = pickNextItem(pool, state.attemptedIds, state.ability);
      if (!item) break;
      state = {
        ability: updateAbility(state.ability, i % 2 === 0),
        attemptedIds: [...state.attemptedIds, item.id],
      };
    }
    expect(shouldStopBlueprint(state, config, pool.length)).toBe(true);
    expect(canFinishEarlyBlueprint(state, config)).toBe(true);
  });

  it('does not stop before minItems', () => {
    const bp = getBlueprint('cbse_g06_math_diagnostic')!;
    const { config, pool } = buildBlueprintSession(bp);
    const state = createInitialState();
    expect(canFinishEarlyBlueprint(state, config)).toBe(false);
    expect(shouldStopBlueprint(state, config, pool.length)).toBe(false);
  });
});
