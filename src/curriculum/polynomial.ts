// ===========================================================================
// v0.84.0-c10.9 checkpoint 63 — ONE POLYNOMIAL, FIVE WAYS TO READ IT.
//
// A polynomial can be read as a rule, as a list of zeroes, as a product of
// factors, as a curve meeting the x-axis, and as coefficients standing in a
// relationship to its zeroes. All five must describe the same object. The
// failure this module exists to prevent is a lesson stating one pair of
// zeroes while plotting another — a figure drawn by hand can show whatever
// the author believed, and nothing about the page would look wrong.
//
// So the polynomial is ONE object, stored as exact integer coefficients.
// Its zeroes, its factorisation, every plotted point of its graph, its
// x-intercepts and its sum-and-product relations are all derived from those
// coefficients.
//
// Two deliberate choices:
//
//   * Coefficients and zeroes stay EXACT. A claimed zero is accepted only
//     when p(r) is exactly 0 in integer or rational arithmetic, never when
//     it is merely small. Chapter 1 made the same decision about
//     divisibility, for the same reason.
//
//   * The graph SAMPLES the polynomial. Checkpoint 60 built straight lines
//     from two endpoints, which cannot describe a curve, so a general
//     sampling layer is added — for any polynomial, not for this chapter.
//
// Deliberately NOT built: a computer algebra system, a general function
// grapher, cubic coefficient relations (outside the current scope), the
// remainder and factor theorems (absent from the current source).
// ===========================================================================

/** Coefficients in ASCENDING order: [c, b, a] is a + bx + cx^2 read as c0 + c1 x + c2 x^2. */
export type Polynomial = {
  id: string;
  /** coefficients[i] multiplies x^i. Exact integers. */
  coefficients: number[];
  /** How the lesson writes it, e.g. 'x^2 - 5x + 6'. */
  label: string;
};

export type Rational = { num: number; den: number };

const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));

export function rational(num: number, den: number): Rational {
  if (den === 0) throw new Error('rational with zero denominator');
  const g = gcd(num, den) || 1;
  const sign = den < 0 ? -1 : 1;
  return { num: (sign * num) / g, den: (sign * den) / g };
}
export const toNumber = (r: Rational) => r.num / r.den;
export function formatRational(r: Rational): string {
  return r.den === 1 ? String(r.num) : `${r.num}/${r.den}`;
}

/** The highest power with a non-zero coefficient. The zero polynomial has no degree. */
export function degree(p: Polynomial): number | null {
  for (let i = p.coefficients.length - 1; i >= 0; i -= 1) if (p.coefficients[i] !== 0) return i;
  return null;
}

/** p(x) at an integer or rational x, exactly. */
export function evaluate(p: Polynomial, x: number): number {
  return p.coefficients.reduce((sum, c, i) => sum + c * x ** i, 0);
}

export function evaluateRational(p: Polynomial, x: Rational): Rational {
  const n = degree(p) ?? 0;
  // Multiply through by den^n so the whole computation stays integral.
  let num = 0;
  for (let i = 0; i <= n; i += 1) {
    num += (p.coefficients[i] ?? 0) * x.num ** i * x.den ** (n - i);
  }
  return rational(num, x.den ** n);
}

/** Is r exactly a zero? Not approximately — exactly. */
export function isZeroOf(p: Polynomial, r: Rational): boolean {
  const v = evaluateRational(p, r);
  return v.num === 0;
}

/** The y-intercept, p(0) — which is the constant term, and is NOT a zero. */
export function yIntercept(p: Polynomial): number {
  return p.coefficients[0] ?? 0;
}

// --- quadratics ------------------------------------------------------------

export type Quadratic = { a: number; b: number; c: number };

export function asQuadratic(p: Polynomial): Quadratic | null {
  if (degree(p) !== 2) return null;
  return { a: p.coefficients[2], b: p.coefficients[1], c: p.coefficients[0] };
}

export function discriminant(q: Quadratic): number {
  return q.b * q.b - 4 * q.a * q.c;
}

export type ZeroCount = 'two_distinct' | 'one_repeated' | 'none_real';

export function realZeroNature(q: Quadratic): ZeroCount {
  const d = discriminant(q);
  if (d > 0) return 'two_distinct';
  if (d === 0) return 'one_repeated';
  return 'none_real';
}

/**
 * The DISTINCT real zeroes, exact where the discriminant is a perfect
 * square. A repeated zero appears once, because it is one x-intercept.
 */
export function rationalZeroes(q: Quadratic): Rational[] {
  const d = discriminant(q);
  if (d < 0) return [];
  const root = Math.round(Math.sqrt(d));
  if (root * root !== d) return []; // irrational zeroes are not returned as exact
  if (d === 0) return [rational(-q.b, 2 * q.a)];
  return [rational(-q.b - root, 2 * q.a), rational(-q.b + root, 2 * q.a)]
    .sort((x, y) => toNumber(x) - toNumber(y));
}

/** Sum of zeroes = -b/a. The sign is the whole risk here. */
export function sumOfZeroes(q: Quadratic): Rational {
  return rational(-q.b, q.a);
}
/** Product of zeroes = c/a. */
export function productOfZeroes(q: Quadratic): Rational {
  return rational(q.c, q.a);
}

/**
 * Expand k(x - alpha)(x - beta) back to coefficients, so a factorisation can
 * be checked against the polynomial it claims to factor.
 */
export function expandFactors(k: number, alpha: Rational, beta: Rational): Polynomial {
  // k(x - a/b)(x - c/d) = k/(bd) * (bx - a)(dx - c)
  const A = k * alpha.den * beta.den;
  const B = k * (-(alpha.num * beta.den) - beta.num * alpha.den);
  const C = k * alpha.num * beta.num;
  const g = gcd(gcd(Math.abs(A), Math.abs(B)), Math.abs(C)) || 1;
  const scale = alpha.den * beta.den;
  if (A % scale === 0 && B % scale === 0 && C % scale === 0) {
    return { id: 'expanded', coefficients: [C / scale, B / scale, A / scale], label: '' };
  }
  void g;
  return { id: 'expanded', coefficients: [C, B, A], label: '' };
}

/**
 * The simplest quadratic with the given sum and product of zeroes, taking
 * k = 1. Zeroes do NOT determine a polynomial uniquely — any non-zero k
 * gives another with the same zeroes — so this returns the monic choice and
 * the caller must say so.
 */
export function quadraticFromSumProduct(sum: Rational, product: Rational): Polynomial {
  // x^2 - (sum)x + product, cleared of denominators only if both are integral.
  const coefficients = [toNumber(product), -toNumber(sum), 1];
  return { id: 'constructed', coefficients, label: '' };
}

// --- the graph -------------------------------------------------------------

/**
 * A polynomial drawn on axes. The spec holds the POLYNOMIAL, not a list of
 * coordinates: every sampled point is p(x) evaluated at that x, so a curve
 * cannot show zeroes the algebra does not have.
 *
 * General for polynomials of any degree; nothing here knows about Chapter 2.
 */
export type PolynomialGraphSpec = {
  type: 'polynomial_graph';
  purpose: 'show_definition' | 'support_reasoning' | 'compare_cases';
  status: 'concept_specific';
  polynomial: Polynomial;
  /** Visible x range. The y range is derived from the sampled values. */
  xMin: number;
  xMax: number;
  caption: string;
  altText: string;
};

/** Sampled points, every one of them satisfying y = p(x). */
export function samplePoints(spec: PolynomialGraphSpec, steps = 80): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  const dx = (spec.xMax - spec.xMin) / steps;
  for (let i = 0; i <= steps; i += 1) {
    const x = spec.xMin + i * dx;
    out.push({ x, y: evaluate(spec.polynomial, x) });
  }
  return out;
}

/** The x values where the drawn curve meets the axis. Derived from the algebra. */
export function xInterceptsInWindow(spec: PolynomialGraphSpec): Rational[] {
  const q = asQuadratic(spec.polynomial);
  if (!q) return [];
  return rationalZeroes(q).filter((r) => toNumber(r) >= spec.xMin && toNumber(r) <= spec.xMax);
}

export function validatePolynomial(p: Polynomial): string[] {
  const errs: string[] = [];
  if (p.coefficients.length === 0) errs.push('a polynomial needs at least one coefficient');
  for (const [i, c] of p.coefficients.entries()) {
    if (!Number.isInteger(c)) errs.push(`coefficient of x^${i} must be an integer for exact work`);
  }
  if (degree(p) === null) errs.push('the zero polynomial is outside the scope of these lessons');
  if (p.coefficients.length > 1 && p.coefficients[p.coefficients.length - 1] === 0) {
    errs.push('the leading coefficient is zero; trim the coefficient list to its degree');
  }
  if (!p.label.trim()) errs.push('the polynomial needs a label');
  return errs;
}

/**
 * Everything a graph asserts, checked against the polynomial it holds.
 */
export function validatePolynomialGraph(spec: PolynomialGraphSpec): string[] {
  const errs = validatePolynomial(spec.polynomial);
  if (spec.xMax <= spec.xMin) errs.push('the window has no width');
  // Every sampled point must satisfy y = p(x). It does by construction, and
  // the check stands as a guard against a future hand-authored shortcut.
  for (const pt of samplePoints(spec, 20)) {
    if (Math.abs(pt.y - evaluate(spec.polynomial, pt.x)) > 1e-9) {
      errs.push(`plotted point (${pt.x}, ${pt.y}) is not on the curve`);
    }
  }
  // Every real zero must be inside the drawn window, or the graph hides one.
  const q = asQuadratic(spec.polynomial);
  if (q) {
    for (const r of rationalZeroes(q)) {
      const x = toNumber(r);
      if (x < spec.xMin || x > spec.xMax) {
        errs.push(`the zero at x = ${formatRational(r)} falls outside the drawn window`);
      }
    }
    // The alt text must describe the number of intercepts the algebra gives.
    const nature = realZeroNature(q);
    const says = {
      two_distinct: /two (?:distinct )?(?:real )?zero|meets the x-axis at two/i,
      one_repeated: /one (?:distinct )?(?:real )?zero|touch(?:es)? the x-axis|repeated/i,
      none_real: /no real zero|does not meet the x-axis/i,
    }[nature];
    if (!says.test(spec.altText)) {
      errs.push(`altText does not describe a polynomial with ${nature.replace(/_/g, ' ')} zeroes`);
    }
  }
  if (!spec.altText.trim()) errs.push('altText is required');
  return errs;
}

/**
 * Flag wording that outruns the real-number scope, as checkpoint 58 does for
 * quadratic equations. "No real zeroes" is correct; "no zeroes at all" is
 * false once complex numbers exist, and this course does not teach them.
 */
export type PolyFinding = { where: string; text: string; reason: string };

const OVERSTATED = [
  /\bno zero(?:e?s)?\b(?! in the real)/i,
  /\bhas no roots\b/i,
  /\bzero(?:e?s)? do not exist\b/i,
];
const QUALIFIED = [/\bno real zero/i, /\bin the real numbers?\b/i, /\breal-number\b/i, /\bno real root/i];

export function auditRealZeroWording(blocks: Array<[string, string]>): PolyFinding[] {
  const out: PolyFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      if (QUALIFIED.some((r) => r.test(s))) continue;
      // A sentence quoting a claim in order to reject it is not the claim.
      // An earlier version missed "what would be wrong with saying ...",
      // which is the exact phrasing a lesson uses to teach the distinction.
      if (/\ba student\b|\bwould (?:claim|be)\b|\bwould be wrong\b|\bwrong with saying\b|\bsaying\b[^.]{0,60}\bwould\b|\brather than\b|\binstead of\b|\bis wrong\b|\bclaim more than\b|\bmore precise\b/i.test(s)) continue;
      if (OVERSTATED.some((r) => r.test(s))) {
        out.push({ where, text: s.trim().slice(0, 160), reason: 'claims more than the real-number scope supports; say "no real zeroes"' });
      }
    }
  }
  return out;
}
