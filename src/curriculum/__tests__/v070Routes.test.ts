// v0.70 §32 — the release's own guarantees.
//
// Three families: that screenshot routes prove their identity, that the
// dead links are dead no longer, and that "Ready to learn" means what
// it says.

import { describe, it, expect } from 'vitest';
import {
  ROUTE_CONTRACTS,
  checkContract,
  type RouteContract,
} from '../../../tools/routeContracts.mjs';
import { openableSectionTarget, sectionIsOpenable } from '../sectionRouting';
import { class6ChapterCards, fractionsSectionCards } from '../studentChapterModel';
import { getStudentChapterAvailability, sectionEligibility } from '../eligibilityPolicy';
import { officialChapterRows } from '../../features/student/OfficialChapterLanding';
import { sectionsForChapter } from '../officialSections';
import { computeContentFingerprint } from '../contentArtifact';
import {
  generateRegistryPatch,
  validateManualSubmission,
  type ManualCurriculumSubmission,
} from '../manualCurriculumImport';

// ---------------------------------------------------------------------------
// §1 — screenshot route identity
// ---------------------------------------------------------------------------

describe('§1 every screenshot route declares a contract', () => {
  it('requires identifying text for every route', () => {
    const routes: RouteContract[] = Object.values(ROUTE_CONTRACTS);
    expect(routes.length).toBeGreaterThan(15);
    for (const c of routes) {
      expect(c.mustContain.length, c.id).toBeGreaterThan(0);
      for (const n of c.mustContain) expect(n.trim().length).toBeGreaterThan(2);
    }
  });

  it('fails a capture whose page lacks the required text', () => {
    const c = ROUTE_CONTRACTS.student_learn;
    expect(checkContract(c, 'Class 6 Fractions Patterns in Mathematics Symmetry')).toEqual([]);
    expect(checkContract(c, 'Hi Asha, let us start').length).toBeGreaterThan(0);
  });

  it('rejects a teacher capture taken in student mode', () => {
    // THE v0.69 DEFECT, as an executable claim.
    // `10-teacher-overview-390.png` was Student Home and read
    // "STUDENT MODE". Positive assertions alone would not catch it,
    // because that page does contain the word "Teacher" in its
    // "Switch to teacher mode" button — only the negative does.
    const failures = checkContract(
      ROUTE_CONTRACTS.teacher_overview,
      'Pragati STUDENT MODE Hi Asha Switch to teacher mode'
    );
    expect(failures.some((f: string) => /forbidden/.test(f))).toBe(true);
  });

  it('rejects a chapter page passing as the lesson', () => {
    // `20-lesson-7_1-390.png` was Student Home. A chapter page LISTING
    // a lesson title must not satisfy the lesson contract either, which
    // is why the contract demands a lesson-only marker.
    const chapterPage =
      'All chapters Chapter 7 Fractions 7.4 Marking Fraction Lengths on the Number Line Coming soon';
    expect(checkContract(ROUTE_CONTRACTS.student_lesson, chapterPage).length)
      .toBeGreaterThan(0);
  });

  it('matches case-insensitively, because CSS uppercases labels', () => {
    // `innerText` returns text as rendered. Eyebrow labels are
    // uppercased in CSS, so a case-sensitive contract would fail on a
    // correct page — a false failure that invites loosening the guard.
    // v0.71 — the Fractions contract gained two requirements (§8's
    // worded availability and §9's separate practice section), so the
    // sample text carries them too. The property under test is
    // case-insensitivity, not the contract's contents.
    expect(
      checkContract(
        ROUTE_CONTRACTS.student_fractions,
        // v0.72 — the Fractions contract gained "not a chapter lesson"
        // (§13), so the sample carries it too. The property under test
        // is case-insensitivity, not the contract's contents.
        'CHAPTER 7 FRACTIONS A PINCH OF HISTORY — 9 PARTS IN THIS CHAPTER · ' +
          'PRACTICE YOU CAN DO NOW · RELATED PRACTICE — NOT A CHAPTER LESSON'
      )
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §27 — the dead links
// ---------------------------------------------------------------------------

describe('§27 a tappable section goes somewhere', () => {
  it('routes every Fractions section that is offered', () => {
    // The defect: four sections rendered "Learn →" and routed nothing,
    // because the handler matched one hard-coded id that could never
    // fire, and the outlet rendering the chapter never received the
    // handler at all.
    for (const r of officialChapterRows('ncert_gp_c6_ch07_fractions', 'test-student')) {
      if (r.provenance === null) continue;
      expect(sectionIsOpenable(r.officialSectionId), r.sectionNumber).toBe(true);
      expect(openableSectionTarget(r.officialSectionId)).not.toBeNull();
    }
  });

  it('offers exactly the sections that route', () => {
    const rows = officialChapterRows('ncert_gp_c6_ch07_fractions', 'test-student');
    const offered = rows.filter((r) => r.provenance !== null);
    expect(offered).toHaveLength(4);
    expect(offered.map((r) => r.sectionNumber).sort()).toEqual(['7.2', '7.5', '7.6', '7.8']);
  });

  it('records provenance rather than implying the content is this section\'s lesson', () => {
    for (const id of ['ncert_gp_c6_s7_2', 'ncert_gp_c6_s7_5', 'ncert_gp_c6_s7_6', 'ncert_gp_c6_s7_8']) {
      const t = openableSectionTarget(id)!;
      expect(t.kind).toBe('legacy_skill_lesson');
      // NOT official_section_content. These lessons were authored
      // against the old book, keyed by internal skill codes, and never
      // verified against Ganita Prakash.
      expect(t.provenance).toBe('legacy_skill_content');
      expect(t.skillId).toMatch(/^FR\./);
    }
  });

  it('routes §7.4 nowhere, because it is unpublished', () => {
    // The irony worth keeping visible: the ONLY section with authored
    // official-section content is the one no student can open.
    expect(openableSectionTarget('ncert_gp_c6_s7_4')).toBeNull();
  });

  it('never offers a section with no route behind it', () => {
    for (const c of fractionsSectionCards()) {
      if (c.availability === 'not_available_yet') continue;
      expect(sectionIsOpenable(c.officialSectionId), c.sectionNumber).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// §27 — "Ready to learn" must be true
// ---------------------------------------------------------------------------

describe('§27 chapter availability rolls up from sections', () => {
  it('shows one ready chapter, not five', () => {
    // v0.69 showed five. Four of them routed NOTHING: the card said
    // "Ready to learn" and every section inside read "Coming soon".
    const ready = class6ChapterCards().filter((c) => c.availability === 'available');
    expect(ready).toHaveLength(1);
    expect(ready[0].officialChapterId).toBe('ncert_gp_c6_ch07_fractions');
  });

  it('marks a chapter learnable only when a section of it is', () => {
    for (const c of class6ChapterCards()) {
      const sections = sectionsForChapter(c.officialChapterId);
      if (sections.length === 0) continue;
      const anySection = sections.some(
        (s) => sectionEligibility(s.officialSectionId).hasEligibleLearn
      );
      expect(
        getStudentChapterAvailability(c.officialChapterId).hasEligibleLearn,
        c.title
      ).toBe(anySection);
    }
  });

  it('leaves every official chapter listed', () => {
    // The fix reduces what is OFFERED, never what is SHOWN.
    expect(class6ChapterCards()).toHaveLength(10);
  });

  it('gives each of the four previously-false chapters zero routed sections', () => {
    for (const id of [
      'ncert_gp_c6_ch02_lines_angles',
      'ncert_gp_c6_ch05_prime_time',
      'ncert_gp_c6_ch06_perimeter_area',
      'ncert_gp_c6_ch09_symmetry',
    ]) {
      const routed = sectionsForChapter(id).filter((s) =>
        sectionIsOpenable(s.officialSectionId)
      );
      expect(routed, id).toHaveLength(0);
      expect(getStudentChapterAvailability(id).hasEligibleLearn, id).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// §24 — the commit-ready patch
// ---------------------------------------------------------------------------

const SUB: ManualCurriculumSubmission = {
  grade: 'class7',
  officialBookTitle: 'Ganita Prakash, Grade 7',
  academicYear: '2026-27',
  edition: 'First Edition April 2025, Reprint 2026-27',
  source: 'printed copy, school library',
  verifier: 'A. Sharma',
  inspectionDate: '2026-08-29',
  chapters: [
    { number: 2, title: 'Arithmetic Expressions' },
    { number: 1, title: 'Large Numbers Around Us' },
  ],
};

describe('§24 manual verification produces a committable artefact', () => {
  it('generates a source file, not a localStorage write', () => {
    const patch = generateRegistryPatch(SUB)!;
    expect(patch.path).toBe('src/curriculum/verified/grade7.ts');
    expect(patch.contents).toContain('GRADE_7_CURRICULUM');
    expect(patch.contents).toContain('A. Sharma');
    expect(patch.contents).toContain('primary_source_verified');
  });

  it('is deterministic and sorts chapters, so two verifiers can be diffed', () => {
    expect(generateRegistryPatch(SUB)!.contents).toBe(
      generateRegistryPatch(SUB)!.contents
    );
    const body = generateRegistryPatch(SUB)!.contents;
    expect(body.indexOf('Large Numbers Around Us')).toBeLessThan(
      body.indexOf('Arithmetic Expressions')
    );
  });

  it('requires a second reader before the file may be merged', () => {
    expect(generateRegistryPatch(SUB)!.contents).toMatch(
      /second person must open the same book/i
    );
  });

  it('generates nothing from an invalid submission', () => {
    expect(generateRegistryPatch({ ...SUB, verifier: 'admin' })).toBeNull();
    expect(generateRegistryPatch({ ...SUB, chapters: [] })).toBeNull();
  });

  it('still refuses a numbering gap', () => {
    const bad = { ...SUB, chapters: [{ number: 1, title: 'A' }, { number: 3, title: 'C' }] };
    expect(validateManualSubmission(bad).some((i) => /jumps/.test(i.message))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// §20 — presentation did not touch semantics
// ---------------------------------------------------------------------------

describe('§20 the redesign changed no content', () => {
  it('leaves the §7.4 fingerprint unchanged', () => {
    expect(computeContentFingerprint()).toBe('a1a3ff57');
  });
});
