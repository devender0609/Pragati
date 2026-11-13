// v0.25: PilotSetupTab extracted from TeacherWorkflowHome.tsx.

import { useState } from 'react';
import {
  WORKFLOW_STEP_STATUS_COLOR,
  WORKFLOW_STEP_STATUS_LABELS,
  type ReadinessCheck,
  type WorkflowStep,
  type WorkflowStepId,
} from '../types';
import { friendlyCta, SectionHeader } from './TeacherHomeSummary';

export function TeacherPilotSetupTab({
  steps,
  stepHandlers,
  headline,
  readiness,
  totalCodes,
  activeCodes,
  activeAssignmentCount,
  onOpenAssignments,
  onOpenAssignmentForm,
  onOpenClassrooms,
  onOpenPilotReport,
}: {
  steps: WorkflowStep[];
  stepHandlers: Record<WorkflowStepId, () => void>;
  headline: { passed: number; total: number; allPassed: boolean };
  readiness: ReadinessCheck[];
  totalCodes: number;
  activeCodes: number;
  activeAssignmentCount: number;
  onOpenAssignments: () => void;
  onOpenAssignmentForm: () => void;
  onOpenClassrooms?: () => void;
  onOpenPilotReport: () => void;
}) {
  const [showAllReadiness, setShowAllReadiness] = useState(false);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pilot setup"
        subtitle="The guided steps to set up and run a small classroom pilot."
      />

      <section>
        <h2 className="text-base font-semibold text-slate-900">Pilot workflow</h2>
        <p className="mt-1 text-xs text-slate-600">
          Each card shows the current status. Status updates as you finish
          steps elsewhere in the app.
        </p>
        <ol className="mt-3 grid gap-3 md:grid-cols-2">
          {steps.map((step, i) => (
            <WorkflowStepCard
              key={step.id}
              index={i + 1}
              step={step}
              onClick={stepHandlers[step.id]}
            />
          ))}
        </ol>
      </section>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Assignments
            </div>
            <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
              {activeAssignmentCount} active assignment
              {activeAssignmentCount === 1 ? '' : 's'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeAssignmentCount > 0 && (
              <button
                onClick={onOpenAssignments}
                className="rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
              >
                Manage assignments
              </button>
            )}
            <button
              onClick={onOpenAssignmentForm}
              className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              New assignment
            </button>
          </div>
        </div>
      </section>

      {onOpenClassrooms && (
        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                Classroom codes
              </div>
              <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
                {activeCodes} active code{activeCodes === 1 ? '' : 's'}{' '}
                <span className="font-normal text-slate-500">
                  ({totalCodes} total — includes expired/revoked)
                </span>
              </h3>
            </div>
            <button
              onClick={onOpenClassrooms}
              className="rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
            >
              Manage classrooms &amp; codes
            </button>
          </div>
        </section>
      )}

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">
            Pilot readiness
          </h2>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
              headline.allPassed
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : 'bg-amber-50 text-amber-800 ring-amber-200'
            }`}
          >
            {headline.passed} of {headline.total} checks complete
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-600">
          {headline.allPassed
            ? 'Your pilot snapshot is ready to download.'
            : 'You can still run sessions — these are guidance, not gates.'}
        </p>
        <button
          onClick={() => setShowAllReadiness((v) => !v)}
          className="mt-2 text-xs font-semibold text-brand-700 hover:underline"
          aria-expanded={showAllReadiness}
        >
          {showAllReadiness ? 'Hide checklist' : 'Show full checklist'}
        </button>
        {showAllReadiness && (
          <ul className="mt-3 space-y-2">
            {readiness.map((c) => (
              <ReadinessRow key={c.id} check={c} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border-2 border-brand-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Pilot report
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              See your pilot at a glance
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Students tested, sessions completed, accuracy, weakest skills,
              top misconceptions, students needing support, flagged items,
              feedback summary, and one recommended next teaching action.
              Includes "Download pilot report" + "Copy summary".
            </p>
          </div>
          <button
            onClick={onOpenPilotReport}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Open pilot report →
          </button>
        </div>
      </section>
    </div>
  );
}

function WorkflowStepCard({
  index,
  step,
  onClick,
}: {
  index: number;
  step: WorkflowStep;
  onClick: () => void;
}) {
  const ringTone =
    step.status === 'complete'
      ? 'ring-emerald-200'
      : step.status === 'needs_attention'
        ? 'ring-rose-200'
        : step.status === 'in_progress'
          ? 'ring-amber-200'
          : 'ring-slate-200';
  return (
    <li
      className={`flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ${ringTone} transition hover:shadow-md sm:p-5`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {index}
          </span>
          <h3 className="text-base font-semibold text-slate-900">
            {step.title}
          </h3>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${WORKFLOW_STEP_STATUS_COLOR[step.status]}`}
        >
          {WORKFLOW_STEP_STATUS_LABELS[step.status]}
        </span>
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {step.subtitle}
      </p>
      <p className="text-sm leading-relaxed text-slate-600">
        {step.description}
      </p>
      <div>
        <button onClick={onClick} className="btn-primary text-sm">
          {friendlyCta(step.ctaLabel)}
        </button>
      </div>
    </li>
  );
}

function ReadinessRow({ check }: { check: ReadinessCheck }) {
  return (
    <li
      className={`flex items-start justify-between gap-4 rounded-xl px-4 py-3 ring-1 ${check.passed ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-50 ring-slate-200'}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-bold ${check.passed ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'}`}
        >
          {check.passed ? '✓' : '·'}
        </span>
        <div>
          <div className="text-sm font-semibold text-slate-900">
            {check.label}
          </div>
          <div className="mt-0.5 text-xs text-slate-600">{check.detail}</div>
        </div>
      </div>
    </li>
  );
}
