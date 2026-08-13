// v0.46 Checkpoint 5 — Curriculum Coverage admin page.
//
// Renders the chapterCatalogue as a per-grade table with source and
// content-status pills. Belongs in Admin/Research per Milestone 4
// (not the standard student surface).

import { useMemo, useState } from 'react';
import {
  CHAPTER_CATALOGUE,
  chaptersForGrade,
  coverageSummary,
  type ChapterCatalogueRow,
  type ContentStatus,
  type SourceVerificationStatus,
} from '../curriculum/chapterCatalogue';
import { SEMANTIC, TYPE } from '../design/tokens';

const GRADE_LABEL: Record<ChapterCatalogueRow['grade'], string> = {
  grade_01: 'Class 1',  grade_02: 'Class 2',  grade_03: 'Class 3',
  grade_04: 'Class 4',  grade_05: 'Class 5',  grade_06: 'Class 6',
  grade_07: 'Class 7',  grade_08: 'Class 8',  grade_09: 'Class 9',
  grade_10: 'Class 10', grade_11: 'Class 11', grade_12: 'Class 12',
};

const SOURCE_LABEL: Record<SourceVerificationStatus, string> = {
  needs_verification: 'Source unverified',
  source_verified: 'Source verified',
  teacher_verified: 'Teacher verified',
};

const SOURCE_TONE: Record<SourceVerificationStatus, string> = {
  needs_verification: `${SEMANTIC.warning.tintBg} ${SEMANTIC.warning.text} ring-1 ${SEMANTIC.warning.tintRing}`,
  source_verified: `${SEMANTIC.info.tintBg} ${SEMANTIC.info.text} ring-1 ${SEMANTIC.info.tintRing}`,
  teacher_verified: `${SEMANTIC.success.tintBg} ${SEMANTIC.success.text} ring-1 ${SEMANTIC.success.tintRing}`,
};

const CONTENT_LABEL: Record<ContentStatus, string> = {
  missing: 'Missing',
  shell_only: 'Shell only',
  assessment_only: 'Assessment only',
  lesson_only: 'Lesson only',
  partial: 'Partial (prototype)',
  prototype_complete: 'Prototype complete',
  teacher_reviewed: 'Teacher reviewed',
  pilot_ready: 'Pilot-ready',
  published: 'Published',
};

const CONTENT_TONE: Record<ContentStatus, string> = {
  missing: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  shell_only: `${SEMANTIC.warning.tintBg} ${SEMANTIC.warning.text} ring-1 ${SEMANTIC.warning.tintRing}`,
  assessment_only: `${SEMANTIC.info.tintBg} ${SEMANTIC.info.text} ring-1 ${SEMANTIC.info.tintRing}`,
  lesson_only: `${SEMANTIC.info.tintBg} ${SEMANTIC.info.text} ring-1 ${SEMANTIC.info.tintRing}`,
  partial: `${SEMANTIC.warning.tintBg} ${SEMANTIC.warning.text} ring-1 ${SEMANTIC.warning.tintRing}`,
  prototype_complete: `${SEMANTIC.info.tintBg} ${SEMANTIC.info.text} ring-1 ${SEMANTIC.info.tintRing}`,
  teacher_reviewed: `${SEMANTIC.success.tintBg} ${SEMANTIC.success.text} ring-1 ${SEMANTIC.success.tintRing}`,
  pilot_ready: `${SEMANTIC.success.tintBg} ${SEMANTIC.success.text} ring-1 ${SEMANTIC.success.tintRing}`,
  published: `${SEMANTIC.success.tintBg} ${SEMANTIC.success.text} ring-1 ${SEMANTIC.success.tintRing}`,
};

export function CurriculumCoverageView({ onBack }: { onBack?: () => void }) {
  const [selectedGrade, setSelectedGrade] = useState<
    ChapterCatalogueRow['grade'] | 'all'
  >('all');

  const rows = useMemo(
    () =>
      selectedGrade === 'all'
        ? CHAPTER_CATALOGUE
        : chaptersForGrade(selectedGrade),
    [selectedGrade]
  );
  const summary = coverageSummary();

  return (
    <div className="space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back
        </button>
      )}

      <header>
        <div className={TYPE.eyebrow}>Admin &amp; research</div>
        <h1 className={`mt-1 ${TYPE.h1} text-slate-900`}>
          Curriculum coverage
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Ground-truth catalogue of chapters Pragati currently claims to cover
          for Classes 1-12 Mathematics.{' '}
          <strong className="font-semibold text-amber-800">
            Every row starts unverified.
          </strong>{' '}
          Chapter numbers inherited from previous iterations are labelled as
          claims until a reviewer confirms them against an authoritative
          NCERT / CBSE source and records the source and edition.
        </p>
      </header>

      {/* Rollup counters */}
      <section className="grid gap-3 sm:grid-cols-3">
        <RollupCard
          label="Total chapters catalogued"
          value={summary.total}
        />
        <RollupCard
          label="Source unverified"
          value={summary.bySource.needs_verification}
          tone={
            summary.bySource.needs_verification > 0
              ? 'warning'
              : 'success'
          }
        />
        <RollupCard
          label="Prototype-complete rows"
          value={summary.byContent.prototype_complete}
          tone="info"
        />
      </section>

      {/* Grade selector */}
      <div className="flex flex-wrap gap-1.5">
        <GradePill
          label="All grades"
          active={selectedGrade === 'all'}
          onClick={() => setSelectedGrade('all')}
        />
        {(Object.keys(GRADE_LABEL) as ChapterCatalogueRow['grade'][]).map(
          (g) => (
            <GradePill
              key={g}
              label={GRADE_LABEL[g]}
              active={selectedGrade === g}
              onClick={() => setSelectedGrade(g)}
            />
          )
        )}
      </div>

      {/* Coverage table */}
      <section className="overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-3 py-2">Grade</th>
              <th className="px-3 py-2">Chapter (claimed)</th>
              <th className="px-3 py-2">Ch #</th>
              <th className="px-3 py-2">Module</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Content</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.chapterId} className="hover:bg-slate-50">
                <td className="px-3 py-2 text-xs text-slate-600">
                  {GRADE_LABEL[row.grade]}
                </td>
                <td className="px-3 py-2 font-medium text-slate-900">
                  {row.claimedChapterTitle}
                  {row.notes && (
                    <div className="mt-0.5 text-[11px] italic text-slate-500">
                      {row.notes}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  {row.claimedChapterNumber ?? '—'}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-slate-500">
                  {row.registryModuleId ?? '—'}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${SOURCE_TONE[row.sourceVerificationStatus]}`}
                  >
                    {SOURCE_LABEL[row.sourceVerificationStatus]}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${CONTENT_TONE[row.contentStatus]}`}
                  >
                    {CONTENT_LABEL[row.contentStatus]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="text-xs text-slate-500">
        This page is an authoring tool for teachers and reviewers, not a
        student-facing surface. It should stay under Admin &amp; research.
      </p>
    </div>
  );
}

function RollupCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'success' | 'warning' | 'info';
}) {
  const toneClass =
    tone === 'success'
      ? `${SEMANTIC.success.tintBg} ${SEMANTIC.success.text}`
      : tone === 'warning'
      ? `${SEMANTIC.warning.tintBg} ${SEMANTIC.warning.text}`
      : tone === 'info'
      ? `${SEMANTIC.info.tintBg} ${SEMANTIC.info.text}`
      : 'bg-white text-slate-900';
  return (
    <div
      className={`rounded-2xl p-4 shadow-card ring-1 ring-slate-200 ${toneClass}`}
    >
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function GradePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
        active
          ? 'bg-slate-900 text-white ring-slate-900'
          : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}
