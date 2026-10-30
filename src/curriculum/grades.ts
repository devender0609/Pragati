// v0.26 — Classes 1–12 shell.
//
// Registers the 12 grade IDs so the app can talk about them consistently
// without pretending they have content. Only the two grades with real
// content in the bank (CBSE Class 6 Math, CBSE Class 7 Math) have a
// non-empty `subjectsByCurriculum`. The other 10 grades are addressable
// (dashboards, teacher previews) but the availability status is honest.

import type {
  GradeDefinition,
  GradeId,
  SchoolStage,
  SubjectDefinition,
} from './schema';

function stageForLevel(level: number): SchoolStage {
  if (level <= 2) return 'primary';
  if (level <= 5) return 'preparatory';
  if (level <= 8) return 'middle';
  if (level <= 10) return 'secondary';
  return 'senior_secondary';
}

// Stable IDs — never change these once shipped, they may be persisted on
// Student / Classroom / Session records.
export const GRADE_IDS: GradeId[] = Array.from(
  { length: 12 },
  (_, i) => `grade_${String(i + 1).padStart(2, '0')}`
);

export const GRADE_DEFINITIONS: Record<GradeId, GradeDefinition> = Object.fromEntries(
  GRADE_IDS.map((id, i) => {
    const level = i + 1;
    const def: GradeDefinition = {
      id,
      displayLabel: `Class ${level}`,
      numericLevel: level,
      stage: stageForLevel(level),
      // Populated by registry.ts when a curriculum registers itself for
      // a given grade + subject. Starts empty on purpose — nothing is
      // registered until a curriculum module declares it.
      subjectsByCurriculum: {},
    };
    return [id, def];
  })
);

// The one subject Pragati ships with in v0.26. Adding subjects (English,
// Science, EVS, Social Studies, ...) is now a data change: create another
// SubjectDefinition and reference its id from a CurriculumRegistration.
export const SUBJECT_MATHEMATICS: SubjectDefinition = {
  id: 'mathematics',
  displayLabel: 'Mathematics',
  supportedGradesByCurriculum: {},
};

export const SUBJECTS: Record<string, SubjectDefinition> = {
  mathematics: SUBJECT_MATHEMATICS,
};

// Legacy grade token migration.
// v0.23–v0.25 stored `Grade = 'class6' | 'class7'` and also accepted the
// free-text values `'Class 6'` / `'Class 7'` in Student.grade and
// StudentSnapshot.grade. Everywhere in v0.26 we normalise to the new
// `grade_NN` IDs.
export function migrateLegacyGradeToken(input: string | null | undefined): GradeId | undefined {
  if (!input) return undefined;
  const t = String(input).trim().toLowerCase();
  if (t === 'class6' || t === 'class 6' || t === 'grade 6' || t === 'grade_06') {
    return 'grade_06';
  }
  if (t === 'class7' || t === 'class 7' || t === 'grade 7' || t === 'grade_07') {
    return 'grade_07';
  }
  // Best-effort parse of "Class N" for N in 1..12.
  const m = t.match(/^(?:class|grade)[\s_]*(\d{1,2})$/);
  if (m) {
    const n = Number(m[1]);
    if (n >= 1 && n <= 12) return `grade_${String(n).padStart(2, '0')}`;
  }
  return undefined;
}

// Reverse — convenient for legacy UI that still shows "Class 6" strings.
export function gradeDisplayLabel(id: GradeId): string {
  return GRADE_DEFINITIONS[id]?.displayLabel ?? id;
}
