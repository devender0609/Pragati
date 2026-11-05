// v0.49 §5 + §11 — same-name student isolation, end to end.
//
// v0.48 proved isolation for `sessionsForStudent`. This file widens it
// to every student-facing calculation the shell surfaces, using the
// hardest case the spec asks for: two students with an IDENTICAL
// display name, different IDs, and different sessions.
//
// The failure mode being locked out is a silent fallback to matching
// by `studentSnapshot.name`, which would merge these two people.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  sessionsForStudentIn,
  findContinueTarget,
} from '../studentData';
import { scopeSessions } from '../../teacher/teacherInsights';
import type { Session, Student } from '../../../types';

const SHARED_NAME = 'Priya Sharma';

const alpha: Student = {
  id: 'stu-alpha', name: SHARED_NAME, grade: 'class6', createdAt: 1,
};
const beta: Student = {
  id: 'stu-beta', name: SHARED_NAME, grade: 'class6', createdAt: 2,
};

function resp(itemId: string, correct: boolean) {
  return {
    itemId, chosenIndex: 0, correct, timeMs: 1000,
    difficultyAtAttempt: 5, abilityBefore: 5,
    abilityAfter: correct ? 6 : 4,
    misconceptionTriggered: 'none' as const,
  };
}

function sess(
  id: string, studentId: string, skillId: string,
  completedAt: number | null, responses = [resp('i1', true)]
): Session {
  return {
    id,
    studentId,
    // Identical snapshot name — this is the trap.
    studentSnapshot: { name: SHARED_NAME, grade: 'class6' },
    window: 'practice',
    skillId: skillId as Session['skillId'],
    startedAt: 1,
    completedAt,
    responses,
    finalAbility: 5,
  };
}

let sessions: Session[];

beforeEach(() => {
  sessions = [
    // Alpha: two Fractions sessions, both correct.
    sess('a1', alpha.id, 'FR.02', 100),
    sess('a2', alpha.id, 'FR.03', 200),
    // Beta: one Decimals session, wrong answer.
    sess('b1', beta.id, 'DE.01', 300, [resp('i2', false)]),
  ];
});

describe('§5 two students sharing a display name stay separate', () => {
  it('session history does not merge', () => {
    const a = sessionsForStudentIn(sessions, alpha.id);
    const b = sessionsForStudentIn(sessions, beta.id);
    expect(a.map((s) => s.id).sort()).toEqual(['a1', 'a2']);
    expect(b.map((s) => s.id)).toEqual(['b1']);
    expect(a.length + b.length).toBe(sessions.length);
  });

  it('neither student sees any session belonging to the other', () => {
    for (const s of sessionsForStudentIn(sessions, alpha.id)) {
      expect(s.studentId).toBe(alpha.id);
    }
    for (const s of sessionsForStudentIn(sessions, beta.id)) {
      expect(s.studentId).toBe(beta.id);
    }
  });

  it('recent activity differs even though the names are identical', () => {
    const recentA = sessionsForStudentIn(sessions, alpha.id, {
      completedOnly: true,
    }).sort((x, y) => (y.completedAt ?? 0) - (x.completedAt ?? 0));
    const recentB = sessionsForStudentIn(sessions, beta.id, {
      completedOnly: true,
    });
    expect(recentA[0].id).toBe('a2');
    expect(recentB[0].id).toBe('b1');
    expect(recentA[0].id).not.toBe(recentB[0].id);
  });

  it('continue-learning resolves to different chapters', () => {
    const ta = findContinueTarget(alpha.id, 'class6', { sessions });
    const tb = findContinueTarget(beta.id, 'class6', { sessions });
    expect(ta?.isResume).toBe(true);
    expect(tb?.isResume).toBe(true);
    expect(ta?.skillId).toBe('FR.03');
    expect(tb?.skillId).toBe('DE.01');
    expect(ta?.resolved.chapterId).not.toBe(tb?.resolved.chapterId);
  });

  it('a student with no sessions of their own gets no resume, even if a same-named student has many', () => {
    const gamma = 'stu-gamma';
    const t = findContinueTarget(gamma, 'class6', { sessions });
    // Either null, or a fresh start — never Alpha's chapter as a resume.
    expect(t?.isResume ?? false).toBe(false);
  });

  it('accuracy computed per student is not the pooled figure', () => {
    const acc = (id: string) => {
      const rs = sessionsForStudentIn(sessions, id).flatMap((s) => s.responses);
      return rs.filter((r) => r.correct).length / rs.length;
    };
    expect(acc(alpha.id)).toBe(1);
    expect(acc(beta.id)).toBe(0);
    // The pooled number matches neither — which is exactly why the
    // name-join bug was invisible in aggregate.
    const pooled =
      sessions.flatMap((s) => s.responses).filter((r) => r.correct).length /
      sessions.flatMap((s) => s.responses).length;
    expect(pooled).not.toBe(acc(alpha.id));
    expect(pooled).not.toBe(acc(beta.id));
  });

  it('changing one student\'s name does not move any session between them', () => {
    const renamed = sessions.map((s) =>
      s.studentId === alpha.id
        ? { ...s, studentSnapshot: { ...s.studentSnapshot, name: 'Different' } }
        : s
    );
    expect(sessionsForStudentIn(renamed, alpha.id).map((s) => s.id).sort())
      .toEqual(['a1', 'a2']);
    expect(sessionsForStudentIn(renamed, beta.id).map((s) => s.id))
      .toEqual(['b1']);
  });

  it('teacher scoping also keys on ID, so same-named students land in their own class', () => {
    const roomA = {
      id: 'room-a', teacherUid: 't', name: 'Room A', notes: '',
      studentIds: [alpha.id], archived: false, createdAt: 0, updatedAt: 0,
    };
    const roomB = {
      id: 'room-b', teacherUid: 't', name: 'Room B', notes: '',
      studentIds: [beta.id], archived: false, createdAt: 0, updatedAt: 0,
    };
    const a = scopeSessions({
      sessions, classrooms: [roomA, roomB], students: [alpha, beta],
      scope: { classroomId: 'room-a' },
    });
    const b = scopeSessions({
      sessions, classrooms: [roomA, roomB], students: [alpha, beta],
      scope: { classroomId: 'room-b' },
    });
    expect(a.sessions.map((s) => s.id).sort()).toEqual(['a1', 'a2']);
    expect(b.sessions.map((s) => s.id)).toEqual(['b1']);
  });
});
