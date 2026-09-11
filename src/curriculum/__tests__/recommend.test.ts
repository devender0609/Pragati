// v0.28 tests — recommended-blueprint resolver.

import { describe, expect, it } from 'vitest';
import { pickRecommendedBlueprint, hasUsableBlueprint } from '../index';

describe('pickRecommendedBlueprint — precedence', () => {
  it('honours student.gradeId when present (v0.26+ Student)', () => {
    const rec = pickRecommendedBlueprint({ gradeId: 'grade_07' });
    expect(rec).not.toBeNull();
    expect(rec!.gradeId).toBe('grade_07');
    expect(rec!.reason).toBe('student_gradeId');
    expect(rec!.blueprint.id).toBe('cbse_g07_math_diagnostic');
  });

  it('falls back to legacy student.grade text for "Class 6"', () => {
    const rec = pickRecommendedBlueprint({ grade: 'Class 6' });
    expect(rec).not.toBeNull();
    expect(rec!.gradeId).toBe('grade_06');
    expect(rec!.reason).toBe('student_grade_text');
    expect(rec!.blueprint.id).toBe('cbse_g06_math_diagnostic');
  });

  it('falls back to legacy student.grade text for "Class 7"', () => {
    const rec = pickRecommendedBlueprint({ grade: 'Class 7' });
    expect(rec).not.toBeNull();
    expect(rec!.gradeId).toBe('grade_07');
    expect(rec!.reason).toBe('student_grade_text');
  });

  it('recognises the pre-v0.26 union tokens class6 / class7', () => {
    expect(pickRecommendedBlueprint({ grade: 'class6' })!.gradeId).toBe('grade_06');
    expect(pickRecommendedBlueprint({ grade: 'class7' })!.gradeId).toBe('grade_07');
  });

  it('defaults to grade_06 when no student hint is provided', () => {
    const rec = pickRecommendedBlueprint(null);
    expect(rec).not.toBeNull();
    expect(rec!.gradeId).toBe('grade_06');
    expect(rec!.reason).toBe('default_grade_06');
  });

  it('defaults to grade_06 when the hint has no usable field', () => {
    const rec = pickRecommendedBlueprint({});
    expect(rec).not.toBeNull();
    expect(rec!.reason).toBe('default_grade_06');
  });

  it('resolves an explicit gradeId to that grade when v0.29 starter content is registered', () => {
    // v0.29 — Class 3 now has a prototype starter blueprint. The
    // resolver returns it (reason: student_gradeId) instead of
    // falling back. This test replaces the pre-v0.29 assumption that
    // Class 3 had no content.
    const rec = pickRecommendedBlueprint({ gradeId: 'grade_03' });
    expect(rec).not.toBeNull();
    expect(rec!.gradeId).toBe('grade_03');
    expect(rec!.reason).toBe('student_gradeId');
    expect(rec!.blueprint.availability).toBe('teacher_review_required');
  });

  it('gradeId precedence beats legacy grade text', () => {
    const rec = pickRecommendedBlueprint({
      gradeId: 'grade_07',
      grade: 'Class 6',
    });
    expect(rec!.gradeId).toBe('grade_07');
    expect(rec!.reason).toBe('student_gradeId');
  });
});

describe('pickRecommendedBlueprint — availability preference', () => {
  it('prefers an "available" blueprint over "teacher_review_required" for the same grade', () => {
    // Class 6 has one "available" blueprint (cbse_g06_math_diagnostic).
    // Class 7 has one "teacher_review_required" blueprint. Both are
    // usable — pickRecommendedBlueprint returns the "available" one
    // when the grade is Class 6 and the "review" one when it's Class 7.
    const c6 = pickRecommendedBlueprint({ gradeId: 'grade_06' })!;
    expect(c6.blueprint.availability).toBe('available');
    const c7 = pickRecommendedBlueprint({ gradeId: 'grade_07' })!;
    expect(c7.blueprint.availability).toBe('teacher_review_required');
  });
});

describe('hasUsableBlueprint', () => {
  it('is true for grade_06 mathematics', () => {
    expect(hasUsableBlueprint('grade_06', 'mathematics')).toBe(true);
  });
  it('is true for grade_07 mathematics', () => {
    expect(hasUsableBlueprint('grade_07', 'mathematics')).toBe(true);
  });
  it('is true for grade_03 mathematics (v0.29 starter, teacher review required)', () => {
    expect(hasUsableBlueprint('grade_03', 'mathematics')).toBe(true);
  });
  it('is true for grade_12 mathematics (v0.29 starter, teacher review required)', () => {
    expect(hasUsableBlueprint('grade_12', 'mathematics')).toBe(true);
  });
});
