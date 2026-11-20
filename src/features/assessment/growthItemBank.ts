// v0.59 — The formal Growth item bank.
//
// EMPTY, DELIBERATELY.
//
// Pragati has authored no secure Growth items, and will not until the
// framework and human-review gates pass. These exports exist so the
// application can be wired end to end against a real (empty) bank
// rather than a placeholder — the pipeline then refuses for the true
// reason, and the day items exist nothing else needs rewiring.
//
// Tests inject fixture banks; they never mutate these.

import type { GrowthItemRecord } from './growthEligibility';
import type { GrowthItemMetadata } from './prepareGrowthAdministration';

export const growthItemRecords: GrowthItemRecord[] = [];
export const growthItemMetadata: Record<string, GrowthItemMetadata> = {};

/** Stems live only here, never in stored sessions or assignments. */
export const growthItemContent: Record<
  string,
  { stem: string; choices: string[]; correctIndex: number }
> = {};
