// ===========================================================================
// v0.84.0-c10.12 checkpoint 66 — REGIONS OF A CIRCLE, AS RELATED PARTS.
//
// Checkpoint 32 taught the geometry layer to DRAW a circle and an arc. What
// it cannot do is say what a region IS. A sector and a segment share an arc
// and look alike under a fill colour, and nothing in the figure spec would
// notice if a lesson shaded one and computed the other.
//
// So a region here has semantic identity and, where it is a difference,
// structure. The minor segment is not a shape that happens to have an area;
// it is `sector MINUS triangle`, and its area is computed from that
// composition rather than typed beside it. This is the checkpoint-56
// principle — CompositeSolidSpec derived exposed surface from the joins —
// applied to the plane.
//
// Areas stay EXACT and symbolic. Every area in this chapter has the form
//
//     (rat + pi*\u03c0 + root3*\u221a3) \u00d7 r\u00b2
//
// with rational coefficients, which covers every region the current scope
// reaches: a disc is pi = 1, a quarter sector is pi = 1/4, a right isosceles
// triangle is rat = 1/2, and the 60\u00b0 and 120\u00b0 triangles are root3 = 1/4.
// Nothing is rounded until a lesson asks for a decimal and says so.
//
// Angles are DEGREES throughout, and the current scope restricts segment
// work to 60, 90 and 120, which the validator enforces.
//
// Deliberately NOT built: arbitrary computational geometry, region union or
// intersection beyond what the subtraction needs, or the general
// \u00bd ab sin C area formula, which this source does not use here.
// ===========================================================================

export type Rational = { num: number; den: number };

const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));

export function rational(num: number, den: number): Rational {
  if (den === 0) throw new Error('rational with zero denominator');
  const g = gcd(num, den) || 1;
  const sign = den < 0 ? -1 : 1;
  return { num: (sign * num) / g, den: (sign * den) / g };
}
export const toNumber = (r: Rational) => r.num / r.den;
export const addR = (a: Rational, b: Rational) => rational(a.num * b.den + b.num * a.den, a.den * b.den);
export const subR = (a: Rational, b: Rational) => rational(a.num * b.den - b.num * a.den, a.den * b.den);
export function formatRational(r: Rational): string {
  return r.den === 1 ? String(r.num) : `${r.num}/${r.den}`;
}

/** An area as (rat + pi*π + root3*√3) × r², with exact rational parts. */
export type ExactArea = { rat: Rational; pi: Rational; root3: Rational };

export const ZERO_AREA: ExactArea = { rat: rational(0, 1), pi: rational(0, 1), root3: rational(0, 1) };

export const addArea = (a: ExactArea, b: ExactArea): ExactArea =>
  ({ rat: addR(a.rat, b.rat), pi: addR(a.pi, b.pi), root3: addR(a.root3, b.root3) });
export const subArea = (a: ExactArea, b: ExactArea): ExactArea =>
  ({ rat: subR(a.rat, b.rat), pi: subR(a.pi, b.pi), root3: subR(a.root3, b.root3) });

/** The numeric area for a given radius. π and √3 enter only here. */
export function areaValue(a: ExactArea, r: number): number {
  return (toNumber(a.rat) + toNumber(a.pi) * Math.PI + toNumber(a.root3) * Math.sqrt(3)) * r * r;
}

/** The coefficient of r², written as the source would write it. */
export function formatArea(a: ExactArea): string {
  // The pi term leads, because every region here starts from a share of the
  // disc and has the triangle taken off it. Writing the negative rational
  // first would put a minus sign at the front of a positive area.
  const parts: string[] = [];
  if (a.pi.num !== 0) parts.push(`${a.pi.num === 1 && a.pi.den === 1 ? '' : formatRational(a.pi)}\u03c0`);
  if (a.root3.num !== 0) parts.push(`${formatRational(a.root3)}\u221a3`);
  if (a.rat.num !== 0) parts.push(formatRational(a.rat));
  if (parts.length === 0) return '0';
  return parts.join(' + ').replace(/\+ -/g, '\u2212 ');
}

// --- the regions -----------------------------------------------------------

/**
 * Which part of the circle a region IS. The identity is carried, not
 * inferred from a fill colour, so a validator can tell whether the formula
 * a lesson quotes matches the region a figure marks.
 */
export type RegionKind = 'disc' | 'sector' | 'triangle' | 'minor_segment' | 'major_segment';

export type CircleRegion = {
  id: string;
  kind: RegionKind;
  /** The central angle in DEGREES that determines this region. */
  theta: number;
  /**
   * What this region is made from, when it is a difference. A minor segment
   * carries ['sector', 'triangle'] and its area follows from them; it is
   * never given an area of its own.
   */
  composedOf?: [RegionKind, RegionKind];
  label: string;
};

/** The angles the current scope allows for segment work. */
export const ALLOWED_SEGMENT_ANGLES = [60, 90, 120];

/** arc length = (θ/360) × 2πr, as the θ/360 share of the circumference. */
export function arcLengthCoefficient(theta: number): Rational {
  // The coefficient of πr in (θ/360) × 2πr.
  return rational(2 * theta, 360);
}
export function arcLength(theta: number, r: number): number {
  return toNumber(arcLengthCoefficient(theta)) * Math.PI * r;
}
export const circumference = (r: number) => 2 * Math.PI * r;

/** sector area = (θ/360) × πr², as the θ/360 share of the disc. */
export function sectorArea(theta: number): ExactArea {
  return { ...ZERO_AREA, pi: rational(theta, 360) };
}

export const discArea = (): ExactArea => ({ ...ZERO_AREA, pi: rational(1, 1) });

/**
 * The triangle formed by the centre and the two ends of the chord, for the
 * angles this scope allows. Each is derived from a construction the source
 * supports, never from ½ r² sin θ:
 *
 *   60\u00b0  two radii and the chord are all equal, so the triangle is
 *        equilateral with side r, area (\u221a3/4)r\u00b2.
 *   90\u00b0  the two radii are perpendicular, so the triangle is right-angled
 *        with legs r, area \u00bd r\u00b2.
 *  120\u00b0  the perpendicular from the centre to the chord splits the triangle
 *        into two 30-60-90 triangles. Half the chord is r sin 60 = (\u221a3/2)r
 *        and the height is r cos 60 = r/2, so the area is
 *        \u00bd \u00d7 \u221a3 r \u00d7 r/2 = (\u221a3/4)r\u00b2.
 */
export function centreTriangleArea(theta: number): ExactArea {
  if (theta === 60) return { ...ZERO_AREA, root3: rational(1, 4) };
  if (theta === 90) return { ...ZERO_AREA, rat: rational(1, 2) };
  if (theta === 120) return { ...ZERO_AREA, root3: rational(1, 4) };
  throw new Error(`central angle ${theta} is outside the angles this scope allows (${ALLOWED_SEGMENT_ANGLES.join(', ')})`);
}

/** The minor segment, DERIVED as sector minus triangle. */
export function minorSegmentArea(theta: number): ExactArea {
  return subArea(sectorArea(theta), centreTriangleArea(theta));
}

/** The major segment, DERIVED as the whole disc minus the minor segment. */
export function majorSegmentArea(theta: number): ExactArea {
  return subArea(discArea(), minorSegmentArea(theta));
}

/** The area a region actually has, computed from its composition. */
export function regionArea(region: CircleRegion): ExactArea {
  switch (region.kind) {
    case 'disc': return discArea();
    case 'sector': return sectorArea(region.theta);
    case 'triangle': return centreTriangleArea(region.theta);
    case 'minor_segment': return minorSegmentArea(region.theta);
    case 'major_segment': return majorSegmentArea(region.theta);
    default: throw new Error(`unknown region kind`);
  }
}

export function validateRegion(region: CircleRegion): string[] {
  const errs: string[] = [];
  if (region.theta <= 0 || region.theta > 360) errs.push(`central angle ${region.theta} is not a valid central angle`);
  if ((region.kind === 'triangle' || region.kind === 'minor_segment' || region.kind === 'major_segment')
      && !ALLOWED_SEGMENT_ANGLES.includes(region.theta)) {
    errs.push(`segment work is restricted to central angles ${ALLOWED_SEGMENT_ANGLES.join(', ')}; got ${region.theta}`);
  }
  // A segment must declare the subtraction it IS, so the structure is not
  // left to prose.
  if (region.kind === 'minor_segment') {
    if (!region.composedOf) errs.push('a minor segment must declare that it is a sector minus a triangle');
    else if (region.composedOf[0] !== 'sector' || region.composedOf[1] !== 'triangle') {
      errs.push(`a minor segment is sector minus triangle, not ${region.composedOf.join(' minus ')}`);
    }
  }
  if (region.kind === 'major_segment') {
    if (!region.composedOf) errs.push('a major segment must declare that it is the disc minus the minor segment');
    else if (region.composedOf[0] !== 'disc' || region.composedOf[1] !== 'minor_segment') {
      errs.push(`a major segment is disc minus minor segment, not ${region.composedOf.join(' minus ')}`);
    }
  }
  if (errs.length > 0) return errs;
  // The area invariants, checked at a representative radius.
  const r = 1;
  const v = areaValue(regionArea(region), r);
  if (v < 0) errs.push(`${region.kind} has a negative area, so the subtraction runs the wrong way`);
  if (region.kind === 'minor_segment') {
    const s = areaValue(sectorArea(region.theta), r);
    const t = areaValue(centreTriangleArea(region.theta), r);
    if (v > s) errs.push('the segment cannot be larger than the sector containing it');
    if (Math.abs(v - (s - t)) > 1e-12) errs.push('the segment area does not equal sector minus triangle');
    if (Math.abs(v - s) < 1e-12) errs.push('the segment has been given the sector\u2019s area; the triangle was not removed');
  }
  if (areaValue(regionArea(region), r) > areaValue(discArea(), r) + 1e-12) {
    errs.push('a region of the circle cannot exceed the area of the whole circle');
  }
  return errs;
}

/**
 * The θ/360 proportionality, stated as the thing both derivations share.
 * Arc over circumference and sector over disc must be the SAME fraction.
 */
export function proportionsAgree(theta: number): boolean {
  const share = rational(theta, 360);
  const arcShare = rational(arcLengthCoefficient(theta).num, arcLengthCoefficient(theta).den * 2);
  const areaShare = sectorArea(theta).pi;
  return toNumber(arcShare) === toNumber(share) && toNumber(areaShare) === toNumber(share);
}

/** minor + major must reconstruct the whole disc. */
export function segmentsCompleteTheDisc(theta: number): boolean {
  const total = addArea(minorSegmentArea(theta), majorSegmentArea(theta));
  return Math.abs(areaValue(total, 1) - areaValue(discArea(), 1)) < 1e-12;
}

/**
 * Does the angle a figure asserts match the angle a calculation used? A
 * figure saying 120 while the arithmetic uses 60 is the drift this catches.
 */
export function anglesReconcile(figureTheta: number, formulaTheta: number): boolean {
  return figureTheta === formulaTheta;
}
