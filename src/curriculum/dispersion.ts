// ===========================================================================
// v0.84.0-c11.33 checkpoint 93 — MEASURES OF DISPERSION.
//
// WHAT IS REUSED
//
// `groupedDistribution.ts` already owns ClassInterval, class marks, class
// width, total frequency, Σfx, and the direct / assumed-mean /
// step-deviation means. None of it is forked, and none of its Class 10
// outputs change: this file only ADDS dispersion operators on top.
//
// WHAT IS NEW
//
// Ungrouped data is its own model. Forcing individual observations into
// one-point class intervals to reuse grouped code would invent class marks
// and widths that the data does not have, so `NumericDataset` is a small
// honest model of its own, and the dispersion operators are shared where
// the mathematics genuinely is shared.
//
// ONE DATASET, EVERY COLUMN DERIVED. No lesson types a deviation, an
// absolute deviation, a squared deviation, a variance or a standard
// deviation; they all come from here.
// ===========================================================================

import {
  type GroupedDistribution, classMark, classWidth, directMean, totalFrequency,
} from './groupedDistribution';

// ---------------------------------------------------------------------------
// Ungrouped data: a list of individual observations.
// ---------------------------------------------------------------------------

export type NumericDataset = {
  id: string;
  label: string;
  observations: number[];
  /** The unit of measurement, if the data has one. Variance carries unit². */
  unit?: string;
};

export function dataset(id: string, label: string, observations: number[], unit?: string): NumericDataset {
  if (!observations.length) throw new Error(`dataset "${id}" has no observations, so it has no spread to measure`);
  return { id, label, observations: [...observations], unit };
}

export const mean = (d: NumericDataset): number =>
  d.observations.reduce((a, b) => a + b, 0) / d.observations.length;

/** The median, by the source's convention for an even count: the mean of the middle two. */
export function median(d: NumericDataset): number {
  const s = [...d.observations].sort((a, b) => a - b);
  const n = s.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// ---------------------------------------------------------------------------
// Range — and its limitation.
// ---------------------------------------------------------------------------

export type Range = { min: number; max: number; value: number };

export function range(d: NumericDataset): Range {
  const min = Math.min(...d.observations);
  const max = Math.max(...d.observations);
  return { min, max, value: max - min };
}

/**
 * Two datasets can share a range while differing completely inside it.
 * This is the limitation made checkable rather than merely asserted.
 */
export const sameRangeDifferentSpread = (a: NumericDataset, b: NumericDataset): boolean =>
  range(a).value === range(b).value && range(a).min === range(b).min
  && meanDeviationAbout(a, 'mean').value !== meanDeviationAbout(b, 'mean').value;

// ---------------------------------------------------------------------------
// Mean deviation — ONE operator, with the centre as a parameter.
// ---------------------------------------------------------------------------

export type Centre = 'mean' | 'median';

export type DeviationRow = { x: number; deviation: number; absolute: number };
export type MeanDeviation = {
  centre: Centre; centreValue: number; rows: DeviationRow[];
  totalAbsolute: number; value: number;
};

/**
 * Mean deviation about a declared centre. "About the mean" and "about the
 * median" are the SAME operation with a different centre — not two
 * algorithms — which is why STA-03 and STA-04 share this one function.
 *
 * The absolute value is taken per row. Signed deviations about the mean
 * always total zero, so skipping it would report every dataset as having
 * no spread at all.
 */
export function meanDeviationAbout(d: NumericDataset, centre: Centre): MeanDeviation {
  const centreValue = centre === 'mean' ? mean(d) : median(d);
  const rows: DeviationRow[] = d.observations.map((x) => ({
    x, deviation: x - centreValue, absolute: Math.abs(x - centreValue),
  }));
  const totalAbsolute = rows.reduce((a, r) => a + r.absolute, 0);
  return { centre, centreValue, rows, totalAbsolute, value: totalAbsolute / rows.length };
}

/** The sum of SIGNED deviations about the mean, which is always zero. */
export const signedDeviationTotal = (d: NumericDataset, centre: Centre): number =>
  meanDeviationAbout(d, centre).rows.reduce((a, r) => a + r.deviation, 0);

// ---------------------------------------------------------------------------
// Variance and standard deviation — squared, never absolute.
// ---------------------------------------------------------------------------

export type SquaredRow = { x: number; deviation: number; squared: number };
export type Variance = {
  mean: number; rows: SquaredRow[]; totalSquared: number;
  /** n, the source's denominator for descriptive statistics. NEVER n − 1. */
  denominator: number; variance: number; standardDeviation: number;
};

export function varianceOf(d: NumericDataset): Variance {
  const m = mean(d);
  const rows: SquaredRow[] = d.observations.map((x) => ({ x, deviation: x - m, squared: (x - m) ** 2 }));
  const totalSquared = rows.reduce((a, r) => a + r.squared, 0);
  // The source divides by n. The n − 1 of inferential statistics is a
  // different quantity answering a different question, and is not used here.
  const denominator = d.observations.length;
  const variance = totalSquared / denominator;
  return { mean: m, rows, totalSquared, denominator, variance, standardDeviation: Math.sqrt(variance) };
}

// ---------------------------------------------------------------------------
// Grouped data — frequency-weighted, reusing the Class 10 model.
// ---------------------------------------------------------------------------

export type GroupedRow = {
  label: string; x: number; f: number; deviation: number; absolute: number;
  weightedAbsolute: number; squared: number; weightedSquared: number;
};
export type GroupedDispersion = {
  centre: Centre; centreValue: number; rows: GroupedRow[]; totalFrequency: number;
  totalWeightedAbsolute: number; meanDeviation: number;
  totalWeightedSquared: number; variance: number; standardDeviation: number;
};

/** The representative value of a row: the class mark, from the shared model. */
const representative = (d: GroupedDistribution, i: number): number => classMark(d.intervals[i]);

/**
 * Grouped dispersion. Every row is weighted by its frequency — an
 * unweighted version would treat a class holding forty observations the
 * same as one holding two.
 */
export function groupedDispersion(d: GroupedDistribution, centre: Centre): GroupedDispersion {
  const n = totalFrequency(d);
  const centreValue = centre === 'mean' ? directMean(d) : groupedMedianValue(d);
  const rows: GroupedRow[] = d.intervals.map((iv, i) => {
    const x = representative(d, i);
    const deviation = x - centreValue;
    const absolute = Math.abs(deviation);
    const squared = deviation ** 2;
    return {
      label: `${iv.lower}–${iv.upper}`, x, f: iv.frequency, deviation, absolute,
      weightedAbsolute: iv.frequency * absolute, squared, weightedSquared: iv.frequency * squared,
    };
  });
  const totalWeightedAbsolute = rows.reduce((a, r) => a + r.weightedAbsolute, 0);
  const totalWeightedSquared = rows.reduce((a, r) => a + r.weightedSquared, 0);
  const variance = totalWeightedSquared / n;
  return {
    centre, centreValue, rows, totalFrequency: n,
    totalWeightedAbsolute, meanDeviation: totalWeightedAbsolute / n,
    totalWeightedSquared, variance, standardDeviation: Math.sqrt(variance),
  };
}

/** The median of a grouped distribution by its class marks, for MD about median. */
function groupedMedianValue(d: GroupedDistribution): number {
  const expanded = expandToObservations(d);
  return median(dataset('tmp', 'tmp', expanded));
}

/**
 * Expand a frequency distribution into repeated observations. This is the
 * INDEPENDENT ORACLE: for whole-number frequencies the grouped formula and
 * the ungrouped computation over the expanded data must agree, and the
 * grouped formula is never used to verify itself.
 */
export function expandToObservations(d: GroupedDistribution): number[] {
  const out: number[] = [];
  d.intervals.forEach((iv, i) => {
    const x = representative(d, i);
    for (let k = 0; k < iv.frequency; k += 1) out.push(x);
  });
  return out;
}

// ---------------------------------------------------------------------------
// The shortcut method — an alternate route, not a second truth.
// ---------------------------------------------------------------------------

export type Shortcut =
  | {
      kind: 'computed'; assumed: number; width: number;
      rows: Array<{ label: string; x: number; f: number; u: number; fu: number; fu2: number }>;
      sumFu: number; sumFu2: number; variance: number; standardDeviation: number;
    }
  | { kind: 'unavailable'; reason: string };

/**
 * Variance and standard deviation by step deviations u = (x − a)/h.
 *
 * It must agree with the direct method — it is the same quantity reached
 * another way. If the class width is not common, h does not exist and the
 * method is REFUSED rather than given an invented h.
 */
export function shortcutVariance(d: GroupedDistribution, assumed: number): Shortcut {
  const h = classWidth(d);
  if (h === null || h === 0) {
    return { kind: 'unavailable', reason: 'the classes do not share a common width, so there is no step size h to divide by' };
  }
  const n = totalFrequency(d);
  const rows = d.intervals.map((iv, i) => {
    const x = representative(d, i);
    const u = (x - assumed) / h;
    return { label: `${iv.lower}–${iv.upper}`, x, f: iv.frequency, u, fu: iv.frequency * u, fu2: iv.frequency * u * u };
  });
  const sumFu = rows.reduce((a, r) => a + r.fu, 0);
  const sumFu2 = rows.reduce((a, r) => a + r.fu2, 0);
  // σ² = h² [ Σfu²/n − (Σfu/n)² ]
  const variance = h * h * (sumFu2 / n - (sumFu / n) ** 2);
  return { kind: 'computed', assumed, width: h, rows, sumFu, sumFu2, variance, standardDeviation: Math.sqrt(variance) };
}

/** Direct and shortcut must reconcile. This is what keeps one truth. */
export function methodsReconcile(d: GroupedDistribution, assumed: number, tolerance = 1e-9): string[] {
  const direct = groupedDispersion(d, 'mean');
  const short = shortcutVariance(d, assumed);
  if (short.kind === 'unavailable') return [`the shortcut method is unavailable: ${short.reason}`];
  const problems: string[] = [];
  if (Math.abs(direct.variance - short.variance) > tolerance) {
    problems.push(`the direct variance ${direct.variance} and the shortcut variance ${short.variance} disagree`);
  }
  if (Math.abs(direct.standardDeviation - short.standardDeviation) > tolerance) {
    problems.push('the two standard deviations disagree');
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Validation.
// ---------------------------------------------------------------------------

export function validateDispersion(v: Variance): string[] {
  const problems: string[] = [];
  // Never clamped — an impossible value is reported, not hidden.
  if (v.variance < 0) problems.push(`the variance is ${v.variance}, which a sum of squares cannot produce`);
  if (Math.abs(v.standardDeviation ** 2 - v.variance) > 1e-9) {
    problems.push('the standard deviation is not the square root of the variance');
  }
  if (v.denominator !== v.rows.length) {
    problems.push(`the denominator is ${v.denominator} but there are ${v.rows.length} observations; this source divides by n`);
  }
  return problems;
}

/** A dataset with no spread must report zero by every measure. */
export const allMeasuresZero = (d: NumericDataset): boolean =>
  range(d).value === 0 && meanDeviationAbout(d, 'mean').value === 0
  && varianceOf(d).variance === 0 && varianceOf(d).standardDeviation === 0;

/** Display precision is a presentation choice, kept off the model value. */
export const show = (x: number, places = 2): string =>
  Number.isInteger(x) ? String(x) : x.toFixed(places);
