// v0.78 §A5 — EVIDENCE CONSISTENCY.
//
// v0.77.3 shipped four documents disagreeing about Classes 9-12. The
// registry said primary_source_verified, with a CBSE source URL, an
// inspection date and an evidence note. The generated coverage matrix
// and structure backlog agreed with it. Two files did not — the
// hand-written source inventory and the release report — and both were
// mine, both wrong for the same reason: I wrote them from memory
// instead of reading the registry.
//
// These tests make that class of contradiction impossible to ship.

import { describe, it, expect } from 'vitest';
import {
  OFFICIAL_CURRICULA,
  officialCurriculumForGrade,
} from '../officialCurriculum';
import { coverageMatrix } from '../coverageMatrix';
import { readFileSync } from 'node:fs';

const verified = OFFICIAL_CURRICULA.filter(
  (c) => c.status === 'primary_source_verified'
);

describe('§A5 every verified curriculum carries real evidence', () => {
  it('names a source, a document and an inspection date', () => {
    expect(verified.length).toBeGreaterThan(0);
    for (const c of verified) {
      expect(c.sourceUrl, c.grade).toBeTruthy();
      expect(c.documentTitle, c.grade).toBeTruthy();
      expect(c.inspectionDate, c.grade).toBeTruthy();
      expect(c.authority, c.grade).toBeTruthy();
    }
  });

  it('states what was actually read, at usable length', () => {
    for (const c of verified) {
      // An evidence note that says nothing is the same as no evidence.
      expect(c.evidenceNote.length, c.grade).toBeGreaterThan(80);
    }
  });

  it('leaves no manual verification step outstanding', () => {
    for (const c of verified) {
      expect(c.manualVerificationStep, c.grade).toBeNull();
    }
  });
});

describe('§A3 syllabus depth never implies textbook depth', () => {
  it('only claims chapters where the source establishes them', () => {
    for (const c of verified) {
      if (c.topLevel === 'unit') {
        for (const u of c.units) {
          // A unit may only carry chapter records if the source printed
          // a chapter-name column. Class 10's topic titles resemble
          // NCERT chapter names; resembling is not evidence.
          if (!u.chaptersEstablished) {
            expect(u.chapters.length, `${c.grade} ${u.title}`).toBe(0);
          }
        }
      }
    }
  });

  it('records Class 6 at textbook depth and Classes 9-12 at syllabus depth', () => {
    expect(officialCurriculumForGrade('class6')?.topLevel).toBe('chapter');
    for (const g of ['class9', 'class10', 'class11', 'class12'] as const) {
      const c = officialCurriculumForGrade(g);
      expect(c?.status, g).toBe('primary_source_verified');
      expect(c?.topLevel, g).toBe('unit');
    }
  });

  it('distinguishes "the source lists no topics" from "we did not look"', () => {
    for (const c of verified) {
      for (const u of c.units) {
        if (!u.topicsKnown) expect(u.topics.length).toBe(0);
      }
    }
  });
});

describe('§A4 the coverage matrix agrees with the registry', () => {
  it('marks exactly the registry-verified classes as verified', () => {
    const fromRegistry = new Set(verified.map((c) => c.grade));
    for (const row of coverageMatrix()) {
      expect(row.verified, row.gradeLabel).toBe(fromRegistry.has(row.grade));
    }
  });

  it('keeps unverified denominators unknown rather than zero', () => {
    for (const row of coverageMatrix()) {
      if (!row.verified) {
        expect(row.recordsRepresented, row.gradeLabel).toBeNull();
        expect(row.omissions, row.gradeLabel).toBeNull();
      }
    }
  });
});

describe('§1 book identity is verified separately from book structure', () => {
  it('never lets a secondary-sourced title read as established', () => {
    for (const c of OFFICIAL_CURRICULA) {
      if (c.status !== 'primary_source_verified') {
        // A title carried by agreeing secondary sources is a lead. v0.51
        // is why: they agreed about Class 6 and disagreed about Class 7,
        // and agreement felt like confirmation both times.
        expect(c.bookIdentityStatus, c.grade).not.toBe('primary_source_verified');
        expect(c.structureVerificationStatus, c.grade).toBe('pending_verification');
      }
    }
  });

  it('records a title where one is claimed, and none where it is not', () => {
    for (const c of OFFICIAL_CURRICULA) {
      if (c.bookIdentityStatus === 'unverified') {
        expect(c.documentTitle, c.grade).toBeNull();
      } else {
        expect(c.documentTitle, c.grade).toBeTruthy();
      }
    }
  });

  it('verifies both together only where one reading established both', () => {
    for (const c of verified) {
      expect(c.bookIdentityStatus, c.grade).toBe('primary_source_verified');
      expect(c.structureVerificationStatus, c.grade).toBe('primary_source_verified');
    }
  });
});

describe('§2 the source hierarchy is preserved, not normalised', () => {
  it('does not give Class 6 a unit layer its book does not have', () => {
    // Ganita Prakash defines chapters and sections. Reporting
    // "10 units / 10 chapters" invents a level and makes two unlike
    // structures look equivalent.
    const c = officialCurriculumForGrade('class6')!;
    expect(c.topLevel).toBe('chapter');
    const doc = readFileSync(
      new URL('../../../CURRENT_MATH_BOOKS_CLASSES_1_12.md', import.meta.url),
      'utf8'
    );
    // v0.83 — read by column name, not by position. The positional
    // version found the cell after the word 'chapter', which stopped
    // meaning anything when the table gained a Source column.
    const lines = doc.split('\n');
    const rowIdx = lines.findIndex((l) => l.startsWith('| Class 6 |'));
    const header = lines
      .slice(0, rowIdx)
      .reverse()
      .find((l) => l.startsWith('| Class |'))!;
    const names = header.split('|').map((x) => x.trim());
    const cells = lines[rowIdx].split('|').map((x) => x.trim());
    const col = (n: string) => cells[names.indexOf(n)];
    expect(col('Units')).toBe('—');
    expect(col('Chapters')).toBe('10');
    expect(col('Sections')).toBe('65');
    expect(col('Topics')).toBe('—');
  });

  it('gives syllabus classes units, and chapters only where named', () => {
    const c9 = officialCurriculumForGrade('class9')!;
    const c10 = officialCurriculumForGrade('class10')!;
    expect(c9.units.some((u) => u.chaptersEstablished)).toBe(true);
    expect(c10.units.some((u) => u.chaptersEstablished)).toBe(false);
  });
});
