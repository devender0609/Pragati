import { useEffect, useState } from 'react';
import {
  findOrCreateStudent,
  getCompletedSessionsForStudent,
} from '../lib/storage';
import {
  ASSESSMENT_WINDOWS,
  ASSESSMENT_WINDOW_DESCRIPTIONS,
  ASSESSMENT_WINDOW_LABELS,
  MODULE_IDS_ORDERED,
  MODULE_LABELS,
  SKILLS_BY_MODULE,
  SKILL_MODE_DESCRIPTIONS,
  SKILL_MODE_LABELS,
  type AssessmentAssignment,
  type AssessmentWindow,
  type SkillMode,
  type Student,
} from '../types';
import { Field } from './common/Field';
import { SkillChip } from './common/SkillChip';

// StartForm — captures student name + grade + school + assessment window
// + skill mode at the start of every session. If a student is prefilled
// (from the teacher Students view) the next-best window is suggested.
// If a teacher assignment is prefilled, a brand-coloured strip is shown.
// Extracted from App.tsx in v0.15. Behavior unchanged.
export function StartForm({
  prefill,
  prefillSkillMode,
  prefillAssignment,
  onStart,
  onCancel,
}: {
  prefill: Student | null;
  prefillSkillMode: SkillMode | null;
  prefillAssignment: AssessmentAssignment | null;
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
          Enter the student's details so this attempt can be saved alongside
          any previous attempts. All data stays on this device — there is no
          server in this prototype.
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
          <Field label="Class" required>
            {/* v0.31 — dropdown of registered classes rather than free
                text. Preserves the pre-v0.31 "Class 6" default. Any
                option 1–12 produces a valid gradeId that downstream
                curriculum context stamps onto the Student record. */}
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="form-input"
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
          <Field label="School (optional)">
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., DPS Indirapuram"
              className="form-input"
            />
          </Field>
        </div>

        {prefillAssignment && (
          <div className="mt-6 rounded-xl border-2 border-brand-300 bg-brand-50/60 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Teacher assignment
              </span>
              <SkillChip mode={prefillAssignment.skillMode} />
              <span className="text-xs text-slate-500">
                {prefillAssignment.itemCount}-question check
              </span>
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {prefillAssignment.title}
            </div>
            {prefillAssignment.teacherNote && (
              <p className="mt-1 text-xs text-slate-700">
                {prefillAssignment.teacherNote}
              </p>
            )}
          </div>
        )}

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
          The bank has 374 items across 34 skills in 6 modules; each session
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
