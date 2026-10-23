// v0.74 §1/§4 — WHAT INSTRUCTIONAL SHAPE IS APPROPRIATE, AND FOR WHOM.
//
// THE DEFECT THIS FILE EXISTS TO CLOSE
//
// v0.73's `targetSectionShape()` returned ONE shape — six explanation
// paragraphs, three worked examples, three guided items, five
// independent items, two visuals, two interactive items — and applied it
// to every backlog record. That shape is the MEDIAN OF NINE CLASS 6
// FRACTIONS SECTIONS. It was measured from Chapter 7 and then handed to
// the planner as if it were the specification for Pragati.
//
// It is not. A Class 11 Calculus unit, a Class 1 counting lesson and
// §7.4 "Marking Fraction Lengths on the Number Line" are not the same
// instructional grain and do not want the same shape. Planning all three
// against the Fractions median does not make the plan ambitious; it
// makes it wrong in a way that reads as precision.
//
// WHY THIS IS NOT SOLVED BY INVENTING FIVE SHAPES
//
// The obvious fix — write a target for each stage — would replace one
// unevidenced number with five. Pragati has audited exactly one body of
// content: Chapter 7, Class 6, Middle Stage. That yields ONE observed
// standard, and it is honest only for the stage and grain it was
// measured at.
//
// So every other stage returns `production_standard_pending`. That is
// not a gap in this file. It is the true state of the evidence, and
// making it visible is the point: a stage with no audited standard must
// block authoring rather than silently inherit Chapter 7's.
//
// RELATIONSHIP TO ncfStages.ts
//
// `ncfStages.ts` models the NCF-SE COMPETENCY stages, which are a
// two-valued distinction (MIDDLE / SECONDARY) because that is how the
// framework numbers its curricular goals. This file models PRODUCTION
// bands, which are five-valued because authoring a Class 2 lesson and a
// Class 5 lesson are different jobs even though NCF gives neither a
// Mathematics goal block. The two are deliberately separate types; a
// test asserts they agree wherever both are defined.

import type { Grade } from '../types';
import { officialCurriculumForGrade } from './officialCurriculum';
import { fractionsChapterSections } from './fractionsChapter';
import { COMPLETE_DRAFT_MINIMUM } from './instructionalCompleteness';

// ---------------------------------------------------------------------------
// The five production bands
// ---------------------------------------------------------------------------

export type ProductionStage =
  | 'PRIMARY_EARLY'
  | 'PRIMARY'
  | 'MIDDLE'
  | 'SECONDARY'
  | 'SENIOR_SECONDARY';

export const PRODUCTION_STAGE_FOR_GRADE: Record<Grade, ProductionStage> = {
  class1: 'PRIMARY_EARLY',
  class2: 'PRIMARY_EARLY',
  class3: 'PRIMARY',
  class4: 'PRIMARY',
  class5: 'PRIMARY',
  class6: 'MIDDLE',
  class7: 'MIDDLE',
  class8: 'MIDDLE',
  class9: 'SECONDARY',
  class10: 'SECONDARY',
  class11: 'SENIOR_SECONDARY',
  class12: 'SENIOR_SECONDARY',
};

export const PRODUCTION_STAGE_LABEL: Record<ProductionStage, string> = {
  PRIMARY_EARLY: 'Primary (early) · Classes 1–2',
  PRIMARY: 'Primary · Classes 3–5',
  MIDDLE: 'Middle · Classes 6–8',
  SECONDARY: 'Secondary · Classes 9–10',
  SENIOR_SECONDARY: 'Senior secondary · Classes 11–12',
};

export function productionStageForGrade(grade: Grade): ProductionStage {
  return PRODUCTION_STAGE_FOR_GRADE[grade];
}

/**
 * The registry's own NCF stage for this grade, where it has one.
 *
 * Exposed so a test can assert the two models agree rather than letting
 * them drift into two different answers for the same grade.
 */
export function registryStageForGrade(grade: Grade): string | null {
  return officialCurriculumForGrade(grade)?.stage ?? null;
}

export const REGISTRY_STAGE_TO_PRODUCTION_STAGE: Record<string, ProductionStage> = {
  foundational: 'PRIMARY_EARLY',
  preparatory: 'PRIMARY',
  middle: 'MIDDLE',
  secondary: 'SECONDARY',
  senior_secondary: 'SENIOR_SECONDARY',
};

// ---------------------------------------------------------------------------
// The observed shape — evidence, not doctrine
// ---------------------------------------------------------------------------

export type SectionShape = {
  explanationParagraphs: number;
  workedExamples: number;
  guidedPractice: number;
  independentPractice: number;
  reasoningTasks: number;
  semanticVisuals: number;
  interactivePractice: number;
  documentedMisconceptions: number;
};

/**
 * The measured shape of the nine authored Class 6 Fractions sections.
 *
 * §4 — THE NAME IS THE POINT. v0.73 called this `auditedChapterShape`
 * and its consumer `targetSectionShape`, and the second name is what
 * leaked: a reader of the planner saw "target" and reasonably concluded
 * it was Pragati's target. It is one observation, of one chapter, at one
 * stage, at one grain.
 *
 * Reported as the MEDIAN so a single long section cannot raise the bar
 * and §7.9 (deliberately light) cannot lower it. Derived from the live
 * sections, so it cannot drift from what Chapter 7 actually contains.
 */
export function observedMiddleStageFractionsShape(): SectionShape {
  const rows = fractionsChapterSections();
  const median = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  return {
    explanationParagraphs: median(rows.map((r) => r.explanation.length)),
    workedExamples: median(rows.map((r) => r.workedExamples.length)),
    guidedPractice: median(rows.map((r) => r.guidedPractice.length)),
    independentPractice: median(rows.map((r) => r.independentPractice.length)),
    reasoningTasks: median(rows.map((r) => r.reasoningApplication.length)),
    semanticVisuals: median(rows.map((r) => r.visuals.length)),
    interactivePractice: median(rows.map((r) => r.interactivePractice.length)),
    documentedMisconceptions: 1,
  };
}

// ---------------------------------------------------------------------------
// The standard, resolved per stage
// ---------------------------------------------------------------------------

export type AuthoringStandard =
  | {
      kind: 'audited_standard';
      stage: ProductionStage;
      /** The grain this standard was measured at. Applying it above or
       *  below that grain is the v0.73 defect. */
      grain: 'official_section';
      shape: SectionShape;
      evidence: string;
    }
  | {
      kind: 'production_standard_pending';
      stage: ProductionStage;
      /** What a person must do before this stage can be planned. */
      requires: string;
    };

/**
 * The instructional standard for a stage.
 *
 * MIDDLE returns the Fractions observation, raised to the completeness
 * gate's floor so a plan never targets less than `assessSection` will
 * demand. Every other stage returns pending — and that is the honest
 * answer, not a placeholder to be filled in with a guess.
 */
export function authoringStandardForStage(
  stage: ProductionStage
): AuthoringStandard {
  if (stage !== 'MIDDLE') {
    return {
      kind: 'production_standard_pending',
      stage,
      requires:
        `No audited ${PRODUCTION_STAGE_LABEL[stage]} content exists. ` +
        `A standard requires authoring and auditing at least one unit at this stage, ` +
        `not copying the Class 6 Fractions shape.`,
    };
  }

  const observed = observedMiddleStageFractionsShape();
  return {
    kind: 'audited_standard',
    stage: 'MIDDLE',
    grain: 'official_section',
    evidence:
      'Median of the nine authored Class 6 Ganita Prakash Chapter 7 sections, ' +
      'raised to COMPLETE_DRAFT_MINIMUM where that floor is higher. ' +
      'Three hand audits and a pedagogy audit; NOT educator-reviewed.',
    shape: {
      explanationParagraphs: Math.max(
        observed.explanationParagraphs,
        COMPLETE_DRAFT_MINIMUM.explanationParagraphs
      ),
      workedExamples: Math.max(
        observed.workedExamples,
        COMPLETE_DRAFT_MINIMUM.workedExamples
      ),
      guidedPractice: Math.max(
        observed.guidedPractice,
        COMPLETE_DRAFT_MINIMUM.guidedPractice
      ),
      independentPractice: Math.max(
        observed.independentPractice,
        COMPLETE_DRAFT_MINIMUM.independentPractice
      ),
      reasoningTasks: Math.max(
        observed.reasoningTasks,
        COMPLETE_DRAFT_MINIMUM.reasoningTasks
      ),
      semanticVisuals: Math.max(
        observed.semanticVisuals,
        COMPLETE_DRAFT_MINIMUM.semanticVisuals
      ),
      interactivePractice: Math.max(observed.interactivePractice, 1),
      documentedMisconceptions: 1,
    },
  };
}

export function authoringStandardForGrade(grade: Grade): AuthoringStandard {
  return authoringStandardForStage(productionStageForGrade(grade));
}

/** Stages with an audited standard. Currently exactly one. */
export function stagesWithAuditedStandard(): ProductionStage[] {
  return (Object.keys(PRODUCTION_STAGE_LABEL) as ProductionStage[]).filter(
    (s) => authoringStandardForStage(s).kind === 'audited_standard'
  );
}
