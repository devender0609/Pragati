// ===========================================================================
// v0.84.0-rc.2 checkpoint 45 — THE STUDENT ROUTE TO AUTHORED LESSONS.
//
// Three screens over the catalogue: chapters, one chapter's lessons, one
// lesson. The lesson screen renders the SAME `LearnSectionView` through the
// SAME `learnContentFor()` the review preview uses — there is no second
// renderer, so what a reviewer approves is what a student sees.
//
// Copy is student copy. No status, no provenance, no "source segment", no
// section numbering where the book prints none.
// ===========================================================================

import { useMemo } from 'react';
import {
  authoredLearnCatalogueForGrade,
  authoredLessonById,
} from '../../curriculum/authoredLearnCatalogue';
import { learnContentFor } from '../learn/learnSectionContent';
import { LearnSectionView } from '../learn/LearnSectionView';
import { completedLessons, learnProgressFor, markLessonComplete } from './learnProgress';
import { authoredLearnPreviewEnabled } from '../../curriculum/authoredLearnAccess';

function ProgressPill({ done, total }: { done: number; total: number }) {
  const complete = total > 0 && done === total;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        complete ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
      }`}
    >
      {complete ? 'Completed' : `${done} of ${total} done`}
    </span>
  );
}

/**
 * v0.84.0-rc.3 checkpoint 46 — a tester must be able to tell an internal
 * preview build from a public one. It says what the content is, once, at
 * the top of the catalogue — not inside every lesson, where reviewer
 * vocabulary would contaminate ordinary student copy.
 */
function InternalPreviewNotice() {
  if (!authoredLearnPreviewEnabled()) return null;
  return (
    <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
      Internal preview — unreviewed learning content
    </p>
  );
}

export function AuthoredChapterList({
  grade,
  studentId,
  onOpenChapter,
}: {
  grade: string;
  studentId: string;
  onOpenChapter: (officialChapterId: string) => void;
}) {
  const catalogue = useMemo(() => authoredLearnCatalogueForGrade(grade), [grade]);
  const done = completedLessons(studentId);
  const total = catalogue.lessonCount;
  const doneCount = catalogue.lessons.filter((l) => done.includes(l.contentArtifactId)).length;

  return (
    <section className="space-y-4">
      <InternalPreviewNotice />
      <header className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900">Your chapters</h2>
        <p className="text-sm text-slate-600">
          {`${catalogue.chapters.length} chapters from your textbook · ${total} lessons`}
        </p>
        <ProgressPill done={doneCount} total={total} />
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {catalogue.chapters.map((ch) => {
          const p = learnProgressFor(
            studentId,
            ch.lessons.map((l) => l.contentArtifactId)
          );
          return (
            <li key={ch.officialChapterId}>
              <button
                type="button"
                onClick={() => onOpenChapter(ch.officialChapterId)}
                className="tap w-full rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-slate-400"
              >
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {`Chapter ${ch.number}`}
                </span>
                <span className="mt-0.5 block text-base font-bold text-slate-900">{ch.title}</span>
                <span className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {ch.lessonCount === 1 ? '1 lesson' : `${ch.lessonCount} lessons`}
                  </span>
                  <ProgressPill done={p.done} total={p.total} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AuthoredLessonList({
  grade,
  studentId,
  officialChapterId,
  onOpenLesson,
  onBack,
}: {
  grade: string;
  studentId: string;
  officialChapterId: string;
  onOpenLesson: (contentArtifactId: string) => void;
  onBack: () => void;
}) {
  const chapter = useMemo(
    () =>
      authoredLearnCatalogueForGrade(grade).chapters.find(
        (c) => c.officialChapterId === officialChapterId
      ) ?? null,
    [grade, officialChapterId]
  );
  const done = completedLessons(studentId);
  if (!chapter) return null;

  return (
    <section className="space-y-4">
      <button type="button" onClick={onBack} className="tap text-sm font-semibold text-slate-600">
        ← All chapters
      </button>
      <header className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {`Chapter ${chapter.number}`}
        </span>
        <h2 className="text-xl font-extrabold text-slate-900">{chapter.title}</h2>
        <ProgressPill
          done={chapter.lessons.filter((l) => done.includes(l.contentArtifactId)).length}
          total={chapter.lessonCount}
        />
      </header>

      <ol className="space-y-2">
        {chapter.lessons.map((lesson) => {
          const isDone = done.includes(lesson.contentArtifactId);
          return (
            <li key={lesson.contentArtifactId}>
              <button
                type="button"
                data-artifact-id={lesson.contentArtifactId}
                onClick={() => onOpenLesson(lesson.contentArtifactId)}
                className="tap flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-slate-400"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                  {lesson.position}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-900">{lesson.title}</span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-slate-600">
                  {isDone ? 'Completed' : 'Start'}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function AuthoredLessonRoute({
  grade,
  studentId,
  contentArtifactId,
  onBack,
  onFinished,
}: {
  grade: string;
  studentId: string;
  contentArtifactId: string;
  onBack: () => void;
  onFinished: () => void;
}) {
  // v0.84.0-rc.3 checkpoint 46 — DIRECT-ROUTE DEFENCE.
  //
  // `authoredLessonById` reads the eligibility-filtered catalogue, so a
  // caller handing this component an artifact id cannot render an
  // ineligible draft. Hiding the button is not the protection; the lookup
  // returning nothing is.
  const lesson = useMemo(
    () => authoredLessonById(grade, contentArtifactId),
    [grade, contentArtifactId]
  );
  if (!lesson) return null;

  return (
    <section className="space-y-3" data-lesson-route={contentArtifactId}>
      <button type="button" onClick={onBack} className="tap text-sm font-semibold text-slate-600">
        ← Back to the chapter
      </button>
      <LearnSectionView
        content={learnContentFor(lesson.section)}
        visualsById={lesson.section.visualsById}
        onFinish={() => {
          markLessonComplete(studentId, contentArtifactId);
          onFinished();
        }}
      />
    </section>
  );
}
