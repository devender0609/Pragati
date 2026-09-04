// v0.72 §4/§5/§25 — WHAT "ENOUGH CONTENT" MEANS.
//
// THE THREE TRUTHS, KEPT APART
//
//   1. OFFICIAL CURRICULUM COMPLETENESS — does the registry hold every
//      official record? Enforced by `officialCompleteness.ts`.
//   2. PRAGATI CONTENT COMPLETENESS — is there enough teaching material
//      for a student to actually learn the thing? This file.
//   3. REVIEW / PUBLICATION COMPLETENESS — has a human checked it, and
//      may a student see it? `educatorReview.ts` / `publicationGate.ts`.
//
// Collapsing any two is how a product ends up claiming a chapter is
// "done" because a file exists.
//
// WHY APPLICABILITY IS PART OF THE MODEL
//
// A naive checklist would fail §7.9 ("A Pinch of History") for having no
// diagram and no interactive item, and the correct response to that
// failure would be to bolt a quiz about dates onto a discussion section
// — making the content worse to make a number go green.
//
// So every requirement can be waived, and a waiver must carry a REASON.
// A waived requirement is recorded, not hidden: `notRequiredWithReason`
// appears in the report beside the satisfied ones, and a reviewer can
// disagree with any of them.
//
// §25 — SHALLOW MATERIAL MUST NOT COUNT
//
// One paragraph and three multiple-choice questions is not a complete
// instructional draft. The thresholds below are deliberately set where a
// skeleton fails them, and `completenessLevel` returns
// `generated_skeleton` for anything that looks generated rather than
// authored.

import type { AuthoredSection } from './authoredSection';
import { misconceptionsForSection } from './fractionsMisconceptions';
import { SECTION_7_4_MISCONCEPTION_IDS } from './section74Misconceptions';

export type RequirementStatus =
  | { required: true; satisfied: boolean }
  | { required: false; reason: string };

export type InstructionalCompleteness = {
  officialSectionId: string;
  sectionNumber: string;
  title: string;

  hasExplanation: boolean;
  workedExampleCount: number;
  guidedPracticeCount: number;
  independentPracticeCount: number;
  reasoningTaskCount: number;
  interactivePracticeCount: number;
  semanticVisualCount: number;
  misconceptionCoverage: number;
  hasAnswerRationales: boolean;
  hasTeacherNotes: boolean;
  hasAccessibilityMetadata: boolean;

  /** Pedagogically justified applicability. */
  visualRequirement: RequirementStatus;
  interactionRequirement: RequirementStatus;
  reasoningRequirement: RequirementStatus;
  misconceptionRequirement: RequirementStatus;

  reviewState: string;
  publicationState: 'unpublished' | 'published';

  level: CompletenessLevel;
  /** Exactly what is missing. Empty for a complete draft. */
  gaps: string[];
};

export type CompletenessLevel =
  /** Nothing authored. */
  | 'absent'
  /** Something exists but is too thin to teach from. §25. */
  | 'generated_skeleton'
  /** Real material, with named gaps. */
  | 'incomplete_draft'
  /** Every applicable component present. Still NOT student-ready. */
  | 'complete_instructional_draft';

/**
 * Minimum bar for a complete instructional draft.
 *
 * Derived from what the nine authored Fractions sections actually
 * contain, which is the only worked standard Pragati has. They are a
 * floor for COMPLETENESS, not a target for quality — a section can clear
 * every one of these and still teach badly, which is what educator
 * review is for.
 */
export const COMPLETE_DRAFT_MINIMUM = {
  explanationParagraphs: 3,
  workedExamples: 2,
  guidedPractice: 2,
  independentPractice: 3,
  /** Where reasoning applies. */
  reasoningTasks: 1,
  /** Where a visual applies. */
  semanticVisuals: 1,
} as const;

/**
 * Sections whose requirements are waived, and why.
 *
 * Keyed by official section id so a retitling cannot silently move a
 * waiver onto different content. Every entry is a judgement a reviewer
 * may overturn.
 */
const WAIVERS: Record<
  string,
  Partial<Record<'visual' | 'interaction' | 'reasoning' | 'misconception', string>>
> = {
  ncert_gp_c6_s7_9: {
    visual:
      'A history and context section. v0.72 §17 considered a timeline and concluded a decorative one would add no mathematical learning; a sourced facsimile is a rights and authoring decision for review, not a completeness gap.',
    interaction:
      'v0.68 §5 recorded the argument: a multiple-choice quiz on names and dates would assess recall of facts the section never asks anyone to memorise, and would misrepresent what it teaches.',
    misconception:
      'No documented mathematical misconception attaches to a historical narrative.',
  },
};

function req(
  sectionId: string,
  key: 'visual' | 'interaction' | 'reasoning' | 'misconception',
  satisfied: boolean
): RequirementStatus {
  const reason = WAIVERS[sectionId]?.[key];
  return reason ? { required: false, reason } : { required: true, satisfied };
}

export function assessSection(
  section: AuthoredSection
): InstructionalCompleteness {
  const id = section.source.officialSectionId;

  const explanationParagraphs = section.explanation.length;
  const workedExampleCount = section.workedExamples.length;
  const guided = section.guidedPractice.length;
  const independent = section.independentPractice.length;
  const reasoning = section.reasoningApplication.length;
  const interactive = section.interactivePractice.length;
  const visuals = section.visuals.length;
  // §7.4's four misconceptions live in the FROZEN §7.4 map, not the
  // chapter registry, so `misconceptionsForSection` correctly returns
  // none for it. Counting only the registry reported the most
  // thoroughly audited section in the chapter as missing misconception
  // support — a false gap produced by the model, not by the content.
  const misconceptions =
    id === 'ncert_gp_c6_s7_4'
      ? SECTION_7_4_MISCONCEPTION_IDS.length
      : misconceptionsForSection(id).length;

  // Every practice item carries a rationale, or the section cannot
  // explain a wrong answer to anyone.
  const hasAnswerRationales =
    [...section.guidedPractice, ...section.independentPractice].every((i) =>
      Boolean((i as { rationale?: string; hint?: string }).rationale ??
        (i as { hint?: string }).hint)
    );

  const hasTeacherNotes =
    section.teacher.teachingNotes.length > 0 ||
    section.teacher.quickChecks.length > 0;

  // Alt text on every visual is the accessibility floor: a diagram with
  // no description is sighted-only, and the diagram often IS the item.
  const hasAccessibilityMetadata =
    visuals === 0 ||
    section.visuals.every((v) => Boolean(v.altText?.trim()) && Boolean(v.caption?.trim()));

  const visualRequirement = req(id, 'visual', visuals >= COMPLETE_DRAFT_MINIMUM.semanticVisuals);
  const interactionRequirement = req(id, 'interaction', interactive >= 1);
  const reasoningRequirement = req(id, 'reasoning', reasoning >= COMPLETE_DRAFT_MINIMUM.reasoningTasks);
  const misconceptionRequirement = req(id, 'misconception', misconceptions >= 1);

  const gaps: string[] = [];
  if (explanationParagraphs < COMPLETE_DRAFT_MINIMUM.explanationParagraphs) {
    gaps.push(`explanation has ${explanationParagraphs} paragraphs, needs ${COMPLETE_DRAFT_MINIMUM.explanationParagraphs}`);
  }
  if (workedExampleCount < COMPLETE_DRAFT_MINIMUM.workedExamples) {
    gaps.push(`${workedExampleCount} worked examples, needs ${COMPLETE_DRAFT_MINIMUM.workedExamples}`);
  }
  if (guided < COMPLETE_DRAFT_MINIMUM.guidedPractice) {
    gaps.push(`${guided} guided items, needs ${COMPLETE_DRAFT_MINIMUM.guidedPractice}`);
  }
  if (independent < COMPLETE_DRAFT_MINIMUM.independentPractice) {
    gaps.push(`${independent} independent items, needs ${COMPLETE_DRAFT_MINIMUM.independentPractice}`);
  }
  for (const [name, r] of [
    ['visual', visualRequirement],
    ['interactive practice', interactionRequirement],
    ['reasoning task', reasoningRequirement],
    ['documented misconception', misconceptionRequirement],
  ] as const) {
    if (r.required && !r.satisfied) gaps.push(`no ${name}`);
  }
  if (!hasAnswerRationales) gaps.push('a practice item has no rationale');
  if (!hasTeacherNotes) gaps.push('no teacher notes');
  if (!hasAccessibilityMetadata) gaps.push('a visual has no alt text or caption');

  const authoredAnything =
    explanationParagraphs > 0 || workedExampleCount > 0 || guided + independent > 0;

  // §25 — the skeleton test. One paragraph and a handful of questions is
  // what a generator produces; it must never read as a complete draft.
  const looksGenerated =
    authoredAnything &&
    explanationParagraphs <= 1 &&
    workedExampleCount === 0;

  const level: CompletenessLevel = !authoredAnything
    ? 'absent'
    : looksGenerated
      ? 'generated_skeleton'
      : gaps.length === 0
        ? 'complete_instructional_draft'
        : 'incomplete_draft';

  return {
    officialSectionId: id,
    sectionNumber: section.source.sectionNumber,
    title: section.source.exactTitle,
    hasExplanation: explanationParagraphs > 0,
    workedExampleCount,
    guidedPracticeCount: guided,
    independentPracticeCount: independent,
    reasoningTaskCount: reasoning,
    interactivePracticeCount: interactive,
    semanticVisualCount: visuals,
    misconceptionCoverage: misconceptions,
    hasAnswerRationales,
    hasTeacherNotes,
    hasAccessibilityMetadata,
    visualRequirement,
    interactionRequirement,
    reasoningRequirement,
    misconceptionRequirement,
    reviewState: section.reviewStatus,
    publicationState:
      section.reviewStatus === 'published' ? 'published' : 'unpublished',
    level,
    gaps,
  };
}

export type CompletenessTotals = Record<CompletenessLevel, number> & {
  total: number;
  reviewed: number;
  published: number;
};

export function totalsFor(
  rows: InstructionalCompleteness[]
): CompletenessTotals {
  return {
    total: rows.length,
    absent: rows.filter((r) => r.level === 'absent').length,
    generated_skeleton: rows.filter((r) => r.level === 'generated_skeleton').length,
    incomplete_draft: rows.filter((r) => r.level === 'incomplete_draft').length,
    complete_instructional_draft: rows.filter(
      (r) => r.level === 'complete_instructional_draft'
    ).length,
    reviewed: rows.filter((r) => r.reviewState !== 'authored_draft').length,
    published: rows.filter((r) => r.publicationState === 'published').length,
  };
}
