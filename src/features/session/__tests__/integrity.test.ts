// v0.50 §1 + §2 + §4 + §18 — product-integrity tests.
//
// Each block below locks down a place where v0.49's UI made a claim its
// data did not support.

import { describe, it, expect } from 'vitest';
import { ITEMS } from '../../../data/items';
import { MODULES_FOR_GRADE, SKILLS_BY_MODULE, type Grade, type ModuleId } from '../../../types';
import {
  lifecycleOf,
  isCompletedAttempt,
  isExitedAttempt,
  isResumable,
  completedAttempts,
  findResumableSession,
  resumeSummary,
} from '../sessionLifecycle';
import {
  modulePracticeBlueprint,
  buildModulePracticePlan,
  practiceActionLabel,
  MIN_SKILLS_FOR_MIXED,
} from '../modulePracticeBlueprint';
import {
  chapterCheckReadiness,
  startChapterSession,
  CHAPTER_CHECK_NOT_READY,
} from '../StudentSessionController';
import { buildChapterSessionPlan } from '../chapterSessionBuilder';
import { blueprintForModule } from '../../../curriculum/chapterBlueprints';
import type { Session, Student } from '../../../types';

const noShuffle = <T,>(a: T[]): T[] => a.slice();
const FRACTIONS = blueprintForModule('fractions')!;
const student: Student = { id: 'stu-1', name: 'Ada', grade: 'class6', createdAt: 0 };

function sess(over: Partial<Session> & { id: string }): Session {
  return {
    studentId: 'stu-1',
    studentSnapshot: { name: 'Ada', grade: 'class6' },
    window: 'practice',
    skillId: 'mixed_fractions',
    startedAt: 1,
    completedAt: null,
    responses: [],
    finalAbility: 5,
    ...over,
  } as Session;
}

// ===========================================================================
// §1 — session lifecycle
// ===========================================================================

describe('§1 exited sessions are not completed sessions', () => {
  it('an exited attempt reads as exited, not completed', () => {
    const s = sess({ id: 'e1', lifecycle: 'exited', completedAt: null });
    expect(lifecycleOf(s)).toBe('exited');
    expect(isExitedAttempt(s)).toBe(true);
    expect(isCompletedAttempt(s)).toBe(false);
  });

  it('an exited attempt is excluded from completion analytics', () => {
    const all = [
      sess({ id: 'done', lifecycle: 'completed', completedAt: 10 }),
      sess({ id: 'quit', lifecycle: 'exited', completedAt: null }),
      sess({ id: 'open', lifecycle: 'in_progress' }),
    ];
    expect(completedAttempts(all).map((s) => s.id)).toEqual(['done']);
  });

  it('partials can be included ONLY when asked for explicitly', () => {
    const all = [
      sess({ id: 'done', lifecycle: 'completed', completedAt: 10 }),
      sess({ id: 'quit', lifecycle: 'exited', completedAt: null }),
    ];
    expect(
      completedAttempts(all, { includePartial: true }).map((s) => s.id).sort()
    ).toEqual(['done', 'quit']);
  });

  it('an incomplete chapter check can never masquerade as a completed one', () => {
    // The exact v0.49 shape: a chapter check abandoned after 2 of 10.
    const partialCheck = sess({
      id: 'half',
      sessionPurpose: 'chapter_check',
      lifecycle: 'exited',
      completedAt: null,
      requestedItemCount: 10,
      administeredItemCount: 2,
    });
    const checks = completedAttempts([partialCheck]).filter(
      (s) => s.sessionPurpose === 'chapter_check'
    );
    expect(checks).toEqual([]);
  });

  it('legacy sessions with no lifecycle field still resolve correctly', () => {
    expect(lifecycleOf(sess({ id: 'l1', completedAt: 99 }))).toBe('completed');
    expect(lifecycleOf(sess({ id: 'l2', completedAt: null }))).toBe('in_progress');
  });
});

describe('§1 resumable sessions', () => {
  const open = sess({
    id: 'r1',
    lifecycle: 'in_progress',
    lastActivityAt: 500,
    resumePoolItemIds: ['a', 'b', 'c', 'd'],
    resumeCurrentIndex: 2,
    resumeAbility: 6,
    resumeAttemptedIds: ['a', 'b'],
    responses: [
      { itemId: 'a', chosenIndex: 0, correct: true, timeMs: 1, difficultyAtAttempt: 3, abilityBefore: 5, abilityAfter: 6, misconceptionTriggered: 'none' },
      { itemId: 'b', chosenIndex: 0, correct: true, timeMs: 1, difficultyAtAttempt: 3, abilityBefore: 6, abilityAfter: 6, misconceptionTriggered: 'none' },
    ],
  });

  it('persists everything needed to resume the same set', () => {
    expect(isResumable(open)).toBe(true);
    expect(open.resumePoolItemIds).toHaveLength(4);
    expect(open.resumeCurrentIndex).toBe(2);
    expect(open.resumeAbility).toBe(6);
    expect(open.resumeAttemptedIds).toEqual(['a', 'b']);
  });

  it('reports how much of the set is left', () => {
    expect(resumeSummary(open)).toEqual({ answered: 2, total: 4, remaining: 2 });
  });

  it('finds the most recent open set for the right student', () => {
    const older = sess({ ...open, id: 'old', lastActivityAt: 100 });
    const other = sess({ ...open, id: 'other', studentId: 'stu-2', lastActivityAt: 999 });
    const found = findResumableSession([older, open, other], 'stu-1');
    expect(found?.id).toBe('r1');
  });

  it('a completed session is not offered for resume', () => {
    const done = sess({ ...open, id: 'd', lifecycle: 'completed', completedAt: 9 });
    expect(isResumable(done)).toBe(false);
    expect(findResumableSession([done], 'stu-1')).toBeNull();
  });

  it('an in-progress session with no stored pool is not resumable', () => {
    const noPool = sess({ id: 'np', lifecycle: 'in_progress' });
    expect(isResumable(noPool)).toBe(false);
  });

  it('a new chapter session is resumable from the very first question', () => {
    const r = startChapterSession({
      student, blueprint: FRACTIONS, purpose: 'practice',
      items: ITEMS, newId: () => 's', legacySkillMode: 'mixed_fractions',
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.session.lifecycle).toBe('in_progress');
    expect(r.session.completedAt).toBeNull();
    expect(isResumable(r.session)).toBe(true);
    expect(r.session.resumePoolItemIds).toEqual(r.pool.map((i) => i.id));
  });
});

// ===========================================================================
// §2 — generic mixed practice
// ===========================================================================

const REPRESENTATIVE: Array<[Grade, ModuleId]> = (
  ['class1', 'class6', 'class8', 'class10', 'class12'] as Grade[]
).map((g) => [g, MODULES_FOR_GRADE[g][0]]);

describe.each(REPRESENTATIVE)(
  '§2 generic mixed practice — %s / %s',
  (_grade, moduleId) => {
    const bp = modulePracticeBlueprint(moduleId, ITEMS);

    it('gathers the module\'s registered skills, not just the first', () => {
      expect(bp.usableSkillIds.length).toBeGreaterThan(0);
      for (const s of bp.usableSkillIds) {
        expect(SKILLS_BY_MODULE[moduleId]).toContain(s);
      }
    });

    it('never silently collapses to a single skill when it claims to be mixed', () => {
      const plan = buildModulePracticePlan({
        blueprint: bp, items: ITEMS, shuffle: noShuffle,
      });
      if (bp.canBeMixed) {
        // The label says "Mixed practice", so the pool MUST span skills.
        expect(plan.sampledSkillIds.length).toBeGreaterThanOrEqual(
          MIN_SKILLS_FOR_MIXED
        );
        expect(plan.isMixed).toBe(true);
        expect(practiceActionLabel(bp)).toBe('Mixed practice');
      } else {
        // Not enough breadth — the label must NOT say mixed.
        expect(practiceActionLabel(bp)).not.toBe('Mixed practice');
      }
    });

    it('samples breadth-first rather than exhausting one skill', () => {
      const plan = buildModulePracticePlan({
        blueprint: bp, items: ITEMS, shuffle: noShuffle,
      });
      if (!bp.canBeMixed || plan.pool.length < 2) return;
      const counts = new Map<string, number>();
      for (const it of plan.pool) {
        counts.set(it.skillId, (counts.get(it.skillId) ?? 0) + 1);
      }
      const max = Math.max(...counts.values());
      const min = Math.min(...counts.values());
      // Round-robin keeps every sampled skill within one item.
      expect(max - min).toBeLessThanOrEqual(1);
    });

    it('produces a non-empty pool bounded by the configured count', () => {
      const plan = buildModulePracticePlan({
        blueprint: bp, items: ITEMS, shuffle: noShuffle,
      });
      expect(plan.pool.length).toBeGreaterThan(0);
      expect(plan.pool.length).toBeLessThanOrEqual(bp.itemCount);
    });
  }
);

describe('§2 the label always matches the content', () => {
  it('a module with only one usable skill is not called Mixed practice', () => {
    const bp = modulePracticeBlueprint('fractions', ITEMS);
    const oneSkill = { ...bp, usableSkillIds: [bp.usableSkillIds[0]], canBeMixed: false };
    expect(practiceActionLabel(oneSkill)).toBe('Practise this concept');
    const plan = buildModulePracticePlan({
      blueprint: oneSkill, items: ITEMS, shuffle: noShuffle,
    });
    expect(plan.isMixed).toBe(false);
  });

  it('a module with no items offers no practice action at all', () => {
    const bp = modulePracticeBlueprint('fractions', []);
    expect(bp.usableSkillIds).toEqual([]);
    expect(practiceActionLabel(bp)).toBeNull();
  });

  it('registered skills with no items are reported, not hidden', () => {
    const only = ITEMS.filter((i) => i.skillId === 'FR.02');
    const bp = modulePracticeBlueprint('fractions', only);
    expect(bp.usableSkillIds).toEqual(['FR.02']);
    expect(bp.emptySkillIds.length).toBeGreaterThan(0);
    expect(bp.canBeMixed).toBe(false);
  });

  it('generic practice carries no blueprint id — it is not a chapter check', () => {
    const bp = modulePracticeBlueprint('decimals', ITEMS);
    const plan = buildModulePracticePlan({ blueprint: bp, items: ITEMS });
    expect(plan).not.toHaveProperty('blueprintId');
    expect(bp.kind).toBe('module_practice');
  });
});

// ===========================================================================
// §4 — chapter check readiness
// ===========================================================================

function readinessWith(items: typeof ITEMS) {
  const plan = buildChapterSessionPlan({
    blueprint: FRACTIONS, purpose: 'chapter_check', items, shuffle: noShuffle,
  });
  return chapterCheckReadiness(plan, FRACTIONS);
}

describe('§4 a chapter check cannot launch on a partial bank', () => {
  it('the full bank is ready', () => {
    const r = readinessWith(ITEMS);
    expect(r.ready).toBe(true);
    expect(r.missingRequiredSkillIds).toEqual([]);
    expect(r.coveredSkillCount).toBe(r.requiredSkillCount);
  });

  it('blocks when a required skill has no items at all', () => {
    const missingOne = ITEMS.filter((i) => i.skillId !== 'FR.02');
    const r = readinessWith(missingOne);
    expect(r.ready).toBe(false);
    expect(r.missingRequiredSkillIds).toContain('FR.02');
    expect(r.reason).toBe(CHAPTER_CHECK_NOT_READY);
  });

  it('blocks when only one question exists — the v0.49 hole', () => {
    const single = ITEMS.filter((i) => i.skillId === 'FR.02').slice(0, 1);
    const r = readinessWith(single);
    expect(r.ready).toBe(false);
    expect(r.administrableItemCount).toBeLessThan(r.requestedItemCount);
  });

  it('blocks when the pool cannot reach the target item count', () => {
    // One item per required skill: full skill coverage, too few items.
    const thin = FRACTIONS.requiredSkillIds
      .map((s) => ITEMS.find((i) => i.skillId === s))
      .filter(Boolean) as typeof ITEMS;
    const r = readinessWith(thin);
    expect(r.missingRequiredSkillIds).toEqual([]);
    expect(r.ready).toBe(false);
  });

  it('allows a reduced pool only when the blueprint declares a minimum', () => {
    const thin = FRACTIONS.requiredSkillIds
      .map((s) => ITEMS.find((i) => i.skillId === s))
      .filter(Boolean) as typeof ITEMS;
    const relaxed = { ...FRACTIONS, minimumItemCount: thin.length };
    const plan = buildChapterSessionPlan({
      blueprint: relaxed, purpose: 'chapter_check', items: thin, shuffle: noShuffle,
    });
    expect(chapterCheckReadiness(plan, relaxed).ready).toBe(true);
  });

  it('startChapterSession refuses to start an unready check', () => {
    const missingOne = ITEMS.filter((i) => i.skillId !== 'FR.02');
    const r = startChapterSession({
      student, blueprint: FRACTIONS, purpose: 'chapter_check',
      items: missingOne, newId: () => 'x', legacySkillMode: 'mixed_fractions',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe(CHAPTER_CHECK_NOT_READY);
      expect(r.readiness?.missingRequiredSkillIds).toContain('FR.02');
    }
  });

  it('practice is NOT blocked by a partial bank — it claims no coverage', () => {
    const missingOne = ITEMS.filter((i) => i.skillId !== 'FR.02');
    const r = startChapterSession({
      student, blueprint: FRACTIONS, purpose: 'practice',
      items: missingOne, newId: () => 'p', legacySkillMode: 'mixed_fractions',
    });
    expect(r.ok).toBe(true);
  });

  it('persists requested and administered counts for audit', () => {
    const r = startChapterSession({
      student, blueprint: FRACTIONS, purpose: 'chapter_check',
      items: ITEMS, newId: () => 'a', legacySkillMode: 'mixed_fractions',
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.session.requestedItemCount).toBe(FRACTIONS.targetItemCount);
    expect(r.session.administeredItemCount).toBe(0);
    expect(r.session.sampledSkillIds?.length).toBe(
      FRACTIONS.requiredSkillIds.length
    );
  });
});
