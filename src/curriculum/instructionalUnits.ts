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

import decompositionJson from './data/instructionalDecomposition.json';
import { inspectedRecordsRef, authoringUnits } from './curriculumMasterMap';

/**
 * v0.84.0 — THE DECOMPOSITION SCHEMA, NOW POPULATED FROM THE PAGES.
 *
 * Until v0.83.5 this file was a schema with an empty registry, on
 * purpose: inventing units from chapter titles is the Number Play
 * error. Units are now written only after someone has read the actual
 * instructional pages, and every unit carries the page evidence that
 * would let another person reproduce the reading.
 */

/** Has anyone read the pages behind this record? Never a boolean: the
 *  interesting cases are the uncertain ones. */
export type IntentInspectionStatus =
  | 'NOT_INSPECTED'
  | 'INSPECTED'
  /** Read, but the mathematics the pages intend is genuinely unclear. */
  | 'AMBIGUOUS'
  /** The source could not be fetched or read. */
  | 'BLOCKED_SOURCE'
  | 'NEEDS_HUMAN_CHECK';

/** How far decomposition has got. "A record exists" is not "ready to write". */
export type DecompositionStatus =
  | 'NOT_DECOMPOSED'
  | 'DRAFT_DECOMPOSITION'
  | 'EVIDENCE_COMPLETE'
  | 'NEEDS_HUMAN_CHECK'
  | 'READY_FOR_AUTHORING';

/** What the source pages are doing, judged from the pages themselves. */
export type InstructionalRole =
  | 'NEW_INSTRUCTION'
  | 'GUIDED_APPLICATION'
  | 'PRACTICE'
  | 'REVIEW'
  | 'ENRICHMENT'
  | 'ASSESSMENT_LIKE_ACTIVITY'
  | 'SUMMARY'
  | 'REFERENCE'
  | 'NON_INSTRUCTIONAL';

/** Whether the source itself names the misconceptions, or we would be
 *  inventing them. Never inferred from silence. */
export type MisconceptionEvidence =
  | 'SOURCE_EXPLICIT'
  | 'EVIDENCE_SUPPORTED'
  | 'TO_BE_DEVELOPED'
  | 'UNKNOWN';

/**
 * v0.84.0 hardening — HOW MUCH OF THE PAGE WAS ACTUALLY SEEN.
 *
 * The first pass used `digest.py`, which prints each page's folio,
 * headings and opening text. That is an index, not an inspection: the
 * mathematics of an early-primary page often lives in the ten frame, the
 * number strip, the array or the picture task, none of which the opening
 * line mentions. So evidence depth is recorded per unit, and a unit
 * cannot be authoring-ready on an index alone.
 */
/**
 * v0.84.0 checkpoint 3 — PER-PAGE EVIDENCE.
 *
 * Checkpoint 2 recorded evidence per UNIT, which let a unit spanning
 * four pages count as "FULL_PAGE_INSPECTED" when one page had been
 * rendered. The name promised more than the data proved. Evidence is now
 * recorded per page, and the questions are asked per page:
 *
 *   was the full text of THIS page read?
 *   does THIS page carry mathematics that only the visual shows?
 *   if so, was THIS page actually looked at?
 *
 * A page needing no visual inspection says so, with a reason, rather
 * than being silently excused.
 */
export type PageEvidence = {
  pdfPage: number;
  printedPage: number | null;
  fullTextInspected: boolean;
  /** Does the mathematics of this page live in a diagram, ten frame,
   *  strip, array, picture task or similar? */
  visualInspectionRequired: boolean;
  visualInspected: boolean;
  /** Why visual inspection was or was not required, in one line. */
  note: string;
};

export type EvidenceDepth =
  /** Headings and opening text only. Navigation, not evidence. */
  | 'DIGEST_ONLY'
  /** Complete extracted text of every page in the range. */
  | 'FULL_TEXT_INSPECTED'
  /**
   * Every page's full text read, and every page that needed a visual
   * check actually looked at. This is now derived from the page ledger,
   * never asserted by hand.
   */
  | 'FULL_PAGE_INSPECTED';

export type SourceEvidence = {
  /** Book code as published, e.g. "aejm1" (Joyful Mathematics, Class 1). */
  bookId: string;
  bookPart: string | null;
  officialChapterId: string;
  /** Null for Classes 1-5, whose books define no numbered sections. */
  officialSectionId: string | null;
  /** Printed folio, as on the page. */
  printedPageStart: number | null;
  printedPageEnd: number | null;
  /** PDF page index, kept because the two differ and the Class 6 page
   *  defect came from recording only one of them. */
  pdfPageStart: number;
  pdfPageEnd: number;
  inspectedOn: string;
  /** What these pages establish, in one line. */
  establishes: string;
  /** Set when the source itself could not be read. */
  blockedSource?: boolean;
  /** How much of the range was seen. */
  evidenceDepth: EvidenceDepth;
  /** Does the mathematics live in the visuals — ten frames, number
   *  strips, arrays, pictographs, shape tasks? If so, text alone cannot
   *  settle it. */
  visuallyDependent: boolean;
  /** Printed pages actually rendered and looked at, where that was done. */
  visualPagesInspected: number[];
  /** One entry per PDF page in the range. The authority for every
   *  evidence question; `evidenceDepth` is derived from it. */
  pageEvidence: PageEvidence[];
  /** When the pages were first read, and when the evidence last changed.
   *  Both are real work dates. */
  firstInspectedOn: string;
  lastEvidenceUpdatedOn: string;
};

export type PragatiInstructionalUnit = {
  /** `pragati_iu_g06_...`. The prefix is load-bearing: it must be
   *  impossible to mistake for an NCERT or CBSE record id. */
  instructionalUnitId: `pragati_iu_${string}`;
  grade: Grade;
  classNumber: number;
  /** The official record this serves — chapter for Classes 1-5, section
   *  where the book numbers them. A unit may not exist without one. */
  officialRecordId: string;
  /** Where several official records feed one unit. Each is kept. */
  additionalOfficialRecordIds: string[];
  sourceEvidence: SourceEvidence;
  /** Pragati's title for the teaching unit. NOT an NCERT section name. */
  instructionalTitle: string;
  mathematicalObjective: string;
  /** "I can …", in the student's voice. */
  studentCanStatement: string;
  mathematicalIdeas: string[];
  representationsNeeded: string[];
  /** Ids of earlier units, or official record ids, or a plain-language
   *  dependency where the prerequisite unit is not identified yet. */
  prerequisites: string[];
  vocabulary: string[];
  reasoningDemand: 'recall' | 'procedure' | 'explain' | 'generalise' | 'prove';
  applicationContext: string | null;
  instructionalRole: InstructionalRole;
  likelyMisconceptionsStatus: MisconceptionEvidence;
  /** 1 (short) to 5 (needs several sittings). A planning estimate. */
  estimatedInstructionalComplexity: 1 | 2 | 3 | 4 | 5;
  /** Order within its official record. */
  suggestedUnitSequence: number;
  /** Why this record was split into more than one unit, or null. */
  splitReason: string | null;
  /** Why records were combined, with every source kept, or null. */
  mergeRelationship: string | null;
  /** Always 'pragati_created'. Present so the distinction survives
   *  serialisation into any document or API. */
  sourceVsPragatiLabel: 'pragati_created';
  intentInspectionStatus: IntentInspectionStatus;
  decompositionStatus: DecompositionStatus;
  humanReviewStatus: 'not_reviewed' | 'flagged_for_review' | 'reviewed';
  /** Existing Pragati artifact mapped to this unit, and how well. */
  existingArtifact: {
    officialSectionId: string;
    match: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'MULTI_UNIT_COVERAGE' | 'OVER_SCOPED' | 'UNDER_SCOPED' | 'SOURCE_ALIGNMENT_ISSUE';
    note: string;
  } | null;
  notes: string | null;
  /** v0.84.0 checkpoint 5 §13 — the specific curriculum question a
   *  human must answer. Present only when the source is complete and the
   *  remaining doubt is a judgement, never a stand-in for unread pages. */
  humanJudgementQuestion?: string;
  /** v0.84.0 hardening §4 — the verdict of the re-audit against the
   *  stronger evidence standard. */
  hardeningClassification?:
    | 'CONFIRMED'
    | 'NEEDS_SPLIT'
    | 'NEEDS_MERGE'
    | 'NEEDS_SCOPE_CHANGE'
    | 'NOT_SUPPORTED'
    | 'NEEDS_HUMAN_CHECK';
  hardeningNote?: string;
};

/**
 * v0.84.0 checkpoint 4 §3/§4 — PRAGATI'S OWN SEGMENTATION, LABELLED AS
 * SUCH.
 *
 * Checkpoint 3 recorded the Class 2 Puzzles pages under the id
 * `ncert_bejm1_ch11_puzzles`. NCERT defines no such record. Inventing an
 * `ncert_*` id to hold our own reading is precisely the confusion the
 * whole project exists to avoid, so internal material NCERT did not
 * number is now a SourceSegment: a Pragati-created pointer into a real
 * official record, in its own id space.
 */
export type SourceSegment = {
  sourceSegmentId: `pragati_srcseg_${string}`;
  /** The real NCERT record these pages belong to. */
  officialRecordId: string;
  /**
   * Either a heading printed in the book ("Puzzles") or, when there is
   * none, a page-range description Pragati generates. The flag says
   * which, because a generated range must agree with the evidence and a
   * real heading must never be rewritten.
   */
  sourceLabel: string;
  sourceLabelIsFromBook?: boolean;
  role: InstructionalRole | 'UNRESOLVED';
  justification: string;
  sourceEvidence: SourceEvidence;
};

/**
 * v0.84.0 checkpoint 7 §6 — WHOLE RECORDS ONLY.
 *
 * This means: a complete official record was inspected and produced no
 * instructional target at all. It is not a practice page, a review
 * subrange or a Notes page inside a chapter that does teach — those are
 * SourceSegments. Class 1 Chapter 13's rehearsal pages were modelled
 * here while the same chapter carried four units, which made the chapter
 * look non-instructional; they are a segment now.
 */
export type NonInstructionalRecord = {
  officialRecordId: string;
  grade: Grade;
  role: InstructionalRole;
  justification: string;
  sourceEvidence: SourceEvidence;
};

/** The full page extent of an official record, so "whole record
 *  inspected" can be checked rather than assumed. */
export type RecordExtent = {
  officialRecordId: string;
  pdfPageStart: number;
  pdfPageEnd: number;
  printedPageStart: number | null;
  printedPageEnd: number | null;
};

/**
 * v0.84.0 checkpoint 8 §2 — A REASON FOR EXACTLY THIS PAIR.
 *
 * `overlapAudit()` used to report `A.reason ?? B.reason`, so a merge
 * note written about a different unit could be attached to any overlap
 * that happened to involve A. A justification is now keyed by both ids
 * and has to name the two objects that actually share the pages.
 */
export type OverlapJustification = {
  a: string;
  b: string;
  reason: string;
};

type DecompositionFile = {
  generatedFrom: string;
  units: PragatiInstructionalUnit[];
  nonInstructional: NonInstructionalRecord[];
  sourceSegments: SourceSegment[];
  overlapJustifications?: OverlapJustification[];
  recordExtents: RecordExtent[];
  /** Classes whose page-level pass is finished, and what remains. */
  classProgress: Array<{
    classNumber: number;
    /**
     * COMPLETE means every page of every chapter was inspected to the
     * depth its mathematics needs, and what remains is human judgement
     * rather than unread source. Unread pages keep a class IN_PROGRESS
     * however many units it already has.
     */
    /**
     * v0.84.0 checkpoint 3 §14/§15 — derived, never typed.
     * DECOMPOSITION_SOURCE_COMPLETE means every page of every official
     * record was inspected to the depth its mathematics needs. Units may
     * still be flagged for human judgement in such a class: a curriculum
     * question is not unread source. Unread pages always mean
     * IN_PROGRESS.
     */
    status:
      | 'DECOMPOSITION_SOURCE_COMPLETE'
      | 'COMPLETE'
      | 'IN_PROGRESS'
      | 'NOT_STARTED'
      | 'BLOCKED_SOURCE';
    chaptersInspected: number;
    chaptersTotal: number;
    /** Pages seen through the index only. Navigation, not evidence. */
    pagesIndexed?: number;
    /** Pages in the official records' full extent. */
    pagesInScope?: number;
    /** Pages whose mathematics is carried by the picture. */
    visualPagesRequired?: number;
    /**
     * v0.84.0 checkpoint 10 §8 — `pagesUnresolved` used to count only
     * pages whose text was unread, and read 0 for Class 3 while 107
     * picture-carried pages were still unseen. The gaps are named
     * separately now; this field is kept as the text figure and says so.
     */
    pagesUnresolved?: number;
    /** Pages whose full text has not been read. */
    pagesFullTextPending?: number;
    /** Picture-carried pages not yet rendered and looked at. */
    visualPagesPending?: number;
    /** Pages missing either kind of required evidence. */
    pagesEvidenceIncomplete?: number;
    officialRecordsPartiallyInspected?: number;
    officialRecordsIndexedOnly?: number;
    /** Official records in the class, from the curriculum not the data. */
    officialRecordsTotal?: number;
    officialRecordsFullyInspected?: number;
    /** Pages whose full extracted text was read. */
    pagesFullyInspected: number;
    /** Pages rendered and actually looked at. */
    visualPagesInspected?: number;
    /** Deprecated alias of pagesFullyInspected, kept so older reports
     *  do not silently read a different number. */
    pagesInspected: number;
    note: string;
  }>;
};

const DATA = decompositionJson as unknown as DecompositionFile;

export const PRAGATI_INSTRUCTIONAL_UNITS: PragatiInstructionalUnit[] = DATA.units;
export const NON_INSTRUCTIONAL_RECORDS: NonInstructionalRecord[] = DATA.nonInstructional;
export const CLASS_DECOMPOSITION_PROGRESS = DATA.classProgress;
export const RECORD_EXTENTS: RecordExtent[] = DATA.recordExtents ?? [];
export const SOURCE_SEGMENTS: SourceSegment[] = DATA.sourceSegments ?? [];
export const OVERLAP_JUSTIFICATIONS: OverlapJustification[] = DATA.overlapJustifications ?? [];

/** The justification authored for this exact pair, in either order. */
export function overlapJustificationFor(a: string, b: string): string | null {
  const hit = OVERLAP_JUSTIFICATIONS.find(
    (j) => (j.a === a && j.b === b) || (j.a === b && j.b === a)
  );
  return hit ? hit.reason : null;
}

export function unitsForClass(n: number): PragatiInstructionalUnit[] {
  return PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => u.classNumber === n);
}

export function instructionalUnitsFor(officialRecordId: string): PragatiInstructionalUnit[] {
  return PRAGATI_INSTRUCTIONAL_UNITS.filter(
    (u) =>
      u.officialRecordId === officialRecordId ||
      u.additionalOfficialRecordIds.includes(officialRecordId)
  );
}

/**
 * A record is covered when a unit serves it, or a segment accounts for
 * part of it, or the whole record was read and judged non-instructional.
 * Silence is not coverage — and a non-instructional entry only counts
 * when it spans the record's whole extent, so a small review subrange
 * can no longer make a chapter look accounted for.
 */
/**
 * v0.84.0 checkpoint 8 §7 — SOURCE ACCOUNTING IS NOT INSTRUCTIONAL
 * COVERAGE.
 *
 * `recordIsCovered()` accepted any source segment as coverage of the
 * whole record, so a single PRACTICE page could make a chapter with no
 * teaching units look accounted for. That is harmless while every
 * Classes 1-2 chapter has units; it would quietly hide missing lessons
 * across Classes 3-12. The two questions are now asked separately.
 *
 * SOURCE ACCOUNTED FOR: every page of the record is represented by a
 * unit, a segment, or a whole-record non-instructional classification.
 */
export function recordSourceIsAccountedFor(officialRecordId: string): boolean {
  const ext = RECORD_EXTENTS.find((e) => e.officialRecordId === officialRecordId);
  if (!ext) return false;
  const covered = new Set<number>();
  const add = (e: SourceEvidence) => {
    for (let p = e.pdfPageStart; p <= e.pdfPageEnd; p += 1) covered.add(p);
  };
  for (const u of instructionalUnitsFor(officialRecordId)) add(u.sourceEvidence);
  for (const s of SOURCE_SEGMENTS.filter((s) => s.officialRecordId === officialRecordId)) add(s.sourceEvidence);
  for (const r of NON_INSTRUCTIONAL_RECORDS.filter((r) => r.officialRecordId === officialRecordId)) add(r.sourceEvidence);
  for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) if (!covered.has(p)) return false;
  return true;
}

/**
 * INSTRUCTIONALLY ACCOUNTED FOR: the record's teaching content has
 * units, or the whole record was inspected and judged to produce none.
 * A segment never satisfies this: it accounts for the role of its own
 * pages and nothing more.
 */
export function recordHasInstructionalDisposition(officialRecordId: string): boolean {
  if (instructionalUnitsFor(officialRecordId).length > 0) return true;
  return NON_INSTRUCTIONAL_RECORDS.some((r) => {
    if (r.officialRecordId !== officialRecordId) return false;
    const ext = RECORD_EXTENTS.find((e) => e.officialRecordId === officialRecordId);
    if (!ext) return false;
    return (
      r.sourceEvidence.pdfPageStart === ext.pdfPageStart &&
      r.sourceEvidence.pdfPageEnd === ext.pdfPageEnd
    );
  });
}

/** @deprecated Ambiguous. Use `recordHasInstructionalDisposition` for gap
 *  reporting, or `recordSourceIsAccountedFor` for page accounting. */
export function recordIsCovered(officialRecordId: string): boolean {
  if (instructionalUnitsFor(officialRecordId).length > 0) return true;
  return NON_INSTRUCTIONAL_RECORDS.some((r) => {
    if (r.officialRecordId !== officialRecordId) return false;
    const ext = RECORD_EXTENTS.find((e) => e.officialRecordId === officialRecordId);
    if (!ext) return false;
    return (
      r.sourceEvidence.pdfPageStart === ext.pdfPageStart &&
      r.sourceEvidence.pdfPageEnd === ext.pdfPageEnd
    );
  });
}

/** Every overlapping pair of ranges inside one official record, whatever
 *  kind of object each side is. Duplicate coverage hides stale records,
 *  so it is listed rather than assumed harmless. */
export function overlapAudit(): Array<{
  officialRecordId: string;
  a: string;
  b: string;
  pages: number[];
  reason: string | null;
}> {
  type Item = { id: string; record: string; start: number; end: number };
  const items: Item[] = [
    ...PRAGATI_INSTRUCTIONAL_UNITS.map((u) => ({
      id: u.instructionalUnitId,
      record: u.officialRecordId,
      start: u.sourceEvidence.pdfPageStart,
      end: u.sourceEvidence.pdfPageEnd,
    })),
    ...SOURCE_SEGMENTS.map((s) => ({
      id: s.sourceSegmentId,
      record: s.officialRecordId,
      start: s.sourceEvidence.pdfPageStart,
      end: s.sourceEvidence.pdfPageEnd,
    })),
    ...NON_INSTRUCTIONAL_RECORDS.map((r) => ({
      id: r.officialRecordId,
      record: r.officialRecordId,
      start: r.sourceEvidence.pdfPageStart,
      end: r.sourceEvidence.pdfPageEnd,
    })),
  ];
  const out: Array<{ officialRecordId: string; a: string; b: string; pages: number[]; reason: string | null }> = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const A = items[i];
      const B = items[j];
      if (A.record !== B.record) continue;
      if (A.start > B.end || B.start > A.end) continue;
      const pages: number[] = [];
      for (let p = Math.max(A.start, B.start); p <= Math.min(A.end, B.end); p += 1) pages.push(p);
      out.push({
        officialRecordId: A.record,
        a: A.id,
        b: B.id,
        pages,
        // Only a justification written for this pair counts. An
        // instructional merge note on one side explains that unit's
        // relationship, not every overlap it takes part in.
        reason: overlapJustificationFor(A.id, B.id),
      });
    }
  }
  return out;
}

/**
 * The gate, in one place so the data and the tests cannot disagree.
 *
 * A unit may be authoring-ready only when its whole page range has been
 * read in full, and — where the mathematics is carried by the visuals —
 * those pages have actually been looked at.
 */
export function meetsEvidenceBar(u: PragatiInstructionalUnit): boolean {
  const e = u.sourceEvidence;
  if (u.intentInspectionStatus !== 'INSPECTED') return false;
  const pages = e.pageEvidence;
  // Every page of the range must be present in the ledger: an absent
  // page is an unread page, not a page that needed nothing.
  const covered = new Set(pages.map((p) => p.pdfPage));
  for (let p = e.pdfPageStart; p <= e.pdfPageEnd; p += 1) {
    if (!covered.has(p)) return false;
  }
  // Checkpoint 2's gate accepted one rendered page for a whole visually
  // dependent unit. Now every page answers for itself.
  return pages.every(
    (p) => p.fullTextInspected && (!p.visualInspectionRequired || p.visualInspected)
  );
}

/** The depth label, computed from the ledger so it cannot overstate. */
export function evidenceDepthOf(e: SourceEvidence): EvidenceDepth {
  const pages = e.pageEvidence;
  if (pages.length === 0 || pages.some((p) => !p.fullTextInspected)) return 'DIGEST_ONLY';
  const covered = new Set(pages.map((p) => p.pdfPage));
  for (let p = e.pdfPageStart; p <= e.pdfPageEnd; p += 1) {
    if (!covered.has(p)) return 'DIGEST_ONLY';
  }
  return pages.every((p) => !p.visualInspectionRequired || p.visualInspected)
    ? 'FULL_PAGE_INSPECTED'
    : 'FULL_TEXT_INSPECTED';
}

/**
 * v0.84.0 checkpoint 3 §6/§7 — RECORD-LEVEL INSPECTION.
 *
 * An official record is inspected when its WHOLE instructional extent
 * is. Checkpoint 2 marked a chapter inspected as soon as any one of its
 * units had evidence, so a chapter with an unread tail could be reported
 * as page-level inspected. For Classes 1-5 the record is the chapter;
 * for the numbered grades it is the section. The same rule serves both.
 */
export type RecordInspectionState =
  | 'NOT_STARTED'
  | 'INDEXED_ONLY'
  | 'PARTIALLY_INSPECTED'
  | 'FULLY_INSPECTED'
  | 'BLOCKED_SOURCE'
  | 'NEEDS_HUMAN_CHECK';

export function recordInspectionState(officialRecordId: string): RecordInspectionState {
  const units = instructionalUnitsFor(officialRecordId);
  const nonInstr = NON_INSTRUCTIONAL_RECORDS.filter(
    (r) => r.officialRecordId === officialRecordId
  );
  const all = [
    ...units.map((u) => u.sourceEvidence),
    ...nonInstr.map((r) => r.sourceEvidence),
    // A segment is not a record; its pages count towards the record it
    // sits inside.
    ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === officialRecordId).map(
      (s) => s.sourceEvidence
    ),
  ];
  if (all.length === 0) return 'NOT_STARTED';
  if (all.some((e) => e.blockedSource)) return 'BLOCKED_SOURCE';
  // v0.84.0 checkpoint 10 §6 — INDEXED_ONLY means what the audit says it
  // means: headings and opening text, nothing read in full. A chapter
  // whose whole text has been read while its pictures wait for rendering
  // is PARTIALLY_INSPECTED, and calling it indexed-only understated real
  // work and overstated what was missing.
  const anyFullText = all.some((e) => e.pageEvidence.some((p) => p.fullTextInspected));
  const extent = RECORD_EXTENTS.find((x) => x.officialRecordId === officialRecordId);
  const seen = new Set<number>();
  for (const e of all) {
    for (const p of e.pageEvidence) {
      if (p.fullTextInspected && (!p.visualInspectionRequired || p.visualInspected)) {
        seen.add(p.pdfPage);
      }
    }
  }
  if (seen.size === 0) return anyFullText ? 'PARTIALLY_INSPECTED' : 'INDEXED_ONLY';
  if (!extent) return 'PARTIALLY_INSPECTED';
  for (let p = extent.pdfPageStart; p <= extent.pdfPageEnd; p += 1) {
    if (!seen.has(p)) return 'PARTIALLY_INSPECTED';
  }
  return 'FULLY_INSPECTED';
}

/**
 * The official records someone has actually read the pages of — the one
 * authoritative answer to "page-level intent inspected". The master map
 * derives its per-record status from this rather than keeping a second,
 * hand-maintained copy that drifts.
 */
export function inspectedOfficialRecordIds(): Set<string> {
  // Only FULLY_INSPECTED counts. A chapter half read is partial
  // progress, and partial progress is not inspection.
  const ids = new Set<string>();
  for (const id of officialRecordIdsTouched()) {
    if (recordInspectionState(id) === 'FULLY_INSPECTED') ids.add(id);
  }
  return ids;
}

export function officialRecordIdsTouched(): string[] {
  const ids = new Set<string>();
  for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
    ids.add(u.officialRecordId);
    for (const extra of u.additionalOfficialRecordIds) ids.add(extra);
  }
  for (const r of NON_INSTRUCTIONAL_RECORDS) ids.add(r.officialRecordId);
  for (const s of SOURCE_SEGMENTS) ids.add(s.officialRecordId);
  return [...ids];
}

/** Partial progress stays visible rather than being rounded away. */
export function recordInspectionSummary(): Array<{
  officialRecordId: string;
  state: RecordInspectionState;
  pagesInspected: number;
  pagesInExtent: number | null;
}> {
  return officialRecordIdsTouched()
    .sort()
    .map((id) => {
      const extent = RECORD_EXTENTS.find((x) => x.officialRecordId === id);
      const seen = new Set<number>();
      for (const u of instructionalUnitsFor(id)) {
        for (const p of u.sourceEvidence.pageEvidence) {
          if (p.fullTextInspected) seen.add(p.pdfPage);
        }
      }
      for (const r of NON_INSTRUCTIONAL_RECORDS.filter((r) => r.officialRecordId === id)) {
        for (const p of r.sourceEvidence.pageEvidence) if (p.fullTextInspected) seen.add(p.pdfPage);
      }
      for (const sg of SOURCE_SEGMENTS.filter((s) => s.officialRecordId === id)) {
        for (const p of sg.sourceEvidence.pageEvidence) if (p.fullTextInspected) seen.add(p.pdfPage);
      }
      return {
        officialRecordId: id,
        state: recordInspectionState(id),
        pagesInspected: seen.size,
        pagesInExtent: extent ? extent.pdfPageEnd - extent.pdfPageStart + 1 : null,
      };
    });
}

/**
 * v0.84.0 checkpoint 4 §1/§2 — the denominator comes from the official
 * curriculum, never from whatever the decomposition happens to have
 * touched. Class 2 Chapter 5 disappeared from the accounting because the
 * extents list was built from the pages that had been read; it is now
 * built from the master map, so a chapter cannot vanish by being
 * ignored.
 */
export function officialRecordAccounting(classNumber: number): {
  officialRecordsTotal: number;
  officialRecordsNotStarted: number;
  officialRecordsIndexedOnly: number;
  officialRecordsPartiallyInspected: number;
  officialRecordsFullyInspected: number;
  officialRecordsBlocked: number;
  missingExtents: string[];
} {
  // The authoring grain the source itself defines: chapter for Classes
  // 1-5, numbered section where the book numbers them. Same rule for
  // every grade, so Classes 6+ need no second model later.
  const records = authoringUnits(classNumber).map((r) => r.recordId);
  const byState = { NOT_STARTED: 0, INDEXED_ONLY: 0, PARTIALLY_INSPECTED: 0, FULLY_INSPECTED: 0, BLOCKED_SOURCE: 0, NEEDS_HUMAN_CHECK: 0 };
  for (const id of records) byState[recordInspectionState(id)] += 1;
  return {
    officialRecordsTotal: records.length,
    officialRecordsNotStarted: byState.NOT_STARTED,
    officialRecordsIndexedOnly: byState.INDEXED_ONLY,
    officialRecordsPartiallyInspected: byState.PARTIALLY_INSPECTED + byState.NEEDS_HUMAN_CHECK,
    officialRecordsFullyInspected: byState.FULLY_INSPECTED,
    officialRecordsBlocked: byState.BLOCKED_SOURCE,
    missingExtents: records.filter(
      (id: string) => !RECORD_EXTENTS.some((x) => x.officialRecordId === id)
    ),
  };
}

/**
 * v0.84.0 checkpoint 10 §1-§3 — THREE DIFFERENT THINGS.
 *
 * Checkpoint 9 marked 33 Class 3 units NEEDS_HUMAN_CHECK when only four
 * had a question; the rest were waiting for pages to be rendered. That
 * turned missing evidence into a pretend review queue. The status a unit
 * should carry is derived here so the data cannot drift from the rule:
 *
 *   evidence incomplete            → DRAFT_DECOMPOSITION
 *   evidence complete + question   → NEEDS_HUMAN_CHECK
 *   evidence complete, no question → READY_FOR_AUTHORING
 */
export function derivedStatusFor(u: PragatiInstructionalUnit): DecompositionStatus {
  if (!meetsEvidenceBar(u)) return 'DRAFT_DECOMPOSITION';
  return u.humanJudgementQuestion ? 'NEEDS_HUMAN_CHECK' : 'READY_FOR_AUTHORING';
}

export function readyForAuthoring(): PragatiInstructionalUnit[] {
  return PRAGATI_INSTRUCTIONAL_UNITS.filter(
    (u) => u.decompositionStatus === 'READY_FOR_AUTHORING'
  );
}

export type DecompositionCoverage = {
  /** Source-grain records. NOT a lesson count. */
  officialAuthoringRecords: number;
  /**
   * v0.84.0 hardening §8 — three different questions, three numbers.
   * The old single `intentInspected` came from the master map's own
   * status field, which no longer knew about Classes 1-2, so the metric
   * reported the wrong world. It is now derived from the decomposition,
   * which is the record of who read what.
   */
  officialRecordsInspected: number;
  unitsWithCompleteEvidence: number;
  classesFullyInspected: number;
  /** Pragati units that exist. */
  instructionalUnits: number;
  /** How many lessons the product will need: unknowable until the pages
   *  are read, and reported as null rather than guessed from records. */
  projectedLessonCount: null;
};

export function decompositionCoverage(records: number): DecompositionCoverage {
  return {
    officialAuthoringRecords: records,
    officialRecordsInspected: inspectedOfficialRecordIds().size,
    unitsWithCompleteEvidence: PRAGATI_INSTRUCTIONAL_UNITS.filter(meetsEvidenceBar).length,
    classesFullyInspected: CLASS_DECOMPOSITION_PROGRESS.filter(
      (p) => p.status === 'COMPLETE' || p.status === 'DECOMPOSITION_SOURCE_COMPLETE'
    ).length,
    instructionalUnits: PRAGATI_INSTRUCTIONAL_UNITS.length,
    // Still null, and still for the same reason: the classes whose pages
    // have not been read yet cannot have their lesson count guessed from
    // their chapter count.
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
    `reading its pages. That reading is complete for some classes and has not ` +
    `started for others, so the lesson total for Classes 1-12 is UNKNOWN rather ` +
    `than ${records}.`
  );
}

// v0.84.0 §7 — register this module as the master map's source of truth
// for "page-level intent inspected", so the status exists in one place
// and is derived, never copied.
inspectedRecordsRef.current = inspectedOfficialRecordIds;
