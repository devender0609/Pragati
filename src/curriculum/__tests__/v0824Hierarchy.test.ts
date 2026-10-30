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

/**
 * v0.82.5 §2 — READ THE TABLE BY ITS HEADERS.
 *
 * The v0.82.4 version of this test checked that each document's Class 6
 * row CONTAINED 10 and 65. That passed while the source inventory
 * printed 65 under "Topics" — the right number in the wrong column,
 * which is exactly the error the test existed to catch. A test whose
 * description claims more than its assertion proves is worse than no
 * test, because it hands out false confidence.
 *
 * This version finds the header row, maps each column name to its
 * index, and reads the cell under a named column.
 */
function cellsByHeader(
  doc: string,
  classLabel: string
): Record<string, string> {
  const lines = doc.split('\n');
  // A document may hold several tables with different column sets, so
  // the header is the nearest hierarchy header ABOVE the row — not the
  // first one in the file. Reading the first would misalign every
  // column of a later table, which is its own version of the bug.
  const rowIndex = lines.findIndex((l) => l.startsWith(`| ${classLabel} |`)
    && lines.slice(0, lines.indexOf(l)).reverse().find((h) => h.startsWith('| Class |'))
      ?.includes('Sections'));
  if (rowIndex < 0) throw new Error(`no row for ${classLabel}`);
  const row = lines[rowIndex];
  const header = lines
    .slice(0, rowIndex)
    .reverse()
    .find((l) => l.startsWith('| Class |'));
  if (!header || !header.includes('Sections')) {
    throw new Error('no hierarchy header found');
  }
  const names = header.split('|').map((c) => c.trim());
  const cells = row.split('|').map((c) => c.trim());
  return Object.fromEntries(names.map((n, i) => [n, cells[i]]));
}

const DOCS = [
  'CURRENT_MATH_BOOKS_CLASSES_1_12.md',
  'CURRICULUM_COVERAGE_MATRIX.md',
  // v0.82.5 — added after the audit found Class 6's sections had
  // dropped out of this document altogether.
  'STRUCTURE_VERIFICATION_BACKLOG.md',
];

describe('§5 the generated documents agree column by column', () => {
  it('put Class 6 under Chapters and Sections, never Units or Topics', () => {
    for (const d of DOCS) {
      const c = cellsByHeader(read(d), 'Class 6');
      expect(c.Units, d).toBe('—');
      expect(c.Chapters, d).toBe('10');
      expect(c.Sections, d).toBe('65');
      expect(c.Topics, d).toBe('—');
    }
  });

  it('put Class 9 under Units, Chapters and Topics, never Sections', () => {
    for (const d of DOCS) {
      const c = cellsByHeader(read(d), 'Class 9');
      expect(c.Units, d).toBe('6');
      expect(c.Chapters, d).toBe('15');
      expect(c.Sections, d).toBe('—');
      expect(c.Topics, d).toBe('15');
    }
  });

  // v0.83 — this used to assert that Class 10 has no textbook chapter
  // count, which was true only because the NCERT book had not been read.
  // It has now. The CBSE syllabus row still has units and topics and no
  // chapters; the NCERT textbook is a SEPARATE row with 14 chapters and
  // 55 sections. The first Class 10 row is the syllabus row.
  it('give Class 10 syllabus units and topics, with no chapter count on that row', () => {
    for (const d of DOCS) {
      const c = cellsByHeader(read(d), 'Class 10');
      expect(c.Source, d).toMatch(/^CBSE syllabus/);
      expect(c.Units, d).not.toBe('—');
      expect(c.Chapters, d).toBe('—');
      expect(c.Sections, d).toBe('—');
      expect(c.Topics, d).not.toBe('—');
    }
  });
});

describe('§5 instructional counts are labelled by record, not by level', () => {
  it('does not call Class 6 sections topics in the completeness table', () => {
    const doc = read('CURRICULUM_COVERAGE_MATRIX.md');
    expect(doc).not.toContain('Topics: Learn');
    expect(doc).toContain('Records with Learn');
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

describe('§3/§4 the Class 6 evidence speaks the book’s vocabulary', () => {
  it('describes a chapter- and section-level denominator', () => {
    const note = officialCurriculumForGrade('class6')!.evidenceNote;
    expect(note).toMatch(/chapter- and section-level denominator/);
    expect(note).not.toMatch(/topic-level denominator/);
    expect(note).not.toMatch(/unit-level/);
  });

  it('no longer claims only Chapter 7 was read at section depth', () => {
    const src = readFileSync(
      new URL('../officialCurriculum.ts', import.meta.url),
      'utf8'
    );
    expect(src).not.toMatch(/Only Chapter 7 has been read at section depth/);
    // The real distinction, stated instead of the false shorthand.
    expect(src).toMatch(/Structure verified[\s\S]{0,40}is not the same claim as intent inspected/);
  });
});
