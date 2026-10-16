// v0.84.0 checkpoint 16 §1 — THE NUMBERS IN A SUMMARY COME FROM THE DATA.
//
// The checkpoint-15 narrative said Class 6 was 38 READY / 4 flagged while the
// canonical data and the generated report said 37 / 5. Hand-typed counts are
// the only way that happens, so this file derives every status count and
// writes them where both the report and the tests read the same values.
import { readFileSync, writeFileSync } from 'fs';
const d = JSON.parse(readFileSync('src/curriculum/data/instructionalDecomposition.json', 'utf8'));
const count = (us, s) => us.filter((u) => u.decompositionStatus === s).length;
const perClass = {};
for (const n of [...new Set(d.units.map((u) => u.classNumber))].sort((a, b) => a - b)) {
  const us = d.units.filter((u) => u.classNumber === n);
  perClass[n] = {
    units: us.length,
    ready: count(us, 'READY_FOR_AUTHORING'),
    needsHumanCheck: count(us, 'NEEDS_HUMAN_CHECK'),
    draft: count(us, 'DRAFT_DECOMPOSITION'),
  };
}
const summary = {
  generatedFrom: 'src/curriculum/data/instructionalDecomposition.json',
  totalUnits: d.units.length,
  ready: count(d.units, 'READY_FOR_AUTHORING'),
  needsHumanCheck: count(d.units, 'NEEDS_HUMAN_CHECK'),
  draft: count(d.units, 'DRAFT_DECOMPOSITION'),
  perClass,
  policies: (d.humanJudgementPolicies ?? []).map((p) => ({ policyKey: p.policyKey, units: p.affectedUnitIds.length })),
  artifactAlignments: (d.artifactAlignments ?? []).reduce((a, x) => ({ ...a, [x.alignment]: (a[x.alignment] ?? 0) + 1 }), {}),
};
writeFileSync('CHECKPOINT_STATUS_COUNTS.json', `${JSON.stringify(summary, null, 1)}\n`);
console.log('summary', summary.totalUnits, summary.ready, summary.needsHumanCheck, JSON.stringify(summary.perClass[6] ?? {}));
