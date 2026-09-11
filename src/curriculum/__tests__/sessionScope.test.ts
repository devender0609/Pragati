// v0.29 tests — Session scope helpers + growth comparability guard.

import { describe, expect, it } from 'vitest';
import {
  areSessionsComparable,
  comparabilityReason,
  scopeFromSession,
} from '../index';
import type { Session } from '../../types';

// Small builder to keep tests short.
function mockSession(overrides: Partial<Session>): Session {
  return {
    id: overrides.id ?? 's1',
    studentId: 'student-1',
    studentSnapshot: { name: 'Test', grade: 'Class 6', ...overrides.studentSnapshot },
    window: 'practice',
    skillId: (overrides.skillId ?? 'mixed') as Session['skillId'],
    startedAt: 0,
    completedAt: null,
    responses: [],
    finalAbility: 5,
    ...overrides,
  };
}

describe('scopeFromSession', () => {
  it('uses v0.26+ curriculum fields when present', () => {
    const s = mockSession({
      curriculumId: 'cbse',
      gradeId: 'grade_06',
      subjectId: 'mathematics',
      blueprintId: 'cbse_g06_math_diagnostic',
      skillId: 'mixed',
    });
    const scope = scopeFromSession(s);
    expect(scope).toBeDefined();
    expect(scope!.curriculumId).toBe('cbse');
    expect(scope!.gradeId).toBe('grade_06');
    expect(scope!.subjectId).toBe('mathematics');
    expect(scope!.blueprintId).toBe('cbse_g06_math_diagnostic');
    expect(scope!.crossModule).toBe(true);
  });

  it('falls back to legacy SkillMode when no curriculum fields are set', () => {
    const s = mockSession({ skillId: 'FR.06' });
    const scope = scopeFromSession(s);
    expect(scope).toBeDefined();
    expect(scope!.gradeId).toBe('grade_06');
    expect(scope!.singleSkillId).toBe('cbse_g06_math_skill_FR.06');
  });

  it('legacy bare "mixed" resolves to Class 6 cross-module', () => {
    const s = mockSession({ skillId: 'mixed' });
    const scope = scopeFromSession(s);
    expect(scope!.gradeId).toBe('grade_06');
    expect(scope!.crossModule).toBe(true);
  });
});

describe('areSessionsComparable — growth guard', () => {
  it('two "mixed" Class 6 sessions are comparable', () => {
    const a = mockSession({ id: 'a', skillId: 'mixed' });
    const b = mockSession({ id: 'b', skillId: 'mixed' });
    expect(areSessionsComparable(a, b)).toBe(true);
  });

  it('a v0.28 Class 6 blueprint session and a legacy Class 6 "mixed" session ARE comparable', () => {
    const legacy = mockSession({ id: 'a', skillId: 'mixed' });
    const v028 = mockSession({
      id: 'b',
      skillId: 'mixed',
      curriculumId: 'cbse',
      gradeId: 'grade_06',
      subjectId: 'mathematics',
      blueprintId: 'cbse_g06_math_diagnostic',
    });
    expect(areSessionsComparable(legacy, v028)).toBe(true);
  });

  it('a Class 6 mixed session is NOT comparable to a Class 7 blueprint session', () => {
    const c6 = mockSession({ id: 'a', skillId: 'mixed' });
    const c7 = mockSession({
      id: 'b',
      skillId: 'mixed',
      curriculumId: 'cbse',
      gradeId: 'grade_07',
      subjectId: 'mathematics',
      blueprintId: 'cbse_g07_math_diagnostic',
    });
    expect(areSessionsComparable(c6, c7)).toBe(false);
  });

  it('same single-skill sessions across time are comparable', () => {
    const a = mockSession({ id: 'a', skillId: 'FR.06', completedAt: 1 });
    const b = mockSession({ id: 'b', skillId: 'FR.06', completedAt: 2 });
    expect(areSessionsComparable(a, b)).toBe(true);
  });

  it('FR.06 and FR.07 sessions are NOT comparable', () => {
    const a = mockSession({ id: 'a', skillId: 'FR.06' });
    const b = mockSession({ id: 'b', skillId: 'FR.07' });
    expect(areSessionsComparable(a, b)).toBe(false);
  });

  it('cross-grade single-skill sessions are NOT comparable (LA.03 is Class 7, FR.06 is Class 6)', () => {
    const c6 = mockSession({ id: 'a', skillId: 'FR.06' });
    const c7 = mockSession({ id: 'b', skillId: 'LA.03' });
    expect(areSessionsComparable(c6, c7)).toBe(false);
  });
});

describe('comparabilityReason', () => {
  it('returns null when sessions are comparable', () => {
    const a = mockSession({ id: 'a', skillId: 'mixed' });
    const b = mockSession({ id: 'b', skillId: 'mixed' });
    expect(comparabilityReason(a, b)).toBeNull();
  });

  it('explains grade mismatch for a Class 6 vs Class 7 pair', () => {
    const c6 = mockSession({ id: 'a', skillId: 'FR.06' });
    const c7 = mockSession({ id: 'b', skillId: 'LA.03' });
    const reason = comparabilityReason(c6, c7);
    expect(reason).toBeDefined();
    expect(reason).toMatch(/grade|skill|module/i);
  });
});
