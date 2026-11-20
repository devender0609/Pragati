/**
 * v0.84.0-c12.08 checkpoint 116 — Chapter 7 arrived; the whole-book gate.
 *
 * A valid lemh201.pdf replaced the truncated download. The recall-first
 * sweep ran on it unchanged, and a section/subsection denominator was
 * published only because every whole-book condition held. These tests keep
 * each of those conditions load-bearing.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { validatePdf, knownInvalidSha256 } from '../../../tools/class12/generateSourceManifest';

const root = path.join(__dirname, '../../..');
const rd = <T = Record<string, unknown>>(p: string): T => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8')) as T;

type Anchor = { pdfPage: number; bodyLine: number; anchor?: string };
type Rec = {
  chapter: number; printed: string; title: string; extractedTitle: string; sourceFile: string;
  pdfPage: number; printedFolio: number; start: Anchor; end: Anchor;
  verificationStatus: string; issues: string[]; contentsPageAgreement?: boolean; parent?: string;
};
const MODEL = rd<Record<string, any>>('class12-source/CLASS12_SOURCE_MODEL.json');
const EXT = rd<{ sections: Rec[]; subsections: Rec[]; perChapterSections: Record<string, number> } & Record<string, any>>(
  'class12-source/CLASS12_SECTION_EXTENTS.json');
const SUBS = rd<{ subsections: Rec[]; count: number }>('class12-source/CLASS12_SUBSECTION_RECORDS.json');
const MISC = rd<Record<string, any>>('class12-source/CLASS12_MISC_EXERCISE_SCOPES.json');
const GATE = rd<Record<string, any>>('class12-source/CLASS12_WHOLE_BOOK_CONSISTENCY.json');
const PAGES = rd<Record<string, any>>('class12-source/CLASS12_PAGE_ACCOUNTING.json');
const MANIFEST = rd<Record<string, any>>('class12-source/CLASS12_SOURCE_MANIFEST.json');
const CH7 = path.join(root, 'class12-source/pdfs/lemh201.pdf');
const INVALID_SHA = '428ebd538d8b852c8e06ec648a34e66b00aff022250320caab6730ccd1871043';
const hasPoppler = (() => { try { execFileSync('pdftotext', ['-v'], { stdio: 'ignore' }); return true; } catch { return false; } })();
const before = (a: Anchor, b: Anchor) => a.pdfPage < b.pdfPage || (a.pdfPage === b.pdfPage && a.bodyLine < b.bodyLine);

describe('Chapter 7 replacement', () => {
  const rec = (MODEL.files as Array<Record<string, any>>).find((f) => f.filename === 'lemh201.pdf')!;

  it('is a valid PDF with a different SHA from the truncated download', () => {
    expect(validatePdf(CH7).valid).toBe(true);
    expect(rec.sha256).not.toBe(INVALID_SHA);
    expect(rec.sha256).toBe('bc4b4a0b2d3ec8d71d479c0ea549969028c2ac28d3613e97a888e2845144112f');
    expect(rec.bytes).toBe(5662676);
    expect(rec.pdfPages).toBe(67);
    expect(rec.structurallyValid).toBe(true);
  });

  it('keeps the old copy only as provenance, permanently invalid', () => {
    const old = (MODEL.supersededCopies as Array<Record<string, any>>)[0];
    expect(old.sha256).toBe(INVALID_SHA);
    expect(old.classification).toBe('INVALID_TRUNCATED_DOWNLOAD');
    expect(old.supersededBy).toBe(rec.sha256);
    expect(knownInvalidSha256()[INVALID_SHA]).toMatch(/INVALID_TRUNCATED_DOWNLOAD/);
  });

  it('still rejects a truncated PDF: header present, no %%EOF', () => {
    const tmp = path.join('/tmp', 'trunc-c1208.pdf');
    fs.writeFileSync(tmp, '%PDF-1.4\n1 0 obj << >> stream\nxxxxxxxx');
    expect(validatePdf(tmp).reason).toMatch(/truncated/);
    fs.unlinkSync(tmp);
  });

  it('spans folios 225-291, exactly the gap the Contents pages leave for it', () => {
    const run = (GATE.folioContinuity as Array<Record<string, any>>).find((c) => c.chapter === 7)!;
    expect(run.startFolio).toBe(225);
    expect(run.endFolio).toBe(291);
    expect(run.nextStart).toBe(292);
    expect(run.contiguous).toBe(true);
  });
});

describe('Chapter 7 hierarchy, from the unchanged method', () => {
  const secs = EXT.sections.filter((s) => s.chapter === 7);
  const subs = EXT.subsections.filter((s) => s.chapter === 7);

  it('has the sections and subsections the sweep found', () => {
    expect(secs.map((s) => s.printed)).toEqual(
      ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', '7.10']);
    expect(subs.map((s) => s.printed)).toEqual(
      ['7.2.1', '7.3.1', '7.3.2', '7.6.1', '7.6.2', '7.8.1', '7.8.2', '7.8.3']);
  });

  it('has a Miscellaneous Exercise, determined from its own source', () => {
    const c = (MISC.chapters as Array<Record<string, any>>).find((m) => m.chapter === 7)!;
    expect(c.miscellaneousExercise).toBe(true);
    expect(c.miscHeadings).toEqual(['Miscellaneous Exercise on Chapter 7']);
  });

  it('keeps the printed title where extraction lost notation', () => {
    const t = EXT.subsections.find((s) => s.printed === '7.6.1')!;
    expect(t.title).toContain('eˣ');
    expect(t.extractedTitle).not.toBe(t.title);
  });

  it.skipIf(!hasPoppler)('is reproduced by the checked-in sweep tool', () => {
    const out = JSON.parse(execFileSync('python3', ['-I', path.join(root, 'tools/class12/recallFirstSweep.py'), CH7, '7']).toString());
    expect(out[0].sections.map((s: Rec) => s.printed)).toEqual(secs.map((s) => s.printed));
    expect(out[0].subsections.map((s: Rec) => s.printed)).toEqual(subs.map((s) => s.printed));
  });
});

describe('the whole-book gate', () => {
  it('passes only with every condition true', () => {
    const g = GATE.gate as Record<string, boolean>;
    expect(Object.keys(g).length).toBeGreaterThanOrEqual(10);
    expect(GATE.gatePassed).toBe(Object.values(g).every(Boolean));
    expect(GATE.gatePassed).toBe(true);
  });

  it('represents all thirteen chapters', () => {
    expect(Object.keys(EXT.perChapterSections).map(Number).sort((a, b) => a - b))
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  it('has no gap or duplicate in any chapter, and every subsection has its parent', () => {
    for (let ch = 1; ch <= 13; ch++) {
      const nums = EXT.sections.filter((s) => s.chapter === ch).map((s) => Number(s.printed.split('.')[1]));
      expect(nums, `chapter ${ch}`).toEqual(nums.map((_, i) => i + 1));
    }
    const sectionIds = new Set(EXT.sections.map((s) => s.printed));
    for (const s of EXT.subsections) expect(sectionIds.has(s.parent!), s.printed).toBe(true);
    const subIds = EXT.subsections.map((s) => s.printed);
    expect(new Set(subIds).size).toBe(subIds.length);
  });

  it('anchors every section at both ends, contiguously, with no overlap', () => {
    for (let ch = 1; ch <= 13; ch++) {
      const secs = EXT.sections.filter((s) => s.chapter === ch);
      for (const s of secs) {
        expect(s.verificationStatus, s.printed).toBe('BOUNDARY_VERIFIED');
        expect(before(s.end, s.start), s.printed).toBe(false);
      }
      for (let i = 0; i + 1 < secs.length; i++) {
        const [a, b] = [secs[i], secs[i + 1]];
        // a ends on the line directly before b's heading
        const sameLine = a.end.pdfPage === b.start.pdfPage && a.end.bodyLine === b.start.bodyLine - 1;
        const pageBreak = b.start.bodyLine === 0 && a.end.pdfPage < b.start.pdfPage;
        expect(sameLine || pageBreak, `${a.printed} -> ${b.printed}`).toBe(true);
      }
    }
  });

  it('agrees with both printed Contents pages for every section', () => {
    expect(GATE.contentsCrossCheck.sectionsCompared).toBe(EXT.sections.length);
    expect(GATE.contentsCrossCheck.mismatches).toEqual([]);
    for (const s of EXT.sections) expect(s.contentsPageAgreement, s.printed).toBe(true);
  });

  it('checks every chapter page folio, keeping folios distinct from PDF pages', () => {
    expect(GATE.folioMismatches).toBe('none');
    expect(PAGES.everyChapterPageFolioVerified).toBe(true);
    const s = EXT.sections.find((x) => x.printed === '7.4')!;
    expect(s.pdfPage).toBe(19);
    expect(s.printedFolio).toBe(243);
  });

  it('publishes denominators equal to the record counts, and the per-chapter sums', () => {
    const d = MODEL.denominators;
    const sum = Object.values(EXT.perChapterSections).reduce((n, v) => n + v, 0);
    expect(d.sections.value).toBe(sum);
    expect(d.sections.value).toBe(EXT.sections.length);
    expect(d.subsections.value).toBe(SUBS.count);
    expect(SUBS.count).toBe(SUBS.subsections.length);
    expect(MANIFEST.denominators.sections.value).toBe(d.sections.value);
  });

  it('records the c12.07 page-only ends it corrected, and keeps the trail on re-runs', () => {
    const corrected = EXT.sections.filter((s) => (s as Record<string, unknown>).c1207EndPdfPage !== undefined);
    expect(corrected.length).toBeGreaterThan(0);
    expect(Object.keys(EXT.c1207PageOnlyEnds).length).toBe(55);
    for (const s of corrected) expect(EXT.c1207PageOnlyEnds[s.printed]).toBe((s as any).c1207EndPdfPage);
  });

  it('does not fold chapter end matter into the last section', () => {
    for (const c of MISC.chapters as Array<Record<string, any>>) {
      const inCh = EXT.sections.filter((s) => s.chapter === c.chapter);
      const last = inCh[inCh.length - 1];
      expect(c.chapterEndMatter, `chapter ${c.chapter}`).not.toBeNull();
      expect(last.end.anchor).toMatch(/LINE_BEFORE_(MISCELLANEOUS_EXERCISE|SUMMARY)/);
    }
  });
});

describe('what stays open', () => {
  it('keeps the source set INCOMPLETE while back matter is absent', () => {
    expect(MANIFEST.status).toBe('SOURCE_SET_INCOMPLETE');
    const missing = MODEL.sourceSetCompleteness.missing as Array<{ what: string; filename: string | null }>;
    const what = missing.map((m) => m.what).join(' | ');
    expect(what).toMatch(/Part I Answers/);
    expect(what).toMatch(/Appendix 1/);
    expect(what).toMatch(/Appendix 2/);
    expect(what).toMatch(/Part II Answers/);
    expect(what).toMatch(/Supplementary Material/);
    expect(missing.find((m) => /Part II Answers/.test(m.what))!.filename).toBeNull();
  });

  it('claims no page denominator', () => {
    expect(PAGES.pageDenominator.value).toBeNull();
    expect(MODEL.denominators.pages.value).toBeNull();
    expect(PAGES.validPdfPagesPresent).toBe(426);
    expect(PAGES.chapterBodyPdfPages.total).toBe(400);
  });

  it('leaves Supplementary Material unresolved', () => {
    expect(MODEL.supplementaryMaterial.disposition).toMatch(/UNRESOLVED/);
  });

  it('keeps answers out of instructional scope and the decomposition gate closed', () => {
    // No answer page is a section; no decomposition artifact exists yet.
    for (const s of [...EXT.sections, ...EXT.subsections]) expect(s.title).not.toMatch(/^Answers/i);
    for (const f of ['CLASS12_DECOMPOSITION.json', 'CLASS12_GRANULARITY_RISK.json',
      'CLASS12_PREREQUISITE_GRAPH.json', 'CLASS11_TO_CLASS12_TRANSITION_AUDIT.json']) {
      expect(fs.existsSync(path.join(root, 'class12-source', f)), f).toBe(false);
    }
  });

  it('does not let the CBSE topic count stand in for the NCERT chapter count', () => {
    const scope = rd<Record<string, any>>('class12-source/CLASS12_CBSE_TOPIC_SCOPE.json');
    expect(scope.topicCountNote).toMatch(/NOT established as the same thing/i);
    expect(fs.existsSync(path.join(root, 'class12-source/CLASS12_CBSE_NCERT_CORRESPONDENCE.json'))).toBe(false);
  });
});
