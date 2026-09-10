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
