// ===========================================================================
// v0.84.0-c10.8 checkpoint 62 — EXACT INTEGER ARITHMETIC, AND TWO SCOPE
// AUDITS.
//
// Chapter 1 has no representation frontier. Its risks are arithmetic that is
// easy to state and easy to get wrong — a "prime factor" that is composite
// looks exactly like one that is not — and a scope problem that no amount of
// checking the mathematics would catch.
//
// That scope problem is specific and documented. The rationalised §1.1 still
// announces that the chapter will use Euclid's division algorithm in §1.2,
// and that material was removed. An author following the introduction would
// teach it. The source model records the stale sentence as evidence, because
// erasing it would be a different kind of dishonesty; what must not happen is
// the sentence becoming instruction.
//
// Everything here is exact integer arithmetic. Floating point has no place
// in divisibility: 0.1 + 0.2 settles that question.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

/** Trial division. Deterministic, and sufficient for lesson-sized integers. */
export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}

/** A prime factorisation as base/exponent pairs, in increasing prime order. */
export type PrimePower = { prime: number; exponent: number };

export function primeFactorise(n: number): PrimePower[] {
  if (!Number.isInteger(n) || n < 2) throw new Error(`cannot factorise ${n}`);
  const out: PrimePower[] = [];
  let rest = n;
  for (let d = 2; d * d <= rest; d += d === 2 ? 1 : 2) {
    let e = 0;
    while (rest % d === 0) { rest /= d; e += 1; }
    if (e > 0) out.push({ prime: d, exponent: e });
  }
  if (rest > 1) out.push({ prime: rest, exponent: 1 });
  return out;
}

/** Multiply a factorisation back out. The check that matters most. */
export function productOf(f: PrimePower[]): number {
  return f.reduce((t, p) => t * p.prime ** p.exponent, 1);
}

export function formatFactorisation(f: PrimePower[]): string {
  return f.map((p) => (p.exponent === 1 ? `${p.prime}` : `${p.prime}^${p.exponent}`)).join(' \u00d7 ');
}

/**
 * Is this claimed factorisation actually correct? Three separate failures
 * are possible and all three are checked: a composite masquerading as a
 * prime, a wrong exponent, and primes out of order or repeated.
 */
export function validateFactorisation(n: number, claimed: PrimePower[]): string[] {
  const errs: string[] = [];
  for (const p of claimed) {
    if (!isPrime(p.prime)) errs.push(`${p.prime} is listed as a prime factor but is composite`);
    if (!Number.isInteger(p.exponent) || p.exponent < 1) errs.push(`exponent of ${p.prime} must be a positive whole number`);
  }
  const primes = claimed.map((p) => p.prime);
  if (new Set(primes).size !== primes.length) errs.push('a prime appears more than once instead of being collected into one exponent');
  if (primes.some((v, i) => i > 0 && v <= primes[i - 1])) errs.push('primes are not in increasing order');
  const product = productOf(claimed);
  if (product !== n) errs.push(`the factors multiply to ${product}, not ${n}`);
  return errs;
}

/** HCF from the minimum shared exponents. Exact, never by division steps. */
export function hcfByFactorisation(a: number, b: number): number {
  const fa = new Map(primeFactorise(a).map((p) => [p.prime, p.exponent]));
  const fb = new Map(primeFactorise(b).map((p) => [p.prime, p.exponent]));
  let out = 1;
  for (const [prime, ea] of fa) {
    const eb = fb.get(prime);
    if (eb !== undefined) out *= prime ** Math.min(ea, eb);
  }
  return out;
}

/** LCM from the maximum exponent across every prime appearing in either. */
export function lcmByFactorisation(a: number, b: number): number {
  const fa = new Map(primeFactorise(a).map((p) => [p.prime, p.exponent]));
  const fb = new Map(primeFactorise(b).map((p) => [p.prime, p.exponent]));
  let out = 1;
  for (const prime of new Set([...fa.keys(), ...fb.keys()])) {
    out *= prime ** Math.max(fa.get(prime) ?? 0, fb.get(prime) ?? 0);
  }
  return out;
}

/**
 * HCF x LCM = a x b, for TWO positive integers. The restriction is real:
 * the identity fails for three, and 4, 6, 15 is the standard witness.
 */
export function productRelationHolds(a: number, b: number): boolean {
  return hcfByFactorisation(a, b) * lcmByFactorisation(a, b) === a * b;
}

// ---------------------------------------------------------------------------
// The rationalisation-leak audit.
// ---------------------------------------------------------------------------

export type ScopeFinding = { where: string; text: string; reason: string };

/** Teaching the removed algorithm. */
const TEACHES_EUCLID = [
  /\bEuclid'?s? division (?:algorithm|lemma)\b/i,
  /\bdivision algorithm\b/i,
  /\brepeated division\b[^.]{0,40}\b(?:to find|gives|HCF)\b/i,
  /\bdivide[^.]{0,30}\btake the remainder\b[^.]{0,40}\brepeat\b/i,
];

/**
 * Naming the removed topic in order to say it is removed. A governance note
 * must be able to say what it is excluding, or the exclusion cannot be
 * recorded at all.
 */
const DIAGNOSES_RATHER_THAN_TEACHES = [
  /\bremoved\b|\brationalis(?:ed|ation)\b|\bno longer\b|\bnot part of\b|\boutside (?:the )?current\b/i,
  /\bstill (?:mentions|advertises|says)\b/i,
  /\bnot taught\b|\bdo not (?:teach|use)\b|\bexcluded\b/i,
];

function sentences(t: string): string[] {
  return t.split(/(?<=[.?!])\s+/).filter((s) => s.trim());
}

/**
 * Flag removed content presented as instruction, while letting a source or
 * governance note name it. A word ban would make the discrepancy
 * undocumentable, which is the opposite of what this checkpoint wants.
 */
export function auditRationalisationLeak(blocks: Array<[string, string]>): ScopeFinding[] {
  const out: ScopeFinding[] = [];
  for (const [where, text] of blocks) {
    for (const s of sentences(text)) {
      if (DIAGNOSES_RATHER_THAN_TEACHES.some((r) => r.test(s))) continue;
      const hit = TEACHES_EUCLID.find((r) => r.test(s));
      if (hit) {
        out.push({ where, text: s.trim().slice(0, 160), reason: 'presents Euclid\u2019s division algorithm as current instruction; rationalisation removed it' });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// The Real Numbers proof-scope audit.
// ---------------------------------------------------------------------------

const PROVES_FTA = [
  /\b(?:prove|proving|proof of|establish|derive)\b[^.]{0,40}\bFundamental Theorem(?: of Arithmetic)?\b/i,
  /\bFundamental Theorem(?: of Arithmetic)?\b[^.]{0,40}\b(?:is proved|we prove|can be proved|is established)\b/i,
  /\bproof of (?:the )?(?:FTA|uniqueness of prime factorisation)\b/i,
];
const ACKNOWLEDGES_SCOPE = [
  /\bwithout prov(?:ing|e|ed)\b/i,
  /\bwe (?:do not|will not|shall not) prove\b/i,
  /\btake(?:n)? (?:this|it) as given\b/i,
  /\bstated without proof\b/i,
  /\bnot prov(?:ed|en) here\b/i,
  /\bbeyond (?:this|the) (?:lesson|course|scope)\b/i,
];

/** A real irrationality proof needs these moves, not an assertion. */
const CONTRADICTION_MOVES: Array<[string, RegExp]> = [
  ['assumes the opposite', /\bsuppose\b|\bassume\b/i],
  ['states lowest terms', /lowest terms|no common factor|coprime|common factor other than 1/i],
  ['derives divisibility', /\bdivides\b/i],
  ['reaches the contradiction', /\bcontradict/i],
];

export function auditRealNumbersScope(
  section: AuthoredSection,
  expectation: 'STATE_WITHOUT_PROOF' | 'PROVE' | 'APPLY'
): ScopeFinding[] {
  const out: ScopeFinding[] = [];
  const blocks: Array<[string, string]> = [
    ['learning goal', section.learningGoal],
    ['explanation', section.explanation.join(' ')],
    ['summary', section.summary],
    ...section.workedExamples.map((w): [string, string] => [`worked ${w.id}`,
      [w.prompt, ...w.steps.map((s) => `${s.text} ${s.reasoning}`), w.answer].join(' ')]),
    ...section.guidedPractice.map((g): [string, string] => [`guided ${g.id}`, `${g.prompt} ${g.rationale}`]),
    ...section.independentPractice.map((p): [string, string] => [`independent ${p.id}`, `${p.prompt} ${p.rationale}`]),
    ...section.reasoningApplication.map((r): [string, string] => [`think deeper ${r.id}`, `${r.prompt} ${r.expectedReasoning}`]),
  ];

  // Removed content must not appear as instruction in any unit.
  out.push(...auditRationalisationLeak(blocks));

  if (expectation === 'STATE_WITHOUT_PROOF') {
    for (const [where, text] of blocks) {
      for (const s of sentences(text)) {
        if (ACKNOWLEDGES_SCOPE.some((r) => r.test(s))) continue;
        if (PROVES_FTA.some((r) => r.test(s))) {
          out.push({ where, text: s.trim().slice(0, 160), reason: 'proves the Fundamental Theorem, which the current scope states without proof' });
        }
      }
    }
  }

  if (expectation === 'PROVE') {
    const whole = blocks.map(([, t]) => t).join(' ');
    for (const [name, re] of CONTRADICTION_MOVES) {
      if (!re.test(whole)) out.push({ where: 'lesson', text: '', reason: `a PROVE unit that never ${name}` });
    }
    // The lowest-terms condition is where the contradiction actually lands.
    //
    // Only examples that actually PROVE are held to it. An earlier version
    // matched any mention of irrationality, and flagged an example whose
    // whole point was that computing decimals is NOT a proof — which is the
    // opposite of the defect being looked for.
    //
    // And only those taking the DIRECT route — assuming a/b and squaring.
    // A proof that reduces to an already-established irrational, as the one
    // for 3 + 2\u221a5 does, never forms a fraction to square and so has no
    // lowest-terms condition to state. Requiring it there would have been
    // demanding a step the mathematics does not contain.
    const proofs = section.workedExamples.filter((w) => /\bprove\b|\bproof that\b/i.test(w.prompt));
    for (const w of proofs) {
      const body = [...w.steps.map((s) => `${s.text} ${s.reasoning}`), w.answer].join(' ');
      const squaresAFraction = /a\u00b2\s*=|a \/ b|a\/b/.test(body) && /\bsquar/i.test(body);
      if (!squaresAFraction) continue;
      if (!/lowest terms|no common factor|coprime|common factor other than 1/i.test(body)) {
        out.push({ where: `worked ${w.id}`, text: '', reason: 'a direct irrationality proof that never states the lowest-terms condition' });
      }
    }
    for (const [where, text] of blocks) {
      for (const s of sentences(text)) {
        if (/\bit can be shown\b|\bwe omit the proof\b|\bis clearly irrational\b|\bobviously irrational\b/i.test(s)) {
          out.push({ where, text: s.trim().slice(0, 160), reason: 'downgrades a required proof to an observation' });
        }
      }
    }
  }

  return out;
}
