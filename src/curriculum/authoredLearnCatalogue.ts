// ===========================================================================
// v0.84.0-rc.2 checkpoint 45 — THE AUTHORED-LEARN CATALOGUE.
//
// Checkpoint 44 found the release blocker: 92 authored Class 9 lessons that
// no student could reach. The cause was not the lessons. The student chapter
// list is built from assessment-item inventory, and Class 9 has authored
// instruction with no item bank — so it looked empty.
//
// This derives a student catalogue from the two things that actually decide
// it: the verified official chapter list, and the authored artifact
// registry. No second hand-maintained lesson list exists, so the authoring
// registry and the student catalogue cannot drift.
//
// IDENTITY. A lesson is identified by `contentArtifactId`, never by
// `officialSectionId`. Several official sections split into two lessons,
// some lessons merge two sections, and Chapter 9's lessons have no section
// at all. A section id is provenance; it is not unique lesson identity.
//
// The model is grade-general. Class 9 is the only grade with authored
// Secondary-stage content today, and Class 6 keeps its own established
// surface untouched.
// ===========================================================================

import { OFFICIAL_CHAPTERS } from './officialChapters';
import { allAuthoredSections } from './authoredSections';
import { artifactSourceKind } from './authoredSection';
import { mayDeliverAuthoredLesson } from './authoredLearnAccess';
import type { AuthoredSection } from './authoredSection';

export type AuthoredLearnLesson = {
  /** The route key. Unique across the grade. */
  contentArtifactId: string;
  /** Position within its chapter, from 1. */
  position: number;
  title: string;
  /** What the lesson is for, in the student's words. */
  goal: string;
  section: AuthoredSection;
};

export type AuthoredLearnChapter = {
  officialChapterId: string;
  number: number;
  title: string;
  bookPart: string | null;
  lessons: AuthoredLearnLesson[];
  /** Standalone lesson count — the student denominator for this chapter. */
  lessonCount: number;
};

export type AuthoredLearnCatalogue = {
  grade: string;
  chapters: AuthoredLearnChapter[];
  /** Every lesson across the grade, in chapter then position order. */
  lessons: AuthoredLearnLesson[];
  /** The grade-wide student denominator. NOT the instructional unit count. */
  lessonCount: number;
};

/**
 * A student-facing lesson title. The authored artifact carries a learning
 * goal and a source title; neither is a lesson name, and the source title
 * repeats across split siblings. This takes the first clause of the goal,
 * which is what the lesson actually teaches.
 */
function lessonTitle(section: AuthoredSection): string {
  const goal = section.learningGoal.trim();
  const stripped = goal.replace(/^You will\s+/i, '');
  const first = stripped.split(/,| and then | and afterwards /)[0].trim();
  const text = first.length > 12 ? first : stripped;
  const clipped = text.length > 72 ? `${text.slice(0, 69).trimEnd()}…` : text;
  return clipped.charAt(0).toUpperCase() + clipped.slice(1);
}

/**
 * Catalogue for a grade. Chapters come from the verified official registry
 * in printed order; lessons come from the authored registry in the order
 * the chapter module returns them, which is the book's order and is
 * asserted as such by test rather than assumed from object insertion.
 *
 * A chapter with no authored lessons is omitted: this is the LEARN
 * catalogue, and a chapter with nothing to learn is not a Learn chapter.
 */
export function authoredLearnCatalogueForGrade(grade: string): AuthoredLearnCatalogue {
  return buildCatalogue(grade, { forReview: false });
}

/**
 * v0.84.0-review.1 checkpoint 48 — the same catalogue, for human review.
 *
 * Review deliberately does NOT depend on student delivery eligibility: a
 * reviewer's whole job is to look at unreviewed content, and gating review
 * behind the student gate would make the lessons unreviewable until they
 * were reviewed. This widens nothing for students — it is reached only from
 * the review surfaces, and `authoredLearnCatalogueForGrade` is unchanged.
 */
export function authoredLearnCatalogueForReview(grade: string): AuthoredLearnCatalogue {
  return buildCatalogue(grade, { forReview: true });
}

function buildCatalogue(
  grade: string,
  { forReview }: { forReview: boolean }
): AuthoredLearnCatalogue {
  // v0.84.0-rc.3 checkpoint 46 — eligibility is applied HERE, at the source
  // of every student route. Filtering the chapter list alone would leave
  // direct artifact navigation open; filtering the catalogue closes the
  // chapter route and the lesson route with it, because both read this.
  const authored = forReview
    ? allAuthoredSections()
    : allAuthoredSections().filter(mayDeliverAuthoredLesson);
  const byChapter = new Map<string, AuthoredSection[]>();
  for (const s of authored) {
    const list = byChapter.get(s.source.officialChapterId) ?? [];
    list.push(s);
    byChapter.set(s.source.officialChapterId, list);
  }

  const chapters: AuthoredLearnChapter[] = OFFICIAL_CHAPTERS.filter(
    (c): c is typeof c & { officialChapterNumber: number; officialTitle: string } =>
      c.grade === grade && c.officialChapterNumber !== null && c.officialTitle !== null
  )
    .slice()
    .sort((a, b) => a.officialChapterNumber - b.officialChapterNumber)
    .map((c) => {
      const sections = byChapter.get(c.officialChapterId) ?? [];
      return {
        officialChapterId: c.officialChapterId,
        number: c.officialChapterNumber,
        title: c.officialTitle,
        bookPart: (c as { bookPart?: string | null }).bookPart ?? null,
        lessons: sections.map((section, i) => ({
          contentArtifactId: section.contentArtifactId,
          position: i + 1,
          title: lessonTitle(section),
          goal: section.learningGoal,
          section,
        })),
        lessonCount: sections.length,
      };
    })
    .filter((ch) => ch.lessonCount > 0);

  const lessons = chapters.flatMap((c) => c.lessons);
  return { grade, chapters, lessons, lessonCount: lessons.length };
}

/** One lesson by its route key, or null. */
export function authoredLessonById(
  grade: string,
  contentArtifactId: string
): AuthoredLearnLesson | null {
  return (
    authoredLearnCatalogueForGrade(grade).lessons.find(
      (l) => l.contentArtifactId === contentArtifactId
    ) ?? null
  );
}

/** Does this grade have a student Learn catalogue at all? */
export function hasAuthoredLearn(grade: string): boolean {
  return authoredLearnCatalogueForGrade(grade).lessonCount > 0;
}

/**
 * v0.84.0-rc.3 checkpoint 46 — the dead `isAuthoredLearnPreviewable()` that
 * stood here described the boundary without enforcing it, and nothing
 * called it. The decision now lives in `authoredLearnAccess` and is asked
 * by the catalogue below, so an ineligible artifact never reaches a route.
 */

/** The source-kind-aware student reference for a lesson. Never fabricated. */
export function studentSourceReference(section: AuthoredSection): string {
  return artifactSourceKind(section.source) === 'source_segment'
    ? section.source.exactTitle
    : `${section.source.sectionNumber} · ${section.source.exactTitle}`;
}
