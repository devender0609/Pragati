// Item-review priority (v0.25).
//
// Helper that scores each item on a three-level priority — high, medium,
// low — so the Item Review view can show teachers the "next 10 to look at"
// without having to sort manually. All thresholds are prototype heuristics
// (NOT calibrated psychometric cuts); the goal is to focus a teacher's
// attention on the items most likely to need a second look.
//
// Priority rules (most → least urgent):
//
//   HIGH — at least one of:
//     - The item is marked "needs revision" by a teacher.
//     - The item alignment has a non-empty audit-flag list.
//     - The item alignment confidence is `needs_teacher_review` (low).
//     - The item has high usage (≥ MIN_USAGE attempts) AND low accuracy
//       (< LOW_ACCURACY_THRESHOLD).
//
//   MEDIUM — at least one of (and no HIGH trigger):
//     - The item alignment confidence is `medium`.
//     - The item belongs to a Class 7 module (new content, pre-pilot).
//     - The item carries any quality flag (frequent misconception, high
//       average time, etc.) without yet meeting the HIGH bar.
//
//   LOW — everything else:
//     - Item is teacher-approved, OR
//     - Item alignment confidence is `high` and no other signals fire.
//
// The numeric `score` is used only for stable ordering inside a priority
// bucket; it is NOT a calibrated quality measure.

import { ITEMS, type Item } from '../data/items';
import { getItemAlignment } from '../data/alignment';
import {
  buildItemQualityById,
  type ItemQualitySummary,
} from './itemQuality';
import { MODULE_FOR_SKILL, type ItemReview, type Session } from '../types';

export type ReviewPriority = 'high' | 'medium' | 'low';

export const REVIEW_PRIORITY_LABELS: Record<ReviewPriority, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

export const REVIEW_PRIORITY_CLASSES: Record<ReviewPriority, string> = {
  high: 'bg-rose-50 text-rose-700 ring-rose-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export type ReviewPrioritySummary = {
  itemId: string;
  priority: ReviewPriority;
  score: number;
  reasons: string[];
};

const MIN_USAGE = 5;
const LOW_ACCURACY_THRESHOLD = 0.5;

function isClass7Item(item: Item): boolean {
  return MODULE_FOR_SKILL[item.skillId].startsWith('c7_');
}

function computeItemPriority(
  item: Item,
  review: ItemReview | undefined,
  quality: ItemQualitySummary | undefined
): ReviewPrioritySummary {
  const alignment = getItemAlignment(item);
  const reasons: string[] = [];
  let score = 0;

  // HIGH triggers
  let high = false;
  if (review?.status === 'needs_revision') {
    high = true;
    score += 100;
    reasons.push('Teacher marked "needs revision"');
  }
  if (alignment.auditFlags.length > 0) {
    high = true;
    score += 40 + alignment.auditFlags.length * 2;
    reasons.push(
      `${alignment.auditFlags.length} audit flag${alignment.auditFlags.length === 1 ? '' : 's'} on the alignment`
    );
  }
  if (alignment.alignmentConfidence === 'needs_teacher_review') {
    high = true;
    score += 30;
    reasons.push('Alignment confidence: needs teacher review');
  }
  if (
    quality &&
    quality.attempts >= MIN_USAGE &&
    quality.accuracy < LOW_ACCURACY_THRESHOLD
  ) {
    high = true;
    score += 25 + Math.round((1 - quality.accuracy) * 20);
    reasons.push(
      `High usage (${quality.attempts} attempts) with low accuracy (${Math.round(quality.accuracy * 100)}%)`
    );
  }
  if (high) {
    return { itemId: item.id, priority: 'high', score, reasons };
  }

  // MEDIUM triggers
  let medium = false;
  if (alignment.alignmentConfidence === 'medium') {
    medium = true;
    score += 15;
    reasons.push('Alignment confidence: medium');
  }
  if (isClass7Item(item) && review?.status !== 'approved') {
    medium = true;
    score += 10;
    reasons.push('Class 7 starter / deepening content (pre-pilot)');
  }
  if (quality && quality.flags.length > 0) {
    medium = true;
    score += 5 + quality.flags.length;
    reasons.push(
      `Quality flag${quality.flags.length === 1 ? '' : 's'}: ${quality.flags.join(', ')}`
    );
  }
  if (medium) {
    return { itemId: item.id, priority: 'medium', score, reasons };
  }

  // LOW (default)
  if (review?.status === 'approved') {
    reasons.push('Teacher-approved');
  } else if (alignment.alignmentConfidence === 'high') {
    reasons.push('Alignment confidence: high');
  }
  return { itemId: item.id, priority: 'low', score, reasons };
}

export function buildReviewPriorityById(
  sessions: Session[],
  reviews: ItemReview[],
  items: Item[] = ITEMS
): Record<string, ReviewPrioritySummary> {
  const reviewsById = new Map(reviews.map((r) => [r.itemId, r]));
  const qualityById = buildItemQualityById(sessions, reviews, items);
  const out: Record<string, ReviewPrioritySummary> = {};
  for (const it of items) {
    out[it.id] = computeItemPriority(
      it,
      reviewsById.get(it.id),
      qualityById[it.id]
    );
  }
  return out;
}

export function priorityCounts(
  summaries: ReviewPrioritySummary[]
): Record<ReviewPriority, number> {
  const out: Record<ReviewPriority, number> = { high: 0, medium: 0, low: 0 };
  for (const s of summaries) out[s.priority] += 1;
  return out;
}

export function rankByPriority<T extends { id: string }>(
  items: T[],
  priorityById: Record<string, ReviewPrioritySummary>
): T[] {
  const rank: Record<ReviewPriority, number> = { high: 2, medium: 1, low: 0 };
  return [...items].sort((a, b) => {
    const pa = priorityById[a.id];
    const pb = priorityById[b.id];
    if (!pa || !pb) return 0;
    if (rank[pa.priority] !== rank[pb.priority]) {
      return rank[pb.priority] - rank[pa.priority];
    }
    if (pa.score !== pb.score) return pb.score - pa.score;
    return a.id.localeCompare(b.id);
  });
}

export function topPriorityItems<T extends { id: string }>(
  items: T[],
  priorityById: Record<string, ReviewPrioritySummary>,
  limit: number
): T[] {
  return rankByPriority(items, priorityById).slice(0, limit);
}
