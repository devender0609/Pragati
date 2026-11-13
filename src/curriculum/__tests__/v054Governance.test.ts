// v0.54 §20 — provenance, reportability, adjudication, readiness.

import { describe, it, expect } from 'vitest';
import {
  FRAMEWORK_CLAIMS, recommendation,
  mayAssertAboutSource, attributedClaim, overstatedClaims,
  CT_EVIDENCE_POSITION, CROSS_STAGE_CONTINUUM_CLAIM,
  PROVENANCE_STRENGTH,
} from '../evidenceProvenance';
import {
  asReportableSubscore, mayReportSubscore, reportModeFor,
  currentReportingState, NO_REPORTABILITY_EVIDENCE, type BlueprintDomain,
} from '../../features/assessment/reportableScales';
import {
  disagreementState, mayFreezeFramework, REQUIRED_PERSPECTIVES,
  GOVERNANCE_BASIS, CURRENT_REVIEWS, CURRENT_ADJUDICATIONS,
  type DecisionReview, type Adjudication,
} from '../../features/teacher/reviewAdjudication';
import { readinessForChapter, teacherReadinessSummary } from '../../features/teacher/ReadinessMatrix';
import { GOVERNANCE_TERMS } from '../readiness';

// ---- §1 CT and Rational Number remain provisional ----

describe('§1 recommendations are provisional, not settled', () => {
  it('CT is a provisional design recommendation', () => {
    const r = recommendation('ct_as_process_tag')!;
    expect(r.status).toBe('provisional_design_recommendation');
    expect(r.status).not.toBe('empirically_supported');
  });

  it('CT retains alternatives including a future indicator or instrument', () => {
    const r = recommendation('ct_as_process_tag')!;
    expect(r.alternativesRetained.join(' ')).toMatch(/indicator/i);
    expect(r.alternativesRetained.join(' ')).toMatch(/separate CT instrument/i);
    expect(r.pendingEvidence.join(' ')).toMatch(/PARAKH/);
  });

  it('does not claim selected-response items can never show CT evidence', () => {
    expect(CT_EVIDENCE_POSITION).toMatch(/can provide partial evidence/i);
    expect(CT_EVIDENCE_POSITION).toMatch(/only the second is refused/i);
  });

  it('Rational Number separation remains a hypothesis with the fold-in alternative open', () => {
    const r = recommendation('rational_number_separate_domain')!;
    expect(r.status).toBe('provisional_design_recommendation');
    expect(r.alternativesRetained.join(' ')).toMatch(/Fold into Number Sense/i);
  });
});

// ---- §3 cross-stage claim corrected ----

describe('§3 cross-stage claims do not exceed the evidence', () => {
  it('states Rational Number is the strongest CANDIDATE, not proven across stages', () => {
    expect(CROSS_STAGE_CONTINUUM_CLAIM).toMatch(/strongest candidate/i);
    expect(CROSS_STAGE_CONTINUUM_CLAIM).toMatch(/remains incomplete/i);
    expect(CROSS_STAGE_CONTINUUM_CLAIM).not.toMatch(/defensible continuity across all four stages/i);
  });
});

// ---- §4 provenance ----

describe('§4 direct claims require direct inspection', () => {
  it('a derivative-sourced claim cannot be asserted about the original', () => {
    const c = FRAMEWORK_CLAIMS.find((x) => x.reproducedFrom)!;
    expect(c.provenance).toBe('official_derivative');
    expect(mayAssertAboutSource(c)).toBe(false);
    expect(attributedClaim(c)).toMatch(/^Curriculum 2026-27.*\(CBSE/);
  });

  it('a directly inspected claim is asserted plainly', () => {
    const c = FRAMEWORK_CLAIMS.find(
      (x) => x.provenance === 'directly_inspected_primary'
    )!;
    expect(mayAssertAboutSource(c)).toBe(true);
    expect(attributedClaim(c)).toBe(c.claim);
  });

  it('no claim is overstated', () => {
    expect(overstatedClaims(FRAMEWORK_CLAIMS)).toEqual([]);
  });

  it('ranks direct inspection above official derivative above secondary', () => {
    expect(PROVENANCE_STRENGTH.directly_inspected_primary)
      .toBeGreaterThan(PROVENANCE_STRENGTH.official_derivative);
    expect(PROVENANCE_STRENGTH.official_derivative)
      .toBeGreaterThan(PROVENANCE_STRENGTH.secondary_corroboration);
    expect(PROVENANCE_STRENGTH.secondary_corroboration)
      .toBeGreaterThan(PROVENANCE_STRENGTH.mathematical_inference);
  });

  it('records that NCERT Learning Outcomes derive from NCF 2005, not NCF-SE 2023', () => {
    const c = FRAMEWORK_CLAIMS.find((x) => /NCF 2005/.test(x.claim))!;
    expect(c.provenance).toBe('directly_inspected_primary');
    expect(c.sourceOrganization).toBe('NCERT');
  });

  it('every claim carries a locator and a date', () => {
    for (const c of FRAMEWORK_CLAIMS) {
      expect(c.location.length).toBeGreaterThan(0);
      expect(c.dateInspected).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

// ---- §8 blueprint domain != reportable subscore ----

const domain: BlueprintDomain = {
  domainId: 'RAT', targetShare: 0.2, minItems: 5, maxItems: 10,
};

describe('§8 a blueprint domain does not become a scored subscale', () => {
  it('converting with no evidence yields an unreportable subscore', () => {
    const s = asReportableSubscore(domain);
    expect(s.approvedForReporting).toBe(false);
    expect(mayReportSubscore(s).allowed).toBe(false);
    expect(reportModeFor(s)).toBe('observed_counts_only');
  });

  it('lists every missing criterion rather than failing silently', () => {
    const missing = mayReportSubscore(asReportableSubscore(domain)).missing;
    expect(missing.join(' ')).toMatch(/precision/);
    expect(missing.join(' ')).toMatch(/dimensionality/);
    expect(missing.join(' ')).toMatch(/interpretability/);
  });

  it('full evidence WITHOUT a named approver is still not reportable', () => {
    const s = asReportableSubscore(domain, {
      sufficientInformation: true, precisionEstablished: true,
      dimensionalityEstablished: true, interpretabilityEstablished: true,
    });
    expect(s.approvedForReporting).toBe(false);
    expect(mayReportSubscore(s).allowed).toBe(false);
  });

  it('partial evidence never yields a scored subscore', () => {
    const s = asReportableSubscore(domain, {
      ...NO_REPORTABILITY_EVIDENCE, sufficientInformation: true,
    }, 'someone');
    expect(reportModeFor(s)).toBe('observed_counts_only');
  });

  it('every blueprint domain currently reports observed counts only', () => {
    const domains: BlueprintDomain[] = (['NUM','RAT','ALG','GEO','MEA','DAT'] as const)
      .map((d) => ({ domainId: d, targetShare: 1/6, minItems: 3, maxItems: 8 }));
    for (const s of currentReportingState(domains)) {
      expect(s.mode).toBe('observed_counts_only');
    }
  });
});

// ---- §9/§10 adjudication ----

const review = (over: Partial<DecisionReview>): DecisionReview => ({
  decisionId: 'd1', reviewerId: 'r1', reviewerName: 'A',
  perspective: 'practising_educator', position: 'approve',
  rationale: 'ok', frameworkVersion: 'v1', reviewDate: '2026-08-19', ...over,
});

describe('§9 disagreement triggers adjudication and never becomes approval', () => {
  it('one reviewer is not enough', () => {
    expect(disagreementState([review({})], [], 'd1')).toBe('awaiting_second_review');
  });

  it('two agreeing reviewers agree', () => {
    expect(disagreementState(
      [review({}), review({ reviewerId: 'r2', perspective: 'curriculum_specialist' })],
      [], 'd1'
    )).toBe('agreed');
  });

  it('differing positions are a disagreement pending adjudication', () => {
    expect(disagreementState(
      [review({}), review({ reviewerId: 'r2', position: 'revise' })], [], 'd1'
    )).toBe('disagreement_pending_adjudication');
  });

  it('"approve" and "approve_with_changes" are NOT treated as agreement', () => {
    expect(disagreementState(
      [review({}), review({ reviewerId: 'r2', position: 'approve_with_changes' })],
      [], 'd1'
    )).toBe('disagreement_pending_adjudication');
  });

  it('an unresolved disagreement blocks freezing', () => {
    const r = mayFreezeFramework({
      decisionIds: ['d1'],
      reviews: [review({}), review({ reviewerId: 'r2', position: 'reject', perspective: 'curriculum_specialist' })],
      adjudications: [], frameworkVersion: 'v1',
    });
    expect(r.allowed).toBe(false);
    expect(r.blockers.join(' ')).toMatch(/must go to adjudication/);
  });

  it('adjudication resolves the state', () => {
    const adj: Adjudication = {
      decisionId: 'd1', reviewer1Position: 'approve', reviewer1Rationale: 'x',
      reviewer2Position: 'revise', reviewer2Rationale: 'y',
      evidenceConsidered: ['CBSE CT curriculum'], adjudicatorName: 'Z',
      adjudicatorPerspective: 'curriculum_specialist', finalDecision: 'approve_with_changes',
      rationale: 'r', frameworkVersionAffected: 'v1', adjudicationDate: '2026-08-20',
    };
    expect(disagreementState(
      [review({}), review({ reviewerId: 'r2', position: 'revise' })], [adj], 'd1'
    )).toBe('adjudicated');
  });

  it('freezing requires both required perspectives', () => {
    const r = mayFreezeFramework({
      decisionIds: ['d1'],
      reviews: [review({}), review({ reviewerId: 'r2' })],
      adjudications: [], frameworkVersion: 'v1',
    });
    expect(r.allowed).toBe(false);
    expect(r.blockers.join(' ')).toMatch(/curriculum \/ teacher-education/i);
  });

  it('the framework cannot be frozen today — no reviews exist', () => {
    const r = mayFreezeFramework({
      decisionIds: ['ct_as_process_tag'],
      reviews: CURRENT_REVIEWS, adjudications: CURRENT_ADJUDICATIONS,
      frameworkVersion: 'v1',
    });
    expect(r.allowed).toBe(false);
    expect(CURRENT_REVIEWS).toEqual([]);
  });

  it('two-reviewer governance is stated as internal, not regulatory', () => {
    expect(GOVERNANCE_BASIS).toMatch(/internal governance standard/i);
    expect(GOVERNANCE_BASIS).toMatch(/not presented as an external regulatory requirement/i);
    expect(REQUIRED_PERSPECTIVES.length).toBe(2);
  });
});

// ---- §12 readiness ----

describe('§12 readiness uses one canonical model', () => {
  it('derives four independent axes for a real chapter', () => {
    const p = readinessForChapter('official:ncert_gp_c6_ch07_fractions');
    // v0.61 §9 — the Ganita Prakash primary source was retrieved and its
    // Contents page read, so Class 6 chapters are no longer
    // secondary-only. The axis moved because the EVIDENCE moved.
    expect(p.curriculum).toBe('primary_source_verified');
    expect(p.practice).toBe('usable');
    // Growth is NOT inferred from having items or a blueprint.
    expect(p.growth).toBe('not_eligible');
  });

  it('an unknown chapter falls back to the honest floor', () => {
    const p = readinessForChapter('official:nope');
    expect(p.curriculum).toBe('unverified');
    expect(p.growth).toBe('not_eligible');
  });

  it('the teacher summary carries no governance jargon', () => {
    const s = teacherReadinessSummary(
      readinessForChapter('official:ncert_gp_c6_ch07_fractions')
    ).toLowerCase();
    for (const term of GOVERNANCE_TERMS) {
      expect(s).not.toContain(term.toLowerCase());
    }
  });

  it('the teacher summary never mentions Growth readiness', () => {
    const s = teacherReadinessSummary({
      curriculum: 'primary_source_verified', instruction: 'published',
      practice: 'published', growth: 'operational',
    });
    expect(s.toLowerCase()).not.toContain('growth');
  });
});
