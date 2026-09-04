// v0.63 §4/§13 — SECTION-AWARE PROGRESS.
//
// THE RULE THAT SHAPES EVERYTHING HERE
//
// A session contributes to an official section ONLY when its activity
// has an explicit, unambiguous section relation. Concretely:
//
//   - the skill must be `exact_section_candidate` for that section;
//   - a `multi_section_candidate` skill (FR.08) contributes to NOTHING,
//     because attributing it to one of its three candidate sections
//     would invent a fact;
//   - a skill in a displaced module contributes to nothing, because the
//     section it would count toward is not Class 6 curriculum.
//
// Legacy sessions are NEVER deleted or rewritten. They remain in
// history exactly as recorded; they simply do not acquire an
// official-section label they were never given.
//
// NO MASTERY. The states are descriptive facts about activity —
// "started", "practised" — not claims about what a student knows. There
// is no accuracy threshold anywhere in this file, deliberately: any
// such threshold would be an uncalibrated mastery claim wearing
// descriptive clothing.

import type { Session } from '../types';
import { ITEMS } from '../data/items';
import { sectionsForChapter } from './officialSections';
import { alignmentForSkill } from './itemAlignment';
import { isClass6Core } from './legacyDisposition';
import { SKILLS_BY_MODULE, type ModuleId } from '../types';

export type SectionProgressState =
  /** No eligible activity recorded. */
  | 'not_started'
  /** Activity recorded, no completed practice session. */
  | 'in_progress'
  /** At least one practice session completed. Says nothing about how
   *  well — only that it was finished. */
  | 'practice_completed';

export type SectionActivityKind = 'learn' | 'practice';

export type SectionProgress = {
  officialSectionId: string;
  sectionNumber: string;
  title: string;
  state: SectionProgressState;
  /** Eligible sessions only. */
  sessionCount: number;
  lastActivityAt: number | null;
  lastActivityKind: SectionActivityKind | null;
};

function moduleForSkill(skillId: string): ModuleId | null {
  for (const [mod, skills] of Object.entries(SKILLS_BY_MODULE)) {
    if ((skills as string[]).includes(skillId)) return mod as ModuleId;
  }
  return null;
}

/**
 * Which official section does this skill's activity count toward?
 *
 * Returns null for anything ambiguous. That is the point: null is a
 * correct and common answer, and a caller that wants a number must
 * accept that some real activity contributes to no section total.
 */
export function eligibleSectionForSkill(skillId: string): string | null {
  const a = alignmentForSkill(skillId);
  if (a.alignmentStatus !== 'exact_section_candidate') return null;
  if (!a.officialSectionId) return null;
  const mod = moduleForSkill(skillId);
  if (mod === null || !isClass6Core(mod)) return null;
  return a.officialSectionId;
}

/**
 * Skills touched by a session.
 *
 * Sessions record `itemId`, not `skillId`, so the skill is resolved
 * through the item bank. An item that no longer exists resolves to
 * nothing rather than being guessed — old sessions referencing removed
 * items simply contribute no section activity, which is correct.
 */
const ITEM_TO_SKILL: Map<string, string> = new Map(
  (ITEMS as Array<{ id: string; skillId: string }>).map((i) => [i.id, i.skillId])
);

function skillsInSession(s: Session): string[] {
  const ids = new Set<string>();
  for (const r of s.responses ?? []) {
    const skill = ITEM_TO_SKILL.get(r.itemId);
    if (skill) ids.add(skill);
  }
  return [...ids];
}

export function sectionProgressForChapter(
  officialChapterId: string,
  sessions: Session[]
): SectionProgress[] {
  const sections = sectionsForChapter(officialChapterId);

  // Bucket eligible activity by section.
  const bySection = new Map<
    string,
    { count: number; last: number | null; kind: SectionActivityKind | null; completed: boolean }
  >();

  for (const session of sessions) {
    for (const skillId of skillsInSession(session)) {
      const sectionId = eligibleSectionForSkill(skillId);
      if (!sectionId) continue; // ambiguous or displaced — contributes nothing

      const bucket =
        bySection.get(sectionId) ?? {
          count: 0,
          last: null,
          kind: null,
          completed: false,
        };
      bucket.count += 1;

      const at = session.completedAt ?? session.startedAt ?? null;
      if (at !== null && (bucket.last === null || at > bucket.last)) {
        bucket.last = at;
        // Sessions in this product are practice; a lesson view is not a
        // session. Recorded as 'practice' rather than inferred.
        bucket.kind = 'practice';
      }
      if (session.completedAt) bucket.completed = true;
      bySection.set(sectionId, bucket);
    }
  }

  return sections.map((s) => {
    const b = bySection.get(s.officialSectionId);
    const state: SectionProgressState = !b
      ? 'not_started'
      : b.completed
        ? 'practice_completed'
        : 'in_progress';
    return {
      officialSectionId: s.officialSectionId,
      sectionNumber: s.sectionNumber,
      title: s.exactTitle,
      state,
      sessionCount: b?.count ?? 0,
      lastActivityAt: b?.last ?? null,
      lastActivityKind: b?.kind ?? null,
    };
  });
}

/**
 * Where should the student continue?
 *
 * Most recent eligible activity that is not finished, else the first
 * section not started. Returns null when there is nothing truthful to
 * suggest — better than pointing somewhere arbitrary.
 */
export function continueFrom(
  progress: SectionProgress[]
): SectionProgress | null {
  const inProgress = progress
    .filter((p) => p.state === 'in_progress')
    .sort((a, b) => (b.lastActivityAt ?? 0) - (a.lastActivityAt ?? 0));
  if (inProgress.length > 0) return inProgress[0];
  return progress.find((p) => p.state === 'not_started') ?? null;
}

/**
 * v0.63 §4 — sessions preserved but NOT attributable to any official
 * section. Surfaced honestly rather than dropped, so a student's
 * history does not silently shrink.
 */
export function unattributedSessionCount(sessions: Session[]): number {
  let n = 0;
  for (const s of sessions) {
    const skills = skillsInSession(s);
    if (skills.length === 0) continue;
    if (!skills.some((sk) => eligibleSectionForSkill(sk) !== null)) n += 1;
  }
  return n;
}
