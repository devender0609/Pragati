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
  pickNextItem,
  updateAbility,
  shouldStop,
  SESSION_SIZE,
  type EngineState,
} from './lib/adaptiveEngine';
import {
  averageTimeSec,
  bandAccuracy,
  BAND_DESCRIPTIONS,
  bandColor,
  computeBand,
  correctCount,
  growthIndicator,
  recommendPrerequisites,
  sessionConfidence,
  summarizeMisconceptions,
  summarizeSession,
  type Band,
  type GrowthIndicator,
  type SessionSummary,
} from './lib/scoring';
import {
  buildExportBundle,
  deleteStudent,
  exportAllAsJSON,
  findOrCreateStudent,
  generateId,
  getCompletedSessionsForStudent,
  loadSessions,
  loadStudents,
  saveSession,
} from './lib/storage';
import {
  buildClassAggregate,
  type ClassAggregate,
  type ClassMisconceptionRow,
  type ClassHardestItem,
} from './lib/classDashboard';
import {
  ASSESSMENT_WINDOWS,
  ASSESSMENT_WINDOW_DESCRIPTIONS,
  ASSESSMENT_WINDOW_LABELS,
  type AssessmentWindow,
  type Session,
  type Student,
} from './types';

type View =
  | 'landing'
  | 'startForm'
  | 'assessment'
  | 'results'
  | 'teacher'
  | 'classDashboard'
  | 'studentDetail';

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

  useEffect(() => {
    /* no-op for now */
  }, []);

  const startAssessmentFor = (
    student: Student,
    window: AssessmentWindow
  ) => {
    // Build a stratified, mostly-fresh session pool of 10 items.
    const priorIds = getCompletedSessionsForStudent(student.id).flatMap((s) =>
      s.responses.map((r) => r.itemId)
    );
    const pool = buildSessionPool(ITEMS, priorIds);
    const fresh = createInitialState();
    const first = pickNextItem(pool, fresh.attemptedIds, fresh.ability);

    const newSession: Session = {
      id: generateId(),
      studentId: student.id,
      studentSnapshot: {
        name: student.name,
        grade: student.grade,
        school: student.school,
      },
      window,
      skillId: 'FR.06',
      startedAt: Date.now(),
      completedAt: null,
      responses: [],
      finalAbility: fresh.ability,
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
    setView('landing');
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
        onNavLanding={goLanding}
        onNavTeacher={() => {
          setSelectedStudentId(null);
          setView('teacher');
        }}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        {view === 'landing' && (
          <Landing
            onStart={() => {
              setPrefillStudent(null);
              setView('startForm');
            }}
            onTeacher={() => {
              setSelectedStudentId(null);
              setView('teacher');
            }}
          />
        )}

        {view === 'startForm' && (
          <StartForm
            prefill={prefillStudent}
            onCancel={goLanding}
            onStart={(student, window) => startAssessmentFor(student, window)}
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
  onNavLanding,
  onNavTeacher,
}: {
  view: View;
  onNavLanding: () => void;
  onNavTeacher: () => void;
}) {
  const teacherActive =
    view === 'teacher' ||
    view === 'studentDetail' ||
    view === 'classDashboard';
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <button
          onClick={onNavLanding}
          className="flex items-center gap-2 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-base font-bold text-white">
            P
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Pragati</div>
            <div className="text-xs text-slate-500">
              Growth assessment prototype · Class 6 Math
            </div>
          </div>
        </button>
        <nav className="flex items-center gap-2 text-sm">
          <button
            onClick={onNavTeacher}
            className={`rounded-lg px-3 py-1.5 font-medium transition ${
              teacherActive
                ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Teacher dashboard
          </button>
        </nav>
      </div>
    </header>
  );
}

// ===========================================================================
// Landing
// ===========================================================================
function Landing({
  onStart,
  onTeacher,
}: {
  onStart: () => void;
  onTeacher: () => void;
}) {
  const totalSessions = loadSessions().length;
  const totalStudents = loadStudents().length;

  return (
    <div className="space-y-8">
      <div className="card">
        <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          Prototype · Pre-pilot
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Pragati
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Growth assessment prototype for CBSE Class 6 Math
        </p>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          A short adaptive assessment that focuses on one skill —{' '}
          <span className="font-semibold">
            adding fractions with unlike denominators
          </span>{' '}
          — and demonstrates the assessment flow, simple adaptive routing,
          per-student session history, and a teacher-facing diagnostic
          dashboard.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={onStart} className="btn-primary">
            Take an assessment
          </button>
          <button onClick={onTeacher} className="btn-secondary">
            Open teacher dashboard
          </button>
          <span className="text-sm text-slate-500">
            About 8–10 questions · 5–10 minutes
          </span>
        </div>
        {(totalSessions > 0 || totalStudents > 0) && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
            <span className="font-medium text-slate-700">On this device:</span>
            {totalStudents} student{totalStudents === 1 ? '' : 's'},{' '}
            {totalSessions} session{totalSessions === 1 ? '' : 's'} stored
            locally.
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="Adaptive"
          body="The next question is chosen based on the previous answer — correct moves the student up a difficulty level, incorrect moves them down."
        />
        <FeatureCard
          title="Diagnostic"
          body="Every wrong-answer option is tagged with the misconception it represents, so teachers see why a student answered the way they did."
        />
        <FeatureCard
          title="Longitudinal"
          body="Sessions are stored per student. Take a baseline now, a mid-year check later, and the dashboard shows an early growth indicator across them."
        />
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">What this is not</div>
        <p className="mt-1">
          This is a pre-pilot prototype. It does not produce a calibrated score
          or a RIT-equivalent. The "growth indicator" is an early signal from a
          rule-based heuristic on a small item bank, not a validated growth
          metric. Use it to demonstrate the flow, run a teacher-validation
          review, and collect feedback — not to make placement, promotion, or
          remediation decisions about a student.
        </p>
        <p className="mt-2">
          Each session draws 10 items from a pool of 24, but with a small bank
          some overlap across attempts is expected — you may see similar
          question types across attempts.
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </div>
  );
}

// ===========================================================================
// Start form: capture student + window
// ===========================================================================
function StartForm({
  prefill,
  onStart,
  onCancel,
}: {
  prefill: Student | null;
  onStart: (student: Student, window: AssessmentWindow) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(prefill?.name ?? '');
  const [grade, setGrade] = useState(prefill?.grade ?? 'Class 6');
  const [school, setSchool] = useState(prefill?.school ?? '');
  const [window, setWindow] = useState<AssessmentWindow>('baseline');
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
    onStart(student, window);
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
          The bank has 24 items; each session shows 10. With a small bank, you
          may see similar question types across attempts.
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
        <div className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">{studentName}</span>
          <span className="mx-2 text-slate-400">·</span>
          <span>{ASSESSMENT_WINDOW_LABELS[window]} session</span>
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
}: {
  session: Session;
  onAnotherSession: () => void;
  onTeacher: () => void;
  onHome: () => void;
}) {
  const band = computeBand(session.finalAbility);
  const correct = correctCount(session.responses);
  const total = session.responses.length;
  const misconceptions = summarizeMisconceptions(session.responses).slice(0, 3);

  const growth = useMemo<GrowthIndicator | null>(() => {
    const all = getCompletedSessionsForStudent(session.studentId);
    const prior = all.filter(
      (s) =>
        s.id !== session.id &&
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

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Assessment complete
        </div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {session.studentSnapshot.name}'s prototype estimate
        </h1>
        <div className="mt-1 text-sm text-slate-600">
          {ASSESSMENT_WINDOW_LABELS[session.window]} session ·{' '}
          {session.studentSnapshot.grade}
          {session.studentSnapshot.school
            ? ` · ${session.studentSnapshot.school}`
            : ''}
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

        <p className="mt-5 text-sm text-slate-600">{BAND_DESCRIPTIONS[band]}</p>

        {conf.confidence === 'low' && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200">
            <span className="font-semibold">Low-confidence estimate.</span>{' '}
            {conf.reasons.join(' ')}
          </div>
        )}
      </div>

      {growth && <GrowthCard growth={growth} session={session} />}

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">
          Skills demonstrated
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Based on items answered on the one skill tested in this prototype:
          <span className="font-medium">
            {' '}
            FR.06 — Add fractions with unlike denominators.
          </span>
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
          View teacher dashboard for this student
        </button>
        <button onClick={onAnotherSession} className="btn-secondary">
          Start another session for {session.studentSnapshot.name}
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
        the two sessions. The "prototype change indicator" combines both with
        the average difficulty attempted into a single hedged direction. None
        of these are a calibrated growth measurement — they are an early
        signal on a 24-item bank, useful for a teacher conversation, not for
        placement or reporting.
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
    const json = exportAllAsJSON();
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
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-600">
            One row per student. Click a row to open their growth history,
            item-by-item responses, and recommended next steps.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onOpenClassDashboard} className="btn-secondary">
            Class dashboard
          </button>
          <button onClick={handleExport} className="btn-secondary">
            Export data (JSON)
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
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">School / Grade</th>
                <th className="px-3 py-2">Sessions</th>
                <th className="px-3 py-2">Latest window</th>
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
                    colSpan={8}
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
  const aggregate = useMemo<ClassAggregate>(() => {
    return buildClassAggregate(loadStudents(), loadSessions());
  }, []);

  const hasData = aggregate.totalResponses > 0;

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
      </div>

      <ClassHeadlineTiles aggregate={aggregate} />

      {!hasData && (
        <div className="card text-center">
          <p className="text-sm text-slate-600">
            No completed sessions yet. Once a student finishes an attempt,
            their responses will appear in the roll-up.
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
        on a 24-item bank. Sample sizes can be very small in a pilot — read
        the attempt counts before drawing conclusions.
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
    <div className="card text-center">
      <h1 className="text-xl font-semibold text-slate-900">No students yet</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        Take the first assessment to register a student. Their result and any
        future sessions will appear here in the teacher dashboard.
      </p>
      <button onClick={onStart} className="btn-primary mt-4">
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
  const prevToLatest =
    sessions.length >= 2 ? sessions[sessions.length - 2] : null;
  const growth =
    latest && prevToLatest ? growthIndicator(prevToLatest, latest) : null;

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
        early signal on the 1–10 seed scale, not a validated growth metric.
        Practice sessions are included for completeness.
      </p>

      {growthForLatest && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
          {growthForLatest.summary}
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Window</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2">Correct</th>
              <th className="px-3 py-2">Avg. diff. attempted</th>
              <th className="px-3 py-2">Misconception rate</th>
              <th className="px-3 py-2">Band</th>
              <th className="px-3 py-2">Estimate</th>
              <th className="px-3 py-2">Δ vs. previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((s, idx) => {
              const summary: SessionSummary = summarizeSession(s);
              const band = computeBand(s.finalAbility);
              const previous = rows[idx + 1] ?? null;
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

  return (
    <>
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Most recent session
          </h2>
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
        <p className="mt-4 text-sm text-slate-600">{BAND_DESCRIPTIONS[band]}</p>
      </div>

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
