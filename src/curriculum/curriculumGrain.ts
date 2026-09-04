// v0.74 §2/§23 — WHAT KIND OF OFFICIAL RECORD IS THIS?
//
// THE DEFECT THIS FILE EXISTS TO CLOSE
//
// v0.73's backlog produced 89 entries and the planner gave all 89 the
// same treatment. But 65 of them are Class 6 SECTIONS — "7.4 Marking
// Fraction Lengths on the Number Line", a page and a half of a textbook
// — and 24 of them are CBSE syllabus UNITS. Class 10 Unit II is
// "Algebra". It carries 20 marks and contains four topics, each of which
// is a chapter's worth of teaching.
//
// v0.73 planned six explanation paragraphs and three worked examples for
// it, exactly as for §7.4.
//
// That is not an underestimate to be scaled up. A unit does not have a
// lesson; it has chapters, which have sections, which have lessons. The
// plan cannot be corrected by multiplying — it can only be corrected by
// refusing to plan until somebody establishes the grain beneath the
// unit from primary evidence.
//
// WHY THE REGISTRY ALREADY KNOWS THIS
//
// `OfficialCurriculum.topLevel`, `OfficialUnit.level`,
// `chaptersEstablished` and `topicsKnown` were built in earlier
// releases precisely so a unit is never called a chapter. The planner
// simply did not read them. This file does not add a parallel truth; it
// reads the one that exists and states the planning consequence.

import type { Grade } from '../types';
import {
  officialCurriculumForGrade,
  type OfficialUnit,
} from './officialCurriculum';
import { sectionsForChapter } from './officialSections';

/** What an official record IS, according to its own source. */
export type CurriculumGrain =
  | 'official_unit'
  | 'official_chapter'
  | 'official_section'
  | 'official_topic';

export const GRAIN_LABEL: Record<CurriculumGrain, string> = {
  official_unit: 'syllabus unit',
  official_chapter: 'textbook chapter',
  official_section: 'textbook section',
  official_topic: 'syllabus topic',
};

/**
 * Is this grain fine enough to carry a single instructional plan?
 *
 * A section is. A topic usually is. A unit is not, and a chapter is not
 * until its sections are known — planning "one lesson for Chapter 7"
 * would have produced one lesson where nine were needed.
 */
export function isPlannableGrain(grain: CurriculumGrain): boolean {
  return grain === 'official_section' || grain === 'official_topic';
}

export type GrainAssessment = {
  grain: CurriculumGrain;
  plannable: boolean;
  /** Why, in one line, for the report and the Admin panel. */
  reason: string;
  /** The exact evidence a person must obtain to make this plannable.
   *  Null when it already is. */
  requires: string | null;
};

/**
 * The grain of a backlog record.
 *
 * `officialSectionId` non-null means section depth was verified for that
 * chapter and this record IS one of those sections. Null means the
 * record is the top-level entry itself, and what THAT is depends on the
 * grade's `topLevel`.
 */
export function assessGrain(
  grade: Grade,
  officialSectionId: string | null,
  unit?: OfficialUnit
): GrainAssessment {
  if (officialSectionId !== null) {
    return {
      grain: 'official_section',
      plannable: true,
      reason:
        'Section depth verified from the printed contents page; this record is one section.',
      requires: null,
    };
  }

  const c = officialCurriculumForGrade(grade);
  const topLevel = c?.topLevel ?? 'chapter';

  if (topLevel === 'unit') {
    const topicCount = unit?.topics.length ?? 0;
    return {
      grain: 'official_unit',
      plannable: false,
      reason:
        `A syllabus unit${topicCount ? ` containing ${topicCount} named topics` : ''}. ` +
        'A unit has chapters and sections beneath it; it does not have one lesson.',
      requires:
        unit && !unit.chaptersEstablished
          ? 'Read the prescribed textbook and record the chapters this unit maps to, then their sections.'
          : 'Record the sections beneath this unit from the printed contents page.',
    };
  }

  // topLevel === 'chapter': the record is a chapter whose sections were
  // never read. Class 6 chapters all have sections, so in practice this
  // is reached only if a future grade is verified at chapter depth only.
  return {
    grain: 'official_chapter',
    plannable: false,
    reason:
      'A textbook chapter whose sections have not been recorded. One chapter is many lessons.',
    requires:
      'Record every section of this chapter from the printed contents page, exactly as titled.',
  };
}

/** Grain counts across a grade, for the coverage report. */
export function grainBreakdownForGrade(
  grade: Grade
): Record<CurriculumGrain, number> {
  const out: Record<CurriculumGrain, number> = {
    official_unit: 0,
    official_chapter: 0,
    official_section: 0,
    official_topic: 0,
  };
  const c = officialCurriculumForGrade(grade);
  if (!c || c.status !== 'primary_source_verified') return out;

  for (const unit of c.units) {
    const sections = sectionsForChapter(unit.officialUnitId);
    if (sections.length > 0) {
      out.official_section += sections.length;
      continue;
    }
    const a = assessGrain(grade, null, unit);
    out[a.grain] += 1;
  }
  return out;
}
