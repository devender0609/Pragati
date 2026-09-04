// v0.72 §32 — completeness depth, the three truths, the backlog, and the
// one canonical next action.

import { describe, it, expect } from 'vitest';
import {
  checkOfficialCompleteness,
  EXPECTED_STRUCTURES,
  expectedFor,
} from '../officialCompleteness';
import { OFFICIAL_CURRICULA, type OfficialCurriculum } from '../officialCurriculum';
import { validateCurriculumRegistry } from '../validate';
import {
  coverageMatrix,
  coverageForGrade,
  coverageBacklog,
  backlogSummary,
  verifiedGradesWithNoContent,
} from '../coverageMatrix';
import {
  assessSection,
  totalsFor,
  COMPLETE_DRAFT_MINIMUM,
} from '../instructionalCompleteness';
import { fractionsChapterSections, authoredSectionById } from '../fractionsChapter';
import {
  nextActionForChapter,
  mayUseOfficialSectionLabel,
} from '../nextAction';
import { sectionsForChapter } from '../officialSections';
import { computeContentFingerprint } from '../contentArtifact';

// ---------------------------------------------------------------------------
// §1/§2 — completeness, now at verified section depth
// ---------------------------------------------------------------------------

describe('§2 completeness follows evidence depth', () => {
  it('passes today at every verified depth', () => {
    expect(checkOfficialCompleteness()).toEqual([]);
    expect(validateCurriculumRegistry().filter((i) => i.severity === 'error')).toEqual([]);
  });

  it('FAILS when one verified SECTION disappears', () => {
    // The top-level gate alone would not notice: the chapter is still
    // there, and an aggregate topic total could be restored by a
    // duplicate elsewhere.
    const clone: OfficialCurriculum[] = OFFICIAL_CURRICULA.map((c) => ({
      ...c,
      units: c.units.map((u) => ({ ...u, topics: [...u.topics] })),
    }));
    const ch7 = clone
      .find((c) => c.grade === 'class6')!
      .units.find((u) => u.title === 'Fractions')!;
    ch7.topics.pop();

    const failures = checkOfficialCompleteness(clone, EXPECTED_STRUCTURES);
    expect(failures.map((f) => f.code)).toContain('OFFICIAL_SECTION_COUNT_MISMATCH');
    // The message names the chapter, so it points at the file to open.
    expect(failures.find((f) => f.code === 'OFFICIAL_SECTION_COUNT_MISMATCH')!.message)
      .toContain('Fractions');
  });

  it('checks section depth ONLY where a source was read that deep', () => {
    // Demanding a section count for an unread source would either
    // invent one or force the gate off.
    expect(expectedFor('class6')!.sectionsPerUnit).toHaveLength(10);
    for (const g of ['class10', 'class11', 'class12'] as const) {
      expect(expectedFor(g)!.sectionsPerUnit, g).toBeNull();
    }
  });

  it('sums the per-chapter section counts to the verified total', () => {
    const per = expectedFor('class6')!.sectionsPerUnit!;
    expect(per.reduce((a, b) => a + b, 0)).toBe(65);
  });
});

// ---------------------------------------------------------------------------
// §3/§26 — the three truths, kept apart
// ---------------------------------------------------------------------------

describe('§3 the coverage matrix keeps three truths separate', () => {
  it('covers all twelve classes', () => {
    expect(coverageMatrix()).toHaveLength(12);
  });

  it('reports UNKNOWN, not zero, for an unverified grade', () => {
    for (const g of ['class1', 'class3', 'class7', 'class8'] as const) {
      const r = coverageForGrade(g);
      expect(r.verified, g).toBe(false);
      expect(r.officialUnits, g).toBeNull();
      expect(r.recordsRepresented, g).toBeNull();
      expect(r.omissions, g).toBeNull();
    }
  });

  it('confirms every verified grade represents all official records', () => {
    for (const r of coverageMatrix()) {
      if (!r.verified) continue;
      expect(r.omissions, r.gradeLabel).toBe(0);
      expect(r.recordsRepresented, r.gradeLabel).toBe(r.officialUnits);
    }
  });

  it('§26 — a verified grade with no content keeps its curriculum', () => {
    const empty = verifiedGradesWithNoContent();
    expect(empty.map((r) => r.gradeLabel).sort()).toEqual([
      'Class 10', 'Class 11', 'Class 12', 'Class 9',
    ]);
    for (const r of empty) {
      // Curriculum present, content absent. Two different facts.
      expect(r.officialUnits, r.gradeLabel).toBeGreaterThan(0);
      expect(r.drafts, r.gradeLabel).toBe(0);
    }
  });

  it('never collapses a draft into student-ready', () => {
    const c6 = coverageForGrade('class6');
    expect(c6.drafts).toBe(9);
    // v0.75 §22: 8 -> 9. §7.9 was one worked example and one
    // independent item short; both were authored. The point of this
    // test is the LAST THREE assertions — complete is still not
    // reviewed, and reviewed is still not published — and they are
    // unchanged.
    expect(c6.completeInstructionalDrafts).toBe(9);
    expect(c6.educatorReviewed).toBe(0);
    expect(c6.studentReady).toBe(0);
    expect(c6.published).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// §4/§5/§25 — instructional completeness
// ---------------------------------------------------------------------------

describe('§4-§5 instructional completeness is honest', () => {
  it('reports nine complete drafts and none incomplete', () => {
    // v0.75 §22 — was 8 complete / 1 incomplete.
    const rows = fractionsChapterSections().map(assessSection);
    const t = totalsFor(rows);
    expect(t.total).toBe(9);
    expect(t.complete_instructional_draft).toBe(9);
    expect(t.incomplete_draft).toBe(0);
    // Nothing reviewed, nothing published. Ever, until a human acts.
    expect(t.reviewed).toBe(0);
    expect(t.published).toBe(0);
  });

  it('names the actual gap rather than aggregating it away', () => {
    // v0.75 §22 — §7.9's gaps were real and are now closed, so this
    // asserts the MECHANISM on a section that still has a gap rather
    // than deleting the test. `gaps` must name the component and the
    // count, never a bare "incomplete".
    const s79 = assessSection(authoredSectionById('ncert_gp_c6_s7_9')!);
    expect(s79.level).toBe('complete_instructional_draft');
    expect(s79.gaps).toEqual([]);

    const stripped = assessSection({
      ...authoredSectionById('ncert_gp_c6_s7_9')!,
      workedExamples: [],
    });
    expect(stripped.level).toBe('incomplete_draft');
    expect(stripped.gaps.join(' ')).toMatch(/worked examples/);
    expect(stripped.gaps.join(' ')).toMatch(/needs 2/);
  });

  it('waives a requirement only with a stated reason', () => {
    const s79 = assessSection(authoredSectionById('ncert_gp_c6_s7_9')!);
    // A history section must not fail for lacking a number-line
    // interaction; the correct response to that failure would be to
    // bolt a quiz about dates onto a discussion, making it worse.
    expect(s79.visualRequirement.required).toBe(false);
    expect(s79.interactionRequirement.required).toBe(false);
    if (!s79.visualRequirement.required) {
      expect(s79.visualRequirement.reason.length).toBeGreaterThan(40);
    }
  });

  it('does not waive requirements for an ordinary section', () => {
    const s76 = assessSection(authoredSectionById('ncert_gp_c6_s7_6')!);
    expect(s76.visualRequirement.required).toBe(true);
    expect(s76.interactionRequirement.required).toBe(true);
  });

  it('§25 — a shallow skeleton never counts as complete', () => {
    const real = authoredSectionById('ncert_gp_c6_s7_6')!;
    const skeleton = {
      ...real,
      explanation: ['Fractions are parts of a whole.'],
      workedExamples: [],
      guidedPractice: [],
      independentPractice: real.independentPractice.slice(0, 3),
      reasoningApplication: [],
      interactivePractice: [],
      visuals: [],
    };
    const a = assessSection(skeleton as typeof real);
    expect(a.level).toBe('generated_skeleton');
    expect(a.level).not.toBe('complete_instructional_draft');
  });

  it('sets the bar where a one-paragraph section fails it', () => {
    expect(COMPLETE_DRAFT_MINIMUM.explanationParagraphs).toBeGreaterThan(1);
    expect(COMPLETE_DRAFT_MINIMUM.workedExamples).toBeGreaterThan(1);
  });
});

// ---------------------------------------------------------------------------
// §23 — the backlog is derived and exhaustive
// ---------------------------------------------------------------------------

describe('§23 every uncovered verified record is in the backlog', () => {
  it('lists an entry for every verified record without complete reviewed content', () => {
    const entries = coverageBacklog();
    const keys = new Set(
      entries.map((e) => e.officialSectionId ?? e.officialUnitId)
    );
    for (const c of OFFICIAL_CURRICULA) {
      if (c.status !== 'primary_source_verified') continue;
      for (const u of c.units) {
        const sections = sectionsForChapter(u.officialUnitId);
        if (sections.length === 0) {
          expect(keys.has(u.officialUnitId), u.title).toBe(true);
        } else {
          for (const s of sections) {
            expect(keys.has(s.officialSectionId), s.exactTitle).toBe(true);
          }
        }
      }
    }
  });

  it('covers all five verified grades and no unverified one', () => {
    const s = backlogSummary();
    expect(Object.keys(s.byGrade).sort()).toEqual([
      'Class 10', 'Class 11', 'Class 12', 'Class 6', 'Class 9',
    ]);
    expect(s.total).toBeGreaterThan(80);
  });

  it('marks every entry as needing review, because none is reviewed', () => {
    expect(backlogSummary().reviewNeed).toBe(backlogSummary().total);
  });

  it('grows automatically when a grade becomes verified', () => {
    // The backlog is DERIVED, so a newly verified grade cannot be
    // forgotten by nobody remembering to add its records.
    const before = coverageBacklog().length;
    expect(before).toBe(
      OFFICIAL_CURRICULA.filter((c) => c.status === 'primary_source_verified')
        .reduce((n, c) => {
          for (const u of c.units) {
            const secs = sectionsForChapter(u.officialUnitId);
            n += secs.length === 0 ? 1 : secs.length;
          }
          return n;
        }, 0)
    );
  });
});

// ---------------------------------------------------------------------------
// §13/§14/§15 — one canonical next action
// ---------------------------------------------------------------------------

describe('§15 one selector answers "what next"', () => {
  it('returns related legacy practice for Fractions, named as such', () => {
    const a = nextActionForChapter('ncert_gp_c6_ch07_fractions', []);
    expect(a.kind).toBe('related_legacy_practice');
    expect(a.qualifier).toMatch(/not a chapter lesson/i);
  });

  it('never labels legacy practice with an official section number', () => {
    // THE v0.71 DEFECT. Both the Fractions landing and Progress read
    // "7.2 Fractional Units as Parts of a Whole" while §7.2's own row
    // said Coming soon.
    const a = nextActionForChapter('ncert_gp_c6_ch07_fractions', []);
    expect(a.officialSectionId).toBeNull();
    expect(a.label).not.toMatch(/^7\.\d/);
    expect(mayUseOfficialSectionLabel(a)).toBe(false);
  });

  it('exposes no internal skill code', () => {
    const a = nextActionForChapter('ncert_gp_c6_ch07_fractions', []);
    expect(a.label).not.toMatch(/\b(FR|GB|DE|RP|AL)\.\d\d\b/);
  });

  it('returns none for a chapter with nothing to open', () => {
    const a = nextActionForChapter('ncert_gp_c6_ch02_lines_angles', []);
    expect(a.kind).toBe('none');
    expect(a.activityId).toBeNull();
    expect(a.verb).toBeNull();
  });

  it('offers no official learn action, because none is published', () => {
    for (const c of ['ncert_gp_c6_ch07_fractions', 'ncert_gp_c6_ch05_prime_time']) {
      expect(nextActionForChapter(c, []).kind).not.toBe('official_learn');
    }
  });
});

// ---------------------------------------------------------------------------
// §28 — nothing was published to make the numbers better
// ---------------------------------------------------------------------------

describe('§28 review state is untouched', () => {
  it('keeps all nine drafts unpublished and the fingerprint frozen', () => {
    const sections = fractionsChapterSections();
    expect(sections).toHaveLength(9);
    for (const s of sections) expect(s.reviewStatus).toBe('authored_draft');
    expect(computeContentFingerprint()).toBe('a1a3ff57');
  });
});
