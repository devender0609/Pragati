// ---------------------------------------------------------------------------
// v0.84.0-c11.11 checkpoint 82 — THE STUDENT CONTRACT THE HARNESS DEPENDS ON.
//
// Three checkpoints lost their browser gate because the harness drove the
// wrong state and failed silently into Class 6. These tests pin the contract
// it now relies on, so a future change to student resolution breaks here
// rather than in a browser run nobody reads carefully.
// ---------------------------------------------------------------------------

import { describe, expect, it, beforeEach } from 'vitest';
import { normalizeGrade } from '../gradeNormalization';
import { loadStudents, saveStudent } from '../storage';
import { STORAGE_KEYS, class11Student } from '../../../tools/browser-qa/studentFixture.mjs';

describe('the grade authority is the persisted Student record', () => {
  beforeEach(() => localStorage.clear());

  it('normalizes the fixture grade to Class 11', () => {
    expect(normalizeGrade(class11Student().grade)).toBe('class11');
  });

  it('round-trips the fixture through the real storage layer', () => {
    saveStudent(class11Student() as never);
    const loaded = loadStudents();
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('browser-qa-class11');
    expect(normalizeGrade(loaded[0].grade)).toBe('class11');
  });

  it('accepts the legacy free-text grade representations too', () => {
    for (const g of ['11', 'Class 11', 'class11', 'Grade 11']) {
      expect(normalizeGrade(g), g).toBe('class11');
    }
    expect(normalizeGrade('class6')).toBe('class6');
  });

  it('does not let the legacy selected-grade key define the active grade', () => {
    // This is the mistake that cost checkpoint 81: setting the legacy key and
    // expecting authored Learn to follow it.
    localStorage.setItem(STORAGE_KEYS.legacySelectedGrade, 'class11');
    expect(loadStudents()).toEqual([]);
    // With no Student record there is no active student, whatever that key says.
    saveStudent({ ...class11Student(), grade: 'class6' } as never);
    expect(normalizeGrade(loadStudents()[0].grade)).toBe('class6');
    expect(localStorage.getItem(STORAGE_KEYS.legacySelectedGrade)).toBe('class11');
  });

  it('names the keys the fixture actually writes', () => {
    expect(STORAGE_KEYS.students).toBe('pragati.students.v1');
    expect(STORAGE_KEYS.appMode).toBe('pragati.app_mode.v1');
    expect(STORAGE_KEYS.onboarding).toBe('pragati.onboarding.v1');
  });

  it('treats an unresolvable grade as no active student rather than a default', () => {
    expect(normalizeGrade('')).toBeNull();
    expect(normalizeGrade(undefined)).toBeNull();
    expect(normalizeGrade('not a grade')).toBeNull();
  });
});

describe('the branch-based graph specs are renderable', () => {
  it('includes both graph kinds in the visual union and validator', async () => {
    const { validateVisual } = await import('../../curriculum/visualSpecification');
    const { G_RECIPROCAL } = await import('../../curriculum/relationsClass11Sections');
    const { G_TAN } = await import('../../curriculum/trigClass11Sections');
    // Before checkpoint 82 these fell through the dispatch and rendered as
    // nothing, which no unit test noticed.
    expect(validateVisual(G_RECIPROCAL as never)).toEqual([]);
    expect(validateVisual(G_TAN as never)).toEqual([]);
  });

  it('rejects a branch-based graph with no altText', async () => {
    const { validateVisual } = await import('../../curriculum/visualSpecification');
    const { G_RECIPROCAL } = await import('../../curriculum/relationsClass11Sections');
    expect(validateVisual({ ...G_RECIPROCAL, altText: '  ' } as never))
      .toContain('altText is required');
  });
});
