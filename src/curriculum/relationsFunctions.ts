// ===========================================================================
// v0.84.0-c11.10 checkpoint 81 — ORDERED PAIRS, RELATIONS AND FUNCTIONS.
//
// WHAT THIS BUILDS ON
//
// Sets come from `setTheory` (checkpoint 79) unchanged — there is no second
// set implementation here. A relation IS a subset of a Cartesian product, so
// it is built from those sets rather than from a parallel list of strings.
//
// WHAT IT DELIBERATELY DOES NOT DO
//
// It does not absorb `circularFunctions` (checkpoint 80). Those six functions
// carry exact trigonometric semantics — exact values, periods, branch-safe
// graphs — and flattening them into a generic callable would lose all of it.
// Instead a small CONTRACT is declared here that any function can satisfy:
// domain, range, evaluation, graphability. A compatibility test shows the
// circular functions already satisfy it without a line of them changing.
//
// THE DISTINCTIONS THIS MODULE EXISTS TO HOLD
//
//   * (a,b) is not {a,b}: order is identity, so (1,2) and (2,1) differ.
//   * A x B is not B x A, and equal cardinality proves nothing.
//   * codomain is declared; range is attained. They are not the same field.
//   * a function needs EXACTLY one image for EVERY element of its domain —
//     not at most one, not at least one.
//   * a domain is part of a function, not a remark beside it. Two rules that
//     agree everywhere they are both defined are still different functions
//     if their domains differ.
// ===========================================================================

import {
  type ExplicitSet, type Member, canonicalMembers, cardinality, isMember, setsEqual,
} from './setTheory';

// ---------------------------------------------------------------------------
// Ordered tuples. Order is identity.
// ---------------------------------------------------------------------------

/** An ordered tuple. Two tuples are equal only coordinate by coordinate. */
export type Tuple = { readonly coordinates: readonly Member[] };

export const tuple = (...coordinates: Member[]): Tuple => ({ coordinates });
export const pair = (a: Member, b: Member): Tuple => tuple(a, b);

export const tuplesEqual = (x: Tuple, y: Tuple): boolean =>
  x.coordinates.length === y.coordinates.length &&
  x.coordinates.every((c, i) => c === y.coordinates[i]);

export const formatTuple = (t: Tuple): string => `(${t.coordinates.join(', ')})`;

/**
 * The Cartesian product of two or more sets, as the set of tuples. Derived
 * from the factors — never authored — so duplicate roster entries in a factor
 * cannot produce duplicate tuples, because `canonicalMembers` removed them.
 */
export function cartesianProduct(...factors: ExplicitSet[]): Tuple[] {
  if (!factors.length) return [];
  return factors.reduce<Tuple[]>(
    (acc, f) =>
      acc.flatMap((t) => canonicalMembers(f).map((m) => tuple(...t.coordinates, m))),
    [tuple()]
  );
}

export const productCardinality = (...factors: ExplicitSet[]): number =>
  factors.reduce((n, f) => n * cardinality(f), 1);

export const inProduct = (t: Tuple, ...factors: ExplicitSet[]): boolean =>
  t.coordinates.length === factors.length &&
  t.coordinates.every((c, i) => isMember(factors[i], c));

/** Whether two products contain the same tuples. Usually false when swapped. */
export const productsEqual = (a: Tuple[], b: Tuple[]): boolean =>
  a.length === b.length && a.every((t) => b.some((u) => tuplesEqual(t, u)));

// ---------------------------------------------------------------------------
// Relations: a subset of A x B, with A and B carried, not inferred.
// ---------------------------------------------------------------------------

export type Relation = {
  id: string;
  label: string;
  /** The set the relation is FROM. */
  source: ExplicitSet;
  /** The set the relation is TO. This is the codomain. */
  target: ExplicitSet;
  pairs: Tuple[];
};

export const relation = (
  id: string, label: string, source: ExplicitSet, target: ExplicitSet, pairs: Tuple[]
): Relation => ({ id, label, source, target, pairs });

/** Every pair must lie inside A x B. A stray pair is a defect, not a quirk. */
export function validateRelation(r: Relation): string[] {
  const e: string[] = [];
  for (const p of r.pairs) {
    if (p.coordinates.length !== 2) {
      e.push(`${formatTuple(p)} is not an ordered pair`); continue;
    }
    if (!isMember(r.source, p.coordinates[0])) {
      e.push(`${formatTuple(p)} has a first coordinate outside ${r.source.label}`);
    }
    if (!isMember(r.target, p.coordinates[1])) {
      e.push(`${formatTuple(p)} has a second coordinate outside ${r.target.label}`);
    }
  }
  return e;
}

const derivedSet = (id: string, label: string, members: Member[]): ExplicitSet =>
  ({ kind: 'explicit', id, label, members });

/** The first coordinates that actually appear. Derived, never authored. */
export const relationDomain = (r: Relation): ExplicitSet =>
  derivedSet(`${r.id}_dom`, `domain of ${r.label}`, r.pairs.map((p) => p.coordinates[0]));

/** The declared target set. Not the same thing as the range. */
export const relationCodomain = (r: Relation): ExplicitSet => r.target;

/** The second coordinates that actually appear. A subset of the codomain. */
export const relationRange = (r: Relation): ExplicitSet =>
  derivedSet(`${r.id}_ran`, `range of ${r.label}`, r.pairs.map((p) => p.coordinates[1]));

/** True when some element of the codomain is never reached. */
export const rangeIsProperSubsetOfCodomain = (r: Relation): boolean =>
  cardinality(relationRange(r)) < cardinality(relationCodomain(r));

// ---------------------------------------------------------------------------
// Functions. The exactly-one rule is enforced, not described.
// ---------------------------------------------------------------------------

export type FunctionCheck = {
  isFunction: boolean;
  /** Elements of the source with no image at all. */
  unmapped: Member[];
  /** Elements of the source with more than one image. */
  multiplyMapped: Array<{ input: Member; images: Member[] }>;
};

export function checkFunction(r: Relation): FunctionCheck {
  const unmapped: Member[] = [];
  const multiplyMapped: Array<{ input: Member; images: Member[] }> = [];
  for (const a of canonicalMembers(r.source)) {
    const images = r.pairs.filter((p) => p.coordinates[0] === a).map((p) => p.coordinates[1]);
    const distinct = [...new Set(images)];
    if (distinct.length === 0) unmapped.push(a);
    else if (distinct.length > 1) multiplyMapped.push({ input: a, images: distinct });
  }
  return { isFunction: !unmapped.length && !multiplyMapped.length, unmapped, multiplyMapped };
}

/** Why a relation fails to be a function, in words a lesson can use. */
export function functionFailureReason(r: Relation): string | null {
  const c = checkFunction(r);
  if (c.isFunction) return null;
  if (c.unmapped.length) {
    return `${c.unmapped[0]} belongs to ${r.source.label} but has no image, so not every element is assigned one`;
  }
  const m = c.multiplyMapped[0];
  return `${m.input} is assigned ${m.images.join(' and ')}, so it has more than one image`;
}

/** Many-to-one is allowed, and this says so explicitly. */
export const isManyToOne = (r: Relation): boolean => {
  const images = r.pairs.map((p) => p.coordinates[1]);
  return checkFunction(r).isFunction && new Set(images).size < images.length;
};

// ---------------------------------------------------------------------------
// Real functions. A domain is part of the function.
// ---------------------------------------------------------------------------

/**
 * The general contract. `circularFunctions` already satisfies this shape
 * without being changed; a compatibility test checks that rather than this
 * module reaching in and rewriting it.
 */
export type RealFunctionContract = {
  name: string;
  /** Whether a real number lies in the domain. */
  inDomain: (x: number) => boolean;
  /** The value, or null when the argument is outside the domain. */
  evaluate: (x: number) => number | null;
  domainDescription: string;
  rangeDescription: string;
};

export type FunctionFamily =
  | 'constant' | 'identity' | 'polynomial' | 'rational'
  | 'modulus' | 'signum' | 'exponential' | 'logarithmic' | 'greatest_integer';

export type RealFunction = RealFunctionContract & {
  family: FunctionFamily;
  rule: string;
  /** Arguments inside a plotted range where the function has no value. */
  excluded: (from: number, to: number) => number[];
  /** True where the family's graph genuinely jumps rather than flowing. */
  stepwise: boolean;
};

const ALL_REALS = 'all real numbers';

export function constantFunction(c: number): RealFunction {
  return { name: `constant ${c}`, family: 'constant', rule: `f(x) = ${c}`,
    inDomain: () => true, evaluate: () => c, excluded: () => [],
    domainDescription: ALL_REALS, rangeDescription: `{${c}}`, stepwise: false };
}

export function identityFunction(): RealFunction {
  return { name: 'identity', family: 'identity', rule: 'f(x) = x',
    inDomain: () => true, evaluate: (x) => x, excluded: () => [],
    domainDescription: ALL_REALS, rangeDescription: ALL_REALS, stepwise: false };
}

/** Coefficients highest power first, so [1,0,-1] is x squared minus 1. */
export function polynomialFunction(coefficients: number[], rule: string): RealFunction {
  const evaluate = (x: number) => coefficients.reduce((acc, c) => acc * x + c, 0);
  return { name: 'polynomial', family: 'polynomial', rule,
    inDomain: () => true, evaluate, excluded: () => [],
    domainDescription: ALL_REALS, rangeDescription: 'depends on the polynomial', stepwise: false };
}

/**
 * A rational function excludes the zeros of its denominator STRUCTURALLY.
 * The restriction is in `inDomain`, not appended to the prose.
 */
export function rationalFunction(
  numerator: (x: number) => number, denominator: (x: number) => number,
  rule: string, excludedPoints: number[], rangeDescription = ALL_REALS
): RealFunction {
  const inDomain = (x: number) => !excludedPoints.some((e) => Math.abs(x - e) < 1e-9);
  return { name: 'rational', family: 'rational', rule, inDomain,
    evaluate: (x) => (inDomain(x) ? numerator(x) / denominator(x) : null),
    excluded: (from, to) => excludedPoints.filter((e) => e >= from && e <= to),
    domainDescription: `all real numbers except ${excludedPoints.join(', ')}`,
    rangeDescription, stepwise: false };
}

export function modulusFunction(): RealFunction {
  return { name: 'modulus', family: 'modulus', rule: 'f(x) = |x|',
    inDomain: () => true, evaluate: (x) => Math.abs(x), excluded: () => [],
    domainDescription: ALL_REALS, rangeDescription: 'all non-negative real numbers', stepwise: false };
}

/** The source convention: minus one below zero, zero at zero, one above. */
export function signumFunction(): RealFunction {
  return { name: 'signum', family: 'signum', rule: 'f(x) = \u22121 for x < 0, 0 for x = 0, 1 for x > 0',
    inDomain: () => true, evaluate: (x) => (x < 0 ? -1 : x > 0 ? 1 : 0), excluded: () => [],
    domainDescription: ALL_REALS, rangeDescription: '{\u22121, 0, 1}', stepwise: true };
}

export function exponentialFunction(base = Math.E, rule = 'f(x) = e^x'): RealFunction {
  return { name: 'exponential', family: 'exponential', rule,
    inDomain: () => true, evaluate: (x) => base ** x, excluded: () => [],
    domainDescription: ALL_REALS, rangeDescription: 'all positive real numbers', stepwise: false };
}

/** Logarithm excludes every non-positive argument, structurally. */
export function logarithmicFunction(base = Math.E, rule = 'f(x) = log x'): RealFunction {
  const inDomain = (x: number) => x > 0;
  return { name: 'logarithmic', family: 'logarithmic', rule, inDomain,
    evaluate: (x) => (inDomain(x) ? Math.log(x) / Math.log(base) : null),
    excluded: () => [],
    domainDescription: 'all positive real numbers', rangeDescription: ALL_REALS, stepwise: false };
}

export function greatestIntegerFunction(): RealFunction {
  return { name: 'greatest integer', family: 'greatest_integer', rule: 'f(x) = [x]',
    inDomain: () => true, evaluate: (x) => Math.floor(x), excluded: () => [],
    domainDescription: ALL_REALS, rangeDescription: 'all integers', stepwise: true };
}

// ---------------------------------------------------------------------------
// Graphs. Branch-safe, like the trigonometric graphs, for the same reason.
// ---------------------------------------------------------------------------

export type FunctionBranch = { points: Array<{ x: number; y: number }> };

export type RealFunctionGraph = {
  type: 'real_function_graph';
  id: string;
  functionName: string;
  rule: string;
  from: number;
  to: number;
  branches: FunctionBranch[];
  /** Arguments inside the range where the function has no value. */
  breaks: number[];
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export function sampleFunction(
  f: RealFunction, from: number, to: number, step = 0.05, clamp = 10
): { branches: FunctionBranch[]; breaks: number[] } {
  const branches: FunctionBranch[] = [];
  const breaks = f.excluded(from, to);
  let current: Array<{ x: number; y: number }> = [];
  let lastY: number | null = null;
  for (let x = from; x <= to + 1e-9; x += step) {
    const rx = Number(x.toFixed(10));
    const y = f.evaluate(rx);
    // Leave the domain, exceed the plot, or jump: each ends the branch.
    const jumped = f.stepwise && lastY !== null && y !== null && Math.abs(y - lastY) > 1e-9;
    if (y === null || Math.abs(y) > clamp || jumped) {
      if (current.length) { branches.push({ points: current }); current = []; }
      if (y === null || Math.abs(y) > clamp) { lastY = null; continue; }
    }
    current.push({ x: rx, y: Number(y.toFixed(10)) });
    lastY = y;
  }
  if (current.length) branches.push({ points: current });
  return { branches, breaks };
}

export function buildFunctionGraph(
  id: string, f: RealFunction, from: number, to: number, altText: string
): RealFunctionGraph {
  const { branches, breaks } = sampleFunction(f, from, to);
  return { type: 'real_function_graph', id, functionName: f.name, rule: f.rule,
    from, to, branches, breaks, altText, caption: altText, status: 'verified' };
}

export function validateFunctionGraph(g: RealFunctionGraph, f: RealFunction): string[] {
  const e: string[] = [];
  if (!g.branches.length) e.push('the graph has no sampled points');
  for (const b of g.branches) {
    for (const p of b.points) {
      if (!f.inDomain(p.x)) { e.push(`a plotted point at ${p.x} is outside the domain`); continue; }
      const y = f.evaluate(p.x);
      if (y === null || Math.abs(y - p.y) > 1e-6) {
        e.push(`a plotted point at ${p.x} does not come from ${f.name}`);
      }
    }
    for (const br of g.breaks) {
      if (b.points.some((p) => p.x < br) && b.points.some((p) => p.x > br)) {
        e.push(`a branch crosses the excluded argument at ${br}`);
      }
    }
  }
  if (f.stepwise && g.branches.length < 2) {
    e.push(`${f.name} jumps, so its graph must be drawn in separate pieces`);
  }
  if (!g.altText.trim()) e.push('altText is required');
  return e;
}

// ---------------------------------------------------------------------------
// Algebra of functions. The domain of the result is DERIVED.
// ---------------------------------------------------------------------------

export type Operation = 'sum' | 'difference' | 'product' | 'quotient';
const SYMBOL: Record<Operation, string> = { sum: '+', difference: '\u2212', product: '\u00d7', quotient: '/' };

/**
 * Pointwise operations. The domain of a sum, difference or product is the
 * intersection of the two domains; a quotient removes in addition every
 * argument where the divisor is zero. That restriction lives in `inDomain`,
 * so it cannot be lost by someone rewriting the prose.
 */
export function combine(
  op: Operation, f: RealFunction, g: RealFunction, zerosOfG: number[] = []
): RealFunction {
  const base = (x: number) => f.inDomain(x) && g.inDomain(x);
  const inDomain = op === 'quotient'
    ? (x: number) => base(x) && !zerosOfG.some((z) => Math.abs(x - z) < 1e-9)
    : base;
  const evaluate = (x: number): number | null => {
    if (!inDomain(x)) return null;
    const a = f.evaluate(x), b = g.evaluate(x);
    if (a === null || b === null) return null;
    switch (op) {
      case 'sum': return a + b;
      case 'difference': return a - b;
      case 'product': return a * b;
      case 'quotient': return a / b;
    }
  };
  const extra = op === 'quotient' && zerosOfG.length
    ? `, and excluding ${zerosOfG.join(', ')} where the divisor is zero` : '';
  return {
    name: `${f.name} ${SYMBOL[op]} ${g.name}`, family: 'rational',
    rule: `(${f.rule.replace('f(x) = ', '')}) ${SYMBOL[op]} (${g.rule.replace('f(x) = ', '')})`,
    inDomain, evaluate,
    excluded: (from, to) => [
      ...f.excluded(from, to), ...g.excluded(from, to),
      ...(op === 'quotient' ? zerosOfG.filter((z) => z >= from && z <= to) : []),
    ],
    domainDescription: `where both ${f.name} and ${g.name} are defined${extra}`,
    rangeDescription: 'depends on the operands', stepwise: f.stepwise || g.stepwise,
  };
}

// ---------------------------------------------------------------------------
// Composition. Separate, because the curriculum treats it separately.
// ---------------------------------------------------------------------------

/**
 * g after f. An argument belongs to the domain only when x is in the domain
 * of f AND f(x) is in the domain of g — the second condition is the one a
 * careless implementation drops.
 */
export function compose(g: RealFunction, f: RealFunction): RealFunction {
  const inDomain = (x: number) => {
    if (!f.inDomain(x)) return false;
    const inner = f.evaluate(x);
    return inner !== null && g.inDomain(inner);
  };
  return {
    name: `${g.name} after ${f.name}`, family: 'rational',
    rule: `(${g.name} \u2218 ${f.name})(x) = ${g.name}(${f.name}(x))`,
    inDomain,
    evaluate: (x) => {
      if (!inDomain(x)) return null;
      const inner = f.evaluate(x);
      return inner === null ? null : g.evaluate(inner);
    },
    excluded: (from, to) => f.excluded(from, to),
    domainDescription: `the arguments x where f is defined and f(x) lies in the domain of ${g.name}`,
    rangeDescription: 'depends on both functions', stepwise: f.stepwise || g.stepwise,
  };
}

/** Whether two compositions agree on a sample. Used to show order matters. */
export function compositionsAgree(a: RealFunction, b: RealFunction, xs: number[]): boolean {
  return xs.every((x) => {
    const u = a.evaluate(x), v = b.evaluate(x);
    if (u === null || v === null) return u === v;
    return Math.abs(u - v) < 1e-9;
  });
}

export { canonicalMembers, cardinality, setsEqual };
