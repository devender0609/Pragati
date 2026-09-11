// v0.61 §21 (completion) — guards for the stage correction, the
// section model, the visual system, and the demonstration section.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  MIDDLE_STAGE_MATHEMATICS_GOALS,
  MIDDLE_STAGE_SOURCE,
  STAGE_FOR_GRADE,
  competencyValidForGrade,
  isStagedCompetencyId,
  stageOf,
  middleStageCompetency,
} from '../ncfStages';
import {
  CLASS6_OFFICIAL_SECTIONS,
  sectionCoverageForChapter,
  sectionsForChapter,
} from '../officialSections';
import {
  validateNumberLine,
  validateFractionStrip,
  validateVisual,
  positionOnLine,
  fractionsEqual,
  simplify,
  stripValue,
  type FractionStripSpec,
} from '../visualSpecification';
import {
  DEMO_SECTION_SOURCE,
  DEMO_SECTION_STUDENT,
  DEMO_SECTION_TEACHER,
  DEMO_SECTION_VISUALS,
  demonstrationSectionStatus,
  V1_UNIT_INTERVAL_FOURTHS,
  V2_EQUIVALENCE,
  V3_BEYOND_ONE,
  V4_STRIPS,
} from '../demonstrationSection';
import {
  isStudentLearningReady,
  isCompleteUnit,
  blockingStudentRelease,
  emptyUnitStatus,
} from '../contentStatus';
import { FRAMEWORK_DECISIONS } from '../frameworkFreezeCandidate';
import { buildContentMapping, STATIC_MAPPING } from '../contentMapping';
import { OFFICIAL_CHAPTERS } from '../officialChapters';

// ---------------------------------------------------------------------------
// §21 — Middle Stage references cannot silently use Secondary Stage IDs
// ---------------------------------------------------------------------------

describe('§21 stage-qualified competency IDs', () => {
  it('transcribes exactly ten Middle Stage goals', () => {
    expect(MIDDLE_STAGE_MATHEMATICS_GOALS).toHaveLength(10);
    expect(MIDDLE_STAGE_SOURCE.goalCount).toBe(10);
    // The count that caused the error.
    expect(MIDDLE_STAGE_SOURCE.secondaryStageGoalCount).toBe(11);
  });

  it('assigns Classes 6-8 to Middle and 9-12 to Secondary', () => {
    for (const g of ['class6', 'class7', 'class8'] as const) {
      expect(STAGE_FOR_GRADE[g]).toBe('MIDDLE');
    }
    for (const g of ['class9', 'class10', 'class11', 'class12'] as const) {
      expect(STAGE_FOR_GRADE[g]).toBe('SECONDARY');
    }
  });

  it('rejects a Secondary competency cited for a Class 6 unit', () => {
    // The exact v0.52 error. The ID is well-formed and resolves to a
    // real goal — it is simply the wrong stage's goal.
    expect(competencyValidForGrade('SECONDARY:C-6.1', 'class6')).toBe(false);
    expect(competencyValidForGrade('MIDDLE:C-1.4', 'class6')).toBe(true);
    expect(competencyValidForGrade('MIDDLE:C-1.4', 'class10')).toBe(false);
  });

  it('refuses an unqualified competency ID', () => {
    expect(isStagedCompetencyId('C-1.4')).toBe(false);
    expect(isStagedCompetencyId('CG-6')).toBe(false);
    expect(isStagedCompetencyId('MIDDLE:C-1.4')).toBe(true);
    expect(stageOf('MIDDLE:C-1.4')).toBe('MIDDLE');
  });

  it('distinguishes CG-6 between the two stages', () => {
    // Middle CG-6 is mathematical reasoning. Secondary CG-6 is data and
    // probability. A bare 'CG-6' is not a citation.
    const middleCg6 = MIDDLE_STAGE_MATHEMATICS_GOALS.find(
      (g) => g.goalId === 'MIDDLE:CG-6'
    );
    expect(middleCg6?.title).toMatch(/mathematical thinking/i);
    expect(middleCg6?.title).not.toMatch(/probability/i);
  });

  it('has no probability competency at Middle Stage', () => {
    const all = MIDDLE_STAGE_MATHEMATICS_GOALS.flatMap((g) => [
      g.title,
      ...g.competencies.map((c) => c.text),
    ]).join(' ');
    expect(all).not.toMatch(/probability/i);
  });

  it('names the number line as an explicit Middle competency', () => {
    const c = middleStageCompetency('MIDDLE:C-1.4');
    expect(c?.text).toMatch(/number line/i);
  });

  it('marks every prior framework decision for stage review', () => {
    // Decisions were MARKED, not rewritten.
    for (const d of FRAMEWORK_DECISIONS) {
      expect(d.stageReview).toBe('requires_stage_review');
      expect(d.stageReviewNote).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// §21 — section mapping is independent of chapter mapping
// ---------------------------------------------------------------------------

describe('§21 official sections are recorded independently', () => {
  it('records every Class 6 section as primary-verified', () => {
    expect(CLASS6_OFFICIAL_SECTIONS.length).toBeGreaterThan(50);
    for (const s of CLASS6_OFFICIAL_SECTIONS) {
      expect(s.verificationStatus).toBe('primary_source_verified');
    }
  });

  it('keeps competency mapping pending independently of chapter verification', () => {
    // A section can be verified (A) with no competency decided (C).
    const pending = CLASS6_OFFICIAL_SECTIONS.filter(
      (s) => s.competencyMappingStatus === 'competency_mapping_pending'
    );
    expect(pending.length).toBeGreaterThan(40);
    for (const s of pending) {
      expect(s.verificationStatus).toBe('primary_source_verified');
      expect(s.mappedCompetencyIds).toEqual([]);
    }
  });

  it('has no educator-reviewed mapping anywhere', () => {
    // D is independent, and nobody has done it.
    for (const s of CLASS6_OFFICIAL_SECTIONS) {
      expect(s.mappingReviewStatus).not.toBe('educator_reviewed');
    }
  });

  it('reports Fractions as 9 sections with 5 having Pragati content', () => {
    const cov = sectionCoverageForChapter('ncert_gp_c6_ch07_fractions');
    expect(cov.officialSections).toBe(9);
    const withContent =
      cov.mappedSections + cov.partiallyMappedSections;
    expect(withContent).toBe(5);
    expect(cov.unmappedSections).toBe(4);
    // The finding that chapter-level mapping concealed.
    expect(cov.educatorReviewedMappings).toBe(0);
  });

  it('exposes counts, never a completeness percentage', () => {
    const cov = sectionCoverageForChapter('ncert_gp_c6_ch07_fractions');
    // Mapping coverage is not instructional completeness. If a
    // `percent` field ever appears here, this fails.
    expect(Object.keys(cov)).not.toContain('percent');
    expect(Object.keys(cov)).not.toContain('completenessPercent');
  });

  it('records section 7.4 as uncovered despite a named competency', () => {
    const s = sectionsForChapter('ncert_gp_c6_ch07_fractions').find(
      (r) => r.sectionNumber === '7.4'
    );
    expect(s?.exactTitle).toBe('Marking Fraction Lengths on the Number Line');
    expect(s?.pragatiSkillIds).toEqual([]);
    expect(s?.mappedCompetencyIds).toContain('MIDDLE:C-1.4');
  });

  it('populates sections for Class 6 only', () => {
    // No other grade has a primary source, so no other grade has
    // sections. Recording them would invent structure.
    const chapterIds = new Set(
      CLASS6_OFFICIAL_SECTIONS.map((s) => s.officialChapterId)
    );
    for (const id of chapterIds) {
      const chapter = OFFICIAL_CHAPTERS.find(
        (c) => c.officialChapterId === id
      );
      expect(chapter?.grade).toBe('class6');
    }
  });
});

// ---------------------------------------------------------------------------
// §21 — a mapped section does not imply complete content
// ---------------------------------------------------------------------------

describe('§21 mapping does not imply instructional completeness', () => {
  it('treats an exactly-mapped section as having no content status', () => {
    const s = sectionsForChapter('ncert_gp_c6_ch07_fractions').find(
      (r) => r.sectionNumber === '7.6'
    );
    expect(s?.mappingType).toBe('exact');
    // Mapping says Pragati has SOMETHING here. It says nothing about
    // whether that something is a complete learning unit.
    const status = emptyUnitStatus(s!.officialSectionId);
    expect(isStudentLearningReady(status)).toBe(false);
    expect(isCompleteUnit(status)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §21 — blueprint availability is not inferred from item count
// ---------------------------------------------------------------------------

describe('§21 blueprint availability reads the registry', () => {
  it('does not derive blueprintAvailable from item counts', () => {
    const src = readFileSync(join(__dirname, '..', 'contentMapping.ts'), 'utf8');
    const code = src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    // The v0.60 defect, in its exact form.
    expect(code).not.toMatch(/blueprintAvailable\s*=\s*assessmentItemCount/);
    expect(code).toMatch(/blueprintForChapter\(/);
  });

  it('reports no blueprint for a chapter that has none, whatever its item count', () => {
    // Chapter 1 Patterns has no Pragati content and no blueprint.
    const ch1 = OFFICIAL_CHAPTERS.find(
      (c) => c.officialChapterId === 'ncert_gp_c6_ch01_patterns'
    );
    if (ch1) {
      const row = STATIC_MAPPING.find(
        (r) => r.officialChapterId === ch1.officialChapterId
      );
      if (row) {
        const m = buildContentMapping(ch1, row);
        expect(m.blueprintAvailable).toBe(false);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// §21 — StudentLearningReady and CompleteUnit remain distinct
// ---------------------------------------------------------------------------

describe('§21 student-ready and complete are different states', () => {
  it('allows student release without teacher resources or a unit check', () => {
    const s = emptyUnitStatus('u');
    s.lesson = 'published';
    s.workedExamples = 'published';
    s.visuals = 'published';
    s.guidedPractice = 'published';
    s.independentPractice = 'published';

    expect(isStudentLearningReady(s)).toBe(true);
    // But it is NOT a complete unit.
    expect(isCompleteUnit(s)).toBe(false);
    expect(blockingStudentRelease(s)).toEqual([]);
  });

  it('never releases to students on a draft lesson', () => {
    const s = emptyUnitStatus('u');
    s.lesson = 'authored_draft';
    s.workedExamples = 'published';
    s.visuals = 'published';
    s.guidedPractice = 'published';
    s.independentPractice = 'published';

    expect(isStudentLearningReady(s)).toBe(false);
    expect(blockingStudentRelease(s)).toContain('lesson: authored_draft');
  });

  it('never releases to students on placeholder visuals', () => {
    const s = emptyUnitStatus('u');
    s.lesson = 'published';
    s.workedExamples = 'published';
    s.visuals = 'placeholder';
    s.guidedPractice = 'published';
    s.independentPractice = 'published';
    expect(isStudentLearningReady(s)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §21 — visuals encode mathematical semantics
// ---------------------------------------------------------------------------

describe('§21 visual specifications carry mathematics, not pictures', () => {
  it('stores exact fractions as the canonical representation', () => {
    expect(V1_UNIT_INTERVAL_FOURTHS.markedPoints[0].value).toEqual({
      numerator: 3,
      denominator: 4,
    });
  });

  it('computes position from the mathematics', () => {
    const pos = positionOnLine(
      { numerator: 3, denominator: 4 },
      { numerator: 0, denominator: 1 },
      { numerator: 1, denominator: 1 }
    );
    expect(pos).toBeCloseTo(0.75, 10);
  });

  it('places equivalent fractions at exactly the same position', () => {
    // The claim V2 makes visually must be true numerically.
    const min = { numerator: 0, denominator: 1 };
    const max = { numerator: 1, denominator: 1 };
    const half = positionOnLine({ numerator: 1, denominator: 2 }, min, max);
    const twoFourths = positionOnLine(
      { numerator: 2, denominator: 4 },
      min,
      max
    );
    expect(half).toBe(twoFourths);
    expect(
      fractionsEqual(
        { numerator: 1, denominator: 2 },
        { numerator: 2, denominator: 4 }
      )
    ).toBe(true);
    expect(simplify({ numerator: 2, denominator: 4 })).toEqual({
      numerator: 1,
      denominator: 2,
    });
  });

  it('rejects a point that lies off the line', () => {
    const errors = validateNumberLine({
      ...V1_UNIT_INTERVAL_FOURTHS,
      markedPoints: [{ value: { numerator: 5, denominator: 4 } }],
    });
    expect(errors.some((e) => /outside the line/.test(e))).toBe(true);
  });

  it('rejects a point that cannot land on a labelled tick', () => {
    // 1/3 on a fourths line: the student would see a mark floating
    // between divisions with nothing to read it against.
    const errors = validateNumberLine({
      ...V1_UNIT_INTERVAL_FOURTHS,
      markedPoints: [{ value: { numerator: 1, denominator: 3 } }],
    });
    expect(errors.some((e) => /does not fall on a tick/.test(e))).toBe(true);
  });

  it('requires alt text on every visual', () => {
    const errors = validateNumberLine({
      ...V1_UNIT_INTERVAL_FOURTHS,
      altText: '   ',
    });
    expect(errors.some((e) => /altText is required/.test(e))).toBe(true);
  });

  it('requires every visual to declare a mathematical purpose', () => {
    for (const v of DEMO_SECTION_VISUALS) {
      expect(v.purpose).toBeTruthy();
      expect(validateVisual(v)).toEqual([]);
    }
  });

  // -------------------------------------------------------------------
  // v0.61 §7 — fraction-strip equivalence semantics
  // -------------------------------------------------------------------

  it('computes each strip value as shaded over denominator', () => {
    expect(stripValue(V4_STRIPS.strips[0])).toEqual({
      numerator: 1,
      denominator: 2,
    });
    expect(stripValue(V4_STRIPS.strips[1])).toEqual({
      numerator: 2,
      denominator: 4,
    });
    expect(stripValue(V4_STRIPS.strips[2])).toEqual({
      numerator: 4,
      denominator: 8,
    });
  });

  it('proves the demonstration strips are genuinely equivalent', () => {
    expect(V4_STRIPS.assertsEquivalence).toBe(true);
    expect(validateFractionStrip(V4_STRIPS)).toEqual([]);
    const first = stripValue(V4_STRIPS.strips[0]);
    for (const row of V4_STRIPS.strips) {
      expect(fractionsEqual(first, stripValue(row))).toBe(true);
    }
  });

  it('FAILS the reading under which the previous V4 schema was ambiguous', () => {
    // The old shape was `rows: [1,2,4,8]` plus
    // `shaded: { 1:[0], 2:[0,1], 3:[0,1,2,3] }`, where the keys were
    // row INDICES. Read as DENOMINATORS instead — an equally natural
    // reading of a numeric key — the same data means 1/1, 2/2, 4/3.
    // Those are not equivalent, and the caption claimed they were.
    const misread: FractionStripSpec = {
      type: 'fraction_strip',
      purpose: 'show_equivalence',
      status: 'concept_specific',
      strips: [
        { denominator: 1, shadedCount: 1 },
        { denominator: 2, shadedCount: 2 },
        { denominator: 3, shadedCount: 4 },
      ],
      assertsEquivalence: true,
      caption: 'claims equivalence',
      altText: 'x',
    };
    const errors = validateFractionStrip(misread);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => /not equal to/.test(e))).toBe(true);
    // 4 of 3 parts is impossible as well.
    expect(errors.some((e) => /outside 0\.\.3/.test(e))).toBe(true);
  });

  it('rejects any strip diagram whose equivalence claim is false', () => {
    const wrong: FractionStripSpec = {
      ...V4_STRIPS,
      strips: [
        { denominator: 2, shadedCount: 1 },
        { denominator: 4, shadedCount: 3 },
      ],
    };
    expect(
      validateFractionStrip(wrong).some((e) => /not equal to/.test(e))
    ).toBe(true);
  });

  it('validates the beyond-one visual that exposes the misconception', () => {
    expect(validateVisual(V3_BEYOND_ONE)).toEqual([]);
    expect(V3_BEYOND_ONE.purpose).toBe('expose_misconception');
    expect(V2_EQUIVALENCE.purpose).toBe('show_equivalence');
  });
});

// ---------------------------------------------------------------------------
// §21 — the demonstration section stays authored_draft
// ---------------------------------------------------------------------------

describe('§21 the demonstration section is a draft, not a release', () => {
  it('is authored_draft and not published', () => {
    const s = demonstrationSectionStatus();
    expect(s.lesson).toBe('authored_draft');
    expect(s.lesson).not.toBe('published');
    expect(isStudentLearningReady(s)).toBe(false);
    expect(isCompleteUnit(s)).toBe(false);
  });

  it('cites the verified primary source', () => {
    expect(DEMO_SECTION_SOURCE.sectionNumber).toBe('7.4');
    expect(DEMO_SECTION_SOURCE.startPage).toBe(160);
    expect(DEMO_SECTION_SOURCE.evidenceProvenance).toBe(
      'primary_source_verified'
    );
  });

  it('cites Middle Stage competencies only', () => {
    for (const c of DEMO_SECTION_TEACHER.competencyMapping) {
      expect(stageOf(c.id)).toBe('MIDDLE');
      expect(competencyValidForGrade(c.id, 'class6')).toBe(true);
    }
    // Proposed, not asserted as reviewed.
    expect(DEMO_SECTION_TEACHER.competencyMappingStatus).toBe(
      'competency_proposed'
    );
  });

  it('meets the content standard in substance', () => {
    expect(DEMO_SECTION_STUDENT.workedExamples.length).toBeGreaterThanOrEqual(5);
    expect(DEMO_SECTION_STUDENT.misconceptions.length).toBeGreaterThanOrEqual(4);
    expect(DEMO_SECTION_STUDENT.representations.length).toBeGreaterThanOrEqual(2);
    expect(DEMO_SECTION_STUDENT.guidedPractice.length).toBeGreaterThan(0);
    expect(DEMO_SECTION_STUDENT.independentPractice.length).toBeGreaterThan(0);
    expect(DEMO_SECTION_STUDENT.reasoningApplication.length).toBeGreaterThan(0);
    expect(DEMO_SECTION_STUDENT.nextStep).toBeTruthy();
  });

  it('states WE4 as a coherent misconception with a consistent answer', () => {
    const we4 = DEMO_SECTION_STUDENT.workedExamples.find((w) => w.id === 'WE4');
    // The claim under test must be the FALSE one, so the example has
    // something to refute.
    expect(we4?.prompt).toMatch(/1\/4 is greater than 1\/3/);
    // And the answer must reject it.
    expect(we4?.answer).toMatch(/^No\./);
    expect(we4?.answer).toMatch(/1\/4 is less than 1\/3/);
    // The final step's conclusion must agree with the answer.
    const last = we4!.steps[we4!.steps.length - 1];
    expect(last.reasoning).toMatch(/not correct/i);
  });

  it('gives every worked example reasoning, not just steps', () => {
    for (const w of DEMO_SECTION_STUDENT.workedExamples) {
      for (const step of w.steps) {
        expect(step.reasoning.length).toBeGreaterThan(20);
      }
    }
  });

  it('gives every misconception student feedback and a teacher note', () => {
    for (const m of DEMO_SECTION_STUDENT.misconceptions) {
      expect(m.studentFeedback).toBeTruthy();
      expect(m.teacherNote).toBeTruthy();
      expect(m.whyItHappens).toBeTruthy();
    }
  });

  it('uses no governance vocabulary in student-facing text', () => {
    const studentText = JSON.stringify(DEMO_SECTION_STUDENT);
    for (const term of [
      'authored_draft',
      'competency_mapping_pending',
      'primary_source_verified',
      'MIDDLE:',
      'CG-',
    ]) {
      expect(studentText).not.toContain(term);
    }
  });
});
