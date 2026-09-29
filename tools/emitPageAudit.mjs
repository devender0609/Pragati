// v0.84.0 checkpoint 4 §8 — the human-readable evidence table, generated
// from the canonical dataset so it cannot drift from it. It lists every
// official chapter of Classes 1 and 2 exactly once; Pragati's own
// segments appear inside their chapter, never as records.
import { writeFileSync } from 'fs';
const d = JSON.parse(await import('fs').then((m) => m.readFileSync('src/curriculum/data/instructionalDecomposition.json', 'utf8')));
const mm = JSON.parse(await import('fs').then((m) => m.readFileSync('CURRICULUM_MASTER_MAP.json', 'utf8')));
const UNITS = d.units.filter((u) => u.classNumber <= 2);
const SEGS = d.sourceSegments.filter((s) => !s.officialRecordId.includes('cemm1'));
const title = Object.fromEntries(mm.records.map((r) => [r.recordId, r.title]));
const led = {};
for (const src of [...d.units.filter((u) => u.classNumber <= 2).map((u) => u.sourceEvidence), ...d.nonInstructional.map((r) => r.sourceEvidence), ...d.sourceSegments.filter((s) => !s.officialRecordId.includes('cemm1')).map((s) => s.sourceEvidence)]) {
  led[src.officialChapterId] ??= {};
  for (const p of src.pageEvidence) led[src.officialChapterId][p.pdfPage] = p;
}
const state = (ch, ext) => {
  const pages = led[ch] ?? {};
  let seen = 0;
  for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
    const e = pages[p];
    if (e?.fullTextInspected && (!e.visualInspectionRequired || e.visualInspected)) seen += 1;
  }
  const total = ext.pdfPageEnd - ext.pdfPageStart + 1;
  return seen === total ? 'FULLY_INSPECTED' : seen > 0 ? 'PARTIALLY_INSPECTED' : 'INDEXED_ONLY';
};
const rows = d.recordExtents.filter((e) => !e.officialRecordId.includes('cemm1')).map((ext) => {
  const ch = ext.officialRecordId;
  const units = d.units.filter((u) => u.officialRecordId === ch);
  const pages = Object.values(led[ch] ?? {});
  const ft = pages.filter((p) => p.fullTextInspected).length;
  // v0.84.0 checkpoint 11 §9 — numerator and denominator must describe
  // the same set. "Seen" used to count every rendered page, so a chapter
  // could report 20 seen of 17 required.
  const vr = pages.filter((p) => p.visualInspectionRequired).length;
  const vi = pages.filter((p) => p.visualInspectionRequired && p.visualInspected).length;
  const rendered = pages.filter((p) => p.visualInspected).length;
  const segs = d.sourceSegments.filter((s) => s.officialRecordId === ch);
  return { ch, ext, units, ft, vr, vi, rendered, segs, state: state(ch, ext) };
});
const P = Object.fromEntries(d.classProgress.map((p) => [p.classNumber, p]));
const out = [
  '# Page-level intent audit — Classes 1 and 2',
  '',
  'Generated from `src/curriculum/data/instructionalDecomposition.json`.',
  'Every official chapter of Class 1 (13) and Class 2 (11) appears exactly',
  'once. Material NCERT did not number — a "Puzzles" heading, a project',
  'page, a chapter opener — is a **Pragati source segment** inside its',
  'chapter, never an official record of its own.',
  '',
  '**Depth words.** *Indexed*: headings and opening text only, which is',
  'navigation and not evidence. *Full text*: every line of every page.',
  '*Visual*: the page was rendered and looked at, which early-primary',
  'mathematics usually needs.',
  '',
  `**Class 1** — ${P[1].pagesFullyInspected}/${P[1].pagesInScope} pages read in full, ${P[1].visualPagesInspected}/${P[1].visualPagesRequired} picture-carried pages seen, ${P[1].officialRecordsFullyInspected}/${P[1].officialRecordsTotal} chapters fully inspected. Status: ${P[1].status}.`,
  `**Class 2** — ${P[2].pagesFullyInspected}/${P[2].pagesInScope} pages read in full, ${P[2].visualPagesInspected}/${P[2].visualPagesRequired} picture-carried pages seen, ${P[2].officialRecordsFullyInspected}/${P[2].officialRecordsTotal} chapters fully inspected. Status: ${P[2].status}.`,
  '',
  '| Official chapter | Title | Printed pages | PDF pages | Full text | Visual required | Visual required seen | Pages rendered | Record state | Units | Ready | Needs human check |',
  '|---|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => {
    const ready = r.units.filter((u) => u.decompositionStatus === 'READY_FOR_AUTHORING').length;
    const check = r.units.filter((u) => u.decompositionStatus !== 'READY_FOR_AUTHORING').length;
    const total = r.ext.pdfPageEnd - r.ext.pdfPageStart + 1;
    return `| \`${r.ch}\` | ${title[r.ch] ?? '—'} | ${r.ext.printedPageStart ?? '—'}–${r.ext.printedPageEnd ?? '—'} | 1–${r.ext.pdfPageEnd} | ${r.ft}/${total} | ${r.vr} | ${r.vi} | ${r.rendered} | ${r.state} | ${r.units.length} | ${ready} | ${check} |`;
  }),
  '',
  '## Pragati source segments (non-official)',
  '',
  '| Segment | Inside | Label | Role | PDF pages | Why |',
  '|---|---|---|---|---|---|',
  ...SEGS.map(
    (s) => `| \`${s.sourceSegmentId}\` | \`${s.officialRecordId}\` | ${s.sourceLabel} | ${s.role} | ${s.sourceEvidence.pdfPageStart}–${s.sourceEvidence.pdfPageEnd} | ${s.justification} |`
  ),
  '',
  '## Units by chapter',
  '',
  '| Unit | Chapter | Evidence depth | Status |',
  '|---|---|---|---|',
  ...UNITS.map(
    (u) => `| \`${u.instructionalUnitId}\` ${u.instructionalTitle} | \`${u.officialRecordId}\` | ${u.sourceEvidence.evidenceDepth} | ${u.decompositionStatus} |`
  ),
  '',
];
writeFileSync('PAGE_LEVEL_INTENT_AUDIT_CLASSES_1_2.md', out.join('\n') + '\n');
console.log('chapters listed', rows.length, 'segments', d.sourceSegments.length);
