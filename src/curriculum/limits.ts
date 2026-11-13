// ===========================================================================
// v0.84.0-c11.17 checkpoint 86A — A LIMIT AS BEHAVIOUR NEAR A POINT.
//
// THE DISTINCTION THIS FILE EXISTS FOR
//
// A limit is a statement about how a function behaves NEAR a point, not
// about its value AT that point. The two are separate fields here and can
// disagree, and the function can be undefined where the limit exists. The
// model therefore never computes a limit by evaluating the function at the
// target — doing that would make the two the same thing by construction.
//
// WHAT IT REUSES
//
// `RealFunctionContract` from checkpoint 81 is the only function interface.
// Trigonometric functions arrive through checkpoint 80's typed radian
// semantics, and secant slope comes from the Class 10 / Straight Lines
// model. Nothing here reimplements a function or a slope.
//
// WHAT IT REFUSES
//
//   * reporting a two-sided limit when the two sides disagree;
//   * NaN, Infinity or null as a student-facing limit state — the result is
//     a tagged union with named states instead;
//   * losing a hole: a function undefined at a point stays undefined there
//     even when an algebraically simpler expression agrees nearby.
//
// It builds no epsilon-delta machinery; the source does not ask for it.
// ===========================================================================

import type { RealFunctionContract } from './relationsFunctions';

/**
 * What a limit can be. Nonexistence is a NAMED STATE, never a number that
 * happens to be unusable.
 */
export type LimitResult =
  | { kind: 'exists'; value: number; exact?: string }
  | { kind: 'does_not_exist'; reason: string };

/** Which way the point is approached. */
export type Side = 'left' | 'right';

/** One sampled step of an approach, for the table a lesson shows. */
export type ApproachStep = {
  x: number;
  /** null when the function has no value there — a hole is not a zero. */
  value: number | null;
  side: Side;
};

/**
 * The approach itself. `x → a` is a sequence of values getting closer to a,
 * and never a itself: `includesTarget` is false by construction, and a test
 * asserts it.
 */
export type Approach = {
  target: number;
  steps: ApproachStep[];
  includesTarget: false;
};

/**
 * Offsets the MODEL uses to decide a limit. They run far closer to the
 * target than any table would show, because sampling only illustrates
 * behaviour — it is not the definition, and a table's visible steps are too
 * coarse to settle a question of agreement between the two sides.
 */
const DEFAULT_OFFSETS = [1e-2, 1e-4, 1e-6, 1e-8];

/** Offsets a lesson's table SHOWS. Readable, and never the deciding evidence. */
export const DISPLAY_OFFSETS = [0.1, 0.01, 0.001];

/** Beyond this a value is growing without bound rather than settling. */
const UNBOUNDED = 1e7;

/** Build the approach to a target from BOTH sides, never landing on it. */
export function approachTo(
  f: RealFunctionContract, target: number, offsets: number[] = DEFAULT_OFFSETS
): Approach {
  const steps: ApproachStep[] = [];
  for (const d of [...offsets].sort((a, b) => b - a)) {
    const x = target - d;
    steps.push({ x, value: f.inDomain(x) ? f.evaluate(x) : null, side: 'left' });
  }
  for (const d of [...offsets].sort((a, b) => a - b)) {
    const x = target + d;
    steps.push({ x, value: f.inDomain(x) ? f.evaluate(x) : null, side: 'right' });
  }
  return { target, steps, includesTarget: false };
}

/** The value a side settles on, or nonexistence with a reason. */
export function oneSidedLimit(
  f: RealFunctionContract, target: number, side: Side, offsets = DEFAULT_OFFSETS
): LimitResult {
  const xs = [...offsets].sort((a, b) => b - a)
    .map((d) => (side === 'left' ? target - d : target + d));
  const vals: number[] = [];
  for (const x of xs) {
    if (!f.inDomain(x)) return { kind: 'does_not_exist', reason: `the function has no value just to the ${side} of ${target}` };
    const v = f.evaluate(x);
    if (v === null || !Number.isFinite(v) || Math.abs(v) > UNBOUNDED) {
      return { kind: 'does_not_exist', reason: `the values grow without bound as x approaches ${target} from the ${side}` };
    }
    vals.push(v);
  }
  // Settling means successive values stop moving as the steps shrink.
  const last = vals[vals.length - 1], prev = vals[vals.length - 2];
  if (prev !== undefined && Math.abs(last - prev) > 1e-3) {
    return { kind: 'does_not_exist', reason: `the values do not settle as x approaches ${target} from the ${side}` };
  }
  return { kind: 'exists', value: last };
}

/**
 * The two-sided limit. It exists only when both sides exist AND agree —
 * a disagreement is reported, never averaged away.
 */
export function limitOf(
  f: RealFunctionContract, target: number, offsets = DEFAULT_OFFSETS, tolerance = 1e-4
): LimitResult {
  const l = oneSidedLimit(f, target, 'left', offsets);
  const r = oneSidedLimit(f, target, 'right', offsets);
  if (l.kind === 'does_not_exist') return l;
  if (r.kind === 'does_not_exist') return r;
  if (Math.abs(l.value - r.value) > tolerance) {
    return {
      kind: 'does_not_exist',
      reason: `approaching ${target} from the left gives ${round(l.value)} and from the right ${round(r.value)}, so there is no single value`,
    };
  }
  return { kind: 'exists', value: round((l.value + r.value) / 2) };
}

const round = (v: number) => Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : Number(v.toFixed(6));

/** The function's value AT the point — deliberately a separate question. */
export function valueAt(f: RealFunctionContract, x: number): number | null {
  return f.inDomain(x) ? f.evaluate(x) : null;
}

/**
 * How the value at a point stands against the limit there. This is the
 * distinction the chapter turns on, so it is named rather than inferred.
 */
export type PointComparison =
  | { kind: 'agree'; value: number }
  | { kind: 'differ'; functionValue: number; limitValue: number }
  | { kind: 'undefined_but_limit_exists'; limitValue: number }
  | { kind: 'undefined_and_no_limit'; reason: string }
  | { kind: 'defined_but_no_limit'; functionValue: number; reason: string };

export function compareValueWithLimit(
  f: RealFunctionContract, target: number, offsets = DEFAULT_OFFSETS
): PointComparison {
  const v = valueAt(f, target);
  const lim = limitOf(f, target, offsets);
  if (v === null) {
    return lim.kind === 'exists'
      ? { kind: 'undefined_but_limit_exists', limitValue: lim.value }
      : { kind: 'undefined_and_no_limit', reason: lim.reason };
  }
  if (lim.kind === 'does_not_exist') return { kind: 'defined_but_no_limit', functionValue: v, reason: lim.reason };
  return Math.abs(v - lim.value) < 1e-9
    ? { kind: 'agree', value: round(lim.value) }
    : { kind: 'differ', functionValue: round(v), limitValue: round(lim.value) };
}

// ---------------------------------------------------------------------------
// Rate of change. The secant slope comes from the Straight Lines model.
// ---------------------------------------------------------------------------

/** Average rate of change across an interval: the slope of the secant. */
export function averageRateOfChange(
  f: RealFunctionContract, x1: number, x2: number
): { kind: 'slope'; value: number } | { kind: 'undefined'; reason: string } {
  if (x1 === x2) return { kind: 'undefined', reason: 'an interval of zero width has no average rate' };
  const a = valueAt(f, x1), b = valueAt(f, x2);
  if (a === null || b === null) return { kind: 'undefined', reason: 'the function has no value at one end of the interval' };
  return { kind: 'slope', value: round((b - a) / (x2 - x1)) };
}

/**
 * The slope the secants approach as the second point closes on the first.
 * Expressed as a limit of secant slopes, which is what the tangent is —
 * not a line that "touches once".
 */
export function limitingSecantSlope(
  f: RealFunctionContract, at: number, offsets = DEFAULT_OFFSETS
): LimitResult {
  const secant: RealFunctionContract = {
    name: `secant slope from ${at}`,
    inDomain: (h) => h !== 0 && f.inDomain(at) && f.inDomain(at + h),
    evaluate: (h) => {
      const a = valueAt(f, at), b = valueAt(f, at + h);
      return a === null || b === null || h === 0 ? null : (b - a) / h;
    },
    domainDescription: 'all non-zero h for which both endpoints have values',
    rangeDescription: 'secant slopes',
  };
  return limitOf(secant, 0, offsets);
}

// ---------------------------------------------------------------------------
// Polynomial and rational functions, with the hole preserved.
// ---------------------------------------------------------------------------

/** The written rule travels with the function, so prose never retypes it. */
export const polynomial = (
  name: string, rule: string, at: (x: number) => number
): RealFunctionContract & { rule: string } => ({
  name, rule, inDomain: () => true, evaluate: at,
  domainDescription: 'every real number', rangeDescription: rule,
});

/**
 * A rational function. Its domain EXCLUDES the zeros of the denominator,
 * and stays excluded however the expression is later simplified. That is
 * the whole point of the cancelling case: the hole is a property of the
 * original function, not of the way it is written.
 */
export function rational(
  name: string, rule: string, numerator: (x: number) => number, denominator: (x: number) => number,
  excluded: number[]
): RealFunctionContract & { excludedPoints: number[]; rule: string } {
  const inDomain = (x: number) => !excluded.some((e) => Math.abs(x - e) < 1e-12) && Math.abs(denominator(x)) > 1e-12;
  return {
    name, rule, inDomain,
    evaluate: (x) => (inDomain(x) ? numerator(x) / denominator(x) : null),
    domainDescription: excluded.length
      ? `every real number except ${excluded.join(' and ')}`
      : 'every real number',
    rangeDescription: rule,
    excludedPoints: excluded,
  };
}

/** Is direct substitution available here? Only when the point is in the domain. */
export function directSubstitutionValid(f: RealFunctionContract, target: number): boolean {
  return f.inDomain(target) && f.evaluate(target) !== null && Number.isFinite(f.evaluate(target) as number);
}

/**
 * The cancelling case, reported honestly: the simplified expression agrees
 * with the original everywhere EXCEPT the excluded point, which is why the
 * limit can be read off it while the function stays undefined there.
 */
export type CancellingCase = {
  original: RealFunctionContract;
  simplified: RealFunctionContract;
  holeAt: number;
  agreesAwayFromHole: boolean;
  originalDefinedAtHole: boolean;
  simplifiedDefinedAtHole: boolean;
  limit: LimitResult;
};

export function cancellingCase(
  original: RealFunctionContract, simplified: RealFunctionContract, holeAt: number,
  probes = [holeAt - 0.5, holeAt - 0.1, holeAt + 0.1, holeAt + 0.5]
): CancellingCase {
  const agrees = probes.every((x) => {
    const a = valueAt(original, x), b = valueAt(simplified, x);
    return a !== null && b !== null && Math.abs(a - b) < 1e-9;
  });
  return {
    original, simplified, holeAt,
    agreesAwayFromHole: agrees,
    originalDefinedAtHole: valueAt(original, holeAt) !== null,
    simplifiedDefinedAtHole: valueAt(simplified, holeAt) !== null,
    limit: limitOf(original, holeAt),
  };
}

export function cancellingCaseErrors(c: CancellingCase): string[] {
  const e: string[] = [];
  if (!c.agreesAwayFromHole) e.push('the simplified expression must agree with the original away from the hole');
  if (c.originalDefinedAtHole) e.push('the original function must remain undefined at the hole after cancelling');
  return e;
}

// ---------------------------------------------------------------------------
// The approach table, derived from the function rather than typed.
// ---------------------------------------------------------------------------

export type LimitTableSpec = {
  type: 'limit_table';
  id: string;
  functionRule: string;
  target: number;
  approach: Approach;
  /** What the table is evidence FOR, taken from the same model. */
  result: LimitResult;
  valueAtTarget: number | null;
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export function limitTable(
  id: string, f: RealFunctionContract, functionRule: string, target: number, altText: string,
  offsets = DISPLAY_OFFSETS
): LimitTableSpec {
  return {
    type: 'limit_table', id, functionRule, target,
    // The rows a student reads are coarse and readable; the result below is
    // decided by the model at far finer steps. Sampling illustrates.
    approach: approachTo(f, target, offsets),
    result: limitOf(f, target),
    valueAtTarget: valueAt(f, target),
    altText, caption: altText, status: 'verified',
  };
}

export function validateLimitTable(spec: LimitTableSpec): string[] {
  const e: string[] = [];
  if (spec.approach.target !== spec.target) e.push('the table must approach the target it names');
  if (spec.approach.steps.some((s) => Math.abs(s.x - spec.target) < 1e-12)) {
    e.push('an approach must not include the target itself — x approaches a, it never equals a');
  }
  if (!spec.approach.steps.some((s) => s.side === 'left') || !spec.approach.steps.some((s) => s.side === 'right')) {
    e.push('an approach must come from both sides');
  }
  if (!spec.altText.trim()) e.push('altText is required');
  return e;
}

/**
 * The table, graph and limit must come from ONE function. This catches a
 * table whose rows were authored independently of the model.
 */
export function tableMatchesFunction(spec: LimitTableSpec, f: RealFunctionContract): string[] {
  const e: string[] = [];
  for (const s of spec.approach.steps) {
    const actual = valueAt(f, s.x);
    if (actual === null && s.value === null) continue;
    if (actual === null || s.value === null || Math.abs(actual - s.value) > 1e-9) {
      e.push(`the row at x = ${s.x} does not match the function`);
    }
  }
  return e;
}

// ---------------------------------------------------------------------------
// The secant/tangent figure, built on the existing coordinate graph idea.
// ---------------------------------------------------------------------------

export type SecantGraphSpec = {
  type: 'secant_graph';
  id: string;
  functionRule: string;
  /** Sampled curve points, from the function itself. */
  curve: Array<{ x: number; y: number }>;
  /** The fixed point and the moving one, in order of approach. */
  anchor: { x: number; y: number };
  movers: Array<{ x: number; y: number; slope: number }>;
  /** The value the secant slopes approach, when it exists. */
  limitingSlope: LimitResult;
  span: number;
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export function secantGraph(
  id: string, f: RealFunctionContract, functionRule: string, at: number,
  movers: number[], altText: string, span = 4
): SecantGraphSpec {
  const curve: Array<{ x: number; y: number }> = [];
  for (let x = -span; x <= span; x += span / 60) {
    const v = valueAt(f, x);
    if (v !== null && Math.abs(v) <= span * 2) curve.push({ x, y: v });
  }
  const ay = valueAt(f, at);
  if (ay === null) throw new Error('a secant needs a function value at its anchor');
  return {
    type: 'secant_graph', id, functionRule, curve,
    anchor: { x: at, y: ay },
    movers: movers.map((m) => {
      const my = valueAt(f, m);
      if (my === null) throw new Error(`the function has no value at ${m}`);
      return { x: m, y: my, slope: round((my - ay) / (m - at)) };
    }),
    limitingSlope: limitingSecantSlope(f, at),
    span, altText, caption: altText, status: 'verified',
  };
}

export function validateSecantGraph(spec: SecantGraphSpec): string[] {
  const e: string[] = [];
  if (!spec.curve.length) e.push('the curve must be sampled from the function');
  if (!spec.movers.length) e.push('a secant figure needs at least one moving point');
  if (spec.movers.some((m) => Math.abs(m.x - spec.anchor.x) < 1e-12)) {
    e.push('a moving point must not sit on the anchor — the secant would have no second point');
  }
  if (spec.span <= 0) e.push('the span must be positive');
  if (!spec.altText.trim()) e.push('altText is required');
  return e;
}

/** How a limit reads in a lesson, so no raw state reaches a student. */
export function describeLimit(r: LimitResult): string {
  return r.kind === 'exists' ? `the limit is ${r.value}` : `the limit does not exist, because ${r.reason}`;
}

export function describeComparison(c: PointComparison): string {
  switch (c.kind) {
    case 'agree': return `the function value and the limit are both ${c.value}`;
    case 'differ': return `the function value is ${c.functionValue} but the limit is ${c.limitValue}`;
    case 'undefined_but_limit_exists': return `the function has no value there, yet the limit is ${c.limitValue}`;
    case 'undefined_and_no_limit': return `the function has no value there, and ${c.reason}`;
    case 'defined_but_no_limit': return `the function value is ${c.functionValue}, but ${c.reason}`;
  }
}
