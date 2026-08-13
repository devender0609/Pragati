import { lazy, Suspense, useEffect, useState } from 'react';
import {
  ITEMS,
  evaluateNumericAnswer,
  type Item,
} from './data/items';
import {
  buildBlueprintSession,
  buildSessionPool,
  createInitialState,
  filterItemsBySkillMode,
  pickNextItem,
  updateAbility,
  shouldStop,
  SESSION_SIZE,
  type EngineState,
} from './lib/adaptiveEngine';
import { AssessmentPicker } from './components/AssessmentPicker';
import {
  pickRecommendedBlueprint,
  type AssessmentBlueprint,
} from './curriculum';
import {
  findOrCreateStudent,
  generateId,
  getActivePilot,
  getCompletedSessionsForStudent,
  loadAppMode,
  loadAssignments,
  loadSessions,
  loadStudents,
  saveAppMode,
  saveSession,
} from './lib/storage';
import {
} from './lib/scoring';
import {
  MODULE_FOR_SKILL,
  SKILLS_BY_MODULE,
  SKILL_MODE_LABELS,
  type AppMode,
  type AssessmentAssignment,
  type AssessmentWindow,
  type ModuleId,
  type Session,
  type SkillId,
  type SkillMode,
  type Student,
} from './types';
// v0.19: heavy teacher-only views are loaded lazily so they aren't in the
// initial bundle. Routes that mount them are wrapped in <Suspense>.
const PilotReportView = lazy(() =>
  import('./components/PilotReportView').then((m) => ({ default: m.PilotReportView }))
);
import { StudentHome } from './components/StudentHome';
import {
  StudentRouteOutlet,
  type StudentLocation,
} from './features/student/StudentRouteOutlet';
import { startChapterSession } from './features/session/StudentSessionController';
import {
  hintsAllowed,
  type SessionPurpose,
} from './features/session/sessionPurpose';
import { blueprintForModule } from './curriculum/chapterBlueprints';
import { ProfileCorrectionScreen } from './features/student/ProfileCorrectionScreen';
import { renderInStudentShell } from './features/student/wrapInStudentShell';
import { Assessment } from './features/session/AssessmentView';
import { TeacherShell, TeacherOverviewBody } from './features/teacher/TeacherShell';
import { TeacherInsightsBody } from './features/teacher/TeacherInsightsBody';
import { TeacherResourcesBody } from './features/teacher/TeacherResourcesBody';
import { TeacherResourceOutlet } from './features/teacher/TeacherResourceOutlet';
import { normalizeGrade } from './lib/gradeNormalization';
// v0.48 §9 — TeacherWorkflowHome removed as a primary render; the
// new TeacherShell + its tab-body components take over.
import { AssignmentsView } from './components/AssignmentsView';
import { AssignmentForm } from './components/AssignmentForm';
const TeachingPlanView = lazy(() =>
  import('./components/TeachingPlanView').then((m) => ({ default: m.TeachingPlanView }))
);
import { PilotSetupView } from './components/PilotSetupView';
import { LearnView } from './components/LearnView';
const AlignmentReviewView = lazy(() =>
  import('./components/AlignmentReviewView').then((m) => ({
    default: m.AlignmentReviewView,
  }))
);
const ItemReviewView = lazy(() =>
  import('./components/ItemReviewView').then((m) => ({ default: m.ItemReviewView }))
);
import { ResultsView } from './components/ResultsView';
const ClassDashboardView = lazy(() =>
  import('./components/ClassDashboardView').then((m) => ({
    default: m.ClassDashboardView,
  }))
);
import { NavBar } from './components/NavBar';
// v0.49 §12 — extracted screens. Behaviour unchanged; these were
// inline in App.tsx through v0.48.
import { Class6MathDashboard } from './features/legacy/Class6MathDashboard';
import { ModuleDashboard } from './features/legacy/ModuleDashboard';
import { TeacherStudentList } from './features/teacher/TeacherStudentList';
import { StudentDetail } from './features/teacher/TeacherStudentDetail';
import { Footer } from './components/Footer';
import { StartForm } from './components/StartForm';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { ClassroomsView } from './components/ClassroomsView';
import { StudentLearningPath } from './components/StudentLearningPath';
import { OnboardingFlow } from './components/OnboardingFlow';
import { JoinClassroomView } from './components/JoinClassroomView';
import { ImportedSubmissionsView } from './components/ImportedSubmissionsView';
import { ClassroomWorkflowTest } from './components/ClassroomWorkflowTest';
const CurriculumCoverageView = lazy(() =>
  import('./components/CurriculumCoverageView').then((m) => ({
    default: m.CurriculumCoverageView,
  }))
);
import { loadOnboardingState } from './lib/onboarding';
import { seedSampleData } from './lib/sampleData';
import { startAutoSync } from './lib/sync';
import {
  retrySubmitStudentSession,
  submitStudentSession,
  type SubmissionState,
} from './lib/accessCodes';

type View =
  | 'landing'        // student-mode home
  | 'teacherLanding' // teacher-mode home
  | 'class6math'     // top-level: 4 module cards (teacher-only nav target)
  | 'module'         // per-module dashboard (skill cards in that module)
  | 'learn'
  | 'startForm'
  | 'assessment'
  | 'results'
  | 'teacher'
  | 'classDashboard'
  | 'studentDetail'
  | 'itemReview'        // v0.8: per-item review list + form
  | 'pilotSetup'        // v0.8: start / end a pilot
  | 'teachingPlan'      // v0.8: planning summary
  | 'alignmentReview'   // v0.10: CBSE/NCERT-informed alignment dashboard
  | 'assignments'       // v0.11: list of teacher assignments
  | 'assignmentForm'    // v0.11: create / edit an assignment
  | 'pilotReport'       // v0.12: pilot report (per-pilot or all-data)
  | 'classrooms'        // v0.17: classroom roster management
  | 'learningPath'      // v0.17: per-student guided learning path
  | 'joinClassroom'    // v0.19: student enters access code
  | 'importedSubmissions'  // v0.21: imported-from-code session review
  | 'classroomTest'        // v0.23: teacher-only classroom workflow test
  | 'assessmentPicker'    // v0.27: registry-driven grade → subject → assessment picker
  | 'curriculumCoverage'; // v0.46: admin/research chapter catalogue view

export default function App() {
  // v0.49 §15 — found by the visual review: the initial view was
  // hard-coded to 'landing', so a signed-in teacher who reloaded the
  // app landed on the STUDENT shell (Home/Learn/Practice/Progress) and
  // had to switch modes again. The stored app mode decides the first
  // screen. Pre-existing since v0.8; surfaced by screenshotting
  // teacher mode from a cold load.
  const [view, setView] = useState<View>(() =>
    loadAppMode() === 'teacher' ? 'teacherLanding' : 'landing'
  );
  // v0.47 — canonical StudentShell state. `studentTab` is the active
  // primary tab (home/learn/practice/progress). `openChapterId` is
  // the chapter overlay inside the Learn tab. These live in App.tsx
  // for now because App still owns session start/stop; a follow-up
  // iteration will move them into the shell entirely.
  const [studentTab, setStudentTab] =
    useState<'home' | 'learn' | 'practice' | 'progress'>('home');
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);
  // v0.49 §1 — where the student is inside the shell. A concept lesson
  // is a location within the shell, not a separate top-level view.
  const [studentLocation, setStudentLocation] =
    useState<StudentLocation>({ kind: 'tab' });
  // v0.49 §3 — the purpose of the session currently running. Drives
  // hint availability and is persisted on the Session record.
  const [sessionPurpose, setSessionPurpose] =
    useState<SessionPurpose>('practice');
  // v0.49 §2 — Save & Exit confirmation. Set when the student asks to
  // leave a set with an unanswered question on screen; cleared when
  // they either confirm or go back to the question.
  const [exitPromptOpen, setExitPromptOpen] = useState(false);
  const [teacherTab, setTeacherTab] =
    useState<'overview' | 'classes' | 'assign' | 'insights' | 'resources'>('overview');
  // v0.49 §9 — the chapter a teacher has drilled into on the Resources
  // tab. Rendered INSIDE TeacherShell, so the teacher never leaves the
  // canonical shell to read a chapter's contents.
  const [teacherChapterId, setTeacherChapterId] = useState<string | null>(null);
  // v0.49 §8 — the classroom Insights is scoped to. null = all local data.
  const [teacherClassroomId, setTeacherClassroomId] =
    useState<string | null>(null);
  const [engine, setEngine] = useState<EngineState>(createInitialState);
  const [sessionPool, setSessionPool] = useState<Item[]>([]);
  const [current, setCurrent] = useState<Item | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [numericInput, setNumericInput] = useState<string>('');
  const [itemStartTs, setItemStartTs] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  // v0.16.1: in-UI banner used when a defensive check (e.g., a skill mode
  // with zero items) needs to surface a clear message instead of a blank
  // screen. Cleared on next successful navigation.
  const [bannerError, setBannerError] = useState<string | null>(null);

  const [session, setSession] = useState<Session | null>(null);

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  // Refresh trigger so UI updates after writes to localStorage.
  const [storeVersion, setStoreVersion] = useState(0);
  const bumpStore = () => setStoreVersion((v) => v + 1);

  const [prefillStudent, setPrefillStudent] = useState<Student | null>(null);

  // The skill currently being studied in the Learn view, and (optionally)
  // the skill the StartForm should pre-select when navigated from a
  // skill card or a module dashboard.
  const [learnSkill, setLearnSkill] = useState<SkillId>('FR.02');
  const [prefillSkillMode, setPrefillSkillMode] = useState<SkillMode | null>(
    null
  );
  // The module the user has drilled into from the Class 6 Math dashboard.
  const [currentModule, setCurrentModule] = useState<ModuleId>('fractions');
  // The item currently open in the Item Review form. Null = list view.
  const [reviewItemId, setReviewItemId] = useState<string | null>(null);
  // The assignment currently being edited; null = create new.
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(
    null
  );
  // The assignment the student is about to start from the home page —
  // passed through StartForm into the session as `assignmentId`.
  const [prefillAssignment, setPrefillAssignment] =
    useState<AssessmentAssignment | null>(null);
  // v0.8: app-mode (student / teacher), persisted to localStorage.
  const [appMode, setAppModeState] = useState<AppMode>(() => loadAppMode());
  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    saveAppMode(mode);
  };
  // v0.17: teacher sign-in modal open/close state.
  // v0.18: track the modal's initial mode (signin / signup / forgot).
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [loginInitialMode, setLoginInitialMode] =
    useState<'signin' | 'signup' | 'forgot'>('signin');

  // v0.18: onboarding wizard. Opens once per device (gated by localStorage).
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(
    () => !loadOnboardingState().completed
  );

  // v0.21: structured submission status for the just-finished session.
  // null = still computing or no session yet; otherwise renders on Results.
  const [submissionState, setSubmissionState] = useState<SubmissionState | null>(null);

  // v0.18: kick the background auto-sync once at mount (no-op in
  // local-only mode or when no teacher is signed in).
  useEffect(() => {
    startAutoSync();
  }, []);

  useEffect(() => {
    // If the student lands on a teacher-only view but is in student mode,
    // bounce them back to the student home.
    const teacherViews: View[] = [
      'teacher',
      'teacherLanding',
      'classDashboard',
      'studentDetail',
      'itemReview',
      'pilotSetup',
      'teachingPlan',
      'alignmentReview',
      'assignments',
      'assignmentForm',
      'classrooms',
    ];
    if (appMode === 'student' && teacherViews.includes(view)) {
      setView('landing');
    }
  }, [appMode, view]);

  const goLearn = (skill: SkillId) => {
    setLearnSkill(skill);
    setCurrentModule(MODULE_FOR_SKILL[skill]);
    setView('learn');
  };

  const goModule = (m: ModuleId) => {
    setCurrentModule(m);
    setView('module');
  };

  const goAssessmentForSkill = (mode: SkillMode) => {
    setPrefillStudent(null);
    setPrefillSkillMode(mode);
    setView('startForm');
  };

  const startAssessmentFor = (
    student: Student,
    window: AssessmentWindow,
    skillMode: SkillMode,
    fromAssignment?: AssessmentAssignment
  ) => {
    // v0.28 — when the caller launched the default "Start recommended
    // assessment" flow (skillMode === 'mixed' and no explicit
    // assignment), route through the registry so the new Session
    // carries curriculum + blueprint context instead of just the
    // legacy free-text grade. If the student's grade doesn't resolve
    // to a registered blueprint, fall through to the legacy path so
    // nothing that worked before is lost.
    if (skillMode === 'mixed' && !fromAssignment) {
      const rec = pickRecommendedBlueprint({
        gradeId: student.gradeId,
        grade: student.grade,
        curriculumId: student.curriculumId,
        subjectId: student.subjectId,
      });
      if (rec) {
        startAssessmentForBlueprint(student, rec.blueprint);
        return;
      }
    }
    // Build a stratified, mostly-fresh session pool of 10 items, scoped to
    // the chosen skill mode. For 'mixed' the entire 44-item bank is in
    // play; for a single skill, only that skill's items.
    const priorIds = getCompletedSessionsForStudent(student.id).flatMap((s) =>
      s.responses.map((r) => r.itemId)
    );
    const skillItems = filterItemsBySkillMode(ITEMS, skillMode);

    if (skillItems.length === 0) {
      setBannerError(
        'No items found for this assessment mode. Please choose another skill or contact the teacher.'
      );
      return;
    }

    const pool = buildSessionPool(skillItems, priorIds);
    const fresh = createInitialState();
    const first = pickNextItem(pool, fresh.attemptedIds, fresh.ability);

    if (!first) {
      setBannerError(
        'No items found for this assessment mode. Please choose another skill or contact the teacher.'
      );
      return;
    }

    // Successful start — clear any prior banner.
    setBannerError(null);

    const activePilot = getActivePilot();
    const newSession: Session = {
      id: generateId(),
      studentId: student.id,
      studentSnapshot: {
        name: student.name,
        grade: student.grade,
        school: student.school,
      },
      window,
      skillId: skillMode,
      startedAt: Date.now(),
      completedAt: null,
      responses: [],
      finalAbility: fresh.ability,
      ...(activePilot ? { pilotId: activePilot.id } : {}),
      ...(fromAssignment ? { assignmentId: fromAssignment.id } : {}),
    };
    setEngine(fresh);
    setSessionPool(pool);
    setCurrent(first);
    setSelected(null);
    setNumericInput('');
    setSubmitting(false);
    setItemStartTs(Date.now());
    setSession(newSession);
    setView('assessment');
  };

  // v0.27 — Registry-driven blueprint launcher. Uses the curriculum
  // registry to gather items, respects the blueprint's own
  // minItems/maxItems, and stamps curriculum + blueprint context onto
  // the new Session so growth-comparison and reporting stay honest.
  const startAssessmentForBlueprint = (
    student: Student,
    blueprint: AssessmentBlueprint
  ) => {
    try {
      const priorIds = getCompletedSessionsForStudent(student.id).flatMap(
        (s) => s.responses.map((r) => r.itemId)
      );
      const { pool } = buildBlueprintSession(blueprint, priorIds);
      const fresh = createInitialState();
      const first = pickNextItem(pool, fresh.attemptedIds, fresh.ability);
      if (!first) {
        setBannerError(
          'This assessment has no items left to show. Please choose another assessment.'
        );
        return;
      }
      setBannerError(null);
      const activePilot = getActivePilot();
      // Blueprint sessions still write `skillId` (legacy SkillMode field)
      // so downstream reporting keeps working. We use the first module id
      // of the blueprint as a stable label when there's exactly one, else
      // fall back to bare 'mixed' (Class 6 legacy) or the blueprint id.
      const legacySkillId: SkillMode =
        blueprint.moduleIds && blueprint.moduleIds.length === 1
          ? (`mixed_${(blueprint.moduleIds[0].split('_').pop() ?? '')}` as SkillMode)
          : 'mixed';
      const newSession: Session = {
        id: generateId(),
        studentId: student.id,
        studentSnapshot: {
          name: student.name,
          grade: student.grade,
          school: student.school,
          curriculumId: blueprint.curriculumId,
          gradeId: blueprint.gradeId,
          subjectId: blueprint.subjectId,
        },
        window: 'practice',
        skillId: legacySkillId,
        startedAt: Date.now(),
        completedAt: null,
        responses: [],
        finalAbility: fresh.ability,
        ...(activePilot ? { pilotId: activePilot.id } : {}),
        // v0.26+ curriculum snapshot.
        curriculumId: blueprint.curriculumId,
        curriculumVersion: 'v0.27',
        gradeId: blueprint.gradeId,
        subjectId: blueprint.subjectId,
        blueprintId: blueprint.id,
        blueprintVersion: blueprint.version,
        scoringVersion: 'v0.27',
        contentReviewStatus: blueprint.availability,
      };
      setEngine(fresh);
      setSessionPool(pool);
      setCurrent(first);
      setSelected(null);
      setNumericInput('');
      setSubmitting(false);
      setItemStartTs(Date.now());
      setSession(newSession);
      setView('assessment');
    } catch (err) {
      setBannerError(
        err instanceof Error
          ? err.message
          : 'Could not start the assessment. Please choose another one.'
      );
    }
  };

  // v0.49 §4 — "Practise a concept" starts one skill immediately. It
  // used to route to StartForm, which asked a student who was already
  // signed in to re-enter their details.
  const startConceptPracticeFor = (student: Student, skill: SkillId) => {
    setSessionPurpose('concept_practice');
    startAssessmentFor(student, 'practice', skill as SkillMode);
  };

  // v0.49 §3 — the real chapter-session launcher. Mixed practice and a
  // chapter check both come through here with a different
  // SessionPurpose, and the purpose genuinely changes what is built:
  // item count, skill coverage, hint availability, and the metadata
  // written to the session snapshot.
  //
  // Both modes start immediately. Neither detours through StartForm —
  // the student already picked a chapter, so asking them to re-enter
  // their name was the old "labels don't match behaviour" bug.
  const startChapterSessionFor = (
    student: Student,
    moduleId: ModuleId,
    purpose: SessionPurpose
  ) => {
    const blueprint = blueprintForModule(moduleId);
    if (!blueprint) {
      // No executable blueprint. For a chapter check this must never
      // silently become a practice run — say so instead.
      if (purpose === 'chapter_check') {
        setBannerError(
          'This chapter does not have a chapter check yet. You can still practise it.'
        );
        return;
      }
      // Mixed practice on an unblueprinted chapter keeps the legacy
      // SkillMode path, which still works and still has items.
      const mixedMode = `mixed_${moduleId}` as SkillMode;
      const fallback: SkillMode = SKILL_MODE_LABELS[mixedMode]
        ? mixedMode
        : (SKILLS_BY_MODULE[moduleId]?.[0] as SkillMode);
      if (fallback) {
        startAssessmentFor(student, 'practice', fallback);
      } else {
        setBannerError(
          'This chapter has no questions ready yet. Try another chapter, or ask your teacher.'
        );
      }
      return;
    }

    const priorIds = getCompletedSessionsForStudent(student.id).flatMap((s) =>
      s.responses.map((r) => r.itemId)
    );
    const legacyMixed = `mixed_${moduleId}` as SkillMode;
    const legacySkillMode: SkillMode = SKILL_MODE_LABELS[legacyMixed]
      ? legacyMixed
      : 'mixed';
    const activePilot = getActivePilot();
    const result = startChapterSession({
      student,
      blueprint,
      purpose,
      items: ITEMS,
      priorAttemptedIds: priorIds,
      newId: generateId,
      legacySkillMode,
      ...(activePilot ? { pilotId: activePilot.id } : {}),
      ...(student.primaryClassroomId
        ? { classroomId: student.primaryClassroomId }
        : {}),
      ...(student.academicYear ? { academicYear: student.academicYear } : {}),
    });

    if (!result.ok) {
      setBannerError(result.reason);
      return;
    }

    const fresh = createInitialState();
    const first = pickNextItem(result.pool, fresh.attemptedIds, fresh.ability);
    if (!first) {
      setBannerError(
        'This chapter has no questions ready yet. Try another chapter, or ask your teacher.'
      );
      return;
    }

    setBannerError(null);
    setSessionPurpose(purpose);
    setEngine(fresh);
    setSessionPool(result.pool);
    setCurrent(first);
    setSelected(null);
    setNumericInput('');
    setSubmitting(false);
    setItemStartTs(Date.now());
    setSession(result.session);
    setStudentLocation({ kind: 'tab' });
    setView('assessment');
  };

  /** §2 — Save & Exit asks first when the question on screen has not
   *  been answered, so a half-finished item is never dropped silently. */
  const requestExitActiveSession = () => {
    const unanswered =
      current !== null &&
      (current.kind === 'mcq' ? selected === null : numericInput.trim() === '');
    if (unanswered) {
      setExitPromptOpen(true);
      return;
    }
    exitActiveSession();
  };

  /** v0.49 §2 — Save & Exit. The answers already submitted are stored
   *  as a completed short session (the response records are already in
   *  `session.responses`), so nothing the student did is lost. We do
   *  not fabricate a "paused" state the storage layer cannot represent. */
  const exitActiveSession = () => {
    if (!session) return;
    if (session.responses.length > 0) {
      const saved: Session = {
        ...session,
        completedAt: Date.now(),
        finalAbility: engine.ability,
      };
      saveSession(saved);
      bumpStore();
    }
    setSession(null);
    setCurrent(null);
    setSelected(null);
    setNumericInput('');
    setSubmitting(false);
    setStudentLocation({ kind: 'tab' });
    setExitPromptOpen(false);
    setView('landing');
  };

  const submitAnswer = () => {
    if (submitting) return;
    if (!current || !session) return;

    // Decide the response from the current item kind.
    let chosenIndex: number;
    let chosenText: string | undefined;
    let correct: boolean;
    let misconception: ReturnType<typeof evaluateNumericAnswer>['misconception'];
    if (current.kind === 'mcq') {
      if (selected === null) return;
      chosenIndex = selected;
      correct = selected === current.correctIndex;
      misconception = correct
        ? 'none'
        : current.options[selected].misconception;
    } else {
      // numeric: parse-and-compare by rational equivalence; a value-correct
      // but unsimplified answer (e.g., "10/12" for "5/6") is reported as
      // wrong with misconception='form_error'.
      const raw = numericInput.trim();
      if (!raw) return;
      chosenIndex = -1;
      chosenText = raw;
      const result = evaluateNumericAnswer(current, raw);
      correct = result.correct;
      misconception = result.misconception;
    }

    setSubmitting(true);

    const abilityBefore = engine.ability;
    const abilityAfter = updateAbility(engine.ability, correct);

    const response = {
      itemId: current.id,
      chosenIndex,
      ...(chosenText !== undefined ? { chosenText } : {}),
      correct,
      timeMs: Date.now() - itemStartTs,
      difficultyAtAttempt: current.difficulty,
      abilityBefore,
      abilityAfter,
      misconceptionTriggered: misconception,
    };

    const nextAttempted = [...engine.attemptedIds, current.id];
    const nextEngine: EngineState = {
      ability: abilityAfter,
      attemptedIds: nextAttempted,
    };
    const nextResponses = [...session.responses, response];

    const finalize = () => {
      const finalSession: Session = {
        ...session,
        responses: nextResponses,
        completedAt: Date.now(),
        finalAbility: abilityAfter,
      };
      saveSession(finalSession);
      // v0.20/0.21: if the student is in a joined classroom and this
      // session is bound to an assignment, mirror the safe submission to
      // the public accessCodes/{code}/submissions subcollection. The
      // teacher's syncAll() picks it up on their next sync. The result
      // is recorded in localStorage and the Results screen renders it
      // (Submitted / Saved locally only / Failed with retry).
      setSubmissionState(null);
      void (async () => {
        const status = await submitStudentSession(finalSession);
        setSubmissionState(status);
      })();
      setSession(finalSession);
      setEngine(nextEngine);
      setCurrent(null);
      setSelected(null);
      setNumericInput('');
      setSubmitting(false);
      bumpStore();
      setView('results');
    };

    if (shouldStop(nextEngine, sessionPool.length)) {
      finalize();
      return;
    }
    const nextItem = pickNextItem(sessionPool, nextAttempted, abilityAfter);
    if (!nextItem) {
      finalize();
      return;
    }

    setEngine(nextEngine);
    setSession({ ...session, responses: nextResponses });
    setCurrent(nextItem);
    setSelected(null);
    setNumericInput('');
    setSubmitting(false);
    setItemStartTs(Date.now());
  };

  const goLanding = () => {
    setView(appMode === 'teacher' ? 'teacherLanding' : 'landing');
    setSession(null);
    setCurrent(null);
    setSelected(null);
    setNumericInput('');
    setSubmitting(false);
  };

  const startNewForSameStudent = () => {
    if (!session) return;
    const student = findOrCreateStudent(
      session.studentSnapshot.name,
      session.studentSnapshot.grade,
      session.studentSnapshot.school
    );
    setPrefillStudent(student);
    setView('startForm');
  };

  return (
    <div className="min-h-full bg-slate-50">
      <NavBar
        view={view}
        appMode={appMode}
        onSetAppMode={setAppMode}
        onNavLanding={goLanding}
        onNavLearn={() => setView('class6math')}
        onNavTeacher={() => {
          setSelectedStudentId(null);
          setView('teacherLanding');
        }}
        onOpenSignIn={() => {
          setLoginInitialMode('signin');
          setLoginOpen(true);
        }}
        onOpenSignUp={() => {
          setLoginInitialMode('signup');
          setLoginOpen(true);
        }}
      />
      <TeacherLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        initialMode={loginInitialMode}
      />
      <OnboardingFlow
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onOpenSignUp={() => {
          setLoginInitialMode('signup');
          setLoginOpen(true);
        }}
        onSeedSampleData={() => {
          seedSampleData();
          // Bounce into teacher mode + the workflow home so the teacher sees
          // the dashboard populate immediately.
          setAppMode('teacher');
          setView('teacherLanding');
          bumpStore();
        }}
      />

      <main className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6 md:py-12">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Loading…
            </div>
          }
        >
        {bannerError && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 ring-1 ring-rose-100"
          >
            <div>
              <div className="font-semibold">Heads up</div>
              <p className="mt-1">{bannerError}</p>
            </div>
            <button
              onClick={() => setBannerError(null)}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
            >
              Dismiss
            </button>
          </div>
        )}
        {view === 'landing' && (
          (() => {
            // v0.47 A — canonical StudentShell is the default. If no
            // active student exists yet, fall back to the first-run
            // StudentHome so name capture / join-classroom still works.
            const allStudents = loadStudents();
            const activeStudent =
              (selectedStudentId
                ? allStudents.find((s) => s.id === selectedStudentId)
                : null) ?? allStudents[0] ?? null;
            if (!activeStudent) {
              return (
                <StudentHome
                  onStart={() => {
                    setPrefillStudent(null);
                    setPrefillSkillMode(null);
                    setView('startForm');
                  }}
                  onLearn={() => setView('class6math')}
                  onTeacher={() => {
                    setAppMode('teacher');
                    setSelectedStudentId(null);
                    setView('teacherLanding');
                  }}
                  onStartAssignment={(a) => {
                    setPrefillStudent(null);
                    setPrefillSkillMode(a.skillMode);
                    setPrefillAssignment(a);
                    setView('startForm');
                  }}
                  onJoinClassroom={() => setView('joinClassroom')}
                  onLeaveClassroom={bumpStore}
                  onBrowseAssessments={() => setView('assessmentPicker')}
                />
              );
            }
            // v0.48 §6 — real grade normalization. Unknown grades
            // route to a truthful profile-correction screen instead
            // of silently loading Class 6 content.
            const gradeNorm = normalizeGrade(activeStudent.grade);
            if (!gradeNorm) {
              return (
                <ProfileCorrectionScreen
                  studentName={activeStudent.name}
                  storedGrade={String(activeStudent.grade)}
                  onSwitchStudent={() => setSelectedStudentId(null)}
                  onOpenStartForm={() => setView('startForm')}
                />
              );
            }
            return (
              <StudentRouteOutlet
                studentGrade={gradeNorm}
                studentName={activeStudent.name}
                studentId={activeStudent.id}
                activeTab={studentTab}
                onSwitchTab={setStudentTab}
                openChapterId={openChapterId}
                onOpenChapter={setOpenChapterId}
                location={studentLocation}
                onSetLocation={setStudentLocation}
                onLaunchConceptPractice={(skill) =>
                  startConceptPracticeFor(activeStudent, skill)
                }
                onLaunchMixedChapterPractice={(m) =>
                  startChapterSessionFor(activeStudent, m, 'practice')
                }
                onLaunchChapterCheck={(m) =>
                  startChapterSessionFor(activeStudent, m, 'chapter_check')
                }
                onLaunchFromLesson={(mode) =>
                  startAssessmentFor(activeStudent, 'practice', mode)
                }
              />
            );
          })()
        )}

        {view === 'joinClassroom' && (
          <JoinClassroomView
            onJoined={() => {
              bumpStore();
              setView('landing');
            }}
            onSkip={() => setView('landing')}
          />
        )}

        {view === 'class6math' && (
          <Class6MathDashboard
            onOpenModule={goModule}
            onStartAssessment={goAssessmentForSkill}
            onBack={goLanding}
            onChangeClass={() => setView('assessmentPicker')}
          />
        )}

        {view === 'module' && (
          <ModuleDashboard
            moduleId={currentModule}
            onOpenLesson={goLearn}
            onStartAssessment={goAssessmentForSkill}
            onBack={() => setView('class6math')}
          />
        )}

        {view === 'learn' && (
          <LearnView
            skill={learnSkill}
            onBack={() => goModule(MODULE_FOR_SKILL[learnSkill])}
            onStartAssessment={goAssessmentForSkill}
            onOpenLesson={goLearn}
          />
        )}

        {view === 'startForm' && (
          <StartForm
            prefill={prefillStudent}
            prefillSkillMode={prefillSkillMode}
            prefillAssignment={prefillAssignment}
            onCancel={goLanding}
            onStart={(student, window, skillMode) => {
              const fromAssignment = prefillAssignment ?? undefined;
              startAssessmentFor(student, window, skillMode, fromAssignment);
              // Clear the assignment hint so the next session doesn't
              // accidentally inherit it.
              setPrefillAssignment(null);
            }}
          />
        )}

        {/* v0.48 §2 — Assessment / Results / Learning path all render
             INSIDE the StudentShell (via sessionChild) when we're in
             student mode, so the top + bottom nav stay visible. In
             teacher mode they render bare so the teacher preview still
             works. */}
        {view === 'assessment' && current && session && (
          renderInStudentShell({
            appMode,
            selectedStudentId,
            studentTab,
            onSwitchTab: setStudentTab,
            openChapterId,
            onOpenChapter: setOpenChapterId,
            // §2 — a live assessment locks the primary tabs and swaps
            // them for an explicit Save & Exit control.
            locked: true,
            onExitSession: requestExitActiveSession,
            exitLabel: 'Save & Exit',
            child: (
            <>
            {exitPromptOpen && (
              <div
                role="alertdialog"
                aria-label="Leave this set?"
                className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
              >
                <div className="font-semibold">Leave this set?</div>
                <p className="mt-1">
                  You have not answered this question yet. Your earlier answers
                  are saved either way.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={exitActiveSession}
                    className="min-h-[44px] rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  >
                    Save &amp; leave
                  </button>
                  <button
                    onClick={() => setExitPromptOpen(false)}
                    className="min-h-[44px] rounded-lg bg-white px-4 py-2 text-sm font-semibold text-amber-800 ring-1 ring-amber-300 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  >
                    Keep going
                  </button>
                </div>
              </div>
            )}
            <Assessment
              item={current}
              selected={selected}
              onSelect={setSelected}
              numericInput={numericInput}
              onNumericChange={setNumericInput}
              onSubmit={submitAnswer}
              submitting={submitting}
              progress={session.responses.length + 1}
              total={SESSION_SIZE}
              studentName={session.studentSnapshot.name}
              window={session.window}
              skillMode={session.skillId}
              purpose={sessionPurpose}
              showHint={hintsAllowed(sessionPurpose)}
            />
            </>
            ),
          })
        )}

        {view === 'results' && session?.completedAt && (
          renderInStudentShell({
            appMode,
            selectedStudentId,
            studentTab,
            onSwitchTab: setStudentTab,
            openChapterId,
            onOpenChapter: setOpenChapterId,
            // Results are post-session: navigation works again here.
            locked: false,
            child: (
            <ResultsView
              audience={appMode === 'student' ? 'student' : 'teacher'}
              session={session}
              onAnotherSession={startNewForSameStudent}
              onTeacher={() => {
                setSelectedStudentId(session.studentId);
                setView('studentDetail');
              }}
              onHome={goLanding}
              onOpenLesson={goLearn}
              onStartAssessment={goAssessmentForSkill}
              onOpenLearningPath={() => setView('learningPath')}
              submissionState={submissionState}
              onRetrySubmission={async () => {
                setSubmissionState(null);
                const status = await retrySubmitStudentSession(session.id);
                setSubmissionState(status);
              }}
            />
            ),
          })
        )}

        {view === 'learningPath' && session?.completedAt && (
          renderInStudentShell({
            appMode,
            selectedStudentId,
            studentTab,
            onSwitchTab: setStudentTab,
            openChapterId,
            onOpenChapter: setOpenChapterId,
            locked: false,
            child: (
            <StudentLearningPath
              session={session}
              onRetake={(skill) => {
                setPrefillStudent(null);
                setPrefillSkillMode(skill);
                setView('startForm');
              }}
              onBack={() => setView('results')}
            />
            ),
          })
        )}

        {view === 'classrooms' && (
          <ClassroomsView
            key={`classrooms-${storeVersion}`}
            onBack={() => setView('teacherLanding')}
          />
        )}

        {view === 'teacher' && (
          <TeacherStudentList
            key={`teacher-${storeVersion}`}
            onOpenStudent={(id) => {
              setSelectedStudentId(id);
              setView('studentDetail');
            }}
            onStart={() => {
              setPrefillStudent(null);
              setView('startForm');
            }}
            onOpenClassDashboard={() => setView('classDashboard')}
          />
        )}

        {view === 'classDashboard' && (
          <ClassDashboardView
            key={`class-${storeVersion}`}
            onBack={() => setView('teacher')}
            onOpenStudent={(id) => {
              setSelectedStudentId(id);
              setView('studentDetail');
            }}
          />
        )}

        {view === 'studentDetail' && selectedStudentId && (
          <StudentDetail
            key={`detail-${storeVersion}-${selectedStudentId}`}
            studentId={selectedStudentId}
            onBack={() => setView('teacher')}
            onNewSession={(student) => {
              setPrefillStudent(student);
              setView('startForm');
            }}
            onDeleted={() => {
              bumpStore();
              setSelectedStudentId(null);
              setView('teacher');
            }}
          />
        )}

        {view === 'teacherLanding' && (
          <TeacherShell
            activeTab={teacherTab}
            onSwitchTab={(t) => {
              // v0.48 §9 — Insights and Resources now have their own
              // bodies (rendered inside the shell). Only Classes and
              // Assign delegate to the existing student-list /
              // assignments view (kept intact during the migration).
              setTeacherTab(t);
              if (t !== 'resources') setTeacherChapterId(null);
              if (t === 'classes') setView('teacher');
              else if (t === 'assign') setView('assignments');
              else setView('teacherLanding');
            }}
            onOpenOverviewSummary={() => setView('teacherLanding')}
            onOpenClasses={() => setView('teacher')}
            onOpenAssign={() => setView('assignments')}
            onOpenInsights={() => setView('classDashboard')}
            onOpenResources={() => {
              setTeacherChapterId(null);
              setTeacherTab('resources');
              setView('teacherLanding');
            }}
            onOpenPilotSetup={() => setView('pilotSetup')}
            onOpenItemReview={() => {
              setReviewItemId(null);
              setView('itemReview');
            }}
            onOpenAlignmentReview={() => setView('alignmentReview')}
            onOpenCurriculumCoverage={() => setView('curriculumCoverage')}
            onOpenWorkflowTest={() => setView('classroomTest')}
            onOpenExports={() => setView('pilotReport')}
          >
            {teacherTab === 'overview' && (
              <TeacherOverviewBody
                recentSessionCount={
                  loadSessions().filter(
                    (s) =>
                      s.completedAt &&
                      s.completedAt > Date.now() - 7 * 24 * 60 * 60 * 1000
                  ).length
                }
                studentsNeedingAttention={0}
                activeAssignmentTitle={
                  loadAssignments().find((a) => a.active)?.title ?? null
                }
                weakestSkillLabel={null}
                nextRecommendationLabel={null}
                onOpenAssign={() => setView('assignments')}
                onOpenClasses={() => setView('teacher')}
              />
            )}
            {teacherTab === 'insights' && (
              <TeacherInsightsBody
                onOpenAssign={() => setView('assignments')}
                selectedClassroomId={teacherClassroomId}
                onSelectClassroom={setTeacherClassroomId}
              />
            )}
            {teacherTab === 'resources' &&
              (teacherChapterId ? (
                <TeacherResourceOutlet
                  chapterId={teacherChapterId}
                  onBack={() => setTeacherChapterId(null)}
                  onOpenLesson={goLearn}
                />
              ) : (
                <TeacherResourcesBody onOpenChapter={setTeacherChapterId} />
              ))}
            {(teacherTab === 'classes' || teacherTab === 'assign') && (
              <div className="text-xs text-slate-500">Loading…</div>
            )}
          </TeacherShell>
        )}

        {/* v0.48 §9 — the legacy TeacherWorkflowHome dead-code branch
             was removed here. Insights and Resources tabs render
             purpose-built bodies inside TeacherShell above. */}

        {view === 'assignments' && (
          <AssignmentsView
            key={`assignments-${storeVersion}`}
            onBack={() => setView('teacherLanding')}
            onCreate={() => {
              setEditingAssignmentId(null);
              setView('assignmentForm');
            }}
            onEdit={(id) => {
              setEditingAssignmentId(id);
              setView('assignmentForm');
            }}
            onChanged={bumpStore}
          />
        )}

        {view === 'assignmentForm' && (
          <AssignmentForm
            key={`assignment-form-${storeVersion}-${editingAssignmentId ?? 'new'}`}
            assignmentId={editingAssignmentId}
            onCancel={() => setView('assignments')}
            onSaved={() => {
              bumpStore();
              setView('assignments');
            }}
          />
        )}

        {view === 'itemReview' && (
          <ItemReviewView
            key={`item-review-${storeVersion}-${reviewItemId ?? 'list'}`}
            currentItemId={reviewItemId}
            onSelectItem={(id) => setReviewItemId(id)}
            onBackToList={() => setReviewItemId(null)}
            onBack={() => setView('teacherLanding')}
            onSaved={bumpStore}
          />
        )}

        {view === 'pilotSetup' && (
          <PilotSetupView
            key={`pilot-${storeVersion}`}
            onBack={() => setView('teacherLanding')}
            onSaved={bumpStore}
          />
        )}

        {view === 'teachingPlan' && (
          <TeachingPlanView
            key={`teaching-plan-${storeVersion}`}
            onBack={() => setView('teacherLanding')}
            onOpenStudent={(id) => {
              setSelectedStudentId(id);
              setView('studentDetail');
            }}
            onOpenLesson={goLearn}
            onStartAssessment={goAssessmentForSkill}
          />
        )}

        {view === 'alignmentReview' && (
          <AlignmentReviewView
            key={`alignment-${storeVersion}`}
            onBack={() => setView('teacherLanding')}
            onOpenItem={(id) => {
              setReviewItemId(id);
              setView('itemReview');
            }}
            onOpenLesson={goLearn}
          />
        )}

        {view === 'pilotReport' && (
          <PilotReportView
            key={`pilot-report-${storeVersion}`}
            onBack={() => setView('teacherLanding')}
          />
        )}

        {view === 'importedSubmissions' && (
          <ImportedSubmissionsView
            key={`imported-${storeVersion}`}
            onBack={() => setView('teacherLanding')}
            onOpenStudent={(id) => {
              setSelectedStudentId(id);
              setView('studentDetail');
            }}
          />
        )}

        {view === 'classroomTest' && (
          <ClassroomWorkflowTest
            key={`classroom-test-${storeVersion}`}
            onBack={() => setView('teacherLanding')}
          />
        )}

        {view === 'curriculumCoverage' && (
          <CurriculumCoverageView onBack={() => setView('teacherLanding')} />
        )}

        {view === 'assessmentPicker' && (
          <AssessmentPicker
            // In student mode `prefillStudent` is the last active student
            // (chosen via the join-classroom flow or the StartForm). In
            // teacher mode we pass the currently-selected student if any,
            // or null — the picker then renders in "browse the framework"
            // mode.
            student={
              appMode === 'student'
                ? prefillStudent
                : selectedStudentId
                  ? loadStudents().find((s) => s.id === selectedStudentId) ?? null
                  : null
            }
            onCancel={() => setView(appMode === 'teacher' ? 'teacherLanding' : 'landing')}
            onStartBlueprint={(student, bp) =>
              startAssessmentForBlueprint(student, bp)
            }
          />
        )}
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}



// (v0.7's ModuleTeaserCard and v0.5's FeatureCard were retired in v0.8 when
// Landing became the simple student home and TeacherLanding took over the
// module-grid responsibility.)

