// v0.28 — Recommended-assessment resolver.
//
// Given a student (or an incomplete guess at one), pick the diagnostic
// blueprint we should recommend. Returns the blueprint, or null if the
// student has no usable content in the registry (e.g. a student
// enrolled in a grade whose content is still "Framework being prepared").
//
// This is the resolver that ties the landing-page "Start recommended
// assessment" button to the registry. It replaces the historical
// hard-coded behaviour where every "Start" click sent every student
// into the Class 6 Math mixed pool regardless of who the student was.
//
// Order of precedence for choosing a grade:
//   1. Explicit `student.gradeId` (v0.26+ Student record)
//   2. Legacy `student.grade` free text migrated via
//      `migrateLegacyGradeToken` ("Class 6" → grade_06, etc.)
//   3. Fallback to grade_06 — the historical default, kept so brand-new
//      installs land on Class 6 Math.

import { migrateLegacyGradeToken } from './grades';
import { getAvailableAssessments, getBlueprints } from './registry';
import type {
  AssessmentBlueprint,
  AvailabilityStatus,
  GradeId,
  SubjectId,
} from './schema';

// Small shape — we only need the two fields the resolver actually reads.
// This keeps the resolver decoupled from the full Student type.
export type StudentGradeHint = {
  gradeId?: string;
  grade?: string;
  curriculumId?: string;
  subjectId?: string;
};

export type RecommendedAssessment = {
  blueprint: AssessmentBlueprint;
  gradeId: GradeId;
  subjectId: SubjectId;
  // How the resolver decided — surfaced on the landing card for
  // transparency ("Recommended for your class") and to make test
  // assertions easy.
  reason:
    | 'student_gradeId'
    | 'student_grade_text'
    | 'default_grade_06';
};

const DEFAULT_GRADE_ID: GradeId = 'grade_06';
const DEFAULT_SUBJECT_ID: SubjectId = 'mathematics';

// The default assessment for a grade + subject: prefer an "available"
// blueprint over one that's only "teacher_review_required", but never
// return a blueprint the student can't start.
function pickDefaultBlueprint(
  gradeId: GradeId,
  subjectId: SubjectId
): AssessmentBlueprint | null {
  const usable = getAvailableAssessments(gradeId, subjectId);
  if (usable.length === 0) return null;
  const rankedByStatus: Record<AvailabilityStatus, number> = {
    available: 0,
    teacher_review_required: 1,
    draft: 2,
    framework_only: 3,
    not_available: 4,
  };
  return [...usable].sort(
    (a, b) => rankedByStatus[a.availability] - rankedByStatus[b.availability]
  )[0];
}

export function pickRecommendedBlueprint(
  hint: StudentGradeHint | null | undefined
): RecommendedAssessment | null {
  // 1. Explicit v0.26+ curriculum context.
  if (hint?.gradeId) {
    const subjectId = (hint.subjectId ?? DEFAULT_SUBJECT_ID) as SubjectId;
    const bp = pickDefaultBlueprint(hint.gradeId as GradeId, subjectId);
    if (bp) {
      return {
        blueprint: bp,
        gradeId: hint.gradeId as GradeId,
        subjectId,
        reason: 'student_gradeId',
      };
    }
  }

  // 2. Legacy free-text grade.
  if (hint?.grade) {
    const gradeId = migrateLegacyGradeToken(hint.grade);
    if (gradeId) {
      const bp = pickDefaultBlueprint(gradeId, DEFAULT_SUBJECT_ID);
      if (bp) {
        return {
          blueprint: bp,
          gradeId,
          subjectId: DEFAULT_SUBJECT_ID,
          reason: 'student_grade_text',
        };
      }
    }
  }

  // 3. Fallback — historical default.
  const bp = pickDefaultBlueprint(DEFAULT_GRADE_ID, DEFAULT_SUBJECT_ID);
  if (!bp) return null;
  return {
    blueprint: bp,
    gradeId: DEFAULT_GRADE_ID,
    subjectId: DEFAULT_SUBJECT_ID,
    reason: 'default_grade_06',
  };
}

// Convenience: which grades / subjects have usable blueprints? Used by
// the picker's "recommended for you" chip on the landing card.
export function hasUsableBlueprint(gradeId: GradeId, subjectId: SubjectId): boolean {
  return getBlueprints(gradeId, subjectId).some(
    (b) => b.availability === 'available' || b.availability === 'teacher_review_required'
  );
}
