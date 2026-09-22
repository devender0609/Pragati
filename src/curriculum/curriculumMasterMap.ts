// ===========================================================================
// v0.83 — THE CLASSES 1–12 MATHEMATICS CURRICULUM MASTER MAP.
//
// WHAT THIS IS
//
// The production contract for completing Pragati: every official
// Mathematics record for Classes 1–12, read from current primary sources,
// with the evidence that proves it and the product state laid over it.
//
// It answers WHAT SHOULD EXIST. It does not claim Pragati teaches any of
// it. Product state (Learn, Practice, review, publication) is a separate
// overlay, and a record with no content is still a record.
//
// WHERE THE DATA COMES FROM
//
//   NCERT textbooks, Classes 1–12  → data/mathCurriculumMasterEvidence.json,
//       built by curriculum-verification/master-map/tools/build_master.py
//       from the current prelims and chapter PDFs on ncert.nic.in
//       (inspected 2026-09-22; checksums in curriculum-verification/master-map).
//   Class 6 structure              → officialChapters.ts / officialSections.ts,
//       the accepted primary-verified registry, read LIVE so it cannot drift.
//       The 2026-09-22 reading is attached only as an observation.
//   CBSE syllabi, Classes 9–12      → officialCurriculum.ts (read 2026-08-27,
//       re-checked 2026-09-22), read LIVE.
//
// THE RULES IT ENFORCES
//
//   • The source's own vocabulary. A textbook has chapters and sections;
//     a CBSE syllabus has units, topics and (Class IX only) chapter names.
//     No level is invented and none is renamed.
//   • NCERT textbook and CBSE syllabus are separate hierarchies. A CBSE
//     unit is never treated as an NCERT chapter. The only link recorded
//     is the one the syllabus prints: its prescribed book.
//   • Structure verified ≠ intent inspected. Every record carries both.
//   • UNKNOWN is never zero. A level the source does not define is
//     'not_defined_by_source'; a level not yet read is 'unknown'.
// ===========================================================================

import type { Grade } from '../types';
import evidenceJson from './data/mathCurriculumMasterEvidence.json';
import { OFFICIAL_CHAPTERS } from './officialChapters';
import { CLASS6_OFFICIAL_SECTIONS } from './officialSections';
import { officialCurriculumForGrade } from './officialCurriculum';
import { allAuthoredSections } from './authoredSections';
import { assessSection } from './instructionalCompleteness';
import { reviewReadinessForSection } from './reviewReadiness';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MasterLevel = 'unit' | 'chapter' | 'section' | 'subsection' | 'topic';

/** What the source says about a hierarchy level. */
export type LevelStatus =
  /** The level exists and every record at it was read from the source. */
  | 'primary_source_verified'
  /** The source does not have this level. Not the same as zero records. */
  | 'not_defined_by_source'
  /** The level exists; some records were found; the full count is not known. */
  | 'partially_enumerated'
  /** Not yet read. */
  | 'unknown';

export type IntentStatus = 'page_level_inspected' | 'not_inspected';

export type LearnStatus = 'authored' | 'missing';
export type ReviewStatus =
  | 'not_started'
  | 'review_package_preparation'
  | 'review_ready'
  | 'review_sent'
  | 'review_received'
  | 'review_adjudicated';

export type ProductStatus = {
  learn: LearnStatus;
  practice: LearnStatus;
  /** Instructional completeness level from `assessSection`, or 'absent'. */
  instructional: 'absent' | 'generated_skeleton' | 'incomplete_draft' | 'complete_instructional_draft';
  review: ReviewStatus;
  /** Only an educator can make this true. Never set by a maintainer. */
  reviewed: boolean;
  publication: 'unpublished' | 'published';
};

export type MasterSource = {
  sourceId: string;
  grade: Grade;
  classNumber: number;
  authority: 'NCERT' | 'CBSE';
  kind: 'textbook' | 'syllabus';
  title: string;
  /** As printed on the title page or in the syllabus heading. */
  printedSubtitle: string | null;
  part: string | null;
  isbn: string | null;
  editionHistory: Array<{ kind: string; date: string }>;
  /** e.g. "Reprint 2026-27", "First Edition April 2026", "Curriculum 2026-27". */
  currentApplicability: string;
  url: string;
  sha256: string | null;
  inspectedOn: string;
  identityStatus: 'primary_source_verified';
  applicabilityStatus: 'primary_source_verified';
  levels: Record<MasterLevel, LevelStatus>;
  levelEvidence: string;
  /** For a syllabus: the book it prescribes, exactly as printed. */
  prescribedBookAsPrinted: string | null;
  /**
   * v0.83.1 §B — is every volume of this book published and read?
   *
   * Recorded as evidence state on the source itself. v0.83 inferred the
   * Class 9 answer from whether a findings entry happened to carry
   * severity 'unresolved', which meant an unrelated future finding could
   * silently invalidate a known denominator — a fact decided by a list
   * it has nothing to do with.
   */
  volumeCompleteness: 'complete_series_published' | 'partial_series_published' | 'unknown';
  volumeCompletenessNote: string;
  backmatter: Array<{ title: string; page: string | null }>;
};

export type MasterRecord = {
  recordId: string;
  grade: Grade;
  classNumber: number;
  sourceId: string;
  authority: 'NCERT' | 'CBSE';
  sourceKind: 'textbook' | 'syllabus';
  bookPart: string | null;
  level: MasterLevel;
  /** Number as the source prints it: "7", "7.4", "3.3.1". Null if unnumbered. */
  number: string | null;
  title: string;
  /** Classes 1–2 print a parenthetical descriptor under each title. */
  descriptor: string | null;
  parentId: string | null;
  startPage: number | null;
  pageBasis: string;
  /**
   * Class 6 only: the start page held by the accepted registry, where it
   * differs from the printed folio observed on 2026-09-22 (finding F2).
   */
  registryStartPage: number | null;
  structureStatus: 'primary_source_verified';
  intentStatus: IntentStatus;
  /** "Summary" and similar source-numbered sections that teach nothing new. */
  nonInstructional: boolean;
  evidence: string;
};

export type Finding = { id: string; grade: number | null; severity: string; text: string };

type EvidenceFile = {
  inspectedOn: string;
  sources: Array<{
    sourceId: string;
    grade: number;
    title: string;
    printedSubtitle: string;
    part: string | null;
    portalLabel: string;
    portalCode: string;
    prelimsUrl: string;
    prelimsSha256: string;
    archiveUrl: string | null;
    archiveSha256: string | null;
    isbn: string;
    editionHistory: Array<{ kind: string; date: string }>;
    currentApplicability: string;
    inspectedOn: string;
    levels: Record<string, string>;
    levelEvidence: string;
    volumeCompleteness?: string;
    volumeCompletenessNote?: string;
    backmatter?: Array<{ title: string; page: string | null }>;
  }>;
  records: Array<{
    recordId: string;
    sourceId: string;
    grade: number;
    level: string;
    number: string;
    title: string;
    descriptor?: string | null;
    parentId: string | null;
    startPage: number | null;
    pageBasis: string;
    evidence: string;
  }>;
  cbseSources: Array<{
    sourceId: string;
    grades: number[];
    url: string;
    sha256: string;
    prescribedBookAsPrinted: string;
    reinspectedOn: string;
  }>;
  class6PageObservations: Array<{
    section: string;
    registryStartPage: number;
    observedPrintedPage: number;
  }>;
  portal: { url: string; sha256: string; retrievedOn: string; method: string; robotsTxt: string };
  findings: Finding[];
};

export const MASTER_EVIDENCE = evidenceJson as unknown as EvidenceFile;

const gradeOf = (n: number) => `class${n}` as Grade;
export const CLASS_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

function textbookSources(): MasterSource[] {
  return MASTER_EVIDENCE.sources.map((s) => ({
    sourceId: s.sourceId,
    grade: gradeOf(s.grade),
    classNumber: s.grade,
    authority: 'NCERT' as const,
    kind: 'textbook' as const,
    title: s.title,
    printedSubtitle: s.printedSubtitle,
    part: s.part,
    isbn: s.isbn,
    editionHistory: s.editionHistory,
    currentApplicability: s.currentApplicability,
    url: s.archiveUrl ?? s.prelimsUrl,
    sha256: s.archiveSha256 ?? s.prelimsSha256,
    inspectedOn: s.inspectedOn,
    identityStatus: 'primary_source_verified' as const,
    applicabilityStatus: 'primary_source_verified' as const,
    levels: {
      unit: 'not_defined_by_source',
      chapter: s.levels.chapter as LevelStatus,
      section: s.levels.section as LevelStatus,
      subsection: s.levels.subsection as LevelStatus,
      topic: s.levels.topic as LevelStatus,
    },
    levelEvidence: s.levelEvidence,
    prescribedBookAsPrinted: null,
    volumeCompleteness: (s.volumeCompleteness ?? 'unknown') as MasterSource['volumeCompleteness'],
    volumeCompletenessNote: s.volumeCompletenessNote ?? '',
    backmatter: s.backmatter ?? [],
  }));
}

function syllabusSources(): MasterSource[] {
  return MASTER_EVIDENCE.cbseSources.map((c) => {
    const n = c.grades[0];
    const reg = officialCurriculumForGrade(gradeOf(n))!;
    const chaptersNamed = reg.units.some((u) => u.chaptersEstablished);
    return {
      sourceId: c.sourceId,
      grade: gradeOf(n),
      classNumber: n,
      authority: 'CBSE' as const,
      kind: 'syllabus' as const,
      title: reg.documentTitle ?? `Mathematics, Class ${n} — CBSE`,
      printedSubtitle: null,
      part: null,
      isbn: null,
      editionHistory: [],
      currentApplicability: reg.edition ?? 'Curriculum 2026-27',
      url: c.url,
      sha256: c.sha256,
      inspectedOn: c.reinspectedOn,
      identityStatus: 'primary_source_verified' as const,
      applicabilityStatus: 'primary_source_verified' as const,
      levels: {
        unit: 'primary_source_verified',
        // Class IX alone prints a chapter-name column.
        chapter: chaptersNamed ? 'primary_source_verified' : 'not_defined_by_source',
        section: 'not_defined_by_source',
        subsection: 'not_defined_by_source',
        topic: 'primary_source_verified',
      },
      levelEvidence:
        `CBSE Academic Unit syllabus, Curriculum 2026-27. Units and named topics read from the document on ` +
        `${reg.inspectionDate}; titles re-checked against the same document on ${c.reinspectedOn}. ` +
        (chaptersNamed
          ? 'The course-structure table prints a chapter name for each topic, so chapters are recorded at this level too.'
          : 'No chapter-name column is printed, so no chapters are recorded for this syllabus.'),
      prescribedBookAsPrinted: c.prescribedBookAsPrinted,
      // A syllabus is one document; series completeness does not apply.
      volumeCompleteness: 'complete_series_published' as const,
      volumeCompletenessNote: 'Single document, read in full.',
      backmatter: [],
    };
  });
}

export const MASTER_SOURCES: MasterSource[] = [...textbookSources(), ...syllabusSources()];

export function sourcesForClass(n: number): MasterSource[] {
  return MASTER_SOURCES.filter((s) => s.classNumber === n);
}

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const AUTHORED_IDS = new Set(allAuthoredSections().map((s) => s.source.officialSectionId));

const partOf = (sourceId: string) =>
  MASTER_EVIDENCE.sources.find((s) => s.sourceId === sourceId)?.part ?? null;

function isNonInstructional(level: string, title: string): boolean {
  return level === 'section' && /^summary$/i.test(title.trim());
}

/** Class 6: the accepted registry, read live. */
function class6Records(): MasterRecord[] {
  const observed = new Map(
    MASTER_EVIDENCE.records
      .filter((r) => r.sourceId === 'ncert_fegp1' && r.level === 'section')
      .map((r) => [r.number, r.startPage])
  );
  const chapterStart = new Map(
    MASTER_EVIDENCE.records
      .filter((r) => r.sourceId === 'ncert_fegp1' && r.level === 'chapter')
      .map((r) => [r.number, r.startPage])
  );
  const chapters = OFFICIAL_CHAPTERS.filter(
    (c) => c.grade === 'class6' && c.officialChapterNumber !== null
  ).sort((a, b) => (a.officialChapterNumber ?? 0) - (b.officialChapterNumber ?? 0));

  const out: MasterRecord[] = [];
  for (const c of chapters) {
    out.push({
      recordId: c.officialChapterId,
      grade: 'class6',
      classNumber: 6,
      sourceId: 'ncert_fegp1',
      authority: 'NCERT',
      sourceKind: 'textbook',
      bookPart: null,
      level: 'chapter',
      number: String(c.officialChapterNumber),
      title: c.officialTitle as string,
      descriptor: null,
      parentId: null,
      startPage: chapterStart.get(String(c.officialChapterNumber)) ?? null,
      pageBasis: 'printed page, from contents page',
      registryStartPage: null,
      structureStatus: 'primary_source_verified',
      intentStatus: 'not_inspected',
      nonInstructional: false,
      evidence: 'accepted Class 6 registry (officialChapters.ts); re-read 2026-09-22',
    });
    for (const s of CLASS6_OFFICIAL_SECTIONS.filter((x) => x.officialChapterId === c.officialChapterId)) {
      const printed = observed.get(s.sectionNumber) ?? null;
      out.push({
        recordId: s.officialSectionId,
        grade: 'class6',
        classNumber: 6,
        sourceId: 'ncert_fegp1',
        authority: 'NCERT',
        sourceKind: 'textbook',
        bookPart: null,
        level: 'section',
        number: s.sectionNumber,
        title: s.exactTitle,
        descriptor: null,
        parentId: c.officialChapterId,
        // The printed folio where it was observed; the registry value is
        // kept alongside when the two differ (finding F2).
        startPage: printed ?? s.startPage,
        pageBasis: printed === null
          ? 'accepted registry start page'
          : 'printed page observed 2026-09-22 (chapter start + PDF offset)',
        registryStartPage: printed !== null && printed !== s.startPage ? s.startPage : null,
        structureStatus: 'primary_source_verified',
        intentStatus: AUTHORED_IDS.has(s.officialSectionId) ? 'page_level_inspected' : 'not_inspected',
        nonInstructional: false,
        evidence: 'accepted Class 6 registry (officialSections.ts); title and number re-confirmed 2026-09-22',
      });
    }
  }
  return out;
}

function textbookRecords(): MasterRecord[] {
  return MASTER_EVIDENCE.records
    .filter((r) => r.sourceId !== 'ncert_fegp1')
    .map((r) => ({
      recordId: r.recordId,
      grade: gradeOf(r.grade),
      classNumber: r.grade,
      sourceId: r.sourceId,
      authority: 'NCERT' as const,
      sourceKind: 'textbook' as const,
      bookPart: partOf(r.sourceId),
      level: r.level as MasterLevel,
      number: r.number,
      title: r.title,
      descriptor: r.descriptor ?? null,
      parentId: r.parentId,
      startPage: r.startPage,
      pageBasis: r.pageBasis,
      registryStartPage: null,
      structureStatus: 'primary_source_verified' as const,
      intentStatus: 'not_inspected' as const,
      nonInstructional: isNonInstructional(r.level, r.title),
      evidence: r.evidence,
    }));
}

function syllabusRecords(): MasterRecord[] {
  const out: MasterRecord[] = [];
  for (const src of syllabusSources()) {
    const reg = officialCurriculumForGrade(src.grade)!;
    for (const u of reg.units) {
      const base = {
        grade: src.grade,
        classNumber: src.classNumber,
        sourceId: src.sourceId,
        authority: 'CBSE' as const,
        sourceKind: 'syllabus' as const,
        bookPart: null,
        descriptor: null,
        startPage: null,
        pageBasis: 'syllabus document (no page reference recorded)',
        registryStartPage: null,
        structureStatus: 'primary_source_verified' as const,
        intentStatus: 'not_inspected' as const,
        nonInstructional: false,
        evidence: `CBSE syllabus ${src.url}`,
      };
      out.push({ ...base, recordId: u.officialUnitId, level: 'unit', number: String(u.number), title: u.title, parentId: null });
      if (u.chaptersEstablished) {
        for (const ch of u.chapters) {
          out.push({ ...base, recordId: ch.officialChapterId, level: 'chapter', number: ch.number === null ? null : String(ch.number), title: ch.title, parentId: u.officialUnitId });
        }
      }
      for (const t of u.topics) {
        out.push({ ...base, recordId: t.officialTopicId, level: 'topic', number: t.number === undefined ? null : String(t.number), title: t.title, parentId: u.officialUnitId });
      }
    }
  }
  return out;
}

export const MASTER_RECORDS: MasterRecord[] = [
  ...textbookRecords().filter((r) => r.classNumber < 6),
  ...class6Records(),
  ...textbookRecords().filter((r) => r.classNumber > 6),
  ...syllabusRecords(),
];

export function recordsForClass(n: number): MasterRecord[] {
  return MASTER_RECORDS.filter((r) => r.classNumber === n);
}

// ---------------------------------------------------------------------------
// Counts, by level and by hierarchy — never collapsed
// ---------------------------------------------------------------------------

/** A count, or the reason there is no count. Never 0 in place of unknown. */
export type LevelCount = number | 'not_defined_by_source' | 'unknown';

function levelCount(sources: MasterSource[], level: MasterLevel): LevelCount {
  if (sources.length === 0) return 'unknown';
  const statuses = sources.map((s) => s.levels[level]);
  if (statuses.every((s) => s === 'not_defined_by_source')) return 'not_defined_by_source';
  if (statuses.some((s) => s === 'unknown' || s === 'partially_enumerated')) return 'unknown';
  const ids = new Set(sources.map((s) => s.sourceId));
  return MASTER_RECORDS.filter((r) => ids.has(r.sourceId) && r.level === level).length;
}

export type HierarchyCounts = Record<MasterLevel, LevelCount>;

export function textbookCounts(n: number): HierarchyCounts {
  const s = sourcesForClass(n).filter((x) => x.kind === 'textbook');
  return {
    unit: levelCount(s, 'unit'),
    chapter: levelCount(s, 'chapter'),
    section: levelCount(s, 'section'),
    subsection: levelCount(s, 'subsection'),
    topic: levelCount(s, 'topic'),
  };
}

export function syllabusCounts(n: number): HierarchyCounts | null {
  const s = sourcesForClass(n).filter((x) => x.kind === 'syllabus');
  if (s.length === 0) return null;
  return {
    unit: levelCount(s, 'unit'),
    chapter: levelCount(s, 'chapter'),
    section: levelCount(s, 'section'),
    subsection: levelCount(s, 'subsection'),
    topic: levelCount(s, 'topic'),
  };
}

/**
 * Whether the TEXTBOOK denominator for a class is known.
 *
 * Class 9 is the one exception today: only Ganita Manjari Part I is
 * published, and the CBSE syllabus prescribes a book with 15 chapters.
 * The Part I count is real; the class total is not known (finding F1).
 */
export function textbookDenominatorKnown(n: number): boolean {
  const books = sourcesForClass(n).filter((s) => s.kind === 'textbook');
  if (books.length === 0) return false;
  return books.every(
    (b) =>
      b.volumeCompleteness === 'complete_series_published' &&
      b.levels.chapter === 'primary_source_verified'
  );
}

export type ClassStructureStatus =
  | 'complete_at_structure_level'
  | 'structure_partially_known';

export function classStructureStatus(n: number): ClassStructureStatus {
  return textbookDenominatorKnown(n) ? 'complete_at_structure_level' : 'structure_partially_known';
}

// ---------------------------------------------------------------------------
// Authoring units and the product overlay
// ---------------------------------------------------------------------------

/**
 * The records Pragati would author against: the finest numbered
 * instructional level a textbook defines — its sections where it has
 * them, its chapters where it does not (Classes 1–5). Syllabus records
 * are alignment targets, not authoring units. Source-numbered "Summary"
 * sections are excluded so they do not inflate the backlog.
 */
export function authoringUnits(n?: number): MasterRecord[] {
  const books = MASTER_SOURCES.filter(
    (s) => s.kind === 'textbook' && (n === undefined || s.classNumber === n)
  );
  return books.flatMap((b) => {
    const level: MasterLevel = b.levels.section === 'primary_source_verified' ? 'section' : 'chapter';
    return MASTER_RECORDS.filter(
      (r) => r.sourceId === b.sourceId && r.level === level && !r.nonInstructional
    );
  });
}

export function productStatus(r: MasterRecord): ProductStatus {
  const authored = allAuthoredSections().find((s) => s.source.officialSectionId === r.recordId);
  if (!authored) {
    return {
      learn: 'missing',
      practice: 'missing',
      instructional: 'absent',
      review: 'not_started',
      reviewed: false,
      publication: 'unpublished',
    };
  }
  const a = assessSection(authored);
  const rr = reviewReadinessForSection(r.recordId);
  const review: ReviewStatus =
    rr.state === 'not_a_complete_draft' ? 'not_started' : rr.state;
  return {
    learn: a.hasExplanation ? 'authored' : 'missing',
    practice: a.guidedPracticeCount + a.independentPracticeCount > 0 ? 'authored' : 'missing',
    instructional: a.level,
    review,
    // Reviewed means an educator's response was received AND adjudicated.
    // Sent is not reviewed.
    reviewed: review === 'review_adjudicated',
    publication: a.publicationState,
  };
}

export type ClassGapReport = {
  classNumber: number;
  structureStatus: ClassStructureStatus;
  /** Authoring units read from primary sources. */
  verifiedUnits: number;
  /** Authoring units known to exist but not yet read: a number, or unknown. */
  unverifiedUnits: number | 'unknown';
  learnAuthored: number;
  learnMissing: number;
  practiceAuthored: number;
  practiceMissing: number;
  instructionallyComplete: number;
  reviewReady: number;
  reviewSent: number;
  reviewed: number;
  published: number;
};

export function gapReport(n: number): ClassGapReport {
  const units = authoringUnits(n);
  const st = units.map(productStatus);
  const c = (f: (s: ProductStatus) => boolean) => st.filter(f).length;
  return {
    classNumber: n,
    structureStatus: classStructureStatus(n),
    verifiedUnits: units.length,
    unverifiedUnits: textbookDenominatorKnown(n) ? 0 : 'unknown',
    learnAuthored: c((s) => s.learn === 'authored'),
    learnMissing: c((s) => s.learn === 'missing'),
    practiceAuthored: c((s) => s.practice === 'authored'),
    practiceMissing: c((s) => s.practice === 'missing'),
    instructionallyComplete: c((s) => s.instructional === 'complete_instructional_draft'),
    reviewReady: c((s) => s.review === 'review_ready'),
    reviewSent: c((s) => s.review === 'review_sent'),
    reviewed: c((s) => s.reviewed),
    published: c((s) => s.publication === 'published'),
  };
}

// ---------------------------------------------------------------------------
// Production backlog — generated, not executed
// ---------------------------------------------------------------------------

export type ProductionWave = {
  wave: number;
  classes: number[];
  reason: string;
  gate: string;
};

/**
 * The recommended sequence. Every class appears in exactly one wave, so
 * no official record can be left out of the backlog for being
 * inconvenient. The order weighs grade progression, foundational
 * dependency, source readiness, representation needs and review
 * capacity — not which renderer already exists.
 */
export const PRODUCTION_WAVES: ProductionWave[] = [
  {
    wave: 1,
    classes: [6],
    reason:
      'Twelve sections are complete and review-ready. Educator feedback on §7.4 calibrates the Middle Stage authoring standard before it is applied at scale; finishing Class 6 establishes the standard every later class reuses.',
    gate: 'Educator and curriculum-specialist feedback on §7.4 received and adjudicated.',
  },
  {
    wave: 2,
    classes: [3, 4, 5],
    reason:
      'Preparatory Stage number sense, place value, measurement and fractions are prerequisites for the Middle Stage. Chapter-level authoring units keep the record count low; representation needs are concrete and visual.',
    gate: 'A Preparatory Stage authoring standard derived from primary pages, and a primary-grade reviewer identified.',
  },
  {
    wave: 3,
    classes: [7, 8],
    reason:
      'Continues the Ganita Prakash series directly from Class 6, so the Middle Stage standard and reviewer pool carry over. Two-part books: chapters are identified by part.',
    gate: 'Wave 1 adjudicated; page-level intent inspected per section before authoring.',
  },
  {
    wave: 4,
    classes: [1, 2],
    reason:
      'Foundational Stage content is play- and manipulative-based and read aloud; it needs its own design standard and an early-grades reviewer rather than a reuse of Middle Stage patterns.',
    gate: 'A Foundational Stage standard and an early-grades reviewer.',
  },
  {
    wave: 5,
    classes: [10, 11, 12],
    reason:
      'Stable rationalised textbooks with numbered sections and CBSE syllabi alignment. Large record counts and board-exam stakes; best authored after the standards from waves 1–3 are proven.',
    gate: 'Secondary Stage standard; CBSE unit-to-chapter alignment decided by a curriculum specialist, not inferred.',
  },
  {
    wave: 6,
    classes: [9],
    reason:
      'Only Ganita Manjari Part I is published, and the CBSE syllabus prescribes a book with 15 chapters. Part I sections are verified and listed, but the class cannot be planned to completion.',
    gate: 'Part II published, or NCERT confirms Part I is the full Class 9 book (finding F1).',
  },
];

export type BacklogEntry = {
  wave: number;
  record: MasterRecord;
  status: ProductStatus;
};

export function productionBacklog(): BacklogEntry[] {
  const out: BacklogEntry[] = [];
  for (const w of PRODUCTION_WAVES) {
    for (const n of w.classes) {
      for (const r of authoringUnits(n)) {
        const status = productStatus(r);
        // Already published work leaves the backlog; nothing else does.
        if (status.publication === 'published') continue;
        out.push({ wave: w.wave, record: r, status });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// The in-app registry is behind the master map (decision A, v0.83)
// ---------------------------------------------------------------------------

/**
 * Classes whose textbook structure the master map has verified but the
 * runtime registry (`OFFICIAL_CURRICULA`, read by the Student and
 * Teacher screens) still records as pending.
 *
 * Wiring them in changes frozen Student and Teacher surfaces — and the
 * two-part books restart chapter numbering — so it is a separate,
 * approved step. Until then every generated document names these
 * classes, so the lag is stated rather than hidden.
 */
export function registryLagClasses(): number[] {
  return CLASS_NUMBERS.filter((n) => {
    const reg = officialCurriculumForGrade(gradeOf(n));
    const regVerified = reg?.status === 'primary_source_verified';
    const bookVerified = sourcesForClass(n).some((s) => s.kind === 'textbook');
    return bookVerified && !regVerified;
  });
}
