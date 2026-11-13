// ===========================================================================
// v0.84.0-c10.4 checkpoint 58 — CLASS 10 QUADRATIC EQUATIONS.
//
// No representation frontier here. The risk is fidelity: every factorisation
// must expand back, every stated root must satisfy its equation, every
// discriminant must match the number of roots claimed, and the formula and
// the factorisation must agree.
//
// And one boundary that is not arithmetic. The current scope is REAL roots,
// so a negative discriminant means "no real roots" — not "no solution". The
// stronger sentence is false once complex numbers exist, and a student who
// learns it has to unlearn it. `auditRealRootScope` enforces the wording
// without banning the word.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §4.2
// (folio 39), §4.3 (folio 42) and §4.4 (folio 44).
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const QUADRATIC_CHAPTER_ID = 'ncert_jemh1_ch04';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: QUADRATIC_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

/** A rectangle whose sides carry the contextual relationship. */
const F_AREA_RECT: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_definition',
  status: 'concept_specific',
  points: [
    { id: 'a', x: 0, y: 0, label: 'A' },
    { id: 'b', x: 8, y: 0, label: 'B' },
    { id: 'c', x: 8, y: 3, label: 'C' },
    { id: 'd', x: 0, y: 3, label: 'D' },
  ],
  segments: [
    { from: 'a', to: 'b', label: 'x + 5' },
    { from: 'b', to: 'c', label: 'x' },
    { from: 'c', to: 'd' },
    { from: 'd', to: 'a' },
  ],
  angleMarks: [{ at: 'a', from: 'b', to: 'd', right: true }],
  caption: 'A rectangle whose length exceeds its breadth by 5.',
  altText:
    'A rectangle ABCD with a right angle marked at A. The horizontal side AB is labelled x plus 5 and the vertical side BC is labelled x, so the length is 5 more than the breadth. Writing the area as the product of these two expressions and setting it equal to a given number produces a quadratic equation in x.',
};

export const C10_SECTION_4_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s4_2_standard_form_lesson',
  contentArtifactVersion: 1,
  source: source('4.2', 'Quadratic Equations', 39, 'ncert_jemh1_s4_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Expanding a product of two linear expressions', 'Collecting like terms', 'Degree of a polynomial'],
    mustNotIntroduce: [
      { concept: 'Solving by factorisation', belongsToSection: 'ncert_jemh1_s4_3' },
      { concept: 'The discriminant', belongsToSection: 'ncert_jemh1_s4_4' },
    ],
  },
  learningGoal:
    'You will recognise a quadratic equation in standard form, test whether an equation is quadratic after simplifying it, and form one from a described situation.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Expand a product such as (x + 3)(x - 2).',
      'Collect like terms and write a polynomial in descending powers.',
      'Say what the degree of a polynomial is.',
    ],
    ifNotReady: 'Revise expanding brackets. Deciding whether an equation is quadratic almost always means simplifying it first.',
  },
  vocabulary: [
    { term: 'quadratic equation', meaning: 'An equation that can be written as ax\u00b2 + bx + c = 0 with a not equal to 0.' },
    { term: 'standard form', meaning: 'The arrangement ax\u00b2 + bx + c = 0, with everything on one side and the powers in descending order.' },
    { term: 'quadratic expression', meaning: 'The expression ax\u00b2 + bx + c on its own, with no equals sign.' },
    { term: 'root', meaning: 'A value of the variable that makes the equation true when substituted into it.' },
    { term: 'coefficient', meaning: 'The number multiplying a power of the variable \u2014 a, b and c in the standard form.' },
  ],
  explanation: [
    'A quadratic equation is one that can be written as ax\u00b2 + bx + c = 0, where a, b and c are real numbers and a is not 0. The condition on a is not a technicality: if a were 0 the x\u00b2 term would vanish and the equation would be linear, which behaves quite differently.',
    'Three words are easy to blur and worth keeping apart. A quadratic EXPRESSION is ax\u00b2 + bx + c on its own. A quadratic EQUATION sets such an expression equal to 0. A ROOT is a number that makes the equation true. An expression has no roots, because there is nothing for a value to make true.',
    'Deciding whether an equation is quadratic usually needs work first. The equation x(x + 3) = x\u00b2 + 7 looks quadratic, but expanding gives x\u00b2 + 3x = x\u00b2 + 7, and the x\u00b2 terms cancel to leave 3x = 7. It is a linear equation wearing a quadratic costume.',
    'So the test is: simplify to standard form, then look at the coefficient of x\u00b2. If what remains has a non-zero x\u00b2 coefficient, the equation is quadratic. If the x\u00b2 term cancels, it is not, however it looked at the start.',
    'Standard form also fixes what a, b and c are, signs included. For 2x\u00b2 \u2212 5x \u2212 3 = 0 we have a = 2, b = \u22125 and c = \u22123. Reading b as 5 or c as 3 is the most common slip, and it changes every calculation that follows.',
    'Quadratic equations arise whenever a situation multiplies two quantities that both depend on the same unknown. A rectangle whose length is 5 more than its breadth has area x(x + 5), and setting that equal to a known area gives x\u00b2 + 5x = area, which rearranges to standard form.',
    'Checking a root is always available to you and costs little: substitute the value into the original equation and see whether both sides agree. That is what being a root means, and it catches arithmetic errors that no amount of rereading will.',
  ],
  representations: ['A rectangle whose two sides are expressions in the same unknown'],
  visuals: [F_AREA_RECT],
  visualsById: { F_AREA_RECT },
  workedExamples: [
    {
      id: 's42a.we1',
      prompt: 'Is (x + 2)(x \u2212 3) = x\u00b2 \u2212 4 a quadratic equation? Write it in standard form if it is.',
      steps: [
        { text: 'Expand the left side: (x + 2)(x \u2212 3) = x\u00b2 \u2212 x \u2212 6.', reasoning: 'Deciding the type of an equation means comparing like terms, which cannot be done while one side is a product.' },
        { text: 'The equation becomes x\u00b2 \u2212 x \u2212 6 = x\u00b2 \u2212 4.', reasoning: 'Both sides now carry an x\u00b2 term, which is exactly the situation where the degree can collapse.' },
        { text: 'Subtracting x\u00b2 from both sides leaves \u2212x \u2212 6 = \u22124, so \u2212x = 2 and x = \u22122.', reasoning: 'The x\u00b2 terms cancel, so no quadratic term survives.' },
        { text: 'It is not a quadratic equation; it is linear, with the single solution x = \u22122.', reasoning: 'The classification follows the simplified form, not the appearance of the original.' },
      ],
      answer: 'Not quadratic \u2014 it simplifies to a linear equation with x = \u22122.',
    },
    {
      id: 's42a.we2',
      prompt: 'Write 3x\u00b2 = 7x \u2212 2 in standard form and state a, b and c with their signs.',
      steps: [
        { text: 'Move every term to the left: 3x\u00b2 \u2212 7x + 2 = 0.', reasoning: 'Standard form requires one side to be 0 and the powers to descend, so the terms must be collected on a single side.' },
        { text: 'Reading off: a = 3, b = \u22127 and c = 2.', reasoning: 'The sign belongs to the coefficient. Moving 7x across the equals sign made it \u22127x, and \u22127 is what b is.' },
        { text: 'A check: a is not 0, so the equation really is quadratic.', reasoning: 'The condition a \u2260 0 is part of the definition and worth confirming rather than assuming.' },
      ],
      answer: '3x\u00b2 \u2212 7x + 2 = 0, with a = 3, b = \u22127, c = 2.',
    },
    {
      id: 's42a.we3',
      prompt: 'A rectangle has length 5 cm more than its breadth and an area of 84 cm\u00b2. Form a quadratic equation for the breadth.',
      steps: [
        { text: 'Let the breadth be x cm; then the length is (x + 5) cm.', reasoning: 'Naming the unknown and writing the other quantity in terms of it is what turns a description into algebra.' },
        { text: 'Area = x(x + 5) = 84.', reasoning: 'The area of a rectangle is the product of its sides, and both sides depend on the same unknown, which is why a square term appears.' },
        { text: 'Expanding, x\u00b2 + 5x = 84, so x\u00b2 + 5x \u2212 84 = 0.', reasoning: 'Bringing 84 across gives standard form, with a = 1, b = 5 and c = \u221284.' },
      ],
      answer: 'x\u00b2 + 5x \u2212 84 = 0, where x is the breadth in centimetres.',
      visualRef: 'F_AREA_RECT',
    },
  ],
  guidedPractice: [
    {
      id: 's42a.g1',
      prompt: 'Is x(x \u2212 1) = x\u00b2 + 4 quadratic? Justify by simplifying.',
      hint: 'Expand first, then look for an x\u00b2 term on both sides.',
      answer: 'No \u2014 it reduces to \u2212x = 4, so x = \u22124.',
      rationale: 'Expanding gives x\u00b2 \u2212 x = x\u00b2 + 4. The x\u00b2 terms cancel, leaving a linear equation, so the original was not quadratic despite its appearance.',
    },
    {
      id: 's42a.g2',
      prompt: 'For 5 \u2212 2x\u00b2 = 3x, write standard form and give a, b and c.',
      hint: 'Decide which side will hold the terms, and keep the signs as they arrive.',
      answer: '\u22122x\u00b2 \u2212 3x + 5 = 0, with a = \u22122, b = \u22123, c = 5.',
      rationale: 'Moving 3x to the left makes it \u22123x. Multiplying through by \u22121 to get 2x\u00b2 + 3x \u2212 5 = 0 is also standard form and has the same roots.',
    },
    {
      id: 's42a.g3',
      prompt: 'Verify that x = \u22124 is a root of x\u00b2 + 5x + 4 = 0.',
      hint: 'Substitute and evaluate both sides.',
      answer: 'Yes \u2014 substituting gives 16 \u2212 20 + 4 = 0.',
      rationale: '(\u22124)\u00b2 = 16, 5 \u00d7 (\u22124) = \u221220, and 16 \u2212 20 + 4 = 0, so the equation is satisfied and \u22124 is a root.',
    },
  ],
  independentPractice: [
    {
      id: 's42a.i1',
      prompt: 'Write 4x\u00b2 + 9 = 12x in standard form and state a, b and c.',
      answer: '4x\u00b2 \u2212 12x + 9 = 0, with a = 4, b = \u221212, c = 9.',
      rationale: 'Subtracting 12x from both sides gives the standard arrangement; the sign travels with the term.',
    },
    {
      id: 's42a.i2',
      prompt: 'Is (x \u2212 1)\u00b2 = 2(x \u2212 3) quadratic? Simplify to decide.',
      answer: 'Yes \u2014 it becomes x\u00b2 \u2212 4x + 7 = 0.',
      rationale: 'Expanding gives x\u00b2 \u2212 2x + 1 = 2x \u2212 6, and collecting terms leaves x\u00b2 \u2212 4x + 7 = 0. The x\u00b2 term survives, so the equation is quadratic.',
    },
    {
      id: 's42a.i3',
      prompt: 'The product of two consecutive positive integers is 182. Form a quadratic equation.',
      answer: 'x\u00b2 + x \u2212 182 = 0, where x is the smaller integer.',
      rationale: 'The integers are x and x + 1, so x(x + 1) = 182 expands to x\u00b2 + x = 182 and rearranges to standard form.',
    },
    {
      id: 's42a.i4',
      prompt: 'Explain why a cannot be 0 in the definition of a quadratic equation.',
      answer: 'Because the x\u00b2 term would disappear and the equation would be linear.',
      rationale: 'With a = 0 the equation reads bx + c = 0, which has at most one root and none of the behaviour the rest of the chapter studies.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's42a.td1',
      prompt: 'Two equations look very different but have exactly the same roots. Can both be quadratic, and can one be quadratic and the other not? Give reasons.',
      expectedReasoning:
        'Both can be quadratic: x\u00b2 \u2212 5x + 6 = 0 and 2x\u00b2 \u2212 10x + 12 = 0 are different equations with the same roots 2 and 3, since the second is the first multiplied by 2 and multiplying by a non-zero constant does not change which values make an equation true. One could also be linear while sharing a root with a quadratic \u2014 x \u2212 2 = 0 and x\u00b2 \u2212 5x + 6 = 0 both have 2 as a root \u2014 but then the root sets are not identical, because the quadratic also has 3.',
      
    },
    {
      id: 's42a.td2',
      prompt: 'Why is simplifying before classifying an equation necessary rather than merely tidy? Describe what could go wrong without it.',
      expectedReasoning:
        'Because the appearance of an x\u00b2 term does not settle the degree. In x(x + 3) = x\u00b2 + 7 the squares cancel and the equation is linear, so treating it as quadratic would send a student looking for two roots where only one exists, and any method designed for quadratics would be applied to an equation it does not fit. The coefficient of x\u00b2 in the SIMPLIFIED form is what decides, and nothing before simplification can tell you what it will be.',
    },
  ],
  summary:
    'A quadratic equation can be written as ax\u00b2 + bx + c = 0 with a \u2260 0. Decide by simplifying to standard form first, because an x\u00b2 term that cancels leaves a linear equation. Read a, b and c with their signs, keep expression, equation and root distinct, and check a root by substituting it back.',
  nextStep: 'Next you will solve these equations by factorising them.',
  teacher: {
    objective: 'Students classify equations as quadratic after simplification and form quadratic equations from situations.',
    prerequisiteKnowledge: ['Expanding brackets', 'Collecting like terms'],
    modelLanguage: [
      'Simplify first \u2014 then look at the x\u00b2 coefficient.',
      'The sign belongs to the coefficient.',
      'An expression has no roots; an equation does.',
    ],
    teachingNotes: [
      'The cancelling example is the one that teaches the test. Without it students classify by appearance and are right often enough never to notice.',
      'Sign extraction is worth drilling here rather than in the formula lesson, where an error in b is buried inside a larger computation.',
      'Watch for "quadratic expression" and "quadratic equation" being used interchangeably; the distinction carries the meaning of root.',
    ],
    quickChecks: [
      'Ask what b is in 3x\u00b2 \u2212 7x + 2 = 0.',
      'Ask why a cannot be zero.',
    ],
    supportForStrugglingLearners: [
      'Have the student write the simplified equation on a separate line before answering any question about its type.',
    ],
    extension: ['Ask for an equation that looks linear but is quadratic after simplification.'],
    materialsNeeded: [],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_4_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s4_3_factorisation_lesson',
  contentArtifactVersion: 1,
  source: source('4.3', 'Solution of a Quadratic Equation by Factorisation', 42, 'ncert_jemh1_s4_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s4_2'],
    mayAssume: ['Standard form and the coefficients a, b, c', 'Factorising a quadratic expression', 'Solving a linear equation'],
    mustNotIntroduce: [{ concept: 'The discriminant and the quadratic formula', belongsToSection: 'ncert_jemh1_s4_4' }],
  },
  learningGoal:
    'You will solve a quadratic equation by splitting the middle term, justify each root through the zero-product principle, and decide which roots a described situation admits.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Write a quadratic equation in standard form.',
      'Find two numbers with a given sum and product.',
      'Solve an equation such as 2x + 3 = 0.',
    ],
    ifNotReady: 'Revise the previous lesson. Factorising starts from standard form, so the equation must be arranged first.',
  },
  vocabulary: [
    { term: 'factorisation', meaning: 'Writing a quadratic expression as a product of two linear factors.' },
    { term: 'zero-product principle', meaning: 'If a product of two numbers is 0, then at least one of them is 0.' },
    { term: 'splitting the middle term', meaning: 'Replacing bx by two terms whose coefficients have sum b and product ac, so the expression can be grouped and factorised.' },
    { term: 'inadmissible root', meaning: 'A number that genuinely solves the equation but cannot be the answer to the situation described.' },
  ],
  explanation: [
    'Solving a quadratic by factorisation rests on one fact about numbers, not about quadratics: if a product of two numbers is 0, at least one of them must be 0. That is the zero-product principle, and it is what turns a factorised equation into two easy ones.',
    'It matters that the right-hand side is 0. From (x \u2212 2)(x \u2212 3) = 0 we may conclude x = 2 or x = 3. From (x \u2212 2)(x \u2212 3) = 6 we may conclude nothing of the kind, because many pairs of numbers multiply to 6. Equations must be in standard form before factorising, for exactly this reason.',
    'To factorise ax\u00b2 + bx + c, split the middle term: find two numbers whose sum is b and whose product is ac, use them to replace bx by two terms, then group in pairs. For 2x\u00b2 \u2212 5x \u2212 3 the product ac is \u22126 and the sum is \u22125, so the numbers are \u22126 and 1.',
    'That gives 2x\u00b2 \u2212 6x + x \u2212 3, which groups as 2x(x \u2212 3) + 1(x \u2212 3) = (x \u2212 3)(2x + 1). The chain is then complete: product equals zero, so x \u2212 3 = 0 or 2x + 1 = 0, giving x = 3 or x = \u22121/2.',
    'Every factorisation can be checked by expanding it back. (x \u2212 3)(2x + 1) = 2x\u00b2 + x \u2212 6x \u2212 3 = 2x\u00b2 \u2212 5x \u2212 3, which is what we started from. A factorisation that does not expand back is wrong, however neat it looks.',
    'When the equation came from a situation, the algebra is not the end. Both roots solve the equation; the situation decides which ones can be the answer. If x is the breadth of a rectangle, a root of \u221212 solves the equation perfectly well and is not a breadth, so it is set aside.',
    'The reason for setting it aside has to come from the context, not from the sign. Negative roots are perfectly good answers in many problems \u2014 a temperature, a loss, a position to the left of a point. What rules out \u221212 here is that lengths are positive, and that is a fact about rectangles rather than about negative numbers.',
  ],
  representations: ['A quadratic expression rewritten as a product of two linear factors'],
  visuals: [F_AREA_RECT],
  visualsById: { F_AREA_RECT },
  workedExamples: [
    {
      id: 's43a.we1',
      prompt: 'Solve 2x\u00b2 \u2212 5x \u2212 3 = 0 by factorisation.',
      steps: [
        { text: 'Here a = 2, b = \u22125 and c = \u22123, so ac = \u22126.', reasoning: 'Splitting the middle term needs the product ac and the sum b, so both are identified before any searching begins.' },
        { text: 'Find two numbers with product \u22126 and sum \u22125: these are \u22126 and 1.', reasoning: 'The product is negative so the numbers have opposite signs, and the sum is negative so the larger in size is the negative one.' },
        { text: 'Rewrite: 2x\u00b2 \u2212 6x + x \u2212 3 = 0, then group as 2x(x \u2212 3) + 1(x \u2212 3) = 0.', reasoning: 'The grouping works because both pairs leave the same bracket, which is what the choice of numbers guarantees.' },
        { text: 'Factorise: (x \u2212 3)(2x + 1) = 0.', reasoning: 'Expanding this back gives 2x\u00b2 \u2212 5x \u2212 3, confirming the factorisation before it is used.' },
        { text: 'By the zero-product principle, x \u2212 3 = 0 or 2x + 1 = 0.', reasoning: 'This is the step that converts one quadratic equation into two linear ones, and it needs the right-hand side to be 0.' },
        { text: 'So x = 3 or x = \u22121/2.', reasoning: 'Substituting x = 3 gives 18 \u2212 15 \u2212 3 = 0, and x = \u22121/2 gives 0.5 + 2.5 \u2212 3 = 0, so both satisfy the original equation.' },
      ],
      answer: 'x = 3 or x = \u22121/2.',
    },
    {
      id: 's43a.we2',
      prompt: 'A rectangle has length 5 cm more than its breadth and area 84 cm\u00b2. Find its dimensions.',
      steps: [
        { text: 'With breadth x, the equation is x\u00b2 + 5x \u2212 84 = 0.', reasoning: 'This is the equation formed in the previous lesson, now to be solved.' },
        { text: 'ac = \u221284 and b = 5, so the two numbers are 12 and \u22127.', reasoning: '12 \u00d7 (\u22127) = \u221284 and 12 + (\u22127) = 5, which is what splitting the middle term requires.' },
        { text: 'x\u00b2 + 12x \u2212 7x \u2212 84 = 0 groups as x(x + 12) \u2212 7(x + 12) = 0, giving (x + 12)(x \u2212 7) = 0.', reasoning: 'Expanding back gives x\u00b2 + 5x \u2212 84, so the factorisation is right.' },
        { text: 'So x = \u221212 or x = 7, and both genuinely solve the equation.', reasoning: 'Substituting \u221212 gives 144 \u2212 60 \u2212 84 = 0 and 7 gives 49 + 35 \u2212 84 = 0, so neither is an algebraic error.' },
        { text: 'A breadth cannot be \u221212 cm, so that root is set aside and x = 7.', reasoning: 'The reason is that lengths are positive \u2014 a fact about rectangles. The root is mathematically correct and contextually impossible, which are different things.' },
        { text: 'Breadth 7 cm and length 12 cm, with 7 \u00d7 12 = 84.', reasoning: 'Checking against the original statement rather than the equation catches errors made while forming it.' },
      ],
      answer: 'Breadth 7 cm, length 12 cm.',
      visualRef: 'F_AREA_RECT',
    },
    {
      id: 's43a.we3',
      prompt: 'A student solves (x \u2212 1)(x \u2212 4) = 10 by writing x \u2212 1 = 10 or x \u2212 4 = 10. What is wrong, and what is the correct solution?',
      steps: [
        { text: 'The zero-product principle applies only when the product is 0.', reasoning: 'Many pairs multiply to 10 \u2014 2 and 5, or 20 and 0.5 \u2014 so knowing the product tells us nothing about either factor.' },
        { text: 'Expand and rearrange: x\u00b2 \u2212 5x + 4 = 10, so x\u00b2 \u2212 5x \u2212 6 = 0.', reasoning: 'Standard form is what makes the principle available.' },
        { text: 'ac = \u22126 and b = \u22125, so the numbers are \u22126 and 1, giving (x \u2212 6)(x + 1) = 0.', reasoning: 'Expanding back gives x\u00b2 \u2212 5x \u2212 6, confirming it.' },
        { text: 'So x = 6 or x = \u22121.', reasoning: 'Checking x = 6 in the ORIGINAL equation: (5)(2) = 10, which is correct, and x = \u22121 gives (\u22122)(\u22125) = 10.' },
      ],
      answer: 'The principle needs a product of 0; correctly solved, x = 6 or x = \u22121.',
    },
  ],
  guidedPractice: [
    {
      id: 's43a.g1',
      prompt: 'Solve x\u00b2 \u2212 7x + 12 = 0 by factorisation.',
      hint: 'Which two numbers have product 12 and sum \u22127?',
      answer: 'x = 3 or x = 4.',
      rationale: '\u22123 and \u22124 give the right sum and product, so (x \u2212 3)(x \u2212 4) = 0. Both roots check: 9 \u2212 21 + 12 = 0 and 16 \u2212 28 + 12 = 0.',
    },
    {
      id: 's43a.g2',
      prompt: 'Solve 6x\u00b2 + x \u2212 2 = 0.',
      hint: 'ac is \u221212 here, and b is 1.',
      answer: 'x = 1/2 or x = \u22122/3.',
      rationale: '4 and \u22123 have product \u221212 and sum 1, giving 6x\u00b2 + 4x \u2212 3x \u2212 2 = 2x(3x + 2) \u2212 1(3x + 2) = (3x + 2)(2x \u2212 1).',
    },
    {
      id: 's43a.g3',
      prompt: 'The equation x\u00b2 \u2212 2x \u2212 15 = 0 models a problem where x is a number of days. Which roots are admissible?',
      hint: 'Solve first, then ask what the context allows.',
      answer: 'x = 5 only; x = \u22123 is a root of the equation but cannot be a number of days.',
      rationale: '(x \u2212 5)(x + 3) = 0 gives both roots. A count of days cannot be negative, so \u22123 is set aside for a contextual reason, not because it is negative in itself.',
    },
  ],
  independentPractice: [
    {
      id: 's43a.i1',
      prompt: 'Solve 3x\u00b2 \u2212 10x + 8 = 0 by factorisation.',
      answer: 'x = 2 or x = 4/3.',
      rationale: 'ac = 24 and b = \u221210, so the numbers are \u22126 and \u22124, giving (x \u2212 2)(3x \u2212 4) = 0. Both roots satisfy the equation.',
    },
    {
      id: 's43a.i2',
      prompt: 'The product of two consecutive positive integers is 182. Find them.',
      answer: '13 and 14.',
      rationale: 'x\u00b2 + x \u2212 182 = 0 factorises as (x + 14)(x \u2212 13) = 0, so x = 13 or x = \u221214. The integers are required to be positive, so \u221214 is set aside.',
    },
    {
      id: 's43a.i3',
      prompt: 'Explain why (x \u2212 3)(x + 5) = 0 can be solved immediately but (x \u2212 3)(x + 5) = 9 cannot.',
      answer: 'Because the zero-product principle applies only to a product of 0.',
      rationale: 'A product of 9 can arise from infinitely many pairs, so neither factor is determined. The second equation must be expanded and rearranged to standard form first.',
    },
    {
      id: 's43a.i4',
      prompt: 'A root of a quadratic is \u22128. Give one context in which it must be set aside and one in which it is a perfectly good answer.',
      answer: 'Set aside as a length or a count; acceptable as a temperature or a position left of an origin.',
      rationale: 'Admissibility comes from what the quantity means, not from the sign. The same number is impossible in one situation and ordinary in another.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's43a.td1',
      prompt: 'Why must a quadratic equation be in standard form before the zero-product principle can be used? Illustrate with an equation where ignoring this gives a wrong answer.',
      expectedReasoning:
        'The principle says only that a product of 0 forces a factor to be 0; it says nothing about any other product. Take (x \u2212 1)(x \u2212 4) = 10. Writing x \u2212 1 = 10 gives x = 11, and substituting back gives 10 \u00d7 7 = 70, not 10, so the answer is simply wrong. Rearranged to x\u00b2 \u2212 5x \u2212 6 = 0 the equation factorises as (x \u2212 6)(x + 1) = 0 and the roots are 6 and \u22121, both of which check.',
    },
    {
      id: 's43a.td2',
      prompt: 'A student says any negative root should be rejected in a word problem. Explain why this rule is wrong, and give the rule that actually applies.',
      expectedReasoning:
        'The sign of a root is not a reason by itself. A negative root is impossible for a length, an area or a count, because those quantities cannot be negative \u2014 but perfectly reasonable for a temperature change, a loss, or a displacement in the opposite direction. The rule that applies is to ask what the unknown represents and whether the value is possible for that quantity. Rejecting by sign would discard correct answers whenever the context allows negative values.',
    },
  ],
  summary:
    'Put the equation in standard form, split the middle term using two numbers with sum b and product ac, group into two factors, and check by expanding back. A product of 0 forces one factor to be 0, which gives two linear equations and the roots. Where the equation came from a situation, decide admissibility from what the unknown represents \u2014 never from the sign alone.',
  nextStep: 'Next you will find out, before solving, how many real roots an equation has.',
  teacher: {
    objective: 'Students solve quadratics by factorisation with the zero-product step justified, and judge contextual admissibility.',
    prerequisiteKnowledge: ['Standard form', 'Factorising by splitting the middle term'],
    modelLanguage: [
      'Zero on one side \u2014 that is what makes the principle work.',
      'Expand it back. Does it return what you started with?',
      'Why can this root not be the answer? Say it in terms of the quantity.',
    ],
    teachingNotes: [
      'The = 10 example is the one that justifies insisting on standard form. Students who have only ever seen = 0 treat the rearrangement as bookkeeping rather than as the condition the method requires.',
      'Require the reason for rejecting a root to be stated in words about the quantity. "It is negative" is the habit that later discards valid answers.',
      'Expanding the factorisation back takes one line and catches sign errors that otherwise survive into the roots.',
    ],
    quickChecks: [
      'Ask what can be concluded from (x \u2212 2)(x \u2212 5) = 12.',
      'Ask for a context where a negative root is a good answer.',
    ],
    supportForStrugglingLearners: [
      'Have the student write ac and b at the top of the working before hunting for the two numbers.',
    ],
    extension: ['Ask for a quadratic whose two roots are both admissible in a chosen context.'],
    materialsNeeded: [],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_4_4A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s4_4_discriminant_lesson',
  contentArtifactVersion: 1,
  source: source('4.4', 'Nature of Roots', 44, 'ncert_jemh1_s4_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s4_3'],
    mayAssume: ['Standard form and the coefficients a, b, c', 'Square roots of non-negative numbers', 'Completing a square'],
    mustNotIntroduce: [
      { concept: 'Complex or imaginary numbers', belongsToSection: 'outside_class_10_scope' },
    ],
  },
  learningGoal:
    'You will derive the quadratic formula by completing the square, and use the discriminant b\u00b2 \u2212 4ac to say how many real roots an equation has before solving it.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Read a, b and c from an equation in standard form, with signs.',
      'Complete the square on an expression such as x\u00b2 + 6x.',
      'Say which numbers have a real square root.',
    ],
    ifNotReady: 'Revise completing the square. The formula and the discriminant both come out of that one manipulation.',
  },
  vocabulary: [
    { term: 'discriminant', meaning: 'The quantity b\u00b2 \u2212 4ac, written D, which decides how many real roots a quadratic equation has.' },
    { term: 'quadratic formula', meaning: 'The expression x = (\u2212b \u00b1 \u221a(b\u00b2 \u2212 4ac)) / 2a, giving the roots of ax\u00b2 + bx + c = 0.' },
    { term: 'real roots', meaning: 'Roots that are real numbers \u2014 the only kind this course works with.' },
    { term: 'repeated root', meaning: 'A single value that the formula produces twice, when the discriminant is 0.' },
  ],
  explanation: [
    'Factorisation works when the two numbers can be found. Often they cannot be found conveniently, and in those cases a method that always works is wanted. Completing the square provides one, and carrying it out in general produces both the formula and the discriminant at once.',
    'Start from ax\u00b2 + bx + c = 0 with a \u2260 0, and divide every term by a: x\u00b2 + (b/a)x + c/a = 0. Dividing only some terms is the first place this goes wrong, so every term must be divided.',
    'Half the coefficient of x is b/2a, and its square is b\u00b2/4a\u00b2. Add and subtract that: x\u00b2 + (b/a)x + b\u00b2/4a\u00b2 \u2212 b\u00b2/4a\u00b2 + c/a = 0, so (x + b/2a)\u00b2 = b\u00b2/4a\u00b2 \u2212 c/a.',
    'The right side over a common denominator is (b\u00b2 \u2212 4ac)/4a\u00b2. That combination is the discriminant, and it has appeared here rather than been introduced \u2014 it is simply what sits under the square root once the square is completed.',
    'Taking square roots gives x + b/2a = \u00b1\u221a(b\u00b2 \u2212 4ac) / 2a, and the \u00b1 is essential: a positive number has two square roots, and dropping the sign loses one root. Rearranging gives x = (\u2212b \u00b1 \u221a(b\u00b2 \u2212 4ac)) / 2a.',
    'Now the discriminant D = b\u00b2 \u2212 4ac can be read before any solving. If D > 0 its square root is a positive number and the \u00b1 gives two different values: two distinct real roots. If D = 0 the square root is 0 and both signs give the same value, x = \u2212b/2a: one repeated real root. We say two equal roots, meaning the same number arising twice, not two different numbers.',
    'If D < 0 the formula asks for the square root of a negative number, and no real number squares to a negative. Within the real-number system used in this course, the equation has no real roots. That is the precise statement, and it is worth keeping precise: saying the equation has no solution would claim more than this course establishes.',
    'The discriminant is useful because it answers the question of how many roots without finding them. For 3x\u00b2 \u2212 2x + 1 = 0, D = 4 \u2212 12 = \u22128, which is negative, so there are no real roots and no time need be spent searching for them.',
  ],
  representations: ['The completing-the-square derivation, and a comparison of the three cases for D'],
  visuals: [],
  visualsById: {},
  workedExamples: [
    {
      id: 's44a.we1',
      prompt: 'Derive the quadratic formula from ax\u00b2 + bx + c = 0, a \u2260 0.',
      steps: [
        { text: 'Divide every term by a: x\u00b2 + (b/a)x + c/a = 0.', reasoning: 'Division is legitimate because a is not 0, and it must reach every term \u2014 dividing only the first two is a common and fatal slip.' },
        { text: 'Add and subtract (b/2a)\u00b2 = b\u00b2/4a\u00b2.', reasoning: 'Half the coefficient of x, squared, is what completes the square; adding and subtracting the same quantity changes nothing.' },
        { text: 'Rewrite as (x + b/2a)\u00b2 = b\u00b2/4a\u00b2 \u2212 c/a = (b\u00b2 \u2212 4ac)/4a\u00b2.', reasoning: 'The left side is now a perfect square and the right side is a single fraction, which is where the discriminant appears.' },
        { text: 'Take square roots: x + b/2a = \u00b1\u221a(b\u00b2 \u2212 4ac) / 2a.', reasoning: 'Both signs must be kept, because a positive number has two square roots and each gives a root of the equation.' },
        { text: 'Subtract b/2a: x = (\u2212b \u00b1 \u221a(b\u00b2 \u2212 4ac)) / 2a.', reasoning: 'The whole numerator is divided by 2a, not just the radical \u2014 the bracket matters.' },
      ],
      answer: 'x = (\u2212b \u00b1 \u221a(b\u00b2 \u2212 4ac)) / 2a, valid whenever b\u00b2 \u2212 4ac is not negative.',
    },
    {
      id: 's44a.we2',
      prompt: 'Without solving, state the nature of the roots of 2x\u00b2 \u2212 7x + 3 = 0.',
      steps: [
        { text: 'a = 2, b = \u22127, c = 3.', reasoning: 'The signs come from standard form; b is \u22127, not 7.' },
        { text: 'D = (\u22127)\u00b2 \u2212 4(2)(3) = 49 \u2212 24 = 25.', reasoning: 'Squaring \u22127 gives +49, which is why the sign of b does not affect b\u00b2 but does affect everything else.' },
        { text: 'D = 25 > 0, so there are two distinct real roots.', reasoning: 'A positive discriminant has a positive square root, and the \u00b1 then produces two different values.' },
      ],
      answer: 'Two distinct real roots.',
    },
    {
      id: 's44a.we3',
      prompt: 'Find the nature of the roots of 4x\u00b2 \u2212 12x + 9 = 0 and of 3x\u00b2 \u2212 2x + 1 = 0.',
      steps: [
        { text: 'For the first, D = 144 \u2212 4(4)(9) = 144 \u2212 144 = 0.', reasoning: 'A discriminant of exactly 0 is the boundary case between two roots and none.' },
        { text: 'So it has one repeated real root, x = \u2212b/2a = 12/8 = 3/2.', reasoning: 'With D = 0 both signs of the \u00b1 give the same value, so the formula returns 3/2 twice rather than two different numbers.' },
        { text: 'For the second, D = 4 \u2212 4(3)(1) = 4 \u2212 12 = \u22128.', reasoning: 'Here the discriminant is negative, so the formula would require the square root of a negative number.' },
        { text: 'Within the real numbers used in this course, that equation has no real roots.', reasoning: 'No real number squares to a negative, so the formula produces no real value. The careful wording matters: the claim is about real roots.' },
      ],
      answer: 'The first has one repeated real root 3/2; the second has no real roots.',
    },
  ],
  guidedPractice: [
    {
      id: 's44a.g1',
      prompt: 'Find D for x\u00b2 + 4x + 4 = 0 and state the nature of the roots.',
      hint: 'Compute b\u00b2 \u2212 4ac before anything else.',
      answer: 'D = 0, so there is one repeated real root, x = \u22122.',
      rationale: '16 \u2212 16 = 0. With D = 0 the formula gives \u2212b/2a = \u22124/2 = \u22122, the same value twice.',
    },
    {
      id: 's44a.g2',
      prompt: 'Find D for 2x\u00b2 + 3x + 5 = 0 and state the nature of the roots carefully.',
      hint: 'Mind the wording once you see the sign.',
      answer: 'D = \u221231, so the equation has no real roots.',
      rationale: '9 \u2212 40 = \u221231. The precise statement is that there are no real roots; saying it has no solution would assert more than this course establishes.',
    },
    {
      id: 's44a.g3',
      prompt: 'Why is the \u00b1 in the formula essential?',
      hint: 'How many square roots does a positive number have?',
      answer: 'Because a positive number has two square roots, and each gives one of the two roots.',
      rationale: 'Dropping the sign keeps only the root from +\u221aD and loses the other. When D = 0 the two coincide, which is why that case gives one value.',
    },
  ],
  independentPractice: [
    {
      id: 's44a.i1',
      prompt: 'Find D and the nature of the roots of 5x\u00b2 \u2212 6x \u2212 2 = 0.',
      answer: 'D = 76, so two distinct real roots.',
      rationale: '(\u22126)\u00b2 \u2212 4(5)(\u22122) = 36 + 40 = 76. Note that c is negative, so \u22124ac is positive and adds.',
    },
    {
      id: 's44a.i2',
      prompt: 'Find D and the nature of the roots of 9x\u00b2 + 6x + 1 = 0.',
      answer: 'D = 0, so one repeated real root, x = \u22121/3.',
      rationale: '36 \u2212 36 = 0, and \u2212b/2a = \u22126/18 = \u22121/3.',
    },
    {
      id: 's44a.i3',
      prompt: 'For what value of k does x\u00b2 + kx + 9 = 0 have exactly one repeated real root, taking k positive?',
      answer: 'k = 6.',
      rationale: 'D = k\u00b2 \u2212 36 = 0 gives k = 6 or k = \u22126, and the positive value is 6. The equation is then x\u00b2 + 6x + 9 = (x + 3)\u00b2 = 0.',
    },
    {
      id: 's44a.i4',
      prompt: 'A student writes, of 2x\u00b2 + x + 4 = 0, that the equation has no solution. Improve the statement and say why the improvement matters.',
      answer: 'It has no real roots; D = 1 \u2212 32 = \u221231.',
      rationale: 'The claim should be confined to the number system in use. Saying no solution asserts something broader than this course establishes, and a statement a student must later unlearn is worse than a careful one.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's44a.td1',
      prompt: 'Why does D = 0 give the same root twice rather than two different roots? Answer from the formula.',
      expectedReasoning:
        'The two roots are (\u2212b + \u221aD)/2a and (\u2212b \u2212 \u221aD)/2a, and they differ only by the \u00b1\u221aD. When D = 0 the square root is 0, so adding and subtracting it changes nothing and both expressions equal \u2212b/2a. The formula still returns two roots in the sense that the quadratic has two factors, but they are the same factor repeated, which is why the single value is called a repeated root rather than two different numbers.',
    },
    {
      id: 's44a.td2',
      prompt: 'Changing which single coefficient of 2x\u00b2 + 5x + 3 = 0 could turn two distinct real roots into none? Explain using D.',
      expectedReasoning:
        'D is currently 25 \u2212 24 = 1, which is positive. Increasing c makes \u22124ac more negative: at c = 25/8 the discriminant is 0, and beyond that it is negative and there are no real roots. Reducing the size of b has the same effect, since D falls as b\u00b2 falls. Increasing a also raises 4ac and lowers D. So each coefficient can do it, and in every case the mechanism is the same \u2014 the sign of b\u00b2 \u2212 4ac is what changes.',
    },
  ],
  summary:
    'Completing the square on ax\u00b2 + bx + c = 0 gives x = (\u2212b \u00b1 \u221a(b\u00b2 \u2212 4ac)) / 2a, and the quantity under the root is the discriminant D = b\u00b2 \u2212 4ac. D > 0 gives two distinct real roots, D = 0 gives one repeated real root \u2212b/2a, and D < 0 means the equation has no real roots. Keep the \u00b1, and divide every term by a.',
  nextStep: 'Next you will use the formula to solve equations that do not factorise conveniently.',
  teacher: {
    objective: 'Students derive the quadratic formula by completing the square and read the nature of the roots from the discriminant.',
    prerequisiteKnowledge: ['Completing the square', 'Reading a, b, c with signs'],
    modelLanguage: [
      'Every term divided by a \u2014 not just the first two.',
      'Keep the \u00b1. A positive number has two square roots.',
      'No real roots. Say the word real.',
    ],
    teachingNotes: [
      'Deriving the formula rather than announcing it is what makes the discriminant intelligible: D is not a separate rule, it is the thing that ends up under the square root.',
      'The wording for D < 0 is worth insisting on. "No solution" is a sentence students have to unlearn later, and the careful version costs one word.',
      'Watch for b\u00b2 being computed as \u2212(b\u00b2) when b is negative, and for \u22124ac being treated as negative when c is negative.',
    ],
    quickChecks: [
      'Ask what happens to the two roots when D = 0.',
      'Ask for the correct sentence when D is negative.',
    ],
    supportForStrugglingLearners: [
      'Have the student write a, b and c in a column with their signs before computing D.',
    ],
    extension: ['Ask which coefficient changes could move an equation from two real roots to none.'],
    materialsNeeded: [],
  },
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_4_4B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s4_4_formula_apply_lesson',
  contentArtifactVersion: 1,
  source: source('4.4', 'Nature of Roots', 44, 'ncert_jemh1_s4_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s4_4'],
    mayAssume: ['The quadratic formula and the discriminant', 'Simplifying surds', 'Factorisation by splitting the middle term'],
    mustNotIntroduce: [{ concept: 'Complex or imaginary numbers', belongsToSection: 'outside_class_10_scope' }],
  },
  learningGoal:
    'You will solve quadratic equations with the formula, check the discriminant first, and choose sensibly between the formula and factorisation.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: [
      'Compute D = b\u00b2 \u2212 4ac with correct signs.',
      'Simplify a surd such as \u221a48.',
      'State the quadratic formula including the \u00b1.',
    ],
    ifNotReady: 'Revise the previous lesson. Using the formula without checking D first wastes effort on equations that have no real roots.',
  },
  vocabulary: [
    { term: 'surd', meaning: 'A square root that cannot be written exactly as a fraction, such as \u221a13.' },
    { term: 'exact form', meaning: 'An answer left with its surd in place, rather than rounded to a decimal.' },
    { term: 'method choice', meaning: 'Deciding whether factorisation or the formula is the shorter route for a particular equation.' },
  ],
  explanation: [
    'The formula x = (\u2212b \u00b1 \u221a(b\u00b2 \u2212 4ac)) / 2a solves any quadratic that has real roots. Using it well is mostly a matter of care at three points: the signs of a, b and c, keeping the \u00b1, and dividing the WHOLE numerator by 2a.',
    'Check D before substituting. If D is negative the equation has no real roots, and the formula has nothing to give \u2014 noticing that first saves the work of discovering it halfway through a square root.',
    'The signs are where most errors begin. In 2x\u00b2 \u2212 5x \u2212 3 = 0 we have a = 2, b = \u22125 and c = \u22123. Then \u2212b is +5, and \u22124ac is \u22124 \u00d7 2 \u00d7 (\u22123) = +24, which adds rather than subtracts. Writing b = 5 would change both the numerator and the discriminant.',
    'When D is not a perfect square the roots contain a surd, and the exact form is the better answer. For x\u00b2 \u2212 4x \u2212 1 = 0, D = 16 + 4 = 20, so x = (4 \u00b1 \u221a20)/2 = (4 \u00b1 2\u221a5)/2 = 2 \u00b1 \u221a5. Simplifying the surd and cancelling leaves a cleaner exact answer than a decimal would.',
    'Both methods must agree when both apply. Solving 2x\u00b2 \u2212 5x \u2212 3 = 0 by factorisation gave 3 and \u22121/2; the formula gives (5 \u00b1 7)/4, which is 3 and \u22121/2. They are the same two numbers, because the roots of an equation do not depend on how you find them.',
    'So when do you choose which? If the two numbers for splitting the middle term are easy to spot, factorisation is quicker. When they are not \u2014 and many quadratics simply do not factorise over the integers \u2014 the formula works regardless. x\u00b2 \u2212 4x \u2212 1 = 0 has no integer factorisation, and the formula handles it without difficulty.',
    'It is worth saying plainly that most quadratics do not factorise neatly. Textbook exercises are chosen so that they often do, which can leave the impression that a failure to factorise means a mistake. The formula exists precisely because that impression is false.',
  ],
  representations: ['A worked substitution showing a, b and c with their signs'],
  visuals: [],
  visualsById: {},
  workedExamples: [
    {
      id: 's44b.we1',
      prompt: 'Solve 2x\u00b2 \u2212 5x \u2212 3 = 0 using the formula, and compare with the factorisation found earlier.',
      steps: [
        { text: 'a = 2, b = \u22125, c = \u22123, so D = 25 \u2212 4(2)(\u22123) = 25 + 24 = 49.', reasoning: 'Because c is negative, \u22124ac is positive and the two terms add; treating it as a subtraction is the classic sign error here.' },
        { text: 'D = 49 > 0, so there are two distinct real roots and the formula will produce them.', reasoning: 'Checking D first confirms the work is worth doing and tells us to expect two different values.' },
        { text: 'x = (5 \u00b1 \u221a49)/4 = (5 \u00b1 7)/4.', reasoning: '\u2212b is +5 since b is \u22125, and \u221a49 = 7 exactly, so no surd remains.' },
        { text: 'So x = 12/4 = 3 or x = \u22122/4 = \u22121/2.', reasoning: 'Both signs of the \u00b1 are used, giving the two roots.' },
        { text: 'Factorisation gave (x \u2212 3)(2x + 1) = 0, with the same roots 3 and \u22121/2.', reasoning: 'The methods agree, as they must: the roots belong to the equation, not to the method.' },
      ],
      answer: 'x = 3 or x = \u22121/2, by either method.',
    },
    {
      id: 's44b.we2',
      prompt: 'Solve x\u00b2 \u2212 4x \u2212 1 = 0, leaving the answer in exact form.',
      steps: [
        { text: 'a = 1, b = \u22124, c = \u22121, so D = 16 + 4 = 20.', reasoning: 'Again \u22124ac is positive because c is negative.' },
        { text: 'There are no integers with product \u22121 and sum \u22124, so this does not factorise over the integers.', reasoning: 'Noticing this is what justifies reaching for the formula rather than persisting with a search that cannot succeed.' },
        { text: 'x = (4 \u00b1 \u221a20)/2.', reasoning: '\u2212b is +4, and the whole numerator is over 2a = 2.' },
        { text: '\u221a20 = 2\u221a5, so x = (4 \u00b1 2\u221a5)/2 = 2 \u00b1 \u221a5.', reasoning: 'Every term in the numerator shares a factor of 2, so it cancels against the denominator \u2014 cancelling only the radical would be wrong.' },
      ],
      answer: 'x = 2 + \u221a5 or x = 2 \u2212 \u221a5.',
    },
    {
      id: 's44b.we3',
      prompt: 'Attempt to solve 3x\u00b2 \u2212 2x + 1 = 0 with the formula.',
      steps: [
        { text: 'a = 3, b = \u22122, c = 1, so D = 4 \u2212 12 = \u22128.', reasoning: 'Here c is positive, so \u22124ac subtracts and the discriminant can fall below zero.' },
        { text: 'D is negative, so the formula would require the square root of \u22128.', reasoning: 'No real number squares to a negative, so the formula produces no real value.' },
        { text: 'Within the real numbers used in this course, the equation has no real roots.', reasoning: 'The statement is confined to real roots, which is what this course establishes; nothing here says anything about other number systems.' },
      ],
      answer: 'No real roots.',
    },
  ],
  guidedPractice: [
    {
      id: 's44b.g1',
      prompt: 'Solve x\u00b2 \u2212 6x + 4 = 0 in exact form.',
      hint: 'Compute D, then simplify the surd before cancelling.',
      answer: 'x = 3 + \u221a5 or x = 3 \u2212 \u221a5.',
      rationale: 'D = 36 \u2212 16 = 20, so x = (6 \u00b1 \u221a20)/2 = (6 \u00b1 2\u221a5)/2 = 3 \u00b1 \u221a5.',
    },
    {
      id: 's44b.g2',
      prompt: 'For 5x\u00b2 + 2x \u2212 7 = 0, state a, b and c and compute D.',
      hint: 'Watch the sign of c.',
      answer: 'a = 5, b = 2, c = \u22127, and D = 144.',
      rationale: '4 \u2212 4(5)(\u22127) = 4 + 140 = 144, a perfect square, so the roots are rational: x = 1 or x = \u22127/5.',
    },
    {
      id: 's44b.g3',
      prompt: 'Which method would you choose for x\u00b2 + 7x + 12 = 0, and why?',
      hint: 'Can you see two numbers quickly?',
      answer: 'Factorisation \u2014 3 and 4 give the sum and product at once, so (x + 3)(x + 4) = 0 and x = \u22123 or x = \u22124.',
      rationale: 'The formula would give the same answer but with more arithmetic. Method choice is about effort, since the roots are the same either way.',
    },
  ],
  independentPractice: [
    {
      id: 's44b.i1',
      prompt: 'Solve 2x\u00b2 + 7x + 3 = 0 using the formula.',
      answer: 'x = \u22121/2 or x = \u22123.',
      rationale: 'D = 49 \u2212 24 = 25, so x = (\u22127 \u00b1 5)/4, giving \u22122/4 = \u22121/2 and \u221212/4 = \u22123.',
    },
    {
      id: 's44b.i2',
      prompt: 'Solve x\u00b2 \u2212 2x \u2212 4 = 0 in exact form.',
      answer: 'x = 1 + \u221a5 or x = 1 \u2212 \u221a5.',
      rationale: 'D = 4 + 16 = 20, so x = (2 \u00b1 2\u221a5)/2 = 1 \u00b1 \u221a5 after cancelling the common factor of 2.',
    },
    {
      id: 's44b.i3',
      prompt: 'A student solving 3x\u00b2 \u2212 4x \u2212 2 = 0 writes D = 16 \u2212 24 = \u22128. Find the error and the correct D.',
      answer: 'c is \u22122, so \u22124ac = +24 and D = 16 + 24 = 40.',
      rationale: 'The student treated \u22124ac as a subtraction regardless of the sign of c. With D = 40 there are two distinct real roots, x = (4 \u00b1 2\u221a10)/6 = (2 \u00b1 \u221a10)/3.',
    },
    {
      id: 's44b.i4',
      prompt: 'Explain why a quadratic that does not factorise over the integers is not therefore unsolvable.',
      answer: 'Because the formula solves any quadratic whose discriminant is not negative, whether or not it factorises over the integers.',
      rationale: 'Factorising over the integers is a convenience, not a requirement. x\u00b2 \u2212 4x \u2212 1 = 0 has the perfectly good roots 2 \u00b1 \u221a5.',
    },
  ],
  misconceptionIds: [],
  interactivePractice: [],
  reasoningApplication: [
    {
      id: 's44b.td1',
      prompt: 'Two students solve the same equation, one by factorisation and one by the formula, and get different answers. What must be true, and how would you find out which is wrong?',
      expectedReasoning:
        'At least one of them has made an error, because the roots belong to the equation and not to the method. The quickest way to find out is to substitute each proposed root into the original equation: a correct root makes the two sides agree and an incorrect one does not. That test is independent of both methods, so it settles the disagreement without redoing either calculation.',
    },
    {
      id: 's44b.td2',
      prompt: 'Why is it worth checking the discriminant before using the formula, when the formula itself would reveal a negative value under the root?',
      expectedReasoning:
        'Because the discriminant answers the question with one subtraction, while the formula reaches the same point only after the substitution and the arithmetic of the numerator. More importantly, it changes what you are doing: knowing D is negative tells you to report that there are no real roots, rather than to keep going and hope the arithmetic resolves. It also tells you in advance whether to expect two roots, one, or a surd, which makes an arithmetic slip easier to notice.',
    },
  ],
  summary:
    'Check D first, then substitute into x = (\u2212b \u00b1 \u221a(b\u00b2 \u2212 4ac)) / 2a with the signs of a, b and c read from standard form. Keep the \u00b1, divide the whole numerator by 2a, and simplify surds before cancelling. Factorisation is quicker when the two numbers are easy to see; the formula works either way, and the two must agree.',
  nextStep: 'The remaining work of this chapter applies these methods to situations.',
  teacher: {
    objective: 'Students solve quadratics with the formula, check D first, and choose between methods.',
    prerequisiteKnowledge: ['The formula and the discriminant', 'Simplifying surds'],
    modelLanguage: [
      'What is c, with its sign? Then what is \u22124ac?',
      'The whole numerator over 2a.',
      'Both methods, same roots \u2014 they belong to the equation.',
    ],
    teachingNotes: [
      'Solving one equation by both methods in the same lesson is what makes method choice a decision rather than a habit. It also gives students an independent check they can run themselves.',
      'The \u22124ac sign error is worth its own example: students apply the minus sign mechanically and lose it when c is negative.',
      'Say plainly that most quadratics do not factorise over the integers. Exercise sets suggest otherwise, and students read a failure to factorise as their own mistake.',
    ],
    quickChecks: [
      'Ask what \u22124ac comes to when a = 3 and c = \u22122.',
      'Ask what to do first when D turns out negative.',
    ],
    supportForStrugglingLearners: [
      'Have the student write \u2212b, b\u00b2 and \u22124ac on separate lines before assembling the formula.',
    ],
    extension: ['Ask for a quadratic with integer coefficients whose roots are 1 \u00b1 \u221a3.'],
    materialsNeeded: [],
  },
  reviewStatus: 'authored_draft',
};

export const CLASS10_QUADRATIC_SECTIONS: AuthoredSection[] = [
  C10_SECTION_4_2A,
  C10_SECTION_4_3A,
  C10_SECTION_4_4A,
  C10_SECTION_4_4B,
];
