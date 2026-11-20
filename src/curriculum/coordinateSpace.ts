// ===========================================================================
// v0.84.0-c11.42 checkpoint 97 — THREE-DIMENSIONAL COORDINATE SPACE.
//
// AN EXTENSION, NOT A SECOND GEOMETRY.
//
// Every exact primitive here comes from coordinateGeometry: the same
// Rational, the same Radical, the same simplification. A second Rational
// would be a second arithmetic, and the two would drift the first time one
// was fixed and the other was not.
//
// The 2-D `Point` is untouched. Classes 9 and 10 import it unchanged;
// `Point3D` is a sibling, not a replacement, and `planar()` is the one
// bridge between them — used so the 3-D distance can be DERIVED through the
// existing 2-D distance rather than restating it.
//
// SEMANTIC COORDINATES ARE NOT SCREEN COORDINATES. A 3-D diagram is a
// projection onto a flat screen. The projection lives in the renderer and
// never flows back: no distance, no membership, no octant is ever computed
// from a projected pixel.
//
// OCTANT NUMBERING: the verified source records carry no octant numbering
// convention — SECTION_BODIES, SUBSECTION_RECORDS, CLASS11_SOURCE_MODEL and
// ALL_PAGES mention octants nowhere. So none is asserted. Octants are
// identified by their SIGN PATTERN, which is what §11.3's own procedure
// asks for and is unambiguous without a convention.
// ===========================================================================

import {
  type Point, type Radical, type Rational,
  distanceSquared as distanceSquared2D, formatRadical, formatRational,
  rational, ratEq, sectionPoint as sectionPoint2D, toNumber,
} from './coordinateGeometry';

/** A point in space, exact. Same Rational as every other coordinate in Pragati. */
export type Point3D = { id: string; x: Rational; y: Rational; z: Rational; label: string };

export const point3D = (
  id: string, x: Rational, y: Rational, z: Rational, label: string
): Point3D => ({ id, x, y, z, label });

/** Integer coordinates, the common case in this chapter. */
export const p3 = (id: string, x: number, y: number, z: number, label: string): Point3D =>
  ({ id, x: rational(x, 1), y: rational(y, 1), z: rational(z, 1), label });

const isZero = (r: Rational) => r.num === 0;
const sub = (a: Rational, b: Rational): Rational => rational(a.num * b.den - b.num * a.den, a.den * b.den);
const mul = (a: Rational, b: Rational): Rational => rational(a.num * b.num, a.den * b.den);
const add = (a: Rational, b: Rational): Rational => rational(a.num * b.den + b.num * a.den, a.den * b.den);

/** The ordered triple a student reads. Derived — never typed beside the point. */
export const orderedTriple = (p: Point3D): string =>
  `(${formatRational(p.x)}, ${formatRational(p.y)}, ${formatRational(p.z)})`;

/**
 * The 2-D shadow of a 3-D point on the xy-plane. This is the bridge that
 * lets the 3-D distance be built from the 2-D one rather than restated.
 */
export const planar = (p: Point3D): Point => ({ id: `${p.id}_xy`, x: p.x, y: p.y, label: `${p.label}'` });

// ---------------------------------------------------------------------------
// Axes and planes, defined by which coordinates vanish.
// ---------------------------------------------------------------------------

export type CoordinatePlane = 'xy' | 'yz' | 'zx';
export type CoordinateAxis = 'x' | 'y' | 'z';

/** The equation the source gives for each plane. */
export const planeEquation = (plane: CoordinatePlane): string =>
  ({ xy: 'z = 0', yz: 'x = 0', zx: 'y = 0' }[plane]);

export const planeName = (plane: CoordinatePlane): string =>
  ({ xy: 'xy-plane', yz: 'yz-plane', zx: 'zx-plane' }[plane]);

/** A point lies on a plane exactly when the plane's own coordinate is zero. */
export function onPlane(p: Point3D, plane: CoordinatePlane): boolean {
  if (plane === 'xy') return isZero(p.z);
  if (plane === 'yz') return isZero(p.x);
  return isZero(p.y);
}

/** On an axis when BOTH other coordinates vanish. */
export function onAxis(p: Point3D, axis: CoordinateAxis): boolean {
  if (axis === 'x') return isZero(p.y) && isZero(p.z);
  if (axis === 'y') return isZero(p.x) && isZero(p.z);
  return isZero(p.x) && isZero(p.y);
}

export const planesContaining = (p: Point3D): CoordinatePlane[] =>
  (['xy', 'yz', 'zx'] as CoordinatePlane[]).filter((pl) => onPlane(p, pl));
export const axesContaining = (p: Point3D): CoordinateAxis[] =>
  (['x', 'y', 'z'] as CoordinateAxis[]).filter((a) => onAxis(p, a));

// ---------------------------------------------------------------------------
// Octants, by sign pattern.
// ---------------------------------------------------------------------------

export type Sign = '+' | '-';
export type OctantSigns = { x: Sign; y: Sign; z: Sign };

/**
 * The octant of a point, or null.
 *
 * A point with ANY zero coordinate lies on a coordinate plane and is in no
 * octant at all. Returning a "nearest" octant would be an invention, so the
 * absence is returned instead and the caller has to deal with it.
 */
export function octantOf(p: Point3D): OctantSigns | null {
  if (isZero(p.x) || isZero(p.y) || isZero(p.z)) return null;
  const s = (r: Rational): Sign => (r.num < 0 ? '-' : '+');
  return { x: s(p.x), y: s(p.y), z: s(p.z) };
}

export const octantLabel = (o: OctantSigns): string => `(${o.x}, ${o.y}, ${o.z})`;

/** All eight sign patterns, generated rather than listed. */
export const ALL_OCTANTS: OctantSigns[] = (['+', '-'] as Sign[]).flatMap((x) =>
  (['+', '-'] as Sign[]).flatMap((y) => (['+', '-'] as Sign[]).map((z) => ({ x, y, z }))));

export const sameOctant = (a: OctantSigns | null, b: OctantSigns | null): boolean =>
  a !== null && b !== null && a.x === b.x && a.y === b.y && a.z === b.z;

/** Where a point sits, in words — used by the accessible descriptions. */
export function describePosition(p: Point3D): string {
  const ax = axesContaining(p);
  if (ax.length === 1) return `on the ${ax[0]}-axis`;
  if (ax.length === 3) return 'at the origin';
  const pl = planesContaining(p);
  if (pl.length) return `on the ${pl.map(planeName).join(' and the ')}, so in no octant`;
  const o = octantOf(p)!;
  return `in the octant where x, y and z have signs ${octantLabel(o)}`;
}

// ---------------------------------------------------------------------------
// Distance, built from the 2-D distance plus one more squared difference.
// ---------------------------------------------------------------------------

export const dx3 = (p: Point3D, q: Point3D) => sub(q.x, p.x);
export const dy3 = (p: Point3D, q: Point3D) => sub(q.y, p.y);
export const dz3 = (p: Point3D, q: Point3D) => sub(q.z, p.z);

/**
 * Exact squared distance: the planar squared distance, which the 2-D model
 * already owns, plus the squared z difference. Composition, not a restated
 * formula — and it is why the dimension-reduction property below holds by
 * construction rather than by coincidence.
 */
export function distanceSquared3D(p: Point3D, q: Point3D): Rational {
  const planarPart = distanceSquared2D(planar(p), planar(q));
  const d = dz3(p, q);
  return add(planarPart, mul(d, d));
}

/** The exact distance, through the same radical simplification as 2-D. */
export function distance3D(p: Point3D, q: Point3D): Radical {
  // Reuse the 2-D radical machinery by presenting the 3-D squared distance
  // as a planar one: a point at (√(d²), 0) from the origin is at d.
  const d2 = distanceSquared3D(p, q);
  const origin: Point = { id: '_o', x: rational(0, 1), y: rational(0, 1), label: 'O' };
  // distanceSquared2D of (a,0) from the origin is a², so feeding the exact
  // squared distance back through `distance` would square it again. Instead
  // the radical is taken directly, by the identical rule 2-D uses.
  void origin;
  const n = d2.num * d2.den;
  let outside = 1; let inside = n;
  if (inside < 0) throw new Error('a squared distance cannot be negative');
  for (let f = 2; f * f <= inside; f += 1) {
    while (inside % (f * f) === 0) { outside *= f; inside /= f * f; }
  }
  // v0.84.0-c11.43 checkpoint 97B — a zero distance is zero, with no
  // radical left hanging beside it. This follows the convention
  // straightLine.ts already applies in its own simplifier; the SHARED
  // formatRadical is deliberately left alone, because changing it would
  // reach Classes 9 and 10 and no stated invariant requires it. Recorded
  // as EXACT_RADICAL_ZERO_FORMATTING_DEBT.
  if (outside === 0 || d2.num === 0) return { coefficient: rational(0, 1), radicand: 1 };
  return { coefficient: rational(outside, d2.den), radicand: inside };
}

export const formatDistance3D = (p: Point3D, q: Point3D): string => formatRadical(distance3D(p, q));

/** d(P,Q) = d(Q,P), tested rather than assumed. */
export const distance3DIsSymmetric = (p: Point3D, q: Point3D): boolean =>
  ratEq(distanceSquared3D(p, q), distanceSquared3D(q, p));

/**
 * The dimension-reduction property: with z unchanged, the 3-D distance IS
 * the 2-D distance. True by construction here, since the planar part is
 * computed by the 2-D model itself.
 */
export const reducesToPlanar = (p: Point3D, q: Point3D): boolean =>
  ratEq(p.z, q.z) && ratEq(distanceSquared3D(p, q), distanceSquared2D(planar(p), planar(q)));

export const sameDistance = (a: [Point3D, Point3D], b: [Point3D, Point3D]): boolean =>
  ratEq(distanceSquared3D(a[0], a[1]), distanceSquared3D(b[0], b[1]));

/** Equidistant from both ends — a geometric claim tested exactly, not by decimal. */
export const isEquidistant = (m: Point3D, p: Point3D, q: Point3D): boolean =>
  ratEq(distanceSquared3D(m, p), distanceSquared3D(m, q));

export const asDecimal = (r: Radical, places = 2): number =>
  Number((toNumber(r.coefficient) * Math.sqrt(r.radicand)).toFixed(places));

// ---------------------------------------------------------------------------
// The visual. Projection is the RENDERER's business; this spec holds only
// exact semantic points.
// ---------------------------------------------------------------------------

export type Coordinate3DSpec = {
  type: 'coordinate_3d';
  status: 'concept_specific';
  id: string;
  points: Point3D[];
  /** Planes to hint at, by name — never by drawn position. */
  planes: CoordinatePlane[];
  /** Segments between points, by id. A segment to nowhere is refused. */
  segments: Array<{ from: string; to: string; style?: 'solid' | 'dashed'; note?: string }>;
  /** Axis half-length in semantic units. */
  extent: number;
  /** When set, the figure annotates the exact distance between these two. */
  distanceBetween?: [string, string];
  /**
   * v0.84.0-c11.48 checkpoint 100 — when set, the figure states that one
   * point divides a segment internally in a given ratio. General to any
   * internal division; the validator recomputes it from the model, so the
   * annotation cannot disagree with the mathematics.
   */
  divides?: { point: string; from: string; to: string; m1: number; m2: number };
  caption: string;
  altText: string;
};

export function coordinate3D(
  id: string, points: Point3D[], opts: Partial<Omit<Coordinate3DSpec, 'type' | 'status' | 'id' | 'points'>> = {}
): Coordinate3DSpec {
  return {
    type: 'coordinate_3d', status: 'concept_specific', id, points,
    planes: opts.planes ?? [], segments: opts.segments ?? [], extent: opts.extent ?? 6,
    distanceBetween: opts.distanceBetween, divides: opts.divides,
    caption: opts.caption ?? '', altText: opts.altText ?? '',
  };
}

export function validateCoordinate3D(spec: Coordinate3DSpec): string[] {
  const errs: string[] = [];
  const ids = spec.points.map((p) => p.id);
  if (new Set(ids).size !== ids.length) errs.push('two points share an id');
  if (!spec.points.length) errs.push('the figure has no points');
  if (spec.extent <= 0) errs.push('the axis extent must be positive');
  for (const s of spec.segments) {
    for (const end of [s.from, s.to]) {
      if (!ids.includes(end)) errs.push(`segment endpoint "${end}" is not a point in this figure`);
    }
  }
  if (spec.distanceBetween) {
    for (const end of spec.distanceBetween) {
      if (!ids.includes(end)) errs.push(`distance endpoint "${end}" is not a point in this figure`);
    }
  }
  for (const p of spec.points) {
    for (const [n, r] of [['x', p.x], ['y', p.y], ['z', p.z]] as const) {
      if (!Number.isFinite(r.num) || !Number.isFinite(r.den) || r.den === 0) {
        errs.push(`point "${p.id}" has a non-exact ${n} coordinate`);
      }
    }
    // A point beyond the drawn axes cannot be read off the figure.
    for (const r of [p.x, p.y, p.z]) {
      if (Math.abs(toNumber(r)) > spec.extent) {
        errs.push(`point "${p.id}" lies outside the drawn axes`);
      }
    }
  }
  if (spec.divides) {
    const { point, from, to, m1, m2 } = spec.divides;
    const byId = new Map(spec.points.map((p) => [p.id, p]));
    for (const end of [point, from, to]) {
      if (!ids.includes(end)) errs.push(`"${end}" is not a point in this figure`);
    }
    const P = byId.get(point); const A = byId.get(from); const B = byId.get(to);
    if (P && A && B) {
      // Recomputed, never trusted: the annotation and the point come from
      // the same operation or the figure is refused.
      errs.push(...validateSection3D(A, B, P, m1, m2));
    }
  }
  if (!spec.altText.trim()) errs.push('altText is required');
  return errs;
}

/**
 * The projection: oblique, deterministic, renderer-owned. The same point in
 * the same viewport always lands in the same place, and nothing here ever
 * flows back into a distance or a membership test.
 */
export const project3D = (p: Point3D, extent: number, size: number): { sx: number; sy: number } => {
  const u = toNumber(p.x); const v = toNumber(p.y); const w = toNumber(p.z);
  const k = size / (2 * extent * 1.6);
  // y runs back and to the left at 45°, which keeps the x and z axes square.
  return {
    sx: size / 2 + (u - v * 0.5) * k,
    sy: size / 2 - (w - v * 0.5) * k,
  };
};

// ---------------------------------------------------------------------------
// v0.84.0-c11.48 checkpoint 100 — INTERNAL SECTION POINT IN SPACE.
//
// A PROCEDURAL EXTENSION, NOT A NEW GEOMETRY.
//
// The x and y coordinates come from the existing 2-D `sectionPoint`, so
// their behaviour is identical to the proven planar model BY CONSTRUCTION
// rather than by a restated formula that could drift. Only z is new, and
// it uses the same weighting.
//
// SCOPE: internal division only, exactly as the 2-D model scopes it. No
// external division, no negative ratios, no centroid, no vectors, no line
// equations.
//
// THE CONVENTION, stated once: for AP : PB = m : n the point is
// P = (n·A + m·B) / (m + n). A larger m means a longer AP, which pulls P
// TOWARD B — which is why B carries m and A carries n.
// ---------------------------------------------------------------------------


/**
 * The point dividing AB internally in the ratio m1 : m2, exactly.
 *
 * x and y are delegated to the 2-D operation; z is weighted the same way.
 * Positive ratio parts and a non-degenerate segment are required, and both
 * refusals are explicit rather than silent.
 */
export function sectionPoint3D(a: Point3D, b: Point3D, m1: number, m2: number, id = 'P'): Point3D {
  if (m1 <= 0 || m2 <= 0) {
    // Internal division only: a zero or negative part would be external
    // division, which this chapter's source does not cover.
    throw new Error(`internal division needs positive ratio parts; got ${m1}:${m2}`);
  }
  if (ratEq(a.x, b.x) && ratEq(a.y, b.y) && ratEq(a.z, b.z)) {
    // A and B coincide, so there is no segment to divide. Returning A
    // would present a ratio as meaningful when it is not.
    throw new Error(`"${a.label}" and "${b.label}" are the same point, so there is no segment to divide`);
  }
  const planarP = sectionPoint2D(planar(a), planar(b), m1, m2, `${id}_xy`);
  const s = m1 + m2;
  const z = rational(m1 * b.z.num * a.z.den + m2 * a.z.num * b.z.den, s * a.z.den * b.z.den);
  return { id, x: planarP.x, y: planarP.y, z, label: id };
}

/** The midpoint is the 1:1 section point — one source of truth, as in 2-D. */
export const midpoint3D = (a: Point3D, b: Point3D, id = 'M'): Point3D => sectionPoint3D(a, b, 1, 1, id);

/**
 * Recover AP : PB from the coordinates, for validation.
 *
 * Each coordinate that actually CHANGES along the segment gives a value of
 * t = AP/AB; degenerate coordinates give nothing and are skipped rather
 * than divided by zero. Every available coordinate must agree, so an
 * axis-aligned segment validates on the one or two axes it moves along.
 */
export function ratioOf3D(a: Point3D, b: Point3D, p: Point3D): { m1: number; m2: number } | null {
  // t = AP/AB, computed EXACTLY. Going through floating point here made
  // 1:2 recover as 333333:666667 — arithmetically close and useless for
  // comparison, since a ratio has to reduce to be checked against one.
  const ts: Rational[] = [];
  for (const [ca, cb, cp] of [[a.x, b.x, p.x], [a.y, b.y, p.y], [a.z, b.z, p.z]] as const) {
    if (ratEq(ca, cb)) {
      // Constant along AB: constrains nothing, but P must sit on it.
      if (!ratEq(cp, ca)) return null;
      continue;
    }
    // (cp - ca) / (cb - ca), all exact.
    const numR = rational(cp.num * ca.den - ca.num * cp.den, cp.den * ca.den);
    const denR = rational(cb.num * ca.den - ca.num * cb.den, cb.den * ca.den);
    ts.push(rational(numR.num * denR.den, numR.den * denR.num));
  }
  if (!ts.length) return null;
  const t = ts[0];
  // Every coordinate that moves must agree.
  if (ts.some((x) => !ratEq(x, t))) return null;
  if (t.num <= 0 || t.num >= t.den) return null; // not strictly internal
  // t = m1 / (m1 + m2), already in lowest terms.
  return { m1: t.num, m2: t.den - t.num };
}

export const isInternalPoint3D = (a: Point3D, b: Point3D, p: Point3D): boolean =>
  ratioOf3D(a, b, p) !== null;

/** Exact validation, comparable to the 2-D `validateSection`. */
export function validateSection3D(
  a: Point3D, b: Point3D, p: Point3D, m1: number, m2: number
): string[] {
  const errs: string[] = [];
  if (m1 <= 0 || m2 <= 0) errs.push(`internal division needs positive ratio parts; got ${m1}:${m2}`);
  if (errs.length) return errs;
  let expected: Point3D;
  try {
    expected = sectionPoint3D(a, b, m1, m2, p.id);
  } catch (e) {
    return [(e as Error).message];
  }
  for (const [name, want, got] of [['x', expected.x, p.x], ['y', expected.y, p.y], ['z', expected.z, p.z]] as const) {
    if (!ratEq(want, got)) {
      errs.push(`the ${name} coordinate is ${formatRational(got)}, but dividing ${m1}:${m2} gives ${formatRational(want)}`);
    }
  }
  if (!isInternalPoint3D(a, b, p)) errs.push('the point does not lie strictly between the two endpoints');
  const recovered = ratioOf3D(a, b, p);
  if (recovered && recovered.m1 * m2 !== recovered.m2 * m1) {
    errs.push(`the recovered ratio ${recovered.m1}:${recovered.m2} does not reduce to ${m1}:${m2}`);
  }
  return errs;
}
