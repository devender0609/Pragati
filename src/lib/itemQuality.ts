// Item-quality flags (v0.8).
//
// Pure functions over the bank, the device's session history, and any
// teacher item reviews. Returns one ItemQuality record per item with a set
// of flags surfaced on the Item Review page so the teacher can spot items
// that misbehave at the class level.
//
// All thresholds are conservative prototype heuristics, NOT calibrated
// item-quality cuts. They are intended to focus a teacher's attention on
// items that may need a second look — not to label items "bad".

import { ITEMS, type Item, type MisconceptionCode } from '../data/items';
import type { ItemReview, Session } from '../types';

export type ItemQualityFlag =
  | 'low_accuracy'
  | 'high_avg_time'
  | 'frequent_misconception'
  | 'too_few_attempts'
  | 'needs_teacher_review';

export const FLAG_LABELS: Record<ItemQualityFlag, string> = {
  low_accuracy: 'Low accuracy',
  high_avg_time: 'High average time',
  frequent_misconception: 'Frequent misconception',
  too_few_attempts: 'Too few attempts',
  needs_teacher_review: 'Needs teacher review',
};

export const FLAG_DESCRIPTIONS: Record<ItemQualityFlag, string> = {
  low_accuracy:
    'Fewer than half of attempts on this item were correct (with at least the minimum number of attempts).',
  high_avg_time:
    'Average time on this item is more than 1.5× the seed estimate. May suggest the wording is heavy or the picture is unclear.',
  frequent_misconception:
    'A single misconception code is responsible for at least half of the wrong answers on this item.',
  too_few_attempts:
    'This item has fewer than 3 attempts on the device. The other flags are not yet meaningful.',
  needs_teacher_review:
    'A teacher review marked this item as "needs revision", or the item carries 2+ other quality flags.',
};

export type ItemQualitySummary = {
  itemId: string;
  attempts: number;
  correct: number;
  accuracy: number;          // 0..1; 0 if attempts === 0
  avgTimeSec: number;
  estimatedTimeSec: number;
  topMisconception: {
    code: MisconceptionCode;
    count: number;
    rate: number;            // count / wrongCount
  } | null;
  flags: ItemQualityFlag[];
};

const MIN_ATTEMPTS = 3;
const LOW_ACCURACY_THRESHOLD = 0.5;
const HIGH_TIME_MULTIPLIER = 1.5;
const FREQUENT_MISCONCEPTION_RATE = 0.5;

// Build a per-item summary across every completed session.
export function buildItemQualitySummary(
  sessions: Session[],
  reviews: ItemReview[],
  items: Item[] = ITEMS
): ItemQualitySummary[] {
  const reviewByItemId = new Map(reviews.map((r) => [r.itemId, r]));

  type Acc = {
    item: Item;
    attempts: number;
    correct: number;
    timeMsTotal: number;
    misconceptionCounts: Map<MisconceptionCode, number>;
    wrongCount: number;
  };
  const acc = new Map<string, Acc>();
  for (const it of items) {
    acc.set(it.id, {
      item: it,
      attempts: 0,
      correct: 0,
      timeMsTotal: 0,
      misconceptionCounts: new Map(),
      wrongCount: 0,
    });
  }

  for (const s of sessions) {
    if (s.completedAt === null) continue;
    for (const r of s.responses) {
      const a = acc.get(r.itemId);
      if (!a) continue; // item removed from bank
      a.attempts += 1;
      a.timeMsTotal += r.timeMs;
      if (r.correct) {
        a.correct += 1;
      } else {
        a.wrongCount += 1;
        if (r.misconceptionTriggered !== 'none') {
          a.misconceptionCounts.set(
            r.misconceptionTriggered,
            (a.misconceptionCounts.get(r.misconceptionTriggered) ?? 0) + 1
          );
        }
      }
    }
  }

  const summaries: ItemQualitySummary[] = [];
  for (const a of acc.values()) {
    const accuracy = a.attempts === 0 ? 0 : a.correct / a.attempts;
    const avgTimeSec =
      a.attempts === 0 ? 0 : Math.round(a.timeMsTotal / a.attempts / 1000);

    let topMisconception: ItemQualitySummary['topMisconception'] = null;
    let topCount = 0;
    for (const [code, count] of a.misconceptionCounts.entries()) {
      if (count > topCount) {
        topCount = count;
        topMisconception = {
          code,
          count,
          rate: a.wrongCount === 0 ? 0 : count / a.wrongCount,
        };
      }
    }

    const flags: ItemQualityFlag[] = [];
    if (a.attempts < MIN_ATTEMPTS) {
      flags.push('too_few_attempts');
    } else {
      if (accuracy < LOW_ACCURACY_THRESHOLD) flags.push('low_accuracy');
      if (
        a.item.estimatedTimeSec > 0 &&
        avgTimeSec > a.item.estimatedTimeSec * HIGH_TIME_MULTIPLIER
      ) {
        flags.push('high_avg_time');
      }
      if (
        topMisconception !== null &&
        topMisconception.rate >= FREQUENT_MISCONCEPTION_RATE &&
        topMisconception.count >= 2
      ) {
        flags.push('frequent_misconception');
      }
    }

    // "needs_teacher_review" flag is set when the teacher review marked
    // this item as 'needs_revision', OR when there are at least 2 other
    // quality flags above.
    const review = reviewByItemId.get(a.item.id);
    if (review?.status === 'needs_revision' || flags.length >= 2) {
      flags.push('needs_teacher_review');
    }

    summaries.push({
      itemId: a.item.id,
      attempts: a.attempts,
      correct: a.correct,
      accuracy,
      avgTimeSec,
      estimatedTimeSec: a.item.estimatedTimeSec,
      topMisconception,
      flags,
    });
  }

  return summaries;
}

// Convenience: build one summary keyed by itemId.
export function buildItemQualityById(
  sessions: Session[],
  reviews: ItemReview[],
  items: Item[] = ITEMS
): Record<string, ItemQualitySummary> {
  const out: Record<string, ItemQualitySummary> = {};
  for (const s of buildItemQualitySummary(sessions, reviews, items)) {
    out[s.itemId] = s;
  }
  return out;
}

// Convenience: produce the count of items per flag, used by the
// Item Review header and the export bundle.
export function flagCounts(
  summaries: ItemQualitySummary[]
): Record<ItemQualityFlag, number> {
  const out: Record<ItemQualityFlag, number> = {
    low_accuracy: 0,
    high_avg_time: 0,
    frequent_misconception: 0,
    too_few_attempts: 0,
    needs_teacher_review: 0,
  };
  for (const s of summaries) {
    for (const f of s.flags) out[f] += 1;
  }
  return out;
}
