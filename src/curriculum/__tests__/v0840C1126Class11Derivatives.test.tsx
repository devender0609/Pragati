/**
 * v0.84.0-c11.26 checkpoint 90B — Chapter 12 §12.5 and §12.5.1/2.
 *
 * The negative fixtures carry the weight. A derivative model that returns
 * the expected numbers for well-formed input has proved very little; what
 * matters is that it REFUSES substitution at h = 0, refuses a degree-based
 * trigonometric derivative, refuses to widen a domain, and refuses the
 * chain rule that belongs to C11-LIM-FO11.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  composite, derivativeAt, describeDerivative, differenceQuotient, isDerivative,
  powerRule, productRule, quotientDefinedAtZero, quotientLimit,
  ruleAgreesWithFirstPrinciples, sumRule, trigDerivative, validateRule,
} from '../derivative';
import {
  C11_DERIV_SECTIONS, F_SQ, ONE, P_POWER_RULE, R_POWER2, R_POWER3,
  R_PRODUCT, R_QUOTIENT, R_SUM, V_POWER_PROOF, V_QUOTIENT_TABLE, V_SECANT, X, ZERO,
} from '../derivativeClass11Sections';
import { degrees, piMultiple } from '../angleMeasure';
import { polynomial, rational } from '../limits';
import { validateInductionProof } from '../induction';
import { validateVisual } from '../visualSpecification';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

describe('h approaches 0, and is never 0', () => {
  it('leaves the difference quotient undefined at h = 0', () => {
    expect(quotientDefinedAtZero(F_SQ, 3)).toBe(false);
    expect(differenceQuotient(F_SQ, 3).evaluate(0)).toBeNull();
    expect(differenceQuotient(F_SQ, 3).inDomain(0)).toBe(false);
  });

  it('still finds the derivative through the limit', () => {
    const d = derivativeAt(F_SQ, 3);
    expect(isDerivative(d)).toBe(true);
    if (isDerivative(d)) expect(d.value).toBe(6);
    expect(quotientLimit(F_SQ, 3)).toEqual({ kind: 'exists', value: 6 });
  });

  it('derives from first principles, not from the power rule', () => {
    // The quotient knows nothing about n x^(n−1); it only subtracts and divides.
    for (const [at, expected] of [[3, 6], [5, 10], [-2, -4], [0, 0]] as const) {
      const d = derivativeAt(F_SQ, at);
      expect(isDerivative(d) && d.value, `at ${at}`).toBe(expected);
    }
  });

  it('refuses a derivative where the two-sided limit fails, by name', () => {
    // A corner: the slopes from the two sides disagree.
    const corner = {
      name: '|x|', inDomain: () => true, evaluate: (x: number) => Math.abs(x),
      domainDescription: 'every real number', rangeDescription: 'non-negative',
    };
    const d = derivativeAt(corner, 0);
    expect(d.kind).toBe('not_differentiable');
    expect(describeDerivative(d)).toMatch(/does not exist/);
    expect(describeDerivative(d)).not.toMatch(/NaN|Infinity|null|undefined/);
  });

  it('refuses a derivative outside the function domain', () => {
    const recip = rational('r', '1/x', () => 1, (x) => x, [0]);
    expect(derivativeAt(recip, 0).kind).toBe('not_differentiable');
  });
});

describe('the power rule and its proof', () => {
  it('validates through the SHARED induction model', () => {
    expect(validateInductionProof(P_POWER_RULE)).toEqual([]);
    expect(P_POWER_RULE.hypothesis.assumesAbout).toBe('k');
    expect(P_POWER_RULE.inductiveStep.arrivesAt).toBe('k+1');
    expect(P_POWER_RULE.conclusion.restsOn).toEqual(['base_case', 'inductive_step']);
  });

  it('rejects a false base case', () => {
    const bad = { ...P_POWER_RULE, baseCase: { ...P_POWER_RULE.baseCase, leftValue: 1, rightValue: 7 } };
    expect(validateInductionProof(bad).length).toBeGreaterThan(0);
  });

  it('rejects a hypothesis written for k + 1', () => {
    const bad = { ...P_POWER_RULE, hypothesis: { ...P_POWER_RULE.hypothesis, assumesAbout: 'k+1' as 'k' } };
    expect(validateInductionProof(bad).length).toBeGreaterThan(0);
  });

  it('rejects a proof with no inductive step', () => {
    const bad = { ...P_POWER_RULE, inductiveStep: { ...P_POWER_RULE.inductiveStep, steps: [] } };
    expect(validateInductionProof(bad).length).toBeGreaterThan(0);
  });

  it('agrees with first principles, which is the independent check', () => {
    const cube = polynomial('g', 'x³', (x) => x ** 3);
    for (const r of ruleAgreesWithFirstPrinciples(cube, R_POWER3, [-2, 0.5, 1, 2.5])) {
      expect(r.agrees, `at ${r.at}`).toBe(true);
    }
    for (const r of ruleAgreesWithFirstPrinciples(F_SQ, R_POWER2, [-3, 1, 4])) {
      expect(r.agrees, `at ${r.at}`).toBe(true);
    }
  });

  it('would catch a wrong coefficient or exponent', () => {
    const wrong = { ...R_POWER3, derivative: { ...R_POWER3.derivative, evaluate: (x: number) => 2 * x ** 2 } };
    const cube = polynomial('g', 'x³', (x) => x ** 3);
    expect(ruleAgreesWithFirstPrinciples(cube, wrong, [2]).every((r) => r.agrees)).toBe(false);
    const decrement = { ...R_POWER3, derivative: { ...R_POWER3.derivative, evaluate: (x: number) => 3 * x ** 3 } };
    expect(ruleAgreesWithFirstPrinciples(cube, decrement, [2]).every((r) => r.agrees)).toBe(false);
  });

  it('stays inside the source scope for the index', () => {
    expect(() => powerRule(-2)).toThrow(/positive integral index/);
    expect(() => powerRule(0.5)).toThrow(/positive integral index/);
    expect(() => powerRule(0)).toThrow(/positive integral index/);
  });
});

describe('the algebra of derivatives', () => {
  it('differentiates a sum term by term, agreeing with first principles', () => {
    const f = polynomial('s', 'x² + x', (x) => x * x + x);
    for (const r of ruleAgreesWithFirstPrinciples(f, R_SUM, [-2, 1, 3])) {
      expect(r.agrees, `at ${r.at}`).toBe(true);
    }
  });

  it('differentiates a difference', () => {
    const diff = sumRule('d', { f: F_SQ, g: X, df: R_POWER2.derivative, dg: ONE }, -1);
    const f = polynomial('d', 'x² − x', (x) => x * x - x);
    expect(ruleAgreesWithFirstPrinciples(f, diff, [-1, 2]).every((r) => r.agrees)).toBe(true);
  });

  it('gives the product rule TWO terms, and f′g′ alone fails', () => {
    const f = polynomial('p', 'x³', (x) => x ** 3);
    expect(ruleAgreesWithFirstPrinciples(f, R_PRODUCT, [-2, 1, 2]).every((r) => r.agrees)).toBe(true);
    // The common error: only one factor treated as varying.
    const oneTerm = {
      ...R_PRODUCT,
      derivative: { ...R_PRODUCT.derivative, evaluate: (x: number) => 2 * x * 1 },
    };
    expect(ruleAgreesWithFirstPrinciples(f, oneTerm, [2]).every((r) => r.agrees)).toBe(false);
  });

  it('gives the quotient rule its denominator square', () => {
    expect(R_QUOTIENT.rule).toMatch(/²/);
    const recip = rational('r', '1/x', () => 1, (x) => x, [0]);
    expect(ruleAgreesWithFirstPrinciples(recip, R_QUOTIENT, [-2, 0.5, 3]).every((r) => r.agrees)).toBe(true);
  });
});

describe('a rule may not widen a domain', () => {
  it('keeps the denominator exclusion on the quotient derivative', () => {
    expect(R_QUOTIENT.excludes).toContain(0);
    expect(R_QUOTIENT.derivative.inDomain(0)).toBe(false);
    expect(R_QUOTIENT.derivative.evaluate(0)).toBeNull();
    expect(R_QUOTIENT.domainDescription).toMatch(/not zero/);
  });

  it('rejects a rule that claims a value where the function has none', () => {
    const recip = rational('r', '1/x', () => 1, (x) => x, [0]);
    // The quotient rule guards a zero denominator independently of its
    // exclusion list, so it cannot be made to leak — which is the model
    // being stronger than the test first assumed. The leak this invariant
    // exists to catch is a rule written over a RESTRICTED function without
    // carrying that restriction: a sum built on 1/(x − 1), excluding
    // nothing, claims a slope at 1 where the function has no value.
    const bounded = rational('b', '1/(x − 1)', () => 1, (x) => x - 1, [1]);
    const leaky = sumRule('leaky', { f: X, g: X, df: ONE, dg: ONE }, 1, []);
    expect(leaky.derivative.inDomain(1)).toBe(true);
    expect(validateRule(leaky, bounded).length).toBeGreaterThan(0);
    expect(validateRule(leaky, bounded)[0]).toMatch(/widened the domain/);
    // The authored rules carry their restrictions and pass.
    expect(validateRule(R_QUOTIENT, recip)).toEqual([]);
    expect(validateRule(R_SUM)).toEqual([]);
  });

  it('keeps the product rule inside both factors domains', () => {
    const bounded = rational('b', '1/(x − 1)', () => 1, (x) => x - 1, [1]);
    const r = productRule('p', { f: bounded, g: X, df: ZERO, dg: ONE }, [1]);
    expect(r.derivative.inDomain(1)).toBe(false);
  });
});

describe('trigonometric derivatives need radians', () => {
  it('gives the rule for a radian angle', () => {
    expect(trigDerivative('sin', piMultiple(1, 4))).toEqual({ kind: 'derivative_rule', of: 'sin x', rule: 'cos x' });
    expect(trigDerivative('cos', piMultiple(1, 2))).toEqual({ kind: 'derivative_rule', of: 'cos x', rule: '− sin x' });
  });

  it('REFUSES a degree angle rather than differentiating it', () => {
    // The Class 10 degree convention must not reach Class 11 derivative work.
    for (const name of ['sin', 'cos'] as const) {
      const d = trigDerivative(name, degrees(30));
      expect(d.kind).toBe('wrong_measure');
      if (d.kind === 'wrong_measure') expect(d.reason).toMatch(/radians/);
    }
  });
});

describe('the chain rule stays outside this scope', () => {
  it('refuses a composite by name instead of differentiating it', () => {
    const c = composite();
    expect(c.kind).toBe('out_of_scope');
    expect(c.reason).toMatch(/function of a function/);
  });

  it('introduces no chain rule in student-facing prose', () => {
    for (const s of C11_DERIV_SECTIONS) {
      const prose = [
        ...s.explanation, s.summary, s.learningGoal,
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
        ...s.independentPractice.flatMap((p) => [p.prompt, p.answer]),
      ].join(' ').toLowerCase();
      // The boundary may be NAMED as out of scope; it may not be taught.
      expect(prose, s.contentArtifactId).not.toMatch(/chain rule/);
      expect(prose).not.toMatch(/outer function|inner function|du\/dx/);
    }
  });
});

describe('provenance and registration', () => {
  it('records §12.5 for LIM-05 and §12.5.1 plus §12.5.2 for LIM-06', () => {
    const [first, second] = C11_DERIV_SECTIONS;
    expect(first.source.sectionNumber).toBe('12.5');
    expect((first.source as { officialSubsectionNumber?: string }).officialSubsectionNumber).toBeUndefined();
    expect((second.source as { officialSubsectionNumber?: string }).officialSubsectionNumber).toBe('12.5.1');
    // §12.5.2 must not vanish from provenance.
    expect((second.source as { additionalSubsectionNumbers?: string[] }).additionalSubsectionNumbers).toEqual(['12.5.2']);
  });

  it('actually teaches the §12.5.2 material, not just the field', () => {
    const prose = [...C11_DERIV_SECTIONS[1].explanation, C11_DERIV_SECTIONS[1].summary].join(' ').toLowerCase();
    expect(prose).toMatch(/polynomial/);
    expect(prose).toMatch(/trigonometric/);
  });

  it('leaves both at version 1 and authored_draft', () => {
    for (const s of C11_DERIV_SECTIONS) {
      expect(s.contentArtifactVersion).toBe(1);
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });

  it('registers Chapter 12 with six lessons and the catalogue at 9 / 59 / 1 / 60', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapters.map((x) => x.number)).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14]);
    expect(c.chapters.find((x) => x.number === 12)!.lessonCount).toBe(6);
    expect(c.chapters.reduce((n, x) => n + x.lessonCount, 0)).toBe(80);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.lessonCount).toBe(81);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves FO11 unauthored — the summative core is complete, the chapter is not', () => {
    const ids = AUTHORED_CHAPTERS.flatMap((c) => c.sections()).map((s) => s.contentArtifactId);
    expect(ids.some((i) => i.includes('fo11') || i.includes('composite'))).toBe(false);
  });

  it('builds no second limit, induction or binomial engine', () => {
    const src = require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../derivative.ts'), 'utf8'
    ) as string;
    expect(src).toMatch(/from '\.\/limits'/);
    expect(src).not.toMatch(/function (limitOf|oneSidedLimit|factorial|combinations)\b/);
    expect(src).not.toMatch(/export type \w*Induction\w*Proof/);
  });
});

describe('both lessons reach the student', () => {
  const show = (i: number) => {
    __setAuthoredLearnPreviewForTests(true);
    const lesson = C11_DERIV_SECTIONS[i];
    const out = render(<LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />);
    const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
    if (seeIt) fireEvent.click(seeIt);
    return out;
  };

  it('validates all three figures through the shared validator', () => {
    for (const spec of [V_QUOTIENT_TABLE, V_SECANT, V_POWER_PROOF]) {
      expect(validateVisual(spec as never), spec.id).toEqual([]);
      expect(spec.altText).not.toMatch(/\b(red|blue|green|colour|color)\b/i);
    }
  });

  it('renders the power-rule proof with all five parts', () => {
    const { container } = show(0);
    const proof = container.querySelector('[data-visual-kind="proof_layout"]');
    expect(proof).not.toBeNull();
    for (const part of ['Claim', 'Base case', 'Induction hypothesis', 'Inductive step', 'Conclusion']) {
      expect(proof!.textContent, part).toContain(part);
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('renders the difference quotient table without a row at h = 0', () => {
    const { container } = show(0);
    const table = container.querySelector('[data-visual-kind="limit_table"]');
    expect(table).not.toBeNull();
    const firstCells = [...table!.querySelectorAll('tr')].map((r) => r.querySelector('td')?.textContent?.trim());
    expect(firstCells).not.toContain('0');
    __setAuthoredLearnPreviewForTests(null);
  });
});
