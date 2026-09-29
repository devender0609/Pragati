// v0.84.0 checkpoint 4 §8 — the human-readable evidence table, generated
// from the canonical dataset so it cannot drift from it. It lists every
// official chapter of Classes 1 and 2 exactly once; Pragati's own
// segments appear inside their chapter, never as records.
import { writeFileSync } from 'fs';
const d = JSON.parse(await import('fs').then((m) => m.readFileSync('src/curriculum/data/instructionalDecomposition.json', 'utf8')));
const mm = JSON.parse(await import('fs').then((m) => m.readFileSync('CURRICULUM_MASTER_MAP.json', 'utf8')));
const title = Object.fromEntries(mm.records.map((r) => [r.recordId, r.title]));
const led = {};
for (const src of [...d.units.map((u) => u.sourceEvidence), ...d.nonInstructional.map((r) => r.sourceEvidence), ...d.sourceSegments.map((s) => s.sourceEvidence)]) {
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
const rows = d.recordExtents.filter((e) => e.officialRecordId.includes('cemm1')).map((ext) => {
  const ch = ext.officialRecordId;
  const units = d.units.filter((u) => u.officialRecordId === ch);
  const pages = Object.values(led[ch] ?? {});
  const ft = pages.filter((p) => p.fullTextInspected).length;
  const vr = pages.filter((p) => p.visualInspectionRequired).length;
  const vi = pages.filter((p) => p.visualInspected).length;
  const segs = d.sourceSegments.filter((s) => s.officialRecordId === ch);
  return { ch, ext, units, ft, vr, vi, segs, state: state(ch, ext) };
});
const P = Object.fromEntries(d.classProgress.map((p) => [p.classNumber, p]));
const out = [
  '# Page-level intent audit — Class 3 (Maths Mela)',
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
  `**Class 3** — ${P[3].pagesFullyInspected}/${P[3].pagesInScope} pages read in full text, ${P[3].visualPagesInspected}/${P[3].visualPagesRequired} picture-carried pages rendered and looked at, ${P[3].officialRecordsFullyInspected}/${P[3].officialRecordsTotal} chapters fully inspected. Status: **${P[3].status}**.`,
  '',
  'The class is NOT source-complete: every page has been read in full text, but',
  'the visual pass is unfinished, so most units are NEEDS_HUMAN_CHECK.',
  '',
  '| Official chapter | Title | Printed pages | PDF pages | Full text | Visual required | Visual seen | Record state | Units | Ready | Needs human check |',
  '|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => {
    const ready = r.units.filter((u) => u.decompositionStatus === 'READY_FOR_AUTHORING').length;
    const check = r.units.filter((u) => u.decompositionStatus !== 'READY_FOR_AUTHORING').length;
    const total = r.ext.pdfPageEnd - r.ext.pdfPageStart + 1;
    return `| \`${r.ch}\` | ${title[r.ch] ?? '—'} | ${r.ext.printedPageStart ?? '—'}–${r.ext.printedPageEnd ?? '—'} | 1–${r.ext.pdfPageEnd} | ${r.ft}/${total} | ${r.vr} | ${r.vi} | ${r.state} | ${r.units.length} | ${ready} | ${check} |`;
  }),
  '',
  '## Pragati source segments (non-official)',
  '',
  '| Segment | Inside | Label | Role | PDF pages | Why |',
  '|---|---|---|---|---|---|',
  ...d.sourceSegments.map(
    (s) => `| \`${s.sourceSegmentId}\` | \`${s.officialRecordId}\` | ${s.sourceLabel} | ${s.role} | ${s.sourceEvidence.pdfPageStart}–${s.sourceEvidence.pdfPageEnd} | ${s.justification} |`
  ),
  '',
  '## Units by chapter',
  '',
  '| Unit | Chapter | Evidence depth | Status |',
  '|---|---|---|---|',
  ...d.units.map(
    (u) => `| \`${u.instructionalUnitId}\` ${u.instructionalTitle} | \`${u.officialRecordId}\` | ${u.sourceEvidence.evidenceDepth} | ${u.decompositionStatus} |`
  ),
  '',
];
writeFileSync('PAGE_LEVEL_INTENT_AUDIT_CLASS_3.md', out.join('\n') + '\n');
console.log('chapters listed', rows.length, 'segments', d.sourceSegments.length);
