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
  officialRecordAccounting,
  overlapAudit,
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
      expect(u.hardeningNote ?? '', u.instructionalUnitId).toMatch(/not had its full text read|index|not read/i);
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
  it('says what each human-check unit is actually waiting on', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      if (u.decompositionStatus !== 'NEEDS_HUMAN_CHECK') continue;
      const q = u.humanJudgementQuestion ?? '';
      const unread = !meetsEvidenceBar(u);
      expect(q.length > 20 || unread, u.instructionalUnitId).toBe(true);
      if (q) expect(q.trim().endsWith('?'), u.instructionalUnitId).toBe(true);
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
      expect(id, id).toMatch(/^ncert_[a-z0-9]+_ch\d{2}$/);
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

  it('derives the class denominator from the curriculum, not the decomposition', () => {
    for (const p of CLASS_DECOMPOSITION_PROGRESS) {
      const acc = officialRecordAccounting(p.classNumber);
      expect(p.chaptersTotal, `class${p.classNumber}`).toBe(acc.officialRecordsTotal);
      // "Inspected" means fully inspected — never merely touched.
      expect(p.chaptersInspected, `class${p.classNumber}`).toBe(acc.officialRecordsFullyInspected);
    }
  });

  it('gives every page of every official record a home', () => {
    for (const ext of RECORD_EXTENTS) {
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
        p.officialRecordsTotal, p.officialRecordsFullyInspected, p.pagesUnresolved, p.chaptersTotal,
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
          const reason = units[i].mergeRelationship ?? units[j].mergeRelationship ?? '';
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
  it('explains every overlap it finds', () => {
    const overlaps = overlapAudit();
    expect(overlaps.length).toBeGreaterThan(0);
    for (const o of overlaps) {
      expect(o.pages.length, `${o.a} / ${o.b}`).toBeGreaterThan(0);
      expect((o.reason ?? '').length, `${o.a} / ${o.b} has no written reason`).toBeGreaterThan(40);
    }
  });

  it('includes unit-to-segment overlaps, not only unit-to-unit', () => {
    const kinds = overlapAudit().filter(
      (o) => o.a.startsWith('pragati_srcseg_') || o.b.startsWith('pragati_srcseg_')
    );
    expect(kinds.length).toBeGreaterThan(0);
  });
});
