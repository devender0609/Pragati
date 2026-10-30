// ===========================================================================
// v0.84.0-c11.7 checkpoint 78 — SETS AS OBJECTS.
//
// THE QUESTION THIS ANSWERS
//
// Can Pragati model a set once — its members, its universe, its containment
// and its operations — and derive the notation, the Venn region and the
// counting consequence from that same object?
//
// Before this module the answer was no. A lesson could print "A u B" in one
// place, shade a region in a figure, and state n(A u B) = 11 in a third, and
// nothing could tell whether the three agreed. Three independent authored
// claims about one piece of mathematics.
//
// WHY NOT AN ARRAY
//
// The obvious representation is `elements: string[]`. It cannot truthfully
// hold R, an interval, or a set given by a rule, and it makes {1,2,3} and
// {3,2,1,1} different objects when they are the same set. So a set here is a
// tagged union: explicit members, an interval over the reals, or a described
// rule. Operations compute where the structure supports it and REFUSE where
// it does not, rather than guessing — the same refusal `sampleSpace` makes
// when equal likelihood is not established.
//
// NOT CHAPTER-1-SPECIFIC
//
// Chapter 2 needs relations as subsets of a product; Chapter 14 needs events
// as subsets with union, intersection and complement. Both are this model
// with different element types, so nothing here mentions Chapter 1.
// ===========================================================================

/** A member of an explicit set. Order and repetition are not identity. */
export type Member = string | number;

export type ExplicitSet = {
  kind: 'explicit';
  id: string;
  label: string;
  /** As authored. Duplicates and order are display facts, never identity. */
  members: Member[];
  description?: string;
};

/** An interval of the reals. Endpoint inclusion is structured, not punctuation. */
export type IntervalSet = {
  kind: 'interval';
  id: string;
  label: string;
  low: number;
  high: number;
  lowClosed: boolean;
  highClosed: boolean;
  description?: string;
};

/**
 * A set the source describes by a rule, where no finite structure is given.
 * It carries a name and a description and nothing else, because claiming to
 * compute with it would be a lie. `finiteness` is the one mathematical fact
 * the source does state.
 */
export type DescribedSet = {
  kind: 'described';
  id: string;
  label: string;
  description: string;
  finiteness: 'finite' | 'infinite';
};

export type MathSet = ExplicitSet | IntervalSet | DescribedSet;

/** A universe, needed before any complement may be taken. */
export type Universe = ExplicitSet;

// ---------------------------------------------------------------------------
// Identity: membership, not order, not repetition, not typography.
// ---------------------------------------------------------------------------

export const canonicalMembers = (s: ExplicitSet): Member[] => {
  const seen: Member[] = [];
  for (const m of s.members) if (!seen.includes(m)) seen.push(m);
  return [...seen].sort((a, b) =>
    typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))
  );
};

export function isMember(s: MathSet, x: Member): boolean {
  if (s.kind === 'explicit') return s.members.includes(x);
  if (s.kind === 'interval') {
    if (typeof x !== 'number') return false;
    const aboveLow = s.lowClosed ? x >= s.low : x > s.low;
    const belowHigh = s.highClosed ? x <= s.high : x < s.high;
    return aboveLow && belowHigh;
  }
  throw new Error(
    `membership in "${s.label}" is not computable: it is given by a rule, not by structure`
  );
}

export const isComputable = (s: MathSet): s is ExplicitSet | IntervalSet =>
  s.kind === 'explicit' || s.kind === 'interval';

/** Two explicit sets are equal when each contains every member of the other. */
export function setsEqual(a: ExplicitSet, b: ExplicitSet): boolean {
  const ca = canonicalMembers(a), cb = canonicalMembers(b);
  return ca.length === cb.length && ca.every((m, i) => m === cb[i]);
}

export const isEmpty = (s: ExplicitSet): boolean => canonicalMembers(s).length === 0;

/** Cardinality counts distinct members. A roster that repeats does not inflate it. */
export function cardinality(s: MathSet): number {
  if (s.kind !== 'explicit') {
    throw new Error(`"${s.label}" has no finite cardinality in this model`);
  }
  return canonicalMembers(s).length;
}

export function isFinite_(s: MathSet): boolean {
  if (s.kind === 'explicit') return true;
  if (s.kind === 'interval') return false;
  return s.finiteness === 'finite';
}

// ---------------------------------------------------------------------------
// Containment.
// ---------------------------------------------------------------------------

export function isSubset(a: ExplicitSet, b: ExplicitSet): boolean {
  return canonicalMembers(a).every((m) => isMember(b, m));
}

/**
 * Proper subset in the convention this source uses: contained AND not equal.
 * The symbol question is settled by the frozen notation evidence rather than
 * by general convention, which differs between textbooks.
 */
export function isProperSubset(a: ExplicitSet, b: ExplicitSet): boolean {
  return isSubset(a, b) && !setsEqual(a, b);
}

// ---------------------------------------------------------------------------
// Operations. Each derives from membership; none is authored independently.
// ---------------------------------------------------------------------------

const derived = (id: string, label: string, members: Member[]): ExplicitSet =>
  ({ kind: 'explicit', id, label, members });

/** Inclusive or: a member of A, or of B, or of both. */
export function union(a: ExplicitSet, b: ExplicitSet): ExplicitSet {
  return derived(`${a.id}_u_${b.id}`, `${a.label} \u222a ${b.label}`,
    [...canonicalMembers(a), ...canonicalMembers(b)]);
}

export function intersection(a: ExplicitSet, b: ExplicitSet): ExplicitSet {
  return derived(`${a.id}_n_${b.id}`, `${a.label} \u2229 ${b.label}`,
    canonicalMembers(a).filter((m) => isMember(b, m)));
}

/** A minus B: in A and not in B. Not commutative. */
export function difference(a: ExplicitSet, b: ExplicitSet): ExplicitSet {
  return derived(`${a.id}_d_${b.id}`, `${a.label} \u2212 ${b.label}`,
    canonicalMembers(a).filter((m) => !isMember(b, m)));
}

/**
 * Complement, which REQUIRES a universe and throws without one. The same set
 * has different complements under different universes, and a model that let
 * you take a complement with no universe would hide that.
 */
export function complement(u: Universe | undefined, a: ExplicitSet): ExplicitSet {
  if (!u) {
    throw new Error(
      `the complement of "${a.label}" is not defined without a universal set`
    );
  }
  if (!isSubset(a, u)) {
    throw new Error(`"${a.label}" is not a subset of the universal set "${u.label}"`);
  }
  return derived(`${a.id}_c`, `${a.label}\u2032`, canonicalMembers(difference(u, a)));
}

// ---------------------------------------------------------------------------
// Venn regions. A region knows which set expression it is.
// ---------------------------------------------------------------------------

export type RegionExpression =
  | 'A_only' | 'B_only' | 'A_and_B' | 'A_or_B'
  | 'A_minus_B' | 'B_minus_A' | 'A_complement' | 'B_complement'
  | 'outside_both' | 'universe';

export const REGION_NOTATION: Record<RegionExpression, string> = {
  A_only: 'A \u2212 B', B_only: 'B \u2212 A', A_and_B: 'A \u2229 B', A_or_B: 'A \u222a B',
  A_minus_B: 'A \u2212 B', B_minus_A: 'B \u2212 A', A_complement: 'A\u2032',
  B_complement: 'B\u2032', outside_both: '(A \u222a B)\u2032', universe: 'U',
};

/** The members a named region actually contains, computed from the sets. */
export function regionMembers(
  expr: RegionExpression, a: ExplicitSet, b: ExplicitSet, u?: Universe
): Member[] {
  switch (expr) {
    case 'A_only': case 'A_minus_B': return canonicalMembers(difference(a, b));
    case 'B_only': case 'B_minus_A': return canonicalMembers(difference(b, a));
    case 'A_and_B': return canonicalMembers(intersection(a, b));
    case 'A_or_B': return canonicalMembers(union(a, b));
    case 'A_complement': return canonicalMembers(complement(u, a));
    case 'B_complement': return canonicalMembers(complement(u, b));
    case 'outside_both': return canonicalMembers(complement(u, union(a, b)));
    case 'universe':
      if (!u) throw new Error('the universe region needs a universal set');
      return canonicalMembers(u);
  }
}

/**
 * A two-set Venn figure. The shaded region is named by its EXPRESSION, so the
 * picture and the prose cannot drift: shading is a rendering of the
 * expression, never an independent authored claim.
 */
export type VennSpec = {
  /** `type` matches the discriminant every other VisualSpec uses. */
  type: 'venn';
  id: string;
  universeLabel: string;
  aLabel: string;
  bLabel: string;
  shaded: RegionExpression[];
  /** Written for a reader who cannot see the figure. It must name the
   *  universe, both sets, and which region is shaded and why. */
  description: string;
  /** The shared VisualSpec contract. */
  altText: string;
  caption: string;
  status: 'verified' | 'unverified';
  /** Present only when the figure shows members rather than regions alone. */
  showMembers?: boolean;
};

export function validateVenn(
  v: VennSpec, a: ExplicitSet, b: ExplicitSet, u?: Universe
): string[] {
  const e: string[] = [];
  if (v.aLabel !== a.label) e.push(`figure labels A as "${v.aLabel}" but the set is "${a.label}"`);
  if (v.bLabel !== b.label) e.push(`figure labels B as "${v.bLabel}" but the set is "${b.label}"`);
  if (!v.shaded.length) e.push('no region is shaded, so the figure claims nothing');
  const needsU = v.shaded.some((r) =>
    r === 'A_complement' || r === 'B_complement' || r === 'outside_both' || r === 'universe');
  if (needsU && !u) e.push('a shaded complement region requires a universal set');
  if (u && !isSubset(a, u)) e.push(`"${a.label}" is not a subset of the universe`);
  if (u && !isSubset(b, u)) e.push(`"${b.label}" is not a subset of the universe`);
  for (const r of v.shaded) {
    try { regionMembers(r, a, b, u); }
    catch (err) { e.push(`region ${r}: ${(err as Error).message}`); }
  }
  if (!/\b(shade|region|inside|outside|overlap)/i.test(v.description)) {
    e.push('the description does not say which region is shaded');
  }
  return e;
}

/** What a shaded figure asserts, in notation, so prose can be checked against it. */
export const shadedNotation = (v: VennSpec): string =>
  v.shaded.map((r) => REGION_NOTATION[r]).join(' and ');

// ---------------------------------------------------------------------------
// Two-set counting, derived from region accounting rather than stated.
// ---------------------------------------------------------------------------

export type TwoSetCount = {
  onlyA: number; onlyB: number; both: number; union: number;
  outside: number | null; totalA: number; totalB: number;
};

export function twoSetCount(a: ExplicitSet, b: ExplicitSet, u?: Universe): TwoSetCount {
  const both = cardinality(intersection(a, b));
  const onlyA = cardinality(difference(a, b));
  const onlyB = cardinality(difference(b, a));
  return {
    onlyA, onlyB, both,
    union: onlyA + onlyB + both,
    outside: u ? cardinality(u) - (onlyA + onlyB + both) : null,
    totalA: cardinality(a), totalB: cardinality(b),
  };
}

/**
 * The inclusion-exclusion relation, checked rather than asserted: adding the
 * two totals counts the overlap twice, so it is subtracted once.
 */
export function countingRelationHolds(a: ExplicitSet, b: ExplicitSet): boolean {
  const c = twoSetCount(a, b);
  return c.totalA + c.totalB - c.both === c.union;
}

// ---------------------------------------------------------------------------
// Intervals.
// ---------------------------------------------------------------------------

export function formatInterval(i: IntervalSet): string {
  return `${i.lowClosed ? '[' : '('}${i.low}, ${i.high}${i.highClosed ? ']' : ')'}`;
}

export function validateInterval(i: IntervalSet): string[] {
  const e: string[] = [];
  if (!(i.low < i.high)) e.push(`endpoints out of order: ${i.low} is not below ${i.high}`);
  if (!Number.isFinite(i.low) || !Number.isFinite(i.high)) e.push('endpoints must be real numbers');
  return e;
}

// ---------------------------------------------------------------------------
// De Morgan, evaluated on both sides rather than quoted.
// ---------------------------------------------------------------------------

export function deMorganUnionHolds(u: Universe, a: ExplicitSet, b: ExplicitSet): boolean {
  return setsEqual(complement(u, union(a, b)), intersection(complement(u, a), complement(u, b)));
}

export function deMorganIntersectionHolds(u: Universe, a: ExplicitSet, b: ExplicitSet): boolean {
  return setsEqual(complement(u, intersection(a, b)), union(complement(u, a), complement(u, b)));
}

/** Roster rendering, always from canonical members. */
export const roster = (s: ExplicitSet): string =>
  `{${canonicalMembers(s).join(', ')}}`;

export const EMPTY_SET_SYMBOL = '\u2205';
