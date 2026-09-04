// v0.74 §20/§21 — THE OTHER BACKLOG, THE ONE THAT IS NOT CONTENT.
//
// THE ARITHMETIC THAT HIDES SEVEN GRADES
//
// The content backlog is a generator: it produces one entry per
// VERIFIED official record with no complete content. That is the right
// design, and it has an edge nobody had stated.
//
// A grade whose textbook nobody has read produces ZERO verified
// records, therefore ZERO backlog entries, therefore ZERO planned work.
// Classes 1, 2, 3, 4, 5, 7 and 8 contribute nothing to "89 records" —
// not because they are done, but because their denominator is unknown.
//
// A reader who sees "89 official records need work" and knows Pragati
// covers Classes 1-12 will reasonably conclude 89 is the Classes 1-12
// workload. It is the workload currently KNOWABLE. More than half the
// grades are absent from it.
//
// So this file holds the second backlog explicitly. It is not
// instructional content work and must never be added to the content
// numbers. It is HUMAN EVIDENCE work: somebody opens a printed or
// official-PDF textbook and records what is in it.
//
// WHY THERE IS NO ENGINEERING HERE
//
// The templates, the validator and the patch workflow have existed
// since v0.70. `curriculum-verification/grade7_curriculum_verification.json`
// is a filled-in-the-blanks form. The validator refuses gaps in
// numbering, blank titles, a missing edition line and a verifier who is
// not a person. Nothing more is needed and nothing more should be
// built: ncert.nic.in blocks automated fetch, so the missing input is a
// person with a book.

import type { Grade } from '../types';
import { officialCurriculumForGrade } from './officialCurriculum';
import { ALL_TWELVE_GRADES } from './curriculumCompletenessAudit';
import {
  PRODUCTION_STAGE_LABEL,
  productionStageForGrade,
  type ProductionStage,
} from './productionStage';

export type StructureVerificationEntry = {
  grade: Grade;
  gradeLabel: string;
  stage: ProductionStage;
  stageLabel: string;
  /** The book or syllabus a person must open. */
  documentToInspect: string;
  /** The prepared template that receives the transcription. */
  templatePath: string;
  /** What is currently known. Deliberately honest about "nothing". */
  currentEvidence: string;
  /** The exact next human action. */
  action: string;
  /** Why no engineering task can substitute. */
  whyNotEngineering: string;
};

const LABEL: Record<Grade, string> = {
  class1: 'Class 1', class2: 'Class 2', class3: 'Class 3', class4: 'Class 4',
  class5: 'Class 5', class6: 'Class 6', class7: 'Class 7', class8: 'Class 8',
  class9: 'Class 9', class10: 'Class 10', class11: 'Class 11', class12: 'Class 12',
};

/**
 * Notes recorded from earlier releases' research, kept because they
 * change what the person should look for. Nothing here asserts a
 * chapter list — that is precisely what is missing.
 */
const INSPECTION_NOTES: Partial<Record<Grade, string>> = {
  class7:
    'Ganita Prakash Grade 7 — note whether Part I, Part II or both are held. Secondary sources disagree on the total (15 vs 16).',
  class8:
    'The NCF-SE aligned Grade 8 book. Confirm the title on the cover rather than assuming continuity from Grade 7.',
  class1: 'Foundational Stage. Confirm the prescribed book title before transcribing.',
  class2: 'Foundational Stage. Confirm the prescribed book title before transcribing.',
};

/**
 * Every grade whose official structure is not verified from a primary
 * source. DERIVED from the registry, so a grade cannot fall off this
 * list except by actually becoming verified.
 */
export function structureVerificationBacklog(): StructureVerificationEntry[] {
  const out: StructureVerificationEntry[] = [];

  for (const grade of ALL_TWELVE_GRADES) {
    const c = officialCurriculumForGrade(grade);
    if (c?.status === 'primary_source_verified') continue;

    const stage = productionStageForGrade(grade);
    out.push({
      grade,
      gradeLabel: LABEL[grade],
      stage,
      stageLabel: PRODUCTION_STAGE_LABEL[stage],
      documentToInspect:
        c?.documentTitle ??
        INSPECTION_NOTES[grade] ??
        'Prescribed Mathematics textbook — title not established',
      templatePath: `curriculum-verification/${grade.replace('class', 'grade')}_curriculum_verification.json`,
      currentEvidence:
        c?.evidenceNote ??
        'No primary-source evidence. No chapter list, no section list, no verified title.',
      action:
        c?.manualVerificationStep ??
        'Open the printed or official-PDF textbook, transcribe every chapter title exactly as the Contents page prints it into the template, and import it through Admin → Verify a curriculum from its textbook.',
      whyNotEngineering:
        'ncert.nic.in blocks automated fetch. The template, validator and import path have existed since v0.70; the missing input is a person with the book.',
    });
  }

  return out;
}

export type StructureVerificationSummary = {
  gradesUnverified: number;
  gradesVerified: number;
  gradeLabels: string[];
  /**
   * Deliberately null, not zero.
   *
   * How many official records these seven grades contain is unknown, and
   * rendering that as 0 is the single most misleading thing this file
   * could do — it would make more than half of Classes 1-12 look
   * finished.
   */
  unknownRecordCount: null;
  headline: string;
};

export function structureVerificationSummary(): StructureVerificationSummary {
  const entries = structureVerificationBacklog();
  return {
    gradesUnverified: entries.length,
    gradesVerified: ALL_TWELVE_GRADES.length - entries.length,
    gradeLabels: entries.map((e) => e.gradeLabel),
    unknownRecordCount: null,
    headline:
      `${entries.length} of ${ALL_TWELVE_GRADES.length} grades still require primary textbook verification: ` +
      `${entries.map((e) => e.gradeLabel).join(', ')}. ` +
      `They contribute no entries to the content backlog because their official structure is unknown — ` +
      `not because they are complete. The Classes 1-12 workload is larger than the content backlog states, ` +
      `by an amount nobody can yet count.`,
  };
}

/**
 * §21 — the guard.
 *
 * Any report that states a content-backlog total must also state the
 * unverified-grade count, or it implies the total is the whole of
 * Classes 1-12. Returns the sentence a report must carry.
 */
export function unknownCurriculumCaveat(): string {
  const s = structureVerificationSummary();
  return (
    `This is the workload knowable from verified sources. ` +
    `${s.gradesUnverified} grades (${s.gradeLabels.join(', ')}) have no verified official structure ` +
    `and contribute nothing to this figure.`
  );
}
