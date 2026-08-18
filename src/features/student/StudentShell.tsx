// v0.48 — Canonical StudentShell (stabilised).
//
// Fixes shipped in this file:
//  §1 uses resolveChapter() — no push/pop mutation.
//  §2 keeps the shell chrome (top + bottom nav) visible during
//      lesson and session flows via `sessionChild`.
//  §3 Practice tab has distinct "Concept practice" and (when a real
//      chapter blueprint exists) "Chapter check" actions.
//  §4 progress + recent + continue read via studentData helpers.
//  §5 findContinueTarget is honest — shows "Start learning" when
//      no valid recent chapter exists.
//  §8 removes developer language from student copy.

import { useMemo, type ReactNode } from 'react';
import {
  MODULES_FOR_GRADE,
  type Grade, type ModuleId, type SkillId,
  SKILL_LABELS,
  MODULE_LABELS,
} from '../../types';
import { GRADE_COLORS } from '../../components/common/gradePalette';
import {
  layoutForGrade,
  tokensForGrade,
  primaryActionLabel,
} from '../../design/ageStage';
import { loadSessions } from '../../lib/storage';
import {
  findResumableSession,
  resumeSummary,
} from '../session/sessionLifecycle';
import { ChapterLandingPage } from '../../components/ChapterLandingPage';
import { ChapterUnavailableView } from './ChapterUnavailableView';
import { ChapterCard } from '../../design/primitives/ChapterCard';
import { PageHeader } from '../../design/primitives/PageHeader';
import { PrimaryButton } from '../../design/primitives/PrimaryButton';
import { SecondaryButton } from '../../design/primitives/SecondaryButton';
import { Card } from '../../design/primitives/Card';
import { EmptyState } from '../../components/common/EmptyState';
import {
  BottomNavigation, DesktopNavigation, type NavItem,
} from '../../design/primitives/BottomNavigation';
import {
  HomeIcon, BookIcon, DumbbellIcon, TrendingUpIcon,
} from '../../design/primitives/Icons';
import { chapterArtFor } from '../../design/primitives/ChapterArt';
import { OFFICIAL_CHAPTERS } from '../../curriculum/officialChapters';
import {
  resolveChapter,
  chapterBelongsToGrade,
  type ResolvedChapter,
} from '../../curriculum/chapterResolver';
import {
  canLaunchAssessment,
  STUDENT_STATUS_LABEL,
} from '../../curriculum/inventory';
import { blueprintForChapter } from '../../curriculum/chapterBlueprints';
import { sessionsForStudentIn, findContinueTarget, recentActivityForStudent } from './studentData';
import type { StudentTab } from './studentRouter';

export type StudentShellProps = {
  activeTab: StudentTab;
  onSwitchTab: (t: StudentTab) => void;

  openChapterId: string | null;
  onOpenChapter: (chapterId: string | null) => void;

  studentGrade: Grade;
  studentName: string;
  studentId: string;

  onLaunchLesson: (skillId: SkillId) => void;
  onLaunchConceptPractice: (skillId: SkillId) => void;
  onLaunchMixedChapterPractice: (moduleId: ModuleId) => void;
  onLaunchChapterCheck: (moduleId: ModuleId) => void;

  /** §2 — set while a session runs. Rendered INSIDE the chrome so
   *  the nav stays visible. */
  sessionChild?: ReactNode;

  /** v0.49 §2 — true while an assessment is actually in progress
   *  (questions still being answered). When set, the primary tabs are
   *  genuinely disabled rather than rendered as clickable controls
   *  that silently do nothing, and an explicit exit control appears.
   *  Not set for results / review screens, which are post-session and
   *  freely navigable. */
  sessionLocked?: boolean;
  /** §3 — open the concept chooser for a chapter. */
  onChooseConcept?: (moduleId: ModuleId | null, chapterId: string) => void;
  /** §1 — resume an unfinished set from Home. */
  onResumeSession?: (sessionId: string) => void;

  /** Called by the Save & Exit control. Required whenever
   *  `sessionLocked` is true. */
  onExitSession?: () => void;
  /** Label for the exit control — "Save & Exit" mid-session. */
  exitLabel?: string;
};

export function StudentShell(props: StudentShellProps) {
  const {
    activeTab, onSwitchTab, openChapterId, onOpenChapter,
    studentGrade, studentName, studentId,
    onLaunchLesson, onLaunchConceptPractice,
    onLaunchMixedChapterPractice, onLaunchChapterCheck,
    onChooseConcept = () => {},
    onResumeSession,
    sessionChild, sessionLocked = false, onExitSession,
    exitLabel = 'Save & Exit',
  } = props;

  const gradeColor = GRADE_COLORS[studentGrade];

  const navItems: NavItem<StudentTab>[] = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'learn', label: 'Learn', icon: <BookIcon /> },
    { id: 'practice', label: 'Practice', icon: <DumbbellIcon /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUpIcon /> },
  ];

  const body = sessionChild ?? (
    openChapterId ? (
      <ChapterDetail
        chapterId={openChapterId}
        studentGrade={studentGrade}
        studentId={studentId}
        onBack={() => onOpenChapter(null)}
        onLaunchLesson={onLaunchLesson}
        onLaunchMixedChapterPractice={onLaunchMixedChapterPractice}
        onLaunchChapterCheck={onLaunchChapterCheck}
      />
    ) : (
      renderTab({
        tab: activeTab,
        studentGrade,
        studentName,
        studentId,
        onSwitchTab,
        onOpenChapter,
        onLaunchConceptPractice,
        onChooseConcept,
        onResumeSession,
        onLaunchMixedChapterPractice,
        onLaunchChapterCheck,
      })
    )
  );

  // §2 — while a session is live, tab selection is a no-op by design.
  // The nav primitives receive `disabled`, so the buttons are actually
  // inert and announced as such instead of looking clickable.
  const handleSelect = (t: StudentTab) => {
    if (sessionLocked) return;
    onOpenChapter(null);
    onSwitchTab(t);
  };

  return (
    <div className="space-y-4">
      <div
        className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl ${gradeColor.header} px-4 py-3 ring-1 ring-slate-200`}
      >
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Class {studentGrade.replace('class', '')} · Mathematics
          </div>
          <div className={`mt-0.5 text-sm font-semibold ${gradeColor.text}`}>
            Hi, {studentName}
          </div>
        </div>
        {sessionLocked ? (
          <button
            type="button"
            onClick={onExitSession}
            className="inline-flex min-h-[44px] items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {exitLabel}
          </button>
        ) : (
          <DesktopNavigation
            items={navItems}
            active={activeTab}
            onSelect={handleSelect}
          />
        )}
      </div>

      {sessionLocked && (
        <p
          role="status"
          className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-amber-200"
        >
          You are in the middle of a set. Finish it, or use {exitLabel} —
          we'll save your place so you can pick up where you left off.
        </p>
      )}

      <div>{body}</div>

      <BottomNavigation
        items={navItems}
        active={activeTab}
        onSelect={handleSelect}
        disabled={sessionLocked}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function renderTab(args: {
  tab: StudentTab;
  studentGrade: Grade;
  studentName: string;
  studentId: string;
  onSwitchTab: (t: StudentTab) => void;
  onOpenChapter: (id: string | null) => void;
  onLaunchConceptPractice: (skillId: SkillId) => void;
  onChooseConcept: (moduleId: ModuleId | null, chapterId: string) => void;
  onResumeSession?: (sessionId: string) => void;
  onLaunchMixedChapterPractice: (moduleId: ModuleId) => void;
  onLaunchChapterCheck: (moduleId: ModuleId) => void;
}): ReactNode {
  switch (args.tab) {
    case 'home':
      return <HomeTab {...args} />;
    case 'learn':
      return <LearnTab {...args} />;
    case 'practice':
      return <PracticeTab {...args} />;
    case 'progress':
      return <ProgressTab {...args} />;
  }
}

function HomeTab({
  studentGrade, studentName, studentId, onSwitchTab, onOpenChapter,
  onResumeSession,
}: {
  studentGrade: Grade;
  studentName: string;
  studentId: string;
  onSwitchTab: (t: StudentTab) => void;
  onOpenChapter: (id: string | null) => void;
  onResumeSession?: (sessionId: string) => void;
}) {
  const chapters = useMemo(
    () => chaptersForStudentGrade(studentGrade),
    [studentGrade]
  );
  const launchableIds = chapters
    .filter((c) => c.canLaunch)
    .map((c) => c.chapterId);
  const target = useMemo(
    () =>
      findContinueTarget(studentId, studentGrade, {
        launchableChapterIds: launchableIds,
      }),
    [studentId, studentGrade, launchableIds.join(',')]
  );

  // v0.50 §9 — stage composition. What is SHOWN changes by stage, not
  // just how big the text is.
  const layout = layoutForGrade(studentGrade);
  const tokens = tokensForGrade(studentGrade);

  // §1/§11 — an unfinished set outranks everything else on Home.
  const openSet = useMemo(
    () => findResumableSession(loadSessions(), studentId),
    [studentId]
  );

  // §11 — secondary context, evidence-driven and stage-capped. Each
  // entry only appears when there is something real to say; we never pad
  // to fill the slot count.
  const secondary = useMemo(() => {
    const out: Array<{
      key: string;
      text: string;
      action?: { label: string; onClick: () => void };
    }> = [];
    const mine = sessionsForStudentIn(loadSessions(), studentId, {
      completedOnly: true,
    });
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = mine.filter((s) => (s.completedAt ?? 0) > weekAgo);
    if (thisWeek.length > 0) {
      const questions = thisWeek.reduce((a, s) => a + s.responses.length, 0);
      out.push({
        key: 'weekly',
        text: `You answered ${questions} question${questions === 1 ? '' : 's'} this week.`,
      });
    }
    if (target && !target.isResume && mine.length > 0) {
      out.push({
        key: 'review',
        text: 'Practise a concept you have already met.',
        action: { label: 'Practice', onClick: () => onSwitchTab('practice') },
      });
    }
    return out.slice(0, layout.maxHomeSecondaryItems);
  }, [studentId, layout.maxHomeSecondaryItems, target?.isResume]);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Today"
        title={
          target?.isResume
            ? `Welcome back, ${studentName}`
            : `Hi ${studentName}, let's start`
        }
      />

      {/* §1 — resumable set. Only reachable because Save & Exit now
          genuinely keeps the session open. */}
      {openSet && (
        <Card>
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                Unfinished set
              </div>
              <div className={`mt-0.5 font-semibold text-slate-900 ${tokens.bodyText}`}>
                {resumeSummary(openSet).remaining} question
                {resumeSummary(openSet).remaining === 1 ? '' : 's'} left
              </div>
            </div>
            <PrimaryButton onClick={() => onResumeSession?.(openSet.id)}>
              Continue practice
            </PrimaryButton>
          </div>
        </Card>
      )}

      {target ? (
        <Card>
          <div className="flex flex-wrap items-center gap-4">
            {/* §9 — younger stages get large chapter art; older stages
                get a compact, information-dense row instead. */}
            <div
              className={`shrink-0 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center ${
                layout.showChapterArt ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-16 w-16'
              }`}
            >
              {chapterArtFor(target.resolved.primaryLegacyModuleId)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {target.isResume ? 'Continue learning' : 'Start learning'}
              </div>
              <div className={`mt-0.5 font-semibold text-slate-900 ${tokens.h1}`}>
                {target.resolved.displayTitle}
              </div>
            </div>
            <PrimaryButton
              onClick={() => onOpenChapter(target.resolved.chapterId)}
            >
              {primaryActionLabel(
                studentGrade,
                target.isResume ? 'continue' : 'start'
              )}
            </PrimaryButton>
          </div>
        </Card>
      ) : (
        <EmptyState
          title="Nothing to open yet"
          message="Chapters for your class will appear here as they get ready."
          actionLabel="Browse Learn"
          onAction={() => onSwitchTab('learn')}
        />
      )}

      {/* v0.50 §11 — secondary context. Deliberately capped by stage:
          early primary sees NONE of this (one obvious action only),
          middle sees up to two, secondary up to three. These are
          low-emphasis rows, never competing primary CTAs. */}
      {secondary.length > 0 && (
        <Card>
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            This week
          </h2>
          <ul className="mt-2 space-y-2">
            {secondary.map((item) => (
              <li
                key={item.key}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <span className={`text-slate-700 ${tokens.bodyText}`}>
                  {item.text}
                </span>
                {item.action && (
                  <button
                    onClick={item.action.onClick}
                    className="min-h-[44px] rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    {item.action.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function LearnTab({
  studentGrade, onOpenChapter,
}: {
  studentGrade: Grade;
  onOpenChapter: (id: string | null) => void;
}) {
  const gradeColor = GRADE_COLORS[studentGrade];
  const chapters = chaptersForStudentGrade(studentGrade);
  // v0.50 §9 — column count is a stage decision: Class 1 gets one big
  // touch target per row, Class 12 gets a denser three-column grid.
  const layout = layoutForGrade(studentGrade);
  // NOTE the explicit `grid-cols-1` base on every branch. Without it a
  // CSS grid falls back to ONE implicit column sized to max-content,
  // so a long chapter title ("Matrices, Derivatives & Integrals…")
  // stretched the row to 597px inside a 320px viewport. Class 1 was
  // unaffected only because it already declared grid-cols-1.
  const gridCols =
    layout.chapterColumns === 1
      ? 'grid-cols-1'
      : layout.chapterColumns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Learn" title="Chapters for your class" />
      {chapters.length === 0 ? (
        <EmptyState
          title="Chapters are on the way"
          message="Your class does not have any chapters ready yet."
        />
      ) : (
        <div className={`grid gap-3 ${gridCols}`}>
          {chapters.map((c) => (
            <ChapterCard
              key={c.chapterId}
              title={c.title}
              subtitle={c.subtitle}
              status={c.inventory.status}
              statusReasons={c.inventory.reasons}
              // §5 — students see what they can DO, not our build state.
              // The label must agree with the CTA: a card whose action
              // is "See status" cannot claim "Practice available".
              statusLabel={
                c.canLaunch
                  ? STUDENT_STATUS_LABEL[c.inventory.status]
                  : 'Coming soon'
              }
              artwork={
                <span className={gradeColor.text}>
                  {chapterArtFor(c.legacyModuleId)}
                </span>
              }
              ctaLabel={c.canLaunch ? 'Open' : 'See status'}
              onClick={() => onOpenChapter(c.chapterId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// §4 — Every action here does exactly what its label says, and no two
// labels call the same function.
//
//   Practise a concept → starts a single-skill practice run.
//   Open chapter       → opens that exact chapter's page.
//   Mixed practice     → starts the mixed-practice blueprint directly.
//   Chapter check      → starts the chapter-check blueprint directly,
//                        and only renders when a real blueprint exists.
function PracticeTab({
  studentGrade, onOpenChapter, onChooseConcept,
  onLaunchMixedChapterPractice, onLaunchChapterCheck,
}: {
  studentGrade: Grade;
  onOpenChapter: (id: string | null) => void;
  /** §3 — open the concept chooser for this chapter. */
  onChooseConcept: (moduleId: ModuleId | null, chapterId: string) => void;
  onLaunchMixedChapterPractice: (moduleId: ModuleId) => void;
  onLaunchChapterCheck: (moduleId: ModuleId) => void;
}) {
  const chapters = chaptersForStudentGrade(studentGrade).filter(
    (c) => c.canLaunch
  );
  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Practice" title="Short practice sets" />
      {chapters.length === 0 ? (
        <EmptyState
          title="No practice ready yet"
          message="Practice appears once a chapter has enough lessons and questions."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {chapters.map((c) => {
            const bp = blueprintForChapter(c.chapterId);
            const firstSkill = c.inventory.mapping.skillIds[0];
            const moduleId = c.legacyModuleId;
            return (
              <Card key={c.chapterId}>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {c.title}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {c.itemCount} question{c.itemCount === 1 ? '' : 's'} across{' '}
                  {c.inventory.mapping.skillCount} skill
                  {c.inventory.mapping.skillCount === 1 ? '' : 's'}.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* §3 — opens a chooser. v0.49 launched
                      skillIds[0] with no choice at all. When a chapter
                      has exactly one usable concept the shell may still
                      launch it directly (handled by the outlet). */}
                  {firstSkill && (
                    <SecondaryButton
                      onClick={() => onChooseConcept(c.legacyModuleId ?? null, c.chapterId)}
                    >
                      Practise a concept
                    </SecondaryButton>
                  )}
                  <SecondaryButton onClick={() => onOpenChapter(c.chapterId)}>
                    Open chapter
                  </SecondaryButton>
                  {moduleId && (
                    <SecondaryButton
                      onClick={() => onLaunchMixedChapterPractice(moduleId)}
                    >
                      Mixed practice
                    </SecondaryButton>
                  )}
                  {bp && moduleId && (
                    <PrimaryButton
                      onClick={() => onLaunchChapterCheck(moduleId)}
                    >
                      Chapter check
                    </PrimaryButton>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


/** v0.50 §6 — turn a stored session into a name a student recognises.
 *
 *  Sessions carry either a concrete SkillId ('FR.02') or a legacy
 *  SkillMode ('mixed_fractions'). Neither is meaningful to a child, and
 *  neither should ever reach the screen. Where a session recorded its
 *  sampled skills we name the concepts; otherwise we fall back to the
 *  module name. */
export function friendlySessionLabel(session: {
  skillId: string;
  sampledSkillIds?: string[];
  chapterModuleId?: string;
  sessionPurpose?: string;
}): string {
  const sampled = session.sampledSkillIds ?? [];
  if (sampled.length === 1) {
    return SKILL_LABELS[sampled[0] as SkillId] ?? 'Practice';
  }
  const moduleId = session.chapterModuleId as ModuleId | undefined;
  const moduleName = moduleId ? MODULE_LABELS[moduleId] : undefined;
  if (sampled.length > 1 && moduleName) {
    return session.sessionPurpose === 'chapter_check'
      ? `${moduleName} — chapter check`
      : `${moduleName} — mixed practice`;
  }
  // Legacy sessions: derive from the SkillMode.
  const raw = session.skillId;
  if (raw.startsWith('mixed_')) {
    const m = raw.slice('mixed_'.length) as ModuleId;
    return MODULE_LABELS[m] ? `${MODULE_LABELS[m]} — mixed practice` : 'Mixed practice';
  }
  return SKILL_LABELS[raw as SkillId] ?? moduleName ?? 'Practice';
}

function ProgressTab({ studentId }: { studentId: string }) {
  const sessions = useMemo(
    () => recentActivityForStudent(studentId, { limit: 5 }),
    [studentId]
  );
  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Progress" title="What you have practised" />
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
        {sessions.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            You have not completed any sessions yet.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2 py-2">
                {/* v0.50 §6 — friendly concept name. This used to render
                    the raw session skillId ("FR.02", "mixed_fractions"),
                    which means nothing to a child. */}
                <span className="text-slate-800">
                  {friendlySessionLabel(s)}
                </span>
                <span className="text-slate-500">
                  {s.responses.length} question
                  {s.responses.length === 1 ? '' : 's'} ·{' '}
                  {s.completedAt
                    ? new Date(s.completedAt).toLocaleDateString()
                    : '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <details className="rounded-2xl bg-white p-3 ring-1 ring-slate-200 text-sm">
        <summary className="cursor-pointer text-slate-700">
          About this result
        </summary>
        <p className="mt-2 text-xs text-slate-600">
          These are practice sessions, not standardised tests. Your teacher
          can see fuller reports in their own view.
        </p>
      </details>
    </div>
  );
}

function ChapterDetail({
  chapterId, studentGrade, studentId, onBack,
  onLaunchLesson, onLaunchMixedChapterPractice, onLaunchChapterCheck,
}: {
  chapterId: string;
  studentGrade: Grade;
  studentId: string;
  onBack: () => void;
  onLaunchLesson: (skillId: SkillId) => void;
  onLaunchMixedChapterPractice: (moduleId: ModuleId) => void;
  onLaunchChapterCheck: (moduleId: ModuleId) => void;
}) {
  const resolved = resolveChapter(chapterId);
  if (!resolved) {
    return (
      <ChapterUnavailableView
        chapterTitle="Chapter not available"
        status="no_content"
        reasons={['This chapter link is not recognised.']}
        onBack={onBack}
      />
    );
  }
  if (!chapterBelongsToGrade(resolved, studentGrade)) {
    return (
      <ChapterUnavailableView
        chapterTitle="Not for your class"
        status="no_content"
        reasons={['This chapter is registered for a different class.']}
        onBack={onBack}
      />
    );
  }
  if (!canLaunchAssessment(resolved.inventory)) {
    return (
      <ChapterUnavailableView
        chapterTitle={resolved.displayTitle}
        status={resolved.inventory.status}
        reasons={resolved.inventory.reasons}
        onBack={onBack}
      />
    );
  }
  const legacyModule = resolved.primaryLegacyModuleId;
  if (!legacyModule) {
    return (
      <ChapterUnavailableView
        chapterTitle={resolved.displayTitle}
        status={resolved.inventory.status}
        reasons={['This chapter has no mapped Pragati content to launch yet.']}
        onBack={onBack}
      />
    );
  }
  // §3/§4 — a chapter with no executable blueprint has no chapter
  // check. We pass null rather than quietly launching mixed practice
  // under the "Chapter check" label; ChapterLandingPage hides the
  // action and says why.
  const bp = blueprintForChapter(resolved.chapterId);
  return (
    <ChapterLandingPage
      moduleId={legacyModule}
      studentId={studentId}
      onStartLearn={(skillId) => onLaunchLesson(skillId)}
      onStartPractice={() => onLaunchMixedChapterPractice(legacyModule)}
      onStartAssessment={
        bp ? () => onLaunchChapterCheck(legacyModule) : null
      }
      onBack={onBack}
    />
  );
}

// ---------------------------------------------------------------------------
// Chapter rows for a student's grade — no mutation, canonical resolver.
// ---------------------------------------------------------------------------

type ChapterRow = {
  chapterId: string;
  title: string;
  subtitle: string;
  legacyModuleId: ModuleId | null;
  inventory: ResolvedChapter['inventory'];
  itemCount: number;
  canLaunch: boolean;
};

export function chaptersForStudentGrade(grade: Grade): ChapterRow[] {
  const officials: ChapterRow[] = OFFICIAL_CHAPTERS.filter(
    (c) => c.grade === grade
  ).map((c) => {
    const resolved = resolveChapter(`official:${c.officialChapterId}`)!;
    return {
      chapterId: resolved.chapterId,
      title: resolved.displayTitle,
      subtitle:
        resolved.inventory.status === 'no_content'
          ? 'Not yet mapped'
          : `${resolved.inventory.registeredSkillCount} skills · ${resolved.inventory.totalItemCount} questions`,
      legacyModuleId: resolved.primaryLegacyModuleId,
      inventory: resolved.inventory,
      itemCount: resolved.inventory.totalItemCount,
      canLaunch: canLaunchAssessment(resolved.inventory),
    };
  });

  const mappedLegacy = new Set(
    officials.flatMap((r) => (r.legacyModuleId ? [r.legacyModuleId] : []))
  );
  const legacies: ChapterRow[] = MODULES_FOR_GRADE[grade]
    .filter((m) => !mappedLegacy.has(m))
    .map((m) => {
      const resolved = resolveChapter(`legacy:${m}`)!;
      return {
        chapterId: resolved.chapterId,
        title: resolved.displayTitle,
        subtitle:
          resolved.inventory.status === 'no_content'
            ? 'No content yet'
            : `${resolved.inventory.registeredSkillCount} skills · ${resolved.inventory.totalItemCount} questions`,
        legacyModuleId: m,
        inventory: resolved.inventory,
        itemCount: resolved.inventory.totalItemCount,
        canLaunch: canLaunchAssessment(resolved.inventory),
      };
    });

  return [...officials, ...legacies];
}
