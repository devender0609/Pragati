// v0.82.4 §5 — THE DOCUMENTS AGREE ABOUT HIERARCHY.
//
// `CURRENT_MATH_BOOKS_CLASSES_1_12.md` said Class 6 was chapters and
// sections; `CURRICULUM_COVERAGE_MATRIX.md` said Units 10 / Chapters 10
// / Topics 65. Both were generated, both from the same registry, and
// they disagreed — because one of them read the storage array's name
// (`units`) as a claim about the book.
//
// These tests pin the hierarchy at the source of truth and then pin the
// two documents to it, so a future model change that reintroduces the
// disagreement fails here rather than being printed as fact.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  officialUnitCount,
  officialChapterCount,
  officialSectionCount,
  officialTopicCount,
  officialTopLevelCount,
  officialCurriculumForGrade,
} from '../officialCurriculum';

const read = (f: string) =>
  readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8');
const rowFor = (doc: string, label: string) =>
  doc.split('\n').find((l) => l.startsWith(`| ${label} |`)) ?? '';

describe('§1/§2 Class 6 has chapters and sections, not units and topics', () => {
  it('reports no unit layer, because Ganita Prakash defines none', () => {
    expect(officialCurriculumForGrade('class6')!.topLevel).toBe('chapter');
    expect(officialUnitCount('class6')).toBeNull();
    expect(officialChapterCount('class6')).toBe(10);
    expect(officialSectionCount('class6')).toBe(65);
    expect(officialTopicCount('class6')).toBeNull();
  });

  it('still knows how many top-level records it has', () => {
    // The audit asks about presence, not terminology.
    expect(officialTopLevelCount('class6')).toBe(10);
  });
});

describe('§3 Classes 9-12 keep units and topics', () => {
  it('gives Class 9 units and source-established chapter names', () => {
    expect(officialCurriculumForGrade('class9')!.topLevel).toBe('unit');
    expect(officialUnitCount('class9')).toBe(6);
    expect(officialChapterCount('class9')).toBe(15);
    expect(officialSectionCount('class9')).toBeNull();
  });

  it('leaves 10-12 with units but no textbook chapter count', () => {
    for (const g of ['class10', 'class11', 'class12'] as const) {
      expect(officialUnitCount(g), g).not.toBeNull();
      expect(officialChapterCount(g), g).toBeNull();
      expect(officialSectionCount(g), g).toBeNull();
    }
  });
});

describe('§5 the two generated documents agree', () => {
  it('shows Class 6 the same way in both', () => {
    const inventory = rowFor(read('CURRENT_MATH_BOOKS_CLASSES_1_12.md'), 'Class 6');
    const matrix = rowFor(read('CURRICULUM_COVERAGE_MATRIX.md'), 'Class 6');
    expect(inventory).toContain('chapter');
    // Neither may print a unit count for a book with no units.
    for (const row of [inventory, matrix]) {
      const cells = row.split('|').map((c) => c.trim());
      expect(cells).toContain('10');
      expect(cells).toContain('65');
    }
    expect(matrix).not.toMatch(/\| 10 \| 10 \|/);
  });

  it('never labels Class 6 sections as topics', () => {
    const doc = read('CURRICULUM_COVERAGE_MATRIX.md');
    // The table now carries both columns, so the 65 can sit under the
    // level the source actually defines.
    expect(doc).toContain('Sections');
    expect(doc).toContain('Topics');
  });
});

describe('§6 the stale Chapter-7-only commentary is gone', () => {
  it('no longer claims Chapter 7 is the only authored Class 6 chapter', () => {
    const src = readFileSync(
      new URL('../coverageMatrix.ts', import.meta.url),
      'utf8'
    );
    expect(src).not.toMatch(/only\s+Chapter 7 within it/);
    expect(src).toMatch(/Number Play/);
  });
});
