// v0.62 §3/§4 — THE STUDENT-FACING CLASS 6 CHAPTER MODEL.
//
// WHAT THIS REPLACES
//
// v0.61's Class 6 Home rendered one card — a single legacy module —
// above two-thirds of an empty viewport. A student with 304 items and
// 22 lessons available saw a page that looked broken.
//
// WHAT IT DOES NOT DO
//
// It does not invent lessons for the five chapters with no content.
// Every one of the ten official chapters appears, in the book's order,
// and the five without content say so plainly and are not clickable.
// An honest "not available yet" is better product than a fabricated
// lesson, and far better than pretending the chapter does not exist.
//
// LANGUAGE
//
// No governance vocabulary reaches this layer. `unmapped` becomes
// "Not available yet"; `authored_draft` becomes nothing at all,
// because draft content is not offered to students. Copy follows the
// Classes 6-8 row of AGE_STAGE_CONTENT_AUTHORING_STANDARD.md: plain,
// direct, not childish.

import { OFFICIAL_CHAPTERS } from './officialChapters';
import { sectionsForChapter } from './officialSections';
// v0.63 §14 — this module no longer decides eligibility. It renders
// what the one policy decides, so the student landing cannot disagree
// with teacher coverage or the alignment report.
import {
  getStudentChapterAvailability,
  sectionEligibility,
} from './eligibilityPolicy';

// v0.63 §14 — re-exported from the policy so there is one definition.
export type { ChapterAvailability } from './eligibilityPolicy';
export type { SectionAvailability } from './eligibilityPolicy';

export type StudentChapterCard = {
  officialChapterId: string;
  /** The book's chapter number — the ordering authority. */
  number: number;
  title: string;
  availability: import('./eligibilityPolicy').ChapterAvailability;
  /** Sections in the official chapter. Shown as context, never as a
   *  progress score. */
  officialSectionCount: number;
  /** Modules a student can actually open. Excludes anything withheld
   *  under legacy disposition. */
  moduleIds: string[];
  /** Student-facing sentence. Plain language only. */
  statusLine: string;
};

/**
 * The ten official chapters, in the book's order.
 *
 * Ordering comes from `officialChapterNumber` on the verified registry —
 * NOT from legacy module order, and not from the order modules happen
 * to be declared in. `v062StudentLearn.test.ts` asserts this, because
 * the old ordering reverting silently is exactly the kind of regression
 * that would not be noticed.
 */
export function class6ChapterCards(): StudentChapterCard[] {
  return OFFICIAL_CHAPTERS.filter(
    // A Class 6 record without a chapter number cannot be placed in the
    // book's order, so it is excluded rather than guessed into position.
    (c): c is typeof c & { officialChapterNumber: number; officialTitle: string } =>
      c.grade === 'class6' &&
      c.officialChapterNumber !== null &&
      c.officialTitle !== null
  )
    .slice()
    .sort((a, b) => a.officialChapterNumber - b.officialChapterNumber)
    .map((c) => {
      const e = getStudentChapterAvailability(c.officialChapterId);
      const sectionCount = sectionsForChapter(c.officialChapterId).length;

      return {
        officialChapterId: c.officialChapterId,
        number: c.officialChapterNumber,
        title: c.officialTitle,
        availability: e.availability,
        officialSectionCount: sectionCount,
        moduleIds: e.moduleIds,
        // v0.63 §2 — "Ready to learn" now means a lesson genuinely
        // exists, not that a module is mapped.
        statusLine:
          e.availability !== 'available'
            ? 'Not available yet'
            : e.hasEligibleLearn
              ? 'Ready to learn'
              : 'Practice',
      };
    });
}

export function availableClass6Chapters(): StudentChapterCard[] {
  return class6ChapterCards().filter((c) => c.availability === 'available');
}

export function unavailableClass6Chapters(): StudentChapterCard[] {
  return class6ChapterCards().filter(
    (c) => c.availability === 'not_available_yet'
  );
}

// ---------------------------------------------------------------------------
// Chapter 7 section landing (v0.62 §12)
// ---------------------------------------------------------------------------

export type StudentSectionCard = {
  officialSectionId: string;
  sectionNumber: string;
  title: string;
  availability: import('./eligibilityPolicy').SectionAvailability;
  /** Student-safe. Never 'authored_draft' or 'mapping_candidate'. */
  statusLine: string;
  /** Skills a student can practise for this section, if any. */
  skillIds: string[];
};

/**
 * The nine official Fractions sections, as a student sees them.
 *
 * §7.4 shows `not_available_yet` despite the demonstration content
 * existing, because that content is `authored_draft` and no educator
 * has reviewed it. Draft work is visible to reviewers in Admin, never
 * to students — and the student-facing status must not hint that
 * something exists behind a curtain.
 */
export function fractionsSectionCards(): StudentSectionCard[] {
  return sectionsForChapter('ncert_gp_c6_ch07_fractions').map((s) => {
    // v0.63 §1 — THE FIX. Availability comes from explicit alignment,
    // not from `pragatiSkillIds.length > 0`. §7.1 lists FR.02 as
    // related; FR.02 is aligned to §7.2. Listing is not alignment, and
    // v0.62 advertised §7.1 practice backed by §7.2's items.
    const e = sectionEligibility(s.officialSectionId);
    return {
      officialSectionId: s.officialSectionId,
      sectionNumber: s.sectionNumber,
      title: s.exactTitle,
      availability: e.availability,
      statusLine:
        e.availability === 'learn_available'
          ? 'Learn'
          : e.availability === 'practice_available'
            ? 'Practice'
            : 'Not available yet',
      skillIds: e.alignedSkillIds,
    };
  });
}
