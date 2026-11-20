// ===========================================================================
// v0.84.0 checkpoint 34 — CLASS 9 AUTHORING WAVE 1, CHAPTER 13.
//
// Linear equations in two variables. This chapter carries the representation
// transition neither geometry pilot covered: the same relationship as an
// equation, a table of ordered pairs, and a line on a grid. The coordinate
// graphs here are built from the existing geometry figure — axes are
// segments, solutions are points — so no new visual architecture was needed.
//
// Two splits: §13.2 and §13.3 each become two lessons.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const TWO_VARIABLES_CHAPTER_ID = 'ncert_iemh2_ch13';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part II)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh2dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: TWO_VARIABLES_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

const F_SOLUTIONS: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 30, y: 170, label: 'O' },
    { id: 'xr', x: 210, y: 170, label: 'x' },
    { id: 'yt', x: 30, y: 20, label: 'y' },
    { id: 'a', x: 30, y: 110, label: '(0, 4)' },
    { id: 'b', x: 90, y: 130, label: '(2, 3)' },
    { id: 'c', x: 150, y: 150, label: '(4, 2)' },
  ],
  segments: [
    { from: 'o', to: 'xr' },
    { from: 'o', to: 'yt' },
    { from: 'a', to: 'c', mark: 'dashed' },
  ],
  caption: 'Three solutions of x + 2y = 8, and the line through them.',
  altText:
    'Coordinate axes with three plotted points (0,4), (2,3) and (4,2). Each step of 2 to the right drops the point by 1, and a dashed straight line passes through all three, continuing beyond them in both directions.',
};

const F_THREECASES: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 110, y: 110, label: 'meeting point' },
    { id: 'xl', x: 15, y: 110, label: 'x' },
    { id: 'xr', x: 205, y: 110, label: "x'" },
    { id: 'yt', x: 110, y: 15, label: 'y' },
    { id: 'yb', x: 110, y: 205, label: "y'" },
    { id: 'p1', x: 30, y: 60, label: 'A' },
    { id: 'p2', x: 190, y: 160, label: 'B' },
    { id: 'q1', x: 30, y: 160, label: 'C' },
    { id: 'q2', x: 190, y: 60, label: 'D' },
  ],
  segments: [
    { from: 'xl', to: 'xr' },
    { from: 'yt', to: 'yb' },
    { from: 'p1', to: 'p2' },
    { from: 'q1', to: 'q2', mark: 'dashed' },
  ],
  caption: 'Two lines crossing once: the pair has exactly one common solution.',
  altText:
    'Coordinate axes with two straight lines drawn across them. The solid line AB falls from upper left to lower right and the dashed line CD rises from lower left to upper right. They cross at a single marked point, which is the only ordered pair satisfying both equations.',
};

export const SECTION_13_1: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s13_1_lesson',
  contentArtifactVersion: 1,
  source: source('13.1', 'Linear Equations in Two Variables', 1, 'ncert_iemh2_s13_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Linear polynomials from Part I chapter 2', 'Forming an expression from a context', 'Substituting into an expression'],
    mustNotIntroduce: [{ concept: 'Solutions as ordered pairs', belongsToSection: 'ncert_iemh2_s13_2' }, { concept: 'Slope', belongsToSection: 'ncert_iemh2_s13_3' }],
  },
  learningGoal:
    'You will write a linear equation in two variables in the standard form ax + by + c = 0, state the condition on its coefficients, and form one from a situation.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write a linear expression from a worded situation.', 'Identify the coefficient of a variable.', 'Rearrange 2x = 7 − y into the form with everything on one side.'],
    ifNotReady: 'Revisit forming expressions from contexts; translating the situation is most of the work here.',
  },
  vocabulary: [
    { term: 'linear equation in two variables', meaning: 'An equation of the form ax + by + c = 0 where a and b are not both zero.' },
    { term: 'standard form', meaning: 'The arrangement with all terms on one side and zero on the other.' },
    { term: 'coefficient condition', meaning: 'The requirement that a and b are not both zero.' },
  ],
  explanation: [
    'Two pens and three notebooks cost 90 rupees. Call the price of a pen x and of a notebook y, and the sentence becomes 2x + 3y = 90. Two unknowns appear, and one equation connects them.',
    'Written with everything on one side this is 2x + 3y − 90 = 0, which is the standard form ax + by + c = 0. Any linear equation in two variables can be put this way, and doing so makes two equations easy to compare later.',
    'The condition that a and b are not both zero is not a technicality. If both were zero the equation would read c = 0, which says nothing about x or y at all — either always true or never true, but in no case a relationship between two variables.',
    'Just one of them may be zero. The equation y = 5 is linear in two variables with a = 0, and it constrains y while leaving x free. That is still a relationship, and it will appear as a horizontal line later.',
    'What this equation does not do is fix the values. Unlike 2x = 90, which pins x, the equation 2x + 3y = 90 leaves infinitely many possibilities, and sorting out what that means is the next lesson.',
  ],
  representations: ['A worded situation translated phrase by phrase into an equation', 'The same equation rearranged into standard form'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's131.we1',
      prompt: 'Write 3y = 12 − 2x in standard form and name a, b and c.',
      steps: [
        { text: 'Bring every term to the left: 2x + 3y − 12 = 0.', reasoning: 'Standard form requires all terms on one side with zero on the other, so the 12 and the 2x move across with changed signs.' },
        { text: 'Read off a = 2, b = 3, c = −12.', reasoning: 'Each coefficient is taken with the sign it carries in the rearranged equation.' },
        { text: 'Check a and b are not both zero.', reasoning: 'That is the condition for this to be a linear equation in two variables at all.' },
      ],
      answer: 'a = 2, b = 3, c = −12.',
    },
    {
      id: 's131.we2',
      prompt: 'A taxi charges 40 rupees plus 15 per kilometre. Write an equation connecting the fare F and distance d, in standard form.',
      steps: [
        { text: 'The fare is 40 plus 15 per kilometre, so F = 15d + 40.', reasoning: 'Translating the sentence gives the relationship before any rearranging.' },
        { text: 'Move everything to one side: 15d − F + 40 = 0.', reasoning: 'The variable F carries a coefficient of −1 after moving.' },
        { text: 'Here a = 15, b = −1, c = 40.', reasoning: 'A coefficient of −1 is still a valid coefficient, and the condition holds since both are not zero.' },
      ],
      answer: '15d − F + 40 = 0.',
    },
    {
      id: 's131.we3',
      prompt: 'Is 0x + 0y + 7 = 0 a linear equation in two variables?',
      steps: [
        { text: 'Check the condition: both a and b are zero here.', reasoning: 'The definition requires at least one to be non-zero.' },
        { text: 'The equation reduces to 7 = 0, which is false whatever x and y are.', reasoning: 'No pair of values can satisfy it, so it relates nothing.' },
      ],
      answer: 'No. With both coefficients zero it is not a relationship between x and y at all.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's131.g1',
      prompt: 'Write x = 4y in standard form.',
      hint: 'Move everything to one side.',
      answer: 'x − 4y = 0',
      rationale: 'Here a = 1, b = −4 and c = 0; a zero constant is allowed.',
    },
    {
      id: 's131.g2',
      prompt: 'In 5x − 2y + 9 = 0, what is b?',
      hint: 'Read the coefficient of y with its sign.',
      answer: '−2',
      rationale: 'The sign belongs to the coefficient, as it did in Part I chapter 2.',
    },
    {
      id: 's131.g3',
      prompt: 'Why must a and b not both be zero?',
      hint: 'What would the equation say about x and y then?',
      answer: 'Because the equation would say nothing about the variables.',
      rationale: 'With both zero the equation collapses to a statement about c alone.',
    },
  ],
  independentPractice: [
    {
      id: 's131.i1',
      prompt: 'Write 7 − y = 2x in standard form and name a, b, c.',
      answer: '2x + y − 7 = 0; a = 2, b = 1, c = −7.',
      rationale: 'Every term moves to one side with its sign adjusted.',
    },
    {
      id: 's131.i2',
      prompt: 'A shop sells rice at 50 a kilo and dal at 90 a kilo; a bill came to 680. Write the equation.',
      answer: '50r + 90d − 680 = 0.',
      rationale: 'Each quantity is multiplied by its price and the total moved across.',
    },
    {
      id: 's131.i3',
      prompt: 'Is y = 6 a linear equation in two variables? Explain.',
      answer: 'Yes, with a = 0 and b = 1.',
      rationale: 'Only one coefficient may be zero; the equation still constrains y while leaving x free.',
    },
  ],
  reasoningApplication: [
    {
      id: 's131.r1',
      prompt: 'The equation 2x + 3y = 90 and the equation 2x = 90 look similar but behave very differently. Explain the difference in what each one determines.',
      expectedReasoning:
        'The second fixes x to a single value; the first constrains a combination, leaving infinitely many pairs. A strong answer notices that the number of variables, not the look of the equation, decides how much is determined, and anticipates that one equation in two variables cannot pin both.',
    },
  ],
  interactivePractice: [],
  summary:
    'A linear equation in two variables is written ax + by + c = 0 with a and b not both zero. It expresses a relationship between the two variables rather than fixing either, and any such equation can be put in standard form.',
  nextStep:
    'Next you will find the pairs that satisfy such an equation, and discover how many there are.',
  teacher: {
    objective: 'Students write linear equations in two variables in standard form and apply the coefficient condition.',
    prerequisiteKnowledge: ['Forming expressions', 'Rearranging equations'],
    modelLanguage: ['What does each variable stand for?', 'Are a and b both zero?'],
    teachingNotes: [
      'Keep the translation step visible. Students who jump to symbols lose track of which letter means what.',
      'The coefficient condition is worth a worked non-example; otherwise it reads as a formality.',
    ],
    quickChecks: ['What are a, b and c here?', 'Does this count as linear in two variables?'],
    supportForStrugglingLearners: [
      'Write the situation as a sentence, then under each phrase the symbols it becomes.',
      'Underline the two unknowns before writing anything.',
    ],
    extension: ['Ask what y = 6 looks like if you try to list pairs satisfying it.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_13_2_PAIRS: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s13_2_pairs_lesson',
  contentArtifactVersion: 1,
  source: source('13.2', 'Solution of Linear Equation in Two Variables', 4, 'ncert_iemh2_s13_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s13_1'],
    mayAssume: ['Standard form of a linear equation in two variables', 'Substituting values', 'Ordered pairs'],
    mustNotIntroduce: [{ concept: 'The solution set is a line', belongsToSection: 'ncert_iemh2_s13_2' }, { concept: 'Slope', belongsToSection: 'ncert_iemh2_s13_3' }],
  },
  learningGoal:
    'You will define a solution as an ordered pair, generate solutions systematically, and establish that there are infinitely many.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Substitute x = 2 into an equation and solve for y.', 'Write a pair of values as an ordered pair.', 'Say what standard form means.'],
    ifNotReady: 'Practise substituting one value and solving for the other; that is how every solution here is produced.',
  },
  vocabulary: [
    { term: 'solution', meaning: 'An ordered pair of values that makes the equation true.' },
    { term: 'ordered pair', meaning: 'Two values written in a fixed order, (x, y).' },
  ],
  explanation: [
    'An equation in one variable has solutions that are single numbers. An equation in two variables needs a value for each, so a solution is a pair — and the order matters, since (2, 3) and (3, 2) say different things.',
    'Finding solutions is mechanical once you see the method. Take x + 2y = 8, choose any value for x, and the equation becomes an equation in y alone. Choose x = 0 and 2y = 8 gives y = 4, so (0, 4) is a solution. Choose x = 2 and y = 3. Choose x = 4 and y = 2.',
    'The choice of x was free every time, and nothing stops you choosing fractions or negatives: x = 1 gives y = 3.5, and x = −2 gives y = 5. Since the choices never run out, neither do the solutions. A linear equation in two variables has infinitely many.',
    'That is the real difference from one variable. One equation is one condition, and two unknowns need two conditions to be pinned down. With only one, a whole family of pairs survives.',
    'Checking a claimed solution is the reverse: substitute both values and see whether the equation holds. For (3, 2) in x + 2y = 8, the left is 3 + 4 = 7, not 8, so it is not a solution — and being close is not being on it.',
  ],
  representations: ['A table of chosen x values against the y each forces', 'Ordered pairs written with the order made explicit'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's132a.we1',
      prompt: 'Find three solutions of 2x + y = 10.',
      steps: [
        { text: 'Choose x = 0; then y = 10.', reasoning: 'Substituting a chosen value turns the two-variable equation into one in y alone.' },
        { text: 'Choose x = 1; then 2 + y = 10, so y = 8.', reasoning: 'Any value of x is allowed, so the simplest ones are chosen first.' },
        { text: 'Choose x = 3; then 6 + y = 10, so y = 4.', reasoning: 'Each choice produces exactly one matching value.' },
      ],
      answer: '(0, 10), (1, 8) and (3, 4) are three of infinitely many solutions.',
    },
    {
      id: 's132a.we2',
      prompt: 'Is (5, −1) a solution of 3x + 2y = 13?',
      steps: [
        { text: 'Substitute x = 5 and y = −1: 15 + (−2).', reasoning: 'Checking means putting both values in, not just one.' },
        { text: 'The left side is 13, which equals the right.', reasoning: 'The equation holds, so the pair satisfies it.' },
      ],
      answer: 'Yes, (5, −1) is a solution.',
    },
    {
      id: 's132a.we3',
      prompt: 'Why does one equation in two variables have infinitely many solutions?',
      steps: [
        { text: 'Choosing a value for x leaves an equation in y alone, which has one answer.', reasoning: 'So each choice of x produces exactly one solution pair.' },
        { text: 'There are infinitely many values available for x.', reasoning: 'Nothing in the equation restricts which value may be chosen.' },
        { text: 'So there are infinitely many pairs.', reasoning: 'One condition cannot pin down two unknowns.' },
      ],
      answer: 'Because each of infinitely many choices of x gives a matching y.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's132a.g1',
      prompt: 'Find a solution of x + y = 7 with x = 0.',
      hint: 'Substitute and solve for y.',
      answer: '(0, 7)',
      rationale: 'With x = 0 the equation becomes y = 7.',
    },
    {
      id: 's132a.g2',
      prompt: 'Is (2, 2) a solution of 4x − y = 6?',
      hint: 'Substitute both values and compare sides.',
      answer: 'Yes',
      rationale: '8 − 2 = 6, which matches the right side.',
    },
    {
      id: 's132a.g3',
      prompt: 'Why is (3, 1) different from (1, 3)?',
      hint: 'Which value is x in each?',
      answer: 'Because the order names which variable each value belongs to.',
      rationale: 'An ordered pair is read x first, so swapping gives a different pair and usually a different claim.',
    },
  ],
  independentPractice: [
    {
      id: 's132a.i1',
      prompt: 'Find four solutions of x − y = 2.',
      answer: '(2,0), (3,1), (0,−2), (5,3).',
      rationale: 'Each choice of x determines one y.',
    },
    {
      id: 's132a.i2',
      prompt: 'Check whether (−1, 4) satisfies 2x + 3y = 10.',
      answer: 'Yes: −2 + 12 = 10.',
      rationale: 'Substituting both values confirms it.',
    },
    {
      id: 's132a.i3',
      prompt: 'Explain why a solution must be a pair rather than a single number.',
      answer: 'Because the equation involves two variables, each needing a value.',
      rationale: 'A single number cannot make a two-variable equation true or false.',
    },
  ],
  reasoningApplication: [
    {
      id: 's132a.r1',
      prompt: 'One equation in two variables leaves infinitely many solutions. Predict what would happen with two equations, and explain your reasoning before you meet the answer.',
      expectedReasoning:
        'Each equation is one condition, so two conditions might pin both unknowns to a single pair. A strong answer hedges correctly — it might, but two conditions could also repeat each other or contradict — and sees that the count of solutions depends on how the two relate, not merely on how many there are.',
    },
  ],
  interactivePractice: [],
  summary:
    'A solution of a linear equation in two variables is an ordered pair that satisfies it. Choosing any value for one variable forces the other, so there are infinitely many solutions — one condition cannot determine two unknowns.',
  nextStep:
    'Next you will plot those solutions and find that they are not scattered at all.',
  teacher: {
    objective: 'Students generate and verify solutions of a two-variable equation and justify why there are infinitely many.',
    prerequisiteKnowledge: ['Substitution', 'Ordered pairs'],
    modelLanguage: ['Which value did you choose, and what did it force?', 'Have you substituted both values?'],
    teachingNotes: [
      'Students check only one coordinate. Require both substitutions in writing.',
      'The infinitude argument is short and should be said by students, not read to them: each choice gives one pair, and choices never run out.',
    ],
    quickChecks: ['Is this pair a solution?', 'Why infinitely many?'],
    supportForStrugglingLearners: [
      'Give the x values and ask only for the matching y at first.',
      'Write the pair with labels, x = and y =, before compressing to (x, y).',
    ],
    extension: ['Ask for a solution with a negative y, and whether one always exists.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_13_2_LINE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s13_2_line_lesson',
  contentArtifactVersion: 1,
  source: source('13.2', 'Solution of Linear Equation in Two Variables', 4, 'ncert_iemh2_s13_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s13_2'],
    mayAssume: ['Generating solutions as ordered pairs', 'Plotting points from Part I chapter 1', 'Linear patterns'],
    mustNotIntroduce: [{ concept: 'Slope', belongsToSection: 'ncert_iemh2_s13_3' }, { concept: 'A pair of linear equations', belongsToSection: 'ncert_iemh2_s13_4' }],
  },
  learningGoal:
    'You will plot the solutions of a linear equation and establish that they all lie on one straight line, which represents the equation.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Plot an ordered pair on a coordinate grid.', 'Generate three solutions of a two-variable equation.', 'Say what the graph of a rule showed in Part I chapter 2.'],
    ifNotReady: 'Make sure plotting is accurate; the conclusion here depends on the points really aligning.',
  },
  vocabulary: [
    { term: 'graph of an equation', meaning: 'The set of points whose coordinates satisfy the equation.' },
    { term: 'collinear', meaning: 'Lying on one straight line.' },
  ],
  explanation: [
    'The solutions of x + 2y = 8 are pairs, and pairs can be plotted. Mark (0,4), (2,3) and (4,2) on a grid and they line up. Add (6,1) and (−2,5) and they join the same line.',
    'This is not luck. Increase x by 2 and the term 2y must fall by 2, so y falls by 1 — every time, because the coefficients do not change. Equal steps across giving equal steps down is exactly what makes a line straight.',
    'So the line is the picture of the equation. Every solution is a point on it, and every point on it is a solution: the two descriptions pick out the same set. That two-way statement is what lets you answer algebraic questions by looking.',
    'Be careful how you say it. The line is not the equation; it is a representation of the same relationship. The equation, the table of solutions and the line are three views of one thing, and which to use depends on the question.',
    'Two plotted solutions are enough to draw the line, since the points are known to be collinear. Plot a third as a check — if it misses, a substitution went wrong, and you would rather know before drawing.',
  ],
  representations: ['Three solutions plotted and the line through them', 'The same relationship as equation, table and line side by side'],
  visuals: [F_SOLUTIONS],
  visualsById: { F_SOLUTIONS },
  workedExamples: [
    {
      id: 's132b.we1',
      prompt: 'Draw the graph of 2x + y = 6.',
      steps: [
        { text: 'Find three solutions: (0,6), (1,4), (3,0).', reasoning: 'Each is produced by choosing x and solving for y.' },
        { text: 'Plot them on labelled axes with a scale covering 0 to 6 in both directions.', reasoning: 'The scale must fit the values, as in Part I chapter 2.' },
        { text: 'Check they are collinear, then draw the line through them.', reasoning: 'Alignment is the thing being verified, so it is looked for rather than assumed.' },
        { text: 'Extend the line beyond the plotted points.', reasoning: 'Solutions continue in both directions, including negative and fractional ones.' },
      ],
      answer: 'A straight line crossing the y-axis at 6 and the x-axis at 3.',
      visualRef: 'F_SOLUTIONS',
    },
    {
      id: 's132b.we2',
      prompt: 'Is the point (5, −4) on the graph of 2x + y = 6?',
      steps: [
        { text: 'Substitute: 2 times 5 plus (−4) is 6.', reasoning: 'Membership of the graph is decided by the equation, not by whether the point looks close.' },
        { text: 'The equation holds, so the pair is a solution.', reasoning: 'Every solution is on the line and every point on the line is a solution.' },
      ],
      answer: 'Yes. It lies on the line, further along than the plotted points.',
    },
    {
      id: 's132b.we3',
      prompt: 'Why must the solutions be collinear rather than scattered?',
      steps: [
        { text: 'Take any step in x; the equation forces a matching change in y.', reasoning: 'The coefficients are fixed, so the same step in x always forces the same change in y.' },
        { text: 'Equal horizontal steps therefore give equal vertical steps.', reasoning: 'That is precisely the property that defines a straight line.' },
        { text: 'So no solution can sit off the line.', reasoning: 'A point off the line would need a different ratio of change, which the equation forbids.' },
      ],
      answer: 'Because the fixed coefficients force the same vertical change for the same horizontal step.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's132b.g1',
      prompt: 'Where does the graph of x + y = 5 cross the y-axis?',
      hint: 'What is x there?',
      answer: 'At (0, 5)',
      rationale: 'The y-axis is where x = 0, and the equation then gives y = 5.',
    },
    {
      id: 's132b.g2',
      prompt: 'Two plotted solutions determine the line. Why plot a third?',
      hint: 'What would a third point reveal?',
      answer: 'To catch a substitution error.',
      rationale: 'Two points always lie on some line, so they cannot disagree; a third can.',
    },
    {
      id: 's132b.g3',
      prompt: 'Is the line the same thing as the equation?',
      hint: 'Can you compute with a line, or read a pair off an equation?',
      answer: 'No — it represents the same relationship.',
      rationale: 'The equation, the table and the line are three views of one relationship.',
    },
  ],
  independentPractice: [
    {
      id: 's132b.i1',
      prompt: 'Draw the graph of x − y = 3 using three solutions.',
      answer: 'A line through (3,0), (4,1) and (0,−3).',
      rationale: 'Each solution comes from choosing x and solving for y.',
    },
    {
      id: 's132b.i2',
      prompt: 'Decide whether (7, 2) is on the graph of x + 2y = 11.',
      answer: 'Yes: 7 + 4 = 11.',
      rationale: 'Substituting both values settles it.',
    },
    {
      id: 's132b.i3',
      prompt: 'Explain in one sentence why every point on the line is a solution.',
      answer: 'Because the line is drawn as exactly the set of points whose coordinates satisfy the equation.',
      rationale: 'The correspondence runs both ways.',
    },
  ],
  reasoningApplication: [
    {
      id: 's132b.r1',
      prompt: 'The same relationship can be written as an equation, listed as a table or drawn as a line. For each, name a question it answers more easily than the others.',
      expectedReasoning:
        'The equation answers whether a given pair works, by substitution; the table gives particular values quickly; the line shows the overall behaviour and makes intersections visible. A strong answer resists ranking them and ties each to the kind of question it suits.',
    },
  ],
  interactivePractice: [],
  summary:
    'The solutions of a linear equation in two variables are collinear, because fixed coefficients force the same vertical change for each horizontal step. The line is a representation of the relationship, not a different object from the equation.',
  nextStep:
    'Next you will measure how steeply such a line rises, and give that measurement a name.',
  teacher: {
    objective: 'Students graph a two-variable equation and justify the collinearity of its solutions.',
    prerequisiteKnowledge: ['Plotting points', 'Generating solutions'],
    modelLanguage: ['Does this point satisfy the equation?', 'Why must these be collinear?'],
    teachingNotes: [
      'The two-way statement — every solution a point, every point a solution — is what makes the graph usable later. Say it in both directions.',
      'Guard against the line becoming the mathematics in students minds. Ask regularly which representation they are reasoning from.',
    ],
    quickChecks: ['On the line or not?', 'Which representation would you use here?'],
    supportForStrugglingLearners: [
      'Give the three solutions and ask only for plotting at first.',
      'Draw the table beside the grid so each row can be pointed at on the graph.',
    ],
    extension: ['Ask what happens to the line if the constant term changes but the coefficients do not.'],
    materialsNeeded: ['Squared paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_13_3_SLOPE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s13_3_slope_lesson',
  contentArtifactVersion: 1,
  source: source('13.3', 'Slope-intercept form of a Linear Equation', 10, 'ncert_iemh2_s13_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s13_2'],
    mayAssume: ['The solution set as a line', 'Reading coordinates from a graph', 'What a controlled in Part I chapter 2'],
    mustNotIntroduce: [{ concept: 'Slope-intercept form', belongsToSection: 'ncert_iemh2_s13_3' }, { concept: 'A pair of linear equations', belongsToSection: 'ncert_iemh2_s13_4' }],
  },
  learningGoal:
    'You will define slope as rise over run and establish that it is the same whichever two points of the line you use.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Read the coordinates of two points on a line.', 'Subtract coordinates, including negatives.', 'Say which constant made a line steeper in Part I chapter 2.'],
    ifNotReady: 'Revisit reading coordinates accurately; slope is computed from two pairs of them.',
  },
  vocabulary: [
    { term: 'rise', meaning: 'The change in y between two points.' },
    { term: 'run', meaning: 'The change in x between the same two points.' },
    { term: 'slope', meaning: 'Rise divided by run, a measure of steepness that also carries direction.' },
  ],
  explanation: [
    'Part I chapter 2 found that the constant a made a line steeper without measuring steepness. Now it gets measured. Take two points on a line, find how much y changes and how much x changes between them, and divide: slope is rise over run.',
    'For the line through (1,3) and (4,9), the rise is 9 − 3 = 6 and the run is 4 − 1 = 3, so the slope is 2. Take a different pair on the same line, say (2,5) and (6,13): the rise is 8 and the run is 4, and the slope is 2 again.',
    'That is not a coincidence and it matters. If different pairs gave different answers, slope would describe the pair rather than the line and would be useless. The points come out the same because the line is straight: equal runs always give equal rises, which is what straightness means.',
    'Sign carries meaning. A positive slope rises left to right, a negative slope falls, and a slope of zero means y never changes — a horizontal line. Computing the rise in the wrong order gives the wrong sign, so subtract both coordinates in the same order.',
    'One case has no slope at all. A vertical line has run zero, and dividing by zero gives nothing, so its slope is undefined rather than large. That is a genuine gap in the definition, not an awkward value.',
  ],
  representations: ['Two points on a line with the rise and run marked as steps', 'The same line with a second pair of points giving the same ratio'],
  visuals: [F_SOLUTIONS],
  visualsById: { F_SOLUTIONS },
  workedExamples: [
    {
      id: 's133a.we1',
      prompt: 'Find the slope of the line through (2, 1) and (6, 9).',
      steps: [
        { text: 'Rise: 9 − 1 = 8.', reasoning: 'Subtracting the y values in a chosen order gives the vertical change.' },
        { text: 'Run: 6 − 2 = 4, taken in the same order.', reasoning: 'Both differences must follow the same order or the sign will be wrong.' },
        { text: 'Slope is 8 divided by 4.', reasoning: 'Rise over run is the definition, and the division is what makes it a rate.' },
      ],
      answer: 'Slope 2: the line rises 2 units for each unit across.',
      visualRef: 'F_SOLUTIONS',
    },
    {
      id: 's133a.we2',
      prompt: 'Find the slope through (0, 5) and (4, 1), and say what the sign means.',
      steps: [
        { text: 'Rise: 1 − 5 = −4.', reasoning: 'The y value falls, so the rise is negative.' },
        { text: 'Run: 4 − 0 = 4.', reasoning: 'Taken in the same order as the rise.' },
        { text: 'Slope is −4 over 4, which is −1.', reasoning: 'A negative slope means the line falls as you move right.' },
      ],
      answer: 'Slope −1; the line falls one unit for each unit across.',
    },
    {
      id: 's133a.we3',
      prompt: 'Show that the slope of the line through (1,2), (3,6) and (5,10) is the same for any two of them.',
      steps: [
        { text: 'Using the first two: rise 4, run 2, slope 2.', reasoning: 'A first pair gives a candidate value.' },
        { text: 'Using the last two: rise 4, run 2, slope 2.', reasoning: 'A second, disjoint pair gives the same value.' },
        { text: 'Using the first and last: rise 8, run 4, slope 2.', reasoning: 'A pair spanning a longer stretch agrees too.' },
        { text: 'All three agree because equal runs give equal rises on a straight line.', reasoning: 'That property is what makes slope a feature of the line rather than of the pair chosen.' },
      ],
      answer: 'Slope 2 in every case, which is why slope describes the line.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's133a.g1',
      prompt: 'Find the slope through (0,0) and (3,12).',
      hint: 'Rise over run.',
      answer: '4',
      rationale: 'Twelve divided by three; the line rises steeply.',
    },
    {
      id: 's133a.g2',
      prompt: 'What is the slope of a horizontal line?',
      hint: 'Does y change at all?',
      answer: 'Zero',
      rationale: 'The rise is zero for any run, so the quotient is zero.',
    },
    {
      id: 's133a.g3',
      prompt: 'Why is the slope of a vertical line undefined rather than infinite?',
      hint: 'What is the run, and what does dividing by it mean?',
      answer: 'Because the run is zero and division by zero has no value.',
      rationale: 'Undefined means the definition does not apply, not that the answer is very large.',
    },
  ],
  independentPractice: [
    {
      id: 's133a.i1',
      prompt: 'Find the slope through (−2, 3) and (2, −5).',
      answer: '−2.',
      rationale: 'Rise −8 over run 4, with both differences taken in the same order.',
    },
    {
      id: 's133a.i2',
      prompt: 'A line through (1,4) has slope 3. Find another point on it.',
      answer: '(2,7), among infinitely many.',
      rationale: 'Moving one across raises y by the slope.',
    },
    {
      id: 's133a.i3',
      prompt: 'Explain why slope must be the same for every pair of points on one line.',
      answer: 'Because equal runs give equal rises on a straight line.',
      rationale: 'If it differed, slope would describe the chosen pair rather than the line.',
    },
  ],
  reasoningApplication: [
    {
      id: 's133a.r1',
      prompt: 'Slope is defined using two points, yet it is a property of the line. Explain how a definition that mentions two points can describe something they do not depend on.',
      expectedReasoning:
        'The straightness of the line guarantees the ratio is the same for every pair, so the definition picks out a value the choice cannot affect. A strong answer notes that on a curve the same recipe would give different answers, which is exactly why slope belongs to lines.',
    },
  ],
  interactivePractice: [],
  summary:
    'Slope is rise over run, and on a straight line every pair of points gives the same value, which is why it describes the line. Its sign gives direction, zero means horizontal, and a vertical line has no slope.',
  nextStep:
    'Next you will build slope into the equation itself and read both constants from it.',
  teacher: {
    objective: 'Students compute slope and justify its independence of the chosen points.',
    prerequisiteKnowledge: ['Reading coordinates', 'Subtracting negatives'],
    modelLanguage: ['In which order did you subtract?', 'Would another pair give the same answer?'],
    teachingNotes: [
      'The order-of-subtraction error produces a sign flip that students rarely notice. Require both differences written before dividing.',
      'Have every student verify with a second pair at least once. The invariance is the conceptual content, not the arithmetic.',
    ],
    quickChecks: ['Rise and run here?', 'Why is vertical undefined?'],
    supportForStrugglingLearners: [
      'Draw the rise and run as two arrows on the grid before computing.',
      'Use lines through lattice points only at first.',
    ],
    extension: ['Ask what slope would mean for a curve, and why the definition fails there.'],
    materialsNeeded: ['Squared paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_13_3_FORM: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s13_3_form_lesson',
  contentArtifactVersion: 1,
  source: source('13.3', 'Slope-intercept form of a Linear Equation', 10, 'ncert_iemh2_s13_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s13_3'],
    mayAssume: ['Slope as rise over run', 'Standard form of a linear equation', 'The effect of a and b in Part I chapter 2'],
    mustNotIntroduce: [{ concept: 'A pair of linear equations', belongsToSection: 'ncert_iemh2_s13_4' }],
  },
  learningGoal:
    'You will derive the form y = mx + c, explain why m is the slope and c the y-intercept, and handle horizontal lines and zero slope.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute the slope through two points.', 'Rearrange 2x + y = 7 to make y the subject.', 'Say where a line crosses the y-axis.'],
    ifNotReady: 'Make sure you can make y the subject of an equation; the derivation is that rearrangement plus one observation.',
  },
  vocabulary: [
    { term: 'slope-intercept form', meaning: 'The arrangement y = mx + c, in which m is the slope and c the y-intercept.' },
    { term: 'y-intercept', meaning: 'The y value where the line crosses the y-axis.' },
  ],
  explanation: [
    'Rearranging 2x + y = 7 to y = −2x + 7 does not change which pairs satisfy it, but it does make two things readable. Compare it with y = mx + c and you have m = −2 and c = 7.',
    'Why is m the slope? Take any x and then x + 1. The first gives y = mx + c and the second gives m(x+1) + c, which is mx + m + c. The difference is exactly m. One step across raises y by m, which is rise over run with run 1 — the definition of slope.',
    'Why is c the y-intercept? Put x = 0 and the mx term vanishes, leaving y = c. The point (0, c) is where the line meets the y-axis.',
    'The form explains Part I chapter 2 as well. There a controlled steepness and b controlled the crossing point, observed by comparing pictures. The same roles now follow from the algebra, which is the difference between noticing a pattern and knowing why it holds.',
    'Two cases are worth naming. With m = 0 the form reads y = c: y never changes, so the line is horizontal. A vertical line cannot be written this way at all, because it has no slope — it is written x = k instead, which this form cannot express.',
  ],
  representations: ['The same equation in standard form and in slope-intercept form, side by side', 'A one-step increase in x with the matching rise of m marked'],
  visuals: [F_SOLUTIONS],
  visualsById: { F_SOLUTIONS },
  workedExamples: [
    {
      id: 's133b.we1',
      prompt: 'Write 3x + y = 12 in slope-intercept form and state the slope and intercept.',
      steps: [
        { text: 'Make y the subject: y = −3x + 12.', reasoning: 'Rearranging does not change the solutions, only how readable the constants are.' },
        { text: 'Compare with y = mx + c to read m = −3.', reasoning: 'The coefficient of x in this arrangement is the slope, and it carries its sign.' },
        { text: 'The constant 12 is c.', reasoning: 'Substituting x = 0 gives y = 12, so the line crosses the y-axis there.' },
      ],
      answer: 'Slope −3, y-intercept 12.',
    },
    {
      id: 's133b.we2',
      prompt: 'A line has slope 4 and passes through (0, −2). Write its equation.',
      steps: [
        { text: 'The point has x = 0, so its y value is the intercept: c = −2.', reasoning: 'The y-intercept is by definition the y value where x is zero.' },
        { text: 'The slope is given as m = 4.', reasoning: 'Both constants of the form are now known.' },
        { text: 'So y = 4x − 2.', reasoning: 'Substituting the two constants into the general form completes it.' },
      ],
      answer: 'y = 4x − 2.',
    },
    {
      id: 's133b.we3',
      prompt: 'Why does increasing x by 1 raise y by exactly m?',
      steps: [
        { text: 'At x the value is mx + c; at x + 1 it is m(x + 1) + c.', reasoning: 'Substituting both inputs into the same rule allows them to be compared.' },
        { text: 'Expanding gives mx + m + c.', reasoning: 'The distributive property separates the extra m from the rest.' },
        { text: 'Subtracting the first from the second leaves m.', reasoning: 'Every other term cancels, so the change is m regardless of which x was chosen.' },
      ],
      answer: 'Because all other terms cancel, leaving exactly m — which is rise over a run of 1.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's133b.g1',
      prompt: 'Write x + y = 9 in slope-intercept form.',
      hint: 'Make y the subject.',
      answer: 'y = −x + 9',
      rationale: 'The slope is −1 and the intercept 9.',
    },
    {
      id: 's133b.g2',
      prompt: 'What is the slope of y = 7?',
      hint: 'Does y change as x changes?',
      answer: 'Zero',
      rationale: 'With m = 0 the value of y never changes, so the line is horizontal.',
    },
    {
      id: 's133b.g3',
      prompt: 'Why can a vertical line not be written as y = mx + c?',
      hint: 'What is its slope?',
      answer: 'Because it has no slope.',
      rationale: 'Its run is zero, so no value of m describes it; it is written x = k instead.',
    },
  ],
  independentPractice: [
    {
      id: 's133b.i1',
      prompt: 'Write 5x − 2y = 8 in slope-intercept form.',
      answer: 'y = 2.5x − 4.',
      rationale: 'Make y the subject, dividing every term by −2 carefully.',
    },
    {
      id: 's133b.i2',
      prompt: 'A line has slope −3 and y-intercept 5. Write its equation and find y at x = 2.',
      answer: 'y = −3x + 5; y = −1.',
      rationale: 'Substituting the constants then the value.',
    },
    {
      id: 's133b.i3',
      prompt: 'Explain why c is read off at x = 0.',
      answer: 'Because the mx term vanishes there, leaving y = c.',
      rationale: 'The intercept is the value of the rule at zero.',
    },
  ],
  reasoningApplication: [
    {
      id: 's133b.r1',
      prompt: 'Part I chapter 2 observed what a and b did to a graph; this lesson derives it. Explain what the derivation adds that the observation did not.',
      expectedReasoning:
        'The observation showed that it happens; the derivation shows why, and shows it for every line rather than the ones drawn. A strong answer notes that the derivation also predicts the limiting cases — m = 0 and the vertical line — which no amount of comparing pictures would settle.',
    },
  ],
  interactivePractice: [],
  summary:
    'Rearranging to y = mx + c makes both constants readable: m is the slope, because a one-step increase in x raises y by m, and c is the y-intercept, because x = 0 leaves y = c. A vertical line has no such form.',
  nextStep:
    'Next you will work with two equations at once, where the two lines may meet, coincide or never meet.',
  teacher: {
    objective: 'Students derive and use the slope-intercept form and handle its limiting cases.',
    prerequisiteKnowledge: ['Rearranging equations', 'Slope'],
    modelLanguage: ['What is the coefficient of x once y is the subject?', 'What happens at x = 0?'],
    teachingNotes: [
      'Derive the two claims rather than asserting them; the one-step argument is short and makes m meaningful.',
      'The vertical-line exception should be stated here, not discovered later. Students otherwise believe every line has this form.',
    ],
    quickChecks: ['Slope and intercept here?', 'Can this line be written as y = mx + c?'],
    supportForStrugglingLearners: [
      'Rearrange in two visible steps before reading anything off.',
      'Keep the standard and slope-intercept forms side by side for the same equation.',
    ],
    extension: ['Ask for the equation of a line parallel to a given one through a given point.'],
    materialsNeeded: ['Squared paper'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_13_4: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s13_4_lesson',
  contentArtifactVersion: 1,
  source: source('13.4', 'Pair of Linear Equations in Two Variables', 19, 'ncert_iemh2_s13_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s13_3'],
    mayAssume: ['Linear equations in two variables and their solutions', 'Forming an equation from a context', 'Standard form'],
    mustNotIntroduce: [{ concept: 'Solving by substitution', belongsToSection: 'ncert_iemh2_s13_5' }, { concept: 'The graphical method', belongsToSection: 'ncert_iemh2_s13_6' }],
  },
  learningGoal:
    'You will set up a pair of linear equations from a situation with two conditions, and understand what it means for a pair to be satisfied together.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write a linear equation in two variables from a sentence.', 'Check whether a pair satisfies one equation.', 'Write an equation in standard form.'],
    ifNotReady: 'Practise forming a single equation from a context; a pair is two of those, from two different conditions.',
  },
  vocabulary: [
    { term: 'pair of linear equations', meaning: 'Two linear equations in the same two variables, considered together.' },
    { term: 'simultaneous', meaning: 'Satisfied at the same time by the same pair of values.' },
    { term: 'common solution', meaning: 'An ordered pair satisfying both equations.' },
  ],
  explanation: [
    'Two parathas and one dahi cost 70 rupees; one paratha and two dahi cost 65. Each sentence gives an equation: 2p + d = 70 and p + 2d = 65. Together they are a pair of linear equations in two variables.',
    'One equation left infinitely many possibilities. The second is a further condition, and only pairs satisfying both count. That is what simultaneous means: the same values of p and d must work in both equations at once.',
    'Checking a candidate is straightforward and worth doing carefully. The pair (25, 20) gives 50 + 20 = 70 in the first and 25 + 40 = 65 in the second, so it satisfies both. A pair satisfying only one is not a solution of the pair, however close it looks.',
    'In general a pair is written a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0, each with its own coefficients and each needing its own non-zero condition. The subscripts are bookkeeping; they let you talk about the relationship between the two equations rather than about one at a time.',
    'The natural question is how many common solutions a pair can have. Setting up carefully comes first, and the methods for finding the answer come next.',
  ],
  representations: ['Two conditions from a situation translated into two equations', 'A candidate pair checked against both equations'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's134.we1',
      prompt: 'Three pens and two books cost 180; one pen and four books cost 210. Write the pair.',
      steps: [
        { text: 'Let p be the price of a pen and b of a book.', reasoning: 'Naming the unknowns before writing anything keeps the two equations consistent.' },
        { text: 'The first condition gives 3p + 2b = 180.', reasoning: 'Each quantity is multiplied by its price and the total is the right side.' },
        { text: 'The second gives p + 4b = 210.', reasoning: 'The same two unknowns appear, which is what makes this a pair rather than two unrelated equations.' },
      ],
      answer: '3p + 2b = 180 and p + 4b = 210.',
    },
    {
      id: 's134.we2',
      prompt: 'Is (4, 3) a solution of the pair x + y = 7 and 2x − y = 5?',
      steps: [
        { text: 'Check the first: 4 + 3 = 7, which holds.', reasoning: 'Satisfying one equation is necessary but not sufficient.' },
        { text: 'Check the second: 8 − 3 = 5, which also holds.', reasoning: 'Both must hold for the pair to be solved.' },
      ],
      answer: 'Yes. It satisfies both, so it is a solution of the pair.',
    },
    {
      id: 's134.we3',
      prompt: 'Is (5, 2) a solution of the pair x + y = 7 and 2x − y = 5?',
      steps: [
        { text: 'Check the first: 5 + 2 = 7, which holds.', reasoning: 'It satisfies this equation, so it is a solution of that one alone.' },
        { text: 'Check the second: 10 − 2 = 8, not 5.', reasoning: 'One failure is enough; the pair requires both.' },
      ],
      answer: 'No. Satisfying one equation is not enough.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's134.g1',
      prompt: 'A pair has equations x + y = 10 and x − y = 2. Does (6, 4) solve it?',
      hint: 'Check both equations.',
      answer: 'Yes',
      rationale: '10 = 10 and 2 = 2, so both hold.',
    },
    {
      id: 's134.g2',
      prompt: 'Why does a second equation change the situation so much?',
      hint: 'How many conditions are there now?',
      answer: 'Because it adds a second condition on the same two unknowns.',
      rationale: 'One condition left infinitely many pairs; two may narrow them to one.',
    },
    {
      id: 's134.g3',
      prompt: 'Write the general pair with subscripted coefficients.',
      hint: 'Each equation needs its own a, b and c.',
      answer: 'a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0',
      rationale: 'Subscripts distinguish the coefficients of the two equations so they can be compared.',
    },
  ],
  independentPractice: [
    {
      id: 's134.i1',
      prompt: 'A ticket for an adult is x and for a child y. Two adults and three children pay 550; one adult and five children pay 625. Write the pair.',
      answer: '2x + 3y = 550 and x + 5y = 625.',
      rationale: 'Each sentence becomes one equation in the same two unknowns.',
    },
    {
      id: 's134.i2',
      prompt: 'Check whether (2, 5) solves the pair 3x + y = 11 and x − y = −3.',
      answer: 'Yes: 11 = 11 and −3 = −3.',
      rationale: 'Both equations hold for the same pair.',
    },
    {
      id: 's134.i3',
      prompt: 'Explain why a pair satisfying only the first equation is not a solution of the pair.',
      answer: 'Because both conditions must hold at once.',
      rationale: 'Simultaneous means the same values work in both.',
    },
  ],
  reasoningApplication: [
    {
      id: 's134.r1',
      prompt: 'One equation in two variables has infinitely many solutions. Reason about how many a pair could have, listing the possibilities you can imagine and what each would mean.',
      expectedReasoning:
        'Three possibilities are reasonable: exactly one, if the two conditions pin the pair down; infinitely many, if the second repeats the first; or none, if they contradict. A strong answer reaches all three before being shown, and connects each to how the two equations relate rather than to how they look.',
    },
  ],
  interactivePractice: [],
  summary:
    'A pair of linear equations imposes two conditions on the same two unknowns, and a solution of the pair must satisfy both at once. Setting the pair up carefully from the situation comes before any method for solving it.',
  nextStep:
    'Next you will solve a pair algebraically, by turning the two equations into one.',
  teacher: {
    objective: 'Students set up a pair of linear equations from context and test candidate solutions against both.',
    prerequisiteKnowledge: ['Forming equations', 'Checking solutions'],
    modelLanguage: ['What does each letter stand for?', 'Have you checked both equations?'],
    teachingNotes: [
      'Require the unknowns to be named in writing. Pairs formed with drifting definitions are the commonest setup error.',
      'The prediction question at the end is worth time; students who reason out the three cases meet the next lessons with a framework.',
    ],
    quickChecks: ['Does it satisfy both?', 'What are the two conditions here?'],
    supportForStrugglingLearners: [
      'Underline the two separate conditions in the worded problem before writing anything.',
      'Check candidates in a two-row table, one row per equation.',
    ],
    extension: ['Ask for a situation whose two conditions contradict each other, and what that would mean.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_13_5_SUB: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s13_5_substitution_lesson',
  contentArtifactVersion: 1,
  source: source('13.5', 'Finding Solutions to a Pair of Linear Equations', 21, 'ncert_iemh2_s13_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s13_4'],
    mayAssume: ['A pair of linear equations and what solving it means', 'Making a variable the subject', 'Solving a linear equation in one variable'],
    mustNotIntroduce: [{ concept: 'Solving by elimination', belongsToSection: 'ncert_iemh2_s13_5' }, { concept: 'The graphical method', belongsToSection: 'ncert_iemh2_s13_6' }],
  },
  learningGoal:
    'You will solve a pair of linear equations by substitution, and explain why replacing one variable is a valid move.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Make y the subject of x + y = 7.', 'Solve an equation such as 3x + 8 = 20.', 'Check a pair against two equations.'],
    ifNotReady: 'Practise making a variable the subject; substitution depends on doing that cleanly.',
  },
  vocabulary: [
    { term: 'substitution method', meaning: 'Expressing one variable from one equation and putting that expression into the other.' },
    { term: 'eliminate', meaning: 'To remove a variable from an equation so that one remains.' },
  ],
  explanation: [
    'The difficulty with a pair is that each equation has two unknowns. The way through is to reduce one of them to a single unknown, which can then be solved outright.',
    'Take x + y = 7 and 2x − y = 5. From the first, y = 7 − x. Now in any pair satisfying both equations, y really does equal 7 − x, so writing 7 − x in place of y in the second equation is not an approximation — it is the same number written differently.',
    'The second equation becomes 2x − (7 − x) = 5. Expand carefully, minding the sign on the bracket: 2x − 7 + x = 5, so 3x = 12 and x = 4. One unknown, solved.',
    'Then go back. With x = 4 the first equation gives y = 3. The solution is (4, 3), and it should be checked in both equations, because an arithmetic slip anywhere in the chain will otherwise go unnoticed.',
    'Which variable to isolate is a choice worth making deliberately. Pick the one with a coefficient of 1 or −1 and you avoid fractions; pick badly and the method still works but the arithmetic gets heavier.',
  ],
  representations: ['One equation rearranged, with the expression that replaces the variable highlighted', 'The chain from two unknowns to one and back again'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's135a.we1',
      prompt: 'Solve x + 2y = 11 and 3x − y = 5 by substitution.',
      steps: [
        { text: 'From the first, x = 11 − 2y.', reasoning: 'The coefficient of x is 1, so isolating it avoids fractions.' },
        { text: 'Substitute into the second: 3(11 − 2y) − y = 5.', reasoning: 'In any common solution x equals that expression, so replacing it leaves the equation saying the same thing.' },
        { text: 'Expand: 33 − 6y − y = 5, so 33 − 7y = 5.', reasoning: 'Distributing across the bracket, keeping the sign of each term.' },
        { text: 'Solve: 7y = 28, so y = 4; then x = 11 − 8 = 3.', reasoning: 'With one unknown found, the rearranged first equation delivers the other.' },
        { text: 'Check in both: 3 + 8 = 11 and 9 − 4 = 5.', reasoning: 'Checking catches a slip anywhere in the chain.' },
      ],
      answer: 'x = 3, y = 4.',
    },
    {
      id: 's135a.we2',
      prompt: 'Solve 2x + y = 9 and x − y = 3.',
      steps: [
        { text: 'From the second, x = y + 3.', reasoning: 'Isolating x here needs no division, since its coefficient is 1.' },
        { text: 'Substitute into the first: 2(y + 3) + y = 9.', reasoning: 'Replacing x by an equal expression preserves the equation.' },
        { text: 'Expand and solve: 2y + 6 + y = 9, so 3y = 3 and y = 1.', reasoning: 'Collecting the y terms leaves a one-step equation.' },
        { text: 'Then x = 1 + 3 = 4.', reasoning: 'Substituting back into the rearranged equation.' },
      ],
      answer: 'x = 4, y = 1.',
    },
    {
      id: 's135a.we3',
      prompt: 'Why is replacing y by 7 − x a valid step rather than an assumption?',
      steps: [
        { text: 'The first equation says that for any pair satisfying it, y and 7 − x are the same number.', reasoning: 'They are two names for one value, not two different quantities.' },
        { text: 'We are looking only at pairs satisfying both equations.', reasoning: 'So within that search, the substitution changes nothing about which pairs qualify.' },
        { text: 'Replacing a quantity by something equal to it leaves the equation saying the same thing.', reasoning: 'That is why the method finds all the solutions and no extra ones.' },
      ],
      answer: 'Because the first equation asserts the two expressions are equal for exactly the pairs under consideration.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's135a.g1',
      prompt: 'From x + y = 10, write y in terms of x.',
      hint: 'Subtract x from both sides.',
      answer: 'y = 10 − x',
      rationale: 'Isolating y gives the expression that will replace it.',
    },
    {
      id: 's135a.g2',
      prompt: 'Why choose the variable with coefficient 1 to isolate?',
      hint: 'What appears if you divide by 3 instead?',
      answer: 'To avoid fractions.',
      rationale: 'Isolating a variable with coefficient 3 introduces thirds into every later step.',
    },
    {
      id: 's135a.g3',
      prompt: 'After finding x, why substitute back rather than start again?',
      hint: 'Do you already have an equation giving y from x?',
      answer: 'Because the rearranged equation gives y directly.',
      rationale: 'Starting again risks a new error and does more work for the same answer.',
    },
  ],
  independentPractice: [
    {
      id: 's135a.i1',
      prompt: 'Solve x + 3y = 13 and 2x − y = 5.',
      answer: 'x = 4, y = 3.',
      rationale: 'Isolate x from the first and substitute into the second.',
    },
    {
      id: 's135a.i2',
      prompt: 'Solve y = 2x − 1 and 3x + y = 14.',
      answer: 'x = 3, y = 5.',
      rationale: 'The first is already solved for y, so it substitutes directly.',
    },
    {
      id: 's135a.i3',
      prompt: 'Explain in one sentence why the solution must be checked in both equations.',
      answer: 'Because it must satisfy both, and the chain of steps could hide a slip.',
      rationale: 'A pair is solved only when both conditions hold.',
    },
  ],
  reasoningApplication: [
    {
      id: 's135a.r1',
      prompt: 'Substitution replaces one variable with an expression. Explain what would go wrong if the expression came from an equation that was not part of the pair.',
      expectedReasoning:
        'The replacement is valid only because the first equation asserts the equality for the pairs being sought. An unrelated equation asserts it for different pairs, so the substitution would change which pairs qualify and could produce values satisfying neither original equation. A strong answer identifies the equality as the licence for the move.',
    },
  ],
  interactivePractice: [],
  summary:
    'Substitution expresses one variable from one equation and replaces it in the other, leaving a single unknown. The move is valid because the first equation asserts the two expressions are equal, and the result must be checked in both equations.',
  nextStep:
    'Next you will eliminate a variable by combining the equations instead, which handles cases substitution finds awkward.',
  teacher: {
    objective: 'Students solve pairs by substitution and justify the replacement step.',
    prerequisiteKnowledge: ['Making a variable the subject', 'Solving one-variable equations'],
    modelLanguage: ['Which variable will you isolate, and why?', 'What licenses this replacement?'],
    teachingNotes: [
      'The sign error when substituting into a subtraction is the commonest failure. Require brackets around the substituted expression.',
      'Ask for the justification of the substitution at least once per class; students perform it fluently without knowing why it is allowed.',
    ],
    quickChecks: ['Which variable is easiest to isolate?', 'Have you checked both equations?'],
    supportForStrugglingLearners: [
      'Write the rearranged equation on its own line before substituting.',
      'Always bracket the expression being substituted.',
    ],
    extension: ['Ask what happens when substitution produces a statement with no variable left.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_13_5_ELIM: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s13_5_elimination_lesson',
  contentArtifactVersion: 1,
  source: source('13.5', 'Finding Solutions to a Pair of Linear Equations', 21, 'ncert_iemh2_s13_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s13_5'],
    mayAssume: ['Solving a pair by substitution', 'Multiplying an equation through by a number', 'Adding and subtracting equations'],
    mustNotIntroduce: [{ concept: 'The graphical method and the three cases', belongsToSection: 'ncert_iemh2_s13_6' }],
  },
  learningGoal:
    'You will solve a pair by eliminating a variable, and recognise what the method is telling you when no variable remains.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Multiply every term of an equation by a number.', 'Add two equations term by term.', 'Solve a pair by substitution.'],
    ifNotReady: 'Make sure you can multiply an equation through correctly, including its constant term.',
  },
  vocabulary: [
    { term: 'elimination method', meaning: 'Combining the two equations so that one variable cancels.' },
    { term: 'degenerate case', meaning: 'A result with no variable left, which reveals no solution or infinitely many.' },
  ],
  explanation: [
    'Substitution works, but rearranging can be messy when no coefficient is 1. Elimination avoids rearranging: combine the two equations so that one variable disappears.',
    'Take 3x + 2y = 16 and 5x − 2y = 8. The y terms are already opposites, so adding the equations gives 8x = 24 and x = 3. Substituting back gives y = 3.5. Adding is allowed because equals added to equals give equals.',
    'When the coefficients do not match, make them match. For 2x + 3y = 13 and 4x − y = 5, multiply the second by 3 to get 12x − 3y = 15, then add: 14x = 28, so x = 2 and y = 3. Multiplying an equation through by a non-zero number does not change its solutions, which is what makes the step safe.',
    'Sometimes the variable vanishes and so does the other one. If you reach 0 = 7, no values can make that true, so the pair has no common solution. If you reach 0 = 0, the statement is true for every pair, which means the second equation added no new condition and there are infinitely many solutions.',
    'Those two outcomes are not failures of the method. They are the method reporting that the pair was not of the ordinary kind, and the next lesson shows what each looks like as a picture.',
  ],
  representations: ['Two equations stacked with the matching coefficients aligned', 'The combination step shown as one addition'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's135b.we1',
      prompt: 'Solve 2x + y = 8 and 3x − y = 7 by elimination.',
      steps: [
        { text: 'The y coefficients are +1 and −1, already opposite.', reasoning: 'No multiplication is needed when the coefficients are ready to cancel.' },
        { text: 'Add the equations: 5x = 15.', reasoning: 'Adding equals to equals keeps the equality, and the y terms cancel exactly.' },
        { text: 'So x = 3; substitute into the first: 6 + y = 8, giving y = 2.', reasoning: 'One equation delivers the remaining unknown.' },
        { text: 'Check in both: 8 = 8 and 7 = 7.', reasoning: 'Verification against both equations completes the solution.' },
      ],
      answer: 'x = 3, y = 2.',
    },
    {
      id: 's135b.we2',
      prompt: 'Solve 3x + 4y = 25 and 2x + 3y = 18.',
      steps: [
        { text: 'No coefficients match, so multiply to make them: first by 3 and second by 4.', reasoning: 'Multiplying each equation through by a non-zero number leaves its solutions unchanged.' },
        { text: 'That gives 9x + 12y = 75 and 8x + 12y = 72.', reasoning: 'The y coefficients now agree, so subtracting will cancel them.' },
        { text: 'Subtract: x = 3.', reasoning: 'Subtracting equals from equals preserves the equality.' },
        { text: 'Substitute: 9 + 4y = 25, so y = 4.', reasoning: 'Back-substitution into an original equation gives the second value.' },
      ],
      answer: 'x = 3, y = 4.',
    },
    {
      id: 's135b.we3',
      prompt: 'What does it mean if elimination gives 0 = 5?',
      steps: [
        { text: 'No value of x or y appears in the statement.', reasoning: 'The variables cancelled entirely, so the statement is about numbers alone.' },
        { text: 'The statement 0 = 5 is false whatever the variables are.', reasoning: 'There is no way to make it true by choosing values.' },
        { text: 'So no pair satisfies both equations.', reasoning: 'The two conditions contradict each other.' },
      ],
      answer: 'The pair has no solution: the two equations are inconsistent.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's135b.g1',
      prompt: 'In 4x + y = 10 and 2x − y = 2, should you add or subtract?',
      hint: 'Are the y coefficients the same or opposite?',
      answer: 'Add',
      rationale: 'Opposite coefficients cancel on addition.',
    },
    {
      id: 's135b.g2',
      prompt: 'Why may an equation be multiplied through by 3?',
      hint: 'Does that change which pairs satisfy it?',
      answer: 'Because it does not change its solutions.',
      rationale: 'Multiplying both sides by a non-zero number preserves the equality for exactly the same pairs.',
    },
    {
      id: 's135b.g3',
      prompt: 'Elimination gives 0 = 0. What does that say?',
      hint: 'Can any pair fail that statement?',
      answer: 'There are infinitely many solutions.',
      rationale: 'The second equation repeated the first, adding no new condition.',
    },
  ],
  independentPractice: [
    {
      id: 's135b.i1',
      prompt: 'Solve 5x + 2y = 16 and 3x − 2y = 8.',
      answer: 'x = 3, y = 0.5.',
      rationale: 'Adding cancels y immediately.',
    },
    {
      id: 's135b.i2',
      prompt: 'Solve 2x + 3y = 12 and 4x + 6y = 24.',
      answer: 'Infinitely many solutions.',
      rationale: 'The second is twice the first, so elimination gives 0 = 0.',
    },
    {
      id: 's135b.i3',
      prompt: 'Solve x + y = 4 and 2x + 2y = 15.',
      answer: 'No solution.',
      rationale: 'Doubling the first gives 2x + 2y = 8, which contradicts 15.',
    },
  ],
  reasoningApplication: [
    {
      id: 's135b.r1',
      prompt: 'Elimination can end with 0 = 0 or 0 = 5. Explain what each says about the relationship between the two equations, and why neither is an error in the working.',
      expectedReasoning:
        'A result of 0 = 0 means the second equation is a multiple of the first and adds no condition, so every solution of one solves both. A result of 0 = 5 means the two cannot hold together. A strong answer frames both as information about the pair rather than as a breakdown, and predicts that the pictures will be a single line and two parallel lines.',
    },
  ],
  interactivePractice: [],
  summary:
    'Elimination combines the two equations so that one variable cancels, after multiplying through if necessary. When every variable cancels, a false statement means no solution and a true one means infinitely many.',
  nextStep:
    'Next you will draw both equations and see those three outcomes as pictures.',
  teacher: {
    objective: 'Students solve pairs by elimination and interpret the degenerate outcomes.',
    prerequisiteKnowledge: ['Multiplying an equation through', 'Adding equations'],
    modelLanguage: ['Add or subtract — what will cancel?', 'What does this result with no variables mean?'],
    teachingNotes: [
      'Students multiply the left side and forget the constant. Require the whole equation rewritten before combining.',
      'The degenerate cases should be met here, not deferred. Treating them as errors is the misunderstanding to prevent.',
    ],
    quickChecks: ['Which variable will cancel?', '0 = 0 or 0 = 5 — what does yours say?'],
    supportForStrugglingLearners: [
      'Align the two equations in columns so matching coefficients are visible.',
      'Write the multiplied equation on a new line rather than editing in place.',
    ],
    extension: ['Ask students to construct a pair with no solution, and one with infinitely many.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_13_6: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s13_6_lesson',
  contentArtifactVersion: 1,
  source: source('13.6', 'Graphical Method for Solving A Pair of Linear', 28, 'ncert_iemh2_s13_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s13_5'],
    mayAssume: ['Graphing a linear equation', 'Solving a pair algebraically', 'Slope-intercept form'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will solve a pair graphically, and classify a pair by its coefficient ratios into one solution, infinitely many, or none.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Draw the graph of a two-variable equation from three solutions.', 'Solve a pair by elimination.', 'Compute the ratio of two coefficients.'],
    ifNotReady: 'Make sure graphing a single equation is accurate; two inaccurate lines cross in the wrong place.',
  },
  vocabulary: [
    { term: 'point of intersection', meaning: 'Where two lines meet, whose coordinates satisfy both equations.' },
    { term: 'coincident lines', meaning: 'Two equations whose graphs are the same line.' },
    { term: 'inconsistent pair', meaning: 'A pair with no common solution, whose lines are parallel.' },
  ],
  explanation: [
    'Each equation of a pair has a line, and a solution of the pair must lie on both. So the common solutions are exactly the points the two lines share, and the question becomes geometric.',
    'Two lines can relate in only three ways. They cross once, giving exactly one common solution. They can be the same line, so every point of it is common and there are infinitely many. Or they can be parallel and never meet, giving none. These are precisely the three outcomes elimination reported.',
    'The coefficient ratios predict which case before anything is drawn. If a₁ over a₂ differs from b₁ over b₂, the lines have different slopes and must cross once. If the a and b ratios agree but the c ratio differs, the slopes match and the intercepts do not, so the lines are parallel. If all three ratios agree, the equations are multiples of each other and the lines coincide.',
    'The graphical method shows the situation but reads the answer by eye, so it is exact only when the crossing lands on grid points. Elimination gives the exact values. Use the picture to see which case you are in and the algebra to get the numbers.',
    'The three representations now line up. A pair is two conditions, two lines and three possible outcomes, and each representation makes a different part of that obvious.',
  ],
  representations: ['Two lines crossing at one point, with its coordinates read off', 'The three cases compared side by side'],
  visuals: [F_THREECASES],
  visualsById: { F_THREECASES },
  workedExamples: [
    {
      id: 's136.we1',
      prompt: 'Solve x + y = 5 and x − y = 1 graphically.',
      steps: [
        { text: 'Find solutions of each: the first passes through (0,5) and (5,0); the second through (1,0) and (3,2).', reasoning: 'Two points determine each line, since the solutions of each equation are collinear.' },
        { text: 'Draw both lines on the same axes with the same scale.', reasoning: 'A shared scale is what makes the crossing point meaningful.' },
        { text: 'They cross at (3, 2).', reasoning: 'The point lying on both lines satisfies both equations.' },
        { text: 'Check algebraically: 3 + 2 = 5 and 3 − 2 = 1.', reasoning: 'Reading a crossing by eye needs confirmation, especially off grid points.' },
      ],
      answer: 'x = 3, y = 2 — one solution, where the lines cross.',
      visualRef: 'F_THREECASES',
    },
    {
      id: 's136.we2',
      prompt: 'Classify the pair 2x + 3y = 7 and 4x + 6y = 14 without drawing.',
      steps: [
        { text: 'Compare the a ratio: 2 over 4 is one half.', reasoning: 'Comparing coefficients first can settle the case before any graphing.' },
        { text: 'Compare the b ratio: 3 over 6 is also one half.', reasoning: 'Equal a and b ratios mean the two lines have the same slope.' },
        { text: 'Compare the c ratio: 7 over 14 is one half as well.', reasoning: 'All three ratios agreeing means the second equation is a multiple of the first.' },
      ],
      answer: 'Coincident lines: infinitely many solutions.',
    },
    {
      id: 's136.we3',
      prompt: 'Classify x + 2y = 4 and 2x + 4y = 15.',
      steps: [
        { text: 'The a ratio is one half and the b ratio is one half.', reasoning: 'Matching a and b ratios give equal slopes.' },
        { text: 'The c ratio is 4 over 15, which is not one half.', reasoning: 'Equal slopes with a different constant ratio means the lines are distinct.' },
        { text: 'Equal slopes and different intercepts means parallel.', reasoning: 'Parallel lines never meet, so no pair satisfies both.' },
      ],
      answer: 'Parallel lines: no solution.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's136.g1',
      prompt: 'Two lines cross at (2, 5). What does that point represent?',
      hint: 'What is true of a point on both lines?',
      answer: 'The solution of the pair.',
      rationale: 'Its coordinates satisfy both equations.',
    },
    {
      id: 's136.g2',
      prompt: 'All three coefficient ratios of a pair are equal. Which case is it?',
      hint: 'Is one equation a multiple of the other?',
      answer: 'Coincident lines, infinitely many solutions.',
      rationale: 'The second equation repeats the first and adds no condition.',
    },
    {
      id: 's136.g3',
      prompt: 'Why confirm a graphical answer algebraically?',
      hint: 'What if the crossing is not on a grid point?',
      answer: 'Because reading by eye is only approximate.',
      rationale: 'The picture identifies the case; the algebra gives exact values.',
    },
  ],
  independentPractice: [
    {
      id: 's136.i1',
      prompt: 'Solve 2x + y = 7 and x − y = 2 graphically, then check.',
      answer: 'x = 3, y = 1.',
      rationale: 'The lines cross at (3,1), confirmed by substitution.',
    },
    {
      id: 's136.i2',
      prompt: 'Classify 3x − y = 4 and 6x − 2y = 9 without drawing.',
      answer: 'Parallel: no solution.',
      rationale: 'The a and b ratios match at one half but the c ratio does not.',
    },
    {
      id: 's136.i3',
      prompt: 'Explain why two distinct lines cannot cross more than once.',
      answer: 'Because two points determine a unique line.',
      rationale: 'If they shared two points they would be the same line.',
    },
  ],
  reasoningApplication: [
    {
      id: 's136.r1',
      prompt: 'Elimination reports the three cases as 0 = 0, a false statement, or a unique answer; the graph shows them as coincident, parallel or crossing lines. Explain how each algebraic outcome corresponds to its picture.',
      expectedReasoning:
        'A unique answer is the single crossing point; 0 = 0 means one equation repeats the other, so the lines coincide and every point is shared; a false statement means equal slopes with different intercepts, so the lines never meet. A strong answer ties the coefficient ratios to the slopes, explaining why the a and b ratios govern direction and the c ratio governs position.',
    },
  ],
  interactivePractice: [],
  summary:
    'A pair of equations is two lines, and they cross once, coincide or stay parallel — the three outcomes elimination already reported. The coefficient ratios predict the case, the graph shows it, and the algebra gives exact values.',
  nextStep:
    'This completes the chapter: one equation, its line, a pair of them, and the three ways a pair can behave.',
  teacher: {
    objective: 'Students solve pairs graphically and classify pairs by coefficient ratios.',
    prerequisiteKnowledge: ['Graphing an equation', 'Elimination', 'Slope'],
    modelLanguage: ['What case do the ratios predict?', 'Does the picture agree with your algebra?'],
    teachingNotes: [
      'Have students predict the case from ratios before drawing. The prediction makes the drawing a test rather than a procedure.',
      'Be explicit that the graph locates the case and the algebra supplies the values; students otherwise read non-integer crossings off the paper.',
    ],
    quickChecks: ['One, none or infinitely many?', 'Where do these lines meet?'],
    supportForStrugglingLearners: [
      'Use pairs whose crossing falls on a lattice point until the method is secure.',
      'Draw the two lines in different styles as well as different colours.',
    ],
    extension: ['Ask for a third equation making a consistent triple with a given pair, and what that means geometrically.'],
    materialsNeeded: ['Squared paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

/** Wave-1 chapter 13, in the book's order. Nine lessons from six sections,
 *  with §13.2, §13.3 and §13.5 each split into two. */
export function twoVariablesChapterSections(): AuthoredSection[] {
  return [
    SECTION_13_1,
    SECTION_13_2_PAIRS,
    SECTION_13_2_LINE,
    SECTION_13_3_SLOPE,
    SECTION_13_3_FORM,
    SECTION_13_4,
    SECTION_13_5_SUB,
    SECTION_13_5_ELIM,
    SECTION_13_6,
  ];
}
