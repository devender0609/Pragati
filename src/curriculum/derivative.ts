// ===========================================================================
// v0.84.0-c11.26 checkpoint 90 — THE DERIVATIVE, BUILT ON THE LIMIT.
//
// Checkpoint 86 already modelled the limiting secant slope. That IS the
// derivative at a point, so this file does not re-derive it: it names it,
// separates the derivative AT A POINT from the derivative AS A FUNCTION,
// and adds the source's rules on top.
//
// WHAT IS NOT HERE
//
// No second limit model — `limitOf` and `limitingSecantSlope` are imported.
// No symbolic algebra system. The rules cover the source's families
// (polynomials, and the trigonometric derivatives §12.5.2 states) and
// REFUSE anything else rather than pretending. No chain rule: composite
// derivatives are C11-LIM-FO11, formative-only, and a refusal here is the
// boundary being kept rather than a gap.
// ===========================================================================

import type { Angle } from './angleMeasure';
import type { RealFunctionContract } from './relationsFunctions';
import { type LimitResult, limitOf, limitingSecantSlope, valueAt } from './limits';

/**
 * A derivative, or a named reason there is none. Never NaN, Infinity or
 * null in anything a student reads.
 */
export type DerivativeResult =
  | { kind: 'derivative'; value: number }
  | { kind: 'not_differentiable'; reason: string };

export const isDerivative = (d: DerivativeResult): d is { kind: 'derivative'; value: number } =>
  d.kind === 'derivative';

export const describeDerivative = (d: DerivativeResult): string =>
  d.kind === 'derivative' ? String(d.value) : `the derivative does not exist, because ${d.reason}`;

/**
 * The difference quotient as a function OF h, for one function and one
 * point.
 *
 * h = 0 is outside its domain by construction. That is the whole point of
 * the lesson: the quotient is undefined there, and the derivative is the
 * limit as h approaches 0 — never the value at 0.
 */
export function differenceQuotient(f: RealFunctionContract, at: number): RealFunctionContract {
  return {
    name: `[${f.name}(${at} + h) − ${f.name}(${at})] / h`,
    inDomain: (h) => h !== 0 && f.inDomain(at) && f.inDomain(at + h),
    evaluate: (h) => {
      if (h === 0) return null;
      const here = valueAt(f, at), there = valueAt(f, at + h);
      return here === null || there === null ? null : (there - here) / h;
    },
    domainDescription: 'every non-zero h for which both points have values',
    rangeDescription: 'the slopes of the chords from the point',
  };
}

/** h = 0 is excluded, and this states it rather than leaving it implied. */
export const quotientDefinedAtZero = (f: RealFunctionContract, at: number): boolean =>
  differenceQuotient(f, at).inDomain(0);

/**
 * f′(a) — the derivative AT A POINT, as the limit of the difference
 * quotient. Deliberately a different object from f′(x) below.
 */
export function derivativeAt(f: RealFunctionContract, at: number): DerivativeResult {
  if (!f.inDomain(at)) {
    return { kind: 'not_differentiable', reason: `the function has no value at ${at}` };
  }
  const limit: LimitResult = limitingSecantSlope(f, at);
  if (limit.kind === 'does_not_exist') {
    return { kind: 'not_differentiable', reason: limit.reason };
  }
  return { kind: 'derivative', value: limit.value };
}

/** The limit of the difference quotient, shown as a limit for a lesson. */
export const quotientLimit = (f: RealFunctionContract, at: number): LimitResult =>
  limitOf(differenceQuotient(f, at), 0);

// ---------------------------------------------------------------------------
// The derivative as a FUNCTION, and the source's rules.
// ---------------------------------------------------------------------------

/**
 * A derivative rule: the function differentiated, the written result, and
 * the domain the result lives on — which is never wider than the original's.
 */
export type DerivativeRule = {
  id: string;
  /** How the source writes the function. */
  of: string;
  /** How the source writes the derivative. */
  rule: string;
  /** Carried from the original: a rule may not broaden a domain. */
  domainDescription: string;
  /** Excluded points, preserved from the original function. */
  excludes: number[];
  /** f′ as a function, so a value can be checked against first principles. */
  derivative: RealFunctionContract;
};

/**
 * Powers with a POSITIVE INTEGRAL index — the source's scope. Negative and
 * rational powers are not Class XI here and are refused.
 */
export function powerRule(n: number): DerivativeRule {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error('the source states the power rule for a positive integral index');
  }
  return {
    id: `power_${n}`,
    of: n === 1 ? 'x' : `x^${n}`,
    rule: n === 1 ? '1' : n === 2 ? '2x' : `${n}x^${n - 1}`,
    domainDescription: 'every real number',
    excludes: [],
    derivative: {
      name: n === 1 ? '1' : `${n}x^${n - 1}`,
      inDomain: () => true,
      evaluate: (x) => n * x ** (n - 1),
      domainDescription: 'every real number',
      rangeDescription: 'the slope at each point',
    },
  };
}

type Pair = { f: RealFunctionContract; g: RealFunctionContract; df: RealFunctionContract; dg: RealFunctionContract };

const union = (a: number[], b: number[]) => [...new Set([...a, ...b])].sort((x, y) => x - y);

/** (f ± g)′ = f′ ± g′, on the points where both are defined. */
export function sumRule(id: string, p: Pair, sign: 1 | -1, excludes: number[] = []): DerivativeRule {
  const op = sign === 1 ? '+' : '−';
  return {
    id, of: `${p.f.name} ${op} ${p.g.name}`, rule: `${p.df.name} ${op} ${p.dg.name}`,
    domainDescription: 'where both functions are defined', excludes,
    derivative: {
      name: `${p.df.name} ${op} ${p.dg.name}`,
      inDomain: (x) => p.f.inDomain(x) && p.g.inDomain(x) && !excludes.includes(x),
      evaluate: (x) => {
        const a = p.df.evaluate(x), b = p.dg.evaluate(x);
        return a === null || b === null ? null : a + sign * b;
      },
      domainDescription: 'where both functions are defined',
      rangeDescription: 'the slope at each point',
    },
  };
}

/** (fg)′ = f′g + fg′ — two terms, because both factors vary. */
export function productRule(id: string, p: Pair, excludes: number[] = []): DerivativeRule {
  return {
    id, of: `(${p.f.name})(${p.g.name})`,
    rule: `(${p.df.name})(${p.g.name}) + (${p.f.name})(${p.dg.name})`,
    domainDescription: 'where both functions are defined', excludes,
    derivative: {
      name: `(${p.df.name})(${p.g.name}) + (${p.f.name})(${p.dg.name})`,
      inDomain: (x) => p.f.inDomain(x) && p.g.inDomain(x) && !excludes.includes(x),
      evaluate: (x) => {
        const [a, b, c, d] = [p.df.evaluate(x), p.g.evaluate(x), p.f.evaluate(x), p.dg.evaluate(x)];
        return a === null || b === null || c === null || d === null ? null : a * b + c * d;
      },
      domainDescription: 'where both functions are defined',
      rangeDescription: 'the slope at each point',
    },
  };
}

/**
 * (f/g)′ = (f′g − fg′)/g², wherever g is not zero.
 *
 * The zeros of g are carried into `excludes`. A derivative rule must not
 * quietly widen a domain: where the original quotient has no value, neither
 * does its derivative, however tidy the simplified expression looks.
 */
export function quotientRule(id: string, p: Pair, zerosOfDenominator: number[]): DerivativeRule {
  const excludes = union(zerosOfDenominator, []);
  return {
    id, of: `(${p.f.name}) / (${p.g.name})`,
    rule: `[(${p.df.name})(${p.g.name}) − (${p.f.name})(${p.dg.name})] / (${p.g.name})²`,
    domainDescription: `where both are defined and ${p.g.name} is not zero`,
    excludes,
    derivative: {
      name: `[(${p.df.name})(${p.g.name}) − (${p.f.name})(${p.dg.name})] / (${p.g.name})²`,
      inDomain: (x) => p.f.inDomain(x) && p.g.inDomain(x) && !excludes.includes(x) && (p.g.evaluate(x) ?? 0) !== 0,
      evaluate: (x) => {
        const [a, b, c, d] = [p.df.evaluate(x), p.g.evaluate(x), p.f.evaluate(x), p.dg.evaluate(x)];
        if (a === null || b === null || c === null || d === null || b === 0) return null;
        return (a * b - c * d) / (b * b);
      },
      domainDescription: `where both are defined and ${p.g.name} is not zero`,
      rangeDescription: 'the slope at each point',
    },
  };
}

/**
 * Structural checks. The central one: a rule's derivative may not be
 * defined where the original function is not.
 */
export function validateRule(r: DerivativeRule, original?: RealFunctionContract): string[] {
  const problems: string[] = [];
  for (const x of r.excludes) {
    if (r.derivative.inDomain(x)) {
      problems.push(`the derivative claims a value at ${x}, which the function excludes`);
    }
  }
  if (original) {
    for (const x of [-3, -2, -1, -0.5, 0.5, 1, 2, 3]) {
      if (!original.inDomain(x) && r.derivative.inDomain(x)) {
        problems.push(`the derivative is defined at ${x} but the function is not, so the rule has widened the domain`);
      }
    }
  }
  if (!r.rule.trim()) problems.push('a rule needs a written derivative');
  return problems;
}

/**
 * Agreement between a rule and first principles, at sample points. This is
 * the independent check: the rule is compared against the LIMIT, not
 * against another rule.
 */
export function ruleAgreesWithFirstPrinciples(
  f: RealFunctionContract, r: DerivativeRule, points: number[], tolerance = 1e-3
): { at: number; rule: number | null; firstPrinciples: DerivativeResult; agrees: boolean }[] {
  return points.map((at) => {
    const fromRule = r.derivative.evaluate(at);
    const fromLimit = derivativeAt(f, at);
    const agrees = fromRule !== null && isDerivative(fromLimit)
      && Math.abs(fromRule - fromLimit.value) < tolerance;
    return { at, rule: fromRule, firstPrinciples: fromLimit, agrees };
  });
}

/**
 * The source's trigonometric derivatives, which hold ONLY in radian
 * measure.
 *
 * The angle's type carries its unit, so a degree angle is refused here
 * rather than silently differentiated. The formulas rest on the standard
 * limit of sin x over x, which is 1 in radians and something else entirely
 * in degrees — so this is the Class 10 degree convention being kept out of
 * Class 11 derivative work, not a stylistic preference.
 */
export type TrigDerivative =
  | { kind: 'derivative_rule'; of: string; rule: string }
  | { kind: 'wrong_measure'; reason: string };

export function trigDerivative(name: 'sin' | 'cos', measure: Angle): TrigDerivative {
  if (measure.unit !== 'radian') {
    return {
      kind: 'wrong_measure',
      reason: 'these derivatives hold only when the angle is measured in radians, because the limit they rest on is not 1 in degrees',
    };
  }
  return name === 'sin'
    ? { kind: 'derivative_rule', of: 'sin x', rule: 'cos x' }
    : { kind: 'derivative_rule', of: 'cos x', rule: '− sin x' };
}

/**
 * Composite functions are C11-LIM-FO11, formative-only. Refusing here is
 * the scope boundary being held, not a missing feature.
 */
export function composite(): { kind: 'out_of_scope'; reason: string } {
  return {
    kind: 'out_of_scope',
    reason: 'differentiating a function of a function is a separate extension, not part of these rules',
  };
}
