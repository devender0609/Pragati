// v0.51 §6 + §7 + §19 + §12(testing) — Growth session rules and reporting.

import { describe, it, expect } from 'vitest';
import { ITEMS } from '../../../data/items';
import {
  buildGrowthPool, assertNoLeak, GROWTH_RULES, PRACTICE_RULES, rulesFor,
  logGrowthExposure, buildGrowthReport, REPORT_STATUS_LINE,
  FORBIDDEN_REPORT_CLAIMS, mayInterpretDomain,
  isGrowthAssignmentActive, activeAssignmentFor,
  type GrowthAssignment,
} from '../growthSession';
import { specificationById, RATIONAL_NUMBER_SPECIFICATIONS } from '../rationalNumberSpecifications';
import type { Item } from '../../../data/items';
import type { ExposureLog } from '../itemUse';

const spec = RATIONAL_NUMBER_SPECIFICATIONS[0];
const growthItem = (id: string): Item => ({
  ...ITEMS[0], id, use: 'growth_field_test', specificationId: spec.specificationId,
});

describe('§6 a Growth pool draws only from the secure bank', () => {
  it('refuses to build from the current bank, which has no Growth items', () => {
    const r = buildGrowthPool({ items: ITEMS, lookup: specificationById, targetLength: 10 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/no Growth items/i);
  });

  it('refuses a Growth item with no valid specification', () => {
    const bad = [{ ...ITEMS[0], id: 'x', use: 'growth_field_test' } as Item];
    const r = buildGrowthPool({ items: bad, lookup: specificationById, targetLength: 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.detail.join()).toMatch(/specificationId/);
  });

  it('refuses when the bank is smaller than the requested length', () => {
    const pool = [growthItem('g1'), growthItem('g2')];
    const r = buildGrowthPool({ items: pool, lookup: specificationById, targetLength: 10 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.detail.join()).toMatch(/too small|available/i);
  });

  it('builds when secure items carry valid specifications', () => {
    const pool = Array.from({ length: 12 }, (_, i) => growthItem(`g${i}`));
    const r = buildGrowthPool({ items: pool, lookup: specificationById, targetLength: 10 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.pool.length).toBe(10);
  });

  it('a mixed bank yields ONLY the secure items', () => {
    const mixed = [...ITEMS.slice(0, 20), ...Array.from({ length: 10 }, (_, i) => growthItem(`g${i}`))];
    const r = buildGrowthPool({ items: mixed, lookup: specificationById, targetLength: 10 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      for (const item of r.pool) expect(item.use).toBe('growth_field_test');
    }
  });
});

describe('§6 Growth items cannot leak into Learn or Practice', () => {
  for (const ctx of ['learn', 'practice'] as const) {
    it(`throws loudly if a Growth item reaches ${ctx}`, () => {
      expect(() => assertNoLeak([growthItem('leak')], ctx)).toThrow(/leaked/i);
    });
  }

  it('does not throw for a clean instructional pool', () => {
    expect(() => assertNoLeak(ITEMS.slice(0, 10), 'practice')).not.toThrow();
    expect(() => assertNoLeak(ITEMS.slice(0, 10), 'learn')).not.toThrow();
  });
});

describe('§6 Growth administration locks instruction', () => {
  it('disallows navigation, hints, examples, and feedback', () => {
    expect(GROWTH_RULES.allowInstructionalNavigation).toBe(false);
    expect(GROWTH_RULES.allowHints).toBe(false);
    expect(GROWTH_RULES.allowWorkedExamples).toBe(false);
    expect(GROWTH_RULES.allowImmediateCorrectnessFeedback).toBe(false);
    expect(GROWTH_RULES.recordExposure).toBe(true);
  });

  it('practice keeps all of them, because it claims nothing', () => {
    expect(PRACTICE_RULES.allowHints).toBe(true);
    expect(PRACTICE_RULES.allowInstructionalNavigation).toBe(true);
    expect(PRACTICE_RULES.recordExposure).toBe(false);
  });

  it('rulesFor selects by purpose', () => {
    expect(rulesFor('growth')).toBe(GROWTH_RULES);
    expect(rulesFor('practice')).toBe(PRACTICE_RULES);
    expect(rulesFor('chapter_check')).toBe(PRACTICE_RULES);
  });
});

describe('§6 exposure is recorded for Growth administrations', () => {
  it('increments the growth counter', () => {
    let log: ExposureLog = {};
    log = logGrowthExposure(log, 'g1', 1000);
    log = logGrowthExposure(log, 'g1', 2000);
    expect(log['g1'].growthAdministrations).toBe(2);
    expect(log['g1'].instructionalAdministrations).toBe(0);
  });
});

describe('§7 assignment drives whether Growth appears at all', () => {
  const a: GrowthAssignment = {
    id: 'a1', classroomId: 'room-a', assessmentId: 'pragati_growth_mathematics',
    window: 'mid_year', opensAt: 1000, closesAt: 2000,
    accommodationsByStudentId: {}, createdAt: 0,
  };

  it('is active only inside its window', () => {
    expect(isGrowthAssignmentActive(a, 500)).toBe(false);
    expect(isGrowthAssignmentActive(a, 1500)).toBe(true);
    expect(isGrowthAssignmentActive(a, 2500)).toBe(false);
  });

  it('finds nothing for a student in no classroom', () => {
    expect(activeAssignmentFor([a], null, 1500)).toBeNull();
  });

  it('finds nothing for a different classroom', () => {
    expect(activeAssignmentFor([a], 'room-b', 1500)).toBeNull();
  });

  it('finds the assignment for the right classroom in-window', () => {
    expect(activeAssignmentFor([a], 'room-a', 1500)?.id).toBe('a1');
  });
});

describe('§19 reports contain only defensible evidence', () => {
  const report = buildGrowthReport({
    administeredAt: 1000,
    completed: true,
    responses: [
      { itemId: 'i1', correct: true }, { itemId: 'i2', correct: false },
      { itemId: 'i3', correct: true }, { itemId: 'i4', correct: true },
      { itemId: 'i5', correct: false },
    ],
    competenciesSampled: ['RAT.EQUIV', 'RAT.COMPARE'],
    domainCounts: [
      { domainId: 'RAT', domainTitle: 'Fractions & Rational Number Reasoning', administered: 4, correct: 3 },
      { domainId: 'NUM', domainTitle: 'Number Sense & Operations', administered: 1, correct: 0 },
    ],
  });

  it('reports counts, competencies, and domain evidence', () => {
    expect(report.itemsAdministered).toBe(5);
    expect(report.correctResponses).toBe(3);
    expect(report.competenciesSampled).toEqual(['RAT.EQUIV', 'RAT.COMPARE']);
    expect(report.domainEvidence.length).toBe(2);
  });

  it('reports domains descriptively and never interprets them (v0.52 §6)', () => {
    // v0.51 flagged a 4-item domain as "sufficient for comment" on an
    // invented threshold. Every domain is now observed counts only,
    // regardless of how many items were administered.
    expect(mayInterpretDomain()).toBe(false);
    for (const d of report.domainEvidence) {
      expect(d.reportingState).toBe('observed_counts_only');
      expect(d.descriptiveSummary).toMatch(/answered correctly/);
      // No judgement vocabulary.
      expect(d.descriptiveSummary).not.toMatch(/strength|weakness|strong|weak|mastery|below|above/i);
    }
  });

  it('states that domain counts are not evidence of a difference', () => {
    expect(report.limitations.join(' ')).toMatch(/not evidence of a difference/i);
  });

  it('carries the prototype status line', () => {
    expect(report.reportStatus).toBe(REPORT_STATUS_LINE);
    expect(report.reportStatus).toMatch(/not yet psychometrically calibrated/i);
  });

  it('has NO field for any unsupported psychometric claim', () => {
    const keys = Object.keys(report).map((k) => k.toLowerCase());
    for (const claim of ['percentile', 'score', 'ability', 'growth', 'norm', 'mastery', 'rit']) {
      expect(keys.some((k) => k.includes(claim))).toBe(false);
    }
  });

  it('the serialised report asserts no forbidden claim', () => {
    const json = JSON.stringify(report).toLowerCase();
    for (const claim of FORBIDDEN_REPORT_CLAIMS) {
      // The limitations list NAMES what cannot be reported; that is the
      // disclaimer. What must not appear is a claim with a value.
      const asserted = new RegExp(`"${claim.toLowerCase()}"\\s*:`);
      expect(json).not.toMatch(asserted);
    }
  });

  it('states its limitations explicitly', () => {
    expect(report.limitations.join(' ')).toMatch(/not a calibrated assessment/i);
    expect(report.limitations.join(' ')).toMatch(/placement|promotion|streaming/i);
  });

  it('an incomplete session says so', () => {
    const partial = buildGrowthReport({
      administeredAt: 1, completed: false, responses: [{ itemId: 'i1', correct: true }],
      competenciesSampled: [], domainCounts: [],
    });
    expect(partial.limitations.join(' ')).toMatch(/did not complete/i);
  });

  it('ignores an ability estimate even when one is passed in', () => {
    const withEstimate = buildGrowthReport({
      administeredAt: 1, completed: true, responses: [], competenciesSampled: [], domainCounts: [],
      estimate: { value: 7.2, uncertainty: null, scale: 'internal_heuristic', isCalibrated: false },
    });
    expect(JSON.stringify(withEstimate)).not.toContain('7.2');
  });
});
