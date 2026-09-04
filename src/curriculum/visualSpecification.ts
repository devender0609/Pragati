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

export type VisualSpec =
  | NumberLineSpec
  | FractionStripSpec
  | FractionAreaModelSpec;

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
  }
}
