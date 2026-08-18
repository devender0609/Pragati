// v0.47 C — Pragati content mapping.
//
// Given an OfficialChapterRecord, what Pragati module(s) claim to cover
// it, and how much content exists. This is the honest bridge between
// the external authority (officialChapters.ts) and the internal
// Pragati module registry.
//
// Mapping types:
//   exact     — one Pragati module maps 1:1 to one official chapter.
//   partial   — module covers only part of the official chapter.
//   combined  — one Pragati module bundles multiple official chapters.
//   split     — one official chapter is split across multiple Pragati modules.
//   unmapped  — no Pragati content for this chapter (surfaces in UI as gap).

import { ITEMS } from '../data/items';
import { LESSONS } from '../data/lessons';
import { SKILLS_BY_MODULE, type ModuleId as LegacyModuleId, type SkillId } from '../types';
import type { OfficialChapterRecord } from './officialChapters';

export type MappingType =
  | 'exact'
  | 'partial'
  | 'combined'
  | 'split'
  | 'unmapped';

/** Statically declared mapping — what Pragati modules the maintainer
 *  claims cover which official chapter. Small on purpose: this
 *  iteration wires only the Fractions reference chapter. */
export type StaticMappingRow = {
  officialChapterId: string;
  legacyModuleIds: LegacyModuleId[];
  mappingType: MappingType;
  notes?: string;
};

export const STATIC_MAPPING: StaticMappingRow[] = [
  // -------------------------------------------------------------------
  // v0.50 §15/§16 — mapping Pragati's Class 6 modules onto the CURRENT
  // NCERT textbook (Ganita Prakash, 10 chapters).
  //
  // The honest headline: Pragati's Class 6 module set was built against
  // the OLD 14-chapter "Mathematics" textbook. Three of its six modules
  // have no standalone chapter in the current book at all. Those rows
  // are recorded as 'unmapped' rather than being forced onto a
  // plausible-looking chapter, because inventing a mapping here is
  // exactly how a curriculum claim becomes false.
  // -------------------------------------------------------------------
  {
    officialChapterId: 'ncert_gp_c6_ch07_fractions',
    legacyModuleIds: ['fractions'],
    mappingType: 'exact',
    notes:
      'Fractions is Chapter 7 in both the old and current textbooks. Pragati\'s ' +
      'reference module maps here. Skill-level alignment to Ganita Prakash\'s ' +
      'actual treatment still needs a teacher review.',
  },
  {
    officialChapterId: 'ncert_gp_c6_ch05_prime_time',
    legacyModuleIds: ['factors_multiples'],
    mappingType: 'partial',
    notes:
      'Pragati\'s factors_multiples module was written against the old ' +
      '"Playing with Numbers" chapter. Prime Time covers related ground but ' +
      'is not the same chapter. Partial until reviewed.',
  },
  {
    officialChapterId: 'ncert_gp_c6_ch02_lines_angles',
    legacyModuleIds: ['geometry'],
    mappingType: 'partial',
    notes:
      'Pragati\'s single geometry module spans what the current book splits ' +
      'across Lines and Angles, Perimeter and Area, Playing with Constructions, ' +
      'and Symmetry. Recorded as partial against the first of these.',
  },

  // NOTE: the legacy 'g06_fractions_officialplaceholder' ID deliberately
  // has NO mapping row. It is an ALIAS of ncert_gp_c6_ch07_fractions,
  // resolved in chapterResolver, so the fractions module has exactly one
  // official chapter and cannot be double-counted in coverage.
];

/** v0.50 §16 — Pragati modules with NO standalone chapter in the
 *  current NCERT Class 6 textbook. Recorded explicitly so the gap is
 *  visible in Admin & Research instead of being silently absent.
 *  These were chapters in the OLD 14-chapter book. */
export const UNMAPPED_LEGACY_MODULES: Array<{
  legacyModuleId: LegacyModuleId;
  oldChapter: string;
  reason: string;
}> = [
  {
    legacyModuleId: 'decimals',
    oldChapter: 'Old NCERT Class 6 Mathematics, Chapter 8 — Decimals',
    reason:
      'Ganita Prakash has no standalone Decimals chapter at Class 6. Content ' +
      'placement in the current curriculum needs to be established before this ' +
      'module is presented as Class 6 curriculum.',
  },
  {
    legacyModuleId: 'ratio_proportion',
    oldChapter: 'Old NCERT Class 6 Mathematics, Chapter 12 — Ratio and Proportion',
    reason:
      'No standalone Ratio and Proportion chapter in Ganita Prakash Class 6.',
  },
  {
    legacyModuleId: 'algebra',
    oldChapter: 'Old NCERT Class 6 Mathematics, Chapter 11 — Algebra',
    reason:
      'No standalone Algebra chapter in Ganita Prakash Class 6.',
  },
];

/** Rich mapping used by the coverage UI and the ChapterLandingPage.
 *  Derived from STATIC_MAPPING + live content in ITEMS/LESSONS. */
export type PragatiContentMapping = {
  officialChapterId: string;
  legacyModuleIds: LegacyModuleId[];
  mappingType: MappingType;

  /** Skills registered in the mapped modules. */
  skillIds: SkillId[];
  skillCount: number;

  /** Lessons hand-authored in `data/lessons.ts` for these skills. */
  handAuthoredLessonCount: number;
  /** Skills that would need a synthesised lesson because no
   *  hand-authored lesson exists. Synthesised lessons are NOT counted
   *  as instructional content in the derived-status function. */
  synthesisedLessonCount: number;

  /** Hand-authored worked examples across all authored lessons in
   *  this chapter's skills. */
  workedExampleCount: number;

  /** Items authored per skill, summed. */
  assessmentItemCount: number;

  /** Placeholder counters we cannot compute from current data. */
  visualCount: number;                // requires visual metadata field
  guidedPracticeItemCount: number;    // requires item.kind === 'guided'
  independentPracticeItemCount: number; // items marked independent

  /** True if the mapped module has a real blueprint (v0.27+ registry). */
  blueprintAvailable: boolean;

  /** Manually recorded teacher-review count (v0.43 approvals). Filled
   *  by the inventory function at read time; 0 here. */
  teacherApprovedItemCount: number;

  notes: string;
};

export function buildContentMapping(
  official: OfficialChapterRecord,
  staticRow: StaticMappingRow | undefined
): PragatiContentMapping {
  if (!staticRow) {
    return {
      officialChapterId: official.officialChapterId,
      legacyModuleIds: [],
      mappingType: 'unmapped',
      skillIds: [],
      skillCount: 0,
      handAuthoredLessonCount: 0,
      synthesisedLessonCount: 0,
      workedExampleCount: 0,
      assessmentItemCount: 0,
      visualCount: 0,
      guidedPracticeItemCount: 0,
      independentPracticeItemCount: 0,
      blueprintAvailable: false,
      teacherApprovedItemCount: 0,
      notes: 'No Pragati module currently maps to this official chapter.',
    };
  }

  const skillIds: SkillId[] = staticRow.legacyModuleIds.flatMap(
    (m) => SKILLS_BY_MODULE[m] ?? []
  );

  // Count only hand-authored lessons (present as keys in LESSONS).
  // Synthesised lessons produced by lessonSynthesis.ts do not count
  // as instructional content per the v0.47 D honesty rule.
  const authoredLessons = skillIds.filter(
    (s) => (LESSONS as Record<string, unknown>)[s] !== undefined
  );
  const handAuthoredLessonCount = authoredLessons.length;
  const synthesisedLessonCount = skillIds.length - handAuthoredLessonCount;

  // Sum worked examples across authored lessons.
  let workedExampleCount = 0;
  for (const s of authoredLessons) {
    const lesson = (LESSONS as Record<string, { workedExamples?: unknown[] }>)[s];
    workedExampleCount += lesson?.workedExamples?.length ?? 0;
  }

  const items = ITEMS.filter((it) => skillIds.includes(it.skillId as SkillId));
  const assessmentItemCount = items.length;

  // v0.27+ registered blueprints exist for every registered module.
  // We treat the presence of any items as blueprint-available for now.
  const blueprintAvailable = assessmentItemCount > 0;

  return {
    officialChapterId: official.officialChapterId,
    legacyModuleIds: staticRow.legacyModuleIds,
    mappingType: staticRow.mappingType,
    skillIds,
    skillCount: skillIds.length,
    handAuthoredLessonCount,
    synthesisedLessonCount,
    workedExampleCount,
    assessmentItemCount,
    visualCount: 0,
    guidedPracticeItemCount: 0,
    independentPracticeItemCount: 0,
    blueprintAvailable,
    teacherApprovedItemCount: 0, // filled by inventory function
    notes: staticRow.notes ?? '',
  };
}

/** Convenience: look up the static row for an official chapter. */
export function staticMappingFor(officialChapterId: string): StaticMappingRow | undefined {
  return STATIC_MAPPING.find((r) => r.officialChapterId === officialChapterId);
}
