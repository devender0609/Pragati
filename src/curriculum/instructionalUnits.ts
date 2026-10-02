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
  /**
   * The official authoring record this unit serves: a chapter in Classes
   * 1-5, whose books number no sections, and the **official numbered
   * section** from Class 6 on. Checkpoint 16 stored the chapter id here
   * for Class 6 and kept the section only inside `sourceEvidence`, so the
   * official-record helpers and the master map never saw 53 of the 65
   * sections. A unit may not exist without one.
   */
  officialRecordId: string;
  /**
   * v0.84.0 checkpoint 17 §3 — the chapter containing this unit's
   * section, where the book numbers sections. The chapter owns the page
   * extent; the section is the authoring record. Two questions, two
   * fields.
   */
  officialChapterId?: string;
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
  /**
   * v0.84.0 checkpoint 13 §7 — when several units wait on ONE policy
   * decision they share this key. Five Class 4 units carried the same
   * generic sentence, which read as five independent judgements when it
   * was one. Each question still names that unit's own material.
   */
  humanJudgementPolicyKey?: string;
  /** v0.84.0 checkpoint 14 — Learn coverage of this unit by existing work. */
  /**
   * v0.84.0 checkpoint 18 §17 — does an authored lesson actually teach
   * this unit? That is a question about instruction, not about how many
   * units the lesson happens to span, so the artifact's alignment
   * topology no longer leaks into it.
   */
  learnCoverage?: 'EXISTING_COMPLETE' | 'EXISTING_PARTIAL' | 'NO_LEARN_CONTENT';
  /**
   * v0.84.0 checkpoint 14 §5-§7 — the unit's relationship to what earlier
   * classes established, as a controlled value rather than a sentence
   * buried in `notes`, with the evidence for it alongside. Only set where
   * the decomposition actually established it; unknown is left unset
   * rather than guessed.
   */
  progressionRelationship?:
    | 'REVISIT'
    | 'EXTENSION'
    | 'FORMALIZATION'
    | 'NEW_REPRESENTATION'
    | 'NEW_PROCEDURE'
    | 'NEW_MATHEMATICAL_IDEA'
    | 'INTEGRATION';
  progressionRationale?: string;
  /**
   * v0.84.0 checkpoint 11 §1-§3 — HISTORY, NOT STATUS.
   *
   * `hardeningClassification` was a re-audit verdict that outlived its
   * pass: 33 units carried a verdict contradicting their current
   * `decompositionStatus` — Class 3 units read READY while still
   * labelled NEEDS_HUMAN_CHECK from the partial visual pass. Two active
   * status fields means neither is authoritative, so the verdicts moved
   * here as dated provenance. The one current status is
   * `decompositionStatus`, and `derivedStatusFor()` decides it.
   */
  auditHistory?: Array<{ checkpoint: string; verdict: string | null; note: string }>;
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

/** v0.84.0 checkpoint 14 §2 — one decision, the units it governs. */
/**
 * v0.84.0 checkpoint 14 §21 — how an already-authored artifact sits against
 * the source-derived units. Mapping only: no artifact is changed, and no
 * review state moves.
 */
export type ArtifactAlignment = {
  artifactId: string;
  officialSectionId: string;
  artifactSourcePages: string;
  mappedUnitIds: string[];
  alignment:
    | 'EXACT_MATCH'
    | 'PARTIAL_MATCH'
    | 'MULTI_UNIT_COVERAGE'
    | 'OVER_SCOPED'
    | 'UNDER_SCOPED'
    | 'SOURCE_ALIGNMENT_ISSUE';
  coverageSummary: string;
  /**
   * v0.84.0 checkpoint 17 §20 — alignment topology and instructional
   * completeness are different questions. A MULTI_UNIT_COVERAGE mapping
   * says one lesson spans several units; it does not say each of those
   * units is actually taught. This records what reading the lesson
   * showed, and which units it genuinely covers.
   */
  unitCoverageVerification?: 'VERIFIED_COMPLETE' | 'VERIFIED_PARTIAL' | 'UNVERIFIED';
  verifiedCoveredUnitIds?: string[];
  /** The units §n of the book yields, before asking what the lesson teaches. */
  expectedSectionUnitIds?: string[];
  /** The units the lesson was read and found to actually teach. */
  actualCoveredUnitIds?: string[];
  verificationNote?: string;
  missingScope: string;
  excessScope: string;
  recommendedLaterAction: string;
};

/**
 * v0.84.0 checkpoint 18 §2 — WHAT A SECTION'S BODY ACTUALLY IS.
 *
 * Checkpoint 17 derived a section's state from the units that cited it,
 * which proves the units' evidence is complete — not that the section's
 * whole printed body was read. A section owns no RecordExtent (the
 * chapter does), so its body span is recorded here, located from the
 * printed heading and the next heading, with the evidence for the
 * boundary written down. Boundary pages are shared between neighbouring
 * sections because the book prints them that way.
 */
export type OfficialSectionExtent = {
  officialSectionId: string;
  officialChapterId: string;
  pdfPageStart: number;
  pdfPageEnd: number;
  printedPageStart: number | null;
  printedPageEnd: number | null;
  boundaryEvidence: string;
  /**
   * v0.84.0 checkpoint 19 §9 — how the boundary was established.
   * PROVISIONAL_DETECTED is a heading the parser found in a chapter nobody
   * has read yet; VERIFIED_FROM_SOURCE means the pages themselves were
   * inspected and the boundary held. Only the latter can support
   * FULLY_INSPECTED.
   */
  boundaryStatus?: 'PROVISIONAL_DETECTED' | 'VERIFIED_FROM_SOURCE';
};

/**
 * v0.84.0 checkpoint 20 §5-§6 — A SECTION MAY BE READ AND TEACH NOTHING NEW.
 *
 * Checkpoint 19 derived a section's state from the units citing it, so a
 * review, practice or reference section could never be marked inspected
 * however carefully it had been read — the only way out was to invent a
 * lesson for it. Source inspection and instructional disposition are
 * different questions, and a section that produces no unit records its
 * role here instead.
 */
export type OfficialSectionDisposition = {
  officialSectionId: string;
  disposition: 'PRACTICE' | 'REVIEW' | 'REFERENCE' | 'ENRICHMENT' | 'NON_INSTRUCTIONAL' | 'OTHER_EXPLICIT_ROLE';
  justification: string;
};

export type HumanJudgementPolicy = {
  policyKey: string;
  policyQuestion: string;
  affectedUnitIds: string[];
};

type DecompositionFile = {
  generatedFrom: string;
  units: PragatiInstructionalUnit[];
  nonInstructional: NonInstructionalRecord[];
  sourceSegments: SourceSegment[];
  overlapJustifications?: OverlapJustification[];
  humanJudgementPolicies?: HumanJudgementPolicy[];
  artifactAlignments?: ArtifactAlignment[];
  officialSectionExtents?: OfficialSectionExtent[];
  officialSectionDispositions?: OfficialSectionDisposition[];
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
     * v0.84.0 checkpoint 13 §1 — `pagesUnresolved` is gone. It counted
     * only pages whose text was unread and read 0 for Class 3 while 107
     * picture-carried pages were still unseen, so every gap is now named
     * on its own. No alias replaces it.
     */
    /** Pages whose full text has not been read. */
    pagesFullTextPending?: number;
    /** Picture-carried pages not yet rendered and looked at. */
    visualPagesPending?: number;
    /** Pages missing either kind of required evidence. */
    pagesEvidenceIncomplete?: number;
    officialRecordsPartiallyInspected?: number;
    /**
     * v0.84.0 checkpoint 15 §5-§6 — CHAPTERS AND SECTIONS ARE TWO LAYERS.
     *
     * Class 6 is the first class whose official authoring record is a
     * numbered section while page extents belong to the chapter.
     * Checkpoint 14 put the section denominator (65) into `chaptersTotal`
     * and the audit then printed "0/65 chapters". Each layer has its own
     * fields now, and `chaptersTotal` means chapters again.
     */
    officialChapterCount?: number;
    officialSectionsTotal?: number;
    chaptersFullyInspected?: number;
    chaptersPartiallyInspected?: number;
    chaptersIndexedOnly?: number;
    sectionsAccountedFor?: number;
    sectionsNotYetInspected?: number;
    /**
     * v0.84.0 checkpoint 20 §12-§13 — these describe OFFICIAL RECORDS, which
     * from Class 6 means numbered sections. Checkpoint 19 put the count of
     * unread chapters into `officialRecordsIndexedOnly`, whose denominator
     * is 65 sections. The chapter layer has `chapters*` for that.
     */
    officialRecordsNotStarted?: number;
    officialRecordsBlocked?: number;
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
export const OFFICIAL_SECTION_DISPOSITIONS: OfficialSectionDisposition[] =
  DATA.officialSectionDispositions ?? [];

/** The recorded no-unit role of a section, if it has one. */
export function sectionDispositionFor(sectionId: string): OfficialSectionDisposition | undefined {
  return OFFICIAL_SECTION_DISPOSITIONS.find((x) => x.officialSectionId === sectionId);
}

export const OFFICIAL_SECTION_EXTENTS: OfficialSectionExtent[] = DATA.officialSectionExtents ?? [];

/** The recorded body span of one numbered section, if there is one. */
export function sectionExtentFor(sectionId: string): OfficialSectionExtent | undefined {
  return OFFICIAL_SECTION_EXTENTS.find((e) => e.officialSectionId === sectionId);
}

export const ARTIFACT_ALIGNMENTS: ArtifactAlignment[] = DATA.artifactAlignments ?? [];
export const HUMAN_JUDGEMENT_POLICIES: HumanJudgementPolicy[] = DATA.humanJudgementPolicies ?? [];
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
      u.additionalOfficialRecordIds.includes(officialRecordId) ||
      // From Class 6 the authoring record is a section, so a query for the
      // chapter — which owns the page extent — must still find its units.
      u.officialChapterId === officialRecordId
  );
}

/** The chapter that contains a unit, whichever layer it is recorded at. */
export function chapterOf(u: PragatiInstructionalUnit): string {
  return u.officialChapterId ?? u.sourceEvidence.officialChapterId ?? u.officialRecordId;
}

/**
 * v0.84.0 checkpoint 19 §9-§10 — A SECTION IS PROVEN AGAINST A VERIFIED BODY.
 *
 * A numbered section owns no RecordExtent — the chapter does — so its body
 * span is recorded as an `OfficialSectionExtent`, located from the printed
 * heading. Two things can go wrong with that, and both are guarded here.
 * The extent can be missing (checkpoint 18 stored 63 of Class 7's 65), and
 * it can be a parser guess that nobody checked against the pages. A guess
 * may help navigation; it may not establish completion. Only an extent
 * marked VERIFIED_FROM_SOURCE, with its whole body inspected, counts.
 */
export function sectionInspectionState(
  sectionId: string
): 'NOT_STARTED' | 'PARTIALLY_INSPECTED' | 'FULLY_INSPECTED' | 'BLOCKED_SOURCE' {
  const units = PRAGATI_INSTRUCTIONAL_UNITS.filter(
    (u) => u.officialRecordId === sectionId || u.additionalOfficialRecordIds.includes(sectionId)
  );
  // v0.84.0 checkpoint 20 §8 — a section's disposition is one or more units
  // OR a recorded no-unit role. Absence of a unit is not absence of reading.
  const disposition = sectionDispositionFor(sectionId);
  if (units.length === 0 && !disposition) return 'NOT_STARTED';
  if (units.some((u) => u.sourceEvidence.blockedSource)) return 'BLOCKED_SOURCE';

  const extent = sectionExtentFor(sectionId);
  if (!extent) return 'PARTIALLY_INSPECTED';
  // An unverified range is a parser guess. It cannot prove a body complete.
  if ((extent.boundaryStatus ?? 'VERIFIED_FROM_SOURCE') !== 'VERIFIED_FROM_SOURCE') {
    return 'PARTIALLY_INSPECTED';
  }

  // Every page of the body must be evidenced somewhere in the chapter — by a
  // unit of this section, a neighbouring unit sharing a boundary page, or a
  // source segment covering unnumbered material inside it.
  const chapterEvidence = [
    ...PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => chapterOf(u) === extent.officialChapterId).map(
      (u) => u.sourceEvidence
    ),
    ...SOURCE_SEGMENTS.filter(
      (sg) => sg.sourceEvidence.officialChapterId === extent.officialChapterId
    ).map((sg) => sg.sourceEvidence),
  ];
  const byPage = new Map<
    number,
    { fullTextInspected: boolean; visualInspectionRequired: boolean; visualInspected: boolean }
  >();
  for (const e of chapterEvidence) for (const p of e.pageEvidence) byPage.set(p.pdfPage, p);

  let complete = true;
  for (let p = extent.pdfPageStart; p <= extent.pdfPageEnd; p += 1) {
    const row = byPage.get(p);
    if (!row || !row.fullTextInspected || (row.visualInspectionRequired && !row.visualInspected)) {
      complete = false;
    }
  }
  // Where units exist, their own evidence must also be complete: a
  // disposition recorded against half-read pages is not a disposition.
  if (units.length > 0) {
    const ownPages = units.flatMap((u) => u.sourceEvidence.pageEvidence);
    if (ownPages.length === 0) complete = false;
    if (!ownPages.every((p) => p.fullTextInspected && (!p.visualInspectionRequired || p.visualInspected))) {
      complete = false;
    }
  }
  return complete ? 'FULLY_INSPECTED' : 'PARTIALLY_INSPECTED';
}

/** Every official numbered section of a class, with its derived state. */
export function sectionAccounting(classNumber: number): {
  sectionsTotal: number;
  fullyInspected: string[];
  partiallyInspected: string[];
  notStarted: string[];
  rows: Array<{
    sectionId: string;
    title: string;
    extent: OfficialSectionExtent | null;
    parentChapterId: string | null;
    unitIds: string[];
    disposition: string | null;
    state: string;
  }>;
} {
  const sections = authoringUnits(classNumber).filter((r) => r.level === 'section');
  const rows = sections.map((r) => {
    const units = PRAGATI_INSTRUCTIONAL_UNITS.filter(
      (u) => u.officialRecordId === r.recordId || u.additionalOfficialRecordIds.includes(r.recordId)
    );
    return {
      sectionId: r.recordId,
      title: r.title,
      extent: sectionExtentFor(r.recordId) ?? null,
      parentChapterId: units[0] ? chapterOf(units[0]) : (sectionExtentFor(r.recordId)?.officialChapterId ?? null),
      unitIds: units.map((u) => u.instructionalUnitId),
      disposition: units.length > 0 ? 'INSTRUCTIONAL_UNIT' : (sectionDispositionFor(r.recordId)?.disposition ?? null),
      state: sectionInspectionState(r.recordId),
    };
  });
  return {
    sectionsTotal: sections.length,
    fullyInspected: rows.filter((r) => r.state === 'FULLY_INSPECTED').map((r) => r.sectionId),
    partiallyInspected: rows.filter((r) => r.state === 'PARTIALLY_INSPECTED').map((r) => r.sectionId),
    notStarted: rows.filter((r) => r.state === 'NOT_STARTED').map((r) => r.sectionId),
    rows,
  };
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

/**
 * v0.84.0 checkpoint 13 §2-§4 — REPORT SCOPING IN ONE PLACE.
 *
 * Class-specific generators used ad-hoc `includes('cemm1')` and
 * `!includes(...)` filters, so the Classes 1-2 ledger silently took in
 * Class 4 segments the moment they existed. Every generator now asks
 * for its own class's objects positively.
 */
export function classScope(classNumbers: number[]): {
  officialRecordIds: string[];
  units: PragatiInstructionalUnit[];
  sourceSegments: SourceSegment[];
  nonInstructional: NonInstructionalRecord[];
  recordExtents: RecordExtent[];
} {
  const wanted = new Set(classNumbers);
  const units = PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => wanted.has(u.classNumber));
  const ids = new Set<string>();
  for (const n of classNumbers) for (const r of authoringUnits(n)) ids.add(r.recordId);
  // From Class 6 the official authoring record is the numbered section while
  // page extents hang off the chapter, so the chapter ids the class's units
  // and segments cite belong to the scope too.
  for (const u of units) {
    ids.add(u.officialRecordId);
    if (u.officialChapterId) ids.add(u.officialChapterId);
  }
  for (const s of SOURCE_SEGMENTS) {
    if (units.some((u) => u.officialRecordId === s.officialRecordId)) ids.add(s.officialRecordId);
  }
  return {
    officialRecordIds: [...ids],
    units,
    sourceSegments: SOURCE_SEGMENTS.filter((s) => ids.has(s.officialRecordId)),
    nonInstructional: NON_INSTRUCTIONAL_RECORDS.filter((r) => ids.has(r.officialRecordId)),
    recordExtents: RECORD_EXTENTS.filter((e) => ids.has(e.officialRecordId)),
  };
}

/**
 * v0.84.0 checkpoint 13 §5 — a deterministic fingerprint of one class's
 * decomposition. Counting units caught nothing: an objective, a page
 * range or a status could change while the count held. Computed from
 * the canonical fields, never typed by hand.
 */
export function decompositionFingerprint(classNumber: number): string {
  const rows: string[] = [];
  for (const u of PRAGATI_INSTRUCTIONAL_UNITS.filter((x) => x.classNumber === classNumber).sort((a, b) =>
    a.instructionalUnitId.localeCompare(b.instructionalUnitId)
  )) {
    const e = u.sourceEvidence;
    rows.push(
      [
        u.instructionalUnitId, u.officialRecordId, u.instructionalTitle, u.mathematicalObjective,
        u.studentCanStatement, u.mathematicalIdeas.join('~'), u.representationsNeeded.join('~'),
        u.prerequisites.join('~'), u.vocabulary.join('~'), u.reasoningDemand, u.instructionalRole,
        u.decompositionStatus, u.humanReviewStatus, u.humanJudgementQuestion ?? '',
        u.humanJudgementPolicyKey ?? '', u.progressionRelationship ?? '', u.progressionRationale ?? '',
        `${e.pdfPageStart}-${e.pdfPageEnd}`, `${e.printedPageStart}-${e.printedPageEnd}`,
        e.evidenceDepth, String(e.pageEvidence.length),
        e.pageEvidence.map((p) => `${p.pdfPage}:${p.printedPage}:${p.fullTextInspected ? 1 : 0}:${p.visualInspectionRequired ? 1 : 0}:${p.visualInspected ? 1 : 0}`).join(','),
      ].join('|')
    );
  }
  for (const s of SOURCE_SEGMENTS.filter((s) => classScope([classNumber]).officialRecordIds.includes(s.officialRecordId)).sort((a, b) =>
    a.sourceSegmentId.localeCompare(b.sourceSegmentId)
  )) {
    rows.push([s.sourceSegmentId, s.officialRecordId, s.role, s.sourceLabel,
      `${s.sourceEvidence.pdfPageStart}-${s.sourceEvidence.pdfPageEnd}`].join('|'));
  }
  // A small, stable string hash: the value only has to change when the
  // content does, and be reproducible without a crypto dependency.
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  const text = rows.join('\n');
  for (let i = 0; i < text.length; i += 1) {
    h1 = Math.imul(h1 ^ text.charCodeAt(i), 0x01000193) >>> 0;
    h2 = Math.imul(h2 + text.charCodeAt(i) + i, 0x85ebca6b) >>> 0;
  }
  return `${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`;
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
      // Page overlap is a chapter-level question: the chapter owns the
      // pages, and two units in different sections can still share a page.
      record: chapterOf(u),
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
  // A numbered section owns no extent, so its state is derived from the
  // units that cite it rather than from a page range it does not have.
  if (/_s\d+_\d+$/.test(officialRecordId)) return sectionInspectionState(officialRecordId);
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
  // v0.84.0 checkpoint 17 §8 — numbered sections are official records too,
  // judged against their own body span (checkpoint 18 §5).
  for (const n of CLASS_DECOMPOSITION_PROGRESS.map((p) => p.classNumber)) {
    for (const row of sectionAccounting(n).rows) {
      if (row.state === 'FULLY_INSPECTED') ids.add(row.sectionId);
    }
  }
  return ids;
}

export function officialRecordIdsTouched(): string[] {
  const ids = new Set<string>();
  // The chapter is tracked alongside the section: page extents hang off it.
  for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
    if (u.officialChapterId) ids.add(u.officialChapterId);
  }
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
  const records = authoringUnits(classNumber);
  const byState = { NOT_STARTED: 0, INDEXED_ONLY: 0, PARTIALLY_INSPECTED: 0, FULLY_INSPECTED: 0, BLOCKED_SOURCE: 0, NEEDS_HUMAN_CHECK: 0 };
  for (const r of records) {
    // A numbered section has no page extent of its own — the chapter owns
    // it — so its state comes from its recorded body span and the evidence
    // covering that span.
    const state = r.level === 'section' ? sectionInspectionState(r.recordId) : recordInspectionState(r.recordId);
    byState[state] += 1;
  }
  return {
    officialRecordsTotal: records.length,
    officialRecordsNotStarted: byState.NOT_STARTED,
    officialRecordsIndexedOnly: byState.INDEXED_ONLY,
    officialRecordsPartiallyInspected: byState.PARTIALLY_INSPECTED + byState.NEEDS_HUMAN_CHECK,
    officialRecordsFullyInspected: byState.FULLY_INSPECTED,
    officialRecordsBlocked: byState.BLOCKED_SOURCE,
    // Only a record that owns pages can be missing an extent: a numbered
    // section never has one, and that is correct, not a gap.
    missingExtents: records
      .filter((r) => r.level !== 'section')
      .map((r) => r.recordId)
      .filter((id) => !RECORD_EXTENTS.some((x) => x.officialRecordId === id)),
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
