// v0.84.0 checkpoint 22 — Class 8 page-level audit, derived from canonical
// data: every number below comes from classProgress, the record extents and
// the units, never from a typed figure.
//
// Invariants this generator must hold: it reads ONLY Class 8 objects
// (via scopeFor), it names the book Ganita Prakash, it reports chapters
// and numbered sections as separate denominators, and it never prints a
// section count as a chapter count.
// from the canonical dataset so it cannot drift from it. It lists every
// segments appear inside their chapter, never as records.
import { writeFileSync } from 'fs';
import { scopeFor } from './auditScope.mjs';
const d = JSON.parse(await import('fs').then((m) => m.readFileSync('src/curriculum/data/instructionalDecomposition.json', 'utf8')));
const SCOPE = scopeFor(d, [8]);
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
/**
 * v0.84.0 checkpoint 23 — PRINTED FOLIOS ARE NOT ONE RANGE.
 *
 * Verified against the Part I PDFs: every Class 8 chapter file carries the
 * chapter body's folios and then an answer-key supplement whose numbering
 * restarts at 1 (ch4, for instance, runs 83-111 then 1-9). Taking
 * min..max across both produced "1-111", which exists nowhere in the book.
 * Runs of consecutive folios are read from the deduplicated page ledger and
 * reported separately. A one-page run that sits inside another run is a
 * misread corner number, not a folio sequence, and is dropped.
 */
function printedProvenance(ch) {
  const byPage = new Map();
  for (const e of [...UNITS.map((u) => u.sourceEvidence), ...SEGS.map((s) => s.sourceEvidence)]) {
    if (e.officialChapterId !== ch) continue;
    for (const p of e.pageEvidence) if (!byPage.has(p.pdfPage)) byPage.set(p.pdfPage, p);
  }
  const pages = [...byPage.values()].sort((a, b) => a.pdfPage - b.pdfPage);
  let runs = [];
  for (const p of pages) {
    if (p.printedPage === null || p.printedPage === undefined) continue;
    const last = runs[runs.length - 1];
    if (last && p.printedPage === last.end + 1) last.end = p.printedPage;
    else runs.push({ start: p.printedPage, end: p.printedPage });
  }
  runs = runs.filter(
    (r, i) =>
      r.start !== r.end ||
      !runs.some((o, j) => j !== i && o.start !== o.end && r.start >= o.start && r.start <= o.end)
  );
  if (runs.length === 0) return 'folios unknown';
  const label = (r) => (r.start === r.end ? `${r.start}` : `${r.start}\u2013${r.end}`);
  if (runs.length === 1) return label(runs[0]);
  return `body ${label(runs[0])}; appended ${runs.slice(1).map(label).join(', ')}`;
}

const rows = SCOPE.recordExtents.map((ext) => {
  const ch = ext.officialRecordId;
  // Class 8 units cite a numbered section; the chapter they belong to is
  // their officialChapterId.
  const units = UNITS.filter((u) => (u.officialChapterId ?? u.officialRecordId) === ch);
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
// v0.84.0 checkpoint 24 — both denominators are DERIVED. The prose said 58
// while the accounting below said 59/59 in the same document, because the
// headline was typed and the body was computed. The section total comes from
// the master map's own Class 8 section records, cross-checked against
// classProgress; the chapter total from the record extents in scope.
const officialSections = mm.records.filter((r) => r.classNumber === 8 && r.level === 'section');
const sectionTotal = officialSections.length;
const chapterTotal = SCOPE.recordExtents.length;
const partI = SCOPE.recordExtents.filter((e) => e.officialRecordId.startsWith('ncert_hegp1')).length;
if (sectionTotal !== (P[8]?.officialSectionsTotal ?? sectionTotal)) {
  throw new Error(
    `Class 8 section denominator disagrees: master map has ${sectionTotal}, classProgress has ${P[8].officialSectionsTotal}`
  );
}
const out = [
  '# Page-level intent audit — Class 8 (Ganita Prakash)',
  '',
  'Generated from `src/curriculum/data/instructionalDecomposition.json`.',
  `Ganita Prakash Part I (${partI} chapters) and Part II (${chapterTotal - partI}) hold **${chapterTotal} official**`,
  `**chapters and ${sectionTotal} numbered sections**.`,
  // v0.84.0 checkpoint 23 — only Class 6 is the first two-layer class; this
  // generator was cloned from the Class 6 one and inherited its claim.
  'Class 8 uses the numbered-grade two-layer model established at Class 6:',
  'the numbered section is the official authoring record while the chapter',
  'owns the page extent. Material the',
  'book does not number — an opener, a summary, the solutions supplement — is',
  'a `pragati_srcseg_*` segment, never an invented section id.',
  '',
  '**Depth words.** *Indexed*: headings and opening text only, which is',
  'navigation and not evidence. *Full text*: every line of every page.',
  '*Visual*: the page was rendered and looked at.',
  '',
  `**Class 8** — ${P[8].pagesFullyInspected}/${P[8].pagesInScope} pages read in full text, ${P[8].visualPagesInspected}/${P[8].visualPagesRequired} picture-carried pages rendered and looked at, ${P[8].chaptersFullyInspected}/${P[8].officialChapterCount} chapters fully inspected, ${P[8].sectionsAccountedFor}/${P[8].officialSectionsTotal} numbered sections accounted for. Status: **${P[8].status}**.`,
  '',
  P[8].status === 'DECOMPOSITION_SOURCE_COMPLETE'
    ? 'Source-complete: every page of all 14 chapters has been read in full text and every page whose mathematics is carried by the picture has been rendered and looked at. What remains is curriculum judgement.'
    : [
        `Not source-complete: ${P[8].pagesFullTextPending} of ${P[8].pagesInScope} pages are still to read.`,
        '',
        // v0.84.0 checkpoint 16 §3-§5 — an unread page has no visual
        // requirement yet, so "0 pending" is a statement about the pages
        // already inspected and nothing more. Saying "no visuals remain"
        // while 231 pages are unread would be false.
        `Among the ${P[8].pagesFullyInspected} pages inspected so far, ${P[8].visualPagesRequired} are picture-carried and ${P[8].visualPagesInspected} of those have been rendered and looked at. The visual requirement of the ${P[8].pagesFullTextPending} unread pages is **not yet determined**, so this is a known-so-far figure, not a total.`,
      ].join('\n'),
  '',
  '| Official chapter | Title | Printed pages | PDF pages | Full text | Visual required | Visual required seen | Pages rendered | Record state | Units | Ready | Needs human check |',
  '|---|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => {
    const ready = r.units.filter((u) => u.decompositionStatus === 'READY_FOR_AUTHORING').length;
    const check = r.units.filter((u) => u.decompositionStatus !== 'READY_FOR_AUTHORING').length;
    const total = r.ext.pdfPageEnd - r.ext.pdfPageStart + 1;
    return `| \`${r.ch}\` | ${title[r.ch] ?? '—'} | ${printedProvenance(r.ch)} | 1–${r.ext.pdfPageEnd} | ${r.ft}/${total} | ${r.vr} | ${r.vi} | ${r.rendered} | ${r.state} | ${r.units.length} | ${ready} | ${check} |`;
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
  '## Units by official section',
  '',
  // v0.84.0 checkpoint 23 — the authoring record is the numbered SECTION.
  // Checkpoint 22 printed section ids under a column headed "Chapter".
  '| Unit | Parent chapter | Official section | Evidence depth | Status |',
  '|---|---|---|---|---|',
  ...UNITS.map(
    (u) => `| \`${u.instructionalUnitId}\` ${u.instructionalTitle} | \`${u.officialChapterId ?? u.officialRecordId}\` | \`${u.officialRecordId}\` | ${u.sourceEvidence.evidenceDepth} | ${u.decompositionStatus} |`
  ),
  '',
];
writeFileSync('PAGE_LEVEL_INTENT_AUDIT_CLASS_8.md', out.join('\n') + '\n');
console.log('chapters listed', rows.length, 'segments', SEGS.length);
