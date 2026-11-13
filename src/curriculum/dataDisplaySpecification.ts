// ===========================================================================
// v0.84.0 checkpoint 37 — DATA DISPLAYS, MODELLED AS DATA.
//
// Chapter 10 §10.2 asks a student to see that a percentage display and an
// absolute display of the SAME data answer different questions: one keeps
// the totals, the other throws them away. A lesson can assert that in
// prose. It cannot show it unless both displays are provably the same
// data.
//
// So this models the DATASET, not the picture. Categories, series and raw
// values live here; a display mode is a way of reading them. The normalised
// view is COMPUTED from the raw values rather than authored, which means a
// 100% stacked bar cannot disagree with the grouped bars beside it — the
// arithmetic is the same arithmetic.
//
// WHAT THIS DELIBERATELY DOES NOT DO
//
// No pie charts, scatterplots, histograms, box plots, line charts or
// heatmaps; no axis-range control, no colour scales, no chart gallery.
// Only the three display modes §10.2 actually uses. A larger visualisation
// API would be guesswork, and the next chapter that needs one can extend
// this with its own evidence.
// ===========================================================================

/** One measured quantity, named, across the dataset's categories. */
export type DataSeries = {
  id: string;
  label: string;
  /** Raw values, one per category, in the dataset's category order. */
  values: number[];
};

/**
 * A dataset is the mathematics. Every display in a lesson points at one of
 * these, so two displays that claim to show the same data demonstrably do.
 */
export type DataSet = {
  id: string;
  /** What one category is, e.g. 'Household'. Used in the accessible table. */
  categoryLabel: string;
  categories: string[];
  series: DataSeries[];
  /** What the numbers measure, e.g. 'rupees per month'. */
  unit: string;
};

export type DataDisplayMode =
  /** Series side by side per category — compares series within a category. */
  | 'grouped'
  /** Series piled up per category — shows each category's total. */
  | 'stacked'
  /** Each category scaled to 100% — shows composition, discards the total. */
  | 'normalised_stacked';

export type DataDisplaySpec = {
  type: 'data_display';
  /** The dataset this display reads. Displays compared in one lesson share it. */
  dataSetId: string;
  mode: DataDisplayMode;
  status: 'concept_specific';
  /** What this display is for — which question it answers. */
  purpose: string;
  caption: string;
  /**
   * The mathematics a nonvisual reader needs, in words. The rendered chart
   * is additionally accompanied by a real data table, so this says what the
   * display shows rather than reciting every number.
   */
  altText: string;
};

/** Totals per category, which is exactly what normalisation discards. */
export function categoryTotals(data: DataSet): number[] {
  return data.categories.map((_, i) =>
    data.series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0)
  );
}

/**
 * Exact proportions, derived — never authored. This is the function that
 * makes a normalised display honest: it cannot drift from the raw values
 * because it is computed from them at render time.
 */
export function normalisedValues(data: DataSet): number[][] {
  const totals = categoryTotals(data);
  return data.series.map((s) =>
    s.values.map((v, i) => (totals[i] === 0 ? 0 : (v / totals[i]) * 100))
  );
}

export function validateDataSet(data: DataSet): string[] {
  const errors: string[] = [];
  if (!data.id.trim()) errors.push('dataset needs an id');
  if (data.categories.length === 0) errors.push('dataset needs at least one category');
  if (new Set(data.categories).size !== data.categories.length) {
    errors.push('category names must be unique');
  }
  for (const c of data.categories) if (!c.trim()) errors.push('a category has no name');
  if (data.series.length === 0) errors.push('dataset needs at least one series');
  if (new Set(data.series.map((s) => s.id)).size !== data.series.length) {
    errors.push('series ids must be unique');
  }
  for (const s of data.series) {
    if (!s.label.trim()) errors.push(`series ${s.id} has no label`);
    if (s.values.length !== data.categories.length) {
      errors.push(`series ${s.id} has ${s.values.length} values for ${data.categories.length} categories`);
    }
    for (const v of s.values) {
      if (!Number.isFinite(v)) errors.push(`series ${s.id} has a value that is not a finite number`);
      // Stacking a negative quantity is not a thing these displays can mean.
      if (v < 0) errors.push(`series ${s.id} has a negative value, which these displays cannot represent`);
    }
  }
  if (!data.unit.trim()) errors.push('dataset needs a unit, or a reader cannot say what the numbers measure');
  if (!data.categoryLabel.trim()) errors.push('dataset needs a category label');
  // A normalised display is meaningless where a category total is zero.
  if (data.series.length > 0 && categoryTotals(data).some((t) => t === 0)) {
    errors.push('a category totals zero, so it cannot be normalised');
  }
  return errors;
}

export function validateDataDisplay(
  spec: DataDisplaySpec,
  dataSets: Record<string, DataSet>
): string[] {
  const errors: string[] = [];
  const data = dataSets[spec.dataSetId];
  if (!data) {
    errors.push(`display names dataset '${spec.dataSetId}', which is not in this lesson`);
    return errors;
  }
  if (!spec.purpose.trim()) errors.push('a display must say which question it answers');
  if (!spec.caption.trim()) errors.push('caption is required');
  if (!spec.altText.trim()) errors.push('altText is required');
  else if (spec.altText.trim().length < 60) {
    errors.push('altText must state the mathematics, not name a chart type');
  }
  // Naming the format is not describing the data.
  if (/^(a )?(stacked|grouped|clustered|bar|column) (bar|column|chart)/i.test(spec.altText.trim())) {
    errors.push('altText opens by naming the chart format rather than the data it shows');
  }
  if (spec.mode === 'normalised_stacked' && !/percent|%|composition|proportion/i.test(spec.altText)) {
    errors.push('a normalised display must say in its description that it shows proportions');
  }
  return errors;
}
