// v0.25: Teacher Home orchestrator. Reads the shared summary and switches
// between three tab views. Layout and helpers live in sibling files:
//
//   TeacherHomeSummary.tsx        — useTeacherHomeSummary() hook + shared
//                                   helpers (timeAgo, friendlyCta,
//                                   SectionHeader, buildStepHandlers)
//   TeacherHomeTabs.tsx           — TabBar
//   TeacherTodayTab.tsx           — Today tab (v0.25 declutter)
//   TeacherPilotSetupTab.tsx      — Pilot setup tab
//   TeacherAdminValidationTab.tsx — Admin & validation tab
//
// v0.24 introduced the 3-tab redesign; v0.25 just factors the file into
// five smaller ones and applies the "one action / one snapshot / one
// recommendation" decluttering to Today. Behaviour is unchanged.

import { useMemo, useState } from 'react';
import { hasSampleData } from '../lib/sampleData';
import { TeacherAdminValidationTab } from './TeacherAdminValidationTab';
import {
  buildStepHandlers,
  useTeacherHomeSummary,
} from './TeacherHomeSummary';
import { TabBar, type TabId } from './TeacherHomeTabs';
import { TeacherPilotSetupTab } from './TeacherPilotSetupTab';
import { TeacherTodayTab } from './TeacherTodayTab';

export function TeacherWorkflowHome({
  onOpenStudents,
  onOpenClassDashboard,
  onOpenItemReview,
  onOpenPilotSetup,
  onOpenTeachingPlan,
  onOpenAlignmentReview,
  onOpenAssignments,
  onOpenAssignmentForm,
  onOpenLearn,
  onOpenPilotReport,
  onOpenClassrooms,
  onOpenImportedSubmissions,
  onOpenClassroomTest,
  onOpenCurriculumCoverage,
  onStart,
  onExport,
}: {
  onOpenStudents: () => void;
  onOpenClassDashboard: () => void;
  onOpenItemReview: () => void;
  onOpenPilotSetup: () => void;
  onOpenTeachingPlan: () => void;
  onOpenAlignmentReview: () => void;
  onOpenAssignments: () => void;
  onOpenAssignmentForm: () => void;
  onOpenLearn: () => void;
  onOpenPilotReport: () => void;
  onOpenClassrooms?: () => void;
  onOpenImportedSubmissions?: () => void;
  onOpenClassroomTest?: () => void;
  /** v0.46 — Curriculum Coverage admin page. */
  onOpenCurriculumCoverage?: () => void;
  onStart: () => void;
  onExport: () => void;
}) {
  const home = useTeacherHomeSummary();
  const {
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
  } = home;

  const stepHandlers = buildStepHandlers({
    state,
    onOpenPilotSetup,
    onOpenAssignments,
    onOpenAssignmentForm,
    onOpenClassDashboard,
    onOpenTeachingPlan,
    onOpenItemReview,
    onExport,
  });

  // Active tab. Sticky via localStorage so a refresh keeps you on the
  // last tab you were looking at.
  const [tab, setTabState] = useState<TabId>(() => {
    try {
      const t =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('pragati.teacher_tab.v1')
          : null;
      if (t === 'pilot' || t === 'admin' || t === 'today') return t;
    } catch {
      /* ignore */
    }
    return 'today';
  });
  const setTab = (t: TabId) => {
    setTabState(t);
    try {
      if (typeof localStorage !== 'undefined')
        localStorage.setItem('pragati.teacher_tab.v1', t);
    } catch {
      /* ignore */
    }
  };

  // Refresh trigger so seed/clear sample-data buttons re-render dependent
  // counts inline without a full route change.
  const [version, setVersion] = useState(0);
  const sampleActive = useMemo(() => hasSampleData(), [version]);

  return (
    <div className="space-y-6">
      {/* HEADER — mode/account hint + grade chip + tab bar. */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
            Teacher · CBSE/NCERT-informed prototype · pre-pilot
          </div>
          {state.activePilot && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Pilot active · {state.activePilot.className}
            </span>
          )}
        </div>
        <TabBar
          tab={tab}
          onSwitch={setTab}
          badges={{
            today: 0,
            pilot: headline.allPassed ? 0 : headline.total - headline.passed,
            admin: submissionsAwaitingReview,
          }}
        />
      </header>

      {tab === 'today' && (
        <TeacherTodayTab
          summary={summary}
          next={next}
          stepHandlers={stepHandlers}
          activePilot={Boolean(state.activePilot)}
          onOpenPilotTab={() => setTab('pilot')}
          onOpenAdminTab={() => setTab('admin')}
          onOpenPilotSetup={onOpenPilotSetup}
          onOpenTeachingPlan={onOpenTeachingPlan}
          onStartManual={onStart}
        />
      )}

      {tab === 'pilot' && (
        <TeacherPilotSetupTab
          steps={steps}
          stepHandlers={stepHandlers}
          headline={headline}
          readiness={readiness}
          totalCodes={totalCodes}
          activeCodes={activeCodes}
          activeAssignmentCount={state.activeAssignments.length}
          onOpenAssignments={onOpenAssignments}
          onOpenAssignmentForm={onOpenAssignmentForm}
          onOpenClassrooms={onOpenClassrooms}
          onOpenPilotReport={onOpenPilotReport}
        />
      )}

      {tab === 'admin' && (
        <TeacherAdminValidationTab
          reviewedCount={reviewedCount}
          flaggedNeedingReview={flaggedNeedingReview}
          submissionsAwaitingReview={submissionsAwaitingReview}
          lastImportedAt={lastImportedAt}
          activeAssignmentCount={state.activeAssignments.length}
          sampleActive={sampleActive}
          onImported={() => setVersion((n) => n + 1)}
          onSampleChanged={() => setVersion((n) => n + 1)}
          onOpenStudents={onOpenStudents}
          onOpenClassDashboard={onOpenClassDashboard}
          onOpenItemReview={onOpenItemReview}
          onOpenAlignmentReview={onOpenAlignmentReview}
          onOpenLearn={onOpenLearn}
          onOpenClassrooms={onOpenClassrooms}
          onOpenImportedSubmissions={onOpenImportedSubmissions}
          onOpenClassroomTest={onOpenClassroomTest}
          onOpenCurriculumCoverage={onOpenCurriculumCoverage}
          onExport={onExport}
        />
      )}
    </div>
  );
}
