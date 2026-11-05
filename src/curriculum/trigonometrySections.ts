// ===========================================================================
// v0.84.0-c10.1 checkpoint 55 — CLASS 10 FIRST AUTHORING PILOT: TRIGONOMETRY.
//
// Chosen over Chapter 1 deliberately. These four units are where the two
// hardest things meet: a representation the Class 9 architecture never
// attempted — a side whose role depends on which angle you are looking
// from — and a PROVE obligation on why the ratios depend only on the angle.
//
// If the figure model could not hold "opposite" as a relationship rather
// than a property, that had to surface here rather than after forty units
// were written on the assumption.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §8.2
// and §8.3. CBSE 041/241 2026-27 prescribes the ratios, the proof of their
// existence (well-definedness), and the values at 30, 45 and 60 degrees.
// 0 and 90 degrees belong to unit 8.3b and are deliberately not here.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  ACUTE_STANDARD_ANGLES,
  exactValue,
  ratioAt,
} from './specialAngles';
import type { GeometryFigureSpec } from './visualSpecification';

export const TRIGONOMETRY_CHAPTER_ID = 'ncert_jemh1_ch08';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: TRIGONOMETRY_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// --- figures ---------------------------------------------------------------
// Every triangle below is placed at coordinates that make its claimed angles
// true. The validators recompute them; a figure that merely looks right is
// rejected.

/** 3-4-5 right triangle, right-angled at B, with roles from BOTH acute angles. */
const F_ROLES: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_definition',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'a', x: 0, y: 0, label: 'A' },
    { id: 'b', x: 4, y: 0, label: 'B' },
    { id: 'c', x: 4, y: 3, label: 'C' },
  ],
  segments: [
    { from: 'a', to: 'b', label: 'AB = 4' },
    { from: 'b', to: 'c', label: 'BC = 3' },
    { from: 'a', to: 'c', label: 'AC = 5' },
  ],
  angleMarks: [{ at: 'b', from: 'a', to: 'c', right: true }],
  // The same figure, read from two different angles. BC is opposite A and
  // adjacent to C; AB is adjacent to A and opposite C. Only AC is fixed.
  rightTriangleRoles: [
    { referenceVertex: 'a', rightAngleVertex: 'b', thirdVertex: 'c', referenceLabel: 'A' },
    { referenceVertex: 'c', rightAngleVertex: 'b', thirdVertex: 'a', referenceLabel: 'C' },
  ],
  caption: 'One triangle, read from angle A and from angle C.',
  altText:
    'A right triangle ABC with the right angle at B. AB measures 4 units, BC measures 3 units and the hypotenuse AC measures 5 units. Read from angle A, BC is the opposite side and AB the adjacent side. Read from angle C, those two roles swap, while AC stays the hypotenuse because it faces the right angle.',
};

/** Two similar right triangles sharing the acute angle at A. */
const F_SIMILAR: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'a', x: 0, y: 0, label: 'A' },
    { id: 'b', x: 4, y: 0, label: 'B' },
    { id: 'c', x: 4, y: 3, label: 'C' },
    { id: 'p', x: 8, y: 0, label: 'P' },
    { id: 'q', x: 8, y: 6, label: 'Q' },
  ],
  segments: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'a', to: 'c' },
    { from: 'a', to: 'p', mark: 'dashed' },
    { from: 'p', to: 'q' },
    { from: 'a', to: 'q', mark: 'dashed' },
  ],
  angleMarks: [
    { at: 'b', from: 'a', to: 'c', right: true },
    { at: 'p', from: 'a', to: 'q', right: true },
    // The shared angle, tagged so reader and validator agree which equality
    // is being claimed.
    { at: 'a', from: 'b', to: 'c', equalTag: 'theta' },
    { at: 'a', from: 'p', to: 'q', equalTag: 'theta' },
  ],
  rightTriangleRoles: [
    { referenceVertex: 'a', rightAngleVertex: 'b', thirdVertex: 'c', referenceLabel: 'A in the small triangle' },
    { referenceVertex: 'a', rightAngleVertex: 'p', thirdVertex: 'q', referenceLabel: 'A in the large triangle' },
  ],
  caption: 'Two right triangles sharing the angle at A.',
  altText:
    'Two right triangles drawn from the same vertex A along the same line. The smaller has its right angle at B with BC rising 3 units; the larger has its right angle at P with PQ rising 6 units. The angle at A is the same in both, marked with the same tag, so the triangles are similar and corresponding sides are in the same ratio.',
};

/** Half of an equilateral triangle: the 30-60-90 derivation. */
const F_HALF_EQUILATERAL: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'a', x: 0, y: 1.7320508075688772, label: 'A' },
    { id: 'd', x: 0, y: 0, label: 'D' },
    { id: 'b', x: -1, y: 0, label: 'B' },
    { id: 'c', x: 1, y: 0, label: 'C' },
  ],
  segments: [
    { from: 'a', to: 'b', label: 'AB = 2' },
    { from: 'a', to: 'c', label: 'AC = 2' },
    { from: 'b', to: 'c' },
    { from: 'a', to: 'd', label: 'AD = \u221a3' },
    { from: 'b', to: 'd', mark: 'single_tick', label: 'BD = 1' },
    { from: 'd', to: 'c', mark: 'single_tick', label: 'DC = 1' },
  ],
  angleMarks: [
    { at: 'd', from: 'b', to: 'a', right: true },
    { at: 'b', from: 'd', to: 'a', label: '60' },
    { at: 'a', from: 'd', to: 'b', label: '30' },
  ],
  rightTriangleRoles: [
    { referenceVertex: 'b', rightAngleVertex: 'd', thirdVertex: 'a', referenceLabel: 'B = 60 degrees' },
    { referenceVertex: 'a', rightAngleVertex: 'd', thirdVertex: 'b', referenceLabel: 'A = 30 degrees' },
  ],
  caption: 'An equilateral triangle of side 2, cut in half by its altitude.',
  altText:
    'An equilateral triangle ABC of side 2 with the altitude AD drawn to the midpoint D of BC. The two halves BD and DC are each 1, marked equal. In triangle ABD the angle at D is a right angle, the angle at B is 60 degrees and the angle at A is 30 degrees, and AD works out as the square root of 3 by the Pythagoras relation.',
};

/** Isosceles right triangle: the 45 derivation. */
const F_ISOSCELES_RIGHT: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'b', x: 0, y: 0, label: 'B' },
    { id: 'a', x: 1, y: 0, label: 'A' },
    { id: 'c', x: 0, y: 1, label: 'C' },
  ],
  segments: [
    { from: 'b', to: 'a', mark: 'single_tick', label: 'AB = 1' },
    { from: 'b', to: 'c', mark: 'single_tick', label: 'BC = 1' },
    { from: 'a', to: 'c', label: 'AC = \u221a2' },
  ],
  angleMarks: [
    { at: 'b', from: 'a', to: 'c', right: true },
    { at: 'a', from: 'b', to: 'c', label: '45' },
    { at: 'c', from: 'b', to: 'a', label: '45' },
  ],
  rightTriangleRoles: [
    { referenceVertex: 'a', rightAngleVertex: 'b', thirdVertex: 'c', referenceLabel: 'A = 45 degrees' },
  ],
  caption: 'A right triangle with both legs equal.',
  altText:
    'A right triangle ABC with the right angle at B and the two legs AB and BC both of length 1, marked equal. Because the legs are equal the two acute angles are equal, so each is 45 degrees, and the hypotenuse AC is the square root of 2 by the Pythagoras relation.',
};

/** Reconstructing a triangle from sin A = 3/5. */
const F_FROM_RATIO: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  exactGeometry: true,
  points: [
    { id: 'a', x: 0, y: 0, label: 'A' },
    { id: 'b', x: 4, y: 0, label: 'B' },
    { id: 'c', x: 4, y: 3, label: 'C' },
  ],
  segments: [
    { from: 'a', to: 'b', label: 'adjacent = 4k' },
    { from: 'b', to: 'c', label: 'opposite = 3k' },
    { from: 'a', to: 'c', label: 'hypotenuse = 5k' },
  ],
  angleMarks: [{ at: 'b', from: 'a', to: 'c', right: true }],
  rightTriangleRoles: [
    { referenceVertex: 'a', rightAngleVertex: 'b', thirdVertex: 'c', referenceLabel: 'A' },
  ],
  caption: 'Every right triangle with sin A = 3/5, drawn once.',
  altText:
    'A right triangle with the right angle at B. The side opposite angle A is written as 3k, the hypotenuse as 5k, and the remaining side works out as 4k. Any positive k gives a triangle with the same angle A, which is why one picture stands for all of them.',
};

export const C10_SECTION_8_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s8_2_ratios_lesson',
  contentArtifactVersion: 1,
  source: source('8.2', 'Trigonometric Ratios', 114, 'ncert_jemh1_s8_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['The Pythagoras relation in a right triangle', 'Ratio of two lengths', 'Naming a triangle by its vertices'],
    mustNotIntroduce: [
      { concept: 'Values of the ratios at specific angles', belongsToSection: 'ncert_jemh1_s8_3' },
      { concept: 'Trigonometric identities', belongsToSection: 'ncert_jemh1_s8_4' },
    ],
  },
  learningGoal:
    'You will name the three sides of a right triangle with respect to a chosen acute angle, and define the six trigonometric ratios of that angle.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Identify the hypotenuse of a right triangle.',
      'Use the Pythagoras relation to find a missing side.',
      'Write the ratio of two lengths in lowest terms.',
    ],
    ifNotReady: 'Revise the Pythagoras relation. Every ratio in this lesson is built from the three sides of a right triangle.',
  },
  vocabulary: [
    { term: 'hypotenuse', meaning: 'The side facing the right angle. It is the longest side, and it does not change when you switch which acute angle you are looking at.' },
    { term: 'opposite side', meaning: 'The side facing the angle you have chosen — the one that does not touch it.' },
    { term: 'adjacent side', meaning: 'The leg that does touch the angle you have chosen, and is not the hypotenuse.' },
    { term: 'trigonometric ratio', meaning: 'A ratio of two sides of a right triangle, taken with respect to one of its acute angles.' },
    { term: 'sine', meaning: 'The ratio of the opposite side to the hypotenuse, written sin A.' },
    { term: 'cosine', meaning: 'The ratio of the adjacent side to the hypotenuse, written cos A.' },
    { term: 'tangent', meaning: 'The ratio of the opposite side to the adjacent side, written tan A.' },
    { term: 'cosecant', meaning: 'The reciprocal of the sine, written cosec A.' },
    { term: 'secant', meaning: 'The reciprocal of the cosine, written sec A.' },
    { term: 'cotangent', meaning: 'The reciprocal of the tangent, written cot A.' },
  ],
  explanation: [
    'A right triangle has three sides, and before you can take a ratio you have to say which is which. One of them is settled by the right angle: the hypotenuse is the side facing it, and nothing you do afterwards changes that.',
    'The other two are not settled until you choose an angle to look from. Pick one of the acute angles. The side that faces it — the side that does not touch it at all — is the opposite side. The leg that does touch it is the adjacent side.',
    'That word "chosen" is the whole of the idea. In triangle ABC with the right angle at B, look from A: BC faces A, so BC is opposite and AB is adjacent. Now look from C instead. Nothing about the triangle has moved, but BC now touches the angle you are looking from, so BC is adjacent and AB is opposite. The same segment has swapped roles because you swapped your viewpoint.',
    'With the three sides named, the six ratios are just the six ways of putting two of them over each other. For an acute angle A the first three are the sine, the cosine and the tangent: sin A is opposite over hypotenuse, cos A is adjacent over hypotenuse, and tan A is opposite over adjacent.',
    'The other three — the cosecant, the secant and the cotangent — are those same ratios turned upside down. cosec A is hypotenuse over opposite, sec A is hypotenuse over adjacent, and cot A is adjacent over opposite. So cosec A = 1/sin A, sec A = 1/cos A and cot A = 1/tan A — not new facts to remember, but the definitions read the other way up.',
    'One thing to be careful of: a ratio is not a length. sin A = 3/5 does not say any side measures 3 or 5. It says the opposite side and the hypotenuse stand in the ratio 3 to 5, and the triangle could be any size at all.',
  ],
  representations: ['A right triangle labelled from two different reference angles'],
  visuals: [F_ROLES],
  visualsById: { F_ROLES },
  workedExamples: [
    {
      id: 's82a.we1',
      prompt: 'In triangle ABC, right-angled at B, AB = 4, BC = 3 and AC = 5. Write all six trigonometric ratios of angle A.',
      steps: [
        { text: 'The hypotenuse is AC = 5.', reasoning: 'AC is the side facing the right angle at B, and that is what fixes the hypotenuse, independently of which acute angle we go on to use.' },
        { text: 'Looking from A, the opposite side is BC = 3 and the adjacent side is AB = 4.', reasoning: 'BC does not touch A, so it faces A; AB touches A and is not the hypotenuse, so it is the adjacent leg.' },
        { text: 'sin A = 3/5, cos A = 4/5, tan A = 3/4.', reasoning: 'Each is read straight off the definitions: opposite over hypotenuse, adjacent over hypotenuse, opposite over adjacent.' },
        { text: 'cosec A = 5/3, sec A = 5/4, cot A = 4/3.', reasoning: 'These are the first three inverted, which is what the reciprocal definitions say.' },
      ],
      answer: 'sin A = 3/5, cos A = 4/5, tan A = 3/4, cosec A = 5/3, sec A = 5/4, cot A = 4/3.',
      visualRef: 'F_ROLES',
    },
    {
      id: 's82a.we2',
      prompt: 'In the same triangle, write sin C, cos C and tan C, and compare them with the ratios of A.',
      steps: [
        { text: 'The hypotenuse is still AC = 5.', reasoning: 'The right angle has not moved, so the hypotenuse has not changed.' },
        { text: 'Looking from C, the opposite side is AB = 4 and the adjacent side is BC = 3.', reasoning: 'AB does not touch C, so it faces C; BC touches C, so it is now the adjacent leg. The two legs have exchanged roles.' },
        { text: 'sin C = 4/5, cos C = 3/5, tan C = 4/3.', reasoning: 'Same definitions, applied to the side names that belong to C.' },
        { text: 'Compare: sin C equals cos A, and cos C equals sin A.', reasoning: 'The legs swapped roles, so the two ratios built from them swapped too. This is a consequence of the naming, not a separate rule.' },
      ],
      answer: 'sin C = 4/5, cos C = 3/5, tan C = 4/3 — and sin C = cos A, cos C = sin A.',
      visualRef: 'F_ROLES',
    },
    {
      id: 's82a.we3',
      prompt: 'A right triangle has legs 5 and 12 about the right angle. Find sin and cos of the angle facing the side of length 5.',
      steps: [
        { text: 'Find the hypotenuse: 5 squared plus 12 squared is 25 + 144 = 169, so the hypotenuse is 13.', reasoning: 'The Pythagoras relation gives the third side, and we need it before any ratio involving the hypotenuse can be written.' },
        { text: 'Call the angle A. The side facing A has length 5, so that is the opposite side; the adjacent leg is 12.', reasoning: 'The problem names A by which side it faces, which is exactly the opposite-side condition.' },
        { text: 'sin A = 5/13 and cos A = 12/13.', reasoning: 'Opposite over hypotenuse and adjacent over hypotenuse.' },
      ],
      answer: 'sin A = 5/13, cos A = 12/13.',
    },
  ],
  guidedPractice: [
    {
      id: 's82a.g1',
      prompt: 'In triangle PQR, right-angled at Q, PQ = 8, QR = 15 and PR = 17. Write sin P, cos P and tan P.',
      hint: 'Start by deciding which side faces P and which touches it. The hypotenuse is already fixed by the right angle at Q.',
      answer: 'sin P = 15/17, cos P = 8/17, tan P = 15/8.',
      rationale: 'PR faces the right angle, so PR = 17 is the hypotenuse. QR does not touch P, so QR = 15 is opposite; PQ = 8 touches P, so it is adjacent. The three ratios follow from the definitions.',
    },
    {
      id: 's82a.g2',
      prompt: 'In the same triangle PQR, is PQ the opposite side or the adjacent side? Explain why the question is incomplete as asked.',
      hint: 'Ask yourself: opposite to what?',
      answer: 'The question cannot be answered until an angle is named. PQ is adjacent to P and opposite to R.',
      rationale: 'Opposite and adjacent are relationships between a side and a chosen angle, not labels a side carries by itself. Only the hypotenuse is fixed, because the right angle fixes it.',
    },
    {
      id: 's82a.g3',
      prompt: 'If cos A = 7/25 in a right triangle, which two sides are in the ratio 7 to 25, and which is longer?',
      hint: 'Read the definition of cosine back to front.',
      answer: 'The side adjacent to A and the hypotenuse, in that order; the hypotenuse is longer.',
      rationale: 'cos A is adjacent over hypotenuse, so the adjacent leg is to the hypotenuse as 7 is to 25. The hypotenuse is the longest side of a right triangle, which is why this cosine is less than 1.',
    },
  ],
  independentPractice: [
    {
      id: 's82a.i1',
      prompt: 'In triangle XYZ, right-angled at Y, XY = 9 and YZ = 40. Find the hypotenuse, then write sin X, cos X and tan X.',
      answer: 'XZ = 41; sin X = 40/41, cos X = 9/41, tan X = 40/9.',
      rationale: '9 squared plus 40 squared is 81 + 1600 = 1681, and 41 squared is 1681, so XZ = 41. YZ faces X so it is opposite; XY touches X so it is adjacent.',
    },
    {
      id: 's82a.i2',
      prompt: 'In a right triangle, tan B = 1. What can you say about the two legs?',
      answer: 'They are equal in length.',
      rationale: 'tan B is opposite over adjacent. That ratio equals 1 exactly when the two legs are the same length.',
    },
    {
      id: 's82a.i3',
      prompt: 'Explain why sec A can never be less than 1 for an acute angle A in a right triangle.',
      answer: 'Because sec A is hypotenuse over adjacent, and the hypotenuse is always the longest side.',
      rationale: 'The hypotenuse exceeds either leg, so hypotenuse over adjacent is greater than 1. The same argument shows cosec A is greater than 1.',
    },
    {
      id: 's82a.i4',
      prompt: 'In triangle ABC right-angled at B, write cot C in terms of the side lengths AB, BC and AC.',
      answer: 'cot C = BC / AB.',
      rationale: 'From C, the adjacent leg is BC and the opposite side is AB. cot is adjacent over opposite, so cot C = BC/AB.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's82a.td1',
      prompt: 'Can one side of a right triangle be the opposite side in one question and the adjacent side in another, without the triangle changing at all? Argue from the definitions.',
      expectedReasoning:
        'Yes, and it happens in every right triangle. The two legs each touch one acute angle and face the other. Choosing the reference angle decides which description applies; the segment itself has not changed. Only the hypotenuse escapes this, because it is defined by the right angle rather than by a chosen acute angle.',
    },
    {
      id: 's82a.td2',
      prompt: 'A student writes "the opposite side is 3 cm, so sin A = 3". What has gone wrong, and what extra information would be needed?',
      expectedReasoning:
        'A trigonometric ratio is a ratio of two sides, not a single length. sin A needs the hypotenuse as well, and equals the opposite divided by it. Knowing only that the opposite side is 3 cm leaves sin A undetermined: with hypotenuse 5 it is 3/5, with hypotenuse 6 it is 1/2.',
    },
  ],
  summary:
    'In a right triangle the hypotenuse faces the right angle. Once you choose an acute angle, the side facing it is the opposite and the leg touching it is the adjacent. For that angle A, sin A is opposite over hypotenuse, cos A is adjacent over hypotenuse and tan A is opposite over adjacent; cosec A, sec A and cot A are those three inverted.',
  nextStep: 'Next you will see why these ratios depend only on the angle, and not at all on how large the triangle is.',
  teacher: {
    objective: 'Students name the three sides of a right triangle relative to a chosen acute angle and define the six ratios from them.',
    prerequisiteKnowledge: ['The Pythagoras relation', 'Ratio of two lengths', 'Naming a triangle by its vertices'],
    modelLanguage: [
      'The side facing angle A — the one that does not touch it — is the opposite side.',
      'The hypotenuse faces the right angle, so it does not change when we switch angles.',
      'A ratio is not a length: sin A = 3/5 says nothing measures 3.',
    ],
    teachingNotes: [
      'The swap between angle A and angle C in the same figure is worth doing slowly. It is the one move that makes the relativity of the naming concrete, and students who miss it carry the error into every later chapter.',
      'Resist introducing values of the ratios here. Until the next lesson establishes that the ratios depend only on the angle, a numerical value has no justification.',
      'Watch for opposite and adjacent being treated as fixed names a side carries, and for the hypotenuse being chosen as the longest-looking side in the drawing rather than the side facing the right angle.',
    ],
    quickChecks: [
      'Point at a leg and ask: opposite to which angle?',
      'Ask which side keeps its name when the reference angle changes, and why.',
    ],
    supportForStrugglingLearners: [
      'Have the student trace the angle with a finger and then the side that does not touch it; the physical separation is what "opposite" means.',
      'Mark the hypotenuse first, every time, before naming anything else.',
    ],
    extension: ['Ask what happens to the six ratios when the two acute angles are exchanged, and why three equalities appear.'],
    materialsNeeded: ['Ruler', 'Set square or any right-angled corner'],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_8_2B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s8_2_welldefined_lesson',
  contentArtifactVersion: 1,
  source: source('8.2', 'Trigonometric Ratios', 114, 'ncert_jemh1_s8_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s8_2'],
    mayAssume: ['The six trigonometric ratios of an acute angle', 'The AA similarity criterion', 'Corresponding sides of similar triangles are proportional'],
    mustNotIntroduce: [
      { concept: 'Values of the ratios at specific angles', belongsToSection: 'ncert_jemh1_s8_3' },
    ],
  },
  learningGoal:
    'You will prove that the trigonometric ratios of an acute angle depend only on the angle, and not on the size of the right triangle you measure them in.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the AA criterion for similar triangles.',
      'Say what proportional corresponding sides means.',
      'Write sin A, cos A and tan A from a labelled right triangle.',
    ],
    ifNotReady: 'Revise similarity of triangles. The whole proof rests on it.',
  },
  vocabulary: [
    { term: 'similar triangles', meaning: 'Triangles with equal corresponding angles and corresponding sides in the same ratio.' },
    { term: 'corresponding sides', meaning: 'Sides occupying matching positions in two similar triangles, determined by which vertices correspond.' },
    { term: 'well defined', meaning: 'A quantity is well defined when every legitimate way of working it out gives the same answer.' },
  ],
  explanation: [
    'The last lesson defined sin A as the opposite side over the hypotenuse. But there is a gap in that definition, and it is worth seeing clearly before we close it. Which right triangle? For a given acute angle A, you can draw infinitely many right triangles containing it, of every size. Each has its own opposite side and its own hypotenuse. Nothing so far guarantees the ratio comes out the same.',
    'If it did not, "sin A" would be meaningless — it would depend on a triangle nobody specified. So we have to prove it does.',
    'Take two right triangles, ABC with its right angle at B, and APQ with its right angle at P, sharing the same acute angle at A. Their angles at A are equal because that is how they were drawn, and their right angles are equal because both are right angles.',
    'Two pairs of equal angles is enough: by the AA criterion the triangles are similar. The correspondence matters and is forced by the angles — A corresponds to A, B to P because both carry the right angle, and so C corresponds to Q.',
    'Similar triangles have corresponding sides in the same ratio. With the correspondence above, BC corresponds to PQ and AC corresponds to AQ, so BC/PQ = AC/AQ. Rearranging that single equation gives BC/AC = PQ/AQ.',
    'Read the two sides of that last equation. On the left is the opposite over the hypotenuse in triangle ABC — that is sin A computed in the small triangle. On the right is the opposite over the hypotenuse in triangle APQ — the same sin A computed in the large one. They are equal.',
    'The same argument runs with AB/AC and AP/AQ for the cosine, and with BC/AB and PQ/AP for the tangent, so all six ratios are unaffected. Since the two triangles were any two right triangles with that angle, the ratio depends on the angle alone. That is what entitles us to write sin A at all.',
    'Notice what the proof did not do. It did not measure two triangles and observe that the answers came out close. Measurement of two cases would leave the third case open. Similarity settles every case at once, which is what a proof has to do.',
  ],
  representations: ['Two similar right triangles sharing an acute angle, with the correspondence marked'],
  visuals: [F_SIMILAR],
  visualsById: { F_SIMILAR },
  workedExamples: [
    {
      id: 's82b.we1',
      prompt: 'Prove that sin A has the same value in two right triangles sharing the acute angle A.',
      steps: [
        { text: 'Draw triangles ABC and APQ, right-angled at B and at P, with the same angle at A.', reasoning: 'Setting up two arbitrary triangles with the shared angle is what makes the conclusion apply to all of them rather than to a chosen pair.' },
        { text: 'Angle A equals angle A, and angle B equals angle P since both are right angles.', reasoning: 'Two pairs of equal angles is exactly the hypothesis the AA criterion needs.' },
        { text: 'By AA, triangle ABC is similar to triangle APQ, with A corresponding to A, B to P and C to Q.', reasoning: 'The correspondence is forced by the angles: the right-angled vertices must match each other, which then fixes the third pair.' },
        { text: 'Corresponding sides are proportional, so BC/PQ = AC/AQ.', reasoning: 'BC and PQ are the sides facing the matched vertices A; AC and AQ are the two hypotenuses.' },
        { text: 'Rearrange to BC/AC = PQ/AQ.', reasoning: 'Cross-multiplying and regrouping turns a statement comparing the two triangles into one comparing a ratio inside each.' },
        { text: 'BC/AC is sin A in the first triangle and PQ/AQ is sin A in the second.', reasoning: 'Each is opposite over hypotenuse, read with respect to A in its own triangle.' },
      ],
      answer: 'The two values of sin A are equal, so sin A depends on the angle and not on the triangle.',
      visualRef: 'F_SIMILAR',
    },
    {
      id: 's82b.we2',
      prompt: 'Run the same argument for cos A and tan A.',
      steps: [
        { text: 'From the same similarity, AB/AP = AC/AQ.', reasoning: 'AB and AP are the adjacent legs under the established correspondence, and AC and AQ the hypotenuses.' },
        { text: 'Rearranged, AB/AC = AP/AQ, which says cos A agrees in both triangles.', reasoning: 'Each side is adjacent over hypotenuse in its own triangle.' },
        { text: 'Likewise BC/PQ = AB/AP gives BC/AB = PQ/AP, which is tan A in each.', reasoning: 'Opposite over adjacent, taken within each triangle.' },
        { text: 'The remaining three ratios are the reciprocals of these, so they agree too.', reasoning: 'If two quantities are equal and non-zero, their reciprocals are equal; no separate argument is needed.' },
      ],
      answer: 'All six trigonometric ratios of A are the same in both triangles.',
    },
    {
      id: 's82b.we3',
      prompt: 'In the figure, BC = 3 and AC = 5 in the small triangle, and PQ = 6 in the large one. Find AQ, and check that sin A agrees.',
      steps: [
        { text: 'The triangles are similar, so PQ/BC = AQ/AC.', reasoning: 'Corresponding sides are in one common ratio; the two known opposite sides give that ratio.' },
        { text: 'PQ/BC = 6/3 = 2, so AQ = 2 times AC = 10.', reasoning: 'The large triangle is a scaling of the small one by a factor of 2, so every side doubles.' },
        { text: 'sin A from the small triangle is 3/5; from the large it is 6/10.', reasoning: 'Each is opposite over hypotenuse in its own triangle.' },
        { text: '6/10 reduces to 3/5.', reasoning: 'Doubling both terms of a ratio leaves the ratio unchanged, which is the scaling fact the proof turned into a general statement.' },
      ],
      answer: 'AQ = 10, and sin A = 3/5 either way.',
      visualRef: 'F_SIMILAR',
    },
  ],
  guidedPractice: [
    {
      id: 's82b.g1',
      prompt: 'Which similarity criterion does the proof use, and what are the two pairs of equal angles?',
      hint: 'One pair is given by the construction; the other is given by the word "right".',
      answer: 'The AA criterion, using the shared angle at A and the two right angles.',
      rationale: 'The shared acute angle is equal by construction and the right angles are equal because both are 90 degrees. Two pairs suffice for AA.',
    },
    {
      id: 's82b.g2',
      prompt: 'Why would measuring sin A in two different triangles and getting 0.6 both times not be a proof?',
      hint: 'How many right triangles contain the angle A?',
      answer: 'Because infinitely many such triangles exist and two measurements say nothing about the rest.',
      rationale: 'Measurement also carries error, so agreement to one decimal place is consistent with the values differing. The similarity argument covers every triangle at once and exactly.',
    },
    {
      id: 's82b.g3',
      prompt: 'In the proof, why must B correspond to P rather than to Q?',
      hint: 'What is special about B and P?',
      answer: 'Because B and P are the right-angled vertices, and corresponding angles in similar triangles must be equal.',
      rationale: 'If B were matched to Q, a right angle would be paired with an acute angle, contradicting similarity. Getting the correspondence right is what makes the later side ratios mean what we want.',
    },
  ],
  independentPractice: [
    {
      id: 's82b.i1',
      prompt: 'A right triangle with acute angle A is enlarged by a factor of 7. What happens to tan A, and why?',
      answer: 'It is unchanged.',
      rationale: 'Both the opposite and the adjacent side are multiplied by 7, and the 7s cancel in the ratio. This is the scaling case the similarity proof generalises.',
    },
    {
      id: 's82b.i2',
      prompt: 'Two right triangles have an acute angle of 40 degrees each, but one has a hypotenuse of 5 cm and the other of 12 cm. Can their cosines of 40 degrees differ?',
      answer: 'No.',
      rationale: 'They share an acute angle and a right angle, so they are similar by AA, and the proof shows every ratio of the 40-degree angle agrees.',
    },
    {
      id: 's82b.i3',
      prompt: 'Explain in one or two sentences why the notation "sin A" would be illegitimate without this result.',
      answer: 'Because the symbol names a number determined by A alone, which only makes sense once the triangle is shown not to matter.',
      rationale: 'If different triangles gave different values, the expression would need to name a triangle as well. The proof is what licenses the shorter notation.',
    },
    {
      id: 's82b.i4',
      prompt: 'Does the proof use the lengths of any particular sides? What does that tell you about its scope?',
      answer: 'No; it uses only angle equality and proportionality, so it holds for every right triangle containing the angle.',
      rationale: 'Nothing in the argument depends on a measurement, which is exactly why the conclusion is general rather than a statement about the drawn figure.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's82b.td1',
      prompt: 'The proof establishes that the ratios depend only on the angle. Does it also tell you what sin 40 degrees is? Explain the difference between knowing a number exists and knowing its value.',
      expectedReasoning:
        'It does not. The argument shows that one definite number is attached to each acute angle, which is what makes the notation legitimate, but it never computes one. Finding values is a separate task, and for most angles it needs methods beyond this chapter; the next lesson does it for three special angles by construction rather than by measurement.',
    },
    {
      id: 's82b.td2',
      prompt: 'Suppose someone proposes defining sin A as the opposite side alone, without dividing by the hypotenuse. Where exactly would the similarity argument fail?',
      expectedReasoning:
        'At the final step. Similarity gives BC/PQ = AC/AQ, a statement about ratios; it does not give BC = PQ. Enlarging the triangle multiplies the opposite side by the scale factor, so a bare length changes while a ratio of two sides does not. Dividing by the hypotenuse is precisely what makes the scale factor cancel.',
    },
  ],
  summary:
    'Two right triangles sharing an acute angle A are similar by AA, with the right-angled vertices corresponding. Corresponding sides are proportional, and rearranging that proportion shows the opposite-over-hypotenuse ratio is the same in both. The same holds for every one of the six ratios, so each depends on the angle alone — which is what makes the notation sin A meaningful.',
  nextStep: 'Next you will use one known ratio to recover the others, and then derive exact values for three particular angles.',
  teacher: {
    objective: 'Students prove, from similarity, that each trigonometric ratio of an acute angle is independent of the right triangle used.',
    prerequisiteKnowledge: ['The AA similarity criterion', 'Proportionality of corresponding sides', 'The six ratios from the previous lesson'],
    modelLanguage: [
      'Which triangle? That question is the gap the proof closes.',
      'Two pairs of equal angles is enough — that is AA.',
      'Similarity gives a statement between triangles; rearranging turns it into one inside each.',
    ],
    teachingNotes: [
      'The gap is worth opening before it is closed: ask which triangle sin A refers to, and let the absence of an answer motivate the proof. Students who never feel the gap treat the proof as ceremony.',
      'The rearrangement from BC/PQ = AC/AQ to BC/AC = PQ/AQ is the step that does the work. It rewards being written out rather than asserted.',
      'Watch for the result being accepted as an observation from two drawn cases, and for a correspondence that pairs a right angle with an acute one.',
    ],
    quickChecks: [
      'Ask which two pairs of angles the AA step uses.',
      'Ask whether the proof tells you the value of sin 40 degrees.',
    ],
    supportForStrugglingLearners: [
      'Work the numerical scaling case first — 3,4,5 against 6,8,10 — then ask what would make it true for every triangle rather than these two.',
    ],
    extension: ['Ask where the argument would fail if sine were defined as the opposite side alone.'],
    materialsNeeded: ['Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_8_2C: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s8_2_from_ratio_lesson',
  contentArtifactVersion: 1,
  source: source('8.2', 'Trigonometric Ratios', 114, 'ncert_jemh1_s8_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s8_2'],
    mayAssume: ['The six ratios and their reciprocals', 'That the ratios depend only on the angle', 'The Pythagoras relation'],
    mustNotIntroduce: [{ concept: 'Values at specific angles', belongsToSection: 'ncert_jemh1_s8_3' }],
  },
  learningGoal:
    'You will reconstruct a right triangle from one known trigonometric ratio and use it to find the remaining ratios of that angle.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Write sin A, cos A and tan A from a labelled right triangle.',
      'Find a missing side with the Pythagoras relation.',
      'Explain why enlarging a triangle leaves its ratios unchanged.',
    ],
    ifNotReady: 'Go back to the previous lesson. This one depends on knowing the ratios are fixed by the angle.',
  },
  vocabulary: [
    { term: 'scale factor', meaning: 'The number every side of a triangle is multiplied by to produce a similar triangle.' },
    { term: 'proportional representative', meaning: 'A convenient pair of actual lengths chosen to stand for a given ratio, such as 3 and 5 for the ratio 3 : 5.' },
  ],
  explanation: [
    'Suppose you are told sin A = 3/5 and nothing else. That is one number, and you are asked for the other five ratios. The move that makes this possible is the result from the last lesson: the ratios depend only on the angle, so any right triangle containing A will do.',
    'Read the statement carefully first. sin A = 3/5 says the opposite side and the hypotenuse are in the ratio 3 to 5. It does not say the opposite side is 3. There is no triangle of a fixed size here — there is a whole family of them, one for every positive k, with opposite 3k and hypotenuse 5k.',
    'That is exactly why we may pick a convenient member of the family. Take k = 1, so the opposite side is 3 and the hypotenuse is 5. We are not assuming the real triangle has those measurements; we are choosing a representative whose ratios are the same as every other member, which the previous lesson guarantees.',
    'Now the third side is forced. By the Pythagoras relation the adjacent leg satisfies adjacent squared = 5 squared minus 3 squared = 25 minus 9 = 16, so the adjacent side is 4. Note the subtraction: the hypotenuse is the longest side, so the square of a leg is found by subtracting, not adding.',
    'With all three sides in hand, every ratio follows: cos A = 4/5, tan A = 3/4, and the reciprocals cosec A = 5/3, sec A = 5/4, cot A = 4/3.',
    'If you prefer to keep the k, nothing changes. The adjacent side is 4k, and cos A = 4k/5k, where the k cancels. Carrying it through once is worth doing, because the cancellation is the visible form of the fact that the size does not matter.',
  ],
  representations: ['A right triangle with sides written as multiples of a common factor'],
  visuals: [F_FROM_RATIO],
  visualsById: { F_FROM_RATIO },
  workedExamples: [
    {
      id: 's82c.we1',
      prompt: 'Given sin A = 3/5, find cos A and tan A.',
      steps: [
        { text: 'sin A = 3/5 means opposite : hypotenuse = 3 : 5.', reasoning: 'Reading the definition back to front turns the number into a statement about two sides.' },
        { text: 'Choose the representative with opposite 3 and hypotenuse 5.', reasoning: 'Legitimate because every triangle with this angle gives the same ratios, so a convenient member answers for all of them.' },
        { text: 'Adjacent squared = 25 minus 9 = 16, so adjacent = 4.', reasoning: 'The hypotenuse is the longest side, so its square minus a leg squared gives the other leg squared.' },
        { text: 'cos A = 4/5 and tan A = 3/4.', reasoning: 'Adjacent over hypotenuse, and opposite over adjacent.' },
      ],
      answer: 'cos A = 4/5 and tan A = 3/4.',
      visualRef: 'F_FROM_RATIO',
    },
    {
      id: 's82c.we2',
      prompt: 'Given tan B = 8/15, find sin B and sec B.',
      steps: [
        { text: 'tan B = 8/15 means opposite : adjacent = 8 : 15.', reasoning: 'Tangent compares the two legs, so this time neither given side is the hypotenuse.' },
        { text: 'Take opposite 8 and adjacent 15; the hypotenuse squared is 64 + 225 = 289, so the hypotenuse is 17.', reasoning: 'Here the two legs are known, so the hypotenuse is found by adding their squares.' },
        { text: 'sin B = 8/17.', reasoning: 'Opposite over hypotenuse, using the leg of 8 that faces B and the hypotenuse of 17 just found.' },
        { text: 'sec B = 17/15.', reasoning: 'Secant is hypotenuse over adjacent, the reciprocal of cos B = 15/17.' },
      ],
      answer: 'sin B = 8/17 and sec B = 17/15.',
    },
    {
      id: 's82c.we3',
      prompt: 'Given cos A = 4/5, write the triangle with a general scale factor k and show the value of tan A does not depend on k.',
      steps: [
        { text: 'Write adjacent = 4k and hypotenuse = 5k for a positive k.', reasoning: 'This is the whole family of triangles with this cosine, not one chosen member.' },
        { text: 'Opposite squared = (5k) squared minus (4k) squared = 25k squared minus 16k squared = 9k squared, so opposite = 3k.', reasoning: 'The common factor survives the Pythagoras step because every term carries k squared.' },
        { text: 'tan A = 3k / 4k = 3/4.', reasoning: 'The k cancels, which is the algebraic form of the similarity result.' },
      ],
      answer: 'tan A = 3/4 for every k, so the answer does not depend on the size of the triangle.',
    },
  ],
  guidedPractice: [
    {
      id: 's82c.g1',
      prompt: 'Given cos A = 12/13, find sin A.',
      hint: 'Which side does 13 stand for, and which does 12 stand for?',
      answer: 'sin A = 5/13.',
      rationale: 'Adjacent : hypotenuse = 12 : 13, so the opposite satisfies 169 minus 144 = 25, giving 5. Then sin A is opposite over hypotenuse.',
    },
    {
      id: 's82c.g2',
      prompt: 'A student reads sin A = 7/25 as "the opposite side is 7 cm". What is wrong, and what is the correct reading?',
      hint: 'How many triangles satisfy this equation?',
      answer: 'The statement gives a ratio, not a length; the opposite side is 7k and the hypotenuse 25k for some positive k.',
      rationale: 'Infinitely many triangles have this sine. Choosing 7 and 25 is a legitimate convenience for computation, but it is a choice, not something the data stated.',
    },
    {
      id: 's82c.g3',
      prompt: 'Given cot A = 1, find sin A and cos A.',
      hint: 'cot A = 1 says something simple about the two legs.',
      answer: 'sin A = 1/\u221a2 and cos A = 1/\u221a2.',
      rationale: 'cot A = adjacent/opposite = 1 means the legs are equal; take each as 1, so the hypotenuse is \u221a2 and both ratios are 1/\u221a2.',
    },
  ],
  independentPractice: [
    {
      id: 's82c.i1',
      prompt: 'Given tan A = 5/12, find sin A, cos A and cosec A.',
      answer: 'sin A = 5/13, cos A = 12/13, cosec A = 13/5.',
      rationale: 'The legs are 5 and 12, so the hypotenuse squared is 25 + 144 = 169 and the hypotenuse is 13. The three ratios then follow from the definitions.',
    },
    {
      id: 's82c.i2',
      prompt: 'Given sec A = 25/24, find tan A.',
      answer: 'tan A = 7/24.',
      rationale: 'sec A is hypotenuse over adjacent, so hypotenuse 25 and adjacent 24. The opposite satisfies 625 minus 576 = 49, giving 7, and tan A is opposite over adjacent.',
    },
    {
      id: 's82c.i3',
      prompt: 'Given sin A = 1/3, find cos A in exact form.',
      answer: 'cos A = 2\u221a2 / 3.',
      rationale: 'Opposite 1 and hypotenuse 3 give adjacent squared = 9 minus 1 = 8, so the adjacent side is 2\u221a2 and cos A is that over 3. Leaving the radical keeps the value exact.',
    },
    {
      id: 's82c.i4',
      prompt: 'Explain why no acute angle can have sin A = 5/4.',
      answer: 'Because the opposite side can never exceed the hypotenuse.',
      rationale: 'The hypotenuse is the longest side of a right triangle, so opposite over hypotenuse is always less than 1. A sine greater than 1 describes no triangle.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's82c.td1',
      prompt: 'Why is it legitimate to take the sides as 3 and 5 when told only that sin A = 3/5? What earlier result are you relying on, and what would go wrong without it?',
      expectedReasoning:
        'The previous lesson proved the ratios depend only on the angle, so every triangle in the family 3k, 5k returns the same answers. Choosing k = 1 therefore computes the right numbers. Without that result, different members of the family could give different cosines and the choice would be arbitrary, so the question would have no determinate answer at all.',
    },
    {
      id: 's82c.td2',
      prompt: 'Given one ratio of an acute angle, can you always find the other five? Does your reasoning depend on which ratio you were given?',
      expectedReasoning:
        'Yes. Any one ratio fixes two sides up to a common factor, and the Pythagoras relation then forces the third, after which all six ratios can be written. Which ratio was given only changes whether the third side comes from adding or subtracting squares: if the hypotenuse is one of the two given sides you subtract, and if both given sides are legs you add.',
    },
  ],
  summary:
    'One trigonometric ratio fixes two sides of a right triangle up to a common factor. Choosing a convenient representative is legitimate because the ratios depend only on the angle, and the Pythagoras relation then supplies the third side, from which all six ratios follow. Subtract squares when the hypotenuse is given, add them when both legs are.',
  nextStep: 'Next you will find exact ratios for 30, 45 and 60 degrees by construction rather than from given data.',
  teacher: {
    objective: 'Students reconstruct a right triangle from one ratio and derive the remaining ratios.',
    prerequisiteKnowledge: ['The six ratios', 'Well-definedness of the ratios', 'The Pythagoras relation'],
    modelLanguage: [
      'The ratio is 3 to 5 — not 3 centimetres.',
      'We are choosing a representative, and we may because the size does not matter.',
      'Hypotenuse given? Subtract. Two legs given? Add.',
    ],
    teachingNotes: [
      'Carrying the k through once, as in the third worked example, is worth the extra line: watching it cancel is the algebraic image of the similarity proof and settles the "why may we pick 3 and 5" question permanently.',
      'The add-or-subtract decision is where most errors occur. Tie it to which side is the hypotenuse rather than to the shape of the formula.',
      'Watch for ratios being read as lengths, and for sines greater than 1 passing unnoticed.',
    ],
    quickChecks: [
      'Ask what sin A = 7/25 says about the triangle, in words.',
      'Ask whether a given ratio names one triangle or many.',
    ],
    supportForStrugglingLearners: [
      'Draw the triangle and write 3k, 4k, 5k on it before computing anything; the labels do the remembering.',
    ],
    extension: ['Ask which ratios of an acute angle must be less than 1 and which must be greater, and why.'],
    materialsNeeded: ['Ruler'],
  },
  reviewStatus: 'authored_draft',
};

/**
 * v0.84.0-c10.1 checkpoint 55 — the standard-angle values, once.
 *
 * Every ratio the 8.3a lesson states and every cell of its table is read
 * from here, and a test recomputes each entry from the triangles the lesson
 * actually derives. A table of trigonometric values retyped by hand is a
 * serious instructional defect waiting to happen: a single wrong cell is
 * invisible to a reader and fatal to everything built on it.
 *
 * `exact` is what the student sees; `value` is what the test checks against.
 * 0 and 90 degrees are deliberately absent — they belong to unit 8.3b.
 */
// v0.84.0-c10.15 checkpoint 69 — DERIVED, not retyped.
//
// This table used to hold its own copy of the 30/45/60 values. Checkpoint 69
// added the two boundary angles, and a second table would have been a second
// thing to disagree with. So the values now come from `specialAngles.ts`,
// which is the one source of truth for every standard angle and every ratio.
// The shape and the values are unchanged, so every existing consumer and
// test sees exactly what it saw before.
export const STANDARD_ANGLE_RATIOS: Array<{
  degrees: 30 | 45 | 60;
  sin: { exact: string; value: number };
  cos: { exact: string; value: number };
  tan: { exact: string; value: number };
}> = ACUTE_STANDARD_ANGLES.map((degrees) => {
  const read = (name: 'sin' | 'cos' | 'tan') => {
    const v = ratioAt(degrees, name);
    if (v.kind !== 'defined') {
      throw new Error(`${name} ${degrees} must be defined at an acute standard angle`);
    }
    return { exact: v.written, value: exactValue(v.exact) };
  };
  return {
    degrees: degrees as 30 | 45 | 60,
    sin: read('sin'),
    cos: read('cos'),
    tan: read('tan'),
  };
});

export const C10_SECTION_8_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s8_3_special_angles_lesson',
  contentArtifactVersion: 1,
  source: source('8.3', 'Trigonometric Ratios of Some Specific Angles', 121, 'ncert_jemh1_s8_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s8_2'],
    mayAssume: ['The six ratios', 'Angles of an equilateral triangle', 'Base angles of an isosceles triangle', 'The Pythagoras relation'],
    mustNotIntroduce: [
      { concept: 'Ratios at 0 and 90 degrees', belongsToSection: 'ncert_jemh1_s8_3' },
      { concept: 'Trigonometric identities', belongsToSection: 'ncert_jemh1_s8_4' },
    ],
  },
  learningGoal:
    'You will derive the exact trigonometric ratios of 30, 45 and 60 degrees from two special triangles, rather than reading them from a table.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the size of each angle in an equilateral triangle.',
      'Explain why the base angles of an isosceles triangle are equal.',
      'Use the Pythagoras relation to find a missing side.',
    ],
    ifNotReady: 'Revise the angle facts for equilateral and isosceles triangles. Both derivations begin from them.',
  },
  vocabulary: [
    { term: 'altitude', meaning: 'A segment from a vertex perpendicular to the opposite side.' },
    { term: 'equilateral triangle', meaning: 'A triangle with all three sides equal, and therefore all three angles 60 degrees.' },
    { term: 'isosceles right triangle', meaning: 'A right triangle whose two legs are equal, so its acute angles are both 45 degrees.' },
  ],
  explanation: [
    'For most angles, finding a trigonometric ratio needs methods beyond this chapter. For three angles it does not, because two familiar triangles hand us exact values with nothing more than the Pythagoras relation.',
    'Start with 45 degrees. A right triangle whose two legs are equal has equal base angles, and since they sum to 90 degrees each is 45. Take each leg as 1. The hypotenuse squared is 1 + 1 = 2, so the hypotenuse is \u221a2.',
    'Read off the ratios of the 45-degree angle: the opposite and adjacent sides are both 1 and the hypotenuse is \u221a2, so sin 45 = 1/\u221a2, cos 45 = 1/\u221a2, and tan 45 = 1/1 = 1. Both legs play both roles here, which is why sine and cosine agree.',
    'Now 30 and 60 together, from one picture. Take an equilateral triangle ABC of side 2 — every angle is 60 degrees — and drop the altitude AD to BC. The altitude of an equilateral triangle bisects both the base and the angle at the apex, so BD = 1 and the angle BAD is 30 degrees.',
    'Triangle ABD is now a right triangle with the right angle at D, hypotenuse AB = 2, base BD = 1, and angle B = 60, angle A = 30. The remaining side comes from Pythagoras: AD squared = 2 squared minus 1 squared = 4 minus 1 = 3, so AD = \u221a3.',
    'Read the 60-degree angle at B: the opposite side is AD = \u221a3, the adjacent is BD = 1, the hypotenuse is AB = 2. So sin 60 = \u221a3/2, cos 60 = 1/2, tan 60 = \u221a3.',
    'Read the 30-degree angle at A in the same triangle: now BD = 1 is opposite and AD = \u221a3 is adjacent, with the same hypotenuse 2. So sin 30 = 1/2, cos 30 = \u221a3/2, tan 30 = 1/\u221a3.',
    'The pattern between 30 and 60 is not a coincidence to memorise: the two angles sit in one triangle, and swapping which one you look from exchanges the opposite and adjacent sides. That is the same role-swap from the first lesson, and it is why sin 30 equals cos 60.',
    'Keep these values exact. \u221a3/2 is a number; 0.866 is a rounding of it, and errors accumulate when rounded values are carried into later work. Write 1/\u221a3 or its equivalent \u221a3/3 — they are the same number, and this book uses the first form.',
  ],
  representations: [
    'An isosceles right triangle with both legs 1',
    'An equilateral triangle of side 2 cut in half by its altitude',
  ],
  visuals: [F_ISOSCELES_RIGHT, F_HALF_EQUILATERAL],
  visualsById: { F_ISOSCELES_RIGHT, F_HALF_EQUILATERAL },
  workedExamples: [
    {
      id: 's83a.we1',
      prompt: 'Derive sin 45, cos 45 and tan 45 from an isosceles right triangle.',
      steps: [
        { text: 'In a right triangle with equal legs, the two acute angles are equal and sum to 90, so each is 45 degrees.', reasoning: 'Equal legs force equal base angles, and the angle sum of the triangle fixes their size.' },
        { text: 'Take each leg as 1; the hypotenuse squared is 1 + 1 = 2, so the hypotenuse is \u221a2.', reasoning: 'Any equal legs would do, since the ratios do not depend on size; 1 keeps the arithmetic clean.' },
        { text: 'For the 45-degree angle, opposite = 1, adjacent = 1, hypotenuse = \u221a2.', reasoning: 'Each leg touches one acute angle and faces the other, so from either angle the roles are one of each.' },
        { text: 'sin 45 = 1/\u221a2, cos 45 = 1/\u221a2, tan 45 = 1.', reasoning: 'Straight from the definitions; sine and cosine agree because the two legs are equal.' },
      ],
      answer: 'sin 45 = 1/\u221a2, cos 45 = 1/\u221a2, tan 45 = 1.',
      visualRef: 'F_ISOSCELES_RIGHT',
    },
    {
      id: 's83a.we2',
      prompt: 'Derive the ratios of 60 degrees from an equilateral triangle of side 2.',
      steps: [
        { text: 'Draw equilateral triangle ABC of side 2 and the altitude AD to BC.', reasoning: 'Cutting the equilateral triangle is what produces a right triangle containing a 60-degree angle.' },
        { text: 'AD bisects BC, so BD = 1, and triangle ABD has a right angle at D.', reasoning: 'In an equilateral triangle the altitude from a vertex is also the median, so it meets BC at its midpoint.' },
        { text: 'AD squared = 4 minus 1 = 3, so AD = \u221a3.', reasoning: 'Pythagoras in triangle ABD, with hypotenuse AB = 2 and leg BD = 1.' },
        { text: 'From angle B = 60: opposite = AD = \u221a3, adjacent = BD = 1, hypotenuse = AB = 2.', reasoning: 'AD faces B and BD touches it, so the naming follows the rule from the first lesson.' },
        { text: 'sin 60 = \u221a3/2, cos 60 = 1/2, tan 60 = \u221a3/1 = \u221a3.', reasoning: 'Read from the definitions with those side names.' },
      ],
      answer: 'sin 60 = \u221a3/2, cos 60 = 1/2, tan 60 = \u221a3.',
      visualRef: 'F_HALF_EQUILATERAL',
    },
    {
      id: 's83a.we3',
      prompt: 'From the same triangle ABD, derive the ratios of 30 degrees, and explain the relationship with 60 degrees.',
      steps: [
        { text: 'The angle at A in triangle ABD is 30 degrees, since the altitude bisects the 60-degree apex angle.', reasoning: 'The altitude of an equilateral triangle is also the angle bisector at the apex.' },
        { text: 'From angle A: opposite = BD = 1, adjacent = AD = \u221a3, hypotenuse = AB = 2.', reasoning: 'BD now faces the reference angle and AD touches it — the two legs have exchanged roles.' },
        { text: 'sin 30 = 1/2, cos 30 = \u221a3/2, tan 30 = 1/\u221a3.', reasoning: 'The same definitions applied to the names that belong to A.' },
        { text: 'Compare: sin 30 = cos 60 and cos 30 = sin 60.', reasoning: 'The two angles live in one triangle and the leg roles swapped between them, so the ratios swap too. No extra rule is involved.' },
      ],
      answer: 'sin 30 = 1/2, cos 30 = \u221a3/2, tan 30 = 1/\u221a3, with sin 30 = cos 60 and cos 30 = sin 60.',
      visualRef: 'F_HALF_EQUILATERAL',
    },
  ],
  guidedPractice: [
    {
      id: 's83a.g1',
      prompt: 'Why must each acute angle of a right triangle with equal legs be 45 degrees?',
      hint: 'Use the equal legs first, then the angle sum.',
      answer: 'Equal legs give equal base angles; the two acute angles sum to 90, so each is 45.',
      rationale: 'Both facts are needed: equality alone does not fix the size, and the angle sum alone does not make them equal.',
    },
    {
      id: 's83a.g2',
      prompt: 'In the half-equilateral triangle, why is BD exactly 1 when the side is 2?',
      hint: 'What else is the altitude of an equilateral triangle?',
      answer: 'Because the altitude is also the median, so it bisects BC, giving BD = 1.',
      rationale: 'If the altitude did not bisect the base, BD would be unknown and the derivation would stall before Pythagoras.',
    },
    {
      id: 's83a.g3',
      prompt: 'Find tan 60 divided by tan 30, in exact form.',
      hint: 'Write both as exact values first.',
      answer: '3.',
      rationale: 'tan 60 = \u221a3 and tan 30 = 1/\u221a3, so the quotient is \u221a3 times \u221a3 = 3. Working with the exact values avoids the rounding a decimal would introduce.',
    },
  ],
  independentPractice: [
    {
      id: 's83a.i1',
      prompt: 'Find the exact value of sin 30 + cos 60.',
      answer: '1.',
      rationale: 'Both equal 1/2, so the sum is 1. They are equal because the 30 and 60 degree angles share the half-equilateral triangle with the leg roles exchanged.',
    },
    {
      id: 's83a.i2',
      prompt: 'Find the exact value of sin 45 times cos 45.',
      answer: '1/2.',
      rationale: 'Both are 1/\u221a2, and their product is 1/2.',
    },
    {
      id: 's83a.i3',
      prompt: 'A right triangle has a 30-degree angle and a hypotenuse of 10 cm. Find the side opposite the 30-degree angle.',
      answer: '5 cm.',
      rationale: 'sin 30 = opposite/hypotenuse = 1/2, so the opposite side is half the hypotenuse. This is the familiar fact that the side facing 30 degrees is half the hypotenuse.',
    },
    {
      id: 's83a.i4',
      prompt: 'Without using a table, explain why tan 60 is greater than tan 45.',
      answer: 'Because \u221a3 is greater than 1.',
      rationale: 'From the derivations, tan 60 = \u221a3 and tan 45 = 1. Geometrically, a steeper angle gives a longer opposite side against the same adjacent side.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's83a.td1',
      prompt: 'Derive sin 30 without looking at any table, stating every geometric fact you rely on.',
      expectedReasoning:
        'Start from an equilateral triangle of side 2, in which every angle is 60 degrees. Drop the altitude from a vertex: in an equilateral triangle it is also the median and the angle bisector, so it meets the base at its midpoint and halves the apex angle. That produces a right triangle with hypotenuse 2, base 1 and apex angle 30 degrees. For the 30-degree angle the opposite side is the base, 1, so sin 30 = 1/2. The facts relied on are the angles of an equilateral triangle and the altitude being a median and bisector.',
    },
    {
      id: 's83a.td2',
      prompt: 'Why does sin 30 equal cos 60? Answer from the triangle rather than by quoting a rule.',
      expectedReasoning:
        'The 30 and 60 degree angles are the two acute angles of the same right triangle. The leg that faces the 30-degree angle is the leg that touches the 60-degree one, so what counts as opposite for one counts as adjacent for the other, while the hypotenuse is shared. sin 30 and cos 60 are therefore the same two lengths in the same order, and must be equal.',
    },
  ],
  summary:
    'An isosceles right triangle with legs 1 gives hypotenuse \u221a2, so sin 45 = cos 45 = 1/\u221a2 and tan 45 = 1. An equilateral triangle of side 2 cut by its altitude gives a right triangle with sides 1, \u221a3 and 2, from which sin 60 = \u221a3/2, cos 60 = 1/2, tan 60 = \u221a3, and reading the same triangle from its other acute angle gives sin 30 = 1/2, cos 30 = \u221a3/2, tan 30 = 1/\u221a3.',
  nextStep: 'Next you will look at what happens to these ratios as the angle approaches 0 and 90 degrees.',
  teacher: {
    objective: 'Students derive the exact ratios of 30, 45 and 60 degrees from two constructions rather than recalling a table.',
    prerequisiteKnowledge: ['Angles of equilateral and isosceles triangles', 'Altitude as median and bisector in an equilateral triangle', 'The Pythagoras relation'],
    modelLanguage: [
      'Where does this number come from? Point at the triangle.',
      'Keep it exact — \u221a3/2, not 0.866.',
      '30 and 60 live in the same triangle; the roles swap.',
    ],
    teachingNotes: [
      'Both derivations are short enough to be done rather than watched. A student who has cut the equilateral triangle once can rebuild the values years later; one who has only met the table cannot.',
      'The sin 30 = cos 60 relationship should be read off the shared triangle, not offered as a rule. It is the role-swap from the first lesson in numerical form.',
      'Watch for rounded values entering the work, and for the altitude being assumed to bisect the base without the reason being given.',
    ],
    quickChecks: [
      'Ask where the \u221a3 in sin 60 comes from.',
      'Ask which triangle you would draw to recover tan 45.',
    ],
    supportForStrugglingLearners: [
      'Cut a paper equilateral triangle along its altitude and label the halves before any algebra.',
    ],
    extension: ['Ask what the ratios of 30 and 60 would be if the equilateral side were taken as 4 instead of 2, and why the answers do not change.'],
    materialsNeeded: ['Ruler', 'Compasses', 'Paper to fold or cut'],
  },
  reviewStatus: 'authored_draft',
};

export const CLASS10_TRIGONOMETRY_SECTIONS: AuthoredSection[] = [
  C10_SECTION_8_2A,
  C10_SECTION_8_2B,
  C10_SECTION_8_2C,
  C10_SECTION_8_3A,
];
