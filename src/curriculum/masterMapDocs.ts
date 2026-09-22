// ===========================================================================
// v0.83 — DOCUMENTS RENDERED FROM THE CURRICULUM MASTER MAP.
//
// Every count below is computed from `curriculumMasterMap.ts`. None is
// typed by hand. `v078StateDocs.test.ts` compares the files on disk with
// these functions on every run, and `v083MasterMap.test.ts` reads the
// tables back BY COLUMN NAME, so a right number in the wrong column fails.
//
// Cell vocabulary, used everywhere:
//   a number   — counted from primary-source records
//   —          — the source does not define this level
//   UNKNOWN    — the level exists or may exist, and has not been fully read
// UNKNOWN is never written as 0.
// ===========================================================================

import {
  CLASS_NUMBERS,
  MASTER_EVIDENCE,
  MASTER_RECORDS,
  MASTER_SOURCES,
  PRODUCTION_WAVES,
  authoringUnits,
  classStructureStatus,
  gapReport,
  productStatus,
  productionBacklog,
  registryLagClasses,
  sourcesForClass,
  syllabusCounts,
  textbookCounts,
  textbookDenominatorKnown,
  type HierarchyCounts,
  type LevelCount,
  type MasterRecord,
} from './curriculumMasterMap';

export function table(headers: string[], rows: string[][]): string {
  const head = `| ${headers.join(' | ')} |`;
  const rule = `|${headers.map(() => '---').join('|')}|`;
  const body = rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`).join('\n');
  return [head, rule, body].join('\n');
}

export const cell = (c: LevelCount): string =>
  c === 'not_defined_by_source' ? '—' : c === 'unknown' ? 'UNKNOWN' : String(c);

const STATUS_LABEL = {
  complete_at_structure_level: 'COMPLETE AT STRUCTURE LEVEL',
  structure_partially_known: 'PARTIAL — see finding F1',
} as const;

function bookLabel(n: number): string {
  const books = sourcesForClass(n).filter((s) => s.kind === 'textbook');
  const parts = books.map((b) => b.part).filter(Boolean);
  const base = books[0]?.title.replace(/[- ]?(Part[- ]?I+|II)$/i, '').replace(/-II$/, '') ?? '—';
  return parts.length > 1
    ? `NCERT textbook: ${base} (${parts.join(' + ')})`
    : `NCERT textbook: ${books.map((b) => b.title + (b.part ? ` (${b.part})` : '')).join(', ')}`;
}

/**
 * One table, one row per SOURCE HIERARCHY. For Classes 9–12 the CBSE
 * syllabus row comes first and the NCERT textbook row second: they are
 * two different hierarchies and neither is folded into the other.
 */
export function hierarchyTable(): string {
  const rows: string[][] = [];
  const row = (n: number, source: string, c: HierarchyCounts, status: string) => [
    `Class ${n}`,
    source,
    cell(c.unit),
    cell(c.chapter),
    cell(c.section),
    cell(c.subsection),
    cell(c.topic),
    status,
  ];
  for (const n of CLASS_NUMBERS) {
    const syl = syllabusCounts(n);
    if (syl) {
      const s = sourcesForClass(n).find((x) => x.kind === 'syllabus')!;
      rows.push(row(n, `CBSE syllabus: ${s.title}`, syl, 'primary source verified'));
    }
    const t = textbookCounts(n);
    const tRow = row(n, bookLabel(n), t, STATUS_LABEL[classStructureStatus(n)]);
    if (!textbookDenominatorKnown(n)) {
      // The Part I count is real; the class total is not known.
      tRow[3] = `${cell(t.chapter)} (Part I only; class total UNKNOWN)`;
      tRow[4] = `${cell(t.section)} (Part I only; class total UNKNOWN)`;
    }
    rows.push(tRow);
  }
  return table(
    ['Class', 'Source', 'Units', 'Chapters', 'Sections', 'Sub-sections', 'Topics', 'Structure status'],
    rows
  );
}

export function registryLagParagraph(): string {
  const lag = registryLagClasses();
  if (lag.length === 0) {
    return 'The in-app curriculum registry agrees with the master map for every class.';
  }
  return (
    `**The in-app registry is behind this map.** The Student and Teacher screens read ` +
    `\`OFFICIAL_CURRICULA\`, which still records Class${lag.length > 1 ? 'es' : ''} ` +
    `${lag.join(', ')} as pending verification. Their structure is verified here; it has ` +
    `not been wired into those screens because that changes frozen Student and Teacher ` +
    `surfaces (and the two-part books restart chapter numbering). That is a separate step ` +
    `awaiting approval. Until then this map, not the in-app registry, is the curriculum truth.`
  );
}

export function gapReportTable(): string {
  return table(
    ['Class', 'Structure', 'Authoring unit', 'Verified records', 'Unverified records', 'Learn authored', 'Learn missing', 'Practice authored', 'Practice missing', 'Instructionally complete', 'Review-ready', 'Sent', 'Reviewed', 'Published'],
    CLASS_NUMBERS.map((n) => {
      const g = gapReport(n);
      const unit = sourcesForClass(n).some((s) => s.kind === 'textbook' && s.levels.section === 'primary_source_verified')
        ? 'section'
        : 'chapter';
      return [
        `Class ${n}`,
        STATUS_LABEL[g.structureStatus],
        unit,
        String(g.verifiedUnits),
        g.unverifiedUnits === 'unknown' ? 'UNKNOWN' : String(g.unverifiedUnits),
        String(g.learnAuthored),
        String(g.learnMissing),
        String(g.practiceAuthored),
        String(g.practiceMissing),
        String(g.instructionallyComplete),
        String(g.reviewReady),
        String(g.reviewSent),
        String(g.reviewed),
        String(g.published),
      ];
    })
  );
}

function totals() {
  const g = CLASS_NUMBERS.map(gapReport);
  const sum = (f: (x: ReturnType<typeof gapReport>) => number) => g.reduce((a, x) => a + f(x), 0);
  return {
    verified: sum((x) => x.verifiedUnits),
    unknownClasses: g.filter((x) => x.unverifiedUnits === 'unknown').map((x) => x.classNumber),
    learn: sum((x) => x.learnAuthored),
    complete: sum((x) => x.instructionallyComplete),
    ready: sum((x) => x.reviewReady),
    sent: sum((x) => x.reviewSent),
    reviewed: sum((x) => x.reviewed),
    published: sum((x) => x.published),
  };
}

export function headlineSentence(): string {
  const t = totals();
  return (
    `${t.verified} verified authoring records across Classes 1–12` +
    (t.unknownClasses.length ? ` (Class ${t.unknownClasses.join(', ')} total UNKNOWN)` : '') +
    `. Learn authored for ${t.learn}; ${t.complete} instructionally complete; ${t.ready} review-ready; ` +
    `${t.sent} sent; ${t.reviewed} reviewed; ${t.published} published. Pragati is not complete.`
  );
}

function findingsList(): string {
  return MASTER_EVIDENCE.findings
    .map((f) => `- **${f.id}** (${f.grade === null ? 'all classes' : `Class ${f.grade}`}, ${f.severity}) — ${f.text}`)
    .join('\n');
}

const STAMP = (version: string) =>
  `**Generated** from the curriculum master map (\`src/curriculum/curriculumMasterMap.ts\`) at ` +
  `version ${version}. Do not hand-edit: the test suite compares this file to the model on every run.`;

// ---------------------------------------------------------------------------
// CURRENT_MATH_BOOKS_CLASSES_1_12.md
// ---------------------------------------------------------------------------

export function renderBooksDocument(version: string): string {
  const books = MASTER_SOURCES.filter((s) => s.kind === 'textbook');
  const syl = MASTER_SOURCES.filter((s) => s.kind === 'syllabus');
  return `# Current Mathematics sources, Classes 1–12

${STAMP(version)}

## Four claims, recorded separately

For every class this document separates:

- **A. Book identity** — which book is current (read from the NCERT portal's live book menu and the book's own title page).
- **B. Edition / applicability** — which printing is current (read from the imprint page; "Reprint 2026-27" is printed on the pages of current books).
- **C. Structure** — chapters, sections and sub-sections (read from the contents page and, for Classes 1–9, from every chapter PDF).
- **D. Page-level mathematical intent** — what each section actually teaches. Inspected only where Pragati has authored (Class 6 §3.1–3.3 and Chapter 7). Everywhere else: not inspected.

A, B and C are primary-source verified for every book below. D is not.

## Hierarchy by class

${hierarchyTable()}

${registryLagParagraph()}

## Current NCERT textbooks

${table(
  ['Class', 'Book', 'Part', 'Printed as', 'ISBN', 'First edition', 'Latest printing recorded', 'Current applicability', 'Chapters', 'Sections', 'Source', 'SHA-256'],
  books.map((b) => {
    const recs = MASTER_RECORDS.filter((r) => r.sourceId === b.sourceId);
    const first = b.editionHistory[0]?.date ?? '—';
    const latest = b.editionHistory[b.editionHistory.length - 1]?.date ?? '—';
    return [
      `Class ${b.classNumber}`,
      b.title,
      b.part ?? '—',
      b.printedSubtitle ?? '—',
      b.isbn ?? '—',
      first,
      latest,
      b.currentApplicability,
      String(recs.filter((r) => r.level === 'chapter').length),
      b.levels.section === 'primary_source_verified'
        ? String(recs.filter((r) => r.level === 'section').length)
        : cell(b.levels.section === 'not_defined_by_source' ? 'not_defined_by_source' : 'unknown'),
      b.url,
      (b.sha256 ?? '—').slice(0, 16) + '…',
    ];
  })
)}

## CBSE syllabi (Classes 9–12)

A syllabus is a separate hierarchy. Its units are not textbook chapters,
and no unit is linked to a chapter here. The one link a syllabus does
establish is the book it prescribes, quoted as printed.

${table(
  ['Class', 'Document', 'Units', 'Chapters named', 'Topics', 'Prescribed book (as printed)', 'Source', 'SHA-256'],
  syl.map((s) => {
    const c = syllabusCounts(s.classNumber)!;
    return [
      `Class ${s.classNumber}`,
      s.title,
      cell(c.unit),
      cell(c.chapter),
      cell(c.topic),
      s.prescribedBookAsPrinted ?? '—',
      s.url,
      (s.sha256 ?? '—').slice(0, 16) + '…',
    ];
  })
)}

## How book identity was established

${MASTER_EVIDENCE.portal.method}

- Portal: ${MASTER_EVIDENCE.portal.url} (retrieved ${MASTER_EVIDENCE.portal.retrievedOn})
- ${MASTER_EVIDENCE.portal.robotsTxt}

## What each source establishes — and what it does not

${books
  .map(
    (b) =>
      `- **Class ${b.classNumber} — ${b.title}${b.part ? ` (${b.part})` : ''}.** Establishes: title, edition history, chapter list` +
      `${b.levels.section === 'primary_source_verified' ? ', numbered sections' : ''}` +
      `${b.levels.subsection === 'primary_source_verified' ? ', numbered sub-sections' : ''}. ` +
      `${b.levelEvidence} Does not establish: the page-level mathematical intent of any section` +
      `${b.classNumber === 6 ? ' outside the authored ones' : ''}, or any correspondence to CBSE units.`
  )
  .join('\n')}

## Findings

${findingsList()}
`;
}

// ---------------------------------------------------------------------------
// STRUCTURE_VERIFICATION_BACKLOG.md
// ---------------------------------------------------------------------------

export function renderStructureBacklogDocument(version: string): string {
  const partial = CLASS_NUMBERS.filter((n) => classStructureStatus(n) !== 'complete_at_structure_level');
  const complete = CLASS_NUMBERS.filter((n) => classStructureStatus(n) === 'complete_at_structure_level');
  const openLevels = MASTER_SOURCES.flatMap((s) =>
    (Object.entries(s.levels) as Array<[string, string]>)
      .filter(([, v]) => v === 'unknown' || v === 'partially_enumerated')
      .map(([lvl, v]) => [`Class ${s.classNumber}`, `${s.title}${s.part ? ` (${s.part})` : ''}`, lvl, v === 'unknown' ? 'UNKNOWN' : 'partially enumerated — count UNKNOWN'])
  );
  return `# Structure Verification Backlog — Classes 1–12

${STAMP(version)}

---

**${complete.length} of 12 classes are complete at structure level. ${partial.length} ${partial.length === 1 ? 'is' : 'are'} not: Class ${partial.join(', ')}.**

Complete at structure level means: the current book was identified from
the NCERT portal, its current printing was read from the imprint, and
every chapter and every numbered section the source defines was read
from the primary document. It does NOT mean the mathematical intent of
each section has been inspected — that happens per section, before
authoring.

## Hierarchy by class

${hierarchyTable()}

${registryLagParagraph()}

## Open structure evidence

${openLevels.length === 0 ? 'None.' : table(['Class', 'Source', 'Level', 'State'], openLevels)}

## Findings to resolve or accept

${findingsList()}

## Intent inspection backlog

${table(
  ['Class', 'Authoring records', 'Page-level intent inspected', 'Not yet inspected'],
  CLASS_NUMBERS.map((n) => {
    const u = authoringUnits(n);
    const i = u.filter((r) => r.intentStatus === 'page_level_inspected').length;
    return [`Class ${n}`, String(u.length), String(i), String(u.length - i)];
  })
)}

Structure verified is not the same claim as intent inspected. A section
must have its primary pages read before any lesson is authored for it —
the rule learned from Number Play.
`;
}

// ---------------------------------------------------------------------------
// CURRICULUM_MASTER_MAP.md and .json
// ---------------------------------------------------------------------------

function recordRow(r: MasterRecord): string[] {
  const s = productStatus(r);
  return [
    r.recordId,
    r.level,
    r.number ?? '—',
    r.title + (r.descriptor ? ` (${r.descriptor})` : ''),
    r.startPage === null ? '—' : String(r.startPage) + (r.registryStartPage !== null ? ` (registry: ${r.registryStartPage})` : ''),
    r.intentStatus === 'page_level_inspected' ? 'inspected' : 'not inspected',
    s.learn,
    s.practice,
    s.review,
    s.publication,
    r.nonInstructional ? 'non-instructional' : '',
  ];
}

export function renderMasterMapDocument(version: string): string {
  const sections = CLASS_NUMBERS.map((n) => {
    const srcs = sourcesForClass(n);
    return `## Class ${n}

${srcs
  .map((s) => {
    const recs = MASTER_RECORDS.filter((r) => r.sourceId === s.sourceId);
    return `### ${s.kind === 'syllabus' ? 'CBSE syllabus' : 'NCERT textbook'}: ${s.title}${s.part ? ` — ${s.part}` : ''}

${s.printedSubtitle ? `Printed as: ${s.printedSubtitle}. ` : ''}Applicability: ${s.currentApplicability}. Source: ${s.url}. Inspected ${s.inspectedOn}.
Levels — ${(Object.entries(s.levels) as Array<[string, string]>).map(([k, v]) => `${k}: ${v}`).join('; ')}.

${table(
  ['Record', 'Level', 'No.', 'Title', 'Start page', 'Intent', 'Learn', 'Practice', 'Review', 'Publication', 'Note'],
  recs.map(recordRow)
)}`;
  })
  .join('\n\n')}`;
  }).join('\n\n');

  return `# Curriculum Master Map — Mathematics, Classes 1–12

${STAMP(version)}

This map answers **what should exist**. It does not mean Pragati already
teaches it. Every official record is listed whether or not Pragati has
any content for it.

${headlineSentence()}

${hierarchyTable()}

${registryLagParagraph()}

Machine-readable form: \`CURRICULUM_MASTER_MAP.json\` (same data, generated
from the same model). Primary evidence: \`src/curriculum/data/mathCurriculumMasterEvidence.json\`,
reproducible with \`curriculum-verification/master-map/tools/\`.

${sections}
`;
}

export function renderMasterMapJson(version: string): string {
  return (
    JSON.stringify(
      {
        generatedFrom: 'src/curriculum/curriculumMasterMap.ts',
        version,
        sources: MASTER_SOURCES,
        records: MASTER_RECORDS.map((r) => ({ ...r, product: productStatus(r) })),
        classes: CLASS_NUMBERS.map((n) => ({
          classNumber: n,
          textbook: textbookCounts(n),
          syllabus: syllabusCounts(n),
          textbookDenominatorKnown: textbookDenominatorKnown(n),
          structureStatus: classStructureStatus(n),
          gaps: gapReport(n),
        })),
        registryLagClasses: registryLagClasses(),
        findings: MASTER_EVIDENCE.findings,
      },
      null,
      1
    ) + '\n'
  );
}

// ---------------------------------------------------------------------------
// CONTENT_BACKLOG.md — the production backlog (generated, not executed)
// ---------------------------------------------------------------------------

export function renderProductionBacklogSection(): string {
  const entries = productionBacklog();
  const t = totals();
  return `## Headline

${headlineSentence()}

| | |
|---|---|
| Authoring records in the backlog | ${entries.length} |
| Classes whose total is UNKNOWN | ${t.unknownClasses.length ? t.unknownClasses.map((n) => `Class ${n}`).join(', ') : 'none'} |
| Learn missing | ${entries.filter((e) => e.status.learn === 'missing').length} |
| Practice missing | ${entries.filter((e) => e.status.practice === 'missing').length} |
| Not yet reviewed | ${entries.filter((e) => !e.status.reviewed).length} |

The backlog is generated from the master map. Every verified authoring
record of every class is in it; none is dropped for being inconvenient.
It is a plan, **not** a work order: no record is authored until its
wave's gate is met and its primary pages are read.

## Content gap report

${gapReportTable()}

## Recommended production sequence

${table(
  ['Wave', 'Classes', 'Records', 'Why this order', 'Gate before starting'],
  PRODUCTION_WAVES.map((w) => [
    String(w.wave),
    w.classes.map((n) => `Class ${n}`).join(', '),
    String(entries.filter((e) => e.wave === w.wave).length),
    w.reason,
    w.gate,
  ])
)}

## The backlog, record by record

${table(
  ['Wave', 'Class', 'Book', 'No.', 'Title', 'Learn', 'Practice', 'Review'],
  entries.map((e) => [
    String(e.wave),
    `Class ${e.record.classNumber}`,
    MASTER_SOURCES.find((s) => s.sourceId === e.record.sourceId)!.title +
      (e.record.bookPart ? ` (${e.record.bookPart})` : ''),
    e.record.number ?? '—',
    e.record.title,
    e.status.learn,
    e.status.practice,
    e.status.review,
  ])
)}`;
}
