// v0.74 §1/§2/§3/§7 — THE AUTHORING PLAN, IN ADMIN.
//
// The backlog says WHAT is missing. This says what work that implies,
// and — the part that matters — WHO can actually do it next.
//
// v0.73's panel led with "8 complete drafts blocked on people, not
// engineering". That number was wrong in the direction that flatters
// engineering: seven of those eight have no review package, so no
// educator could have started on them. The panel now shows both halves,
// because showing only the comfortable one is how the §7.4 review sat
// for eight releases while the plan reported it as somebody else's turn.

import { useState } from 'react';
import {
  planSummary,
  planForChapter,
  observedMiddleStageFractionsShape,
} from '../../curriculum/contentPlan';
import {
  authoringStandardForStage,
  PRODUCTION_STAGE_LABEL,
  type ProductionStage,
} from '../../curriculum/productionStage';
import { reviewReadinessSummary } from '../../curriculum/reviewReadiness';

const STAGES: ProductionStage[] = [
  'PRIMARY_EARLY',
  'PRIMARY',
  'MIDDLE',
  'SECONDARY',
  'SENIOR_SECONDARY',
];

export function ContentPlanPanel() {
  const summary = planSummary();
  const readiness = reviewReadinessSummary();
  const [open, setOpen] = useState(false);
  const chapterPlans = planForChapter('ncert_gp_c6_ch07_fractions');
  const observed = observedMiddleStageFractionsShape();
  const middle = authoringStandardForStage('MIDDLE');

  return (
    <section className="space-y-4">
      <header>
        <h2 className="font-display text-base font-bold text-slate-900">
          Authoring plan
        </h2>
        <p className="mt-1 text-sm text-slate-600">{summary.headline}</p>
      </header>

      {/* Both halves of the blocked question, side by side. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl2 border-2 border-attend-300 bg-attend-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-attend-800">
            Blocked on people, not engineering
          </p>
          <p className="mt-1.5 text-2xl font-bold text-attend-900">
            {readiness.reviewReady} complete draft{readiness.reviewReady === 1 ? '' : 's'}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-attend-900">
            §7.4 has a frozen candidate, a pinned build and a question set. It
            needs a Grade 6 mathematics educator to read it. No tooling
            advances it, and this release is the ninth to say so.
          </p>
        </div>
        <div className="rounded-xl2 border-2 border-slate-300 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Blocked on engineering, not people
          </p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">
            {readiness.awaitingPackagePreparation} complete drafts
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Complete drafts with no review package. Package B&rsquo;s questions
            are written about §7.4&rsquo;s number line and are not
            transferable. v0.73 counted these as waiting on a reviewer.
          </p>
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ['Official records', summary.records],
          ['Plannable now', summary.plannable],
          ['Need deeper structure', summary.requiresDeeperStructure],
          ['Authoring items', summary.determinedAuthoringItems],
          ['Design decisions', summary.undeterminedDesignDecisions],
          ['Waived with reason', summary.waivedWithReason],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl2 border border-slate-200 bg-white p-3">
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="mt-0.5 font-display text-xl font-bold text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {/* §1 — which stages have a standard at all. */}
      <div className="rounded-xl2 border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          Authoring standard by stage
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Pragati has audited one body of content: Class 6 Chapter 7, Middle
          Stage, at section grain. Every other stage returns
          <strong> production standard pending</strong> — which is the true
          state of the evidence, not a gap in this table. A Class 11 unit must
          not inherit the shape of a Class 6 Fractions section.
        </p>
        <ul className="mt-3 space-y-1.5">
          {STAGES.map((s) => {
            const std = authoringStandardForStage(s);
            return (
              <li key={s} className="flex flex-wrap items-baseline gap-2 text-sm">
                <span className="font-medium text-slate-800">
                  {PRODUCTION_STAGE_LABEL[s]}
                </span>
                {std.kind === 'audited_standard' ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-emerald-800">
                    audited standard
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-slate-600">
                    production standard pending
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* §4 — the observation, named as an observation. */}
      <div className="rounded-xl2 border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          Observed Middle Stage Fractions shape
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          The median of the nine authored Chapter 7 sections. This is
          <strong> evidence, not doctrine</strong>: it describes one chapter,
          at one stage, at section grain. It is the planning target for Middle
          Stage sections and for nothing else.
        </p>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="py-1">Component</th>
              <th className="py-1 text-right">Chapter 7 median</th>
              <th className="py-1 text-right">Middle Stage target</th>
            </tr>
          </thead>
          <tbody>
            {middle.kind === 'audited_standard' &&
              (
                [
                  ['Explanation paragraphs', observed.explanationParagraphs, middle.shape.explanationParagraphs],
                  ['Worked examples', observed.workedExamples, middle.shape.workedExamples],
                  ['Guided items', observed.guidedPractice, middle.shape.guidedPractice],
                  ['Independent items', observed.independentPractice, middle.shape.independentPractice],
                  ['Reasoning tasks', observed.reasoningTasks, middle.shape.reasoningTasks],
                  ['Semantic visuals', observed.semanticVisuals, middle.shape.semanticVisuals],
                  ['Interactive items', observed.interactivePractice, middle.shape.interactivePractice],
                ] as const
              ).map(([label, o, t]) => (
                <tr key={label} className="border-t border-slate-200">
                  <td className="py-1.5 text-slate-700">{label}</td>
                  <td className="py-1.5 text-right text-slate-500">{o}</td>
                  <td className="py-1.5 text-right font-medium text-slate-900">{t}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="tap rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700"
      >
        {open ? 'Hide' : 'Show'} the Chapter 7 plan, section by section
      </button>

      {open && (
        <ol className="space-y-2">
          {chapterPlans.map((p) => (
            <li
              key={p.officialSectionId ?? p.officialUnitId}
              className="rounded-xl2 border border-slate-200 bg-white p-3"
            >
              <p className="text-sm font-semibold text-slate-900">
                {p.officialSectionTitle ?? p.officialUnitTitle}
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">
                  {p.priority}
                </span>
                {p.reviewReadiness && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">
                    {p.reviewReadiness.replace(/_/g, ' ')}
                  </span>
                )}
              </p>
              <ul className="mt-1.5 space-y-0.5">
                {p.work.map((w, i) => (
                  <li key={i} className="text-xs text-slate-600">
                    <span
                      className={
                        w.applicability === 'not_required_with_reason'
                          ? 'font-semibold text-slate-400'
                          : w.applicability === 'undetermined_requires_design_review'
                            ? 'font-semibold text-indigo-700'
                            : w.requiresHuman
                              ? 'font-semibold text-attend-800'
                              : 'font-semibold text-slate-700'
                      }
                    >
                      {w.applicability === 'not_required_with_reason'
                        ? 'WAIVED'
                        : w.applicability === 'undetermined_requires_design_review'
                          ? 'DESIGN'
                          : w.requiresHuman
                            ? 'HUMAN'
                            : 'AUTHOR'}
                    </span>{' '}
                    {w.description}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
