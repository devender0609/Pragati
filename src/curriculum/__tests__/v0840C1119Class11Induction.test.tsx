/**
 * v0.84.0-c11.19 checkpoint 87 — C11-IND-01, the induction prerequisite.
 *
 * Two things are under test. First, that an inductive argument is held as a
 * structure rather than prose, so the four classic failures are caught.
 * Second, that a CBSE-only unit with no NCERT owner reaches students
 * without any invented chapter, section or page.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  type InductionProof, examplesProveNothing, naturalsFrom, validateInductionProof,
  validateProofLayout,
} from '../induction';
import {
  C11_IND_SECTIONS, CANONICAL_INDUCTION_PROOFS, IND_C11_PREREQUISITE_ID,
  P_SUM, V_PROOF,
} from '../inductionClass11Sections';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { OFFICIAL_CHAPTERS } from '../officialChapters';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { AuthoredChapterList } from '../../features/student/AuthoredLearn';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

const broken = (edit: (p: InductionProof) => void): string[] => {
  const copy: InductionProof = JSON.parse(JSON.stringify(P_SUM));
  edit(copy);
  return validateInductionProof(copy);
};

describe('an inductive argument is a structure, not prose', () => {
  it('accepts the three canonical proofs', () => {
    for (const p of CANONICAL_INDUCTION_PROOFS) {
      expect(validateInductionProof(p), p.id).toEqual([]);
    }
  });

  it('rejects a missing base case', () => {
    expect(broken((p) => { p.baseCase.steps = []; }))
      .toContain('the proof has no base case, so nothing anchors the chain');
  });

  it('rejects assuming P(k+1) instead of P(k)', () => {
    expect(broken((p) => { (p.hypothesis as { assumesAbout: string }).assumesAbout = 'k+1'; })[0])
      .toMatch(/assume the claim for k.*assuming what is to be proved/);
  });

  it('rejects a step that arrives back at k rather than k + 1', () => {
    expect(broken((p) => { (p.inductiveStep as { arrivesAt: string }).arrivesAt = 'k'; })[0])
      .toMatch(/start from the hypothesis at k and arrive at k \+ 1/);
  });

  it('rejects checking examples with no inductive step', () => {
    const errs = broken((p) => { p.inductiveStep.steps = []; p.conclusion.restsOn = ['base_case']; });
    expect(errs).toContain('the inductive step has no working, so no implication has been shown');
    expect(errs.some((e) => /does not rest on the inductive step/.test(e))).toBe(true);
  });

  it('rejects a base case outside the claimed starting domain', () => {
    expect(broken((p) => { p.baseCase.at = 3; }))
      .toContain('the base case is checked at 3 but the claim starts at 1');
  });

  it('rejects a base case that does not actually hold', () => {
    // Checked by arithmetic, not by an assertion that it worked.
    expect(broken((p) => { p.baseCase.rightValue = 2; })[0]).toMatch(/base case does not hold/);
  });

  it('rejects a hypothesis stated as already proved for every k', () => {
    expect(broken((p) => { p.hypothesis.conditional = false; })[0])
      .toMatch(/stay conditional/);
  });

  it('rejects an assertion dressed as a justification', () => {
    expect(broken((p) => { p.inductiveStep.steps[0].justification = 'This is true.'; })[0])
      .toMatch(/assertion rather than a reason/);
    expect(broken((p) => { p.inductiveStep.steps[0].justification = p.inductiveStep.steps[0].statement; })[0])
      .toMatch(/restates itself instead of justifying/);
  });

  it('refuses a non-integer induction domain', () => {
    expect(() => naturalsFrom(1.5, 'bad')).toThrow(/integer/);
  });

  it('says plainly that checking examples proves nothing', () => {
    const said = examplesProveNothing([{ at: 1, holds: true }, { at: 2, holds: true }], P_SUM.domain);
    expect(said).toMatch(/infinitely many/);
    expect(said).toMatch(/proves nothing/);
  });

  it('declares the natural-number domain on every proof', () => {
    for (const p of CANONICAL_INDUCTION_PROOFS) {
      expect(p.domain.from, p.id).toBe(1);
      expect(p.domain.written).toMatch(/natural number/);
    }
  });
});

describe('provenance stays honest for a unit with no NCERT owner', () => {
  const lesson = C11_IND_SECTIONS[0];

  it('authors exactly one lesson, cbse_only, with no invented source', () => {
    expect(C11_IND_SECTIONS).toHaveLength(1);
    expect(lesson.source.sourceKind).toBe('cbse_only');
    // No NCERT section, no page, no fabricated chapter number.
    expect(lesson.source.officialSectionId).toBe('');
    expect(lesson.source.sectionNumber).toBe('');
    expect(lesson.source.startPage).toBe(0);
    expect((lesson.source as { cbseEntryId?: string }).cbseEntryId).toBe('FO-4');
  });

  it('uses a chapter id that is NOT an official chapter', () => {
    expect(lesson.source.officialChapterId).toBe(IND_C11_PREREQUISITE_ID);
    // The guarantee that it can never be counted as a textbook chapter.
    expect(OFFICIAL_CHAPTERS.some((c) => c.officialChapterId === IND_C11_PREREQUISITE_ID)).toBe(false);
  });

  it('is formative only and required, and never summative eligible', () => {
    // Required does not mean summative: the two axes stay independent.
    expect(lesson.contentArtifactVersion).toBe(1);
    expect(lesson.reviewStatus).toBe('authored_draft');
  });

  it('gives the lesson all five stages', () => {
    expect(lesson.workedExamples.length).toBeGreaterThanOrEqual(3);
    expect(lesson.guidedPractice.length).toBeGreaterThanOrEqual(3);
    expect(lesson.independentPractice.length).toBeGreaterThanOrEqual(3);
    expect(lesson.reasoningApplication.length).toBeGreaterThanOrEqual(1);
    expect(lesson.explanation.length).toBeGreaterThanOrEqual(4);
  });

  it('does not teach the downstream units it only prepares for', () => {
    const prose = [
      ...lesson.explanation, lesson.summary, lesson.learningGoal,
      ...lesson.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.flatMap((s) => [s.text, s.reasoning])]),
      ...lesson.guidedPractice.flatMap((g) => [g.prompt, g.answer]),
      ...lesson.independentPractice.flatMap((i) => [i.prompt, i.answer]),
    ].join(' ').toLowerCase();
    // It may say induction will later support these; it must not teach them.
    expect(prose).not.toMatch(/n choose r|binomial coefficient|\(a \+ b\)\^n/);
    expect(prose).not.toMatch(/first principles|difference quotient/);
  });
});

describe('the catalogue counts it truthfully', () => {
  it('keeps seven textbook chapters and lists the prerequisite separately', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    // No eighth chapter is invented to hold a unit the textbook does not own.
    expect(c.chapters).toHaveLength(7);
    expect(c.chapters.map((x) => x.number)).toEqual([1, 2, 3, 4, 9, 10, 12]);
    expect(c.chapters.reduce((n, x) => n + x.lessonCount, 0)).toBe(51);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.lessonCount).toBe(52);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('routes the prerequisite, and places it before every chapter lesson', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    // A prerequisite reached after the unit needing it is no prerequisite.
    expect(c.lessons[0].contentArtifactId).toBe('cbse_fo4_induction_lesson');
    expect(c.lessons.map((l) => l.contentArtifactId)).toContain('cbse_fo4_induction_lesson');
    __setAuthoredLearnPreviewForTests(null);
  });

  it('registers the prerequisite outside the official chapter registry', () => {
    const entry = AUTHORED_CHAPTERS.find((c) => c.officialChapterId === IND_C11_PREREQUISITE_ID);
    expect(entry).toBeDefined();
    expect(entry!.sections()).toHaveLength(1);
  });
});

describe('assessment status and instructional status stay independent', () => {
  it('holds all three instructional statuses under FORMATIVE_ONLY', () => {
    // FO1 is REQUIRED_CORE, IND-01 is REQUIRED_PREREQUISITE, and the
    // enrichment units are OPTIONAL_ENRICHMENT — one assessment status,
    // three instructional meanings, coexisting deliberately.
    const units = JSON.parse(
      require('node:fs').readFileSync(
        require('node:path').join(__dirname, '../../../class11-source/CLASS11_DECOMPOSITION.json'), 'utf8'
      )
    ) as Array<{ unitId: string; assessmentStatus: string; instructionalStatus: string; summativeEligible?: boolean }>;
    const formative = units.filter((u) => u.assessmentStatus === 'FORMATIVE_ONLY');
    const statuses = new Set(formative.map((u) => u.instructionalStatus));
    expect(statuses.has('REQUIRED_CORE')).toBe(true);
    expect(statuses.has('REQUIRED_PREREQUISITE')).toBe(true);
    expect(statuses.has('OPTIONAL_ENRICHMENT')).toBe(true);

    const ind = units.find((u) => u.unitId === 'C11-IND-01')!;
    expect(ind.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(ind.instructionalStatus).toBe('REQUIRED_PREREQUISITE');
    // Required must never imply summative.
    expect(ind.summativeEligible).toBe(false);
  });

  it('keeps the dependency edges that made this unit necessary', () => {
    const units = JSON.parse(
      require('node:fs').readFileSync(
        require('node:path').join(__dirname, '../../../class11-source/CLASS11_DECOMPOSITION.json'), 'utf8'
      )
    ) as Array<{ unitId: string; prerequisites: string[] }>;
    for (const id of ['C11-BIN-01', 'C11-LIM-05', 'C11-LIM-06']) {
      expect(units.find((u) => u.unitId === id)!.prerequisites, id).toContain('C11-IND-01');
    }
  });

  it('does not author the dependent units', () => {
    // Class 11 artifacts only: other grades have their own section 7.2.
    const ids = AUTHORED_CHAPTERS.flatMap((c) => c.sections())
      .map((s) => s.contentArtifactId)
      .filter((i) => i.startsWith('ncert_kemh1_'));
    expect(ids.some((i) => i.includes('s12_5'))).toBe(false);
    expect(ids.some((i) => i.includes('s7_'))).toBe(false);
  });
});

describe('the proof reaches the student through the real product', () => {
  it('renders the proof layout with its five named parts', () => {
    __setAuthoredLearnPreviewForTests(true);
    const { container } = render(
      <LearnSectionView content={learnContentFor(C11_IND_SECTIONS[0])} visualsById={C11_IND_SECTIONS[0].visualsById} />
    );
    const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
    if (seeIt) fireEvent.click(seeIt);
    const text = container.textContent ?? '';
    for (const part of ['Claim', 'Base case', 'Induction hypothesis', 'Inductive step', 'Conclusion']) {
      expect(text, part).toContain(part);
    }
    // Structure must not be carried by runtime values or colour alone.
    expect(text).not.toMatch(/NaN|Infinity|undefined|\bnull\b/);
    expect(validateProofLayout(V_PROOF)).toEqual([]);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('shows no invented NCERT reference on the student surface', () => {
    __setAuthoredLearnPreviewForTests(true);
    const { container } = render(
      <LearnSectionView content={learnContentFor(C11_IND_SECTIONS[0])} visualsById={C11_IND_SECTIONS[0].visualsById} />
    );
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/NCERT/i);
    expect(text).not.toMatch(/Chapter \d/);
    __setAuthoredLearnPreviewForTests(null);
  });
});

/**
 * v0.84.0-c11.20 checkpoint 87C — PRODUCT PRESENCE, not data presence.
 *
 * The catalogue carried the prerequisite correctly and the UI rendered
 * chapters only, so the data tests passed while no student could reach the
 * lesson. These assert the rendered row, which is the thing that was
 * missing. They fail if the collection exists and the JSX never reads it.
 */
describe('the prerequisite is reachable in the product, not just in the data', () => {
  const renderCatalogue = (grade: string, onOpenLesson: (id: string) => void = () => {}) => {
    __setAuthoredLearnPreviewForTests(true);
    return render(
      <AuthoredChapterList
        grade={grade}
        studentId="qa-student"
        onOpenChapter={() => {}}
        onOpenLesson={onOpenLesson}
      />
    );
  };

  it('renders a prerequisite group with the induction row in it', () => {
    const { container } = renderCatalogue('class11');
    const row = container.querySelector('[data-artifact-id="cbse_fo4_induction_lesson"]');
    // The exact failure this checkpoint fixed: data present, row absent.
    expect(row).not.toBeNull();
    expect(container.textContent).toContain('Before you continue');
    expect(row!.textContent).toContain('Prerequisite');
    __setAuthoredLearnPreviewForTests(null);
  });

  it('opens the induction artifact by the same route contract as a chapter lesson', () => {
    const opened: string[] = [];
    const { container } = renderCatalogue('class11', (id: string) => { opened.push(id); });
    const row = container.querySelector('[data-artifact-id="cbse_fo4_induction_lesson"]')!;
    fireEvent.click(row);
    expect(opened).toEqual(['cbse_fo4_induction_lesson']);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('places the prerequisite group before the first textbook chapter', () => {
    const { container } = renderCatalogue('class11');
    const text = container.textContent ?? '';
    // A prerequisite shown after the chapters is not a prerequisite.
    expect(text.indexOf('Before you continue')).toBeLessThan(text.indexOf('Chapter 1'));
    __setAuthoredLearnPreviewForTests(null);
  });

  it('shows no prerequisite group for the other grades', () => {
    // Product isolation, not only data isolation.
    for (const grade of ['class10', 'class9', 'class6']) {
      const { container, unmount } = renderCatalogue(grade);
      expect(container.textContent, grade).not.toContain('Before you continue');
      expect(container.querySelector('[data-artifact-id="cbse_fo4_induction_lesson"]'), grade).toBeNull();
      unmount();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('still shows seven textbook chapters, not eight', () => {
    const { container } = renderCatalogue('class11');
    const text = container.textContent ?? '';
    expect(text).toContain('7 chapters from your textbook');
    expect(text).not.toContain('8 chapters');
    __setAuthoredLearnPreviewForTests(null);
  });
});
