// ===========================================================================
// v0.84.0-c11.9 checkpoint 80 — TRIGONOMETRIC FUNCTIONS OF A REAL ARGUMENT.
//
// Class 10 defines sine as a ratio of two sides of a right triangle, which
// confines it to acute angles. Class 11 defines it as a coordinate on the
// unit circle, which does not. That is not a widening of the same definition;
// it is a different one that happens to agree on the acute range, and a
// compatibility test here proves the agreement at 30, 45 and 60 degrees
// without either model importing the other.
//
// WHAT THIS MODULE OWNS
//
//   * the unit-circle point for an angle, with x squared plus y squared = 1;
//   * all six functions, cos and sin read off the coordinates and the other
//     four DERIVED by division, so a zero denominator produces an undefined
//     value rather than a number that has to be annotated;
//   * domain exclusions, range and period as properties of a function rather
//     than sentences beside it;
//   * graph samples, generated from the function and BROKEN at every
//     excluded argument, so no curve is ever drawn through an asymptote.
//
// Undefined is a kind, never Infinity and never NaN — the same discipline
// `specialAngles` applies at 90 degrees, carried into a model with infinitely
// many such arguments.
// ===========================================================================

import {
  type Angle, type Exact, exact, exactValue, formatExact, formatAngle,
  degrees, piMultiple, principal, radianValue, toRadian,
} from './angleMeasure';

export type FunctionName = 'sin' | 'cos' | 'tan' | 'cosec' | 'sec' | 'cot';
export const FUNCTION_NAMES: FunctionName[] = ['sin', 'cos', 'tan', 'cosec', 'sec', 'cot'];

/** A value is either exact, or undefined for a stated mathematical reason. */
export type CircularValue =
  | { kind: 'defined'; exact: Exact }
  | { kind: 'undefined'; reason: string };

export const defined = (e: Exact): CircularValue => ({ kind: 'defined', exact: e });
export const undef = (reason: string): CircularValue => ({ kind: 'undefined', reason });
export const isDefinedValue = (v: CircularValue): v is Extract<CircularValue, { kind: 'defined' }> =>
  v.kind === 'defined';

export function numberOf(v: CircularValue): number {
  if (v.kind === 'undefined') throw new Error(`no value: ${v.reason}`);
  return exactValue(v.exact);
}

/**
 * Class 10's `formatExact` special-cases a numerator of 1 but not of -1, so
 * it renders -√3/2 as "-1√3/2". That file is frozen and 65 lessons depend on
 * its exact output, so the negative case is handled here instead of there.
 */
export function formatSigned(e: Exact): string {
  if (e.p >= 0) return formatExact(e);
  const positive = formatExact(exact(-e.p, e.q, e.k));
  return `\u2212${positive}`;
}

export function writtenValue(v: CircularValue): string {
  return v.kind === 'undefined' ? 'not defined' : formatSigned(v.exact);
}

// ---------------------------------------------------------------------------
// The unit circle. cos and sin are the coordinates; nothing else is authored.
// ---------------------------------------------------------------------------

export type UnitCirclePoint = { x: Exact; y: Exact; angle: Angle };

/** Exact coordinates for the arguments this chapter uses. */
const QUARTER: Array<{ deg: number; x: Exact; y: Exact }> = [
  { deg: 0, x: exact(1, 1), y: exact(0, 1) },
  { deg: 30, x: exact(1, 2, 3), y: exact(1, 2) },
  { deg: 45, x: exact(1, 2, 2), y: exact(1, 2, 2) },
  { deg: 60, x: exact(1, 2), y: exact(1, 2, 3) },
  { deg: 90, x: exact(0, 1), y: exact(1, 1) },
];

const negate = (e: Exact): Exact => exact(-e.p, e.q, e.k);

/**
 * The point on the unit circle for any angle whose principal value is a
 * multiple of 15 degrees built from the quarter table. The quadrant decides
 * the signs, which is the whole content of the signs lesson.
 */
export function unitCirclePoint(a: Angle): UnitCirclePoint {
  const p = principal(a);
  const deg = (p.piNum * 180) / p.piDen;
  const within = ((deg % 360) + 360) % 360;
  const quadrant = Math.floor(within / 90);
  const inQuarter = within - quadrant * 90;
  const base = QUARTER.find((q) => q.deg === inQuarter);
  if (!base) {
    throw new Error(
      `the unit-circle point for ${formatAngle(a)} is not exactly representable in this model`
    );
  }
  // Rotating by a quarter turn swaps the coordinates and changes a sign.
  const table: Array<{ x: Exact; y: Exact }> = [
    { x: base.x, y: base.y },
    { x: negate(base.y), y: base.x },
    { x: negate(base.x), y: negate(base.y) },
    { x: base.y, y: negate(base.x) },
  ];
  const { x, y } = table[quadrant];
  return { x, y, angle: a };
}

/** The defining property. Checked, not assumed. */
export function onUnitCircle(pt: UnitCirclePoint): boolean {
  const v = exactValue(pt.x) ** 2 + exactValue(pt.y) ** 2;
  return Math.abs(v - 1) < 1e-12;
}

const divide = (a: Exact, b: Exact, reason: string): CircularValue => {
  if (b.p === 0) return undef(reason);
  // (p1/q1)\u221ak1 \u00f7 (p2/q2)\u221ak2
  //   = (p1 q2)/(q1 p2) \u00b7 \u221a(k1/k2)
  //   = (p1 q2)/(q1 p2 k2) \u00b7 \u221a(k1 k2)   after rationalising.
  // An earlier version kept b.k in the numerator as well, which cancelled it
  // and made tan 45\u00b0 come out as 2. The Class 10 compatibility check caught
  // it, which is what that check is for.
  const num = a.p * b.q;
  const den = a.q * b.p * b.k;
  return defined(exact(num, den, a.k * b.k));
};

/** All six, with only cos and sin read from the circle. */
export function valueAt(a: Angle, name: FunctionName): CircularValue {
  const pt = unitCirclePoint(a);
  const cos = pt.x, sin = pt.y;
  const one = exact(1, 1);
  switch (name) {
    case 'cos': return defined(cos);
    case 'sin': return defined(sin);
    case 'tan': return divide(sin, cos, `cos ${formatAngle(a)} is zero, so the quotient sin/cos has no value`);
    case 'cot': return divide(cos, sin, `sin ${formatAngle(a)} is zero, so the quotient cos/sin has no value`);
    case 'sec': return divide(one, cos, `cos ${formatAngle(a)} is zero, so the reciprocal 1/cos has no value`);
    case 'cosec': return divide(one, sin, `sin ${formatAngle(a)} is zero, so the reciprocal 1/sin has no value`);
  }
}

/** sin² + cos² = 1 for every representable argument. */
export function pythagoreanHolds(a: Angle): boolean {
  const s = numberOf(valueAt(a, 'sin')), c = numberOf(valueAt(a, 'cos'));
  return Math.abs(s * s + c * c - 1) < 1e-12;
}

// ---------------------------------------------------------------------------
// Quadrants, derived from coordinate signs rather than from a mnemonic.
// ---------------------------------------------------------------------------

export type Quadrant = 1 | 2 | 3 | 4;
export type AxisPosition = 'positive_x' | 'positive_y' | 'negative_x' | 'negative_y';

/** An argument on an axis belongs to no quadrant, and is reported as such. */
export function quadrantOf(a: Angle): Quadrant | AxisPosition {
  const p = principal(a);
  const within = ((p.piNum * 180) / p.piDen) % 360;
  if (within === 0) return 'positive_x';
  if (within === 90) return 'positive_y';
  if (within === 180) return 'negative_x';
  if (within === 270) return 'negative_y';
  return (Math.floor(within / 90) + 1) as Quadrant;
}

export const signOf = (v: CircularValue): '+' | '\u2212' | '0' | 'not defined' => {
  if (v.kind === 'undefined') return 'not defined';
  return v.exact.p > 0 ? '+' : v.exact.p < 0 ? '\u2212' : '0';
};

/** The sign table, computed from the coordinates of a representative angle. */
export function signsInQuadrant(q: Quadrant): Record<FunctionName, '+' | '\u2212'> {
  const rep = degrees(45 + (q - 1) * 90);
  const out = {} as Record<FunctionName, '+' | '\u2212'>;
  for (const n of FUNCTION_NAMES) {
    const s = signOf(valueAt(rep, n));
    if (s !== '+' && s !== '\u2212') throw new Error(`${n} has no sign at ${formatAngle(rep)}`);
    out[n] = s;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Functions as objects: domain, range, period, and graph sampling.
// ---------------------------------------------------------------------------

export type CircularFunction = {
  name: FunctionName;
  /** The period, as an exact multiple of π. */
  period: { piNum: number; piDen: number };
  /** Arguments excluded from the domain, described in source terms. */
  domainExclusion: string | null;
  rangeDescription: string;
  /** Whether a real y lies in the range. */
  inRange: (y: number) => boolean;
};

const EXCLUDE_COS_ZERO = 'all odd multiples of \u03c0/2, where cos is zero';
const EXCLUDE_SIN_ZERO = 'all integer multiples of \u03c0, where sin is zero';

export const CIRCULAR_FUNCTIONS: Record<FunctionName, CircularFunction> = {
  sin: { name: 'sin', period: { piNum: 2, piDen: 1 }, domainExclusion: null,
    rangeDescription: '[\u22121, 1]', inRange: (y) => y >= -1 - 1e-12 && y <= 1 + 1e-12 },
  cos: { name: 'cos', period: { piNum: 2, piDen: 1 }, domainExclusion: null,
    rangeDescription: '[\u22121, 1]', inRange: (y) => y >= -1 - 1e-12 && y <= 1 + 1e-12 },
  tan: { name: 'tan', period: { piNum: 1, piDen: 1 }, domainExclusion: EXCLUDE_COS_ZERO,
    rangeDescription: 'all real numbers', inRange: () => true },
  cot: { name: 'cot', period: { piNum: 1, piDen: 1 }, domainExclusion: EXCLUDE_SIN_ZERO,
    rangeDescription: 'all real numbers', inRange: () => true },
  sec: { name: 'sec', period: { piNum: 2, piDen: 1 }, domainExclusion: EXCLUDE_COS_ZERO,
    rangeDescription: 'all reals of absolute value at least 1', inRange: (y) => Math.abs(y) >= 1 - 1e-12 },
  cosec: { name: 'cosec', period: { piNum: 2, piDen: 1 }, domainExclusion: EXCLUDE_SIN_ZERO,
    rangeDescription: 'all reals of absolute value at least 1', inRange: (y) => Math.abs(y) >= 1 - 1e-12 },
};

export const inDomain = (name: FunctionName, radians: number): boolean => {
  const f = CIRCULAR_FUNCTIONS[name];
  if (!f.domainExclusion) return true;
  const halfPi = Math.PI / 2;
  if (f.domainExclusion === EXCLUDE_COS_ZERO) {
    const k = radians / halfPi;
    return !(Math.abs(k - Math.round(k)) < 1e-9 && Math.round(k) % 2 !== 0);
  }
  const k = radians / Math.PI;
  return !(Math.abs(k - Math.round(k)) < 1e-9);
};

export const evaluate = (name: FunctionName, radians: number): number | null => {
  if (!inDomain(name, radians)) return null;
  const s = Math.sin(radians), c = Math.cos(radians);
  switch (name) {
    case 'sin': return s; case 'cos': return c;
    case 'tan': return s / c; case 'cot': return c / s;
    case 'sec': return 1 / c; case 'cosec': return 1 / s;
  }
};

/**
 * A graph as a list of SEPARATE branches. A branch ends wherever the function
 * leaves its domain, so nothing downstream can draw a line through an
 * asymptote: the break is in the data, not in the renderer's good manners.
 */
export type GraphBranch = { points: Array<{ x: number; y: number }> };
export type CircularGraph = {
  type: 'circular_graph';
  id: string;
  functionName: FunctionName;
  fromRadians: number;
  toRadians: number;
  branches: GraphBranch[];
  /** Arguments where the function is undefined, inside the plotted range. */
  breaks: number[];
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export function sampleGraph(
  name: FunctionName, from: number, to: number, step = Math.PI / 60, clamp = 8
): { branches: GraphBranch[]; breaks: number[] } {
  const branches: GraphBranch[] = [];
  const breaks: number[] = [];
  let current: Array<{ x: number; y: number }> = [];
  for (let x = from; x <= to + 1e-9; x += step) {
    const y = evaluate(name, x);
    if (y === null || Math.abs(y) > clamp) {
      if (y === null) breaks.push(Number(x.toFixed(10)));
      if (current.length) { branches.push({ points: current }); current = []; }
      continue;
    }
    current.push({ x: Number(x.toFixed(10)), y: Number(y.toFixed(10)) });
  }
  if (current.length) branches.push({ points: current });
  return { branches, breaks };
}

export function buildGraph(
  id: string, name: FunctionName, from: number, to: number, altText: string
): CircularGraph {
  const { branches, breaks } = sampleGraph(name, from, to);
  return {
    type: 'circular_graph', id, functionName: name, fromRadians: from, toRadians: to,
    branches, breaks, altText, caption: altText, status: 'verified',
  };
}

export function validateGraph(g: CircularGraph): string[] {
  const e: string[] = [];
  const f = CIRCULAR_FUNCTIONS[g.functionName];
  if (!g.branches.length) e.push('the graph has no sampled points');
  if (!f.domainExclusion && g.branches.length !== 1) {
    e.push(`${g.functionName} is defined everywhere, so its graph should be one unbroken branch`);
  }
  if (f.domainExclusion && g.branches.length < 2) {
    e.push(`${g.functionName} leaves its domain inside this range, so its graph must be broken into branches`);
  }
  for (const b of g.branches) {
    for (const p of b.points) {
      const y = evaluate(g.functionName, p.x);
      if (y === null) { e.push(`a plotted point at ${p.x} is outside the domain`); continue; }
      if (Math.abs(y - p.y) > 1e-6) e.push(`a plotted point at ${p.x} does not come from ${g.functionName}`);
      if (!f.inRange(p.y)) e.push(`a plotted value ${p.y} lies outside the range of ${g.functionName}`);
    }
    // No branch may step across a break.
    for (const br of g.breaks) {
      const spans = b.points.some((p) => p.x < br) && b.points.some((p) => p.x > br);
      if (spans) e.push(`a branch crosses the undefined argument at ${br}`);
    }
  }
  if (!g.altText.trim()) e.push('altText is required');
  return e;
}

/** Periodicity, checked against the model rather than asserted in prose. */
export function periodHolds(name: FunctionName, samples = 40): boolean {
  const f = CIRCULAR_FUNCTIONS[name];
  const period = (f.period.piNum / f.period.piDen) * Math.PI;
  for (let i = 1; i <= samples; i += 1) {
    const x = -3 + (6 * i) / samples;
    const a = evaluate(name, x), b = evaluate(name, x + period);
    if (a === null || b === null) continue;
    if (Math.abs(a - b) > 1e-9) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// General solutions: an infinite family, parameterised by an integer.
// ---------------------------------------------------------------------------

export type GeneralSolution = {
  equation: 'sin' | 'cos' | 'tan';
  /** The reference angle y in sin x = sin y. */
  reference: Angle;
  /** Written in source form, with n ranging over the integers. */
  written: string;
  parameterSymbol: string;
  parameterDomain: '\u2124';
};

export function generalSolution(equation: 'sin' | 'cos' | 'tan', reference: Angle): GeneralSolution {
  const y = formatAngle(toRadian(reference));
  const written =
    equation === 'sin' ? `x = n\u03c0 + (\u22121)\u207f ${y}, n \u2208 \u2124`
    : equation === 'cos' ? `x = 2n\u03c0 \u00b1 ${y}, n \u2208 \u2124`
    : `x = n\u03c0 + ${y}, n \u2208 \u2124`;
  return { equation, reference, written, parameterSymbol: 'n', parameterDomain: '\u2124' };
}

/** Members of the family for given n, used to show the family is infinite. */
export function solutionMembers(s: GeneralSolution, ns: number[]): number[] {
  const y = radianValue(s.reference);
  return ns.map((n) =>
    s.equation === 'sin' ? n * Math.PI + (-1) ** n * y
    : s.equation === 'cos' ? 2 * n * Math.PI + y
    : n * Math.PI + y
  );
}

/** Every member really solves the equation. */
export function solutionFamilyChecks(s: GeneralSolution, ns = [-2, -1, 0, 1, 2]): boolean {
  const y = radianValue(s.reference);
  const target = s.equation === 'sin' ? Math.sin(y) : s.equation === 'cos' ? Math.cos(y) : Math.tan(y);
  return solutionMembers(s, ns).every((x) => {
    const v = s.equation === 'sin' ? Math.sin(x) : s.equation === 'cos' ? Math.cos(x) : Math.tan(x);
    return Math.abs(v - target) < 1e-9;
  });
}

export { formatAngle, degrees, piMultiple };
