// v0.18: 4-step first-run onboarding wizard.
//
// Surfaces only when localStorage has no onboarding-complete record (see
// src/lib/onboarding.ts). The four steps are:
//
//   1. "What is Pragati?" — purpose + scope + prototype disclaimer.
//   2. "How Pragati works" — classroom → assignment → student → review loop.
//   3. "Start your first pilot" — CTA: create teacher account, or continue
//      in local demo mode.
//   4. "Quick setup" — school / grade / class section / first classroom
//      name. Persisted to onboarding state; the teacher can edit these
//      later from settings or just by recreating the classroom.
//
// Persistence is opaque (a single localStorage key). Nothing here changes
// the Pragati data model or schema.

import { useState } from 'react';
import {
  loadOnboardingState,
  saveOnboardingComplete,
  saveOnboardingState,
} from '../lib/onboarding';
import { isFirebaseEnabled } from '../lib/firebase';

export function OnboardingFlow({
  open,
  onClose,
  onOpenSignUp,
  onSeedSampleData,
}: {
  open: boolean;
  onClose: () => void;
  // Caller opens the unified TeacherLoginModal in signup mode.
  onOpenSignUp: () => void;
  // Caller seeds a sample classroom + students + sessions. Optional so
  // demos that don't want it can pass nothing.
  onSeedSampleData?: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const initial = loadOnboardingState();
  const [schoolName, setSchoolName] = useState(initial.schoolName ?? '');
  const [grade, setGrade] = useState(initial.grade ?? 'Class 6');
  const [classSection, setClassSection] = useState(initial.classSection ?? '');
  const [firstClassroomName, setFirstClassroomName] = useState(
    initial.firstClassroomName ?? ''
  );
  const [branch, setBranch] = useState<'signup' | 'demo' | null>(initial.branch ?? null);

  if (!open) return null;

  const fbEnabled = isFirebaseEnabled();

  const goNext = () => {
    if (step < 4) setStep(((step + 1) as 1 | 2 | 3 | 4));
  };
  const goPrev = () => {
    if (step > 1) setStep(((step - 1) as 1 | 2 | 3 | 4));
  };

  const finish = (opts?: { seedSample?: boolean }) => {
    saveOnboardingComplete({
      schoolName: schoolName.trim() || undefined,
      grade: grade.trim() || undefined,
      classSection: classSection.trim() || undefined,
      firstClassroomName: firstClassroomName.trim() || undefined,
      branch,
    });
    if (opts?.seedSample && onSeedSampleData) onSeedSampleData();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 p-4"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
        {/* Step indicator */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Step {step} of 4
          </div>
          <div className="flex flex-1 items-center gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={`h-1.5 flex-1 rounded-full ${
                  n <= step ? 'bg-brand-600' : 'bg-slate-200'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <button
            onClick={() => {
              // Allow skip from any step — we still mark complete so the
              // teacher isn't nagged on next launch.
              saveOnboardingComplete({ branch: branch ?? null });
              onClose();
            }}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            Skip
          </button>
        </div>

        {/* Step body */}
        <div className="mt-6 space-y-4">
          {step === 1 && <Step1Intro />}
          {step === 2 && <Step2HowItWorks />}
          {step === 3 && (
            <Step3Pilot
              branch={branch}
              onChooseSignup={() => {
                setBranch('signup');
                saveOnboardingState({ branch: 'signup' });
                // Open the signup modal and DON'T close the onboarding yet —
                // when the teacher returns they can move to step 4 to finish
                // quick setup.
                onOpenSignUp();
                goNext();
              }}
              onChooseDemo={() => {
                setBranch('demo');
                saveOnboardingState({ branch: 'demo' });
                goNext();
              }}
              fbEnabled={fbEnabled}
            />
          )}
          {step === 4 && (
            <Step4QuickSetup
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              grade={grade}
              setGrade={setGrade}
              classSection={classSection}
              setClassSection={setClassSection}
              firstClassroomName={firstClassroomName}
              setFirstClassroomName={setFirstClassroomName}
              branch={branch}
              canSeed={Boolean(onSeedSampleData)}
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={goPrev}
            disabled={step === 1}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40"
          >
            ← Back
          </button>
          {step < 4 && step !== 3 && (
            <button
              onClick={goNext}
              className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Continue →
            </button>
          )}
          {step === 3 && branch && (
            <button
              onClick={goNext}
              className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Continue →
            </button>
          )}
          {step === 4 && (
            <div className="flex flex-wrap gap-2">
              {branch === 'demo' && onSeedSampleData && (
                <button
                  onClick={() => finish({ seedSample: true })}
                  className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
                >
                  Try with sample data
                </button>
              )}
              <button
                onClick={() => finish()}
                className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                Finish setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

function Step1Intro() {
  return (
    <>
      <h2 id="onboarding-title" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Welcome to Pragati
      </h2>
      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
        Pragati is a CBSE / NCERT-informed adaptive assessment prototype for
        Class 6 Math. It is built to help a teacher spot misconceptions across a
        small bank of items, focus a follow-up lesson, and plan a short
        classroom intervention.
      </p>
      <ul className="mt-2 space-y-2 text-sm text-slate-700">
        <Bullet>
          <strong>Adaptive item picker</strong> — students see ~10 items per
          session, picked from the bank by a simple rule-based engine.
        </Bullet>
        <Bullet>
          <strong>Misconception-tagged feedback</strong> — every wrong-answer
          choice is tied to one of a small set of common Class 6 misconceptions.
        </Bullet>
        <Bullet>
          <strong>Teacher review built in</strong> — flag items, write notes,
          and export everything as JSON. Nothing about an item is hidden.
        </Bullet>
      </ul>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <strong>Pre-pilot prototype.</strong> This is not a calibrated
        assessment and is not officially endorsed by CBSE. Every output is
        teacher-review-first.
      </div>
    </>
  );
}

function Step2HowItWorks() {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        How Pragati works
      </h2>
      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
        The teacher loop is short and intentional. Each step has its own
        dashboard inside the teacher console.
      </p>
      <ol className="mt-2 space-y-3 text-sm">
        <Numbered n={1} title="Create a classroom">
          Add a small roster. Classrooms sync to the cloud when you sign in.
        </Numbered>
        <Numbered n={2} title="Assign an assessment">
          Pick a skill (or a mixed mode), set the size, and tell the class
          what to take next.
        </Numbered>
        <Numbered n={3} title="Students complete it">
          Students see 10 short items adapted to how they answer. No timer.
        </Numbered>
        <Numbered n={4} title="You review the results">
          The class dashboard surfaces hardest skills, top misconceptions,
          and flagged items. Build a teaching plan from one screen.
        </Numbered>
      </ol>
    </>
  );
}

function Step3Pilot({
  branch,
  onChooseSignup,
  onChooseDemo,
  fbEnabled,
}: {
  branch: 'signup' | 'demo' | null;
  onChooseSignup: () => void;
  onChooseDemo: () => void;
  fbEnabled: boolean;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Start your first pilot
      </h2>
      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
        You can pilot Pragati with a real class today, or just kick the tyres
        with sample data first.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChoiceCard
          title="Create a teacher account"
          subtitle={fbEnabled ? 'Sync across devices' : 'Firebase not configured'}
          body="Use your school email and a password. Your roster and results sync to the cloud, so you can review on a laptop after assessing on a tablet."
          ctaLabel="Create account"
          onClick={onChooseSignup}
          selected={branch === 'signup'}
          disabled={!fbEnabled}
        />
        <ChoiceCard
          title="Continue in demo mode"
          subtitle="No account needed"
          body="Use Pragati locally on this device. Data stays in this browser. You can sign up later — your local data won't be lost."
          ctaLabel="Continue in demo mode"
          onClick={onChooseDemo}
          selected={branch === 'demo'}
        />
      </div>
      {!fbEnabled && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          Firebase isn't configured in this build, so cloud sign-up is
          disabled. Demo mode still works for evaluating Pragati end-to-end.
        </div>
      )}
    </>
  );
}

function Step4QuickSetup({
  schoolName,
  setSchoolName,
  grade,
  setGrade,
  classSection,
  setClassSection,
  firstClassroomName,
  setFirstClassroomName,
  branch,
  canSeed,
}: {
  schoolName: string;
  setSchoolName: (v: string) => void;
  grade: string;
  setGrade: (v: string) => void;
  classSection: string;
  setClassSection: (v: string) => void;
  firstClassroomName: string;
  setFirstClassroomName: (v: string) => void;
  branch: 'signup' | 'demo' | null;
  canSeed: boolean;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Quick setup
      </h2>
      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
        A few details to personalise the dashboard. All optional — you can edit
        any of this later.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="School name">
          <input
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="e.g., Kendriya Vidyalaya, Vasant Kunj"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </Field>
        <Field label="Class">
          {/* v0.31 — dropdown so the setter produces a valid
              class label rather than free text. */}
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map(
              (label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              )
            )}
          </select>
        </Field>
        <Field label="Class / section">
          <input
            value={classSection}
            onChange={(e) => setClassSection(e.target.value)}
            placeholder="e.g., 6A"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </Field>
        <Field label="First classroom name">
          <input
            value={firstClassroomName}
            onChange={(e) => setFirstClassroomName(e.target.value)}
            placeholder="e.g., Mon/Wed Math"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </Field>
      </div>
      {branch === 'demo' && canSeed && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs text-violet-900">
          <strong>Demo mode tip:</strong> click "Try with sample data" below
          to populate a sample classroom of 6 students with a few sessions, so
          the teacher dashboard isn't empty. You can delete the sample
          students at any time from the Students view.
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-brand-600" />
      <span>{children}</span>
    </li>
  );
}

function Numbered({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
        {n}
      </span>
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-0.5 text-xs text-slate-600 sm:text-sm">{children}</div>
      </div>
    </li>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-800">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ChoiceCard({
  title,
  subtitle,
  body,
  ctaLabel,
  onClick,
  selected,
  disabled,
}: {
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  onClick: () => void;
  selected: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border-2 p-4 transition ${
        selected
          ? 'border-brand-500 bg-brand-50'
          : 'border-slate-200 bg-white'
      } ${disabled ? 'opacity-60' : ''}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {subtitle}
      </div>
      <h3 className="mt-1 text-base font-bold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
        {body}
      </p>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`mt-3 rounded-xl px-3 py-2 text-xs font-semibold ${
          disabled
            ? 'cursor-not-allowed bg-slate-200 text-slate-500'
            : selected
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-brand-600 text-white shadow-sm hover:bg-brand-700'
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
