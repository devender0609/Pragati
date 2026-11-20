// ===========================================================================
// v0.84.0-c10.14 checkpoint 68 — CLASS 10 COORDINATE GEOMETRY.
//
// PROCEDURAL_EXTENSION. The frozen Class 9 record has five coordinate
// lessons, and they already DERIVE the distance formula, test collinearity
// with it, and locate the midpoint. So distance is revision here, not
// introduction. The section formula is the new object \u2014 the decomposition
// marks 7.3a NEW_NAMED_OBJECT while the rest are extensions.
//
// Every coordinate, distance, midpoint, section point and ratio in these
// lessons comes from one Point model.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), \u00a77.2
// (folio 100) and \u00a77.3 (folio 106). \u00a77.1 and \u00a77.4 are REVIEW and earn no
// units. Scope: distance and internal section only. Area of a triangle is
// ABSENT from this edition and is not taught.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  approxDistance, classifyQuadrilateral, collinearByDistance, distance,
  distanceSquared, formatPoint, formatRadical, formatRational,
  midpoint, pt, ratioOf, sectionPoint, type Point,
} from './coordinateGeometry';

export const COORDINATE_CHAPTER_ID = 'ncert_jemh1_ch07';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (sectionNumber: string, exactTitle: string, startPage: number, officialSectionId: string) => ({
  officialChapterId: COORDINATE_CHAPTER_ID, officialSectionId, sectionNumber, exactTitle,
  startPage, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

/** What the frozen Class 9 record already established. */
export const CLASS_9_COORDINATE_PRIOR = {
  source: 'src/curriculum/coordinatesSections.ts (Class 9 Chapter 1, frozen, 5 lessons)',
  alreadyCovered: [
    'the plane located by an ordered pair against two perpendicular axes',
    'quadrants, and the forms (x, 0) and (0, y)',
    'the distance between two points, DERIVED by completing a right triangle',
    'using distance to test whether three points are collinear',
    'the midpoint of a segment',
  ],
  genuinelyNewInClass10: [
    'the section formula for a point dividing a segment in any positive ratio',
    'recovering the ratio from a known dividing point',
    'classifying a quadrilateral from the distances between its vertices',
    'locating a point from an equidistance condition',
  ],
};

// --- the canonical points --------------------------------------------------

export const A_1_2 = pt('A', 1, 2);
export const B_4_6 = pt('B', 4, 6);
export const O_0_0 = pt('O', 0, 0);
export const P_5_12 = pt('P', 5, 12);
export const Q_2_4 = pt('Q', 2, 4);
export const R_5_7 = pt('R', 5, 7);

/** Three collinear points, with B between. */
export const COL_A = pt('A', 1, 2);
export const COL_B = pt('B', 2, 4);
export const COL_C = pt('C', 3, 6);

/** A square. */
export const SQ = [pt('A', 0, 0), pt('B', 4, 0), pt('C', 4, 4), pt('D', 0, 4)] as const;
/** A rhombus that is not a square \u2014 equal sides, unequal diagonals. */
export const RH = [pt('A', 0, 0), pt('B', 3, 4), pt('C', 8, 4), pt('D', 5, 0)] as const;
/** A rectangle. */
export const RECT = [pt('A', 0, 0), pt('B', 6, 0), pt('C', 6, 3), pt('D', 0, 3)] as const;

/** Section examples. */
export const SEC_A = pt('A', 1, 3);
export const SEC_B = pt('B', 5, 7);

export const CANONICAL_POINTS: Point[] = [
  A_1_2, B_4_6, O_0_0, P_5_12, Q_2_4, R_5_7, COL_A, COL_B, COL_C, SEC_A, SEC_B,
  ...SQ, ...RH, ...RECT,
];

const D = (p: Point, q: Point) => formatRadical(distance(p, q));
const S = (a: Point, b: Point, m1: number, m2: number) => formatPoint(sectionPoint(a, b, m1, m2));

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_7_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s7_2_distance_lesson',
  contentArtifactVersion: 1,
  source: source('7.2', 'Distance Formula', 100, 'ncert_jemh1_s7_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['The coordinate plane, abscissa and ordinate from Class IX', 'The distance formula derived in Class IX', 'The Pythagorean theorem'],
    mustNotIntroduce: [
      { concept: 'Quadrilateral classification and equidistance', belongsToSection: 'ncert_jemh1_s7_2b' },
      { concept: 'The section formula', belongsToSection: 'ncert_jemh1_s7_3' },
    ],
  },
  learningGoal:
    'You will re-derive the distance between two points from the right triangle their coordinate differences form, and give distances exactly.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Plot a point from its coordinates.', 'Use the Pythagorean theorem.', 'Simplify a square root such as \u221a18.'],
    ifNotReady: 'Revise coordinate geometry from Class IX. You derived this formula there; here it is re-derived and then used harder.',
  },
  vocabulary: [
    { term: 'abscissa', meaning: 'The x-coordinate of a point \u2014 its distance from the y-axis, with sign.' },
    { term: 'ordinate', meaning: 'The y-coordinate of a point.' },
    { term: 'distance formula', meaning: 'PQ = \u221a[(x\u2082 \u2212 x\u2081)\u00b2 + (y\u2082 \u2212 y\u2081)\u00b2], the distance between two points from their coordinates.' },
  ],
  explanation: [
    'You derived the distance formula in Class IX and used it to test collinearity and to find midpoints. Class 10 re-derives it, because the applications ahead are heavier and the section formula to come is built on the same kind of reasoning.',
    'Take two points P(x\u2081, y\u2081) and Q(x\u2082, y\u2082). The horizontal difference between them is x\u2082 \u2212 x\u2081 and the vertical difference is y\u2082 \u2212 y\u2081.',
    'Complete the right triangle: travel horizontally from P until you are directly below or above Q, then vertically to Q. The horizontal leg has length |x\u2082 \u2212 x\u2081| and the vertical leg |y\u2082 \u2212 y\u2081|, and they meet at a right angle because one runs parallel to the x-axis and the other to the y-axis, and the axes are perpendicular.',
    'PQ is the hypotenuse of that triangle, so by the Pythagorean theorem PQ\u00b2 = (x\u2082 \u2212 x\u2081)\u00b2 + (y\u2082 \u2212 y\u2081)\u00b2, and PQ = \u221a[(x\u2082 \u2212 x\u2081)\u00b2 + (y\u2082 \u2212 y\u2081)\u00b2].',
    'The right angle is not something the drawing happens to show. It follows from the two legs being parallel to perpendicular axes, which is why the derivation works wherever the points lie, including across quadrants.',
    'Two things about signs. First, the differences are SQUARED, so x\u2082 \u2212 x\u2081 and x\u2081 \u2212 x\u2082 give the same contribution \u2014 which is why PQ and QP come out equal, as they must. No absolute-value sign is needed as a separate correction; the square already does that work.',
    'Second, only the non-negative square root is taken. A distance cannot be negative, so there is no \u00b1 here.',
    `Keep distances exact. For P${formatPoint(Q_2_4)} and Q${formatPoint(R_5_7)} the squared distance is ${formatRational(distanceSquared(Q_2_4, R_5_7))}, so the distance is ${D(Q_2_4, R_5_7)} \u2014 written that way, not as ${approxDistance(distance(Q_2_4, R_5_7))}, unless an approximation is wanted and is labelled as one.`,
    `Some pairs give whole numbers. From the origin to ${formatPoint(P_5_12)} the squared distance is ${formatRational(distanceSquared(O_0_0, P_5_12))} and the distance is exactly ${D(O_0_0, P_5_12)}.`,
  ],
  representations: ['Two plotted points with the horizontal and vertical legs drawn and the hypotenuse marked'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's72a.we1',
      prompt: 'Derive the distance between P(x\u2081, y\u2081) and Q(x\u2082, y\u2082).',
      steps: [
        { text: 'The horizontal difference is x\u2082 \u2212 x\u2081 and the vertical difference is y\u2082 \u2212 y\u2081.', reasoning: 'These are the two separate ways the points differ, and the plane lets them be treated independently.' },
        { text: 'Complete a right triangle by moving horizontally from P and then vertically to Q.', reasoning: 'The third vertex is the point with P\u2019s ordinate and Q\u2019s abscissa, so both legs are easy to measure.' },
        { text: 'The legs meet at a right angle, since one is parallel to the x-axis and the other to the y-axis, and the axes are perpendicular.', reasoning: 'The right angle comes from the coordinate system itself, not from how the figure is drawn.' },
        { text: 'PQ is the hypotenuse, so PQ\u00b2 = (x\u2082 \u2212 x\u2081)\u00b2 + (y\u2082 \u2212 y\u2081)\u00b2 by the Pythagorean theorem.', reasoning: 'The theorem applies because the triangle has been shown to be right-angled rather than assumed to be.' },
        { text: 'Taking the non-negative root, PQ = \u221a[(x\u2082 \u2212 x\u2081)\u00b2 + (y\u2082 \u2212 y\u2081)\u00b2].', reasoning: 'Only the non-negative root is taken, since a distance cannot be negative.' },
      ],
      answer: 'PQ = \u221a[(x\u2082 \u2212 x\u2081)\u00b2 + (y\u2082 \u2212 y\u2081)\u00b2].',
    },
    {
      id: 's72a.we2',
      prompt: `Find the distance between ${formatPoint(A_1_2)} and ${formatPoint(B_4_6)}.`,
      steps: [
        { text: 'Horizontal difference: 4 \u2212 1 = 3.', reasoning: 'Taking the second abscissa minus the first; the opposite order would give \u22123 and square to the same thing.' },
        { text: 'Vertical difference: 6 \u2212 2 = 4.', reasoning: 'The same subtraction applied to the ordinates, keeping the points in the same order.' },
        { text: `Squared distance: 3\u00b2 + 4\u00b2 = ${formatRational(distanceSquared(A_1_2, B_4_6))}.`, reasoning: 'Both legs contribute their squares, which is the Pythagorean relation for this triangle.' },
        { text: `So the distance is ${D(A_1_2, B_4_6)}.`, reasoning: 'A 3-4-5 triangle, so the root is exact and no approximation is needed.' },
      ],
      answer: `${D(A_1_2, B_4_6)}.`,
    },
    {
      id: 's72a.we3',
      prompt: `Find the distance between ${formatPoint(Q_2_4)} and ${formatPoint(R_5_7)}, exactly.`,
      steps: [
        { text: 'The differences are 5 \u2212 2 = 3 and 7 \u2212 4 = 3.', reasoning: 'Both legs happen to be equal here, which will show in the form of the answer.' },
        { text: `Squared distance: 3\u00b2 + 3\u00b2 = ${formatRational(distanceSquared(Q_2_4, R_5_7))}.`, reasoning: 'The sum is not a perfect square, so the distance will be irrational.' },
        { text: `\u221a18 simplifies to ${D(Q_2_4, R_5_7)}, since 18 = 9 \u00d7 2.`, reasoning: 'Pulling out the perfect-square factor gives the simplest exact form.' },
        { text: `If an approximation is wanted it is about ${approxDistance(distance(Q_2_4, R_5_7))}, and should be labelled approximate.`, reasoning: `${D(Q_2_4, R_5_7)} is the exact value; the decimal is a rounded stand-in and loses information.` },
      ],
      answer: `${D(Q_2_4, R_5_7)} (approximately ${approxDistance(distance(Q_2_4, R_5_7))}).`,
    },
  ],
  guidedPractice: [
    { id: 's72a.g1', prompt: `Find the distance from the origin to ${formatPoint(P_5_12)}.`, hint: 'Both differences are just the coordinates.', answer: `${D(O_0_0, P_5_12)}.`, rationale: `5\u00b2 + 12\u00b2 = ${formatRational(distanceSquared(O_0_0, P_5_12))}, and \u221a169 = ${D(O_0_0, P_5_12)}.` },
    { id: 's72a.g2', prompt: 'Why does swapping the two points leave the distance unchanged?', hint: 'What happens to each difference?', answer: 'Because the differences are squared.', rationale: 'Swapping reverses the sign of each difference, and squaring removes the sign, so both orders give the same sum.' },
    { id: 's72a.g3', prompt: 'Why is only the positive square root taken?', hint: 'What is being measured?', answer: 'Because a distance cannot be negative.', rationale: 'The equation PQ\u00b2 = ... has two algebraic roots, but only the non-negative one measures a length.' },
  ],
  independentPractice: [
    { id: 's72a.i1', prompt: `Find the distance between ${formatPoint(pt('A', 0, 0))} and ${formatPoint(pt('B', 8, 15))}.`, answer: `${formatRadical(distance(pt('A', 0, 0), pt('B', 8, 15)))}.`, rationale: '64 + 225 = 289, and \u221a289 = 17.' },
    { id: 's72a.i2', prompt: 'Find the distance between (\u22122, 1) and (1, 5).', answer: '5.', rationale: 'The differences are 3 and 4, so the squared distance is 25 and the distance is 5. Negative coordinates change nothing in the method.' },
    { id: 's72a.i3', prompt: 'A student writes the distance as \u00b1\u221a29. What is wrong?', answer: 'A distance has no negative value.', rationale: 'Only the non-negative root measures a length, so the answer is \u221a29.' },
    { id: 's72a.i4', prompt: 'Why does the derivation not need absolute-value signs on the differences?', answer: 'Because the differences are squared.', rationale: 'Squaring already removes any sign, so writing |x\u2082 \u2212 x\u2081| would be correct but redundant.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's72a.td1',
      prompt: 'Why does swapping P and Q leave the distance unchanged, and where exactly does that come from in the derivation?',
      expectedReasoning:
        'Swapping the points reverses both differences: x\u2082 \u2212 x\u2081 becomes x\u2081 \u2212 x\u2082, and likewise for the ordinates. Each is then squared, and a number and its negative have the same square, so both terms of the sum are unchanged and the distance is the same. It comes from the Pythagorean step, where the legs enter as squares because that is what the theorem relates. Geometrically it is obvious \u2014 the distance from P to Q is the distance from Q to P \u2014 and the algebra agreeing with that is a check that the derivation is right.',
    },
    {
      id: 's72a.td2',
      prompt: 'The derivation says the triangle is right-angled. Why is that not something read off the drawing?',
      expectedReasoning:
        'Because it follows from the coordinate system. One leg is drawn parallel to the x-axis and the other parallel to the y-axis, and those axes are perpendicular by the definition of the plane, so the legs meet at a right angle wherever the points happen to be. Reading it off a drawing would make the derivation depend on that particular picture, and it would then be unclear whether the formula still held for points in different quadrants or for a nearly flat triangle. Deriving the right angle from the axes makes the result general.',
    },
  ],
  summary:
    `The horizontal and vertical differences x\u2082 \u2212 x\u2081 and y\u2082 \u2212 y\u2081 are the legs of a right triangle \u2014 right-angled because the axes are perpendicular, not because the picture looks it \u2014 and PQ is its hypotenuse, so PQ = \u221a[(x\u2082 \u2212 x\u2081)\u00b2 + (y\u2082 \u2212 y\u2081)\u00b2]. The squaring makes the order of subtraction irrelevant, and only the non-negative root is taken. Keep answers exact: ${D(Q_2_4, R_5_7)}, not ${approxDistance(distance(Q_2_4, R_5_7))}, unless an approximation is asked for.`,
  nextStep: 'Next you will use distances to settle questions about collinearity, quadrilaterals and equidistant points.',
  teacher: teacher(
    'Students re-derive the distance formula from the right triangle and give exact distances.',
    ['Coordinate plane and distance (Class IX)', 'Pythagoras'],
    ['Where does the right angle come from?', 'Exact or rounded?', 'Does the order of subtraction matter?'],
    [
      'This is re-derivation. Say so \u2014 students derived it in Class IX and will disengage if it is presented as new.',
      'The right angle coming from the axes rather than the drawing is the step worth dwelling on; it is what makes the formula general.',
      'Insist on exact radicals. Decimals here breed rounding errors in the applications that follow.',
    ],
    ['Ask why PQ = QP.', 'Ask why there is no \u00b1.'],
    ['Have the student write both differences on the figure before squaring anything.'],
    ['Ask what the formula gives when the two points share an abscissa.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_7_2B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s7_2_applications_lesson',
  contentArtifactVersion: 1,
  source: source('7.2', 'Distance Formula', 100, 'ncert_jemh1_s7_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s7_2'],
    mayAssume: ['The distance formula', 'Collinearity by distance from Class IX', 'Properties of squares, rectangles and rhombuses'],
    mustNotIntroduce: [{ concept: 'The section formula', belongsToSection: 'ncert_jemh1_s7_3' }],
  },
  learningGoal:
    'You will use distances to test collinearity, to classify a quadrilateral from its vertices, and to find a point satisfying an equidistance condition.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute a distance from coordinates.', 'Say what makes a quadrilateral a square rather than a rhombus.', 'Solve a linear equation.'],
    ifNotReady: 'Revise the previous lesson. Every method here is the distance formula applied with care about what the evidence supports.',
  },
  vocabulary: [
    { term: 'collinear', meaning: 'Lying on one straight line.' },
    { term: 'equidistant', meaning: 'At the same distance from two or more given points.' },
    { term: 'diagonal', meaning: 'A segment joining two non-adjacent vertices of a quadrilateral.' },
  ],
  explanation: [
    'You tested collinearity with distances in Class IX. Class 10 keeps that method and adds two harder uses of the same tool.',
    'COLLINEARITY. Three points A, B and C are collinear exactly when one of the three distances equals the sum of the other two. If AB + BC = AC, the three lie on a line and B lies BETWEEN A and C.',
    'Which sum holds matters, because it identifies the middle point. Checking only that "two of them add to the third" and stopping leaves the ordering unknown, and the ordering is usually part of the answer.',
    `For ${formatPoint(COL_A)}, ${formatPoint(COL_B)} and ${formatPoint(COL_C)}: AB = ${D(COL_A, COL_B)}, BC = ${D(COL_B, COL_C)} and AC = ${D(COL_A, COL_C)}. Since AB + BC = AC, the points are collinear with ${collinearByDistance(COL_A, COL_B, COL_C).between} between the other two.`,
    'QUADRILATERALS. Given four vertices, compute the four sides and both diagonals, and let the numbers decide the name.',
    'Here the evidence has to match the claim. Four equal sides make a RHOMBUS. They do not make a square \u2014 a rhombus can be pushed over and keep all four sides equal while its diagonals differ. What distinguishes a square is that the diagonals are equal as well.',
    `Two cases with equal sides: ${SQ.map(formatPoint).join(', ')} has all sides ${D(SQ[0], SQ[1])} and both diagonals ${D(SQ[0], SQ[2])}, so it is a ${classifyQuadrilateral(SQ[0], SQ[1], SQ[2], SQ[3])}. But ${RH.map(formatPoint).join(', ')} also has all sides ${D(RH[0], RH[1])}, while its diagonals are ${D(RH[0], RH[2])} and ${D(RH[1], RH[3])} \u2014 unequal, so it is a ${classifyQuadrilateral(RH[0], RH[1], RH[2], RH[3])}, not a square.`,
    'EQUIDISTANT POINTS. To find a point equidistant from two others, set the two squared distances equal. Squaring both sides at the start avoids the roots entirely, and because both sides are non-negative no solutions are gained or lost by it. Then check the answer in the original condition.',
  ],
  representations: ['Four plotted vertices with all sides and both diagonals labelled by their exact lengths'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's72b.we1',
      prompt: `Are ${formatPoint(COL_A)}, ${formatPoint(COL_B)} and ${formatPoint(COL_C)} collinear? If so, which lies between the others?`,
      steps: [
        { text: `AB: differences 1 and 2, so AB = ${D(COL_A, COL_B)}.`, reasoning: 'Each distance is computed from the same two points that the figure plots, so no separate numbers enter.' },
        { text: `BC: differences 1 and 2, so BC = ${D(COL_B, COL_C)}.`, reasoning: 'The same differences, which already suggests B sits halfway along.' },
        { text: `AC: differences 2 and 4, so AC = ${D(COL_A, COL_C)}.`, reasoning: 'The full span, against which the two parts will be compared.' },
        { text: `AB + BC = ${D(COL_A, COL_B)} + ${D(COL_B, COL_C)} = ${D(COL_A, COL_C)} = AC.`, reasoning: 'The two parts add to the whole, which can only happen if the three points lie on one line.' },
        { text: `So they are collinear, and ${collinearByDistance(COL_A, COL_B, COL_C).between} lies between A and C.`, reasoning: 'It is the sum that holds which names the middle point; a different sum would have named a different one.' },
      ],
      answer: `Collinear, with ${collinearByDistance(COL_A, COL_B, COL_C).between} between.`,
    },
    {
      id: 's72b.we2',
      prompt: `Classify the quadrilateral with vertices ${RH.map(formatPoint).join(', ')}.`,
      steps: [
        { text: `All four sides: AB = ${D(RH[0], RH[1])}, BC = ${D(RH[1], RH[2])}, CD = ${D(RH[2], RH[3])}, DA = ${D(RH[3], RH[0])}.`, reasoning: 'Computing all four rather than two guards against a shape that is equal on one pair only.' },
        { text: 'All four are equal, so the quadrilateral is at least a rhombus.', reasoning: 'Equal sides is the rhombus condition, and every square is a rhombus too, so this does not yet settle the name.' },
        { text: `Now the diagonals: AC = ${D(RH[0], RH[2])} and BD = ${D(RH[1], RH[3])}.`, reasoning: 'The diagonals are what separate a square from a rhombus that has been pushed over.' },
        { text: 'They are unequal, so it is not a square.', reasoning: 'A square has equal diagonals; unequal ones rule it out despite the four equal sides.' },
        { text: `The quadrilateral is a ${classifyQuadrilateral(RH[0], RH[1], RH[2], RH[3])}.`, reasoning: 'The name rests on the computed lengths rather than on how the figure looks when plotted.' },
      ],
      answer: `A ${classifyQuadrilateral(RH[0], RH[1], RH[2], RH[3])}.`,
    },
    {
      id: 's72b.we3',
      prompt: 'Find the point on the x-axis equidistant from (2, \u22125) and (\u22122, 9).',
      steps: [
        { text: 'A point on the x-axis has the form (x, 0), so there is one unknown.', reasoning: 'The axis condition fixes the ordinate at 0, which is why one equation will be enough.' },
        { text: 'Set the squared distances equal: (x \u2212 2)\u00b2 + 25 = (x + 2)\u00b2 + 81.', reasoning: 'Working with squared distances avoids the roots, and both sides are non-negative so no solutions are gained or lost.' },
        { text: 'Expanding: x\u00b2 \u2212 4x + 4 + 25 = x\u00b2 + 4x + 4 + 81, so \u22128x = 56.', reasoning: 'The x\u00b2 terms cancel, leaving a linear equation \u2014 which is why this method is manageable by hand.' },
        { text: 'So x = \u22127 and the point is (\u22127, 0).', reasoning: 'A single solution, as expected for a point constrained to a line.' },
        { text: `Check: the squared distances are ${formatRational(distanceSquared(pt('T', -7, 0), pt('A', 2, -5)))} and ${formatRational(distanceSquared(pt('T', -7, 0), pt('B', -2, 9)))}, which agree.`, reasoning: 'Verifying in the original condition confirms no step introduced a solution that does not satisfy it.' },
      ],
      answer: '(\u22127, 0).',
    },
  ],
  guidedPractice: [
    { id: 's72b.g1', prompt: 'Three distances are 5, 8 and 13. Could the points be collinear, and which is between?', hint: 'Which sum holds?', answer: 'Yes \u2014 the point separating the 5 and the 8.', rationale: '5 + 8 = 13, so the two shorter parts make up the longest, and the point common to them lies between the other two.' },
    { id: 's72b.g2', prompt: `Is ${SQ.map(formatPoint).join(', ')} a square?`, hint: 'Check sides and diagonals.', answer: 'Yes.', rationale: `All four sides are ${D(SQ[0], SQ[1])} and both diagonals are ${D(SQ[0], SQ[2])}, so equal sides and equal diagonals together give a square.` },
    { id: 's72b.g3', prompt: 'Why do four equal sides not prove a square?', hint: 'What else can have them?', answer: 'Because a rhombus has them too.', rationale: 'A rhombus pushed over keeps its four equal sides while its diagonals become unequal, so the diagonals must be checked.' },
  ],
  independentPractice: [
    { id: 's72b.i1', prompt: `Classify ${RECT.map(formatPoint).join(', ')}.`, answer: `A ${classifyQuadrilateral(RECT[0], RECT[1], RECT[2], RECT[3])}.`, rationale: `Opposite sides are equal at ${D(RECT[0], RECT[1])} and ${D(RECT[1], RECT[2])}, and the diagonals are both ${D(RECT[0], RECT[2])}, so it is a rectangle rather than a square.` },
    { id: 's72b.i2', prompt: 'Are (0, 0), (1, 5) and (3, 1) collinear?', answer: 'No.', rationale: 'No one of the three distances equals the sum of the other two, so the points form a genuine triangle.' },
    { id: 's72b.i3', prompt: 'A student concludes a quadrilateral is a square from four equal sides alone. What is missing?', answer: 'The diagonals.', rationale: 'Equal sides give a rhombus; equal diagonals as well are what make it a square.' },
    { id: 's72b.i4', prompt: 'Why is it safe to square both sides when setting two distances equal?', answer: 'Because both sides are non-negative.', rationale: 'Squaring is reversible for non-negative quantities, so no solution is gained or lost \u2014 though checking the answer is still worth doing.' },
    { id: 's72b.i5', prompt: 'Does distance evidence alone tell you the ORDER of three collinear points?', answer: 'Yes, if you note which sum holds.', rationale: 'The point whose two distances add to the third lies between the other two, so identifying the sum identifies the middle point.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's72b.td1',
      prompt: 'Four equal sides, yet not necessarily a square. Explain what the extra evidence does.',
      expectedReasoning:
        'Equal sides fix the lengths but not the angles. A rhombus can be pushed over from a square: the four sides stay equal while the angles change, so sides alone cannot distinguish the two. The diagonals respond to the angles \u2014 as the shape leans, one diagonal lengthens and the other shortens \u2014 so equal diagonals are exactly the extra condition that forces the angles back to right angles. That is why the argument checks both. Naming a shape from insufficient evidence is the error, not the arithmetic.',
    },
    {
      id: 's72b.td2',
      prompt: 'Why does identifying WHICH sum holds matter in a collinearity test?',
      expectedReasoning:
        'Because the sum that holds names the point lying between the other two, and that ordering is usually what the question is really about. If AB + BC = AC then B is between A and C; if instead AB + AC = BC then A is. Simply observing that some two distances add to the third establishes collinearity but leaves the arrangement open, and a later step \u2014 finding a midpoint, or a ratio \u2014 often depends on knowing it. The arithmetic is the same either way; what differs is how much of the answer you have extracted from it.',
    },
  ],
  summary:
    `Collinearity: three points lie on a line exactly when one distance equals the sum of the other two, and WHICH sum holds names the point between \u2014 for ${formatPoint(COL_A)}, ${formatPoint(COL_B)}, ${formatPoint(COL_C)} it is ${collinearByDistance(COL_A, COL_B, COL_C).between}. Quadrilaterals: compute all four sides AND both diagonals, because four equal sides give a rhombus and only equal diagonals as well make it a square. Equidistance: set the squared distances equal, solve, and check the answer in the original condition.`,
  nextStep: 'Next you will find the point dividing a segment in a given ratio.',
  teacher: teacher(
    'Students apply distance to collinearity with ordering, quadrilateral classification with sufficient evidence, and equidistance.',
    ['The distance formula', 'Quadrilateral properties'],
    ['Which sum holds, and what does it tell you?', 'Sides AND diagonals.', 'Does the evidence support that name?'],
    [
      'The rhombus-versus-square case is the lesson. Give both figures together; students shown only the square conclude four equal sides are enough.',
      'Ask for the middle point every time, not just whether the points are collinear.',
      'Squared distances throughout keep the equidistance algebra clean and the comparisons exact.',
    ],
    ['Ask what four equal sides prove.', 'Ask which point lies between.'],
    ['Have the student tabulate all four sides and both diagonals before naming a shape.'],
    ['Ask what evidence would distinguish a parallelogram from a rectangle.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_7_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s7_3_section_formula_lesson',
  contentArtifactVersion: 1,
  source: source('7.3', 'Section Formula', 106, 'ncert_jemh1_s7_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s7_2'],
    mayAssume: ['The distance formula', 'Similar triangles and the ratios of corresponding sides', 'Working with ratios'],
    mustNotIntroduce: [{ concept: 'The midpoint as a special case, and finding a ratio', belongsToSection: 'ncert_jemh1_s7_3b' }],
  },
  learningGoal:
    'You will derive the coordinates of the point dividing a segment internally in the ratio m\u2081 : m\u2082, and use it.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Read coordinates from a point.', 'Use ratios of corresponding sides in similar triangles.', 'Simplify a fraction.'],
    ifNotReady: 'Revise similar triangles from Chapter 6. The derivation projects onto the axes and compares corresponding sides.',
  },
  vocabulary: [
    { term: 'section formula', meaning: 'The coordinates of the point dividing a segment internally in a given ratio.' },
    { term: 'internal division', meaning: 'Division by a point lying BETWEEN the two endpoints.' },
    { term: 'ratio m\u2081 : m\u2082', meaning: 'For a point P on AB, the ratio AP : PB \u2014 the part from A to P against the part from P to B.' },
  ],
  explanation: [
    'This is the new object of the chapter. Class IX gave you the distance and the midpoint; dividing a segment in an arbitrary ratio is what Class 10 adds.',
    'Set it up carefully, because the ratio convention is where this goes wrong. Let A(x\u2081, y\u2081) and B(x\u2082, y\u2082) be the endpoints, and let P lie BETWEEN them with AP : PB = m\u2081 : m\u2082. So m\u2081 measures the part from A to P, and m\u2082 the part from P to B.',
    'Both parts are positive, since P lies between A and B. That is what internal division means, and it is the only kind in this chapter.',
    'Now derive. Drop perpendiculars from A, P and B to the x-axis, meeting it at the points with abscissae x\u2081, x and x\u2082. Draw the horizontal lines through A and through P to meet those perpendiculars, forming two right triangles: one with A and P, the other with P and B.',
    'Those two triangles are similar \u2014 both are right-angled, and the angles at A and at P are equal because the two horizontal lines are parallel and AB is a transversal. Corresponding sides are therefore in the same ratio, which is AP : PB = m\u2081 : m\u2082.',
    'The horizontal sides of the two triangles are x \u2212 x\u2081 and x\u2082 \u2212 x. So (x \u2212 x\u2081) : (x\u2082 \u2212 x) = m\u2081 : m\u2082, giving m\u2082(x \u2212 x\u2081) = m\u2081(x\u2082 \u2212 x).',
    'Rearranging: m\u2082x + m\u2081x = m\u2081x\u2082 + m\u2082x\u2081, so x = (m\u2081x\u2082 + m\u2082x\u2081)/(m\u2081 + m\u2082). The same argument on the vertical sides gives y = (m\u2081y\u2082 + m\u2082y\u2081)/(m\u2081 + m\u2082).',
    'Look at which weight lands where. m\u2081 \u2014 the part NEAREST A \u2014 multiplies x\u2082, the coordinate of the FAR endpoint. That is not a quirk to memorise as "opposite weights": a large m\u2081 means AP is long, so P sits close to B, so B\u2019s coordinate should dominate. The formula says exactly that.',
    `A check: dividing ${formatPoint(A_1_2)} to ${formatPoint(B_4_6)} in 2:1 gives ${S(A_1_2, B_4_6, 2, 1)}, while 1:2 gives ${S(A_1_2, B_4_6, 1, 2)}. The first is nearer B and the second nearer A, as the ratios require \u2014 so reversing the weights moves the point, and the error is visible if you ask which endpoint it should be near.`,
    `Keep the coordinates exact. Dividing ${formatPoint(SEC_A)} to ${formatPoint(SEC_B)} in 2:3 gives ${S(SEC_A, SEC_B, 2, 3)}, and those fractions stay as they are.`,
  ],
  representations: ['A segment with the dividing point marked and the two similar right triangles drawn below it'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's73a.we1',
      prompt: 'Derive the coordinates of P dividing A(x\u2081, y\u2081) to B(x\u2082, y\u2082) internally in the ratio m\u2081 : m\u2082.',
      steps: [
        { text: 'P lies between A and B with AP : PB = m\u2081 : m\u2082, both parts positive.', reasoning: 'Stating the convention first is what keeps the weights from being assigned by habit later.' },
        { text: 'Drop perpendiculars from A, P and B to the x-axis, and draw horizontals through A and P.', reasoning: 'The construction produces two right triangles whose horizontal sides are the coordinate differences we want.' },
        { text: 'The two triangles are similar: both right-angled, with equal angles at A and P because the horizontals are parallel and AB cuts them.', reasoning: 'Similarity is established from parallel lines rather than assumed from the triangles looking alike.' },
        { text: 'So their corresponding sides are in the ratio AP : PB = m\u2081 : m\u2082, giving (x \u2212 x\u2081) : (x\u2082 \u2212 x) = m\u2081 : m\u2082.', reasoning: 'The hypotenuses are AP and PB, so the ratio of every corresponding pair is the ratio of those.' },
        { text: 'Cross-multiplying: m\u2082(x \u2212 x\u2081) = m\u2081(x\u2082 \u2212 x), so m\u2082x + m\u2081x = m\u2081x\u2082 + m\u2082x\u2081.', reasoning: 'Collecting the x terms on one side is what isolates the unknown abscissa.' },
        { text: 'Hence x = (m\u2081x\u2082 + m\u2082x\u2081)/(m\u2081 + m\u2082), and likewise y = (m\u2081y\u2082 + m\u2082y\u2081)/(m\u2081 + m\u2082).', reasoning: 'The vertical sides give the same relation with ordinates, since the same two similar triangles carry both.' },
      ],
      answer: 'P = ((m\u2081x\u2082 + m\u2082x\u2081)/(m\u2081 + m\u2082), (m\u2081y\u2082 + m\u2082y\u2081)/(m\u2081 + m\u2082)).',
    },
    {
      id: 's73a.we2',
      prompt: `Find the point dividing ${formatPoint(A_1_2)} to ${formatPoint(B_4_6)} in the ratio 2 : 1.`,
      steps: [
        { text: 'Here m\u2081 = 2 and m\u2082 = 1, so AP : PB = 2 : 1 and P is twice as far from A as from B.', reasoning: 'Reading the ratio back as a statement about position predicts roughly where the answer should land.' },
        { text: 'x = (2 \u00d7 4 + 1 \u00d7 1)/(2 + 1) = 9/3 = 3.', reasoning: 'The weight 2 goes on B\u2019s abscissa, because a long AP puts P near B.' },
        { text: 'y = (2 \u00d7 6 + 1 \u00d7 2)/3 = 14/3.', reasoning: 'The same weighting applied to the ordinates, kept as an exact fraction.' },
        { text: `So P = ${S(A_1_2, B_4_6, 2, 1)}, which lies nearer B than A as expected.`, reasoning: 'The sanity check matches the ratio, which is the quickest way to catch reversed weights.' },
      ],
      answer: `${S(A_1_2, B_4_6, 2, 1)}.`,
    },
    {
      id: 's73a.we3',
      prompt: `Find the point dividing ${formatPoint(SEC_A)} to ${formatPoint(SEC_B)} in the ratio 2 : 3, and verify it.`,
      steps: [
        { text: 'm\u2081 = 2 and m\u2082 = 3, so AP : PB = 2 : 3 and P is nearer A.', reasoning: 'The smaller first part means the piece from A is shorter, so P lies in the first part of the segment.' },
        { text: 'x = (2 \u00d7 5 + 3 \u00d7 1)/5 = 13/5.', reasoning: 'The far endpoint B carries m\u2081 = 2 and the near endpoint A carries m\u2082 = 3.' },
        { text: 'y = (2 \u00d7 7 + 3 \u00d7 3)/5 = 23/5.', reasoning: 'The denominators are the same because m\u2081 + m\u2082 = 5 for both coordinates.' },
        { text: `So P = ${S(SEC_A, SEC_B, 2, 3)}, kept exact.`, reasoning: 'Rounding here would move the point off the segment and spoil any later check.' },
        { text: `Verify: P lies between A and B, and recovering the ratio from its coordinates gives ${ratioOf(SEC_A, SEC_B, sectionPoint(SEC_A, SEC_B, 2, 3))!.m1} : ${ratioOf(SEC_A, SEC_B, sectionPoint(SEC_A, SEC_B, 2, 3))!.m2}.`, reasoning: 'Recovering the ratio independently confirms the weights were applied the right way round.' },
      ],
      answer: `${S(SEC_A, SEC_B, 2, 3)}.`,
    },
  ],
  guidedPractice: [
    { id: 's73a.g1', prompt: `Find the point dividing ${formatPoint(A_1_2)} to ${formatPoint(B_4_6)} in 1 : 2.`, hint: 'Which endpoint should it be near?', answer: `${S(A_1_2, B_4_6, 1, 2)}.`, rationale: 'x = (1\u00d74 + 2\u00d71)/3 = 2 and y = (1\u00d76 + 2\u00d72)/3 = 10/3. A short AP puts P near A, which it is.' },
    { id: 's73a.g2', prompt: 'In AP : PB = m\u2081 : m\u2082, which endpoint\u2019s coordinate does m\u2081 multiply?', hint: 'Think about where a large m\u2081 puts P.', answer: 'B\u2019s \u2014 the far endpoint.', rationale: 'A large m\u2081 means AP is long, so P is near B and B\u2019s coordinate should dominate the weighted average.' },
    { id: 's73a.g3', prompt: 'Why must both ratio parts be positive here?', hint: 'Where does P lie?', answer: 'Because the division is internal.', rationale: 'P lies between A and B, so both AP and PB are genuine positive lengths. External division is outside this chapter.' },
  ],
  independentPractice: [
    { id: 's73a.i1', prompt: 'Find the point dividing (\u22121, 3) to (4, \u22132) in 3 : 2.', answer: '(2, 0).', rationale: 'x = (3\u00d74 + 2\u00d7(\u22121))/5 = 10/5 = 2 and y = (3\u00d7(\u22132) + 2\u00d73)/5 = 0/5 = 0.' },
    { id: 's73a.i2', prompt: `A student divides ${formatPoint(A_1_2)} to ${formatPoint(B_4_6)} in 2 : 1 and gets ${S(A_1_2, B_4_6, 1, 2)}. What went wrong?`, answer: 'The weights were reversed.', rationale: `That is the 1 : 2 point, nearer A. With AP : PB = 2 : 1 the point should be nearer B, at ${S(A_1_2, B_4_6, 2, 1)}.` },
    { id: 's73a.i3', prompt: 'Why does the derivation use similar triangles rather than measurement?', answer: 'Because similarity gives the ratio of corresponding sides exactly.', rationale: 'The parallel horizontals make the triangles similar, so the side ratio equals AP : PB wherever the points lie.' },
    { id: 's73a.i4', prompt: 'Should a section point be rounded before being used in a later calculation?', answer: 'No.', rationale: 'Rounding moves the point slightly off the segment, so any later distance or ratio computed from it would be wrong.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's73a.td1',
      prompt: 'Why does m\u2081, the part nearest A, multiply the coordinate of B rather than of A?',
      expectedReasoning:
        'Because m\u2081 measures AP, the distance travelled away from A, so a large m\u2081 places P close to B \u2014 and the coordinate it should then resemble is B\u2019s. The formula is a weighted average in which each endpoint is weighted by the part of the ratio on the OPPOSITE side, and that opposition is a consequence rather than a rule to memorise. The derivation shows it directly: cross-multiplying (x \u2212 x\u2081) : (x\u2082 \u2212 x) = m\u2081 : m\u2082 puts m\u2081 with x\u2082. The way to check an answer is to ask which endpoint it should be nearer, and see whether it is.',
    },
    {
      id: 's73a.td2',
      prompt: 'What exactly goes wrong if the two weights are swapped, and how would you notice?',
      expectedReasoning:
        'Swapping them computes the point dividing in m\u2082 : m\u2081 instead \u2014 a real point of the same segment, but the wrong one, reflected about the midpoint. Nothing in the arithmetic fails and the answer looks perfectly reasonable, which is why this error survives checking. It shows up in a position check: for AP : PB = 2 : 1 the point must lie nearer B, so an answer nearer A is wrong whatever the computation looked like. Recovering the ratio from the computed coordinates is the stronger check, since it gives the ratio back and either matches or does not.',
    },
  ],
  summary:
    `For A(x\u2081, y\u2081) and B(x\u2082, y\u2082) and P between them with AP : PB = m\u2081 : m\u2082, projecting onto the axes gives two SIMILAR right triangles, so (x \u2212 x\u2081) : (x\u2082 \u2212 x) = m\u2081 : m\u2082 and hence x = (m\u2081x\u2082 + m\u2082x\u2081)/(m\u2081 + m\u2082), with the same for y. The weight m\u2081 multiplies the FAR endpoint because a long AP puts P near B \u2014 a consequence, not a rule to memorise. Both parts are positive, since the division is internal, and coordinates such as ${S(SEC_A, SEC_B, 2, 3)} stay exact.`,
  nextStep: 'Next you will recover the midpoint from this formula and run it backwards to find a ratio.',
  teacher: teacher(
    'Students derive the section formula from similar triangles and apply it with the weights the right way round.',
    ['Distance formula', 'Similar triangles'],
    ['Which endpoint should P be nearer?', 'Where does m\u2081 land, and why?', 'Exact or rounded?'],
    [
      'The reversed-weights error is the one to design against. Teach the position check \u2014 ask which endpoint the answer should be near \u2014 every single time.',
      'Derive from similar triangles rather than stating the formula; the cross-multiplication is where the opposite weighting becomes visible.',
      'Keep fractions exact. A rounded section point fails every later verification.',
    ],
    ['Ask which coordinate m\u2081 multiplies.', 'Ask where the 2:1 point should lie.'],
    ['Have the student predict which half of the segment the answer falls in before computing.'],
    ['Ask what ratio puts P one quarter of the way from A.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_7_3B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s7_3_midpoint_ratio_lesson',
  contentArtifactVersion: 1,
  source: source('7.3', 'Section Formula', 106, 'ncert_jemh1_s7_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s7_3'],
    mayAssume: ['The section formula', 'The midpoint from Class IX'],
    mustNotIntroduce: [{ concept: 'External division', belongsToSection: 'outside_current_scope' }],
  },
  learningGoal:
    'You will obtain the midpoint as the 1 : 1 case of the section formula, and recover the ratio in which a known point divides a segment.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Use the section formula.', 'State the midpoint formula from Class IX.', 'Solve a linear equation in one unknown.'],
    ifNotReady: 'Revise the previous lesson. Both ideas here come from running that one formula at a special value and backwards.',
  },
  vocabulary: [
    { term: 'midpoint', meaning: 'The point halfway along a segment \u2014 the point dividing it in the ratio 1 : 1.' },
    { term: 'special case', meaning: 'A particular instance of a general result, obtained by fixing one of its quantities.' },
  ],
  explanation: [
    'You used the midpoint formula in Class IX. It is not a separate fact: it is the section formula at one particular ratio, and seeing that is worth more than remembering both.',
    'Put m\u2081 = m\u2082 = 1 in the section formula. The denominator m\u2081 + m\u2082 becomes 2, and each numerator becomes x\u2082 + x\u2081, so x = (x\u2081 + x\u2082)/2 and y = (y\u2081 + y\u2082)/2 \u2014 the midpoint formula exactly as you learned it.',
    'The weights do not matter here, which is why the ratio 1 : 1 is the one case where reversing them is harmless. Every other ratio moves the point when reversed.',
    `For ${formatPoint(A_1_2)} and ${formatPoint(B_4_6)} the midpoint is ${formatPoint(midpoint(A_1_2, B_4_6))}, and the section formula at 1 : 1 gives ${S(A_1_2, B_4_6, 1, 1)} \u2014 the same point, as it must.`,
    'Now run the formula backwards. Given the two endpoints and a point P known to lie between them, find the ratio in which P divides the segment.',
    'Suppose P divides AB in k : 1, an unknown ratio written with second part 1 so there is a single unknown. Then the x-coordinate gives x = (k\u00b7x\u2082 + x\u2081)/(k + 1), which is one equation in k and can be solved.',
    'But the x-coordinate alone is not enough, and this is the step most often skipped. The y-coordinate gives a second equation, and BOTH must give the same k. If they disagree, P does not lie on the segment at all \u2014 the data are inconsistent and no ratio exists.',
    'There is one exception. If the segment is vertical the abscissae are all equal and the x equation says nothing; if it is horizontal the y equation says nothing. In those cases the other coordinate decides alone, because the silent one is uninformative rather than contradictory.',
    `For ${formatPoint(SEC_A)} and ${formatPoint(SEC_B)} with P at ${S(SEC_A, SEC_B, 2, 3)}, both coordinates give the ratio ${ratioOf(SEC_A, SEC_B, sectionPoint(SEC_A, SEC_B, 2, 3))!.m1} : ${ratioOf(SEC_A, SEC_B, sectionPoint(SEC_A, SEC_B, 2, 3))!.m2}, so the answer is confirmed from two independent directions.`,
  ],
  representations: ['A segment with its midpoint and a second dividing point marked, each labelled with its ratio'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's73b.we1',
      prompt: 'Obtain the midpoint formula from the section formula.',
      steps: [
        { text: 'The midpoint divides the segment into two equal parts, so AP : PB = 1 : 1.', reasoning: 'Halfway means the two pieces are the same length, which is exactly the ratio 1 : 1.' },
        { text: 'Put m\u2081 = m\u2082 = 1: the denominator m\u2081 + m\u2082 becomes 2.', reasoning: 'The weights are equal, so the weighted average becomes an ordinary average.' },
        { text: 'The x numerator becomes 1\u00b7x\u2082 + 1\u00b7x\u2081 = x\u2081 + x\u2082, so x = (x\u2081 + x\u2082)/2.', reasoning: 'With equal weights the question of which endpoint carries which weight disappears.' },
        { text: 'Likewise y = (y\u2081 + y\u2082)/2, which is the midpoint formula from Class IX.', reasoning: 'The general result contains the familiar one, so there is one formula here rather than two.' },
      ],
      answer: 'Midpoint = ((x\u2081 + x\u2082)/2, (y\u2081 + y\u2082)/2).',
    },
    {
      id: 's73b.we2',
      prompt: `Find the ratio in which ${S(SEC_A, SEC_B, 2, 3)} divides the segment from ${formatPoint(SEC_A)} to ${formatPoint(SEC_B)}.`,
      steps: [
        { text: 'Let the ratio be k : 1, so there is one unknown.', reasoning: 'Writing the second part as 1 is a normalisation; any ratio can be scaled to this form.' },
        { text: 'From the abscissae: 13/5 = (5k + 1)/(k + 1), so 13(k + 1) = 5(5k + 1).', reasoning: 'Substituting into the section formula for x gives a single linear equation in k.' },
        { text: '13k + 13 = 25k + 5, so 12k = 8 and k = 2/3.', reasoning: 'The ratio k : 1 is therefore 2/3 : 1, which scales to 2 : 3.' },
        { text: 'Check with the ordinates: 23/5 = (7k + 3)/(k + 1) gives 23k + 23 = 35k + 15, so 12k = 8 and k = 2/3 again.', reasoning: 'The second coordinate gives the same k independently, which is what confirms P lies on the segment.' },
        { text: `So the ratio is ${ratioOf(SEC_A, SEC_B, sectionPoint(SEC_A, SEC_B, 2, 3))!.m1} : ${ratioOf(SEC_A, SEC_B, sectionPoint(SEC_A, SEC_B, 2, 3))!.m2}.`, reasoning: 'Both parts positive, so the division is internal as the chapter requires.' },
      ],
      answer: `${ratioOf(SEC_A, SEC_B, sectionPoint(SEC_A, SEC_B, 2, 3))!.m1} : ${ratioOf(SEC_A, SEC_B, sectionPoint(SEC_A, SEC_B, 2, 3))!.m2}.`,
    },
    {
      id: 's73b.we3',
      prompt: 'The abscissae give a ratio of 2 : 3 and the ordinates give 1 : 4. What does that mean?',
      steps: [
        { text: 'Each coordinate determines where P sits along the segment, independently.', reasoning: 'The section formula applies to both coordinates with the same ratio, so each is a separate route to it.' },
        { text: 'A point on the segment must give the same ratio by both routes.', reasoning: 'One point has one position, so two different positions cannot both be right.' },
        { text: 'Here they disagree, so no point on the segment has these coordinates.', reasoning: 'The stated point lies off the segment, which is why no consistent ratio can be found.' },
        { text: 'The data are inconsistent; the right response is to report that, not to pick one answer.', reasoning: 'Choosing the x answer and ignoring the y would present a ratio for a point that does not divide this segment at all.' },
      ],
      answer: 'The point does not lie on the segment \u2014 the data are inconsistent.',
    },
  ],
  guidedPractice: [
    { id: 's73b.g1', prompt: `Find the midpoint of ${formatPoint(SEC_A)} and ${formatPoint(SEC_B)}.`, hint: 'Average each coordinate.', answer: `${formatPoint(midpoint(SEC_A, SEC_B))}.`, rationale: `(1+5)/2 = 3 and (3+7)/2 = 5, which is the section formula at 1 : 1.` },
    { id: 's73b.g2', prompt: 'Why is reversing the weights harmless only for the midpoint?', hint: 'What are the weights there?', answer: 'Because both weights are 1.', rationale: 'Swapping 1 and 1 changes nothing. For any other ratio the two orders give different points.' },
    { id: 's73b.g3', prompt: 'Why check the ratio with both coordinates?', hint: 'What would a disagreement mean?', answer: 'Because they must agree if the point lies on the segment.', rationale: 'Each coordinate independently fixes the position, so a disagreement shows the point is not on the segment.' },
  ],
  independentPractice: [
    { id: 's73b.i1', prompt: `Verify that the section formula at 1 : 1 gives the Class IX midpoint for ${formatPoint(A_1_2)} and ${formatPoint(B_4_6)}.`, answer: `Both give ${formatPoint(midpoint(A_1_2, B_4_6))}.`, rationale: 'The weighted average with equal weights is the ordinary average, which is the midpoint formula.' },
    { id: 's73b.i2', prompt: 'Find the ratio in which (2, 0) divides the segment from (\u22121, 3) to (4, \u22132).', answer: '3 : 2.', rationale: 'From the abscissae, 2 = (4k \u2212 1)/(k + 1) gives k = 3/2, that is 3 : 2; the ordinates give the same.' },
    { id: 's73b.i3', prompt: 'When can one coordinate alone determine the ratio?', answer: 'When the other is degenerate \u2014 a vertical or horizontal segment.', rationale: 'If the abscissae are all equal the x equation is uninformative rather than contradictory, so the y equation decides alone.' },
    { id: 's73b.i4', prompt: 'A computed ratio comes out as 3 : \u22121. What does that tell you?', answer: 'The point is not an internal division point.', rationale: 'Internal division needs both parts positive. A negative part means the point lies outside the segment, which is outside this chapter.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's73b.td1',
      prompt: 'Why does the midpoint formula appear when the ratio is 1 : 1, and what does that tell you about the two formulas?',
      expectedReasoning:
        'Because the section formula is a weighted average of the two endpoints, and at 1 : 1 the weights are equal, so it collapses to the ordinary average (x\u2081 + x\u2082)/2 and (y\u2081 + y\u2082)/2. That means there is really one formula, not two: the midpoint is the special case where the segment is halved. It also explains why the weight order does not matter for the midpoint \u2014 swapping two equal weights changes nothing \u2014 while for every other ratio it moves the point. Knowing the general result means the special one need not be remembered separately.',
    },
    {
      id: 's73b.td2',
      prompt: 'Can the x-coordinate alone always determine the ratio? Explain both when it can and when it cannot.',
      expectedReasoning:
        'No. Usually it can, since the x equation is one equation in one unknown and solves for k \u2014 but the answer is only trustworthy if the y-coordinate gives the same k, because a point off the segment can still satisfy the x equation by accident. If the two disagree, the data are inconsistent and no ratio exists. There is also a case where x cannot help at all: if the segment is vertical, every point on it shares an abscissa, so the x equation is satisfied by any k and says nothing. Then the y-coordinate decides alone, because it is uninformative rather than contradictory. So the rule is to use both and require agreement, with the degenerate case as the one exception.',
    },
  ],
  summary:
    `Put m\u2081 = m\u2082 = 1 in the section formula and it becomes ((x\u2081 + x\u2082)/2, (y\u2081 + y\u2082)/2) \u2014 the Class IX midpoint, recovered rather than remembered separately. Running the formula backwards finds the ratio: write it k : 1, solve from the abscissae, and CHECK with the ordinates, since both must give the same k if P lies on the segment. A disagreement means the point is not on it; a vertical or horizontal segment is the one case where one coordinate is silent and the other decides alone.`,
  nextStep: 'The chapter summary recapitulates distance from the origin, distance between two points and the internal section formula.',
  teacher: teacher(
    'Students recover the midpoint as the 1:1 case and find a ratio from both coordinates with agreement required.',
    ['The section formula', 'The midpoint (Class IX)'],
    ['What happens at 1 : 1?', 'Does the other coordinate agree?', 'Both parts positive?'],
    [
      'Derive the midpoint from the section formula rather than restating it; students already know it, and the point of the lesson is that it is contained in the general result.',
      'Requiring both coordinates to agree is the habit to build. Students solve from x and stop, and the check is what catches an off-segment point.',
      'The degenerate vertical and horizontal cases are worth naming so the rule does not look like it has exceptions it cannot explain.',
    ],
    ['Ask what the section formula gives at 1 : 1.', 'Ask what a disagreement between coordinates means.'],
    ['Have the student solve from both coordinates separately and compare, before writing any ratio.'],
    ['Ask what ratio the point two-thirds of the way from A corresponds to.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_COORDINATE_SECTIONS: AuthoredSection[] = [
  C10_SECTION_7_2A, C10_SECTION_7_2B, C10_SECTION_7_3A, C10_SECTION_7_3B,
];
