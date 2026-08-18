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

const GANITA_PRAKASH_C6: Array<{
  id: string;
  number: number;
  title: string;
  note?: string;
}> = [
  { id: 'ncert_gp_c6_ch01_patterns', number: 1, title: 'Patterns in Mathematics' },
  { id: 'ncert_gp_c6_ch02_lines_angles', number: 2, title: 'Lines and Angles' },
  { id: 'ncert_gp_c6_ch03_number_play', number: 3, title: 'Number Play' },
  { id: 'ncert_gp_c6_ch04_data_handling', number: 4, title: 'Data Handling and Presentation' },
  {
    id: 'ncert_gp_c6_ch05_prime_time', number: 5, title: 'Prime Time',
    note: 'Closest current home for Pragati\'s legacy factors_multiples module; NOT a title match.',
  },
  { id: 'ncert_gp_c6_ch06_perimeter_area', number: 6, title: 'Perimeter and Area' },
  {
    id: 'ncert_gp_c6_ch07_fractions', number: 7, title: 'Fractions',
    note: 'Maps to Pragati\'s reference "fractions" module. Chapter 7 in both the old and new textbooks.',
  },
  { id: 'ncert_gp_c6_ch08_constructions', number: 8, title: 'Playing with Constructions' },
  { id: 'ncert_gp_c6_ch09_symmetry', number: 9, title: 'Symmetry' },
  {
    id: 'ncert_gp_c6_ch10_other_side_of_zero', number: 10, title: 'The Other Side of Zero',
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
      sourceReference: 'https://ncert.nic.in/textbook/pdf/fegp1ps.pdf',
      sourceOrganization: 'NCERT',
      pageReference: `Chapter ${c.number}`,
      dateVerified: '2026-08-13',
      verificationStatus: 'secondary_corroborated',
      verifierNotes:
        'Textbook title, grade and edition confirmed on ncert.nic.in. ' +
        'Chapter number and title corroborated by multiple independent ' +
        'secondary sources but NOT read from the primary PDF, which ' +
        'blocks automated access. A human must confirm against the ' +
        'official PDF before this advances to source_verified.',
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
