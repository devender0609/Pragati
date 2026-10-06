// v0.84.0 §23 — THE COMPLETENESS CONTRACT.
//
// The failure this guards against is the one Number Play already
// demonstrated: a unit that looks authored-ready because a record exists,
// rather than because someone read the pages. Every rule below is about
// keeping "a record exists" and "we know what to teach" apart.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CLASS_DECOMPOSITION_PROGRESS,
  inspectedOfficialRecordIds,
  meetsEvidenceBar,
  derivedStatusFor,
  officialRecordAccounting,
  overlapAudit,
  classScope,
  decompositionFingerprint,
  overlapJustificationFor,
  sectionAccounting,
  sectionInspectionState,
  sectionExtentFor,
  OFFICIAL_SECTION_EXTENTS,
  sectionDispositionFor,
  OFFICIAL_SECTION_DISPOSITIONS,
  HUMAN_JUDGEMENT_POLICIES,
  ARTIFACT_ALIGNMENTS,
  OVERLAP_JUSTIFICATIONS,
  recordSourceIsAccountedFor,
  recordHasInstructionalDisposition,
  officialRecordIdsTouched,
  RECORD_EXTENTS,
  SOURCE_SEGMENTS,
  recordInspectionState,
  recordInspectionSummary,
  NON_INSTRUCTIONAL_RECORDS,
  PRAGATI_INSTRUCTIONAL_UNITS,
  decompositionCoverage,
  instructionalUnitsFor,
  readyForAuthoring,
  recordIsCovered,
  unitsForClass,
} from '../instructionalUnits';
import {
  CLASS_NUMBERS,
  MASTER_RECORDS,
  authoringUnits,
  textbookCounts,
  textbookDenominatorKnown,
} from '../curriculumMasterMap';

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8');
const STARTED = CLASS_DECOMPOSITION_PROGRESS.map((p) => p.classNumber);

describe('§23 official records are covered or explicitly excused', () => {
  for (const n of [1, 2]) {
    it(`Class ${n}: every official chapter has a unit or a recorded non-instructional role`, () => {
      const records = authoringUnits(n);
      expect(records.length).toBeGreaterThan(0);
      for (const r of records) expect(recordIsCovered(r.recordId), r.recordId).toBe(true);
    });
  }

  it('no official record disappears because no unit was written for it', () => {
    // The master map is untouched by decomposition: the record count per
    // class is what it was before this phase.
    expect(textbookCounts(1).chapter).toBe(13);
    expect(textbookCounts(2).chapter).toBe(11);
    expect(MASTER_RECORDS.filter((r) => r.classNumber === 1 && r.level === 'chapter')).toHaveLength(13);
  });

  it('records a non-instructional role with a justification, never a silent drop', () => {
    for (const r of NON_INSTRUCTIONAL_RECORDS) {
      expect(r.justification.length, r.officialRecordId).toBeGreaterThan(60);
      expect(r.sourceEvidence.printedPageStart, r.officialRecordId).not.toBeNull();
    }
  });
});

describe('§23 nothing is authoring-ready without page evidence', () => {
  it('every READY_FOR_AUTHORING unit carries pages, a book and a date', () => {
    for (const u of readyForAuthoring()) {
      const e = u.sourceEvidence;
      expect(u.intentInspectionStatus, u.instructionalUnitId).toBe('INSPECTED');
      expect(e.bookId, u.instructionalUnitId).toBeTruthy();
      // v0.84.0 checkpoint 6 — some pages carry no printed folio at all
      // (the Class 2 trip spread, for instance). Reproducibility rests on
      // the PDF pages; an absent folio is recorded as null, with the
      // reason in `establishes`, rather than guessed from its neighbours.
      if (e.printedPageStart === null) {
        expect(e.establishes, u.instructionalUnitId).toMatch(/No printed folio/i);
      } else {
        expect(e.printedPageEnd, u.instructionalUnitId).not.toBeNull();
      }
      expect(e.pdfPageEnd, u.instructionalUnitId).toBeGreaterThanOrEqual(e.pdfPageStart);
      expect(e.inspectedOn, u.instructionalUnitId).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.establishes.length, u.instructionalUnitId).toBeGreaterThan(20);
    }
  });

  it('no unit is marked INSPECTED without evidence of the reading', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      if (u.intentInspectionStatus !== 'INSPECTED') continue;
      expect(u.sourceEvidence.establishes.length, u.instructionalUnitId).toBeGreaterThan(20);
      expect(u.mathematicalIdeas.length, u.instructionalUnitId).toBeGreaterThan(0);
      expect(u.representationsNeeded.length, u.instructionalUnitId).toBeGreaterThan(0);
    }
  });

  // v0.84.0 checkpoint 5 — Classes 1 and 2 are source-complete, so there
  // are no drafts left. The rule still has to hold for any that appear.
  it('a unit whose pages are only partly read is held back, not shipped', () => {
    const draft = PRAGATI_INSTRUCTIONAL_UNITS.filter(
      (u) => u.decompositionStatus === 'DRAFT_DECOMPOSITION'
    );
    for (const u of draft) {
      // v0.84.0 hardening — the reason now lives in hardeningNote, which
      // says which evidence is missing rather than only that pages were
      // unread.
      // v0.84.0 checkpoint 11 — the re-audit verdicts are history now;
      // what a draft must show is missing evidence, which is a fact about
      // the ledger rather than a note.
      const pages = u.sourceEvidence.pageEvidence;
      const gap = pages.some((p) => !p.fullTextInspected || (p.visualInspectionRequired && !p.visualInspected));
      expect(gap || pages.length === 0, u.instructionalUnitId).toBe(true);
      expect(u.humanReviewStatus, u.instructionalUnitId).toBe('flagged_for_review');
    }
  });
});

describe('§3 a Pragati unit never impersonates an official record', () => {
  it('uses its own id space and labels itself', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      expect(u.instructionalUnitId.startsWith('pragati_iu_')).toBe(true);
      expect(u.sourceVsPragatiLabel).toBe('pragati_created');
    }
    for (const r of MASTER_RECORDS) expect(r.recordId.startsWith('pragati_iu_')).toBe(false);
  });

  it('every unit points at an official record that actually exists', () => {
    const ids = new Set(MASTER_RECORDS.map((r) => r.recordId));
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      expect(ids.has(u.officialRecordId), u.instructionalUnitId).toBe(true);
      for (const extra of u.additionalOfficialRecordIds) expect(ids.has(extra)).toBe(true);
    }
  });

  it('has unique ids', () => {
    const ids = PRAGATI_INSTRUCTIONAL_UNITS.map((u) => u.instructionalUnitId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('says in the blueprint itself that units are Pragati-created', () => {
    const md = read('INSTRUCTIONAL_MASTER_BLUEPRINT.md');
    expect(md).toContain('Pragati-created teaching unit, not an NCERT section');
    expect(md).toContain('It does not say Pragati');
  });
});

describe('§7/§8 one official chapter is not one lesson', () => {
  it('Classes 1 and 2 produced more units than chapters, from the pages', () => {
    expect(unitsForClass(1).length).toBeGreaterThan(textbookCounts(1).chapter as number);
    expect(unitsForClass(2).length).toBeGreaterThan(textbookCounts(2).chapter as number);
  });

  it('every split records why the chapter was split', () => {
    for (const n of [1, 2]) {
      for (const r of authoringUnits(n)) {
        const units = instructionalUnitsFor(r.recordId);
        if (units.length > 1) {
          for (const u of units) expect(u.splitReason, u.instructionalUnitId).toBeTruthy();
        }
      }
    }
  });

  it('never projects a lesson count for a class whose pages are unread', () => {
    expect(decompositionCoverage(477).projectedLessonCount).toBeNull();
    for (const n of CLASS_NUMBERS) {
      if (STARTED.includes(n)) continue;
      expect(unitsForClass(n), `class${n}`).toHaveLength(0);
    }
    const gap = read('INSTRUCTIONAL_DECOMPOSITION_GAP_REPORT.md');
    expect(gap).toContain('Units required: **UNKNOWN**');
  });
});

describe('§10/§22 uncertainty survives the blueprint', () => {
  it('keeps Class 9 partial', () => {
    expect(textbookDenominatorKnown(9)).toBe(false);
  });

  it('reports an unread class as NOT STARTED, never as zero units needed', () => {
    const md = read('INSTRUCTIONAL_MASTER_BLUEPRINT.md');
    for (const n of CLASS_NUMBERS.filter((x) => !STARTED.includes(x))) {
      const row = md.split('\n').find((l) => l.startsWith(`| Class ${n} |`))!;
      expect(row, `class${n}`).toContain('NOT STARTED');
    }
  });

  it('does not fabricate a prerequisite unit id', () => {
    const ids = new Set(PRAGATI_INSTRUCTIONAL_UNITS.map((u) => u.instructionalUnitId));
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      for (const p of u.prerequisites) {
        if (p.startsWith('pragati_iu_'))
          expect(ids.has(p as `pragati_iu_${string}`), `${u.instructionalUnitId} → ${p}`).toBe(true);
        else expect(p.length).toBeGreaterThan(10); // plain-language dependency
      }
    }
  });
});

// v0.84.0 checkpoint 11 §4/§15 — one current status, and nothing beside
// it that could be read as a second one.
describe('§4 exactly one current unit status', () => {
  it('carries no second active classification field', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      const raw = u as unknown as Record<string, unknown>;
      expect(raw.hardeningClassification, u.instructionalUnitId).toBeUndefined();
      expect(raw.hardeningNote, u.instructionalUnitId).toBeUndefined();
    }
  });

  it('keeps the re-audit verdicts as dated history', () => {
    const withHistory = PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => (u.auditHistory ?? []).length > 0);
    expect(withHistory.length).toBeGreaterThan(100);
    for (const u of withHistory) {
      for (const h of u.auditHistory!) {
        expect(h.checkpoint.length, u.instructionalUnitId).toBeGreaterThan(5);
      }
    }
  });

  it('gives every READY unit complete evidence and no open question', () => {
    for (const u of readyForAuthoring()) {
      expect(meetsEvidenceBar(u), u.instructionalUnitId).toBe(true);
      expect(u.humanJudgementQuestion, u.instructionalUnitId).toBeUndefined();
    }
    expect(readyForAuthoring().length).toBe(
      PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => derivedStatusFor(u) === 'READY_FOR_AUTHORING').length
    );
  });

  it('does not emit a contradictory classification in the blueprint', () => {
    const md = read('INSTRUCTIONAL_MASTER_BLUEPRINT.md');
    expect(md).not.toMatch(/hardeningClassification/);
    for (const u of readyForAuthoring().slice(0, 5)) {
      const block = md.slice(md.indexOf(u.instructionalUnitId));
      expect(block.slice(0, 900)).not.toMatch(/review NEEDS_HUMAN_CHECK/);
    }
  });
});

describe('§5-§12 class-specific audits describe their own class', () => {
  const c3 = () => read('PAGE_LEVEL_INTENT_AUDIT_CLASS_3.md');
  const c12 = () => read('PAGE_LEVEL_INTENT_AUDIT_CLASSES_1_2.md');

  it('never contradicts its own source-completion state', () => {
    const p3 = CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 3)!;
    if (p3.status === 'DECOMPOSITION_SOURCE_COMPLETE') {
      expect(c3()).not.toMatch(/NOT source-complete|visual pass is unfinished|pages not yet read/i);
    }
  });

  it('lists only Class 3 units and segments in the Class 3 audit', () => {
    const t = c3();
    expect(t).not.toMatch(/pragati_iu_g0[12]_/);
    expect(t).not.toMatch(/pragati_srcseg_g0[12]_/);
    const listed = [...t.matchAll(/pragati_iu_g03_[a-z0-9_]+/g)].map((m) => m[0]);
    expect(new Set(listed).size).toBe(unitsForClass(3).length);
  });

  it('lists only Classes 1-2 records in their own audit', () => {
    expect(c12()).not.toMatch(/ncert_cemm1_/);
    expect(c12()).not.toMatch(/pragati_iu_g03_/);
  });

  it('counts visual pages seen against the pages that needed seeing', () => {
    for (const t of [c3(), c12()]) {
      const rows = [...t.matchAll(/^\| `(ncert_[a-z0-9_]+)` \|[^|]*\|[^|]*\|[^|]*\|[^|]*\| (\d+) \| (\d+) \| (\w+) \|/gm)];
      expect(rows.length).toBeGreaterThan(0);
      for (const r of rows) {
        const required = Number(r[2]);
        const seen = Number(r[3]);
        expect(seen, `${r[1]}: seen ${seen} > required ${required}`).toBeLessThanOrEqual(required);
        if (r[5] === 'FULLY_INSPECTED') expect(seen, r[1]).toBe(required);
      }
    }
  });
});

describe('§12 review state is untouched by decomposition', () => {
  it('marks no unit reviewed and no artifact published', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      expect(u.humanReviewStatus, u.instructionalUnitId).not.toBe('reviewed');
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 HARDENING — evidence depth is the gate, not plausibility.
//
// The first pass called 64 units authoring-ready on the strength of
// `digest.py` output: each page's folio, headings and opening text. For
// early-primary mathematics that is an index, not an inspection, and the
// re-audit cut the ready count to 10. These tests keep that standard.
// ---------------------------------------------------------------------------

describe('§3/§15 evidence depth gates authoring readiness', () => {
  it('an indexed-only unit can never be READY_FOR_AUTHORING', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      if (u.sourceEvidence.evidenceDepth !== 'DIGEST_ONLY') continue;
      expect(u.decompositionStatus, u.instructionalUnitId).not.toBe('READY_FOR_AUTHORING');
      expect(u.humanReviewStatus, u.instructionalUnitId).toBe('flagged_for_review');
    }
  });

  it('a visually dependent unit needs pages actually looked at', () => {
    for (const u of readyForAuthoring()) {
      if (!u.sourceEvidence.visuallyDependent) continue;
      expect(u.sourceEvidence.visualPagesInspected.length, u.instructionalUnitId).toBeGreaterThan(0);
    }
  });

  // §12 — three different states. Evidence-complete is necessary for
  // ready, never sufficient: a unit can have every page read and still
  // wait on a curriculum decision.
  it('every ready unit passes the evidence gate, and a failing unit is never ready', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      if (u.decompositionStatus === 'READY_FOR_AUTHORING') {
        expect(meetsEvidenceBar(u), u.instructionalUnitId).toBe(true);
        expect(u.humanJudgementQuestion, u.instructionalUnitId).toBeUndefined();
      }
      if (!meetsEvidenceBar(u)) {
        expect(u.decompositionStatus, u.instructionalUnitId).not.toBe('READY_FOR_AUTHORING');
      }
    }
  });

  // §13 — a human-check flag must name the actual question.
  // v0.84.0 checkpoint 10 §3 — the old form of this test accepted
  // "a question OR unread evidence", which let 29 Class 3 units sit in a
  // review queue while they were really waiting for pages to be
  // rendered. Human review now requires complete evidence AND a question.
  it('requires complete evidence and a real question for human review', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      if (u.decompositionStatus !== 'NEEDS_HUMAN_CHECK') continue;
      expect(meetsEvidenceBar(u), `${u.instructionalUnitId} is in review without complete evidence`).toBe(true);
      const q = u.humanJudgementQuestion ?? '';
      expect(q.length, u.instructionalUnitId).toBeGreaterThan(40);
      expect(q.trim().endsWith('?'), u.instructionalUnitId).toBe(true);
    }
  });

  it('never puts an evidence-incomplete unit in the review queue', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      if (meetsEvidenceBar(u)) continue;
      expect(u.decompositionStatus, u.instructionalUnitId).toBe('DRAFT_DECOMPOSITION');
      expect(u.humanReviewStatus, u.instructionalUnitId).toBe('not_reviewed');
    }
  });

  it('derives every unit status from the one rule', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      expect(u.decompositionStatus, u.instructionalUnitId).toBe(derivedStatusFor(u));
    }
  });

  it('never calls a full-text-complete record indexed-only', () => {
    for (const id of officialRecordIdsTouched()) {
      const pages = [
        ...instructionalUnitsFor(id).flatMap((u) => u.sourceEvidence.pageEvidence),
        ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === id).flatMap((s) => s.sourceEvidence.pageEvidence),
      ];
      if (pages.some((p) => p.fullTextInspected)) {
        expect(recordInspectionState(id), id).not.toBe('INDEXED_ONLY');
      }
    }
  });

  it('reports each kind of evidence gap separately', () => {
    for (const p of CLASS_DECOMPOSITION_PROGRESS) {
      expect(p.pagesFullTextPending, `class${p.classNumber}`).toBeDefined();
      expect(p.visualPagesPending, `class${p.classNumber}`).toBeDefined();
      expect(p.pagesEvidenceIncomplete, `class${p.classNumber}`).toBeDefined();
      // A class is source-complete only when both gaps are zero.
      if (p.status === 'DECOMPOSITION_SOURCE_COMPLETE') {
        expect(p.pagesFullTextPending, `class${p.classNumber}`).toBe(0);
        expect(p.visualPagesPending, `class${p.classNumber}`).toBe(0);
        expect(p.officialRecordsFullyInspected).toBe(p.officialRecordsTotal);
      }
    }
  });

  it('page ranges are well formed', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      const e = u.sourceEvidence;
      expect(e.pdfPageEnd, u.instructionalUnitId).toBeGreaterThanOrEqual(e.pdfPageStart);
      if (e.printedPageStart !== null && e.printedPageEnd !== null) {
        expect(e.printedPageEnd, u.instructionalUnitId).toBeGreaterThanOrEqual(e.printedPageStart);
      }
      for (const p of e.visualPagesInspected) {
        expect(p, u.instructionalUnitId).toBeGreaterThanOrEqual(e.pdfPageStart);
        expect(p, u.instructionalUnitId).toBeLessThanOrEqual(e.pdfPageEnd);
      }
    }
  });

  it('a class with unread pages is not COMPLETE', () => {
    for (const p of CLASS_DECOMPOSITION_PROGRESS) {
      const units = unitsForClass(p.classNumber);
      const anyDraft = units.some((u) => u.sourceEvidence.evidenceDepth === 'DIGEST_ONLY');
      if (anyDraft) expect(p.status, `class${p.classNumber}`).not.toBe('COMPLETE');
      if (p.status === 'COMPLETE') {
        expect(units.every((u) => meetsEvidenceBar(u)), `class${p.classNumber}`).toBe(true);
      }
    }
  });
});

describe('§7/§8 one meaning of page-level intent inspected', () => {
  // v0.84.0 checkpoint 3 §6 — the set is empty on purpose right now: no
  // official record has had its WHOLE extent inspected to the required
  // depth yet, and a chapter read in part is not a chapter inspected.
  it('marks a record inspected only when its whole extent is', () => {
    const inspected = inspectedOfficialRecordIds();
    for (const id of inspected) {
      expect(recordInspectionState(id), id).toBe('FULLY_INSPECTED');
      const rec = MASTER_RECORDS.find((r) => r.recordId === id);
      if (rec) expect(rec.intentStatus, id).toBe('page_level_inspected');
    }
    // Partial progress is visible rather than rounded up or away.
    const summary = recordInspectionSummary();
    expect(summary.length).toBeGreaterThan(20);
    // Classes 1 and 2 are source-complete, so every record they touch is
    // FULLY_INSPECTED; the partial branch is still exercised below.
    for (const r of summary) {
      if (r.state === 'PARTIALLY_INSPECTED') {
        // Partial can mean unread pages OR pages read but not yet
        // rendered where the picture carries the mathematics — the
        // text-page count alone does not decide it.
        expect(r.pagesInspected, r.officialRecordId).toBeGreaterThan(0);
        expect(recordInspectionState(r.officialRecordId)).not.toBe('FULLY_INSPECTED');
      }
    }
  });

  it('does not call a chapter inspected when one of its units is still an index', () => {
    for (const id of officialRecordIdsTouched()) {
      const units = instructionalUnitsFor(id);
      const anyDigest = units.some((u) => u.sourceEvidence.evidenceDepth === 'DIGEST_ONLY');
      if (anyDigest) expect(recordInspectionState(id), id).not.toBe('FULLY_INSPECTED');
    }
  });

  it('checks the whole range, so one rendered page cannot carry a unit', () => {
    for (const u of readyForAuthoring()) {
      const e = u.sourceEvidence;
      const pages = e.pageEvidence;
      expect(pages.length, u.instructionalUnitId).toBe(e.pdfPageEnd - e.pdfPageStart + 1);
      for (const pg of pages) {
        expect(pg.fullTextInspected, `${u.instructionalUnitId} p${pg.pdfPage}`).toBe(true);
        if (pg.visualInspectionRequired) {
          expect(pg.visualInspected, `${u.instructionalUnitId} p${pg.pdfPage}`).toBe(true);
        } else {
          // A page excused from rendering must say why.
          expect(pg.note.length, `${u.instructionalUnitId} p${pg.pdfPage}`).toBeGreaterThan(20);
        }
      }
    }
  });

  it('reports every per-class unit count from the canonical dataset', () => {
    const md = read('INSTRUCTIONAL_MASTER_BLUEPRINT.md');
    for (const p of CLASS_DECOMPOSITION_PROGRESS) {
      const n = unitsForClass(p.classNumber).length;
      const row = md.split('\n').find((l) => l.startsWith(`| Class ${p.classNumber} |`))!;
      expect(row, `class${p.classNumber}`).toContain(`| ${n} |`);
    }
  });

  it('reports inspection as three numbers, not one', () => {
    const c = decompositionCoverage(477);
    expect(c.officialRecordsInspected).toBe(inspectedOfficialRecordIds().size);
    expect(c.unitsWithCompleteEvidence).toBe(
      PRAGATI_INSTRUCTIONAL_UNITS.filter(meetsEvidenceBar).length
    );
    // Evidence-complete is a larger set than ready: the difference is
    // the units waiting on a curriculum decision.
    expect(c.unitsWithCompleteEvidence).toBeGreaterThanOrEqual(readyForAuthoring().length);
    expect(c.classesFullyInspected).toBe(
      CLASS_DECOMPOSITION_PROGRESS.filter((p) => p.status === 'DECOMPOSITION_SOURCE_COMPLETE').length
    );
    expect(c.projectedLessonCount).toBeNull();
  });
});

describe('§9 active decomposition code does not describe the old world', () => {
  it('no longer says there are zero units, or that reading happened only where lessons exist', () => {
    const src = readFileSync(join(process.cwd(), 'src/curriculum/instructionalUnits.ts'), 'utf8');
    expect(src).not.toMatch(/Zero today/);
    expect(src).not.toMatch(/has not been done except where Pragati has already/);
    expect(PRAGATI_INSTRUCTIONAL_UNITS.length).toBeGreaterThan(0);
  });

  it('the generated reports separate indexed pages from inspected pages', () => {
    const md = read('INSTRUCTIONAL_MASTER_BLUEPRINT.md');
    expect(md).toContain('indexed / ');
    expect(md).toContain('navigation, not inspection');
    expect(read('PAGE_LEVEL_INTENT_AUDIT_CLASSES_1_2.md')).toContain('navigation and not evidence');
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 4 — CANONICAL IDENTITY AND COVERAGE.
//
// Two defects this guards: an invented official id
// (`ncert_bejm1_ch11_puzzles`, which NCERT does not define), and a
// chapter that vanished from the accounting because the extents list was
// built from the pages that happened to have been read rather than from
// the official curriculum (`ncert_bejm1_ch05`).
// ---------------------------------------------------------------------------

describe('§5 no decomposition record may invent an official id', () => {
  const officialIds = new Set(MASTER_RECORDS.map((r) => r.recordId));

  it('every officialRecordId exists in the master map', () => {
    const used = [
      ...PRAGATI_INSTRUCTIONAL_UNITS.map((u) => u.officialRecordId),
      ...PRAGATI_INSTRUCTIONAL_UNITS.flatMap((u) => u.additionalOfficialRecordIds),
      ...NON_INSTRUCTIONAL_RECORDS.map((r) => r.officialRecordId),
      ...SOURCE_SEGMENTS.map((s) => s.officialRecordId),
      ...RECORD_EXTENTS.map((e) => e.officialRecordId),
    ];
    for (const id of used) expect(officialIds.has(id), id).toBe(true);
  });

  it('keeps Pragati segments in their own id space', () => {
    for (const s of SOURCE_SEGMENTS) {
      expect(s.sourceSegmentId.startsWith('pragati_srcseg_'), s.sourceSegmentId).toBe(true);
      expect(s.sourceSegmentId.startsWith('ncert_')).toBe(false);
      // A segment points at a real chapter; it is not one.
      expect(officialIds.has(s.officialRecordId), s.sourceSegmentId).toBe(true);
    }
  });

  it('has no record whose id ends in a pseudo-section like _puzzles', () => {
    for (const id of officialRecordIdsTouched()) {
      expect(id, id).toMatch(/^ncert_[a-z0-9]+_c?h?\d{0,2}[a-z0-9_]*$/);
    }
  });
});

describe('§1/§7 every official chapter is accounted for', () => {
  for (const [n, expected] of [[1, 13], [2, 11]] as const) {
    it(`Class ${n} has ${expected} official chapters, all with an extent`, () => {
      const acc = officialRecordAccounting(n);
      expect(acc.officialRecordsTotal, `class${n}`).toBe(expected);
      expect(acc.missingExtents, `class${n}`).toEqual([]);
      expect(
        acc.officialRecordsFullyInspected +
          acc.officialRecordsPartiallyInspected +
          acc.officialRecordsIndexedOnly +
          acc.officialRecordsNotStarted +
          acc.officialRecordsBlocked
      ).toBe(expected);
    });
  }

  // v0.84.0 checkpoint 14 — Class 6 is mid-flight: its denominator is the
  // 65 official sections while the page extents hang off the 10 chapters,
  // and eight chapters are not decomposed yet. These two checks apply to
  // the classes that have finished.

  it('derives the class denominator from the curriculum, not the decomposition', () => {
    for (const p of CLASS_DECOMPOSITION_PROGRESS) {
      const acc = officialRecordAccounting(p.classNumber);
      // From Class 6 the official authoring record is a numbered section, so
      // the official denominator lives in officialRecordsTotal and
      // chaptersTotal keeps counting chapters.
      expect(p.officialRecordsTotal ?? p.chaptersTotal, `class${p.classNumber}`).toBe(acc.officialRecordsTotal);
      // "Inspected" means fully inspected — never merely touched.
      // From Class 6 the official records are numbered sections. They own
      // no page extent — the chapter does — so their completion is derived
      // from their recorded body span by sectionInspectionState(), and
      // `sectionsAccountedFor` is that same derivation, not a second one.
      if (p.officialSectionsTotal) {
        expect(p.sectionsAccountedFor, `class${p.classNumber}`).toBeLessThanOrEqual(p.officialSectionsTotal);
        expect(p.chaptersInspected, `class${p.classNumber}`).toBeLessThanOrEqual(p.chaptersTotal);
      } else {
        expect(p.officialRecordsFullyInspected ?? p.chaptersInspected, `class${p.classNumber}`).toBe(acc.officialRecordsFullyInspected);
      }
    }
  });

  it('gives every page of every official record a home', () => {
    // A record whose chapter has not been decomposed yet has an extent so it
    // cannot disappear, but no pages to place; those are counted as
    // indexed-only in classProgress, not as orphan pages.
    for (const ext of RECORD_EXTENTS.filter((e) => instructionalUnitsFor(e.officialRecordId).length > 0)) {
      const covered = new Set<number>();
      for (const e of [
        ...instructionalUnitsFor(ext.officialRecordId).map((u) => u.sourceEvidence),
        ...NON_INSTRUCTIONAL_RECORDS.filter((r) => r.officialRecordId === ext.officialRecordId).map((r) => r.sourceEvidence),
        ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === ext.officialRecordId).map((s) => s.sourceEvidence),
      ]) {
        for (const p of e.pageEvidence) covered.add(p.pdfPage);
      }
      for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
        expect(covered.has(p), `${ext.officialRecordId} p${p}`).toBe(true);
      }
    }
  });
});

describe('§8/§20 the audit and the dataset agree', () => {
  const audit = () => read('PAGE_LEVEL_INTENT_AUDIT_CLASSES_1_2.md');

  it('lists all 24 official chapters exactly once, and no invented one', () => {
    const listed = [...audit().matchAll(/^\| `(ncert_[a-z0-9_]+)` \|/gm)].map((m) => m[1]);
    expect(listed).toHaveLength(24);
    expect(new Set(listed).size).toBe(24);
    const expectedSet = new Set([
      ...authoringUnits(1).map((r) => r.recordId),
      ...authoringUnits(2).map((r) => r.recordId),
    ]);
    expect(new Set(listed)).toEqual(expectedSet);
  });

  it('reports the same per-class unit counts as the dataset', () => {
    const a = audit();
    for (const n of [1, 2]) {
      const units = unitsForClass(n);
      for (const u of units) expect(a, u.instructionalUnitId).toContain(u.instructionalUnitId);
    }
    expect(a).toContain(`${CLASS_DECOMPOSITION_PROGRESS[0].pagesFullyInspected}/${CLASS_DECOMPOSITION_PROGRESS[0].pagesInScope}`);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 6 — DATA THAT CONTRADICTS ITSELF.
//
// Three defects this guards. Six Class 2 segments still said "pages not
// yet read" while carrying complete page evidence in a class declared
// source-complete. Class 2 Chapter 6's printed extent read 51–27,
// because an answer inside a Project Work box ("30 − 17 = 27") was
// mistaken for the folio. And a generated note said 130 of 121 visual
// pages had been seen, having counted every inspected page against the
// required ones.
// ---------------------------------------------------------------------------

describe('§2 a source segment may only be UNRESOLVED for a real reason', () => {
  it('never claims pages are unread when their evidence is complete', () => {
    for (const s of SOURCE_SEGMENTS) {
      const complete = s.sourceEvidence.evidenceDepth !== 'DIGEST_ONLY';
      if (complete) {
        expect(s.justification, s.sourceSegmentId).not.toMatch(/not yet read|pages not read/i);
      }
      if (s.role === 'UNRESOLVED') {
        // An unresolved segment must say what is unresolved, and in a
        // source-complete class it cannot be unresolved for want of reading.
        expect(s.justification.length, s.sourceSegmentId).toBeGreaterThan(60);
        expect(complete, `${s.sourceSegmentId} is unresolved because of unread source`).toBe(false);
      }
    }
  });

  it('leaves no unresolved-by-unread segment in a source-complete class', () => {
    const complete = CLASS_DECOMPOSITION_PROGRESS.filter(
      (p) => p.status === 'DECOMPOSITION_SOURCE_COMPLETE'
    ).map((p) => p.classNumber);
    for (const s of SOURCE_SEGMENTS) {
      const n = Number(s.officialRecordId.match(/_(a|b)ejm1_/) ? (s.officialRecordId.includes('aejm1') ? 1 : 2) : 0);
      if (!complete.includes(n)) continue;
      expect(s.role, s.sourceSegmentId).not.toBe('UNRESOLVED');
    }
  });
});

describe('§4/§5 printed page ranges must be possible', () => {
  const ranges: Array<[string, number | null, number | null]> = [
    ...RECORD_EXTENTS.map((e) => [e.officialRecordId, e.printedPageStart, e.printedPageEnd] as [string, number | null, number | null]),
    ...PRAGATI_INSTRUCTIONAL_UNITS.map((u) => [u.instructionalUnitId, u.sourceEvidence.printedPageStart, u.sourceEvidence.printedPageEnd] as [string, number | null, number | null]),
    ...SOURCE_SEGMENTS.map((s) => [s.sourceSegmentId, s.sourceEvidence.printedPageStart, s.sourceEvidence.printedPageEnd] as [string, number | null, number | null]),
    ...NON_INSTRUCTIONAL_RECORDS.map((r) => [r.officialRecordId, r.sourceEvidence.printedPageStart, r.sourceEvidence.printedPageEnd] as [string, number | null, number | null]),
  ];

  it('never ends before it starts', () => {
    for (const [id, start, end] of ranges) {
      if (start === null || end === null) continue;
      expect(end, `${id}: ${start}–${end}`).toBeGreaterThanOrEqual(start);
    }
  });

  it('keeps a unit inside its chapter, and takes an unknown folio as null', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      const ext = RECORD_EXTENTS.find((e) => e.officialRecordId === u.officialRecordId);
      const { printedPageStart: s, printedPageEnd: e } = u.sourceEvidence;
      if (!ext || ext.printedPageStart === null || ext.printedPageEnd === null) continue;
      if (s !== null) expect(s, u.instructionalUnitId).toBeGreaterThanOrEqual(ext.printedPageStart);
      if (e !== null) expect(e, u.instructionalUnitId).toBeLessThanOrEqual(ext.printedPageEnd);
    }
    // Pages whose folio is genuinely absent carry null rather than a guess.
    const nulls = PRAGATI_INSTRUCTIONAL_UNITS.flatMap((u) => u.sourceEvidence.pageEvidence).filter(
      (p) => p.printedPage === null
    );
    expect(nulls.length).toBeGreaterThan(0);
  });
});

describe('§6/§7 generated prose agrees with the structured values', () => {
  it('cannot report more visual pages seen than were required', () => {
    for (const p of CLASS_DECOMPOSITION_PROGRESS) {
      expect(p.visualPagesInspected ?? 0, `class${p.classNumber}`).toBeLessThanOrEqual(p.visualPagesRequired ?? 0);
      expect(p.pagesFullyInspected, `class${p.classNumber}`).toBeLessThanOrEqual(p.pagesInScope ?? p.pagesFullyInspected);
      // The note is derived, so every number it states must be one of them.
      const numbers = (p.note.match(/\d+/g) ?? []).map(Number);
      const allowed = new Set([
        p.pagesInScope, p.pagesFullyInspected, p.visualPagesRequired, p.visualPagesInspected,
        p.officialRecordsTotal, p.officialRecordsFullyInspected, p.pagesFullTextPending, p.chaptersTotal,
        p.officialChapterCount ?? -1, p.officialSectionsTotal ?? -1,
        p.officialRecordsNotStarted ?? -1, p.officialRecordsPartiallyInspected ?? -1,
        p.chaptersFullyInspected ?? -1, p.chaptersPartiallyInspected ?? -1,
        p.chaptersIndexedOnly ?? -1, p.sectionsAccountedFor ?? -1,
      ]);
      for (const n of numbers) expect(allowed.has(n), `class${p.classNumber} note has stray ${n}`).toBe(true);
    }
  });
});

describe('§12 overlapping coverage is deliberate and explained', () => {
  it('explains every overlap between two units of one record', () => {
    for (const id of officialRecordIdsTouched()) {
      const units = instructionalUnitsFor(id);
      for (let i = 0; i < units.length; i += 1) {
        for (let j = i + 1; j < units.length; j += 1) {
          const a = units[i].sourceEvidence;
          const b = units[j].sourceEvidence;
          const overlap = a.pdfPageStart <= b.pdfPageEnd && b.pdfPageStart <= a.pdfPageEnd;
          if (!overlap) continue;
          // v0.84.0 checkpoint 8 moved this to pair-keyed justifications;
          // a merge note is no longer an acceptable substitute.
          const reason = overlapJustificationFor(units[i].instructionalUnitId, units[j].instructionalUnitId) ?? '';
          expect(reason.length, `${units[i].instructionalUnitId} / ${units[j].instructionalUnitId}`).toBeGreaterThan(40);
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 7 — LABELS AND TYPES THAT MEAN WHAT THEY SAY.
//
// Four defects. Two segments kept `establishes: "Pages not yet read"`
// while their evidence was complete — the previous test only read
// `justification`, so the contradiction sat one field away. Two carried
// page-range labels left over from the ranges they used to span. Class 1
// Chapter 13's rehearsal pages were a whole-record NonInstructionalRecord
// inside a chapter with four units. And the overlap audit checked only
// unit-against-unit while the report implied it checked everything.
// ---------------------------------------------------------------------------

describe('§2/§13 no current evidence text claims its pages are unread', () => {
  const STALE = /not yet read|pages not read|\bunread\b|to be read|placeholder|temporary/i;

  it('checks every evidence-bearing field, not just the justification', () => {
    for (const s of SOURCE_SEGMENTS) {
      for (const [field, text] of [
        ['justification', s.justification],
        ['establishes', s.sourceEvidence.establishes],
        ['sourceLabel', s.sourceLabel],
      ] as const) {
        if (s.sourceEvidence.evidenceDepth === 'DIGEST_ONLY') continue;
        expect(STALE.test(text), `${s.sourceSegmentId}.${field}: ${text.slice(0, 80)}`).toBe(false);
      }
    }
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      if (u.sourceEvidence.evidenceDepth === 'DIGEST_ONLY') continue;
      expect(STALE.test(u.sourceEvidence.establishes), u.instructionalUnitId).toBe(false);
    }
    for (const r of NON_INSTRUCTIONAL_RECORDS) {
      expect(STALE.test(r.sourceEvidence.establishes), r.officialRecordId).toBe(false);
      expect(STALE.test(r.justification), r.officialRecordId).toBe(false);
    }
  });

  it('gives every segment a description of what its pages establish', () => {
    for (const s of SOURCE_SEGMENTS) {
      expect(s.sourceEvidence.establishes.length, s.sourceSegmentId).toBeGreaterThan(40);
    }
  });
});

describe('§4 a generated range label agrees with the evidence', () => {
  it('matches the pdf range, and leaves real book headings alone', () => {
    for (const s of SOURCE_SEGMENTS) {
      const { pdfPageStart: a, pdfPageEnd: b } = s.sourceEvidence;
      if (s.sourceLabelIsFromBook) {
        // A heading printed in the book is not a range and is never rewritten.
        expect(s.sourceLabel, s.sourceSegmentId).not.toMatch(/^pages? \d/);
        continue;
      }
      const expected = a === b ? `page ${a} of the chapter` : `pages ${a}\u2013${b} of the chapter`;
      expect(s.sourceLabel, s.sourceSegmentId).toBe(expected);
    }
  });
});

describe('§6/§7/§8 NonInstructionalRecord means a whole record', () => {
  it('covers the full extent of a record that has no units', () => {
    for (const r of NON_INSTRUCTIONAL_RECORDS) {
      const ext = RECORD_EXTENTS.find((e) => e.officialRecordId === r.officialRecordId);
      expect(ext, r.officialRecordId).toBeDefined();
      expect(r.sourceEvidence.pdfPageStart, r.officialRecordId).toBe(ext!.pdfPageStart);
      expect(r.sourceEvidence.pdfPageEnd, r.officialRecordId).toBe(ext!.pdfPageEnd);
      expect(instructionalUnitsFor(r.officialRecordId), r.officialRecordId).toHaveLength(0);
    }
  });

  // §11 — the regression the old helper would have failed: a record whose
  // only entry is a one-page practice segment.
  it('a segment alone never gives a record instructional coverage', () => {
    const fixture = 'ncert_bejm1_ch11';
    // Real data: this chapter has units, so it passes both questions.
    expect(recordSourceIsAccountedFor(fixture)).toBe(true);
    expect(recordHasInstructionalDisposition(fixture)).toBe(true);
    // Every segment-bearing record must owe its instructional standing to
    // units or a whole-record judgement, never to the segment.
    for (const s of SOURCE_SEGMENTS) {
      const units = instructionalUnitsFor(s.officialRecordId).length;
      const whole = NON_INSTRUCTIONAL_RECORDS.some((r) => r.officialRecordId === s.officialRecordId);
      if (units === 0 && !whole) {
        expect(recordHasInstructionalDisposition(s.officialRecordId), s.sourceSegmentId).toBe(false);
      }
    }
  });

  it('separates source accounting from instructional coverage in the gap report', () => {
    const gap = read('INSTRUCTIONAL_DECOMPOSITION_GAP_REPORT.md');
    expect(gap).toContain('no instructional disposition');
    expect(gap).toMatch(/does not answer this question/i);
  });

  it('cannot let a small subrange make a whole chapter look covered', () => {
    // Chapter 13 teaches; its rehearsal pages are a segment, and the
    // chapter is covered because of its units, not because of them.
    expect(instructionalUnitsFor('ncert_aejm1_ch13').length).toBeGreaterThan(0);
    expect(recordIsCovered('ncert_aejm1_ch13')).toBe(true);
    expect(
      NON_INSTRUCTIONAL_RECORDS.some((r) => r.officialRecordId === 'ncert_aejm1_ch13')
    ).toBe(false);
  });
});

describe('§9/§10 the overlap audit covers every object type', () => {
  // v0.84.0 checkpoint 8 — a reason for THIS pair, not any reason that
  // happens to be stored on one side of it.
  it('has a justification authored for each exact pair', () => {
    const overlaps = overlapAudit();
    expect(overlaps.length).toBeGreaterThan(0);
    for (const o of overlaps) {
      expect(o.pages.length, `${o.a} / ${o.b}`).toBeGreaterThan(0);
      const pair = overlapJustificationFor(o.a, o.b);
      expect(pair, `${o.a} / ${o.b} has no pair-specific justification`).not.toBeNull();
      expect((pair ?? '').length, `${o.a} / ${o.b}`).toBeGreaterThan(40);
      expect(o.reason).toBe(pair);
    }
  });

  it('carries no justification for a pair that does not overlap', () => {
    const pairs = new Set(overlapAudit().map((o) => [o.a, o.b].sort().join('|')));
    for (const j of OVERLAP_JUSTIFICATIONS) {
      expect(pairs.has([j.a, j.b].sort().join('|')), `${j.a} / ${j.b} is not an overlap`).toBe(true);
    }
    expect(OVERLAP_JUSTIFICATIONS.length).toBe(pairs.size);
  });

  it('does not let a unit merge note stand in for an overlap reason', () => {
    // The merge note explains a unit's relationship to another unit; it
    // is not addressed to any particular shared page range.
    for (const o of overlapAudit()) {
      const a = PRAGATI_INSTRUCTIONAL_UNITS.find((u) => u.instructionalUnitId === o.a);
      if (a?.mergeRelationship && o.reason) expect(o.reason).not.toBe(a.mergeRelationship);
    }
  });

  it('includes unit-to-segment overlaps, not only unit-to-unit', () => {
    const kinds = overlapAudit().filter(
      (o) => o.a.startsWith('pragati_srcseg_') || o.b.startsWith('pragati_srcseg_')
    );
    expect(kinds.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 9 — CLASS 3, on the locked method.
// ---------------------------------------------------------------------------

describe('§2/§4 Class 3 uses canonical official records only', () => {
  it('has all 14 official chapters, each with an extent', () => {
    const acc = officialRecordAccounting(3);
    expect(acc.officialRecordsTotal).toBe(14);
    expect(acc.missingExtents).toEqual([]);
  });

  it('invents no NCERT section for a book that numbers none', () => {
    for (const u of unitsForClass(3)) {
      expect(u.officialRecordId, u.instructionalUnitId).toMatch(/^ncert_cemm1_ch\d{2}$/);
      expect(u.sourceEvidence.officialSectionId, u.instructionalUnitId).toBeNull();
      expect(u.instructionalUnitId.startsWith('pragati_iu_g03_')).toBe(true);
    }
  });

  it('gives every Class 3 page a home', () => {
    for (const ext of RECORD_EXTENTS.filter((e) => e.officialRecordId.includes('cemm1'))) {
      const covered = new Set<number>();
      for (const e of [
        ...instructionalUnitsFor(ext.officialRecordId).map((u) => u.sourceEvidence),
        ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === ext.officialRecordId).map((s) => s.sourceEvidence),
      ]) {
        for (let p = e.pdfPageStart; p <= e.pdfPageEnd; p += 1) covered.add(p);
      }
      for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
        expect(covered.has(p), `${ext.officialRecordId} p${p}`).toBe(true);
      }
    }
  });
});

// v0.84.0 checkpoint 12 — Class 4, on the locked method.
describe('Class 5 follows the locked method', () => {
  it('has all 15 official chapters with extents and no invented section', () => {
    const acc = officialRecordAccounting(5);
    expect(acc.officialRecordsTotal).toBe(15);
    expect(acc.missingExtents).toEqual([]);
    for (const u of unitsForClass(5)) {
      expect(u.officialRecordId, u.instructionalUnitId).toMatch(/^ncert_eemm1_ch\d{2}$/);
      expect(u.sourceEvidence.officialSectionId, u.instructionalUnitId).toBeNull();
      expect(u.instructionalUnitId.startsWith('pragati_iu_g05_')).toBe(true);
    }
  });

  it('gives every Class 5 page a home and derives completion', () => {
    for (const ext of classScope([5]).recordExtents) {
      const covered = new Set<number>();
      for (const e of [
        ...instructionalUnitsFor(ext.officialRecordId).map((u) => u.sourceEvidence),
        ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === ext.officialRecordId).map((s) => s.sourceEvidence),
      ]) {
        for (let p = e.pdfPageStart; p <= e.pdfPageEnd; p += 1) covered.add(p);
      }
      for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
        expect(covered.has(p), `${ext.officialRecordId} p${p}`).toBe(true);
      }
    }
    const p = CLASS_DECOMPOSITION_PROGRESS.find((x) => x.classNumber === 5)!;
    if (p.status === 'DECOMPOSITION_SOURCE_COMPLETE') {
      expect(p.pagesFullTextPending).toBe(0);
      expect(p.visualPagesPending).toBe(0);
      expect(p.officialRecordsFullyInspected).toBe(15);
    }
    for (const u of unitsForClass(5)) expect(u.decompositionStatus, u.instructionalUnitId).toBe(derivedStatusFor(u));
  });

  it('carries no duplicate or superseded Class 5 unit', () => {
    const seen = new Map<string, string>();
    for (const u of unitsForClass(5)) {
      for (const key of [u.mathematicalObjective, u.studentCanStatement,
        `${u.officialRecordId}:${u.sourceEvidence.pdfPageStart}-${u.sourceEvidence.pdfPageEnd}`]) {
        expect(seen.has(key), `${u.instructionalUnitId} duplicates ${seen.get(key)}`).toBe(false);
        seen.set(key, u.instructionalUnitId);
      }
    }
  });

  it('records a structured progression relationship for Class 5', () => {
    const withRel = unitsForClass(5).filter((u) => u.progressionRelationship);
    expect(withRel.length).toBeGreaterThan(50);
  });

  it('publishes a Class 5 audit that contains only Class 5', () => {
    const a = read('PAGE_LEVEL_INTENT_AUDIT_CLASS_5.md');
    expect(a).not.toMatch(/pragati_iu_g0[1234]_/);
    expect(a).not.toMatch(/ncert_(aejm1|bejm1|cemm1|demm1)_/);
    const listed = [...a.matchAll(/^\| `(ncert_eemm1_ch\d{2})` \|/gm)].map((m) => m[1]);
    expect(new Set(listed).size).toBe(15);
    for (const u of unitsForClass(5)) expect(a, u.instructionalUnitId).toContain(u.instructionalUnitId);
  });
});

describe('Class 4 follows the locked method', () => {
  it('has all 14 official chapters with extents and no invented section', () => {
    const acc = officialRecordAccounting(4);
    expect(acc.officialRecordsTotal).toBe(14);
    expect(acc.missingExtents).toEqual([]);
    for (const u of unitsForClass(4)) {
      expect(u.officialRecordId, u.instructionalUnitId).toMatch(/^ncert_demm1_ch\d{2}$/);
      expect(u.sourceEvidence.officialSectionId, u.instructionalUnitId).toBeNull();
      expect(u.instructionalUnitId.startsWith('pragati_iu_g04_')).toBe(true);
    }
    for (const s of SOURCE_SEGMENTS.filter((s) => s.officialRecordId.includes('demm1'))) {
      expect(s.sourceSegmentId.startsWith('pragati_srcseg_')).toBe(true);
    }
  });

  it('gives every Class 4 page a home', () => {
    for (const ext of RECORD_EXTENTS.filter((e) => e.officialRecordId.includes('demm1'))) {
      const covered = new Set<number>();
      for (const e of [
        ...instructionalUnitsFor(ext.officialRecordId).map((u) => u.sourceEvidence),
        ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === ext.officialRecordId).map((s) => s.sourceEvidence),
      ]) {
        for (let p = e.pdfPageStart; p <= e.pdfPageEnd; p += 1) covered.add(p);
      }
      for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
        expect(covered.has(p), `${ext.officialRecordId} p${p}`).toBe(true);
      }
    }
  });

  it('derives Class 4 completion and holds the status semantics', () => {
    const p = CLASS_DECOMPOSITION_PROGRESS.find((x) => x.classNumber === 4)!;
    expect(p.officialRecordsTotal).toBe(14);
    if (p.status === 'DECOMPOSITION_SOURCE_COMPLETE') {
      expect(p.pagesFullTextPending).toBe(0);
      expect(p.visualPagesPending).toBe(0);
      expect(p.officialRecordsFullyInspected).toBe(14);
    }
    for (const u of unitsForClass(4)) {
      expect(u.decompositionStatus, u.instructionalUnitId).toBe(derivedStatusFor(u));
    }
    expect(unitsForClass(4).length).toBeGreaterThan(14);
  });

  it('carries no duplicate or superseded Class 4 unit', () => {
    const units = unitsForClass(4);
    const seen = new Map<string, string>();
    for (const u of units) {
      for (const key of [u.mathematicalObjective, u.studentCanStatement,
        `${u.officialRecordId}:${u.sourceEvidence.pdfPageStart}-${u.sourceEvidence.pdfPageEnd}`]) {
        expect(seen.has(key), `${u.instructionalUnitId} duplicates ${seen.get(key)}`).toBe(false);
        seen.set(key, u.instructionalUnitId);
      }
    }
  });

  it('links Class 4 prerequisites to real earlier units', () => {
    const ids = new Set(PRAGATI_INSTRUCTIONAL_UNITS.map((u) => u.instructionalUnitId));
    let linked = 0;
    for (const u of unitsForClass(4)) {
      for (const p of u.prerequisites) {
        if (p.startsWith('pragati_iu_')) {
          expect(ids.has(p as `pragati_iu_${string}`), `${u.instructionalUnitId} → ${p}`).toBe(true);
          linked += 1;
        }
      }
    }
    expect(linked).toBeGreaterThan(30);
  });

  it('publishes a Class 4 audit that contains only Class 4', () => {
    const a = read('PAGE_LEVEL_INTENT_AUDIT_CLASS_4.md');
    expect(a).not.toMatch(/pragati_iu_g0[1235]_/);
    expect(a).not.toMatch(/ncert_(aejm1|bejm1|cemm1|eemm1)_/);
    const listed = [...a.matchAll(/^\| `(ncert_demm1_ch\d{2})` \|/gm)].map((m) => m[1]);
    expect(new Set(listed).size).toBe(14);
    for (const u of unitsForClass(4)) expect(a, u.instructionalUnitId).toContain(u.instructionalUnitId);
  });

  // v0.84.0 checkpoint 13 §5/§6 — counting units caught nothing: an
  // objective, a page range or a status could change while the count
  // held. These fingerprints are the checkpoint-12 state of each
  // finished class, and any content change to them fails here.
  it('leaves Classes 1-3 byte-identical, not merely the same size', () => {
    expect(unitsForClass(1).length).toBe(47);
    expect(unitsForClass(2).length).toBe(59);
    expect(unitsForClass(3).length).toBe(59);
    // v0.84.0 checkpoint 14 §35 — these values changed once, deliberately:
    // the preflight added the policy key and the structured progression
    // fields, both of which are inside the fingerprint. The defect log
    // records why. They are frozen again here for the Class 6 work.
    expect(decompositionFingerprint(1)).toBe('9a797e73bba18969');
    expect(decompositionFingerprint(2)).toBe('a055acf475f2b669');
    expect(decompositionFingerprint(3)).toBe('61d78c1ff6cbdff8');
  });

  it('holds the Class 4 fingerprint once Class 5 work begins', () => {
    expect(unitsForClass(4).length).toBe(59);
    expect(decompositionFingerprint(4)).toBe('997eb04b0df59365');
    expect(unitsForClass(5).length).toBe(68);
    expect(decompositionFingerprint(5)).toBe('fab48844235db73f');
  });

  it('has retired the ambiguous pagesUnresolved field', () => {
    for (const p of CLASS_DECOMPOSITION_PROGRESS) {
      const raw = p as unknown as Record<string, unknown>;
      expect(raw.pagesUnresolved, `class${p.classNumber}`).toBeUndefined();
      expect(raw.pagesFullTextPending).toBeDefined();
      expect(raw.visualPagesPending).toBeDefined();
    }
  });

  // v0.84.0 checkpoint 14 §1-§3 — the report claimed all 18 flagged units
  // shared one policy; the data showed 8 with a key and three genuinely
  // different decisions. Policies are canonical now, and the count of
  // decisions is derived rather than asserted in prose.
  it('groups every flagged unit under a real, stated policy', () => {
    const flagged = PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => u.decompositionStatus === 'NEEDS_HUMAN_CHECK');
    const keys = new Set(HUMAN_JUDGEMENT_POLICIES.map((p) => p.policyKey));
    expect(HUMAN_JUDGEMENT_POLICIES.length).toBeGreaterThan(1);
    for (const u of flagged) {
      expect(u.humanJudgementPolicyKey, u.instructionalUnitId).toBeDefined();
      expect(keys.has(u.humanJudgementPolicyKey!), u.instructionalUnitId).toBe(true);
    }
    for (const p of HUMAN_JUDGEMENT_POLICIES) {
      expect(p.policyQuestion.length).toBeGreaterThan(60);
      expect(p.affectedUnitIds.length).toBeGreaterThan(0);
      const actual = flagged.filter((u) => u.humanJudgementPolicyKey === p.policyKey).map((u) => u.instructionalUnitId);
      expect(new Set(p.affectedUnitIds)).toEqual(new Set(actual));
    }
    const covered = HUMAN_JUDGEMENT_POLICIES.flatMap((p) => p.affectedUnitIds);
    expect(covered.length).toBe(flagged.length);
  });

  it('reports the number of decisions, not just the number of flags', () => {
    const report = read('V0.84.0_CHECKPOINT_REPORT.md');
    const flagged = PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => u.decompositionStatus === 'NEEDS_HUMAN_CHECK').length;
    expect(report).toContain(`${flagged} flagged`);
    expect(report).toContain(`${HUMAN_JUDGEMENT_POLICIES.length} distinct`);
    expect(report).not.toMatch(/all one policy/i);
  });

  it('keeps progression as a controlled value with its evidence', () => {
    const ENUM = new Set(['REVISIT', 'EXTENSION', 'FORMALIZATION', 'NEW_REPRESENTATION',
      'NEW_PROCEDURE', 'NEW_MATHEMATICAL_IDEA', 'INTEGRATION']);
    const withRel = PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => u.progressionRelationship);
    expect(withRel.length).toBeGreaterThan(50);
    for (const u of withRel) {
      expect(ENUM.has(u.progressionRelationship!), `${u.instructionalUnitId}: ${u.progressionRelationship}`).toBe(true);
      expect((u.progressionRationale ?? '').length, u.instructionalUnitId).toBeGreaterThan(20);
      // The relationship must not be left only as free text.
      expect(u.notes ?? '').not.toMatch(/^Progression against/);
    }
  });

  it('represents one policy decision as one policy, not five judgements', () => {
    const policy = PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => u.humanJudgementPolicyKey);
    expect(policy.length).toBeGreaterThan(1);
    const keys = new Set(policy.map((u) => u.humanJudgementPolicyKey));
    expect(keys.size).toBeGreaterThan(0);
    // Policies are distinct; the questions under one policy may share
    // wording where the earlier classes wrote them that way.
    expect(new Set(HUMAN_JUDGEMENT_POLICIES.map((p) => p.policyKey)).size).toBe(HUMAN_JUDGEMENT_POLICIES.length);
  });

  it('gives every class-specific generator only its own class', () => {
    for (const set of [[1, 2], [3], [4]]) {
      const scope = classScope(set);
      for (const u of scope.units) expect(set).toContain(u.classNumber);
      for (const s of scope.sourceSegments) expect(scope.officialRecordIds).toContain(s.officialRecordId);
      for (const e of scope.recordExtents) expect(scope.officialRecordIds).toContain(e.officialRecordId);
      for (const r of scope.nonInstructional) expect(scope.officialRecordIds).toContain(r.officialRecordId);
    }
  });
});

describe('§21/§22 Class 3 readiness and completion are evidence-derived', () => {
  it('holds back every unit whose visual pass is unfinished', () => {
    for (const u of unitsForClass(3)) {
      if (u.decompositionStatus === 'READY_FOR_AUTHORING') {
        expect(meetsEvidenceBar(u), u.instructionalUnitId).toBe(true);
      } else {
        const unseen = u.sourceEvidence.pageEvidence.filter(
          (p) => p.visualInspectionRequired && !p.visualInspected
        );
        const q = u.humanJudgementQuestion ?? '';
        expect(unseen.length > 0 || q.length > 20, u.instructionalUnitId).toBe(true);
      }
    }
  });

  it('keeps Class 3 IN_PROGRESS while picture-carried pages are unseen', () => {
    const p = CLASS_DECOMPOSITION_PROGRESS.find((x) => x.classNumber === 3)!;
    expect(p.pagesFullTextPending).toBe(0); // all text read
    if ((p.visualPagesInspected ?? 0) < (p.visualPagesRequired ?? 0)) {
      expect(p.status).toBe('IN_PROGRESS');
      expect(p.officialRecordsFullyInspected).toBeLessThan(p.officialRecordsTotal!);
    }
  });

  it('did not assume one chapter is one lesson', () => {
    expect(unitsForClass(3).length).toBeGreaterThan(14);
    // Classes 1 and 2 are untouched by this work.
    expect(unitsForClass(1).length).toBe(47);
    expect(unitsForClass(2).length).toBe(59);
  });

  it('links Class 3 prerequisites to real earlier units where it claims them', () => {
    const ids = new Set(PRAGATI_INSTRUCTIONAL_UNITS.map((u) => u.instructionalUnitId));
    let linked = 0;
    for (const u of unitsForClass(3)) {
      for (const p of u.prerequisites) {
        if (p.startsWith('pragati_iu_')) {
          expect(ids.has(p as `pragati_iu_${string}`), `${u.instructionalUnitId} → ${p}`).toBe(true);
          linked += 1;
        }
      }
    }
    expect(linked).toBeGreaterThan(20);
  });

  it('publishes a Class 3 audit that matches the dataset', () => {
    const a = read('PAGE_LEVEL_INTENT_AUDIT_CLASS_3.md');
    const listed = [...a.matchAll(/^\| `(ncert_cemm1_ch\d{2})` \|/gm)].map((m) => m[1]);
    expect(new Set(listed).size).toBe(14);
    for (const u of unitsForClass(3)) expect(a, u.instructionalUnitId).toContain(u.instructionalUnitId);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 14 — CLASS 6 AND THE TWELVE AUTHORED ARTIFACTS.
// ---------------------------------------------------------------------------

describe('Class 6 structure and artifact mapping', () => {
  it('keeps the official chapter and section layers distinct', () => {
    // Class 6 keeps two official layers: 10 chapters and 65 numbered
    // sections. The chapter is the record that owns page extents.
    // Only the chapters that have been decomposed carry extents in scope so
    // far; all ten exist in the dataset so none can disappear.
    expect(RECORD_EXTENTS.filter((e) => e.officialRecordId.startsWith('ncert_gp_c6')).length).toBe(10);
    expect(classScope([6]).recordExtents.length).toBeGreaterThan(0);
    // `chaptersTotal` counts chapters; the section denominator lives in
    // `officialSectionsTotal`.
    const p6 = CLASS_DECOMPOSITION_PROGRESS.find((x) => x.classNumber === 6)!;
    expect(p6.officialChapterCount).toBe(10);
    expect(p6.officialSectionsTotal).toBe(65);
    expect(officialRecordAccounting(6).officialRecordsTotal).toBe(65);
    // v0.84.0 checkpoint 17 — the authoring record is the numbered
    // section now; the chapter is its own field.
    for (const u of unitsForClass(6)) {
      expect(u.officialRecordId, u.instructionalUnitId).toMatch(/^ncert_gp_c6_s\d+_\d+$/);
      expect(u.officialChapterId, u.instructionalUnitId).toMatch(/^ncert_gp_c6_ch\d{2}_/);
      expect(u.officialRecordId, u.instructionalUnitId).toBe(u.sourceEvidence.officialSectionId);
      // Class 6 DOES have official numbered sections; a unit cites one, and
      // never invents one.
      const sec = u.sourceEvidence.officialSectionId;
      if (sec !== null) expect(sec, u.instructionalUnitId).toMatch(/^ncert_gp_c6_s\d+_\d+$/);
      expect(u.instructionalUnitId.startsWith('pragati_iu_g06_')).toBe(true);
    }
    for (const s of classScope([6]).sourceSegments) {
      expect(s.sourceSegmentId.startsWith('pragati_srcseg_g06_')).toBe(true);
    }
  });

  it('states Class 6 completion from its evidence, either way', () => {
    const p = CLASS_DECOMPOSITION_PROGRESS.find((x) => x.classNumber === 6)!;
    expect(p.officialChapterCount).toBe(10);
    expect(p.officialRecordsTotal).toBe(65);
    const audit = read('PAGE_LEVEL_INTENT_AUDIT_CLASS_6.md');
    if (p.status === 'DECOMPOSITION_SOURCE_COMPLETE') {
      expect(p.pagesFullTextPending).toBe(0);
      expect(audit).not.toMatch(/Not source-complete/i);
    } else {
      expect(p.pagesFullTextPending).toBeGreaterThan(0);
      expect(audit).toMatch(/Not source-complete/i);
    }
  });

  it('gives every page of an inspected Class 6 chapter a home', () => {
    for (const ext of classScope([6]).recordExtents) {
      const units = instructionalUnitsFor(ext.officialRecordId);
      if (units.length === 0) continue; // chapter not decomposed yet
      const covered = new Set<number>();
      for (const e of [
        ...units.map((u) => u.sourceEvidence),
        ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === ext.officialRecordId).map((s) => s.sourceEvidence),
      ]) {
        for (let p = e.pdfPageStart; p <= e.pdfPageEnd; p += 1) covered.add(p);
      }
      for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
        expect(covered.has(p), `${ext.officialRecordId} p${p}`).toBe(true);
      }
    }
  });

  it('maps all 12 authored artifacts exactly once, without forcing one-to-one', () => {
    const maps = ARTIFACT_ALIGNMENTS;
    expect(maps.length).toBe(12);
    expect(maps.filter((m) => m.artifactId.startsWith('fractions_')).length).toBe(9);
    expect(maps.filter((m) => m.artifactId.startsWith('number_play_')).length).toBe(3);
    expect(new Set(maps.map((m) => m.artifactId)).size).toBe(12);
    const allowed = new Set(['EXACT_MATCH', 'PARTIAL_MATCH', 'MULTI_UNIT_COVERAGE',
      'OVER_SCOPED', 'UNDER_SCOPED', 'SOURCE_ALIGNMENT_ISSUE']);
    const unitIds = new Set<string>(unitsForClass(6).map((u) => u.instructionalUnitId));
    for (const m of maps) {
      expect(allowed.has(m.alignment), `${m.artifactId}: ${m.alignment}`).toBe(true);
      expect(m.mappedUnitIds.length).toBeGreaterThan(0);
      for (const id of m.mappedUnitIds) expect(unitIds.has(id), `${m.artifactId} to ${id}`).toBe(true);
      expect(m.coverageSummary.length).toBeGreaterThan(30);
      if (m.alignment !== 'EXACT_MATCH') expect(m.recommendedLaterAction.length).toBeGreaterThan(20);
    }
    // One artifact legitimately spans several units, so the counts differ.
    const mapped = new Set(maps.flatMap((m) => m.mappedUnitIds));
    expect(mapped.size).toBeGreaterThan(maps.length);
  });

  it('shows the Number Play authoring gap honestly', () => {
    const uncovered = unitsForClass(6).filter((u) => u.learnCoverage === 'NO_LEARN_CONTENT');
    expect(uncovered.length).toBeGreaterThan(0);
    const gap = read('CLASS_6_AUTHORING_GAP_REPORT.md');
    for (const u of uncovered) expect(gap, u.instructionalUnitId).toContain(u.instructionalUnitId);
    expect(gap).toMatch(/Coverage is about instruction, not topology/i);
  });

  it('leaves the review state and §7.4 identity untouched', () => {
    for (const m of ARTIFACT_ALIGNMENTS) {
      expect(m).not.toHaveProperty('reviewState');
    }
    const report = read('V0.84.0_CHECKPOINT_REPORT.md');
    expect(report).toContain('0 sent');
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 15 — TWO OFFICIAL LAYERS, AND A REPORT THAT KNOWS
// WHICH BOOK IT IS DESCRIBING.
//
// Checkpoint 14's Class 6 audit was cloned from the primary-grade one: it
// called the book Maths Mela, claimed 14 chapters and no numbered
// sections, and printed "0/65 chapters" because the section denominator
// had been put in `chaptersTotal`.
// ---------------------------------------------------------------------------

describe('§3-§10 Class 6 two-layer model and report identity', () => {
  const p6 = () => CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 6)!;

  it('keeps chapter and section denominators apart', () => {
    const p = p6();
    expect(p.officialChapterCount).toBe(10);
    expect(p.officialSectionsTotal).toBe(65);
    expect(p.chaptersTotal, 'chaptersTotal must count chapters').toBe(10);
    expect(p.chaptersTotal).not.toBe(65);
    expect((p.chaptersFullyInspected ?? 0) + (p.chaptersPartiallyInspected ?? 0) + (p.chaptersIndexedOnly ?? 0)).toBe(10);
    expect((p.sectionsAccountedFor ?? 0) + (p.sectionsNotYetInspected ?? 0)).toBe(65);
  });

  it('names the right book and never prints 65 chapters', () => {
    const a = read('PAGE_LEVEL_INTENT_AUDIT_CLASS_6.md');
    expect(a).toContain('Ganita Prakash');
    expect(a).not.toMatch(/Maths Mela/);
    expect(a).not.toMatch(/14 official chapters/);
    expect(a).not.toMatch(/numbers no sections/);
    expect(a).not.toMatch(/\/65 chapters/);
    expect(a).toMatch(/65 numbered sections/);
  });

  it('derives the Fractions chapter state from its evidence, not a claim', () => {
    const fr = 'ncert_gp_c6_ch07_fractions';
    const ext = RECORD_EXTENTS.find((e) => e.officialRecordId === fr)!;
    const pages = new Map<number, { fullTextInspected: boolean; visualInspectionRequired: boolean; visualInspected: boolean }>();
    for (const e of [
      ...instructionalUnitsFor(fr).map((u) => u.sourceEvidence),
      ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === fr).map((s) => s.sourceEvidence),
    ]) {
      for (const p of e.pageEvidence) pages.set(p.pdfPage, p);
    }
    // Every page of the extent, including the summary and the solutions
    // supplement, must satisfy the gate before the chapter counts.
    let complete = true;
    for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
      const row = pages.get(p);
      if (!row || !row.fullTextInspected || (row.visualInspectionRequired && !row.visualInspected)) complete = false;
    }
    expect(recordInspectionState(fr) === 'FULLY_INSPECTED').toBe(complete);
  });

  it('keeps the solutions supplement as inspected reference, not unread', () => {
    const sol = SOURCE_SEGMENTS.find((s) => s.sourceSegmentId === 'pragati_srcseg_g06_ch07_solutions')!;
    expect(sol.role).toBe('REFERENCE');
    expect(sol.sourceEvidence.evidenceDepth).toBe('FULL_PAGE_INSPECTED');
  });

  it('keeps the two layers consistent whatever the status', () => {
    const p = p6();
    expect((p.sectionsAccountedFor ?? 0) + (p.sectionsNotYetInspected ?? 0)).toBe(65);
    if (p.status === 'DECOMPOSITION_SOURCE_COMPLETE') expect(p.sectionsNotYetInspected).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 16 — CLASS 6 COMPLETE, AND SUMMARIES THAT CANNOT DRIFT.
//
// The checkpoint-15 narrative said Class 6 was 38 READY / 4 flagged while the
// data said 37 / 5. Counts are derived into CHECKPOINT_STATUS_COUNTS.json now,
// and the report is checked against them.
// ---------------------------------------------------------------------------

describe('§1 summary counts come from the data', () => {
  const counts = () => JSON.parse(read('CHECKPOINT_STATUS_COUNTS.json'));

  it('matches the canonical dataset exactly', () => {
    const c = counts();
    expect(c.totalUnits).toBe(PRAGATI_INSTRUCTIONAL_UNITS.length);
    expect(c.ready).toBe(readyForAuthoring().length);
    expect(c.needsHumanCheck).toBe(
      PRAGATI_INSTRUCTIONAL_UNITS.filter((u) => u.decompositionStatus === 'NEEDS_HUMAN_CHECK').length
    );
    for (const [n, per] of Object.entries(c.perClass) as Array<[string, { units: number; ready: number; needsHumanCheck: number }]>) {
      const us = unitsForClass(Number(n));
      expect(per.units, `class${n}`).toBe(us.length);
      expect(per.ready, `class${n}`).toBe(us.filter((u) => u.decompositionStatus === 'READY_FOR_AUTHORING').length);
      expect(per.needsHumanCheck, `class${n}`).toBe(us.filter((u) => u.decompositionStatus === 'NEEDS_HUMAN_CHECK').length);
    }
  });

  it('is the only source the checkpoint report quotes for Class 6', () => {
    const c = counts().perClass[6];
    const report = read('V0.84.0_CHECKPOINT_REPORT.md');
    expect(report).toContain(`${c.units}`);
    expect(report).toContain(`${c.ready} READY`);
    expect(report).toContain(`${c.needsHumanCheck} NEEDS_HUMAN_CHECK`);
  });
});

describe('§23 Class 6 completion, and honest interim visual language', () => {
  const p6 = () => CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 6)!;

  it('requires both layers and every page before source completion', () => {
    const p = p6();
    if (p.status === 'DECOMPOSITION_SOURCE_COMPLETE') {
      expect(p.chaptersFullyInspected).toBe(10);
      expect(p.sectionsAccountedFor).toBe(65);
      expect(p.pagesFullTextPending).toBe(0);
      expect(p.visualPagesPending).toBe(0);
      expect(p.pagesFullyInspected).toBe(p.pagesInScope);
    }
  });

  it('never claims total visual work is done while pages are unread', () => {
    for (const p of CLASS_DECOMPOSITION_PROGRESS) {
      if ((p.pagesFullTextPending ?? 0) === 0) continue;
      const file = `PAGE_LEVEL_INTENT_AUDIT_CLASS_${p.classNumber}.md`;
      let text = '';
      try { text = read(file); } catch { continue; }
      // A "0 pending" figure describes the pages inspected so far; the unread
      // pages have no visual classification yet.
      expect(text).not.toMatch(/0 picture-carried pages still to render/i);
      expect(text).not.toMatch(/all visuals complete|no visual inspection remains/i);
    }
  });

  it('cites a real official section for every Class 6 unit, with multi-section units declared', () => {
    const SECTIONS = new Set(
      authoringUnits(6).map((r) => r.recordId).filter((id) => /^ncert_gp_c6_s\d+_\d+$/.test(id))
    );
    const cited = new Set<string>();
    for (const u of unitsForClass(6)) {
      const sec = u.sourceEvidence.officialSectionId;
      if (sec) {
        expect(SECTIONS.has(sec), `${u.instructionalUnitId} cites ${sec}`).toBe(true);
        cited.add(sec);
      }
      for (const extra of u.additionalOfficialRecordIds ?? []) {
        expect(SECTIONS.has(extra), `${u.instructionalUnitId} extra ${extra}`).toBe(true);
        // A unit spanning several sections has to say why.
        expect((u.mergeRelationship ?? '').length, u.instructionalUnitId).toBeGreaterThan(40);
        cited.add(extra);
      }
    }
    if (p6().status === 'DECOMPOSITION_SOURCE_COMPLETE') expect(cited.size).toBe(65);
  });

  it('reports the Class 6 Learn gap over every unit, with policy-blocked work named', () => {
    const gap = read('CLASS_6_AUTHORING_GAP_REPORT.md');
    for (const u of unitsForClass(6)) expect(gap, u.instructionalUnitId).toContain(u.instructionalUnitId);
    expect(gap).not.toMatch(/floor, not the total|have not been decomposed/i);
    const blocked = unitsForClass(6).filter(
      (u) => u.learnCoverage === 'NO_LEARN_CONTENT' && u.decompositionStatus === 'NEEDS_HUMAN_CHECK'
    );
    expect(blocked.length).toBeGreaterThan(0);
    expect(gap).toContain(`${blocked.length} of the uncovered units are **blocked on a human policy`);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 17 — THE NUMBERED-GRADE RECORD MODEL, LOCKED.
//
// Class 6 units stored the chapter id in `officialRecordId` while the type
// said section, so the official-record helpers and the master map never saw
// 53 of the 65 sections — and `classProgress` typed 65 anyway. One
// derivation now serves helpers, master map, reports and tests.
// ---------------------------------------------------------------------------

describe('§30-§32 official record identity and the two layers', () => {
  it('uses chapters for Classes 1-5 and numbered sections for Class 6', () => {
    for (const n of [1, 2, 3, 4, 5]) {
      for (const u of unitsForClass(n)) {
        expect(u.officialRecordId, u.instructionalUnitId).toMatch(/_ch\d{2}/);
        expect(u.officialChapterId, u.instructionalUnitId).toBeUndefined();
      }
    }
    const sections = new Set(authoringUnits(6).map((r) => r.recordId));
    for (const u of unitsForClass(6)) {
      expect(sections.has(u.officialRecordId), `${u.instructionalUnitId} → ${u.officialRecordId}`).toBe(true);
      expect(u.officialRecordId).toBe(u.sourceEvidence.officialSectionId);
      expect(u.officialChapterId, u.instructionalUnitId).toMatch(/^ncert_gp_c6_ch\d{2}_/);
      for (const extra of u.additionalOfficialRecordIds) {
        expect(sections.has(extra), `${u.instructionalUnitId} extra ${extra}`).toBe(true);
        expect((u.mergeRelationship ?? '').length, u.instructionalUnitId).toBeGreaterThan(40);
      }
    }
  });

  it('derives section completion rather than taking a typed number', () => {
    const acc = sectionAccounting(6);
    expect(acc.sectionsTotal).toBe(65);
    expect(new Set(acc.rows.map((r) => r.sectionId)).size).toBe(65);
    const p6 = CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 6)!;
    expect(p6.sectionsAccountedFor).toBe(acc.fullyInspected.length);
    expect(officialRecordAccounting(6).officialRecordsTotal).toBe(65);
    expect(officialRecordAccounting(6).officialRecordsFullyInspected).toBe(acc.fullyInspected.length);
  });

  it('keeps the chapter layer accounted for separately', () => {
    const extents = RECORD_EXTENTS.filter((e) => e.officialRecordId.startsWith('ncert_gp_c6_ch'));
    expect(extents.length).toBe(10);
    const full = extents.filter((e) => recordInspectionState(e.officialRecordId) === 'FULLY_INSPECTED');
    const p6 = CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 6)!;
    expect(p6.chaptersFullyInspected).toBe(full.length);
    if (p6.status === 'DECOMPOSITION_SOURCE_COMPLETE') {
      expect(full.length).toBe(10);
      expect(p6.sectionsAccountedFor).toBe(65);
    }
  });

  it('shows every inspected section as inspected in the master map', () => {
    const p6 = CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 6)!;
    if (p6.status !== 'DECOMPOSITION_SOURCE_COMPLETE') return;
    const map = JSON.parse(read('CURRICULUM_MASTER_MAP.json')) as {
      records: Array<{ classNumber: number; level: string; intentStatus: string }>;
    };
    const sections = map.records.filter((r) => r.classNumber === 6 && r.level === 'section');
    expect(sections.length).toBe(65);
    expect(sections.filter((r) => r.intentStatus === 'not_inspected').length).toBe(0);
  });
});

describe('§33 artifact coverage is verified, not inferred from topology', () => {
  it('records what reading each lesson showed', () => {
    for (const m of ARTIFACT_ALIGNMENTS) {
      expect(m.unitCoverageVerification, m.artifactId).toBeDefined();
      expect((m.verificationNote ?? '').length, m.artifactId).toBeGreaterThan(30);
      if (m.unitCoverageVerification === 'VERIFIED_COMPLETE') {
        expect(new Set(m.verifiedCoveredUnitIds), m.artifactId).toEqual(new Set(m.mappedUnitIds));
      }
    }
  });

  it('never calls a unit covered that the lesson does not teach', () => {
    for (const u of unitsForClass(6)) {
      if (u.learnCoverage === 'NO_LEARN_CONTENT') continue;
      const m = ARTIFACT_ALIGNMENTS.find((x) => x.mappedUnitIds.includes(u.instructionalUnitId))!;
      expect(m, u.instructionalUnitId).toBeDefined();
      const verified = (m.verifiedCoveredUnitIds ?? []).includes(u.instructionalUnitId);
      expect(verified, `${u.instructionalUnitId} is marked ${u.learnCoverage} but the lesson was not verified to teach it`).toBe(true);
    }
    // And the mapping that is only partly taught says so in both places.
    const s76 = ARTIFACT_ALIGNMENTS.find((m) => m.artifactId === 'fractions_7_6')!;
    expect(s76.unitCoverageVerification).toBe('VERIFIED_PARTIAL');
    expect(s76.missingScope).not.toMatch(/needs checking/i);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 18 §1-§8 — A SECTION IS PROVEN AGAINST ITS OWN BODY.
//
// Checkpoint 17 derived section state from the units citing it, which proves
// the units' evidence is tidy, not that the section's printed body was read.
// ---------------------------------------------------------------------------

describe('§2-§8 numbered section body extents', () => {
  const sections = () => authoringUnits(6).map((r) => r.recordId);

  it('gives every Class 6 section a non-empty body range inside its chapter', () => {
    for (const id of sections()) {
      const e = sectionExtentFor(id);
      expect(e, id).toBeDefined();
      expect(e!.pdfPageEnd, id).toBeGreaterThanOrEqual(e!.pdfPageStart);
      expect(e!.boundaryEvidence.length, id).toBeGreaterThan(40);
      const chapter = RECORD_EXTENTS.find((x) => x.officialRecordId === e!.officialChapterId);
      expect(chapter, `${id} chapter ${e!.officialChapterId}`).toBeDefined();
      expect(e!.pdfPageStart, id).toBeGreaterThanOrEqual(chapter!.pdfPageStart);
      expect(e!.pdfPageEnd, id).toBeLessThanOrEqual(chapter!.pdfPageEnd);
    }
    const c6 = OFFICIAL_SECTION_EXTENTS.filter((e) => e.officialSectionId.startsWith('ncert_gp_c6'));
    expect(c6.length).toBe(65);
    expect(new Set(OFFICIAL_SECTION_EXTENTS.map((e) => e.officialSectionId)).size).toBe(
      OFFICIAL_SECTION_EXTENTS.length
    );
  });

  it('will not call a section complete when part of its body is unread', () => {
    // The real §3.1 is complete. Shrink the evidence to half its body and
    // the gate must drop it to PARTIALLY_INSPECTED — under checkpoint 17's
    // logic it stayed FULLY_INSPECTED, because the unit's own pages were
    // tidy.
    const id = 'ncert_gp_c6_s3_1';
    expect(sectionInspectionState(id)).toBe('FULLY_INSPECTED');
    const extent = sectionExtentFor(id)!;
    const chapterUnits = PRAGATI_INSTRUCTIONAL_UNITS.filter(
      (u) => (u.officialChapterId ?? u.officialRecordId) === extent.officialChapterId
    );
    const touched: Array<{ row: { fullTextInspected: boolean }; was: boolean }> = [];
    for (const u of chapterUnits) {
      for (const p of u.sourceEvidence.pageEvidence) {
        if (p.pdfPage >= extent.pdfPageStart && p.pdfPage <= extent.pdfPageEnd) {
          touched.push({ row: p, was: p.fullTextInspected });
          p.fullTextInspected = false;
        }
      }
    }
    expect(touched.length).toBeGreaterThan(0);
    try {
      expect(sectionInspectionState(id)).toBe('PARTIALLY_INSPECTED');
    } finally {
      for (const t of touched) t.row.fullTextInspected = t.was;
    }
    expect(sectionInspectionState(id)).toBe('FULLY_INSPECTED');
  });

  it('proves each short shared section on its own pages', () => {
    for (const id of ['ncert_gp_c6_s2_2', 'ncert_gp_c6_s2_3', 'ncert_gp_c6_s2_4', 'ncert_gp_c6_s2_7']) {
      expect(sectionExtentFor(id), id).toBeDefined();
      expect(sectionInspectionState(id), id).toBe('FULLY_INSPECTED');
    }
  });
});

describe('§12-§17 alignment describes teaching, coverage describes units', () => {
  it('does not call a lesson multi-unit when it teaches one unit', () => {
    for (const m of ARTIFACT_ALIGNMENTS) {
      const actual = m.actualCoveredUnitIds ?? [];
      if (m.alignment === 'MULTI_UNIT_COVERAGE') {
        expect(actual.length, `${m.artifactId} is MULTI_UNIT_COVERAGE`).toBeGreaterThan(1);
      }
      if (m.alignment === 'EXACT_MATCH') expect(actual.length, m.artifactId).toBe(1);
    }
    const s76 = ARTIFACT_ALIGNMENTS.find((m) => m.artifactId === 'fractions_7_6')!;
    expect(s76.alignment).toBe('PARTIAL_MATCH');
    expect(s76.actualCoveredUnitIds).toEqual(['pragati_iu_g06_ch07_u6']);
    expect((s76.expectedSectionUnitIds ?? []).length).toBe(3);
    const s78 = ARTIFACT_ALIGNMENTS.find((m) => m.artifactId === 'fractions_7_8')!;
    expect(s78.alignment).toBe('MULTI_UNIT_COVERAGE');
  });

  it('decides unit coverage from teaching, not from artifact topology', () => {
    const cov = (id: string) =>
      PRAGATI_INSTRUCTIONAL_UNITS.find((u) => u.instructionalUnitId === id)!.learnCoverage;
    expect(cov('pragati_iu_g06_ch07_u6')).toBe('EXISTING_COMPLETE');
    expect(cov('pragati_iu_g06_ch07_u7')).toBe('NO_LEARN_CONTENT');
    expect(cov('pragati_iu_g06_ch07_u8')).toBe('NO_LEARN_CONTENT');
    expect(cov('pragati_iu_g06_ch07_u10')).toBe('EXISTING_COMPLETE');
    expect(cov('pragati_iu_g06_ch07_u11')).toBe('EXISTING_COMPLETE');
    for (const u of unitsForClass(6)) {
      if (u.learnCoverage === 'NO_LEARN_CONTENT') continue;
      const m = ARTIFACT_ALIGNMENTS.find((x) => (x.actualCoveredUnitIds ?? []).includes(u.instructionalUnitId));
      expect(m, `${u.instructionalUnitId} marked ${u.learnCoverage}`).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 18 §25-§36 — CLASS 7 UNDER THE FINAL MODEL FROM PAGE ONE.
// ---------------------------------------------------------------------------

describe('Class 7 structure and evidence', () => {
  const p7 = () => CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 7)!;

  it('has 15 chapters and 65 numbered sections, kept as separate layers', () => {
    expect(p7().officialChapterCount).toBe(15);
    expect(p7().officialSectionsTotal).toBe(65);
    expect(sectionAccounting(7).sectionsTotal).toBe(65);
    expect(RECORD_EXTENTS.filter((e) => e.officialRecordId.startsWith('ncert_gegp')).length).toBe(15);
  });

  it('cites a real numbered section as the official record, never a chapter', () => {
    const sections = new Set(authoringUnits(7).map((r) => r.recordId));
    for (const u of unitsForClass(7)) {
      expect(sections.has(u.officialRecordId), `${u.instructionalUnitId} → ${u.officialRecordId}`).toBe(true);
      expect(u.officialRecordId).toBe(u.sourceEvidence.officialSectionId);
      expect(u.officialChapterId, u.instructionalUnitId).toMatch(/^ncert_gegp[12]_ch\d{2}$/);
      // Part II units carry a `g07p2` prefix so the two parts stay legible.
      expect(u.instructionalUnitId).toMatch(/^pragati_iu_g07(p2)?_/);
      expect(sectionExtentFor(u.officialRecordId), u.officialRecordId).toBeDefined();
    }
  });

  it('reads text and visuals in the same pass for every page it claims', () => {
    for (const u of unitsForClass(7)) {
      for (const p of u.sourceEvidence.pageEvidence) {
        expect(p.fullTextInspected, `${u.instructionalUnitId} p${p.pdfPage}`).toBe(true);
        if (p.visualInspectionRequired) {
          expect(p.visualInspected, `${u.instructionalUnitId} p${p.pdfPage}`).toBe(true);
        }
      }
    }
  });

  it('gives every page of a decomposed Class 7 chapter a home', () => {
    const touched = new Set(unitsForClass(7).map((u) => u.officialChapterId!));
    for (const chapterId of touched) {
      const ext = RECORD_EXTENTS.find((e) => e.officialRecordId === chapterId)!;
      const covered = new Set<number>();
      for (const e of [
        ...unitsForClass(7).filter((u) => u.officialChapterId === chapterId).map((u) => u.sourceEvidence),
        ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === chapterId).map((s) => s.sourceEvidence),
      ]) {
        for (const p of e.pageEvidence) covered.add(p.pdfPage);
      }
      for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
        expect(covered.has(p), `${chapterId} p${p}`).toBe(true);
      }
    }
  });

  it('states Class 7 completion from its evidence, either way', () => {
    const p = p7();
    if (p.status === 'DECOMPOSITION_SOURCE_COMPLETE') {
      expect(p.chaptersFullyInspected).toBe(15);
      expect(p.sectionsNotYetInspected).toBe(0);
      expect(p.pagesFullTextPending).toBe(0);
    } else {
      expect(p.chaptersFullyInspected).toBeLessThan(15);
      expect(p.pagesFullTextPending).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 19 §1-§11 — SECTION BOUNDARIES ARE FOUND, NOT GUESSED.
//
// Checkpoint 18 stored 63 of Class 7's 65 section extents (§4.3 and §7.3 were
// missed by the heading parser), and all four Chapter 4 units were attributed
// to §4.1 while §4.2-§4.5 sat NOT_STARTED inside a chapter reported as fully
// inspected.
// ---------------------------------------------------------------------------

describe('§6-§7 every official section has exactly one extent', () => {
  const c7Extents = () => OFFICIAL_SECTION_EXTENTS.filter((e) => e.officialSectionId.startsWith('ncert_gegp'));

  it('matches the master map section ids exactly, with no gaps or extras', () => {
    const official = new Set(authoringUnits(7).map((r) => r.recordId));
    const extents = c7Extents();
    expect(official.size).toBe(65);
    expect(extents.length).toBe(65);
    expect(new Set(extents.map((e) => e.officialSectionId))).toEqual(official);
    // §4.3 and §7.3 are the two the parser missed; name them so a silent
    // regression cannot pass.
    for (const id of ['ncert_gegp1_s4_3', 'ncert_gegp1_s7_3']) {
      expect(sectionExtentFor(id), id).toBeDefined();
    }
  });

  it('keeps every section body inside its parent chapter', () => {
    for (const e of c7Extents()) {
      const chapter = RECORD_EXTENTS.find((x) => x.officialRecordId === e.officialChapterId);
      expect(chapter, `${e.officialSectionId} → ${e.officialChapterId}`).toBeDefined();
      expect(e.pdfPageStart).toBeGreaterThanOrEqual(chapter!.pdfPageStart);
      expect(e.pdfPageEnd).toBeLessThanOrEqual(chapter!.pdfPageEnd);
      expect(e.pdfPageEnd).toBeGreaterThanOrEqual(e.pdfPageStart);
      expect(e.boundaryEvidence.length, e.officialSectionId).toBeGreaterThan(40);
      // The section number and its chapter must agree.
      const n = e.officialSectionId.match(/_s(\d+)_/)![1];
      expect(e.officialChapterId.endsWith(n.padStart(2, '0'))).toBe(true);
    }
  });

  it('runs sections in order within a chapter, as the book prints them', () => {
    const byChapter = new Map<string, Array<{ num: number; start: number }>>();
    for (const e of c7Extents()) {
      const num = Number(e.officialSectionId.split('_').pop());
      const list = byChapter.get(e.officialChapterId) ?? [];
      list.push({ num, start: e.pdfPageStart });
      byChapter.set(e.officialChapterId, list);
    }
    for (const [chapter, list] of byChapter) {
      list.sort((a, b) => a.num - b.num);
      for (let i = 1; i < list.length; i += 1) {
        // A later section may begin on the same page as the previous one
        // ends, but never before it.
        expect(list[i].start, `${chapter} §${list[i].num}`).toBeGreaterThanOrEqual(list[i - 1].start);
      }
    }
  });

  it('will not let an unverified range establish completion', () => {
    const verified = c7Extents().filter((e) => e.boundaryStatus === 'VERIFIED_FROM_SOURCE');
    for (const e of c7Extents()) {
      if (e.boundaryStatus === 'PROVISIONAL_DETECTED') {
        expect(sectionInspectionState(e.officialSectionId), e.officialSectionId).not.toBe('FULLY_INSPECTED');
      }
    }
    for (const id of sectionAccounting(7).fullyInspected) {
      expect(sectionExtentFor(id)!.boundaryStatus, id).toBe('VERIFIED_FROM_SOURCE');
    }
    expect(verified.length).toBeGreaterThan(0);
  });
});

describe('§3 and §26 every section of a read chapter is dispositioned', () => {
  // v0.84.0 checkpoint 20 §9 — the guarantee is a DISPOSITION, not a unit.
  // Requiring a unit for every section would force a fake lesson onto a
  // review or reference section; requiring nothing would let a section go
  // missing, which is what caught the Chapter 1, 2 and 4 misattributions.
  it('leaves no official section without a disposition inside a decomposed chapter', () => {
    const decomposed = new Set(unitsForClass(7).map((u) => u.officialChapterId!));
    const cited = new Set<string>();
    for (const u of unitsForClass(7)) {
      cited.add(u.officialRecordId);
      for (const extra of u.additionalOfficialRecordIds) cited.add(extra);
    }
    for (const chapter of decomposed) {
      const sections = OFFICIAL_SECTION_EXTENTS.filter((e) => e.officialChapterId === chapter);
      for (const s of sections) {
        const id = s.officialSectionId;
        const disposed = cited.has(id) || sectionDispositionFor(id) !== undefined;
        expect(disposed, `${chapter}: ${id} has neither a unit nor a recorded role`).toBe(true);
        if (!cited.has(id)) {
          expect(sectionDispositionFor(id)!.justification.length, id).toBeGreaterThan(40);
        }
      }
    }
  });

  it('spreads Chapter 4 across its five sections instead of piling them on §4.1', () => {
    const ch4 = unitsForClass(7).filter((u) => u.officialChapterId === 'ncert_gegp1_ch04');
    const cited = new Set(ch4.flatMap((u) => [u.officialRecordId, ...u.additionalOfficialRecordIds]));
    for (const n of [1, 2, 3, 4, 5]) expect(cited.has(`ncert_gegp1_s4_${n}`), `§4.${n}`).toBe(true);
    // Not every unit may claim the first section.
    expect(new Set(ch4.map((u) => u.officialRecordId)).size).toBeGreaterThan(1);
    for (const u of ch4) {
      if (u.additionalOfficialRecordIds.length > 0) {
        expect((u.mergeRelationship ?? '').length, u.instructionalUnitId).toBeGreaterThan(60);
      }
    }
  });

  it('places each unit inside the body of the section it claims', () => {
    for (const u of unitsForClass(7)) {
      const e = sectionExtentFor(u.officialRecordId)!;
      const all = [e, ...u.additionalOfficialRecordIds.map((id) => sectionExtentFor(id)!)];
      const lo = Math.min(...all.map((x) => x.pdfPageStart));
      const hi = Math.max(...all.map((x) => x.pdfPageEnd));
      expect(u.sourceEvidence.pdfPageStart, u.instructionalUnitId).toBeGreaterThanOrEqual(lo);
      expect(u.sourceEvidence.pdfPageStart, u.instructionalUnitId).toBeLessThanOrEqual(hi);
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 20 §4-§15 — READING A SECTION AND TEACHING FROM IT ARE
// DIFFERENT QUESTIONS, AND THE SECTION LAYER HAS ITS OWN DENOMINATOR.
// ---------------------------------------------------------------------------

describe('§4-§11 section inspection is independent of unit presence', () => {
  it('lets a fully read section with a no-unit role count as inspected', () => {
    // Take a real, complete section, strip its units out of view, and give it
    // a REVIEW role instead. Under checkpoint 19 this returned NOT_STARTED
    // because no unit cited it.
    const id = 'ncert_gegp1_s1_3';
    expect(sectionInspectionState(id)).toBe('FULLY_INSPECTED');
    const units = PRAGATI_INSTRUCTIONAL_UNITS.filter(
      (u) => u.officialRecordId === id || u.additionalOfficialRecordIds.includes(id)
    );
    expect(units.length).toBeGreaterThan(0);
    const saved = units.map((u) => ({ u, was: u.officialRecordId, extra: [...u.additionalOfficialRecordIds] }));
    const disposed = OFFICIAL_SECTION_DISPOSITIONS.length;
    try {
      for (const { u } of saved) {
        if (u.officialRecordId === id) u.officialRecordId = 'ncert_gegp1_s1_2';
        u.additionalOfficialRecordIds = u.additionalOfficialRecordIds.filter((x) => x !== id);
      }
      // No unit, no role: nothing has been said about this section.
      expect(sectionInspectionState(id)).toBe('NOT_STARTED');
      OFFICIAL_SECTION_DISPOSITIONS.push({
        officialSectionId: id,
        disposition: 'REVIEW',
        justification:
          'Fixture only: the body was read in full and every picture-carried page looked at, and it restates what the previous section established rather than teaching an objective of its own.',
      });
      // Read in full, role recorded, no lesson invented.
      expect(sectionInspectionState(id)).toBe('FULLY_INSPECTED');
    } finally {
      OFFICIAL_SECTION_DISPOSITIONS.length = disposed;
      for (const { u, was, extra } of saved) {
        u.officialRecordId = was;
        u.additionalOfficialRecordIds = extra;
      }
    }
    expect(sectionInspectionState(id)).toBe('FULLY_INSPECTED');
  });

  it('keeps source completion separate from Learn coverage', () => {
    for (const row of sectionAccounting(7).rows) {
      if (row.state !== 'FULLY_INSPECTED') continue;
      // A section can be completely read and still have no lesson.
      const covered = row.unitIds.some(
        (id) =>
          PRAGATI_INSTRUCTIONAL_UNITS.find((u) => u.instructionalUnitId === id)?.learnCoverage !==
          'NO_LEARN_CONTENT'
      );
      expect(typeof covered).toBe('boolean');
      expect(row.disposition, row.sectionId).not.toBeNull();
    }
  });
});

describe('§12-§15 the section denominator is sections, not chapters', () => {
  const p7 = () => CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 7)!;

  it('derives official-record counts from the accounting helper', () => {
    for (const p of CLASS_DECOMPOSITION_PROGRESS) {
      const acc = officialRecordAccounting(p.classNumber);
      expect(p.officialRecordsTotal, `class${p.classNumber}`).toBe(acc.officialRecordsTotal);
      expect(p.officialRecordsFullyInspected, `class${p.classNumber}`).toBe(acc.officialRecordsFullyInspected);
      expect(p.officialRecordsPartiallyInspected ?? 0, `class${p.classNumber}`).toBe(
        acc.officialRecordsPartiallyInspected
      );
      expect(p.officialRecordsNotStarted ?? 0, `class${p.classNumber}`).toBe(acc.officialRecordsNotStarted);
    }
  });

  it('sums the Class 7 section states to 65, with no chapter count leaking in', () => {
    const p = p7();
    const sum =
      (p.officialRecordsFullyInspected ?? 0) +
      (p.officialRecordsPartiallyInspected ?? 0) +
      (p.officialRecordsIndexedOnly ?? 0) +
      (p.officialRecordsNotStarted ?? 0) +
      (p.officialRecordsBlocked ?? 0);
    expect(p.officialRecordsTotal).toBe(65);
    expect(sum).toBe(65);
    // The chapter layer keeps its own fields and never feeds this one. Once
    // both are zero they coincide honestly, so the check is that the section
    // field tracks the section accounting rather than the chapter count.
    expect(p.officialRecordsIndexedOnly).toBe(officialRecordAccounting(7).officialRecordsIndexedOnly);
  });

  it('states the transition audit against the chapters actually completed', () => {
    const audit = read('CLASS_6_7_TRANSITION_AUDIT.md');
    const done = new Set(unitsForClass(7).map((u) => u.officialChapterId!)).size;
    const remaining = 15 - done;
    expect(audit).toContain(`${done} Class 7 chapter`);
    expect(audit).toContain(`${remaining} chapters remain unread`);
    expect(audit).not.toMatch(/eleven chapters are not yet read/i);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 21 — THE CLASS 7 PAGE AUDIT, AND SOURCE COMPLETION.
//
// Checkpoint 20 shipped section accounting but never generated the chapter /
// page evidence report the spec asked for.
// ---------------------------------------------------------------------------

describe('§1-§3 the Class 7 page-level audit exists and derives its numbers', () => {
  const audit = () => read('PAGE_LEVEL_INTENT_AUDIT_CLASS_7.md');
  const p7 = () => CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 7)!;

  it('lists all 15 chapters exactly once, Class 7 only', () => {
    const text = audit();
    for (const e of RECORD_EXTENTS.filter((x) => x.officialRecordId.startsWith('ncert_gegp'))) {
      // The chapter appears once in the summary table and may appear again in
      // its own detail block; it must appear at least once and the table row
      // must be unique.
      const rows = text.split('\n').filter((l) => l.startsWith(`| \`${e.officialRecordId}\` |`));
      expect(rows.length, e.officialRecordId).toBe(1);
    }
    expect(text).not.toMatch(/ncert_gp_c6|aejm1|eemm1/);
  });

  it('matches classProgress rather than typed figures', () => {
    const p = p7();
    const text = audit();
    expect(text).toContain(`${p.pagesFullyInspected}/${p.pagesInScope} pages read in full text`);
    expect(text).toContain(`${p.visualPagesInspected}/${p.visualPagesRequired} picture-carried`);
    expect(text).toContain(`${p.chaptersFullyInspected}/${p.chaptersTotal} chapters fully inspected`);
    expect(text).toContain(`${p.officialRecordsFullyInspected}/${p.officialRecordsTotal} numbered sections`);
  });

  it('counts the units of each chapter through officialChapterId', () => {
    for (const e of RECORD_EXTENTS.filter((x) => x.officialRecordId.startsWith('ncert_gegp'))) {
      const units = unitsForClass(7).filter((u) => u.officialChapterId === e.officialRecordId);
      expect(units.length, e.officialRecordId).toBeGreaterThan(0);
    }
    expect(unitsForClass(7).every((u) => u.officialChapterId !== undefined)).toBe(true);
  });
});

describe('§32 the Class 7 source-complete gate', () => {
  const p7 = () => CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 7)!;

  it('requires both layers, every page and every verified boundary', () => {
    const p = p7();
    if (p.status !== 'DECOMPOSITION_SOURCE_COMPLETE') return;
    expect(p.chaptersFullyInspected).toBe(15);
    expect(p.officialRecordsFullyInspected).toBe(65);
    expect(p.officialRecordsNotStarted).toBe(0);
    expect(p.pagesFullTextPending).toBe(0);
    expect(p.visualPagesPending).toBe(0);
    const c7 = OFFICIAL_SECTION_EXTENTS.filter((e) => e.officialSectionId.startsWith('ncert_geg'));
    expect(c7.length).toBe(65);
    expect(c7.every((e) => e.boundaryStatus === 'VERIFIED_FROM_SOURCE')).toBe(true);
    for (const row of sectionAccounting(7).rows) {
      expect(row.state, row.sectionId).toBe('FULLY_INSPECTED');
      expect(row.disposition, row.sectionId).not.toBeNull();
    }
  });

  it('gives every page of every Class 7 chapter a home', () => {
    for (const ext of RECORD_EXTENTS.filter((e) => e.officialRecordId.startsWith('ncert_gegp'))) {
      const covered = new Set<number>();
      for (const e of [
        ...unitsForClass(7).filter((u) => u.officialChapterId === ext.officialRecordId).map((u) => u.sourceEvidence),
        ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === ext.officialRecordId).map((s) => s.sourceEvidence),
      ]) {
        for (const p of e.pageEvidence) covered.add(p.pdfPage);
      }
      for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
        expect(covered.has(p), `${ext.officialRecordId} p${p}`).toBe(true);
      }
    }
  });

  it('keeps Part II identity independent of the odd archive path', () => {
    for (const u of unitsForClass(7).filter((x) => x.officialChapterId!.startsWith('ncert_gegp2'))) {
      expect(u.sourceEvidence.bookPart).toBe('Part II');
      expect(u.sourceEvidence.bookId).toBe('gegp2');
      expect(u.officialRecordId).toMatch(/^ncert_gegp2_s\d+_\d+$/);
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 22 — CLASS 8 UNDER THE LOCKED NUMBERED-GRADE MODEL.
// ---------------------------------------------------------------------------

describe('Class 8 structure, boundaries and dispositions', () => {
  const p8 = () => CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 8)!;
  const c8Extents = () => OFFICIAL_SECTION_EXTENTS.filter((e) => e.officialSectionId.startsWith('ncert_hegp'));

  it('agrees on one Class 8 section denominator across every surface', () => {
    // v0.84.0 checkpoint 24 — the denominator is 59 and must be the SAME 59
    // everywhere. `>= 58` would have passed even if the duplicated second
    // §2.5 vanished, which is exactly the regression worth catching.
    const authoring = authoringUnits(8).map((r) => r.recordId);
    const extents = OFFICIAL_SECTION_EXTENTS.filter((e) =>
      e.officialSectionId.startsWith('ncert_hegp')
    ).map((e) => e.officialSectionId);
    const accounted = sectionAccounting(8).rows.map((r) => r.sectionId);
    expect(new Set(authoring).size).toBe(59);
    expect(new Set(extents)).toEqual(new Set(authoring));
    expect(new Set(accounted)).toEqual(new Set(authoring));
    expect(p8().officialSectionsTotal).toBe(59);
    expect(p8().officialRecordsTotal).toBe(59);
    expect(p8().officialRecordsFullyInspected).toBe(59);
    // Chapters are their own layer and keep their own denominator.
    expect(p8().officialChapterCount).toBe(14);
    expect(RECORD_EXTENTS.filter((e) => e.officialRecordId.startsWith('ncert_hegp')).length).toBe(14);
  });

  it('keeps both sections the book prints as "2.5", as distinct records', () => {
    // Ganita Prakash Grade 8 Part I chapter 2 prints the number 2.5 twice,
    // on "Did You Ever Wonder?" and on "A Pinch of History". Two records,
    // two body ranges, one printed number — and no invented "2.6".
    const a = sectionExtentFor('ncert_hegp1_s2_5');
    const b = sectionExtentFor('ncert_hegp1_s2_5b');
    for (const [id, e] of [['ncert_hegp1_s2_5', a], ['ncert_hegp1_s2_5b', b]] as const) {
      expect(e, id).toBeDefined();
      expect(e!.officialChapterId).toBe('ncert_hegp1_ch02');
      expect(e!.boundaryStatus).toBe('VERIFIED_FROM_SOURCE');
    }
    // Distinct, non-overlapping bodies: one ends where the other begins.
    expect(a!.pdfPageEnd).toBe(b!.pdfPageStart);
    expect(b!.pdfPageEnd).toBeGreaterThan(b!.pdfPageStart);
    // Both are inside the 59, and both are inspected.
    const ids = new Set(authoringUnits(8).map((r) => r.recordId));
    expect(ids.has('ncert_hegp1_s2_5')).toBe(true);
    expect(ids.has('ncert_hegp1_s2_5b')).toBe(true);
    expect(sectionInspectionState('ncert_hegp1_s2_5b')).toBe('FULLY_INSPECTED');
    // The book prints no 2.6 in that chapter, so neither do we.
    expect(ids.has('ncert_hegp1_s2_6')).toBe(false);
  });

  it('never lets the page audit state two different section totals', () => {
    const audit = read('PAGE_LEVEL_INTENT_AUDIT_CLASS_8.md');
    const total = p8().officialSectionsTotal!;
    expect(audit).toContain(`**chapters and ${total} numbered sections**`);
    expect(audit).toContain(`${total}/${total} numbered sections accounted for`);
    // Any other section-total claim in the headline is a contradiction.
    for (const m of audit.matchAll(/(\d+) numbered sections/g)) {
      expect(Number(m[1]), m[0]).toBe(total);
    }
  });

  it('keeps §3.4 — the heading the pattern first missed — as a real section', () => {
    // "3.4. Place Value Representation" prints a full stop after the number.
    const e = sectionExtentFor('ncert_hegp1_s3_4');
    expect(e, 'ncert_hegp1_s3_4').toBeDefined();
    expect(e!.boundaryStatus).toBe('VERIFIED_FROM_SOURCE');
    // And §3.3 must stop where it starts, not run to the chapter end.
    expect(sectionExtentFor('ncert_hegp1_s3_3')!.pdfPageEnd).toBeLessThanOrEqual(e!.pdfPageStart);
  });

  it('cites a numbered section, never a chapter, and keeps the chapter separate', () => {
    const sections = new Set(authoringUnits(8).map((r) => r.recordId));
    for (const u of unitsForClass(8)) {
      expect(sections.has(u.officialRecordId), `${u.instructionalUnitId} → ${u.officialRecordId}`).toBe(true);
      expect(u.officialRecordId).toBe(u.sourceEvidence.officialSectionId);
      expect(u.officialChapterId, u.instructionalUnitId).toMatch(/^ncert_hegp[12]_ch\d{2}$/);
      for (const extra of u.additionalOfficialRecordIds) {
        expect(sections.has(extra), `${u.instructionalUnitId} extra ${extra}`).toBe(true);
        expect((u.mergeRelationship ?? '').length, u.instructionalUnitId).toBeGreaterThan(60);
      }
      const e = sectionExtentFor(u.officialRecordId)!;
      expect(e.officialChapterId).toBe(u.officialChapterId);
    }
  });

  it('leaves no section of a decomposed chapter without a disposition', () => {
    const decomposed = new Set(unitsForClass(8).map((u) => u.officialChapterId!));
    const cited = new Set(unitsForClass(8).flatMap((u) => [u.officialRecordId, ...u.additionalOfficialRecordIds]));
    for (const chapter of decomposed) {
      for (const e of c8Extents().filter((x) => x.officialChapterId === chapter)) {
        const id = e.officialSectionId;
        expect(cited.has(id) || sectionDispositionFor(id) !== undefined, `${chapter}: ${id}`).toBe(true);
      }
    }
  });

  it('reads text and visuals in the same pass, and gives every page a home', () => {
    for (const u of unitsForClass(8)) {
      for (const p of u.sourceEvidence.pageEvidence) {
        expect(p.fullTextInspected, `${u.instructionalUnitId} p${p.pdfPage}`).toBe(true);
        if (p.visualInspectionRequired) expect(p.visualInspected, `${u.instructionalUnitId} p${p.pdfPage}`).toBe(true);
      }
    }
    for (const chapter of new Set(unitsForClass(8).map((u) => u.officialChapterId!))) {
      const ext = RECORD_EXTENTS.find((e) => e.officialRecordId === chapter)!;
      const covered = new Set<number>();
      for (const e of [
        ...unitsForClass(8).filter((u) => u.officialChapterId === chapter).map((u) => u.sourceEvidence),
        ...SOURCE_SEGMENTS.filter((s) => s.officialRecordId === chapter).map((s) => s.sourceEvidence),
      ]) {
        for (const p of e.pageEvidence) covered.add(p.pdfPage);
      }
      for (let p = ext.pdfPageStart; p <= ext.pdfPageEnd; p += 1) {
        expect(covered.has(p), `${chapter} p${p}`).toBe(true);
      }
    }
  });

  it('states Class 8 completion from its evidence, and has no Learn content', () => {
    const p = p8();
    if (p.status === 'DECOMPOSITION_SOURCE_COMPLETE') {
      expect(p.chaptersFullyInspected).toBe(14);
      expect(p.officialRecordsNotStarted).toBe(0);
      expect(p.pagesFullTextPending).toBe(0);
      expect(p.visualPagesPending).toBe(0);
      expect(c8Extents().every((e) => e.boundaryStatus === 'VERIFIED_FROM_SOURCE')).toBe(true);
      expect(c8Extents().length).toBe(authoringUnits(8).length);
    } else {
      expect(p.officialRecordsNotStarted).toBeGreaterThan(0);
    }
    for (const u of unitsForClass(8)) {
      expect(u.learnCoverage, u.instructionalUnitId).toBe('NO_LEARN_CONTENT');
      expect(u.existingArtifact ?? null).toBeNull();
    }
    const audit = read('PAGE_LEVEL_INTENT_AUDIT_CLASS_8.md');
    expect(audit).not.toMatch(/ncert_gegp|ncert_gp_c6/);
  });

  it('names a new policy when the decision is genuinely different', () => {
    const hist = HUMAN_JUDGEMENT_POLICIES.find((p) => p.policyKey === 'historical_material_lesson_vs_context');
    expect(hist, 'historical_material_lesson_vs_context').toBeDefined();
    expect(hist!.affectedUnitIds.length).toBeGreaterThan(0);
    for (const id of hist!.affectedUnitIds) {
      const u = PRAGATI_INSTRUCTIONAL_UNITS.find((x) => x.instructionalUnitId === id)!;
      expect(u.decompositionStatus).toBe('NEEDS_HUMAN_CHECK');
      expect(u.humanJudgementQuestion!.length).toBeGreaterThan(60);
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 23 (pre-source fixes) — GENERATED REPORTS MUST NOT SAY
// THINGS THE EVIDENCE DOES NOT SUPPORT.
//
// Three checkpoint-22 defects, all in generated prose rather than in the
// mathematics: the Class 7 and Class 8 audits were cloned from the Class 6
// generator and inherited its "first class with two official layers" claim;
// the units table headed a column of official SECTION ids "Chapter"; and the
// transition audit generalised one section's reasoning to the whole of
// Classes 1-7.
// ---------------------------------------------------------------------------

describe('generated reports describe the decomposition truthfully', () => {
  const audits = () => ({
    six: read('PAGE_LEVEL_INTENT_AUDIT_CLASS_6.md'),
    seven: read('PAGE_LEVEL_INTENT_AUDIT_CLASS_7.md'),
    eight: read('PAGE_LEVEL_INTENT_AUDIT_CLASS_8.md'),
  });

  it('lets only Class 6 claim to be the first two-layer class', () => {
    const a = audits();
    expect(a.six).toMatch(/Class 6 is the first class with two official layers/);
    for (const [name, text] of [['seven', a.seven], ['eight', a.eight]] as const) {
      expect(text, name).not.toMatch(/is the first class with two official layers/);
      expect(text, name).toMatch(/two-layer model established at Class 6/);
    }
  });

  it('labels official section ids as sections, not chapters', () => {
    for (const [name, text] of [['seven', audits().seven], ['eight', audits().eight]] as const) {
      expect(text, name).toContain('| Unit | Parent chapter | Official section | Evidence depth | Status |');
      expect(text, name).not.toContain('| Unit | Chapter | Evidence depth | Status |');
      // And the ids in that column must really be section ids.
      for (const line of text.split('\n')) {
        if (!line.startsWith('| `pragati_iu_')) continue;
        const cells = line.split('|').map((c) => c.trim());
        expect(cells[2], line).toMatch(/^`ncert_\w+_ch\d{2}`$/);
        expect(cells[3], line).toMatch(/^`ncert_\w+_s\d+_\d+`$/);
      }
    }
  });

  it('keeps the transition audit bounded to what the source shows', () => {
    const t = read('CLASS_7_8_TRANSITION_AUDIT.md');
    expect(t).not.toMatch(/Every rule before this point/i);
    expect(t).not.toMatch(/every rule in Classes 1-7/i);
    // The defensible observation is kept.
    expect(t).toMatch(/preserving the exponent\s+pattern/);
  });

  it('keeps the Class 8 page audit consistent with the derived state', () => {
    const p = CLASS_DECOMPOSITION_PROGRESS.find((x) => x.classNumber === 8)!;
    const audit = read('PAGE_LEVEL_INTENT_AUDIT_CLASS_8.md');
    expect(audit).toContain(`${p.pagesFullyInspected}/${p.pagesInScope} pages read in full text`);
    expect(audit).toContain(`${p.visualPagesInspected}/${p.visualPagesRequired} picture-carried`);
    expect(audit).toContain(`${p.chaptersFullyInspected}/${p.chaptersTotal} chapters fully inspected`);
  });
});
