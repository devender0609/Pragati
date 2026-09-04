// v0.71 (curriculum requirement §C/§G) — THE COMPLETENESS INVARIANT.
//
// THE PERMANENT REQUIREMENT
//
// Once a grade's official structure is primary-verified, EVERY official
// record from that source must exist in Pragati's canonical registry —
// every unit, every chapter, every section or topic the source defines.
//
// This says nothing about content. A chapter with no Pragati lesson is
// fine and expected; a chapter MISSING FROM THE REGISTRY is a defect,
// because the product would then be telling a student their textbook
// has fewer chapters than it does.
//
// WHY THIS IS A HARD FAILURE, NOT A REPORT
//
// v0.68 built the registry and v0.70 corrected its labels, but nothing
// stopped a future edit from dropping a chapter. The registry is
// hand-maintained TypeScript; a bad merge or a careless refactor could
// silently remove Chapter 8 and every existing test would still pass,
// because they assert what the registry CONTAINS rather than what the
// source REQUIRES.
//
// So the expected shape of each verified grade is recorded here,
// separately from the registry itself, and `npm run validate:curriculum`
// FAILS on any mismatch. Two independent statements of the same fact:
// if they disagree, a human decides which is wrong.
//
// WHAT THIS FILE IS NOT
//
// It is not a second source of truth for titles. It records the COUNT
// and the identity of each official record, taken from the same primary
// inspection that produced the registry. It cannot detect a title typo
// — only a human with the book can — and it does not pretend to.

import type { Grade } from '../types';
import {
  OFFICIAL_CURRICULA,
  type OfficialCurriculum,
} from './officialCurriculum';

/**
 * The shape a verified grade MUST have, recorded from the primary
 * inspection.
 *
 * `topics` is null where the source was not read at that depth — which
 * is different from a source that defines no topics, and the two must
 * not be conflated.
 */
export type ExpectedOfficialStructure = {
  grade: Grade;
  /** Where these numbers came from. */
  source: string;
  inspectionDate: string;
  /** Top-level entries: units for a syllabus, chapters for a textbook. */
  units: number;
  /** Chapters, where the source names them. Null when it does not. */
  chapters: number | null;
  /** Sections or topics, where the source enumerates them. */
  topics: number | null;
  /** Every top-level entry's exact title, in source order. */
  unitTitles: string[];
  /**
   * v0.72 §2 — SECTION-DEPTH COMPLETENESS, WHERE EVIDENCE REACHES.
   *
   * Per top-level record, the exact count of official sections/topics
   * the source defines. Present ONLY where a human read the source at
   * that depth. Null means not read, and the gate does not check it.
   *
   * Completeness must follow evidence depth: demanding a section count
   * for a source nobody has read at section level would either invent
   * a number or force the gate to be disabled. Class 6 is the one grade
   * verified this deep, so it is the one grade checked this deep.
   */
  sectionsPerUnit: number[] | null;
};

export const EXPECTED_STRUCTURES: ExpectedOfficialStructure[] = [
  {
    grade: 'class6',
    source: 'Ganita Prakash, Grade 6 (NCERT) — full-book archive, Contents page',
    inspectionDate: '2026-01-15',
    units: 10,
    chapters: 10,
    topics: 65,
    // Read from the Contents page of each chapter, chapter by chapter.
    // Sums to 65. If one section disappears, the gate names the chapter.
    sectionsPerUnit: [6, 11, 12, 5, 6, 3, 9, 6, 2, 5],
    unitTitles: [
      'Patterns in Mathematics',
      'Lines and Angles',
      'Number Play',
      'Data Handling and Presentation',
      'Prime Time',
      'Perimeter and Area',
      'Fractions',
      'Playing with Constructions',
      'Symmetry',
      'The Other Side of Zero',
    ],
  },
  {
    grade: 'class9',
    source: 'CBSE Curriculum 2026-27, Mathematics Class IX — course structure table',
    inspectionDate: '2026-08-27',
    units: 6,
    // Uniquely among IX-XII, the Class IX syllabus prints a Chapter Name
    // column, so its chapters are established by the source.
    chapters: 15,
    topics: 15,
    // The CBSE syllabus enumerates topics per unit and Pragati records
    // them, but the SOURCE-verified per-unit breakdown was transcribed
    // from the same table, so checking it against itself would prove
    // nothing. Section-depth completeness applies where a textbook was
    // read at that depth.
    sectionsPerUnit: null,
    unitTitles: [
      'Number System',
      'Algebra',
      'Coordinate Geometry',
      'Geometry',
      'Mensuration',
      'Statistics and Probability',
    ],
  },
  {
    grade: 'class10',
    source: 'CBSE Curriculum 2026-27, Mathematics Class X (041/241) — course structure',
    inspectionDate: '2026-08-27',
    units: 7,
    // No chapter-name column. Several topic titles resemble NCERT
    // chapter names; resembling is not evidence.
    chapters: null,
    topics: 15,
    // The CBSE syllabus enumerates topics per unit and Pragati records
    // them, but the SOURCE-verified per-unit breakdown was transcribed
    // from the same table, so checking it against itself would prove
    // nothing. Section-depth completeness applies where a textbook was
    // read at that depth.
    sectionsPerUnit: null,
    unitTitles: [
      'Number Systems',
      'Algebra',
      'Coordinate Geometry',
      'Geometry',
      'Trigonometry',
      'Mensuration',
      'Statistics and Probability',
    ],
  },
  {
    grade: 'class11',
    source: 'CBSE Curriculum 2026-27, Mathematics Classes XI-XII (041) — Class XI structure',
    inspectionDate: '2026-08-27',
    units: 5,
    chapters: null,
    topics: 14,
    sectionsPerUnit: null,
    unitTitles: [
      'Sets and Functions',
      'Algebra',
      'Coordinate Geometry',
      'Calculus',
      'Statistics and Probability',
    ],
  },
  {
    grade: 'class12',
    source: 'CBSE Curriculum 2026-27, Mathematics Classes XI-XII (041) — Class XII structure',
    inspectionDate: '2026-08-27',
    units: 6,
    chapters: null,
    topics: 13,
    sectionsPerUnit: null,
    unitTitles: [
      'Relations and Functions',
      'Algebra',
      'Calculus',
      'Vectors and Three-dimensional Geometry',
      'Linear Programming',
      'Probability',
    ],
  },
];

/** Chapters established by the source, or null. Derived from the record
 *  passed in, so an injected registry is checked rather than the global. */
function countChapters(c: OfficialCurriculum): number | null {
  if (c.topLevel === 'chapter') return c.units.length;
  if (c.units.every((u) => u.chaptersEstablished)) {
    return c.units.reduce((n, u) => n + u.chapters.length, 0);
  }
  return null;
}

/** Topics, or null where the source was not read at that depth. */
function countTopics(c: OfficialCurriculum): number | null {
  if (c.units.some((u) => !u.topicsKnown)) return null;
  return c.units.reduce((n, u) => n + u.topics.length, 0);
}

export function expectedFor(grade: Grade): ExpectedOfficialStructure | null {
  return EXPECTED_STRUCTURES.find((e) => e.grade === grade) ?? null;
}

export type CompletenessFailure = {
  grade: Grade;
  code:
    | 'VERIFIED_GRADE_HAS_NO_EXPECTED_STRUCTURE'
    | 'EXPECTED_STRUCTURE_FOR_UNVERIFIED_GRADE'
    | 'OFFICIAL_UNIT_COUNT_MISMATCH'
    | 'OFFICIAL_UNIT_MISSING'
    | 'OFFICIAL_UNIT_UNEXPECTED'
    | 'OFFICIAL_UNIT_OUT_OF_ORDER'
    | 'OFFICIAL_CHAPTER_COUNT_MISMATCH'
    | 'OFFICIAL_TOPIC_COUNT_MISMATCH'
    /** v0.72 §2 — a verified SECTION vanished from a verified chapter. */
    | 'OFFICIAL_SECTION_COUNT_MISMATCH';
  message: string;
};

/**
 * Compare every primary-verified grade against its expected structure.
 *
 * Returns failures, which `validate:curriculum` treats as errors. An
 * empty result is the only acceptable state for a shipped build.
 */
export function checkOfficialCompleteness(
  // Injectable so a test can PROVE the gate fires on a missing record.
  // Mutating the real registry from a test is unreliable across module
  // instances, and a guard nobody has watched fail is a guard nobody
  // knows works.
  curricula: OfficialCurriculum[] = OFFICIAL_CURRICULA,
  expected: ExpectedOfficialStructure[] = EXPECTED_STRUCTURES
): CompletenessFailure[] {
  const failures: CompletenessFailure[] = [];
  const expectedIn = (g: Grade) => expected.find((e) => e.grade === g) ?? null;

  const verified: OfficialCurriculum[] = curricula.filter(
    (c) => c.status === 'primary_source_verified'
  );

  // Every verified grade needs an expected structure, or the invariant
  // silently does not apply to it — which is how a guard stops guarding.
  for (const c of verified) {
    if (!expectedIn(c.grade)) {
      failures.push({
        grade: c.grade,
        code: 'VERIFIED_GRADE_HAS_NO_EXPECTED_STRUCTURE',
        message:
          `${c.grade} is primary_source_verified but has no expected structure recorded. ` +
          `Add one from the same primary inspection, or the completeness invariant does not cover it.`,
      });
    }
  }

  // And the converse: an expected structure for an unverified grade
  // would assert a count nobody has read.
  for (const e of expected) {
    const c = curricula.find((x) => x.grade === e.grade) ?? null;
    if (!c || c.status !== 'primary_source_verified') {
      failures.push({
        grade: e.grade,
        code: 'EXPECTED_STRUCTURE_FOR_UNVERIFIED_GRADE',
        message:
          `${e.grade} has an expected structure but is not primary_source_verified. ` +
          `An expected count for an unread source is an invented count.`,
      });
    }
  }

  for (const c of verified) {
    const e = expectedIn(c.grade);
    if (!e) continue;

    if (c.units.length !== e.units) {
      failures.push({
        grade: c.grade,
        code: 'OFFICIAL_UNIT_COUNT_MISMATCH',
        message:
          `${c.grade}: the registry holds ${c.units.length} official records but ${e.source} defines ${e.units}. ` +
          `Every official record must be represented, even where Pragati has no content for it.`,
      });
    }

    const actual = c.units.map((u) => u.title);
    for (const title of e.unitTitles) {
      if (!actual.includes(title)) {
        failures.push({
          grade: c.grade,
          code: 'OFFICIAL_UNIT_MISSING',
          message:
            `${c.grade}: official record "${title}" is in the verified source but not in the registry. ` +
            `A missing Pragati lesson must never remove an official curriculum record.`,
        });
      }
    }
    for (const title of actual) {
      if (!e.unitTitles.includes(title)) {
        failures.push({
          grade: c.grade,
          code: 'OFFICIAL_UNIT_UNEXPECTED',
          message: `${c.grade}: the registry holds "${title}", which the verified source does not define.`,
        });
      }
    }

    // Order is part of the structure: a textbook's chapters are
    // sequenced, and a student reading them out of order is being shown
    // a different curriculum.
    const expectedOrder = e.unitTitles.filter((t) => actual.includes(t));
    const actualOrder = actual.filter((t) => e.unitTitles.includes(t));
    if (JSON.stringify(expectedOrder) !== JSON.stringify(actualOrder)) {
      failures.push({
        grade: c.grade,
        code: 'OFFICIAL_UNIT_OUT_OF_ORDER',
        message: `${c.grade}: registry order does not match the source order.`,
      });
    }

    const chapters = countChapters(c);
    if (chapters !== e.chapters) {
      failures.push({
        grade: c.grade,
        code: 'OFFICIAL_CHAPTER_COUNT_MISMATCH',
        message:
          `${c.grade}: chapter count is ${chapters === null ? 'unknown' : chapters}, expected ` +
          `${e.chapters === null ? 'unknown' : e.chapters}. Null and a number are different claims.`,
      });
    }

    // v0.72 §2 — section depth, per unit, where evidence reaches.
    //
    // The top-level gate proves ten chapters exist. It does NOT notice
    // if Chapter 7 quietly loses §7.5, because the chapter is still
    // there and the topic TOTAL is checked only in aggregate — one
    // section could vanish from Chapter 7 and reappear as a duplicate
    // elsewhere and the total would still be 65.
    //
    // Checking per unit closes that, and names the chapter when it
    // fails, so the message points at the file to open.
    if (e.sectionsPerUnit) {
      if (e.sectionsPerUnit.length !== c.units.length) {
        failures.push({
          grade: c.grade,
          code: 'OFFICIAL_SECTION_COUNT_MISMATCH',
          message:
            `${c.grade}: expected section counts for ${e.sectionsPerUnit.length} records but the registry holds ${c.units.length}.`,
        });
      } else {
        c.units.forEach((u, i) => {
          const expected = e.sectionsPerUnit![i];
          const actual = u.topicsKnown ? u.topics.length : null;
          if (actual !== expected) {
            failures.push({
              grade: c.grade,
              code: 'OFFICIAL_SECTION_COUNT_MISMATCH',
              message:
                `${c.grade} "${u.title}": the registry holds ${
                  actual === null ? 'an unknown number of' : actual
                } official sections; ${e.source} defines ${expected}. ` +
                `Every official record must be represented, content or not.`,
            });
          }
        });
      }
    }

    const topics = countTopics(c);
    if (topics !== e.topics) {
      failures.push({
        grade: c.grade,
        code: 'OFFICIAL_TOPIC_COUNT_MISMATCH',
        message:
          `${c.grade}: topic count is ${topics === null ? 'unknown' : topics}, expected ` +
          `${e.topics === null ? 'unknown' : e.topics}.`,
      });
    }
  }

  return failures;
}

export type GradeCompletenessRow = {
  grade: Grade;
  verified: boolean;
  /** For a verified grade: are ALL official records represented? */
  allOfficialRecordsRepresented: boolean | null;
  expectedUnits: number | null;
  registryUnits: number | null;
};

/** Per-grade completeness, for the teacher table and the report. */
export function completenessByGrade(): GradeCompletenessRow[] {
  const failures = checkOfficialCompleteness();
  return OFFICIAL_CURRICULA.map((c: OfficialCurriculum) => {
    const verified = c.status === 'primary_source_verified';
    const e = expectedFor(c.grade);
    return {
      grade: c.grade,
      verified,
      allOfficialRecordsRepresented: verified
        ? failures.every((f) => f.grade !== c.grade)
        : null,
      expectedUnits: e?.units ?? null,
      registryUnits: verified ? c.units.length : null,
    };
  });
}
