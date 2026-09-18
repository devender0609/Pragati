// v0.82.3 §6 — THE GENERATED DOCUMENTS NAME EVERY AUTHORED CHAPTER.
//
// The coverage matrix said "12 complete instructional drafts, all in
// Class 6 Chapter 7". That stopped being true the moment Number Play
// was authored, and nothing would have caught it: the sentence was a
// literal, so it would have gone on being printed as fact through every
// future chapter.
//
// These tests are driven by the authored registry rather than by naming
// Number Play, so a chapter added later has to appear in the documents
// or the suite fails.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { assessSection } from '../instructionalCompleteness';
import { reviewReadinessSummaryForChapter } from '../reviewReadiness';

const read = (f: string) =>
  readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8');

const authored = () =>
  AUTHORED_CHAPTERS.map((c) => ({
    title: c.title,
    complete: c
      .sections()
      .filter((s) => assessSection(s).level === 'complete_instructional_draft')
      .length,
    reviewReady: reviewReadinessSummaryForChapter(c.officialChapterId)
      .reviewReady,
  })).filter((c) => c.complete > 0);

describe('§1 the coverage matrix names every authored chapter', () => {
  it('breaks the total down by chapter', () => {
    const doc = read('CURRICULUM_COVERAGE_MATRIX.md');
    for (const c of authored()) {
      expect(doc, c.title).toContain(`${c.complete} in ${c.title}`);
    }
  });

  it('no longer claims every draft is in Chapter 7', () => {
    expect(read('CURRICULUM_COVERAGE_MATRIX.md')).not.toMatch(
      /all in Class 6 Chapter 7/
    );
  });

  it('adds up to the product total', () => {
    const total = authored().reduce((a, c) => a + c.complete, 0);
    expect(total).toBe(12);
    expect(read('CURRICULUM_COVERAGE_MATRIX.md')).toContain(
      `${total} complete instructional drafts`
    );
  });
});

describe('§2 review state is reported per chapter, with a total', () => {
  it('gives every authored chapter its own review-state block', () => {
    const doc = read('CONTENT_BACKLOG.md');
    for (const c of authored()) {
      expect(doc, c.title).toContain(`## Review state — Class 6, ${c.title}`);
    }
  });

  it('states the review-ready total without merging the packages', () => {
    const total = authored().reduce((a, c) => a + c.reviewReady, 0);
    expect(total).toBe(12);
    const doc = read('CURRICULUM_COVERAGE_MATRIX.md');
    expect(doc).toContain(`**Total: ${total}**`);
    // The number is a report. A reviewer still receives one chapter.
    expect(doc).toMatch(/packages stay chapter-scoped/i);
  });
});

describe('§5 the Learn-chapters metric says what it measures', () => {
  it('is labelled by what it counts, not by what it sounds like', () => {
    // The value is 1 while authored content exists in two chapters,
    // which looks wrong until the column says "student-openable".
    const doc = read('CURRICULUM_COVERAGE_MATRIX.md');
    expect(doc).toContain('Student-openable Learn chapters');
    expect(doc).not.toMatch(/\| Chapters with Learn \|/);
  });
});

describe('§8 nothing has been sent', () => {
  it('reports zero sent and zero reviewed for every authored chapter', () => {
    for (const c of AUTHORED_CHAPTERS) {
      const s = reviewReadinessSummaryForChapter(c.officialChapterId);
      expect(s.reviewSent, c.title).toBe(0);
      expect(s.reviewReceived, c.title).toBe(0);
    }
  });
});
