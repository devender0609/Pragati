// v0.26 — Curriculum module barrel.
// App code should import from this one place, not from the individual
// files.

export * from './schema';
export {
  GRADE_DEFINITIONS,
  GRADE_IDS,
  SUBJECTS,
  SUBJECT_MATHEMATICS,
  gradeDisplayLabel,
  migrateLegacyGradeToken,
} from './grades';
export {
  __resetRegistryForTests,
  __testHelpers,
  getAvailableAssessments,
  getBlueprint,
  getBlueprints,
  getCurriculum,
  getCurricula,
  getCurriculumStatus,
  getGrades,
  getItemAlignment,
  getItemsForModule,
  getItemsForSkill,
  getLessonForSkill,
  getModule,
  getModules,
  getSkill,
  getSkills,
  getSubject,
  getSubjectsForGrade,
  programmaticCounts,
  registerCbseCoreContent,
  registerCurriculumGrade,
  resolveLegacyModuleId,
  resolveLegacySkillId,
} from './registry';
export {
  migrateLegacySkillMode,
  migrateLegacyStudentGrade,
  scopesAreComparable,
  type AssessmentScope,
  type LegacySkillMode,
} from './migrations';
export {
  formatIssuesForCli,
  summarizeIssues,
  validateCurriculumRegistry,
  type ValidationIssue,
} from './validate';
export {
  hasUsableBlueprint,
  pickRecommendedBlueprint,
  type RecommendedAssessment,
  type StudentGradeHint,
} from './recommend';
export {
  areSessionsComparable,
  comparabilityReason,
  scopeFromSession,
} from './sessionScope';
