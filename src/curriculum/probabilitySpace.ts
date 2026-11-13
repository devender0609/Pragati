// ===========================================================================
// v0.84.0-c11.31 checkpoint 92 — AXIOMATIC PROBABILITY OVER EVENT SETS.
//
// WHAT IS REUSED, NOT REBUILT
//
// `sampleSpace.ts` (checkpoint 10) already owns the Experiment, the Event
// as a subset, the complement, and exact Rational probability under equal
// likelihood — including the guard that REFUSES favourable-over-total when
// equal likelihood is not established. None of that is reimplemented.
//
// WHAT IS NEW
//
// Class 11 formalises probability as an assignment over outcomes satisfying
// axioms, with the classical formula DERIVED as the equally-likely case
// rather than assumed as the definition. So this file adds:
//
//   - set algebra on events: not, and, or (inclusive)
//   - exhaustive and mutually exclusive, DERIVED from the sets
//   - a probability assignment checked against the axioms
//   - event probability as the sum of its outcomes' masses
//   - the complement and addition rules, derived from the event sets
//
// Nothing here maintains a probability truth separate from the event set a
// result came from.
// ===========================================================================

import {
  type Event, type Experiment, type Rational, complement as spaceComplement,
  eventSize, formatRational, isSubsetOfSampleSpace, rational, sampleSpaceSize,
  toNumber,
} from './sampleSpace';

// ---------------------------------------------------------------------------
// Exact rational helpers. Probabilities are exact; 1/6 is not 0.1666…
// ---------------------------------------------------------------------------

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const reduce = (num: number, den: number): Rational => {
  if (den === 0) throw new Error('a probability cannot have a zero denominator');
  const g = gcd(Math.abs(num), Math.abs(den)) || 1;
  const s = den < 0 ? -1 : 1;
  return { num: (num / g) * s, den: Math.abs(den / g) };
};
export const addRationals = (a: Rational, b: Rational): Rational =>
  reduce(a.num * b.den + b.num * a.den, a.den * b.den);
export const subtractRationals = (a: Rational, b: Rational): Rational =>
  reduce(a.num * b.den - b.num * a.den, a.den * b.den);
export const rationalsEqual = (a: Rational, b: Rational): boolean =>
  a.num * b.den === b.num * a.den;

// ---------------------------------------------------------------------------
// Event algebra. "or" is INCLUSIVE — the overlap belongs to it.
// ---------------------------------------------------------------------------

const canonical = (xs: string[]): string[] => [...new Set(xs)].sort();

/** NOT A — the complement, which needs a sample space to be taken against. */
export function notEvent(exp: Experiment, a: Event): Event {
  if (!isSubsetOfSampleSpace(exp, a)) {
    throw new Error(`event "${a.id}" contains an outcome outside the sample space, so it has no complement here`);
  }
  return spaceComplement(exp, a);
}

/** A AND B — the intersection. */
export function andEvent(exp: Experiment, a: Event, b: Event): Event {
  for (const e of [a, b]) {
    if (!isSubsetOfSampleSpace(exp, e)) {
      throw new Error(`event "${e.id}" contains an outcome outside the sample space`);
    }
  }
  return {
    id: `${a.id}_and_${b.id}`, experimentId: exp.id,
    description: `both ${a.description} and ${b.description}`,
    outcomes: canonical(a.outcomes.filter((o) => b.outcomes.includes(o))),
  };
}

/**
 * A OR B — the union, inclusive. An outcome in both events is in the union
 * once, which is exactly why the addition rule has to subtract the overlap.
 */
export function orEvent(exp: Experiment, a: Event, b: Event): Event {
  for (const e of [a, b]) {
    if (!isSubsetOfSampleSpace(exp, e)) {
      throw new Error(`event "${e.id}" contains an outcome outside the sample space`);
    }
  }
  return {
    id: `${a.id}_or_${b.id}`, experimentId: exp.id,
    description: `${a.description} or ${b.description}, or both`,
    outcomes: canonical([...a.outcomes, ...b.outcomes]),
  };
}

// ---------------------------------------------------------------------------
// Exhaustive and mutually exclusive — DERIVED, never labelled.
// ---------------------------------------------------------------------------

/** Exhaustive: the union of the events is the whole sample space. */
export function isExhaustive(exp: Experiment, events: Event[]): boolean {
  const covered = new Set(events.flatMap((e) => e.outcomes));
  return exp.outcomes.every((o) => covered.has(o));
}

/** Mutually exclusive: no two of them share an outcome. */
export function isMutuallyExclusive(events: Event[]): boolean {
  for (let i = 0; i < events.length; i += 1) {
    for (let j = i + 1; j < events.length; j += 1) {
      if (events[i].outcomes.some((o) => events[j].outcomes.includes(o))) return false;
    }
  }
  return true;
}

/** Both properties reported together, because they are independent of each other. */
export const classifyEvents = (exp: Experiment, events: Event[]) => ({
  exhaustive: isExhaustive(exp, events),
  mutuallyExclusive: isMutuallyExclusive(events),
});

// ---------------------------------------------------------------------------
// The probability assignment, and its axioms.
// ---------------------------------------------------------------------------

/**
 * A probability assignment: one exact mass per elementary outcome. This is
 * the Class 11 move — probability is assigned and constrained by axioms,
 * and the classical formula falls out of the equally-likely case.
 */
export type ProbabilityAssignment = {
  id: string;
  experimentId: string;
  /** One entry per outcome of the sample space. */
  masses: Array<{ outcome: string; p: Rational }>;
};

export type AssignmentCheck =
  | { kind: 'valid' }
  | { kind: 'invalid'; problems: string[] };

/**
 * The source's axioms, checked rather than assumed:
 *   each P(outcome) is at least 0, and the masses total exactly 1.
 *
 * An invalid assignment is REFUSED. Clamping a negative mass to zero, or
 * scaling a total of 0.9 up to 1, would silently repair something a student
 * needs to see rejected.
 */
export function checkAssignment(exp: Experiment, a: ProbabilityAssignment): AssignmentCheck {
  const problems: string[] = [];
  const named = a.masses.map((m) => m.outcome);
  for (const o of exp.outcomes) {
    if (!named.includes(o)) problems.push(`outcome "${o}" has been given no probability`);
  }
  for (const o of named) {
    if (!exp.outcomes.includes(o)) problems.push(`"${o}" is not an outcome of this experiment`);
  }
  if (new Set(named).size !== named.length) {
    problems.push('an outcome has been given a probability twice');
  }
  for (const m of a.masses) {
    if (toNumber(m.p) < 0) problems.push(`"${m.outcome}" has a negative probability, which the axioms forbid`);
    if (toNumber(m.p) > 1) problems.push(`"${m.outcome}" has a probability above 1, which the axioms forbid`);
  }
  const total = a.masses.reduce((acc, m) => addRationals(acc, m.p), rational(0, 1));
  if (!rationalsEqual(total, rational(1, 1))) {
    problems.push(`the probabilities total ${formatRational(total)}, not 1`);
  }
  return problems.length ? { kind: 'invalid', problems } : { kind: 'valid' };
}

/**
 * P(E) as the sum of the masses of the outcomes IN E. The event's
 * probability is therefore a consequence of which outcomes it contains —
 * change the event and the probability follows.
 */
export function probabilityOf(exp: Experiment, a: ProbabilityAssignment, ev: Event): Rational {
  const check = checkAssignment(exp, a);
  if (check.kind === 'invalid') {
    throw new Error(`the assignment is not a probability assignment: ${check.problems[0]}`);
  }
  if (!isSubsetOfSampleSpace(exp, ev)) {
    throw new Error(`event "${ev.id}" contains an outcome outside the sample space`);
  }
  return ev.outcomes.reduce(
    (acc, o) => addRationals(acc, a.masses.find((m) => m.outcome === o)!.p),
    rational(0, 1)
  );
}

/**
 * The equally-likely assignment: each of n outcomes gets 1/n.
 *
 * Built only when the experiment ESTABLISHES equal likelihood, so the
 * classical formula stays a derived special case rather than a default.
 */
export function equallyLikelyAssignment(exp: Experiment): ProbabilityAssignment {
  if (exp.equallyLikely === null) {
    throw new Error(
      `experiment "${exp.id}" does not establish equally likely outcomes, so each outcome cannot be given 1/n`
    );
  }
  const n = sampleSpaceSize(exp);
  return {
    id: `${exp.id}_equally_likely`, experimentId: exp.id,
    masses: exp.outcomes.map((o) => ({ outcome: o, p: rational(1, n) })),
  };
}

/**
 * Evidence that favourable-over-total is the equally-likely case of the
 * axiomatic model, rather than a separate rule: the two agree.
 */
export const classicalAgreesWithAssignment = (exp: Experiment, ev: Event): boolean =>
  rationalsEqual(
    probabilityOf(exp, equallyLikelyAssignment(exp), ev),
    rational(eventSize(ev), sampleSpaceSize(exp))
  );

// ---------------------------------------------------------------------------
// The rules, derived from the event sets.
// ---------------------------------------------------------------------------

/**
 * P(not A) = 1 − P(A), because A and its complement are mutually exclusive
 * and together exhaust the sample space. Derived from that partition rather
 * than stated.
 */
export function complementRule(exp: Experiment, a: ProbabilityAssignment, ev: Event): {
  pEvent: Rational; pComplement: Rational; partitions: boolean; totalsOne: boolean;
} {
  const not = notEvent(exp, ev);
  const pEvent = probabilityOf(exp, a, ev);
  const pComplement = probabilityOf(exp, a, not);
  const { exhaustive, mutuallyExclusive } = classifyEvents(exp, [ev, not]);
  return {
    pEvent, pComplement,
    partitions: exhaustive && mutuallyExclusive,
    totalsOne: rationalsEqual(addRationals(pEvent, pComplement), rational(1, 1)),
  };
}

/**
 * P(A or B) = P(A) + P(B) − P(A and B).
 *
 * The subtraction is not a correction bolted on: adding P(A) and P(B)
 * counts every outcome of the overlap twice, so the overlap is removed
 * once. When the events are mutually exclusive the overlap is empty and
 * the subtraction takes nothing away — the simple form is a SPECIAL CASE,
 * not the rule.
 */
export function additionRule(exp: Experiment, a: ProbabilityAssignment, x: Event, y: Event): {
  pX: Rational; pY: Rational; pBoth: Rational; pEither: Rational;
  mutuallyExclusive: boolean; derivedMatchesDirect: boolean;
} {
  const both = andEvent(exp, x, y);
  const either = orEvent(exp, x, y);
  const pX = probabilityOf(exp, a, x);
  const pY = probabilityOf(exp, a, y);
  const pBoth = probabilityOf(exp, a, both);
  const pEither = probabilityOf(exp, a, either);
  const derived = subtractRationals(addRationals(pX, pY), pBoth);
  return {
    pX, pY, pBoth, pEither,
    mutuallyExclusive: isMutuallyExclusive([x, y]),
    // The rule's answer must equal the probability of the union event
    // itself — one truth, reached two ways.
    derivedMatchesDirect: rationalsEqual(derived, pEither),
  };
}

export const show = (r: Rational): string => formatRational(r);
