// v0.49 §12 — extracted from App.tsx.
//
// Behaviour is unchanged; only the file boundary moved. These are the
// teacher roster + export screens, still reachable from teacher preview
// and first-run compatibility paths. The canonical student journey is
// StudentRouteOutlet + StudentShell.

import { useMemo, useState } from 'react';
import { ITEMS } from '../../data/items';
import { SKILL_ALIGNMENT, buildItemAlignments } from '../../data/alignment';
import { buildItemQualitySummary } from '../../lib/itemQuality';
import { buildTeachingPlan } from '../../lib/teachingPlan';
import { computeBand } from '../../lib/scoring';
import { formatDate } from '../../lib/format';
import {
  buildExportBundle,
  exportAllAsJSON,
  loadItemReviews,
  loadSessions,
  loadStudents,
} from '../../lib/storage';
import {
  ASSESSMENT_WINDOWS,
  ASSESSMENT_WINDOW_LABELS,
  type AssessmentWindow,
} from '../../types';
import { SkillChip } from '../../components/common/SkillChip';
import { BandPill } from '../../components/common/BandPill';
import { Field } from '../../components/common/Field';

export function TeacherStudentList({
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
    // Snapshot the current teaching plan + item quality flags + alignment
    // metadata so the exported JSON matches what's on screen right now.
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
    const alignmentBySkill = SKILL_ALIGNMENT;
    const alignmentByItem = buildItemAlignments(ITEMS);
    const json = exportAllAsJSON({
      teachingPlanSummary,
      itemQualityFlags,
      alignmentBySkill,
      alignmentByItem,
    });
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

// (BandPill extracted to src/components/common/BandPill.tsx in v0.14.)


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
