// v0.51 §5 — Pilot cross-grade learning progression.
//
// THE PROBLEM THIS SOLVES
//
// v0.50's Class 6 student could only meet Class 6 items. A student two
// years behind hit a floor of items that were all too hard, and one
// two years ahead hit a ceiling — in both cases the session says
// "everything wrong" or "everything right", which carries almost no
// information. Growth measurement needs a ladder that continues past
// the grade boundary in both directions.
//
// This file models ONE strand end to end, to prove the architecture
// before the other nine domains are built:
//
//   RAT — Fractions & Rational Number Reasoning
//
// Chosen because Pragati already has substantial Fractions material, so
// the strand can be populated with real content rather than
// placeholders.
//
// PROVENANCE, STATED PLAINLY
//
// The ORDER of these nodes is a mathematical-dependency claim: you
// cannot compare unlike denominators before you can generate
// equivalent fractions. That ordering is defensible on mathematical
// grounds and is the author's judgement.
//
// The GRADE PLACEMENTS are informed by the Ganita Prakash structure
// (Class 6 Ch 7 "Fractions"; Class 7 Part 1 Ch 3 "A Peek Beyond the
// Point" and Ch 8 "Working with Fractions") as reported by secondary
// sources. They have NOT been checked against the primary textbooks or
// against NCERT Learning Outcomes. Treat placements as provisional.

import type { Grade } from '../types';
import type { Competency } from './competencyFramework';

export type ProgressionNode = {
  competencyId: string;
  /** Position in the strand. Lower runs earlier. Not a difficulty
   *  parameter — it is a dependency ordering. */
  sequence: number;
  prerequisiteIds: string[];
  successorIds: string[];
  /** Where this typically sits. Provisional; see file header. */
  typicalGrade: Grade;
  /** The full band where it may legitimately be assessed. This is what
   *  lets an adaptive session cross grade boundaries. */
  assessableFrom: Grade;
  assessableTo: Grade;
  officialReferences: string[];
};

const G = (n: number): Grade => `class${n}` as Grade;

/**
 * The rational-number strand, from whole-number foundations through to
 * algebraic proportionality.
 */
export const RATIONAL_NUMBER_STRAND: Competency[] = [
  {
    id: 'RAT.EQUIPART',
    domainId: 'RAT',
    title: 'Equal partitioning of a whole',
    studentTitle: 'Sharing things equally',
    description:
      'Split a whole into equal parts and recognise that the parts must be equal for the fraction language to apply.',
    stage: 'foundational',
    gradeRange: { from: G(2), to: G(4) },
    prerequisiteIds: [],
    successorIds: ['RAT.UNITFRAC'],
    curriculumMappings: [],
    evidenceRequirements: [
      'Identifies whether a partition is into equal parts.',
      'Partitions a region or set into a stated number of equal parts.',
    ],
    status: 'draft',
    sourceEvidence: [],
  },
  {
    id: 'RAT.UNITFRAC',
    domainId: 'RAT',
    title: 'Unit fractions and fraction notation',
    studentTitle: 'One part of a whole',
    description:
      'Read, write, and interpret unit fractions; connect notation to a partitioned model.',
    stage: 'preparatory',
    gradeRange: { from: G(3), to: G(5) },
    prerequisiteIds: ['RAT.EQUIPART'],
    successorIds: ['RAT.REPRESENT'],
    curriculumMappings: [],
    evidenceRequirements: [
      'Names the fraction shown by a partitioned region.',
      'Shades a region to show a stated unit fraction.',
    ],
    status: 'draft',
    sourceEvidence: [],
  },
  {
    id: 'RAT.REPRESENT',
    domainId: 'RAT',
    title: 'Represent and interpret non-unit fractions',
    studentTitle: 'Showing fractions',
    description:
      'Interpret a/b across region, set, and number-line representations.',
    stage: 'preparatory',
    gradeRange: { from: G(4), to: G(6) },
    prerequisiteIds: ['RAT.UNITFRAC'],
    successorIds: ['RAT.EQUIV'],
    curriculumMappings: ['ncert_gp_c6_ch07_fractions'],
    evidenceRequirements: [
      'Matches a fraction to a region, set, and number-line model.',
      'Places a fraction on a number line between 0 and 1.',
    ],
    status: 'draft',
    sourceEvidence: [
      'Ganita Prakash Grade 6, Chapter 7 "Fractions" (secondary-source chapter list).',
    ],
  },
  {
    id: 'RAT.EQUIV',
    domainId: 'RAT',
    title: 'Equivalent fractions',
    studentTitle: 'Fractions that are the same size',
    description:
      'Generate and recognise equivalent fractions; reduce to simplest form.',
    stage: 'middle',
    gradeRange: { from: G(5), to: G(7) },
    prerequisiteIds: ['RAT.REPRESENT'],
    successorIds: ['RAT.COMPARE', 'RAT.UNLIKE'],
    curriculumMappings: ['ncert_gp_c6_ch07_fractions'],
    evidenceRequirements: [
      'Produces an equivalent fraction for a given fraction.',
      'Explains why two fractions are equivalent using a model or common factor.',
    ],
    status: 'draft',
    sourceEvidence: [
      'Ganita Prakash Grade 6, Chapter 7 "Fractions" (secondary-source chapter list).',
    ],
  },
  {
    id: 'RAT.COMPARE',
    domainId: 'RAT',
    title: 'Compare and order fractions',
    studentTitle: 'Which fraction is bigger?',
    description:
      'Order fractions with like and unlike denominators using reasoning rather than only procedure.',
    stage: 'middle',
    gradeRange: { from: G(5), to: G(8) },
    prerequisiteIds: ['RAT.EQUIV'],
    successorIds: ['RAT.DECIMAL'],
    curriculumMappings: ['ncert_gp_c6_ch07_fractions'],
    evidenceRequirements: [
      'Orders three fractions with unlike denominators.',
      'Justifies a comparison using benchmarks or equivalence.',
    ],
    status: 'draft',
    sourceEvidence: [
      'Ganita Prakash Grade 6, Chapter 7 "Fractions" (secondary-source chapter list).',
    ],
  },
  {
    id: 'RAT.UNLIKE',
    domainId: 'RAT',
    title: 'Add and subtract fractions with unlike denominators',
    studentTitle: 'Adding different fractions',
    description:
      'Operate on fractions requiring a common denominator, with meaning attached to the procedure.',
    stage: 'middle',
    gradeRange: { from: G(6), to: G(8) },
    prerequisiteIds: ['RAT.EQUIV'],
    successorIds: ['RAT.MULDIV'],
    curriculumMappings: ['ncert_gp_c6_ch07_fractions'],
    evidenceRequirements: [
      'Computes a sum or difference with unlike denominators.',
      'Identifies the error in a worked example that adds denominators.',
    ],
    status: 'draft',
    sourceEvidence: [
      'Ganita Prakash Grade 6, Chapter 7 "Fractions" (secondary-source chapter list).',
    ],
  },
  {
    id: 'RAT.DECIMAL',
    domainId: 'RAT',
    title: 'Decimal representation of rational numbers',
    studentTitle: 'Decimals',
    description:
      'Connect fractions and decimals; place value beyond the decimal point.',
    stage: 'middle',
    gradeRange: { from: G(6), to: G(8) },
    prerequisiteIds: ['RAT.COMPARE'],
    successorIds: ['RAT.RATIO'],
    curriculumMappings: ['ncert_gp_c7_p1_ch03_peek_beyond_point'],
    evidenceRequirements: [
      'Converts between a fraction and its decimal form.',
      'Orders a mixed set of fractions and decimals.',
    ],
    status: 'draft',
    sourceEvidence: [
      'Ganita Prakash Grade 7 Part 1, Chapter 3 "A Peek Beyond the Point" (secondary-source chapter list). NOTE: Pragati\'s legacy Class 6 "decimals" module has no Class 6 chapter in the current textbook; this strand places the competency at Class 7, which is where the current books treat it.',
    ],
  },
  {
    id: 'RAT.MULDIV',
    domainId: 'RAT',
    title: 'Multiply and divide fractions',
    studentTitle: 'Multiplying and dividing fractions',
    description:
      'Operate multiplicatively on fractions with meaning, including division as measurement.',
    stage: 'middle',
    gradeRange: { from: G(7), to: G(9) },
    prerequisiteIds: ['RAT.UNLIKE'],
    successorIds: ['RAT.RATIO'],
    curriculumMappings: ['ncert_gp_c7_p1_ch08_working_with_fractions'],
    evidenceRequirements: [
      'Computes a product or quotient of fractions.',
      'Interprets what a fraction quotient means in context.',
    ],
    status: 'draft',
    sourceEvidence: [
      'Ganita Prakash Grade 7 Part 1, Chapter 8 "Working with Fractions" (secondary-source chapter list).',
    ],
  },
  {
    id: 'RAT.RATIO',
    domainId: 'RAT',
    title: 'Ratio as a multiplicative comparison',
    studentTitle: 'Comparing amounts',
    description:
      'Express and reason about ratios; distinguish ratio from difference comparison.',
    stage: 'middle',
    gradeRange: { from: G(7), to: G(9) },
    prerequisiteIds: ['RAT.DECIMAL', 'RAT.MULDIV'],
    successorIds: ['RAT.PROPORTION'],
    curriculumMappings: [],
    evidenceRequirements: [
      'Writes a ratio for a described situation.',
      'Distinguishes a ratio comparison from an additive one.',
    ],
    status: 'draft',
    sourceEvidence: [],
  },
  {
    id: 'RAT.PROPORTION',
    domainId: 'RAT',
    title: 'Proportional reasoning',
    studentTitle: 'Scaling up and down',
    description:
      'Solve missing-value and comparison problems using proportional relationships.',
    stage: 'middle',
    gradeRange: { from: G(7), to: G(10) },
    prerequisiteIds: ['RAT.RATIO'],
    successorIds: ['RAT.PERCENT'],
    curriculumMappings: [],
    evidenceRequirements: [
      'Solves a missing-value proportion problem.',
      'Recognises when a situation is NOT proportional.',
    ],
    status: 'draft',
    sourceEvidence: [],
  },
  {
    id: 'RAT.PERCENT',
    domainId: 'RAT',
    title: 'Percentage as a rate per hundred',
    studentTitle: 'Percentages',
    description:
      'Connect percentage to fraction and decimal forms; apply to increase, decrease, and comparison.',
    stage: 'middle',
    gradeRange: { from: G(7), to: G(10) },
    prerequisiteIds: ['RAT.PROPORTION'],
    successorIds: ['RAT.ALGPROP'],
    curriculumMappings: [],
    evidenceRequirements: [
      'Converts between percentage, fraction, and decimal.',
      'Computes a percentage increase or decrease in context.',
    ],
    status: 'draft',
    sourceEvidence: [],
  },
  {
    id: 'RAT.ALGPROP',
    domainId: 'RAT',
    title: 'Algebraic proportionality',
    studentTitle: 'Direct and inverse relationships',
    description:
      'Represent proportional relationships as y = kx, and recognise inverse proportion.',
    stage: 'secondary',
    gradeRange: { from: G(8), to: G(10) },
    prerequisiteIds: ['RAT.PERCENT'],
    successorIds: [],
    curriculumMappings: [],
    evidenceRequirements: [
      'Writes an equation for a proportional relationship.',
      'Distinguishes direct from inverse proportion.',
    ],
    status: 'draft',
    sourceEvidence: [],
  },
];

export const PROGRESSION_NODES: ProgressionNode[] =
  RATIONAL_NUMBER_STRAND.map((c, i) => ({
    competencyId: c.id,
    sequence: i,
    prerequisiteIds: c.prerequisiteIds,
    successorIds: c.successorIds,
    typicalGrade: c.gradeRange.from,
    assessableFrom: c.gradeRange.from,
    assessableTo: c.gradeRange.to,
    officialReferences: c.curriculumMappings,
  }));

export function competencyById(id: string): Competency | null {
  return RATIONAL_NUMBER_STRAND.find((c) => c.id === id) ?? null;
}

/**
 * Competencies assessable for a student in a given grade.
 *
 * This is the function that makes cross-grade adaptive testing
 * possible: a Class 6 student is eligible for anything whose
 * assessable band contains Class 6, which spans Class 2 material
 * through Class 8 material. That range is what lets a session find a
 * struggling student's actual level instead of bottoming out.
 */
export function competenciesAssessableAt(grade: Grade): Competency[] {
  const n = Number(grade.replace('class', ''));
  return RATIONAL_NUMBER_STRAND.filter((c) => {
    const from = Number(c.gradeRange.from.replace('class', ''));
    const to = Number(c.gradeRange.to.replace('class', ''));
    return n >= from && n <= to;
  });
}

/** Walk back through prerequisites — the route a struggling student's
 *  session should take. */
export function prerequisiteChain(id: string): string[] {
  const out: string[] = [];
  let cursor = competencyById(id);
  while (cursor && cursor.prerequisiteIds.length > 0) {
    const prev = cursor.prerequisiteIds[0];
    out.push(prev);
    cursor = competencyById(prev);
  }
  return out;
}

/** Validate the strand's internal consistency. Run as a test. */
export function validateStrand(strand: Competency[]): string[] {
  const errors: string[] = [];
  const ids = new Set(strand.map((c) => c.id));
  for (const c of strand) {
    for (const p of c.prerequisiteIds) {
      if (!ids.has(p)) errors.push(`${c.id}: unknown prerequisite ${p}`);
    }
    for (const s of c.successorIds) {
      if (!ids.has(s)) errors.push(`${c.id}: unknown successor ${s}`);
    }
    const from = Number(c.gradeRange.from.replace('class', ''));
    const to = Number(c.gradeRange.to.replace('class', ''));
    if (from > to) errors.push(`${c.id}: grade range is inverted`);
    if (c.status !== 'draft' && c.sourceEvidence.length === 0) {
      errors.push(
        `${c.id}: status '${c.status}' claims review but has no source evidence`
      );
    }
  }
  // Prerequisites must run earlier in the sequence than their dependants.
  const order = new Map(strand.map((c, i) => [c.id, i]));
  for (const c of strand) {
    for (const p of c.prerequisiteIds) {
      const pi = order.get(p);
      const ci = order.get(c.id);
      if (pi !== undefined && ci !== undefined && pi >= ci) {
        errors.push(`${c.id}: prerequisite ${p} does not precede it`);
      }
    }
  }
  return errors;
}
