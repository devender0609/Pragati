// v0.84.0 checkpoint 15 — Class 6 page-level audit.
//
// Invariants this generator must hold: it reads ONLY Class 6 objects
// (via scopeFor), it names the book Ganita Prakash, it reports chapters
// and numbered sections as separate denominators, and it never prints a
// section count as a chapter count.
// from the canonical dataset so it cannot drift from it. It lists every
// segments appear inside their chapter, never as records.
import { writeFileSync } from 'fs';
import { scopeFor } from './auditScope.mjs';
const d = JSON.parse(await import('fs').then((m) => m.readFileSync('src/curriculum/data/instructionalDecomposition.json', 'utf8')));
const SCOPE = scopeFor(d, [6]);
const mm = JSON.parse(await import('fs').then((m) => m.readFileSync('CURRICULUM_MASTER_MAP.json', 'utf8')));
const UNITS = SCOPE.units;
const SEGS = SCOPE.sourceSegments;
const title = Object.fromEntries(mm.records.map((r) => [r.recordId, r.title]));
const led = {};
for (const src of [...SCOPE.units.map((u) => u.sourceEvidence), ...SCOPE.nonInstructional.map((r) => r.sourceEvidence), ...SCOPE.sourceSegments.map((s) => s.sourceEvidence)]) {
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
const rows = SCOPE.recordExtents.map((ext) => {
  const ch = ext.officialRecordId;
  const units = UNITS.filter((u) => u.officialRecordId === ch);
  const pages = Object.values(led[ch] ?? {});
  const ft = pages.filter((p) => p.fullTextInspected).length;
  // v0.84.0 checkpoint 11 §9 — numerator and denominator must describe
  // the same set. "Seen" used to count every rendered page, so a chapter
  // could report 20 seen of 17 required.
  const vr = pages.filter((p) => p.visualInspectionRequired).length;
  const vi = pages.filter((p) => p.visualInspectionRequired && p.visualInspected).length;
  const rendered = pages.filter((p) => p.visualInspected).length;
  const segs = SEGS.filter((s) => s.officialRecordId === ch);
  return { ch, ext, units, ft, vr, vi, rendered, segs, state: state(ch, ext) };
});
const P = Object.fromEntries(d.classProgress.map((p) => [p.classNumber, p]));
const out = [
  '# Page-level intent audit — Class 6 (Ganita Prakash)',
  '',
  'Generated from `src/curriculum/data/instructionalDecomposition.json`.',
  'Ganita Prakash has **10 official chapters holding 65 numbered sections**.',
  'Class 6 is the first class with two official layers: the numbered section',
  'is the authoring record and the chapter owns the page extent. Material the',
  'book does not number — an opener, a summary, the solutions supplement — is',
  'a `pragati_srcseg_*` segment, never an invented section id.',
  '',
  '**Depth words.** *Indexed*: headings and opening text only, which is',
  'navigation and not evidence. *Full text*: every line of every page.',
  '*Visual*: the page was rendered and looked at, which early-primary',
  'mathematics usually needs.',
  '',
  `**Class 6** — ${P[6].pagesFullyInspected}/${P[6].pagesInScope} pages read in full text, ${P[6].visualPagesInspected}/${P[6].visualPagesRequired} picture-carried pages rendered and looked at, ${P[6].chaptersFullyInspected}/${P[6].officialChapterCount} chapters fully inspected, ${P[6].sectionsAccountedFor}/${P[6].officialSectionsTotal} numbered sections accounted for. Status: **${P[6].status}**.`,
  '',
  P[6].status === 'DECOMPOSITION_SOURCE_COMPLETE'
    ? 'Source-complete: every page of all 15 chapters has been read in full text and every page whose mathematics is carried by the picture has been rendered and looked at. What remains is curriculum judgement.'
    : `Not source-complete: ${P[6].pagesFullTextPending} pages still to read and ${P[6].visualPagesPending} picture-carried pages still to render.`,
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
writeFileSync('PAGE_LEVEL_INTENT_AUDIT_CLASS_6.md', out.join('\n') + '\n');
console.log('chapters listed', rows.length, 'segments', SEGS.length);
