// v0.68 §13/§14/§20 — THE CHAPTER QUALITY SUMMARY.
//
// COUNTS AND FLAGS. NO SCORE.
//
// §13 and §20 both forbid a composite quality figure, and the reason is
// worth stating rather than obeying: a single number would let a
// section with correct mathematics and no educator review outrank a
// section with one open question and a teacher's signature on it. The
// two are not commensurable, so they are not combined.
//
// Everything here is derived from the live chapter. Nothing is stored
// alongside it that could go stale.

import { fractionsChapterSections } from './fractionsChapter';
import { authoredSectionById } from './fractionsChapter';
import { misconceptionsForSection } from './fractionsMisconceptions';
import { decisionFor } from './interactionDecisions';
import { auditEntriesForSection, type ContentAuditEntry } from './contentAuditLog';
import { distractorAudit } from './distractorAudit';
import { auditSectionReadability } from './readabilityAudit';
import { boundaryFor } from './fractionsBoundaries';
import { SECTION_7_4_ARTIFACT_VERSION, section74Artifact } from './contentArtifact';
import type { AuthoredSection } from './authoredSection';

export type QualityFlag =
  | 'awaiting_educator_review'
  | 'projected_from_frozen_artifact'
  | 'no_interactive_practice_by_design'
  | 'no_diagnostic_distractors'
  | 'prose_flagged_for_readability_review'
  | 'open_audit_finding';

export const QUALITY_FLAG_TEXT: Record<QualityFlag, string> = {
  awaiting_educator_review:
    'No educator has reviewed this section.',
  projected_from_frozen_artifact:
    'Projected read-only from the frozen §7.4 artifact; not natively authored against the current schema.',
  no_interactive_practice_by_design:
    'No interactive practice, deliberately. See the recorded interaction decision.',
  no_diagnostic_distractors:
    'No response in this section diagnoses a specific misconception. Wrong answers receive neutral guidance.',
  prose_flagged_for_readability_review:
    'Some prose was flagged by the advisory readability audit and needs a human read.',
  open_audit_finding:
    'The v0.68 hand audit recorded a finding kept deliberately; a reviewer may overrule it.',
};

export type SectionQualityRow = {
  officialSectionId: string;
  sectionNumber: string;
  title: string;
  artifactId: string;
  artifactVersion: number;
  /** v0.68 §14 — §7.4 must never be mistaken for natively authored. */
  authoringMode: 'natively_authored' | 'projected_from_frozen_artifact';
  reviewStatus: AuthoredSection['reviewStatus'];
  educatorReviewStatus: 'not_reviewed' | 'reviewed';
  workedExamples: number;
  guidedItems: number;
  independentItems: number;
  reasoningTasks: number;
  interactiveItems: number;
  interactiveFormats: string[];
  visuals: number;
  visualTypes: string[];
  misconceptionsDocumented: number;
  diagnosticDistractors: number;
  neutralDistractors: number;
  readabilityFlags: number;
  auditFindings: ContentAuditEntry[];
  flags: QualityFlag[];
  boundaryRecorded: boolean;
};

export const SECTION_7_4_PROJECTION_NOTE = {
  officialSectionId: 'ncert_gp_c6_s7_4',
  artifactId: 'ncert_gp_c6_s7_4_lesson',
  artifactVersion: SECTION_7_4_ARTIFACT_VERSION,
  state: 'frozen_v1_projected',
  // Admin/reviewer wording. §14: never shown to students.
  reviewerNote:
    'Frozen artifact v1. Projected read-only into the chapter schema so all nine sections can be inspected together. Awaiting external review; not yet migrated to the native authored schema. Migration would create artifact v2 and require re-review.',
  audience: 'admin_reviewer_only',
} as const;

export function sectionQuality(section: AuthoredSection): SectionQualityRow {
  const id = section.source.officialSectionId;
  const isProjected = id === 'ncert_gp_c6_s7_4';
  const rows = distractorAudit().filter((r) => r.officialSectionId === id);
  const readability = auditSectionReadability(section);
  const findings = auditEntriesForSection(id);
  const decision = decisionFor(id);

  const diagnostic = rows.filter((r) => r.classification === 'diagnostic').length;
  const neutral = rows.filter((r) => r.classification === 'non_diagnostic').length;

  const flags: QualityFlag[] = [];
  if (section.reviewStatus === 'authored_draft') flags.push('awaiting_educator_review');
  if (isProjected) flags.push('projected_from_frozen_artifact');
  if (decision?.decision === 'intentionally_none') {
    flags.push('no_interactive_practice_by_design');
  }
  if (section.interactivePractice.length > 0 && diagnostic === 0) {
    flags.push('no_diagnostic_distractors');
  }
  if (readability.flagged > 0) flags.push('prose_flagged_for_readability_review');
  if (findings.some((f) => f.verdict === 'accepted_as_is')) {
    flags.push('open_audit_finding');
  }

  return {
    officialSectionId: id,
    sectionNumber: section.source.sectionNumber,
    title: section.source.exactTitle,
    artifactId: section.contentArtifactId,
    artifactVersion: section.contentArtifactVersion,
    authoringMode: isProjected ? 'projected_from_frozen_artifact' : 'natively_authored',
    reviewStatus: section.reviewStatus,
    educatorReviewStatus:
      section.reviewStatus === 'authored_draft' ? 'not_reviewed' : 'reviewed',
    workedExamples: section.workedExamples.length,
    guidedItems: section.guidedPractice.length,
    independentItems: section.independentPractice.length,
    reasoningTasks: section.reasoningApplication.length,
    interactiveItems: section.interactivePractice.length,
    interactiveFormats: Array.from(
      new Set(section.interactivePractice.map((i) => i.format))
    ),
    visuals: section.visuals.length,
    visualTypes: Array.from(new Set(section.visuals.map((v) => v.type))),
    misconceptionsDocumented: misconceptionsForSection(id).length,
    diagnosticDistractors: diagnostic,
    neutralDistractors: neutral,
    readabilityFlags: readability.flagged,
    auditFindings: findings,
    flags,
    boundaryRecorded: boundaryFor(id) !== null,
  };
}

export function chapterQualityRows(): SectionQualityRow[] {
  return fractionsChapterSections().map(sectionQuality);
}

export type ChapterQualitySummary = {
  chapter: string;
  officialSections: number;
  authoredDrafts: number;
  educatorReviewed: number;
  published: number;
  reviewCandidate: { reviewCode: string; fingerprint: string };
  totals: {
    workedExamples: number;
    guidedItems: number;
    independentItems: number;
    reasoningTasks: number;
    interactiveItems: number;
    visuals: number;
    diagnosticDistractors: number;
    neutralDistractors: number;
  };
  interactiveByFormat: Record<string, number>;
  visualsByType: Record<string, number>;
  rows: SectionQualityRow[];
};

export function chapterQualitySummary(): ChapterQualitySummary {
  const rows = chapterQualityRows();
  const sections = fractionsChapterSections();
  const artifact = section74Artifact();

  const interactiveByFormat: Record<string, number> = {};
  const visualsByType: Record<string, number> = {};
  for (const s of sections) {
    for (const i of s.interactivePractice) {
      interactiveByFormat[i.format] = (interactiveByFormat[i.format] ?? 0) + 1;
    }
    for (const v of s.visuals) {
      visualsByType[v.type] = (visualsByType[v.type] ?? 0) + 1;
    }
  }

  const sum = (fn: (r: SectionQualityRow) => number) =>
    rows.reduce((n, r) => n + fn(r), 0);

  return {
    chapter: 'Chapter 7 — Fractions',
    officialSections: 9,
    authoredDrafts: rows.filter((r) => r.reviewStatus === 'authored_draft').length,
    educatorReviewed: rows.filter((r) => r.educatorReviewStatus === 'reviewed').length,
    published: rows.filter((r) => r.reviewStatus === 'published').length,
    reviewCandidate: {
      reviewCode: artifact.reviewCode,
      fingerprint: artifact.contentFingerprint,
    },
    totals: {
      workedExamples: sum((r) => r.workedExamples),
      guidedItems: sum((r) => r.guidedItems),
      independentItems: sum((r) => r.independentItems),
      reasoningTasks: sum((r) => r.reasoningTasks),
      interactiveItems: sum((r) => r.interactiveItems),
      visuals: sum((r) => r.visuals),
      diagnosticDistractors: sum((r) => r.diagnosticDistractors),
      neutralDistractors: sum((r) => r.neutralDistractors),
    },
    interactiveByFormat,
    visualsByType,
    rows,
  };
}

export function qualityRowFor(officialSectionId: string): SectionQualityRow | null {
  const s = authoredSectionById(officialSectionId);
  return s ? sectionQuality(s) : null;
}
