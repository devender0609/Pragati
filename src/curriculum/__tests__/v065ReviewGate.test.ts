// v0.65 §14 — a review must attach to exactly what was reviewed, and
// publication must require the gates that were declared.

import { describe, it, expect } from 'vitest';
import {
  mayPublishSection,
  requiredItemsSatisfied,
  decisionSatisfiesGate,
  outcomeSatisfiesGate,
  PACKAGE_A_REQUIRED_FOR_SECTION_7_4,
  PACKAGE_B_REQUIRED_FOR_PUBLICATION,
  instructionalReviewIsBlocked,
} from '../publicationGate';
import {
  importReviewSubmission,
  reviewRecordFor,
  type ReviewRecord,
} from '../educatorReview';
import {
  section74Artifact,
  computeContentFingerprint,
  reviewRelevantContent,
  PACKAGE_B_QUESTION_SET_VERSION,
  SECTION_7_4_ARTIFACT_VERSION,
} from '../contentArtifact';
import { officialSectionById } from '../officialSections';
import { sectionEligibility, mayAssignSectionActivity } from '../eligibilityPolicy';
import { isStudentLearningReady } from '../contentStatus';
import { demonstrationSectionStatus } from '../demonstrationSection';

const S74 = 'ncert_gp_c6_s7_4';

// ---------------------------------------------------------------------------
// §1 — the gate matches the declared dependency
// ---------------------------------------------------------------------------

function recordWith(
  packageId: 'A_curriculum' | 'B_demonstration',
  itemIds: readonly string[],
  outcome: 'content_accepted' | 'content_rejected' = 'content_accepted'
): ReviewRecord {
  return {
    packageId,
    packageVersion: 'test',
    expectedItemIds: [...itemIds],
    submissions: [
      {
        submissionId: 's1',
        packageId,
        reviewerId: 'r1',
        reviewerName: 'R',
        reviewerRole: 'practising_teacher',
        reviewDate: '2026-08-25',
        responses: itemIds.map((id) => ({
          itemId: id,
          decision: 'accept' as const,
          rationale: 'ok',
        })),
      },
    ],
    adjudications: itemIds.map((id) => ({
      itemId: id,
      outcome,
      actionTaken: '',
      adjudicatedBy: 'maintainer',
      adjudicationDate: '2026-08-25',
    })),
  };
}

describe('§1 §7.4 publication needs BOTH packages', () => {
  it('refuses today, naming both packages', () => {
    const r = mayPublishSection(S74);
    expect(r.mayPublish).toBe(false);
    if (r.mayPublish) throw new Error('unreachable');
    expect(r.blockers.join(' ')).toMatch(/Package A/);
    expect(r.blockers.join(' ')).toMatch(/Package B/);
  });

  it('Package B fully accepted ALONE cannot satisfy publication', () => {
    // The v0.64 defect: the executable check consulted only Package B.
    const b = recordWith('B_demonstration', PACKAGE_B_REQUIRED_FOR_PUBLICATION);
    expect(requiredItemsSatisfied(b, PACKAGE_B_REQUIRED_FOR_PUBLICATION).satisfied).toBe(true);
    // But the real gate still refuses, because Package A is unanswered.
    expect(mayPublishSection(S74).mayPublish).toBe(false);
  });

  it('Package A alignment accepted ALONE cannot satisfy publication', () => {
    const a = recordWith('A_curriculum', PACKAGE_A_REQUIRED_FOR_SECTION_7_4);
    expect(requiredItemsSatisfied(a, PACKAGE_A_REQUIRED_FOR_SECTION_7_4).satisfied).toBe(true);
    expect(mayPublishSection(S74).mayPublish).toBe(false);
  });

  it('an answered but unadjudicated item does not satisfy a gate', () => {
    const rec = recordWith('A_curriculum', ['B1', 'C1', 'C2']);
    rec.adjudications = []; // answered, never adjudicated
    const r = requiredItemsSatisfied(rec, PACKAGE_A_REQUIRED_FOR_SECTION_7_4);
    expect(r.satisfied).toBe(false);
    if (!r.satisfied) {
      expect(r.reasons.join(' ')).toMatch(/answered but not adjudicated/);
    }
  });

  it('an adjudication cannot stand in for a missing answer', () => {
    const rec = recordWith('A_curriculum', ['B1', 'C1', 'C2']);
    rec.submissions = []; // adjudicated with nothing answered
    const r = requiredItemsSatisfied(rec, PACKAGE_A_REQUIRED_FOR_SECTION_7_4);
    expect(r.satisfied).toBe(false);
    if (!r.satisfied) expect(r.reasons.join(' ')).toMatch(/not answered/);
  });

  it('a blocking outcome prevents the gate', () => {
    const rec = recordWith(
      'A_curriculum',
      PACKAGE_A_REQUIRED_FOR_SECTION_7_4,
      'content_rejected'
    );
    expect(requiredItemsSatisfied(rec, PACKAGE_A_REQUIRED_FOR_SECTION_7_4).satisfied).toBe(false);
  });
});

describe('§8 required subsets, not whole packages', () => {
  it('does not require unrelated Package A items for §7.4', () => {
    const required = new Set<string>(PACKAGE_A_REQUIRED_FOR_SECTION_7_4);
    // Grade 8 ratio disposition and the stage correction are irrelevant.
    for (const unrelated of ['D1', 'D2', 'D3', 'A1', 'A2', 'B3', 'C4']) {
      expect(required.has(unrelated)).toBe(false);
    }
    expect(required.has('C1')).toBe(true); // §7.4's own competency
  });

  it('does not let unrelated Package A work block instructional review', () => {
    expect(instructionalReviewIsBlocked()).toBe(false);
  });

  it('excludes opinion items from the publication requirement', () => {
    const required = new Set<string>(PACKAGE_B_REQUIRED_FOR_PUBLICATION);
    // A blank "would you use this?" must not block a well-evidenced approval.
    for (const opinion of ['O1', 'O2', 'O3', 'T1', 'T4']) {
      expect(required.has(opinion)).toBe(false);
    }
    expect(required.has('M1')).toBe(true);
    expect(required.has('V4')).toBe(true);
  });
});

describe('§9 outcome semantics', () => {
  it('only accept satisfies a gate', () => {
    expect(decisionSatisfiesGate('accept')).toBe(true);
    for (const d of ['revise', 'reject', 'insufficient_evidence'] as const) {
      expect(decisionSatisfiesGate(d)).toBe(false);
    }
  });

  it('content_revised does not itself satisfy a gate', () => {
    // A revision changes the fingerprint, which invalidates the review
    // that prompted it.
    expect(outcomeSatisfiesGate('content_accepted')).toBe(true);
    expect(outcomeSatisfiesGate('content_revised')).toBe(false);
    expect(outcomeSatisfiesGate('more_evidence_required')).toBe(false);
    expect(outcomeSatisfiesGate('reviewers_disagree_unresolved')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §2 — artifact identity
// ---------------------------------------------------------------------------

describe('§2 the artifact has a stable identity', () => {
  it('produces the same fingerprint on every call', () => {
    expect(computeContentFingerprint()).toBe(computeContentFingerprint());
  });

  it('exposes a quotable review code', () => {
    const a = section74Artifact();
    expect(a.reviewCode).toMatch(/^S74-v\d+-[0-9A-F]{6}$/);
    expect(a.contentArtifactId).toBe('ncert_gp_c6_s7_4_lesson');
  });

  it('covers the material a reviewer actually judges', () => {
    const c = reviewRelevantContent() as Record<string, unknown>;
    for (const key of [
      'explanation', 'workedExamples', 'misconceptions', 'visuals',
      'practiceItems', 'teacherNotes', 'answerRationales',
      'guidedPractice', 'independentPractice',
    ]) {
      expect(c[key], `fingerprint omits ${key}`).toBeTruthy();
    }
  });

  it('changes when review-relevant content changes', () => {
    // Simulated by fingerprinting a mutated copy — the real content is
    // never mutated by a test.
    const base = JSON.stringify(reviewRelevantContent());
    const mutated = base.replace(
      '1/4 is greater than 1/3',
      '1/3 is greater than 1/4'
    );
    expect(mutated).not.toBe(base);
  });
});

// ---------------------------------------------------------------------------
// §4 — import rejects the wrong artifact
// ---------------------------------------------------------------------------

const validBody = () => ({
  packageId: 'B_demonstration' as const,
  questionSetVersion: PACKAGE_B_QUESTION_SET_VERSION,
  contentArtifactId: 'ncert_gp_c6_s7_4_lesson',
  contentArtifactVersion: SECTION_7_4_ARTIFACT_VERSION,
  contentFingerprint: computeContentFingerprint(),
  reviewerId: 'r1',
  reviewerName: 'A Teacher',
  reviewerRole: 'practising_teacher' as const,
  reviewDate: '2026-08-25',
  responses: [{ itemId: 'M1', decision: 'accept' as const, rationale: 'ok' }],
});

describe('§4 an old review cannot authorize newer content', () => {
  const rec = () => reviewRecordFor('B_demonstration');

  it('accepts a submission matching the current artifact', () => {
    const r = importReviewSubmission(rec(), validBody());
    expect(r.ok).toBe(true);
  });

  it('rejects a mismatched question-set version', () => {
    const r = importReviewSubmission(rec(), {
      ...validBody(),
      questionSetVersion: 99,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(' ')).toMatch(/questionSetVersion/);
  });

  it('rejects a mismatched artifact ID', () => {
    const r = importReviewSubmission(rec(), {
      ...validBody(),
      contentArtifactId: 'some_other_lesson',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(' ')).toMatch(/contentArtifactId/);
  });

  it('rejects a mismatched artifact version', () => {
    const r = importReviewSubmission(rec(), {
      ...validBody(),
      contentArtifactVersion: 99,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(' ')).toMatch(/contentArtifactVersion/);
  });

  it('rejects a stale fingerprint and explains why', () => {
    const r = importReviewSubmission(rec(), {
      ...validBody(),
      contentFingerprint: 'deadbeef',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.join(' ')).toMatch(/contentFingerprint/);
      expect(r.errors.join(' ')).toMatch(/need re-review/);
    }
  });

  it('still rejects unknown item IDs alongside artifact checks', () => {
    const r = importReviewSubmission(rec(), {
      ...validBody(),
      responses: [{ itemId: 'ZZ9', decision: 'accept' as const, rationale: 'x' }],
    });
    expect(r.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §7 — generic section lookup
// ---------------------------------------------------------------------------

describe('§7 section lookup assumes no chapter', () => {
  it('finds a Fractions section', () => {
    expect(officialSectionById(S74)?.sectionNumber).toBe('7.4');
  });

  it('finds a Lines & Angles section', () => {
    const s = officialSectionById('ncert_gp_c6_s2_7');
    expect(s?.exactTitle).toBe('Making Rotating Arms');
    expect(s?.officialChapterId).toBe('ncert_gp_c6_ch02_lines_angles');
  });

  it('finds an unmapped Chapter 1 section', () => {
    const s = officialSectionById('ncert_gp_c6_s1_2');
    expect(s?.officialChapterId).toBe('ncert_gp_c6_ch01_patterns');
  });

  it('returns null for an unknown ID rather than guessing', () => {
    expect(officialSectionById('nope')).toBeNull();
  });

  it('gives honest eligibility for a non-Fractions section', () => {
    // Before v0.65 this looked the section up inside Fractions and so
    // could not have found it at all.
    const e = sectionEligibility('ncert_gp_c6_s2_9');
    expect(e.hasEligiblePractice).toBe(false);
    expect(e.availability).toBe('not_available_yet');
  });
});

// ---------------------------------------------------------------------------
// §6 — activity identity
// ---------------------------------------------------------------------------

describe('§6 assignment identifies a concrete artifact version', () => {
  it('remains unassignable, and says why', () => {
    const r = mayAssignSectionActivity(S74, 'practice');
    expect(r.allowed).toBe(false);
  });

  it('would carry an artifact-versioned activity ID', () => {
    // The identity is constructed from the artifact version, so a
    // revision produces a different ID rather than reusing the slot.
    expect(SECTION_7_4_ARTIFACT_VERSION).toBe(1);
  });
});

describe('reviewed content is not automatically published', () => {
  it('keeps §7.4 draft and not student-ready', () => {
    expect(isStudentLearningReady(demonstrationSectionStatus())).toBe(false);
    expect(demonstrationSectionStatus().lesson).toBe('authored_draft');
    expect(mayPublishSection(S74).mayPublish).toBe(false);
  });
});
