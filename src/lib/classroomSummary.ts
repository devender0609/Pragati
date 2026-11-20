// v0.19: per-classroom progress summary.
//
// Computes a snapshot for a single classroom, used by the per-classroom
// progress section in ClassroomsView. Reuses helpers from scoring +
// dashboardSummary so the totals match the global summary widget.

import type { Item, MisconceptionCode } from '../data/items';
import { MISCONCEPTION_LABELS } from '../data/items';
import {
  averageTimeSec,
  correctCount,
  summarizeBySkill,
  summarizeMisconceptions,
} from './scoring';
import { SKILL_LABELS, type AssessmentAssignment, type Session, type SkillId, type Student } from '../types';
import type { Classroom } from './cloudStore';

export type StudentNeedingSupport = {
  studentId: string;
  studentName: string;
  accuracy: number;
  sessions: number;
};

export type WeakestSkillRow = {
  skillId: SkillId;
  label: string;
  attempted: number;
  accuracy: number;
};

export type TopMisconceptionRow = {
  code: MisconceptionCode;
  label: string;
  count: number;
};

export type ClassroomSummary = {
  classroomId: string;
  classroomName: string;
  rosterSize: number;
  studentsWithSessions: number;
  totalSessions: number;
  completedSessions: number;
  completedAssignments: number;
  averageAccuracy: number;
  averageTimeSec: number;
  weakestSkills: WeakestSkillRow[];
  topMisconceptions: TopMisconceptionRow[];
  studentsNeedingSupport: StudentNeedingSupport[];
  recentSessions: Array<{
    sessionId: string;
    studentName: string;
    completedAt: number;
    accuracy: number;
  }>;
  // 4 most recent weekly accuracy buckets (oldest first).
  trend: Array<{ weekStartMs: number; accuracy: number; sessions: number }>;
};

const SUPPORT_THRESHOLD = 0.5; // accuracy below 50% → flagged
const MIN_ATTEMPTS_FOR_WEAKNESS = 4;
const TREND_BUCKETS = 4;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function buildClassroomSummary(input: {
  classroom: Classroom;
  students: Student[];
  sessions: Session[];
  assignments: AssessmentAssignment[];
  items: Item[];
}): ClassroomSummary {
  const { classroom, students, sessions, assignments, items } = input;
  const ids = new Set(classroom.studentIds);
  const classStudents = students.filter((s) => ids.has(s.id));
  const classSessions = sessions.filter((s) => ids.has(s.studentId));
  const completed = classSessions.filter((s) => s.completedAt !== null);
  const allResponses = completed.flatMap((s) => s.responses);

  // Per-student accuracy (across all completed sessions).
  const byStudent = new Map<string, Session[]>();
  for (const s of completed) {
    const arr = byStudent.get(s.studentId) ?? [];
    arr.push(s);
    byStudent.set(s.studentId, arr);
  }
  const studentsNeedingSupport: StudentNeedingSupport[] = [];
  for (const s of classStudents) {
    const ssns = byStudent.get(s.id) ?? [];
    const resps = ssns.flatMap((x) => x.responses);
    if (resps.length === 0) continue;
    const acc = correctCount(resps) / resps.length;
    if (acc < SUPPORT_THRESHOLD) {
      studentsNeedingSupport.push({
        studentId: s.id,
        studentName: s.name,
        accuracy: acc,
        sessions: ssns.length,
      });
    }
  }
  studentsNeedingSupport.sort((a, b) => a.accuracy - b.accuracy);

  // Skill breakdown (across the classroom).
  const breakdown = summarizeBySkill(allResponses, items);
  const weakestSkills: WeakestSkillRow[] = breakdown
    .filter((b) => b.attempted >= MIN_ATTEMPTS_FOR_WEAKNESS)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map((b) => ({
      skillId: b.skillId,
      label: SKILL_LABELS[b.skillId],
      attempted: b.attempted,
      accuracy: b.accuracy,
    }));

  // Top misconceptions.
  const allMisc = summarizeMisconceptions(allResponses);
  const topMisconceptions: TopMisconceptionRow[] = allMisc.slice(0, 3).map((m) => ({
    code: m.code,
    label: MISCONCEPTION_LABELS[m.code],
    count: m.count,
  }));

  // Completed assignments for this classroom.
  const classroomAssignmentIds = new Set(
    assignments
      .filter((a) => a.classroomId === classroom.id)
      .map((a) => a.id)
  );
  const completedAssignments = completed.filter(
    (s) => s.assignmentId && classroomAssignmentIds.has(s.assignmentId)
  ).length;

  // Recent sessions (top 5).
  const studentNameById = new Map(students.map((s) => [s.id, s.name]));
  const recentSessions = completed
    .slice()
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
    .slice(0, 5)
    .map((s) => {
      const resps = s.responses;
      return {
        sessionId: s.id,
        studentName:
          studentNameById.get(s.studentId) ?? s.studentSnapshot.name ?? 'Student',
        completedAt: s.completedAt ?? 0,
        accuracy: resps.length === 0 ? 0 : correctCount(resps) / resps.length,
      };
    });

  // Weekly accuracy trend (4 buckets ending now).
  const now = Date.now();
  const trend: ClassroomSummary['trend'] = [];
  for (let i = TREND_BUCKETS - 1; i >= 0; i--) {
    const end = now - i * SEVEN_DAYS_MS;
    const start = end - SEVEN_DAYS_MS;
    const inBucket = completed.filter(
      (s) =>
        s.completedAt !== null && s.completedAt >= start && s.completedAt < end
    );
    const resps = inBucket.flatMap((s) => s.responses);
    const acc =
      resps.length === 0 ? 0 : correctCount(resps) / resps.length;
    trend.push({
      weekStartMs: start,
      accuracy: acc,
      sessions: inBucket.length,
    });
  }

  return {
    classroomId: classroom.id,
    classroomName: classroom.name,
    rosterSize: classStudents.length,
    studentsWithSessions: byStudent.size,
    totalSessions: classSessions.length,
    completedSessions: completed.length,
    completedAssignments,
    averageAccuracy:
      allResponses.length === 0 ? 0 : correctCount(allResponses) / allResponses.length,
    averageTimeSec: averageTimeSec(allResponses),
    weakestSkills,
    topMisconceptions,
    studentsNeedingSupport,
    recentSessions,
  trend,
  };
}
