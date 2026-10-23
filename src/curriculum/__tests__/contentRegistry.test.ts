// v0.50 §14 + §18 — content loading architecture.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  contentKeyToPath,
  registerChapterContent,
  registeredChapterPaths,
  registeredChaptersForGrade,
  loadChapterContent,
  __resetContentRegistry,
  CURRENT_MIGRATION_STEP,
  MIGRATION_STEPS,
  type ContentKey,
} from '../contentRegistry';

const key = (grade: ContentKey['grade'], chapter: string): ContentKey => ({
  curriculum: 'cbse', grade, subject: 'mathematics', chapter,
});

beforeEach(() => __resetContentRegistry());

describe('§14 content addressing', () => {
  it('produces the grade-partitioned path layout', () => {
    expect(contentKeyToPath(key('class1', 'counting'))).toBe(
      'curriculum/cbse/grade-01/mathematics/counting'
    );
    expect(contentKeyToPath(key('class12', 'calculus'))).toBe(
      'curriculum/cbse/grade-12/mathematics/calculus'
    );
  });

  it('zero-pads the grade so paths sort correctly', () => {
    const paths = ['class10', 'class2', 'class1'].map((g) =>
      contentKeyToPath(key(g as ContentKey['grade'], 'x'))
    );
    expect([...paths].sort()).toEqual([
      'curriculum/cbse/grade-01/mathematics/x',
      'curriculum/cbse/grade-02/mathematics/x',
      'curriculum/cbse/grade-10/mathematics/x',
    ]);
  });
});

describe('§14 lazy loading', () => {
  it('registering a chapter does NOT load its content', async () => {
    let loaded = false;
    registerChapterContent(key('class6', 'fractions'), async () => {
      loaded = true;
      return { key: key('class6', 'fractions'), items: [], lessons: {}, legacyModuleId: 'fractions' };
    });
    // The whole point: registration is cheap, content is deferred.
    expect(loaded).toBe(false);
    expect(registeredChapterPaths()).toHaveLength(1);

    await loadChapterContent(key('class6', 'fractions'));
    expect(loaded).toBe(true);
  });

  it('memoises so a chapter is fetched once', async () => {
    let calls = 0;
    registerChapterContent(key('class6', 'fractions'), async () => {
      calls += 1;
      return { key: key('class6', 'fractions'), items: [], lessons: {}, legacyModuleId: 'fractions' };
    });
    await loadChapterContent(key('class6', 'fractions'));
    await loadChapterContent(key('class6', 'fractions'));
    expect(calls).toBe(1);
  });

  it('returns null for an unregistered chapter rather than throwing', () => {
    expect(loadChapterContent(key('class3', 'nothing-here'))).toBeNull();
  });

  it('lists chapters per grade, so one grade never pulls another', () => {
    registerChapterContent(key('class1', 'counting'), async () => ({
      key: key('class1', 'counting'), items: [], lessons: {}, legacyModuleId: null,
    }));
    registerChapterContent(key('class6', 'fractions'), async () => ({
      key: key('class6', 'fractions'), items: [], lessons: {}, legacyModuleId: 'fractions',
    }));
    expect(registeredChaptersForGrade('class1')).toEqual([
      'curriculum/cbse/grade-01/mathematics/counting',
    ]);
    expect(registeredChaptersForGrade('class6')).toEqual([
      'curriculum/cbse/grade-06/mathematics/fractions',
    ]);
    expect(registeredChaptersForGrade('class9')).toEqual([]);
  });
});

describe('§14 migration state is declared, not assumed', () => {
  it('reports the current step', () => {
    expect(MIGRATION_STEPS).toContain(CURRENT_MIGRATION_STEP);
  });

  it('v0.50 has NOT moved any content yet', () => {
    // Guards the honesty claim in the version report: if someone
    // migrates content without advancing the step, this fails.
    expect(CURRENT_MIGRATION_STEP).toBe('registry_and_loader');
    expect(registeredChapterPaths()).toEqual([]);
  });
});
