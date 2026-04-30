// Skill-progression library (v0.6).
//
// Reads completed sessions from storage and turns them into a per-skill
// progression record:
//
//   not_started → no responses on this skill ever
//   developing  → some responses, but accuracy < 0.70 OR fewer than 5 attempts
//   strong      → at least 5 attempts AND accuracy ≥ 0.70
//
// These thresholds are deliberate prototype heuristics, NOT calibrated cut
// scores. The labels are surfaced to the user as a friendly progression
// status, never as a measurement claim.
//
// We also compute a per-skill "unlocked" flag from STATIC_PREREQUISITES_BY_SKILL:
// a skill is unlocked when every static prerequisite is at least 'developing'
// (i.e., the student has touched it at all). FR.02 has no prereqs, so it is
// always unlocked. The unlocked flag is used to draw a subtle visual hint
// on skill cards — it does NOT prevent the student from starting a skill.

import type { Item } from '../data/items';
import type { Session, SkillId } from '../types';
import { SKILL_IDS_ORDERED } from '../types';
import { STATIC_PREREQUISITES_BY_SKILL } from './scoring';

export type SkillStatus = 'not_started' | 'developing' | 'strong';

export const SKILL_STATUS_LABELS: Record<SkillStatus, string> = {
  not_started: 'Not started',
  developing: 'Developing',
  strong: 'Strong',
};

export const SKILL_STATUS_DESCRIPTIONS: Record<SkillStatus, string> = {
  not_started:
    'No responses on this skill yet on this device.',
  developing:
    'Some responses are in. Accuracy is still below 70% or there are fewer than 5 attempts so far.',
  strong:
    'At least 5 attempts and accuracy is 70% or higher on this device. Prototype signal — not a calibrated mastery claim.',
};

export const SKILL_STATUS_COLOR: Record<SkillStatus, string> = {
  not_started: 'bg-slate-100 text-slate-600 ring-slate-200',
  developing: 'bg-amber-50 text-amber-700 ring-amber-200',
  strong: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

const STATUS_THRESHOLD_ATTEMPTS = 5;
const STATUS_THRESHOLD_ACCURACY = 0.7;

export type SkillProgress = {
  skillId: SkillId;
  status: SkillStatus;
  attempted: number;          // total responses on this skill across all sessions
  correct: number;
  accuracy: number;            // 0..1; 0 if attempted === 0
  sessionsTouched: number;     // how many sessions included a response on this skill
  unlocked: boolean;           // true iff every static prereq is at least 'developing'
  prereqsRemaining: SkillId[]; // prereqs that are still 'not_started'
};

const computeStatus = (
  attempted: number,
  accuracy: number
): SkillStatus => {
  if (attempted === 0) return 'not_started';
  if (
    attempted >= STATUS_THRESHOLD_ATTEMPTS &&
    accuracy >= STATUS_THRESHOLD_ACCURACY
  ) {
    return 'strong';
  }
  return 'developing';
};

const isCurriculumSkillCode = (code: string): code is SkillId =>
  (SKILL_IDS_ORDERED as string[]).includes(code);

// Compute per-skill progression across the device's session history.
//
// All completed sessions are considered (including mixed sessions, which
// contribute to whichever skill each item belongs to). Items that no longer
// exist in the bank are silently skipped.
export const computeSkillProgress = (
  sessions: Session[],
  items: Item[] = []
): Record<SkillId, SkillProgress> => {
  const itemSkillById = new Map(items.map((it) => [it.id, it.skillId]));

  // Build empty totals from SKILL_IDS_ORDERED so this function automatically
  // covers any new skill added to the type later.
  const totals = {} as Record<SkillId, { attempted: number; correct: number }>;
  const sessionsTouched = {} as Record<SkillId, Set<string>>;
  for (const s of SKILL_IDS_ORDERED) {
    totals[s] = { attempted: 0, correct: 0 };
    sessionsTouched[s] = new Set();
  }

  for (const s of sessions) {
    if (s.completedAt === null) continue;
    for (const r of s.responses) {
      const skill = itemSkillById.get(r.itemId);
      if (!skill) continue;
      totals[skill].attempted += 1;
      if (r.correct) totals[skill].correct += 1;
      sessionsTouched[skill].add(s.id);
    }
  }

  // First pass: status for every skill (without unlocked).
  const partial: Record<SkillId, SkillProgress> = {} as Record<
    SkillId,
    SkillProgress
  >;
  for (const skill of SKILL_IDS_ORDERED) {
    const { attempted, correct } = totals[skill];
    const accuracy = attempted === 0 ? 0 : correct / attempted;
    partial[skill] = {
      skillId: skill,
      status: computeStatus(attempted, accuracy),
      attempted,
      correct,
      accuracy,
      sessionsTouched: sessionsTouched[skill].size,
      unlocked: false,
      prereqsRemaining: [],
    };
  }

  // Second pass: unlocked + prereqsRemaining, using STATIC_PREREQUISITES_BY_SKILL.
  for (const skill of SKILL_IDS_ORDERED) {
    const prereqs = STATIC_PREREQUISITES_BY_SKILL[skill] ?? [];
    const remaining: SkillId[] = [];
    for (const p of prereqs) {
      if (!isCurriculumSkillCode(p.code)) continue;
      if (partial[p.code].status === 'not_started') {
        remaining.push(p.code);
      }
    }
    partial[skill].unlocked = remaining.length === 0;
    partial[skill].prereqsRemaining = remaining;
  }

  return partial;
};

// Recommended learning order — kept stable as the natural curriculum order.
// FR.02 is the foundation and FR.08 (word problems) sits at the top.
export const RECOMMENDED_ORDER: SkillId[] = [...SKILL_IDS_ORDERED];

// "Where should the student go next?" given the current progression record.
// Returns the first skill in RECOMMENDED_ORDER that isn't yet 'strong'.
// If every skill is 'strong', returns null (full module mastery — for this
// prototype's heuristic).
export const suggestSkillToFocus = (
  progress: Record<SkillId, SkillProgress>
): SkillId | null => {
  for (const s of RECOMMENDED_ORDER) {
    if (progress[s].status !== 'strong') return s;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Per-session "Next Step for You" recommendation
// ---------------------------------------------------------------------------
// Run on the just-completed session (NOT the device-wide history). It reads
// only the responses in that session, so the suggestion reflects what the
// student just did rather than aggregate progress.
//
// Logic:
//   - If the session has at least one skill with attempted ≥ 2 and
//     accuracy < 0.70, the weakest such skill is the focus skill, and the
//     suggestion is "practise this skill".
//   - Otherwise, if every attempted skill is doing fine and the device has
//     a 'developing' or 'not_started' next skill in curriculum order, the
//     suggestion is "move on to the next skill".
//   - Otherwise it's a "looking solid" message with the first non-strong
//     skill (if any) as a soft suggestion.

export type NextStepKind =
  | 'practice_skill'
  | 'next_skill'
  | 'mastery';

export type NextStepSuggestion = {
  kind: NextStepKind;
  skillId: SkillId;
  headline: string;
  detail: string;
  // What the student touched in THIS session, per-skill, for transparency.
  perSkillSummary: Array<{
    skillId: SkillId;
    attempted: number;
    accuracy: number; // 0..1
  }>;
};

export const suggestNextStep = (
  session: Session,
  items: Item[],
  deviceProgress: Record<SkillId, SkillProgress>
): NextStepSuggestion => {
  const itemSkillById = new Map(items.map((it) => [it.id, it.skillId]));

  const perSkillTotals = {} as Record<
    SkillId,
    { attempted: number; correct: number }
  >;
  for (const s of SKILL_IDS_ORDERED) {
    perSkillTotals[s] = { attempted: 0, correct: 0 };
  }
  for (const r of session.responses) {
    const skill = itemSkillById.get(r.itemId);
    if (!skill) continue;
    perSkillTotals[skill].attempted += 1;
    if (r.correct) perSkillTotals[skill].correct += 1;
  }

  const perSkillSummary = SKILL_IDS_ORDERED
    .map((s) => {
      const { attempted, correct } = perSkillTotals[s];
      return {
        skillId: s,
        attempted,
        accuracy: attempted === 0 ? 0 : correct / attempted,
      };
    })
    .filter((row) => row.attempted > 0);

  // 1. Weakest skill in this session: lowest accuracy among skills with
  //    attempted ≥ 2 AND accuracy < 0.7. Tiebreak by curriculum order.
  const candidates = perSkillSummary.filter(
    (row) => row.attempted >= 2 && row.accuracy < 0.7
  );
  if (candidates.length > 0) {
    candidates.sort((a, b) => {
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      return (
        SKILL_IDS_ORDERED.indexOf(a.skillId) -
        SKILL_IDS_ORDERED.indexOf(b.skillId)
      );
    });
    const focus = candidates[0];
    return {
      kind: 'practice_skill',
      skillId: focus.skillId,
      headline: `Spend a little more time on ${focus.skillId}.`,
      detail: `In this session, ${Math.round(focus.accuracy * 100)}% of your ${focus.skillId} answers were correct (${focus.attempted} attempted). The Learn page has a quick reteach lesson, a worked example, and 5 practice questions to help.`,
      perSkillSummary,
    };
  }

  // 2. Doing fine — point at the first non-strong skill in curriculum order
  //    on the DEVICE (so the suggestion is "next" rather than "stuck").
  const nextFocus = suggestSkillToFocus(deviceProgress);
  if (nextFocus !== null) {
    const status = deviceProgress[nextFocus].status;
    const verb = status === 'not_started' ? 'try' : 'keep going on';
    return {
      kind: 'next_skill',
      skillId: nextFocus,
      headline: `Looking good — ${verb} ${nextFocus} next.`,
      detail: `Across what you did in this session, you held up well. The next skill in the recommended order is ${nextFocus}; the Learn page has a reteach lesson and 5 practice questions.`,
      perSkillSummary,
    };
  }

  // 3. Every skill is 'strong'. (Prototype heuristic only.)
  const lastSkill = SKILL_IDS_ORDERED[SKILL_IDS_ORDERED.length - 1];
  return {
    kind: 'mastery',
    skillId: lastSkill,
    headline: 'Solid across the whole Class 6 Math prototype on this device.',
    detail:
      'Every skill across the four Class 6 Math modules is in the Strong band on this device (prototype signal — not a calibrated mastery claim). You can keep practising any skill or revisit the Learn pages for review.',
    perSkillSummary,
  };
};
