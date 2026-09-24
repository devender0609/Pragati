// v0.82.2 §9 — CHAPTER-SCOPED PACKAGE EMISSION.
//
// This wrote every package into PRAGATI_CHAPTER_7_REVIEW_PACKAGES and
// called `sectionsNeedingPackages()` with no scope, so the moment
// Number Play became complete its sections would have been written into
// the Fractions folder under Fractions naming — a reviewer opening
// "Chapter 7" would have found a Number Play lesson in it.
//
// Chapters now emit separately, into their own folders, and §7.4 is
// still never regenerated: its package is frozen and its fingerprint is
// a release invariant.
import { writeFileSync, mkdirSync } from 'node:fs';
const m = await import('../src/curriculum/sectionReviewPackages.ts');
const reg = await import('../src/curriculum/authoredSections.ts');

const CHAPTERS = [
  {
    id: reg.FRACTIONS_CHAPTER_ID,
    out: process.env.PRAGATI_PACKAGE_OUT_SUFFIX
      ? `PRAGATI_CHAPTER_7_REVIEW_PACKAGES${process.env.PRAGATI_PACKAGE_OUT_SUFFIX}`
      : 'PRAGATI_CHAPTER_7_REVIEW_PACKAGES',
    label: 'Chapter 7 — Fractions',
  },
  {
    id: reg.NUMBER_PLAY_CHAPTER_ID,
    out: process.env.PRAGATI_PACKAGE_OUT_SUFFIX
      ? `PRAGATI_CHAPTER_3_REVIEW_PACKAGES${process.env.PRAGATI_PACKAGE_OUT_SUFFIX}`
      : 'PRAGATI_CHAPTER_3_REVIEW_PACKAGES',
    label: 'Chapter 3 — Number Play',
  },
];

let total = 0;
for (const ch of CHAPTERS) {
  const ids = m.sectionsNeedingPackages(ch.id);
  if (ids.length === 0) {
    console.log(`${ch.label}: nothing eligible`);
    continue;
  }
  mkdirSync(ch.out, { recursive: true });
  const index = [];
  for (const id of ids) {
    const n = id.split('_s').pop().replace('_', '.');
    const file = `SECTION_${n.replace('.', '_')}_FOR_REVIEWER.md`;
    writeFileSync(`${ch.out}/${file}`, m.sectionPackageMarkdown(id));
    const rec = m.sectionReviewRecord(id);
    index.push({
      section: n,
      file,
      code: m.sectionReviewCode(id),
      questions: rec.expectedItemIds.length,
      artifact: rec.contentArtifactId,
      artifactVersion: rec.contentArtifactVersion,
      // v0.83.3 §13 — the manifest carries every identity the importer
      // checks, so the markdown, the manifest and the gate agree.
      contentFingerprint: m.sectionFingerprint(id),
      sourceProvenanceFingerprint: m.sectionProvenanceFingerprint(id),
      sourceProvenanceVersion: m.SOURCE_PROVENANCE_VERSION,
      questionSetVersion: m.SECTION_QUESTION_SET_VERSION,
      fingerprint: m.sectionFingerprint(id),
    });
  }
  writeFileSync(
    `${ch.out}/index.json`,
    JSON.stringify({ chapter: ch.label, generated: process.env.PRAGATI_PACKAGE_STAMP ?? 'v0.82.2', packages: index }, null, 2)
  );
  total += index.length;
  console.log(`${ch.label}: wrote ${index.length} packages into ${ch.out}`);
  for (const p of index)
    console.log(`  §${p.section}  ${p.code}  artifact v${p.artifactVersion}  ${p.questions} questions`);
}
console.log(`total ${total}`);
