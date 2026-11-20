// ===========================================================================
// v0.84.0-c11.22 checkpoint 88 — COUNTING STRUCTURE, NOT COUNTING FORMULAS.
//
// WHAT THIS MAKES EXPLICIT
//
// Every counting question in this chapter turns on two properties the
// formulas hide: does ORDER matter, and are the objects DISTINGUISHABLE.
// A model that stores only a formula string can answer neither, so those two
// are fields here, and the count is derived from them.
//
// EXACTNESS
//
// Counts are whole numbers, so the arithmetic is `bigint` throughout. A
// factorial past 20 leaves the safe range of a double, and returning
// scientific notation for a count would be a false answer rather than an
// imprecise one. Quotients that cancel — nPr is one — are computed by
// cancelling rather than by building both factorials first.
//
// WHAT IT IS NOT
//
// Not a combinatorics solver. It represents the five source units: staged
// choices, factorials, ordered arrangements, repeated objects, and unordered
// selections. Small cases are enumerated in the tests as an oracle, never as
// the production algorithm.
// ===========================================================================

/** A count, or a refusal with the reason. Never NaN, Infinity or null. */
export type CountResult =
  | { kind: 'count'; value: bigint }
  | { kind: 'undefined'; reason: string };

export const isCount = (r: CountResult): r is { kind: 'count'; value: bigint } => r.kind === 'count';

/** How a count reads in a lesson, so no raw state reaches a student. */
export function describeCount(r: CountResult): string {
  return r.kind === 'count' ? r.value.toString() : `there is no such count, because ${r.reason}`;
}

const wholeNumberErrors = (label: string, n: number): string | null => {
  if (!Number.isInteger(n)) return `${label} must be a whole number`;
  if (n < 0) return `${label} cannot be negative`;
  return null;
};

// ---------------------------------------------------------------------------
// Unit 1 — staged choices.
// ---------------------------------------------------------------------------

export type Stage = { name: string; choices: number };

/**
 * A sequence of independent stages. The total is the product, but only
 * because every choice at one stage can be paired with every choice at the
 * next — which is a property of the situation, not of the arithmetic.
 */
export type StagedChoice = { id: string; stages: Stage[] };

export function stagedChoice(id: string, stages: Stage[]): StagedChoice {
  for (const s of stages) {
    const bad = wholeNumberErrors(`the number of ${s.name} choices`, s.choices);
    if (bad) throw new Error(bad);
    if (s.choices === 0) throw new Error(`a stage with no choices leaves nothing to count at "${s.name}"`);
  }
  if (!stages.length) throw new Error('a staged choice needs at least one stage');
  return { id, stages };
}

export function countStaged(sc: StagedChoice): CountResult {
  let total = 1n;
  for (const s of sc.stages) total *= BigInt(s.choices);
  return { kind: 'count', value: total };
}

/** Every outcome, for small cases. A test oracle, not the production path. */
export function enumerateStaged(sc: StagedChoice): string[][] {
  let out: string[][] = [[]];
  for (const s of sc.stages) {
    const next: string[][] = [];
    for (const partial of out) {
      for (let i = 1; i <= s.choices; i += 1) next.push([...partial, `${s.name}${i}`]);
    }
    out = next;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Unit 2 — factorial, exact.
// ---------------------------------------------------------------------------

/**
 * n! as an exact integer. `bigint` because 21! already exceeds what a double
 * can hold exactly, and an approximate count is a wrong count.
 */
export function factorial(n: number): CountResult {
  const bad = wholeNumberErrors('n', n);
  if (bad) return { kind: 'undefined', reason: bad };
  let acc = 1n;
  for (let i = 2n; i <= BigInt(n); i += 1n) acc *= i;
  return { kind: 'count', value: acc };
}

/**
 * n! / (n − r)! WITHOUT building either factorial. The cancellation leaves
 * r descending factors, which is also exactly how the permutation count is
 * reached by stages — the two routes are the same arithmetic.
 */
export function fallingFactorial(n: number, r: number): CountResult {
  for (const [label, v] of [['n', n], ['r', r]] as const) {
    const bad = wholeNumberErrors(label, v);
    if (bad) return { kind: 'undefined', reason: bad };
  }
  if (r > n) return { kind: 'undefined', reason: `you cannot take ${r} objects from only ${n}` };
  let acc = 1n;
  for (let i = 0; i < r; i += 1) acc *= BigInt(n - i);
  return { kind: 'count', value: acc };
}

// ---------------------------------------------------------------------------
// Units 3 and 5 — selections, where ORDER is the deciding field.
// ---------------------------------------------------------------------------

export type Selection = {
  id: string;
  /** How many distinct objects are available. */
  from: number;
  /** How many are taken. */
  take: number;
  /**
   * The field the whole chapter turns on. Two selections identical except
   * for this have different counts, and the model must not blur them.
   */
  orderMatters: boolean;
};

export const selection = (id: string, from: number, take: number, orderMatters: boolean): Selection =>
  ({ id, from, take, orderMatters });

export function countSelection(s: Selection): CountResult {
  const ordered = fallingFactorial(s.from, s.take);
  if (ordered.kind === 'undefined') return ordered;
  if (s.orderMatters) return ordered;
  // Each unordered selection of r objects corresponds to r! ordered ones,
  // so dividing removes exactly that repetition. The division is exact.
  const r = factorial(s.take);
  if (r.kind === 'undefined') return r;
  if (ordered.value % r.value !== 0n) {
    return { kind: 'undefined', reason: 'the ordered count does not divide evenly, so the selection is malformed' };
  }
  return { kind: 'count', value: ordered.value / r.value };
}

export const permutations = (n: number, r: number): CountResult => countSelection(selection('p', n, r, true));
export const combinations = (n: number, r: number): CountResult => countSelection(selection('c', n, r, false));

/** Every ordered or unordered selection, for small cases. A test oracle. */
export function enumerateSelection(objects: string[], take: number, orderMatters: boolean): string[][] {
  const out: string[][] = [];
  const walk = (chosen: string[], remaining: string[], startAt: number) => {
    if (chosen.length === take) { out.push([...chosen]); return; }
    if (orderMatters) {
      for (let i = 0; i < remaining.length; i += 1) {
        walk([...chosen, remaining[i]], remaining.filter((_, j) => j !== i), 0);
      }
    } else {
      for (let i = startAt; i < remaining.length; i += 1) {
        walk([...chosen, remaining[i]], remaining, i + 1);
      }
    }
  };
  walk([], objects, 0);
  return out;
}

// ---------------------------------------------------------------------------
// Unit 4 — repeated objects, and fixed positions.
// ---------------------------------------------------------------------------

export type RepetitionGroup = { label: string; count: number };

/**
 * An arrangement of n objects where some are indistinguishable. The
 * multiplicities must account for every object: a group list that does not
 * sum to n describes a different problem, and is refused rather than
 * silently padded.
 */
export type RepeatedArrangement = { id: string; total: number; groups: RepetitionGroup[] };

export function repeatedArrangement(id: string, total: number, groups: RepetitionGroup[]): RepeatedArrangement {
  const bad = wholeNumberErrors('the total number of objects', total);
  if (bad) throw new Error(bad);
  const sum = groups.reduce((n, g) => n + g.count, 0);
  if (sum !== total) {
    throw new Error(`the group sizes add to ${sum} but there are ${total} objects, so some object is unaccounted for`);
  }
  for (const g of groups) {
    const e = wholeNumberErrors(`the number of ${g.label}`, g.count);
    if (e) throw new Error(e);
    if (g.count === 0) throw new Error(`the group "${g.label}" has no members`);
  }
  return { id, total, groups };
}

/**
 * n! divided by the factorial of each repetition group.
 *
 * The division is not decoration. n! counts every swap of two identical
 * objects as a fresh arrangement, and there are exactly p! such swaps inside
 * a group of p identical objects, so dividing removes precisely the
 * overcount it created.
 */
export function countRepeated(a: RepeatedArrangement): CountResult {
  const top = factorial(a.total);
  if (top.kind === 'undefined') return top;
  let bottom = 1n;
  for (const g of a.groups) {
    const f = factorial(g.count);
    if (f.kind === 'undefined') return f;
    bottom *= f.value;
  }
  if (top.value % bottom !== 0n) {
    return { kind: 'undefined', reason: 'the repetition groups do not divide the total evenly' };
  }
  return { kind: 'count', value: top.value / bottom };
}

/** Distinct arrangements, for small cases. A test oracle. */
export function enumerateRepeated(a: RepeatedArrangement): string[] {
  const letters = a.groups.flatMap((g) => Array.from({ length: g.count }, () => g.label));
  const seen = new Set<string>();
  const walk = (chosen: string[], remaining: string[]) => {
    if (!remaining.length) { seen.add(chosen.join('')); return; }
    for (let i = 0; i < remaining.length; i += 1) {
      walk([...chosen, remaining[i]], remaining.filter((_, j) => j !== i));
    }
  };
  walk([], letters);
  return [...seen];
}

/**
 * Arrangements with some positions already fixed. The fixed objects are
 * placed, and the rest are arranged among the positions that remain — a
 * separate demand from repeated objects, kept separate here.
 */
export type FixedPositionArrangement = { id: string; total: number; fixed: number };

export function countWithFixedPositions(a: FixedPositionArrangement): CountResult {
  for (const [label, v] of [['the total number of objects', a.total], ['the number of fixed objects', a.fixed]] as const) {
    const bad = wholeNumberErrors(label, v);
    if (bad) return { kind: 'undefined', reason: bad };
  }
  if (a.fixed > a.total) {
    return { kind: 'undefined', reason: `you cannot fix ${a.fixed} objects when there are only ${a.total}` };
  }
  return factorial(a.total - a.fixed);
}

// ---------------------------------------------------------------------------
// The stage/tree figure, derived from the stage model.
// ---------------------------------------------------------------------------

export type StageTreeSpec = {
  type: 'stage_tree';
  id: string;
  choice: StagedChoice;
  /**
   * The total as an exact decimal string, taken from the model rather than
   * typed beside it. A string because authored artifacts are fingerprinted
   * through `JSON.stringify`, which cannot serialise a bigint — and the
   * count must stay exact, so a Number is not an option either. The
   * validator recomputes from `choice`, so the string cannot drift.
   */
  totalText: string;
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export const stageTree = (id: string, choice: StagedChoice, altText: string): StageTreeSpec =>
  ({ type: 'stage_tree', id, choice, totalText: describeCount(countStaged(choice)), altText, caption: altText, status: 'verified' });

export function validateStageTree(spec: StageTreeSpec): string[] {
  const e: string[] = [];
  if (!spec.choice.stages.length) e.push('a tree needs at least one stage');
  // A drawn tree is only trustworthy if its leaves are the outcomes.
  const leaves = spec.choice.stages.reduce((n, s) => n * s.choices, 1);
  if (spec.totalText !== String(leaves)) {
    e.push('the stated total does not match the branches, so the tree would claim a count it does not show');
  }
  if (spec.choice.stages.length > 3 || leaves > 24) {
    e.push('a tree this large is unreadable; show the stages instead');
  }
  if (!spec.altText.trim()) e.push('altText is required');
  return e;
}

export type ArrangementSpec = {
  type: 'arrangement';
  id: string;
  arrangement: RepeatedArrangement;
  /** The distinct arrangements shown, from the model. */
  shown: string[];
  /** The exact total as a decimal string, for the same serialisation reason. */
  totalText: string;
  /** How many distinct arrangements there are in all. */
  totalCount: number;
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
};

export function arrangementFigure(id: string, a: RepeatedArrangement, altText: string, limit = 12): ArrangementSpec {
  const all = enumerateRepeated(a);
  const total = countRepeated(a);
  return {
    type: 'arrangement', id, arrangement: a,
    shown: all.slice(0, limit),
    totalText: describeCount(total),
    totalCount: all.length,
    altText, caption: altText, status: 'verified',
  };
}

export function validateArrangement(spec: ArrangementSpec): string[] {
  const e: string[] = [];
  if (!spec.shown.length) e.push('an arrangement figure must show at least one arrangement');
  if (new Set(spec.shown).size !== spec.shown.length) {
    e.push('the figure repeats an arrangement, which is the very overcount the lesson removes');
  }
  if (spec.totalText !== String(spec.totalCount)) {
    e.push('the stated total does not match the arrangements the model produced');
  }
  if (!spec.altText.trim()) e.push('altText is required');
  return e;
}
