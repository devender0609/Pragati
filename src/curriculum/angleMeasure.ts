// ===========================================================================
// v0.84.0-c11.9 checkpoint 80 — ANGLE AS A SIGNED, TYPED ROTATION.
//
// WHY THIS IS A NEW MODULE AND NOT AN EXTENSION
//
// Class 10's `specialAngles` is correct for what it owns: acute angles of a
// right triangle, measured in degrees, drawn from a five-value table. Sixty-
// five frozen lessons rest on exactly that behaviour. Class 11 needs
// something with a different shape — signed rotations, arbitrary real
// arguments, radian measure, coterminal positions — and widening the Class 10
// object to cover it would quietly change what those sixty-five lessons mean
// by "angle".
//
// So this lives beside it. The two agree at 30, 45 and 60 degrees, and a
// compatibility test proves it; neither imports the other's semantics.
//
// THE CENTRAL FIX
//
// A bare 60 does not say whether it means degrees or radians, and in Class 11
// both are ordinary. Every angle here therefore carries its unit. There is no
// representation of an angle that has forgotten what it measures.
//
// Exact arithmetic is borrowed from `specialAngles` — `Exact` is (p/q)√k with
// no acute-angle assumption in it, a number helper rather than a model. That
// is reuse of arithmetic, not of the Class 10 trigonometry.
// ===========================================================================

import { type Exact, exact, exactValue, formatExact } from './specialAngles';

export type AngleUnit = 'degree' | 'radian';

/**
 * An angle in degrees, held as an exact rational so that 22.5 and -45 are
 * both representable without floating point entering the mathematics.
 */
export type DegreeAngle = { unit: 'degree'; num: number; den: number };

/**
 * An angle in radians, held as an exact rational MULTIPLE OF PI. 0 is the
 * rational 0; π/3 is 1/3. Radian angles that are not rational multiples of π
 * are outside what this chapter needs and are deliberately not representable,
 * rather than being approximated.
 */
export type RadianAngle = { unit: 'radian'; piNum: number; piDen: number };

export type Angle = DegreeAngle | RadianAngle;

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const reduce = (n: number, d: number): [number, number] => {
  if (d === 0) throw new Error('angle with zero denominator');
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  const s = d < 0 ? -1 : 1;
  return [(n / g) * s, Math.abs(d / g)];
};

export function degrees(num: number, den = 1): DegreeAngle {
  const [n, d] = reduce(num, den);
  return { unit: 'degree', num: n, den: d };
}

/** `piMultiple(1, 3)` is π/3. `piMultiple(0)` is the zero angle. */
export function piMultiple(piNum: number, piDen = 1): RadianAngle {
  const [n, d] = reduce(piNum, piDen);
  return { unit: 'radian', piNum: n, piDen: d };
}

export const isDegree = (a: Angle): a is DegreeAngle => a.unit === 'degree';
export const isRadian = (a: Angle): a is RadianAngle => a.unit === 'radian';

/** Sign is part of the angle: a negative measure is a clockwise rotation. */
export const sense = (a: Angle): 'anticlockwise' | 'clockwise' | 'none' => {
  const n = isDegree(a) ? a.num : a.piNum;
  return n > 0 ? 'anticlockwise' : n < 0 ? 'clockwise' : 'none';
};

// ---------------------------------------------------------------------------
// Conversion. One exact object in, one exact object out, sign preserved.
// ---------------------------------------------------------------------------

/** π radians = 180 degrees, applied exactly. */
export function toRadian(a: Angle): RadianAngle {
  if (isRadian(a)) return a;
  return piMultiple(a.num, a.den * 180);
}

export function toDegree(a: Angle): DegreeAngle {
  if (isDegree(a)) return a;
  return degrees(a.piNum * 180, a.piDen);
}

export function sameAngle(a: Angle, b: Angle): boolean {
  const x = toRadian(a), y = toRadian(b);
  return x.piNum * y.piDen === y.piNum * x.piDen;
}

export function formatAngle(a: Angle): string {
  if (isDegree(a)) {
    const v = a.den === 1 ? String(a.num) : `${a.num}/${a.den}`;
    return `${v}\u00b0`;
  }
  if (a.piNum === 0) return '0';
  const sign = a.piNum < 0 ? '\u2212' : '';
  const n = Math.abs(a.piNum);
  const top = n === 1 ? '\u03c0' : `${n}\u03c0`;
  return a.piDen === 1 ? `${sign}${top}` : `${sign}${top}/${a.piDen}`;
}

/** A numeric value, for sampling and for checks only — never for teaching. */
export const radianValue = (a: Angle): number => {
  const r = toRadian(a);
  return (r.piNum / r.piDen) * Math.PI;
};

// ---------------------------------------------------------------------------
// Coterminal positions.
// ---------------------------------------------------------------------------

/** Add a whole number of turns. The terminal side does not move. */
export function addTurns(a: Angle, turns: number): Angle {
  if (isDegree(a)) return degrees(a.num + 360 * turns * a.den, a.den);
  return piMultiple(a.piNum + 2 * turns * a.piDen, a.piDen);
}

export function isCoterminal(a: Angle, b: Angle): boolean {
  const x = toRadian(a), y = toRadian(b);
  // x - y must be an even integer multiple of pi.
  const num = x.piNum * y.piDen - y.piNum * x.piDen;
  const den = x.piDen * y.piDen;
  if (num % den !== 0) return false;
  return (num / den) % 2 === 0;
}

/** The coterminal angle in [0, 2π), which the unit circle actually uses. */
export function principal(a: Angle): RadianAngle {
  const r = toRadian(a);
  const period = 2 * r.piDen;
  let n = r.piNum % period;
  if (n < 0) n += period;
  return piMultiple(n, r.piDen);
}

// ---------------------------------------------------------------------------
// The geometric definition, which the conversion follows from.
// ---------------------------------------------------------------------------

/** Arc length on a circle of radius r: s = rθ with θ in radians. */
export const arcLengthFor = (radiusTimesRadians: number) => radiusTimesRadians;

/** Exact helpers re-exported so a lesson need not reach into Class 10. */
export { type Exact, exact, exactValue, formatExact };
