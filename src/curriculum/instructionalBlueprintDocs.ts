// v0.84.0 — THE INSTRUCTIONAL BLUEPRINT, RENDERED FROM THE DECOMPOSITION.
//
// The blueprint answers "what must Pragati teach?" — it does NOT say
// Pragati teaches it. Official structure stays in the curriculum master
// map; this layer only adds Pragati's own teaching units and links back.

import {
  CLASS_DECOMPOSITION_PROGRESS,
  NON_INSTRUCTIONAL_RECORDS,
  PRAGATI_INSTRUCTIONAL_UNITS,
  recordIsCovered,
  unitsForClass,
  type PragatiInstructionalUnit,
} from './instructionalUnits';
import {
  CLASS_NUMBERS,
  authoringUnits,
  productStatus,
  textbookCounts,
  textbookDenominatorKnown,
} from './curriculumMasterMap';
import { table, cell } from './masterMapDocs';

const progressFor = (n: number) =>
  CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === n);

/** Per class: what the source has, what was read, what came out of it. */
export function blueprintClassRows(): string[][] {
  return CLASS_NUMBERS.map((n) => {
    const p = progressFor(n);
    const units = unitsForClass(n);
    const records = authoringUnits(n);
    const learn = records.filter((r) => productStatus(r).learn === 'authored').length;
    const c = textbookCounts(n);
    return [
      `Class ${n}`,
      cell(c.chapter) + (textbookDenominatorKnown(n) ? '' : ' (Part I only; total UNKNOWN)'),
      cell(c.section),
      p ? `${p.pagesIndexed ?? p.pagesInspected} indexed / ${p.pagesFullyInspected} full text / ${p.visualPagesInspected ?? 0} visual` : '0',
      p ? String(units.length) : 'NOT STARTED',
      String(units.filter((u) => u.decompositionStatus === 'READY_FOR_AUTHORING').length),
      String(units.filter((u) => u.humanReviewStatus === 'flagged_for_review').length),
      String(units.filter((u) => u.intentInspectionStatus === 'BLOCKED_SOURCE').length),
      String(learn),
      p ? String(units.length - learn) : 'UNKNOWN',
      p ? p.status : 'NOT_STARTED',
    ];
  });
}

export function blueprintTable(): string {
  return table(
    ['Class', 'Official chapters', 'Official sections', 'Pages (indexed / full text / visual)', 'Pragati units drafted', 'Ready for authoring', 'Needs human check', 'Blocked', 'Existing Learn mapped', 'Missing Learn', 'Decomposition'],
    blueprintClassRows()
  );
}

function unitBlock(u: PragatiInstructionalUnit): string {
  const e = u.sourceEvidence;
  return `#### ${u.instructionalTitle}

- **Id** \`${u.instructionalUnitId}\` — Pragati-created teaching unit, not an NCERT section.
- **Serves** \`${u.officialRecordId}\`${u.additionalOfficialRecordIds.length ? ` (also ${u.additionalOfficialRecordIds.join(', ')})` : ''}
- **Evidence depth** ${e.evidenceDepth}${e.visuallyDependent ? ` · visually dependent · pages looked at: ${e.visualPagesInspected.length ? e.visualPagesInspected.join(', ') : 'none yet'}` : ''}
- **Source** ${e.bookId}${e.bookPart ? ` ${e.bookPart}` : ''}, printed pp. ${e.printedPageStart ?? '—'}–${e.printedPageEnd ?? '—'} (PDF pp. ${e.pdfPageStart}–${e.pdfPageEnd}), read ${e.inspectedOn}. Establishes: ${e.establishes}
- **Objective** ${u.mathematicalObjective}
- **Student can** ${u.studentCanStatement}
- **Mathematical ideas** ${u.mathematicalIdeas.join('; ')}
- **Representations** ${u.representationsNeeded.join('; ')}
- **Prerequisites** ${u.prerequisites.length ? u.prerequisites.join('; ') : 'none recorded'}
- **Role** ${u.instructionalRole} · **reasoning** ${u.reasoningDemand} · **complexity** ${u.estimatedInstructionalComplexity}/5
- **Misconception evidence** ${u.likelyMisconceptionsStatus}
- **Status** intent ${u.intentInspectionStatus} · decomposition ${u.decompositionStatus} · review ${u.humanReviewStatus}${u.splitReason ? `\n- **Why this split** ${u.splitReason}` : ''}${u.notes ? `\n- **Note** ${u.notes}` : ''}`;
}

export function renderBlueprintMarkdown(version: string): string {
  const done = CLASS_DECOMPOSITION_PROGRESS.filter((p) => p.status !== 'NOT_STARTED');
  return `# Instructional master blueprint — Classes 1–12

**Generated** from \`src/curriculum/instructionalUnits.ts\` at ${version}. Do not
hand-edit.

This blueprint says what Pragati must **teach**. It does not say Pragati
teaches it. Every unit below is **Pragati-created** and points back at the
official record it serves; no unit is an NCERT section, and no official
record was altered to make authoring tidier.

**Evidence vocabulary.** *Indexed* means headings and opening text only —
navigation, not inspection. *Full text* means every page's extracted text
was read. *Visual* means the page was rendered and looked at, which
early-primary mathematics usually needs. A unit is authoring-ready only
when its whole range is full text and, where the mathematics lives in the
visuals, those pages were seen.

**Read so far:** ${done.map((p) => `Class ${p.classNumber}`).join(', ') || 'none'}. Every other class is
NOT STARTED — its unit count is unknown, not zero.

${blueprintTable()}

${CLASS_NUMBERS.filter((n) => unitsForClass(n).length > 0)
  .map((n) => {
    const p = progressFor(n)!;
    return `## Class ${n}

${p.note}

${unitsForClass(n)
  .map(
    (u) => unitBlock(u)
  )
  .join('\n\n')}`;
  })
  .join('\n\n')}

## Records read and found non-instructional

${NON_INSTRUCTIONAL_RECORDS.length === 0
  ? 'None recorded.'
  : NON_INSTRUCTIONAL_RECORDS.map(
      (r) =>
        `- **${r.officialRecordId}** (${r.grade}) — ${r.role}. ${r.justification} Pages ${r.sourceEvidence.printedPageStart}–${r.sourceEvidence.printedPageEnd}.`
    ).join('\n')}
`;
}

export function renderBlueprintJson(version: string): string {
  return (
    JSON.stringify(
      {
        generatedFrom: 'src/curriculum/instructionalUnits.ts',
        version,
        classProgress: CLASS_DECOMPOSITION_PROGRESS,
        units: PRAGATI_INSTRUCTIONAL_UNITS,
        nonInstructional: NON_INSTRUCTIONAL_RECORDS,
      },
      null,
      1
    ) + '\n'
  );
}

export function renderDecompositionGapReport(version: string): string {
  const started = CLASS_DECOMPOSITION_PROGRESS.map((p) => p.classNumber);
  const uncovered = CLASS_NUMBERS.filter((n) => started.includes(n)).flatMap((n) =>
    authoringUnits(n).filter((r) => !recordIsCovered(r.recordId))
  );
  return `# Instructional decomposition — gap report

**Generated** at ${version}.

Eight states, and they are not the same thing: STRUCTURE COMPLETE, INTENT
INSPECTED, DECOMPOSITION COMPLETE, READY FOR AUTHORING, LEARN COMPLETE,
PRACTICE COMPLETE, REVIEWED, PUBLISHED. This report is about the first
four. Pragati's learning content is **not** complete, and a blueprint
does not make it so.

${blueprintTable()}

## Official records in a read class with no decomposition record

${uncovered.length === 0
  ? 'None: every official record in every class read so far is served by at least one unit or is recorded as non-instructional.'
  : uncovered.map((r) => `- ${r.recordId} — ${r.title}`).join('\n')}

## Classes not yet read

${CLASS_NUMBERS.filter((n) => !started.includes(n))
  .map(
    (n) =>
      `- **Class ${n}** — ${cell(textbookCounts(n).chapter)} official chapters. Units required: **UNKNOWN**. One chapter is not assumed to be one lesson, so no count is implied by the chapter total.`
  )
  .join('\n')}
`;
}

export function renderInstructionalBacklog(version: string): string {
  const ready = PRAGATI_INSTRUCTIONAL_UNITS.filter(
    (u) => u.decompositionStatus === 'READY_FOR_AUTHORING'
  );
  const held = PRAGATI_INSTRUCTIONAL_UNITS.filter(
    (u) => u.decompositionStatus !== 'READY_FOR_AUTHORING'
  );
  const batches: string[][] = [];
  for (let i = 0; i < ready.length; i += 8) {
    const b = ready.slice(i, i + 8);
    batches.push([
      String(batches.length + 1),
      `Class ${b[0].classNumber}`,
      String(b.length),
      b.map((u) => u.instructionalTitle).join('; '),
    ]);
  }
  return `# Instructional production backlog

**Generated** at ${version}. Generated, **not started**: authoring begins
only on your approval.

${ready.length} units are READY_FOR_AUTHORING and ${held.length} are held back
(draft decomposition or flagged for human judgement). The classes not yet
read contribute an **UNKNOWN** number of further units — that total is not
guessed from chapter counts.

## Proposed batches

A batch is sized for one round of source-alignment, mathematical and
pedagogical QA plus human review — not for convenience of generation.

${table(['Batch', 'Class', 'Units', 'Units in the batch'], batches)}

## Held back

${held
  .map(
    (u) =>
      `- \`${u.instructionalUnitId}\` — ${u.instructionalTitle} (${u.decompositionStatus}${u.humanReviewStatus === 'flagged_for_review' ? ', flagged for human check' : ''}). ${u.notes ?? ''}`
  )
  .join('\n')}
`;
}
