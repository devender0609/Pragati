import {
  validatePolynomialGraph,
  type PolynomialGraphSpec,
} from './polynomial';
import {
  validateLinearSystemGraph,
  type LinearSystemGraphSpec,
} from './linearSystem';
import {
  validateGroupedTable,
  type GroupedTableSpec,
} from './groupedDistribution';
import {
  validateCompositeSolid,
  type CompositeSolidSpec,
} from './compositeSolidSpecification';
// v0.61 §13 — THE MATHEMATICAL VISUAL SPECIFICATION SYSTEM.
//
// THE RULE
//
// A visual specification stores MATHEMATICAL SEMANTICS, not a picture.
// `{ min: 0, max: 1, partitions: 4, marked: 3/4 }` is a specification.
// `{ src: 'number-line.png' }` is an asset, and an asset cannot be
// checked for mathematical truth.
//
// This matters because the most common maths-illustration defect is
// silent: a number line whose intervals are drawn unequal, a fraction
// strip whose parts differ in width, a pie chart whose sectors do not
// sum to the whole. Each teaches something false while looking fine.
// When the semantics are stored, the renderer computes positions from
// the mathematics and the error becomes impossible rather than
// unnoticed.
//
// A visual must also have a PURPOSE. Decorative stock art is not
// instructional visual coverage and must never be counted as such —
// enforced by the `purpose` field being required.

// ---------------------------------------------------------------------------
// The catalogue
// ---------------------------------------------------------------------------

export const VISUAL_TYPES = [
  'number_line',
  'ten_frame',
  'place_value_blocks',
  'fraction_strip',
  'fraction_area_model',
  'fraction_circle',
  'ratio_table',
  'bar_model',
  'coordinate_plane',
  'geometry_construction',
  'angle_diagram',
  'transformation',
  'graph',
  'data_table',
  'algebra_tiles',
  // v0.80 §A — adjacency-based reasoning (Ganita Prakash §3.2).
  'number_grid',
] as const;
export type VisualType = (typeof VISUAL_TYPES)[number];

/** Why this visual exists. Required — a visual with no mathematical
 *  purpose is decoration. */
export type VisualPurpose =
  | 'introduce_concept'
  | 'show_equivalence'
  | 'compare_quantities'
  | 'model_operation'
  | 'reveal_structure'
  | 'expose_misconception'
  | 'support_worked_example';

export type VisualStatusLevel =
  | 'placeholder'
  | 'generic'
  | 'concept_specific'
  | 'mathematically_reviewed'
  | 'published';

// ---------------------------------------------------------------------------
// Number line — the demonstration section's primary representation
// ---------------------------------------------------------------------------

/**
 * An exact rational, stored as numerator over denominator.
 *
 * v0.61 §9 — WHAT THIS DOES AND DOES NOT CLAIM.
 *
 * numerator/denominator is the CANONICAL mathematical representation.
 * All curriculum semantics — equality, equivalence, ordering, whether
 * a point lands on a tick — are decided on these integers, via exact
 * integer arithmetic (see `fractionsEqual`, which cross-multiplies).
 *
 * Floating point IS used, deliberately and only, to derive screen
 * coordinates: `positionOnLine()` converts to decimal because a pixel
 * offset is inherently approximate. That is a rendering concern.
 *
 * The rule is therefore not "no floats anywhere" — `positionOnLine`
 * would contradict it. The rule is that no curriculum claim may depend
 * on approximate float equality. 1/3 has no finite decimal; a renderer
 * may place it at 0.3333 pixels-worth of the way along, but nothing may
 * decide that 1/3 EQUALS 0.3333.
 */
export type ExactFraction = {
  numerator: number;
  denominator: number;
};

export type NumberLinePoint = {
  value: ExactFraction;
  label?: string;
  /** Visual emphasis, not mathematical meaning. */
  emphasis?: 'primary' | 'secondary' | 'muted';
};

export type NumberLineSpec = {
  type: 'number_line';
  purpose: VisualPurpose;
  status: VisualStatusLevel;
  /** Mathematical semantics. The renderer derives every pixel from
   *  these; nothing is positioned by hand. */
  min: ExactFraction;
  max: ExactFraction;
  /** Number of equal intervals between min and max. Equal by
   *  construction — the renderer cannot draw them otherwise. */
  partitions: number;
  /** Whether tick labels are shown as fractions. */
  labelTicks: boolean;
  markedPoints: NumberLinePoint[];
  /** A highlighted span, e.g. shading 0 → 3/4 to show length. */
  highlightFrom?: ExactFraction;
  highlightTo?: ExactFraction;
  /** Equivalent-fraction markers drawn on a second tier, used to show
   *  that 1/2 and 2/4 occupy the SAME point. */
  equivalenceTier?: {
    partitions: number;
    markedPoints: NumberLinePoint[];
  };
  orientation: 'horizontal' | 'vertical';
  caption: string;
  /** What a student should notice. Drives alt text as well. */
  altText: string;
};

/**
 * v0.61 §7 — one strip, stated unambiguously.
 *
 * THE DEFECT THIS REPLACES
 *
 * The previous shape was `rows: number[]` plus
 * `shaded: Record<number, number[]>`, and the record's keys were row
 * INDICES. But both the keys and the row values are plain numbers, so
 * `{ 2: [0, 1] }` reads equally naturally as "row index 2" (denominator
 * 4, giving 2/4) or "denominator 2" (giving 2/2). Under the first
 * reading the demonstration data was correct; under the second it was
 * 1/1, 2/2, 4/3 — not equivalent, and not what the caption claimed.
 *
 * The data was not wrong. The SCHEMA was: it admitted two readings and
 * a renderer had to guess. A specification whose meaning depends on the
 * reader is not a specification, and this is precisely the class of
 * silent error the visual system exists to eliminate.
 *
 * Now each strip names its own denominator and its own shaded count.
 * There is one reading.
 */
export type FractionStripRow = {
  /** How many equal parts this strip is cut into. */
  denominator: number;
  /** How many of those parts are shaded, counted from the left. */
  shadedCount: number;
  label?: string;
};

export type FractionStripSpec = {
  type: 'fraction_strip';
  purpose: VisualPurpose;
  status: VisualStatusLevel;
  strips: FractionStripRow[];
  /** When set, the visual ASSERTS that every listed strip represents
   *  the same value. Validation checks the arithmetic rather than
   *  trusting the caption. */
  assertsEquivalence?: boolean;
  caption: string;
  altText: string;
};

export type FractionAreaModelSpec = {
  type: 'fraction_area_model';
  purpose: VisualPurpose;
  status: VisualStatusLevel;
  shape: 'rectangle' | 'circle';
  partitions: number;
  shadedParts: number;
  caption: string;
  altText: string;
};

/**
 * v0.80 §A — NUMBER GRID.
 *
 * WHY THIS EXISTS
 *
 * Ganita Prakash §3.2 defines a supercell as a cell whose number is
 * larger than every one of its neighbours. That definition is about
 * ADJACENCY, and adjacency is a property of a layout — it cannot be
 * stated in a number line, a strip or an area model, which is why §3.2
 * could not be authored in v0.79.
 *
 * WHAT THE SPEC HOLDS AND WHAT IT REFUSES TO HOLD
 *
 * It holds the numbers and the layout. It does NOT hold which cells are
 * supercells: that is derivable from the numbers by the chapter's own
 * rule, and a spec that stored it would let a caption and a grid
 * disagree — the precise failure the fraction-strip schema was rewritten
 * in v0.61 to eliminate. `supercellsFor()` below computes them, and the
 * validator checks any claim the author makes against that computation
 * rather than trusting it.
 *
 * ADJACENCY IS DECLARED, NOT ASSUMED. The textbook's first supercell
 * exercises use a single row, where neighbours are left and right; a
 * grid of several rows raises the question of whether the cell above
 * counts. Rather than pick silently, `neighbourhood` states which rule
 * this visual uses, so a renderer, a validator and a teacher all read
 * the same definition.
 */
export type NumberGridCell = {
  value: number;
  /** Marked for attention — a cell under discussion, not an answer. */
  highlighted?: boolean;
  label?: string;
};

export type NumberGridSpec = {
  type: 'number_grid';
  purpose: VisualPurpose;
  status: VisualStatusLevel;
  /** Row-major. Every row must have the same length. */
  rows: NumberGridCell[][];
  /**
   * Which cells count as neighbours.
   *   'horizontal' — left and right only. The textbook's single-row case.
   *   'orthogonal' — up, down, left, right.
   */
  neighbourhood: 'horizontal' | 'orthogonal';
  /**
   * When set, the visual ASSERTS these cells are the supercells, and
   * validation recomputes them. Positions are [row, column], zero-based.
   */
  assertsSupercellsAt?: Array<[number, number]>;
  caption: string;
  altText: string;
};

/**
 * v0.84.0 checkpoint 32 — SECONDARY STAGE NEEDS A FIGURE.
 *
 * The four specs above are all number or fraction models, which carried
 * Classes 1-6 content. A Class 9 lesson on quadrilaterals cannot be
 * represented by any of them, and the honest options were to extend the
 * model or to ship a lesson whose See it layer is decorative. This adds
 * one geometry type rather than a Class-9-only content format.
 *
 * A point carries its own label; a segment names its endpoints and may
 * be marked (equal ticks, a right angle, parallel arrows) because those
 * marks ARE the mathematics in a geometry figure. Nothing here is
 * styling: a renderer draws what the mathematics asserts, and `altText`
 * must state the mathematically relevant content, not the appearance.
 */
export type GeometryPoint = { id: string; x: number; y: number; label: string };

export type GeometrySegment = {
  from: string;
  to: string;
  /** Marks that carry mathematical meaning, not decoration. */
  mark?: 'single_tick' | 'double_tick' | 'arrow' | 'double_arrow' | 'dashed';
  label?: string;
};

/**
 * v0.84.0 checkpoint 33 — CIRCLES, ADDED TO THE SAME FIGURE TYPE.
 *
 * The Chapter 5 pilot needed circles, arcs and right-angle marks, none of
 * which the checkpoint-32 figure could express. The alternative was a
 * CircleFigureSpec used by one chapter, which would have left the next
 * geometry chapter to invent a third. These are added to the one figure
 * type instead.
 *
 * A circle is defined by its centre and a point ON it, not by a radius
 * number, because that is what makes the figure mathematically faithful:
 * a chord drawn to a point the spec says is on the circle really lands on
 * it, and a renderer cannot quietly draw a chord through the centre when
 * a general chord was meant. `radius` exists only for a circle with no
 * named point on it.
 */
export type GeometryCircle = {
  id: string;
  /** Point id of the centre. */
  centre: string;
  /** Point id of a point ON the circle; preferred over a bare radius. */
  through?: string;
  /** Used only when no point on the circle is named. */
  radius?: number;
  label?: string;
};

export type GeometryArc = {
  circle: string;
  /** Point ids on that circle, taken anticlockwise from `from` to `to`. */
  from: string;
  to: string;
  mark?: 'single_tick' | 'double_tick';
  label?: string;
};

export type GeometryFigureSpec = {
  type: 'geometry_figure';
  purpose:
    | 'show_definition'
    | 'support_proof'
    | 'compare_cases'
    | 'show_counterexample'
    | 'show_construction'
    | 'show_tiling';
  status: 'concept_specific';
  points: GeometryPoint[];
  segments: GeometrySegment[];
  circles?: GeometryCircle[];
  arcs?: GeometryArc[];
  /** Angles the figure asserts, named by three point ids. */
  angleMarks?: Array<{
    at: string;
    from: string;
    to: string;
    label?: string;
    right?: boolean;
    /** Angles the figure asserts equal carry the same tag, so a reader and
     *  a validator agree on which equality is being claimed. */
    equalTag?: string;
  }>;
  /** Regions to shade, named by their boundary points in order. */
  shadedRegions?: Array<{ points: string[]; label?: string }>;
  /**
   * v0.84.0-c10.3 checkpoint 57 — PARALLELISM, ASSERTED AND CHECKED.
   *
   * Segments could already carry an arrow mark, which is the conventional
   * way to DRAW parallel lines. But a mark is ink: nothing stopped a figure
   * putting arrows on two segments that are not parallel, and the Basic
   * Proportionality Theorem is a statement whose entire hypothesis is a
   * parallel line. A proof figure that merely looks parallel would let the
   * proof rest on the drawing.
   *
   * So a figure may now assert parallelism, and `validateParallelGroups`
   * recomputes the directions from the coordinates. Each group lists
   * segments claimed mutually parallel.
   *
   * This is a general geometry relation, not a similarity one — a
   * quadrilaterals or coordinate lesson can assert it the same way.
   */
  parallelGroups?: Array<{
    segments: Array<{ from: string; to: string }>;
    label?: string;
  }>;
  /**
   * v0.84.0-c10.1 checkpoint 55 — SIDE ROLES, RELATIVE TO AN ANGLE.
   *
   * The Class 10 trigonometry pilot needed something no earlier chapter
   * did: a figure that asserts which side is OPPOSITE a chosen angle and
   * which is ADJACENT to it. Those are not properties of a side. The very
   * same segment is opposite angle A and adjacent to angle B, so a figure
   * that records them as fixed attributes would be recording a falsehood
   * the moment the reference angle changes.
   *
   * So the roles hang off the reference vertex, and a figure may declare
   * more than one set for the same triangle. Only the hypotenuse is
   * absolute, because the right angle fixes it.
   *
   * This is a general right-triangle semantic, not a trigonometric one — a
   * Pythagoras lesson can use it to say which side its argument is about.
   * `validateRightTriangleRoles` checks each claim against the coordinates,
   * so a mislabelled side cannot quietly become instructional truth.
   */
  rightTriangleRoles?: Array<{
    /** The acute angle the roles are relative to. */
    referenceVertex: string;
    /** The vertex carrying the right angle. */
    rightAngleVertex: string;
    /** The third vertex. */
    thirdVertex: string;
    /** Optional display name, e.g. 'A'. */
    referenceLabel?: string;
  }>;
  /**
   * True when the drawn coordinates are intended to be mathematically
   * exact — a derivation figure, where a claimed 30 degrees must really be
   * 30 degrees. Schematic figures leave this off and are not held to it.
   */
  exactGeometry?: boolean;
  caption: string;
  altText: string;
};

export type VisualSpec =
  | PolynomialGraphSpec
  | LinearSystemGraphSpec
  | GroupedTableSpec
  | CompositeSolidSpec
  | NumberLineSpec
  | FractionStripSpec
  | FractionAreaModelSpec
  | NumberGridSpec
  | GeometryFigureSpec;

// v0.84.0-c10.2 checkpoint 56 — composite solids join the union as their own
// spec rather than being forced into GeometryFigureSpec. A geometry figure
// records points and segments; a composite records which surfaces survive
// the join, which is a different kind of claim.

/**
 * The supercells of a grid, by the chapter's definition: strictly
 * greater than every neighbour.
 *
 * Strictly. A cell equal to its neighbour is not larger than it, so a
 * tie produces no supercell — which is the case an author is most
 * likely to get wrong by eye and the reason this is computed rather
 * than declared.
 */
export function supercellsFor(spec: NumberGridSpec): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  const rows = spec.rows;
  const deltas =
    spec.neighbourhood === 'horizontal'
      ? [[0, -1], [0, 1]]
      : [[0, -1], [0, 1], [-1, 0], [1, 0]];

  rows.forEach((row, r) => {
    row.forEach((cell, c) => {
      let isSuper = true;
      let hasNeighbour = false;
      for (const [dr, dc] of deltas) {
        const n = rows[r + dr]?.[c + dc];
        if (!n) continue;
        hasNeighbour = true;
        if (n.value >= cell.value) isSuper = false;
      }
      // A cell with no neighbours at all is not a supercell: there is
      // nothing for it to be larger than.
      if (isSuper && hasNeighbour) out.push([r, c]);
    });
  });
  return out;
}

function validateNumberGrid(spec: NumberGridSpec): string[] {
  const e: string[] = [];
  if (spec.rows.length === 0) e.push('number grid has no rows');
  const width = spec.rows[0]?.length ?? 0;
  if (width === 0) e.push('number grid has no columns');
  for (const [i, row] of spec.rows.entries()) {
    if (row.length !== width) {
      e.push(`row ${i} has ${row.length} cells, expected ${width}`);
    }
    for (const [j, cell] of row.entries()) {
      if (!Number.isFinite(cell.value)) {
        e.push(`cell ${i},${j} has a non-finite value`);
      }
    }
  }
  if (spec.assertsSupercellsAt) {
    const computed = supercellsFor(spec)
      .map(([r, c]) => `${r},${c}`)
      .sort();
    const claimed = spec.assertsSupercellsAt
      .map(([r, c]) => `${r},${c}`)
      .sort();
    if (computed.join('|') !== claimed.join('|')) {
      e.push(
        `asserted supercells [${claimed.join(' ')}] do not match the grid, which gives [${computed.join(' ')}]`
      );
    }
  }
  return e;
}

// ---------------------------------------------------------------------------
// Exact rational arithmetic — so the renderer never guesses
// ---------------------------------------------------------------------------

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function simplify(f: ExactFraction): ExactFraction {
  const g = gcd(f.numerator, f.denominator) || 1;
  return { numerator: f.numerator / g, denominator: f.denominator / g };
}

export function toDecimal(f: ExactFraction): number {
  return f.numerator / f.denominator;
}

export function fractionsEqual(a: ExactFraction, b: ExactFraction): boolean {
  // Cross-multiplication, not decimal comparison. 1/3 === 2/6 exactly.
  return a.numerator * b.denominator === b.numerator * a.denominator;
}

/**
 * Where does this value sit along the line, as a 0..1 proportion?
 *
 * The single function every number-line renderer must use. Positions
 * derived from the mathematics cannot drift out of proportion the way
 * hand-placed ones do.
 */
export function positionOnLine(
  value: ExactFraction,
  min: ExactFraction,
  max: ExactFraction
): number {
  const v = toDecimal(value);
  const lo = toDecimal(min);
  const hi = toDecimal(max);
  if (hi === lo) return 0;
  return (v - lo) / (hi - lo);
}

// ---------------------------------------------------------------------------
// Validation — catches the errors that look fine
// ---------------------------------------------------------------------------

export function validateNumberLine(spec: NumberLineSpec): string[] {
  const errors: string[] = [];

  if (spec.partitions < 1) {
    errors.push('partitions must be at least 1');
  }
  if (toDecimal(spec.min) >= toDecimal(spec.max)) {
    errors.push('min must be strictly less than max');
  }
  for (const p of spec.markedPoints) {
    if (p.value.denominator === 0) {
      errors.push(`marked point has zero denominator`);
      continue;
    }
    const pos = positionOnLine(p.value, spec.min, spec.max);
    if (pos < 0 || pos > 1) {
      errors.push(
        `marked point ${p.value.numerator}/${p.value.denominator} lies outside the line`
      );
    }
  }
  // A point that cannot land on a tick, on a line whose ticks are the
  // only reference, is unmarkable — the student sees a mark floating
  // between divisions with nothing to read it against.
  if (spec.labelTicks) {
    for (const p of spec.markedPoints) {
      const scaled =
        positionOnLine(p.value, spec.min, spec.max) * spec.partitions;
      if (Math.abs(scaled - Math.round(scaled)) > 1e-9) {
        errors.push(
          `marked point ${p.value.numerator}/${p.value.denominator} does not fall on a tick of a ${spec.partitions}-partition line`
        );
      }
    }
  }
  if (!spec.altText.trim()) {
    errors.push('altText is required — a visual with no description is unusable on a screen reader');
  }
  return errors;
}

/** The value a strip actually represents: shaded / denominator. */
export function stripValue(row: FractionStripRow): ExactFraction {
  return { numerator: row.shadedCount, denominator: row.denominator };
}

export function validateFractionStrip(spec: FractionStripSpec): string[] {
  const errors: string[] = [];

  for (const [i, row] of spec.strips.entries()) {
    if (row.denominator < 1) {
      errors.push(`strip ${i}: denominator must be at least 1`);
    }
    if (row.shadedCount < 0 || row.shadedCount > row.denominator) {
      errors.push(
        `strip ${i}: shades ${row.shadedCount} of ${row.denominator} parts, which is outside 0..${row.denominator}`
      );
    }
  }

  // v0.61 §7 — check the CLAIM, not the caption. A strip diagram that
  // says "these are equal" and draws unequal values teaches something
  // false while looking entirely reasonable.
  if (spec.assertsEquivalence && spec.strips.length > 1) {
    const first = stripValue(spec.strips[0]);
    for (const [i, row] of spec.strips.entries()) {
      if (i === 0) continue;
      const v = stripValue(row);
      if (!fractionsEqual(first, v)) {
        errors.push(
          `strip ${i} shows ${v.numerator}/${v.denominator}, which is not equal to ${first.numerator}/${first.denominator} — the visual asserts equivalence`
        );
      }
    }
  }

  if (!spec.altText.trim()) errors.push('altText is required');
  return errors;
}

export function validateVisual(spec: VisualSpec): string[] {
  switch (spec.type) {
    case 'number_line':
      return validateNumberLine(spec);
    case 'fraction_strip':
      return validateFractionStrip(spec);
    case 'fraction_area_model':
      return spec.shadedParts > spec.partitions
        ? ['shadedParts cannot exceed partitions']
        : [];
    case 'number_grid':
      return validateNumberGrid(spec);
    case 'geometry_figure':
      return validateGeometryFigure(spec);
    // v0.84.0-c10.2 checkpoint 56 — a composite solid validates its joins,
    // its dimension compatibility and its scope through its own module, so
    // the one entry point still covers every visual the product can hold.
    // v0.84.0-c10.5 checkpoint 59 — a grouped table validates its own
    // distribution AND that the three mean routes reconcile on it.
    // v0.84.0-c10.6 checkpoint 60 — a system graph validates that its plot,
    // its classification and both algebraic methods describe one solution set.
    // v0.84.0-c10.9 checkpoint 63 — a polynomial graph validates that every
    // sampled point, every marked intercept and the stated reading all come
    // from the same coefficients.
    case 'polynomial_graph':
      return validatePolynomialGraph(spec);
    case 'linear_system_graph':
      return validateLinearSystemGraph(spec);
    // v0.84.0-c10.6 checkpoint 60 — a linear-system graph validates that its
    // drawn lines, its intersection and its stated relationship all follow
    // from the same coefficients the algebra uses.
    case 'linear_system_graph':
      return validateLinearSystemGraph(spec);
    case 'grouped_table':
      return validateGroupedTable(spec);
    case 'composite_solid':
      return [
        ...validateCompositeSolid(spec),
        ...(spec.altText.trim() ? [] : ['altText is required']),
      ];
  }
}

/**
 * A geometry figure is wrong in ways a fraction strip cannot be: a
 * segment can name a point that is not in the figure, two points can sit
 * on top of each other, and alt text can describe how it looks without
 * saying what it asserts. Each of those is checked here rather than left
 * to a reader to notice.
 */
function validateGeometryFigure(spec: GeometryFigureSpec): string[] {
  const errors: string[] = [];
  // v0.84.0-c10.1/c10.3 — semantic claims are checked against the drawn
  // coordinates, so a figure cannot assert a relation it does not have.
  errors.push(...validateRightTriangleRoles(spec));
  errors.push(...validateAngleMarkGeometry(spec));
  errors.push(...validateParallelGroups(spec));
  const ids = new Set(spec.points.map((p) => p.id));
  if (spec.points.length < 3) errors.push('a figure needs at least three points');
  if (ids.size !== spec.points.length) errors.push('point ids must be unique');
  for (const p of spec.points) if (!p.label.trim()) errors.push(`point ${p.id} has no label`);
  const seen = new Set<string>();
  for (const p of spec.points) {
    const key = `${p.x},${p.y}`;
    if (seen.has(key)) errors.push(`two points share the position ${key}`);
    seen.add(key);
  }
  for (const s of spec.segments) {
    if (!ids.has(s.from) || !ids.has(s.to)) errors.push(`segment ${s.from}-${s.to} names a point that is not in the figure`);
    if (s.from === s.to) errors.push(`segment ${s.from}-${s.to} has no length`);
  }
  for (const a of spec.angleMarks ?? []) {
    for (const id of [a.at, a.from, a.to]) {
      if (!ids.has(id)) errors.push(`angle mark at ${a.at} names unknown point ${id}`);
    }
  }
  for (const r of spec.shadedRegions ?? []) {
    if (r.points.length < 3) errors.push('a shaded region needs at least three points');
    for (const id of r.points) if (!ids.has(id)) errors.push(`shaded region names unknown point ${id}`);
  }
  const circleIds = new Set((spec.circles ?? []).map((c) => c.id));
  if (circleIds.size !== (spec.circles ?? []).length) errors.push('circle ids must be unique');
  for (const c of spec.circles ?? []) {
    if (!ids.has(c.centre)) errors.push(`circle ${c.id} names an unknown centre ${c.centre}`);
    if (c.through && !ids.has(c.through)) errors.push(`circle ${c.id} names an unknown point ${c.through}`);
    if (!c.through && !c.radius) errors.push(`circle ${c.id} has neither a point on it nor a radius`);
    if (c.through === c.centre) errors.push(`circle ${c.id} puts its centre on itself`);
  }
  for (const a of spec.arcs ?? []) {
    if (!circleIds.has(a.circle)) errors.push(`arc names unknown circle ${a.circle}`);
    for (const id of [a.from, a.to]) {
      if (!ids.has(id)) errors.push(`arc on ${a.circle} names unknown point ${id}`);
    }
    if (a.from === a.to) errors.push(`arc on ${a.circle} starts and ends at the same point`);
  }
  // A point said to be on a circle must actually be on it, to the pixel
  // tolerance a reader could notice. A figure that claims a point is on
  // the circle and draws it off teaches the wrong thing.
  for (const c of spec.circles ?? []) {
    const centre = spec.points.find((p) => p.id === c.centre);
    const on = c.through ? spec.points.find((p) => p.id === c.through) : undefined;
    if (!centre || !on) continue;
    const r = Math.hypot(on.x - centre.x, on.y - centre.y);
    for (const a of spec.arcs ?? []) {
      if (a.circle !== c.id) continue;
      for (const id of [a.from, a.to]) {
        const p = spec.points.find((q) => q.id === id);
        if (!p) continue;
        const d = Math.hypot(p.x - centre.x, p.y - centre.y);
        if (Math.abs(d - r) > 1.5) {
          errors.push(`point ${id} is drawn off circle ${c.id} but an arc places it on the circle`);
        }
      }
    }
  }
  if (!spec.caption.trim()) errors.push('caption is required');
  if (!spec.altText.trim()) errors.push('altText is required');
  else if (spec.altText.trim().length < 40) {
    errors.push('altText must state the mathematically relevant content, not just the appearance');
  }
  return errors;
}


// ---------------------------------------------------------------------------
// v0.84.0-c10.1 checkpoint 55 — validating what a right-triangle figure claims.
// ---------------------------------------------------------------------------

type Pt = { id: string; x: number; y: number };

function angleAt(at: Pt, a: Pt, b: Pt): number {
  const u = [a.x - at.x, a.y - at.y];
  const v = [b.x - at.x, b.y - at.y];
  const du = Math.hypot(u[0], u[1]);
  const dv = Math.hypot(v[0], v[1]);
  if (du === 0 || dv === 0) return NaN;
  const c = Math.min(1, Math.max(-1, (u[0] * v[0] + u[1] * v[1]) / (du * dv)));
  return (Math.acos(c) * 180) / Math.PI;
}

/** The side opposite a vertex, as the pair of the other two vertex ids. */
export function oppositeSide(
  roles: NonNullable<GeometryFigureSpec['rightTriangleRoles']>[number],
  vertex: string
): [string, string] {
  const all = [roles.referenceVertex, roles.rightAngleVertex, roles.thirdVertex];
  const rest = all.filter((v) => v !== vertex);
  return [rest[0], rest[1]];
}

/**
 * Check every side-role claim a figure makes against its own coordinates.
 *
 * The point is that label placement proves nothing. A figure can print
 * "opposite" beside a side that touches the reference angle and look
 * entirely convincing. These checks are the thing that stops it.
 */
export function validateRightTriangleRoles(spec: GeometryFigureSpec): string[] {
  const errs: string[] = [];
  const pts = new Map(spec.points.map((p) => [p.id, p] as const));
  for (const r of spec.rightTriangleRoles ?? []) {
    const A = pts.get(r.referenceVertex);
    const R = pts.get(r.rightAngleVertex);
    const T = pts.get(r.thirdVertex);
    const tag = `${r.referenceVertex}/${r.rightAngleVertex}/${r.thirdVertex}`;
    if (!A || !R || !T) {
      errs.push(`${tag}: a named vertex is not in the figure`);
      continue;
    }
    if (new Set([A.id, R.id, T.id]).size !== 3) {
      errs.push(`${tag}: the three vertices are not distinct`);
      continue;
    }
    // Non-degenerate: the three points must not be collinear.
    const area2 = Math.abs((R.x - A.x) * (T.y - A.y) - (T.x - A.x) * (R.y - A.y));
    if (area2 < 1e-6) {
      errs.push(`${tag}: the three vertices are collinear, so there is no triangle`);
      continue;
    }
    // The right angle must actually be a right angle.
    const right = angleAt(R, A, T);
    if (Math.abs(right - 90) > 0.5) {
      errs.push(`${tag}: the angle at ${R.id} is ${right.toFixed(1)} degrees, not a right angle`);
    }
    // The reference angle must be acute — a right triangle has no second one.
    const ref = angleAt(A, R, T);
    if (!(ref > 0 && ref < 90 - 1e-9)) {
      errs.push(`${tag}: the reference angle at ${A.id} is ${ref.toFixed(1)} degrees and must be acute`);
    }
    // The hypotenuse is the side opposite the right angle, so it must not
    // touch the right-angle vertex.
    const hyp = oppositeSide(r, r.rightAngleVertex);
    if (hyp.includes(r.rightAngleVertex)) {
      errs.push(`${tag}: the hypotenuse touches the right-angle vertex`);
    }
    // The opposite side must not touch the reference vertex.
    const opp = oppositeSide(r, r.referenceVertex);
    if (opp.includes(r.referenceVertex)) {
      errs.push(`${tag}: the side called opposite touches the reference angle`);
    }
    // The adjacent leg is the one joining the reference and right-angle
    // vertices; it must touch both, and it must not be the hypotenuse.
    const adj: [string, string] = [r.referenceVertex, r.rightAngleVertex];
    if (!adj.includes(r.referenceVertex) || !adj.includes(r.rightAngleVertex)) {
      errs.push(`${tag}: the adjacent leg does not meet both the reference angle and the right angle`);
    }
    const sameSide = (a: [string, string], b: [string, string]) =>
      new Set([...a, ...b]).size === 2;
    if (sameSide(adj, hyp)) {
      errs.push(`${tag}: the adjacent leg and the hypotenuse are the same side`);
    }
    // Every segment named must exist in the figure.
    const drawn = new Set(spec.segments.map((g) => [g.from, g.to].sort().join('|')));
    for (const [label, pair] of [['hypotenuse', hyp], ['opposite', opp], ['adjacent', adj]] as const) {
      if (!drawn.has([...pair].sort().join('|'))) {
        errs.push(`${tag}: the ${label} side ${pair.join('')} is not drawn`);
      }
    }
  }
  return errs;
}

/**
 * Where a figure says it is exact, a claimed angle must be the angle the
 * coordinates actually make. A derivation that reads 60 degrees off a
 * picture drawn at 57 is teaching the student to trust the picture.
 */
export function validateAngleMarkGeometry(spec: GeometryFigureSpec): string[] {
  if (!spec.exactGeometry) return [];
  const errs: string[] = [];
  const pts = new Map(spec.points.map((p) => [p.id, p] as const));
  for (const m of spec.angleMarks ?? []) {
    const at = pts.get(m.at);
    const a = pts.get(m.from);
    const b = pts.get(m.to);
    if (!at || !a || !b) {
      errs.push(`angle at ${m.at}: a named point is missing`);
      continue;
    }
    const actual = angleAt(at, a, b);
    const claimed = m.right ? 90 : Number((m.label ?? '').replace(/[^\d.]/g, ''));
    if (!Number.isFinite(claimed) || claimed === 0) continue;
    if (Math.abs(actual - claimed) > 0.5) {
      errs.push(
        `angle at ${m.at} is drawn as ${actual.toFixed(1)} degrees but claims ${claimed}`
      );
    }
  }
  return errs;
}


/**
 * Check every parallelism a figure asserts against its own coordinates.
 *
 * Direction is compared by cross product, so orientation does not matter: a
 * segment drawn from D to E is parallel to one drawn from C to B exactly
 * when it is parallel to B to C.
 */
export function validateParallelGroups(spec: GeometryFigureSpec): string[] {
  const errs: string[] = [];
  const pts = new Map(spec.points.map((p) => [p.id, p] as const));
  const drawn = new Set(spec.segments.map((g) => [g.from, g.to].sort().join('|')));
  for (const [gi, group] of (spec.parallelGroups ?? []).entries()) {
    if (group.segments.length < 2) {
      errs.push(`parallel group ${gi} needs at least two segments`);
      continue;
    }
    const vectors: Array<{ name: string; dx: number; dy: number }> = [];
    for (const seg of group.segments) {
      const a = pts.get(seg.from);
      const b = pts.get(seg.to);
      const name = `${seg.from}${seg.to}`;
      if (!a || !b) { errs.push(`parallel group ${gi}: ${name} names a missing point`); continue; }
      if (!drawn.has([seg.from, seg.to].sort().join('|'))) {
        errs.push(`parallel group ${gi}: ${name} is asserted parallel but is not drawn`);
      }
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      if (Math.hypot(dx, dy) < 1e-9) { errs.push(`parallel group ${gi}: ${name} has zero length`); continue; }
      vectors.push({ name, dx, dy });
    }
    for (let i = 1; i < vectors.length; i += 1) {
      const u = vectors[0];
      const v = vectors[i];
      const cross = u.dx * v.dy - u.dy * v.dx;
      const scale = Math.hypot(u.dx, u.dy) * Math.hypot(v.dx, v.dy);
      if (Math.abs(cross) / scale > 1e-6) {
        errs.push(
          `parallel group ${gi}: ${u.name} and ${v.name} are claimed parallel but the coordinates make them cross`
        );
      }
    }
  }
  return errs;
}
