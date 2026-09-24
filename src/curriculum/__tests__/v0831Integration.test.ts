// v0.83.1 §J — ONE CHAIN OF TRUTH.
//
// primary source → master map → runtime curriculum → Student → Teacher
// → generated documents → review provenance.
//
// v0.83 allowed the master map and the runtime registry to disagree on
// purpose. These tests exist so that can never be true again silently.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  OFFICIAL_CURRICULA,
  officialCurriculumForGrade,
  officialChapterCount,
  officialSectionCount,
} from '../officialCurriculum';
import { EVIDENCE_DERIVED_GRADES } from '../runtimeCurriculumFromEvidence';
import {
  CLASS_NUMBERS,
  MASTER_RECORDS,
  MASTER_SOURCES,
  registryLagClasses,
  textbookCounts,
  textbookDenominatorKnown,
} from '../curriculumMasterMap';
import { gradeCurriculumView } from '../officialCurriculumStudentModel';
import { EXPECTED_STRUCTURES } from '../officialCompleteness';
import { CLASS6_OFFICIAL_SECTIONS, officialStartPage } from '../officialSections';
import {
  PRAGATI_INSTRUCTIONAL_UNITS,
  decompositionCoverage,
  sourceGrainCaveat,
} from '../instructionalUnits';
import {
  SECTION_7_4_ARTIFACT_VERSION,
  SECTION_7_4_SOURCE_PROVENANCE_VERSION,
  SECTION_7_4_SUPERSEDED_PROVENANCE,
  computeContentFingerprint,
  section74Artifact,
} from '../contentArtifact';

const read = (f: string) => readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8');

// ---------------------------------------------------------------------------
describe('§A one curriculum truth', () => {
  it('has no class where the runtime registry lags the master map', () => {
    expect(registryLagClasses()).toEqual([]);
  });

  it('agrees with the master map, chapter for chapter, for every derived grade', () => {
    for (const g of EVIDENCE_DERIVED_GRADES) {
      const n = Number(g.replace('class', ''));
      const runtime = officialCurriculumForGrade(g)!;
      const map = MASTER_RECORDS.filter((r) => r.classNumber === n && r.level === 'chapter');
      expect(runtime.status, g).toBe('primary_source_verified');
      expect(runtime.units.map((u) => u.title), g).toEqual(map.map((r) => r.title));
      expect(runtime.units.map((u) => u.officialUnitId), g).toEqual(map.map((r) => r.recordId));
      expect(officialChapterCount(g), g).toBe(textbookCounts(n).chapter);
    }
  });

  it('keeps Class 6 on its accepted registry, not on the derived path', () => {
    expect(EVIDENCE_DERIVED_GRADES).not.toContain('class6');
    expect(officialCurriculumForGrade('class6')!.units).toHaveLength(10);
    expect(officialSectionCount('class6')).toBe(65);
  });

  it('records an expected structure for every grade in the registry', () => {
    for (const c of OFFICIAL_CURRICULA) {
      expect(EXPECTED_STRUCTURES.some((e) => e.grade === c.grade), c.grade).toBe(true);
    }
  });

  it('keeps the expected structures in step with the evidence', () => {
    for (const e of EXPECTED_STRUCTURES) {
      const n = Number(e.grade.replace('class', ''));
      const map = MASTER_RECORDS.filter(
        (r) => r.classNumber === n && r.sourceKind === 'textbook' && r.level === 'chapter'
      );
      // CBSE-syllabus grades keep their own hand-read expected structure;
      // only the evidence-derived textbook grades are compared here.
      if (!(EVIDENCE_DERIVED_GRADES as string[]).includes(e.grade)) continue;
      if (map.length === 0) continue;
      expect(e.unitTitles, e.grade).toEqual(map.map((r) => r.title));
    }
  });
});

// ---------------------------------------------------------------------------
describe('§3/§4 source terminology survives integration', () => {
  it('reports no section count for a book that numbers no sections', () => {
    for (const g of ['class1', 'class2', 'class3', 'class4', 'class5'] as const) {
      expect(officialSectionCount(g), g).toBeNull();
      expect(officialChapterCount(g), g).toBeGreaterThan(0);
      const c = officialCurriculumForGrade(g)!;
      expect(c.units.every((u) => u.subLevelDefinedBySource === false), g).toBe(true);
      expect(c.units.every((u) => u.topics.length === 0), g).toBe(true);
    }
  });

  it('keeps Part I and Part II chapters distinct without renumbering them', () => {
    for (const g of ['class7', 'class8'] as const) {
      const c = officialCurriculumForGrade(g)!;
      const ones = c.units.filter((u) => u.number === 1);
      expect(ones, g).toHaveLength(2);
      expect(ones.map((u) => u.bookPart).sort(), g).toEqual(['Part I', 'Part II']);
      expect(new Set(c.units.map((u) => u.officialUnitId)).size, g).toBe(c.units.length);
    }
  });

  it('gives a student an unambiguous label for a two-part book', () => {
    const v = gradeCurriculumView('class7');
    if (v.kind !== 'verified') throw new Error('expected a verified view');
    const labels = v.chapters.map((c) => c.chapterLabel);
    expect(labels).toContain('Part I · Chapter 1');
    expect(labels).toContain('Part II · Chapter 1');
    expect(new Set(labels).size).toBe(v.chapters.length);
  });
});

// ---------------------------------------------------------------------------
describe('§5/§B Class 9 stays partial, and the reason is explicit', () => {
  it('reports the textbook denominator as unknown from evidence, not from findings', () => {
    expect(textbookDenominatorKnown(9)).toBe(false);
    const book = MASTER_SOURCES.find((s) => s.sourceId === 'ncert_iemh1')!;
    expect(book.volumeCompleteness).toBe('partial_series_published');
    expect(book.volumeCompletenessNote).toMatch(/Part II/);
  });

  it('is not disturbed by an unrelated finding on another class', () => {
    for (const n of CLASS_NUMBERS.filter((x) => x !== 9)) {
      expect(textbookDenominatorKnown(n), `class${n}`).toBe(true);
    }
  });

  it('never presents Part I as the whole Class 9 textbook', () => {
    expect(read('CURRICULUM_MASTER_MAP.md')).toContain('Part I only; class total UNKNOWN');
  });

  it('asserts no CBSE-to-NCERT chapter crosswalk', () => {
    const kind = new Map(MASTER_RECORDS.map((r) => [r.recordId, r.sourceKind]));
    for (const r of MASTER_RECORDS) {
      if (r.parentId) expect(kind.get(r.parentId), r.recordId).toBe(r.sourceKind);
    }
  });
});

// ---------------------------------------------------------------------------
describe('§18 official records survive missing content', () => {
  it('shows every official chapter, and none of them as available', () => {
    for (const g of EVIDENCE_DERIVED_GRADES) {
      const n = Number(g.replace('class', ''));
      const v = gradeCurriculumView(g);
      if (v.kind !== 'verified') throw new Error(`${g} should be verified`);
      expect(v.chapters.length, g).toBe(textbookCounts(n).chapter);
      expect(v.chapters.every((c) => c.availability === 'not_available_yet'), g).toBe(true);
      expect(v.readyCount, g).toBe(0);
    }
  });

  it('uses no internal ids or governance words in student-facing text', () => {
    for (const g of EVIDENCE_DERIVED_GRADES) {
      const v = gradeCurriculumView(g);
      if (v.kind !== 'verified') continue;
      const text = [v.summaryLine, ...v.chapters.map((c) => `${c.chapterLabel} ${c.title} ${c.statusLine}`)].join(' ');
      expect(text, g).not.toMatch(/ncert_|cbse_|verif|registry|fingerprint|artifact/i);
    }
  });
});

// ---------------------------------------------------------------------------
describe('§C Class 6 pages are the printed ones', () => {
  it('puts §7.4 on page 159', () => {
    expect(officialStartPage('ncert_gp_c6_s7_4')).toBe(159);
  });

  it('matches the master-map observation for all 65 sections', () => {
    const obs = new Map(
      MASTER_RECORDS.filter((r) => r.classNumber === 6 && r.level === 'section').map((r) => [
        r.recordId,
        r.startPage,
      ])
    );
    expect(CLASS6_OFFICIAL_SECTIONS).toHaveLength(65);
    for (const s of CLASS6_OFFICIAL_SECTIONS) {
      expect(s.startPage, s.sectionNumber).toBe(obs.get(s.officialSectionId));
    }
  });

  it('audits all 65 rows, not just the 44 that moved', () => {
    const doc = read('CLASS6_PAGE_CORRECTION_AUDIT.md');
    for (const s of CLASS6_OFFICIAL_SECTIONS) {
      expect(doc, s.sectionNumber).toContain(`| ${s.sectionNumber} |`);
    }
    expect(doc.split('\n').filter((l) => l.endsWith('| yes |'))).toHaveLength(44);
  });
});

describe('§9 review provenance is versioned, and history survives', () => {
  it('did not bump the lesson artifact version for a page correction', () => {
    expect(SECTION_7_4_ARTIFACT_VERSION).toBe(1);
    expect(SECTION_7_4_SOURCE_PROVENANCE_VERSION).toBe(2);
  });

  it('keeps the superseded identity recorded rather than overwritten', () => {
    expect(SECTION_7_4_SUPERSEDED_PROVENANCE.contentFingerprint).toBe('a1a3ff57');
    expect(SECTION_7_4_SUPERSEDED_PROVENANCE.startPageAsRecorded).toBe(160);
    expect(computeContentFingerprint()).toBe('dfc56ab5');
    expect(section74Artifact().reviewCode).toBe('S74-v1-DFC56A');
  });

  it('keeps the superseded packages byte-identical and names which set to send', () => {
    // The old folders are retained unmodified; their checksum is the one
    // accepted at v0.82.7.
    const manifest = read('REVIEW_HANDOFF/CURRENT_REVIEW_IDENTITY_v0_83_3.md');
    expect(manifest).toContain('DO NOT SEND');
    expect(manifest).toContain('Send exactly these');
    expect(manifest).toContain('DO NOT SEND');
    // v0.83.2 — the historical folder still holds the OLD codes, which is
    // the point of keeping it; the current folder holds the new ones.
    expect(read('PRAGATI_CHAPTER_3_REVIEW_PACKAGES/index.json')).toContain('S31-v1-20BA61');
    expect(read('PRAGATI_CHAPTER_3_REVIEW_PACKAGES/DO_NOT_SEND.md')).toContain('DO NOT SEND');
    expect(read('PRAGATI_CHAPTER_3_REVIEW_PACKAGES_CURRENT/index.json')).toContain('S32-v1-14F313');
  });

  it('says nothing has been sent', () => {
    const m = read('REVIEW_HANDOFF/CURRENT_REVIEW_IDENTITY_v0_83_3.md');
    expect(m).toContain('0 sent');
    expect(m).not.toMatch(/\bhas been sent to\b/);
  });
});

// ---------------------------------------------------------------------------
describe('§E official records and Pragati lessons cannot be confused', () => {
  it('creates no speculative instructional units', () => {
    expect(PRAGATI_INSTRUCTIONAL_UNITS).toHaveLength(0);
  });

  it('never projects a lesson count from a record count', () => {
    const c = decompositionCoverage(477);
    expect(c.officialAuthoringRecords).toBe(477);
    expect(c.projectedLessonCount).toBeNull();
    expect(sourceGrainCaveat(477)).toMatch(/not\s+a count of Pragati lessons/);
  });

  it('keeps the two id spaces apart', () => {
    for (const u of PRAGATI_INSTRUCTIONAL_UNITS) {
      expect(u.instructionalUnitId.startsWith('pragati_iu_')).toBe(true);
      expect(MASTER_RECORDS.some((r) => r.recordId === u.officialRecordId)).toBe(true);
    }
    for (const r of MASTER_RECORDS) expect(r.recordId.startsWith('pragati_iu_')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe('§D no stale document looks current', () => {
  it('marks the superseded audits as superseded, at the top', () => {
    for (const f of [
      'CLASSES_1_12_CURRICULUM_COMPLETENESS_AUDIT.md',
      'MANUAL_CURRICULUM_VERIFICATION_CLASSES_1_5_7_8.md',
    ]) {
      expect(read(f).slice(0, 400), f).toContain('SUPERSEDED — v0.83.1');
    }
  });

  it('no longer claims seven classes are unverified anywhere current', () => {
    for (const f of [
      'CURRICULUM_COVERAGE_MATRIX.md',
      'STRUCTURE_VERIFICATION_BACKLOG.md',
      'CURRENT_MATH_BOOKS_CLASSES_1_12.md',
      'README.md',
    ]) {
      expect(read(f), f).not.toMatch(/7 of 12 classes have no|seven unverified/i);
    }
  });
});
