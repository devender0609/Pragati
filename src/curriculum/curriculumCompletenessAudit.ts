// v0.68 (Classes 1–12 spec, §A/§F/§G/§K) — OFFICIAL CURRICULUM vs
// PRAGATI COVERAGE, FOR ALL TWELVE GRADES.
//
// The one rule: these are two independent numbers and neither is
// allowed to determine the other.
//
//   - A verified official unit stays in the list when Pragati has
//     nothing for it. That is the whole point.
//   - Pragati's module count NEVER becomes the official unit count.
//   - An unknown official count is null and stays null. Rendering it as
//     zero would claim the grade has no curriculum.
//
// The mismatch classification in §G answers "why does this grade look
// thin?" — and the honest answer differs by grade. Class 3 looks thin
// because its official structure has never been read. Class 10 looks
// thin because Pragati has genuinely authored nothing for it. Those are
// not the same problem and must not share a label.

import type { Grade } from '../types';
import {
  OFFICIAL_CURRICULA,
  officialCurriculumForGrade,
  officialTopicCount,
  officialUnitCount,
  officialChapterCount,
  structureNoun,
  type OfficialCurriculum,
} from './officialCurriculum';
import { CHAPTER_CATALOGUE } from './chapterCatalogue';
import { getTeacherCoverageStatus } from './eligibilityPolicy';
import { fractionsChapterSections } from './fractionsChapter';

export const ALL_TWELVE_GRADES: Grade[] = [
  'class1', 'class2', 'class3', 'class4', 'class5', 'class6',
  'class7', 'class8', 'class9', 'class10', 'class11', 'class12',
];

const GRADE_TO_CATALOGUE_KEY: Record<Grade, string> = {
  class1: 'grade_01', class2: 'grade_02', class3: 'grade_03',
  class4: 'grade_04', class5: 'grade_05', class6: 'grade_06',
  class7: 'grade_07', class8: 'grade_08', class9: 'grade_09',
  class10: 'grade_10', class11: 'grade_11', class12: 'grade_12',
};

/** §G — why a grade shows fewer units than its authoritative source. */
export type MismatchReason =
  /** Official structure has never been read; nothing to compare. */
  | 'official_structure_unverified'
  /** Official structure is known and Pragati has content for some of it. */
  | 'partial_pragati_coverage'
  /** Official structure is known and Pragati has content for none of it. */
  | 'no_pragati_coverage'
  /** Pragati's rows for this grade are legacy modules, not official units. */
  | 'legacy_module_inventory_only'
  /** Official and Pragati structures agree. */
  | 'aligned';

export const MISMATCH_REASON_TEXT: Record<MismatchReason, string> = {
  official_structure_unverified:
    'The current official structure for this grade has not been read from a primary source, so no comparison is possible. The number of official units is unknown, not zero.',
  partial_pragati_coverage:
    'The official structure is verified. Pragati has content for some of it and none for the rest.',
  no_pragati_coverage:
    'The official structure is verified. Pragati has no content for this grade at all.',
  legacy_module_inventory_only:
    'The rows Pragati holds for this grade are legacy internal modules, not units of the current official curriculum. They must not be presented as official chapters.',
  aligned:
    'The official structure is verified and every official unit has Pragati content.',
};

export type GradeCurriculumAudit = {
  grade: Grade;
  gradeLabel: string;
  authority: string | null;
  documentTitle: string | null;
  academicYear: string | null;
  edition: string | null;
  sourceUrl: string | null;
  inspectionDate: string | null;
  registryStatus: OfficialCurriculum['status'];

  /** NULL when unknown. Never substituted. */
  officialUnitsKnown: number | null;
  /**
   * v0.69 §20 — chapters, where the source names them. NULL for Classes
   * 10-12: their syllabus is organised into units and nobody has read
   * the textbook, so a chapter count would be an invention.
   */
  officialChaptersKnown: number | null;
  officialTopicsKnown: number | null;
  /** The noun for this grade's top-level entries. Never assumed. */
  entryNoun: { singular: string; plural: string };
  officialUnitTitles: string[];

  /** How many official units Pragati represents in its registry. */
  representedInPragati: number;
  /** Official units with no Pragati representation. Null when the
   *  official count is unknown — you cannot subtract from unknown. */
  missingFromPragati: number | null;

  learnAvailable: number;
  practiceAvailable: number;
  reviewed: number;
  published: number;

  /** Legacy Pragati rows for this grade, which are NOT official units. */
  legacyModuleRows: number;

  mismatchReason: MismatchReason;
  evidenceNote: string;
  manualVerificationStep: string | null;
};

const LABEL: Record<Grade, string> = {
  class1: 'Class 1', class2: 'Class 2', class3: 'Class 3', class4: 'Class 4',
  class5: 'Class 5', class6: 'Class 6', class7: 'Class 7', class8: 'Class 8',
  class9: 'Class 9', class10: 'Class 10', class11: 'Class 11', class12: 'Class 12',
};

function class6Coverage() {
  const c = officialCurriculumForGrade('class6');
  let learn = 0;
  let practice = 0;
  let reviewed = 0;
  let represented = 0;
  for (const u of c?.units ?? []) {
    const cov = getTeacherCoverageStatus(u.officialUnitId);
    if (cov.learnAvailable > 0) learn += 1;
    if (cov.practiceAvailable > 0) practice += 1;
    if (cov.reviewed > 0) reviewed += 1;
    if (cov.learnAvailable > 0 || cov.practiceAvailable > 0) represented += 1;
  }
  // Educator review is the gate on publication, and no section of any
  // chapter has been educator-reviewed. Derived, not asserted.
  const published = fractionsChapterSections().filter(
    (s) => s.reviewStatus === 'published'
  ).length;
  return { learn, practice, reviewed, represented, published };
}

export function auditGrade(grade: Grade): GradeCurriculumAudit {
  const c = officialCurriculumForGrade(grade);
  const units = officialUnitCount(grade);
  const topics = officialTopicCount(grade);
  const legacyRows = CHAPTER_CATALOGUE.filter(
    (r) => r.grade === GRADE_TO_CATALOGUE_KEY[grade]
  ).length;

  // Class 6 is the only grade whose content is wired to the official
  // registry. Everywhere else Pragati's rows are legacy modules, and
  // counting them as coverage of official units would be exactly the
  // conflation this file exists to prevent.
  const cov =
    grade === 'class6'
      ? class6Coverage()
      : { learn: 0, practice: 0, reviewed: 0, represented: 0, published: 0 };

  let reason: MismatchReason;
  if (!c || c.status !== 'primary_source_verified') {
    reason = legacyRows > 0
      ? 'legacy_module_inventory_only'
      : 'official_structure_unverified';
  } else if (units !== null && cov.represented === 0) {
    reason = 'no_pragati_coverage';
  } else if (units !== null && cov.represented === units) {
    reason = 'aligned';
  } else {
    reason = 'partial_pragati_coverage';
  }

  return {
    grade,
    gradeLabel: LABEL[grade],
    authority: c?.authority ?? null,
    documentTitle: c?.documentTitle ?? null,
    academicYear: c?.academicYear ?? null,
    edition: c?.edition ?? null,
    sourceUrl: c?.sourceUrl ?? null,
    inspectionDate: c?.inspectionDate ?? null,
    registryStatus: c?.status ?? 'no_source_located',
    officialUnitsKnown: units,
    officialChaptersKnown: officialChapterCount(grade),
    officialTopicsKnown: topics,
    entryNoun: structureNoun(grade),
    officialUnitTitles: (c?.units ?? []).map((u) => u.title),
    representedInPragati: cov.represented,
    // Cannot subtract from unknown.
    missingFromPragati: units === null ? null : units - cov.represented,
    learnAvailable: cov.learn,
    practiceAvailable: cov.practice,
    reviewed: cov.reviewed,
    published: cov.published,
    legacyModuleRows: legacyRows,
    mismatchReason: reason,
    evidenceNote: c?.evidenceNote ?? 'No official curriculum record for this grade.',
    manualVerificationStep: c?.manualVerificationStep ?? null,
  };
}

export function auditAllGrades(): GradeCurriculumAudit[] {
  return ALL_TWELVE_GRADES.map(auditGrade);
}

export type CompletenessHeadline = {
  gradesTotal: number;
  gradesVerified: number;
  gradesPending: number;
  verifiedGradeLabels: string[];
  /** Sum of official units across VERIFIED grades only. Summing across
   *  all twelve would silently treat unknown as zero. */
  officialUnitsAcrossVerifiedGrades: number;
  sentence: string;
};

export function completenessHeadline(): CompletenessHeadline {
  const rows = auditAllGrades();
  const verified = rows.filter(
    (r) => r.registryStatus === 'primary_source_verified'
  );
  const total = verified.reduce((n, r) => n + (r.officialUnitsKnown ?? 0), 0);
  return {
    gradesTotal: rows.length,
    gradesVerified: verified.length,
    gradesPending: rows.length - verified.length,
    verifiedGradeLabels: verified.map((r) => r.gradeLabel),
    officialUnitsAcrossVerifiedGrades: total,
    sentence:
      `${verified.length} of ${rows.length} grades have a primary-verified official Mathematics structure ` +
      `(${verified.map((r) => r.gradeLabel).join(', ')}), covering ${total} official units. ` +
      `The remaining ${rows.length - verified.length} have an unknown number of official units — not zero.`,
  };
}

export type RegistryInvariantIssue = { grade: Grade; detail: string };

/**
 * §J — the invariants, as executable claims.
 *
 * These are the properties that must hold no matter what content is
 * added or removed later.
 */
export function checkRegistryInvariants(): RegistryInvariantIssue[] {
  const issues: RegistryInvariantIssue[] = [];
  for (const r of auditAllGrades()) {
    // Unknown must not be represented as zero.
    if (r.registryStatus !== 'primary_source_verified' && r.officialUnitsKnown !== null) {
      issues.push({
        grade: r.grade,
        detail: 'unverified grade reports a unit count',
      });
    }
    // Legacy module count must never determine the official count.
    if (
      r.officialUnitsKnown !== null &&
      r.legacyModuleRows > 0 &&
      r.officialUnitsKnown === r.legacyModuleRows &&
      r.grade !== 'class6'
    ) {
      issues.push({
        grade: r.grade,
        detail: 'official unit count equals the legacy module count, which suggests conflation',
      });
    }
    // Pragati coverage may never exceed the official structure.
    if (r.officialUnitsKnown !== null && r.representedInPragati > r.officialUnitsKnown) {
      issues.push({
        grade: r.grade,
        detail: 'Pragati represents more units than the official curriculum has',
      });
    }
    // A verified grade must keep every official unit visible.
    if (
      r.registryStatus === 'primary_source_verified' &&
      r.officialUnitTitles.length !== r.officialUnitsKnown
    ) {
      issues.push({
        grade: r.grade,
        detail: 'verified grade does not expose a title for every official unit',
      });
    }
  }
  return issues;
}

export { OFFICIAL_CURRICULA };
