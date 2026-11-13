// ===========================================================================
// v0.84.0-c11.24 checkpoint 89 — THE BINOMIAL THEOREM AS A COMPOSITION.
//
// This file adds almost no mathematics of its own. The two things the
// theorem is made of already exist:
//
//   - the coefficients ARE combinations, from `counting.ts` (exact bigint)
//   - the proof IS an induction, from `induction.ts` (Claim, Base case,
//     Hypothesis, Inductive step, Conclusion)
//
// So there is no BinomialProofSpec and no second combinations engine. What
// is genuinely new is the TERM: a pairing of one coefficient with two
// exponents that must sum to n, and the identity that lets one row of
// coefficients be built from the row above it.
//
// Scope is the source's: a positive integral index. Negative and fractional
// indices and the infinite series are not Class XI and are not modelled.
// ===========================================================================

import { type CountResult, combinations, describeCount, isCount } from './counting';

/** One term of an expansion. The exponents are not free: they must sum to n. */
export type BinomialTerm = {
  /** The index r in nCr, counting from 0. */
  index: number;
  /** nCr, taken from the combination model rather than typed here. */
  coefficient: CountResult;
  /** The exponent on the first symbol. */
  firstPower: number;
  /** The exponent on the second symbol. */
  secondPower: number;
};

export type BinomialExpansion = {
  id: string;
  /** The index n. Positive integral, as the source states it. */
  n: number;
  first: string;
  second: string;
  terms: BinomialTerm[];
};

/**
 * Build the expansion of (first + second)^n.
 *
 * Every coefficient comes from `combinations`, so a coefficient can never
 * disagree with the counting model: there is one source of truth and this
 * reads it.
 */
export function expand(id: string, n: number, first = 'a', second = 'b'): BinomialExpansion {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('the binomial theorem here is stated for a positive integral index');
  }
  const terms: BinomialTerm[] = [];
  for (let r = 0; r <= n; r += 1) {
    terms.push({
      index: r,
      coefficient: combinations(n, r),
      firstPower: n - r,
      secondPower: r,
    });
  }
  return { id, n, first, second, terms };
}

/**
 * Structural checks. Each corresponds to a way an expansion can look
 * plausible and be wrong — which is exactly what a student's eye misses.
 */
export function validateExpansion(e: BinomialExpansion): string[] {
  const problems: string[] = [];
  if (e.terms.length !== e.n + 1) {
    problems.push(`an expansion of index ${e.n} has ${e.n + 1} terms, not ${e.terms.length}`);
  }
  for (const t of e.terms) {
    // The invariant that catches malformed terms: the powers partition n.
    if (t.firstPower + t.secondPower !== e.n) {
      problems.push(`the exponents in term ${t.index} add to ${t.firstPower + t.secondPower}, not ${e.n}`);
    }
    if (!isCount(t.coefficient)) {
      problems.push(`term ${t.index} has no valid coefficient`);
      continue;
    }
    const expected = combinations(e.n, t.index);
    if (!isCount(expected) || expected.value !== t.coefficient.value) {
      problems.push(`term ${t.index} does not carry ${e.n}C${t.index}`);
    }
  }
  const indices = e.terms.map((t) => t.index);
  if (indices.some((v, i) => v !== i)) {
    problems.push('the terms are not in order of increasing index, so a coefficient sits in the wrong place');
  }
  return problems;
}

/** The term at index r, for reading a single term out of an expansion. */
export function termAt(e: BinomialExpansion, r: number): BinomialTerm | null {
  return e.terms.find((t) => t.index === r) ?? null;
}

/** How a term reads in a lesson. No raw state reaches a student. */
export function describeTerm(e: BinomialExpansion, t: BinomialTerm): string {
  const c = describeCount(t.coefficient);
  const power = (sym: string, p: number) => (p === 0 ? '' : p === 1 ? sym : `${sym}^${p}`);
  const body = [power(e.first, t.firstPower), power(e.second, t.secondPower)].filter(Boolean).join('');
  return c === '1' && body ? body : `${c}${body || ''}`;
}

export const describeExpansion = (e: BinomialExpansion): string =>
  e.terms.map((t) => describeTerm(e, t)).join(' + ');

/**
 * The identity the inductive step turns on: two adjacent coefficients of one
 * row add to a coefficient of the next.
 *
 *   kCr + kC(r-1) = (k+1)Cr
 *
 * It is CHECKED against the combination model rather than asserted, so the
 * proof's pivotal algebra rests on the same exact arithmetic as everything
 * else.
 */
export function adjacentCoefficientsCombine(k: number, r: number): {
  holds: boolean;
  left: string;
  right: string;
} {
  const a = combinations(k, r);
  const b = combinations(k, r - 1);
  const sum = combinations(k + 1, r);
  if (!isCount(a) || !isCount(b) || !isCount(sum)) {
    return { holds: false, left: 'undefined', right: 'undefined' };
  }
  return {
    holds: a.value + b.value === sum.value,
    left: `${a.value} + ${b.value}`,
    right: sum.value.toString(),
  };
}

/**
 * An expansion worked out WITHOUT the theorem, by repeated multiplication.
 * A test oracle for small n: the theorem must not be used to check itself.
 */
export function expandByMultiplication(n: number): bigint[] {
  // Each polynomial is its coefficient list, lowest power of the second
  // symbol first. Multiplying by (a + b) shifts and adds — no nCr anywhere.
  let poly: bigint[] = [1n];
  for (let i = 0; i < n; i += 1) {
    const next: bigint[] = new Array(poly.length + 1).fill(0n);
    for (let j = 0; j < poly.length; j += 1) {
      next[j] += poly[j];
      next[j + 1] += poly[j];
    }
    poly = next;
  }
  return poly;
}

/** Rows of coefficients, each entry read from the combination model. */
export type CoefficientRowsSpec = {
  type: 'coefficient_rows';
  id: string;
  /** Row n holds nC0 … nCn, as decimal strings for JSON safety. */
  rows: Array<{ n: number; entries: string[] }>;
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export function coefficientRows(id: string, upTo: number, altText: string): CoefficientRowsSpec {
  const rows = [];
  for (let n = 0; n <= upTo; n += 1) {
    const entries: string[] = [];
    for (let r = 0; r <= n; r += 1) entries.push(describeCount(combinations(n, r)));
    rows.push({ n, entries });
  }
  return { type: 'coefficient_rows', id, rows, altText, caption: altText, status: 'verified' };
}

export function validateCoefficientRows(spec: CoefficientRowsSpec): string[] {
  const problems: string[] = [];
  if (!spec.rows.length) problems.push('a coefficient figure needs at least one row');
  for (const row of spec.rows) {
    if (row.entries.length !== row.n + 1) {
      problems.push(`row ${row.n} should hold ${row.n + 1} entries, not ${row.entries.length}`);
    }
    // Every entry is re-derived: no number here is typed by hand.
    for (let r = 0; r < row.entries.length; r += 1) {
      if (row.entries[r] !== describeCount(combinations(row.n, r))) {
        problems.push(`row ${row.n} entry ${r} is not ${row.n}C${r}`);
      }
    }
  }
  if (!spec.altText.trim()) problems.push('altText is required');
  return problems;
}
