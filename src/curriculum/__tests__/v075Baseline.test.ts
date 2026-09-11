// v0.75 §0/§36 — ONE AUTHORITATIVE RELEASE NUMBER.
//
// v0.74 shipped with its report claiming 1364 tests while the code had
// 1367. Nothing was broken by it, but a release report that disagrees
// with the release is exactly the class of defect v0.74 spent itself
// correcting elsewhere — a document contradicting its own data.
//
// The cause was mundane: the report was written, then three tests were
// added to fix the in-app coverage wording, and the report was not
// re-read. This test makes the report's own claim checkable, so the
// next stale number fails the suite instead of shipping.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (p: string) =>
  readFileSync(new URL(`../../../${p}`, import.meta.url), 'utf8');

describe('§0 the v0.74 report agrees with the v0.74 release', () => {
  it('quotes the authoritative test count', () => {
    const r = read('V0.74_REPORT.md');
    expect(r).toMatch(/\*\*1367 passed \/ 71 files\*\*/);
    // The stale figure must not survive as a bare claim anywhere.
    expect(r).not.toMatch(/\*\*1364 passed/);
  });

  it('records the discrepancy rather than hiding the edit', () => {
    const r = read('V0.74_REPORT.md');
    expect(r).toMatch(/Erratum/);
    expect(r).toMatch(/1364 \+ 3 = 1367/);
    // §0 — "Do not hide the discrepancy."
    expect(r).toMatch(/No code changed/i);
  });

  it('keeps the frozen review identity in the report', () => {
    const r = read('V0.74_REPORT.md');
    expect(r).toMatch(/a1a3ff57/);
    expect(r).toMatch(/S74-v1-A1A3FF/);
  });
});
