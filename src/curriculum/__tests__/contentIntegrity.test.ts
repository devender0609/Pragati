// v0.39 — content integrity tests.

import { describe, it, expect } from 'vitest';
import {
  detectDuplicateStems,
  detectMissingSolutions,
  detectShortSolutions,
  detectMcqDuplicateOptions,
  detectMcqMissingMisconception,
  runContentIntegrity,
  checkDifficultyDistribution,
} from '../contentIntegrity';
import { ITEMS } from '../../data/items';

describe('contentIntegrity — bank sanity', () => {
  it('no item is missing a solution string', () => {
    const issues = detectMissingSolutions(ITEMS);
    if (issues.length > 0) {
      console.warn('Items with missing solutions:', issues.map((i) => i.itemId));
    }
    expect(issues).toHaveLength(0);
  });

  it('no MCQ has duplicate option text', () => {
    const issues = detectMcqDuplicateOptions(ITEMS);
    // Log the offenders so a subsequent commit can fix them; we
    // don't want to block CI on already-shipped items — those need
    // teacher-review anyway. See `contentIntegrityReport()` in the
    // Admin & Validation tab for the live counts.
    if (issues.length > 0) {
      console.warn(
        'MCQs with duplicate options (to be fixed):',
        issues.map((i) => i.itemId).join(', ')
      );
    }
    // v0.39 fixed all 6 items surfaced by the initial run. Regression
    // guard: any new item that ships with duplicate MCQ options fails
    // the build.
    expect(issues).toHaveLength(0);
  });

  it('report aggregator returns countable structure', () => {
    const report = runContentIntegrity(ITEMS);
    expect(report.totalItems).toBeGreaterThan(0);
    expect(report.countsBySeverity.error).toBeDefined();
    expect(report.countsBySeverity.warning).toBeDefined();
    expect(report.countsBySeverity.info).toBeDefined();
  });

  it('difficulty check runs without crashing on the real bank', () => {
    const issues = checkDifficultyDistribution(ITEMS);
    // We DON'T assert issues.length === 0 because the current bank
    // legitimately has some modules with only 4 items (all in one
    // band), and that's a real teacher-review action item — the check
    // exists to surface it, not fail CI.
    expect(Array.isArray(issues)).toBe(true);
  });
});

describe('contentIntegrity — targeted unit tests', () => {
  it('detectDuplicateStems flags identical stems', () => {
    const items = [
      { id: 'A', stem: 'What is 2+2?', skillId: 'FR.02', solution: 'four', kind: 'mcq', band: 'foundational', difficulty: 1, skillName: '', cognitiveType: 'Procedural fluency', estimatedTimeSec: 30, options: [{ text: '4', misconception: 'none' }, { text: '3', misconception: 'arithmetic_slip' }, { text: '5', misconception: 'arithmetic_slip' }, { text: '6', misconception: 'arithmetic_slip' }], correctIndex: 0 },
      { id: 'B', stem: 'What is 2+2?', skillId: 'FR.02', solution: 'four', kind: 'mcq', band: 'foundational', difficulty: 1, skillName: '', cognitiveType: 'Procedural fluency', estimatedTimeSec: 30, options: [{ text: '4', misconception: 'none' }, { text: '3', misconception: 'arithmetic_slip' }, { text: '5', misconception: 'arithmetic_slip' }, { text: '6', misconception: 'arithmetic_slip' }], correctIndex: 0 },
    ] as any;
    const issues = detectDuplicateStems(items);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('A');
    expect(issues[0].message).toContain('B');
  });

  it('detectShortSolutions flags terse solutions', () => {
    const items = [
      { id: 'C', stem: 'x', skillId: 'FR.02', solution: 'yes', kind: 'mcq', band: 'foundational', difficulty: 1, skillName: '', cognitiveType: 'Procedural fluency', estimatedTimeSec: 30, options: [{ text: '4', misconception: 'none' }, { text: '3', misconception: 'arithmetic_slip' }, { text: '5', misconception: 'arithmetic_slip' }, { text: '6', misconception: 'arithmetic_slip' }], correctIndex: 0 },
    ] as any;
    const issues = detectShortSolutions(items, 20);
    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe('info');
  });

  it('detectMcqMissingMisconception ignores the correct option', () => {
    // Every distractor here has a real code, so no issues.
    const items = [
      { id: 'D', stem: 'x', skillId: 'FR.02', solution: 'longer explanation than twenty', kind: 'mcq', band: 'foundational', difficulty: 1, skillName: '', cognitiveType: 'Procedural fluency', estimatedTimeSec: 30, options: [{ text: 'A', misconception: 'none' }, { text: 'B', misconception: 'arithmetic_slip' }, { text: 'C', misconception: 'arithmetic_slip' }, { text: 'D', misconception: 'conceptual_gap' }], correctIndex: 0 },
    ] as any;
    const issues = detectMcqMissingMisconception(items);
    expect(issues).toHaveLength(0);
  });
});
