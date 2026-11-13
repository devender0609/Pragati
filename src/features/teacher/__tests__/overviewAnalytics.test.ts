// v0.50 §7 + §8 + §18 — teacher analytics integrity.
//
// The v0.49 defect: App.tsx passed `studentsNeedingAttention={0}` and
// the Overview rendered "Nobody on the flag list right now" — a
// placeholder presented to a teacher as a finding.
//
// The distinction these tests protect is between:
//   []   — we looked, nobody qualifies
//   null — we do not have enough evidence to say anything
// v0.49 collapsed both into 0.

import { describe, it, expect } from 'vitest';
import {
  computeOverviewAnalytics,
  attentionSummary,
  MIN_ATTEMPTS_FOR_STUDENT_SIGNAL,
  MIN_ATTEMPTS_FOR_SKILL_SIGNAL,
  LOW_ACCURACY_THRESHOLD,
} from '../overviewAnalytics';
import { scopeSessions } from '../teacherInsights';
import type { Session, Student } from '../../../types';
import type { Classroom } from '../../../lib/cloudStore';

const students: Student[] = [
  { id: 's1', name: 'Ada', grade: 'class6', createdAt: 0 },
  { id: 's2', name: 'Bo', grade: 'class6', createdAt: 0 },
  { id: 's3', name: 'Cy', grade: 'class6', createdAt: 0 },
];

function resp(itemId: string, correct: boolean, misconception = 'none') {
  return {
    itemId, chosenIndex: 0, correct, timeMs: 1, difficultyAtAttempt: 5,
    abilityBefore: 5, abilityAfter: 5,
    misconceptionTriggered: misconception as 'none',
  };
}

function sess(
  id: string, studentId: string, responses: ReturnType<typeof resp>[],
  over: Partial<Session> = {}
): Session {
  return {
    id, studentId,
    studentSnapshot: { name: 'X', grade: 'class6' },
    window: 'practice', skillId: 'mixed_fractions',
    startedAt: 1, completedAt: 2, lifecycle: 'completed',
    responses, finalAbility: 5, ...over,
  } as Session;
}

const skillOf = (id: string) => (id.startsWith('fr') ? 'FR.02' : 'FR.03');

function analyse(sessions: Session[]) {
  return computeOverviewAnalytics({ sessions, students, itemSkillOf: skillOf });
}

const wrong = (n: number, prefix = 'fr') =>
  Array.from({ length: n }, (_, i) => resp(`${prefix}${i}`, false));
const right = (n: number, prefix = 'fr') =>
  Array.from({ length: n }, (_, i) => resp(`${prefix}${i}`, true));

describe('§7 no placeholder zeros', () => {
  it('an empty class reports emptiness, not "nobody flagged"', () => {
    const a = analyse([]);
    expect(a.isEmpty).toBe(true);
    expect(a.completedSessionCount).toBe(0);
    // The critical assertion: null, NOT an empty array and NOT 0.
    expect(a.flagged).toBeNull();
    expect(a.difficultSkills).toBeNull();
    expect(attentionSummary(a)).toMatch(/no completed sessions/i);
  });

  it('thin evidence reports "not enough activity" rather than a clean bill', () => {
    // Below the attempt threshold: we genuinely cannot judge.
    const a = analyse([sess('a', 's1', wrong(MIN_ATTEMPTS_FOR_STUDENT_SIGNAL - 1))]);
    expect(a.flagged).toBeNull();
    expect(attentionSummary(a)).toBe('Not enough recent activity yet.');
    // It must NOT claim nobody needs attention.
    expect(attentionSummary(a)).not.toMatch(/no students flagged/i);
  });

  it('sufficient evidence with good results DOES report nobody flagged', () => {
    const a = analyse([sess('a', 's1', right(MIN_ATTEMPTS_FOR_STUDENT_SIGNAL))]);
    expect(a.flagged).toEqual([]);
    expect(attentionSummary(a)).toMatch(/no students flagged/i);
  });

  it('one wrong answer never raises a flag', () => {
    const a = analyse([sess('a', 's1', [resp('fr1', false)])]);
    expect(a.flagged).toBeNull();
  });
});

describe('§7 flags follow the stated evidence rule', () => {
  it('flags low accuracy once there are enough attempts', () => {
    const a = analyse([sess('a', 's1', wrong(MIN_ATTEMPTS_FOR_STUDENT_SIGNAL))]);
    expect(a.flagged).toHaveLength(1);
    expect(a.flagged![0].studentId).toBe('s1');
    expect(a.flagged![0].studentName).toBe('Ada');
    expect(a.flagged![0].reasons).toContain('low_recent_accuracy');
    expect(a.flagged![0].accuracy).toBeLessThan(LOW_ACCURACY_THRESHOLD);
  });

  it('flags a repeating misconception even when accuracy is acceptable', () => {
    const responses = [
      ...right(6),
      resp('m1', false, 'denominator_add'),
      resp('m2', false, 'denominator_add'),
      resp('m3', false, 'denominator_add'),
    ];
    const a = analyse([sess('a', 's2', responses)]);
    expect(a.flagged!.some((f) => f.reasons.includes('repeated_misconception')))
      .toBe(true);
  });

  it('does not flag a misconception seen only twice', () => {
    const responses = [
      ...right(6),
      resp('m1', false, 'denominator_add'),
      resp('m2', false, 'denominator_add'),
    ];
    const a = analyse([sess('a', 's2', responses)]);
    const f = a.flagged!.find((x) => x.studentId === 's2');
    expect(f?.reasons ?? []).not.toContain('repeated_misconception');
  });

  it('difficult skills require a minimum sample', () => {
    const few = analyse([sess('a', 's1', wrong(MIN_ATTEMPTS_FOR_SKILL_SIGNAL - 1))]);
    expect(few.difficultSkills).toBeNull();
    const enough = analyse([sess('b', 's1', wrong(MIN_ATTEMPTS_FOR_SKILL_SIGNAL))]);
    expect(enough.difficultSkills).not.toBeNull();
    expect(enough.difficultSkills![0].attempted).toBeGreaterThanOrEqual(
      MIN_ATTEMPTS_FOR_SKILL_SIGNAL
    );
  });
});

describe('§7 partial attempts do not pollute teacher summaries', () => {
  it('exited sessions are excluded from the completed count', () => {
    const a = analyse([
      sess('done', 's1', right(6)),
      sess('quit', 's2', wrong(6), { lifecycle: 'exited', completedAt: null }),
    ]);
    expect(a.completedSessionCount).toBe(1);
    expect(a.activeStudentCount).toBe(1);
    // Bo abandoned a set with 6 wrong answers; that must not flag them.
    expect(a.flagged!.some((f) => f.studentId === 's2')).toBe(false);
  });

  it('in-progress sessions are excluded too', () => {
    const a = analyse([
      sess('open', 's1', wrong(6), { lifecycle: 'in_progress', completedAt: null }),
    ]);
    expect(a.isEmpty).toBe(true);
  });
});

describe('§8 analytics are classroom-scoped, never device-wide', () => {
  const roomA: Classroom = {
    id: 'a', teacherUid: 't', name: 'Class 6 Blue', notes: '',
    studentIds: ['s1'], archived: false, createdAt: 0, updatedAt: 0,
  };
  const roomB: Classroom = {
    id: 'b', teacherUid: 't', name: 'Class 6 Green', notes: '',
    studentIds: ['s2'], archived: false, createdAt: 0, updatedAt: 0,
  };
  const sessions = [
    sess('a1', 's1', wrong(MIN_ATTEMPTS_FOR_STUDENT_SIGNAL)),
    sess('b1', 's2', right(MIN_ATTEMPTS_FOR_STUDENT_SIGNAL)),
  ];

  const scopedAnalytics = (classroomId: string | null) => {
    const scoped = scopeSessions({
      sessions, classrooms: [roomA, roomB], students,
      scope: { classroomId },
    });
    return {
      analytics: computeOverviewAnalytics({
        sessions: scoped.sessions, students, itemSkillOf: skillOf,
      }),
      label: scoped.scopeLabel,
    };
  };

  it('each class sees only its own students', () => {
    const a = scopedAnalytics('a');
    const b = scopedAnalytics('b');
    expect(a.analytics.flagged).toHaveLength(1);
    expect(a.analytics.flagged![0].studentName).toBe('Ada');
    expect(b.analytics.flagged).toEqual([]);
  });

  it('the two classes produce different conclusions', () => {
    expect(attentionSummary(scopedAnalytics('a').analytics)).not.toBe(
      attentionSummary(scopedAnalytics('b').analytics)
    );
  });

  it('each scope carries a truthful label', () => {
    expect(scopedAnalytics('a').label).toBe('Class 6 Blue');
    expect(scopedAnalytics(null).label).toBe('All local data');
  });

  it('the aggregate view is reachable but distinct from either class', () => {
    const all = scopedAnalytics(null).analytics;
    expect(all.completedSessionCount).toBe(2);
    expect(all.activeStudentCount).toBe(2);
  });
});
