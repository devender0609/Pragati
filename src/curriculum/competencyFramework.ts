// v0.51 §4 — Assessment competency framework.
//
// WHY THIS IS SEPARATE FROM TEXTBOOK CHAPTERS
//
// v0.50 measured against chapters. That cannot support growth
// measurement, for a structural reason: chapters are a publishing
// artifact, not a measurement construct. NCERT demonstrated this by
// replacing the Class 6 book — "Ratio and Proportion" stopped being a
// Class 6 chapter, but proportional reasoning did not stop being a
// competency children develop. If the measurement framework is the
// table of contents, every textbook revision invalidates the scale.
//
// So competencies are the stable spine, and chapters map INTO them.
//
// PROVENANCE OF THIS DOMAIN LIST
//
// The ten domains below are a DRAFT informed by the structure visible
// in the current NCERT Ganita Prakash books and the NCF-SE 2023
// framing. They have NOT been validated against the primary NCF-SE
// 2023 document or the PARAKH assessment framework — see
// `frameworkSourceStatus` below, which records exactly that.
//
// Do not present this list as an official Indian curriculum framework.

import type { Grade } from '../types';

export type FrameworkStatus =
  | 'draft_internal'
  | 'source_informed'
  | 'expert_reviewed'
  | 'operational';

/** What evidence actually stands behind the framework right now. */
export const frameworkSourceStatus = {
  status: 'draft_internal' as FrameworkStatus,
  reviewedAgainst: [
    'NCERT Ganita Prakash Grade 6 chapter structure (secondary sources)',
    'NCERT Ganita Prakash Grade 7 Part 1 chapter structure (secondary sources)',
  ],
  notReviewedAgainst: [
    'NCF-SE 2023 primary document',
    'PARAKH National Assessment Framework',
    'CBSE competency-based education framework',
    'NCERT Learning Outcomes documents',
  ],
  note:
    'This is an internal draft. The domain list is defensible mathematically but has NOT been checked against the primary Indian curriculum-framework documents. Doing so is the first task of v0.52.',
} as const;

export type AssessmentDomainId =
  | 'NUM'
  | 'RAT'
  | 'ALG'
  | 'PAT'
  | 'GEO'
  | 'MEA'
  | 'DAT'
  | 'PRB'
  | 'REA'
  | 'MOD';

export type AssessmentDomain = {
  id: AssessmentDomainId;
  title: string;
  /** Student-facing name. Never shown with the code. */
  studentTitle: string;
  description: string;
  /** Stages where this domain carries assessable content. */
  stages: Array<'foundational' | 'preparatory' | 'middle' | 'secondary'>;
};

export const ASSESSMENT_DOMAINS: AssessmentDomain[] = [
  {
    id: 'NUM',
    title: 'Number Sense & Operations',
    studentTitle: 'Numbers',
    description:
      'Counting, place value, the four operations, estimation, and number properties over whole numbers and integers.',
    stages: ['foundational', 'preparatory', 'middle', 'secondary'],
  },
  {
    id: 'RAT',
    title: 'Fractions & Rational Number Reasoning',
    studentTitle: 'Fractions',
    description:
      'Part-whole and measure interpretations of fractions, equivalence, ordering, operations, decimals, ratio, proportion, and percentage as a connected strand.',
    stages: ['preparatory', 'middle', 'secondary'],
  },
  {
    id: 'ALG',
    title: 'Algebraic Thinking',
    studentTitle: 'Algebra',
    description:
      'Generalisation, expressions with letter-numbers, equations, and functional relationships.',
    stages: ['preparatory', 'middle', 'secondary'],
  },
  {
    id: 'PAT',
    title: 'Patterns & Relationships',
    studentTitle: 'Patterns',
    description:
      'Recognising, extending, and explaining numeric and visual patterns, and relating sequences to structure.',
    stages: ['foundational', 'preparatory', 'middle'],
  },
  {
    id: 'GEO',
    title: 'Geometry & Spatial Reasoning',
    studentTitle: 'Shapes and space',
    description:
      'Shapes, lines, angles, symmetry, constructions, coordinates, and spatial visualisation.',
    stages: ['foundational', 'preparatory', 'middle', 'secondary'],
  },
  {
    id: 'MEA',
    title: 'Measurement',
    studentTitle: 'Measuring',
    description:
      'Length, perimeter, area, volume, time, money, and unit reasoning.',
    stages: ['foundational', 'preparatory', 'middle', 'secondary'],
  },
  {
    id: 'DAT',
    title: 'Data & Statistics',
    studentTitle: 'Data',
    description:
      'Collecting, organising, representing, and interpreting data; measures of centre and spread.',
    stages: ['foundational', 'preparatory', 'middle', 'secondary'],
  },
  {
    id: 'PRB',
    title: 'Probability',
    studentTitle: 'Chance',
    description:
      'Likelihood, sample space, and quantifying uncertainty.',
    stages: ['middle', 'secondary'],
  },
  {
    id: 'REA',
    title: 'Mathematical Reasoning',
    studentTitle: 'Reasoning',
    description:
      'Justification, counterexamples, conjecture, and proof-like argument appropriate to stage.',
    stages: ['preparatory', 'middle', 'secondary'],
  },
  {
    id: 'MOD',
    title: 'Problem Solving & Modelling',
    studentTitle: 'Solving problems',
    description:
      'Representing situations mathematically, multi-step problems, and evaluating the reasonableness of results.',
    stages: ['foundational', 'preparatory', 'middle', 'secondary'],
  },
];

export type CompetencyStatus =
  | 'draft'
  | 'reviewed'
  | 'assessment_ready';

export type Competency = {
  /** Stable ID. Survives textbook revisions — that is the point. */
  id: string;
  domainId: AssessmentDomainId;
  title: string;
  /** Student-facing phrasing. Used anywhere a child can see it. */
  studentTitle: string;
  description: string;
  stage: 'foundational' | 'preparatory' | 'middle' | 'secondary';
  /** Grades where this is typically assessable. A RANGE, not a single
   *  grade — that is what makes cross-grade adaptive testing possible. */
  gradeRange: { from: Grade; to: Grade };
  prerequisiteIds: string[];
  successorIds: string[];
  /** Official chapter IDs that teach this. Many-to-many on purpose. */
  curriculumMappings: string[];
  /** What a student must do for us to accept the competency as shown. */
  evidenceRequirements: string[];
  status: CompetencyStatus;
  /** Where the mapping claim comes from. Empty = unevidenced. */
  sourceEvidence: string[];
};

export function domainById(id: AssessmentDomainId): AssessmentDomain {
  const d = ASSESSMENT_DOMAINS.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown assessment domain: ${id}`);
  return d;
}

/** Student-facing domain name. Codes never reach a child. */
export function studentDomainName(id: AssessmentDomainId): string {
  return domainById(id).studentTitle;
}
