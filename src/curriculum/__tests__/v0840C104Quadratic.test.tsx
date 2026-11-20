// ---------------------------------------------------------------------------
// v0.84.0-c10.4 checkpoint 58 — QUADRATIC EQUATIONS.
//
// Chapter 4's risk is agreement: every method, every discriminant claim and
// every stated root must reconcile. And one boundary that is not arithmetic
// at all — a negative discriminant means "no REAL roots", which is a true
// statement about this course rather than a false one about mathematics.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  discriminant, natureOfRoots, realRoots, satisfies, expandFactors, sameRootSet,
  auditRealRootScope, auditComplexLeakage,
} from '../quadraticAudit';
import {
  CLASS10_QUADRATIC_SECTIONS,
  C10_SECTION_4_4A,
} from '../quadraticSections';
import { validateVisual } from '../visualSpecification';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { CLASS10_TRIGONOMETRY_SECTIONS } from '../trigonometrySections';
import { CLASS10_COMPOSITE_SOLIDS_SECTIONS } from '../compositeSolidsSections';
import { CLASS10_SIMILARITY_SECTIONS } from '../similaritySections';

/** Every equation the wave states, with the roots it claims. */
const STATED: Array<{ a: number; b: number; c: number; roots: number[]; where: string; partial?: true }> = [
  { a: 2, b: -5, c: -3, roots: [3, -0.5], where: '4.3a we1 / 4.4b we1' },
  { a: 1, b: 5, c: -84, roots: [7, -12], where: '4.3a we2' },
  { a: 1, b: -5, c: -6, roots: [6, -1], where: '4.3a we3' },
  { a: 1, b: -7, c: 12, roots: [3, 4], where: '4.3a g1' },
  { a: 6, b: 1, c: -2, roots: [0.5, -2 / 3], where: '4.3a g2' },
  { a: 1, b: -2, c: -15, roots: [5, -3], where: '4.3a g3' },
  { a: 3, b: -10, c: 8, roots: [2, 4 / 3], where: '4.3a i1' },
  { a: 1, b: 1, c: -182, roots: [13, -14], where: '4.3a i2' },
  // A verification item: it states one root to check, not the whole set.
  { a: 1, b: 5, c: 4, roots: [-4], where: '4.2a g3', partial: true },
  { a: 4, b: -12, c: 9, roots: [1.5], where: '4.4a we3' },
  { a: 1, b: 4, c: 4, roots: [-2], where: '4.4a g1' },
  { a: 9, b: 6, c: 1, roots: [-1 / 3], where: '4.4a i2' },
  { a: 1, b: 6, c: 9, roots: [-3], where: '4.4a i3' },
  { a: 1, b: -4, c: -1, roots: [2 + Math.sqrt(5), 2 - Math.sqrt(5)], where: '4.4b we2' },
  { a: 1, b: -6, c: 4, roots: [3 + Math.sqrt(5), 3 - Math.sqrt(5)], where: '4.4b g1' },
  { a: 5, b: 2, c: -7, roots: [1, -1.4], where: '4.4b g2' },
  { a: 1, b: 7, c: 12, roots: [-3, -4], where: '4.4b g3' },
  { a: 2, b: 7, c: 3, roots: [-0.5, -3], where: '4.4b i1' },
  { a: 1, b: -2, c: -4, roots: [1 + Math.sqrt(5), 1 - Math.sqrt(5)], where: '4.4b i2' },
  { a: 3, b: -4, c: -2, roots: [(2 + Math.sqrt(10)) / 3, (2 - Math.sqrt(10)) / 3], where: '4.4b i3' },
];

/** Every discriminant the wave states, with the nature it claims. */
const D_CLAIMS: Array<{ a: number; b: number; c: number; d: number; nature: string }> = [
  { a: 2, b: -7, c: 3, d: 25, nature: 'two_distinct_real' },
  { a: 4, b: -12, c: 9, d: 0, nature: 'one_repeated_real' },
  { a: 3, b: -2, c: 1, d: -8, nature: 'no_real_roots' },
  { a: 1, b: 4, c: 4, d: 0, nature: 'one_repeated_real' },
  { a: 2, b: 3, c: 5, d: -31, nature: 'no_real_roots' },
  { a: 5, b: -6, c: -2, d: 76, nature: 'two_distinct_real' },
  { a: 9, b: 6, c: 1, d: 0, nature: 'one_repeated_real' },
  { a: 2, b: 1, c: 4, d: -31, nature: 'no_real_roots' },
  { a: 2, b: -5, c: -3, d: 49, nature: 'two_distinct_real' },
  { a: 1, b: -4, c: -1, d: 20, nature: 'two_distinct_real' },
  { a: 5, b: 2, c: -7, d: 144, nature: 'two_distinct_real' },
  { a: 3, b: -4, c: -2, d: 40, nature: 'two_distinct_real' },
  { a: 1, b: 6, c: 9, d: 0, nature: 'one_repeated_real' },
];

const blocks = (s: (typeof CLASS10_QUADRATIC_SECTIONS)[number]): Array<[string, string]> => [
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];

describe('root recomputation', () => {
  it('verifies every stated root against its own equation', () => {
    for (const { a, b, c, roots, where } of STATED) {
      for (const r of roots) {
        expect(satisfies({ a, b, c }, r), `${where}: ${r} in ${a}x²+${b}x+${c}`).toBe(true);
      }
    }
    expect(STATED.length).toBeGreaterThanOrEqual(20);
  });

  it('confirms the stated roots are the complete real root set', () => {
    for (const { a, b, c, roots, where, partial } of STATED) {
      if (partial) {
        // Only that the stated root belongs to the set.
        expect(realRoots({ a, b, c }).some((r) => Math.abs(r - roots[0]) < 1e-9), where).toBe(true);
        continue;
      }
      expect(sameRootSet(realRoots({ a, b, c }), roots), where).toBe(true);
    }
  });

  it('expands every factorisation back to the original', () => {
    // (x − 3)(2x + 1) → 2x² − 5x − 3, and the rest of the stated factorisations.
    for (const [lead, p, q, want] of [
      [2, 3, -0.5, { a: 2, b: -5, c: -3 }],
      [1, -12, 7, { a: 1, b: 5, c: -84 }],
      [1, 6, -1, { a: 1, b: -5, c: -6 }],
      [1, 3, 4, { a: 1, b: -7, c: 12 }],
      [6, 0.5, -2 / 3, { a: 6, b: 1, c: -2 }],
      [3, 2, 4 / 3, { a: 3, b: -10, c: 8 }],
    ] as const) {
      const got = expandFactors(lead, p, q);
      expect(got.a).toBeCloseTo(want.a, 9);
      expect(got.b).toBeCloseTo(want.b, 9);
      expect(got.c).toBeCloseTo(want.c, 9);
    }
  });
});

describe('discriminant fidelity', () => {
  it('recomputes every stated discriminant and its claimed nature', () => {
    for (const { a, b, c, d, nature } of D_CLAIMS) {
      expect(discriminant({ a, b, c }), `D for ${a},${b},${c}`).toBeCloseTo(d, 9);
      expect(natureOfRoots({ a, b, c }), `nature for ${a},${b},${c}`).toBe(nature);
    }
  });

  it('keeps the claimed nature consistent with the number of real roots', () => {
    for (const { a, b, c, nature } of D_CLAIMS) {
      const n = realRoots({ a, b, c }).length;
      if (nature === 'two_distinct_real') expect(n).toBe(2);
      if (nature === 'one_repeated_real') expect(n).toBe(1);
      if (nature === 'no_real_roots') expect(n).toBe(0);
    }
  });

  it('gives the repeated root as −b/2a where D = 0', () => {
    for (const { a, b, c } of D_CLAIMS.filter((x) => x.nature === 'one_repeated_real')) {
      expect(realRoots({ a, b, c })[0]).toBeCloseTo(-b / (2 * a), 12);
      expect(satisfies({ a, b, c }, -b / (2 * a))).toBe(true);
    }
  });
});

describe('method agreement', () => {
  it('gives the same roots by factorisation and by formula', () => {
    // 2x² − 5x − 3 is solved both ways in the wave.
    const q = { a: 2, b: -5, c: -3 };
    const byFactors = [3, -0.5];
    const byFormula = realRoots(q);
    expect(sameRootSet(byFactors, byFormula)).toBe(true);
    // And the factorisation expands back to the same equation.
    expect(expandFactors(2, 3, -0.5)).toEqual(q);
  });
});

describe('the real-root boundary', () => {
  it('finds no overstated claim anywhere in the wave', () => {
    for (const s of CLASS10_QUADRATIC_SECTIONS) {
      expect(auditRealRootScope(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('teaches no complex numbers', () => {
    for (const s of CLASS10_QUADRATIC_SECTIONS) {
      expect(auditComplexLeakage(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('says "no real roots" where D is negative', () => {
    const prose = CLASS10_QUADRATIC_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/no real roots/i);
    expect(prose).toMatch(/real-number system|in the real numbers/i);
  });

  it('would catch an overstated claim if one appeared', () => {
    // The auditor must bite, and must not bite on correct or quoted wording.
    expect(auditRealRootScope([['x', 'Since D is negative, the equation has no solution.']]).length).toBe(1);
    expect(auditRealRootScope([['x', '2x\u00b2 + x + 4 = 0 has no solution.']]).length).toBe(1);
    expect(auditRealRootScope([['x', 'Every quadratic equation has two real roots.']]).length).toBe(1);
    expect(auditRealRootScope([['x', 'Since D is negative, the equation has no real roots.']])).toEqual([]);
    expect(auditRealRootScope([['x', 'An expression has no roots, because there is nothing for a value to make true.']])).toEqual([]);
    expect(auditRealRootScope([['x', 'A student writes that the equation has no solution.']])).toEqual([]);
  });
});

describe('teaching fidelity', () => {
  it('derives the formula rather than announcing it', () => {
    const d = [...C10_SECTION_4_4A.explanation, ...C10_SECTION_4_4A.workedExamples.flatMap((w) => w.steps.map((s) => `${s.text} ${s.reasoning}`))].join(' ');
    for (const probe of [/divide every term by a/i, /complet/i, /b\u00b2\/4a\u00b2|b.{0,3}\/4a/, /\u00b1/, /a \u2260 0|a is not 0/]) {
      expect(d, String(probe)).toMatch(probe);
    }
  });

  it('keeps the ± everywhere the formula is written', () => {
    const prose = CLASS10_QUADRATIC_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    for (const m of prose.matchAll(/x = \(?\u2212b[^.]{0,40}\u221a/g)) {
      expect(m[0], 'formula written without ±').toContain('\u00b1');
    }
  });

  it('justifies the zero-product step and insists on standard form', () => {
    const prose = CLASS10_QUADRATIC_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/zero-product/i);
    expect(prose).toMatch(/product of two numbers is 0|product is 0/i);
    expect(prose).toMatch(/standard form/i);
  });

  it('rejects contextual roots for contextual reasons, not for being negative', () => {
    const prose = CLASS10_QUADRATIC_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/lengths are positive|cannot be a breadth|cannot be negative/i);
    expect(prose).toMatch(/not because it is negative|never from the sign alone|sign of a root is not a reason/i);
    // And it must not teach the false rule.
    expect(prose).not.toMatch(/always reject negative roots|negative roots are (?:bad|wrong)/i);
  });

  it('does not imply every quadratic factorises over the integers', () => {
    const prose = CLASS10_QUADRATIC_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/do not factorise|does not factorise|no integer factorisation/i);
  });
});

describe('content hygiene and governance', () => {
  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_QUADRATIC_SECTIONS) {
      const whole = blocks(s).map(([, t]) => t).join(' ').toLowerCase() + ' ' + s.nextStep.toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(' ').slice(-1)[0];
        expect(whole.includes(v.term.toLowerCase()) || whole.includes(head), `${s.contentArtifactId}: ${v.term}`).toBe(true);
      }
      for (const w of s.workedExamples) {
        for (const step of w.steps) expect(step.reasoning.length, w.id).toBeGreaterThan(40);
      }
      for (const t of [...s.explanation, s.summary]) expect(t).not.toMatch(/TODO|TBD|placeholder|recheck/i);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch04');
      expect(['4.2', '4.3', '4.4']).toContain(s.source.sectionNumber);
      expect([39, 42, 44]).toContain(s.source.startPage);
      for (const v of Object.values(s.visualsById)) expect(validateVisual(v)).toEqual([]);
    }
  });

  it('keeps its four lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.5 checkpoint 59 — Chapter 13 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const chapter4 = cat.chapters.find((c) => c.number === 4)!;
    expect(chapter4.lessons.length).toBe(4);
    for (const lesson of chapter4.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the three earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    expect(CLASS10_TRIGONOMETRY_SECTIONS.length).toBe(4);
    expect(CLASS10_COMPOSITE_SOLIDS_SECTIONS.length).toBe(3);
    expect(CLASS10_SIMILARITY_SECTIONS.length).toBe(6);
    for (const s of [...CLASS10_TRIGONOMETRY_SECTIONS, ...CLASS10_COMPOSITE_SOLIDS_SECTIONS, ...CLASS10_SIMILARITY_SECTIONS]) {
      expect(s.contentArtifactVersion).toBe(1);
    }
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
