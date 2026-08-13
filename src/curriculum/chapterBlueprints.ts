// v0.48 §3 — Explicit chapter blueprints.
//
// A chapter blueprint describes what a Chapter Check contains — the
// skills sampled, the target item count, and (soon) the difficulty
// distribution. Practice tabs use it to know whether the chapter has
// a real check to launch at all.
//
// This iteration seeds exactly one blueprint: Class 6 Fractions.
// Every other chapter returns null. The Practice tab uses that to
// decide whether to show the "Chapter check" action or hide it —
// so no other chapter can pretend to have a check.

import type { ModuleId, SkillId } from '../types';
import { SKILLS_BY_MODULE } from '../types';

export type ChapterBlueprint = {
  /** Stable ID recorded on every session this blueprint produces, so a
   *  stored session can be traced back to the exact blueprint that
   *  generated it. */
  blueprintId: string;
  /** Bumped whenever requiredSkillIds or the item counts change, so
   *  sessions built under different rules are not compared as if they
   *  were the same instrument. */
  blueprintVersion: string;
  chapterId: string;
  legacyModuleId: ModuleId;
  /** Skills the check MUST sample. */
  requiredSkillIds: SkillId[];
  /** Skills the check MAY sample if room remains. */
  optionalSkillIds: SkillId[];
  /** Target number of items in the check. Actual count depends on
   *  the adaptive engine's minItems/maxItems. */
  targetItemCount: number;
  /** How mixed-chapter practice differs from a chapter check.
   *  Mixed practice draws a smaller sample and is untimed; chapter
   *  check draws the full targetItemCount. */
  mixedPracticeItemCount: number;
};

const FRACTIONS_BLUEPRINT: ChapterBlueprint = {
  blueprintId: 'chapter_check.class6.fractions',
  blueprintVersion: 'v1',
  chapterId: 'official:g06_fractions_officialplaceholder',
  legacyModuleId: 'fractions',
  // FR.02..FR.08 are the seven Class 6 Fractions skills registered in
  // SKILLS_BY_MODULE.fractions.
  requiredSkillIds: SKILLS_BY_MODULE.fractions,
  optionalSkillIds: [],
  targetItemCount: 10,
  mixedPracticeItemCount: 5,
};

const BLUEPRINT_BY_CHAPTER_ID: Record<string, ChapterBlueprint> = {
  [FRACTIONS_BLUEPRINT.chapterId]: FRACTIONS_BLUEPRINT,
  // Legacy-only Fractions id (before the resolver prefixed with
  // `official:`) also resolves here so older UI paths still work.
  'g06_fractions_officialplaceholder': FRACTIONS_BLUEPRINT,
  // A legacy alias — some callers may pass the moduleId-shaped id.
  'legacy:fractions': FRACTIONS_BLUEPRINT,
};

/** Return the chapter blueprint for `chapterId`, or null if none has
 *  been authored. `null` means the UI MUST NOT offer a chapter check
 *  for this chapter. */
export function blueprintForChapter(
  chapterId: string
): ChapterBlueprint | null {
  return BLUEPRINT_BY_CHAPTER_ID[chapterId] ?? null;
}

/** Find the blueprint by Pragati module id. Most launch call sites hold
 *  a ModuleId rather than a chapter id, and resolving through the
 *  module keeps them from having to reconstruct the chapter id string
 *  (which is how the old code ended up with three spellings of the
 *  same Fractions chapter). */
export function blueprintForModule(
  moduleId: ModuleId
): ChapterBlueprint | null {
  return (
    chaptersWithBlueprint().find((bp) => bp.legacyModuleId === moduleId) ?? null
  );
}

/** All chapters that currently have a real chapter blueprint. */
export function chaptersWithBlueprint(): ChapterBlueprint[] {
  return Object.values(BLUEPRINT_BY_CHAPTER_ID).filter(
    (bp, i, arr) => arr.findIndex((b) => b === bp) === i
  );
}
