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
  | 'source_verified'    // reviewer confirmed against an authoritative PDF
  | 'teacher_verified';  // subject teacher confirmed content mapping too

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

  /** Free-text note visible to reviewers only. */
  notes: string;
};

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

export const OFFICIAL_CHAPTERS: OfficialChapterRecord[] = [
  chapter({
    officialChapterId: 'g06_fractions_officialplaceholder',
    grade: 'class6',
    notes:
      'Reference chapter for the v0.47 Fractions journey. Pragati has an existing "fractions" module; ' +
      'once a reviewer consults the current NCERT Class 6 Mathematics textbook to confirm chapter number ' +
      'and exact title, set verificationStatus = source_verified and fill officialChapterNumber, officialTitle, ' +
      'textbookTitle, sourceReference (URL / physical citation), edition (e.g. "2023-24"), and dateVerified.',
  }),
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
