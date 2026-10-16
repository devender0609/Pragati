// v0.51 §12 + §8 + §12(testing) — specifications gate Growth authoring.

import { describe, it, expect } from 'vitest';
import {
  validateSpecification, requireSpecification, validateItemBank,
  isImplementedFormat, IMPLEMENTED_FORMATS, type ItemSpecification,
} from '../itemSpecification';
import {
  RATIONAL_NUMBER_SPECIFICATIONS, specificationById,
  specificationsForCompetency,
} from '../rationalNumberSpecifications';
import { ITEMS } from '../../../data/items';
import {
  validateReadiness, studentAvailabilityLabel, DEFAULT_READINESS,
  GOVERNANCE_TERMS, type ReadinessProfile,
} from '../../../curriculum/readiness';

const lookup = specificationById;
const valid = RATIONAL_NUMBER_SPECIFICATIONS[0];

describe('§12 the pilot specification set is valid', () => {
  it('has eight specifications spanning the strand', () => {
    expect(RATIONAL_NUMBER_SPECIFICATIONS.length).toBe(8);
    const comps = new Set(RATIONAL_NUMBER_SPECIFICATIONS.map((s) => s.competencyId));
    expect(comps.size).toBeGreaterThanOrEqual(6);
  });

  it('every specification passes validation', () => {
    for (const s of RATIONAL_NUMBER_SPECIFICATIONS) {
      expect(validateSpecification(s)).toEqual([]);
    }
  });

  it('every specification states its evidence claim and diagnosis', () => {
    for (const s of RATIONAL_NUMBER_SPECIFICATIONS) {
      expect(s.evidenceStatement).toMatch(/evidence that/i);
      expect(s.incorrectResponseIndicates.length).toBeGreaterThan(0);
      expect(s.prohibitedShortcuts.length).toBeGreaterThan(0);
    }
  });

  it('none claims review it has not had', () => {
    for (const s of RATIONAL_NUMBER_SPECIFICATIONS) {
      expect(s.reviewStatus).toBe('draft');
      expect(s.reviewedBy).toEqual([]);
      expect(s.fieldTestEligible).toBe(false);
      expect(s.calibrationStatus).not.toBe('calibrated');
    }
  });

  it('resolves by ID and by competency', () => {
    expect(specificationById(valid.specificationId)).toBe(valid);
    expect(specificationById('SPEC.NOPE')).toBeNull();
    expect(specificationsForCompetency('RAT.REPRESENT').length).toBe(2);
  });
});

describe('§12 validation rejects unreviewable specifications', () => {
  const broken = (over: Partial<ItemSpecification>): ItemSpecification =>
    ({ ...valid, ...over });

  it('rejects a missing evidence statement', () => {
    expect(validateSpecification(broken({ evidenceStatement: '' })).join())
      .toMatch(/evidenceStatement/);
  });

  it('rejects an inverted or out-of-range difficulty band', () => {
    expect(validateSpecification(broken({ targetDifficultyBand: { min: 8, max: 3 } })).join())
      .toMatch(/targetDifficultyBand/);
    expect(validateSpecification(broken({ targetDifficultyBand: { min: 0, max: 12 } })).join())
      .toMatch(/targetDifficultyBand/);
  });

  it('rejects a review claim with no reviewer', () => {
    const r = validateSpecification(broken({ reviewStatus: 'expert_reviewed', reviewedBy: [] }));
    expect(r.join()).toMatch(/claims review but reviewedBy is empty/);
  });

  it('rejects field-test eligibility without expert review', () => {
    const r = validateSpecification(broken({ fieldTestEligible: true }));
    expect(r.join()).toMatch(/requires expert review/);
  });

  it('rejects a calibrated claim outright', () => {
    const r = validateSpecification(broken({ calibrationStatus: 'calibrated' }));
    expect(r.join()).toMatch(/no calibration data/i);
  });

  it('rejects a select-format spec with no misconception targets', () => {
    const r = validateSpecification(broken({ misconceptionTargets: [] }));
    expect(r.join()).toMatch(/misconception target/);
  });

  it('rejects a spec with no prohibited shortcuts', () => {
    expect(validateSpecification(broken({ prohibitedShortcuts: [] })).join())
      .toMatch(/prohibitedShortcuts/);
  });
});

describe('§12 a Growth item cannot exist without a specification', () => {
  it('refuses a Growth item with no specificationId', () => {
    const errs = requireSpecification(
      { id: 'g1', use: 'growth_operational' }, lookup
    );
    expect(errs.join()).toMatch(/require a specificationId/);
  });

  it('refuses a Growth item whose specification does not resolve', () => {
    const errs = requireSpecification(
      { id: 'g2', use: 'growth_field_test', specificationId: 'SPEC.MISSING' }, lookup
    );
    expect(errs.join()).toMatch(/does not resolve/);
  });

  it('refuses a Growth item whose specification is for another use', () => {
    // The pilot specs are all growth_field_test.
    const errs = requireSpecification(
      { id: 'g3', use: 'growth_operational', specificationId: valid.specificationId },
      lookup
    );
    expect(errs.join()).toMatch(/intendedUse/);
  });

  it('accepts a Growth item with a matching valid specification', () => {
    const errs = requireSpecification(
      { id: 'g4', use: 'growth_field_test', specificationId: valid.specificationId },
      lookup
    );
    expect(errs).toEqual([]);
  });

  it('does NOT require specifications for instructional items', () => {
    // Retro-specifying the whole existing practice bank would be
    // busywork with no measurement benefit.
    expect(requireSpecification({ id: 'p1', use: 'independent_practice' }, lookup)).toEqual([]);
    expect(requireSpecification({ id: 'p2' }, lookup)).toEqual([]);
  });

  it('the shipped item bank passes the gate', () => {
    expect(validateItemBank(ITEMS, lookup)).toEqual([]);
  });
});

describe('§9 unsupported item formats fail safely', () => {
  it('only three formats are implemented', () => {
    expect([...IMPLEMENTED_FORMATS].sort()).toEqual(
      ['fraction_entry', 'numeric_entry', 'single_select']
    );
  });

  it('future formats are declared but not implemented', () => {
    for (const f of ['ordering', 'matching', 'graph_response', 'interactive_geometry'] as const) {
      expect(isImplementedFormat(f)).toBe(false);
    }
  });

  it('a spec may permit a future format but cannot be field-test eligible on it alone', () => {
    const orderingOnly: ItemSpecification = {
      ...valid,
      permittedFormats: ['ordering'],
      misconceptionTargets: [],
      distractorRationaleRequired: false,
      reviewStatus: 'expert_reviewed',
      reviewedBy: ['reviewer'],
      fieldTestEligible: true,
    };
    expect(validateSpecification(orderingOnly).join()).toMatch(/no permitted format has a scorer/);
  });
});

describe('§8 readiness dimensions are independent', () => {
  const profile: ReadinessProfile = {
    curriculum: 'secondary_corroborated',
    instruction: 'prototype',
    practice: 'usable',
    growth: 'not_eligible',
  };

  it('models the real Class 6 Fractions state without contradiction', () => {
    expect(validateReadiness(profile)).toEqual([]);
    // Good practice bank, prototype lessons, and STILL not Growth-eligible.
    expect(profile.practice).toBe('usable');
    expect(profile.growth).toBe('not_eligible');
  });

  it('growth readiness is never inferred from practice readiness', () => {
    const strongPractice: ReadinessProfile = { ...profile, practice: 'published' };
    expect(strongPractice.growth).toBe('not_eligible');
    expect(validateReadiness(strongPractice)).toEqual([]);
  });

  it('rejects a calibrated or operational growth claim', () => {
    for (const g of ['calibrated', 'operational'] as const) {
      expect(validateReadiness({ ...profile, growth: g }).join())
        .toMatch(/no calibration data/i);
    }
  });

  it('defaults are the honest floor', () => {
    expect(DEFAULT_READINESS.curriculum).toBe('unverified');
    expect(DEFAULT_READINESS.growth).toBe('not_eligible');
  });
});

describe('§5 student labels carry no governance jargon', () => {
  it('every student availability label is plain language', () => {
    const profiles: ReadinessProfile[] = [
      { curriculum: 'unverified', instruction: 'prototype', practice: 'usable', growth: 'not_eligible' },
      { curriculum: 'mapped', instruction: 'none', practice: 'usable', growth: 'field_test_ready' },
      { curriculum: 'mapped', instruction: 'published', practice: 'insufficient_bank', growth: 'items_authored' },
      DEFAULT_READINESS,
    ];
    for (const p of profiles) {
      const label = studentAvailabilityLabel(p).toLowerCase();
      for (const term of GOVERNANCE_TERMS) {
        expect(label).not.toContain(term.toLowerCase());
      }
    }
  });

  it('says "Coming soon" when there is genuinely nothing to do', () => {
    expect(studentAvailabilityLabel(DEFAULT_READINESS)).toBe('Coming soon');
  });

  it('never reveals Growth readiness to a student', () => {
    const a = studentAvailabilityLabel({
      curriculum: 'mapped', instruction: 'published', practice: 'published', growth: 'operational',
    });
    const b = studentAvailabilityLabel({
      curriculum: 'mapped', instruction: 'published', practice: 'published', growth: 'not_eligible',
    });
    // Growth status must not change what the student sees.
    expect(a).toBe(b);
  });
});
