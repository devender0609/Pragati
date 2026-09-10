// v0.51 §14 + §12(testing) — format scoring, including safe failure.

import { describe, it, expect } from 'vitest';
import {
  scoreSingleSelect, scoreNumeric, scoreFraction, scoreResponse,
  parseNumeric, parseFraction, simplifyFraction, fractionsEqual,
  isRecordable,
} from '../itemFormats';

describe('§14 single select', () => {
  it('scores a correct and incorrect choice', () => {
    expect(scoreSingleSelect({ kind: 'single_select', chosenIndex: 2 }, 2))
      .toEqual({ status: 'scored', correct: true, score: 1 });
    expect(scoreSingleSelect({ kind: 'single_select', chosenIndex: 1 }, 2))
      .toEqual({ status: 'scored', correct: false, score: 0 });
  });

  it('rejects a missing selection rather than scoring it wrong', () => {
    const r = scoreSingleSelect({ kind: 'single_select', chosenIndex: -1 }, 2);
    expect(r.status).toBe('invalid_response');
    expect(isRecordable(r)).toBe(false);
  });
});

describe('§14 numeric entry', () => {
  it('parses valid numbers', () => {
    expect(parseNumeric('42')).toBe(42);
    expect(parseNumeric(' 3.5 ')).toBe(3.5);
    expect(parseNumeric('-7')).toBe(-7);
    expect(parseNumeric('.5')).toBe(0.5);
  });

  it('rejects blanks and junk instead of coercing to zero', () => {
    // Number('') === 0 would score a blank as the answer 0.
    for (const bad of ['', '   ', 'abc', '1/2', '3..1', '5x', '1e3']) {
      expect(parseNumeric(bad)).toBeNull();
    }
  });

  it('scores exact and tolerance matches', () => {
    expect(scoreNumeric({ kind: 'numeric_entry', raw: '0.25' }, 0.25))
      .toEqual({ status: 'scored', correct: true, score: 1 });
    expect(scoreNumeric({ kind: 'numeric_entry', raw: '0.26' }, 0.25))
      .toEqual({ status: 'scored', correct: false, score: 0 });
    expect(scoreNumeric({ kind: 'numeric_entry', raw: '0.26' }, 0.25, 0.02))
      .toEqual({ status: 'scored', correct: true, score: 1 });
  });

  it('a blank entry is invalid, not incorrect', () => {
    const r = scoreNumeric({ kind: 'numeric_entry', raw: '' }, 0);
    expect(r.status).toBe('invalid_response');
    // Critically: NOT scored as correct against a correct value of 0.
  });
});

describe('§14 fraction entry', () => {
  it('parses integer numerator and denominator', () => {
    expect(parseFraction('3', '4')).toEqual({ numerator: 3, denominator: 4 });
  });

  it('rejects a zero denominator', () => {
    expect(parseFraction('1', '0')).toBeNull();
  });

  it('rejects non-integer parts', () => {
    expect(parseFraction('1.5', '2')).toBeNull();
    expect(parseFraction('1', '2.5')).toBeNull();
  });

  it('accepts any equivalent form by default', () => {
    const correct = { numerator: 1, denominator: 2 };
    for (const [n, d] of [['1','2'], ['2','4'], ['50','100']]) {
      expect(scoreFraction({ kind: 'fraction_entry', numerator: n, denominator: d }, correct))
        .toEqual({ status: 'scored', correct: true, score: 1 });
    }
  });

  it('enforces lowest terms only when the specification asks', () => {
    const correct = { numerator: 1, denominator: 2 };
    const twoQuarters = { kind: 'fraction_entry' as const, numerator: '2', denominator: '4' };
    expect(scoreFraction(twoQuarters, correct).status).toBe('scored');
    expect(scoreFraction(twoQuarters, correct)).toMatchObject({ correct: true });
    expect(scoreFraction(twoQuarters, correct, { requireLowestTerms: true }))
      .toMatchObject({ correct: false });
  });

  it('compares exactly, without floating point', () => {
    expect(fractionsEqual({ numerator: 1, denominator: 3 }, { numerator: 3, denominator: 9 })).toBe(true);
    expect(fractionsEqual({ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 4 })).toBe(false);
  });

  it('simplifies including negative denominators', () => {
    expect(simplifyFraction({ numerator: 6, denominator: 8 })).toEqual({ numerator: 3, denominator: 4 });
    expect(simplifyFraction({ numerator: 1, denominator: -2 })).toEqual({ numerator: -1, denominator: 2 });
  });

  it('an unparseable entry is invalid, not incorrect', () => {
    const r = scoreFraction({ kind: 'fraction_entry', numerator: 'a', denominator: '2' },
      { numerator: 1, denominator: 2 });
    expect(r.status).toBe('invalid_response');
    expect(isRecordable(r)).toBe(false);
  });
});

describe('§14 unsupported formats fail safely', () => {
  const FUTURE = [
    'multi_select', 'ordering', 'matching', 'number_line_response',
    'graph_response', 'coordinate_response', 'interactive_geometry',
    'constructed_response',
  ] as const;

  for (const format of FUTURE) {
    it(`${format} returns unsupported_format, never a score`, () => {
      const r = scoreResponse({ kind: 'unsupported', format }, { format });
      expect(r.status).toBe('unsupported_format');
      // The whole point: it must not be scored either way.
      expect(r).not.toHaveProperty('correct');
      expect(isRecordable(r)).toBe(false);
    });
  }

  it('explains why, so a caller cannot treat it as a wrong answer', () => {
    const r = scoreResponse({ kind: 'unsupported', format: 'ordering' }, { format: 'ordering' });
    if (r.status === 'unsupported_format') {
      expect(r.reason).toMatch(/must not be counted as incorrect/i);
    }
  });
});

describe('§14 dispatch rejects mismatched response kinds', () => {
  it('refuses a numeric response to a single-select item', () => {
    const r = scoreResponse(
      { kind: 'numeric_entry', raw: '1' },
      { format: 'single_select', correctIndex: 0 }
    );
    expect(r.status).toBe('invalid_response');
  });

  it('routes each implemented format to its scorer', () => {
    expect(scoreResponse({ kind: 'single_select', chosenIndex: 1 }, { format: 'single_select', correctIndex: 1 }))
      .toMatchObject({ status: 'scored', correct: true });
    expect(scoreResponse({ kind: 'numeric_entry', raw: '5' }, { format: 'numeric_entry', correctValue: 5 }))
      .toMatchObject({ status: 'scored', correct: true });
    expect(scoreResponse({ kind: 'fraction_entry', numerator: '1', denominator: '2' },
      { format: 'fraction_entry', correct: { numerator: 1, denominator: 2 } }))
      .toMatchObject({ status: 'scored', correct: true });
  });
});
