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

// ---------------------------------------------------------------------------
// v0.84.0-c11.54 checkpoint 102 — THE CHAIN RULE. C11-LIM-FO11.
//
// The boundary the earlier lesson named — "no chain rule: composite
// derivatives are C11-LIM-FO11" — is where this picks up. ONE new rule,
// built from machinery that already exists:
//
//   compose(g, f)  from relationsFunctions   — the composite itself
//   DerivativeRule from this file            — the result's shape
//   ruleAgreesWithFirstPrinciples            — the independent check
//
// NOT a symbolic algebra system. There is no expression tree and no
// simplifier: `3(x² + 1)²·2x` is left exactly as the rule produces it,
// correct and unsimplified, because a simplifier would be a second source
// of mathematical truth to keep honest.
//
// DOMAIN: the derivative is defined only where the COMPOSITE is, which
// means x in the domain of f AND f(x) in the domain of g. A simplified
// derivative expression often evaluates happily at points the original
// composite never had — the same discipline the quotient rule already
// enforces.
// ---------------------------------------------------------------------------

import { compose } from './relationsFunctions';
import type { RealFunction } from './relationsFunctions';

/** The two layers, each with its own derivative. */
export type ChainParts = {
  /** The function applied LAST: y = g(u). */
  outer: RealFunction;
  /** The function applied FIRST: u = f(x). */
  inner: RealFunction;
  /** g′, as a function of u. */
  dOuter: RealFunctionContract;
  /** f′, as a function of x. */
  dInner: RealFunctionContract;
};

/**
 * (g ∘ f)′(x) = g′(f(x)) · f′(x).
 *
 * Read in words: differentiate the outer function, keep the inner function
 * in place, then multiply by the derivative of the inner function. The
 * second factor is the one that goes missing.
 */
export function chainRule(id: string, p: ChainParts, excludes: number[] = []): DerivativeRule {
  const composite = compose(p.outer, p.inner);
  const inDomain = (x: number) => composite.inDomain(x) && !excludes.includes(x);
  return {
    id,
    of: `${p.outer.name}(${p.inner.name})`,
    // Left unsimplified on purpose: this is what the rule gives.
    rule: `${p.dOuter.name} at ${p.inner.name}, times ${p.dInner.name}`,
    domainDescription: composite.domainDescription,
    excludes,
    derivative: {
      name: `${p.dOuter.name}(${p.inner.name}) × ${p.dInner.name}`,
      inDomain,
      evaluate: (x) => {
        // Every layer must be defined, in order. A null anywhere means the
        // derivative does not exist there — never a silently skipped factor.
        if (!inDomain(x)) return null;
        const u = p.inner.evaluate(x);
        if (u === null) return null;
        const gPrimeAtU = p.dOuter.evaluate(u);
        const fPrime = p.dInner.evaluate(x);
        if (gPrimeAtU === null || fPrime === null) return null;
        return gPrimeAtU * fPrime;
      },
      domainDescription: composite.domainDescription,
      rangeDescription: 'the slope at each point',
    },
  };
}

/** The composite a chain rule differentiates, for independent checking. */
export const chainComposite = (p: ChainParts): RealFunction => compose(p.outer, p.inner);

/**
 * The factors, separately, so a lesson or a figure can show the structure
 * instead of only the answer.
 */
export type ChainWorking = {
  x: number;
  innerValue: number;
  outerDerivativeAtInner: number;
  innerDerivative: number;
  product: number;
} | { x: number; undefinedBecause: string };

export function chainWorkingAt(p: ChainParts, x: number): ChainWorking {
  if (!p.inner.inDomain(x)) return { x, undefinedBecause: `${p.inner.name} is not defined at ${x}` };
  const u = p.inner.evaluate(x);
  if (u === null) return { x, undefinedBecause: `${p.inner.name} has no value at ${x}` };
  if (!p.outer.inDomain(u)) {
    return { x, undefinedBecause: `${p.inner.name}(${x}) = ${u}, which is outside the domain of ${p.outer.name}` };
  }
  const g = p.dOuter.evaluate(u); const f = p.dInner.evaluate(x);
  if (g === null || f === null) return { x, undefinedBecause: 'one of the two derivatives does not exist here' };
  return { x, innerValue: u, outerDerivativeAtInner: g, innerDerivative: f, product: g * f };
}

/**
 * v0.84.0-c11.55 checkpoint 102B — A SCALE-AWARE CHECK FOR STEEP DERIVATIVES.
 *
 * WHY THIS EXISTS, precisely. `ruleAgreesWithFirstPrinciples` compares a
 * rule against `derivativeAt`, which goes through the shared `limitOf`.
 * That routine declares a limit NON-EXISTENT when its left and right
 * estimates differ by more than an ABSOLUTE 1e-4.
 *
 * For (3x+2)⁵ at x = 1 the derivative is 9375. At the routine's widest
 * offset the one-sided secant slopes differ by far more than 1e-4 through
 * ordinary truncation error, so the limit is reported as not existing and
 * the comparison never happens at all.
 *
 * THE MEASUREMENT, before any change (absolute error of the numeric value
 * against the analytic one, where a value was produced):
 *
 *   (x²+1)³  x=-2  -300       -299.999998   2.0e-6
 *   (x²+1)³  x= 2   300        299.999998   2.0e-6
 *   (3x+2)⁵  x= 0   240        239.999999   1.0e-6
 *   (x²+1)³  x= 3  1800        DOES NOT EXIST
 *   (3x+2)⁵  x= 1  9375        DOES NOT EXIST
 *
 * So the arithmetic was never in doubt — agreement is to 7e-9 RELATIVE
 * wherever a value exists. The defect is the shared limit's absolute
 * settling test, not the comparison tolerance and not the chain rule.
 *
 * The shared routine is LEFT ALONE. Its absolute test is right for the
 * limit lessons, where "these values do not settle" is the thing being
 * taught, and loosening it would weaken every existing derivative check to
 * fix one unit's fixtures. This local oracle instead measures the
 * derivative directly with a symmetric difference and compares on a
 * combined absolute-plus-relative basis, which stays strict near zero.
 */
export type ChainAgreement = {
  at: number;
  analytic: number | null;
  numeric: number | null;
  absoluteError: number;
  relativeError: number;
  agrees: boolean;
};

export function chainAgreesWithFirstPrinciples(
  f: RealFunctionContract, r: DerivativeRule, points: number[],
  absTol = 1e-6, relTol = 1e-6
): ChainAgreement[] {
  return points.map((at) => {
    const analytic = r.derivative.evaluate(at);
    // A symmetric difference: its error falls as h² rather than h, so a
    // steep function is measured accurately instead of being declared
    // unsettled. h is scaled to the point so that large x keeps precision.
    const h = 1e-5 * Math.max(1, Math.abs(at));
    const lo = f.inDomain(at - h) ? f.evaluate(at - h) : null;
    const hi = f.inDomain(at + h) ? f.evaluate(at + h) : null;
    const numeric = lo === null || hi === null ? null : (hi - lo) / (2 * h);
    if (analytic === null || numeric === null) {
      return { at, analytic, numeric, absoluteError: NaN, relativeError: NaN, agrees: false };
    }
    const absoluteError = Math.abs(numeric - analytic);
    const relativeError = absoluteError / Math.max(1, Math.abs(analytic));
    // Combined form: the absolute term keeps it strict where the
    // derivative is near zero, the relative term scales with magnitude.
    const agrees = absoluteError <= absTol + relTol * Math.max(Math.abs(analytic), Math.abs(numeric));
    return { at, analytic, numeric, absoluteError, relativeError, agrees };
  });
}

/**
 * v0.84.0-c11.55 checkpoint 102B — THE CHAIN RULE, SHOWN IN LAYERS.
 *
 * A new family, because nothing existing can carry this. The derivative
 * lessons so far are prose plus a limit table; a limit table shows a
 * quotient settling, not a composite's two layers. The structure a student
 * has to see — which function is inside, which is outside, what each
 * derivative is, and that the two are MULTIPLIED — has no existing
 * representation.
 *
 * Every field is derived from the ChainParts, so the figure cannot drift
 * from the rule.
 */
export type ChainRuleSpec = {
  type: 'chain_rule';
  id: string;
  /** The composite as written, e.g. "(x² + 1)³". */
  composite: string;
  innerName: string;
  outerName: string;
  /** g′, written in terms of u. */
  outerDerivative: string;
  /** g′ with the inner substituted back in. */
  outerDerivativeAtInner: string;
  /** f′. */
  innerDerivative: string;
  /** The product, deliberately unsimplified. */
  derivative: string;
  /** One worked point, so the structure is concrete. */
  sample: { x: number; innerValue: number; outerAtInner: number; inner: number; product: number };
  altText: string;
  caption: string;
  status: 'verified';
};

export function chainRuleFigure(
  id: string, p: ChainParts, written: {
    composite: string; outerDerivative: string; outerDerivativeAtInner: string;
    innerDerivative: string; derivative: string;
  }, at: number, caption: string, altText: string
): ChainRuleSpec {
  const w = chainWorkingAt(p, at);
  if ('undefinedBecause' in w) throw new Error(`cannot draw a worked point here: ${w.undefinedBecause}`);
  return {
    type: 'chain_rule', id, composite: written.composite,
    innerName: p.inner.name, outerName: p.outer.name,
    outerDerivative: written.outerDerivative,
    outerDerivativeAtInner: written.outerDerivativeAtInner,
    innerDerivative: written.innerDerivative, derivative: written.derivative,
    sample: { x: at, innerValue: w.innerValue, outerAtInner: w.outerDerivativeAtInner,
      inner: w.innerDerivative, product: w.product },
    altText, caption, status: 'verified',
  };
}

export function validateChainRule(spec: ChainRuleSpec): string[] {
  const errs: string[] = [];
  const s = spec.sample;
  // Recomputed, never trusted: the product must be the two factors.
  if (Math.abs(s.outerAtInner * s.inner - s.product) > 1e-9) {
    errs.push(`the worked point multiplies ${s.outerAtInner} by ${s.inner} but shows ${s.product}`);
  }
  // The inner factor must actually be present. A figure whose product
  // equals the outer derivative alone has dropped it — unless the inner
  // derivative is genuinely 1, which is the identity case.
  if (s.inner !== 1 && Math.abs(s.product - s.outerAtInner) < 1e-9) {
    errs.push('the inner derivative has been dropped: the product equals the outer derivative alone');
  }
  if (!spec.innerName.trim() || !spec.outerName.trim()) errs.push('both layers must be named');
  if (spec.innerName === spec.outerName) errs.push('the inner and outer functions must be distinguishable');
  if (!spec.derivative.includes(spec.innerDerivative)) {
    errs.push(`the written derivative "${spec.derivative}" does not contain the inner derivative "${spec.innerDerivative}"`);
  }
  if (!spec.altText.trim()) errs.push('altText is required');
  // A screen reader cannot see nesting or primes, so the words must name
  // the layers and say the factors are multiplied.
  for (const [what, re] of [['the inner function', /inner function/i], ['the outer function', /outer function/i],
    ['multiplication', /multipl|times/i]] as const) {
    if (!re.test(spec.altText)) errs.push(`the description must state ${what}`);
  }
  return errs;
}
