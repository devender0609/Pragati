// v0.81 §A — THE REVIEW SYSTEM CAN SEE EVERY CHAPTER.
//
// THE DEFECT
//
// The packaging system imported `fractionsChapterSections()` and
// `authoredSectionById()` straight from `fractionsChapter.ts`. Both
// names say "fractions" and both were the only way in, so the whole
// apparatus — packages, fingerprints, reviewer questions, readiness —
// could only ever see one chapter.
//
// Invisible while Fractions was the only authored chapter. The moment
// Number Play was written, it became content with no route to a
// reviewer: complete work the system did not know existed and would
// therefore never report as waiting. A backlog you cannot see is worse
// than a long one.
//
// A second instance of the same bug sat in the completeness assessor,
// which counted only the Fractions misconception registry — so a Number
// Play section with four documented misconceptions was assessed as
// having none.

import { describe, it, expect } from 'vitest';
import {
  AUTHORED_CHAPTERS,
  allAuthoredSections,
  anyAuthoredSectionById,
  authoredSectionsForChapter,
  NUMBER_PLAY_CHAPTER_ID,
  FRACTIONS_CHAPTER_ID,
} from '../authoredSections';
import { assessSection } from '../instructionalCompleteness';
import { numberPlayChapterSections } from '../numberPlaySections';

describe('§A no authored chapter is invisible to the review system', () => {
  it('registers every chapter that has authored sections', () => {
    const registered = new Set(
      AUTHORED_CHAPTERS.map((c) => c.officialChapterId)
    );
    const authored = new Set(
      allAuthoredSections().map((s) => s.source.officialChapterId)
    );
    for (const id of authored) {
      expect(registered.has(id), id).toBe(true);
    }
  });

  it('finds a Number Play section by id, which was impossible before', () => {
    const s = anyAuthoredSectionById('ncert_gp_c6_s3_2');
    expect(s?.source.exactTitle).toBe('Supercells');
  });

  it('keeps chapters separable rather than merging them into one pile', () => {
    // A reviewer reads a chapter, not a product.
    expect(authoredSectionsForChapter(NUMBER_PLAY_CHAPTER_ID).length).toBe(3);
    expect(
      authoredSectionsForChapter(FRACTIONS_CHAPTER_ID).length
    ).toBeGreaterThan(0);
  });
});

describe('§A completeness counts every chapter’s misconceptions', () => {
  it('no longer reports documented Number Play misconceptions as absent', () => {
    for (const s of numberPlayChapterSections()) {
      const a = assessSection(s);
      expect(a.misconceptionCoverage, s.source.sectionNumber).toBeGreaterThan(0);
      expect(a.gaps, s.source.sectionNumber).not.toContain(
        'no documented misconception'
      );
    }
  });
});

describe('§A the remaining gaps are reported honestly', () => {
  it('§3.2 and §3.3 are complete drafts once practice exists', () => {
    // v0.81 found all three incomplete for want of interactive
    // practice. v0.82 authored it, and the gap closed for two of them.
    const by = (n: string) =>
      numberPlayChapterSections().find((s) => s.source.sectionNumber === n)!;
    for (const n of ['3.2', '3.3']) {
      const a = assessSection(by(n));
      expect(a.level, n).toBe('complete_instructional_draft');
      expect(a.gaps, n).toEqual([]);
    }
  });

  it('§3.1 is complete only because its visual requirement is waived', () => {
    // The waiver is a judgement a reviewer may overturn, and it is
    // recorded where a reviewer will see it rather than asserted here.
    const a = assessSection(
      numberPlayChapterSections().find((s) => s.source.sectionNumber === '3.1')!
    );
    expect(a.visualRequirement.required).toBe(false);
    if (a.visualRequirement.required === false) {
      expect(a.visualRequirement.reason).toMatch(/decorative/i);
    }
    expect(a.level).toBe('complete_instructional_draft');
  });
});
