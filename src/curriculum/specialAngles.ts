// ===========================================================================
// v0.84.0-c10.15 checkpoint 69 — THE STANDARD ANGLES, INCLUDING THE ENDS.
//
// Checkpoint 55 built `rightTriangleRoles` to validate a genuine
// non-degenerate right triangle with an acute reference angle. At 0 and 90
// degrees that object does not exist: the triangle collapses, and the side
// ratios it was defined by stop being ratios of sides of anything.
//
// The temptation is to let the acute guard accept a zero-length leg so the
// boundary angles "fit". That would be the wrong trade. `rightTriangleRoles`
// stays acute-only, and the boundary values live HERE, in a separate value
// model that makes no claim to be a triangle.
//
// What the source actually does matters: the frozen crosswalk says the
// ratios at 0 and 90 are "motivated, not derived", by a limiting argument —
// imagining the acute angle shrinking toward 0 or growing toward 90 and
// watching what happens to the sides. So this module records VALUES with
// their justification, not a derivation from a degenerate figure.
//
// Three commitments:
//
//   * Only sin and cos are stored. tan, cot, sec and cosec are DERIVED by
//     division, so a zero denominator produces `undefined` as a semantic
//     state rather than a number. There is no second table to disagree.
//
//   * Undefined is never Infinity, never NaN, never a sentinel number. It is
//     a kind, and nothing compares it numerically.
//
//   * Values are exact: a rational multiple of a square root, so
//     \u221a3/2 stays \u221a3/2 and is never a decimal. A source-conventional
//     written form may be supplied, but it is CHECKED against the computed
//     value, so the display cannot drift from the mathematics.
//
// General for the standard angles; nothing here knows about a lesson.
// ===========================================================================

export type Degrees = 0 | 30 | 45 | 60 | 90;

export const STANDARD_ANGLES: Degrees[] = [0, 30, 45, 60, 90];
export const ACUTE_STANDARD_ANGLES: Degrees[] = [30, 45, 60];

/** An exact value (p/q)\u221ak, with k a positive integer. */
export type Exact = { p: number; q: number; k: number };

const gcdOf = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcdOf(y, x % y));

export function exact(p: number, q: number, k = 1): Exact {
  if (q === 0) throw new Error('exact value with zero denominator');
  if (k <= 0) throw new Error('radicand must be positive');
  // Pull perfect squares out of the radicand into the rational part.
  let outside = 1;
  let inside = k;
  for (let f = 2; f * f <= inside; f += 1) {
    while (inside % (f * f) === 0) { outside *= f; inside /= f * f; }
  }
  let np = p * outside;
  let nq = q;
  const g = gcdOf(Math.abs(np), Math.abs(nq)) || 1;
  np /= g; nq /= g;
  if (nq < 0) { np = -np; nq = -nq; }
  if (np === 0) return { p: 0, q: 1, k: 1 };
  return { p: np, q: nq, k: inside };
}

export const exactValue = (e: Exact) => (e.p / e.q) * Math.sqrt(e.k);

export function formatExact(e: Exact): string {
  if (e.p === 0) return '0';
  if (e.k === 1) return e.q === 1 ? String(e.p) : `${e.p}/${e.q}`;
  const num = e.p === 1 ? `\u221a${e.k}` : `${e.p}\u221a${e.k}`;
  return e.q === 1 ? num : `${num}/${e.q}`;
}

/** Exact division, rationalising the denominator: keeps the form (p/q)\u221ak. */
export function divideExact(a: Exact, b: Exact): Exact | null {
  if (b.p === 0) return null; // division by zero — the caller decides what that means
  // (p1/q1)\u221ak1 \u00f7 (p2/q2)\u221ak2 = (p1 q2)/(q1 p2 k2) \u00d7 \u221a(k1 k2)
  return exact(a.p * b.q, a.q * b.p * b.k, a.k * b.k);
}

/**
 * A ratio's value at an angle: either an exact number, or undefined with the
 * reason it is undefined. Undefined is a KIND, not a number — nothing
 * downstream can accidentally arithmetic with it.
 */
export type TrigValue =
  | { kind: 'defined'; exact: Exact; written: string }
  | { kind: 'undefined'; reason: string };

export const isDefined = (v: TrigValue): v is Extract<TrigValue, { kind: 'defined' }> =>
  v.kind === 'defined';

export function valueOf(v: TrigValue): number {
  if (v.kind === 'undefined') throw new Error(`this ratio is undefined: ${v.reason}`);
  return exactValue(v.exact);
}

export function writtenOf(v: TrigValue): string {
  return v.kind === 'undefined' ? 'not defined' : v.written;
}

export type RatioName = 'sin' | 'cos' | 'tan' | 'cosec' | 'sec' | 'cot';
export const RATIO_NAMES: RatioName[] = ['sin', 'cos', 'tan', 'cosec', 'sec', 'cot'];

/**
 * The only authored data in this module: sin and cos at the five standard
 * angles, each with how the source justifies it, and the written form the
 * source uses where that differs from the canonical one.
 *
 * Everything else is computed.
 */
type Base = {
  degrees: Degrees;
  sin: Exact;
  cos: Exact;
  /** Where the value comes from. The two ends are motivated, not derived. */
  basis: 'derived_from_triangle' | 'motivated_by_limiting_argument';
  justification: string;
  /** Source-conventional written forms, checked against the exact values. */
  written?: Partial<Record<RatioName, string>>;
};

const BASE: Base[] = [
  {
    degrees: 0,
    sin: exact(0, 1),
    cos: exact(1, 1),
    basis: 'motivated_by_limiting_argument',
    justification:
      'As the acute angle is made smaller and smaller, the side opposite it shrinks toward nothing while the adjacent side and the hypotenuse draw together. So the ratio opposite over hypotenuse approaches 0 and adjacent over hypotenuse approaches 1. The values at 0\u00b0 are taken to be sin 0\u00b0 = 0 and cos 0\u00b0 = 1. This is a motivation, not a derivation from a triangle \u2014 at 0\u00b0 there is no triangle left.',
  },
  {
    degrees: 30,
    sin: exact(1, 2),
    cos: exact(1, 2, 3),
    basis: 'derived_from_triangle',
    justification: 'Derived in \u00a78.3 from the equilateral triangle bisected.',
    written: { tan: '1/\u221a3', cosec: '2', sec: '2/\u221a3', cot: '\u221a3' },
  },
  {
    degrees: 45,
    sin: exact(1, 1, 2) && exact(1, 2, 2),
    cos: exact(1, 2, 2),
    basis: 'derived_from_triangle',
    justification: 'Derived in \u00a78.3 from the isosceles right triangle.',
    written: { sin: '1/\u221a2', cos: '1/\u221a2', cosec: '\u221a2', sec: '\u221a2' },
  },
  {
    degrees: 60,
    sin: exact(1, 2, 3),
    cos: exact(1, 2),
    basis: 'derived_from_triangle',
    justification: 'Derived in \u00a78.3 from the equilateral triangle bisected.',
    written: { cosec: '2/\u221a3', sec: '2', cot: '1/\u221a3' },
  },
  {
    degrees: 90,
    sin: exact(1, 1),
    cos: exact(0, 1),
    basis: 'motivated_by_limiting_argument',
    justification:
      'As the acute angle is made larger and larger toward 90\u00b0, the side opposite it draws level with the hypotenuse while the adjacent side shrinks toward nothing. So opposite over hypotenuse approaches 1 and adjacent over hypotenuse approaches 0. The values at 90\u00b0 are taken to be sin 90\u00b0 = 1 and cos 90\u00b0 = 0. Again a motivation \u2014 a right triangle cannot have a second right angle.',
  },
];

const defined = (e: Exact, written?: string): TrigValue =>
  ({ kind: 'defined', exact: e, written: written ?? formatExact(e) });

/**
 * Every ratio at every standard angle, derived from sin and cos. The
 * quotient and reciprocal ratios are computed, so a zero denominator gives
 * `undefined` with the reason rather than a number.
 */
export function ratioAt(degrees: Degrees, name: RatioName): TrigValue {
  const row = BASE.find((b) => b.degrees === degrees);
  if (!row) throw new Error(`${degrees} is not a standard angle`);
  const w = row.written?.[name];
  const sin = row.sin;
  const cos = row.cos;
  const quotient = (a: Exact, b: Exact, denomName: string): TrigValue => {
    const r = divideExact(a, b);
    if (r === null) {
      return {
        kind: 'undefined',
        reason: `${denomName} ${degrees}\u00b0 = 0, and division by zero is not defined`,
      };
    }
    return defined(r, w);
  };
  switch (name) {
    case 'sin': return defined(sin, w);
    case 'cos': return defined(cos, w);
    case 'tan': return quotient(sin, cos, 'cos');
    case 'cot': return quotient(cos, sin, 'sin');
    case 'sec': return quotient(exact(1, 1), cos, 'cos');
    case 'cosec': return quotient(exact(1, 1), sin, 'sin');
    default: throw new Error(`unknown ratio ${name}`);
  }
}

export const basisAt = (degrees: Degrees) => BASE.find((b) => b.degrees === degrees)!.basis;
export const justificationAt = (degrees: Degrees) => BASE.find((b) => b.degrees === degrees)!.justification;

/** The whole table, derived. Nothing in it is typed twice. */
export function standardAngleTable(): Array<{ degrees: Degrees; values: Record<RatioName, TrigValue> }> {
  return STANDARD_ANGLES.map((degrees) => ({
    degrees,
    values: Object.fromEntries(RATIO_NAMES.map((n) => [n, ratioAt(degrees, n)])) as Record<RatioName, TrigValue>,
  }));
}

/** Which ratios are undefined, and why. */
export function undefinedRatios(): Array<{ degrees: Degrees; name: RatioName; reason: string }> {
  const out: Array<{ degrees: Degrees; name: RatioName; reason: string }> = [];
  for (const degrees of STANDARD_ANGLES) {
    for (const name of RATIO_NAMES) {
      const v = ratioAt(degrees, name);
      if (v.kind === 'undefined') out.push({ degrees, name, reason: v.reason });
    }
  }
  return out;
}

export function validateStandardAngles(): string[] {
  const errs: string[] = [];
  for (const degrees of STANDARD_ANGLES) {
    const sin = ratioAt(degrees, 'sin');
    const cos = ratioAt(degrees, 'cos');
    if (!isDefined(sin) || !isDefined(cos)) { errs.push(`sin or cos undefined at ${degrees}`); continue; }
    // The Pythagorean relation holds across the whole table.
    const s = valueOf(sin); const c = valueOf(cos);
    if (Math.abs(s * s + c * c - 1) > 1e-12) errs.push(`sin\u00b2 + cos\u00b2 \u2260 1 at ${degrees}\u00b0`);
    // Reciprocals agree wherever both are defined, and are undefined together.
    const pairs: Array<[RatioName, RatioName]> = [['sin', 'cosec'], ['cos', 'sec'], ['tan', 'cot']];
    for (const [a, b] of pairs) {
      const va = ratioAt(degrees, a); const vb = ratioAt(degrees, b);
      if (isDefined(va) && valueOf(va) === 0) {
        if (vb.kind !== 'undefined') errs.push(`${b} ${degrees}\u00b0 should be undefined, since ${a} ${degrees}\u00b0 = 0`);
      } else if (isDefined(va) && isDefined(vb)) {
        if (Math.abs(valueOf(va) * valueOf(vb) - 1) > 1e-12) errs.push(`${a} and ${b} are not reciprocal at ${degrees}\u00b0`);
      }
    }
    // tan = sin/cos wherever cos is non-zero.
    const tan = ratioAt(degrees, 'tan');
    if (c !== 0) {
      if (!isDefined(tan) || Math.abs(valueOf(tan) - s / c) > 1e-12) errs.push(`tan \u2260 sin/cos at ${degrees}\u00b0`);
    } else if (tan.kind !== 'undefined') {
      errs.push(`tan ${degrees}\u00b0 should be undefined, since cos ${degrees}\u00b0 = 0`);
    }
    // Any source-conventional written form must match the computed value.
    for (const name of RATIO_NAMES) {
      const v = ratioAt(degrees, name);
      if (v.kind !== 'defined') continue;
      const canonical = formatExact(v.exact);
      if (v.written !== canonical && !writtenMatches(v.written, exactValue(v.exact))) {
        errs.push(`the written form "${v.written}" for ${name} ${degrees}\u00b0 does not equal its computed value`);
      }
    }
  }
  return errs;
}

/** Check a hand-written form such as "1/\u221a3" against a numeric value. */
export function writtenMatches(written: string, value: number): boolean {
  const m = written.match(/^(-?\d*)(?:\u221a(\d+))?(?:\/(\d*)(?:\u221a(\d+))?)?$/);
  if (!m) return false;
  const num = (m[1] === '' || m[1] === undefined ? 1 : Number(m[1])) * (m[2] ? Math.sqrt(Number(m[2])) : 1);
  const denStr = m[3];
  const den = denStr === undefined ? 1
    : (denStr === '' ? 1 : Number(denStr)) * (m[4] ? Math.sqrt(Number(m[4])) : 1);
  if (den === 0) return false;
  return Math.abs(num / den - value) < 1e-12;
}

// ---------------------------------------------------------------------------
// The identities.
// ---------------------------------------------------------------------------

export type IdentityFinding = { where: string; text: string; reason: string };

/**
 * The derivations of the secant and cosecant identities divide by cos\u00b2A and
 * sin\u00b2A. Those divisions are invalid exactly where the denominator vanishes,
 * which is 90\u00b0 and 0\u00b0 respectively. A lesson dividing there would be
 * dividing by zero with the zero in plain sight.
 */
const INVALID_DIVISION = [
  {
    pattern: /divid(?:e|ing)[^.]{0,60}\bcos\u00b2\s*A?\b[^.]{0,80}\b(?:at|when)\b[^.]{0,20}\b90\b/i,
    reason: 'dividing by cos\u00b2A at 90\u00b0 is division by zero',
  },
  {
    pattern: /divid(?:e|ing)[^.]{0,60}\bsin\u00b2\s*A?\b[^.]{0,80}\b(?:at|when)\b[^.]{0,20}\b0\b/i,
    reason: 'dividing by sin\u00b2A at 0\u00b0 is division by zero',
  },
  {
    pattern: /\b1\/0\b[^.]{0,40}\b(?:is|equals|=)\b[^.]{0,20}\b(?:infinity|\u221e|very large)\b/i,
    reason: 'division by zero is undefined, not infinity',
  },
  {
    pattern: /\btan 90[^.]{0,30}\b(?:is|=)\b[^.]{0,20}\b(?:infinity|\u221e|very large|a large number)\b/i,
    reason: 'tan 90\u00b0 is undefined, not infinite',
  },
];

/**
 * A sentence that quotes the bad move in order to reject it is not the bad
 * move. This is the seventh checkpoint to need this exemption, so it also
 * covers the form that caught it here: a QUESTION posing the invalid step,
 * whose answer is the correction. "Could you divide by cos²A at 90°?" asks
 * about the error; it does not commit it.
 */
const REJECTS = [
  /\bis not\b|\bwould be wrong\b|\bcannot\b|\bdoes not\b|\ba student\b|\bmistake\b|\bwhy (?:this|that) is wrong\b|\brather than\b|\binstead of\b|\bundefined, not\b/i,
  /\?\s*$/,
  /^(?:could|can|is|does|would|should|why)\b/i,
  /\bwhat is wrong\b|\bwhat has gone wrong\b/i,
];

export function auditInvalidDivision(blocks: Array<[string, string]>): IdentityFinding[] {
  const out: IdentityFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      if (REJECTS.some((r) => r.test(s))) continue;
      const hit = INVALID_DIVISION.find((d) => d.pattern.test(s));
      if (hit) out.push({ where, text: s.trim().slice(0, 160), reason: hit.reason });
    }
  }
  return out;
}

/**
 * An identity is not established by checking it at a few angles. A lesson
 * that says so is teaching the wrong thing about what a proof is.
 */
const PROOF_BY_EXAMPLE = [
  /\b(?:check(?:ing)?|verif(?:y|ying|ied)|test(?:ing)?)\b[^.]{0,60}\b(?:at|for)\b[^.]{0,40}\b(?:30|45|60)\b[^.]{0,60}\b(?:so|therefore|hence|which proves|proves)\b/i,
  /\b(?:true|holds)\b[^.]{0,30}\bfor 30\u00b0?,? ?45\u00b0?,? ?(?:and )?60\b[^.]{0,40}\bso (?:it|the identity) (?:is|must be) true\b/i,
];

export function auditProofByExample(blocks: Array<[string, string]>): IdentityFinding[] {
  const out: IdentityFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      if (REJECTS.some((r) => r.test(s))) continue;
      if (PROOF_BY_EXAMPLE.some((r) => r.test(s))) {
        out.push({ where, text: s.trim().slice(0, 160), reason: 'treats checking particular angles as a proof of an identity' });
      }
    }
  }
  return out;
}

/**
 * Numeric sanity for an authored identity: evaluate both sides at every
 * standard angle where both are defined. This CATCHES false identities. It
 * does not prove true ones, and the report says so.
 */
export function identityHoldsAtStandardAngles(
  lhs: (a: number) => number,
  rhs: (a: number) => number,
  skip: Degrees[] = []
): boolean {
  for (const d of STANDARD_ANGLES) {
    if (skip.includes(d)) continue;
    const rad = (d * Math.PI) / 180;
    const l = lhs(rad); const r = rhs(rad);
    if (!Number.isFinite(l) || !Number.isFinite(r)) continue;
    if (Math.abs(l - r) > 1e-9) return false;
  }
  return true;
}
