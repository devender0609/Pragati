// ===========================================================================
// v0.84.0-review.1 checkpoint 48 — WHAT A REVIEWER SEES.
//
// `ChapterReviewPreview` is written about Fractions. Rather than widen it
// and risk disturbing the frozen §7.4 package, this is a general surface
// over the Class 9 review packages.
//
// It renders the lesson through `learnContentFor()` → `LearnSectionView` —
// the same pipeline the student route uses — because a reviewer must judge
// what a student would actually see, not a second rendering of the same
// words.
//
// Reviewers see source, pages, objective, version and review code. They do
// not see unit ids, segment ids or field names: full machine identity lives
// in the export, not on the screen.
// ===========================================================================

import { useMemo, useState } from 'react';
import { class9ChapterReviewPackages } from '../../curriculum/class9ReviewReadiness';
import { class9ReviewCandidates } from '../../curriculum/artifactReview';
import { CLASS9_REVIEW_BUILD } from '../../curriculum/class9ReviewBuild';
import { allAuthoredSections } from '../../curriculum/authoredSections';
import { learnContentFor } from '../learn/learnSectionContent';
import { LearnSectionView } from '../learn/LearnSectionView';

export function Class9ReviewSurface() {
  const packages = useMemo(() => class9ChapterReviewPackages(), []);
  const candidates = useMemo(
    () => class9ReviewCandidates(CLASS9_REVIEW_BUILD.reviewBuildId),
    []
  );
  const sections = useMemo(
    () => new Map(allAuthoredSections().map((s) => [s.contentArtifactId, s] as const)),
    []
  );
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const [openLesson, setOpenLesson] = useState<string | null>(null);

  if (openLesson) {
    const candidate = candidates.find((c) => c.contentArtifactId === openLesson)!;
    const section = sections.get(openLesson)!;
    return (
      <section className="space-y-4" data-review-lesson={openLesson}>
        <button type="button" onClick={() => setOpenLesson(null)} className="tap text-sm font-semibold text-slate-600">
          ← Back to the chapter
        </button>

        {/* What the reviewer is judging, and what it came from. */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Review code</p>
          <p className="font-mono text-base font-bold text-slate-900">{candidate.reviewCode}</p>
          <dl className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            <div><dt className="text-xs text-slate-500">Chapter</dt><dd className="font-medium text-slate-800">{`${candidate.chapterNumber} · ${candidate.chapterTitle}`}</dd></div>
            <div><dt className="text-xs text-slate-500">Lesson version</dt><dd className="font-medium text-slate-800">{candidate.contentArtifactVersion}</dd></div>
            <div className="sm:col-span-2"><dt className="text-xs text-slate-500">Source</dt><dd className="font-medium text-slate-800">{candidate.sourceDescription}</dd></div>
            <div className="sm:col-span-2"><dt className="text-xs text-slate-500">What this lesson teaches</dt><dd className="font-medium text-slate-800">{candidate.learningGoal}</dd></div>
          </dl>
          <p className="mt-3 text-xs font-semibold text-amber-800">
            {`${candidate.questionCount} review questions apply to this lesson. It has not been reviewed.`}
          </p>
        </div>

        {/* The actual rendered lesson — the same component a student gets. */}
        <LearnSectionView content={learnContentFor(section)} visualsById={section.visualsById} />
      </section>
    );
  }

  if (openChapter) {
    const pkg = packages.find((p) => p.officialChapterId === openChapter)!;
    return (
      <section className="space-y-3">
        <button type="button" onClick={() => setOpenChapter(null)} className="tap text-sm font-semibold text-slate-600">
          ← All chapters
        </button>
        <h2 className="text-xl font-extrabold text-slate-900">{`Chapter ${pkg.chapterNumber} · ${pkg.chapterTitle}`}</h2>
        <ol className="space-y-2">
          {pkg.lessons.map((l) => (
            <li key={l.contentArtifactId}>
              <button
                type="button"
                data-review-code={l.reviewCode}
                onClick={() => setOpenLesson(l.contentArtifactId)}
                className="tap w-full rounded-2xl border border-slate-200 bg-white p-3 text-left hover:border-slate-400"
              >
                <span className="block text-sm font-bold text-slate-900">{`${l.position}. ${l.lessonTitle}`}</span>
                <span className="mt-0.5 block font-mono text-xs text-slate-500">{l.reviewCode}</span>
                <span className="mt-1 block text-xs text-slate-600">{`${l.questionCount} questions · ${l.ready ? 'ready for review' : 'not ready'}`}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  const total = packages.reduce((a, p) => a + p.lessonCount, 0);
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900">Class 9 review</h2>
        <p className="text-sm text-slate-600">{`${packages.length} chapters · ${total} lessons awaiting review`}</p>
        <p className="font-mono text-xs text-slate-500">{CLASS9_REVIEW_BUILD.reviewBuildId}</p>
      </header>
      <ul className="grid gap-2 sm:grid-cols-2">
        {packages.map((p) => (
          <li key={p.officialChapterId}>
            <button
              type="button"
              onClick={() => setOpenChapter(p.officialChapterId)}
              className="tap w-full rounded-2xl border border-slate-200 bg-white p-3 text-left hover:border-slate-400"
            >
              <span className="block text-sm font-bold text-slate-900">{`Chapter ${p.chapterNumber} · ${p.chapterTitle}`}</span>
              <span className="mt-0.5 block text-xs text-slate-600">{`${p.lessonCount} lessons`}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
