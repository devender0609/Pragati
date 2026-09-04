// v0.68 (Classes 1–12 spec, §A–§G) — THE CANONICAL OFFICIAL CURRICULUM
// REGISTRY.
//
// THE PRODUCT DEFECT THIS FIXES
//
// Pragati showed six "chapters" for Class 3 and ten for Class 6, and a
// user could only read that as a statement about the two curricula. It
// was not. Class 6 had been verified against the current NCERT book;
// Class 3's six rows were an inventory of Pragati's own legacy modules.
// A missing Pragati lesson was silently deleting an official chapter.
//
// THE PERMANENT SEPARATION
//
//   OFFICIAL CURRICULUM — what the current authoritative source says
//                         exists. This file.
//   PRAGATI COVERAGE    — what Pragati has mapped, authored, reviewed
//                         or published. Everywhere else.
//
// A grade's official structure is stated here or it is UNKNOWN. It is
// never inferred from how many modules Pragati happens to have, and
// UNKNOWN is never rendered as zero.
//
// ---------------------------------------------------------------------
// SOURCES, AND THE LIMITS OF WHAT WAS OBTAINABLE
// ---------------------------------------------------------------------
//
// Classes IX–XII: the CBSE Academic Unit publishes the 2026-27
// Mathematics curriculum as PDFs on cbseacademic.nic.in, and that
// domain serves automated clients. All four were retrieved and read on
// 2026-08-27. Their unit and topic structure below is transcribed from
// those documents.
//
// Class VI: unchanged from v0.61, which read Ganita Prakash from the
// full-book archive. Ten chapters, primary-source verified.
//
// Classes I–V, VII, VIII: NOT VERIFIED, and deliberately so.
// ncert.nic.in disallows automated access, and every attempt in this
// iteration was refused. Secondary sources agree on the TEXTBOOK
// TITLES (Joyful Mathematics, Maths Mela, Ganita Prakash) and those are
// recorded as secondary corroboration — but v0.51 already demonstrated
// why agreeing secondary sources are not evidence: for Class 7 they
// disagreed about whether the book has 15 or 16 chapters, and for
// Class 6 they happened to agree, which felt like confirmation and was
// not.
//
// So those seven grades carry `official_structure_pending_verification`
// with a null unit count. Not zero. Not an estimate carried over from
// the pre-NCF books. Null, with the reason attached and the manual step
// written down for a person to perform.

import type { Grade } from '../types';

export type CurriculumAuthority = 'NCERT' | 'CBSE';

export type OfficialStructureStatus =
  /** No current source has been located for this grade. */
  | 'no_source_located'
  /** The current textbook or syllabus is identified, but its unit list
   *  has not been read from the primary document. */
  | 'official_structure_pending_verification'
  /** The unit list was read from the authoritative document itself. */
  | 'primary_source_verified';

export type OfficialTopic = {
  officialTopicId: string;
  title: string;
  /** Present when the source numbers its topics. */
  number?: number;
};

/**
 * v0.69 §19 — UNIT, CHAPTER AND TOPIC ARE THREE DIFFERENT THINGS.
 *
 * v0.68 collapsed them, and the result was a lie the UI told with a
 * straight face: Class 10's student view said "7 chapters" when the 7
 * are CBSE syllabus UNITS. Unit II ("Algebra") is not a chapter; it
 * contains four topics that each look like a chapter title but whose
 * correspondence to NCERT chapters has not been read from the textbook.
 *
 * So each curriculum declares which levels its source actually
 * establishes, and the UI labels what it shows accordingly.
 */
export type StructureLevel = 'unit' | 'chapter' | 'topic';

export type OfficialChapterRecord = {
  officialChapterId: string;
  /** Null when the source names chapters without numbering them
   *  independently of their unit. */
  number: number | null;
  title: string;
};

export type OfficialUnit = {
  officialUnitId: string;
  /** Unit or chapter number as the source gives it. */
  number: number;
  title: string;
  /** What this entry IS, according to its source. A Class 6 entry is a
   *  chapter; a Class 10 entry is a syllabus unit. */
  level: StructureLevel;
  /**
   * Chapters inside this unit, where the source names them.
   *
   * Class IX is the case that makes this necessary: its syllabus prints
   * an explicit Chapter Name column, so its 15 chapters are real. Class
   * X's syllabus does not, so `chaptersEstablished` is false there and
   * the topic list must NOT be relabelled as chapters.
   */
  chapters: OfficialChapterRecord[];
  chaptersEstablished: boolean;
  /** Named sub-topics where the source enumerates them. An EMPTY array
   *  means the source lists none; `topicsKnown: false` means the source
   *  was not read at that depth. The two are different and the UI must
   *  not merge them. */
  topics: OfficialTopic[];
  topicsKnown: boolean;
  /** Marks weighting, where the source assigns it. */
  marks?: number;
};

export type OfficialCurriculum = {
  officialCurriculumId: string;
  grade: Grade;
  subject: 'mathematics';
  stage: 'foundational' | 'preparatory' | 'middle' | 'secondary' | 'senior_secondary';
  authority: CurriculumAuthority;
  /** Title of the prescribed book or syllabus document. Null when even
   *  the title is unestablished. */
  documentTitle: string | null;
  academicYear: string | null;
  edition: string | null;
  sourceUrl: string | null;
  inspectionDate: string | null;
  status: OfficialStructureStatus;
  /**
   * The level of the entries in `units`. 'chapter' for a textbook whose
   * contents page was read; 'unit' for a syllabus organised into units.
   * Drives the noun the UI uses, so a unit is never called a chapter.
   */
  topLevel: StructureLevel;
  /** What was actually checked, and what was not. Rendered verbatim in
   *  Admin so the claim can be judged rather than trusted. */
  evidenceNote: string;
  units: OfficialUnit[];
  /** The exact manual step required to advance the status. Null when
   *  already verified. */
  manualVerificationStep: string | null;
};

const NCERT_BLOCKED =
  'ncert.nic.in disallows automated access (robots.txt), so the chapter list could not be read from the primary document. ' +
  'The textbook title is corroborated by independent secondary sources only. Secondary agreement is not evidence: for Class 7 ' +
  'independent sources disagree on whether the book has 15 or 16 chapters, and for Class 6 they agreed while still not having ' +
  'been checked. The unit count is therefore UNKNOWN, not estimated.';

const NCERT_MANUAL_STEP =
  'Open the current NCERT textbook PDF for this grade in a browser, read the Contents page, and record each chapter number and ' +
  'exact title. Then set status to primary_source_verified with the inspection date and the verifier name.';

function pending(
  grade: Grade,
  stage: OfficialCurriculum['stage'],
  documentTitle: string | null,
  note: string
): OfficialCurriculum {
  return {
    officialCurriculumId: `ncert_math_${grade}`,
    grade,
    subject: 'mathematics',
    stage,
    authority: 'NCERT',
    documentTitle,
    academicYear: '2026-27',
    edition: null,
    sourceUrl: 'https://ncert.nic.in/textbook.php',
    inspectionDate: null,
    status: documentTitle
      ? 'official_structure_pending_verification'
      : 'no_source_located',
    // A textbook's contents page yields chapters. Until it is read we
    // do not know how many, but we do know what they will be called.
    topLevel: 'chapter',
    evidenceNote: `${note} ${NCERT_BLOCKED}`,
    units: [],
    manualVerificationStep: NCERT_MANUAL_STEP,
  };
}

// ---------------------------------------------------------------------------
// Classes IX–XII — CBSE Academic Unit, Curriculum 2026-27.
// Retrieved and read 2026-08-27 from cbseacademic.nic.in.
// ---------------------------------------------------------------------------

const CBSE_2026_27_NOTE_IX =
  'Read directly from the CBSE Academic Unit Mathematics syllabus for Class IX, Curriculum 2026-27. ' +
  'The document gives a COURSE STRUCTURE table naming six units and, unusually for CBSE, an explicit chapter name per unit. ' +
  'Both levels are transcribed. The syllabus is redesigned against NEP 2020 and NCF-SE 2023 and reproduces the NCF curricular goals CG-1..CG-11. ' +
  'Prescribed book: Mathematics Textbook for Class IX, NCERT.';

const CBSE_2026_27_NOTE_X =
  'Read directly from the CBSE Academic Unit Mathematics syllabus for Class X, Curriculum 2026-27 (subject codes 041 and 241). ' +
  'The document gives seven units with marks weighting and enumerates the content topics within each. Unlike Class IX it does not ' +
  'print a separate chapter-name column, so the topic titles are transcribed from the content column. ' +
  'Prescribed book: Mathematics Textbook for Class X, NCERT.';

const CBSE_2026_27_NOTE_XI =
  'Read directly from the CBSE Academic Unit Mathematics syllabus for Classes XI-XII, Curriculum 2026-27 (subject code 041). ' +
  'Five units for Class XI with marks weighting and numbered topics within each. The document additionally lists topics assessed ' +
  'FORMATIVELY ONLY; those are not counted as summative units here and are noted rather than dropped.';

const CBSE_2026_27_NOTE_XII =
  'Read directly from the CBSE Academic Unit Mathematics syllabus for Classes XI-XII, Curriculum 2026-27 (subject code 041). ' +
  'Six units for Class XII with marks weighting and numbered topics within each. ' +
  'Prescribed books: Mathematics Part I and Part II for Class XII, NCERT.';

const CBSE_IX_URL =
  'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf';
const CBSE_X_URL =
  'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1X_2026-27.pdf';
const CBSE_XI_XII_URL =
  'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Maths_SecP2_2026-27.pdf';

function unit(
  prefix: string,
  number: number,
  title: string,
  topics: string[],
  marks?: number,
  /** Chapter names, ONLY where the source prints them. Class IX does;
   *  Classes X-XII do not, and inventing them there is exactly the
   *  conflation §19 forbids. */
  chapterNames?: string[]
): OfficialUnit {
  const uid = `${prefix}_u${String(number).padStart(2, '0')}`;
  return {
    officialUnitId: uid,
    number,
    title,
    level: 'unit',
    chapters: (chapterNames ?? []).map((t, i) => ({
      officialChapterId: `${uid}_c${i + 1}`,
      number: null,
      title: t,
    })),
    chaptersEstablished: chapterNames !== undefined,
    topics: topics.map((t, i) => ({
      officialTopicId: `${uid}_t${i + 1}`,
      title: t,
      number: i + 1,
    })),
    topicsKnown: true,
    ...(marks === undefined ? {} : { marks }),
  };
}

const CLASS_9: OfficialCurriculum = {
  officialCurriculumId: 'cbse_math_class9_2026_27',
  grade: 'class9',
  subject: 'mathematics',
  stage: 'secondary',
  authority: 'CBSE',
  documentTitle: 'Mathematics, Class IX — CBSE Curriculum 2026-27',
  academicYear: '2026-27',
  edition: 'Curriculum 2026-27',
  sourceUrl: CBSE_IX_URL,
  inspectionDate: '2026-08-27',
  status: 'primary_source_verified',
  // The syllabus is organised into units, and uniquely among IX-XII it
  // also prints a Chapter Name column — so both levels are real here.
  topLevel: 'unit',
  evidenceNote: CBSE_2026_27_NOTE_IX,
  manualVerificationStep: null,
  units: [
    unit('cbse_ix', 1, 'Number System', ['Number System'], 7, ['Number System']),
    unit(
      'cbse_ix',
      2,
      'Algebra',
      [
        'Introduction to Polynomials',
        'Sequences and Progressions',
        'Exploring Algebraic Identities',
        'Linear Equations in Two Variables',
      ],
      20,
      [
        'Introduction to Polynomials',
        'Sequences and Progressions',
        'Exploring Algebraic Identities',
        'Linear Equations in Two Variables',
      ]
    ),
    unit('cbse_ix', 3, 'Coordinate Geometry', ['Coordinate Geometry'], 4, [
      'Coordinate Geometry',
    ]),
    unit(
      'cbse_ix',
      4,
      'Geometry',
      [
        "Introduction to Euclid's Geometry: Axioms and Postulates",
        'Lines and Angles',
        'Triangles – Congruence Theorems',
        '4-gons (Quadrilaterals)',
        'Circles',
      ],
      25,
      [
        "Introduction to Euclid's Geometry: Axioms and Postulates",
        'Lines and Angles',
        'Triangles – Congruence Theorems',
        '4-gons (Quadrilaterals)',
        'Circles',
      ]
    ),
    unit(
      'cbse_ix',
      5,
      'Mensuration',
      ['Area and Perimeter', 'Surface Area and Volume'],
      14,
      ['Area and Perimeter', 'Surface Area and Volume']
    ),
    unit(
      'cbse_ix',
      6,
      'Statistics and Probability',
      ['Statistics', 'Introduction to Probability'],
      10,
      ['Statistics', 'Introduction to Probability']
    ),
  ],
};

const CLASS_10: OfficialCurriculum = {
  officialCurriculumId: 'cbse_math_class10_2026_27',
  grade: 'class10',
  subject: 'mathematics',
  stage: 'secondary',
  authority: 'CBSE',
  documentTitle: 'Mathematics, Class X — CBSE Curriculum 2026-27',
  academicYear: '2026-27',
  edition: 'Curriculum 2026-27',
  sourceUrl: CBSE_X_URL,
  inspectionDate: '2026-08-27',
  status: 'primary_source_verified',
  // Units only. The syllabus enumerates content topics but prints no
  // chapter-name column, so no unit here claims chapters. Several
  // topic titles resemble NCERT chapter names; resembling is not
  // evidence, and §19 forbids asserting the equivalence without the
  // textbook.
  topLevel: 'unit',
  evidenceNote: CBSE_2026_27_NOTE_X,
  manualVerificationStep: null,
  units: [
    unit('cbse_x', 1, 'Number Systems', ['Real Numbers'], 6),
    unit(
      'cbse_x',
      2,
      'Algebra',
      [
        'Polynomials',
        'Pair of Linear Equations in Two Variables',
        'Quadratic Equations',
        'Arithmetic Progressions',
      ],
      20
    ),
    unit('cbse_x', 3, 'Coordinate Geometry', ['Coordinate Geometry'], 6),
    unit('cbse_x', 4, 'Geometry', ['Triangles', 'Circles'], 15),
    unit(
      'cbse_x',
      5,
      'Trigonometry',
      ['Introduction to Trigonometry', 'Trigonometric Identities', 'Heights and Distances'],
      12
    ),
    unit(
      'cbse_x',
      6,
      'Mensuration',
      ['Areas Related to Circles', 'Surface Areas and Volumes'],
      10
    ),
    unit('cbse_x', 7, 'Statistics and Probability', ['Statistics', 'Probability'], 11),
  ],
};

const CLASS_11: OfficialCurriculum = {
  officialCurriculumId: 'cbse_math_class11_2026_27',
  grade: 'class11',
  subject: 'mathematics',
  stage: 'senior_secondary',
  authority: 'CBSE',
  documentTitle: 'Mathematics, Class XI — CBSE Curriculum 2026-27',
  academicYear: '2026-27',
  edition: 'Curriculum 2026-27',
  sourceUrl: CBSE_XI_XII_URL,
  inspectionDate: '2026-08-27',
  status: 'primary_source_verified',
  // Units only. The syllabus enumerates content topics but prints no
  // chapter-name column, so no unit here claims chapters. Several
  // topic titles resemble NCERT chapter names; resembling is not
  // evidence, and §19 forbids asserting the equivalence without the
  // textbook.
  topLevel: 'unit',
  evidenceNote: CBSE_2026_27_NOTE_XI,
  manualVerificationStep: null,
  units: [
    unit(
      'cbse_xi',
      1,
      'Sets and Functions',
      ['Sets', 'Relations and Functions', 'Trigonometric Functions'],
      23
    ),
    unit(
      'cbse_xi',
      2,
      'Algebra',
      [
        'Complex Numbers and Quadratic Equations',
        'Linear Inequalities',
        'Permutations and Combinations',
        'Binomial Theorem',
        'Sequence and Series',
      ],
      25
    ),
    unit(
      'cbse_xi',
      3,
      'Coordinate Geometry',
      ['Straight Lines', 'Conic Sections', 'Introduction to Three-dimensional Geometry'],
      12
    ),
    unit('cbse_xi', 4, 'Calculus', ['Limits and Derivatives'], 8),
    unit('cbse_xi', 5, 'Statistics and Probability', ['Statistics', 'Probability'], 12),
  ],
};

const CLASS_12: OfficialCurriculum = {
  officialCurriculumId: 'cbse_math_class12_2026_27',
  grade: 'class12',
  subject: 'mathematics',
  stage: 'senior_secondary',
  authority: 'CBSE',
  documentTitle: 'Mathematics, Class XII — CBSE Curriculum 2026-27',
  academicYear: '2026-27',
  edition: 'Curriculum 2026-27',
  sourceUrl: CBSE_XI_XII_URL,
  inspectionDate: '2026-08-27',
  status: 'primary_source_verified',
  // Units only. The syllabus enumerates content topics but prints no
  // chapter-name column, so no unit here claims chapters. Several
  // topic titles resemble NCERT chapter names; resembling is not
  // evidence, and §19 forbids asserting the equivalence without the
  // textbook.
  topLevel: 'unit',
  evidenceNote: CBSE_2026_27_NOTE_XII,
  manualVerificationStep: null,
  units: [
    unit(
      'cbse_xii',
      1,
      'Relations and Functions',
      ['Relations and Functions', 'Inverse Trigonometric Functions'],
      8
    ),
    unit('cbse_xii', 2, 'Algebra', ['Matrices', 'Determinants'], 10),
    unit(
      'cbse_xii',
      3,
      'Calculus',
      [
        'Continuity and Differentiability',
        'Applications of Derivatives',
        'Integrals',
        'Applications of the Integrals',
        'Differential Equations',
      ],
      35
    ),
    unit(
      'cbse_xii',
      4,
      'Vectors and Three-dimensional Geometry',
      ['Vectors', 'Three-dimensional Geometry'],
      14
    ),
    unit('cbse_xii', 5, 'Linear Programming', ['Linear Programming'], 5),
    unit('cbse_xii', 6, 'Probability', ['Probability'], 8),
  ],
};

// ---------------------------------------------------------------------------
// Class 6 — bridged from the existing verified record.
// ---------------------------------------------------------------------------

import { OFFICIAL_CHAPTERS, GANITA_PRAKASH_C6_SOURCE } from './officialChapters';
import { sectionsForChapter } from './officialSections';

const CLASS_6: OfficialCurriculum = {
  officialCurriculumId: 'ncert_ganita_prakash_class6',
  grade: 'class6',
  subject: 'mathematics',
  stage: 'middle',
  authority: 'NCERT',
  documentTitle: 'Ganita Prakash — Textbook of Mathematics for Grade 6',
  academicYear: '2026-27',
  edition: GANITA_PRAKASH_C6_SOURCE.edition,
  sourceUrl: GANITA_PRAKASH_C6_SOURCE.archiveUrl,
  inspectionDate: GANITA_PRAKASH_C6_SOURCE.inspectionDate,
  status: 'primary_source_verified',
  // A textbook contents page. These are chapters, not syllabus units.
  topLevel: 'chapter',
  evidenceNote:
    'v0.61 §9 — read from the primary source. The per-chapter PDF endpoint refuses automated access, but the full-book archive ' +
    'serves normally and contains the prelims plus all ten chapter PDFs. Chapter number and exact title were taken from the ' +
    'Contents page and cross-checked against each chapter\'s own opening page. Section depth is recorded for all ten chapters ' +
    '(65 sections, every one primary_source_verified), which makes Class 6 the only grade with a trustworthy topic-level ' +
    'denominator as well as a unit-level one.',
  manualVerificationStep: null,
  units: OFFICIAL_CHAPTERS.filter(
    (c) => c.grade === 'class6' && c.officialChapterNumber !== null
  )
    .slice()
    .sort((a, b) => (a.officialChapterNumber ?? 0) - (b.officialChapterNumber ?? 0))
    .map((c) => {
      const sections = sectionsForChapter(c.officialChapterId);
      return {
        officialUnitId: c.officialChapterId,
        number: c.officialChapterNumber as number,
        title: c.officialTitle as string,
        level: 'chapter' as const,
        // The entry IS the chapter, so there is no separate list.
        chapters: [],
        chaptersEstablished: true,
        topics: sections.map((s) => ({
          officialTopicId: s.officialSectionId,
          title: s.exactTitle,
        })),
        // Only Chapter 7 has been read at section depth. An empty topic
        // list elsewhere means NOT READ, not "has no sections".
        topicsKnown: sections.length > 0,
      };
    }),
};

// ---------------------------------------------------------------------------
// The registry
// ---------------------------------------------------------------------------

export const OFFICIAL_CURRICULA: OfficialCurriculum[] = [
  pending(
    'class1',
    'foundational',
    'Joyful Mathematics (NCERT)',
    'Textbook identity corroborated by secondary sources; chapter list not read.'
  ),
  pending(
    'class2',
    'foundational',
    'Joyful Mathematics (NCERT)',
    'Textbook identity corroborated by secondary sources; chapter list not read.'
  ),
  pending(
    'class3',
    'preparatory',
    'Maths Mela (NCERT)',
    'Textbook identity corroborated by secondary sources; chapter list not read.'
  ),
  pending(
    'class4',
    'preparatory',
    'Maths Mela (NCERT)',
    'Textbook identity corroborated by secondary sources; chapter list not read.'
  ),
  pending(
    'class5',
    'preparatory',
    'Maths Mela (NCERT)',
    'Textbook identity corroborated by secondary sources; chapter list not read.'
  ),
  CLASS_6,
  pending(
    'class7',
    'middle',
    'Ganita Prakash, Grade 7 (NCERT), Parts I and II',
    'Textbook identity corroborated, including a Reprint 2026-27 imprint. Chapter list NOT read, and secondary sources actively ' +
      'contradict each other on the total (15 vs 16 chapters) — the v0.51 finding that proved secondary agreement is not evidence.'
  ),
  pending(
    'class8',
    'middle',
    'Ganita Prakash, Grade 8 (NCERT), Part I',
    'Textbook identity corroborated (First Edition July 2025, Reprint 2026-27). Chapter list not read, and whether a Part II ' +
      'exists for 2026-27 is itself unestablished.'
  ),
  CLASS_9,
  CLASS_10,
  CLASS_11,
  CLASS_12,
];

export function officialCurriculumForGrade(
  grade: Grade
): OfficialCurriculum | null {
  return OFFICIAL_CURRICULA.find((c) => c.grade === grade) ?? null;
}

export function isGradeStructureVerified(grade: Grade): boolean {
  return officialCurriculumForGrade(grade)?.status === 'primary_source_verified';
}

/**
 * The official unit count, or null.
 *
 * NULL IS NOT ZERO. A UI that renders this as 0 is asserting that the
 * grade has no curriculum, which is the exact defect this file exists
 * to remove.
 */
export function officialUnitCount(grade: Grade): number | null {
  const c = officialCurriculumForGrade(grade);
  if (!c || c.status !== 'primary_source_verified') return null;
  return c.units.length;
}

/**
 * The official topic count, or null when the source was not read at
 * that depth.
 *
 * Class 6 is the case that makes this necessary: ten verified chapters,
 * but only Chapter 7 read at section level. Summing the known topics
 * would report 9 topics for a whole grade.
 */
export function officialTopicCount(grade: Grade): number | null {
  const c = officialCurriculumForGrade(grade);
  if (!c || c.status !== 'primary_source_verified') return null;
  if (c.units.some((u) => !u.topicsKnown)) return null;
  return c.units.reduce((n, u) => n + u.topics.length, 0);
}

/** Units whose sub-topics have not been read. Surfaced so partial depth
 *  is visible instead of being silently averaged away. */
export function unitsWithUnknownTopics(grade: Grade): OfficialUnit[] {
  const c = officialCurriculumForGrade(grade);
  if (!c) return [];
  return c.units.filter((u) => !u.topicsKnown);
}

export function gradesPendingVerification(): OfficialCurriculum[] {
  return OFFICIAL_CURRICULA.filter(
    (c) => c.status !== 'primary_source_verified'
  );
}

// ---------------------------------------------------------------------------
// v0.69 §19/§20 — truthful labels
// ---------------------------------------------------------------------------

/**
 * The noun for this grade's top-level entries.
 *
 * The v0.68 build said "7 chapters" for Class 10. The 7 are CBSE
 * syllabus UNITS: Unit II is "Algebra", which is not a chapter and
 * contains four topics. Calling it a chapter told a student something
 * the source does not say.
 *
 * Returns singular and plural so callers never build the plural by
 * appending "s" to a word they did not check.
 */
export function structureNoun(grade: Grade): {
  singular: string;
  plural: string;
  level: StructureLevel;
} {
  const c = officialCurriculumForGrade(grade);
  const level: StructureLevel = c?.topLevel ?? 'chapter';
  return level === 'unit'
    ? { singular: 'unit', plural: 'units', level }
    : { singular: 'chapter', plural: 'chapters', level };
}

/**
 * Chapters, where the source establishes them — otherwise null.
 *
 * Class 6 has 10 (the entries ARE chapters). Class 9 has 15 (its
 * syllabus names them inside the units). Classes 10-12 return NULL,
 * because nobody has read those textbooks.
 */
export function officialChapterCount(grade: Grade): number | null {
  const c = officialCurriculumForGrade(grade);
  if (!c || c.status !== 'primary_source_verified') return null;
  if (c.topLevel === 'chapter') return c.units.length;
  if (c.units.every((u) => u.chaptersEstablished)) {
    return c.units.reduce((n, u) => n + u.chapters.length, 0);
  }
  return null;
}

/** True when the source names chapters at all. */
export function chaptersEstablished(grade: Grade): boolean {
  return officialChapterCount(grade) !== null;
}

/**
 * The list a chapter-oriented student view should render.
 *
 * Class 6 → its ten chapters. Class 9 → its fifteen. Classes 10-12 →
 * null, because a chapter list does not exist to render; those grades
 * fall back to units and say so.
 */
export function officialChapterList(
  grade: Grade
): Array<{ id: string; number: number; title: string; unitTitle: string | null }> | null {
  const c = officialCurriculumForGrade(grade);
  if (!c || !chaptersEstablished(grade)) return null;
  if (c.topLevel === 'chapter') {
    return c.units.map((u) => ({
      id: u.officialUnitId,
      number: u.number,
      title: u.title,
      unitTitle: null,
    }));
  }
  let n = 0;
  return c.units.flatMap((u) =>
    u.chapters.map((ch) => {
      n += 1;
      return { id: ch.officialChapterId, number: n, title: ch.title, unitTitle: u.title };
    })
  );
}
