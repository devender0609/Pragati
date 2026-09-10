// v0.75 §21 — write the eight section review packages to disk.
// Generated, never hand-written, so a package cannot drift from the
// lesson it describes. §7.4 is NOT regenerated; its package is frozen.
import { writeFileSync, mkdirSync } from 'node:fs';
const m = await import('../src/curriculum/sectionReviewPackages.ts');
const out = 'PRAGATI_CHAPTER_7_REVIEW_PACKAGES';
mkdirSync(out, { recursive: true });
const ids = m.sectionsNeedingPackages();
const index = [];
for (const id of ids) {
  const n = id.split('_s').pop().replace('_', '.');
  const file = `SECTION_${n.replace('.', '_')}_FOR_REVIEWER.md`;
  writeFileSync(`${out}/${file}`, m.sectionPackageMarkdown(id));
  const rec = m.sectionReviewRecord(id);
  index.push({ section: n, file, code: m.sectionReviewCode(id), questions: rec.expectedItemIds.length, artifact: rec.contentArtifactId, fingerprint: m.sectionFingerprint(id) });
}
writeFileSync(`${out}/index.json`, JSON.stringify({ generated: 'v0.75', packages: index }, null, 2));
console.log(`wrote ${index.length} packages`);
for (const p of index) console.log(`  §${p.section}  ${p.code}  ${p.questions} questions`);
