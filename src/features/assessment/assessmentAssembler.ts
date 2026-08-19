// v0.52 §4 + §5 — Assessment assembly.
//
// WHAT WAS WRONG
//
// v0.51's `buildGrowthPool` ended in `secure.slice(0, targetLength)`.
// That takes the first N eligible items in array order. It satisfies no
// domain weighting, no competency coverage, no difficulty spread, and
// no format constraint — so the resulting "test" measures whatever the
// bank happened to list first.
//
// THE RULE THAT MATTERS
//
// The assembler NEVER silently relaxes a constraint. If the bank cannot
// satisfy the blueprint, it returns a failure describing exactly which
// constraint failed and by how much. A short test that quietly dropped
// the Geometry requirement is worse than no test, because nothing
// downstream knows the claim changed.

import type { AssessmentDomainId } from '../../curriculum/competencyFramework';
import type { CognitiveDemand, ItemFormat } from './itemSpecification';
import type { Grade } from '../../types';

// ---------------------------------------------------------------------------
// §5 — Versioned administration specification
// ---------------------------------------------------------------------------

/** How much empirical support a configuration has. */
export type EvidenceStatus =
  /** A reasoned proposal. NOT validated. Current state of everything. */
  | 'research_hypothesis'
  /** Supported by a pilot but not a full field test. */
  | 'pilot_informed'
  /** Supported by analysed field-test data. */
  | 'field_test_supported'
  /** Supported by a completed validation study. */
  | 'validated';

export type DomainWeight = {
  domainId: AssessmentDomainId;
  /** Proportion of the test, 0-1. */
  targetShare: number;
  /** Hard bounds on item count. The assembler will not go outside. */
  minItems: number;
  maxItems: number;
};

/**
 * A versioned, configurable administration design.
 *
 * v0.51 hardcoded `PILOT_TEST_LENGTH = 35`. Thirty-five was a reasoned
 * proposal, but a constant in a component reads as a product rule. It
 * is now data, versioned, and stamped `research_hypothesis`.
 */
export type PilotAdministrationSpecification = {
  specificationId: string;
  version: string;
  intendedGrades: Grade[];
  targetLength: number;
  minimumLength: number;
  maximumLength: number;
  expectedDurationMinutes: number;
  domainWeights: DomainWeight[];
  allowedFormats: ItemFormat[];
  /** Rough share per cognitive demand. Advisory: reported in coverage,
   *  not enforced as a hard constraint, because the bank is too small
   *  for it to be meaningful yet. */
  cognitiveDemandTargets: Partial<Record<CognitiveDemand, number>>;
  difficultyTarget: { min: number; max: number; meanTarget: number };
  /** Max times one item may appear across administrations in a window. */
  maxExposurePerWindow: number;
  status: 'draft' | 'active_pilot' | 'superseded';
  evidenceStatus: EvidenceStatus;
  rationale: string;
  supersededBy: string | null;
};

/**
 * The current pilot design.
 *
 * Every number here is a hypothesis to be tested, not a finding. The
 * `evidenceStatus` field says so, and tests assert it.
 */
export const PILOT_ADMINISTRATION_V1: PilotAdministrationSpecification = {
  specificationId: 'pragati.growth.math.pilot',
  version: 'v1',
  intendedGrades: ['class5', 'class6', 'class7', 'class8'],
  targetLength: 35,
  minimumLength: 24,
  maximumLength: 45,
  expectedDurationMinutes: 42,
  domainWeights: [
    { domainId: 'NUM', targetShare: 0.20, minItems: 5, maxItems: 10 },
    { domainId: 'RAT', targetShare: 0.20, minItems: 5, maxItems: 10 },
    { domainId: 'ALG', targetShare: 0.15, minItems: 3, maxItems: 8 },
    { domainId: 'GEO', targetShare: 0.15, minItems: 3, maxItems: 8 },
    { domainId: 'MEA', targetShare: 0.10, minItems: 2, maxItems: 6 },
    { domainId: 'DAT', targetShare: 0.10, minItems: 2, maxItems: 6 },
    { domainId: 'PAT', targetShare: 0.05, minItems: 1, maxItems: 4 },
    { domainId: 'PRB', targetShare: 0.05, minItems: 1, maxItems: 4 },
  ],
  allowedFormats: ['single_select', 'numeric_entry', 'fraction_entry'],
  cognitiveDemandTargets: {
    procedural_fluency: 0.3,
    conceptual_understanding: 0.35,
    application: 0.2,
    reasoning: 0.15,
  },
  difficultyTarget: { min: 1, max: 10, meanTarget: 5 },
  maxExposurePerWindow: 3,
  status: 'draft',
  evidenceStatus: 'research_hypothesis',
  rationale:
    'Length chosen so that 4-5 reported domain groups receive roughly 7-9 items each while staying inside one 40-minute period. Domain shares follow the draft blueprint in docs/PRAGATI_GROWTH_ASSESSMENT_SPEC.md. NONE of these values is empirically supported; the field test exists partly to determine them.',
  supersededBy: null,
};

/** Domain weights must describe a whole test. Asserted in tests. */
export function validateAdministrationSpec(
  spec: PilotAdministrationSpecification
): string[] {
  const e: string[] = [];
  const share = spec.domainWeights.reduce((a, d) => a + d.targetShare, 0);
  if (Math.abs(share - 1) > 0.001) {
    e.push(`domain target shares sum to ${share.toFixed(3)}, not 1`);
  }
  if (spec.minimumLength > spec.targetLength) e.push('minimumLength exceeds targetLength');
  if (spec.targetLength > spec.maximumLength) e.push('targetLength exceeds maximumLength');
  const minSum = spec.domainWeights.reduce((a, d) => a + d.minItems, 0);
  if (minSum > spec.targetLength) {
    e.push(`domain minimums sum to ${minSum}, which exceeds targetLength ${spec.targetLength}`);
  }
  if (spec.evidenceStatus === 'validated') {
    e.push('evidenceStatus cannot be "validated": no validation study has been run');
  }
  return e;
}

// ---------------------------------------------------------------------------
// §4 — The assembler
// ---------------------------------------------------------------------------

/** What the assembler needs to know about a candidate item. Kept
 *  independent of the Item type so assembly is testable in isolation. */
export type AssemblyCandidate = {
  itemId: string;
  domainId: AssessmentDomainId;
  competencyId: string;
  format: ItemFormat;
  cognitiveDemand: CognitiveDemand;
  difficulty: number;
  gradeRange: { from: Grade; to: Grade };
  language: string;
  /** Items that must not appear together — same stem, or one reveals
   *  the other's answer. */
  enemyItemIds: string[];
  exposureCount: number;
};

export type DomainCoverage = {
  domainId: AssessmentDomainId;
  targetItems: number;
  assembledItems: number;
  minItems: number;
  satisfied: boolean;
};

export type AssemblyRequest = {
  spec: PilotAdministrationSpecification;
  candidates: AssemblyCandidate[];
  grade: Grade;
  language: string;
  /** Competencies the form must touch. Empty = no explicit requirement. */
  requiredCompetencyIds?: string[];
};

export type AssemblyResult =
  | {
      ok: true;
      items: AssemblyCandidate[];
      coverage: DomainCoverage[];
      competenciesCovered: string[];
      meanDifficulty: number;
      notes: string[];
    }
  | {
      ok: false;
      /** Which constraints could not be met, and by how much. */
      unmetConstraints: string[];
      coverage: DomainCoverage[];
      reason: string;
    };

const gradeNum = (g: Grade) => Number(g.replace('class', ''));

function eligibleForGrade(c: AssemblyCandidate, grade: Grade): boolean {
  const n = gradeNum(grade);
  return n >= gradeNum(c.gradeRange.from) && n <= gradeNum(c.gradeRange.to);
}

/**
 * Assemble a form against the blueprint.
 *
 * Strategy: satisfy every domain minimum first, then fill toward each
 * domain's target share, then top up to targetLength from whatever
 * remains within domain maxima. Within a domain, items are chosen to
 * spread difficulty rather than clustering.
 *
 * FAILS rather than relaxing. There is no partial success mode.
 */
export function assembleAssessment(req: AssemblyRequest): AssemblyResult {
  const { spec, candidates, grade, language, requiredCompetencyIds = [] } = req;

  // --- filter to what is legitimately usable -------------------------
  const usable = candidates.filter(
    (c) =>
      eligibleForGrade(c, grade) &&
      c.language === language &&
      spec.allowedFormats.includes(c.format) &&
      c.exposureCount < spec.maxExposurePerWindow
  );

  const byDomain = new Map<AssessmentDomainId, AssemblyCandidate[]>();
  for (const w of spec.domainWeights) byDomain.set(w.domainId, []);
  for (const c of usable) {
    const bucket = byDomain.get(c.domainId);
    if (bucket) bucket.push(c);
  }
  // Spread difficulty within each domain.
  for (const [, bucket] of byDomain) {
    bucket.sort((a, b) => a.difficulty - b.difficulty);
  }

  const coverage: DomainCoverage[] = spec.domainWeights.map((w) => ({
    domainId: w.domainId,
    targetItems: Math.round(w.targetShare * spec.targetLength),
    assembledItems: 0,
    minItems: w.minItems,
    satisfied: false,
  }));

  const unmet: string[] = [];
  const chosen: AssemblyCandidate[] = [];
  const chosenIds = new Set<string>();
  const blockedByEnemy = new Set<string>();

  const take = (c: AssemblyCandidate): boolean => {
    if (chosenIds.has(c.itemId) || blockedByEnemy.has(c.itemId)) return false;
    chosen.push(c);
    chosenIds.add(c.itemId);
    for (const enemy of c.enemyItemIds) blockedByEnemy.add(enemy);
    const cov = coverage.find((x) => x.domainId === c.domainId);
    if (cov) cov.assembledItems += 1;
    return true;
  };

  // Pass 1 — domain minimums. Non-negotiable.
  for (const w of spec.domainWeights) {
    const bucket = byDomain.get(w.domainId) ?? [];
    // Even spread across the difficulty-sorted bucket.
    const step = Math.max(1, Math.floor(bucket.length / Math.max(1, w.minItems)));
    let taken = 0;
    for (let i = 0; i < bucket.length && taken < w.minItems; i += step) {
      if (take(bucket[i])) taken += 1;
    }
    for (const c of bucket) {
      if (taken >= w.minItems) break;
      if (take(c)) taken += 1;
    }
    if (taken < w.minItems) {
      unmet.push(
        `Domain ${w.domainId}: blueprint requires at least ${w.minItems} items, only ${taken} eligible items available.`
      );
    }
  }

  // Pass 2 — toward each domain's target share, respecting maxima.
  for (const w of spec.domainWeights) {
    const cov = coverage.find((x) => x.domainId === w.domainId)!;
    const want = Math.min(cov.targetItems, w.maxItems);
    const bucket = byDomain.get(w.domainId) ?? [];
    for (const c of bucket) {
      if (cov.assembledItems >= want) break;
      take(c);
    }
  }

  // Pass 3 — top up to targetLength within domain maxima.
  if (chosen.length < spec.targetLength) {
    for (const w of spec.domainWeights) {
      const cov = coverage.find((x) => x.domainId === w.domainId)!;
      const bucket = byDomain.get(w.domainId) ?? [];
      for (const c of bucket) {
        if (chosen.length >= spec.targetLength) break;
        if (cov.assembledItems >= w.maxItems) break;
        take(c);
      }
      if (chosen.length >= spec.targetLength) break;
    }
  }

  for (const cov of coverage) {
    cov.satisfied = cov.assembledItems >= cov.minItems;
  }

  // --- constraint checks ---------------------------------------------

  if (chosen.length < spec.minimumLength) {
    unmet.push(
      `Form length ${chosen.length} is below the minimum of ${spec.minimumLength}.`
    );
  }

  const covered = new Set(chosen.map((c) => c.competencyId));
  const missingCompetencies = requiredCompetencyIds.filter((id) => !covered.has(id));
  if (missingCompetencies.length > 0) {
    unmet.push(
      `Required competencies not covered: ${missingCompetencies.join(', ')}.`
    );
  }

  if (unmet.length > 0) {
    return {
      ok: false,
      unmetConstraints: unmet,
      coverage,
      reason:
        'The item bank cannot satisfy this blueprint. The assessment was NOT assembled — constraints are never relaxed to produce a form.',
    };
  }

  const meanDifficulty =
    chosen.reduce((a, c) => a + c.difficulty, 0) / (chosen.length || 1);

  const notes: string[] = [];
  if (Math.abs(meanDifficulty - spec.difficultyTarget.meanTarget) > 1.5) {
    // Advisory, not a failure: author-assigned difficulties are not
    // empirical, so a mean that drifts is weak evidence at best.
    notes.push(
      `Mean author-assigned difficulty ${meanDifficulty.toFixed(2)} differs from the target ${spec.difficultyTarget.meanTarget}. Author difficulties are not empirical, so treat this as advisory.`
    );
  }
  if (chosen.length < spec.targetLength) {
    notes.push(
      `Assembled ${chosen.length} items against a target of ${spec.targetLength}, within the permitted minimum of ${spec.minimumLength}.`
    );
  }

  return {
    ok: true,
    items: chosen,
    coverage,
    competenciesCovered: [...covered],
    meanDifficulty,
    notes,
  };
}
