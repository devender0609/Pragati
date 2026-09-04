// v0.68 (Classes 1–12 spec, §E) — WHAT A STUDENT SEES FOR ANY GRADE.
//
// THE RULE
//
// For a grade whose official structure is verified, the student sees
// the COMPLETE official chapter list, in the source's order, with an
// honest availability state per chapter. A chapter Pragati has no
// lesson for still appears; it just says so.
//
// For a grade whose structure is NOT verified, the student is told the
// truth — that the chapter list is not ready — rather than being shown
// Pragati's internal module inventory dressed as a curriculum. Six
// legacy module names presented as "Class 3 Mathematics" is a false
// statement about the curriculum, and it is the defect this whole
// spec exists to remove.
//
// LANGUAGE
//
// No governance vocabulary reaches this layer. There is no
// "primary_source_verified", no "pending verification", no
// "legacy_module_inventory_only". A student gets chapter titles and one
// plain sentence.

import type { Grade } from '../types';
import {
  officialCurriculumForGrade,
  isGradeStructureVerified,
  officialChapterList,
  structureNoun,
  chaptersEstablished,
} from './officialCurriculum';
import { getStudentChapterAvailability } from './eligibilityPolicy';

export type OfficialChapterAvailability =
  | 'ready_to_learn'
  | 'practice_available'
  | 'continue'
  | 'not_available_yet';

export type OfficialChapterCard = {
  officialUnitId: string;
  number: number;
  title: string;
  availability: OfficialChapterAvailability;
  /** Student-facing. Plain language only. */
  statusLine: string;
  /** Named official sub-topics, where the source enumerates them. */
  topicCount: number | null;
};

export type GradeCurriculumView =
  | {
      kind: 'verified';
      grade: Grade;
      documentTitle: string;
      /**
       * v0.69 §20 — what these entries actually ARE.
       *
       * 'chapter' for Classes 6 and 9, whose sources name chapters.
       * 'unit' for Classes 10-12, whose syllabus is organised into
       * units and whose textbook nobody has read. The UI prints this
       * noun rather than assuming "chapter".
       */
      entryNoun: { singular: string; plural: string };
      chapters: OfficialChapterCard[];
      readyCount: number;
      /** One plain sentence for the student. */
      summaryLine: string;
    }
  | {
      kind: 'structure_not_ready';
      grade: Grade;
      /** Never names internal modules or governance states. */
      message: string;
    };

const STATUS_LINE: Record<OfficialChapterAvailability, string> = {
  ready_to_learn: 'Ready to learn',
  practice_available: 'Practice',
  continue: 'Continue',
  not_available_yet: 'Not available yet',
};

/**
 * The complete official chapter list for a grade, as a student sees it.
 *
 * Availability is DERIVED from the existing eligibility policy — the
 * same one the teacher surfaces read — so a student and their teacher
 * cannot be told different things. Availability never removes a chapter
 * from the list.
 */
export function gradeCurriculumView(grade: Grade): GradeCurriculumView {
  const c = officialCurriculumForGrade(grade);

  if (!c || !isGradeStructureVerified(grade)) {
    return {
      kind: 'structure_not_ready',
      grade,
      message:
        'The chapter list for this class is not ready yet. It will appear here once it is.',
    };
  }

  // §19 — prefer a real chapter list where the source establishes one.
  // Class 9's fifteen chapters are more useful to a student than its six
  // syllabus units, and both are true. Classes 10-12 have no chapter
  // list to prefer, so their units are shown AS units.
  const chapterList = officialChapterList(grade);
  const entries =
    chapterList && chaptersEstablished(grade)
      ? chapterList.map((ch) => ({
          id: ch.id,
          number: ch.number,
          title: ch.title,
          topicsKnown: false,
          topicCount: 0,
        }))
      : c.units.map((u) => ({
          id: u.officialUnitId,
          number: u.number,
          title: u.title,
          topicsKnown: u.topicsKnown,
          topicCount: u.topics.length,
        }));

  const chapters: OfficialChapterCard[] = entries.map((u) => {
    const e = getStudentChapterAvailability(u.id);
    const availability: OfficialChapterAvailability =
      e.availability !== 'available'
        ? 'not_available_yet'
        : e.hasEligibleLearn
          ? 'ready_to_learn'
          : 'practice_available';
    return {
      officialUnitId: u.id,
      number: u.number,
      title: u.title,
      availability,
      statusLine: STATUS_LINE[availability],
      topicCount: u.topicsKnown ? u.topicCount : null,
    };
  });

  const ready = chapters.filter(
    (ch) => ch.availability !== 'not_available_yet'
  ).length;

  // §20 — the noun follows the source. If a chapter list was used it is
  // chapters whatever the top level was; otherwise it is whatever the
  // top level is.
  const noun =
    chapterList && chaptersEstablished(grade)
      ? { singular: 'chapter', plural: 'chapters' }
      : structureNoun(grade);

  return {
    kind: 'verified',
    grade,
    documentTitle: c.documentTitle ?? '',
    entryNoun: noun,
    chapters,
    readyCount: ready,
    summaryLine:
      ready === 0
        ? `${chapters.length} ${noun.plural}. None are ready yet.`
        : `${chapters.length} ${noun.plural} · ${ready} you can start now`,
  };
}

/**
 * §J — an official chapter may never disappear because Pragati has no
 * content for it.
 *
 * Stated as a function so a test can assert it directly rather than
 * inspecting rendered output.
 */
export function officialChaptersAlwaysListed(grade: Grade): boolean {
  const c = officialCurriculumForGrade(grade);
  if (!c || c.status !== 'primary_source_verified') return true;
  const view = gradeCurriculumView(grade);
  if (view.kind !== 'verified') return false;
  const expected = officialChapterList(grade)?.length ?? c.units.length;
  return view.chapters.length === expected;
}
