import { useMemo, useState } from 'react';
import { ITEMS } from '../data/items';
import {
  buildClassAggregate,
  filterFromValue,
  type ClassAggregate,
  type ClassHardestItem,
  type ClassMisconceptionRow,
} from '../lib/classDashboard';
import { loadSessions, loadStudents } from '../lib/storage';
import {
  MODULE_IDS_ORDERED,
  MODULE_LABELS,
  SKILLS_BY_MODULE,
  SKILL_LABELS,
} from '../types';
import { Field } from './common/Field';

// Class-level dashboard. Aggregates across every completed session on
// this device with a per-skill / per-module filter. Extracted from App.tsx
// in v0.14. Behavior unchanged.
export function ClassDashboardView({
  onBack,
  onOpenStudent,
}: {
  onBack: () => void;
  onOpenStudent: (studentId: string) => void;
}) {
  const [filterValue, setFilterValue] = useState<string>('all');
  const skillFilter = useMemo(
    () => filterFromValue(filterValue),
    [filterValue]
  );

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
            for spotting which misconceptions and which items are tripping
            the class as a whole — not a substitute for the per-student view.
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
                  <option value={`module:${m}`}>All {MODULE_LABELS[m]}</option>
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
              Showing responses for{' '}
              <span className="font-medium">{filterLabel}</span>. Mixed
              sessions are included but filtered.
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
        on a 374-item bank across 34 skills. Sample sizes can be very small
        in a pilot — read the attempt counts before drawing conclusions.
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
          const widthPct = Math.max(
            6,
            Math.round((row.occurrences / maxOcc) * 100)
          );
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
                  {row.occurrences === 1 ? '' : 's'} · {row.studentCount}{' '}
                  student{row.studentCount === 1 ? '' : 's'}
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
