// v0.50 §2 — Generic module practice.
//
// THE BUG THIS FIXES
//
// v0.49's launcher, for a chapter with no authored ChapterBlueprint,
// did this:
//
//   const mixedMode = `mixed_${moduleId}`;
//   const fallback = SKILL_MODE_LABELS[mixedMode]
//     ? mixedMode
//     : SKILLS_BY_MODULE[moduleId]?.[0];   // <- first skill only
//
// Only Class 6 and Class 7 modules have a `mixed_*` SkillMode. So for
// EVERY module in Classes 1–5 and 8–12, the button labelled "Mixed
// practice" administered a single concept. The label was false for the
// large majority of the catalogue.
//
// THE FIX
//
// A ModulePracticeBlueprint is derived at runtime from the module
// registry. It has no authored content and makes no chapter-level
// claim — it simply samples breadth-first across whatever skills the
// module actually has items for. That is enough to make the "mixed"
// label true.
//
// This is deliberately SEPARATE from ChapterBlueprint. A chapter check
// still requires an authored blueprint; generic practice must never be
// promotable into a chapter check.

import type { Item } from '../../data/items';
import type { ModuleId, SkillId } from '../../types';
import { SKILLS_BY_MODULE } from '../../types';

/** Default size of a generic practice set. Short by design — this is
 *  low-stakes practice, not an assessment. */
export const DEFAULT_MODULE_PRACTICE_ITEM_COUNT = 6;

/** Below this many skills-with-items, a set cannot honestly be called
 *  "mixed", because it would draw from a single concept. */
export const MIN_SKILLS_FOR_MIXED = 2;

export type ModulePracticeBlueprint = {
  kind: 'module_practice';
  moduleId: ModuleId;
  /** Skills registered to the module that actually have eligible items. */
  usableSkillIds: SkillId[];
  /** Registered skills with no items yet — reported, not hidden. */
  emptySkillIds: SkillId[];
  itemCount: number;
  /** True when at least MIN_SKILLS_FOR_MIXED skills have items. Drives
   *  whether the UI may use the words "Mixed practice" at all. */
  canBeMixed: boolean;
};

/** Build the runtime practice plan for a module. Pure. */
export function modulePracticeBlueprint(
  moduleId: ModuleId,
  items: Item[],
  itemCount: number = DEFAULT_MODULE_PRACTICE_ITEM_COUNT
): ModulePracticeBlueprint {
  const registered = (SKILLS_BY_MODULE[moduleId] ?? []) as SkillId[];
  const usableSkillIds = registered.filter((s) =>
    items.some((it) => it.skillId === s)
  );
  const emptySkillIds = registered.filter(
    (s) => !usableSkillIds.includes(s)
  );
  return {
    kind: 'module_practice',
    moduleId,
    usableSkillIds,
    emptySkillIds,
    itemCount,
    canBeMixed: usableSkillIds.length >= MIN_SKILLS_FOR_MIXED,
  };
}

export type ModulePracticePlan = {
  pool: Item[];
  sampledSkillIds: SkillId[];
  moduleId: ModuleId;
  /** Mirrors the blueprint flag, measured against the ACTUAL pool. */
  isMixed: boolean;
};

function defaultShuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a generic practice pool, sampling breadth-first across skills.
 *
 * Round-robin, same guarantee as the chapter-check builder: a skill
 * receives its (n+1)th item only after every other skill with items
 * left has received its nth. That is what stops the pool collapsing
 * onto whichever skill happens to have the largest item bank.
 */
export function buildModulePracticePlan(args: {
  blueprint: ModulePracticeBlueprint;
  items: Item[];
  priorAttemptedIds?: string[];
  shuffle?: <T>(a: T[]) => T[];
}): ModulePracticePlan {
  const {
    blueprint,
    items,
    priorAttemptedIds = [],
    shuffle = defaultShuffle,
  } = args;
  const seen = new Set(priorAttemptedIds);

  const bySkill = new Map<SkillId, Item[]>();
  for (const skill of blueprint.usableSkillIds) {
    const forSkill = items.filter((it) => it.skillId === skill);
    // Fresh items first, then already-seen ones, so repeat practice
    // does not simply replay the same set.
    const fresh = shuffle(forSkill.filter((it) => !seen.has(it.id)));
    const stale = shuffle(forSkill.filter((it) => seen.has(it.id)));
    bySkill.set(
      skill,
      [...fresh, ...stale].sort((a, b) => a.difficulty - b.difficulty)
    );
  }

  const pool: Item[] = [];
  const cursors = new Map<SkillId, number>(
    blueprint.usableSkillIds.map((s) => [s, 0])
  );
  let progressed = true;
  while (pool.length < blueprint.itemCount && progressed) {
    progressed = false;
    for (const skill of blueprint.usableSkillIds) {
      if (pool.length >= blueprint.itemCount) break;
      const bucket = bySkill.get(skill) ?? [];
      const cursor = cursors.get(skill) ?? 0;
      if (cursor >= bucket.length) continue;
      pool.push(bucket[cursor]);
      cursors.set(skill, cursor + 1);
      progressed = true;
    }
  }

  const sampledSkillIds = blueprint.usableSkillIds.filter((s) =>
    pool.some((it) => it.skillId === s)
  );

  return {
    pool,
    sampledSkillIds,
    moduleId: blueprint.moduleId,
    // Measured from the pool, not asserted from the blueprint.
    isMixed: sampledSkillIds.length >= MIN_SKILLS_FOR_MIXED,
  };
}

/** What the UI is allowed to call this module's practice action.
 *  Returns null when there is nothing launchable at all. */
export function practiceActionLabel(
  bp: ModulePracticeBlueprint
): 'Mixed practice' | 'Practise this concept' | null {
  if (bp.usableSkillIds.length === 0) return null;
  return bp.canBeMixed ? 'Mixed practice' : 'Practise this concept';
}
