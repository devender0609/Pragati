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
} from '../../types';
import { GRADE_COLORS } from '../../components/common/gradePalette';
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
import { canLaunchAssessment } from '../../curriculum/inventory';
import { blueprintForChapter } from '../../curriculum/chapterBlueprints';
import { findContinueTarget, recentActivityForStudent } from './studentData';
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
          You are in the middle of a set. Finish it, or use {exitLabel} to
          come back later.
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
}: {
  studentGrade: Grade;
  studentName: string;
  studentId: string;
  onSwitchTab: (t: StudentTab) => void;
  onOpenChapter: (id: string | null) => void;
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
      {target ? (
        <Card>
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
              {chapterArtFor(target.resolved.primaryLegacyModuleId)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {target.isResume ? 'Continue learning' : 'Start learning'}
              </div>
              <div className="mt-0.5 text-base font-semibold text-slate-900">
                {target.resolved.displayTitle}
              </div>
            </div>
            <PrimaryButton
              onClick={() => onOpenChapter(target.resolved.chapterId)}
            >
              {target.isResume ? 'Continue' : 'Start'}
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

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Learn" title="Chapters for your class" />
      {chapters.length === 0 ? (
        <EmptyState
          title="Chapters are on the way"
          message="Your class does not have any chapters ready yet."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {chapters.map((c) => (
            <ChapterCard
              key={c.chapterId}
              title={c.title}
              subtitle={c.subtitle}
              status={c.inventory.status}
              statusReasons={c.inventory.reasons}
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
  studentGrade, onOpenChapter, onLaunchConceptPractice,
  onLaunchMixedChapterPractice, onLaunchChapterCheck,
}: {
  studentGrade: Grade;
  onOpenChapter: (id: string | null) => void;
  onLaunchConceptPractice: (skillId: SkillId) => void;
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
        <div className="grid gap-3 sm:grid-cols-2">
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
                  {firstSkill && (
                    <SecondaryButton
                      onClick={() => onLaunchConceptPractice(firstSkill)}
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

function ProgressTab({ studentId }: { studentId: string }) {
  const sessions = useMemo(
    () => recentActivityForStudent(studentId, { limit: 5 }),
    [studentId]
  );
  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Progress" title="What you have practised" />
      <Card>
        <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
        {sessions.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            You have not completed any sessions yet.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2 py-2">
                <span className="text-slate-800">{s.skillId}</span>
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
