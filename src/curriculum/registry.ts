// v0.26 — Curriculum registry.
//
// The single source of truth for "what grades and subjects does Pragati
// have real content for?" Wraps the existing types.ts / items.ts /
// lessons.ts / alignment.ts data as the first curriculum entry
// (CBSE Class 6 Math + CBSE Class 7 Math) without moving any files.
//
// This is intentionally synchronous. It reads from the already-bundled
// data modules and returns typed structures. Registry entries can be
// added by (a) declaring a new SubjectDefinition + set of ModuleDefinition
// + SkillDefinition, (b) providing the items and lessons alongside, and
// (c) calling `registerCurriculumGrade(...)`. See registerCbseCoreContent
// at the bottom of this file for how the existing data is registered.

import { ITEMS, type Item } from '../data/items';
import { LESSONS, type Lesson } from '../data/lessons';
import { SKILL_ALIGNMENT, getItemAlignment } from '../data/alignment';
import { STARTER_GRADE_META, STARTER_GRADE_META_M2 } from '../data/starterGrades';
import { FULL_GRADE_META, type FullGradeModuleMeta } from '../data/starterGradesFull';
import { FULL_GRADE_META_G89 } from '../data/starterGradesFullG89';
import { FULL_GRADE_META_G11 } from '../data/starterGradesFullG11';
import { FULL_GRADE_META_G15 } from '../data/starterGradesFullG15';
import {
  MODULE_LABELS,
  MODULE_DESCRIPTIONS,
  MODULE_IDS_ORDERED as LEGACY_MODULE_IDS_ORDERED,
  SKILLS_BY_MODULE as LEGACY_SKILLS_BY_MODULE,
  SKILL_LABELS,
  SKILL_SHORT_LABELS,
  type ModuleId as LegacyModuleId,
  type SkillId as LegacySkillId,
} from '../types';
import { GRADE_DEFINITIONS, SUBJECT_MATHEMATICS, SUBJECTS } from './grades';
import {
  type AssessmentBlueprint,
  type AvailabilityStatus,
  type BlueprintId,
  type CurriculumDefinition,
  type CurriculumId,
  type GradeId,
  type ModuleDefinition,
  type ModuleId,
  type SkillDefinition,
  type SkillId,
  type SubjectDefinition,
  type SubjectId,
} from './schema';

// ---------------------------------------------------------------------------
// Internal state — mutable but only via registerCurriculumGrade().
// ---------------------------------------------------------------------------
const curricula = new Map<CurriculumId, CurriculumDefinition>();
const modulesById = new Map<ModuleId, ModuleDefinition>();
const skillsById = new Map<SkillId, SkillDefinition>();
const blueprintsById = new Map<BlueprintId, AssessmentBlueprint>();
// Fast lookups.
const modulesByGradeSubject = new Map<string, ModuleId[]>();
const skillsByModule = new Map<ModuleId, SkillId[]>();
const blueprintsByGradeSubject = new Map<string, BlueprintId[]>();
// Legacy alias tables. Old localStorage sessions reference legacy IDs;
// these two maps let us resolve them to the new registry entries without
// forcing a data migration.
const skillIdByLegacy = new Map<string, SkillId>();
const moduleIdByLegacy = new Map<string, ModuleId>();

function gradeSubjectKey(gradeId: GradeId, subjectId: SubjectId): string {
  return `${gradeId}::${subjectId}`;
}

// ---------------------------------------------------------------------------
// Public query API. This is what components should call — never touch
// the closed unions in src/types.ts directly for new code.
// ---------------------------------------------------------------------------
export function getCurricula(): CurriculumDefinition[] {
  return Array.from(curricula.values());
}

export function getCurriculum(id: CurriculumId): CurriculumDefinition | undefined {
  return curricula.get(id);
}

export function getGrades(): GradeId[] {
  return Object.keys(GRADE_DEFINITIONS).sort();
}

export function getSubjectsForGrade(gradeId: GradeId, curriculumId?: CurriculumId): SubjectId[] {
  const grade = GRADE_DEFINITIONS[gradeId];
  if (!grade) return [];
  if (curriculumId) return grade.subjectsByCurriculum[curriculumId] ?? [];
  // Union across all registered curricula.
  const seen = new Set<SubjectId>();
  for (const list of Object.values(grade.subjectsByCurriculum)) {
    for (const s of list) seen.add(s);
  }
  return Array.from(seen);
}

export function getSubject(id: SubjectId): SubjectDefinition | undefined {
  return SUBJECTS[id];
}

export function getModules(
  gradeId: GradeId,
  subjectId: SubjectId,
  curriculumId: CurriculumId = 'cbse'
): ModuleDefinition[] {
  const ids = modulesByGradeSubject.get(gradeSubjectKey(gradeId, subjectId)) ?? [];
  return ids
    .map((id) => modulesById.get(id))
    .filter((m): m is ModuleDefinition => Boolean(m) && m!.curriculumId === curriculumId)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getModule(id: ModuleId): ModuleDefinition | undefined {
  return modulesById.get(id);
}

export function getSkills(moduleId: ModuleId): SkillDefinition[] {
  const ids = skillsByModule.get(moduleId) ?? [];
  return ids
    .map((id) => skillsById.get(id))
    .filter((s): s is SkillDefinition => Boolean(s))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getSkill(id: SkillId): SkillDefinition | undefined {
  return skillsById.get(id);
}

// Resolve a legacy id (e.g. 'FR.06' or 'fractions') to the new registry
// entry, so old sessions with `skillId: 'FR.06'` keep resolving.
export function resolveLegacySkillId(legacy: string): SkillDefinition | undefined {
  const id = skillIdByLegacy.get(legacy);
  return id ? skillsById.get(id) : undefined;
}

export function resolveLegacyModuleId(legacy: string): ModuleDefinition | undefined {
  const id = moduleIdByLegacy.get(legacy);
  return id ? modulesById.get(id) : undefined;
}

export function getBlueprints(
  gradeId: GradeId,
  subjectId: SubjectId
): AssessmentBlueprint[] {
  const ids = blueprintsByGradeSubject.get(gradeSubjectKey(gradeId, subjectId)) ?? [];
  return ids
    .map((id) => blueprintsById.get(id))
    .filter((b): b is AssessmentBlueprint => Boolean(b));
}

export function getBlueprint(id: BlueprintId): AssessmentBlueprint | undefined {
  return blueprintsById.get(id);
}

export function getAvailableAssessments(
  gradeId: GradeId,
  subjectId: SubjectId
): AssessmentBlueprint[] {
  return getBlueprints(gradeId, subjectId).filter(
    (b) => b.availability === 'available' || b.availability === 'teacher_review_required'
  );
}

export function getCurriculumStatus(gradeId: GradeId, subjectId: SubjectId): AvailabilityStatus {
  const modules = getModules(gradeId, subjectId);
  if (modules.length === 0) return 'framework_only';
  // The most permissive status among modules — if any is available, the
  // subject overall is available. If all are teacher_review_required, so
  // is the subject overall.
  const hasAvailable = modules.some((m) => m.availability === 'available');
  if (hasAvailable) return 'available';
  const hasReview = modules.some((m) => m.availability === 'teacher_review_required');
  if (hasReview) return 'teacher_review_required';
  const hasDraft = modules.some((m) => m.availability === 'draft');
  if (hasDraft) return 'draft';
  return 'framework_only';
}

// ---------------------------------------------------------------------------
// Content lookups that respect the registry.
// ---------------------------------------------------------------------------
export function getItemsForSkill(skillId: SkillId): Item[] {
  const skill = skillsById.get(skillId);
  if (!skill) return [];
  // Items are keyed on the legacy skill id in the existing bank.
  const legacy = skill.legacyId ?? skill.id;
  return ITEMS.filter((it) => it.skillId === legacy);
}

export function getItemsForModule(moduleId: ModuleId): Item[] {
  return getSkills(moduleId).flatMap((s) => getItemsForSkill(s.id));
}

export function getLessonForSkill(skillId: SkillId): Lesson | undefined {
  const skill = skillsById.get(skillId);
  if (!skill) return undefined;
  const legacy = skill.legacyId ?? skill.id;
  return (LESSONS as Record<string, Lesson | undefined>)[legacy];
}

// Item alignment (delegates to the existing alignment layer). Kept as a
// registry-level accessor so callers stop reaching into src/data/*.
export { getItemAlignment };

// ---------------------------------------------------------------------------
// Registration.
// ---------------------------------------------------------------------------
export type CurriculumGradeRegistration = {
  curriculum: CurriculumDefinition;
  gradeId: GradeId;
  subject: SubjectDefinition;
  modules: ModuleDefinition[];
  skills: SkillDefinition[];
  blueprints?: AssessmentBlueprint[];
};

export function registerCurriculumGrade(reg: CurriculumGradeRegistration): void {
  const { curriculum, gradeId, subject, modules, skills, blueprints = [] } = reg;

  // Curriculum record (idempotent).
  if (!curricula.has(curriculum.id)) {
    curricula.set(curriculum.id, curriculum);
  }

  // Grade + subject linkage.
  const grade = GRADE_DEFINITIONS[gradeId];
  if (!grade) {
    // Non-fatal — we never register an unknown grade. Skip.
    // (The validator will report this.)
    return;
  }
  const existing = grade.subjectsByCurriculum[curriculum.id] ?? [];
  if (!existing.includes(subject.id)) {
    grade.subjectsByCurriculum[curriculum.id] = [...existing, subject.id];
  }
  const supported = subject.supportedGradesByCurriculum[curriculum.id] ?? [];
  if (!supported.includes(gradeId)) {
    subject.supportedGradesByCurriculum[curriculum.id] = [...supported, gradeId];
  }

  // Modules + skills.
  for (const m of modules) {
    modulesById.set(m.id, m);
    if (m.legacyId) moduleIdByLegacy.set(m.legacyId, m.id);
    const key = gradeSubjectKey(m.gradeId, m.subjectId);
    const list = modulesByGradeSubject.get(key) ?? [];
    if (!list.includes(m.id)) modulesByGradeSubject.set(key, [...list, m.id]);
  }
  for (const s of skills) {
    skillsById.set(s.id, s);
    if (s.legacyId) skillIdByLegacy.set(s.legacyId, s.id);
    const list = skillsByModule.get(s.moduleId) ?? [];
    if (!list.includes(s.id)) skillsByModule.set(s.moduleId, [...list, s.id]);
  }

  // Blueprints.
  for (const b of blueprints) {
    blueprintsById.set(b.id, b);
    const key = gradeSubjectKey(b.gradeId, b.subjectId);
    const list = blueprintsByGradeSubject.get(key) ?? [];
    if (!list.includes(b.id)) blueprintsByGradeSubject.set(key, [...list, b.id]);
  }
}

// ---------------------------------------------------------------------------
// Test helpers — expose a reset so unit tests can start from a known state.
// Not exported from the barrel for app code; imported directly by tests.
// ---------------------------------------------------------------------------
export function __resetRegistryForTests(): void {
  curricula.clear();
  modulesById.clear();
  skillsById.clear();
  blueprintsById.clear();
  modulesByGradeSubject.clear();
  skillsByModule.clear();
  blueprintsByGradeSubject.clear();
  skillIdByLegacy.clear();
  moduleIdByLegacy.clear();
  // Also reset grade + subject linkage.
  for (const g of Object.values(GRADE_DEFINITIONS)) g.subjectsByCurriculum = {};
  for (const s of Object.values(SUBJECTS)) s.supportedGradesByCurriculum = {};
}

// ---------------------------------------------------------------------------
// Register the existing Class 6 Math + Class 7 Math data as the CBSE
// curriculum's initial content. This runs once at module import.
// ---------------------------------------------------------------------------
const CBSE: CurriculumDefinition = {
  id: 'cbse',
  name: 'CBSE (India)',
  jurisdiction: 'India (CBSE / NCERT-informed prototype)',
  version: 'v0.26 prototype',
  sourceReferences: [
    'CBSE / NCF / NCERT / Ganita Prakash — Class 6',
    'CBSE / NCF / NCERT / Ganita Prakash — Class 7 (starter + deepening, teacher review required)',
  ],
  verificationStatus: 'teacher_review_required',
  notes:
    'CBSE/NCERT-informed prototype only. Not an official CBSE alignment. Every alignment statement requires teacher review before pilot use.',
};

// Class 6 Math — all Class 6 modules ('fractions', 'decimals', etc.) map
// through unchanged. Legacy IDs are preserved as legacyId; the registry
// IDs are prefixed to make cross-grade collisions impossible.
function buildCbseClass6Math(): CurriculumGradeRegistration {
  const gradeId: GradeId = 'grade_06';
  const subjectId: SubjectId = 'mathematics';
  const class6ModuleLegacyIds: LegacyModuleId[] = [
    'fractions',
    'decimals',
    'factors_multiples',
    'ratio_proportion',
    'algebra',
    'geometry',
  ];

  const modules: ModuleDefinition[] = class6ModuleLegacyIds.map((legacy, i) => ({
    id: `cbse_g06_math_${legacy}`,
    curriculumId: 'cbse',
    gradeId,
    subjectId,
    title: MODULE_LABELS[legacy],
    description: MODULE_DESCRIPTIONS[legacy],
    displayOrder: i,
    skillIds: LEGACY_SKILLS_BY_MODULE[legacy].map((s) => `cbse_g06_math_skill_${s}`),
    availability: 'available',
    legacyId: legacy,
  }));

  const skills: SkillDefinition[] = [];
  for (const legacyModuleId of class6ModuleLegacyIds) {
    const moduleId = `cbse_g06_math_${legacyModuleId}`;
    const skillLegacyIds = LEGACY_SKILLS_BY_MODULE[legacyModuleId];
    skillLegacyIds.forEach((legacySkillId, order) => {
      const skillId = `cbse_g06_math_skill_${legacySkillId}`;
      const alignment = SKILL_ALIGNMENT[legacySkillId as LegacySkillId];
      skills.push({
        id: skillId,
        curriculumId: 'cbse',
        gradeId,
        subjectId,
        moduleId,
        displayLabel: SKILL_LABELS[legacySkillId as LegacySkillId] ?? legacySkillId,
        shortLabel: SKILL_SHORT_LABELS[legacySkillId as LegacySkillId] ?? legacySkillId,
        learningOutcome: alignment?.learningOutcome,
        prerequisites: (alignment?.prerequisiteSkills ?? []).map(
          (l) => `cbse_g06_math_skill_${l}`
        ),
        displayOrder: order,
        availability: 'available',
        legacyId: legacySkillId,
      });
    });
  }

  const blueprints: AssessmentBlueprint[] = [
    {
      id: 'cbse_g06_math_diagnostic',
      curriculumId: 'cbse',
      gradeId,
      subjectId,
      title: 'Class 6 Mathematics — diagnostic (mixed modules)',
      description:
        'Stratified session drawn across every Class 6 Math module. Prototype heuristic router, not a calibrated diagnostic.',
      purpose: 'diagnostic',
      moduleIds: modules.map((m) => m.id),
      minItems: 8,
      maxItems: 10,
      version: 'v0.26',
      availability: 'available',
    },
  ];

  return {
    curriculum: CBSE,
    gradeId,
    subject: SUBJECT_MATHEMATICS,
    modules,
    skills,
    blueprints,
  };
}

// Class 7 Math — starter (v0.23) + deepening (v0.25). All 6 modules stay
// marked teacher_review_required until a teacher walks the bank.
function buildCbseClass7Math(): CurriculumGradeRegistration {
  const gradeId: GradeId = 'grade_07';
  const subjectId: SubjectId = 'mathematics';
  const class7ModuleLegacyIds: LegacyModuleId[] = [
    'c7_integers',
    'c7_fractions_ext',
    'c7_algebra_ext',
    'c7_lines_angles',
    'c7_comparing_quantities',
    'c7_data_handling',
  ];

  const modules: ModuleDefinition[] = class7ModuleLegacyIds.map((legacy, i) => ({
    id: `cbse_g07_math_${legacy}`,
    curriculumId: 'cbse',
    gradeId,
    subjectId,
    title: MODULE_LABELS[legacy],
    description: MODULE_DESCRIPTIONS[legacy],
    displayOrder: i,
    skillIds: LEGACY_SKILLS_BY_MODULE[legacy].map((s) => `cbse_g07_math_skill_${s}`),
    availability: 'teacher_review_required',
    legacyId: legacy,
  }));

  const skills: SkillDefinition[] = [];
  for (const legacyModuleId of class7ModuleLegacyIds) {
    const moduleId = `cbse_g07_math_${legacyModuleId}`;
    const skillLegacyIds = LEGACY_SKILLS_BY_MODULE[legacyModuleId];
    skillLegacyIds.forEach((legacySkillId, order) => {
      const skillId = `cbse_g07_math_skill_${legacySkillId}`;
      const alignment = SKILL_ALIGNMENT[legacySkillId as LegacySkillId];
      skills.push({
        id: skillId,
        curriculumId: 'cbse',
        gradeId,
        subjectId,
        moduleId,
        displayLabel: SKILL_LABELS[legacySkillId as LegacySkillId] ?? legacySkillId,
        shortLabel: SKILL_SHORT_LABELS[legacySkillId as LegacySkillId] ?? legacySkillId,
        learningOutcome: alignment?.learningOutcome,
        // Prereqs may cross into Class 6 skills — resolve by looking up
        // the appropriate namespaced registry id per grade.
        prerequisites: (alignment?.prerequisiteSkills ?? []).map((l) => {
          // Heuristic: if the prereq is a Class 6 skill (starts with a
          // Class 6 module's letter code), it lives under grade 06.
          const class6Prefix = /^(FR|DE|FM|RP|AL|GB)\./;
          if (class6Prefix.test(l)) return `cbse_g06_math_skill_${l}`;
          return `cbse_g07_math_skill_${l}`;
        }),
        displayOrder: order,
        availability: 'teacher_review_required',
        legacyId: legacySkillId,
      });
    });
  }

  const blueprints: AssessmentBlueprint[] = [
    {
      id: 'cbse_g07_math_diagnostic',
      curriculumId: 'cbse',
      gradeId,
      subjectId,
      title: 'Class 7 Mathematics — diagnostic (starter + deepening)',
      description:
        'Stratified session drawn across the Class 7 Math starter and deepening modules. Teacher review required before pilot use.',
      purpose: 'diagnostic',
      moduleIds: modules.map((m) => m.id),
      minItems: 8,
      maxItems: 10,
      version: 'v0.26',
      availability: 'teacher_review_required',
    },
  ];

  return {
    curriculum: CBSE,
    gradeId,
    subject: SUBJECT_MATHEMATICS,
    modules,
    skills,
    blueprints,
  };
}

// v0.29 — Class 1–5 and 8–12 Math starter registrations. All modules
// and skills marked `teacher_review_required` because the content is
// authored as a prototype in src/data/starterGrades.ts and has NOT
// been reviewed by a subject-matter teacher.
function buildCbseStarterGrade(gradeId: GradeId): CurriculumGradeRegistration {
  // Grade `grade_NN` → module id `cbse_gNN_math_starter`, etc.
  // Skill id uses the legacy code (e.g. G1.01) — the registry preserves
  // the legacy id via `legacyId` so item lookup by `item.skillId`
  // continues to work.
  const shortGrade = gradeId.replace('grade_0', 'g').replace('grade_', 'g'); // grade_06 → g6, grade_12 → g12
  const meta = STARTER_GRADE_META.find((m) => m.gradeId === gradeId);
  if (!meta) {
    throw new Error(`No starter metadata for ${gradeId}`);
  }
  const moduleId = `cbse_${shortGrade}_math_starter`;
  const module: ModuleDefinition = {
    id: moduleId,
    curriculumId: 'cbse',
    gradeId,
    subjectId: 'mathematics',
    title: meta.moduleTitle,
    description: meta.moduleDescription,
    displayOrder: 0,
    skillIds: meta.skills.map((s) => `cbse_${shortGrade}_math_skill_${s.legacyId}`),
    availability: 'teacher_review_required',
    // No legacyId — this module didn't exist in pre-v0.29 code.
  };
  const skills: SkillDefinition[] = meta.skills.map((s, order) => ({
    id: `cbse_${shortGrade}_math_skill_${s.legacyId}`,
    curriculumId: 'cbse',
    gradeId,
    subjectId: 'mathematics',
    moduleId,
    displayLabel: s.displayLabel,
    shortLabel: s.shortLabel,
    prerequisites: [],
    displayOrder: order,
    availability: 'teacher_review_required',
    legacyId: s.legacyId,
  }));
  const blueprints: AssessmentBlueprint[] = [
    {
      id: `cbse_${shortGrade}_math_diagnostic`,
      curriculumId: 'cbse',
      gradeId,
      subjectId: 'mathematics',
      title: `${meta.moduleTitle.replace(' — starter', '')} — diagnostic`,
      description: `Prototype starter diagnostic drawn from the ${meta.moduleTitle}. Teacher review required before use in a real pilot.`,
      purpose: 'diagnostic',
      moduleIds: [moduleId],
      minItems: 8,
      maxItems: 10,
      version: 'v0.29-starter',
      availability: 'teacher_review_required',
    },
  ];
  return {
    curriculum: CBSE,
    gradeId,
    subject: SUBJECT_MATHEMATICS,
    modules: [module],
    skills,
    blueprints,
  };
}

function registerCbseStarterGrades(): void {
  for (const gradeId of [
    'grade_01', 'grade_02', 'grade_03', 'grade_04', 'grade_05',
    'grade_08', 'grade_09', 'grade_10', 'grade_11', 'grade_12',
  ]) {
    registerCurriculumGrade(buildCbseStarterGrade(gradeId));
  }
}

// v0.31 — Register module 2 per starter grade. Reuses the same
// `curriculum` + `gradeId` + `subject` linkage; adds one more module
// under the existing grade. The M2 blueprint scopes to the M2 module
// only, so a diagnostic named "…module 2…" doesn't accidentally
// draw items from module 1.
function buildCbseStarterGradeM2(gradeId: GradeId): CurriculumGradeRegistration {
  const shortGrade = gradeId.replace('grade_0', 'g').replace('grade_', 'g');
  const meta = STARTER_GRADE_META_M2.find((m) => m.gradeId === gradeId);
  if (!meta) {
    throw new Error(`No M2 starter metadata for ${gradeId}`);
  }
  const moduleId = `cbse_${shortGrade}_math_m2`;
  const module: ModuleDefinition = {
    id: moduleId,
    curriculumId: 'cbse',
    gradeId,
    subjectId: 'mathematics',
    title: meta.moduleTitle,
    description: meta.moduleDescription,
    displayOrder: 1,
    skillIds: meta.skills.map((s) => `cbse_${shortGrade}_math_skill_${s.legacyId}`),
    availability: 'teacher_review_required',
  };
  const skills: SkillDefinition[] = meta.skills.map((s, order) => ({
    id: `cbse_${shortGrade}_math_skill_${s.legacyId}`,
    curriculumId: 'cbse',
    gradeId,
    subjectId: 'mathematics',
    moduleId,
    displayLabel: s.displayLabel,
    shortLabel: s.shortLabel,
    prerequisites: [],
    displayOrder: order,
    availability: 'teacher_review_required',
    legacyId: s.legacyId,
  }));
  const blueprints: AssessmentBlueprint[] = [
    {
      id: `cbse_${shortGrade}_math_m2_diagnostic`,
      curriculumId: 'cbse',
      gradeId,
      subjectId: 'mathematics',
      title: `${meta.moduleTitle.replace(', starter', '').replace(' — module 2', ' — module 2')} — diagnostic`,
      description: `Prototype starter diagnostic drawn from the ${meta.moduleTitle}. Teacher review required before use in a real pilot.`,
      purpose: 'diagnostic',
      moduleIds: [moduleId],
      minItems: 8,
      maxItems: 10,
      version: 'v0.31-starter-m2',
      availability: 'teacher_review_required',
    },
  ];
  return {
    curriculum: CBSE,
    gradeId,
    subject: SUBJECT_MATHEMATICS,
    modules: [module],
    skills,
    blueprints,
  };
}

function registerCbseStarterGradesM2(): void {
  for (const gradeId of [
    'grade_01', 'grade_02', 'grade_03', 'grade_04', 'grade_05',
    'grade_08', 'grade_09', 'grade_10', 'grade_11', 'grade_12',
  ]) {
    registerCurriculumGrade(buildCbseStarterGradeM2(gradeId));
  }
}

// v0.32 — Register the Class 10 and Class 12 full-coverage modules. Each
// entry in FULL_GRADE_META becomes a curriculum module + blueprint under
// the same grade + subject.
function buildCbseFullModule(meta: FullGradeModuleMeta): CurriculumGradeRegistration {
  const shortGrade = meta.gradeId.replace('grade_0', 'g').replace('grade_', 'g');
  const moduleId = `cbse_${shortGrade}_math_${meta.moduleSlug}`;
  const module: ModuleDefinition = {
    id: moduleId,
    curriculumId: 'cbse',
    gradeId: meta.gradeId,
    subjectId: 'mathematics',
    title: meta.moduleTitle,
    description: meta.moduleDescription,
    displayOrder: meta.displayOrder,
    skillIds: meta.skills.map((s) => `cbse_${shortGrade}_math_skill_${s.legacyId}`),
    availability: 'teacher_review_required',
  };
  const skills: SkillDefinition[] = meta.skills.map((s, order) => ({
    id: `cbse_${shortGrade}_math_skill_${s.legacyId}`,
    curriculumId: 'cbse',
    gradeId: meta.gradeId,
    subjectId: 'mathematics',
    moduleId,
    displayLabel: s.displayLabel,
    shortLabel: s.shortLabel,
    prerequisites: [],
    displayOrder: order,
    availability: 'teacher_review_required',
    legacyId: s.legacyId,
  }));
  const blueprints: AssessmentBlueprint[] = [
    {
      id: `cbse_${shortGrade}_math_${meta.moduleSlug}_diagnostic`,
      curriculumId: 'cbse',
      gradeId: meta.gradeId,
      subjectId: 'mathematics',
      title: `${meta.moduleTitle} — diagnostic`,
      description: `Prototype diagnostic drawn from the ${meta.moduleTitle}. Teacher review required.`,
      purpose: 'diagnostic',
      moduleIds: [moduleId],
      minItems: 8,
      maxItems: 10,
      version: 'v0.32-full',
      availability: 'teacher_review_required',
    },
  ];
  return {
    curriculum: CBSE,
    gradeId: meta.gradeId,
    subject: SUBJECT_MATHEMATICS,
    modules: [module],
    skills,
    blueprints,
  };
}

function registerCbseFullGrades(): void {
  for (const meta of FULL_GRADE_META) {
    registerCurriculumGrade(buildCbseFullModule(meta));
  }
}

// v0.33 — Register Class 8 and Class 9 full-coverage modules. Reuses
// `buildCbseFullModule` since the metadata shape is identical.
function registerCbseFullGradesG89(): void {
  for (const meta of FULL_GRADE_META_G89) {
    // FullGradeModuleMetaG89 shape is compatible with FullGradeModuleMeta.
    registerCurriculumGrade(buildCbseFullModule(meta as FullGradeModuleMeta));
  }
}

// v0.35 — Register Class 11 full-coverage modules.
function registerCbseFullGradesG11(): void {
  for (const meta of FULL_GRADE_META_G11) {
    registerCurriculumGrade(buildCbseFullModule(meta as FullGradeModuleMeta));
  }
}

// v0.36 — Register Classes 1-5 primary full-coverage modules.
function registerCbseFullGradesG15(): void {
  for (const meta of FULL_GRADE_META_G15) {
    registerCurriculumGrade(buildCbseFullModule(meta as FullGradeModuleMeta));
  }
}

let bootstrapped = false;
export function registerCbseCoreContent(): void {
  if (bootstrapped) return;
  bootstrapped = true;
  registerCurriculumGrade(buildCbseClass6Math());
  registerCurriculumGrade(buildCbseClass7Math());
  registerCbseStarterGrades();
  registerCbseStarterGradesM2();
  registerCbseFullGrades();
  registerCbseFullGradesG89();
  registerCbseFullGradesG11();
  registerCbseFullGradesG15();
}

// Auto-bootstrap on import. Tests can re-run this after
// __resetRegistryForTests() to get a clean state.
registerCbseCoreContent();
// Also expose the raw builder so tests can register into a fresh registry
// after resetting.
export const __testHelpers = {
  buildCbseClass6Math,
  buildCbseClass7Math,
  buildCbseStarterGrade,
  registerCbseCoreContent: () => {
    bootstrapped = false;
    registerCbseCoreContent();
  },
};

// ---------------------------------------------------------------------------
// Programmatic counts for the honest README.
// ---------------------------------------------------------------------------
export function programmaticCounts(): {
  moduleCount: number;
  skillCount: number;
  itemCount: number;
  itemsBySkill: Record<SkillId, number>;
  gradesWithContent: GradeId[];
  legacyModuleCount: number;
  legacySkillCount: number;
} {
  const itemsBySkill: Record<SkillId, number> = {};
  for (const s of skillsById.values()) {
    itemsBySkill[s.id] = getItemsForSkill(s.id).length;
  }
  return {
    moduleCount: modulesById.size,
    skillCount: skillsById.size,
    itemCount: Object.values(itemsBySkill).reduce((a, b) => a + b, 0),
    itemsBySkill,
    gradesWithContent: Array.from(
      new Set(Array.from(modulesById.values()).map((m) => m.gradeId))
    ).sort(),
    legacyModuleCount: LEGACY_MODULE_IDS_ORDERED.length,
    legacySkillCount: Array.from(
      new Set(Object.values(LEGACY_SKILLS_BY_MODULE).flat())
    ).length,
  };
}
