// v0.62 §14 — CURRICULUM COVERAGE, FOR TEACHERS.
//
// v0.61 found the most useful curriculum information trapped under
// Admin & Research, behind a panel described as separate from the
// ordinary teacher flow. A Class 6 teacher wants to know which parts of
// Fractions Pragati can take off their hands; that is not research.
//
// COUNTS ONLY. "5 of 9 sections covered" is true. "56% complete" would
// not be: a covered section may have no lesson, no reviewed practice
// and no educator sign-off. Mapping coverage is not instructional
// completeness, and a percentage silently asserts it is.
//
// Read-only. No governance internals.

import { OFFICIAL_CHAPTERS } from '../../curriculum/officialChapters';
// v0.63 §12/§14 — the SAME policy the student surfaces use, so the
// teacher and the student cannot be told different things.
import { getTeacherCoverageStatus } from '../../curriculum/eligibilityPolicy';
import { withheldFromClass6Core } from '../../curriculum/legacyDisposition';

export function CurriculumCoverageForTeachers() {
  const chapters = OFFICIAL_CHAPTERS.filter((c) => c.grade === 'class6')
    .slice()
    .sort(
      (a, b) => (a.officialChapterNumber ?? 0) - (b.officialChapterNumber ?? 0)
    );

  const withheld = withheldFromClass6Core();

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-base font-semibold text-slate-900">
          Class 6 curriculum coverage
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Based on Ganita Prakash (NCERT), the current Grade 6 textbook.
          Counts show what Pragati has content for — not how complete
          that content is.
        </p>
      </header>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-600">
          <tr>
            <th className="py-2">Chapter</th>
            <th className="py-2 text-right">Parts</th>
            <th className="py-2 text-right">Lessons</th>
            <th className="py-2 text-right">Practice</th>
            <th className="py-2 text-right">Checked</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((c) => {
            const cov = getTeacherCoverageStatus(c.officialChapterId);
            return (
              <tr key={c.officialChapterId} className="border-b border-slate-100">
                <td className="py-2">
                  <span className="text-slate-500">
                    {c.officialChapterNumber}.
                  </span>{' '}
                  {c.officialTitle}
                </td>
                <td className="py-2 text-right">{cov.officialSections}</td>
                <td className="py-2 text-right font-medium">
                  {cov.learnAvailable}
                </td>
                <td className="py-2 text-right font-medium">
                  {cov.practiceAvailable}
                </td>
                <td className="py-2 text-right text-slate-500">
                  {cov.reviewed}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* v0.63 §12 — the mapped-vs-practice gap, in practical language.
          For Fractions this is 5 vs 4, and both numbers are true: one
          counts historical topic overlap, the other counts material
          actually written for that part of the book. Hiding the
          difference behind one figure is what produced the v0.62
          contradiction. */}
      {(() => {
        const fr = getTeacherCoverageStatus('ncert_gp_c6_ch07_fractions');
        if (fr.mapped === fr.practiceAvailable) return null;
        return (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            In Fractions, {fr.mapped} parts overlap with topics Pragati
            already covers, but only {fr.practiceAvailable} have practice
            written specifically for that part of the chapter. The
            remaining {fr.mapped - fr.practiceAvailable} would give
            students questions written for a different part, so they are
            not offered.
          </p>
        );
      })()}

      <p className="text-sm text-slate-600">
        No section has been reviewed by a teacher yet. Content that has
        not been reviewed is not available to assign.
      </p>

      {withheld.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Not part of the Class 6 curriculum
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            These topics were built for the previous Class 6 textbook.
            The current book teaches them in later years, so they are no
            longer shown to Class 6 students.
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {withheld.map((r) => (
              <li key={r.moduleId}>
                <span className="font-medium text-slate-800">
                  {r.moduleId.replace(/_/g, ' ')}
                </span>{' '}
                — now taught in {r.evidencedHome?.replace('Ganita Prakash ', '')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
