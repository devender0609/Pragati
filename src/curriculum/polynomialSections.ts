// ===========================================================================
// v0.84.0-c10.9 checkpoint 63 — CLASS 10 POLYNOMIALS.
//
// Five readings of one object: the rule, the zeroes, the factors, the curve
// and the coefficient relations. They cannot disagree here, because only the
// coefficients are authored and everything else is derived from them.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §2.2
// (folio 11) and §2.3 (folio 18). The coefficient relations are stated for
// QUADRATICS only in the current source; cubics appear in §2.2 solely for
// counting zeroes from a graph's shape. The remainder and factor theorems
// are absent from the current chapter and are not taught.
//
// §2.1 is REVIEW and earns no unit; its framing is carried into the first
// lesson. §2.4 is REVIEW likewise.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  asQuadratic, evaluate, formatRational, productOfZeroes,
  rationalZeroes, sumOfZeroes, yIntercept,
  type Polynomial, type PolynomialGraphSpec,
} from './polynomial';

export const POLYNOMIALS_CHAPTER_ID = 'ncert_jemh1_ch02';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (sectionNumber: string, exactTitle: string, startPage: number, officialSectionId: string) => ({
  officialChapterId: POLYNOMIALS_CHAPTER_ID, officialSectionId, sectionNumber, exactTitle,
  startPage, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

const poly = (coefficients: number[], label: string, id: string): Polynomial => ({ id, coefficients, label });

// --- the canonical polynomials ---------------------------------------------

/** Two distinct zeroes, 2 and 3. */
export const P_TWO = poly([6, -5, 1], 'x\u00b2 \u2212 5x + 6', 'two_zeroes');
/** A repeated zero at 3 — one x-intercept, touched not crossed. */
export const P_REPEATED = poly([9, -6, 1], 'x\u00b2 \u2212 6x + 9', 'repeated_zero');
/** No real zeroes; the curve never meets the axis. */
export const P_NONE = poly([5, 2, 1], 'x\u00b2 + 2x + 5', 'no_real_zeroes');
/** A non-monic case with a rational zero, 3 and \u22121/2. */
export const P_RATIONAL = poly([-3, -5, 2], '2x\u00b2 \u2212 5x \u2212 3', 'rational_zeroes');
/** The same zeroes as P_TWO, scaled by 3 — different coefficients, same zeroes. */
export const P_SCALED = poly([18, -15, 3], '3x\u00b2 \u2212 15x + 18', 'scaled');

export const CANONICAL_POLYNOMIALS = [P_TWO, P_REPEATED, P_NONE, P_RATIONAL, P_SCALED];

const Z = (p: Polynomial) => rationalZeroes(asQuadratic(p)!).map(formatRational);
const S = (p: Polynomial) => formatRational(sumOfZeroes(asQuadratic(p)!));
const PR = (p: Polynomial) => formatRational(productOfZeroes(asQuadratic(p)!));

const graph = (
  polynomial: Polynomial, xMin: number, xMax: number, caption: string, altText: string,
  purpose: PolynomialGraphSpec['purpose'] = 'show_definition'
): PolynomialGraphSpec => ({ type: 'polynomial_graph', purpose, status: 'concept_specific', polynomial, xMin, xMax, caption, altText });

export const G_TWO = graph(P_TWO, -1, 6,
  'A quadratic meeting the x-axis at two points.',
  `The curve y = x\u00b2 \u2212 5x + 6 drawn for x from \u22121 to 6. It opens upward, dips below the axis between x = 2 and x = 3, and meets the x-axis at exactly two points, x = 2 and x = 3 \u2014 two distinct real zeroes. It meets the y-axis at 6, which is the value of the polynomial at x = 0 and is not a zero.`);

export const G_REPEATED = graph(P_REPEATED, 0, 6,
  'A quadratic that touches the x-axis without crossing it.',
  `The curve y = x\u00b2 \u2212 6x + 9 drawn for x from 0 to 6. It opens upward and comes down to the x-axis at x = 3, touches it there, and rises again without ever going below. There is one distinct real zero, a repeated zero at x = 3, so the curve touches the x-axis at a single point rather than crossing at two.`,
  'support_reasoning');

export const G_NONE = graph(P_NONE, -5, 3,
  'A quadratic whose curve never reaches the x-axis.',
  `The curve y = x\u00b2 + 2x + 5 drawn for x from \u22125 to 3. It opens upward and its lowest point lies above the x-axis, so the curve does not meet the x-axis anywhere in this window or outside it. The polynomial has no real zeroes. It meets the y-axis at 5.`,
  'compare_cases');

export const G_RATIONAL = graph(P_RATIONAL, -2, 5,
  'A quadratic with a fractional zero.',
  `The curve y = 2x\u00b2 \u2212 5x \u2212 3 drawn for x from \u22122 to 5. It opens upward and meets the x-axis at two points, x = \u22121/2 and x = 3, giving two distinct real zeroes. It meets the y-axis at \u22123.`,
  'support_reasoning');

export const CANONICAL_GRAPHS = [G_TWO, G_REPEATED, G_NONE, G_RATIONAL];

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_2_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s2_2_zeroes_meaning_lesson',
  contentArtifactVersion: 1,
  source: source('2.2', 'Geometrical Meaning of the Zeroes of a Polynomial', 11, 'ncert_jemh1_s2_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Polynomials and degree from Class IX', 'Graphs of linear polynomials from Class IX', 'Substituting a value into an expression'],
    mustNotIntroduce: [
      { concept: 'Counting zeroes from a graph\u2019s shape', belongsToSection: 'ncert_jemh1_s2_2b' },
      { concept: 'Relations between zeroes and coefficients', belongsToSection: 'ncert_jemh1_s2_3' },
    ],
  },
  learningGoal:
    'You will find the value of a polynomial at a point, and identify its zeroes as the x-coordinates where its graph meets the x-axis.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Say what the degree of a polynomial is.', 'Substitute a number for x and evaluate.', 'Read a coordinate off a graph.'],
    ifNotReady: 'Revise polynomials from Class IX. They are not new; what is new is reading their zeroes off a picture.',
  },
  vocabulary: [
    { term: 'polynomial', meaning: 'An expression such as x\u00b2 \u2212 5x + 6, built from powers of x with number coefficients.' },
    { term: 'zero of a polynomial', meaning: 'A value of x for which the polynomial\u2019s value is 0.' },
    { term: 'x-intercept', meaning: 'An x-coordinate where a graph meets the x-axis.' },
    { term: 'y-intercept', meaning: 'The value where a graph meets the y-axis, which is p(0) \u2014 not a zero.' },
    { term: 'coefficient', meaning: 'A number multiplying a power of x in the polynomial.' },
  ],
  explanation: [
    'You met polynomials in Class IX \u2014 expressions built from powers of x with number coefficients \u2014 and you have graphed linear ones. What Class 10 adds is a connection: the algebra of a polynomial and the picture of its graph are two readings of the same object, and each can answer questions about the other.',
    'Start with evaluation. The value of p(x) at x = k, written p(k), is what you get by substituting. For p(x) = x\u00b2 \u2212 5x + 6, p(1) = 1 \u2212 5 + 6 = 2 and p(2) = 4 \u2212 10 + 6 = 0.',
    'That second result has a name. A ZERO of a polynomial is a value of x at which the polynomial\u2019s value is 0. So 2 is a zero of x\u00b2 \u2212 5x + 6, and checking a claimed zero is always just a substitution.',
    'Now the picture. The graph of y = p(x) plots each x against its value. A point lies on the x-axis exactly when its y-coordinate is 0 \u2014 which is exactly when p(x) = 0. So the zeroes of a polynomial are the x-coordinates where its graph MEETS the x-axis.',
    'The word "meets" is chosen carefully. A graph can meet the axis by crossing it or by touching it and turning back, and both count. Saying "crosses" would quietly exclude the second case, which the next lesson examines.',
    `Guard against one confusion. The zeroes are x-intercepts; the y-intercept is a different thing entirely. For x\u00b2 \u2212 5x + 6 the graph meets the y-axis at ${yIntercept(P_TWO)}, which is p(0) \u2014 the constant term. The constant term is not a zero, and ${yIntercept(P_TWO)} is not a value of x at all.`,
    'Finally, a graph read by eye gives approximate information unless the meeting points are marked or the grid is exact. A curve that appears to meet the axis near 1.4 does not tell you whether the zero is 1.4, \u221a2, or something else. Reading a graph and solving algebraically answer the same question with different precision.',
  ],
  representations: ['A quadratic curve with its x-intercepts and y-intercept identified'],
  visuals: [G_TWO, G_RATIONAL],
  visualsById: { G_TWO, G_RATIONAL },
  workedExamples: [
    {
      id: 's22a.we1',
      prompt: `For p(x) = ${P_TWO.label}, find p(0), p(1) and p(2), and say which of these inputs is a zero.`,
      steps: [
        { text: `p(0) = 0 \u2212 0 + 6 = ${evaluate(P_TWO, 0)}.`, reasoning: 'Substituting 0 leaves only the constant term, which is why p(0) always gives the y-intercept.' },
        { text: `p(1) = 1 \u2212 5 + 6 = ${evaluate(P_TWO, 1)}.`, reasoning: 'Each term is evaluated at x = 1 and the results added, with the signs carried from the polynomial.' },
        { text: `p(2) = 4 \u2212 10 + 6 = ${evaluate(P_TWO, 2)}.`, reasoning: 'The three terms cancel exactly, which is what makes this input special.' },
        { text: 'Only x = 2 gives a value of 0, so 2 is a zero and 0 and 1 are not.', reasoning: 'Being a zero is a property of the INPUT, so the question is which x makes the output vanish \u2014 not which output happens to be interesting.' },
      ],
      answer: `p(0) = ${evaluate(P_TWO, 0)}, p(1) = ${evaluate(P_TWO, 1)}, p(2) = ${evaluate(P_TWO, 2)}; only 2 is a zero.`,
      visualRef: 'G_TWO',
    },
    {
      id: 's22a.we2',
      prompt: `Read the zeroes of ${P_TWO.label} from its graph, and confirm them algebraically.`,
      steps: [
        { text: `The curve meets the x-axis at x = ${Z(P_TWO)[0]} and x = ${Z(P_TWO)[1]}.`, reasoning: 'Those are the only points where the y-coordinate is 0, and a zero is precisely an x with p(x) = 0.' },
        { text: `Check the first: p(${Z(P_TWO)[0]}) = ${evaluate(P_TWO, 2)}.`, reasoning: 'Reading a graph suggests an answer; substituting confirms it exactly, which a picture cannot.' },
        { text: `Check the second: p(${Z(P_TWO)[1]}) = 9 \u2212 15 + 6 = ${evaluate(P_TWO, 3)}.`, reasoning: 'Both checks are needed, since a graph could be misread at either intercept.' },
        { text: `So the zeroes are ${Z(P_TWO).join(' and ')}.`, reasoning: 'The graph and the algebra agree, as they must \u2014 they describe the same polynomial.' },
      ],
      answer: `The zeroes are ${Z(P_TWO).join(' and ')}.`,
      visualRef: 'G_TWO',
    },
    {
      id: 's22a.we3',
      prompt: `A student says that because ${P_TWO.label} has constant term 6, one of its zeroes is 6. What has gone wrong?`,
      steps: [
        { text: 'The constant term is p(0), the value where the graph meets the y-axis.', reasoning: 'Substituting x = 0 kills every term containing x, leaving only the constant \u2014 so the two are the same number by construction.' },
        { text: `Check directly: p(6) = 36 \u2212 30 + 6 = ${evaluate(P_TWO, 6)}, which is not 0.`, reasoning: 'A single substitution settles the claim without any argument about intercepts.' },
        { text: 'The y-intercept is a value of p; a zero is a value of x.', reasoning: 'They live on different axes and measure different things, so one can never be read off as the other.' },
        { text: `The actual zeroes are ${Z(P_TWO).join(' and ')}.`, reasoning: 'Both make p vanish, and both appear on the graph as points on the x-axis rather than the y-axis.' },
      ],
      answer: `No \u2014 6 is the y-intercept; p(6) = ${evaluate(P_TWO, 6)}. The zeroes are ${Z(P_TWO).join(' and ')}.`,
      visualRef: 'G_TWO',
    },
  ],
  guidedPractice: [
    { id: 's22a.g1', prompt: `Is x = 3 a zero of ${P_RATIONAL.label}?`, hint: 'Substitute and evaluate.', answer: `Yes \u2014 p(3) = ${evaluate(P_RATIONAL, 3)}.`, rationale: '2(9) \u2212 5(3) \u2212 3 = 18 \u2212 15 \u2212 3 = 0, so 3 makes the polynomial vanish and is therefore a zero.' },
    { id: 's22a.g2', prompt: `What is the y-intercept of ${P_RATIONAL.label}, and is it a zero?`, hint: 'Substitute 0.', answer: `${yIntercept(P_RATIONAL)}, and no.`, rationale: `p(0) = ${yIntercept(P_RATIONAL)}, which is where the curve meets the y-axis. A zero would be an x making p vanish, and p(${yIntercept(P_RATIONAL)}) is nowhere near 0.` },
    { id: 's22a.g3', prompt: 'Why is "meets the x-axis" better wording than "crosses the x-axis"?', hint: 'Can a curve touch without crossing?', answer: 'Because a curve can touch the axis and turn back without crossing it.', rationale: 'That case is still a zero, since the value there is 0, so "crosses" would wrongly exclude it.' },
  ],
  independentPractice: [
    { id: 's22a.i1', prompt: `For ${P_TWO.label}, find p(4).`, answer: `${evaluate(P_TWO, 4)}.`, rationale: '16 \u2212 20 + 6 = 2. Since this is not 0, x = 4 is not a zero.' },
    { id: 's22a.i2', prompt: `Is x = \u22121/2 a zero of ${P_RATIONAL.label}?`, answer: 'Yes.', rationale: '2(1/4) \u2212 5(\u22121/2) \u2212 3 = 0.5 + 2.5 \u2212 3 = 0, so it is a zero even though it is not a whole number.' },
    { id: 's22a.i3', prompt: 'Explain the difference between a zero of a polynomial and its y-intercept, in one sentence.', answer: 'A zero is an input making the value 0; the y-intercept is the value at the input 0.', rationale: 'One is an x and the other is a y, which is why neither can be read off in place of the other.' },
    { id: 's22a.i4', prompt: 'A graph appears to meet the x-axis just past 1.4. Can you conclude the zero is exactly 1.4?', answer: 'No.', rationale: 'A graph read by eye gives approximate information. The zero could be \u221a2, or 1.41, or something else; only algebra or a marked exact point settles it.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's22a.td1',
      prompt: 'Why is the y-intercept of a polynomial not generally one of its zeroes?',
      expectedReasoning:
        'They answer different questions. The y-intercept is p(0) \u2014 an output, found by putting 0 in. A zero is an input that makes the output 0. One is a value on the vertical axis and the other a value on the horizontal axis, so they are not even the same kind of quantity. The only way a number could be both is by coincidence, and it would still be playing two unrelated roles. For x\u00b2 \u2212 5x + 6 the y-intercept is 6, and p(6) is 6, not 0.',
    },
    {
      id: 's22a.td2',
      prompt: 'How could you tell that a drawn graph does not belong to a stated polynomial?',
      expectedReasoning:
        'Pick a convenient x where the curve has a readable y, and evaluate the polynomial there. If the two disagree, the graph is not of that polynomial. The y-intercept is the easiest such check, since p(0) is just the constant term and the curve\u2019s crossing of the vertical axis is easy to read. Checking the x-intercepts against the zeroes is another: if the curve meets the axis somewhere the polynomial does not vanish, one of them is wrong.',
    },
  ],
  summary:
    `p(k) is the polynomial\u2019s value at x = k, and a ZERO is an x making that value 0. On the graph of y = p(x), the zeroes are the x-coordinates where the curve MEETS the x-axis \u2014 "meets" rather than "crosses", because a curve may touch and turn back. The y-intercept is p(0), an output rather than an input, and is not a zero: for ${P_TWO.label} it is ${yIntercept(P_TWO)} while the zeroes are ${Z(P_TWO).join(' and ')}.`,
  nextStep: 'Next you will count how many zeroes a polynomial has from the shape of its graph.',
  teacher: teacher(
    'Students evaluate polynomials and identify zeroes as x-intercepts, distinguishing them from the y-intercept.',
    ['Polynomials and degree', 'Graphing from Class IX'],
    ['Is that an input or an output?', 'Substitute and see.', 'Meets the axis \u2014 crossing is only one way to meet it.'],
    [
      'The constant-term confusion in the third worked example is worth the time; 6 appearing as both the constant term and a plausible-looking answer is exactly how it takes hold.',
      'Insist on "meets" from the start. Students who learn "crosses" here will miscount the repeated case in the next lesson.',
      'Say plainly that polynomials are not new. What is new is the graphical reading.',
    ],
    ['Ask whether the constant term is a zero.', 'Ask why "meets" is preferred to "crosses".'],
    ['Have the student write p(k) = ... as a full substitution line before judging whether k is a zero.'],
    ['Ask what p(0) tells you about where the curve starts.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_2_2B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s2_2_counting_zeroes_lesson',
  contentArtifactVersion: 1,
  source: source('2.2', 'Geometrical Meaning of the Zeroes of a Polynomial', 11, 'ncert_jemh1_s2_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s2_2'],
    mayAssume: ['Zeroes as x-intercepts', 'Degree of a polynomial'],
    mustNotIntroduce: [{ concept: 'Relations between zeroes and coefficients', belongsToSection: 'ncert_jemh1_s2_3' }],
  },
  learningGoal:
    'You will decide how many real zeroes a polynomial has from the shape of its graph, including the cases where the curve touches the axis or misses it entirely.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Identify an x-intercept on a graph.', 'State the degree of a quadratic.', 'Say what a zero of a polynomial is.'],
    ifNotReady: 'Revise the previous lesson. Counting intercepts assumes you know what an intercept means.',
  },
  vocabulary: [
    { term: 'distinct zeroes', meaning: 'Zeroes that are different numbers; a value occurring twice in a factorisation still counts once.' },
    { term: 'repeated zero', meaning: 'A zero that appears twice in the factorisation, where the curve touches the axis instead of crossing it.' },
    { term: 'at most', meaning: 'No more than \u2014 a degree-n polynomial has at most n real zeroes, and may have fewer.' },
  ],
  explanation: [
    'A quadratic\u2019s graph is a parabola: it opens upward when the leading coefficient is positive and downward when it is negative. Whichever way it opens, there are exactly three things it can do about the x-axis.',
    `It can cut the axis at two separate points. Then there are two distinct real zeroes, as for ${P_TWO.label}, whose curve meets the axis at ${Z(P_TWO).join(' and ')}.`,
    `It can come down to the axis, touch it, and turn back without passing through. Then there is ONE distinct real zero \u2014 for ${P_REPEATED.label} the curve touches at x = ${Z(P_REPEATED)[0]}. The factorisation is (x \u2212 ${Z(P_REPEATED)[0]})\u00b2, so the zero occurs twice there, but it is one point on the axis and one number, not two.`,
    'This is why the previous lesson insisted on "meets" rather than "crosses". The touching case meets the axis without crossing it, and it is a perfectly ordinary zero.',
    `It can miss the axis altogether. For ${P_NONE.label} the lowest point of the curve lies above the axis, so no value of x makes the polynomial 0. Within the real numbers used in this course, that polynomial has no real zeroes.`,
    'The careful wording matters there. Saying it has no zeroes at all would claim more than this course establishes, so the statement is confined to real zeroes.',
    'One general limit is worth stating. A polynomial of degree n has AT MOST n real zeroes \u2014 so a quadratic has at most two, a cubic at most three. The degree does not say how many there are: all three quadratic cases above have degree 2 and two, one and zero real zeroes respectively.',
    'The same reading works for a cubic graph: count the points where the curve meets the axis, and that is the number of distinct real zeroes, which may be three, two or one.',
  ],
  representations: ['Three quadratic curves showing two intercepts, one, and none'],
  visuals: [G_TWO, G_REPEATED, G_NONE],
  visualsById: { G_TWO, G_REPEATED, G_NONE },
  workedExamples: [
    {
      id: 's22b.we1',
      prompt: `How many real zeroes does ${P_REPEATED.label} have? Read the graph, then check.`,
      steps: [
        { text: `The curve comes down to the axis at x = ${Z(P_REPEATED)[0]} and turns back without crossing.`, reasoning: 'Touching is still meeting, so this point is a zero \u2014 which is exactly why the wording from the last lesson was chosen.' },
        { text: `That is one point on the axis, so there is one distinct real zero.`, reasoning: 'The count is of points where the curve meets the axis, and here there is a single such point.' },
        { text: `Check: p(${Z(P_REPEATED)[0]}) = 9 \u2212 18 + 9 = ${evaluate(P_REPEATED, 3)}.`, reasoning: 'Substituting confirms the reading, since a touch is easy to mistake for a near miss on a drawn curve.' },
        { text: `The factorisation is (x \u2212 ${Z(P_REPEATED)[0]})\u00b2, so the zero occurs twice in it.`, reasoning: 'Occurring twice in the factorisation and being two separate x-intercepts are different claims; only the first is true here.' },
      ],
      answer: `One distinct real zero, at x = ${Z(P_REPEATED)[0]}, repeated in the factorisation.`,
      visualRef: 'G_REPEATED',
    },
    {
      id: 's22b.we2',
      prompt: `How many real zeroes does ${P_NONE.label} have?`,
      steps: [
        { text: 'The curve opens upward and its lowest point lies above the x-axis.', reasoning: 'If the minimum is above the axis, no part of the curve can reach it.' },
        { text: 'So the curve does not meet the x-axis anywhere.', reasoning: 'Not in the drawn window, and not outside it either, since the curve only rises further away from the minimum.' },
        { text: 'Within the real numbers, the polynomial has no real zeroes.', reasoning: 'The statement is confined to real zeroes, because that is what this course works with.' },
        { text: `A check supports it: p(0) = ${evaluate(P_NONE, 0)} and p(\u22121) = ${evaluate(P_NONE, -1)}, both positive.`, reasoning: 'Values staying positive is consistent with the reading, though a few samples are evidence rather than proof.' },
      ],
      answer: 'No real zeroes.',
      visualRef: 'G_NONE',
    },
    {
      id: 's22b.we3',
      prompt: 'A student says a quadratic always has two zeroes because its degree is 2. Give two counterexamples.',
      steps: [
        { text: 'The degree gives an upper limit, not a count: at most n real zeroes.', reasoning: 'A polynomial can fall short of that limit, and the graph is where the shortfall becomes visible.' },
        { text: `${P_REPEATED.label} has degree 2 and one distinct real zero.`, reasoning: 'Its curve touches the axis once, so there is a single point to count however the factorisation is written.' },
        { text: `${P_NONE.label} has degree 2 and no real zeroes.`, reasoning: 'Its curve stays entirely above the axis, so there is no x at which the value is 0.' },
        { text: 'So all three counts \u2014 two, one and none \u2014 occur at degree 2.', reasoning: 'Degree constrains the maximum and says nothing about which of the possibilities actually happens.' },
      ],
      answer: `Both ${P_REPEATED.label} and ${P_NONE.label} have degree 2 with fewer than two real zeroes.`,
      visualRef: 'G_NONE',
    },
  ],
  guidedPractice: [
    { id: 's22b.g1', prompt: 'A parabola touches the x-axis at one point. How many distinct real zeroes?', hint: 'Count points on the axis.', answer: 'One.', rationale: 'Touching is meeting, so it is a zero; but there is one point, so one distinct zero, even though the factorisation repeats it.' },
    { id: 's22b.g2', prompt: 'A cubic graph meets the x-axis at three separate points. How many distinct real zeroes?', hint: 'The same reading applies.', answer: 'Three.', rationale: 'Each meeting point is an x where the value is 0, and a cubic may have at most three real zeroes, so this reaches the limit.' },
    { id: 's22b.g3', prompt: 'Can a quadratic have three real zeroes?', hint: 'What does the degree limit?', answer: 'No \u2014 at most two.', rationale: 'A degree-2 polynomial has at most 2 real zeroes, so a graph meeting the axis three times could not be a quadratic.' },
  ],
  independentPractice: [
    { id: 's22b.i1', prompt: `How many real zeroes does ${P_RATIONAL.label} have?`, answer: 'Two.', rationale: `Its curve meets the axis at ${Z(P_RATIONAL).join(' and ')}, two separate points.` },
    { id: 's22b.i2', prompt: 'A degree-3 polynomial\u2019s graph meets the x-axis at exactly one point. Is that possible?', answer: 'Yes.', rationale: 'Three is the maximum, not the count. A cubic may meet the axis once, twice or three times.' },
    { id: 's22b.i3', prompt: 'Why should "no real zeroes" be said rather than "no zeroes"?', answer: 'Because the claim is about the real numbers used in this course.', rationale: 'The stronger statement would assert something beyond what this course establishes, and would have to be unlearned later.' },
    { id: 's22b.i4', prompt: 'A curve touches the axis at x = 4 and crosses it at x = \u22121. How many distinct real zeroes?', answer: 'Two.', rationale: 'Both are points where the curve meets the axis. Touching and crossing both count; what differs is only how the curve behaves there.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's22b.td1',
      prompt: 'Why can a repeated zero produce only one x-intercept?',
      expectedReasoning:
        'An x-intercept is a POINT where the curve meets the axis, and a zero is a NUMBER x making the value 0. When a quadratic factorises as (x \u2212 a)\u00b2, the only value making it 0 is a, so there is one such number and therefore one such point. The factor appearing twice records something about the algebraic form \u2014 and shows up on the graph as the curve turning back instead of passing through \u2014 but it does not create a second place on the axis. Counting it as two intercepts would be counting the same point twice.',
    },
    {
      id: 's22b.td2',
      prompt: 'Can a quadratic have no real x-intercepts? What does its graph look like, and what would be wrong with saying it has no zeroes at all?',
      expectedReasoning:
        'Yes. The parabola lies entirely on one side of the axis \u2014 above it if it opens upward with its minimum positive, below if it opens downward with its maximum negative \u2014 so no x makes the value 0 and there are no real zeroes. Saying it has no zeroes at all would be a claim about every number system, and this course works only within the real numbers. The precise statement costs one word and does not have to be unlearned.',
    },
  ],
  summary:
    `A parabola can meet the x-axis twice, once, or not at all, and the count of meeting points is the number of distinct real zeroes. A curve that touches and turns back has ONE zero, repeated in the factorisation but a single point on the axis. A curve missing the axis has NO REAL zeroes \u2014 said that way, because the claim is confined to the real numbers. Degree gives an upper limit only: a degree-n polynomial has at most n real zeroes.`,
  nextStep: 'Next you will find a relationship between those zeroes and the polynomial\u2019s coefficients.',
  teacher: teacher(
    'Students count distinct real zeroes from a graph and distinguish the limit set by degree from the actual count.',
    ['Zeroes as x-intercepts', 'Degree'],
    ['How many POINTS on the axis?', 'Repeated in the factorisation, one point on the graph.', 'No REAL zeroes \u2014 say the word real.'],
    [
      'The three curves should be met together. On the two-intercept case alone students conclude that degree equals the number of zeroes, and the other two are the correction.',
      'The repeated case is where "meets" earns its keep; a student who learned "crosses" will say there are no zeroes there.',
      'Keep cubics to counting intercepts. Their coefficient relations are outside the current scope.',
    ],
    ['Ask how many zeroes a touching parabola has.', 'Ask whether degree 2 forces two zeroes.'],
    ['Have the student mark each point where the curve meets the axis before counting anything.'],
    ['Ask what a cubic graph looks like when it has exactly one real zero.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_2_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s2_3_zeroes_coefficients_lesson',
  contentArtifactVersion: 1,
  source: source('2.3', 'Relationship between Zeroes and Coefficients of a Polynomial', 18, 'ncert_jemh1_s2_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s2_2'],
    mayAssume: ['Zeroes of a polynomial', 'Factorising a quadratic', 'Expanding a product of two brackets'],
    mustNotIntroduce: [
      { concept: 'Constructing a quadratic from sum and product', belongsToSection: 'ncert_jemh1_s2_3b' },
      { concept: 'Coefficient relations for cubics', belongsToSection: 'outside_current_scope' },
    ],
  },
  learningGoal:
    'You will derive the relationships sum of zeroes = \u2212b/a and product of zeroes = c/a for a quadratic, by expanding its factor form and comparing coefficients.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find the zeroes of a quadratic by factorising.', 'Expand (x \u2212 2)(x \u2212 3).', 'Read a, b and c from a quadratic with their signs.'],
    ifNotReady: 'Revise factorising quadratics. The derivation here is an expansion followed by a comparison.',
  },
  vocabulary: [
    { term: 'sum of zeroes', meaning: 'The two zeroes added together, usually written \u03b1 + \u03b2.' },
    { term: 'product of zeroes', meaning: 'The two zeroes multiplied, usually written \u03b1\u03b2.' },
    { term: 'factor form', meaning: 'A quadratic written as a(x \u2212 \u03b1)(x \u2212 \u03b2), with its zeroes visible.' },
    { term: 'comparing coefficients', meaning: 'Matching the coefficient of each power of x in two equal expressions.' },
  ],
  explanation: [
    'There is a relationship between a quadratic\u2019s zeroes and its coefficients, and it comes out of expanding the factor form \u2014 it is not a formula to be taken on trust.',
    'Suppose a quadratic ax\u00b2 + bx + c has zeroes \u03b1 and \u03b2. Then it can be written in factor form as a(x \u2212 \u03b1)(x \u2212 \u03b2): the leading coefficient a is kept so the two forms have the same x\u00b2 term, and each bracket vanishes at one of the zeroes.',
    'Expand it. (x \u2212 \u03b1)(x \u2212 \u03b2) = x\u00b2 \u2212 (\u03b1 + \u03b2)x + \u03b1\u03b2, so a(x \u2212 \u03b1)(x \u2212 \u03b2) = ax\u00b2 \u2212 a(\u03b1 + \u03b2)x + a\u03b1\u03b2.',
    'Now compare with ax\u00b2 + bx + c. The x\u00b2 terms already match. Comparing the x terms gives b = \u2212a(\u03b1 + \u03b2), so \u03b1 + \u03b2 = \u2212b/a. Comparing the constants gives c = a\u03b1\u03b2, so \u03b1\u03b2 = c/a.',
    'The minus sign in the sum is the single highest risk in this chapter. It arrives because expanding (x \u2212 \u03b1)(x \u2212 \u03b2) produces \u2212(\u03b1 + \u03b2) as the coefficient of x \u2014 the brackets subtract the zeroes. Writing \u03b1 + \u03b2 = b/a reverses the sign of every answer and is not detectable from the size of the result.',
    `Check it on ${P_TWO.label}, where a = 1, b = \u22125, c = 6 and the zeroes are ${Z(P_TWO).join(' and ')}. The sum is ${Z(P_TWO).map(Number).reduce((x, y) => x + y, 0)}, and \u2212b/a = \u2212(\u22125)/1 = ${S(P_TWO)}. The product is ${Z(P_TWO).map(Number).reduce((x, y) => x * y, 1)}, and c/a = 6/1 = ${PR(P_TWO)}.`,
    `The relations hold when a is not 1 as well. For ${P_RATIONAL.label} the zeroes are ${Z(P_RATIONAL).join(' and ')}, with sum ${S(P_RATIONAL)} and product ${PR(P_RATIONAL)} \u2014 which is why the division by a is part of the statement rather than an afterthought.`,
    'These relations are stated here for quadratics. The current chapter does not extend them to cubics, so nothing in this lesson should be applied to a degree-3 polynomial.',
  ],
  representations: ['A quadratic in both coefficient form and factor form, with coefficients compared'],
  visuals: [G_TWO, G_RATIONAL],
  visualsById: { G_TWO, G_RATIONAL },
  workedExamples: [
    {
      id: 's23a.we1',
      prompt: 'Derive the sum and product relations for a quadratic ax\u00b2 + bx + c with zeroes \u03b1 and \u03b2.',
      steps: [
        { text: 'Write the quadratic in factor form: a(x \u2212 \u03b1)(x \u2212 \u03b2).', reasoning: 'Each bracket vanishes at one zero, and keeping the factor a ensures both forms have the same coefficient of x\u00b2.' },
        { text: 'Expand the brackets: (x \u2212 \u03b1)(x \u2212 \u03b2) = x\u00b2 \u2212 \u03b2x \u2212 \u03b1x + \u03b1\u03b2 = x\u00b2 \u2212 (\u03b1 + \u03b2)x + \u03b1\u03b2.', reasoning: 'Both x terms are negative because each bracket subtracts a zero, which is where the minus sign in the final relation originates.' },
        { text: 'Multiply by a: ax\u00b2 \u2212 a(\u03b1 + \u03b2)x + a\u03b1\u03b2.', reasoning: 'Every term is multiplied, not just the first, so the comparison that follows is between like terms.' },
        { text: 'Compare the x terms with bx: b = \u2212a(\u03b1 + \u03b2), so \u03b1 + \u03b2 = \u2212b/a.', reasoning: 'Two equal expressions must agree in each coefficient, which is what licenses reading the relation off.' },
        { text: 'Compare the constants with c: c = a\u03b1\u03b2, so \u03b1\u03b2 = c/a.', reasoning: 'The same comparison applied to the term with no x gives the product relation.' },
      ],
      answer: '\u03b1 + \u03b2 = \u2212b/a and \u03b1\u03b2 = c/a.',
    },
    {
      id: 's23a.we2',
      prompt: `Verify both relations for ${P_TWO.label}.`,
      steps: [
        { text: 'Here a = 1, b = \u22125 and c = 6, with the signs read from the polynomial as written.', reasoning: 'b is \u22125, not 5; misreading it would reverse the sum and go unnoticed because the size would be right.' },
        { text: `Factorising gives (x \u2212 2)(x \u2212 3), so the zeroes are ${Z(P_TWO).join(' and ')}.`, reasoning: 'Each bracket is zero at one value, and substituting confirms both give p(x) = 0.' },
        { text: `Sum: 2 + 3 = 5, and \u2212b/a = \u2212(\u22125)/1 = ${S(P_TWO)}.`, reasoning: 'The double negative is where a sign slip would show, and the two agree.' },
        { text: `Product: 2 \u00d7 3 = 6, and c/a = 6/1 = ${PR(P_TWO)}.`, reasoning: 'The product relation has no sign change, which is part of why the sum is the one that catches people.' },
      ],
      answer: `Sum ${S(P_TWO)}, product ${PR(P_TWO)}; both relations hold.`,
      visualRef: 'G_TWO',
    },
    {
      id: 's23a.we3',
      prompt: `Verify both relations for ${P_RATIONAL.label}, where a is not 1.`,
      steps: [
        { text: 'a = 2, b = \u22125, c = \u22123.', reasoning: 'Both b and c are negative here, so two sign readings have to be right rather than one.' },
        { text: `Factorising gives (2x + 1)(x \u2212 3), so the zeroes are ${Z(P_RATIONAL).join(' and ')}.`, reasoning: 'Setting each factor to zero gives x = \u22121/2 and x = 3, and both substitute back to 0 exactly.' },
        { text: `Sum: \u22121/2 + 3 = 5/2, and \u2212b/a = \u2212(\u22125)/2 = ${S(P_RATIONAL)}.`, reasoning: 'Dividing by a matters now: without it the relation would give 5 instead of 5/2.' },
        { text: `Product: (\u22121/2) \u00d7 3 = \u22123/2, and c/a = \u22123/2 = ${PR(P_RATIONAL)}.`, reasoning: 'A negative product is expected when the zeroes have opposite signs, which is a useful check on the factorisation.' },
      ],
      answer: `Sum ${S(P_RATIONAL)}, product ${PR(P_RATIONAL)}; both hold with a = 2.`,
      visualRef: 'G_RATIONAL',
    },
  ],
  guidedPractice: [
    { id: 's23a.g1', prompt: 'For x\u00b2 \u2212 7x + 12, state the sum and product of the zeroes without factorising.', hint: 'Read a, b and c with their signs.', answer: 'Sum 7, product 12.', rationale: 'a = 1, b = \u22127, c = 12, so \u2212b/a = 7 and c/a = 12. Factorising would give 3 and 4, which agree.' },
    { id: 's23a.g2', prompt: 'For 3x\u00b2 + 6x \u2212 9, state the sum and product.', hint: 'Divide by a.', answer: 'Sum \u22122, product \u22123.', rationale: '\u2212b/a = \u22126/3 = \u22122 and c/a = \u22129/3 = \u22123. Forgetting to divide by 3 would give \u22126 and \u22129.' },
    { id: 's23a.g3', prompt: 'Why does the sum carry a minus sign but the product does not?', hint: 'Expand (x \u2212 \u03b1)(x \u2212 \u03b2).', answer: 'Because expanding gives \u2212(\u03b1 + \u03b2) as the x coefficient and +\u03b1\u03b2 as the constant.', rationale: 'Each bracket subtracts a zero, so the two x terms are both negative; multiplying two negatives in the constant term gives a positive.' },
  ],
  independentPractice: [
    { id: 's23a.i1', prompt: 'For x\u00b2 + 4x \u2212 21, state the sum and product of the zeroes.', answer: 'Sum \u22124, product \u221221.', rationale: 'b = +4 so \u2212b/a = \u22124, and c/a = \u221221. The zeroes 3 and \u22127 confirm both.' },
    { id: 's23a.i2', prompt: 'A student says the sum of the zeroes of x\u00b2 \u2212 8x + 15 is \u22128. What went wrong?', answer: 'The minus sign was dropped: the sum is 8.', rationale: '\u2212b/a with b = \u22128 gives \u2212(\u22128) = 8. The zeroes 3 and 5 add to 8, so the student reported b/a rather than \u2212b/a.' },
    { id: 's23a.i3', prompt: `Verify the relations for ${P_REPEATED.label}, whose zero is repeated.`, answer: `Sum ${S(P_REPEATED)}, product ${PR(P_REPEATED)}.`, rationale: 'The factorisation is (x \u2212 3)\u00b2, so the zeroes used in the relations are 3 and 3: their sum is 6 = \u2212(\u22126)/1 and their product is 9 = 9/1.' },
    { id: 's23a.i4', prompt: 'Can these relations be used on a cubic?', answer: 'Not in this chapter.', rationale: 'The relations derived here come from expanding a product of TWO brackets. The current scope states them for quadratics only.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's23a.td1',
      prompt: 'Where exactly does the minus sign in \u03b1 + \u03b2 = \u2212b/a come from? Describe what would go wrong without it.',
      expectedReasoning:
        'It comes from the factor form. Each bracket is (x \u2212 \u03b1), subtracting a zero, so expanding produces \u2212\u03b1x \u2212 \u03b2x, that is \u2212(\u03b1 + \u03b2)x. Comparing that with bx gives b = \u2212a(\u03b1 + \u03b2), and rearranging moves the minus onto the b. Without it, every sum would come out with the wrong sign \u2014 and because the size would be right, nothing about the answer would look suspicious. The product escapes this because multiplying the two negatives in \u2212\u03b1 and \u2212\u03b2 gives a positive \u03b1\u03b2.',
    },
    {
      id: 's23a.td2',
      prompt: 'The relations divide by a. Why is that necessary, and when can it be ignored?',
      expectedReasoning:
        'Because the factor form carries the leading coefficient: a(x \u2212 \u03b1)(x \u2212 \u03b2) has x term \u2212a(\u03b1 + \u03b2) and constant a\u03b1\u03b2, so recovering the sum and product means dividing those by a. It can be ignored only when a = 1, which is why monic examples hide the issue; for 2x\u00b2 \u2212 5x \u2212 3 the sum is 5/2 rather than 5, and omitting the division doubles it.',
    },
  ],
  summary:
    `Writing a quadratic as a(x \u2212 \u03b1)(x \u2212 \u03b2) and expanding gives ax\u00b2 \u2212 a(\u03b1 + \u03b2)x + a\u03b1\u03b2. Comparing coefficients with ax\u00b2 + bx + c gives \u03b1 + \u03b2 = \u2212b/a and \u03b1\u03b2 = c/a. The minus sign comes from the brackets subtracting the zeroes, and the division by a matters whenever a is not 1 \u2014 for ${P_RATIONAL.label} the sum is ${S(P_RATIONAL)}, not 5. These relations are for quadratics; this chapter does not extend them to cubics.`,
  nextStep: 'Next you will run the relations backwards and build a quadratic from a given sum and product.',
  teacher: teacher(
    'Students derive the sum and product relations by expanding the factor form and comparing coefficients.',
    ['Factorising quadratics', 'Expanding brackets'],
    ['Where does the minus come from? Expand and look.', 'What is b, with its sign?', 'Divide by a \u2014 unless a is 1.'],
    [
      'Deriving rather than announcing is what makes the minus sign memorable. Students who meet it as a formula reproduce it as b/a about as often as \u2212b/a.',
      'The non-monic example is essential; monic ones hide the division by a entirely.',
      'Keep cubic relations out. They are outside the current scope and students will try to extend the pattern.',
    ],
    ['Ask where the minus sign comes from.', 'Ask what the sum is for 3x\u00b2 + 6x \u2212 9.'],
    ['Have the student write a, b and c in a column with signs before using either relation.'],
    ['Ask what the relations give when the two zeroes are equal.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_2_3B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s2_3_construct_lesson',
  contentArtifactVersion: 1,
  source: source('2.3', 'Relationship between Zeroes and Coefficients of a Polynomial', 18, 'ncert_jemh1_s2_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s2_3'],
    mayAssume: ['The sum and product relations', 'Expanding a product of two brackets'],
    mustNotIntroduce: [{ concept: 'Coefficient relations for cubics', belongsToSection: 'outside_current_scope' }],
  },
  learningGoal:
    'You will construct a quadratic polynomial from a given sum and product of zeroes, and explain why the zeroes do not determine the polynomial uniquely.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['State the sum and product relations.', 'Expand k(x \u2212 \u03b1)(x \u2212 \u03b2).', 'Verify a zero by substitution.'],
    ifNotReady: 'Revise the previous lesson. This one runs the same relations in the opposite direction.',
  },
  vocabulary: [
    { term: 'monic polynomial', meaning: 'A polynomial whose leading coefficient is 1.' },
    { term: 'scale factor', meaning: 'A non-zero constant k multiplying a whole polynomial; it changes the coefficients but not the zeroes.' },
  ],
  explanation: [
    'The relations run both ways. Given a quadratic, they produce the sum and product of its zeroes; given a sum and product, they produce a quadratic.',
    'If the zeroes have sum S and product P, then from \u03b1 + \u03b2 = \u2212b/a and \u03b1\u03b2 = c/a, taking a = 1 gives b = \u2212S and c = P. So x\u00b2 \u2212 Sx + P is a quadratic with those zeroes \u2014 note the minus sign in front of S, coming from the same place as before.',
    `For a sum of 5 and a product of 6, that gives ${P_TWO.label}, whose zeroes are indeed ${Z(P_TWO).join(' and ')}.`,
    'But it is not THE quadratic with those zeroes, and that distinction matters. Multiply the whole polynomial by any non-zero constant k and the zeroes are unchanged: if p(\u03b1) = 0, then kp(\u03b1) = k \u00d7 0 = 0 as well.',
    `So ${P_SCALED.label} \u2014 which is three times ${P_TWO.label} \u2014 has exactly the same zeroes, ${Z(P_SCALED).join(' and ')}, while every coefficient differs. Its graph is a different curve, steeper and meeting the y-axis at ${yIntercept(P_SCALED)} instead of ${yIntercept(P_TWO)}, but it crosses the x-axis at the same two places.`,
    'That is why the general answer is k(x\u00b2 \u2212 Sx + P) for any non-zero k, and why choosing k = 1 is a choice rather than a deduction. Saying "the quadratic is x\u00b2 \u2212 5x + 6" without that qualification claims more than the zeroes support.',
    'It also explains what the zeroes leave undetermined: they fix the ratios b/a and c/a, but not a itself. One more piece of information \u2014 a value of the polynomial at some point, say \u2014 is what pins down k.',
  ],
  representations: ['Two quadratics with the same zeroes and different coefficients'],
  visuals: [G_TWO], visualsById: { G_TWO },
  workedExamples: [
    {
      id: 's23b.we1',
      prompt: 'Construct a quadratic whose zeroes have sum 5 and product 6.',
      steps: [
        { text: 'The relations give b = \u2212Sa and c = Pa; take a = 1 for the simplest choice.', reasoning: 'Any non-zero a would work, and choosing 1 is the conventional simplest case rather than the only possibility.' },
        { text: `With a = 1: b = \u22125 and c = 6, so the polynomial is ${P_TWO.label}.`, reasoning: 'The minus on b comes from \u03b1 + \u03b2 = \u2212b/a rearranged, the same sign that caught people in the last lesson.' },
        { text: `Check by factorising: (x \u2212 2)(x \u2212 3), so the zeroes are ${Z(P_TWO).join(' and ')}.`, reasoning: 'Constructing and then checking closes the loop, since the construction could have gone wrong in the sign.' },
        { text: `Their sum is 5 and product is 6, as required.`, reasoning: 'Verifying against the original requirement rather than against the formula catches an error made while applying it.' },
      ],
      answer: `${P_TWO.label} is one such quadratic.`,
      visualRef: 'G_TWO',
    },
    {
      id: 's23b.we2',
      prompt: `Is ${P_TWO.label} the only quadratic with zeroes ${Z(P_TWO).join(' and ')}?`,
      steps: [
        { text: 'Multiply it by 3 to get ' + P_SCALED.label + '.', reasoning: 'Multiplying a whole polynomial by a non-zero constant is always possible and produces a different polynomial.' },
        { text: `Its zeroes are still ${Z(P_SCALED).join(' and ')}.`, reasoning: 'If p(\u03b1) = 0 then 3p(\u03b1) = 0 too, so scaling cannot create or destroy a zero.' },
        { text: `But its coefficients all differ, and its y-intercept is ${yIntercept(P_SCALED)} rather than ${yIntercept(P_TWO)}.`, reasoning: 'The two curves meet the x-axis at the same places while being different curves everywhere else.' },
        { text: 'So the general answer is k(x\u00b2 \u2212 5x + 6) for any non-zero k.', reasoning: 'The zeroes determine the polynomial only up to that scale factor, which is why the answer must carry the k or say that k = 1 was chosen.' },
      ],
      answer: `No \u2014 any non-zero multiple has the same zeroes; ${P_SCALED.label} is one.`,
    },
    {
      id: 's23b.we3',
      prompt: 'Construct a quadratic whose zeroes have sum \u22123 and product \u221210, then verify.',
      steps: [
        { text: 'Taking a = 1: b = \u2212S = \u2212(\u22123) = 3 and c = P = \u221210.', reasoning: 'A negative sum gives a POSITIVE b, which is the double-negative step where errors concentrate.' },
        { text: 'So the polynomial is x\u00b2 + 3x \u2212 10.', reasoning: 'Writing it out with the signs settled makes the next check straightforward.' },
        { text: 'Factorising: (x + 5)(x \u2212 2), so the zeroes are \u22125 and 2.', reasoning: 'The numbers multiplying to \u221210 and adding to 3 are 5 and \u22122, giving these factors.' },
        { text: 'Their sum is \u22125 + 2 = \u22123 and product is \u22125 \u00d7 2 = \u221210, as required.', reasoning: 'Both match the given data, confirming the sign on b was handled correctly.' },
      ],
      answer: 'x\u00b2 + 3x \u2212 10 (or any non-zero multiple of it).',
    },
  ],
  guidedPractice: [
    { id: 's23b.g1', prompt: 'Construct a quadratic with sum of zeroes 7 and product 10.', hint: 'Use x\u00b2 \u2212 Sx + P.', answer: 'x\u00b2 \u2212 7x + 10.', rationale: 'It factorises as (x \u2212 2)(x \u2212 5), whose zeroes add to 7 and multiply to 10.' },
    { id: 's23b.g2', prompt: 'Construct a quadratic with sum \u22124 and product 3.', hint: 'Mind the sign on S.', answer: 'x\u00b2 + 4x + 3.', rationale: 'b = \u2212(\u22124) = 4. It factorises as (x + 1)(x + 3), whose zeroes \u22121 and \u22123 add to \u22124 and multiply to 3.' },
    { id: 's23b.g3', prompt: 'Does multiplying a polynomial by 5 change its zeroes?', hint: 'What is 5 times 0?', answer: 'No.', rationale: 'If p(\u03b1) = 0 then 5p(\u03b1) = 0, so every zero survives. The coefficients and the curve change; the x-intercepts do not.' },
  ],
  independentPractice: [
    { id: 's23b.i1', prompt: 'Construct a quadratic with sum of zeroes 0 and product \u22129.', answer: 'x\u00b2 \u2212 9.', rationale: 'b = \u22120 = 0 and c = \u22129, giving x\u00b2 \u2212 9 = (x \u2212 3)(x + 3). The zeroes 3 and \u22123 add to 0.' },
    { id: 's23b.i2', prompt: 'Two students give x\u00b2 \u2212 5x + 6 and 2x\u00b2 \u2212 10x + 12 for the same question. Are both right?', answer: 'Yes.', rationale: 'The second is twice the first, so it has the same zeroes. Both are valid unless the question asked for the monic one.' },
    { id: 's23b.i3', prompt: 'What extra information would pin down k?', answer: 'The value of the polynomial at one point other than a zero.', rationale: 'Knowing p(0) = 12, say, fixes the constant term and so determines k. A value at a zero gives 0 whatever k is, so it tells you nothing.' },
    { id: 's23b.i4', prompt: 'A student says the zeroes determine the polynomial completely. What is the correction?', answer: 'They determine it up to a non-zero scale factor.', rationale: 'The zeroes fix the ratios b/a and c/a but not a, so infinitely many quadratics share any given pair of zeroes.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's23b.td1',
      prompt: 'Why can two different polynomials have exactly the same zeroes?',
      expectedReasoning:
        'Because multiplying a polynomial by a non-zero constant leaves every zero intact: if p(\u03b1) = 0 then kp(\u03b1) = k \u00d7 0 = 0. The coefficients all change and the graph is a different curve \u2014 steeper or flatter, with a different y-intercept \u2014 but it meets the x-axis in exactly the same places. So x\u00b2 \u2212 5x + 6 and 3x\u00b2 \u2212 15x + 18 share the zeroes 2 and 3. The zeroes determine the ratios b/a and c/a and nothing more, which is exactly one piece of information short of determining the polynomial.',
    },
    {
      id: 's23b.td2',
      prompt: 'If you know the zeroes of a quadratic, what coefficient information remains undetermined, and how would one more fact settle it?',
      expectedReasoning:
        'The leading coefficient a remains free. The zeroes fix \u2212b/a and c/a, so once a is chosen, b and c follow; but nothing in the zeroes themselves picks a value of a. Any single value of the polynomial at a point that is not a zero settles it \u2014 knowing p(0), for instance, gives the constant term directly, and since c = aP that determines a. A value at a zero is useless, because every candidate gives 0 there regardless of a.',
    },
  ],
  summary:
    `From a sum S and product P, x\u00b2 \u2212 Sx + P is a quadratic with those zeroes \u2014 note the minus on S. It is not the only one: multiplying by any non-zero k leaves the zeroes unchanged while altering every coefficient, so ${P_SCALED.label} shares the zeroes ${Z(P_SCALED).join(' and ')} with ${P_TWO.label}. The general answer is k(x\u00b2 \u2212 Sx + P), and taking k = 1 is a choice that should be stated.`,
  nextStep: 'The chapter summary recapitulates the graphical reading and these relations.',
  teacher: teacher(
    'Students construct a quadratic from sum and product, and explain the scale freedom that remains.',
    ['The sum and product relations', 'Expanding brackets'],
    ['Minus the sum, plus the product.', 'Is that THE answer, or AN answer?', 'Scaling moves the curve, not the intercepts.'],
    [
      'The scale freedom is the point of this lesson, not a footnote. Students who miss it will mark a correct non-monic answer wrong.',
      'The negative-sum example is where the double negative bites; it deserves working slowly.',
      'A value at a zero pinning down nothing is worth asking about \u2014 it tests whether they understand what k does.',
    ],
    ['Ask whether multiplying by 5 changes the zeroes.', 'Ask what is left undetermined by the zeroes.'],
    ['Have the student write "k = 1 chosen" beside any constructed answer.'],
    ['Ask for three different quadratics with zeroes 1 and 4.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_POLYNOMIAL_SECTIONS: AuthoredSection[] = [
  C10_SECTION_2_2A, C10_SECTION_2_2B, C10_SECTION_2_3A, C10_SECTION_2_3B,
];
