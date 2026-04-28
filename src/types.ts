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
// Skills (Class 6 Fractions Module)
// ---------------------------------------------------------------------------
// As of v0.5 the bank covers seven fraction skills. A Session can target one
// skill or a "mixed" pool drawn across the whole module. Old (v0.3/v0.4)
// sessions in localStorage have skillId === 'FR.06', 'FR.07', or 'mixed',
// all still valid SkillMode values, so no migration is required.

export type SkillId =
  | 'FR.02'
  | 'FR.03'
  | 'FR.04'
  | 'FR.05'
  | 'FR.06'
  | 'FR.07'
  | 'FR.08';
export type SkillMode = SkillId | 'mixed';

// Ordered for consistent UI rendering across the Fractions Module
// (Learn dashboard, skill cards, dropdowns).
export const SKILL_IDS_ORDERED: SkillId[] = [
  'FR.02',
  'FR.03',
  'FR.04',
  'FR.05',
  'FR.06',
  'FR.07',
  'FR.08',
];

export const SKILL_LABELS: Record<SkillId, string> = {
  'FR.02': 'Represent fractions visually',
  'FR.03': 'Equivalent fractions',
  'FR.04': 'Mixed numbers and improper fractions',
  'FR.05': 'Add and subtract with like denominators',
  'FR.06': 'Add fractions with unlike denominators',
  'FR.07': 'Subtract fractions with unlike denominators',
  'FR.08': 'Fraction word problems',
};

// Short labels used on chips, dropdowns, and table cells.
export const SKILL_SHORT_LABELS: Record<SkillId, string> = {
  'FR.02': 'FR.02 — Visualise',
  'FR.03': 'FR.03 — Equivalent',
  'FR.04': 'FR.04 — Mixed/Improper',
  'FR.05': 'FR.05 — Like denominators',
  'FR.06': 'FR.06 — Add unlike',
  'FR.07': 'FR.07 — Subtract unlike',
  'FR.08': 'FR.08 — Word problems',
};

export const SKILL_MODE_LABELS: Record<SkillMode, string> = {
  ...SKILL_SHORT_LABELS,
  mixed: 'Mixed Fractions Assessment',
};

export const SKILL_MODE_DESCRIPTIONS: Record<SkillMode, string> = {
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
  mixed:
    'Mixed-skill session. Items are drawn from across the whole Class 6 Fractions Module; the per-skill breakdown appears on the results screen.',
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
