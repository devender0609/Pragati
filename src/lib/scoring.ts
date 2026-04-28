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
//
// v0.4 changes:
//   - Added new misconception codes (`subtract_across`, `borrowing_error`)
//     to PREREQUISITE_FOR_MISCONCEPTION. Added FR.06 as a prerequisite
//     code (FR.07 is built on top of FR.06).
//   - Added `responsesBySkill`, `summarizeSessionBySkill`, and
//     `summarizeMisconceptionsBySkill` helpers so the results screen
//     and class dashboard can show per-skill breakdowns for mixed
//     sessions.
//   - Band descriptions are now per-skill so an FR.07 "Foundational"
//     student gets pointed at FR.06 (and earlier prereqs), not at
//     fictitious FR.06-prereq advice.

import {
  MISCONCEPTION_LABELS,
  MISCONCEPTION_NEXT_STEP,
  type Item,
  type MisconceptionCode,
} from '../data/items';
import type { Response, Session, SkillId, SkillMode } from '../types';

export type { Response, Session };

export type Band = 'Foundational' | 'Developing' | 'On Track' | 'Advanced';

// Per-skill band descriptions. The "mixed" mode is a module-wide summary
// that covers all 7 fraction skills.
export const BAND_DESCRIPTIONS_BY_SKILL: Record<SkillMode, Record<Band, string>> = {
  'FR.02': {
    Foundational:
      'Reads basic visual fractions but trips up on equal-partition or numerator/denominator role. Useful next step: model bars and area grids hands-on, count cells aloud.',
    Developing:
      'Reads simple visuals and writes the matching fraction. Stumbles when the partition is irregular or when comparing two visuals. Needs more variety in models (bars, grids, number line).',
    'On Track':
      'Reads visual models reliably and can compare two fractions on the same whole. Ready to move into equivalent fractions (FR.03) and to read more complex partitions.',
    Advanced:
      'Confident with bars, area grids, and number-line representations of fractions; can write the fraction and explain it. Appropriate to begin operating on fractions (FR.05).',
  },
  'FR.03': {
    Foundational:
      'Recognises some equivalent fractions but applies the rule inconsistently — sometimes only changes the numerator or only the denominator. Revisit FR.02 (visualise) and the meaning of multiplying by k/k = 1.',
    Developing:
      'Can multiply both top and bottom by the same number on small examples. Tends to leave answers unsimplified. Needs targeted practice on simplifying with HCF.',
    'On Track':
      'Generates equivalent fractions and simplifies to lowest terms reliably. Ready for FR.04 (mixed/improper) and for FR.05 problems requiring simplification.',
    Advanced:
      'Fluent with equivalence and simplification on larger numerators and denominators. Appropriate to bridge into LCM-based fraction operations.',
  },
  'FR.04': {
    Foundational:
      'Confuses how a mixed number is built from whole + fractional part. Revisit FR.02 (visualise) and FR.03 (equivalent fractions) — particularly the picture of a whole as denominator/denominator.',
    Developing:
      'Can convert between mixed and improper fractions on small examples but slips on multi-digit ones. Needs more practice with larger numerators and the connection to division with remainder.',
    'On Track':
      'Converts both directions reliably and recognises mixed-number form in word problems. Ready for FR.05 (like-denominator addition/subtraction) and FR.06 onwards.',
    Advanced:
      'Fluent with conversions on larger numbers and with mixed-number arithmetic context. Appropriate to apply to FR.07-style mixed-number subtraction with borrowing.',
  },
  'FR.05': {
    Foundational:
      'Tends to add or subtract denominators when they already match. Revisit the meaning of the denominator (FR.02) and re-establish the rule that only numerators move when denominators agree.',
    Developing:
      'Adds and subtracts simple like-denominator fractions but does not always simplify. Needs targeted practice on simplification (FR.03) and on result-as-mixed-number conversions (FR.04).',
    'On Track':
      'Adds and subtracts like-denominator fractions reliably, including in simplest form and as mixed numbers. Ready for FR.06 (addition with unlike denominators) and FR.08 (word problems).',
    Advanced:
      'Fluent with like-denominator arithmetic across mixed-number cases and word problems. Appropriate to move into unlike-denominator work (FR.06/FR.07).',
  },
  'FR.06': {
    Foundational:
      'Early signs that the core idea of a common denominator is not yet in place when adding. Strong candidate for revisiting FR.05 (like denominators) and equivalent fractions before continuing.',
    Developing:
      'Can add fractions when the conversion is very simple. Stumbles once LCM is required or the numerator has to be scaled. Needs targeted practice on core-band addition items.',
    'On Track':
      'Reliably adds fractions with unlike denominators, including standard two-term and mixed-number sums. Ready for FR.07 (subtraction) and for word-problem application work.',
    Advanced:
      'Fluent with three-term sums, mixed numbers, and multi-step word problems in addition. Appropriate to begin bridging to more complex fraction operations and pre-algebra.',
  },
  'FR.07': {
    Foundational:
      'Early signs that subtraction with unlike denominators is not yet stable. Likely to benefit from revisiting FR.05 (like-denominator subtraction), equivalent fractions, and FR.06 (addition with unlike denominators) before continuing.',
    Developing:
      'Can subtract fractions when the conversion is very simple. Stumbles once LCM is required, or once a borrow is needed for mixed-number subtraction. Needs targeted practice on core-band subtraction items.',
    'On Track':
      'Reliably subtracts fractions with unlike denominators, including standard two-term and basic mixed-number differences. Ready for borrowing-required mixed-number subtraction and word-problem application work.',
    Advanced:
      'Fluent with mixed-number subtraction (including borrowing) and multi-step word problems. Appropriate to begin bridging to more complex fraction operations and pre-algebra.',
  },
  'FR.08': {
    Foundational:
      'Often picks the wrong operation in a word problem (adds when subtraction is needed, or vice versa). Revisit operation cues and re-anchor in FR.05 / FR.06 procedural fluency.',
    Developing:
      'Picks the right operation in single-step problems but trips on multi-step or comparison problems. Needs more practice rewording the problem in their own words first.',
    'On Track':
      'Reliably solves one- and two-step fraction word problems and explains the steps. Ready for multi-step and mixed-number word problems.',
    Advanced:
      'Fluent with multi-step fraction word problems involving mixed numbers and unlike denominators. Appropriate to bridge into ratio and percentage problem solving.',
  },
  mixed: {
    Foundational:
      'Across the Fractions Module, the basics (visualising, equivalence, like denominators) are not yet stable. Strong candidate for the Learn section before more assessments.',
    Developing:
      'Some skills are coming together but there is still drift on more procedural skills (LCM, borrowing) or on word problems. Use the per-skill breakdown to choose what to revisit.',
    'On Track':
      'Most fraction skills are reliable. Use the per-skill breakdown to spot the one or two skills still in transition and target them.',
    Advanced:
      'Fluent across the whole Class 6 Fractions Module on this prototype. Appropriate to begin bridging to multiplication and division of fractions.',
  },
};

// Backwards-compatible default (FR.06 phrasing, kept for any caller that
// doesn't yet pass a skill).
export const BAND_DESCRIPTIONS: Record<Band, string> = BAND_DESCRIPTIONS_BY_SKILL['FR.06'];

export const bandDescription = (band: Band, skill: SkillMode): string =>
  BAND_DESCRIPTIONS_BY_SKILL[skill][band];

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
//
// FR.07 (subtract unlike denominators) shares those prerequisites, plus
// FR.06 itself: a student who cannot add fractions with unlike denominators
// is unlikely to subtract them reliably, so FR.06 is included as a
// prerequisite for the FR.07-specific misconceptions.

export type PrerequisiteSkill = {
  code:
    | 'FR.02'
    | 'FR.03'
    | 'FR.04'
    | 'FR.05'
    | 'FR.06'
    | 'FR.07'
    | 'FM.07';
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
  subtract_across: [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
  ],
  incomplete_conversion: [
    { code: 'FR.03', name: 'Equivalent fractions' },
  ],
  product_not_lcm: [
    { code: 'FM.07', name: 'Find LCM of two or three numbers' },
  ],
  operation_confusion: [
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
  ],
  mixed_number_error: [
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
  ],
  borrowing_error: [
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
    { code: 'FR.06', name: 'Add fractions with unlike denominators' },
  ],
  conceptual_gap: [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
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

// Static prerequisite list per skill, surfaced to the teacher as "what
// FR.0x is built on" reference text — independent of misconception
// observations. Used in the assessment results screen and on the Learn
// skill cards.
export const STATIC_PREREQUISITES_BY_SKILL: Record<SkillId, PrerequisiteSkill[]> = {
  'FR.02': [],
  'FR.03': [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
  ],
  'FR.04': [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.03', name: 'Equivalent fractions' },
  ],
  'FR.05': [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.03', name: 'Equivalent fractions' },
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
  ],
  'FR.06': [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.03', name: 'Equivalent fractions' },
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
    { code: 'FM.07', name: 'Find LCM of two or three numbers' },
  ],
  'FR.07': [
    { code: 'FR.03', name: 'Equivalent fractions' },
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
    { code: 'FR.06', name: 'Add fractions with unlike denominators' },
    { code: 'FM.07', name: 'Find LCM of two or three numbers' },
  ],
  'FR.08': [
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
    { code: 'FR.06', name: 'Add fractions with unlike denominators' },
    { code: 'FR.07', name: 'Subtract fractions with unlike denominators' },
  ],
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

// ---------------------------------------------------------------------------
// Per-skill helpers (v0.4, expanded in v0.5 to cover all 7 fraction skills)
// ---------------------------------------------------------------------------
// A "mixed" session may contain responses across the full Fractions Module.
// These helpers split a response array by the item's skillId so the UI can
// surface per-skill accuracy and misconception breakdowns.

import { SKILL_IDS_ORDERED } from '../types';

// Build a quick lookup from itemId -> skillId for the items the student
// actually saw in this session. Returns 'FR.06' as the safest default for
// any item not found in the pool (this should be vanishingly rare and
// only happens if the bank changes between sessions).
const responseSkillLookup = (
  responses: Response[],
  pool: Item[]
): Map<string, SkillId> => {
  const byId = new Map(pool.map((it) => [it.id, it.skillId]));
  const m = new Map<string, SkillId>();
  for (const r of responses) {
    m.set(r.itemId, byId.get(r.itemId) ?? 'FR.06');
  }
  return m;
};

const emptyBySkill = (): Record<SkillId, Response[]> => ({
  'FR.02': [],
  'FR.03': [],
  'FR.04': [],
  'FR.05': [],
  'FR.06': [],
  'FR.07': [],
  'FR.08': [],
});

export const responsesBySkill = (
  responses: Response[],
  pool: Item[]
): Record<SkillId, Response[]> => {
  const lookup = responseSkillLookup(responses, pool);
  const out = emptyBySkill();
  for (const r of responses) {
    const skill = lookup.get(r.itemId) ?? 'FR.06';
    out[skill].push(r);
  }
  return out;
};

export type SkillBreakdown = {
  skillId: SkillId;
  attempted: number;
  correct: number;
  accuracy: number; // 0..1; 0 if attempted === 0
  avgTimeSec: number;
  misconceptions: MisconceptionSummary[];
};

export const summarizeBySkill = (
  responses: Response[],
  pool: Item[]
): SkillBreakdown[] => {
  const split = responsesBySkill(responses, pool);
  return SKILL_IDS_ORDERED.map((skill) => {
    const subset = split[skill];
    const correct = correctCount(subset);
    return {
      skillId: skill,
      attempted: subset.length,
      correct,
      accuracy: subset.length === 0 ? 0 : correct / subset.length,
      avgTimeSec: averageTimeSec(subset),
      misconceptions: summarizeMisconceptions(subset),
    };
  });
};

// True iff the session draws from more than one skill bank.
export const isMixedSession = (
  responses: Response[],
  pool: Item[]
): boolean => {
  const split = responsesBySkill(responses, pool);
  return SKILL_IDS_ORDERED.filter((s) => split[s].length > 0).length > 1;
};
