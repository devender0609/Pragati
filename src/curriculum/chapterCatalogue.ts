// v0.46 Checkpoint 5 — Chapter catalogue schema + shell rows.
//
// This file is the authoritative record of what chapters Pragati
// claims to cover, distinct from the runtime item bank. It is the
// backbone the Curriculum Coverage admin page reads from.
//
// HONESTY CONTRACT:
//   Every row starts as sourceVerificationStatus = 'needs_verification'.
//   The claim is only that "some module in Pragati is currently
//   labelled as if it belongs to <grade>". It is NOT a claim that
//   the chapter number, title, or content matches an authoritative
//   NCERT/CBSE textbook.
//
//   Fields that MUST be verified against a source PDF before the row
//   can be upgraded past 'needs_verification':
//     - officialChapterNumber
//     - officialChapterTitle
//     - textbookSource
//     - textbookEdition
//
//   Content-authoring completeness (contentStatus) is tracked
//   independently from source verification.
//
// The catalogue does not fabricate NCERT chapter numbers. Where the
// current Pragati module title happens to mention a chapter number,
// we record it as `claimedChapterNumber` (an unverified inherited
// claim from earlier iterations) and leave `officialChapterNumber`
// null until a human confirms it against a PDF.

export type SourceVerificationStatus =
  /** No verification against an authoritative source has been done. */
  | 'needs_verification'
  /** A reviewer has cross-checked chapter number and title with a
   *  named NCERT/CBSE source document and edition. */
  | 'source_verified'
  /** Source verified AND a teacher has confirmed the chapter's
   *  learning outcomes match the mapping. */
  | 'teacher_verified';

export type ContentStatus =
  /** Registry has no module for this chapter yet. */
  | 'missing'
  /** Module + skill map exist but no items. */
  | 'shell_only'
  /** Items exist but no hand-authored lessons or worked examples. */
  | 'assessment_only'
  /** Hand-authored lessons exist but no items. */
  | 'lesson_only'
  /** Both items and lessons exist, at prototype quality (v0.36 default). */
  | 'partial'
  /** Prototype items and either hand-authored or synthesised lessons
   *  present for every skill. */
  | 'prototype_complete'
  /** Teacher has walked the chapter and marked it reviewed. */
  | 'teacher_reviewed'
  /** Chapter has been trialled in a real classroom. */
  | 'pilot_ready'
  /** Chapter has completed pilot review and is stable. */
  | 'published';

export type ChapterCatalogueRow = {
  /** Stable ID that survives future NCERT edition changes. */
  chapterId: string;

  grade:
    | 'grade_01' | 'grade_02' | 'grade_03' | 'grade_04' | 'grade_05'
    | 'grade_06' | 'grade_07' | 'grade_08' | 'grade_09' | 'grade_10'
    | 'grade_11' | 'grade_12';
  subject: 'mathematics';

  /** Chapter number claimed by the current Pragati module title.
   *  Unverified inherited claim. Null if no claim. */
  claimedChapterNumber: number | null;
  /** Chapter title used by the current Pragati module. Unverified. */
  claimedChapterTitle: string;

  /** Official chapter number from an authoritative NCERT/CBSE source.
   *  MUST stay null until sourceVerificationStatus advances. */
  officialChapterNumber: number | null;
  /** Official chapter title from the source. MUST stay null until
   *  sourceVerificationStatus advances. */
  officialChapterTitle: string | null;
  /** Named source document, e.g. "NCERT Mathematics Class 10 Textbook".
   *  MUST stay null until sourceVerificationStatus advances. */
  textbookSource: string | null;
  /** Edition or academic year, e.g. "2023-24" or "Revised 2023". */
  textbookEdition: string | null;
  /** URL or physical page reference to the authoritative source, if
   *  the reviewer captured one. */
  sourceReference: string | null;
  /** ISO date (YYYY-MM-DD) when the source verification was performed. */
  sourceVerifiedDate: string | null;

  sourceVerificationStatus: SourceVerificationStatus;

  /** Pragati module ID this chapter maps to. Null if no registered
   *  module (chapter is a shell only). */
  registryModuleId: string | null;

  /** Rollup content status, updated by scripts / manual edits. */
  contentStatus: ContentStatus;

  /** Free-text notes for reviewers. Not shown to students. */
  notes: string;
};

// ---------------------------------------------------------------------------
// Seed rows.
//
// One row per module currently registered. Fields sourced from the
// existing MODULE_LABELS / MODULE_DESCRIPTIONS in src/types.ts.
// EVERY row starts sourceVerificationStatus = 'needs_verification'
// and officialChapterNumber = null. A future authoring pass upgrades
// them as source PDFs are consulted.
// ---------------------------------------------------------------------------

function row(args: {
  chapterId: string;
  grade: ChapterCatalogueRow['grade'];
  claimedChapterNumber: number | null;
  claimedChapterTitle: string;
  registryModuleId: string | null;
  contentStatus: ContentStatus;
  notes?: string;
}): ChapterCatalogueRow {
  return {
    chapterId: args.chapterId,
    grade: args.grade,
    subject: 'mathematics',
    claimedChapterNumber: args.claimedChapterNumber,
    claimedChapterTitle: args.claimedChapterTitle,
    officialChapterNumber: null,
    officialChapterTitle: null,
    textbookSource: null,
    textbookEdition: null,
    sourceReference: null,
    sourceVerifiedDate: null,
    sourceVerificationStatus: 'needs_verification',
    registryModuleId: args.registryModuleId,
    contentStatus: args.contentStatus,
    notes: args.notes ?? '',
  };
}

export const CHAPTER_CATALOGUE: ChapterCatalogueRow[] = [
  // ----- Class 1 -----
  row({ chapterId: 'g01_counting_addition_subtraction',
        grade: 'grade_01', claimedChapterNumber: null,
        claimedChapterTitle: 'Counting up to 20 & single-digit +/-',
        registryModuleId: 'g1_math_starter', contentStatus: 'partial',
        notes: 'v0.29 starter — module 1 for Class 1.' }),
  row({ chapterId: 'g01_shapes_measurement_money',
        grade: 'grade_01', claimedChapterNumber: null,
        claimedChapterTitle: 'Shapes, Measurement & Money',
        registryModuleId: 'g1_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g01_numbers_21_99',
        grade: 'grade_01', claimedChapterNumber: null,
        claimedChapterTitle: 'Numbers 21 to 99',
        registryModuleId: 'g1_numbers_21_99', contentStatus: 'partial' }),
  row({ chapterId: 'g01_add_sub_50',
        grade: 'grade_01', claimedChapterNumber: null,
        claimedChapterTitle: 'Addition & Subtraction up to 50',
        registryModuleId: 'g1_add_sub_50', contentStatus: 'partial' }),
  row({ chapterId: 'g01_time_basics',
        grade: 'grade_01', claimedChapterNumber: null,
        claimedChapterTitle: 'Time basics',
        registryModuleId: 'g1_time_basics', contentStatus: 'partial' }),
  row({ chapterId: 'g01_measurement_basics',
        grade: 'grade_01', claimedChapterNumber: null,
        claimedChapterTitle: 'Measurement basics',
        registryModuleId: 'g1_measurement_basics', contentStatus: 'partial' }),

  // ----- Class 2 -----
  row({ chapterId: 'g02_place_value_2digit',
        grade: 'grade_02', claimedChapterNumber: null,
        claimedChapterTitle: 'Place value up to 99 + 2-digit arithmetic',
        registryModuleId: 'g2_math_starter', contentStatus: 'partial' }),
  row({ chapterId: 'g02_mult_money_time',
        grade: 'grade_02', claimedChapterNumber: null,
        claimedChapterTitle: 'Multiplication, Money & Measurement',
        registryModuleId: 'g2_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g02_numbers_999',
        grade: 'grade_02', claimedChapterNumber: null,
        claimedChapterTitle: 'Numbers up to 999 & 3-digit arithmetic',
        registryModuleId: 'g2_numbers_999', contentStatus: 'partial' }),
  row({ chapterId: 'g02_tables_division',
        grade: 'grade_02', claimedChapterNumber: null,
        claimedChapterTitle: 'Multiplication tables and division intro',
        registryModuleId: 'g2_tables_division', contentStatus: 'partial' }),
  row({ chapterId: 'g02_fractions_measurement',
        grade: 'grade_02', claimedChapterNumber: null,
        claimedChapterTitle: 'Fractions intro and length/weight',
        registryModuleId: 'g2_fractions_measurement', contentStatus: 'partial' }),
  row({ chapterId: 'g02_capacity_data_shapes',
        grade: 'grade_02', claimedChapterNumber: null,
        claimedChapterTitle: 'Capacity, pictographs, and 3D shapes',
        registryModuleId: 'g2_capacity_data_shapes', contentStatus: 'partial' }),

  // ----- Class 3 -----
  row({ chapterId: 'g03_tables_division_basics',
        grade: 'grade_03', claimedChapterNumber: null,
        claimedChapterTitle: 'Multiplication tables 2–5 & division basics',
        registryModuleId: 'g3_math_starter', contentStatus: 'partial' }),
  row({ chapterId: 'g03_fractions_arithmetic_length',
        grade: 'grade_03', claimedChapterNumber: null,
        claimedChapterTitle: 'Fractions, multi-digit arithmetic & measurement',
        registryModuleId: 'g3_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g03_numbers_10000',
        grade: 'grade_03', claimedChapterNumber: null,
        claimedChapterTitle: 'Numbers up to 10,000 & 4-digit arithmetic',
        registryModuleId: 'g3_numbers_10000', contentStatus: 'partial' }),
  row({ chapterId: 'g03_tables_6to10',
        grade: 'grade_03', claimedChapterNumber: null,
        claimedChapterTitle: 'Multiplication tables 6–10 and division',
        registryModuleId: 'g3_tables_6to10', contentStatus: 'partial' }),
  row({ chapterId: 'g03_fractions_time_money',
        grade: 'grade_03', claimedChapterNumber: null,
        claimedChapterTitle: 'Fractions on line, time, money',
        registryModuleId: 'g3_fractions_time_money', contentStatus: 'partial' }),
  row({ chapterId: 'g03_weight_data_patterns',
        grade: 'grade_03', claimedChapterNumber: null,
        claimedChapterTitle: 'Weight, bar graphs, patterns',
        registryModuleId: 'g3_weight_data_patterns', contentStatus: 'partial' }),

  // ----- Class 4 -----
  row({ chapterId: 'g04_fractions_measurement_mult',
        grade: 'grade_04', claimedChapterNumber: null,
        claimedChapterTitle: 'Fractions & measurement + multi-digit multiplication',
        registryModuleId: 'g4_math_starter', contentStatus: 'partial' }),
  row({ chapterId: 'g04_lakh_division_decimals',
        grade: 'grade_04', claimedChapterNumber: null,
        claimedChapterTitle: 'Large numbers, division & decimals',
        registryModuleId: 'g4_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g04_numbers_99999_ops',
        grade: 'grade_04', claimedChapterNumber: null,
        claimedChapterTitle: 'Numbers up to 99,999 and long ×/÷',
        registryModuleId: 'g4_numbers_99999_ops', contentStatus: 'partial' }),
  row({ chapterId: 'g04_fractions_decimals',
        grade: 'grade_04', claimedChapterNumber: null,
        claimedChapterTitle: 'Fractions and decimals',
        registryModuleId: 'g4_fractions_decimals', contentStatus: 'partial' }),
  row({ chapterId: 'g04_perimeter_area_symmetry',
        grade: 'grade_04', claimedChapterNumber: null,
        claimedChapterTitle: 'Perimeter, area, symmetry',
        registryModuleId: 'g4_perimeter_area_symmetry', contentStatus: 'partial' }),
  row({ chapterId: 'g04_time_money_data',
        grade: 'grade_04', claimedChapterNumber: null,
        claimedChapterTitle: 'Time, money, data handling',
        registryModuleId: 'g4_time_money_data', contentStatus: 'partial' }),

  // ----- Class 5 -----
  row({ chapterId: 'g05_decimals_percentage_division',
        grade: 'grade_05', claimedChapterNumber: null,
        claimedChapterTitle: 'Decimals, percentage intro & long division',
        registryModuleId: 'g5_math_starter', contentStatus: 'partial' }),
  row({ chapterId: 'g05_fractions_area_data',
        grade: 'grade_05', claimedChapterNumber: null,
        claimedChapterTitle: 'Fractions, geometry & data',
        registryModuleId: 'g5_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g05_crore_hcf_lcm',
        grade: 'grade_05', claimedChapterNumber: null,
        claimedChapterTitle: 'Crore, HCF and LCM intro',
        registryModuleId: 'g5_crore_hcf_lcm', contentStatus: 'partial' }),
  row({ chapterId: 'g05_decimals_fractions_ops',
        grade: 'grade_05', claimedChapterNumber: null,
        claimedChapterTitle: 'Decimal and fraction operations',
        registryModuleId: 'g5_decimals_fractions_ops', contentStatus: 'partial' }),
  row({ chapterId: 'g05_percent_volume_angles',
        grade: 'grade_05', claimedChapterNumber: null,
        claimedChapterTitle: 'Percent, volume, angles',
        registryModuleId: 'g5_percent_volume_angles', contentStatus: 'partial' }),
  row({ chapterId: 'g05_data_word_problems',
        grade: 'grade_05', claimedChapterNumber: null,
        claimedChapterTitle: 'Data (mean) and word problems',
        registryModuleId: 'g5_data_word_problems', contentStatus: 'partial' }),

  // ----- Class 6 (the only grade with hand-authored lessons + reviewed items) -----
  row({ chapterId: 'g06_fractions', grade: 'grade_06',
        claimedChapterNumber: null, claimedChapterTitle: 'Fractions',
        registryModuleId: 'fractions', contentStatus: 'prototype_complete',
        notes: 'Reference chapter for the Chapter Landing prototype (v0.46 Checkpoint 3).' }),
  row({ chapterId: 'g06_decimals', grade: 'grade_06',
        claimedChapterNumber: null, claimedChapterTitle: 'Decimals',
        registryModuleId: 'decimals', contentStatus: 'prototype_complete' }),
  row({ chapterId: 'g06_factors_multiples', grade: 'grade_06',
        claimedChapterNumber: null, claimedChapterTitle: 'Factors & Multiples',
        registryModuleId: 'factors_multiples', contentStatus: 'prototype_complete' }),
  row({ chapterId: 'g06_ratio_proportion', grade: 'grade_06',
        claimedChapterNumber: null, claimedChapterTitle: 'Ratio & Proportion',
        registryModuleId: 'ratio_proportion', contentStatus: 'prototype_complete' }),
  row({ chapterId: 'g06_algebra_basics', grade: 'grade_06',
        claimedChapterNumber: null, claimedChapterTitle: 'Algebra Basics',
        registryModuleId: 'algebra', contentStatus: 'prototype_complete' }),
  row({ chapterId: 'g06_geometry_basics', grade: 'grade_06',
        claimedChapterNumber: null, claimedChapterTitle: 'Geometry Basics',
        registryModuleId: 'geometry', contentStatus: 'prototype_complete' }),

  // ----- Class 7 -----
  row({ chapterId: 'g07_integers_rational', grade: 'grade_07',
        claimedChapterNumber: null, claimedChapterTitle: 'Integers & Rational Numbers',
        registryModuleId: 'c7_integers', contentStatus: 'partial' }),
  row({ chapterId: 'g07_fractions_ext', grade: 'grade_07',
        claimedChapterNumber: null, claimedChapterTitle: 'Fractions & Decimals Extension',
        registryModuleId: 'c7_fractions_ext', contentStatus: 'partial' }),
  row({ chapterId: 'g07_algebra_ext', grade: 'grade_07',
        claimedChapterNumber: null, claimedChapterTitle: 'Algebraic Expressions & Simple Equations',
        registryModuleId: 'c7_algebra_ext', contentStatus: 'partial' }),
  row({ chapterId: 'g07_lines_angles', grade: 'grade_07',
        claimedChapterNumber: null, claimedChapterTitle: 'Lines & Angles',
        registryModuleId: 'c7_lines_angles', contentStatus: 'partial' }),
  row({ chapterId: 'g07_comparing_quantities', grade: 'grade_07',
        claimedChapterNumber: null, claimedChapterTitle: 'Comparing Quantities',
        registryModuleId: 'c7_comparing_quantities', contentStatus: 'partial' }),
  row({ chapterId: 'g07_data_handling', grade: 'grade_07',
        claimedChapterNumber: null, claimedChapterTitle: 'Data Handling Basics',
        registryModuleId: 'c7_data_handling', contentStatus: 'partial' }),

  // ----- Class 8 — claimed chapter numbers inherited from MODULE_LABELS -----
  row({ chapterId: 'g08_rational_linear', grade: 'grade_08',
        claimedChapterNumber: null, claimedChapterTitle: 'Rational Numbers & Linear Equations',
        registryModuleId: 'g8_math_starter', contentStatus: 'partial' }),
  row({ chapterId: 'g08_area_bar_identities', grade: 'grade_08',
        claimedChapterNumber: null, claimedChapterTitle: 'Mensuration, Data Handling & Algebraic Expressions',
        registryModuleId: 'g8_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g08_quadrilaterals', grade: 'grade_08',
        claimedChapterNumber: 3, claimedChapterTitle: 'Understanding Quadrilaterals',
        registryModuleId: 'g8_quadrilaterals', contentStatus: 'partial',
        notes: 'Chapter number inherited from v0.33 MODULE_LABELS; not verified against source.' }),
  row({ chapterId: 'g08_data_handling_ext', grade: 'grade_08',
        claimedChapterNumber: 5, claimedChapterTitle: 'Data Handling (extended)',
        registryModuleId: 'g8_data_handling_ext', contentStatus: 'partial' }),
  row({ chapterId: 'g08_comparing_quantities_ext', grade: 'grade_08',
        claimedChapterNumber: 8, claimedChapterTitle: 'Comparing Quantities',
        registryModuleId: 'g8_comparing_quantities_ext', contentStatus: 'partial' }),
  row({ chapterId: 'g08_algebraic_expressions_ext', grade: 'grade_08',
        claimedChapterNumber: 9, claimedChapterTitle: 'Algebraic Expressions and Identities',
        registryModuleId: 'g8_algebraic_expressions_ext', contentStatus: 'partial' }),
  row({ chapterId: 'g08_mensuration_ext', grade: 'grade_08',
        claimedChapterNumber: 11, claimedChapterTitle: 'Mensuration (extended)',
        registryModuleId: 'g8_mensuration_ext', contentStatus: 'partial' }),
  row({ chapterId: 'g08_exponents_powers', grade: 'grade_08',
        claimedChapterNumber: 12, claimedChapterTitle: 'Exponents and Powers',
        registryModuleId: 'g8_exponents_powers', contentStatus: 'partial' }),
  row({ chapterId: 'g08_proportions', grade: 'grade_08',
        claimedChapterNumber: 13, claimedChapterTitle: 'Direct and Inverse Proportions',
        registryModuleId: 'g8_proportions', contentStatus: 'partial' }),
  row({ chapterId: 'g08_intro_graphs', grade: 'grade_08',
        claimedChapterNumber: 15, claimedChapterTitle: 'Introduction to Graphs',
        registryModuleId: 'g8_intro_graphs', contentStatus: 'partial' }),

  // ----- Class 9 -----
  row({ chapterId: 'g09_number_polynomials', grade: 'grade_09',
        claimedChapterNumber: null, claimedChapterTitle: 'Number Systems & Polynomials',
        registryModuleId: 'g9_math_starter', contentStatus: 'partial' }),
  row({ chapterId: 'g09_linear_2var_congruence_stats', grade: 'grade_09',
        claimedChapterNumber: null, claimedChapterTitle: 'Linear Eqns in 2 Var, Triangles & Statistics',
        registryModuleId: 'g9_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g09_lines_angles', grade: 'grade_09',
        claimedChapterNumber: 6, claimedChapterTitle: 'Lines and Angles',
        registryModuleId: 'g9_lines_angles', contentStatus: 'partial' }),
  row({ chapterId: 'g09_quadrilaterals', grade: 'grade_09',
        claimedChapterNumber: 8, claimedChapterTitle: 'Quadrilaterals',
        registryModuleId: 'g9_quadrilaterals', contentStatus: 'partial' }),
  row({ chapterId: 'g09_areas_parallelograms_triangles', grade: 'grade_09',
        claimedChapterNumber: 9, claimedChapterTitle: 'Areas of Parallelograms and Triangles',
        registryModuleId: 'g9_areas_parallelograms_triangles', contentStatus: 'partial' }),
  row({ chapterId: 'g09_circles', grade: 'grade_09',
        claimedChapterNumber: 10, claimedChapterTitle: 'Circles',
        registryModuleId: 'g9_circles', contentStatus: 'partial' }),
  row({ chapterId: 'g09_herons_formula', grade: 'grade_09',
        claimedChapterNumber: 12, claimedChapterTitle: "Heron's Formula",
        registryModuleId: 'g9_herons_formula', contentStatus: 'partial' }),
  row({ chapterId: 'g09_surface_volume', grade: 'grade_09',
        claimedChapterNumber: 13, claimedChapterTitle: 'Surface Areas and Volumes',
        registryModuleId: 'g9_surface_volume', contentStatus: 'partial' }),
  row({ chapterId: 'g09_probability', grade: 'grade_09',
        claimedChapterNumber: 15, claimedChapterTitle: 'Probability',
        registryModuleId: 'g9_probability', contentStatus: 'partial' }),
  row({ chapterId: 'g09_euclid_rationalisation', grade: 'grade_09',
        claimedChapterNumber: null,
        claimedChapterTitle: "Euclid's Geometry + Rationalisation",
        registryModuleId: 'g9_euclid_rationalisation', contentStatus: 'partial',
        notes: 'Two topics bundled — split candidate.' }),

  // ----- Class 10 -----
  row({ chapterId: 'g10_real_numbers_quadratics_trig', grade: 'grade_10',
        claimedChapterNumber: null, claimedChapterTitle: 'Real Numbers, Quadratics & Trig',
        registryModuleId: 'g10_math_starter', contentStatus: 'partial' }),
  row({ chapterId: 'g10_coord_ap_circles', grade: 'grade_10',
        claimedChapterNumber: null, claimedChapterTitle: 'Coordinate Geometry, AP & Circles',
        registryModuleId: 'g10_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g10_polynomials', grade: 'grade_10',
        claimedChapterNumber: 2, claimedChapterTitle: 'Polynomials',
        registryModuleId: 'g10_polynomials', contentStatus: 'partial' }),
  row({ chapterId: 'g10_linear_eqns_2var', grade: 'grade_10',
        claimedChapterNumber: 3, claimedChapterTitle: 'Pair of Linear Equations in Two Variables',
        registryModuleId: 'g10_linear_eqns_2var', contentStatus: 'partial' }),
  row({ chapterId: 'g10_triangles', grade: 'grade_10',
        claimedChapterNumber: 6, claimedChapterTitle: 'Triangles / Similarity',
        registryModuleId: 'g10_triangles', contentStatus: 'partial' }),
  row({ chapterId: 'g10_trig_applications', grade: 'grade_10',
        claimedChapterNumber: 9, claimedChapterTitle: 'Applications of Trigonometry',
        registryModuleId: 'g10_trig_applications', contentStatus: 'partial' }),
  row({ chapterId: 'g10_areas_circle', grade: 'grade_10',
        claimedChapterNumber: 11, claimedChapterTitle: 'Areas Related to Circles',
        registryModuleId: 'g10_areas_circle', contentStatus: 'partial' }),
  row({ chapterId: 'g10_surface_volume', grade: 'grade_10',
        claimedChapterNumber: 12, claimedChapterTitle: 'Surface Areas and Volumes',
        registryModuleId: 'g10_surface_volume', contentStatus: 'partial' }),
  row({ chapterId: 'g10_statistics_grouped', grade: 'grade_10',
        claimedChapterNumber: 13, claimedChapterTitle: 'Statistics (grouped data)',
        registryModuleId: 'g10_statistics_grouped', contentStatus: 'partial' }),
  row({ chapterId: 'g10_probability', grade: 'grade_10',
        claimedChapterNumber: 14, claimedChapterTitle: 'Probability',
        registryModuleId: 'g10_probability', contentStatus: 'partial' }),

  // ----- Class 11 -----
  row({ chapterId: 'g11_sets_functions_trig', grade: 'grade_11',
        claimedChapterNumber: null, claimedChapterTitle: 'Sets, Functions & Trigonometry',
        registryModuleId: 'g11_math_starter', contentStatus: 'partial' }),
  row({ chapterId: 'g11_complex_gp_lines', grade: 'grade_11',
        claimedChapterNumber: null, claimedChapterTitle: 'Complex Numbers, Sequences & Straight Lines',
        registryModuleId: 'g11_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g11_relations_functions_ext', grade: 'grade_11',
        claimedChapterNumber: 2, claimedChapterTitle: 'Relations and Functions (extended)',
        registryModuleId: 'g11_relations_functions_ext', contentStatus: 'partial' }),
  row({ chapterId: 'g11_trig_functions', grade: 'grade_11',
        claimedChapterNumber: 3, claimedChapterTitle: 'Trigonometric Functions',
        registryModuleId: 'g11_trig_functions', contentStatus: 'partial' }),
  row({ chapterId: 'g11_linear_inequalities', grade: 'grade_11',
        claimedChapterNumber: 6, claimedChapterTitle: 'Linear Inequalities',
        registryModuleId: 'g11_linear_inequalities', contentStatus: 'partial' }),
  row({ chapterId: 'g11_permutations_combinations', grade: 'grade_11',
        claimedChapterNumber: 7, claimedChapterTitle: 'Permutations and Combinations',
        registryModuleId: 'g11_permutations_combinations', contentStatus: 'partial' }),
  row({ chapterId: 'g11_binomial_theorem', grade: 'grade_11',
        claimedChapterNumber: 8, claimedChapterTitle: 'Binomial Theorem',
        registryModuleId: 'g11_binomial_theorem', contentStatus: 'partial' }),
  row({ chapterId: 'g11_conic_sections', grade: 'grade_11',
        claimedChapterNumber: 11, claimedChapterTitle: 'Conic Sections',
        registryModuleId: 'g11_conic_sections', contentStatus: 'partial' }),
  row({ chapterId: 'g11_limits_derivatives', grade: 'grade_11',
        claimedChapterNumber: 13, claimedChapterTitle: 'Limits and Derivatives',
        registryModuleId: 'g11_limits_derivatives', contentStatus: 'partial' }),
  row({ chapterId: 'g11_probability', grade: 'grade_11',
        claimedChapterNumber: 16, claimedChapterTitle: 'Probability',
        registryModuleId: 'g11_probability', contentStatus: 'partial' }),

  // ----- Class 12 -----
  row({ chapterId: 'g12_matrices_derivatives_integrals', grade: 'grade_12',
        claimedChapterNumber: null,
        claimedChapterTitle: 'Matrices, Derivatives & Integrals',
        registryModuleId: 'g12_math_starter', contentStatus: 'partial' }),
  row({ chapterId: 'g12_determinants_continuity_vectors', grade: 'grade_12',
        claimedChapterNumber: null,
        claimedChapterTitle: 'Determinants, Continuity & Vectors',
        registryModuleId: 'g12_math_m2', contentStatus: 'partial' }),
  row({ chapterId: 'g12_relations_functions', grade: 'grade_12',
        claimedChapterNumber: 1, claimedChapterTitle: 'Relations and Functions',
        registryModuleId: 'g12_relations_functions', contentStatus: 'partial' }),
  row({ chapterId: 'g12_inverse_trig', grade: 'grade_12',
        claimedChapterNumber: 2, claimedChapterTitle: 'Inverse Trigonometric Functions',
        registryModuleId: 'g12_inverse_trig', contentStatus: 'partial' }),
  row({ chapterId: 'g12_apps_derivatives', grade: 'grade_12',
        claimedChapterNumber: 6, claimedChapterTitle: 'Applications of Derivatives',
        registryModuleId: 'g12_apps_derivatives', contentStatus: 'partial' }),
  row({ chapterId: 'g12_apps_integrals', grade: 'grade_12',
        claimedChapterNumber: 8, claimedChapterTitle: 'Applications of Integrals',
        registryModuleId: 'g12_apps_integrals', contentStatus: 'partial' }),
  row({ chapterId: 'g12_differential_eqns', grade: 'grade_12',
        claimedChapterNumber: 9, claimedChapterTitle: 'Differential Equations',
        registryModuleId: 'g12_differential_eqns', contentStatus: 'partial' }),
  row({ chapterId: 'g12_geometry_3d', grade: 'grade_12',
        claimedChapterNumber: 11, claimedChapterTitle: 'Three-dimensional Geometry',
        registryModuleId: 'g12_geometry_3d', contentStatus: 'partial' }),
  row({ chapterId: 'g12_linear_programming', grade: 'grade_12',
        claimedChapterNumber: 12, claimedChapterTitle: 'Linear Programming',
        registryModuleId: 'g12_linear_programming', contentStatus: 'partial' }),
  row({ chapterId: 'g12_probability', grade: 'grade_12',
        claimedChapterNumber: 13, claimedChapterTitle: 'Probability',
        registryModuleId: 'g12_probability', contentStatus: 'partial' }),
];

// ---------------------------------------------------------------------------
// Aggregators — used by the Curriculum Coverage admin page.
// ---------------------------------------------------------------------------

export function chaptersForGrade(
  grade: ChapterCatalogueRow['grade']
): ChapterCatalogueRow[] {
  return CHAPTER_CATALOGUE.filter((c) => c.grade === grade);
}

export function coverageSummary() {
  const bySource: Record<SourceVerificationStatus, number> = {
    needs_verification: 0,
    source_verified: 0,
    teacher_verified: 0,
  };
  const byContent: Record<ContentStatus, number> = {
    missing: 0, shell_only: 0, assessment_only: 0, lesson_only: 0,
    partial: 0, prototype_complete: 0, teacher_reviewed: 0,
    pilot_ready: 0, published: 0,
  };
  for (const c of CHAPTER_CATALOGUE) {
    bySource[c.sourceVerificationStatus]++;
    byContent[c.contentStatus]++;
  }
  return { total: CHAPTER_CATALOGUE.length, bySource, byContent };
}
