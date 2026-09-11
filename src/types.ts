// Shared types for Pragati. Keeping these in one place so storage, scoring,
// and UI all agree on the shape of a Student and a Session.
//
// Note on language: "ability" here is the running heuristic from our simple
// rule-based adaptive engine (1-10 seed-difficulty scale). It is NOT a
// validated score, NOT a RIT, and NOT an IRT-calibrated estimate. UI copy
// must reflect that.

import type { MisconceptionCode } from './data/items';

// ---------------------------------------------------------------------------
// Assessment windows
// ---------------------------------------------------------------------------
export type AssessmentWindow = 'baseline' | 'midyear' | 'endyear' | 'practice';

export const ASSESSMENT_WINDOWS: AssessmentWindow[] = [
  'baseline',
  'midyear',
  'endyear',
  'practice',
];

export const ASSESSMENT_WINDOW_LABELS: Record<AssessmentWindow, string> = {
  baseline: 'Baseline',
  midyear: 'Mid-year',
  endyear: 'End-of-year',
  practice: 'Practice',
};

export const ASSESSMENT_WINDOW_DESCRIPTIONS: Record<AssessmentWindow, string> = {
  baseline:
    'First assessment of the year. Establishes a starting point so later sessions can be compared against it.',
  midyear:
    'Mid-year check-in. Useful for spotting drift or growth since the baseline.',
  endyear:
    'End-of-year session. Compare against baseline and mid-year to look at change over time.',
  practice:
    'Practice attempt. Useful for the student, but you may want to exclude it from growth comparisons.',
};

// ---------------------------------------------------------------------------
// Student
// ---------------------------------------------------------------------------
export type Student = {
  id: string;
  name: string;
  grade: string;
  school?: string;
  createdAt: number;
  // v0.26 — curriculum context. Optional so legacy Student records load
  // unchanged; when present these are the source of truth for which
  // grade/subject the student is enrolled in. `grade` (free text) is kept
  // for backwards compatibility and is normalised to `gradeId` on read via
  // src/curriculum/migrations.ts::migrateLegacyStudentGrade.
  curriculumId?: string;
  gradeId?: string;
  subjectId?: string;
  academicYear?: string; // e.g. '2025-26'
  primaryClassroomId?: string;
};

// Snapshot of student attributes at the time of a particular session, in case
// the student record is later edited.
export type StudentSnapshot = {
  name: string;
  grade: string;
  school?: string;
  // v0.26 — optional curriculum context frozen at session time.
  curriculumId?: string;
  gradeId?: string;
  subjectId?: string;
  academicYear?: string;
};

// ---------------------------------------------------------------------------
// Per-item response inside a session
// ---------------------------------------------------------------------------
export type Response = {
  itemId: string;
  // For MCQ items: the chosen option index (0..3). For numeric items, -1.
  chosenIndex: number;
  // For numeric items: the raw text the student typed. Optional for MCQ.
  chosenText?: string;
  correct: boolean;
  timeMs: number;
  difficultyAtAttempt: number; // the item's seed difficulty (1-10)
  abilityBefore: number;
  abilityAfter: number;
  misconceptionTriggered: MisconceptionCode;
};

// ---------------------------------------------------------------------------
// Modules and skills (Class 6 Math, v0.7)
// ---------------------------------------------------------------------------
// As of v0.7, Pragati covers four Class 6 Math modules:
//   - fractions          (7 skills, FR.02 → FR.08)
//   - decimals           (5 skills, DE.01 → DE.05)
//   - factors_multiples  (5 skills, FM.03, FM.04, FM.06, FM.07, FM.08)
//   - ratio_proportion   (5 skills, RP.01 → RP.05)
//
// A Session can target a single skill, a single module ("Mixed within
// Decimals"), or every skill in every module ("Mixed Class 6 Math"). The
// `skillId` field on Session is still a SkillMode string for backwards
// compatibility — old (v0.3/v0.4/v0.5/v0.6) sessions with `skillId` of
// 'FR.06', 'FR.07', or 'mixed' still load unchanged.

// v0.23: grade tag for modules / skills / classroom UI. Existing Class 6
// modules keep their bare module ids; Class 7 modules are namespaced with
// `c7_` so the schema can't accidentally collide.
export type Grade =
  | 'class1' | 'class2' | 'class3' | 'class4' | 'class5'
  | 'class6' | 'class7'
  | 'class8' | 'class9' | 'class10' | 'class11' | 'class12';

export const GRADE_LABELS: Record<Grade, string> = {
  class1: 'Class 1 Math (starter)',
  class2: 'Class 2 Math (starter)',
  class3: 'Class 3 Math (starter)',
  class4: 'Class 4 Math (starter)',
  class5: 'Class 5 Math (starter)',
  class6: 'Class 6 Math',
  class7: 'Class 7 Math Starter',
  class8: 'Class 8 Math (starter)',
  class9: 'Class 9 Math (starter)',
  class10: 'Class 10 Math (starter)',
  class11: 'Class 11 Math (starter)',
  class12: 'Class 12 Math (starter)',
};

export type ModuleId =
  | 'fractions'
  | 'decimals'
  | 'factors_multiples'
  | 'ratio_proportion'
  | 'algebra'
  | 'geometry'
  // v0.23 — Class 7 starter modules. Three modules × three skills each.
  | 'c7_integers'
  | 'c7_fractions_ext'
  | 'c7_algebra_ext'
  // v0.25 — Class 7 deepening. Three more modules × three skills × 8 items.
  | 'c7_lines_angles'
  | 'c7_comparing_quantities'
  | 'c7_data_handling'
  // v0.29 — Class 1–5 and 8–12 Math starter modules (prototype content;
  // teacher review required). v0.31 added a 2nd module per starter grade.
  | 'g1_math_starter' | 'g2_math_starter' | 'g3_math_starter'
  | 'g4_math_starter' | 'g5_math_starter'
  | 'g8_math_starter' | 'g9_math_starter' | 'g10_math_starter'
  | 'g11_math_starter' | 'g12_math_starter'
  | 'g1_math_m2' | 'g2_math_m2' | 'g3_math_m2'
  | 'g4_math_m2' | 'g5_math_m2'
  | 'g8_math_m2' | 'g9_math_m2' | 'g10_math_m2'
  | 'g11_math_m2' | 'g12_math_m2'
  // v0.32 — Class 10 & Class 12 full chapter coverage (16 new modules).
  | 'g10_polynomials' | 'g10_linear_eqns_2var' | 'g10_triangles'
  | 'g10_trig_applications' | 'g10_areas_circle' | 'g10_surface_volume'
  | 'g10_statistics_grouped' | 'g10_probability'
  | 'g12_relations_functions' | 'g12_inverse_trig' | 'g12_apps_derivatives'
  | 'g12_apps_integrals' | 'g12_differential_eqns' | 'g12_geometry_3d'
  | 'g12_linear_programming' | 'g12_probability'
  // v0.33 — Class 8 & Class 9 full chapter coverage (16 new modules).
  | 'g8_quadrilaterals' | 'g8_data_handling_ext' | 'g8_comparing_quantities_ext'
  | 'g8_algebraic_expressions_ext' | 'g8_mensuration_ext' | 'g8_exponents_powers'
  | 'g8_proportions' | 'g8_intro_graphs'
  | 'g9_lines_angles' | 'g9_quadrilaterals' | 'g9_areas_parallelograms_triangles'
  | 'g9_circles' | 'g9_herons_formula' | 'g9_surface_volume'
  | 'g9_probability' | 'g9_euclid_rationalisation'
  // v0.35 — Class 11 full chapter coverage (8 new modules).
  | 'g11_relations_functions_ext' | 'g11_trig_functions'
  | 'g11_linear_inequalities' | 'g11_permutations_combinations'
  | 'g11_binomial_theorem' | 'g11_conic_sections'
  | 'g11_limits_derivatives' | 'g11_probability'
  // v0.36 — Classes 1-5 primary full chapter coverage (20 new modules).
  | 'g1_numbers_21_99' | 'g1_add_sub_50' | 'g1_time_basics' | 'g1_measurement_basics'
  | 'g2_numbers_999' | 'g2_tables_division' | 'g2_fractions_measurement' | 'g2_capacity_data_shapes'
  | 'g3_numbers_10000' | 'g3_tables_6to10' | 'g3_fractions_time_money' | 'g3_weight_data_patterns'
  | 'g4_numbers_99999_ops' | 'g4_fractions_decimals' | 'g4_perimeter_area_symmetry' | 'g4_time_money_data'
  | 'g5_crore_hcf_lcm' | 'g5_decimals_fractions_ops' | 'g5_percent_volume_angles' | 'g5_data_word_problems';

export const MODULE_GRADE: Record<ModuleId, Grade> = {
  fractions: 'class6',
  decimals: 'class6',
  factors_multiples: 'class6',
  ratio_proportion: 'class6',
  algebra: 'class6',
  geometry: 'class6',
  c7_integers: 'class7',
  c7_fractions_ext: 'class7',
  c7_algebra_ext: 'class7',
  c7_lines_angles: 'class7',
  c7_comparing_quantities: 'class7',
  c7_data_handling: 'class7',
  g1_math_starter: 'class1',
  g2_math_starter: 'class2',
  g3_math_starter: 'class3',
  g4_math_starter: 'class4',
  g5_math_starter: 'class5',
  g8_math_starter: 'class8',
  g9_math_starter: 'class9',
  g10_math_starter: 'class10',
  g11_math_starter: 'class11',
  g12_math_starter: 'class12',
  g1_math_m2: 'class1',
  g2_math_m2: 'class2',
  g3_math_m2: 'class3',
  g4_math_m2: 'class4',
  g5_math_m2: 'class5',
  g8_math_m2: 'class8',
  g9_math_m2: 'class9',
  g10_math_m2: 'class10',
  g11_math_m2: 'class11',
  g12_math_m2: 'class12',
  // v0.32 — Class 10 & Class 12 full coverage.
  g10_polynomials: 'class10',
  g10_linear_eqns_2var: 'class10',
  g10_triangles: 'class10',
  g10_trig_applications: 'class10',
  g10_areas_circle: 'class10',
  g10_surface_volume: 'class10',
  g10_statistics_grouped: 'class10',
  g10_probability: 'class10',
  g12_relations_functions: 'class12',
  g12_inverse_trig: 'class12',
  g12_apps_derivatives: 'class12',
  g12_apps_integrals: 'class12',
  g12_differential_eqns: 'class12',
  g12_geometry_3d: 'class12',
  g12_linear_programming: 'class12',
  g12_probability: 'class12',
  // v0.33 — Class 8 & Class 9 full coverage.
  g8_quadrilaterals: 'class8',
  g8_data_handling_ext: 'class8',
  g8_comparing_quantities_ext: 'class8',
  g8_algebraic_expressions_ext: 'class8',
  g8_mensuration_ext: 'class8',
  g8_exponents_powers: 'class8',
  g8_proportions: 'class8',
  g8_intro_graphs: 'class8',
  g9_lines_angles: 'class9',
  g9_quadrilaterals: 'class9',
  g9_areas_parallelograms_triangles: 'class9',
  g9_circles: 'class9',
  g9_herons_formula: 'class9',
  g9_surface_volume: 'class9',
  g9_probability: 'class9',
  g9_euclid_rationalisation: 'class9',
  // v0.35 — Class 11 full coverage.
  g11_relations_functions_ext: 'class11',
  g11_trig_functions: 'class11',
  g11_linear_inequalities: 'class11',
  g11_permutations_combinations: 'class11',
  g11_binomial_theorem: 'class11',
  g11_conic_sections: 'class11',
  g11_limits_derivatives: 'class11',
  g11_probability: 'class11',
  // v0.36 — Classes 1-5 primary full coverage.
  g1_numbers_21_99: 'class1', g1_add_sub_50: 'class1', g1_time_basics: 'class1', g1_measurement_basics: 'class1',
  g2_numbers_999: 'class2', g2_tables_division: 'class2', g2_fractions_measurement: 'class2', g2_capacity_data_shapes: 'class2',
  g3_numbers_10000: 'class3', g3_tables_6to10: 'class3', g3_fractions_time_money: 'class3', g3_weight_data_patterns: 'class3',
  g4_numbers_99999_ops: 'class4', g4_fractions_decimals: 'class4', g4_perimeter_area_symmetry: 'class4', g4_time_money_data: 'class4',
  g5_crore_hcf_lcm: 'class5', g5_decimals_fractions_ops: 'class5', g5_percent_volume_angles: 'class5', g5_data_word_problems: 'class5',
};

export type SkillId =
  // Fractions
  | 'FR.02'
  | 'FR.03'
  | 'FR.04'
  | 'FR.05'
  | 'FR.06'
  | 'FR.07'
  | 'FR.08'
  // Decimals
  | 'DE.01'
  | 'DE.02'
  | 'DE.03'
  | 'DE.04'
  | 'DE.05'
  // Factors & Multiples
  | 'FM.03'
  | 'FM.04'
  | 'FM.06'
  | 'FM.07'
  | 'FM.08'
  // Ratio & Proportion
  | 'RP.01'
  | 'RP.02'
  | 'RP.03'
  | 'RP.04'
  | 'RP.05'
  // Algebra Basics (v0.9)
  | 'AL.01'
  | 'AL.02'
  | 'AL.03'
  | 'AL.04'
  | 'AL.05'
  // Geometry Basics (v0.16, extended in v0.18 with GB.08 + GB.09)
  | 'GB.01'
  | 'GB.02'
  | 'GB.03'
  | 'GB.04'
  | 'GB.05'
  | 'GB.06'
  | 'GB.07'
  | 'GB.08'
  | 'GB.09'
  // v0.23 — Class 7 starter (Integers & Rational Numbers)
  | 'IR.01'
  | 'IR.02'
  | 'IR.03'
  // v0.23 — Class 7 starter (Fractions & Decimals Extension)
  | 'FE.01'
  | 'FE.02'
  | 'FE.03'
  // v0.23 — Class 7 starter (Algebraic Expressions and Simple Equations)
  | 'AE.01'
  | 'AE.02'
  | 'AE.03'
  // v0.25 — Class 7 deepening: Lines and Angles
  | 'LA.01'
  | 'LA.02'
  | 'LA.03'
  // v0.25 — Class 7 deepening: Comparing Quantities
  | 'CQ.01'
  | 'CQ.02'
  | 'CQ.03'
  // v0.25 — Class 7 deepening: Data Handling Basics
  | 'DH.01'
  | 'DH.02'
  | 'DH.03'
  // v0.29 — Class 1–5 and 8–12 Math starter (prototype).
  | 'G1.01' | 'G1.02' | 'G1.03' | 'G1.04' | 'G1.05' | 'G1.06'
  | 'G2.01' | 'G2.02' | 'G2.03' | 'G2.04' | 'G2.05' | 'G2.06'
  | 'G3.01' | 'G3.02' | 'G3.03' | 'G3.04' | 'G3.05' | 'G3.06'
  | 'G4.01' | 'G4.02' | 'G4.03' | 'G4.04' | 'G4.05' | 'G4.06'
  | 'G5.01' | 'G5.02' | 'G5.03' | 'G5.04' | 'G5.05' | 'G5.06'
  | 'G8.01' | 'G8.02' | 'G8.03' | 'G8.04' | 'G8.05' | 'G8.06'
  | 'G9.01' | 'G9.02' | 'G9.03' | 'G9.04' | 'G9.05' | 'G9.06'
  | 'G10.01' | 'G10.02' | 'G10.03' | 'G10.04' | 'G10.05' | 'G10.06'
  | 'G11.01' | 'G11.02' | 'G11.03' | 'G11.04' | 'G11.05' | 'G11.06'
  | 'G12.01' | 'G12.02' | 'G12.03' | 'G12.04' | 'G12.05' | 'G12.06'
  // v0.32 — Class 10 & Class 12 full chapter coverage (48 new skills).
  | 'G10.07' | 'G10.08' | 'G10.09' | 'G10.10' | 'G10.11' | 'G10.12'
  | 'G10.13' | 'G10.14' | 'G10.15' | 'G10.16' | 'G10.17' | 'G10.18'
  | 'G10.19' | 'G10.20' | 'G10.21' | 'G10.22' | 'G10.23' | 'G10.24'
  | 'G10.25' | 'G10.26' | 'G10.27' | 'G10.28' | 'G10.29' | 'G10.30'
  | 'G12.07' | 'G12.08' | 'G12.09' | 'G12.10' | 'G12.11' | 'G12.12'
  | 'G12.13' | 'G12.14' | 'G12.15' | 'G12.16' | 'G12.17' | 'G12.18'
  | 'G12.19' | 'G12.20' | 'G12.21' | 'G12.22' | 'G12.23' | 'G12.24'
  | 'G12.25' | 'G12.26' | 'G12.27' | 'G12.28' | 'G12.29' | 'G12.30'
  // v0.33 — Class 8 & Class 9 full chapter coverage (48 new skills).
  | 'G8.07' | 'G8.08' | 'G8.09' | 'G8.10' | 'G8.11' | 'G8.12'
  | 'G8.13' | 'G8.14' | 'G8.15' | 'G8.16' | 'G8.17' | 'G8.18'
  | 'G8.19' | 'G8.20' | 'G8.21' | 'G8.22' | 'G8.23' | 'G8.24'
  | 'G8.25' | 'G8.26' | 'G8.27' | 'G8.28' | 'G8.29' | 'G8.30'
  | 'G9.07' | 'G9.08' | 'G9.09' | 'G9.10' | 'G9.11' | 'G9.12'
  | 'G9.13' | 'G9.14' | 'G9.15' | 'G9.16' | 'G9.17' | 'G9.18'
  | 'G9.19' | 'G9.20' | 'G9.21' | 'G9.22' | 'G9.23' | 'G9.24'
  | 'G9.25' | 'G9.26' | 'G9.27' | 'G9.28' | 'G9.29' | 'G9.30'
  // v0.35 — Class 11 full chapter coverage (24 new skills).
  | 'G11.07' | 'G11.08' | 'G11.09' | 'G11.10' | 'G11.11' | 'G11.12'
  | 'G11.13' | 'G11.14' | 'G11.15' | 'G11.16' | 'G11.17' | 'G11.18'
  | 'G11.19' | 'G11.20' | 'G11.21' | 'G11.22' | 'G11.23' | 'G11.24'
  | 'G11.25' | 'G11.26' | 'G11.27' | 'G11.28' | 'G11.29' | 'G11.30'
  // v0.36 — Classes 1-5 primary full chapter coverage (60 new skills).
  | 'G1.07' | 'G1.08' | 'G1.09' | 'G1.10' | 'G1.11' | 'G1.12'
  | 'G1.13' | 'G1.14' | 'G1.15' | 'G1.16' | 'G1.17' | 'G1.18'
  | 'G2.07' | 'G2.08' | 'G2.09' | 'G2.10' | 'G2.11' | 'G2.12'
  | 'G2.13' | 'G2.14' | 'G2.15' | 'G2.16' | 'G2.17' | 'G2.18'
  | 'G3.07' | 'G3.08' | 'G3.09' | 'G3.10' | 'G3.11' | 'G3.12'
  | 'G3.13' | 'G3.14' | 'G3.15' | 'G3.16' | 'G3.17' | 'G3.18'
  | 'G4.07' | 'G4.08' | 'G4.09' | 'G4.10' | 'G4.11' | 'G4.12'
  | 'G4.13' | 'G4.14' | 'G4.15' | 'G4.16' | 'G4.17' | 'G4.18'
  | 'G5.07' | 'G5.08' | 'G5.09' | 'G5.10' | 'G5.11' | 'G5.12'
  | 'G5.13' | 'G5.14' | 'G5.15' | 'G5.16' | 'G5.17' | 'G5.18';

// "Mixed within one module" modes. 'mixed' (without suffix) remains for
// the across-everything assessment, kept compatible with v0.5 / v0.6.
export type ModuleMixedMode =
  | 'mixed_fractions'
  | 'mixed_decimals'
  | 'mixed_factors_multiples'
  | 'mixed_ratio_proportion'
  | 'mixed_algebra'
  | 'mixed_geometry'
  // v0.23 — Class 7 starter mixed modes.
  | 'mixed_c7_integers'
  | 'mixed_c7_fractions_ext'
  | 'mixed_c7_algebra_ext'
  // v0.25 — Class 7 deepening mixed modes.
  | 'mixed_c7_lines_angles'
  | 'mixed_c7_comparing_quantities'
  | 'mixed_c7_data_handling';

export type SkillMode = SkillId | 'mixed' | ModuleMixedMode;

export const MODULE_IDS_ORDERED: ModuleId[] = [
  'fractions',
  'decimals',
  'factors_multiples',
  'ratio_proportion',
  'algebra',
  'geometry',
  // v0.23 Class 7 starter — kept at the end so existing dashboards
  // that iterate by index don't shift.
  'c7_integers',
  'c7_fractions_ext',
  'c7_algebra_ext',
  // v0.25 Class 7 deepening — appended at end, same reason.
  'c7_lines_angles',
  'c7_comparing_quantities',
  'c7_data_handling',
  // v0.29 — starter grades appended after Class 6/7 so per-grade
  // ordering in dashboards keeps existing indices stable.
  'g1_math_starter', 'g2_math_starter', 'g3_math_starter',
  'g4_math_starter', 'g5_math_starter',
  'g8_math_starter', 'g9_math_starter', 'g10_math_starter',
  'g11_math_starter', 'g12_math_starter',
  // v0.31 — module 2 per starter grade.
  'g1_math_m2', 'g2_math_m2', 'g3_math_m2',
  'g4_math_m2', 'g5_math_m2',
  'g8_math_m2', 'g9_math_m2', 'g10_math_m2',
  'g11_math_m2', 'g12_math_m2',
  // v0.32 — Class 10 & Class 12 full coverage modules.
  'g10_polynomials', 'g10_linear_eqns_2var', 'g10_triangles',
  'g10_trig_applications', 'g10_areas_circle', 'g10_surface_volume',
  'g10_statistics_grouped', 'g10_probability',
  'g12_relations_functions', 'g12_inverse_trig', 'g12_apps_derivatives',
  'g12_apps_integrals', 'g12_differential_eqns', 'g12_geometry_3d',
  'g12_linear_programming', 'g12_probability',
  // v0.33 — Class 8 + Class 9 full coverage modules.
  'g8_quadrilaterals', 'g8_data_handling_ext', 'g8_comparing_quantities_ext',
  'g8_algebraic_expressions_ext', 'g8_mensuration_ext', 'g8_exponents_powers',
  'g8_proportions', 'g8_intro_graphs',
  'g9_lines_angles', 'g9_quadrilaterals', 'g9_areas_parallelograms_triangles',
  'g9_circles', 'g9_herons_formula', 'g9_surface_volume',
  'g9_probability', 'g9_euclid_rationalisation',
  // v0.35 — Class 11 full coverage modules.
  'g11_relations_functions_ext', 'g11_trig_functions',
  'g11_linear_inequalities', 'g11_permutations_combinations',
  'g11_binomial_theorem', 'g11_conic_sections',
  'g11_limits_derivatives', 'g11_probability',
  // v0.36 — Classes 1-5 primary full coverage modules.
  'g1_numbers_21_99', 'g1_add_sub_50', 'g1_time_basics', 'g1_measurement_basics',
  'g2_numbers_999', 'g2_tables_division', 'g2_fractions_measurement', 'g2_capacity_data_shapes',
  'g3_numbers_10000', 'g3_tables_6to10', 'g3_fractions_time_money', 'g3_weight_data_patterns',
  'g4_numbers_99999_ops', 'g4_fractions_decimals', 'g4_perimeter_area_symmetry', 'g4_time_money_data',
  'g5_crore_hcf_lcm', 'g5_decimals_fractions_ops', 'g5_percent_volume_angles', 'g5_data_word_problems',
];

export const SKILLS_BY_MODULE: Record<ModuleId, SkillId[]> = {
  fractions: ['FR.02', 'FR.03', 'FR.04', 'FR.05', 'FR.06', 'FR.07', 'FR.08'],
  decimals: ['DE.01', 'DE.02', 'DE.03', 'DE.04', 'DE.05'],
  factors_multiples: ['FM.03', 'FM.04', 'FM.06', 'FM.07', 'FM.08'],
  ratio_proportion: ['RP.01', 'RP.02', 'RP.03', 'RP.04', 'RP.05'],
  algebra: ['AL.01', 'AL.02', 'AL.03', 'AL.04', 'AL.05'],
  geometry: ['GB.01', 'GB.02', 'GB.03', 'GB.04', 'GB.05', 'GB.06', 'GB.07', 'GB.08', 'GB.09'],
  c7_integers: ['IR.01', 'IR.02', 'IR.03'],
  c7_fractions_ext: ['FE.01', 'FE.02', 'FE.03'],
  c7_algebra_ext: ['AE.01', 'AE.02', 'AE.03'],
  c7_lines_angles: ['LA.01', 'LA.02', 'LA.03'],
  c7_comparing_quantities: ['CQ.01', 'CQ.02', 'CQ.03'],
  c7_data_handling: ['DH.01', 'DH.02', 'DH.03'],
  g1_math_starter: ['G1.01', 'G1.02', 'G1.03'],
  g2_math_starter: ['G2.01', 'G2.02', 'G2.03'],
  g3_math_starter: ['G3.01', 'G3.02', 'G3.03'],
  g4_math_starter: ['G4.01', 'G4.02', 'G4.03'],
  g5_math_starter: ['G5.01', 'G5.02', 'G5.03'],
  g8_math_starter: ['G8.01', 'G8.02', 'G8.03'],
  g9_math_starter: ['G9.01', 'G9.02', 'G9.03'],
  g10_math_starter: ['G10.01', 'G10.02', 'G10.03'],
  g11_math_starter: ['G11.01', 'G11.02', 'G11.03'],
  g12_math_starter: ['G12.01', 'G12.02', 'G12.03'],
  g1_math_m2: ['G1.04', 'G1.05', 'G1.06'],
  g2_math_m2: ['G2.04', 'G2.05', 'G2.06'],
  g3_math_m2: ['G3.04', 'G3.05', 'G3.06'],
  g4_math_m2: ['G4.04', 'G4.05', 'G4.06'],
  g5_math_m2: ['G5.04', 'G5.05', 'G5.06'],
  g8_math_m2: ['G8.04', 'G8.05', 'G8.06'],
  g9_math_m2: ['G9.04', 'G9.05', 'G9.06'],
  g10_math_m2: ['G10.04', 'G10.05', 'G10.06'],
  g10_polynomials: ['G10.07', 'G10.08', 'G10.09'],
  g10_linear_eqns_2var: ['G10.10', 'G10.11', 'G10.12'],
  g10_triangles: ['G10.13', 'G10.14', 'G10.15'],
  g10_trig_applications: ['G10.16', 'G10.17', 'G10.18'],
  g10_areas_circle: ['G10.19', 'G10.20', 'G10.21'],
  g10_surface_volume: ['G10.22', 'G10.23', 'G10.24'],
  g10_statistics_grouped: ['G10.25', 'G10.26', 'G10.27'],
  g10_probability: ['G10.28', 'G10.29', 'G10.30'],
  g11_math_m2: ['G11.04', 'G11.05', 'G11.06'],
  g12_math_m2: ['G12.04', 'G12.05', 'G12.06'],
  g12_relations_functions: ['G12.07', 'G12.08', 'G12.09'],
  g12_inverse_trig: ['G12.10', 'G12.11', 'G12.12'],
  g12_apps_derivatives: ['G12.13', 'G12.14', 'G12.15'],
  g12_apps_integrals: ['G12.16', 'G12.17', 'G12.18'],
  g12_differential_eqns: ['G12.19', 'G12.20', 'G12.21'],
  g12_geometry_3d: ['G12.22', 'G12.23', 'G12.24'],
  g12_linear_programming: ['G12.25', 'G12.26', 'G12.27'],
  g12_probability: ['G12.28', 'G12.29', 'G12.30'],
  g8_quadrilaterals: ['G8.07', 'G8.08', 'G8.09'],
  g8_data_handling_ext: ['G8.10', 'G8.11', 'G8.12'],
  g8_comparing_quantities_ext: ['G8.13', 'G8.14', 'G8.15'],
  g8_algebraic_expressions_ext: ['G8.16', 'G8.17', 'G8.18'],
  g8_mensuration_ext: ['G8.19', 'G8.20', 'G8.21'],
  g8_exponents_powers: ['G8.22', 'G8.23', 'G8.24'],
  g8_proportions: ['G8.25', 'G8.26', 'G8.27'],
  g8_intro_graphs: ['G8.28', 'G8.29', 'G8.30'],
  g9_lines_angles: ['G9.07', 'G9.08', 'G9.09'],
  g9_quadrilaterals: ['G9.10', 'G9.11', 'G9.12'],
  g9_areas_parallelograms_triangles: ['G9.13', 'G9.14', 'G9.15'],
  g9_circles: ['G9.16', 'G9.17', 'G9.18'],
  g9_herons_formula: ['G9.19', 'G9.20', 'G9.21'],
  g9_surface_volume: ['G9.22', 'G9.23', 'G9.24'],
  g9_probability: ['G9.25', 'G9.26', 'G9.27'],
  g9_euclid_rationalisation: ['G9.28', 'G9.29', 'G9.30'],
  // v0.35 — Class 11 full coverage.
  g11_relations_functions_ext: ['G11.07', 'G11.08', 'G11.09'],
  g11_trig_functions: ['G11.10', 'G11.11', 'G11.12'],
  g11_linear_inequalities: ['G11.13', 'G11.14', 'G11.15'],
  g11_permutations_combinations: ['G11.16', 'G11.17', 'G11.18'],
  g11_binomial_theorem: ['G11.19', 'G11.20', 'G11.21'],
  g11_conic_sections: ['G11.22', 'G11.23', 'G11.24'],
  g11_limits_derivatives: ['G11.25', 'G11.26', 'G11.27'],
  g11_probability: ['G11.28', 'G11.29', 'G11.30'],
  // v0.36 — Classes 1-5 primary full coverage.
  g1_numbers_21_99: ['G1.07', 'G1.08', 'G1.09'],
  g1_add_sub_50: ['G1.10', 'G1.11', 'G1.12'],
  g1_time_basics: ['G1.13', 'G1.14', 'G1.15'],
  g1_measurement_basics: ['G1.16', 'G1.17', 'G1.18'],
  g2_numbers_999: ['G2.07', 'G2.08', 'G2.09'],
  g2_tables_division: ['G2.10', 'G2.11', 'G2.12'],
  g2_fractions_measurement: ['G2.13', 'G2.14', 'G2.15'],
  g2_capacity_data_shapes: ['G2.16', 'G2.17', 'G2.18'],
  g3_numbers_10000: ['G3.07', 'G3.08', 'G3.09'],
  g3_tables_6to10: ['G3.10', 'G3.11', 'G3.12'],
  g3_fractions_time_money: ['G3.13', 'G3.14', 'G3.15'],
  g3_weight_data_patterns: ['G3.16', 'G3.17', 'G3.18'],
  g4_numbers_99999_ops: ['G4.07', 'G4.08', 'G4.09'],
  g4_fractions_decimals: ['G4.10', 'G4.11', 'G4.12'],
  g4_perimeter_area_symmetry: ['G4.13', 'G4.14', 'G4.15'],
  g4_time_money_data: ['G4.16', 'G4.17', 'G4.18'],
  g5_crore_hcf_lcm: ['G5.07', 'G5.08', 'G5.09'],
  g5_decimals_fractions_ops: ['G5.10', 'G5.11', 'G5.12'],
  g5_percent_volume_angles: ['G5.13', 'G5.14', 'G5.15'],
  g5_data_word_problems: ['G5.16', 'G5.17', 'G5.18'],
};

// v0.23: ordered list of modules for a specific grade. Used by the
// grade-aware UI to filter dashboards.
export const MODULES_FOR_GRADE: Record<Grade, ModuleId[]> = {
  class1: ['g1_math_starter', 'g1_math_m2',
    'g1_numbers_21_99', 'g1_add_sub_50', 'g1_time_basics', 'g1_measurement_basics'],
  class2: ['g2_math_starter', 'g2_math_m2',
    'g2_numbers_999', 'g2_tables_division', 'g2_fractions_measurement', 'g2_capacity_data_shapes'],
  class3: ['g3_math_starter', 'g3_math_m2',
    'g3_numbers_10000', 'g3_tables_6to10', 'g3_fractions_time_money', 'g3_weight_data_patterns'],
  class4: ['g4_math_starter', 'g4_math_m2',
    'g4_numbers_99999_ops', 'g4_fractions_decimals', 'g4_perimeter_area_symmetry', 'g4_time_money_data'],
  class5: ['g5_math_starter', 'g5_math_m2',
    'g5_crore_hcf_lcm', 'g5_decimals_fractions_ops', 'g5_percent_volume_angles', 'g5_data_word_problems'],
  class6: ['fractions', 'decimals', 'factors_multiples', 'ratio_proportion', 'algebra', 'geometry'],
  class7: [
    'c7_integers',
    'c7_fractions_ext',
    'c7_algebra_ext',
    'c7_lines_angles',
    'c7_comparing_quantities',
    'c7_data_handling',
  ],
  class8: [
    'g8_math_starter', 'g8_math_m2',
    'g8_quadrilaterals', 'g8_data_handling_ext', 'g8_comparing_quantities_ext',
    'g8_algebraic_expressions_ext', 'g8_mensuration_ext', 'g8_exponents_powers',
    'g8_proportions', 'g8_intro_graphs',
  ],
  class9: [
    'g9_math_starter', 'g9_math_m2',
    'g9_lines_angles', 'g9_quadrilaterals', 'g9_areas_parallelograms_triangles',
    'g9_circles', 'g9_herons_formula', 'g9_surface_volume',
    'g9_probability', 'g9_euclid_rationalisation',
  ],
  class10: [
    'g10_math_starter', 'g10_math_m2',
    'g10_polynomials', 'g10_linear_eqns_2var', 'g10_triangles',
    'g10_trig_applications', 'g10_areas_circle', 'g10_surface_volume',
    'g10_statistics_grouped', 'g10_probability',
  ],
  class11: [
    'g11_math_starter', 'g11_math_m2',
    'g11_relations_functions_ext', 'g11_trig_functions',
    'g11_linear_inequalities', 'g11_permutations_combinations',
    'g11_binomial_theorem', 'g11_conic_sections',
    'g11_limits_derivatives', 'g11_probability',
  ],
  class12: [
    'g12_math_starter', 'g12_math_m2',
    'g12_relations_functions', 'g12_inverse_trig', 'g12_apps_derivatives',
    'g12_apps_integrals', 'g12_differential_eqns', 'g12_geometry_3d',
    'g12_linear_programming', 'g12_probability',
  ],
};

// v0.25 — Class 7 recommended learning order across the 6 modules /
// 18 skills. Used by the Class 7 "next skill" recommendation and the
// module dashboard so we don't have to change the general progression
// library (which is Class-6-specific).
export const CLASS7_LEARNING_ORDER: SkillId[] = [
  'IR.01', 'IR.02', 'IR.03',
  'FE.01', 'FE.02', 'FE.03',
  'AE.01', 'AE.02', 'AE.03',
  'LA.01', 'LA.02', 'LA.03',
  'CQ.01', 'CQ.02', 'CQ.03',
  'DH.01', 'DH.02', 'DH.03',
];

// Reverse map: skill → module. Built from SKILLS_BY_MODULE so it can never
// drift out of sync.
export const MODULE_FOR_SKILL: Record<SkillId, ModuleId> = (() => {
  const out = {} as Record<SkillId, ModuleId>;
  for (const m of MODULE_IDS_ORDERED) {
    for (const s of SKILLS_BY_MODULE[m]) out[s] = m;
  }
  return out;
})();

// Ordered list of every skill, in module-then-curriculum order. Used by
// per-skill summaries, the recommended-order strip, and dropdowns.
export const SKILL_IDS_ORDERED: SkillId[] = MODULE_IDS_ORDERED.flatMap(
  (m) => SKILLS_BY_MODULE[m]
);

export const MODULE_LABELS: Record<ModuleId, string> = {
  fractions: 'Fractions',
  decimals: 'Decimals',
  factors_multiples: 'Factors & Multiples',
  ratio_proportion: 'Ratio & Proportion',
  algebra: 'Algebra Basics',
  geometry: 'Geometry Basics',
  c7_integers: 'Integers & Rational Numbers (Class 7)',
  c7_fractions_ext: 'Fractions & Decimals — Extension (Class 7)',
  c7_algebra_ext: 'Algebraic Expressions & Simple Equations (Class 7)',
  c7_lines_angles: 'Lines & Angles (Class 7)',
  c7_comparing_quantities: 'Comparing Quantities (Class 7)',
  c7_data_handling: 'Data Handling Basics (Class 7)',
  g1_math_starter: 'Numbers & Addition (Class 1 — starter)',
  g2_math_starter: 'Place Value & Two-Digit Arithmetic (Class 2 — starter)',
  g3_math_starter: 'Multiplication & Division Basics (Class 3 — starter)',
  g4_math_starter: 'Fractions & Measurement (Class 4 — starter)',
  g5_math_starter: 'Decimals & Percentage (Class 5 — starter)',
  g8_math_starter: 'Rational Numbers & Linear Equations (Class 8 — starter)',
  g9_math_starter: 'Number Systems & Polynomials (Class 9 — starter)',
  g10_math_starter: 'Real Numbers, Quadratics & Trig (Class 10 — starter)',
  g11_math_starter: 'Sets, Functions & Trigonometry (Class 11 — starter)',
  g12_math_starter: 'Matrices, Derivatives & Integrals (Class 12 — starter)',
  g1_math_m2: 'Shapes, Measurement & Money (Class 1 — starter)',
  g2_math_m2: 'Multiplication, Money & Measurement (Class 2 — starter)',
  g3_math_m2: 'Fractions, Multi-digit Arithmetic & Measurement (Class 3 — starter)',
  g4_math_m2: 'Large Numbers, Division & Decimals (Class 4 — starter)',
  g5_math_m2: 'Fractions, Geometry & Data (Class 5 — starter)',
  g8_math_m2: 'Mensuration, Data Handling & Algebraic Expressions (Class 8 — starter)',
  g9_math_m2: 'Linear Eqns in 2 Var, Triangles & Statistics (Class 9 — starter)',
  g10_math_m2: 'Coordinate Geometry, AP & Circles (Class 10 — starter)',
  g11_math_m2: 'Complex Numbers, Sequences & Straight Lines (Class 11 — starter)',
  g12_math_m2: 'Determinants, Continuity & Vectors (Class 12 — starter)',
  // v0.32 — Class 10 & Class 12 full NCERT chapter coverage.
  g10_polynomials: 'Polynomials (Class 10 · Ch 2)',
  g10_linear_eqns_2var: 'Pair of Linear Equations in Two Variables (Class 10 · Ch 3)',
  g10_triangles: 'Triangles / Similarity (Class 10 · Ch 6)',
  g10_trig_applications: 'Applications of Trigonometry (Class 10 · Ch 9)',
  g10_areas_circle: 'Areas Related to Circles (Class 10 · Ch 11)',
  g10_surface_volume: 'Surface Areas and Volumes (Class 10 · Ch 12)',
  g10_statistics_grouped: 'Statistics (grouped data) (Class 10 · Ch 13)',
  g10_probability: 'Probability (Class 10 · Ch 14)',
  g12_relations_functions: 'Relations and Functions (Class 12 · Ch 1)',
  g12_inverse_trig: 'Inverse Trigonometric Functions (Class 12 · Ch 2)',
  g12_apps_derivatives: 'Applications of Derivatives (Class 12 · Ch 6)',
  g12_apps_integrals: 'Applications of Integrals (Class 12 · Ch 8)',
  g12_differential_eqns: 'Differential Equations (Class 12 · Ch 9)',
  g12_geometry_3d: 'Three-dimensional Geometry (Class 12 · Ch 11)',
  g12_linear_programming: 'Linear Programming (Class 12 · Ch 12)',
  g12_probability: 'Probability (Class 12 · Ch 13)',
  // v0.33 — Class 8 & Class 9 full chapter coverage labels.
  g8_quadrilaterals: 'Understanding Quadrilaterals (Class 8 · Ch 3)',
  g8_data_handling_ext: 'Data Handling extended (Class 8 · Ch 5)',
  g8_comparing_quantities_ext: 'Comparing Quantities (Class 8 · Ch 8)',
  g8_algebraic_expressions_ext: 'Algebraic Expressions and Identities (Class 8 · Ch 9)',
  g8_mensuration_ext: 'Mensuration extended (Class 8 · Ch 11)',
  g8_exponents_powers: 'Exponents and Powers (Class 8 · Ch 12)',
  g8_proportions: 'Direct and Inverse Proportions (Class 8 · Ch 13)',
  g8_intro_graphs: 'Introduction to Graphs (Class 8 · Ch 15)',
  g9_lines_angles: 'Lines and Angles (Class 9 · Ch 6)',
  g9_quadrilaterals: 'Quadrilaterals (Class 9 · Ch 8)',
  g9_areas_parallelograms_triangles: 'Areas of Parallelograms and Triangles (Class 9 · Ch 9)',
  g9_circles: 'Circles (Class 9 · Ch 10)',
  g9_herons_formula: "Heron's Formula (Class 9 · Ch 12)",
  g9_surface_volume: 'Surface Areas and Volumes (Class 9 · Ch 13)',
  g9_probability: 'Probability (Class 9 · Ch 15)',
  g9_euclid_rationalisation: "Euclid's Geometry + Rationalisation (Class 9 · Ch 5 / Ch 1)",
  // v0.35 — Class 11 full chapter coverage labels.
  g11_relations_functions_ext: 'Relations & Functions extended (Class 11 · Ch 2)',
  g11_trig_functions: 'Trigonometric Functions (Class 11 · Ch 3)',
  g11_linear_inequalities: 'Linear Inequalities (Class 11 · Ch 6)',
  g11_permutations_combinations: 'Permutations and Combinations (Class 11 · Ch 7)',
  g11_binomial_theorem: 'Binomial Theorem (Class 11 · Ch 8)',
  g11_conic_sections: 'Conic Sections (Class 11 · Ch 11)',
  g11_limits_derivatives: 'Limits and Derivatives (Class 11 · Ch 13)',
  g11_probability: 'Probability (Class 11 · Ch 16)',
  // v0.36 — Classes 1-5 primary full chapter coverage labels.
  g1_numbers_21_99: 'Numbers 21 to 99 (Class 1)',
  g1_add_sub_50: 'Addition & Subtraction up to 50 (Class 1)',
  g1_time_basics: 'Time basics (Class 1)',
  g1_measurement_basics: 'Measurement basics (Class 1)',
  g2_numbers_999: 'Numbers up to 999 and 3-digit arithmetic (Class 2)',
  g2_tables_division: 'Multiplication tables and division intro (Class 2)',
  g2_fractions_measurement: 'Fractions intro and length/weight (Class 2)',
  g2_capacity_data_shapes: 'Capacity, pictographs, and 3D shapes (Class 2)',
  g3_numbers_10000: 'Numbers up to 10,000 and 4-digit arithmetic (Class 3)',
  g3_tables_6to10: 'Multiplication tables 6–10 and division (Class 3)',
  g3_fractions_time_money: 'Fractions on line, time, money (Class 3)',
  g3_weight_data_patterns: 'Weight, bar graphs, patterns (Class 3)',
  g4_numbers_99999_ops: 'Numbers up to 99,999 and long ×/÷ (Class 4)',
  g4_fractions_decimals: 'Fractions and decimals (Class 4)',
  g4_perimeter_area_symmetry: 'Perimeter, area, symmetry (Class 4)',
  g4_time_money_data: 'Time, money, data handling (Class 4)',
  g5_crore_hcf_lcm: 'Crore, HCF and LCM intro (Class 5)',
  g5_decimals_fractions_ops: 'Decimal and fraction operations (Class 5)',
  g5_percent_volume_angles: 'Percent, volume, angles (Class 5)',
  g5_data_word_problems: 'Data (mean) and word problems (Class 5)',
};

export const MODULE_DESCRIPTIONS: Record<ModuleId, string> = {
  fractions:
    'Read, compare, and operate on fractions, including word problems. 7 skills.',
  decimals:
    'Decimal place value, conversions to/from fractions, comparison, arithmetic, and word problems. 5 skills.',
  factors_multiples:
    'Prime/composite numbers, divisibility rules, HCF, LCM, and HCF/LCM word problems. 5 skills.',
  ratio_proportion:
    'Concept of ratio, equivalent ratios, proportion, the unitary method, and ratio word problems. 5 skills.',
  algebra:
    'Variables as unknowns, simple expressions, evaluating for given values, one-step equations, and word problems. 5 skills.',
  geometry:
    'Points, lines, rays, parallel/intersecting lines, types of angles, measuring angles, triangles, quadrilaterals, circles, symmetry, and coordinate basics. 9 skills.',
  c7_integers:
    'Operations on integers (addition, subtraction, multiplication), and the introduction to rational numbers. Class 7 starter — 3 skills, 24 items.',
  c7_fractions_ext:
    'Extends Class 6 fractions with multiplication / division and decimal arithmetic to thousandths. Class 7 starter — 3 skills, 24 items.',
  c7_algebra_ext:
    'Combine like terms in expressions, evaluate with positive and negative values, and solve light two-step equations. Class 7 starter — 3 skills, 24 items.',
  c7_lines_angles:
    'Identify pairs of angles formed by intersecting and parallel lines, apply the angle sum property of triangles, and reason about complementary, supplementary, vertically opposite, and linear-pair relationships. Class 7 deepening — 3 skills, 24 items.',
  c7_comparing_quantities:
    'Convert between fractions, decimals, and percentages; reason about percent of a quantity and percent change; and apply simple interest and profit/loss in everyday contexts. Class 7 deepening — 3 skills, 24 items.',
  c7_data_handling:
    'Read pictographs, bar graphs, and double-bar graphs; compute mean, median, and mode of small datasets; and read and reason about basic probability of equally likely outcomes. Class 7 deepening — 3 skills, 24 items.',
  g1_math_starter:
    'Prototype starter — counting up to 20, single-digit addition, single-digit subtraction. Teacher review required.',
  g2_math_starter:
    'Prototype starter — place value up to 99, two-digit addition and subtraction. Teacher review required.',
  g3_math_starter:
    'Prototype starter — multiplication tables 2–5, simple division, three-digit place value. Teacher review required.',
  g4_math_starter:
    'Prototype starter — introduction to fractions, length and weight, multi-digit multiplication. Teacher review required.',
  g5_math_starter:
    'Prototype starter — decimal place value, introduction to percentage, long division. Teacher review required.',
  g8_math_starter:
    'Prototype starter — operations on rational numbers, one-variable linear equations, squares/cubes and roots. Teacher review required.',
  g9_math_starter:
    'Prototype starter — real number classification, polynomial arithmetic, coordinate geometry basics. Teacher review required.',
  g10_math_starter:
    'Prototype starter — HCF/LCM, quadratic equations, basic trigonometry. Teacher review required.',
  g11_math_starter:
    'Prototype starter — sets and operations, functions basics, trigonometric identities. Teacher review required.',
  g12_math_starter:
    'Prototype starter — matrix basics, derivatives of standard functions, definite integrals. Teacher review required.',
  g1_math_m2:
    'Prototype module 2 — 2D shapes recognition, length comparison, Indian coins. Teacher review required.',
  g2_math_m2:
    'Prototype module 2 — repeated addition and tables of 2 and 3, money in rupees and paise, reading clocks. Teacher review required.',
  g3_math_m2:
    'Prototype module 2 — halves, thirds and quarters; 3-digit addition and subtraction with regrouping; length in meters. Teacher review required.',
  g4_math_m2:
    'Prototype module 2 — numbers up to a lakh, division with remainders, tenths and hundredths as decimals. Teacher review required.',
  g5_math_m2:
    'Prototype module 2 — addition/subtraction of fractions with unlike denominators, perimeter and area of rectangle, reading bar graphs. Teacher review required.',
  g8_math_m2:
    'Prototype module 2 — area of triangles and parallelograms, bar graphs and pie charts, algebraic identities. Teacher review required.',
  g9_math_m2:
    'Prototype module 2 — solutions of linear equations in two variables, congruence of triangles, mean/median/mode of ungrouped data. Teacher review required.',
  g10_math_m2:
    'Prototype module 2 — distance and section formulae, nth term and sum of an AP, tangent-to-circle properties. Teacher review required.',
  g11_math_m2:
    'Prototype module 2 — imaginary unit and modulus of complex numbers, GP sum formula, slope and equation of a line. Teacher review required.',
  g12_math_m2:
    'Prototype module 2 — 2×2 and 3×3 determinants, chain rule for derivatives, dot product of vectors. Teacher review required.',
  // v0.32 — Class 10 & Class 12 full-coverage module descriptions.
  g10_polynomials: 'Prototype content — types and degree of polynomials, zeros and coefficient relations, division algorithm and Remainder/Factor theorems. Teacher review required.',
  g10_linear_eqns_2var: 'Prototype content — solving pair of linear equations graphically, by substitution and elimination; consistency conditions. Teacher review required.',
  g10_triangles: 'Prototype content — Basic Proportionality Theorem, criteria for similar triangles, Pythagoras theorem. Teacher review required.',
  g10_trig_applications: 'Prototype content — angles of elevation and depression, heights and distances word problems. Teacher review required.',
  g10_areas_circle: 'Prototype content — circumference and area of a circle, sector area and arc length, segment area. Teacher review required.',
  g10_surface_volume: 'Prototype content — surface area of combinations of solids, volume of combinations, frustum of a cone. Teacher review required.',
  g10_statistics_grouped: 'Prototype content — mean, median, and mode of grouped data. Teacher review required.',
  g10_probability: 'Prototype content — classical probability, sample spaces, complementary events. Teacher review required.',
  g12_relations_functions: 'Prototype content — types of relations, types of functions, composition and inverse of functions. Teacher review required.',
  g12_inverse_trig: 'Prototype content — principal values, standard identities, domain and range of inverse trig functions. Teacher review required.',
  g12_apps_derivatives: 'Prototype content — increasing/decreasing functions, maxima and minima, rate of change. Teacher review required.',
  g12_apps_integrals: 'Prototype content — area under a curve, area between two curves, properties of definite integrals. Teacher review required.',
  g12_differential_eqns: 'Prototype content — order and degree of ODEs, variable separable, linear first-order ODEs. Teacher review required.',
  g12_geometry_3d: 'Prototype content — direction cosines, equation of a line in 3D, equation of a plane. Teacher review required.',
  g12_linear_programming: 'Prototype content — linear programming basics, constraints and objectives, graphical solution. Teacher review required.',
  g12_probability: 'Prototype content — conditional probability, Bayes theorem intuition, random variables and distributions. Teacher review required.',
  // v0.33 — Class 8 & Class 9 full chapter coverage descriptions.
  g8_quadrilaterals: 'Prototype content — angle sum, types of quadrilaterals, parallelogram properties. Teacher review required.',
  g8_data_handling_ext: 'Prototype content — histograms, pie chart interpretation, introduction to probability. Teacher review required.',
  g8_comparing_quantities_ext: 'Prototype content — percent change, profit/loss, SI and CI. Teacher review required.',
  g8_algebraic_expressions_ext: 'Prototype content — multiplication of algebraic expressions, standard identities, factorisation basics. Teacher review required.',
  g8_mensuration_ext: 'Prototype content — area of trapezium, surface area and volume of cube and cuboid. Teacher review required.',
  g8_exponents_powers: 'Prototype content — positive integer exponents, negative exponents, scientific notation. Teacher review required.',
  g8_proportions: 'Prototype content — direct proportion, inverse proportion, proportion word problems. Teacher review required.',
  g8_intro_graphs: 'Prototype content — bar and line graphs, coordinate axes, plotting points. Teacher review required.',
  g9_lines_angles: 'Prototype content — angle pairs, parallel lines and transversal, extended triangle angle sum. Teacher review required.',
  g9_quadrilaterals: 'Prototype content — parallelogram properties, rhombus and rectangle, midpoint theorem. Teacher review required.',
  g9_areas_parallelograms_triangles: 'Prototype content — parallelograms and triangles on same base and same parallels, area proofs. Teacher review required.',
  g9_circles: 'Prototype content — chords and arcs, cyclic quadrilaterals, angle in semicircle. Teacher review required.',
  g9_herons_formula: "Prototype content — semiperimeter, Heron's formula, area of a quadrilateral via triangulation. Teacher review required.",
  g9_surface_volume: 'Prototype content — cube, cuboid, cylinder, cone, sphere and hemisphere. Teacher review required.',
  g9_probability: 'Prototype content — empirical probability, coin and die probability, probability from experimental data. Teacher review required.',
  g9_euclid_rationalisation: "Prototype content — Euclid's axioms and postulates, rationalisation of surds. Teacher review required.",
  // v0.35 — Class 11 full chapter coverage descriptions.
  g11_relations_functions_ext: 'Prototype content — Cartesian product, relations vs functions, composition of functions. Teacher review required.',
  g11_trig_functions: 'Prototype content — radian and degree measure, standard trig values, sum/difference and double-angle formulas. Teacher review required.',
  g11_linear_inequalities: 'Prototype content — solving linear inequalities, graphing solutions, inequality word problems. Teacher review required.',
  g11_permutations_combinations: 'Prototype content — counting principle, permutations, combinations. Teacher review required.',
  g11_binomial_theorem: "Prototype content — binomial expansion, general term, Pascal's triangle. Teacher review required.",
  g11_conic_sections: 'Prototype content — circle equations, parabola, ellipse and hyperbola basics. Teacher review required.',
  g11_limits_derivatives: 'Prototype content — concept of limit, derivative as a limit, derivative rules (sum/power/product). Teacher review required.',
  g11_probability: 'Prototype content — axiomatic probability, addition rule, sample spaces and events. Teacher review required.',
  // v0.36 — Classes 1-5 primary full chapter coverage descriptions.
  g1_numbers_21_99: 'Prototype content — numbers 21-50, 51-99, and number names. Teacher review required.',
  g1_add_sub_50: 'Prototype content — addition and subtraction up to 50; skip counting by 2s, 5s, 10s. Teacher review required.',
  g1_time_basics: 'Prototype content — parts of the day, days of the week, months of the year. Teacher review required.',
  g1_measurement_basics: 'Prototype content — heavy/light, full/empty, non-standard length units. Teacher review required.',
  g2_numbers_999: 'Prototype content — place value to 999, 3-digit addition and subtraction (no regrouping). Teacher review required.',
  g2_tables_division: 'Prototype content — multiplication tables 4, 5, and 10; division as equal sharing. Teacher review required.',
  g2_fractions_measurement: 'Prototype content — half/quarter, length in cm/m, weight in g/kg. Teacher review required.',
  g2_capacity_data_shapes: 'Prototype content — capacity in mL/L, pictographs, basic 3D shapes. Teacher review required.',
  g3_numbers_10000: 'Prototype content — place value to 10,000, 4-digit addition and subtraction. Teacher review required.',
  g3_tables_6to10: 'Prototype content — tables of 6, 7, 8, 9 and division using the tables. Teacher review required.',
  g3_fractions_time_money: 'Prototype content — fractions on number line, hours and minutes, money problems. Teacher review required.',
  g3_weight_data_patterns: 'Prototype content — weight in g/kg, basic bar graphs, number patterns. Teacher review required.',
  g4_numbers_99999_ops: 'Prototype content — numbers up to 99,999, long multiplication (2×2 digit), long division (3÷1). Teacher review required.',
  g4_fractions_decimals: 'Prototype content — equivalent fractions, same-denominator addition/subtraction, decimal arithmetic to tenths. Teacher review required.',
  g4_perimeter_area_symmetry: 'Prototype content — perimeter, area of rectangles, lines of symmetry. Teacher review required.',
  g4_time_money_data: 'Prototype content — calendar (year/leap year/weeks), money word problems, tally and simple tables. Teacher review required.',
  g5_crore_hcf_lcm: 'Prototype content — Indian large number system, HCF and LCM introduction. Teacher review required.',
  g5_decimals_fractions_ops: 'Prototype content — decimal ×/÷ and fraction multiplication. Teacher review required.',
  g5_percent_volume_angles: 'Prototype content — percent of a quantity, informal volume of cuboid, types of angles. Teacher review required.',
  g5_data_word_problems: 'Prototype content — mean, bar graph reading, mixed-operation word problems. Teacher review required.',
};

export const SKILL_LABELS: Record<SkillId, string> = {
  // Fractions
  'FR.02': 'Represent fractions visually',
  'FR.03': 'Equivalent fractions',
  'FR.04': 'Mixed numbers and improper fractions',
  'FR.05': 'Add and subtract with like denominators',
  'FR.06': 'Add fractions with unlike denominators',
  'FR.07': 'Subtract fractions with unlike denominators',
  'FR.08': 'Fraction word problems',
  // Decimals
  'DE.01': 'Decimal place value',
  'DE.02': 'Convert fractions and decimals',
  'DE.03': 'Compare and order decimals',
  'DE.04': 'Add and subtract decimals',
  'DE.05': 'Decimal word problems',
  // Factors & Multiples
  'FM.03': 'Prime and composite numbers',
  'FM.04': 'Divisibility rules',
  'FM.06': 'Highest Common Factor (HCF)',
  'FM.07': 'Lowest Common Multiple (LCM)',
  'FM.08': 'HCF / LCM word problems',
  // Ratio & Proportion
  'RP.01': 'Concept of ratio',
  'RP.02': 'Equivalent ratios',
  'RP.03': 'Proportion',
  'RP.04': 'Unitary method',
  'RP.05': 'Ratio and proportion word problems',
  // Algebra Basics
  'AL.01': 'Understanding variables',
  'AL.02': 'Simple expressions',
  'AL.03': 'Evaluate expressions',
  'AL.04': 'One-step equations',
  'AL.05': 'Algebra word problems',
  // Geometry Basics
  'GB.01': 'Points, lines, line segments, rays',
  'GB.02': 'Parallel and intersecting lines',
  'GB.03': 'Types of angles',
  'GB.04': 'Measuring and drawing angles',
  'GB.05': 'Triangles: classify by sides and angles',
  'GB.06': 'Quadrilaterals: basic properties',
  'GB.07': 'Circles: centre, radius, diameter, chord, arc',
  'GB.08': 'Symmetry: lines of symmetry in plane figures',
  'GB.09': 'Coordinate basics: axes, origin, plotting points',
  // v0.23 — Class 7 starter labels.
  'IR.01': 'Add and subtract integers',
  'IR.02': 'Multiply and divide integers',
  'IR.03': 'Introduction to rational numbers',
  'FE.01': 'Multiply and divide fractions',
  'FE.02': 'Decimals: multiply and divide by powers of 10',
  'FE.03': 'Decimal arithmetic: thousandths',
  'AE.01': 'Combine like terms',
  'AE.02': 'Evaluate expressions with negatives',
  'AE.03': 'Two-step equations',
  // v0.25 — Class 7 deepening labels.
  'LA.01': 'Complementary, supplementary, and vertically opposite angles',
  'LA.02': 'Angles on parallel lines cut by a transversal',
  'LA.03': 'Angle sum property of a triangle',
  'CQ.01': 'Convert between fractions, decimals, and percentages',
  'CQ.02': 'Percentage of a quantity and percent change',
  'CQ.03': 'Simple interest and profit / loss in context',
  'DH.01': 'Read pictographs, bar graphs, and double-bar graphs',
  'DH.02': 'Mean, median, and mode of small datasets',
  'DH.03': 'Basic probability of equally likely outcomes',
  // v0.29 — starter grades.
  'G1.01': 'Counting up to 20',
  'G1.02': 'Single-digit addition',
  'G1.03': 'Single-digit subtraction',
  'G2.01': 'Place value up to 99',
  'G2.02': 'Two-digit addition',
  'G2.03': 'Two-digit subtraction',
  'G3.01': 'Multiplication tables 2–5',
  'G3.02': 'Simple division',
  'G3.03': 'Three-digit place value',
  'G4.01': 'Fractions introduction',
  'G4.02': 'Length and weight basics',
  'G4.03': 'Multi-digit multiplication',
  'G5.01': 'Decimal place value',
  'G5.02': 'Percentage introduction',
  'G5.03': 'Long division',
  'G8.01': 'Rational number operations',
  'G8.02': 'Linear equations in one variable',
  'G8.03': 'Squares and cubes',
  'G9.01': 'Real number classification',
  'G9.02': 'Polynomial arithmetic',
  'G9.03': 'Coordinate geometry basics',
  'G10.01': 'Real numbers HCF/LCM',
  'G10.02': 'Quadratic equations',
  'G10.03': 'Basic trigonometry',
  'G11.01': 'Sets and operations',
  'G11.02': 'Functions basics',
  'G11.03': 'Trigonometric identities',
  'G12.01': 'Matrix operations',
  'G12.02': 'Derivatives basics',
  'G12.03': 'Definite integrals',
  // v0.31 — module 2 skills.
  'G1.04': 'Recognise 2D shapes', 'G1.05': 'Compare lengths', 'G1.06': 'Indian coins',
  'G2.04': 'Repeated addition (tables of 2 & 3)', 'G2.05': 'Rupees and paise', 'G2.06': 'Reading clocks',
  'G3.04': 'Halves, thirds and quarters', 'G3.05': '3-digit addition with regrouping', 'G3.06': 'Length in meters',
  'G4.04': 'Numbers up to a lakh', 'G4.05': 'Division with remainders', 'G4.06': 'Tenths and hundredths',
  'G5.04': 'Fractions with unlike denominators', 'G5.05': 'Perimeter and area of a rectangle', 'G5.06': 'Reading bar graphs',
  'G8.04': 'Area of triangles and parallelograms', 'G8.05': 'Bar graphs and pie charts', 'G8.06': 'Algebraic identities',
  'G9.04': 'Linear equations in two variables', 'G9.05': 'Congruence of triangles', 'G9.06': 'Mean, median, mode (ungrouped)',
  'G10.04': 'Distance and section formulae', 'G10.05': 'Arithmetic progressions', 'G10.06': 'Tangent to a circle',
  'G11.04': 'Complex numbers', 'G11.05': 'Geometric progression sum', 'G11.06': 'Slope and equation of a line',
  'G12.04': 'Determinants (2×2 and 3×3)', 'G12.05': 'Chain rule for derivatives', 'G12.06': 'Dot product of vectors',
  // v0.32 — Class 10 & Class 12 full chapter coverage labels.
  'G10.07': 'Types and degree of polynomials', 'G10.08': 'Zeros of a polynomial', 'G10.09': 'Division of polynomials',
  'G10.10': 'Solving graphically', 'G10.11': 'Substitution method', 'G10.12': 'Consistency and solutions',
  'G10.13': 'Basic Proportionality Theorem', 'G10.14': 'Similar triangles and criteria', 'G10.15': 'Pythagoras theorem',
  'G10.16': 'Angle of elevation', 'G10.17': 'Angle of depression', 'G10.18': 'Heights and distances',
  'G10.19': 'Circumference and area of a circle', 'G10.20': 'Sector area and arc length', 'G10.21': 'Segment area',
  'G10.22': 'Surface area of combinations', 'G10.23': 'Volume of combinations', 'G10.24': 'Frustum of a cone',
  'G10.25': 'Mean of grouped data', 'G10.26': 'Median of grouped data', 'G10.27': 'Mode of grouped data',
  'G10.28': 'Classical probability and sample space', 'G10.29': 'Probability of simple events', 'G10.30': 'Complementary events',
  'G12.07': 'Types of relations', 'G12.08': 'Types of functions', 'G12.09': 'Composition and inverse',
  'G12.10': 'Principal values of inverse trig', 'G12.11': 'Inverse trig identities', 'G12.12': 'Domain and range of inverse trig',
  'G12.13': 'Increasing and decreasing functions', 'G12.14': 'Maxima and minima', 'G12.15': 'Rate of change',
  'G12.16': 'Area under a curve', 'G12.17': 'Area between two curves', 'G12.18': 'Definite integral properties',
  'G12.19': 'Order and degree', 'G12.20': 'Variable separable', 'G12.21': 'Linear first-order',
  'G12.22': 'Direction cosines', 'G12.23': 'Equation of a line in 3D', 'G12.24': 'Equation of a plane',
  'G12.25': 'Linear programming basics', 'G12.26': 'Constraints and objective', 'G12.27': 'Graphical solution',
  'G12.28': 'Conditional probability', 'G12.29': 'Bayes theorem intuition', 'G12.30': 'Random variables and distributions',
  // v0.33 — Class 8 & Class 9 full chapter coverage labels.
  'G8.07': 'Angle sum of quadrilaterals', 'G8.08': 'Types of quadrilaterals', 'G8.09': 'Parallelogram properties',
  'G8.10': 'Histograms', 'G8.11': 'Pie chart interpretation', 'G8.12': 'Introduction to probability',
  'G8.13': 'Percent change', 'G8.14': 'Profit and loss', 'G8.15': 'Simple and compound interest',
  'G8.16': 'Multiplication of algebraic expressions', 'G8.17': 'Algebraic identities', 'G8.18': 'Factorisation basics',
  'G8.19': 'Area of trapezium', 'G8.20': 'Surface area cube/cuboid', 'G8.21': 'Volume cube/cuboid',
  'G8.22': 'Positive integer exponents', 'G8.23': 'Negative exponents', 'G8.24': 'Scientific notation',
  'G8.25': 'Direct proportion', 'G8.26': 'Inverse proportion', 'G8.27': 'Proportion word problems',
  'G8.28': 'Bar and line graphs', 'G8.29': 'Coordinate axes', 'G8.30': 'Plotting points',
  'G9.07': 'Angle pairs', 'G9.08': 'Parallel lines and transversal', 'G9.09': 'Triangle angle sum extended',
  'G9.10': 'Parallelogram properties (Class 9)', 'G9.11': 'Rhombus and rectangle', 'G9.12': 'Midpoint theorem',
  'G9.13': 'Area on same base same parallels', 'G9.14': 'Triangles on same base equal area', 'G9.15': 'Area proofs',
  'G9.16': 'Chords and arcs', 'G9.17': 'Cyclic quadrilaterals', 'G9.18': 'Angle in semicircle',
  'G9.19': 'Semiperimeter', 'G9.20': "Heron's formula", 'G9.21': 'Area of quadrilateral via Heron',
  'G9.22': 'Cuboid and cube', 'G9.23': 'Cylinder surface area', 'G9.24': 'Cone and sphere',
  'G9.25': 'Empirical probability', 'G9.26': 'Coin and die probability', 'G9.27': 'Experimental data probability',
  'G9.28': "Euclid's axioms", 'G9.29': "Euclid's postulates", 'G9.30': 'Rationalisation',
  // v0.35 — Class 11 full chapter coverage.
  'G11.07': 'Cartesian product of sets',
  'G11.08': 'Relations vs functions',
  'G11.09': 'Composition of functions',
  'G11.10': 'Radian and degree measure',
  'G11.11': 'Trigonometric function values',
  'G11.12': 'Sum and difference formulas',
  'G11.13': 'Solving linear inequalities in one variable',
  'G11.14': 'Graphing solutions of inequalities',
  'G11.15': 'Word problems with inequalities',
  'G11.16': 'Counting principle',
  'G11.17': 'Permutations',
  'G11.18': 'Combinations',
  'G11.19': 'Binomial expansion',
  'G11.20': 'General term',
  'G11.21': "Pascal's triangle",
  'G11.22': 'Circle equations',
  'G11.23': 'Parabola',
  'G11.24': 'Ellipse and hyperbola basics',
  'G11.25': 'Concept of limit',
  'G11.26': 'Derivative as a limit',
  'G11.27': 'Derivative rules',
  'G11.28': 'Axiomatic probability',
  'G11.29': 'Addition rule of probability',
  'G11.30': 'Sample spaces and events',
  // v0.36 — Classes 1-5 primary full chapter coverage.
  'G1.07': 'Numbers 21 to 50',
  'G1.08': 'Numbers 51 to 99',
  'G1.09': 'Number names 20-50',
  'G1.10': 'Addition up to 50',
  'G1.11': 'Subtraction up to 50',
  'G1.12': 'Skip counting by 2s, 5s, 10s',
  'G1.13': 'Parts of the day',
  'G1.14': 'Days of the week',
  'G1.15': 'Months of the year',
  'G1.16': 'Heavy and light',
  'G1.17': 'Full and empty (capacity)',
  'G1.18': 'Non-standard length units',
  'G2.07': 'Numbers up to 999',
  'G2.08': '3-digit addition (no regrouping)',
  'G2.09': '3-digit subtraction (no regrouping)',
  'G2.10': 'Multiplication tables 4 and 5',
  'G2.11': 'Table of 10',
  'G2.12': 'Division as equal sharing',
  'G2.13': 'Half and quarter (fractions intro)',
  'G2.14': 'Length in cm and m',
  'G2.15': 'Weight in g and kg',
  'G2.16': 'Capacity in mL and L',
  'G2.17': 'Pictographs (basic)',
  'G2.18': '3D shapes basic',
  'G3.07': 'Numbers up to 10000',
  'G3.08': '4-digit addition',
  'G3.09': '4-digit subtraction',
  'G3.10': 'Multiplication tables 6 and 7',
  'G3.11': 'Multiplication tables 8 and 9',
  'G3.12': 'Division with tables',
  'G3.13': 'Fractions on number line',
  'G3.14': 'Time: hours and minutes',
  'G3.15': 'Money: rupees and paise (advanced)',
  'G3.16': 'Weight: grams and kilograms',
  'G3.17': 'Bar graphs (basic)',
  'G3.18': 'Number patterns',
  'G4.07': 'Numbers up to 99999',
  'G4.08': 'Long multiplication (2×2 digit)',
  'G4.09': 'Long division (3-digit ÷ 1-digit)',
  'G4.10': 'Equivalent fractions',
  'G4.11': 'Same-denominator fractions',
  'G4.12': 'Decimal arithmetic (tenths)',
  'G4.13': 'Perimeter',
  'G4.14': 'Area of rectangles (unit squares)',
  'G4.15': 'Symmetry',
  'G4.16': 'Time and calendar (advanced)',
  'G4.17': 'Money word problems',
  'G4.18': 'Data handling: tables',
  'G5.07': 'Large numbers (crore)',
  'G5.08': 'HCF introduction',
  'G5.09': 'LCM introduction',
  'G5.10': 'Decimal multiplication',
  'G5.11': 'Decimal division (by whole)',
  'G5.12': 'Fraction multiplication',
  'G5.13': 'Percent of a quantity',
  'G5.14': 'Volume of cuboid (informal)',
  'G5.15': 'Angles: types',
  'G5.16': 'Data: mean introduction',
  'G5.17': 'Bar graph: read and compare',
  'G5.18': 'Word problems: mixed operations',
};

// Short labels used on chips, dropdowns, and table cells.
export const SKILL_SHORT_LABELS: Record<SkillId, string> = {
  'FR.02': 'FR.02 — Visualise',
  'FR.03': 'FR.03 — Equivalent fractions',
  'FR.04': 'FR.04 — Mixed/Improper',
  'FR.05': 'FR.05 — Like denominators',
  'FR.06': 'FR.06 — Add unlike',
  'FR.07': 'FR.07 — Subtract unlike',
  'FR.08': 'FR.08 — Fraction word problems',
  'DE.01': 'DE.01 — Place value',
  'DE.02': 'DE.02 — Fraction ↔ decimal',
  'DE.03': 'DE.03 — Compare decimals',
  'DE.04': 'DE.04 — Add/subtract decimals',
  'DE.05': 'DE.05 — Decimal word problems',
  'FM.03': 'FM.03 — Prime / composite',
  'FM.04': 'FM.04 — Divisibility rules',
  'FM.06': 'FM.06 — HCF',
  'FM.07': 'FM.07 — LCM',
  'FM.08': 'FM.08 — HCF/LCM word problems',
  'RP.01': 'RP.01 — Ratio concept',
  'RP.02': 'RP.02 — Equivalent ratios',
  'RP.03': 'RP.03 — Proportion',
  'RP.04': 'RP.04 — Unitary method',
  'RP.05': 'RP.05 — Ratio word problems',
  'AL.01': 'AL.01 — Variables',
  'AL.02': 'AL.02 — Expressions',
  'AL.03': 'AL.03 — Evaluate',
  'AL.04': 'AL.04 — One-step equations',
  'AL.05': 'AL.05 — Algebra word problems',
  'GB.01': 'GB.01 — Points & lines',
  'GB.02': 'GB.02 — Parallel & intersecting',
  'GB.03': 'GB.03 — Types of angles',
  'GB.04': 'GB.04 — Measuring angles',
  'GB.05': 'GB.05 — Triangles',
  'GB.06': 'GB.06 — Quadrilaterals',
  'GB.07': 'GB.07 — Circles',
  'GB.08': 'GB.08 — Symmetry',
  'GB.09': 'GB.09 — Coordinate basics',
  'IR.01': 'IR.01 — Add/subtract integers',
  'IR.02': 'IR.02 — Multiply/divide integers',
  'IR.03': 'IR.03 — Rational numbers',
  'FE.01': 'FE.01 — Multiply/divide fractions',
  'FE.02': 'FE.02 — ×/÷ powers of 10',
  'FE.03': 'FE.03 — Thousandths arithmetic',
  'AE.01': 'AE.01 — Combine like terms',
  'AE.02': 'AE.02 — Evaluate with negatives',
  'AE.03': 'AE.03 — Two-step equations',
  'LA.01': 'LA.01 — Complementary/Supplementary',
  'LA.02': 'LA.02 — Parallel lines & transversal',
  'LA.03': 'LA.03 — Triangle angle sum',
  'CQ.01': 'CQ.01 — Fraction ↔ % ↔ decimal',
  'CQ.02': 'CQ.02 — Percent of a quantity',
  'CQ.03': 'CQ.03 — Simple interest & profit/loss',
  'DH.01': 'DH.01 — Read bar/pictographs',
  'DH.02': 'DH.02 — Mean, median, mode',
  'DH.03': 'DH.03 — Basic probability',
  'G1.01': 'G1.01 — Counting',
  'G1.02': 'G1.02 — Add 1-digit',
  'G1.03': 'G1.03 — Sub 1-digit',
  'G2.01': 'G2.01 — Place value',
  'G2.02': 'G2.02 — Add 2-digit',
  'G2.03': 'G2.03 — Sub 2-digit',
  'G3.01': 'G3.01 — Times tables',
  'G3.02': 'G3.02 — Division',
  'G3.03': 'G3.03 — 3-digit place',
  'G4.01': 'G4.01 — Fractions',
  'G4.02': 'G4.02 — Measurement',
  'G4.03': 'G4.03 — × multi-digit',
  'G5.01': 'G5.01 — Decimals',
  'G5.02': 'G5.02 — Percent',
  'G5.03': 'G5.03 — Long division',
  'G8.01': 'G8.01 — Rationals',
  'G8.02': 'G8.02 — Linear eqns',
  'G8.03': 'G8.03 — Squares/cubes',
  'G9.01': 'G9.01 — Real numbers',
  'G9.02': 'G9.02 — Polynomials',
  'G9.03': 'G9.03 — Coord geometry',
  'G10.01': 'G10.01 — HCF/LCM',
  'G10.02': 'G10.02 — Quadratics',
  'G10.03': 'G10.03 — Trig basics',
  'G11.01': 'G11.01 — Sets',
  'G11.02': 'G11.02 — Functions',
  'G11.03': 'G11.03 — Trig identities',
  'G12.01': 'G12.01 — Matrices',
  'G12.02': 'G12.02 — Derivatives',
  'G12.03': 'G12.03 — Integrals',
  // v0.31 — module 2 short labels.
  'G1.04': 'G1.04 — 2D shapes', 'G1.05': 'G1.05 — Length compare', 'G1.06': 'G1.06 — Coins',
  'G2.04': 'G2.04 — Tables 2/3', 'G2.05': 'G2.05 — Rupees/paise', 'G2.06': 'G2.06 — Clocks',
  'G3.04': 'G3.04 — Fractions', 'G3.05': 'G3.05 — 3-digit add', 'G3.06': 'G3.06 — Length m',
  'G4.04': 'G4.04 — Lakhs', 'G4.05': 'G4.05 — Division', 'G4.06': 'G4.06 — Decimals',
  'G5.04': 'G5.04 — Unlike frac', 'G5.05': 'G5.05 — Perimeter/area', 'G5.06': 'G5.06 — Bar graphs',
  'G8.04': 'G8.04 — Area △/▱', 'G8.05': 'G8.05 — Pie charts', 'G8.06': 'G8.06 — Identities',
  'G9.04': 'G9.04 — LE 2-var', 'G9.05': 'G9.05 — Congruence', 'G9.06': 'G9.06 — Mean/med/mode',
  'G10.04': 'G10.04 — Distance/section', 'G10.05': 'G10.05 — AP', 'G10.06': 'G10.06 — Tangent',
  'G11.04': 'G11.04 — Complex', 'G11.05': 'G11.05 — GP sum', 'G11.06': 'G11.06 — Line slope',
  'G12.04': 'G12.04 — Determinants', 'G12.05': 'G12.05 — Chain rule', 'G12.06': 'G12.06 — Dot product',
  // v0.32 — Class 10 & Class 12 full chapter coverage short labels.
  'G10.07': 'G10.07 — Polynomial types', 'G10.08': 'G10.08 — Zeros', 'G10.09': 'G10.09 — Division',
  'G10.10': 'G10.10 — Graphical', 'G10.11': 'G10.11 — Substitution', 'G10.12': 'G10.12 — Consistency',
  'G10.13': 'G10.13 — BPT', 'G10.14': 'G10.14 — Similarity', 'G10.15': 'G10.15 — Pythagoras',
  'G10.16': 'G10.16 — Elevation', 'G10.17': 'G10.17 — Depression', 'G10.18': 'G10.18 — H & D',
  'G10.19': 'G10.19 — Circle area', 'G10.20': 'G10.20 — Sector', 'G10.21': 'G10.21 — Segment',
  'G10.22': 'G10.22 — SA combos', 'G10.23': 'G10.23 — V combos', 'G10.24': 'G10.24 — Frustum',
  'G10.25': 'G10.25 — Mean grouped', 'G10.26': 'G10.26 — Median grouped', 'G10.27': 'G10.27 — Mode grouped',
  'G10.28': 'G10.28 — Sample space', 'G10.29': 'G10.29 — Simple events', 'G10.30': 'G10.30 — Complement',
  'G12.07': 'G12.07 — Relations', 'G12.08': 'G12.08 — Functions', 'G12.09': 'G12.09 — Composition',
  'G12.10': 'G12.10 — Principal vals', 'G12.11': 'G12.11 — Inv trig id', 'G12.12': 'G12.12 — Domain/range',
  'G12.13': 'G12.13 — Monotonicity', 'G12.14': 'G12.14 — Max/min', 'G12.15': 'G12.15 — Rate of change',
  'G12.16': 'G12.16 — Area under', 'G12.17': 'G12.17 — Area between', 'G12.18': 'G12.18 — DI props',
  'G12.19': 'G12.19 — Order/degree', 'G12.20': 'G12.20 — Separable', 'G12.21': 'G12.21 — Linear 1st',
  'G12.22': 'G12.22 — Direction cos', 'G12.23': 'G12.23 — Line 3D', 'G12.24': 'G12.24 — Plane',
  'G12.25': 'G12.25 — LP basics', 'G12.26': 'G12.26 — Constraints', 'G12.27': 'G12.27 — Graphical',
  'G12.28': 'G12.28 — Conditional', 'G12.29': 'G12.29 — Bayes', 'G12.30': 'G12.30 — Random var',
  // v0.33 — Class 8 & Class 9 short labels.
  'G8.07': 'G8.07 — Angle sum', 'G8.08': 'G8.08 — Types', 'G8.09': 'G8.09 — Parallelogram',
  'G8.10': 'G8.10 — Histograms', 'G8.11': 'G8.11 — Pie charts', 'G8.12': 'G8.12 — Prob intro',
  'G8.13': 'G8.13 — Percent change', 'G8.14': 'G8.14 — Profit/loss', 'G8.15': 'G8.15 — SI/CI',
  'G8.16': 'G8.16 — Alg × mult', 'G8.17': 'G8.17 — Identities', 'G8.18': 'G8.18 — Factorisation',
  'G8.19': 'G8.19 — Trapezium area', 'G8.20': 'G8.20 — SA cube/cuboid', 'G8.21': 'G8.21 — V cube/cuboid',
  'G8.22': 'G8.22 — + exponents', 'G8.23': 'G8.23 — − exponents', 'G8.24': 'G8.24 — Sci notation',
  'G8.25': 'G8.25 — Direct prop', 'G8.26': 'G8.26 — Inverse prop', 'G8.27': 'G8.27 — Prop word',
  'G8.28': 'G8.28 — Bar/line', 'G8.29': 'G8.29 — Axes', 'G8.30': 'G8.30 — Plotting',
  'G9.07': 'G9.07 — Angle pairs', 'G9.08': 'G9.08 — Transversal', 'G9.09': 'G9.09 — △ angle sum',
  'G9.10': 'G9.10 — Parallelogram', 'G9.11': 'G9.11 — Rhombus/rect', 'G9.12': 'G9.12 — Midpoint thm',
  'G9.13': 'G9.13 — Same base', 'G9.14': 'G9.14 — △ equal area', 'G9.15': 'G9.15 — Area proofs',
  'G9.16': 'G9.16 — Chords', 'G9.17': 'G9.17 — Cyclic quad', 'G9.18': 'G9.18 — Semicircle',
  'G9.19': 'G9.19 — Semiperimeter', 'G9.20': "G9.20 — Heron's", 'G9.21': 'G9.21 — Quad via Heron',
  'G9.22': 'G9.22 — Cube/cuboid', 'G9.23': 'G9.23 — Cylinder', 'G9.24': 'G9.24 — Cone/sphere',
  'G9.25': 'G9.25 — Empirical', 'G9.26': 'G9.26 — Coin/die', 'G9.27': 'G9.27 — Experimental',
  'G9.28': 'G9.28 — Axioms', 'G9.29': 'G9.29 — Postulates', 'G9.30': 'G9.30 — Rationalise',
  // v0.35 — Class 11 full chapter coverage.
  'G11.07': 'G11.07 — Cartesian ×', 'G11.08': 'G11.08 — Relations/fns', 'G11.09': 'G11.09 — Composition',
  'G11.10': 'G11.10 — Radian/deg', 'G11.11': 'G11.11 — Trig values', 'G11.12': 'G11.12 — Sum/diff',
  'G11.13': 'G11.13 — Inequalities', 'G11.14': 'G11.14 — Graphing', 'G11.15': 'G11.15 — Word problems',
  'G11.16': 'G11.16 — Counting', 'G11.17': 'G11.17 — Permutations', 'G11.18': 'G11.18 — Combinations',
  'G11.19': 'G11.19 — Binomial exp', 'G11.20': 'G11.20 — General term', 'G11.21': "G11.21 — Pascal's",
  'G11.22': 'G11.22 — Circles', 'G11.23': 'G11.23 — Parabola', 'G11.24': 'G11.24 — Ellipse/hyp',
  'G11.25': 'G11.25 — Limits', 'G11.26': 'G11.26 — Derivative', 'G11.27': 'G11.27 — Rules',
  'G11.28': 'G11.28 — Axiomatic', 'G11.29': 'G11.29 — Addition rule', 'G11.30': 'G11.30 — Sample space',
  // v0.36 — Classes 1-5 primary full chapter coverage.
  'G1.07': 'G1.07 — 21–50', 'G1.08': 'G1.08 — 51–99', 'G1.09': 'G1.09 — Names',
  'G1.10': 'G1.10 — Add ≤50', 'G1.11': 'G1.11 — Sub ≤50', 'G1.12': 'G1.12 — Skip count',
  'G1.13': 'G1.13 — Day parts', 'G1.14': 'G1.14 — Weekdays', 'G1.15': 'G1.15 — Months',
  'G1.16': 'G1.16 — Weight', 'G1.17': 'G1.17 — Capacity', 'G1.18': 'G1.18 — Non-std len',
  'G2.07': 'G2.07 — ≤999', 'G2.08': 'G2.08 — 3d +', 'G2.09': 'G2.09 — 3d −',
  'G2.10': 'G2.10 — × 4, 5', 'G2.11': 'G2.11 — × 10', 'G2.12': 'G2.12 — ÷ sharing',
  'G2.13': 'G2.13 — 1/2, 1/4', 'G2.14': 'G2.14 — cm/m', 'G2.15': 'G2.15 — g/kg',
  'G2.16': 'G2.16 — mL/L', 'G2.17': 'G2.17 — Pictograph', 'G2.18': 'G2.18 — 3D shapes',
  'G3.07': 'G3.07 — ≤10k', 'G3.08': 'G3.08 — 4d +', 'G3.09': 'G3.09 — 4d −',
  'G3.10': 'G3.10 — × 6, 7', 'G3.11': 'G3.11 — × 8, 9', 'G3.12': 'G3.12 — ÷ tables',
  'G3.13': 'G3.13 — Frac line', 'G3.14': 'G3.14 — H/M', 'G3.15': 'G3.15 — ₹/paise',
  'G3.16': 'G3.16 — g/kg', 'G3.17': 'G3.17 — Bar graph', 'G3.18': 'G3.18 — Patterns',
  'G4.07': 'G4.07 — ≤99999', 'G4.08': 'G4.08 — 2×2 ×', 'G4.09': 'G4.09 — 3÷1',
  'G4.10': 'G4.10 — Equiv frac', 'G4.11': 'G4.11 — Same denom', 'G4.12': 'G4.12 — Dec arith',
  'G4.13': 'G4.13 — Perimeter', 'G4.14': 'G4.14 — Area', 'G4.15': 'G4.15 — Symmetry',
  'G4.16': 'G4.16 — Calendar', 'G4.17': 'G4.17 — Money WP', 'G4.18': 'G4.18 — Data tables',
  'G5.07': 'G5.07 — Crore', 'G5.08': 'G5.08 — HCF', 'G5.09': 'G5.09 — LCM',
  'G5.10': 'G5.10 — Dec ×', 'G5.11': 'G5.11 — Dec ÷', 'G5.12': 'G5.12 — Frac ×',
  'G5.13': 'G5.13 — % of', 'G5.14': 'G5.14 — Volume', 'G5.15': 'G5.15 — Angles',
  'G5.16': 'G5.16 — Mean', 'G5.17': 'G5.17 — Bar read', 'G5.18': 'G5.18 — Mixed WP',
};

const MODULE_MIXED_LABEL: Record<ModuleMixedMode, string> = {
  mixed_fractions: 'Mixed — Fractions',
  mixed_decimals: 'Mixed — Decimals',
  mixed_factors_multiples: 'Mixed — Factors & Multiples',
  mixed_ratio_proportion: 'Mixed — Ratio & Proportion',
  mixed_algebra: 'Mixed — Algebra Basics',
  mixed_geometry: 'Mixed — Geometry Basics',
  mixed_c7_integers: 'Mixed — Integers & Rational Numbers (Class 7)',
  mixed_c7_fractions_ext: 'Mixed — Fractions & Decimals Ext. (Class 7)',
  mixed_c7_algebra_ext: 'Mixed — Algebraic Expressions & Equations (Class 7)',
  mixed_c7_lines_angles: 'Mixed — Lines & Angles (Class 7)',
  mixed_c7_comparing_quantities: 'Mixed — Comparing Quantities (Class 7)',
  mixed_c7_data_handling: 'Mixed — Data Handling Basics (Class 7)',
};

const MODULE_MIXED_DESC: Record<ModuleMixedMode, string> = {
  mixed_fractions:
    'Mixed-skill session drawn from across the Fractions module (FR.02 → FR.08).',
  mixed_decimals:
    'Mixed-skill session drawn from across the Decimals module (DE.01 → DE.05).',
  mixed_factors_multiples:
    'Mixed-skill session drawn from across the Factors & Multiples module (FM.03 → FM.08).',
  mixed_ratio_proportion:
    'Mixed-skill session drawn from across the Ratio & Proportion module (RP.01 → RP.05).',
  mixed_algebra:
    'Mixed-skill session drawn from across the Algebra Basics module (AL.01 → AL.05).',
  mixed_geometry:
    'Mixed-skill session drawn from across the Geometry Basics module (GB.01 → GB.09).',
  mixed_c7_integers:
    'Mixed-skill session drawn from across the Class 7 Integers & Rational Numbers starter (IR.01 → IR.03).',
  mixed_c7_fractions_ext:
    'Mixed-skill session drawn from across the Class 7 Fractions & Decimals Extension starter (FE.01 → FE.03).',
  mixed_c7_algebra_ext:
    'Mixed-skill session drawn from across the Class 7 Algebraic Expressions & Simple Equations starter (AE.01 → AE.03).',
  mixed_c7_lines_angles:
    'Mixed-skill session drawn from across the Class 7 Lines & Angles module (LA.01 → LA.03).',
  mixed_c7_comparing_quantities:
    'Mixed-skill session drawn from across the Class 7 Comparing Quantities module (CQ.01 → CQ.03).',
  mixed_c7_data_handling:
    'Mixed-skill session drawn from across the Class 7 Data Handling Basics module (DH.01 → DH.03).',
};

export const SKILL_MODE_LABELS: Record<SkillMode, string> = {
  ...SKILL_SHORT_LABELS,
  ...MODULE_MIXED_LABEL,
  mixed: 'Mixed — Class 6 Math (all modules)',
};

export const SKILL_MODE_DESCRIPTIONS: Record<SkillMode, string> = {
  // Per-skill descriptions.
  'FR.02':
    'Adaptive session drawn only from the FR.02 bank (reading and representing fractions on visual models).',
  'FR.03':
    'Adaptive session drawn only from the FR.03 bank (equivalent fractions and simplifying).',
  'FR.04':
    'Adaptive session drawn only from the FR.04 bank (mixed numbers and improper fractions).',
  'FR.05':
    'Adaptive session drawn only from the FR.05 bank (adding and subtracting with like denominators).',
  'FR.06':
    'Adaptive session drawn only from the FR.06 bank (adding fractions with unlike denominators).',
  'FR.07':
    'Adaptive session drawn only from the FR.07 bank (subtracting fractions with unlike denominators).',
  'FR.08':
    'Adaptive session drawn only from the FR.08 bank (multi-step word problems on fractions).',
  'DE.01':
    'Adaptive session drawn only from the DE.01 bank (decimal place value).',
  'DE.02':
    'Adaptive session drawn only from the DE.02 bank (converting between fractions and decimals).',
  'DE.03':
    'Adaptive session drawn only from the DE.03 bank (comparing and ordering decimals).',
  'DE.04':
    'Adaptive session drawn only from the DE.04 bank (adding and subtracting decimals).',
  'DE.05':
    'Adaptive session drawn only from the DE.05 bank (decimal word problems).',
  'FM.03':
    'Adaptive session drawn only from the FM.03 bank (prime and composite numbers).',
  'FM.04':
    'Adaptive session drawn only from the FM.04 bank (divisibility rules for 2, 3, 4, 5, 6, 9, 10).',
  'FM.06':
    'Adaptive session drawn only from the FM.06 bank (Highest Common Factor).',
  'FM.07':
    'Adaptive session drawn only from the FM.07 bank (Lowest Common Multiple).',
  'FM.08':
    'Adaptive session drawn only from the FM.08 bank (HCF / LCM word problems).',
  'RP.01':
    'Adaptive session drawn only from the RP.01 bank (concept of ratio).',
  'RP.02':
    'Adaptive session drawn only from the RP.02 bank (equivalent ratios).',
  'RP.03':
    'Adaptive session drawn only from the RP.03 bank (proportion: a:b :: c:d).',
  'RP.04':
    'Adaptive session drawn only from the RP.04 bank (unitary method).',
  'RP.05':
    'Adaptive session drawn only from the RP.05 bank (ratio and proportion word problems).',
  'AL.01':
    'Adaptive session drawn only from the AL.01 bank (variables as unknowns).',
  'AL.02':
    'Adaptive session drawn only from the AL.02 bank (writing and reading simple algebraic expressions).',
  'AL.03':
    'Adaptive session drawn only from the AL.03 bank (evaluating expressions for given values).',
  'AL.04':
    'Adaptive session drawn only from the AL.04 bank (one-step equations like x + 3 = 7).',
  'AL.05':
    'Adaptive session drawn only from the AL.05 bank (word problems leading to one-step equations).',
  'GB.01':
    'Adaptive session drawn only from the GB.01 bank (points, lines, line segments, rays).',
  'GB.02':
    'Adaptive session drawn only from the GB.02 bank (parallel and intersecting lines).',
  'GB.03':
    'Adaptive session drawn only from the GB.03 bank (acute, right, obtuse, straight, and reflex angles).',
  'GB.04':
    'Adaptive session drawn only from the GB.04 bank (measuring and drawing angles with a protractor).',
  'GB.05':
    'Adaptive session drawn only from the GB.05 bank (classifying triangles by side length and by angle type).',
  'GB.06':
    'Adaptive session drawn only from the GB.06 bank (squares, rectangles, parallelograms, rhombuses, trapeziums, and basic properties).',
  'GB.07':
    'Adaptive session drawn only from the GB.07 bank (centre, radius, diameter, chord, and arc of a circle).',
  'GB.08':
    'Adaptive session drawn only from the GB.08 bank (lines of symmetry in plane figures and simple shapes).',
  'GB.09':
    'Adaptive session drawn only from the GB.09 bank (axes, origin, and plotting points in the first quadrant).',
  // v0.23 — Class 7 starter per-skill descriptions.
  'IR.01':
    'Adaptive session drawn only from the IR.01 bank (adding and subtracting integers with sign rules).',
  'IR.02':
    'Adaptive session drawn only from the IR.02 bank (multiplying and dividing integers with sign rules).',
  'IR.03':
    'Adaptive session drawn only from the IR.03 bank (introduction to rational numbers — representing, ordering, basic arithmetic).',
  'FE.01':
    'Adaptive session drawn only from the FE.01 bank (multiplying and dividing fractions, including by whole numbers).',
  'FE.02':
    'Adaptive session drawn only from the FE.02 bank (multiplying and dividing decimals by 10, 100, 1000).',
  'FE.03':
    'Adaptive session drawn only from the FE.03 bank (decimal arithmetic to the thousandths place).',
  'AE.01':
    'Adaptive session drawn only from the AE.01 bank (combining like terms in algebraic expressions).',
  'AE.02':
    'Adaptive session drawn only from the AE.02 bank (evaluating expressions with positive and negative values).',
  'AE.03':
    'Adaptive session drawn only from the AE.03 bank (light two-step equations like 2x + 3 = 11).',
  // v0.25 — Class 7 deepening per-skill descriptions.
  'LA.01':
    'Adaptive session drawn only from the LA.01 bank (complementary, supplementary, vertically opposite, and linear-pair angles).',
  'LA.02':
    'Adaptive session drawn only from the LA.02 bank (corresponding, alternate, and co-interior angles on parallel lines cut by a transversal).',
  'LA.03':
    'Adaptive session drawn only from the LA.03 bank (angle sum property of a triangle and exterior-angle reasoning).',
  'CQ.01':
    'Adaptive session drawn only from the CQ.01 bank (converting fluently between fractions, decimals, and percentages).',
  'CQ.02':
    'Adaptive session drawn only from the CQ.02 bank (finding a percentage of a quantity and reasoning about percent increase or decrease).',
  'CQ.03':
    'Adaptive session drawn only from the CQ.03 bank (simple interest, and profit / loss percent in everyday contexts).',
  'DH.01':
    'Adaptive session drawn only from the DH.01 bank (reading pictographs, bar graphs, and double-bar graphs).',
  'DH.02':
    'Adaptive session drawn only from the DH.02 bank (computing and interpreting the mean, median, and mode of small datasets).',
  'DH.03':
    'Adaptive session drawn only from the DH.03 bank (basic probability of equally likely outcomes — coins, dice, simple spinners).',
  // Per-module mixed descriptions.
  ...MODULE_MIXED_DESC,
  // Class-6-Math-wide mixed.
  mixed:
    'Mixed-skill session drawn from across every Class 6 Math module (Fractions, Decimals, Factors & Multiples, Ratio & Proportion, Algebra Basics, and Geometry Basics). The per-skill breakdown appears on the results screen. Class 7 starter content is excluded.',
  // v0.29 — starter descriptions. Uniform copy; the specific skill name
  // comes from SKILL_LABELS. Every one is prototype content pending
  // teacher review.
  'G1.01': 'Prototype starter session on Class 1 Counting up to 20. Teacher review required.',
  'G1.02': 'Prototype starter session on Class 1 Single-digit addition. Teacher review required.',
  'G1.03': 'Prototype starter session on Class 1 Single-digit subtraction. Teacher review required.',
  'G2.01': 'Prototype starter session on Class 2 Place value up to 99. Teacher review required.',
  'G2.02': 'Prototype starter session on Class 2 Two-digit addition. Teacher review required.',
  'G2.03': 'Prototype starter session on Class 2 Two-digit subtraction. Teacher review required.',
  'G3.01': 'Prototype starter session on Class 3 Multiplication tables 2–5. Teacher review required.',
  'G3.02': 'Prototype starter session on Class 3 Simple division. Teacher review required.',
  'G3.03': 'Prototype starter session on Class 3 Three-digit place value. Teacher review required.',
  'G4.01': 'Prototype starter session on Class 4 Fractions introduction. Teacher review required.',
  'G4.02': 'Prototype starter session on Class 4 Length and weight basics. Teacher review required.',
  'G4.03': 'Prototype starter session on Class 4 Multi-digit multiplication. Teacher review required.',
  'G5.01': 'Prototype starter session on Class 5 Decimal place value. Teacher review required.',
  'G5.02': 'Prototype starter session on Class 5 Percentage introduction. Teacher review required.',
  'G5.03': 'Prototype starter session on Class 5 Long division. Teacher review required.',
  'G8.01': 'Prototype starter session on Class 8 Rational number operations. Teacher review required.',
  'G8.02': 'Prototype starter session on Class 8 Linear equations. Teacher review required.',
  'G8.03': 'Prototype starter session on Class 8 Squares and cubes. Teacher review required.',
  'G9.01': 'Prototype starter session on Class 9 Real number classification. Teacher review required.',
  'G9.02': 'Prototype starter session on Class 9 Polynomial arithmetic. Teacher review required.',
  'G9.03': 'Prototype starter session on Class 9 Coordinate geometry basics. Teacher review required.',
  'G10.01': 'Prototype starter session on Class 10 Real numbers HCF/LCM. Teacher review required.',
  'G10.02': 'Prototype starter session on Class 10 Quadratic equations. Teacher review required.',
  'G10.03': 'Prototype starter session on Class 10 Basic trigonometry. Teacher review required.',
  'G11.01': 'Prototype starter session on Class 11 Sets and operations. Teacher review required.',
  'G11.02': 'Prototype starter session on Class 11 Functions basics. Teacher review required.',
  'G11.03': 'Prototype starter session on Class 11 Trigonometric identities. Teacher review required.',
  'G12.01': 'Prototype starter session on Class 12 Matrix operations. Teacher review required.',
  'G12.02': 'Prototype starter session on Class 12 Derivatives basics. Teacher review required.',
  'G12.03': 'Prototype starter session on Class 12 Definite integrals. Teacher review required.',
  // v0.31 — module 2 descriptions.
  'G1.04': 'Prototype starter session on Class 1 2D shape recognition. Teacher review required.',
  'G1.05': 'Prototype starter session on Class 1 Length comparison. Teacher review required.',
  'G1.06': 'Prototype starter session on Class 1 Indian coins. Teacher review required.',
  'G2.04': 'Prototype starter session on Class 2 Repeated addition (tables 2–3). Teacher review required.',
  'G2.05': 'Prototype starter session on Class 2 Rupees and paise. Teacher review required.',
  'G2.06': 'Prototype starter session on Class 2 Reading clocks. Teacher review required.',
  'G3.04': 'Prototype starter session on Class 3 Halves, thirds and quarters. Teacher review required.',
  'G3.05': 'Prototype starter session on Class 3 3-digit addition with regrouping. Teacher review required.',
  'G3.06': 'Prototype starter session on Class 3 Length in meters. Teacher review required.',
  'G4.04': 'Prototype starter session on Class 4 Numbers up to a lakh. Teacher review required.',
  'G4.05': 'Prototype starter session on Class 4 Division with remainders. Teacher review required.',
  'G4.06': 'Prototype starter session on Class 4 Tenths and hundredths. Teacher review required.',
  'G5.04': 'Prototype starter session on Class 5 Fractions with unlike denominators. Teacher review required.',
  'G5.05': 'Prototype starter session on Class 5 Perimeter and area. Teacher review required.',
  'G5.06': 'Prototype starter session on Class 5 Reading bar graphs. Teacher review required.',
  'G8.04': 'Prototype starter session on Class 8 Area of triangles and parallelograms. Teacher review required.',
  'G8.05': 'Prototype starter session on Class 8 Bar graphs and pie charts. Teacher review required.',
  'G8.06': 'Prototype starter session on Class 8 Algebraic identities. Teacher review required.',
  'G9.04': 'Prototype starter session on Class 9 Linear equations in two variables. Teacher review required.',
  'G9.05': 'Prototype starter session on Class 9 Congruence of triangles. Teacher review required.',
  'G9.06': 'Prototype starter session on Class 9 Mean, median, mode (ungrouped). Teacher review required.',
  'G10.04': 'Prototype starter session on Class 10 Distance and section formulae. Teacher review required.',
  'G10.05': 'Prototype starter session on Class 10 Arithmetic progressions. Teacher review required.',
  'G10.06': 'Prototype starter session on Class 10 Tangent to a circle. Teacher review required.',
  'G11.04': 'Prototype starter session on Class 11 Complex numbers. Teacher review required.',
  'G11.05': 'Prototype starter session on Class 11 Geometric progression sum. Teacher review required.',
  'G11.06': 'Prototype starter session on Class 11 Slope and equation of a line. Teacher review required.',
  'G12.04': 'Prototype starter session on Class 12 Determinants. Teacher review required.',
  'G12.05': 'Prototype starter session on Class 12 Chain rule for derivatives. Teacher review required.',
  'G12.06': 'Prototype starter session on Class 12 Dot product of vectors. Teacher review required.',
  // v0.32 — Class 10 & Class 12 full chapter coverage descriptions.
  'G10.07': 'Prototype session on Class 10 Polynomials — types and degree. Teacher review required.',
  'G10.08': 'Prototype session on Class 10 Zeros of a polynomial. Teacher review required.',
  'G10.09': 'Prototype session on Class 10 Division of polynomials. Teacher review required.',
  'G10.10': 'Prototype session on Class 10 Solving linear equations graphically. Teacher review required.',
  'G10.11': 'Prototype session on Class 10 Substitution method. Teacher review required.',
  'G10.12': 'Prototype session on Class 10 Consistency of linear equations. Teacher review required.',
  'G10.13': 'Prototype session on Class 10 Basic Proportionality Theorem. Teacher review required.',
  'G10.14': 'Prototype session on Class 10 Similar triangles criteria. Teacher review required.',
  'G10.15': 'Prototype session on Class 10 Pythagoras theorem. Teacher review required.',
  'G10.16': 'Prototype session on Class 10 Angle of elevation. Teacher review required.',
  'G10.17': 'Prototype session on Class 10 Angle of depression. Teacher review required.',
  'G10.18': 'Prototype session on Class 10 Heights and distances. Teacher review required.',
  'G10.19': 'Prototype session on Class 10 Circumference and area of a circle. Teacher review required.',
  'G10.20': 'Prototype session on Class 10 Sector area and arc length. Teacher review required.',
  'G10.21': 'Prototype session on Class 10 Segment area. Teacher review required.',
  'G10.22': 'Prototype session on Class 10 Surface area of combinations. Teacher review required.',
  'G10.23': 'Prototype session on Class 10 Volume of combinations. Teacher review required.',
  'G10.24': 'Prototype session on Class 10 Frustum of a cone. Teacher review required.',
  'G10.25': 'Prototype session on Class 10 Mean of grouped data. Teacher review required.',
  'G10.26': 'Prototype session on Class 10 Median of grouped data. Teacher review required.',
  'G10.27': 'Prototype session on Class 10 Mode of grouped data. Teacher review required.',
  'G10.28': 'Prototype session on Class 10 Sample spaces. Teacher review required.',
  'G10.29': 'Prototype session on Class 10 Probability of simple events. Teacher review required.',
  'G10.30': 'Prototype session on Class 10 Complementary events. Teacher review required.',
  'G12.07': 'Prototype session on Class 12 Types of relations. Teacher review required.',
  'G12.08': 'Prototype session on Class 12 Types of functions. Teacher review required.',
  'G12.09': 'Prototype session on Class 12 Composition and inverse. Teacher review required.',
  'G12.10': 'Prototype session on Class 12 Principal values of inverse trig. Teacher review required.',
  'G12.11': 'Prototype session on Class 12 Inverse trig identities. Teacher review required.',
  'G12.12': 'Prototype session on Class 12 Domain and range of inverse trig. Teacher review required.',
  'G12.13': 'Prototype session on Class 12 Increasing and decreasing functions. Teacher review required.',
  'G12.14': 'Prototype session on Class 12 Maxima and minima. Teacher review required.',
  'G12.15': 'Prototype session on Class 12 Rate of change. Teacher review required.',
  'G12.16': 'Prototype session on Class 12 Area under a curve. Teacher review required.',
  'G12.17': 'Prototype session on Class 12 Area between two curves. Teacher review required.',
  'G12.18': 'Prototype session on Class 12 Definite integral properties. Teacher review required.',
  'G12.19': 'Prototype session on Class 12 Order and degree of ODEs. Teacher review required.',
  'G12.20': 'Prototype session on Class 12 Variable-separable ODEs. Teacher review required.',
  'G12.21': 'Prototype session on Class 12 Linear first-order ODEs. Teacher review required.',
  'G12.22': 'Prototype session on Class 12 Direction cosines. Teacher review required.',
  'G12.23': 'Prototype session on Class 12 Equation of a line in 3D. Teacher review required.',
  'G12.24': 'Prototype session on Class 12 Equation of a plane. Teacher review required.',
  'G12.25': 'Prototype session on Class 12 Linear programming basics. Teacher review required.',
  'G12.26': 'Prototype session on Class 12 Constraints and objective. Teacher review required.',
  'G12.27': 'Prototype session on Class 12 Graphical solution of LPP. Teacher review required.',
  'G12.28': 'Prototype session on Class 12 Conditional probability. Teacher review required.',
  'G12.29': 'Prototype session on Class 12 Bayes theorem intuition. Teacher review required.',
  'G12.30': 'Prototype session on Class 12 Random variables and distributions. Teacher review required.',
  // v0.33 — Class 8 & Class 9 full chapter coverage descriptions.
  'G8.07': 'Prototype session on Class 8 Angle sum of quadrilaterals. Teacher review required.',
  'G8.08': 'Prototype session on Class 8 Types of quadrilaterals. Teacher review required.',
  'G8.09': 'Prototype session on Class 8 Parallelogram properties. Teacher review required.',
  'G8.10': 'Prototype session on Class 8 Histograms. Teacher review required.',
  'G8.11': 'Prototype session on Class 8 Pie chart interpretation. Teacher review required.',
  'G8.12': 'Prototype session on Class 8 Introduction to probability. Teacher review required.',
  'G8.13': 'Prototype session on Class 8 Percent change. Teacher review required.',
  'G8.14': 'Prototype session on Class 8 Profit and loss. Teacher review required.',
  'G8.15': 'Prototype session on Class 8 Simple and compound interest. Teacher review required.',
  'G8.16': 'Prototype session on Class 8 Multiplication of algebraic expressions. Teacher review required.',
  'G8.17': 'Prototype session on Class 8 Algebraic identities. Teacher review required.',
  'G8.18': 'Prototype session on Class 8 Factorisation basics. Teacher review required.',
  'G8.19': 'Prototype session on Class 8 Area of trapezium. Teacher review required.',
  'G8.20': 'Prototype session on Class 8 Surface area of cube/cuboid. Teacher review required.',
  'G8.21': 'Prototype session on Class 8 Volume of cube/cuboid. Teacher review required.',
  'G8.22': 'Prototype session on Class 8 Positive integer exponents. Teacher review required.',
  'G8.23': 'Prototype session on Class 8 Negative exponents. Teacher review required.',
  'G8.24': 'Prototype session on Class 8 Scientific notation. Teacher review required.',
  'G8.25': 'Prototype session on Class 8 Direct proportion. Teacher review required.',
  'G8.26': 'Prototype session on Class 8 Inverse proportion. Teacher review required.',
  'G8.27': 'Prototype session on Class 8 Proportion word problems. Teacher review required.',
  'G8.28': 'Prototype session on Class 8 Bar and line graphs. Teacher review required.',
  'G8.29': 'Prototype session on Class 8 Coordinate axes. Teacher review required.',
  'G8.30': 'Prototype session on Class 8 Plotting points. Teacher review required.',
  'G9.07': 'Prototype session on Class 9 Angle pairs. Teacher review required.',
  'G9.08': 'Prototype session on Class 9 Parallel lines and transversal. Teacher review required.',
  'G9.09': 'Prototype session on Class 9 Triangle angle sum (extended). Teacher review required.',
  'G9.10': 'Prototype session on Class 9 Parallelogram properties. Teacher review required.',
  'G9.11': 'Prototype session on Class 9 Rhombus and rectangle. Teacher review required.',
  'G9.12': 'Prototype session on Class 9 Midpoint theorem. Teacher review required.',
  'G9.13': 'Prototype session on Class 9 Area on same base same parallels. Teacher review required.',
  'G9.14': 'Prototype session on Class 9 Triangles on same base equal area. Teacher review required.',
  'G9.15': 'Prototype session on Class 9 Area proofs. Teacher review required.',
  'G9.16': 'Prototype session on Class 9 Chords and arcs. Teacher review required.',
  'G9.17': 'Prototype session on Class 9 Cyclic quadrilaterals. Teacher review required.',
  'G9.18': 'Prototype session on Class 9 Angle in semicircle. Teacher review required.',
  'G9.19': 'Prototype session on Class 9 Semiperimeter. Teacher review required.',
  'G9.20': "Prototype session on Class 9 Heron's formula. Teacher review required.",
  'G9.21': 'Prototype session on Class 9 Area of quadrilateral via Heron. Teacher review required.',
  'G9.22': 'Prototype session on Class 9 Cuboid and cube. Teacher review required.',
  'G9.23': 'Prototype session on Class 9 Cylinder surface area. Teacher review required.',
  'G9.24': 'Prototype session on Class 9 Cone and sphere. Teacher review required.',
  'G9.25': 'Prototype session on Class 9 Empirical probability. Teacher review required.',
  'G9.26': 'Prototype session on Class 9 Coin and die probability. Teacher review required.',
  'G9.27': 'Prototype session on Class 9 Experimental data probability. Teacher review required.',
  'G9.28': "Prototype session on Class 9 Euclid's axioms. Teacher review required.",
  'G9.29': "Prototype session on Class 9 Euclid's postulates. Teacher review required.",
  'G9.30': 'Prototype session on Class 9 Rationalisation. Teacher review required.',
  // v0.35 — Class 11 full chapter coverage.
  'G11.07': 'Prototype session on Class 11 Cartesian product. Teacher review required.',
  'G11.08': 'Prototype session on Class 11 Relations vs functions. Teacher review required.',
  'G11.09': 'Prototype session on Class 11 Composition of functions. Teacher review required.',
  'G11.10': 'Prototype session on Class 11 Radian and degree measure. Teacher review required.',
  'G11.11': 'Prototype session on Class 11 Trigonometric function values. Teacher review required.',
  'G11.12': 'Prototype session on Class 11 Sum and difference formulas. Teacher review required.',
  'G11.13': 'Prototype session on Class 11 Solving linear inequalities. Teacher review required.',
  'G11.14': 'Prototype session on Class 11 Graphing inequality solutions. Teacher review required.',
  'G11.15': 'Prototype session on Class 11 Inequality word problems. Teacher review required.',
  'G11.16': 'Prototype session on Class 11 Counting principle. Teacher review required.',
  'G11.17': 'Prototype session on Class 11 Permutations. Teacher review required.',
  'G11.18': 'Prototype session on Class 11 Combinations. Teacher review required.',
  'G11.19': 'Prototype session on Class 11 Binomial expansion. Teacher review required.',
  'G11.20': 'Prototype session on Class 11 General term. Teacher review required.',
  'G11.21': "Prototype session on Class 11 Pascal's triangle. Teacher review required.",
  'G11.22': 'Prototype session on Class 11 Circle equations. Teacher review required.',
  'G11.23': 'Prototype session on Class 11 Parabola. Teacher review required.',
  'G11.24': 'Prototype session on Class 11 Ellipse and hyperbola basics. Teacher review required.',
  'G11.25': 'Prototype session on Class 11 Concept of limit. Teacher review required.',
  'G11.26': 'Prototype session on Class 11 Derivative as a limit. Teacher review required.',
  'G11.27': 'Prototype session on Class 11 Derivative rules. Teacher review required.',
  'G11.28': 'Prototype session on Class 11 Axiomatic probability. Teacher review required.',
  'G11.29': 'Prototype session on Class 11 Addition rule of probability. Teacher review required.',
  'G11.30': 'Prototype session on Class 11 Sample spaces and events. Teacher review required.',
  // v0.36 — Classes 1-5 primary full chapter coverage.
  'G1.07': 'Prototype session on Class 1 Numbers 21-50. Teacher review required.',
  'G1.08': 'Prototype session on Class 1 Numbers 51-99. Teacher review required.',
  'G1.09': 'Prototype session on Class 1 Number names 20-50. Teacher review required.',
  'G1.10': 'Prototype session on Class 1 Addition up to 50. Teacher review required.',
  'G1.11': 'Prototype session on Class 1 Subtraction up to 50. Teacher review required.',
  'G1.12': 'Prototype session on Class 1 Skip counting. Teacher review required.',
  'G1.13': 'Prototype session on Class 1 Parts of the day. Teacher review required.',
  'G1.14': 'Prototype session on Class 1 Days of the week. Teacher review required.',
  'G1.15': 'Prototype session on Class 1 Months of the year. Teacher review required.',
  'G1.16': 'Prototype session on Class 1 Heavy and light. Teacher review required.',
  'G1.17': 'Prototype session on Class 1 Capacity (full/empty). Teacher review required.',
  'G1.18': 'Prototype session on Class 1 Non-standard length units. Teacher review required.',
  'G2.07': 'Prototype session on Class 2 Numbers up to 999. Teacher review required.',
  'G2.08': 'Prototype session on Class 2 3-digit addition. Teacher review required.',
  'G2.09': 'Prototype session on Class 2 3-digit subtraction. Teacher review required.',
  'G2.10': 'Prototype session on Class 2 Tables 4 and 5. Teacher review required.',
  'G2.11': 'Prototype session on Class 2 Table of 10. Teacher review required.',
  'G2.12': 'Prototype session on Class 2 Division as equal sharing. Teacher review required.',
  'G2.13': 'Prototype session on Class 2 Half and quarter. Teacher review required.',
  'G2.14': 'Prototype session on Class 2 Length in cm and m. Teacher review required.',
  'G2.15': 'Prototype session on Class 2 Weight in g and kg. Teacher review required.',
  'G2.16': 'Prototype session on Class 2 Capacity in mL and L. Teacher review required.',
  'G2.17': 'Prototype session on Class 2 Pictographs. Teacher review required.',
  'G2.18': 'Prototype session on Class 2 3D shapes. Teacher review required.',
  'G3.07': 'Prototype session on Class 3 Numbers up to 10,000. Teacher review required.',
  'G3.08': 'Prototype session on Class 3 4-digit addition. Teacher review required.',
  'G3.09': 'Prototype session on Class 3 4-digit subtraction. Teacher review required.',
  'G3.10': 'Prototype session on Class 3 Tables 6 and 7. Teacher review required.',
  'G3.11': 'Prototype session on Class 3 Tables 8 and 9. Teacher review required.',
  'G3.12': 'Prototype session on Class 3 Division with tables. Teacher review required.',
  'G3.13': 'Prototype session on Class 3 Fractions on number line. Teacher review required.',
  'G3.14': 'Prototype session on Class 3 Hours and minutes. Teacher review required.',
  'G3.15': 'Prototype session on Class 3 Money problems. Teacher review required.',
  'G3.16': 'Prototype session on Class 3 Weight g/kg. Teacher review required.',
  'G3.17': 'Prototype session on Class 3 Bar graphs. Teacher review required.',
  'G3.18': 'Prototype session on Class 3 Number patterns. Teacher review required.',
  'G4.07': 'Prototype session on Class 4 Numbers up to 99,999. Teacher review required.',
  'G4.08': 'Prototype session on Class 4 Long multiplication. Teacher review required.',
  'G4.09': 'Prototype session on Class 4 Long division. Teacher review required.',
  'G4.10': 'Prototype session on Class 4 Equivalent fractions. Teacher review required.',
  'G4.11': 'Prototype session on Class 4 Same-denominator fractions. Teacher review required.',
  'G4.12': 'Prototype session on Class 4 Decimal arithmetic. Teacher review required.',
  'G4.13': 'Prototype session on Class 4 Perimeter. Teacher review required.',
  'G4.14': 'Prototype session on Class 4 Area of rectangles. Teacher review required.',
  'G4.15': 'Prototype session on Class 4 Symmetry. Teacher review required.',
  'G4.16': 'Prototype session on Class 4 Calendar and time. Teacher review required.',
  'G4.17': 'Prototype session on Class 4 Money word problems. Teacher review required.',
  'G4.18': 'Prototype session on Class 4 Data tables. Teacher review required.',
  'G5.07': 'Prototype session on Class 5 Large numbers (crore). Teacher review required.',
  'G5.08': 'Prototype session on Class 5 HCF introduction. Teacher review required.',
  'G5.09': 'Prototype session on Class 5 LCM introduction. Teacher review required.',
  'G5.10': 'Prototype session on Class 5 Decimal multiplication. Teacher review required.',
  'G5.11': 'Prototype session on Class 5 Decimal division. Teacher review required.',
  'G5.12': 'Prototype session on Class 5 Fraction multiplication. Teacher review required.',
  'G5.13': 'Prototype session on Class 5 Percent of a quantity. Teacher review required.',
  'G5.14': 'Prototype session on Class 5 Volume of cuboid. Teacher review required.',
  'G5.15': 'Prototype session on Class 5 Types of angles. Teacher review required.',
  'G5.16': 'Prototype session on Class 5 Mean introduction. Teacher review required.',
  'G5.17': 'Prototype session on Class 5 Bar graph reading. Teacher review required.',
  'G5.18': 'Prototype session on Class 5 Mixed word problems. Teacher review required.',
};

// Convenience: map a SkillMode to a module scope, used by the engine and
// dashboards.
//   single skill   → its module
//   mixed_<module> → that module
//   'mixed'        → null (means "across all modules")
export const moduleForSkillMode = (mode: SkillMode): ModuleId | null => {
  if (mode === 'mixed') return null;
  if (mode === 'mixed_fractions') return 'fractions';
  if (mode === 'mixed_decimals') return 'decimals';
  if (mode === 'mixed_factors_multiples') return 'factors_multiples';
  if (mode === 'mixed_ratio_proportion') return 'ratio_proportion';
  if (mode === 'mixed_algebra') return 'algebra';
  if (mode === 'mixed_geometry') return 'geometry';
  if (mode === 'mixed_c7_integers') return 'c7_integers';
  if (mode === 'mixed_c7_fractions_ext') return 'c7_fractions_ext';
  if (mode === 'mixed_c7_algebra_ext') return 'c7_algebra_ext';
  if (mode === 'mixed_c7_lines_angles') return 'c7_lines_angles';
  if (mode === 'mixed_c7_comparing_quantities') return 'c7_comparing_quantities';
  if (mode === 'mixed_c7_data_handling') return 'c7_data_handling';
  return MODULE_FOR_SKILL[mode];
};

// ---------------------------------------------------------------------------
// Session: one attempt at the assessment by one student
// ---------------------------------------------------------------------------
export type Session = {
  id: string;
  studentId: string;
  studentSnapshot: StudentSnapshot;
  window: AssessmentWindow;
  // The mode the student was assessed under. Field name kept as `skillId`
  // for backwards-compatibility with v0.3 localStorage records.
  skillId: SkillMode;
  startedAt: number;
  completedAt: number | null;
  responses: Response[];
  finalAbility: number; // running ability estimate at the end of the session
  // v0.8: optional. Set on sessions started while a pilot was active.
  // Old sessions never have it; any view that needs it falls back to "no pilot".
  pilotId?: string;
  // v0.11: optional. Set on sessions started from a teacher assignment.
  assignmentId?: string;
  // v0.21: when a session was imported from a public submission, this is
  // the student-device LOCAL id that the student device assigned to
  // themselves. The teacher-side `studentId` (above) is the teacher's
  // local roster id for the SAME human (matched by displayed name +
  // grade). Storing the source id lets us trace imported sessions back
  // to a specific student device if needed.
  externalStudentLocalId?: string;
  // v0.21: provenance flag set by importStudentSubmissions(). Lets the
  // teacher UI filter "imported via classroom code" sessions in a
  // dedicated review view.
  importedFromCode?: string;
  importedAt?: number;
  // v0.26 — curriculum snapshot frozen at session time. Optional so all
  // legacy sessions load unchanged. New sessions written by
  // storage.ts::newSession() populate these from the student + selected
  // assessment scope. `assessmentScope` is a discriminated shape from
  // src/curriculum/migrations.ts::AssessmentScope, persisted as-is; the
  // consuming report code re-hydrates it through the registry.
  curriculumId?: string;
  curriculumVersion?: string;
  gradeId?: string;
  subjectId?: string;
  blueprintId?: string;
  blueprintVersion?: string;
  scoringVersion?: string;
  contentReviewStatus?: string;
  // v0.49 §3 — chapter-session snapshot. All optional: every session
  // written before v0.49 simply lacks these fields, and readers must
  // treat absence as "not recorded" rather than inferring a default.
  //
  //   sessionPurpose        — 'practice' | 'chapter_check' |
  //                           'concept_practice'. The field that makes
  //                           mixed practice and a chapter check
  //                           distinguishable after the fact.
  //   chapterBlueprintId    — which ChapterBlueprint produced the pool.
  //   chapterBlueprintVersion — the blueprint's rule version, so two
  //                           sessions built under different rules are
  //                           never compared as the same instrument.
  //   sampledSkillIds       — the skills actually represented in the
  //                           administered pool (measured, not copied
  //                           from the blueprint's intent).
  //   chapterId / chapterModuleId — the chapter this session belongs to.
  sessionPurpose?: string;
  chapterBlueprintId?: string;
  chapterBlueprintVersion?: string;
  sampledSkillIds?: string[];
  chapterId?: string;
  chapterModuleId?: string;
  // v0.49 §8 — classroom context recorded at session time when the
  // student belongs to one. Teacher Insights prefers classroom
  // membership (Classroom.studentIds) and falls back to this field for
  // students who have since left the roster.
  classroomId?: string;
  academicYear?: string;

  // v0.50 §1 — session lifecycle + resume state. All optional: every
  // session written before v0.50 loads unchanged, and `lifecycleOf()`
  // derives a status for those records from `completedAt`.
  //
  //   lifecycle          'in_progress' | 'completed' | 'exited'.
  //                      'exited' means the student left early — real
  //                      answers, but NOT a completed attempt.
  //   lastActivityAt     ms epoch of the last answer, for ordering
  //                      resumable sets.
  //   resumePoolItemIds  the administered pool, IN ORDER. Storing IDs
  //                      rather than items keeps the record small and
  //                      lets the pool be rehydrated from the bank.
  //   resumeCurrentIndex index into resumePoolItemIds of the question
  //                      the student is on.
  //   resumeAbility      engine ability at the point of exit.
  //   resumeAttemptedIds items already attempted this session.
  //   resumeChapterId / resumeSkillId / resumeReturnTab
  //                      where to put the student back when they return.
  lifecycle?: string;
  lastActivityAt?: number;
  resumePoolItemIds?: string[];
  resumeCurrentIndex?: number;
  resumeAbility?: number;
  resumeAttemptedIds?: string[];
  resumeChapterId?: string;
  resumeSkillId?: string;
  resumeReturnTab?: string;

  // v0.50 §4 — chapter-check coverage, persisted for audit.
  requestedItemCount?: number;
  administeredItemCount?: number;
  missingRequiredSkillIdsAtLaunch?: string[];
};

// ---------------------------------------------------------------------------
// Alignment + audit (v0.10)
// ---------------------------------------------------------------------------
// Per-skill and per-item alignment metadata. The intent is to make Pragati
// credible as a CBSE/NCERT-INFORMED prototype, not to claim official CBSE
// approval. Every alignment statement is the prototype's reading of the
// public framework (NCF / NCERT / Ganita Prakash, Class 6) and requires
// teacher review.

export type CognitiveDemand =
  | 'recall'
  | 'procedural'
  | 'conceptual'
  | 'application'
  | 'reasoning';

export const COGNITIVE_DEMAND_LABELS: Record<CognitiveDemand, string> = {
  recall: 'Recall',
  procedural: 'Procedural',
  conceptual: 'Conceptual',
  application: 'Application',
  reasoning: 'Reasoning',
};

export type AlignmentConfidence =
  | 'high'
  | 'medium'
  | 'needs_teacher_review';

export const ALIGNMENT_CONFIDENCE_LABELS: Record<AlignmentConfidence, string> = {
  high: 'High',
  medium: 'Medium',
  needs_teacher_review: 'Needs teacher review',
};

export const ALIGNMENT_CONFIDENCE_COLOR: Record<AlignmentConfidence, string> = {
  high: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  needs_teacher_review: 'bg-rose-50 text-rose-700 ring-rose-200',
};

// Item-level audit flags (Task 3 of v0.10).
export type AuditFlag =
  | 'grade_level_mismatch'
  | 'wording_too_complex'
  | 'possible_ambiguity'
  | 'cross_skill_contamination'
  | 'needs_cbse_teacher_review'
  | 'parser_limitation';

export const AUDIT_FLAG_LABELS: Record<AuditFlag, string> = {
  grade_level_mismatch: 'Possible grade-level mismatch',
  wording_too_complex: 'Wording too complex',
  possible_ambiguity: 'Possible ambiguity',
  cross_skill_contamination: 'Cross-skill contamination',
  needs_cbse_teacher_review: 'Needs CBSE teacher review',
  parser_limitation: 'Symbolic answer / parser limitation',
};

export const AUDIT_FLAG_DESCRIPTIONS: Record<AuditFlag, string> = {
  grade_level_mismatch:
    'The item may push beyond what is reasonable for Class 6, in either direction.',
  wording_too_complex:
    'The phrasing is harder than it needs to be for Class 6 vocabulary.',
  possible_ambiguity:
    'The item may have more than one defensible correct answer, or the question is open to interpretation.',
  cross_skill_contamination:
    'The item tests more than the skill it is filed under (e.g., a one-step equation that also requires evaluation).',
  needs_cbse_teacher_review:
    'A CBSE Class 6 maths teacher should look at this item before pilot use.',
  parser_limitation:
    'The expected answer involves a symbol the prototype parser cannot evaluate (typically an algebraic expression). Item is delivered as MCQ as a workaround.',
};

// Per-skill alignment metadata. One per SkillId.
export type SkillAlignment = {
  skillId: SkillId;
  skillName: string;
  moduleId: ModuleId;
  // Public framework reference (NCERT / Ganita Prakash chapter).
  chapterReference: string;
  // Plain-English learning outcome (one or two sentences).
  learningOutcome: string;
  // CBSE-style competency statement (one sentence).
  competencyStatement: string;
  // Prerequisite skills inside this curriculum (cross-references SkillId).
  prerequisiteSkills: SkillId[];
  // Dominant cognitive focus for the skill.
  cognitiveFocus: CognitiveDemand;
};

// Per-item alignment metadata. Computed by getItemAlignment(item) so it
// stays in sync with the item bank without us having to author 304 inline
// objects.
export type ItemAlignment = {
  alignmentSkillId: SkillId;
  chapterReference: string;
  competencyTag: string;
  cognitiveDemand: CognitiveDemand;
  alignmentConfidence: AlignmentConfidence;
  auditFlags: AuditFlag[];
};

// ---------------------------------------------------------------------------
// App mode (v0.8)
// ---------------------------------------------------------------------------
// Default is 'student' — the simpler home screen with three recommended
// actions. 'teacher' unlocks the teacher dashboard, item review, pilot
// setup, and teaching plan views. Persisted to localStorage so it survives
// reloads.
export type AppMode = 'student' | 'teacher';

// ---------------------------------------------------------------------------
// Item review (v0.8)
// ---------------------------------------------------------------------------
// One per item, keyed by itemId. A teacher fills this out via the
// "Item Review" workflow on the teacher dashboard.
export type ItemReviewStatus = 'not_reviewed' | 'needs_revision' | 'approved';

// Tri-state UI: yes / no / null (unanswered). For visualHelpful the third
// option is explicitly "n/a" because some items have no visual.
export type YesNo = 'yes' | 'no';
export type YesNoNa = 'yes' | 'no' | 'na';
export type DifficultyRating = 'too_easy' | 'right_level' | 'too_hard';

export type ItemReview = {
  itemId: string;
  status: ItemReviewStatus;
  correctAnswerVerified: YesNo | null;
  wordingClear: YesNo | null;
  gradeAppropriate: YesNo | null;
  visualHelpful: YesNoNa | null;
  difficultyRating: DifficultyRating | null;
  ambiguityConcern: YesNo | null;
  comments: string;
  reviewerName?: string;
  reviewedAt: number; // ms epoch
};

// ---------------------------------------------------------------------------
// Pilot mode (v0.8)
// ---------------------------------------------------------------------------
// A pilot wraps a set of sessions taken in one classroom context: which
// teacher, which class, which school, which date. Sessions started while a
// pilot is "active" are tagged with that pilot's id (Session.pilotId).
export type PilotMetadata = {
  id: string;
  teacherName: string;
  className: string;
  school: string;
  date: number;             // ms epoch — typically the start of the pilot
  defaultMode: SkillMode;   // suggested skill mode for this pilot's sessions
  notes: string;
  active: boolean;          // exactly one pilot can be active at a time
  createdAt: number;
};

// ---------------------------------------------------------------------------
// Assessment assignment (v0.11)
// ---------------------------------------------------------------------------
// A teacher creates an "assignment" that gives the next session a focus
// (a skill or module-mixed mode), an item-count target, and a friendly
// student-facing title. Sessions started from an assignment can carry the
// `assignmentId` so we can roll up performance per assignment later.

export type AssignmentSize = 8 | 10 | 12 | 15;

export const ASSIGNMENT_SIZES: AssignmentSize[] = [8, 10, 12, 15];

// v0.12: assignments can target the whole class, a small group, or one
// student. For this prototype the names are plain text in localStorage —
// no roster, login, or backend.
export type AssignmentTargetKind = 'class' | 'group' | 'student';

export const ASSIGNMENT_TARGET_LABELS: Record<AssignmentTargetKind, string> = {
  class: 'Whole class',
  group: 'Small group',
  student: 'Individual student',
};

export type AssignmentTarget = {
  kind: AssignmentTargetKind;
  // Free-text label. For 'class' this can be empty; for 'group' or
  // 'student' it is the group name / student name written by the teacher.
  label: string;
};

export type AssessmentAssignment = {
  id: string;
  createdAt: number;
  // What is being assessed.
  skillMode: SkillMode;
  // Target number of items the student will see (the engine still picks 10
  // by default; this is a teacher-facing intent that the student sees).
  itemCount: AssignmentSize;
  // If pilot mode was on at creation, store the pilot id here so the
  // assignment is portable across pilot end / start.
  pilotId?: string;
  pilotModeOn: boolean;
  // Student-facing title (e.g., "Wednesday's Decimals check").
  title: string;
  // Short note from the teacher; surfaced on the student's assignment card.
  teacherNote: string;
  // Whether the assignment is still being offered to students. When set
  // false, the student home no longer surfaces it.
  active: boolean;
  // v0.12: who the assignment is for. Optional for backwards-compat with
  // v0.11 records; missing → treat as { kind: 'class', label: '' }.
  target?: AssignmentTarget;
  // v0.19: optional classroom binding. When set, the assignment is offered
  // to students who joined this classroom via an access code.
  classroomId?: string;
  // v0.19: optional list of selected student ids when target.kind === 'group'
  // or 'student'. Falls back to the free-text `target.label` if missing.
  targetStudentIds?: string[];
  // v0.19: practice vs assessment. 'practice' sessions don't count toward
  // the pilot scoring summary; default 'assessment' (back-compat).
  kind?: 'assessment' | 'practice';
  // v0.19: optional due date (ms epoch). Used for sorting on the student
  // home and for "overdue" badges on the teacher dashboard.
  dueDateMs?: number;
  // v0.26 — curriculum context so the student flow can refuse to run an
  // assignment against a mismatched grade/subject. All optional so old
  // records still load.
  curriculumId?: string;
  gradeId?: string;
  subjectId?: string;
  blueprintId?: string;
};

// ---------------------------------------------------------------------------
// Teacher workflow + readiness (v0.11)
// ---------------------------------------------------------------------------
// The teacher home is now a guided 6-step workflow. Status is derived from
// device state, not stored.

export type WorkflowStepStatus =
  | 'not_started'
  | 'in_progress'
  | 'complete'
  | 'needs_attention';

export const WORKFLOW_STEP_STATUS_LABELS: Record<WorkflowStepStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  complete: 'Complete',
  needs_attention: 'Needs attention',
};

export const WORKFLOW_STEP_STATUS_COLOR: Record<WorkflowStepStatus, string> = {
  not_started: 'bg-slate-100 text-slate-600 ring-slate-200',
  in_progress: 'bg-amber-50 text-amber-700 ring-amber-200',
  complete: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  needs_attention: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export type WorkflowStepId =
  | 'pilot_setup'
  | 'assignment'
  | 'review_results'
  | 'teaching_plan'
  | 'flagged_items'
  | 'export';

export type WorkflowStep = {
  id: WorkflowStepId;
  title: string;
  subtitle: string;
  description: string;
  status: WorkflowStepStatus;
  // What the step's primary CTA is labelled with.
  ctaLabel: string;
};

// One-line readiness checklist row.
export type ReadinessCheckId =
  | 'pilot_metadata'
  | 'assignment_created'
  | 'sessions_5'
  | 'feedback_collected'
  | 'reviews_started'
  | 'flagged_reviewed'
  | 'export_ready'
  // v0.22: classroom-code multi-device checks.
  | 'classroom_code_active'
  | 'assignment_published_to_code'
  | 'student_joined_by_code'
  | 'submission_imported'
  | 'imported_sessions_reviewed';

export type ReadinessCheck = {
  id: ReadinessCheckId;
  label: string;
  passed: boolean;
  detail: string;
};

// ---------------------------------------------------------------------------
// Session feedback (v0.8)
// ---------------------------------------------------------------------------
// Captured from the student on the Results page. One feedback per session.
export type SessionFeedbackDifficulty = 'easy' | 'okay' | 'hard';
export type PicturesHelped = 'yes' | 'no' | 'mixed' | 'na';

export type SessionFeedback = {
  sessionId: string;
  difficulty: SessionFeedbackDifficulty;
  confusingQuestions: string;   // free text, can be empty
  picturesHelped: PicturesHelped;
  hardestPart: string;          // free text, can be empty
  submittedAt: number;
};
