// ===========================================================================
// v0.84.0 checkpoint 34 — CLASS 9 AUTHORING WAVE 1, CHAPTER 2.
//
// The pilots were geometry. This wave tests whether the same standard holds
// for algebra, where the representation is a table or a graph rather than a
// figure, and where "why is this transformation allowed" replaces "why does
// this construction help".
//
// Chapter 2 carries one merged unit (§2.1 + §2.2) and one split (§2.6 into
// two), so it exercises both provenance paths on its own.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const LINEAR_POLYNOMIALS_CHAPTER_ID = 'ncert_iemh1_ch02';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part I)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh1dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: LINEAR_POLYNOMIALS_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// A coordinate graph is a geometry figure: axes are segments, plotted
// solutions are points, and the line through them is a segment. No new
// visual architecture was needed for algebra.
const F_LINE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    { id: 'o', x: 20, y: 160, label: 'O' },
    { id: 'xa', x: 200, y: 160, label: 'n' },
    { id: 'ya', x: 20, y: 20, label: 'y' },
    { id: 'p1', x: 50, y: 130, label: '(1, 5)' },
    { id: 'p2', x: 80, y: 110, label: '(2, 8)' },
    { id: 'p3', x: 110, y: 90, label: '(3, 11)' },
    { id: 'p4', x: 140, y: 70, label: '(4, 14)' },
  ],
  segments: [
    { from: 'o', to: 'xa' },
    { from: 'o', to: 'ya' },
    { from: 'p1', to: 'p4', mark: 'dashed' },
  ],
  caption: 'Four values of y = 3n + 2, and the straight line they fall on.',
  altText:
    'A coordinate grid with the horizontal axis labelled n and the vertical axis labelled y. Four plotted points (1,5), (2,8), (3,11) and (4,14) rise by the same vertical step for each step right, and a dashed straight line passes through all four.',
};

const F_FAMILY: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'compare_cases',
  status: 'concept_specific',
  points: [
    { id: 'xl', x: 10, y: 110, label: 'x' },
    { id: 'xr', x: 210, y: 110, label: "x'" },
    { id: 'yt', x: 110, y: 10, label: 'y' },
    { id: 'yb', x: 110, y: 210, label: "y'" },
    { id: 'o', x: 110, y: 110, label: 'O' },
    { id: 'a1', x: 30, y: 190, label: 'A' },
    { id: 'a2', x: 190, y: 30, label: 'y = 2x' },
    { id: 'b1', x: 30, y: 150, label: 'B' },
    { id: 'b2', x: 190, y: 70, label: 'y = x' },
  ],
  segments: [
    { from: 'xl', to: 'xr' },
    { from: 'yt', to: 'yb' },
    { from: 'a1', to: 'a2' },
    { from: 'b1', to: 'b2', mark: 'dashed' },
  ],
  caption: 'Both lines pass through the origin; the steeper one has the larger value of a.',
  altText:
    'Coordinate axes crossing at O. Two straight lines pass through the origin. The steeper line, labelled y = 2x, rises two units for each unit across; the shallower dashed line, labelled y = x, rises one unit for each unit across. Both have b equal to zero, which is why both meet the axes at the origin.',
};

export const SECTION_2_1_2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s2_1_2_lesson',
  contentArtifactVersion: 1,
  source: {
    ...source('2.1', 'Introduction', 1, 'ncert_iemh1_s2_1'),
    additionalOfficialSectionIds: ['ncert_iemh1_s2_2'],
  },
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Class 8 algebraic expressions and their terms', 'Substituting a value for a variable', 'Order of operations'],
    mustNotIntroduce: [
      { concept: 'Linear patterns and the nth term', belongsToSection: 'ncert_iemh1_s2_3' },
      { concept: 'Graphing a linear relationship', belongsToSection: 'ncert_iemh1_s2_6' },
    ],
  },
  learningGoal:
    'You will decide whether an expression is a linear polynomial, name its coefficients, constant term and degree, and evaluate it at a given value.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Separate an expression such as 4x + 7 into its terms.',
      'Substitute a number for a letter and work out the value.',
      'Say what a variable stands for in an expression.',
    ],
    ifNotReady: 'Revisit substitution first — the definition here is checked by evaluating.',
  },
  vocabulary: [
    { term: 'polynomial', meaning: 'An expression built from numbers and variables using addition, subtraction and multiplication, with whole-number powers.' },
    { term: 'degree', meaning: 'The highest power of the variable that appears.' },
    { term: 'coefficient', meaning: 'The number multiplying a power of the variable.' },
    { term: 'constant term', meaning: 'The term with no variable in it.' },
    { term: 'linear polynomial', meaning: 'A polynomial of degree 1.' },
  ],
  explanation: [
    'Buy n notebooks at 12 rupees each and pay 20 rupees for the bag, and the total is 12n + 20. Fence a square field of side s and the perimeter is 4s. Both expressions share a shape: one term with the variable multiplied by a number, and possibly a number on its own.',
    'That shape has a name. A polynomial is built from numbers and variables using addition, subtraction and multiplication, with whole-number powers only. Its degree is the highest power of the variable that appears. A polynomial of degree 1 is called linear.',
    'So 12n + 20 is linear: the variable appears to the power 1 and nowhere higher. The coefficient of n is 12 and the constant term is 20. In 4s the coefficient is 4 and the constant term is 0 — present, just equal to zero, which matters later when you compare expressions.',
    'What is not linear is as useful to know. In 5x squared the degree is 2. In 3 over x the variable sits underneath, which is not a whole-number power at all. Neither is a polynomial of degree 1, and neither behaves the way the rest of this chapter needs.',
    'One more distinction, because it causes trouble later. An expression in one variable, like 12n + 20, becomes a number as soon as you choose n. An expression in two variables, like 3x + 5y, needs both chosen before it has a value. The same word "linear" is used for both, but what you must supply to get a number is different.',
    'Evaluating is how you check all of this. Put n = 4 into 12n + 20 and you get 68. Nothing about the structure changes; you have simply chosen a value and read off what the expression says for it.',
  ],
  representations: [
    'An expression broken into coefficient, variable and constant term',
    'A context the expression describes, so the parts have meanings',
  ],
  visuals: [],
  visualsById: {},
  workedExamples: [
    {
      id: 's212.we1',
      prompt: 'Decide whether each is a linear polynomial in x: 7x − 3, x squared + 1, 9, and 6 over x.',
      steps: [
        { text: 'For 7x − 3, the highest power of x is 1.', reasoning: 'Degree 1 is exactly the condition for linear, and every term is a number times a whole-number power of x.' },
        { text: 'For x squared + 1, the highest power is 2.', reasoning: 'It is a polynomial, but its degree is 2, so it is not linear.' },
        { text: 'For 9, there is no variable at all, so the degree is 0.', reasoning: 'A constant is a polynomial of degree 0; linear means degree exactly 1, so 9 does not qualify.' },
        { text: 'For 6 over x, the variable is in the denominator.', reasoning: 'Division by a variable is not allowed in a polynomial at all, so the question of degree does not arise.' },
      ],
      answer: 'Only 7x − 3 is a linear polynomial.',
    },
    {
      id: 's212.we2',
      prompt: 'For the expression 5 − 2t, name the coefficient of t, the constant term and the degree.',
      steps: [
        { text: 'Write it as −2t + 5 so each term is visible with its sign.', reasoning: 'Reordering does not change the expression, and it stops the minus sign being attached to the wrong term.' },
        { text: 'The term with t is −2t, so the coefficient is −2.', reasoning: 'The coefficient carries its sign; reading it as 2 is the most common slip here.' },
        { text: 'The term with no variable is 5.', reasoning: 'That is the constant term by definition.' },
        { text: 'The highest power of t present is 1.', reasoning: 'So the degree is 1 and the expression is linear.' },
      ],
      answer: 'Coefficient −2, constant term 5, degree 1.',
    },
    {
      id: 's212.we3',
      prompt: 'A taxi charges 50 rupees plus 18 rupees per kilometre. Write the fare for d kilometres, and find the fare for 7 km.',
      steps: [
        { text: 'The part that changes is 18 rupees for each kilometre, giving 18d.', reasoning: 'A fixed amount per unit becomes a coefficient times the variable.' },
        { text: 'The 50 rupees is charged once, whatever d is, so it is the constant term.', reasoning: 'A charge that does not depend on the variable cannot carry the variable.' },
        { text: 'The fare is 18d + 50, a linear polynomial in d.', reasoning: 'Degree 1, with coefficient 18 and constant term 50.' },
        { text: 'For d = 7: 18 times 7 is 126, plus 50.', reasoning: 'Evaluating means substituting the chosen value and computing.' },
      ],
      answer: 'Fare = 18d + 50 rupees; for 7 km it is 176 rupees.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's212.g1',
      prompt: 'Is 3x + 4y a linear polynomial? What is different about it?',
      hint: 'Check the highest power — then count the variables.',
      answer: 'Yes, it is linear, but in two variables.',
      rationale: 'Every power is 1, so it is linear; unlike a one-variable expression you must choose both x and y before it has a value.',
    },
    {
      id: 's212.g2',
      prompt: 'In 9 − 4m, what is the coefficient of m?',
      hint: 'Does the minus sign belong to the 4?',
      answer: '−4.',
      rationale: 'The coefficient includes the sign in front of the term; reading it as 4 changes the expression.',
    },
    {
      id: 's212.g3',
      prompt: 'Evaluate 7 − 2k when k = −3.',
      hint: 'Substitute carefully: what is −2 times −3?',
      answer: '13.',
      rationale: 'Minus two times minus three is plus six, and 7 + 6 is 13. Treating the result as negative is the usual error.',
    },
  ],
  independentPractice: [
    {
      id: 's212.i1',
      prompt: 'Which of these are linear polynomials: 2y + 1, y squared − y, 11, 0.5p − 4?',
      answer: '2y + 1 and 0.5p − 4.',
      rationale: 'Degree exactly 1 is required; a squared term and a bare constant both fail it.',
    },
    {
      id: 's212.i2',
      prompt: 'A plumber charges 300 rupees for the visit and 250 rupees an hour. Write the charge for h hours and name the coefficient and constant term.',
      answer: '250h + 300; coefficient 250, constant term 300.',
      rationale: 'The per-hour rate multiplies the variable; the fixed visit charge does not.',
    },
    {
      id: 's212.i3',
      prompt: 'Evaluate 6t − 11 at t = 0 and t = 2, and say what the first answer tells you.',
      answer: '−11 and 1; at t = 0 the value is the constant term.',
      rationale: 'Substituting zero removes the variable term, leaving exactly the constant.',
    },
  ],
  reasoningApplication: [
    {
      id: 's212.r1',
      prompt: 'Two students write the cost of n items as 15n + 40 and as 40 + 15n. A third writes 55n. Decide which pairs are the same expression and which is not, and explain what the third student has assumed.',
      expectedReasoning:
        'The first two are the same, since addition can be written in either order. The third has added the coefficient to the constant, which only agrees with the others when n is 1. A strong answer tests a value such as n = 2 to show the disagreement rather than asserting it.',
    },
  ],
  interactivePractice: [],
  summary:
    'A linear polynomial has degree 1: a coefficient times the variable, plus a constant term that may be zero. Expressions with squares, or with the variable underneath, are not linear, and an expression in two variables needs both values before it has one.',
  nextStep: 'Next you will meet patterns whose terms go up by the same amount each time, and write a linear polynomial for the nth one.',
  teacher: {
    objective: 'Students identify linear polynomials and name coefficient, constant term and degree.',
    prerequisiteKnowledge: ['Algebraic expressions', 'Substitution'],
    modelLanguage: ['What is the highest power here?', 'Does the sign belong to that coefficient?'],
    teachingNotes: [
      'This lesson merges the chapter opening with the definition because §2.2 is one page that defines what §2.1 has just motivated; separated, the definition arrives with nothing attached to it.',
      'The non-examples carry as much weight as the examples. Spend time on 6 over x, which students often call linear because it has no visible power.',
      'Insist the coefficient carries its sign from the first lesson. It is the error that propagates furthest through the chapter.',
    ],
    quickChecks: ['Degree of this expression?', 'Coefficient of the variable, with its sign?'],
    supportForStrugglingLearners: [
      'Write each expression in a three-column table: coefficient, variable, constant.',
      'Evaluate at two values before classifying, so the expression feels like a rule rather than a string of symbols.',
    ],
    extension: ['Ask for a linear polynomial whose value is the same at two different inputs, and why none exists unless the coefficient is zero.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_2_3: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s2_3_lesson',
  contentArtifactVersion: 1,
  source: source('2.3', 'Exploring linear patterns', 6, 'ncert_iemh1_s2_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s2_1'],
    mayAssume: ['Linear polynomials and their parts', 'Reading a table of values', 'Class 8 pattern generalisation'],
    mustNotIntroduce: [{ concept: 'Linear growth and decay', belongsToSection: 'ncert_iemh1_s2_4' }, { concept: 'Graphing a linear relationship', belongsToSection: 'ncert_iemh1_s2_6' }],
  },
  learningGoal:
    'You will recognise a pattern whose consecutive terms differ by a constant, and write a linear polynomial that gives the nth term directly.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the difference between consecutive numbers in a list.', 'Describe a pattern of matchsticks or dots in words.', 'Evaluate a linear polynomial at a given value.'],
    ifNotReady: 'Practise finding differences in a list of numbers first; that is the whole diagnostic here.',
  },
  vocabulary: [
    { term: 'constant difference', meaning: 'The same amount added from each term to the next.' },
    { term: 'nth term', meaning: 'A rule giving the term in position n without listing the earlier ones.' },
    { term: 'position', meaning: 'The counting number n that says which term you want.' },
  ],
  explanation: [
    'Build a row of squares from matchsticks. The first square takes 4, and every square after it takes 3 more, because it borrows one side from its neighbour. The counts run 4, 7, 10, 13.',
    'Those numbers rise by 3 every time. A constant difference is the signature worth spotting, and it is what makes a pattern linear rather than merely increasing.',
    'Now get the nth term without listing. Term 1 is 4. Term 2 is 4 + 3. Term 3 is 4 + 3 + 3, which is 4 + 2 times 3. By term n you have added 3 exactly n minus 1 times, so the term is 4 + 3(n − 1), which tidies to 3n + 1.',
    'Look at what the parts mean. The 3 is the constant difference and became the coefficient. The 1 is what is left when you subtract one copy of the difference from the first term — it is the imaginary term 0, the value the rule would give at position zero.',
    'The test of a rule is that it reproduces the list. Put n = 1 into 3n + 1 and you get 4; n = 4 gives 13. If a rule fails on the terms you already know, it is wrong however neat it looks.',
  ],
  representations: ['A growing matchstick pattern with its stage numbers', 'A table of position against term, with the differences written between rows'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's23.we1',
      prompt: 'A pattern begins 7, 11, 15, 19. Find the nth term.',
      steps: [
        { text: 'Find consecutive differences: 11 − 7 = 4, 15 − 11 = 4, 19 − 15 = 4.', reasoning: 'A constant difference is what tells you a linear rule exists; without it, no expression of this shape will fit.' },
        { text: 'The difference 4 becomes the coefficient of n.', reasoning: 'Each step forward in position adds one more copy of 4, so n copies of 4 is the part that grows.' },
        { text: 'Work out what to add: at n = 1, 4n gives 4, but the term is 7, so 3 must be added.', reasoning: 'Matching the rule to a term you already know is what fixes the constant.' },
        { text: 'Check at n = 3: 4 times 3 is 12, plus 3 is 15.', reasoning: 'Testing a second term guards against a rule that only happens to fit the first.' },
      ],
      answer: '4n + 3.',
    },
    {
      id: 's23.we2',
      prompt: 'Is 2, 4, 8, 16 a linear pattern?',
      steps: [
        { text: 'Find the differences: 2, 4, 8.', reasoning: 'The first test is always the difference, because that is the condition for this chapter’s kind of rule.' },
        { text: 'They are not constant — the pattern doubles instead of adding a fixed amount.', reasoning: 'Multiplying by a constant is a different kind of growth and no expression of the form an + b will produce it.' },
      ],
      answer: 'No. The differences grow, so no linear polynomial gives these terms.',
    },
    {
      id: 's23.we3',
      prompt: 'The 1st term of a linear pattern is 10 and the 6th is 35. Find the nth term.',
      steps: [
        { text: 'From term 1 to term 6 is five steps, and the total rise is 35 − 10 = 25.', reasoning: 'Counting steps rather than terms is the point: six terms have five gaps between them.' },
        { text: 'Each step is 25 divided by 5, which is 5.', reasoning: 'Equal steps mean the total rise splits evenly, which is exactly what constant difference means.' },
        { text: 'So the rule is 5n + something; at n = 1 it must give 10, and 5 times 1 is 5, so add 5.', reasoning: 'Fitting the constant to a known term completes the rule.' },
      ],
      answer: '5n + 5.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's23.g1',
      prompt: 'A pattern goes 9, 14, 19, 24. What is the coefficient of n in its rule?',
      hint: 'Which number repeats as the difference?',
      answer: '5',
      rationale: 'The constant difference becomes the coefficient, because each extra position adds one more of it.',
    },
    {
      id: 's23.g2',
      prompt: 'A rule 6n − 2 is proposed for the pattern 4, 10, 16. Check it.',
      hint: 'Try n = 1 and n = 2 and compare with the list.',
      answer: 'It works.',
      rationale: '6(1) − 2 = 4 and 6(2) − 2 = 10, so the rule reproduces the known terms.',
    },
    {
      id: 's23.g3',
      prompt: 'Why count gaps rather than terms when finding the difference from two distant terms?',
      hint: 'Between 3 terms, how many steps are there?',
      answer: 'Because n terms have n − 1 steps between them.',
      rationale: 'Dividing by the number of terms instead of the number of gaps is the usual error and gives a difference that is slightly too small.',
    },
  ],
  independentPractice: [
    {
      id: 's23.i1',
      prompt: 'Find the nth term of 12, 19, 26, 33.',
      answer: '7n + 5.',
      rationale: 'The difference is 7, and at n = 1 the rule must give 12.',
    },
    {
      id: 's23.i2',
      prompt: 'A linear pattern has 3rd term 11 and 7th term 31. Find its nth term.',
      answer: '5n − 4.',
      rationale: 'Four steps raise the value by 20, so each step is 5; fitting at n = 3 gives the constant.',
    },
    {
      id: 's23.i3',
      prompt: 'Explain why a pattern with differences 3, 3, 4 has no linear rule.',
      answer: 'Because the difference is not constant.',
      rationale: 'A linear rule adds the same amount every step; one different gap rules it out.',
    },
  ],
  reasoningApplication: [
    {
      id: 's23.r1',
      prompt: 'Two patterns have the same constant difference but different first terms. Describe how their nth-term rules compare, and what that means if you plotted both.',
      expectedReasoning:
        'The coefficient of n is the same and only the constant differs, so one rule is the other plus a fixed amount. Plotted, the points would rise at the same rate with one set always a fixed distance above the other. A strong answer sees the difference controls the rate and the constant controls the starting level.',
    },
  ],
  interactivePractice: [],
  summary:
    'A pattern whose consecutive terms differ by a constant has an nth-term rule of the form an + b, where a is that constant difference and b is fixed by matching a known term.',
  nextStep:
    'Next you will meet quantities that rise or fall by a fixed amount over time, which is the same structure in a different setting.',
  teacher: {
    objective: 'Students find the nth term of a linear pattern and justify each part of the rule.',
    prerequisiteKnowledge: ['Differences in a list', 'Evaluating a linear polynomial'],
    modelLanguage: ['What is the difference each time?', 'Does your rule give the terms you already know?'],
    teachingNotes: [
      'Insist on checking the rule against two terms. A rule fitted to the first term alone passes by luck often enough to be dangerous.',
      'The gaps-versus-terms count is worth an explicit beat; it is the error that survives into the next lesson.',
    ],
    quickChecks: ['Constant difference?', 'Does your rule reproduce term 1?'],
    supportForStrugglingLearners: [
      'Build the matchstick pattern physically for three stages before tabulating.',
      'Write the differences between the rows of the table, not beside them, so the constancy is visible.',
    ],
    extension: ['Ask for a rule whose terms decrease, and what that does to the coefficient.'],
    materialsNeeded: ['Matchsticks or counters', 'Squared paper'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_2_4: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s2_4_lesson',
  contentArtifactVersion: 1,
  source: source('2.4', 'Linear growth and linear decay', 9, 'ncert_iemh1_s2_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s2_3'],
    mayAssume: ['Linear patterns and the nth term', 'Negative numbers in context', 'Evaluating an expression'],
    mustNotIntroduce: [{ concept: 'Relating two quantities by a rule', belongsToSection: 'ncert_iemh1_s2_5' }, { concept: 'Graphing a linear relationship', belongsToSection: 'ncert_iemh1_s2_6' }],
  },
  learningGoal:
    'You will model a quantity that rises or falls by a fixed amount each step as a linear expression, and read what its coefficient and constant mean in the situation.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write the nth term of a pattern with a constant difference.', 'Work with negative numbers in context, such as a falling balance.', 'Say what a coefficient is.'],
    ifNotReady: 'Go back to finding the nth term of a pattern; this lesson is that skill applied to quantities that change over time.',
  },
  vocabulary: [
    { term: 'linear growth', meaning: 'Increase by the same amount each step.' },
    { term: 'linear decay', meaning: 'Decrease by the same amount each step.' },
    { term: 'initial value', meaning: 'The amount before any step has been taken.' },
  ],
  explanation: [
    'A hall is filling at 15 people a minute, and 40 were already inside when counting began. After n minutes the number is 15n + 40. The structure is the pattern rule of the last lesson, now with minutes instead of positions.',
    'Decay is the same with the sign reversed. A prepaid balance of 500 rupees falling 35 rupees a day is 500 − 35n. The coefficient is −35, and the minus sign is doing real work: it says the quantity falls, and it is part of the coefficient rather than an afterthought.',
    'The constant term is the value before any step, which is why reading it off is usually easy: it is what the situation starts at. The coefficient is the amount per step, positive for growth and negative for decay.',
    'Linear decay has a boundary the growth case does not. A balance of 500 falling 35 a day cannot pass zero and keep going; the model describes the situation only while the quantity makes sense. Solving 500 − 35n = 0 gives roughly 14.3, so the model holds for about fourteen days and the expression says nothing useful after that.',
    'This is the first time in the chapter that a correct expression can give a meaningless answer. Checking the range over which a model applies is part of using it.',
  ],
  representations: ['A table of time against amount for a growing and a falling quantity', 'The same expression written with its parts labelled by what they mean'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's24.we1',
      prompt: 'A tank holds 90 litres and loses 6 litres an hour. Write the volume after h hours and find when it empties.',
      steps: [
        { text: 'The starting amount is 90, which does not depend on h.', reasoning: 'A value present before any time passes is the constant term.' },
        { text: 'Each hour removes 6 litres, so the change is −6h.', reasoning: 'Loss per unit time is a negative coefficient; writing 6h would describe a tank filling up.' },
        { text: 'The volume is 90 − 6h.', reasoning: 'Combining the two parts gives the model.' },
        { text: 'Set 90 − 6h = 0, giving h = 15.', reasoning: 'Empty means volume zero, so the question becomes an equation.' },
      ],
      answer: 'Volume = 90 − 6h litres; the tank empties after 15 hours.',
    },
    {
      id: 's24.we2',
      prompt: 'A gym has 120 members and gains 8 a month. How many after 2 years, and what does the model assume?',
      steps: [
        { text: 'Two years is 24 months, so n = 24.', reasoning: 'Matching the units of the variable to the question is the step that is easiest to skip.' },
        { text: 'Membership is 8n + 120, so 8 times 24 is 192, plus 120.', reasoning: 'Evaluating the expression at the chosen value.' },
        { text: 'The model assumes the gain stays exactly 8 every month for two years.', reasoning: 'A linear model asserts a constant rate, which is an assumption about the situation rather than a fact about the algebra.' },
      ],
      answer: '312 members, assuming the rate of 8 a month holds throughout.',
    },
    {
      id: 's24.we3',
      prompt: 'Two expressions are proposed for a balance of 500 falling 35 a day: 500 − 35n and 35n − 500. Which is right?',
      steps: [
        { text: 'Test n = 1 in each. The first gives 465; the second gives −465.', reasoning: 'Substituting a value you can check against the situation settles it immediately.' },
        { text: 'After one day the balance should have fallen a little from 500, not become negative.', reasoning: 'Comparing with what the situation says is the test, not which expression looks tidier.' },
        { text: 'So the starting amount must stand alone and the falling part must be subtracted from it.', reasoning: 'Reversing the order changes the meaning entirely rather than rearranging it.' },
      ],
      answer: '500 − 35n is correct; 35n − 500 describes something else.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's24.g1',
      prompt: 'A savings account has 2000 rupees and grows by 150 a month. Write the amount after m months.',
      hint: 'Which number is there before any month passes?',
      answer: '150m + 2000',
      rationale: 'The monthly gain multiplies the variable; the opening amount is the constant term.',
    },
    {
      id: 's24.g2',
      prompt: 'In 400 − 25d, what does the 25 mean, and why is it negative in the coefficient?',
      hint: 'Read the expression back as a sentence about the situation.',
      answer: 'A fall of 25 per day',
      rationale: 'The coefficient is −25; the sign records that the quantity decreases rather than increases.',
    },
    {
      id: 's24.g3',
      prompt: 'Why does the tank model stop being useful after 15 hours?',
      hint: 'What would the expression say at h = 20?',
      answer: 'Because volume cannot be negative.',
      rationale: 'The expression would give −30, which no tank can hold; the model applies only while the quantity makes sense.',
    },
  ],
  independentPractice: [
    {
      id: 's24.i1',
      prompt: 'A phone has 80 percent battery and loses 7 percent an hour. Write the charge after t hours and say when it reaches zero.',
      answer: '80 − 7t; at about 11.4 hours.',
      rationale: 'The loss per hour is the negative coefficient and the starting charge the constant.',
    },
    {
      id: 's24.i2',
      prompt: 'A library has 3400 books and adds 45 a month. Write the count after m months and find it after one year.',
      answer: '45m + 3400; 3940 after 12 months.',
      rationale: 'Evaluate at m = 12 after matching the unit of the variable.',
    },
    {
      id: 's24.i3',
      prompt: 'Explain the difference in meaning between the expressions 60 + 4n and 60 − 4n.',
      answer: 'One grows by 4 per step, the other falls by 4 per step, from the same start.',
      rationale: 'The sign of the coefficient is what distinguishes growth from decay, not the constant.',
    },
  ],
  reasoningApplication: [
    {
      id: 's24.r1',
      prompt: 'A model says a quantity falls by a fixed amount each day. Is it always sensible to use that model for a hundred days? Argue from the mathematics rather than from the example.',
      expectedReasoning:
        'No. A fixed fall eventually drives the quantity below zero, and the model is only valid while the quantity is meaningful in the situation. A strong answer finds the step at which the expression reaches zero and states the valid range, rather than saying vaguely that it stops working.',
    },
  ],
  interactivePractice: [],
  summary:
    'Growth and decay by a fixed amount per step are both linear: the amount per step is the coefficient, positive or negative, and the starting value is the constant term. A decay model is valid only while the quantity it describes still makes sense.',
  nextStep:
    'Next you will fit such a rule to a table of data, where neither the rate nor the starting value is given to you.',
  teacher: {
    objective: 'Students model constant-rate growth and decay and identify the valid range of a decay model.',
    prerequisiteKnowledge: ['Linear patterns', 'Negative numbers'],
    modelLanguage: ['What is the amount per step?', 'What was there before any step?'],
    teachingNotes: [
      'The sign of the coefficient is the lesson. Have students read the expression back as a sentence about the situation every time.',
      'The valid-range question is new here and students will not raise it. Ask what the expression says at a large value of the variable.',
    ],
    quickChecks: ['Growth or decay — what tells you?', 'When does this model stop making sense?'],
    supportForStrugglingLearners: [
      'Tabulate the first four steps before writing any expression.',
      'Say the situation aloud as a sentence and translate phrase by phrase.',
    ],
    extension: ['Ask for a situation where the quantity falls but can sensibly go below zero, such as a temperature.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_2_5: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s2_5_lesson',
  contentArtifactVersion: 1,
  source: source('2.5', 'Linear Relationships', 11, 'ncert_iemh1_s2_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s2_4'],
    mayAssume: ['Linear growth and decay', 'Reading a table', 'Solving a simple equation'],
    mustNotIntroduce: [{ concept: 'Graphing a linear relationship', belongsToSection: 'ncert_iemh1_s2_6' }, { concept: 'What a and b control', belongsToSection: 'ncert_iemh1_s2_6' }],
  },
  learningGoal:
    'You will find the rule y = ax + b connecting two quantities from a table of their values, when neither the rate nor the starting value is stated.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the difference between consecutive values in a table.', 'Substitute into an expression to check it.', 'Solve an equation such as 20 + b = 170.'],
    ifNotReady: 'Make sure you can find differences in a table; that is how the rate is recovered.',
  },
  vocabulary: [
    { term: 'rate of change', meaning: 'How much y changes for each increase of 1 in x.' },
    { term: 'relationship', meaning: 'A rule connecting two quantities so that choosing one fixes the other.' },
  ],
  explanation: [
    'Until now you were told the rate and the starting amount. Real data arrives as a table and tells you neither. A phone bill for 1, 2, 3 and 4 gigabytes reads 170, 190, 210 and 230 rupees. The job is to find the rule.',
    'First the rate. Each extra gigabyte adds 20 rupees, the same every time, so the relationship is linear and the coefficient is 20. If those differences were not equal, no rule of this shape would fit and you would have to say so.',
    'Then the starting value. Using 20 gigabytes alone would give 20 at x = 1, but the bill is 170, so something fixed is being added. Solving 20 + b = 170 gives b = 150: a fixed charge that applies whatever the usage.',
    'The rule is y = 20x + 150, and its parts have meanings in the situation — 20 rupees per gigabyte, 150 rupees of fixed charge. Fitting is not symbol pushing; each number answers a question about the data.',
    'Finally test the rule on a row you did not use. At x = 4, 20 times 4 plus 150 is 230, which matches. A rule fitted to one row and never checked is a guess.',
  ],
  representations: ['A table with the differences written between its rows', 'The fitted rule with each part labelled by what it means in the situation'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's25.we1',
      prompt: 'A table gives y = 11, 15, 19, 23 for x = 1, 2, 3, 4. Find the rule.',
      steps: [
        { text: 'Differences are 4 each time.', reasoning: 'Constant differences mean a rule of the form ax + b will fit; this check comes before any fitting.' },
        { text: 'So a = 4.', reasoning: 'The change per unit step is exactly the coefficient of x.' },
        { text: 'At x = 1, 4 times 1 is 4 but y is 11, so b = 7.', reasoning: 'The gap between what the variable part gives and the actual value is the constant.' },
        { text: 'Check at x = 3: 4 times 3 plus 7 is 19.', reasoning: 'Testing an unused row is what turns a fit into a verified rule.' },
      ],
      answer: 'y = 4x + 7.',
    },
    {
      id: 's25.we2',
      prompt: 'A table gives y = 50, 44, 38, 32 for x = 0, 1, 2, 3. Find the rule.',
      steps: [
        { text: 'Differences are −6 each time.', reasoning: 'The values fall, so the coefficient is negative; recording it as 6 would reverse the meaning.' },
        { text: 'At x = 0 the value is 50.', reasoning: 'Substituting zero kills the variable term, so the constant can be read straight off.' },
        { text: 'So the rule is y = −6x + 50.', reasoning: 'Both parts now come from the table rather than from the situation.' },
      ],
      answer: 'y = −6x + 50.',
    },
    {
      id: 's25.we3',
      prompt: 'A table gives y = 3, 6, 12, 24. Can a rule y = ax + b fit it?',
      steps: [
        { text: 'Differences are 3, 6, 12.', reasoning: 'The first test is for constancy, and these differ.' },
        { text: 'Unequal differences mean no constant rate exists.', reasoning: 'A rule of the form ax + b changes by exactly a per step, so it cannot produce changing differences.' },
      ],
      answer: 'No. This data doubles rather than adding a fixed amount, so no linear rule fits it.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's25.g1',
      prompt: 'A table has y = 8, 13, 18 for x = 1, 2, 3. What is a?',
      hint: 'How much does y rise per step of x?',
      answer: '5',
      rationale: 'The constant difference is the rate of change, which is the coefficient.',
    },
    {
      id: 's25.g2',
      prompt: 'With a = 5 and y = 8 at x = 1, find b.',
      hint: 'Substitute and solve for b.',
      answer: '3',
      rationale: '5 times 1 plus b must equal 8.',
    },
    {
      id: 's25.g3',
      prompt: 'Why test the rule on a row you did not use to build it?',
      hint: 'Could a wrong rule still fit the row you used?',
      answer: 'Because the row you fitted to will always match.',
      rationale: 'The constant was chosen to make that row work, so it proves nothing; an unused row is a real test.',
    },
  ],
  independentPractice: [
    {
      id: 's25.i1',
      prompt: 'Find the rule for y = 25, 40, 55, 70 at x = 0, 1, 2, 3.',
      answer: 'y = 15x + 25.',
      rationale: 'The difference is 15 and the value at x = 0 is the constant.',
    },
    {
      id: 's25.i2',
      prompt: 'A plan charges a fixed fee plus a rate per unit. Usage 2 costs 260 and usage 5 costs 410. Find the rule.',
      answer: 'y = 50x + 160.',
      rationale: 'Three steps raise the cost by 150, so each step is 50; fitting at x = 2 gives the fee.',
    },
    {
      id: 's25.i3',
      prompt: 'Explain what b means when x = 0 is a sensible value in the situation.',
      answer: 'It is the value of y before any units are used.',
      rationale: 'Substituting zero leaves only the constant term.',
    },
  ],
  reasoningApplication: [
    {
      id: 's25.r1',
      prompt: 'Two different tables produce the same rule. Must they contain the same rows? Explain what the rule does and does not determine.',
      expectedReasoning:
        'No. The rule determines a value for every x, so any selection of x values from it produces a table fitting the same rule. A strong answer separates the rule from the sample of it, and notes that a table is evidence for a rule rather than the rule itself.',
    },
  ],
  interactivePractice: [],
  summary:
    'Given a table, equal differences confirm a linear relationship and give the coefficient; substituting a known row gives the constant. The fitted rule must then be tested on a row that was not used to build it.',
  nextStep:
    'Next you will draw these relationships, and see what the two constants do to the picture.',
  teacher: {
    objective: 'Students fit y = ax + b to tabulated data and verify the fit.',
    prerequisiteKnowledge: ['Differences in a table', 'Solving a one-step equation'],
    modelLanguage: ['What happens to y for each step in x?', 'Have you tested a row you did not use?'],
    teachingNotes: [
      'Students fit to the first row and stop. Make the independent check a required step of the method, not an optional one.',
      'When differences are unequal, the correct answer is that no linear rule fits. Reward that rather than treating it as a failed question.',
    ],
    quickChecks: ['Is the difference constant?', 'What does b mean here?'],
    supportForStrugglingLearners: [
      'Write the differences between the table rows before anything else.',
      'Label a and b with their meanings in the situation as soon as they are found.',
    ],
    extension: ['Give a table with one wrong entry and ask students to detect it from the differences.'],
    materialsNeeded: ['Squared paper'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_2_6_GRAPH: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s2_6_graph_lesson',
  contentArtifactVersion: 1,
  source: source('2.6', 'Visualising linear relationships', 12, 'ncert_iemh1_s2_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s2_5'],
    mayAssume: ['Fitting y = ax + b to a table', 'Plotting a point from an ordered pair', 'Reading a scale on an axis'],
    mustNotIntroduce: [{ concept: 'What a and b control', belongsToSection: 'ncert_iemh1_s2_6' }],
  },
  learningGoal:
    'You will draw the graph of a linear relationship from its rule, and establish that its points lie on a straight line.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Plot a point such as (3, 11) on a grid.', 'Make a table of values from a rule.', 'Choose a sensible scale for an axis.'],
    ifNotReady: 'Practise plotting ordered pairs first; everything here rests on placing points accurately.',
  },
  vocabulary: [
    { term: 'graph of a relationship', meaning: 'The set of points whose coordinates satisfy the rule.' },
    { term: 'axis scale', meaning: 'How many units each square on the grid represents.' },
  ],
  explanation: [
    'A rule such as y = 3n + 2 lists values: 5, 8, 11, 14 for n = 1, 2, 3, 4. Plot those as the pairs (1,5), (2,8), (3,11) and (4,14) and the four points fall on a straight line.',
    'That is not a coincidence of these numbers. Each step right of 1 raises y by exactly 3, because the rule adds one more 3 per step. The same horizontal step always gives the same vertical rise, and that is precisely what a straight line means.',
    'The graph is a picture of the rule, not a different object. Every point on the line satisfies the rule, and every pair that satisfies it is on the line. Saying the line is the relationship is slightly wrong; the line shows the relationship.',
    'Choosing a scale is a real decision. If y runs to 200 and you let one square be one unit, the graph will not fit; if you let one square be fifty, four points will crowd into a corner. Pick a scale that spreads the values across the grid and label both axes with what they measure.',
    'Two points are enough to draw a line once you know it is straight, but plot a third as a check. If it misses the line you have made an arithmetic slip, and you would rather find out now.',
  ],
  representations: ['A table of values and the matching plotted points', 'The straight line through them, with both axes labelled'],
  visuals: [F_LINE],
  visualsById: { F_LINE },
  workedExamples: [
    {
      id: 's26a.we1',
      prompt: 'Draw the graph of y = 2x + 1 for x from 0 to 4.',
      steps: [
        { text: 'Build a table: x = 0,1,2,3,4 gives y = 1,3,5,7,9.', reasoning: 'Evaluating the rule at several values produces the pairs to plot.' },
        { text: 'Choose a scale where x runs to 4 and y to 9, so one square per unit works.', reasoning: 'A scale is chosen to fit the range of values, not picked by habit.' },
        { text: 'Plot (0,1), (1,3), (2,5), (3,7), (4,9) and check they align.', reasoning: 'Alignment is the thing being verified, so it must be looked for rather than assumed.' },
        { text: 'Draw one straight line through them and label the axes.', reasoning: 'An unlabelled graph does not say what it is a graph of.' },
      ],
      answer: 'A straight line rising 2 units for every 1 across, crossing the y-axis at 1.',
      visualRef: 'F_LINE',
    },
    {
      id: 's26a.we2',
      prompt: 'A point (5, 12) is claimed to be on the graph of y = 2x + 1. Is it?',
      steps: [
        { text: 'Substitute x = 5 into the rule: 2 times 5 plus 1 is 11.', reasoning: 'Membership of the graph is decided by the rule, not by whether the point looks close on paper.' },
        { text: 'The claimed y is 12, not 11.', reasoning: 'One unit out is still off the line; the graph contains exactly the pairs that satisfy the rule.' },
      ],
      answer: 'No. (5, 11) is on the graph; (5, 12) is not.',
    },
    {
      id: 's26a.we3',
      prompt: 'Why plot a third point when two determine a line?',
      steps: [
        { text: 'Two points always lie on some line, whatever they are.', reasoning: 'So two points can never disagree with each other and can never reveal a mistake.' },
        { text: 'A third point computed from the same rule should also lie on it.', reasoning: 'If it does not, one of the three values was computed wrongly.' },
        { text: 'The check costs one substitution.', reasoning: 'Catching the slip here is cheaper than drawing the wrong line and using it.' },
      ],
      answer: 'The third point is an error check, not a geometric necessity.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's26a.g1',
      prompt: 'Is (3, 10) on the graph of y = 3x + 1?',
      hint: 'Substitute and compare.',
      answer: 'Yes',
      rationale: '3 times 3 plus 1 is 10, so the pair satisfies the rule.',
    },
    {
      id: 's26a.g2',
      prompt: 'A student plots y = 4x + 2 with one square per unit on both axes, and the line leaves the grid at x = 3. What should change?',
      hint: 'Which axis runs out first?',
      answer: 'Use a larger unit per square on the y-axis.',
      rationale: 'y grows four times as fast as x, so the vertical scale needs to cover a bigger range.',
    },
    {
      id: 's26a.g3',
      prompt: 'Three points from one rule do not lie on a line. What does that tell you?',
      hint: 'Could the rule be wrong, or the arithmetic?',
      answer: 'An arithmetic or plotting error has been made.',
      rationale: 'A rule of this form always gives collinear points, so a bend means a slip rather than a curved relationship.',
    },
  ],
  independentPractice: [
    {
      id: 's26a.i1',
      prompt: 'Draw the graph of y = −x + 6 for x from 0 to 5 and describe it.',
      answer: 'A straight line falling 1 unit for each step right, crossing the y-axis at 6.',
      rationale: 'A negative coefficient makes the line fall from left to right.',
    },
    {
      id: 's26a.i2',
      prompt: 'Make a table for y = 5x − 3 at x = 0, 1, 2, 3 and state which point is on the y-axis.',
      answer: '−3, 2, 7, 12; the point (0, −3).',
      rationale: 'The y-axis is where x is zero.',
    },
    {
      id: 's26a.i3',
      prompt: 'Explain why every point satisfying a rule of this form lies on one straight line.',
      answer: 'Because each unit step in x changes y by the same fixed amount.',
      rationale: 'Equal horizontal steps giving equal vertical steps is what makes a line straight.',
    },
  ],
  reasoningApplication: [
    {
      id: 's26a.r1',
      prompt: 'A graph is drawn with no labels on either axis. List what cannot be determined from it, and what still can.',
      expectedReasoning:
        'The rule cannot be recovered: without scales, the same picture fits infinitely many rules. What survives is qualitative — whether the line rises or falls and roughly how steeply relative to itself. A strong answer separates what the picture shows from what the labelling supplies.',
    },
  ],
  interactivePractice: [],
  summary:
    'The graph of a linear relationship is the set of points satisfying the rule, and they lie on a straight line because each unit step in x changes y by the same amount. Scale and labels are part of the graph, not decoration.',
  nextStep:
    'Next you will keep one constant fixed and change the other, to see exactly what each one controls.',
  teacher: {
    objective: 'Students graph a linear relationship and justify why its points are collinear.',
    prerequisiteKnowledge: ['Plotting ordered pairs', 'Making a table from a rule'],
    modelLanguage: ['What will you plot, and at what scale?', 'Does this point satisfy the rule?'],
    teachingNotes: [
      'Students treat the line as the mathematics and the rule as the working. Ask repeatedly which points belong to the graph and why.',
      'Scale choice deserves explicit teaching here; it is the first chapter where a bad scale ruins a correct table.',
    ],
    quickChecks: ['Is this point on the graph?', 'Why must these points be collinear?'],
    supportForStrugglingLearners: [
      'Give the table and ask only for the plotting at first.',
      'Use pre-labelled axes until the scale decision is secure.',
    ],
    extension: ['Ask what happens to the graph if every y value is doubled.'],
    materialsNeeded: ['Squared paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_2_6_PARAMS: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s2_6_params_lesson',
  contentArtifactVersion: 1,
  source: source('2.6', 'Visualising linear relationships', 12, 'ncert_iemh1_s2_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s2_6'],
    mayAssume: ['Graphing a linear relationship', 'Reading a point off a graph', 'Negative coefficients'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will determine what a and b each do to the graph of y = ax + b, by changing one while holding the other fixed.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Draw the graph of a rule such as y = 2x + 1.', 'Find where a line crosses the y-axis.', 'Say what a negative coefficient means for a relationship.'],
    ifNotReady: 'Make sure you can graph a single rule accurately; this lesson compares several at once.',
  },
  vocabulary: [
    { term: 'steepness', meaning: 'How much the line rises for each unit across.' },
    { term: 'y-intercept', meaning: 'The y-value where the line crosses the y-axis, at x = 0.' },
  ],
  explanation: [
    'The rule y = ax + b has two constants, and the fastest way to find out what each does is to change one and leave the other alone. Changing both at once tells you nothing about either.',
    'Hold b at zero and vary a. The graphs of y = x, y = 2x and y = 3x all pass through the origin and get steeper in that order. With b at zero, substituting x = 0 gives y = 0 whatever a is, so every one of them must pass through the origin. A negative a tilts the line the other way, falling as you move right.',
    'Now hold a at 1 and vary b. The graphs of y = x, y = x + 3 and y = x − 2 are parallel and sit at different heights. Adding b to every value lifts the whole line by b without changing how fast it rises.',
    'So a controls steepness and direction, and b controls where the line sits. At x = 0 the rule gives y = b, which is why b is read off exactly where the line crosses the y-axis.',
    'These are observations about the picture at this stage. The chapter on linear equations in two variables will give a the name slope and define it by measurement rather than by comparison.',
  ],
  representations: ['A family of lines through the origin with different values of a', 'A family of parallel lines with the same a and different b'],
  visuals: [F_FAMILY],
  visualsById: { F_FAMILY },
  workedExamples: [
    {
      id: 's26b.we1',
      prompt: 'Describe the difference between the graphs of y = 4x and y = 4x + 5 without drawing them.',
      steps: [
        { text: 'Both have a = 4, so they rise equally fast.', reasoning: 'The coefficient of x is unchanged, and that is what sets the steepness.' },
        { text: 'Their b values differ by 5.', reasoning: 'The constant alone differs, so only the position changes.' },
        { text: 'Every value of the second is 5 more than the first at the same x.', reasoning: 'Adding 5 to the output at every input lifts the whole line.' },
      ],
      answer: 'Two parallel lines, the second exactly 5 units above the first.',
      visualRef: 'F_FAMILY',
    },
    {
      id: 's26b.we2',
      prompt: 'A line passes through the origin and is steeper than y = 3x. What can you say about its rule?',
      steps: [
        { text: 'Passing through the origin means y = 0 when x = 0, so b = 0.', reasoning: 'Substituting x = 0 into y = ax + b leaves y = b, which must therefore be zero.' },
        { text: 'Steeper than y = 3x means a larger rise per step, so a is greater than 3.', reasoning: 'Steepness is governed by the coefficient alone once b is fixed.' },
      ],
      answer: 'Its rule is y = ax with a greater than 3.',
    },
    {
      id: 's26b.we3',
      prompt: 'Two lines cross the y-axis at the same point but are not the same line. What must differ?',
      steps: [
        { text: 'Crossing at the same point means the same value at x = 0, so the same b.', reasoning: 'The y-intercept is exactly the value of the rule at zero.' },
        { text: 'If the lines differ but share b, the only other constant available is a.', reasoning: 'A rule of this form has just two constants, so one of them must account for the difference.' },
      ],
      answer: 'They have the same b and different a: same crossing point, different steepness.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's26b.g1',
      prompt: 'Which is steeper, y = 7x + 1 or y = 2x + 9?',
      hint: 'Which constant controls steepness?',
      answer: 'y = 7x + 1',
      rationale: 'The coefficient 7 exceeds 2; the constants play no part in steepness.',
    },
    {
      id: 's26b.g2',
      prompt: 'Where does y = 6x − 4 cross the y-axis?',
      hint: 'What is y when x is zero?',
      answer: 'At (0, −4)',
      rationale: 'Substituting x = 0 leaves the constant term.',
    },
    {
      id: 's26b.g3',
      prompt: 'Why must every line of the form y = ax pass through the origin?',
      hint: 'Put x = 0 into the rule.',
      answer: 'Because y = 0 when x = 0.',
      rationale: 'With b absent there is nothing left when the variable term vanishes.',
    },
  ],
  independentPractice: [
    {
      id: 's26b.i1',
      prompt: 'Describe the graphs of y = −2x and y = −2x + 6 and how they relate.',
      answer: 'Both fall at the same rate; the second is 6 units above the first.',
      rationale: 'Equal a makes them parallel; the differing b shifts one vertically.',
    },
    {
      id: 's26b.i2',
      prompt: 'Write a rule whose graph is parallel to y = 5x − 1 and crosses the y-axis at 4.',
      answer: 'y = 5x + 4.',
      rationale: 'Parallel fixes a; the crossing point fixes b.',
    },
    {
      id: 's26b.i3',
      prompt: 'Explain why changing both a and b at once makes it hard to say what each does.',
      answer: 'Because any difference in the graph could be caused by either change.',
      rationale: 'Isolating one constant at a time is what makes the comparison informative.',
    },
  ],
  reasoningApplication: [
    {
      id: 's26b.r1',
      prompt: 'A student says a larger b makes a line steeper, having compared y = x + 1 with y = 3x + 5. Identify the flaw and describe a comparison that would settle it.',
      expectedReasoning:
        'Both constants changed, so the steepness difference cannot be attributed to b. A fair test holds a fixed and varies b alone — comparing y = x + 1 with y = x + 5 shows the lines are parallel. A strong answer names the method, not just the right answer.',
    },
  ],
  interactivePractice: [],
  summary:
    'In y = ax + b, a sets how steeply the line rises or falls and b sets where it crosses the y-axis. Each is found by holding the other fixed; changing both at once confuses their effects.',
  nextStep:
    'This completes the chapter: from naming a linear polynomial to reading its graph. The next chapter builds algebraic identities, and Part II returns to lines with two variables.',
  teacher: {
    objective: 'Students attribute steepness to a and vertical position to b by controlled comparison.',
    prerequisiteKnowledge: ['Graphing a rule', 'Reading a y-intercept'],
    modelLanguage: ['Which constant did we change?', 'What stayed the same in these graphs?'],
    teachingNotes: [
      'The controlled comparison is the method being taught, not just the conclusion. Students who change both constants get the right answer for the wrong reason.',
      'Hold back the word slope. It arrives with a definition in Part II, and using it early invites students to think it has been defined.',
    ],
    quickChecks: ['Which constant controls this?', 'Where does it cross the y-axis, and why?'],
    supportForStrugglingLearners: [
      'Pre-plot one family on a shared grid and ask only what is the same and what differs.',
      'Use colour and a label for each line, never colour alone.',
    ],
    extension: ['Ask for two rules whose graphs never meet, and why they cannot.'],
    materialsNeeded: ['Squared paper', 'Ruler', 'Coloured pencils'],
  },
  reviewStatus: 'authored_draft',
};

/** Wave-1 chapter 2, in the book's order. Six lessons from six sections:
 *  one merged (§2.1 + §2.2), one split (§2.6 into two), four one-to-one. */
export function linearPolynomialsChapterSections(): AuthoredSection[] {
  return [
    SECTION_2_1_2,
    SECTION_2_3,
    SECTION_2_4,
    SECTION_2_5,
    SECTION_2_6_GRAPH,
    SECTION_2_6_PARAMS,
  ];
}
