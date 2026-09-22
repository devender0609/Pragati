// ===========================================================================
// v0.83.1 §E — AN OFFICIAL RECORD IS NOT A PRAGATI LESSON.
//
// THE MISTAKE THIS PREVENTS
//
// v0.83 produced a backlog of 477 "authoring records" — the finest
// numbered level each textbook defines. That is a SOURCE-GRAIN count and
// a good production denominator. It is not a count of lessons, and
// treating it as one would be wrong in both directions:
//
//   Classes 1-5 define no sections at all. "Shapes Around Us" is one
//   official chapter and plainly several distinct objectives.
//   A short Class 11 section may need one lesson, or half of one.
//
// So Pragati's own teaching unit is modelled separately, with its own id
// space, and always points BACK at the official record it serves. An
// instructional unit is Pragati's editorial decision; a section is the
// book's. The two are never presented as the same kind of thing, and a
// Pragati unit is never shown to a student or teacher as if NCERT had
// defined it.
//
// WHY THIS FILE IS EMPTY OF DATA
//
// Deliberately. Decomposition requires reading the actual pages, which
// is the next phase. Inventing units from chapter titles is exactly the
// Number Play error — §3.1 and §3.3 were authored from their titles and
// taught mathematics the source does not teach. The registry below stays
// empty until someone has read the pages, and a test enforces that.
// ===========================================================================

import type { Grade } from '../types';
import { MASTER_RECORDS } from './curriculumMasterMap';

/** How far decomposition has got for one official record. */
export type DecompositionStatus =
  /** Nobody has read the pages yet. Every record is here today. */
  | 'not_started'
  /** Pages read, objectives listed, units not yet written. */
  | 'intent_inspected'
  /** Units proposed by a maintainer, not yet reviewed. */
  | 'decomposition_proposed'
  /** An educator or curriculum specialist has accepted the split. */
  | 'decomposition_reviewed';

export type PragatiInstructionalUnit = {
  /** Pragati's own id. The `pragati_` prefix is load-bearing: it must be
   *  impossible to mistake for an NCERT or CBSE record id. */
  instructionalUnitId: `pragati_iu_${string}`;
  /** The official record this serves. Always present: a Pragati unit may
   *  not exist without a source record behind it. */
  officialRecordId: string;
  grade: Grade;
  /** Printed pages this unit was built from, e.g. "159-160". Null is not
   *  allowed once the status passes 'not_started'. */
  sourcePageRange: string | null;
  /** One objective, in Pragati's words, derived from the pages. */
  objective: string;
  /** Other instructional units or official records assumed first. */
  prerequisiteRefs: string[];
  /** What the mathematics needs to be seen with — decided from the
   *  pages, never from the title. */
  representationNeeds: string[];
  intentInspectionStatus: 'not_inspected' | 'page_level_inspected';
  decompositionStatus: DecompositionStatus;
  /** Who decided this split, and when. */
  provenance: { decidedBy: string; decidedOn: string; evidence: string } | null;
};

/**
 * Every Pragati instructional unit. Empty by design at v0.83.1.
 *
 * Populating it is the next approved phase and requires page-level
 * reading per record.
 */
export const PRAGATI_INSTRUCTIONAL_UNITS: PragatiInstructionalUnit[] = [];

export function instructionalUnitsFor(officialRecordId: string): PragatiInstructionalUnit[] {
  return PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => u.officialRecordId === officialRecordId);
}

export type DecompositionCoverage = {
  /** Source-grain records. NOT a lesson count. */
  officialAuthoringRecords: number;
  /** Records whose pages have been read. */
  intentInspected: number;
  /** Pragati units that exist. Zero today. */
  instructionalUnits: number;
  /** How many lessons the product will need: unknowable until the pages
   *  are read, and reported as null rather than guessed from records. */
  projectedLessonCount: null;
};

export function decompositionCoverage(records: number): DecompositionCoverage {
  return {
    officialAuthoringRecords: records,
    intentInspected: MASTER_RECORDS.filter(
      (r) => r.intentStatus === 'page_level_inspected'
    ).length,
    instructionalUnits: PRAGATI_INSTRUCTIONAL_UNITS.length,
    projectedLessonCount: null,
  };
}

/**
 * The sentence any report must use when quoting the record total, so the
 * source-grain count is never read as a lesson count.
 */
export function sourceGrainCaveat(records: number): string {
  return (
    `${records} is a count of OFFICIAL RECORDS at the grain each source defines ` +
    `— sections where a book numbers them, chapters where it does not. It is not ` +
    `a count of Pragati lessons. How many lessons a record needs is decided by ` +
    `reading its pages, which has not been done except where Pragati has already ` +
    `authored, so the lesson total is UNKNOWN rather than ${records}.`
  );
}
