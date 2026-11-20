// ---------------------------------------------------------------------------
// v0.84.0-c10.17 checkpoint 71 — CLASS 10 AI ADVERSARIAL PRE-REVIEW.
//
// This suite protects the DETERMINISTIC half only. The qualitative read of
// all 65 lessons is recorded in the checkpoint report and cannot be a test:
// checkpoint 49 established that machine coverage and an instructional
// reading answer different questions, and merging them is the error this
// project keeps guarding against.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  class10Artifacts, runCorpusAudit, carriesProof, proofConvention,
  auditScopeLeak, auditPlaceholders, auditProvenance, auditStageCompleteness,
  isRejection,
} from '../class10CorpusAudit';
import { ratioAt, writtenOf, validateStandardAngles, undefinedRatios } from '../specialAngles';
import { STANDARD_ANGLE_RATIOS } from '../trigonometrySections';
import { sampleSpaceSize } from '../sampleSpace';
import { DICE2, CARD, MARBLES } from '../probabilityClass10Sections';
import { tangentCountFor } from '../tangency';
import { CIRCLE_O, EXTERNAL_P, POINT_INSIDE, POINT_ON } from '../tangentSections';
import { areaValue, minorSegmentArea, majorSegmentArea, sectorArea, centreTriangleArea, discArea } from '../circleRegion';
import { distance, formatRadical, sectionPoint, formatPoint, midpoint, ratioOf } from '../coordinateGeometry';
import { SEC_A, SEC_B, A_1_2, B_4_6 } from '../coordinateClass10Sections';
import { term, sum, directSum } from '../arithmeticProgression';
import { CANONICAL_APS } from '../apSections';
import { asQuadratic, rationalZeroes, isZeroOf } from '../polynomial';
import { CANONICAL_POLYNOMIALS } from '../polynomialSections';
import { productRelationHolds, isPrime } from '../numberTheory';
import { directMean, sumFx, totalFrequency } from '../groupedDistribution';
import { CANONICAL_DISTRIBUTIONS } from '../statisticsSections';

const EXP: Record<string, { expectation: string }> = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'class10Expectations.json'), 'utf8')
);
const expOf = (s: { contentArtifactId: string }) => EXP[s.contentArtifactId]?.expectation ?? 'APPLY';

describe('the frozen corpus', () => {
  it('is the 65 checkpoint-70 artifacts, unchanged', () => {
    const arts = class10Artifacts();
    expect(arts.length).toBe(65);
    for (const s of arts) {
      expect(s.contentArtifactVersion, s.contentArtifactId).toBe(1);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
    }
  });

  it('has a recorded proof expectation for every artifact', () => {
    expect(Object.keys(EXP).length).toBe(65);
    for (const s of class10Artifacts()) expect(EXP[s.contentArtifactId], s.contentArtifactId).toBeTruthy();
  });
});

describe('phase 1 — the deterministic full-corpus audit', () => {
  it('finds nothing across all 65', () => {
    const { records, findings } = runCorpusAudit(expOf);
    expect(records.length).toBe(65);
    expect(findings.map((f) => `${f.artifactId}: ${f.detail}`)).toEqual([]);
    expect(records.filter((r) => r.clean).length).toBe(65);
  });

  it('leaks no excluded topic into any lesson', () => {
    for (const s of class10Artifacts()) expect(auditScopeLeak(s), s.contentArtifactId).toEqual([]);
  });

  it('leaves no placeholder or unevaluated template anywhere', () => {
    for (const s of class10Artifacts()) expect(auditPlaceholders(s), s.contentArtifactId).toEqual([]);
  });

  it('carries complete provenance and five populated stages', () => {
    for (const s of class10Artifacts()) {
      expect(auditProvenance(s), s.contentArtifactId).toEqual([]);
      expect(auditStageCompleteness(s), s.contentArtifactId).toEqual([]);
    }
  });

  it('exempts a sentence that quotes a claim in order to reject it', () => {
    expect(isRejection('A student writes tan 90 degrees = infinity. What is wrong?')).toBe(true);
    expect(isRejection('Could you divide by cos squared A at 90 degrees?')).toBe(true);
    expect(isRejection('The tangent meets the circle at exactly one point.')).toBe(false);
  });
});

describe('phase 1 — proof expectations', () => {
  it('gives every PROVE unit an actual proof', () => {
    const prove = class10Artifacts().filter((s) => expOf(s) === 'PROVE');
    expect(prove.length).toBe(7);
    for (const s of prove) expect(carriesProof(s), s.contentArtifactId).toBe(true);
  });

  it('keeps every STATE_WITHOUT_PROOF unit from becoming a proof lesson', () => {
    const swp = class10Artifacts().filter((s) => expOf(s) === 'STATE_WITHOUT_PROOF');
    expect(swp.length).toBe(3);
    for (const s of swp) {
      const { findings } = runCorpusAudit((x) => (x.contentArtifactId === s.contentArtifactId ? 'STATE_WITHOUT_PROOF' : 'APPLY'));
      expect(findings.filter((f) => f.check === 'proof_scope'), s.contentArtifactId).toEqual([]);
    }
  });

  it('records the two proof conventions actually in use', () => {
    // A finding of the qualitative read, pinned so it cannot drift further
    // without someone noticing. Both conventions are mathematically sound.
    const proofs = class10Artifacts().filter(carriesProof);
    expect(proofs.length).toBe(18);
    expect(proofs.filter((s) => proofConvention(s) === 'labelled').length).toBe(3);
    expect(proofs.filter((s) => proofConvention(s) === 'prose').length).toBe(15);
  });
});

describe('phase 1 — model-owned truth', () => {
  it('specialAngles owns every standard value', () => {
    expect(validateStandardAngles()).toEqual([]);
    expect(undefinedRatios().length).toBe(4);
    for (const r of STANDARD_ANGLE_RATIOS) {
      expect(r.sin.exact).toBe(writtenOf(ratioAt(r.degrees, 'sin')));
      expect(r.cos.exact).toBe(writtenOf(ratioAt(r.degrees, 'cos')));
      expect(r.tan.exact).toBe(writtenOf(ratioAt(r.degrees, 'tan')));
    }
  });

  it('sampleSpace owns every outcome count', () => {
    expect([sampleSpaceSize(DICE2), sampleSpaceSize(CARD), sampleSpaceSize(MARBLES)]).toEqual([36, 52, 10]);
  });

  it('tangency owns every tangent count', () => {
    expect([tangentCountFor(CIRCLE_O, POINT_INSIDE), tangentCountFor(CIRCLE_O, POINT_ON), tangentCountFor(CIRCLE_O, EXTERNAL_P)]).toEqual([0, 1, 2]);
  });

  it('circleRegion owns every region area', () => {
    for (const t of [60, 90, 120]) {
      expect(areaValue(minorSegmentArea(t), 7)).toBeCloseTo(areaValue(sectorArea(t), 7) - areaValue(centreTriangleArea(t), 7), 10);
      expect(areaValue(minorSegmentArea(t), 7) + areaValue(majorSegmentArea(t), 7)).toBeCloseTo(areaValue(discArea(), 7), 10);
    }
  });

  it('coordinateGeometry owns every distance and section point', () => {
    expect(formatRadical(distance(A_1_2, B_4_6))).toBe('5');
    expect(formatPoint(sectionPoint(SEC_A, SEC_B, 2, 3))).toBe('(13/5, 23/5)');
    expect(formatPoint(midpoint(SEC_A, SEC_B))).toBe(formatPoint(sectionPoint(SEC_A, SEC_B, 1, 1)));
    for (const [a, b] of [[1, 1], [2, 1], [2, 3], [3, 2]]) {
      const r = ratioOf(SEC_A, SEC_B, sectionPoint(SEC_A, SEC_B, a, b));
      expect(r?.m1).toBe(a); expect(r?.m2).toBe(b);
    }
  });

  it('the remaining models own their quantities', () => {
    for (const ap of CANONICAL_APS) {
      expect(term(ap, 1)).toBe(ap.a);
      for (const n of [1, 2, 5]) {
        if (ap.length !== undefined && n > ap.length) continue;
        expect(sum(ap, n).num / sum(ap, n).den).toBeCloseTo(directSum(ap, n), 9);
      }
    }
    for (const p of CANONICAL_POLYNOMIALS) {
      for (const z of rationalZeroes(asQuadratic(p)!)) expect(isZeroOf(p, z)).toBe(true);
    }
    expect([2, 3, 5, 7, 11].every(isPrime)).toBe(true);
    expect([1, 4, 9, 15].some(isPrime)).toBe(false);
    for (const [a, b] of [[12, 18], [6, 20], [96, 404]]) expect(productRelationHolds(a, b)).toBe(true);
    for (const d of CANONICAL_DISTRIBUTIONS) expect(directMean(d)).toBeCloseTo(sumFx(d) / totalFrequency(d), 9);
  });

  it('reconciles prose counts against the model that owns them', () => {
    const s = class10Artifacts().find((x) => x.contentArtifactId === 'ncert_jemh1_s14_1_applications_lesson')!;
    const t = [s.summary, ...s.explanation].join(' ');
    for (const n of [sampleSpaceSize(DICE2), sampleSpaceSize(CARD), sampleSpaceSize(MARBLES)]) {
      expect(t).toContain(String(n));
    }
  });

  it('types no standard trig decimal anywhere in the corpus', () => {
    for (const s of class10Artifacts()) {
      const t = [s.summary, ...s.explanation].join(' ');
      for (const b of [/0\.8660/, /0\.7071/, /0\.5773/, /1\.7320/]) expect(t, s.contentArtifactId).not.toMatch(b);
    }
  });
});

describe('the human lifecycle is untouched', () => {
  it('leaves every artifact an authored draft', () => {
    for (const s of class10Artifacts()) expect(s.reviewStatus).toBe('authored_draft');
  });
});
