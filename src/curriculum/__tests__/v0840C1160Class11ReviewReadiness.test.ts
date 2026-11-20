/**
 * v0.84.0-c11.60 checkpoint 104 — the audit's own evidence must stay honest.
 *
 * The danger with a review-readiness ledger is not that it is wrong once;
 * it is that it quietly becomes a claim nobody re-derives — exactly how the
 * completeness ledger came to say 91. So every scalar here is recomputed
 * from source, and the lifecycle fields a script may never assert are
 * asserted to be false.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { allAuthoredSections } from '../authoredSections';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { type CanonicalUnit, isClass11Artifact, reconcileCoverage } from '../class11Coverage';

const dir = path.join(__dirname, '../../../class11-source');
const read = (f: string): Record<string, never> => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const UNITS = read('CLASS11_DECOMPOSITION.json') as unknown as CanonicalUnit[];
const REVIEW = read('CLASS11_REVIEW_READINESS_LEDGER.json');
const ALIGN = read('CLASS11_SOURCE_ALIGNMENT_LEDGER.json');
const MATRIX = read('CLASS11_FINAL_STATUS_MATRIX.json');
type Row = {
  contentArtifactId: string; canonicalUnits: string[]; provenanceStatus: string;
  representationContract: string; rawValueStatus: string; reviewReadiness: string;
  placement: string; sourceKind: string; officialChapterId: string; blockingIssues: string[];
  sentForHumanReview: boolean; humanReviewed: boolean; adjudicated: boolean; published: boolean;
};
const rows = REVIEW.reviewLedger as unknown as Row[];

const derived = () => {
  __setAuthoredLearnPreviewForTests(true);
  try {
    const artifacts = allAuthoredSections().filter(isClass11Artifact);
    return { artifacts, cov: reconcileCoverage(UNITS, artifacts) };
  } finally { __setAuthoredLearnPreviewForTests(null); }
};

describe('the review ledger covers exactly the authored corpus', () => {
  it('holds one row per distinct authored artifact', () => {
    const { artifacts } = derived();
    const ids = new Set(artifacts.map((a) => a.contentArtifactId));
    expect(rows).toHaveLength(ids.size);
    expect(new Set(rows.map((r) => r.contentArtifactId))).toEqual(ids);
  });

  it('maps every artifact to at least one canonical unit', () => {
    for (const r of rows) expect(r.canonicalUnits.length, r.contentArtifactId).toBeGreaterThan(0);
  });

  it('gives every required unit authored coverage', () => {
    const { cov } = derived();
    const required = UNITS.filter((u) => u.instructionalStatus.startsWith('REQUIRED'));
    expect(required.filter((u) => cov.uncovered.includes(u.unitId))).toEqual([]);
    expect((ALIGN.alignmentLedger as unknown as unknown[])).toHaveLength(UNITS.length);
  });
});

describe('what READY_FOR_HUMAN_REVIEW is allowed to mean', () => {
  const ready = () => rows.filter((r) => r.reviewReadiness === 'READY_FOR_HUMAN_REVIEW');

  it('requires adequate provenance', () => {
    for (const r of ready()) expect(r.provenanceStatus, r.contentArtifactId).toBe('PROVENANCE_COMPLETE');
  });

  it('requires a satisfied representation contract and no raw leak', () => {
    for (const r of ready()) {
      expect(r.representationContract, r.contentArtifactId).toBe('SATISFIED');
      expect(r.rawValueStatus, r.contentArtifactId).toBe('CLEAN');
    }
  });

  it('requires truthful ownership and placement', () => {
    for (const r of ready()) {
      const numbered = /^chapter-\d/.test(r.placement);
      if (r.sourceKind === 'cbse_only') {
        expect(r.officialChapterId, r.contentArtifactId).not.toMatch(/ncert_kemh1_ch\d/);
        expect(numbered, r.contentArtifactId).toBe(false);
      } else {
        expect(numbered, r.contentArtifactId).toBe(true);
      }
    }
  });

  it('carries no blocking issues', () => {
    for (const r of ready()) expect(r.blockingIssues, r.contentArtifactId).toEqual([]);
  });
});

describe('the lifecycle stays five separate claims', () => {
  it('asserts no human review anywhere', () => {
    // A static audit may never set these. If one is ever true, a human
    // workflow recorded it — not this generator.
    for (const r of rows) {
      expect(r.sentForHumanReview).toBe(false);
      expect(r.humanReviewed).toBe(false);
      expect(r.adjudicated).toBe(false);
      expect(r.published).toBe(false);
    }
  });

  it('keeps the lifecycle monotonic in the matrix', () => {
    const m = MATRIX as unknown as Record<string, number>;
    expect(m.humanReviewed).toBeLessThanOrEqual(m.sentForHumanReview);
    expect(m.adjudicated).toBeLessThanOrEqual(m.humanReviewed);
    expect(m.published).toBeLessThanOrEqual(m.adjudicated);
    expect(m.sentForHumanReview).toBe(rows.filter((r) => r.sentForHumanReview).length);
    expect(m.humanReviewed).toBe(rows.filter((r) => r.humanReviewed).length);
  });

  it('never reports material alignment as settled by a script', () => {
    const m = MATRIX as unknown as Record<string, number>;
    expect(m.materialAlignmentSettled).toBe(0);
    expect(m.materialAlignmentNeedingHumanCheck).toBe(UNITS.length);
    for (const a of ALIGN.alignmentLedger as unknown as Array<{ materialAlignment: string }>) {
      expect(a.materialAlignment).toBe('NEEDS_HUMAN_CHECK');
    }
  });
});

describe('the status matrix reconciles with every other ledger', () => {
  it('re-derives its scalars from source', () => {
    const { artifacts, cov } = derived();
    const m = MATRIX as unknown as Record<string, unknown>;
    expect(m.sourceDecompositionUnits).toBe(UNITS.length);
    expect(m.authoredArtifacts).toBe(new Set(artifacts.map((a) => a.contentArtifactId)).size);
    expect(m.requiredCoverage).toBe(`${cov.covered} / ${UNITS.length}`);
    expect(m.uncovered).toEqual(cov.uncovered);
    expect(m.orphans).toEqual(cov.orphans);
    expect(m.structurallyReadyForHumanReview)
      .toBe(rows.filter((r) => r.reviewReadiness === 'READY_FOR_HUMAN_REVIEW').length);
  });

  it('agrees with the completeness ledger', () => {
    const led = read('CLASS11_COMPLETENESS_LEDGER.json') as unknown as Record<string, number>;
    const m = MATRIX as unknown as Record<string, number>;
    expect(led.artifacts).toBe(m.authoredArtifacts);
    expect(led.units).toBe(m.sourceDecompositionUnits);
  });

  it('states the caveat in the evidence itself', () => {
    expect(MATRIX.caveat as unknown as string).toMatch(/not material alignment|not human review/i);
  });
});
