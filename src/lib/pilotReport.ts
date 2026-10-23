// Pilot Report aggregator (v0.12).
//
// Pure function over device state. Produces a single typed PilotReport
// object that the PilotReportView renders and the JSON exporter serialises.
//
// Important: nothing in here is calibrated. It is a class-summary view of
// what's on this device for one pilot (or "no pilot — all data") so the
// teacher can see the prototype's pilot run at a glance.
//
// All thresholds and labels are restated from existing libraries
// (teachingPlan.ts, itemQuality.ts, workflow.ts) — we don't change behavior.
import { ITEMS } from '../data/items';
import {
  MODULE_FOR_SKILL,
  MODULE_LABELS,
  SKILL_LABELS,
  SKILL_MODE_LABELS,
  type ModuleId,
  type PilotMetadata,
  type SessionFeedback,
  type SessionFeedbackDifficulty,
  type Session,
  type SkillId,
  type SkillMode,
  type Student,
  type ItemReview,
} from '../types';
import {
  buildItemQualitySummary,
  type ItemQualitySummary,
} from './itemQuality';
import { buildTeachingPlan } from './teachingPlan';
import { isItemFlagged } from './workflow';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PilotReportScope =
  | { kind: 'pilot'; pilot: PilotMetadata }
  | { kind: 'all' };

export type PilotModeUsage = {
  mode: SkillMode;
  label: string;
  sessions: number;
};

export type WeakSkillRow = {
  skillId: SkillId;
  module: ModuleId;
  moduleLabel: string;
  skillLabel: string;
  attempted: number;
  correct: number;
  accuracy: number;
  studentsAffected: number;
};

export type MisconceptionRow = {
  code: string;
  label: string;
  occurrences: number;
  studentsAffected: number;
  itemIds: string[];
};

export type StudentNeedingSupportRow = {
  studentId: string;
  name: string;
  weakSkillIds: SkillId[];
  weakSkillLabels: string[];
  lastSessionAt: number | null;
};

export type FlaggedItemUsedRow = {
  itemId: string;
  module: ModuleId;
  moduleLabel: string;
  skillId: SkillId;
  attempts: number;
  accuracy: number;
};

export type ItemReviewStatusBreakdown = {
  totalItems: number;
  notReviewed: number;
  needsRevision: number;
  approved: number;
  reviewedFraction: number; // 0..1
};

export type FeedbackSummary = {
  totalFeedback: number;
  difficulty: Record<SessionFeedbackDifficulty, number>;
  picturesHelped: {
    yes: number;
    no: number;
    mixed: number;
    na: number;
  };
  hardestPartSamples: string[]; // up to 5 non-empty
  confusingQuestionsSamples: string[]; // up to 5 non-empty
};

export type RecommendedNextAction = {
  // Short headline shown on the report.
  headline: string;
  // 1–2 sentence explanation of why this is the next step.
  body: string;
  // Reference id so the UI can wire a CTA.
  refSkillId: SkillId | null;
};

export type PilotReport = {
  generatedAt: number;
  scope: PilotReportScope;
  // High-level counts.
  studentsTested: number;
  sessionsCompleted: number;
  sessionsInProgress: number;
  modesUsed: PilotModeUsage[];
  // Quality / performance.
  averageAccuracy: number;        // 0..1; fraction of correct responses across all completed sessions in scope
  averageTimePerItemSec: number;  // 0 if no items
  weakestSkills: WeakSkillRow[];
  topMisconceptions: MisconceptionRow[];
  studentsNeedingSupport: StudentNeedingSupportRow[];
  // Item-level signals.
  flaggedItemsUsed: FlaggedItemUsedRow[];
  itemReviewStatus: ItemReviewStatusBreakdown;
  // Student feedback.
  feedback: FeedbackSummary;
  // Single recommended next teaching action.
  recommendedNextAction: RecommendedNextAction;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MAX_FREE_TEXT_SAMPLES = 5;

const inScope = (s: Session, scope: PilotReportScope): boolean => {
  if (scope.kind === 'all') return true;
  return s.pilotId === scope.pilot.id;
};

// MisconceptionCode-aware label fallback. The TeachingPlan output already
// surfaces a `label` on each misconception, but we still defensively
// title-case the code for any unknown values.
const titleCaseFromCode = (code: string): string =>
  code.replace(/_/g, ' ').replace(/(^|\s)\S/g, (m) => m.toUpperCase());

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------
export function buildPilotReport(
  scope: PilotReportScope,
  students: Student[],
  allSessions: Session[],
  feedback: SessionFeedback[],
  itemReviews: ItemReview[]
): PilotReport {
  // Sessions in scope.
  const sessionsScoped = allSessions.filter((s) => inScope(s, scope));
  const completed = sessionsScoped.filter((s) => s.completedAt !== null);
  const inProgress = sessionsScoped.length - completed.length;
  const studentIdsInScope = new Set(sessionsScoped.map((s) => s.studentId));
  const studentsInScope = students.filter((s) => studentIdsInScope.has(s.id));

  // Mode usage histogram.
  const modeCounts = new Map<SkillMode, number>();
  for (const s of completed) {
    modeCounts.set(s.skillId, (modeCounts.get(s.skillId) ?? 0) + 1);
  }
  const modesUsed: PilotModeUsage[] = Array.from(modeCounts.entries())
    .map(([mode, sessions]) => ({
      mode,
      label: SKILL_MODE_LABELS[mode] ?? String(mode),
      sessions,
    }))
    .sort((a, b) => b.sessions - a.sessions);

  // Average accuracy + average time per item across all responses in scope.
  let totalResponses = 0;
  let totalCorrect = 0;
  let totalTimeMs = 0;
  for (const s of completed) {
    for (const r of s.responses) {
      totalResponses += 1;
      if (r.correct) totalCorrect += 1;
      totalTimeMs += r.timeMs;
    }
  }
  const averageAccuracy = totalResponses === 0 ? 0 : totalCorrect / totalResponses;
  const averageTimePerItemSec =
    totalResponses === 0 ? 0 : Math.round(totalTimeMs / totalResponses / 1000);

  // Weakest skills + misconceptions + students needing support — reuse the
  // existing TeachingPlan aggregator (scoped to the same students+sessions).
  const plan = buildTeachingPlan(studentsInScope, completed, ITEMS);

  const weakestSkills: WeakSkillRow[] = plan.weakestSkills.map((w) => ({
    skillId: w.skillId,
    module: w.module,
    moduleLabel: MODULE_LABELS[w.module],
    skillLabel: SKILL_LABELS[w.skillId],
    attempted: w.attempted,
    correct: w.correct,
    accuracy: w.accuracy,
    studentsAffected: w.studentsAffected,
  }));

  const topMisconceptions: MisconceptionRow[] = plan.topMisconceptions.map(
    (m) => ({
      code: m.code,
      label: m.label || titleCaseFromCode(m.code),
      occurrences: m.occurrences,
      studentsAffected: m.studentsAffected,
      itemIds: m.itemIds,
    })
  );

  const studentsNeedingSupport: StudentNeedingSupportRow[] =
    plan.studentsNeedingSupport.map((sr) => ({
      studentId: sr.studentId,
      name: sr.name,
      weakSkillIds: sr.weakSkills,
      weakSkillLabels: sr.weakSkills.map((s) => `${s} — ${SKILL_LABELS[s]}`),
      lastSessionAt: sr.lastSessionAt,
    }));

  // Flagged items USED in scope: any item id that appears in a scoped
  // response and is flagged by the workflow heuristic.
  const itemsAttempted = new Map<
    string,
    { attempts: number; correct: number }
  >();
  for (const s of completed) {
    for (const r of s.responses) {
      const acc = itemsAttempted.get(r.itemId) ?? { attempts: 0, correct: 0 };
      acc.attempts += 1;
      if (r.correct) acc.correct += 1;
      itemsAttempted.set(r.itemId, acc);
    }
  }
  const flaggedItemsUsed: FlaggedItemUsedRow[] = [];
  for (const [itemId, acc] of itemsAttempted.entries()) {
    if (!isItemFlagged(itemId)) continue;
    const item = ITEMS.find((it) => it.id === itemId);
    if (!item) continue;
    flaggedItemsUsed.push({
      itemId,
      module: MODULE_FOR_SKILL[item.skillId],
      moduleLabel: MODULE_LABELS[MODULE_FOR_SKILL[item.skillId]],
      skillId: item.skillId,
      attempts: acc.attempts,
      accuracy: acc.attempts === 0 ? 0 : acc.correct / acc.attempts,
    });
  }
  flaggedItemsUsed.sort((a, b) => b.attempts - a.attempts);

  // Item review status — global across the bank, not scoped (reviews are
  // per-item, not per-pilot).
  const totalItems = ITEMS.length;
  let approved = 0;
  let needsRevision = 0;
  for (const r of itemReviews) {
    if (r.status === 'approved') approved += 1;
    else if (r.status === 'needs_revision') needsRevision += 1;
  }
  const reviewedCount = approved + needsRevision;
  const itemReviewStatus: ItemReviewStatusBreakdown = {
    totalItems,
    notReviewed: Math.max(0, totalItems - reviewedCount),
    needsRevision,
    approved,
    reviewedFraction: totalItems === 0 ? 0 : reviewedCount / totalItems,
  };

  // Feedback summary — only feedback for sessions in scope.
  const inScopeSessionIds = new Set(completed.map((s) => s.id));
  const fbInScope = feedback.filter((f) => inScopeSessionIds.has(f.sessionId));
  const difficulty: Record<SessionFeedbackDifficulty, number> = {
    easy: 0,
    okay: 0,
    hard: 0,
  };
  const picturesHelped = { yes: 0, no: 0, mixed: 0, na: 0 };
  const hardestPartSamples: string[] = [];
  const confusingQuestionsSamples: string[] = [];
  for (const f of fbInScope) {
    difficulty[f.difficulty] += 1;
    picturesHelped[f.picturesHelped] += 1;
    if (
      f.hardestPart.trim() &&
      hardestPartSamples.length < MAX_FREE_TEXT_SAMPLES
    ) {
      hardestPartSamples.push(f.hardestPart.trim());
    }
    if (
      f.confusingQuestions.trim() &&
      confusingQuestionsSamples.length < MAX_FREE_TEXT_SAMPLES
    ) {
      confusingQuestionsSamples.push(f.confusingQuestions.trim());
    }
  }
  const feedbackSummary: FeedbackSummary = {
    totalFeedback: fbInScope.length,
    difficulty,
    picturesHelped,
    hardestPartSamples,
    confusingQuestionsSamples,
  };

  // Recommended next teaching action.
  const recommendedNextAction = computeRecommendedNextAction({
    weakestSkills,
    topMisconceptions,
    studentsNeedingSupport,
    sessionsCompleted: completed.length,
    flaggedItemsUsedCount: flaggedItemsUsed.length,
  });

  return {
    generatedAt: Date.now(),
    scope,
    studentsTested: studentsInScope.length,
    sessionsCompleted: completed.length,
    sessionsInProgress: inProgress,
    modesUsed,
    averageAccuracy,
    averageTimePerItemSec,
    weakestSkills,
    topMisconceptions,
    studentsNeedingSupport,
    flaggedItemsUsed,
    itemReviewStatus,
    feedback: feedbackSummary,
    recommendedNextAction,
  };
}

// ---------------------------------------------------------------------------
// Recommended next action
// ---------------------------------------------------------------------------
// Heuristic — never claims to be calibrated. Picks the single most useful
// thing for the teacher to do next based on what the data shows.
function computeRecommendedNextAction(input: {
  weakestSkills: WeakSkillRow[];
  topMisconceptions: MisconceptionRow[];
  studentsNeedingSupport: StudentNeedingSupportRow[];
  sessionsCompleted: number;
  flaggedItemsUsedCount: number;
}): RecommendedNextAction {
  if (input.sessionsCompleted === 0) {
    return {
      headline: 'Run a baseline session with at least 5 students',
      body:
        'There are no completed sessions in scope yet. The pilot report needs real attempts before it can suggest a next teaching action.',
      refSkillId: null,
    };
  }

  if (input.flaggedItemsUsedCount > 0 && input.sessionsCompleted < 5) {
    return {
      headline: 'Review flagged items before running more sessions',
      body:
        'Some items used so far carry audit flags or low alignment confidence. A teacher should review them before scaling the pilot.',
      refSkillId: null,
    };
  }

  if (input.weakestSkills.length > 0) {
    const w = input.weakestSkills[0];
    return {
      headline: `Reteach ${w.skillId} — ${w.skillLabel}`,
      body:
        `${w.studentsAffected} student(s) are below 70% accuracy on ${w.skillId} ` +
        `(${Math.round(w.accuracy * 100)}% across ${w.attempted} attempt(s)). ` +
        `Open the Learn page for ${w.skillId} or use Teaching Plan to form a small group.`,
      refSkillId: w.skillId,
    };
  }

  if (input.topMisconceptions.length > 0) {
    const m = input.topMisconceptions[0];
    return {
      headline: `Address misconception: ${m.label}`,
      body:
        `Seen ${m.occurrences} time(s) across ${m.studentsAffected} student(s). ` +
        `A short whole-class clarification before the next session may help.`,
      refSkillId: null,
    };
  }

  return {
    headline: 'Class is on track — keep collecting evidence',
    body:
      'No skill is below the weak-accuracy threshold and no single misconception dominates. Continue with the planned cadence and re-check this report each week.',
    refSkillId: null,
  };
}

// ---------------------------------------------------------------------------
// Plain-text summary (used by Copy-to-clipboard button)
// ---------------------------------------------------------------------------
export function pilotReportToText(report: PilotReport): string {
  const lines: string[] = [];
  const scopeLine =
    report.scope.kind === 'pilot'
      ? `Pilot: ${report.scope.pilot.className} — ${report.scope.pilot.teacherName} (${report.scope.pilot.school})`
      : 'Scope: all data on this device (no specific pilot)';
  lines.push('Pragati — Pilot Report');
  lines.push(scopeLine);
  lines.push(`Generated: ${new Date(report.generatedAt).toISOString()}`);
  lines.push('');
  lines.push(
    `Students tested: ${report.studentsTested} · Sessions completed: ${report.sessionsCompleted}` +
      (report.sessionsInProgress > 0
        ? ` · In-progress: ${report.sessionsInProgress}`
        : '')
  );
  if (report.modesUsed.length > 0) {
    lines.push(
      `Modes used: ` +
        report.modesUsed
          .map((m) => `${m.label} (${m.sessions})`)
          .join(', ')
    );
  }
  lines.push(
    `Average accuracy: ${Math.round(report.averageAccuracy * 100)}% · ` +
      `Average time per item: ${report.averageTimePerItemSec}s`
  );
  lines.push('');
  if (report.weakestSkills.length > 0) {
    lines.push('Weakest skills:');
    for (const w of report.weakestSkills.slice(0, 3)) {
      lines.push(
        `  - ${w.skillId} ${w.skillLabel}: ${Math.round(w.accuracy * 100)}% ` +
          `(${w.correct}/${w.attempted}, ${w.studentsAffected} student(s))`
      );
    }
    lines.push('');
  }
  if (report.topMisconceptions.length > 0) {
    lines.push('Top misconceptions:');
    for (const m of report.topMisconceptions.slice(0, 3)) {
      lines.push(
        `  - ${m.label}: ${m.occurrences} time(s) across ${m.studentsAffected} student(s)`
      );
    }
    lines.push('');
  }
  if (report.studentsNeedingSupport.length > 0) {
    lines.push('Students needing support:');
    for (const s of report.studentsNeedingSupport.slice(0, 5)) {
      lines.push(
        `  - ${s.name}: ${s.weakSkillIds.join(', ') || 'see report'}`
      );
    }
    lines.push('');
  }
  lines.push(
    `Item review: ${report.itemReviewStatus.approved} approved, ` +
      `${report.itemReviewStatus.needsRevision} need revision, ` +
      `${report.itemReviewStatus.notReviewed} not reviewed (of ${report.itemReviewStatus.totalItems}).`
  );
  if (report.flaggedItemsUsed.length > 0) {
    lines.push(
      `Flagged items used in scope: ${report.flaggedItemsUsed.length}.`
    );
  }
  lines.push('');
  lines.push(
    `Student feedback (n=${report.feedback.totalFeedback}): ` +
      `easy=${report.feedback.difficulty.easy}, ` +
      `okay=${report.feedback.difficulty.okay}, ` +
      `hard=${report.feedback.difficulty.hard}`
  );
  lines.push('');
  lines.push(`Recommended next action: ${report.recommendedNextAction.headline}`);
  lines.push(report.recommendedNextAction.body);
  lines.push('');
  lines.push(
    'Note: Pragati is a CBSE/NCERT-informed prototype. Not an official CBSE alignment, ' +
      'not a calibrated assessment. Teacher review required before any pilot decisions.'
  );
  return lines.join('\n');
}

// Convenience re-export so the View can show item-quality numbers without
// having to import itemQuality directly.
export type { ItemQualitySummary };
export { buildItemQualitySummary };
