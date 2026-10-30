// v0.84.0 §23 — THE COMPLETENESS CONTRACT.
//
// The failure this guards against is the one Number Play already
// demonstrated: a unit that looks authored-ready because a record exists,
// rather than because someone read the pages. Every rule below is about
// keeping "a record exists" and "we know what to teach" apart.

import { artifactSourceKind } from '../authoredSection';
import { officialSectionById } from '../officialSections';
import { instructionalCoverageFor, validateContextualCoverage } from '../instructionalUnits';
import decompositionData from '../data/instructionalDecomposition.json';
const SECTION_DISPOSITIONS = (decompositionData as { officialSectionDispositions?: { officialSectionId: string }[] })
  .officialSectionDispositions ?? [];
import { authoredSectionsForChapter, allAuthoredSections } from '../authoredSections';
import { validateAuthoredSection, sequenceLeaks } from '../sectionValidators';
import { validateVisual } from '../visualSpecification';
import { categoryTotals, normalisedValues } from '../dataDisplaySpecification';
import {
  auditAlgorithmSection,
  auditAlgorithmClaims,
  gcd,
  subtractionSteps,
  divisionSteps,
  divisorCandidates,
} from '../algorithmAudit';
import {
  auditProbabilitySection,
  auditProbabilityLanguage,
  auditProbabilityValues,
  auditCountsAgainstFractions,
} from '../probabilityAudit';
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CLASS_DECOMPOSITION_PROGRESS,
  sourceInspectionFor,
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
  PRODUCTION_WAVES,
  MASTER_SOURCES,
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
  it('knows the Class 9 chapter, section and subsection denominators', () => {
    // v0.84.0 checkpoint 25 — Ganita Manjari Part II was retrieved from
    // ncert.nic.in and verified, so the series is complete and the chapter
    // denominator is settled. Part II's numbered sections have not been
    // counted from the body, so that level is still not enumerated.
    // v0.84.0 checkpoint 26 — every level is now verified against the pages,
    // so no Class 9 level may still report 'unknown'.
    expect(textbookDenominatorKnown(9)).toBe(true);
    for (const v of Object.values(textbookCounts(9))) expect(v).not.toBe('unknown');
  });

  it('separates an unread class from one that is read but not decomposed', () => {
    // v0.84.0 checkpoint 29 — these were one state until Class 9 was read in
    // full with zero units. An unread class must still say NOT STARTED; a
    // read one must not, because saying so about 404 read pages is false.
    const md = read('INSTRUCTIONAL_MASTER_BLUEPRINT.md');
    for (const n of CLASS_NUMBERS.filter((x) => !STARTED.includes(x))) {
      const row = md.split('\n').find((l) => l.startsWith(`| Class ${n} |`))!;
      const si = sourceInspectionFor(n);
      if (si?.fullyRead) {
        expect(row, `class${n}`).toContain('source read');
        expect(row, `class${n}`).toContain(`${si.pagesFullTextInspected} full text`);
        expect(row, `class${n}`).not.toContain('| 0 |' + ' NOT STARTED');
        // Reading does not invent units.
        expect(unitsForClass(n).length, `class${n}`).toBe(0);
      } else {
        expect(row, `class${n}`).toContain('NOT STARTED');
      }
    }
  });

  it('derives source reading independently of unit decomposition', () => {
    // The permanent requirement: Classes 10-12 will hit this too.
    const si = sourceInspectionFor(9)!;
    expect(si.pagesAccounted).toBe(404);
    expect(si.pagesFullTextInspected).toBe(404);
    expect(si.visualPagesRequired).toBe(si.visualPagesInspected);
    expect(si.fullyRead).toBe(true);
    // v0.84.0 checkpoint 31 — Class 9 now also has decomposition progress and
    // units. The separation still has to hold: reading comes from the ledger,
    // not from the unit count, and Class 11 has neither.
    expect(sourceInspectionFor(11)).toBeNull();
    expect(unitsForClass(11).length).toBe(0);
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
      // v0.84.0 checkpoint 43 — a policy's affected units are those that
      // raised it, not only those still waiting. Once a policy is resolved
      // its units leave NEEDS_HUMAN_CHECK, and the registry must still
      // record which units the decision covered.
      const actual = PRAGATI_INSTRUCTIONAL_UNITS.filter(
        (u) => u.humanJudgementPolicyKey === p.policyKey
      ).map((u) => u.instructionalUnitId);
      expect(new Set(p.affectedUnitIds)).toEqual(new Set(actual));
      // An unresolved policy still has every one of its units flagged.
      if (!p.resolution) {
        for (const id of p.affectedUnitIds) {
          expect(flagged.some((u) => u.instructionalUnitId === id), id).toBe(true);
        }
      }
    }
    // Every unit a policy covers is either still flagged or resolved by a
    // decision — never silently dropped from the registry.
    const covered = HUMAN_JUDGEMENT_POLICIES.flatMap((p) => p.affectedUnitIds);
    const resolved = PRAGATI_INSTRUCTIONAL_UNITS.filter(
      (u) => u.decompositionStatus === 'RESOLVED_CONTEXTUAL_MERGE'
    );
    expect(covered.length).toBe(flagged.length + resolved.length);
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
        // v0.84.0 checkpoint 43 — an extra section arrives either from a
        // mathematical merge, which needs a merge relationship, or from a
        // resolved contextual-merge policy, which needs a unit pointing
        // here. One of the two must explain it; neither may be absent.
        const carriedByPolicy = PRAGATI_INSTRUCTIONAL_UNITS.some(
          (x) =>
            x.officialRecordId === extra &&
            x.decompositionStatus === 'RESOLVED_CONTEXTUAL_MERGE' &&
            x.contextualCoverage?.coveredByArtifactId === u.instructionalUnitId
        );
        if (!carriedByPolicy) {
          expect((u.mergeRelationship ?? '').length, u.instructionalUnitId).toBeGreaterThan(60);
        }
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
      // v0.84.0 checkpoint 43 — decided. The question that raised the
      // policy is kept as the record of what was asked; the status now
      // records the answer.
      expect(u.decompositionStatus).toBe('RESOLVED_CONTEXTUAL_MERGE');
      expect(u.humanJudgementQuestion!.length).toBeGreaterThan(60);
      expect(u.contextualCoverage?.policyKey).toBe('historical_material_lesson_vs_context');
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

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 25 — CLASS 9 SOURCE RESOLUTION, NOT DECOMPOSITION.
//
// Ganita Manjari Part II was retrieved from ncert.nic.in and verified, so the
// Class 9 textbook chapter denominator is settled at 14. Its numbered sections
// have NOT been counted from the body, and no Class 9 teaching exists yet.
// ---------------------------------------------------------------------------

describe('Class 9 source resolution', () => {
  const c9 = () => MASTER_RECORDS.filter((r) => r.classNumber === 9);

  it('records both published parts as separate official sources', () => {
    const chapters = c9().filter((r) => r.level === 'chapter' && r.recordId.startsWith('ncert_'));
    expect(chapters.length).toBe(14);
    const parts = new Set(chapters.map((r) => r.recordId.split('_')[1]));
    expect(parts).toEqual(new Set(['iemh1', 'iemh2']));
    // Part II is chapters 9-14 and nothing else.
    const two = chapters.filter((r) => r.recordId.startsWith('ncert_iemh2')).map((r) => Number(r.number));
    expect(two.sort((a, b) => a - b)).toEqual([9, 10, 11, 12, 13, 14]);
  });

  it('keeps the CBSE syllabus a separate hierarchy from the textbook', () => {
    const cbse = c9().filter((r) => r.recordId.startsWith('cbse_'));
    const book = c9().filter((r) => r.recordId.startsWith('ncert_'));
    expect(cbse.length).toBeGreaterThan(0);
    // No record may belong to both, and no syllabus record may claim a
    // textbook source id.
    for (const r of cbse) expect(r.recordId.startsWith('ncert_')).toBe(false);
    for (const r of book) expect(r.recordId.startsWith('cbse_')).toBe(false);
    // The syllabus names chapters the textbook does not; neither count may be
    // used as the other's denominator.
    const cbseChapters = cbse.filter((r) => r.level === 'chapter').length;
    const bookChapters = book.filter((r) => r.level === 'chapter').length;
    expect(cbseChapters).not.toBe(bookChapters);
  });

  it('keeps Class 9 source completion separate from its authoring state', () => {
    // v0.84.0 checkpoint 31 — Class 9 now has units, so the old "zero units"
    // assertion is retired. What must still hold is that decomposing the
    // source authored nothing.
    const p9 = CLASS_DECOMPOSITION_PROGRESS.find((p) => p.classNumber === 9)!;
    expect(p9.status).toBe('DECOMPOSITION_SOURCE_COMPLETE');
    expect(unitsForClass(9).length).toBeGreaterThan(0);
    for (const u of unitsForClass(9)) {
      expect(u.existingArtifact, u.instructionalUnitId).toBeFalsy();
      expect(u.humanReviewStatus, u.instructionalUnitId).not.toBe('sent');
    }
  });

  it('publishes a source manifest that reconciles with the files it names', () => {
    const man = JSON.parse(read('CLASS_9_SOURCE_MANIFEST.json'));
    expect(man.classNumber).toBe(9);
    expect(man.chapterDenominator).toBe(14);
    expect(man.chapterDenominatorStatus).toBe('VERIFIED_FROM_SOURCE');
    // v0.84.0 checkpoint 27 — the manifest must agree with canonical data,
    // never contradict it. Both denominators are verified now.
    expect(man.sectionDenominator).toBe(74);
    expect(man.subsectionDenominator).toBe(51);
    expect(String(man.sectionDenominatorStatus)).toMatch(/^VERIFIED_FROM_SOURCE/);
    expect(String(man.subsectionDenominatorStatus)).toMatch(/^VERIFIED_FROM_SOURCE/);
    // And it must not overstate what the package itself allows.
    expect(String(man.packagingNote)).toMatch(/cannot re-hash/);
    expect(man.sources.length).toBe(man.sourceCount);
    expect(man.sources.reduce((n: number, s: any) => n + s.pdfPageCount, 0)).toBe(man.totalPdfPages);
    // One file per chapter, plus one prelims file per part.
    const chapterFiles = man.sources.filter((s: any) => s.officialChapterNumber !== null);
    expect(new Set(chapterFiles.map((s: any) => s.officialChapterNumber)).size).toBe(14);
    for (const s of man.sources) {
      expect(s.sha256, s.filename).toMatch(/^[0-9a-f]{64}$/);
      expect(s.officialArchiveUrl, s.filename).toMatch(/^https:\/\/ncert\.nic\.in\/textbook\/pdf\//);
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 26 — CLASS 9 SOURCE STRUCTURE, VERIFIED AGAINST PAGES.
//
// Checkpoint 25's detector was unreliable: headings print both in small caps
// and with a trailing full stop ("4.4. More Identities"), so a naive pattern
// silently dropped §2.4, §3.1, §4.4 and §13.4. Each was found on the rendered
// page. Every count below derives from canonical records, never from a
// detector total and never hand-typed.
// ---------------------------------------------------------------------------

describe('Class 9 official structure', () => {
  const c9 = () => MASTER_RECORDS.filter((r) => r.classNumber === 9 && r.recordId.startsWith('ncert_'));
  const lvl = (l: string) => c9().filter((r) => r.level === l);

  it('derives 14 chapters across two separate source identities', () => {
    const chapters = lvl('chapter');
    expect(chapters.length).toBe(14);
    const one = chapters.filter((r) => r.recordId.startsWith('ncert_iemh1_'));
    const two = chapters.filter((r) => r.recordId.startsWith('ncert_iemh2_'));
    expect(one.length).toBe(8);
    expect(two.length).toBe(6);
    // The parts never merge into one source id.
    expect(new Set(chapters.map((r) => r.recordId.split('_')[1]))).toEqual(new Set(['iemh1', 'iemh2']));
  });

  it('derives the section denominator from the records, per part and overall', () => {
    const sections = lvl('section');
    const one = sections.filter((r) => r.recordId.startsWith('ncert_iemh1_'));
    const two = sections.filter((r) => r.recordId.startsWith('ncert_iemh2_'));
    // Part I's earlier count of 53 was re-checked against the current files
    // and confirmed, including §4.4, which prints with a trailing full stop.
    expect(one.length).toBe(53);
    expect(two.length).toBe(21);
    expect(sections.length).toBe(one.length + two.length);
    expect(one.some((r) => r.number === '4.4')).toBe(true);
  });

  it('keeps every section inside exactly one real Class 9 chapter', () => {
    const chapterIds = new Set(lvl('chapter').map((r) => r.recordId));
    for (const s of lvl('section')) {
      expect(chapterIds.has(s.parentId!), s.recordId).toBe(true);
      // A section id must name the same part as its chapter.
      expect(s.recordId.split('_')[1]).toBe(s.parentId!.split('_')[1]);
    }
    // No section invents a chapter the book does not have.
    expect(new Set(lvl('section').map((s) => s.parentId)).size).toBeLessThanOrEqual(14);
  });

  it('records Chapter 9 as genuinely carrying no numbered sections', () => {
    // Propositions and their Converses runs on Statement / Proposition /
    // Discussion headings with no numbers at all — confirmed by rendering
    // all seven of its pages, not by a detector returning nothing.
    const ch9 = lvl('section').filter((s) => s.parentId === 'ncert_iemh2_ch09');
    expect(ch9.length).toBe(0);
    expect(lvl('chapter').some((c) => c.recordId === 'ncert_iemh2_ch09')).toBe(true);
  });

  it('derives the subsection denominator rather than leaving it unknown', () => {
    const subs = lvl('subsection');
    expect(subs.length).toBeGreaterThan(0);
    const sectionIds = new Set(lvl('section').map((r) => r.recordId));
    for (const s of subs) {
      expect(sectionIds.has(s.parentId!), s.recordId).toBe(true);
      // A printed N.M.K number, never one invented from typography.
      expect(s.number, s.recordId).toMatch(/^\d+\.\d+\.\d+$/);
    }
    // The class-level count is now a number, not 'unknown'.
    expect(typeof textbookCounts(9).subsection).toBe('number');
  });

  it('covers every Class 9 section with a unit or a stated disposition', () => {
    const secs = lvl('section').map((r) => r.recordId);
    const covered = new Set<string>();
    for (const u of unitsForClass(9)) {
      if (u.officialRecordId) covered.add(u.officialRecordId);
      for (const r of u.additionalOfficialRecordIds) covered.add(r);
    }
    const unaccounted = secs.filter((id) => !covered.has(id) && !sectionDispositionFor(id));
    expect(unaccounted, 'every section needs a unit or a disposition').toEqual([]);
    expect(secs.filter((id) => covered.has(id)).length).toBe(73);
    expect(secs.filter((id) => sectionDispositionFor(id)).length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 27 — ONE CURRENT CLASS 9 STORY.
//
// Checkpoint 26 left current canonical surfaces still saying Part II did not
// exist and both denominators were unknown, while the records next to them
// held 14 chapters, 74 sections and 51 subsections. A grep for two exact
// phrases found nothing because the stale claims were worded differently.
// This checks meaning, and it distinguishes current state from history.
// ---------------------------------------------------------------------------

describe('Class 9 current-state claims agree with the records', () => {
  const STALE = [
    /only ganita manjari part i is published/i,
    /no part ii is listed/i,
    /part ii published, or ncert confirms/i,
    /denominator for class 9 remains unknown/i,
    /sub-?section count is unknown/i,
    /rest of the\s+class 9 textbook does not exist/i,
    /class total unknown/i,
  ];

  it('leaves no stale claim in active canonical data or code', () => {
    // Historical findings may keep their original wording, but only behind
    // an explicit resolved status and a historicalText field.
    const ev = JSON.parse(read('src/curriculum/data/mathCurriculumMasterEvidence.json'));
    for (const s of ev.sources.filter((x: any) => x.grade === 9)) {
      const text = `${s.levelEvidence ?? ''} ${s.volumeCompletenessNote ?? ''}`;
      for (const re of STALE) expect(text, `${s.sourceId} :: ${re}`).not.toMatch(re);
    }
    for (const f of ev.findings ?? []) {
      if (!String(f.id ?? '').includes('class9')) continue;
      if (STALE.some((re) => re.test(String(f.text ?? '')))) {
        // Allowed only when plainly marked as history.
        expect(String(f.status), f.id).toMatch(/RESOLVED|SUPERSEDED/);
        expect(String(f.text), f.id).toMatch(/^HISTORICAL/);
        expect(f.resolution, f.id).toBeTruthy();
      }
    }
  });

  it('no longer gates Class 9 planning on Part II being published', () => {
    const wave = PRODUCTION_WAVES.find((w) => w.classes.includes(9))!;
    for (const re of STALE) {
      expect(wave.reason, `reason :: ${re}`).not.toMatch(re);
      expect(wave.gate, `gate :: ${re}`).not.toMatch(re);
    }
    // The gate must name the work that actually remains.
    expect(wave.gate).toMatch(/source decomposition|intent|visual/i);
  });

  it('reports one consistent set of Class 9 numbers everywhere', () => {
    const sections = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'section' && r.recordId.startsWith('ncert_')
    ).length;
    const subs = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'subsection' && r.recordId.startsWith('ncert_')
    ).length;
    const man = JSON.parse(read('CLASS_9_SOURCE_MANIFEST.json'));
    expect(man.sectionDenominator).toBe(sections);
    expect(man.subsectionDenominator).toBe(subs);
    expect(man.chapterDenominator).toBe(14);
    expect(textbookCounts(9).section).toBe(sections);
    expect(textbookCounts(9).subsection).toBe(subs);
    // Both Class 9 findings are resolved, so no current surface may claim
    // either denominator is open.
    const ev = JSON.parse(read('src/curriculum/data/mathCurriculumMasterEvidence.json'));
    for (const id of ['F1_class9_book_vs_syllabus', 'F6_class9_subsections']) {
      const f = (ev.findings ?? []).find((x: any) => x.id === id);
      expect(f, id).toBeTruthy();
      expect(String(f.status), id).toMatch(/RESOLVED|SUPERSEDED/);
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 27 — CLASS 9 PAGE AND VISUAL ACCOUNTING.
// ---------------------------------------------------------------------------

describe('Class 9 page accounting', () => {
  const acc = () => JSON.parse(read('src/curriculum/data/instructionalDecomposition.json')).class9PageAccounting;

  it('covers every source page exactly once, with no orphans', () => {
    const a = acc();
    expect(a).toBeDefined();
    const man = JSON.parse(read('CLASS_9_SOURCE_MANIFEST.json'));
    expect(a.totalPdfPages).toBe(man.totalPdfPages);
    expect(a.pages.length).toBe(a.totalPdfPages);
    const seen = new Set(a.pages.map((p: any) => `${p.officialRecordId}#${p.pdfPage}`));
    expect(seen.size).toBe(a.pages.length);
    for (const p of a.pages) {
      expect(p.category, `${p.officialRecordId} p${p.pdfPage}`).toBeTruthy();
      expect(typeof p.visualInspectionRequired).toBe('boolean');
    }
  });

  it('inspected every page it marked visual-required', () => {
    const req = acc().pages.filter((p: any) => p.visualInspectionRequired);
    expect(req.length).toBeGreaterThan(0);
    expect(req.every((p: any) => p.visualInspected)).toBe(true);
    // And nothing claims inspection it did not do.
    for (const p of acc().pages) {
      if (!p.visualInspectionRequired) expect(p.visualInspected).toBe(false);
    }
  });

  it('promotes a record to inspected only once intent is recorded too', () => {
    // v0.84.0 checkpoint 31 — pages read AND body-grounded intent, so Class 9
    // sections may now be page_level_inspected. The rule being protected is
    // that one without the other is not enough.
    expect(acc().pages.every((p: any) => p.fullTextInspected === true)).toBe(true);
    const ev = JSON.parse(read('src/curriculum/data/mathCurriculumMasterEvidence.json'));
    for (const r of ev.records.filter((x: any) => x.grade === 9 && x.level === 'section')) {
      if (r.intentStatus === 'page_level_inspected') {
        expect(r.intentBasis, r.recordId).toBe('BODY_GROUNDED');
      }
    }
    // Decomposition is not authoring.
    for (const u of unitsForClass(9)) expect(u.existingArtifact, u.instructionalUnitId).toBeFalsy();
  });

  it('accounts for Chapter 9 even though it has no numbered sections', () => {
    const ch9 = acc().pages.filter((p: any) => p.officialRecordId === 'ncert_iemh2_ch09');
    expect(ch9.length).toBeGreaterThan(0);
    expect(MASTER_RECORDS.filter((r) => r.parentId === 'ncert_iemh2_ch09' && r.level === 'section').length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 28 — THE CLASS 9 BODY HAS BEEN READ.
//
// Checkpoint 27 classified every page and inspected every picture-carried one,
// but deliberately left fullTextInspected false. This checkpoint reads the
// bodies, refines the page roles from what is actually on the page, and gives
// Chapter 9 — which prints no numbered section at all — source segments built
// from its mathematics rather than from headings.
// ---------------------------------------------------------------------------

describe('Class 9 full-text reading', () => {
  const acc = () => JSON.parse(read('src/curriculum/data/instructionalDecomposition.json')).class9PageAccounting;

  it('reads every source page and keeps the ledger exact', () => {
    const a = acc();
    const man = JSON.parse(read('CLASS_9_SOURCE_MANIFEST.json'));
    expect(a.pages.length).toBe(man.totalPdfPages);
    expect(new Set(a.pages.map((p: any) => `${p.officialRecordId}#${p.pdfPage}`)).size).toBe(a.pages.length);
    expect(a.pages.every((p: any) => p.fullTextInspected === true)).toBe(true);
  });

  it('refines page roles beyond one broad unnumbered bucket', () => {
    const roles = new Set(acc().pages.map((p: any) => p.category));
    // The 183-page bucket is gone; the roles that replaced it are the ones
    // a future author actually needs to tell apart.
    for (const r of ['EXERCISE_SET', 'WORKED_EXAMPLE', 'CHAPTER_SUMMARY', 'PROOF_OR_THEOREM']) {
      expect(roles.has(r), r).toBe(true);
    }
    expect(roles.has('UNNUMBERED_CHAPTER_OPENING')).toBe(false);
    expect(roles.size).toBeLessThan(15);
  });

  it('keeps visual-required and visual-inspected in exact agreement', () => {
    const req = acc().pages.filter((p: any) => p.visualInspectionRequired);
    expect(req.length).toBeGreaterThan(0);
    expect(req.every((p: any) => p.visualInspected)).toBe(true);
    for (const p of acc().pages) if (!p.visualInspectionRequired) expect(p.visualInspected).toBe(false);
  });
});

describe('Chapter 9 survives having no numbered sections', () => {
  const segs = () => SOURCE_SEGMENTS.filter((s) => s.officialRecordId === 'ncert_iemh2_ch09');

  it('represents its mathematics through source segments', () => {
    expect(MASTER_RECORDS.filter((r) => r.parentId === 'ncert_iemh2_ch09' && r.level === 'section').length).toBe(0);
    const s = segs();
    expect(s.length).toBeGreaterThan(0);
    // Every page of the chapter belongs to a segment: nothing is lost.
    const covered = new Set<number>();
    for (const x of s) {
      for (let p = x.sourceEvidence.pdfPageStart; p <= x.sourceEvidence.pdfPageEnd; p += 1) covered.add(p);
    }
    const ledger = JSON.parse(read('src/curriculum/data/instructionalDecomposition.json')).class9PageAccounting.pages
      .filter((p: any) => p.officialRecordId === 'ncert_iemh2_ch09');
    for (const p of ledger) expect(covered.has(p.pdfPage), `p${p.pdfPage}`).toBe(true);
  });

  it('carries real intent and real evidence, not a heading restated', () => {
    for (const s of segs()) {
      expect((s as any).mathematicalIntent, s.sourceSegmentId).toMatch(/\[S\]/);
      expect(String((s as any).mathematicalIntent).length, s.sourceSegmentId).toBeGreaterThan(120);
      expect(s.sourceEvidence.evidenceDepth).toBe('FULL_PAGE_INSPECTED');
      expect(s.sourceEvidence.pageEvidence.every((p: any) => p.fullTextInspected)).toBe(true);
    }
  });

  it('never dresses a Pragati segment as an official NCERT record', () => {
    for (const s of SOURCE_SEGMENTS) {
      expect(s.sourceSegmentId.startsWith('pragati_srcseg_'), s.sourceSegmentId).toBe(true);
      expect(s.sourceSegmentId.startsWith('ncert_')).toBe(false);
    }
  });

  it('builds Chapter 9 units on source segments, never on invented sections', () => {
    const ch9 = unitsForClass(9).filter((u) => u.officialChapterId === 'ncert_iemh2_ch09');
    expect(ch9.length).toBeGreaterThan(0);
    for (const u of ch9) {
      expect((u as { sourceSegmentIds?: string[] }).sourceSegmentIds?.length, u.instructionalUnitId).toBeGreaterThan(0);
      // The chapter prints no section, so none may be invented for it.
      expect(u.officialRecordId).toBe('ncert_iemh2_ch09');
      expect(u.additionalOfficialRecordIds).toEqual([]);
    }
    expect(MASTER_RECORDS.filter((r) => r.parentId === 'ncert_iemh2_ch09' && r.level === 'section').length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 29 — PART II IS ITS OWN BOOK.
//
// The Part II source record was created by copying Part I's and editing a few
// fields, so it inherited Part I's printed subtitle, portal code, prelims URL,
// prelims hash and archive hash. The archive URL and ISBN were right, which is
// exactly why nothing noticed.
// ---------------------------------------------------------------------------

describe('Class 9 Part II source identity', () => {
  const src = (id: string) => MASTER_SOURCES.find((s) => s.sourceId === id)!;

  it('prints its own part in its own subtitle', () => {
    for (const s of MASTER_SOURCES.filter((x) => x.part)) {
      const other = s.part === 'Part I' ? 'Part II' : 'Part I';
      expect(s.printedSubtitle ?? '', s.sourceId).not.toContain(`(${other})`);
    }
    expect(src('ncert_iemh2').printedSubtitle).toContain('(Part II)');
  });

  it("never inherits the other part's source identity", () => {
    const one = src('ncert_iemh1');
    const two = src('ncert_iemh2');
    for (const f of ['url', 'sha256', 'isbn', 'printedSubtitle'] as const) {
      expect(two[f], f).toBeTruthy();
      expect(two[f], f).not.toBe(one[f]);
    }
    // The raw evidence carries the portal and prelims identity too.
    const ev = JSON.parse(read('src/curriculum/data/mathCurriculumMasterEvidence.json'));
    const raw = (id: string) => ev.sources.find((x: any) => x.sourceId === id);
    for (const f of ['portalCode', 'portalUrl', 'prelimsUrl', 'prelimsSha256', 'archiveSha256']) {
      expect(raw('ncert_iemh2')[f], f).toBeTruthy();
      expect(raw('ncert_iemh2')[f], f).not.toBe(raw('ncert_iemh1')[f]);
    }
  });

  it('matches the durable manifest hash for each archive', () => {
    const man = JSON.parse(read('CLASS_9_SOURCE_MANIFEST.json'));
    const byPart = Object.fromEntries(man.archives.map((a: any) => [a.bookPart, a]));
    expect(src('ncert_iemh1').sha256).toBe(byPart['Part I'].sha256);
    expect(src('ncert_iemh2').sha256).toBe(byPart['Part II'].sha256);
    expect(byPart['Part I'].sha256).not.toBe(byPart['Part II'].sha256);
  });

  it('renders both Class 9 rows with their own identity', () => {
    const md = read('CURRENT_MATH_BOOKS_CLASSES_1_12.md');
    const rows = md.split('\n').filter((l) => l.startsWith('| Class 9 | Ganita Manjari |'));
    expect(rows.length).toBe(2);
    const one = rows.find((r) => r.includes('| Part I |'))!;
    const two = rows.find((r) => r.includes('| Part II |'))!;
    expect(one).toContain('(Part I)');
    expect(two).toContain('(Part II)');
    expect(two).not.toContain('(Part I)');
    expect(one).toContain(src('ncert_iemh1').sha256!.slice(0, 16));
    expect(two).toContain(src('ncert_iemh2').sha256!.slice(0, 16));
  });

  it('no longer says Part II sections are uncounted', () => {
    const ev = JSON.parse(read('src/curriculum/data/mathCurriculumMasterEvidence.json'));
    const chapters = ev.records.filter(
      (r: any) => r.grade === 9 && r.level === 'chapter' && r.recordId.startsWith('ncert_iemh2')
    );
    expect(chapters.length).toBe(6);
    for (const c of chapters) {
      expect(String(c.evidence), c.recordId).not.toMatch(/NOT yet counted/i);
      // Chapter 9's zero stays a verified result, not a rewritten "found".
      if (c.recordId === 'ncert_iemh2_ch09') expect(String(c.evidence)).toMatch(/NO numbered section/);
      else expect(String(c.evidence)).toMatch(/numbered sections were located/);
    }
  });

  it('states what each manifest version field means', () => {
    const man = JSON.parse(read('CLASS_9_SOURCE_MANIFEST.json'));
    expect(man.generatedBy).toBeUndefined();
    expect(man.sourceSetCreatedAt).toBeTruthy();
    expect(man.lastStructurallyVerifiedAt).toBeTruthy();
    expect(man.lastRegeneratedAt).toBeTruthy();
    expect(String(man.versionFieldSemantics)).toMatch(/creation stamp/);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 29 — PDF PAGE AND PRINTED FOLIO ARE NOT THE SAME NUMBER.
//
// Found while trying to resolve section bodies for the intent pass: Part I's
// 53 section records store a PRINTED FOLIO in startPage, while Part II's 21
// store a PDF page. Nothing caught it because each set is internally
// consistent and the counts were never in doubt. Until it is repaired, no
// Part I section may claim a resolved body extent.
// ---------------------------------------------------------------------------

describe('Class 9 section page basis', () => {
  const secs = () =>
    JSON.parse(read('src/curriculum/data/mathCurriculumMasterEvidence.json')).records.filter(
      (r: any) => r.grade === 9 && r.level === 'section'
    );

  // v0.84.0 checkpoint 30 — the flag is gone because the defect is repaired;
  // the test now asserts the repair rather than the flag.
  it('has no record left on an unresolved page basis', () => {
    const one = secs().filter((r: any) => r.recordId.startsWith('ncert_iemh1'));
    const two = secs().filter((r: any) => r.recordId.startsWith('ncert_iemh2'));
    expect(one.length).toBe(53);
    expect(two.length).toBe(21);
    for (const r of [...one, ...two]) {
      expect(r.startPageBasisWarning, r.recordId).toBeUndefined();
      expect(r.pageCoordinateBasis, r.recordId).toBe('PDF_PAGE');
    }
  });

  it('blocks any source-complete claim while the basis is unresolved', () => {
    const unresolved = secs().filter((r: any) => r.startPageBasisWarning).length;
    if (unresolved > 0) {
      const report = read('V0.84.0_CHECKPOINT_REPORT.md');
      expect(report).toContain('CLASS_9_DECOMPOSITION_INCOMPLETE');
      expect(report).not.toContain('CLASS_9_DECOMPOSITION_SOURCE_COMPLETE`\n');
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 30 — ONE PAGE COORDINATE SYSTEM.
//
// Part I's section records held a PRINTED FOLIO in startPage while Part II's
// held a PDF page. Both sets were internally consistent, so counts never
// looked wrong. Every Class 9 record now carries pdfStartPage/pdfEndPage
// (programmatic) and printedFolio* (what the book shows) as separate fields,
// and every heading was re-located and checked on its rendered page.
// ---------------------------------------------------------------------------

describe('Class 9 page coordinates', () => {
  const EV = () => JSON.parse(read('src/curriculum/data/mathCurriculumMasterEvidence.json'));
  const c9 = (level: string) =>
    EV().records.filter((r: any) => r.grade === 9 && r.level === level && r.recordId.startsWith('ncert_'));
  const PAGES: Record<string, number> = {
    ncert_iemh1_ch01: 15, ncert_iemh1_ch02: 25, ncert_iemh1_ch03: 27, ncert_iemh1_ch04: 24,
    ncert_iemh1_ch05: 26, ncert_iemh1_ch06: 37, ncert_iemh1_ch07: 19, ncert_iemh1_ch08: 27,
    ncert_iemh2_ch09: 7, ncert_iemh2_ch10: 29, ncert_iemh2_ch11: 14, ncert_iemh2_ch12: 34,
    ncert_iemh2_ch13: 38, ncert_iemh2_ch14: 42,
  };

  it('gives every section and subsection an explicit PDF basis', () => {
    const all = [...c9('section'), ...c9('subsection')];
    expect(all.length).toBe(74 + 51);
    for (const r of all) {
      expect(r.pageCoordinateBasis, r.recordId).toBe('PDF_PAGE');
      expect(typeof r.pdfStartPage, r.recordId).toBe('number');
      expect(typeof r.pdfEndPage, r.recordId).toBe('number');
      expect(r.startPageBasisWarning, r.recordId).toBeUndefined();
    }
  });

  it('keeps every PDF coordinate inside its own file', () => {
    const parentChapter = (r: any) =>
      r.level === 'section' ? r.parentId : EV().records.find((x: any) => x.recordId === r.parentId).parentId;
    for (const r of [...c9('section'), ...c9('subsection')]) {
      const n = PAGES[parentChapter(r)];
      expect(n, r.recordId).toBeGreaterThan(0);
      expect(r.pdfStartPage, r.recordId).toBeGreaterThanOrEqual(1);
      expect(r.pdfEndPage, r.recordId).toBeLessThanOrEqual(n);
      expect(r.pdfStartPage, r.recordId).toBeLessThanOrEqual(r.pdfEndPage);
    }
  });

  it('stores printed folio separately and never as a coordinate', () => {
    const secs = c9('section');
    // Folio fields exist as their own keys and are allowed to be absent
    // (many Class 9 pages carry no printed number at all) or to exceed the
    // file's page count, because they are a different coordinate system.
    for (const r of secs) {
      expect('printedFolioStart' in r, r.recordId).toBe(true);
      if (r.printedFolioStart !== null) expect(typeof r.printedFolioStart).toBe('number');
    }
    const withFolio = secs.filter((r: any) => typeof r.printedFolioStart === 'number');
    expect(withFolio.some((r: any) => r.printedFolioStart !== r.pdfStartPage)).toBe(true);
  });

  it('contains every subsection inside its parent section', () => {
    const byId = Object.fromEntries(EV().records.map((r: any) => [r.recordId, r]));
    for (const s of c9('subsection')) {
      const p = byId[s.parentId];
      expect(p, s.recordId).toBeTruthy();
      expect(s.pdfStartPage, s.recordId).toBeGreaterThanOrEqual(p.pdfStartPage);
      expect(s.pdfEndPage, s.recordId).toBeLessThanOrEqual(p.pdfEndPage);
    }
  });
});

describe('Class 9 mathematical intent', () => {
  const EV = () => JSON.parse(read('src/curriculum/data/mathCurriculumMasterEvidence.json'));
  const lvl = (l: string) =>
    EV().records.filter((r: any) => r.grade === 9 && r.level === l && r.recordId.startsWith('ncert_'));

  it('records body-grounded intent for all 74 sections', () => {
    const secs = lvl('section');
    expect(secs.length).toBe(74);
    for (const r of secs) {
      expect(r.intentBasis, r.recordId).toBe('BODY_GROUNDED');
      expect(String(r.mathematicalIntent), r.recordId).toMatch(/\[S\]/);
      // Not a restated title: the intent must say more than the heading does.
      expect(String(r.mathematicalIntent).length, r.recordId).toBeGreaterThan(90);
      expect(String(r.mathematicalIntent).trim(), r.recordId).not.toBe(String(r.title).trim());
    }
  });

  it('characterises all 51 subsections with a role and intent', () => {
    const subs = lvl('subsection');
    expect(subs.length).toBe(51);
    const ROLES = new Set([
      'DEFINITION', 'CONCEPTUAL_DEVELOPMENT', 'PROCEDURE', 'DERIVATION', 'PROOF',
      'SPECIAL_CASE', 'APPLICATION', 'INVESTIGATION', 'EXAMPLE_SET', 'EXTENSION',
    ]);
    for (const r of subs) {
      expect(ROLES.has(r.subsectionRole), `${r.recordId} ${r.subsectionRole}`).toBe(true);
      expect(String(r.mathematicalIntent), r.recordId).toMatch(/\[S\]/);
      expect(typeof r.materiallyChangesDemand, r.recordId).toBe('boolean');
    }
  });

  it('uses the recorded intent as the basis for the units built on it', () => {
    // Every Class 9 unit must point at sections whose intent was written
    // from the body — the units rest on that evidence, not on headings.
    const byId = Object.fromEntries(
      JSON.parse(read('src/curriculum/data/mathCurriculumMasterEvidence.json')).records.map((r: any) => [r.recordId, r])
    );
    for (const u of unitsForClass(9)) {
      for (const id of [u.officialRecordId, ...u.additionalOfficialRecordIds]) {
        const rec = byId[id as string];
        if (!rec || rec.level !== 'section') continue;
        expect(rec.intentBasis, `${u.instructionalUnitId} -> ${id}`).toBe('BODY_GROUNDED');
      }
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 32 — THE CLASS 9 AUTHORING PILOT.
//
// One chapter is authored to prove a Secondary Stage standard. The point of
// these tests is that authoring it changed exactly one thing: six lessons
// now exist. No other Class 9 chapter gained content, no unit status moved,
// and nothing became reviewed by being written.
// ---------------------------------------------------------------------------

describe('Class 9 authoring pilot', () => {
  const PILOT = 'ncert_iemh2_ch12';
  const pilot = () => authoredSectionsForChapter(PILOT);

  it('authors six lessons from the first pilot chapter', () => {
    expect(pilot().length).toBe(6);
    // v0.84.0 checkpoint 33 — Circles is now a second authored chapter, so
    // the "nowhere else" check moved to the second-pilot suite, where it
    // allows exactly these two and no others.
    // v0.84.0 checkpoint 34 — Wave 1 added three more authored chapters, so
    // the "nowhere else" check now lives in the wave suite, which lists the
    // five permitted chapters exactly.
  });

  it('keeps the decomposition untouched by the authoring', () => {
    const units = unitsForClass(9);
    expect(units.length).toBe(93);
    expect(units.filter((u) => u.decompositionStatus === 'READY_FOR_AUTHORING').length).toBe(92);
    // v0.84.0 checkpoint 43 — §3.1 moved from NEEDS_HUMAN_CHECK to
    // RESOLVED_CONTEXTUAL_MERGE when the policy was decided. That is a
    // recorded human decision, not authoring drift: no unit was added,
    // removed or re-pointed, and the total still accounts for every one.
    expect(units.filter((u) => u.decompositionStatus === 'NEEDS_HUMAN_CHECK').length).toBe(0);
    expect(units.filter((u) => u.decompositionStatus === 'RESOLVED_CONTEXTUAL_MERGE').length).toBe(1);
    expect(units.filter((u) => u.decompositionStatus === 'READY_FOR_AUTHORING').length +
      units.filter((u) => u.decompositionStatus === 'RESOLVED_CONTEXTUAL_MERGE').length).toBe(93);
  });

  it('passes the authoring validators with no placeholder content', () => {
    for (const s of pilot()) {
      expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
      expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
      const prose = [
        s.learningGoal,
        ...s.explanation,
        s.summary,
        s.nextStep,
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((t) => `${t.text} ${t.reasoning}`)]),
      ].join(' ');
      expect(prose, s.contentArtifactId).not.toMatch(/TODO|TBD|lorem|placeholder (text|here|content)|\[placeholder/i);
      // Every stage of the student sequence has real content.
      expect(s.explanation.length, s.contentArtifactId).toBeGreaterThan(2);
      expect(s.workedExamples.length, s.contentArtifactId).toBeGreaterThan(1);
      expect(s.guidedPractice.length, s.contentArtifactId).toBeGreaterThan(1);
      expect(s.independentPractice.length, s.contentArtifactId).toBeGreaterThan(1);
      expect(s.reasoningApplication.length, s.contentArtifactId).toBeGreaterThan(0);
    }
  });

  it('gives every visual a mathematical purpose and real alt text', () => {
    for (const s of pilot()) {
      expect(s.visuals.length, s.contentArtifactId).toBeGreaterThan(0);
      for (const v of s.visuals) {
        expect(v.status, s.contentArtifactId).toBe('concept_specific');
        // Alt text must carry the mathematics, not describe the picture.
        expect(v.altText.length, s.contentArtifactId).toBeGreaterThan(60);
        expect(v.caption.trim().length, s.contentArtifactId).toBeGreaterThan(0);
      }
    }
  });

  it('explains reasoning in every worked-example step', () => {
    for (const s of pilot()) {
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
        }
      }
    }
  });

  it('keeps every pilot lesson a draft, not a reviewed or published one', () => {
    for (const s of pilot()) expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
  });

  it('leaks no reviewer language or internal id into student-facing prose', () => {
    for (const s of pilot()) {
      const studentProse = [
        s.learningGoal,
        ...s.explanation,
        ...s.vocabulary.map((v) => `${v.term} ${v.meaning}`),
        ...s.guidedPractice.map((g) => `${g.prompt} ${g.hint} ${g.rationale}`),
        s.summary,
      ].join(' ');
      expect(studentProse, s.contentArtifactId).not.toMatch(/ncert_|pragati_iu_|checkpoint|READY_FOR_AUTHORING|reviewer/i);
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 33 — THE SECOND PILOT: CIRCLES.
//
// Chapter 12 never exercised a merged unit and needed one visual type. These
// tests pin what Chapter 5 added: provenance for both sections of a merge,
// scope differentiation between split siblings, and circle geometry inside
// the same figure spec rather than a second one.
// ---------------------------------------------------------------------------

describe('Class 9 second authoring pilot', () => {
  const CIRCLES = 'ncert_iemh1_ch05';
  const QUADS = 'ncert_iemh2_ch12';
  const pilot = () => authoredSectionsForChapter(CIRCLES);

  it('authors eight lessons for the second pilot chapter', () => {
    expect(pilot().length).toBe(8);
    expect(authoredSectionsForChapter(QUADS).length).toBe(6);
    // The chapter-level lock moved to the Wave 1 suite at checkpoint 34.
  });

  it('keeps both official sections of the merged lesson in provenance', () => {
    // The decomposition merges §5.1 and §5.2 into one unit. The authored
    // lesson must name both, or §5.2 is authored into invisibility.
    const merged = pilot().find((s) => s.source.officialSectionId === 'ncert_iemh1_s5_1')!;
    expect(merged.source.additionalOfficialSectionIds).toEqual(['ncert_iemh1_s5_2']);
    // Every official section the decomposition assigns to this chapter is
    // covered by some lesson, primary or additional.
    const covered = new Set<string>();
    for (const s of pilot()) {
      covered.add(s.source.officialSectionId);
      for (const extra of s.source.additionalOfficialSectionIds ?? []) covered.add(extra);
    }
    const sections = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'section' && r.parentId === CIRCLES
    ).map((r) => r.recordId);
    expect(sections.length).toBe(8);
    for (const id of sections) expect(covered.has(id), id).toBe(true);
  });

  it('gives split siblings distinct scope rather than two titles for one lesson', () => {
    const byId = new Map<string, typeof pilot>();
    const groups = new Map<string, ReturnType<typeof pilot>>();
    for (const s of pilot()) {
      const k = s.source.officialSectionId;
      groups.set(k, [...(groups.get(k) ?? []), s]);
    }
    const split = [...groups.values()].filter((g) => g.length > 1);
    expect(split.length).toBeGreaterThan(0);
    expect(byId.size).toBe(0);
    for (const siblings of split) {
      const goals = siblings.map((s) => s.learningGoal);
      expect(new Set(goals).size, 'split siblings share a learning goal').toBe(siblings.length);
      // Their explanations must not be the same lesson retold.
      const first = new Set(siblings[0].explanation);
      for (const s of siblings.slice(1)) {
        const shared = s.explanation.filter((p) => first.has(p));
        expect(shared.length, `${s.contentArtifactId} repeats its sibling's explanation`).toBe(0);
      }
      // One sibling must name the other as a prerequisite, so the order is real.
      const ids = siblings.map((s) => s.source.officialSectionId);
      expect(siblings.some((s) => s.sequence.prerequisiteSectionIds.some((p) => ids.includes(p)))).toBe(true);
    }
  });

  it('draws circles inside the shared figure spec, with points truly on them', () => {
    let circlesSeen = 0;
    for (const s of pilot()) {
      for (const v of s.visuals) {
        expect(validateVisual(v), `${s.contentArtifactId} visual`).toEqual([]);
        if (v.type !== 'geometry_figure') continue;
        for (const c of v.circles ?? []) {
          circlesSeen += 1;
          const centre = v.points.find((p) => p.id === c.centre)!;
          const on = c.through ? v.points.find((p) => p.id === c.through) : undefined;
          expect(centre, `${s.contentArtifactId}: circle centre`).toBeTruthy();
          if (!on) continue;
          const r = Math.hypot(on.x - centre.x, on.y - centre.y);
          expect(r, `${s.contentArtifactId}: circle has no radius`).toBeGreaterThan(0);
        }
      }
    }
    expect(circlesSeen, 'the circles pilot should contain circle figures').toBeGreaterThan(4);
  });

  it('passes the same authoring gates as the first pilot', () => {
    for (const s of pilot()) {
      expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
      expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      const prose = [s.learningGoal, ...s.explanation, s.summary].join(' ');
      expect(prose, s.contentArtifactId).not.toMatch(/TODO|TBD|placeholder (text|here|content)|\[placeholder/i);
      expect(prose, s.contentArtifactId).not.toMatch(/ncert_|pragati_iu_|checkpoint/i);
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
        }
      }
      expect(s.visuals.length, s.contentArtifactId).toBeGreaterThan(0);
      expect(s.guidedPractice.length, s.contentArtifactId).toBeGreaterThan(1);
      expect(s.reasoningApplication.length, s.contentArtifactId).toBeGreaterThan(0);
    }
  });

  it('leaves the Chapter 12 artifacts byte-identical in content', () => {
    // A general schema change must not rewrite review-ready artifacts.
    for (const s of authoredSectionsForChapter(QUADS)) {
      expect(s.contentArtifactVersion, s.contentArtifactId).toBe(1);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      // The new provenance field is optional and Chapter 12 does not use it.
      expect(s.source.additionalOfficialSectionIds, s.contentArtifactId).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 34 — WAVE 1: THREE CHAPTERS AT ONCE.
//
// The pilots proved one chapter at a time could be authored well. These tests
// are about the wave: that provenance survives at scale for EVERY authored
// Class 9 chapter rather than for one fixture, that split siblings stay
// differentiated across chapters, and that nothing leaked outside the five
// chapters now authored.
// ---------------------------------------------------------------------------

describe('Class 9 authoring wave 1', () => {
  const AUTHORED = [
    'ncert_iemh1_ch01',
    'ncert_iemh1_ch03',
    'ncert_iemh1_ch06',
    'ncert_iemh1_ch07',
    'ncert_iemh1_ch08',
    'ncert_iemh2_ch09',
    'ncert_iemh2_ch10',
    'ncert_iemh2_ch11',
    'ncert_iemh2_ch14',
    'ncert_iemh2_ch12',
    'ncert_iemh1_ch05',
    'ncert_iemh1_ch02',
    'ncert_iemh1_ch04',
    'ncert_iemh2_ch13',
  ];

  it('authors exactly the five intended chapters and nothing else in Class 9', () => {
    const counts = Object.fromEntries(AUTHORED.map((c) => [c, authoredSectionsForChapter(c).length]));
    expect(counts).toEqual({
      ncert_iemh1_ch01: 5,
      ncert_iemh1_ch03: 8,
      ncert_iemh1_ch06: 11,
      ncert_iemh1_ch07: 6,
      ncert_iemh1_ch08: 7,
      ncert_iemh2_ch09: 2,
      ncert_iemh2_ch10: 4,
      ncert_iemh2_ch11: 4,
      ncert_iemh2_ch14: 7,
      ncert_iemh2_ch12: 6,
      ncert_iemh1_ch05: 8,
      ncert_iemh1_ch02: 6,
      ncert_iemh1_ch04: 9,
      ncert_iemh2_ch13: 9,
    });
    const class9Chapters = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'chapter' && r.recordId.startsWith('ncert_')
    ).map((r) => r.recordId);
    for (const ch of class9Chapters) {
      if (AUTHORED.includes(ch)) continue;
      expect(authoredSectionsForChapter(ch).length, ch).toBe(0);
    }
  });

  it('reconciles authored provenance against official sections for every authored chapter', () => {
    // Class-wide, not a Chapter 5 fixture: no official section of an
    // authored chapter may disappear during authoring, and no lesson may
    // claim a section that is not in its chapter.
    for (const ch of AUTHORED) {
      const sections = MASTER_RECORDS.filter(
        (r) => r.classNumber === 9 && r.level === 'section' && r.parentId === ch
      ).map((r) => r.recordId);
      const claimed = new Set<string>();
      for (const s of authoredSectionsForChapter(ch)) {
        // v0.84.0 checkpoint 41 — reconciliation is source-kind aware. A
        // segment-backed lesson reconciles to its segments, which the
        // Chapter 9 suite checks; it must NOT be made to claim a section,
        // and the official path below is unchanged for everything else.
        if (artifactSourceKind(s.source) === 'source_segment') continue;
        claimed.add(s.source.officialSectionId);
        for (const extra of s.source.additionalOfficialSectionIds ?? []) {
          expect(extra, `${s.contentArtifactId} self-reference`).not.toBe(s.source.officialSectionId);
          claimed.add(extra);
        }
      }
      for (const id of claimed) {
        expect(sections.includes(id) || ch === 'ncert_iemh2_ch12', `${ch} claims ${id}`).toBe(true);
      }
      // Chapter 12's §3.7-style dispositions do not arise here: every
      // section of every Wave-1 chapter must be covered.
      if (ch === 'ncert_iemh2_ch12') continue;
      for (const id of sections) {
        // v0.84.0 checkpoint 42 — §3.1 is the one deliberate gap. It is not
        // lost: its unit is present and blocked under a human policy
        // decision, which the Chapter 3 suite asserts separately. Any OTHER
        // missing section is still a failure.
        // §3.1 is policy-blocked; §3.7 was dispositioned REVIEW at
        // checkpoint 31 because it introduces no new mathematics. Both
        // exemptions are recorded in the decomposition and asserted
        // separately, and any OTHER missing section is still a failure.
        if (id === 'ncert_iemh1_s3_1') continue;
        if (SECTION_DISPOSITIONS.some((x: { officialSectionId: string }) => x.officialSectionId === id)) continue;
        expect(claimed.has(id), `${ch}: ${id} lost in authoring`).toBe(true);
      }
    }
  });

  it('keeps split siblings genuinely different across every authored chapter', () => {
    for (const ch of AUTHORED) {
      const groups = new Map<string, ReturnType<typeof authoredSectionsForChapter>>();
      for (const s of authoredSectionsForChapter(ch)) {
        const k = artifactSourceKind(s.source) === 'source_segment'
          ? (s.source.sourceSegmentIds ?? []).join('+')
          : s.source.officialSectionId;
        groups.set(k, [...(groups.get(k) ?? []), s]);
      }
      for (const siblings of [...groups.values()].filter((g) => g.length > 1)) {
        const goals = siblings.map((s) => s.learningGoal);
        expect(new Set(goals).size, `${ch}: siblings share a goal`).toBe(siblings.length);
        const first = new Set(siblings[0].explanation);
        for (const s of siblings.slice(1)) {
          expect(s.explanation.filter((p) => first.has(p)).length, `${s.contentArtifactId} repeats a sibling`).toBe(0);
        }
      }
    }
  });

  it('holds the authoring standard across all five chapters', () => {
    for (const ch of AUTHORED) {
      for (const s of authoredSectionsForChapter(ch)) {
        expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
        expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
        expect(s.competencyMappingStatus, s.contentArtifactId).toBe('competency_mapping_pending');
        for (const w of s.workedExamples) {
          for (const step of w.steps) {
            expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
          }
        }
        for (const v of s.visuals) expect(validateVisual(v), s.contentArtifactId).toEqual([]);
        const prose = [s.learningGoal, ...s.explanation, s.summary].join(' ');
        expect(prose, s.contentArtifactId).not.toMatch(/TODO|TBD|placeholder (text|here|content)|\[placeholder/i);
        expect(prose, s.contentArtifactId).not.toMatch(/ncert_|pragati_iu_|checkpoint/i);
        expect(s.explanation.length, s.contentArtifactId).toBeGreaterThan(2);
        expect(s.guidedPractice.length, s.contentArtifactId).toBeGreaterThan(1);
        expect(s.independentPractice.length, s.contentArtifactId).toBeGreaterThan(1);
        expect(s.reasoningApplication.length, s.contentArtifactId).toBeGreaterThan(0);
      }
    }
  });

  it('leaves both pilot chapters at version 1 and unreviewed', () => {
    for (const ch of ['ncert_iemh2_ch12', 'ncert_iemh1_ch05']) {
      for (const s of authoredSectionsForChapter(ch)) {
        expect(s.contentArtifactVersion, s.contentArtifactId).toBe(1);
        expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      }
    }
    // Chapter 12 never needed the multi-section field; Chapter 5's merged
    // lesson still carries it.
    expect(
      authoredSectionsForChapter('ncert_iemh2_ch12').every((s) => !s.source.additionalOfficialSectionIds)
    ).toBe(true);
    expect(
      authoredSectionsForChapter('ncert_iemh1_ch05').find((s) => s.source.officialSectionId === 'ncert_iemh1_s5_1')!
        .source.additionalOfficialSectionIds
    ).toEqual(['ncert_iemh1_s5_2']);
  });

  it('leaves the decomposition and the blocked unit untouched', () => {
    const units = unitsForClass(9);
    expect(units.length).toBe(93);
    // v0.84.0 checkpoint 43 — nothing is blocked any more. §3.1 is
    // resolved by contextual merge, so the chapter still has eight
    // standalone lessons for nine units, and that is now a complete state
    // rather than a gap.
    expect(units.filter((u) => u.decompositionStatus === 'NEEDS_HUMAN_CHECK').length).toBe(0);
    expect(authoredSectionsForChapter('ncert_iemh1_ch03').length).toBe(8);
    const ch3 = units.filter((u) => u.officialChapterId === 'ncert_iemh1_ch03');
    expect(ch3.length).toBe(9);
    expect(ch3.filter((u) => u.decompositionStatus === 'RESOLVED_CONTEXTUAL_MERGE').length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 35 — PRE_EXISTING_CLASS_6_SEQUENCE_LEAK_REPAIR.
//
// The leak checkpoint 34 recorded was a false positive in the RULE, not a
// defect in the lesson. §3.3's official title is "Patterns of Numbers on
// the Number Line", and the probe reduced "Fractions on the number line"
// to "number line", so the section was reported for mentioning its own
// subject. No authored artifact was touched by the repair.
// ---------------------------------------------------------------------------

describe('sequence-leak rule repair', () => {
  it('no longer reports a section for mentioning its own official subject', () => {
    const s = allAuthoredSections().find((x) => x.contentArtifactId === 'ncert_gp_c6_s3_3_lesson')!;
    expect(s.source.exactTitle).toMatch(/Number Line/i);
    expect(sequenceLeaks(s)).toEqual([]);
    // The artifact itself was not edited to make this pass.
    expect(s.contentArtifactVersion).toBe(2);
    expect(s.reviewStatus).toBe('authored_draft');
    expect(s.explanation.join(' ')).toMatch(/number line/i);
  });

  it('still catches a genuine leak of material belonging elsewhere', () => {
    const base = allAuthoredSections().find((x) => x.contentArtifactId === 'ncert_gp_c6_s3_3_lesson')!;
    const planted = {
      ...base,
      explanation: [...base.explanation, 'Here we place a fraction on the number line between 0 and 1.'],
    };
    expect(sequenceLeaks(planted).length).toBeGreaterThan(0);
  });

  it('leaves every authored lesson leak-free', () => {
    for (const s of allAuthoredSections()) expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 35 — CHAPTER 1: COORDINATES.
//
// An ordinary production chapter on the stable architecture. The test worth
// having here is coordinate FIDELITY: a figure that labels a point (3, 2)
// and draws it where (2, 3) belongs teaches the exact error the lesson is
// trying to prevent, and no existing validator would catch it.
// ---------------------------------------------------------------------------

describe('Class 9 Chapter 1 — Coordinates', () => {
  const CH = 'ncert_iemh1_ch01';
  const pilot = () => authoredSectionsForChapter(CH);

  it('authors five lessons from four official sections', () => {
    expect(pilot().length).toBe(5);
    const sections = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'section' && r.parentId === CH
    ).map((r) => r.recordId);
    expect(sections.length).toBe(4);
    const claimed = new Set<string>();
    for (const s of pilot()) {
      claimed.add(s.source.officialSectionId);
      for (const extra of s.source.additionalOfficialSectionIds ?? []) claimed.add(extra);
    }
    for (const id of sections) expect(claimed.has(id), `${id} lost in authoring`).toBe(true);
    // §1.1 and §1.2 are merged, so §1.2 survives only through the extra field.
    const merged = pilot().find((s) => s.source.officialSectionId === 'ncert_iemh1_s1_1')!;
    expect(merged.source.additionalOfficialSectionIds).toEqual(['ncert_iemh1_s1_2']);
  });

  it('plots every labelled point at its true position', () => {
    // The figures use 10 svg units per coordinate unit with the origin at
    // (110, 110), y inverted. A point labelled with its pair must be there.
    let checked = 0;
    for (const s of pilot()) {
      for (const v of s.visuals) {
        if (v.type !== 'geometry_figure') continue;
        for (const p of v.points) {
          const m = /\((-?\d+),\s*(-?\d+)\)/.exec(p.label.replace(/\u2212/g, '-'));
          if (!m) continue;
          checked += 1;
          expect(p.x, `${s.contentArtifactId}: ${p.label} x`).toBe(110 + Number(m[1]) * 10);
          expect(p.y, `${s.contentArtifactId}: ${p.label} y`).toBe(110 - Number(m[2]) * 10);
        }
      }
    }
    expect(checked, 'coordinate figures should label their points with pairs').toBeGreaterThan(10);
  });

  it('describes coordinate figures nonvisually by position, not by appearance', () => {
    for (const s of pilot()) {
      for (const v of s.visuals) {
        const alt = v.altText;
        expect(alt.length, s.contentArtifactId).toBeGreaterThan(120);
        // A coordinate description must say where points are relative to the
        // origin or the axes, not merely that a grid is shown.
        expect(alt, s.contentArtifactId).toMatch(/origin|axis|axes/i);
        expect(alt, s.contentArtifactId).toMatch(/units?|above|below|left|right/i);
      }
    }
  });

  it('introduces no mathematics the chapter does not carry', () => {
    const prose = pilot()
      .flatMap((s) => [s.learningGoal, ...s.explanation, s.summary])
      .join(' ')
      .toLowerCase();
    // Slope, gradient and the equation of a line belong to chapter 13.
    expect(prose).not.toMatch(/\bslope\b|\bgradient\b|y = mx/);
    expect(prose).not.toMatch(/section formula|centroid/);
  });

  it('keeps the chapter at the same authoring standard as the rest', () => {
    for (const s of pilot()) {
      expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
      expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      expect(s.competencyMappingStatus, s.contentArtifactId).toBe('competency_mapping_pending');
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 36 — CHAPTER 14: THE REPRESENTATION PILOT.
//
// The question was whether mensuration forces a 3-D model. It did not: the
// chapter teaches from nets, an unrolled rectangle, a rotated triangle and
// a winding activity, all of which the existing 2-D spec already carries.
// These tests pin that outcome so a later change cannot quietly introduce
// a solid primitive without the justification this checkpoint demanded.
// ---------------------------------------------------------------------------

describe('Class 9 Chapter 14 — Surface Area and Volume', () => {
  const CH = 'ncert_iemh2_ch14';
  const chapter = () => authoredSectionsForChapter(CH);

  it('authors seven lessons covering all six official sections', () => {
    expect(chapter().length).toBe(7);
    const sections = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'section' && r.parentId === CH
    ).map((r) => r.recordId);
    expect(sections.length).toBe(6);
    const claimed = new Set<string>();
    for (const s of chapter()) {
      claimed.add(s.source.officialSectionId);
      for (const extra of s.source.additionalOfficialSectionIds ?? []) claimed.add(extra);
    }
    for (const id of sections) expect(claimed.has(id), `${id} lost in authoring`).toBe(true);
  });

  it('uses no 3-D primitive — every figure is a 2-D representation', () => {
    // The architecture verdict, enforced. A figure here is a net, an
    // unrolled surface, a generating triangle or a great circle; none of
    // them needs depth, hidden edges or a solid primitive.
    for (const s of chapter()) {
      for (const v of s.visuals) {
        expect(v.type, s.contentArtifactId).toBe('geometry_figure');
        const keys = Object.keys(v);
        for (const k of keys) {
          expect(
            ['depth', 'solid', 'hiddenEdges', 'faces3d', 'perspective'].includes(k),
            `${s.contentArtifactId} uses a 3-D key: ${k}`
          ).toBe(false);
        }
      }
    }
  });

  it('describes spatial meaning in words rather than leaving it to a picture', () => {
    for (const s of chapter()) {
      for (const v of s.visuals) {
        // A net or an unrolling must say in its alt text what it unfolds
        // from, since a nonvisual reader cannot infer the solid.
        expect(v.altText.length, s.contentArtifactId).toBeGreaterThan(120);
        expect(v.altText, s.contentArtifactId).toMatch(
          /net|unrolled|unfold|flat|arc|sweep|circle|rectangle|triangle/i
        );
      }
    }
  });

  it('keeps square and cubic units distinct in every answer', () => {
    for (const s of chapter()) {
      const answers = [
        ...s.workedExamples.map((w) => w.answer),
        ...s.independentPractice.map((p) => p.answer),
      ].join(' ');
      // Surface areas and volumes both appear throughout; no answer may be
      // left bare of its unit where a measurement is given.
      expect(answers, s.contentArtifactId).toMatch(/square|cubic|pi/i);
    }
    const all = chapter()
      .flatMap((s) => s.workedExamples.map((w) => w.answer))
      .join(' ');
    expect(all).toMatch(/square cent/i);
    expect(all).toMatch(/cubic cent/i);
  });

  it('distinguishes curved from total surface area where the source does', () => {
    const hemi = chapter().find((s) => s.contentArtifactId.includes('hemisphere'))!;
    const prose = [...hemi.explanation, hemi.summary].join(' ').toLowerCase();
    expect(prose).toContain('curved surface');
    expect(prose).toContain('total surface');
    // Its sibling must not repeat the hemisphere treatment.
    const sphere = chapter().find((s) => s.contentArtifactId.includes('sphere_lesson'))!;
    expect(sphere.learningGoal).not.toEqual(hemi.learningGoal);
    expect(sphere.explanation.filter((p) => hemi.explanation.includes(p)).length).toBe(0);
  });

  it('holds the authoring standard and stays unreviewed', () => {
    for (const s of chapter()) {
      expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
      expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      expect(s.competencyMappingStatus, s.contentArtifactId).toBe('competency_mapping_pending');
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 37 — CHAPTER 10: THE DATA PILOT.
//
// A bar drawn at the wrong height does not look like a rendering bug to a
// student; it looks like a fact. So these tests check the DATA behind the
// picture: that compared displays read one canonical dataset, that
// normalisation is derived rather than authored, and that the figures a
// lesson asserts in prose match the figures in the dataset.
// ---------------------------------------------------------------------------

describe('Class 9 Chapter 10 — Data', () => {
  const CH = 'ncert_iemh2_ch10';
  const chapter = () => authoredSectionsForChapter(CH);

  it('authors four lessons from two official sections', () => {
    expect(chapter().length).toBe(4);
    const sections = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'section' && r.parentId === CH
    ).map((r) => r.recordId);
    expect(sections.length).toBe(2);
    const claimed = new Set(chapter().map((s) => s.source.officialSectionId));
    for (const id of sections) expect(claimed.has(id), `${id} lost in authoring`).toBe(true);
  });

  it('keeps §10.1 free of display architecture', () => {
    // The weighted mean needed nothing new. If that changes, the claim that
    // the experiment was isolated to §10.2 is no longer true.
    for (const s of chapter().filter((x) => x.source.officialSectionId === 'ncert_iemh2_s10_1')) {
      expect(s.dataDisplays ?? [], s.contentArtifactId).toEqual([]);
      expect(s.dataSets ?? {}, s.contentArtifactId).toEqual({});
    }
  });

  it('draws every compared display from one canonical dataset', () => {
    for (const s of chapter()) {
      const displays = s.dataDisplays ?? [];
      if (displays.length < 2) continue;
      const ids = new Set(displays.map((d) => d.dataSetId));
      expect(ids.size, `${s.contentArtifactId} compares displays of different data`).toBe(1);
      for (const d of displays) {
        expect(s.dataSets?.[d.dataSetId], `${s.contentArtifactId}: ${d.dataSetId} missing`).toBeTruthy();
      }
    }
  });

  it('derives normalised values from the raw ones, and they total 100', () => {
    for (const s of chapter()) {
      for (const [, data] of Object.entries(s.dataSets ?? {})) {
        const totals = categoryTotals(data);
        const norm = normalisedValues(data);
        data.categories.forEach((cat, ci) => {
          const sum = norm.reduce((t, row) => t + row[ci], 0);
          expect(Math.abs(sum - 100), `${s.contentArtifactId} ${cat}`).toBeLessThan(1e-9);
          // And each derived share must match its raw value over the total.
          data.series.forEach((ser, si) => {
            expect(norm[si][ci]).toBeCloseTo((ser.values[ci] / totals[ci]) * 100, 9);
          });
        });
      }
    }
  });

  it('carries a dataset where composition matches and totals do not', () => {
    // This is the fixture the whole §10.2 lesson rests on. Without it, the
    // normalised display would not actually conceal anything.
    const choose = chapter().find((s) => s.contentArtifactId.includes('choose'))!;
    const data = Object.values(choose.dataSets ?? {})[0];
    const totals = categoryTotals(data);
    const norm = normalisedValues(data);
    expect(Math.max(...totals) / Math.min(...totals)).toBeGreaterThanOrEqual(4);
    // Every category must share the same composition, to the percent.
    data.series.forEach((_, si) => {
      const shares = data.categories.map((_, ci) => Math.round(norm[si][ci] * 10) / 10);
      expect(new Set(shares).size, 'compositions should be identical').toBe(1);
    });
  });

  it('states figures in prose that the dataset actually contains', () => {
    for (const s of chapter()) {
      const data = Object.values(s.dataSets ?? {})[0];
      if (!data) continue;
      const totals = categoryTotals(data);
      const prose = [...s.explanation, ...s.dataDisplays!.map((d) => d.altText)].join(' ');
      // Every total named in the lesson must be a real category total.
      for (const m of prose.matchAll(/(\d{4,6}) rupees/g)) {
        const value = Number(m[1]);
        const known = [...totals, ...data.series.flatMap((x) => x.values)];
        expect(known.includes(value), `${s.contentArtifactId} cites ${value}, which is not in the data`).toBe(true);
      }
    }
  });

  it('describes a display by its mathematics, not by its chart type', () => {
    for (const s of chapter()) {
      for (const d of s.dataDisplays ?? []) {
        expect(d.altText.length, s.contentArtifactId).toBeGreaterThan(60);
        expect(d.purpose.trim().length, s.contentArtifactId).toBeGreaterThan(10);
        expect(d.altText, s.contentArtifactId).not.toMatch(/^(a )?(stacked|grouped|clustered) (bar|column)/i);
      }
    }
  });

  it('holds the authoring standard and stays unreviewed', () => {
    for (const s of chapter()) {
      expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
      expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 38 — WAVE 2: TWO CHAPTERS, NO NEW ARCHITECTURE.
//
// The question here is throughput without drift. These tests pin the counts
// and provenance as usual, and add two guards the earlier waves did not
// need: that a sequence table has not been turned into a statistical
// display, and that scaling to eighteen lessons at once has not produced
// template content with the nouns swapped.
// ---------------------------------------------------------------------------

describe('Class 9 authoring wave 2', () => {
  const PERIMETER = 'ncert_iemh1_ch06';
  const SEQUENCES = 'ncert_iemh1_ch08';

  it('authors eleven and seven lessons, covering every official section', () => {
    expect(authoredSectionsForChapter(PERIMETER).length).toBe(11);
    expect(authoredSectionsForChapter(SEQUENCES).length).toBe(7);
    for (const ch of [PERIMETER, SEQUENCES]) {
      const sections = MASTER_RECORDS.filter(
        (r) => r.classNumber === 9 && r.level === 'section' && r.parentId === ch
      ).map((r) => r.recordId);
      const claimed = new Set<string>();
      for (const s of authoredSectionsForChapter(ch)) {
        claimed.add(s.source.officialSectionId);
        for (const extra of s.source.additionalOfficialSectionIds ?? []) claimed.add(extra);
      }
      for (const id of sections) expect(claimed.has(id), `${ch}: ${id} lost in authoring`).toBe(true);
    }
    // §6.6 is merged into §6.7 and must survive in provenance.
    const merged = authoredSectionsForChapter(PERIMETER).find(
      (s) => s.source.officialSectionId === 'ncert_iemh1_s6_6'
    )!;
    expect(merged.source.additionalOfficialSectionIds).toEqual(['ncert_iemh1_s6_7']);
  });

  it('keeps sequence tables out of the statistical display model', () => {
    // A position-and-value list is not categories compared across series.
    // The Chapter 10 model must not spread to anything merely tabular.
    for (const ch of [PERIMETER, SEQUENCES]) {
      for (const s of authoredSectionsForChapter(ch)) {
        expect(s.dataSets ?? {}, s.contentArtifactId).toEqual({});
        expect(s.dataDisplays ?? [], s.contentArtifactId).toEqual([]);
      }
    }
    // And the data chapter still has them.
    expect(
      authoredSectionsForChapter('ncert_iemh2_ch10').filter((s) => (s.dataDisplays ?? []).length > 0).length
    ).toBe(2);
  });

  it('shows no template drift across the authored chapters', () => {
    // Volume is the risk this wave was run to test. Explanations, hints and
    // reasoning prompts must not repeat with the nouns swapped.
    const all = allAuthoredSections();
    const firstLines = all.map((s) => s.explanation[0].trim());
    expect(new Set(firstLines).size, 'two lessons open identically').toBe(firstLines.length);
    const goals = all.map((s) => s.learningGoal.trim());
    expect(new Set(goals).size, 'two lessons share a learning goal').toBe(goals.length);
    const deeper = all.flatMap((s) => s.reasoningApplication.map((r) => r.prompt.trim()));
    expect(new Set(deeper).size, 'a Think deeper prompt is reused').toBe(deeper.length);
    const hints = all.flatMap((s) => s.guidedPractice.map((g) => g.hint.trim()));
    expect(new Set(hints).size, 'a hint is reused verbatim').toBe(hints.length);
    const notes = all.flatMap((s) => s.teacher.teachingNotes.map((n) => n.trim()));
    expect(new Set(notes).size, 'a teaching note is reused').toBe(notes.length);
  });

  it('keeps 2-D area in square units and out of Chapter 14 territory', () => {
    const prose = authoredSectionsForChapter(PERIMETER)
      .flatMap((s) => [...s.explanation, s.summary])
      .join(' ')
      .toLowerCase();
    expect(prose).not.toMatch(/cubic|volume of a (cuboid|cylinder|cone|sphere)|curved surface area/);
    const answers = authoredSectionsForChapter(PERIMETER)
      .flatMap((s) => s.workedExamples.map((w) => w.answer))
      .join(' ');
    expect(answers).toMatch(/square cm|square m/i);
    expect(answers).not.toMatch(/cubic/i);
  });

  it('does not present patterns as new to Class 9', () => {
    const prose = authoredSectionsForChapter(SEQUENCES)
      .flatMap((s) => s.explanation)
      .join(' ')
      .toLowerCase();
    expect(prose).toMatch(/class 8|part i|before|already/);
    expect(prose).not.toMatch(/for the first time|have never/);
  });

  it('holds the authoring standard across both chapters', () => {
    for (const ch of [PERIMETER, SEQUENCES]) {
      for (const s of authoredSectionsForChapter(ch)) {
        expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
        expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
        expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
        for (const w of s.workedExamples) {
          for (const step of w.steps) {
            expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
          }
        }
      }
    }
  });

  it('reports authored counts with their class named', () => {
    // Checkpoint 37 said "all 66 authored lessons" without saying whose.
    const all = allAuthoredSections();
    const class9 = all.filter((s) => s.source.officialChapterId.startsWith('ncert_iemh'));
    const class10 = all.filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    // v0.84.0-c10.1 checkpoint 55 — this filter used to read "not Class 9",
    // which silently counted any later grade as Class 6. Class 10's arrival
    // exposed it. Each grade is now named by its own book code.
    const class6 = all.filter((s) => s.source.officialChapterId.startsWith('ncert_gp_c6'));
    expect(class6.length).toBe(12);
    // ck55 trig 4, ck56 solids 3, ck57 similarity 6, ck58 quadratics 4,
    // ck59 statistics 8, ck60 linear systems 5.
    expect(class10.length).toBe(65);
    // v0.84.0-c11.8 checkpoint 79 — Class 11 Chapter 1 is authored, so the
    // three prior grades no longer account for every artifact.
    const class11 = all.filter((a) => a.source.officialChapterId.startsWith('ncert_kemh'));
    // Chapter 1 Sets (12), Chapter 2 Relations and Functions (6) and
    // Chapter 3 Trigonometric Functions (8).
    expect(class11.length).toBe(33);
    expect(class6.length + class9.length + class10.length + class11.length).toBe(all.length);
    // Checkpoint 39 adds Chapter 7's six lessons.
    // Checkpoint 40 adds Chapter 11's four lessons.
    // Checkpoint 41 adds Chapter 9's two segment-backed lessons.
    // Checkpoint 42 adds Chapter 3's eight READY units; §3.1 stays blocked.
    expect(class9.length).toBe(92);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 39 — CHAPTER 7: MATHEMATICAL FIDELITY.
//
// Probability is the one chapter where a lesson can be arithmetically
// perfect and mathematically false. These tests check the assumption behind
// the arithmetic, not the arithmetic: that no lesson infers likelihood from
// a count of outcomes, that every use of favourable-over-total names what
// makes the outcomes equally likely, and that the audit catching this is
// itself not a word ban.
// ---------------------------------------------------------------------------

describe('Class 9 Chapter 7 — Probability', () => {
  const CH = 'ncert_iemh1_ch07';
  const chapter = () => authoredSectionsForChapter(CH);

  it('authors six lessons covering all four official sections', () => {
    expect(chapter().length).toBe(6);
    const sections = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'section' && r.parentId === CH
    ).map((r) => r.recordId);
    expect(sections.length).toBe(4);
    const claimed = new Set(chapter().map((s) => s.source.officialSectionId));
    for (const id of sections) expect(claimed.has(id), `${id} lost in authoring`).toBe(true);
  });

  it('raises no probability-claim finding anywhere in the chapter', () => {
    for (const s of chapter()) {
      expect(auditProbabilitySection(s).map((f) => `${f.problem}: ${f.claim}`), s.contentArtifactId).toEqual([]);
    }
  });

  it('catches the inferences it exists to catch', () => {
    // Negative fixtures: each of these is the error the chapter guards
    // against, and the audit must flag every one.
    const base = chapter()[0];
    const bad = [
      'A box gives two outcomes, so each has probability 1/2.',
      'Randomness means every result has the same chance.',
      'All possible outcomes have an equal chance of occurring.',
      'Since there are four outcomes, each one is a quarter.',
    ];
    for (const sentence of bad) {
      const planted = { ...base, explanation: [sentence] };
      expect(auditProbabilityLanguage(planted).length, sentence).toBeGreaterThan(0);
    }
  });

  it('does not flag a legitimate explanation that establishes fairness', () => {
    // Positive fixtures: honest mathematics must pass, or the audit is a
    // word ban that authors would learn to write around.
    const base = chapter()[0];
    const good = [
      'The die is fair, so its six outcomes are equally likely and each has probability 1/6.',
      'Because the bag was thoroughly mixed and the draw was made without looking, no ball has an advantage.',
      'A computed probability of 7/4 is not a surprising result; it is an error.',
      'The spinner has three outcomes, but the sectors differ in size, so they are not equally likely.',
    ];
    for (const sentence of good) {
      const planted = { ...base, explanation: [sentence] };
      expect(auditProbabilitySection(planted).map((f) => f.problem), sentence).toEqual([]);
    }
  });

  it('keeps every stated probability inside the scale', () => {
    for (const s of chapter()) {
      expect(auditProbabilityValues(s), s.contentArtifactId).toEqual([]);
      expect(auditCountsAgainstFractions(s), s.contentArtifactId).toEqual([]);
    }
  });

  it('confronts a case where counting outcomes gives the wrong answer', () => {
    // The chapter must contain at least one worked case where the tempting
    // inference fails, or the standard is only asserted.
    const prose = chapter()
      .flatMap((s) => [...s.explanation, ...s.workedExamples.flatMap((w) => [w.prompt, w.answer])])
      .join(' ')
      .toLowerCase();
    expect(prose).toMatch(/not .{0,20}equally likely/);
    expect(prose).toMatch(/gambler/);
    expect(prose).toMatch(/sector/);
  });

  it('distinguishes outcome from event, as the source does', () => {
    const s73 = chapter().find((s) => s.source.officialSectionId === 'ncert_iemh1_s7_3')!;
    const prose = s73.explanation.join(' ').toLowerCase();
    expect(prose).toContain('sample space');
    expect(prose).toContain('subset');
    expect(prose).toMatch(/an outcome is one result|outcome is one result/);
  });

  it('uses no statistical display model and no higher-grade theory', () => {
    for (const s of chapter()) {
      expect(s.dataSets ?? {}, s.contentArtifactId).toEqual({});
      expect(s.dataDisplays ?? [], s.contentArtifactId).toEqual([]);
      const prose = [...s.explanation, s.summary].join(' ').toLowerCase();
      // Multiplication and addition rules, conditional probability and
      // independence are not in this chapter's verified scope.
      expect(prose, s.contentArtifactId).not.toMatch(/conditional probability|independent events|mutually exclusive|p\(a \| b\)/);
    }
  });

  it('holds the authoring standard and stays unreviewed', () => {
    for (const s of chapter()) {
      expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
      expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 40 — CHAPTER 11: ALGORITHMIC FIDELITY.
//
// The error this guards against is checkpoint 39's in a new costume:
// inferring a general property from one run. These tests recompute every
// trace the lessons claim, and check that no comparison escapes its input
// and its counting rule.
// ---------------------------------------------------------------------------

describe('Class 9 Chapter 11 — Algorithms', () => {
  const CH = 'ncert_iemh2_ch11';
  const chapter = () => authoredSectionsForChapter(CH);

  it('authors four lessons covering all three official sections', () => {
    expect(chapter().length).toBe(4);
    const sections = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'section' && r.parentId === CH
    ).map((r) => r.recordId);
    expect(sections.length).toBe(3);
    const claimed = new Set(chapter().map((s) => s.source.officialSectionId));
    for (const id of sections) expect(claimed.has(id), `${id} lost in authoring`).toBe(true);
  });

  it('raises no algorithm-claim finding anywhere in the chapter', () => {
    for (const s of chapter()) {
      expect(auditAlgorithmSection(s).map((f) => `${f.problem}: ${f.claim}`), s.contentArtifactId).toEqual([]);
    }
  });

  it('catches the generalisations it exists to catch', () => {
    const base = chapter()[0];
    const bad = [
      'Algorithm A used fewer steps, so it is the better method.',
      "Euclid's algorithm is the fastest way to find a gcd.",
      'The division method is always faster than subtraction.',
      'This method is quicker for every number you could choose.',
      'The subtraction method runs faster on a computer.',
    ];
    for (const sentence of bad) {
      expect(auditAlgorithmClaims({ ...base, explanation: [sentence] }).length, sentence).toBeGreaterThan(0);
    }
  });

  it('does not flag an honestly scoped comparison', () => {
    // Positive fixtures. A validator satisfied only by vaguer prose would be
    // worse than none, so correctly scoped claims — and sentences that
    // refute an overclaim by quoting it — must pass.
    const base = chapter()[0];
    const good = [
      'On this input, under this counting rule, method A took fewer steps.',
      'On 100 and 3 the subtraction form took 35 steps while the division form took 2.',
      'Across the examples tested here the division form never did worse, but that does not establish it for every pair.',
      'One example cannot show that a method is always faster.',
      'Does this result mean the division form is always faster?',
      'The single-pass version needs 72 divisibility tests on this pair rather than 120.',
    ];
    for (const sentence of good) {
      expect(auditAlgorithmSection({ ...base, explanation: [sentence] }).map((f) => f.problem), sentence).toEqual([]);
    }
  });

  it('states traces the algorithms actually produce', () => {
    // A wrong trace in an algorithms lesson is not a typo; it is the lesson.
    // Every gcd and every step count asserted in prose is recomputed here.
    expect(gcd(84, 36)).toBe(12);
    expect(gcd(60, 45)).toBe(15);
    expect(gcd(48, 18)).toBe(6);
    expect(gcd(100, 3)).toBe(1);
    expect(gcd(91, 7)).toBe(7);
    // Euclid, both forms, on the pairs the lessons name.
    expect(subtractionSteps(48, 18)).toBe(4);
    expect(divisionSteps(48, 18)).toBe(3);
    expect(subtractionSteps(100, 3)).toBe(35);
    expect(divisionSteps(100, 3)).toBe(2);
    expect(subtractionSteps(60, 45)).toBe(3);
    expect(divisionSteps(91, 7)).toBe(1);
    // Divisor-list costs, one test per candidate up to each number.
    expect(divisorCandidates(84, 36)).toBe(120);
    expect(divisorCandidates(60, 45)).toBe(105);
    expect(divisorCandidates(50, 20)).toBe(70);

    // And every one of those numbers must appear in the authored prose, so
    // a corrected trace here cannot silently diverge from the lesson.
    const prose = chapter()
      .flatMap((s) => [...s.explanation, ...s.workedExamples.flatMap((w) => [w.answer, ...w.steps.map((x) => x.text)])])
      .join(' ');
    for (const n of ['35 subtractions', '2 divisions', '120 tests', '72 tests']) {
      expect(prose, `${n} missing from the lessons`).toContain(n);
    }
  });

  it('shows the input dependence rather than asserting it', () => {
    // Two pairs where the comparison comes out very differently is what
    // makes the chapter's caution evidence rather than a slogan.
    const euclid = chapter().find((s) => s.contentArtifactId.includes('euclid'))!;
    const prose = euclid.explanation.join(' ');
    expect(prose).toContain('48 and 18');
    expect(prose).toContain('100 and 3');
    expect(prose).toMatch(/depends on the input|depends on the particular numbers/);
  });

  it('imports no complexity theory and no pseudocode', () => {
    for (const s of chapter()) {
      const prose = [...s.explanation, s.summary].join(' ');
      expect(prose, s.contentArtifactId).not.toMatch(/big-?o|asymptotic|logarithmic|quadratic|linear time|O\(n\)|complexity class/i);
      expect(prose, s.contentArtifactId).not.toMatch(/\b(while loop|for loop|return statement|begin\s+end|def |function\()/i);
      expect(s.dataSets ?? {}, s.contentArtifactId).toEqual({});
    }
  });

  it('holds the authoring standard and stays unreviewed', () => {
    for (const s of chapter()) {
      expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
      expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 41 — CHAPTER 9: SOURCE-SEGMENT PROVENANCE.
//
// Chapter 9 prints no numbered sections. The temptation is to invent one so
// the artifacts look like everyone else's; these tests make that
// impossible, and check that generalising provenance did not weaken the
// official-section path it already had.
// ---------------------------------------------------------------------------

describe('Class 9 Chapter 9 — segment-backed provenance', () => {
  const CH = 'ncert_iemh2_ch09';
  const chapter = () => authoredSectionsForChapter(CH);

  it('authors two lessons and the chapter has no official sections at all', () => {
    expect(chapter().length).toBe(2);
    const sections = MASTER_RECORDS.filter(
      (r) => r.classNumber === 9 && r.level === 'section' && r.parentId === CH
    );
    expect(sections.length, 'Chapter 9 prints no numbered sections').toBe(0);
  });

  it('invents no official section id anywhere in the chapter', () => {
    for (const s of chapter()) {
      expect(artifactSourceKind(s.source), s.contentArtifactId).toBe('source_segment');
      expect(s.source.officialSectionId, s.contentArtifactId).toBe('');
      expect(s.source.sectionNumber ?? '', s.contentArtifactId).toBe('');
      expect(s.source.additionalOfficialSectionIds ?? [], s.contentArtifactId).toEqual([]);
      // Nothing resembling a section id may appear in the artifact id either.
      expect(s.contentArtifactId, s.contentArtifactId).not.toMatch(/_s9[_.]?\d/);
      expect(JSON.stringify(s.source)).not.toMatch(/ncert_\w+_s9_\d/);
    }
  });

  it('names source segments that are real, in this chapter, and core material', () => {
    for (const s of chapter()) {
      const ids = s.source.sourceSegmentIds ?? [];
      expect(ids.length, s.contentArtifactId).toBeGreaterThan(0);
      for (const id of ids) {
        const seg = SOURCE_SEGMENTS.find((x) => x.sourceSegmentId === id);
        expect(seg, `${id} is not a verified source segment`).toBeTruthy();
        expect(seg!.officialRecordId).toBe(CH);
        expect(seg!.role).toBe('CORE_MATHEMATICS');
        expect(seg!.mathematicalIntent?.trim().length ?? 0).toBeGreaterThan(20);
        expect(typeof seg!.sourceEvidence.pdfPageStart).toBe('number');
      }
      expect(s.source.sourceLabel?.trim().length ?? 0).toBeGreaterThan(5);
    }
  });

  it('leaves the third segment dispositioned PRACTICE, with no lesson', () => {
    // Covering every segment with a lesson would be tidier and would
    // misdescribe the chapter.
    const seg3 = SOURCE_SEGMENTS.find((x) => x.sourceSegmentId === 'pragati_srcseg_g09_ch09_seg3')!;
    expect(seg3.role).toBe('PRACTICE');
    const claimed = chapter().flatMap((s) => s.source.sourceSegmentIds ?? []);
    expect(claimed).not.toContain('pragati_srcseg_g09_ch09_seg3');
    expect(claimed.sort()).toEqual([
      'pragati_srcseg_g09_ch09_seg1',
      'pragati_srcseg_g09_ch09_seg2',
    ]);
  });

  it('refuses a lesson that claims a section or a practice segment', () => {
    const base = chapter()[0];
    const withSection = {
      ...base,
      source: { ...base.source, officialSectionId: 'ncert_iemh2_s9_1' },
    };
    expect(validateAuthoredSection(withSection).join(' ')).toMatch(/also names official section/);
    const withPractice = {
      ...base,
      source: { ...base.source, sourceSegmentIds: ['pragati_srcseg_g09_ch09_seg3'] },
    };
    expect(validateAuthoredSection(withPractice).join(' ')).toMatch(/dispositioned PRACTICE/);
    const withUnknown = {
      ...base,
      source: { ...base.source, sourceSegmentIds: ['pragati_srcseg_g09_ch09_seg9'] },
    };
    expect(validateAuthoredSection(withUnknown).join(' ')).toMatch(/not a verified source segment/);
    const withNumber = { ...base, source: { ...base.source, sectionNumber: '9.1' } };
    expect(validateAuthoredSection(withNumber).join(' ')).toMatch(/section number/);
  });

  it('reconciles both provenance paths without weakening either', () => {
    const all = allAuthoredSections();
    const bySection = all.filter((s) => artifactSourceKind(s.source) === 'official_section');
    const bySegment = all.filter((s) => artifactSourceKind(s.source) === 'source_segment');
    expect(bySegment.length).toBe(2);
    // v0.84.0-c11.8 checkpoint 79 — a third provenance kind exists. Class 11
    // FO-1 is sourced from a scope fragment of §1.9: an official section is
    // named AND a fragment identity is kept, because the mathematics is in
    // that section while the part this lesson teaches is assessed differently
    // from the rest of it. It is neither a plain section nor a segment.
    const byFragment = all.filter((a) => a.source.sourceKind === 'scope_fragment');
    // FO-1 plus both halves of section 4.5, whose two fragments are assessed
    // differently while sharing a parent section.
    expect(byFragment.length).toBe(3);
    // v0.84.0-c11.9 checkpoint 80 — a fourth kind. FO-3 is prescribed by CBSE
    // and has no section in the current textbook, so it names a CBSE entry and
    // leaves the section id empty, exactly as a segment-backed lesson does.
    const byCbse = all.filter((a) => a.source.sourceKind === 'cbse_only');
    // FO-3 (general solutions) and FO-2 (composition): both prescribed by
    // CBSE with no section in the current textbook.
    expect(byCbse.length).toBe(3);
    for (const s of byCbse) {
      expect(s.source.cbseEntryId).toBeTruthy();
      expect(s.source.officialSectionId).toBe('');
    }
    for (const s of byFragment) {
      expect(s.source.scopeFragmentId).toBeTruthy();
      expect(s.source.officialSectionId).toBeTruthy();
    }
    expect(bySection.length).toBe(all.length - bySegment.length - byFragment.length - byCbse.length);

    // The official path is unchanged: every section-backed lesson still
    // names a verified official section, exactly as before this checkpoint.
    for (const s of bySection) {
      expect(officialSectionById(s.source.officialSectionId), s.contentArtifactId).toBeTruthy();
      expect(s.source.sourceSegmentIds ?? [], s.contentArtifactId).toEqual([]);
    }
    // And the segment path reconciles to segments, not to sections.
    for (const s of bySegment) {
      expect(officialSectionById(s.source.officialSectionId)).toBeFalsy();
      for (const id of s.source.sourceSegmentIds ?? []) {
        expect(SOURCE_SEGMENTS.some((x) => x.sourceSegmentId === id)).toBe(true);
      }
    }
  });

  it('keeps provenance ids out of what a student sees', () => {
    for (const s of chapter()) {
      const studentFacing = [
        s.learningGoal,
        ...s.explanation,
        s.summary,
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer]),
      ].join(' ');
      expect(studentFacing).not.toMatch(/pragati_srcseg|source segment|ncert_|provenance|disposition/i);
    }
  });

  it('does not present reasoning as new to Class 9', () => {
    const prose = chapter().flatMap((s) => s.explanation).join(' ').toLowerCase();
    expect(prose).toMatch(/class 8|already|have been/);
    expect(prose).not.toMatch(/first time you|your first introduction|have never/);
  });

  it('holds the authoring standard and stays unreviewed', () => {
    for (const s of chapter()) {
      expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
      expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 42 — CHAPTER 3, AND A DELIBERATE GAP.
//
// Eight of nine units. §3.1 stays unauthored under a human policy decision,
// and the interesting test is not that it is absent — it is that its
// material did not migrate into §3.2 to make the chapter look finished.
// ---------------------------------------------------------------------------

describe('Class 9 Chapter 3 — the final wave, with §3.1 blocked', () => {
  const CH = 'ncert_iemh1_ch03';
  const chapter = () => authoredSectionsForChapter(CH);

  it('authors eight lessons and leaves §3.1 unauthored', () => {
    expect(chapter().length).toBe(8);
    const claimed = new Set(chapter().map((s) => s.source.officialSectionId));
    expect(claimed.has('ncert_iemh1_s3_1'), '§3.1 must stay unauthored').toBe(false);
    for (const id of ['ncert_iemh1_s3_2', 'ncert_iemh1_s3_3', 'ncert_iemh1_s3_4', 'ncert_iemh1_s3_5', 'ncert_iemh1_s3_6']) {
      expect(claimed.has(id), `${id} lost in authoring`).toBe(true);
    }
  });

  it('keeps the blocked unit structurally present and policy-blocked', () => {
    const units = unitsForClass(9).filter((u) => u.officialChapterId === CH);
    expect(units.length).toBe(9);
    const blocked = units.filter((u) => u.decompositionStatus !== 'READY_FOR_AUTHORING');
    expect(blocked.length).toBe(1);
    expect(blocked[0].humanJudgementPolicyKey).toBe('historical_material_lesson_vs_context');
    // Not hidden, not converted, not placeholdered — still a real unit.
    expect(blocked[0].officialRecordId).toBe('ncert_iemh1_s3_1');
  });

  it('does not absorb §3.1 material into the authored lessons', () => {
    // The tempting way to "finish" the chapter is to move the historical
    // opening into §3.2. These are the §3.1 subjects, and none may carry
    // the chapter's opening narrative.
    const prose = chapter()
      .flatMap((s) => [...s.explanation, s.summary, ...s.workedExamples.map((w) => w.prompt)])
      .join(' ')
      .toLowerCase();
    for (const term of ['ishango', 'tally mark', 'the dawn of mathematics', 'how counting began', 'earliest evidence of counting']) {
      expect(prose, `§3.1 material '${term}' leaked into an authored lesson`).not.toContain(term);
    }
  });

  it('does not present irrationality or reasoning as new to Class 9', () => {
    // Class 8 already met root 2 and non-terminating decimals. What is new
    // is the contradiction proof, and the lessons must say so.
    const proof = chapter().find((s) => s.contentArtifactId.includes('s3_5_proof'))!;
    const prose = proof.explanation.join(' ').toLowerCase();
    expect(prose).toMatch(/class 8|you have met|before/);
    expect(prose).not.toMatch(/for the first time|your first|have never/);
    expect(prose).toContain('proof');
  });

  it('keeps exactness and approximation apart', () => {
    const prose = chapter().flatMap((s) => [...s.explanation, s.summary]).join(' ');
    // No lesson may assert a decimal equals an irrational.
    expect(prose).not.toMatch(/root 2 = 1\.41|pi = 3\.14|= 1\.414\b/);
    const construct = chapter().find((s) => s.contentArtifactId.includes('construct'))!;
    expect(construct.explanation.join(' ')).toMatch(/approximat/i);
  });

  it('states the decimal test correctly, not as non-terminating alone', () => {
    const cyclic = chapter().find((s) => s.contentArtifactId.includes('cyclic'))!;
    const prose = cyclic.explanation.join(' ').toLowerCase();
    expect(prose).toContain('terminates or repeats');
    // The chapter must confront the non-terminating-equals-irrational error.
    expect(prose).toMatch(/non-terminating alone is not enough|1\/3/);
  });

  it('carries the contradiction proof as four named stages', () => {
    const proof = chapter().find((s) => s.contentArtifactId.includes('s3_5_proof'))!;
    const all = [...proof.explanation, proof.summary, ...proof.independentPractice.map((p) => p.answer)]
      .join(' ')
      .toLowerCase();
    for (const stage of ['assumption', 'contradiction', 'conclusion']) {
      expect(all, `the proof should name the ${stage} stage`).toContain(stage);
    }
    expect(all).toContain('lowest terms');
  });

  it('holds the authoring standard and stays unreviewed', () => {
    for (const s of chapter()) {
      expect(validateAuthoredSection(s), s.contentArtifactId).toEqual([]);
      expect(sequenceLeaks(s), s.contentArtifactId).toEqual([]);
      expect(s.reviewStatus, s.contentArtifactId).toBe('authored_draft');
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId}/${w.id}`).toBeGreaterThan(25);
        }
      }
    }
  });

  it('leaves Class 9 authored but incomplete, by exactly one unit', () => {
    const units = unitsForClass(9);
    expect(units.length).toBe(93);
    const authored = allAuthoredSections().filter((s) =>
      s.source.officialChapterId.startsWith('ncert_iemh')
    );
    expect(authored.length).toBe(92);
    // Class 9 is NOT complete: one unit has no lesson and will not until a
    // person decides what to do with it.
    const blocked = units.filter((u) => u.decompositionStatus !== 'READY_FOR_AUTHORING');
    expect(blocked.length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// v0.84.0 checkpoint 43 — THE HISTORICAL-CONTEXT POLICY, IMPLEMENTED.
//
// A person decided: history that supplies mathematical context but
// establishes no independently assessable objective belongs inside the
// mathematics it contextualises, with full provenance.
//
// The risks worth testing are not that the context arrived. They are that
// the source quietly stopped being accounted for, that history turned into
// assessed questions, that the revision happened silently, or that
// "complete" now means two different things depending on who is counting.
// ---------------------------------------------------------------------------

describe('historical_material_lesson_vs_context — resolved by contextual merge', () => {
  const policy = () =>
    HUMAN_JUDGEMENT_POLICIES.find((p) => p.policyKey === 'historical_material_lesson_vs_context')!;

  it('records the decision and its reasoning in the registry', () => {
    expect(policy().resolution).toBe('CONTEXTUAL_MERGE');
    expect(policy().resolvedAt).toBeTruthy();
    expect(policy().resolutionRationale!.length).toBeGreaterThan(100);
    // Both affected units, Class 8 and Class 9, are covered by the decision.
    expect(policy().affectedUnitIds.sort()).toEqual([
      'pragati_iu_g08_ch01_u4',
      'pragati_iu_g09_ch03_u1',
    ]);
  });

  it('resolves §3.1 without authoring it and without deleting it', () => {
    const u = unitsForClass(9).find((x) => x.instructionalUnitId === 'pragati_iu_g09_ch03_u1')!;
    expect(u.decompositionStatus).toBe('RESOLVED_CONTEXTUAL_MERGE');
    // Still a real unit pointing at a real official section.
    expect(u.officialRecordId).toBe('ncert_iemh1_s3_1');
    expect(u.contextualCoverage!.coveredByArtifactId).toBe('ncert_iemh1_s3_2_lesson');
    expect(u.contextualCoverage!.artifactAuthored).toBe(true);
    // And no standalone artifact was created for it.
    const standalone = allAuthoredSections().filter(
      (s) => s.source.officialSectionId === 'ncert_iemh1_s3_1'
    );
    expect(standalone.length, '§3.1 must not become a standalone lesson').toBe(0);
  });

  it('keeps §3.1 in provenance, so the official section is still accounted for', () => {
    const s32 = allAuthoredSections().find((s) => s.contentArtifactId === 'ncert_iemh1_s3_2_lesson')!;
    expect(s32.source.additionalOfficialSectionIds).toContain('ncert_iemh1_s3_1');
    // The section record itself is untouched — not deleted, not reclassified.
    const record = MASTER_RECORDS.find((r) => r.recordId === 'ncert_iemh1_s3_1');
    expect(record, '§3.1 must remain an official section record').toBeTruthy();
    expect(record!.level).toBe('section');
  });

  it('re-versions the revised artifact instead of mutating it silently', () => {
    const s32 = allAuthoredSections().find((s) => s.contentArtifactId === 'ncert_iemh1_s3_2_lesson')!;
    expect(s32.contentArtifactVersion).toBe(2);
    const rev = s32.revisionHistory!.find((r) => r.version === 2)!;
    expect(rev.reason).toMatch(/historical_material_lesson_vs_context|CONTEXTUAL_MERGE/);
    expect(rev.changed.length).toBeGreaterThan(1);
    // Revised, not reviewed.
    expect(s32.reviewStatus).toBe('authored_draft');
  });

  it('does not turn history into assessed mathematics', () => {
    // The whole point of the policy is that no artificial practice gets
    // generated. Every assessed item must still be about zero.
    const s32 = allAuthoredSections().find((s) => s.contentArtifactId === 'ncert_iemh1_s3_2_lesson')!;
    const assessed = [
      ...s32.guidedPractice.map((g) => `${g.prompt} ${g.answer}`),
      ...s32.independentPractice.map((p) => `${p.prompt} ${p.answer}`),
      ...s32.workedExamples.map((w) => w.prompt),
    ].join(' ');
    expect(assessed).not.toMatch(/notch|bone|tally|how old|which civilisation|archaeolog/i);
    // And the context must not crowd out the mathematics.
    const contextWords = s32.explanation.slice(0, 2).join(' ').split(/\s+/).length;
    const mathWords = s32.explanation.slice(2).join(' ').split(/\s+/).length;
    expect(contextWords, 'context should not dominate the lesson').toBeLessThan(mathWords);
  });

  it('records the Class 8 requirement without fabricating a Class 8 lesson', () => {
    const u4 = unitsForClass(8).find((x) => x.instructionalUnitId === 'pragati_iu_g08_ch01_u4')!;
    expect(u4.decompositionStatus).toBe('RESOLVED_CONTEXTUAL_MERGE');
    expect(u4.contextualCoverage!.coveredByArtifactId).toBe('pragati_iu_g08_ch01_u3');
    // Class 8 has no artifact yet, and none was invented to make the policy
    // look symmetrical.
    expect(u4.contextualCoverage!.artifactAuthored).toBe(false);
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_hegp')).length).toBe(0);
    // The carrying unit knows what it will owe when it is authored.
    const u3 = unitsForClass(8).find((x) => x.instructionalUnitId === 'pragati_iu_g08_ch01_u3')!;
    expect(u3.additionalOfficialRecordIds).toContain('ncert_hegp1_s1_3');
  });

  it('counts units and lessons as two different numbers', () => {
    const cov = instructionalCoverageFor(9);
    expect(cov.units).toBe(93);
    expect(cov.standaloneExpected).toBe(92);
    expect(cov.contextuallyCovered).toBe(1);
    expect(cov.unresolved).toBe(0);
    expect(cov.sourceCoverageComplete, 'no unit is unresolved').toBe(true);

    // The student-facing denominator is artifacts, never units: there are 92
    // lessons to open, and a 93rd would be a lesson that does not exist.
    const lessons = allAuthoredSections().filter((s) =>
      s.source.officialChapterId.startsWith('ncert_iemh')
    );
    expect(lessons.length).toBe(92);
    expect(lessons.length).toBe(cov.standaloneExpected);
    expect(lessons.length).not.toBe(cov.units);
  });

  it('leaves no unit of Class 9 unresolved and none policy-blocked', () => {
    const u9 = unitsForClass(9);
    expect(u9.filter((u) => u.decompositionStatus === 'NEEDS_HUMAN_CHECK').length).toBe(0);
    expect(u9.filter((u) => u.humanJudgementPolicyKey && u.decompositionStatus === 'NEEDS_HUMAN_CHECK').length).toBe(0);
  });

  it('holds the contextual-coverage invariants', () => {
    expect(validateContextualCoverage()).toEqual([]);
  });
});
