// v0.26 tests — legacy migrations.

import { describe, expect, it } from 'vitest';
import {
  migrateLegacyGradeToken,
  migrateLegacySkillMode,
  migrateLegacyStudentGrade,
  scopesAreComparable,
} from '../index';

describe('migrateLegacyGradeToken', () => {
  it("converts old union-token 'class6' to grade_06", () => {
    expect(migrateLegacyGradeToken('class6')).toBe('grade_06');
  });
  it("converts old union-token 'class7' to grade_07", () => {
    expect(migrateLegacyGradeToken('class7')).toBe('grade_07');
  });
  it("converts free-text 'Class 6' to grade_06", () => {
    expect(migrateLegacyGradeToken('Class 6')).toBe('grade_06');
  });
  it("accepts already-normalised 'grade_06'", () => {
    expect(migrateLegacyGradeToken('grade_06')).toBe('grade_06');
  });
  it("supports 'Class 1' through 'Class 12'", () => {
    for (let n = 1; n <= 12; n++) {
      expect(migrateLegacyGradeToken(`Class ${n}`)).toBe(`grade_${String(n).padStart(2, '0')}`);
    }
  });
  it('returns undefined for unknown input', () => {
    expect(migrateLegacyGradeToken('')).toBeUndefined();
    expect(migrateLegacyGradeToken(null)).toBeUndefined();
    expect(migrateLegacyGradeToken('Not a grade')).toBeUndefined();
    expect(migrateLegacyGradeToken('Class 13')).toBeUndefined();
  });
});

describe("migrateLegacySkillMode ('mixed' meant Class 6 Math)", () => {
  it("bare 'mixed' resolves to Class 6 Math cross-module scope", () => {
    const scope = migrateLegacySkillMode('mixed');
    expect(scope).toBeDefined();
    expect(scope!.curriculumId).toBe('cbse');
    expect(scope!.gradeId).toBe('grade_06');
    expect(scope!.subjectId).toBe('mathematics');
    expect(scope!.crossModule).toBe(true);
    expect(scope!.singleSkillId).toBeUndefined();
    expect(scope!.moduleId).toBeUndefined();
  });

  it("'mixed_fractions' resolves to Class 6 module scope", () => {
    const scope = migrateLegacySkillMode('mixed_fractions');
    expect(scope).toBeDefined();
    expect(scope!.gradeId).toBe('grade_06');
    expect(scope!.moduleId).toBe('cbse_g06_math_fractions');
    expect(scope!.singleSkillId).toBeUndefined();
  });

  it("'mixed_c7_lines_angles' resolves to Class 7 module scope", () => {
    const scope = migrateLegacySkillMode('mixed_c7_lines_angles');
    expect(scope).toBeDefined();
    expect(scope!.gradeId).toBe('grade_07');
    expect(scope!.moduleId).toBe('cbse_g07_math_c7_lines_angles');
  });

  it("a legacy single skill id 'FR.06' resolves to Class 6 skill scope", () => {
    const scope = migrateLegacySkillMode('FR.06');
    expect(scope).toBeDefined();
    expect(scope!.gradeId).toBe('grade_06');
    expect(scope!.singleSkillId).toBe('cbse_g06_math_skill_FR.06');
  });

  it("a legacy single skill id 'LA.03' resolves to Class 7 skill scope", () => {
    const scope = migrateLegacySkillMode('LA.03');
    expect(scope).toBeDefined();
    expect(scope!.gradeId).toBe('grade_07');
    expect(scope!.singleSkillId).toBe('cbse_g07_math_skill_LA.03');
  });

  it('returns undefined for unknown modes', () => {
    expect(migrateLegacySkillMode('')).toBeUndefined();
    expect(migrateLegacySkillMode('foo_bar')).toBeUndefined();
  });
});

describe('migrateLegacyStudentGrade', () => {
  it("populates gradeId + curriculumId + subjectId for 'Class 6'", () => {
    const out = migrateLegacyStudentGrade('Class 6');
    expect(out.gradeId).toBe('grade_06');
    expect(out.curriculumId).toBe('cbse');
    expect(out.subjectId).toBe('mathematics');
  });
  it('returns empty object for unknown grade', () => {
    expect(migrateLegacyStudentGrade('KG')).toEqual({});
    expect(migrateLegacyStudentGrade(undefined)).toEqual({});
  });
});

describe('scopesAreComparable — growth guard', () => {
  it('two Class 6 mixed scopes are comparable', () => {
    const a = migrateLegacySkillMode('mixed')!;
    const b = migrateLegacySkillMode('mixed')!;
    expect(scopesAreComparable(a, b)).toBe(true);
  });

  it('Class 6 mixed and Class 7 cross-module are NOT comparable', () => {
    const class6mixed = migrateLegacySkillMode('mixed')!;
    // Simulate a Class 7 cross-module scope (no such legacy mode existed;
    // in v0.26 this would be created via a Class 7 diagnostic blueprint).
    const class7cross = {
      curriculumId: 'cbse',
      gradeId: 'grade_07',
      subjectId: 'mathematics',
      crossModule: true,
    };
    expect(scopesAreComparable(class6mixed, class7cross)).toBe(false);
  });

  it('same single-skill scopes are comparable', () => {
    const a = migrateLegacySkillMode('FR.06')!;
    const b = migrateLegacySkillMode('FR.06')!;
    expect(scopesAreComparable(a, b)).toBe(true);
  });

  it('different single-skill scopes are NOT comparable', () => {
    const a = migrateLegacySkillMode('FR.06')!;
    const b = migrateLegacySkillMode('FR.07')!;
    expect(scopesAreComparable(a, b)).toBe(false);
  });

  it('cross-grade module scopes are NOT comparable', () => {
    const a = migrateLegacySkillMode('mixed_fractions')!;
    const b = migrateLegacySkillMode('mixed_c7_lines_angles')!;
    expect(scopesAreComparable(a, b)).toBe(false);
  });
});
