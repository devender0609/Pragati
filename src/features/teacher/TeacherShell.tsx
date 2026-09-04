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

import { class6ChapterCards } from '../../curriculum/studentChapterModel';
import { useState, type ReactNode } from 'react';
import { Card } from '../../design/primitives/Card';
import {
  attentionSummary,
  ATTENTION_REASON_LABEL,
  type OverviewAnalytics,
} from './overviewAnalytics';
import { PageHeader } from '../../design/primitives/PageHeader';
import { TeacherWorkspace } from './TeacherWorkspace';
import { PrimaryButton } from '../../design/primitives/PrimaryButton';
import { SecondaryButton } from '../../design/primitives/SecondaryButton';
import {
  BottomNavigation, DesktopNavigation, type NavItem,
} from '../../design/primitives/BottomNavigation';
import {
  HomeIcon, UsersIcon, ClipboardIcon, ChartIcon, FolderIcon, CogIcon,
} from '../../design/primitives/Icons';

export type TeacherPrimaryTab =
  | 'overview' | 'classes' | 'assign' | 'assess' | 'insights' | 'resources';

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

  // v0.71 §17 — SIX TABS ON A PHONE IS NOT NAVIGATION.
  //
  // At 390px six labels get roughly 62px each, which is below the 44px
  // target once padding is taken out and forces every label to a single
  // squeezed word. Worse, "Assess" and "Insights" shared an icon, so two
  // of the six were visually identical.
  //
  // Desktop keeps all six: there is room, and a teacher scanning a wide
  // header benefits from seeing every destination. Mobile takes the four
  // a teacher uses daily.
  //
  // v0.74 §11/§12 — THIS COMMENT USED TO SAY "Nothing is removed —
  // Assess and Insights are reachable from the Overview". It was not
  // true. `TeacherOverviewBody` took only `onOpenAssign` and
  // `onOpenClasses`, and the header nav is `hidden` below `md`, so at
  // 390 the Assess button measured 0x0 and no other route existed. Two
  // teacher workflows were unreachable on a phone for three releases,
  // behind a comment asserting they were not.
  //
  // Overview now carries real entry points for both, which is what the
  // comment claimed all along.
  const navItems: NavItem<TeacherPrimaryTab>[] = [
    { id: 'overview', label: 'Overview', icon: <HomeIcon /> },
    { id: 'classes', label: 'Classes', icon: <UsersIcon /> },
    { id: 'assign', label: 'Assign', icon: <ClipboardIcon /> },
    { id: 'assess', label: 'Assess', icon: <ChartIcon /> },
    { id: 'insights', label: 'Insights', icon: <ChartIcon /> },
    { id: 'resources', label: 'Resources', icon: <FolderIcon /> },
  ];

  /** The four daily destinations, for the phone. */
  const mobileNavItems: NavItem<TeacherPrimaryTab>[] = navItems.filter((n) =>
    ['overview', 'classes', 'assign', 'resources'].includes(n.id)
  );

  return (
    <div className="space-y-4">
      {/* Chrome. Identity and class scope at every width. Below `lg` it
          also carries navigation; at `lg` the rail takes that over.
          The class selector lives HERE and only here — rendering it in
          the rail as well put two comboboxes with the same label in the
          DOM, which the accessibility suite correctly rejected. */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {/* v0.71 §16 — was "Teacher Mathematics · Prototype".
                The pilot status is real and is stated in Admin & Research
                and in the release notes; stamping it across the top of a
                teacher's daily workspace makes the tool feel like an
                experiment being run on them. */}
            Teacher Mathematics
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
          {/* md-only: too wide for the bottom nav, too narrow for the
              rail. Below md the bottom nav carries navigation. */}
          <div className="hidden md:block lg:hidden">
            <DesktopNavigation
              items={navItems}
              active={activeTab}
              onSelect={onSwitchTab}
            />
          </div>
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

      {/* v0.75 §19 — at lg this is a rail + working area. Below lg it
          renders the same single column that shipped in v0.74. */}
      <TeacherWorkspace
        items={navItems}
        active={activeTab}
        onSelect={onSwitchTab}
      >
        {children}
      </TeacherWorkspace>

      <BottomNavigation
        items={mobileNavItems}
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
  onOpenAssign, onOpenClasses, onOpenAssess, onOpenInsights, onOpenCurriculum,
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
  /** v0.74 §11 — the phone's only route to Assess. Optional so existing
   *  callers keep compiling; when absent the tile is omitted rather than
   *  rendered as a control that does nothing. */
  onOpenAssess?: () => void;
  /** v0.74 §12 — same, for Insights. */
  onOpenInsights?: () => void;
  /** v0.75 §15 — Resources, where the curriculum actually is. Optional
   *  so existing callers compile; falls back to the old destination
   *  rather than rendering a control that does nothing. */
  onOpenCurriculum?: () => void;
}) {
  const flagged = analytics.flagged;
  const difficult = analytics.difficultSkills;

  // v0.71 §15 — WHAT A TEACHER CAN ACTUALLY DO TODAY.
  //
  // The v0.70 Overview was five cards, and with a fresh class every one
  // of them was a negative: "No completed sessions", "No active
  // assignment", "Not enough recent activity", twice more. A teacher
  // opening the product was told five times that there was nothing, and
  // offered nothing to do about it.
  //
  // Emptiness is not a finding. It is a state with obvious next steps,
  // and the screen now offers those instead of reporting the absence
  // five ways. Where evidence DOES exist, it leads with the evidence.
  const chapters = class6ChapterCards();
  const learnReady = chapters.filter((c) => c.availability === 'available');

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Today"
        title={analytics.isEmpty ? 'Set up your class' : 'What happened recently'}
        subtitle={scopeLabel}
      />

      {analytics.isEmpty ? (
        <>
          <section className="rounded-xl3 bg-gradient-to-br from-brand-600 to-learn-600 p-5 text-white shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Getting started
            </p>
            <h2 className="mt-1 font-display text-xl font-bold">
              No student work yet
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90">
              Once your students start working, their activity appears here.
              Until then, here is what you can do.
            </p>
          </section>

          <ol className="grid gap-3 sm:grid-cols-3">
            <li className="flex flex-col rounded-xl2 border border-slate-200 bg-white p-4 shadow-card">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-700">
                1
              </span>
              <p className="mt-2.5 font-display text-base font-bold text-slate-900">
                Set up your class
              </p>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">
                Add your students so their work is grouped together.
              </p>
              <button
                type="button"
                onClick={onOpenClasses}
                className="tap mt-3 self-start rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white"
              >
                Open Classes
              </button>
            </li>
            <li className="flex flex-col rounded-xl2 border border-slate-200 bg-white p-4 shadow-card">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-700">
                2
              </span>
              <p className="mt-2.5 font-display text-base font-bold text-slate-900">
                See what is available
              </p>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">
                {learnReady.length} of {chapters.length} Class 6 chapters have
                activity a student can open today.
              </p>
              {/* v0.75 §15 — this called `onOpenClasses`. A control
                  labelled "View curriculum" that opens the class roster
                  is not a dead control — it fires and the screen
                  changes, which is why the v0.74 interaction matrix
                  passed it — but the label promised something the
                  destination did not deliver. Now routed to Resources,
                  which is where curriculum actually lives. */}
              <button
                type="button"
                onClick={onOpenCurriculum ?? onOpenClasses}
                className="tap mt-3 self-start rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white"
              >
                View curriculum
              </button>
            </li>
            <li className="flex flex-col rounded-xl2 border border-slate-200 bg-white p-4 shadow-card">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-700">
                3
              </span>
              <p className="mt-2.5 font-display text-base font-bold text-slate-900">
                Assign something
              </p>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">
                Give the class a set of questions and see how they go.
              </p>
              <button
                type="button"
                onClick={onOpenAssign}
                className="tap mt-3 self-start rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white"
              >
                Create assignment
              </button>
            </li>
          </ol>
        </>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            question="What happened recently?"
            answer={`${analytics.completedSessionCount} completed session${analytics.completedSessionCount === 1 ? '' : 's'} from ${analytics.activeStudentCount} student${analytics.activeStudentCount === 1 ? '' : 's'}.`}
          />
          {/* Shown only when there IS something to say. v0.70 rendered
              "Nobody on the flag list right now" as though the absence
              of a finding were itself a finding. */}
          {flagged && flagged.length > 0 && (
            <OverviewCard
              question="Which students may need attention?"
              answer={attentionSummary(analytics)}
              action={{ label: 'Open Classes', onClick: onOpenClasses }}
            >
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
            </OverviewCard>
          )}
          <OverviewCard
            question="Which assignment is active?"
            answer={activeAssignmentTitle ?? 'No active assignment.'}
            action={{ label: 'Manage assignments', onClick: onOpenAssign }}
          />
          {difficult !== null && (
            <OverviewCard
              question="Which skills were difficult?"
              answer={difficult
                .map(
                  (d) =>
                    `${skillLabelFor(d.skillId)} (${Math.round(d.accuracy * 100)}% of ${d.attempted})`
                )
                .join(' \u00b7 ')}
            />
          )}
          {difficult !== null && (
            <OverviewCard
              question="What should I teach next?"
              answer={`Revisit ${skillLabelFor(difficult[0].skillId)} — it has the lowest recent accuracy in this class.`}
              action={{ label: 'Open Classes', onClick: onOpenClasses }}
            />
          )}
        </div>
      )}

      {/* v0.71 §16 — the pilot notice, removed from the teacher's daily
          screen. It read: "This overview does not include pilot
          administration or item-review counters — those live under
          Admin & Research." A teacher does not know what an item-review
          counter is and has no reason to. The statement is true and
          belongs where the person reading it is the person it concerns. */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="max-w-xl text-sm text-slate-600">
            Class 6 Mathematics · {learnReady.length} chapter
            {learnReady.length === 1 ? '' : 's'} with activity students can open
            today.
          </p>
          <PrimaryButton onClick={onOpenAssign}>Create assignment</PrimaryButton>
        </div>
      </Card>

      {/* v0.74 §11/§12 — the destinations the phone nav drops.
          At 390 the header nav is `hidden`, so without these the Assess
          and Insights workflows have NO route at all. Shown only below
          `md`, where the header nav is absent. */}
      {(onOpenAssess || onOpenInsights) && (
        <section className="rounded-xl2 border border-slate-200 bg-white p-4 md:hidden">
          <h2 className="font-display text-sm font-bold text-slate-900">
            More teacher tools
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            These are in the header on a larger screen.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {onOpenAssess && (
              <button
                type="button"
                onClick={onOpenAssess}
                className="tap rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700"
              >
                Assess
              </button>
            )}
            {onOpenInsights && (
              <button
                type="button"
                onClick={onOpenInsights}
                className="tap rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700"
              >
                Insights
              </button>
            )}
          </div>
        </section>
      )}
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
