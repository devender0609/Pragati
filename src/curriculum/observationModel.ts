// ===========================================================================
// v0.84.0-c10.7 checkpoint 61 — TURNING AN OBSERVATION INTO A TRIANGLE.
//
// Chapter 9's arithmetic is easy and its modelling is where everything goes
// wrong. A lesson can compute tan 60 correctly and still report the vertical
// rise above the observer's eye as the tower's height, or put the angle of
// depression at the lower object, or divide by the line of sight instead of
// the horizontal leg. Each of those produces a tidy number and a wrong
// answer, and no amount of checking the trigonometry catches any of them.
//
// So the observation is ONE object. The eye height, the horizontal distance,
// the angle, the vertical rise, the total height and the line of sight are
// all related here, and the figure is derived from the same object the prose
// quotes. What a lesson is asking for is stated explicitly — `targetHeight`
// says whether the answer is the total height above the ground or only the
// rise above eye level — so "always add the observer's height" cannot be
// encoded as a habit.
//
// General for angle-of-elevation and angle-of-depression observations.
// Nothing here knows about Chapter 9.
// ===========================================================================

import { STANDARD_ANGLE_RATIOS } from './trigonometrySections';

export type StandardAngle = 30 | 45 | 60;

/** Which way the line of sight runs from the observer's horizontal. */
export type SightDirection = 'elevation' | 'depression';

export type Observation = {
  id: string;
  /** Who or what is observing, e.g. 'a surveyor'. */
  observer: string;
  /** What is being observed, e.g. 'the top of a tower'. */
  target: string;
  /**
   * Height of the observer's eye above the SAME ground reference the target
   * is measured from. Zero when the observation is made at ground level —
   * which is a real case, not an omission.
   */
  eyeHeightM: number;
  /** Horizontal distance from the observer to the foot of the target. */
  horizontalDistanceM: number;
  angleDegrees: StandardAngle;
  direction: SightDirection;
  /**
   * What the problem actually asks for. This is the field that stops
   * "always add the eye height" from becoming a rule: some problems want the
   * total height above the ground, others only the rise above eye level.
   */
  targetQuantity: 'total_height' | 'rise_above_eye' | 'horizontal_distance';
  unit: 'm';
};

const ratio = (deg: StandardAngle) => {
  const row = STANDARD_ANGLE_RATIOS.find((r) => r.degrees === deg);
  if (!row) throw new Error(`no canonical ratios for ${deg} degrees`);
  return row;
};

/** tan of the angle, read from the Chapter 8 canonical table — never retyped. */
export function tanOf(deg: StandardAngle): { exact: string; value: number } {
  return ratio(deg).tan;
}
export function sinOf(deg: StandardAngle): { exact: string; value: number } {
  return ratio(deg).sin;
}
export function cosOf(deg: StandardAngle): { exact: string; value: number } {
  return ratio(deg).cos;
}

/**
 * The vertical leg of the right triangle — the rise from the observer's eye
 * level to the target, NOT the target's height. Confusing the two is the
 * defining error of this chapter.
 */
export function verticalRise(o: Observation): number {
  return o.horizontalDistanceM * tanOf(o.angleDegrees).value;
}

/**
 * The target's height above the ground, which is the rise PLUS the eye
 * height only for an elevation measured from the same ground reference. For
 * a depression the observer is above and the arithmetic runs the other way.
 */
export function totalHeight(o: Observation): number {
  return o.direction === 'elevation'
    ? verticalRise(o) + o.eyeHeightM
    : o.eyeHeightM - verticalRise(o);
}

/** The hypotenuse. Not the horizontal distance, and not interchangeable with it. */
export function lineOfSight(o: Observation): number {
  return Math.hypot(o.horizontalDistanceM, verticalRise(o));
}

/** What the problem asked for, as opposed to what is easiest to compute. */
export function answerFor(o: Observation): number {
  switch (o.targetQuantity) {
    case 'total_height': return totalHeight(o);
    case 'rise_above_eye': return verticalRise(o);
    case 'horizontal_distance': return o.horizontalDistanceM;
  }
}

/** Does the eye height enter the answer at all? Derived, never assumed. */
export function eyeHeightEntersAnswer(o: Observation): boolean {
  if (o.targetQuantity !== 'total_height') return false;
  return o.eyeHeightM !== 0;
}

export const round2 = (v: number) => Math.round(v * 100) / 100;

/** An exact form where the tangent is exact, with the approximation named. */
export function exactRise(o: Observation): string {
  const d = o.horizontalDistanceM;
  if (o.angleDegrees === 45) return `${d}`;
  if (o.angleDegrees === 60) return `${d}\u221a3`;
  // tan 30 is 1/\u221a3, so the rise is d\u221a3/3; rationalised, because
  // d/\u221a3 leaves a surd in the denominator.
  return d % 3 === 0 ? `${d / 3}\u221a3` : `${d}\u221a3/3`;
}

export function validateObservation(o: Observation): string[] {
  const errs: string[] = [];
  // The angle is checked FIRST and returns early: every other check calls
  // tanOf, which has no entry outside the prescribed angles and would throw
  // before this message could be produced.
  if (![30, 45, 60].includes(o.angleDegrees)) {
    return [`angle ${o.angleDegrees} is outside the prescribed 30, 45 and 60 degrees`];
  }
  if (o.horizontalDistanceM <= 0) errs.push('horizontal distance must be positive');
  if (o.eyeHeightM < 0) errs.push('eye height cannot be negative');
  if (o.unit !== 'm') errs.push('all quantities must share one unit');
  // A depression whose rise exceeds the eye height would put the target
  // underground, which is a geometry error rather than an arithmetic one.
  if (o.direction === 'depression' && verticalRise(o) > o.eyeHeightM + 1e-9) {
    errs.push('the depression drops below the ground reference; the geometry is impossible');
  }
  if (o.targetQuantity === 'total_height' && o.direction === 'elevation' && totalHeight(o) <= o.eyeHeightM) {
    errs.push('an elevation must place the target above the observer\u2019s eye');
  }
  // The line of sight must exceed both legs; if it does not, the triangle is
  // degenerate and the hypotenuse has been confused with a leg.
  const los = lineOfSight(o);
  if (los <= o.horizontalDistanceM - 1e-9 || los <= verticalRise(o) - 1e-9) {
    errs.push('the line of sight is not longer than both legs');
  }
  return errs;
}

/**
 * The right triangle an observation denotes, as coordinates, so the existing
 * geometry validators can check the angle and the side roles against it.
 *
 * The observer sits at eye height above the ground; the horizontal reference
 * runs from the eye, level, to a point directly above or below the target's
 * foot. The angle is at the OBSERVER, between that horizontal and the line
 * of sight — which is what makes a depression drawn at the lower object
 * unrepresentable here.
 */
export function triangleOf(o: Observation): {
  eye: { x: number; y: number };
  horizontalFoot: { x: number; y: number };
  sightEnd: { x: number; y: number };
  groundFoot: { x: number; y: number };
} {
  const rise = verticalRise(o);
  const eye = { x: 0, y: o.eyeHeightM };
  const horizontalFoot = { x: o.horizontalDistanceM, y: o.eyeHeightM };
  const sightEnd = {
    x: o.horizontalDistanceM,
    y: o.direction === 'elevation' ? o.eyeHeightM + rise : o.eyeHeightM - rise,
  };
  return { eye, horizontalFoot, sightEnd, groundFoot: { x: o.horizontalDistanceM, y: 0 } };
}

/**
 * Recompute the angle at the observer from the coordinates, so a figure
 * cannot claim 60 degrees while its geometry says something else — the same
 * check checkpoint 55 applies to exact triangles.
 */
export function recomputedAngle(o: Observation): number {
  const t = triangleOf(o);
  const dx = t.horizontalFoot.x - t.eye.x;
  const dy = t.horizontalFoot.y - t.eye.y;
  const ex = t.sightEnd.x - t.eye.x;
  const ey = t.sightEnd.y - t.eye.y;
  const cos = (dx * ex + dy * ey) / (Math.hypot(dx, dy) * Math.hypot(ex, ey));
  return (Math.acos(Math.min(1, Math.max(-1, cos))) * 180) / Math.PI;
}

/** Every structural claim, checked against the coordinates. */
export function validateObservationGeometry(o: Observation): string[] {
  const errs = validateObservation(o);
  if (errs.length && ![30, 45, 60].includes(o.angleDegrees)) return errs;
  const t = triangleOf(o);
  // The horizontal reference must actually be horizontal.
  if (Math.abs(t.horizontalFoot.y - t.eye.y) > 1e-9) {
    errs.push('the reference line through the observer is not horizontal');
  }
  // The angle must be at the observer and must match the claim.
  const a = recomputedAngle(o);
  if (Math.abs(a - o.angleDegrees) > 1e-6) {
    errs.push(`the figure claims ${o.angleDegrees} degrees but the coordinates give ${a.toFixed(4)}`);
  }
  // Elevation rises, depression falls — relative to the eye, not the ground.
  const rises = t.sightEnd.y > t.eye.y;
  if (o.direction === 'elevation' && !rises) errs.push('an elevation must rise above the observer\u2019s horizontal');
  if (o.direction === 'depression' && rises) errs.push('a depression must fall below the observer\u2019s horizontal');
  return errs;
}
