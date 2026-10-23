// v0.48 §6 — grade normalization tests.

import { describe, it, expect } from 'vitest';
import { normalizeGrade } from '../gradeNormalization';

describe('normalizeGrade', () => {
  // Every canonical class1..class12 round-trips.
  for (let n = 1; n <= 12; n++) {
    it(`class${n} normalises`, () => {
      expect(normalizeGrade(`class${n}`)).toBe(`class${n}`);
      expect(normalizeGrade(`Class ${n}`)).toBe(`class${n}`);
      expect(normalizeGrade(`Grade ${n}`)).toBe(`class${n}`);
      expect(normalizeGrade(`grade_${String(n).padStart(2, '0')}`)).toBe(
        `class${n}`
      );
      expect(normalizeGrade(`grade_${n}`)).toBe(`class${n}`);
      expect(normalizeGrade(` ${n} `)).toBe(`class${n}`);
      expect(normalizeGrade(`${n}`)).toBe(`class${n}`);
    });
  }

  it('unknown strings return null (no silent Class 6 default)', () => {
    expect(normalizeGrade('KG')).toBeNull(); // no number — reject
    expect(normalizeGrade('LKG A')).toBeNull();
    expect(normalizeGrade('elementary')).toBeNull();
    expect(normalizeGrade('')).toBeNull();
    expect(normalizeGrade('   ')).toBeNull();
    expect(normalizeGrade(0)).toBeNull();
    expect(normalizeGrade(null)).toBeNull();
    expect(normalizeGrade(undefined)).toBeNull();
    expect(normalizeGrade({})).toBeNull();
  });

  it('out-of-range numbers return null', () => {
    expect(normalizeGrade('0')).toBeNull();
    expect(normalizeGrade('13')).toBeNull();
    expect(normalizeGrade('99')).toBeNull();
    expect(normalizeGrade('class 0')).toBeNull();
    expect(normalizeGrade('grade_13')).toBeNull();
  });

  it('multi-token strings we do not recognise return null', () => {
    // We accept a subject-appropriate prefix + number. Random text
    // around a number must NOT resolve.
    expect(normalizeGrade('foo 6 bar')).toBeNull();
    expect(normalizeGrade('year 6 english')).toBeNull();
  });

  it('recognised prefixes plus trailing section letter resolve', () => {
    expect(normalizeGrade('Class 6A')).toBe('class6');
    expect(normalizeGrade('Class 8-B')).toBe('class8');
    expect(normalizeGrade('std 4')).toBe('class4');
    expect(normalizeGrade('standard 10')).toBe('class10');
  });
});
