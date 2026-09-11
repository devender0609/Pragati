// v0.52 — eligibility, assembly, governance, and versioning.

import { describe, it, expect } from 'vitest';
import {
  evaluateGrowthItemEligibility, eligibleItemsFor, contextSupported,
  NO_CALIBRATION, type GrowthItemRecord,
} from '../growthEligibility';
import {
  assembleAssessment, validateAdministrationSpec, PILOT_ADMINISTRATION_V1,
  type AssemblyCandidate, type PilotAdministrationSpecification,
} from '../assessmentAssembler';
import {
  validateEvidenceRecord, qualifiesAsExpertReviewed, administrationComparability,
  supportById, variantFieldTestEligible, variantsAreDistinctRecords,
  captureConfiguration, validateConfigurationSnapshot, summariseResponseQuality,
  ACCESSIBILITY_SUPPORTS, type ReviewRecord, type SpecificationEvidenceRecord,
  type ItemFamily,
} from '../assessmentGovernance';
import { specificationById, RATIONAL_NUMBER_SPECIFICATIONS } from '../rationalNumberSpecifications';
import { ITEMS } from '../../../data/items';
import { itemsFor } from '../itemUse';

const spec = RATIONAL_NUMBER_SPECIFICATIONS[0];
const lookup = specificationById;

const record = (over: Partial<GrowthItemRecord> = {}): GrowthItemRecord => ({
  itemId: 'g1',
  use: 'growth_field_test',
  specificationId: spec.specificationId,
  lifecycleStatus: 'approved_for_field_test',
  completedReviews: ['mathematical_content', 'curriculum_alignment', 'accessibility'],
  calibration: NO_CALIBRATION,
  securityFlags: [],
  operationalApprovalBy: null,
  ...over,
});

// ===========================================================================
// §2 — eligibility gates
// ===========================================================================

describe('§2 a draft specification cannot make an item field-test eligible', () => {
  it('rejects the v0.51 hole: valid-but-draft specification', () => {
    // All eight pilot specs are draft and not fieldTestEligible.
    const r = evaluateGrowthItemEligibility({
      record: record(), context: 'growth_field_test', lookup,
    });
    expect(r.eligible).toBe(false);
    expect(r.reasons.join(' ')).toMatch(/review status is 'draft'/);
    expect(r.reasons.join(' ')).toMatch(/not marked fieldTestEligible/);
  });

  it('reports every failed requirement, not just the first', () => {
    const r = evaluateGrowthItemEligibility({
      record: record({ completedReviews: [], lifecycleStatus: 'authoring' }),
      context: 'growth_field_test', lookup,
    });
    expect(r.reasons.length).toBeGreaterThan(3);
  });

  it('requires each item-level review', () => {
    for (const missing of ['mathematical_content', 'curriculum_alignment', 'accessibility'] as const) {
      const reviews = (['mathematical_content', 'curriculum_alignment', 'accessibility'] as const)
        .filter((x) => x !== missing);
      const r = evaluateGrowthItemEligibility({
        record: record({ completedReviews: [...reviews] }),
        context: 'growth_field_test', lookup,
      });
      expect(r.reasons.join(' ')).toMatch(new RegExp(missing.split('_')[0], 'i'));
    }
  });

  it('requires a lifecycle status that permits field testing', () => {
    const r = evaluateGrowthItemEligibility({
      record: record({ lifecycleStatus: 'in_review' }),
      context: 'growth_field_test', lookup,
    });
    expect(r.reasons.join(' ')).toMatch(/does not permit field testing/);
  });

  it('instructional exposure permanently blocks Growth use', () => {
    const r = evaluateGrowthItemEligibility({
      record: record(), context: 'growth_field_test', lookup,
      exposure: { itemId: 'g1', growthAdministrations: 0, instructionalAdministrations: 1, lastAdministeredAt: 1 },
    });
    expect(r.reasons.join(' ')).toMatch(/permanently ineligible/);
  });

  it('security flags block administration', () => {
    const r = evaluateGrowthItemEligibility({
      record: record({ securityFlags: ['published_online'] }),
      context: 'growth_field_test', lookup,
    });
    expect(r.reasons.join(' ')).toMatch(/Security flags/);
  });

  it('an instructional item can never be Growth-eligible', () => {
    for (const use of ['independent_practice', 'guided_practice', 'learning_example'] as const) {
      const r = evaluateGrowthItemEligibility({
        record: record({ use }), context: 'growth_field_test', lookup,
      });
      expect(r.eligible).toBe(false);
      expect(r.reasons.join(' ')).toMatch(/instructional/);
    }
  });
});

describe('§3 field-test and operational are separate contexts', () => {
  it('a field-test item cannot enter operational Growth', () => {
    const r = evaluateGrowthItemEligibility({
      record: record(), context: 'growth_operational', lookup,
    });
    expect(r.eligible).toBe(false);
    expect(r.reasons.join(' ')).toMatch(/cannot enter an operational/);
  });

  it('an operational item requires every calibration artefact', () => {
    const r = evaluateGrowthItemEligibility({
      record: record({
        use: 'growth_operational', lifecycleStatus: 'field_tested',
      }),
      context: 'growth_operational', lookup,
    });
    const joined = r.reasons.join(' ');
    expect(joined).toMatch(/No calibration version/);
    expect(joined).toMatch(/calibrated difficulty/);
    expect(joined).toMatch(/fit has not been accepted/);
    expect(joined).toMatch(/DIF review/);
    expect(joined).toMatch(/operational approval/);
  });

  it('operational Growth is disabled at product level', () => {
    const s = contextSupported('growth_operational');
    expect(s.supported).toBe(false);
    expect(s.reason).toMatch(/no field test or calibration/i);
    expect(contextSupported('growth_field_test').supported).toBe(true);
  });

  it('the current bank yields zero eligible items for either context', () => {
    const records = itemsFor(ITEMS, 'growth').map((i) => record({ itemId: i.id }));
    for (const context of ['growth_field_test', 'growth_operational'] as const) {
      const { eligible } = eligibleItemsFor({ records, context, lookup });
      expect(eligible).toEqual([]);
    }
  });
});

// ===========================================================================
// §4/§5 — assembler
// ===========================================================================

const candidate = (over: Partial<AssemblyCandidate> = {}): AssemblyCandidate => ({
  itemId: 'c1', domainId: 'NUM', competencyId: 'NUM.1',
  format: 'single_select', cognitiveDemand: 'procedural_fluency',
  difficulty: 5, gradeRange: { from: 'class5', to: 'class8' },
  language: 'en', enemyItemIds: [], exposureCount: 0, ...over,
});

function bankFor(spec: PilotAdministrationSpecification, perDomain: number) {
  const out: AssemblyCandidate[] = [];
  for (const w of spec.domainWeights) {
    for (let i = 0; i < perDomain; i++) {
      out.push(candidate({
        itemId: `${w.domainId}-${i}`, domainId: w.domainId,
        competencyId: `${w.domainId}.${i % 3}`, difficulty: 1 + (i % 10),
      }));
    }
  }
  return out;
}

describe('§4 the assembler enforces the blueprint', () => {
  it('fails rather than relaxing an impossible blueprint', () => {
    const r = assembleAssessment({
      spec: PILOT_ADMINISTRATION_V1,
      candidates: bankFor(PILOT_ADMINISTRATION_V1, 1), // far too few
      grade: 'class6', language: 'en',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.unmetConstraints.length).toBeGreaterThan(0);
      expect(r.reason).toMatch(/never relaxed/i);
    }
  });

  it('names which domain failed and by how much', () => {
    const bank = bankFor(PILOT_ADMINISTRATION_V1, 8)
      .filter((c) => c.domainId !== 'GEO');
    const r = assembleAssessment({
      spec: PILOT_ADMINISTRATION_V1, candidates: bank, grade: 'class6', language: 'en',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.unmetConstraints.join(' ')).toMatch(/Domain GEO.*requires at least/);
  });

  it('assembles and satisfies every domain minimum when the bank allows', () => {
    const r = assembleAssessment({
      spec: PILOT_ADMINISTRATION_V1, candidates: bankFor(PILOT_ADMINISTRATION_V1, 10),
      grade: 'class6', language: 'en',
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      for (const cov of r.coverage) expect(cov.satisfied).toBe(true);
      expect(r.items.length).toBeGreaterThanOrEqual(PILOT_ADMINISTRATION_V1.minimumLength);
      expect(r.items.length).toBeLessThanOrEqual(PILOT_ADMINISTRATION_V1.maximumLength);
    }
  });

  it('is not a slice: items span every blueprint domain', () => {
    const r = assembleAssessment({
      spec: PILOT_ADMINISTRATION_V1, candidates: bankFor(PILOT_ADMINISTRATION_V1, 10),
      grade: 'class6', language: 'en',
    });
    if (!r.ok) throw new Error('expected assembly');
    const domains = new Set(r.items.map((i) => i.domainId));
    expect(domains.size).toBe(PILOT_ADMINISTRATION_V1.domainWeights.length);
  });

  it('enforces required competency coverage', () => {
    const r = assembleAssessment({
      spec: PILOT_ADMINISTRATION_V1, candidates: bankFor(PILOT_ADMINISTRATION_V1, 10),
      grade: 'class6', language: 'en',
      requiredCompetencyIds: ['NOT.PRESENT'],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.unmetConstraints.join(' ')).toMatch(/not covered/);
  });

  it('excludes items outside the grade band, other languages, and over-exposed items', () => {
    const bank = bankFor(PILOT_ADMINISTRATION_V1, 10);
    const wrongGrade = assembleAssessment({
      spec: PILOT_ADMINISTRATION_V1, candidates: bank, grade: 'class12', language: 'en',
    });
    expect(wrongGrade.ok).toBe(false);
    const wrongLang = assembleAssessment({
      spec: PILOT_ADMINISTRATION_V1, candidates: bank, grade: 'class6', language: 'hi',
    });
    expect(wrongLang.ok).toBe(false);
    const overExposed = assembleAssessment({
      spec: PILOT_ADMINISTRATION_V1,
      candidates: bank.map((c) => ({ ...c, exposureCount: 99 })),
      grade: 'class6', language: 'en',
    });
    expect(overExposed.ok).toBe(false);
  });

  it('respects enemy-item constraints', () => {
    const bank = bankFor(PILOT_ADMINISTRATION_V1, 10);
    bank[0].enemyItemIds = [bank[1].itemId];
    const r = assembleAssessment({
      spec: PILOT_ADMINISTRATION_V1, candidates: bank, grade: 'class6', language: 'en',
    });
    if (r.ok) {
      const ids = r.items.map((i) => i.itemId);
      expect(ids.includes(bank[0].itemId) && ids.includes(bank[1].itemId)).toBe(false);
    }
  });
});

describe('§5 test length is configuration, not a hardwired rule', () => {
  it('the pilot spec is a research hypothesis, not evidence', () => {
    expect(PILOT_ADMINISTRATION_V1.evidenceStatus).toBe('research_hypothesis');
    expect(PILOT_ADMINISTRATION_V1.rationale).toMatch(/NONE of these values is empirically supported/i);
  });

  it('a different length works without code changes', () => {
    const shorter: PilotAdministrationSpecification = {
      ...PILOT_ADMINISTRATION_V1, version: 'v-test',
      targetLength: 24, minimumLength: 16, maximumLength: 30,
      domainWeights: PILOT_ADMINISTRATION_V1.domainWeights.map((w) => ({ ...w, minItems: 1 })),
    };
    const r = assembleAssessment({
      spec: shorter, candidates: bankFor(shorter, 10), grade: 'class6', language: 'en',
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.items.length).toBeLessThanOrEqual(30);
  });

  it('validates internal consistency', () => {
    expect(validateAdministrationSpec(PILOT_ADMINISTRATION_V1)).toEqual([]);
    const bad = { ...PILOT_ADMINISTRATION_V1, evidenceStatus: 'validated' as const };
    expect(validateAdministrationSpec(bad).join()).toMatch(/no validation study/);
  });
});

// ===========================================================================
// §7/§8 — evidence and review
// ===========================================================================

const evidence: SpecificationEvidenceRecord = {
  evidenceType: 'curriculum_framework',
  sourceTitle: 'CBSE Curriculum 2026-27, Mathematics Class IX',
  sourceOrganization: 'CBSE',
  sourceVersion: '2026-27',
  location: 'Curricular Goals section, CG-1',
  curriculumReference: 'CG-1', competencyReference: 'C-1.1',
  evidenceClaim: 'CG-1 covers understanding of numbers and number sets.',
  verifiedBy: 'reviewer', verifiedAt: '2026-08-18',
  primarySourceInspected: true,
};

describe('§7 evidence must be traceable, not a URL', () => {
  it('accepts a complete record', () => {
    expect(validateEvidenceRecord(evidence)).toEqual([]);
  });

  it('rejects a bare URL as the claim', () => {
    expect(validateEvidenceRecord({ ...evidence, evidenceClaim: 'https://example.com/doc.pdf' }).join())
      .toMatch(/bare URL/);
  });

  it('requires a locator, not just a document', () => {
    expect(validateEvidenceRecord({ ...evidence, location: '' }).join()).toMatch(/location/);
  });
});

describe('§8 expert review needs structured evidence, not a name', () => {
  const review = (over: Partial<ReviewRecord> = {}): ReviewRecord => ({
    reviewerId: 'r1', reviewerName: 'A', reviewerRole: 'mathematics_educator',
    expertise: 'Middle-stage mathematics', reviewType: 'holistic',
    versionReviewed: 'v1', reviewDate: '2026-08-01', decision: 'approve',
    mathematicalAccuracy: 'pass', competencyAlignment: 'pass',
    languageClarity: 'pass', biasFairness: 'pass', accessibility: 'pass',
    comments: '',
    ...over,
  });

  it('one reviewer is not expert review', () => {
    const r = qualifiesAsExpertReviewed([review()], 'v1');
    expect(r.qualifies).toBe(false);
    expect(r.reasons.join(' ')).toMatch(/at least 2/);
  });

  it('two independent approving experts qualify', () => {
    const r = qualifiesAsExpertReviewed(
      [review(), review({ reviewerId: 'r2', reviewerName: 'B', reviewerRole: 'curriculum_expert' })],
      'v1'
    );
    expect(r.qualifies).toBe(true);
  });

  it('reviews of an older version do not count', () => {
    const r = qualifiesAsExpertReviewed(
      [review({ versionReviewed: 'v0' }), review({ reviewerId: 'r2', versionReviewed: 'v0' })],
      'v1'
    );
    expect(r.qualifies).toBe(false);
    expect(r.reasons.join(' ')).toMatch(/current version/);
  });

  it('a failing judgement blocks qualification', () => {
    const r = qualifiesAsExpertReviewed(
      [review(), review({ reviewerId: 'r2', reviewerRole: 'curriculum_expert', biasFairness: 'fail' })],
      'v1'
    );
    expect(r.qualifies).toBe(false);
  });

  it('practising teachers alone do not constitute expert review', () => {
    const r = qualifiesAsExpertReviewed(
      [review({ reviewerRole: 'practising_teacher' }),
       review({ reviewerId: 'r2', reviewerRole: 'practising_teacher' })],
      'v1'
    );
    expect(r.qualifies).toBe(false);
  });
});

// ===========================================================================
// §12/§13 — accommodations and language
// ===========================================================================

describe('§12 accommodations are categorised, not blanket-flagged', () => {
  it('magnification is a universal feature expected to be comparable', () => {
    const m = supportById('magnification')!;
    expect(m.category).toBe('universal_feature');
    expect(m.comparability).toBe('expected_comparable');
  });

  it('a calculator where prohibited is a construct-altering modification', () => {
    const c = supportById('calculator_when_prohibited')!;
    expect(c.category).toBe('modification');
    expect(c.comparability).toBe('potentially_non_comparable');
  });

  it('read-aloud requires evidence rather than blanket approval or rejection', () => {
    expect(supportById('text_to_speech')!.comparability).toBe('requires_evidence');
  });

  it('overall comparability takes the most cautious status used', () => {
    expect(administrationComparability(['magnification'])).toBe('expected_comparable');
    expect(administrationComparability(['magnification', 'extended_time'])).toBe('requires_evidence');
    expect(administrationComparability(['magnification', 'calculator_when_prohibited']))
      .toBe('potentially_non_comparable');
  });

  it('every support states its barrier and possible construct impact', () => {
    for (const s of ACCESSIBILITY_SUPPORTS) {
      expect(s.intendedBarrier.length).toBeGreaterThan(0);
      expect(s.possibleConstructImpact.length).toBeGreaterThan(0);
      expect(s.rationale.length).toBeGreaterThan(0);
    }
  });
});

describe('§13 language variants are separate measurement records', () => {
  const family: ItemFamily = {
    itemFamilyId: 'fam1', competencyId: 'RAT.EQUIV',
    specificationId: spec.specificationId, sourceLanguage: 'en',
    variants: [
      { itemId: 'fam1-en', language: 'en', translationStatus: 'field_test_ready',
        translator: null, independentReviewer: 'x', adjudicator: 'y',
        equivalenceReviewCompleted: true, mathematicalTerminologyReviewCompleted: true,
        readingLoadReviewCompleted: true, fieldTestStatus: 'field_tested', difStatus: 'analysed_clear' },
      { itemId: 'fam1-hi', language: 'hi', translationStatus: 'translated',
        translator: 'z', independentReviewer: null, adjudicator: null,
        equivalenceReviewCompleted: false, mathematicalTerminologyReviewCompleted: false,
        readingLoadReviewCompleted: false, fieldTestStatus: 'not_tested', difStatus: 'not_analysed' },
    ],
  };

  it('each variant has its own item id', () => {
    expect(variantsAreDistinctRecords(family)).toBe(true);
  });

  it('translation alone does not make a variant field-test eligible', () => {
    const hi = variantFieldTestEligible(family.variants[1]);
    expect(hi.eligible).toBe(false);
    expect(hi.reasons.join(' ')).toMatch(/adjudication|equivalence|terminology/i);
  });

  it('an English field-tested form says nothing about the Hindi form', () => {
    expect(family.variants[0].fieldTestStatus).toBe('field_tested');
    expect(family.variants[1].fieldTestStatus).toBe('not_tested');
    expect(family.variants[1].difStatus).toBe('not_analysed');
  });
});

// ===========================================================================
// §18/§19 — quality metadata and versioning
// ===========================================================================

describe('§19 configuration is snapshotted', () => {
  const snap = captureConfiguration({
    assessmentSpecificationId: 'pragati.growth.math.pilot',
    assessmentSpecificationVersion: 'v1', blueprintVersion: 'v1',
    language: 'en', now: 1000,
  });

  it('captures every version needed to interpret the session later', () => {
    expect(validateConfigurationSnapshot(snap)).toEqual([]);
    expect(snap.routerId).toBe('heuristic_v1');
    expect(snap.competencyFrameworkVersion).toBeTruthy();
    expect(snap.calibrationVersion).toBeNull();
  });

  it('detects an incomplete snapshot', () => {
    expect(validateConfigurationSnapshot({ ...snap, blueprintVersion: '' }).join())
      .toMatch(/blueprintVersion/);
  });
});

describe('§18 response quality is recorded but never acted on', () => {
  it('summarises without issuing a verdict', () => {
    const s = summariseResponseQuality({
      totalTimeMs: 100000,
      itemMetadata: [
        { itemId: 'a', responseTimeMs: 900, interruptionCount: 0, longestInterruptionMs: 0, omitted: false, resumeEventCount: 0 },
        { itemId: 'b', responseTimeMs: 45000, interruptionCount: 1, longestInterruptionMs: 30000, omitted: false, resumeEventCount: 1 },
        { itemId: 'c', responseTimeMs: 0, interruptionCount: 0, longestInterruptionMs: 0, omitted: true, resumeEventCount: 0 },
      ],
      deviceUserAgent: 'test', connectivityInterruptions: 1, proctorIrregularityFlags: [],
    });
    expect(s.verdict).toBe('no_automated_verdict');
    expect(s.omittedCount).toBe(1);
    expect(s.totalInterruptions).toBe(1);
    // A 900ms response is NOT flagged as rapid guessing.
    expect(s.note).toMatch(/no rapid-guessing threshold/i);
    // The note NAMES what is not done ("invalidates no administration") —
    // that is the disclaimer. What must not exist is a verdict field
    // carrying a judgement.
    expect(Object.keys(s)).not.toContain('valid');
    expect(Object.keys(s)).not.toContain('flagged');
    expect(Object.keys(s)).not.toContain('rapidGuessing');
    expect(s.verdict).not.toMatch(/invalid|suspect/i);
  });
});
