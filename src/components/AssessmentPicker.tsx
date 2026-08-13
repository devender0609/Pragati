// v0.27 (introduced) → v0.33 (UX pass) — Registry-driven assessment picker.
//
// A student- or teacher-facing screen that walks:
//   Grade  →  Subject  →  Assessment (blueprint)  →  Start
//
// Every option is pulled from the curriculum registry
// (`src/curriculum`). Grades and subjects that have no registered
// content are shown with an availability chip and cannot be selected
// to start an assessment — the "Start" button is disabled and the
// reason is displayed.
//
// This component does NOT replace the legacy Grade toggle in App.tsx.
// It's a new entry point wired next to it, so the existing Class 6 /
// Class 7 flows keep working while the registry-driven flow is being
// piloted.

import { useMemo, useState } from 'react';
import {
  AVAILABILITY_LABELS,
  availabilityIsUsable,
  gradeDisplayLabel,
  GRADE_DEFINITIONS,
  getAvailableAssessments,
  getBlueprints,
  getCurriculumStatus,
  getGrades,
  getModules,
  getSubject,
  getSubjectsForGrade,
  type AssessmentBlueprint,
  type AvailabilityStatus,
  type GradeId,
  type SubjectId,
} from '../curriculum';
import type { Student } from '../types';
import { findOrCreateStudent } from '../lib/storage';
import {
  moduleApprovalRatio,
  useApprovedItems,
  APPROVAL_THRESHOLD,
} from '../lib/itemApprovals';

const STORAGE_KEY = 'pragati.assessment_picker.v1';

type Persisted = {
  gradeId?: GradeId;
  subjectId?: SubjectId;
  blueprintId?: string;
};

function loadPersisted(): Persisted {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function savePersisted(next: Persisted): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // v0.31 — Mirror to the legacy grade key that the module dashboard
    // still reads (`pragati.selected_grade.v1`). The legacy key stores a
    // Grade union token like 'class6' / 'class7'; translate gradeId
    // ('grade_06') accordingly. That way picking a class in the picker
    // also switches the module-dashboard hero to the same class.
    if (next.gradeId) {
      const m = next.gradeId.match(/^grade_(\d{2})$/);
      if (m) {
        const n = Number(m[1]);
        if (n >= 1 && n <= 12) {
          localStorage.setItem('pragati.selected_grade.v1', `class${n}`);
        }
      }
    }
  } catch {
    /* ignore */
  }
}

export function AssessmentPicker({
  student,
  onCancel,
  onStartBlueprint,
}: {
  // Optional — when null the picker shows in "browse the framework" mode
  // (teacher inspection). When provided, the Start button launches an
  // assessment session for that student.
  student: Student | null;
  onCancel: () => void;
  onStartBlueprint: (student: Student, blueprint: AssessmentBlueprint) => void;
}) {
  const persisted = useMemo(() => loadPersisted(), []);
  const [gradeId, setGradeIdState] = useState<GradeId | ''>(
    persisted.gradeId ?? ''
  );
  const [subjectId, setSubjectIdState] = useState<SubjectId | ''>(
    persisted.subjectId ?? ''
  );
  const [blueprintId, setBlueprintIdState] = useState<string>(
    persisted.blueprintId ?? ''
  );
  const [error, setError] = useState<string | null>(null);
  // v0.33 — inline "your name" input when no active student exists.
  // Lets the picker actually launch an assessment for a brand-new
  // student without having to bounce back to StartForm first.
  const [inlineStudentName, setInlineStudentName] = useState('');

  const gradeIds = getGrades();
  const subjectIds = gradeId ? getSubjectsForGrade(gradeId) : [];
  const allAssessments =
    gradeId && subjectId ? getBlueprints(gradeId, subjectId) : [];
  // Kept for symmetry with the query API and documentation. All entries in
  // `allAssessments` include the availability status; consumers filter with
  // `availabilityIsUsable`.
  void getAvailableAssessments;

  const setGradeId = (g: GradeId | '') => {
    setGradeIdState(g);
    setSubjectIdState('');
    setBlueprintIdState('');
    setError(null);
    savePersisted({ gradeId: g || undefined });
  };
  const setSubjectId = (s: SubjectId | '') => {
    setSubjectIdState(s);
    setBlueprintIdState('');
    setError(null);
    savePersisted({ gradeId: gradeId || undefined, subjectId: s || undefined });
  };
  const setBlueprintId = (b: string) => {
    setBlueprintIdState(b);
    setError(null);
    savePersisted({
      gradeId: gradeId || undefined,
      subjectId: subjectId || undefined,
      blueprintId: b || undefined,
    });
  };

  const selectedBlueprint = allAssessments.find((b) => b.id === blueprintId);
  const gradeSubjectStatus: AvailabilityStatus | null =
    gradeId && subjectId ? getCurriculumStatus(gradeId, subjectId) : null;

  // v0.33 — Start is allowed if we have a blueprint AND either a
  // pre-existing student OR the user typed a name in the inline field.
  const canStart =
    !!selectedBlueprint &&
    availabilityIsUsable(selectedBlueprint.availability) &&
    (!!student || inlineStudentName.trim().length > 0);

  const handleStart = () => {
    if (!selectedBlueprint) {
      setError('Pick an assessment first.');
      return;
    }
    if (!availabilityIsUsable(selectedBlueprint.availability)) {
      setError(
        `This assessment is marked "${AVAILABILITY_LABELS[selectedBlueprint.availability]}" and is not available to students.`
      );
      return;
    }
    // v0.33 — no active student on the device: create one inline from
    // the entered name and the picked grade, then start.
    let activeStudent = student;
    if (!activeStudent) {
      const name = inlineStudentName.trim();
      if (!name) {
        setError('Please enter your name to start.');
        return;
      }
      const gradeLabel = gradeId ? gradeDisplayLabel(gradeId) : 'Class 6';
      try {
        activeStudent = findOrCreateStudent(name, gradeLabel);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Could not create a student record. Please try again.'
        );
        return;
      }
    }
    onStartBlueprint(activeStudent, selectedBlueprint);
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

      <header className="rounded-3xl bg-gradient-to-br from-brand-50 via-white to-slate-50 p-6 ring-1 ring-slate-200 sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
          Pragati · assessment picker
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Choose an assessment
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Pragati covers Classes 1–12. Only Class 6 Mathematics is
          "available" (reviewed baseline); every other grade is
          <em> teacher review required</em> prototype content —
          usable but needs a teacher to walk the bank before pilot use.
        </p>
      </header>

      {/* Step 1 — Grade */}
      <section className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Step 1 · Class
        </h2>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {gradeIds.map((g) => {
            const grade = GRADE_DEFINITIONS[g];
            const subjects = getSubjectsForGrade(g);
            const hasContent = subjects.length > 0;
            const selected = g === gradeId;
            return (
              <button
                key={g}
                onClick={() => setGradeId(g)}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                  selected
                    ? 'border-brand-500 bg-brand-50'
                    : hasContent
                      ? 'border-slate-200 bg-white hover:border-brand-300'
                      : 'border-slate-200 bg-slate-50 opacity-70'
                }`}
              >
                <span className="text-sm font-semibold text-slate-900">
                  {gradeDisplayLabel(g)}
                </span>
                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${
                    hasContent
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : 'bg-slate-100 text-slate-600 ring-slate-200'
                  }`}
                >
                  {hasContent ? 'Content available' : 'Framework being prepared'}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
                  {grade.stage.replace('_', ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2 — Subject */}
      {gradeId && (
        <section className="card space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Step 2 · Subject
          </h2>
          {subjectIds.length === 0 ? (
            <p className="text-sm text-slate-600">
              No subjects are registered for {gradeDisplayLabel(gradeId)}{' '}
              yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjectIds.map((s) => {
                const subject = getSubject(s);
                const selected = s === subjectId;
                const status = getCurriculumStatus(gradeId, s);
                return (
                  <button
                    key={s}
                    onClick={() => setSubjectId(s)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? 'border-brand-500 bg-brand-50 text-brand-800'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-brand-300'
                    }`}
                  >
                    {subject?.displayLabel ?? s}
                    <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
                      {AVAILABILITY_LABELS[status]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Step 3 — Assessment */}
      {gradeId && subjectId && (
        <section className="card space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Step 3 · Assessment
          </h2>
          {allAssessments.length === 0 ? (
            <p className="text-sm text-slate-600">
              No assessments are registered for {gradeDisplayLabel(gradeId)}{' '}
              — {subjectId}. Coverage:{' '}
              {getModules(gradeId, subjectId).length} module(s).
            </p>
          ) : (
            <div className="space-y-2">
              {allAssessments.map((b) => {
                const usable = availabilityIsUsable(b.availability);
                const selected = b.id === blueprintId;
                return (
                  <label
                    key={b.id}
                    className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                      selected
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 bg-white hover:border-brand-300'
                    } ${!usable ? 'opacity-70' : ''}`}
                  >
                    <input
                      type="radio"
                      name="assessment-blueprint"
                      value={b.id}
                      checked={selected}
                      onChange={() => setBlueprintId(b.id)}
                      disabled={!usable}
                      className="mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {b.title}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${
                            b.availability === 'available'
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                              : 'bg-amber-50 text-amber-800 ring-amber-200'
                          }`}
                        >
                          {AVAILABILITY_LABELS[b.availability]}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {b.description}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {b.minItems}–{b.maxItems} items · purpose: {b.purpose} · version {b.version}
                      </p>
                      {/* v0.43 — teacher-approval rollup for the blueprint's modules. */}
                      <BlueprintApprovalHint blueprint={b} />
                    </div>
                  </label>
                );
              })}
            </div>
          )}
          {gradeSubjectStatus === 'framework_only' && (
            <p className="text-xs text-slate-600">
              This grade/subject is a framework shell — no content has been
              authored yet.
            </p>
          )}
        </section>
      )}

      {/* Start */}
      {selectedBlueprint && (
        <section className="card space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Step 4 · Start
          </h2>
          {!student && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <label className="block text-xs font-semibold text-slate-700">
                Your name
              </label>
              <input
                value={inlineStudentName}
                onChange={(e) => {
                  setInlineStudentName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Aarav Sharma"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <p className="mt-2 text-[11px] text-slate-500">
                Enter a name to create a local student record and start
                the assessment. All data stays on this device.
              </p>
            </div>
          )}
          {error && (
            <p className="text-sm font-semibold text-rose-700">{error}</p>
          )}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm ${
              canStart
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'cursor-not-allowed bg-slate-200 text-slate-500'
            }`}
          >
            {student
              ? `Start "${selectedBlueprint.title}" for ${student.name} →`
              : `Start "${selectedBlueprint.title}" →`}
          </button>
        </section>
      )}
    </div>
  );
}

// v0.43 — Shows a mini progress bar per blueprint summarising how many
// of its modules' items have been teacher-approved. Once ≥ 75% of
// items across the blueprint's modules are approved, the availability
// upgrades from teacher_review_required to available (see itemApprovals).
function BlueprintApprovalHint({ blueprint }: { blueprint: AssessmentBlueprint }) {
  // Re-render when any approval toggles.
  useApprovedItems();
  const moduleIds = blueprint.moduleIds ?? [];
  if (moduleIds.length === 0) return null;
  let approved = 0;
  let total = 0;
  for (const mid of moduleIds) {
    const r = moduleApprovalRatio(mid);
    approved += r.approvedCount;
    total += r.totalCount;
  }
  if (total === 0) return null;
  const pct = Math.round((approved / total) * 100);
  const at = approved / total >= APPROVAL_THRESHOLD;
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
        <span>Teacher approval</span>
        <span className={at ? 'text-emerald-700' : 'text-slate-500'}>
          {approved}/{total} approved ({pct}%)
          {at && ' — upgrades to available'}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all ${
            at ? 'bg-emerald-500' : 'bg-brand-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
