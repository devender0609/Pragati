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
  {
    officialChapterId: 'g06_fractions_officialplaceholder',
    legacyModuleIds: ['fractions'],
    mappingType: 'exact',
    notes:
      'Class 6 Mathematics — Fractions. Exact mapping is the maintainer claim; ' +
      'the official chapter itself is still unverified until a reviewer cites the NCERT source.',
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
