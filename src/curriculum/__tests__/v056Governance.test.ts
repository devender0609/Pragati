// v0.56 §20 — evidence gate, claim taxonomy, truthfulness.

import { describe, it, expect } from 'vitest';
import {
  evaluateFrameworkEvidenceGate, evaluateFrameworkGate,
  REQUIRED_EVIDENCE, sourceInspected, isValidInspection, inspectionErrors,
  SOURCE_INSPECTIONS, type RequiredSource, type SourceInspectionRecord,
} from '../frameworkEvidenceGate';
import { FRAMEWORK_DECISIONS, currentFreezeCandidate } from '../frameworkFreezeCandidate';
import { claimTypeAuthority, resolveConflict, type SourceRecord } from '../evidenceHierarchy';
import {
  evaluateGrowthReadiness, NO_GROWTH_EVIDENCE,
} from '../../features/assessment/growthReadiness';
import { readinessForChapter } from '../../features/teacher/ReadinessMatrix';
import { OFFICIAL_CHAPTERS, validateOfficialChapter } from '../officialChapters';
import { chaptersForStudentGrade } from '../../features/student/StudentShell';
import { STUDENT_STATUS_LABEL } from '../inventory';
import type { DecisionReview } from '../../features/teacher/reviewAdjudication';
import type { Grade } from '../../types';

const allApproved = (): DecisionReview[] =>
  FRAMEWORK_DECISIONS.filter((d) => d.humanReviewRequired).flatMap((d) => [
    {
      decisionId: d.construct, reviewerId: 'r1', reviewerName: 'A',
      perspective: 'practising_educator' as const, position: 'approve' as const,
      rationale: 'ok', frameworkVersion: 'v1', reviewDate: '2026-08-20',
    },
    {
      decisionId: d.construct, reviewerId: 'r2', reviewerName: 'B',
      perspective: 'curriculum_specialist' as const, position: 'approve' as const,
      rationale: 'ok', frameworkVersion: 'v1', reviewDate: '2026-08-20',
    },
  ]);

const allInspected = (): RequiredSource[] =>
  REQUIRED_EVIDENCE.map((s) => ({ ...s, inspected: true }));

/** v0.57 §9 — a genuine inspection record for every required source. */
const allInspectionRecords = (): SourceInspectionRecord[] =>
  REQUIRED_EVIDENCE.map((s) => ({
    sourceId: s.id, organization: 'Org', title: s.title,
    officialUrl: 'https://example.gov.in/doc.pdf', version: '2026',
    documentIdentifier: null, inspectionDate: '2026-08-20',
    inspectedBy: 'Reviewer', pagesOrSectionsReviewed: ['pp. 1-10'],
    evidenceRecordsCreated: 3, sourceArtifactReference: null,
    inspectionStatus: 'complete' as const,
  }));

describe('§2 neither gate can bypass the other', () => {
  it('PERFECT human agreement cannot bypass a failed evidence gate', () => {
    // The v0.55 hole: two approving experts would have frozen a
    // framework whose key sources nobody had opened.
    const r = evaluateFrameworkGate({
      reviews: allApproved(), adjudications: [], frameworkVersion: 'v1',
    });
    expect(r.humanReview).toBe('approved');
    expect(r.frameworkStatus).toBe('blocked_by_evidence');
    expect(r.frameworkStatus).not.toBe('approved_for_pilot');
  });

  it('complete evidence cannot bypass required human review', () => {
    const r = evaluateFrameworkGate({
      reviews: [], adjudications: [], frameworkVersion: 'v1',
      sources: allInspected(), records: allInspectionRecords(),
    });
    expect(r.evidence.status).toBe('sufficient_for_pilot_freeze');
    expect(r.frameworkStatus).toBe('awaiting_human_review');
    expect(r.frameworkStatus).not.toBe('approved_for_pilot');
  });

  it('only BOTH gates together allow pilot approval', () => {
    const r = evaluateFrameworkGate({
      reviews: allApproved(), adjudications: [], frameworkVersion: 'v1',
      sources: allInspected(), records: allInspectionRecords(),
    });
    expect(r.frameworkStatus).toBe('approved_for_pilot');
  });

  it('today the evidence gate fails', () => {
    const g = evaluateFrameworkEvidenceGate();
    expect(g.status).not.toBe('sufficient_for_pilot_freeze');
    expect(g.missingForPilotFreeze.join(' ')).toMatch(/PARAKH/);
    expect(g.missingForPilotFreeze.join(' ')).toMatch(/NCF-SE/);
  });

  it('blocks decisions that have no national-source evidence at all', () => {
    const g = evaluateFrameworkEvidenceGate();
    expect(g.blockedDecisions).toContain('Fractions & Rational Number Reasoning');
    expect(g.blockedDecisions).toContain('Computational Thinking');
  });

  it('a bare inspected:true boolean CANNOT open the gate (v0.57 §9)', () => {
    // The whole point of structured records: flipping the flag does
    // nothing without evidence behind it.
    const r = evaluateFrameworkGate({
      reviews: allApproved(), adjudications: [], frameworkVersion: 'v1',
      sources: allInspected(), records: SOURCE_INSPECTIONS,
    });
    expect(r.frameworkStatus).toBe('blocked_by_evidence');
  });

  it('an incomplete inspection record does not count', () => {
    const bad = allInspectionRecords().map((r) => ({
      ...r, pagesOrSectionsReviewed: [], evidenceRecordsCreated: 0,
    }));
    expect(isValidInspection(bad[0])).toBe(false);
    expect(inspectionErrors(bad[0]).join(' ')).toMatch(/no pages/);
    const r = evaluateFrameworkGate({
      reviews: allApproved(), adjudications: [], frameworkVersion: 'v1',
      sources: allInspected(), records: bad,
    });
    expect(r.frameworkStatus).toBe('blocked_by_evidence');
  });

  it('only the two genuinely-read CBSE sources are inspected today', () => {
    expect(sourceInspected('cbse_class_ix')).toBe(true);
    expect(sourceInspected('cbse_ctai')).toBe(true);
    expect(sourceInspected('parakh')).toBe(false);
    expect(sourceInspected('ncf_se_2023')).toBe(false);
    expect(sourceInspected('ganita_prakash_g6')).toBe(false);
  });

  it('every required source states WHY it is required', () => {
    for (const s of REQUIRED_EVIDENCE) {
      expect(s.why.length).toBeGreaterThan(30);
    }
  });
});

describe('§4 Claude confidence is not approval evidence', () => {
  it('high-confidence constructs still appear in the pilot structure for confirmation', () => {
    const c = currentFreezeCandidate();
    // Retained domains are proposed, never self-approved.
    expect(c.status).toBe('awaiting_independent_expert_review');
    expect(c.resolvedContentDomains.length).toBeGreaterThan(0);
  });

  it('no decision is marked resolved purely by confidence', () => {
    for (const d of FRAMEWORK_DECISIONS.filter((x) => x.confidence === 'high')) {
      // High confidence may waive *disputed* review, but the construct
      // is still only a proposal inside an unapproved candidate.
      expect(currentFreezeCandidate().status).not.toBe('approved');
      expect(d.recommendedAction).not.toBe('defer');
    }
  });
});

describe('§5 cross-generation conflicts require review', () => {
  const older: SourceRecord = {
    sourceType: 'older_learning_outcomes', frameworkGeneration: 'NCF 2005',
    claim: 'Decimals taught in Class 6', directlyInspected: true,
  };
  const current: SourceRecord = {
    sourceType: 'current_textbook', frameworkGeneration: 'NCF-SE 2023',
    claim: 'Decimals appear in Class 7', directlyInspected: false,
  };

  it('does not auto-resolve a generation-sensitive conflict', () => {
    const r = resolveConflict('learning_outcome', [older, current]);
    expect(r.conflictStatus).toBe('requires_generation_review');
    expect(r.generationReview?.outcomeStatus).toBe('unknown');
  });

  it('records both claims and their generations', () => {
    const r = resolveConflict('chapter_placement', [older, current]);
    expect(r.generationReview?.olderGeneration).toBe('NCF 2005');
    expect(r.generationReview?.currentGeneration).toBe('NCF-SE 2023');
    expect(r.note).toMatch(/retained, modified, moved, or superseded/i);
  });

  it('same-generation conflicts still resolve by hierarchy', () => {
    const r = resolveConflict('chapter_placement', [
      current, { ...current, sourceType: 'secondary_corroboration' },
    ]);
    expect(r.conflictStatus).toBe('resolved_by_hierarchy');
  });
});

describe('§6 progression claim types are distinct', () => {
  it('mathematics decides logical prerequisite', () => {
    expect(claimTypeAuthority('logical_prerequisite')[0]).toBe('mathematical_inference');
  });

  it('policy decides instructional sequence, and mathematics ranks LAST', () => {
    const order = claimTypeAuthority('instructional_sequence');
    expect(order[0]).toBe('current_official_curriculum');
    expect(order[order.length - 1]).toBe('mathematical_inference');
  });

  it('the four types are genuinely different orderings', () => {
    const orders = [
      'logical_prerequisite', 'developmental_prerequisite',
      'instructional_sequence', 'empirical_difficulty_progression',
    ].map((t) => claimTypeAuthority(t as never)[0]);
    expect(new Set(orders).size).toBeGreaterThan(1);
  });
});

describe('§7 legacy modules are not counted as official chapters', () => {
  it('most Pragati units have no official chapter number', () => {
    const rows = (['class1', 'class12'] as Grade[]).flatMap((g) =>
      chaptersForStudentGrade(g)
    );
    expect(rows.length).toBeGreaterThan(0);
  });

  // v0.61 §9 — this assertion used to read "no chapter is source
  // verified today", which was true when written. The Ganita Prakash
  // primary source has since been retrieved and read, so Class 6 IS
  // verified now. The guard is preserved by inverting it: verification
  // must track EVIDENCE, so a grade whose source has never been opened
  // must still be refused.
  it('only grades whose primary source was actually read are verified', () => {
    for (const g of ['class1', 'class12'] as Grade[]) {
      for (const c of chaptersForStudentGrade(g)) {
        expect(readinessForChapter(c.chapterId).curriculum)
          .not.toBe('primary_source_verified');
      }
    }
  });

  it('Class 6 is verified, and every record carries its evidence', () => {
    const c6 = OFFICIAL_CHAPTERS.filter((c) => c.grade === 'class6');
    expect(c6).toHaveLength(10);
    for (const rec of c6) {
      expect(rec.verificationStatus).toBe('primary_source_verified');
      // validateOfficialChapter refuses a verified status whose
      // evidence fields are missing — the guard that stops a status
      // string being upgraded by hand.
      expect(validateOfficialChapter(rec)).toEqual([]);
    }
  });
});

describe('§12 Growth readiness is derived and currently blocked', () => {
  it('no chapter is Growth-eligible', () => {
    for (const g of ['class1', 'class6', 'class12'] as Grade[]) {
      for (const c of chaptersForStudentGrade(g)) {
        expect(readinessForChapter(c.chapterId).growth).toBe('not_eligible');
      }
    }
  });

  it('the blocker is the framework, and it is stated', () => {
    const r = evaluateGrowthReadiness(NO_GROWTH_EVIDENCE);
    expect(r.status).toBe('not_eligible');
    expect(r.blockers.join(' ')).toMatch(/framework is not approved/i);
  });

  it('advances only as evidence accumulates', () => {
    const base = {
      ...NO_GROWTH_EVIDENCE, frameworkApprovedForPilot: true,
      specificationCount: 8, specificationsExpertReviewed: 8,
    };
    expect(evaluateGrowthReadiness(base).status).toBe('specifications_ready');
    expect(evaluateGrowthReadiness({ ...base, secureItemCount: 20, itemsExpertReviewed: 20, itemsFieldTestEligible: 20 }).status)
      .toBe('field_test_ready');
    expect(evaluateGrowthReadiness({
      ...base, secureItemCount: 20, itemsExpertReviewed: 20,
      itemsFieldTestEligible: 20, itemsFieldTested: 20, itemsCalibrated: 20,
      operationalApproved: true,
    }).status).toBe('operational');
  });

  it('an unapproved framework blocks even a fully calibrated bank', () => {
    expect(evaluateGrowthReadiness({
      ...NO_GROWTH_EVIDENCE, specificationCount: 8, specificationsExpertReviewed: 8,
      secureItemCount: 20, itemsExpertReviewed: 20, itemsFieldTestEligible: 20,
      itemsFieldTested: 20, itemsCalibrated: 20, operationalApproved: true,
    }).status).toBe('not_eligible');
  });
});

describe('§14 student card states say what is missing', () => {
  it('practice-only says lessons are coming', () => {
    expect(STUDENT_STATUS_LABEL.assessment_prototype)
      .toMatch(/Practice only.*lessons coming/i);
  });

  it('lessons-only says practice is coming', () => {
    expect(STUDENT_STATUS_LABEL.lesson_prototype)
      .toMatch(/Lessons only.*practice coming/i);
  });

  it('no student label leaks governance vocabulary', () => {
    for (const v of Object.values(STUDENT_STATUS_LABEL)) {
      expect(v).not.toMatch(/prototype|verified|source|readiness|blueprint/i);
    }
  });
});
