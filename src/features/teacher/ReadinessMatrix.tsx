// v0.54 §12 — The canonical readiness matrix.
//
// The four-axis model has existed in code and tests since v0.50 and has
// been deferred from the UI three times. This is it.
//
// ONE model, not a parallel status system: it reads the same
// ReadinessProfile the rest of the app uses. Teacher Resources shows a
// simplified view of the SAME data; students see neither.

import { useMemo, useState } from 'react';
import { Card } from '../../design/primitives/Card';
import { PageHeader } from '../../design/primitives/PageHeader';
import { chaptersForStudentGrade } from '../student/StudentShell';
import { studentChapterTitle } from '../../curriculum/studentNames';
import {
  CURRICULUM_STATUS_LABEL, INSTRUCTION_STATUS_LABEL,
  PRACTICE_STATUS_LABEL, GROWTH_STATUS_LABEL,
  type ReadinessProfile,
} from '../../curriculum/readiness';
import { blueprintForChapter } from '../../curriculum/chapterBlueprints';
import { currentGrowthReadinessFor } from '../assessment/growthReadiness';
import {
  evaluateFrameworkEvidenceGate,
  REQUIRED_EVIDENCE,
  sourceInspected,
} from '../../curriculum/frameworkEvidenceGate';
import { authorizePilotFramework } from '../assessment/pilotFrameworkAuthorization';
import { CURRENT_REVIEWS, CURRENT_ADJUDICATIONS } from './reviewAdjudication';
import { growthItemRecords } from '../assessment/growthItemBank';
import { RATIONAL_NUMBER_SPECIFICATIONS } from '../assessment/rationalNumberSpecifications';
import { STORAGE_MATURITY_NOTE } from '../assessment/repositories';
import { resolveChapter } from '../../curriculum/chapterResolver';
import type { Grade } from '../../types';

/**
 * Derive a readiness profile for a chapter from real content state.
 *
 * Each axis is computed from ITS OWN evidence. Growth in particular is
 * never inferred from item counts — it is `not_eligible` until the
 * validation pipeline says otherwise, which it currently cannot.
 */
export function readinessForChapter(chapterId: string): ReadinessProfile {
  const resolved = resolveChapter(chapterId);
  if (!resolved) {
    return {
      curriculum: 'unverified', instruction: 'none',
      practice: 'insufficient_bank', growth: 'not_eligible',
    };
  }

  const verification = resolved.officialRecord.verificationStatus;
  const curriculum =
    verification === 'primary_source_verified' ||
    verification === 'source_verified' ||
    verification === 'teacher_verified'
      ? ('primary_source_verified' as const)
      : verification === 'secondary_corroborated'
        ? ('secondary_corroborated' as const)
        : ('unverified' as const);

  const inv = resolved.inventory;
  const instruction =
    inv.handAuthoredLessonCount === 0
      ? ('none' as const)
      : inv.handAuthoredLessonCount < inv.mapping.skillCount
        ? ('draft' as const)
        : ('prototype' as const);

  // Practice is usable only when at least two skills have items —
  // the same rule the mixed-practice launcher enforces.
  const skillsWithItems = Object.values(inv.itemsPerSkill).filter(
    (n) => n > 0
  ).length;
  const practice =
    inv.totalItemCount === 0 || skillsWithItems < 2
      ? ('insufficient_bank' as const)
      : ('usable' as const);

  // v0.56 §12 — derived, not hardcoded. Returns 'not_eligible' for
  // every chapter because the evidence says so, and will move on its
  // own when the evidence changes.
  const growth = currentGrowthReadinessFor().status;
  void blueprintForChapter(chapterId);

  return { curriculum, instruction, practice, growth };
}

function Cell({ label, tone }: { label: string; tone: 'ok' | 'partial' | 'none' }) {
  const cls =
    tone === 'ok'
      ? 'bg-emerald-50 text-emerald-900 ring-emerald-200'
      : tone === 'partial'
        ? 'bg-amber-50 text-amber-900 ring-amber-200'
        : 'bg-slate-50 text-slate-600 ring-slate-200';
  return (
    <td className="p-1 align-top">
      {/* Status is carried by TEXT; colour only reinforces it. */}
      <span className={`inline-block rounded-lg px-2 py-1 text-xs ring-1 ${cls}`}>
        {label}
      </span>
    </td>
  );
}

const curriculumTone = (p: ReadinessProfile) =>
  p.curriculum === 'primary_source_verified' || p.curriculum === 'mapping_reviewed'
    ? 'ok' : p.curriculum === 'unverified' ? 'none' : 'partial';
const instructionTone = (p: ReadinessProfile) =>
  p.instruction === 'published' || p.instruction === 'reviewed'
    ? 'ok' : p.instruction === 'none' ? 'none' : 'partial';
const practiceTone = (p: ReadinessProfile) =>
  p.practice === 'published' || p.practice === 'reviewed'
    ? 'ok' : p.practice === 'insufficient_bank' ? 'none' : 'partial';
const growthTone = (p: ReadinessProfile) =>
  p.growth === 'operational' ? 'ok' : p.growth === 'not_eligible' ? 'none' : 'partial';

/**
 * v0.55 §12 — the single canonical Admin view.
 *
 * Replaces the two overlapping tables the v0.54 audit found. One row
 * per chapter, all four axes plus source status, filterable. No
 * information was removed: source status and module id, previously in
 * the separate coverage table, are columns here.
 */
export function ReadinessMatrix({ grades }: { grades: Grade[] }) {
  const [gradeFilter, setGradeFilter] = useState<Grade | 'all'>('all');
  const [axisFilter, setAxisFilter] = useState<
    'all' | 'curriculum_unverified' | 'learn_none' | 'practice_thin' | 'growth_blocked'
  >('all');

  const allRows = useMemo(
    () =>
      grades.flatMap((g) =>
        chaptersForStudentGrade(g).map((c) => {
          const resolved = resolveChapter(c.chapterId);
          return {
            grade: g,
            chapterId: c.chapterId,
            title: studentChapterTitle(c.title, c.legacyModuleId),
            officialNumber: resolved?.officialRecord.officialChapterNumber ?? null,
            moduleId: c.legacyModuleId ?? '—',
            readiness: readinessForChapter(c.chapterId),
          };
        })
      ),
    [grades.join(',')]
  );

  // §7 — an "official unit" is one with a recorded official chapter
  // number. A legacy Pragati module has none and is never counted.
  const officialIdentified = allRows.filter((r) => r.officialNumber !== null).length;
  const officialVerified = allRows.filter(
    (r) => r.readiness.curriculum === 'primary_source_verified'
  ).length;

  const evidenceGate = evaluateFrameworkEvidenceGate();
  const pilotAuth = authorizePilotFramework({
    reviews: CURRENT_REVIEWS,
    adjudications: CURRENT_ADJUDICATIONS,
    frameworkVersion: 'v0.60-candidate',
  });

  const rows = allRows.filter((r) => {
    if (gradeFilter !== 'all' && r.grade !== gradeFilter) return false;
    switch (axisFilter) {
      case 'curriculum_unverified':
        return r.readiness.curriculum !== 'primary_source_verified';
      case 'learn_none':
        return r.readiness.instruction === 'none';
      case 'practice_thin':
        return r.readiness.practice === 'insufficient_bank';
      case 'growth_blocked':
        return r.readiness.growth === 'not_eligible';
      default:
        return true;
    }
  });

  const chip = (active: boolean) =>
    `inline-flex min-h-[44px] items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
      active
        ? 'bg-brand-50 text-brand-700 ring-brand-200'
        : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
    }`;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Admin & Research"
        title="Curriculum & readiness"
        subtitle="Track curriculum mapping, learning content, practice, and Growth readiness for each Pragati unit. A unit can be ready to teach and not eligible for Growth — that is the normal state, not a fault."
      />

      {/* v0.57 §10 — the evidence requirements shown here are read
          from REQUIRED_EVIDENCE, so the UI cannot drift from what the
          gate actually enforces. v0.56's report said only two steps
          remained; the code required three sources. */}
      {/* v0.60 §16 — field-test readiness. Answers, in one place: what
          is blocking a pilot, and what is the item bank's real state? */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">
          Field-test readiness
        </h2>
        <dl className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">
            <dt className="font-semibold text-slate-600">Formal items authored</dt>
            <dd className="text-slate-900">{growthItemRecords.length}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">
            <dt className="font-semibold text-slate-600">Specifications</dt>
            <dd className="text-slate-900">
              {RATIONAL_NUMBER_SPECIFICATIONS.length} drafted ·{' '}
              {
                RATIONAL_NUMBER_SPECIFICATIONS.filter(
                  (x) => x.reviewStatus !== 'draft'
                ).length
              }{' '}
              reviewed
            </dd>
          </div>
          <div className="rounded-lg bg-amber-50 p-2 ring-1 ring-amber-200">
            <dt className="font-semibold text-amber-800">Pilot status</dt>
            <dd className="text-amber-900">
              {pilotAuth.authorized ? 'Authorized' : 'Blocked'}
            </dd>
          </div>
        </dl>
        <div className="mt-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            What is blocking a pilot
          </div>
          <ul className="mt-1 list-disc space-y-0.5 break-words pl-5 text-xs text-slate-700">
            {pilotAuth.adminBlockers.slice(0, 6).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          {STORAGE_MATURITY_NOTE}
        </p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-900">
          Framework evidence status
        </h2>
        <p className="mt-1 text-xs text-slate-600">{evidenceGate.reason}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Required before expert review
            </div>
            <ul className="mt-1 space-y-0.5 text-xs">
              {REQUIRED_EVIDENCE.filter((e) => e.requiredFor === 'expert_review').map((e) => (
                <li key={e.id} className={sourceInspected(e.id) ? 'text-emerald-800' : 'text-amber-800'}>
                  {sourceInspected(e.id) ? '✓' : '•'} {e.title}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Required before pilot freeze
            </div>
            <ul className="mt-1 space-y-0.5 text-xs">
              {REQUIRED_EVIDENCE.filter((e) => e.requiredFor === 'pilot_freeze').map((e) => (
                <li key={e.id} className={sourceInspected(e.id) ? 'text-emerald-800' : 'text-amber-800'}>
                  {sourceInspected(e.id) ? '✓' : '•'} {e.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-1.5">
          <button className={chip(gradeFilter === 'all')} onClick={() => setGradeFilter('all')}>
            All classes
          </button>
          {grades.map((g) => (
            <button key={g} className={chip(gradeFilter === g)} onClick={() => setGradeFilter(g)}>
              Class {g.replace('class', '')}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {([
            ['all', 'All rows'],
            ['curriculum_unverified', 'Source not verified'],
            ['learn_none', 'No lessons'],
            ['practice_thin', 'Practice thin'],
            ['growth_blocked', 'Growth not eligible'],
          ] as const).map(([k, label]) => (
            <button key={k} className={chip(axisFilter === k)} onClick={() => setAxisFilter(k)}>
              {label}
            </button>
          ))}
        </div>
        {/* v0.56 §7 — these are Pragati's INTERNAL units. Calling them
            "chapters" implied they were official curriculum chapters,
            which most are not. Official counts are reported separately
            below so the difference is visible rather than blurred. */}
        <p className="mt-2 text-xs text-slate-500">
          Showing {rows.length} of {allRows.length} Pragati units.
        </p>
        <dl className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">
            <dt className="font-semibold text-slate-600">Pragati units</dt>
            <dd className="text-slate-900">{allRows.length}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">
            <dt className="font-semibold text-slate-600">
              Official units identified
            </dt>
            <dd className="text-slate-900">{officialIdentified}</dd>
          </div>
          <div className="rounded-lg bg-amber-50 p-2 ring-1 ring-amber-200">
            <dt className="font-semibold text-amber-800">
              Official units source verified
            </dt>
            <dd className="text-amber-900">{officialVerified}</dd>
          </div>
        </dl>
      </Card>

      {/* v0.56 §13 — compact cards on phones. A 6-column table on a
          390px screen technically does not overflow (it scrolls), but
          reading a row means scrolling sideways four times. Same data,
          same filters; different shape. */}
      <div className="space-y-2 sm:hidden">
        {rows.map((r) => (
          <Card key={r.chapterId}>
            <div className="text-sm font-semibold text-slate-900">
              Class {r.grade.replace('class', '')} ·{' '}
              {r.officialNumber !== null ? `${r.officialNumber}. ` : ''}
              {r.title}
            </div>
            {/* v0.57 §14 — raw internal IDs are diagnostics, not
                curriculum-management information. Kept available, not
                shown by default. */}
            <details className="mt-1">
              <summary className="min-h-[44px] cursor-pointer text-[11px] text-slate-400">
                Technical details
              </summary>
              <code className="text-[11px] text-slate-500">{r.moduleId}</code>
            </details>
            <dl className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Curriculum</dt>
                <dd className="text-right font-medium text-slate-800">
                  {CURRICULUM_STATUS_LABEL[r.readiness.curriculum]}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Learn</dt>
                <dd className="text-right font-medium text-slate-800">
                  {INSTRUCTION_STATUS_LABEL[r.readiness.instruction]}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Practice</dt>
                <dd className="text-right font-medium text-slate-800">
                  {PRACTICE_STATUS_LABEL[r.readiness.practice]}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Growth</dt>
                <dd className="text-right font-medium text-slate-800">
                  {GROWTH_STATUS_LABEL[r.readiness.growth]}
                </dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      <Card className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-1">Class / Pragati unit</th>
                <th className="p-1">Technical</th>
                <th className="p-1">Curriculum</th>
                <th className="p-1">Learn</th>
                <th className="p-1">Practice</th>
                <th className="p-1">Growth</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.chapterId} className="border-t border-slate-100">
                  <td className="p-1 align-top">
                    <div className="font-medium text-slate-900">
                      {r.officialNumber !== null ? `${r.officialNumber}. ` : ''}
                      {r.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Class {r.grade.replace('class', '')}
                    </div>
                  </td>
                  <td className="p-1 align-top">
                    <details>
                      <summary className="inline-flex min-h-[44px] cursor-pointer items-center text-[11px] text-slate-400">
                        Details
                      </summary>
                      <code className="text-[11px] text-slate-500">{r.moduleId}</code>
                    </details>
                  </td>
                  <Cell
                    label={CURRICULUM_STATUS_LABEL[r.readiness.curriculum]}
                    tone={curriculumTone(r.readiness)}
                  />
                  <Cell
                    label={INSTRUCTION_STATUS_LABEL[r.readiness.instruction]}
                    tone={instructionTone(r.readiness)}
                  />
                  <Cell
                    label={PRACTICE_STATUS_LABEL[r.readiness.practice]}
                    tone={practiceTone(r.readiness)}
                  />
                  <Cell
                    label={GROWTH_STATUS_LABEL[r.readiness.growth]}
                    tone={growthTone(r.readiness)}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/** Teacher Resources view: same data, teacher wording, no Growth
 *  governance detail. */
export function teacherReadinessSummary(p: ReadinessProfile): string {
  const parts: string[] = [];
  parts.push(
    p.instruction === 'none' ? 'Lessons coming' : 'Lessons available'
  );
  parts.push(
    p.practice === 'insufficient_bank' ? 'Practice coming' : 'Practice ready'
  );
  if (p.curriculum === 'primary_source_verified') {
    parts.push('Checked against the official textbook');
  }
  return parts.join(' · ');
}
