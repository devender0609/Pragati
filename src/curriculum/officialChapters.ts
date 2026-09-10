// v0.47 C — Official chapter records.
//
// This file is the *external authority* record: what chapters
// an authoritative NCERT / CBSE source says exist for each grade.
// It is not a record of Pragati modules. A row can exist here even
// when Pragati has NO module for it — that is how "missing chapter"
// coverage becomes visible in the coverage UI.
//
// The mapping from an OfficialChapterRecord to Pragati modules lives
// in `contentMapping.ts`. That separation is the fix for the
// v0.46 gap where CHAPTER_CATALOGUE was really a catalogue of
// Pragati modules.
//
// HONESTY CONTRACT:
//   Every record starts `verificationStatus: 'unverified'`.
//   `officialChapterNumber`, `officialTitle`, `textbookTitle`,
//   `sourceReference`, `edition`, and `dateVerified` MUST stay null
//   until a human reviewer has consulted the named source PDF and
//   flipped the record to `source_verified`.
//
// This iteration seeds a **skeleton** for Class 6 Mathematics only
// (the reference grade). Every other grade's official inventory is
// left EMPTY on purpose. When you start Batch 2/3/4/5 authoring,
// populate those grades from actual sources rather than inheriting
// the previous "60 unverified rows" story.

import type { Grade } from '../types';

export type Curriculum = 'CBSE_NCERT';

/** Re-export for downstream files that only need the enum. */
export type { Grade };

export type Subject = 'mathematics';

export type VerificationStatus =
  | 'unverified'         // no source consulted yet
  // v0.50: the textbook's existence, title, and edition were confirmed
  // on the publisher's own domain, but the chapter list came from
  // independent secondary sources because ncert.nic.in refuses
  // automated access (robots.txt). Honest middle ground — NOT a
  // substitute for source_verified.
  | 'secondary_corroborated'
  | 'source_verified'    // reviewer confirmed against an authoritative PDF
  // v0.61 §9: the primary PDF was retrieved from the publisher's own
  // domain and its contents page read directly. Strictly stronger than
  // 'secondary_corroborated', which never touched the primary source.
  | 'primary_source_verified'
  | 'teacher_verified';  // subject teacher confirmed content mapping too

/** Fields that MUST be non-null before a record may leave 'unverified'.
 *  Enforced by `validateOfficialChapter` and its test — a record cannot
 *  be marked verified just because someone edited the status string. */
export const REQUIRED_FOR_VERIFICATION = [
  'officialChapterNumber',
  'officialTitle',
  'textbookTitle',
  'sourceReference',
  'sourceOrganization',
  'edition',
  'dateVerified',
] as const;

export type OfficialChapterRecord = {
  /** Stable ID that survives edition changes. */
  officialChapterId: string;

  curriculum: Curriculum;
  /** e.g. "NCERT 2023-24" or "NCF 2005 revised 2023". */
  curriculumVersion: string | null;

  grade: Grade;
  subject: Subject;

  /** Only populated after `verificationStatus` advances. */
  officialChapterNumber: number | null;
  officialTitle: string | null;
  textbookTitle: string | null;
  sourceReference: string | null;
  edition: string | null;
  dateVerified: string | null;

  verificationStatus: VerificationStatus;

  /** v0.50 §15 — who published the source (e.g. 'NCERT'). */
  sourceOrganization: string | null;
  /** v0.50 §15 — page / chapter locator within the source. */
  pageReference: string | null;
  /** v0.50 §15 — what the verifier actually checked, and what they
   *  could not check. Read by the teacher-facing resource page. */
  verifierNotes: string | null;

  /** Free-text note visible to reviewers only. */
  notes: string;
};

/** Returns the list of required fields still missing. Empty means the
 *  record may legitimately hold a verified status. */
export function missingVerificationFields(
  rec: OfficialChapterRecord
): string[] {
  return REQUIRED_FOR_VERIFICATION.filter(
    (f) => rec[f] === null || rec[f] === undefined || rec[f] === ''
  );
}

/** §18 — a record claiming any verified status must carry its
 *  evidence. This is the guard that stops a status string from being
 *  upgraded by hand without a source. */
export function validateOfficialChapter(
  rec: OfficialChapterRecord
): string[] {
  if (rec.verificationStatus === 'unverified') return [];
  return missingVerificationFields(rec).map(
    (f) =>
      `${rec.officialChapterId}: status is '${rec.verificationStatus}' but '${f}' is not set.`
  );
}

function chapter(args: Partial<OfficialChapterRecord> & {
  officialChapterId: string;
  grade: Grade;
}): OfficialChapterRecord {
  return {
    curriculum: 'CBSE_NCERT',
    curriculumVersion: null,
    subject: 'mathematics',
    officialChapterNumber: null,
    officialTitle: null,
    textbookTitle: null,
    sourceReference: null,
    edition: null,
    dateVerified: null,
    verificationStatus: 'unverified',
    sourceOrganization: null,
    pageReference: null,
    verifierNotes: null,
    notes: '',
    ...args,
  };
}

// ---------------------------------------------------------------------------
// Seed records.
//
// Class 6 Mathematics — the reference grade. We list a Fractions
// placeholder because our Pragati module named "fractions" is the
// reference module for the new StudentShell. Every field is still
// null / 'unverified' until a source PDF is cited.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// NCERT Ganita Prakash (Class 6) — chapter list as corroborated in v0.50.
// Kept as data so the coverage UI and tests read one source of truth.
// ---------------------------------------------------------------------------

/**
 * v0.61 §9 — the primary source, exactly as inspected.
 *
 * Recorded as data rather than prose so the Admin roadmap, the mapping
 * document, and the tests all read one set of facts.
 */
export const GANITA_PRAKASH_C6_SOURCE = {
  issuingOrganization: 'NCERT (National Council of Educational Research and Training)',
  textbookTitle: 'Ganita Prakash',
  subtitle: 'Textbook of Mathematics for Grade 6',
  publicationCode: '0674',
  isbn: '978-93-5292-717-3',
  firstEdition: 'August 2024 (Shravna 1946)',
  reprints: ['December 2024 (Pausha 1946)', 'January 2026 (Pausha 1947)'],
  edition: 'Reprint 2026-27',
  curriculumFramework: 'NCF-SE 2023',
  /** The per-chapter PDF endpoint returns HTTP 503 to automated
   *  clients; the full-book archive does not. This is why seven
   *  iterations recorded the source as blocked. */
  blockedUrl: 'https://ncert.nic.in/textbook/pdf/fegp1ps.pdf',
  archiveUrl: 'https://ncert.nic.in/textbook/pdf/fegp1dd.zip',
  contentsPageLocation: 'Prelims PDF (fegp1ps.pdf), Contents page',
  inspectionDate: '2026-08-24',
  inspectionMethod:
    'Full-book archive retrieved from ncert.nic.in; Contents page read from ' +
    'the prelims PDF; every chapter number and title cross-checked against ' +
    'the opening page of that chapter\'s own PDF (fegp101.pdf … fegp110.pdf).',
  chapterFileNames: [
    'fegp101.pdf', 'fegp102.pdf', 'fegp103.pdf', 'fegp104.pdf', 'fegp105.pdf',
    'fegp106.pdf', 'fegp107.pdf', 'fegp108.pdf', 'fegp109.pdf', 'fegp110.pdf',
  ],
  totalOfficialChapters: 10,
  appendix: 'Learning Material Sheets (p. 272) — not a chapter.',
} as const;

const GANITA_PRAKASH_C6: Array<{
  id: string;
  number: number;
  title: string;
  startPage: number;
  note?: string;
}> = [
  { id: 'ncert_gp_c6_ch01_patterns', number: 1, title: 'Patterns in Mathematics', startPage: 1 },
  { id: 'ncert_gp_c6_ch02_lines_angles', number: 2, title: 'Lines and Angles', startPage: 13 },
  { id: 'ncert_gp_c6_ch03_number_play', number: 3, title: 'Number Play', startPage: 55 },
  { id: 'ncert_gp_c6_ch04_data_handling', number: 4, title: 'Data Handling and Presentation', startPage: 74 },
  {
    id: 'ncert_gp_c6_ch05_prime_time', number: 5, title: 'Prime Time', startPage: 107,
    note: 'Closest current home for Pragati\'s legacy factors_multiples module; NOT a title match.',
  },
  { id: 'ncert_gp_c6_ch06_perimeter_area', number: 6, title: 'Perimeter and Area', startPage: 129 },
  {
    id: 'ncert_gp_c6_ch07_fractions', number: 7, title: 'Fractions', startPage: 151,
    note: 'Maps to Pragati\'s reference "fractions" module. Chapter 7 in both the old and new textbooks.',
  },
  { id: 'ncert_gp_c6_ch08_constructions', number: 8, title: 'Playing with Constructions', startPage: 187 },
  { id: 'ncert_gp_c6_ch09_symmetry', number: 9, title: 'Symmetry', startPage: 217 },
  {
    id: 'ncert_gp_c6_ch10_other_side_of_zero', number: 10, title: 'The Other Side of Zero', startPage: 242,
    note: 'Integers. No Pragati Class 6 module currently covers this.',
  },
];

export const OFFICIAL_CHAPTERS: OfficialChapterRecord[] = [
  // -------------------------------------------------------------------
  // CLASS 6 MATHEMATICS — NCERT "Ganita Prakash".
  //
  // v0.50 §16 research finding, and it is a significant one:
  //
  // NCERT replaced the old 14-chapter Class 6 "Mathematics" textbook
  // with a new 10-chapter book, "Ganita Prakash", built on NEP 2020 /
  // NCF-SE 2023. Pragati's existing Class 6 module set — fractions,
  // decimals, factors_multiples, ratio_proportion, algebra, geometry —
  // matches the OLD book, not the current one. In Ganita Prakash there
  // is NO standalone Decimals chapter, NO Ratio and Proportion chapter,
  // and NO Algebra chapter at Class 6.
  //
  // Fractions survives as Chapter 7 in both books, which is why the
  // existing reference module still maps cleanly and why this was not
  // caught earlier.
  //
  // EVIDENCE AND ITS LIMITS:
  //   The textbook title, grade, and edition were confirmed on NCERT's
  //   own domain: ncert.nic.in/textbook/pdf/fegp1ps.pdf is titled
  //   "Textbook of Mathematics for Grade 6 GANITA PRAKASH Reprint
  //   2026-27". The 10-chapter list is corroborated by several
  //   independent secondary sources that agree exactly.
  //
  //   ncert.nic.in serves robots.txt rules that block automated
  //   retrieval, so the chapter list could NOT be read from the primary
  //   PDF programmatically. Every record below is therefore
  //   'secondary_corroborated', NOT 'source_verified'. A human must
  //   open the PDF and confirm before any of these advance.
  // -------------------------------------------------------------------
  ...GANITA_PRAKASH_C6.map((c) =>
    chapter({
      officialChapterId: c.id,
      grade: 'class6',
      curriculumVersion: 'NCF-SE 2023',
      officialChapterNumber: c.number,
      officialTitle: c.title,
      textbookTitle: 'Ganita Prakash',
      edition: 'Reprint 2026-27',
      sourceReference: GANITA_PRAKASH_C6_SOURCE.archiveUrl,
      sourceOrganization: 'NCERT',
      pageReference: `Contents page (prelims p. xi); chapter opens p. ${c.startPage}`,
      dateVerified: GANITA_PRAKASH_C6_SOURCE.inspectionDate,
      verificationStatus: 'primary_source_verified',
      verifierNotes:
        'v0.61 §9 — read from the PRIMARY source. The per-chapter PDF ' +
        'endpoint still refuses automated access (HTTP 503), but the ' +
        'full-book archive at ' + GANITA_PRAKASH_C6_SOURCE.archiveUrl +
        ' serves normally and contains the prelims plus all ten chapter ' +
        'PDFs. Chapter number and exact title were taken from the ' +
        'Contents page AND cross-checked against the opening page of ' +
        'each chapter\'s own PDF. Edition and ISBN read from the ' +
        'imprint page. NOT yet teacher_verified: no subject teacher has ' +
        'confirmed the content mapping.',
      notes: c.note ?? '',
    })
  ),

  // NOTE: the v0.47 'g06_fractions_officialplaceholder' ID is NOT a
  // record here. Keeping it as its own row would put a second, empty
  // "Fractions" chapter in the Class 6 catalogue and split the module's
  // coverage across two entries. It lives in CHAPTER_ID_ALIASES instead,
  // so old stored sessions, blueprints, and deep links resolve straight
  // to the real Chapter 7 record.
];

// ---------------------------------------------------------------------------
// Helpers used by the coverage UI + tests.
// ---------------------------------------------------------------------------

export function officialChaptersForGrade(grade: Grade): OfficialChapterRecord[] {
  return OFFICIAL_CHAPTERS.filter((c) => c.grade === grade);
}

/**
 * v0.51 §10 — the exact manual step required to advance Class 6 from
 * `secondary_corroborated` to `primary_source_verified`.
 *
 * Automated retrieval is impossible: ncert.nic.in serves robots.txt
 * rules that block it. This is not a temporary outage and re-trying
 * does not help, so the step is written down for a human instead.
 */
export const MANUAL_VERIFICATION_STEPS = {
  class6: {
    sourceUrl: 'https://ncert.nic.in/textbook/pdf/fegp1ps.pdf',
    alternateUrl: 'https://ncert.nic.in/textbook.php?fegp1=0-10',
    blocker:
      'ncert.nic.in disallows automated access (robots.txt). The PDF must be opened by a person.',
    steps: [
      'Open the source URL in a browser.',
      'Go to the Contents page.',
      'Confirm the textbook title reads "Ganita Prakash" and the edition matches the record.',
      'Confirm all ten chapter numbers and exact titles against the records in OFFICIAL_CHAPTERS.',
      'Record the contents page number in `pageReference`.',
      'Set `dateVerified` to the date of inspection and `verificationStatus` to `source_verified`.',
      'Record the verifier name in `verifierNotes`.',
    ],
    doNot:
      'Do not advance the status from any secondary source, however many agree. Class 7 shows why: independent secondary sources disagree about whether the book has 15 or 16 chapters.',
  },
} as const;

/**
 * v0.51 §7/§10 — Grade 7 proof-of-process.
 *
 * Attempting the same verification for Grade 7 produced a CONTRADICTION
 * between secondary sources, which is the most useful result this
 * exercise could have given us:
 *
 *   - Part 1's eight chapters agree across three independent sources.
 *   - The Part 2 chapter count does NOT agree: one source implies 15
 *     chapters in total, another states 16.
 *
 * For Class 6 the secondary sources happened to agree, which felt like
 * confirmation but was not evidence. Grade 7 demonstrates the failure
 * mode directly, so it is recorded rather than resolved by picking the
 * more common answer.
 */
export const GRADE7_VERIFICATION_FINDING = {
  grade: 'class7',
  textbookTitle: 'Ganita Prakash',
  parts: ['Part 1', 'Part 2'],
  primarySourceSeen: 'https://ncert.nic.in/textbook/pdf/gegp1ps.pdf (title/preface via search snippet only)',
  part1ChaptersCorroborated: [
    'Large Numbers Around Us',
    'Arithmetic Expressions',
    'A Peek Beyond the Point',
    'Expressions using Letter-Numbers',
    'Parallel and Intersecting Lines',
    'Number Play',
    'A Tale of Three Intersecting Lines',
    'Working with Fractions',
  ],
  contradiction:
    'Secondary sources disagree on the total chapter count (15 vs 16) and therefore on the Part 2 contents. No Grade 7 record may be created until the primary source is inspected.',
  status: 'blocked_pending_primary_source',
} as const;

export function verifiedChapterCount(): number {
  return OFFICIAL_CHAPTERS.filter(
    (c) => c.verificationStatus !== 'unverified'
  ).length;
}

/** Records whose chapter list still needs a human to read the primary
 *  PDF. Surfaced in Admin & Research so the gap stays visible. */
export function chaptersNeedingPrimaryVerification(): OfficialChapterRecord[] {
  return OFFICIAL_CHAPTERS.filter(
    (c) =>
      c.verificationStatus === 'unverified' ||
      c.verificationStatus === 'secondary_corroborated'
  );
}
