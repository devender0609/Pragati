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
  chosenIndex: number;
  correct: boolean;
  timeMs: number;
  difficultyAtAttempt: number; // the item's seed difficulty (1-10)
  abilityBefore: number;
  abilityAfter: number;
  misconceptionTriggered: MisconceptionCode;
};

// ---------------------------------------------------------------------------
// Session: one attempt at the assessment by one student
// ---------------------------------------------------------------------------
export type Session = {
  id: string;
  studentId: string;
  studentSnapshot: StudentSnapshot;
  window: AssessmentWindow;
  skillId: 'FR.06';
  startedAt: number;
  completedAt: number | null;
  responses: Response[];
  finalAbility: number; // running ability estimate at the end of the session
};
