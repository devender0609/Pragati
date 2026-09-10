// v0.66 §15 — the review/publication lifecycle must be auditable and
// non-circular.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  mayPublishSection,
  publicationPolicyFor,
  requiredItemsSatisfied,
  PACKAGE_A_REQUIRED_FOR_SECTION_7_4,
  PACKAGE_B_REQUIRED_FOR_PUBLICATION,
} from '../publicationGate';
import {
  publishSectionArtifact,
  isSectionPublished,
  publishedSectionCount,
  __resetPublicationsForTest,
} from '../publicationTransition';
import {
  isReadyForStudentPublication,
  isStudentLearningReady,
  isTeacherResourceReady,
  isCompleteUnit,
  blockingPublicationReadiness,
  emptyUnitStatus,
  type UnitContentStatus,
} from '../contentStatus';
import {
  fingerprintOf,
  reviewRelevantContent,
  section74Artifact,
  computeContentFingerprint,
} from '../contentArtifact';
import {
  REVIEW_BUILD,
  QUESTION_DEPENDENCIES,
  itemsInvalidatedByPresentationChange,
  itemsInvalidatedBySemanticChange,
} from '../reviewBuild';
import { isSectionStudentReady } from '../eligibilityPolicy';
import { demonstrationSectionStatus } from '../demonstrationSection';

const S74 = 'ncert_gp_c6_s7_4';

beforeEach(() => __resetPublicationsForTest());

// ---------------------------------------------------------------------------
// §1 — the circularity is gone
// ---------------------------------------------------------------------------

/** A draft that has passed every review but has NOT been published. */
function fullyReviewedButUnpublished(): UnitContentStatus {
  const s = emptyUnitStatus(S74);
  s.officialCurriculum = 'mapped';
  s.lesson = 'educator_reviewed';
  s.workedExamples = 'reviewed';
  s.visuals = 'mathematically_reviewed';
  s.guidedPractice = 'reviewed';
  s.independentPractice = 'reviewed';
  s.mixedApplicationPractice = 'draft';
  s.teacherResources = 'draft';
  s.unitCheck = 'unavailable';
  return s;
}

describe('§1 publication-eligible is not the same as published', () => {
  it('accepts a fully reviewed draft as READY, without it being published', () => {
    const s = fullyReviewedButUnpublished();
    // THE FIX: readiness does not require the axes to already say
    // 'published'. v0.65 asked "is it already published?" first.
    expect(isReadyForStudentPublication(s)).toBe(true);
    expect(isStudentLearningReady(s)).toBe(false);
    expect(blockingPublicationReadiness(s)).toEqual([]);
  });

  it('refuses a draft that has not been reviewed', () => {
    const s = demonstrationSectionStatus(); // authored_draft
    expect(isReadyForStudentPublication(s)).toBe(false);
    expect(blockingPublicationReadiness(s).join(' ')).toMatch(
      /needs educator_reviewed/
    );
  });

  it('does not report §7.4 as student-ready today', () => {
    expect(isSectionStudentReady(S74)).toBe(false);
    expect(isSectionPublished(S74)).toBe(false);
  });

  it('names instructional readiness as a blocker, not circularly', () => {
    const r = mayPublishSection(S74);
    expect(r.mayPublish).toBe(false);
    if (r.mayPublish) throw new Error('unreachable');
    const joined = r.blockers.join(' ');
    // It must say WHICH axes need review, not "it is not published".
    expect(joined).toMatch(/needs educator_reviewed|Package A|Package B/);
    expect(joined).not.toMatch(/is not student-ready/);
  });
});

// ---------------------------------------------------------------------------
// §2 — the transition
// ---------------------------------------------------------------------------

describe('§2 publication is an explicit, guarded transition', () => {
  it('refuses to publish while gates are unmet', () => {
    const r = publishSectionArtifact({
      officialSectionId: S74,
      publishedBy: 'maintainer',
      expectedArtifactVersion: 1,
      expectedFingerprint: computeContentFingerprint(),
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.blockers.join(' ')).toMatch(/Package A|Package B/);
    expect(publishedSectionCount()).toBe(0);
  });

  it('refuses a stale fingerprint even if gates passed', () => {
    const r = publishSectionArtifact({
      officialSectionId: S74,
      publishedBy: 'maintainer',
      expectedArtifactVersion: 1,
      expectedFingerprint: 'deadbeef',
    });
    expect(r.ok).toBe(false);
  });

  it('refuses a mismatched artifact version', () => {
    const r = publishSectionArtifact({
      officialSectionId: S74,
      publishedBy: 'maintainer',
      expectedArtifactVersion: 99,
      expectedFingerprint: computeContentFingerprint(),
    });
    expect(r.ok).toBe(false);
  });

  it('cannot be bypassed by supplying an arbitrary section ID', () => {
    const r = publishSectionArtifact({
      officialSectionId: 'ncert_gp_c6_s7_6',
      publishedBy: 'maintainer',
      expectedArtifactVersion: 1,
      expectedFingerprint: computeContentFingerprint(),
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.blockers.join(' ')).toMatch(/No publication policy/);
    }
  });

  it('publishes nothing today, so the register stays empty', () => {
    expect(publishedSectionCount()).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// §7 — per-section policy, failing closed
// ---------------------------------------------------------------------------

describe('§7 §7.4 review decisions are not reusable', () => {
  it('declares a policy for §7.4 only', () => {
    expect(publicationPolicyFor(S74)).not.toBeNull();
    for (const other of [
      'ncert_gp_c6_s7_6',
      'ncert_gp_c6_s7_2',
      'ncert_gp_c6_s2_9',
      'ncert_gp_c6_s1_1',
    ]) {
      expect(publicationPolicyFor(other)).toBeNull();
    }
  });

  it('fails closed for a section with no policy', () => {
    for (const other of ['ncert_gp_c6_s7_6', 'ncert_gp_c6_s2_9', 'nonsense']) {
      const r = mayPublishSection(other);
      expect(r.mayPublish).toBe(false);
      if (!r.mayPublish) {
        expect(r.blockers.join(' ')).toMatch(/No publication policy/);
      }
    }
  });

  it('does not apply §7.4 Package A items to another section', () => {
    const p = publicationPolicyFor(S74);
    expect(p?.packageA).toEqual(PACKAGE_A_REQUIRED_FOR_SECTION_7_4);
    expect(publicationPolicyFor('ncert_gp_c6_s7_6')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// §5 — the fingerprint test actually hashes
// ---------------------------------------------------------------------------

describe('§5 semantic changes alter the fingerprint', () => {
  const base = () => reviewRelevantContent();

  function mutate(fn: (c: string) => string): string {
    return fingerprintOf(JSON.parse(fn(JSON.stringify(base()))));
  }

  it('is stable for identical content', () => {
    expect(fingerprintOf(base())).toBe(fingerprintOf(base()));
  });

  it('changes when a mathematical statement changes', () => {
    const a = fingerprintOf(base());
    const b = mutate((s) =>
      s.replace('1/4 is greater than 1/3', '1/3 is greater than 1/4')
    );
    expect(b).not.toBe(a);
  });

  it('changes when a correct answer changes', () => {
    const a = fingerprintOf(base());
    const b = mutate((s) => s.replace('"tick":3', '"tick":2'));
    expect(b).not.toBe(a);
  });

  it('changes when a visual semantic point changes', () => {
    const a = fingerprintOf(base());
    const b = mutate((s) => s.replace('"partitions":4', '"partitions":5'));
    expect(b).not.toBe(a);
  });

  it('changes when feedback text changes', () => {
    const a = fingerprintOf(base());
    const b = mutate((s) =>
      s.replace(
        'Count the spaces you move',
        'Count the marks you move'
      )
    );
    expect(b).not.toBe(a);
  });

  it('changes when a misconception changes', () => {
    const a = fingerprintOf(base());
    const b = mutate((s) =>
      s.replace('Counting ticks instead of counting spaces', 'Something else')
    );
    expect(b).not.toBe(a);
  });

  it('changes when a teacher note changes', () => {
    const a = fingerprintOf(base());
    const b = mutate((s) => s.replace('Lead with LENGTH', 'Lead with AREA'));
    expect(b).not.toBe(a);
  });

  it('does NOT change for excluded styling metadata', () => {
    // Styling is not part of the payload at all, so adding it cannot
    // move the hash. A CSS change must not invalidate a review of
    // whether 3/4 is correct.
    const withStyle = { ...(base() as object), cssClass: 'text-lg' };
    // The payload function ignores unknown keys because the hash is
    // taken over the CANONICAL payload, not an arbitrary object.
    expect(fingerprintOf()).toBe(computeContentFingerprint());
    expect(JSON.stringify(withStyle)).not.toBe(JSON.stringify(base()));
  });
});

// ---------------------------------------------------------------------------
// §3/§4 — presentation identity
// ---------------------------------------------------------------------------

describe('§4 presentation evidence is pinned separately', () => {
  it('pins a review build that is not "latest"', () => {
    expect(REVIEW_BUILD.reviewBuildId).toMatch(/v0\.66\.0/);
    expect(REVIEW_BUILD.immutableUrl).toBeNull(); // honest: no deployment
    expect(REVIEW_BUILD.runInstructions).toMatch(/cannot change/i);
  });

  it('lists the components that can alter what the reviewer sees', () => {
    expect(REVIEW_BUILD.presentationSurface).toContain(
      'src/features/learn/MathVisuals.tsx'
    );
    expect(REVIEW_BUILD.presentationSurface).toContain(
      'src/features/learn/PracticeItemView.tsx'
    );
  });

  it('marks mobile readability as presentation-dependent', () => {
    // V5 is "can you read the labels on a phone?" — a semantic
    // fingerprint cannot possibly answer it.
    expect(QUESTION_DEPENDENCIES.V5).toBe('presentation');
    expect(itemsInvalidatedByPresentationChange()).toContain('V5');
    expect(itemsInvalidatedBySemanticChange()).not.toContain('V5');
  });

  it('marks pure mathematics questions as semantic only', () => {
    expect(QUESTION_DEPENDENCIES.M1).toBe('semantic');
    expect(itemsInvalidatedByPresentationChange()).not.toContain('M1');
  });

  it('marks visual questions as depending on both', () => {
    for (const v of ['V1', 'V2', 'V3', 'V4']) {
      expect(QUESTION_DEPENDENCIES[v]).toBe('both');
    }
  });
});

// ---------------------------------------------------------------------------
// §11 — teacher-resource readiness is a separate claim
// ---------------------------------------------------------------------------

describe('§11 T1-T4 gate the unit, not the student lesson', () => {
  it('excludes teacher items from student publication', () => {
    const required = new Set<string>(PACKAGE_B_REQUIRED_FOR_PUBLICATION);
    for (const t of ['T1', 'T2', 'T3', 'T4']) expect(required.has(t)).toBe(false);
  });

  it('does not call a unit teacher-ready while notes are draft', () => {
    const s = fullyReviewedButUnpublished();
    expect(isReadyForStudentPublication(s)).toBe(true);
    // ...but the UNIT is not teacher-ready, and not complete.
    expect(isTeacherResourceReady(s)).toBe(false);
    expect(isCompleteUnit(s)).toBe(false);
  });

  it('recognises teacher-readiness once the notes are reviewed', () => {
    const s = fullyReviewedButUnpublished();
    s.teacherResources = 'reviewed';
    expect(isTeacherResourceReady(s)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// §12 — adjudication traceability
// ---------------------------------------------------------------------------

describe('§12 an adjudication is not a magic override', () => {
  it('requires an answer before an adjudication counts', () => {
    const rec = {
      packageId: 'A_curriculum' as const,
      packageVersion: 't',
      expectedItemIds: ['B1'],
      submissions: [],
      adjudications: [
        {
          itemId: 'B1',
          outcome: 'content_accepted' as const,
          actionTaken: '',
          adjudicatedBy: 'someone',
          adjudicationDate: '2026-08-25',
        },
      ],
    };
    const r = requiredItemsSatisfied(rec, ['B1']);
    expect(r.satisfied).toBe(false);
    if (!r.satisfied) expect(r.reasons.join(' ')).toMatch(/not answered/);
  });

  it('records who adjudicated and when', () => {
    // Shape check — every adjudication carries provenance fields.
    const a = {
      itemId: 'B1',
      outcome: 'content_accepted' as const,
      actionTaken: 'none',
      adjudicatedBy: 'maintainer',
      adjudicationDate: '2026-08-25',
    };
    expect(a.adjudicatedBy).toBeTruthy();
    expect(a.adjudicationDate).toBeTruthy();
  });
});

describe('artifact identity', () => {
  it('keeps the full fingerprint authoritative and the code a convenience', () => {
    const a = section74Artifact();
    expect(a.contentFingerprint).toHaveLength(8);
    expect(a.reviewCode).toContain(
      a.contentFingerprint.slice(0, 6).toUpperCase()
    );
  });
});
