// v0.69 §16/§17 — MANUAL PRIMARY-SOURCE CURRICULUM INGESTION.
//
// THE PROBLEM
//
// Seven grades (1-5, 7, 8) have an unknown official chapter list because
// ncert.nic.in disallows automated access. v0.68 recorded that honestly
// and left a prose instruction to "record each chapter number and exact
// title, then set status to primary_source_verified".
//
// That instruction requires editing TypeScript, which means the only
// people who can verify a curriculum are people who can compile the
// app. That is the wrong constraint: reading a contents page is a
// five-minute job for a teacher and a compilation risk for nobody.
//
// THE SHAPE
//
// A JSON document, pasted into an Admin form or dropped in a file. JSON
// over CSV because chapters have optional nested sections and CSV
// forces either a second file or a flattening convention that gets
// mis-typed. JSON over a database form because the artefact is
// auditable — it can be committed, diffed and re-checked against the
// book by a second person.
//
// WHAT THIS DOES NOT DO
//
// It does not fetch anything. It does not infer a missing title. It
// does not accept a partially-filled record as verification. A rejected
// import leaves the grade exactly as unknown as it was, which is the
// correct outcome — a half-read contents page is not evidence.

import type { Grade } from '../types';
import {
  officialCurriculumForGrade,
  type OfficialCurriculum,
  type OfficialUnit,
} from './officialCurriculum';

/** The document a human fills in. Deliberately flat and obvious. */
export type ManualCurriculumSubmission = {
  grade: Grade;
  /** Exactly as printed on the cover. */
  officialBookTitle: string;
  academicYear: string;
  /** "First Edition April 2025, Reprint 2026-27" — as printed. */
  edition: string;
  /** Where the verifier read it. A URL, or "printed copy, school library". */
  source: string;
  /** Who read it. A real name; "admin" is not a verifier. */
  verifier: string;
  /** ISO date, YYYY-MM-DD. */
  inspectionDate: string;
  chapters: ManualChapterEntry[];
  /** Free text: anything odd about the book, e.g. a missing Part II. */
  notes?: string;
};

export type ManualChapterEntry = {
  number: number;
  /** Exactly as printed in the Contents. Not paraphrased. */
  title: string;
  /** Optional. Only if the verifier read the chapter's own section list. */
  sections?: Array<{ number: string; title: string }>;
  /** Optional page reference, to make a second check quick. */
  page?: number;
};

export type ImportIssue = {
  field: string;
  severity: 'error' | 'warning';
  message: string;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * §17 — validate a submission.
 *
 * `error` blocks the import entirely. `warning` is recorded and shown
 * but does not block, because a book genuinely may have an unnumbered
 * appendix and refusing it would push the verifier to lie.
 */
export function validateManualSubmission(
  submission: ManualCurriculumSubmission
): ImportIssue[] {
  const issues: ImportIssue[] = [];
  const err = (field: string, message: string) =>
    issues.push({ field, severity: 'error', message });
  const warn = (field: string, message: string) =>
    issues.push({ field, severity: 'warning', message });

  // The grade must exist and must actually be pending. Re-importing over
  // a primary-verified grade would silently replace evidence with a
  // paste, so it is refused rather than merged.
  const existing = officialCurriculumForGrade(submission.grade);
  if (!existing) {
    err('grade', `'${submission.grade}' is not a grade Pragati knows about`);
  } else if (existing.status === 'primary_source_verified') {
    err(
      'grade',
      `${submission.grade} is already primary-source verified. Superseding verified evidence requires a deliberate replacement, not an import.`
    );
  }

  if (!submission.officialBookTitle?.trim()) {
    err('officialBookTitle', 'the book title as printed on the cover is required');
  }
  if (!submission.academicYear?.trim()) {
    err('academicYear', 'academic year is required');
  }
  if (!submission.edition?.trim()) {
    err('edition', 'edition or reprint line is required — it is how a second person confirms the same book');
  }
  if (!submission.source?.trim()) {
    err('source', 'where the book was read is required');
  }
  if (!submission.verifier?.trim()) {
    err('verifier', 'a verifier name is required');
  } else if (/^(admin|user|test|n\/?a|unknown)$/i.test(submission.verifier.trim())) {
    err('verifier', `'${submission.verifier}' is not a person. Verification is attributable or it is not verification.`);
  }
  if (!ISO_DATE.test(submission.inspectionDate ?? '')) {
    err('inspectionDate', 'inspection date must be an ISO date, YYYY-MM-DD');
  }

  const chapters = submission.chapters ?? [];
  if (chapters.length === 0) {
    err('chapters', 'a curriculum with no chapters is not a verification');
    return issues;
  }

  const seenNumbers = new Set<number>();
  const seenTitles = new Set<string>();

  chapters.forEach((c, i) => {
    const at = `chapters[${i}]`;
    if (!Number.isInteger(c.number) || c.number < 1) {
      err(at, `chapter number '${c.number}' must be a positive whole number`);
    } else if (seenNumbers.has(c.number)) {
      err(at, `chapter number ${c.number} appears more than once`);
    } else {
      seenNumbers.add(c.number);
    }

    const title = (c.title ?? '').trim();
    if (!title) {
      // §17 — never infer a missing title. Unknown stays unknown.
      err(at, `chapter ${c.number} has no title. Read it from the book; do not guess it.`);
    } else if (seenTitles.has(title.toLowerCase())) {
      warn(at, `two chapters are both titled '${title}' — check this is really what the book says`);
    } else {
      seenTitles.add(title.toLowerCase());
    }

    if (c.sections) {
      const secNums = new Set<string>();
      c.sections.forEach((sec, j) => {
        if (!sec.title?.trim()) {
          err(`${at}.sections[${j}]`, 'a section with no title cannot be recorded');
        }
        if (!sec.number?.trim()) {
          err(`${at}.sections[${j}]`, 'a section with no number cannot be recorded');
        } else if (secNums.has(sec.number)) {
          err(`${at}.sections[${j}]`, `section number ${sec.number} is repeated in chapter ${c.number}`);
        } else {
          secNums.add(sec.number);
        }
      });
    }
  });

  // Numbering must run 1..n with no gaps. A gap means a page was
  // skipped, and a skipped page is the single most likely mistake in
  // this whole workflow.
  const sorted = [...seenNumbers].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) {
      err(
        'chapters',
        `chapter numbering jumps from ${sorted[i - 1] ?? 0} to ${sorted[i]}. If the book really skips a number, say so in notes; otherwise a chapter was missed.`
      );
      break;
    }
  }

  // Order in the submitted array should match the printed order.
  const asGiven = chapters.map((c) => c.number);
  if (JSON.stringify(asGiven) !== JSON.stringify([...asGiven].sort((a, b) => a - b))) {
    warn('chapters', 'chapters are not in numerical order as submitted — check nothing was pasted out of sequence');
  }

  return issues;
}

export function submissionIsImportable(
  submission: ManualCurriculumSubmission
): boolean {
  return !validateManualSubmission(submission).some((i) => i.severity === 'error');
}

/**
 * Convert a validated submission into a curriculum record.
 *
 * Returns null when the submission has any error. There is no partial
 * import: a grade is either verified from a source someone read, or it
 * is unknown.
 */
export function submissionToCurriculum(
  submission: ManualCurriculumSubmission
): OfficialCurriculum | null {
  if (!submissionIsImportable(submission)) return null;
  const existing = officialCurriculumForGrade(submission.grade);

  const units: OfficialUnit[] = [...submission.chapters]
    .sort((a, b) => a.number - b.number)
    .map((c) => {
      const id = `ncert_${submission.grade}_ch${String(c.number).padStart(2, '0')}`;
      return {
        officialUnitId: id,
        number: c.number,
        title: c.title.trim(),
        level: 'chapter' as const,
        chapters: [],
        chaptersEstablished: true,
        topics: (c.sections ?? []).map((sec) => ({
          officialTopicId: `${id}_s${sec.number}`,
          title: sec.title.trim(),
        })),
        // Sections are optional. Omitting them means NOT READ, which is
        // different from "this chapter has no sections".
        topicsKnown: (c.sections?.length ?? 0) > 0,
      };
    });

  return {
    officialCurriculumId: existing?.officialCurriculumId ?? `ncert_math_${submission.grade}`,
    grade: submission.grade,
    subject: 'mathematics',
    stage: existing?.stage ?? 'preparatory',
    authority: 'NCERT',
    documentTitle: submission.officialBookTitle.trim(),
    academicYear: submission.academicYear.trim(),
    edition: submission.edition.trim(),
    sourceUrl: submission.source.trim(),
    inspectionDate: submission.inspectionDate,
    status: 'primary_source_verified',
    topLevel: 'chapter',
    evidenceNote:
      `Manually verified by ${submission.verifier.trim()} on ${submission.inspectionDate} from ` +
      `${submission.officialBookTitle.trim()} (${submission.edition.trim()}), read at ${submission.source.trim()}. ` +
      `${units.length} chapters recorded from the Contents page.` +
      (submission.notes?.trim() ? ` Verifier's note: ${submission.notes.trim()}` : ''),
    manualVerificationStep: null,
    units,
  };
}

/** A filled-in shape for the verifier to copy. Not real data. */
export function blankSubmissionTemplate(grade: Grade): ManualCurriculumSubmission {
  return {
    grade,
    officialBookTitle: '',
    academicYear: '2026-27',
    edition: '',
    source: '',
    verifier: '',
    inspectionDate: '',
    chapters: [{ number: 1, title: '' }],
    notes: '',
  };
}

export function templateJson(grade: Grade): string {
  return JSON.stringify(blankSubmissionTemplate(grade), null, 2);
}

/** Parse pasted JSON, returning issues rather than throwing. */
export function parseSubmission(
  raw: string
): { submission: ManualCurriculumSubmission; issues: ImportIssue[] } | { submission: null; issues: ImportIssue[] } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return {
      submission: null,
      issues: [
        {
          field: 'json',
          severity: 'error',
          message: `That is not valid JSON: ${e instanceof Error ? e.message : String(e)}`,
        },
      ],
    };
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      submission: null,
      issues: [{ field: 'json', severity: 'error', message: 'Expected a single JSON object.' }],
    };
  }
  const submission = parsed as ManualCurriculumSubmission;
  return { submission, issues: validateManualSubmission(submission) };
}

// ---------------------------------------------------------------------------
// v0.70 §24 — THE COMMIT-READY PATCH
// ---------------------------------------------------------------------------

/**
 * Turn a validated submission into a deterministic TypeScript source
 * file, ready to commit.
 *
 * WHY A FILE AND NOT A SAVE BUTTON
 *
 * v0.69 stopped at "validated, not saved", which was right about safety
 * and wrong about usefulness — it left the last mile as an unspecified
 * engineering task, and §26 is correct that this cannot keep being the
 * excuse. A curriculum stored in localStorage is not auditable: nobody
 * can diff it, nobody can check it against the book, and it disappears
 * when the browser is cleared.
 *
 * A generated source file is auditable by construction. It goes through
 * review like any other change, a second person can read it beside the
 * Contents page, and git records who committed it and when.
 *
 * DETERMINISTIC
 *
 * The same submission always produces byte-identical output — chapters
 * sorted by number, no timestamps, no generated ids beyond those derived
 * from the grade and chapter number. Two people entering the same book
 * produce the same file, so a disagreement is visible as a diff rather
 * than as noise.
 */
export function generateRegistryPatch(
  submission: ManualCurriculumSubmission
): { path: string; contents: string } | null {
  const curriculum = submissionToCurriculum(submission);
  if (!curriculum) return null;

  const n = submission.grade.replace('class', '');
  const esc = (v: string) => JSON.stringify(v);
  const units = curriculum.units
    .map((u) => {
      const topics = u.topics
        .map(
          (t) =>
            `      { officialTopicId: ${esc(t.officialTopicId)}, title: ${esc(t.title)} },`
        )
        .join('\n');
      return [
        '  {',
        `    officialUnitId: ${esc(u.officialUnitId)},`,
        `    number: ${u.number},`,
        `    title: ${esc(u.title)},`,
        `    level: 'chapter',`,
        `    chapters: [],`,
        `    chaptersEstablished: true,`,
        topics ? `    topics: [\n${topics}\n    ],` : `    topics: [],`,
        `    topicsKnown: ${u.topicsKnown},`,
        '  },',
      ].join('\n');
    })
    .join('\n');

  const contents = `// GENERATED from a manual primary-source verification. Do not hand-edit.
//
// Grade:      ${submission.grade}
// Book:       ${submission.officialBookTitle}
// Edition:    ${submission.edition}
// Read at:    ${submission.source}
// Verifier:   ${submission.verifier}
// Inspected:  ${submission.inspectionDate}
//
// BEFORE COMMITTING, a second person must open the same book and confirm
// the chapter count and every title below. Verification by one person is
// a claim; verification by two is evidence.
//
// Regenerate with the Admin panel rather than editing: the file is
// deterministic, so a genuine disagreement shows up as a diff.

import type { OfficialCurriculum, OfficialUnit } from './officialCurriculum';

export const GRADE_${n}_UNITS: OfficialUnit[] = [
${units}
];

export const GRADE_${n}_CURRICULUM: OfficialCurriculum = {
  officialCurriculumId: ${esc(curriculum.officialCurriculumId)},
  grade: ${esc(curriculum.grade)},
  subject: 'mathematics',
  stage: ${esc(curriculum.stage)},
  authority: 'NCERT',
  documentTitle: ${esc(curriculum.documentTitle ?? '')},
  academicYear: ${esc(curriculum.academicYear ?? '')},
  edition: ${esc(curriculum.edition ?? '')},
  sourceUrl: ${esc(curriculum.sourceUrl ?? '')},
  inspectionDate: ${esc(curriculum.inspectionDate ?? '')},
  status: 'primary_source_verified',
  topLevel: 'chapter',
  evidenceNote: ${esc(curriculum.evidenceNote)},
  manualVerificationStep: null,
  units: GRADE_${n}_UNITS,
};
`;

  return { path: `src/curriculum/verified/grade${n}.ts`, contents };
}
