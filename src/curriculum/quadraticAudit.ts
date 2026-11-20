// ===========================================================================
// v0.84.0-c10.4 checkpoint 58 — QUADRATIC FIDELITY.
//
// Chapter 4 has no representation frontier. Its risk is that every method
// must agree: a factorisation must expand back, the roots must satisfy the
// original equation, the discriminant must match the number of roots the
// lesson claims, and the formula must give the same root set as the
// factorisation.
//
// There is a second risk that is not arithmetic at all. The current scope is
// real roots, and the honest statement for a negative discriminant is "no
// REAL roots". Dropping that word turns a true statement about this course
// into a false statement about mathematics, and the correction is not a word
// ban: a lesson must be free to say "no real roots" without being flagged.
// ===========================================================================

export type Quadratic = { a: number; b: number; c: number };

/** D = b² − 4ac. */
export function discriminant(q: Quadratic): number {
  return q.b * q.b - 4 * q.a * q.c;
}

export type RootNature = 'two_distinct_real' | 'one_repeated_real' | 'no_real_roots';

export function natureOfRoots(q: Quadratic): RootNature {
  const d = discriminant(q);
  if (d > 1e-12) return 'two_distinct_real';
  if (d < -1e-12) return 'no_real_roots';
  return 'one_repeated_real';
}

/** The real roots, as exact-as-possible numbers. Empty when D < 0. */
export function realRoots(q: Quadratic): number[] {
  const d = discriminant(q);
  if (d < -1e-12) return [];
  if (Math.abs(d) <= 1e-12) return [-q.b / (2 * q.a)];
  const r = Math.sqrt(d);
  return [(-q.b + r) / (2 * q.a), (-q.b - r) / (2 * q.a)].sort((x, y) => x - y);
}

/** Does this value actually satisfy ax² + bx + c = 0? */
export function satisfies(q: Quadratic, x: number, tol = 1e-9): boolean {
  const v = q.a * x * x + q.b * x + q.c;
  // Scale the tolerance to the size of the terms, so a large-coefficient
  // equation is not judged by an absolute threshold.
  const scale = Math.max(1, Math.abs(q.a * x * x), Math.abs(q.b * x), Math.abs(q.c));
  return Math.abs(v) <= tol * scale;
}

/** (x − p)(x − q) expanded, scaled by a leading coefficient. */
export function expandFactors(leading: number, p: number, q: number): Quadratic {
  return { a: leading, b: leading * -(p + q), c: leading * p * q };
}

/** Do two root sets agree, order and duplicates aside? */
export function sameRootSet(x: number[], y: number[], tol = 1e-9): boolean {
  const norm = (s: number[]) => [...new Set(s.map((v) => Math.round(v / tol) * tol))].sort((m, n) => m - n);
  const a = norm(x);
  const b = norm(y);
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol * Math.max(1, Math.abs(v)));
}

export type QuadraticFinding = { where: string; text: string; reason: string };

/**
 * Flag wording that overstates what a negative discriminant means.
 *
 * "No real roots" is correct and must pass. "No solution" and "cannot be
 * solved" are false once complex numbers exist, even though this course does
 * not teach them — and a student who learns the stronger sentence has to
 * unlearn it later.
 *
 * The check reads the sentence rather than the word: a claim is flagged only
 * when it denies solutions outright without the qualifier.
 */
const OVERSTATED = [
  /\bno solutions?\b/i,
  /\bcannot be solved\b/i,
  /\bhas no roots\b/i,
  /\bthere are no roots\b/i,
  /\bimpossible to solve\b/i,
  /\bevery quadratic (?:equation )?has (?:two )?real roots\b/i,
];
const QUALIFIED = [
  /\bno real roots?\b/i,
  /\breal roots? (?:do not|don't) exist\b/i,
  /\bin the real numbers?\b/i,
  /\breal-number system\b/i,
  /\bno real solutions?\b/i,
];

/**
 * The claim must be ABOUT an equation before it can overstate one. "An
 * expression has no roots" is true — an expression is not something a value
 * can make true — and an earlier version of this audit flagged it, which is
 * the same false-positive failure the Class 9 harness made. A sentence that
 * is explicitly about an expression is not a claim about solvability.
 */
/**
 * A sentence that names the overstated phrase in order to reject it is
 * teaching the distinction, not making the claim. Flagging it would punish
 * exactly the lessons that take the most care — the same false-positive
 * shape that cost three passes in the Class 9 harness.
 */
function rejectsThePhrase(sentence: string): boolean {
  // A claim quoted as someone else's, in order to correct it, is not the
  // lesson's own claim.
  if (/\ba student (?:writes|says|claims|answers)\b/i.test(sentence)) return true;
  return /\bwould claim\b|\bsaying\b[^.]{0,60}\bwould\b|\bdo not say\b|\bdon't say\b|\brather than\b|\binstead of\b|\bis wrong\b|\bimprove the statement\b|\bmore precise\b|\basserts? (?:something )?(?:more|broader)\b|\bclaim more than\b/i.test(sentence);
}

function isAboutAnEquation(sentence: string): boolean {
  if (/\bexpressions?\b/i.test(sentence) && !/\bequations?\b/i.test(sentence)) return false;
  // A symbolically written equation counts: "2x^2 + x + 4 = 0 has no
  // solution" is a claim about an equation even though the word is absent.
  // Missing this let a lesson pass for the wrong reason.
  if (/=\s*0\b/.test(sentence)) return true;
  return /\bequation|\bdiscriminant|\bD\b|\bquadratic\b|\broots?\b/i.test(sentence);
}

export function auditRealRootScope(
  blocks: Array<[string, string]>
): QuadraticFinding[] {
  const findings: QuadraticFinding[] = [];
  for (const [where, text] of blocks) {
    for (const sentence of text.split(/(?<=[.?!])\s+/)) {
      if (QUALIFIED.some((r) => r.test(sentence))) continue;
      if (!isAboutAnEquation(sentence)) continue;
      if (rejectsThePhrase(sentence)) continue;
      const hit = OVERSTATED.find((r) => r.test(sentence));
      if (hit) {
        findings.push({
          where,
          text: sentence.trim().slice(0, 160),
          reason: 'claims more than the real-root scope supports; say "no real roots" instead',
        });
      }
    }
  }
  return findings;
}

/** Complex-number instruction is outside this chapter entirely. */
export function auditComplexLeakage(blocks: Array<[string, string]>): QuadraticFinding[] {
  const findings: QuadraticFinding[] = [];
  const BANNED = /\bimaginary (?:number|unit|root)|\bcomplex (?:number|root|conjugate)|\bsquare root of (?:minus|negative) one\b|\b√\(?-1\)?\b/i;
  for (const [where, text] of blocks) {
    for (const sentence of text.split(/(?<=[.?!])\s+/)) {
      if (BANNED.test(sentence)) {
        findings.push({ where, text: sentence.trim().slice(0, 160), reason: 'introduces complex numbers, which are outside the Class 10 scope' });
      }
    }
  }
  return findings;
}
