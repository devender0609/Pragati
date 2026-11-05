// ===========================================================================
// v0.84.0-c11.13 checkpoint 84 — A STRAIGHT LINE AS ONE OBJECT.
//
// WHY A COEFFICIENT FORM IS THE CANONICAL ONE
//
// A line is not an equation. Many equations describe the same line, and one
// familiar form cannot describe them all: y = mx + c has nothing to say about
// x = 3, because a vertical line has no slope to put in m. Making slope-
// intercept the internal representation would therefore make vertical lines
// unrepresentable, or force `Infinity` into a field that should hold a number.
//
// So the canonical form here is Ax + By + C = 0 with EXACT rational
// coefficients, normalised deterministically. Every named form in the chapter
// — point-slope, slope-intercept, two-point, intercept, normal — is a way of
// WRITING this object, and each is derived from it rather than stored beside
// it.
//
// WHAT IS REUSED
//
// `coordinateGeometry` supplies Rational, Point and Radical, with exact
// arithmetic and exact distances, from Class 10. Nothing is reimplemented.
// The angle of inclination is an `Angle` from checkpoint 80, and the tangent
// comes from `circularFunctions`; there is no second tangent here.
//
// WHAT IT REFUSES
//
//   * a slope for a vertical line — reported as undefined, never Infinity;
//   * a line with both A and B zero, which is not a line;
//   * intercept form where an intercept is zero, which would divide by zero.
// ===========================================================================

import {
  type Point, type Radical, type Rational, formatRational, rational, ratEq, toNumber,
} from './coordinateGeometry';
import { type Angle, degrees, formatAngle, piMultiple } from './angleMeasure';

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const rAdd = (a: Rational, b: Rational) => rational(a.num * b.den + b.num * a.den, a.den * b.den);
const rSub = (a: Rational, b: Rational) => rational(a.num * b.den - b.num * a.den, a.den * b.den);
const rMul = (a: Rational, b: Rational) => rational(a.num * b.num, a.den * b.den);
const rDiv = (a: Rational, b: Rational) => {
  if (b.num === 0) throw new Error('cannot divide by zero');
  return rational(a.num * b.den, a.den * b.num);
};
const rZero = (a: Rational) => a.num === 0;
const rNeg = (a: Rational) => rational(-a.num, a.den);

// ---------------------------------------------------------------------------
// The line.
// ---------------------------------------------------------------------------

/** Ax + By + C = 0, with A, B, C exact and normalised. */
export type Line = {
  id: string;
  a: Rational;
  b: Rational;
  c: Rational;
  label?: string;
};

/**
 * Normalisation, so that two equations of the same line become the same
 * object. Coefficients are cleared to integers, divided by their common
 * factor, and given a fixed sign: the first non-zero of A then B is positive.
 * Exact throughout — no floating normalisation anywhere.
 */
function normalise(a: Rational, b: Rational, c: Rational): [Rational, Rational, Rational] {
  if (rZero(a) && rZero(b)) {
    throw new Error('Ax + By + C = 0 is not a line when both A and B are zero');
  }
  const lcm = (x: number, y: number) => Math.abs(x * y) / (gcd(x, y) || 1);
  const den = [a, b, c].reduce((acc, r) => lcm(acc, r.den), 1);
  let ia = a.num * (den / a.den);
  let ib = b.num * (den / b.den);
  let ic = c.num * (den / c.den);
  const g = gcd(gcd(Math.abs(ia), Math.abs(ib)), Math.abs(ic)) || 1;
  ia /= g; ib /= g; ic /= g;
  const lead = ia !== 0 ? ia : ib;
  if (lead < 0) { ia = -ia; ib = -ib; ic = -ic; }
  return [rational(ia, 1), rational(ib, 1), rational(ic, 1)];
}

export function line(id: string, a: number | Rational, b: number | Rational, c: number | Rational, label?: string): Line {
  const toR = (v: number | Rational) => (typeof v === 'number' ? rational(v, 1) : v);
  const [na, nb, nc] = normalise(toR(a), toR(b), toR(c));
  return { id, a: na, b: nb, c: nc, label };
}

/** Two lines are the same line when their normalised coefficients agree. */
export const sameLine = (l: Line, m: Line): boolean =>
  ratEq(l.a, m.a) && ratEq(l.b, m.b) && ratEq(l.c, m.c);

export const isVertical = (l: Line): boolean => rZero(l.b);
export const isHorizontal = (l: Line): boolean => rZero(l.a);

export const pointIsOn = (l: Line, p: Point): boolean =>
  rZero(rAdd(rAdd(rMul(l.a, p.x), rMul(l.b, p.y)), l.c));

// ---------------------------------------------------------------------------
// Slope. Undefined is a kind, not a very large number.
// ---------------------------------------------------------------------------

export type Slope =
  | { kind: 'defined'; value: Rational }
  | { kind: 'undefined'; reason: string };

export const definedSlope = (r: Rational): Slope => ({ kind: 'defined', value: r });

/** For Ax + By + C = 0 with B not zero, the slope is -A/B. */
export function slopeOf(l: Line): Slope {
  if (isVertical(l)) {
    return {
      kind: 'undefined',
      reason: 'the line is vertical, so no change in x accompanies a change in y and the ratio has no value',
    };
  }
  return definedSlope(rDiv(rNeg(l.a), l.b));
}

export function formatSlope(s: Slope): string {
  return s.kind === 'undefined' ? 'not defined' : formatRational(s.value);
}

export function slopeValue(s: Slope): number {
  if (s.kind === 'undefined') throw new Error(`no slope: ${s.reason}`);
  return toNumber(s.value);
}

/** Slope from two points, refusing the vertical case rather than faking it. */
export function slopeThrough(p: Point, q: Point): Slope {
  const run = rSub(q.x, p.x);
  if (rZero(run)) {
    return {
      kind: 'undefined',
      reason: `both points have x = ${formatRational(p.x)}, so the line is vertical and its slope is not defined`,
    };
  }
  return definedSlope(rDiv(rSub(q.y, p.y), run));
}

/** The line through two distinct points, vertical case included. */
export function lineThrough(id: string, p: Point, q: Point, label?: string): Line {
  if (ratEq(p.x, q.x) && ratEq(p.y, q.y)) {
    throw new Error('two distinct points are needed to determine a line');
  }
  // (y2 - y1)x - (x2 - x1)y + (x2 y1 - x1 y2) = 0 works for every case.
  const a = rSub(q.y, p.y);
  const b = rNeg(rSub(q.x, p.x));
  const c = rSub(rMul(q.x, p.y), rMul(p.x, q.y));
  return line(id, a, b, c, label);
}

/** The line through a point with a given slope. */
export const lineFromPointSlope = (id: string, p: Point, m: Rational, label?: string): Line =>
  // y - y1 = m(x - x1)  becomes  mx - y + (y1 - m x1) = 0
  line(id, m, rational(-1, 1), rSub(p.y, rMul(m, p.x)), label);

/** A vertical line x = k, which no point-slope form can express. */
export const verticalLine = (id: string, k: Rational, label?: string): Line =>
  line(id, rational(1, 1), rational(0, 1), rNeg(k), label);

export const horizontalLine = (id: string, k: Rational, label?: string): Line =>
  line(id, rational(0, 1), rational(1, 1), rNeg(k), label);

// ---------------------------------------------------------------------------
// Inclination, using the typed angle and the existing tangent.
// ---------------------------------------------------------------------------

/** Exact inclinations the chapter uses, matched by slope. */
const EXACT_INCLINATIONS: Array<{ slope: Rational; angle: Angle }> = [
  { slope: rational(0, 1), angle: degrees(0) },
  { slope: rational(1, 1), angle: degrees(45) },
  { slope: rational(-1, 1), angle: degrees(135) },
];

/**
 * The angle of inclination: the angle the line makes with the positive
 * direction of the x-axis, measured anticlockwise, with m = tan of it.
 * A vertical line has inclination 90 degrees and no slope, which is exactly
 * the case that breaks m = tan θ and is reported rather than smoothed over.
 */
export function inclination(l: Line): Angle {
  if (isVertical(l)) return degrees(90);
  const s = slopeOf(l) as Extract<Slope, { kind: 'defined' }>;
  for (const e of EXACT_INCLINATIONS) if (ratEq(e.slope, s.value)) return e.angle;
  const deg = (Math.atan(toNumber(s.value)) * 180) / Math.PI;
  return degrees(Math.round(deg < 0 ? deg + 180 : deg));
}

/**
 * Whether the inclination this model reports is EXACT. For the slopes the
 * chapter uses by name — 0, 1 and -1 — it is. For any other slope the angle
 * is not a whole number of degrees, and rounding it to one would make
 * m = tan(inclination) quietly false, so the inexactness is reported instead
 * of being hidden behind a tolerance.
 */
export const inclinationIsExact = (l: Line): boolean =>
  isVertical(l) || EXACT_INCLINATIONS.some((e) => ratEq(e.slope, (slopeOf(l) as Extract<Slope, { kind: 'defined' }>).value));

/**
 * Whether m = tan(inclination) holds, checked rather than asserted.
 *
 * A vertical line returns false, which is the point: tan 90 degrees has no
 * value, so the relation genuinely does not hold there. Where the reported
 * inclination is rounded, agreement is checked only to the precision that
 * rounding allows, and `inclinationIsExact` says which case you are in.
 */
export function slopeMatchesInclination(l: Line, tolerance = 1e-9): boolean {
  if (isVertical(l)) return false; // tan 90 has no value, which is the point
  const theta = inclination(l) as { num: number; den: number };
  const d = theta.num / theta.den;
  const m = slopeValue(slopeOf(l));
  // Rounding the angle to a whole degree moves its tangent by roughly
  // (1 + m squared) times the angle error, so the allowance has to grow with
  // the slope rather than being a fixed number.
  const tol = inclinationIsExact(l) ? tolerance : (1 + m * m) * ((0.5 * Math.PI) / 180) * 1.2;
  return Math.abs(Math.tan((d * Math.PI) / 180) - slopeValue(slopeOf(l))) < tol;
}

// ---------------------------------------------------------------------------
// Parallel and perpendicular, from coefficients so vertical lines work.
// ---------------------------------------------------------------------------

/** A1 B2 = A2 B1. True for two verticals, which a slope test would miss. */
export const areParallel = (l: Line, m: Line): boolean =>
  rZero(rSub(rMul(l.a, m.b), rMul(m.a, l.b)));

/** A1 A2 + B1 B2 = 0. True for horizontal against vertical. */
export const arePerpendicular = (l: Line, m: Line): boolean =>
  rZero(rAdd(rMul(l.a, m.a), rMul(l.b, m.b)));

/**
 * tan of the angle between two lines, as the source writes it for lines with
 * defined slopes. Null where the formula has no value: parallel lines, or a
 * perpendicular pair whose denominator vanishes.
 */
export function tanAngleBetween(l: Line, m: Line): Rational | null {
  if (isVertical(l) || isVertical(m)) return null;
  if (areParallel(l, m)) return null;
  const m1 = (slopeOf(l) as Extract<Slope, { kind: 'defined' }>).value;
  const m2 = (slopeOf(m) as Extract<Slope, { kind: 'defined' }>).value;
  const den = rAdd(rational(1, 1), rMul(m1, m2));
  if (rZero(den)) return null; // perpendicular: the angle is a right angle
  const t = rDiv(rSub(m2, m1), den);
  return t.num < 0 ? rNeg(t) : t; // the acute angle
}

export function describeAngleBetween(l: Line, m: Line): string {
  if (areParallel(l, m)) return 'the lines are parallel, so there is no angle between them to speak of';
  if (arePerpendicular(l, m)) return 'the lines are perpendicular, so the angle between them is a right angle';
  const t = tanAngleBetween(l, m);
  return t ? `the acute angle between the lines has tangent ${formatRational(t)}` : 'the angle is a right angle';
}

// ---------------------------------------------------------------------------
// The named forms, each DERIVED from the one object.
// ---------------------------------------------------------------------------

const term = (coef: Rational, varName: string): string => {
  if (rZero(coef)) return '';
  if (ratEq(coef, rational(1, 1))) return varName;
  if (ratEq(coef, rational(-1, 1))) return `\u2212${varName}`;
  return `${formatRational(coef)}${varName}`;
};

/** Ax + By + C = 0, which every line has. */
export function generalForm(l: Line): string {
  const parts: string[] = [];
  const push = (s: string, r: Rational) => {
    if (!s) return;
    if (!parts.length) parts.push(s);
    else parts.push(r.num < 0 ? `\u2212 ${s.replace('\u2212', '')}` : `+ ${s}`);
  };
  push(term(l.a, 'x'), l.a);
  push(term(l.b, 'y'), l.b);
  if (!rZero(l.c)) push(formatRational(rational(Math.abs(l.c.num), l.c.den)), l.c);
  return `${parts.join(' ')} = 0`;
}

/** y = mx + c, available only when the line is not vertical. */
export function slopeInterceptForm(l: Line): string | null {
  if (isVertical(l)) return null;
  const m = (slopeOf(l) as Extract<Slope, { kind: 'defined' }>).value;
  const c = rDiv(rNeg(l.c), l.b);
  const mPart = ratEq(m, rational(0, 1)) ? '' : ratEq(m, rational(1, 1)) ? 'x'
    : ratEq(m, rational(-1, 1)) ? '\u2212x' : `${formatRational(m)}x`;
  if (rZero(c)) return `y = ${mPart || '0'}`;
  if (!mPart) return `y = ${formatRational(c)}`;
  return `y = ${mPart} ${c.num < 0 ? '\u2212' : '+'} ${formatRational(rational(Math.abs(c.num), c.den))}`;
}

/** The axis-parallel form, for the lines that have one. */
export function axisParallelForm(l: Line): string | null {
  if (isVertical(l)) return `x = ${formatRational(rDiv(rNeg(l.c), l.a))}`;
  if (isHorizontal(l)) return `y = ${formatRational(rDiv(rNeg(l.c), l.b))}`;
  return null;
}

export function pointSlopeForm(l: Line, p: Point): string | null {
  const s = slopeOf(l);
  if (s.kind === 'undefined') return null;
  if (!pointIsOn(l, p)) throw new Error('the point is not on the line, so no point-slope form through it exists');
  return `y \u2212 ${formatRational(p.y)} = ${formatRational(s.value)}(x \u2212 ${formatRational(p.x)})`;
}

export type Intercepts = { x: Rational | null; y: Rational | null };

export function intercepts(l: Line): Intercepts {
  return {
    x: rZero(l.a) ? null : rDiv(rNeg(l.c), l.a),
    y: rZero(l.b) ? null : rDiv(rNeg(l.c), l.b),
  };
}

/** x/a + y/b = 1, which needs both intercepts non-zero. */
export function interceptForm(l: Line): string | null {
  const { x, y } = intercepts(l);
  if (!x || !y || rZero(x) || rZero(y)) return null;
  return `x/${formatRational(x)} + y/${formatRational(y)} = 1`;
}

// ---------------------------------------------------------------------------
// Distance from a point to a line, exact.
// ---------------------------------------------------------------------------

/**
 * |Ax1 + By1 + C| / root(A^2 + B^2), returned as a `Radical` so that an
 * irrational distance keeps its radical rather than becoming a decimal.
 *
 * The value does not depend on how the equation was scaled: multiplying A, B
 * and C by k multiplies the numerator by |k| and the denominator by |k| too.
 * Normalisation makes that automatic here, and a test checks it anyway.
 */
export function distanceToLine(l: Line, p: Point): Radical {
  const num = rAdd(rAdd(rMul(l.a, p.x), rMul(l.b, p.y)), l.c);
  const absNum = rational(Math.abs(num.num), num.den);
  const sq = rAdd(rMul(l.a, l.a), rMul(l.b, l.b)); // whole number after normalising
  const radicand = sq.num * sq.den;
  if (radicand === 0) throw new Error('not a line');
  let coefficient = rational(absNum.num * sq.den, absNum.den * sq.num);
  let inside = radicand;
  // Pull every perfect square out, so the distance from the origin to
  // 3x + 4y - 5 = 0 reads as 1 rather than as one fifth of root 25.
  for (let f = Math.floor(Math.sqrt(inside)); f >= 2; f -= 1) {
    if (inside % (f * f) === 0) {
      coefficient = rational(coefficient.num * f, coefficient.den);
      inside /= f * f;
      f = Math.floor(Math.sqrt(inside)) + 1;
    }
  }
  // A zero distance is zero, with no radical left hanging beside it.
  if (coefficient.num === 0) return { coefficient: rational(0, 1), radicand: 1 };
  return { coefficient, radicand: inside };
}

/** Perpendicular distance from the origin, which the normal form uses. */
export const distanceFromOrigin = (l: Line): Radical =>
  distanceToLine(l, { id: 'O', x: rational(0, 1), y: rational(0, 1), label: 'O' });

// ---------------------------------------------------------------------------
// The visual. Created with its validator, union entry and renderer together.
// ---------------------------------------------------------------------------

export type LineGraphSpec = {
  type: 'coordinate_line_graph';
  id: string;
  lines: Line[];
  /**
   * Points claimed to lie ON one of the drawn lines. The validator checks
   * that claim, so a figure cannot assert a point is on a line it misses.
   */
  markedPoints: Point[];
  /**
   * Points deliberately OFF the lines — the point whose distance is being
   * measured, for instance. Kept separate so the figure says which claim it
   * is making about each mark rather than leaving it to the reader.
   */
  externalPoints?: Point[];
  /** Half-width of the visible window; the origin is always in view. */
  span: number;
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export function lineGraph(
  id: string, lines: Line[], altText: string,
  options: { markedPoints?: Point[]; externalPoints?: Point[]; span?: number } = {}
): LineGraphSpec {
  return {
    type: 'coordinate_line_graph', id, lines,
    markedPoints: options.markedPoints ?? [],
    externalPoints: options.externalPoints ?? [],
    span: options.span ?? 6,
    altText, caption: altText, status: 'verified',
  };
}

export function validateLineGraph(spec: LineGraphSpec): string[] {
  const e: string[] = [];
  if (!spec.lines.length) e.push('the figure draws no line, so it claims nothing');
  for (const p of spec.markedPoints) {
    if (!spec.lines.some((l) => pointIsOn(l, p))) {
      e.push(`${p.label} is marked as on a line but lies on none of them`);
    }
  }
  for (const p of spec.externalPoints ?? []) {
    if (spec.lines.some((l) => pointIsOn(l, p))) {
      e.push(`${p.label} is marked as off the lines but actually lies on one`);
    }
  }
  if (spec.span <= 0) e.push('the span must be positive');
  if (!spec.altText.trim()) e.push('altText is required');
  return e;
}

/** Two points on the line, used only for drawing; the line is infinite. */
export function drawingEndpoints(l: Line, span: number): [{ x: number; y: number }, { x: number; y: number }] {
  const A = toNumber(l.a), B = toNumber(l.b), C = toNumber(l.c);
  if (B === 0) {
    const x = -C / A;
    return [{ x, y: -span }, { x, y: span }];
  }
  const yAt = (x: number) => (-C - A * x) / B;
  return [{ x: -span, y: yAt(-span) }, { x: span, y: yAt(span) }];
}

export { formatRational, formatAngle, piMultiple };
