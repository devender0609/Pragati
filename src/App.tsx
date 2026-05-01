import { useEffect, useMemo, useState } from 'react';
import {
  ITEMS,
  MISCONCEPTION_LABELS,
  evaluateNumericAnswer,
  type AreaGrid,
  type FractionBar,
  type Item,
  type MCQItem,
  type NumericItem,
  type VisualSpec,
} from './data/items';
import {
  buildSessionPool,
  createInitialState,
  filterItemsBySkillMode,
  pickNextItem,
  updateAbility,
  shouldStop,
  SESSION_SIZE,
  type EngineState,
} from './lib/adaptiveEngine';
import {
  averageTimeSec,
  bandAccuracy,
  bandDescription,
  bandColor,
  computeBand,
  correctCount,
  growthIndicator,
  isMixedSession,
  recommendPrerequisites,
  sessionConfidence,
  summarizeBySkill,
  summarizeMisconceptions,
  summarizeSession,
  type Band,
  type GrowthIndicator,
  type SessionSummary,
  type SkillBreakdown,
} from './lib/scoring';
import {
  buildExportBundle,
  deleteStudent,
  endActivePilot,
  exportAllAsJSON,
  findOrCreateStudent,
  generateId,
  getActivePilot,
  getCompletedSessionsForStudent,
  getItemReview,
  getSessionFeedback,
  loadAppMode,
  loadItemReviews,
  loadPilots,
  loadSessions,
  loadStudents,
  newItemReview,
  reviewStatusCounts,
  saveAppMode,
  saveItemReview,
  savePilot,
  saveSession,
  saveSessionFeedback,
} from './lib/storage';
import {
  buildItemQualitySummary,
  buildItemQualityById,
  flagCounts,
  FLAG_LABELS,
  type ItemQualityFlag,
} from './lib/itemQuality';
import {
  buildTeachingPlan,
  type TeachingPlan,
  type WeakSkill,
} from './lib/teachingPlan';
import {
  buildClassAggregate,
  filterFromValue,
  type ClassAggregate,
  type ClassMisconceptionRow,
  type ClassHardestItem,
} from './lib/classDashboard';
import { LESSONS, type Lesson } from './data/lessons';
import {
  STATIC_PREREQUISITES_BY_SKILL,
} from './lib/scoring';
import {
  computeSkillProgress,
  RECOMMENDED_ORDER,
  SKILL_STATUS_COLOR,
  SKILL_STATUS_LABELS,
  suggestNextStep,
  type NextStepSuggestion,
  type SkillProgress,
  type SkillStatus,
} from './lib/progression';
import {
  ASSESSMENT_WINDOWS,
  ASSESSMENT_WINDOW_DESCRIPTIONS,
  ASSESSMENT_WINDOW_LABELS,
  MODULE_DESCRIPTIONS,
  MODULE_FOR_SKILL,
  MODULE_IDS_ORDERED,
  MODULE_LABELS,
  SKILLS_BY_MODULE,
  SKILL_IDS_ORDERED,
  SKILL_LABELS,
  SKILL_MODE_DESCRIPTIONS,
  SKILL_MODE_LABELS,
  moduleForSkillMode,
  type AppMode,
  type AssessmentWindow,
  type DifficultyRating,
  type ItemReview,
  type ItemReviewStatus,
  type ModuleId,
  type PicturesHelped,
  type PilotMetadata,
  type Session,
  type SessionFeedback,
  type SessionFeedbackDifficulty,
  type SkillId,
  type SkillMode,
  type Student,
  type YesNo,
  type YesNoNa,
} from './types';

// Per-module colour palette. We colour skill chips by which module the skill
// belongs to so the ~22 skills don't each need a unique palette.
const MODULE_CHIP_CLASS: Record<ModuleId, string> = {
  fractions: 'bg-brand-50 text-brand-700 ring-brand-200',
  decimals: 'bg-sky-50 text-sky-700 ring-sky-200',
  factors_multiples: 'bg-amber-50 text-amber-700 ring-amber-200',
  ratio_proportion: 'bg-violet-50 text-violet-700 ring-violet-200',
};

const FULL_MIXED_CHIP_CLASS = 'bg-slate-100 text-slate-700 ring-slate-200';

// Per-skill colour palette for chips, cards, and accent rings. Looks up the
// module the skill belongs to (or returns the neutral chip for the
// across-the-whole-module 'mixed' mode).
const skillChipClass = (mode: SkillMode): string => {
  if (mode === 'mixed') return FULL_MIXED_CHIP_CLASS;
  const module = moduleForSkillMode(mode);
  return module ? MODULE_CHIP_CLASS[module] : FULL_MIXED_CHIP_CLASS;
};

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
  | 'itemReview'     // v0.8: per-item review list + form
  | 'pilotSetup'     // v0.8: start / end a pilot
  | 'teachingPlan';  // v0.8: planning summary

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [engine, setEngine] = useState<EngineState>(createInitialState);
  const [sessionPool, setSessionPool] = useState<Item[]>([]);
  const [current, setCurrent] = useState<Item | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [numericInput, setNumericInput] = useState<string>('');
  const [itemStartTs, setItemStartTs] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

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

  // v0.8: app-mode (student / teacher), persisted to localStorage.
  const [appMode, setAppModeState] = useState<AppMode>(() => loadAppMode());
  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    saveAppMode(mode);
  };

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
    skillMode: SkillMode
  ) => {
    // Build a stratified, mostly-fresh session pool of 10 items, scoped to
    // the chosen skill mode. For 'mixed' the entire 44-item bank is in
    // play; for a single skill, only that skill's items.
    const priorIds = getCompletedSessionsForStudent(student.id).flatMap((s) =>
      s.responses.map((r) => r.itemId)
    );
    const skillItems = filterItemsBySkillMode(ITEMS, skillMode);
    const pool = buildSessionPool(skillItems, priorIds);
    const fresh = createInitialState();
    const first = pickNextItem(pool, fresh.attemptedIds, fresh.ability);

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
      />

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-12">
        {view === 'landing' && (
          <Landing
            onStart={() => {
              setPrefillStudent(null);
              setPrefillSkillMode(null);
              setView('startForm');
            }}
            onLearn={() => setView('class6math')}
            onTeacher={() => {
              setSelectedStudentId(null);
              setView('teacher');
            }}
          />
        )}

        {view === 'class6math' && (
          <Class6MathDashboard
            onOpenModule={goModule}
            onStartAssessment={goAssessmentForSkill}
            onBack={goLanding}
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
            onCancel={goLanding}
            onStart={(student, window, skillMode) =>
              startAssessmentFor(student, window, skillMode)
            }
          />
        )}

        {view === 'assessment' && current && session && (
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
          />
        )}

        {view === 'results' && session?.completedAt && (
          <Results
            session={session}
            onAnotherSession={startNewForSameStudent}
            onTeacher={() => {
              setSelectedStudentId(session.studentId);
              setView('studentDetail');
            }}
            onHome={goLanding}
            onOpenLesson={goLearn}
            onStartAssessment={goAssessmentForSkill}
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
          <ClassDashboard
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
          <TeacherLanding
            key={`teacher-landing-${storeVersion}`}
            onOpenStudents={() => setView('teacher')}
            onOpenClassDashboard={() => setView('classDashboard')}
            onOpenItemReview={() => {
              setReviewItemId(null);
              setView('itemReview');
            }}
            onOpenPilotSetup={() => setView('pilotSetup')}
            onOpenTeachingPlan={() => setView('teachingPlan')}
            onOpenLearn={() => setView('class6math')}
            onStart={() => {
              setPrefillStudent(null);
              setPrefillSkillMode(null);
              setView('startForm');
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
      </main>

      <Footer />
    </div>
  );
}

// ===========================================================================
// NavBar
// ===========================================================================
function NavBar({
  view,
  appMode,
  onSetAppMode,
  onNavLanding,
  onNavLearn,
  onNavTeacher,
}: {
  view: View;
  appMode: AppMode;
  onSetAppMode: (m: AppMode) => void;
  onNavLanding: () => void;
  onNavLearn: () => void;
  onNavTeacher: () => void;
}) {
  const learnActive =
    view === 'class6math' || view === 'module' || view === 'learn';
  const teacherActive =
    view === 'teacher' ||
    view === 'teacherLanding' ||
    view === 'studentDetail' ||
    view === 'classDashboard' ||
    view === 'itemReview' ||
    view === 'pilotSetup' ||
    view === 'teachingPlan';
  const activePilot = getActivePilot();
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <button
          onClick={onNavLanding}
          className="flex items-center gap-2 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-base font-bold text-white shadow-sm">
            P
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-900">Pragati</div>
            <div className="text-xs text-slate-500">
              Growth assessment prototype · Class 6 Math
            </div>
          </div>
          <div className="block sm:hidden text-sm font-semibold text-slate-900">
            Pragati
          </div>
        </button>
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          {appMode === 'teacher' && activePilot && (
            <span
              className="hidden items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 sm:inline-flex"
              title={`Active pilot: ${activePilot.teacherName} · ${activePilot.className} (${activePilot.school})`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Pilot
            </span>
          )}
          {appMode === 'teacher' && (
            <>
              <button
                onClick={onNavLearn}
                className={`rounded-lg px-2.5 py-1.5 text-sm font-medium transition sm:px-3 ${
                  learnActive
                    ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Learn
              </button>
              <button
                onClick={onNavTeacher}
                className={`rounded-lg px-2.5 py-1.5 text-sm font-medium transition sm:px-3 ${
                  teacherActive
                    ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="hidden sm:inline">Teacher dashboard</span>
                <span className="sm:hidden">Teacher</span>
              </button>
            </>
          )}
          <ModeToggle appMode={appMode} onSetAppMode={onSetAppMode} />
        </nav>
      </div>
    </header>
  );
}

function ModeToggle({
  appMode,
  onSetAppMode,
}: {
  appMode: AppMode;
  onSetAppMode: (m: AppMode) => void;
}) {
  const next: AppMode = appMode === 'student' ? 'teacher' : 'student';
  return (
    <button
      onClick={() => onSetAppMode(next)}
      className="ml-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200 sm:ml-2 sm:text-xs"
      title={`Switch to ${next} mode`}
    >
      {appMode === 'student' ? 'Student mode' : 'Teacher mode'}
    </button>
  );
}

// ===========================================================================
// Landing — student home (v0.8: simplified, three big actions)
// ===========================================================================
function Landing({
  onStart,
  onLearn,
  onTeacher,
}: {
  onStart: () => void;
  onLearn: () => void;
  onTeacher: () => void;
}) {
  // Compute device-wide progression so we can pick a "weak skill" and a
  // "next skill" suggestion. Both fall back to FR.02 if there's no
  // session history yet.
  const progress = useMemo(
    () => computeSkillProgress(loadSessions(), ITEMS),
    []
  );
  // Weak skill: the first skill (in curriculum order) with a 'developing'
  // status. Falls back to the first non-strong skill, then to FR.02.
  const weakSkill: SkillId = useMemo(() => {
    for (const s of SKILL_IDS_ORDERED) {
      if (progress[s].status === 'developing') return s;
    }
    for (const s of SKILL_IDS_ORDERED) {
      if (progress[s].status !== 'strong') return s;
    }
    return SKILL_IDS_ORDERED[0];
  }, [progress]);
  // Next skill: first skill that hasn't been started yet, or the first
  // non-strong skill. Same fallback.
  const nextSkill: SkillId = useMemo(() => {
    for (const s of SKILL_IDS_ORDERED) {
      if (progress[s].status === 'not_started') return s;
    }
    for (const s of SKILL_IDS_ORDERED) {
      if (progress[s].status !== 'strong') return s;
    }
    return SKILL_IDS_ORDERED[SKILL_IDS_ORDERED.length - 1];
  }, [progress]);

  // Has the student done anything yet on this device?
  const totalSessions = loadSessions().length;
  const hasHistory = totalSessions > 0;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 shadow-sm ring-1 ring-slate-200 sm:p-10">
        <div className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          Class 6 Math · Student
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          What do you want to do today?
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {hasHistory
            ? 'Pick one of the three options below. We picked them based on what you have done so far on this device.'
            : 'Pick one of the three options below to get started.'}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StudentActionCard
          title="Start recommended assessment"
          subtitle="Mixed Class 6 Math · 8–10 questions"
          body="A short adaptive check across the whole module. The questions adjust to your answers."
          ctaLabel="Start assessment"
          tone="brand"
          onClick={onStart}
        />
        <StudentActionCard
          title="Practise a weak skill"
          subtitle={`${weakSkill} — ${SKILL_LABELS[weakSkill]}`}
          body={
            hasHistory
              ? `Open the Learn page for ${weakSkill} — reteach + worked examples + 5 practice questions.`
              : `No sessions yet, so we picked ${weakSkill} as a sensible starting point.`
          }
          ctaLabel={`Open ${weakSkill} practice`}
          tone="rose"
          onClick={onLearn}
        />
        <StudentActionCard
          title="Learn the next skill"
          subtitle={`${nextSkill} — ${SKILL_LABELS[nextSkill]}`}
          body={
            hasHistory
              ? `The next skill in the recommended order, based on what you have done so far.`
              : `${nextSkill} is the next skill in the recommended order.`
          }
          ctaLabel={`Open ${nextSkill} lesson`}
          tone="violet"
          onClick={onLearn}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              For your teacher
            </div>
            <p className="mt-1 text-sm text-slate-700">
              Looking for the teacher dashboard, item review, or pilot setup?
            </p>
          </div>
          <button onClick={onTeacher} className="btn-secondary">
            Switch to teacher mode →
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">What this is not</div>
        <p className="mt-1">
          This is a pre-pilot prototype. It does not produce a calibrated score
          and does not claim official CBSE alignment. The "growth indicator"
          is an early signal from a rule-based heuristic on a small item bank,
          not a validated growth metric.
        </p>
      </section>
    </div>
  );
}

function StudentActionCard({
  title,
  subtitle,
  body,
  ctaLabel,
  tone,
  onClick,
}: {
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  tone: 'brand' | 'rose' | 'violet';
  onClick: () => void;
}) {
  const ringClass =
    tone === 'brand'
      ? 'border-brand-200 bg-brand-50/40'
      : tone === 'rose'
        ? 'border-rose-200 bg-rose-50/40'
        : 'border-violet-200 bg-violet-50/40';
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-5 ring-1 ring-slate-100 transition hover:shadow-md sm:p-6 ${ringClass}`}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {subtitle}
      </div>
      <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{body}</p>
      <button onClick={onClick} className="btn-primary mt-4 w-fit text-sm">
        {ctaLabel}
      </button>
    </article>
  );
}

// (v0.7's ModuleTeaserCard and v0.5's FeatureCard were retired in v0.8 when
// Landing became the simple student home and TeacherLanding took over the
// module-grid responsibility.)

// ===========================================================================
// Teacher landing — the home screen seen in teacher mode
// ===========================================================================
function TeacherLanding({
  onOpenStudents,
  onOpenClassDashboard,
  onOpenItemReview,
  onOpenPilotSetup,
  onOpenTeachingPlan,
  onOpenLearn,
  onStart,
}: {
  onOpenStudents: () => void;
  onOpenClassDashboard: () => void;
  onOpenItemReview: () => void;
  onOpenPilotSetup: () => void;
  onOpenTeachingPlan: () => void;
  onOpenLearn: () => void;
  onStart: () => void;
}) {
  const totalSessions = loadSessions().length;
  const totalStudents = loadStudents().length;
  const totalItems = ITEMS.length;
  const totalSkills = SKILL_IDS_ORDERED.length;
  const totalModules = MODULE_IDS_ORDERED.length;
  const reviews = loadItemReviews();
  const reviewCounts = reviewStatusCounts(reviews);
  const reviewedCount = reviewCounts.approved + reviewCounts.needs_revision;
  const activePilot = getActivePilot();

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 shadow-sm ring-1 ring-slate-200 sm:p-10">
        <div className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          Teacher · Class 6 Math
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Plan a lesson, run a pilot, review the bank.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Pragati covers {totalModules} Class 6 Math modules ({totalSkills}{' '}
          skills · {totalItems} items). All data stays on this device.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={onStart} className="btn-primary">
            Start a session
          </button>
          <button onClick={onOpenLearn} className="btn-secondary">
            Open Class 6 Math
          </button>
        </div>
        {(totalSessions > 0 || totalStudents > 0) && (
          <div className="mt-5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
            <span className="font-medium text-slate-700">On this device:</span>
            <span>
              {totalStudents} student{totalStudents === 1 ? '' : 's'} ·{' '}
              {totalSessions} session{totalSessions === 1 ? '' : 's'} ·{' '}
              {reviewedCount} item review{reviewedCount === 1 ? '' : 's'}
              {activePilot ? ` · pilot active (${activePilot.className})` : ''}
            </span>
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TeacherToolCard
          title="Students"
          subtitle="Per-student growth + history"
          body="One row per student with sessions, growth history, item-by-item responses, and recommended next steps."
          onClick={onOpenStudents}
        />
        <TeacherToolCard
          title="Class dashboard"
          subtitle="Class-level roll-up"
          body="Misconception distribution, hardest items, class average accuracy. Filter by skill or module."
          onClick={onOpenClassDashboard}
        />
        <TeacherToolCard
          title="Teaching plan"
          subtitle="Top 3 weak skills + small groups"
          body="Auto-generated next-lesson plan: weakest skills, top misconceptions, suggested groupings, recommended reteach."
          onClick={onOpenTeachingPlan}
        />
        <TeacherToolCard
          title="Item review"
          subtitle={`${reviewedCount} of ${ITEMS.length} reviewed · ${reviewCounts.needs_revision} flagged`}
          body="Walk the bank item-by-item: verify correctness, wording, grade-fit, visuals, difficulty, and ambiguity. Add comments."
          onClick={onOpenItemReview}
        />
        <TeacherToolCard
          title="Pilot mode"
          subtitle={
            activePilot
              ? `Active: ${activePilot.className} · ${activePilot.school}`
              : 'No pilot active'
          }
          body="Tag every session in this run with a teacher / class / school context. End the pilot when the run is over."
          onClick={onOpenPilotSetup}
        />
        <TeacherToolCard
          title="Learn"
          subtitle="Lesson pages for all 22 skills"
          body="Open the Class 6 Math module dashboard. Every skill has a reteach lesson, two worked examples, three common-mistake notes, and 5 practice items."
          onClick={onOpenLearn}
        />
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">Reminder</div>
        <p className="mt-1">
          This is a pre-pilot prototype. Skill-status labels and item
          quality flags come from rule-based heuristics on a small bank,
          not calibrated psychometrics. Use them to focus a teacher
          conversation — not to make placement decisions or to claim
          official CBSE alignment.
        </p>
      </section>
    </div>
  );
}

function TeacherToolCard({
  title,
  subtitle,
  body,
  onClick,
}: {
  title: string;
  subtitle: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start rounded-2xl bg-white p-5 text-left ring-1 ring-slate-200 transition hover:shadow-md sm:p-6"
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {subtitle}
      </div>
      <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {body}
      </p>
      <span className="mt-3 text-xs font-semibold text-brand-700 group-hover:underline">
        Open →
      </span>
    </button>
  );
}

// ===========================================================================
// Class 6 Math dashboard — top-level (4 module cards)
// ===========================================================================
function Class6MathDashboard({
  onOpenModule,
  onStartAssessment,
  onBack,
}: {
  onOpenModule: (m: ModuleId) => void;
  onStartAssessment: (mode: SkillMode) => void;
  onBack: () => void;
}) {
  const progress = useMemo(
    () => computeSkillProgress(loadSessions(), ITEMS),
    []
  );

  // Per-module aggregate stats for the module cards.
  const perModuleStats = useMemo(() => {
    const out = {} as Record<
      ModuleId,
      { totalSkills: number; started: number; strong: number; itemCount: number }
    >;
    for (const m of MODULE_IDS_ORDERED) {
      const skills = SKILLS_BY_MODULE[m];
      const itemCount = ITEMS.filter((i) => MODULE_FOR_SKILL[i.skillId] === m)
        .length;
      out[m] = {
        totalSkills: skills.length,
        started: skills.filter((s) => progress[s].status !== 'not_started')
          .length,
        strong: skills.filter((s) => progress[s].status === 'strong').length,
        itemCount,
      };
    }
    return out;
  }, [progress]);

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to home
        </button>
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 ring-1 ring-slate-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Class 6 · Math
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Four modules, {ITEMS.length} items, all on this device.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Pick a module to learn or assess one skill at a time, or run a
          Mixed Class 6 Math Assessment that draws across every module.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => onStartAssessment('mixed')}
            className="btn-primary"
          >
            Take the Mixed Class 6 Math Assessment
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULE_IDS_ORDERED.map((m) => (
          <ModuleCard
            key={m}
            moduleId={m}
            stats={perModuleStats[m]}
            onOpen={() => onOpenModule(m)}
            onStartAssessment={() =>
              onStartAssessment(`mixed_${m}` as SkillMode)
            }
          />
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">Reminder</div>
        <p className="mt-1">
          The content here is a prototype, not a published curriculum. Status
          labels come from a rule-based heuristic on a small bank — a useful
          signal, but not a calibrated mastery claim and not an official CBSE
          score.
        </p>
      </div>
    </div>
  );
}

function ModuleCard({
  moduleId,
  stats,
  onOpen,
  onStartAssessment,
}: {
  moduleId: ModuleId;
  stats: {
    totalSkills: number;
    started: number;
    strong: number;
    itemCount: number;
  };
  onOpen: () => void;
  onStartAssessment: () => void;
}) {
  const ringClass = MODULE_CHIP_CLASS[moduleId];
  return (
    <article className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:shadow-md sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <span
            className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ${ringClass}`}
          >
            {MODULE_LABELS[moduleId]}
          </span>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
            {MODULE_LABELS[moduleId]}
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          {stats.totalSkills} skills · {stats.itemCount} items
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {MODULE_DESCRIPTIONS[moduleId]}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 ring-1 ring-slate-200">
          <span className="font-semibold text-slate-700">
            {stats.strong}/{stats.totalSkills}
          </span>
          Strong
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 ring-1 ring-slate-200">
          <span className="font-semibold text-slate-700">
            {stats.started}/{stats.totalSkills}
          </span>
          started
        </span>
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <button onClick={onOpen} className="btn-primary text-sm">
          Open module
        </button>
        <button onClick={onStartAssessment} className="btn-secondary text-sm">
          Take {MODULE_LABELS[moduleId]} assessment
        </button>
      </div>
    </article>
  );
}

// ===========================================================================
// Per-module dashboard — overview of all skills in one module
// ===========================================================================
function ModuleDashboard({
  moduleId,
  onOpenLesson,
  onStartAssessment,
  onBack,
}: {
  moduleId: ModuleId;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
  onBack: () => void;
}) {
  const skills = SKILLS_BY_MODULE[moduleId];
  const itemCount = ITEMS.filter((i) => MODULE_FOR_SKILL[i.skillId] === moduleId)
    .length;
  // Compute progression once so every SkillCard sees the same snapshot.
  const progress = useMemo(
    () => computeSkillProgress(loadSessions(), ITEMS),
    []
  );
  const focus = useMemo(() => {
    for (const s of skills) {
      if (progress[s].status !== 'strong') return s;
    }
    return null;
  }, [progress, skills]);
  const startedSkills = skills.filter(
    (s) => progress[s].status !== 'not_started'
  ).length;
  const strongSkills = skills.filter(
    (s) => progress[s].status === 'strong'
  ).length;

  const moduleMixedMode = `mixed_${moduleId}` as SkillMode;

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to Class 6 Math
        </button>
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 ring-1 ring-slate-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Class 6 · {MODULE_LABELS[moduleId]} module
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Learn and assess every {MODULE_LABELS[moduleId]} skill.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {skills.length} skills · {itemCount} items, with a short reteach
          lesson, a visual explanation, two worked examples, three
          common-mistake notes, and five practice questions for every skill.
          Pick a skill to study, or run a mixed-skills assessment.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => onStartAssessment(moduleMixedMode)}
            className="btn-primary"
          >
            Take the Mixed {MODULE_LABELS[moduleId]} Assessment
          </button>
          {focus !== null && (
            <button
              onClick={() => onOpenLesson(focus)}
              className="btn-secondary"
            >
              Continue with {focus}
            </button>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 ring-1 ring-slate-200">
            <span className="font-semibold text-slate-700">
              {strongSkills}/{skills.length}
            </span>
            <span>skills marked Strong on this device</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 ring-1 ring-slate-200">
            <span className="font-semibold text-slate-700">
              {startedSkills}/{skills.length}
            </span>
            <span>skills started</span>
          </span>
        </div>
      </div>

      <SkillProgressionStrip
        skills={skills}
        progress={progress}
        onOpenLesson={onOpenLesson}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((s) => (
          <SkillCard
            key={s}
            skillId={s}
            progress={progress[s]}
            onOpenLesson={onOpenLesson}
            onStartAssessment={onStartAssessment}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">Reminder</div>
        <p className="mt-1">
          The lessons here are content drafts for a prototype, not a published
          curriculum. They should be reviewed by a CBSE Class 6 math teacher
          before any real student sees them. Skill-status labels come from a
          rule-based heuristic on a small bank, not from a calibrated mastery
          study.
        </p>
      </div>
    </div>
  );
}

// Compact horizontal "recommended order" strip. Default shows every skill
// (RECOMMENDED_ORDER); a `skills` prop scopes it to one module's skills.
function SkillProgressionStrip({
  skills = RECOMMENDED_ORDER,
  progress,
  onOpenLesson,
}: {
  skills?: SkillId[];
  progress: Record<SkillId, SkillProgress>;
  onOpenLesson: (s: SkillId) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Recommended learning order
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Status pips are a prototype signal from session history on this device
        — not a calibrated mastery claim.
      </p>
      <ol className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 sm:gap-x-2">
        {skills.map((s, i) => {
          const p = progress[s];
          return (
            <li key={s} className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onOpenLesson(s)}
                className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ring-slate-200 hover:bg-slate-50"
                title={`${s} — status: ${SKILL_STATUS_LABELS[p.status]}`}
              >
                <span
                  className={`inline-flex h-2 w-2 flex-none rounded-full ${
                    p.status === 'strong'
                      ? 'bg-emerald-500'
                      : p.status === 'developing'
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                  {s}
                </span>
              </button>
              {i < skills.length - 1 && (
                <span className="text-slate-300">→</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// One row in the Fractions Module grid: a colourful card per skill, with
// item count, prereqs (if any), status pill + accuracy bar, a "Learn" CTA,
// and a quick-start assessment button. Locks (visual hint only — never
// gating) appear when prereqs haven't been started yet.
function SkillCard({
  skillId,
  progress,
  onOpenLesson,
  onStartAssessment,
}: {
  skillId: SkillId;
  progress: SkillProgress;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
}) {
  const itemCount = ITEMS.filter((i) => i.skillId === skillId).length;
  const prereqs = STATIC_PREREQUISITES_BY_SKILL[skillId];
  const lesson = LESSONS[skillId];
  const accPct = Math.round(progress.accuracy * 100);
  return (
    <article className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${skillChipClass(skillId)}`}
            >
              {skillId}
            </span>
            <SkillStatusPill status={progress.status} />
          </div>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
            {SKILL_LABELS[skillId]}
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          {itemCount} item{itemCount === 1 ? '' : 's'}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {lesson.intro}
      </p>
      {progress.status !== 'not_started' && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Accuracy on this device · {progress.attempted} attempt
              {progress.attempted === 1 ? '' : 's'}
            </span>
            <span className="font-semibold text-slate-700">{accPct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                progress.status === 'strong' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.max(4, accPct)}%` }}
            />
          </div>
        </div>
      )}
      {prereqs.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Builds on:</span>
          {prereqs.map((p) => {
            const pCode = p.code;
            const isCurrSkill = (SKILL_IDS_ORDERED as string[]).includes(pCode);
            const remaining = progress.prereqsRemaining as readonly string[];
            const isRemaining = remaining.includes(pCode);
            return (
              <span
                key={pCode}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${
                  isCurrSkill && !isRemaining
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                    : 'bg-slate-100 ring-slate-200'
                }`}
                title={
                  isCurrSkill
                    ? isRemaining
                      ? `${pCode} not started yet`
                      : `${pCode} started`
                    : `${pCode} (outside this module)`
                }
              >
                {isCurrSkill && !isRemaining ? '✓' : isRemaining ? '○' : '·'} {pCode}
              </span>
            );
          })}
        </div>
      )}
      {!progress.unlocked && progress.prereqsRemaining.length > 0 && (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
          Tip: prerequisites not started yet ({progress.prereqsRemaining.join(', ')}). You can still open this skill — it just builds on those.
        </div>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <button
          onClick={() => onOpenLesson(skillId)}
          className="btn-primary text-sm"
        >
          Open Learn
        </button>
        <button
          onClick={() => onStartAssessment(skillId)}
          className="btn-secondary text-sm"
        >
          Start assessment
        </button>
      </div>
    </article>
  );
}

function SkillStatusPill({ status }: { status: SkillStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${SKILL_STATUS_COLOR[status]}`}
    >
      {SKILL_STATUS_LABELS[status]}
    </span>
  );
}

// ===========================================================================
// Learn view: per-skill reteach lesson + visual + practice + notes
// ===========================================================================
function LearnView({
  skill,
  onBack,
  onStartAssessment,
  onOpenLesson,
}: {
  skill: SkillId;
  onBack: () => void;
  onStartAssessment: (mode: SkillMode) => void;
  onOpenLesson: (s: SkillId) => void;
}) {
  const lesson: Lesson = LESSONS[skill];
  const itemById = useMemo(() => new Map(ITEMS.map((it) => [it.id, it])), []);
  const practiceItems = lesson.practice
    .map((id) => itemById.get(id))
    .filter((it): it is Item => Boolean(it));
  const prereqs = STATIC_PREREQUISITES_BY_SKILL[skill];
  const idx = SKILL_IDS_ORDERED.indexOf(skill);
  const prevSkill = idx > 0 ? SKILL_IDS_ORDERED[idx - 1] : null;
  const nextSkill =
    idx >= 0 && idx < SKILL_IDS_ORDERED.length - 1
      ? SKILL_IDS_ORDERED[idx + 1]
      : null;
  const progress = useMemo(
    () => computeSkillProgress(loadSessions(), ITEMS)[skill],
    [skill]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Fractions Module
        </button>
        <div className="flex flex-wrap gap-2 text-xs">
          {prevSkill && (
            <button
              onClick={() => onOpenLesson(prevSkill)}
              className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              ← {prevSkill}
            </button>
          )}
          {nextSkill && (
            <button
              onClick={() => onOpenLesson(nextSkill)}
              className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {nextSkill} →
            </button>
          )}
        </div>
      </div>

      <header className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${skillChipClass(skill)}`}>
            {skill}
          </span>
          <SkillStatusPill status={progress.status} />
          <span className="text-xs text-slate-500">
            Learn · reteach + visual + worked examples + common mistakes + practice
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {SKILL_LABELS[skill]}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {lesson.intro}
        </p>
        {prereqs.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-medium text-slate-700">
              Recommended prerequisites:
            </span>
            {prereqs.map((p) => (
              <button
                key={p.code}
                onClick={() => {
                  if ((SKILL_IDS_ORDERED as string[]).includes(p.code)) {
                    onOpenLesson(p.code as SkillId);
                  }
                }}
                disabled={!(SKILL_IDS_ORDERED as string[]).includes(p.code)}
                className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 ring-1 ring-slate-200 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-slate-100"
              >
                {p.code} — {p.name}
              </button>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => onStartAssessment(skill)}
            className="btn-primary"
          >
            Start a {skill} assessment
          </button>
          <button
            onClick={() => onStartAssessment('mixed')}
            className="btn-secondary"
          >
            Take the Mixed assessment
          </button>
        </div>
      </header>

      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          {lesson.reteach.title}
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-slate-700">
          {lesson.reteach.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Visual explanation
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {lesson.visualExplanation.caption}
        </p>
        <div className="mt-3">
          <Visual visual={lesson.visualExplanation.visual} />
        </div>
        <ol className="mt-4 space-y-2 text-sm text-slate-700">
          {lesson.visualExplanation.readingSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Worked examples
          </h2>
          <span className="text-xs text-slate-500">
            {lesson.workedExamples.length} fully-worked problems
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Each example walks through the steps the student should write down.
        </p>
        <div className="mt-4 space-y-4">
          {lesson.workedExamples.map((ex, i) => (
            <WorkedExampleCard key={i} index={i + 1} example={ex} />
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Common mistakes
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Three error patterns to look out for. Each row names the mistake,
          why it happens, and how to fix it.
        </p>
        <div className="mt-4 space-y-3">
          {lesson.commonMistakes.map((m, i) => (
            <CommonMistakeCard key={i} mistake={m} />
          ))}
        </div>
      </section>

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Practice questions
          </h2>
          <span className="text-xs text-slate-500">
            {practiceItems.length} hand-picked items, easy → hard
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Use these to walk through the skill before opening a full
          assessment. Worked solutions are shown with each item.
        </p>
        <ol className="mt-4 space-y-3">
          {practiceItems.map((it, i) => (
            <PracticeItem key={it.id} index={i + 1} item={it} />
          ))}
        </ol>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <NoteCard
          tone="teacher"
          label="For the teacher"
          body={lesson.teacherNote}
        />
        <NoteCard
          tone="parent"
          label="For the parent / home"
          body={lesson.parentNote}
        />
      </section>

      <p className="text-center text-xs text-slate-500">
        Lesson content is a prototype draft. Review with a CBSE Class 6 math
        teacher before classroom use.
      </p>
    </div>
  );
}

function WorkedExampleCard({
  index,
  example,
}: {
  index: number;
  example: import('./data/lessons').WorkedExample;
}) {
  return (
    <article className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Worked example {index}
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        {example.problem}
      </p>
      <ol className="mt-3 space-y-2 text-sm text-slate-700">
        {example.steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex items-baseline gap-2 text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Answer
        </span>
        <span className="text-base font-bold text-slate-900">
          {example.answer}
        </span>
      </div>
    </article>
  );
}

function CommonMistakeCard({
  mistake,
}: {
  mistake: import('./data/lessons').CommonMistake;
}) {
  return (
    <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">
        {mistake.pattern}
      </div>
      <p className="mt-1 text-sm font-medium text-rose-900">
        Looks like: <span className="font-normal italic">{mistake.example}</span>
      </p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Why students do this
          </dt>
          <dd className="mt-1 text-sm text-slate-700">{mistake.why}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            How to fix it
          </dt>
          <dd className="mt-1 text-sm text-slate-700">{mistake.fix}</dd>
        </div>
      </dl>
    </article>
  );
}

function PracticeItem({ index, item }: { index: number; item: Item }) {
  const [open, setOpen] = useState(false);
  const correctAnswerLabel =
    item.kind === 'mcq'
      ? `${String.fromCharCode(65 + item.correctIndex)} — ${item.options[item.correctIndex].text}`
      : item.acceptedAnswers[0];
  return (
    <li className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Q{index} · {item.id} · diff. {item.difficulty}
          </div>
          <div className="text-sm text-slate-900">{item.stem}</div>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          {open ? 'Hide solution' : 'Show solution'}
        </button>
      </div>
      {item.visual && (
        <div className="mt-3">
          <Visual visual={item.visual} />
        </div>
      )}
      {item.kind === 'mcq' && (
        <ol className="mt-3 grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2">
          {item.options.map((o, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200"
            >
              <span className="font-semibold text-slate-500">
                {String.fromCharCode(65 + i)}.
              </span>
              <span>{o.text}</span>
            </li>
          ))}
        </ol>
      )}
      {item.kind === 'numeric' && (
        <div className="mt-3 text-xs text-slate-500">
          Numeric entry · {item.inputHint}
        </div>
      )}
      {open && (
        <div className="mt-3 rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Correct answer
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            {correctAnswerLabel}
          </div>
          <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Worked solution
          </div>
          <p className="mt-1 text-sm text-slate-700">{item.solution}</p>
        </div>
      )}
    </li>
  );
}

function NoteCard({
  tone,
  label,
  body,
}: {
  tone: 'teacher' | 'parent';
  label: string;
  body: string;
}) {
  const ring =
    tone === 'teacher'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : 'border-violet-200 bg-violet-50 text-violet-900';
  return (
    <div className={`rounded-2xl border p-5 ${ring}`}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </div>
      <p className="mt-2 text-sm">{body}</p>
    </div>
  );
}

// ===========================================================================
// Start form: capture student + window
// ===========================================================================
function StartForm({
  prefill,
  prefillSkillMode,
  onStart,
  onCancel,
}: {
  prefill: Student | null;
  prefillSkillMode: SkillMode | null;
  onStart: (
    student: Student,
    window: AssessmentWindow,
    skillMode: SkillMode
  ) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(prefill?.name ?? '');
  const [grade, setGrade] = useState(prefill?.grade ?? 'Class 6');
  const [school, setSchool] = useState(prefill?.school ?? '');
  const [window, setWindow] = useState<AssessmentWindow>('baseline');
  const [skillMode, setSkillMode] = useState<SkillMode>(
    prefillSkillMode ?? 'mixed'
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prefill) return;
    const prior = getCompletedSessionsForStudent(prefill.id);
    if (prior.length === 0) return;
    const usedWindows = new Set(prior.map((s) => s.window));
    if (!usedWindows.has('baseline')) return setWindow('baseline');
    if (!usedWindows.has('midyear')) return setWindow('midyear');
    if (!usedWindows.has('endyear')) return setWindow('endyear');
    setWindow('practice');
  }, [prefill]);

  const handleStart = () => {
    if (!name.trim()) {
      setError('Please enter a student name.');
      return;
    }
    if (!grade.trim()) {
      setError('Please enter a grade.');
      return;
    }
    setError(null);
    const student = findOrCreateStudent(name, grade, school);
    onStart(student, window, skillMode);
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onCancel}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back
        </button>
      </div>

      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900">
          Who is taking this assessment?
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter the student's details so this attempt can be saved alongside any
          previous attempts. All data stays on this device — there is no server
          in this prototype.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Student name" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Aarav Sharma"
              className="form-input"
              autoFocus
            />
          </Field>
          <Field label="Grade" required>
            <input
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g., Class 6"
              className="form-input"
            />
          </Field>
          <Field label="School (optional)">
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., DPS Indirapuram"
              className="form-input"
            />
          </Field>
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-slate-900">
            Skill to assess
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Pick a single skill, a single module, or the Mixed Class 6 Math
            Assessment that draws across every module.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <SkillChip mode={skillMode} />
            <select
              value={skillMode}
              onChange={(e) => setSkillMode(e.target.value as SkillMode)}
              className="form-input w-full max-w-md"
              aria-label="Skill mode"
            >
              <option value="mixed">{SKILL_MODE_LABELS.mixed}</option>
              {MODULE_IDS_ORDERED.map((m) => (
                <optgroup key={m} label={MODULE_LABELS[m]}>
                  <option value={`mixed_${m}`}>
                    {SKILL_MODE_LABELS[`mixed_${m}` as SkillMode]}
                  </option>
                  {SKILLS_BY_MODULE[m].map((s) => (
                    <option key={s} value={s}>
                      {SKILL_MODE_LABELS[s]}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            {SKILL_MODE_DESCRIPTIONS[skillMode]}
          </p>
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-slate-900">
            Assessment window
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Tag this attempt so the teacher dashboard can compare across the
            year.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ASSESSMENT_WINDOWS.map((w) => (
              <label
                key={w}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition ${
                  window === w
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-slate-200 bg-white hover:border-brand-300'
                }`}
              >
                <input
                  type="radio"
                  name="window"
                  value={w}
                  checked={window === w}
                  onChange={() => setWindow(w)}
                  className="mt-1 h-4 w-4 accent-brand-600"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {ASSESSMENT_WINDOW_LABELS[w]}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-600">
                    {ASSESSMENT_WINDOW_DESCRIPTIONS[w]}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
          The bank has 254 items across 22 skills in 4 modules; each session
          shows 10. With a small bank, you may see similar question types
          across attempts.
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={handleStart} className="btn-primary">
            Start assessment
          </button>
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

// ===========================================================================
// Visual renderer (fraction bars + area grids, inline SVG)
// ===========================================================================
function Visual({ visual }: { visual: VisualSpec }) {
  if (visual.kind === 'bars') {
    return (
      <div className="mt-1 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
        {visual.bars.map((bar, i) => (
          <FractionBarSVG key={i} bar={bar} />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-1 flex flex-wrap items-end gap-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      {visual.grids.map((grid, i) => (
        <AreaGridSVG key={i} grid={grid} />
      ))}
    </div>
  );
}

// All fraction bars share the same outer width so a 1/4 bar and a 1/8 bar
// represent the SAME whole. Only the partition count changes. Using a
// fixed-sized viewBox plus `preserveAspectRatio` keeps every bar visually
// comparable even when several stack vertically in one item.
const BAR_OUTER_WIDTH = 280;
const BAR_OUTER_HEIGHT = 40;

// Likewise for area grids: outer dimensions are fixed, only the row/col
// partition changes.
const GRID_OUTER_SIZE = 168;

function FractionBarSVG({ bar }: { bar: FractionBar }) {
  const fillColor = '#2563eb'; // brand-600
  const strokeColor = '#1e3a8a'; // brand-900
  const cellWidth = BAR_OUTER_WIDTH / bar.denominator;
  const ariaLabel = `Fraction bar for ${bar.label}: a whole bar split into ${bar.denominator} equal parts, with ${bar.numerator} part${bar.numerator === 1 ? '' : 's'} shaded.`;
  return (
    <figure className="flex flex-col gap-1">
      <svg
        width={BAR_OUTER_WIDTH}
        height={BAR_OUTER_HEIGHT}
        viewBox={`0 0 ${BAR_OUTER_WIDTH} ${BAR_OUTER_HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className="block"
      >
        {/* Outer bar outline (the "whole"). Drawn first so partitions sit on top. */}
        <rect
          x={0.5}
          y={0.5}
          width={BAR_OUTER_WIDTH - 1}
          height={BAR_OUTER_HEIGHT - 1}
          fill="#ffffff"
          stroke={strokeColor}
          strokeWidth={1.5}
        />
        {Array.from({ length: bar.denominator }, (_, i) => (
          <rect
            key={i}
            x={i * cellWidth}
            y={0}
            width={cellWidth}
            height={BAR_OUTER_HEIGHT}
            fill={i < bar.numerator ? fillColor : 'transparent'}
            stroke={strokeColor}
            strokeWidth={1}
          />
        ))}
      </svg>
      <figcaption className="text-xs font-medium text-slate-700">
        {bar.label} — {bar.numerator} of {bar.denominator} equal parts shaded
      </figcaption>
    </figure>
  );
}

function AreaGridSVG({ grid }: { grid: AreaGrid }) {
  const fillColor = '#2563eb';
  const strokeColor = '#1e3a8a';
  const cellW = GRID_OUTER_SIZE / grid.cols;
  const cellH = GRID_OUTER_SIZE / grid.rows;
  const totalCells = grid.rows * grid.cols;
  const ariaLabel = `Area model for ${grid.label}: a whole rectangle split into a ${grid.rows} by ${grid.cols} grid (${totalCells} equal cells), with ${grid.shaded} cell${grid.shaded === 1 ? '' : 's'} shaded.`;
  return (
    <figure className="flex flex-col gap-1">
      <svg
        width={GRID_OUTER_SIZE}
        height={GRID_OUTER_SIZE}
        viewBox={`0 0 ${GRID_OUTER_SIZE} ${GRID_OUTER_SIZE}`}
        role="img"
        aria-label={ariaLabel}
        className="block"
      >
        <rect
          x={0.5}
          y={0.5}
          width={GRID_OUTER_SIZE - 1}
          height={GRID_OUTER_SIZE - 1}
          fill="#ffffff"
          stroke={strokeColor}
          strokeWidth={1.5}
        />
        {Array.from({ length: totalCells }, (_, i) => {
          const r = Math.floor(i / grid.cols);
          const c = i % grid.cols;
          return (
            <rect
              key={i}
              x={c * cellW}
              y={r * cellH}
              width={cellW}
              height={cellH}
              fill={i < grid.shaded ? fillColor : 'transparent'}
              stroke={strokeColor}
              strokeWidth={1}
            />
          );
        })}
      </svg>
      <figcaption className="text-xs font-medium text-slate-700">
        {grid.label} — {grid.shaded} of {totalCells} equal cells shaded
      </figcaption>
    </figure>
  );
}

// ===========================================================================
// Assessment
// ===========================================================================
function Assessment({
  item,
  selected,
  onSelect,
  numericInput,
  onNumericChange,
  onSubmit,
  submitting,
  progress,
  total,
  studentName,
  window,
  skillMode,
}: {
  item: Item;
  selected: number | null;
  onSelect: (i: number) => void;
  numericInput: string;
  onNumericChange: (s: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  progress: number;
  total: number;
  studentName: string;
  window: AssessmentWindow;
  skillMode: SkillMode;
}) {
  const pct = Math.min(100, Math.round((progress / total) * 100));

  // Whether the submit button should be enabled.
  const canSubmit =
    !submitting &&
    (item.kind === 'mcq'
      ? selected !== null
      : numericInput.trim().length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">{studentName}</span>
          <span className="text-slate-400">·</span>
          <span>{ASSESSMENT_WINDOW_LABELS[window]} session</span>
          <SkillChip mode={skillMode} />
        </div>
        <div className="text-xs text-slate-500">
          Question {progress} of up to {total}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {item.skillId}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            Difficulty (seed): {item.difficulty}/10
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {item.cognitiveType}
          </span>
          {item.kind === 'numeric' && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              Type your answer
            </span>
          )}
        </div>

        {item.visual && (
          <div className="mt-6">
            <Visual visual={item.visual} />
          </div>
        )}

        <h2 className="mt-6 text-xl font-semibold leading-relaxed text-slate-900 md:text-2xl">
          {item.stem}
        </h2>

        {item.kind === 'mcq' ? (
          <McqOptions
            item={item}
            selected={selected}
            onSelect={onSelect}
            disabled={submitting}
          />
        ) : (
          <NumericEntry
            item={item}
            value={numericInput}
            onChange={onNumericChange}
            onSubmit={onSubmit}
            disabled={submitting}
          />
        )}

        <div className="mt-8 flex items-center justify-end">
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="btn-primary"
          >
            {submitting ? 'Saving…' : 'Submit answer'}
          </button>
        </div>
      </div>
    </div>
  );
}

function McqOptions({
  item,
  selected,
  onSelect,
  disabled,
}: {
  item: MCQItem;
  selected: number | null;
  onSelect: (i: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-7 space-y-3">
      {item.options.map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        const isSelected = selected === i;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={disabled}
            className={`flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition ${
              isSelected
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                isSelected
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {letter}
            </span>
            <span className="text-base text-slate-900">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}

function NumericEntry({
  item,
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  item: NumericItem;
  value: string;
  onChange: (s: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-7">
      <label className="block text-sm font-medium text-slate-700">
        Your answer
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim().length > 0 && !disabled) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={item.inputHint}
        disabled={disabled}
        className="form-input mt-1.5 max-w-sm text-lg disabled:opacity-60"
        inputMode="text"
        autoFocus
      />
      <p className="mt-2 text-xs text-slate-500">{item.inputHint}</p>
    </div>
  );
}

// ===========================================================================
// Results (student-facing)
// ===========================================================================
function Results({
  session,
  onAnotherSession,
  onTeacher,
  onHome,
  onOpenLesson,
  onStartAssessment,
}: {
  session: Session;
  onAnotherSession: () => void;
  onTeacher: () => void;
  onHome: () => void;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
}) {
  const band = computeBand(session.finalAbility);
  const correct = correctCount(session.responses);
  const total = session.responses.length;
  const misconceptions = summarizeMisconceptions(session.responses).slice(0, 3);

  // Growth comparisons should only use prior sessions in the *same* skill
  // mode. A FR.06 session and an FR.07 session aren't comparable on
  // skill-specific axes (accuracy, difficulty, misconception rate).
  const growth = useMemo<GrowthIndicator | null>(() => {
    const all = getCompletedSessionsForStudent(session.studentId);
    const prior = all.filter(
      (s) =>
        s.id !== session.id &&
        s.skillId === session.skillId &&
        (s.completedAt ?? 0) < (session.completedAt ?? 0)
    );
    if (prior.length === 0) return null;
    const mostRecentPrior = prior.reduce((a, b) =>
      (a.completedAt ?? 0) > (b.completedAt ?? 0) ? a : b
    );
    return growthIndicator(mostRecentPrior, session);
  }, [session]);

  const summary = summarizeSession(session);
  const conf = sessionConfidence(summary);

  const skillBreakdowns = useMemo(
    () => summarizeBySkill(session.responses, ITEMS),
    [session]
  );
  const showsMixedBreakdown =
    session.skillId === 'mixed' && isMixedSession(session.responses, ITEMS);

  // "Next Step for You" — runs on the just-completed session and on the
  // device-wide progression so we can suggest the right place to go next.
  const nextStep = useMemo<NextStepSuggestion>(() => {
    const allSessions = loadSessions();
    const progress = computeSkillProgress(allSessions, ITEMS);
    return suggestNextStep(session, ITEMS, progress);
  }, [session]);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Assessment complete
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {session.studentSnapshot.name}'s prototype estimate
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span>
            {ASSESSMENT_WINDOW_LABELS[session.window]} session ·{' '}
            {session.studentSnapshot.grade}
            {session.studentSnapshot.school
              ? ` · ${session.studentSnapshot.school}`
              : ''}
          </span>
          <SkillChip mode={session.skillId} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat
            label="Performance band"
            value={band}
            valueClass={`${bandColor(band)} ring-1`}
          />
          <Stat label="Correct answers" value={`${correct} / ${total}`} />
          <Stat
            label="Prototype ability estimate"
            value={`${session.finalAbility.toFixed(1)} / 10`}
          />
        </div>

        <p className="mt-5 text-sm text-slate-600">
          {bandDescription(band, session.skillId)}
        </p>

        {conf.confidence === 'low' && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200">
            <span className="font-semibold">Low-confidence estimate.</span>{' '}
            {conf.reasons.join(' ')}
          </div>
        )}
      </div>

      <NextStepCard
        suggestion={nextStep}
        onOpenLesson={onOpenLesson}
        onStartAssessment={onStartAssessment}
      />

      <SessionFeedbackCard sessionId={session.id} />

      {growth && <GrowthCard growth={growth} session={session} />}

      {showsMixedBreakdown && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Per-skill accuracy
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            This was a mixed session, so accuracy is split by skill bank
            below. Only skills with at least one item attempted are shown.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {skillBreakdowns
              .filter((b) => b.attempted > 0)
              .map((b) => (
                <SkillBreakdownCard key={b.skillId} breakdown={b} />
              ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Skills demonstrated
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Based on items answered on {SKILL_MODE_LABELS[session.skillId]}.
        </p>
        <BandAccuracyTable session={session} />
      </div>

      {misconceptions.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Likely misconception patterns
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            These are the patterns most consistent with the wrong answers
            chosen. Teacher review required before acting on any of them.
          </p>
          <ul className="mt-4 space-y-2">
            {misconceptions.map((m) => (
              <li
                key={m.code}
                className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {m.label}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    Seen on {m.count} item{m.count > 1 ? 's' : ''}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">Important disclaimer</div>
        <p className="mt-1">
          This is a prototype estimate based on seed difficulty values, not a
          calibrated score. Real reporting requires student response data and
          an IRT model fit, plus teacher review of every item. Do not use these
          bands to make placement, promotion, or remediation decisions.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onTeacher} className="btn-primary">
          Teacher view for {session.studentSnapshot.name}
        </button>
        <button onClick={onAnotherSession} className="btn-secondary">
          Another session for {session.studentSnapshot.name}
        </button>
        <button onClick={onHome} className="btn-secondary">
          Home
        </button>
      </div>
    </div>
  );
}

function GrowthCard({
  growth,
  session,
}: {
  growth: GrowthIndicator;
  session: Session;
}) {
  const arrow =
    growth.direction === 'up' ? '↑' : growth.direction === 'down' ? '↓' : '→';
  const tone =
    growth.direction === 'up'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : growth.direction === 'down'
        ? 'bg-rose-50 text-rose-700 ring-rose-200'
        : 'bg-slate-50 text-slate-700 ring-slate-200';
  const accPct = Math.round(growth.accuracyDelta * 100);
  const misPct = Math.round(growth.misconceptionDelta * 100);
  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-900">
          Prototype change indicator
        </h2>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
          Early signal · not calibrated growth
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
            growth.confidence === 'low'
              ? 'bg-rose-50 text-rose-700 ring-rose-200'
              : 'bg-slate-50 text-slate-700 ring-slate-200'
          }`}
        >
          Confidence: {growth.confidence}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Comparing this {ASSESSMENT_WINDOW_LABELS[session.window].toLowerCase()}{' '}
        session against {session.studentSnapshot.name}'s most recent prior
        session on the same skill.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <DeltaCell
          label="Accuracy change"
          prior={`${Math.round(growth.prevSummary.accuracy * 100)}%`}
          current={`${Math.round(growth.currentSummary.accuracy * 100)}%`}
          deltaText={`${accPct >= 0 ? '+' : '−'}${Math.abs(accPct)} pts`}
          deltaPositive={accPct > 0}
          deltaNegative={accPct < 0}
        />
        <DeltaCell
          label="Misconception change"
          prior={`${Math.round(growth.prevSummary.misconceptionRate * 100)}%`}
          current={`${Math.round(growth.currentSummary.misconceptionRate * 100)}%`}
          deltaText={`${misPct >= 0 ? '+' : '−'}${Math.abs(misPct)} pts`}
          deltaPositive={misPct < 0}
          deltaNegative={misPct > 0}
        />
        <CompositeCell
          arrow={arrow}
          tone={tone}
          direction={growth.direction}
          composite={growth.composite}
        />
      </div>

      <p className={`mt-4 rounded-xl p-3 text-sm ring-1 ${tone}`}>
        {growth.summary}
      </p>

      {growth.confidence === 'low' && growth.confidenceReasons.length > 0 && (
        <ul className="mt-3 list-inside list-disc text-xs text-slate-600">
          {growth.confidenceReasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Headline figures are accuracy change and misconception change between
        the two sessions (compared only against prior attempts on the{' '}
        <span className="font-medium">same skill mode</span>). The "prototype
        change indicator" combines both with the average difficulty attempted
        into a single hedged direction. None of these are a calibrated growth
        measurement — they are an early signal on a small item bank, useful
        for a teacher conversation, not for placement or reporting.
      </p>
    </div>
  );
}

function CompositeCell({
  arrow,
  tone,
  direction,
  composite,
}: {
  arrow: string;
  tone: string;
  direction: 'up' | 'down' | 'flat';
  composite: number;
}) {
  const directionLabel =
    direction === 'up'
      ? 'Early signal: improving'
      : direction === 'down'
        ? 'Early signal: regressing'
        : 'Roughly flat';
  return (
    <div className={`flex flex-col rounded-xl p-4 ring-1 ${tone}`}>
      <div className="text-xs font-medium uppercase tracking-wide opacity-80">
        Prototype change indicator
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold">{arrow}</span>
        <span className="text-sm font-semibold">{directionLabel}</span>
      </div>
      <div className="mt-1 text-xs opacity-80">
        composite {composite >= 0 ? '+' : '−'}
        {Math.abs(composite).toFixed(2)} (−1…+1)
      </div>
    </div>
  );
}

function DeltaCell({
  label,
  prior,
  current,
  deltaText,
  deltaPositive,
  deltaNegative,
}: {
  label: string;
  prior: string;
  current: string;
  deltaText: string;
  deltaPositive?: boolean;
  deltaNegative?: boolean;
}) {
  const tone = deltaPositive
    ? 'text-emerald-700'
    : deltaNegative
      ? 'text-rose-700'
      : 'text-slate-600';
  return (
    <div className="flex-1 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2 text-slate-900">
        <span className="text-base font-semibold text-slate-500">{prior}</span>
        <span className="text-slate-400">→</span>
        <span className="text-xl font-bold">{current}</span>
      </div>
      <div className={`mt-1 text-xs font-semibold ${tone}`}>{deltaText}</div>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div
        className={`mt-1 inline-block rounded-lg px-2 py-0.5 text-xl font-bold ${
          valueClass ?? 'text-slate-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

// Small inline skill-mode chip used on session rows and result headers.
function SkillChip({ mode }: { mode: SkillMode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${skillChipClass(mode)}`}
      title={SKILL_MODE_DESCRIPTIONS[mode]}
    >
      {SKILL_MODE_LABELS[mode]}
    </span>
  );
}

// "Next Step for You" card surfaced right after the headline on Results.
// Built on the suggestNextStep heuristic: weakest skill in this session if
// any, else the next non-strong skill in curriculum order, else a mastery
// message.
function NextStepCard({
  suggestion,
  onOpenLesson,
  onStartAssessment,
}: {
  suggestion: NextStepSuggestion;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
}) {
  const tone =
    suggestion.kind === 'practice_skill'
      ? 'from-amber-50 to-rose-50 ring-amber-200'
      : suggestion.kind === 'next_skill'
        ? 'from-brand-50 to-violet-50 ring-brand-200'
        : 'from-emerald-50 to-teal-50 ring-emerald-200';
  return (
    <section
      className={`rounded-3xl bg-gradient-to-br p-5 ring-1 sm:p-6 ${tone}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Next step for you
        </span>
        <SkillChip mode={suggestion.skillId} />
      </div>
      <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
        {suggestion.headline}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-700">
        {suggestion.detail}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onOpenLesson(suggestion.skillId)}
          className="btn-primary"
        >
          Open the {suggestion.skillId} lesson
        </button>
        <button
          onClick={() => onOpenLesson(suggestion.skillId)}
          className="btn-secondary"
        >
          See {suggestion.skillId} practice questions
        </button>
        <button
          onClick={() => onStartAssessment(suggestion.skillId)}
          className="btn-secondary"
        >
          {suggestion.kind === 'practice_skill'
            ? `Retake ${suggestion.skillId} only`
            : `Take a ${suggestion.skillId} assessment`}
        </button>
      </div>
      {suggestion.perSkillSummary.length > 1 && (
        <div className="mt-4 rounded-xl bg-white/70 p-3 ring-1 ring-slate-200">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            What you did this session
          </div>
          <ul className="mt-2 grid gap-1 text-xs text-slate-700 sm:grid-cols-2">
            {suggestion.perSkillSummary.map((row) => (
              <li
                key={row.skillId}
                className="flex items-center justify-between rounded-md bg-white px-2 py-1 ring-1 ring-slate-100"
              >
                <span className="font-medium">{row.skillId}</span>
                <span className="text-slate-500">
                  {Math.round(row.accuracy * 100)}% · {row.attempted} item
                  {row.attempted === 1 ? '' : 's'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// Per-skill summary card for mixed sessions, showing accuracy plus the
// most-frequent misconceptions on that skill.
// ===========================================================================
// Session feedback (v0.8): student-facing strip on Results
// ===========================================================================
function SessionFeedbackCard({ sessionId }: { sessionId: string }) {
  const [existing, setExisting] = useState<SessionFeedback | null>(() =>
    getSessionFeedback(sessionId)
  );
  const [difficulty, setDifficulty] = useState<SessionFeedbackDifficulty | null>(
    existing?.difficulty ?? null
  );
  const [picturesHelped, setPicturesHelped] = useState<PicturesHelped | null>(
    existing?.picturesHelped ?? null
  );
  const [confusing, setConfusing] = useState(existing?.confusingQuestions ?? '');
  const [hardest, setHardest] = useState(existing?.hardestPart ?? '');

  const submit = () => {
    if (!difficulty || !picturesHelped) return;
    const fb: SessionFeedback = {
      sessionId,
      difficulty,
      picturesHelped,
      confusingQuestions: confusing,
      hardestPart: hardest,
      submittedAt: Date.now(),
    };
    saveSessionFeedback(fb);
    setExisting(fb);
  };

  if (existing && existing.submittedAt > 0 && difficulty === existing.difficulty) {
    return (
      <section className="rounded-2xl bg-white p-5 ring-1 ring-emerald-200 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Feedback saved · thank you
          </span>
        </div>
        <div className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Difficulty
            </span>
            <div className="mt-0.5 font-semibold">{existing.difficulty}</div>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Pictures helped
            </span>
            <div className="mt-0.5 font-semibold">{existing.picturesHelped}</div>
          </div>
          {existing.confusingQuestions && (
            <div className="sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Confusing questions
              </span>
              <p className="mt-0.5">{existing.confusingQuestions}</p>
            </div>
          )}
          {existing.hardestPart && (
            <div className="sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Hardest part
              </span>
              <p className="mt-0.5">{existing.hardestPart}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setExisting(null)}
          className="mt-3 text-xs font-semibold text-brand-700 hover:underline"
        >
          Edit feedback
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Feedback (optional)
      </div>
      <h2 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
        Tell us how the assessment went.
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Your answers stay on this device and help the teacher review the items.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <div className="text-sm font-medium text-slate-700">
            Was the assessment easy, okay, or hard?
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {(['easy', 'okay', 'hard'] as SessionFeedbackDifficulty[]).map(
              (d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${
                    difficulty === d
                      ? 'bg-brand-50 text-brand-700 ring-brand-200'
                      : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-slate-700">
            Did the pictures help?
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {(
              [
                { v: 'yes', l: 'Yes' },
                { v: 'mixed', l: 'Mixed' },
                { v: 'no', l: 'No' },
                { v: 'na', l: 'No pictures' },
              ] as { v: PicturesHelped; l: string }[]
            ).map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setPicturesHelped(v)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  picturesHelped === v
                    ? 'bg-brand-50 text-brand-700 ring-brand-200'
                    : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <Field label="Were any questions confusing? (optional)">
          <textarea
            value={confusing}
            onChange={(e) => setConfusing(e.target.value)}
            placeholder="e.g., the wording in question 3 was tricky"
            className="form-input min-h-[60px]"
          />
        </Field>

        <Field label="What was the hardest part? (optional)">
          <textarea
            value={hardest}
            onChange={(e) => setHardest(e.target.value)}
            placeholder="e.g., subtracting mixed numbers when borrowing was needed"
            className="form-input min-h-[60px]"
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={submit}
          disabled={!difficulty || !picturesHelped}
          className="btn-primary"
        >
          Save feedback
        </button>
      </div>
    </section>
  );
}

function SkillBreakdownCard({ breakdown }: { breakdown: SkillBreakdown }) {
  const accPct = Math.round(breakdown.accuracy * 100);
  const top = breakdown.misconceptions.slice(0, 2);
  return (
    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-2">
        <SkillChip mode={breakdown.skillId} />
        <div className="text-xs text-slate-500">
          {breakdown.attempted} item{breakdown.attempted === 1 ? '' : 's'}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-3xl font-bold text-slate-900">{accPct}%</div>
        <div className="text-sm text-slate-600">
          ({breakdown.correct}/{breakdown.attempted} correct)
        </div>
      </div>
      <div className="mt-1 text-xs text-slate-500">
        avg time {breakdown.avgTimeSec}s/item
      </div>
      {top.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Top misconception{top.length > 1 ? 's' : ''}
          </div>
          <ul className="mt-1 space-y-1 text-xs text-slate-700">
            {top.map((m) => (
              <li key={m.code} className="flex items-start gap-2">
                <span className="font-medium">{m.label}</span>
                <span className="text-slate-500">
                  ({m.count}×)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function BandAccuracyTable({ session }: { session: Session }) {
  const rows = bandAccuracy(session.responses, ITEMS);
  return (
    <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2">Band</th>
            <th className="px-4 py-2">Items attempted</th>
            <th className="px-4 py-2">Correct</th>
            <th className="px-4 py-2">Accuracy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((r) => (
            <tr key={r.band}>
              <td className="px-4 py-3 font-medium capitalize text-slate-900">
                {r.band}
              </td>
              <td className="px-4 py-3 text-slate-700">{r.attempted}</td>
              <td className="px-4 py-3 text-slate-700">{r.correct}</td>
              <td className="px-4 py-3 text-slate-700">
                {r.attempted === 0
                  ? '—'
                  : `${Math.round((r.correct / r.attempted) * 100)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===========================================================================
// Teacher: list of students with filters + export
// ===========================================================================
function TeacherStudentList({
  onOpenStudent,
  onStart,
  onOpenClassDashboard,
}: {
  onOpenStudent: (studentId: string) => void;
  onStart: () => void;
  onOpenClassDashboard: () => void;
}) {
  const [query, setQuery] = useState('');
  const [windowFilter, setWindowFilter] = useState<'all' | AssessmentWindow>(
    'all'
  );

  const students = loadStudents();
  const sessions = loadSessions();

  const rows = useMemo(() => {
    return students
      .map((student) => {
        const studentSessions = sessions
          .filter((s) => s.studentId === student.id && s.completedAt !== null)
          .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
        const filtered =
          windowFilter === 'all'
            ? studentSessions
            : studentSessions.filter((s) => s.window === windowFilter);
        const latest = filtered[0] ?? null;
        return {
          student,
          totalSessions: studentSessions.length,
          filteredSessions: filtered,
          latest,
        };
      })
      .filter((row) => {
        if (windowFilter !== 'all' && row.filteredSessions.length === 0) {
          return false;
        }
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          row.student.name.toLowerCase().includes(q) ||
          (row.student.school || '').toLowerCase().includes(q) ||
          row.student.grade.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const at = a.latest?.completedAt ?? 0;
        const bt = b.latest?.completedAt ?? 0;
        return bt - at;
      });
  }, [students, sessions, query, windowFilter]);

  const handleExport = () => {
    // Snapshot the current teaching plan + item quality flags so the
    // exported JSON matches what's on screen right now.
    const currentSessions = loadSessions();
    const reviews = loadItemReviews();
    const teachingPlanSummary = buildTeachingPlan(
      students,
      currentSessions,
      ITEMS
    );
    const itemQualityFlags = buildItemQualitySummary(
      currentSessions,
      reviews,
      ITEMS
    );
    const json = exportAllAsJSON({ teachingPlanSummary, itemQualityFlags });
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `pragati-export-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (students.length === 0) {
    return <EmptyDashboard onStart={onStart} />;
  }

  const bundle = buildExportBundle();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Teacher dashboard
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Students
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            One row per student. Tap a row to open their growth history,
            item-by-item responses, and recommended next steps.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onOpenClassDashboard} className="btn-secondary">
            Class dashboard
          </button>
          <button onClick={handleExport} className="btn-secondary">
            Export JSON
          </button>
          <button onClick={onStart} className="btn-primary">
            New session
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, school, or grade"
              className="form-input w-64"
            />
          </Field>
          <Field label="Filter by window">
            <select
              value={windowFilter}
              onChange={(e) =>
                setWindowFilter(e.target.value as 'all' | AssessmentWindow)
              }
              className="form-input w-44"
            >
              <option value="all">All windows</option>
              {ASSESSMENT_WINDOWS.map((w) => (
                <option key={w} value={w}>
                  {ASSESSMENT_WINDOW_LABELS[w]}
                </option>
              ))}
            </select>
          </Field>
          <div className="ml-auto text-xs text-slate-500">
            Showing {rows.length} of {students.length} students ·{' '}
            {bundle.sessions.length} session
            {bundle.sessions.length === 1 ? '' : 's'} total
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">School / Grade</th>
                <th className="px-3 py-2">Sessions</th>
                <th className="px-3 py-2">Latest window</th>
                <th className="px-3 py-2">Latest skill</th>
                <th className="px-3 py-2">Latest band</th>
                <th className="px-3 py-2">Latest est.</th>
                <th className="px-3 py-2">Last attempted</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ student, totalSessions, latest }) => {
                const band = latest ? computeBand(latest.finalAbility) : null;
                return (
                  <tr
                    key={student.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => onOpenStudent(student.id)}
                  >
                    <td className="px-3 py-3 font-medium text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {student.school ? (
                        <span>
                          {student.school}
                          <span className="ml-1 text-slate-400">
                            · {student.grade}
                          </span>
                        </span>
                      ) : (
                        student.grade
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {totalSessions}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {latest ? ASSESSMENT_WINDOW_LABELS[latest.window] : '—'}
                    </td>
                    <td className="px-3 py-3">
                      {latest ? <SkillChip mode={latest.skillId} /> : '—'}
                    </td>
                    <td className="px-3 py-3">
                      {band ? <BandPill band={band} /> : '—'}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {latest ? `${latest.finalAbility.toFixed(1)} / 10` : '—'}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {latest?.completedAt
                        ? formatDate(latest.completedAt)
                        : '—'}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-brand-700">Open →</span>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-8 text-center text-sm text-slate-500"
                  >
                    No students match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-500">
        <div className="font-semibold text-slate-700">
          Storage note (read before sharing this device)
        </div>
        <p className="mt-1">
          All student names, sessions, and responses are stored in this
          browser's localStorage only. There is no backend in this prototype.
          Clearing the browser will erase the data. Export to JSON to back up
          before that happens; that file is also the format a future
          calibration pipeline would consume.
        </p>
      </div>
    </div>
  );
}

function BandPill({ band }: { band: Band }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${bandColor(band)}`}
    >
      {band}
    </span>
  );
}

// ===========================================================================
// Class-level dashboard
// ===========================================================================
function ClassDashboard({
  onBack,
  onOpenStudent,
}: {
  onBack: () => void;
  onOpenStudent: (studentId: string) => void;
}) {
  const [filterValue, setFilterValue] = useState<string>('all');
  const skillFilter = useMemo(() => filterFromValue(filterValue), [filterValue]);

  const aggregate = useMemo<ClassAggregate>(() => {
    return buildClassAggregate(
      loadStudents(),
      loadSessions(),
      ITEMS,
      skillFilter
    );
  }, [skillFilter]);

  const hasData = aggregate.totalResponses > 0;

  // Friendly description of the active filter for the header / empty state.
  const filterLabel =
    skillFilter.kind === 'all'
      ? 'all Class 6 Math modules'
      : skillFilter.kind === 'module'
        ? `${MODULE_LABELS[skillFilter.moduleId]} module`
        : `${skillFilter.skillId} — ${SKILL_LABELS[skillFilter.skillId]}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <button
            onClick={onBack}
            className="text-sm text-brand-700 hover:underline"
          >
            ← Back to students
          </button>
          <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Teacher dashboard · class roll-up
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Class dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Aggregates across every completed session on this device. Useful
            for spotting which misconceptions and which items are tripping the
            class as a whole — not a substitute for the per-student view.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Field label="Filter by skill or module">
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="form-input w-72"
            >
              <option value="all">All Class 6 Math (every module)</option>
              {MODULE_IDS_ORDERED.map((m) => (
                <optgroup key={m} label={MODULE_LABELS[m]}>
                  <option value={`module:${m}`}>
                    All {MODULE_LABELS[m]}
                  </option>
                  {SKILLS_BY_MODULE[m].map((s) => (
                    <option key={s} value={s}>
                      {s} — {SKILL_LABELS[s]}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
          {skillFilter.kind !== 'all' && (
            <p className="text-xs text-slate-500">
              Showing responses for <span className="font-medium">{filterLabel}</span>. Mixed sessions are included but filtered.
            </p>
          )}
        </div>
      </div>

      <ClassHeadlineTiles aggregate={aggregate} />

      {!hasData && (
        <div className="card text-center">
          <p className="text-sm text-slate-600">
            {skillFilter.kind === 'all'
              ? 'No completed sessions yet. Once a student finishes an attempt, their responses will appear in the roll-up.'
              : `No responses yet for ${filterLabel}. Switch the filter or run an assessment on this skill / module.`}
          </p>
        </div>
      )}

      {hasData && (
        <>
          <ClassMisconceptionDistribution
            rows={aggregate.misconceptionRows}
            onOpenStudent={onOpenStudent}
          />
          <ClassHardestItems items={aggregate.hardestItems} />
        </>
      )}

      <p className="text-xs text-slate-500">
        All figures here are descriptive statistics over response-level data
        on a 44-item bank across two skills. Sample sizes can be very small in
        a pilot — read the attempt counts before drawing conclusions.
      </p>
    </div>
  );
}

function ClassHeadlineTiles({ aggregate }: { aggregate: ClassAggregate }) {
  const accuracyPct = Math.round(aggregate.averageAccuracy * 100);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <HeadlineTile
        label="Total students"
        value={String(aggregate.totalStudents)}
        sub={`${aggregate.studentsWithSessions} with at least one completed session`}
      />
      <HeadlineTile
        label="Completed sessions"
        value={String(aggregate.totalSessions)}
        sub={`${aggregate.totalResponses} item responses recorded`}
      />
      <HeadlineTile
        label="Average accuracy"
        value={`${accuracyPct}%`}
        sub="Unweighted across every response"
      />
      <HeadlineTile
        label="Avg. time per item"
        value={`${aggregate.averageTimeSecPerItem}s`}
        sub="From first prompt to submit"
      />
    </div>
  );
}

function HeadlineTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function ClassMisconceptionDistribution({
  rows,
  onOpenStudent,
}: {
  rows: ClassMisconceptionRow[];
  onOpenStudent: (studentId: string) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Misconception distribution
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          No misconception-tagged wrong answers yet. Either every wrong
          answer was a generic slip, or no incorrect responses have been
          recorded.
        </p>
      </div>
    );
  }
  const maxOcc = rows[0].occurrences || 1;
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-900">
        Misconception distribution
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Sorted by total response-level hits. Click a student name to open
        their detail page.
      </p>
      <div className="mt-4 space-y-4">
        {rows.map((row) => {
          const widthPct = Math.max(6, Math.round((row.occurrences / maxOcc) * 100));
          return (
            <div
              key={row.code}
              className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">
                  {row.label}
                </div>
                <div className="text-xs text-slate-600">
                  {row.occurrences} occurrence
                  {row.occurrences === 1 ? '' : 's'} ·{' '}
                  {row.studentCount} student
                  {row.studentCount === 1 ? '' : 's'}
                </div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-rose-400"
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {row.students.map((s) => (
                  <button
                    key={s.studentId}
                    onClick={() => onOpenStudent(s.studentId)}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100"
                    title={`${s.count} hit${s.count === 1 ? '' : 's'}`}
                  >
                    {s.name} · {s.count}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClassHardestItems({ items }: { items: ClassHardestItem[] }) {
  // Show the bottom-10 by accuracy to keep the table readable.
  const top = items.slice(0, 10);
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-900">
        Most difficult items (lowest accuracy across the class)
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Sorted by class-wide accuracy ascending. Tie-break is attempt count
        (more-attempted items rank higher when accuracy ties), so an item
        that 6 students missed sits above an item that 1 student missed.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="py-2 pr-3">Item</th>
              <th className="py-2 pr-3">Band</th>
              <th className="py-2 pr-3">Seed diff.</th>
              <th className="py-2 pr-3">Attempts</th>
              <th className="py-2 pr-3">Correct</th>
              <th className="py-2 pr-3">Accuracy</th>
              <th className="py-2">Avg. time</th>
            </tr>
          </thead>
          <tbody>
            {top.map((it) => (
              <tr
                key={it.itemId}
                className="border-t border-slate-100 align-top"
              >
                <td className="py-2 pr-3">
                  <div className="font-medium text-slate-900">{it.itemId}</div>
                  <div className="text-xs text-slate-600">{it.stem}</div>
                </td>
                <td className="py-2 pr-3 text-slate-700">{it.band}</td>
                <td className="py-2 pr-3 text-slate-700">{it.difficulty}</td>
                <td className="py-2 pr-3 text-slate-700">{it.attempts}</td>
                <td className="py-2 pr-3 text-slate-700">{it.correct}</td>
                <td className="py-2 pr-3 text-slate-700">
                  {Math.round(it.accuracy * 100)}%
                </td>
                <td className="py-2 text-slate-700">{it.avgTimeSec}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyDashboard({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-brand-50 via-white to-slate-50 p-8 text-center ring-1 ring-slate-200 sm:p-12">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
        ✦
      </div>
      <h1 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">
        No students yet
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        Take the first assessment to register a student. Their result and any
        future sessions will appear here in the teacher dashboard.
      </p>
      <button onClick={onStart} className="btn-primary mt-5">
        Start assessment
      </button>
    </div>
  );
}

// ===========================================================================
// Student detail: growth history + latest session deep dive
// ===========================================================================
function StudentDetail({
  studentId,
  onBack,
  onNewSession,
  onDeleted,
}: {
  studentId: string;
  onBack: () => void;
  onNewSession: (student: Student) => void;
  onDeleted: () => void;
}) {
  const student = loadStudents().find((s) => s.id === studentId);
  const sessions = student ? getCompletedSessionsForStudent(student.id) : [];
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!student) {
    return (
      <div className="card text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Student not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          That record may have been cleared from this browser.
        </p>
        <button onClick={onBack} className="btn-secondary mt-4">
          Back to students
        </button>
      </div>
    );
  }

  const latest = sessions[sessions.length - 1] ?? null;
  // Pair the latest session with the most-recent earlier session in the
  // same skill mode. Comparing across skills is misleading on a per-skill
  // accuracy axis.
  const prevSameSkill = latest
    ? [...sessions]
        .reverse()
        .find(
          (s) => s.id !== latest.id && s.skillId === latest.skillId
        ) ?? null
    : null;
  const growth =
    latest && prevSameSkill ? growthIndicator(prevSameSkill, latest) : null;

  const handleDelete = () => {
    deleteStudent(student.id);
    onDeleted();
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← All students
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Student profile
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {student.name}
            </h1>
            <div className="mt-1 text-sm text-slate-600">
              {student.school ? `${student.school} · ` : ''}
              {student.grade} · {sessions.length} completed session
              {sessions.length === 1 ? '' : 's'}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNewSession(student)}
              className="btn-primary"
            >
              Start a new session
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-50"
            >
              Delete student
            </button>
          </div>
        </div>
      </div>

      {confirmingDelete && (
        <DeleteConfirm
          studentName={student.name}
          sessionCount={sessions.length}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      )}

      {sessions.length === 0 && (
        <div className="card text-center text-sm text-slate-600">
          No completed sessions yet for this student.
        </div>
      )}

      {sessions.length > 0 && (
        <GrowthHistory sessions={sessions} growthForLatest={growth} />
      )}

      {latest && <LatestSessionPanel session={latest} />}
    </div>
  );
}

function DeleteConfirm({
  studentName,
  sessionCount,
  onCancel,
  onConfirm,
}: {
  studentName: string;
  sessionCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 ring-1 ring-rose-200">
      <div className="text-sm font-semibold text-rose-900">
        Delete {studentName} and all of their {sessionCount} session
        {sessionCount === 1 ? '' : 's'}?
      </div>
      <p className="mt-1 text-sm text-rose-800">
        This cannot be undone. Their record and every response they have
        submitted will be removed from this device. Consider exporting the
        data first if you might need it.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={onConfirm}
          className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
        >
          Yes, delete {studentName}
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

function GrowthHistory({
  sessions,
  growthForLatest,
}: {
  sessions: Session[];
  growthForLatest: GrowthIndicator | null;
}) {
  const rows = [...sessions].reverse();
  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-900">
          Growth history
        </h2>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
          Prototype · not calibrated
        </span>
        {growthForLatest && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
              growthForLatest.confidence === 'low'
                ? 'bg-rose-50 text-rose-700 ring-rose-200'
                : 'bg-slate-50 text-slate-700 ring-slate-200'
            }`}
          >
            Latest comparison: {growthForLatest.confidence} confidence
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-600">
        One row per completed session. The "change vs. previous" column is an
        early signal on the 1–10 seed scale, not a validated growth metric;
        deltas are only computed against earlier sessions on the{' '}
        <span className="font-medium">same skill mode</span>. Practice
        sessions are included for completeness.
      </p>

      {growthForLatest && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
          {growthForLatest.summary}
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Window</th>
              <th className="px-3 py-2">Skill</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2">Correct</th>
              <th className="px-3 py-2">Avg. diff. attempted</th>
              <th className="px-3 py-2">Misconception rate</th>
              <th className="px-3 py-2">Band</th>
              <th className="px-3 py-2">Estimate</th>
              <th className="px-3 py-2">Δ vs. previous (same skill)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((s, idx) => {
              const summary: SessionSummary = summarizeSession(s);
              const band = computeBand(s.finalAbility);
              // Find previous session in the same skill mode (if any).
              const previous = rows
                .slice(idx + 1)
                .find((r) => r.skillId === s.skillId) ?? null;
              const delta = previous
                ? s.finalAbility - previous.finalAbility
                : null;
              return (
                <tr key={s.id}>
                  <td className="px-3 py-3 text-slate-700">
                    {formatDate(s.completedAt ?? s.startedAt)}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {ASSESSMENT_WINDOW_LABELS[s.window]}
                  </td>
                  <td className="px-3 py-3">
                    <SkillChip mode={s.skillId} />
                  </td>
                  <td className="px-3 py-3 text-slate-700">{summary.total}</td>
                  <td className="px-3 py-3 text-slate-700">
                    {summary.correct}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {summary.avgDifficulty.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {Math.round(summary.misconceptionRate * 100)}%
                  </td>
                  <td className="px-3 py-3">
                    <BandPill band={band} />
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {s.finalAbility.toFixed(1)} / 10
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {delta === null ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span
                        className={
                          Math.abs(delta) < 0.5
                            ? 'text-slate-700'
                            : delta > 0
                              ? 'text-emerald-700'
                              : 'text-rose-700'
                        }
                      >
                        {delta >= 0 ? '+' : '−'}
                        {Math.abs(delta).toFixed(1)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LatestSessionPanel({ session }: { session: Session }) {
  const itemById = useMemo(() => new Map(ITEMS.map((it) => [it.id, it])), []);
  const band = computeBand(session.finalAbility);
  const correct = correctCount(session.responses);
  const total = session.responses.length;
  const avgTime = averageTimeSec(session.responses);
  const misconceptions = summarizeMisconceptions(session.responses);
  const prereqs = recommendPrerequisites(session.responses);
  const skillBreakdowns = useMemo(
    () => summarizeBySkill(session.responses, ITEMS),
    [session]
  );
  const showsMixedBreakdown =
    session.skillId === 'mixed' && isMixedSession(session.responses, ITEMS);

  return (
    <>
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Most recent session
            </h2>
            <SkillChip mode={session.skillId} />
          </div>
          <span className="text-xs text-slate-500">
            {ASSESSMENT_WINDOW_LABELS[session.window]} ·{' '}
            {formatDate(session.completedAt ?? session.startedAt)}
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Stat
            label="Band"
            value={band}
            valueClass={`${bandColor(band)} ring-1`}
          />
          <Stat label="Items attempted" value={String(total)} />
          <Stat label="Correct" value={`${correct} / ${total}`} />
          <Stat label="Avg. time / item" value={`${avgTime}s`} />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          {bandDescription(band, session.skillId)}
        </p>
      </div>

      {showsMixedBreakdown && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Per-skill accuracy (mixed session)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            FR.06 and FR.07 items appeared together in this session; the
            breakdown below is split by skill so the teacher can see whether
            one skill is pulling the other up or down.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {skillBreakdowns
              .filter((b) => b.attempted > 0)
              .map((b) => (
                <SkillBreakdownCard key={b.skillId} breakdown={b} />
              ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Item-by-item responses
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Every distractor is tagged with the misconception it represents. Use
          this as a starting point and adapt to what you already know about the
          student.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Diff.</th>
                <th className="px-3 py-2">Answered</th>
                <th className="px-3 py-2">Correct?</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Error / signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {session.responses.map((r) => {
                const it = itemById.get(r.itemId);
                const answered =
                  r.chosenIndex >= 0
                    ? `${String.fromCharCode(65 + r.chosenIndex)}`
                    : `"${r.chosenText ?? ''}"`;
                const correctAnswer =
                  it && it.kind === 'mcq'
                    ? `correct: ${String.fromCharCode(65 + it.correctIndex)}`
                    : it && it.kind === 'numeric'
                      ? `correct: ${it.acceptedAnswers[0]}`
                      : '';
                return (
                  <tr key={r.itemId} className="align-top">
                    <td className="px-3 py-3 font-medium text-slate-900">
                      <div>{r.itemId}</div>
                      <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                        {it?.stem}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {r.difficultyAtAttempt}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {answered}
                      {correctAnswer && (
                        <span className="ml-1 text-xs text-slate-500">
                          ({correctAnswer})
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {r.correct ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          Correct
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                          Incorrect
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {Math.round(r.timeMs / 1000)}s
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {r.correct
                        ? '—'
                        : MISCONCEPTION_LABELS[r.misconceptionTriggered]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {misconceptions.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Misconception summary &amp; suggested next steps
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            One row per observed misconception pattern, ordered by frequency.
            These are generic starting points derived from the misconception
            tag — teacher judgement always takes priority.
          </p>
          <ul className="mt-4 space-y-3">
            {misconceptions.map((m) => (
              <li
                key={m.code}
                className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {session.studentSnapshot.name} selected the "
                    {m.label.toLowerCase()}" pattern {m.count} time
                    {m.count > 1 ? 's' : ''}.
                  </div>
                  <div className="text-xs text-slate-500">
                    Items: {m.itemIds.join(', ')}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{m.nextStep}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {prereqs.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Prerequisite skills to consider revisiting
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Mapped from the misconception patterns above to direct prerequisite
            skills in the Class 6 Math skill tree. Confirm before assigning.
          </p>
          <ul className="mt-4 space-y-3">
            {prereqs.map((rec) => (
              <li
                key={rec.skill.code}
                className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {rec.skill.code} — {rec.skill.name}
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-700">{rec.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-500">
        <div className="font-semibold text-slate-700">
          Measurement note (read before sharing a result)
        </div>
        <p className="mt-1">
          All numbers here are derived from seed difficulty estimates, not from
          a calibrated IRT model. Treat the band as a conversation starter, not
          a diagnosis. Validity requires a cognitive-lab pilot with real
          students, item revision, and a calibration study (e.g., fitting a
          Rasch model to 200+ responses per item). See README for next steps.
        </p>
      </div>
    </>
  );
}

// ===========================================================================
// Item Review (v0.8)
// ===========================================================================
function ItemReviewView({
  currentItemId,
  onSelectItem,
  onBackToList,
  onBack,
  onSaved,
}: {
  currentItemId: string | null;
  onSelectItem: (id: string) => void;
  onBackToList: () => void;
  onBack: () => void;
  onSaved: () => void;
}) {
  const [statusFilter, setStatusFilter] = useState<'all' | ItemReviewStatus>(
    'all'
  );
  const [moduleFilter, setModuleFilter] = useState<'all' | ModuleId>('all');
  const [flagFilter, setFlagFilter] = useState<'all' | ItemQualityFlag>('all');
  const [search, setSearch] = useState('');

  // Reload reviews + recompute quality whenever the list view re-mounts.
  const reviews = useMemo(() => loadItemReviews(), []);
  const reviewsById = useMemo(
    () => new Map(reviews.map((r) => [r.itemId, r])),
    [reviews]
  );
  const qualityById = useMemo(
    () => buildItemQualityById(loadSessions(), reviews, ITEMS),
    [reviews]
  );

  if (currentItemId) {
    return (
      <ItemReviewForm
        itemId={currentItemId}
        onCancel={onBackToList}
        onSaved={() => {
          onSaved();
          onBackToList();
        }}
      />
    );
  }

  const filteredItems = ITEMS.filter((it) => {
    const review = reviewsById.get(it.id);
    const status: ItemReviewStatus = review?.status ?? 'not_reviewed';
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (
      moduleFilter !== 'all' &&
      MODULE_FOR_SKILL[it.skillId] !== moduleFilter
    ) {
      return false;
    }
    if (flagFilter !== 'all') {
      const q = qualityById[it.id];
      if (!q || !q.flags.includes(flagFilter)) return false;
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (
        !it.id.toLowerCase().includes(q) &&
        !it.stem.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const counts = reviewStatusCounts(reviews);
  const allFlagCounts = flagCounts(Object.values(qualityById));

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Teacher dashboard
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-brand-50 p-6 ring-1 ring-slate-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Quality control · Item review
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Walk the bank, item by item.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          For each item: verify the correct answer, flag wording or visual
          issues, mark the difficulty, and add comments. Reviews are stored
          on this device and appear in the JSON export.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ReviewStatusTile
            label="Approved"
            value={counts.approved}
            total={ITEMS.length}
            tone="emerald"
          />
          <ReviewStatusTile
            label="Needs revision"
            value={counts.needs_revision}
            total={ITEMS.length}
            tone="rose"
          />
          <ReviewStatusTile
            label="Not reviewed"
            value={counts.not_reviewed}
            total={ITEMS.length}
            tone="slate"
          />
        </div>
      </div>

      <div className="card">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Search items">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Item ID or stem text"
              className="form-input"
            />
          </Field>
          <Field label="Filter by status">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | ItemReviewStatus)
              }
              className="form-input"
            >
              <option value="all">All statuses</option>
              <option value="not_reviewed">Not reviewed</option>
              <option value="needs_revision">Needs revision</option>
              <option value="approved">Approved</option>
            </select>
          </Field>
          <Field label="Filter by module">
            <select
              value={moduleFilter}
              onChange={(e) =>
                setModuleFilter(e.target.value as 'all' | ModuleId)
              }
              className="form-input"
            >
              <option value="all">All modules</option>
              {MODULE_IDS_ORDERED.map((m) => (
                <option key={m} value={m}>
                  {MODULE_LABELS[m]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Filter by quality flag">
            <select
              value={flagFilter}
              onChange={(e) =>
                setFlagFilter(e.target.value as 'all' | ItemQualityFlag)
              }
              className="form-input"
            >
              <option value="all">No flag filter</option>
              {(Object.keys(allFlagCounts) as ItemQualityFlag[]).map((f) => (
                <option key={f} value={f}>
                  {FLAG_LABELS[f]} ({allFlagCounts[f]})
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Showing {filteredItems.length} of {ITEMS.length} items.
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Skill</th>
              <th className="px-3 py-2">Diff.</th>
              <th className="px-3 py-2">Attempts</th>
              <th className="px-3 py-2">Accuracy</th>
              <th className="px-3 py-2">Flags</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((it) => {
              const review = reviewsById.get(it.id);
              const status: ItemReviewStatus = review?.status ?? 'not_reviewed';
              const q = qualityById[it.id];
              return (
                <tr
                  key={it.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => onSelectItem(it.id)}
                >
                  <td className="px-3 py-3 font-medium text-slate-900">
                    <div>{it.id}</div>
                    <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                      {it.stem}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <SkillChip mode={it.skillId} />
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {it.difficulty}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {q?.attempts ?? 0}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {q && q.attempts > 0
                      ? `${Math.round(q.accuracy * 100)}%`
                      : '—'}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {q?.flags.map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200"
                          title={FLAG_LABELS[f]}
                        >
                          {FLAG_LABELS[f]}
                        </span>
                      ))}
                      {(!q || q.flags.length === 0) && (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <ReviewStatusPill status={status} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-brand-700">Open →</span>
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-sm text-slate-500"
                >
                  No items match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewStatusTile({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: 'emerald' | 'rose' | 'slate';
}) {
  const ring =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : tone === 'rose'
        ? 'border-rose-200 bg-rose-50 text-rose-900'
        : 'border-slate-200 bg-slate-50 text-slate-900';
  return (
    <div className={`rounded-2xl border p-4 ${ring}`}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs opacity-70">of {total}</div>
      </div>
    </div>
  );
}

function ReviewStatusPill({ status }: { status: ItemReviewStatus }) {
  const tone =
    status === 'approved'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : status === 'needs_revision'
        ? 'bg-rose-50 text-rose-700 ring-rose-200'
        : 'bg-slate-100 text-slate-600 ring-slate-200';
  const label =
    status === 'approved'
      ? 'Approved'
      : status === 'needs_revision'
        ? 'Needs revision'
        : 'Not reviewed';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${tone}`}
    >
      {label}
    </span>
  );
}

function ItemReviewForm({
  itemId,
  onCancel,
  onSaved,
}: {
  itemId: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const item = useMemo(() => ITEMS.find((it) => it.id === itemId), [itemId]);
  const existing = useMemo(
    () => getItemReview(itemId) ?? newItemReview(itemId),
    [itemId]
  );
  const [status, setStatus] = useState<ItemReviewStatus>(existing.status);
  const [correctAnswerVerified, setCorrectAnswerVerified] = useState<
    YesNo | null
  >(existing.correctAnswerVerified);
  const [wordingClear, setWordingClear] = useState<YesNo | null>(
    existing.wordingClear
  );
  const [gradeAppropriate, setGradeAppropriate] = useState<YesNo | null>(
    existing.gradeAppropriate
  );
  const [visualHelpful, setVisualHelpful] = useState<YesNoNa | null>(
    existing.visualHelpful
  );
  const [difficultyRating, setDifficultyRating] = useState<DifficultyRating | null>(
    existing.difficultyRating
  );
  const [ambiguityConcern, setAmbiguityConcern] = useState<YesNo | null>(
    existing.ambiguityConcern
  );
  const [comments, setComments] = useState(existing.comments);
  const [reviewerName, setReviewerName] = useState(existing.reviewerName ?? '');

  if (!item) {
    return (
      <div className="card text-center">
        <div className="text-lg font-semibold text-slate-900">
          Item not found
        </div>
        <p className="mt-2 text-sm text-slate-600">
          That item may have been removed from the bank.
        </p>
        <button onClick={onCancel} className="btn-secondary mt-4">
          Back
        </button>
      </div>
    );
  }

  const handleSave = (newStatus: ItemReviewStatus) => {
    const review: ItemReview = {
      itemId: item.id,
      status: newStatus,
      correctAnswerVerified,
      wordingClear,
      gradeAppropriate,
      visualHelpful,
      difficultyRating,
      ambiguityConcern,
      comments,
      reviewerName: reviewerName.trim() || undefined,
      reviewedAt: Date.now(),
    };
    saveItemReview(review);
    onSaved();
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onCancel}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Item review list
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          <SkillChip mode={item.skillId} />
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {item.id} · seed difficulty {item.difficulty} · {item.band}
          </span>
          <ReviewStatusPill status={status} />
        </div>
        <p className="mt-3 text-base font-semibold text-slate-900">
          {item.stem}
        </p>
        {item.visual && (
          <div className="mt-3">
            <Visual visual={item.visual} />
          </div>
        )}
        {item.kind === 'mcq' && (
          <ol className="mt-3 grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2">
            {item.options.map((o, i) => (
              <li
                key={i}
                className={`rounded-lg px-3 py-2 ring-1 ${
                  i === item.correctIndex
                    ? 'bg-emerald-50 ring-emerald-200'
                    : 'bg-slate-50 ring-slate-200'
                }`}
              >
                <span className="font-semibold text-slate-500">
                  {String.fromCharCode(65 + i)}.
                </span>{' '}
                {o.text}
                {i === item.correctIndex && (
                  <span className="ml-2 text-xs font-semibold text-emerald-700">
                    correct
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
        {item.kind === 'numeric' && (
          <div className="mt-3 text-xs text-slate-500">
            Numeric entry · canonical answer:{' '}
            <span className="font-semibold text-slate-700">
              {item.acceptedAnswers[0]}
            </span>{' '}
            · {item.inputHint}
          </div>
        )}
        <div className="mt-3 rounded-lg bg-white p-3 text-sm text-slate-700 ring-1 ring-slate-200">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Worked solution
          </div>
          <p className="mt-1">{item.solution}</p>
        </div>
      </div>

      <div className="card space-y-5">
        <ReviewYesNoRow
          label="Is the correct answer verified?"
          value={correctAnswerVerified}
          onChange={setCorrectAnswerVerified}
        />
        <ReviewYesNoRow
          label="Is the wording clear and unambiguous?"
          value={wordingClear}
          onChange={setWordingClear}
        />
        <ReviewYesNoRow
          label="Is the item grade-appropriate (Class 6)?"
          value={gradeAppropriate}
          onChange={setGradeAppropriate}
        />
        <ReviewYesNoNaRow
          label="Is the visual helpful?"
          value={visualHelpful}
          onChange={setVisualHelpful}
        />
        <ReviewDifficultyRow
          label="Difficulty rating"
          value={difficultyRating}
          onChange={setDifficultyRating}
        />
        <ReviewYesNoRow
          label="Any ambiguity / multiple-correct concern?"
          value={ambiguityConcern}
          onChange={setAmbiguityConcern}
        />

        <Field label="Comments">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Wording fix suggestion, alternative phrasing, language note…"
            className="form-input min-h-[100px]"
          />
        </Field>

        <Field label="Reviewer name (optional)">
          <input
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="e.g., Ms. Sharma"
            className="form-input"
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setStatus('approved');
            handleSave('approved');
          }}
          className="btn-primary"
        >
          Save & mark Approved
        </button>
        <button
          onClick={() => {
            setStatus('needs_revision');
            handleSave('needs_revision');
          }}
          className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 sm:px-5"
        >
          Save & flag Needs revision
        </button>
        <button onClick={() => handleSave(status)} className="btn-secondary">
          Save as draft
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

function ReviewYesNoRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNo | null;
  onChange: (v: YesNo | null) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {(['yes', 'no'] as YesNo[]).map((v) => (
          <button
            key={v}
            onClick={() => onChange(v === value ? null : v)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
              value === v
                ? 'bg-brand-50 text-brand-700 ring-brand-200'
                : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {v === 'yes' ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewYesNoNaRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNoNa | null;
  onChange: (v: YesNoNa | null) => void;
}) {
  const labels: Record<YesNoNa, string> = { yes: 'Yes', no: 'No', na: 'N/A' };
  return (
    <div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {(['yes', 'no', 'na'] as YesNoNa[]).map((v) => (
          <button
            key={v}
            onClick={() => onChange(v === value ? null : v)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
              value === v
                ? 'bg-brand-50 text-brand-700 ring-brand-200'
                : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {labels[v]}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewDifficultyRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DifficultyRating | null;
  onChange: (v: DifficultyRating | null) => void;
}) {
  const labels: Record<DifficultyRating, string> = {
    too_easy: 'Too easy',
    right_level: 'Right level',
    too_hard: 'Too hard',
  };
  return (
    <div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {(['too_easy', 'right_level', 'too_hard'] as DifficultyRating[]).map(
          (v) => (
            <button
              key={v}
              onClick={() => onChange(v === value ? null : v)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                value === v
                  ? 'bg-brand-50 text-brand-700 ring-brand-200'
                  : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {labels[v]}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// Pilot setup (v0.8)
// ===========================================================================
function PilotSetupView({
  onBack,
  onSaved,
}: {
  onBack: () => void;
  onSaved: () => void;
}) {
  const active = useMemo(() => getActivePilot(), []);
  const archive = useMemo(
    () => loadPilots().filter((p) => !p.active).sort((a, b) => b.createdAt - a.createdAt),
    []
  );
  const [teacherName, setTeacherName] = useState(active?.teacherName ?? '');
  const [className, setClassName] = useState(active?.className ?? '');
  const [school, setSchool] = useState(active?.school ?? '');
  const [date, setDate] = useState<string>(
    active?.date
      ? new Date(active.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [defaultMode, setDefaultMode] = useState<SkillMode>(
    active?.defaultMode ?? 'mixed'
  );
  const [notes, setNotes] = useState(active?.notes ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    if (!teacherName.trim() || !className.trim() || !school.trim()) {
      setError('Teacher name, class, and school are all required.');
      return;
    }
    setError(null);
    const pilot: PilotMetadata = {
      id: active?.id ?? generateId(),
      teacherName: teacherName.trim(),
      className: className.trim(),
      school: school.trim(),
      date: new Date(date).getTime(),
      defaultMode,
      notes,
      active: true,
      createdAt: active?.createdAt ?? Date.now(),
    };
    savePilot(pilot);
    onSaved();
  };

  const handleEnd = () => {
    endActivePilot();
    onSaved();
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Teacher dashboard
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-rose-50 via-white to-brand-50 p-6 ring-1 ring-rose-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-rose-700">
          Pilot mode
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Tag this run with a classroom context.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          When a pilot is active, every session you start is tagged with this
          pilot's id. The tag carries through into the JSON export. End the
          pilot when the run is over.
        </p>
        {active && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Active pilot: {active.teacherName} · {active.className} ·{' '}
            {active.school}
          </div>
        )}
      </div>

      <div className="card space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Teacher name" required>
            <input
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="e.g., Ms. Sharma"
              className="form-input"
            />
          </Field>
          <Field label="Class name" required>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., 6-A"
              className="form-input"
            />
          </Field>
          <Field label="School" required>
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., DPS Indirapuram"
              className="form-input"
            />
          </Field>
          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </Field>
        </div>
        <Field label="Default skill mode for this pilot">
          <select
            value={defaultMode}
            onChange={(e) => setDefaultMode(e.target.value as SkillMode)}
            className="form-input"
          >
            <option value="mixed">{SKILL_MODE_LABELS.mixed}</option>
            {MODULE_IDS_ORDERED.map((m) => (
              <optgroup key={m} label={MODULE_LABELS[m]}>
                <option value={`mixed_${m}`}>
                  {SKILL_MODE_LABELS[`mixed_${m}` as SkillMode]}
                </option>
                {SKILLS_BY_MODULE[m].map((s) => (
                  <option key={s} value={s}>
                    {SKILL_MODE_LABELS[s]}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What is the goal of this pilot? What population? Any caveats?"
            className="form-input min-h-[80px]"
          />
        </Field>
        {error && (
          <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={handleStart} className="btn-primary">
            {active ? 'Update active pilot' : 'Start pilot'}
          </button>
          {active && (
            <button onClick={handleEnd} className="btn-secondary">
              End active pilot
            </button>
          )}
        </div>
      </div>

      {archive.length > 0 && (
        <div className="card">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            Past pilots
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Sessions from these pilots remain tagged with their pilot id.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Teacher</th>
                  <th className="px-3 py-2">Class</th>
                  <th className="px-3 py-2">School</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {archive.map((p) => (
                  <tr key={p.id}>
                    <td className="px-3 py-3 text-slate-700">
                      {p.teacherName}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{p.className}</td>
                    <td className="px-3 py-3 text-slate-700">{p.school}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {formatDate(p.date)}
                    </td>
                    <td className="px-3 py-3">
                      <SkillChip mode={p.defaultMode} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Teaching Plan (v0.8)
// ===========================================================================
function TeachingPlanView({
  onBack,
  onOpenStudent,
  onOpenLesson,
  onStartAssessment,
}: {
  onBack: () => void;
  onOpenStudent: (id: string) => void;
  onOpenLesson: (s: SkillId) => void;
  onStartAssessment: (mode: SkillMode) => void;
}) {
  const plan = useMemo<TeachingPlan>(
    () => buildTeachingPlan(loadStudents(), loadSessions(), ITEMS),
    []
  );
  const itemById = useMemo(() => new Map(ITEMS.map((it) => [it.id, it])), []);

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Teacher dashboard
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-violet-50 via-white to-brand-50 p-6 ring-1 ring-violet-200 sm:p-8">
        <div className="text-xs font-medium uppercase tracking-wide text-violet-700">
          Teacher planning
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Teaching plan
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Auto-generated from {plan.totalCompletedSessions} completed session
          {plan.totalCompletedSessions === 1 ? '' : 's'} across{' '}
          {plan.totalStudentsWithSessions} student
          {plan.totalStudentsWithSessions === 1 ? '' : 's'}. Each section is a
          starting point — review before acting.
        </p>
      </div>

      {plan.totalCompletedSessions === 0 && (
        <div className="card text-center">
          <p className="text-sm text-slate-600">
            No completed sessions yet. Once students take some sessions, the
            teaching plan will fill in.
          </p>
        </div>
      )}

      {plan.totalCompletedSessions > 0 && (
        <>
          <section className="card">
            <h2 className="h-section">Top weakest skills</h2>
            <p className="mt-1 text-sm text-slate-600">
              Skills with the lowest class-wide accuracy (and at least 3
              attempts to be confident the weakness is real).
            </p>
            {plan.weakestSkills.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No skill is weak enough to flag. Nice.
              </p>
            ) : (
              <ol className="mt-3 space-y-2">
                {plan.weakestSkills.map((w, i) => (
                  <WeakSkillRow
                    key={w.skillId}
                    rank={i + 1}
                    weak={w}
                    onOpenLesson={() => onOpenLesson(w.skillId)}
                    onStartAssessment={() => onStartAssessment(w.skillId)}
                  />
                ))}
              </ol>
            )}
          </section>

          <section className="card">
            <h2 className="h-section">Top misconceptions</h2>
            <p className="mt-1 text-sm text-slate-600">
              The most-common wrong-answer patterns across the class.
            </p>
            {plan.topMisconceptions.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No tagged misconceptions yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {plan.topMisconceptions.map((m) => (
                  <li
                    key={m.code}
                    className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
                  >
                    <div className="text-sm font-semibold text-slate-900">
                      {m.label}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {m.occurrences} occurrence{m.occurrences === 1 ? '' : 's'}{' '}
                      across {m.studentsAffected} student
                      {m.studentsAffected === 1 ? '' : 's'} · seen on{' '}
                      {m.itemIds.length} item{m.itemIds.length === 1 ? '' : 's'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2 className="h-section">Suggested small groups</h2>
            <p className="mt-1 text-sm text-slate-600">
              Students grouped by their personal weakest skill (in
              curriculum order).
            </p>
            {plan.suggestedGroups.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No groups of two or more students share a weak skill yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {plan.suggestedGroups.map((g) => (
                  <li
                    key={g.skillId}
                    className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <SkillChip mode={g.skillId} />
                      <span className="text-sm font-semibold text-slate-900">
                        {SKILL_LABELS[g.skillId]}
                      </span>
                      <span className="text-xs text-slate-500">
                        {g.studentNames.length} students
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {g.studentNames.join(', ')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {plan.reteachSkill && (
            <section className="card">
              <h2 className="h-section">Recommended reteach</h2>
              <p className="mt-1 text-sm text-slate-600">
                Start with the weakest skill in the class.
              </p>
              <div className="mt-3 rounded-xl bg-violet-50 p-4 ring-1 ring-violet-200">
                <div className="flex flex-wrap items-center gap-2">
                  <SkillChip mode={plan.reteachSkill} />
                  <span className="text-sm font-semibold text-slate-900">
                    {SKILL_LABELS[plan.reteachSkill]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => onOpenLesson(plan.reteachSkill!)}
                    className="btn-primary text-sm"
                  >
                    Open the {plan.reteachSkill} reteach lesson
                  </button>
                  <button
                    onClick={() => onStartAssessment(plan.reteachSkill!)}
                    className="btn-secondary text-sm"
                  >
                    Take a {plan.reteachSkill} assessment
                  </button>
                </div>
              </div>
            </section>
          )}

          {plan.recommendedPracticeItems.length > 0 && (
            <section className="card">
              <h2 className="h-section">Recommended practice items</h2>
              <p className="mt-1 text-sm text-slate-600">
                Hand-picked items from the lessons of the weakest skills.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {plan.recommendedPracticeItems.map((id) => {
                  const it = itemById.get(id);
                  return (
                    <li
                      key={id}
                      className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {id}
                        </span>
                        {it && <SkillChip mode={it.skillId} />}
                        {it && <span>diff. {it.difficulty}</span>}
                      </div>
                      {it && (
                        <div className="mt-1 text-sm text-slate-700">
                          {it.stem}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {plan.studentsNeedingSupport.length > 0 && (
            <section className="card">
              <h2 className="h-section">Students needing support</h2>
              <p className="mt-1 text-sm text-slate-600">
                Each student is shown with the skills they're currently weak
                on. Click a name to open their detail page.
              </p>
              <ul className="mt-3 space-y-2">
                {plan.studentsNeedingSupport.map((s) => (
                  <li
                    key={s.studentId}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
                  >
                    <button
                      onClick={() => onOpenStudent(s.studentId)}
                      className="text-sm font-semibold text-slate-900 hover:underline"
                    >
                      {s.name} →
                    </button>
                    <div className="flex flex-wrap gap-1">
                      {s.weakSkills.map((skill) => (
                        <SkillChip key={skill} mode={skill} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <p className="text-xs text-slate-500">
        This plan is a prototype heuristic — useful as a starting point for a
        teacher conversation, not a calibrated diagnostic.
      </p>
    </div>
  );
}

function WeakSkillRow({
  rank,
  weak,
  onOpenLesson,
  onStartAssessment,
}: {
  rank: number;
  weak: WeakSkill;
  onOpenLesson: () => void;
  onStartAssessment: () => void;
}) {
  const accPct = Math.round(weak.accuracy * 100);
  return (
    <li className="rounded-xl bg-rose-50 p-4 ring-1 ring-rose-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
            {rank}
          </span>
          <SkillChip mode={weak.skillId} />
          <span className="text-sm font-semibold text-slate-900">
            {SKILL_LABELS[weak.skillId]}
          </span>
        </div>
        <span className="text-xs text-slate-600">
          {accPct}% across {weak.attempted} attempt
          {weak.attempted === 1 ? '' : 's'} · {weak.studentsAffected} student
          {weak.studentsAffected === 1 ? '' : 's'}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onOpenLesson} className="btn-primary text-xs">
          Open {weak.skillId} lesson
        </button>
        <button onClick={onStartAssessment} className="btn-secondary text-xs">
          Take {weak.skillId} assessment
        </button>
      </div>
    </li>
  );
}

// ===========================================================================
// Footer
// ===========================================================================
function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-5xl px-4 pb-10 text-center text-xs text-slate-500">
      Pragati prototype · Pre-pilot content · Not a calibrated assessment.
      Requires teacher validation and a calibration study before any
      operational use.
    </footer>
  );
}

// ===========================================================================
// Helpers
// ===========================================================================
function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}
