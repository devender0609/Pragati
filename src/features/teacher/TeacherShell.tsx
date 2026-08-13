// v0.47 B — Canonical TeacherShell.
//
// Five ordinary primary destinations: Overview / Classes / Assign /
// Insights / Resources. Research tools (Pilot, Alignment, Item Review,
// Curriculum Validation, Workflow Test, Exports) live behind a
// secondary Admin & Research menu — not in the primary nav.
//
// The shell is a chrome + slot component; the individual tab bodies
// are wired by App.tsx callbacks so the existing routes (assignments,
// classrooms, item review, etc.) continue to function while we
// migrate them behind this new nav.

import { useState, type ReactNode } from 'react';
import { Card } from '../../design/primitives/Card';
import { PageHeader } from '../../design/primitives/PageHeader';
import { PrimaryButton } from '../../design/primitives/PrimaryButton';
import { SecondaryButton } from '../../design/primitives/SecondaryButton';
import {
  BottomNavigation, DesktopNavigation, type NavItem,
} from '../../design/primitives/BottomNavigation';
import {
  HomeIcon, UsersIcon, ClipboardIcon, ChartIcon, FolderIcon, CogIcon,
} from '../../design/primitives/Icons';

export type TeacherPrimaryTab =
  | 'overview' | 'classes' | 'assign' | 'insights' | 'resources';

export type TeacherShellProps = {
  activeTab: TeacherPrimaryTab;
  onSwitchTab: (t: TeacherPrimaryTab) => void;

  /** Handlers wired to existing App.tsx routes. */
  onOpenOverviewSummary: () => void;
  onOpenClasses: () => void;
  onOpenAssign: () => void;
  onOpenInsights: () => void;
  onOpenResources: () => void;

  /** Secondary menu — Admin & Research destinations. Not primary. */
  onOpenPilotSetup: () => void;
  onOpenItemReview: () => void;
  onOpenAlignmentReview: () => void;
  onOpenCurriculumCoverage: () => void;
  onOpenWorkflowTest?: () => void;
  onOpenExports: () => void;

  /** Body content for the active tab, supplied by the caller so the
   *  shell stays presentation-only. */
  children: ReactNode;
};

export function TeacherShell(props: TeacherShellProps) {
  const {
    activeTab, onSwitchTab, children,
    onOpenPilotSetup, onOpenItemReview, onOpenAlignmentReview,
    onOpenCurriculumCoverage, onOpenWorkflowTest, onOpenExports,
  } = props;

  const [adminOpen, setAdminOpen] = useState(false);

  const navItems: NavItem<TeacherPrimaryTab>[] = [
    { id: 'overview', label: 'Overview', icon: <HomeIcon /> },
    { id: 'classes', label: 'Classes', icon: <UsersIcon /> },
    { id: 'assign', label: 'Assign', icon: <ClipboardIcon /> },
    { id: 'insights', label: 'Insights', icon: <ChartIcon /> },
    { id: 'resources', label: 'Resources', icon: <FolderIcon /> },
  ];

  return (
    <div className="space-y-4">
      {/* Chrome */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Teacher · Mathematics · Prototype
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DesktopNavigation
            items={navItems}
            active={activeTab}
            onSelect={onSwitchTab}
          />
          <button
            onClick={() => setAdminOpen((v) => !v)}
            aria-expanded={adminOpen}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
            title="Admin & Research tools (kept off the standard tabs on purpose)"
          >
            <CogIcon width={14} height={14} />
            Admin &amp; Research
          </button>
        </div>
      </div>

      {adminOpen && (
        <Card>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <PageHeader
              eyebrow="Admin & Research"
              title="Secondary tools"
              subtitle="Pilot setup, item review, alignment review, curriculum coverage, workflow test, and exports. Kept separate from the ordinary teacher flow."
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <SecondaryButton onClick={onOpenPilotSetup}>Pilot setup</SecondaryButton>
            <SecondaryButton onClick={onOpenItemReview}>Item review</SecondaryButton>
            <SecondaryButton onClick={onOpenAlignmentReview}>Alignment review</SecondaryButton>
            <SecondaryButton onClick={onOpenCurriculumCoverage}>Curriculum coverage</SecondaryButton>
            {onOpenWorkflowTest && (
              <SecondaryButton onClick={onOpenWorkflowTest}>Workflow test</SecondaryButton>
            )}
            <SecondaryButton onClick={onOpenExports}>Exports</SecondaryButton>
          </div>
        </Card>
      )}

      <div>{children}</div>

      <BottomNavigation
        items={navItems}
        active={activeTab}
        onSelect={onSwitchTab}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// TeacherOverview — answers the 5 core questions.
// The full workflow home (v0.24 TeacherWorkflowHome with 3 tabs) remains
// reachable via the "Classes" tab as a bridge so we don't break existing
// per-student / per-class drilldowns during migration.
// ---------------------------------------------------------------------------

export function TeacherOverviewBody({
  recentSessionCount, studentsNeedingAttention, activeAssignmentTitle,
  weakestSkillLabel, nextRecommendationLabel,
  onOpenAssign, onOpenClasses,
}: {
  recentSessionCount: number;
  studentsNeedingAttention: number;
  activeAssignmentTitle: string | null;
  weakestSkillLabel: string | null;
  nextRecommendationLabel: string | null;
  onOpenAssign: () => void;
  onOpenClasses: () => void;
}) {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Today"
        title="What happened recently"
        subtitle="Five questions, one screen."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          question="What happened recently?"
          answer={`${recentSessionCount} session${recentSessionCount === 1 ? '' : 's'} in the last 7 days.`}
        />
        <OverviewCard
          question="Which students need attention?"
          answer={
            studentsNeedingAttention === 0
              ? 'Nobody on the flag list right now.'
              : `${studentsNeedingAttention} student${studentsNeedingAttention === 1 ? '' : 's'} flagged.`
          }
          action={studentsNeedingAttention > 0 ? {
            label: 'Open Classes',
            onClick: onOpenClasses,
          } : undefined}
        />
        <OverviewCard
          question="Which assignment is active?"
          answer={activeAssignmentTitle ?? 'No active assignment.'}
          action={{ label: 'Manage assignments', onClick: onOpenAssign }}
        />
        <OverviewCard
          question="Which skills were difficult?"
          answer={weakestSkillLabel ?? 'Not enough sessions yet.'}
        />
        <OverviewCard
          question="What should I teach next?"
          answer={nextRecommendationLabel ?? 'Once students have practised more, recommendations will appear here.'}
          action={{ label: 'Open Classes', onClick: onOpenClasses }}
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="max-w-xl text-sm text-slate-700">
            This overview does not include pilot administration or item-review
            counters — those live under Admin &amp; Research.
          </p>
          <PrimaryButton onClick={onOpenAssign}>Create assignment</PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

function OverviewCard({
  question, answer, action,
}: {
  question: string;
  answer: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <Card>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {question}
      </div>
      <div className="mt-1 text-sm text-slate-900">{answer}</div>
      {action && (
        <div className="mt-3">
          <SecondaryButton onClick={action.onClick}>
            {action.label}
          </SecondaryButton>
        </div>
      )}
    </Card>
  );
}
