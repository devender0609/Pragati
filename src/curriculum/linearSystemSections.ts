// ===========================================================================
// v0.84.0-c10.6 checkpoint 60 — CLASS 10 PAIR OF LINEAR EQUATIONS.
//
// The risk is that four readings of the same pair can contradict one
// another: a graph showing intersecting lines beside algebra saying
// parallel, or substitution and elimination reaching different pairs. Each
// half looks right on its own, which is what makes the contradiction
// survivable.
//
// So every lesson here holds a `LinearSystem` and reads from it. The
// classification, the solution, the plotted lines, the intersection and both
// method traces are all derived from the same coefficients, and
// `validateLinearSystem` fails the build if any of them part company.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §3.2
// (folio 25) and §3.3 with subsections 3.3.1 Substitution and 3.3.2
// Elimination (folio 30). The current source contains NO cross-multiplication
// method, so none is taught.
//
// On subsection identity: §3.3 is the official section the registry verifies,
// and 3.3.1 and 3.3.2 are the numbered subsections within it. Checkpoint 54
// established that each earns its own instructional unit because substitution
// and elimination have different failure modes — so both lessons name §3.3 as
// their official provenance and are distinguished by their artifact ids,
// rather than by inventing section ids the registry does not recognise.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  formatRational, lineRelationship, pointsOn, scalarMultiple,
  solveBySubstitution, uniqueSolution,
  type LinearSystem, type LinearSystemGraphSpec,
} from './linearSystem';

export const LINEAR_SYSTEMS_CHAPTER_ID = 'ncert_jemh1_ch03';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (sectionNumber: string, exactTitle: string, startPage: number, officialSectionId: string) => ({
  officialChapterId: LINEAR_SYSTEMS_CHAPTER_ID, officialSectionId, sectionNumber, exactTitle,
  startPage, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

const eq = (a: number, b: number, c: number, label: string) => ({ a, b, c, label });

// --- the canonical systems -------------------------------------------------
// Every number any lesson states about these is read from the model.

/** Intersecting at (3, 2). */
export const S_UNIQUE: LinearSystem = {
  id: 'unique_3_2',
  first: eq(2, 3, 12, '2x + 3y = 12'),
  second: eq(1, -1, 1, 'x \u2212 y = 1'),
};

/** Distinct parallels: same direction, different constants. */
export const S_PARALLEL: LinearSystem = {
  id: 'parallel',
  first: eq(2, 3, 12, '2x + 3y = 12'),
  second: eq(4, 6, 30, '4x + 6y = 30'),
};

/** Coincident: the second is twice the first. */
export const S_COINCIDENT: LinearSystem = {
  id: 'coincident',
  first: eq(2, 3, 12, '2x + 3y = 12'),
  second: eq(4, 6, 24, '4x + 6y = 24'),
};

/** A non-integer solution, where graphing is unreliable. */
export const S_FRACTIONAL: LinearSystem = {
  id: 'fractional',
  first: eq(3, 2, 7, '3x + 2y = 7'),
  second: eq(2, -3, 1, '2x \u2212 3y = 1'),
};

/** Tickets: 2 adult + 3 child = 1600; 3 adult + 2 child = 1900. */
export const S_TICKETS: LinearSystem = {
  id: 'tickets',
  first: eq(2, 3, 1600, '2x + 3y = 1600'),
  second: eq(3, 2, 1900, '3x + 2y = 1900'),
  meaning: { x: 'the price of one adult ticket in rupees', y: 'the price of one child ticket in rupees' },
};

export const CANONICAL_SYSTEMS = [S_UNIQUE, S_PARALLEL, S_COINCIDENT, S_FRACTIONAL, S_TICKETS];

// Figures read from the model.
const sol = (s: LinearSystem) => uniqueSolution(s)!;
const pair = (s: LinearSystem) => `(${formatRational(sol(s).x)}, ${formatRational(sol(s).y)})`;
const U = sol(S_UNIQUE);
const T = sol(S_TICKETS);
const F = sol(S_FRACTIONAL);

const graph = (
  system: LinearSystem, span: number, caption: string, altText: string,
  purpose: LinearSystemGraphSpec['purpose'] = 'show_definition'
): LinearSystemGraphSpec => ({ type: 'linear_system_graph', purpose, status: 'concept_specific', system, span, caption, altText });

export const G_UNIQUE = graph(S_UNIQUE, 7,
  'Two lines crossing at a single point.',
  `The lines 2x + 3y = 12 and x \u2212 y = 1 drawn on the same axes. They slope differently, so they intersect at exactly one point, marked at ${pair(S_UNIQUE)}. That ordered pair is the only one satisfying both equations, which is what makes the pair have a unique solution.`);

export const G_PARALLEL = graph(S_PARALLEL, 9,
  'Two distinct parallel lines, which never meet.',
  'The lines 2x + 3y = 12 and 4x + 6y = 30 drawn on the same axes. The second has coefficients exactly twice those of the first, so the two lines have the same direction, but its constant is not twice 12, so they sit apart. They are distinct parallel lines, never meet, and the pair therefore has no solution.',
  'compare_cases');

export const G_COINCIDENT = graph(S_COINCIDENT, 7,
  'One line carrying two equations.',
  'The equations 2x + 3y = 12 and 4x + 6y = 24 drawn on the same axes. Every coefficient and the constant of the second are exactly twice those of the first, so the two equations describe the same line and only one line appears. They are coincident: every point of one lies on the other, so the pair has infinitely many solutions.',
  'compare_cases');

export const G_TICKETS = graph(S_TICKETS, 800,
  'The ticket-price pair, meeting at one price combination.',
  `The lines 2x + 3y = 1600 and 3x + 2y = 1900 drawn on the same axes, where x is an adult ticket price and y a child ticket price. They cross at one point, ${pair(S_TICKETS)}, so there is exactly one pair of prices consistent with both takings.`,
  'support_reasoning');

export const CANONICAL_GRAPHS = [G_UNIQUE, G_PARALLEL, G_COINCIDENT, G_TICKETS];

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_3_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s3_2_graphical_lesson',
  contentArtifactVersion: 1,
  source: source('3.2', 'Graphical Method of Solution of a Pair of Linear Equations', 25, 'ncert_jemh1_s3_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Plotting a linear equation in two variables from Class IX', 'Reading coordinates from a graph'],
    mustNotIntroduce: [
      { concept: 'Coefficient-ratio classification', belongsToSection: 'ncert_jemh1_s3_2b' },
      { concept: 'Algebraic methods', belongsToSection: 'ncert_jemh1_s3_3' },
    ],
  },
  learningGoal:
    'You will draw a pair of linear equations on one set of axes and read their common solution from the point where the lines meet.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Plot a line from an equation such as 2x + 3y = 12.', 'Find a point on a line by choosing a value for x.', 'Read an ordered pair from a graph.'],
    ifNotReady: 'Revise plotting linear equations from Class IX. This lesson puts two of them on the same axes.',
  },
  vocabulary: [
    { term: 'pair of linear equations', meaning: 'Two linear equations in the same two variables, considered together.' },
    { term: 'solution of a pair', meaning: 'An ordered pair (x, y) that satisfies BOTH equations at once.' },
    { term: 'graphical method', meaning: 'Finding the solution by drawing both lines and reading the point they share.' },
  ],
  explanation: [
    'A single linear equation in two variables has infinitely many solutions \u2014 every point on its line. One equation alone never pins down a particular x and y.',
    'Put a second equation alongside it and the question changes. Now we want the pairs that satisfy BOTH, which graphically means the points lying on both lines at once.',
    `Take 2x + 3y = 12 and x \u2212 y = 1. Each has its own line, and the lines cross at ${pair(S_UNIQUE)}. Substituting x = ${formatRational(U.x)} and y = ${formatRational(U.y)} into the first gives ${2 * 3} + ${3 * 2} = 12, and into the second gives ${3 - 2} = 1. Both hold, which is what makes it the solution of the pair.`,
    'Notice what the graph is doing for us. It is not producing the answer by magic; it is showing which points the two infinite solution sets have in common. The intersection is the overlap of the two lines, read off as an ordered pair.',
    'To draw each line you need only two points, since two points determine a line. Choose convenient values of x, compute the matching y from the equation, and join them. A third point is a useful check: if it does not land on your line, one of the three is wrong.',
    'Every point you plot must actually satisfy its own equation. A line drawn slightly off looks entirely convincing on paper, and its intersection with the other line will then be at the wrong place \u2014 so the check matters more here than the drawing.',
    'The graphical method has a real limitation, which the next lessons address. When the intersection falls at a point like (23/13, 11/13), no amount of care in reading a graph will give you those values. Graphing shows you what kind of answer to expect; it does not always give you the answer.',
  ],
  representations: ['Two lines on one set of axes, drawn from their equations'],
  visuals: [G_UNIQUE],
  visualsById: { G_UNIQUE },
  workedExamples: [
    {
      id: 's32a.we1',
      prompt: 'Solve the pair 2x + 3y = 12 and x \u2212 y = 1 graphically.',
      steps: [
        { text: `Find two points on 2x + 3y = 12. Taking x = ${pointsOn(S_UNIQUE.first)[0].x} gives y = ${pointsOn(S_UNIQUE.first)[0].y}, and x = ${pointsOn(S_UNIQUE.first)[1].x} gives y = ${pointsOn(S_UNIQUE.first)[1].y}.`, reasoning: 'Each point is computed from the equation rather than guessed, so the line drawn through them is the line the equation describes.' },
        { text: `Find two points on x \u2212 y = 1. Taking x = ${pointsOn(S_UNIQUE.second)[0].x} gives y = ${pointsOn(S_UNIQUE.second)[0].y}, and x = ${pointsOn(S_UNIQUE.second)[1].x} gives y = ${pointsOn(S_UNIQUE.second)[1].y}.`, reasoning: 'Two points determine a line, so two correct points are enough to draw it exactly.' },
        { text: `Draw both lines on one set of axes. They cross at ${pair(S_UNIQUE)}.`, reasoning: 'A point on both lines satisfies both equations, which is precisely the definition of a solution of the pair.' },
        { text: `Check in BOTH equations: 2(${formatRational(U.x)}) + 3(${formatRational(U.y)}) = 12, and ${formatRational(U.x)} \u2212 ${formatRational(U.y)} = 1.`, reasoning: 'Reading a graph is approximate, so the ordered pair must be confirmed algebraically; satisfying only one equation would not be enough.' },
      ],
      answer: `x = ${formatRational(U.x)}, y = ${formatRational(U.y)}.`,
      visualRef: 'G_UNIQUE',
    },
    {
      id: 's32a.we2',
      prompt: 'Is (6, 0) a solution of the pair 2x + 3y = 12 and x \u2212 y = 1?',
      steps: [
        { text: 'Test it in the first equation: 2(6) + 3(0) = 12, which is true.', reasoning: 'So (6, 0) does lie on the first line, which is why it can look like a solution at a glance.' },
        { text: 'Test it in the second: 6 \u2212 0 = 6, not 1.', reasoning: 'The point fails the second equation, so it lies on the first line and not on the second.' },
        { text: 'So it is not a solution of the pair.', reasoning: 'A solution of a pair must satisfy both members. Satisfying one is the commonest reason a wrong answer survives a check that was only half done.' },
      ],
      answer: 'No \u2014 it satisfies the first equation only.',
    },
    {
      id: 's32a.we3',
      prompt: 'A student plots (2, 3) as a point on 2x + 3y = 12 and draws their line through it. What goes wrong?',
      steps: [
        { text: 'Test the point: 2(2) + 3(3) = 4 + 9 = 13, not 12.', reasoning: 'The point does not satisfy the equation, so it is not on the line, however close it looks.' },
        { text: 'A line drawn through a wrong point is the wrong line.', reasoning: 'The plot will still look like a perfectly ordinary straight line, which is why nothing about the drawing reveals the error.' },
        { text: 'Its intersection with the other line will be at the wrong place.', reasoning: 'The reported solution then fails the algebraic check, which is the only thing that catches it.' },
        { text: 'At x = 2 the equation gives 3y = 12 \u2212 4 = 8, so y = 8/3 \u2014 not a whole number at all.', reasoning: 'Choosing an x that yields a whole y, such as x = 3 giving y = 2, makes the point easier to plot accurately and is worth doing deliberately.' },
      ],
      answer: 'The point fails the equation, so the line, and any intersection read from it, is wrong.',
    },
  ],
  guidedPractice: [
    { id: 's32a.g1', prompt: 'Find two points on the line x + y = 5.', hint: 'Choose a value for x and compute y.', answer: '(0, 5) and (5, 0), among others.', rationale: 'Substituting x = 0 gives y = 5; substituting y = 0 gives x = 5. Both satisfy the equation exactly.' },
    { id: 's32a.g2', prompt: 'Is (1, 4) a solution of the pair x + y = 5 and x \u2212 y = 1?', hint: 'Both equations, not one.', answer: 'No.', rationale: '1 + 4 = 5 holds, but 1 \u2212 4 = \u22123, not 1. It lies on the first line only.' },
    { id: 's32a.g3', prompt: 'Why is a third plotted point a useful check?', hint: 'What do two points already fix?', answer: 'Because two points already determine the line, so a third that misses it reveals an error.', rationale: 'If all three are computed correctly they are collinear. A third point off the line means at least one of the three was computed wrongly.' },
  ],
  independentPractice: [
    { id: 's32a.i1', prompt: 'Find two points on 3x \u2212 y = 6.', answer: '(2, 0) and (0, \u22126).', rationale: 'y = 3x \u2212 6, so x = 2 gives y = 0 and x = 0 gives y = \u22126. Both satisfy the equation.' },
    { id: 's32a.i2', prompt: 'The lines of a pair cross at (4, 1). What can you say about that ordered pair?', answer: 'It satisfies both equations.', rationale: 'A point on both lines is in both solution sets, which is what makes it the solution of the pair.' },
    { id: 's32a.i3', prompt: 'Why can the graphical method be unreliable for a pair whose solution is (23/13, 11/13)?', answer: 'Because those coordinates cannot be read accurately from a drawing.', rationale: 'The lines genuinely cross there, but no graph read by eye will give thirteenths. An algebraic method is needed to produce the exact values.' },
    { id: 's32a.i4', prompt: 'A pair of lines is drawn and they appear to meet near (2, 3), but (2, 3) fails one equation. What should you conclude?', answer: 'That the reading is approximate, or a line was plotted wrongly.', rationale: 'The algebra is the authority. Either the true intersection is near but not at (2, 3), or one of the plotted points did not satisfy its equation.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's32a.td1',
      prompt: 'One linear equation has infinitely many solutions, yet a pair of them can have exactly one. Explain how adding a second equation reduces infinitely many to one.',
      expectedReasoning:
        'Each equation describes an infinite set of ordered pairs \u2014 all the points on its line. Asking for a solution of the PAIR asks for ordered pairs belonging to both sets at once, which is their overlap. Two lines that are not parallel share exactly one point, so the overlap of two infinite sets is a single ordered pair. Nothing has been removed from either equation; the second simply acts as a further condition that almost every point on the first line fails.',
    },
    {
      id: 's32a.td2',
      prompt: 'Why is checking a graphically read solution in both equations necessary rather than merely careful?',
      expectedReasoning:
        'Because reading a graph is approximate on two counts. The lines themselves may have been drawn through a miscomputed point, which produces a perfectly straight but wrong line, and even correct lines are read by eye to a limited precision. The algebraic check is exact and independent of the drawing, so it catches both errors. And it must use both equations: a pair satisfying only one lies on one line, which is the error a half-finished check lets through.',
    },
  ],
  summary:
    `A solution of a pair is an ordered pair satisfying BOTH equations, which graphically is a point on both lines. Plot each line from two points computed from its own equation, and read the intersection. For 2x + 3y = 12 and x \u2212 y = 1 this is ${pair(S_UNIQUE)}, confirmed by substituting into both. Reading a graph is approximate, so the check is algebraic \u2014 and a solution like (23/13, 11/13) cannot be read from a drawing at all.`,
  nextStep: 'Next you will find out what happens when the lines do not cross.',
  teacher: teacher(
    'Students solve a pair graphically and verify the ordered pair in both equations.',
    ['Plotting linear equations', 'Reading coordinates'],
    ['Compute the point from the equation \u2014 do not estimate it.', 'Both equations, not one.', 'The algebra is the authority, not the drawing.'],
    [
      'The wrong-point example matters because the resulting line looks entirely normal. Students who learn to test each plotted point catch their own errors; those who do not cannot.',
      'The (6, 0) example isolates the half-finished check, which is the commonest way a wrong answer survives.',
      'Mentioning the fractional intersection here motivates the algebraic methods without teaching them.',
    ],
    ['Ask whether a point satisfying one equation is a solution of the pair.', 'Ask why two points are enough to draw a line.'],
    ['Have the student write the substitution check beside each plotted point before drawing.'],
    ['Ask what the graph would look like if the two equations were the same line.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_3_2B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s3_2_consistency_lesson',
  contentArtifactVersion: 1,
  source: source('3.2', 'Graphical Method of Solution of a Pair of Linear Equations', 25, 'ncert_jemh1_s3_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s3_2'],
    mayAssume: ['Graphical solution of a pair', 'Comparing ratios of integers'],
    mustNotIntroduce: [{ concept: 'Algebraic methods of solution', belongsToSection: 'ncert_jemh1_s3_3' }],
  },
  learningGoal:
    'You will classify a pair of linear equations as having one, no, or infinitely many solutions, from the coefficients and from the lines, and confirm the two readings always agree.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Read a solution from the intersection of two lines.', 'Compare two ratios such as 2 : 4 and 3 : 6.', 'Recognise when one equation is a multiple of another.'],
    ifNotReady: 'Revise the previous lesson. Classification is about what the graph looks like before you solve anything.',
  },
  vocabulary: [
    { term: 'consistent', meaning: 'Having at least one solution \u2014 either exactly one, or infinitely many.' },
    { term: 'inconsistent', meaning: 'Having no solution at all.' },
    { term: 'dependent', meaning: 'Consistent with infinitely many solutions, because the two equations describe the same line.' },
    { term: 'coincident', meaning: 'Describing two equations whose lines are the same line.' },
    { term: 'parallel', meaning: 'Having the same direction. Distinct parallel lines never meet.' },
  ],
  explanation: [
    'Two lines in a plane can do exactly three things: cross at one point, run parallel without ever meeting, or lie on top of one another. Those three pictures are the three possible answers for a pair of equations.',
    'Crossing once gives exactly ONE solution. Distinct parallels give NO solution, because no point is on both. Coincident lines give INFINITELY MANY, because every point of one is on the other.',
    'The words for these matter and are easy to blur. A pair is CONSISTENT if it has at least one solution \u2014 so both the one-solution and the infinitely-many cases are consistent. Only the no-solution case is INCONSISTENT. Treating "consistent" as a synonym for "exactly one" is the classic error here.',
    'A consistent pair with infinitely many solutions is also called DEPENDENT, because the second equation depends on the first: it says nothing new.',
    `You can tell which case you have without drawing anything, by comparing the coefficients. Write the pair as a\u2081x + b\u2081y = c\u2081 and a\u2082x + b\u2082y = c\u2082. If a\u2081b\u2082 is not equal to a\u2082b\u2081, the lines have different directions and cross exactly once. For 2x + 3y = 12 and x \u2212 y = 1 this is 2(\u22121) = \u22122 against 3(1) = 3, which differ, so there is one solution \u2014 and indeed the lines meet at ${pair(S_UNIQUE)}.`,
    'If a\u2081b\u2082 does equal a\u2082b\u2081 the directions match, and the constants decide between the remaining two cases. If the whole second equation is the same multiple of the first, the lines coincide; if the coefficients match that multiple but the constant does not, they are distinct parallels.',
    'Compare 4x + 6y = 24 with 2x + 3y = 12: every coefficient AND the constant are doubled, so the equations describe the same line and the pair is dependent. Now compare 4x + 6y = 30: the coefficients are still doubled but 30 is not twice 12, so the lines have the same direction and sit apart \u2014 distinct parallels, no solution.',
    'A practical warning about how to do the comparison. Checking a\u2081b\u2082 against a\u2082b\u2081 by multiplying is safe. Dividing to compare a\u2081/a\u2082 against b\u2081/b\u2082 is not, because a coefficient can be zero, and the division is then undefined even though the pair is perfectly ordinary.',
  ],
  representations: ['The same first equation paired with three different second equations'],
  visuals: [G_PARALLEL, G_COINCIDENT, G_UNIQUE],
  visualsById: { G_PARALLEL, G_COINCIDENT, G_UNIQUE },
  workedExamples: [
    {
      id: 's32b.we1',
      prompt: 'Classify 2x + 3y = 12 and 4x + 6y = 30, and say what the lines do.',
      steps: [
        { text: 'Compare the directions: a\u2081b\u2082 = 2 \u00d7 6 = 12 and a\u2082b\u2081 = 4 \u00d7 3 = 12.', reasoning: 'They are equal, so the two lines have the same direction and cannot cross; the remaining question is whether they are the same line.' },
        { text: 'The second equation has coefficients exactly twice the first. Is its constant twice 12?', reasoning: 'If the whole equation were doubled, it would describe the same line, so the constant is what decides.' },
        { text: 'Twice 12 is 24, and the constant is 30. So the equation is not a multiple of the first.', reasoning: 'Same direction with a different constant places the second line alongside the first rather than on it.' },
        { text: `So the lines are ${lineRelationship(S_PARALLEL).replace('_', ' ')}, and the pair has no solution. It is inconsistent.`, reasoning: 'No point lies on both lines, so no ordered pair satisfies both equations.' },
      ],
      answer: 'Distinct parallel lines; no solution; inconsistent.',
      visualRef: 'G_PARALLEL',
    },
    {
      id: 's32b.we2',
      prompt: 'Classify 2x + 3y = 12 and 4x + 6y = 24.',
      steps: [
        { text: 'Again a\u2081b\u2082 = 12 and a\u2082b\u2081 = 12, so the directions match.', reasoning: 'The first test cannot separate the parallel and coincident cases; only the constant can.' },
        { text: `The second equation is exactly ${formatRational(scalarMultiple(S_COINCIDENT)!)} times the first, constant included: 2 \u00d7 12 = 24.`, reasoning: 'Multiplying an entire equation by a non-zero number gives an equivalent equation, so it has exactly the same solutions.' },
        { text: 'So the two equations describe the same line.', reasoning: 'They look different only because one has been scaled; every ordered pair satisfying one satisfies the other.' },
        { text: 'The pair has infinitely many solutions. It is consistent, and dependent.', reasoning: 'Consistent because solutions exist, and dependent because the second equation adds no information the first did not already carry.' },
      ],
      answer: 'Coincident lines; infinitely many solutions; consistent and dependent.',
      visualRef: 'G_COINCIDENT',
    },
    {
      id: 's32b.we3',
      prompt: 'A student says a pair with infinitely many solutions is inconsistent, "because you cannot pin down an answer". Correct them.',
      steps: [
        { text: 'Consistent means at least one solution exists.', reasoning: 'The word describes whether the system can be satisfied at all, not whether the answer is unique.' },
        { text: 'A dependent pair has infinitely many solutions, so solutions certainly exist.', reasoning: 'Every point on the shared line satisfies both equations, so the pair is satisfiable many times over.' },
        { text: 'It is therefore consistent \u2014 and dependent.', reasoning: 'Inconsistent is reserved for the case where no ordered pair works at all, which is the distinct-parallel case.' },
        { text: 'The student has equated consistent with unique.', reasoning: 'That conflation makes two of the three cases indistinguishable, which is why the vocabulary separates them.' },
      ],
      answer: 'Infinitely many solutions is consistent and dependent, not inconsistent.',
    },
  ],
  guidedPractice: [
    { id: 's32b.g1', prompt: 'Classify x + 2y = 5 and 2x + 4y = 10.', hint: 'Is the whole equation doubled?', answer: 'Coincident; infinitely many solutions; consistent and dependent.', rationale: 'Every coefficient and the constant are doubled, so the equations describe the same line.' },
    { id: 's32b.g2', prompt: 'Classify x + 2y = 5 and 2x + 4y = 7.', hint: 'Compare the direction first, then the constant.', answer: 'Distinct parallels; no solution; inconsistent.', rationale: '1 \u00d7 4 = 2 \u00d7 2, so the directions match, but 7 is not twice 5, so the lines sit apart.' },
    { id: 's32b.g3', prompt: 'Is a pair with exactly one solution consistent?', hint: 'What does consistent require?', answer: 'Yes.', rationale: 'Consistent means at least one solution exists, and one is at least one. Both the unique and the infinitely-many cases are consistent.' },
  ],
  independentPractice: [
    { id: 's32b.i1', prompt: 'Classify 3x \u2212 y = 2 and 6x \u2212 2y = 4.', answer: 'Coincident; infinitely many; consistent and dependent.', rationale: 'The second is exactly twice the first, constant included, so it is the same line.' },
    { id: 's32b.i2', prompt: 'Classify 3x \u2212 y = 2 and 6x \u2212 2y = 9.', answer: 'Distinct parallels; no solution; inconsistent.', rationale: '3 \u00d7 (\u22122) = 6 \u00d7 (\u22121), so the directions match, but 9 is not twice 2.' },
    { id: 's32b.i3', prompt: 'Classify x = 3 and y = 5. Why would a ratio test be awkward here?', answer: 'They intersect at (3, 5); the ratio test would divide by zero.', rationale: 'Written as 1x + 0y = 3 and 0x + 1y = 5, the cross products are 1 \u00d7 1 = 1 and 0 \u00d7 0 = 0, which differ, so there is one solution. Comparing a\u2081/a\u2082 would require dividing by 0.' },
    { id: 's32b.i4', prompt: 'Change the constant 12 in 2x + 3y = 12 so that the pair with 4x + 6y = 30 becomes dependent.', answer: 'Change it to 15.', rationale: 'The coefficients are already doubled, so the pair is dependent exactly when 30 is twice the constant, giving 15.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's32b.td1',
      prompt: 'Why does comparing a\u2081b\u2082 with a\u2082b\u2081 settle the direction, and why is it preferable to comparing a\u2081/a\u2082 with b\u2081/b\u2082?',
      expectedReasoning:
        'Two lines have the same direction exactly when their coefficient pairs are proportional, and proportionality is what a\u2081b\u2082 = a\u2082b\u2081 states \u2014 it is the ratio comparison with the denominators multiplied out. Multiplying is preferable because it is always defined: a pair like x = 3 and y = 5 has zero coefficients, and the division a\u2081/a\u2082 would be undefined even though the pair is perfectly ordinary and has one solution. The products are also exact for whole-number coefficients, where dividing introduces values that must then be compared approximately.',
    },
    {
      id: 's32b.td2',
      prompt: 'Two equations look completely different yet describe the same line. How is that possible, and what does it mean for the pair?',
      expectedReasoning:
        'Multiplying an entire equation by a non-zero number \u2014 every term on both sides \u2014 produces an equation with exactly the same solutions, because any ordered pair making the original true makes the scaled version true and the other way round. So 4x + 6y = 24 and 2x + 3y = 12 are the same statement written at different scales. For the pair it means the second equation adds no information, so the system is dependent and every point on the one line is a solution.',
    },
  ],
  summary:
    'Three pictures, three cases. Crossing once gives one solution; distinct parallels give none; coincident lines give infinitely many. Consistent means at least one solution, so BOTH the one-solution and infinitely-many cases are consistent \u2014 only the parallel case is inconsistent, and the dependent case is the coincident one. Classify by comparing a\u2081b\u2082 with a\u2082b\u2081 for direction, then the constant for which of the remaining two cases applies. Multiply rather than divide, so a zero coefficient causes no trouble.',
  nextStep: 'Next you will solve a pair exactly, without relying on a drawing.',
  teacher: teacher(
    'Students classify a pair from coefficients and from the lines, and use the consistency vocabulary precisely.',
    ['Graphical solution', 'Ratio comparison'],
    ['At least one solution \u2014 that is what consistent means.', 'Multiply, do not divide.', 'Same direction? Then the constant decides.'],
    [
      'The consistent-versus-unique conflation is the conceptual error of this lesson, and the third worked example exists only to confront it.',
      'Pairing 4x + 6y = 24 with 4x + 6y = 30 against the same first equation isolates the role of the constant: everything else is identical.',
      'The x = 3, y = 5 case is worth showing. It is ordinary mathematically and breaks a ratio test, which justifies the cross-product form.',
    ],
    ['Ask whether infinitely many solutions is consistent.', 'Ask what decides between parallel and coincident.'],
    ['Have the student write the two cross products side by side before saying anything about the lines.'],
    ['Ask what single change to a constant turns a dependent pair into an inconsistent one.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_3_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s3_3_substitution_lesson',
  contentArtifactVersion: 1,
  source: source('3.3', 'Algebraic Methods of Solving a Pair of Linear Equations', 30, 'ncert_jemh1_s3_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s3_2'],
    mayAssume: ['Consistency classification', 'Rearranging a linear equation', 'Solving a linear equation in one variable'],
    mustNotIntroduce: [{ concept: 'The elimination method', belongsToSection: 'ncert_jemh1_s3_3 (subsection 3.3.2)' }],
  },
  learningGoal:
    'You will solve a pair of linear equations by substitution, understanding why replacing a variable by an equal expression preserves the solution set.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Make y the subject of an equation such as 2x + 3y = 12.', 'Solve a linear equation in one variable.', 'Substitute a value back to find the second variable.'],
    ifNotReady: 'Revise rearranging equations. Substitution begins by isolating one variable, and a sign error there spoils everything after it.',
  },
  vocabulary: [
    { term: 'substitution', meaning: 'Replacing a variable by an expression equal to it, taken from the other equation.' },
    { term: 'isolate', meaning: 'Rearrange an equation so that one variable stands alone on one side.' },
    { term: 'back-substitution', meaning: 'Putting the value just found back into an earlier equation to get the other variable.' },
  ],
  explanation: [
    'Graphing shows what kind of answer to expect but cannot read off a solution like (23/13, 11/13). Substitution produces the exact values.',
    'The idea is one move. Use one equation to say what y equals in terms of x, then put that expression into the other equation wherever y appears. Since the expression IS y, nothing has changed about which ordered pairs satisfy the system \u2014 but the second equation now contains only x, and an equation in one variable can be solved.',
    'That is why the substitution is legitimate rather than a trick. Replacing something by an equal thing preserves truth, so every solution of the original pair is a solution of what follows, and the other way round.',
    'It matters which equation you substitute INTO. Taking y from the first equation and putting it back into the first gives something like 12 = 12 \u2014 true, and useless, because it reuses information you already had. The expression must go into the OTHER equation, which is where the new information is.',
    `Worked through on 2x + 3y = 12 and x \u2212 y = 1, substitution gives ${pair(S_UNIQUE)}. The work is exact, so the fractional case causes no difficulty either: 3x + 2y = 7 with 2x \u2212 3y = 1 gives ${pair(S_FRACTIONAL)}, values no graph would yield.`,
    'Two steps are easy to skip. Having found x, the second variable still has to be found \u2014 an answer with only one coordinate is not a solution of a pair. And the ordered pair must be checked in BOTH original equations, not in the rearranged ones, since an error made during isolation would be carried into any check using it.',
    'Signs cause most of the trouble. Isolating y from 2x + 3y = 12 gives 3y = 12 \u2212 2x, so y = (12 \u2212 2x) / 3. Writing (12 + 2x) / 3 produces a complete, plausible solution that satisfies neither original equation \u2014 which is exactly what the final check catches.',
  ],
  representations: ['A pair reduced to one equation in one variable'],
  visuals: [G_UNIQUE],
  visualsById: { G_UNIQUE },
  workedExamples: [
    {
      id: 's33a.we1',
      prompt: 'Solve 2x + 3y = 12 and x \u2212 y = 1 by substitution.',
      steps: solveBySubstitution(S_UNIQUE).steps.map((s) => ({ text: s.text, reasoning: s.detail })),
      answer: `x = ${formatRational(U.x)}, y = ${formatRational(U.y)} \u2014 the same point the graph showed.`,
      visualRef: 'G_UNIQUE',
    },
    {
      id: 's33a.we2',
      prompt: 'Solve 3x + 2y = 7 and 2x \u2212 3y = 1 by substitution, where the graph would not help.',
      steps: [
        { text: 'From the second equation, 2x = 1 + 3y, so x = (1 + 3y) / 2.', reasoning: 'Isolating x here avoids fractions for longer than isolating y from the first would, and dividing by 2 is legitimate because 2 is not zero.' },
        { text: 'Substitute into the FIRST equation: 3(1 + 3y)/2 + 2y = 7.', reasoning: 'It must go into the other equation; substituting back into the second would return a statement already known.' },
        { text: 'Multiplying through by 2 gives 3(1 + 3y) + 4y = 14, so 3 + 9y + 4y = 14 and 13y = 11.', reasoning: 'Clearing the denominator keeps the arithmetic in whole numbers, and every term on both sides is multiplied.' },
        { text: `So y = ${formatRational(F.y)}, and back-substituting gives x = ${formatRational(F.x)}.`, reasoning: `x = (1 + 3 \u00d7 ${formatRational(F.y)}) / 2 = (1 + 33/13) / 2 = (46/13) / 2 = ${formatRational(F.x)}.` },
        { text: `Check ${pair(S_FRACTIONAL)} in both originals.`, reasoning: '3(23/13) + 2(11/13) = (69 + 22)/13 = 91/13 = 7, and 2(23/13) \u2212 3(11/13) = (46 \u2212 33)/13 = 1. Both hold exactly.' },
      ],
      answer: `x = ${formatRational(F.x)}, y = ${formatRational(F.y)}.`,
    },
    {
      id: 's33a.we3',
      prompt: 'A student isolates y from 2x + 3y = 12 as y = (12 + 2x) / 3. Where does that lead?',
      steps: [
        { text: 'The correct isolation is 3y = 12 \u2212 2x, so y = (12 \u2212 2x) / 3.', reasoning: 'Moving 2x across the equals sign changes its sign, and the student has kept it positive.' },
        { text: 'Their version substituted into x \u2212 y = 1 gives x \u2212 (12 + 2x)/3 = 1, so 3x \u2212 12 \u2212 2x = 3 and x = 15.', reasoning: 'The arithmetic from this point on is faultless, which is why the error survives to a finished answer.' },
        { text: 'Back-substituting into their expression gives y = (12 + 30)/3 = 14.', reasoning: 'They now have a complete, confident-looking ordered pair (15, 14).' },
        { text: 'Check in the first original: 2(15) + 3(14) = 30 + 42 = 72, not 12.', reasoning: 'The check in the ORIGINAL equation is what exposes it; checking in their own rearranged expression would have agreed with itself.' },
      ],
      answer: 'They get (15, 14), which fails the first equation \u2014 the sign error is caught only by checking the originals.',
    },
  ],
  guidedPractice: [
    { id: 's33a.g1', prompt: 'Isolate y from 4x + y = 9.', hint: 'y is nearly alone already.', answer: 'y = 9 \u2212 4x.', rationale: 'Subtracting 4x from both sides leaves y alone, with no division needed \u2014 which is what makes this pair convenient for substitution.' },
    { id: 's33a.g2', prompt: 'Solve x + y = 7 and 2x \u2212 y = 2 by substitution.', hint: 'Isolate y from the first.', answer: 'x = 3, y = 4.', rationale: 'y = 7 \u2212 x gives 2x \u2212 (7 \u2212 x) = 2, so 3x = 9 and x = 3, then y = 4. Both check: 3 + 4 = 7 and 6 \u2212 4 = 2.' },
    { id: 's33a.g3', prompt: 'Why must the isolated expression go into the OTHER equation?', hint: 'What would you learn from the same one?', answer: 'Because substituting into the same equation returns a statement already known.', rationale: 'It yields something like 12 = 12, true but carrying no new information, so no variable is determined.' },
  ],
  independentPractice: [
    { id: 's33a.i1', prompt: 'Solve 2x + y = 11 and x \u2212 2y = \u22127 by substitution.', answer: 'x = 3, y = 5.', rationale: 'y = 11 \u2212 2x gives x \u2212 2(11 \u2212 2x) = \u22127, so 5x = 15 and x = 3, then y = 5. Check: 6 + 5 = 11 and 3 \u2212 10 = \u22127.' },
    { id: 's33a.i2', prompt: 'A student solves a pair and reports "x = 4". What is missing?', answer: 'The value of y.', rationale: 'A solution of a pair is an ordered pair. One coordinate alone does not identify a point, so the system is not yet solved.' },
    { id: 's33a.i3', prompt: 'Why check the ordered pair in the original equations rather than the rearranged ones?', answer: 'Because a rearrangement error would be repeated by the check.', rationale: 'Checking against an expression derived wrongly confirms only that the later arithmetic was consistent, not that the answer is right.' },
    { id: 's33a.i4', prompt: 'Which pair is more convenient for substitution: 3x + 7y = 2 with 5x \u2212 4y = 9, or y = 2x + 1 with 3x + y = 11?', answer: 'The second.', rationale: 'Its first equation already has y isolated, so the substitution can be made immediately with no rearrangement and no fractions.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's33a.td1',
      prompt: 'Why does replacing y by an expression taken from the other equation leave the solution set unchanged?',
      expectedReasoning:
        'Because the expression is equal to y for every ordered pair that satisfies the equation it came from. Substituting equals for equals preserves truth in both directions: any pair satisfying the original system also satisfies the substituted equation, and any pair satisfying the substituted equation together with the isolated expression satisfies both originals. Nothing is added or removed \u2014 the system has only been rewritten so that one equation involves a single variable, which can then be solved.',
    },
    {
      id: 's33a.td2',
      prompt: 'A sign error during isolation produces a complete, ordinary-looking answer. What is it about this error that makes the final check essential rather than optional?',
      expectedReasoning:
        'Every step after the error is performed correctly, so nothing in the working looks wrong and the result has the right shape \u2014 two coordinates, arrived at by valid algebra. The error is upstream of all of it. Checking against the student\u2019s own rearranged expression would agree, because that expression is what carried the error. Only substituting into the two ORIGINAL equations tests the answer against something the error never touched, which is why the check must use those and must use both.',
    },
  ],
  summary:
    `Isolate one variable in one equation, substitute that expression into the OTHER equation, solve the resulting single-variable equation, back-substitute for the second variable, and check the ordered pair in both originals. Replacing a variable by an equal expression preserves the solution set, which is why the method is valid. It is exact, so it handles answers like ${pair(S_FRACTIONAL)} that no graph could give. Sign errors during isolation produce plausible wrong answers, which only the final check catches.`,
  nextStep: 'Next you will combine the two equations instead of substituting one into the other.',
  teacher: teacher(
    'Students solve a pair by substitution and justify why the substitution preserves the solution set.',
    ['Rearranging equations', 'Solving in one variable'],
    ['Into the OTHER equation.', 'You have x \u2014 now find y.', 'Check in the originals, both of them.'],
    [
      'The sign-error example is the centre of the lesson. The answer (15, 14) is reached by faultless arithmetic, so only the original-equation check finds it.',
      'Substituting back into the same equation, producing 12 = 12, is worth demonstrating once. Students who have seen it understand why the other equation carries the information.',
      'Insist on the ordered pair. "x = 4" is a half-answer that marks poorly and reflects a real gap about what solves a pair.',
    ],
    ['Ask what substituting into the same equation gives.', 'Ask which equations the check must use.'],
    ['Have the student box the isolated expression and write which equation it will enter.'],
    ['Ask which of two given pairs is easier to substitute into, and why.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_3_3B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s3_3_elimination_lesson',
  contentArtifactVersion: 1,
  source: source('3.3', 'Algebraic Methods of Solving a Pair of Linear Equations', 30, 'ncert_jemh1_s3_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s3_3'],
    mayAssume: ['Substitution', 'Consistency classification', 'Multiplying an equation by a constant'],
    mustNotIntroduce: [{ concept: 'Cross-multiplication method', belongsToSection: 'not_in_current_scope' }],
  },
  learningGoal:
    'You will solve a pair by elimination, and read what it means when both variables cancel and leave 0 = 0 or 0 = a non-zero number.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Multiply an entire equation by a number.', 'Add or subtract two equations term by term.', 'Classify a pair as consistent or inconsistent.'],
    ifNotReady: 'Revise the consistency lesson. Elimination reports the classification directly, so you need to be able to read what it says.',
  },
  vocabulary: [
    { term: 'elimination', meaning: 'Combining two equations so that one variable cancels, leaving an equation in the other.' },
    { term: 'equivalent equation', meaning: 'An equation with exactly the same solutions \u2014 what multiplying an entire equation by a non-zero number produces.' },
    { term: 'degenerate outcome', meaning: 'A result such as 0 = 0 or 0 = 5, in which both variables have cancelled.' },
  ],
  explanation: [
    'Substitution rewrites one equation and puts it inside the other. Elimination does something different: it combines the two equations so that one variable disappears from the combination.',
    'If the coefficients of x already match, subtracting one equation from the other removes x outright. Usually they do not match, so each equation is first multiplied by a suitable number to make them match.',
    'Multiplying an entire equation by a non-zero number gives an equivalent equation \u2014 the same solutions, written at a different scale. Every term on BOTH sides must be multiplied; scaling only the side you were looking at changes the equation into a different one.',
    'Subtracting is legitimate for the same kind of reason: if two quantities are equal and two others are equal, the differences are equal. So any ordered pair satisfying both originals satisfies the combination.',
    `On 2x + 3y = 12 and x \u2212 y = 1, elimination gives ${pair(S_UNIQUE)} \u2014 the same answer substitution gave, and the same point the graph showed. That agreement is not luck: the two methods are different routes through the same system, so they cannot produce different solution sets.`,
    'Sometimes both variables cancel together, leaving a statement with no variables at all \u2014 a degenerate outcome. This is not a breakdown of the method; it is the method reporting the classification.',
    'If what remains is 0 = 0, the statement is true for every x and y. The two equations said the same thing, so one of them added nothing: the pair is dependent and has infinitely many solutions \u2014 every point on the shared line. It does NOT mean x = 0 and y = 0, and it does not mean the working went wrong.',
    'If what remains is 0 = 5, or any non-zero number, the statement is false for every x and y. No ordered pair can satisfy both equations, so the pair is inconsistent and has no solution. Again this is information, not a miscalculation \u2014 the lines are distinct parallels.',
    'Which method to use is a practical matter, not a ranking. Substitution suits a pair where a variable is already isolated or isolates cleanly. Elimination suits a pair whose coefficients line up easily, or where isolating anything would introduce fractions. Both give the same solution set, so the choice is only about effort.',
  ],
  representations: ['Two equations scaled and combined so one variable cancels'],
  visuals: [G_UNIQUE, G_PARALLEL, G_COINCIDENT],
  visualsById: { G_UNIQUE, G_PARALLEL, G_COINCIDENT },
  workedExamples: [
    {
      id: 's33b.we1',
      prompt: 'Solve 2x + 3y = 12 and x \u2212 y = 1 by elimination, and compare with the substitution answer.',
      steps: [
        { text: 'Multiply the second equation by 2, giving 2x \u2212 2y = 2.', reasoning: 'Every term on both sides is doubled, so the new equation is equivalent and its x coefficient now matches the first equation\u2019s.' },
        { text: 'Subtract it from the first: (2x + 3y) \u2212 (2x \u2212 2y) = 12 \u2212 2.', reasoning: 'Subtracting equals from equals preserves equality, and the x terms cancel because the coefficients were made equal on purpose.' },
        { text: `This gives 5y = 10, so y = ${formatRational(U.y)}.`, reasoning: 'Only one variable remains, so the combination determines it; note that 3y \u2212 (\u22122y) is 5y, not y.' },
        { text: `Back-substituting into x \u2212 y = 1 gives x = ${formatRational(U.x)}.`, reasoning: 'Either original equation may be used; using one and checking in the other verifies the pair at the same time.' },
        { text: `The pair ${pair(S_UNIQUE)} matches what substitution gave and what the graph showed.`, reasoning: 'All three routes describe the same solution set, because the solution belongs to the system rather than to a method.' },
      ],
      answer: `x = ${formatRational(U.x)}, y = ${formatRational(U.y)}.`,
      visualRef: 'G_UNIQUE',
    },
    {
      id: 's33b.we2',
      prompt: 'Apply elimination to 2x + 3y = 12 and 4x + 6y = 24. What happens, and what does it mean?',
      steps: [
        { text: 'Multiply the first by 2, giving 4x + 6y = 24.', reasoning: 'This is done to match the x coefficients, and it happens to reproduce the second equation exactly.' },
        { text: 'Subtracting gives 0 = 0.', reasoning: 'Both variables cancel together, which only happens when the two equations carry the same information.' },
        { text: '0 = 0 is true for every x and y, so no particular pair is identified.', reasoning: 'A statement true of everything distinguishes nothing, which is why no single solution emerges.' },
        { text: 'The pair is dependent: infinitely many solutions, every point on the line 2x + 3y = 12.', reasoning: 'The second equation was the first in disguise, so the system imposes only one condition and the lines are coincident. This is a classification, not a failed calculation.' },
      ],
      answer: '0 = 0 \u2014 infinitely many solutions; the pair is consistent and dependent.',
      visualRef: 'G_COINCIDENT',
    },
    {
      id: 's33b.we3',
      prompt: 'Apply elimination to 2x + 3y = 12 and 4x + 6y = 30.',
      steps: [
        { text: 'Multiply the first by 2, giving 4x + 6y = 24.', reasoning: 'Again this matches the x coefficients so that subtraction will cancel them.' },
        { text: 'Subtracting gives 0 = 24 \u2212 30, that is 0 = \u22126.', reasoning: 'Both variables cancel, but the constants do not, because the second equation is not a multiple of the first.' },
        { text: '0 = \u22126 is false for every x and y.', reasoning: 'No choice of values can make a false numerical statement true, so no ordered pair satisfies both equations.' },
        { text: 'The pair is inconsistent: no solution, and the lines are distinct parallels.', reasoning: 'A contradiction here is a correct report about the system rather than an arithmetic slip to hunt for.' },
      ],
      answer: '0 = \u22126 \u2014 no solution; the pair is inconsistent.',
      visualRef: 'G_PARALLEL',
    },
  ],
  guidedPractice: [
    { id: 's33b.g1', prompt: 'Solve 3x + 2y = 16 and x \u2212 2y = 0 by elimination.', hint: 'The y coefficients are already opposite.', answer: 'x = 4, y = 2.', rationale: 'Adding the equations gives 4x = 16, so x = 4, and then 4 \u2212 2y = 0 gives y = 2. Check: 12 + 4 = 16 and 4 \u2212 4 = 0.' },
    { id: 's33b.g2', prompt: 'Elimination on a pair leaves 0 = 7. What is the solution?', hint: 'Can any values make that true?', answer: 'There is none \u2014 the pair is inconsistent.', rationale: '0 = 7 is false whatever x and y are, so no ordered pair satisfies both equations. The lines are distinct parallels.' },
    { id: 's33b.g3', prompt: 'Elimination leaves 0 = 0. Does that mean x = 0 and y = 0?', hint: 'What does the statement say about x and y?', answer: 'No \u2014 it means infinitely many solutions.', rationale: '0 = 0 mentions neither variable and is true for all values, so it identifies no particular pair. The two equations describe the same line.' },
  ],
  independentPractice: [
    { id: 's33b.i1', prompt: 'Solve 5x + 2y = 16 and 3x \u2212 2y = 0 by elimination.', answer: 'x = 2, y = 3.', rationale: 'Adding gives 8x = 16, so x = 2, and 3(2) \u2212 2y = 0 gives y = 3. Check: 10 + 6 = 16 and 6 \u2212 6 = 0.' },
    { id: 's33b.i2', prompt: 'A student multiplies only the left side of 2x + y = 5 by 3, writing 6x + 3y = 5. What is wrong?', answer: 'The right side was not multiplied; it should be 6x + 3y = 15.', rationale: 'Multiplying only one side produces a different equation with different solutions, so the step is no longer equivalent and the rest of the work is about the wrong system.' },
    { id: 's33b.i3', prompt: 'Why can substitution and elimination never give different solutions for the same pair?', answer: 'Because every step of each preserves the solution set.', rationale: 'Both methods only rewrite the system into equivalent forms, so they are two routes through the same mathematics. A disagreement means one of them contains an arithmetic error.' },
    { id: 's33b.i4', prompt: 'Which method suits 7x \u2212 4y = 15 and 7x + 3y = 29, and why?', answer: 'Elimination.', rationale: 'The x coefficients are already equal, so subtracting immediately removes x. Isolating a variable for substitution would introduce fractions for no gain.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's33b.td1',
      prompt: 'Why is 0 = 0 not a failure of the method, and why does it not identify a single ordered pair?',
      expectedReasoning:
        'It is the method reporting a fact about the system. Both variables cancelled because the two equations were scaled versions of one another, so the second imposed no condition the first had not already imposed. The remaining statement mentions neither x nor y and is true for every value of both, so it cannot single out any pair \u2014 which is correct, because every point on the shared line is a solution. Reading it as x = 0 and y = 0 would be inventing a specific answer where the mathematics says there are infinitely many.',
    },
    {
      id: 's33b.td2',
      prompt: 'Can two different methods give different solutions to the same pair? Say what a disagreement would actually indicate.',
      expectedReasoning:
        'No. Every step of substitution and of elimination turns the system into an equivalent one \u2014 isolating a variable, substituting an equal expression, scaling a whole equation, subtracting equals from equals \u2014 so the set of ordered pairs satisfying the system never changes. The solution belongs to the system, not to the route taken. A disagreement therefore indicates an arithmetic error in one of the two, and the way to settle it is to substitute both candidate pairs into the ORIGINAL equations, since that test depends on neither method.',
    },
  ],
  summary:
    'Scale each equation so one variable\u2019s coefficients match \u2014 every term on both sides \u2014 then add or subtract so that variable cancels, solve for the other, back-substitute and check. When both variables cancel, read the result: 0 = 0 means the equations say the same thing, so there are infinitely many solutions; 0 = a non-zero number is false for every pair, so there is no solution. Neither is a miscalculation. Substitution and elimination always agree, because each only rewrites the system into an equivalent form.',
  nextStep: 'Next you will build a pair of equations from a situation and solve it.',
  teacher: teacher(
    'Students solve by elimination and interpret degenerate outcomes as classifications.',
    ['Substitution', 'Consistency classification'],
    ['Both sides, every term.', 'Both variables gone? Then read what is left.', '0 = 0 is an answer, not an error.'],
    [
      'The two degenerate examples use the same first equation as the unique case, so only the second equation changes. That isolates what produces each outcome.',
      'Students meeting 0 = 0 for the first time usually assume they have gone wrong and start over. Naming it in advance as a possible correct result prevents a lot of wasted work.',
      'The sign when subtracting a negative term \u2014 3y \u2212 (\u22122y) = 5y \u2014 is worth slowing down for; it is the arithmetic slip of this method.',
    ],
    ['Ask what 0 = 7 tells you about the lines.', 'Ask whether 0 = 0 means both variables are zero.'],
    ['Have the student write the scaled equations in full, on separate lines, before subtracting.'],
    ['Ask for a second equation that would make a given pair dependent, and one that would make it inconsistent.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_3_3C: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s3_3_modelling_lesson',
  contentArtifactVersion: 1,
  source: source('3.3', 'Algebraic Methods of Solving a Pair of Linear Equations', 30, 'ncert_jemh1_s3_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s3_3'],
    mayAssume: ['Substitution and elimination', 'Consistency classification'],
    mustNotIntroduce: [{ concept: 'Cross-multiplication method', belongsToSection: 'not_in_current_scope' }],
  },
  learningGoal:
    'You will turn a described situation into a pair of linear equations, solve it, and interpret the answer against the situation it came from.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Solve a pair by substitution or elimination.', 'Define a variable clearly, with its units.', 'Check an ordered pair in both equations.'],
    ifNotReady: 'Revise the two algebraic methods. Modelling adds the step of writing the equations, and assumes you can solve them.',
  },
  vocabulary: [
    { term: 'modelling', meaning: 'Writing a situation as equations that encode the relationships it describes.' },
    { term: 'constraint', meaning: 'One condition the situation imposes, which becomes one equation.' },
    { term: 'interpretation', meaning: 'Saying what the solved numbers mean back in the situation, with their units.' },
  ],
  explanation: [
    'Most pairs of equations in practice are not handed to you \u2014 they are written from a situation. Two unknowns need two independent pieces of information, and each piece becomes one equation.',
    'Start by naming the unknowns precisely, with units. "Let x be the price of an adult ticket in rupees" is a definition you can check your answer against later; "let x be adults" is not, because it does not say whether x counts people or rupees.',
    'Then write each constraint as an equation. If two adult and three child tickets brought in \u20b91600, that is 2x + 3y = 1600. If three adult and two child tickets brought in \u20b91900, that is 3x + 2y = 1900. Each sentence of the situation becomes one equation.',
    `Solve by whichever method suits. Here elimination is tidy, and the answer is x = ${formatRational(T.x)} and y = ${formatRational(T.y)}.`,
    'Then interpret. The answer is not "x = 500"; it is that an adult ticket costs \u20b9500 and a child ticket \u20b9200. The units come from the definitions written at the start, which is what makes those definitions worth writing.',
    'Check against the SITUATION, not only against the equations. Two adult and three child tickets at these prices give 1000 + 600 = 1600, and three and two give 1500 + 400 = 1900. Both match what was described \u2014 and this check would also catch equations that were solved correctly but written wrongly, which solving alone never reveals.',
    'Finally ask whether the answer makes sense in context. Ticket prices cannot be negative, so a negative answer here would mean the model or the arithmetic was wrong. But a negative value is perfectly reasonable in other situations \u2014 a temperature change, a loss, a position below a reference level \u2014 so a value is rejected because of what the quantity means, never because of its sign alone.',
  ],
  representations: ['A situation written as two constraints on the same two unknowns'],
  visuals: [G_TICKETS],
  visualsById: { G_TICKETS },
  workedExamples: [
    {
      id: 's33c.we1',
      prompt: 'Two adult and three child tickets cost \u20b91600 together; three adult and two child cost \u20b91900. Find each price.',
      steps: [
        { text: 'Let x be the price of one adult ticket in rupees and y the price of one child ticket in rupees.', reasoning: 'Naming both unknowns with their units is what lets the final numbers be interpreted, and what makes a later check against the situation possible.' },
        { text: 'The first sale gives 2x + 3y = 1600.', reasoning: 'Two adult tickets cost 2x and three child tickets cost 3y, and together they came to 1600.' },
        { text: 'The second gives 3x + 2y = 1900.', reasoning: 'Each described sale is one constraint, and two constraints on two unknowns is what makes the problem solvable.' },
        { text: `Solving by elimination gives x = ${formatRational(T.x)} and y = ${formatRational(T.y)}.`, reasoning: 'Multiplying the first by 3 and the second by 2 matches the x coefficients at 6x, and subtracting removes x.' },
        { text: 'Check against the situation: 2(500) + 3(200) = 1600, and 3(500) + 2(200) = 1900.', reasoning: 'Both described takings are reproduced exactly, which tests the equations as well as the solving.' },
        { text: 'So an adult ticket costs \u20b9500 and a child ticket \u20b9200.', reasoning: 'The interpretation restores the units from the definitions; a bare pair of numbers would not answer the question asked.' },
      ],
      answer: `Adult \u20b9${formatRational(T.x)}, child \u20b9${formatRational(T.y)}.`,
      visualRef: 'G_TICKETS',
    },
    {
      id: 's33c.we2',
      prompt: 'The sum of two numbers is 20 and their difference is 4. Find them.',
      steps: [
        { text: 'Let x be the larger number and y the smaller.', reasoning: 'Saying which is larger fixes the meaning of the difference, which would otherwise be ambiguous in sign.' },
        { text: 'The constraints are x + y = 20 and x \u2212 y = 4.', reasoning: 'One sentence of the problem becomes each equation, and the two together constrain both unknowns.' },
        { text: 'Adding them gives 2x = 24, so x = 12, and then y = 8.', reasoning: 'The y terms are already opposite, so addition eliminates y without any scaling at all.' },
        { text: 'Check: 12 + 8 = 20 and 12 \u2212 8 = 4, and 12 is indeed the larger.', reasoning: 'Checking the ordering as well as the arithmetic confirms the answer respects how the variables were defined.' },
      ],
      answer: 'The numbers are 12 and 8.',
    },
    {
      id: 's33c.we3',
      prompt: 'A student models the ticket problem as 2x + 3y = 1600 and 2x + 3y = 1900, then finds 0 = \u2212300 and concludes the arithmetic went wrong. What really happened?',
      steps: [
        { text: 'Their two equations are identical on the left but differ on the right.', reasoning: 'They used the first sale\u2019s ticket counts for both sales, so the second constraint was never encoded.' },
        { text: 'Elimination correctly reports 0 = \u2212300, meaning no solution.', reasoning: 'The algebra is faultless: as written, those two equations genuinely contradict each other.' },
        { text: 'So the model is wrong, not the solving.', reasoning: 'A correct solve of incorrectly written equations gives a correct answer to the wrong question, which is why the equations must be checked against the situation.' },
        { text: 'The second sale was three adult and two child, giving 3x + 2y = 1900.', reasoning: 'Rereading the situation sentence by sentence against each equation is what catches a modelling error; no amount of re-solving would.' },
      ],
      answer: 'The second equation did not encode the second sale; it should be 3x + 2y = 1900.',
    },
  ],
  guidedPractice: [
    { id: 's33c.g1', prompt: 'Five pens and three notebooks cost \u20b9145; three pens and five notebooks cost \u20b9151. Write the pair.', hint: 'Define both unknowns with units first.', answer: '5x + 3y = 145 and 3x + 5y = 151, with x the pen price and y the notebook price in rupees.', rationale: 'Each purchase is one constraint, with the counts as coefficients and the total as the constant.' },
    { id: 's33c.g2', prompt: 'Solve that pair.', hint: 'Adding and subtracting the two equations both simplify here.', answer: 'A pen costs \u20b917 and a notebook \u20b920.', rationale: 'Adding gives 8x + 8y = 296, so x + y = 37. Subtracting the first from the second gives \u22122x + 2y = 6, so y \u2212 x = 3. Then y = 20 and x = 17. Check against the situation: 5(17) + 3(20) = 145 and 3(17) + 5(20) = 151.' },
    { id: 's33c.g3', prompt: 'Why check the answer against the situation and not only against the equations?', hint: 'What would a wrongly written equation still do?', answer: 'Because wrongly written equations can be solved correctly.', rationale: 'The solution would satisfy the equations perfectly while answering a different question. Only the situation can test whether the equations encoded it.' },
  ],
  independentPractice: [
    { id: 's33c.i1', prompt: 'The sum of two numbers is 30 and twice the larger exceeds the smaller by 30. Find them.', answer: '20 and 10.', rationale: 'x + y = 30 and 2x \u2212 y = 30. Adding gives 3x = 60, so x = 20 and y = 10. Check: 20 + 10 = 30 and 40 \u2212 10 = 30.' },
    { id: 's33c.i2', prompt: 'Why define variables with their units before writing any equation?', answer: 'Because the units are what make the final numbers interpretable.', rationale: 'Without them a result of 500 could be a price, a count or a distance, and the answer could not be stated in terms of the situation.' },
    { id: 's33c.i3', prompt: 'A model for a length gives x = \u221212. Should it be rejected, and what about a model for a temperature change giving \u221212?', answer: 'Reject the length; accept the temperature change.', rationale: 'A length cannot be negative, but a temperature change can fall. The decision comes from what the quantity means, not from the sign.' },
    { id: 's33c.i4', prompt: 'Elimination on a correctly modelled situation gives 0 = 0. What does that say about the information given?', answer: 'That the two statements said the same thing.', rationale: 'One constraint repeated the other, so the situation does not pin down the unknowns and more information is needed.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's33c.td1',
      prompt: 'Why is a correct solution of incorrectly written equations still a wrong answer, and what check catches it?',
      expectedReasoning:
        'Because the algebra answers whatever question the equations ask, and wrongly written equations ask a different question from the one posed. Every algebraic check will pass, since the solution genuinely satisfies the equations it came from. The only test that catches it is reading the situation back sentence by sentence and confirming that each equation encodes what that sentence said \u2014 or substituting the answer into the described quantities, as in checking that two adult and three child tickets really do come to the stated total.',
    },
    {
      id: 's33c.td2',
      prompt: 'A situation produces a pair with no solution. Give two quite different explanations, and say how you would tell them apart.',
      expectedReasoning:
        'Either the situation is genuinely impossible \u2014 the described facts contradict one another, so no prices or numbers could produce them \u2014 or the modelling was wrong and the equations do not represent the situation. They are distinguished by rereading the situation against each equation. If each sentence is faithfully encoded, the contradiction is real and the described facts cannot all hold; if an equation misreads a sentence, as in using one sale\u2019s counts for both, the inconsistency is an artefact of the model.',
    },
  ],
  summary:
    `Name each unknown with its units, turn each constraint into one equation, solve by whichever method suits, and interpret the numbers back in the situation. Check against the SITUATION, since wrongly written equations can be solved perfectly. For the ticket pair the answer is \u20b9${formatRational(T.x)} and \u20b9${formatRational(T.y)}. Reject a value only when the quantity it represents could not take it \u2014 never because it is negative.`,
  nextStep: 'The rest of the chapter applies these methods to further situations.',
  teacher: teacher(
    'Students model a situation as a pair, solve it, and interpret and check the answer in context.',
    ['Substitution and elimination', 'Defining variables'],
    ['What does x stand for, and in what units?', 'Does each equation match one sentence?', 'Check against the situation, not just the equations.'],
    [
      'The mis-modelled ticket example is the point of the lesson: the algebra is faultless and the answer is still wrong. Students who have seen it check their equations rather than only their arithmetic.',
      'Insist on units in the final sentence. "x = 500" is not an answer to a question about ticket prices.',
      'The negative-value rule is the same one from the quadratics wave: reject by meaning, never by sign.',
    ],
    ['Ask what a correct solve of wrong equations would look like.', 'Ask when a negative answer is acceptable.'],
    ['Have the student write each sentence of the situation beside the equation it became.'],
    ['Ask what it would mean if a well-modelled situation gave 0 = 0.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_LINEAR_SYSTEM_SECTIONS: AuthoredSection[] = [
  C10_SECTION_3_2A, C10_SECTION_3_2B, C10_SECTION_3_3A, C10_SECTION_3_3B, C10_SECTION_3_3C,
];
