// v0.71 §27 + curriculum requirement §G — the defects this release
// fixed, written down so they cannot come back.

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  checkOfficialCompleteness,
  completenessByGrade,
  expectedFor,
  EXPECTED_STRUCTURES,
} from '../officialCompleteness';
import {
  OFFICIAL_CURRICULA,
  officialCurriculumForGrade,
  officialChapterCount,
  officialUnitCount,
  type OfficialCurriculum,
} from '../officialCurriculum';
import { validateCurriculumRegistry } from '../validate';
import { relatedPracticeForChapter, legacyPracticeName, sectionIsOpenable } from '../sectionRouting';
import { officialChapterRows } from '../../features/student/OfficialChapterLanding';
import { class6ChapterCards } from '../studentChapterModel';
import { computeContentFingerprint } from '../contentArtifact';
import { fractionsChapterSections } from '../fractionsChapter';
import { StudentHome } from '../../components/StudentHome';

// ---------------------------------------------------------------------------
// Curriculum requirement §C/§G — completeness is a HARD gate
// ---------------------------------------------------------------------------

describe('curriculum completeness invariant', () => {
  it('passes for every primary-verified grade today', () => {
    expect(checkOfficialCompleteness()).toEqual([]);
    expect(
      validateCurriculumRegistry().filter((i) => i.severity === 'error')
    ).toEqual([]);
  });

  it('confirms ALL official records are represented for each verified grade', () => {
    for (const row of completenessByGrade()) {
      if (!row.verified) {
        // Unverified stays unknown — never silently "complete".
        expect(row.allOfficialRecordsRepresented, row.grade).toBeNull();
        expect(row.expectedUnits, row.grade).toBeNull();
        continue;
      }
      expect(row.allOfficialRecordsRepresented, row.grade).toBe(true);
      expect(row.registryUnits, row.grade).toBe(row.expectedUnits);
    }
  });

  it('FAILS when a single official record goes missing', () => {
    // The whole point. Every other test asserts what the registry
    // CONTAINS; only this asserts what the SOURCE REQUIRES, which is the
    // direction an accidental deletion breaks.
    const clone: OfficialCurriculum[] = OFFICIAL_CURRICULA.map((c) => ({
      ...c,
      units: [...c.units],
    }));
    const c6 = clone.find((c) => c.grade === 'class6')!;
    const removed = c6.units.pop()!;
    expect(removed.title).toBe('The Other Side of Zero');

    const failures = checkOfficialCompleteness(clone, EXPECTED_STRUCTURES);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.map((f) => f.code)).toContain('OFFICIAL_UNIT_MISSING');
    expect(failures.map((f) => f.code)).toContain('OFFICIAL_UNIT_COUNT_MISMATCH');
  });

  it('FAILS when official records are reordered', () => {
    const clone: OfficialCurriculum[] = OFFICIAL_CURRICULA.map((c) => ({
      ...c,
      units: [...c.units],
    }));
    const c6 = clone.find((c) => c.grade === 'class6')!;
    c6.units.reverse();
    expect(
      checkOfficialCompleteness(clone, EXPECTED_STRUCTURES).map((f) => f.code)
    ).toContain('OFFICIAL_UNIT_OUT_OF_ORDER');
  });

  it('keeps Class 6 at all ten verified Ganita Prakash chapters', () => {
    expect(officialUnitCount('class6')).toBe(10);
    expect(officialChapterCount('class6')).toBe(10);
    expect(expectedFor('class6')!.unitTitles).toHaveLength(10);
    // And the student surface shows every one, content or not.
    expect(class6ChapterCards()).toHaveLength(10);
  });

  it('keeps Class 9 at every verified official chapter', () => {
    expect(officialUnitCount('class9')).toBe(6);
    expect(officialChapterCount('class9')).toBe(15);
  });

  it('preserves the unit/chapter distinction for Classes 10-12', () => {
    for (const g of ['class10', 'class11', 'class12'] as const) {
      // Units are known; chapters are NOT, because no one has read those
      // textbooks. Null and a number are different claims.
      expect(officialUnitCount(g), g).not.toBeNull();
      expect(officialChapterCount(g), g).toBeNull();
      expect(expectedFor(g)!.chapters, g).toBeNull();
    }
  });

  it('records no expected structure for an unverified grade', () => {
    for (const g of ['class1', 'class3', 'class7', 'class8'] as const) {
      expect(expectedFor(g), g).toBeNull();
      expect(officialCurriculumForGrade(g)!.status).toBe(
        'official_structure_pending_verification'
      );
    }
  });

  it('demands an expected structure for any grade that becomes verified', () => {
    // Otherwise the invariant silently does not apply to a new grade,
    // which is how a guard stops guarding.
    const clone: OfficialCurriculum[] = OFFICIAL_CURRICULA.map((c) => ({ ...c }));
    const c7 = clone.find((c) => c.grade === 'class7')!;
    c7.status = 'primary_source_verified';
    expect(
      checkOfficialCompleteness(clone, EXPECTED_STRUCTURES).map((f) => f.code)
    ).toContain('VERIFIED_GRADE_HAS_NO_EXPECTED_STRUCTURE');
  });
});

// ---------------------------------------------------------------------------
// §2/§3/§4 — the first-run student screen
// ---------------------------------------------------------------------------

const homeProps = {
  onStart: () => {},
  onLearn: () => {},
  onTeacher: () => {},
  onStartAssignment: () => {},
  onBrowseAssessments: () => {},
};

describe('§2 zero history cannot produce a weakness claim', () => {
  it('never says a skill is weak', () => {
    const { container } = render(<StudentHome {...homeProps} />);
    // The v0.70 screen said "Practise a weak skill" and, with no
    // sessions at all, "No sessions yet, so we picked FR.02 as a
    // sensible starting point."
    expect(container.textContent).not.toMatch(/weak/i);
    expect(container.textContent).not.toMatch(/no sessions yet/i);
  });

  it('leads with learning, not an assessment', () => {
    const { container } = render(<StudentHome {...homeProps} />);
    const text = container.textContent ?? '';
    expect(text).toMatch(/Start learning|Keep learning/);
    // Assessment remains reachable; it no longer leads.
    expect(text).not.toMatch(/Start recommended assessment/);
    expect(text.indexOf('learning')).toBeLessThan(text.indexOf('questions'));
  });
});

describe('§3 no internal skill codes on a student screen', () => {
  const CODES = /\b(FR|GB|DE|RP|AL)\.\d\d\b|mixed_fractions/;

  it('shows none on first-run Home', () => {
    const { container } = render(<StudentHome {...homeProps} />);
    expect(container.textContent ?? '').not.toMatch(CODES);
  });

  it('gives legacy practice plain names instead', () => {
    expect(legacyPracticeName('FR.02')).toBe('Fractions as parts of a whole');
    for (const a of relatedPracticeForChapter(
      officialChapterRows('ncert_gp_c6_ch07_fractions', 'test')
    )) {
      expect(a.name).not.toMatch(CODES);
    }
  });
});

describe('§22 no governance jargon on a student screen', () => {
  it('drops prototype and calibration language', () => {
    const { container } = render(<StudentHome {...homeProps} />);
    const text = container.textContent ?? '';
    for (const word of [
      'prototype',
      'pre-pilot',
      'calibrated',
      'heuristic',
      'item bank',
      'growth indicator',
      'CBSE/NCERT-informed',
    ]) {
      expect(text.toLowerCase(), word).not.toContain(word.toLowerCase());
    }
  });
});

// ---------------------------------------------------------------------------
// §9 — official learning vs legacy related practice
// ---------------------------------------------------------------------------

describe('§9 the official journey means the official journey', () => {
  const rows = officialChapterRows('ncert_gp_c6_ch07_fractions', 'test');

  it('lists all nine official parts', () => {
    expect(rows).toHaveLength(9);
  });

  it('separates related practice into its own list', () => {
    const related = relatedPracticeForChapter(rows);
    expect(related.length).toBeGreaterThan(0);
    for (const a of related) {
      // Every entry is legacy content, presented as practice — never as
      // this section's lesson.
      expect(sectionIsOpenable(a.officialSectionId)).toBe(true);
      expect(a.name).toBeTruthy();
    }
  });

  it('collapses the three §7.8 skills into one activity', () => {
    const names = relatedPracticeForChapter(rows).map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('keeps all nine authored drafts, unpublished', () => {
    // §10 — the drafts exist. Student language stays "Coming soon";
    // that is a statement about publication, not about their absence.
    const sections = fractionsChapterSections();
    expect(sections).toHaveLength(9);
    for (const s of sections) {
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });
});

// ---------------------------------------------------------------------------
// §21 — presentation did not touch mathematics
// ---------------------------------------------------------------------------

describe('§21 content semantics survived the redesign', () => {
  it('leaves the §7.4 fingerprint unchanged', () => {
    expect(computeContentFingerprint()).toBe('a1a3ff57');
  });

  it('leaves Class 6 availability truthful', () => {
    // §23 — v0.70's correction must not be undone to make the app look
    // fuller.
    expect(
      class6ChapterCards().filter((c) => c.availability === 'available')
    ).toHaveLength(1);
  });
});
