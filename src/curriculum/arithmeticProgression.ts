// ===========================================================================
// v0.84.0-c10.10 checkpoint 64 — ONE AP, AND A GUARD AGAINST OVERCLAIMING.
//
// Two risks here, and only one is arithmetic.
//
// The arithmetic risk is that a displayed list of terms, an nth-term answer,
// a position solved for, and a sum can each be typed separately and quietly
// disagree. So an AP is ONE object: a and d are authored, and every term,
// position, membership decision and sum is derived from them. Positions are
// decided in EXACT integer arithmetic, because n = 13/2 must mean the value
// is not a term, and a floating tolerance would round it into one.
//
// The other risk is historical. The frozen Class 9 record shows students
// already derived a + (n-1)d and already derived the pairing sum and
// extended it to any AP. Class 10 therefore formalises; it does not
// introduce. `auditNoveltyClaims` catches a lesson that says otherwise —
// without banning the word "new", because a lesson must be able to say what
// genuinely IS new here.
//
// General for arithmetic sequences. Nothing here knows about Chapter 5.
// ===========================================================================

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

export type ArithmeticProgression = {
  id: string;
  /** First term. */
  a: number;
  /**
   * Common difference, as a SIGNED quantity: d = a2 - a1, in that order.
   * A decreasing AP has negative d, and d = 0 gives a constant AP. Using an
   * absolute difference would make 10, 7, 4 and 4, 7, 10 indistinguishable.
   */
  d: number;
  /** Number of terms, when the AP is finite. Omitted for an endless one. */
  length?: number;
  /** What the terms count, when the AP came from a situation. */
  meaning?: string;
};

/**
 * The nth term, a + (n-1)d. The (n-1) is the whole risk: at n = 1 this must
 * return a exactly, and `a + nd` would return a + d.
 */
export function term(ap: ArithmeticProgression, n: number): number {
  if (!Number.isInteger(n) || n < 1) throw new Error(`position ${n} is not a term position`);
  return ap.a + (n - 1) * ap.d;
}

/** The first k terms, derived — never a typed list. */
export function firstTerms(ap: ArithmeticProgression, k: number): number[] {
  return Array.from({ length: k }, (_, i) => term(ap, i + 1));
}

/** Consecutive differences, which must all equal d. */
export function consecutiveDifferences(values: number[]): number[] {
  return values.slice(1).map((v, i) => v - values[i]);
}

/** Is this list an AP? Decided from the differences, in order. */
export function isArithmetic(values: number[]): boolean {
  if (values.length < 2) return false;
  const diffs = consecutiveDifferences(values);
  return diffs.every((x) => x === diffs[0]);
}

/** The last term of a finite AP, often written l. */
export function lastTerm(ap: ArithmeticProgression): number | null {
  return ap.length === undefined ? null : term(ap, ap.length);
}

/** The kth term counted from the END of a finite AP. */
export function termFromEnd(ap: ArithmeticProgression, k: number): number | null {
  if (ap.length === undefined) return null;
  return term(ap, ap.length - k + 1);
}

/**
 * Where does a value sit, if anywhere? Returns the exact position as a
 * rational, so the caller can see 13/2 rather than 6.5 rounded to 7.
 */
export function positionOf(ap: ArithmeticProgression, value: number): Rational | null {
  if (ap.d === 0) return value === ap.a ? rational(1, 1) : null;
  // value = a + (n-1)d  =>  n = (value - a)/d + 1
  return rational(value - ap.a + ap.d, ap.d);
}

/**
 * Is the value a term? Only when the position is a positive INTEGER — and
 * within the length, if the AP is finite.
 */
export function isTermOf(ap: ArithmeticProgression, value: number): boolean {
  const n = positionOf(ap, value);
  if (n === null) return false;
  if (n.den !== 1 || n.num < 1) return false;
  return ap.length === undefined || n.num <= ap.length;
}

/** Sn = n/2 [2a + (n-1)d]. Exact for integer a and d. */
export function sum(ap: ArithmeticProgression, n: number): Rational {
  if (!Number.isInteger(n) || n < 1) throw new Error(`cannot sum ${n} terms`);
  return rational(n * (2 * ap.a + (n - 1) * ap.d), 2);
}

/** Sn = n/2 (a + l), the other form. Must agree with the first. */
export function sumWithLast(a: number, l: number, n: number): Rational {
  return rational(n * (a + l), 2);
}

/** Direct addition, for reconciling the formula on small cases. */
export function directSum(ap: ArithmeticProgression, n: number): number {
  return firstTerms(ap, n).reduce((t, v) => t + v, 0);
}

export function validateArithmeticProgression(ap: ArithmeticProgression): string[] {
  const errs: string[] = [];
  if (!Number.isInteger(ap.a)) errs.push('the first term must be an integer for exact work');
  if (!Number.isInteger(ap.d)) errs.push('the common difference must be an integer for exact work');
  if (ap.length !== undefined && (!Number.isInteger(ap.length) || ap.length < 2)) {
    errs.push('a finite AP needs a whole number of terms, at least two');
  }
  // The structural invariant: the formula must return a at n = 1.
  if (term(ap, 1) !== ap.a) errs.push('the nth-term formula does not return the first term at n = 1');
  // The listed terms must have constant difference equal to d.
  const terms = firstTerms(ap, Math.min(5, ap.length ?? 5));
  const diffs = consecutiveDifferences(terms);
  if (diffs.some((x) => x !== ap.d)) errs.push('the generated terms do not have the stated common difference');
  // Both sum forms must agree wherever the AP is finite.
  if (ap.length !== undefined) {
    const l = lastTerm(ap)!;
    const viaFormula = sum(ap, ap.length);
    const viaLast = sumWithLast(ap.a, l, ap.length);
    if (toNumber(viaFormula) !== toNumber(viaLast)) errs.push('the two sum formulas disagree');
    if (toNumber(viaFormula) !== directSum(ap, ap.length)) errs.push('the sum formula disagrees with direct addition');
  }
  return errs;
}

// ---------------------------------------------------------------------------
// The progression-novelty audit.
// ---------------------------------------------------------------------------

export type NoveltyFinding = { where: string; text: string; reason: string };

/**
 * Concepts the frozen Class 9 record shows students already have. Claiming
 * any of these is new would be false.
 */
export const ALREADY_IN_CLASS_9 = [
  'sequence', 'term', 'position', 'nth term', 'common difference',
  'arithmetic progression', 'pairing', 'a + (n \u2212 1)d',
];

const CLAIMS_NOVELTY = [
  /\bfor the first time\b/i,
  /\byou have never\b/i,
  /\byou(?:'| ha)ve not (?:seen|met)\b/i,
  /\bfirst encounter\b/i,
  /\bmeet(?:ing)? [^.]{0,30}\bfor the first time\b/i,
  /\bnew (?:to|in) Class 10\b/i,
  /\bbegin(?:s)? in Class 10\b/i,
  /\byour first\b/i,
];

/**
 * Things a lesson may legitimately say. Formalising, naming, systematising
 * and extending are all honest descriptions of what Class 10 does, and a
 * lesson must be able to say what genuinely IS new — the finite AP with a
 * last term, counting from the end, the second sum form.
 */
const HONEST_FRAMING = [
  /\bformalis|\bsystematic|\balready (?:met|saw|know|have)\b/i,
  /\bClass IX\b|\bClass 9\b/i,
  /\bdeepen|\bextend|\bbuilds? on\b/i,
];

export function auditNoveltyClaims(blocks: Array<[string, string]>): NoveltyFinding[] {
  const out: NoveltyFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of text.split(/(?<=[.?!])\s+/)) {
      // A sentence that explicitly credits Class IX is describing the
      // progression, not overclaiming against it.
      if (HONEST_FRAMING.some((r) => r.test(s))) continue;
      // A claim quoted in order to correct it is not the claim.
      if (/\ba student\b|\bwould be wrong\b|\bwrong with saying\b|\brather than\b|\binstead of\b/i.test(s)) continue;
      const hit = CLAIMS_NOVELTY.find((r) => r.test(s));
      if (hit) {
        // Only a problem when it is about something Class 9 already covered.
        const touches = ALREADY_IN_CLASS_9.some((c) => s.toLowerCase().includes(c.toLowerCase()));
        if (touches) {
          out.push({
            where, text: s.trim().slice(0, 160),
            reason: 'claims novelty for something the frozen Class 9 record already covers',
          });
        }
      }
    }
  }
  return out;
}
