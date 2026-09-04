import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
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
  SKILL_LABELS,
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
import {
  modulePracticeBlueprint,
  buildModulePracticePlan,
} from './features/session/modulePracticeBlueprint';
import { ProfileCorrectionScreen } from './features/student/ProfileCorrectionScreen';
import { renderInStudentShell } from './features/student/wrapInStudentShell';
import { Assessment } from './features/session/AssessmentView';
import { TeacherShell, TeacherOverviewBody } from './features/teacher/TeacherShell';
import { TeacherInsightsBody } from './features/teacher/TeacherInsightsBody';
import { TeacherResourcesBody } from './features/teacher/TeacherResourcesBody';
import { TeacherResourceOutlet } from './features/teacher/TeacherResourceOutlet';
import { computeOverviewAnalytics } from './features/teacher/overviewAnalytics';
import {
  GrowthAssignPanel,
  GrowthInstructions,
  GrowthComplete,
} from './features/assessment/GrowthAdministration';
import {
  Class6ChapterList,
  FractionsChapterLanding,
  Section74Practice,
} from './features/student/Class6Learn';
import { SectionAssignmentPanel } from './features/teacher/SectionAssignmentPanel';
import { CurriculumCoverageForTeachers } from './features/teacher/CurriculumCoverageForTeachers';
import { CurriculumCompletenessForTeachers } from './features/teacher/CurriculumCompletenessForTeachers';
import { CurriculumVerificationPanel } from './features/admin/CurriculumVerificationPanel';
import { CoverageMatrixPanel } from './features/admin/CoverageMatrixPanel';
import { ContentPlanPanel } from './features/admin/ContentPlanPanel';
import { StructureVerificationPanel } from './features/admin/StructureVerificationPanel';
import { ChapterReviewPreview } from './features/admin/ChapterReviewPreview';
import { ContentRoadmap } from './features/admin/ContentRoadmap';
import { DemonstrationSectionPreview } from './features/admin/DemonstrationSectionPreview';
import { ReadinessMatrix } from './features/teacher/ReadinessMatrix';
import {
  localFormalAssignmentStore,
  activeAssignmentForStudent,
  createFormalAssignment,
} from './features/assessment/formalAssignmentStore';
import { localFormalSessionStore } from './features/assessment/formalSessionStore';
import {
  localExposureRepository,
  localAuditRepository,
} from './features/assessment/repositories';
import {
  startFormalSession,
  resumeFormalSession,
  recordFormalResponse,
  abandonFormalSession,
  fieldTestOutcome,
} from './features/assessment/formalSessionRunner';
import { prepareGrowthAdministration } from './features/assessment/prepareGrowthAdministration';
import type { PilotAdministrationSpecification } from './features/assessment/assessmentAssembler';
import type { PilotFrameworkAuthorization } from './features/assessment/pilotFrameworkAuthorization';
import { specificationById } from './features/assessment/rationalNumberSpecifications';
import {
  growthItemRecords,
  growthItemMetadata,
  growthItemContent,
} from './features/assessment/growthItemBank';
import { FormalSittingView } from './features/assessment/FormalSittingView';
import { AssignmentManagementPanel } from './features/assessment/AssignmentManagementPanel';
import { scopeSessions } from './features/teacher/teacherInsights';
import { loadClassrooms } from './lib/classroomStore';
import {
  resolveClassroomContext,
  loadStoredClassroomSelection,
  storeClassroomSelection,
} from './features/teacher/classroomContext';
import { normalizeGrade } from './lib/gradeNormalization';
// v0.48 §9 — TeacherWorkflowHome removed as a primary render; the
// new TeacherShell + its tab-body components take over.
import { AssignmentsView } from './components/AssignmentsView';
import { AssignmentForm } from './components/AssignmentForm';
const TeachingPlanView = lazy(() =>
  import('./components/TeachingPlanView').then((m) => ({ default: m.TeachingPlanView }))
);
import { PilotSetupView } from './components/PilotSetupView';
import { openableSectionTarget } from './curriculum/sectionRouting';
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
  // v0.62 §3 — the Class 6 curriculum pathway, in official book order.
  | 'class6Chapters'
  | 'fractionsChapter'
  | 'section74Practice'
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
  | 'curriculumCoverage'
  | 'demonstrationPreview'
  | 'chapterReviewPreview'
  | 'growthCheck'
  | 'growthSitting'; // v0.59 §5 active formal field-test sitting // v0.46: admin/research chapter catalogue view

/**
 * v0.61 §4 — App-root dependency injection.
 *
 * WHY THIS EXISTS
 *
 * The v0.59/v0.60 integration suite drove the real services and
 * rendered the real components, but never mounted `<App />`. So the
 * wiring BETWEEN them — which store App reads, which grade it passes,
 * which view it switches to — was the one layer with no test at all.
 *
 * PRODUCTION IS UNAFFECTED. Every field defaults to the production
 * value: empty item bank, real localStorage stores, real framework
 * authorization (which is not granted). Passing nothing gives exactly
 * the v0.60 behaviour, and `appRoot.test.tsx` asserts that an
 * un-injected App still cannot create an assignment.
 */
export type AppDependencies = {
  formalAssignments?: typeof localFormalAssignmentStore;
  formalSessions?: typeof localFormalSessionStore;
  growthBank?: {
    records: typeof growthItemRecords;
    metadata: typeof growthItemMetadata;
    content: typeof growthItemContent;
  };
  specLookup?: typeof specificationById;
  administrationSpec?: PilotAdministrationSpecification;
  frameworkAuthorization?: PilotFrameworkAuthorization;
};

export default function App({ deps }: { deps?: AppDependencies } = {}) {
  // Resolved once. Production passes no `deps` at all.
  const formalAssignments = deps?.formalAssignments ?? localFormalAssignmentStore;
  const formalSessions = deps?.formalSessions ?? localFormalSessionStore;
  const growthBank = deps?.growthBank ?? {
    records: growthItemRecords,
    metadata: growthItemMetadata,
    content: growthItemContent,
  };
  const growthSpecLookup = deps?.specLookup ?? specificationById;
  const growthPreparationInputs = {
    records: growthBank.records,
    metadata: growthBank.metadata,
    lookup: growthSpecLookup,
    spec: deps?.administrationSpec,
    authorization: deps?.frameworkAuthorization,
  };
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
  // v0.59 §5 — the active formal sitting, if any.
  const [formalSessionId, setFormalSessionId] = useState<string | null>(null);
  const [teacherTab, setTeacherTab] =
    useState<'overview' | 'classes' | 'assign' | 'assess' | 'insights' | 'resources'>('overview');
  // v0.49 §9 — the chapter a teacher has drilled into on the Resources
  // tab. Rendered INSIDE TeacherShell, so the teacher never leaves the
  // canonical shell to read a chapter's contents.
  const [teacherChapterId, setTeacherChapterId] = useState<string | null>(null);
  // v0.49 §8 — the classroom Insights is scoped to. null = all local data.
  // v0.53 §10 — never default to the device-wide aggregate. One class
  // is auto-selected; several require an explicit choice; the selection
  // persists across teacher tabs and reloads.
  const [teacherClassroomId, setTeacherClassroomIdRaw] = useState<string | null>(
    () =>
      resolveClassroomContext({
        classrooms: loadClassrooms().filter((c) => !c.archived),
        storedSelection: loadStoredClassroomSelection(),
      }).selectedClassroomId
  );
  const setTeacherClassroomId = (id: string | null) => {
    setTeacherClassroomIdRaw(id);
    storeClassroomSelection(id);
  };



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

  // v0.50 §7/§8 — the teacher's working context. Everything on the
  // teacher side reads from this one scope, so Overview and Insights
  // can never silently describe different populations.
  const teacherScope = useMemo(
    () =>
      scopeSessions({
        sessions: loadSessions(),
        classrooms: loadClassrooms(),
        students: loadStudents(),
        scope: { classroomId: teacherClassroomId },
      }),
    [teacherClassroomId, storeVersion]
  );

  const teacherOverviewAnalytics = useMemo(
    () =>
      computeOverviewAnalytics({
        sessions: teacherScope.sessions,
        students: loadStudents(),
        itemSkillOf: (id) =>
          (ITEMS.find((i) => i.id === id)?.skillId as string) ?? null,
      }),
    [teacherScope]
  );


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

  /** v0.50 §1 — resume an unfinished set. Rehydrates the stored pool
   *  from the item bank by ID, restores ability and attempted IDs, and
   *  drops the student back on the next unanswered question. */
  const resumeSession = (sessionId: string) => {
    const stored = loadSessions().find((s) => s.id === sessionId);
    if (!stored || !stored.resumePoolItemIds) return;
    const pool = stored.resumePoolItemIds
      .map((id) => ITEMS.find((i) => i.id === id))
      .filter(Boolean) as typeof ITEMS;
    if (pool.length === 0) return;
    const attempted = stored.resumeAttemptedIds ?? stored.responses.map((r) => r.itemId);
    const ability = stored.resumeAbility ?? stored.finalAbility ?? 5;
    const next = pickNextItem(pool, attempted, ability);
    if (!next) return;
    setBannerError(null);
    setSessionPurpose(
      (stored.sessionPurpose as SessionPurpose | undefined) ?? 'practice'
    );
    setEngine({ ability, attemptedIds: attempted });
    setSessionPool(pool);
    setCurrent(next);
    setSelected(null);
    setNumericInput('');
    setSubmitting(false);
    setItemStartTs(Date.now());
    setSession(stored);
    setStudentLocation({ kind: 'tab' });
    setView('assessment');
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
      // v0.50 §2 — generic module practice. This replaces the v0.49
      // fallback that quietly collapsed to `SKILLS_BY_MODULE[m][0]`,
      // administering ONE concept under a "Mixed practice" label for
      // every module outside Classes 6–7.
      const genericBp = modulePracticeBlueprint(moduleId, ITEMS);
      if (genericBp.usableSkillIds.length === 0) {
        setBannerError(
          'This chapter has no questions ready yet. Try another chapter, or ask your teacher.'
        );
        return;
      }
      const priorGeneric = getCompletedSessionsForStudent(student.id).flatMap((s) =>
        s.responses.map((r) => r.itemId)
      );
      const genericPlan = buildModulePracticePlan({
        blueprint: genericBp,
        items: ITEMS,
        priorAttemptedIds: priorGeneric,
      });
      if (genericPlan.pool.length === 0) {
        setBannerError(
          'This chapter has no questions ready yet. Try another chapter, or ask your teacher.'
        );
        return;
      }
      const legacyMode = `mixed_${moduleId}` as SkillMode;
      const genericSkillMode: SkillMode = SKILL_MODE_LABELS[legacyMode]
        ? legacyMode
        : (genericPlan.sampledSkillIds[0] as SkillMode);
      const genericSession: Session = {
        id: generateId(),
        studentId: student.id,
        studentSnapshot: {
          name: student.name,
          grade: student.grade,
          school: student.school,
        },
        window: 'practice',
        skillId: genericSkillMode,
        startedAt: Date.now(),
        completedAt: null,
        responses: [],
        finalAbility: 5,
        // Honest metadata: this is module practice, NOT a chapter
        // blueprint session, so no blueprint id is recorded.
        sessionPurpose: 'practice',
        sampledSkillIds: genericPlan.sampledSkillIds,
        chapterModuleId: moduleId,
        lifecycle: 'in_progress',
        lastActivityAt: Date.now(),
        resumePoolItemIds: genericPlan.pool.map((i) => i.id),
        resumeCurrentIndex: 0,
        resumeAbility: 5,
        resumeAttemptedIds: [],
        requestedItemCount: genericBp.itemCount,
        administeredItemCount: 0,
        ...(student.primaryClassroomId
          ? { classroomId: student.primaryClassroomId }
          : {}),
      };
      const freshGeneric = createInitialState();
      const firstGeneric = pickNextItem(
        genericPlan.pool,
        freshGeneric.attemptedIds,
        freshGeneric.ability
      );
      if (!firstGeneric) {
        setBannerError(
          'This chapter has no questions ready yet. Try another chapter, or ask your teacher.'
        );
        return;
      }
      setBannerError(null);
      setSessionPurpose('practice');
      setEngine(freshGeneric);
      setSessionPool(genericPlan.pool);
      setCurrent(firstGeneric);
      setSelected(null);
      setNumericInput('');
      setSubmitting(false);
      setItemStartTs(Date.now());
      setSession(genericSession);
      setStudentLocation({ kind: 'tab' });
      setView('assessment');
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

  /** v0.50 §1 — Save & Exit now keeps the set OPEN and resumable.
   *
   *  v0.49 wrote `completedAt` here, which made a 2-of-10 chapter check
   *  indistinguishable from a finished one in every report. The session
   *  is now stored with lifecycle 'in_progress' and its resume state, so
   *  "come back later" is a promise the app actually keeps. */
  const exitActiveSession = () => {
    if (!session) return;
    if (session.responses.length > 0) {
      const saved: Session = {
        ...session,
        completedAt: null,
        lifecycle: 'in_progress',
        lastActivityAt: Date.now(),
        finalAbility: engine.ability,
        resumeCurrentIndex: session.responses.length,
        resumeAbility: engine.ability,
        resumeAttemptedIds: engine.attemptedIds,
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

    // v0.50 §1 — persist progress after EVERY answer, not only at the
    // end. Without this a resume would lose everything on a tab close,
    // and the "you can come back" promise would still be false.
    const persistProgress = (nextIndex: number) => {
      const open: Session = {
        ...session,
        responses: nextResponses,
        completedAt: null,
        lifecycle: 'in_progress',
        lastActivityAt: Date.now(),
        finalAbility: abilityAfter,
        resumeCurrentIndex: nextIndex,
        resumeAbility: abilityAfter,
        resumeAttemptedIds: nextAttempted,
      };
      saveSession(open);
      setSession(open);
      return open;
    };

    const finalize = () => {
      const finalSession: Session = {
        ...session,
        responses: nextResponses,
        completedAt: Date.now(),
        finalAbility: abilityAfter,
        // v0.50 §1 — an explicit completed status. Analytics key off
        // this, not off `completedAt`, so an abandoned attempt can
        // never be counted as a finished one.
        lifecycle: 'completed',
        lastActivityAt: Date.now(),
        administeredItemCount: nextResponses.length,
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
    // §1 — write the open session to storage before advancing, so a
    // closed tab or refresh resumes exactly here.
    persistProgress(nextResponses.length);
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
    <div className="min-h-full bg-paper-100">
      <NavBar
        view={view}
        appMode={appMode}
        onSetAppMode={setAppMode}
        onNavLanding={goLanding}
        // v0.50 §12 — Learn goes to the student's OWN shell. The legacy
        // Class 6 dashboard stays reachable only through stored deep
        // links and the teacher preview.
        onNavLearn={() => {
          const students = loadStudents();
          const active =
            (selectedStudentId
              ? students.find((s) => s.id === selectedStudentId)
              : null) ?? students[0] ?? null;
          if (active && normalizeGrade(active.grade)) {
            setStudentTab('learn');
            setOpenChapterId(null);
            setStudentLocation({ kind: 'tab' });
            setView('landing');
            return;
          }
          setView('startForm');
        }}
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

      {/* v0.71 §19 — 5xl (1024px) left ~200px of dead margin each side at
          1440 while the content itself stayed a single narrow column.
          6xl gives the composed two-column layouts room to breathe
          without stretching any line of prose: readable measure is
          enforced per-column, not by starving the page. */}
      <main className="mx-auto max-w-[84rem] px-3 py-4 sm:px-4 sm:py-6 md:py-10">
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
                  // v0.71 §5 — first run and returning Home now share one
                  // curriculum model. Opening a chapter from first run
                  // lands on the SAME official chapter journey the
                  // returning student uses, rather than a legacy
                  // skill-lesson route.
                  onOpenOfficialChapter={(id) =>
                    setOpenChapterId(`official:${id}`)
                  }
                  onStart={() => {
                    setPrefillStudent(null);
                    setPrefillSkillMode(null);
                    setView('startForm');
                  }}
                  // v0.50 §12 — a brand-new user has no grade yet, so
                  // "Learn" enters the canonical onboarding flow. v0.49
                  // sent them straight to the legacy Class 6 dashboard
                  // whatever class they were actually in.
                  onLearn={() => {
                    setPrefillStudent(null);
                    setPrefillSkillMode(null);
                    setView('startForm');
                  }}
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
            // v0.62 §3/§4 — Class 6 students on the Learn tab get the
            // official Ganita Prakash chapter pathway, in the book's
            // order, instead of the legacy module list. Other grades
            // keep the existing outlet until their sources are
            // verified; inventing an official structure for them would
            // be the error this iteration exists to correct.
            if (
              gradeNorm === 'class6' &&
              studentTab === 'learn' &&
              !openChapterId
            ) {
              return (
                <StudentRouteOutlet
                  studentGrade={gradeNorm}
                  studentName={activeStudent.name}
                  studentId={activeStudent.id}
                  activeTab={studentTab}
                  onSwitchTab={setStudentTab}
                  openChapterId={null}
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
                  // v0.64 §12 — opening an official chapter stays
                  // INSIDE StudentShell, so Home/Learn/Practice/Progress
                  // remain visible. v0.63 routed to an App-level view
                  // and the bottom navigation disappeared.
                  // v0.70 §27 — DEAD LINK FIX.
                  //
                  // This handler routed ONE section id and silently
                  // ignored every other. Since §7.4 is
                  // `not_available_yet` and therefore never tappable,
                  // the branch could not fire — while §7.2, §7.5, §7.6
                  // and §7.8 rendered a "Learn →" affordance that did
                  // nothing at all. A student tapped and the page did
                  // not move. Three releases of visual work sat on top
                  // of four dead links, and no test caught it because
                  // every test asserted the LIST, never the tap.
                  //
                  // A section is now routed to whatever content
                  // actually backs it: the frozen §7.4 practice set if
                  // it ever becomes eligible, otherwise the legacy
                  // skill lesson that made the section eligible in the
                  // first place. If nothing backs it, nothing is
                  // offered — `openableSectionTarget` returns null and
                  // the chapter journey renders it as upcoming.
                  onOpenSection={(sectionId) => {
                    const target = openableSectionTarget(sectionId);
                    if (!target) return;
                    if (target.kind === 'section_74_practice') {
                      setView('section74Practice');
                      return;
                    }
                    goLearn(target.skillId as SkillId);
                  }}
                  learnOverride={
                    <Class6ChapterList
                      onOpenChapter={(id) =>
                        setOpenChapterId(`official:${id}`)
                      }
                    />
                  }
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
                onResumeSession={resumeSession}
                // v0.70 §27 — THIS PROP WAS MISSING.
                //
                // Two outlets render the student shell: one for the
                // Learn TAB and one for everything else, including an
                // OPEN CHAPTER. Only the first was given
                // `onOpenSection`, and the chapter journey is rendered
                // by the second — so every section tap inside a chapter
                // called an undefined handler and did nothing.
                //
                // The dead links therefore had two independent causes,
                // and fixing only the hard-coded id in the other outlet
                // would have left them dead. Neither was visible to any
                // test, because no test tapped.
                onOpenSection={(sectionId) => {
                  const target = openableSectionTarget(sectionId);
                  if (!target) return;
                  if (target.kind === 'section_74_practice') {
                    setView('section74Practice');
                    return;
                  }
                  goLearn(target.skillId as SkillId);
                }}
                // v0.58 §9 — a live formal assignment for this
                // student's classroom. Production cannot create one, so
                // this is null and the card never renders.
                growthAssignment={
                  activeAssignmentForStudent(
                    formalAssignments,
                    activeStudent.primaryClassroomId ?? null,
                    Date.now(),
                    activeStudent.id
                  )
                }
                // §11 — an unfinished sitting outranks a fresh start.
                growthInProgress={Boolean(
                  formalSessions.activeForStudent(activeStudent.id)
                )}
                onStartGrowthCheck={() => {
                  const open = formalSessions.activeForStudent(
                    activeStudent.id
                  );
                  const assignment = activeAssignmentForStudent(
                    formalAssignments,
                    activeStudent.primaryClassroomId ?? null,
                    Date.now(),
                    activeStudent.id
                  );
                  // Resume the SAME session; never reassemble.
                  if (open && assignment) {
                    const r = resumeFormalSession({
                      state: open, assignment, now: Date.now(),
                    });
                    if (!r.ok) {
                      setBannerError(r.reason);
                      return;
                    }
                    formalSessions.save(r.state);
                    setFormalSessionId(r.state.sessionId);
                    setView('growthSitting');
                    return;
                  }
                  setView('growthCheck');
                }}
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
                  You have not answered this question yet. We'll save your
                  place and you can finish this set later.
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
            classrooms={loadClassrooms().filter((c) => !c.archived)}
            selectedClassroomId={teacherClassroomId}
            onSelectClassroom={setTeacherClassroomId}
          >
            {teacherTab === 'overview' && (
              <TeacherOverviewBody
                // v0.50 §7/§8 — real evidence, scoped to the selected
                // classroom. Replaces the hard-coded zero that v0.49
                // rendered as "Nobody on the flag list right now".
                analytics={teacherOverviewAnalytics}
                scopeLabel={teacherScope.scopeLabel}
                skillLabelFor={(id) => SKILL_LABELS[id as SkillId] ?? id}
                activeAssignmentTitle={
                  loadAssignments().find((a) => a.active)?.title ?? null
                }
                onOpenAssign={() => setView('assignments')}
                onOpenClasses={() => setView('teacher')}
                // v0.74 §11/§12 — the phone has no header nav, so these
                // are the only route to Assess and Insights below `md`.
                onOpenAssess={() => setTeacherTab('assess')}
                onOpenInsights={() => setTeacherTab('insights')}
                // v0.75 §15 — label and destination must agree.
                onOpenCurriculum={() => setTeacherTab('resources')}
              />
            )}
            {/* v0.52 §14 — Pragati Growth, wired in. The panel reports
                truthfully that no eligible item bank exists rather than
                offering an assessment that cannot run. */}
            {teacherTab === 'assess' && (
              <div className="space-y-6">
              <GrowthAssignPanel
                // §5 — pass the real grade, not just id and name.
                classrooms={loadClassrooms()
                  .filter((c) => !c.archived)
                  .map((c) => ({ id: c.id, name: c.name, grade: c.gradeId }))}
                selectedClassroomId={teacherClassroomId}
                onSelectClassroom={setTeacherClassroomId}
                // v0.61 §4 — the same inputs the assign handler uses,
                // so the panel's readiness and the assignment attempt
                // can never disagree.
                preparation={growthPreparationInputs}
                // v0.59 §3 — the REAL assignment flow. Production is
                // still blocked upstream: prepareGrowthAdministration
                // refuses without an approved framework, so
                // createFormalAssignment returns ok:false and nothing
                // is persisted. The path is wired, not fake.
                onAssign={(draft) => {
                  // v0.60 §3 — NO Class 6 fallback. An unrecognised
                  // grade is refused; assigning a Class 6 form to a
                  // Class 9 class would be a silent, serious error.
                  const classroom = loadClassrooms().find(
                    (c) => c.id === draft.classroomId
                  );
                  const grade = normalizeGrade(classroom?.gradeId);
                  if (!grade) {
                    setBannerError(
                      'This class has no recognised year group. Set it under Classes before assigning.'
                    );
                    return;
                  }
                  const prep = prepareGrowthAdministration({
                    context: 'growth_field_test',
                    records: growthBank.records,
                    metadata: growthBank.metadata,
                    lookup: growthSpecLookup,
                    grade,
                    ...(deps?.administrationSpec
                      ? { spec: deps.administrationSpec }
                      : {}),
                    ...(deps?.frameworkAuthorization
                      ? { authorization: deps.frameworkAuthorization }
                      : {}),
                  });
                  const created = createFormalAssignment({
                    preparation: prep,
                    classroomId: draft.classroomId,
                    targetGrade: grade,
                    opensAt: draft.opensAt,
                    closesAt: draft.closesAt,
                    window: draft.window,
                    // §9 — freeze the roster now. Later membership
                    // changes must not alter who may sit this form.
                    assignedStudentIds:
                      loadClassrooms().find((c) => c.id === draft.classroomId)
                        ?.studentIds ?? [],
                    // §5 — carry the teacher's support selections
                    // through instead of discarding them.
                    // Class-wide supports expanded per roster student.
                    supportsByStudent: (
                      loadClassrooms().find((c) => c.id === draft.classroomId)
                        ?.studentIds ?? []
                    ).map((studentId) => ({
                      studentId,
                      supportIds: draft.classWideSupportIds,
                    })),
                    newId: generateId,
                    now: Date.now(),
                  });
                  if (!created.ok) {
                    setBannerError(created.reasons.join(' '));
                    return;
                  }
                  formalAssignments.create(created.assignment);
                  localAuditRepository.record({
                    eventId: generateId(),
                    timestamp: Date.now(),
                    actorType: 'teacher',
                    actorId: null,
                    assignmentId: created.assignment.assignmentId,
                    sessionId: null,
                    eventType: 'assignment_created',
                  });
                  bumpStore();
                }}
              />
              {/* v0.60 §14/§15 — management and participation. */}
              <AssignmentManagementPanel
                assignments={formalAssignments
                  .all()
                  .filter((a) =>
                    teacherClassroomId ? a.classroomId === teacherClassroomId : true
                  )}
                sessionsFor={(id) =>
                  formalSessions.all().filter((x) => x.assignmentId === id)
                }
                nameOf={(id) =>
                  loadStudents().find((s) => s.id === id)?.name ?? 'Unknown student'
                }
                classroomNameOf={(id) =>
                  loadClassrooms().find((c) => c.id === id)?.name ?? 'Class'
                }
                onCancel={(id) => {
                  formalAssignments.cancel(id);
                  localAuditRepository.record({
                    eventId: generateId(),
                    timestamp: Date.now(),
                    actorType: 'teacher',
                    actorId: null,
                    assignmentId: id,
                    sessionId: null,
                    eventType: 'assignment_cancelled',
                  });
                  bumpStore();
                }}
                now={Date.now()}
              />
              </div>
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
                <div className="space-y-8">
                  {/* v0.62 §14 — coverage moved out of Admin, where
                      v0.61 found it trapped. */}
                  {/* v0.68 (Classes 1-12) — the official curriculum for
                      every grade, separate from what Pragati covers. A
                      teacher must be able to see the whole official
                      structure, including the parts Pragati has nothing
                      for. */}
                  <CurriculumCompletenessForTeachers />
                  <CurriculumCoverageForTeachers />
                  {/* v0.63 §6 — assignment by official section. Shows
                      the real (empty) eligible set rather than a
                      fabricated example. */}
                  <SectionAssignmentPanel />
                  <TeacherResourcesBody onOpenChapter={setTeacherChapterId} />
                </div>
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

        {/* v0.58 §9 — the student formal flow, inside StudentShell.
            Unreachable in production because no assignment exists. */}
        {/* v0.59 §7/§8/§10 — the active formal sitting. */}
        {view === 'growthSitting' && (() => {
          const students = loadStudents();
          const active =
            (selectedStudentId
              ? students.find((s) => s.id === selectedStudentId)
              : null) ?? students[0] ?? null;
          const sessionState = formalSessionId
            ? formalSessions.get(formalSessionId)
            : null;
          const assignment = sessionState
            ? formalAssignments
                .all()
                .find((a) => a.assignmentId === sessionState.assignmentId) ?? null
            : null;
          if (!active || !sessionState || !assignment) {
            setView('landing');
            return null;
          }

          if (sessionState.status === 'completed') {
            const outcome = fieldTestOutcome(sessionState);
            return renderInStudentShell({
              appMode, selectedStudentId, studentTab,
              onSwitchTab: setStudentTab, openChapterId,
              onOpenChapter: setOpenChapterId, locked: false,
              child: (
                <GrowthComplete
                  studentName={active.name}
                  itemsAnswered={outcome.itemsAdministered}
                  onDone={() => {
                    setFormalSessionId(null);
                    setView('landing');
                  }}
                />
              ),
            });
          }

          return renderInStudentShell({
            appMode, selectedStudentId, studentTab,
            onSwitchTab: setStudentTab, openChapterId,
            onOpenChapter: setOpenChapterId,
            // §14 — instructional navigation genuinely locked.
            locked: true,
            onExitSession: () => setView('landing'),
            exitLabel: 'Pause',
            child: (
              <FormalSittingView
                state={sessionState}
                studentName={active.name}
                content={(id) => growthBank.content[id] ?? null}
                onSubmit={({ itemId, value, omitted, elapsedMs }) => {
                  // v0.60 §7 — real exposure. v0.59 passed an empty log
                  // and discarded the result, so no item ever
                  // accumulated exposure and rotation/retirement had
                  // nothing to work from.
                  const r = recordFormalResponse({
                    state: sessionState,
                    exposure: localExposureRepository.load(),
                    itemId,
                    responseValue: value,
                    omitted,
                    responseTimeMs: elapsedMs,
                    now: Date.now(),
                    context: 'growth_field_test',
                  });
                  if (r.rejected) {
                    setBannerError(r.rejected);
                    return;
                  }
                  localExposureRepository.save(r.exposure);
                  formalSessions.save(r.state);
                  if (r.state.status === 'completed') {
                    localAuditRepository.record({
                      eventId: generateId(),
                      timestamp: Date.now(),
                      actorType: 'student',
                      actorId: r.state.studentId,
                      assignmentId: r.state.assignmentId,
                      sessionId: r.state.sessionId,
                      eventType: 'session_completed',
                    });
                  }
                  bumpStore();
                }}
                onPause={() => setView('landing')}
                onAbandon={() => {
                  formalSessions.save(
                    abandonFormalSession(sessionState, Date.now())
                  );
                  setFormalSessionId(null);
                  setView('landing');
                }}
              />
            ),
          });
        })()}

        {view === 'growthCheck' && (() => {
          const students = loadStudents();
          const active =
            (selectedStudentId
              ? students.find((s) => s.id === selectedStudentId)
              : null) ?? students[0] ?? null;
          const assignment = activeAssignmentForStudent(
            formalAssignments,
            active?.primaryClassroomId ?? null,
            Date.now(),
            active?.id
          );
          if (!active || !assignment) {
            setView('landing');
            return null;
          }
          return renderInStudentShell({
            appMode,
            selectedStudentId,
            studentTab,
            onSwitchTab: setStudentTab,
            openChapterId,
            onOpenChapter: setOpenChapterId,
            // Instructional navigation is locked for the sitting.
            locked: true,
            onExitSession: () => setView('landing'),
            exitLabel: 'Exit',
            child: (
              <GrowthInstructions
                studentName={active.name}
                itemCount={assignment.form.itemIdsInOrder.length}
                // §5 — starts the FORMAL session, not practice.
                onBegin={() => {
                  const started = startFormalSession({
                    assignment,
                    studentId: active.id,
                    supportIds:
                      assignment.supportsByStudent.find(
                        (x) => x.studentId === active.id
                      )?.supportIds ?? [],
                    newId: generateId,
                    now: Date.now(),
                  });
                  if (!started.ok) {
                    setBannerError(started.reason);
                    setView('landing');
                    return;
                  }
                  formalSessions.save(started.state);
                  setFormalSessionId(started.state.sessionId);
                  setView('growthSitting');
                }}
                onBack={() => setView('landing')}
              />
            ),
          });
        })()}

        {view === 'curriculumCoverage' && (
          // v0.71 §18 — ADMIN LOOKS LIKE ADMIN.
          //
          // Teacher and Admin were the same table interface with
          // different headings, which is what §18 objected to. They are
          // different products for different people: a teacher wants to
          // know what to do next in a classroom; an administrator or
          // researcher wants to know what the evidence is and how far it
          // can be trusted.
          //
          // The separation is structural rather than decorative — a dark
          // slate banner, a stated scope, and an explicit note that this
          // surface deliberately exposes provenance and status that the
          // teacher product hides. Anyone landing here should know
          // immediately that they are behind the curtain.
          <div className="space-y-4">
            <div className="rounded-xl3 bg-slate-900 p-5 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Admin &amp; Research
                  </p>
                  <h1 className="mt-1 font-display text-xl font-bold tracking-tight">
                    Curriculum evidence &amp; content governance
                  </h1>
                </div>
                <button
                  onClick={() => setView('teacherLanding')}
                  className="tap rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                >
                  ← Teacher dashboard
                </button>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                This surface shows source provenance, verification status,
                content fingerprints and review state. It is deliberately
                denser than the teacher product, and these details are hidden
                there on purpose — a teacher needs to know what to teach, not
                which archive a chapter list was read from.
              </p>
              <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-400">
                Pilot status: pre-pilot. Pragati does not produce a calibrated
                score, no content is educator-reviewed, and no Fractions
                section is published. A calibration study is required before
                any operational use.
              </p>
            </div>
            {/* v0.55 §12 — ONE canonical Curriculum & Readiness view.
                The v0.54 audit found this screen stacking two
                overlapping tables; the separate CurriculumCoverageView
                is retired from this route. No information was lost —
                source status and module id are columns here. */}
            <ReadinessMatrix
              grades={[
                'class1','class2','class3','class4','class5','class6',
                'class7','class8','class9','class10','class11','class12',
              ]}
            />
            {/* v0.61 §11 — section-level roadmap for the one grade with
                a primary-verified official unit list. */}
            <ContentRoadmap
              onOpenDemonstration={() => setView('demonstrationPreview')}
            />
            {/* v0.72 §8 — the master coverage matrix. Official
                curriculum, Pragati content and review state as three
                separate column groups. */}
            <div className="rounded-xl2 border border-slate-200 bg-white p-4">
              <CoverageMatrixPanel />
            </div>

            {/* v0.73 — the authoring plan. What the backlog implies as
                work, and how much of it engineering can actually do. */}
            <div className="rounded-xl2 border border-slate-200 bg-white p-4">
              <ContentPlanPanel />
            </div>

            {/* v0.74 §20/§21 — the OTHER backlog. Seven grades produce no
                content-plan entries because nobody has read their
                textbooks, and a reader of "89 records" would otherwise
                take that for the whole of Classes 1-12. */}
            <div className="rounded-xl2 border border-slate-200 bg-white p-4">
              <StructureVerificationPanel />
            </div>

            {/* v0.69 §16 — verify a pending grade from its textbook.
                Admin-only: §14 keeps governance density away from
                teachers, who need coverage, not ingestion tooling. */}
            <div className="rounded-xl2 border border-slate-200 bg-white p-4">
              <CurriculumVerificationPanel />
            </div>

            {/* v0.67 §13 — walk the whole draft chapter. */}
            <button
              type="button"
              onClick={() => setView('chapterReviewPreview')}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-left text-sm font-medium text-slate-800"
            >
              Open the Chapter 7 draft review (all 9 parts) →
            </button>
          </div>
        )}

        {/* v0.61 §10 — reviewer preview. Admin-only: the demonstration
            section is authored_draft and no educator has reviewed it. */}
        {/* v0.62 §3/§12 — student Class 6 pathway. Replaces a Home
            screen that showed one legacy module card. */}
        {view === 'class6Chapters' && (
          <Class6ChapterList
            onOpenChapter={(id) =>
              setView(
                id === 'ncert_gp_c6_ch07_fractions'
                  ? 'fractionsChapter'
                  : 'class6Chapters'
              )
            }
          />
        )}

        {view === 'fractionsChapter' && (
          <FractionsChapterLanding
            onBack={() => setView('class6Chapters')}
            onOpenPractice={() => setView('section74Practice')}
          />
        )}

        {view === 'section74Practice' && (
          <Section74Practice onBack={() => setView('fractionsChapter')} />
        )}

        {view === 'chapterReviewPreview' && (
          <ChapterReviewPreview onBack={() => setView('curriculumCoverage')} />
        )}

        {view === 'demonstrationPreview' && (
          <DemonstrationSectionPreview
            onBack={() => setView('curriculumCoverage')}
          />
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

      <Footer appMode={appMode} />
    </div>
  );
}



// (v0.7's ModuleTeaserCard and v0.5's FeatureCard were retired in v0.8 when
// Landing became the simple student home and TeacherLanding took over the
// module-grid responsibility.)

