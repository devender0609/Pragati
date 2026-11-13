// ===========================================================================
// v0.84.0-c11.15 checkpoint 85 — A CONIC AS ONE GEOMETRIC OBJECT.
//
// Each conic is a discriminated union carrying only the parameters its own
// geometry has. A parabola has a focus and a directrix and no centre; an
// ellipse has a centre and two foci and no directrix in this scope. Nothing
// is padded with nulls to make one oversized interface.
//
// From that one object come the standard equation, the focal data, the
// eccentricity, the latus rectum and the drawn curve, so there are never
// four independently authored truths about the same curve.
//
// `coordinateGeometry` supplies exact Rational, Point, Radical and distance,
// from Class 10 and unchanged. There is no second coordinate system here.
//
// It refuses a circle of non-positive radius, an ellipse whose semi-axes are
// equal or mis-ordered, and a hyperbola or parabola with a non-positive
// parameter: each throws rather than producing a contradictory object. It
// does not classify an arbitrary second-degree equation, which this
// chapter's source does not cover.
// ===========================================================================

import {
  type Point, type Radical, type Rational, distance, formatRadical,
  formatRational, pt, rational,
} from './coordinateGeometry';

const rMul = (a: Rational, b: Rational) => rational(a.num * b.num, a.den * b.den);
const rSub = (a: Rational, b: Rational) => rational(a.num * b.den - b.num * a.den, a.den * b.den);
const num = (r: Rational) => r.num / r.den;

/** An exact square root, reduced so root(16) is 4 and root(8) is 2 root(2). */
export function exactRoot(value: Rational): Radical {
  if (value.num < 0) throw new Error('a length cannot come from a negative square');
  if (value.num === 0) return { coefficient: rational(0, 1), radicand: 1 };
  let outside = 1, inside = value.num * value.den;
  for (let f = Math.floor(Math.sqrt(inside)); f >= 2; f -= 1) {
    if (inside % (f * f) === 0) { outside *= f; inside /= f * f; f = Math.floor(Math.sqrt(inside)) + 1; }
  }
  return { coefficient: rational(outside, value.den), radicand: inside };
}

export const radicalValueOf = (r: Radical): number =>
  (r.coefficient.num / r.coefficient.den) * Math.sqrt(r.radicand);

export type Orientation = 'horizontal' | 'vertical';

export type Circle = { kind: 'circle'; id: string; centre: Point; radius: Rational };

export type Parabola = {
  kind: 'parabola'; id: string; vertex: Point;
  /** The a of y² = 4ax: the distance from vertex to focus. */
  a: Rational;
  /** A sideways parabola is not a function of x, and that is no objection. */
  opens: 'right' | 'left' | 'up' | 'down';
};

export type Ellipse = {
  kind: 'ellipse'; id: string; centre: Point;
  /** Semi-major, always the larger. */ a: Rational;
  /** Semi-minor, always the smaller. */ b: Rational;
  /**
   * Which axis the major one lies along. This distinguishes
   * x²/a² + y²/b² = 1 from x²/b² + y²/a² = 1 — a second orientation,
   * not a typo in the denominators.
   */
  majorAxis: Orientation;
};

export type Hyperbola = {
  kind: 'hyperbola'; id: string; centre: Point;
  /** Semi-transverse. */ a: Rational;
  /** Semi-conjugate. */ b: Rational;
  transverseAxis: Orientation;
};

export type DegenerateConic = {
  kind: 'degenerate'; id: string;
  form: 'point' | 'straight_line' | 'pair_of_intersecting_lines';
  description: string;
};

export type Conic = Circle | Parabola | Ellipse | Hyperbola | DegenerateConic;

export function circle(id: string, centre: Point, radius: Rational): Circle {
  if (num(radius) <= 0) throw new Error('a circle needs a positive radius; radius zero is the degenerate point');
  return { kind: 'circle', id, centre, radius };
}

export function parabola(id: string, a: Rational, opens: Parabola['opens'] = 'right', vertex = pt('V', 0, 0, 'V')): Parabola {
  if (num(a) <= 0) throw new Error('the focal distance a must be positive; its sign is carried by the opening direction');
  return { kind: 'parabola', id, vertex, a, opens };
}

export function ellipse(id: string, a: Rational, b: Rational, majorAxis: Orientation = 'horizontal', centre = pt('C', 0, 0, 'C')): Ellipse {
  if (num(a) <= 0 || num(b) <= 0) throw new Error('both semi-axes of an ellipse must be positive');
  if (num(b) > num(a)) throw new Error('the semi-major axis a must not be smaller than the semi-minor axis b');
  if (num(a) === num(b)) throw new Error('equal semi-axes give a circle, not an ellipse');
  return { kind: 'ellipse', id, centre, a, b, majorAxis };
}

export function hyperbola(id: string, a: Rational, b: Rational, transverseAxis: Orientation = 'horizontal', centre = pt('C', 0, 0, 'C')): Hyperbola {
  if (num(a) <= 0 || num(b) <= 0) throw new Error('both parameters of a hyperbola must be positive');
  return { kind: 'hyperbola', id, centre, a, b, transverseAxis };
}

export const degenerate = (id: string, form: DegenerateConic['form'], description: string): DegenerateConic =>
  ({ kind: 'degenerate', id, form, description });

/** For an ellipse c² = a² − b²; for a hyperbola c² = a² + b². */
export function focalDistance(con: Ellipse | Hyperbola): Radical {
  const a2 = rMul(con.a, con.a), b2 = rMul(con.b, con.b);
  return exactRoot(con.kind === 'ellipse'
    ? rSub(a2, b2)
    : rational(a2.num * b2.den + b2.num * a2.den, a2.den * b2.den));
}

export function foci(con: Ellipse | Hyperbola): [Point, Point] {
  const c = radicalValueOf(focalDistance(con));
  const along = con.kind === 'ellipse' ? con.majorAxis : con.transverseAxis;
  const r = (v: number) => rational(Math.round(v * 1e6), 1e6);
  const mk = (i: number): Point => along === 'horizontal'
    ? { ...pt(`${con.id}_F${i + 1}`, 0, 0, i === 0 ? 'F₁' : 'F₂'), x: r(i === 0 ? -c : c), y: rational(0, 1) }
    : { ...pt(`${con.id}_F${i + 1}`, 0, 0, i === 0 ? 'F₁' : 'F₂'), x: rational(0, 1), y: r(i === 0 ? -c : c) };
  return [mk(0), mk(1)];
}

export function parabolaFocus(p: Parabola): Point {
  const a = num(p.a);
  const m: Record<Parabola['opens'], [number, number]> = {
    right: [a, 0], left: [-a, 0], up: [0, a], down: [0, -a],
  };
  const [x, y] = m[p.opens];
  return pt(`${p.id}_F`, x, y, 'F');
}

export function directrix(p: Parabola): { axis: 'x' | 'y'; at: Rational; written: string } {
  const a = p.a, neg = rational(-a.num, a.den);
  switch (p.opens) {
    case 'right': return { axis: 'x', at: neg, written: `x = ${formatRational(neg)}` };
    case 'left': return { axis: 'x', at: a, written: `x = ${formatRational(a)}` };
    case 'up': return { axis: 'y', at: neg, written: `y = ${formatRational(neg)}` };
    case 'down': return { axis: 'y', at: a, written: `y = ${formatRational(a)}` };
  }
}

/** e = c/a. Exact: below 1 for an ellipse, above 1 for a hyperbola. */
export function eccentricity(con: Ellipse | Hyperbola): Radical {
  const c = focalDistance(con);
  return {
    coefficient: rational(c.coefficient.num * con.a.den, c.coefficient.den * con.a.num),
    radicand: c.radicand,
  };
}

/** 2b²/a for an ellipse and a hyperbola, 4a for a parabola. */
export function latusRectum(con: Ellipse | Hyperbola | Parabola): Rational {
  if (con.kind === 'parabola') return rational(4 * con.a.num, con.a.den);
  const b2 = rMul(con.b, con.b);
  return rational(2 * b2.num * con.a.den, b2.den * con.a.num);
}

export const vertices = (con: Ellipse | Hyperbola): [Point, Point] => {
  const a = num(con.a);
  const along = con.kind === 'ellipse' ? con.majorAxis : con.transverseAxis;
  return along === 'horizontal'
    ? [pt(`${con.id}_V1`, -a, 0, 'V₁'), pt(`${con.id}_V2`, a, 0, 'V₂')]
    : [pt(`${con.id}_V1`, 0, -a, 'V₁'), pt(`${con.id}_V2`, 0, a, 'V₂')];
};

const sq = (r: Rational) => formatRational(rMul(r, r));

export function standardEquation(con: Conic): string {
  switch (con.kind) {
    case 'circle': {
      const h = num(con.centre.x), k = num(con.centre.y);
      const term = (v: number, s: string) =>
        (v === 0 ? `${s}\u00b2` : `(${s} ${v < 0 ? '+' : '\u2212'} ${Math.abs(v)})\u00b2`);
      return `${term(h, 'x')} + ${term(k, 'y')} = ${sq(con.radius)}`;
    }
    case 'parabola': {
      const four = formatRational(rational(4 * con.a.num, con.a.den));
      switch (con.opens) {
        case 'right': return `y\u00b2 = ${four}x`;
        case 'left': return `y\u00b2 = \u2212${four}x`;
        case 'up': return `x\u00b2 = ${four}y`;
        case 'down': return `x\u00b2 = \u2212${four}y`;
      }
      break;
    }
    case 'ellipse':
      // The denominators swap with the orientation; that is the whole point.
      return con.majorAxis === 'horizontal'
        ? `x\u00b2/${sq(con.a)} + y\u00b2/${sq(con.b)} = 1`
        : `x\u00b2/${sq(con.b)} + y\u00b2/${sq(con.a)} = 1`;
    case 'hyperbola':
      return con.transverseAxis === 'horizontal'
        ? `x\u00b2/${sq(con.a)} \u2212 y\u00b2/${sq(con.b)} = 1`
        : `y\u00b2/${sq(con.a)} \u2212 x\u00b2/${sq(con.b)} = 1`;
    case 'degenerate':
      return con.description;
  }
  return '';
}

export const onCircle = (c: Circle, p: Point): boolean =>
  Math.abs(radicalValueOf(distance(c.centre, p)) - num(c.radius)) < 1e-9;

/** Distance to the focus equals distance to the directrix. */
export function focusDirectrixHolds(p: Parabola, point: Point, tol = 1e-9): boolean {
  const f = parabolaFocus(p), d = directrix(p);
  const toFocus = radicalValueOf(distance(f, point));
  const coord = d.axis === 'x' ? num(point.x) : num(point.y);
  return Math.abs(toFocus - Math.abs(coord - num(d.at))) < tol;
}

/** On an ellipse the sum of focal distances is 2a, everywhere. */
export function focalSum(e: Ellipse, point: Point): number {
  const [f1, f2] = foci(e);
  return radicalValueOf(distance(f1, point)) + radicalValueOf(distance(f2, point));
}

/** On a hyperbola the DIFFERENCE of focal distances is 2a in magnitude. */
export function focalDifference(h: Hyperbola, point: Point): number {
  const [f1, f2] = foci(h);
  return Math.abs(radicalValueOf(distance(f1, point)) - radicalValueOf(distance(f2, point)));
}

export function conicParameterErrors(con: Conic): string[] {
  const e: string[] = [];
  if (con.kind === 'circle' && num(con.radius) <= 0) e.push('radius must be positive');
  if (con.kind === 'ellipse') {
    if (num(con.b) > num(con.a)) e.push('the semi-minor axis cannot exceed the semi-major axis');
    if (radicalValueOf(eccentricity(con)) >= 1) e.push('an ellipse must have eccentricity below 1');
  }
  if (con.kind === 'hyperbola' && radicalValueOf(eccentricity(con)) <= 1) {
    e.push('a hyperbola must have eccentricity above 1');
  }
  if (con.kind === 'parabola' && num(con.a) <= 0) e.push('the focal distance must be positive');
  return e;
}

export type ConicGraphSpec = {
  type: 'conic_graph'; id: string;
  conic: Circle | Parabola | Ellipse | Hyperbola;
  showFoci?: boolean; showDirectrix?: boolean; showAxes?: boolean;
  span: number; altText: string; caption: string; status: 'verified' | 'unverified';
};

export const conicGraph = (
  id: string, conic: ConicGraphSpec['conic'], altText: string,
  o: Partial<Pick<ConicGraphSpec, 'showFoci' | 'showDirectrix' | 'showAxes' | 'span'>> = {}
): ConicGraphSpec => ({
  type: 'conic_graph', id, conic,
  showFoci: o.showFoci ?? false, showDirectrix: o.showDirectrix ?? false,
  showAxes: o.showAxes ?? false, span: o.span ?? 8,
  altText, caption: altText, status: 'verified',
});

export function validateConicGraph(spec: ConicGraphSpec): string[] {
  const e = [...conicParameterErrors(spec.conic)];
  if (spec.showDirectrix && spec.conic.kind !== 'parabola') e.push('only a parabola carries a directrix in this chapter');
  if (spec.showFoci && spec.conic.kind === 'circle') e.push('a circle has a centre rather than foci');
  if (spec.span <= 0) e.push('the span must be positive');
  if (!spec.altText.trim()) e.push('altText is required');
  return e;
}

/**
 * Sampled points, as SEPARATE branches. A hyperbola has two and they must
 * never be joined — the discipline the trigonometric and rational graphs
 * already follow.
 */
export function conicBranches(con: ConicGraphSpec['conic'], span: number): Array<Array<{ x: number; y: number }>> {
  if (con.kind === 'circle') {
    const r = num(con.radius), h = num(con.centre.x), k = num(con.centre.y);
    const ring = [];
    for (let t = 0; t <= Math.PI * 2 + 0.01; t += Math.PI / 60) ring.push({ x: h + r * Math.cos(t), y: k + r * Math.sin(t) });
    return [ring];
  }
  if (con.kind === 'ellipse') {
    const [rx, ry] = con.majorAxis === 'horizontal' ? [num(con.a), num(con.b)] : [num(con.b), num(con.a)];
    const ring = [];
    for (let t = 0; t <= Math.PI * 2 + 0.01; t += Math.PI / 60) ring.push({ x: rx * Math.cos(t), y: ry * Math.sin(t) });
    return [ring];
  }
  if (con.kind === 'parabola') {
    const a = num(con.a), step = span / 80, arc = [];
    for (let t = -span; t <= span; t += step) {
      const p = con.opens === 'right' ? { x: (t * t) / (4 * a), y: t }
        : con.opens === 'left' ? { x: -(t * t) / (4 * a), y: t }
        : con.opens === 'up' ? { x: t, y: (t * t) / (4 * a) }
        : { x: t, y: -(t * t) / (4 * a) };
      if (Math.abs(p.x) <= span && Math.abs(p.y) <= span) arc.push(p);
    }
    return [arc];
  }
  // Two branches, built separately so nothing can join them.
  const a = num(con.a), b = num(con.b), out = [];
  for (const sign of [1, -1]) {
    const branch = [];
    for (let t = -2.2; t <= 2.2; t += 0.04) {
      const ch = Math.cosh(t), sh = Math.sinh(t);
      const p = con.transverseAxis === 'horizontal'
        ? { x: sign * a * ch, y: b * sh }
        : { x: b * sh, y: sign * a * ch };
      if (Math.abs(p.x) <= span && Math.abs(p.y) <= span) branch.push(p);
    }
    if (branch.length) out.push(branch);
  }
  return out;
}

export type ConeSectionType =
  | 'circle' | 'ellipse' | 'parabola' | 'hyperbola'
  // The degenerate results, named outcomes rather than malformed conics.
  | 'point' | 'straight line' | 'pair of intersecting lines';

export type ConeSectionSpec = {
  type: 'cone_section'; id: string;
  cut: 'perpendicular_to_axis' | 'oblique_not_parallel_to_generator'
    | 'parallel_to_generator' | 'parallel_to_axis';
  /**
   * Whether the plane passes through the vertex. The same four tilts give
   * ordinary conics when it misses and degenerate ones when it does not.
   */
  throughVertex?: boolean;
  result: ConeSectionType;
  altText: string; caption: string; status: 'verified' | 'unverified';
};

const CUT_RESULT: Record<ConeSectionSpec['cut'], ConeSectionType> = {
  perpendicular_to_axis: 'circle',
  oblique_not_parallel_to_generator: 'ellipse',
  parallel_to_generator: 'parabola',
  parallel_to_axis: 'hyperbola',
};

const VERTEX_RESULT: Record<ConeSectionSpec['cut'], ConeSectionType> = {
  perpendicular_to_axis: 'point',
  oblique_not_parallel_to_generator: 'point',
  parallel_to_generator: 'straight line',
  parallel_to_axis: 'pair of intersecting lines',
};

export const coneSection = (
  id: string, cut: ConeSectionSpec['cut'], result: ConeSectionType, altText: string, throughVertex = false
): ConeSectionSpec => ({ type: 'cone_section', id, cut, result, throughVertex, altText, caption: altText, status: 'verified' });

export function validateConeSection(spec: ConeSectionSpec): string[] {
  const e: string[] = [];
  const expected = spec.throughVertex ? VERTEX_RESULT[spec.cut] : CUT_RESULT[spec.cut];
  if (expected !== spec.result) {
    e.push(`a plane ${spec.cut.replace(/_/g, ' ')}${spec.throughVertex ? ' through the vertex' : ''} cuts a ${expected}, not a ${spec.result}`);
  }
  if (!spec.altText.trim()) e.push('altText is required');
  return e;
}

export { formatRational, formatRadical, pt, rational };
