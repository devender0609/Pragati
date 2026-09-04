// v0.51 §3/§5 + §12(testing) — no internal jargon in student names.

import { describe, it, expect } from 'vitest';
import {
  studentModuleName, studentChapterTitle, stripInternalMetadata,
} from '../studentNames';
import { MODULE_LABELS, type ModuleId } from '../../types';

// Derive the ID list from the label registry itself, so a module added
// later is covered automatically.
const ALL_MODULE_IDS = Object.keys(MODULE_LABELS) as ModuleId[];
import { GOVERNANCE_TERMS } from '../readiness';

const JARGON = /starter|prototype|pilot|review required|blueprint|calibrat|corroborated|unverified|Class\s*\d+|Ch\s*\d+/i;

describe('§3 the exact reported defect is fixed', () => {
  it('"Numbers & Addition (Class 1 — starter)" becomes a child-friendly name', () => {
    expect(MODULE_LABELS.g1_math_starter).toMatch(/starter/);
    expect(studentModuleName('g1_math_starter')).toBe('Play with Numbers');
  });

  it('Class 12 chapter references are removed', () => {
    expect(MODULE_LABELS.g12_apps_integrals).toMatch(/Ch 8/);
    expect(studentModuleName('g12_apps_integrals')).toBe('Applications of Integrals');
  });
});

describe('§3 no student module name contains internal metadata', () => {
  it('every module in the registry produces a clean name', () => {
    const dirty: string[] = [];
    for (const id of ALL_MODULE_IDS) {
      const name = studentModuleName(id);
      if (JARGON.test(name)) dirty.push(`${id}: "${name}"`);
    }
    expect(dirty).toEqual([]);
  });

  it('no student name contains a governance term', () => {
    for (const id of ALL_MODULE_IDS) {
      const name = studentModuleName(id).toLowerCase();
      for (const term of GOVERNANCE_TERMS) {
        expect(name).not.toContain(term.toLowerCase());
      }
    }
  });

  it('every student name is non-empty', () => {
    for (const id of ALL_MODULE_IDS) {
      expect(studentModuleName(id).length).toBeGreaterThan(0);
    }
  });
});

describe('§3 the strip fallback protects modules nobody curated', () => {
  it('removes class and chapter parentheticals', () => {
    expect(stripInternalMetadata('Polynomials (Class 10 · Ch 2)')).toBe('Polynomials');
    expect(stripInternalMetadata('Circles (Class 9 · Ch 10)')).toBe('Circles');
  });

  it('removes build-state words', () => {
    expect(stripInternalMetadata('Algebra (prototype)')).toBe('Algebra');
    expect(stripInternalMetadata('Data Handling extended (Class 8 · Ch 5)'))
      .toBe('Data Handling extended');
  });

  it('leaves an already-clean name untouched', () => {
    expect(stripInternalMetadata('Fractions')).toBe('Fractions');
    expect(stripInternalMetadata('Prime Time')).toBe('Prime Time');
  });

  it('does not strip mathematics that merely contains a number', () => {
    expect(stripInternalMetadata('Linear Equations in Two Variables'))
      .toBe('Linear Equations in Two Variables');
    expect(stripInternalMetadata('Three-dimensional Geometry'))
      .toBe('Three-dimensional Geometry');
  });
});

describe('§3 chapter titles are cleaned too', () => {
  it('passes official titles through unchanged', () => {
    expect(studentChapterTitle('Fractions')).toBe('Fractions');
    expect(studentChapterTitle('The Other Side of Zero')).toBe('The Other Side of Zero');
  });

  it('cleans a legacy chapter title', () => {
    expect(studentChapterTitle('Numbers & Addition (Class 1 — starter)'))
      .toBe('Numbers & Addition');
  });

  it('falls back to the student module name when the title empties out', () => {
    expect(studentChapterTitle('(Class 1 — starter)', 'g1_math_starter'))
      .toBe('Play with Numbers');
  });

  it('never returns an empty string', () => {
    expect(studentChapterTitle('', 'g1_math_starter').length).toBeGreaterThan(0);
    expect(studentChapterTitle('').length).toBeGreaterThan(0);
  });
});

// --- §10 curriculum verification honesty ---

describe('§10 primary-source verification remains unclaimed', () => {
  it('no Class 6 record claims primary-source verification', async () => {
    const { OFFICIAL_CHAPTERS } = await import('../officialChapters');
    const c6 = OFFICIAL_CHAPTERS.filter((c) => c.grade === 'class6');
    expect(c6.length).toBeGreaterThan(0);
    for (const rec of c6) {
      expect(rec.verificationStatus).not.toBe('source_verified');
      expect(rec.verificationStatus).not.toBe('teacher_verified');
    }
  });

  it('the manual verification step is documented for a human', async () => {
    const { MANUAL_VERIFICATION_STEPS } = await import('../officialChapters');
    expect(MANUAL_VERIFICATION_STEPS.class6.sourceUrl).toMatch(/ncert\.nic\.in/);
    expect(MANUAL_VERIFICATION_STEPS.class6.blocker).toMatch(/robots/i);
    expect(MANUAL_VERIFICATION_STEPS.class6.steps.length).toBeGreaterThan(4);
  });

  it('the Grade 7 contradiction is recorded, not resolved by guessing', async () => {
    const { GRADE7_VERIFICATION_FINDING } = await import('../officialChapters');
    expect(GRADE7_VERIFICATION_FINDING.status).toBe('blocked_pending_primary_source');
    expect(GRADE7_VERIFICATION_FINDING.contradiction).toMatch(/15 vs 16/);
  });

  it('no Grade 7 official record was created from contradictory sources', async () => {
    const { OFFICIAL_CHAPTERS } = await import('../officialChapters');
    expect(OFFICIAL_CHAPTERS.filter((c) => c.grade === 'class7')).toEqual([]);
  });
});
