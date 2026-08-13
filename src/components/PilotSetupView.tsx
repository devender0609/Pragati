import { useMemo, useState } from 'react';
import {
  endActivePilot,
  generateId,
  getActivePilot,
  loadPilots,
  savePilot,
} from '../lib/storage';
import {
  MODULE_IDS_ORDERED,
  MODULE_LABELS,
  SKILLS_BY_MODULE,
  SKILL_MODE_LABELS,
  type PilotMetadata,
  type SkillMode,
} from '../types';
import { formatDate } from '../lib/format';
import { SkillChip } from './common/SkillChip';

// Pilot setup view (v0.8). Extracted from App.tsx in v0.13. Behavior
// unchanged — same form fields, same start / update / end semantics, same
// pilot archive rendering.
export function PilotSetupView({
  onBack,
  onSaved,
}: {
  onBack: () => void;
  onSaved: () => void;
}) {
  const active = useMemo(() => getActivePilot(), []);
  const archive = useMemo(
    () =>
      loadPilots()
        .filter((p) => !p.active)
        .sort((a, b) => b.createdAt - a.createdAt),
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

// Local Field copy. Kept private to this view in v0.13 to avoid creating a
// public Field component that would conflict with the inline Field still
// used by StartForm in App.tsx.
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
