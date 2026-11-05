// v0.49 §8 + §11 — Teacher Insights is classroom-specific.
//
// The v0.48 body aggregated every completed session on the device and
// called it a "Class-level view". These tests hold two classrooms
// apart and assert the numbers never bleed.

import { describe, it, expect } from 'vitest';
import {
  scopeSessions,
  summarizeScopedSessions,
  studentIdsInClassroom,
} from '../teacherInsights';
import type { Classroom } from '../../../lib/cloudStore';
import type { Session, Student } from '../../../types';

function session(
  over: Partial<Session> & { id: string; studentId: string }
): Session {
  return {
    studentSnapshot: { name: 'X', grade: 'class6' },
    window: 'practice',
    skillId: 'mixed_fractions',
    startedAt: 1,
    completedAt: 2,
    responses: [],
    finalAbility: 5,
    ...over,
  } as Session;
}

function resp(itemId: string, correct: boolean) {
  return {
    itemId,
    chosenIndex: 0,
    correct,
    timeMs: 1,
    difficultyAtAttempt: 5,
    abilityBefore: 5,
    abilityAfter: correct ? 6 : 4,
    misconceptionTriggered: 'none' as const,
  };
}

const classroomA: Classroom = {
  id: 'room-a', teacherUid: 't1', name: 'Class 6 Blue', notes: '',
  studentIds: ['s1', 's2'], archived: false, createdAt: 0, updatedAt: 0,
};
const classroomB: Classroom = {
  id: 'room-b', teacherUid: 't1', name: 'Class 6 Green', notes: '',
  studentIds: ['s3'], archived: false, createdAt: 0, updatedAt: 0,
};
const classrooms = [classroomA, classroomB];

const students: Student[] = [
  { id: 's1', name: 'Ada', grade: 'class6', createdAt: 0 },
  { id: 's2', name: 'Bo', grade: 'class6', createdAt: 0 },
  { id: 's3', name: 'Cy', grade: 'class8', createdAt: 0 },
  { id: 's4', name: 'Dee', grade: 'class6', createdAt: 0 }, // in no classroom
];

const sessions: Session[] = [
  session({ id: 'a1', studentId: 's1', responses: [resp('i1', true), resp('i2', true)] }),
  session({ id: 'a2', studentId: 's2', responses: [resp('i1', false)] }),
  session({
    id: 'b1', studentId: 's3',
    studentSnapshot: { name: 'Cy', grade: 'class8' },
    responses: [resp('i1', false), resp('i2', false)],
  }),
  session({ id: 'd1', studentId: 's4', responses: [resp('i1', true)] }),
  // Incomplete — must never be counted anywhere.
  session({ id: 'x1', studentId: 's1', completedAt: null, responses: [resp('i1', true)] }),
];

describe('§8 two classrooms stay separate', () => {
  it('classroom A sees only its own students', () => {
    const scoped = scopeSessions({
      sessions, classrooms, students, scope: { classroomId: 'room-a' },
    });
    expect(scoped.sessions.map((s) => s.id).sort()).toEqual(['a1', 'a2']);
    expect(scoped.isDeviceWide).toBe(false);
    expect(scoped.scopeLabel).toBe('Class 6 Blue');
  });

  it('classroom B sees only its own students', () => {
    const scoped = scopeSessions({
      sessions, classrooms, students, scope: { classroomId: 'room-b' },
    });
    expect(scoped.sessions.map((s) => s.id)).toEqual(['b1']);
    expect(scoped.scopeLabel).toBe('Class 6 Green');
  });

  it('the two classrooms share no session at all', () => {
    const a = scopeSessions({
      sessions, classrooms, students, scope: { classroomId: 'room-a' },
    }).sessions.map((s) => s.id);
    const b = scopeSessions({
      sessions, classrooms, students, scope: { classroomId: 'room-b' },
    }).sessions.map((s) => s.id);
    expect(a.filter((id) => b.includes(id))).toEqual([]);
  });

  it('their summaries differ — accuracy is not a device-wide number', () => {
    const skillOf = () => 'FR.02';
    const a = summarizeScopedSessions(
      scopeSessions({ sessions, classrooms, students, scope: { classroomId: 'room-a' } }).sessions,
      skillOf
    );
    const b = summarizeScopedSessions(
      scopeSessions({ sessions, classrooms, students, scope: { classroomId: 'room-b' } }).sessions,
      skillOf
    );
    expect(a.totalSessions).toBe(2);
    expect(b.totalSessions).toBe(1);
    expect(a.overallAccuracy).toBeCloseTo(2 / 3);
    expect(b.overallAccuracy).toBe(0);
    expect(a.distinctStudents).toBe(2);
    expect(b.distinctStudents).toBe(1);
  });

  it('a student in no classroom is excluded from both', () => {
    for (const id of ['room-a', 'room-b']) {
      const scoped = scopeSessions({
        sessions, classrooms, students, scope: { classroomId: id },
      });
      expect(scoped.sessions.some((s) => s.studentId === 's4')).toBe(false);
    }
  });
});

describe('§8 device-wide data is labelled truthfully', () => {
  it('no classroom selected → "All local data", flagged as device-wide', () => {
    const scoped = scopeSessions({
      sessions, classrooms, students, scope: { classroomId: null },
    });
    expect(scoped.isDeviceWide).toBe(true);
    expect(scoped.scopeLabel).toBe('All local data');
    // Every completed session, across grades and classrooms.
    expect(scoped.sessions.map((s) => s.id).sort()).toEqual([
      'a1', 'a2', 'b1', 'd1',
    ]);
  });

  it('a classroom view is never marked device-wide', () => {
    expect(
      scopeSessions({ sessions, classrooms, students, scope: { classroomId: 'room-a' } })
        .isDeviceWide
    ).toBe(false);
  });

  it('incomplete sessions are excluded from every scope', () => {
    for (const classroomId of [null, 'room-a', 'room-b']) {
      const scoped = scopeSessions({
        sessions, classrooms, students, scope: { classroomId },
      });
      expect(scoped.sessions.some((s) => s.id === 'x1')).toBe(false);
    }
  });
});

describe('§8 additional filters', () => {
  it('filters by grade and says so in the label', () => {
    const scoped = scopeSessions({
      sessions, classrooms, students,
      scope: { classroomId: null, grade: 'class8' },
    });
    expect(scoped.sessions.map((s) => s.id)).toEqual(['b1']);
    expect(scoped.scopeLabel).toContain('Class 8');
  });

  it('filters by assignment', () => {
    const withAssignment = [
      ...sessions,
      session({ id: 'as1', studentId: 's1', assignmentId: 'asg-1' }),
    ];
    const scoped = scopeSessions({
      sessions: withAssignment, classrooms, students,
      scope: { classroomId: 'room-a', assignmentId: 'asg-1' },
    });
    expect(scoped.sessions.map((s) => s.id)).toEqual(['as1']);
  });

  it('filters by academic year', () => {
    const withYear = [
      ...sessions,
      session({ id: 'y1', studentId: 's1', academicYear: '2025-26' }),
    ];
    const scoped = scopeSessions({
      sessions: withYear, classrooms, students,
      scope: { classroomId: 'room-a', academicYear: '2025-26' },
    });
    expect(scoped.sessions.map((s) => s.id)).toEqual(['y1']);
  });
});

describe('§8 membership works without a data migration', () => {
  it('a pre-v0.49 session with no classroomId still lands in its class via the roster', () => {
    const legacy = session({ id: 'legacy', studentId: 's1' });
    expect(legacy.classroomId).toBeUndefined();
    const scoped = scopeSessions({
      sessions: [legacy], classrooms, students, scope: { classroomId: 'room-a' },
    });
    expect(scoped.sessions.map((s) => s.id)).toEqual(['legacy']);
  });

  it('a session stamped with classroomId counts even after the student leaves the roster', () => {
    const stamped = session({ id: 'stamped', studentId: 'gone', classroomId: 'room-a' });
    const scoped = scopeSessions({
      sessions: [stamped], classrooms, students, scope: { classroomId: 'room-a' },
    });
    expect(scoped.sessions.map((s) => s.id)).toEqual(['stamped']);
  });

  it('an unknown classroom id yields no sessions rather than everything', () => {
    const scoped = scopeSessions({
      sessions, classrooms, students, scope: { classroomId: 'room-zzz' },
    });
    expect(scoped.sessions).toEqual([]);
    expect(scoped.isDeviceWide).toBe(false);
  });

  it('studentIdsInClassroom handles a missing classroom', () => {
    expect(studentIdsInClassroom(undefined).size).toBe(0);
    expect(studentIdsInClassroom(classroomA)).toEqual(new Set(['s1', 's2']));
  });
});
