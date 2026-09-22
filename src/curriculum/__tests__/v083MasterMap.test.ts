// v0.83 — THE CLASSES 1–12 MASTER MAP IS THE PRODUCTION CONTRACT.
//
// These tests check values BY FIELD and BY COLUMN NAME. "10 and 65 are
// present somewhere in the row" does not prove Chapters = 10 and
// Sections = 65, and v0.82.5 showed a test like that passing over a
// wrong column. Every assertion below names the level it is about.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  CLASS_NUMBERS,
  MASTER_EVIDENCE,
  MASTER_RECORDS,
  MASTER_SOURCES,
  PRODUCTION_WAVES,
  authoringUnits,
  gapReport,
  productStatus,
  productionBacklog,
  registryLagClasses,
  syllabusCounts,
  textbookCounts,
  textbookDenominatorKnown,
  type MasterLevel,
} from '../curriculumMasterMap';
import { CLASS6_OFFICIAL_SECTIONS } from '../officialSections';
import { officialCurriculumForGrade } from '../officialCurriculum';

const read = (f: string) => readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8');

const ND = 'not_defined_by_source';

// ---------------------------------------------------------------------------
describe('textbook hierarchy, by level', () => {
  const expected: Record<number, Partial<Record<MasterLevel, number | string>>> = {
    1: { unit: ND, chapter: 13, section: ND, subsection: ND, topic: ND },
    2: { unit: ND, chapter: 11, section: ND, subsection: ND, topic: ND },
    3: { unit: ND, chapter: 14, section: ND, subsection: ND, topic: ND },
    4: { unit: ND, chapter: 14, section: ND, subsection: ND, topic: ND },
    5: { unit: ND, chapter: 15, section: ND, subsection: ND, topic: ND },
    6: { unit: ND, chapter: 10, section: 65, subsection: ND, topic: ND },
    7: { unit: ND, chapter: 15, section: 65, subsection: ND, topic: ND },
    8: { unit: ND, chapter: 14, section: 58, subsection: ND, topic: ND },
    9: { unit: ND, chapter: 8, section: 53, subsection: 'unknown', topic: ND },
    10: { unit: ND, chapter: 14, section: 55, subsection: 2, topic: ND },
    11: { unit: ND, chapter: 14, section: 63, subsection: ND, topic: ND },
    12: { unit: ND, chapter: 13, section: 65, subsection: ND, topic: ND },
  };
  for (const n of CLASS_NUMBERS) {
    it(`Class ${n}`, () => {
      expect(textbookCounts(n)).toEqual(expected[n]);
    });
  }

  it('counts each part of a two-part book separately', () => {
    const per = (id: string, level: MasterLevel) =>
      MASTER_RECORDS.filter((r) => r.sourceId === id && r.level === level).length;
    expect([per('ncert_gegp1', 'chapter'), per('ncert_gegp1', 'section')]).toEqual([8, 43]);
    expect([per('ncert_gegp2', 'chapter'), per('ncert_gegp2', 'section')]).toEqual([7, 22]);
    expect([per('ncert_hegp1', 'chapter'), per('ncert_hegp1', 'section')]).toEqual([7, 31]);
    expect([per('ncert_hegp2', 'chapter'), per('ncert_hegp2', 'section')]).toEqual([7, 27]);
    expect([per('ncert_lemh1', 'chapter'), per('ncert_lemh1', 'section')]).toEqual([6, 31]);
    expect([per('ncert_lemh2', 'chapter'), per('ncert_lemh2', 'section')]).toEqual([7, 34]);
  });

  it('keeps Part II chapter numbers as printed (they restart at 1) and tells parts apart', () => {
    const ch1 = MASTER_RECORDS.filter(
      (r) => r.classNumber === 7 && r.level === 'chapter' && r.number === '1'
    );
    expect(ch1.map((r) => r.bookPart).sort()).toEqual(['Part I', 'Part II']);
    expect(new Set(MASTER_RECORDS.map((r) => r.recordId)).size).toBe(MASTER_RECORDS.length);
  });

  it('does not count unnumbered sub-headings as sections', () => {
    // Class 7 Part II Ch 2 prints "Division of Integers" without a number.
    const s = MASTER_RECORDS.filter((r) => r.parentId === 'ncert_gegp2_ch02');
    expect(s.map((r) => r.number)).toEqual(['2.1', '2.2']);
  });
});

describe('CBSE syllabus hierarchy, by level, kept separate', () => {
  it('Classes 9–12', () => {
    expect(syllabusCounts(9)).toEqual({ unit: 6, chapter: 15, section: ND, subsection: ND, topic: 15 });
    expect(syllabusCounts(10)).toEqual({ unit: 7, chapter: ND, section: ND, subsection: ND, topic: 15 });
    expect(syllabusCounts(11)).toEqual({ unit: 5, chapter: ND, section: ND, subsection: ND, topic: 14 });
    expect(syllabusCounts(12)).toEqual({ unit: 6, chapter: ND, section: ND, subsection: ND, topic: 13 });
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) expect(syllabusCounts(n)).toBeNull();
  });

  it('never links a CBSE unit to an NCERT chapter', () => {
    const kind = new Map(MASTER_RECORDS.map((r) => [r.recordId, r.sourceKind]));
    for (const r of MASTER_RECORDS) {
      if (r.parentId) expect(kind.get(r.parentId), r.recordId).toBe(r.sourceKind);
    }
  });

  it('records the prescribed book exactly as the syllabus prints it', () => {
    const s9 = MASTER_SOURCES.find((s) => s.sourceId === 'cbse_math_class9_2026_27')!;
    expect(s9.prescribedBookAsPrinted).toBe('Mathematics - Textbook for class IX - NCERT Publication');
  });

  it('carries the corrected Class XII title (finding F3)', () => {
    const titles = MASTER_RECORDS.filter((r) => r.classNumber === 12 && r.level === 'topic').map((r) => r.title);
    expect(titles).toContain('Application of the Integrals');
    expect(titles).not.toContain('Applications of the Integrals');
  });
});

// ---------------------------------------------------------------------------
describe('official records never disappear', () => {
  it('every primary-evidence record is in the master map', () => {
    const ids = new Set(MASTER_RECORDS.map((r) => r.recordId));
    for (const r of MASTER_EVIDENCE.records) {
      if (r.sourceId === 'ncert_fegp1') continue; // Class 6 comes from the accepted registry
      expect(ids.has(r.recordId), r.recordId).toBe(true);
    }
  });

  it('Class 6 is the accepted registry, all 65 sections, same ids and titles', () => {
    const c6 = MASTER_RECORDS.filter((r) => r.classNumber === 6 && r.level === 'section');
    expect(c6.map((r) => r.recordId)).toEqual(CLASS6_OFFICIAL_SECTIONS.map((s) => s.officialSectionId));
    expect(c6.map((r) => r.title)).toEqual(CLASS6_OFFICIAL_SECTIONS.map((s) => s.exactTitle));
    // and the 2026-09-22 re-reading agrees with every title
    const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reread = new Map(
      MASTER_EVIDENCE.records
        .filter((r) => r.sourceId === 'ncert_fegp1' && r.level === 'section')
        .map((r) => [r.number, norm(r.title)])
    );
    for (const s of CLASS6_OFFICIAL_SECTIONS) expect(reread.get(s.sectionNumber), s.sectionNumber).toBe(norm(s.exactTitle));
  });

  it('a record with no Pragati content is still a record', () => {
    const empty = MASTER_RECORDS.filter((r) => productStatus(r).learn === 'missing');
    expect(empty.length).toBeGreaterThan(0);
    for (const r of empty) expect(r.structureStatus).toBe('primary_source_verified');
  });

  it('every authoring record of every class is in the production backlog', () => {
    const inBacklog = new Set(productionBacklog().map((e) => e.record.recordId));
    for (const n of CLASS_NUMBERS) {
      for (const r of authoringUnits(n)) {
        if (productStatus(r).publication === 'published') continue;
        expect(inBacklog.has(r.recordId), r.recordId).toBe(true);
      }
    }
  });

  it('every class is in exactly one production wave', () => {
    const all = PRODUCTION_WAVES.flatMap((w) => w.classes).sort((a, b) => a - b);
    expect(all).toEqual([...CLASS_NUMBERS]);
  });

  it('the generated map lists every record, in both forms', () => {
    const md = read('CURRICULUM_MASTER_MAP.md');
    const json = JSON.parse(read('CURRICULUM_MASTER_MAP.json'));
    expect(json.records).toHaveLength(MASTER_RECORDS.length);
    for (const r of MASTER_RECORDS) expect(md.includes(`| ${r.recordId} |`), r.recordId).toBe(true);
  });
});

// ---------------------------------------------------------------------------
describe('UNKNOWN is never zero', () => {
  it('Class 9 textbook total is unknown (finding F1)', () => {
    expect(textbookDenominatorKnown(9)).toBe(false);
    expect(gapReport(9).unverifiedUnits).toBe('unknown');
    for (const n of CLASS_NUMBERS.filter((x) => x !== 9)) expect(textbookDenominatorKnown(n)).toBe(true);
  });

  it('no level status is empty and no unknown level is counted', () => {
    for (const s of MASTER_SOURCES) {
      for (const v of Object.values(s.levels)) {
        expect(['primary_source_verified', ND, 'partially_enumerated', 'unknown']).toContain(v);
      }
    }
    expect(textbookCounts(9).subsection).toBe('unknown');
  });
});

// ---------------------------------------------------------------------------
describe('review and product state are an overlay, and unchanged', () => {
  it('twelve Class 6 records are complete and review-ready; nothing sent, reviewed or published', () => {
    const g6 = gapReport(6);
    expect(g6.instructionallyComplete).toBe(12);
    expect(g6.reviewReady).toBe(12);
    expect(g6.reviewSent).toBe(0);
    expect(g6.reviewed).toBe(0);
    expect(g6.published).toBe(0);
    for (const n of CLASS_NUMBERS.filter((x) => x !== 6)) {
      const g = gapReport(n);
      expect([g.learnAuthored, g.reviewReady, g.reviewed, g.published], `Class ${n}`).toEqual([0, 0, 0, 0]);
    }
  });

  it('intent is inspected only where Pragati authored (structure verified is not intent inspected)', () => {
    const inspected = MASTER_RECORDS.filter((r) => r.intentStatus === 'page_level_inspected');
    expect(inspected.length).toBe(12);
    expect(inspected.every((r) => r.classNumber === 6)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
describe('source evidence is reproducible', () => {
  it('every textbook carries URL, checksum, ISBN, edition history and inspection date', () => {
    const books = MASTER_SOURCES.filter((s) => s.kind === 'textbook');
    expect(books).toHaveLength(15);
    for (const b of books) {
      expect(b.url, b.sourceId).toMatch(/^https:\/\/ncert\.nic\.in\/textbook\/pdf\//);
      expect(b.sha256, b.sourceId).toMatch(/^[0-9a-f]{64}$/);
      expect(b.isbn, b.sourceId).toBeTruthy();
      expect(b.editionHistory.length, b.sourceId).toBeGreaterThan(0);
      expect(b.inspectedOn).toBe('2026-09-22');
      expect(b.levelEvidence.length).toBeGreaterThan(40);
    }
  });

  it('records the page where each section starts', () => {
    for (const r of MASTER_RECORDS.filter((x) => x.sourceKind === 'textbook')) {
      expect(r.startPage, r.recordId).not.toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
describe('the in-app registry lag is stated, not hidden', () => {
  // v0.83.1 §A — the lag is gone: the runtime registry is derived from
  // the same evidence. The test is kept and inverted, so a regression
  // that reintroduces a second, stale registry fails here.
  it('has no lag left: every verified class is verified in the runtime registry too', () => {
    expect(registryLagClasses()).toEqual([]);
    for (const n of CLASS_NUMBERS) {
      expect(
        officialCurriculumForGrade(`class${n}` as never)!.status,
        `class${n}`
      ).toBe('primary_source_verified');
    }
  });

  it('every generated curriculum document says the two agree', () => {
    for (const d of [
      'CURRENT_MATH_BOOKS_CLASSES_1_12.md',
      'CURRICULUM_COVERAGE_MATRIX.md',
      'STRUCTURE_VERIFICATION_BACKLOG.md',
      'CURRICULUM_MASTER_MAP.md',
    ]) {
      expect(read(d), d).toContain(
        'The in-app curriculum registry agrees with the master map'
      );
      expect(read(d), d).not.toContain('The in-app registry is behind this map.');
    }
  });
});

// ---------------------------------------------------------------------------
// Documents, read by column name.
function rowByClassAndSource(doc: string, cls: string, sourcePrefix: string): Record<string, string> {
  const lines = doc.split('\n');
  const idx = lines.findIndex(
    (l) => l.startsWith(`| ${cls} |`) && l.split('|')[2]?.trim().startsWith(sourcePrefix)
  );
  if (idx < 0) throw new Error(`no ${cls} / ${sourcePrefix} row`);
  const header = lines.slice(0, idx).reverse().find((l) => l.startsWith('| Class |'))!;
  const names = header.split('|').map((c) => c.trim());
  const cells = lines[idx].split('|').map((c) => c.trim());
  return Object.fromEntries(names.map((n, i) => [n, cells[i]]));
}

describe('generated documents agree with the map, column by column', () => {
  const DOCS = [
    'CURRENT_MATH_BOOKS_CLASSES_1_12.md',
    'CURRICULUM_COVERAGE_MATRIX.md',
    'STRUCTURE_VERIFICATION_BACKLOG.md',
    'CURRICULUM_MASTER_MAP.md',
  ];
  const cases: Array<[string, string, Record<string, string>]> = [
    ['Class 1', 'NCERT textbook', { Units: '—', Chapters: '13', Sections: '—', Topics: '—' }],
    ['Class 5', 'NCERT textbook', { Units: '—', Chapters: '15', Sections: '—', Topics: '—' }],
    ['Class 6', 'NCERT textbook', { Units: '—', Chapters: '10', Sections: '65', Topics: '—' }],
    ['Class 7', 'NCERT textbook', { Units: '—', Chapters: '15', Sections: '65', Topics: '—' }],
    ['Class 8', 'NCERT textbook', { Units: '—', Chapters: '14', Sections: '58', Topics: '—' }],
    ['Class 9', 'CBSE syllabus', { Units: '6', Chapters: '15', Sections: '—', Topics: '15' }],
    ['Class 10', 'CBSE syllabus', { Units: '7', Chapters: '—', Sections: '—', Topics: '15' }],
    ['Class 10', 'NCERT textbook', { Units: '—', Chapters: '14', Sections: '55', 'Sub-sections': '2', Topics: '—' }],
    ['Class 11', 'NCERT textbook', { Units: '—', Chapters: '14', Sections: '63', Topics: '—' }],
    ['Class 12', 'NCERT textbook', { Units: '—', Chapters: '13', Sections: '65', Topics: '—' }],
  ];
  for (const [cls, src, want] of cases) {
    it(`${cls} — ${src}`, () => {
      for (const d of DOCS) {
        const row = rowByClassAndSource(read(d), cls, src);
        for (const [col, v] of Object.entries(want)) expect(row[col], `${d} ${col}`).toBe(v);
      }
    });
  }

  it('Class 9 textbook row says UNKNOWN, never a bare total', () => {
    for (const d of DOCS) {
      const row = rowByClassAndSource(read(d), 'Class 9', 'NCERT textbook');
      expect(row.Chapters, d).toBe('8 (Part I only; class total UNKNOWN)');
      expect(row['Sub-sections'], d).toBe('UNKNOWN');
    }
  });

  it('the content gap report reads by column', () => {
    const doc = read('CONTENT_BACKLOG.md');
    const lines = doc.split('\n');
    const header = lines.find((l) => l.startsWith('| Class | Structure | Authoring unit'))!;
    const names = header.split('|').map((c) => c.trim());
    const row = (c: string) => {
      const cells = lines.find((l) => l.startsWith(`| ${c} | `) && l.includes('STRUCTURE') || (l.startsWith(`| ${c} | PARTIAL`)))!.split('|').map((x) => x.trim());
      return (n: string) => cells[names.indexOf(n)];
    };
    expect(row('Class 6')('Verified records')).toBe('65');
    expect(row('Class 6')('Review-ready')).toBe('12');
    expect(row('Class 6')('Reviewed')).toBe('0');
    expect(row('Class 9')('Unverified records')).toBe('UNKNOWN');
    expect(row('Class 1')('Authoring unit')).toBe('chapter');
    expect(row('Class 10')('Verified records')).toBe('41'); // 55 sections less 14 "Summary"
  });
});
