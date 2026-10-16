// v0.83.3 — REVIEW EVIDENCE INTEGRITY, PROVED RATHER THAN ASSERTED.
//
// The v0.83.2 "end-to-end import" test did not import anything. It built
// a submission with `reviewerRole: 'grade6_math_educator'` (not a role
// the schema has) and responses shaped `{rating, comment}` (the importer
// wants `{decision, rationale}`), then asserted only that the
// identity-related errors were empty — which they were, because the
// submission never reached the identity checks. These tests build real
// submissions and assert `ok === true`.

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { importReviewSubmission, reviewRecordFor } from '../educatorReview';
import { sectionReviewRecord } from '../sectionReviewPackages';
import {
  MAPPING_SNAPSHOT_VERSION,
  SECTION_7_4_ARTIFACT_VERSION,
  computeContentFingerprint,
  curriculumEvidenceFingerprint,
  section74ProvenanceFingerprint,
} from '../contentArtifact';
import {
  SOURCE_PROVENANCE_VERSION,
  sectionFingerprint,
  sectionProvenanceFingerprint,
} from '../sectionReviewPackages';

const root = (f: string) => new URL(`../../../${f}`, import.meta.url);
const read = (f: string) => readFileSync(root(f), 'utf8');

const answers = (ids: string[]) =>
  ids.map((itemId) => ({
    itemId,
    decision: 'accept' as const,
    rationale: 'Clear enough to use with my class as written.',
  }));

// ---------------------------------------------------------------------------
describe('§10 Package B — a real current response imports', () => {
  const rec = () => reviewRecordFor('B_demonstration');
  const valid = () => ({
    submissionId: 'sub_b_current',
    packageId: 'B_demonstration' as const,
    questionSetVersion: rec().questionSetVersion,
    contentArtifactId: rec().contentArtifactId ?? undefined,
    contentArtifactVersion: SECTION_7_4_ARTIFACT_VERSION,
    contentFingerprint: computeContentFingerprint(),
    sourceProvenanceFingerprint: section74ProvenanceFingerprint(),
    reviewerId: 'rev_current',
    reviewerName: 'A. Teacher',
    reviewerRole: 'practising_teacher' as const,
    reviewDate: '2026-09-23',
    responses: answers(rec().expectedItemIds),
  });

  it('accepts it, with no errors at all', () => {
    const r = importReviewSubmission(rec(), valid());
    expect(r.ok ? [] : r.errors).toEqual([]);
    expect(r.ok).toBe(true);
  });

  it('quarantines an old-provenance response for re-check', () => {
    const r = importReviewSubmission(rec(), {
      ...valid(),
      sourceProvenanceFingerprint: 'a1a3ff57',
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.join(' ')).toMatch(/superseded source citation/);
    expect(r.errors.join(' ')).toMatch(/quarantine/i);
  });

  it('rejects an old-content response as a content mismatch', () => {
    const r = importReviewSubmission(rec(), {
      ...valid(),
      contentFingerprint: 'a1a3ff57',
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.join(' ')).toMatch(/does not match the current content/);
  });

  it('fails when provenance is MISSING — the gate cannot be skipped', () => {
    const body = valid() as Record<string, unknown>;
    delete body.sourceProvenanceFingerprint;
    const r = importReviewSubmission(rec(), body);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.join(' ')).toMatch(/sourceProvenanceFingerprint is required/);
  });

  it('fails on a malformed provenance value', () => {
    const r = importReviewSubmission(rec(), {
      ...valid(),
      sourceProvenanceFingerprint: '',
    });
    expect(r.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe('§14/§15 Package A — curriculum mapping has its own identity', () => {
  const rec = () => reviewRecordFor('A_curriculum');
  const valid = () => ({
    submissionId: 'sub_a_current',
    packageId: 'A_curriculum' as const,
    questionSetVersion: rec().questionSetVersion,
    curriculumEvidenceFingerprint: curriculumEvidenceFingerprint(),
    mappingSnapshotVersion: MAPPING_SNAPSHOT_VERSION,
    sourceProvenanceFingerprint: section74ProvenanceFingerprint(),
    reviewerId: 'rev_cs',
    reviewerName: 'B. Specialist',
    reviewerRole: 'curriculum_specialist' as const,
    reviewDate: '2026-09-23',
    responses: answers(rec().expectedItemIds),
  });

  it('accepts a real current curriculum-review response', () => {
    const r = importReviewSubmission(rec(), valid());
    expect(r.ok ? [] : r.errors).toEqual([]);
    expect(r.ok).toBe(true);
  });

  it('does not identify a mapping review by the lesson fingerprint', () => {
    expect(curriculumEvidenceFingerprint()).not.toBe(computeContentFingerprint());
  });

  it('requires the mapping identity', () => {
    const body = valid() as Record<string, unknown>;
    delete body.curriculumEvidenceFingerprint;
    const r = importReviewSubmission(rec(), body);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.join(' ')).toMatch(/curriculumEvidenceFingerprint is required/);
  });

  it('rejects a mapping identity from a superseded page', () => {
    const r = importReviewSubmission(rec(), {
      ...valid(),
      curriculumEvidenceFingerprint: 'a1a3ff57',
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.join(' ')).toMatch(/does not match the current mapping/);
  });

  it('requires provenance here too', () => {
    const body = valid() as Record<string, unknown>;
    delete body.sourceProvenanceFingerprint;
    const r = importReviewSubmission(rec(), body);
    expect(r.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe('§13 Chapter 3 and 7 section packages enforce provenance', () => {
  const ids = [
    'ncert_gp_c6_s3_1', 'ncert_gp_c6_s3_2', 'ncert_gp_c6_s3_3',
    'ncert_gp_c6_s7_1', 'ncert_gp_c6_s7_5',
  ];
  for (const id of ids) {
    it(`${id} accepts a current response and refuses a missing provenance`, () => {
      const rec = sectionReviewRecord(id);
      const base = {
        submissionId: `sub_${id}`,
        packageId: rec.packageId,
        questionSetVersion: rec.questionSetVersion,
        contentArtifactId: rec.contentArtifactId ?? undefined,
        contentArtifactVersion: rec.contentArtifactVersion ?? undefined,
        contentFingerprint: sectionFingerprint(id),
        sourceProvenanceFingerprint: sectionProvenanceFingerprint(id),
        reviewerId: 'rev_s',
        reviewerName: 'A. Teacher',
        reviewerRole: 'practising_teacher' as const,
        reviewDate: '2026-09-23',
        responses: answers(rec.expectedItemIds),
      };
      const ok = importReviewSubmission(rec, base);
      expect(ok.ok ? [] : ok.errors).toEqual([]);

      const without = { ...base } as Record<string, unknown>;
      delete without.sourceProvenanceFingerprint;
      const bad = importReviewSubmission(rec, without);
      expect(bad.ok).toBe(false);
    });
  }

  it('publishes every identity the importer checks in the manifest', () => {
    for (const f of [
      'PRAGATI_CHAPTER_3_REVIEW_PACKAGES_CURRENT/index.json',
      'PRAGATI_CHAPTER_7_REVIEW_PACKAGES_CURRENT/index.json',
    ]) {
      const m = JSON.parse(read(f));
      for (const p of m.packages) {
        expect(p.contentFingerprint, f).toMatch(/^[0-9a-f]{8}$/);
        expect(p.sourceProvenanceFingerprint, f).toMatch(/^[0-9a-f]{8}$/);
        expect(p.sourceProvenanceVersion, f).toBe(SOURCE_PROVENANCE_VERSION);
        expect(p.questionSetVersion, f).toBe(1);
        expect(p.artifactVersion, f).toBeGreaterThan(0);
      }
    }
  });
});

// ---------------------------------------------------------------------------
describe('§7 every CURRENT package is internally consistent', () => {
  const CURRENT = [
    'PRAGATI_SECTION_7_4_REVIEW_CURRENT',
    'PRAGATI_SECTION_7_4_CURRICULUM_REVIEW_CURRENT',
    'PRAGATI_CHAPTER_3_REVIEW_PACKAGES_CURRENT',
    'PRAGATI_CHAPTER_7_REVIEW_PACKAGES_CURRENT',
  ];
  // Superseded metadata, in any file of any current folder. IDENTITY.md
  // is allowed to name the old code while telling the sender not to use
  // it; nothing else is.
  const SUPERSEDED = [/\bA1A3FF\b/, /\ba1a3ff57\b/, /\b7BFD8C\b/, /\b7bfd8cc3\b/];

  for (const dir of CURRENT) {
    for (const file of readdirSync(root(dir))) {
      if (file === 'IDENTITY.md') continue;
      it(`${dir}/${file} carries no superseded identity or page`, () => {
        const t = read(`${dir}/${file}`);
        for (const re of SUPERSEDED) expect(t, `${dir}/${file}`).not.toMatch(re);
        // §7.4's page, wherever it is cited, is the printed one.
        if (/7\.4/.test(t)) {
          expect(t, `${dir}/${file}`).not.toMatch(/\b160\b/);
        }
      });
    }
  }

  it('the §7.4 candidate manifest alone identifies the artifact and its provenance', () => {
    const c = JSON.parse(read('PRAGATI_SECTION_7_4_REVIEW_CURRENT/review-candidate.json'));
    expect(c.contentFingerprint).toBe(computeContentFingerprint());
    expect(c.sourceProvenanceFingerprint).toBe(section74ProvenanceFingerprint());
    expect(c.sourceProvenanceVersion).toBe(SOURCE_PROVENANCE_VERSION);
    expect(c.sourcePage).toBe(159);
    expect(c.reviewCode).toBe('S74-v1-DFC56A');
  });

  it('the curriculum package states the same page and mapping', () => {
    const e = JSON.parse(read('PRAGATI_SECTION_7_4_CURRICULUM_REVIEW_CURRENT/curriculum-evidence.json'));
    expect(JSON.stringify(e)).toContain('159');
    expect(read('PRAGATI_SECTION_7_4_CURRICULUM_REVIEW_CURRENT/PACKAGE_A_CURRICULUM_QUESTIONS.md')).toContain('**159**');
  });
});

// ---------------------------------------------------------------------------
describe('§8/§16 exactly one current path', () => {
  it('the current handoff documents name only current folders and codes', () => {
    for (const f of [
      'REVIEW_HANDOFF/SEND_THIS.md',
      'REVIEW_HANDOFF/SEND_THIS_CHAPTER_3.md',
      'REVIEW_HANDOFF/CURRENT_REVIEW_IDENTITY.md',
    ]) {
      const t = read(f);
      expect(t, f).not.toMatch(/PROVENANCE_V2/);
      expect(t, f).not.toMatch(/PROVENANCE_ADDENDUM/);
      expect(t, f).not.toMatch(/S74-v1-7BFD8C/);
    }
  });

  it('keeps the superseded architecture only under a historical filename', () => {
    const h = read('REVIEW_HANDOFF/HISTORICAL_PROVENANCE_CORRECTION_v0_83_1.md');
    expect(h.slice(0, 500)).toMatch(/SUPERSEDED — HISTORICAL, v0\.83\.1 ONLY/);
  });

  it('points every DO_NOT_SEND marker at the current document', () => {
    for (const d of [
      'PRAGATI_SECTION_7_4_REVIEW_FINAL',
      'PRAGATI_SECTION_7_4_CURRICULUM_REVIEW',
      'PRAGATI_CHAPTER_3_REVIEW_PACKAGES',
      'PRAGATI_CHAPTER_7_REVIEW_PACKAGES',
    ]) {
      const t = read(`${d}/DO_NOT_SEND.md`);
      expect(t, d).toContain('CURRENT_REVIEW_IDENTITY.md');
      expect(t, d).not.toContain('PROVENANCE_CORRECTION_v0_83_1.md');
    }
  });

  it('SEND_THIS no longer claims a regenerated file was left unchanged', () => {
    const t = read('REVIEW_HANDOFF/SEND_THIS.md');
    expect(t).not.toMatch(/left them unchanged/);
    // v0.83.5 §5 — the sender instructions are release-neutral now, so
    // the assertion is that no release label appears at all rather than
    // that a particular one does.
    expect(t).not.toMatch(/Current state \(v0\.\d/);
    expect(t).toContain('Current state:');
  });
});
