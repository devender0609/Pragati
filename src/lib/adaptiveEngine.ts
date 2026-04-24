// Simple rule-based adaptive engine.
//
// This is NOT a Rasch / IRT implementation. It is a transparent heuristic
// that picks the next item based on a running ability estimate:
//
//   - start at ability = 5 (mid of the 1-10 seed difficulty scale)
//   - on a correct answer, increase ability by 1 (capped at 10)
//   - on a wrong answer, decrease ability by 1 (floored at 1)
//   - pick the unseen item whose difficulty is closest to the current ability
//
// Real calibration requires student response data and a model fit
// (e.g., mirt / py-irt). See README for the next steps.

import type { Item } from '../data/items';

export const INITIAL_ABILITY = 5;
export const MAX_ITEMS = 10;
export const MIN_ITEMS = 8;

export type EngineState = {
  ability: number;
  attemptedIds: string[];
};

export const createInitialState = (): EngineState => ({
  ability: INITIAL_ABILITY,
  attemptedIds: [],
});

export const updateAbility = (ability: number, correct: boolean): number => {
  const next = ability + (correct ? 1 : -1);
  return Math.max(1, Math.min(10, next));
};

/**
 * Pick the next unseen item whose difficulty is closest to the target ability.
 * Deterministic tiebreak by item id. Returns null when the pool is exhausted.
 */
export const pickNextItem = (
  pool: Item[],
  attemptedIds: string[],
  ability: number
): Item | null => {
  const attempted = new Set(attemptedIds);
  const unseen = pool.filter((it) => !attempted.has(it.id));
  if (unseen.length === 0) return null;

  return unseen.reduce((best, current) => {
    const bestDist = Math.abs(best.difficulty - ability);
    const currentDist = Math.abs(current.difficulty - ability);
    if (currentDist < bestDist) return current;
    if (currentDist > bestDist) return best;
    // equal distance: deterministic tiebreak by id
    return current.id < best.id ? current : best;
  });
};

export const shouldStop = (state: EngineState, poolSize: number): boolean => {
  if (state.attemptedIds.length >= MAX_ITEMS) return true;
  if (state.attemptedIds.length >= poolSize) return true;
  return false;
};

export const canFinishEarly = (state: EngineState): boolean =>
  state.attemptedIds.length >= MIN_ITEMS;
