// v0.51 §10 + §21 — the heuristic router is never presented as
// psychometric measurement.

import { describe, it, expect } from 'vitest';
import { ITEMS } from '../../../data/items';
import {
  HeuristicAdaptiveRouter, maySupportPsychometricClaim,
  describeEstimate, PSYCHOMETRIC_CLAIMS, type AbilityEstimate,
} from '../AssessmentRouter';

const pool = ITEMS.filter((i) => i.skillId === 'FR.02').slice(0, 8);
const router = new HeuristicAdaptiveRouter();

describe('§10 the router declares itself uncalibrated', () => {
  it('is explicitly not calibrated', () => {
    expect(router.isCalibrated).toBe(false);
    expect(router.id).toBe('heuristic_v1');
  });

  it('its estimate is on an internal scale, never a calibrated one', () => {
    const s = router.initialize();
    expect(s.estimate.scale).toBe('internal_heuristic');
    expect(s.estimate.isCalibrated).toBe(false);
  });

  it('returns null uncertainty rather than inventing a standard error', () => {
    const s = router.initialize();
    expect(router.getUncertainty()).toBeNull();
    expect(s.estimate.uncertainty).toBeNull();
  });
});

describe('§10 uncalibrated estimates support no psychometric claim', () => {
  it('refuses the claim for a heuristic estimate', () => {
    const s = router.initialize();
    expect(maySupportPsychometricClaim(s.estimate)).toBe(false);
  });

  it('refuses even a "calibrated" estimate that lacks uncertainty', () => {
    const e: AbilityEstimate = {
      value: 5, uncertainty: null, scale: 'calibrated_logit', isCalibrated: true,
    };
    expect(maySupportPsychometricClaim(e)).toBe(false);
  });

  it('the description disclaims rather than asserts a psychometric result', () => {
    const text = describeEstimate(router.initialize().estimate);
    // It may NAME the claims it cannot make — that is the disclaimer.
    // What it must never do is report a value for one.
    expect(text).toMatch(/cannot yet report/i);
    expect(text).not.toMatch(/\d+(st|nd|rd|th) percentile/i);
    expect(text).not.toMatch(/percentile[:=]\s*\d/i);
    expect(text).not.toMatch(/RIT/);
    expect(text).not.toMatch(/grade equivalent of/i);
    // And PSYCHOMETRIC_CLAIMS must be a non-empty guard list.
    expect(PSYCHOMETRIC_CLAIMS.length).toBeGreaterThan(5);
  });
});

describe('§10 behaviour is preserved from v0.50', () => {
  it('starts at the configured ability', () => {
    expect(router.initialize().estimate.value).toBe(5);
  });

  it('moves one step per response and stays in range', () => {
    let s = router.initialize();
    s = router.updateEstimate(s, { itemId: 'a', correct: true });
    expect(s.estimate.value).toBe(6);
    s = router.updateEstimate(s, { itemId: 'b', correct: false });
    expect(s.estimate.value).toBe(5);
    for (let i = 0; i < 20; i++) {
      s = router.updateEstimate(s, { itemId: `x${i}`, correct: false });
    }
    expect(s.estimate.value).toBeGreaterThanOrEqual(1);
  });

  it('selects the nearest-difficulty unseen item', () => {
    const s = router.initialize();
    const picked = router.selectNextItem(pool, s);
    expect(picked).not.toBeNull();
    const gaps = pool.map((i) => Math.abs(i.difficulty - 5));
    expect(Math.abs(picked!.difficulty - 5)).toBe(Math.min(...gaps));
  });

  it('never repeats an administered item', () => {
    let s = router.initialize();
    const seen: string[] = [];
    for (let i = 0; i < pool.length; i++) {
      const next = router.selectNextItem(pool, s);
      if (!next) break;
      expect(seen).not.toContain(next.id);
      seen.push(next.id);
      s = router.updateEstimate(s, { itemId: next.id, correct: true });
    }
    expect(new Set(seen).size).toBe(seen.length);
  });

  it('stops when the pool is exhausted', () => {
    let s = router.initialize();
    for (const item of pool) {
      s = router.updateEstimate(s, { itemId: item.id, correct: true });
    }
    expect(router.shouldStop(s, pool)).toBe(true);
    expect(router.selectNextItem(pool, s)).toBeNull();
  });
});
