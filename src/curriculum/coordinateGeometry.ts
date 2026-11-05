// ===========================================================================
// v0.84.0-c10.14 checkpoint 68 — THE POINTS ARE STORED ONCE.
//
// Coordinate geometry is the easiest place in the course for a figure and a
// calculation to describe different things. A diagram can plot (3, 4) while
// the working uses (3, 5), and both look fine on their own. Checkpoint 60
// found exactly this with line graphs.
//
// So a point is one object, and the distance, the midpoint, the section
// point, the ratio and anything plotted all come from it. Nothing derived is
// typed beside the thing it was derived from.
//
// Exactness, twice over:
//
//   * Distances stay as EXACT RADICALS. A distance of \u221a13 is stored as
//     \u221a13 and printed as \u221a13, never as 3.61 unless a lesson asks for an
//     approximation and says it is one. Squared distances are integers, so
//     comparisons never touch a square root at all.
//
//   * Section points stay as EXACT RATIONALS. Dividing in the ratio 2:1 can
//     give (7/3, 11/3), and that is what is stored \u2014 rounding it before
//     using it downstream is how a point drifts off its own segment.
//
// Scope: internal division only. The current edition has no area-of-triangle
// formula, no external division and no slope, and `auditExcludedCoordinate`
// below exists because those are precisely what an author reaching for an
// older textbook would add.
//
// General coordinate geometry; nothing here knows about Chapter 7.
// ===========================================================================

export type Rational = { num: number; den: number };

const gcdOf = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcdOf(y, x % y));

export function rational(num: number, den: number): Rational {
  if (den === 0) throw new Error('rational with zero denominator');
  const g = gcdOf(num, den) || 1;
  const sign = den < 0 ? -1 : 1;
  return { num: (sign * num) / g, den: (sign * den) / g };
}
export const toNumber = (r: Rational) => r.num / r.den;
export const ratEq = (a: Rational, b: Rational) => a.num * b.den === b.num * a.den;
export function formatRational(r: Rational): string {
  return r.den === 1 ? String(r.num) : `${r.num}/${r.den}`;
}

/** A point with exact rational coordinates. */
export type Point = { id: string; x: Rational; y: Rational; label: string };

export const pt = (id: string, x: number, y: number, label?: string): Point =>
  ({ id, x: rational(x, 1), y: rational(y, 1), label: label ?? `${id}(${x}, ${y})` });

export const ratPt = (id: string, x: Rational, y: Rational, label?: string): Point =>
  ({ id, x, y, label: label ?? `${id}(${formatRational(x)}, ${formatRational(y)})` });

export function formatPoint(p: Point): string {
  return `(${formatRational(p.x)}, ${formatRational(p.y)})`;
}

const subR = (a: Rational, b: Rational) => rational(a.num * b.den - b.num * a.den, a.den * b.den);
const addR = (a: Rational, b: Rational) => rational(a.num * b.den + b.num * a.den, a.den * b.den);
const mulR = (a: Rational, b: Rational) => rational(a.num * b.num, a.den * b.den);

/** The horizontal and vertical differences, which are the legs of the triangle. */
export const dx = (p: Point, q: Point) => subR(q.x, p.x);
export const dy = (p: Point, q: Point) => subR(q.y, p.y);

/**
 * The squared distance, exact. Every comparison in this module uses this
 * rather than a distance, so no square root is ever taken to decide
 * anything.
 */
export function distanceSquared(p: Point, q: Point): Rational {
  const a = dx(p, q);
  const b = dy(p, q);
  return addR(mulR(a, a), mulR(b, b));
}

/** An exact distance written as coefficient \u00d7 \u221aradicand. */
export type Radical = { coefficient: Rational; radicand: number };

function simplifyRadical(n: number): { outside: number; inside: number } {
  if (n < 0) throw new Error('a squared distance cannot be negative');
  let outside = 1;
  let inside = n;
  for (let f = 2; f * f <= inside; f += 1) {
    while (inside % (f * f) === 0) { outside *= f; inside /= f * f; }
  }
  return { outside, inside };
}

/**
 * The distance, exact. The principal non-negative root only \u2014 a distance
 * has no \u00b1, and returning one would invite an answer that cannot exist.
 */
export function distance(p: Point, q: Point): Radical {
  const d2 = distanceSquared(p, q);
  // Rational squared distance a/b = (a*b)/b^2, so the root is \u221a(ab)/b.
  const n = d2.num * d2.den;
  const { outside, inside } = simplifyRadical(n);
  return { coefficient: rational(outside, d2.den), radicand: inside };
}

export function formatRadical(r: Radical): string {
  if (r.radicand === 1) return formatRational(r.coefficient);
  const c = formatRational(r.coefficient);
  return c === '1' ? `\u221a${r.radicand}` : `${c}\u221a${r.radicand}`;
}
export const radicalValue = (r: Radical) => toNumber(r.coefficient) * Math.sqrt(r.radicand);
/** A decimal, for a lesson that explicitly wants an approximation. */
export const approxDistance = (r: Radical, places = 2) => Number(radicalValue(r).toFixed(places));

/** Distance is symmetric, because the differences are squared. */
export function distanceIsSymmetric(p: Point, q: Point): boolean {
  return ratEq(distanceSquared(p, q), distanceSquared(q, p));
}

// --- internal division -----------------------------------------------------

/**
 * A point dividing AB internally in the ratio AP : PB = m1 : m2.
 *
 * The convention is stated rather than remembered: the weight on B is m1,
 * the part of the ratio NEAREST A, because a larger m1 pulls P toward B.
 * Reversing the weights is the characteristic error, and `ratioOf` below
 * recovers the ratio independently so an authored pair cannot disagree.
 */
export function sectionPoint(a: Point, b: Point, m1: number, m2: number, id = 'P'): Point {
  if (m1 <= 0 || m2 <= 0) {
    throw new Error(`internal division needs positive ratio parts; got ${m1}:${m2}`);
  }
  const s = m1 + m2;
  const x = rational(m1 * b.x.num * a.x.den + m2 * a.x.num * b.x.den, s * a.x.den * b.x.den);
  const y = rational(m1 * b.y.num * a.y.den + m2 * a.y.num * b.y.den, s * a.y.den * b.y.den);
  return ratPt(id, x, y);
}

/** The midpoint — the section point at 1:1, not a separate formula. */
export const midpoint = (a: Point, b: Point, id = 'M'): Point => sectionPoint(a, b, 1, 1, id);

/**
 * Recover the ratio AP : PB from the coordinates, as a check on a section
 * point rather than a restatement of it. Both coordinates must give the
 * same ratio; if one is degenerate (the segment is vertical or horizontal)
 * the other decides, and if they disagree the data are inconsistent.
 */
export function ratioOf(a: Point, b: Point, p: Point): { m1: number; m2: number } | null {
  const fromX = ratioAlong(a.x, b.x, p.x);
  const fromY = ratioAlong(a.y, b.y, p.y);
  if (fromX === null && fromY === null) return null;
  if (fromX !== null && fromY !== null && !ratEq(fromX, fromY)) return null;
  const t = (fromX ?? fromY)!;
  // t = AP/AB, so AP:PB = t : (1 - t).
  const num = t.num;
  const den = t.den - t.num;
  if (num <= 0 || den <= 0) return null; // not internal
  const g = gcdOf(num, den) || 1;
  return { m1: num / g, m2: den / g };
}

/** The parameter t with p = a + t(b - a) along one coordinate, or null. */
function ratioAlong(a: Rational, b: Rational, p: Rational): Rational | null {
  const span = subR(b, a);
  if (span.num === 0) return null; // degenerate in this coordinate
  const reach = subR(p, a);
  return rational(reach.num * span.den, reach.den * span.num);
}

/** Is P strictly between A and B on the segment, rather than merely on the line? */
export function isInternalPoint(a: Point, b: Point, p: Point): boolean {
  const tx = ratioAlong(a.x, b.x, p.x);
  const ty = ratioAlong(a.y, b.y, p.y);
  if (tx === null && ty === null) return false;
  if (tx !== null && ty !== null && !ratEq(tx, ty)) return false;
  const t = (tx ?? ty)!;
  const v = toNumber(t);
  return v > 0 && v < 1;
}

// --- distance applications -------------------------------------------------

/**
 * Collinear by the distance criterion, WITH the ordering identified. The
 * test is that one of the three sums holds, and which one tells you which
 * point lies between the other two \u2014 a check that merely adds two numbers
 * and compares would not.
 */
export function collinearByDistance(a: Point, b: Point, c: Point): { collinear: boolean; between: string | null } {
  const ab = radicalValue(distance(a, b));
  const bc = radicalValue(distance(b, c));
  const ac = radicalValue(distance(a, c));
  const near = (x: number, y: number) => Math.abs(x - y) < 1e-9;
  if (near(ab + bc, ac)) return { collinear: true, between: b.id };
  if (near(ab + ac, bc)) return { collinear: true, between: a.id };
  if (near(ac + bc, ab)) return { collinear: true, between: c.id };
  return { collinear: false, between: null };
}

export type QuadKind = 'square' | 'rectangle' | 'rhombus' | 'parallelogram' | 'none of these';

/**
 * Classify a quadrilateral ABCD from its own vertices. Sides and diagonals
 * are compared as SQUARED lengths, so the decision is exact.
 *
 * Equal sides alone do not make a square: the diagonals must be equal too,
 * which is what rules out a rhombus. The classification is stated in that
 * order so the evidence actually supports the name given.
 */
export function classifyQuadrilateral(a: Point, b: Point, c: Point, d: Point): QuadKind {
  const s = [distanceSquared(a, b), distanceSquared(b, c), distanceSquared(c, d), distanceSquared(d, a)];
  const d1 = distanceSquared(a, c);
  const d2 = distanceSquared(b, d);
  const allSidesEqual = s.every((v) => ratEq(v, s[0]));
  const oppositeEqual = ratEq(s[0], s[2]) && ratEq(s[1], s[3]);
  const diagonalsEqual = ratEq(d1, d2);
  if (allSidesEqual && diagonalsEqual) return 'square';
  if (allSidesEqual) return 'rhombus';
  if (oppositeEqual && diagonalsEqual) return 'rectangle';
  if (oppositeEqual) return 'parallelogram';
  return 'none of these';
}

/** Is P equidistant from A and B? Compared squared, so exact. */
export const isEquidistant = (p: Point, a: Point, b: Point) =>
  ratEq(distanceSquared(p, a), distanceSquared(p, b));

export function validatePoint(p: Point): string[] {
  const errs: string[] = [];
  if (!p.id.trim()) errs.push('a point needs an id');
  if (!p.label.trim()) errs.push('a point needs a label');
  return errs;
}

export function validateSection(a: Point, b: Point, p: Point, m1: number, m2: number): string[] {
  const errs: string[] = [];
  if (m1 <= 0 || m2 <= 0) errs.push(`internal division needs positive ratio parts; got ${m1}:${m2}`);
  if (errs.length > 0) return errs;
  const expected = sectionPoint(a, b, m1, m2, p.id);
  if (!ratEq(expected.x, p.x) || !ratEq(expected.y, p.y)) {
    errs.push(`the stated point ${formatPoint(p)} is not the point dividing in ${m1}:${m2}, which is ${formatPoint(expected)}`);
  }
  if (!isInternalPoint(a, b, p)) errs.push('the point does not lie between the two endpoints');
  const recovered = ratioOf(a, b, p);
  if (recovered === null) errs.push('the two coordinates do not agree on a single ratio');
  else if (recovered.m1 * m2 !== recovered.m2 * m1) {
    errs.push(`the coordinates give the ratio ${recovered.m1}:${recovered.m2}, not ${m1}:${m2}`);
  }
  return errs;
}

// ---------------------------------------------------------------------------
// Scope.
// ---------------------------------------------------------------------------

export type ScopeFinding = { where: string; text: string; reason: string };

/**
 * Topics absent from this edition. A generic ban on "area" would be
 * useless \u2014 the chapter may well mention the area of a figure in passing
 * \u2014 so each pattern names the coordinate method specifically.
 */
const EXCLUDED: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\barea of (?:a |the )?triangle\b[^.]{0,60}\b(?:coordinates?|vertices|formula)\b/i, reason: 'the coordinate area-of-triangle formula is absent from this edition' },
  { pattern: /\b(?:x\u2081|x1)\s*\(\s*(?:y\u2082|y2)\s*[\u2212-]\s*(?:y\u2083|y3)\s*\)/i, reason: 'the coordinate area-of-triangle expression is absent from this edition' },
  { pattern: /\bdeterminant\b/i, reason: 'the determinant method is outside this scope' },
  { pattern: /\bslope\b|\bgradient of (?:the |a )?line\b/i, reason: 'slope is outside this chapter\u2019s scope' },
  { pattern: /\bexternal(?:ly)? divi(?:des?|sion|ding)\b/i, reason: 'external division is outside this scope, which is internal division only' },
  { pattern: /\bcentroid\b/i, reason: 'the centroid formula is outside this scope' },
  { pattern: /\bequation of (?:the |a )?line\b/i, reason: 'the equation of a line is outside this chapter' },
  { pattern: /\blocus\b/i, reason: 'locus is outside this scope' },
];

/** A sentence naming an excluded topic in order to exclude it is fine. */
const DECLARES_EXCLUSION = [
  /\bis not (?:part of|in) (?:this|the current)\b/i,
  /\boutside (?:this|the) (?:chapter|scope|edition|course)\b/i,
  /\bnot (?:covered|taught|used|needed) (?:here|in this chapter)\b/i,
  /\babsent from this edition\b/i,
  /\bdo(?:es)? not (?:use|need|require)\b/i,
  /\bwithout using\b/i,
  /\byou may (?:have )?(?:met|meet) (?:this|it) later\b/i,
];

export function auditExcludedCoordinate(blocks: Array<[string, string]>): ScopeFinding[] {
  const out: ScopeFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      if (DECLARES_EXCLUSION.some((r) => r.test(s))) continue;
      const hit = EXCLUDED.find((e) => e.pattern.test(s));
      if (hit) out.push({ where, text: s.trim().slice(0, 160), reason: hit.reason });
    }
  }
  return out;
}
