// v0.21: lightweight teacher view for sessions imported via classroom
// access codes. v0.22 adds:
//   - filter by review status (unreviewed / reviewed / all)
//   - "new since last import" highlight on each row
//   - mark-reviewed button (per row) with localStorage persistence
//   - roster-match status badge (linked / pending) per row

import { useMemo, useState } from 'react';
import { MISCONCEPTION_LABELS } from '../data/items';
import {
  loadAssignments,
  loadSessions,
  loadStudents,
} from '../lib/storage';
import {
  loadReviewedImports,
  loadTeacherImportStatus,
  markImportReviewed,
} from '../lib/accessCodes';
import { correctCount, summarizeMisconceptions } from '../lib/scoring';
import { SKILL_MODE_LABELS } from '../types';
import { formatDate } from '../lib/format';

type ReviewFilter = 'unreviewed' | 'reviewed' | 'all';

export function ImportedSubmissionsView({
  onBack,
  onOpenStudent,
}: {
  onBack: () => void;
  onOpenStudent: (studentId: string) => void;
}) {
  const [codeFilter, setCodeFilter] = useState<string>('all');
  const [studentQuery, setStudentQuery] = useState<string>('');
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('unreviewed');
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((n) => n + 1);

  const importStatus = useMemo(() => loadTeacherImportStatus(), [version]);
  const lastImportedAt = importStatus?.lastImportedAt ?? 0;
  const reviewedMap = useMemo(() => loadReviewedImports(), [version]);
  const studentIdsInRoster = useMemo(
    () => new Set(loadStudents().map((s) => s.id)),
    [version]
  );
  const studentNameById = useMemo(
    () => new Map(loadStudents().map((s) => [s.id, s.name])),
    [version]
  );
  const assignmentTitleById = useMemo(
    () => new Map(loadAssignments().map((a) => [a.id, a.title])),
    [version]
  );

  const importedRows = useMemo(() => {
    const all = loadSessions().filter(
      (s) => typeof s.importedFromCode === 'string' && s.completedAt !== null
    );
    return all
      .map((s) => {
        const correct = correctCount(s.responses);
        const acc =
          s.responses.length === 0 ? 0 : correct / s.responses.length;
        const misc = summarizeMisconceptions(s.responses).slice(0, 2);
        const linkedToRoster = studentIdsInRoster.has(s.studentId);
        const reviewedAt = reviewedMap[s.id] ?? null;
        const importedAt = s.importedAt ?? 0;
        return {
          sessionId: s.id,
          studentId: s.studentId,
          studentName:
            studentNameById.get(s.studentId) ??
            s.studentSnapshot.name ??
            'Student',
          assignmentTitle:
            (s.assignmentId && assignmentTitleById.get(s.assignmentId)) ??
            '(deleted assignment)',
          skillMode: s.skillId,
          completedAt: s.completedAt ?? 0,
          importedAt,
          importedFromCode: s.importedFromCode ?? '',
          accuracy: acc,
          attempted: s.responses.length,
          topMisconceptions: misc,
          linkedToRoster,
          reviewedAt,
          newSinceLastImport:
            lastImportedAt > 0 && importedAt > 0 && importedAt >= lastImportedAt - 1500,
        };
      })
      .sort((a, b) => b.completedAt - a.completedAt);
  }, [studentNameById, assignmentTitleById, studentIdsInRoster, reviewedMap, lastImportedAt]);

  const allCodes = useMemo(() => {
    const set = new Set<string>();
    for (const r of importedRows) set.add(r.importedFromCode);
    return Array.from(set).sort();
  }, [importedRows]);

  const filteredRows = useMemo(() => {
    let rows = importedRows;
    if (codeFilter !== 'all') {
      rows = rows.filter((r) => r.importedFromCode === codeFilter);
    }
    if (reviewFilter !== 'all') {
      rows = rows.filter((r) =>
        reviewFilter === 'reviewed'
          ? r.reviewedAt !== null
          : r.reviewedAt === null
      );
    }
    const q = studentQuery.trim().toLowerCase();
    if (q) rows = rows.filter((r) => r.studentName.toLowerCase().includes(q));
    return rows;
  }, [importedRows, codeFilter, studentQuery, reviewFilter]);

  const totalImported = importedRows.length;
  const unreviewed = importedRows.filter((r) => r.reviewedAt === null).length;
  const reviewedCount = totalImported - unreviewed;
  const newCount = importedRows.filter((r) => r.newSinceLastImport).length;
  const duplicatesSkipped = importStatus?.lastSummary?.skippedDuplicates ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to teacher home
        </button>
      </div>

      <header className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wide text-brand-700">
          Teacher · Imported submissions
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Sessions imported from classroom codes
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          One row per session that arrived through{' '}
          <code className="font-mono text-xs">accessCodes/&#123;code&#125;/submissions</code>.
          Each row is linked to a teacher-side student record by display
          name. Click a row to open the standard student detail view.
          {importStatus && (
            <>
              {' '}
              Last import {new Date(importStatus.lastImportedAt).toLocaleString()}
              .
            </>
          )}
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <CountTile label="Total imported" value={totalImported} />
        <CountTile label="New since last import" value={newCount} tone={newCount > 0 ? 'brand' : 'slate'} />
        <CountTile label="Unreviewed" value={unreviewed} tone={unreviewed > 0 ? 'amber' : 'slate'} />
        <CountTile label="Duplicates skipped (last run)" value={duplicatesSkipped} />
      </div>

      <div className="card">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="block font-semibold text-slate-700">Review status</span>
            <select
              value={reviewFilter}
              onChange={(e) => setReviewFilter(e.target.value as ReviewFilter)}
              className="mt-1 w-44 rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="unreviewed">Unreviewed ({unreviewed})</option>
              <option value="reviewed">Reviewed ({reviewedCount})</option>
              <option value="all">All ({totalImported})</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="block font-semibold text-slate-700">Classroom code</span>
            <select
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
              className="mt-1 w-44 rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="all">All codes</option>
              {allCodes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block font-semibold text-slate-700">Search student</span>
            <input
              value={studentQuery}
              onChange={(e) => setStudentQuery(e.target.value)}
              placeholder="Name"
              className="mt-1 w-56 rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <div className="ml-auto text-xs text-slate-500">
            {filteredRows.length} of {totalImported} imported session{totalImported === 1 ? '' : 's'}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Assignment</th>
                <th className="px-3 py-2">Skill mode</th>
                <th className="px-3 py-2">Accuracy</th>
                <th className="px-3 py-2">Top misconceptions</th>
                <th className="px-3 py-2">Completed</th>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-xs italic text-slate-500">
                    {reviewFilter === 'unreviewed' && totalImported > 0
                      ? 'No unreviewed sessions match this filter. Switch to "All" to see reviewed sessions.'
                      : 'No imported sessions match this filter. Imports happen on every sync — try clicking "Import submissions now" from the teacher home or Classrooms view.'}
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <tr
                    key={r.sessionId}
                    className={`hover:bg-slate-50 ${r.newSinceLastImport ? 'bg-brand-50/40' : ''}`}
                  >
                    <td
                      className="cursor-pointer px-3 py-2 font-semibold text-slate-800"
                      onClick={() => onOpenStudent(r.studentId)}
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span>{r.studentName}</span>
                        {r.newSinceLastImport && (
                          <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-700 ring-1 ring-brand-200">
                            New
                          </span>
                        )}
                        <RosterBadge linked={r.linkedToRoster} />
                      </div>
                    </td>
                    <td
                      className="cursor-pointer px-3 py-2 text-slate-700"
                      onClick={() => onOpenStudent(r.studentId)}
                    >
                      {r.assignmentTitle}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">
                      {SKILL_MODE_LABELS[r.skillMode] ?? r.skillMode}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
                          r.accuracy >= 0.7
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : r.accuracy >= 0.5
                              ? 'bg-amber-50 text-amber-700 ring-amber-200'
                              : 'bg-rose-50 text-rose-700 ring-rose-200'
                        }`}
                      >
                        {Math.round(r.accuracy * 100)}%
                      </span>
                      <span className="ml-2 text-[11px] text-slate-500">
                        ({r.attempted} items)
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">
                      {r.topMisconceptions.length === 0
                        ? '—'
                        : r.topMisconceptions
                            .map((m) => `${MISCONCEPTION_LABELS[m.code]} ×${m.count}`)
                            .join('; ')}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">{formatDate(r.completedAt)}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-600">{r.importedFromCode}</td>
                    <td className="px-3 py-2">
                      {r.reviewedAt === null ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markImportReviewed(r.sessionId, true);
                            bump();
                          }}
                          className="rounded-lg bg-brand-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
                        >
                          Mark reviewed
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 ring-1 ring-emerald-200">
                            Reviewed
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markImportReviewed(r.sessionId, false);
                              bump();
                            }}
                            className="text-[10px] font-semibold text-slate-500 underline hover:text-slate-700"
                          >
                            Undo
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
        Pre-pilot prototype. Imported sessions inherit the
        <code className="ml-1 font-mono">window: 'practice'</code> field for
        backwards compatibility; treat per-classroom growth signals as
        directional only until a real pilot study is run. The "Reviewed"
        flag is a per-device acknowledgement (saved in localStorage) — it
        is not sent back to the student device.
      </section>
    </div>
  );
}

function CountTile({
  label,
  value,
  tone = 'slate',
}: {
  label: string;
  value: number;
  tone?: 'slate' | 'amber' | 'brand';
}) {
  const tones: Record<string, string> = {
    slate: 'text-slate-900',
    amber: 'text-amber-700',
    brand: 'text-brand-700',
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}

function RosterBadge({ linked }: { linked: boolean }) {
  return linked ? (
    <span
      className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200"
      title="Linked to a teacher-side student record."
    >
      Linked
    </span>
  ) : (
    <span
      className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200"
      title="Not linked to a teacher-side student record yet — will resolve on next import or roster edit."
    >
      Pending
    </span>
  );
}
