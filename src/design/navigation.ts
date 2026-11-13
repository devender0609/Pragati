// v0.46 Checkpoint 1 & 3 — canonical navigation model.
//
// The App.tsx View union has 22 members mixing student, teacher,
// session, and admin flows in one flat namespace. Milestone 1 asks
// for at most 4 student and 5 teacher primary destinations. This
// module defines those destinations as data so future refactors can
// migrate the flat union onto a proper router without changing the
// IA contract.
//
// NOTE — v0.46 does NOT ship the router migration itself. It ships
// the model + the standardised labels used by the new StudentHome
// primary-nav tabs. Existing view IDs continue to work.

// ----- Student -----------------------------------------------------------

export type StudentPrimaryDestination =
  | 'home'
  | 'learn'
  | 'practice'
  | 'progress';

export const STUDENT_PRIMARY_LABEL: Record<StudentPrimaryDestination, string> = {
  home: 'Home',
  learn: 'Learn',
  practice: 'Practice',
  progress: 'Progress',
};

export const STUDENT_PRIMARY_DESCRIPTION: Record<StudentPrimaryDestination, string> = {
  home: 'Continue where you left off, see what is next, and pick up assignments.',
  learn: 'Browse chapters for your class — read, watch, practice.',
  practice: 'Short practice sets by chapter or by skill.',
  progress: 'How much you have learned this week and this year.',
};

export const STUDENT_PRIMARY_DESTINATIONS: StudentPrimaryDestination[] = [
  'home', 'learn', 'practice', 'progress',
];

// ----- Teacher -----------------------------------------------------------

export type TeacherPrimaryDestination =
  | 'overview'
  | 'classes'
  | 'assign'
  | 'insights'
  | 'resources';

export const TEACHER_PRIMARY_LABEL: Record<TeacherPrimaryDestination, string> = {
  overview: 'Overview',
  classes: 'Classes',
  assign: 'Assign',
  insights: 'Insights',
  resources: 'Resources',
};

/**
 * v0.78 §17 — NAVIGATION COPY, REWRITTEN AGAINST WHAT THE SCREENS DO.
 *
 * Insights said "Class-level growth, weak concepts, and misconceptions."
 * Pragati computes none of those. "Class-level growth" is a measurement
 * claim requiring a calibrated instrument across time, which is the
 * frozen Growth track; "weak concepts" asserts a diagnosis from response
 * counts. The screen shows recent activity, what was worked on, and
 * response patterns where the items support the inference — so that is
 * what the description now says.
 *
 * Overview promised "who needs attention", which reads as a computed
 * flag list. It surfaces the students the recorded evidence actually
 * names, and nothing when there is none.
 */
export const TEACHER_PRIMARY_DESCRIPTION: Record<TeacherPrimaryDestination, string> = {
  overview: 'What you can do today, what students have worked on, and what is ready to assign.',
  classes: 'Your classes and the students in them.',
  assign: 'Give a class or a student a lesson, practice, or a check.',
  insights: 'Recent activity, what was worked on, and where responses suggest a closer look.',
  resources: 'The official curriculum, what Pragati has for it, and what is being prepared.',
};

export const TEACHER_PRIMARY_DESTINATIONS: TeacherPrimaryDestination[] = [
  'overview', 'classes', 'assign', 'insights', 'resources',
];

// ----- Admin / Research (kept off the standard teacher nav) ------------

export type AdminResearchDestination =
  | 'pilot_setup'
  | 'pilot_report'
  | 'item_review'
  | 'alignment_review'
  | 'imported_submissions'
  | 'curriculum_coverage'
  | 'workflow_test'
  | 'exports';

export const ADMIN_RESEARCH_LABEL: Record<AdminResearchDestination, string> = {
  pilot_setup: 'Pilot setup',
  pilot_report: 'Pilot report',
  item_review: 'Item review',
  alignment_review: 'Alignment review',
  imported_submissions: 'Imported submissions',
  curriculum_coverage: 'Curriculum coverage',
  workflow_test: 'Workflow test',
  exports: 'Exports',
};

export const ADMIN_RESEARCH_DESTINATIONS: AdminResearchDestination[] = [
  'pilot_setup', 'pilot_report', 'item_review', 'alignment_review',
  'imported_submissions', 'curriculum_coverage', 'workflow_test', 'exports',
];
