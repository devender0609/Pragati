// v0.26 tests — curriculum registry & migration.
//
// These tests exercise the registry that gets auto-bootstrapped at import
// time (see registry.ts). They cover the highest-risk paths for the
// extensibility refactor:
//   - registration produces the expected Class 6 and Class 7 shape
//   - legacy skill ids ('FR.06', 'AE.03', ...) still resolve
//   - grade-scoped queries never leak content across grades
//   - `getAvailableAssessments` respects availability
//   - `getCurriculumStatus` returns framework_only for unregistered grades
//   - programmatic counts are non-zero and internally consistent
//
// Run with `npm test`.

import { describe, expect, it } from 'vitest';
import {
  GRADE_DEFINITIONS,
  getAvailableAssessments,
  getBlueprints,
  getCurricula,
  getCurriculumStatus,
  getGrades,
  getItemsForModule,
  getItemsForSkill,
  getModules,
  getSkills,
  getSubjectsForGrade,
  programmaticCounts,
  resolveLegacyModuleId,
  resolveLegacySkillId,
} from '../index';

describe('curriculum registry — bootstrap', () => {
  it('exposes CBSE as the one registered curriculum', () => {
    const c = getCurricula();
    expect(c.map((x) => x.id)).toContain('cbse');
  });

  it('lists all 12 grade IDs even when only 2 have content', () => {
    const ids = getGrades();
    expect(ids).toHaveLength(12);
    expect(ids).toContain('grade_01');
    expect(ids).toContain('grade_06');
    expect(ids).toContain('grade_07');
    expect(ids).toContain('grade_12');
  });

  it('reports mathematics as a registered subject for every grade 1–12 in v0.29', () => {
    for (let n = 1; n <= 12; n++) {
      const gradeId = `grade_${String(n).padStart(2, '0')}`;
      expect(getSubjectsForGrade(gradeId)).toEqual(['mathematics']);
    }
  });
});

describe('curriculum registry — grade-scoped content', () => {
  it('returns 6 modules for CBSE Class 6 Math (available)', () => {
    const modules = getModules('grade_06', 'mathematics', 'cbse');
    expect(modules).toHaveLength(6);
    for (const m of modules) {
      expect(m.availability).toBe('available');
      expect(m.curriculumId).toBe('cbse');
      expect(m.gradeId).toBe('grade_06');
    }
  });

  it('returns 6 modules for CBSE Class 7 Math (teacher review required)', () => {
    const modules = getModules('grade_07', 'mathematics', 'cbse');
    expect(modules).toHaveLength(6);
    for (const m of modules) {
      expect(m.availability).toBe('teacher_review_required');
      expect(m.gradeId).toBe('grade_07');
    }
  });

  it('does not leak Class 7 skills into Class 6 module queries', () => {
    const class6 = getModules('grade_06', 'mathematics');
    for (const m of class6) {
      for (const s of getSkills(m.id)) {
        expect(s.gradeId).toBe('grade_06');
      }
    }
  });

  it('does not leak Class 6 skills into Class 7 module queries', () => {
    const class7 = getModules('grade_07', 'mathematics');
    for (const m of class7) {
      for (const s of getSkills(m.id)) {
        expect(s.gradeId).toBe('grade_07');
      }
    }
  });

  it('every module has at least one skill', () => {
    for (const grade of ['grade_06', 'grade_07']) {
      for (const m of getModules(grade, 'mathematics')) {
        expect(getSkills(m.id).length).toBeGreaterThan(0);
      }
    }
  });

  it('every registered skill has at least one item', () => {
    for (const grade of ['grade_06', 'grade_07']) {
      for (const m of getModules(grade, 'mathematics')) {
        for (const s of getSkills(m.id)) {
          expect(getItemsForSkill(s.id).length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('curriculum registry — legacy id resolution', () => {
  it('resolves the Class 6 legacy skill id FR.06', () => {
    const s = resolveLegacySkillId('FR.06');
    expect(s).toBeDefined();
    expect(s!.gradeId).toBe('grade_06');
    expect(s!.subjectId).toBe('mathematics');
    expect(s!.legacyId).toBe('FR.06');
  });

  it('resolves the Class 7 legacy skill id LA.03', () => {
    const s = resolveLegacySkillId('LA.03');
    expect(s).toBeDefined();
    expect(s!.gradeId).toBe('grade_07');
    expect(s!.moduleId).toBe('cbse_g07_math_c7_lines_angles');
  });

  it('resolves the Class 6 legacy module id "fractions"', () => {
    const m = resolveLegacyModuleId('fractions');
    expect(m).toBeDefined();
    expect(m!.id).toBe('cbse_g06_math_fractions');
    expect(m!.gradeId).toBe('grade_06');
  });

  it('resolves the Class 7 legacy module id "c7_data_handling"', () => {
    const m = resolveLegacyModuleId('c7_data_handling');
    expect(m).toBeDefined();
    expect(m!.gradeId).toBe('grade_07');
  });

  it('returns undefined for an unknown legacy id (no fabrication)', () => {
    expect(resolveLegacySkillId('XX.99')).toBeUndefined();
    expect(resolveLegacyModuleId('nonexistent_module')).toBeUndefined();
  });
});

describe('curriculum registry — assessments availability', () => {
  it('grade_06 diagnostic is available', () => {
    const avail = getAvailableAssessments('grade_06', 'mathematics');
    expect(avail.some((b) => b.id === 'cbse_g06_math_diagnostic')).toBe(true);
  });

  it('grade_07 diagnostic is available with teacher-review status', () => {
    const avail = getAvailableAssessments('grade_07', 'mathematics');
    const bp = avail.find((b) => b.id === 'cbse_g07_math_diagnostic');
    expect(bp).toBeDefined();
    expect(bp!.availability).toBe('teacher_review_required');
  });

  it('grade_01 through grade_05 have six blueprints (v0.36 primary full coverage)', () => {
    // v0.29 — module 1. v0.31 — module 2. v0.36 — 4 more primary-coverage modules.
    for (const g of ['grade_01', 'grade_02', 'grade_03', 'grade_04', 'grade_05']) {
      const bps = getBlueprints(g, 'mathematics');
      expect(bps).toHaveLength(6);
      for (const bp of bps) {
        expect(bp.availability).toBe('teacher_review_required');
      }
      expect(getCurriculumStatus(g, 'mathematics')).toBe('teacher_review_required');
    }
  });

  it('grades 8, 9, 10, 11, 12 have 10 blueprints (v0.32/v0.33/v0.35 full coverage)', () => {
    // v0.32 — Class 10 and Class 12 got full NCERT chapter coverage.
    // v0.33 — Class 8 and Class 9 also got full coverage.
    // v0.35 — Class 11 also got full coverage.
    for (const g of ['grade_08', 'grade_09', 'grade_10', 'grade_11', 'grade_12']) {
      const bps = getBlueprints(g, 'mathematics');
      expect(bps).toHaveLength(10);
      for (const bp of bps) {
        expect(bp.availability).toBe('teacher_review_required');
      }
      expect(getCurriculumStatus(g, 'mathematics')).toBe('teacher_review_required');
    }
  });
});

describe('curriculum registry — blueprint coverage guards against 0-item runs', () => {
  it('every blueprint has enough eligible items to reach minItems', () => {
    for (let n = 1; n <= 12; n++) {
      const grade = `grade_${String(n).padStart(2, '0')}`;
      for (const b of getBlueprints(grade, 'mathematics')) {
        const skillIds =
          b.skillIds ??
          (b.moduleIds ?? []).flatMap((mid) => getSkills(mid).map((s) => s.id));
        const total = skillIds.reduce((acc, sid) => acc + getItemsForSkill(sid).length, 0);
        expect(total).toBeGreaterThanOrEqual(b.minItems);
      }
    }
  });
});

describe('curriculum registry — programmatic counts', () => {
  it('reports non-zero counts consistent with the bank', () => {
    const c = programmaticCounts();
    expect(c.moduleCount).toBeGreaterThan(0);
    expect(c.skillCount).toBeGreaterThan(0);
    expect(c.itemCount).toBeGreaterThan(0);
    // Sum of items across skills equals overall count.
    const summed = Object.values(c.itemsBySkill).reduce((a, b) => a + b, 0);
    expect(summed).toBe(c.itemCount);
    // v0.29 — every grade from 1 to 12 has at least one registered
    // module in the mathematics subject.
    const expectedGrades = Array.from(
      { length: 12 },
      (_, i) => `grade_${String(i + 1).padStart(2, '0')}`
    );
    expect(c.gradesWithContent).toEqual(expectedGrades);
  });

  it('module count for Class 6 + Class 7 is at least 12 (6 + 6)', () => {
    const c = programmaticCounts();
    expect(c.moduleCount).toBeGreaterThanOrEqual(12);
  });

  it('item count is at least the sum of documented banks (390 + 144 in v0.25)', () => {
    const c = programmaticCounts();
    expect(c.itemCount).toBeGreaterThanOrEqual(500);
  });
});

describe('grade shell integrity', () => {
  it('every grade has a valid stage', () => {
    for (const g of Object.values(GRADE_DEFINITIONS)) {
      expect(['primary', 'preparatory', 'middle', 'secondary', 'senior_secondary']).toContain(g.stage);
    }
  });

  it('numeric grade levels match the id pad', () => {
    for (const g of Object.values(GRADE_DEFINITIONS)) {
      expect(g.id).toBe(`grade_${String(g.numericLevel).padStart(2, '0')}`);
    }
  });

  it('a module cannot be registered under an unknown grade', () => {
    // Not directly testable without the raw setter — the guard is enforced
    // in registry.ts::registerCurriculumGrade (silent skip if unknown).
    // As a proxy, assert that no module refers to a grade id that isn't
    // in GRADE_DEFINITIONS.
    const validGradeIds = new Set(Object.keys(GRADE_DEFINITIONS));
    for (const grade of ['grade_06', 'grade_07']) {
      for (const m of getModules(grade, 'mathematics')) {
        expect(validGradeIds.has(m.gradeId)).toBe(true);
      }
    }
  });
});

describe('items module cross-check', () => {
  it('getItemsForModule returns items whose skillId matches a legacy skill in that module', () => {
    const modules = getModules('grade_06', 'mathematics');
    for (const m of modules) {
      const items = getItemsForModule(m.id);
      const skillLegacyIds = new Set(getSkills(m.id).map((s) => s.legacyId));
      for (const it of items) {
        expect(skillLegacyIds.has(it.skillId)).toBe(true);
      }
    }
  });
});
