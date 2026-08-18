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
import {
  attentionSummary,
  ATTENTION_REASON_LABEL,
  type OverviewAnalytics,
} from './overviewAnalytics';
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
  /** v0.50 §8 — persistent teacher class context. */
  classrooms?: Array<{ id: string; name: string }>;
  selectedClassroomId?: string | null;
  onSelectClassroom?: (id: string | null) => void;

  /** Body content for the active tab, supplied by the caller so the
   *  shell stays presentation-only. */
  children: ReactNode;
};

export function TeacherShell(props: TeacherShellProps) {
  const {
    activeTab, onSwitchTab, children,
    onOpenPilotSetup, onOpenItemReview, onOpenAlignmentReview,
    onOpenCurriculumCoverage, onOpenWorkflowTest, onOpenExports,
    classrooms = [], selectedClassroomId = null, onSelectClassroom,
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
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Teacher · Mathematics · Prototype
          </div>
          {/* v0.50 §8 — the current class is part of the shell chrome, so
              it persists across Overview / Insights / Assign / Resources
              instead of each tab choosing its own scope. */}
          {classrooms.length > 0 && (
            <label className="mt-1 flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-600">Class:</span>
              <select
                value={selectedClassroomId ?? '__all__'}
                onChange={(e) =>
                  onSelectClassroom?.(
                    e.target.value === '__all__' ? null : e.target.value
                  )
                }
                className="min-h-[44px] rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                {/* Aggregate stays available, but as an explicit
                    secondary choice — never the silent default. */}
                <option value="__all__">All local data (aggregate)</option>
              </select>
            </label>
          )}
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
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
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
  analytics, scopeLabel, activeAssignmentTitle,
  skillLabelFor = (s) => s,
  onOpenAssign, onOpenClasses,
}: {
  /** v0.50 §7 — real, classroom-scoped evidence. v0.49 received a
   *  hard-coded `studentsNeedingAttention={0}` and rendered it as
   *  "Nobody on the flag list right now" — a placeholder presented as
   *  a finding. */
  analytics: OverviewAnalytics;
  /** Which class these numbers describe, stated on screen. */
  scopeLabel: string;
  activeAssignmentTitle: string | null;
  skillLabelFor?: (skillId: string) => string;
  onOpenAssign: () => void;
  onOpenClasses: () => void;
}) {
  const flagged = analytics.flagged;
  const difficult = analytics.difficultSkills;
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Today"
        title="What happened recently"
        subtitle={scopeLabel}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          question="What happened recently?"
          answer={
            analytics.isEmpty
              ? 'No completed sessions in this class yet.'
              : `${analytics.completedSessionCount} completed session${analytics.completedSessionCount === 1 ? '' : 's'} from ${analytics.activeStudentCount} student${analytics.activeStudentCount === 1 ? '' : 's'}.`
          }
        />
        <OverviewCard
          question="Which students may need attention?"
          answer={attentionSummary(analytics)}
          // Only offer the drill-down when there is something to drill into.
          action={
            flagged && flagged.length > 0
              ? { label: 'Open Classes', onClick: onOpenClasses }
              : undefined
          }
        >
          {flagged && flagged.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {flagged.slice(0, 3).map((f) => (
                <li key={f.studentId}>
                  <span className="font-medium text-slate-800">
                    {f.studentName}
                  </span>{' '}
                  — {f.reasons.map((r) => ATTENTION_REASON_LABEL[r]).join('; ')}
                  {f.accuracy !== null && (
                    <> ({Math.round(f.accuracy * 100)}% of {f.attempted})</>
                  )}
                </li>
              ))}
            </ul>
          )}
        </OverviewCard>
        <OverviewCard
          question="Which assignment is active?"
          answer={activeAssignmentTitle ?? 'No active assignment.'}
          action={{ label: 'Manage assignments', onClick: onOpenAssign }}
        />
        <OverviewCard
          question="Which skills were difficult?"
          answer={
            difficult === null
              ? 'Not enough recent activity yet.'
              : difficult
                  .map(
                    (d) =>
                      `${skillLabelFor(d.skillId)} (${Math.round(d.accuracy * 100)}% of ${d.attempted})`
                  )
                  .join(' \u00b7 ')
          }
        />
        <OverviewCard
          question="What should I teach next?"
          answer={
            difficult === null
              ? 'Not enough recent activity yet.'
              : `Revisit ${skillLabelFor(difficult[0].skillId)} — it has the lowest recent accuracy in this class.`
          }
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
  question, answer, action, children,
}: {
  question: string;
  answer: string;
  action?: { label: string; onClick: () => void };
  /** Optional supporting detail, e.g. which students were flagged. */
  children?: ReactNode;
}) {
  return (
    <Card>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {question}
      </div>
      <div className="mt-1 text-sm text-slate-900">{answer}</div>
      {children}
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
