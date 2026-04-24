// Scoring + diagnostic aggregation.
//
// These are HEURISTIC summaries for a prototype, not calibrated scores.
// The "ability" used here is the running ability estimate from the simple
// rule-based adaptive engine (1-10 scale). Bands are tuned by inspection,
// not by a validated cut-score study.

import {
  MISCONCEPTION_LABELS,
  MISCONCEPTION_NEXT_STEP,
  type Item,
  type MisconceptionCode,
} from '../data/items';

export type Response = {
  itemId: string;
  chosenIndex: number;
  correct: boolean;
  timeMs: number;
  difficultyAtAttempt: number; // the item's seed difficulty
  abilityBefore: number;
  abilityAfter: number;
  misconceptionTriggered: MisconceptionCode;
};

export type Session = {
  startedAt: number;
  completedAt: number | null;
  responses: Response[];
  finalAbility: number;
};

export type Band = 'Foundational' | 'Developing' | 'On Track' | 'Advanced';

export const BAND_DESCRIPTIONS: Record<Band, string> = {
  Foundational:
    'Early signs that the core idea of a common denominator is not yet in place. Strong candidate for revisiting FR.05 (like denominators) and equivalent fractions before continuing.',
  Developing:
    'Can add fractions when the conversion is very simple. Stumbles once LCM is required or the numerator has to be scaled. Needs targeted practice on core-band items.',
  'On Track':
    'Reliably adds fractions with unlike denominators, including standard two-term and mixed-number sums. Ready for FR.07 (subtraction) and for word-problem application work.',
  Advanced:
    'Fluent with three-term sums, mixed numbers, and multi-step word problems in this skill. Appropriate to begin bridging to more complex fraction operations and pre-algebra.',
};

export const computeBand = (ability: number): Band => {
  if (ability < 3.5) return 'Foundational';
  if (ability < 5.5) return 'Developing';
  if (ability < 7.5) return 'On Track';
  return 'Advanced';
};

export const bandColor = (band: Band): string => {
  switch (band) {
    case 'Foundational':
      return 'bg-rose-50 text-rose-700 ring-rose-200';
    case 'Developing':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'On Track':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'Advanced':
      return 'bg-brand-50 text-brand-700 ring-brand-200';
  }
};

export type MisconceptionSummary = {
  code: MisconceptionCode;
  label: string;
  count: number;
  itemIds: string[];
  nextStep: string;
};

export const summarizeMisconceptions = (
  responses: Response[]
): MisconceptionSummary[] => {
  const counts = new Map<
    MisconceptionCode,
    { count: number; itemIds: string[] }
  >();

  for (const r of responses) {
    if (r.correct) continue;
    if (r.misconceptionTriggered === 'none') continue;
    const entry = counts.get(r.misconceptionTriggered) ?? {
      count: 0,
      itemIds: [],
    };
    entry.count += 1;
    entry.itemIds.push(r.itemId);
    counts.set(r.misconceptionTriggered, entry);
  }

  return Array.from(counts.entries())
    .map(([code, { count, itemIds }]) => ({
      code,
      label: MISCONCEPTION_LABELS[code],
      count,
      itemIds,
      nextStep: MISCONCEPTION_NEXT_STEP[code],
    }))
    .sort((a, b) => b.count - a.count);
};

export const correctCount = (responses: Response[]): number =>
  responses.filter((r) => r.correct).length;

export const averageTimeSec = (responses: Response[]): number => {
  if (responses.length === 0) return 0;
  const total = responses.reduce((sum, r) => sum + r.timeMs, 0);
  return Math.round(total / responses.length / 1000);
};

/**
 * Simple diagnostic: list the bands in which the student answered correctly.
 * This is a transparency tool for the teacher ("saw 4 core items, got 3
 * right") - it is not an attempt at a latent-trait inference.
 */
export const bandAccuracy = (
  responses: Response[],
  pool: Item[]
): Array<{
  band: 'foundational' | 'core' | 'advanced';
  attempted: number;
  correct: number;
}> => {
  const byId = new Map(pool.map((it) => [it.id, it]));
  const bands: Array<'foundational' | 'core' | 'advanced'> = [
    'foundational',
    'core',
    'advanced',
  ];
  return bands.map((band) => {
    const subset = responses.filter((r) => byId.get(r.itemId)?.band === band);
    return {
      band,
      attempted: subset.length,
      correct: subset.filter((r) => r.correct).length,
    };
  });
};
