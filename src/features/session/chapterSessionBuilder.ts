// v0.49 §3 — Executable chapter blueprints.
//
// Until now ChapterBlueprint was metadata: `requiredSkillIds`,
// `targetItemCount`, and `mixedPracticeItemCount` were read by nobody.
// Both "mixed practice" and "chapter check" ended up calling the same
// legacy SkillMode path, so the two modes were identical apart from
// the button label.
//
// This module is the piece that makes them genuinely different. It is
// PURE — no React, no localStorage, no Math.random unless a shuffle
// function is injected — so the difference between the two modes is
// directly testable.
//
// Selection rules:
//   practice        → mixedPracticeItemCount items, sampled across the
//                     chapter's skills, hints allowed.
//   chapter_check   → targetItemCount items, round-robin across every
//                     requiredSkillId first so no single skill can be
//                     oversampled while another is never sampled at
//                     all, hints suppressed.
//
// Round-robin is the anti-oversampling guarantee: pass 1 takes at most
// one item from each required skill, pass 2 takes a second from each,
// and so on. A skill can only receive its (n+1)th item after every
// other skill with items left has received its nth.

import type { Item } from '../../data/items';
import type { SkillId } from '../../types';
import type { ChapterBlueprint } from '../../curriculum/chapterBlueprints';
import type { SessionPurpose } from './sessionPurpose';

export type ChapterSessionPlan = {
  purpose: SessionPurpose;
  blueprintId: string;
  blueprintVersion: string;
  chapterId: string;
  moduleId: string;
  /** The items to administer, in pool order. */
  pool: Item[];
  /** Distinct skills actually represented in `pool`, in blueprint
   *  order. This is what gets written to the session snapshot — it is
   *  measured from the pool, never copied from the blueprint's
   *  aspiration. */
  sampledSkillIds: SkillId[];
  /** Required skills the item bank could not supply at all. Empty on a
   *  healthy chapter; non-empty means the check is incomplete and the
   *  caller must say so rather than pretend full coverage. */
  missingRequiredSkillIds: SkillId[];
  /** The count the blueprint asked for, for reporting against the
   *  count actually achieved (`pool.length`). */
  requestedItemCount: number;
};

export type BuildChapterSessionArgs = {
  blueprint: ChapterBlueprint;
  purpose: SessionPurpose;
  items: Item[];
  /** Item IDs the student has already seen in earlier sessions. Used
   *  only to prefer fresh items; never to exclude them outright, so a
   *  small bank can still fill a session. */
  priorAttemptedIds?: string[];
  /** Injected for deterministic tests. Defaults to a Fisher–Yates
   *  shuffle over Math.random. */
  shuffle?: <T>(arr: T[]) => T[];
};

function defaultShuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** How many items this purpose asks the blueprint for. This is the
 *  function that makes `targetItemCount` and `mixedPracticeItemCount`
 *  load-bearing instead of decorative. */
export function targetCountFor(
  blueprint: ChapterBlueprint,
  purpose: SessionPurpose
): number {
  return purpose === 'chapter_check'
    ? blueprint.targetItemCount
    : blueprint.mixedPracticeItemCount;
}

/** Skills this purpose is allowed to draw from. A chapter check must
 *  cover the required skills; practice may also use optional ones. */
export function skillsInScopeFor(
  blueprint: ChapterBlueprint,
  purpose: SessionPurpose
): SkillId[] {
  if (purpose === 'chapter_check') return [...blueprint.requiredSkillIds];
  return [...blueprint.requiredSkillIds, ...blueprint.optionalSkillIds];
}

/**
 * Build an executable plan for a chapter session.
 *
 * Throws nothing — a chapter with no items yields a plan with an empty
 * pool, and the caller is responsible for refusing to start it. That
 * keeps the zero-item guard in one place (the launcher) instead of
 * splitting it between an exception and a return value.
 */
export function buildChapterSessionPlan(
  args: BuildChapterSessionArgs
): ChapterSessionPlan {
  const {
    blueprint,
    purpose,
    items,
    priorAttemptedIds = [],
    shuffle = defaultShuffle,
  } = args;

  const seen = new Set(priorAttemptedIds);
  const scopeSkills = skillsInScopeFor(blueprint, purpose);
  const requested = targetCountFor(blueprint, purpose);

  // Bucket the bank by skill, fresh items first, then already-seen
  // ones. Within each group the order is shuffled so repeat sessions
  // don't administer an identical sequence.
  const bySkill = new Map<SkillId, Item[]>();
  for (const skill of scopeSkills) {
    const forSkill = items.filter((it) => it.skillId === skill);
    if (forSkill.length === 0) {
      bySkill.set(skill, []);
      continue;
    }
    const fresh = shuffle(forSkill.filter((it) => !seen.has(it.id)));
    const stale = shuffle(forSkill.filter((it) => seen.has(it.id)));
    // Easier items first within a skill so a session opens gently.
    const ordered = [...fresh, ...stale].sort(
      (a, b) => a.difficulty - b.difficulty
    );
    bySkill.set(skill, ordered);
  }

  const missingRequiredSkillIds = blueprint.requiredSkillIds.filter(
    (s) => (bySkill.get(s)?.length ?? 0) === 0
  );

  // Round-robin draw. Skills are visited in blueprint order every
  // pass, so coverage is breadth-first and no skill can run ahead.
  const pool: Item[] = [];
  const cursors = new Map<SkillId, number>(scopeSkills.map((s) => [s, 0]));
  let progressed = true;
  while (pool.length < requested && progressed) {
    progressed = false;
    for (const skill of scopeSkills) {
      if (pool.length >= requested) break;
      const bucket = bySkill.get(skill) ?? [];
      const cursor = cursors.get(skill) ?? 0;
      if (cursor >= bucket.length) continue;
      pool.push(bucket[cursor]);
      cursors.set(skill, cursor + 1);
      progressed = true;
    }
  }

  const sampledSkillIds = scopeSkills.filter((s) =>
    pool.some((it) => it.skillId === s)
  );

  return {
    purpose,
    blueprintId: blueprint.blueprintId,
    blueprintVersion: blueprint.blueprintVersion,
    chapterId: blueprint.chapterId,
    moduleId: blueprint.legacyModuleId,
    pool,
    sampledSkillIds,
    missingRequiredSkillIds,
    requestedItemCount: requested,
  };
}

/** Highest number of items drawn from any single skill. Used by tests
 *  and by the results screen to state coverage honestly. */
export function maxItemsPerSkill(plan: ChapterSessionPlan): number {
  const counts = new Map<string, number>();
  for (const it of plan.pool) {
    counts.set(it.skillId, (counts.get(it.skillId) ?? 0) + 1);
  }
  return counts.size === 0 ? 0 : Math.max(...counts.values());
}
