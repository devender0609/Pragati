import { useEffect, useMemo, useState } from 'react';
import { ITEMS, MISCONCEPTION_LABELS, type Item } from './data/items';
import {
  createInitialState,
  pickNextItem,
  updateAbility,
  shouldStop,
  MAX_ITEMS,
  type EngineState,
} from './lib/adaptiveEngine';
import {
  averageTimeSec,
  bandAccuracy,
  BAND_DESCRIPTIONS,
  bandColor,
  computeBand,
  correctCount,
  summarizeMisconceptions,
  type Response,
  type Session,
} from './lib/scoring';

type View = 'landing' | 'assessment' | 'results' | 'teacher';

const STORAGE_KEY = 'cbse-growth-assessment-session-v1';

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function saveSession(s: Session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore quota or private-mode errors */
  }
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [engine, setEngine] = useState<EngineState>(createInitialState);
  const [current, setCurrent] = useState<Item | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [itemStartTs, setItemStartTs] = useState<number>(0);
  const [session, setSession] = useState<Session | null>(null);

  // On first mount, try to restore a completed session so the teacher
  // dashboard can be revisited after a refresh.
  useEffect(() => {
    const existing = loadSession();
    if (existing && existing.completedAt) {
      setSession(existing);
    }
  }, []);

  const startAssessment = () => {
    clearSession();
    const fresh = createInitialState();
    const first = pickNextItem(ITEMS, fresh.attemptedIds, fresh.ability);
    setEngine(fresh);
    setCurrent(first);
    setSelected(null);
    setItemStartTs(Date.now());
    setSession({
      startedAt: Date.now(),
      completedAt: null,
      responses: [],
      finalAbility: fresh.ability,
    });
    setView('assessment');
  };

  const submitAnswer = () => {
    if (!current || selected === null || !session) return;
    const correct = selected === current.correctIndex;
    const abilityBefore = engine.ability;
    const abilityAfter = updateAbility(engine.ability, correct);

    const response: Response = {
      itemId: current.id,
      chosenIndex: selected,
      correct,
      timeMs: Date.now() - itemStartTs,
      difficultyAtAttempt: current.difficulty,
      abilityBefore,
      abilityAfter,
      misconceptionTriggered: current.options[selected].misconception,
    };

    const nextAttempted = [...engine.attemptedIds, current.id];
    const nextEngine: EngineState = {
      ability: abilityAfter,
      attemptedIds: nextAttempted,
    };
    const nextResponses = [...session.responses, response];

    if (shouldStop(nextEngine, ITEMS.length)) {
      const finalSession: Session = {
        ...session,
        responses: nextResponses,
        completedAt: Date.now(),
        finalAbility: abilityAfter,
      };
      setSession(finalSession);
      saveSession(finalSession);
      setEngine(nextEngine);
      setCurrent(null);
      setSelected(null);
      setView('results');
      return;
    }

    const nextItem = pickNextItem(ITEMS, nextAttempted, abilityAfter);
    if (!nextItem) {
      const finalSession: Session = {
        ...session,
        responses: nextResponses,
        completedAt: Date.now(),
        finalAbility: abilityAfter,
      };
      setSession(finalSession);
      saveSession(finalSession);
      setEngine(nextEngine);
      setCurrent(null);
      setSelected(null);
      setView('results');
      return;
    }

    setEngine(nextEngine);
    setSession({ ...session, responses: nextResponses });
    setCurrent(nextItem);
    setSelected(null);
    setItemStartTs(Date.now());
  };

  const resetAll = () => {
    clearSession();
    setSession(null);
    setEngine(createInitialState());
    setCurrent(null);
    setSelected(null);
    setView('landing');
  };

  return (
    <div className="min-h-full bg-slate-50">
      <NavBar view={view} onNav={setView} hasSession={Boolean(session?.completedAt)} />

      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {view === 'landing' && <Landing onStart={startAssessment} />}

        {view === 'assessment' && current && session && (
          <Assessment
            item={current}
            selected={selected}
            onSelect={setSelected}
            onSubmit={submitAnswer}
            progress={session.responses.length + 1}
            total={MAX_ITEMS}
          />
        )}

        {view === 'results' && session?.completedAt && (
          <Results
            session={session}
            onViewTeacher={() => setView('teacher')}
            onRestart={resetAll}
          />
        )}

        {view === 'teacher' && session?.completedAt && (
          <TeacherDashboard session={session} onBack={() => setView('results')} />
        )}

        {view === 'teacher' && !session?.completedAt && (
          <EmptyDashboard onStart={startAssessment} />
        )}
      </main>

      <Footer />
    </div>
  );
}

// --------------------------------------------------------------------------
// NavBar
// --------------------------------------------------------------------------
function NavBar({
  view,
  onNav,
  hasSession,
}: {
  view: View;
  onNav: (v: View) => void;
  hasSession: boolean;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <button
          onClick={() => onNav('landing')}
          className="flex items-center gap-2 text-left"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            C
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              CBSE Growth Assessment
            </div>
            <div className="text-xs text-slate-500">Prototype · Class 6 Math</div>
          </div>
        </button>
        <nav className="flex items-center gap-2 text-sm">
          <button
            onClick={() => onNav('teacher')}
            disabled={!hasSession && view !== 'teacher'}
            className="rounded-lg px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Teacher dashboard
          </button>
        </nav>
      </div>
    </header>
  );
}

// --------------------------------------------------------------------------
// Landing
// --------------------------------------------------------------------------
function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-8">
      <div className="card">
        <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          Prototype · Pre-pilot
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          CBSE Growth Assessment
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          A prototype adaptive assessment for CBSE Class 6 Math. This short
          assessment focuses on one skill —{' '}
          <span className="font-semibold">adding fractions with unlike denominators</span>{' '}
          — and demonstrates the assessment flow, simple adaptive routing,
          and teacher-facing diagnostic reporting.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={onStart} className="btn-primary">
            Start Assessment
          </button>
          <span className="text-sm text-slate-500">
            About 8–10 questions · 5–10 minutes
          </span>
        </div>
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
          title="Transparent"
          body="Uses seed difficulty values on a 1–10 scale. No claim of IRT calibration. Meant as the starting point for a real calibration study."
        />
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">What this is not</div>
        <p className="mt-1">
          This is a pre-pilot prototype. It is not a validated measurement
          instrument, does not produce RIT scores, and has not been calibrated
          with student response data. Use it to demonstrate the flow and
          collect feedback from teachers, not to make decisions about students.
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

// --------------------------------------------------------------------------
// Assessment
// --------------------------------------------------------------------------
function Assessment({
  item,
  selected,
  onSelect,
  onSubmit,
  progress,
  total,
}: {
  item: Item;
  selected: number | null;
  onSelect: (i: number) => void;
  onSubmit: () => void;
  progress: number;
  total: number;
}) {
  const pct = Math.min(100, Math.round((progress / total) * 100));
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>
            Question {progress} of up to {total}
          </span>
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
        </div>

        <h2 className="mt-5 text-xl font-semibold leading-relaxed text-slate-900 md:text-2xl">
          {item.stem}
        </h2>

        <div className="mt-6 space-y-3">
          {item.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={`flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
                }`}
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

        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={onSubmit}
            disabled={selected === null}
            className="btn-primary"
          >
            Submit answer
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Results (student-facing)
// --------------------------------------------------------------------------
function Results({
  session,
  onViewTeacher,
  onRestart,
}: {
  session: Session;
  onViewTeacher: () => void;
  onRestart: () => void;
}) {
  const band = computeBand(session.finalAbility);
  const correct = correctCount(session.responses);
  const total = session.responses.length;
  const misconceptions = summarizeMisconceptions(session.responses).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Assessment complete
        </div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Your prototype estimate
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat
            label="Performance band"
            value={band}
            valueClass={`${bandColor(band)} ring-1`}
          />
          <Stat label="Correct answers" value={`${correct} / ${total}`} />
          <Stat
            label="Final ability estimate"
            value={`${session.finalAbility.toFixed(1)} / 10`}
          />
        </div>

        <p className="mt-5 text-sm text-slate-600">
          {BAND_DESCRIPTIONS[band]}
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Skills demonstrated</h2>
        <p className="mt-1 text-sm text-slate-600">
          Based on items you answered on the one skill tested in this prototype:
          <span className="font-medium"> FR.06 — Add fractions with unlike denominators.</span>
        </p>
        <BandAccuracyTable session={session} />
      </div>

      {misconceptions.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            Likely misconception patterns
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            These are the patterns most consistent with the wrong answers chosen.
            A teacher should confirm them before acting.
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
          This is a prototype estimate based on seed difficulty values. It is
          not a calibrated score. Real reporting requires student response data
          and an IRT model fit, plus teacher review of every item. Do not use
          these bands to make placement, promotion, or remediation decisions.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onViewTeacher} className="btn-primary">
          View teacher dashboard
        </button>
        <button onClick={onRestart} className="btn-secondary">
          Start over
        </button>
      </div>
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

// --------------------------------------------------------------------------
// Teacher dashboard
// --------------------------------------------------------------------------
function TeacherDashboard({
  session,
  onBack,
}: {
  session: Session;
  onBack: () => void;
}) {
  const itemById = useMemo(() => new Map(ITEMS.map((it) => [it.id, it])), []);
  const band = computeBand(session.finalAbility);
  const correct = correctCount(session.responses);
  const total = session.responses.length;
  const avgTime = averageTimeSec(session.responses);
  const misconceptions = summarizeMisconceptions(session.responses);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Teacher dashboard
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Student result summary
          </h1>
        </div>
        <button onClick={onBack} className="btn-secondary">
          Back to student view
        </button>
      </div>

      <div className="card">
        <div className="grid gap-4 md:grid-cols-4">
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
          Every distractor is tagged with the specific misconception it represents.
          The final column is a teacher-facing suggestion; use it as a starting
          point and adapt to what you already know about the student.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
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
                const letter = String.fromCharCode(65 + r.chosenIndex);
                const correctLetter = it
                  ? String.fromCharCode(65 + it.correctIndex)
                  : '?';
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
                      {letter}
                      <span className="ml-1 text-xs text-slate-500">
                        (correct: {correctLetter})
                      </span>
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
            Suggested next teaching steps
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            One suggestion per observed misconception pattern, ordered by
            frequency. These are generic starting points derived from the
            misconception tag — judgement from the teacher always takes
            priority.
          </p>
          <ul className="mt-4 space-y-3">
            {misconceptions.map((m) => (
              <li
                key={m.code}
                className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">
                    {m.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    Seen on: {m.itemIds.join(', ')}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{m.nextStep}</p>
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
          a calibrated IRT model. Treat the "band" as a conversation starter,
          not a diagnosis. Validity requires a cognitive-lab pilot with real
          students, item revision, and a calibration study (e.g., fitting a
          Rasch model to 200+ responses per item). See README for next steps.
        </p>
      </div>
    </div>
  );
}

function EmptyDashboard({ onStart }: { onStart: () => void }) {
  return (
    <div className="card text-center">
      <h1 className="text-xl font-semibold text-slate-900">
        No completed assessment yet
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Take the student assessment first — the teacher dashboard will appear
        here once the session is complete.
      </p>
      <button onClick={onStart} className="btn-primary mt-4">
        Start assessment
      </button>
    </div>
  );
}

// --------------------------------------------------------------------------
// Footer
// --------------------------------------------------------------------------
function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-4xl px-4 pb-10 text-center text-xs text-slate-500">
      Prototype. Pre-pilot content. Not a calibrated assessment. Requires teacher
      validation and a calibration study before any operational use.
    </footer>
  );
}
