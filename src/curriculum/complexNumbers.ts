// ===========================================================================
// v0.84.0-c11.12 checkpoint 83 — THE COMPLEX NUMBER AS AN EXACT OBJECT.
//
// WHAT THIS OWNS
//
// One semantic complex number drives everything downstream: arithmetic,
// powers of i, division, conjugate, modulus, the Argand point, the polar
// form and the roots of a quadratic. No representation is authored twice.
//
// EXACTNESS
//
// Real and imaginary parts are exact RATIONALS, not floats, so 1/3 + i/7 is
// a number rather than an approximation of one. Modulus uses `Exact` from
// `specialAngles` — the (p/q)root(k) helper that already exists — so the
// modulus of 1 + i is root(2), not 1.4142135623730951. No second radical
// system is invented.
//
// WHAT IT REFUSES
//
//   * division by zero, which throws rather than returning Infinity;
//   * an argument for 0 + 0i, which is genuinely not defined and is
//     reported as such rather than quietly becoming 0;
//   * the unsafe radical law root(-a)root(-b) = root(ab). The textbook
//     cautions against it at section 4.3.6 and this module gives no
//     operation that could perform it.
//
// ANGLES
//
// The argument is an `Angle` from checkpoint 80's `angleMeasure`, which
// carries its unit. It is not a bare number that has forgotten whether it
// means degrees or radians.
// ===========================================================================

import { type Exact, exact, exactValue, formatExact } from './specialAngles';
import { type Angle, degrees, formatAngle, piMultiple, radianValue } from './angleMeasure';

/** An exact rational. Denominator is always positive and the fraction reduced. */
export type Rational = { n: number; d: number };

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

export function rational(n: number, d = 1): Rational {
  if (d === 0) throw new Error('a rational cannot have denominator zero');
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  const s = d < 0 ? -1 : 1;
  return { n: (n / g) * s, d: Math.abs(d / g) };
}

const rAdd = (a: Rational, b: Rational) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
const rSub = (a: Rational, b: Rational) => rational(a.n * b.d - b.n * a.d, a.d * b.d);
const rMul = (a: Rational, b: Rational) => rational(a.n * b.n, a.d * b.d);
const rDiv = (a: Rational, b: Rational) => {
  if (b.n === 0) throw new Error('cannot divide a rational by zero');
  return rational(a.n * b.d, a.d * b.n);
};
const rIsZero = (a: Rational) => a.n === 0;
const rValue = (a: Rational) => a.n / a.d;
const rEq = (a: Rational, b: Rational) => a.n === b.n && a.d === b.d;

export function formatRational(a: Rational): string {
  return a.d === 1 ? String(a.n) : `${a.n}/${a.d}`;
}

// ---------------------------------------------------------------------------
// The number itself. Identity is the pair of parts; display is separate.
// ---------------------------------------------------------------------------

export type Complex = { re: Rational; im: Rational };

export const complex = (re: number | Rational, im: number | Rational = 0): Complex => ({
  re: typeof re === 'number' ? rational(re) : re,
  im: typeof im === 'number' ? rational(im) : im,
});

/** The imaginary unit. `i` squared is minus one, which is the whole point. */
export const I: Complex = complex(0, 1);
export const ZERO: Complex = complex(0, 0);
export const ONE: Complex = complex(1, 0);

export const realPart = (z: Complex): Rational => z.re;
export const imaginaryPart = (z: Complex): Rational => z.im;
export const isReal = (z: Complex): boolean => rIsZero(z.im);
export const isPurelyImaginary = (z: Complex): boolean => rIsZero(z.re) && !rIsZero(z.im);
export const isZero = (z: Complex): boolean => rIsZero(z.re) && rIsZero(z.im);

/** Equality is component by component, never string comparison. */
export const complexEqual = (a: Complex, b: Complex): boolean =>
  rEq(a.re, b.re) && rEq(a.im, b.im);

/**
 * Display. Identity lives above; this only decides how it is written, so
 * 3 + (-2)i reads as 3 - 2i and 5 + 0i reads as 5.
 */
export function formatComplex(z: Complex): string {
  const re = formatRational(z.re);
  if (rIsZero(z.im)) return re;
  const absIm = rational(Math.abs(z.im.n), z.im.d);
  const unit = absIm.n === 1 && absIm.d === 1 ? 'i' : `${formatRational(absIm)}i`;
  if (rIsZero(z.re)) return z.im.n < 0 ? `\u2212${unit}` : unit;
  return `${re} ${z.im.n < 0 ? '\u2212' : '+'} ${unit}`;
}

// ---------------------------------------------------------------------------
// Arithmetic, derived from the parts.
// ---------------------------------------------------------------------------

export const add = (a: Complex, b: Complex): Complex =>
  ({ re: rAdd(a.re, b.re), im: rAdd(a.im, b.im) });

export const subtract = (a: Complex, b: Complex): Complex =>
  ({ re: rSub(a.re, b.re), im: rSub(a.im, b.im) });

/** (a+ib)(c+id) = (ac - bd) + i(ad + bc), the minus coming from i squared. */
export const multiply = (a: Complex, b: Complex): Complex => ({
  re: rSub(rMul(a.re, b.re), rMul(a.im, b.im)),
  im: rAdd(rMul(a.re, b.im), rMul(a.im, b.re)),
});

export const negate = (z: Complex): Complex =>
  ({ re: rational(-z.re.n, z.re.d), im: rational(-z.im.n, z.im.d) });

/** The conjugate flips the sign of the imaginary part only. */
export const conjugate = (z: Complex): Complex =>
  ({ re: z.re, im: rational(-z.im.n, z.im.d) });

/**
 * Division, by the conjugate route the textbook uses: multiplying above and
 * below by the conjugate of the divisor makes the denominator real, because
 * (c+id)(c-id) = c squared + d squared.
 */
export function divide(a: Complex, b: Complex): Complex {
  if (isZero(b)) {
    throw new Error('cannot divide a complex number by zero; the quotient has no value');
  }
  const conj = conjugate(b);
  const num = multiply(a, conj);
  const den = rAdd(rMul(b.re, b.re), rMul(b.im, b.im)); // real and positive
  return { re: rDiv(num.re, den), im: rDiv(num.im, den) };
}

export const reciprocal = (z: Complex): Complex => divide(ONE, z);

/** The real denominator a division produces, exposed so a lesson can show it. */
export const divisionDenominator = (b: Complex): Rational =>
  rAdd(rMul(b.re, b.re), rMul(b.im, b.im));

// ---------------------------------------------------------------------------
// Powers of i, by the cycle rather than by repeated multiplication.
// ---------------------------------------------------------------------------

const I_CYCLE: Complex[] = [ONE, I, complex(-1, 0), complex(0, -1)];

/**
 * i to an integer power. Reduced modulo 4, so i to the 2026 is one step of
 * arithmetic rather than 2026 multiplications, and no floating complex
 * exponentiation is involved anywhere.
 */
export function powerOfI(n: number): Complex {
  if (!Number.isInteger(n)) throw new Error('only integer powers of i are defined here');
  const r = ((n % 4) + 4) % 4;
  return I_CYCLE[r];
}

/** The remainder that decides the value, for a lesson to show its working. */
export const powerOfIRemainder = (n: number): number => ((n % 4) + 4) % 4;

export function integerPower(z: Complex, n: number): Complex {
  if (!Number.isInteger(n) || n < 0) throw new Error('only non-negative integer powers here');
  let out = ONE;
  for (let k = 0; k < n; k += 1) out = multiply(out, z);
  return out;
}

// ---------------------------------------------------------------------------
// Modulus, exact.
// ---------------------------------------------------------------------------

/**
 * |z| = root(a squared + b squared), returned as an `Exact` so that |3+4i|
 * is 5 and |1+i| is root(2) rather than a decimal.
 */
export function modulus(z: Complex): Exact {
  const sq = rAdd(rMul(z.re, z.re), rMul(z.im, z.im));
  // |0| is 0. Class 10's `exact` requires a positive radicand, which is
  // correct for it, so the zero case is handled here rather than by
  // loosening a guard sixty-five frozen lessons depend on.
  if (sq.n === 0) return exact(0, 1);
  // root(n/d) = root(nd)/d, which keeps the radicand a whole number.
  return exact(1, sq.d, sq.n * sq.d);
}

export const modulusValue = (z: Complex): number => exactValue(modulus(z));
export const formatModulus = (z: Complex): string => formatExact(modulus(z));

/** |z| squared, which is exactly z times its conjugate and always rational. */
export const modulusSquared = (z: Complex): Rational =>
  rAdd(rMul(z.re, z.re), rMul(z.im, z.im));

// ---------------------------------------------------------------------------
// The Argand position. The point is derived from z, never authored beside it.
// ---------------------------------------------------------------------------

export type ArgandPoint = { x: number; y: number; label: string; z: Complex };

export function argandPoint(z: Complex, label?: string): ArgandPoint {
  return { x: rValue(z.re), y: rValue(z.im), label: label ?? formatComplex(z), z };
}

export type Quadrant = 1 | 2 | 3 | 4;
export type AxisPlacement = 'origin' | 'positive real axis' | 'negative real axis'
  | 'positive imaginary axis' | 'negative imaginary axis';

/** Where z sits. An axis is an axis, not a quadrant forced to fit a table. */
export function placement(z: Complex): Quadrant | AxisPlacement {
  const a = z.re.n, b = z.im.n;
  if (a === 0 && b === 0) return 'origin';
  if (b === 0) return a > 0 ? 'positive real axis' : 'negative real axis';
  if (a === 0) return b > 0 ? 'positive imaginary axis' : 'negative imaginary axis';
  if (a > 0 && b > 0) return 1;
  if (a < 0 && b > 0) return 2;
  if (a < 0 && b < 0) return 3;
  return 4;
}

// ---------------------------------------------------------------------------
// Polar form. The argument is an Angle, and zero has none.
// ---------------------------------------------------------------------------

export type PolarForm = {
  modulus: Exact;
  /** Not defined for 0 + 0i, which is reported rather than given a fake angle. */
  argument: Angle | null;
  argumentDefined: boolean;
  /** Why the argument is absent, when it is. */
  note?: string;
};

/** Exact arguments for the cases this chapter uses. Quadrant-aware. */
const EXACT_ARGUMENTS: Array<{ re: number; im: number; angle: Angle }> = [
  { re: 1, im: 0, angle: piMultiple(0) },
  { re: 0, im: 1, angle: piMultiple(1, 2) },
  { re: -1, im: 0, angle: piMultiple(1) },
  { re: 0, im: -1, angle: piMultiple(-1, 2) },
  { re: 1, im: 1, angle: piMultiple(1, 4) },
  { re: -1, im: 1, angle: piMultiple(3, 4) },
  { re: -1, im: -1, angle: piMultiple(-3, 4) },
  { re: 1, im: -1, angle: piMultiple(-1, 4) },
];

export function polarForm(z: Complex): PolarForm {
  if (isZero(z)) {
    return {
      modulus: exact(0, 1), argument: null, argumentDefined: false,
      note: 'the argument of 0 is not defined, because the origin determines no direction',
    };
  }
  const a = rValue(z.re), b = rValue(z.im);
  // Match an exact direction by ratio, so 2 + 2i gets pi/4 like 1 + i.
  for (const e of EXACT_ARGUMENTS) {
    const sameDirection =
      Math.sign(a) === Math.sign(e.re) && Math.sign(b) === Math.sign(e.im) &&
      Math.abs(a * e.im - b * e.re) < 1e-12;
    if (sameDirection) return { modulus: modulus(z), argument: e.angle, argumentDefined: true };
  }
  // Otherwise a quadrant-aware numeric argument. atan2, never atan(b/a).
  const theta = Math.atan2(b, a);
  return {
    modulus: modulus(z),
    argument: degrees(Math.round((theta * 180) / Math.PI)),
    argumentDefined: true,
    note: 'the argument here is given to the nearest degree, not exactly',
  };
}

export function formatPolar(z: Complex): string {
  const p = polarForm(z);
  if (!p.argumentDefined || !p.argument) return 'not defined for 0';
  return `${formatExact(p.modulus)}(cos ${formatAngle(p.argument)} + i sin ${formatAngle(p.argument)})`;
}

/** Rebuild z from r and theta, to show the two forms are one number. */
export function fromPolar(r: number, argument: Angle): { x: number; y: number } {
  const t = radianValue(argument);
  return { x: r * Math.cos(t), y: r * Math.sin(t) };
}

/** Whether the polar form returns the number it came from. */
export function polarRoundTrips(z: Complex, tolerance = 1e-9): boolean {
  const p = polarForm(z);
  if (!p.argument) return isZero(z);
  const back = fromPolar(exactValue(p.modulus), p.argument);
  return Math.abs(back.x - rValue(z.re)) < tolerance && Math.abs(back.y - rValue(z.im)) < tolerance;
}

// ---------------------------------------------------------------------------
// Quadratics with a negative discriminant.
// ---------------------------------------------------------------------------

export type ComplexRoots = {
  discriminant: number;
  /** 'real' when D >= 0; this module only completes the D < 0 case. */
  kind: 'real' | 'complex_conjugate';
  /**
   * The exact pair, present only when the imaginary part is rational. An
   * irrational part cannot be held exactly here, so this is null rather than
   * an approximation — `writtenRoots` carries the exact form regardless.
   */
  roots: [Complex, Complex] | null;
  rootsAreRational?: boolean;
  /** The surd part, written as i root(|D|) rather than root of a negative. */
  writtenRoots: string;
};

/**
 * Roots of ax^2 + bx + c with real integer coefficients. Where D is negative
 * the roots are a conjugate pair, written with i outside the radical — never
 * as the square root of a negative number, which the textbook's section 4.3.6
 * caution exists to prevent.
 */
export function complexRoots(a: number, b: number, c: number): ComplexRoots {
  if (a === 0) throw new Error('not a quadratic: the coefficient of x squared is zero');
  const D = b * b - 4 * a * c;
  if (D >= 0) {
    return { discriminant: D, kind: 'real', roots: null, writtenRoots: 'both roots are real' };
  }
  const den = 2 * a;
  const re = rational(-b, den);
  // Pull any perfect square out of the radical and reduce against the
  // denominator, so a discriminant of -16 gives 2i rather than i root(16)/2.
  let outside = 1, inside = Math.abs(D);
  for (let f = Math.floor(Math.sqrt(inside)); f >= 2; f -= 1) {
    if (inside % (f * f) === 0) { outside *= f; inside /= f * f; break; }
  }
  const coeff = rational(outside, Math.abs(den));
  const unit = inside === 1
    ? (coeff.n === 1 && coeff.d === 1 ? 'i' : `${formatRational(coeff)}i`)
    : (coeff.n === 1 && coeff.d === 1 ? `i\u221a${inside}` : `${formatRational(coeff)}i\u221a${inside}`);
  // The parts are exact rationals ONLY when the surd disappears. Where it
  // does not, the imaginary part is irrational and this model holds exact
  // rationals, so it returns no Complex pair rather than a decimal wearing
  // a fraction's clothes. `writtenRoots` stays exact in either case.
  const roots: [Complex, Complex] | null = inside === 1
    ? [{ re, im: coeff }, { re, im: rational(-coeff.n, coeff.d) }]
    : null;
  return {
    discriminant: D,
    kind: 'complex_conjugate',
    roots,
    rootsAreRational: inside === 1,
    writtenRoots: `${formatRational(re)} \u00b1 ${unit}`,
  };
}

/** The pair really are conjugates of one another. */
export const rootsAreConjugates = (r: ComplexRoots): boolean =>
  !!r.roots && complexEqual(r.roots[0], conjugate(r.roots[1]));

/** True for every negative discriminant: the written pair differ only in sign. */
export const writtenRootsArePair = (r: ComplexRoots): boolean =>
  r.kind === 'complex_conjugate' && r.writtenRoots.includes('\u00b1');

export { formatExact, formatAngle };

// ---------------------------------------------------------------------------
// The Argand visual spec.
//
// Checkpoint 82 found that two graph specs had been built, validated and
// attached to lessons while rendering nothing, because nobody wired them into
// the union or the dispatch. So this spec is created together with its
// validator branch, its union entry, its renderer and a test that drives the
// real shared renderer — in this checkpoint, not a later one.
// ---------------------------------------------------------------------------

export type ArgandSpec = {
  type: 'argand_plane';
  id: string;
  points: ArgandPoint[];
  /** Draw a segment from the origin to each point, as a modulus does. */
  showVectors?: boolean;
  /** Mark the angle at the origin, which the polar lesson uses. */
  showArgument?: boolean;
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export function argandSpec(
  id: string, zs: Array<{ z: Complex; label?: string }>, altText: string,
  options: { showVectors?: boolean; showArgument?: boolean } = {}
): ArgandSpec {
  return {
    type: 'argand_plane', id,
    points: zs.map((e) => argandPoint(e.z, e.label)),
    ...options, altText, caption: altText, status: 'verified',
  };
}

/** Every plotted point must be the number it claims. No duplicated truth. */
export function validateArgand(spec: ArgandSpec): string[] {
  const e: string[] = [];
  if (!spec.points.length) e.push('the diagram plots no point, so it claims nothing');
  for (const p of spec.points) {
    const expected = argandPoint(p.z, p.label);
    if (Math.abs(expected.x - p.x) > 1e-12) {
      e.push(`${p.label} is plotted at real coordinate ${p.x} but its real part is ${expected.x}`);
    }
    if (Math.abs(expected.y - p.y) > 1e-12) {
      e.push(`${p.label} is plotted at imaginary coordinate ${p.y} but its imaginary part is ${expected.y}`);
    }
  }
  if (!spec.altText.trim()) e.push('altText is required');
  return e;
}

/** A description naming the number, both coordinates and where it sits. */
export function describeArgandPoint(z: Complex): string {
  const where = placement(z);
  const place = typeof where === 'number' ? `quadrant ${where}` : `the ${where}`;
  return `${formatComplex(z)} at real coordinate ${formatRational(z.re)} and imaginary coordinate ${formatRational(z.im)}, in ${place}`;
}
