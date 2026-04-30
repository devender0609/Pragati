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
};

// Snapshot of student attributes at the time of a particular session, in case
// the student record is later edited.
export type StudentSnapshot = {
  name: string;
  grade: string;
  school?: string;
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

export type ModuleId =
  | 'fractions'
  | 'decimals'
  | 'factors_multiples'
  | 'ratio_proportion';

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
  | 'RP.05';

// "Mixed within one module" modes. 'mixed' (without suffix) remains for
// the across-everything assessment, kept compatible with v0.5 / v0.6.
export type ModuleMixedMode =
  | 'mixed_fractions'
  | 'mixed_decimals'
  | 'mixed_factors_multiples'
  | 'mixed_ratio_proportion';

export type SkillMode = SkillId | 'mixed' | ModuleMixedMode;

export const MODULE_IDS_ORDERED: ModuleId[] = [
  'fractions',
  'decimals',
  'factors_multiples',
  'ratio_proportion',
];

export const SKILLS_BY_MODULE: Record<ModuleId, SkillId[]> = {
  fractions: ['FR.02', 'FR.03', 'FR.04', 'FR.05', 'FR.06', 'FR.07', 'FR.08'],
  decimals: ['DE.01', 'DE.02', 'DE.03', 'DE.04', 'DE.05'],
  factors_multiples: ['FM.03', 'FM.04', 'FM.06', 'FM.07', 'FM.08'],
  ratio_proportion: ['RP.01', 'RP.02', 'RP.03', 'RP.04', 'RP.05'],
};

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
};

const MODULE_MIXED_LABEL: Record<ModuleMixedMode, string> = {
  mixed_fractions: 'Mixed — Fractions',
  mixed_decimals: 'Mixed — Decimals',
  mixed_factors_multiples: 'Mixed — Factors & Multiples',
  mixed_ratio_proportion: 'Mixed — Ratio & Proportion',
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
  // Per-module mixed descriptions.
  ...MODULE_MIXED_DESC,
  // Class-6-Math-wide mixed.
  mixed:
    'Mixed-skill session drawn from across every Class 6 Math module (Fractions, Decimals, Factors & Multiples, Ratio & Proportion). The per-skill breakdown appears on the results screen.',
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
};
