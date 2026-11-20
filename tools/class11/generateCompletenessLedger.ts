/**
 * v0.84.0-c11.59 checkpoint 103A — GENERATE THE CLASS 11 COMPLETENESS LEDGER.
 *
 * This file exists because the ledger never had a generator. It was written
 * inline by checkpoint scripting, and at checkpoint 102C that script ran
 * against a transiently-broken catalogue: the Chapter 12 block still merged
 * two authored modules and sorted by page, so FO-11 appeared twice and
 * `arts.length` was 91. The Chapter 12 filter was fixed minutes later; the
 * ledger was not regenerated, so the scalar rode forward while the ledger
 * ROWS — keyed by artifact id — stayed correct at 90 unique ids.
 *
 * Two lessons are baked in here:
 *
 *   1. Generated evidence needs an owner that can be re-run, or it drifts
 *      from the model it claims to describe.
 *   2. `artifacts` is the count of DISTINCT authored artifacts, never the
 *      number of catalogue rows and never the sum of unit→artifact
 *      references. Canonical units are finer than artifacts: 93 units
 *      reference artifacts 129 times across 90 distinct lessons.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allAuthoredSections } from '../../src/curriculum/authoredSections';
import { authoredLearnCatalogueForGrade } from '../../src/curriculum/authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../../src/curriculum/authoredLearnAccess';
import {
  type CanonicalUnit, isClass11Artifact, reconcileCoverage, unitCoverageKeys,
} from '../../src/curriculum/class11Coverage';

// ES module scope: no __dirname.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(HERE, '../../class11-source');

export function buildCompletenessLedger(): Record<string, unknown> {
  __setAuthoredLearnPreviewForTests(true);
  try {
    const units: CanonicalUnit[] = JSON.parse(
      fs.readFileSync(path.join(SOURCE_DIR, 'CLASS11_DECOMPOSITION.json'), 'utf8')
    );
    const artifacts = allAuthoredSections().filter(isClass11Artifact);
    const cov = reconcileCoverage(units, artifacts);
    const cat = authoredLearnCatalogueForGrade('class11');
    const place = (id: string): string => {
      for (const ch of cat.chapters) {
        if (ch.lessons.some((l) => l.contentArtifactId === id)) return `chapter-${ch.number}`;
      }
      if (cat.prerequisiteLessons.some((l) => l.contentArtifactId === id)) return 'chapter-less prerequisite group';
      if (cat.requiredCoreLessons.some((l) => l.contentArtifactId === id)) return 'chapter-less required group';
      return 'UNPLACED';
    };
    // DISTINCT artifact identities. Not catalogue rows, not reference counts.
    const distinct = new Set(artifacts.map((a) => a.contentArtifactId));
    return {
      generatedBy: 'tools/class11/generateCompletenessLedger.ts',
      units: units.length,
      covered: cov.covered,
      uncovered: cov.uncovered,
      artifacts: distinct.size,
      orphans: cov.orphans,
      mechanism: `canonical units decompose finer than the sections lessons are authored against; `
        + `${cov.sharedKeys.length} source keys each carry more than one unit, which is why `
        + `${distinct.size} artifacts cover ${cov.covered} units`,
      sharedKeys: cov.sharedKeys,
      ledger: units.map((u) => ({
        unitId: u.unitId, title: u.title,
        assessmentStatus: u.assessmentStatus, instructionalStatus: u.instructionalStatus,
        required: u.instructionalStatus.startsWith('REQUIRED'),
        sourceKind: u.source.kind, coverageKeys: unitCoverageKeys(u),
        authored: !cov.uncovered.includes(u.unitId),
        artifacts: cov.byUnit.get(u.unitId) ?? [],
        missing: cov.uncovered.includes(u.unitId),
        prerequisites: u.prerequisites,
        placement: (cov.byUnit.get(u.unitId) ?? []).map(place),
      })),
    };
  } finally {
    __setAuthoredLearnPreviewForTests(null);
  }
}

const RUN_DIRECTLY = process.argv[1] !== undefined
  && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (RUN_DIRECTLY) {
  const ledger = buildCompletenessLedger();
  fs.writeFileSync(path.join(SOURCE_DIR, 'CLASS11_COMPLETENESS_LEDGER.json'),
    `${JSON.stringify(ledger, null, 2)}\n`);
  console.log(`completeness ledger regenerated: ${ledger.artifacts} artifacts, `
    + `${ledger.covered}/${ledger.units} covered`);
}
