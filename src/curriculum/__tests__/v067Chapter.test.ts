// v0.67 §25 — the first complete draft chapter.

import { describe, it, expect } from 'vitest';
import {
  fractionsChapterSections,
  authoredSectionById,
  fractionsChapterCounts,
  section74AsAuthored,
} from '../fractionsChapter';
import {
  validateAuthoredSection,
  sequenceLeaks,
  readingLoadReport,
} from '../sectionValidators';
import {
  FRACTIONS_MISCONCEPTIONS,
  misconceptionsForSection,
  nonDiagnosableMisconceptions,
} from '../fractionsMisconceptions';
import { sectionsForChapter } from '../officialSections';
import { computeContentFingerprint, section74Artifact } from '../contentArtifact';
import { sectionEligibility } from '../eligibilityPolicy';
import { mayPublishSection, publicationPolicyFor } from '../publicationGate';
import { fractionsSectionCards } from '../studentChapterModel';
import { judge } from '../instructionalInteraction';
import { fractionsEqual } from '../visualSpecification';

const CH = 'ncert_gp_c6_ch07_fractions';

// ---------------------------------------------------------------------------
// §2 — all nine authored
// ---------------------------------------------------------------------------

describe('§2 the chapter is fully drafted', () => {
  it('has a draft for each of the nine official sections', () => {
    const secs = fractionsChapterSections();
    expect(secs).toHaveLength(9);
    const official = sectionsForChapter(CH).map((s) => s.officialSectionId);
    for (const id of official) {
      expect(authoredSectionById(id), `no draft for ${id}`).not.toBeNull();
    }
  });

  it('keeps every section in textbook order', () => {
    expect(fractionsChapterSections().map((s) => s.source.sectionNumber)).toEqual([
      '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9',
    ]);
  });

  it('records every section as an authored draft and nothing more', () => {
    const c = fractionsChapterCounts();
    expect(c.authoredDrafts).toBe(9);
    expect(c.educatorReviewed).toBe(0);
    expect(c.published).toBe(0);
  });

  it('matches each draft to the verified official record', () => {
    for (const s of fractionsChapterSections()) {
      expect(validateAuthoredSection(s), s.source.sectionNumber).toEqual([]);
    }
  });
});

// ---------------------------------------------------------------------------
// §1 — the frozen candidate is untouched
// ---------------------------------------------------------------------------

describe('§1 §7.4 review candidate is unchanged', () => {
  it('still fingerprints to a1a3ff57', () => {
    // If this fails, an educator may be reviewing content that no
    // longer exists. Authoring eight new sections must not touch it.
    expect(computeContentFingerprint()).toBe('a1a3ff57');
    expect(section74Artifact().reviewCode).toBe('S74-v1-A1A3FF');
  });

  it('projects §7.4 read-only rather than restructuring it', () => {
    const projected = section74AsAuthored();
    expect(projected.contentArtifactId).toBe('ncert_gp_c6_s7_4_lesson');
    expect(projected.contentArtifactVersion).toBe(1);
    // The projection must not have altered the source of truth.
    expect(computeContentFingerprint()).toBe('a1a3ff57');
  });

  it('gives every new section its own artifact identity', () => {
    const ids = fractionsChapterSections().map((s) => s.contentArtifactId);
    expect(new Set(ids).size).toBe(9);
    for (const id of ids) expect(id).toMatch(/^ncert_gp_c6_s7_\d_lesson$/);
  });
});

// ---------------------------------------------------------------------------
// §3 — sequence discipline
// ---------------------------------------------------------------------------

describe('§3 later concepts do not leak into earlier sections', () => {
  it('finds no sequence leaks anywhere in the chapter', () => {
    for (const s of fractionsChapterSections()) {
      expect(sequenceLeaks(s), s.source.sectionNumber).toEqual([]);
    }
  });

  it('keeps the number line out of §7.1–§7.3', () => {
    for (const num of ['7.1', '7.2', '7.3']) {
      const s = fractionsChapterSections().find((x) => x.source.sectionNumber === num)!;
      const text = [s.learningGoal, ...s.explanation].join(' ').toLowerCase();
      expect(text, `${num} previews the number line`).not.toContain('number line');
      expect(s.visuals.some((v) => v.type === 'number_line')).toBe(false);
    }
  });

  it('declares prerequisites that precede each section', () => {
    for (const s of fractionsChapterSections()) {
      for (const pre of s.sequence.prerequisiteSectionIds) {
        if (!pre.startsWith('ncert_gp_c6_s7_')) continue;
        expect(pre < s.source.officialSectionId, `${s.source.sectionNumber} depends on a later section`).toBe(true);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// §9 — guided and independent practice are distinct
// ---------------------------------------------------------------------------

describe('§9 guided practice differs from independent practice', () => {
  it('scaffolds every guided item with a hint', () => {
    for (const s of fractionsChapterSections()) {
      for (const g of s.guidedPractice) {
        expect(g.hint.trim().length, `${g.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('never repeats a guided prompt as an independent one', () => {
    for (const s of fractionsChapterSections()) {
      const guided = new Set(s.guidedPractice.map((g) => g.prompt.trim()));
      for (const p of s.independentPractice) {
        expect(guided.has(p.prompt.trim()), `${p.id} duplicates a guided item`).toBe(false);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// §10 — misconception integrity
// ---------------------------------------------------------------------------

describe('§10 misconceptions are diagnosed only when supported', () => {
  it('documents a chapter-wide registry', () => {
    expect(FRACTIONS_MISCONCEPTIONS.length).toBeGreaterThanOrEqual(8);
    for (const m of FRACTIONS_MISCONCEPTIONS) {
      expect(m.feedback.trim().length).toBeGreaterThan(20);
      expect(m.teacherNote.trim().length).toBeGreaterThan(10);
      expect(m.feedback.toLowerCase().trim()).not.toBe('wrong.');
    }
  });

  it('marks the ones that cannot be inferred from a response', () => {
    const nd = nonDiagnosableMisconceptions();
    expect(nd.length).toBeGreaterThan(0);
    for (const m of nd) expect(m.diagnosticSignal).toBeNull();
  });

  it('attaches misconceptions to sections where they occur', () => {
    expect(misconceptionsForSection('ncert_gp_c6_s7_7').map((m) => m.id)).toContain(
      'compare_numerators_only'
    );
    expect(misconceptionsForSection('ncert_gp_c6_s7_8').map((m) => m.id)).toContain(
      'add_numerators_and_denominators'
    );
  });

  it('does not add to the §7.4 misconception map', () => {
    // That map is inside the frozen fingerprint. Extending it would
    // invalidate the review candidate.
    expect(computeContentFingerprint()).toBe('a1a3ff57');
  });
});

// ---------------------------------------------------------------------------
// §7/§8 — alignment and interaction
// ---------------------------------------------------------------------------

describe('§7 interactive practice is section-aligned', () => {
  it('aligns every interactive item to its own section', () => {
    for (const s of fractionsChapterSections()) {
      for (const i of s.interactivePractice) {
        expect(i.officialSectionId).toBe(s.source.officialSectionId);
      }
    }
  });

  it('keeps all instructional items out of Growth', () => {
    for (const s of fractionsChapterSections()) {
      for (const i of s.interactivePractice) {
        expect(i.use).toBe('instructional_practice');
      }
    }
  });

  it('uses more than one interaction format across the chapter', () => {
    const c = fractionsChapterCounts();
    expect(Object.keys(c.interactiveByFormat).length).toBeGreaterThanOrEqual(3);
  });

  it('judges fraction answers exactly', () => {
    const s78 = authoredSectionById('ncert_gp_c6_s7_8')!;
    const item = s78.interactivePractice.find((i) => i.itemId === 's78.p3')!;
    // 1/2 + 1/3 = 5/6, and an equivalent form is accepted exactly.
    expect(judge(item, { kind: 'fraction', value: { numerator: 5, denominator: 6 } }).correct).toBe(true);
    expect(judge(item, { kind: 'fraction', value: { numerator: 10, denominator: 12 } }).correct).toBe(true);
    // A decimal approximation is not the same number.
    expect(judge(item, { kind: 'fraction', value: { numerator: 833, denominator: 1000 } }).correct).toBe(false);
  });

  it('asserts equivalence only where it is arithmetically true', () => {
    for (const s of fractionsChapterSections()) {
      for (const v of s.visuals) {
        if (v.type === 'fraction_strip' && v.assertsEquivalence) {
          const first = { numerator: v.strips[0].shadedCount, denominator: v.strips[0].denominator };
          for (const st of v.strips) {
            expect(
              fractionsEqual(first, { numerator: st.shadedCount, denominator: st.denominator })
            ).toBe(true);
          }
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// §11 — reading load
// ---------------------------------------------------------------------------

describe('§11 reading load stays within the Classes 6-8 standard', () => {
  it('reports zero stems requiring rewrite', () => {
    const r = readingLoadReport(fractionsChapterSections());
    expect(
      r.rewrite_required,
      `over threshold: ${JSON.stringify(r.overThreshold)}`
    ).toBe(0);
    expect(r.within_standard).toBeGreaterThan(40);
  });
});

// ---------------------------------------------------------------------------
// §22 — drafts stay invisible to students
// ---------------------------------------------------------------------------

describe('§22 authoring nine drafts does not change student eligibility', () => {
  it('leaves the student Fractions landing unchanged at four practisable', () => {
    const practisable = fractionsSectionCards().filter(
      (s) => s.availability !== 'not_available_yet'
    );
    expect(practisable).toHaveLength(4);
  });

  it('keeps every newly drafted section unavailable to students', () => {
    for (const id of [
      'ncert_gp_c6_s7_1', 'ncert_gp_c6_s7_3', 'ncert_gp_c6_s7_7', 'ncert_gp_c6_s7_9',
    ]) {
      expect(sectionEligibility(id).hasEligibleLearn).toBe(false);
    }
  });

  it('gives no new section a publication policy', () => {
    for (const s of fractionsChapterSections()) {
      const id = s.source.officialSectionId;
      if (id === 'ncert_gp_c6_s7_4') continue;
      expect(publicationPolicyFor(id)).toBeNull();
      expect(mayPublishSection(id).mayPublish).toBe(false);
    }
  });

  it('does not let a new section inherit §7.4 review decisions', () => {
    const r = mayPublishSection('ncert_gp_c6_s7_6');
    expect(r.mayPublish).toBe(false);
    if (!r.mayPublish) expect(r.blockers.join(' ')).toMatch(/No publication policy/);
  });
});
