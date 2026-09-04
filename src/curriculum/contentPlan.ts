// v0.74 §1/§2/§3 — THE AUTHORING PLAN, CORRECTED.
//
// WHAT THIS MODULE IS
//
// It authors nothing. It produces a work plan: for each official
// record, what is missing, what shape the missing thing should take,
// and whether it can responsibly be planned at all.
// `assertNoContentGenerated` is a standing test that it never starts
// writing prose.
//
// WHAT v0.73 GOT WRONG, AND WHY IT MATTERED
//
// v0.73's plan reported "89 official records need work · 483 authoring
// items". Three separate defects sat underneath that number.
//
// 1. ONE SHAPE FOR TWELVE YEARS OF SCHOOL. `targetSectionShape()`
//    returned the median of nine Class 6 Fractions sections and applied
//    it to everything. Class 11 Calculus was planned at six explanation
//    paragraphs and three worked examples because that is what §7.3
//    happens to contain. See `productionStage.ts`.
//
// 2. ONE GRAIN FOR UNITS AND SECTIONS. 24 of the 89 records are CBSE
//    syllabus UNITS — Class 10 Unit II is "Algebra", 20 marks, four
//    topics — and each received a plan identical to one textbook
//    section. 144 of the 483 items were planned at a grain where no
//    lesson exists to plan. See `curriculumGrain.ts`.
//
// 3. A TARGET IT DID NOT PLAN FOR. The target shape named
//    `reasoningTasks`, `interactivePractice` and
//    `documentedMisconceptions`, and the unauthored branch emitted work
//    items for none of them: zero, across all 80 unauthored records. So
//    483 undercounted its own specification while simultaneously
//    overcounting records it should not have planned.
//
// HOW APPLICABILITY IS HANDLED NOW
//
// The fix for (3) is NOT to require every component everywhere. §7.9
// "A Pinch of History" proves why: a multiple-choice quiz on names and
// dates would assess recall the section never asks for, and a
// decorative timeline would add no mathematics. Its visual, interactive
// and misconception requirements are waived WITH REASONS.
//
// But for a section nobody has designed yet, applicability is not
// "required" and not "waived" — it is UNKNOWN, and the honest output is
// a design decision, not a silent omission. So every requirement is one
// of three things:
//
//   required                            — plan it
//   not_required_with_reason            — recorded, generates no work
//   undetermined_requires_design_review — generates a DESIGN task
//
// The three components Chapter 7 actually waived somewhere are exactly
// the three that are undetermined before design. That is not a
// coincidence; it is the evidence.

import type { Grade } from '../types';
import { coverageBacklog, type CoverageBacklogEntry } from './coverageMatrix';
import {
  assessSection,
  type InstructionalCompleteness,
} from './instructionalCompleteness';
import { authoredSectionById } from './fractionsChapter';
import { sectionsForChapter } from './officialSections';
import { officialCurriculumForGrade } from './officialCurriculum';
import {
  authoringStandardForGrade,
  productionStageForGrade,
  PRODUCTION_STAGE_LABEL,
  type AuthoringStandard,
  type ProductionStage,
  type SectionShape,
} from './productionStage';
import {
  assessGrain,
  type CurriculumGrain,
  type GrainAssessment,
} from './curriculumGrain';
import {
  assessReviewReadiness,
  type ReviewReadinessState,
} from './reviewReadiness';

export type { SectionShape } from './productionStage';
export { observedMiddleStageFractionsShape } from './productionStage';

// ---------------------------------------------------------------------------
// §3 — applicability is a three-valued thing
// ---------------------------------------------------------------------------

export type Applicability =
  | 'required'
  | 'not_required_with_reason'
  | 'undetermined_requires_design_review';

export type WorkKind =
  | 'author_explanation'
  | 'author_worked_examples'
  | 'author_guided_practice'
  | 'author_independent_practice'
  | 'author_reasoning_task'
  | 'specify_visual'
  | 'author_interactive_practice'
  | 'document_misconception'
  | 'author_teacher_notes'
  /** Decide whether a component applies here at all. Design, not authoring. */
  | 'design_decision'
  /** A person must read a textbook before this record can be planned. */
  | 'verify_official_structure'
  /** Engineering must build a review package before a reviewer can start. */
  | 'prepare_review_package'
  | 'educator_review';

export type WorkItem = {
  kind: WorkKind;
  /** How many of the thing are still needed. Null for non-countable work. */
  outstanding: number | null;
  /** What the plan is asking for, in one line. */
  description: string;
  /** True when no engineering can do this. */
  requiresHuman: boolean;
  /** §3 — why this item exists, or why a component produced none. */
  applicability: Applicability;
  /** Set for `not_required_with_reason` and for design decisions. */
  reason?: string;
};

/**
 * Why a record could not be planned, when it could not.
 *
 * A plan that says `requires_deeper_curriculum_structure` is a better
 * plan than one that invents three practice items for "Algebra".
 */
export type PlanningOutcome =
  | 'planned'
  | 'requires_deeper_curriculum_structure'
  | 'production_standard_pending';

export type SectionPlan = {
  grade: Grade;
  gradeLabel: string;
  stage: ProductionStage;
  stageLabel: string;
  grain: CurriculumGrain;
  grainAssessment: GrainAssessment;
  officialUnitId: string;
  officialUnitTitle: string;
  officialSectionId: string | null;
  officialSectionTitle: string | null;
  priority: CoverageBacklogEntry['priority'];
  /** Null when nothing is authored for this record yet. */
  assessment: InstructionalCompleteness | null;
  outcome: PlanningOutcome;
  /** The standard consulted. Records WHICH standard, not just its numbers. */
  standard: AuthoringStandard;
  work: WorkItem[];
  /** Review state for authored drafts; null for everything else. */
  reviewReadiness: ReviewReadinessState | null;
  /**
   * True when the ONLY outstanding work is a person.
   *
   * §7 — this now REQUIRES the review package to exist. v0.73 inferred
   * it from the absence of authoring work, which reported seven
   * sections as blocked on a reviewer when no reviewer could have
   * started on them.
   */
  blockedOnHumanOnly: boolean;
};

function countableWork(
  have: number,
  want: number,
  kind: WorkKind,
  noun: string
): WorkItem | null {
  if (have >= want) return null;
  const n = want - have;
  return {
    kind,
    outstanding: n,
    description: `${n} more ${noun}${n === 1 ? '' : 's'} (has ${have}, target ${want})`,
    requiresHuman: false,
    applicability: 'required',
  };
}

/**
 * Components whose applicability cannot be known before design.
 *
 * Chosen from evidence, not taste: these are exactly the three that
 * Chapter 7 waived for §7.9, with written reasons. A component that has
 * never needed a waiver in nine audited sections is treated as required.
 */
const UNDETERMINED_BEFORE_DESIGN = [
  {
    noun: 'semantic visual',
    question: 'would a visual carry mathematics here, or only decorate',
  },
  {
    noun: 'interactive practice item',
    question: 'would interaction teach here, or test recall never asked for',
  },
  {
    noun: 'documented misconception',
    question: 'does a documented mathematical misconception attach here',
  },
];

/** Components every authored section has needed so far. */
function requiredComponentWork(shape: SectionShape): WorkItem[] {
  return [
    {
      kind: 'author_explanation' as WorkKind,
      outstanding: shape.explanationParagraphs,
      description: `${shape.explanationParagraphs} explanation paragraphs`,
    },
    {
      kind: 'author_worked_examples' as WorkKind,
      outstanding: shape.workedExamples,
      description: `${shape.workedExamples} worked examples with step reasoning`,
    },
    {
      kind: 'author_guided_practice' as WorkKind,
      outstanding: shape.guidedPractice,
      description: `${shape.guidedPractice} guided items with hints`,
    },
    {
      kind: 'author_independent_practice' as WorkKind,
      outstanding: shape.independentPractice,
      description: `${shape.independentPractice} independent items with rationales`,
    },
    {
      kind: 'author_reasoning_task' as WorkKind,
      outstanding: shape.reasoningTasks,
      description: `${shape.reasoningTasks} reasoning or application task`,
    },
    {
      kind: 'author_teacher_notes' as WorkKind,
      outstanding: null,
      description: 'teaching notes and quick checks',
    },
  ].map((w) => ({
    ...w,
    requiresHuman: false,
    applicability: 'required' as Applicability,
  }));
}

/** The plan for one official record. */
export function planForRecord(entry: CoverageBacklogEntry): SectionPlan {
  const stage = productionStageForGrade(entry.grade);
  const standard = authoringStandardForGrade(entry.grade);

  const curriculum = officialCurriculumForGrade(entry.grade);
  const unit = curriculum?.units.find(
    (u) => u.officialUnitId === entry.officialUnitId
  );
  const grainAssessment = assessGrain(entry.grade, entry.officialSectionId, unit);

  const authored = entry.officialSectionId
    ? authoredSectionById(entry.officialSectionId)
    : null;
  const a = authored ? assessSection(authored) : null;

  const readiness = entry.officialSectionId
    ? assessReviewReadiness(entry.officialSectionId)
    : null;

  const base = {
    grade: entry.grade,
    gradeLabel: entry.gradeLabel,
    stage,
    stageLabel: PRODUCTION_STAGE_LABEL[stage],
    grain: grainAssessment.grain,
    grainAssessment,
    officialUnitId: entry.officialUnitId,
    officialUnitTitle: entry.officialUnitTitle,
    officialSectionId: entry.officialSectionId,
    officialSectionTitle: entry.officialSectionTitle,
    priority: entry.priority,
    assessment: a,
    standard,
    reviewReadiness: readiness?.state ?? null,
  };

  // ---- §2 — grain too broad to plan instruction against ------------------
  if (!grainAssessment.plannable) {
    return {
      ...base,
      outcome: 'requires_deeper_curriculum_structure',
      work: [
        {
          kind: 'verify_official_structure',
          outstanding: null,
          description: `establish the sections beneath this ${grainAssessment.grain.replace('official_', '')}`,
          requiresHuman: true,
          applicability: 'required',
          reason: grainAssessment.requires ?? undefined,
        },
      ],
      blockedOnHumanOnly: true,
    };
  }

  // ---- §1 — no audited standard for this stage ---------------------------
  if (standard.kind === 'production_standard_pending') {
    return {
      ...base,
      outcome: 'production_standard_pending',
      work: [
        {
          kind: 'design_decision',
          outstanding: null,
          description: `establish an authoring standard for this stage`,
          requiresHuman: true,
          applicability: 'undetermined_requires_design_review',
          reason: standard.requires,
        },
      ],
      blockedOnHumanOnly: true,
    };
  }

  const shape = standard.shape;
  const work: WorkItem[] = [];

  if (!a) {
    // Nothing authored. State the whole shape, and be explicit that
    // three components cannot be decided until the section is designed.
    work.push(...requiredComponentWork(shape));
    for (const u of UNDETERMINED_BEFORE_DESIGN) {
      work.push({
        kind: 'design_decision',
        outstanding: null,
        description: `decide whether a ${u.noun} applies`,
        requiresHuman: false,
        applicability: 'undetermined_requires_design_review',
        reason: u.question,
      });
    }
  } else {
    for (const item of [
      countableWork(a.hasExplanation ? 1 : 0, 1, 'author_explanation', 'explanation'),
      countableWork(a.workedExampleCount, shape.workedExamples, 'author_worked_examples', 'worked example'),
      countableWork(a.guidedPracticeCount, shape.guidedPractice, 'author_guided_practice', 'guided item'),
      countableWork(a.independentPracticeCount, shape.independentPractice, 'author_independent_practice', 'independent item'),
    ]) {
      if (item) work.push(item);
    }

    // Applicability is DECIDED for authored content: the section exists,
    // so a waiver is a recorded judgement, not an unknown. Both branches
    // are represented — a waived requirement is reported, never silently
    // dropped, which is how v0.73 lost three whole components.
    const decided = [
      { r: a.visualRequirement, kind: 'specify_visual' as WorkKind, noun: 'a semantic visual with caption and alt text' },
      { r: a.interactionRequirement, kind: 'author_interactive_practice' as WorkKind, noun: 'an interactive practice item' },
      { r: a.reasoningRequirement, kind: 'author_reasoning_task' as WorkKind, noun: 'a reasoning task' },
      { r: a.misconceptionRequirement, kind: 'document_misconception' as WorkKind, noun: 'a documented misconception with diagnostic feedback' },
    ];
    for (const d of decided) {
      if (d.r.required && !d.r.satisfied) {
        work.push({
          kind: d.kind,
          outstanding: 1,
          description: d.noun,
          requiresHuman: false,
          applicability: 'required',
        });
      } else if (!d.r.required) {
        work.push({
          kind: d.kind,
          outstanding: 0,
          description: `${d.noun}: not required here`,
          requiresHuman: false,
          applicability: 'not_required_with_reason',
          reason: d.r.reason,
        });
      }
    }

    if (!a.hasTeacherNotes) {
      work.push({
        kind: 'author_teacher_notes',
        outstanding: null,
        description: 'teaching notes and quick checks',
        requiresHuman: false,
        applicability: 'required',
      });
    }
  }

  // §7 — a reviewer cannot start without a package. For seven of the
  // eight complete drafts that package does not exist, and calling them
  // "blocked on a person" hid engineering work in a release headline.
  if (readiness && readiness.state === 'review_package_preparation') {
    work.push({
      kind: 'prepare_review_package',
      outstanding: null,
      description: 'build the review package: candidate, pinned build, question set',
      requiresHuman: false,
      applicability: 'required',
      reason: readiness.nextAction,
    });
  }

  work.push({
    kind: 'educator_review',
    outstanding: null,
    description: 'read by a Grade 6 mathematics educator',
    requiresHuman: true,
    applicability: 'required',
  });

  const advanceable = work.filter(
    (w) => w.applicability !== 'not_required_with_reason'
  );

  // v0.75 §22 — a complete draft with a review package is blocked on the
  // reviewer, even when it sits below the observed Middle Stage median.
  //
  // §7.9 exposed the distinction. After completion it holds 2 worked
  // examples, 2 guided and 3 independent items: it PASSES the
  // completeness gate, which is the bar for "can a person read this".
  // The median target is higher (3/3/5), so the plan still lists
  // enrichment — correctly, more practice would be better. But that
  // enrichment does not stop an educator reviewing it, and reporting
  // §7.9 as engineering-blocked would repeat the v0.73 error in the
  // opposite direction: attributing to engineering a wait that is
  // actually on a person.
  const readyForReviewer =
    readiness?.state === 'review_ready' &&
    a?.level === 'complete_instructional_draft';

  return {
    ...base,
    outcome: 'planned',
    work,
    blockedOnHumanOnly:
      readyForReviewer || advanceable.every((w) => w.requiresHuman),
  };
}

export function contentPlan(): SectionPlan[] {
  return coverageBacklog().map(planForRecord);
}

// ---------------------------------------------------------------------------
// Summary — counts that distinguish what they are counting
// ---------------------------------------------------------------------------

export type PlanSummary = {
  records: number;
  /** Records that can be planned against an audited standard. */
  plannable: number;
  /** Records whose evidence grain is too broad for an instructional plan. */
  requiresDeeperStructure: number;
  /** Records at a stage with no audited authoring standard. */
  productionStandardPending: number;
  /**
   * Records no engineering can advance. Deliberately the UNION of two
   * very different situations, split immediately below — a person
   * reading a textbook and a person reading a lesson are both people,
   * and both block, but they are not the same request.
   */
  blockedOnHumanOnly: number;
  /** Complete drafts whose only outstanding work is an educator reading them. */
  blockedOnEducatorReviewOnly: number;
  /** Records blocked on somebody reading a primary curriculum source. */
  blockedOnStructureVerification: number;
  /** Countable authoring work with KNOWN applicability. */
  determinedAuthoringItems: number;
  /** Applicability questions a designer must answer first. */
  undeterminedDesignDecisions: number;
  /** Components explicitly waived with a reason. Not work. */
  waivedWithReason: number;
  /** Engineering work before a reviewer can begin. */
  reviewPackagesToPrepare: number;
  byKind: Record<string, number>;
  byPriority: Record<string, number>;
  byOutcome: Record<PlanningOutcome, number>;
  headline: string;
};

export function planSummary(): PlanSummary {
  const plans = contentPlan();
  const byKind: Record<string, number> = {};
  const byPriority: Record<string, number> = { P1: 0, P2: 0, P3: 0 };
  const byOutcome: Record<PlanningOutcome, number> = {
    planned: 0,
    requires_deeper_curriculum_structure: 0,
    production_standard_pending: 0,
  };

  let determined = 0;
  let undetermined = 0;
  let waived = 0;
  let reviewPackages = 0;

  for (const p of plans) {
    byPriority[p.priority] += 1;
    byOutcome[p.outcome] += 1;
    for (const w of p.work) {
      byKind[w.kind] = (byKind[w.kind] ?? 0) + 1;
      if (w.applicability === 'not_required_with_reason') waived += 1;
      else if (w.applicability === 'undetermined_requires_design_review') undetermined += 1;
      else if (w.kind === 'prepare_review_package') reviewPackages += 1;
      else if (!w.requiresHuman) determined += 1;
    }
  }

  const blocked = plans.filter((p) => p.blockedOnHumanOnly).length;
  const plannable = byOutcome.planned;

  const reviewOnly = plans.filter(
    (p) => p.blockedOnHumanOnly && p.reviewReadiness === 'review_ready'
  ).length;
  const structureOnly = plans.filter(
    (p) =>
      p.blockedOnHumanOnly &&
      p.outcome === 'requires_deeper_curriculum_structure'
  ).length;

  return {
    records: plans.length,
    plannable,
    requiresDeeperStructure: byOutcome.requires_deeper_curriculum_structure,
    productionStandardPending: byOutcome.production_standard_pending,
    blockedOnHumanOnly: blocked,
    blockedOnEducatorReviewOnly: reviewOnly,
    blockedOnStructureVerification: structureOnly,
    determinedAuthoringItems: determined,
    undeterminedDesignDecisions: undetermined,
    waivedWithReason: waived,
    reviewPackagesToPrepare: reviewPackages,
    byKind,
    byPriority,
    byOutcome,
    headline:
      `${plans.length} verified official records need work. ` +
      `${plannable} can be planned against an audited standard; ` +
      `${byOutcome.requires_deeper_curriculum_structure} are syllabus units whose sections ` +
      `nobody has read, and cannot responsibly receive a lesson plan. ` +
      `The plannable records need ${determined} authoring items and ` +
      `${undetermined} design decisions that must be answered first.`,
  };
}

/**
 * §19 — the standing guarantee.
 *
 * This module plans; it never produces content.
 */
export function assertNoContentGenerated(): string[] {
  const violations: string[] = [];
  for (const p of contentPlan()) {
    for (const w of p.work) {
      if (/[.!?]\s+[A-Z]/.test(w.description)) {
        violations.push(
          `${p.officialSectionId ?? p.officialUnitId}: work description looks like prose, not a specification: "${w.description}"`
        );
      }
    }
  }
  return violations;
}

/**
 * §28 — no Fractions-shape leakage.
 *
 * Returns any plan that applied a Middle Stage section shape outside
 * Middle Stage, or to a grain coarser than a section. Empty is the only
 * acceptable result, and a test asserts it.
 */
export function assertNoShapeLeakage(): string[] {
  const violations: string[] = [];

  for (const p of contentPlan()) {
    const countedAuthoring = p.work.filter(
      (w) =>
        w.applicability === 'required' &&
        typeof w.outstanding === 'number' &&
        w.outstanding > 0
    );
    if (countedAuthoring.length === 0) continue;

    if (p.stage !== 'MIDDLE') {
      violations.push(
        `${p.officialSectionId ?? p.officialUnitId}: ${p.stage} record received ${countedAuthoring.length} counted authoring items; only MIDDLE has an audited standard`
      );
    }
    if (p.grain !== 'official_section' && p.grain !== 'official_topic') {
      violations.push(
        `${p.officialUnitId}: ${p.grain} received a section-level lesson plan`
      );
    }
  }
  return violations;
}

/** Plans for one grade, in official order. */
export function planForGrade(grade: Grade): SectionPlan[] {
  return contentPlan().filter((p) => p.grade === grade);
}

/** Plans for one chapter, in official section order. */
export function planForChapter(officialChapterId: string): SectionPlan[] {
  const order = sectionsForChapter(officialChapterId).map((s) => s.officialSectionId);
  return contentPlan()
    .filter((p) => p.officialUnitId === officialChapterId)
    .sort(
      (a, b) =>
        order.indexOf(a.officialSectionId ?? '') - order.indexOf(b.officialSectionId ?? '')
    );
}
