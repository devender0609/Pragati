// v0.76 §14/§15 — THE REPORT AGREES WITH THE RELEASE.
//
// It caught its own release on the first run: the report was written
// claiming 1401, the suite stood at 1404 once this file was counted,
// and the guard failed before the zip was built. That is the whole
// reason the guard exists.
//
// v0.74 shipped a report claiming 1364 tests against a suite of 1367,
// and v0.75 added a test so the next stale figure would fail rather
// than ship. That test only guards v0.74's report. This one guards
// v0.76's, and it exists because the same mistake is available every
// time: write the report, then keep working.
//
// It also pins the two claims §15 says a redesign must not make
// loosely — that the acceptance judgement was recorded honestly, and
// that the surfaces NOT redesigned are named rather than implied.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (p: string) =>
  readFileSync(new URL(`../../../${p}`, import.meta.url), 'utf8');

describe('§14 the v0.76 report agrees with the v0.76 release', () => {
  it('quotes the authoritative test and file counts', () => {
    const r = read('V0.76_REPORT.md');
    expect(r).toMatch(/\*\*1404 passed \/ 76 files\*\*/);
  });

  it('states the version the package actually carries', () => {
    const pkg = JSON.parse(read('package.json')) as { version: string };
    expect(pkg.version).toBe('0.76.0');
    expect(read('V0.76_REPORT.md')).toMatch(/0\.76\.0/);
  });

  it('names the surfaces the redesign did not reach', () => {
    // §15 — a redesign is not successful because some screens improved.
    // The report must say which did not, by name.
    const r = read('V0.76_REPORT.md');
    expect(r).toMatch(/Teacher Overview/);
    expect(r).toMatch(/Teacher Assign/);
  });

  it('records the corrections rather than only the wins', () => {
    const r = read('V0.76_REPORT.md');
    expect(r).toMatch(/non-interactive/);
    expect(r).toMatch(/Bricolage/);
  });
});
