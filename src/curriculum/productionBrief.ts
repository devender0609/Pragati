// v0.74 §26 — A PRODUCTION STANDARD, NOT A GENERATOR.
//
// WHAT THIS IS
//
// For one planned section, the brief a human or Claude author works
// from: where the content comes from, what it must teach, what
// representation it needs, how practice and feedback should be shaped,
// and how it will be reviewed.
//
// WHAT THIS IS NOT
//
// It emits NO student-facing prose. No explanation, no item stems, no
// answers, no worked examples. `assertBriefContainsNoContent` is a
// standing test, in the same spirit as the planner's.
//
// The distinction matters because it is the whole reason v0.74 does not
// author. A generator that emits lesson text before an educator has
// approved one lesson would mass-produce an unapproved shape 56 times.
// A brief that says "this section needs a representation of X and
// practice of type Y" can be written, argued with and corrected by a
// reviewer BEFORE any of that happens.
//
// WHY IT IS STAGE- AND DOMAIN-AWARE
//
// A brief that said the same thing for every section would be the
// Fractions template with extra steps. The representation requirement
// for "Symmetry" is not the representation requirement for "Prime
// Time", and the brief has to say so or it adds nothing.

import type { Grade } from '../types';
import { authoredSectionById } from './fractionsChapter';
import { sectionsForChapter } from './officialSections';
import { officialCurriculumForGrade } from './officialCurriculum';
import {
  authoringStandardForGrade,
  PRODUCTION_STAGE_LABEL,
  productionStageForGrade,
  type AuthoringStandard,
} from './productionStage';
import { class6Roadmap, type MathDomain, type VisualSystemReadiness } from './class6Roadmap';

export type BriefRequirement = {
  heading: string;
  /** The specification. Never content. */
  requirement: string;
  /** Open questions a reviewer or author must settle. */
  openQuestions: string[];
};

export type ProductionBrief = {
  officialSectionId: string;
  sectionNumber: string;
  sectionTitle: string;
  officialChapterId: string;
  officialChapterTitle: string;
  grade: Grade;
  stageLabel: string;
  domain: MathDomain;
  visualSystem: VisualSystemReadiness;
  standard: AuthoringStandard;
  /** Sections earlier in the same chapter. Real dependency evidence. */
  precedingSections: string[];
  requirements: BriefRequirement[];
  /** True when the brief cannot responsibly be acted on yet. */
  blocked: boolean;
  blockers: string[];
};

const DOMAIN_REPRESENTATION: Record<MathDomain, string> = {
  number_and_operations:
    'A semantic quantity representation — number line, area model or grouping — chosen to carry the specific relationship this section teaches, not to decorate it.',
  number_theory_and_reasoning:
    'A representation is optional. Where the content IS an argument, a written chain of reasoning is not a poorer medium than a diagram, and a diagram that merely restates the claim adds nothing.',
  pattern_and_generalisation:
    'A growing-pattern representation showing at least three terms and the step between them. A static picture of one term cannot show generalisation.',
  geometry_measurement:
    'An accurate, labelled diagram with stated dimensions. Approximate or unlabelled figures teach the wrong thing in a measurement chapter.',
  geometry_construction:
    'A step-sequenced construction. A finished figure hides the procedure, which is the content.',
  geometry_transformation:
    'Before-and-after figures with the transformation made visible. Text description is close to the wrong medium here.',
  data_and_representation:
    'A real data representation — table, pictograph or bar graph — plus an accessible non-visual equivalent. Alt text alone does not make a chart accessible.',
};

const DOMAIN_PRACTICE: Record<MathDomain, string> = {
  number_and_operations:
    'Guided items with hints, then independent items with rationales. The audited Fractions pattern applies most directly here.',
  number_theory_and_reasoning:
    'Weight toward reasoning tasks — justify, find a counterexample, decide whether a claim always holds. Computation-only practice under-serves the content.',
  pattern_and_generalisation:
    'Practice must ask for the RULE, not only the next term. An item answerable by counting on does not assess generalisation.',
  geometry_measurement:
    'Practice on labelled figures, including at least one item where the figure is not to scale, so the student reads the labels rather than the picture.',
  geometry_construction:
    'OPEN. Correct practice is performing a construction, which the current item model cannot capture or mark. Do not substitute a multiple-choice question about a construction.',
  geometry_transformation:
    'Practice should require identifying or producing a transformation. Naming-only items assess vocabulary rather than the geometry.',
  data_and_representation:
    'Practice should include both reading a representation and constructing one. The current item model expresses only the first.',
};

function domainForChapter(officialChapterId: string): {
  domain: MathDomain;
  visualSystem: VisualSystemReadiness;
  blockers: string[];
} {
  const r = class6Roadmap().find((x) => x.officialChapterId === officialChapterId);
  return {
    domain: r?.domain ?? 'number_and_operations',
    visualSystem: r?.visualSystem ?? 'requires_new_components',
    blockers: r?.blockers ?? [],
  };
}

/**
 * The brief for one official section.
 *
 * Returns null for a record that cannot be briefed — an unverified
 * section, or a stage with no authoring standard. Refusing is the point.
 */
export function productionBriefFor(
  grade: Grade,
  officialSectionId: string
): ProductionBrief | null {
  const curriculum = officialCurriculumForGrade(grade);
  if (!curriculum || curriculum.status !== 'primary_source_verified') return null;

  const unit = curriculum.units.find((u) =>
    sectionsForChapter(u.officialUnitId).some(
      (s) => s.officialSectionId === officialSectionId
    )
  );
  if (!unit) return null;

  const siblings = sectionsForChapter(unit.officialUnitId);
  const me = siblings.find((s) => s.officialSectionId === officialSectionId);
  if (!me) return null;

  const idx = siblings.findIndex((s) => s.officialSectionId === officialSectionId);
  const standard = authoringStandardForGrade(grade);
  const { domain, visualSystem, blockers } = domainForChapter(unit.officialUnitId);

  const shapeLine =
    standard.kind === 'audited_standard'
      ? `${standard.shape.explanationParagraphs} explanation paragraphs, ` +
        `${standard.shape.workedExamples} worked examples, ` +
        `${standard.shape.guidedPractice} guided items, ` +
        `${standard.shape.independentPractice} independent items. ` +
        `A floor for completeness, not a target for quality.`
      : 'No audited standard exists for this stage. Establish one before authoring.';

  const requirements: BriefRequirement[] = [
    {
      heading: 'Source identity',
      requirement:
        `${curriculum.documentTitle ?? 'the prescribed textbook'}, chapter ${unit.number} "${unit.title}", ` +
        `section ${me.sectionNumber} "${me.exactTitle}". Every claim must be traceable to this section of the printed book.`,
      openQuestions: [],
    },
    {
      heading: 'Prerequisites',
      requirement:
        idx === 0
          ? 'First section of the chapter. Prerequisites come from earlier chapters and must be stated explicitly rather than assumed.'
          : `Assumes the ${idx} preceding section${idx === 1 ? '' : 's'} of this chapter. State which specific ideas are relied on.`,
      openQuestions:
        idx === 0
          ? ['Which earlier chapter establishes the assumed prior knowledge?']
          : [],
    },
    {
      heading: 'Learning objective',
      requirement:
        'One objective, stated as what the student can DO afterwards, mapped to a stage-qualified NCF competency ID. An objective that cannot be assessed by this section’s own practice is the wrong objective.',
      openQuestions: ['Which stage-qualified competency does this section serve?'],
    },
    {
      heading: 'Concept explanation',
      requirement: shapeLine,
      openQuestions: [],
    },
    {
      heading: 'Representation',
      requirement: DOMAIN_REPRESENTATION[domain],
      openQuestions:
        visualSystem === 'ready'
          ? []
          : [
              `Pragati cannot currently render what this domain needs (${visualSystem.replace(/_/g, ' ')}). What is the minimum component?`,
            ],
    },
    {
      heading: 'Worked examples',
      requirement:
        'Each worked example shows the reasoning at every step, not only the result. An example whose steps a student could not reproduce unaided is a demonstration, not a worked example.',
      openQuestions: [],
    },
    {
      heading: 'Practice design',
      requirement: DOMAIN_PRACTICE[domain],
      openQuestions: [],
    },
    {
      heading: 'Feedback design',
      requirement:
        'Every practice item carries a rationale. Where a wrong answer maps to a documented misconception, feedback names the reasoning error without telling the student they are bad at mathematics.',
      openQuestions: [
        'Does a documented mathematical misconception attach to this content, or is a neutral rationale correct here?',
      ],
    },
    {
      heading: 'Teacher resources',
      requirement:
        'Teaching notes and quick checks a teacher can use in class without reading the whole section first.',
      openQuestions: [],
    },
    {
      heading: 'Accessibility',
      requirement:
        'Every visual carries a caption and alt text that conveys the MATHEMATICS, not the picture. Where the visual is the item, a non-visual equivalent is required, not optional.',
      openQuestions: [],
    },
    {
      heading: 'Review path',
      requirement:
        'Authored draft → complete instructional draft → review package (frozen candidate, pinned build, question set) → educator review → adjudication → publication gate. Nothing reaches a student before the gate.',
      openQuestions: [
        'Does the §7.4 review outcome change this section’s shape before it is authored?',
      ],
    },
  ];

  return {
    officialSectionId,
    sectionNumber: me.sectionNumber,
    sectionTitle: me.exactTitle,
    officialChapterId: unit.officialUnitId,
    officialChapterTitle: unit.title,
    grade,
    stageLabel: PRODUCTION_STAGE_LABEL[productionStageForGrade(grade)],
    domain,
    visualSystem,
    standard,
    precedingSections: siblings.slice(0, idx).map((s) => s.sectionNumber),
    requirements,
    blocked:
      blockers.length > 0 || standard.kind === 'production_standard_pending',
    blockers:
      standard.kind === 'production_standard_pending'
        ? [...blockers, standard.requires]
        : blockers,
  };
}

/** Briefs for every un-authored section of a Class 6 chapter. */
export function briefsForChapter(officialChapterId: string): ProductionBrief[] {
  return sectionsForChapter(officialChapterId)
    .filter((s) => !authoredSectionById(s.officialSectionId))
    .map((s) => productionBriefFor('class6', s.officialSectionId))
    .filter((b): b is ProductionBrief => b !== null);
}

/**
 * §26 — the standing guarantee.
 *
 * A brief specifies; it never authors. Anything that reads as material
 * a student could be shown is a violation.
 */
export function assertBriefContainsNoContent(
  briefs: ProductionBrief[]
): string[] {
  const violations: string[] = [];
  for (const b of briefs) {
    for (const r of b.requirements) {
      // A requirement may contain prose ABOUT content. It must not
      // contain a mathematical statement presented as content: a bare
      // equation, or a fraction offered as an example answer.
      if (/\b\d+\s*\/\s*\d+\s*=\s*\d/.test(r.requirement)) {
        violations.push(`${b.officialSectionId} / ${r.heading}: contains a worked computation`);
      }
      if (/^(Answer|Solution|Step 1)\b/im.test(r.requirement)) {
        violations.push(`${b.officialSectionId} / ${r.heading}: reads as a solution, not a specification`);
      }
    }
  }
  return violations;
}
