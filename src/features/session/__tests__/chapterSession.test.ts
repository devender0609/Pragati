// v0.49 §3 + §11 — mixed practice vs chapter check.
//
// These tests are the proof that the blueprint fields are load-bearing.
// If someone reverts the engine to the old "both buttons call the same
// SkillMode" behaviour, every test in the first describe block fails.

import { describe, it, expect } from 'vitest';
import { ITEMS } from '../../../data/items';
import { blueprintForChapter, blueprintForModule } from '../../../curriculum/chapterBlueprints';
import {
  buildChapterSessionPlan,
  maxItemsPerSkill,
  targetCountFor,
  skillsInScopeFor,
} from '../chapterSessionBuilder';
import { startChapterSession } from '../StudentSessionController';
import { hintsAllowed, purposeOf } from '../sessionPurpose';
import type { Student } from '../../../types';

const FRACTIONS = blueprintForChapter(
  'official:g06_fractions_officialplaceholder'
)!;

// Deterministic shuffle so item selection is reproducible.
const noShuffle = <T,>(a: T[]): T[] => a.slice();

const student: Student = {
  id: 'stu-1',
  name: 'Ada',
  grade: 'class6',
  createdAt: 0,
};

function plan(purpose: 'practice' | 'chapter_check') {
  return buildChapterSessionPlan({
    blueprint: FRACTIONS,
    purpose,
    items: ITEMS,
    shuffle: noShuffle,
  });
}

describe('§3 mixed practice and chapter check are genuinely different', () => {
  it('the blueprint exists and is the Fractions reference chapter', () => {
    expect(FRACTIONS).toBeTruthy();
    expect(FRACTIONS.legacyModuleId).toBe('fractions');
    expect(blueprintForModule('fractions')).toBe(FRACTIONS);
  });

  it('differ in purpose', () => {
    expect(plan('practice').purpose).toBe('practice');
    expect(plan('chapter_check').purpose).toBe('chapter_check');
  });

  it('differ in item count, and the counts come from the blueprint', () => {
    const practice = plan('practice');
    const check = plan('chapter_check');

    // The requested counts are the blueprint's own fields — not a
    // hard-coded SESSION_SIZE.
    expect(practice.requestedItemCount).toBe(
      FRACTIONS.mixedPracticeItemCount
    );
    expect(check.requestedItemCount).toBe(FRACTIONS.targetItemCount);
    expect(practice.requestedItemCount).not.toBe(check.requestedItemCount);

    // And the pools actually reflect those counts.
    expect(practice.pool.length).toBe(FRACTIONS.mixedPracticeItemCount);
    expect(check.pool.length).toBe(FRACTIONS.targetItemCount);
    expect(check.pool.length).toBeGreaterThan(practice.pool.length);
  });

  it('changing targetItemCount changes the chapter check pool', () => {
    // The strongest form of "the field is load-bearing": mutate it on a
    // copy and watch the output move.
    const smaller = { ...FRACTIONS, targetItemCount: 4 };
    const p = buildChapterSessionPlan({
      blueprint: smaller,
      purpose: 'chapter_check',
      items: ITEMS,
      shuffle: noShuffle,
    });
    expect(p.pool.length).toBe(4);
  });

  it('differ in skill coverage behaviour', () => {
    const practice = plan('practice');
    const check = plan('chapter_check');

    // The check covers more distinct required skills than the shorter
    // practice run does.
    expect(check.sampledSkillIds.length).toBeGreaterThan(
      practice.sampledSkillIds.length
    );

    // Every sampled skill is genuinely in the blueprint's scope.
    for (const s of check.sampledSkillIds) {
      expect(FRACTIONS.requiredSkillIds).toContain(s);
    }
  });

  it('chapter check does not oversample one skill while starving another', () => {
    const check = plan('chapter_check');
    const covered = check.sampledSkillIds.length;
    const perSkillMax = maxItemsPerSkill(check);

    // Round-robin guarantee: no skill can be more than one item ahead
    // of any other skill that still had items available.
    expect(perSkillMax).toBeLessThanOrEqual(
      Math.ceil(check.pool.length / covered)
    );

    // With 10 items over 7 required skills, every skill with items must
    // appear at least once.
    expect(covered).toBe(
      FRACTIONS.requiredSkillIds.length -
        check.missingRequiredSkillIds.length
    );
  });

  it('sampledSkillIds is measured from the pool, not copied from intent', () => {
    // Only two skills have items → only two can be reported as sampled,
    // even though the blueprint requires seven.
    const twoSkills = ITEMS.filter(
      (i) => i.skillId === 'FR.02' || i.skillId === 'FR.03'
    );
    const p = buildChapterSessionPlan({
      blueprint: FRACTIONS,
      purpose: 'chapter_check',
      items: twoSkills,
      shuffle: noShuffle,
    });
    expect(new Set(p.sampledSkillIds)).toEqual(new Set(['FR.02', 'FR.03']));
    expect(p.sampledSkillIds.length).toBeLessThan(
      FRACTIONS.requiredSkillIds.length
    );
    // And the gap is reported rather than hidden.
    expect(p.missingRequiredSkillIds.length).toBeGreaterThan(0);
  });

  it('differ in hint availability', () => {
    expect(hintsAllowed('practice')).toBe(true);
    expect(hintsAllowed('concept_practice')).toBe(true);
    expect(hintsAllowed('chapter_check')).toBe(false);
  });

  it('scope: a check draws only required skills; practice may use optional ones', () => {
    const withOptional = {
      ...FRACTIONS,
      requiredSkillIds: ['FR.02' as const],
      optionalSkillIds: ['FR.03' as const],
    };
    expect(skillsInScopeFor(withOptional, 'chapter_check')).toEqual(['FR.02']);
    expect(skillsInScopeFor(withOptional, 'practice')).toEqual([
      'FR.02',
      'FR.03',
    ]);
    expect(targetCountFor(withOptional, 'chapter_check')).toBe(
      withOptional.targetItemCount
    );
  });
});

describe('§3 session metadata is written to the snapshot', () => {
  function start(purpose: 'practice' | 'chapter_check') {
    const r = startChapterSession({
      student,
      blueprint: FRACTIONS,
      purpose,
      items: ITEMS,
      newId: () => `sess-${purpose}`,
      now: 1000,
      legacySkillMode: 'mixed_fractions',
    });
    if (!r.ok) throw new Error(r.reason);
    return r;
  }

  it('records blueprint id, version, purpose, sampled skills, and chapter', () => {
    const { session, plan: p } = start('chapter_check');
    expect(session.chapterBlueprintId).toBe(FRACTIONS.blueprintId);
    expect(session.chapterBlueprintVersion).toBe(FRACTIONS.blueprintVersion);
    expect(session.sessionPurpose).toBe('chapter_check');
    expect(session.sampledSkillIds).toEqual(p.sampledSkillIds);
    expect(session.chapterId).toBe(FRACTIONS.chapterId);
    expect(session.chapterModuleId).toBe('fractions');
  });

  it('two sessions from the same chapter are distinguishable by purpose', () => {
    const a = start('practice').session;
    const b = start('chapter_check').session;
    expect(purposeOf(a)).toBe('practice');
    expect(purposeOf(b)).toBe('chapter_check');
    expect(purposeOf(a)).not.toBe(purposeOf(b));
  });

  it('legacy sessions with no recorded purpose read as null, not a guess', () => {
    expect(purposeOf({})).toBeNull();
    expect(purposeOf({ sessionPurpose: 'something_else' })).toBeNull();
  });

  it('keeps the legacy skillId field so existing reports still work', () => {
    expect(start('practice').session.skillId).toBe('mixed_fractions');
  });
});

describe('§11 zero-item protection', () => {
  it('refuses to start a session when the bank has no items for the chapter', () => {
    const r = startChapterSession({
      student,
      blueprint: FRACTIONS,
      purpose: 'chapter_check',
      items: [],
      newId: () => 'x',
      legacySkillMode: 'mixed_fractions',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toMatch(/no questions ready/i);
    }
  });

  it('builds an empty plan rather than throwing, so the guard stays in one place', () => {
    const p = buildChapterSessionPlan({
      blueprint: FRACTIONS,
      purpose: 'practice',
      items: [],
      shuffle: noShuffle,
    });
    expect(p.pool).toEqual([]);
    expect(p.sampledSkillIds).toEqual([]);
    expect(p.missingRequiredSkillIds).toEqual(FRACTIONS.requiredSkillIds);
  });
});

describe('§3 chapter check is not offered where no blueprint exists', () => {
  it('returns null for chapters without an authored blueprint', () => {
    expect(blueprintForChapter('legacy:decimals')).toBeNull();
    expect(blueprintForChapter('legacy:algebra')).toBeNull();
    expect(blueprintForModule('geometry')).toBeNull();
    expect(blueprintForChapter('official:does_not_exist')).toBeNull();
  });
});
