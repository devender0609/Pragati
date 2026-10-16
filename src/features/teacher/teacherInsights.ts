// v0.49 §8 — Classroom-scoped teacher insights.
//
// The v0.48 Insights tab called `loadSessions()` and aggregated every
// completed session on the device, then labelled the result
// "Class-level view". On a shared teacher device that mixes classes;
// on any device it mixes grades and academic years.
//
// This module is the pure selector. It takes an explicit scope and
// returns only the sessions in it, plus a truthful label describing
// what the numbers actually cover. No React, no storage — so the
// isolation between two classrooms is directly testable.

import type { Classroom } from '../../lib/cloudStore';
import type { Grade, Session, Student } from '../../types';
import { normalizeGrade } from '../../lib/gradeNormalization';

export type InsightsScope = {
  /** null = no classroom selected. */
  classroomId: string | null;
  /** Optional additional filters, applied on top of the classroom. */
  grade?: Grade | null;
  academicYear?: string | null;
  assignmentId?: string | null;
};

export type ScopedSessions = {
  sessions: Session[];
  /** What the numbers genuinely describe. Rendered verbatim by the UI
   *  so a device-wide aggregate can never be presented as a class. */
  scopeLabel: string;
  /** True when no classroom filter was applied and the figures are
   *  therefore everything stored on this device. */
  isDeviceWide: boolean;
};

/** Student IDs in a classroom. A student belongs to a classroom via
 *  the roster (`Classroom.studentIds`) — that is the teacher's own
 *  record and stays correct even for sessions written before v0.49
 *  started stamping `classroomId`. */
export function studentIdsInClassroom(
  classroom: Classroom | undefined
): Set<string> {
  return new Set(classroom?.studentIds ?? []);
}

/**
 * Filter sessions down to a scope.
 *
 * Membership rule, in order:
 *   1. The session's own recorded `classroomId` matches (v0.49+).
 *   2. Otherwise the session's student is on the classroom roster.
 *
 * Rule 2 is what makes this work for existing stored data: no
 * migration is required, and sessions written before this iteration
 * still land in the right class.
 */
export function scopeSessions(args: {
  sessions: Session[];
  classrooms: Classroom[];
  students: Student[];
  scope: InsightsScope;
}): ScopedSessions {
  const { sessions, classrooms, students, scope } = args;

  const completed = sessions.filter((s) => s.completedAt);

  const classroom = scope.classroomId
    ? classrooms.find((c) => c.id === scope.classroomId)
    : undefined;

  let filtered = completed;
  let isDeviceWide = true;
  let scopeLabel = 'All local data';

  if (scope.classroomId) {
    const roster = studentIdsInClassroom(classroom);
    filtered = filtered.filter(
      (s) => s.classroomId === scope.classroomId || roster.has(s.studentId)
    );
    isDeviceWide = false;
    scopeLabel = classroom ? classroom.name : 'Selected class';
  }

  if (scope.grade) {
    const wanted = scope.grade;
    const studentById = new Map(students.map((st) => [st.id, st]));
    filtered = filtered.filter((s) => {
      // Prefer the grade frozen on the session; fall back to the
      // student record. Unresolvable grades are excluded rather than
      // assumed — §7's rule applies to reporting too.
      const fromSession = normalizeGrade(s.studentSnapshot.grade);
      const fromStudent = normalizeGrade(studentById.get(s.studentId)?.grade);
      const g = fromSession ?? fromStudent;
      return g === wanted;
    });
    scopeLabel = `${scopeLabel} · Class ${wanted.replace('class', '')}`;
  }

  if (scope.academicYear) {
    const yr = scope.academicYear;
    filtered = filtered.filter(
      (s) => s.academicYear === yr || s.studentSnapshot.academicYear === yr
    );
    scopeLabel = `${scopeLabel} · ${yr}`;
  }

  if (scope.assignmentId) {
    const aid = scope.assignmentId;
    filtered = filtered.filter((s) => s.assignmentId === aid);
    scopeLabel = `${scopeLabel} · one assignment`;
  }

  return { sessions: filtered, scopeLabel, isDeviceWide };
}

export type InsightsSummary = {
  totalSessions: number;
  totalAnswered: number;
  overallAccuracy: number;
  distinctStudents: number;
  weakest: Array<{ skill: string; accuracy: number; attempted: number }>;
};

/** Roll a scoped session list into the numbers the Insights tab shows.
 *  `itemSkillOf` is injected so this stays independent of the item
 *  bank module. */
export function summarizeScopedSessions(
  sessions: Session[],
  itemSkillOf: (itemId: string) => string | null,
  { minAttemptsPerSkill = 3 }: { minAttemptsPerSkill?: number } = {}
): InsightsSummary {
  const responses = sessions.flatMap((s) => s.responses);
  const totalAnswered = responses.length;
  const correct = responses.filter((r) => r.correct).length;

  const bySkill = new Map<string, { attempted: number; correct: number }>();
  for (const r of responses) {
    const skill = itemSkillOf(r.itemId);
    if (!skill) continue;
    const cur = bySkill.get(skill) ?? { attempted: 0, correct: 0 };
    cur.attempted += 1;
    if (r.correct) cur.correct += 1;
    bySkill.set(skill, cur);
  }

  const weakest = Array.from(bySkill.entries())
    .filter(([, v]) => v.attempted >= minAttemptsPerSkill)
    .map(([skill, v]) => ({
      skill,
      accuracy: v.correct / v.attempted,
      attempted: v.attempted,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return {
    totalSessions: sessions.length,
    totalAnswered,
    overallAccuracy: totalAnswered === 0 ? 0 : correct / totalAnswered,
    distinctStudents: new Set(sessions.map((s) => s.studentId)).size,
    weakest,
  };
}
