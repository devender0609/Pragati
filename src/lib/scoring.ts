// Scoring + diagnostic aggregation.
//
// These are HEURISTIC summaries for a prototype, not calibrated scores.
// The "ability" used here is the running ability estimate from the simple
// rule-based adaptive engine (1-10 scale). Bands are tuned by inspection,
// not by a validated cut-score study.
//
// We re-export Response and Session here from ../types so existing imports
// (`from './lib/scoring'`) keep working after the type extraction.

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
// We surface the most likely prerequisite gap based on the misconception code
// observed. A teacher always reviews this before acting on it.

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
// Prototype growth indicator
// ---------------------------------------------------------------------------
// Compares two completed sessions for the SAME student & SAME skill and
// returns a careful-language change descriptor. This is NOT a validated
// growth score and NOT an RIT-equivalent. It is an early growth indicator
// based on the running ability heuristic.

export type GrowthDirection = 'up' | 'down' | 'flat';

export type GrowthIndicator = {
  direction: GrowthDirection;
  delta: number; // current.finalAbility - prev.finalAbility (1-10 scale)
  prevAbility: number;
  currentAbility: number;
  prevBand: Band;
  currentBand: Band;
  prevAt: number;
  currentAt: number;
  summary: string;
};

const FLAT_THRESHOLD = 0.5;

export const growthIndicator = (
  prev: Session,
  current: Session
): GrowthIndicator => {
  const delta = current.finalAbility - prev.finalAbility;
  const direction: GrowthDirection =
    Math.abs(delta) < FLAT_THRESHOLD ? 'flat' : delta > 0 ? 'up' : 'down';
  const prevBand = computeBand(prev.finalAbility);
  const currentBand = computeBand(current.finalAbility);

  const sign = delta >= 0 ? '+' : '−';
  const magnitude = Math.abs(delta).toFixed(1);
  const summary =
    direction === 'flat'
      ? `Prototype estimate is roughly flat compared with the prior session (${sign}${magnitude} on the 1–10 seed scale).`
      : direction === 'up'
        ? `Prototype estimate moved up by ${magnitude} on the 1–10 seed scale since the prior session. This is an early growth indicator and needs teacher review before being treated as real growth.`
        : `Prototype estimate moved down by ${magnitude} on the 1–10 seed scale since the prior session. Investigate before drawing conclusions — could be measurement noise on a 12-item bank, fatigue, or a real regression.`;

  return {
    direction,
    delta,
    prevAbility: prev.finalAbility,
    currentAbility: current.finalAbility,
    prevBand,
    currentBand,
    prevAt: prev.completedAt ?? prev.startedAt,
    currentAt: current.completedAt ?? current.startedAt,
    summary,
  };
};

// Simple aggregate of correct answers + average difficulty attempted; useful
// in the growth history table where the band alone hides information.
export type SessionSummary = {
  correct: number;
  total: number;
  avgDifficulty: number; // mean of difficultyAtAttempt across responses
  avgTimeSec: number;
};

export const summarizeSession = (s: Session): SessionSummary => {
  const total = s.responses.length;
  const correct = correctCount(s.responses);
  const avgDifficulty =
    total === 0
      ? 0
      : s.responses.reduce((sum, r) => sum + r.difficultyAtAttempt, 0) / total;
  return {
    correct,
    total,
    avgDifficulty,
    avgTimeSec: averageTimeSec(s.responses),
  };
};
