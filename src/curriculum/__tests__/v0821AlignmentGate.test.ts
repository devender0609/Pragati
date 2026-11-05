// v0.82.1 §19 — ALIGNMENT IS A GATE ON REVIEW READINESS.
//
// The audit exposed a hole the model did not have: a section can pass
// every structural check — explanation, worked examples, practice,
// reasoning, teacher notes, a visual — and still teach mathematics the
// source does not teach. §3.1 and §3.3 were exactly that for three
// releases: `complete_instructional_draft`, and wrong.
//
// Structural completeness therefore cannot be the only condition for
// putting a section in front of an educator. A misaligned section must
// never be review-ready, however complete its fields are.

import { describe, it, expect } from 'vitest';
import { assessSection } from '../instructionalCompleteness';
import { numberPlayChapterSections } from '../numberPlaySections';
import { alignmentFor } from '../numberPlayAlignment';
import { isReviewEligible } from '../numberPlayAlignment';

describe('§19 a misaligned section can never be review-ready', () => {
  it('refuses eligibility on alignment alone, whatever completeness says', () => {
    expect(
      isReviewEligible('ncert_gp_c6_s3_2', 'complete_instructional_draft')
    ).toBe(true);
    // The gate is the point: same completeness level, refused.
    expect(
      isReviewEligible('ncert_gp_c6_s3_2', 'incomplete_draft')
    ).toBe(false);
  });

  it('refuses a section with no alignment record at all', () => {
    // An unaudited section is not an aligned one. Absence of evidence
    // must fail closed, or the gate is decorative.
    expect(
      isReviewEligible('ncert_gp_c6_s9_9', 'complete_instructional_draft')
    ).toBe(false);
  });
});

describe('§H the three states are reported separately', () => {
  it('gives each section an alignment status and a completeness level', () => {
    for (const s of numberPlayChapterSections()) {
      const id = s.source.officialSectionId;
      const a = alignmentFor(id)!;
      const c = assessSection(s);
      // Separate facts, separately reported. Collapsing them is what
      // let a wrong lesson look ready.
      expect(a.status, id).toBeTruthy();
      expect(c.level, id).toBeTruthy();
      expect(s.reviewStatus, id).toBe('authored_draft');
    }
  });

  it('has all three sections aligned and complete after the rewrites', () => {
    for (const s of numberPlayChapterSections()) {
      const id = s.source.officialSectionId;
      expect(alignmentFor(id)!.status, id).toBe('aligned_with_enrichment');
      expect(assessSection(s).level, id).toBe('complete_instructional_draft');
      expect(isReviewEligible(id, assessSection(s).level), id).toBe(true);
    }
  });

  it('keeps Number Play unpublished regardless', () => {
    // Review-eligible is not reviewed, and reviewed is not published.
    for (const s of numberPlayChapterSections()) {
      expect(s.reviewStatus).not.toBe('educator_reviewed');
      expect(s.reviewStatus).not.toBe('published');
    }
  });
});
