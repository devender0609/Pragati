// ===========================================================================
// v0.84.0-c11.28 checkpoint 91 — SEQUENCES, SERIES, AND CONVERGENCE.
//
// THE DISTINCTION THIS FILE EXISTS TO HOLD
//
// A sequence is an ordered list of terms. A series is a SUM of terms. They
// are different types here, not one type with a display flag, because every
// confusion in this chapter comes from treating them as the same thing.
//
// THE FRONTIER: an infinite geometric series is NOT a finite sum with a
// large n. It is the LIMIT OF THE SEQUENCE OF PARTIAL SUMS, and this file
// represents it that way — partial sums first, limit second. Substituting
// n = infinity into the finite formula would produce the right number for
// the wrong reason, and would produce a number for divergent cases too.
//
// REUSE: the arithmetic progression comes from Class 10's model; exact
// radicals from `specialAngles`. Neither is rebuilt.
// ===========================================================================

import { type ArithmeticProgression, term as apTerm } from './arithmeticProgression';
import { type Exact, exactValue } from './specialAngles';

// ---------------------------------------------------------------------------
// Unit 1 — sequences.
// ---------------------------------------------------------------------------

/**
 * A sequence, held as a RULE rather than a list of displayed values. A
 * finite prefix is something a sequence can show; it is not what a sequence
 * is, and storing only the prefix would make the fourth term unknowable.
 */
export type Sequence = {
  id: string;
  /** How the source writes the rule, e.g. "a_n = 2n + 1". */
  rule: string;
  /** The first index. The source counts from 1 here; it is not assumed. */
  startsAt: number;
  /** Number of terms, when finite. Absent means endless. */
  length?: number;
  /** The term at position n, computed from the rule. */
  termAt: (n: number) => number;
};

export function sequence(
  id: string, rule: string, termAt: (n: number) => number, startsAt = 1, length?: number
): Sequence {
  if (!Number.isInteger(startsAt)) throw new Error('a sequence starts at a whole-number index');
  if (length !== undefined && (!Number.isInteger(length) || length < 1)) {
    throw new Error('a finite sequence needs a whole number of terms');
  }
  return { id, rule, startsAt, length, termAt };
}

export function termsOf(s: Sequence, count: number): number[] {
  const out: number[] = [];
  const limit = s.length === undefined ? count : Math.min(count, s.length);
  for (let i = 0; i < limit; i += 1) out.push(s.termAt(s.startsAt + i));
  return out;
}

/** A sequence built from the Class 10 arithmetic progression, not beside it. */
export const fromArithmeticProgression = (id: string, ap: ArithmeticProgression, rule: string): Sequence =>
  sequence(id, rule, (n) => apTerm(ap, n), 1, ap.length);

/**
 * Every displayed term must come from the rule. A lesson that lists terms
 * beside a rule can drift; this is what catches it.
 */
export function displayedTermsMatchRule(s: Sequence, displayed: number[]): string[] {
  const problems: string[] = [];
  displayed.forEach((v, i) => {
    const fromRule = s.termAt(s.startsAt + i);
    if (Math.abs(fromRule - v) > 1e-9) {
      problems.push(`term ${i + 1} is shown as ${v} but the rule gives ${fromRule}`);
    }
  });
  return problems;
}

// ---------------------------------------------------------------------------
// Unit 2 — series and sigma notation. A DIFFERENT TYPE.
// ---------------------------------------------------------------------------

/**
 * A finite sum, written in sigma notation. The bounds and the index are
 * fields, not decoration: a sigma without bounds names no particular sum.
 */
export type FiniteSeries = {
  id: string;
  /** The index variable, as the source writes it. */
  index: string;
  from: number;
  to: number;
  /** How the source writes the summand. */
  summand: string;
  /** The term at each index, from the underlying sequence. */
  termAt: (n: number) => number;
};

export function finiteSeries(
  id: string, index: string, from: number, to: number, summand: string, termAt: (n: number) => number
): FiniteSeries {
  if (!Number.isInteger(from) || !Number.isInteger(to)) {
    throw new Error('sigma bounds must be whole numbers');
  }
  if (to < from) {
    throw new Error(`the upper bound ${to} is below the lower bound ${from}, so no terms are summed`);
  }
  return { id, index, from, to, summand, termAt };
}

/** The series of a sequence's first n terms — sequence in, series out. */
export const seriesOf = (id: string, s: Sequence, n: number, summand: string): FiniteSeries =>
  finiteSeries(id, 'k', s.startsAt, s.startsAt + n - 1, summand, (k) => s.termAt(k));

export function expandedTerms(series: FiniteSeries): number[] {
  const out: number[] = [];
  for (let k = series.from; k <= series.to; k += 1) out.push(series.termAt(k));
  return out;
}

export const sumOf = (series: FiniteSeries): number =>
  expandedTerms(series).reduce((a, b) => a + b, 0);

/** How the sigma reads expanded, so notation and sum can be compared. */
export const writeExpanded = (series: FiniteSeries): string =>
  expandedTerms(series).join(' + ');

export const describeSigma = (series: FiniteSeries): string =>
  `the sum from ${series.index} = ${series.from} to ${series.to} of ${series.summand}`;

// ---------------------------------------------------------------------------
// Unit 3 — arithmetic mean, through the AP.
// ---------------------------------------------------------------------------

export const arithmeticMean = (a: number, b: number): number => (a + b) / 2;

/**
 * Inserting n arithmetic means between a and b. The result is an AP of
 * n + 2 terms, so there are n + 1 gaps and the common difference follows
 * from the endpoints — the inserted values are never typed in.
 */
export function insertArithmeticMeans(a: number, b: number, n: number): {
  progression: ArithmeticProgression; inserted: number[]; totalTerms: number;
} {
  if (!Number.isInteger(n) || n < 1) throw new Error('the number of means inserted must be a positive whole number');
  const d = (b - a) / (n + 1);
  const progression: ArithmeticProgression = { id: `means_${a}_${b}_${n}`, a, d, length: n + 2 };
  const inserted: number[] = [];
  for (let i = 1; i <= n; i += 1) inserted.push(apTerm(progression, i + 1));
  return { progression, inserted, totalTerms: n + 2 };
}

// ---------------------------------------------------------------------------
// Units 4 and 5 — geometric progression. A SIBLING of the AP, not a rename.
// ---------------------------------------------------------------------------

/**
 * A GP. The ratio is multiplicative, which is a different kind of structure
 * from the AP's additive difference — renaming `d` to `r` would give the
 * wrong nth term and the wrong sum.
 */
export type GeometricProgression = {
  id: string;
  /** First term. */
  a: number;
  /** Common ratio. */
  r: number;
  length?: number;
};

export function geometricProgression(id: string, a: number, r: number, length?: number): GeometricProgression {
  if (a === 0) throw new Error('a geometric progression with first term 0 has no ratio to speak of');
  return { id, a, r, length };
}

/** The nth term, a·r^(n−1). Generated forward, never inferred by dividing. */
export function gpTerm(gp: GeometricProgression, n: number): number {
  if (!Number.isInteger(n) || n < 1) throw new Error(`position ${n} is not a term position`);
  return gp.a * gp.r ** (n - 1);
}

export const gpTerms = (gp: GeometricProgression, count: number): number[] =>
  Array.from({ length: count }, (_, i) => gpTerm(gp, i + 1));

export const gpSequence = (id: string, gp: GeometricProgression, rule: string): Sequence =>
  sequence(id, rule, (n) => gpTerm(gp, n), 1, gp.length);

/**
 * The sum of the first n terms.
 *
 * The general formula divides by 1 − r, so r = 1 is not a special case to
 * remember but a division that does not exist. It is handled first, and
 * exactly: n copies of a.
 */
export type GpSum =
  | { kind: 'sum'; value: number; via: 'constant_terms' | 'formula' }
  | { kind: 'undefined'; reason: string };

export function gpSumOfFirst(gp: GeometricProgression, n: number): GpSum {
  if (!Number.isInteger(n) || n < 1) {
    return { kind: 'undefined', reason: 'the number of terms must be a positive whole number' };
  }
  if (gp.r === 1) {
    // Every term is a, so the sum is na — reached without dividing by zero.
    return { kind: 'sum', value: gp.a * n, via: 'constant_terms' };
  }
  return { kind: 'sum', value: (gp.a * (1 - gp.r ** n)) / (1 - gp.r), via: 'formula' };
}

/** The same sum by adding the generated terms. A test oracle, not the path. */
export const gpSumByAddition = (gp: GeometricProgression, n: number): number =>
  gpTerms(gp, n).reduce((a, b) => a + b, 0);

// ---------------------------------------------------------------------------
// Unit 6 — the frontier: an infinite series as a LIMIT OF PARTIAL SUMS.
// ---------------------------------------------------------------------------

/**
 * The sequence of partial sums. S_n is the sum of the first n terms, and
 * the infinite series IS this sequence's limit — which is why the partial
 * sums are a first-class object here rather than an intermediate value.
 */
export const partialSums = (gp: GeometricProgression, upTo: number): number[] =>
  Array.from({ length: upTo }, (_, i) => {
    const s = gpSumOfFirst(gp, i + 1);
    return s.kind === 'sum' ? s.value : Number.NaN;
  });

export type InfiniteSeriesResult =
  | { kind: 'converges'; sum: number; condition: string }
  | { kind: 'diverges'; reason: string }
  | { kind: 'undetermined'; reason: string };

/**
 * The source's condition is |r| < 1. Checked, not assumed, and the
 * divergent cases get a NAMED outcome rather than Infinity or NaN — an
 * infinite sum that does not exist is not a very large number.
 */
export function infiniteGeometricSum(gp: GeometricProgression): InfiniteSeriesResult {
  const r = gp.r;
  if (Math.abs(r) >= 1) {
    if (r === 1) {
      return { kind: 'diverges', reason: 'every term is the same, so the partial sums grow without settling' };
    }
    if (r === -1) {
      return { kind: 'diverges', reason: 'the partial sums alternate between two values and never settle on one' };
    }
    return { kind: 'diverges', reason: `the terms do not shrink when the ratio has size ${Math.abs(r)}, so the partial sums grow without bound` };
  }
  return { kind: 'converges', sum: gp.a / (1 - r), condition: '|r| < 1' };
}

/**
 * Evidence that the partial sums really do settle: the last few are within
 * a tolerance of the claimed value and getting closer. This is what makes
 * the claim a limit rather than a formula substitution.
 */
export function partialSumsApproach(gp: GeometricProgression, claimed: number, upTo = 40): {
  settles: boolean; lastGap: number; gapsShrink: boolean;
} {
  const sums = partialSums(gp, upTo);
  const gaps = sums.map((s) => Math.abs(claimed - s));
  const lastGap = gaps[gaps.length - 1];
  const gapsShrink = gaps.every((g, i) => i === 0 || g <= gaps[i - 1] + 1e-12);
  return { settles: lastGap < 1e-6, lastGap, gapsShrink };
}

export const describeInfinite = (r: InfiniteSeriesResult): string =>
  r.kind === 'converges' ? String(r.sum) : `the sum does not exist, because ${r.reason}`;

// ---------------------------------------------------------------------------
// Units 6 and 7 — geometric mean, and the AM–GM relationship.
// ---------------------------------------------------------------------------

export type GeometricMean =
  | { kind: 'mean'; exact: Exact; value: number }
  | { kind: 'outside_domain'; reason: string };

/**
 * The geometric mean of a and b is the square root of their product, over
 * the source's domain of POSITIVE numbers. Negative inputs are refused
 * rather than quietly returning a root of a negative product.
 */
export function geometricMean(a: number, b: number): GeometricMean {
  if (a <= 0 || b <= 0) {
    return { kind: 'outside_domain', reason: 'the geometric mean is defined here for positive numbers only' };
  }
  const product = a * b;
  const root = Math.sqrt(product);
  // Exact when the product is a perfect square; otherwise kept as a radical.
  const exact: Exact = Number.isInteger(root) ? { p: root, q: 1, k: 1 } : { p: 1, q: 1, k: product };
  return { kind: 'mean', exact, value: exactValue(exact) };
}

export const describeGeometricMean = (g: GeometricMean): string => {
  if (g.kind === 'outside_domain') return `there is no geometric mean, because ${g.reason}`;
  return g.exact.k === 1 ? String(g.exact.p) : `√${g.exact.k}`;
};

/**
 * The AM–GM relationship, over the source's positive domain.
 *
 * The positivity assumption is part of the claim, not a footnote: without
 * it the comparison is not merely unproved but false, so a check that omits
 * the domain is checking nothing.
 */
export type AmGmComparison =
  | { kind: 'compared'; am: number; gm: number; amAtLeastGm: boolean; equal: boolean }
  | { kind: 'outside_domain'; reason: string };

export function compareAmGm(a: number, b: number): AmGmComparison {
  const gm = geometricMean(a, b);
  if (gm.kind === 'outside_domain') return { kind: 'outside_domain', reason: gm.reason };
  const am = arithmeticMean(a, b);
  return {
    kind: 'compared', am, gm: gm.value,
    amAtLeastGm: am >= gm.value - 1e-12,
    equal: Math.abs(am - gm.value) < 1e-12,
  };
}

// ---------------------------------------------------------------------------
// The forward-indexed partial-sum figure.
// ---------------------------------------------------------------------------

/**
 * v0.84.0-c11.29 checkpoint 91C — A SEQUENCE INDEXED FORWARD FROM n = 1.
 *
 * SEQ-06 first reused the limit table, which samples a real variable from
 * BOTH sides of its target. A sequence of partial sums has no left side:
 * S_n exists for n = 1, 2, 3 and nowhere else, so the table opened with six
 * "no value" cells before the first real number — semantically valid
 * elsewhere, pedagogically wrong here.
 *
 * The fix is the shape, not the cells. This figure walks forward from the
 * first index, every value read from the partial-sum model, and it does not
 * require a limiting value — a divergent sequence is representable without
 * inventing a target.
 */
export type IndexedSequenceSpec = {
  type: 'indexed_sequence';
  id: string;
  /** How the index is written, e.g. "n". */
  indexLabel: string;
  /** How the value is written, e.g. "S_n". */
  valueLabel: string;
  /** Rows in order, from the first index forward. */
  rows: Array<{ n: number; value: string }>;
  /** The limiting value, when the model says there is one. */
  approaches?: string;
  /** Why there is no limit, when the model says there is none. */
  divergenceReason?: string;
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

/**
 * Build the figure from a geometric progression. The values come from
 * `partialSums` and the target from `infiniteGeometricSum`, so the figure
 * never decides convergence — it only shows what the model concluded.
 */
export function partialSumFigure(
  id: string, gp: GeometricProgression, rowCount: number, altText: string, decimals = 4
): IndexedSequenceSpec {
  const sums = partialSums(gp, rowCount);
  const rows = sums.map((v, i) => ({ n: i + 1, value: String(Number(v.toFixed(decimals))) }));
  const result = infiniteGeometricSum(gp);
  return {
    type: 'indexed_sequence', id, indexLabel: 'n', valueLabel: 'S_n', rows,
    ...(result.kind === 'converges' ? { approaches: String(result.sum) } : {}),
    ...(result.kind === 'diverges' ? { divergenceReason: result.reason } : {}),
    altText, caption: altText, status: 'verified',
  };
}

export function validateIndexedSequence(spec: IndexedSequenceSpec): string[] {
  const problems: string[] = [];
  if (!spec.rows.length) problems.push('an indexed sequence figure needs at least one row');
  // The defect this type exists to prevent: nothing before the first index.
  if (spec.rows[0] && spec.rows[0].n !== 1) {
    problems.push(`the first row is indexed ${spec.rows[0].n}; a partial-sum sequence starts at 1`);
  }
  spec.rows.forEach((r, i) => {
    if (r.n !== i + 1) problems.push(`row ${i + 1} is indexed ${r.n}, so the rows are not in forward order`);
    if (!r.value.trim() || /no value|undefined|NaN|Infinity/i.test(r.value)) {
      problems.push(`row ${r.n} has no usable value, which a forward sequence never produces`);
    }
  });
  // A figure may have a limit or a reason there is none, never both.
  if (spec.approaches !== undefined && spec.divergenceReason !== undefined) {
    problems.push('the figure claims both a limit and a reason there is none');
  }
  if (!spec.altText.trim()) problems.push('altText is required');
  return problems;
}

/** Checks the displayed values against the model, so they cannot drift. */
export function partialSumFigureMatchesModel(
  spec: IndexedSequenceSpec, gp: GeometricProgression, decimals = 4
): string[] {
  const expected = partialSums(gp, spec.rows.length);
  const problems: string[] = [];
  spec.rows.forEach((r, i) => {
    const want = String(Number(expected[i].toFixed(decimals)));
    if (r.value !== want) problems.push(`row ${r.n} shows ${r.value} but the model gives ${want}`);
  });
  return problems;
}
