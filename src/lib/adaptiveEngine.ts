// Simple rule-based adaptive engine.
//
// This is NOT a Rasch / IRT implementation. It is a transparent heuristic
// that picks the next item based on a running ability estimate:
//
//   - start at ability = 5 (mid of the 1-10 seed difficulty scale)
//   - on a correct answer, increase ability by 1 (capped at 10)
//   - on a wrong answer, decrease ability by 1 (floored at 1)
//   - pick the unseen item from the SESSION POOL whose difficulty is
//     closest to the current ability
//
// v0.3: every session draws a stratified random pool of 10 items from the
// 24-item bank instead of always using the full bank. This:
//   (a) reduces item exposure across repeat sessions for the same student,
//   (b) gives the adaptive engine more headroom when difficulty selection
//       converges to a small region.
// Real calibration still requires student response data and a model fit
// (e.g., mirt / py-irt). See README for the next steps.
//
// v0.4: the adaptive engine is now skill-aware. The caller scopes the
// item bank to a SkillMode before building a session pool:
//   - 'FR.06'  → only FR.06 items
//   - 'FR.07'  → only FR.07 items
//   - 'mixed'  → both FR.06 and FR.07 items, drawn together
// `filterItemsBySkillMode` is the helper for that scoping. The pool
// builder itself is unchanged: it just stratifies whatever items it is
// given.

import type { Item } from '../data/items';
import { MODULE_FOR_SKILL, moduleForSkillMode, type SkillMode } from '../types';

export const INITIAL_ABILITY = 5;
export const SESSION_SIZE = 10; // items administered per session
export const MIN_ITEMS = 8;     // earliest a "finish early" path could trigger

// Stratified target counts within a single session pool. Always sums to
// SESSION_SIZE.
export const STRATIFIED_TARGETS: Record<
  'foundational' | 'core' | 'advanced',
  number
> = {
  foundational: 2,
  core: 5,
  advanced: 3,
};

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

// ---------------------------------------------------------------------------
// Skill-mode scoping
// ---------------------------------------------------------------------------
/**
 * Restrict an item bank to the items in a given skill mode.
 *   - 'mixed' (across-everything) → entire bank
 *   - 'mixed_<module>'            → all items in that module
 *   - SkillId                     → only items for that skill
 * Returns a new array; the input is not mutated.
 */
export function filterItemsBySkillMode(
  allItems: Item[],
  mode: SkillMode
): Item[] {
  if (mode === 'mixed') return allItems.slice();
  const m = moduleForSkillMode(mode);
  // 'mixed_<module>' modes: scope to the module.
  if (
    mode === 'mixed_fractions' ||
    mode === 'mixed_decimals' ||
    mode === 'mixed_factors_multiples' ||
    mode === 'mixed_ratio_proportion' ||
    mode === 'mixed_algebra'
  ) {
    return allItems.filter(
      (it) => MODULE_FOR_SKILL[it.skillId] === m
    );
  }
  // Otherwise it's a single skill.
  return allItems.filter((it) => it.skillId === mode);
}

// ---------------------------------------------------------------------------
// Random utilities
// ---------------------------------------------------------------------------
// Fisher–Yates shuffle, returning a new array. Uses Math.random.
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------------------------------------------------------------
// Session-pool construction
// ---------------------------------------------------------------------------
/**
 * Build a single-session pool of items, stratified by band, preferring
 * items the student has not seen in earlier sessions. If the
 * unseen-by-band set is too small, falls back to seen items in the same
 * band so we still hit the stratified target.
 *
 * The returned pool is shuffled internally so the order in which items
 * exist in the array carries no information; the adaptive engine still
 * picks the next item by closeness-to-ability.
 */
export function buildSessionPool(
  allItems: Item[],
  priorAttemptedIds: string[]
): Item[] {
  const seen = new Set(priorAttemptedIds);
  const pool: Item[] = [];

  (Object.keys(STRATIFIED_TARGETS) as Array<keyof typeof STRATIFIED_TARGETS>)
    .forEach((band) => {
      const target = STRATIFIED_TARGETS[band];
      const inBand = allItems.filter((it) => it.band === band);
      const unseen = shuffle(inBand.filter((it) => !seen.has(it.id)));
      const seenInBand = shuffle(inBand.filter((it) => seen.has(it.id)));
      const picked = unseen.slice(0, target);
      if (picked.length < target) {
        picked.push(...seenInBand.slice(0, target - picked.length));
      }
      pool.push(...picked);
    });

  // If the bank is too small to fill stratified targets at all, top up
  // with whatever is left.
  if (pool.length < SESSION_SIZE) {
    const inPool = new Set(pool.map((it) => it.id));
    const remaining = shuffle(allItems.filter((it) => !inPool.has(it.id)));
    pool.push(...remaining.slice(0, SESSION_SIZE - pool.length));
  }

  return pool;
}

/**
 * Pick the next unseen item from the session pool whose difficulty is
 * closest to the target ability. Deterministic tiebreak by item id.
 * Returns null when the session pool has been exhausted.
 *
 * NOTE: this expects the *session pool* (the 10-item subset), NOT the
 * full bank. The session pool is set once at the start of an attempt.
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
  if (state.attemptedIds.length >= SESSION_SIZE) return true;
  if (state.attemptedIds.length >= poolSize) return true;
  return false;
};

export const canFinishEarly = (state: EngineState): boolean =>
  state.attemptedIds.length >= MIN_ITEMS;

// Backwards-compat alias for callers that imported MAX_ITEMS in earlier
// versions. Equivalent to SESSION_SIZE.
export const MAX_ITEMS = SESSION_SIZE;
