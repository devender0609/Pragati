/**
 * v0.84.0-c11.64 checkpoint 108 — Class 11 is frozen while Class 12 begins.
 *
 * Every number here was earned over many checkpoints and is now load-bearing
 * for a deferred human-review wave. Class 12 work must not move any of it,
 * and the review lifecycle in particular must stay at zero: deferral is not
 * cancellation, and the packets must still describe the lessons a reviewer
 * would read whenever that review happens.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { allAuthoredSections } from '../authoredSections';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { type CanonicalUnit, isClass11Artifact, reconcileCoverage } from '../class11Coverage';
import { loadPackets } from '../../../tools/class11/reviewIntake';

const root = path.join(__dirname, '../../..');
const rd = (p: string): Record<string, never> => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const UNITS = rd('class11-source/CLASS11_DECOMPOSITION.json') as unknown as CanonicalUnit[];

describe('Class 11 counts are unchanged', () => {
  it('still has 93 canonical units and 90 artifacts covering 93/93', () => {
    __setAuthoredLearnPreviewForTests(true);
    try {
      const artifacts = allAuthoredSections().filter(isClass11Artifact);
      const cov = reconcileCoverage(UNITS, artifacts);
      expect(UNITS).toHaveLength(93);
      expect(new Set(artifacts.map((a) => a.contentArtifactId)).size).toBe(90);
      expect(cov.covered).toBe(93);
      expect(cov.uncovered).toEqual([]);
      expect(cov.orphans).toEqual([]);
    } finally { __setAuthoredLearnPreviewForTests(null); }
  });

  it('keeps the authoring queue empty and the ledgers reconciled', () => {
    expect((rd('class11-source/CLASS11_REQUIRED_AUTHORING_QUEUE.json').queue as unknown as unknown[]))
      .toHaveLength(0);
    expect(rd('class11-source/CLASS11_COMPLETENESS_LEDGER.json').artifacts as unknown as number).toBe(90);
    const m = rd('class11-source/CLASS11_FINAL_STATUS_MATRIX.json') as unknown as Record<string, unknown>;
    expect(m.authoredArtifacts).toBe(90);
    expect(m.requiredCoverage).toBe('93 / 93');
    expect(m.materialAlignmentSettled).toBe(0);
  });
});

describe('the deferred review lifecycle stays at zero', () => {
  it('reports nothing sent, reviewed, adjudicated or published', () => {
    for (const [file, key] of [
      ['class11-review/WAVE1_REVIEW_INTAKE.json', 'totals'],
      ['class11-review/pilot/PILOT_LEDGER.json', 'totals'],
    ] as const) {
      const t = rd(file)[key] as unknown as Record<string, number>;
      expect(t.sent).toBe(0);
      expect(t.humanReviewed).toBe(0);
      expect(t.adjudicated).toBe(0);
      expect(t.published).toBe(0);
    }
  });

  it('keeps the prepared packets intact and matching the lessons', () => {
    // Deferral must not rot the packets: a fingerprint that no longer
    // matches would silently invalidate the whole prepared wave.
    const packets = loadPackets();
    expect(packets.size).toBe(25);
    const wave = rd('class11-review/WAVE1_LEDGER.json');
    for (const e of wave.entries as unknown as Array<Record<string, never>>) {
      const p = packets.get(e.contentArtifactId as unknown as string);
      expect(p, e.contentArtifactId).toBeDefined();
      expect(p!.artifactFingerprint).toBe(e.artifactFingerprint);
    }
  });

  it('leaves the Class 12 gate awaiting review rather than blocked', () => {
    // The owner deferred review deliberately. That is a sequencing choice,
    // not a blocking finding — and the gate must not be quietly flipped to
    // CLEAR either, because no human evidence exists.
    const g = rd('class11-review/CLASS12_GATE.json') as unknown as Record<string, unknown>;
    expect(g.state).toBe('AWAITING_HUMAN_REVIEW');
    expect((g.systemicMetrics as { computed: boolean }).computed).toBe(false);
  });
});

describe('Class 12 has no authored content', () => {
  it('registers zero Class 12 artifacts', () => {
    __setAuthoredLearnPreviewForTests(true);
    try {
      const c12 = allAuthoredSections().filter((s) => /class12|_c12_|lemh/i.test(s.contentArtifactId)
        || /lemh|class12/i.test(s.source.officialChapterId));
      expect(c12).toEqual([]);
    } finally { __setAuthoredLearnPreviewForTests(null); }
  });

  it('records the source set as incomplete rather than guessing a denominator', () => {
    const m = rd('class12-source/CLASS12_SOURCE_MANIFEST.json') as unknown as Record<string, unknown>;
    expect(m.status).toBe('SOURCE_SET_INCOMPLETE');
    // v0.84.0-c12.04 — the manifest is generated now, and the hand-written
    // `priorMemoryClaim` field went with the rewrite. The invariant it
    // guarded is unchanged and lives in the derived denominators: nothing
    // is claimed, and the remembered 13/65 is named as prohibited.
    //
    // v0.84.0-c12.08 — Chapter 7 arrived and the whole-book gate published
    // chapters/sections/subsections. The invariant is still "never guessed":
    // every denominator is either unverified with no value, or
    // PRIMARY_SOURCE_VERIFIED and identical to the model the gate wrote. The
    // page denominator stays unverified while back matter is absent.
    const d = m.denominators as Record<string, { value: unknown; status: string }>;
    const model = (rd('class12-source/CLASS12_SOURCE_MODEL.json') as unknown as
      { denominators: Record<string, { value: unknown; status: string; basis?: string }> }).denominators;
    for (const k of ['chapters', 'sections', 'subsections', 'pages']) {
      if (d[k].status === 'NOT_VERIFIED') expect(d[k].value, k).toBeNull();
      else {
        expect(d[k].status, k).toBe('PRIMARY_SOURCE_VERIFIED');
        expect(d[k].value, k).toBe(model[k].value);
        expect(model[k].basis, k).toBeTruthy();
      }
    }
    expect(d.pages.status).toBe('NOT_VERIFIED');
  });
});
