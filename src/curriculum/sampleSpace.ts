// ===========================================================================
// v0.84.0-c10.11 checkpoint 65 — ONE EXPERIMENT, ONE SAMPLE SPACE.
//
// A probability lesson can be arithmetically perfect and mathematically
// false. Checkpoint 39 built a PROSE audit for that: it catches a sentence
// inferring probability from a count of labels. What it cannot catch is a
// lesson whose numbers drift — an event counted as 4 favourable outcomes
// while the listed set holds 3, or a complement written out by hand that no
// longer matches the event it complements.
//
// So the experiment is ONE object. The sample space is authored; the event
// is a SUBSET of it; the favourable count, the complement, the probability
// and the complement's probability are all derived. Changing the event
// changes its complement automatically, because the complement is computed
// from S and E rather than typed.
//
// Two commitments:
//
//   * Equal likelihood is an ASSUMPTION the experiment must carry, not an
//     inference from |S|. `probability` refuses to compute at all unless
//     `equallyLikely` is justified, because favourable-over-total is not
//     universally valid and a model that computes it silently teaches that
//     it is.
//
//   * Probabilities are exact rationals. 1/3 stays 1/3.
//
// Deliberately NOT built: weighted outcomes, conditional probability,
// independence, or any distribution engine. The current scope is the
// classical definition with simple problems, and a model that could express
// more would invite lessons that do.
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
/** A decimal for a lesson to quote, explicitly rounded and marked as such. */
export function approxDecimal(r: Rational, places = 3): string {
  return toNumber(r).toFixed(places).replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * A finite experiment. `outcomes` are the ELEMENTARY outcomes, each distinct
 * — for two coins that is HH, HT, TH, TT, not "one head and one tail".
 */
export type Experiment = {
  id: string;
  /** What is done, e.g. 'two fair coins are tossed together'. */
  description: string;
  /** The sample space S, as distinct elementary outcome labels. */
  outcomes: string[];
  /**
   * Why the elementary outcomes may be treated as equally likely. A model
   * assumption about an idealised object, never a claim that a physical
   * coin is exactly fair. Null means the assumption is NOT established, and
   * classical probability is then unavailable.
   */
  equallyLikely: string | null;
};

/** An event: a named subset of one experiment's sample space. */
export type Event = {
  id: string;
  /** Which experiment this event belongs to. */
  experimentId: string;
  description: string;
  /** The outcomes in the event. Must all lie in the sample space. */
  outcomes: string[];
};

export const sampleSpaceSize = (e: Experiment) => e.outcomes.length;

export function eventSize(ev: Event): number {
  return ev.outcomes.length;
}

/** Is every outcome of the event in the sample space? */
export function isSubsetOfSampleSpace(exp: Experiment, ev: Event): boolean {
  const s = new Set(exp.outcomes);
  return ev.outcomes.every((o) => s.has(o));
}

/**
 * The complement, DERIVED as S \ E. Never authored, so it cannot fall out
 * of step with the event it complements.
 */
export function complement(exp: Experiment, ev: Event): Event {
  const inE = new Set(ev.outcomes);
  return {
    id: `${ev.id}__complement`,
    experimentId: exp.id,
    description: `not ${ev.description}`,
    outcomes: exp.outcomes.filter((o) => !inE.has(o)),
  };
}

/** E and its complement partition S: union is S, intersection is empty. */
export function partitionsSampleSpace(exp: Experiment, ev: Event): boolean {
  const c = complement(exp, ev);
  const union = new Set([...ev.outcomes, ...c.outcomes]);
  const intersection = ev.outcomes.filter((o) => c.outcomes.includes(o));
  return union.size === exp.outcomes.length
    && exp.outcomes.every((o) => union.has(o))
    && intersection.length === 0;
}

/**
 * Are two events complementary? Being disjoint is not enough, and neither
 * is there being two of them: together they must also cover S.
 */
export function areComplementary(exp: Experiment, a: Event, b: Event): boolean {
  const overlap = a.outcomes.filter((o) => b.outcomes.includes(o));
  if (overlap.length > 0) return false;
  const union = new Set([...a.outcomes, ...b.outcomes]);
  return union.size === exp.outcomes.length && exp.outcomes.every((o) => union.has(o));
}

/**
 * Classical probability — available ONLY when equal likelihood is
 * established. Refusing to compute otherwise is the point: a model that
 * returned |E|/|S| regardless would make favourable-over-total look
 * universally valid.
 */
export function probability(exp: Experiment, ev: Event): Rational {
  if (exp.equallyLikely === null) {
    throw new Error(
      `experiment "${exp.id}" does not establish that its outcomes are equally likely, so favourable over total does not apply`
    );
  }
  if (!isSubsetOfSampleSpace(exp, ev)) {
    throw new Error(`event "${ev.id}" contains an outcome outside the sample space`);
  }
  return rational(eventSize(ev), sampleSpaceSize(exp));
}

export const isImpossible = (ev: Event) => ev.outcomes.length === 0;
export const isSure = (exp: Experiment, ev: Event) =>
  ev.outcomes.length === exp.outcomes.length && isSubsetOfSampleSpace(exp, ev);

export function validateExperiment(exp: Experiment): string[] {
  const errs: string[] = [];
  if (exp.outcomes.length === 0) errs.push('an experiment needs at least one outcome');
  const seen = new Set<string>();
  for (const o of exp.outcomes) {
    if (seen.has(o)) errs.push(`outcome "${o}" is listed twice; elementary outcomes must be distinct`);
    seen.add(o);
    if (!o.trim()) errs.push('an outcome label is empty');
  }
  if (!exp.description.trim()) errs.push('the experiment needs a description');
  return errs;
}

export function validateEvent(exp: Experiment, ev: Event): string[] {
  const errs = [...validateExperiment(exp)];
  if (ev.experimentId !== exp.id) errs.push(`event "${ev.id}" belongs to a different experiment`);
  const s = new Set(exp.outcomes);
  for (const o of ev.outcomes) {
    if (!s.has(o)) errs.push(`event "${ev.id}" contains "${o}", which is not in the sample space`);
  }
  const seen = new Set<string>();
  for (const o of ev.outcomes) {
    if (seen.has(o)) errs.push(`event "${ev.id}" lists "${o}" twice`);
    seen.add(o);
  }
  if (eventSize(ev) > sampleSpaceSize(exp)) errs.push('the favourable count exceeds the sample-space size');
  // Checkpoint 61 taught this: a validator must REPORT, never throw. If the
  // event is not a subset, the errors above already say so, and computing a
  // probability from it would raise instead of returning them.
  if (exp.equallyLikely !== null && isSubsetOfSampleSpace(exp, ev) && errs.length === 0) {
    const p = probability(exp, ev);
    const v = toNumber(p);
    if (v < 0 || v > 1) errs.push(`probability ${formatRational(p)} lies outside 0 to 1`);
    if (!partitionsSampleSpace(exp, ev)) errs.push('the event and its complement do not partition the sample space');
    const pc = probability(exp, complement(exp, ev));
    if (toNumber(p) + toNumber(pc) !== 1) errs.push('the event and complement probabilities do not sum to 1');
  }
  return errs;
}

/**
 * Reconcile a count stated in prose against the model, so "6 favourable
 * outcomes" cannot survive a change to the event.
 */
export function statedCountMatches(actual: number, stated: number): boolean {
  return actual === stated;
}
