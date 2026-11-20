// v0.55 §20 — freeze candidate, decision matrix, evidence hierarchy.

import { describe, it, expect } from 'vitest';
import {
  FRAMEWORK_DECISIONS, decisionsMissingAssessmentEvidence,
  buildFreezeCandidate, currentFreezeCandidate,
} from '../frameworkFreezeCandidate';
import {
  claimTypeAuthority, resolveConflict, CLAIM_TYPE_HIERARCHY,
  type SourceRecord,
} from '../evidenceHierarchy';
import { PRODUCT_POSITIONING, FORBIDDEN_POSITIONING_TERMS } from '../../lib/productPositioning';
import type { DecisionReview } from '../../features/teacher/reviewAdjudication';

describe('§9 a freeze candidate cannot approve itself', () => {
  it('starts awaiting independent expert review', () => {
    const c = currentFreezeCandidate();
    expect(c.status).toBe('awaiting_independent_expert_review');
    expect(c.status).not.toBe('approved');
  });

  it('stays unapproved no matter how much evidence is attached', () => {
    const c = currentFreezeCandidate();
    expect(c.evidencePackage.length).toBeGreaterThan(4);
    expect(c.status).not.toBe('approved');
  });

  it('records what was NOT read as part of the evidence package', () => {
    const c = currentFreezeCandidate();
    const joined = c.evidencePackage.join(' ');
    // v0.61 §2 — PARAKH is still unread and must still be declared.
    expect(joined).toMatch(/NOT READ: PARAKH/);
    expect(joined).toMatch(/NOT LOCATED/);
    // But NCF-SE and the Ganita Prakash books HAVE been read, and the
    // package must no longer claim otherwise.
    expect(joined).not.toMatch(/NOT READ: NCF-SE 2023/);
    expect(joined).toMatch(/NCF-SE 2023 — READ DIRECTLY/);
    expect(joined).toMatch(/Ganita Prakash Grade 6 — READ DIRECTLY/);
  });

  it('one reviewer does not approve it', () => {
    const review: DecisionReview = {
      decisionId: FRAMEWORK_DECISIONS.filter((d) => d.humanReviewRequired)[0].construct,
      reviewerId: 'r1', reviewerName: 'A', perspective: 'practising_educator',
      position: 'approve', rationale: 'ok', frameworkVersion: 'v0.55-candidate',
      reviewDate: '2026-08-20',
    };
    const c = buildFreezeCandidate({
      reviews: [review], adjudications: [], candidateVersion: 'v0.55-candidate',
    });
    expect(c.status).not.toBe('approved');
    expect(c.status).toBe('under_review');
  });

  it('lists every unresolved decision', () => {
    const c = currentFreezeCandidate();
    expect(c.unresolvedDecisions.length).toBeGreaterThan(3);
    expect(c.unresolvedDecisions.join(' ')).toMatch(/Rational Number/);
  });

  it('carries only RESOLVED constructs as structure (v0.56 §3)', () => {
    const c = currentFreezeCandidate();
    // Probability is merged into Data, not a seventh domain.
    expect(c.resolvedContentDomains).not.toContain('PRB');
    // Deferred constructs must NOT appear as resolved structure.
    expect(c.resolvedContentDomains).not.toContain('RAT');
    expect(c.resolvedProcessTags).not.toContain('computational_thinking');
  });

  it('carries deferred constructs as OPEN decisions with options', () => {
    const c = currentFreezeCandidate();
    expect(c.openStructuralDecisions.length).toBe(2);
    const rat = c.openStructuralDecisions.find(
      (d) => d.decisionId === 'rational_number_placement'
    )!;
    expect(rat.options.length).toBeGreaterThanOrEqual(2);
    for (const o of rat.options) expect(o.risks.length).toBeGreaterThan(0);
    expect(rat.currentRecommendation).toMatch(/LOW confidence/);
    expect(rat.decisionRequired).toMatch(/\?$/);
  });

  it('every deferred matrix decision appears as an open decision', () => {
    const deferred = FRAMEWORK_DECISIONS.filter((d) => d.recommendedAction === 'defer')
      .map((d) => d.construct);
    const open = currentFreezeCandidate().openStructuralDecisions.map((d) => d.construct);
    for (const d of deferred) expect(open).toContain(d);
  });

  it('open decisions record which sources were NOT read', () => {
    for (const d of currentFreezeCandidate().openStructuralDecisions) {
      expect(d.evidence.join(' ')).toMatch(/NOT READ/);
    }
  });

  it('states that no domain is reportable regardless of blueprint share', () => {
    expect(currentFreezeCandidate().blueprintImplications.join(' '))
      .toMatch(/No domain is reportable as a subscore/i);
  });
});

describe('§6 the decision matrix is honest about missing evidence', () => {
  it('covers all eleven constructs', () => {
    expect(FRAMEWORK_DECISIONS.length).toBe(11);
  });

  it('every construct records PARAKH as not inspected', () => {
    // null means NOT INSPECTED — distinct from "inspected, said nothing".
    expect(decisionsMissingAssessmentEvidence().length).toBe(FRAMEWORK_DECISIONS.length);
    for (const d of FRAMEWORK_DECISIONS) expect(d.parakhEvidence).toBeNull();
  });

  // v0.61 §2 — this assertion used to read "every construct records
  // NCF-SE as not directly inspected", which was true when written.
  // NCF-SE has since been read directly. The guard is preserved by
  // inverting it: the matrix must record the evidence it ACTUALLY has,
  // and a null here would now be a stale claim rather than an honest
  // gap.
  it('every construct records the directly-inspected NCF-SE evidence', () => {
    for (const d of FRAMEWORK_DECISIONS) {
      expect(d.ncfSeEvidence).not.toBeNull();
      expect(d.ncfSeEvidence).toMatch(/MIDDLE \(direct/);
      // Every Middle-stage claim carries a stage-qualified citation or
      // says plainly that the competency is absent.
      expect(
        /MIDDLE:(CG|C)-\d/.test(d.ncfSeEvidence as string) ||
          /does not explicitly specify/.test(d.ncfSeEvidence as string)
      ).toBe(true);
    }
  });

  it('keeps the historical Secondary-stage reasoning traceable', () => {
    // Correcting the stage must not erase what was previously decided
    // or why — a reviewer needs to see the superseded reasoning.
    const withCbse = FRAMEWORK_DECISIONS.filter((d) => d.cbseEvidence !== null);
    expect(withCbse.length).toBeGreaterThan(0);
    for (const d of withCbse) {
      expect(d.stageReviewNote).toBeTruthy();
    }
  });

  it('constructs with weak evidence are deferred, not decided', () => {
    const rat = FRAMEWORK_DECISIONS.find((d) => d.domainId === 'RAT')!;
    expect(rat.recommendedAction).toBe('defer');
    expect(rat.confidence).toBe('low');
    expect(rat.humanReviewRequired).toBe(true);
  });

  it('CT cites the directly-inspected CT&AI curriculum and remains deferred', () => {
    const ct = FRAMEWORK_DECISIONS.find((d) => d.construct === 'Computational Thinking')!;
    expect(ct.strongestProvenance).toBe('directly_inspected_primary');
    expect(String(ct.otherOfficialEvidence)).toMatch(/cross-cutting theme/i);
    expect(ct.recommendedAction).toBe('defer');
  });

  it('merges are only recommended where evidence is strong', () => {
    for (const d of FRAMEWORK_DECISIONS.filter((x) => x.recommendedAction === 'merge')) {
      expect(d.confidence).toBe('high');
    }
  });

  it('every low-confidence decision requires human review', () => {
    for (const d of FRAMEWORK_DECISIONS.filter((x) => x.confidence === 'low')) {
      expect(d.humanReviewRequired).toBe(true);
    }
  });
});

describe('§4 evidence hierarchy is by claim type, not a universal ranking', () => {
  it('different claim types have different top sources', () => {
    expect(claimTypeAuthority('assessment_design')[0]).toBe('national_assessment_framework');
    expect(claimTypeAuthority('curricular_structure')[0]).toBe('national_framework');
    expect(claimTypeAuthority('chapter_placement')[0]).toBe('current_textbook');
  });

  it('a textbook outranks the framework for chapter placement', () => {
    const order = claimTypeAuthority('chapter_placement');
    expect(order.indexOf('current_textbook')).toBeLessThan(order.indexOf('national_framework'));
  });

  it('the framework outranks the textbook for curricular structure', () => {
    const order = claimTypeAuthority('curricular_structure');
    expect(order.indexOf('national_framework')).toBeLessThan(order.indexOf('current_textbook'));
  });

  it('resolves a conflict by claim type and records the loser', () => {
    const a: SourceRecord = {
      sourceType: 'current_textbook', frameworkGeneration: 'NCF-SE 2023',
      claim: 'Fractions is Chapter 7', directlyInspected: false,
    };
    const b: SourceRecord = {
      sourceType: 'older_learning_outcomes', frameworkGeneration: 'NCF 2005',
      claim: 'Fractions is Chapter 7 of the old book', directlyInspected: true,
    };
    const r = resolveConflict('chapter_placement', [a, b]);
    expect(r.winner.sourceType).toBe('current_textbook');
    expect(r.overruled.length).toBe(1);
    // v0.56 §5 — these two sources span framework generations on a
    // generation-sensitive claim, so ranking alone must NOT settle it.
    expect(r.conflictStatus).toBe('requires_generation_review');
  });

  it('flags a framework-generation mismatch rather than silently resolving it', () => {
    const a: SourceRecord = {
      sourceType: 'national_framework', frameworkGeneration: 'NCF-SE 2023',
      claim: 'x', directlyInspected: false,
    };
    const b: SourceRecord = {
      sourceType: 'older_learning_outcomes', frameworkGeneration: 'NCF 2005',
      claim: 'not x', directlyInspected: true,
    };
    const r = resolveConflict('curricular_structure', [a, b]);
    expect(r.generationMismatch).toBe(true);
    expect(r.note).toMatch(/different framework generations/i);
  });

  it('every claim type has a defined hierarchy', () => {
    for (const t of Object.keys(CLAIM_TYPE_HIERARCHY)) {
      expect(claimTypeAuthority(t as never).length).toBeGreaterThan(3);
    }
  });
});

describe('§18 product positioning makes no unsupported claim', () => {
  it('uses the cautious description', () => {
    // v0.56 §18 — must not imply the adaptive assessment already exists.
    expect(PRODUCT_POSITIONING.shortDescription)
      .toMatch(/under development/i);
    expect(PRODUCT_POSITIONING.shortDescription)
      .not.toMatch(/adaptive Mathematics.*platform/i);
    expect(PRODUCT_POSITIONING.longDescription)
      .toMatch(/mapped to recorded Indian curriculum sources/i);
    expect(PRODUCT_POSITIONING.longDescription)
      .not.toMatch(/aligned to Indian curriculum/i);
  });

  it('contains no forbidden psychometric claim', () => {
    const all = [
      PRODUCT_POSITIONING.shortDescription,
      PRODUCT_POSITIONING.longDescription,
      ...PRODUCT_POSITIONING.mayClaim,
    ].join(' ').toLowerCase();
    for (const term of FORBIDDEN_POSITIONING_TERMS) {
      // Word boundaries: "rit" must not match inside "written".
      const rx = new RegExp(`\\b${term.toLowerCase().replace(/ /g, '\\s+')}\\b`);
      expect(all).not.toMatch(rx);
    }
  });

  it('lists explicitly what may NOT be claimed', () => {
    const joined = PRODUCT_POSITIONING.mayNotClaim.join(' ').toLowerCase();
    expect(joined).toContain('norm');
    expect(joined).toContain('calibrated');
    expect(joined).toMatch(/map/);
  });
});
