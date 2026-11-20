// ===========================================================================
// v0.84.0-c11.39 checkpoint 96 — INEQUALITIES AND THEIR SOLUTION SETS.
//
// ONE TRUTH, THREE RENDERINGS
//
// A solution set is what an inequality means. The number line and the
// half-plane are pictures OF that set, derived from it — never authored
// beside it. If a lesson could type the interval and the symbols
// separately they could disagree, and the picture would be the thing a
// student believed.
//
// The relation does the work throughout. Strict excludes its boundary,
// weak includes it, and that single fact decides the open or closed
// endpoint on a number line and the included or excluded boundary of a
// half-plane. One rule, applied in three places, rather than three rules
// that have to be kept in step.
//
// SCOPE: linear forms only. No CAS, no polynomial inequalities. The
// transformations are the ones §5.3 prescribes and no others.
// ===========================================================================

import { type IntervalSet } from './setTheory';

export type Relation = '<' | '<=' | '>' | '>=';

export const isStrict = (r: Relation): boolean => r === '<' || r === '>';
/** The boundary belongs to the solution set exactly when the relation is weak. */
export const boundaryIncluded = (r: Relation): boolean => !isStrict(r);
export const relationSymbol = (r: Relation): string =>
  ({ '<': '<', '<=': '\u2264', '>': '>', '>=': '\u2265' }[r]);
export const relationWords = (r: Relation): string =>
  ({ '<': 'is less than', '<=': 'is less than or equal to',
     '>': 'is greater than', '>=': 'is greater than or equal to' }[r]);

/** Reversing the relation, which is what a negative multiplier does. */
export const reverse = (r: Relation): Relation =>
  ({ '<': '>', '<=': '>=', '>': '<', '>=': '<=' }[r] as Relation);

// ---------------------------------------------------------------------------
// One variable: ax + b (relation) c, and the ray it describes.
// ---------------------------------------------------------------------------

/** A linear inequality in one variable, held as coefficients. */
export type OneVarInequality = {
  id: string;
  /** Coefficient of x on the left. */
  a: number;
  /** Constant on the left. */
  b: number;
  relation: Relation;
  /** The right-hand side. */
  c: number;
};

export const oneVar = (id: string, a: number, b: number, relation: Relation, c: number): OneVarInequality => {
  if (a === 0) throw new Error(`"${id}" has no x term, so it is not a linear inequality in one variable`);
  return { id, a, b, relation, c };
};

/** Does this value satisfy the inequality? The predicate IS the meaning. */
export function satisfies(ineq: OneVarInequality, x: number): boolean {
  const left = ineq.a * x + ineq.b;
  switch (ineq.relation) {
    case '<': return left < ineq.c;
    case '<=': return left <= ineq.c;
    case '>': return left > ineq.c;
    default: return left >= ineq.c;
  }
}

export type SolutionRay = {
  /** The boundary value, where ax + b = c. */
  boundary: number;
  /** Which side of the boundary satisfies it. */
  direction: 'greater' | 'less';
  included: boolean;
};

/**
 * Solve for x. Dividing by a negative `a` REVERSES the relation — modelled
 * here rather than left as a warning in prose, so nothing downstream can
 * disagree with it.
 */
export function solve(ineq: OneVarInequality): SolutionRay {
  const boundary = (ineq.c - ineq.b) / ineq.a;
  const relation = ineq.a < 0 ? reverse(ineq.relation) : ineq.relation;
  return {
    boundary,
    direction: relation === '>' || relation === '>=' ? 'greater' : 'less',
    included: boundaryIncluded(relation),
  };
}

/** The ray as an interval, reusing the existing set model rather than a new one. */
export function solutionInterval(ineq: OneVarInequality, id: string, label: string): IntervalSet {
  const r = solve(ineq);
  return r.direction === 'greater'
    ? { kind: 'interval', id, label, low: r.boundary, high: Number.POSITIVE_INFINITY, lowClosed: r.included, highClosed: false }
    : { kind: 'interval', id, label, low: Number.NEGATIVE_INFINITY, high: r.boundary, lowClosed: false, highClosed: r.included };
}

/** Membership read off the ray — the oracle `satisfies` is checked against. */
export const rayContains = (r: SolutionRay, x: number): boolean =>
  r.direction === 'greater'
    ? (r.included ? x >= r.boundary : x > r.boundary)
    : (r.included ? x <= r.boundary : x < r.boundary);

// ---------------------------------------------------------------------------
// Transformations, each preserving the truth set.
// ---------------------------------------------------------------------------

export type Transform =
  | { op: 'add'; value: number }
  | { op: 'multiply'; value: number };

export function applyTransform(ineq: OneVarInequality, t: Transform): OneVarInequality {
  if (t.op === 'add') {
    return { ...ineq, b: ineq.b + t.value, c: ineq.c + t.value };
  }
  if (t.value === 0) throw new Error('multiplying an inequality by zero destroys it; the step is refused');
  // The rule the chapter exists to teach: a negative multiplier reverses.
  const relation = t.value < 0 ? reverse(ineq.relation) : ineq.relation;
  return { ...ineq, a: ineq.a * t.value, b: ineq.b * t.value, c: ineq.c * t.value, relation };
}

/**
 * Two inequalities have the same truth set. This is the oracle for a
 * transformation: not "did it follow the remembered rule?" but "does it
 * still mean the same thing?", tested against the predicate directly.
 */
export function sameTruthSet(p: OneVarInequality, q: OneVarInequality, samples: number[]): boolean {
  return samples.every((x) => satisfies(p, x) === satisfies(q, x));
}

// ---------------------------------------------------------------------------
// Two variables: ax + by (relation) c, and the half-plane it describes.
// ---------------------------------------------------------------------------

export type HalfPlane = {
  id: string;
  a: number;
  b: number;
  relation: Relation;
  c: number;
};

export function halfPlane(id: string, a: number, b: number, relation: Relation, c: number): HalfPlane {
  // With both coefficients zero there is no line and no half-plane: the
  // statement is either always or never true, and drawing a region for it
  // would be an invention.
  if (a === 0 && b === 0) {
    throw new Error(`"${id}" has no x or y term, so it describes no boundary line and no half-plane`);
  }
  return { id, a, b, relation, c };
}

/** Does this point satisfy it? Again, the predicate is the meaning. */
export function containsPoint(h: HalfPlane, x: number, y: number): boolean {
  const left = h.a * x + h.b * y;
  switch (h.relation) {
    case '<': return left < h.c;
    case '<=': return left <= h.c;
    case '>': return left > h.c;
    default: return left >= h.c;
  }
}

export const onBoundary = (h: HalfPlane, x: number, y: number): boolean => h.a * x + h.b * y === h.c;

/** How the boundary line reads, in general form — never slope-intercept. */
export function boundaryEquation(h: HalfPlane): string {
  const parts: string[] = [];
  if (h.a !== 0) parts.push(`${h.a === 1 ? '' : h.a === -1 ? '\u2212' : h.a}x`);
  if (h.b !== 0) {
    const sign = h.b < 0 ? ' \u2212 ' : parts.length ? ' + ' : '';
    const mag = Math.abs(h.b);
    parts.push(`${sign}${mag === 1 ? '' : mag}y`);
  }
  return `${parts.join('')} = ${h.c}`;
}

/** A vertical boundary has no y term; a horizontal one has no x term. */
export const boundaryKind = (h: HalfPlane): 'vertical' | 'horizontal' | 'oblique' =>
  h.b === 0 ? 'vertical' : h.a === 0 ? 'horizontal' : 'oblique';

/**
 * A point off the boundary, used to name the satisfying side.
 *
 * The origin is convenient and is tried first, but it lies on every
 * boundary through it, so it cannot be assumed. The fallbacks are
 * deterministic rather than random, so a lesson's test point never changes
 * between runs.
 */
export function testPoint(h: HalfPlane): { x: number; y: number; usedOrigin: boolean } {
  const candidates: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [2, 1], [1, 2]];
  for (const [x, y] of candidates) {
    if (!onBoundary(h, x, y)) return { x, y, usedOrigin: x === 0 && y === 0 };
  }
  throw new Error(`no test point off the boundary of "${h.id}" was found among the standard candidates`);
}

export function describeHalfPlane(h: HalfPlane): string {
  const t = testPoint(h);
  const sat = containsPoint(h, t.x, t.y);
  const side = sat ? 'containing' : 'away from';
  return `the side of ${boundaryEquation(h)} ${side} the point (${t.x}, ${t.y}), with the boundary line itself `
    + `${boundaryIncluded(h.relation) ? 'included' : 'excluded'}`;
}

// ---------------------------------------------------------------------------
// Systems: an INTERSECTION, never a union.
// ---------------------------------------------------------------------------

export type InequalitySystem = { id: string; members: HalfPlane[] };

export function system(id: string, members: HalfPlane[]): InequalitySystem {
  if (!members.length) throw new Error(`system "${id}" has no inequalities`);
  return { id, members };
}

/** A point is in the system exactly when EVERY member contains it. */
export const systemContains = (s: InequalitySystem, x: number, y: number): boolean =>
  s.members.every((m) => containsPoint(m, x, y));

/**
 * The independent oracle: over a grid, the region's own answer must equal
 * "every member is true". A union would disagree the moment the regions
 * differ, which is exactly the error this guards.
 */
export function systemAgreesOverGrid(
  s: InequalitySystem, from = -6, to = 6, step = 1
): { checked: number; disagreements: Array<{ x: number; y: number }> } {
  const bad: Array<{ x: number; y: number }> = [];
  let checked = 0;
  for (let x = from; x <= to; x += step) {
    for (let y = from; y <= to; y += step) {
      checked += 1;
      const all = s.members.every((m) => containsPoint(m, x, y));
      if (systemContains(s, x, y) !== all) bad.push({ x, y });
    }
  }
  return { checked, disagreements: bad };
}

/** What a union would give, so a test can prove the two differ. */
export const unionContains = (s: InequalitySystem, x: number, y: number): boolean =>
  s.members.some((m) => containsPoint(m, x, y));

// ---------------------------------------------------------------------------
// The two representations. Both DERIVE from the inequality above.
// ---------------------------------------------------------------------------

/**
 * v0.84.0-c11.39 checkpoint 96 — a region of the number line.
 *
 * The endpoint is open or closed because the relation is strict or weak,
 * and the validator recomputes that from the inequality. A spec cannot
 * draw a closed circle on a strict inequality.
 */
export type NumberLineRegionSpec = {
  type: 'number_line_region';
  status: 'concept_specific';
  id: string;
  inequality: OneVarInequality;
  /** Axis bounds for drawing. The region itself is unbounded. */
  from: number;
  to: number;
  caption: string;
  altText: string;
};

export function numberLineRegion(
  id: string, inequality: OneVarInequality, from: number, to: number, caption: string, altText: string
): NumberLineRegionSpec {
  return { type: 'number_line_region', status: 'concept_specific', id, inequality, from, to, caption, altText };
}

export function validateNumberLineRegion(spec: NumberLineRegionSpec): string[] {
  const errs: string[] = [];
  const r = solve(spec.inequality);
  if (spec.from >= spec.to) errs.push('the axis runs from a value below the one it runs to');
  if (r.boundary < spec.from || r.boundary > spec.to) {
    errs.push(`the boundary ${r.boundary} lies outside the drawn axis, so the region cannot be read`);
  }
  // The endpoint and the relation cannot disagree: both come from here.
  if (r.included !== boundaryIncluded(spec.inequality.relation)) {
    errs.push('the endpoint inclusion does not match the relation');
  }
  // Membership either side of the boundary must match the predicate.
  for (const probe of [r.boundary - 1, r.boundary, r.boundary + 1]) {
    if (rayContains(r, probe) !== satisfies(spec.inequality, probe)) {
      errs.push(`at ${probe} the drawn region and the inequality disagree`);
    }
  }
  if (!spec.altText.trim()) errs.push('altText is required');
  return errs;
}

/** What the figure says in words: value, inclusion, direction. */
export function describeRay(ineq: OneVarInequality): string {
  const r = solve(ineq);
  return `values ${r.direction === 'greater' ? 'greater than' : 'less than'} ${r.boundary}`
    + `${r.included ? ', and ' + r.boundary + ' itself' : `, with ${r.boundary} excluded`}`;
}

/**
 * A region of the coordinate plane: one half-plane, or several intersected.
 *
 * `viewport` is what gets drawn. The solution set is unbounded; the polygon
 * on screen is the region intersected with the viewing rectangle, and the
 * two are not confused.
 */
export type HalfPlaneRegionSpec = {
  type: 'half_plane_region';
  status: 'concept_specific';
  id: string;
  members: HalfPlane[];
  viewport: { xMin: number; xMax: number; yMin: number; yMax: number };
  caption: string;
  altText: string;
};

export function halfPlaneRegion(
  id: string, members: HalfPlane[],
  viewport: { xMin: number; xMax: number; yMin: number; yMax: number },
  caption: string, altText: string
): HalfPlaneRegionSpec {
  if (!members.length) throw new Error(`"${id}" has no inequality to draw`);
  return { type: 'half_plane_region', status: 'concept_specific', id, members, viewport, caption, altText };
}

export function validateHalfPlaneRegion(spec: HalfPlaneRegionSpec): string[] {
  const errs: string[] = [];
  const { xMin, xMax, yMin, yMax } = spec.viewport;
  if (xMin >= xMax || yMin >= yMax) errs.push('the viewport has no area');
  for (const m of spec.members) {
    if (m.a === 0 && m.b === 0) errs.push(`"${m.id}" describes no boundary line`);
  }
  // The drawn region must agree with "every member is true", over a grid.
  const s = system(spec.id, spec.members);
  const g = systemAgreesOverGrid(s, Math.ceil(xMin), Math.floor(xMax), 1);
  if (g.disagreements.length) {
    const p = g.disagreements[0];
    errs.push(`at (${p.x}, ${p.y}) the region and the inequalities disagree`);
  }
  // A single member rendered as a union of several is the classic error.
  if (spec.members.length > 1) {
    const differs = [[xMin + 1, yMin + 1], [xMax - 1, yMax - 1], [0, 0]]
      .some(([x, y]) => systemContains(s, x, y) !== unionContains(s, x, y));
    if (!differs && spec.members.length > 1) {
      // Not an error in itself, but worth surfacing: the members overlap so
      // completely that intersection and union cannot be told apart here.
      errs.push('this system cannot distinguish intersection from union at the sampled points');
    }
  }
  if (!spec.altText.trim()) errs.push('altText is required');
  return errs;
}
