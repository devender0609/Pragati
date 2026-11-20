// v0.51 §10 — Assessment routing interface.
//
// WHAT THE CURRENT ENGINE ACTUALLY IS
//
// Pragati's adaptive engine starts "ability" at 5, moves it ±1 per
// response, and selects the item whose author-assigned difficulty
// (1–10) is nearest that number. That is a reasonable way to keep
// practice at roughly the right challenge level. It is NOT ability
// estimation:
//
//   - the 1–10 difficulties are author judgements, not empirical
//     parameters estimated from student responses;
//   - the ±1 step is arbitrary and has no standard error attached;
//   - the resulting number has no interpretable scale, so it cannot be
//     compared across sessions, students, grades, or time;
//   - "5.8 / 10" therefore means only "roughly here on our internal
//     difficulty ladder" — nothing more.
//
// It has been named `HeuristicAdaptiveRouter` so that no reader of the
// code, and no label in the UI, can mistake it for a measurement model.
// The name is the documentation.
//
// This interface exists so a CalibratedAdaptiveEngine can replace it
// later without touching the assessment UI.

import type { Item } from '../../data/items';

/** An ability/achievement estimate and its uncertainty.
 *
 *  `uncertainty: null` is meaningful and mandatory for uncalibrated
 *  routers: it means "no defensible uncertainty can be computed", NOT
 *  "the estimate is perfectly precise". Reporting code must treat null
 *  as a reason to withhold any precision claim. */
export type AbilityEstimate = {
  value: number;
  /** Standard error, or null when none can be computed. */
  uncertainty: number | null;
  /** The scale `value` lives on. 'internal_heuristic' is explicitly NOT
   *  an interpretable achievement scale. */
  scale: 'internal_heuristic' | 'calibrated_logit';
  /** True only when a calibrated model produced this estimate. */
  isCalibrated: boolean;
};

export type RouterState = {
  attemptedItemIds: string[];
  estimate: AbilityEstimate;
  administeredCount: number;
};

export type RouterResponse = {
  itemId: string;
  correct: boolean;
};

/**
 * The contract every routing engine implements.
 *
 * Deliberately narrow. The UI calls these six methods and knows nothing
 * about how the estimate is produced, so swapping in a calibrated
 * engine is a constructor change.
 */
export interface AssessmentRouter {
  readonly id: string;
  readonly isCalibrated: boolean;
  initialize(pool: Item[]): RouterState;
  selectNextItem(pool: Item[], state: RouterState): Item | null;
  updateEstimate(state: RouterState, response: RouterResponse, pool: Item[]): RouterState;
  shouldStop(state: RouterState, pool: Item[]): boolean;
  getEstimate(state: RouterState): AbilityEstimate;
  /** Standard error, or null when the router cannot compute one. */
  getUncertainty(state: RouterState): number | null;
}

// ---------------------------------------------------------------------------

export type HeuristicRouterConfig = {
  startAbility: number;
  step: number;
  /** Stop after this many items unless the pool runs out. */
  targetLength: number;
};

export const DEFAULT_HEURISTIC_CONFIG: HeuristicRouterConfig = {
  startAbility: 5,
  step: 1,
  targetLength: 10,
};

/**
 * The existing engine, renamed and documented for what it is.
 *
 * Preserved unchanged in behaviour: v0.50 sessions routed this way, and
 * changing the routing rule would silently alter what stored sessions
 * mean. This is a relabelling, not a rewrite.
 */
export class HeuristicAdaptiveRouter implements AssessmentRouter {
  readonly id = 'heuristic_v1';
  /** Always false. There is no configuration in which this router
   *  produces a calibrated estimate. */
  readonly isCalibrated = false;

  constructor(private config: HeuristicRouterConfig = DEFAULT_HEURISTIC_CONFIG) {}

  initialize(): RouterState {
    return {
      attemptedItemIds: [],
      administeredCount: 0,
      estimate: {
        value: this.config.startAbility,
        uncertainty: null,
        scale: 'internal_heuristic',
        isCalibrated: false,
      },
    };
  }

  selectNextItem(pool: Item[], state: RouterState): Item | null {
    const remaining = pool.filter(
      (i) => !state.attemptedItemIds.includes(i.id)
    );
    if (remaining.length === 0) return null;
    // Nearest author-assigned difficulty to the running value.
    let best = remaining[0];
    let bestGap = Math.abs(best.difficulty - state.estimate.value);
    for (const item of remaining.slice(1)) {
      const gap = Math.abs(item.difficulty - state.estimate.value);
      if (gap < bestGap) {
        best = item;
        bestGap = gap;
      }
    }
    return best;
  }

  updateEstimate(state: RouterState, response: RouterResponse): RouterState {
    const delta = response.correct ? this.config.step : -this.config.step;
    const value = Math.max(1, Math.min(10, state.estimate.value + delta));
    return {
      attemptedItemIds: [...state.attemptedItemIds, response.itemId],
      administeredCount: state.administeredCount + 1,
      estimate: { ...state.estimate, value },
    };
  }

  shouldStop(state: RouterState, pool: Item[]): boolean {
    if (state.administeredCount >= this.config.targetLength) return true;
    return state.attemptedItemIds.length >= pool.length;
  }

  getEstimate(state: RouterState): AbilityEstimate {
    return state.estimate;
  }

  /** Always null. A ±1 walk over author-assigned difficulties supports
   *  no standard error, and inventing one would be the exact kind of
   *  false precision this iteration exists to prevent. */
  getUncertainty(): number | null {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Reporting guard
// ---------------------------------------------------------------------------

/** Claims that require a calibrated estimate. Checked in tests so no
 *  future screen can render one from heuristic output. */
export const PSYCHOMETRIC_CLAIMS = [
  'percentile',
  'national percentile',
  'grade equivalent',
  'grade level',
  'true ability',
  'calibrated growth',
  'projected score',
  'RIT',
  'standard error',
  'mastery',
  'norm',
] as const;

/**
 * Whether an estimate may support a psychometric claim.
 *
 * Today this returns false for every estimate Pragati can produce. That
 * is the correct answer, and the function exists so the rule is
 * enforced in one place when it eventually changes.
 */
export function maySupportPsychometricClaim(
  estimate: AbilityEstimate
): boolean {
  return estimate.isCalibrated && estimate.uncertainty !== null;
}

/** How an uncalibrated result may be described to a human. */
export function describeEstimate(estimate: AbilityEstimate): string {
  if (!maySupportPsychometricClaim(estimate)) {
    return 'Questions answered and competencies sampled are reported below. Pragati cannot yet report an achievement score, percentile, or growth measure — those require calibration against Indian student data that has not been collected.';
  }
  return `Calibrated estimate ${estimate.value.toFixed(2)} (SE ${estimate.uncertainty?.toFixed(2)}).`;
}
