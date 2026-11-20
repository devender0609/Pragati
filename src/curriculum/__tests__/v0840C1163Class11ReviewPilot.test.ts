/**
 * v0.84.0-c11.63 checkpoint 107 — the pilot must stay a preparation.
 *
 * The risk at this stage is subtle: a template that is almost filled in, a
 * ledger that quietly counts itself as sent, a bundle that tells the
 * reviewer what to think. Each would leave the pilot testing the
 * automation's opinion rather than the lesson.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PILOT_SET, responseTemplate } from '../../../tools/class11/generateReviewPilot';
import { loadPackets, validateResponse } from '../../../tools/class11/reviewIntake';

const root = path.join(__dirname, '../../..');
const rd = (p: string): Record<string, never> =>
  JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const LEDGER = rd('class11-review/pilot/PILOT_LEDGER.json');
const WAVE = rd('class11-review/WAVE1_LEDGER.json');
const GATE = rd('class11-review/CLASS12_GATE.json');
const INTAKE = rd('class11-review/WAVE1_REVIEW_INTAKE.json');
const BUNDLE = fs.readFileSync(path.join(root, 'class11-review/pilot/PILOT_REVIEWER_BUNDLE.md'), 'utf8');
const entries = LEDGER.entries as unknown as Array<Record<string, never>>;
const packets = loadPackets();

describe('the pilot set is exactly the four, drawn from Wave 1', () => {
  it('contains the four named artifacts and no others', () => {
    expect(entries).toHaveLength(4);
    expect(entries.map((e) => e.artifactId as unknown as string)).toEqual([...PILOT_SET]);
  });

  it('draws every one from Wave 1', () => {
    const wave = new Set((WAVE.entries as unknown as Array<{ contentArtifactId: string }>)
      .map((e) => e.contentArtifactId));
    for (const e of entries) expect(wave.has(e.artifactId as unknown as string)).toBe(true);
  });

  it('matches each packet fingerprint exactly', () => {
    for (const e of entries) {
      const p = packets.get(e.artifactId as unknown as string)!;
      expect(e.artifactFingerprint).toBe(p.artifactFingerprint);
      expect([...(e.mappedUnits as unknown as string[])].sort())
        .toEqual(p.canonicalUnits.map((u) => u.unitId).sort());
    }
  });

  it('tests the architecture in both directions', () => {
    const multi = entries.find((e) => e.multiUnit);
    const overlapping = entries.find((e) => e.involvesMultiArtifactUnit);
    expect(multi?.artifactId).toBe('ncert_kemh1_s7_2_binomial_theorem_lesson');
    expect((multi!.mappedUnits as unknown as string[])).toHaveLength(4);
    expect(overlapping?.artifactId).toBe('ncert_kemh1_s3_4_sum_difference_lesson');
  });
});

describe('the §7.2 packet asks about every unit', () => {
  it('enumerates all four and demands separate answers', () => {
    const e = entries[0];
    expect([...(e.mappedUnits as unknown as string[])].sort())
      .toEqual(['C11-BIN-01', 'C11-BIN-02', 'C11-BIN-03', 'C11-BIN-FO7']);
    expect(e.requiresUnitByUnitAnswers).toBe(true);
    const tpl = rd(`class11-review/pilot/responses/${e.artifactId}.response.json`);
    expect((tpl.unitResults as unknown as unknown[])).toHaveLength(4);
  });

  it('accepts a split verdict across its four units', () => {
    // The result this pilot exists to be able to capture.
    const p = packets.get(PILOT_SET[0])!;
    const r = validateResponse({
      reviewer: 'fixture', reviewDate: '2026-11-19', artifactId: PILOT_SET[0],
      reviewedFingerprint: p.artifactFingerprint,
      unitResults: [
        { unitId: 'C11-BIN-01', materialAlignment: 'ALIGNED', mathematicalCorrectness: 'CORRECT', scopeDiscipline: 'WITHIN_SCOPE' },
        { unitId: 'C11-BIN-02', materialAlignment: 'ALIGNED', mathematicalCorrectness: 'CORRECT', scopeDiscipline: 'WITHIN_SCOPE' },
        { unitId: 'C11-BIN-03', materialAlignment: 'PARTIAL', mathematicalCorrectness: 'CORRECT', scopeDiscipline: 'WITHIN_SCOPE' },
        { unitId: 'C11-BIN-FO7', materialAlignment: 'MISALIGNED', mathematicalCorrectness: 'CORRECT', scopeDiscipline: 'OMITS_REQUIRED_MATERIAL' },
      ],
      lessonGranularity: 'SHOULD_SPLIT', overallRecommendation: 'REVISE', issues: [],
    }, packets);
    expect(r.errors).toEqual([]);
    expect(r.valid).toBe(true);
  });
});

describe('the overlap packet carries its partner as context', () => {
  it('names the other lesson and the shared units', () => {
    const e = entries[1];
    const ctx = e.overlapContext as unknown as Array<Record<string, never>>;
    expect(ctx.length).toBeGreaterThan(0);
    expect(ctx[0].artifactId).toBe('ncert_kemh1_s3_4_multiple_angles_lesson');
    expect([...(ctx[0].sharedUnits as unknown as string[])].sort())
      .toEqual(['C11-TRG-06', 'C11-TRG-07']);
  });

  it('supplies enough partner content to answer the overlap question', () => {
    const ctx = (entries[1].overlapContext as unknown as Array<Record<string, never>>)[0];
    expect(ctx.learningGoal).toBeTruthy();
    expect((ctx.explanation as unknown as unknown[]).length).toBeGreaterThan(0);
    expect(BUNDLE).toContain('complementary instruction, or is the objective duplicated');
  });
});

describe('CBSE-only source is labelled honestly', () => {
  it('marks FO-8 and FO-11 CBSE-only with no NCERT provenance', () => {
    for (const id of ['cbse_fo11_chain_rule_lesson', 'cbse_fo8_special_sums_lesson']) {
      const e = entries.find((x) => x.artifactId === id)!;
      expect(e.cbseOnly).toBe(true);
      expect(e.cbseEntryId).toBeTruthy();
      expect(e.sourceLabel as unknown as string).toMatch(/no NCERT section or page exists/);
      expect(e.sourceLabel as unknown as string).not.toMatch(/NCERT section \d/);
    }
  });
});

describe('nothing is pre-filled and nothing has moved', () => {
  it('leaves every response template empty', () => {
    for (const e of entries) {
      const tpl = rd(`class11-review/pilot/responses/${e.artifactId}.response.json`);
      expect(tpl.reviewer).toBeNull();
      expect(tpl.reviewDate).toBeNull();
      expect(tpl.overallRecommendation).toBeNull();
      expect(tpl.lessonGranularity).toBeNull();
      for (const u of tpl.unitResults as unknown as Array<Record<string, unknown>>) {
        expect(u.materialAlignment).toBeNull();
        expect(u.mathematicalCorrectness).toBeNull();
      }
    }
  });

  it('rejects an untouched template, because it is not a review', () => {
    const e = entries[0];
    const empty = responseTemplate(e.artifactId as unknown as string,
      e.artifactFingerprint as unknown as string, e.mappedUnits as unknown as string[]);
    const r = validateResponse(empty, packets);
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/reviewer identity is missing/);
  });

  it('keeps the pilot and wave lifecycles at zero', () => {
    const t = LEDGER.totals as unknown as Record<string, number>;
    expect(t.pilotPackets).toBe(4);
    expect(t.sent).toBe(0);
    expect(t.humanReviewed).toBe(0);
    for (const e of entries) {
      expect(e.reviewer).toBeNull();
      expect(e.sentAt).toBeNull();
      expect(e.responseReceived).toBe(false);
      expect(e.reviewStatus).toBe('UNREVIEWED');
      expect(e.adjudicationStatus).toBe('NOT_STARTED');
    }
    expect((INTAKE.totals as unknown as Record<string, number>).sent).toBe(0);
  });

  it('assigns no reviewer', () => {
    expect(LEDGER.assignmentNote as unknown as string).toMatch(/user's to make/);
    expect((LEDGER.deliveryOptions as unknown as unknown[]).length).toBeGreaterThan(1);
  });

  it('leaves the Class 12 gate awaiting real findings', () => {
    expect(GATE.state).toBe('AWAITING_HUMAN_REVIEW');
    expect((GATE.systemicMetrics as unknown as { computed: boolean }).computed).toBe(false);
  });
});

describe('the bundle invites disagreement rather than steering it', () => {
  it('says what automation did and did not establish', () => {
    expect(BUNDLE).toMatch(/cannot establish that it \*\*teaches\*\*/);
    expect(BUNDLE).toMatch(/free to disagree/);
    expect(BUNDLE).not.toMatch(/already aligned|pre-reviewed|approved/i);
  });

  it('records the no-figure case as an observation, not a finding', () => {
    expect(BUNDLE).toMatch(/Pre-review observation/);
    expect(BUNDLE).toMatch(/consistent with the curriculum record rather than an omission/);
  });
});
