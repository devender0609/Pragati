// v0.68 §13/§20 — CHAPTER QUALITY SUMMARY (Admin / reviewer only).
//
// Counts and flags. No score, no percentage, no rating. §13 forbids a
// composite figure and the reason is that a single number would let
// correct-but-unreviewed outrank reviewed-with-one-open-question, and
// those two are not on the same axis.
//
// Governance vocabulary is allowed here. This screen is never rendered
// for a student.

import {
  chapterQualitySummary,
  QUALITY_FLAG_TEXT,
  SECTION_7_4_PROJECTION_NOTE,
  type SectionQualityRow,
} from '../../curriculum/chapterQuality';

function FlagList({ row }: { row: SectionQualityRow }) {
  if (row.flags.length === 0) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  return (
    <ul className="space-y-1">
      {row.flags.map((f) => (
        <li key={f} className="text-xs text-slate-600">
          {QUALITY_FLAG_TEXT[f]}
        </li>
      ))}
    </ul>
  );
}

export function ChapterQualitySummary() {
  const s = chapterQualitySummary();

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-base font-semibold text-slate-900">
          {s.chapter} — quality summary
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {s.officialSections} official parts · {s.authoredDrafts} authored
          drafts · {s.educatorReviewed} educator-reviewed · {s.published}{' '}
          published
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Counts and flags only. No quality score is calculated, because
          nothing here measures whether the teaching is any good.
        </p>
      </header>

      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
        <p className="text-sm font-medium text-amber-900">
          §7.4 — {SECTION_7_4_PROJECTION_NOTE.state} (
          {SECTION_7_4_PROJECTION_NOTE.artifactId} v
          {SECTION_7_4_PROJECTION_NOTE.artifactVersion})
        </p>
        <p className="mt-1 text-xs text-amber-800">
          {SECTION_7_4_PROJECTION_NOTE.reviewerNote}
        </p>
        <p className="mt-1 text-xs text-amber-800">
          Review candidate {s.reviewCandidate.reviewCode} · fingerprint{' '}
          {s.reviewCandidate.fingerprint}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-600">
            <tr>
              <th className="py-2">Part</th>
              <th className="py-2">Artifact</th>
              <th className="py-2">Authoring</th>
              <th className="py-2 text-right">Ex.</th>
              <th className="py-2 text-right">Guided</th>
              <th className="py-2 text-right">Indep.</th>
              <th className="py-2 text-right">Reason.</th>
              <th className="py-2 text-right">Inter.</th>
              <th className="py-2 text-right">Visuals</th>
              <th className="py-2 text-right">Misc.</th>
              <th className="py-2 text-right">Diag.</th>
              <th className="py-2">Educator review</th>
              <th className="py-2">Known quality flags</th>
            </tr>
          </thead>
          <tbody>
            {s.rows.map((r) => (
              <tr
                key={r.officialSectionId}
                className="border-b border-slate-100 align-top"
              >
                <td className="py-2">
                  <span className="text-slate-500">{r.sectionNumber}</span>{' '}
                  {r.title}
                </td>
                <td className="py-2 text-xs text-slate-500">
                  {r.artifactId} v{r.artifactVersion}
                </td>
                <td className="py-2 text-xs text-slate-500">
                  {r.authoringMode === 'projected_from_frozen_artifact'
                    ? 'projected (frozen v1)'
                    : 'natively authored'}
                </td>
                <td className="py-2 text-right">{r.workedExamples}</td>
                <td className="py-2 text-right">{r.guidedItems}</td>
                <td className="py-2 text-right">{r.independentItems}</td>
                <td className="py-2 text-right">{r.reasoningTasks}</td>
                <td className="py-2 text-right">{r.interactiveItems}</td>
                <td className="py-2 text-right">{r.visuals}</td>
                <td className="py-2 text-right">{r.misconceptionsDocumented}</td>
                <td className="py-2 text-right">
                  {r.diagnosticDistractors}
                  <span className="text-slate-400">
                    /{r.diagnosticDistractors + r.neutralDistractors}
                  </span>
                </td>
                <td className="py-2 text-xs">
                  {r.educatorReviewStatus === 'reviewed'
                    ? 'reviewed'
                    : 'not reviewed'}
                </td>
                <td className="py-2">
                  <FlagList row={r} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium text-slate-800">
              <td className="py-2" colSpan={3}>
                Chapter totals
              </td>
              <td className="py-2 text-right">{s.totals.workedExamples}</td>
              <td className="py-2 text-right">{s.totals.guidedItems}</td>
              <td className="py-2 text-right">{s.totals.independentItems}</td>
              <td className="py-2 text-right">{s.totals.reasoningTasks}</td>
              <td className="py-2 text-right">{s.totals.interactiveItems}</td>
              <td className="py-2 text-right">{s.totals.visuals}</td>
              <td className="py-2 text-right">—</td>
              <td className="py-2 text-right">
                {s.totals.diagnosticDistractors}
                <span className="text-slate-400">
                  /
                  {s.totals.diagnosticDistractors + s.totals.neutralDistractors}
                </span>
              </td>
              <td className="py-2" colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-900">
            Interactive practice by format
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {Object.entries(s.interactiveByFormat).map(([k, v]) => (
              <li key={k}>
                {k.replace(/_/g, ' ')} · {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-900">Visuals by type</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {Object.entries(s.visualsByType).map(([k, v]) => (
              <li key={k}>
                {k.replace(/_/g, ' ')} · {v}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Diagnostic count is the number of incorrect responses that name a
        specific misconception, over the number of incorrect responses
        available. A neutral response is not a defect — it means the reason
        for the answer cannot safely be inferred.
      </p>
    </section>
  );
}
