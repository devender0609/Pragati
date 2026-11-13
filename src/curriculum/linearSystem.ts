// ===========================================================================
// v0.84.0-c10.6 checkpoint 60 — ONE PAIR OF EQUATIONS, FOUR WAYS TO READ IT.
//
// A pair of linear equations can be read graphically, classified from its
// coefficients, solved by substitution and solved by elimination. All four
// must describe exactly the same solution set. The failure this module
// exists to prevent is a lesson whose graph shows intersecting lines while
// its algebra says parallel — a contradiction no reader would catch, because
// each half looks right on its own.
//
// So a pair is ONE object. The classification, the solution, the points
// plotted on each line and the intersection drawn between them are all
// derived from the same coefficients.
//
// Two deliberate implementation choices:
//
//   * Classification uses CROSS PRODUCTS (a1b2 vs a2b1), never ratios.
//     a1/a2 === b1/b2 divides by a coefficient that may be zero and compares
//     floats for equality; a1*b2 === a2*b1 does neither.
//
//   * Coefficients are integers and the solution is kept as an exact
//     RATIONAL. Classifying lines by rounded slopes is how a coincident pair
//     becomes "parallel" in the fourteenth decimal place.
//
// General for linear systems. Nothing here knows about Chapter 3.
// ===========================================================================

/** a·x + b·y = c, with integer coefficients. */
export type LinearEquation = {
  a: number;
  b: number;
  c: number;
  /** How the lesson writes it, e.g. '2x + 3y = 12'. */
  label: string;
};

export type LinearSystem = {
  id: string;
  first: LinearEquation;
  second: LinearEquation;
  /** What x and y stand for, when the pair came from a situation. */
  meaning?: { x: string; y: string };
};

export type Consistency = 'unique' | 'no_solution' | 'infinitely_many';
export type LineRelationship = 'intersecting' | 'distinct_parallel' | 'coincident';

/** An exact rational, so no classification ever rests on a rounded value. */
export type Rational = { num: number; den: number };

const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));

export function rational(num: number, den: number): Rational {
  if (den === 0) throw new Error('rational with zero denominator');
  const g = gcd(num, den) || 1;
  const sign = den < 0 ? -1 : 1;
  return { num: (sign * num) / g, den: (sign * den) / g };
}

export const toNumber = (r: Rational): number => r.num / r.den;

export function formatRational(r: Rational): string {
  return r.den === 1 ? String(r.num) : `${r.num}/${r.den}`;
}

/** a1b2 − a2b1. Zero exactly when the lines are parallel or coincident. */
export function determinant(s: LinearSystem): number {
  return s.first.a * s.second.b - s.second.a * s.first.b;
}

/**
 * Classify from the coefficients, by cross products only.
 *
 * A zero determinant means the lines have the same direction. They are then
 * coincident if the constants are in that same proportion, and distinct
 * parallels otherwise — and that second comparison is also a cross product.
 */
export function classify(s: LinearSystem): Consistency {
  const { first: p, second: q } = s;
  if (determinant(s) !== 0) return 'unique';
  // Same direction. Does the constant follow the same proportion?
  const sameAsA = p.a * q.c === q.a * p.c;
  const sameAsB = p.b * q.c === q.b * p.c;
  return sameAsA && sameAsB ? 'infinitely_many' : 'no_solution';
}

/** The geometric reading. Derived from the same coefficients, never authored. */
export function lineRelationship(s: LinearSystem): LineRelationship {
  const c = classify(s);
  if (c === 'unique') return 'intersecting';
  return c === 'infinitely_many' ? 'coincident' : 'distinct_parallel';
}

/** Consistent means "has at least one solution" — unique OR infinitely many. */
export function isConsistent(s: LinearSystem): boolean {
  return classify(s) !== 'no_solution';
}

/** The exact solution by Cramer's rule, or null when there is not exactly one. */
export function uniqueSolution(s: LinearSystem): { x: Rational; y: Rational } | null {
  const d = determinant(s);
  if (d === 0) return null;
  const { first: p, second: q } = s;
  return {
    x: rational(p.c * q.b - q.c * p.b, d),
    y: rational(p.a * q.c - q.a * p.c, d),
  };
}

/** Does this ordered pair satisfy the equation exactly? */
export function satisfies(e: LinearEquation, x: Rational, y: Rational): boolean {
  // a·(xn/xd) + b·(yn/yd) = c, cleared of denominators.
  const left = e.a * x.num * y.den + e.b * y.num * x.den;
  const right = e.c * x.den * y.den;
  return left === right;
}

/** Both equations, which is the only check worth making. */
export function satisfiesBoth(s: LinearSystem, x: Rational, y: Rational): boolean {
  return satisfies(s.first, x, y) && satisfies(s.second, x, y);
}

/**
 * Is the second equation a non-zero scalar multiple of the first? This is
 * what makes two different-looking equations the same line, and it is the
 * honest test for "infinitely many" — distinct from merely sharing points.
 */
export function scalarMultiple(s: LinearSystem): Rational | null {
  if (classify(s) !== 'infinitely_many') return null;
  const { first: p, second: q } = s;
  if (p.a !== 0) return rational(q.a, p.a);
  if (p.b !== 0) return rational(q.b, p.b);
  if (p.c !== 0) return rational(q.c, p.c);
  return null;
}

// --- points on a line, derived -------------------------------------------

/** Two integer points on ax + by = c, chosen so both are exact. */
export function pointsOn(e: LinearEquation, hints: number[] = [0, 1, 2, 3, -1, -2, 4, 6]): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  if (e.b !== 0) {
    for (const x of hints) {
      const y = (e.c - e.a * x) / e.b;
      if (Number.isInteger(y)) out.push({ x, y });
      if (out.length === 2) return out;
    }
  }
  if (e.a !== 0) {
    for (const y of hints) {
      const x = (e.c - e.b * y) / e.a;
      if (Number.isInteger(x) && !out.some((p) => p.x === x && p.y === y)) out.push({ x, y });
      if (out.length === 2) return out;
    }
  }
  return out;
}

export function pointIsOn(e: LinearEquation, p: { x: number; y: number }): boolean {
  return e.a * p.x + e.b * p.y === e.c;
}

// --- the two algebraic methods, as traced procedures ----------------------

export type SolveStep = { text: string; detail: string };
export type SolveTrace = {
  method: 'substitution' | 'elimination';
  steps: SolveStep[];
  outcome: Consistency;
  solution: { x: Rational; y: Rational } | null;
  /** What the degenerate line read, when one appeared. */
  degenerateReading?: '0 = 0' | '0 = k';
};

/**
 * Substitution, traced. Isolates a variable in whichever equation makes it
 * cleanest, substitutes, and reports what the resulting equation says —
 * including when it collapses.
 */
export function solveBySubstitution(s: LinearSystem): SolveTrace {
  const steps: SolveStep[] = [];
  const { first: p, second: q } = s;
  const outcome = classify(s);
  // Isolate y from the first equation where possible, else x.
  const isolateY = p.b !== 0;
  if (isolateY) {
    steps.push({
      text: `From ${p.label}, isolate y: y = (${p.c} \u2212 ${p.a}x) / ${p.b}.`,
      detail: 'Dividing by a non-zero coefficient gives an equivalent equation, so no solution is gained or lost.',
    });
    steps.push({
      text: `Substitute that expression for y into ${q.label}.`,
      detail: 'The second equation now contains only x, because y has been replaced by something equal to it.',
    });
  } else {
    steps.push({
      text: `From ${p.label}, isolate x: x = (${p.c} \u2212 ${p.b}y) / ${p.a}.`,
      detail: 'The first equation has no y term to isolate, so x is isolated instead.',
    });
  }
  if (outcome === 'unique') {
    const sol = uniqueSolution(s)!;
    steps.push({
      text: `Solving gives x = ${formatRational(sol.x)}.`,
      detail: 'One variable has been determined, so the other follows by back-substitution.',
    });
    steps.push({
      text: `Back-substituting gives y = ${formatRational(sol.y)}.`,
      detail: 'Substituting the known x into the isolated expression returns the matching y.',
    });
    steps.push({
      text: `Check (${formatRational(sol.x)}, ${formatRational(sol.y)}) in BOTH original equations.`,
      detail: 'A pair satisfying only one equation is not a solution of the system, so one check is never enough.',
    });
    return { method: 'substitution', steps, outcome, solution: sol };
  }
  const reading = outcome === 'infinitely_many' ? '0 = 0' : '0 = k';
  steps.push({
    text: `Every x term cancels, leaving ${reading}.`,
    detail: outcome === 'infinitely_many'
      ? 'A statement true for every x means the substitution removed no information: the second equation said nothing the first had not already said.'
      : 'A false statement means no value of x can satisfy both equations at once, so the pair has no solution.',
  });
  return { method: 'substitution', steps, outcome, solution: null, degenerateReading: reading };
}

/**
 * Elimination, traced. Scales both equations so one variable's coefficients
 * match, then subtracts.
 */
export function solveByElimination(s: LinearSystem): SolveTrace {
  const steps: SolveStep[] = [];
  const { first: p, second: q } = s;
  const outcome = classify(s);
  const m1 = q.a;
  const m2 = p.a;
  steps.push({
    text: `Multiply ${p.label} by ${m1} and ${q.label} by ${m2}, so both x terms become ${p.a * q.a}x.`,
    detail: 'Multiplying an entire equation by a non-zero number gives an equivalent equation \u2014 every term on both sides, not just the side being matched.',
  });
  steps.push({
    text: 'Subtract the second from the first, so the x terms cancel.',
    detail: 'Subtracting equal quantities from equal quantities preserves equality, which is why the result is still true of any common solution.',
  });
  if (outcome === 'unique') {
    const sol = uniqueSolution(s)!;
    steps.push({
      text: `What remains gives y = ${formatRational(sol.y)}.`,
      detail: 'Only one variable is left, so the remaining equation determines it.',
    });
    steps.push({
      text: `Back-substituting into ${p.label} gives x = ${formatRational(sol.x)}.`,
      detail: 'Either original equation may be used; using one and checking in the other verifies the pair.',
    });
    steps.push({
      text: `Check (${formatRational(sol.x)}, ${formatRational(sol.y)}) in both equations.`,
      detail: 'The solution belongs to the system, so it must satisfy both members of it.',
    });
    return { method: 'elimination', steps, outcome, solution: sol };
  }
  const reading = outcome === 'infinitely_many' ? '0 = 0' : '0 = k';
  steps.push({
    text: `Both variables cancel, leaving ${reading}.`,
    detail: outcome === 'infinitely_many'
      ? 'This is information, not an accident: the two equations describe the same line, so every point on it solves both.'
      : 'This is information, not an accident: a false numerical statement means the two lines never meet.',
  });
  return { method: 'elimination', steps, outcome, solution: null, degenerateReading: reading };
}

// --- validation ------------------------------------------------------------

export function validateLinearSystem(s: LinearSystem): string[] {
  const errs: string[] = [];
  for (const [name, e] of [['first', s.first], ['second', s.second]] as const) {
    if (e.a === 0 && e.b === 0) errs.push(`${name}: not a linear equation in two variables`);
    for (const k of ['a', 'b', 'c'] as const) {
      if (!Number.isInteger(e[k])) errs.push(`${name}: coefficient ${k} must be an integer for exact classification`);
    }
    if (!e.label.trim()) errs.push(`${name}: needs a label`);
    // The label must state the same equation the coefficients do.
    const digits = e.label.replace(/[^0-9]/g, '');
    if (!digits.includes(String(Math.abs(e.c)))) {
      errs.push(`${name}: label "${e.label}" does not show the constant ${e.c}`);
    }
  }
  // Graph and algebra must agree, by construction.
  const expected: Record<Consistency, LineRelationship> = {
    unique: 'intersecting', no_solution: 'distinct_parallel', infinitely_many: 'coincident',
  };
  if (lineRelationship(s) !== expected[classify(s)]) {
    errs.push(`classification ${classify(s)} disagrees with geometry ${lineRelationship(s)}`);
  }
  // Where there is a unique solution it must satisfy both equations.
  const sol = uniqueSolution(s);
  if (sol && !satisfiesBoth(s, sol.x, sol.y)) errs.push('the computed solution does not satisfy both equations');
  if (!sol && classify(s) === 'unique') errs.push('classified unique but no solution could be computed');
  // Both methods must agree with the classifier and with each other.
  const sub = solveBySubstitution(s);
  const elim = solveByElimination(s);
  if (sub.outcome !== classify(s)) errs.push(`substitution reports ${sub.outcome}, classifier says ${classify(s)}`);
  if (elim.outcome !== classify(s)) errs.push(`elimination reports ${elim.outcome}, classifier says ${classify(s)}`);
  if (sub.solution && elim.solution) {
    if (toNumber(sub.solution.x) !== toNumber(elim.solution.x) || toNumber(sub.solution.y) !== toNumber(elim.solution.y)) {
      errs.push('substitution and elimination disagree on the solution');
    }
  }
  // Plotted points must lie on their lines.
  for (const [name, e] of [['first', s.first], ['second', s.second]] as const) {
    const pts = pointsOn(e);
    if (pts.length < 2) errs.push(`${name}: fewer than two integer points found for plotting`);
    for (const pt of pts) if (!pointIsOn(e, pt)) errs.push(`${name}: point (${pt.x}, ${pt.y}) is not on the line`);
  }
  return errs;
}

/**
 * A pair of equations drawn on axes. The spec holds the SYSTEM, not a list
 * of coordinates: every point, every line and the intersection are derived
 * from the same coefficients the algebra uses, so a figure cannot show
 * intersecting lines while the classifier says parallel.
 *
 * Coincident pairs are drawn as ONE line carrying both equation labels,
 * because two near-overlapping strokes would suggest two different sets of
 * points, which is the opposite of what coincident means.
 */
export type LinearSystemGraphSpec = {
  type: 'linear_system_graph';
  purpose: 'show_definition' | 'support_reasoning' | 'compare_cases';
  status: 'concept_specific';
  system: LinearSystem;
  /**
   * The visible extent. The window runs from -span/4 to span on both axes,
   * so the origin is always in view and the scale is set by one number
   * rather than four that could disagree with each other.
   */
  span: number;
  caption: string;
  altText: string;
};

export type GraphWindow = { xMin: number; xMax: number; yMin: number; yMax: number };

/** The window a span denotes. Derived, so it cannot drift from the scale. */
export function windowOf(spec: LinearSystemGraphSpec): GraphWindow {
  const lo = -spec.span / 4;
  return { xMin: lo, xMax: spec.span, yMin: lo, yMax: spec.span };
}

/** Where a line crosses the window edges, for drawing. Derived. */
export function clipToWindow(
  e: LinearEquation,
  w: GraphWindow
): Array<{ x: number; y: number }> {
  const hits: Array<{ x: number; y: number }> = [];
  const push = (x: number, y: number) => {
    if (x >= w.xMin - 1e-9 && x <= w.xMax + 1e-9 && y >= w.yMin - 1e-9 && y <= w.yMax + 1e-9) {
      if (!hits.some((h) => Math.abs(h.x - x) < 1e-9 && Math.abs(h.y - y) < 1e-9)) hits.push({ x, y });
    }
  };
  if (e.b !== 0) {
    push(w.xMin, (e.c - e.a * w.xMin) / e.b);
    push(w.xMax, (e.c - e.a * w.xMax) / e.b);
  }
  if (e.a !== 0) {
    push((e.c - e.b * w.yMin) / e.a, w.yMin);
    push((e.c - e.b * w.yMax) / e.a, w.yMax);
  }
  return hits.slice(0, 2);
}

export function validateLinearSystemGraph(spec: LinearSystemGraphSpec): string[] {
  const errs = validateLinearSystem(spec.system);
  const s = spec.system;
  const w = windowOf(spec);
  if (spec.span <= 0) errs.push('span must be positive');
  for (const [name, e] of [['first', s.first], ['second', s.second]] as const) {
    const ends = clipToWindow(e, w);
    if (ends.length < 2) errs.push(`${name}: the line does not cross the window`);
    // Every drawn endpoint must satisfy its own equation.
    for (const p of ends) {
      if (Math.abs(e.a * p.x + e.b * p.y - e.c) > 1e-9) {
        errs.push(`${name}: drawn endpoint (${p.x}, ${p.y}) is not on the line`);
      }
    }
  }
  // Where the lines meet, the drawn meeting point must BE the algebraic one.
  const sol = uniqueSolution(s);
  if (sol) {
    const x = toNumber(sol.x);
    const y = toNumber(sol.y);
    if (!satisfiesBoth(s, sol.x, sol.y)) errs.push('the intersection does not satisfy both equations');
    if (x < w.xMin || x > w.xMax || y < w.yMin || y > w.yMax) {
      errs.push(`the intersection (${x}, ${y}) lies outside the drawn window`);
    }
  }
  if (!spec.altText.trim()) errs.push('altText is required');
  // The alt text must name the relationship the model computes.
  // The alt text must name the relationship the model computes — and must
  // not name a different one. Checking only for the right word let "never
  // meet" pass as a description of intersecting lines, because it contains
  // "meet".
  const rel = lineRelationship(s);
  const says = {
    intersecting: /\bintersect|\bcross(?!ing out)|meet at\b/i,
    distinct_parallel: /\bparallel\b/i,
    coincident: /\bcoincident\b|same line\b|lie on top\b/i,
  };
  const contradicts = {
    intersecting: /\bparallel\b|\bcoincident\b|never meet\b|same line\b/i,
    distinct_parallel: /\bcoincident\b|same line\b|\bintersect at\b|meet at\b/i,
    coincident: /\bparallel\b|never meet\b/i,
  };
  if (!says[rel].test(spec.altText)) errs.push(`altText does not describe the lines as ${rel}`);
  if (contradicts[rel].test(spec.altText)) errs.push(`altText describes the lines as something other than ${rel}`);
  return errs;
}
