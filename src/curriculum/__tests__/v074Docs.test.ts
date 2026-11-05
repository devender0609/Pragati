// v0.74 §5/§28 — GENERATED REPORTS MAY NOT CONTRADICT THE DATA.
//
// The coverage document is checked as a FILE, not as a string literal.
// A test asserting a hand-written sentence would keep passing while the
// document drifted; this reads what actually ships.

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { assertCoverageWordingConsistent } from '../coverageWording';
import { structureVerificationSummary } from '../structureVerificationBacklog';

const read = (p: string) => readFileSync(new URL(`../../../${p}`, import.meta.url), 'utf8');

describe('§5 the shipped coverage document tells the truth', () => {
  it('no longer claims 89 records hold nothing', () => {
    const doc = read('CURRICULUM_COVERAGE_MATRIX.md');
    expect(assertCoverageWordingConsistent(doc)).toEqual([]);
  });

  it('states the five states separately', () => {
    const doc = read('CURRICULUM_COVERAGE_MATRIX.md');
    for (const needle of [
      'No instructional content at all',
      'Complete draft, no review package',
      'Complete draft, review-ready',
    ]) {
      expect(doc, needle).toContain(needle);
    }
  });

  it('carries the unknown-curriculum caveat beside the backlog total', () => {
    const doc = read('CURRICULUM_COVERAGE_MATRIX.md');
    // §21 — a backlog total without this reads as the Classes 1-12 total.
    expect(doc).toMatch(/not the Classes 1–12 workload/i);
    for (const g of structureVerificationSummary().gradeLabels) {
      expect(doc.includes(g.replace('Class ', '')), g).toBe(true);
    }
  });
});

describe('§10/§12 the functional matrices exist and record real results', () => {
  it('ships both matrices', () => {
    for (const f of ['STUDENT_FUNCTIONAL_MATRIX.md', 'TEACHER_FUNCTIONAL_MATRIX.md']) {
      expect(existsSync(new URL(`../../../${f}`, import.meta.url)), f).toBe(true);
    }
  });

  it('records the teacher reachability defect rather than quietly fixing it', () => {
    const doc = read('TEACHER_FUNCTIONAL_MATRIX.md');
    expect(doc).toMatch(/unreachable on a phone/i);
    expect(doc).toMatch(/width 0, height 0/i);
  });

  it('is honest that the teacher redesign was not done', () => {
    const doc = read('TEACHER_FUNCTIONAL_MATRIX.md');
    expect(doc).toMatch(/Not redesigned/);
  });
});
