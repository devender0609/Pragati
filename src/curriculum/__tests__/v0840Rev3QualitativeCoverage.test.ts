// ---------------------------------------------------------------------------
// v0.84.0-review.3 checkpoint 50 — QUALITATIVE COVERAGE, HONESTLY COUNTED.
//
// Checkpoint 49 said "all 92 reviewed, none sampled". That was true of the
// deterministic harness and false of the qualitative reading, which had
// covered 13. The two are not the same claim, and this test exists so the
// distinction cannot be lost again: it pins the coverage counts and checks
// that every artifact has its own record rather than a chapter-level one.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { allAuthoredSections } from '../authoredSections';
import { class9ReviewCandidates } from '../artifactReview';
import { CLASS9_REVIEW_BUILD } from '../class9ReviewBuild';

type Record_ = {
  contentArtifactId: string; reviewCode: string; readAtCheckpoint: number;
  qualitativeReviewStatus: string; findings: Array<{ severity: string }>;
  canStudentUnderstandWithoutKnowingResult: boolean; unjustifiedReasoningJump: boolean;
};
const doc = JSON.parse(
  readFileSync('review-package/AI_QUALITATIVE_REVIEW_RECORDS.json', 'utf8')
) as { totalArtifacts: number; records: Record_[]; findingsBySeverity: Record<string, number> };

const C9 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh'));

describe('AI qualitative review coverage', () => {
  it('gives every artifact its own record, with no duplicates and no orphans', () => {
    expect(doc.records.length).toBe(C9.length);
    expect(new Set(doc.records.map((r) => r.contentArtifactId)).size).toBe(C9.length);
    const known = new Set(C9.map((s) => s.contentArtifactId));
    for (const r of doc.records) expect(known.has(r.contentArtifactId), r.contentArtifactId).toBe(true);
    for (const s of C9) {
      expect(doc.records.some((r) => r.contentArtifactId === s.contentArtifactId), s.contentArtifactId).toBe(true);
    }
  });

  it('counts 13 read at checkpoint 49 and 79 at checkpoint 50', () => {
    // The honest split. 13 + 79 = 92; neither number may quietly absorb the other.
    expect(doc.records.filter((r) => r.readAtCheckpoint === 49).length).toBe(13);
    expect(doc.records.filter((r) => r.readAtCheckpoint === 50).length).toBe(79);
    expect(doc.records.every((r) => r.qualitativeReviewStatus === 'AI_QUALITATIVE_REVIEWED')).toBe(true);
  });

  it('ties each record to the artifact identity actually frozen', () => {
    const codes = new Map(
      class9ReviewCandidates(CLASS9_REVIEW_BUILD.reviewBuildId).map((c) => [c.contentArtifactId, c.reviewCode] as const)
    );
    for (const r of doc.records) expect(r.reviewCode, r.contentArtifactId).toBe(codes.get(r.contentArtifactId));
  });

  it('carries no blocker or major finding, and 16 minor', () => {
    const all = doc.records.flatMap((r) => r.findings);
    expect(all.filter((f) => f.severity === 'BLOCKER').length).toBe(0);
    expect(all.filter((f) => f.severity === 'MAJOR').length).toBe(0);
    expect(all.length).toBe(16);
    expect(doc.records.filter((r) => r.findings.length === 0).length).toBe(78);
  });

  it('answers the two required questions for every lesson', () => {
    for (const r of doc.records) {
      expect(typeof r.canStudentUnderstandWithoutKnowingResult).toBe('boolean');
      expect(typeof r.unjustifiedReasoningJump).toBe('boolean');
    }
  });
});
