// ---------------------------------------------------------------------------
// v0.84.0-review.1 checkpoint 48 — CLASS 9 HUMAN-REVIEW READINESS.
//
// The question these answer: can a reviewer be handed a frozen lesson and
// return feedback that is unambiguously tied to exactly what they saw?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import {
  class9ReviewCandidates,
  questionsForArtifact,
  artifactReviewCode,
  artifactSemanticFingerprint,
  artifactProvenanceFingerprint,
  CLASS9_INSTRUMENT_VERSION,
} from '../artifactReview';
import { CLASS9_REVIEW_BUILD } from '../class9ReviewBuild';
import {
  class9ReviewReadiness,
  class9ChapterReviewPackages,
  class9PilotBatch,
  class9ReviewRiskOrder,
} from '../class9ReviewReadiness';
import { importReviewResponse, perspectivesCovered, type ReviewResponse } from '../class9ReviewResponses';
import { allAuthoredSections } from '../authoredSections';
import { section74Artifact, section74ProvenanceFingerprint } from '../contentArtifact';
import { SOURCE_PROVENANCE_VERSION } from '../sectionReviewPackages';
import { Class9ReviewSurface } from '../../features/admin/Class9ReviewSurface';

const CANDIDATES = () => class9ReviewCandidates(CLASS9_REVIEW_BUILD.reviewBuildId);
const CLASS9 = () =>
  allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh'));

describe('Class 9 review identity', () => {
  it('freezes one candidate per artifact, with no duplicate codes', () => {
    const c = CANDIDATES();
    expect(c.length).toBe(92);
    expect(c.length).toBe(CLASS9().length);
    expect(new Set(c.map((x) => x.reviewCode)).size).toBe(92);
    expect(new Set(c.map((x) => x.contentArtifactId)).size).toBe(92);
  });

  it('keys review on the artifact, not the section', () => {
    // A section-keyed code would collide for split siblings and be
    // undefinable for Chapter 9. Both cases are present.
    const c = CANDIDATES();
    const bySection = new Map<string, string[]>();
    for (const x of c) {
      const s = CLASS9().find((a) => a.contentArtifactId === x.contentArtifactId)!;
      const sid = s.source.officialSectionId;
      bySection.set(sid, [...(bySection.get(sid) ?? []), x.reviewCode]);
    }
    const splits = [...bySection.entries()].filter(([sid, codes]) => sid !== '' && codes.length > 1);
    expect(splits.length).toBeGreaterThan(5);
    for (const [, codes] of splits) expect(new Set(codes).size).toBe(codes.length);
    // Chapter 9 has no section id at all and still gets two distinct codes.
    const ch9 = c.filter((x) => x.officialChapterId === 'ncert_iemh2_ch09');
    expect(ch9.length).toBe(2);
    expect(ch9[0].reviewCode).not.toBe(ch9[1].reviewCode);
  });

  it('binds content, provenance, instrument and build into the candidate', () => {
    for (const x of CANDIDATES()) {
      const s = CLASS9().find((a) => a.contentArtifactId === x.contentArtifactId)!;
      expect(x.semanticFingerprint).toBe(artifactSemanticFingerprint(s));
      expect(x.provenanceFingerprint).toBe(artifactProvenanceFingerprint(s));
      expect(x.semanticFingerprint).not.toBe(x.provenanceFingerprint);
      expect(x.instrumentVersion).toBe(CLASS9_INSTRUMENT_VERSION);
      expect(x.reviewBuildId).toBe(CLASS9_REVIEW_BUILD.reviewBuildId);
      expect(x.reviewCode).toBe(artifactReviewCode(s));
    }
  });

  it('shows Chapter 9 provenance truthfully, inventing no section number', () => {
    for (const x of CANDIDATES().filter((c) => c.officialChapterId === 'ncert_iemh2_ch09')) {
      expect(x.sourceKind).toBe('source_segment');
      expect(x.sourceDescription).toContain('unnumbered instructional segment');
      expect(x.sourceDescription).not.toMatch(/§9\.\d/);
      expect(x.sourceDescription).toMatch(/pages \d+/);
      // No engineering identifier reaches the reviewer's screen.
      expect(x.sourceDescription).not.toContain('pragati_srcseg');
    }
  });

  it('gives the merged §3.2 one candidate at version 2, naming the integration', () => {
    const c = CANDIDATES().filter((x) => x.contentArtifactId === 'ncert_iemh1_s3_2_lesson');
    expect(c.length).toBe(1);
    expect(c[0].contentArtifactVersion).toBe(2);
    expect(c[0].sourceDescription).toContain('§3.2');
    expect(c[0].sourceDescription).toMatch(/integrates material from 1 further section/);
    // And no standalone §3.1 candidate was resurrected.
    expect(CANDIDATES().some((x) => x.sourceDescription.includes('§3.1'))).toBe(false);
  });

  it('asks only questions the lesson can answer', () => {
    for (const s of CLASS9()) {
      const qs = questionsForArtifact(s);
      const ids = qs.map((q) => q.id);
      expect(ids.length).toBe(new Set(ids).size);
      if ((s.visuals ?? []).length === 0) expect(ids).not.toContain('V1');
      if ((s.dataDisplays ?? []).length === 0) expect(ids).not.toContain('D1');
      if ((s.source.additionalOfficialSectionIds ?? []).length === 0) expect(ids).not.toContain('S4');
      // Core questions always apply.
      for (const core of ['M1', 'M2', 'M3', 'S1', 'S2', 'S3', 'I1', 'I2', 'I3', 'I4']) {
        expect(ids, s.contentArtifactId).toContain(core);
      }
    }
    // The instrument stays finite: a 37-question form on all 92 would be
    // 3,404 answers per reviewer.
    const total = CLASS9().reduce((a, s) => a + questionsForArtifact(s).length, 0);
    expect(total).toBeLessThan(1400);
    expect(Math.max(...CLASS9().map((s) => questionsForArtifact(s).length))).toBeLessThanOrEqual(16);
  });
});

describe('Class 6 §7.4 frozen identity', () => {
  it('is untouched by the Class 9 system', () => {
    const a = section74Artifact();
    expect(a.reviewCode).toBe('S74-v1-DFC56A');
    expect(a.contentFingerprint).toBe('dfc56ab5');
    expect(a.contentArtifactVersion).toBe(1);
    // Provenance is fingerprinted and versioned alongside the artifact
    // rather than inside it; both are part of the frozen identity.
    expect(section74ProvenanceFingerprint()).toBe('efeccb48');
    expect(SOURCE_PROVENANCE_VERSION).toBe(2);
    expect(a.officialSectionId).toBe('ncert_gp_c6_s7_4');
    // And no Class 9 code could ever collide with it.
    expect(CANDIDATES().some((c) => c.reviewCode === a.reviewCode)).toBe(false);
  });
});

describe('response import', () => {
  const base = (): ReviewResponse => {
    const c = CANDIDATES()[0];
    return {
      reviewCode: c.reviewCode,
      contentArtifactId: c.contentArtifactId,
      contentArtifactVersion: c.contentArtifactVersion,
      semanticFingerprint: c.semanticFingerprint,
      provenanceFingerprint: c.provenanceFingerprint,
      instrumentVersion: c.instrumentVersion,
      reviewBuildId: c.reviewBuildId,
      reviewerName: 'A Reviewer',
      reviewerPerspective: 'practising_educator',
      submittedAt: '2026-11-01',
      answers: c.questions.map((q) => ({ questionId: q.id, verdict: 'yes' as const })),
      disposition: 'approve',
      comments: '',
    };
  };

  it('accepts a response that matches what it judged', () => {
    expect(importReviewResponse(base(), CANDIDATES()).state).toBe('accepted');
  });

  it('quarantines a response whose lesson content has changed', () => {
    const r = { ...base(), semanticFingerprint: 'deadbeef' };
    const out = importReviewResponse(r, CANDIDATES());
    expect(out.state).toBe('quarantined');
    expect(out.state === 'quarantined' && out.reasons.join(' ')).toMatch(/content has changed/);
  });

  it('distinguishes a provenance correction from a content change', () => {
    // The narrower case: the mathematics answers survive it, and the
    // quarantine says so rather than discarding everything.
    const r = { ...base(), provenanceFingerprint: 'deadbeef' };
    const out = importReviewResponse(r, CANDIDATES());
    expect(out.state).toBe('quarantined');
    if (out.state === 'quarantined') {
      expect(out.reasons.join(' ')).toMatch(/provenance has been corrected/);
      expect(out.stillUsable.join(' ')).toMatch(/mathematics and instruction answers still refer/);
    }
  });

  it('rejects an unknown code, a stale version and a stale instrument', () => {
    for (const [patch, probe] of [
      [{ reviewCode: 'C9-XXXXX-v1i1-ABCDEF' }, /matches no current candidate/],
      [{ contentArtifactVersion: 99 }, /judged version 99/],
      [{ instrumentVersion: 99 }, /question set is now version/],
    ] as const) {
      const out = importReviewResponse({ ...base(), ...patch }, CANDIDATES());
      expect(out.state).toBe('quarantined');
      expect(out.state === 'quarantined' && out.reasons.join(' ')).toMatch(probe);
    }
  });

  it('invalidates only rendered evidence when the review build changes', () => {
    const withVisual = CANDIDATES().find((c) => c.questions.some((q) => q.presentationDependent))!;
    const r: ReviewResponse = {
      ...base(),
      reviewCode: withVisual.reviewCode,
      contentArtifactId: withVisual.contentArtifactId,
      contentArtifactVersion: withVisual.contentArtifactVersion,
      semanticFingerprint: withVisual.semanticFingerprint,
      provenanceFingerprint: withVisual.provenanceFingerprint,
      reviewBuildId: 'C9RB-OLDBUILD',
      answers: withVisual.questions.map((q) => ({ questionId: q.id, verdict: 'yes' as const })),
    };
    const out = importReviewResponse(r, CANDIDATES());
    expect(out.state).toBe('quarantined');
    if (out.state === 'quarantined') {
      expect(out.reasons.join(' ')).toMatch(/answer\(s\) about what was rendered no longer apply/);
      expect(out.stillUsable.join(' ')).toMatch(/do not depend on rendering/);
    }
  });

  it('refuses a duplicate submission from the same reviewer', () => {
    const first = base();
    const out = importReviewResponse(first, CANDIDATES(), [first]);
    expect(out.state).toBe('quarantined');
    expect(out.state === 'quarantined' && out.reasons.join(' ')).toMatch(/already submitted/);
  });

  it('tracks perspective coverage without declaring anything reviewed', () => {
    const r = base();
    const cov = perspectivesCovered(r.reviewCode, [r]);
    expect(cov.covered).toEqual(['practising_educator']);
    expect(cov.missing).toEqual(['curriculum_specialist']);
  });
});

describe('readiness and packaging', () => {
  it('reports 92/92 review-ready', () => {
    const r = class9ReviewReadiness();
    expect(r.length).toBe(92);
    expect(r.filter((x) => x.ready).length).toBe(92);
    for (const x of r) expect(x.failed).toEqual([]);
  });

  it('changes no lifecycle state', () => {
    // Freezing a candidate reviews nothing, and generating 92 codes does not
    // mean 92 were sent.
    for (const x of class9ReviewReadiness()) expect(x.lifecycleStatus).toBe('authored_draft');
    for (const s of CLASS9()) expect(s.reviewStatus).toBe('authored_draft');
  });

  it('generates 14 chapter packages covering all 92 lessons once', () => {
    const p = class9ChapterReviewPackages();
    expect(p.length).toBe(14);
    const all = p.flatMap((x) => x.lessons.map((l) => l.contentArtifactId));
    expect(all.length).toBe(92);
    expect(new Set(all).size).toBe(92);
    expect(p.find((x) => x.chapterNumber === 3)!.lessonCount).toBe(8);
    expect(p.find((x) => x.chapterNumber === 9)!.lessonCount).toBe(2);
  });

  it('orders chapters by risk read from the artifacts', () => {
    const order = class9ReviewRiskOrder();
    expect(order.length).toBe(14);
    // Probability and algorithms carry new mathematics with no Class 8
    // counterpart; they should not be last.
    const top = order.slice(0, 4).map((x) => x.chapterNumber);
    expect(top).toContain(7);
    expect(top).toContain(11);
    expect(top).toContain(9);
    for (const o of order) expect(o.why.length).toBeGreaterThan(0);
  });

  it('proposes a risk-diverse pilot rather than simply the riskiest', () => {
    const pilot = class9PilotBatch();
    expect(pilot.length).toBeGreaterThanOrEqual(6);
    expect(pilot.length).toBeLessThanOrEqual(10);
    const chapters = new Set(pilot.map((p) => p.chapterNumber));
    // Every kind of artifact exercised once: segment-backed, merged v2,
    // probability, algorithms, geometry, data, mensuration.
    for (const n of [3, 7, 9, 10, 11, 14]) expect(chapters, `chapter ${n}`).toContain(n);
    expect(pilot.some((p) => p.sourceKind === 'source_segment')).toBe(true);
    expect(pilot.some((p) => p.contentArtifactVersion === 2)).toBe(true);
  });
});

describe('the reviewer surface', () => {
  it('walks chapters → lesson → the real rendered lesson', () => {
    render(<Class9ReviewSurface />);
    expect(screen.getByText(/14 chapters · 92 lessons awaiting review/)).toBeTruthy();
    fireEvent.click(screen.getByText(/Chapter 9 · Propositions and their Converses/));
    const rows = document.querySelectorAll('[data-review-code]');
    expect(rows.length).toBe(2);
    fireEvent.click(rows[0] as HTMLElement);
    // Source context, without engineering identifiers.
    expect(screen.getByText(/unnumbered instructional segment/)).toBeTruthy();
    expect(document.body.textContent).not.toContain('pragati_srcseg');
    expect(document.body.textContent).not.toContain('officialSectionId');
    expect(screen.getByText(/It has not been reviewed/)).toBeTruthy();
    // The same renderer the student route uses.
    expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
    cleanup();
  });
});
