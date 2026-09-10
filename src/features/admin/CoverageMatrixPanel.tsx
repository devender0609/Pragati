// v0.72 §8/§10 — THE MASTER COVERAGE MATRIX, IN ADMIN.
//
// One table, three truths, kept in separate column groups so they cannot
// be read as one number:
//
//   OFFICIAL CURRICULUM — what the source defines, and whether every
//                         record of it is represented
//   PRAGATI CONTENT     — what teaching material exists
//   REVIEW              — what a human has checked, and what a student
//                         may actually see
//
// NO COVERAGE PERCENTAGE. §3 forbids it and the reason is arithmetic:
// for seven of twelve grades the denominator is unknown, so a percentage
// would be computed against Pragati's own inventory and would report
// high coverage of a curriculum nobody has read.

import { backlogCoverageSentence } from '../../curriculum/coverageWording';
import { unknownCurriculumCaveat } from '../../curriculum/structureVerificationBacklog';
import { planSummary } from '../../curriculum/contentPlan';
import { coverageMatrix } from '../../curriculum/coverageMatrix';
import { backlogSummary } from '../../curriculum/coverageMatrix';

function Count({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="text-[0.7rem] font-bold uppercase tracking-wide text-amber-700">
        Unknown
      </span>
    );
  }
  return <span>{value}</span>;
}

export function CoverageMatrixPanel() {
  const rows = coverageMatrix();
  const backlog = backlogSummary();
  const verified = rows.filter((r) => r.verified);
  const omissions = verified.reduce((n, r) => n + (r.omissions ?? 0), 0);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="font-display text-base font-bold text-slate-900">
          Curriculum coverage — Classes 1–12
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {verified.length} of {rows.length} classes are primary-source
          verified.{' '}
          <span
            className={
              omissions === 0 ? 'font-semibold text-correct-700' : 'font-semibold text-rose-700'
            }
          >
            {omissions === 0
              ? 'Every official record of every verified class is represented in the registry.'
              : `${omissions} official records are MISSING from the registry.`}
          </span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Official curriculum, Pragati content and review state are three
          separate facts and are never combined. No coverage percentage is
          shown: for seven classes the denominator is unknown, so a
          percentage would measure Pragati against itself.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[62rem] text-left text-sm">
          <thead className="text-slate-600">
            <tr className="border-b border-slate-200 text-[0.7rem] uppercase tracking-wide">
              <th className="py-1.5" />
              <th className="py-1.5 text-center" colSpan={5}>
                Official curriculum
              </th>
              <th className="py-1.5 text-center" colSpan={4}>
                Pragati content
              </th>
              <th className="py-1.5 text-center" colSpan={3}>
                Review
              </th>
            </tr>
            <tr className="border-b border-slate-200">
              <th className="py-2">Class</th>
              <th className="py-2 text-right">Units</th>
              <th className="py-2 text-right">Chapters</th>
              <th className="py-2 text-right">Topics</th>
              <th className="py-2 text-right">In registry</th>
              <th className="py-2 text-right">Omissions</th>
              <th className="py-2 text-right">Ch. w/ Learn</th>
              <th className="py-2 text-right">Topics w/ practice</th>
              <th className="py-2 text-right">Topics w/ visual</th>
              <th className="py-2 text-right">Complete drafts</th>
              <th className="py-2 text-right">Drafts</th>
              <th className="py-2 text-right">Reviewed</th>
              <th className="py-2 text-right">Student-ready</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.grade} className="border-b border-slate-100">
                <td className="py-2 font-medium text-slate-900">
                  {r.gradeLabel}
                  {!r.verified && (
                    <span className="mt-0.5 block text-[0.68rem] font-normal text-amber-700">
                      not yet verified
                    </span>
                  )}
                </td>
                <td className="py-2 text-right"><Count value={r.officialUnits} /></td>
                <td className="py-2 text-right"><Count value={r.officialChapters} /></td>
                <td className="py-2 text-right"><Count value={r.officialTopics} /></td>
                <td className="py-2 text-right"><Count value={r.recordsRepresented} /></td>
                <td
                  className={`py-2 text-right ${
                    (r.omissions ?? 0) > 0 ? 'font-bold text-rose-700' : 'text-slate-400'
                  }`}
                >
                  <Count value={r.omissions} />
                </td>
                <td className="py-2 text-right">{r.chaptersWithLearn}</td>
                <td className="py-2 text-right">{r.topicsWithIndependentPractice}</td>
                <td className="py-2 text-right">{r.topicsWithVisual}</td>
                <td className="py-2 text-right font-medium">
                  {r.completeInstructionalDrafts}
                </td>
                <td className="py-2 text-right">{r.drafts}</td>
                <td className="py-2 text-right">{r.educatorReviewed}</td>
                <td className="py-2 text-right">{r.studentReady}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* §23 — the backlog, derived. Nothing is listed by hand, so
          nothing can be forgotten by being left out of an edit. */}
      <div className="rounded-xl2 border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          Content backlog — {backlog.total} official records with no complete,
          reviewed, published content
        </p>
        {/* v0.74 §5 — the wording is DERIVED, so this panel cannot drift
            from the states it is describing. The previous line said
            "no complete, reviewed content" above a table showing nine
            authored drafts. */}
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          {backlogCoverageSentence()}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Derived from the registry, not maintained by hand: the moment a class
          becomes verified, all of its records appear here.
        </p>
        {/* §21 — a backlog total without this reads as the Classes 1-12
            total. Seven grades contribute nothing to it. */}
        <p className="mt-1 text-xs leading-relaxed text-amber-800">
          {unknownCurriculumCaveat()}
        </p>
        <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {Object.entries(backlog.byGrade).map(([g, n]) => (
            <div key={g}>
              <dt className="text-xs text-slate-500">{g}</dt>
              <dd className="font-display text-lg font-bold text-slate-900">{n}</dd>
            </div>
          ))}
          <div>
            {/* v0.74 §2 — was `backlog.reviewNeed` (89). A syllabus unit
                with no verified sections has nothing for an educator to
                read; its next action is somebody opening a textbook. */}
            <dt className="text-xs text-slate-500">Will need review</dt>
            <dd className="font-display text-lg font-bold text-slate-900">
              {planSummary().plannable}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
