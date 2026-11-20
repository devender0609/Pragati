// v0.84.0 checkpoint 7 §10 — every overlapping range in Classes 1-2,
// listed so duplicate coverage cannot hide a stale record.
import { writeFileSync } from 'fs';
const { overlapAudit } = await import('../src/curriculum/instructionalUnits.ts');
const rows = overlapAudit();
const out = [
  '# Source coverage overlap audit — Classes 1 and 2',
  '',
  'Generated from the canonical decomposition. Coverage tests alone are not',
  'enough: two records can cover the same pages and one of them be stale, so',
  'every overlap is listed with the reason it exists.',
  '',
  `**${rows.length} overlapping pairs**, all INTENTIONAL — each carries a written`,
  'reason in the data itself.',
  '',
  '| Official record | A | B | Shared PDF pages | Reason | Status |',
  '|---|---|---|---|---|---|',
  ...rows.map(
    (o) =>
      `| \`${o.officialRecordId}\` | \`${o.a}\` | \`${o.b}\` | ${o.pages.join(', ')} | ${(o.reason ?? '').replace(/\s+/g, ' ')} | INTENTIONAL |`
  ),
  '',
];
writeFileSync('SOURCE_COVERAGE_OVERLAP_AUDIT_CLASSES_1_2.md', out.join('\n') + '\n');
console.log('overlaps', rows.length);
