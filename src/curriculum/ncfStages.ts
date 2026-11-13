// v0.61 §3/§4 — STAGE-QUALIFIED NCF-SE COMPETENCY IDS.
//
// THE BUG THIS TYPE EXISTS TO MAKE IMPOSSIBLE
//
// NCF-SE 2023 states Mathematics curricular goals PER STAGE, and the
// sets differ:
//
//   Middle Stage    (Classes 6-8)   CG-1 .. CG-10
//   Secondary Stage (Classes 9-12)  CG-1 .. CG-11
//
// The two blocks are adjacent in the source (§3.4.1.2 and §3.4.1.3,
// pp. 255-258), similarly worded, and differently numbered. Pragati's
// v0.52 framework review was built from the CBSE Class IX curriculum,
// which reproduces the SECONDARY set — then applied to Class 6.
//
// A bare `'CG-6'` is therefore not a citation. It resolves to
// "mathematical reasoning" at Middle Stage and to "data and
// probability" at Secondary Stage. Both are real goals. Only one is
// right for any given grade, and the wrong one looks entirely
// plausible.
//
// So competency IDs in this codebase carry their stage, always:
//
//   'MIDDLE:C-1.4'      not  'C-1.4'
//   'SECONDARY:C-6.1'   not  'C-6.1'
//
// `v061FrameworkStage.test.ts` fails if an unqualified ID appears in
// Class 6 content data.

import type { Grade } from '../types';

export type NcfStage = 'MIDDLE' | 'SECONDARY';

/** A competency ID that cannot be read without its stage. */
export type StagedCompetencyId = `${NcfStage}:C-${number}.${number}`;

/** A curricular goal ID that cannot be read without its stage. */
export type StagedGoalId = `${NcfStage}:CG-${number}`;

export const STAGE_FOR_GRADE: Record<Grade, NcfStage | null> = {
  // NCF-SE Foundational and Preparatory Stages do not use this
  // Mathematics goal structure. Null is correct, not missing.
  class1: null,
  class2: null,
  class3: null,
  class4: null,
  class5: null,
  class6: 'MIDDLE',
  class7: 'MIDDLE',
  class8: 'MIDDLE',
  class9: 'SECONDARY',
  class10: 'SECONDARY',
  class11: 'SECONDARY',
  class12: 'SECONDARY',
};

// ---------------------------------------------------------------------------
// The Middle Stage goals, transcribed from the primary source.
// NCF-SE 2023 §3.4.1.2, printed pp. 255-256.
// ---------------------------------------------------------------------------

export type GoalRecord = {
  goalId: StagedGoalId;
  title: string;
  competencies: Array<{ id: StagedCompetencyId; text: string }>;
};

export const MIDDLE_STAGE_MATHEMATICS_GOALS: GoalRecord[] = [
  {
    goalId: 'MIDDLE:CG-1',
    title:
      'Understands numbers and sets of numbers (whole numbers, fractions, integers, rational numbers, real numbers), looks for patterns, and appreciates relationships between numbers',
    competencies: [
      {
        id: 'MIDDLE:C-1.1',
        text: 'Manipulates and names large whole numbers up to 20 digits; expresses them in scientific notation using exponents and powers',
      },
      {
        id: 'MIDDLE:C-1.2',
        text: 'Discovers, identifies, and explores patterns in numbers and describes rules for their formation, and explains relations between different patterns',
      },
      {
        id: 'MIDDLE:C-1.3',
        text: 'Learns about the inclusion of zero and negative quantities as numbers, and the arithmetic operations on them, as given by Brahmagupta',
      },
      {
        id: 'MIDDLE:C-1.4',
        text: 'Explores and understands sets of numbers — whole numbers, fractions, integers, rational numbers, real numbers — and their properties, and visualises them on the number line',
      },
      {
        id: 'MIDDLE:C-1.5',
        text: 'Explores the idea of percentage and applies it to solve problems',
      },
      {
        id: 'MIDDLE:C-1.6',
        text: 'Explores and applies fractions (both as ratios and in decimal form) in daily-life situations',
      },
    ],
  },
  {
    goalId: 'MIDDLE:CG-2',
    title:
      'Understands the concepts of variable, constant, coefficient, expression, and (one-variable) equation, and uses these to solve meaningful daily-life problems with procedural fluency',
    competencies: [
      { id: 'MIDDLE:C-2.1', text: 'Understands equality between numerical expressions and learns to check arithmetical equations' },
      { id: 'MIDDLE:C-2.2', text: 'Extends the representation of a number in the form of a variable or an algebraic expression' },
      { id: 'MIDDLE:C-2.3', text: 'Forms algebraic expressions using variables, coefficients, and constants and manipulates them through basic operations' },
      { id: 'MIDDLE:C-2.4', text: 'Poses and solves linear equations to find the value of an unknown, including puzzles and word problems' },
      { id: 'MIDDLE:C-2.5', text: 'Develops own methods to solve puzzles and problems using algebraic thinking' },
    ],
  },
  {
    goalId: 'MIDDLE:CG-3',
    title:
      'Understands, formulates, and applies properties and theorems regarding simple geometric shapes (2D and 3D)',
    competencies: [
      { id: 'MIDDLE:C-3.1', text: 'Describes, classifies, and understands relationships among 2D and 3D shapes using their defining properties' },
      { id: 'MIDDLE:C-3.2', text: 'Outlines the properties of lines, angles, triangles, quadrilaterals, and polygons and applies them to solve problems' },
      { id: 'MIDDLE:C-3.3', text: 'Identifies attributes of 3D shapes, works hands-on to construct them, and uses 2D representations of 3D objects' },
      { id: 'MIDDLE:C-3.4', text: 'Draws and constructs geometric shapes with specified properties using a compass and straightedge' },
      { id: 'MIDDLE:C-3.5', text: 'Understands congruence and similarity and identifies similar and congruent triangles' },
    ],
  },
  {
    goalId: 'MIDDLE:CG-4',
    title:
      'Develops understanding of perimeter and area for 2D shapes and uses them to solve day-to-day life problems',
    competencies: [
      { id: 'MIDDLE:C-4.1', text: 'Uses formulae for the area of a square, triangle, parallelogram, and trapezium; finds areas of composite 2D shapes' },
      { id: 'MIDDLE:C-4.2', text: 'Learns the Baudhayana-Pythagoras theorem and discovers a geometric proof using areas of squares on the sides' },
      { id: 'MIDDLE:C-4.3', text: 'Constructs designs using tiling on a plane surface and appreciates their appearances in art' },
      { id: 'MIDDLE:C-4.4', text: 'Develops familiarity with fractals and identifies their appearances in nature and art' },
    ],
  },
  {
    goalId: 'MIDDLE:CG-5',
    title:
      'Collects, organises, represents (graphically and in tables), and interprets data/information from daily-life experiences',
    competencies: [
      { id: 'MIDDLE:C-5.1', text: 'Collects, organises, and interprets data using measures of central tendency such as average/mean, mode, and median' },
      { id: 'MIDDLE:C-5.2', text: 'Selects, creates, and uses appropriate graphical representations of data to make interpretations' },
    ],
  },
  {
    goalId: 'MIDDLE:CG-6',
    title:
      'Develops mathematical thinking and the ability to communicate mathematical ideas logically and precisely',
    competencies: [
      { id: 'MIDDLE:C-6.1', text: 'Applies inductive and deductive logic to formulate definitions and conjectures and produce convincing arguments or proofs' },
    ],
  },
  {
    goalId: 'MIDDLE:CG-7',
    title:
      'Engages with puzzles and mathematical problems and develops own creative methods and strategies to solve them',
    competencies: [
      { id: 'MIDDLE:C-7.1', text: "Demonstrates creativity in discovering one's own solutions to puzzles and appreciates the different solutions of others" },
      { id: 'MIDDLE:C-7.2', text: 'Engages in and appreciates the artistry and aesthetics of puzzle-making and puzzle-solving' },
    ],
  },
  {
    goalId: 'MIDDLE:CG-8',
    title:
      'Develops basic capacities of computational thinking: decomposition, pattern recognition, data representation, generalisation, abstraction, and algorithms',
    competencies: [
      { id: 'MIDDLE:C-8.1', text: 'Approaches problems using programmatic thinking — iteration, symbolic representation, logical operations — and reformulates problems into ordered steps' },
      { id: 'MIDDLE:C-8.2', text: 'Learns systematic counting and listing, reasoning about counts and iterative patterns, and devising and following algorithms' },
    ],
  },
  {
    goalId: 'MIDDLE:CG-9',
    title:
      'Knows and appreciates the development of mathematical ideas over time and the contributions of past and modern mathematicians from India and across the world',
    competencies: [
      { id: 'MIDDLE:C-9.1', text: 'Recognises how concepts evolved over time in different civilisations' },
      { id: 'MIDDLE:C-9.2', text: 'Knows and appreciates the contributions of specific Indian mathematicians' },
    ],
  },
  {
    goalId: 'MIDDLE:CG-10',
    title:
      'Knows about and appreciates the interaction of Mathematics with each of their other school subjects',
    competencies: [
      { id: 'MIDDLE:C-10.1', text: 'Recognises interaction of Mathematics with multiple subjects across Science, Social Science, Visual Arts, Music, Vocational Education, and Sports' },
    ],
  },
];

/** Source provenance for the block above. Surfaced in Admin so the
 *  transcription can be checked rather than trusted. */
export const MIDDLE_STAGE_SOURCE = {
  document: 'National Curriculum Framework for School Education 2023',
  organization: 'NCERT / Ministry of Education, Government of India',
  url: 'https://ncert.nic.in/pdf/NCFSE-2023-August_2023.pdf',
  section: '3.4.1.2 Middle Stage (Mathematics)',
  printedPages: '255-256',
  inspectionDate: '2026-08-24',
  method: 'Direct text extraction from the primary PDF',
  goalCount: 10,
  /** Recorded because confusing the two is the defect this file
   *  addresses. */
  secondaryStageSection: '3.4.1.3 Secondary Stage, printed pp. 256-258',
  secondaryStageGoalCount: 11,
} as const;

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

const STAGED = /^(MIDDLE|SECONDARY):C-\d+\.\d+$/;

export function isStagedCompetencyId(v: string): v is StagedCompetencyId {
  return STAGED.test(v);
}

export function stageOf(id: StagedCompetencyId): NcfStage {
  return id.split(':')[0] as NcfStage;
}

/**
 * Is this competency citation valid for this grade?
 *
 * Catches the exact v0.52 error: a Class 6 unit citing a Secondary
 * Stage competency. The ID is well-formed and resolves to a real goal —
 * it is simply the wrong stage's goal.
 */
export function competencyValidForGrade(
  id: StagedCompetencyId,
  grade: Grade
): boolean {
  const expected = STAGE_FOR_GRADE[grade];
  if (expected === null) return false;
  return stageOf(id) === expected;
}

export function middleStageCompetency(
  id: StagedCompetencyId
): { id: StagedCompetencyId; text: string } | null {
  for (const g of MIDDLE_STAGE_MATHEMATICS_GOALS) {
    const hit = g.competencies.find((c) => c.id === id);
    if (hit) return hit;
  }
  return null;
}
