/**
 * v0.84.0-c12.04 checkpoint 112 — Class 12 source evidence cannot contradict itself.
 *
 * The manifest once asserted both that the CBSE file was an AVAILABLE Class
 * XII source and that it "is a Secondary-stage syllabus document, not Class
 * 12". Two true-at-the-time statements written three checkpoints apart,
 * neither aware of the other. That is what hand-maintained evidence does.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { buildManifest, validatePdf, NCERT_EXPECTED } from '../../../tools/class12/generateSourceManifest';

const root = path.join(__dirname, '../../..');
const rd = (p: string): Record<string, never> => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const MANIFEST = rd('class12-source/CLASS12_SOURCE_MANIFEST.json');
const CBSE = rd('class12-source/CLASS12_CBSE_SOURCE.json');
const SCOPE = rd('class12-source/CLASS12_CBSE_TOPIC_SCOPE.json');

describe('the source manifest cannot contradict itself about the CBSE file', () => {
  it('never calls the same file both AVAILABLE and not Class 12', () => {
    const text = JSON.stringify(MANIFEST);
    const available = (MANIFEST.cbseSource as unknown as { status: string }).status === 'AVAILABLE';
    if (available) {
      expect(text).not.toMatch(/not Class 12|Secondary-stage syllabus document/i);
    }
  });

  it('is generated, not hand-maintained', () => {
    expect(MANIFEST.generatedBy as unknown as string).toMatch(/generateSourceManifest/);
    expect(fs.existsSync(path.join(root, 'tools/class12/generateSourceManifest.ts'))).toBe(true);
  });

  it('re-derives its statuses from the files actually present', () => {
    const fresh = buildManifest() as Record<string, never>;
    expect(fresh.status).toBe(MANIFEST.status);
    expect((fresh.cbseSource as unknown as { status: string }).status)
      .toBe((MANIFEST.cbseSource as unknown as { status: string }).status);
    expect((fresh.ncertSource as unknown as { acquired: number }).acquired)
      .toBe((MANIFEST.ncertSource as unknown as { acquired: number }).acquired);
  });
});

describe('a file is a textbook only if it opens as one', () => {
  it('rejects a proxy error body saved with a .pdf name', () => {
    const tmp = path.join('/tmp', 'fake-lemh.pdf');
    fs.writeFileSync(tmp, 'upstream connect error or disconnect/reset before headers');
    const v = validatePdf(tmp);
    expect(v.valid).toBe(false);
    expect(v.reason).toMatch(/proxy error body|missing %PDF/);
    fs.unlinkSync(tmp);
  });

  it('rejects a zero-byte file and an absent one', () => {
    const tmp = path.join('/tmp', 'empty-lemh.pdf');
    fs.writeFileSync(tmp, '');
    expect(validatePdf(tmp).reason).toBe('zero bytes');
    fs.unlinkSync(tmp);
    expect(validatePdf('/tmp/definitely-not-here.pdf').reason).toBe('absent');
  });

  it('accepts the CBSE syllabus when present, and never claims it when absent', () => {
    // v0.84.0-c12.08 — the CBSE PDF was never archived. It lived only in one
    // session's uploads, so c12.07's "24/24" depended on a file outside the
    // archive. When the bytes are here they must open and match the recorded
    // checksum; when they are not, the manifest must say so rather than claim
    // AVAILABLE from memory.
    const c = MANIFEST.cbseSource as unknown as { status: string; searchedPaths: string[]; recordedSha256: string };
    const present = c.searchedPaths
      .map((p) => (path.isAbsolute(p) ? p : path.join(root, p)))
      .find((p) => fs.existsSync(p));
    if (present) {
      expect(validatePdf(present).valid).toBe(true);
      expect(c.status).toBe('AVAILABLE');
    } else {
      expect(c.status).toBe('RECORDED_FILE_NOT_PRESENT');
      expect(c.recordedSha256).toBe(CBSE.sha256 as unknown as string);
    }
  });
});

describe('the NCERT axis reports exactly what arrived', () => {
  it('reports every expected file and what is missing', () => {
    const n = MANIFEST.ncertSource as unknown as
      { expectedFiles: number; acquired: number; missing: string[] };
    expect(n.expectedFiles).toBe(NCERT_EXPECTED.length);
    expect(n.acquired + n.missing.length).toBe(NCERT_EXPECTED.length);
  });

  it('decides no denominator itself — it mirrors the model the whole-book gate wrote', () => {
    // v0.84.0-c12.08 — was "claims no denominator". The invariant it guarded
    // is that the manifest never asserts a count on its own authority.
    const d = MANIFEST.denominators as unknown as Record<string, { value: unknown; status: string }>;
    const m = (rd('class12-source/CLASS12_SOURCE_MODEL.json').denominators) as unknown as
      Record<string, { value: unknown; status: string }>;
    for (const k of ['chapters', 'sections', 'subsections', 'pages']) {
      expect(d[k].value, k).toEqual(m[k].value);
      expect(d[k].status, k).toBe(m[k].status);
    }
    expect(d.pages.value).toBeNull();
  });

  it('keeps the CBSE and NCERT axes separate', () => {
    // Six CBSE units are not thirteen NCERT chapters, and thirteen CBSE
    // topics are not thirteen NCERT chapters either.
    expect((SCOPE.units as unknown as unknown[])).toHaveLength(6);
    expect(SCOPE.totalNamedTopics as unknown as number).toBe(13);
    expect(SCOPE.axisNote as unknown as string).toMatch(/not the NCERT chapter denominator/i);
    expect(SCOPE.topicCountNote as unknown as string).toMatch(/NOT established as the same thing/i);
  });
});

describe('the CBSE topic scope is extracted from the document', () => {
  it('carries all six units with marks summing to the paper total', () => {
    const units = SCOPE.units as unknown as Array<{ unit: string; marks: number; topics: unknown[] }>;
    expect(units.reduce((n, u) => n + u.marks, 0)).toBe(80);
    expect(SCOPE.paperMarks).toBe(80);
    expect(SCOPE.internalAssessment).toBe(20);
    for (const u of units) expect(u.topics.length, u.unit).toBeGreaterThan(0);
  });

  it('records real scope text per topic, not just titles', () => {
    for (const u of SCOPE.units as unknown as Array<{ topics: Array<{ scope: string }> }>) {
      for (const t of u.topics) expect(t.scope.length).toBeGreaterThan(50);
    }
  });

  it('identifies the CBSE source by reading it, not by its filename', () => {
    const id = CBSE.identityVerifiedFromDocument as unknown as Record<string, string>;
    expect(id.subjectCode).toBe('041');
    expect(id.academicYear).toMatch(/2026/);
    expect(CBSE.correctionToPriorCheckpoints as unknown as string).toMatch(/filename/i);
  });
});

describe('denominator statuses are recorded separately', () => {
  const MODEL = rd('class12-source/CLASS12_SOURCE_MODEL.json');
  const EXTENTS = rd('class12-source/CLASS12_SECTION_EXTENTS.json');

  it('keeps a VERIFIED chapter count while the source set is incomplete', () => {
    // These are different claims. A truncated chapter file does not unverify
    // the contents page that lists thirteen chapters.
    const d = MODEL.denominators as unknown as Record<string, { value: unknown; status: string }>;
    expect(d.chapters.value).toBe(13);
    expect(d.chapters.status).toBe('PRIMARY_SOURCE_VERIFIED');
    expect(MANIFEST.status).toBe('SOURCE_SET_INCOMPLETE');
  });

  it('claims a section or subsection denominator only after the whole-book gate passes', () => {
    // v0.84.0-c12.08 — was "claims no section or subsection denominator".
    // The invariant is unchanged and now stated directly: a denominator
    // exists if and only if every gate condition holds; pages stay null
    // while back matter is absent.
    const d = MODEL.denominators as unknown as Record<string, { value: unknown; status: string }>;
    const g = rd('class12-source/CLASS12_WHOLE_BOOK_CONSISTENCY.json');
    const passed = Object.values(g.gate as unknown as Record<string, boolean>).every(Boolean);
    expect(g.gatePassed).toBe(passed);
    for (const k of ['sections', 'subsections']) {
      if (passed) expect(d[k].status).toBe('PRIMARY_SOURCE_VERIFIED');
      else { expect(d[k].value).toBeNull(); expect(d[k].status).toBe('NOT_VERIFIED'); }
    }
    expect(d.pages.value).toBeNull();
    expect(d.pages.status).toBe('NOT_VERIFIED');
  });

  it('records that detection alone did not settle the count', () => {
    // v0.84.0-c12.08 — status moved from 12-of-13 to whole-book. What must
    // survive is the lesson: regex revisions disagreeing proved nothing.
    expect(EXTENTS.status).toBe('WHOLE_BOOK_RECONCILED_13_OF_13');
    expect(EXTENTS.chaptersMissing as unknown as number[]).toEqual([]);
    expect(EXTENTS.convergence as unknown as string).toMatch(/unreliable|disagreeing/i);
  });

  it('never uses the remembered total as a target, check or input', () => {
    // v0.84.0-c12.08 — the source-derived total now exists, so the figure
    // may legitimately appear as a count. What stays forbidden is the figure
    // inside the detection: no tool may name it, and the historical
    // comparison may only be written after the gate passed.
    for (const f of fs.readdirSync(path.join(root, 'tools/class12'))) {
      const src = fs.readFileSync(path.join(root, 'tools/class12', f), 'utf8');
      expect(src, f).not.toMatch(/\b65\b/);
    }
    const g = rd('class12-source/CLASS12_WHOLE_BOOK_CONSISTENCY.json');
    if (!g.gatePassed) expect(EXTENTS.historicalComparison).toBeNull();
    else expect(EXTENTS.historicalComparison as unknown as string).toMatch(/never an input, a target or a test oracle/);
  });

  it('leaves Supplementary Material unresolved rather than guessing', () => {
    const s = MODEL.supplementaryMaterial as unknown as Record<string, unknown>;
    expect(s.disposition as string).toMatch(/UNRESOLVED/);
    expect(JSON.stringify(s)).not.toMatch(/lemh1s|supp\.pdf/i);
  });

  it('invents no appendix or answers filenames', () => {
    const text = JSON.stringify(MODEL);
    expect(text).toMatch(/Appendix 1: Proofs in Mathematics/);
    expect(text).not.toMatch(/lemh1a1\.pdf|lemh1a2\.pdf|lemh2an\.pdf/);
    // v0.84.0-c12.08 — lemh1an.pdf is named only with its evidence label:
    // the owner reports it from the official index; it is not re-verified here.
    const missing = (MODEL.sourceSetCompleteness as unknown as { missing: Array<{ filename: string | null; filenameEvidence?: string }> }).missing;
    for (const m of missing) {
      if (m.filename) expect(m.filenameEvidence, m.filename).toMatch(/OFFICIAL_NCERT/);
    }
  });
});

describe('the hierarchy is reconciled, not regex-derived', () => {
  const EXT = rd('class12-source/CLASS12_SECTION_EXTENTS.json');
  const SUBS = rd('class12-source/CLASS12_SUBSECTION_RECORDS.json');
  const MISC = rd('class12-source/CLASS12_MISC_EXERCISE_SCOPES.json');
  const MODEL2 = rd('class12-source/CLASS12_SOURCE_MODEL.json');

  it('covers all thirteen chapters and names none missing', () => {
    expect(EXT.chaptersCovered).toBe(13);
    expect(EXT.chaptersMissing as unknown as number[]).toEqual([]);
    expect(SUBS.chaptersMissing as unknown as number[]).toEqual([]);
  });

  it('has no numbering gaps or duplicates left', () => {
    expect(EXT.gaps).toBe('none');
    expect(EXT.duplicatePrintedNumbers).toBe('none');
  });

  it('publishes the section and subsection denominators from the reconciled records', () => {
    // v0.84.0-c12.08 — Chapter 7 arrived and the whole-book gate passed. The
    // published value must equal the record count, never be typed in.
    const d = MODEL2.denominators as unknown as Record<string, { value: number; status: string }>;
    expect(d.sections.value).toBe((EXT.sections as unknown as unknown[]).length);
    expect(d.subsections.value).toBe((SUBS.subsections as unknown as unknown[]).length);
    expect(d.sections.status).toBe('PRIMARY_SOURCE_VERIFIED');
  });

  it('records convergence between independent methods', () => {
    expect(EXT.method as unknown as string).toMatch(/Recall-first/);
    expect(EXT.convergence as unknown as string).toMatch(/two methods/i);
    expect(EXT.convergence as unknown as string).toMatch(/Contents pages/);
  });

  it('counts only BOUNDARY_VERIFIED extents toward the denominator', () => {
    // v0.84.0-c12.08 — was "marks every extent as not visually verified".
    // Extents are now line-anchored at both ends; the published count must
    // include no record below BOUNDARY_VERIFIED.
    for (const s of [...EXT.sections as unknown as Array<{ verificationStatus: string; printed: string }>,
      ...SUBS.subsections as unknown as Array<{ verificationStatus: string; printed: string }>]) {
      expect(s.verificationStatus, s.printed).toBe('BOUNDARY_VERIFIED');
    }
  });

  it('does not assume every chapter has a miscellaneous exercise', () => {
    // Chapter 12 has none. Assuming otherwise would invent scope.
    expect(MISC.withoutMiscellaneous as unknown as number[]).toEqual([12]);
    // v0.84.0-c12.08 — chapter 7 determined from its own source: it has one.
    expect((MISC.withMiscellaneous as unknown as number[]).length).toBe(12);
    expect(MISC.withMiscellaneous as unknown as number[]).toContain(7);
    expect(MISC.dispositionPolicy as unknown as string).toMatch(/no canonical unit is created/i);
  });
});
