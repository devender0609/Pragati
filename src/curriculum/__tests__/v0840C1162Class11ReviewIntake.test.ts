/**
 * v0.84.0-c11.62 checkpoint 106 — the intake must accept real reviews and
 * refuse to invent them.
 *
 * The mock responses below are TEST FIXTURES. They are not reviews, they
 * move no lifecycle, and the ledger they are validated against stays at
 * zero. That distinction is itself asserted at the end of this file,
 * because a fixture quietly counted as a review is exactly how a project
 * ends up believing it was reviewed.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { loadPackets, validateResponse, buildIntakeLedger } from '../../../tools/class11/reviewIntake';

const root = path.join(__dirname, '../../..');
const INTAKE = JSON.parse(fs.readFileSync(
  path.join(root, 'class11-review/WAVE1_REVIEW_INTAKE.json'), 'utf8')) as Record<string, never>;
const GATE = JSON.parse(fs.readFileSync(
  path.join(root, 'class11-review/CLASS12_GATE.json'), 'utf8')) as Record<string, never>;
const entries = INTAKE.entries as unknown as Array<Record<string, never>>;
const packets = loadPackets();

const SHARED = 'ncert_kemh1_s7_2_binomial_theorem_lesson';
const good = (over: Record<string, unknown> = {}): Record<string, unknown> => {
  const p = packets.get(SHARED)!;
  return {
    reviewer: 'test-fixture-reviewer', reviewDate: '2026-11-19', artifactId: SHARED,
    reviewedFingerprint: p.artifactFingerprint,
    unitResults: p.canonicalUnits.map((u) => ({
      unitId: u.unitId, materialAlignment: 'ALIGNED',
      mathematicalCorrectness: 'CORRECT', scopeDiscipline: 'WITHIN_SCOPE',
    })),
    overallRecommendation: 'ACCEPT', issues: [], ...over,
  };
};

describe('the intake ledger reconciles with Wave 1', () => {
  it('holds exactly the 25 prepared artifacts', () => {
    expect(entries).toHaveLength(25);
    expect(new Set(entries.map((e) => e.artifactId)).size).toBe(25);
    for (const e of entries) expect(packets.has(e.artifactId as unknown as string)).toBe(true);
  });

  it('carries the packet fingerprint and mapped units unchanged', () => {
    for (const e of entries) {
      const p = packets.get(e.artifactId as unknown as string)!;
      expect(e.artifactFingerprint).toBe(p.artifactFingerprint);
      expect([...(e.mappedUnits as unknown as string[])].sort())
        .toEqual(p.canonicalUnits.map((u) => u.unitId).sort());
    }
  });

  it('starts every review field empty', () => {
    for (const e of entries) {
      expect(e.lifecycleState).toBe('READY_TO_SEND');
      expect(e.sent).toBe(false);
      expect(e.reviewer).toBeNull();
      expect(e.responseReceived).toBe(false);
      expect(e.unitResults).toBeNull();
      expect(e.overallRecommendation).toBeNull();
    }
  });
});

describe('the validator checks structure', () => {
  it('accepts a well-formed response', () => {
    const r = validateResponse(good(), packets);
    expect(r.errors).toEqual([]);
    expect(r.valid).toBe(true);
  });

  it('rejects an unknown artifact', () => {
    const r = validateResponse(good({ artifactId: 'not_a_real_lesson' }), packets);
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/not in Wave 1/);
  });

  it('rejects an anonymous response', () => {
    const r = validateResponse(good({ reviewer: '  ' }), packets);
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/not a human review/);
  });

  it('marks a stale fingerprint rather than applying it', () => {
    const r = validateResponse(good({ reviewedFingerprint: 'a'.repeat(32) }), packets);
    expect(r.status).toBe('STALE_REVIEW_RESPONSE');
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/needs re-review/);
  });

  it('rejects a missing unit result', () => {
    const base = good();
    const cut = (base.unitResults as unknown[]).slice(0, 3);
    const r = validateResponse(good({ unitResults: cut }), packets);
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/judged separately/);
  });

  it('rejects a unit that was never mapped', () => {
    const extra = [...(good().unitResults as unknown[]), {
      unitId: 'C11-SET-01', materialAlignment: 'ALIGNED',
      mathematicalCorrectness: 'CORRECT', scopeDiscipline: 'WITHIN_SCOPE',
    }];
    const r = validateResponse(good({ unitResults: extra }), packets);
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/not mapped to this artifact/);
  });

  it('rejects a duplicate unit result and a bad enum', () => {
    const units = good().unitResults as Array<Record<string, unknown>>;
    expect(validateResponse(good({ unitResults: [...units, units[0]] }), packets).errors.join(' '))
      .toMatch(/duplicate result/);
    expect(validateResponse(good({ overallRecommendation: 'LOOKS_FINE' }), packets).errors.join(' '))
      .toMatch(/not an allowed value/);
  });

  it('rejects a malformed issue', () => {
    const r = validateResponse(good({
      issues: [{ unitIds: [], stage: 'see_it', category: 'mathematical_error', severity: 'HUGE' }],
    }), packets);
    expect(r.valid).toBe(false);
    expect(r.errors.join(' ')).toMatch(/unitIds is required/);
    expect(r.errors.join(' ')).toMatch(/severity must be one of/);
  });
});

describe('the validator never overrules the reviewer', () => {
  it('accepts MISALIGNED on an artifact the audit called ready', () => {
    // Every Wave 1 artifact passed structural checks. A reviewer disagreeing
    // is the wave working, not a fault to filter.
    const units = (good().unitResults as Array<Record<string, unknown>>)
      .map((u, i) => ({ ...u, materialAlignment: i === 0 ? 'MISALIGNED' : 'PARTIAL' }));
    const r = validateResponse(good({
      unitResults: units, overallRecommendation: 'MAJOR_REWORK',
      lessonGranularity: 'SHOULD_SPLIT',
      issues: [{
        unitIds: ['C11-BIN-FO7'], stage: 'worked_examples', category: 'missing_objective',
        severity: 'MAJOR', explanation: 'fixture: objective is named but never instructed',
      }],
    }), packets);
    expect(r.errors).toEqual([]);
    expect(r.valid).toBe(true);
  });

  it('allows a mixed verdict across units of one artifact', () => {
    const units = (good().unitResults as Array<Record<string, unknown>>).map((u, i) => ({
      ...u, materialAlignment: ['ALIGNED', 'ALIGNED', 'PARTIAL', 'MISALIGNED'][i],
    }));
    expect(validateResponse(good({ unitResults: units, overallRecommendation: 'REVISE' }), packets).valid)
      .toBe(true);
  });
});

describe('nothing is reviewed and the gate is undecided', () => {
  it('keeps every lifecycle total at zero', () => {
    const t = INTAKE.totals as unknown as Record<string, number>;
    expect(t.prepared).toBe(25);
    expect(t.sent).toBe(0);
    expect(t.humanReviewed).toBe(0);
    expect(t.adjudicated).toBe(0);
    expect(t.published).toBe(0);
  });

  it('cannot reach HUMAN_REVIEWED without a valid response on file', () => {
    for (const e of entries) {
      if (e.lifecycleState === 'HUMAN_REVIEWED') {
        expect(e.responseValid).toBe(true);
        expect(e.reviewer).toBeTruthy();
      }
      expect(e.responseValid).toBeNull();
    }
    // Validating fixtures above moved nothing: the ledger on disk is
    // rebuilt from packets and still reports zero.
    const rebuilt = buildIntakeLedger() as Record<string, never>;
    expect((rebuilt.totals as unknown as Record<string, number>).humanReviewed).toBe(0);
  });

  it('leaves the Class 12 gate awaiting real findings', () => {
    expect(GATE.state).toBe('AWAITING_HUMAN_REVIEW');
    expect((GATE.systemicMetrics as unknown as { computed: boolean }).computed).toBe(false);
    expect(Object.keys(GATE.outcomes as unknown as object).sort())
      .toEqual(['BLOCKING', 'CLEAR', 'MANAGEABLE']);
  });

  it('states wave facts that match the packets on disk', () => {
    const f = GATE.verifiedWaveFacts as unknown as Record<string, number>;
    expect(f.packets).toBe(packets.size);
    expect(f.multiUnitPackets).toBe([...packets.values()].filter((p) => p.canonicalUnits.length > 1).length);
  });
});
