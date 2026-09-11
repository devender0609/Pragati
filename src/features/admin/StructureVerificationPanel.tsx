// v0.74 §20/§21 — THE BLOCKER THAT MUST NOT BE FORGETTABLE.
//
// The content backlog is a generator over VERIFIED records, so seven
// grades contribute nothing to it. A reader seeing "89 official records
// need work" on a page titled Classes 1-12 will reasonably read 89 as
// the Classes 1-12 workload. It is the workload currently KNOWABLE.
//
// This panel sits beside the content plan and says so, in the same
// visual weight, because a caveat in small grey text under a big number
// is not a caveat. It is styled as a blocker rather than a note: the
// work is real, it is unstarted, and no release can do it.

import { useState } from 'react';
import {
  structureVerificationBacklog,
  structureVerificationSummary,
} from '../../curriculum/structureVerificationBacklog';

export function StructureVerificationPanel() {
  const summary = structureVerificationSummary();
  const entries = structureVerificationBacklog();
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="font-display text-base font-bold text-slate-900">
          Structure verification backlog
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Human evidence work, not instructional content work. These two
          backlogs must never be added together.
        </p>
      </header>

      <div className="rounded-xl2 border-2 border-attend-300 bg-attend-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-attend-800">
          Grades still requiring primary textbook verification
        </p>
        <p className="mt-1.5 text-2xl font-bold text-attend-900">
          {summary.gradesUnverified} of 12
        </p>
        <p className="mt-1 text-sm font-semibold text-attend-900">
          {summary.gradeLabels.join(' · ')}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-attend-900">
          These grades produce no content-backlog entries because their
          official structure is unknown — not because they are complete. How
          many official records they contain is{' '}
          <strong>Unknown</strong>, and rendering that as zero would make more
          than half of Classes 1&ndash;12 look finished.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="tap rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700"
      >
        {open ? 'Hide' : 'Show'} what each grade needs
      </button>

      {open && (
        <ol className="space-y-2">
          {entries.map((e) => (
            <li
              key={e.grade}
              className="rounded-xl2 border border-slate-200 bg-white p-3"
            >
              <p className="text-sm font-semibold text-slate-900">
                {e.gradeLabel}
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">
                  {e.stageLabel}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">OPEN</span>{' '}
                {e.documentToInspect}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">RECORD INTO</span>{' '}
                <code className="rounded bg-slate-100 px-1">{e.templatePath}</code>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-attend-800">PERSON</span>{' '}
                {e.action}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {e.whyNotEngineering}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
