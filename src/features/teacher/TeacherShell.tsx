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
import {
  TeacherPageHeader,
  TeacherPanel,
  TeacherEmptyState,
  TeacherStat,
  AvailabilityRow,
} from '../../design/TeacherKit';
import { officialChapterLearnState } from '../../curriculum/eligibilityPolicy';
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

  /**
   * v0.79 §17 — THE PHONE COULD NOT REACH TWO DESTINATIONS.
   *
   * The bottom bar carried four of six, and the wider navigation only
   * appears at `md`. On a 390px phone — which is most of Pragati's
   * teachers — Assess and Insights had no route at all. That is a
   * functional defect, not a density choice, and it survived because
   * nobody probed the phone for the tabs that were missing from it.
   *
   * Four tabs stay, because six in a bottom bar is unusable, and the
   * two that were dropped are now reachable from a row inside Overview
   * (below) whose route the interaction matrix probes at 360/390/430.
   */
  const mobileNavItems: NavItem<TeacherPrimaryTab>[] = navItems.filter((n) =>
    ['overview', 'classes', 'assign', 'resources'].includes(n.id)
  );
  const phoneOnlyTabs: NavItem<TeacherPrimaryTab>[] = navItems.filter((n) =>
    ['assess', 'insights'].includes(n.id)
  );

  return (
    <div className="space-y-4">
      {/* Chrome. Identity and class scope at every width. Below `lg` it
          also carries navigation; at `lg` the rail takes that over.
          The class selector lives HERE and only here — rendering it in
          the rail as well put two comboboxes with the same label in the
          DOM, which the accessibility suite correctly rejected. */}
      {/* v0.79 §5 — same Pragati brand as the student product, at
          professional density: ink type on paper, Anek headings, no
          all-caps tracked eyebrow. Teacher is calmer than Student, not
          a different company. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
        <div>
          <div className="font-display text-lg font-bold tracking-tight text-ink-900">
            {/* v0.71 §16 — was "Teacher Mathematics · Prototype".
                The pilot status is real and is stated in Admin & Research
                and in the release notes; stamping it across the top of a
                teacher's daily workspace makes the tool feel like an
                experiment being run on them. */}
            Teacher · Mathematics
          </div>
          {/* v0.50 §8 — the current class is part of the shell chrome, so
              it persists across Overview / Insights / Assign / Resources
              instead of each tab choosing its own scope. */}
          {classrooms.length > 0 && (
            <label className="mt-1.5 flex items-center gap-2 text-xs">
              <span className="font-medium text-ink-500">Class:</span>
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

      {/* §17 — the two destinations the bottom bar cannot hold. Shown
          only on the phone, and only from Overview, so the desktop rail
          stays the single source of navigation there. */}
      {activeTab === 'overview' && (
        <div className="flex gap-2 md:hidden">
          {phoneOnlyTabs.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onSwitchTab(n.id)}
              className="tap flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-ink-800 shadow-sm ring-1 ring-ink-100"
            >
              {n.label}
            </button>
          ))}
        </div>
      )}

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
  // v0.78 §15 — this read `availability === 'available'` and called the
  // result `learnReady`, which is the "Ready to learn" defect in teacher
  // language: a chapter whose only openable content is legacy practice
  // was counted as a chapter with a lesson. Both counts now come from
  // the canonical policy, and they are reported as the two different
  // things they are.
  const withOfficialLearn = chapters.filter(
    (c) => officialChapterLearnState(c.officialChapterId) === 'official_learn_available'
  );
  const withPractice = chapters.filter(
    (c) => officialChapterLearnState(c.officialChapterId) === 'related_practice_available'
  );

  return (
    <div className="space-y-6">
      <TeacherPageHeader
        title={analytics.isEmpty ? 'Set up your class' : 'What happened recently'}
        detail={
          analytics.isEmpty
            ? 'Nothing has been recorded yet. Here is what you can do now.'
            : undefined
        }
        scope={scopeLabel}
      />

      {analytics.isEmpty ? (
        <>
          {/* §9 — a new teacher gets a path, not a gradient banner
              announcing that there is no data. The three steps are the
              three things that actually have to happen, in order. */}
          <TeacherEmptyState
            title="No student work yet"
            detail="Once your students start working, their activity appears here. Until then, these three steps are what set the class up."
            actions={[
              { label: 'Open Classes', onClick: onOpenClasses, primary: true },
              {
                label: 'View curriculum',
                onClick: onOpenCurriculum ?? onOpenClasses,
              },
              { label: 'Create assignment', onClick: onOpenAssign },
            ]}
          />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <TeacherPanel
              title="What you can assign today"
              detail="Straight from the curriculum policy — the same rules the student product uses, so a teacher and a student are never told different things about the same chapter."
            >
              <AvailabilityRow
                title="Official lessons"
                available={withOfficialLearn.length > 0}
                count={
                  withOfficialLearn.length > 0
                    ? `${withOfficialLearn.length} of ${chapters.length} chapters`
                    : undefined
                }
                detail="Lessons written for a section of the current textbook. They become assignable once an educator has reviewed them."
              />
              <AvailabilityRow
                title="Related practice"
                available={withPractice.length > 0}
                count={`${withPractice.length} of ${chapters.length} chapters`}
                detail="Older Pragati activities that practise the same mathematics. Shown to students as practice, never as the chapter's lesson."
              />
            </TeacherPanel>

            <TeacherPanel
              title="Where the curriculum stands"
              detail="Class 6 is represented in full from the NCERT textbook. Lessons are a separate question from curriculum."
            >
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                <TeacherStat value={chapters.length} label="chapters mapped" hint="all of Ganita Prakash" />
                <TeacherStat
                  value={withPractice.length}
                  label="with something to open"
                  hint="related practice"
                />
                <TeacherStat value={withOfficialLearn.length} label="with a lesson" hint="reviewed and published" />
              </div>
            </TeacherPanel>
          </div>
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
      <TeacherPanel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-sm text-ink-500">
            {/* §15 — "activity students can open" is the honest phrase:
                it counts what is openable, and says separately how many
                of those are the chapter's own lessons. */}
            Class 6 Mathematics — {withPractice.length} chapter
            {withPractice.length === 1 ? '' : 's'} with activity students can
            open today, {withOfficialLearn.length} with a reviewed lesson.
          </p>
          <PrimaryButton onClick={onOpenAssign}>Create assignment</PrimaryButton>
        </div>
      </TeacherPanel>

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
      {/* v0.79 §5 — the Overview cards led with a tracked all-caps
          label, which is the template tell the student product removed
          in v0.76. The question is the heading; it reads as one. */}
      <div className="font-display text-[0.95rem] font-bold text-ink-900">
        {question}
      </div>
      <div className="mt-1.5 text-sm leading-relaxed text-ink-600">{answer}</div>
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
