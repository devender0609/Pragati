// v0.68 (Classes 1–12 spec, §F) — OFFICIAL CURRICULUM vs PRAGATI
// COVERAGE, FOR TEACHERS.
//
// The two numbers a teacher needs are the two this table refuses to
// merge: how many units the official curriculum has, and how many
// Pragati can actually take off their hands.
//
// NO PERCENTAGES. §F is explicit, and the reason is that for seven of
// twelve grades the denominator is unknown, so any percentage would be
// computed against Pragati's own inventory and would report 100%
// coverage of a curriculum nobody has read.
//
// "Unknown" is rendered as the word, never as 0 or a dash that reads
// like zero.

import {
  auditAllGrades,
  completenessHeadline,
  MISMATCH_REASON_TEXT,
} from '../../curriculum/curriculumCompletenessAudit';
import { coverageForGrade } from '../../curriculum/coverageMatrix';

function Count({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
        Unknown
      </span>
    );
  }
  return <span>{value}</span>;
}

export function CurriculumCompletenessForTeachers() {
  const rows = auditAllGrades();
  const headline = completenessHeadline();

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-base font-semibold text-slate-900">
          Mathematics curriculum coverage, Classes 1–12
        </h2>
        <p className="mt-1 text-sm text-slate-600">{headline.sentence}</p>
        <p className="mt-1 text-xs text-slate-500">
          The official curriculum and what Pragati has built are separate
          numbers. A chapter with no Pragati content still appears in the
          official list — that is what makes the gap visible.
        </p>
        {/* v0.69 §19/§20 — the distinction the v0.68 table collapsed. */}
        <p className="mt-1 text-xs text-slate-500">
          Units, chapters and topics are three different things and are
          counted separately. Classes 9–12 follow a CBSE syllabus organised
          into <span className="font-medium">units</span>; Classes 1–8 follow
          an NCERT textbook organised into{' '}
          <span className="font-medium">chapters</span>. A dash means the
          level does not apply; "Unknown" means nobody has read it yet.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-600">
            <tr>
              <th className="py-2">Class</th>
              <th className="py-2">Current source</th>
              <th className="py-2 text-right">Units</th>
              <th className="py-2 text-right">Chapters</th>
              <th className="py-2 text-right">Topics</th>
              <th className="py-2 text-right">In Pragati</th>
              <th className="py-2 text-right">Learn</th>
              <th className="py-2 text-right">Practice</th>
              <th className="py-2 text-right">Reviewed</th>
              {/* v0.72 §7 — a teacher must be able to see the gap between
                  what the curriculum contains and what Pragati can
                  actually teach, per class, without reading Admin. */}
              <th className="py-2 text-right">Complete drafts</th>
              <th className="py-2 text-right">Not yet available</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.grade} className="border-b border-slate-100 align-top">
                <td className="py-2 font-medium text-slate-900">
                  {r.gradeLabel}
                </td>
                <td className="py-2 text-xs text-slate-600">
                  {r.documentTitle ?? 'Not established'}
                  {r.academicYear ? ` · ${r.academicYear}` : ''}
                  {r.registryStatus !== 'primary_source_verified' && (
                    <span className="mt-0.5 block text-amber-700">
                      Official structure not yet verified
                    </span>
                  )}
                </td>
                <td className="py-2 text-right">
                  {/* v0.69 §20 — a class organised into chapters has no
                      units, and saying "0 units" would be as wrong as
                      calling its chapters units. Blank means the level
                      does not apply here. */}
                  {r.entryNoun.plural === 'units' ? (
                    <Count value={r.officialUnitsKnown} />
                  ) : (
                    <span className="text-slate-300" aria-label="not applicable">
                      —
                    </span>
                  )}
                </td>
                <td className="py-2 text-right">
                  <Count value={r.officialChaptersKnown} />
                </td>
                <td className="py-2 text-right">
                  <Count value={r.officialTopicsKnown} />
                </td>
                <td className="py-2 text-right">{r.representedInPragati}</td>
                <td className="py-2 text-right font-medium">
                  {r.learnAvailable}
                </td>
                <td className="py-2 text-right font-medium">
                  {r.practiceAvailable}
                </td>
                <td className="py-2 text-right text-slate-500">{r.reviewed}</td>
                <td className="py-2 text-right text-slate-500">
                  {coverageForGrade(r.grade).completeInstructionalDrafts}
                </td>
                <td className="py-2 text-right">
                  <Count value={r.missingFromPragati} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        {/* §7/§26 — the distinction a teacher most needs and the table
            alone cannot make: a class can have a fully verified
            curriculum and no Pragati content at all. That is a CONTENT
            gap, not a curriculum gap, and the chapters are all still
            listed for the student. */}
        <div className="rounded-xl2 border border-progress-200 bg-progress-50/60 p-3">
          <p className="text-sm font-semibold text-slate-900">
            Verified curriculum does not mean available content
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Classes 9–12 have a fully verified official curriculum and no
            Pragati teaching content at all. Every official unit is listed for
            students; none of it can be opened yet. That is a gap in what
            Pragati has built, not in the curriculum.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-slate-900">
          Why some classes show fewer units
        </h3>
        {Array.from(new Set(rows.map((r) => r.mismatchReason))).map((reason) => (
          <div key={reason} className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-slate-700">
              {MISMATCH_REASON_TEXT[reason]}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {rows
                .filter((r) => r.mismatchReason === reason)
                .map((r) => r.gradeLabel)
                .join(', ')}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
