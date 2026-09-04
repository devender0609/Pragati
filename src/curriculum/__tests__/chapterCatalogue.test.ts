// v0.46 — chapter catalogue integrity tests.

import { describe, it, expect } from 'vitest';
import {
  CHAPTER_CATALOGUE,
  chaptersForGrade,
  coverageSummary,
} from '../chapterCatalogue';
import { registerCbseCoreContent } from '../registry';
import { MODULE_LABELS } from '../../types';

// Registry auto-bootstraps on import but tests can be re-run in any
// order, so make sure the registry has content before we query it.
registerCbseCoreContent();

describe('chapterCatalogue — schema honesty', () => {
  it('every row starts as needs_verification (no fabricated sources)', () => {
    for (const row of CHAPTER_CATALOGUE) {
      expect(row.sourceVerificationStatus).toBe('needs_verification');
      expect(row.officialChapterNumber).toBeNull();
      expect(row.officialChapterTitle).toBeNull();
      expect(row.textbookSource).toBeNull();
      expect(row.textbookEdition).toBeNull();
      expect(row.sourceReference).toBeNull();
      expect(row.sourceVerifiedDate).toBeNull();
    }
  });

  it('every row has a unique chapterId', () => {
    const ids = CHAPTER_CATALOGUE.map((c) => c.chapterId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every registryModuleId (when set) is a known legacy ModuleId (has a MODULE_LABEL)', () => {
    // Catalogue rows store legacy ModuleIds (matching src/types.ts).
    // The registry namespaces them at bootstrap; we only assert here
    // that the legacy id is one the app already knows about, so we
    // never end up with a catalogue row that points at nothing.
    const known = new Set(Object.keys(MODULE_LABELS));
    for (const row of CHAPTER_CATALOGUE) {
      if (row.registryModuleId === null) continue;
      expect(
        known.has(row.registryModuleId),
        `Catalogue row ${row.chapterId} points at unknown module ${row.registryModuleId}.`
      ).toBe(true);
    }
  });

  it('classes 1-12 all appear in the catalogue', () => {
    const grades = new Set(CHAPTER_CATALOGUE.map((c) => c.grade));
    for (let n = 1; n <= 12; n++) {
      const g = `grade_${String(n).padStart(2, '0')}`;
      expect(grades.has(g as never), `Missing grade ${g}`).toBe(true);
    }
  });

  it('every grade has at least 2 catalogue rows', () => {
    for (let n = 1; n <= 12; n++) {
      const g = `grade_${String(n).padStart(2, '0')}` as never;
      expect(chaptersForGrade(g).length).toBeGreaterThanOrEqual(2);
    }
  });

  it('coverageSummary counts add up to total', () => {
    const s = coverageSummary();
    const sourceTotal =
      s.bySource.needs_verification +
      s.bySource.source_verified +
      s.bySource.teacher_verified;
    expect(sourceTotal).toBe(s.total);
    const contentTotal = Object.values(s.byContent).reduce((a, b) => a + b, 0);
    expect(contentTotal).toBe(s.total);
  });
});
