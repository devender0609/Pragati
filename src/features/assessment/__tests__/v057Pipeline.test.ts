// v0.57 §17 — the running product uses the real safeguards.

import { describe, it, expect } from 'vitest';
import {
  prepareGrowthAdministration, summariseBlockers,
  TEACHER_NOT_READY_MESSAGE, type GrowthItemMetadata,
} from '../prepareGrowthAdministration';
import { NO_CALIBRATION, type GrowthItemRecord } from '../growthEligibility';
import { specificationById, RATIONAL_NUMBER_SPECIFICATIONS } from '../rationalNumberSpecifications';
import { PILOT_ADMINISTRATION_V1 } from '../assessmentAssembler';
import type { PilotFrameworkAuthorization } from '../pilotFrameworkAuthorization';

// v0.58 §2 — these tests exercise the DOWNSTREAM pipeline, so they
// inject an authorized framework and an approved specification. The
// upstream gates have their own tests in v058Endtoend.
const AUTHORIZED: PilotFrameworkAuthorization = {
  authorized: true, frameworkStatus: 'approved_for_pilot',
  humanReviewStatus: 'approved', evidenceStatus: 'sufficient_for_pilot_freeze',
  teacherMessage: '', adminBlockers: [], frameworkVersion: 'v-test',
};
const APPROVED_SPEC = {
  ...PILOT_ADMINISTRATION_V1,
  status: 'approved_for_field_test' as const,
};
import {
  evaluateScopedGrowthReadiness, evaluateGrowthReadinessByScope,
  NO_SCOPED_EVIDENCE, type GrowthScope, type ScopedGrowthEvidence,
} from '../growthReadiness';

// The real pilot specifications are correctly `draft` and NOT
// field-test eligible, so they cannot produce an administrable item —
// which is the right product state but useless as a fixture. This is a
// hypothetical fully-reviewed specification, used only to exercise the
// downstream pipeline.
const readySpec = {
  ...RATIONAL_NUMBER_SPECIFICATIONS[0],
  specificationId: 'SPEC.TEST.READY',
  reviewStatus: 'expert_reviewed' as const,
  reviewedBy: ['Reviewer A', 'Reviewer B'],
  fieldTestEligible: true,
};
const spec = readySpec;
/** Resolves the test spec; falls back to the real registry. */
const lookup = (id: string) =>
  id === readySpec.specificationId ? readySpec : specificationById(id);

/** A record that passes every eligibility requirement. */
const eligibleRecord = (id: string): GrowthItemRecord => ({
  itemId: id, use: 'growth_field_test',
  specificationId: spec.specificationId,
  lifecycleStatus: 'approved_for_field_test',
  completedReviews: ['mathematical_content', 'curriculum_alignment', 'accessibility'],
  calibration: NO_CALIBRATION, securityFlags: [], operationalApprovalBy: null,
});

const meta = (id: string, domainId: GrowthItemMetadata['domainId']): GrowthItemMetadata => ({
  itemId: id, domainId, competencyId: `${domainId}.1`,
  format: 'single_select', cognitiveDemand: 'procedural_fluency',
  difficulty: 5, gradeRange: { from: 'class5', to: 'class8' },
  language: 'en', enemyItemIds: [],
});

describe('§2 the pipeline is the only path, and it is strict', () => {
  it('refuses when no formal Growth items exist — the real product state', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records: [], metadata: {},
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.ready).toBe(false);
    expect(r.form).toBeNull();
    expect(r.teacherMessage).toBe(TEACHER_NOT_READY_MESSAGE);
  });

  it('runs items through the FULL eligibility gate, not just a use check', () => {
    // Secure use + a specification id — enough for the old
    // buildGrowthPool, nowhere near enough now.
    const weak: GrowthItemRecord = {
      ...eligibleRecord('w1'), completedReviews: [], lifecycleStatus: 'authoring',
    };
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records: [weak],
      metadata: { w1: meta('w1', 'RAT') },
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.ready).toBe(false);
    const reasons = r.rejected[0].reasons.join(' ');
    expect(reasons).toMatch(/review/i);
    expect(reasons).toMatch(/lifecycle/i);
  });

  it('rejects an eligible item that has no assembly metadata', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records: [eligibleRecord('a')],
      metadata: {}, lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.rejected[0].reasons.join(' ')).toMatch(/assembly metadata/i);
  });

  it('never returns a partial form', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test',
      records: [eligibleRecord('a'), eligibleRecord('b')],
      metadata: { a: meta('a', 'RAT'), b: meta('b', 'RAT') },
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.ready).toBe(false);
    expect(r.form).toBeNull();
  });

  it('snapshots the configuration on every preparation', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records: [], metadata: {},
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC, now: 1000,
    });
    expect(r.configuration.assessmentSpecificationId).toBe(PILOT_ADMINISTRATION_V1.specificationId);
    expect(r.configuration.routerId).toBe('heuristic_v1');
    expect(r.configuration.calibrationVersion).toBeNull();
  });
});

describe('§3 field-test and operational stay separate in the real path', () => {
  it('operational administration is refused outright', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_operational',
      records: [{ ...eligibleRecord('o'), use: 'growth_operational' }],
      metadata: { o: meta('o', 'RAT') },
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.ready).toBe(false);
    expect(r.unmetConstraints.join(' ')).toMatch(/disabled/i);
  });

  it('an operational item cannot enter a field-test form', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test',
      records: [{ ...eligibleRecord('o'), use: 'growth_operational' }],
      metadata: { o: meta('o', 'RAT') },
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.rejected[0].reasons.join(' ')).toMatch(/field tests admit only/i);
  });

  it('an instructional item cannot enter a field-test form', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test',
      records: [{ ...eligibleRecord('p'), use: 'independent_practice' }],
      metadata: { p: meta('p', 'RAT') },
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.rejected[0].reasons.join(' ')).toMatch(/instructional/i);
  });
});

describe('§5 the assembler genuinely gates readiness', () => {
  /** Enough raw eligible items, but all in ONE domain. */
  const lopsided = Array.from({ length: 60 }, (_, i) => eligibleRecord(`x${i}`));
  const lopsidedMeta = Object.fromEntries(
    lopsided.map((r) => [r.itemId, meta(r.itemId, 'RAT')])
  ) as Record<string, GrowthItemMetadata>;

  it('plenty of eligible items but no blueprint coverage stays UNAVAILABLE', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records: lopsided, metadata: lopsidedMeta,
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.rejected).toEqual([]);          // all eligible
    expect(r.ready).toBe(false);              // and still not ready
    expect(r.unmetConstraints.join(' ')).toMatch(/Domain NUM/);
  });

  it('teacher wording stays non-technical while Admin gets the detail', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records: lopsided, metadata: lopsidedMeta,
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.teacherMessage).toBe(TEACHER_NOT_READY_MESSAGE);
    expect(r.teacherMessage).not.toMatch(/domain|blueprint|constraint/i);
    expect(r.adminBlockers.length).toBeGreaterThan(0);
  });

  it('assembles when the bank satisfies every domain minimum', () => {
    const records: GrowthItemRecord[] = [];
    const metadata: Record<string, GrowthItemMetadata> = {};
    for (const w of PILOT_ADMINISTRATION_V1.domainWeights) {
      for (let i = 0; i < 10; i++) {
        const id = `${w.domainId}-${i}`;
        records.push(eligibleRecord(id));
        metadata[id] = { ...meta(id, w.domainId), difficulty: 1 + (i % 10) };
      }
    }
    const r = prepareGrowthAdministration({
      context: 'growth_field_test', records, metadata,
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    expect(r.ready).toBe(true);
    expect(r.form!.length).toBeGreaterThanOrEqual(PILOT_ADMINISTRATION_V1.minimumLength);
    const domains = new Set(r.form!.map((i) => i.domainId));
    expect(domains.size).toBe(PILOT_ADMINISTRATION_V1.domainWeights.length);
  });

  it('summarises blockers by cause, not by item id', () => {
    const r = prepareGrowthAdministration({
      context: 'growth_field_test',
      records: [{ ...eligibleRecord('n'), completedReviews: ['curriculum_alignment'] }],
      metadata: { n: meta('n', 'RAT') },
      lookup, grade: 'class6', authorization: AUTHORIZED, spec: APPROVED_SPEC,
    });
    const s = summariseBlockers(r).join(' ');
    expect(s).not.toMatch(/\bn\b:/);
    expect(s).toMatch(/review/i);
  });
});

describe('§6 readiness is scoped — one strand does not advance another', () => {
  const fractions: GrowthScope = {
    moduleId: 'fractions', officialChapterId: 'ncert_gp_c6_ch07_fractions',
    requiredCompetencyIds: ['RAT.EQUIV', 'RAT.COMPARE'],
    frameworkVersion: 'v1', administrationSpecificationId: 'pilot',
  };
  const geometry: GrowthScope = {
    moduleId: 'geometry', officialChapterId: null,
    requiredCompetencyIds: ['GEO.1'],
    frameworkVersion: 'v1', administrationSpecificationId: 'pilot',
  };

  const fractionsEvidence: ScopedGrowthEvidence = {
    ...NO_SCOPED_EVIDENCE,
    frameworkApprovedForPilot: true,
    specificationsByCompetency: { 'RAT.EQUIV': 2, 'RAT.COMPARE': 1 },
    reviewedSpecificationsByCompetency: { 'RAT.EQUIV': 2, 'RAT.COMPARE': 1 },
    eligibleItemsByCompetency: { 'RAT.EQUIV': 6, 'RAT.COMPARE': 6 },
  };

  it('an advancing strand leaves an unrelated one untouched', () => {
    const [f, g] = evaluateGrowthReadinessByScope([
      { scope: fractions, evidence: fractionsEvidence },
      { scope: geometry },
    ]);
    expect(f.status).not.toBe('not_eligible');
    expect(g.status).toBe('not_eligible');
  });

  it('names the competency that blocks, not a count', () => {
    const r = evaluateScopedGrowthReadiness(fractions, {
      ...fractionsEvidence,
      specificationsByCompetency: { 'RAT.EQUIV': 5 }, // COMPARE uncovered
    });
    expect(r.status).toBe('not_eligible');
    expect(r.blockers.join(' ')).toMatch(/RAT\.COMPARE/);
    expect(r.competenciesWithoutSpecification).toEqual(['RAT.COMPARE']);
  });

  it('a large specification count does not substitute for coverage', () => {
    // The v0.56 rule `specificationCount > 0` would have passed this.
    const r = evaluateScopedGrowthReadiness(fractions, {
      ...NO_SCOPED_EVIDENCE, frameworkApprovedForPilot: true,
      specificationsByCompetency: { 'RAT.EQUIV': 99 },
    });
    expect(r.status).toBe('not_eligible');
  });

  it('assembler failure holds readiness below field_test_ready', () => {
    const r = evaluateScopedGrowthReadiness(fractions, {
      ...fractionsEvidence, assemblerSucceeded: false,
      assemblerUnmetConstraints: ['Domain GEO: requires at least 3 items.'],
    });
    expect(r.status).toBe('expert_reviewed');
    expect(r.blockers.join(' ')).toMatch(/Domain GEO/);
  });

  it('every scope is not_eligible with no evidence', () => {
    for (const s of evaluateGrowthReadinessByScope([{ scope: fractions }, { scope: geometry }])) {
      expect(s.status).toBe('not_eligible');
    }
  });

  it('an unapproved framework blocks regardless of coverage', () => {
    const r = evaluateScopedGrowthReadiness(fractions, {
      ...fractionsEvidence, frameworkApprovedForPilot: false,
    });
    expect(r.status).toBe('not_eligible');
    expect(r.blockers.join(' ')).toMatch(/framework has not been approved/i);
  });
});
