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
import { studentChapterTitle } from '../../curriculum/studentNames';
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
import { OfficialChapterLanding } from './OfficialChapterLanding';
import { StudentHomeView, type StudentHomeViewProps } from './StudentHomeView';
import { isClass6Core } from '../../curriculum/legacyDisposition';
import {
  sectionProgressForChapter,
  // v0.71 §6 — `continueFrom` is no longer used here. It returns the
  // next section in OFFICIAL order regardless of whether Pragati can
  // open it, which made the Progress CTA point at §7.1 — a section
  // marked Coming soon — and label it "Continue" when nothing had been
  // started. It remains correct for the question it answers; it was
  // answering the wrong one.
  unattributedSessionCount,
} from '../../curriculum/sectionProgress';
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
import {

  type SectionDotState,
} from '../../design/StudentHomeBlocks';
import { ChapterMotif } from '../../design/ChapterMotif';
import { class6ChapterCards } from '../../curriculum/studentChapterModel';
import { nextActionForChapter } from '../../curriculum/nextAction';
import { officialChapterRows } from './OfficialChapterLanding';
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
  /** v0.62 §3 — replaces the Learn tab body for verified curricula. */
  learnOverride?: ReactNode;
  /** v0.64 §5 — open an official section from the official chapter. */
  onOpenSection?: (officialSectionId: string) => void;
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
  /** §9 — live formal assignment for this student's classroom, if any. */
  growthAssignment?: { assignmentId: string } | null;
  /** §11 — true when an unfinished sitting exists. */
  growthInProgress?: boolean;
  onStartGrowthCheck?: () => void;

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
    onResumeSession, growthAssignment, growthInProgress, onStartGrowthCheck,
    sessionChild, sessionLocked = false, onExitSession,
    exitLabel = 'Save & Exit',
    learnOverride,
    onOpenSection,
  } = props;


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
        onOpenSection={onOpenSection}
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
        growthAssignment,
        growthInProgress,
        onStartGrowthCheck,
        onLaunchMixedChapterPractice,
        onLaunchChapterCheck,
        learnOverride,
        onOpenSection,
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
    // v0.76 §10 — the student bar was a tinted card with a hairline ring
    // sitting above every tab, which put a bordered rectangle at the top
    // of every screen before the screen said anything. It is now a row:
    // a name, a class, and the nav. Nothing to draw a box around.
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-display text-lg font-bold tracking-tight text-ink-900">
            Hi, {studentName}
          </p>
          <p className="text-sm text-ink-400">
            Class {studentGrade.replace('class', '')} Mathematics
          </p>
        </div>
        {sessionLocked ? (
          <button
            type="button"
            onClick={onExitSession}
            className="inline-flex min-h-[44px] items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink-800 shadow-sm ring-1 ring-ink-100 hover:bg-paper-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
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
  growthAssignment?: { assignmentId: string } | null;
  growthInProgress?: boolean;
  onStartGrowthCheck?: () => void;
  onLaunchMixedChapterPractice: (moduleId: ModuleId) => void;
  onLaunchChapterCheck: (moduleId: ModuleId) => void;
  learnOverride?: ReactNode;
  onOpenSection?: (officialSectionId: string) => void;
}): ReactNode {
  switch (args.tab) {
    case 'home':
      return <HomeTab {...args} />;
    case 'learn':
      // v0.62 §3 — verified-curriculum pathway takes precedence.
      return args.learnOverride ?? <LearnTab {...args} />;
    case 'practice':
      return <PracticeTab {...args} />;
    case 'progress':
      return <ProgressTab {...args} />;
  }
}

function HomeTab({
  studentGrade, studentId, studentName, onSwitchTab, onOpenChapter, onOpenSection,
  onResumeSession, growthAssignment, growthInProgress, onStartGrowthCheck,
}: {
  studentGrade: Grade;
  studentId: string;
  studentName: string;
  onOpenSection?: (officialSectionId: string) => void;
  onSwitchTab: (t: StudentTab) => void;
  onOpenChapter: (id: string | null) => void;
  onResumeSession?: (sessionId: string) => void;
  /** §9 — set only when a live formal assignment exists. */
  growthAssignment?: { assignmentId: string } | null;
  growthInProgress?: boolean;
  onStartGrowthCheck?: () => void;
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

  // §1/§11 — an unfinished set outranks everything else on Home.
  const openSet = useMemo(
    () => findResumableSession(loadSessions(), studentId),
    [studentId]
  );

  // v0.70 §12/§28 — REAL activity only.
  //
  // `firstRun` decides between two genuinely different screens. It is
  // derived from recorded sessions, never assumed: a student with no
  // history must never see "Continue", and a student with history must
  // not be greeted as though they had none.
  const official = useMemo(
    () => (studentGrade === 'class6' ? class6ChapterCards() : []),
    [studentGrade]
  );
  const activity = useMemo(() => {
    const mine = sessionsForStudentIn(loadSessions(), studentId, {
      completedOnly: true,
    });
    const answered = mine.reduce((a, sn) => a + sn.responses.length, 0);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      completedSessions: mine.length,
      answered,
      thisWeek: mine.filter((sn) => (sn.completedAt ?? 0) > weekAgo).length,
    };
  }, [studentId]);

  const firstRun =
    !openSet && !target?.isResume && activity.completedSessions === 0;

  // §12 — one dot per official section of the chapter the student is
  // actually working in. Every state is recorded; there is no "mastered".
  const fractionsProgress = useMemo(
    () => sectionProgressForChapter('ncert_gp_c6_ch07_fractions', loadSessions()),
    [studentId, activity.completedSessions]
  );
  const dotStates: SectionDotState[] = fractionsProgress.map((sp) =>
    sp.state === 'practice_completed'
      ? 'practised'
      : sp.state === 'in_progress'
        ? 'in_progress'
        : 'not_started'
  );
  const startedCount = fractionsProgress.filter(
    (sp) => sp.state !== 'not_started'
  ).length;

  // v0.70 §27 — THE HERO MUST AGREE WITH LEARN.
  //
  // `findContinueTarget` resolves through the LEGACY chapter model,
  // which still considers Lines and Angles openable. After the §27
  // truthfulness fix, Learn correctly shows it as Coming soon — so Home
  // offered a chapter that Learn said did not exist yet, and tapping it
  // led to a page where all eleven parts were unavailable.
  //
  // Home now takes its hero from the same official availability the
  // rest of the product uses. One decision-maker, again.
  const heroChapterId = target?.resolved.chapterId ?? null;
  const heroOfficial =
    official.find(
      (c) => c.officialChapterId === heroChapterId && c.availability === 'available'
    ) ?? official.find((c) => c.availability === 'available') ?? null;

  // The parts of the hero chapter that genuinely open. `provenance` is
  // the same gate the chapter journey uses, so Home cannot offer a part
  // the chapter itself calls Coming soon.
  const heroRows = useMemo(
    () =>
      heroOfficial
        ? officialChapterRows(heroOfficial.officialChapterId, studentId)
        : [],
    [heroOfficial?.officialChapterId, studentId]
  );
  const heroPartTotal = heroRows.length;
  const heroParts = heroRows.filter((r) => r.provenance !== null).slice(0, 4);

  // v0.76 §1A — the composition lives in StudentHomeView. HomeTab keeps
  // the data decisions, which are the part that must not drift: what
  // counts as first run, which chapter the hero is allowed to offer, and
  // which parts genuinely open. None of that changed.
  const toPlate = (c: (typeof official)[number]) => ({
    officialChapterId: c.officialChapterId,
    number: c.number,
    title: c.title,
    available: c.availability === 'available',
    statusLine: c.availability === 'available' ? c.statusLine : 'Being written',
  });

  const heroContinuing =
    target?.isResume && heroOfficial?.officialChapterId === heroChapterId;

  const hero: StudentHomeViewProps['hero'] = growthAssignment
    ? {
        kind: 'growth',
        inProgress: !!growthInProgress,
        onStart: () => onStartGrowthCheck?.(),
      }
    : openSet
      ? {
          kind: 'resume',
          remaining: resumeSummary(openSet).remaining,
          onResume: () => onResumeSession?.(openSet.id),
        }
      : heroOfficial
        ? {
            kind: 'chapter',
            chapter: toPlate(heroOfficial),
            kicker: heroContinuing
              ? `Chapter ${heroOfficial.number}, where you left off`
              : `Chapter ${heroOfficial.number}`,
            detail: firstRun
              ? 'Pragati follows your textbook, chapter by chapter. This is the first one ready for you.'
              : undefined,
            meta: heroOfficial.statusLine,
            actionLabel: primaryActionLabel(
              studentGrade,
              heroContinuing ? 'continue' : 'start'
            ),
            onOpen: () =>
              onOpenChapter(`official:${heroOfficial.officialChapterId}`),
          }
        : target
          ? {
              kind: 'chapter',
              chapter: {
                officialChapterId: target.resolved.chapterId,
                number: 0,
                title: studentChapterTitle(
                  target.resolved.displayTitle,
                  target.resolved.primaryLegacyModuleId
                ),
                available: true,
                statusLine: '',
              },
              kicker: heroContinuing ? 'Where you left off' : 'Start here',
              actionLabel: primaryActionLabel(
                studentGrade,
                heroContinuing ? 'continue' : 'start'
              ),
              onOpen: () => onOpenChapter(target.resolved.chapterId),
            }
          : { kind: 'empty', onBrowse: () => onSwitchTab('learn') };

  return (
    <StudentHomeView
      studentName={studentName}
      hero={hero}
      parts={heroParts.map((r) => ({
        officialSectionId: r.officialSectionId,
        sectionNumber: r.sectionNumber,
        title: r.title,
      }))}
      partsTotal={heroPartTotal}
      partsChapterTitle={heroOfficial?.title ?? 'this chapter'}
      onOpenPart={(id) => onOpenSection?.(id)}
      chapters={official.map(toPlate)}
      onOpenChapter={(id) => onOpenChapter(`official:${id}`)}
      onSeeAllChapters={() => onSwitchTab('learn')}
      showPractice={activity.completedSessions > 0}
      onPractise={() => onSwitchTab('practice')}
      activity={activity}
      dotStates={dotStates}
      startedCount={startedCount}
      dotsChapterTitle="Fractions"
      firstRun={firstRun}
    />
  );
}


function LearnTab({
  studentGrade, onOpenChapter,
}: {
  studentGrade: Grade;
  onOpenChapter: (id: string | null) => void;
}) {
  const chapters = chaptersForStudentGrade(studentGrade);
  const available = chapters.filter((c) => c.canLaunch);
  const unavailable = chapters.filter((c) => !c.canLaunch);
  const tokens = tokensForGrade(studentGrade);
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
      {/* v0.56 §8 — "Chapters" implied these match official textbook
          chapters. Most are internal Pragati bundles and no grade is
          source-verified yet, so the neutral word is used until a grade
          genuinely maps to official chapters. */}
      <PageHeader eyebrow="Learn" title="Math topics for your class" />
      {chapters.length === 0 ? (
        <EmptyState
          title="Math topics are on the way"
          message="Your class does not have any math topics ready yet."
        />
      ) : (
        <>
          {/* v0.55 §13 — available chapters lead. Unavailable ones move
              into a subdued, collapsed section so a Class 12 student
              does not open Learn to a wall of greyed-out cards. The gap
              is NOT hidden — it is just not the headline. */}
          {available.length > 0 && (
            <div className={`grid gap-3 ${gridCols}`}>
              {available.map((c) => (
                <ChapterCard
                  key={c.chapterId}
                  title={studentChapterTitle(c.title, c.legacyModuleId)}
                  subtitle={c.subtitle}
                  artwork={chapterArtFor(c.legacyModuleId)}
                  status={c.inventory.status}
                  statusReasons={c.inventory.reasons}
                  statusLabel={STUDENT_STATUS_LABEL[c.inventory.status]}
                  ctaLabel="Open"
                  onClick={() => onOpenChapter(c.chapterId)}
                />
              ))}
            </div>
          )}

          {unavailable.length > 0 && (
            <details className="mt-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <summary className="min-h-[44px] cursor-pointer text-sm font-medium text-slate-600">
                More chapters ({unavailable.length}) — coming soon
              </summary>
              <ul className="mt-2 space-y-1">
                {unavailable.map((c) => (
                  <li
                    key={c.chapterId}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200"
                  >
                    <span className={`text-slate-500 ${tokens.bodyText}`}>
                      {studentChapterTitle(c.title, c.legacyModuleId)}
                    </span>
                    {/* Plain student language. No source, review, or
                        readiness codes ever reach this list. */}
                    <span className="text-xs text-slate-400">Coming soon</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
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

  // v0.74 §9 — PRACTICE WAS NEVER AUDITED, AND STILL HAD THE DEFECT
  // v0.71 §9 FIXED EVERYWHERE ELSE.
  //
  // This tab listed "Decimals", "Ratio & Proportion" and "Algebra
  // Basics" beside "Fractions" and "Symmetry", all as plain chapter
  // titles. The first three have NO chapter in the current Ganita
  // Prakash Grade 6 book — `legacyDisposition.ts` records the evidence
  // and `isClass6Core` already excluded them from the Learn pathway.
  // Practice never asked.
  //
  // A Class 6 student was therefore shown "Decimals" as though it were
  // part of their textbook. Nothing is removed — the questions are real
  // and working — but displaced material is separated and labelled, as
  // it is on the Fractions landing.
  const core = chapters.filter((c) =>
    studentGrade === 'class6' ? isClass6Core(c.legacyModuleId ?? '') : true
  );
  const displaced = chapters.filter((c) => !core.includes(c));

  const renderCard = (c: (typeof chapters)[number]) => {
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
              onClick={() => onChooseConcept(c.legacyModuleId ?? null, c.chapterId)}
            >
              Practise a concept
            </SecondaryButton>
          )}
          <SecondaryButton onClick={() => onOpenChapter(c.chapterId)}>
            Open chapter
          </SecondaryButton>
          {moduleId && (
            <SecondaryButton onClick={() => onLaunchMixedChapterPractice(moduleId)}>
              Mixed practice
            </SecondaryButton>
          )}
          {bp && moduleId && (
            <PrimaryButton onClick={() => onLaunchChapterCheck(moduleId)}>
              Chapter check
            </PrimaryButton>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Practice"
        title="Short practice sets"
        // v0.72 §13's wording, applied to the tab that never had it.
        subtitle="Question sets related to each chapter — not the chapter lessons themselves."
      />
      {chapters.length === 0 ? (
        <EmptyState
          title="No practice ready yet"
          message="Practice appears once a chapter has enough lessons and questions."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {core.map(renderCard)}
          </div>

          {displaced.length > 0 && (
            <section className="space-y-3">
              <div className="rounded-xl2 border border-slate-200 bg-slate-50 p-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Extra practice
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  These topics are not chapters in your Class 6 book. The
                  questions still work, and a teacher may still set them.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {displaced.map(renderCard)}
              </div>
            </section>
          )}
        </>
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


/**
 * v0.64 §2/§3 — official-section progress for the Class 6 pilot.
 *
 * States are factual: not started / started / practice done. There is
 * no percentage, no ring, and no "strong" — the engine that produces
 * `strong` is a heuristic over recent accuracy and has never been
 * validated as a learning claim.
 *
 * Activity that cannot be attributed to an official section is shown as
 * a count rather than dropped, so a student's history does not appear
 * to shrink.
 */
function SectionProgressCard({
  studentId,
  onOpenSection,
}: {
  studentId: string;
  onOpenSection?: (officialSectionId: string) => void;
}) {
  const { rows, unattributed } = useMemo(() => {
    const sessions = loadSessions().filter((s) => s.studentId === studentId);
    const progress = sectionProgressForChapter(
      'ncert_gp_c6_ch07_fractions',
      sessions
    );
    return {
      rows: progress,
      unattributed: unattributedSessionCount(sessions),
    };
  }, [studentId]);

  const started = rows.filter((r) => r.state !== 'not_started').length;
  const done = rows.filter((r) => r.state === 'practice_completed').length;

  // v0.72 §14/§15 — THE PROGRESS CTA NOW SAYS WHAT IT OPENS.
  //
  // v0.71 fixed the verb (Start vs Continue) and made the target
  // routable, which was right and not sufficient. The button still read
  // "Start: 7.2 Fractional Units as Parts of a Whole" above "0 parts
  // started" — naming an official textbook section whose lesson is
  // unpublished, when what opened was legacy related practice.
  //
  // The CTA now comes from the one canonical selector. A related-practice
  // action is labelled as related practice and carries no section
  // number; only an official kind may name a section.
  const nextAction = nextActionForChapter(
    'ncert_gp_c6_ch07_fractions',
    loadSessions()
  );

  const LABEL: Record<string, string> = {
    not_started: 'Not started',
    in_progress: 'In progress',
    practice_completed: 'Practice completed',
  };

  const DOT: Record<string, string> = {
    not_started: 'border-slate-300 bg-white',
    in_progress: 'border-practice-500 bg-practice-100',
    practice_completed: 'border-practice-600 bg-practice-600',
  };

  return (
    <section className="rounded-xl3 border border-slate-200 bg-white p-4 shadow-card">
      {/* §7 — nine lines reading "Not started" is a list, not progress.
          The counts lead, a compact path shows the shape of the chapter,
          and each row carries its own state. No percentage and no
          mastery: every state below is something Pragati has actually
          recorded. */}
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl2"
          style={{ backgroundColor: '#4f46e517', color: '#4f46e5' }}
        >
          <ChapterMotif motif="fractions" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-bold text-slate-900">
            Fractions
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Chapter 7 · {rows.length} parts
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-6">
        <div>
          <p className="font-display text-2xl font-bold leading-none text-slate-900">
            {started}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">parts started</p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold leading-none text-practice-700">
            {done}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            practice completed
          </p>
        </div>
      </div>

      <ol className="mt-4 space-y-1.5">
        {rows.map((r) => (
          <li key={r.officialSectionId} className="flex items-center gap-2.5">
            <span
              className={`h-3 w-3 shrink-0 rounded-full border-2 ${DOT[r.state]}`}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 text-sm leading-snug text-slate-800">
              <span className="text-slate-400">{r.sectionNumber}</span>{' '}
              {r.title}
            </span>
            <span
              className={
                r.state === 'not_started'
                  ? 'shrink-0 text-xs text-slate-400'
                  : 'shrink-0 text-xs font-semibold text-practice-700'
              }
            >
              {LABEL[r.state]}
            </span>
          </li>
        ))}
      </ol>

      {nextAction.kind !== 'none' && nextAction.activityId && onOpenSection && (
        <button
          type="button"
          onClick={() => onOpenSection(nextAction.activityId!)}
          className="tap mt-4 w-full rounded-xl2 bg-slate-900 px-4 py-2.5 text-left text-sm font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          {nextAction.verb}: {nextAction.label}
          {nextAction.qualifier && (
            <span className="mt-0.5 block text-xs font-medium text-white/70">
              {nextAction.qualifier}
            </span>
          )}
        </button>
      )}

      {unattributed > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          You also have {unattributed} earlier practice session
          {unattributed === 1 ? '' : 's'} that is not linked to a part of
          this chapter.
        </p>
      )}
    </section>
  );
}

function ProgressTab({
  studentId,
  studentGrade,
  onOpenSection,
}: {
  studentId: string;
  studentGrade?: Grade;
  onOpenSection?: (officialSectionId: string) => void;
}) {
  const sessions = useMemo(
    () => recentActivityForStudent(studentId, { limit: 5 }),
    [studentId]
  );
  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Progress" title="What you have practised" />

      {/* v0.73 §19 — desktop composition. At `lg` the chapter progress
          card holds the main column and recent activity becomes
          secondary detail beside it, which is the relationship the
          content already had and the single stacked column obscured. */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6">
      <div className="min-w-0 space-y-4">
      {/* v0.64 §2 — SECTION-AWARE PROGRESS, actually rendered.
          v0.63 built `sectionProgressForChapter` and wired it only to
          tests; the real Progress tab still showed module/skill
          activity. This is the curriculum-grain view a student can act
          on, with recent activity kept below as secondary detail. */}
      {studentGrade === 'class6' && (
        <SectionProgressCard
          studentId={studentId}
          onOpenSection={onOpenSection}
        />
      )}
      </div>

      <div className="min-w-0 space-y-4">
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
      </div>
    </div>
  );
}

function ChapterDetail({
  chapterId, studentGrade, studentId, onBack,
  onLaunchLesson, onLaunchMixedChapterPractice, onLaunchChapterCheck,
  onOpenSection,
}: {
  chapterId: string;
  studentGrade: Grade;
  studentId: string;
  onBack: () => void;
  onLaunchLesson: (skillId: SkillId) => void;
  onLaunchMixedChapterPractice: (moduleId: ModuleId) => void;
  onLaunchChapterCheck: (moduleId: ModuleId) => void;
  /** v0.64 §5 — official sections are addressed by official ID. */
  onOpenSection?: (officialSectionId: string) => void;
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
  // v0.64 §5/§6 — OFFICIAL CHAPTERS GET THE OFFICIAL INTERIOR.
  //
  // Before this, an official chapter resolved to its
  // `primaryLegacyModuleId` and rendered ChapterLandingPage, so the
  // structure the child saw came from Pragati's module (its skills, its
  // "0 of 9 skills strong" ring) rather than from the book. The legacy
  // page is retained below for chapters that have no official record.
  if (chapterId.startsWith('official:')) {
    const officialChapterId = chapterId.slice('official:'.length);
    return (
      <OfficialChapterLanding
        officialChapterId={officialChapterId}
        studentId={studentId}
        onBack={onBack}
        onOpenSection={(sectionId) => onOpenSection?.(sectionId)}
      />
    );
  }

  if (!canLaunchAssessment(resolved.inventory)) {
    return (
      <ChapterUnavailableView
        chapterTitle={studentChapterTitle(resolved.displayTitle, resolved.primaryLegacyModuleId)}
        status={resolved.inventory.status}
        reasons={resolved.inventory.reasons}
        onBack={onBack}
      />
    );
  }
  const legacyModule = resolved.primaryLegacyModuleId;

  // v0.64 §4/§5 — DEFENCE IN DEPTH for Class 6.
  //
  // Class6ChapterList already omits displaced modules, but any other
  // route that reached this component with a `decimals` /
  // `ratio_proportion` / `algebra` chapter id would render the legacy
  // module page — complete with "0 of 5 skills strong" and the DE.01…
  // concept map. Both are things §3 and §4 forbid on a Class 6 student
  // screen, so the refusal belongs at the routing layer, not only in
  // the list that happens to feed it today.
  if (
    studentGrade === 'class6' &&
    legacyModule &&
    !isClass6Core(legacyModule)
  ) {
    return (
      <ChapterUnavailableView
        chapterTitle={resolved.displayTitle}
        status="no_content"
        reasons={[
          'This topic is not part of Class 6 in the current textbook.',
        ]}
        onBack={onBack}
      />
    );
  }

  if (!legacyModule) {
    return (
      <ChapterUnavailableView
        chapterTitle={studentChapterTitle(resolved.displayTitle, resolved.primaryLegacyModuleId)}
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
      // §3 — strip authoring metadata before a student sees it.
      title: studentChapterTitle(resolved.displayTitle, resolved.primaryLegacyModuleId),
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
        title: studentChapterTitle(resolved.displayTitle, resolved.primaryLegacyModuleId),
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
