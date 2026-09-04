// v0.55 §6 + §9 — Framework decision matrix and freeze candidate.
//
// TWO RULES THIS FILE ENFORCES
//
// 1. A decision is recorded with the evidence FOR EACH SOURCE
//    SEPARATELY, including sources that were never inspected. A blank
//    PARAKH cell is information: it says the strongest available
//    assessment-design evidence has not been consulted.
//
// 2. A freeze candidate cannot approve itself. Not by accumulating
//    evidence, not by confidence, not by anything except named
//    independent human reviewers completing the workflow. The
//    `approved` field is computed, never assigned.

import type { AssessmentDomainId } from './competencyFramework';
import type { ProvenanceLevel } from './evidenceProvenance';
import {
  mayFreezeFramework,
  type DecisionReview,
  type Adjudication,
} from '../features/teacher/reviewAdjudication';

export type RecommendedAction =
  | 'retain'
  | 'merge'
  | 'split'
  | 'reclassify_as_process'
  | 'stage_specific_only'
  | 'remove_from_growth_blueprint'
  | 'defer';

export type Confidence = 'low' | 'moderate' | 'high';

/**
 * v0.61 §3 — which NCF-SE stage a decision's evidence came from.
 *
 * Every row below was decided from the CBSE Class IX curriculum, which
 * reproduces the SECONDARY Stage goals (CG-1..CG-11). Pragati's pilot
 * grade is Class 6, which is MIDDLE Stage (CG-1..CG-10). The two goal
 * sets are adjacent in NCF-SE, similarly worded, and differently
 * numbered — see docs/MIDDLE_VS_SECONDARY_FRAMEWORK_CROSSWALK.md.
 *
 * Rows are MARKED, not rewritten. A decision made on the wrong stage's
 * evidence is not corrected by quietly substituting the right stage's
 * number: the reasoning behind it has to be re-examined by a reviewer,
 * because in six of fifteen constructs the MEANING differs too.
 */
export type StageReviewStatus =
  /** Evidence was stage-appropriate for the grades it governs. */
  | 'stage_verified'
  /** Decided from Secondary Stage evidence but governs Middle Stage
   *  content. Must be re-reviewed before any Class 6-8 use. */
  | 'requires_stage_review'
  /** Applies only to Classes 9-12, where the Secondary evidence is
   *  correct. */
  | 'secondary_stage_only';

/** Evidence from one source for one construct. `null` means the source
 *  was NOT inspected — deliberately distinct from "inspected, said
 *  nothing", which is `'no_statement_found'`. */
export type SourceEvidence = string | null | 'no_statement_found';

export type FrameworkDecision = {
  construct: string;
  domainId: AssessmentDomainId | null;
  currentStatus: string;
  ncfSeEvidence: SourceEvidence;
  parakhEvidence: SourceEvidence;
  cbseEvidence: SourceEvidence;
  otherOfficialEvidence: SourceEvidence;
  mathematicalRationale: string;
  unresolvedIssue: string;
  recommendedAction: RecommendedAction;
  confidence: Confidence;
  humanReviewRequired: boolean;
  strongestProvenance: ProvenanceLevel | null;
  /** v0.61 §3 — added, never used to overwrite an existing decision. */
  stageReview: StageReviewStatus;
  /** Why, in reviewer-facing words. Non-null whenever
   *  `stageReview === 'requires_stage_review'`. */
  stageReviewNote: string | null;
};

/**
 * The decision matrix.
 *
 * Note how many `null` cells there are under PARAKH and NCF-SE. That is
 * the honest state, and it is why nearly every confidence is 'low' or
 * 'moderate' and every row requires human review.
 */
/**
 * v0.61 §3 — stage review IS human review.
 *
 * Four rows carried `humanReviewRequired: false`, set when the only
 * evidence was the CBSE Class IX document — i.e. the Secondary Stage
 * goal set — and the construct looked uncontroversial. Now that the
 * Middle Stage source has been read, "uncontroversial" no longer
 * follows: six of fifteen constructs changed MEANING between stages,
 * and a construct cannot be settled while it is still recorded as
 * decided on the wrong stage's evidence.
 *
 * So the flag is DERIVED, not declared. A row that requires stage
 * review requires human review, and no literal in the table below can
 * say otherwise.
 */
function withDerivedReview(rows: FrameworkDecision[]): FrameworkDecision[] {
  return rows.map((r) =>
    r.stageReview === 'requires_stage_review'
      ? { ...r, humanReviewRequired: true }
      : r
  );
}

const RAW_FRAMEWORK_DECISIONS: FrameworkDecision[] = [
  {
    construct: 'Number Sense & Operations',
    domainId: 'NUM',
    currentStatus: 'proposed content domain',
    ncfSeEvidence:
      'MIDDLE (direct, NCF-SE §3.4.1.2 pp.255-256): MIDDLE:CG-1 spans whole numbers, fractions, integers, rational and real numbers as ONE goal, with MIDDLE:C-1.4 naming visualisation on the number line and MIDDLE:C-1.5 percentage. Prior conclusion (retain as a domain) STANDS; scope is narrower at Middle than the Secondary CG-1 previously cited.',
    parakhEvidence: null,
    cbseEvidence:
      'CG-1 covers natural, whole, integer, rational, irrational and real numbers as one curricular goal.',
    otherOfficialEvidence: null,
    mathematicalRationale:
      'Number and operations underpin every other strand; no serious framework omits it.',
    unresolvedIssue:
      'Whether rational numbers sit inside this domain or beside it (see next row).',
    recommendedAction: 'retain',
    confidence: 'high',
    humanReviewRequired: false,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Decided from Secondary CG-1 (natural..real numbers). Middle CG-1 covers whole numbers to rationals and explicitly names the number line (C-1.4) and percentage (C-1.5). Scope differs; re-review before Class 6-8 use.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Fractions & Rational Number Reasoning',
    domainId: 'RAT',
    currentStatus: 'proposed content domain (Pragati design choice)',
    ncfSeEvidence:
      'MIDDLE (direct): MIDDLE:C-1.6 states fractions \'both as ratios and in decimal form\' as a SINGLE competency, and MIDDLE:C-1.4 places fractions on the number line. This bears directly on whether decimals and ratio are separable reporting constructs. Prior conclusion NOT settled — meaning changed.',
    parakhEvidence: null,
    cbseEvidence:
      'Placed WITHIN CG-1 alongside other number sets; no separate curricular goal.',
    otherOfficialEvidence: null,
    mathematicalRationale:
      'Long developmental progression from partitioning to proportional reasoning; a persistent and well-documented difficulty area.',
    unresolvedIssue:
      'The official structure does NOT separate it. Separation is defensible for measurement and instruction but is not curriculum alignment. Dimensionality evidence would settle it; none exists.',
    recommendedAction: 'defer',
    confidence: 'low',
    humanReviewRequired: true,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Middle C-1.6 states fractions \'both as ratios and in decimal form\' as ONE competency. That bears directly on whether Pragati\'s separate decimals and ratio modules are core Middle Stage content.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Algebraic Thinking',
    domainId: 'ALG',
    currentStatus: 'proposed content domain',
    ncfSeEvidence:
      'MIDDLE (direct): MIDDLE:CG-2 is an entire curricular goal — variable, constant, coefficient, expression, one-variable equation (MIDDLE:C-2.1..C-2.5). The Secondary CG-3 previously cited is polynomials and remainder theorem. Different number AND different meaning.',
    parakhEvidence: null,
    cbseEvidence:
      'CG-3 covers algebraic identities and modelling real-life situations as equations.',
    otherOfficialEvidence: null,
    mathematicalRationale: 'Generalisation is a distinct competence from computation.',
    unresolvedIssue: 'Whether patterns belong here (see Patterns row).',
    recommendedAction: 'retain',
    confidence: 'high',
    humanReviewRequired: false,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Secondary CG-3 is polynomials and remainder theorem; Middle CG-2 is variables, expressions and linear equations. Different number AND different meaning.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Patterns & Relationships',
    domainId: 'PAT',
    currentStatus: 'proposed content domain',
    ncfSeEvidence:
      'MIDDLE (direct): patterns are named explicitly at MIDDLE:C-1.2 inside MIDDLE:CG-1, not as a separate goal. Prior conclusion (\'no separate goal\') STANDS, but the Middle source states it more directly than the Secondary reading did.',
    parakhEvidence: null,
    cbseEvidence:
      'No separate curricular goal at secondary; sequences map to CG-11/C-8.1.',
    otherOfficialEvidence:
      'CBSE CT&AI Curriculum names Pattern Recognition as one of six CT elements, with learning outcomes at every grade 3-8.',
    mathematicalRationale:
      'Pattern work is central at foundational and preparatory stages but is subsumed by algebra later.',
    unresolvedIssue:
      'Double-counting risk: keeping it as a domain AND tagging pattern recognition as CT would count the same evidence twice.',
    recommendedAction: 'stage_specific_only',
    confidence: 'moderate',
    humanReviewRequired: true,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Conclusion \'no separate goal\' holds at both stages, but Middle names patterns explicitly at C-1.2, which the Secondary reading did not surface.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Geometry & Spatial Reasoning',
    domainId: 'GEO',
    currentStatus: 'proposed content domain',
    ncfSeEvidence:
      'MIDDLE (direct): MIDDLE:CG-3 covers 2D/3D properties and includes MIDDLE:C-3.4, compass-and-straightedge construction. Coordinate geometry and trigonometry — cited previously from Secondary CG-4 — do NOT appear at Middle Stage. Meaning changed.',
    parakhEvidence: null,
    cbseEvidence:
      'CG-4 covers 2-D shape properties and mathematical argument, and INCLUDES coordinate geometry (C-4.5) and trigonometry (C-4.6).',
    otherOfficialEvidence:
      'CT&AI CG-2 (Classes 6-8) develops spatial and visual reasoning.',
    mathematicalRationale: 'Spatial reasoning is empirically distinguishable from numeric reasoning.',
    unresolvedIssue:
      'The domain becomes very broad if it spans shape, coordinates and trigonometry. Splitting at secondary may be warranted.',
    recommendedAction: 'retain',
    confidence: 'moderate',
    humanReviewRequired: true,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Secondary CG-4 includes coordinate geometry and trigonometry, neither of which exists at Middle Stage. Middle CG-3 instead names compass-and-straightedge construction (C-3.4), which Pragati has no content for.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Measurement',
    domainId: 'MEA',
    currentStatus: 'proposed content domain',
    ncfSeEvidence:
      'MIDDLE (direct): perimeter and area form a STANDALONE goal MIDDLE:CG-4 (C-4.1..C-4.4), including Baudhayana-Pythagoras, tiling and fractals. Previously treated as a sub-part of geometry on Secondary evidence. Meaning changed.',
    parakhEvidence: null,
    cbseEvidence: 'CG-5 covers area, surface area and volume formulae.',
    otherOfficialEvidence: null,
    mathematicalRationale: 'Unit reasoning and estimation are distinct from computation.',
    unresolvedIssue:
      'At secondary, CG-5 is largely mensuration and may overlap Geometry.',
    recommendedAction: 'retain',
    confidence: 'moderate',
    humanReviewRequired: true,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Perimeter and area is a STANDALONE goal at Middle (CG-4), not a sub-part of geometry, and includes Baudhayana-Pythagoras, tiling and fractals.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Data & Statistics',
    domainId: 'DAT',
    currentStatus: 'proposed content domain (merged with Probability)',
    ncfSeEvidence:
      'MIDDLE (direct): MIDDLE:CG-5 covers data collection, organisation, central tendency and graphical representation — data ONLY. Probability is not specified as a competency anywhere in the MIDDLE:CG-1..MIDDLE:CG-10 block. The prior \'data and probability are one goal\' conclusion came from Secondary CG-6 and does not hold at Middle.',
    parakhEvidence: null,
    cbseEvidence:
      'CG-6 covers data interpretation AND probability as ONE goal, with C-6.1 and C-6.2 as siblings.',
    otherOfficialEvidence:
      'CT&AI Classes 6-8 include data organisation, representation and analysis.',
    mathematicalRationale:
      'Data handling and probability share a reasoning-under-uncertainty core at school level.',
    unresolvedIssue: 'None material.',
    recommendedAction: 'merge',
    confidence: 'high',
    humanReviewRequired: false,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Recorded as sharing a goal with Probability on Secondary CG-6 evidence. At Middle Stage, CG-5 is data only.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Probability',
    domainId: 'PRB',
    currentStatus: 'proposed content domain — recommended for merge',
    ncfSeEvidence:
      'MIDDLE (direct): NCF-SE Middle Stage Mathematics does not explicitly specify probability as a competency in the MIDDLE:CG-1..MIDDLE:CG-10 block. Full-text search of Ganita Prakash Grades 7 and 8 returns zero occurrences of \'probabilit*\'. This is a statement about the Middle CG block and those two textbooks, NOT a claim that probability is absent from Middle Stage education generally.',
    parakhEvidence: null,
    cbseEvidence: 'Part of CG-6, not a separate goal.',
    otherOfficialEvidence: null,
    mathematicalRationale:
      'Distinct mathematically, but at 5% of a 35-item form it yields ~2 items — unreportable even descriptively.',
    unresolvedIssue: 'None material.',
    recommendedAction: 'merge',
    confidence: 'high',
    humanReviewRequired: false,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'NO probability competency exists at Middle Stage. Any Class 6-8 probability claim must be withdrawn, not renumbered.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Mathematical Reasoning & Proof',
    domainId: 'REA',
    currentStatus: 'proposed cross-cutting process',
    ncfSeEvidence:
      'MIDDLE (direct): MIDDLE:CG-6 states mathematical thinking and precise communication as a STANDALONE goal (MIDDLE:C-6.1, inductive and deductive logic). The Middle framework already does what the prior recommendation proposed, so that recommendation needs re-examination rather than carrying forward.',
    parakhEvidence: null,
    cbseEvidence:
      'CG-2 (proof about numbers) and CG-7 (axiomatic structure) — both attached to content, never content-free.',
    otherOfficialEvidence: null,
    mathematicalRationale:
      'Reasoning items detached from content tend to measure test-wiseness.',
    unresolvedIssue:
      'Whether it can be reported as a process dimension at all without dimensionality evidence.',
    recommendedAction: 'reclassify_as_process',
    confidence: 'moderate',
    humanReviewRequired: true,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Recommendation to reclassify as a cross-cutting process was made on Secondary evidence. Middle CG-6 already states reasoning as a standalone goal, so the recommendation needs re-examination rather than carrying forward.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Problem Solving & Modelling',
    domainId: 'MOD',
    currentStatus: 'proposed cross-cutting process',
    ncfSeEvidence:
      'MIDDLE (direct): modelling is NOT a Middle Stage goal — it is Secondary CG-8. Middle Stage instead carries MIDDLE:CG-7, puzzles and own creative strategies (C-7.1, C-7.2), which Pragati has not represented at all. Meaning changed.',
    parakhEvidence: null,
    cbseEvidence: 'CG-8 (modelling, optimisation, representation); CG-11 (cross-subject connections).',
    otherOfficialEvidence: null,
    mathematicalRationale: 'Realised inside content rather than beside it.',
    unresolvedIssue:
      'PARAKH may treat problem solving as a reportable competency; unknown until read.',
    recommendedAction: 'reclassify_as_process',
    confidence: 'low',
    humanReviewRequired: true,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Modelling is a Secondary-only goal (CG-8). Middle Stage instead has CG-7, puzzles and own creative strategies, which Pragati has not represented at all.',
    strongestProvenance: 'directly_inspected_primary',
  },
  {
    construct: 'Computational Thinking',
    domainId: null,
    currentStatus: 'proposed item-level process tag (provisional)',
    ncfSeEvidence:
      'MIDDLE (direct): MIDDLE:CG-8 is computational thinking — decomposition, pattern recognition, data representation, generalisation, abstraction, algorithms (C-8.1, C-8.2). Prior conclusion (first-class goal, missing from Pragati) STANDS. The number was wrong: Middle CG-8, not Secondary CG-9.',
    parakhEvidence: null,
    cbseEvidence: 'CG-9 at secondary: decomposition, algorithms, generalising procedures.',
    otherOfficialEvidence:
      'CT&AI Classes 3-8 Curriculum, read in full: CT is "a cross-cutting theme" across subjects; assessed via projects, journals and observation; 50 h/yr at Classes 3-5 and 100 h/yr at 6-8; resource books aligned chapter-by-chapter to the Mathematics textbook.',
    mathematicalRationale:
      'Selected-response items can evidence decomposition and pattern recognition partially, but a short form cannot support a reported CT score.',
    unresolvedIssue:
      'Heavy official emphasis (100 h/yr) versus inability to report it from a short Mathematics form. Schools may expect to see it.',
    recommendedAction: 'defer',
    confidence: 'moderate',
    humanReviewRequired: true,
    stageReview: 'requires_stage_review',
    stageReviewNote:
      'Finding stands: computational thinking is first-class at both stages. But it is Middle CG-8, not CG-9. Cite the stage.',
    strongestProvenance: 'directly_inspected_primary',
  },
];

/** Constructs whose strongest assessment-design source was never read. */
export function decisionsMissingAssessmentEvidence(): FrameworkDecision[] {
  return FRAMEWORK_DECISIONS.filter((d) => d.parakhEvidence === null);
}

// ---------------------------------------------------------------------------
// §9 — The freeze candidate
// ---------------------------------------------------------------------------

/**
 * v0.56 §3 — An unresolved structural decision.
 *
 * v0.55 marked Rational Number and Computational Thinking `defer` in
 * the matrix and then listed them among `proposedContentDomains` and
 * `proposedProcessTags` anyway. A reviewer reading the candidate would
 * have seen the preferred option already embedded as the structure —
 * which is exactly the leading-the-witness problem the review process
 * exists to avoid.
 *
 * Open decisions are now carried as OPTIONS, not as a resolved shape.
 */
export type StructuralOption = {
  id: string;
  summary: string;
  risks: string[];
};

export type OpenStructuralDecision = {
  decisionId: string;
  construct: string;
  options: StructuralOption[];
  /** Pragati's current lean, clearly labelled as a recommendation and
   *  never as the structure. */
  currentRecommendation: string;
  evidence: string[];
  decisionRequired: string;
};

export const FRAMEWORK_DECISIONS: FrameworkDecision[] =
  withDerivedReview(RAW_FRAMEWORK_DECISIONS);

/**
 * v0.61 §3 — constructs blocking a Middle Stage (Classes 6-8) pilot.
 *
 * Returns the rows that cannot be frozen for a Class 6-8 framework
 * until a reviewer has re-examined them against Middle Stage evidence.
 */
export function middleStageFreezeBlockers(): FrameworkDecision[] {
  return FRAMEWORK_DECISIONS.filter(
    (d) => d.stageReview === 'requires_stage_review'
  );
}

/**
 * May a Classes 6-8 pilot framework be frozen?
 *
 * FOUR conditions, all required:
 *   1. required source evidence present;
 *   2. stage-appropriate framework review completed;
 *   3. human reviewer approval;
 *   4. adjudication of any disagreements.
 *
 * Condition 2 is the one v0.61 added, and it currently fails for every
 * construct. Note the ordering: this returns `false` on stage review
 * BEFORE consulting reviews, so accumulating approvals cannot mask an
 * unresolved stage problem.
 */
export function mayFreezeMiddleStagePilot(args: {
  reviews: DecisionReview[];
  adjudications: Adjudication[];
}): { allowed: false; blockers: string[] } | { allowed: true } {
  const blockers: string[] = [];

  const stageBlocked = middleStageFreezeBlockers();
  if (stageBlocked.length > 0) {
    blockers.push(
      `${stageBlocked.length} construct(s) still require stage review against NCF-SE Middle Stage: ${stageBlocked
        .map((d) => d.construct)
        .join(', ')}`
    );
  }

  const base = mayFreezeFramework({
    decisionIds: FRAMEWORK_DECISIONS.filter((d) => d.humanReviewRequired).map(
      (d) => d.construct
    ),
    reviews: args.reviews,
    adjudications: args.adjudications,
    frameworkVersion: 'middle-stage-pilot-candidate',
  });
  if (!base.allowed) blockers.push(...base.blockers);

  return blockers.length > 0 ? { allowed: false, blockers } : { allowed: true };
}

export const OPEN_STRUCTURAL_DECISIONS: OpenStructuralDecision[] = [
  {
    decisionId: 'rational_number_placement',
    construct: 'Fractions & Rational Number Reasoning',
    options: [
      {
        id: 'A_separate_domain',
        summary: 'A blueprint domain distinct from Number Sense.',
        risks: [
          'Departs from the official structure, which places rational numbers inside CG-1.',
          'Takes blueprint slots from Number Sense.',
          'If the two are not dimensionally separable, the split is measuring one thing twice.',
        ],
      },
      {
        id: 'B_strand_within_number',
        summary: 'A strand inside Number Sense, reported as one domain.',
        risks: [
          'Loses the instructional signal from a well-documented difficulty area.',
          'A teacher cannot see rational-number weakness separately.',
        ],
      },
    ],
    currentRecommendation:
      'Option A, as a Pragati measurement-design choice explicitly labelled as such. LOW confidence.',
    evidence: [
      'CBSE Class IX (official derivative): rational numbers sit within CG-1; no separate goal.',
      'NCF-SE 2023 Middle Stage: READ DIRECTLY (v0.61). MIDDLE:CG-1 ' +
        'places fractions, integers, rational and real numbers inside ' +
        'ONE goal, and MIDDLE:C-1.6 pairs ratios with decimal form in a ' +
        'single competency. This is evidence AGAINST a separate RAT ' +
        'domain, and it was not available when this decision was framed.',
      'PARAKH: NOT READ.',
    ],
    decisionRequired:
      'Should Pragati report Rational Number Reasoning separately from Number Sense?',
  },
  {
    decisionId: 'computational_thinking_representation',
    construct: 'Computational Thinking',
    options: [
      {
        id: 'A_item_process_tag',
        summary: 'Tag items that elicit CT processes; report no CT score.',
        risks: [
          'Schools may expect to see CT given 100 h/yr of official emphasis.',
          'Tags collect data nobody currently uses.',
        ],
      },
      {
        id: 'B_separate_future_construct',
        summary: 'A separate CT instrument or indicator, developed later.',
        risks: [
          'Significant additional development.',
          'Duplicates what CBSE already assesses through projects.',
        ],
      },
      {
        id: 'C_not_represented',
        summary: 'CT is out of scope for short-form Growth entirely.',
        risks: [
          'Discards evidence the items could carry.',
          'Harder to add later if the framework has no hook for it.',
        ],
      },
    ],
    currentRecommendation:
      'Option A. MODERATE confidence. Selected-response items can carry partial CT evidence; what a short form cannot support is a reported CT score.',
    evidence: [
      'CBSE CT&AI Classes 3-8 (directly inspected): CT is a cross-cutting theme; assessed via projects, journals, observation.',
      'CBSE Class IX (official derivative): CG-9 lists CT competencies.',
      'NCF-SE 2023 Middle Stage: READ DIRECTLY (v0.61). MIDDLE:CG-8 is ' +
        'computational thinking as a first-class curricular goal ' +
        '(C-8.1 programmatic/algorithmic thinking, C-8.2 systematic ' +
        'counting and algorithms). Confirms the construct exists ' +
        'officially at Middle Stage; does not settle whether Pragati ' +
        'should REPORT it as a Growth domain.',
      'PARAKH: NOT READ — may treat CT as reportable.',
    ],
    decisionRequired: 'How should Computational Thinking be represented, if at all?',
  },
];

export type FreezeCandidateStatus =
  | 'awaiting_independent_expert_review'
  | 'under_review'
  | 'adjudication_pending'
  | 'approved';

export type FrameworkFreezeCandidate = {
  candidateVersion: string;
  /** Constructs whose structural recommendation is genuinely ready for
   *  review. Deferred constructs are NOT here. */
  resolvedContentDomains: AssessmentDomainId[];
  resolvedProcessTags: string[];
  /** Constructs whose structure is NOT decided, carried as options. */
  openStructuralDecisions: OpenStructuralDecision[];
  progressionVersion: string;
  evidencePackage: string[];
  unresolvedDecisions: string[];
  blueprintImplications: string[];
  /** Always computed. Never assigned. */
  readonly status: FreezeCandidateStatus;
};

/**
 * Build the candidate.
 *
 * `status` is derived from the review workflow, so there is no way to
 * construct an approved candidate without real reviews. Passing
 * persuasive evidence does not help; only reviewers do.
 */
export function buildFreezeCandidate(args: {
  reviews: DecisionReview[];
  adjudications: Adjudication[];
  candidateVersion: string;
}): FrameworkFreezeCandidate {
  const { reviews, adjudications, candidateVersion } = args;

  const decisionIds = FRAMEWORK_DECISIONS.filter((d) => d.humanReviewRequired).map(
    (d) => d.construct
  );

  const freeze = mayFreezeFramework({
    decisionIds,
    reviews,
    adjudications,
    frameworkVersion: candidateVersion,
  });

  const status: FreezeCandidateStatus = freeze.allowed
    ? 'approved'
    : reviews.length === 0
      ? 'awaiting_independent_expert_review'
      : adjudications.length > 0
        ? 'adjudication_pending'
        : 'under_review';

  return {
    candidateVersion,
    // RAT is deliberately ABSENT: its placement is an open decision.
    resolvedContentDomains: ['NUM', 'ALG', 'GEO', 'MEA', 'DAT'],
    // computational_thinking is deliberately ABSENT for the same reason.
    resolvedProcessTags: ['mathematical_reasoning', 'problem_solving_modelling'],
    openStructuralDecisions: OPEN_STRUCTURAL_DECISIONS,
    progressionVersion: 'rational-number-strand-v1',
    evidencePackage: [
      'CBSE Curriculum 2026-27, Mathematics Class IX — read in full.',
      'CBSE Computational Thinking and AI, Classes 3-8 Curriculum 2026-27 — read in full.',
      'NCERT Learning Outcomes at the Secondary Stage (2019) — read in full.',
      // v0.61 §2 — these three lines said NOT READ. Two of them are now
      // false; recording them as read is not a weakening of the
      // evidence standard but a correction of it.
      'NCF-SE 2023 — READ DIRECTLY (v0.61). §3.4.1.2 Middle Stage ' +
        'Mathematics, printed pp. 255-256, transcribed in full. ' +
        'Secondary Stage §3.4.1.3 also read for the crosswalk.',
      'NCERT Ganita Prakash Grade 6 — READ DIRECTLY (v0.61). ' +
        'ISBN 978-93-5292-717-3, Reprint 2026-27. All ten chapters.',
      'NCERT Ganita Prakash Grade 7 — READ DIRECTLY (v0.61). ' +
        'ISBN 978-93-5729-983-1, Reprint 2026-27. All eight chapters.',
      'NCERT Ganita Prakash Grade 8 — READ DIRECTLY (v0.61). ' +
        'ISBN 978-93-5729-642-7, Reprint 2026-27. All seven chapters.',
      'STILL NOT READ: PARAKH Assessment Framework. This remains the ' +
        'strongest unavailable assessment-design evidence and is the ' +
        'principal outstanding Growth blocker.',
      'NOT LOCATED: NCERT Learning Outcomes at the Elementary Stage.',
    ],
    unresolvedDecisions: FRAMEWORK_DECISIONS.filter((d) => d.humanReviewRequired).map(
      (d) => `${d.construct}: ${d.unresolvedIssue}`
    ),
    blueprintImplications: [
      'Six content domains rather than ten gives ~6 items per domain on a 35-item form instead of ~3.5.',
      'Process tags do not consume blueprint slots; they annotate items drawn for content domains.',
      'No domain is reportable as a subscore regardless of blueprint share.',
    ],
    status,
  };
}

/** The current candidate. Unapproved, because nobody has reviewed it. */
export function currentFreezeCandidate(): FrameworkFreezeCandidate {
  return buildFreezeCandidate({
    reviews: [],
    adjudications: [],
    candidateVersion: 'v0.55-candidate',
  });
}
