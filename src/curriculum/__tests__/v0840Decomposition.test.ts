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
      expect(e.printedPageStart, u.instructionalUnitId).not.toBeNull();
      expect(e.printedPageEnd, u.instructionalUnitId).not.toBeNull();
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

  it('a unit whose pages are only partly read is held back, not shipped', () => {
    const draft = PRAGATI_INSTRUCTIONAL_UNITS.filter(
      (u) => u.decompositionStatus === 'DRAFT_DECOMPOSITION'
    );
    expect(draft.length).toBeGreaterThan(0);
    for (const u of draft) {
      expect(u.notes, u.instructionalUnitId).toMatch(/not read|not yet read/i);
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
