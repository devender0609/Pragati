// ===========================================================================
// v0.81 §A — ONE REGISTRY, EVERY CHAPTER.
//
// THE DEFECT THIS FIXES
//
// The review-package system reached `fractionsChapterSections()` and
// `authoredSectionById()` directly from `fractionsChapter.ts`. Both
// names say "fractions" and both were the only way in, so the entire
// apparatus — package generation, fingerprinting, the reviewer
// questions, the readiness assessment — could only see one chapter.
//
// That was invisible while Fractions was the only authored chapter. The
// moment Number Play §3.1 and §3.2 were written, they became content
// with no route to a reviewer: complete drafts that the packaging
// system did not know existed, and therefore would never report as
// waiting. A backlog you cannot see is worse than a long one.
//
// WHAT THIS DOES NOT DO
//
// It does not merge the chapters into one pile. Review is chapter-scoped
// in practice — a reviewer reads a chapter, not a product — so every
// function here takes or reports a chapter, and the callers that were
// legitimately Fractions-scoped stay Fractions-scoped. What changes is
// that the scope is now a parameter instead of a hard-coded import.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { fractionsChapterSections } from './fractionsChapter';
import { numberPlayChapterSections } from './numberPlaySections';

export const FRACTIONS_CHAPTER_ID = 'ncert_gp_c6_ch07_fractions';
export const NUMBER_PLAY_CHAPTER_ID = 'ncert_gp_c6_ch03_number_play';

/**
 * Every chapter that has authored content, with its sections.
 *
 * Adding a chapter means adding one line here. If that line is
 * forgotten, `v081ReviewCoverage.test.ts` fails: it walks the authored
 * files and asserts each chapter with authored sections appears in this
 * registry, so a chapter cannot be authored into invisibility again.
 */
export const AUTHORED_CHAPTERS: Array<{
  officialChapterId: string;
  title: string;
  sections: () => AuthoredSection[];
}> = [
  {
    officialChapterId: NUMBER_PLAY_CHAPTER_ID,
    title: 'Number Play',
    sections: numberPlayChapterSections,
  },
  {
    officialChapterId: FRACTIONS_CHAPTER_ID,
    title: 'Fractions',
    sections: fractionsChapterSections,
  },
];

/** Every authored section in the product, across chapters. */
export function allAuthoredSections(): AuthoredSection[] {
  return AUTHORED_CHAPTERS.flatMap((c) => c.sections());
}

export function authoredSectionsForChapter(
  officialChapterId: string
): AuthoredSection[] {
  return (
    AUTHORED_CHAPTERS.find((c) => c.officialChapterId === officialChapterId)
      ?.sections() ?? []
  );
}

/**
 * Look a section up by id, anywhere.
 *
 * This is the function the packaging system needed and did not have.
 * The Fractions-scoped one of the same name still exists in
 * `fractionsChapter.ts` and is still correct for its own callers; this
 * one is the cross-chapter reading.
 */
export function anyAuthoredSectionById(
  officialSectionId: string
): AuthoredSection | null {
  return (
    allAuthoredSections().find(
      (s) => s.source.officialSectionId === officialSectionId
    ) ?? null
  );
}

export function chapterIdForSection(officialSectionId: string): string | null {
  return (
    anyAuthoredSectionById(officialSectionId)?.source.officialChapterId ?? null
  );
}
