// v0.84.0 checkpoint 4 §8 — the human-readable evidence table, generated
// from the canonical dataset so it cannot drift from it. It lists every
// official chapter of Classes 1 and 2 exactly once; Pragati's own
// segments appear inside their chapter, never as records.
import { writeFileSync } from 'fs';
const d = JSON.parse(await import('fs').then((m) => m.readFileSync('src/curriculum/data/instructionalDecomposition.json', 'utf8')));
const mm = JSON.parse(await import('fs').then((m) => m.readFileSync('CURRICULUM_MASTER_MAP.json', 'utf8')));
const UNITS = d.units.filter((u) => u.classNumber === 4);
const SEGS = d.sourceSegments.filter((s) => s.officialRecordId.includes('demm1'));
const title = Object.fromEntries(mm.records.map((r) => [r.recordId, r.title]));
const led = {};
for (const src of [...d.units.filter((u) => u.classNumber === 4).map((u) => u.sourceEvidence), ...d.nonInstructional.map((r) => r.sourceEvidence), ...d.sourceSegments.filter((s) => s.officialRecordId.includes('demm1')).map((s) => s.sourceEvidence)]) {
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
const rows = d.recordExtents.filter((e) => e.officialRecordId.includes('demm1')).map((ext) => {
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
  '# Page-level intent audit — Class 4 (Maths Mela)',
  '',
  'Generated from `src/curriculum/data/instructionalDecomposition.json`.',
  'All 14 official chapters of Maths Mela appear exactly once. The book',
  'numbers no sections, so the chapter is the official record and every',
  'internal grouping is a Pragati unit or a `pragati_srcseg_*` segment.',
  '',
  '**Depth words.** *Indexed*: headings and opening text only, which is',
  'navigation and not evidence. *Full text*: every line of every page.',
  '*Visual*: the page was rendered and looked at, which early-primary',
  'mathematics usually needs.',
  '',
  `**Class 4** — ${P[4].pagesFullyInspected}/${P[4].pagesInScope} pages read in full text, ${P[4].visualPagesInspected}/${P[4].visualPagesRequired} picture-carried pages rendered and looked at, ${P[4].officialRecordsFullyInspected}/${P[4].officialRecordsTotal} chapters fully inspected. Status: **${P[4].status}**.`,
  '',
  P[4].status === 'DECOMPOSITION_SOURCE_COMPLETE'
    ? 'Source-complete: every page of all 14 chapters has been read in full text and every page whose mathematics is carried by the picture has been rendered and looked at. What remains is curriculum judgement.'
    : `Not source-complete: ${P[4].pagesFullTextPending} pages still to read and ${P[4].visualPagesPending} picture-carried pages still to render.`,
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
writeFileSync('PAGE_LEVEL_INTENT_AUDIT_CLASS_4.md', out.join('\n') + '\n');
console.log('chapters listed', rows.length, 'segments', d.sourceSegments.length);
