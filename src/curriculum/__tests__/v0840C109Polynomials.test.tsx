// ---------------------------------------------------------------------------
// v0.84.0-c10.9 checkpoint 63 — POLYNOMIALS.
//
// The governing question: can a polynomial be represented once, with its
// zeroes, factors, graph and coefficient relations all derived from that
// same object, so the representations cannot silently disagree?
//
// The cross-representation harness below is the central permanent invariant.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  degree, evaluate, evaluateRational, isZeroOf, yIntercept, asQuadratic,
  discriminant, realZeroNature, rationalZeroes, sumOfZeroes, productOfZeroes,
  expandFactors, quadraticFromSumProduct, rational, toNumber, formatRational,
  samplePoints, xInterceptsInWindow, validatePolynomial, validatePolynomialGraph,
  auditRealZeroWording, type Polynomial,
} from '../polynomial';
import {
  CLASS10_POLYNOMIAL_SECTIONS, CANONICAL_POLYNOMIALS, CANONICAL_GRAPHS,
  P_TWO, P_REPEATED, P_NONE, P_RATIONAL, P_SCALED, G_TWO, G_REPEATED, G_NONE,
} from '../polynomialSections';
import { PolynomialGraph } from '../../features/learn/PolynomialGraph';
import { validateVisual } from '../visualSpecification';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { CLASS10_TRIGONOMETRY_SECTIONS } from '../trigonometrySections';
import { CLASS10_COMPOSITE_SOLIDS_SECTIONS } from '../compositeSolidsSections';
import { CLASS10_SIMILARITY_SECTIONS } from '../similaritySections';
import { CLASS10_QUADRATIC_SECTIONS } from '../quadraticSections';
import { CLASS10_STATISTICS_SECTIONS } from '../statisticsSections';
import { CLASS10_LINEAR_SYSTEM_SECTIONS } from '../linearSystemSections';
import { CLASS10_HEIGHTS_DISTANCES_SECTIONS } from '../heightsDistancesSections';
import { CLASS10_REAL_NUMBERS_SECTIONS } from '../realNumbersSections';

const blocks = (s: (typeof CLASS10_POLYNOMIAL_SECTIONS)[number]): Array<[string, string]> => [
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];

describe('the cross-representation harness — the central invariant', () => {
  it('validates every canonical polynomial', () => {
    expect(CANONICAL_POLYNOMIALS.length).toBe(5);
    for (const p of CANONICAL_POLYNOMIALS) {
      expect(validatePolynomial(p), p.label).toEqual([]);
      expect(degree(p), p.label).toBe(2);
    }
  });

  it('makes every claimed zero vanish EXACTLY, not approximately', () => {
    for (const p of CANONICAL_POLYNOMIALS) {
      const q = asQuadratic(p)!;
      for (const z of rationalZeroes(q)) {
        expect(isZeroOf(p, z), `${p.label} at ${formatRational(z)}`).toBe(true);
        expect(evaluateRational(p, z).num).toBe(0);
      }
    }
    // The rational zero is exact, and a decimal approximation of it is not.
    expect(isZeroOf(P_RATIONAL, rational(-1, 2))).toBe(true);
    expect(isZeroOf(P_RATIONAL, rational(-49, 100))).toBe(false);
  });

  it('expands every factorisation back to the original coefficients', () => {
    const cases: Array<[Polynomial, number, [number, number], [number, number]]> = [
      [P_TWO, 1, [2, 1], [3, 1]],
      [P_REPEATED, 1, [3, 1], [3, 1]],
      [P_RATIONAL, 2, [3, 1], [-1, 2]],
      [P_SCALED, 3, [2, 1], [3, 1]],
    ];
    for (const [p, k, a, b] of cases) {
      const expanded = expandFactors(k, rational(a[0], a[1]), rational(b[0], b[1]));
      expect(expanded.coefficients, p.label).toEqual(p.coefficients);
    }
  });

  it('puts every plotted point on the curve and every zero inside the window', () => {
    for (const g of CANONICAL_GRAPHS) {
      expect(validatePolynomialGraph(g), g.polynomial.label).toEqual([]);
      expect(validateVisual(g), `${g.polynomial.label} via validateVisual`).toEqual([]);
      for (const pt of samplePoints(g, 40)) {
        expect(pt.y).toBeCloseTo(evaluate(g.polynomial, pt.x), 9);
      }
      // The x-intercepts drawn ARE the algebraic zeroes.
      const q = asQuadratic(g.polynomial)!;
      expect(xInterceptsInWindow(g).map(formatRational)).toEqual(rationalZeroes(q).map(formatRational));
    }
  });

  it('rejects a graph that hides a zero outside its window', () => {
    const clipped = { ...G_TWO, xMin: -1, xMax: 2.5 };
    expect(validatePolynomialGraph(clipped).join(' ')).toMatch(/falls outside the drawn window/);
  });

  it('rejects alt text describing the wrong number of intercepts', () => {
    const lying = { ...G_REPEATED, altText: 'The curve meets the x-axis at two distinct real zeroes.' };
    expect(validatePolynomialGraph(lying).join(' ')).toMatch(/does not describe a polynomial with one repeated/);
  });
});

describe('zeroes, intercepts and the coefficient relations', () => {
  it('separates the three quadratic cases', () => {
    expect(realZeroNature(asQuadratic(P_TWO)!)).toBe('two_distinct');
    expect(realZeroNature(asQuadratic(P_REPEATED)!)).toBe('one_repeated');
    expect(realZeroNature(asQuadratic(P_NONE)!)).toBe('none_real');
    expect(discriminant(asQuadratic(P_NONE)!)).toBeLessThan(0);
  });

  it('counts a repeated zero once, not twice', () => {
    expect(rationalZeroes(asQuadratic(P_REPEATED)!).map(formatRational)).toEqual(['3']);
    expect(xInterceptsInWindow(G_REPEATED).length).toBe(1);
    // But the relations still use it twice.
    expect(formatRational(sumOfZeroes(asQuadratic(P_REPEATED)!))).toBe('6');
    expect(formatRational(productOfZeroes(asQuadratic(P_REPEATED)!))).toBe('9');
  });

  it('returns no zeroes where the curve misses the axis', () => {
    expect(rationalZeroes(asQuadratic(P_NONE)!)).toEqual([]);
    expect(xInterceptsInWindow(G_NONE)).toEqual([]);
  });

  it('recomputes sum and product with the right signs', () => {
    const cases: Array<[Polynomial, string, string]> = [
      [P_TWO, '5', '6'],
      [P_REPEATED, '6', '9'],
      [P_NONE, '-2', '5'],
      [P_RATIONAL, '5/2', '-3/2'],
      [P_SCALED, '5', '6'],
    ];
    for (const [p, sum, product] of cases) {
      const q = asQuadratic(p)!;
      expect(formatRational(sumOfZeroes(q)), `${p.label} sum`).toBe(sum);
      expect(formatRational(productOfZeroes(q)), `${p.label} product`).toBe(product);
    }
  });

  it('catches a sign error in the sum relation', () => {
    // Fixtures with every sign combination of b and c.
    const fixtures: Array<[number, number, number, string, string]> = [
      [1, -5, 6, '5', '6'],
      [1, 4, -21, '-4', '-21'],
      [1, -8, 15, '8', '15'],
      [3, 6, -9, '-2', '-3'],
      [2, -5, -3, '5/2', '-3/2'],
    ];
    for (const [a, b, c, sum, product] of fixtures) {
      expect(formatRational(sumOfZeroes({ a, b, c })), `sum ${a},${b},${c}`).toBe(sum);
      expect(formatRational(productOfZeroes({ a, b, c })), `product ${a},${b},${c}`).toBe(product);
      // b/a would be the classic error, and must differ wherever b is non-zero.
      if (b !== 0) expect(formatRational(rational(b, a))).not.toBe(sum);
    }
  });

  it('agrees between zeroes added directly and the relation', () => {
    for (const p of [P_TWO, P_RATIONAL, P_SCALED]) {
      const q = asQuadratic(p)!;
      const zs = rationalZeroes(q);
      const directSum = zs.reduce((t, z) => t + toNumber(z), 0);
      const directProduct = zs.reduce((t, z) => t * toNumber(z), 1);
      expect(directSum).toBeCloseTo(toNumber(sumOfZeroes(q)), 9);
      expect(directProduct).toBeCloseTo(toNumber(productOfZeroes(q)), 9);
    }
  });
});

describe('scale freedom and the y-intercept', () => {
  it('keeps the zeroes under scaling while every coefficient changes', () => {
    expect(rationalZeroes(asQuadratic(P_SCALED)!).map(formatRational))
      .toEqual(rationalZeroes(asQuadratic(P_TWO)!).map(formatRational));
    expect(P_SCALED.coefficients).not.toEqual(P_TWO.coefficients);
    expect(yIntercept(P_SCALED)).not.toBe(yIntercept(P_TWO));
    expect(P_SCALED.coefficients).toEqual(P_TWO.coefficients.map((c) => c * 3));
  });

  it('constructs the monic quadratic from a sum and product', () => {
    const cases: Array<[number, number, number[]]> = [
      [5, 6, [6, -5, 1]],
      [-3, -10, [-10, 3, 1]],
      [7, 10, [10, -7, 1]],
      [-4, 3, [3, 4, 1]],
    ];
    for (const [S, P, coeffs] of cases) {
      const p = quadraticFromSumProduct(rational(S, 1), rational(P, 1));
      expect(p.coefficients, `S=${S} P=${P}`).toEqual(coeffs);
      // And its zeroes really do have that sum and product.
      const q = asQuadratic({ ...p, label: 'c' })!;
      expect(toNumber(sumOfZeroes(q))).toBeCloseTo(S, 9);
      expect(toNumber(productOfZeroes(q))).toBeCloseTo(P, 9);
    }
  });

  it('never presents the y-intercept as a zero', () => {
    for (const p of CANONICAL_POLYNOMIALS) {
      expect(yIntercept(p)).toBe(p.coefficients[0]);
      expect(evaluate(p, 0)).toBe(yIntercept(p));
      // The constant term is not a zero in any of these.
      const q = asQuadratic(p)!;
      for (const z of rationalZeroes(q)) expect(toNumber(z)).not.toBe(yIntercept(p));
    }
    const prose = CLASS10_POLYNOMIAL_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/y-intercept/i);
    expect(prose).toMatch(/is not a zero|not a zero/i);
  });

  it('says the zeroes do not determine the polynomial uniquely', () => {
    const prose = CLASS10_POLYNOMIAL_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/non-zero k|any non-zero/i);
    expect(prose).toMatch(/up to a non-zero scale factor|same zeroes/i);
  });
});

describe('wording and scope', () => {
  it('says "no real zeroes", never more', () => {
    for (const s of CLASS10_POLYNOMIAL_SECTIONS) {
      expect(auditRealZeroWording(blocks(s)), s.contentArtifactId).toEqual([]);
    }
    expect(auditRealZeroWording([['x', 'The polynomial has no zeroes.']]).length).toBe(1);
    expect(auditRealZeroWording([['x', 'The polynomial has no real zeroes.']])).toEqual([]);
  });

  it('uses "meets" rather than only "crosses"', () => {
    const prose = CLASS10_POLYNOMIAL_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/meets the x-axis/i);
    expect(prose).toMatch(/touch/i);
    // And the reason is stated.
    expect(prose).toMatch(/crosses.{0,120}(touch|exclude)/i);
  });

  it('teaches nothing outside the current chapter scope', () => {
    const prose = CLASS10_POLYNOMIAL_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).not.toMatch(/remainder theorem|factor theorem/i);
    expect(prose).not.toMatch(/complex (?:zero|root|number)|imaginary/i);
    // Cubic coefficient relations are out; cubics appear only for counting.
    for (const m of prose.matchAll(/.{0,80}cubic.{0,80}/gi)) {
      expect(m[0], 'cubic beyond counting zeroes').not.toMatch(/sum of (?:the )?zeroes|product of (?:the )?zeroes|\u2212b\/a|c\/a/i);
    }
    expect(prose).toMatch(/at most/i);
    expect(prose).not.toMatch(/degree (?:is |equals )?the number of (?:real )?zeroes/i);
  });

  it('does not claim polynomials are new in Class 10', () => {
    const prose = CLASS10_POLYNOMIAL_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/Class IX/);
    expect(prose).toMatch(/not new|already|have graphed|met polynomials/i);
  });
});

describe('rendering and governance', () => {
  it('states the reading in text, not only in the curve', () => {
    render(<PolynomialGraph spec={G_REPEATED} />);
    expect(screen.getAllByText(/touches the x-axis at one point/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not a zero/i).length).toBeGreaterThan(0);
    cleanup();
    render(<PolynomialGraph spec={G_NONE} />);
    expect(screen.getAllByText(/no real zeroes/i).length).toBeGreaterThan(0);
    cleanup();
    render(<PolynomialGraph spec={G_TWO} />);
    expect(screen.getAllByText(/meets the x-axis at two points/i).length).toBeGreaterThan(0);
    cleanup();
  });

  it('authors four lessons with correct Chapter 2 provenance', () => {
    expect(CLASS10_POLYNOMIAL_SECTIONS.length).toBe(4);
    for (const s of CLASS10_POLYNOMIAL_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch02');
      expect(['2.2', '2.3']).toContain(s.source.sectionNumber);
      expect([11, 18]).toContain(s.source.startPage);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
      for (const v of Object.values(s.visualsById)) expect(validateVisual(v)).toEqual([]);
    }
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_POLYNOMIAL_SECTIONS) {
      const whole = blocks(s).map(([, t]) => t).join(' ').toLowerCase() + ' ' + s.nextStep.toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(' ').slice(-1)[0];
        expect(whole.includes(v.term.toLowerCase()) || whole.includes(head), `${s.contentArtifactId}: ${v.term}`).toBe(true);
      }
      for (const w of s.workedExamples) {
        for (const step of w.steps) expect(step.reasoning.length, w.id).toBeGreaterThan(40);
      }
      for (const t of [...s.explanation, s.summary]) expect(t).not.toMatch(/TODO|TBD|placeholder|recheck/i);
    }
  });

  it('keeps its four lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.10 checkpoint 64 — Chapter 5 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const chapter2 = cat.chapters.find((c) => c.number === 2)!;
    expect(chapter2.lessons.length).toBe(4);
    for (const lesson of chapter2.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the eight earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    const waves = [CLASS10_TRIGONOMETRY_SECTIONS, CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      CLASS10_SIMILARITY_SECTIONS, CLASS10_QUADRATIC_SECTIONS, CLASS10_STATISTICS_SECTIONS,
      CLASS10_LINEAR_SYSTEM_SECTIONS, CLASS10_HEIGHTS_DISTANCES_SECTIONS, CLASS10_REAL_NUMBERS_SECTIONS];
    expect(waves.map((w) => w.length)).toEqual([4, 3, 6, 4, 8, 5, 3, 4]);
    for (const w of waves) for (const s of w) expect(s.contentArtifactVersion).toBe(1);
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
