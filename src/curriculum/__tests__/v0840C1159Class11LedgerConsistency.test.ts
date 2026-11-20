/**
 * v0.84.0-c11.59 checkpoint 103A — THE DURABLE EVIDENCE MUST MATCH THE MODEL.
 *
 * The completeness ledger said `"artifacts": 91` while the registry held 90.
 * It was generated at checkpoint 102C from `arts.length` at a moment when
 * the Chapter 12 block still merged two authored modules and sorted by
 * page, so FO-11 appeared twice. The catalogue was fixed minutes later; the
 * generated file was not regenerated, and the stale scalar rode forward
 * through a first-green package and a hardened package.
 *
 * Nobody noticed because the ledger ROWS were right — they key on artifact
 * id, so the duplicate collapsed. Only the top-level count carried it.
 *
 * Every scalar is therefore re-derived here from source at test time. A
 * ledger that disagrees with the model is now a failing test rather than a
 * number somebody has to spot.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { allAuthoredSections } from '../authoredSections';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { type CanonicalUnit, isClass11Artifact, reconcileCoverage } from '../class11Coverage';

const dir = path.join(__dirname, '../../../class11-source');
const read = (f: string): Record<string, never> =>
  JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));

const UNITS: CanonicalUnit[] = read('CLASS11_DECOMPOSITION.json') as never;
const LEDGER = read('CLASS11_COMPLETENESS_LEDGER.json') as Record<string, never>;

const derived = () => {
  __setAuthoredLearnPreviewForTests(true);
  try {
    const artifacts = allAuthoredSections().filter(isClass11Artifact);
    return { artifacts, cov: reconcileCoverage(UNITS, artifacts) };
  } finally {
    __setAuthoredLearnPreviewForTests(null);
  }
};

describe('the completeness ledger agrees with the live model', () => {
  it('counts DISTINCT artifacts, not catalogue rows', () => {
    const { artifacts } = derived();
    const distinct = new Set(artifacts.map((a) => a.contentArtifactId));
    // The registry itself must be duplicate-free...
    expect(artifacts).toHaveLength(distinct.size);
    // ...and the ledger's scalar must be that number.
    expect(LEDGER.artifacts as unknown as number).toBe(distinct.size);
  });

  it('never mistakes unit→artifact references for an artifact count', () => {
    // 93 units reference artifacts far more often than there are artifacts,
    // because a source key can carry several units. Summing the references
    // is the plausible-looking mistake this guards against.
    const { cov } = derived();
    const references = [...cov.byUnit.values()].reduce((n, v) => n + v.length, 0);
    expect(references).toBeGreaterThan(LEDGER.artifacts as unknown as number);
    expect(LEDGER.artifacts as unknown as number).not.toBe(references);
  });

  it('matches the ledger rows to the scalar', () => {
    const inRows = new Set(
      (LEDGER.ledger as unknown as Array<{ artifacts: string[] }>).flatMap((r) => r.artifacts)
    );
    expect(inRows.size).toBe(LEDGER.artifacts as unknown as number);
  });

  it('re-derives every coverage scalar from source', () => {
    const { cov } = derived();
    expect(LEDGER.units as unknown as number).toBe(UNITS.length);
    expect(LEDGER.covered as unknown as number).toBe(cov.covered);
    expect([...(LEDGER.uncovered as unknown as string[])].sort()).toEqual([...cov.uncovered].sort());
    expect([...(LEDGER.orphans as unknown as string[])].sort()).toEqual([...cov.orphans].sort());
    expect((LEDGER.ledger as unknown as unknown[]).length).toBe(UNITS.length);
  });

  it('names the generator that owns it, so it can be re-run', () => {
    // The drift happened because no generator owned this file. A hand-written
    // ledger cannot be regenerated after the model moves.
    expect(LEDGER.generatedBy as unknown as string).toMatch(/generateCompletenessLedger/);
    expect(fs.existsSync(path.join(__dirname, '../../../tools/class11/generateCompletenessLedger.ts')))
      .toBe(true);
  });

  it('keeps the queue and chapter matrix consistent with coverage', () => {
    const { cov } = derived();
    const queue = read('CLASS11_REQUIRED_AUTHORING_QUEUE.json') as Record<string, never>;
    const matrix = read('CLASS11_CHAPTER_MATRIX.json') as Record<string, never>;
    expect((queue.queue as unknown as Array<{ unitId: string }>).map((q) => q.unitId).sort())
      .toEqual([...cov.uncovered].sort());
    const rows = matrix.chapters as unknown as Array<{ requiredComplete: boolean; missing: string[] }>;
    expect(rows).toHaveLength(14);
    for (const r of rows) expect(r.requiredComplete).toBe(r.missing.length === 0);
  });
});
