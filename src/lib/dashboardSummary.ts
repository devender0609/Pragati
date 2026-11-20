// v0.18: aggregator for the teacher-dashboard summary widget.
//
// Produces a single immutable object with the high-level counts the teacher
// wants on first sight:
//
//   - students            — unique students with at least one session
//   - rosterSize          — total students recorded on this device (incl. those
//                            who never assessed)
//   - activeClassrooms    — classrooms with at least one student
//   - sessionsCompleted   — completed sessions across all time
//   - sessionsLast7d      — completed sessions in the last 7 days
//   - averageAccuracy     — overall accuracy on completed sessions (0..1)
//   - weakestSkills       — top 3 SkillIds with lowest class accuracy (≥ N
//                            attempts)
//   - flaggedItems        — count of items with at least one item_review with
//                            status !== 'not_reviewed' AND wordingClear/etc
//                            'no' (we just count needs_revision-marked items)
//   - topMisconceptions   — top 3 misconception codes by total wrong-answer
//                            count across all completed sessions
//   - recentActivity      — last few completed sessions (capped 5), with
//                            student name + skill + completedAt
//   - accuracyTrend       — array of 4 most recent weekly buckets (oldest
//                            first), each { weekStartMs, accuracy, sessions }
//
// All helpers are pure — the caller passes in the device's storage snapshot
// so the component stays trivially memoisable. Nothing touches Firebase.

import type { Item, MisconceptionCode } from '../data/items';
import { MISCONCEPTION_LABELS } from '../data/items';
import {
  averageTimeSec,
  correctCount,
  summarizeBySkill,
  summarizeMisconceptions,
} from './scoring';
import type { Session, SkillId, Student } from '../types';
import { SKILL_LABELS } from '../types';
import type { Classroom } from './cloudStore';
import type { ItemReview } from '../types';

export type WeakestSkill = {
  skillId: SkillId;
  label: string;
  attempted: number;
  accuracy: number;
};

export type TopMisconception = {
  code: MisconceptionCode;
  label: string;
  count: number;
};

export type RecentActivity = {
  sessionId: string;
  studentName: string;
  skillMode: string;
  completedAt: number;
};

export type AccuracyTrendBucket = {
  weekStartMs: number;
  accuracy: number;
  sessions: number;
};

export type DashboardSummary = {
  students: number;
  rosterSize: number;
  activeClassrooms: number;
  sessionsCompleted: number;
  sessionsLast7d: number;
  averageAccuracy: number;
  averageTimeSec: number;
  weakestSkills: WeakestSkill[];
  flaggedItemsCount: number;
  topMisconceptions: TopMisconception[];
  recentActivity: RecentActivity[];
  accuracyTrend: AccuracyTrendBucket[];
};

// Skills are "weakest" candidates only when the class has tried at least
// this many items in them. Avoids 1-attempt 0% domination.
const MIN_ATTEMPTS_FOR_WEAKNESS = 4;
// "Recent activity" cap.
const RECENT_ACTIVITY_COUNT = 5;
// Trend bucket count (most recent first internally, reversed for display).
const TREND_BUCKETS = 4;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function buildDashboardSummary(input: {
  students: Student[];
  sessions: Session[];
  classrooms: Classroom[];
  itemReviews: ItemReview[];
  items: Item[];
}): DashboardSummary {
  const { students, sessions, classrooms, itemReviews, items } = input;
  const now = Date.now();

  const completed = sessions.filter((s) => s.completedAt !== null);
  const allResponses = completed.flatMap((s) => s.responses);
  const totalCorrect = correctCount(allResponses);

  // Active classrooms = those with at least one student id assigned.
  const activeClassrooms = classrooms.filter((c) => c.studentIds.length > 0).length;

  const sessionsLast7d = completed.filter(
    (s) => s.completedAt !== null && now - s.completedAt < SEVEN_DAYS_MS
  ).length;

  // Per-skill class accuracy (aggregate across all completed sessions).
  const breakdown = summarizeBySkill(allResponses, items);
  const weakest: WeakestSkill[] = breakdown
    .filter((b) => b.attempted >= MIN_ATTEMPTS_FOR_WEAKNESS)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map((b) => ({
      skillId: b.skillId,
      label: SKILL_LABELS[b.skillId],
      attempted: b.attempted,
      accuracy: b.accuracy,
    }));

  // Top misconceptions across the corpus.
  const allMisc = summarizeMisconceptions(allResponses);
  const topMisconceptions: TopMisconception[] = allMisc.slice(0, 3).map((m) => ({
    code: m.code,
    label: MISCONCEPTION_LABELS[m.code],
    count: m.count,
  }));

  // Flagged item count = items where any review is marked needs_revision.
  const flaggedIds = new Set(
    itemReviews
      .filter((r) => r.status === 'needs_revision')
      .map((r) => r.itemId)
  );

  // Build a quick student-name lookup, falling back to the snapshot.
  const studentNameById = new Map(students.map((s) => [s.id, s.name]));

  const recentActivity: RecentActivity[] = completed
    .slice()
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
    .slice(0, RECENT_ACTIVITY_COUNT)
    .map((s) => ({
      sessionId: s.id,
      studentName:
        studentNameById.get(s.studentId) ?? s.studentSnapshot.name ?? 'Student',
      skillMode: s.skillId,
      completedAt: s.completedAt ?? 0,
    }));

  // Accuracy trend: 4 weekly buckets ending today (oldest first).
  const buckets: AccuracyTrendBucket[] = [];
  for (let i = TREND_BUCKETS - 1; i >= 0; i--) {
    const end = now - i * SEVEN_DAYS_MS;
    const start = end - SEVEN_DAYS_MS;
    const inBucket = completed.filter(
      (s) =>
        s.completedAt !== null && s.completedAt >= start && s.completedAt < end
    );
    const responses = inBucket.flatMap((s) => s.responses);
    const acc =
      responses.length === 0 ? 0 : correctCount(responses) / responses.length;
    buckets.push({
      weekStartMs: start,
      accuracy: acc,
      sessions: inBucket.length,
    });
  }

  return {
    students: new Set(sessions.map((s) => s.studentId)).size,
    rosterSize: students.length,
    activeClassrooms,
    sessionsCompleted: completed.length,
    sessionsLast7d,
    averageAccuracy:
      allResponses.length === 0
        ? 0
        : totalCorrect / allResponses.length,
    averageTimeSec: averageTimeSec(allResponses),
    weakestSkills: weakest,
    flaggedItemsCount: flaggedIds.size,
    topMisconceptions,
    recentActivity,
    accuracyTrend: buckets,
  };
}
