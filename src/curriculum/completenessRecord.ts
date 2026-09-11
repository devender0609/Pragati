// v0.61 §7 — THE CLASSES 1–12 CURRICULUM COMPLETENESS RECORD.
//
// THE RULE THIS FILE EXISTS TO ENFORCE
//
// A completeness percentage needs a denominator. For every grade except
// Class 6, Pragati does not know how many official units exist —
// nobody has read the textbook. Dividing Pragati's module count by
// Pragati's own module count yields 100%, which is how a product comes
// to claim complete curriculum coverage while having read no source at
// all.
//
// So: `completenessPercent` returns null unless the official unit count
// is primary-verified. Not zero. Not an estimate. Null, with a reason
// the UI is obliged to render.
//
// `completenessRecord.test.ts` asserts this directly.

import type { Grade } from '../types';
import {
  OFFICIAL_CHAPTERS,
  GANITA_PRAKASH_C6_SOURCE,
  type OfficialChapterRecord,
} from './officialChapters';
import { STATIC_MAPPING, UNMAPPED_LEGACY_MODULES } from './contentMapping';
import {
  emptyUnitStatus,
  type UnitContentStatus,
  type OfficialCurriculumStatus,
} from './contentStatus';

export const ALL_GRADES: Grade[] = [
  'class1', 'class2', 'class3', 'class4', 'class5', 'class6',
  'class7', 'class8', 'class9', 'class10', 'class11', 'class12',
];

/** Why a grade has no trustworthy denominator. Rendered verbatim. */
export type DenominatorProblem =
  | 'no_source_located'
  | 'source_located_not_inspected'
  | 'inspected_units_not_recorded';

export const DENOMINATOR_PROBLEM_TEXT: Record<DenominatorProblem, string> = {
  no_source_located:
    'No official source has been located for this grade, so the number of official units is unknown.',
  source_located_not_inspected:
    'An official source has been located but not inspected, so the number of official units is unknown.',
  inspected_units_not_recorded:
    'The source was inspected but its units have not been recorded, so the number of official units is unknown.',
};

export type GradeCompleteness = {
  grade: Grade;
  subject: 'mathematics';

  officialSource: string | null;
  sourceVersion: string | null;
  sourceOrganization: string | null;
  /** Has a person actually read the primary source for this grade? */
  primaryVerified: boolean;
  inspectionDate: string | null;

  /**
   * The official unit count — null whenever it is not known from a
   * primary source. NEVER substituted with Pragati's own module count.
   */
  officialUnitsKnown: number | null;
  officialUnitsVerified: number;

  mappedUnits: number;
  partiallyMappedUnits: number;
  unmappedOfficialUnits: number;
  /** Pragati modules with no official unit behind them at all. */
  legacyPragatiOnlyUnits: number;

  /** Non-null ONLY when officialUnitsKnown is non-null. */
  completenessPercent: number | null;
  denominatorProblem: DenominatorProblem | null;

  units: UnitCompleteness[];
};

export type UnitCompleteness = {
  officialChapterId: string;
  officialNumber: number | null;
  officialTitle: string | null;
  mappingType: 'exact' | 'partial' | 'combined' | 'split' | 'unmapped';
  pragatiModuleIds: string[];
  status: UnitContentStatus;
};

// ---------------------------------------------------------------------------
// Building the record
// ---------------------------------------------------------------------------

function officialStatusFor(
  rec: OfficialChapterRecord
): OfficialCurriculumStatus {
  switch (rec.verificationStatus) {
    case 'unverified':
      return 'source_not_located';
    case 'secondary_corroborated':
      // Deliberately NOT 'primary_inspected'. Secondary corroboration
      // never touched the source.
      return 'source_located';
    case 'primary_source_verified':
    case 'source_verified':
      return 'official_unit_recorded';
    case 'teacher_verified':
      return 'mapping_reviewed';
  }
}

/**
 * v0.61 §7 — is this grade's official unit count trustworthy?
 *
 * Requires primary verification. A grade whose chapters are recorded
 * from secondary sources has a *plausible* count, and a plausible
 * denominator produces a confident-looking wrong percentage.
 */
export function officialUnitCountFor(
  grade: Grade
): { count: number | null; problem: DenominatorProblem | null } {
  const rows = OFFICIAL_CHAPTERS.filter((c) => c.grade === grade);
  if (rows.length === 0) {
    return { count: null, problem: 'no_source_located' };
  }
  const primary = rows.filter(
    (c) =>
      c.verificationStatus === 'primary_source_verified' ||
      c.verificationStatus === 'source_verified' ||
      c.verificationStatus === 'teacher_verified'
  );
  if (primary.length === 0) {
    return { count: null, problem: 'source_located_not_inspected' };
  }
  if (primary.length !== rows.length) {
    // A partially-verified grade has no settled denominator either:
    // the unverified rows may be wrong, and there may be missing ones.
    return { count: null, problem: 'inspected_units_not_recorded' };
  }
  return { count: rows.length, problem: null };
}

export function completenessForGrade(grade: Grade): GradeCompleteness {
  const rows = OFFICIAL_CHAPTERS.filter((c) => c.grade === grade);
  const { count, problem } = officialUnitCountFor(grade);

  const units: UnitCompleteness[] = rows.map((rec) => {
    const map = STATIC_MAPPING.find(
      (m) => m.officialChapterId === rec.officialChapterId
    );
    const status = emptyUnitStatus(rec.officialChapterId);
    status.officialCurriculum = map
      ? 'mapped'
      : officialStatusFor(rec);
    return {
      officialChapterId: rec.officialChapterId,
      officialNumber: rec.officialChapterNumber,
      officialTitle: rec.officialTitle,
      mappingType: map?.mappingType ?? 'unmapped',
      pragatiModuleIds: map?.legacyModuleIds ?? [],
      status,
    };
  });

  const mapped = units.filter((u) => u.mappingType === 'exact').length;
  const partial = units.filter(
    (u) =>
      u.mappingType === 'partial' ||
      u.mappingType === 'combined' ||
      u.mappingType === 'split'
  ).length;
  const unmapped = units.filter((u) => u.mappingType === 'unmapped').length;

  const primaryVerified = count !== null;
  const first = rows[0] ?? null;

  return {
    grade,
    subject: 'mathematics',
    officialSource: first?.sourceReference ?? null,
    sourceVersion: first?.edition ?? null,
    sourceOrganization: first?.sourceOrganization ?? null,
    primaryVerified,
    inspectionDate: primaryVerified
      ? (first?.dateVerified ?? null)
      : null,
    officialUnitsKnown: count,
    officialUnitsVerified: rows.filter(
      (c) =>
        c.verificationStatus === 'primary_source_verified' ||
        c.verificationStatus === 'source_verified' ||
        c.verificationStatus === 'teacher_verified'
    ).length,
    mappedUnits: mapped,
    partiallyMappedUnits: partial,
    unmappedOfficialUnits: unmapped,
    legacyPragatiOnlyUnits:
      grade === 'class6' ? UNMAPPED_LEGACY_MODULES.length : 0,
    // THE GUARD. No denominator, no percentage.
    completenessPercent:
      count === null ? null : Math.round((mapped / count) * 100),
    denominatorProblem: problem,
    units,
  };
}

export function completenessForAllGrades(): GradeCompleteness[] {
  return ALL_GRADES.map(completenessForGrade);
}

/**
 * The one-line summary Admin renders at the top of the roadmap.
 * Deliberately leads with what is NOT known.
 */
export function coverageHeadline(): string {
  const all = completenessForAllGrades();
  const verified = all.filter((g) => g.primaryVerified);
  return verified.length === 0
    ? 'No grade has a primary-verified official unit list. No completeness figure can be calculated for any grade.'
    : `${verified.length} of ${all.length} grades have a primary-verified official unit list (${verified
        .map((g) => `Class ${g.grade.replace('class', '')}`)
        .join(', ')}). Completeness cannot be calculated for the other ${
        all.length - verified.length
      }.`;
}

/** Evidence for the one grade that has any. Surfaced in Admin so the
 *  claim can be checked rather than trusted. */
export const PRIMARY_SOURCE_EVIDENCE = {
  class6: GANITA_PRAKASH_C6_SOURCE,
} as const;
