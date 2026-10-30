// ===========================================================================
// v0.84.0-c10.5 checkpoint 59 — ONE GROUPED DATASET, EVERY STATISTIC DERIVED.
//
// Class 9's `DataSet` holds categories as strings. That is right for
// "Household" against "Factory" and wrong for "20-30", because an interval
// is not a label: its two numbers are needed for the class mark, the class
// width, the median's lower boundary and every transformed method. Storing
// "20-30" as a name and the class mark as a separately typed number is
// exactly how a corrected frequency leaves a stale mean three columns away.
//
// So a grouped distribution is its own object, and NOTHING derived from it
// is authored. Class marks, cumulative frequencies, Sigma-fx, Sigma-fd,
// Sigma-fu, all three means, the mode and the median are computed here. A
// lesson states a number by reading it, which is what makes three
// computational routes unable to disagree silently.
//
// General for grouped numerical distributions. Nothing here knows about
// Chapter 13.
// ===========================================================================

export type ClassInterval = { lower: number; upper: number; frequency: number };

export type GroupedDistribution = {
  id: string;
  /** What one observation is, e.g. 'household'. */
  unitLabel: string;
  /** What the intervals measure, e.g. 'Litres used per day'. */
  quantity: string;
  intervals: ClassInterval[];
  /**
   * Continuous intervals (10-20, 20-30) share a boundary; inclusive ones
   * (10-19, 20-29) do not, and their boundaries must be adjusted before the
   * median's lower limit is used. Recording the convention keeps that
   * decision explicit rather than assumed.
   */
  convention: 'continuous' | 'inclusive';
};

/** The label a student sees. Derived, so it cannot drift from the numbers. */
export function intervalLabel(i: ClassInterval): string {
  return `${i.lower}\u2013${i.upper}`;
}

/** Class mark: the midpoint of the interval's printed limits. */
export function classMark(i: ClassInterval): number {
  return (i.lower + i.upper) / 2;
}

/**
 * True class boundaries. Under an inclusive convention the gap between one
 * upper limit and the next lower limit is split, so 10-19 and 20-29 become
 * 9.5-19.5 and 19.5-29.5. Continuous intervals are already boundaries.
 */
export function boundaries(d: GroupedDistribution, index: number): { lower: number; upper: number } {
  const i = d.intervals[index];
  if (d.convention === 'continuous') return { lower: i.lower, upper: i.upper };
  const next = d.intervals[index + 1];
  const prev = d.intervals[index - 1];
  const gapAbove = next ? (next.lower - i.upper) / 2 : prev ? (i.lower - prev.upper) / 2 : 0.5;
  const gapBelow = prev ? (i.lower - prev.upper) / 2 : gapAbove;
  return { lower: i.lower - gapBelow, upper: i.upper + gapAbove };
}

/** Common class width, or null when the widths differ. */
export function classWidth(d: GroupedDistribution): number | null {
  const widths = d.intervals.map((_, k) => {
    const b = boundaries(d, k);
    return b.upper - b.lower;
  });
  const first = widths[0];
  return widths.every((w) => Math.abs(w - first) < 1e-9) ? first : null;
}

export function totalFrequency(d: GroupedDistribution): number {
  return d.intervals.reduce((t, i) => t + i.frequency, 0);
}

/** Running totals. Derived, never authored. */
export function cumulativeFrequencies(d: GroupedDistribution): number[] {
  let running = 0;
  return d.intervals.map((i) => (running += i.frequency));
}

// --- the three routes to the mean -----------------------------------------

export function sumFx(d: GroupedDistribution): number {
  return d.intervals.reduce((t, i) => t + i.frequency * classMark(i), 0);
}

export function directMean(d: GroupedDistribution): number {
  return sumFx(d) / totalFrequency(d);
}

export function deviations(d: GroupedDistribution, assumed: number): number[] {
  return d.intervals.map((i) => classMark(i) - assumed);
}

export function sumFd(d: GroupedDistribution, assumed: number): number {
  return d.intervals.reduce((t, i) => t + i.frequency * (classMark(i) - assumed), 0);
}

export function assumedMean(d: GroupedDistribution, assumed: number): number {
  return assumed + sumFd(d, assumed) / totalFrequency(d);
}

export function stepDeviations(d: GroupedDistribution, assumed: number): number[] | null {
  const h = classWidth(d);
  if (h === null || h === 0) return null;
  return d.intervals.map((i) => (classMark(i) - assumed) / h);
}

export function sumFu(d: GroupedDistribution, assumed: number): number | null {
  const u = stepDeviations(d, assumed);
  if (!u) return null;
  return d.intervals.reduce((t, i, k) => t + i.frequency * u[k], 0);
}

export function stepDeviationMean(d: GroupedDistribution, assumed: number): number | null {
  const h = classWidth(d);
  const s = sumFu(d, assumed);
  if (h === null || s === null) return null;
  return assumed + h * (s / totalFrequency(d));
}

// --- mode ------------------------------------------------------------------

/**
 * The index of the MODAL CLASS — the interval with the greatest frequency.
 * Null when two classes tie: the CBSE scope avoids bimodal data, and a
 * silent choice between two tied classes would be a fabrication.
 */
export function modalClassIndex(d: GroupedDistribution): number | null {
  const max = Math.max(...d.intervals.map((i) => i.frequency));
  const winners = d.intervals.map((i, k) => (i.frequency === max ? k : -1)).filter((k) => k >= 0);
  return winners.length === 1 ? winners[0] : null;
}

/** Mode = l + h(f1 - f0) / (2f1 - f0 - f2). A number, not an interval. */
export function mode(d: GroupedDistribution): number | null {
  const k = modalClassIndex(d);
  const h = classWidth(d);
  if (k === null || h === null) return null;
  const f1 = d.intervals[k].frequency;
  const f0 = k > 0 ? d.intervals[k - 1].frequency : 0;
  const f2 = k < d.intervals.length - 1 ? d.intervals[k + 1].frequency : 0;
  const denom = 2 * f1 - f0 - f2;
  if (denom === 0) return null;
  return boundaries(d, k).lower + (h * (f1 - f0)) / denom;
}

// --- median ----------------------------------------------------------------

/** The first class whose cumulative frequency reaches N/2. */
export function medianClassIndex(d: GroupedDistribution): number | null {
  const half = totalFrequency(d) / 2;
  const cf = cumulativeFrequencies(d);
  const k = cf.findIndex((c) => c >= half);
  return k === -1 ? null : k;
}

/** Median = l + h(N/2 - cf) / f. */
export function median(d: GroupedDistribution): number | null {
  const k = medianClassIndex(d);
  const h = classWidth(d);
  if (k === null || h === null) return null;
  const cf = cumulativeFrequencies(d);
  const before = k > 0 ? cf[k - 1] : 0;
  const f = d.intervals[k].frequency;
  if (f === 0) return null;
  return boundaries(d, k).lower + (h * (totalFrequency(d) / 2 - before)) / f;
}

// --- validation ------------------------------------------------------------

export function validateGroupedDistribution(d: GroupedDistribution): string[] {
  const errs: string[] = [];
  if (d.intervals.length < 2) errs.push('a grouped distribution needs at least two classes');
  d.intervals.forEach((i, k) => {
    if (!Number.isFinite(i.frequency) || i.frequency < 0) errs.push(`class ${k}: frequency must be non-negative`);
    if (!Number.isInteger(i.frequency)) errs.push(`class ${k}: frequency must be a whole count`);
    if (i.upper <= i.lower) errs.push(`class ${k}: upper limit must exceed the lower limit`);
    if (k > 0 && i.lower < d.intervals[k - 1].upper) errs.push(`class ${k}: overlaps the class before it`);
    if (k > 0 && d.convention === 'continuous' && i.lower !== d.intervals[k - 1].upper) {
      errs.push(`class ${k}: continuous classes must share a boundary with the class before`);
    }
  });
  if (totalFrequency(d) <= 0) errs.push('total frequency must be positive');
  const cf = cumulativeFrequencies(d);
  for (let k = 1; k < cf.length; k += 1) if (cf[k] < cf[k - 1]) errs.push(`cumulative frequency falls at class ${k}`);
  if (cf.length && cf[cf.length - 1] !== totalFrequency(d)) errs.push('cumulative frequency does not end at the total');
  return errs;
}

/**
 * The three routes must agree. ANY assumed mean may be used, so the check
 * runs several — including deliberately awkward ones far outside the data —
 * because a method that only works for a convenient choice of a is not the
 * method.
 */
export function meansReconcile(d: GroupedDistribution, tolerance = 1e-9): string[] {
  const errs: string[] = [];
  const direct = directMean(d);
  const marks = d.intervals.map(classMark);
  const candidates = [...marks, marks[0] - 1000, 0, 12.5, -7.25];
  for (const a of candidates) {
    const am = assumedMean(d, a);
    if (Math.abs(am - direct) > tolerance * Math.max(1, Math.abs(direct))) {
      errs.push(`assumed mean with a = ${a} gives ${am}, not ${direct}`);
    }
    const sd = stepDeviationMean(d, a);
    if (sd !== null && Math.abs(sd - direct) > tolerance * Math.max(1, Math.abs(direct))) {
      errs.push(`step deviation with a = ${a} gives ${sd}, not ${direct}`);
    }
  }
  return errs;
}

/** Every column a lesson might print, all derived. */
export function derivedTable(d: GroupedDistribution, assumed?: number) {
  const h = classWidth(d);
  const cf = cumulativeFrequencies(d);
  return d.intervals.map((i, k) => {
    const x = classMark(i);
    return {
      label: intervalLabel(i),
      lower: i.lower,
      upper: i.upper,
      frequency: i.frequency,
      classMark: x,
      fx: i.frequency * x,
      cumulative: cf[k],
      d: assumed === undefined ? null : x - assumed,
      fd: assumed === undefined ? null : i.frequency * (x - assumed),
      u: assumed === undefined || h === null ? null : (x - assumed) / h,
      fu: assumed === undefined || h === null ? null : (i.frequency * (x - assumed)) / h,
    };
  });
}

/**
 * A grouped-frequency table as a visual. Which derived columns to show is
 * the only thing an author chooses; every value in them is computed.
 */
export type GroupedTableSpec = {
  type: 'grouped_table';
  purpose: 'show_definition' | 'support_reasoning' | 'show_construction';
  status: 'concept_specific';
  distribution: GroupedDistribution;
  columns: Array<'classMark' | 'fx' | 'cumulative' | 'd' | 'fd' | 'u' | 'fu'>;
  /** Required when a deviation column is shown. */
  assumedMean?: number;
  caption: string;
  altText: string;
};

export function validateGroupedTable(spec: GroupedTableSpec): string[] {
  const errs = validateGroupedDistribution(spec.distribution);
  const needsA = spec.columns.some((c) => ['d', 'fd', 'u', 'fu'].includes(c));
  if (needsA && spec.assumedMean === undefined) errs.push('a deviation column needs an assumed mean');
  if (spec.columns.some((c) => c === 'u' || c === 'fu') && classWidth(spec.distribution) === null) {
    errs.push('step-deviation columns need a common class width');
  }
  if (!spec.altText.trim()) errs.push('altText is required');
  errs.push(...meansReconcile(spec.distribution));
  return errs;
}
