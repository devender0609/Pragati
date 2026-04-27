// Scoring + diagnostic aggregation.
//
// These are HEURISTIC summaries for a prototype, not calibrated scores.
// The "ability" used here is the running ability estimate from the simple
// rule-based adaptive engine (1-10 scale). Bands are tuned by inspection,
// not by a validated cut-score study.
//
// v0.3 changes:
//   - Growth indicator now uses a composite of three deltas (accuracy,
//     average difficulty attempted, misconception rate) rather than the
//     single noisy ability number. The per-component deltas are still
//     reported transparently.
//   - Adds a confidence label (low / moderate) based on the number of
//     items in the current session and the spread of difficulties seen.
//   - Language is hedged: "prototype change indicator", "early signal,
//     not calibrated growth".

import {
  MISCONCEPTION_LABELS,
  MISCONCEPTION_NEXT_STEP,
  type Item,
  type MisconceptionCode,
} from '../data/items';
import type { Response, Session } from '../types';

export type { Response, Session };

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

// ---------------------------------------------------------------------------
// Prerequisite recommendations
// ---------------------------------------------------------------------------
// FR.06 has three direct prerequisites in the Class 6 skill tree:
//   FR.05 - Add fractions with like denominators
//   FR.03 - Equivalent fractions
//   FM.07 - Find LCM
// Plus FR.04 (mixed-number conversion) and FR.02 (fraction-as-model).

export type PrerequisiteSkill = {
  code: 'FR.05' | 'FR.03' | 'FM.07' | 'FR.04' | 'FR.02';
  name: string;
};

export const PREREQUISITE_FOR_MISCONCEPTION: Record<
  MisconceptionCode,
  PrerequisiteSkill[]
> = {
  add_across: [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.05', name: 'Add fractions with like denominators' },
  ],
  incomplete_conversion: [
    { code: 'FR.03', name: 'Equivalent fractions' },
  ],
  product_not_lcm: [
    { code: 'FM.07', name: 'Find LCM of two or three numbers' },
  ],
  operation_confusion: [
    { code: 'FR.05', name: 'Add fractions with like denominators' },
  ],
  mixed_number_error: [
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
  ],
  conceptual_gap: [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.05', name: 'Add fractions with like denominators' },
  ],
  visual_misread: [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
  ],
  arithmetic_slip: [],
  form_error: [
    { code: 'FR.03', name: 'Equivalent fractions' },
  ],
  none: [],
};

export type PrerequisiteRecommendation = {
  skill: PrerequisiteSkill;
  reason: string;
};

export const recommendPrerequisites = (
  responses: Response[]
): PrerequisiteRecommendation[] => {
  const summaries = summarizeMisconceptions(responses);
  const seen = new Set<string>();
  const recs: PrerequisiteRecommendation[] = [];
  for (const s of summaries) {
    const skills = PREREQUISITE_FOR_MISCONCEPTION[s.code];
    for (const skill of skills) {
      if (seen.has(skill.code)) continue;
      seen.add(skill.code);
      recs.push({
        skill,
        reason: `Selected the "${s.label.toLowerCase()}" distractor on ${s.count} item${s.count > 1 ? 's' : ''} (${s.itemIds.join(', ')}).`,
      });
    }
  }
  return recs;
};

// ---------------------------------------------------------------------------
// Session summary (used by growth indicator + history table)
// ---------------------------------------------------------------------------
export type SessionSummary = {
  total: number;
  correct: number;
  accuracy: number;            // 0..1
  avgDifficulty: number;       // mean of difficultyAtAttempt
  difficultyRange: number;     // max - min of difficultyAtAttempt
  misconceptionRate: number;   // (# wrong with non-'none' tag) / total
  avgTimeSec: number;
};

export const summarizeSession = (s: Session): SessionSummary => {
  const total = s.responses.length;
  const correct = correctCount(s.responses);
  const accuracy = total === 0 ? 0 : correct / total;
  const diffs = s.responses.map((r) => r.difficultyAtAttempt);
  const avgDifficulty =
    diffs.length === 0
      ? 0
      : diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const difficultyRange =
    diffs.length === 0 ? 0 : Math.max(...diffs) - Math.min(...diffs);
  const misconceptionWrong = s.responses.filter(
    (r) => !r.correct && r.misconceptionTriggered !== 'none'
  ).length;
  const misconceptionRate = total === 0 ? 0 : misconceptionWrong / total;
  return {
    total,
    correct,
    accuracy,
    avgDifficulty,
    difficultyRange,
    misconceptionRate,
    avgTimeSec: averageTimeSec(s.responses),
  };
};

// ---------------------------------------------------------------------------
// Prototype change indicator (composite, with confidence)
// ---------------------------------------------------------------------------
// Compares two completed sessions for the SAME student & SAME skill and
// returns a careful change descriptor.
//
// Composite direction is computed from three normalised components:
//   - accuracyDelta:        current.accuracy - prev.accuracy        (-1..+1)
//   - difficultyDeltaNorm:  (current.avgDiff - prev.avgDiff) / 9    (-1..+1)
//   - misconceptionDelta:   prev.misRate - current.misRate          (-1..+1)
// (For misconception, an *improvement* is a *decrease* in rate, so we
// flip the sign so positive composite = improvement on every axis.)
//
// composite = avg(weights * components). Thresholds: |composite| < 0.05
// is reported as flat.
//
// This is NOT a validated growth metric. Display copy uses "prototype
// change indicator" and "early signal, not calibrated growth".

export type GrowthDirection = 'up' | 'down' | 'flat';
export type GrowthConfidence = 'low' | 'moderate';

export type GrowthIndicator = {
  direction: GrowthDirection;
  composite: number;            // -1..+1, positive = improvement
  abilityDelta: number;         // current.finalAbility - prev.finalAbility
  accuracyDelta: number;        // 0..1 fractional change
  difficultyDelta: number;      // raw delta on 1-10 scale
  misconceptionDelta: number;   // current.misRate - prev.misRate (negative = improving)
  prevSummary: SessionSummary;
  currentSummary: SessionSummary;
  prevAbility: number;
  currentAbility: number;
  prevBand: Band;
  currentBand: Band;
  prevAt: number;
  currentAt: number;
  confidence: GrowthConfidence;
  confidenceReasons: string[];
  summary: string;
};

const FLAT_COMPOSITE = 0.05;
const MIN_ITEMS_FOR_CONFIDENCE = 8;
const MIN_DIFF_RANGE_FOR_CONFIDENCE = 4;

export const sessionConfidence = (
  s: SessionSummary
): { confidence: GrowthConfidence; reasons: string[] } => {
  const reasons: string[] = [];
  if (s.total < MIN_ITEMS_FOR_CONFIDENCE) {
    reasons.push(
      `Only ${s.total} item${s.total === 1 ? '' : 's'} in this session (need at least ${MIN_ITEMS_FOR_CONFIDENCE} for moderate confidence).`
    );
  }
  if (s.difficultyRange < MIN_DIFF_RANGE_FOR_CONFIDENCE) {
    reasons.push(
      `Items spanned only ${s.difficultyRange.toFixed(0)} points of seed difficulty (need at least ${MIN_DIFF_RANGE_FOR_CONFIDENCE} for moderate confidence).`
    );
  }
  return {
    confidence: reasons.length === 0 ? 'moderate' : 'low',
    reasons,
  };
};

export const growthIndicator = (
  prev: Session,
  current: Session
): GrowthIndicator => {
  const prevSummary = summarizeSession(prev);
  const currentSummary = summarizeSession(current);

  const abilityDelta = current.finalAbility - prev.finalAbility;
  const accuracyDelta = currentSummary.accuracy - prevSummary.accuracy;
  const difficultyDelta =
    currentSummary.avgDifficulty - prevSummary.avgDifficulty;
  const misconceptionDelta =
    currentSummary.misconceptionRate - prevSummary.misconceptionRate;

  // Normalise difficulty to roughly the same -1..+1 range as the others.
  const difficultyNorm = difficultyDelta / 9;
  // Misconception: improvement = decrease, so flip sign for the composite.
  const misconceptionImprovement = -misconceptionDelta;

  const composite =
    (accuracyDelta + difficultyNorm + misconceptionImprovement) / 3;

  const direction: GrowthDirection =
    Math.abs(composite) < FLAT_COMPOSITE
      ? 'flat'
      : composite > 0
        ? 'up'
        : 'down';

  // Confidence: take the *worse* of the two sessions' confidences.
  const prevConf = sessionConfidence(prevSummary);
  const currentConf = sessionConfidence(currentSummary);
  const confidence: GrowthConfidence =
    prevConf.confidence === 'low' || currentConf.confidence === 'low'
      ? 'low'
      : 'moderate';
  const confidenceReasons: string[] = [];
  if (prevConf.confidence === 'low') {
    confidenceReasons.push(
      ...prevConf.reasons.map((r) => `Prior session: ${r}`)
    );
  }
  if (currentConf.confidence === 'low') {
    confidenceReasons.push(
      ...currentConf.reasons.map((r) => `This session: ${r}`)
    );
  }

  // Build a hedged human summary line.
  const componentsText = describeComponents(
    accuracyDelta,
    difficultyDelta,
    misconceptionDelta
  );
  const directionText =
    direction === 'flat'
      ? 'roughly flat'
      : direction === 'up'
        ? 'an early signal of improvement'
        : 'an early signal of regression';
  const confidenceText =
    confidence === 'low'
      ? ' Confidence is LOW — treat this as anecdotal until more data is available.'
      : ' Confidence is moderate (still not a calibrated growth measurement).';
  const summary = `Prototype change indicator: ${directionText}. ${componentsText}${confidenceText}`;

  return {
    direction,
    composite,
    abilityDelta,
    accuracyDelta,
    difficultyDelta,
    misconceptionDelta,
    prevSummary,
    currentSummary,
    prevAbility: prev.finalAbility,
    currentAbility: current.finalAbility,
    prevBand: computeBand(prev.finalAbility),
    currentBand: computeBand(current.finalAbility),
    prevAt: prev.completedAt ?? prev.startedAt,
    currentAt: current.completedAt ?? current.startedAt,
    confidence,
    confidenceReasons,
    summary,
  };
};

function describeComponents(
  accuracyDelta: number,
  difficultyDelta: number,
  misconceptionDelta: number
): string {
  const accPct = Math.round(accuracyDelta * 100);
  const accStr =
    accPct === 0
      ? 'accuracy unchanged'
      : `accuracy ${accPct > 0 ? 'up' : 'down'} ${Math.abs(accPct)} pts`;
  const diffStr =
    Math.abs(difficultyDelta) < 0.1
      ? 'attempted similar difficulty'
      : `attempted ${difficultyDelta > 0 ? 'harder' : 'easier'} items on average (Δ${difficultyDelta >= 0 ? '+' : '−'}${Math.abs(difficultyDelta).toFixed(1)})`;
  const misPct = Math.round(misconceptionDelta * 100);
  const misStr =
    misPct === 0
      ? 'misconception rate unchanged'
      : `misconception rate ${misPct > 0 ? 'up' : 'down'} ${Math.abs(misPct)} pts`;
  return `${capitalise(accStr)}; ${diffStr}; ${misStr}.`;
}

function capitalise(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}
