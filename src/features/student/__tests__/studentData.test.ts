// v0.48 §4 + §5 — student data isolation + continue-learning tests.

import { describe, it, expect } from 'vitest';
import {
  sessionsForStudentIn,
  findContinueTarget,
} from '../studentData';
import type { Session } from '../../../types';

// Small session-factory to keep tests readable.
function sess(args: Partial<Session> & {
  id: string;
  studentId: string;
  studentName: string;
  skillId?: string;
  completedAt?: number;
}): Session {
  return {
    id: args.id,
    studentId: args.studentId,
    studentSnapshot: { name: args.studentName, grade: 'class6' } as never,
    startedAt: 1,
    completedAt: args.completedAt ?? 100,
    window: 'baseline',
    skillId: (args.skillId ?? 'FR.02') as never,
    responses: [],
    finalAbility: 0,
  } as unknown as Session;
}

describe('§4 — student data isolation by ID', () => {
  it('two students with the same name never share sessions', () => {
    const sessions: Session[] = [
      sess({ id: 's1', studentId: 'A', studentName: 'Riya' }),
      sess({ id: 's2', studentId: 'B', studentName: 'Riya' }),
      sess({ id: 's3', studentId: 'A', studentName: 'Riya' }),
    ];
    const a = sessionsForStudentIn(sessions, 'A');
    const b = sessionsForStudentIn(sessions, 'B');
    expect(a.map((s) => s.id).sort()).toEqual(['s1', 's3']);
    expect(b.map((s) => s.id).sort()).toEqual(['s2']);
    // Total should equal sum of parts.
    expect(a.length + b.length).toBe(sessions.length);
  });

  it('completedOnly ignores in-progress sessions', () => {
    const sessions: Session[] = [
      sess({ id: 's1', studentId: 'A', studentName: 'X', completedAt: 0 }),
      sess({ id: 's2', studentId: 'A', studentName: 'X', completedAt: 100 }),
    ];
    const done = sessionsForStudentIn(sessions, 'A', { completedOnly: true });
    expect(done.map((s) => s.id)).toEqual(['s2']);
  });
});

describe('§5 — findContinueTarget', () => {
  const CLASS6_LAUNCHABLE = [
    'official:g06_fractions_officialplaceholder',
    'legacy:fractions',
    'legacy:decimals',
    'legacy:geometry',
  ];

  it('no previous session → returns a start target with isResume false', () => {
    const r = findContinueTarget('A', 'class6', {
      sessions: [],
      launchableChapterIds: CLASS6_LAUNCHABLE,
    });
    expect(r).not.toBeNull();
    expect(r!.isResume).toBe(false);
  });

  it('recent session in Fractions resolves to the Fractions chapter', () => {
    const r = findContinueTarget('A', 'class6', {
      sessions: [
        sess({ id: 's1', studentId: 'A', studentName: 'X', skillId: 'FR.06', completedAt: 100 }),
      ],
      launchableChapterIds: CLASS6_LAUNCHABLE,
    });
    expect(r).not.toBeNull();
    expect(r!.isResume).toBe(true);
    expect(r!.resolved.primaryLegacyModuleId).toBe('fractions');
    expect(r!.skillId).toBe('FR.06');
  });

  it('recent session in another module (Decimals) resolves to Decimals', () => {
    const r = findContinueTarget('A', 'class6', {
      sessions: [
        sess({ id: 's1', studentId: 'A', studentName: 'X', skillId: 'DE.02', completedAt: 200 }),
      ],
      launchableChapterIds: CLASS6_LAUNCHABLE,
    });
    expect(r).not.toBeNull();
    expect(r!.resolved.primaryLegacyModuleId).toBe('decimals');
  });

  it("does NOT use another student's session", () => {
    const r = findContinueTarget('A', 'class6', {
      sessions: [
        sess({ id: 's1', studentId: 'B', studentName: 'X', skillId: 'FR.06', completedAt: 200 }),
      ],
      launchableChapterIds: CLASS6_LAUNCHABLE,
    });
    // Falls back to first launchable — not a resume.
    expect(r!.isResume).toBe(false);
  });

  it('rejects a session whose skill belongs to another grade', () => {
    const r = findContinueTarget('A', 'class6', {
      sessions: [
        sess({ id: 's1', studentId: 'A', studentName: 'X', skillId: 'G10.02', completedAt: 200 }),
      ],
      launchableChapterIds: CLASS6_LAUNCHABLE,
    });
    // Cross-grade session ignored; falls back.
    expect(r!.isResume).toBe(false);
  });

  it('picks the most recent completed session of many', () => {
    const r = findContinueTarget('A', 'class6', {
      sessions: [
        sess({ id: 's1', studentId: 'A', studentName: 'X', skillId: 'FR.06', completedAt: 10 }),
        sess({ id: 's2', studentId: 'A', studentName: 'X', skillId: 'DE.02', completedAt: 100 }),
      ],
      launchableChapterIds: CLASS6_LAUNCHABLE,
    });
    expect(r!.resolved.primaryLegacyModuleId).toBe('decimals');
  });
});
