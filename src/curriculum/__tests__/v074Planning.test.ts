// v0.74 — the planner must be honest about stage, grain and applicability.
//
// Each block below corresponds to a defect this release corrected. The
// tests are written so that REINTRODUCING the defect fails, rather than
// so that the current numbers pass — a test asserting `483` would have
// passed happily on v0.73's broken model.

import { describe, it, expect } from 'vitest';
import {
  contentPlan,
  planSummary,
  planForGrade,
  planForChapter,
  assertNoShapeLeakage,
  assertNoContentGenerated,
} from '../contentPlan';
import {
  authoringStandardForStage,
  productionStageForGrade,
  observedMiddleStageFractionsShape,
  stagesWithAuditedStandard,
  registryStageForGrade,
  REGISTRY_STAGE_TO_PRODUCTION_STAGE,
  PRODUCTION_STAGE_FOR_GRADE,
} from '../productionStage';
import { assessGrain, grainBreakdownForGrade } from '../curriculumGrain';
import {
  chapterReviewReadiness,
  reviewReadinessSummary,
  assessReviewReadiness,
} from '../reviewReadiness';
import {
  recordStateCounts,
  backlogCoverageSentence,
  assertCoverageWordingConsistent,
} from '../coverageWording';
import {
  structureVerificationBacklog,
  structureVerificationSummary,
  unknownCurriculumCaveat,
} from '../structureVerificationBacklog';
import {
  class6Roadmap,
  class6AuthoringOrder,
  class6RoadmapSummary,
  assertChapterSpecificPedagogy,
} from '../class6Roadmap';
import {
  productionBriefFor,
  briefsForChapter,
  assertBriefContainsNoContent,
} from '../productionBrief';
import { computeContentFingerprint } from '../contentArtifact';
import { ALL_TWELVE_GRADES } from '../curriculumCompletenessAudit';
import type { Grade } from '../../types';

// ---------------------------------------------------------------------------
// §1 — no universal Fractions shape
// ---------------------------------------------------------------------------

describe('§1 the Fractions shape does not leak across stages', () => {
  it('gives an audited standard to Middle Stage and to nothing else', () => {
    expect(stagesWithAuditedStandard()).toEqual(['MIDDLE']);
  });

  it('returns production_standard_pending rather than copying Fractions', () => {
    for (const stage of ['PRIMARY_EARLY', 'PRIMARY', 'SECONDARY', 'SENIOR_SECONDARY'] as const) {
      const std = authoringStandardForStage(stage);
      expect(std.kind).toBe('production_standard_pending');
      if (std.kind === 'production_standard_pending') {
        // The reason must name the missing evidence, not just say "TODO".
        expect(std.requires).toMatch(/audited|standard/i);
      }
    }
  });

  it('never applies a counted section shape outside Middle Stage', () => {
    // The standing guard. Empty is the only acceptable result.
    expect(assertNoShapeLeakage()).toEqual([]);
  });

  it('gives Classes 9-12 no counted authoring items at all', () => {
    for (const g of ['class9', 'class10', 'class11', 'class12'] as const) {
      for (const p of planForGrade(g)) {
        const counted = p.work.filter(
          (w) => w.applicability === 'required' && typeof w.outstanding === 'number' && w.outstanding > 0
        );
        expect(counted, `${g} ${p.officialUnitId}`).toEqual([]);
      }
    }
  });

  it('agrees with the registry about which stage a grade is in', () => {
    // Two stage models exist for good reasons (NCF goals vs production
    // bands). They must not disagree about a grade.
    for (const g of ALL_TWELVE_GRADES) {
      const registry = registryStageForGrade(g);
      if (!registry) continue;
      expect(REGISTRY_STAGE_TO_PRODUCTION_STAGE[registry], g).toBe(
        PRODUCTION_STAGE_FOR_GRADE[g]
      );
    }
  });

  it('keeps the observed Fractions shape as an observation', () => {
    const o = observedMiddleStageFractionsShape();
    expect(o.workedExamples).toBeGreaterThan(0);
    // It is still the input to the MIDDLE standard — evidence, not
    // discarded.
    const std = authoringStandardForStage('MIDDLE');
    expect(std.kind).toBe('audited_standard');
    if (std.kind === 'audited_standard') {
      expect(std.grain).toBe('official_section');
      expect(std.evidence).toMatch(/Chapter 7/);
      expect(std.shape.workedExamples).toBeGreaterThanOrEqual(o.workedExamples);
    }
  });
});

// ---------------------------------------------------------------------------
// §2 — grain
// ---------------------------------------------------------------------------

describe('§2 a syllabus unit does not receive a section-level plan', () => {
  it('classifies Class 6 records as sections and Classes 9-12 as units', () => {
    expect(grainBreakdownForGrade('class6').official_section).toBe(65);
    for (const g of ['class9', 'class10', 'class11', 'class12'] as const) {
      const b = grainBreakdownForGrade(g);
      expect(b.official_section, g).toBe(0);
      expect(b.official_unit, g).toBeGreaterThan(0);
    }
  });

  it('refuses to plan a unit, and says what evidence is missing', () => {
    const units = contentPlan().filter((p) => p.grain === 'official_unit');
    expect(units.length).toBe(24);
    for (const p of units) {
      expect(p.outcome).toBe('requires_deeper_curriculum_structure');
      expect(p.work.map((w) => w.kind)).toEqual(['verify_official_structure']);
      expect(p.grainAssessment.requires).toBeTruthy();
    }
  });

  it('treats a verified section as plannable', () => {
    const a = assessGrain('class6', 'ncert_gp_c6_s7_4');
    expect(a.grain).toBe('official_section');
    expect(a.plannable).toBe(true);
    expect(a.requires).toBeNull();
  });

  it('does not put unplannable records on the educator review list', () => {
    for (const p of contentPlan()) {
      if (p.outcome === 'planned') continue;
      expect(p.work.some((w) => w.kind === 'educator_review')).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// §3 — applicability is complete, not silently omitted
// ---------------------------------------------------------------------------

describe('§3 unauthored work is represented completely', () => {
  it('emits a design decision for every component it cannot yet decide', () => {
    // v0.73's target shape named reasoningTasks, interactivePractice and
    // documentedMisconceptions, and its unauthored branch emitted work
    // items for NONE of them. Zero, across 80 records.
    const unauthored = contentPlan().filter(
      (p) => p.outcome === 'planned' && p.assessment === null
    );
    expect(unauthored.length).toBe(56);
    for (const p of unauthored) {
      const design = p.work.filter(
        (w) => w.applicability === 'undetermined_requires_design_review'
      );
      expect(design, p.officialSectionId ?? '').toHaveLength(3);
      for (const d of design) expect(d.reason).toBeTruthy();
    }
  });

  it('plans a reasoning task, which v0.73 omitted entirely', () => {
    const kinds = planSummary().byKind;
    expect(kinds.author_reasoning_task).toBeGreaterThan(0);
  });

  it('uses exactly three applicability values, never a silent gap', () => {
    const seen = new Set<string>();
    for (const p of contentPlan()) for (const w of p.work) seen.add(w.applicability);
    expect([...seen].sort()).toEqual([
      'not_required_with_reason',
      'required',
      'undetermined_requires_design_review',
    ]);
  });

  it('records a waiver with its reason rather than dropping it', () => {
    const s79 = planForChapter('ncert_gp_c6_ch07_fractions').find(
      (p) => p.officialSectionId === 'ncert_gp_c6_s7_9'
    )!;
    const waived = s79.work.filter((w) => w.applicability === 'not_required_with_reason');
    expect(waived.length).toBe(3);
    for (const w of waived) {
      expect(w.outstanding).toBe(0);
      expect(w.reason!.length).toBeGreaterThan(20);
    }
  });

  it('counts determined and undetermined work separately', () => {
    const s = planSummary();
    // The corrected figures. Recorded so a regression to a single
    // conflated number is visible.
    expect(s.records).toBe(89);
    expect(s.plannable).toBe(65);
    expect(s.requiresDeeperStructure).toBe(24);
    expect(s.determinedAuthoringItems).toBe(339);
    expect(s.undeterminedDesignDecisions).toBe(168);
    expect(s.waivedWithReason).toBe(3);
    // And the sum is NOT the headline number, because the two are not
    // the same kind of thing.
    expect(s.determinedAuthoringItems).not.toBe(483);
  });

  it('still authors nothing', () => {
    expect(assertNoContentGenerated()).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §7 — "blocked on a human" must be operationally true
// ---------------------------------------------------------------------------

describe('§7 review readiness is checked, not assumed', () => {
  it('finds every complete draft reviewable once its package exists', () => {
    // v0.75 §21/§22: was 8 complete drafts / 1 ready / 7 awaiting a
    // package. §22 completed §7.9 (9 complete drafts) and §21 built the
    // eight missing packages, so the engineering queue is empty and the
    // whole chapter is waiting on people. The v0.74 assertion encoded
    // the state BEFORE that work, not a behaviour being reversed.
    const s = reviewReadinessSummary();
    expect(s.completeDrafts).toBe(9);
    expect(s.reviewReady).toBe(9);
    expect(s.awaitingPackagePreparation).toBe(0);
  });

  it('names every section as review-ready, §7.4 among them', () => {
    // v0.75 §21 — §7.4 keeps its own frozen package untouched; the
    // other eight now have generated section-scoped ones.
    const ready = chapterReviewReadiness().filter((r) => r.state === 'review_ready');
    expect(ready.map((r) => r.sectionNumber)).toEqual([
      '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9',
    ]);
  });

  it('reports §7.2 as satisfied now that it has its own package', () => {
    // v0.75 §21 — in v0.74 this section failed `review_instrument` and
    // `stable_artifact_identity` because Package B's questions are
    // written about §7.4's number line. It now has both, generated from
    // its own content.
    const r72 = assessReviewReadiness('ncert_gp_c6_s7_2');
    expect(r72.state).toBe('review_ready');
    expect(r72.blockedOnReviewerOnly).toBe(true);
    expect(r72.checks.filter((c) => !c.satisfied)).toEqual([]);
    expect(r72.nextAction).toMatch(/^PERSON/);
  });

  it('has no review-package work left', () => {
    // v0.75 §21 — the seven were built. This is the assertion that
    // proves the engineering queue actually emptied rather than the
    // headline merely changing.
    expect(planSummary().reviewPackagesToPrepare).toBe(0);
  });

  it('separates blocked-on-review from blocked-on-a-textbook', () => {
    const s = planSummary();
    // Both are "a person must act", and they are not the same request.
    // v0.75: 1 -> 9. Every Chapter 7 section is now waiting on a person.
    expect(s.blockedOnEducatorReviewOnly).toBe(9);
    expect(s.blockedOnStructureVerification).toBe(24);
    expect(s.blockedOnHumanOnly).toBe(
      s.blockedOnEducatorReviewOnly + s.blockedOnStructureVerification
    );
  });
});

// ---------------------------------------------------------------------------
// §5/§6 — coverage wording
// ---------------------------------------------------------------------------

describe('§5 reports cannot contradict their own data', () => {
  it('never describes authored drafts as no content at all', () => {
    expect(assertCoverageWordingConsistent()).toEqual([]);
  });

  it('catches the exact v0.73 sentence', () => {
    const bad = 'including the 89 for which Pragati has no content at all.';
    const violations = assertCoverageWordingConsistent(bad);
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0]).toMatch(/no content at all/);
  });

  it('states the five states separately', () => {
    const c = recordStateCounts();
    expect(c.structure_only).toBe(80);
    // v0.75 §22 — §7.9 was the one incomplete draft. It is complete now.
    expect(c.incomplete_draft).toBe(0);
    expect(c.review_package_preparation + c.awaiting_review).toBe(9);
    expect(c.reviewed).toBe(0);
    expect(c.published).toBe(0);
  });

  it('writes a sentence that matches the counts', () => {
    const s = backlogCoverageSentence();
    expect(s).toMatch(/89 verified official records/);
    expect(s).toMatch(/80 hold no instructional content at all/);
    expect(s).toMatch(/0 are reviewed and 0 are published/);
    expect(s).not.toMatch(/89 .{0,40}no content at all/);
  });
});

// ---------------------------------------------------------------------------
// §20/§21 — the unknown curriculum stays visible
// ---------------------------------------------------------------------------

describe('§20 unknown curriculum is work, not zero', () => {
  it('lists the seven unverified grades', () => {
    const s = structureVerificationSummary();
    expect(s.gradesUnverified).toBe(7);
    expect(s.gradeLabels).toEqual([
      'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 7', 'Class 8',
    ]);
  });

  it('reports the unknown record count as null, never zero', () => {
    expect(structureVerificationSummary().unknownRecordCount).toBeNull();
  });

  it('gives every unverified grade a template and a human action', () => {
    for (const e of structureVerificationBacklog()) {
      expect(e.templatePath).toMatch(/curriculum-verification\/grade\d+_/);
      expect(e.action.length).toBeGreaterThan(30);
      expect(e.whyNotEngineering).toMatch(/person|ncert/i);
    }
  });

  it('never lets a verified grade appear on the evidence backlog', () => {
    const ids = structureVerificationBacklog().map((e) => e.grade);
    for (const g of ['class6', 'class9', 'class10', 'class11', 'class12'] as Grade[]) {
      expect(ids).not.toContain(g);
    }
  });

  it('supplies a caveat any backlog total must carry', () => {
    expect(unknownCurriculumCaveat()).toMatch(/7 grades/);
    expect(unknownCurriculumCaveat()).toMatch(/contribute nothing/);
  });
});

// ---------------------------------------------------------------------------
// §24/§25 — the Class 6 roadmap
// ---------------------------------------------------------------------------

describe('§24 the Class 6 roadmap is complete and ordered', () => {
  it('covers all ten official chapters', () => {
    expect(class6Roadmap()).toHaveLength(10);
    expect(class6Roadmap().reduce((n, r) => n + r.sections, 0)).toBe(65);
  });

  it('ranks the nine unauthored chapters', () => {
    const order = class6AuthoringOrder();
    expect(order).toHaveLength(9);
    expect(order.map((r) => r.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(order[0].officialChapterId).toBe('ncert_gp_c6_ch03_number_play');
  });

  it('leaves 56 sections un-authored', () => {
    expect(class6RoadmapSummary().sectionsRemaining).toBe(56);
  });

  it('gives every chapter its own pedagogy, not the Fractions template', () => {
    expect(assertChapterSpecificPedagogy()).toEqual([]);
  });

  it('ranks construction last, and says why rather than calling it easy', () => {
    const order = class6AuthoringOrder();
    const last = order[order.length - 1];
    expect(last.officialChapterId).toBe('ncert_gp_c6_ch08_constructions');
    expect(last.visualSystem).toBe('requires_new_interaction_model');
    expect(last.rationale).toMatch(/misrepresent|item model/i);
  });

  it('does not claim a chapter is ready when its components do not exist', () => {
    for (const r of class6AuthoringOrder()) {
      if (r.visualSystem !== 'ready') {
        expect(r.blockers.length, r.title).toBeGreaterThan(0);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// §26 — the production brief
// ---------------------------------------------------------------------------

describe('§26 the brief specifies without authoring', () => {
  it('produces a brief for an unauthored verified section', () => {
    const b = productionBriefFor('class6', 'ncert_gp_c6_s3_1');
    expect(b).not.toBeNull();
    expect(b!.requirements.length).toBeGreaterThanOrEqual(10);
    const headings = b!.requirements.map((r) => r.heading);
    for (const h of [
      'Source identity', 'Prerequisites', 'Learning objective',
      'Concept explanation', 'Representation', 'Worked examples',
      'Practice design', 'Feedback design', 'Teacher resources',
      'Accessibility', 'Review path',
    ]) {
      expect(headings).toContain(h);
    }
  });

  it('generates no student-facing content', () => {
    const all = [
      ...briefsForChapter('ncert_gp_c6_ch03_number_play'),
      ...briefsForChapter('ncert_gp_c6_ch08_constructions'),
    ];
    expect(assertBriefContainsNoContent(all)).toEqual([]);
  });

  it('differs by domain rather than repeating one template', () => {
    const numberPlay = briefsForChapter('ncert_gp_c6_ch03_number_play')[0];
    const constructions = briefsForChapter('ncert_gp_c6_ch08_constructions')[0];
    const rep = (b: typeof numberPlay) =>
      b.requirements.find((r) => r.heading === 'Representation')!.requirement;
    const prac = (b: typeof numberPlay) =>
      b.requirements.find((r) => r.heading === 'Practice design')!.requirement;
    expect(rep(numberPlay)).not.toBe(rep(constructions));
    expect(prac(numberPlay)).not.toBe(prac(constructions));
    // And the constructions brief refuses the substitution that would
    // make it look finished.
    expect(prac(constructions)).toMatch(/multiple-choice/i);
  });

  it('marks a brief blocked when the platform cannot render it', () => {
    const c = briefsForChapter('ncert_gp_c6_ch08_constructions')[0];
    expect(c.blocked).toBe(true);
    expect(c.blockers.length).toBeGreaterThan(0);
  });

  it('refuses a brief for an unverified grade', () => {
    expect(productionBriefFor('class7', 'anything')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Invariants
// ---------------------------------------------------------------------------

describe('v0.74 changed no content', () => {
  it('leaves the §7.4 fingerprint untouched', () => {
    expect(computeContentFingerprint()).toBe('a1a3ff57');
  });

  it('publishes nothing and reviews nothing', () => {
    const c = recordStateCounts();
    expect(c.reviewed).toBe(0);
    expect(c.published).toBe(0);
    expect(c.publication_ready).toBe(0);
  });

  it('plans only for verified grades', () => {
    const grades = new Set(contentPlan().map((p) => p.grade));
    expect([...grades].sort()).toEqual([
      'class10', 'class11', 'class12', 'class6', 'class9',
    ]);
  });

  it('keeps every grade in exactly one production stage', () => {
    for (const g of ALL_TWELVE_GRADES) {
      expect(productionStageForGrade(g)).toBeTruthy();
    }
  });
});
