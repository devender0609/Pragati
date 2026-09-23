// v0.48 §9 — Teacher Resources tab body.
//
// Grade-aware, never routes to the Class-6-only dashboard. Lists the
// chapters registered for the grade the teacher selected. Each row
// links to that chapter's lesson (opens LearnView for a skill).

import { useState } from 'react';
import { TeacherPageHeader, TeacherPanel, TeacherStat } from '../../design/TeacherKit';
import { officialCurriculumForGrade } from '../../curriculum/officialCurriculum';
import { Card } from '../../design/primitives/Card';
import { StatusBadge } from '../../design/primitives/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { chaptersForStudentGrade } from '../student/StudentShell';
import { isClass6Core } from '../../curriculum/legacyDisposition';
import type { Grade } from '../../types';

const GRADE_OPTIONS: Grade[] = [
  'class1', 'class2', 'class3', 'class4', 'class5', 'class6',
  'class7', 'class8', 'class9', 'class10', 'class11', 'class12',
];

function CurriculumDepthPanel({ grade }: { grade: Grade }) {
  const c = officialCurriculumForGrade(grade);
  const label = grade.replace('class', 'Class ');

  if (!c || c.status !== 'primary_source_verified') {
    return (
      <TeacherPanel
        title={`${label} — curriculum not yet verified`}
        detail="Pragati has not confirmed this class's official structure against a primary source, so the number of units, chapters and topics is unknown rather than zero. Nothing below is a complete list for this class."
      >
        <p className="text-sm text-ink-400">
          {c?.documentTitle
            ? `Expected source: ${c.documentTitle}.`
            : 'No source identified yet.'}
        </p>
      </TeacherPanel>
    );
  }

  const chapterDepth = c.topLevel === 'chapter';
  const namedChapters = c.units.filter((u) => u.chaptersEstablished).length;
  const topicCount = c.units.reduce((a, u) => a + u.topics.length, 0);

  return (
    <TeacherPanel
      title={`${label} — ${c.documentTitle}`}
      detail={
        chapterDepth
          ? c.units.some((u) => u.subLevelDefinedBySource === false)
            // v0.83.1 §3 — Classes 1-5 print chapters and no numbered
            // sections. Saying "0 sections" would claim the book has
            // none listed rather than none defined.
            ? `Read from the textbook itself. ${c.units.length} chapters. This book does not number sections, so there is no section count.`
            : `Read from the textbook itself, so chapters and sections are both real. ${c.units.length} chapters, ${topicCount} sections.${
                c.units.some((u) => u.bookPart)
                  ? ' Published in two parts; Part II restarts at Chapter 1, so chapters are shown with their part.'
                  : ''
              }`
          : `Read from the ${c.authority} syllabus, so units and topics are real. ${namedChapters > 0 ? `The syllabus prints chapter names for ${namedChapters} of ${c.units.length} units.` : 'The syllabus prints no chapter names, so Pragati does not show a textbook chapter list for this class.'}`
      }
      tone="learn"
    >
      <div className="flex flex-wrap gap-x-10 gap-y-4">
        <TeacherStat
          value={c.units.length}
          label={chapterDepth ? 'chapters' : 'syllabus units'}
        />
        <TeacherStat
          value={c.units.some((u) => u.subLevelDefinedBySource === false) ? '—' : topicCount || '—'}
          label={chapterDepth ? 'sections' : 'named topics'}
        />
        <TeacherStat
          value={namedChapters || (chapterDepth ? c.units.length : '—')}
          label="chapter names established"
          hint={chapterDepth ? 'from the contents page' : 'printed by the syllabus'}
        />
      </div>
    </TeacherPanel>
  );
}

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
  // v0.83.2 §4 — the Class 6 filter silently emptied every other class.
  // Class 6 keeps its curated core; the other classes show the official
  // chapters of their book, in the book's order, content or not.
  const chapters =
    grade === 'class6'
      ? allChapters.filter((c) => isClass6Core(c.legacyModuleId ?? ''))
      : allChapters.filter((c) => c.official === true);
  const displaced =
    grade === 'class6'
      ? allChapters.filter((c) => !isClass6Core(c.legacyModuleId ?? ''))
      : [];

  return (
    <div className="space-y-6">
      <TeacherPageHeader
        title="Curriculum"
        detail="The official curriculum for a class, what Pragati has for it, and what is still being prepared."
      />

      {/* v0.78 §21 — WHAT PRAGATI IS ENTITLED TO SHOW FOR THIS CLASS.
          Verification depth differs by grade and the screen must not
          flatten it: Class 6 was read from an NCERT contents page and
          can be browsed to section depth; Classes 9-12 were read from a
          CBSE syllabus, so their units are real and their textbook
          chapter denominator is not; the rest are unverified, and
          unknown is not zero. Inventing chapters for Class 10 because
          its topic titles resemble NCERT chapter names is exactly the
          error the registry's own note warns about. */}
      <CurriculumDepthPanel grade={grade} />

      <Card>
        <label className="font-display text-sm font-bold text-ink-900">
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

      {/* v0.78.1 §13 — WHAT A TEACHER NEEDS FROM THIS, AND WHAT THEY DO NOT.
          This listed every displaced legacy module with its migration
          detail: which chapter of which later-year book now teaches
          Decimals, Ratio & Proportion and Algebra. That history is a
          content-governance record — it explains a decision WE made —
          and a teacher planning Thursday's lesson needs one sentence of
          it: this is not Class 6, so you cannot assign it.
          The per-module disposition stays in Admin & Research, where
          the audit trail is the subject. */}
      {displaced.length > 0 && (
        <TeacherPanel
          title="Not part of the current Class 6 curriculum"
          detail={`${displaced.length} older ${displaced.length === 1 ? 'topic was' : 'topics were'} written for the previous Class 6 textbook. The current book teaches them in later years, so they cannot be assigned as Class 6 work. Nothing has been deleted.`}
        >
          <p className="text-sm text-ink-500">
            {displaced.map((c) => c.title).join(' · ')}
          </p>
          <p className="mt-3 text-sm text-ink-400">
            Where each one now sits in the curriculum is recorded under
            Admin &amp; Research.
          </p>
        </TeacherPanel>
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
                  <div className="text-sm font-semibold text-slate-900" data-chapter-title="official">
                    {c.title}
                  </div>
                  <StatusBadge audience="teacher" status={c.inventory.status} title={c.inventory.reasons.join(' ')} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{c.subtitle}</p>
                <div className="mt-3">
                  {/* v0.83.2 §5 — a chapter Pragati has nothing for must
                      not offer a working-looking button. The record is
                      still shown; the action is not. */}
                  {c.inventory.status === 'no_content' ? (
                    <span className="inline-flex min-h-[44px] items-center rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400 ring-1 ring-slate-200">
                      Resources not available yet
                    </span>
                  ) : (
                    <button
                      onClick={() => onOpenChapter(c.chapterId)}
                      className="min-h-[44px] rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    >
                      Open chapter resources
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
