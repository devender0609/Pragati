// Teacher workflow + pilot-readiness library (v0.11).
//
// Pure functions over the device's localStorage state. The Teacher Home
// renders these as:
//   - 6 ordered "workflow steps", each with a status (not_started /
//     in_progress / complete / needs_attention) and a CTA label.
//   - 7 readiness checklist rows with pass/fail + a small detail string.
//
// All thresholds are deliberate prototype heuristics. Their job is to
// guide a teacher through a credible pilot — not to make a calibrated
// "ready" claim.

import { ITEMS } from '../data/items';
import { buildItemAlignments } from '../data/alignment';
import {
  type AssessmentAssignment,
  type ItemReview,
  type PilotMetadata,
  type ReadinessCheck,
  type Session,
  type SessionFeedback,
  type WorkflowStep,
  type WorkflowStepStatus,
} from '../types';
import type { Classroom } from './cloudStore';
import { classifyCode, loadReviewedImports } from './accessCodes';

// Threshold: minimum number of completed sessions for the readiness
// checklist's "at least 5 student sessions" row.
const MIN_SESSIONS_FOR_READINESS = 5;

// ---------------------------------------------------------------------------
// Inputs (snapshot of the device state)
// ---------------------------------------------------------------------------
export type WorkflowState = {
  pilots: PilotMetadata[];
  activePilot: PilotMetadata | null;
  assignments: AssessmentAssignment[];
  activeAssignments: AssessmentAssignment[];
  sessions: Session[];
  completedSessions: Session[];
  itemReviews: ItemReview[];
  sessionFeedback: SessionFeedback[];
  lastExportedAt: number | null;
  // v0.22: classroom-code multi-device pilot checks. Optional so callers
  // built before v0.22 still type-check; readiness rows that need them
  // pass with `passed: false` and a "no data yet" detail.
  classrooms?: Classroom[];
};

// ---------------------------------------------------------------------------
// Workflow steps
// ---------------------------------------------------------------------------
// The order of steps is the recommended teacher flow:
//   1. Start or select pilot
//   2. Assign assessment
//   3. Review class results
//   4. View tomorrow's teaching plan
//   5. Review flagged items
//   6. Export pilot data

export const computeWorkflow = (state: WorkflowState): WorkflowStep[] => {
  const itemAlignmentById = buildItemAlignments(ITEMS);
  // Items the teacher should review: any item with audit flags OR
  // alignment confidence not 'high'.
  const flaggedItemIds = new Set<string>();
  for (const it of ITEMS) {
    const a = itemAlignmentById[it.id];
    if (
      a.alignmentConfidence !== 'high' ||
      (a.auditFlags && a.auditFlags.length > 0)
    ) {
      flaggedItemIds.add(it.id);
    }
  }
  const reviewById = new Map(state.itemReviews.map((r) => [r.itemId, r]));
  const flaggedReviewedCount = Array.from(flaggedItemIds).filter(
    (id) =>
      (reviewById.get(id)?.status ?? 'not_reviewed') !== 'not_reviewed'
  ).length;
  const reviewsCount = state.itemReviews.filter(
    (r) => r.status !== 'not_reviewed'
  ).length;

  // Step 1 — Pilot setup.
  const pilotStatus: WorkflowStepStatus = state.activePilot
    ? 'complete'
    : state.pilots.length > 0
      ? 'in_progress'   // had a pilot before, but not active now
      : 'not_started';

  // Step 2 — Assignment.
  const assignmentStatus: WorkflowStepStatus =
    state.activeAssignments.length > 0
      ? 'complete'
      : state.assignments.length > 0
        ? 'in_progress'
        : 'not_started';

  // Step 3 — Review results.
  // Marked complete once at least one completed session exists; needs
  // attention if there are sessions but no item reviews started.
  const completedCount = state.completedSessions.length;
  const reviewResultsStatus: WorkflowStepStatus =
    completedCount === 0
      ? 'not_started'
      : completedCount < MIN_SESSIONS_FOR_READINESS
        ? 'in_progress'
        : 'complete';

  // Step 4 — Teaching plan.
  // Same source data as step 3, but a separate UX target. Marked complete
  // when there are completed sessions to summarise.
  const teachingPlanStatus: WorkflowStepStatus =
    completedCount === 0 ? 'not_started' : 'complete';

  // Step 5 — Review flagged items.
  // not_started: no reviews yet
  // in_progress: some reviews but not all flagged ones
  // needs_attention: there are flagged items still un-reviewed AND there
  //   are sessions on this device (pilot context exists)
  // complete: every flagged item has a review
  let flaggedStatus: WorkflowStepStatus;
  if (flaggedItemIds.size === 0) {
    flaggedStatus = 'complete'; // no flagged items at all
  } else if (flaggedReviewedCount >= flaggedItemIds.size) {
    flaggedStatus = 'complete';
  } else if (reviewsCount === 0) {
    flaggedStatus = completedCount > 0 ? 'needs_attention' : 'not_started';
  } else {
    flaggedStatus = 'in_progress';
  }

  // Step 6 — Export.
  const exportStatus: WorkflowStepStatus =
    state.lastExportedAt !== null
      ? 'complete'
      : completedCount > 0
        ? 'in_progress'
        : 'not_started';

  const steps: WorkflowStep[] = [
    {
      id: 'pilot_setup',
      title: 'Start or select a pilot',
      subtitle: state.activePilot
        ? `${state.activePilot.teacherName} · ${state.activePilot.className} · ${state.activePilot.school}`
        : 'No pilot active yet',
      description:
        'Tag every session this run with a teacher / class / school context. Sessions started while a pilot is active carry the pilot id through to results, dashboards, and export.',
      status: pilotStatus,
      ctaLabel: state.activePilot ? 'Update pilot' : 'Start pilot',
    },
    {
      id: 'assignment',
      title: 'Assign an assessment',
      subtitle:
        state.activeAssignments.length > 0
          ? `${state.activeAssignments.length} active assignment${state.activeAssignments.length === 1 ? '' : 's'}`
          : 'No active assignments',
      description:
        "Pick a skill or module, decide the item count and a friendly title, and the student's home will surface it as the next thing to take.",
      status: assignmentStatus,
      ctaLabel:
        state.activeAssignments.length > 0
          ? 'Manage assignments'
          : 'Create assignment',
    },
    {
      id: 'review_results',
      title: 'Review class results',
      subtitle: `${completedCount} completed session${completedCount === 1 ? '' : 's'}`,
      description:
        'Open the per-student detail and the class-level dashboard to see who is where and which misconceptions are recurring.',
      status: reviewResultsStatus,
      ctaLabel: 'Open class dashboard',
    },
    {
      id: 'teaching_plan',
      title: "View tomorrow's teaching plan",
      subtitle:
        completedCount === 0
          ? 'No sessions yet'
          : "Auto-generated next-lesson plan",
      description:
        'Top 3 weakest skills, top 3 misconceptions, suggested small groups, recommended reteach skill, recommended practice items, students needing support.',
      status: teachingPlanStatus,
      ctaLabel: 'Open teaching plan',
    },
    {
      id: 'flagged_items',
      title: 'Review flagged items',
      subtitle:
        flaggedItemIds.size === 0
          ? 'No flagged items'
          : `${flaggedReviewedCount} / ${flaggedItemIds.size} flagged items reviewed`,
      description:
        'Items with audit flags or low alignment confidence need a teacher to read the stem, options, and worked solution before pilot use.',
      status: flaggedStatus,
      ctaLabel:
        flaggedReviewedCount >= flaggedItemIds.size
          ? 'Open item review'
          : 'Review flagged items',
    },
    {
      id: 'export',
      title: 'Export pilot data',
      subtitle: state.lastExportedAt
        ? `Last exported ${new Date(state.lastExportedAt).toLocaleString()}`
        : 'No export yet',
      description:
        'Bundle every student, session, item review, pilot, feedback, alignment snapshot, and item-quality flag into a single JSON file. Schema version 4.',
      status: exportStatus,
      ctaLabel: state.lastExportedAt ? 'Re-export JSON' : 'Export JSON',
    },
  ];

  return steps;
};

// Returns the first step that isn't yet 'complete', for the "next step"
// hero on the workflow home.
export const nextWorkflowStep = (steps: WorkflowStep[]): WorkflowStep | null => {
  for (const s of steps) {
    if (s.status !== 'complete') return s;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Pilot readiness checklist
// ---------------------------------------------------------------------------
export const buildReadiness = (state: WorkflowState): ReadinessCheck[] => {
  const itemAlignmentById = buildItemAlignments(ITEMS);
  const flaggedItemIds = new Set<string>();
  for (const it of ITEMS) {
    const a = itemAlignmentById[it.id];
    if (
      a.alignmentConfidence !== 'high' ||
      (a.auditFlags && a.auditFlags.length > 0)
    ) {
      flaggedItemIds.add(it.id);
    }
  }
  const reviewById = new Map(state.itemReviews.map((r) => [r.itemId, r]));
  const flaggedReviewedCount = Array.from(flaggedItemIds).filter(
    (id) =>
      (reviewById.get(id)?.status ?? 'not_reviewed') !== 'not_reviewed'
  ).length;
  const reviewsCount = state.itemReviews.filter(
    (r) => r.status !== 'not_reviewed'
  ).length;
  const completedCount = state.completedSessions.length;

  return [
    {
      id: 'pilot_metadata',
      label: 'Pilot metadata created',
      passed: state.pilots.length > 0,
      detail:
        state.pilots.length === 0
          ? 'No pilots yet — start one in the Pilot setup step.'
          : `${state.pilots.length} pilot record${state.pilots.length === 1 ? '' : 's'} on this device${state.activePilot ? ' (one active)' : ''}.`,
    },
    {
      id: 'assignment_created',
      label: 'At least one assessment assigned',
      passed: state.assignments.length > 0,
      detail:
        state.assignments.length === 0
          ? 'No assignments yet — create one to focus the next session.'
          : `${state.assignments.length} assignment${state.assignments.length === 1 ? '' : 's'} (${state.activeAssignments.length} active).`,
    },
    {
      id: 'sessions_5',
      label: `At least ${MIN_SESSIONS_FOR_READINESS} student sessions completed`,
      passed: completedCount >= MIN_SESSIONS_FOR_READINESS,
      detail: `${completedCount} completed session${completedCount === 1 ? '' : 's'} so far.`,
    },
    {
      id: 'feedback_collected',
      label: 'Student feedback collected on at least one session',
      passed: state.sessionFeedback.length > 0,
      detail:
        state.sessionFeedback.length === 0
          ? 'No feedback yet — students can submit on the Results page.'
          : `${state.sessionFeedback.length} feedback record${state.sessionFeedback.length === 1 ? '' : 's'} stored.`,
    },
    {
      id: 'reviews_started',
      label: 'Teacher item reviews started',
      passed: reviewsCount > 0,
      detail:
        reviewsCount === 0
          ? 'No item reviews started yet — visit Item Review.'
          : `${reviewsCount} item${reviewsCount === 1 ? '' : 's'} reviewed.`,
    },
    {
      id: 'flagged_reviewed',
      label: 'Flagged items reviewed',
      passed:
        flaggedItemIds.size === 0 ||
        flaggedReviewedCount >= flaggedItemIds.size,
      detail:
        flaggedItemIds.size === 0
          ? 'No items carry audit flags or low alignment confidence.'
          : `${flaggedReviewedCount} / ${flaggedItemIds.size} flagged items reviewed.`,
    },
    {
      id: 'export_ready',
      label: 'Export bundle ready',
      passed: state.lastExportedAt !== null,
      detail:
        state.lastExportedAt === null
          ? 'No export yet — use the Export pilot data step.'
          : `Last exported ${new Date(state.lastExportedAt).toLocaleString()}.`,
    },
    // v0.22: classroom-code multi-device readiness checks. These count
    // toward the headline only when at least one classroom has been
    // created; otherwise they show as "no data yet" and stay neutral.
    ...buildClassroomCodeReadiness(state),
  ];
};

function buildClassroomCodeReadiness(state: WorkflowState): ReadinessCheck[] {
  const classrooms = state.classrooms ?? [];

  // 1) At least one active (non-revoked, non-expired) classroom code.
  const activeCodes = classrooms.filter((c) => classifyCode(c) === 'active');
  const codeActive: ReadinessCheck = {
    id: 'classroom_code_active',
    label: 'At least one active classroom code',
    passed: activeCodes.length > 0,
    detail:
      classrooms.length === 0
        ? 'No classrooms yet — create one and generate a code from the Classrooms view.'
        : activeCodes.length === 0
          ? `${classrooms.length} classroom${classrooms.length === 1 ? '' : 's'} on this device, but no active code (all expired or revoked).`
          : `${activeCodes.length} active code${activeCodes.length === 1 ? '' : 's'}.`,
  };

  // 2) At least one active assignment bound to an active-code classroom.
  const activeCodeIds = new Set(activeCodes.map((c) => c.id));
  const publishedAssignments = state.activeAssignments.filter(
    (a) => a.classroomId && activeCodeIds.has(a.classroomId)
  );
  const assignmentPublished: ReadinessCheck = {
    id: 'assignment_published_to_code',
    label: 'At least one assignment published to a code',
    passed: publishedAssignments.length > 0,
    detail:
      activeCodes.length === 0
        ? 'Needs an active classroom code first.'
        : publishedAssignments.length === 0
          ? 'No active assignment is bound to a coded classroom yet — set "Classroom" on the AssignmentForm.'
          : `${publishedAssignments.length} active assignment${publishedAssignments.length === 1 ? '' : 's'} published.`,
  };

  // 3) At least one student joined by code (i.e., at least one classroom
  // with active code has a non-empty studentIds[]).
  const joinedClassrooms = activeCodes.filter((c) => c.studentIds.length > 0);
  const joinedCount = joinedClassrooms.reduce(
    (n, c) => n + c.studentIds.length,
    0
  );
  const studentJoined: ReadinessCheck = {
    id: 'student_joined_by_code',
    label: 'At least one student joined by code',
    passed: joinedCount > 0,
    detail:
      activeCodes.length === 0
        ? 'Needs an active classroom code first.'
        : joinedCount === 0
          ? 'No students have joined an active code yet. Share the code with a student to test.'
          : `${joinedCount} student${joinedCount === 1 ? '' : 's'} across ${joinedClassrooms.length} coded classroom${joinedClassrooms.length === 1 ? '' : 's'}.`,
  };

  // 4) At least one submission imported (any session with
  // `importedFromCode` set).
  const imported = state.sessions.filter(
    (s) => typeof s.importedFromCode === 'string'
  );
  const submissionImported: ReadinessCheck = {
    id: 'submission_imported',
    label: 'At least one student submission imported',
    passed: imported.length > 0,
    detail:
      imported.length === 0
        ? 'No imports yet — click "Import submissions now" on the teacher home or Classrooms view.'
        : `${imported.length} imported session${imported.length === 1 ? '' : 's'}.`,
  };

  // 5) Imported sessions reviewed (the teacher has acknowledged each one
  // via the Mark reviewed button in ImportedSubmissionsView).
  const reviewedMap = loadReviewedImports();
  const reviewedImports = imported.filter((s) => reviewedMap[s.id] !== undefined).length;
  const importsReviewed: ReadinessCheck = {
    id: 'imported_sessions_reviewed',
    label: 'Imported sessions reviewed',
    passed: imported.length === 0 ? false : reviewedImports >= imported.length,
    detail:
      imported.length === 0
        ? 'Needs at least one imported submission first.'
        : `${reviewedImports} / ${imported.length} imported sessions reviewed.`,
  };

  return [
    codeActive,
    assignmentPublished,
    studentJoined,
    submissionImported,
    importsReviewed,
  ];
}

// Convenience: a one-line summary of the readiness checklist.
export const readinessHeadline = (
  checks: ReadinessCheck[]
): { passed: number; total: number; allPassed: boolean } => {
  const passed = checks.filter((c) => c.passed).length;
  return {
    passed,
    total: checks.length,
    allPassed: passed === checks.length,
  };
};

// ---------------------------------------------------------------------------
// Flagged-item helpers (Task 3)
// ---------------------------------------------------------------------------
// True iff the item has any audit flag or its alignment confidence is
// not 'high'. Used by FlaggedBadge throughout the UI.
export const isItemFlagged = (itemId: string): boolean => {
  const aligns = buildItemAlignments(ITEMS);
  const a = aligns[itemId];
  if (!a) return false;
  return (
    a.alignmentConfidence !== 'high' ||
    (a.auditFlags && a.auditFlags.length > 0)
  );
};
