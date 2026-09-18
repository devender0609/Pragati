// v0.78 §A1/§A2 — THE GENERATED DOCUMENTS CANNOT DRIFT.
//
// v0.77.2 shipped CONTENT_BACKLOG.md and CURRICULUM_COVERAGE_MATRIX.md
// stamped v0.72.0, both claiming to be generated and neither having been
// regenerated since the model moved. They said "8 of 9 Fractions
// sections complete"; the code had said 9 of 9 for three releases.
//
// This test is the fix. It compares the bytes on disk against what the
// generator produces from the live model right now. A model change that
// is not regenerated fails here; a hand-edit to the Markdown fails here
// too. Staleness stops being something a person has to notice.
//
// Regenerate:  PRAGATI_EMIT_DOCS=1 npx vitest run v078StateDocs

import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import {
  renderCoverageMatrix,
  renderContentBacklog,
  renderStructureVerificationBacklog,
  renderSourceInventory,
} from '../stateDocs';
import { reviewReadinessSummary } from '../reviewReadiness';
import { coverageMatrix } from '../coverageMatrix';

const VERSION = JSON.parse(
  readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')
).version as string;

const DOCS: Array<[string, () => string]> = [
  ['CURRICULUM_COVERAGE_MATRIX.md', () => renderCoverageMatrix(VERSION)],
  ['CONTENT_BACKLOG.md', () => renderContentBacklog(VERSION)],
  ['STRUCTURE_VERIFICATION_BACKLOG.md', () => renderStructureVerificationBacklog(VERSION)],
  ['CURRENT_MATH_BOOKS_CLASSES_1_12.md', () => renderSourceInventory(VERSION)],
];

const path = (f: string) => new URL(`../../../${f}`, import.meta.url);

if (process.env.PRAGATI_EMIT_DOCS) {
  for (const [file, render] of DOCS) writeFileSync(path(file), render());
}

describe('§A2 current-state documents agree with the live model', () => {
  for (const [file, render] of DOCS) {
    it(`${file} is exactly what the model produces`, () => {
      expect(readFileSync(path(file), 'utf8')).toBe(render());
    });
  }

  it('stamps the current version, not a historical one', () => {
    for (const [file] of DOCS) {
      expect(readFileSync(path(file), 'utf8')).toContain(VERSION);
    }
  });
});

describe('§A2 the facts those documents must carry', () => {
  const c6 = () => coverageMatrix().find((r) => r.grade === 'class6')!;

  it('reports 12 authored Class 6 drafts — 9 Fractions, 3 Number Play', () => {
    // v0.82.1 §7 — the row is Class 6, not Chapter 7. It counted only
    // Fractions until Number Play became visible to coverage.
    expect(c6().drafts).toBe(12);
    expect(c6().completeInstructionalDrafts).toBe(12);
  });

  it('reports 9 review-ready and nothing waiting on engineering', () => {
    const rr = reviewReadinessSummary();
    // Readiness is chapter-scoped, and this summary is the Fractions
    // one — so it stays at 9. Number Play has its own.
    expect(rr.completeDrafts).toBe(9);
    expect(rr.reviewReady).toBe(9);
    expect(rr.awaitingPackagePreparation).toBe(0);
  });

  it('reports nothing reviewed and nothing published', () => {
    // These stay zero until a real educator response exists. A draft
    // being finished is not a draft being approved.
    expect(c6().educatorReviewed).toBe(0);
    expect(c6().published).toBe(0);
    expect(c6().studentReady).toBe(0);
  });

  it('never lets an unverified class report zero curriculum', () => {
    // Unknown is not zero. A class awaiting primary verification must
    // report null, so it cannot be mistaken for a complete one.
    for (const r of coverageMatrix()) {
      if (!r.verified) {
        expect(r.recordsRepresented).toBeNull();
        expect(r.omissions).toBeNull();
      }
    }
  });
});
