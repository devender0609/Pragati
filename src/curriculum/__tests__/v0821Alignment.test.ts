// v0.82.1 §C — PAGE-LEVEL ALIGNMENT, AND WHAT IT FOUND.
//
// The primary chapter PDF was read on 2026-09-17. Two of the three
// authored Number Play sections teach mathematics the source does not
// teach. Both were written from the section title plus a plausible
// reading — the exact failure the briefs kept naming, and they were
// right to keep naming it.
//
// These tests hold the finding in place so it cannot be lost in a
// report: the records must exist, the page ranges must be ordered, the
// stale "no page-level reading" claims must be gone, and a misaligned
// section must not be presented as if it were aligned.

import { describe, it, expect } from 'vitest';
import {
  NUMBER_PLAY_ALIGNMENT,
  alignmentFor,
  SECTION_3_4_REPRESENTATION_FINDING,
} from '../numberPlayAlignment';
import { numberPlayChapterSections } from '../numberPlaySections';

describe('§C every authored section has a page-level record', () => {
  it('covers all three authored sections', () => {
    for (const s of numberPlayChapterSections()) {
      const a = alignmentFor(s.source.officialSectionId);
      expect(a, s.source.sectionNumber).not.toBeNull();
      expect(a!.exactTitle).toBe(s.source.exactTitle);
    }
  });

  it('records ordered, non-overlapping page ranges', () => {
    const ranges = NUMBER_PLAY_ALIGNMENT.map((a) => a.pages);
    for (const [from, to] of ranges) expect(to).toBeGreaterThanOrEqual(from);
    for (let i = 1; i < ranges.length; i += 1) {
      // Sections may share a boundary page — §3.2 ends and §3.3 begins
      // on 59 — but a later section never starts before an earlier one.
      expect(ranges[i][0]).toBeGreaterThanOrEqual(ranges[i - 1][0]);
    }
  });

  it('names the primary PDF, not a summary of it', () => {
    for (const a of NUMBER_PLAY_ALIGNMENT) {
      expect(a.sourceUrl).toMatch(/^https:\/\/ncert\.nic\.in\/textbook\/pdf\//);
      expect(a.inspectionDate).toBe('2026-09-17');
    }
  });
});

describe('§C the audit verdicts', () => {
  it('finds §3.2 aligned, with the tie case labelled as enrichment', () => {
    const a = alignmentFor('ncert_gp_c6_s3_2')!;
    expect(a.status).toBe('aligned_with_enrichment');
    expect(a.unsupported).toEqual([]);
    expect(a.enrichment.join(' ')).toMatch(/tie/i);
    // These four were guesses in v0.80 and are now confirmed from the
    // pages: end cells qualify, and grid adjacency excludes diagonals.
    expect(a.aligned.join(' ')).toMatch(/198/);
    expect(a.aligned.join(' ')).toMatch(/diagonals excluded/i);
  });

  it('records what the source teaches for every section', () => {
    // v0.82.1 — §3.1 and §3.3 were rewritten against these pages, so
    // both moved off `misaligned_requires_rewrite`. What the record
    // must still carry is the source's own intent, in enough detail
    // that a reviewer can check the lesson against it.
    for (const id of ['ncert_gp_c6_s3_1', 'ncert_gp_c6_s3_3']) {
      const a = alignmentFor(id)!;
      expect(a.status, id).not.toBe('misaligned_requires_rewrite');
      expect(a.unsupported, id).toEqual([]);
      expect(a.sourceIntent.length, id).toBeGreaterThan(120);
    }
    expect(alignmentFor('ncert_gp_c6_s3_1')!.sourceIntent).toMatch(/taller/i);
    expect(alignmentFor('ncert_gp_c6_s3_3')!.sourceIntent).toMatch(/scale/i);
  });
});

describe('§9/§15 the stale provenance claim is gone', () => {
  it('no section still says the pages were never read', () => {
    for (const s of numberPlayChapterSections()) {
      const notes = s.teacher.teachingNotes.join(' ');
      expect(notes, s.source.sectionNumber).not.toMatch(
        /not a page-level reading/i
      );
    }
  });

  it('carries no ALIGNMENT WARNING now that all three are rewritten', () => {
    // The warnings existed to stop a teacher using a misaligned draft.
    // Both drafts were replaced, so a warning left behind would be as
    // wrong as the stale provenance line it replaced.
    for (const s of numberPlayChapterSections()) {
      expect(s.teacher.teachingNotes.join(' '), s.source.sectionNumber).not.toMatch(
        /ALIGNMENT WARNING/
      );
    }
  });

  it('cites the inspected pages in every section’s teacher notes', () => {
    for (const s of numberPlayChapterSections()) {
      expect(s.teacher.teachingNotes.join(' '), s.source.sectionNumber).toMatch(
        /primary pages \(\d+-\d+\) were read on 2026-09-17/
      );
    }
  });
});

describe('§F §3.4 — PlaceValueSpec is not justified by the pages', () => {
  it('records the finding against the actual section content', () => {
    // v0.81 proposed place-value columns from the title "Playing with
    // Digits". The section is about digit SUMS and digit-occurrence
    // counts, where position is deliberately irrelevant: 68, 176 and
    // 545 share a digit sum precisely because place does not matter.
    expect(SECTION_3_4_REPRESENTATION_FINDING.placeValueSpecJustified).toBe(
      false
    );
    expect(SECTION_3_4_REPRESENTATION_FINDING.pages).toEqual([60, 61]);
  });
});
