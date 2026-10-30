// v0.61 §3 / §20 / §21 — the framework decision matrix must end
// internally consistent, and stage review must be a real gate.

import { describe, it, expect } from 'vitest';
import {
  FRAMEWORK_DECISIONS,
  OPEN_STRUCTURAL_DECISIONS,
  currentFreezeCandidate,
  middleStageFreezeBlockers,
  mayFreezeMiddleStagePilot,
} from '../frameworkFreezeCandidate';
import type { DecisionReview } from '../../features/teacher/reviewAdjudication';

// ---------------------------------------------------------------------------
// §20 — no stale "NCF-SE unread" claim survives
// ---------------------------------------------------------------------------

describe('§20 the matrix reflects the evidence actually held', () => {
  it('records NCF-SE evidence on every construct', () => {
    for (const d of FRAMEWORK_DECISIONS) {
      expect(d.ncfSeEvidence).not.toBeNull();
      expect(d.ncfSeEvidence).not.toBe('no_statement_found');
    }
  });

  it('has no open structural decision claiming NCF-SE was not read', () => {
    for (const o of OPEN_STRUCTURAL_DECISIONS) {
      const joined = o.evidence.join(' ');
      expect(joined).not.toMatch(/NCF-SE[^.]*NOT READ/i);
      expect(joined).not.toMatch(/NOT READ:\s*NCF-SE/i);
    }
  });

  it('still declares PARAKH as unread', () => {
    // Correcting one stale claim must not quietly clear the others.
    const joined = currentFreezeCandidate().evidencePackage.join(' ');
    expect(joined).toMatch(/NOT READ: PARAKH/);
  });

  it('cites Middle Stage claims with stage-qualified IDs', () => {
    for (const d of FRAMEWORK_DECISIONS) {
      const ev = d.ncfSeEvidence as string;
      const qualified = /MIDDLE:(CG|C)-\d/.test(ev);
      const absent = /does not explicitly specify/.test(ev);
      expect(
        qualified || absent,
        `${d.construct} cites Middle Stage without a stage-qualified ID`
      ).toBe(true);
      // Every CG reference must carry its stage — either as a
      // structured ID (`MIDDLE:CG-1`) or in prose (`Secondary CG-4`).
      // A bare `CG-6` resolves to different goals at the two stages.
      const bare = ev.match(/(?:^|[^:A-Za-z])CG-\d+/g) ?? [];
      for (const hit of bare) {
        const idx = ev.indexOf(hit);
        const before = ev.slice(Math.max(0, idx - 12), idx + hit.length);
        expect(
          /MIDDLE|Secondary/i.test(before),
          `${d.construct} has an unqualified "${hit.trim()}"`
        ).toBe(true);
      }
    }
  });

  it('keeps the superseded Secondary-stage reasoning traceable', () => {
    const withHistory = FRAMEWORK_DECISIONS.filter(
      (d) => d.cbseEvidence !== null
    );
    expect(withHistory.length).toBeGreaterThan(0);
    for (const d of withHistory) {
      // Old evidence retained AND the reason it is now under review.
      expect(d.cbseEvidence).toBeTruthy();
      expect(d.stageReviewNote).toBeTruthy();
    }
  });

  it('states the probability finding precisely', () => {
    const prob = FRAMEWORK_DECISIONS.find((d) => d.construct === 'Probability');
    const ev = prob!.ncfSeEvidence as string;
    // Scoped to the CG block and the inspected textbooks.
    expect(ev).toMatch(/MIDDLE:CG-1\.\.MIDDLE:CG-10 block|CG-1 to CG-10/);
    // NOT a claim about Middle Stage education in general.
    expect(ev).toMatch(/NOT a claim that probability is absent/i);
  });
});

// ---------------------------------------------------------------------------
// §3 — stage review is a real freeze gate
// ---------------------------------------------------------------------------

describe('§3 unresolved stage review blocks a Middle Stage freeze', () => {
  it('reports every unresolved construct as a blocker', () => {
    const blockers = middleStageFreezeBlockers();
    expect(blockers.length).toBe(FRAMEWORK_DECISIONS.length);
  });

  it('refuses to freeze while any construct requires stage review', () => {
    const result = mayFreezeMiddleStagePilot({
      reviews: [],
      adjudications: [],
    });
    expect(result.allowed).toBe(false);
    if (result.allowed) throw new Error('unreachable');
    expect(result.blockers.join(' ')).toMatch(/require stage review/);
  });

  it('cannot be unblocked by accumulating reviewer approvals', () => {
    // The ordering matters: stage review is checked BEFORE reviews, so
    // approvals cannot mask an unresolved stage problem.
    const reviews: DecisionReview[] = FRAMEWORK_DECISIONS.map((d, i) => ({
      decisionId: d.construct,
      reviewerId: `r${i}`,
      reviewerName: `Reviewer ${i}`,
      perspective: 'practising_educator',
      position: 'approve',
      rationale: 'looks fine',
      frameworkVersion: 'middle-stage-pilot-candidate',
      reviewDate: '2026-08-24',
    }));
    const result = mayFreezeMiddleStagePilot({ reviews, adjudications: [] });
    expect(result.allowed).toBe(false);
  });

  it('never lets a stage-review construct claim no human review is needed', () => {
    // Derived, not declared. Four rows previously carried
    // `humanReviewRequired: false` on Secondary-stage evidence.
    for (const d of FRAMEWORK_DECISIONS) {
      if (d.stageReview === 'requires_stage_review') {
        expect(
          d.humanReviewRequired,
          `${d.construct} requires stage review but claims no human review`
        ).toBe(true);
      }
    }
  });

  it('leaves the framework unfrozen', () => {
    const c = currentFreezeCandidate();
    expect(c.status).not.toBe('approved');
  });
});
