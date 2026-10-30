// v0.83.2 — WHAT THE SCREEN ACTUALLY RENDERS, AND WHICH PACKAGE IS CURRENT.
//
// v0.83.1 proved the MODEL knew Classes 1-5, 7 and 8 and shipped a
// Student screen that still showed six legacy modules for Class 3. These
// tests assert the path the UI really uses, and the review identity a
// reviewer would actually receive.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { chaptersForStudentGrade } from '../../features/student/StudentShell';
import { OFFICIAL_CHAPTERS } from '../officialChapters';
import { EVIDENCE_DERIVED_GRADES } from '../runtimeCurriculumFromEvidence';
import { MASTER_RECORDS } from '../curriculumMasterMap';
import {
  sectionFingerprint,
  sectionProvenanceFingerprint,
  sectionReviewIdentity,
  SOURCE_PROVENANCE_VERSION,
} from '../sectionReviewPackages';
import {
  SECTION_7_4_ARTIFACT_VERSION,
  computeContentFingerprint,
  section74Artifact,
  section74ProvenanceFingerprint,
} from '../contentArtifact';
import { importReviewSubmission, REVIEW_RECORDS, type ReviewRecord } from '../educatorReview';

const read = (f: string) => readFileSync(new URL(`../../../${f}`, import.meta.url), 'utf8');

const EXPECTED_CHAPTERS: Record<string, number> = {
  class1: 13, class2: 11, class3: 14, class4: 14, class5: 15, class7: 15, class8: 14,
};

// ---------------------------------------------------------------------------
describe('§A the LIVE student path is canonical', () => {
  for (const g of EVIDENCE_DERIVED_GRADES) {
    it(`${g} renders the book's chapters, in the book's order`, () => {
      const rows = chaptersForStudentGrade(g).filter((r) => r.official);
      const map = MASTER_RECORDS.filter(
        (r) => r.classNumber === Number(g.replace('class', '')) && r.level === 'chapter'
      );
      expect(rows).toHaveLength(EXPECTED_CHAPTERS[g]);
      expect(rows.map((r) => r.title)).toEqual(map.map((r) => r.title));
      expect(rows.map((r) => r.chapterId)).toEqual(map.map((r) => `official:${r.recordId}`));
    });

    it(`${g} offers no launch for a chapter with no content`, () => {
      for (const r of chaptersForStudentGrade(g).filter((x) => x.official)) {
        expect(r.inventory.status, r.title).toBe('no_content');
        expect(r.canLaunch, r.title).toBe(false);
      }
    });

    it(`${g} does not dress a legacy module as a chapter of the book`, () => {
      for (const r of chaptersForStudentGrade(g).filter((x) => !x.official)) {
        expect(r.subtitle).toContain('not a chapter of your book');
      }
    });
  }

  it('keeps both Chapter 1s of a two-part book, and says which part', () => {
    for (const g of ['class7', 'class8'] as const) {
      const ones = chaptersForStudentGrade(g).filter((r) => r.official && r.chapterNumber === 1);
      expect(ones, g).toHaveLength(2);
      expect(ones.map((r) => r.bookPart).sort(), g).toEqual(['Part I', 'Part II']);
      for (const r of ones) expect(r.subtitle, g).toContain(`${r.bookPart} · Chapter 1`);
    }
  });

  it('carries the same records into the registry the resolver reads', () => {
    for (const g of EVIDENCE_DERIVED_GRADES) {
      const recs = OFFICIAL_CHAPTERS.filter((c) => c.grade === g);
      expect(recs.length, g).toBe(EXPECTED_CHAPTERS[g]);
      for (const r of recs) {
        expect(r.verificationStatus, r.officialChapterId).toBe('primary_source_verified');
        expect(r.dateVerified, r.officialChapterId).toBe('2026-09-22');
      }
    }
  });
});

// ---------------------------------------------------------------------------
describe('§11 content identity and source provenance are separate', () => {
  it('a page correction does not move the instructional fingerprint', () => {
    // The instructional payload no longer contains the page, so the only
    // way this hash moves is if the teaching moves.
    const before = computeContentFingerprint();
    expect(before).toBe('dfc56ab5');
    expect(section74Artifact().reviewCode).toBe('S74-v1-DFC56A');
    expect(SECTION_7_4_ARTIFACT_VERSION).toBe(1);
  });

  it('records the citation in its own fingerprint', () => {
    expect(section74ProvenanceFingerprint()).toBe('efeccb48');
    expect(SOURCE_PROVENANCE_VERSION).toBe(2);
    const id = sectionReviewIdentity('ncert_gp_c6_s7_1');
    expect(id.contentFingerprint).toBe(sectionFingerprint('ncert_gp_c6_s7_1'));
    expect(id.provenanceFingerprint).toBe(sectionProvenanceFingerprint('ncert_gp_c6_s7_1'));
    expect(id.contentFingerprint).not.toBe(id.provenanceFingerprint);
  });

  it('gives every authored section two distinct identities', () => {
    const seen = new Set<string>();
    for (const id of ['ncert_gp_c6_s3_1', 'ncert_gp_c6_s3_2', 'ncert_gp_c6_s3_3']) {
      const i = sectionReviewIdentity(id);
      expect(i.reviewCode).toMatch(/^S3\d-v1-[0-9A-F]{6}$/);
      seen.add(i.contentFingerprint);
      seen.add(i.provenanceFingerprint);
    }
    expect(seen.size).toBe(6);
  });
});

// ---------------------------------------------------------------------------
describe('§14 review import, end to end', () => {
  const pkg = REVIEW_RECORDS.find((p: ReviewRecord) => p.packageId === 'B_demonstration')!;
  const base = {
    submissionId: 'sub_test_1',
    packageId: 'B_demonstration' as const,
    questionSetVersion: pkg.questionSetVersion,
    contentArtifactId: pkg.contentArtifactId,
    contentArtifactVersion: pkg.contentArtifactVersion,
    reviewerId: 'rev_1',
    reviewerName: 'A. Teacher',
    reviewerRole: 'grade6_math_educator' as const,
    reviewDate: '2026-09-23',
    responses: pkg.expectedItemIds.map((itemId: string) => ({
      itemId,
      rating: 4 as const,
      comment: 'Clear enough for my class.',
    })),
  };

  it('accepts a response carrying the CURRENT identity', () => {
    const r = importReviewSubmission(pkg, {
      ...base,
      contentFingerprint: computeContentFingerprint(),
      sourceProvenanceFingerprint: section74ProvenanceFingerprint(),
    });
    // The response shape is exercised elsewhere; what matters here is
    // that neither identity check objects to the CURRENT package.
    const errs = r.ok ? [] : r.errors;
    expect(errs.filter((e) => /fingerprint|provenance|artifactVersion/i.test(e))).toEqual([]);
  });

  it('rejects a response carrying the SUPERSEDED provenance, and says why', () => {
    const r = importReviewSubmission(pkg, {
      ...base,
      contentFingerprint: computeContentFingerprint(),
      // The identity printed in PRAGATI_SECTION_7_4_REVIEW_FINAL (page 160).
      sourceProvenanceFingerprint: 'a1a3ff57',
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.join(' ')).toMatch(/superseded source citation/);
    expect(r.errors.join(' ')).toMatch(/quarantined/);
  });

  it('still rejects a response written against different teaching', () => {
    const r = importReviewSubmission(pkg, {
      ...base,
      contentFingerprint: 'a1a3ff57',
      sourceProvenanceFingerprint: section74ProvenanceFingerprint(),
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.join(' ')).toMatch(/does not match the current content/);
  });

  it('does not mark anything sent, reviewed or published', () => {
    const m = read('REVIEW_HANDOFF/CURRENT_REVIEW_IDENTITY.md');
    expect(m).toContain('0 sent');
  });
});

// ---------------------------------------------------------------------------
describe('§9/§13 one current-for-sending path', () => {
  it('the §7.4 current package is internally consistent', () => {
    for (const f of [
      'PRAGATI_SECTION_7_4_REVIEW_CURRENT/PACKAGE_B_FOR_REVIEWER.md',
      'PRAGATI_SECTION_7_4_REVIEW_CURRENT/README.md',
      'PRAGATI_SECTION_7_4_REVIEW_CURRENT/review-candidate.json',
    ]) {
      const t = read(f);
      expect(t, f).not.toContain('A1A3FF');
      expect(t, f).not.toContain('a1a3ff57');
      expect(t, f).not.toMatch(/\b160\b/);
    }
    expect(read('PRAGATI_SECTION_7_4_REVIEW_CURRENT/IDENTITY.md')).toContain('S74-v1-DFC56A');
  });

  it('the handoff documents point only at current packages', () => {
    const a = read('REVIEW_HANDOFF/SEND_THIS.md');
    expect(a).toContain('PRAGATI_SECTION_7_4_REVIEW_CURRENT');
    expect(a).toContain('S74-v1-DFC56A');
    // The old code appears only where the document says not to use it.
    expect(a).not.toMatch(/quote back[^\n]*A1A3FF/i);
    const b = read('REVIEW_HANDOFF/SEND_THIS_CHAPTER_3.md');
    expect(b).toContain('PRAGATI_CHAPTER_3_REVIEW_PACKAGES_CURRENT');
    expect(b).toContain('S32-v1-14F313');
    expect(b).not.toContain('S32-v1-4F4A92');
  });

  it('marks every historical folder DO NOT SEND', () => {
    for (const d of [
      'PRAGATI_SECTION_7_4_REVIEW_FINAL',
      'PRAGATI_SECTION_7_4_CURRICULUM_REVIEW',
      'PRAGATI_CHAPTER_3_REVIEW_PACKAGES',
      'PRAGATI_CHAPTER_7_REVIEW_PACKAGES',
    ]) {
      expect(read(`${d}/DO_NOT_SEND.md`), d).toContain('DO NOT SEND');
    }
  });
});

// ---------------------------------------------------------------------------
describe('§15/§16 active product metadata is current', () => {
  it('the browser title is not the old prototype name', () => {
    const html = read('index.html');
    expect(html).toContain('<title>Pragati — Mathematics Learning</title>');
    expect(html).not.toContain('Growth Assessment Prototype');
  });

  it('marks the stale verification constants historical rather than leaving them active', () => {
    const src = read('src/curriculum/officialChapters.ts');
    expect(src).toContain('v0.83.2 §16 — HISTORICAL. Class 6 was verified');
    expect(src).toContain('v0.83.2 §16 — HISTORICAL, and now resolved');
    expect(read('src/curriculum/officialCurriculum.ts')).toContain('HISTORICAL_NCERT_BLOCKED_NOTE_v0_68');
  });
});
