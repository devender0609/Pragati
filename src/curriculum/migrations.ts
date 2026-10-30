// v0.26 — Migration helpers.
//
// Legacy sessions, students, and classrooms may contain:
//   - `Grade` values 'class6' / 'class7' (v0.23–v0.25 union type)
//   - Free-text `grade` values 'Class 6', 'Class 7'
//   - `SkillMode` values 'FR.06', 'mixed', 'mixed_c7_lines_angles', ...
//   - No curriculumId / subjectId / blueprintId
//
// These helpers give the app a single place to normalise those values
// into the registry's stable IDs. They NEVER mutate the underlying
// storage record — a caller decides whether to persist the normalised
// form. Legacy records continue to load unchanged.

import type {
  BlueprintId,
  CurriculumId,
  GradeId,
  ModuleId,
  SkillId,
  SubjectId,
} from './schema';
import { migrateLegacyGradeToken } from './grades';
import { resolveLegacyModuleId, resolveLegacySkillId } from './registry';

// v0.23–v0.25 SkillMode string. Bare 'mixed' means Class 6 Math cross-
// module in the legacy semantics; everywhere else 'mixed_<legacyModuleId>'
// or a legacy skill id.
export type LegacySkillMode = string;

// Normalised assessment scope. Callers use this to answer:
//   - "which skills should I sample from?"
//   - "which grade + subject was assessed?"
//   - "is session A comparable to session B?"
export type AssessmentScope = {
  curriculumId: CurriculumId;
  gradeId: GradeId;
  subjectId: SubjectId;
  // At most one of these is set at a time.
  singleSkillId?: SkillId;
  moduleId?: ModuleId;
  // For diagnostics that draw across every module in the grade+subject.
  crossModule?: boolean;
  // For diagnostics blueprint-driven assessments.
  blueprintId?: BlueprintId;
};

// Migrate a legacy SkillMode string into an AssessmentScope. `hintGradeId`
// is used when the mode is bare 'mixed' — we default to Class 6 Math
// (the historical meaning) but callers with better context (e.g. an
// assignment that carries a grade tag) can override.
export function migrateLegacySkillMode(
  mode: LegacySkillMode,
  hintGradeId?: GradeId
): AssessmentScope | undefined {
  if (!mode) return undefined;

  // 1) Bare 'mixed' — historical: Class 6 Math cross-module.
  if (mode === 'mixed') {
    return {
      curriculumId: 'cbse',
      gradeId: hintGradeId ?? 'grade_06',
      subjectId: 'mathematics',
      crossModule: true,
    };
  }

  // 2) 'mixed_<legacyModuleId>' — resolve via legacy module alias.
  if (mode.startsWith('mixed_')) {
    const legacyModuleId = mode.slice('mixed_'.length);
    const mod = resolveLegacyModuleId(legacyModuleId);
    if (mod) {
      return {
        curriculumId: mod.curriculumId,
        gradeId: mod.gradeId,
        subjectId: mod.subjectId,
        moduleId: mod.id,
      };
    }
    return undefined;
  }

  // 3) Otherwise: single legacy skill id (e.g. 'FR.06', 'LA.03').
  const skill = resolveLegacySkillId(mode);
  if (skill) {
    return {
      curriculumId: skill.curriculumId,
      gradeId: skill.gradeId,
      subjectId: skill.subjectId,
      singleSkillId: skill.id,
      moduleId: skill.moduleId,
    };
  }
  return undefined;
}

// Migrate a legacy Student / StudentSnapshot.grade field.
// Returns { gradeId, curriculumId, subjectId } best-effort. Unknown grade
// strings return undefined for the gradeId; callers should treat that as
// "grade unknown" and prompt for a picker.
export function migrateLegacyStudentGrade(
  grade: string | null | undefined
): { gradeId?: GradeId; curriculumId?: CurriculumId; subjectId?: SubjectId } {
  const gradeId = migrateLegacyGradeToken(grade);
  if (!gradeId) return {};
  // Today the only registered curriculum is CBSE; when more exist, the
  // student's saved curriculum id takes precedence.
  return { gradeId, curriculumId: 'cbse', subjectId: 'mathematics' };
}

// Are two AssessmentScopes comparable for growth reporting? This is the
// check that stops the "compare Class 6 mixed to Class 7 mixed" mistake.
export function scopesAreComparable(a: AssessmentScope, b: AssessmentScope): boolean {
  if (a.curriculumId !== b.curriculumId) return false;
  if (a.gradeId !== b.gradeId) return false;
  if (a.subjectId !== b.subjectId) return false;
  // Both single-skill and same skill → comparable.
  if (a.singleSkillId && b.singleSkillId) return a.singleSkillId === b.singleSkillId;
  // Both module-mixed and same module → comparable.
  if (a.moduleId && b.moduleId && !a.singleSkillId && !b.singleSkillId) {
    return a.moduleId === b.moduleId && !!a.crossModule === !!b.crossModule;
  }
  // Both cross-module diagnostic within the same grade+subject → comparable.
  if (a.crossModule && b.crossModule && !a.singleSkillId && !b.singleSkillId) {
    return true;
  }
  return false;
}
