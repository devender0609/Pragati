// v0.48 §9 — Teacher Resources tab body.
//
// Grade-aware, never routes to the Class-6-only dashboard. Lists the
// chapters registered for the grade the teacher selected. Each row
// links to that chapter's lesson (opens LearnView for a skill).

import { useState } from 'react';
import { PageHeader } from '../../design/primitives/PageHeader';
import { Card } from '../../design/primitives/Card';
import { StatusBadge } from '../../design/primitives/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { chaptersForStudentGrade } from '../student/StudentShell';
import { isClass6Core, dispositionFor } from '../../curriculum/legacyDisposition';
import type { Grade } from '../../types';

const GRADE_OPTIONS: Grade[] = [
  'class1', 'class2', 'class3', 'class4', 'class5', 'class6',
  'class7', 'class8', 'class9', 'class10', 'class11', 'class12',
];

export function TeacherResourcesBody({
  onOpenChapter,
}: {
  /** v0.49 §9 — opens the chapter resource page INSIDE TeacherShell.
   *  v0.48 opened a single skill's LearnView outside the shell and
   *  implied it was the chapter. */
  onOpenChapter: (chapterId: string) => void;
}) {
  const [grade, setGrade] = useState<Grade>('class6');

  // v0.63 §3 — the ordinary grid follows the CURRENT official
  // curriculum. v0.62 showed "these topics are no longer shown to Class
  // 6 students" directly above Class 6 cards for Decimals, Ratio &
  // Proportion and Algebra Basics marked "ready for review" — a
  // contradiction that undermined the correction it sat next to.
  //
  // The items are not deleted. They move to a clearly separate panel
  // below, labelled as awaiting a curriculum decision.
  const allChapters = chaptersForStudentGrade(grade);
  const chapters = allChapters.filter((c) => isClass6Core(c.legacyModuleId ?? ''));
  const displaced =
    grade === 'class6'
      ? allChapters.filter((c) => !isClass6Core(c.legacyModuleId ?? ''))
      : [];

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Resources"
        title="Teacher resources"
        subtitle="Pick a class, then open a chapter to see what it contains."
      />

      <Card>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Class
        </label>
        <div className="mt-1 flex flex-wrap gap-1">
          {GRADE_OPTIONS.map((g) => {
            const active = g === grade;
            return (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`inline-flex min-h-[44px] items-center rounded-lg px-3 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500  ring-1 transition ${
                  active
                    ? 'bg-brand-50 text-brand-700 ring-brand-200'
                    : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                Class {g.replace('class', '')}
              </button>
            );
          })}
        </div>
      </Card>

      {displaced.length > 0 && (
        <section className="rounded-lg border border-slate-300 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Legacy content awaiting a curriculum decision
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            These were written for the previous Class 6 textbook. The
            current book teaches them in later years, so they are not
            part of Class 6 and cannot be assigned as Class 6 work.
            Nothing has been deleted.
          </p>
          <ul className="mt-3 space-y-2">
            {displaced.map((c) => {
              const d = dispositionFor(c.legacyModuleId ?? '');
              return (
                <li
                  key={c.chapterId}
                  className="rounded border border-slate-200 bg-white p-3 text-sm"
                >
                  <span className="font-medium text-slate-800">{c.title}</span>
                  <span className="ml-2 text-slate-500">
                    {c.itemCount} questions
                  </span>
                  {d?.evidencedHome && (
                    <p className="mt-1 text-slate-600">
                      Now taught in{' '}
                      {d.evidencedHome.replace('Ganita Prakash ', '')}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {chapters.length === 0 ? (
        <EmptyState
          title="No chapters yet"
          message={`Class ${grade.replace('class', '')} has no chapters ready in Pragati yet.`}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {chapters.map((c) => {
            return (
              <Card key={c.chapterId}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {c.title}
                  </div>
                  <StatusBadge status={c.inventory.status} title={c.inventory.reasons.join(' ')} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{c.subtitle}</p>
                <div className="mt-3">
                  <button
                    onClick={() => onOpenChapter(c.chapterId)}
                    className="min-h-[44px] rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    Open chapter resources
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
