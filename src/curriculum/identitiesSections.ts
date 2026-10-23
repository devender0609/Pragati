// ===========================================================================
// v0.84.0 checkpoint 34 — CLASS 9 AUTHORING WAVE 1, CHAPTER 4.
//
// Identities. The test here is whether Pragati can teach an identity as a
// statement that is true for every value, justified and then used, rather
// than as a formula to be recalled. The chapter also carries one split
// (§4.7 into two), so the split invariant is exercised outside geometry.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const IDENTITIES_CHAPTER_ID = 'ncert_iemh1_ch04';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part I)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh1dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: IDENTITIES_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

// The square identity drawn as an area: the four regions ARE the four terms.
const F_SQUARE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_definition',
  status: 'concept_specific',
  points: [
    { id: 'p', x: 20, y: 20, label: 'P' },
    { id: 'q', x: 140, y: 20, label: 'Q' },
    { id: 'r', x: 200, y: 20, label: 'R' },
    { id: 's', x: 20, y: 140, label: 'S' },
    { id: 't', x: 140, y: 140, label: 'T' },
    { id: 'u', x: 200, y: 140, label: 'U' },
    { id: 'v', x: 20, y: 200, label: 'V' },
    { id: 'w', x: 140, y: 200, label: 'W' },
    { id: 'z', x: 200, y: 200, label: 'Z' },
  ],
  segments: [
    { from: 'p', to: 'r', label: 'a + b' },
    { from: 'r', to: 'z' },
    { from: 'z', to: 'v' },
    { from: 'v', to: 'p', label: 'a + b' },
    { from: 's', to: 'u', mark: 'dashed' },
    { from: 'q', to: 'w', mark: 'dashed' },
  ],
  shadedRegions: [{ points: ['p', 'q', 't', 's'], label: 'a squared' }],
  caption: 'A square of side a + b, cut into four regions by the dashed lines.',
  altText:
    'A large square PRZV whose side is marked a + b. Two dashed lines, one horizontal through S and U and one vertical through Q and W, divide it into four regions: a shaded square PQTS of side a, two congruent rectangles each of area a times b, and a small square of side b at the far corner. The four regions together make up the whole square.',
};

export const SECTION_4_1: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s4_1_lesson',
  contentArtifactVersion: 1,
  source: source('4.1', 'Introduction', 1, 'ncert_iemh1_s4_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Class 8 algebraic identities', 'Substituting values into an expression', 'Solving a simple equation'],
    mustNotIntroduce: [{ concept: 'Area models for the square identities', belongsToSection: 'ncert_iemh1_s4_2' }, { concept: 'Factorisation', belongsToSection: 'ncert_iemh1_s4_3' }],
  },
  learningGoal:
    'You will distinguish an identity, true for every value, from an equation that constrains the value, and test a claimed identity properly.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Substitute a number for a letter in an expression.', 'Solve an equation such as x squared = 25.', 'Expand a product such as (x + 2)(x + 3).'],
    ifNotReady: 'Practise substitution first; the test for an identity is substitution done deliberately.',
  },
  vocabulary: [
    { term: 'identity', meaning: 'A statement of equality that holds for every value of the variables.' },
    { term: 'equation', meaning: 'A statement of equality that holds only for particular values.' },
    { term: 'counterexample', meaning: 'One value for which a claimed identity fails, which refutes it.' },
  ],
  explanation: [
    'Two statements can look alike and behave completely differently. x squared − 1 = 24 is true only when x is 5 or −5. (x + y) squared = x squared + 2xy + y squared is true whatever x and y you choose.',
    'The first is an equation: it narrows the possibilities, and solving it means finding which values make it true. The second is an identity: it narrows nothing, and asserts that the two expressions are the same expression written differently.',
    'How do you tell? Substituting one value is not enough — an equation is also true at its own solutions. What settles it is either a derivation showing the two sides must agree for every value, or a single value where they disagree, which ends the matter.',
    'That asymmetry is worth holding onto. To establish an identity you need an argument covering all values; to refute one you need one counterexample. Checking three values that happen to work proves nothing either way.',
    'Identities earn their place because they let you rewrite. Every identity in this chapter is a licence to replace one expression by another anywhere it appears, without checking the value first — and that licence is exactly what proving it for all values buys you.',
  ],
  representations: ['The two statements side by side, one constraining and one not', 'A substitution table showing where each holds'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's41.we1',
      prompt: 'Decide whether (x + 1) squared = x squared + 1 is an identity.',
      steps: [
        { text: 'Try x = 0: both sides give 1.', reasoning: 'One agreement proves nothing; a false claim can still hold at particular values.' },
        { text: 'Try x = 2: the left is 9, the right is 5.', reasoning: 'A single disagreement is a counterexample, and that is enough to settle it.' },
      ],
      answer: 'Not an identity. It fails at x = 2, so it is false as a general statement.',
    },
    {
      id: 's41.we2',
      prompt: 'Show that (x + 3)(x + 2) = x squared + 5x + 6 is an identity.',
      steps: [
        { text: 'Expand the left using the distributive property: x squared + 2x + 3x + 6.', reasoning: 'Expanding is an argument about the expression, not a test at one value, so it covers every value at once.' },
        { text: 'Collect the like terms: 2x + 3x is 5x.', reasoning: 'Collecting rewrites the expression without changing what it equals for any value.' },
        { text: 'The result matches the right side exactly.', reasoning: 'Two expressions reached by valid rewriting are equal for every value, which is what identity means.' },
      ],
      answer: 'It is an identity, established by derivation rather than by testing values.',
    },
    {
      id: 's41.we3',
      prompt: 'A student checks x squared = 4x at x = 0 and x = 4, finds both work, and calls it an identity. What is wrong?',
      steps: [
        { text: 'Both chosen values do satisfy the statement.', reasoning: 'They are its two solutions, so the checks succeed without telling you anything general.' },
        { text: 'Try x = 1: the left is 1 and the right is 4.', reasoning: 'Testing a value that is not a solution exposes the difference immediately.' },
        { text: 'Agreeing at some values is what an equation does.', reasoning: 'An identity must hold at every value, so examples can support a guess but never establish one.' },
      ],
      answer: 'It is an equation with solutions 0 and 4, not an identity.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's41.g1',
      prompt: 'Is 2(x + 5) = 2x + 10 an identity or an equation?',
      hint: 'Expand the left and compare.',
      answer: 'An identity',
      rationale: 'The distributive property makes the two sides the same expression, so they agree for every x.',
    },
    {
      id: 's41.g2',
      prompt: 'How many values must you test to refute a claimed identity?',
      hint: 'What does a single failure prove?',
      answer: 'One',
      rationale: 'A single value where the two sides differ makes the general claim false.',
    },
    {
      id: 's41.g3',
      prompt: 'Why does testing three values not establish an identity?',
      hint: 'Could a false statement pass three tests?',
      answer: 'Because infinitely many values remain untested.',
      rationale: 'An equation can be true at several values; only an argument covering all values establishes an identity.',
    },
  ],
  independentPractice: [
    {
      id: 's41.i1',
      prompt: 'Classify each as identity or equation: 3x = 12; x + x = 2x; (x − 1) squared = x squared − 2x + 1.',
      answer: 'Equation; identity; identity.',
      rationale: 'The first constrains x; the other two can be derived for every value.',
    },
    {
      id: 's41.i2',
      prompt: 'Refute the claim that the square root of x squared equals x for every x, with one value.',
      answer: 'At x = −3 the left is 3 and the right is −3.',
      rationale: 'A single counterexample is enough against a universal claim.',
    },
    {
      id: 's41.i3',
      prompt: 'Explain why an identity can be used to rewrite an expression without knowing the value of the variable.',
      answer: 'Because it holds for every value, so no value needs checking.',
      rationale: 'That is exactly what proving it for all values licenses.',
    },
  ],
  reasoningApplication: [
    {
      id: 's41.r1',
      prompt: 'To establish an identity you need an argument; to refute one you need a single value. Explain why the two tasks are so unequal, and what that means for how you should test a claim you are unsure about.',
      expectedReasoning:
        'A universal claim makes infinitely many assertions, so no finite set of checks can confirm it, while one failure contradicts it outright. A strong answer concludes the practical strategy: hunt for a counterexample first, since it is cheap and decisive, and derive only once you believe the claim.',
    },
  ],
  interactivePractice: [],
  summary:
    'An identity is true for every value; an equation only for particular ones. Establishing an identity needs a derivation covering all values, while one counterexample refutes it.',
  nextStep:
    'Next you will justify the square identities from an area picture, so that they are seen rather than recalled.',
  teacher: {
    objective: 'Students distinguish identity from equation and test claims appropriately.',
    prerequisiteKnowledge: ['Substitution', 'Expanding a product'],
    modelLanguage: ['Is this true for every value, or only some?', 'What would a counterexample look like?'],
    teachingNotes: [
      'The asymmetry between proving and refuting is the lesson. Ask for a counterexample before any derivation.',
      'Students check the value that happens to be the solution. Choose test values deliberately, including awkward ones such as 0 and −1.',
    ],
    quickChecks: ['Identity or equation?', 'How many values settle this?'],
    supportForStrugglingLearners: [
      'Make a two-row substitution table for both sides before deciding anything.',
      'Expand the left and right separately and compare term by term.',
    ],
    extension: ['Ask for an equation that happens to be true at every integer but fails elsewhere.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_4_2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s4_2_lesson',
  contentArtifactVersion: 1,
  source: source('4.2', 'Visualising Identities', 2, 'ncert_iemh1_s4_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s4_1'],
    mayAssume: ['Identity versus equation', 'Area of a rectangle and a square', 'Class 8 square identities'],
    mustNotIntroduce: [{ concept: 'Factorising with the square identities', belongsToSection: 'ncert_iemh1_s4_3' }, { concept: 'The three-term square', belongsToSection: 'ncert_iemh1_s4_4' }],
  },
  learningGoal:
    'You will justify the square identities from an area picture, and say which part of the picture each term of the expansion corresponds to.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the area of a rectangle from its sides.', 'Expand (a + b)(a + b) by the distributive property.', 'State what an identity claims.'],
    ifNotReady: 'Revisit expanding a product of two brackets; the picture and the algebra must agree term by term.',
  },
  vocabulary: [
    { term: 'area model', meaning: 'A picture in which an area represents a product of two expressions.' },
    { term: 'expansion', meaning: 'Rewriting a product as a sum of terms.' },
  ],
  explanation: [
    'Draw a square of side a + b. Cut it with one horizontal and one vertical line so that the pieces have sides a and b. Four regions appear: a square of side a, two rectangles each a by b, and a square of side b.',
    'The whole square has area (a + b) squared. The four pieces have areas a squared, ab, ab and b squared. The pieces make up the whole, so (a + b) squared = a squared + 2ab + b squared — and now each term has a region you can point at. The 2ab is two rectangles, not a doubling rule to remember.',
    'The difference identity needs more care, because you cannot cut off a negative length. Start from a square of side a and remove a strip of width b from two adjacent sides. You have removed ab twice, but the small corner of area b squared was removed twice over, so it must be added back once: (a − b) squared = a squared − 2ab + b squared.',
    'The picture is a justification, not a decoration, and it has limits. It argues for positive a and b. The algebraic expansion covers every value including negatives, which is why both treatments appear: the picture explains and the algebra proves.',
    'Once the identity is established it works in both directions. Seen as a rule for expanding it saves effort; seen backwards it lets you recognise a squared expression, which is the whole of the next lesson.',
  ],
  representations: ['A square of side a + b cut into four labelled regions', 'The four regions matched to the four terms of the expansion'],
  visuals: [F_SQUARE],
  visualsById: { F_SQUARE },
  workedExamples: [
    {
      id: 's42.we1',
      prompt: 'Use the area picture to write (a + b) squared, naming the region for each term.',
      steps: [
        { text: 'The whole square has side a + b, so its area is (a + b) squared.', reasoning: 'The side length determines the area of the whole, which is the left-hand side of the identity.' },
        { text: 'The large shaded region is a square of side a, giving a squared.', reasoning: 'The horizontal and vertical cuts were made at distance a from one corner, so that piece is a by a.' },
        { text: 'The two rectangles are each a by b, so together 2ab.', reasoning: 'They are congruent, which is where the 2 comes from; it is counted, not recalled.' },
        { text: 'The small square is b by b, giving b squared.', reasoning: 'The remaining corner piece has both sides equal to b.' },
      ],
      answer: '(a + b) squared = a squared + 2ab + b squared, with one region for each term.',
      visualRef: 'F_SQUARE',
    },
    {
      id: 's42.we2',
      prompt: 'Expand (x + 7) squared using the identity, and check at x = 1.',
      steps: [
        { text: 'Match a to x and b to 7.', reasoning: 'An identity holds for every value, so any expressions may be substituted for a and b.' },
        { text: 'The expansion is x squared + 2 times 7 times x + 49, which is x squared + 14x + 49.', reasoning: 'Substituting into the established identity rather than re-expanding from scratch is the point of having it.' },
        { text: 'At x = 1: the left is 8 squared = 64, and the right is 1 + 14 + 49 = 64.', reasoning: 'A check at one value does not prove the identity but catches an arithmetic slip.' },
      ],
      answer: 'x squared + 14x + 49.',
    },
    {
      id: 's42.we3',
      prompt: 'Why does the difference picture need the small square added back?',
      steps: [
        { text: 'Removing a strip of width b from one side removes ab.', reasoning: 'That strip runs the full length a, so its area is a times b.' },
        { text: 'Removing a second strip from an adjacent side removes another ab.', reasoning: 'Two removals of ab is where the 2ab comes from.' },
        { text: 'The corner square of side b lies in both strips, so it has been removed twice.', reasoning: 'Subtracting it twice takes away more than was actually there.' },
        { text: 'Adding b squared back once restores the correct total.', reasoning: 'Which is exactly the + b squared in the identity.' },
      ],
      answer: 'Because the corner is subtracted twice and must be restored once, giving a squared − 2ab + b squared.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's42.g1',
      prompt: 'In the area picture, which region gives the term 2ab?',
      hint: 'How many rectangles of that shape are there?',
      answer: 'The two a-by-b rectangles',
      rationale: 'They are congruent, so their total area is 2ab; the coefficient is a count.',
    },
    {
      id: 's42.g2',
      prompt: 'Expand (m + 4) squared.',
      hint: 'Match a to m and b to 4 in the identity.',
      answer: 'm squared + 8m + 16',
      rationale: 'Twice m times 4 is 8m, and 4 squared is 16.',
    },
    {
      id: 's42.g3',
      prompt: 'Why does the area picture not by itself prove the identity for negative values?',
      hint: 'Can a length be negative?',
      answer: 'Because an area argument assumes positive lengths.',
      rationale: 'The algebraic expansion covers all values; the picture explains why the result looks as it does.',
    },
  ],
  independentPractice: [
    {
      id: 's42.i1',
      prompt: 'Expand (2y + 3) squared.',
      answer: '4y squared + 12y + 9.',
      rationale: 'Here a is 2y, so a squared is 4y squared and 2ab is 12y.',
    },
    {
      id: 's42.i2',
      prompt: 'Expand (p − 5) squared and name which term the corner square contributes.',
      answer: 'p squared − 10p + 25; the corner contributes +25.',
      rationale: 'The corner is subtracted twice by the two strips and added back once.',
    },
    {
      id: 's42.i3',
      prompt: 'Explain in one sentence why the middle term has a coefficient of 2.',
      answer: 'Because two congruent rectangles of area ab appear.',
      rationale: 'The 2 is a count of regions, not an arbitrary rule.',
    },
  ],
  reasoningApplication: [
    {
      id: 's42.r1',
      prompt: 'The area picture justifies the identity for positive lengths while the algebra covers every value. Does that make the picture unnecessary? Argue for what each contributes.',
      expectedReasoning:
        'The algebra proves and the picture explains: it shows where each term comes from and why the middle coefficient is 2, which the expansion alone does not reveal. A strong answer resists dismissing either, and notes that a student who has only the expansion can still not say why 2ab is not ab.',
    },
  ],
  interactivePractice: [],
  summary:
    'A square of side a + b splits into four regions whose areas are exactly the four terms of the expansion. The picture explains the identity for positive lengths; the algebraic expansion establishes it for every value.',
  nextStep:
    'Next you will read the same identities backwards, to recognise and factorise squared expressions.',
  teacher: {
    objective: 'Students justify the square identities from an area model and match regions to terms.',
    prerequisiteKnowledge: ['Area of rectangles', 'Expanding brackets'],
    modelLanguage: ['Which region is this term?', 'Why is the middle coefficient 2?'],
    teachingNotes: [
      'The subtract-twice-add-back argument for the difference case repays slow treatment; it is where the picture does real work.',
      'State the limitation of the area argument explicitly. Students should know why the algebraic expansion is still needed.',
    ],
    quickChecks: ['Which region gives 2ab?', 'Does the picture cover negative values?'],
    supportForStrugglingLearners: [
      'Cut the four regions from paper and reassemble them into the large square.',
      'Label every region with both its sides and its area.',
    ],
    extension: ['Ask what picture would justify (a + b + c) squared, as preparation for §4.4.'],
    materialsNeeded: ['Squared paper', 'Scissors', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_4_3: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s4_3_lesson',
  contentArtifactVersion: 1,
  source: source('4.3', 'Factorisation of Algebraic Expressions Using Identities', 5, 'ncert_iemh1_s4_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s4_2'],
    mayAssume: ['The square identities and their area justification', 'Common factors', 'Recognising a perfect square number'],
    mustNotIntroduce: [{ concept: 'The three-term square', belongsToSection: 'ncert_iemh1_s4_4' }, { concept: 'Factorising with algebra tiles', belongsToSection: 'ncert_iemh1_s4_5' }],
  },
  learningGoal:
    'You will recognise an expression as a square or a difference of squares, factorise it, and take out a common factor first where that reveals the structure.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Expand (a + b) squared and (a − b) squared from memory of the identity.', 'Find the highest common factor of two terms.', 'Recognise square numbers up to 400.'],
    ifNotReady: 'Make sure the square identities are secure in the expanding direction; this lesson runs them backwards.',
  },
  vocabulary: [
    { term: 'factorise', meaning: 'Write an expression as a product.' },
    { term: 'perfect square', meaning: 'An expression that is something squared.' },
    { term: 'difference of squares', meaning: 'An expression of the form one square minus another.' },
  ],
  explanation: [
    'Expanding turns a product into a sum. Factorising reverses it, and the identities you already have become recognition tools: if an expression has the shape of an expansion, it came from the corresponding product.',
    'For a square, look for three terms where the first and last are squares and the middle is twice the product of their roots. In 25p squared + 30pq + 9q squared, the roots are 5p and 3q, and twice 5p times 3q is 30pq. The middle term matching is the check that makes it a square: without it the expression is something else.',
    'For a difference of squares, look for one square minus another, and factorise as the sum times the difference. In 49m squared − 16, the roots are 7m and 4, giving (7m + 4)(7m − 4). Note there is no sum-of-squares counterpart; x squared + 9 does not factorise this way, and trying is a common dead end.',
    'Always look for a common factor first. In 2x squared − 18, nothing matches an identity as written, but taking out 2 leaves 2(x squared − 9), and the bracket is now a clear difference of squares: 2(x + 3)(x − 3). Skipping the common factor hides the structure.',
    'Checking is cheap. Expand what you wrote and see whether you get back the original expression. A factorisation that does not expand back is wrong, however plausible it looked.',
  ],
  representations: ['An expression annotated with the roots of its first and last terms', 'The middle-term check written out before factorising'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's43.we1',
      prompt: 'Factorise 9x squared + 24x + 16.',
      steps: [
        { text: 'The first term is (3x) squared and the last is 4 squared.', reasoning: 'Identifying the roots is what makes the square identity a candidate.' },
        { text: 'Check the middle: twice 3x times 4 is 24x, which matches.', reasoning: 'This check is what distinguishes a perfect square from a general three-term expression.' },
        { text: 'So the expression is (3x + 4) squared.', reasoning: 'The sign of the middle term is positive, so the bracket carries a plus.' },
      ],
      answer: '(3x + 4) squared.',
    },
    {
      id: 's43.we2',
      prompt: 'Factorise 50y squared − 32.',
      steps: [
        { text: 'Neither term is a perfect square as written, since 50 and 32 are not squares.', reasoning: 'Checking before reaching for an identity saves a wrong turn.' },
        { text: 'Take out the common factor 2: 2(25y squared − 16).', reasoning: 'A common factor often uncovers a structure that was hidden.' },
        { text: 'Inside, 25y squared is (5y) squared and 16 is 4 squared.', reasoning: 'Now the difference-of-squares shape is visible.' },
        { text: 'So the factorisation is 2(5y + 4)(5y − 4).', reasoning: 'The common factor stays outside the product.' },
      ],
      answer: '2(5y + 4)(5y − 4).',
    },
    {
      id: 's43.we3',
      prompt: 'A student factorises x squared + 6x + 10 as (x + 3) squared. Check it.',
      steps: [
        { text: 'Expand (x + 3) squared: x squared + 6x + 9.', reasoning: 'Expanding back is the direct test of any factorisation.' },
        { text: 'The constant is 9, but the expression has 10.', reasoning: 'The middle term matched but the last did not, so the expression was never a perfect square.' },
        { text: 'Checking the last term against the square of the root would have caught it first.', reasoning: 'For a square, all three terms must agree, not just the middle one.' },
      ],
      answer: 'Wrong. x squared + 6x + 10 is not a perfect square; the check is that all three terms must match.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's43.g1',
      prompt: 'Factorise x squared − 49.',
      hint: 'Is each term a square?',
      answer: '(x + 7)(x − 7)',
      rationale: 'A difference of squares factorises as the sum times the difference.',
    },
    {
      id: 's43.g2',
      prompt: 'Is 4a squared + 20a + 25 a perfect square?',
      hint: 'Check the middle term against twice the product of the roots.',
      answer: 'Yes, (2a + 5) squared',
      rationale: 'Twice 2a times 5 is 20a, which matches the middle term.',
    },
    {
      id: 's43.g3',
      prompt: 'Why factor out 3 from 3x squared − 27 before anything else?',
      hint: 'What shape does the bracket take once 3 is removed?',
      answer: 'Because it leaves a clear difference of squares.',
      rationale: '3(x squared − 9) factorises further to 3(x + 3)(x − 3); without the common factor the shape is hidden.',
    },
  ],
  independentPractice: [
    {
      id: 's43.i1',
      prompt: 'Factorise 16t squared − 81.',
      answer: '(4t + 9)(4t − 9).',
      rationale: 'Both terms are squares, so the difference identity applies.',
    },
    {
      id: 's43.i2',
      prompt: 'Factorise 2m squared + 12m + 18 completely.',
      answer: '2(m + 3) squared.',
      rationale: 'Removing the common 2 leaves a perfect square.',
    },
    {
      id: 's43.i3',
      prompt: 'Explain why x squared + 16 cannot be factorised by these identities.',
      answer: 'Because there is no sum-of-squares identity.',
      rationale: 'Only a difference of squares factorises this way.',
    },
  ],
  reasoningApplication: [
    {
      id: 's43.r1',
      prompt: 'For a three-term expression, you check the first and last terms are squares and that the middle is twice the product of their roots. Explain why all three checks are needed, using an expression that passes two of them.',
      expectedReasoning:
        'Each check rules out a different failure. x squared + 6x + 10 passes the first-term and middle-term checks but fails the last, and x squared + 5x + 4 has square ends but the wrong middle. A strong answer supplies such an expression and shows the expansion that exposes it.',
    },
  ],
  interactivePractice: [],
  summary:
    'An expression is a perfect square when both end terms are squares and the middle is twice the product of their roots, and a difference of squares factorises as the sum times the difference. Take out a common factor first, and check by expanding back.',
  nextStep:
    'Next you will extend the square identity to three terms and use it to compute squares efficiently.',
  teacher: {
    objective: 'Students factorise using the square and difference identities, with the common factor removed first.',
    prerequisiteKnowledge: ['Square identities', 'Common factors'],
    modelLanguage: ['Are both end terms squares?', 'Does the middle term match twice the product?'],
    teachingNotes: [
      'The middle-term check is what separates recognition from guessing. Require it in writing before any bracket is produced.',
      'The absence of a sum-of-squares identity should be stated explicitly; students will otherwise invent one by symmetry.',
    ],
    quickChecks: ['Perfect square or not — how do you know?', 'Did you check by expanding back?'],
    supportForStrugglingLearners: [
      'Write the roots of the first and last terms above them before deciding.',
      'Keep a worked non-example visible, so the check has something to catch.',
    ],
    extension: ['Ask for a value of k making x squared + kx + 36 a perfect square, and how many answers there are.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_4_4: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s4_4_lesson',
  contentArtifactVersion: 1,
  source: source('4.4', 'More Identities', 8, 'ncert_iemh1_s4_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s4_2'],
    mayAssume: ['The two-term square identity', 'Substituting an expression for a letter', 'Computing squares of numbers'],
    mustNotIntroduce: [{ concept: 'Factorising with algebra tiles', belongsToSection: 'ncert_iemh1_s4_5' }, { concept: 'The cube identities', belongsToSection: 'ncert_iemh1_s4_7' }],
  },
  learningGoal:
    'You will derive the square of a three-term sum by reusing the two-term identity, and use it to compute awkward squares efficiently.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Expand (a + b) squared.', 'Substitute an expression, not just a number, for a letter.', 'Write 119 as 100 + 10 + 9.'],
    ifNotReady: 'Make sure you can substitute an expression for a letter; that single move is the whole derivation.',
  },
  vocabulary: [
    { term: 'three-term square', meaning: 'The square of a sum of three quantities.' },
    { term: 'substitution', meaning: 'Replacing a letter by any expression, which an identity permits.' },
  ],
  explanation: [
    'You already have (a + b) squared. What about three terms? Rather than multiply out from scratch, notice that a + b + c is a sum of two things if you group it: a and (b + c).',
    'That is the whole idea. An identity holds for every value, so the letter b may be replaced by any expression at all — including b + c. Applying the two-term identity with a and d = b + c gives a squared + 2ad + d squared, and expanding d squared by the same identity again gives b squared + 2bc + c squared.',
    'Collecting everything: (a + b + c) squared = a squared + b squared + c squared + 2ab + 2bc + 2ca. Three squares and three cross terms, each cross term appearing twice because each pair of the three can be taken in either order.',
    'The picture matches: a square of side a + b + c cuts into nine regions — three squares along the diagonal and three pairs of congruent rectangles. The structure of the formula is a count of regions, as in the two-term case.',
    'It also computes. To square 119, write it as 100 + 10 + 9 and apply the identity: 10000 + 100 + 81 + 2000 + 180 + 1800, which is 14161. That is more arithmetic than a calculator but far less than long multiplication, and it shows the identity doing work rather than sitting in a list.',
  ],
  representations: ['A square of side a + b + c divided into nine regions', 'The derivation shown as one substitution into a known identity'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's44.we1',
      prompt: 'Expand (x + y + 2) squared.',
      steps: [
        { text: 'Match a to x, b to y and c to 2 in the identity.', reasoning: 'An identity permits any expressions in place of its letters, so matching is all that is required.' },
        { text: 'The three squares are x squared, y squared and 4.', reasoning: 'Each letter contributes its own square term.' },
        { text: 'The cross terms are 2xy, 4y and 4x.', reasoning: 'Each is twice a product of a different pair, and 2 times y times 2 is 4y.' },
      ],
      answer: 'x squared + y squared + 4 + 2xy + 4y + 4x.',
    },
    {
      id: 's44.we2',
      prompt: 'Compute 105 squared using the identity.',
      steps: [
        { text: 'Write 105 as 100 + 5, which is only two terms.', reasoning: 'Choosing the split is the decision that makes the arithmetic easy; three terms are not always needed.' },
        { text: 'Apply the two-term identity: 10000 + 2 times 100 times 5 + 25.', reasoning: 'Each piece is now a round number or a small square.' },
        { text: 'Add: 10000 + 1000 + 25.', reasoning: 'The identity has replaced a multiplication with three easy additions.' },
      ],
      answer: '11025.',
    },
    {
      id: 's44.we3',
      prompt: 'Why does each cross term carry a coefficient of 2?',
      steps: [
        { text: 'In the nine-region picture, each pair of letters gives two congruent rectangles.', reasoning: 'One has sides a by b and the other b by a, in different positions.' },
        { text: 'Algebraically, expanding the product gives ab once from each bracket.', reasoning: 'Multiplying out (a+b+c)(a+b+c), the term ab arises twice, from two different pairings.' },
        { text: 'So each pair contributes twice its product.', reasoning: 'The coefficient is a count of occurrences, not a convention.' },
      ],
      answer: 'Because each pair of terms multiplies together twice, once in each order.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's44.g1',
      prompt: 'Expand (p + q + r) squared.',
      hint: 'Three squares and three doubled cross terms.',
      answer: 'p squared + q squared + r squared + 2pq + 2qr + 2rp',
      rationale: 'Each pair of the three letters contributes a doubled product.',
    },
    {
      id: 's44.g2',
      prompt: 'Compute 52 squared using a two-term split.',
      hint: 'Write 52 as 50 + 2.',
      answer: '2704',
      rationale: '2500 + 200 + 4, each piece easy to compute mentally.',
    },
    {
      id: 's44.g3',
      prompt: 'Why may b be replaced by b + c in the two-term identity?',
      hint: 'What does an identity promise about its letters?',
      answer: 'Because an identity holds for every value.',
      rationale: 'Any expression may be substituted, since whatever value it takes the identity already covers it.',
    },
  ],
  independentPractice: [
    {
      id: 's44.i1',
      prompt: 'Expand (2a + b + 3) squared.',
      answer: '4a squared + b squared + 9 + 4ab + 6b + 12a.',
      rationale: 'Here the first letter is 2a, so its square is 4a squared and its cross terms carry the 2.',
    },
    {
      id: 's44.i2',
      prompt: 'Compute 998 squared by writing 998 as 1000 − 2.',
      answer: '996004.',
      rationale: 'Using the difference identity: 1000000 − 4000 + 4.',
    },
    {
      id: 's44.i3',
      prompt: 'Explain how the three-term identity is derived from the two-term one in a single sentence.',
      answer: 'By replacing b with b + c and expanding the resulting square again.',
      rationale: 'Substitution is permitted because an identity holds for every value.',
    },
  ],
  reasoningApplication: [
    {
      id: 's44.r1',
      prompt: 'The three-term identity came from the two-term one by grouping. Describe what you would do for four terms, and whether a new derivation is needed each time.',
      expectedReasoning:
        'Group a + b + c + d as (a + b + c) + d and apply the two-term identity again, expanding the three-term square already known. A strong answer notices the pattern — squares of each term plus twice every pair — and that no genuinely new argument is required, only repeated substitution.',
    },
  ],
  interactivePractice: [],
  summary:
    'Replacing b by b + c in the two-term square identity gives (a + b + c) squared = a squared + b squared + c squared + 2ab + 2bc + 2ca. Each cross term is doubled because each pair multiplies twice, and the identity makes awkward squares easy to compute.',
  nextStep:
    'Next you will build quadratic expressions as rectangles of tiles, and read the factorisation off the arrangement.',
  teacher: {
    objective: 'Students derive the three-term square by substitution and apply it to computation.',
    prerequisiteKnowledge: ['Two-term square identity', 'Substitution'],
    modelLanguage: ['What are we substituting for b?', 'How many times does this pair multiply?'],
    teachingNotes: [
      'The substitution move is the lesson. Students who multiply out from scratch get the right answer and miss the method that generalises.',
      'Do the numerical computation by hand against long multiplication once, so the identity is seen to save work.',
    ],
    quickChecks: ['Why is each cross term doubled?', 'What would you group for four terms?'],
    supportForStrugglingLearners: [
      'Write the grouping brackets explicitly before substituting.',
      'List the three squares first, then the three pairs, so nothing is dropped.',
    ],
    extension: ['Ask how many terms the square of a five-term sum has, and why.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_4_5: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s4_5_lesson',
  contentArtifactVersion: 1,
  source: source('4.5', 'Factorisation Using Algebra Tiles', 11, 'ncert_iemh1_s4_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s4_3'],
    mayAssume: ['Area as a product of two lengths', 'Factorising with the square identities', 'Expanding a product of two brackets'],
    mustNotIntroduce: [{ concept: 'Factorising by comparing coefficients', belongsToSection: 'ncert_iemh1_s4_6' }],
  },
  learningGoal:
    'You will build a quadratic expression as a rectangle of tiles and read its factorisation from the side lengths of that rectangle.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the area of a rectangle from its two sides.', 'Expand (x + 2)(x + 3).', 'Recognise x squared, x and unit pieces as areas.'],
    ifNotReady: 'Revisit area as a product; the tile method only makes sense if a rectangle\'s area is its two sides multiplied.',
  },
  vocabulary: [
    { term: 'algebra tile', meaning: 'A piece whose area represents a term: x by x, x by 1, or 1 by 1.' },
    { term: 'arrangement', meaning: 'A rectangle built from tiles, whose sides give the factors.' },
  ],
  explanation: [
    'Take one tile of size x by x, seven of size x by 1, and twelve unit tiles. Their total area is x squared + 7x + 12. The question is whether they can be arranged into a single rectangle with no gaps and no overlaps.',
    'They can, and only one way: a rectangle with sides x + 3 and x + 4. Its area is the product of its sides, and the same area is the sum of the tiles, so (x + 3)(x + 4) = x squared + 7x + 12. The factorisation is read off the picture rather than computed.',
    'The arrangement also explains where the numbers come from. The twelve unit tiles form a 3 by 4 block, so 3 times 4 is 12; the x tiles split into a row of 3 and a row of 4 along the two sides, so 3 + 4 is 7. The two conditions appear as two features of one rectangle.',
    'Not every collection forms a rectangle. With x squared + 5x + 7 the seven unit tiles cannot be arranged into a block whose sides also account for the five x tiles. The expression does not factorise over whole numbers, and the tiles show that rather than hiding it.',
    'The model has limits worth naming. Negative coefficients need signed tiles and large numbers need impractical piles. It is a way of understanding why factorisation works, and the next lesson replaces it with the algebra that scales.',
  ],
  representations: ['Tiles arranged into a rectangle with its two side lengths marked', 'The unit tiles as a block whose sides are the two numbers'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's45.we1',
      prompt: 'Factorise x squared + 5x + 6 using tiles.',
      steps: [
        { text: 'Collect one x-by-x tile, five x tiles and six unit tiles.', reasoning: 'The collection is exactly what the expression says, term by term.' },
        { text: 'Arrange the six unit tiles into a 2 by 3 block.', reasoning: 'The unit block\'s sides will become the two numbers in the brackets, so its shape is the decision.' },
        { text: 'The x tiles then fill the two strips: two along one side and three along the other.', reasoning: 'Two plus three is five, which uses exactly the x tiles available.' },
        { text: 'The rectangle has sides x + 2 and x + 3.', reasoning: 'Reading the side lengths off the completed rectangle gives the factors directly.' },
      ],
      answer: '(x + 2)(x + 3).',
    },
    {
      id: 's45.we2',
      prompt: 'Can x squared + 4x + 5 be arranged into a rectangle?',
      steps: [
        { text: 'Five unit tiles can only form a 1 by 5 block.', reasoning: 'Five is prime, so no other whole-number rectangle exists.' },
        { text: 'That would need 1 + 5 = 6 x tiles, but only 4 are available.', reasoning: 'The unit block and the x tiles must agree, and here they do not.' },
      ],
      answer: 'No. It does not factorise with whole numbers, and the tiles make the mismatch visible.',
    },
    {
      id: 's45.we3',
      prompt: 'Why do the two sides of the unit block give the two numbers in the brackets?',
      steps: [
        { text: 'The unit block sits in the corner where the two sides overlap.', reasoning: 'Its sides are the constant parts of the two bracket lengths.' },
        { text: 'Each bracket is x plus one of those side lengths.', reasoning: 'The full side of the rectangle is the x tile\'s length plus the units beyond it.' },
        { text: 'So the product of those sides is the constant term, and their sum is the number of x tiles.', reasoning: 'Both conditions come from the same rectangle rather than being two separate rules.' },
      ],
      answer: 'Because they are the constant parts of the two sides, so they multiply to the constant term and add to the x coefficient.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's45.g1',
      prompt: 'Factorise x squared + 7x + 10 with tiles.',
      hint: 'Which block of ten units has sides adding to seven?',
      answer: '(x + 2)(x + 5)',
      rationale: 'Two times five is ten and two plus five is seven, so the 2 by 5 block works.',
    },
    {
      id: 's45.g2',
      prompt: 'How many unit tiles are needed for x squared + 6x + 8?',
      hint: 'Read the constant term.',
      answer: 'Eight',
      rationale: 'The constant term counts the unit tiles exactly.',
    },
    {
      id: 's45.g3',
      prompt: 'Why does a prime constant term limit the arrangements?',
      hint: 'How many rectangles can a prime number of units form?',
      answer: 'Because it gives only one block shape.',
      rationale: 'A prime number of unit tiles forms only a 1 by p block, so only one pair of numbers is possible.',
    },
  ],
  independentPractice: [
    {
      id: 's45.i1',
      prompt: 'Factorise x squared + 8x + 15 using tiles.',
      answer: '(x + 3)(x + 5).',
      rationale: 'The 3 by 5 unit block uses eight x tiles along its sides.',
    },
    {
      id: 's45.i2',
      prompt: 'Show that x squared + 3x + 5 cannot be tiled into a rectangle.',
      answer: 'Five units give only a 1 by 5 block, needing six x tiles rather than three.',
      rationale: 'The two requirements cannot be met together.',
    },
    {
      id: 's45.i3',
      prompt: 'Explain why the tile model becomes impractical for x squared + 40x + 391.',
      answer: 'It would need 391 unit tiles.',
      rationale: 'The model explains the structure but does not scale, which is why the algebraic method follows.',
    },
  ],
  reasoningApplication: [
    {
      id: 's45.r1',
      prompt: 'The tiles require two numbers that multiply to the constant and add to the x coefficient. Explain why those two conditions are not independent, using the rectangle.',
      expectedReasoning:
        'Both come from one rectangle: the unit block\'s sides are the same two numbers that complete the two side lengths, so the product and the sum are two readings of one arrangement. A strong answer sees that this is why finding a pair satisfying both is possible at all, rather than a lucky coincidence.',
    },
  ],
  interactivePractice: [],
  summary:
    'A quadratic expression factorises exactly when its tiles form a rectangle, and the side lengths of that rectangle are the factors. The unit block supplies two numbers that multiply to the constant term and add to the x coefficient.',
  nextStep:
    'Next you will drop the tiles and work the same structure symbolically, which handles cases the tiles cannot.',
  teacher: {
    objective: 'Students factorise quadratics using an area model and explain why the two numerical conditions arise together.',
    prerequisiteKnowledge: ['Area as a product', 'Expanding two brackets'],
    modelLanguage: ['What shape must the unit block be?', 'Do the x tiles match that choice?'],
    teachingNotes: [
      'Let students fail on a non-factorising case before being told. The failed arrangement teaches more than the successful one.',
      'Name the limitations of the model in the lesson itself; otherwise students meet negative coefficients next lesson and think the method broke.',
    ],
    quickChecks: ['How many unit tiles?', 'Which block shape uses all the x tiles?'],
    supportForStrugglingLearners: [
      'Use physical tiles or squared paper cut-outs before any symbols.',
      'Build one worked case together, then change only the constant term.',
    ],
    extension: ['Ask which values of c make x squared + 6x + c tileable, and why only some work.'],
    materialsNeeded: ['Algebra tiles or squared paper', 'Scissors'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_4_6: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s4_6_lesson',
  contentArtifactVersion: 1,
  source: source('4.6', 'Factorisation Without Using Algebra Tiles', 13, 'ncert_iemh1_s4_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s4_5'],
    mayAssume: ['The tile model and what it shows', 'Expanding two brackets', 'Negative numbers'],
    mustNotIntroduce: [{ concept: 'The cube identities', belongsToSection: 'ncert_iemh1_s4_7' }, { concept: 'Simplifying rational expressions', belongsToSection: 'ncert_iemh1_s4_8' }],
  },
  learningGoal:
    'You will factorise a quadratic by comparing coefficients, including cases with negatives and with a leading coefficient other than one.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Expand (x + a)(x + b) and collect terms.', 'List factor pairs of a number, including negative pairs.', 'Explain what the tile rectangle showed.'],
    ifNotReady: 'Practise expanding (x + a)(x + b) symbolically; the method here is that expansion read backwards.',
  },
  vocabulary: [
    { term: 'coefficient comparison', meaning: 'Matching the coefficients of a general expansion to those of the given expression.' },
    { term: 'factor pair', meaning: 'Two numbers whose product is a given number.' },
  ],
  explanation: [
    'Expand (x + a)(x + b) and you get x squared + (a + b)x + ab. That single line is the whole method: the coefficient of x is the sum of the two numbers and the constant is their product.',
    'To factorise x squared + 11x + 24, look for two numbers with product 24 and sum 11. List the factor pairs of 24 and test their sums: 1 and 24 give 25, 2 and 12 give 14, 3 and 8 give 11. Found, so the factorisation is (x + 3)(x + 8).',
    'Signs follow from the same two conditions and are worth reading carefully. A negative constant means the two numbers have opposite signs; a positive constant with a negative middle term means both are negative. For x squared − 7x + 12 the pair is −3 and −4, because their product is positive and their sum negative.',
    'When the leading coefficient is not 1 the comparison changes. For 6x squared + 11x + 3, expanding (px + q)(rx + s) gives prx squared + (ps + qr)x + qs, so now pr must be 6 and qs must be 3 while ps + qr is 11. Testing the few combinations gives (3x + 1)(2x + 3).',
    'This is what the tiles could not do: negatives, large numbers and a leading coefficient. The structure is the same rectangle, but the arithmetic is now carried by the comparison rather than by pieces on a desk.',
  ],
  representations: ['The general expansion written above the given expression, coefficient under coefficient', 'A short list of factor pairs with their sums'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's46.we1',
      prompt: 'Factorise x squared + 9x + 20.',
      steps: [
        { text: 'Compare with x squared + (a + b)x + ab: we need ab = 20 and a + b = 9.', reasoning: 'The general expansion turns factorising into two numerical conditions.' },
        { text: 'List factor pairs of 20: 1 and 20, 2 and 10, 4 and 5.', reasoning: 'Listing systematically avoids missing the pair that works.' },
        { text: 'Their sums are 21, 12 and 9, so 4 and 5 is the pair.', reasoning: 'Testing sums against the required middle coefficient identifies the pair.' },
      ],
      answer: '(x + 4)(x + 5).',
    },
    {
      id: 's46.we2',
      prompt: 'Factorise x squared − 2x − 15.',
      steps: [
        { text: 'We need two numbers with product −15 and sum −2.', reasoning: 'The negative constant tells you the signs differ before any pair is tried.' },
        { text: 'Pairs giving −15: 1 and −15, 3 and −5, 5 and −3, 15 and −1.', reasoning: 'Each pair must be considered in both sign arrangements, since order of signs changes the sum.' },
        { text: 'Sums are −14, −2, 2, 14, so 3 and −5 works.', reasoning: 'Only one pair meets both conditions.' },
      ],
      answer: '(x + 3)(x − 5).',
    },
    {
      id: 's46.we3',
      prompt: 'Factorise 6x squared + 11x + 3.',
      steps: [
        { text: 'Now the leading coefficient is 6, so write (px + q)(rx + s) with pr = 6 and qs = 3.', reasoning: 'Two separate products must be matched rather than one.' },
        { text: 'The middle coefficient is ps + qr, which must be 11.', reasoning: 'This is the condition that picks between the combinations.' },
        { text: 'Try p = 3, r = 2, q = 1, s = 3: ps + qr is 9 + 2 = 11.', reasoning: 'Testing a combination against the middle condition is quicker than expanding each candidate fully.' },
        { text: 'Check by expanding: (3x + 1)(2x + 3) gives 6x squared + 9x + 2x + 3.', reasoning: 'Expanding back confirms the factorisation rather than trusting the search.' },
      ],
      answer: '(3x + 1)(2x + 3).',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's46.g1',
      prompt: 'Factorise x squared + 7x + 12.',
      hint: 'Which pair multiplies to 12 and adds to 7?',
      answer: '(x + 3)(x + 4)',
      rationale: 'Three times four is twelve and three plus four is seven.',
    },
    {
      id: 's46.g2',
      prompt: 'In x squared + 4x − 21, what do the signs tell you before you search?',
      hint: 'What does a negative constant mean for the two numbers?',
      answer: 'They have opposite signs.',
      rationale: 'A negative product requires one positive and one negative number.',
    },
    {
      id: 's46.g3',
      prompt: 'Why does the leading coefficient change the method?',
      hint: 'What must now multiply to give the first term?',
      answer: 'Because the x coefficients in the brackets need not be 1.',
      rationale: 'Two products must be matched, so more combinations have to be tested.',
    },
  ],
  independentPractice: [
    {
      id: 's46.i1',
      prompt: 'Factorise x squared − 11x + 30.',
      answer: '(x − 5)(x − 6).',
      rationale: 'A positive constant with a negative middle term means both numbers are negative.',
    },
    {
      id: 's46.i2',
      prompt: 'Factorise 2x squared + 7x + 6.',
      answer: '(2x + 3)(x + 2).',
      rationale: 'Matching 2 and 6 as the two products, with 4 + 3 giving the middle 7.',
    },
    {
      id: 's46.i3',
      prompt: 'Explain why this method handles cases the tiles cannot.',
      answer: 'Because it needs no physical pieces, so negatives and large numbers are fine.',
      rationale: 'The comparison is arithmetic on coefficients rather than an arrangement of objects.',
    },
  ],
  reasoningApplication: [
    {
      id: 's46.r1',
      prompt: 'Both the tile method and the coefficient comparison solve the same problem. Explain what each makes clear that the other does not, and when you would use which.',
      expectedReasoning:
        'The tiles show why the two conditions arise, as two readings of one rectangle; the comparison can be carried out for any coefficients. A strong answer uses the tiles to understand and the comparison to compute, and notices that the comparison is the expansion of the tile rectangle written symbolically.',
    },
  ],
  interactivePractice: [],
  summary:
    'Expanding (x + a)(x + b) shows that the middle coefficient is a + b and the constant is ab, so factorising means finding a pair meeting both conditions. Signs follow from the two conditions, and a leading coefficient other than one adds a second product to match.',
  nextStep:
    'Next you will extend the identities from squares to cubes.',
  teacher: {
    objective: 'Students factorise quadratics by coefficient comparison, including negative and non-unit leading cases.',
    prerequisiteKnowledge: ['Expanding two brackets', 'Factor pairs', 'Negative numbers'],
    modelLanguage: ['What must the two numbers multiply to, and add to?', 'What do the signs tell you first?'],
    teachingNotes: [
      'Require the sign analysis before the search. Students who search blindly test twice as many pairs and still miss cases.',
      'Connect each step back to the tile rectangle once, then let the symbolic method stand on its own.',
    ],
    quickChecks: ['Product and sum required?', 'Have you expanded back to check?'],
    supportForStrugglingLearners: [
      'List factor pairs in a column with their sums beside them.',
      'Start with positive constants only, then introduce one negative at a time.',
    ],
    extension: ['Ask for all integer values of k for which x squared + kx + 18 factorises.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_4_7_CUBE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s4_7_cube_lesson',
  contentArtifactVersion: 1,
  source: source('4.7', 'Finding New Identities', 15, 'ncert_iemh1_s4_7'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s4_4'],
    mayAssume: ['The square identities', 'Substitution into an identity', 'Volume of a cuboid'],
    mustNotIntroduce: [{ concept: 'Sum and difference of cubes', belongsToSection: 'ncert_iemh1_s4_7' }],
  },
  learningGoal:
    'You will derive the cube of a sum, both algebraically and from a solid cut into pieces, and use it to expand and compute.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Expand (a + b) squared.', 'Multiply an expression by a bracket.', 'Find the volume of a cuboid.'],
    ifNotReady: 'Make sure the square identity is secure; the cube is derived by multiplying it once more.',
  },
  vocabulary: [
    { term: 'cube of a sum', meaning: 'The third power of a sum of two quantities.' },
    { term: 'solid dissection', meaning: 'Cutting a cube into smaller boxes whose volumes are the terms.' },
  ],
  explanation: [
    'A cube is a square multiplied once more by the same bracket. So (a + b) cubed is (a + b) squared times (a + b), and the square is already known: a squared + 2ab + b squared.',
    'Multiply that by (a + b), term by term, and collect: a cubed + 3a squared b + 3ab squared + b cubed. The derivation needs no new idea, only the distributive property applied carefully.',
    'The solid says the same thing. A cube of edge a + b cuts into eight boxes: one cube of edge a, one of edge b, three slabs of a by a by b, and three of a by b by b. The coefficients 3 and 3 are counts of congruent pieces, exactly as the 2 in the square was a count of rectangles.',
    'The difference version follows by replacing b with −b, which an identity permits since it holds for every value: (a − b) cubed = a cubed − 3a squared b + 3ab squared − b cubed. The signs alternate because the odd powers of −b are negative.',
    'It computes as well. For 21 cubed, write 21 as 20 + 1: 8000 + 3 times 400 times 1 + 3 times 20 times 1 + 1, which is 9261. Again the identity replaces a hard multiplication with easy pieces.',
  ],
  representations: ['A cube of edge a + b cut into eight boxes', 'The derivation shown as one more multiplication of the square identity'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's47a.we1',
      prompt: 'Expand (x + 2) cubed.',
      steps: [
        { text: 'Match a to x and b to 2 in the cube identity.', reasoning: 'Any expressions may replace the letters, since the identity holds for every value.' },
        { text: 'The terms are x cubed, 3 times x squared times 2, 3 times x times 4, and 8.', reasoning: 'Each term of the general identity is evaluated with the chosen b.' },
        { text: 'Collect: x cubed + 6x squared + 12x + 8.', reasoning: 'Tidying gives the expansion in standard descending order.' },
      ],
      answer: 'x cubed + 6x squared + 12x + 8.',
    },
    {
      id: 's47a.we2',
      prompt: 'Derive the cube identity by multiplying the square identity by (a + b).',
      steps: [
        { text: 'Write (a + b) squared as a squared + 2ab + b squared.', reasoning: 'The square identity is already established, so it may be used as a starting point.' },
        { text: 'Multiply each term by a: a cubed + 2a squared b + ab squared.', reasoning: 'The distributive property applied to the first part of the bracket.' },
        { text: 'Multiply each term by b: a squared b + 2ab squared + b cubed.', reasoning: 'The same for the second part.' },
        { text: 'Add and collect like terms: 2a squared b + a squared b is 3a squared b.', reasoning: 'Collecting is where the coefficient 3 appears, as a sum rather than a rule.' },
      ],
      answer: 'a cubed + 3a squared b + 3ab squared + b cubed.',
    },
    {
      id: 's47a.we3',
      prompt: 'Expand (y − 3) cubed.',
      steps: [
        { text: 'Use the identity with b replaced by −3.', reasoning: 'Substituting a negative is permitted because the identity covers every value.' },
        { text: 'The terms alternate in sign because odd powers of a negative are negative.', reasoning: '3a squared b becomes −9y squared and b cubed becomes −27.' },
        { text: 'Collect: y cubed − 9y squared + 27y − 27.', reasoning: 'Each coefficient comes from the general identity with the chosen value.' },
      ],
      answer: 'y cubed − 9y squared + 27y − 27.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's47a.g1',
      prompt: 'Expand (m + 1) cubed.',
      hint: 'Use the identity with b = 1.',
      answer: 'm cubed + 3m squared + 3m + 1',
      rationale: 'Every power of 1 is 1, so only the coefficients 3 and 3 remain visible.',
    },
    {
      id: 's47a.g2',
      prompt: 'Where does the coefficient 3 come from in the solid picture?',
      hint: 'How many congruent slabs are there?',
      answer: 'Three congruent slabs of each kind.',
      rationale: 'The coefficient counts pieces, as the 2 did in the square.',
    },
    {
      id: 's47a.g3',
      prompt: 'Why do the signs alternate in (a − b) cubed?',
      hint: 'What happens to odd and even powers of a negative?',
      answer: 'Because odd powers of −b are negative.',
      rationale: 'Even powers become positive again, so the signs alternate term by term.',
    },
  ],
  independentPractice: [
    {
      id: 's47a.i1',
      prompt: 'Expand (2x + 1) cubed.',
      answer: '8x cubed + 12x squared + 6x + 1.',
      rationale: 'Here a is 2x, so a cubed is 8x cubed.',
    },
    {
      id: 's47a.i2',
      prompt: 'Compute 31 cubed using the identity with 30 + 1.',
      answer: '29791.',
      rationale: '27000 + 2700 + 90 + 1.',
    },
    {
      id: 's47a.i3',
      prompt: 'Explain in one sentence how the cube identity is derived from the square one.',
      answer: 'By multiplying the square identity by one more bracket and collecting.',
      rationale: 'No new idea is needed, only the distributive property.',
    },
  ],
  reasoningApplication: [
    {
      id: 's47a.r1',
      prompt: 'The square identity has coefficients 1, 2, 1 and the cube has 1, 3, 3, 1. Predict the coefficients for the fourth power and say how you would verify your prediction.',
      expectedReasoning:
        'Multiplying by one more bracket suggests 1, 4, 6, 4, 1, with each coefficient a sum of two above it. Verification means carrying out the multiplication and collecting, not trusting the pattern. A strong answer distinguishes a conjecture from a derivation.',
    },
  ],
  interactivePractice: [],
  summary:
    'The cube of a sum is the square identity multiplied by one more bracket: a cubed + 3a squared b + 3ab squared + b cubed. The coefficients count congruent pieces of a dissected cube, and replacing b by −b gives the difference version.',
  nextStep:
    'Next you will factorise sums and differences of cubes, which is a different method with different uses.',
  teacher: {
    objective: 'Students derive and apply the cube identities.',
    prerequisiteKnowledge: ['Square identities', 'Distributive property'],
    modelLanguage: ['Where did the 3 come from?', 'What happens when b is negative?'],
    teachingNotes: [
      'Derive rather than present. The coefficients should arrive from collecting like terms, where students can see them being formed.',
      'The solid picture is worth building once with boxes; the count of three slabs is otherwise taken on trust.',
    ],
    quickChecks: ['How is the cube built from the square?', 'Why do signs alternate?'],
    supportForStrugglingLearners: [
      'Multiply the square identity by the bracket in two separate rows before adding.',
      'Use centimetre cubes to assemble the eight pieces.',
    ],
    extension: ['Ask for the coefficients of the fifth power and how they could be checked.'],
    materialsNeeded: ['Centimetre cubes', 'Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_4_7_FACTOR: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s4_7_factor_lesson',
  contentArtifactVersion: 1,
  source: source('4.7', 'Finding New Identities', 15, 'ncert_iemh1_s4_7'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s4_7'],
    mayAssume: ['The cube identities', 'Factorising by recognising a shape', 'The three-term square identity'],
    mustNotIntroduce: [{ concept: 'Simplifying rational expressions', belongsToSection: 'ncert_iemh1_s4_8' }],
  },
  learningGoal:
    'You will factorise a sum or difference of cubes, and combine the three-term square identity with cube results in multi-step problems.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Expand (a + b) cubed.', 'Factorise a difference of squares.', 'Expand (a + b + c) squared.'],
    ifNotReady: 'Make sure you can expand the cube identity; these factorisations are checked by expanding back.',
  },
  vocabulary: [
    { term: 'difference of cubes', meaning: 'An expression of the form one cube minus another.' },
    { term: 'sum of cubes', meaning: 'One cube plus another, which does factorise unlike a sum of squares.' },
  ],
  explanation: [
    'Expanding the cube was one method; factorising a cube is a different one, and the results are worth stating separately. The difference of cubes factorises as x cubed − y cubed = (x − y)(x squared + xy + y squared), and the sum as x cubed + y cubed = (x + y)(x squared − xy + y squared).',
    'Check the first by expanding: x times the bracket gives x cubed + x squared y + xy squared, and −y times it gives −x squared y − xy squared − y cubed. Everything cancels except x cubed − y cubed. The middle terms were designed to cancel, which is why the quadratic bracket has that unusual shape.',
    'Note the contrast with squares. A sum of squares does not factorise, but a sum of cubes does, with a minus sign inside the quadratic bracket. Carrying the square rule across is a common and avoidable error.',
    'These combine with what you already have. If x + y + z and xy + yz + zx are known, then (x + y + z) squared recovers x squared + y squared + z squared, and from there expressions involving cubes can be evaluated without ever finding x, y and z individually.',
    'That is the mark of a usable identity: it lets you compute a quantity from the information you were given, rather than demanding information you do not have.',
  ],
  representations: ['The expansion written out with the middle terms cancelling', 'A chain of identities used to reach a value without solving for the variables'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's47b.we1',
      prompt: 'Factorise 8x cubed − 27.',
      steps: [
        { text: 'Write each term as a cube: 8x cubed is (2x) cubed and 27 is 3 cubed.', reasoning: 'Identifying the cube roots is what makes the identity applicable.' },
        { text: 'Apply the difference of cubes with x replaced by 2x and y by 3.', reasoning: 'The identity holds for any expressions, so substitution is permitted.' },
        { text: 'The factorisation is (2x − 3)(4x squared + 6x + 9).', reasoning: 'The quadratic bracket takes the squares and the product of the two roots, with a plus sign for a difference.' },
      ],
      answer: '(2x − 3)(4x squared + 6x + 9).',
    },
    {
      id: 's47b.we2',
      prompt: 'Factorise p cubed + 64.',
      steps: [
        { text: '64 is 4 cubed, so this is a sum of cubes.', reasoning: 'Recognising the shape determines which of the two identities applies.' },
        { text: 'The first bracket is p + 4.', reasoning: 'For a sum of cubes the linear bracket carries a plus.' },
        { text: 'The second is p squared − 4p + 16.', reasoning: 'For a sum, the middle term of the quadratic bracket is negative — the opposite of the difference case.' },
      ],
      answer: '(p + 4)(p squared − 4p + 16).',
    },
    {
      id: 's47b.we3',
      prompt: 'Given x + y + z = 6 and xy + yz + zx = 11, find x squared + y squared + z squared.',
      steps: [
        { text: 'Square the first: (x + y + z) squared is 36.', reasoning: 'Squaring a known quantity is allowed and brings the wanted terms into play.' },
        { text: 'The three-term identity says that equals the sum of squares plus twice the sum of products.', reasoning: 'This is the identity from §4.4, now used in reverse.' },
        { text: 'So 36 = the sum of squares + 2 times 11.', reasoning: 'Substituting the second given value.' },
        { text: 'The sum of squares is 36 − 22.', reasoning: 'Rearranging gives the wanted quantity without finding x, y or z at all.' },
      ],
      answer: '14.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's47b.g1',
      prompt: 'Factorise x cubed − 1.',
      hint: 'What are the two cube roots?',
      answer: '(x − 1)(x squared + x + 1)',
      rationale: 'A difference of cubes gives a plus inside the quadratic bracket.',
    },
    {
      id: 's47b.g2',
      prompt: 'Does a sum of squares factorise like a sum of cubes?',
      hint: 'Is there an identity for x squared + y squared?',
      answer: 'No.',
      rationale: 'Only the cube version has a sum factorisation; carrying the rule across is the usual error.',
    },
    {
      id: 's47b.g3',
      prompt: 'Why does the quadratic bracket have no coefficient 2 on its middle term?',
      hint: 'Expand and see which terms cancel.',
      answer: 'Because the middle terms are designed to cancel.',
      rationale: 'A coefficient of 2 would leave terms behind instead of cancelling to the two cubes.',
    },
  ],
  independentPractice: [
    {
      id: 's47b.i1',
      prompt: 'Factorise 27a cubed + 8b cubed.',
      answer: '(3a + 2b)(9a squared − 6ab + 4b squared).',
      rationale: 'Cube roots 3a and 2b, with a minus in the quadratic bracket for a sum.',
    },
    {
      id: 's47b.i2',
      prompt: 'Factorise 125 − y cubed.',
      answer: '(5 − y)(25 + 5y + y squared).',
      rationale: 'A difference of cubes with roots 5 and y.',
    },
    {
      id: 's47b.i3',
      prompt: 'Given a + b = 5 and ab = 6, find a squared + b squared without solving for a and b.',
      answer: '13.',
      rationale: 'Squaring a + b gives 25 = a squared + b squared + 12.',
    },
  ],
  reasoningApplication: [
    {
      id: 's47b.r1',
      prompt: 'A sum of squares does not factorise but a sum of cubes does. Verify the cube case by expanding, and explain what makes the two situations different.',
      expectedReasoning:
        'Expanding (x + y)(x squared − xy + y squared) leaves x cubed + y cubed because the middle terms cancel in pairs. With squares there is no third factor available to arrange such cancellation. A strong answer argues from the expansion rather than asserting the rule.',
    },
  ],
  interactivePractice: [],
  summary:
    'A difference of cubes factorises as (x − y)(x squared + xy + y squared) and a sum as (x + y)(x squared − xy + y squared), the middle terms being arranged to cancel. Combined with the three-term square, these let you evaluate expressions from given sums and products.',
  nextStep:
    'Next you will use everything from this chapter to simplify algebraic fractions.',
  teacher: {
    objective: 'Students factorise sums and differences of cubes and combine identities in multi-step problems.',
    prerequisiteKnowledge: ['Cube identities', 'Factorising by recognition'],
    modelLanguage: ['Which of the two cube identities applies?', 'What sign goes in the quadratic bracket?'],
    teachingNotes: [
      'The sign inside the quadratic bracket is opposite to the sign between the cubes. Make students state it before writing.',
      'The multi-step problems are where identities stop being a list and become a method. Give at least one in every lesson from here.',
    ],
    quickChecks: ['Sum or difference of cubes?', 'Does a sum of squares factorise?'],
    supportForStrugglingLearners: [
      'Expand each factorisation back once, so the cancellation is seen rather than trusted.',
      'Write the cube roots above the terms before applying the identity.',
    ],
    extension: ['Ask whether a difference of fourth powers factorises, and in how many ways.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_4_8: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s4_8_lesson',
  contentArtifactVersion: 1,
  source: source('4.8', 'Simplifying Rational Expressions', 19, 'ncert_iemh1_s4_8'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s4_7'],
    mayAssume: ['Factorising with the square, cube and coefficient methods', 'Equivalent fractions', 'Cancelling common factors in numerical fractions'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will simplify an algebraic fraction by factorising numerator and denominator and cancelling common factors, and state when the simplification is valid.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Factorise x squared − 9 and x squared + 5x + 6.', 'Simplify a numerical fraction by cancelling.', 'Say what makes a fraction undefined.'],
    ifNotReady: 'Revisit factorising; a fraction cannot be simplified until both parts are products.',
  },
  vocabulary: [
    { term: 'rational expression', meaning: 'A fraction whose numerator and denominator are polynomials.' },
    { term: 'common factor', meaning: 'A factor appearing in both numerator and denominator.' },
    { term: 'undefined', meaning: 'Having no value, as when a denominator is zero.' },
  ],
  explanation: [
    'A numerical fraction simplifies by cancelling a common factor: 12 over 18 is 2 over 3 because both share 6. An algebraic fraction works the same way, but you must factorise first, since you can only cancel factors — things multiplied — and never individual terms.',
    'Take x squared − 9 over x squared + 5x + 6. Factorise both: the top is (x + 3)(x − 3) and the bottom is (x + 2)(x + 3). The common factor (x + 3) cancels, leaving (x − 3) over (x + 2).',
    'The commonest error in all of algebra lives here. In (x + 3) over (x + 2) nothing cancels, because the 3 and the 2 are terms inside sums, not factors of the whole. Cancelling them would be like claiming 7 over 5 equals 1 over nothing.',
    'There is a condition attached, and it matters. Cancelling (x + 3) assumes it is not zero, so the simplification holds for every x except −3. At x = −3 the original fraction is 0 over 0, which has no value, while the simplified form gives −6 over −1 = 6. The two expressions agree everywhere the original is defined, and that is the honest statement.',
    'So the method is: factorise fully, cancel whole factors, and state the values excluded. Each part matters — the first makes cancelling possible, the second keeps it valid, and the third keeps the claim true.',
  ],
  representations: ['Numerator and denominator written as products, one above the other', 'The excluded values noted beside the simplified form'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's48.we1',
      prompt: 'Simplify x squared − 16 over x squared − x − 12.',
      steps: [
        { text: 'Factorise the numerator as a difference of squares: (x + 4)(x − 4).', reasoning: 'Both terms are squares, so the difference identity applies.' },
        { text: 'Factorise the denominator: two numbers with product −12 and sum −1 are 3 and −4, giving (x + 3)(x − 4).', reasoning: 'The coefficient comparison from §4.6 handles the signs.' },
        { text: 'Cancel the common factor (x − 4).', reasoning: 'Only whole factors may be cancelled, and this one appears in both products.' },
        { text: 'State the restriction: x cannot be 4, since that made the original denominator zero.', reasoning: 'The simplified form is defined there but the original is not, so the equality needs the exclusion.' },
      ],
      answer: '(x + 4) over (x + 3), for x not equal to 4.',
    },
    {
      id: 's48.we2',
      prompt: 'A student simplifies (x + 5) over (x + 10) to 1 over 2. Check it.',
      steps: [
        { text: 'Test at x = 0: the original is 5 over 10, which is one half.', reasoning: 'One agreement is not a proof, so test a second value.' },
        { text: 'Test at x = 5: the original is 10 over 15, which is two thirds, not one half.', reasoning: 'A single disagreement refutes the claimed simplification.' },
        { text: 'The 5 and the 10 are terms, not factors.', reasoning: 'Cancelling requires factors of the whole numerator and denominator.' },
      ],
      answer: 'Wrong. Nothing cancels, because 5 and 10 are not factors.',
    },
    {
      id: 's48.we3',
      prompt: 'Simplify 2x squared + 6x over x squared + 3x.',
      steps: [
        { text: 'Factorise the numerator: 2x(x + 3).', reasoning: 'Taking out the common factor first exposes the structure, as in §4.3.' },
        { text: 'Factorise the denominator: x(x + 3).', reasoning: 'The same common-factor move applies.' },
        { text: 'Cancel x and (x + 3), leaving 2 over 1.', reasoning: 'Both are whole factors appearing in each product.' },
        { text: 'Exclude x = 0 and x = −3.', reasoning: 'Both make the original denominator zero, so neither may be substituted into the original.' },
      ],
      answer: '2, for x not equal to 0 or −3.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's48.g1',
      prompt: 'Simplify x squared − 25 over x + 5.',
      hint: 'Factorise the numerator first.',
      answer: 'x − 5, for x not equal to −5.',
      rationale: 'The difference of squares shares the factor (x + 5) with the denominator.',
    },
    {
      id: 's48.g2',
      prompt: 'Why can nothing be cancelled in (x + 7) over (x + 2)?',
      hint: 'Are 7 and 2 factors or terms?',
      answer: 'Because they are terms, not factors.',
      rationale: 'Cancelling applies only to whole factors of the numerator and denominator.',
    },
    {
      id: 's48.g3',
      prompt: 'Why must x = 4 be excluded after cancelling (x − 4)?',
      hint: 'What is the original fraction worth at x = 4?',
      answer: 'Because the original is undefined there.',
      rationale: 'The simplified form has a value at 4 but the original does not, so the equality holds only elsewhere.',
    },
  ],
  independentPractice: [
    {
      id: 's48.i1',
      prompt: 'Simplify x squared + 7x + 12 over x squared + 2x − 8.',
      answer: '(x + 3) over (x − 2), for x not equal to −4.',
      rationale: 'Both factorise with a common (x + 4).',
    },
    {
      id: 's48.i2',
      prompt: 'Simplify 3x squared − 27 over x squared + 3x.',
      answer: '3(x − 3) over x, for x not equal to 0 or −3.',
      rationale: 'Take out 3 from the numerator and x from the denominator before cancelling (x + 3).',
    },
    {
      id: 's48.i3',
      prompt: 'Explain why cancelling a term rather than a factor changes the value of an expression.',
      answer: 'Because the term is part of a sum, not something the whole is multiplied by.',
      rationale: 'Removing part of a sum changes what the sum is, while removing a shared factor does not change the quotient.',
    },
  ],
  reasoningApplication: [
    {
      id: 's48.r1',
      prompt: 'After cancelling, the simplified expression has a value at a point where the original has none. Explain how both can be correct, and how you would state the result honestly.',
      expectedReasoning:
        'They are equal at every value where the original is defined, and the excluded point must be stated alongside the simplified form. A strong answer sees that simplification does not change the expression\'s value but can change its domain, and that omitting the exclusion makes the claim false at one point.',
    },
  ],
  interactivePractice: [],
  summary:
    'Simplify an algebraic fraction by factorising numerator and denominator fully, cancelling whole factors only, and stating the values that must be excluded. Terms inside a sum never cancel.',
  nextStep:
    'That completes the chapter: identities established, used to factorise, and now used to simplify.',
  teacher: {
    objective: 'Students simplify rational expressions and state the excluded values.',
    prerequisiteKnowledge: ['Factorising', 'Equivalent fractions'],
    modelLanguage: ['Is that a factor or a term?', 'Which values must be excluded?'],
    teachingNotes: [
      'The term-versus-factor error is the most persistent in the chapter. Catch it with a substitution test rather than a rule.',
      'Require the exclusion every time. Students treat it as pedantry until shown the 0 over 0 case explicitly.',
    ],
    quickChecks: ['Can you cancel that?', 'What is excluded, and why?'],
    supportForStrugglingLearners: [
      'Draw a box around each whole factor before cancelling anything.',
      'Test a claimed cancellation at two values before accepting it.',
    ],
    extension: ['Ask for a fraction that simplifies to a constant, and what that says about its two parts.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

/** Wave-1 chapter 4, in the book's order. Nine lessons from eight sections,
 *  with §4.7 split into the cube expansion and the cube factorisations. */
export function identitiesChapterSections(): AuthoredSection[] {
  return [
    SECTION_4_1,
    SECTION_4_2,
    SECTION_4_3,
    SECTION_4_4,
    SECTION_4_5,
    SECTION_4_6,
    SECTION_4_7_CUBE,
    SECTION_4_7_FACTOR,
    SECTION_4_8,
  ];
}
