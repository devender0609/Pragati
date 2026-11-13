/**
 * v0.84.0-c11.28 checkpoint 91 — Chapter 8, Sequences and Series.
 *
 * The frontier is §8.4.2. An infinite series must be the LIMIT OF PARTIAL
 * SUMS, not a finite sum with a large n — so the tests check that divergent
 * ratios get a named refusal rather than a number, and that the convergent
 * sum is backed by partial sums actually settling.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  arithmeticMean, compareAmGm, describeGeometricMean, describeInfinite,
  displayedTermsMatchRule, expandedTerms, finiteSeries, geometricMean,
  geometricProgression, gpSumByAddition, gpSumOfFirst, gpTerm, gpTerms,
  infiniteGeometricSum, insertArithmeticMeans, partialSums, partialSumsApproach,
  partialSumFigure, partialSumFigureMatchesModel, sequence, sumOf, termsOf,
  validateIndexedSequence, writeExpanded,
} from '../sequences';
import {
  C11_SEQ_SECTIONS, GP_CONSTANT, GP_DOUBLING, GP_GROWING, GP_HALVING,
  MEANS, SEQ_ODD, SER_ODD, V_DIVERGENT_SUMS, V_PARTIAL_SUMS,
} from '../sequencesClass11Sections';
import { validateVisual } from '../visualSpecification';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

describe('a sequence is a rule, not a list', () => {
  it('answers at any position without listing the earlier terms', () => {
    expect(termsOf(SEQ_ODD, 5)).toEqual([3, 5, 7, 9, 11]);
    expect(SEQ_ODD.termAt(50)).toBe(101);
    expect(SEQ_ODD.startsAt).toBe(1);
  });

  it('catches a displayed term that does not come from the rule', () => {
    expect(displayedTermsMatchRule(SEQ_ODD, [3, 5, 7, 9])).toEqual([]);
    expect(displayedTermsMatchRule(SEQ_ODD, [3, 5, 8, 9]))
      .toEqual(['term 3 is shown as 8 but the rule gives 7']);
  });

  it('refuses a malformed sequence', () => {
    expect(() => sequence('bad', 'x', (n) => n, 1.5)).toThrow(/whole-number index/);
    expect(() => sequence('bad', 'x', (n) => n, 1, 0)).toThrow(/whole number of terms/);
  });
});

describe('a series is a different object from a sequence', () => {
  it('agrees between sigma notation and the expanded sum', () => {
    expect(expandedTerms(SER_ODD)).toEqual([3, 5, 7, 9]);
    expect(writeExpanded(SER_ODD)).toBe('3 + 5 + 7 + 9');
    expect(sumOf(SER_ODD)).toBe(24);
    const squares = finiteSeries('sq', 'k', 1, 5, 'k²', (k) => k * k);
    expect(sumOf(squares)).toBe(expandedTerms(squares).reduce((a, b) => a + b, 0));
    expect(sumOf(squares)).toBe(55);
  });

  it('is typed separately — a sequence has no sum field and a series no termAt list', () => {
    expect('termAt' in SEQ_ODD).toBe(true);
    expect('from' in SEQ_ODD).toBe(false);
    expect('from' in SER_ODD && 'to' in SER_ODD).toBe(true);
  });

  it('rejects malformed sigma bounds rather than reordering them', () => {
    expect(() => finiteSeries('b', 'k', 5, 2, 'k', (k) => k)).toThrow(/below the lower bound/);
    expect(() => finiteSeries('b', 'k', 1.5, 4, 'k', (k) => k)).toThrow(/whole numbers/);
  });

  it('counts terms inclusively between the bounds', () => {
    expect(expandedTerms(finiteSeries('r', 'k', 3, 7, 'k', (k) => k))).toHaveLength(5);
  });
});

describe('arithmetic means come from the progression', () => {
  it('gives the mean and the spacing', () => {
    expect(arithmeticMean(4, 16)).toBe(10);
    expect(arithmeticMean(4, 16) - 4).toBe(16 - arithmeticMean(4, 16));
  });

  it('inserts means with n + 2 terms and n + 1 gaps', () => {
    expect(MEANS.totalTerms).toBe(MEANS.inserted.length + 2);
    expect(MEANS.inserted).toEqual([7, 10, 13]);
    expect(MEANS.progression.d).toBe(3);
    // The common difference is the rise over the GAPS, not over the means.
    expect(MEANS.progression.d).toBe((16 - 4) / (MEANS.inserted.length + 1));
  });

  it('refuses a non-positive number of means', () => {
    expect(() => insertArithmeticMeans(4, 16, 0)).toThrow(/positive whole number/);
  });
});

describe('a geometric progression is a sibling of the AP, not a rename', () => {
  it('generates terms forward from the ratio', () => {
    expect(gpTerms(GP_GROWING, 5)).toEqual([2, 6, 18, 54, 162]);
    // At n = 1 the rule must return the first term: r^0, not r.
    expect(gpTerm(GP_GROWING, 1)).toBe(GP_GROWING.a);
  });

  it('shrinks towards zero when the ratio is below 1 in size', () => {
    expect(gpTerms(GP_HALVING, 5)).toEqual([1, 0.5, 0.25, 0.125, 0.0625]);
  });

  it('refuses a first term of zero, from which no ratio can be read', () => {
    expect(() => geometricProgression('bad', 0, 3)).toThrow(/no ratio to speak of/);
  });
});

describe('the finite sum, checked against addition', () => {
  it('agrees with adding the generated terms', () => {
    for (const gp of [GP_GROWING, GP_HALVING, geometricProgression('neg', 3, -2)]) {
      for (let n = 1; n <= 6; n += 1) {
        const s = gpSumOfFirst(gp, n);
        expect(s.kind, `${gp.id} n=${n}`).toBe('sum');
        if (s.kind === 'sum') expect(s.value).toBeCloseTo(gpSumByAddition(gp, n), 9);
      }
    }
  });

  it('handles r = 1 by counting, never by dividing by zero', () => {
    const s = gpSumOfFirst(GP_CONSTANT, 4);
    expect(s).toEqual({ kind: 'sum', value: 20, via: 'constant_terms' });
    expect(gpSumByAddition(GP_CONSTANT, 4)).toBe(20);
    // And the formula branch is NOT the one taken.
    const other = gpSumOfFirst(GP_GROWING, 4);
    expect(other.kind === 'sum' && other.via).toBe('formula');
  });

  it('refuses a non-positive number of terms', () => {
    expect(gpSumOfFirst(GP_GROWING, 0).kind).toBe('undefined');
    expect(gpSumOfFirst(GP_GROWING, 2.5).kind).toBe('undefined');
  });
});

describe('an infinite series is the limit of partial sums', () => {
  it('builds the partial sums as a sequence in their own right', () => {
    expect(partialSums(GP_HALVING, 5)).toEqual([1, 1.5, 1.75, 1.875, 1.9375]);
    // Each partial sum is an ordinary finite sum.
    expect(partialSums(GP_HALVING, 3)[2]).toBeCloseTo(gpSumByAddition(GP_HALVING, 3), 9);
  });

  it('claims a sum only where the partial sums actually settle', () => {
    const r = infiniteGeometricSum(GP_HALVING);
    expect(r).toEqual({ kind: 'converges', sum: 2, condition: '|r| < 1' });
    const approach = partialSumsApproach(GP_HALVING, 2);
    expect(approach.settles).toBe(true);
    expect(approach.gapsShrink).toBe(true);
  });

  it('REFUSES a sum for every divergent ratio, by name', () => {
    for (const [r, pattern] of [[1, /never settling|grow/], [-1, /alternate/], [2, /without bound/], [-3, /without bound/]] as const) {
      const result = infiniteGeometricSum(geometricProgression(`d${r}`, 1, r));
      expect(result.kind, `r=${r}`).toBe('diverges');
      if (result.kind === 'diverges') expect(result.reason).toMatch(pattern);
      // Not Infinity, not NaN, not a very large number.
      expect(describeInfinite(result)).toMatch(/does not exist/);
      expect(describeInfinite(result)).not.toMatch(/Infinity|NaN|null/);
    }
  });

  it('does NOT equal the finite formula with a large n — it is a different computation', () => {
    // The finite formula answers for each n; the infinite sum is where those
    // answers head. For a divergent ratio the finite formula still returns a
    // number at every n, and the infinite result correctly returns none.
    const big = gpSumOfFirst(GP_DOUBLING, 40);
    expect(big.kind).toBe('sum');
    expect(infiniteGeometricSum(GP_DOUBLING).kind).toBe('diverges');
  });

  it('keeps convergent partial sums below the limit, approaching it', () => {
    const sums = partialSums(GP_HALVING, 20);
    expect(sums.every((s) => s < 2)).toBe(true);
    expect(sums[19]).toBeGreaterThan(sums[18]);
  });
});

describe('the geometric mean, exact and domain-bound', () => {
  it('stays exact rather than decimalised', () => {
    expect(describeGeometricMean(geometricMean(4, 9))).toBe('6');
    expect(describeGeometricMean(geometricMean(2, 3))).toBe('√6');
    expect(describeGeometricMean(geometricMean(4, 16))).toBe('8');
  });

  it('refuses non-positive inputs rather than rooting a product', () => {
    for (const [a, b] of [[-4, 9], [4, -9], [0, 9], [-2, -8]] as const) {
      const g = geometricMean(a, b);
      expect(g.kind, `${a},${b}`).toBe('outside_domain');
      // (-2)(-8) = 16 has a real root; the DOMAIN still refuses it.
      expect(describeGeometricMean(g)).toMatch(/positive numbers only/);
    }
  });
});

describe('the AM–GM relationship carries its domain', () => {
  it('holds for positive pairs, with equality only when they agree', () => {
    for (const [a, b] of [[4, 16], [2, 8], [1, 100], [5, 5]] as const) {
      const c = compareAmGm(a, b);
      expect(c.kind).toBe('compared');
      if (c.kind === 'compared') {
        expect(c.amAtLeastGm, `${a},${b}`).toBe(true);
        expect(c.equal).toBe(a === b);
      }
    }
  });

  it('refuses the comparison outside the positive domain', () => {
    expect(compareAmGm(-4, 16).kind).toBe('outside_domain');
    expect(compareAmGm(0, 16).kind).toBe('outside_domain');
  });

  it('keeps the positivity assumption in the lesson, not only the model', () => {
    const lesson = C11_SEQ_SECTIONS[6];
    const prose = [...lesson.explanation, lesson.summary].join(' ').toLowerCase();
    expect(prose).toMatch(/positive/);
  });
});

describe('the seven lessons', () => {
  it('authors exactly seven, in source page order', () => {
    expect(C11_SEQ_SECTIONS).toHaveLength(7);
    const pages = C11_SEQ_SECTIONS.map((s) => s.source.startPage);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
  });

  it('records subsection provenance under the parent section', () => {
    for (const [frag, sub] of [['s8_4_1', '8.4.1'], ['s8_4_2', '8.4.2']] as const) {
      const s = C11_SEQ_SECTIONS.find((x) => x.contentArtifactId.includes(frag))!;
      expect(s.source.sectionNumber).toBe('8.4');
      expect((s.source as { officialSubsectionNumber?: string }).officialSubsectionNumber).toBe(sub);
      expect(s.source.officialSectionId).toBe('ncert_kemh1_s8_4');
    }
  });

  it('keeps the FO8 special-sum formulae out of summative scope', () => {
    const prose = C11_SEQ_SECTIONS.flatMap((s) => [...s.explanation, s.summary, s.learningGoal]).join(' ').toLowerCase();
    expect(prose).not.toMatch(/sum of the first n natural numbers|sum of squares|sum of cubes|n\(n \+ 1\)\/2/);
    const ids = AUTHORED_CHAPTERS.flatMap((c) => c.sections()).map((s) => s.contentArtifactId);
    expect(ids.some((i) => /fo8|special_sum/.test(i))).toBe(false);
  });

  it('gives every lesson all five stages at version 1', () => {
    for (const s of C11_SEQ_SECTIONS) {
      expect(s.workedExamples.length).toBeGreaterThanOrEqual(3);
      expect(s.guidedPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.independentPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.reasoningApplication.length).toBeGreaterThanOrEqual(1);
      expect(s.contentArtifactVersion).toBe(1);
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });

  it('registers Chapter 8 in canonical order without inventing 5 or 11', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapters.map((x) => x.number)).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14]);
    expect(c.chapters.find((x) => x.number === 8)!.lessonCount).toBe(7);
    expect(c.chapters.reduce((n, x) => n + x.lessonCount, 0)).toBe(80);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.lessonCount).toBe(81);
    for (const absent of [5, 11]) expect(c.chapters.some((x) => x.number === absent)).toBe(false);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('builds no second AP or limit engine', () => {
    const src = require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../sequences.ts'), 'utf8'
    ) as string;
    expect(src).toMatch(/from '\.\/arithmeticProgression'/);
    expect(src).toMatch(/from '\.\/specialAngles'/);
    expect(src).not.toMatch(/function (limitOf|oneSidedLimit)\b/);
    expect(src).not.toMatch(/export type ArithmeticProgression/);
  });
});

describe('the partial sums are shown FORWARD from n = 1', () => {
  /**
   * The defect this replaced: SEQ-06 reused the two-sided limit table,
   * which sampled both sides of its target and opened with six "no value"
   * cells. A partial-sum sequence has no left side.
   */
  it('starts at the first index with a real value', () => {
    expect(V_PARTIAL_SUMS.rows[0]).toEqual({ n: 1, value: '1' });
    expect(V_PARTIAL_SUMS.rows.map((r) => r.n)).toEqual([1, 2, 3, 4, 5, 6]);
    for (const row of V_PARTIAL_SUMS.rows) {
      expect(row.value, `row ${row.n}`).not.toMatch(/no value|NaN|Infinity|undefined/i);
    }
  });

  it('takes every value from the model, and rejects drift', () => {
    expect(partialSumFigureMatchesModel(V_PARTIAL_SUMS, GP_HALVING)).toEqual([]);
    const tampered = { ...V_PARTIAL_SUMS, rows: V_PARTIAL_SUMS.rows.map((r, i) => (i === 2 ? { ...r, value: '9' } : r)) };
    expect(partialSumFigureMatchesModel(tampered, GP_HALVING))
      .toEqual(['row 3 shows 9 but the model gives 1.75']);
  });

  it('takes its limiting value from the convergence result', () => {
    expect(V_PARTIAL_SUMS.approaches).toBe('2');
    expect(V_PARTIAL_SUMS.divergenceReason).toBeUndefined();
  });

  it('represents a DIVERGENT sequence with no target and a named reason', () => {
    expect(V_DIVERGENT_SUMS.approaches).toBeUndefined();
    expect(V_DIVERGENT_SUMS.divergenceReason).toMatch(/without bound/);
    expect(V_DIVERGENT_SUMS.rows[0]).toEqual({ n: 1, value: '1' });
    // No fake target, no Infinity standing in for one.
    expect(JSON.stringify(V_DIVERGENT_SUMS)).not.toMatch(/Infinity|NaN/);
  });

  it('rejects a figure that does not start at 1 or runs out of order', () => {
    const late = { ...V_PARTIAL_SUMS, rows: [{ n: 0, value: '0' }, ...V_PARTIAL_SUMS.rows] };
    expect(validateIndexedSequence(late).some((e) => /starts at 1/.test(e))).toBe(true);
    const shuffled = { ...V_PARTIAL_SUMS, rows: [...V_PARTIAL_SUMS.rows].reverse() };
    expect(validateIndexedSequence(shuffled).length).toBeGreaterThan(0);
  });

  it('rejects a no-value cell, and a figure claiming both a limit and a reason', () => {
    const empty = { ...V_PARTIAL_SUMS, rows: [{ n: 1, value: 'no value' }] };
    expect(validateIndexedSequence(empty).some((e) => /never produces/.test(e))).toBe(true);
    const both = { ...V_PARTIAL_SUMS, divergenceReason: 'x' };
    expect(validateIndexedSequence(both).some((e) => /both a limit/.test(e))).toBe(true);
  });

  it('validates both figures through the shared validator', () => {
    for (const spec of [V_PARTIAL_SUMS, V_DIVERGENT_SUMS]) {
      expect(validateVisual(spec as never), spec.id).toEqual([]);
      expect(spec.altText.length).toBeGreaterThan(120);
      expect(spec.altText).not.toMatch(/\b(red|blue|green|colour|color)\b/i);
    }
    expect(validateIndexedSequence(partialSumFigure('x', GP_HALVING, 3, 'a long enough accessible description here'))).toEqual([]);
  });

  it('renders both figures in the lesson, with real table semantics', () => {
    __setAuthoredLearnPreviewForTests(true);
    const lesson = C11_SEQ_SECTIONS[5];
    const { container } = render(
      <LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />
    );
    const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
    if (seeIt) fireEvent.click(seeIt);
    const figures = container.querySelectorAll('[data-visual-kind="indexed_sequence"]');
    expect(figures).toHaveLength(2);
    const first = figures[0];
    // Headed columns, not positions on a screen.
    expect([...first.querySelectorAll('th[scope="col"]')].map((n) => n.textContent)).toEqual(['n', 'S_n']);
    const values = [...first.querySelectorAll('td')].map((n) => n.textContent);
    expect(values[0]).toBe('1');
    expect(values).not.toContain('no value');
    expect(first.textContent).toContain('closer to 2');
    expect(figures[1].textContent).toMatch(/no sum/);
    __setAuthoredLearnPreviewForTests(null);
  });
});
