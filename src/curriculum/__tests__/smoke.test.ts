// v0.34 — Runtime smoke tests. Walks every item in the bank through
// getItemAlignment(), and every module through the "same code path a
// dashboard tab uses". Catches the v0.33 blank-page bug (missing
// SKILL_ALIGNMENT entries for starter skills).

import { describe, expect, it } from 'vitest';
import { ITEMS } from '../../data/items';
import { buildSkillAlignmentSummary, getItemAlignment } from '../../data/alignment';
import { lessonFor } from '../../data/lessons';
import { getSkills, getModules } from '../index';

describe('runtime smoke — every item resolves an alignment without crashing', () => {
  it('getItemAlignment returns a defined record for every item', () => {
    for (const it of ITEMS) {
      const a = getItemAlignment(it);
      expect(a).toBeDefined();
      expect(typeof a.chapterReference).toBe('string');
      expect(typeof a.competencyTag).toBe('string');
      expect(a.alignmentSkillId).toBe(it.skillId);
    }
  });

  it('buildSkillAlignmentSummary covers every skill that has items', () => {
    const summary = buildSkillAlignmentSummary(ITEMS);
    const skillsWithItems = new Set(ITEMS.map((i) => i.skillId));
    for (const sid of skillsWithItems) {
      expect(summary[sid]).toBeDefined();
      expect(summary[sid].itemCount).toBeGreaterThan(0);
    }
  });
});

describe('runtime smoke — lessonFor never crashes', () => {
  it('every registered skill returns undefined OR a valid lesson', () => {
    for (const grade of ['grade_06', 'grade_07', 'grade_08', 'grade_09', 'grade_10', 'grade_12']) {
      for (const m of getModules(grade, 'mathematics')) {
        for (const s of getSkills(m.id)) {
          const legacy = s.legacyId;
          if (!legacy) continue;
          // Should not throw. Returns undefined for starter skills
          // with no authored lesson, or a Lesson object otherwise.
          expect(() => lessonFor(legacy as never)).not.toThrow();
        }
      }
    }
  });
});
