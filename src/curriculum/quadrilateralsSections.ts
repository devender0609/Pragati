// ===========================================================================
// v0.84.0 checkpoint 32 — CLASS 9 AUTHORING PILOT: QUADRILATERALS.
//
// The first Secondary Stage chapter Pragati has authored. It exists to
// prove a standard, not to start a production run: every other Class 9
// chapter remains decomposed and unauthored.
//
// WHY THIS CHAPTER
//
// Ganita Manjari Part II chapter 12 gives the widest architecture in the
// smallest inspectable space — four official sections becoming six units,
// two of them split on subsection evidence, one-section/one-unit cases at
// each end, and a spread from definition through proof and converse to
// application. It also tests the chapter-9 finding directly: the book
// pairs each parallelogram property with its converse, which is the
// formalisation Class 9 contributes over Class 8's proof work.
//
// WHAT IS ORIGINAL HERE
//
// Every explanation, example, figure, practice item and piece of feedback
// is Pragati's own. The textbook supplies the mathematical scope, the
// proof expectations and the order; it supplies no sentence of this file.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const QUADRILATERALS_CHAPTER_ID = 'ncert_iemh2_ch12';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part II)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh2dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: QUADRILATERALS_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// --- figures ---------------------------------------------------------------

const F_FOURGON: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    { id: 'a', x: 20, y: 20, label: 'A' },
    { id: 'b', x: 120, y: 20, label: 'B' },
    { id: 'c', x: 140, y: 110, label: 'C' },
    { id: 'd', x: 10, y: 95, label: 'D' },
    { id: 'p', x: 230, y: 20, label: 'P' },
    { id: 'q', x: 330, y: 20, label: 'Q' },
    { id: 'r', x: 230, y: 110, label: 'R' },
    { id: 's', x: 330, y: 110, label: 'S' },
  ],
  segments: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'c', to: 'd' },
    { from: 'd', to: 'a' },
    { from: 'p', to: 's' },
    { from: 's', to: 'q' },
    { from: 'q', to: 'r' },
    { from: 'r', to: 'p' },
  ],
  caption: 'Four points and four joining segments — but only one of these is a 4-gon.',
  altText:
    'Left: points A, B, C, D joined in order by four segments that meet only at the vertices, forming a closed figure with no crossings. Right: points P, Q, R, S joined so that segment PS crosses segment QR, so two sides meet at a point that is not a vertex.',
};

const F_PARALLELOGRAM: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  points: [
    { id: 'a', x: 20, y: 110, label: 'A' },
    { id: 'b', x: 150, y: 110, label: 'B' },
    { id: 'c', x: 195, y: 25, label: 'C' },
    { id: 'd', x: 65, y: 25, label: 'D' },
  ],
  segments: [
    { from: 'a', to: 'b', mark: 'single_tick' },
    { from: 'd', to: 'c', mark: 'single_tick' },
    { from: 'b', to: 'c', mark: 'double_tick' },
    { from: 'a', to: 'd', mark: 'double_tick' },
    { from: 'a', to: 'c', mark: 'dashed' },
  ],
  caption: 'The diagonal AC splits the parallelogram into two triangles.',
  altText:
    'Parallelogram ABCD with AB parallel to DC and AD parallel to BC. Sides AB and DC carry one tick each, showing they are equal; sides AD and BC carry two ticks each. A dashed diagonal joins A to C, dividing the figure into triangles ABC and CDA.',
};

const F_MIDPOINT: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'support_proof',
  status: 'concept_specific',
  points: [
    { id: 'a', x: 100, y: 20, label: 'A' },
    { id: 'b', x: 20, y: 140, label: 'B' },
    { id: 'c', x: 210, y: 140, label: 'C' },
    { id: 'm', x: 60, y: 80, label: 'M' },
    { id: 'n', x: 155, y: 80, label: 'N' },
  ],
  segments: [
    { from: 'a', to: 'b', mark: 'single_tick' },
    { from: 'b', to: 'c' },
    { from: 'c', to: 'a', mark: 'double_tick' },
    { from: 'm', to: 'n', label: 'MN' },
  ],
  caption: 'M and N are the midpoints of two sides. What can be said about MN?',
  altText:
    'Triangle ABC. M is the midpoint of side AB and N is the midpoint of side AC, each half marked with ticks. Segment MN joins the two midpoints and runs parallel to the third side BC, appearing half as long.',
};

const F_COUNTEREXAMPLE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_counterexample',
  status: 'concept_specific',
  points: [
    { id: 'a', x: 20, y: 120, label: 'A' },
    { id: 'b', x: 160, y: 120, label: 'B' },
    { id: 'c', x: 160, y: 30, label: 'C' },
    { id: 'd', x: 20, y: 60, label: 'D' },
  ],
  segments: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c', mark: 'single_tick' },
    { from: 'c', to: 'd' },
    { from: 'd', to: 'a', mark: 'single_tick' },
  ],
  caption: 'One pair of opposite sides equal — and still not a parallelogram.',
  altText:
    'Quadrilateral ABCD in which sides BC and AD are marked equal with single ticks, but AB and DC are not parallel: AB is horizontal while DC slopes. The figure satisfies one half of the parallelogram test and fails to be a parallelogram.',
};

const F_TILING: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_tiling',
  status: 'concept_specific',
  points: [
    { id: 'a', x: 30, y: 30, label: 'A' },
    { id: 'b', x: 120, y: 20, label: 'B' },
    { id: 'c', x: 145, y: 105, label: 'C' },
    { id: 'd', x: 40, y: 120, label: 'D' },
    { id: 'm', x: 132, y: 62, label: 'M' },
    { id: 'b2', x: 170, y: 105, label: "B'" },
    { id: 'a2', x: 260, y: 115, label: "A'" },
    { id: 'd2', x: 250, y: 20, label: "D'" },
  ],
  segments: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'c', to: 'd' },
    { from: 'd', to: 'a' },
    { from: 'c', to: 'b2' },
    { from: 'b2', to: 'a2' },
    { from: 'a2', to: 'd2' },
    { from: 'd2', to: 'b' },
  ],
  caption: 'A half-turn about the midpoint M of side BC places a second copy beside the first.',
  altText:
    'Quadrilateral ABCD and a second copy of it rotated a half turn about M, the midpoint of side BC. The rotated copy shares the whole of side BC with the original, so the two fit together with no gap and no overlap along that edge.',
};

// ===========================================================================
// §12.1 — What Exactly is a Quadrilateral?  (one section, one unit)
// ===========================================================================

export const SECTION_12_1: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s12_1_lesson',
  contentArtifactVersion: 1,
  source: source('12.1', 'What Exactly is a Quadrilateral?', 2, 'ncert_iemh2_s12_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: [
      'Triangles, and what it means for a figure to be closed',
      'Parallel lines and the angles a transversal makes with them',
      'Congruence of triangles from Class 8',
    ],
    mustNotIntroduce: [
      { concept: 'Properties of a parallelogram', belongsToSection: 'ncert_iemh2_s12_2' },
      { concept: 'The Midpoint Theorem', belongsToSection: 'ncert_iemh2_s12_3' },
      { concept: 'Tiling the plane', belongsToSection: 'ncert_iemh2_s12_4' },
    ],
  },
  learningGoal:
    'You will be able to say exactly which figures count as quadrilaterals, and justify a decision from the definition rather than from how the figure looks.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State what makes a figure a triangle, in words.',
      'Say what it means for a figure to be closed.',
      'Name the vertices and sides of a figure given its letters.',
    ],
    ifNotReady:
      'Go back to the definition of a triangle first. A quadrilateral is defined the same way, with one more point.',
  },
  vocabulary: [
    { term: '4-gon', meaning: 'A closed figure made from four points, no three of them on one line, joined in order by four segments that meet only at those points.' },
    { term: 'vertex', meaning: 'One of the four corner points.' },
    { term: 'adjacent sides', meaning: 'Two sides that share a vertex.' },
    { term: 'opposite sides', meaning: 'Two sides that share no vertex.' },
  ],
  explanation: [
    'You already know what a triangle is, and you can say it precisely: three points, not on one line, joined in order by three segments. Notice how much work that sentence does. "Not on one line" rules out a flattened figure. "Joined in order" fixes which segments are drawn.',
    'A quadrilateral is built the same way, with four points instead of three. Four points, no three of them on one line, joined in order by four segments — and the segments meet only at those four points.',
    'That last condition is the one worth pausing on. If you take four points and join them in the wrong order, two of the segments cross. The figure is still closed, and it still has four segments, but two sides now meet at a point that is not a vertex. That crossing point is not one of your four, so the figure is not a quadrilateral.',
    'Why insist? Because everything that follows depends on it. The proofs in this chapter talk about adjacent and opposite sides, about diagonals meeting inside the figure, about angles at the vertices. None of those descriptions mean anything if sides are allowed to cross wherever they like.',
    'With the definition settled, two more words: sides that share a vertex are adjacent, and sides that share no vertex are opposite. In quadrilateral ABCD, AB and BC are adjacent; AB and DC are opposite.',
  ],
  representations: [
    'A valid 4-gon beside a crossed figure built from the same four points',
    'Labelled vertices so that adjacent and opposite can be named precisely',
  ],
  visuals: [F_FOURGON],
  visualsById: { F_FOURGON },
  workedExamples: [
    {
      id: 's121.we1',
      prompt: 'Four points are placed so that no three lie on one line. They are joined in order P, Q, R, S and the segments meet only at those four points. Is PQRS a quadrilateral?',
      steps: [
        { text: 'Check the number of points: four.', reasoning: 'The definition asks for exactly four points, so this condition is met.' },
        { text: 'Check that no three are on one line.', reasoning: 'We are told this. If three were collinear, one "corner" would be flat and the figure would really be a triangle with an extra dot on a side.' },
        { text: 'Check that the four segments meet only at the four points.', reasoning: 'We are told this too. No pair of sides crosses anywhere else, so every meeting point is a vertex.' },
      ],
      answer: 'Yes. All three conditions of the definition hold, so PQRS is a quadrilateral.',
      visualRef: 'F_FOURGON',
    },
    {
      id: 's121.we2',
      prompt: 'The same four points are joined in the order P, S, Q, R. Segment PS crosses segment QR. Is PSQR a quadrilateral?',
      steps: [
        { text: 'Four points, no three collinear — both still true.', reasoning: 'Reordering how you join points does not move them, so these two conditions are unaffected.' },
        { text: 'Look at where the segments meet. PS and QR cross at a point that is not one of P, Q, R or S.', reasoning: 'The definition requires the segments to meet only at the four chosen points. A crossing elsewhere breaks that condition.' },
      ],
      answer: 'No. The same four points can give a quadrilateral or not, depending on the order you join them.',
      visualRef: 'F_FOURGON',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's121.g1',
      prompt: 'A figure is drawn from four points, but three of them lie on one straight line. Is it a quadrilateral?',
      hint: 'Test the condition about three points on a line. What does the figure actually look like at that middle point?',
      answer: 'No.',
      rationale: 'With three points on one line, the "corner" at the middle point is a straight angle. The figure has three real corners, not four, so it fails the definition.',
    },
    {
      id: 's121.g2',
      prompt: 'In quadrilateral ABCD, name the side opposite to BC, and one side adjacent to it.',
      hint: 'Opposite means sharing no vertex. Adjacent means sharing one.',
      answer: 'Opposite: AD. Adjacent: AB or CD.',
      rationale: 'BC uses vertices B and C. AD uses neither, so it is opposite. AB shares B and CD shares C, so each is adjacent.',
    },
  ],
  independentPractice: [
    {
      id: 's121.i1',
      prompt: 'Explain, using the definition, why a figure whose sides cross is not a quadrilateral even though it is closed and has four segments.',
      answer: 'Because the segments meet at a point that is not one of the four chosen points.',
      rationale: 'Being closed and having four sides is not enough. The definition also fixes where sides may meet, and a crossing violates that.',
    },
    {
      id: 's121.i2',
      prompt: 'List all four pairs of adjacent sides in quadrilateral WXYZ.',
      answer: 'WX and XY; XY and YZ; YZ and ZW; ZW and WX.',
      rationale: 'Each pair shares exactly one vertex, taken around the figure in order.',
    },
  ],
  reasoningApplication: [
    {
      id: 's121.r1',
      prompt: 'Four points are fixed, no three on a line. Some orders of joining them give a quadrilateral and some do not. Is it always possible to find at least one order that works? Explain your reasoning.',
      expectedReasoning:
        'Yes. Going round the four points along the boundary of the region they enclose always produces segments that meet only at the points. The student should argue from the definition — where sides are allowed to meet — rather than from a drawing of one case.',
    },
  ],
  interactivePractice: [],
  summary:
    'A quadrilateral is four points, no three on a line, joined in order by four segments that meet only at those points. The last condition is what rules out crossed figures, and it is what makes the rest of the chapter possible.',
  nextStep:
    'Next you will look at a particular kind of quadrilateral — one where both pairs of opposite sides are parallel — and prove what follows from that.',
  teacher: {
    objective: 'Students state the definition of a quadrilateral precisely and use it to justify inclusion or exclusion of a figure.',
    prerequisiteKnowledge: ['Definition of a triangle', 'Closed figures', 'Naming vertices and sides'],
    modelLanguage: [
      'Which condition of the definition does this figure fail?',
      'Where are the sides allowed to meet?',
    ],
    teachingNotes: [
      'The crossed figure is the heart of this lesson. Draw the same four points twice and join them differently so students see that the points are not the problem; the order is.',
      'Resist settling disputes by appearance. Every decision here should quote a condition of the definition.',
    ],
    quickChecks: [
      'Give me a figure that is closed, has four sides, and is still not a quadrilateral.',
      'Which sides of ABCD are opposite to each other?',
    ],
    supportForStrugglingLearners: [
      'Start with the triangle definition and add one point, so the structure of the sentence is already familiar.',
      'Use four pins and a loop of thread so the crossing can be made and undone physically.',
    ],
    extension: [
      'Ask how many different quadrilaterals four fixed points can produce, and why the answer is not larger.',
    ],
    materialsNeeded: ['Plain paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §12.2 — Parallelograms.  SPLIT INTO TWO UNITS.
//
// The section proves each property and then proves its converse. Those
// are different statements with different uses: one tells you what a
// parallelogram gives you, the other tells you how to recognise one.
// Teaching them together invites exactly the equivalence error chapter 9
// warns about, so they are authored as two lessons.
// ===========================================================================

export const SECTION_12_2_PROPERTIES: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s12_2_properties_lesson',
  contentArtifactVersion: 1,
  source: source('12.2', 'Parallelograms', 6, 'ncert_iemh2_s12_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s12_1'],
    mayAssume: [
      'The definition of a quadrilateral',
      'Alternate angles made by a transversal cutting parallel lines',
      'The congruence conditions for triangles',
    ],
    mustNotIntroduce: [
      { concept: 'Converse tests for a parallelogram', belongsToSection: 'ncert_iemh2_s12_2' },
      { concept: 'The Midpoint Theorem', belongsToSection: 'ncert_iemh2_s12_3' },
    ],
  },
  learningGoal:
    'You will prove that a parallelogram has equal opposite sides, equal opposite angles and diagonals that bisect each other — and see that one diagonal does all the work.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Mark the alternate angles when a line cuts two parallel lines.',
      'State the ASA condition for two triangles to be congruent.',
      'Explain what corresponding parts of congruent triangles means.',
    ],
    ifNotReady: 'Revisit alternate angles first — every proof in this lesson begins with them.',
  },
  vocabulary: [
    { term: 'parallelogram', meaning: 'A quadrilateral in which both pairs of opposite sides are parallel.' },
    { term: 'diagonal', meaning: 'A segment joining two opposite vertices.' },
    { term: 'bisect', meaning: 'To cut into two equal parts.' },
  ],
  explanation: [
    'A parallelogram is a quadrilateral with both pairs of opposite sides parallel. That is the whole definition — nothing is said about lengths or angles. Everything else in this lesson is something we deduce.',
    'Start with parallelogram ABCD and draw the diagonal AC. It cuts the figure into triangles ABC and CDA, and the two triangles share that diagonal.',
    'Because AB is parallel to DC and AC cuts both, the alternate angles at A and C are equal. Because AD is parallel to BC, a second pair of alternate angles is equal. The two triangles therefore agree in two angles and the side between them, which is exactly the ASA condition, so they are congruent.',
    'Once the triangles are congruent, their corresponding parts are equal. AB equals DC and AD equals BC: opposite sides are equal. The angles at B and D match as well: opposite angles are equal.',
    'Now draw the second diagonal BD and let the diagonals meet at O. Using the equal opposite sides just established, together with another pair of alternate angles, triangles AOB and COD are congruent. So AO equals OC and BO equals OD — each diagonal cuts the other in half.',
    'Three results, one method. That is worth noticing: the parallel condition turns into equal angles, equal angles turn into congruent triangles, and congruent triangles hand you every equality in the figure.',
  ],
  representations: [
    'A parallelogram with one diagonal drawn, dividing it into two triangles',
    'Tick marks showing which sides the proof has established as equal',
  ],
  visuals: [F_PARALLELOGRAM],
  visualsById: { F_PARALLELOGRAM },
  workedExamples: [
    {
      id: 's122a.we1',
      prompt: 'In parallelogram PQRS, angle P measures 68 degrees. Find the other three angles, giving a reason for each.',
      steps: [
        { text: 'Angle R equals angle P, so angle R is 68 degrees.', reasoning: 'Opposite angles of a parallelogram are equal — the property just proved.' },
        { text: 'Angles P and Q lie between the same pair of parallel sides, on the same side of PQ, so they add to 180 degrees.', reasoning: 'Co-interior angles on parallel lines are supplementary; this follows from the definition, not from a new fact.' },
        { text: 'So angle Q is 180 minus 68, which is 112 degrees.', reasoning: 'Subtracting the known angle from the supplementary total of 180 degrees.' },
        { text: 'Angle S equals angle Q, so angle S is 112 degrees.', reasoning: 'Opposite angles are equal, applied now to the second pair.' },
      ],
      answer: 'Angle Q is 112 degrees, angle R is 68 degrees and angle S is 112 degrees.',
      visualRef: 'F_PARALLELOGRAM',
    },
    {
      id: 's122a.we2',
      prompt: 'The diagonals of parallelogram ABCD meet at O. Given AO = 3x - 2 and OC = x + 6, find x.',
      steps: [
        { text: 'The diagonals bisect each other, so AO equals OC.', reasoning: 'This is the third property proved above, and it is what turns a geometric statement into an equation.' },
        { text: 'Write 3x - 2 = x + 6.', reasoning: 'Two expressions describing the same length must be equal to each other.' },
        { text: 'Solve: 2x = 8, so x = 4.', reasoning: 'Collecting the variable on one side and the constants on the other.' },
      ],
      answer: 'x = 4, and each half of the diagonal measures 10 units.',
    },
    {
      id: 's122a.we3',
      prompt: 'Show that if one angle of a parallelogram is a right angle, then all four are.',
      steps: [
        { text: 'Suppose angle A is 90 degrees. Then angle C is also 90 degrees.', reasoning: 'Opposite angles are equal.' },
        { text: 'Angles A and B are co-interior, so angle B is 180 minus 90, which is 90 degrees.', reasoning: 'Co-interior angles between the parallel sides are supplementary.' },
        { text: 'Angle D equals angle B, so angle D is 90 degrees too.', reasoning: 'Opposite angles are equal, which carries the right angle round to the fourth vertex.' },
      ],
      answer: 'All four angles are right angles — so a parallelogram with one right angle is a rectangle.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's122a.g1',
      prompt: 'In parallelogram KLMN, KL = 7 cm. Which other side must be 7 cm, and why?',
      hint: 'Which side is opposite to KL? Opposite means sharing no vertex.',
      answer: 'NM = 7 cm.',
      rationale: 'NM is opposite KL, and opposite sides of a parallelogram are equal — proved from the congruent triangles made by a diagonal.',
    },
    {
      id: 's122a.g2',
      prompt: 'In the proof above, which congruence condition was used for triangles ABC and CDA, and what supplied the side?',
      hint: 'Count what the two triangles agree on, and notice what they have physically in common.',
      answer: 'ASA, with the shared diagonal AC as the side.',
      rationale: 'Two pairs of alternate angles give the two angles; the diagonal belongs to both triangles and sits between those angles.',
    },
    {
      id: 's122a.g3',
      prompt: 'The diagonals of a parallelogram meet at O, and BO = 5 cm. How long is BD?',
      hint: 'The diagonals bisect each other. What does O do to BD?',
      answer: '10 cm.',
      rationale: 'O is the midpoint of BD, so BD is twice BO.',
    },
  ],
  independentPractice: [
    {
      id: 's122a.i1',
      prompt: 'In parallelogram ABCD, angle B is 115 degrees. Find all four angles.',
      answer: 'A = 65, B = 115, C = 65, D = 115 degrees.',
      rationale: 'Opposite angles are equal and co-interior angles add to 180 degrees.',
    },
    {
      id: 's122a.i2',
      prompt: 'Write out the proof that opposite sides of a parallelogram are equal, naming the fact used at each step.',
      answer: 'Draw a diagonal; alternate angles give two angle equalities; ASA gives congruent triangles; corresponding parts give the equal sides.',
      rationale: 'The chain matters as much as the conclusion: parallel gives angles, angles give congruence, congruence gives sides.',
    },
    {
      id: 's122a.i3',
      prompt: 'The diagonals of parallelogram PQRS meet at O, with PO = 2y + 1 and OR = 11. Find y.',
      answer: 'y = 5.',
      rationale: 'Diagonals bisect each other, so 2y + 1 = 11.',
    },
  ],
  reasoningApplication: [
    {
      id: 's122a.r1',
      prompt: 'All three properties came from drawing one diagonal. Would drawing the other diagonal instead have given the same results? Explain why or why not.',
      expectedReasoning:
        'Yes. The argument never uses anything specific to AC; the other diagonal produces the matching pair of triangles with the same alternate-angle reasoning. A strong answer notices that the proof depends on the parallel conditions, which are symmetric in the two pairs of sides.',
    },
  ],
  interactivePractice: [],
  summary:
    'From the single condition that both pairs of opposite sides are parallel, a diagonal and the ASA condition give three results: opposite sides equal, opposite angles equal, and diagonals bisecting each other.',
  nextStep:
    'Each of those statements can be turned around. Next you will ask whether the reversed statements are also true — and whether proving one direction settles the other.',
  teacher: {
    objective: 'Students prove the parallelogram properties from the parallel condition using congruent triangles.',
    prerequisiteKnowledge: ['Alternate and co-interior angles', 'ASA congruence', 'Corresponding parts of congruent triangles'],
    modelLanguage: [
      'What does the parallel condition give us first?',
      'Which fact licenses this step?',
    ],
    teachingNotes: [
      'Keep the chain visible on the board: parallel gives angles, angles give congruence, congruence gives equal parts. Students who memorise the three results without the chain cannot reconstruct them.',
      'The diagonal is a construction, not part of the figure. Say so explicitly — students often think it was always there.',
    ],
    quickChecks: ['Which condition made the triangles congruent?', 'What did the shared diagonal contribute?'],
    supportForStrugglingLearners: [
      'Cut a paper parallelogram along a diagonal and lay one triangle on the other before proving anything.',
      'Colour the two pairs of alternate angles differently before writing the proof.',
    ],
    extension: ['Ask what happens to the three properties if only one pair of opposite sides is parallel.'],
    materialsNeeded: ['Paper parallelograms', 'Scissors', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_12_2_CONVERSES: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s12_2_converses_lesson',
  contentArtifactVersion: 1,
  source: source('12.2', 'Parallelograms', 6, 'ncert_iemh2_s12_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s12_2'],
    mayAssume: [
      'The three properties of a parallelogram and their proofs',
      'Statement, converse and counterexample from chapter 9',
      'Congruence conditions',
    ],
    mustNotIntroduce: [
      { concept: 'The Midpoint Theorem', belongsToSection: 'ncert_iemh2_s12_3' },
      { concept: 'Tiling the plane', belongsToSection: 'ncert_iemh2_s12_4' },
    ],
  },
  learningGoal:
    'You will turn each parallelogram property around into a test, prove the tests that are true, and explain why proving a statement never proves its converse.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the converse of "if a figure is a parallelogram then its opposite sides are equal".',
      'Say what a counterexample does to a claim.',
      'Recall the three properties proved in the previous lesson.',
    ],
    ifNotReady: 'Reread the chapter on propositions and converses. This lesson is that idea applied to geometry.',
  },
  vocabulary: [
    { term: 'converse', meaning: 'The statement obtained by swapping what is given with what is concluded.' },
    { term: 'test', meaning: 'A condition that is enough to guarantee a figure is of a certain kind.' },
    { term: 'counterexample', meaning: 'A single case satisfying the hypothesis and failing the conclusion, which refutes a claim.' },
  ],
  explanation: [
    'Last lesson proved: if a quadrilateral is a parallelogram, then its opposite sides are equal. Turn that around and you get a different statement: if a quadrilateral has equal opposite sides, then it is a parallelogram.',
    'These are not the same claim, and proving the first does nothing at all for the second. The first starts from parallel sides; the second starts from equal sides and has to produce the parallel ones. A proof runs in one direction only.',
    'So the converse must be proved separately — and it can be. Given both pairs of opposite sides equal, draw a diagonal. The two triangles now agree in three sides, so SSS makes them congruent. Their corresponding angles are equal, and those equal angles are alternate angles for the pairs of opposite sides. Equal alternate angles force the sides to be parallel, which is the definition of a parallelogram.',
    'The same works for the other two properties. Equal opposite angles is enough. Diagonals bisecting each other is enough. Each gives a usable test.',
    'Now a warning that the one-direction rule makes necessary. Half of a true test need not be a test at all. "One pair of opposite sides equal" is satisfied by figures that are plainly not parallelograms, and a single such figure settles it. Nothing about the full test being true makes a weakened version true.',
    'There is one more test worth having, and it is not simply a property turned around: if one pair of opposite sides is both equal and parallel, the figure is a parallelogram. Equal alone is not enough, as the counterexample shows; equal and parallel together are.',
  ],
  representations: [
    'A quadrilateral with one pair of equal sides that is not a parallelogram',
    'The same diagonal construction as the forward proof, now run from sides to angles',
  ],
  visuals: [F_COUNTEREXAMPLE],
  visualsById: { F_COUNTEREXAMPLE },
  workedExamples: [
    {
      id: 's122b.we1',
      prompt: 'A quadrilateral has AB = DC and AD = BC. Prove it is a parallelogram.',
      steps: [
        { text: 'Draw diagonal AC. Triangles ABC and CDA share it.', reasoning: 'The shared side turns two separate triangles into a comparable pair.' },
        { text: 'The triangles agree in all three sides, so they are congruent by SSS.', reasoning: 'AB = DC and AD = BC are given; AC is common. Note the condition is SSS here, not the ASA used in the forward proof — the starting information is different.' },
        { text: 'Corresponding angles are equal, in particular the two alternate angles about AC.', reasoning: 'Congruent triangles have equal corresponding angles.' },
        { text: 'Equal alternate angles mean AB is parallel to DC, and likewise AD is parallel to BC.', reasoning: 'The converse of the alternate-angle result, applied to each pair.' },
      ],
      answer: 'Both pairs of opposite sides are parallel, so the figure is a parallelogram.',
    },
    {
      id: 's122b.we2',
      prompt: 'Is this true? "If one pair of opposite sides of a quadrilateral is equal, the quadrilateral is a parallelogram." Decide and justify.',
      steps: [
        { text: 'The claim is universal, so one failing case is enough to refute it.', reasoning: 'A universal claim asserts something about every quadrilateral; a single exception makes it false.' },
        { text: 'Take ABCD with AD = BC but AB not parallel to DC.', reasoning: 'Such a figure is easy to draw: keep the two equal sides and tilt one of the others.' },
        { text: 'This figure satisfies the hypothesis and fails the conclusion.', reasoning: 'That is exactly what a counterexample is.' },
      ],
      answer: 'False. One pair of equal opposite sides is not enough; adding "and parallel" to that same pair makes it true.',
      visualRef: 'F_COUNTEREXAMPLE',
    },
    {
      id: 's122b.we3',
      prompt: 'In quadrilateral WXYZ the diagonals meet at O with WO = OY and XO = OZ. Prove WXYZ is a parallelogram.',
      steps: [
        { text: 'Compare triangles WOX and YOZ.', reasoning: 'These are the triangles the two halves of the diagonals form.' },
        { text: 'WO = OY and XO = OZ are given, and the angles at O are vertically opposite, so equal.', reasoning: 'Two sides and the included angle.' },
        { text: 'So the triangles are congruent by SAS, making WX = YZ and the alternate angles equal.', reasoning: 'Corresponding parts of congruent triangles.' },
        { text: 'Equal alternate angles give WX parallel to YZ; repeating with the other pair of triangles gives the second pair.', reasoning: 'The same argument applied to triangles WOZ and YOX.' },
      ],
      answer: 'Both pairs of opposite sides are parallel, so WXYZ is a parallelogram.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's122b.g1',
      prompt: 'Write the converse of: "If a quadrilateral is a parallelogram, its diagonals bisect each other."',
      hint: 'Swap the given and the conclusion. Do not change either one.',
      answer: 'If the diagonals of a quadrilateral bisect each other, then it is a parallelogram.',
      rationale: 'The converse swaps hypothesis and conclusion and nothing else. Here it happens to be true, but that had to be proved separately.',
    },
    {
      id: 's122b.g2',
      prompt: 'A student says: "We proved opposite angles are equal, so any quadrilateral with equal opposite angles is a parallelogram — same thing." What is wrong with the reasoning, even though the conclusion is true?',
      hint: 'Is the student quoting a proof of the converse, or assuming it follows?',
      answer: 'The conclusion is true but the reasoning is not: the converse needs its own proof.',
      rationale: 'Proving a statement never establishes its converse. The converse here is true, but only because it was separately proved — not because the forward statement was.',
    },
    {
      id: 's122b.g3',
      prompt: 'Which test would you use to show a quadrilateral with AB = DC and AB parallel to DC is a parallelogram?',
      hint: 'One pair of sides, with two things known about it.',
      answer: 'The one-pair test: equal and parallel together.',
      rationale: 'Equal alone fails, as the counterexample shows. The extra parallel condition is what makes the single pair sufficient.',
    },
  ],
  independentPractice: [
    {
      id: 's122b.i1',
      prompt: 'State the converse of "if a quadrilateral is a parallelogram, its opposite sides are equal", and say whether it is true.',
      answer: 'If a quadrilateral has equal opposite sides, it is a parallelogram. True, by the SSS argument.',
      rationale: 'The converse is a separate statement that happens to be provable; the proof uses SSS where the forward proof used ASA.',
    },
    {
      id: 's122b.i2',
      prompt: 'Give a quadrilateral with exactly one pair of equal opposite sides that is not a parallelogram, and explain what it refutes.',
      answer: 'Any figure with AD = BC and AB not parallel to DC refutes the claim that one pair of equal sides is sufficient.',
      rationale: 'A single counterexample is enough against a universal claim.',
    },
    {
      id: 's122b.i3',
      prompt: 'The diagonals of a quadrilateral are equal in length. Is it a parallelogram? Justify your answer.',
      answer: 'Not necessarily — equal diagonals is a different condition from diagonals that bisect each other.',
      rationale: 'The proved test is about bisection, not length. An isosceles trapezium has equal diagonals and is not a parallelogram.',
    },
  ],
  reasoningApplication: [
    {
      id: 's122b.r1',
      prompt: 'Three tests were proved true, and one plausible-looking condition turned out to be false. What does this tell you about deciding whether a converse is true by how reasonable it sounds?',
      expectedReasoning:
        'That it cannot be decided that way at all. A good answer separates the two outcomes: a converse is established only by proof, and refuted only by a counterexample, and sounding reasonable does neither. It may also note that the false condition is a weakened version of a true test.',
    },
  ],
  interactivePractice: [],
  summary:
    'Each parallelogram property reversed gives a test, and each test needs its own proof. Equal opposite sides, equal opposite angles, or diagonals bisecting each other are enough; one pair of equal sides alone is not, and a single counterexample settles that.',
  nextStep:
    'Next you will use these tests inside a larger proof, where a parallelogram has to be recognised before anything else can be concluded.',
  teacher: {
    objective: 'Students distinguish a statement from its converse, prove the parallelogram tests, and refute an insufficient condition.',
    prerequisiteKnowledge: ['Parallelogram properties and their proofs', 'Converse and counterexample', 'SSS and SAS congruence'],
    modelLanguage: [
      'Which direction are we proving now?',
      'What would a counterexample to this have to look like?',
    ],
    teachingNotes: [
      'Write the statement and its converse one above the other every time. The visual separation does more than any amount of explanation.',
      'The false condition is the lesson. Let students try to prove it before showing the counterexample — the failed attempt is what makes the point stick.',
      'Watch for the phrase "same thing" in student talk; it is the equivalence error appearing in ordinary words.',
    ],
    quickChecks: ['State the converse of this. Is it true? How do you know?', 'What is the difference between what we proved and what we assumed?'],
    supportForStrugglingLearners: [
      'Use a sentence frame: "If ___ then ___" and have students physically swap the two halves.',
      'Build the counterexample with straws so the equal sides can be kept while the parallel condition is broken.',
    ],
    extension: ['Ask which of the four tests would still work if the quadrilateral were allowed to be non-convex.'],
    materialsNeeded: ['Straws or geo-strips', 'Ruler', 'Protractor'],
  },
  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §12.3 — Applications of Parallelograms.  SPLIT ON SUBSECTION EVIDENCE.
//
// The section prints two numbered subsections: 12.3.1 establishes the
// Midpoint Theorem, 12.3.2 uses it to get an unexpected result about
// medians. Proving a theorem and deducing consequences from it are
// different demands, and the book marks the boundary itself.
// ===========================================================================

export const SECTION_12_3_MIDPOINT: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s12_3_midpoint_lesson',
  contentArtifactVersion: 1,
  source: source('12.3', 'Applications of Parallelograms', 10, 'ncert_iemh2_s12_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s12_2'],
    mayAssume: ['The parallelogram tests', 'Congruence conditions', 'Midpoint of a segment'],
    mustNotIntroduce: [
      { concept: 'The median result', belongsToSection: 'ncert_iemh2_s12_3' },
      { concept: 'Tiling the plane', belongsToSection: 'ncert_iemh2_s12_4' },
    ],
  },
  learningGoal:
    'You will prove that the segment joining the midpoints of two sides of a triangle is parallel to the third side and half its length, and prove the converse.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Name a test that shows a quadrilateral is a parallelogram.',
      'Mark the midpoint of a segment and say what it guarantees.',
      'Use SAS to show two triangles are congruent.',
    ],
    ifNotReady: 'Go back to the parallelogram tests — this proof works by building a parallelogram where none was given.',
  },
  vocabulary: [
    { term: 'midpoint', meaning: 'The point that divides a segment into two equal parts.' },
    { term: 'midsegment', meaning: 'The segment joining the midpoints of two sides of a triangle.' },
  ],
  explanation: [
    'Take any triangle ABC. Mark M, the midpoint of AB, and N, the midpoint of AC, and join them. Measure, and you will find MN is parallel to BC and exactly half its length. Measuring is not proving, so the question is why.',
    'The proof uses a construction that looks like a trick until you see its purpose. Extend MN beyond N to a point D so that MN equals ND, and join DC.',
    'Now triangles ANM and CND are congruent: AN equals NC because N is a midpoint, MN equals ND by construction, and the angles at N are vertically opposite. SAS gives the congruence.',
    'That congruence does two things at once. It makes DC equal to AM, which equals MB since M is a midpoint. And it makes the alternate angles at N equal, so DC is parallel to AM — that is, parallel to MB.',
    'So in quadrilateral MBCD, the pair MB and DC is both equal and parallel. That is precisely the one-pair test from the previous lesson, so MBCD is a parallelogram. Therefore MD is parallel to BC, which makes MN parallel to BC; and MD equals BC, while MN is half of MD.',
    'The converse is also true and is often the more useful direction: if a line through the midpoint of one side runs parallel to a second side, it meets the third side at its midpoint. It is proved by the same style of argument, and like every converse it needed proving in its own right.',
  ],
  representations: [
    'A triangle with the two midpoints marked and the midsegment drawn',
    'The extended segment and the parallelogram the construction creates',
  ],
  visuals: [F_MIDPOINT],
  visualsById: { F_MIDPOINT },
  workedExamples: [
    {
      id: 's123a.we1',
      prompt: 'In triangle PQR, A and B are the midpoints of PQ and PR. If QR = 14 cm, find AB.',
      steps: [
        { text: 'A and B are midpoints of two sides, so AB is a midsegment.', reasoning: 'The theorem applies only when both points are midpoints; check that first.' },
        { text: 'AB is half of QR.', reasoning: 'The theorem gives both the parallel direction and the halving; here the length is what is asked.' },
        { text: 'AB = 14 divided by 2 = 7 cm.', reasoning: 'Substituting the given length.' },
      ],
      answer: 'AB = 7 cm, and AB is parallel to QR.',
      visualRef: 'F_MIDPOINT',
    },
    {
      id: 's123a.we2',
      prompt: 'In triangle XYZ, M is the midpoint of XY and the line through M parallel to YZ meets XZ at N. Show that N is the midpoint of XZ.',
      steps: [
        { text: 'Here we are given one midpoint and a parallel, and asked for the second midpoint.', reasoning: 'That is the converse direction, not the theorem itself — notice which information is given before choosing the tool.' },
        { text: 'Apply the converse of the Midpoint Theorem.', reasoning: 'It is exactly the statement that a line through one midpoint parallel to a second side bisects the third.' },
      ],
      answer: 'N is the midpoint of XZ.',
    },
    {
      id: 's123a.we3',
      prompt: 'Why does the proof extend MN to D rather than working with triangle AMN directly?',
      steps: [
        { text: 'Triangle AMN alone gives no parallel sides to work with.', reasoning: 'The information available is about midpoints, and midpoints by themselves do not produce parallels.' },
        { text: 'Extending MN creates a second triangle congruent to the first, and with it a pair of sides that are equal and parallel.', reasoning: 'The construction manufactures exactly the condition the one-pair parallelogram test needs.' },
        { text: 'The parallelogram then supplies the parallel and the length relation together.', reasoning: 'Both halves of the conclusion come out of the same figure.' },
      ],
      answer: 'The construction converts a statement about midpoints into a parallelogram, where the tools from the last lesson apply.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's123a.g1',
      prompt: 'In triangle ABC, D is the midpoint of AB and E is a point on AC with DE parallel to BC. Is E necessarily the midpoint of AC?',
      hint: 'Which direction of the theorem does this match — the one that starts with two midpoints, or the one that starts with one midpoint and a parallel?',
      answer: 'Yes, by the converse.',
      rationale: 'One midpoint plus a parallel to the second side forces the third side to be bisected. That is the converse, which was proved separately.',
    },
    {
      id: 's123a.g2',
      prompt: 'A midsegment of a triangle measures 6 cm. How long is the side it is parallel to?',
      hint: 'The midsegment is half the third side, so the third side is what in relation to it?',
      answer: '12 cm.',
      rationale: 'The relation runs both ways: if MN is half of BC then BC is twice MN.',
    },
    {
      id: 's123a.g3',
      prompt: 'In the proof, what makes MBCD a parallelogram?',
      hint: 'Which test needs only one pair of sides?',
      answer: 'MB and DC are equal and parallel.',
      rationale: 'The one-pair test applies: equal alone would not be enough, which is why the congruence was used to get the parallel as well.',
    },
  ],
  independentPractice: [
    {
      id: 's123a.i1',
      prompt: 'In triangle ABC, the midpoints of AB, BC and CA are P, Q and R. If AB = 10, BC = 12 and CA = 8, find PQ, QR and RP.',
      answer: 'PQ = 4, QR = 5, RP = 6.',
      rationale: 'Each midsegment is half the side it is parallel to: PQ is half CA, QR is half AB, RP is half BC.',
    },
    {
      id: 's123a.i2',
      prompt: 'Write out the proof of the Midpoint Theorem, naming the construction and the test used.',
      answer: 'Extend MN to D with ND = MN; SAS gives congruent triangles; MB and DC become equal and parallel; the one-pair test gives the parallelogram; MD parallel and equal to BC finishes it.',
      rationale: 'The construction is the step that cannot be guessed, which is why it must be stated rather than assumed.',
    },
    {
      id: 's123a.i3',
      prompt: 'Is the statement "if a segment inside a triangle is parallel to one side and half its length, it joins two midpoints" something the theorem establishes?',
      answer: 'No — it is a different converse and would need its own proof.',
      rationale: 'The proved converse starts from one midpoint and a parallel. Starting from the length and direction alone is a third statement, and the one-direction rule applies to it too.',
    },
  ],
  reasoningApplication: [
    {
      id: 's123a.r1',
      prompt: 'The theorem gives two conclusions — parallel and half the length. Could a figure satisfy one without the other? Reason about what each would mean.',
      expectedReasoning:
        'The conclusions come from the same parallelogram, so under the theorem hypothesis they arrive together. A strong answer separates "the theorem produces both" from "any segment with one property has the other", and tests the second with a segment parallel to BC but not through the midpoints.',
    },
  ],
  interactivePractice: [],
  summary:
    'The segment joining two midpoints of a triangle is parallel to the third side and half as long. The proof builds a parallelogram that was not in the original figure, and the converse — one midpoint plus a parallel gives the second midpoint — is a separate result with its own proof.',
  nextStep:
    'Next you will use the theorem rather than prove it, and reach a result about medians that is hard to guess from the figure.',
  teacher: {
    objective: 'Students prove the Midpoint Theorem and its converse, and choose the correct direction for a given problem.',
    prerequisiteKnowledge: ['Parallelogram tests', 'SAS congruence', 'Midpoints'],
    modelLanguage: ['What are we given, and what must we show?', 'Why is the construction needed here?'],
    teachingNotes: [
      'Have students measure first and conjecture. The gap between a convincing measurement and a proof is the point of the lesson.',
      'The construction is the hardest step to accept. Ask what the figure lacks before it is drawn, so the extension answers a felt need.',
      'Keep the two directions on separate lines; students reach for the theorem when the converse is what the problem gives them.',
    ],
    quickChecks: ['Which direction does this problem need?', 'What does the construction create that was not there?'],
    supportForStrugglingLearners: [
      'Cut out the triangle and fold vertex A onto BC to see the midsegment appear.',
      'Give the construction as a drawn figure first and ask what is true in it, before asking for the proof.',
    ],
    extension: ['Ask what the three midsegments together do to the triangle, as preparation for the next lesson.'],
    materialsNeeded: ['Ruler', 'Paper triangles', 'Scissors'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_12_3_MEDIANS: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s12_3_medians_lesson',
  contentArtifactVersion: 1,
  source: source('12.3', 'Applications of Parallelograms', 10, 'ncert_iemh2_s12_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s12_3'],
    mayAssume: ['The Midpoint Theorem and its converse', 'Parallelogram tests', 'Medians of a triangle'],
    mustNotIntroduce: [{ concept: 'Tiling the plane', belongsToSection: 'ncert_iemh2_s12_4' }],
  },
  learningGoal:
    'You will use the Midpoint Theorem to derive new results, including what the three midpoints of a triangle produce and how a median behaves.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the Midpoint Theorem in both directions.',
      'Draw a median of a triangle.',
      'Recognise when two triangles are congruent by SSS.',
    ],
    ifNotReady: 'Return to the previous lesson. This one uses the theorem as a tool and does not reprove it.',
  },
  vocabulary: [
    { term: 'median', meaning: 'A segment from a vertex of a triangle to the midpoint of the opposite side.' },
    { term: 'medial triangle', meaning: 'The triangle formed by joining the midpoints of all three sides.' },
  ],
  explanation: [
    'A proved theorem is worth more than the statement it makes, because it becomes a tool. This lesson uses the Midpoint Theorem instead of proving anything new from scratch.',
    'Join all three midpoints of triangle ABC. Each of the three segments is a midsegment, so each is parallel to a side and half its length. The inner triangle therefore has sides half the length of the original, and the four small triangles that appear are all congruent by SSS.',
    'That is already a result worth having: the three midsegments cut any triangle into four congruent pieces, each similar in shape to the whole. Nothing was measured; it follows from applying one theorem three times.',
    'Now the median. Draw median AD from A to the midpoint D of BC, and take E as the midpoint of AB. By the Midpoint Theorem, ED is parallel to AC. Any line parallel to AC through the midpoint of AB meets the other side at its midpoint, so a line drawn this way bisects whatever it crosses.',
    'This is how deduction usually looks once a theorem exists. The hard work was the construction in the last lesson; here the same theorem is applied two or three times and surprising results fall out. Notice also what is not claimed: nothing here says the medians meet at a single point. That is true, and it needs its own argument.',
  ],
  representations: [
    'A triangle with all three midsegments drawn, showing four congruent triangles',
    'A median with a midsegment crossing it',
  ],
  visuals: [F_MIDPOINT],
  visualsById: { F_MIDPOINT },
  workedExamples: [
    {
      id: 's123b.we1',
      prompt: 'Triangle ABC has sides 8, 10 and 12. The midpoints of the sides are joined. Find the perimeter of the inner triangle.',
      steps: [
        { text: 'Each side of the inner triangle is a midsegment, so each is half a side of ABC.', reasoning: 'The Midpoint Theorem applies to all three, since all three vertices of the inner triangle are midpoints.' },
        { text: 'The inner sides are 4, 5 and 6.', reasoning: 'Halving each of 8, 10 and 12, since every midsegment is half its parallel side.' },
        { text: 'The perimeter is 4 + 5 + 6 = 15.', reasoning: 'Adding the three sides — which is exactly half the perimeter of ABC.' },
      ],
      answer: '15 units, half the perimeter of the original triangle.',
    },
    {
      id: 's123b.we2',
      prompt: 'Show that the three midsegments cut a triangle into four congruent triangles.',
      steps: [
        { text: 'Each midsegment is half the side it is parallel to.', reasoning: 'Three applications of the Midpoint Theorem.' },
        { text: 'Each of the three corner triangles has sides equal to the three halves.', reasoning: 'Each corner triangle is bounded by two half-sides and one midsegment, and each of those has a matching length.' },
        { text: 'The inner triangle also has those three lengths as its sides.', reasoning: 'Its sides are the three midsegments.' },
        { text: 'All four triangles agree in three sides, so SSS makes them congruent.', reasoning: 'Congruence is being concluded from lengths alone, with no angle measured.' },
      ],
      answer: 'All four triangles are congruent to one another.',
    },
    {
      id: 's123b.we3',
      prompt: 'In triangle ABC, E is the midpoint of AB and the line through E parallel to BC meets the median AD at F. What can be said about F?',
      steps: [
        { text: 'Consider triangle ABD, in which AD is a side and E is the midpoint of AB.', reasoning: 'Choosing the right sub-triangle is the whole move here — the result is about AD, so work in a triangle containing it.' },
        { text: 'EF is parallel to BD, since BD lies along BC.', reasoning: 'The line through E was drawn parallel to BC, and BD is part of BC.' },
        { text: 'By the converse of the Midpoint Theorem, F is the midpoint of AD.', reasoning: 'One midpoint plus a parallel to the second side bisects the third.' },
      ],
      answer: 'F is the midpoint of the median AD.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's123b.g1',
      prompt: 'The medial triangle of a triangle has perimeter 21 cm. What is the perimeter of the original?',
      hint: 'Each midsegment is half a side. What does that do to the total?',
      answer: '42 cm.',
      rationale: 'Every side halves, so the perimeter halves; reversing it doubles.',
    },
    {
      id: 's123b.g2',
      prompt: 'Which congruence condition shows the four small triangles are congruent, and why is that one available?',
      hint: 'What did the Midpoint Theorem give you — lengths, angles, or both?',
      answer: 'SSS, because the theorem supplies all three side lengths.',
      rationale: 'No angles were measured. The theorem produced lengths, so the side-based condition is the one that applies.',
    },
    {
      id: 's123b.g3',
      prompt: 'Is the inner triangle the same size as each corner triangle, or only the same shape?',
      hint: 'Congruent means more than similar. What did SSS establish?',
      answer: 'The same size — they are congruent, not merely similar.',
      rationale: 'All three sides match exactly, which is congruence. Similarity alone would allow different sizes.',
    },
  ],
  independentPractice: [
    {
      id: 's123b.i1',
      prompt: 'Triangle PQR has PQ = 9, QR = 11 and RP = 14. Find the three sides of its medial triangle.',
      answer: '4.5, 5.5 and 7.',
      rationale: 'Each midsegment is half the side it is parallel to.',
    },
    {
      id: 's123b.i2',
      prompt: 'In triangle ABC, D and E are the midpoints of BC and AC. Prove that DE is parallel to AB without measuring.',
      answer: 'D and E are midpoints of two sides, so DE is a midsegment and therefore parallel to the third side AB.',
      rationale: 'A direct application of the theorem; the work is in checking that both points really are midpoints.',
    },
    {
      id: 's123b.i3',
      prompt: 'Explain why the four congruent triangles result needs the Midpoint Theorem rather than just a drawing.',
      answer: 'A drawing shows one case; the theorem shows every triangle behaves this way.',
      rationale: 'The result is a universal claim, and no number of accurate drawings establishes one.',
    },
  ],
  reasoningApplication: [
    {
      id: 's123b.r1',
      prompt: 'The medial triangle can itself be given a medial triangle, and so on. Describe what happens to the side lengths and to the area at each stage, and justify the area claim from the congruence result rather than by calculating.',
      expectedReasoning:
        'Sides halve each time. Area becomes a quarter each time, and the congruence result justifies it directly: the triangle is cut into four congruent pieces, so each piece is a quarter of the whole. A strong answer avoids a formula and reasons from the dissection.',
    },
  ],
  interactivePractice: [],
  summary:
    'Applying the Midpoint Theorem three times cuts any triangle into four congruent triangles, and applying it inside a sub-triangle shows that a line through one midpoint parallel to a side bisects the median it crosses. Both follow from a theorem already proved.',
  nextStep:
    'The last lesson of the chapter leaves proof about a single figure behind and asks what copies of one quadrilateral can do to the whole plane.',
  teacher: {
    objective: 'Students apply the Midpoint Theorem as a tool to derive further results, including the four-congruent-triangles dissection.',
    prerequisiteKnowledge: ['Midpoint Theorem and converse', 'SSS congruence', 'Medians'],
    modelLanguage: ['Which triangle should we work inside?', 'Are we proving the theorem or using it?'],
    teachingNotes: [
      'This lesson is deliberately lighter on construction and heavier on choosing the right sub-triangle. That choice is the skill being built.',
      'Students often assert that the medians meet at one point because they have seen it. Acknowledge it is true and note it is not proved here.',
    ],
    quickChecks: ['Which theorem are you using, and in which direction?', 'Why SSS and not SAS?'],
    supportForStrugglingLearners: [
      'Cut the four small triangles out and stack them to confirm congruence before proving it.',
      'Shade the sub-triangle being worked in, so the relevant figure is visually separated.',
    ],
    extension: ['Ask what the repeated medial triangles converge towards, informally.'],
    materialsNeeded: ['Paper triangles', 'Scissors', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

// ===========================================================================
// §12.4 — Tiling the Plane Using Any 4-gon.  One section, one unit.
// ===========================================================================

export const SECTION_12_4: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s12_4_lesson',
  contentArtifactVersion: 1,
  source: source('12.4', 'Tiling the Plane Using Any 4-gon', 19, 'ncert_iemh2_s12_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s12_3'],
    mayAssume: ['The definition of a quadrilateral', 'Angle sum of a quadrilateral', 'Rotation by a half turn'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will show that copies of any quadrilateral can cover the plane with no gaps and no overlaps, and justify why the copies meet exactly at vertices.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'State the sum of the four angles of a quadrilateral.',
      'Describe what a half turn about a point does to a figure.',
      'Identify the midpoint of a side.',
    ],
    ifNotReady: 'Make sure the angle sum is secure. The whole argument turns on four angles meeting at a point.',
  },
  vocabulary: [
    { term: 'tiling', meaning: 'A covering of the plane by copies of a shape with no gaps and no overlaps.' },
    { term: 'half turn', meaning: 'A rotation of 180 degrees about a point.' },
  ],
  explanation: [
    'Squares tile the plane, and so do regular hexagons; regular pentagons do not. It is reasonable to expect quadrilaterals to be fussy in the same way. They are not. Every quadrilateral tiles the plane — including the awkward non-convex ones.',
    'The method is a half turn. Take quadrilateral ABCD and rotate a copy 180 degrees about the midpoint of one side. The rotated copy lands with that whole side matching the original, so the two fit edge to edge with nothing between them.',
    'Repeat about the midpoints of the other sides, and keep going outward. The question is whether this ever goes wrong — whether a gap or an overlap appears where four tiles meet.',
    'It does not, and the reason is the angle sum. A half turn about the midpoint of a side brings the two angles at that side together, and around any meeting point the four angles that arrive are the four different angles of the original quadrilateral, one of each. Their sum is 360 degrees, so they close exactly: no gap, no overlap.',
    'That last step is the proof. Everything before it is a procedure, and a procedure that looks right in a drawing could still fail somewhere further out. The angle sum is what rules that out for every quadrilateral at once, which is why the result holds even for shapes that look too irregular to tile.',
  ],
  representations: [
    'A quadrilateral and its half-turn copy sharing a complete side',
    'A meeting point where all four angles of the quadrilateral arrive',
  ],
  visuals: [F_TILING],
  visualsById: { F_TILING },
  workedExamples: [
    {
      id: 's124.we1',
      prompt: 'A quadrilateral has angles 70, 95, 110 and 85 degrees. Four tiles meet at a point, one of each angle. Show the tiling closes there.',
      steps: [
        { text: 'Add the four angles: 70 + 95 + 110 + 85.', reasoning: 'The meeting point receives one angle from each of the four tiles around it.' },
        { text: 'The total is 360 degrees.', reasoning: 'This is the angle sum of any quadrilateral, so it is not a coincidence of these numbers.' },
        { text: 'A full turn is 360 degrees, so the four angles fill the space exactly.', reasoning: 'Less than 360 would leave a gap; more would force an overlap.' },
      ],
      answer: 'The angles close exactly, so there is no gap and no overlap at that point.',
      visualRef: 'F_TILING',
    },
    {
      id: 's124.we2',
      prompt: 'Does the argument still work for a non-convex quadrilateral, where one angle is a reflex angle?',
      steps: [
        { text: 'Check what the argument actually used: that the four angles sum to 360 degrees.', reasoning: 'Identifying the load-bearing fact is what tells you whether a case is covered.' },
        { text: 'The angle sum of a quadrilateral is 360 degrees whether or not it is convex.', reasoning: 'Convexity was never part of the angle-sum result.' },
        { text: 'So the four angles still close at each meeting point.', reasoning: 'The proof does not distinguish the cases, so neither does the conclusion.' },
      ],
      answer: 'Yes. The argument never used convexity, so non-convex quadrilaterals tile too.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's124.g1',
      prompt: 'Why must the rotation be about the midpoint of a side rather than about a vertex?',
      hint: 'What has to match up between the original and the copy?',
      answer: 'A half turn about a side midpoint maps that side onto itself, so the copy shares the whole side.',
      rationale: 'Rotating about a vertex would leave the copy touching at a single point, not along an edge, and gaps would open.',
    },
    {
      id: 's124.g2',
      prompt: 'A student tiles with a quadrilateral and finds a gap. What does that tell you?',
      hint: 'The proof says the angles always close. So what must have gone wrong instead?',
      answer: 'The construction was carried out incorrectly — the result guarantees no gap is possible.',
      rationale: 'A proved universal result is not refuted by a faulty drawing; the error is in the execution, not the mathematics.',
    },
    {
      id: 's124.g3',
      prompt: 'Which single fact about quadrilaterals makes the tiling close?',
      hint: 'Look at what is added at a meeting point.',
      answer: 'The angles of any quadrilateral sum to 360 degrees.',
      rationale: 'That is exactly a full turn, so one of each angle fills the space around the point.',
    },
  ],
  independentPractice: [
    {
      id: 's124.i1',
      prompt: 'Explain why a regular pentagon does not tile the plane, using the same kind of angle reasoning.',
      answer: 'Its angle is 108 degrees, and no whole number of 108s makes 360.',
      rationale: 'Three give 324 and four give 432, so a gap or an overlap is unavoidable — the same argument, with a different outcome.',
    },
    {
      id: 's124.i2',
      prompt: 'Describe the tiling method for a given quadrilateral in three steps.',
      answer: 'Rotate a copy a half turn about the midpoint of a side; repeat for each side; continue outward.',
      rationale: 'Each half turn produces an edge-to-edge match, and the angle sum guarantees the meeting points close.',
    },
    {
      id: 's124.i3',
      prompt: 'Does the result say that every pentagon fails to tile? Justify your answer.',
      answer: 'No. It says nothing about pentagons at all; it is a statement about quadrilaterals.',
      rationale: 'Some non-regular pentagons do tile. A proof about one class of shapes makes no claim about another.',
    },
  ],
  reasoningApplication: [
    {
      id: 's124.r1',
      prompt: 'The proof shows every quadrilateral tiles the plane. Does it also show that every quadrilateral tiles in only one way? Decide, and explain what the proof does and does not establish.',
      expectedReasoning:
        'It establishes existence, not uniqueness. A good answer separates the two claims and notes that a parallelogram, for instance, can also be tiled by translation alone, so at least one quadrilateral tiles in more than one way.',
    },
  ],
  interactivePractice: [],
  summary:
    'Half turns about side midpoints place copies of any quadrilateral edge to edge, and the 360-degree angle sum guarantees that four tiles close exactly at every meeting point. Convexity is never used, so the result covers every quadrilateral.',
  nextStep:
    'You have now defined a quadrilateral, proved what a parallelogram gives you, turned those statements into tests, used a theorem to derive new results, and applied the angle sum to the whole plane.',
  teacher: {
    objective: 'Students justify that any quadrilateral tiles the plane, identifying the angle sum as the load-bearing fact.',
    prerequisiteKnowledge: ['Angle sum of a quadrilateral', 'Half turns', 'Midpoints'],
    modelLanguage: ['What arrives at this meeting point?', 'Which fact is doing the work here?'],
    teachingNotes: [
      'Have students cut four copies of one irregular quadrilateral and assemble them before any argument. The surprise motivates the question.',
      'Insist on the distinction between a procedure that works in the drawing and a proof that it always works. This chapter has been building to exactly that distinction.',
      'The non-convex case is worth doing. It is where the generality of the argument becomes visible.',
    ],
    quickChecks: ['Why 360 and not some other total?', 'Where exactly could a gap appear, and why does it not?'],
    supportForStrugglingLearners: [
      'Pre-cut identical quadrilaterals in card so the assembly is quick and attention stays on the angles.',
      'Colour the four angles of the original differently and match the colours at a meeting point.',
    ],
    extension: ['Ask whether every pentagon fails, and let students find a pentagon that does tile.'],
    materialsNeeded: ['Card quadrilaterals', 'Scissors', 'Coloured pencils'],
  },
  reviewStatus: 'authored_draft',
};

/** The pilot chapter, in the book's order. Six lessons from four sections. */
export function quadrilateralsChapterSections(): AuthoredSection[] {
  return [
    SECTION_12_1,
    SECTION_12_2_PROPERTIES,
    SECTION_12_2_CONVERSES,
    SECTION_12_3_MIDPOINT,
    SECTION_12_3_MEDIANS,
    SECTION_12_4,
  ];
}
