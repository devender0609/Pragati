// v0.26 — Curriculum schema.
//
// This is the FIRST piece of the extensibility spine. It replaces the
// closed-union `Grade | ModuleId | SkillId` types in src/types.ts with a
// registry-driven model where new content is DATA, not a code change.
//
// v0.26 scope: schema + query API only. The legacy Class 6 / Class 7 data
// is wrapped by src/curriculum/registry.ts as the first two curriculum
// entries. File reorganization of the item bank into
// src/curriculum/cbse/grade-06/mathematics/... is DEFERRED to a later
// iteration — this iteration is about the extensibility surface, not
// moving 7,000 lines of items around.
//
// IMPORTANT: nothing in here fabricates curriculum content. The registry
// only knows about grades and subjects that a developer explicitly
// registers. Classes 1–12 exist as a shell (see grades.ts) but only the
// two that have real content (CBSE Class 6 Math, CBSE Class 7 Math) are
// marked available.

// ---------------------------------------------------------------------------
// Stable IDs. Kept as string aliases so the type system doesn't force a
// closed union anywhere — new grades / subjects / modules are just new
// string values.
// ---------------------------------------------------------------------------
export type CurriculumId = string; // e.g. 'cbse'
export type GradeId = string; // e.g. 'grade_06'
export type SubjectId = string; // e.g. 'mathematics'
export type ModuleId = string; // e.g. 'cbse_g06_math_fractions'
export type SkillId = string; // e.g. 'FR.06' (legacy IDs preserved)
export type BlueprintId = string; // e.g. 'cbse_g06_math_diagnostic_baseline'

// ---------------------------------------------------------------------------
// Availability + review governance. Kept minimal in v0.26 — full
// content-governance workflow (author / reviewer / bias / accessibility)
// is deferred.
// ---------------------------------------------------------------------------
export type AvailabilityStatus =
  | 'available' // Verified content, real bank, teacher-reviewed.
  | 'draft' // Content exists but is pre-review.
  | 'teacher_review_required' // Starter content, needs a teacher review pass.
  | 'framework_only' // Grade / subject registered but no content authored.
  | 'not_available'; // Grade / subject not yet planned.

export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  available: 'Available',
  draft: 'Draft',
  teacher_review_required: 'Teacher review required',
  framework_only: 'Framework being prepared',
  not_available: 'Not yet available',
};

// A tiny status wrapper for banner copy in the UI.
export function availabilityIsUsable(s: AvailabilityStatus): boolean {
  return s === 'available' || s === 'teacher_review_required';
}

// ---------------------------------------------------------------------------
// School stage — Phase 12 (design tokens) uses this. Registered here so
// grades can carry the stage they belong to without a UI file becoming the
// source of truth.
// ---------------------------------------------------------------------------
export type SchoolStage =
  | 'primary' // Classes 1–2
  | 'preparatory' // Classes 3–5
  | 'middle' // Classes 6–8
  | 'secondary' // Classes 9–10
  | 'senior_secondary'; // Classes 11–12

export const SCHOOL_STAGE_LABELS: Record<SchoolStage, string> = {
  primary: 'Primary',
  preparatory: 'Preparatory',
  middle: 'Middle',
  secondary: 'Secondary',
  senior_secondary: 'Senior secondary',
};

// ---------------------------------------------------------------------------
// Curriculum + grade + subject records.
// ---------------------------------------------------------------------------
export type CurriculumDefinition = {
  id: CurriculumId;
  name: string;
  jurisdiction: string; // e.g. 'India (CBSE)'
  version: string; // e.g. '2025-informed prototype'
  sourceReferences: string[];
  verificationStatus: AvailabilityStatus;
  reviewer?: string;
  reviewDate?: string; // ISO date
  notes?: string;
};

export type GradeDefinition = {
  id: GradeId;
  displayLabel: string; // 'Class 6'
  numericLevel: number; // 6
  stage: SchoolStage;
  // Which curriculum + subjects are available for this grade. May be empty
  // for grades in framework-only status.
  subjectsByCurriculum: Record<CurriculumId, SubjectId[]>;
};

export type SubjectDefinition = {
  id: SubjectId;
  displayLabel: string; // 'Mathematics'
  // Which grades × curricula this subject is available in.
  supportedGradesByCurriculum: Record<CurriculumId, GradeId[]>;
  // Reporting labels can vary by subject — but this iteration ships the
  // same defaults everywhere. Overrides are optional.
  reportingLabels?: {
    proficiencyBands?: string[];
  };
};

// ---------------------------------------------------------------------------
// Module + skill + item + lesson (thin wrappers so the registry can
// speak the same language regardless of which underlying data source
// provides them).
// ---------------------------------------------------------------------------
export type ModuleDefinition = {
  id: ModuleId;
  curriculumId: CurriculumId;
  gradeId: GradeId;
  subjectId: SubjectId;
  title: string;
  description: string;
  displayOrder: number;
  skillIds: SkillId[];
  sourceReferences?: string[];
  availability: AvailabilityStatus;
  // Legacy alias — the pre-v0.26 module id string (e.g. 'fractions',
  // 'c7_lines_angles') so existing localStorage sessions still resolve.
  legacyId?: string;
};

export type SkillDefinition = {
  id: SkillId;
  curriculumId: CurriculumId;
  gradeId: GradeId;
  subjectId: SubjectId;
  moduleId: ModuleId;
  displayLabel: string;
  shortLabel: string;
  learningOutcome?: string;
  prerequisites: SkillId[];
  displayOrder: number;
  availability: AvailabilityStatus;
  legacyId?: string;
};

// ---------------------------------------------------------------------------
// Assessment blueprints. In v0.26 we ship the DEFINITION but the adaptive
// engine still uses its own 8–10-item stopping rule (blueprint-driven
// assessment execution is a later phase). Blueprints ARE consumed by the
// registry query API and the developer validator, and are the intended
// long-term source of assessment length / coverage.
// ---------------------------------------------------------------------------
export type AssessmentPurpose =
  | 'practice'
  | 'baseline'
  | 'diagnostic'
  | 'progress_check'
  | 'assignment';

export type AssessmentBlueprint = {
  id: BlueprintId;
  curriculumId: CurriculumId;
  gradeId: GradeId;
  subjectId: SubjectId;
  title: string;
  description: string;
  purpose: AssessmentPurpose;
  // Either targets an ordered list of module IDs or a specific set of
  // skill IDs. Registry validator enforces one or the other.
  moduleIds?: ModuleId[];
  skillIds?: SkillId[];
  minItems: number;
  maxItems: number;
  // Prototype heuristic: the current engine ignores explicit distributions
  // and uses stratified random routing. Included here for the future.
  itemTypeDistribution?: Record<string, number>;
  cognitiveDemandDistribution?: Record<string, number>;
  difficultyDistribution?: Record<string, number>;
  version: string;
  availability: AvailabilityStatus;
};

// ---------------------------------------------------------------------------
// Errors thrown by the validator. Kept as a class so tests can assert on
// the type without stringly-typed matching.
// ---------------------------------------------------------------------------
export class CurriculumValidationError extends Error {
  readonly issues: string[];
  constructor(issues: string[]) {
    super(`Curriculum validation failed with ${issues.length} issue(s):\n - ${issues.join('\n - ')}`);
    this.issues = issues;
    this.name = 'CurriculumValidationError';
  }
}
