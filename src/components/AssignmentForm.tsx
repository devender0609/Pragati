import { useMemo, useState } from 'react';
import {
  generateId,
  getActivePilot,
  loadAssignments,
  saveAssignment,
} from '../lib/storage';
import { loadClassrooms } from '../lib/classroomStore';
import { publishAssignmentChange } from '../lib/accessCodes';
import {
  ASSIGNMENT_SIZES,
  ASSIGNMENT_TARGET_LABELS,
  SKILL_MODE_DESCRIPTIONS,
  SKILL_MODE_LABELS,
  type AssessmentAssignment,
  type AssignmentSize,
  type AssignmentTargetKind,
  type SkillMode,
} from '../types';

// Assignment create / edit form (v0.11; target picker added v0.12).
// Extracted from App.tsx in v0.13 — same field layout, same defaults,
// same Save validation.
export function AssignmentForm({
  assignmentId,
  onCancel,
  onSaved,
}: {
  assignmentId: string | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const existing = assignmentId
    ? loadAssignments().find((a) => a.id === assignmentId) ?? null
    : null;
  const activePilot = getActivePilot();

  const [title, setTitle] = useState(existing?.title ?? 'Class 6 Math check');
  const [skillMode, setSkillMode] = useState<SkillMode>(
    existing?.skillMode ?? 'mixed'
  );
  const [itemCount, setItemCount] = useState<AssignmentSize>(
    existing?.itemCount ?? 10
  );
  const [teacherNote, setTeacherNote] = useState(
    existing?.teacherNote ?? 'Take your time and show your best thinking.'
  );
  const [pilotModeOn, setPilotModeOn] = useState(
    existing?.pilotModeOn ?? Boolean(activePilot)
  );
  const [targetKind, setTargetKind] = useState<AssignmentTargetKind>(
    existing?.target?.kind ?? 'class'
  );
  const [targetLabel, setTargetLabel] = useState<string>(
    existing?.target?.label ?? ''
  );
  // v0.19 additions
  const [kind, setKind] = useState<'assessment' | 'practice'>(existing?.kind ?? 'assessment');
  const [dueDate, setDueDate] = useState<string>(
    existing?.dueDateMs ? new Date(existing.dueDateMs).toISOString().slice(0, 10) : ''
  );
  const [classroomId, setClassroomId] = useState<string>(existing?.classroomId ?? '');
  const classrooms = useMemo(() => loadClassrooms().filter((c) => !c.archived), []);

  const skillOptions = Object.keys(SKILL_MODE_LABELS) as SkillMode[];

  const handleSave = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      window.alert('Please add a student-facing title.');
      return;
    }

    const dueDateMs = dueDate ? new Date(dueDate + 'T23:59:59').getTime() : undefined;
    const assignment: AssessmentAssignment = {
      id: existing?.id ?? generateId(),
      createdAt: existing?.createdAt ?? Date.now(),
      skillMode,
      itemCount,
      ...(pilotModeOn && activePilot ? { pilotId: activePilot.id } : {}),
      pilotModeOn,
      title: cleanTitle,
      teacherNote: teacherNote.trim(),
      active: existing?.active ?? true,
      target: {
        kind: targetKind,
        label: targetKind === 'class' ? '' : targetLabel.trim(),
      },
      kind,
      ...(classroomId ? { classroomId } : {}),
      ...(Number.isFinite(dueDateMs) ? { dueDateMs } : {}),
    };
    saveAssignment(assignment);
    // v0.20: when the assignment is bound to a classroom that has an
    // access code, re-publish the safe summary mirror so student devices
    // (which read the code doc without auth) pick up the change.
    // v0.23: surface a friendly warning when the bound classroom's code
    // is revoked — the publish refuses with reason: 'code_revoked'.
    void (async () => {
      const res = await publishAssignmentChange(assignment);
      if (res && res.ok === false && res.reason === 'code_revoked') {
        window.alert(
          `Assignment saved, but its classroom code is revoked. Students will NOT see this assignment until you generate a new code from the Classrooms view.`
        );
      }
    })();
    onSaved();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <button
          onClick={onCancel}
          className="text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          ← Back to assignments
        </button>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          {existing ? 'Edit assignment' : 'Create assignment'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          This creates a clear assessment card on the student home. It does
          not send anything online; data stays in localStorage.
        </p>
      </div>

      <div className="card space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Student-facing title
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="e.g., Wednesday fractions check"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Assessment focus
          </span>
          <select
            value={skillMode}
            onChange={(e) => setSkillMode(e.target.value as SkillMode)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {skillOptions.map((mode) => (
              <option key={mode} value={mode}>
                {SKILL_MODE_LABELS[mode]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            {SKILL_MODE_DESCRIPTIONS[skillMode]}
          </p>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Target item count
          </span>
          <select
            value={itemCount}
            onChange={(e) =>
              setItemCount(Number(e.target.value) as AssignmentSize)
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {ASSIGNMENT_SIZES.map((n) => (
              <option key={n} value={n}>
                {n} items
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Prototype note: the adaptive engine still uses its current stop
            rule; this value is shown as teacher intent.
          </p>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Teacher note
          </span>
          <textarea
            value={teacherNote}
            onChange={(e) => setTeacherNote(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <fieldset className="rounded-xl border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-700">
            Who is this assignment for?
          </legend>
          <p className="mt-1 text-xs text-slate-500">
            Plain text only — no login or accounts. Students see this label on
            their assignment card so they know whether it is meant for them.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(Object.keys(ASSIGNMENT_TARGET_LABELS) as AssignmentTargetKind[]).map(
              (kind) => (
                <label
                  key={kind}
                  className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-sm ${
                    targetKind === kind
                      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="assignment-target-kind"
                    value={kind}
                    checked={targetKind === kind}
                    onChange={() => setTargetKind(kind)}
                    className="mt-1"
                  />
                  <span className="font-semibold text-slate-800">
                    {ASSIGNMENT_TARGET_LABELS[kind]}
                  </span>
                </label>
              )
            )}
          </div>
          {targetKind !== 'class' && (
            <label className="mt-3 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {targetKind === 'group' ? 'Group name' : 'Student name'}
              </span>
              <input
                value={targetLabel}
                onChange={(e) => setTargetLabel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder={
                  targetKind === 'group'
                    ? 'e.g., Reading Stars or Group A'
                    : 'e.g., Aarav Sharma'
                }
              />
              <p className="mt-1 text-xs text-slate-500">
                Optional. Leave blank if you will tell students verbally.
              </p>
            </label>
          )}
        </fieldset>

        <label className="flex items-start gap-3 rounded-xl bg-pink-50 p-3 ring-1 ring-pink-200">
          <input
            type="checkbox"
            checked={pilotModeOn}
            onChange={(e) => setPilotModeOn(e.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-semibold text-pink-800">
              Tag sessions with active pilot
            </span>
            <span className="block text-xs leading-relaxed text-pink-700">
              {activePilot
                ? `Active pilot: ${activePilot.className} (${activePilot.teacherName})`
                : 'No active pilot is currently selected. You can still save the assignment, but no pilot id will be attached.'}
            </span>
          </span>
        </label>

        {/* v0.19 polish: kind, due date, classroom binding */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Assignment kind</span>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as 'assessment' | 'practice')}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="assessment">Assessment</option>
              <option value="practice">Practice (low-stakes)</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Practice sessions are still recorded, but flagged as low-stakes in the export.
            </p>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Due date (optional)</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <p className="mt-1 text-xs text-slate-500">Leave blank for no due date.</p>
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Classroom (optional)</span>
          <select
            value={classroomId}
            onChange={(e) => setClassroomId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">— No classroom binding —</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            When set, students who joined this classroom via an access code see this assignment on their home page.
          </p>
        </label>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            onClick={onCancel}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Save assignment
          </button>
        </div>
      </div>
    </div>
  );
}
