// v0.69 §16/§17 — THE MANUAL CURRICULUM VERIFICATION SCREEN.
//
// Seven grades have an unknown official chapter list because
// ncert.nic.in disallows automated access, and v0.68's remedy was a
// prose note saying "edit the TypeScript". That made curriculum
// verification a developer task, which is backwards: reading a contents
// page is a five-minute job for a teacher.
//
// This screen gives them a template to fill in and a validator that
// tells them precisely what is wrong before anything is accepted.
//
// WHAT IT DELIBERATELY DOES NOT DO
//
// It does not write to the registry. A validated submission is shown as
// the exact record it would create, for a human to commit — because a
// curriculum verified by a paste into a browser, stored in
// localStorage, is not auditable and would be the weakest link in a
// system built entirely around auditable evidence.
//
// Admin-only. This is governance density and §14 keeps it away from
// teachers.

import { useState } from 'react';
import {
  gradesPendingVerification,
  officialCurriculumForGrade,
} from '../../curriculum/officialCurriculum';
import {
  parseSubmission,
  submissionToCurriculum,
  generateRegistryPatch,
  templateJson,
  type ImportIssue,
} from '../../curriculum/manualCurriculumImport';
import type { Grade } from '../../types';

function IssueList({ issues }: { issues: ImportIssue[] }) {
  if (issues.length === 0) return null;
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  return (
    <div className="mt-3 space-y-2">
      {errors.length > 0 && (
        <div className="rounded-xl2 border border-rose-300 bg-rose-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-rose-800">
            {errors.length} {errors.length === 1 ? 'problem' : 'problems'} — nothing imported
          </p>
          <ul className="mt-1.5 space-y-1">
            {errors.map((e, i) => (
              <li key={i} className="text-sm text-rose-900">
                <span className="font-mono text-xs text-rose-700">{e.field}</span>{' '}
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="surface-attend">
          <p className="text-xs font-bold uppercase tracking-wide text-attend-800">
            Worth checking
          </p>
          <ul className="mt-1.5 space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="text-sm text-attend-900">
                {w.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function CurriculumVerificationPanel() {
  const pending = gradesPendingVerification();
  const [grade, setGrade] = useState<Grade>(pending[0]?.grade ?? 'class1');
  const [raw, setRaw] = useState('');
  const [result, setResult] = useState<{
    issues: ImportIssue[];
    preview: ReturnType<typeof submissionToCurriculum>;
    patch: ReturnType<typeof generateRegistryPatch>;
  } | null>(null);

  const record = officialCurriculumForGrade(grade);

  const check = () => {
    const parsed = parseSubmission(raw);
    setResult({
      issues: parsed.issues,
      preview: parsed.submission ? submissionToCurriculum(parsed.submission) : null,
      patch: parsed.submission ? generateRegistryPatch(parsed.submission) : null,
    });
  };

  return (
    <section className="space-y-4">
      <header>
        <h2 className="font-display text-base font-bold text-slate-900">
          Verify a curriculum from its textbook
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {pending.length} of 12 classes have no verified chapter list, because
          NCERT's site refuses automated access. Reading the Contents page by
          hand is the only honest route, and this is where the result goes.
        </p>
      </header>

      <div>
        <label
          htmlFor="verify-grade"
          className="block text-sm font-semibold text-slate-700"
        >
          Class
        </label>
        <select
          id="verify-grade"
          value={grade}
          onChange={(e) => {
            setGrade(e.target.value as Grade);
            setResult(null);
          }}
          className="tap mt-1 w-full rounded-lg border border-slate-300 px-3 text-sm"
        >
          {pending.map((c) => (
            <option key={c.grade} value={c.grade}>
              {c.grade.replace('class', 'Class ')} — {c.documentTitle ?? 'book not established'}
            </option>
          ))}
        </select>
      </div>

      {record && (
        <div className="rounded-xl2 border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            What to open
          </p>
          <p className="mt-1 text-sm text-slate-800">
            {record.documentTitle ?? 'No book has been established for this class.'}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            {record.manualVerificationStep}
          </p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="verify-json"
            className="block text-sm font-semibold text-slate-700"
          >
            Paste the filled-in template
          </label>
          <button
            type="button"
            onClick={() => setRaw(templateJson(grade))}
            className="tap rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700"
          >
            Insert blank template
          </button>
        </div>
        <textarea
          id="verify-json"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={12}
          spellCheck={false}
          className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs"
          placeholder='{ "grade": "class7", "officialBookTitle": "...", "chapters": [ ... ] }'
        />
        <button
          type="button"
          onClick={check}
          disabled={raw.trim() === ''}
          className="tap mt-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-40"
        >
          Check this submission
        </button>
      </div>

      {result && <IssueList issues={result.issues} />}

      {result?.preview && (
        <div className="rounded-xl2 border border-correct-300 bg-correct-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-correct-800">
            Valid — {result.preview.units.length} chapters
          </p>
          <p className="mt-1 text-sm text-correct-900">
            {result.preview.evidenceNote}
          </p>
          <ol className="mt-2 space-y-0.5">
            {result.preview.units.map((u) => (
              <li key={u.officialUnitId} className="text-sm text-slate-800">
                <span className="mr-1.5 font-semibold text-slate-500">
                  {u.number}.
                </span>
                {u.title}
                {u.topicsKnown ? (
                  <span className="ml-1.5 text-xs text-slate-500">
                    ({u.topics.length} sections)
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded-lg bg-white/70 p-2.5 text-xs leading-relaxed text-slate-600">
            This is what the registry would hold. It has NOT been saved.
            Curriculum evidence is committed to the repository so a second
            person can check it against the book — a verification that lived
            only in this browser would be the weakest link in a system built
            on auditable evidence.
          </p>
        </div>
      )}

      {/* v0.70 §24 — the last mile. v0.69 stopped at "validated, not
          saved", which was right about safety and left the commit step
          unspecified. The file below is deterministic: the same
          submission always produces identical bytes, so two people
          entering the same book produce the same file and a genuine
          disagreement shows up as a diff. */}
      {result?.patch && (
        <div className="rounded-xl2 border border-slate-300 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Commit this file
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Save the text below as{' '}
            <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">
              {result.patch.path}
            </code>{' '}
            and open it for review. A second person must confirm the chapter
            count and every title against the same book before it is merged —
            verification by one person is a claim; by two it is evidence.
          </p>
          <textarea
            readOnly
            value={result.patch.contents}
            rows={14}
            spellCheck={false}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-2 font-mono text-[0.7rem]"
          />
        </div>
      )}
    </section>
  );
}
