import {
  moduleForSkillMode,
  SKILL_MODE_DESCRIPTIONS,
  SKILL_MODE_LABELS,
  MODULE_GRADE,
  type ModuleId,
  type SkillMode,
} from '../../types';
import { GRADE_COLORS } from './gradePalette';

// v0.37 — Per-module chip color palette.
//
// Class 6 (reviewed core) keeps its handcrafted per-module hues so
// each of the 6 module dashboards stays visually distinct at a glance.
// Class 7 keeps its handcrafted deepening-module hues for the same
// reason. Every other grade now inherits its GRADE_COLORS chip class,
// giving each grade one consistent hue across all of its modules —
// which replaces the uniform-slate everywhere in v0.29 → v0.36.
//
// Rainbow allocation (see gradePalette.ts):
//   Class 1 rose, 2 orange, 3 amber, 4 lime, 5 emerald,
//   6 teal (handcrafted per module), 7 cyan (handcrafted per module),
//   8 sky, 9 blue, 10 indigo, 11 violet, 12 fuchsia
export const MODULE_CHIP_CLASS: Record<ModuleId, string> = {
  // Class 6 — reviewed core, handcrafted per-module colors.
  fractions: 'bg-brand-50 text-brand-700 ring-brand-200',
  decimals: 'bg-sky-50 text-sky-700 ring-sky-200',
  factors_multiples: 'bg-amber-50 text-amber-700 ring-amber-200',
  ratio_proportion: 'bg-violet-50 text-violet-700 ring-violet-200',
  algebra: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  geometry: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  // Class 7 — handcrafted per-module colors (starter + deepening).
  c7_integers: 'bg-rose-50 text-rose-700 ring-rose-200',
  c7_fractions_ext: 'bg-pink-50 text-pink-700 ring-pink-200',
  c7_algebra_ext: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  c7_lines_angles: 'bg-teal-50 text-teal-700 ring-teal-200',
  c7_comparing_quantities: 'bg-orange-50 text-orange-700 ring-orange-200',
  c7_data_handling: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  // Class 1 — rose.
  g1_math_starter: GRADE_COLORS.class1.chip,
  g1_math_m2: GRADE_COLORS.class1.chip,
  g1_numbers_21_99: GRADE_COLORS.class1.chip,
  g1_add_sub_50: GRADE_COLORS.class1.chip,
  g1_time_basics: GRADE_COLORS.class1.chip,
  g1_measurement_basics: GRADE_COLORS.class1.chip,
  // Class 2 — orange.
  g2_math_starter: GRADE_COLORS.class2.chip,
  g2_math_m2: GRADE_COLORS.class2.chip,
  g2_numbers_999: GRADE_COLORS.class2.chip,
  g2_tables_division: GRADE_COLORS.class2.chip,
  g2_fractions_measurement: GRADE_COLORS.class2.chip,
  g2_capacity_data_shapes: GRADE_COLORS.class2.chip,
  // Class 3 — amber.
  g3_math_starter: GRADE_COLORS.class3.chip,
  g3_math_m2: GRADE_COLORS.class3.chip,
  g3_numbers_10000: GRADE_COLORS.class3.chip,
  g3_tables_6to10: GRADE_COLORS.class3.chip,
  g3_fractions_time_money: GRADE_COLORS.class3.chip,
  g3_weight_data_patterns: GRADE_COLORS.class3.chip,
  // Class 4 — lime.
  g4_math_starter: GRADE_COLORS.class4.chip,
  g4_math_m2: GRADE_COLORS.class4.chip,
  g4_numbers_99999_ops: GRADE_COLORS.class4.chip,
  g4_fractions_decimals: GRADE_COLORS.class4.chip,
  g4_perimeter_area_symmetry: GRADE_COLORS.class4.chip,
  g4_time_money_data: GRADE_COLORS.class4.chip,
  // Class 5 — emerald.
  g5_math_starter: GRADE_COLORS.class5.chip,
  g5_math_m2: GRADE_COLORS.class5.chip,
  g5_crore_hcf_lcm: GRADE_COLORS.class5.chip,
  g5_decimals_fractions_ops: GRADE_COLORS.class5.chip,
  g5_percent_volume_angles: GRADE_COLORS.class5.chip,
  g5_data_word_problems: GRADE_COLORS.class5.chip,
  // Class 8 — sky.
  g8_math_starter: GRADE_COLORS.class8.chip,
  g8_math_m2: GRADE_COLORS.class8.chip,
  g8_quadrilaterals: GRADE_COLORS.class8.chip,
  g8_data_handling_ext: GRADE_COLORS.class8.chip,
  g8_comparing_quantities_ext: GRADE_COLORS.class8.chip,
  g8_algebraic_expressions_ext: GRADE_COLORS.class8.chip,
  g8_mensuration_ext: GRADE_COLORS.class8.chip,
  g8_exponents_powers: GRADE_COLORS.class8.chip,
  g8_proportions: GRADE_COLORS.class8.chip,
  g8_intro_graphs: GRADE_COLORS.class8.chip,
  // Class 9 — blue.
  g9_math_starter: GRADE_COLORS.class9.chip,
  g9_math_m2: GRADE_COLORS.class9.chip,
  g9_lines_angles: GRADE_COLORS.class9.chip,
  g9_quadrilaterals: GRADE_COLORS.class9.chip,
  g9_areas_parallelograms_triangles: GRADE_COLORS.class9.chip,
  g9_circles: GRADE_COLORS.class9.chip,
  g9_herons_formula: GRADE_COLORS.class9.chip,
  g9_surface_volume: GRADE_COLORS.class9.chip,
  g9_probability: GRADE_COLORS.class9.chip,
  g9_euclid_rationalisation: GRADE_COLORS.class9.chip,
  // Class 10 — indigo.
  g10_math_starter: GRADE_COLORS.class10.chip,
  g10_math_m2: GRADE_COLORS.class10.chip,
  g10_polynomials: GRADE_COLORS.class10.chip,
  g10_linear_eqns_2var: GRADE_COLORS.class10.chip,
  g10_triangles: GRADE_COLORS.class10.chip,
  g10_trig_applications: GRADE_COLORS.class10.chip,
  g10_areas_circle: GRADE_COLORS.class10.chip,
  g10_surface_volume: GRADE_COLORS.class10.chip,
  g10_statistics_grouped: GRADE_COLORS.class10.chip,
  g10_probability: GRADE_COLORS.class10.chip,
  // Class 11 — violet.
  g11_math_starter: GRADE_COLORS.class11.chip,
  g11_math_m2: GRADE_COLORS.class11.chip,
  g11_relations_functions_ext: GRADE_COLORS.class11.chip,
  g11_trig_functions: GRADE_COLORS.class11.chip,
  g11_linear_inequalities: GRADE_COLORS.class11.chip,
  g11_permutations_combinations: GRADE_COLORS.class11.chip,
  g11_binomial_theorem: GRADE_COLORS.class11.chip,
  g11_conic_sections: GRADE_COLORS.class11.chip,
  g11_limits_derivatives: GRADE_COLORS.class11.chip,
  g11_probability: GRADE_COLORS.class11.chip,
  // Class 12 — fuchsia.
  g12_math_starter: GRADE_COLORS.class12.chip,
  g12_math_m2: GRADE_COLORS.class12.chip,
  g12_relations_functions: GRADE_COLORS.class12.chip,
  g12_inverse_trig: GRADE_COLORS.class12.chip,
  g12_apps_derivatives: GRADE_COLORS.class12.chip,
  g12_apps_integrals: GRADE_COLORS.class12.chip,
  g12_differential_eqns: GRADE_COLORS.class12.chip,
  g12_geometry_3d: GRADE_COLORS.class12.chip,
  g12_linear_programming: GRADE_COLORS.class12.chip,
  g12_probability: GRADE_COLORS.class12.chip,
};

export const FULL_MIXED_CHIP_CLASS = 'bg-slate-100 text-slate-700 ring-slate-200';

// Look up the right chip class for any SkillMode (a single skill, a
// module-mixed mode, or the all-modules 'mixed' mode).
export const skillChipClass = (mode: SkillMode): string => {
  if (mode === 'mixed') return FULL_MIXED_CHIP_CLASS;
  const module = moduleForSkillMode(mode);
  return module ? MODULE_CHIP_CLASS[module] : FULL_MIXED_CHIP_CLASS;
};

// v0.37 — a small grade badge used at the top of dashboards and picker
// results so students instantly see "which class am I in?" without
// scanning module names.
export function GradeBadge({ moduleId }: { moduleId: ModuleId }) {
  const grade = MODULE_GRADE[moduleId];
  const color = GRADE_COLORS[grade];
  const label = `Class ${grade.replace('class', '')}`;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${color.chip}`}
    >
      {label}
    </span>
  );
}

// Small inline skill-mode chip used on session rows and result headers.
export function SkillChip({ mode }: { mode: SkillMode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${skillChipClass(
        mode
      )}`}
      title={SKILL_MODE_DESCRIPTIONS[mode]}
    >
      {SKILL_MODE_LABELS[mode]}
    </span>
  );
}
