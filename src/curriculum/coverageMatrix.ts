// v0.72 §3/§23/§26 — THE MASTER COVERAGE MATRIX AND THE BACKLOG.
//
// THE QUESTION THIS ANSWERS, FOR EVERY CLASS 1-12
//
//   What is the official curriculum?
//   Is it fully represented?
//   What teaching content exists?
//   What teaching content is missing?
//   What is reviewed?
//   What is published?
//
// Six questions, six independent answers. No composite score and no
// coverage percentage: for seven of twelve grades the denominator is
// unknown, so a percentage would be computed against Pragati's own
// inventory and would report high coverage of a curriculum nobody has
// read.
//
// §23 — THE BACKLOG IS A GENERATOR, NOT A LIST
//
// Every verified official record with no instructional content produces
// a backlog entry, derived. Nobody maintains it by hand, so nothing can
// be forgotten by being left out of an edit — the moment a grade is
// verified, all of its uncovered records appear.

import type { Grade } from '../types';
import {
  OFFICIAL_CURRICULA,
  officialCurriculumForGrade,
  officialChapterCount,
  officialTopicCount,
  officialUnitCount,
  structureNoun,
} from './officialCurriculum';
import { checkOfficialCompleteness } from './officialCompleteness';
import { sectionsForChapter } from './officialSections';
import { authoredSectionById, fractionsChapterSections } from './fractionsChapter';
import { assessSection, totalsFor } from './instructionalCompleteness';
import { sectionIsOpenable } from './sectionRouting';
import { ALL_TWELVE_GRADES } from './curriculumCompletenessAudit';

export type GradeCoverageRow = {
  grade: Grade;
  gradeLabel: string;

  // --- 1. Official curriculum -------------------------------------
  verified: boolean;
  source: string | null;
  /** Null means UNKNOWN. Never rendered as zero. */
  officialUnits: number | null;
  officialChapters: number | null;
  officialTopics: number | null;
  recordsRepresented: number | null;
  omissions: number | null;

  // --- 2. Pragati content ------------------------------------------
  chaptersWithLearn: number;
  topicsWithLearn: number;
  topicsWithGuidedPractice: number;
  topicsWithIndependentPractice: number;
  topicsWithReasoning: number;
  topicsWithVisual: number;
  topicsWithTeacherResources: number;
  completeInstructionalDrafts: number;

  // --- 3. Review / publication -------------------------------------
  drafts: number;
  educatorReviewed: number;
  studentReady: number;
  published: number;
};

const LABEL: Record<Grade, string> = {
  class1: 'Class 1', class2: 'Class 2', class3: 'Class 3', class4: 'Class 4',
  class5: 'Class 5', class6: 'Class 6', class7: 'Class 7', class8: 'Class 8',
  class9: 'Class 9', class10: 'Class 10', class11: 'Class 11', class12: 'Class 12',
};

export function coverageForGrade(grade: Grade): GradeCoverageRow {
  const c = officialCurriculumForGrade(grade);
  const verified = c?.status === 'primary_source_verified';
  const failures = checkOfficialCompleteness().filter((f) => f.grade === grade);

  // Class 6 is the only grade with authored instructional content, and
  // only Chapter 7 within it. Everywhere else the counts are genuinely
  // zero — which is the point of the matrix, not a gap in it.
  const authored =
    grade === 'class6' ? fractionsChapterSections().map(assessSection) : [];
  const t = totalsFor(authored);

  const chaptersWithLearn =
    grade === 'class6'
      ? (c?.units ?? []).filter((u) =>
          sectionsForChapter(u.officialUnitId).some((s) =>
            sectionIsOpenable(s.officialSectionId)
          )
        ).length
      : 0;

  return {
    grade,
    gradeLabel: LABEL[grade],
    verified,
    source: c?.documentTitle ?? null,
    officialUnits: officialUnitCount(grade),
    officialChapters: officialChapterCount(grade),
    officialTopics: officialTopicCount(grade),
    recordsRepresented: verified ? (c?.units.length ?? 0) : null,
    omissions: verified ? failures.length : null,

    chaptersWithLearn,
    topicsWithLearn: authored.filter((a) => a.hasExplanation).length,
    topicsWithGuidedPractice: authored.filter((a) => a.guidedPracticeCount > 0).length,
    topicsWithIndependentPractice: authored.filter((a) => a.independentPracticeCount > 0).length,
    topicsWithReasoning: authored.filter((a) => a.reasoningTaskCount > 0).length,
    topicsWithVisual: authored.filter((a) => a.semanticVisualCount > 0).length,
    topicsWithTeacherResources: authored.filter((a) => a.hasTeacherNotes).length,
    completeInstructionalDrafts: t.complete_instructional_draft,

    drafts: authored.length,
    educatorReviewed: t.reviewed,
    // Student-ready requires review AND publication. Both are zero, and
    // conflating "a draft exists" with "a student may see it" is the
    // exact collapse the three-truths rule forbids.
    studentReady: t.published,
    published: t.published,
  };
}

export function coverageMatrix(): GradeCoverageRow[] {
  return ALL_TWELVE_GRADES.map(coverageForGrade);
}

// ---------------------------------------------------------------------------
// §23 — the backlog
// ---------------------------------------------------------------------------

export type BacklogPriority = 'P1' | 'P2' | 'P3';

export type CoverageBacklogEntry = {
  grade: Grade;
  gradeLabel: string;
  /** The official unit or chapter this record belongs to. */
  officialUnitId: string;
  officialUnitTitle: string;
  /** Null when the record IS the unit — i.e. no section depth verified. */
  officialSectionId: string | null;
  officialSectionTitle: string | null;
  curriculumVerified: true;
  learnMissing: boolean;
  practiceMissing: boolean;
  visualNeed: boolean;
  teacherResourceNeed: boolean;
  reviewNeed: boolean;
  priority: BacklogPriority;
};

/**
 * Every verified official record with no complete instructional content.
 *
 * DERIVED. Nothing is listed by hand, so nothing can be forgotten by
 * being omitted from an edit — and the moment a pending grade becomes
 * verified, all of its records appear here without anyone remembering to
 * add them.
 *
 * Priority reflects where work pays off soonest, not where it is
 * easiest: P1 is a chapter Pragati has already started, P2 is the rest
 * of a grade with a pilot underway, P3 is a grade with no content at all.
 */
export function coverageBacklog(): CoverageBacklogEntry[] {
  const out: CoverageBacklogEntry[] = [];

  for (const c of OFFICIAL_CURRICULA) {
    if (c.status !== 'primary_source_verified') continue;

    for (const unit of c.units) {
      const sections = sectionsForChapter(unit.officialUnitId);

      // Section depth verified: one entry per section.
      if (sections.length > 0) {
        for (const s of sections) {
          const authored = authoredSectionById(s.officialSectionId);
          const a = authored ? assessSection(authored) : null;
          if (a?.level === 'complete_instructional_draft' && a.reviewState !== 'authored_draft') {
            continue;
          }
          out.push({
            grade: c.grade,
            gradeLabel: LABEL[c.grade],
            officialUnitId: unit.officialUnitId,
            officialUnitTitle: unit.title,
            officialSectionId: s.officialSectionId,
            officialSectionTitle: s.exactTitle,
            curriculumVerified: true,
            learnMissing: !a?.hasExplanation,
            practiceMissing:
              !a || a.guidedPracticeCount + a.independentPracticeCount === 0,
            visualNeed:
              !a ||
              (a.visualRequirement.required && !a.visualRequirement.satisfied),
            teacherResourceNeed: !a?.hasTeacherNotes,
            // Every authored draft needs review; that is the bottleneck.
            reviewNeed: true,
            priority: a ? 'P1' : 'P2',
          });
        }
        continue;
      }

      // No section depth verified: the unit itself is the record.
      out.push({
        grade: c.grade,
        gradeLabel: LABEL[c.grade],
        officialUnitId: unit.officialUnitId,
        officialUnitTitle: unit.title,
        officialSectionId: null,
        officialSectionTitle: null,
        curriculumVerified: true,
        learnMissing: true,
        practiceMissing: true,
        visualNeed: true,
        teacherResourceNeed: true,
        reviewNeed: true,
        priority: c.grade === 'class6' ? 'P2' : 'P3',
      });
    }
  }

  return out;
}

export type BacklogSummary = {
  total: number;
  byGrade: Record<string, number>;
  byPriority: Record<BacklogPriority, number>;
  learnMissing: number;
  practiceMissing: number;
  reviewNeed: number;
};

export function backlogSummary(): BacklogSummary {
  const entries = coverageBacklog();
  const byGrade: Record<string, number> = {};
  const byPriority: Record<BacklogPriority, number> = { P1: 0, P2: 0, P3: 0 };
  for (const e of entries) {
    byGrade[e.gradeLabel] = (byGrade[e.gradeLabel] ?? 0) + 1;
    byPriority[e.priority] += 1;
  }
  return {
    total: entries.length,
    byGrade,
    byPriority,
    learnMissing: entries.filter((e) => e.learnMissing).length,
    practiceMissing: entries.filter((e) => e.practiceMissing).length,
    reviewNeed: entries.filter((e) => e.reviewNeed).length,
  };
}

/** §26 — a verified grade with zero content is a CONTENT gap, never a
 *  curriculum gap. Surfaced for the teacher and admin views. */
export function verifiedGradesWithNoContent(): GradeCoverageRow[] {
  return coverageMatrix().filter(
    (r) => r.verified && r.drafts === 0 && (r.officialUnits ?? 0) > 0
  );
}

export { structureNoun };
