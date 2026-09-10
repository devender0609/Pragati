// v0.53 §6 + §7 — Curriculum-to-measurement crosswalk.
//
// THE DISTINCTION THIS FILE EXISTS TO PROTECT
//
// Two claims are constantly confused in curriculum-aligned assessment:
//
//   "This competency is mathematically prerequisite to that one."
//        — a claim about mathematics. Pragati can make it and defend it.
//
//   "This competency is officially assigned to Class 6."
//        — a claim about Indian curriculum policy. Pragati may only
//          make it with a citation.
//
// v0.52 recorded both as `sourceEvidence: string[]`, which let them
// blur. Every node below now carries an explicit evidence status for
// EACH claim separately.

/** How well-supported a claim is. */
export type EvidenceStatus =
  /** A primary official document was read and supports this. */
  | 'primary_source_supported'
  /** Follows from mathematics, not from any curriculum document. A
   *  legitimate basis for ordering; NOT a curriculum claim. */
  | 'mathematically_inferred'
  /** Secondary sources agree; no primary document inspected. */
  | 'secondary_supported'
  /** The competency is real but its official grade is unknown. */
  | 'placement_uncertain'
  /** Needs a subject expert before use. */
  | 'expert_review_required';

export type AssessmentSuitability =
  | 'suitable_short_form'
  | 'suitable_with_constraints'
  | 'unsuitable_short_form';

/** A primary source actually inspected. */
export type InspectedSource = {
  organization: string;
  title: string;
  version: string;
  url: string;
  location: string;
  dateInspected: string;
  supportsClaim: string;
  accessible: boolean;
  inaccessibleReason?: string;
};

export const INSPECTED_SOURCES: InspectedSource[] = [
  {
    organization: 'CBSE',
    title: 'Curriculum 2026-27, Mathematics Class IX',
    version: '2026-27',
    url: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf',
    location: 'Section "Curricular Goals (CGs) and Competencies (Cs) from the NCF-SE 2023"',
    dateInspected: '2026-08-18',
    supportsClaim:
      'Secondary-stage Mathematics curricular goals CG-1..CG-11 with competency codes, reproduced from NCF-SE 2023.',
    accessible: true,
  },
  {
    organization: 'CBSE',
    title: 'Computational Thinking and Artificial Intelligence, Classes 3-8 Curriculum',
    version: '2026-27',
    url: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri_2026-27.pdf',
    location: 'Sections 2, 2.1, 3.1, 4, 6, 7, 10.1, 10.2, 10.2.2',
    dateInspected: '2026-08-19',
    supportsClaim:
      'CT is defined as Decomposition, Pattern Recognition, Abstraction, Algorithm Design, Data Analysis and Troubleshooting; is explicitly positioned as a CROSS-CUTTING THEME across subjects rather than a subject domain; is embedded in Mathematics at Classes 3-5 (50 h/yr) and aligned chapter-by-chapter to the Mathematics textbook at Classes 6-8 (100 h/yr); and is assessed through projects, journals and observation rather than short-form testing.',
    accessible: true,
  },
  {
    organization: 'PARAKH / NCERT',
    title: 'Assessment Framework, PARAKH Rashtriya Sarvekshan',
    version: '07-11-2024',
    url: 'https://parakh.ncert.gov.in/themes/parakh/prs-files/Assessment_Framework_PARAKH_Rashtriya_Sarvekshan_07-11-2024.pdf',
    location: 'Whole document',
    dateInspected: '2026-08-19',
    supportsClaim: 'NOT INSPECTED — see inaccessibleReason.',
    accessible: false,
    inaccessibleReason:
      'The document is reachable but exceeds the 30 MB fetch limit of this environment. This is a SIZE limit, not an access block: a human can open the URL directly. Requesting the human supply this PDF, or a page range covering the Mathematics competency definitions for the Preparatory and Middle stages.',
  },
  {
    organization: 'NCERT',
    title: 'National Curriculum Framework for School Education 2023',
    version: '2023',
    url: 'https://ncert.nic.in/ (framework document)',
    location: 'Mathematics learning standards, reported as pp. 181-187',
    dateInspected: '2026-08-19',
    supportsClaim: 'NOT INSPECTED — see inaccessibleReason.',
    accessible: false,
    inaccessibleReason:
      'ncert.nic.in serves robots.txt rules blocking automated retrieval. The CG list is available second-hand through the CBSE Class IX curriculum, which reproduces it verbatim. A human should confirm against the primary document.',
  },
];

export function inaccessibleSources(): InspectedSource[] {
  return INSPECTED_SOURCES.filter((s) => !s.accessible);
}

// ---------------------------------------------------------------------------
// §7 — Crosswalk
// ---------------------------------------------------------------------------

export type MappingKind =
  | 'exact'
  | 'partial'
  | 'inferred_prerequisite'
  | 'cross_grade_extension'
  | 'no_direct_curriculum_mapping';

export type CrosswalkRow = {
  pragatiCompetencyId: string;
  progressionNodeId: string;
  /** Null where no official curricular competency corresponds. */
  officialSourceTitle: string | null;
  officialReference: string | null;
  mappingKind: MappingKind;
  /** Evidence for the MATHEMATICAL ordering claim. */
  dependencyEvidence: EvidenceStatus;
  /** Evidence for the OFFICIAL GRADE PLACEMENT claim. Kept separate on
   *  purpose — these are different assertions. */
  placementEvidence: EvidenceStatus;
  proposedAssessmentEvidence: string;
  assessmentSuitability: AssessmentSuitability;
  expertReviewRequired: boolean;
  notes: string;
};

/**
 * Every node of the pilot Rational Number strand, reviewed.
 *
 * Note the pattern: dependency evidence is usually
 * `mathematically_inferred` and that is FINE — mathematics is a
 * legitimate basis for ordering. Placement evidence is mostly
 * `placement_uncertain`, because the middle-stage Mathematics content
 * syllabus needed to fix grade placement has not been located.
 */
export const RATIONAL_NUMBER_CROSSWALK: CrosswalkRow[] = [
  {
    pragatiCompetencyId: 'RAT.EQUIPART',
    progressionNodeId: 'node.0',
    officialSourceTitle: null,
    officialReference: null,
    mappingKind: 'inferred_prerequisite',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'placement_uncertain',
    proposedAssessmentEvidence:
      'Identifies whether a region is partitioned into equal parts; partitions into a stated number of equal parts.',
    assessmentSuitability: 'suitable_short_form',
    expertReviewRequired: true,
    notes:
      'Foundational-stage competency. No inspected source names it; it is a mathematical prerequisite for fraction notation.',
  },
  {
    pragatiCompetencyId: 'RAT.UNITFRAC',
    progressionNodeId: 'node.1',
    officialSourceTitle: null,
    officialReference: null,
    mappingKind: 'inferred_prerequisite',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'placement_uncertain',
    proposedAssessmentEvidence:
      'Names the unit fraction shown by a partitioned region; shades a stated unit fraction.',
    assessmentSuitability: 'suitable_short_form',
    expertReviewRequired: true,
    notes: 'Preparatory stage. Placement needs NCERT Learning Outcomes.',
  },
  {
    pragatiCompetencyId: 'RAT.REPRESENT',
    progressionNodeId: 'node.2',
    officialSourceTitle: 'NCERT Ganita Prakash Grade 6',
    officialReference: 'Chapter 7, Fractions',
    mappingKind: 'partial',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'secondary_supported',
    proposedAssessmentEvidence:
      'Matches a fraction across region, set, and number-line models; places a fraction on a number line.',
    assessmentSuitability: 'suitable_short_form',
    expertReviewRequired: true,
    notes:
      'Chapter title corroborated by secondary sources only; the primary textbook remains unread.',
  },
  {
    pragatiCompetencyId: 'RAT.EQUIV',
    progressionNodeId: 'node.3',
    officialSourceTitle: 'NCERT Ganita Prakash Grade 6',
    officialReference: 'Chapter 7, Fractions',
    mappingKind: 'partial',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'secondary_supported',
    proposedAssessmentEvidence:
      'Generates an equivalent fraction; explains equivalence via a model or common factor.',
    assessmentSuitability: 'suitable_short_form',
    expertReviewRequired: true,
    notes: 'Central to the strand; the highest-priority node for expert review.',
  },
  {
    pragatiCompetencyId: 'RAT.COMPARE',
    progressionNodeId: 'node.4',
    officialSourceTitle: 'NCERT Ganita Prakash Grade 6',
    officialReference: 'Chapter 7, Fractions',
    mappingKind: 'partial',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'secondary_supported',
    proposedAssessmentEvidence:
      'Orders three fractions with unlike denominators; justifies using benchmarks or equivalence.',
    assessmentSuitability: 'suitable_short_form',
    expertReviewRequired: true,
    notes: '',
  },
  {
    pragatiCompetencyId: 'RAT.UNLIKE',
    progressionNodeId: 'node.5',
    officialSourceTitle: 'NCERT Ganita Prakash Grade 6',
    officialReference: 'Chapter 7, Fractions',
    mappingKind: 'partial',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'secondary_supported',
    proposedAssessmentEvidence:
      'Computes a sum or difference across unlike denominators; identifies the denominator-addition error.',
    assessmentSuitability: 'suitable_short_form',
    expertReviewRequired: true,
    notes: '',
  },
  {
    pragatiCompetencyId: 'RAT.DECIMAL',
    progressionNodeId: 'node.6',
    officialSourceTitle: 'NCERT Ganita Prakash Grade 7 Part 1',
    officialReference: 'Chapter 3, A Peek Beyond the Point',
    mappingKind: 'cross_grade_extension',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'secondary_supported',
    proposedAssessmentEvidence:
      'Converts between fraction and decimal; orders a mixed set of fractions and decimals.',
    assessmentSuitability: 'suitable_short_form',
    expertReviewRequired: true,
    notes:
      "IMPORTANT: Pragati's legacy Class 6 decimals module has no Class 6 chapter in the current textbook. This node places the competency at Class 7, where the current books appear to treat it. Grade 7 chapter list is DISPUTED between secondary sources.",
  },
  {
    pragatiCompetencyId: 'RAT.MULDIV',
    progressionNodeId: 'node.7',
    officialSourceTitle: 'NCERT Ganita Prakash Grade 7 Part 1',
    officialReference: 'Chapter 8, Working with Fractions',
    mappingKind: 'cross_grade_extension',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'secondary_supported',
    proposedAssessmentEvidence:
      'Computes a product or quotient of fractions; interprets a fraction quotient in context.',
    assessmentSuitability: 'suitable_short_form',
    expertReviewRequired: true,
    notes: '',
  },
  {
    pragatiCompetencyId: 'RAT.RATIO',
    progressionNodeId: 'node.8',
    officialSourceTitle: null,
    officialReference: null,
    mappingKind: 'no_direct_curriculum_mapping',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'placement_uncertain',
    proposedAssessmentEvidence:
      'Writes a ratio for a described situation; distinguishes ratio from additive comparison.',
    assessmentSuitability: 'suitable_with_constraints',
    expertReviewRequired: true,
    notes:
      'Ratio and Proportion was a Class 6 chapter in the OLD textbook and has no standalone chapter in Ganita Prakash Class 6. Where it now sits is unknown without the middle-stage syllabus. Contextual items carry reading load — constrain language.',
  },
  {
    pragatiCompetencyId: 'RAT.PROPORTION',
    progressionNodeId: 'node.9',
    officialSourceTitle: null,
    officialReference: null,
    mappingKind: 'no_direct_curriculum_mapping',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'placement_uncertain',
    proposedAssessmentEvidence:
      'Solves a missing-value proportion problem; recognises a non-proportional situation.',
    assessmentSuitability: 'suitable_with_constraints',
    expertReviewRequired: true,
    notes: 'Recognising NON-proportional situations is the discriminating evidence.',
  },
  {
    pragatiCompetencyId: 'RAT.PERCENT',
    progressionNodeId: 'node.10',
    officialSourceTitle: null,
    officialReference: null,
    mappingKind: 'no_direct_curriculum_mapping',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'placement_uncertain',
    proposedAssessmentEvidence:
      'Converts among percentage, fraction and decimal; computes a percentage change in context.',
    assessmentSuitability: 'suitable_with_constraints',
    expertReviewRequired: true,
    notes: '',
  },
  {
    pragatiCompetencyId: 'RAT.ALGPROP',
    progressionNodeId: 'node.11',
    officialSourceTitle: 'CBSE Curriculum 2026-27, Mathematics Class IX',
    officialReference: 'CG-3 / C-3.2 (models situations as equations); CG-8 / C-8.1',
    mappingKind: 'partial',
    dependencyEvidence: 'mathematically_inferred',
    placementEvidence: 'primary_source_supported',
    proposedAssessmentEvidence:
      'Writes an equation for a proportional relationship; distinguishes direct from inverse proportion.',
    assessmentSuitability: 'suitable_short_form',
    expertReviewRequired: true,
    notes:
      'The ONLY node with primary-source placement evidence, because the secondary-stage syllabus was read in full.',
  },
];

export function crosswalkFor(competencyId: string): CrosswalkRow | null {
  return (
    RATIONAL_NUMBER_CROSSWALK.find((r) => r.pragatiCompetencyId === competencyId) ??
    null
  );
}

/** Nodes whose official grade placement is not evidenced. Surfaced in
 *  Admin & Research so the gap is visible rather than implied. */
export function nodesWithUncertainPlacement(): CrosswalkRow[] {
  return RATIONAL_NUMBER_CROSSWALK.filter(
    (r) => r.placementEvidence === 'placement_uncertain'
  );
}

/** A grade claim may only be made from primary evidence. */
export function mayClaimOfficialGradePlacement(row: CrosswalkRow): boolean {
  return row.placementEvidence === 'primary_source_supported';
}

// ---------------------------------------------------------------------------
// §4 — Computational Thinking: the decision, with its evidence
// ---------------------------------------------------------------------------

export type ConstructClassification =
  | 'content_domain'
  | 'cross_cutting_process'
  | 'stage_specific_domain'
  | 'item_level_process_tag'
  | 'excluded_from_short_interim';

export type ConstructDecision = {
  construct: string;
  classification: ConstructClassification;
  rationale: string;
  evidence: string[];
  expertReviewRequired: boolean;
};

export const CONSTRUCT_DECISIONS: ConstructDecision[] = [
  {
    construct: 'Computational Thinking',
    // NOT a Mathematics reporting domain, despite being a curricular goal.
    classification: 'item_level_process_tag',
    rationale:
      'CBSE defines CT as a cross-cutting theme integrated across ALL subjects, not a Mathematics domain. Reporting a "Computational Thinking" score inside a Mathematics assessment would attribute a cross-subject capability to one subject. Its official assessment methods — projects, reflective journals, teacher observation — are also incompatible with a short adaptive form. Tagging items that genuinely elicit decomposition, pattern recognition, abstraction or algorithmic thinking preserves the information for later study without making an unsupported reporting claim.',
    evidence: [
      'CBSE CT&AI Classes 3-8 Curriculum 2026-27, §2: "envisages integrating CT across school subjects, including beyond Mathematics, as a cross-cutting theme".',
      'Ibid. §3.1: learning standards "designed as foundational capacities that cut across disciplines".',
      'Ibid. §9.2: assessment via projects, reflective journals, observation — not short-form testing.',
      'Ibid. §10.2.2: the CT resource book parallels the Mathematics textbook chapter by chapter, i.e. CT is delivered THROUGH Mathematics content.',
    ],
    expertReviewRequired: true,
  },
  {
    construct: 'Patterns & Relationships',
    classification: 'item_level_process_tag',
    rationale:
      'Pattern Recognition is named as one of the six CT elements and appears as a CT learning outcome at every grade from 3 to 8. It has no separate Mathematics curricular goal at secondary. Retaining it as a reporting domain would double-count it against CT and produce a ~2-item domain on a 35-item form.',
    evidence: [
      'CBSE CT&AI Curriculum §4: CT comprises "Decomposition, Pattern Recognition, Abstraction, Algorithm Design, Data Analysis, and Troubleshooting".',
      'CBSE Class IX Mathematics: sequences and progressions map to CG-11/C-8.1, i.e. through algebra and modelling.',
    ],
    expertReviewRequired: true,
  },
  {
    construct: 'Mathematical Reasoning & Proof',
    classification: 'cross_cutting_process',
    rationale:
      'NCF-SE presents reasoning through content: CG-2 attaches it to numbers, CG-7 to geometry and algebraic identities. Content-free reasoning items tend to become puzzles that measure test-wiseness.',
    evidence: [
      'CBSE Class IX Mathematics, CG-2 and CG-7 — both content-anchored.',
    ],
    expertReviewRequired: true,
  },
  {
    construct: 'Problem Solving & Modelling',
    classification: 'cross_cutting_process',
    rationale:
      'CG-8 is a genuine curricular goal but is realised inside content domains, and CG-11 explicitly frames it as cross-subject.',
    evidence: ['CBSE Class IX Mathematics, CG-8 and CG-11.'],
    expertReviewRequired: true,
  },
  {
    construct: 'Data, Statistics & Probability',
    classification: 'content_domain',
    rationale:
      'NCF-SE treats data and probability as ONE curricular goal (CG-6) with C-6.1 and C-6.2 as siblings. Pragati previously split them into two domains weighted 10% and 5%, which on a 35-item form yields roughly 3 and 2 items — too few to report separately.',
    evidence: ['CBSE Class IX Mathematics, CG-6 with C-6.1 and C-6.2.'],
    expertReviewRequired: false,
  },
  {
    construct: 'Fractions & Rational Number Reasoning',
    classification: 'content_domain',
    rationale:
      'THIS IS A PRAGATI MEASUREMENT-DESIGN DISTINCTION, NOT AN OFFICIAL CURRICULUM DISTINCTION. NCF-SE places rational numbers inside the number goal (CG-1) and gives them no separate goal. Pragati separates them because rational-number reasoning has a long, well-documented developmental progression and is a persistent difficulty area, which makes it instructionally useful to report. The separation must never be described as curriculum alignment.',
    evidence: [
      'CBSE Class IX Mathematics, CG-1: numbers "natural, whole, integer, rational, irrational, and real" in one goal.',
    ],
    expertReviewRequired: true,
  },
];

export function decisionFor(construct: string): ConstructDecision | null {
  return CONSTRUCT_DECISIONS.find((d) => d.construct === construct) ?? null;
}
