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
// Skills
// ---------------------------------------------------------------------------
// Each Item belongs to exactly one skill. A Session can target one skill or
// a "mixed" pool drawn from both. Old (v0.3) sessions in localStorage have
// skillId === 'FR.06' which is still a valid SkillMode, so no migration is
// required.

export type SkillId = 'FR.06' | 'FR.07';
export type SkillMode = SkillId | 'mixed';

export const SKILL_LABELS: Record<SkillId, string> = {
  'FR.06': 'Add fractions with unlike denominators',
  'FR.07': 'Subtract fractions with unlike denominators',
};

export const SKILL_MODE_LABELS: Record<SkillMode, string> = {
  'FR.06': 'FR.06 — Add unlike',
  'FR.07': 'FR.07 — Subtract unlike',
  mixed: 'Mixed (FR.06 + FR.07)',
};

export const SKILL_MODE_DESCRIPTIONS: Record<SkillMode, string> = {
  'FR.06':
    'Adaptive session drawn only from the FR.06 bank (adding fractions with unlike denominators).',
  'FR.07':
    'Adaptive session drawn only from the FR.07 bank (subtracting fractions with unlike denominators).',
  mixed:
    'Mixed-skill session. Items are drawn from both FR.06 and FR.07 banks; the per-skill breakdown appears on the results screen.',
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
