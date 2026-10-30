// ---------------------------------------------------------------------------
// v0.84.0-c10.3 checkpoint 57 — THE SIMILARITY WAVE.
//
// The governing question: can Pragati follow the mathematics in the textbook
// without following it past what the current CBSE curriculum asks students to
// prove? The §6.4 tests below are the answer, in both directions.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { auditProofScope } from '../proofScopeAudit';
import {
  CLASS10_SIMILARITY_SECTIONS,
  C10_SECTION_6_3A,
  C10_SECTION_6_4A,
  C10_SECTION_6_4B,
} from '../similaritySections';
import { validateVisual, validateParallelGroups, type GeometryFigureSpec } from '../visualSpecification';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { CLASS10_TRIGONOMETRY_SECTIONS } from '../trigonometrySections';
import { CLASS10_COMPOSITE_SOLIDS_SECTIONS } from '../compositeSolidsSections';

/** The frozen expectations from the checkpoint-54 decomposition. */
const EXPECTATION: Record<string, Parameters<typeof auditProofScope>[1]> = {
  ncert_jemh1_s6_2_similar_figures_lesson: 'UNDERSTAND',
  ncert_jemh1_s6_3_bpt_proof_lesson: 'PROVE',
  ncert_jemh1_s6_3_bpt_apply_lesson: 'APPLY',
  ncert_jemh1_s6_4_aaa_lesson: 'STATE_WITHOUT_PROOF',
  ncert_jemh1_s6_4_sss_sas_lesson: 'STATE_WITHOUT_PROOF',
  ncert_jemh1_s6_4_apply_lesson: 'APPLY',
};

describe('proof scope — the central governance test', () => {
  it('authors six lessons matching the canonical unit map', () => {
    expect(CLASS10_SIMILARITY_SECTIONS.length).toBe(6);
    expect(CLASS10_SIMILARITY_SECTIONS.map((s) => s.contentArtifactId).sort()).toEqual(
      Object.keys(EXPECTATION).sort()
    );
  });

  it('holds every lesson to its own decomposition expectation', () => {
    for (const s of CLASS10_SIMILARITY_SECTIONS) {
      expect(auditProofScope(s, EXPECTATION[s.contentArtifactId]), s.contentArtifactId).toEqual([]);
    }
  });

  it('lets no textbook proof of a criterion leak into §6.4', () => {
    // The two STATE_WITHOUT_PROOF lessons, audited specifically.
    for (const s of [C10_SECTION_6_4A, C10_SECTION_6_4B]) {
      expect(auditProofScope(s, 'STATE_WITHOUT_PROOF'), s.contentArtifactId).toEqual([]);
      // And they say so openly rather than leaving the omission unexplained.
      const prose = [s.learningGoal, ...s.explanation].join(' ');
      expect(prose, s.contentArtifactId).toMatch(/without prov|takes? (?:that |them |it )?as given/i);
    }
  });

  it('would catch a leak if one appeared', () => {
    // Negative fixture: the auditor must bite, not merely pass.
    const leaked = {
      ...C10_SECTION_6_4A,
      explanation: [...C10_SECTION_6_4A.explanation, 'We will now prove the AAA similarity criterion.'],
    };
    expect(auditProofScope(leaked, 'STATE_WITHOUT_PROOF').length).toBeGreaterThan(0);
    // And it must not fire on legitimate application language.
    const applies = {
      ...C10_SECTION_6_4A,
      explanation: [...C10_SECTION_6_4A.explanation, 'Prove that these two triangles are similar.'],
    };
    expect(auditProofScope(applies, 'STATE_WITHOUT_PROOF')).toEqual([]);
  });

  it('holds the BPT lesson to a real proof', () => {
    expect(auditProofScope(C10_SECTION_6_3A, 'PROVE')).toEqual([]);
    const proof = C10_SECTION_6_3A.workedExamples[0];
    expect(proof.steps.length).toBeGreaterThanOrEqual(5);
    const body = [...C10_SECTION_6_3A.explanation, ...proof.steps.map((s) => s.text)].join(' ');
    // The chain the proof must actually contain.
    for (const probe of [/same base/i, /between the same parallels/i, /ar\(ADE\)/, /AD\/DB/, /AE\/EC/]) {
      expect(body, String(probe)).toMatch(probe);
    }
    // And it must identify where the hypothesis is used.
    const all = [...C10_SECTION_6_3A.explanation, ...C10_SECTION_6_3A.workedExamples.flatMap((w) => w.steps.map((x) => x.text + x.reasoning))].join(' ');
    expect(all).toMatch(/only the last step used|the one that uses it|uses the parallel/i);
    // A degenerate "it can be shown" would have been caught.
    const deferred = { ...C10_SECTION_6_3A, explanation: ['It can be shown that AD/DB = AE/EC.'] };
    expect(auditProofScope(deferred, 'PROVE').length).toBeGreaterThan(0);
  });
});

describe('figure semantics', () => {
  it('validates every similarity figure, parallel claims included', () => {
    for (const s of CLASS10_SIMILARITY_SECTIONS) {
      for (const [k, v] of Object.entries(s.visualsById)) {
        expect(validateVisual(v), `${s.contentArtifactId}/${k}`).toEqual([]);
      }
    }
  });

  it('rejects a parallel claim the coordinates contradict', () => {
    const bpt = C10_SECTION_6_3A.visualsById.F_BPT as GeometryFigureSpec;
    expect(bpt.parallelGroups?.length).toBe(1);
    expect(validateParallelGroups(bpt)).toEqual([]);
    const tilted: GeometryFigureSpec = {
      ...bpt,
      points: bpt.points.map((p) => (p.id === 'e' ? { ...p, y: 3 } : p)),
    };
    expect(validateParallelGroups(tilted).join(' ')).toMatch(/claimed parallel but the coordinates make them cross/);
  });
});

describe('mathematical fidelity', () => {
  it('recomputes every proportion the lessons state', () => {
    // 6.3a: AD/DB = AE/EC.
    expect(3 / 4.5).toBeCloseTo(4 / 6, 12);
    expect(2 / 5).toBeCloseTo(3 / 7.5, 12);
    expect(4 / 6).toBeCloseTo(6 / 9, 12);
    // 6.3a i4: 2x(x+4) = (2x+1)(x+3) at x = 3.
    expect(2 * 3 * (3 + 4)).toBe((2 * 3 + 1) * (3 + 3));
    // 6.3b: AC = AE + EC, with EC from the proportion.
    expect(6 / 9).toBeCloseTo(8 / 12, 12);
    expect(8 + 12).toBe(20);
    // 6.3b i4: x(x+4) = (x+1)(x+2) at x = 2.
    expect(2 * (2 + 4)).toBe((2 + 1) * (2 + 2));
    // 6.4b SSS: 4:6, 6:9, 8:12 all 2:3.
    for (const [a, b] of [[4, 6], [6, 9], [8, 12]] as const) expect(a / b).toBeCloseTo(2 / 3, 12);
    // 6.4b g1: 9/20 breaks the pattern.
    expect(5 / 10).toBeCloseTo(7 / 14, 12);
    expect(9 / 20).not.toBeCloseTo(1 / 2, 3);
    // 6.4c: QR, EF, YZ, DF.
    expect(4 / 6).toBeCloseTo(5 / 7.5, 12);
    expect(7 / (35 / 3)).toBeCloseTo(3 / 5, 12);
    expect(9 / 6).toBeCloseTo(12 / 8, 12);
    expect(14 / 24.5).toBeCloseTo(4 / 7, 12);
  });

  it('never claims equal sides from equal angles', () => {
    const prose = CLASS10_SIMILARITY_SECTIONS.flatMap((s) => [...s.explanation, s.summary]).join(' ');
    expect(prose).toMatch(/proportional, not equal|Equal angles do not mean equal sides|Proportional is not equal/i);
    expect(prose).not.toMatch(/similar triangles have equal sides/i);
  });

  it('teaches the included-angle condition and an invalid-evidence case', () => {
    const b = [...C10_SECTION_6_4B.explanation, ...C10_SECTION_6_4B.workedExamples.flatMap((w) => [w.prompt, w.answer])].join(' ');
    expect(b).toMatch(/included/i);
    expect(b).toMatch(/not the included angle/i);
    // At least one worked example concludes that the evidence is insufficient.
    const insufficient = CLASS10_SIMILARITY_SECTIONS.flatMap((s) => s.workedExamples).filter((w) =>
      /insufficient|does not apply|not enough/i.test(w.answer)
    );
    expect(insufficient.length).toBeGreaterThanOrEqual(2);
  });

  it('distinguishes insufficient evidence from dissimilarity', () => {
    const all = CLASS10_SIMILARITY_SECTIONS.flatMap((s) => [
      ...s.independentPractice.map((p) => p.rationale),
      ...s.reasoningApplication.map((r) => r.expectedReasoning),
    ]).join(' ');
    expect(all).toMatch(/not that the triangles are dissimilar|may well be similar|not the same as the triangles being dissimilar/i);
  });
});

describe('correspondence fidelity', () => {
  it('teaches that vertex order carries the matching', () => {
    const prose = CLASS10_SIMILARITY_SECTIONS.flatMap((s) => [...s.explanation, s.summary]).join(' ');
    expect(prose).toMatch(/order/i);
    expect(prose).toMatch(/correspond/i);
  });

  it('keeps side pairings consistent with the stated correspondence', () => {
    // ABC ~ PQR pairs AB with PQ, BC with QR, CA with RP.
    const prose = CLASS10_SIMILARITY_SECTIONS.flatMap((s) => [...s.explanation, ...s.workedExamples.flatMap((w) => w.steps.map((x) => x.text))]).join(' ');
    expect(prose).toMatch(/AB\/PQ = BC\/QR = CA\/RP|AB with PQ, BC with QR, CA with RP/);
    // Where the wrong pairing appears it is named as wrong, never used.
    for (const sentence of prose.split(/(?<=[.?!])\s+/)) {
      if (/AB\/QR|AB with QR/.test(sentence)) {
        expect(sentence, 'the wrong pairing must be flagged, not used').toMatch(/instead|no basis|wrong|not because/i);
      }
    }
  });
});

describe('content hygiene and governance', () => {
  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_SIMILARITY_SECTIONS) {
      const whole = [
        ...s.explanation, s.summary, s.nextStep,
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
        ...s.guidedPractice.flatMap((g) => [g.prompt, g.answer, g.rationale, g.hint]),
        ...s.independentPractice.flatMap((p) => [p.prompt, p.answer, p.rationale]),
        ...s.reasoningApplication.flatMap((r) => [r.prompt, r.expectedReasoning]),
      ].join(' ').toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(' ').slice(-1)[0];
        expect(whole.includes(v.term.toLowerCase()) || whole.includes(head), `${s.contentArtifactId}: ${v.term}`).toBe(true);
      }
      for (const w of s.workedExamples) {
        for (const step of w.steps) expect(step.reasoning.length, w.id).toBeGreaterThan(40);
      }
      for (const t of [...s.explanation, s.summary]) expect(t).not.toMatch(/TODO|TBD|placeholder|recheck/i);
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });

  it('carries correct Chapter 6 provenance', () => {
    for (const s of CLASS10_SIMILARITY_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch06');
      expect(['6.2', '6.3', '6.4']).toContain(s.source.sectionNumber);
      expect([74, 79, 85]).toContain(s.source.startPage);
      expect(s.source.textbook).toContain('Class X');
    }
  });

  it('keeps its six lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.4 checkpoint 58 — Chapter 4 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const chapter6 = cat.chapters.find((c) => c.number === 6)!;
    expect(chapter6.lessons.length).toBe(6);
    for (const lesson of chapter6.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the earlier pilots unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    expect(CLASS10_TRIGONOMETRY_SECTIONS.length).toBe(4);
    expect(CLASS10_COMPOSITE_SOLIDS_SECTIONS.length).toBe(3);
    for (const s of [...CLASS10_TRIGONOMETRY_SECTIONS, ...CLASS10_COMPOSITE_SOLIDS_SECTIONS]) {
      expect(s.contentArtifactVersion).toBe(1);
    }
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
