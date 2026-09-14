// v0.79 §1-§4 — NUMBER PLAY §3.1, AUTHORED.
//
// The first content produced after the Student and Teacher products were
// locked. These tests hold the draft to the same standard the Fractions
// chapter is held to, and pin the two claims that matter most: that the
// section identity came from the verified registry rather than from
// memory, and that nothing has been promoted to a student.

import { describe, it, expect } from 'vitest';
import { SECTION_3_1, numberPlayChapterSections } from '../numberPlaySections';
import { NUMBER_PLAY_MISCONCEPTIONS } from '../numberPlayMisconceptions';
import { validateAuthoredSection } from '../sectionValidators';
import { sectionsForChapter } from '../officialSections';
import { officialChapterLearnState } from '../eligibilityPolicy';

const CH = 'ncert_gp_c6_ch03_number_play';

describe('§1 identity comes from the verified source, not from memory', () => {
  it('matches the registry section number, title and page exactly', () => {
    const registry = sectionsForChapter(CH).find(
      (s) => s.officialSectionId === 'ncert_gp_c6_s3_1'
    )!;
    expect(registry.verificationStatus).toBe('primary_source_verified');
    expect(SECTION_3_1.source.sectionNumber).toBe(registry.sectionNumber);
    expect(SECTION_3_1.source.exactTitle).toBe(registry.exactTitle);
    expect(SECTION_3_1.source.startPage).toBe(registry.startPage);
  });

  it('authors in the book’s order and claims no more than it has', () => {
    // §3.2 blocks on a grid representation that does not exist, so the
    // chapter must not quietly skip ahead to a section it can draw.
    const authored = numberPlayChapterSections().map(
      (s) => s.source.sectionNumber
    );
    expect(authored).toEqual(['3.1']);
  });
});

describe('§2 the draft passes the same validator as Fractions', () => {
  it('has no structural errors', () => {
    expect(validateAuthoredSection(SECTION_3_1)).toEqual([]);
  });

  it('references only misconceptions that exist', () => {
    const known = new Set(NUMBER_PLAY_MISCONCEPTIONS.map((m) => m.id as string));
    for (const id of SECTION_3_1.misconceptionIds) {
      expect(known.has(id), id).toBe(true);
    }
  });

  it('claims a diagnostic signal only where a response could show it', () => {
    for (const m of NUMBER_PLAY_MISCONCEPTIONS) {
      if (m.diagnosticSignal !== null) {
        expect(m.diagnosticSignal.length, m.id).toBeGreaterThan(20);
      }
    }
  });
});

describe('§3 sequencing respects the chapter', () => {
  it('refuses the representations that belong to later sections', () => {
    const blocked = SECTION_3_1.sequence.mustNotIntroduce.map(
      (x) => x.belongsToSection
    );
    expect(blocked).toContain('ncert_gp_c6_s3_2');
    expect(blocked).toContain('ncert_gp_c6_s3_3');
    expect(blocked).toContain('ncert_gp_c6_s3_4');
  });

  it('introduces no supercell, number line or digit-pattern content', () => {
    const prose = [
      ...SECTION_3_1.explanation,
      ...SECTION_3_1.workedExamples.flatMap((w) => [
        w.prompt,
        ...w.steps.map((s) => s.text),
      ]),
    ]
      .join(' ')
      .toLowerCase();
    expect(prose).not.toMatch(/supercell|number line|place value|digit sum/);
  });
});

describe('§4 nothing is published by authoring it', () => {
  it('stays an authored draft', () => {
    expect(SECTION_3_1.reviewStatus).toBe('authored_draft');
    expect(SECTION_3_1.competencyMappingStatus).toBe('competency_proposed');
  });

  it('does not make Number Play student-available', () => {
    // Writing a lesson is not reviewing one. The chapter must still read
    // as being prepared, not as ready to learn.
    expect(officialChapterLearnState(CH)).not.toBe('official_learn_available');
  });
});
