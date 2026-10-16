// v0.50 §7 — Teacher Overview analytics.
//
// THE BUG THIS FIXES
//
// App.tsx passed `studentsNeedingAttention={0}` — a hard-coded literal.
// The Overview then rendered "No students flagged", which reads as a
// finding ("I checked, everything is fine") when in fact nothing had
// been computed at all. A placeholder zero is worse than a blank,
// because a teacher can act on it.
//
// EVIDENCE RULES
//
// Every signal below has an explicit minimum-evidence threshold, and
// they are all exported so the UI can state the rule to the teacher.
// A single wrong answer never raises a flag.
//
// Where there is not enough evidence the result is `null`, and the UI
// must print "Not enough recent activity yet" — never 0.

import type { Session, Student } from '../../types';
import { isCompletedAttempt } from '../session/sessionLifecycle';

/** Attempts a student must have before we are willing to say anything
 *  about their accuracy. */
export const MIN_ATTEMPTS_FOR_STUDENT_SIGNAL = 6;
/** Accuracy below this, with enough attempts, flags for attention. */
export const LOW_ACCURACY_THRESHOLD = 0.5;
/** Attempts on one skill before it can be called "difficult". */
export const MIN_ATTEMPTS_FOR_SKILL_SIGNAL = 5;
/** Times a misconception must recur before it is reported. */
export const MIN_MISCONCEPTION_REPEATS = 3;

export type AttentionReason =
  | 'low_recent_accuracy'
  | 'repeated_misconception'
  | 'unfinished_assigned_work';

export const ATTENTION_REASON_LABEL: Record<AttentionReason, string> = {
  low_recent_accuracy: 'Low accuracy across recent questions',
  repeated_misconception: 'Same mistake repeating',
  unfinished_assigned_work: 'Assigned work not finished',
};

export type FlaggedStudent = {
  studentId: string;
  studentName: string;
  reasons: AttentionReason[];
  attempted: number;
  accuracy: number | null;
};

export type OverviewAnalytics = {
  /** Genuinely completed sessions in scope. Exited/partial attempts are
   *  excluded — see sessionLifecycle. */
  completedSessionCount: number;
  /** Students with any completed work in scope. */
  activeStudentCount: number;
  /** null = not enough evidence to judge anyone. NOT zero. */
  flagged: FlaggedStudent[] | null;
  /** null = not enough attempts on any skill to call it difficult. */
  difficultSkills: Array<{ skillId: string; accuracy: number; attempted: number }> | null;
  /** True when the scope contains no completed work at all. */
  isEmpty: boolean;
};

/**
 * Compute Overview analytics for an ALREADY-SCOPED session list.
 *
 * Scoping (classroom / grade / year) is the caller's job — see
 * teacherInsights.scopeSessions — so this function cannot accidentally
 * widen to device-wide data.
 */
export function computeOverviewAnalytics(args: {
  sessions: Session[];
  students: Student[];
  itemSkillOf: (itemId: string) => string | null;
}): OverviewAnalytics {
  const { sessions, students, itemSkillOf } = args;

  // Only genuinely finished attempts inform a teacher summary.
  const completed = sessions.filter(isCompletedAttempt);
  const nameById = new Map(students.map((s) => [s.id, s.name]));

  if (completed.length === 0) {
    return {
      completedSessionCount: 0,
      activeStudentCount: 0,
      flagged: null,
      difficultSkills: null,
      isEmpty: true,
    };
  }

  // --- per student ---
  const byStudent = new Map<
    string,
    { attempted: number; correct: number; misconceptions: Map<string, number> }
  >();
  for (const s of completed) {
    const cur =
      byStudent.get(s.studentId) ?? {
        attempted: 0, correct: 0, misconceptions: new Map<string, number>(),
      };
    for (const r of s.responses) {
      cur.attempted += 1;
      if (r.correct) cur.correct += 1;
      const m = r.misconceptionTriggered;
      if (m && m !== 'none') {
        cur.misconceptions.set(m, (cur.misconceptions.get(m) ?? 0) + 1);
      }
    }
    byStudent.set(s.studentId, cur);
  }

  const flagged: FlaggedStudent[] = [];
  let anyStudentHadEnoughEvidence = false;

  for (const [studentId, v] of byStudent) {
    if (v.attempted < MIN_ATTEMPTS_FOR_STUDENT_SIGNAL) continue;
    anyStudentHadEnoughEvidence = true;
    const accuracy = v.correct / v.attempted;
    const reasons: AttentionReason[] = [];
    if (accuracy < LOW_ACCURACY_THRESHOLD) reasons.push('low_recent_accuracy');
    for (const count of v.misconceptions.values()) {
      if (count >= MIN_MISCONCEPTION_REPEATS) {
        reasons.push('repeated_misconception');
        break;
      }
    }
    if (reasons.length > 0) {
      flagged.push({
        studentId,
        studentName: nameById.get(studentId) ?? 'Unknown student',
        reasons,
        attempted: v.attempted,
        accuracy,
      });
    }
  }

  // --- per skill ---
  const bySkill = new Map<string, { attempted: number; correct: number }>();
  for (const s of completed) {
    for (const r of s.responses) {
      const skill = itemSkillOf(r.itemId);
      if (!skill) continue;
      const cur = bySkill.get(skill) ?? { attempted: 0, correct: 0 };
      cur.attempted += 1;
      if (r.correct) cur.correct += 1;
      bySkill.set(skill, cur);
    }
  }
  const difficult = Array.from(bySkill.entries())
    .filter(([, v]) => v.attempted >= MIN_ATTEMPTS_FOR_SKILL_SIGNAL)
    .map(([skillId, v]) => ({
      skillId, accuracy: v.correct / v.attempted, attempted: v.attempted,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return {
    completedSessionCount: completed.length,
    activeStudentCount: byStudent.size,
    // The critical distinction: `[]` means "we looked and nobody is
    // flagged"; `null` means "we do not have enough evidence to say".
    // v0.49 collapsed both into 0.
    flagged: anyStudentHadEnoughEvidence ? flagged : null,
    difficultSkills: difficult.length > 0 ? difficult : null,
    isEmpty: false,
  };
}

/** Human sentence for the attention card. Never invents a number. */
export function attentionSummary(a: OverviewAnalytics): string {
  if (a.isEmpty) return 'No completed sessions in this class yet.';
  if (a.flagged === null) return 'Not enough recent activity yet.';
  if (a.flagged.length === 0) {
    return `No students flagged, based on ${MIN_ATTEMPTS_FOR_STUDENT_SIGNAL}+ recent questions each.`;
  }
  return `${a.flagged.length} student${a.flagged.length === 1 ? '' : 's'} to look at.`;
}
