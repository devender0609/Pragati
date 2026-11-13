// ===========================================================================
// v0.84.0-c10.13 checkpoint 67 — WHERE A LINE STANDS RELATIVE TO A CIRCLE.
//
// These theorems are unusually easy to fake. A drawing can look
// perpendicular, and a pair of tangents can look equal, and a lesson that
// says "clearly" over such a picture reads as if something has been
// established. Nothing has.
//
// So this module computes, from coordinates, what a figure actually has:
// whether a point is inside, on or outside a circle; whether a line is a
// secant, a tangent or misses entirely; how many tangents a point admits;
// and whether two tangent segments are in fact equal. Every figure in the
// chapter is checked against it before any proof is written about it.
//
// Two things this module is NOT.
//
//   * It is not the proof. A validator confirming OA \u00b7 AP = 0 says the
//     figure is drawn honestly; it says nothing to a student. The lesson
//     still has to carry the source's argument, and `auditCircularProof`
//     below exists to stop the computation standing in for it.
//
//   * It is not a general analytic-geometry engine. It knows points, lines
//     through two points, and circles, in exact integer arithmetic. The
//     authored figures are chosen so that everything stays integral \u2014 the
//     3-4-5 triangle scaled by five gives radius 15, external point at 25
//     and contact points at (9, \u00b112), with no square roots anywhere.
//
// General for circle-and-line geometry; nothing here knows about Chapter 10.
// ===========================================================================

export type Pt = { x: number; y: number };

export const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
export const dot = (a: Pt, b: Pt): number => a.x * b.x + a.y * b.y;
/** Squared distance, so exactness survives: no square roots are taken. */
export const distSq = (a: Pt, b: Pt): number => dot(sub(a, b), sub(a, b));

export type Circle = { centre: Pt; radius: number };

/** Where a point stands relative to a circle, decided by |OA|\u00b2 against r\u00b2. */
export type PointPosition = 'interior' | 'on' | 'exterior';

export function positionOf(circle: Circle, p: Pt): PointPosition {
  const d2 = distSq(circle.centre, p);
  const r2 = circle.radius * circle.radius;
  if (d2 < r2) return 'interior';
  if (d2 === r2) return 'on';
  return 'exterior';
}

/**
 * How many tangents a point admits, DERIVED from where it stands. The count
 * is never authored beside the point; it follows from the position, so a
 * figure cannot show an exterior point and claim one tangent.
 */
export function tangentCount(position: PointPosition): 0 | 1 | 2 {
  if (position === 'interior') return 0;
  if (position === 'on') return 1;
  return 2;
}

export const tangentCountFor = (circle: Circle, p: Pt) => tangentCount(positionOf(circle, p));

/** A line given by two distinct points on it. */
export type Line = { a: Pt; b: Pt };

/**
 * How a line stands relative to a circle. Decided by comparing the squared
 * distance from the centre to the line with r\u00b2, both scaled by |AB|\u00b2 so
 * the comparison stays in integers.
 */
export type LineCircleRelation = 'secant' | 'tangent' | 'misses';

export function relationOf(circle: Circle, line: Line): LineCircleRelation {
  const d = sub(line.b, line.a);
  const f = sub(line.a, circle.centre);
  // The perpendicular distance squared is (cross)\u00b2 / |d|\u00b2; multiply both
  // sides by |d|\u00b2 to compare without dividing.
  const cross = d.x * f.y - d.y * f.x;
  const lhs = cross * cross;
  const rhs = circle.radius * circle.radius * dot(d, d);
  if (lhs < rhs) return 'secant';
  if (lhs === rhs) return 'tangent';
  return 'misses';
}

/**
 * Is `line` tangent to `circle` at `p`? Both conditions are required: p must
 * lie ON the circle, and the radius to p must be perpendicular to the line.
 * Checking only one of them is how a near-miss passes for a tangent.
 */
export function isTangentAt(circle: Circle, line: Line, p: Pt): boolean {
  if (positionOf(circle, p) !== 'on') return false;
  const radius = sub(p, circle.centre);
  const direction = sub(line.b, line.a);
  return dot(radius, direction) === 0;
}

/** The squared length of the tangent segment from an external point. */
export function tangentSegmentLengthSq(circle: Circle, p: Pt): number | null {
  if (positionOf(circle, p) !== 'exterior') return null;
  return distSq(circle.centre, p) - circle.radius * circle.radius;
}

/** Are two tangent segments from one point equal? Compared squared. */
export function tangentSegmentsEqual(p: Pt, a: Pt, b: Pt): boolean {
  return distSq(p, a) === distSq(p, b);
}

export function validateTangentFigure(
  circle: Circle,
  line: Line,
  contact: Pt
): string[] {
  const errs: string[] = [];
  if (circle.radius <= 0) errs.push('a circle needs a positive radius');
  if (line.a.x === line.b.x && line.a.y === line.b.y) errs.push('a line needs two distinct points');
  const pos = positionOf(circle, contact);
  if (pos !== 'on') errs.push(`the point of contact is ${pos} to the circle, so it is not on it`);
  const rel = relationOf(circle, line);
  if (rel !== 'tangent') errs.push(`the line is a ${rel}, not a tangent`);
  if (pos === 'on' && rel === 'tangent' && !isTangentAt(circle, line, contact)) {
    errs.push('the line touches the circle, but not at the stated point');
  }
  return errs;
}

export function validateTwoTangents(
  circle: Circle,
  external: Pt,
  contactA: Pt,
  contactB: Pt
): string[] {
  const errs: string[] = [];
  const pos = positionOf(circle, external);
  if (pos !== 'exterior') errs.push(`the point is ${pos} to the circle, so two tangents cannot be drawn from it`);
  for (const [name, c] of [['A', contactA], ['B', contactB]] as Array<[string, Pt]>) {
    if (positionOf(circle, c) !== 'on') errs.push(`contact point ${name} does not lie on the circle`);
    if (dot(sub(c, circle.centre), sub(external, c)) !== 0) {
      errs.push(`the radius to ${name} is not perpendicular to the segment from the external point`);
    }
  }
  if (contactA.x === contactB.x && contactA.y === contactB.y) {
    errs.push('the two contact points coincide, so there is only one tangent');
  }
  if (errs.length === 0 && !tangentSegmentsEqual(external, contactA, contactB)) {
    errs.push('the two tangent segments are not equal, so the figure contradicts the theorem');
  }
  return errs;
}

// ---------------------------------------------------------------------------
// Proof hygiene.
// ---------------------------------------------------------------------------

export type ProofFinding = { where: string; text: string; reason: string };

/**
 * Two failures these theorems invite, neither of which the existing
 * proof-scope audit looks for.
 *
 * PROOF BY DIAGRAM — the conclusion read off the picture. A right-angle mark
 * is not an argument, and "clearly PA = PB" is the characteristic phrasing.
 *
 * CIRCULAR REASONING — the conclusion used as its own reason. The equal-
 * tangents proof is especially exposed, because "tangents from a point are
 * equal" is exactly what is being established.
 *
 * Both have to let through the sentence that quotes the bad move in order to
 * reject it, which every phrase audit in this project has had to learn.
 */
const PROOF_BY_DIAGRAM = [
  /\b(?:clearly|obviously|evidently|as (?:we|you) can see|it is clear)\b[^.]{0,80}\b(?:from the (?:figure|diagram|picture)|equal|perpendicular|90)/i,
  /\b(?:the (?:figure|diagram|picture))\b[^.]{0,40}\b(?:shows|proves|tells us)\b[^.]{0,40}\b(?:equal|perpendicular|congruent)\b/i,
  /\b(?:looks?|appears?|seems?)\b[^.]{0,30}\b(?:perpendicular|equal|symmetric)\b[^.]{0,30}\b(?:so|therefore|hence)\b/i,
  /\b(?:by|from) (?:symmetry|the symmetry of the figure)\b[^.]{0,40}\b(?:PA ?= ?PB|are equal|equal lengths)\b/i,
  /\bmeasur(?:e|ing|ed)\b[^.]{0,40}\b(?:shows|gives|proves)\b[^.]{0,30}\b(?:equal|90|perpendicular)\b/i,
];

const CIRCULAR = [
  /\bperpendicular\b[^.]{0,40}\bbecause\b[^.]{0,50}\b(?:it is (?:a|the) radius|tangent is perpendicular)\b/i,
  /\bPA ?= ?PB\b[^.]{0,40}\bbecause\b[^.]{0,60}\btangents (?:from|are)[^.]{0,30}\bequal\b/i,
  /\bequal\b[^.]{0,30}\bbecause (?:the )?tangents (?:from a point )?are equal\b/i,
  /\bis a tangent\b[^.]{0,40}\bbecause\b[^.]{0,40}\btwo tangents\b/i,
];

/** A sentence naming the bad move in order to reject it is not the bad move. */
const REJECTS = [
  /\bis not (?:a )?(?:proof|enough|sufficient)\b/i,
  /\bwould be (?:wrong|circular|no proof)\b/i,
  /\bdoes not prove\b/i,
  /\bcannot (?:be used|assume|conclude)\b/i,
  /\ba student (?:says|writes|claims|argues)\b/i,
  /\bwhy (?:this|that) (?:is wrong|fails|is circular)\b/i,
  /\bcircular\b/i,
  /\bwhat (?:is|has gone) wrong\b/i,
  /\bnot because\b/i,
  /\bmistake\b/i,
  /\byet to be (?:proved|established)\b/i,
];

const rejects = (s: string) => REJECTS.some((r) => r.test(s));

export function auditProofByDiagram(blocks: Array<[string, string]>): ProofFinding[] {
  const out: ProofFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      if (rejects(s)) continue;
      if (PROOF_BY_DIAGRAM.some((r) => r.test(s))) {
        out.push({ where, text: s.trim().slice(0, 160), reason: 'reads a conclusion off the figure instead of proving it' });
      }
    }
  }
  return out;
}

export function auditCircularProof(blocks: Array<[string, string]>): ProofFinding[] {
  const out: ProofFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      if (rejects(s)) continue;
      if (CIRCULAR.some((r) => r.test(s))) {
        out.push({ where, text: s.trim().slice(0, 160), reason: 'uses the conclusion as its own reason' });
      }
    }
  }
  return out;
}

/**
 * Congruence correspondence. \u0394OAP \u2245 \u0394OBP maps O\u2194O, A\u2194B, P\u2194P, so PA
 * corresponds to PB \u2014 and NOT, say, to OB. A proof citing a
 * non-corresponding pair proves nothing about the sides it names.
 */
export function corresponds(
  first: [string, string, string],
  second: [string, string, string],
  sideA: string,
  sideB: string
): boolean {
  const map = new Map<string, string>();
  first.forEach((v, i) => map.set(v, second[i]));
  const image = (side: string) => side.split('').map((c) => map.get(c) ?? c).sort().join('');
  return image(sideA) === [...sideB].sort().join('');
}
