/**
 * v0.84.0-c11.17 checkpoint 86A — Chapter 12 limits foundation.
 *
 * The governing question is whether a limit can be represented as behaviour
 * NEAR a point, independently of the value AT it. Every existence test
 * therefore carries a nonexistence fixture, because a model that always
 * returns a number has not represented a limit at all.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  approachTo, averageRateOfChange, cancellingCase, cancellingCaseErrors,
  compareValueWithLimit, describeLimit, directSubstitutionValid, limitOf,
  limitingSecantSlope, oneSidedLimit, secantGraph, tableMatchesFunction, validateLimitTable,
  validateSecantGraph, valueAt,
} from '../limits';
import {
  C11_LIM_SECTIONS, CANONICAL_LIMIT_VISUALS, F_BLOWUP, F_EXP, F_HOLE, F_LOG, F_POLY,
  F_SIGNUM, F_SIMPLE, F_SINC, F_SQUARE, V_SECANT, V_TABLE_DNE, V_TABLE_HOLE,
} from '../limitsClass11Sections';
import { validateVisual } from '../visualSpecification';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

describe('a limit is behaviour near a point, not the value at it', () => {
  it('never lands on the target while approaching it', () => {
    const a = approachTo(F_SQUARE, 2);
    expect(a.includesTarget).toBe(false);
    expect(a.steps.some((s) => s.x === 2)).toBe(false);
    expect(a.steps.some((s) => s.side === 'left')).toBe(true);
    expect(a.steps.some((s) => s.side === 'right')).toBe(true);
  });

  it('finds a limit where the function has NO value', () => {
    expect(valueAt(F_HOLE, 1)).toBeNull();
    const lim = limitOf(F_HOLE, 1);
    expect(lim.kind).toBe('exists');
    if (lim.kind === 'exists') expect(lim.value).toBeCloseTo(2, 6);
    expect(compareValueWithLimit(F_HOLE, 1).kind).toBe('undefined_but_limit_exists');
  });

  it('reports nonexistence as a named state, never NaN, Infinity or null', () => {
    const dne = limitOf(F_SIGNUM, 0);
    expect(dne.kind).toBe('does_not_exist');
    if (dne.kind === 'does_not_exist') {
      expect(dne.reason).toMatch(/left|right|settle|bound/);
      expect(dne.reason).not.toMatch(/NaN|Infinity|null|undefined/);
    }
    // The student-facing wording carries no runtime value either.
    expect(describeLimit(dne)).not.toMatch(/NaN|Infinity|null|undefined/);
  });

  it('refuses a two-sided limit when the sides disagree', () => {
    const l = oneSidedLimit(F_SIGNUM, 0, 'left');
    const r = oneSidedLimit(F_SIGNUM, 0, 'right');
    expect(l.kind).toBe('exists');
    expect(r.kind).toBe('exists');
    if (l.kind === 'exists' && r.kind === 'exists') expect(l.value).not.toBeCloseTo(r.value, 3);
    // Both sides exist, yet the two-sided limit must not.
    expect(limitOf(F_SIGNUM, 0).kind).toBe('does_not_exist');
    expect(compareValueWithLimit(F_SIGNUM, 0).kind).toBe('defined_but_no_limit');
  });

  it('reports nonexistence when the values grow without bound', () => {
    expect(valueAt(F_BLOWUP, 1)).toBeNull();
    expect(limitOf(F_BLOWUP, 1).kind).toBe('does_not_exist');
  });

  it('keeps the value at a point a separate question from the limit', () => {
    // Agreeing is a fact about THIS function, not the definition of a limit.
    expect(compareValueWithLimit(F_SQUARE, 2).kind).toBe('agree');
    expect(compareValueWithLimit(F_POLY, 2).kind).toBe('agree');
    // The same machinery reports disagreement and absence without special-casing.
    expect(compareValueWithLimit(F_HOLE, 1).kind).toBe('undefined_but_limit_exists');
    expect(compareValueWithLimit(F_SIGNUM, 0).kind).toBe('defined_but_no_limit');
  });
});

describe('rate of change reuses the slope idea', () => {
  it('computes the average rate as the secant slope', () => {
    const r = averageRateOfChange(F_SQUARE, 1, 3);
    expect(r.kind).toBe('slope');
    if (r.kind === 'slope') expect(r.value).toBeCloseTo(4, 6);
  });

  it('refuses an interval of zero width rather than dividing by zero', () => {
    const r = averageRateOfChange(F_SQUARE, 2, 2);
    expect(r.kind).toBe('undefined');
    if (r.kind === 'undefined') expect(r.reason).toMatch(/zero width/);
  });

  it('derives the tangent slope as the limit of secant slopes', () => {
    for (const [at, expected] of [[1, 2], [3, 6], [0, 0]] as const) {
      const s = limitingSecantSlope(F_SQUARE, at);
      expect(s.kind, `at ${at}`).toBe('exists');
      if (s.kind === 'exists') expect(s.value).toBeCloseTo(expected, 4);
    }
  });

  it('builds a secant figure whose slopes close in on the tangent', () => {
    expect(V_SECANT.movers.map((m) => m.slope)).toEqual([4, 3, 2.5]);
    expect(V_SECANT.limitingSlope.kind).toBe('exists');
    if (V_SECANT.limitingSlope.kind === 'exists') expect(V_SECANT.limitingSlope.value).toBeCloseTo(2, 4);
    // Each secant is less steep than the last as the point closes in.
    const slopes = V_SECANT.movers.map((m) => m.slope);
    expect(slopes.every((s, i) => i === 0 || s < slopes[i - 1])).toBe(true);
  });

  it('rejects a secant figure whose moving point sits on the anchor', () => {
    expect(() => secantGraph('x', F_SQUARE, 'y = x²', 1, [1], 'alt')).not.toThrow();
    const bad = { ...V_SECANT, movers: [{ x: 1, y: 1, slope: 0 }] };
    expect(validateSecantGraph(bad)).toContain('a moving point must not sit on the anchor — the secant would have no second point');
  });
});

describe('polynomials, rationals and the hole that survives cancelling', () => {
  it('allows direct substitution only inside the domain', () => {
    expect(directSubstitutionValid(F_POLY, 2)).toBe(true);
    expect(directSubstitutionValid(F_HOLE, 1)).toBe(false);
    expect(directSubstitutionValid(F_BLOWUP, 1)).toBe(false);
  });

  it('keeps the hole after cancelling', () => {
    const c = cancellingCase(F_HOLE, F_SIMPLE, 1);
    expect(c.agreesAwayFromHole).toBe(true);
    // The whole point: the original stays undefined, the simplified does not.
    expect(c.originalDefinedAtHole).toBe(false);
    expect(c.simplifiedDefinedAtHole).toBe(true);
    expect(cancellingCaseErrors(c)).toEqual([]);
    expect(c.limit.kind).toBe('exists');
  });

  it('rejects a claimed cancelling case that does not agree away from the hole', () => {
    const wrong = cancellingCase(F_HOLE, F_SQUARE, 1);
    expect(cancellingCaseErrors(wrong))
      .toContain('the simplified expression must agree with the original away from the hole');
  });

  it('gives the two expressions the same limit but different domains', () => {
    const a = limitOf(F_HOLE, 1), b = limitOf(F_SIMPLE, 1);
    expect(a.kind).toBe('exists'); expect(b.kind).toBe('exists');
    if (a.kind === 'exists' && b.kind === 'exists') expect(a.value).toBeCloseTo(b.value, 6);
    expect(valueAt(F_HOLE, 1)).toBeNull();
    expect(valueAt(F_SIMPLE, 1)).toBe(2);
  });
});

describe('the standard transcendental limits, in radians', () => {
  it('gives sin x / x the limit 1 while the function has no value at 0', () => {
    expect(valueAt(F_SINC, 0)).toBeNull();
    const s = limitOf(F_SINC, 0);
    expect(s.kind).toBe('exists');
    if (s.kind === 'exists') expect(s.value).toBeCloseTo(1, 5);
  });

  it('would not give 1 if the angle were read as degrees', () => {
    // The same quotient with x taken as a degree measure settles elsewhere,
    // which is why the angle unit is part of the mathematics.
    const degrees = {
      name: 'sinDeg', inDomain: (x: number) => x !== 0,
      evaluate: (x: number) => (x === 0 ? null : Math.sin((x * Math.PI) / 180) / x),
      domainDescription: 'x not zero', rangeDescription: 'degree quotient',
    };
    const d = limitOf(degrees, 0);
    expect(d.kind).toBe('exists');
    if (d.kind === 'exists') expect(d.value).not.toBeCloseTo(1, 2);
  });

  it('gives the exponential and logarithmic standard limits', () => {
    for (const f of [F_EXP, F_LOG]) {
      expect(valueAt(f, 0)).toBeNull();
      const r = limitOf(f, 0);
      expect(r.kind, f.name).toBe('exists');
      if (r.kind === 'exists') expect(r.value).toBeCloseTo(1, 4);
    }
  });
});

describe('tables and figures come from the same function', () => {
  it('derives every table row from the function', () => {
    expect(validateLimitTable(V_TABLE_HOLE)).toEqual([]);
    expect(tableMatchesFunction(V_TABLE_HOLE, F_HOLE)).toEqual([]);
    expect(V_TABLE_HOLE.valueAtTarget).toBeNull();
  });

  it('rejects a table whose rows were authored independently', () => {
    const tampered = {
      ...V_TABLE_HOLE,
      approach: {
        ...V_TABLE_HOLE.approach,
        steps: V_TABLE_HOLE.approach.steps.map((s, i) => (i === 0 ? { ...s, value: 99 } : s)),
      },
    };
    expect(tableMatchesFunction(tampered, F_HOLE).length).toBeGreaterThan(0);
  });

  it('rejects a table that includes the target itself', () => {
    const bad = {
      ...V_TABLE_HOLE,
      approach: { ...V_TABLE_HOLE.approach, steps: [{ x: 1, value: null, side: 'left' as const }] },
    };
    expect(validateLimitTable(bad))
      .toContain('an approach must not include the target itself — x approaches a, it never equals a');
  });

  it('carries a nonexistence table as well as an existence one', () => {
    expect(V_TABLE_DNE.result.kind).toBe('does_not_exist');
    expect(V_TABLE_HOLE.result.kind).toBe('exists');
  });

  it('validates every canonical figure through the shared validator', () => {
    for (const v of CANONICAL_LIMIT_VISUALS) {
      expect(validateVisual(v as never), v.id).toEqual([]);
      expect(v.altText.length).toBeGreaterThan(80);
      expect(v.altText).not.toMatch(/\b(red|blue|green|colour|color)\b/i);
    }
  });
});

describe('the four authored lessons', () => {
  it('authors exactly four, in source order', () => {
    expect(C11_LIM_SECTIONS).toHaveLength(4);
    const pages = C11_LIM_SECTIONS.map((s) => s.source.startPage);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
  });

  it('does NOT author the units blocked by the induction prerequisite', () => {
    // Student-facing prose only. The `sequence.mustNotIntroduce` field names
    // the blocked topics on purpose — that declaration is the boundary
    // working, not a leak of it.
    const text = C11_LIM_SECTIONS.flatMap((s) => [
      ...s.explanation,
      s.summary, s.nextStep, s.learningGoal,
      ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.flatMap((t) => [t.text, t.reasoning])]),
      ...s.guidedPractice.flatMap((g) => [g.prompt, g.answer]),
      ...s.independentPractice.flatMap((i) => [i.prompt, i.answer]),
      ...s.reasoningApplication.flatMap((r) => [r.prompt, r.expectedReasoning]),
    ]).join(' ').toLowerCase();
    // LIM-05, LIM-06 and FO11 are blocked; no lesson may stand in for them.
    expect(C11_LIM_SECTIONS.some((s) => s.source.sectionNumber === '12.5')).toBe(false);
    expect(C11_LIM_SECTIONS.some((s) => s.contentArtifactId.includes('12_5'))).toBe(false);
    expect(text).not.toContain('first principles');
    expect(text).not.toContain('chain rule');
    expect(text).not.toContain('product rule');
    expect(text).not.toContain('quotient rule');
    // And induction is not quietly embedded to unblock them.
    expect(text).not.toContain('induction');
  });

  it('records the subsection under its parent, inventing no section id', () => {
    const s = C11_LIM_SECTIONS.find((x) => x.contentArtifactId.includes('12_3_1'))!;
    expect(s.source.sectionNumber).toBe('12.3');
    expect((s.source as { officialSubsectionNumber?: string }).officialSubsectionNumber).toBe('12.3.1');
    expect(s.source.officialSectionId).toBe('ncert_kemh1_s12_3');
  });

  it('gives every lesson all five stages', () => {
    for (const s of C11_LIM_SECTIONS) {
      expect(s.workedExamples.length, s.contentArtifactId).toBeGreaterThanOrEqual(3);
      expect(s.guidedPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.independentPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.reasoningApplication.length).toBeGreaterThanOrEqual(1);
      expect(s.explanation.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('leaves every artifact at version 1 and authored_draft', () => {
    for (const s of C11_LIM_SECTIONS) {
      expect(s.contentArtifactVersion).toBe(1);
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });

  it('registers the chapter so Class 11 holds 51 lessons in order 1,2,3,4,9,10,12', () => {
    const c11 = AUTHORED_CHAPTERS.filter((c) => c.officialChapterId.includes('kemh1'));
    expect(c11.reduce((n, c) => n + c.sections().length, 0)).toBe(51);
    const ids = c11.flatMap((c) => c.sections()).map((s) => s.contentArtifactId);
    expect(new Set(ids).size).toBe(51);
    // No placeholder Chapter 11 is invented to fill the gap.
    expect(c11.some((c) => c.officialChapterId.endsWith('ch11'))).toBe(false);
    const strays = AUTHORED_CHAPTERS
      .filter((c) => !c.officialChapterId.includes('kemh1'))
      .flatMap((c) => c.sections())
      .filter((s) => s.contentArtifactId.includes('kemh1'));
    expect(strays).toEqual([]);
  });

  it('writes no duplicated hint across the corpus', () => {
    const hints = AUTHORED_CHAPTERS
      .flatMap((c) => c.sections())
      .flatMap((s) => s.guidedPractice.map((g) => (g as { hint?: string }).hint))
      .filter((h): h is string => Boolean(h))
      .map((h) => h.trim().toLowerCase());
    expect([...new Set(hints.filter((h, i) => hints.indexOf(h) !== i))]).toEqual([]);
  });
});

describe('limit figures reach the student through the real product', () => {
  const show = (lesson: typeof C11_LIM_SECTIONS[number]) => {
    __setAuthoredLearnPreviewForTests(true);
    const out = render(<LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />);
    const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
    if (seeIt) fireEvent.click(seeIt);
    return out;
  };

  it('renders the secant figure with its secants and tangent', () => {
    show(C11_LIM_SECTIONS[0]);
    const fig = screen.getAllByRole('img').filter((n) => (n.getAttribute('aria-label') || '').length > 80);
    expect(fig.length).toBeGreaterThan(0);
    // One polyline for the curve, one dashed line per secant, one tangent.
    expect(fig[0].querySelectorAll('line').length).toBeGreaterThanOrEqual(4);
  });

  it('renders the approach table with a hole said in words', () => {
    const { container } = show(C11_LIM_SECTIONS[1]);
    const text = container.textContent ?? '';
    expect(container.querySelectorAll('table').length).toBeGreaterThanOrEqual(2);
    expect(text).toContain('no value');
    // A nonexistent limit must read as words, never as a runtime value.
    expect(text).toMatch(/does not exist/);
    expect(text).not.toMatch(/NaN|Infinity|undefined|\bnull\b/);
    __setAuthoredLearnPreviewForTests(null);
  });
});
