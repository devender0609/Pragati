// v0.25: Extracted from TeacherWorkflowHome.tsx.
//
// useTeacherHomeSummary() reads everything the three Teacher Home tabs need
// from local storage, computes the workflow state, dashboard summary, and
// derived counts in one place, and returns a typed object the tabs can
// consume as a single prop bundle. Behaviour unchanged from v0.24.
//
// This file also exports the shared helpers (timeAgo, friendlyCta,
// friendlyNextTitle, friendlyNextSubtitle, SectionHeader) used by more
// than one tab, so the per-tab files can stay focused on layout.

import { useMemo } from 'react';
import { ITEMS as ALL_ITEMS } from '../data/items';
import { classifyCode, loadReviewedImports, loadTeacherImportStatus } from '../lib/accessCodes';
import { loadClassrooms } from '../lib/classroomStore';
import { buildDashboardSummary } from '../lib/dashboardSummary';
import {
  getActiveAssignments,
  getActivePilot,
  loadAssignments,
  loadItemReviews,
  loadLastExportedAt,
  loadPilots,
  loadSessionFeedback,
  loadSessions,
  loadStudents,
} from '../lib/storage';
import {
  buildReadiness,
  computeWorkflow,
  nextWorkflowStep,
  readinessHeadline,
  type WorkflowState,
} from '../lib/workflow';
import type { ReadinessCheck, WorkflowStep, WorkflowStepId } from '../types';

export type TeacherHomeSummary = {
  state: WorkflowState;
  steps: WorkflowStep[];
  next: WorkflowStep | null;
  readiness: ReadinessCheck[];
  headline: { passed: number; total: number; allPassed: boolean };
  summary: ReturnType<typeof buildDashboardSummary>;
  reviewedCount: number;
  flaggedNeedingReview: number;
  submissionsAwaitingReview: number;
  activeCodes: number;
  totalCodes: number;
  lastImportedAt: number | null;
};

export function useTeacherHomeSummary(): TeacherHomeSummary {
  const state: WorkflowState = useMemo(() => {
    const sessions = loadSessions();
    return {
      pilots: loadPilots(),
      activePilot: getActivePilot(),
      assignments: loadAssignments(),
      activeAssignments: getActiveAssignments(),
      sessions,
      completedSessions: sessions.filter((s) => s.completedAt !== null),
      itemReviews: loadItemReviews(),
      sessionFeedback: loadSessionFeedback(),
      lastExportedAt: loadLastExportedAt(),
      classrooms: loadClassrooms(),
    };
  }, []);
  const steps = useMemo(() => computeWorkflow(state), [state]);
  const next = useMemo(() => nextWorkflowStep(steps), [steps]);
  const readiness = useMemo(() => buildReadiness(state), [state]);
  const headline = useMemo(() => readinessHeadline(readiness), [readiness]);

  const summary = useMemo(
    () =>
      buildDashboardSummary({
        students: loadStudents(),
        sessions: state.sessions,
        classrooms: state.classrooms ?? [],
        itemReviews: state.itemReviews,
        items: ALL_ITEMS,
      }),
    [state]
  );

  const reviewedCount = state.itemReviews.filter(
    (r) => r.status !== 'not_reviewed'
  ).length;
  const flaggedNeedingReview = ALL_ITEMS.length - reviewedCount;
  const submissionsAwaitingReview = useMemo(() => {
    const reviewedMap = loadReviewedImports();
    return state.sessions.filter(
      (s) =>
        typeof s.importedFromCode === 'string' &&
        reviewedMap[s.id] === undefined
    ).length;
  }, [state.sessions]);
  const activeCodes = (state.classrooms ?? []).filter(
    (c) => classifyCode(c) === 'active'
  ).length;
  const totalCodes = (state.classrooms ?? []).filter(
    (c) => Boolean((c as { accessCode?: string }).accessCode)
  ).length;
  const lastImportedAt = loadTeacherImportStatus()?.lastImportedAt ?? null;

  return {
    state,
    steps,
    next,
    readiness,
    headline,
    summary,
    reviewedCount,
    flaggedNeedingReview,
    submissionsAwaitingReview,
    activeCodes,
    totalCodes,
    lastImportedAt,
  };
}

export function buildStepHandlers(args: {
  state: WorkflowState;
  onOpenPilotSetup: () => void;
  onOpenAssignments: () => void;
  onOpenAssignmentForm: () => void;
  onOpenClassDashboard: () => void;
  onOpenTeachingPlan: () => void;
  onOpenItemReview: () => void;
  onExport: () => void;
}): Record<WorkflowStepId, () => void> {
  return {
    pilot_setup: args.onOpenPilotSetup,
    assignment:
      args.state.activeAssignments.length > 0
        ? args.onOpenAssignments
        : args.onOpenAssignmentForm,
    review_results: args.onOpenClassDashboard,
    teaching_plan: args.onOpenTeachingPlan,
    flagged_items: args.onOpenItemReview,
    export: args.onExport,
  };
}

// ---------------------------------------------------------------------------
// Shared helpers used by more than one tab.
// ---------------------------------------------------------------------------

export function timeAgo(ts: number): string {
  const delta = Date.now() - ts;
  if (delta < 60_000) return 'just now';
  const min = Math.round(delta / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}

export function friendlyNextTitle(title: string, activePilot: boolean): string {
  if (/start.*pilot/i.test(title) && !activePilot) {
    return 'Start your first classroom pilot';
  }
  return title;
}

export function friendlyNextSubtitle(subtitle: string): string {
  return subtitle;
}

export function friendlyCta(label: string): string {
  if (/export.*pilot.*data/i.test(label)) return 'Download pilot report';
  if (/review.*flagged.*item/i.test(label))
    return 'Check items needing teacher review';
  return label;
}

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
        {subtitle}
      </p>
    </div>
  );
}
