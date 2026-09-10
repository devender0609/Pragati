// v0.25: AdminTab extracted from TeacherWorkflowHome.tsx.
// Behaviour unchanged from v0.24.

import { useState } from 'react';
import { ITEMS } from '../data/items';
import { deleteSampleData, seedSampleData } from '../lib/sampleData';
import { SubmissionsImportPanel } from './common/SubmissionsImportPanel';
import { SectionHeader, timeAgo } from './TeacherHomeSummary';

export function TeacherAdminValidationTab({
  reviewedCount,
  flaggedNeedingReview,
  submissionsAwaitingReview,
  lastImportedAt,
  activeAssignmentCount,
  sampleActive,
  onImported,
  onSampleChanged,
  onOpenStudents,
  onOpenClassDashboard,
  onOpenItemReview,
  onOpenAlignmentReview,
  onOpenLearn,
  onOpenClassrooms,
  onOpenImportedSubmissions,
  onOpenClassroomTest,
  onOpenCurriculumCoverage,
  onExport,
}: {
  reviewedCount: number;
  flaggedNeedingReview: number;
  submissionsAwaitingReview: number;
  lastImportedAt: number | null;
  activeAssignmentCount: number;
  sampleActive: boolean;
  onImported: () => void;
  onSampleChanged: () => void;
  onOpenStudents: () => void;
  onOpenClassDashboard: () => void;
  onOpenItemReview: () => void;
  onOpenAlignmentReview: () => void;
  onOpenLearn: () => void;
  onOpenClassrooms?: () => void;
  onOpenImportedSubmissions?: () => void;
  onOpenClassroomTest?: () => void;
  /** v0.46 — opens the Curriculum Coverage admin page. */
  onOpenCurriculumCoverage?: () => void;
  onExport: () => void;
}) {
  const [showSubmissionsPanel, setShowSubmissionsPanel] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [showWorkflowTest, setShowWorkflowTest] = useState(false);
  const [showPrototype, setShowPrototype] = useState(false);

  return (
    <div className="space-y-6">
      {/* v0.46 Checkpoint 1 — Milestone 1 requires Standard teacher
          tools to sit apart from Research & admin. We restructure this
          tab into two clearly labelled sections instead of one flat
          grid so an everyday teacher sees the day-to-day tools first
          and only reaches research tools when they need them. */}
      <SectionHeader
        title="Admin & research"
        subtitle="Everyday teacher tools first, research & prototype-quality tools below. Wire-level behaviour is unchanged from v0.45."
      />

      {/* COLLAPSIBLE — Collect student work. */}
      <CollapsibleSection
        title="Collect student work"
        statusPill={
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
              submissionsAwaitingReview > 0
                ? 'bg-amber-50 text-amber-800 ring-amber-200'
                : 'bg-slate-100 text-slate-600 ring-slate-200'
            }`}
          >
            {submissionsAwaitingReview === 0
              ? '0 submissions waiting'
              : `${submissionsAwaitingReview} submission${submissionsAwaitingReview === 1 ? '' : 's'} waiting`}
            {lastImportedAt ? ` · last imported ${timeAgo(lastImportedAt)}` : ''}
          </span>
        }
        open={showSubmissionsPanel}
        onToggle={() => setShowSubmissionsPanel((v) => !v)}
      >
        <SubmissionsImportPanel onImported={onImported} />
      </CollapsibleSection>

      {/* --- STANDARD TEACHER TOOLS ---------------------------------
          Milestone 1 primary destinations. These are the tools a
          typical classroom teacher reaches for every session. */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Standard tools
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Everyday teacher workflows — classes, students, assignments, lessons.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <TeacherToolCard
            title="Students"
            subtitle="Per-student growth + history"
            body="One row per student with sessions, growth history, item-by-item responses, and recommended next steps."
            onClick={onOpenStudents}
          />
          <TeacherToolCard
            title="Class dashboard"
            subtitle="Class-wide aggregates"
            body="Headline tiles, misconception distribution, hardest items, and per-skill class accuracy."
            onClick={onOpenClassDashboard}
          />
          <TeacherToolCard
            title="Assignments"
            subtitle={`${activeAssignmentCount} active`}
            body="Manage assignments. Each assignment surfaces on the student home as the next thing to take."
            onClick={onOpenAssignmentsViaTool(
              onOpenStudents,
              activeAssignmentCount,
              onOpenClassrooms
            )}
            dynamicOnClick
          />
          {onOpenClassrooms && (
            <TeacherToolCard
              title="Classrooms & codes"
              subtitle="Roster grouping + access codes"
              body="Create classrooms, add students from your on-device roster, generate / manage access codes, set expiry, sync to the cloud when signed in."
              onClick={onOpenClassrooms}
            />
          )}
          <TeacherToolCard
            title="Learn"
            subtitle="Lesson pages for every skill"
            body="Open the Math module dashboard. Every skill has a reteach lesson, worked examples, common-mistake notes, and practice items."
            onClick={onOpenLearn}
          />
        </div>
      </div>

      {/* --- RESEARCH & ADMINISTRATION --------------------------------
          Item review, alignment, imported-submissions, exports and
          prototype-validation tools. Moved out of the "standard tools"
          block per Milestone 1. */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Research &amp; administration
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Pre-pilot validation, alignment auditing, imported student
          work, exports, and developer helpers.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <TeacherToolCard
            title="Item review"
            subtitle={`${reviewedCount} of ${ITEMS.length} reviewed`}
            body="Walk the bank item-by-item: verify correctness, wording, grade-fit, visuals, difficulty, and ambiguity."
            onClick={onOpenItemReview}
          />
          <TeacherToolCard
            title="Alignment review"
            subtitle="CBSE / NCERT-informed prototype"
            body="Per-skill chapter references, learning outcomes, competency statements, and audit flags."
            onClick={onOpenAlignmentReview}
          />
          {onOpenImportedSubmissions && (
            <TeacherToolCard
              title="Imported submissions"
              subtitle={
                submissionsAwaitingReview > 0
                  ? `${submissionsAwaitingReview} unreviewed`
                  : 'All reviewed'
              }
              body="Filter and review sessions that arrived through classroom codes."
              onClick={onOpenImportedSubmissions}
            />
          )}
          {onOpenCurriculumCoverage && (
            <TeacherToolCard
              title="Curriculum coverage"
              subtitle="Classes 1–12 catalogue"
              body="Ground-truth chapter catalogue with source-verification and content-status per row. Every row starts unverified until reviewed against an authoritative source."
              onClick={onOpenCurriculumCoverage}
            />
          )}
        </div>
      </div>

      {/* COLLAPSIBLE — Workflow test. */}
      {onOpenClassroomTest && (
        <CollapsibleSection
          title="Classroom workflow test (debug)"
          statusPill={
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
              End-to-end self-check
            </span>
          }
          open={showWorkflowTest}
          onToggle={() => setShowWorkflowTest((v) => !v)}
        >
          <div className="rounded-2xl bg-white p-4 text-sm text-slate-700 ring-1 ring-slate-200">
            <p>
              Walks the 8 steps a real pilot needs (create classroom → code →
              assignment → join → complete → submit → import → roster-link)
              and reports pass / fail / pending for each. Useful when wiring
              up a new device or troubleshooting a classroom rollout.
            </p>
            <button
              onClick={onOpenClassroomTest}
              className="mt-3 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
            >
              Run the workflow test →
            </button>
          </div>
        </CollapsibleSection>
      )}

      {/* COLLAPSIBLE — Sample data. */}
      <CollapsibleSection
        title="Sample data"
        statusPill={
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
              sampleActive
                ? 'bg-violet-50 text-violet-700 ring-violet-200'
                : 'bg-slate-100 text-slate-600 ring-slate-200'
            }`}
          >
            {sampleActive ? 'Sample loaded' : 'Not loaded'}
          </span>
        }
        open={showSample}
        onToggle={() => setShowSample((v) => !v)}
      >
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
          <p>
            {sampleActive
              ? 'Sample classroom and students are loaded on this device. Use the dashboard normally, or remove them when you want a clean slate.'
              : 'No real students yet? Seed a sample classroom of 6 students and 12 short sessions to explore the dashboard. Safe to delete later.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {!sampleActive ? (
              <button
                onClick={() => {
                  seedSampleData();
                  onSampleChanged();
                }}
                className="rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
              >
                Seed sample data
              </button>
            ) : (
              <button
                onClick={() => {
                  deleteSampleData();
                  onSampleChanged();
                }}
                className="rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-violet-700 ring-1 ring-violet-300 hover:bg-violet-100"
              >
                Remove sample data
              </button>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* EXPORT — Download pilot data. */}
      <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Download pilot report
            </div>
            <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
              Export everything on this device as JSON
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Includes students, sessions, assignments, pilots, item reviews,
              feedback, alignment metadata, and the readiness summary.
            </p>
          </div>
          <button
            onClick={onExport}
            className="rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Download report
          </button>
        </div>
      </section>

      {/* COLLAPSIBLE — Prototype reminder + flagged-items-needing-review note. */}
      <CollapsibleSection
        title="Prototype notes"
        statusPill={
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
              flaggedNeedingReview > 0
                ? 'bg-amber-50 text-amber-800 ring-amber-200'
                : 'bg-slate-100 text-slate-600 ring-slate-200'
            }`}
          >
            {flaggedNeedingReview > 0
              ? `${flaggedNeedingReview} items still need review`
              : 'All items reviewed'}
          </span>
        }
        open={showPrototype}
        onToggle={() => setShowPrototype((v) => !v)}
      >
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p>
            This is a pre-pilot prototype. Skill-status labels, alignment
            confidence, and item quality flags come from rule-based heuristics
            on a small bank — not calibrated psychometrics. Use them to focus
            a teacher conversation, not to make placement decisions or to
            claim official CBSE alignment. Class 7 starter and deepening
            content (added in v0.23 and v0.25) is marked "needs teacher
            review" until reviewed.
          </p>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function CollapsibleSection({
  title,
  statusPill,
  open,
  onToggle,
  children,
}: {
  title: string;
  statusPill?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white ring-1 ring-slate-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50"
        aria-expanded={open}
      >
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {statusPill}
        </div>
        <span className="text-sm font-semibold text-brand-700">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>
      {open && <div className="border-t border-slate-200 p-4">{children}</div>}
    </section>
  );
}

function TeacherToolCard({
  title,
  subtitle,
  body,
  onClick,
  dynamicOnClick,
}: {
  title: string;
  subtitle: string;
  body: string;
  onClick: () => void;
  // Marker so we can pass a dynamically computed handler without ESLint
  // complaining. Unused at render time.
  dynamicOnClick?: boolean;
}) {
  void dynamicOnClick;
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start rounded-2xl bg-white p-5 text-left ring-1 ring-slate-200 transition hover:shadow-md"
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {subtitle}
      </div>
      <h3 className="mt-1 text-base font-bold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {body}
      </p>
      <span className="mt-3 text-xs font-semibold text-brand-700 group-hover:underline">
        Open →
      </span>
    </button>
  );
}

// Helper to keep the Assignments tool card pointing at the right
// destination depending on whether any active assignments exist.
function onOpenAssignmentsViaTool(
  fallback: () => void,
  activeCount: number,
  onOpenClassrooms?: () => void
): () => void {
  if (activeCount > 0) return fallback;
  return onOpenClassrooms ?? fallback;
}
