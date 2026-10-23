// ===========================================================================
// v0.84.0 checkpoint 39 — CLASS 9 CHAPTER 7: PROBABILITY.
//
// Not an architecture pilot. The risk here is that a lesson can be
// arithmetically perfect and mathematically false, and the commonest way is
// to infer probabilities from the number of outcomes. "There are two
// outcomes, so each is one half" is wrong about a drawing pin, a biased
// spinner, and tomorrow's weather, and right about a fair coin only because
// the coin is fair.
//
// So the standard applied throughout this chapter is: every use of
// favourable over total names the assumption that licenses it, and the
// assumption is a stated property of the mechanism rather than a count of
// labels. One lesson is built around a case where the inference fails.
//
// Two splits (§7.1 and §7.2). No merges. No new representation: the sample
// space is a list, the tree is segments and labelled points.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const PROBABILITY_CHAPTER_ID = 'ncert_iemh1_ch07';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part I)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh1dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: PROBABILITY_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

const P = (id: string, x: number, y: number, label: string) => ({ id, x, y, label });

// The 0-to-1 scale, with events placed by their value rather than by feel.
const F_SCALE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_definition',
  status: 'concept_specific',
  points: [
    P('zero', 20, 90, '0 impossible'),
    P('quarter', 90, 90, '0.25'),
    P('half', 160, 90, '0.5'),
    P('three', 230, 90, '0.75'),
    P('one', 300, 90, '1 certain'),
  ],
  segments: [
    { from: 'zero', to: 'one' },
  ],
  caption: 'Every probability is a point on this line; nothing lies off either end.',
  altText:
    'A horizontal line marked from 0 at the left to 1 at the right, with 0.25, 0.5 and 0.75 marked between them. The left end is labelled impossible and the right end certain. Every probability is somewhere on this line, and no probability lies to the left of 0 or to the right of 1.',
};

// An unequal spinner: the sectors are drawn at the sizes the text claims,
// so the figure cannot suggest an equal split the mathematics denies.
const F_SPINNER: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_counterexample',
  status: 'concept_specific',
  points: [
    P('o', 110, 100, 'O'),
    P('a', 190, 100, 'A'),
    P('b', 110, 20, 'B'),
    P('c', 30, 100, 'C'),
  ],
  circles: [{ id: 'dial', centre: 'o', through: 'a' }],
  arcs: [
    { circle: 'dial', from: 'a', to: 'b', label: 'red, a quarter' },
    { circle: 'dial', from: 'b', to: 'c', label: 'blue, a quarter' },
  ],
  segments: [
    { from: 'o', to: 'a' },
    { from: 'o', to: 'b' },
    { from: 'o', to: 'c' },
  ],
  caption: 'Three colours, three sectors — and not three equal chances.',
  altText:
    'A circular spinner divided by three radii into three sectors of different sizes. The red sector spans a quarter of the circle, the blue sector another quarter, and the green sector the remaining half. Three outcomes are possible but they are not equally likely, because the sectors differ in size.',
};

// A two-stage tree. Branch lengths carry no meaning and the alt text says so.
const F_TREE: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  points: [
    P('start', 20, 100, 'start'),
    P('s1', 110, 50, 'plain'),
    P('s2', 110, 150, 'striped'),
    P('a1', 220, 25, 'plain, samosa'),
    P('a2', 220, 70, 'plain, idli'),
    P('a3', 220, 130, 'striped, samosa'),
    P('a4', 220, 175, 'striped, idli'),
  ],
  segments: [
    { from: 'start', to: 's1' },
    { from: 'start', to: 's2' },
    { from: 's1', to: 'a1' },
    { from: 's1', to: 'a2' },
    { from: 's2', to: 'a3' },
    { from: 's2', to: 'a4' },
  ],
  caption: 'Two shirts, then two snacks: four paths, and so four outcomes.',
  altText:
    'A branching diagram. From a single starting point two branches lead to plain and striped. From each of those, two further branches lead to samosa and idli, giving four complete paths: plain with samosa, plain with idli, striped with samosa, striped with idli. The branches are drawn the same length for clarity only; their lengths carry no information about how likely each choice is.',
};

export const SECTION_7_1_RANDOM: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s7_1_random_lesson',
  contentArtifactVersion: 1,
  source: source('7.1', 'What is Probability?', 1, 'ncert_iemh1_s7_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Fractions and decimals', 'Comparing sizes of fractions', 'Everyday language about chance'],
    mustNotIntroduce: [{ concept: 'The probability scale', belongsToSection: 'ncert_iemh1_s7_1' }, { concept: 'Experimental probability', belongsToSection: 'ncert_iemh1_s7_2' }],
  },
  learningGoal:
    'You will characterise a random situation as one where the possible results are known but the particular result is not, and order events by likelihood.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compare two fractions.', 'Describe how likely an everyday event feels.', 'List what could happen in a simple situation.'],
    ifNotReady: 'No special preparation; this is the first lesson of the chapter.',
  },
  vocabulary: [
    { term: 'random situation', meaning: 'One where you know what results are possible but cannot predict which will occur.' },
    { term: 'outcome', meaning: 'One possible result of a situation.' },
    { term: 'likelihood', meaning: 'How strongly a result is expected, which probability will measure.' },
  ],
  explanation: [
    'Some things can be predicted and some cannot. Drop a stone and it falls. Toss a coin and you know it will land heads or tails — but not which. That second kind of situation is what this chapter is about.',
    'A situation is random when you know the possible results and cannot predict the particular one. Both halves matter. Knowing the possibilities is what makes the situation describable at all; not knowing which occurs is what makes it random.',
    'Note what randomness does not mean. It does not mean the results are equally likely. A drawing pin tossed on a table lands point-up or point-down, and which it does is unpredictable — but the two are not equally likely, because the pin is not symmetric. Randomness is about prediction, not about balance.',
    'That distinction will matter for the whole chapter, so it is worth holding onto now. Many situations are random with results that are plainly uneven: whether it rains tomorrow, whether a bus is late, whether a biased spinner lands on red.',
    'Before measuring anything, you can already order events by likelihood. Rolling a number less than 7 on an ordinary six-faced die is certain. Rolling a 9 is impossible. Rolling an even number sits somewhere between. The next lesson turns that ordering into a number.',
  ],
  representations: ['A list of possible results beside a situation where which one occurs is unknown', 'Random situations with plainly uneven results, such as a drawing pin'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's71a.we1',
      prompt: 'Is drawing a card from a well shuffled deck without looking a random situation?',
      steps: [
        { text: 'The possible results are known: it is one of the cards in the deck.', reasoning: 'Knowing the possibilities is the first half of the definition.' },
        { text: 'Which particular card comes out cannot be predicted, since the deck was shuffled and hidden.', reasoning: 'Unpredictability of the particular result is the second half.' },
        { text: 'So it is random.', reasoning: 'Both conditions hold, which is what the definition requires.' },
      ],
      answer: 'Yes, it is a random situation.',
    },
    {
      id: 's71a.we2',
      prompt: 'A drawing pin is tossed. Is this random, and are the two results equally likely?',
      steps: [
        { text: 'The possible results are point-up and point-down, and which occurs cannot be predicted.', reasoning: 'So the situation is random by the definition.' },
        { text: 'The pin has a heavy flat head and a thin point, so it is not symmetric.', reasoning: 'Equal likelihood would need some reason for the two results to be balanced, and the shape gives none.' },
        { text: 'Nothing about the situation makes the two equally likely.', reasoning: 'Being random says nothing at all about how the likelihood is shared.' },
      ],
      answer: 'Random, but the two results are not equally likely.',
    },
    {
      id: 's71a.we3',
      prompt: 'Order these for an ordinary six-faced die: rolling a 3, rolling a number below 7, rolling a 9.',
      steps: [
        { text: 'Rolling a number below 7 happens every time, since every face shows 1 to 6.', reasoning: 'An event that always happens is certain.' },
        { text: 'Rolling a 9 can never happen, since no face shows 9.', reasoning: 'An event that can never happen is impossible.' },
        { text: 'Rolling a 3 sometimes happens, so it sits between the two.', reasoning: 'Ordering by likelihood needs no numbers yet.' },
      ],
      answer: 'Impossible (9), then rolling a 3, then certain (below 7).',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's71a.g1',
      prompt: 'Is the result of a planned total solar eclipse random?',
      hint: 'Can astronomers predict it?',
      answer: 'No.',
      rationale: 'The particular result is predictable, so the situation is not random.',
    },
    {
      id: 's71a.g2',
      prompt: 'Does random mean the results are equally likely?',
      hint: 'Think about the drawing pin.',
      answer: 'No.',
      rationale: 'Randomness is about not being able to predict, not about balance.',
    },
    {
      id: 's71a.g3',
      prompt: 'Name an event that is certain when rolling an ordinary die.',
      hint: 'What happens every single time?',
      answer: 'Rolling a number from 1 to 6.',
      rationale: 'Every face satisfies it, so it always happens.',
    },
  ],
  independentPractice: [
    {
      id: 's71a.i1',
      prompt: 'Give one random situation and one that is not, with a reason for each.',
      answer: 'Any pair where one result is predictable and one is not.',
      rationale: 'The test is whether the particular result can be predicted.',
    },
    {
      id: 's71a.i2',
      prompt: 'A bent coin is tossed. Is the situation random? Are the results equally likely?',
      answer: 'Random, but not equally likely.',
      rationale: 'Bending destroys the symmetry that would balance the two.',
    },
    {
      id: 's71a.i3',
      prompt: 'Explain why knowing the possible results matters to the definition.',
      answer: 'Because without them the situation cannot be described at all.',
      rationale: 'Randomness is unpredictability among known possibilities.',
    },
  ],
  reasoningApplication: [
    {
      id: 's71a.r1',
      prompt: 'A friend says "the weather tomorrow is random, so rain and no rain are equally likely". Identify what is right and what is wrong, and say what would be needed to judge the likelihoods.',
      expectedReasoning:
        'Random is right: the possibilities are known and the result is not predictable. Equally likely does not follow, since nothing about weather balances the two. Judging them needs evidence — records of how often it rains in this place at this time of year. A strong answer separates the two claims cleanly and names what evidence would settle the second.',
    },
  ],
  interactivePractice: [],
  summary:
    'A situation is random when the possible results are known and the particular one cannot be predicted. Randomness says nothing about how likely each result is — a drawing pin is random and plainly uneven — and events can be ordered from impossible to certain before any number is attached.',
  nextStep:
    'Next you will replace that ordering with a number between 0 and 1.',
  teacher: {
    objective: 'Students characterise randomness and separate it from equal likelihood.',
    prerequisiteKnowledge: ['Fractions', 'Everyday chance language'],
    modelLanguage: ['Can the particular result be predicted?', 'Does random mean balanced?'],
    teachingNotes: [
      'The drawing pin earns its place: it is random and visibly uneven, which separates the two ideas in one object.',
      'Do not let "random" slide into "equally likely" in class talk. It is the error the whole chapter guards against and it starts here.',
    ],
    quickChecks: ['Random or predictable?', 'Equally likely — what would make it so?'],
    supportForStrugglingLearners: [
      'Toss a drawing pin twenty times and record; the imbalance is visible.',
      'List the possible results before judging anything.',
    ],
    extension: ['Ask for a random situation with three results where one is far likelier than the others.'],
    materialsNeeded: ['A drawing pin', 'A coin'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_7_1_SCALE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s7_1_scale_lesson',
  contentArtifactVersion: 1,
  source: source('7.1', 'What is Probability?', 1, 'ncert_iemh1_s7_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s7_1'],
    mayAssume: ['Randomness and ordering by likelihood', 'Fractions and decimals between 0 and 1', 'Comparing fractions'],
    mustNotIntroduce: [{ concept: 'Experimental probability', belongsToSection: 'ncert_iemh1_s7_2' }, { concept: 'Sample space and events', belongsToSection: 'ncert_iemh1_s7_3' }],
  },
  learningGoal:
    'You will place events on the 0-to-1 probability scale and read what a value on it means, including the two ends.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Place a fraction between 0 and 1 on a number line.', 'Convert a fraction to a decimal.', 'Order events from impossible to certain.'],
    ifNotReady: 'Make sure you can place fractions on a number line; the scale is one.',
  },
  vocabulary: [
    { term: 'probability', meaning: 'A number between 0 and 1 measuring how likely an event is.' },
    { term: 'impossible event', meaning: 'One that cannot occur, with probability 0.' },
    { term: 'certain event', meaning: 'One that always occurs, with probability 1.' },
  ],
  explanation: [
    'Ordering events by likelihood is useful but coarse. Probability replaces the ordering with a number, so that two events can be compared precisely rather than by feel.',
    'The scale runs from 0 to 1. An event that cannot happen has probability 0. One that always happens has probability 1. Everything else lies strictly between, and a larger number means a likelier event.',
    'Nothing lies outside that range, and this is worth stating plainly because it gives a free check on every answer in the chapter. A computed probability of 7/4 or of −0.2 is not a surprising result; it is an error, and finding it early saves the rest of the work.',
    'Probability measures likelihood rather than a physical quantity. Length measures how long something is; probability measures how strongly a result is expected. That is why it has no unit — it is a pure number, and 0.3 means the same whatever is being discussed.',
    'Reading a value is then straightforward. A probability of 0.9 means the event is expected in the great majority of cases, 0.5 that it is as likely as not, 0.05 that it is unlikely but not impossible. Only 0 and 1 are absolute; everything else leaves both possibilities open.',
  ],
  representations: ['The 0-to-1 scale with the two ends named', 'Several events placed on the scale by their values'],
  visuals: [F_SCALE],
  visualsById: { F_SCALE },
  workedExamples: [
    {
      id: 's71b.we1',
      prompt: 'Place these on the scale: an impossible event, an event as likely as not, and a certain event.',
      steps: [
        { text: 'An impossible event cannot occur, so it sits at 0.', reasoning: 'The left end of the scale is reserved for events that never happen.' },
        { text: 'An event as likely as not sits at 0.5, halfway along.', reasoning: 'Equally balanced between happening and not happening.' },
        { text: 'A certain event always occurs, so it sits at 1.', reasoning: 'The right end is reserved for events that always happen.' },
      ],
      answer: '0, 0.5 and 1 respectively.',
      visualRef: 'F_SCALE',
    },
    {
      id: 's71b.we2',
      prompt: 'A calculation gives a probability of 5/4. What does that tell you?',
      steps: [
        { text: 'Five fourths is 1.25, which is greater than 1.', reasoning: 'Comparing the value against the top of the scale.' },
        { text: 'No probability can exceed 1, since 1 already means certain.', reasoning: 'Nothing is more than certain, so the scale has no room above it.' },
        { text: 'So the calculation contains an error and must be redone.', reasoning: 'An out-of-range value is a diagnosis, not an answer.' },
      ],
      answer: 'It is impossible as a probability, so something in the working is wrong.',
    },
    {
      id: 's71b.we3',
      prompt: 'Two events have probabilities 0.2 and 0.65. Which is likelier, and what do the values say?',
      steps: [
        { text: '0.65 is greater than 0.2, so the second event is likelier.', reasoning: 'On this scale a larger value means a likelier event.' },
        { text: 'Neither is 0 or 1, so both can happen and both can fail to happen.', reasoning: 'Only the two ends settle a case absolutely.' },
        { text: 'A value of 0.65 does not mean the event will happen.', reasoning: 'It describes how strongly it is expected, not what will occur on any one occasion.' },
      ],
      answer: 'The second; but neither value guarantees anything about a single occasion.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's71b.g1',
      prompt: 'What probability does an impossible event have?',
      hint: 'The left end of the scale.',
      answer: '0',
      rationale: 'It can never occur.',
    },
    {
      id: 's71b.g2',
      prompt: 'Can a probability be 1.3?',
      hint: 'Is anything likelier than certain?',
      answer: 'No.',
      rationale: 'The scale stops at 1, which already means certain.',
    },
    {
      id: 's71b.g3',
      prompt: 'What does a probability of 0.5 mean?',
      hint: 'Halfway along the scale.',
      answer: 'As likely to happen as not.',
      rationale: 'It is balanced between the two possibilities.',
    },
  ],
  independentPractice: [
    {
      id: 's71b.i1',
      prompt: 'Place 0.1, 0.5 and 0.95 in order and describe each in words.',
      answer: 'Unlikely, as likely as not, and very likely.',
      rationale: 'Position on the scale corresponds to strength of expectation.',
    },
    {
      id: 's71b.i2',
      prompt: 'A student computes a probability of −0.3. What should they do?',
      answer: 'Find the error; probability cannot be negative.',
      rationale: 'The scale has no room below 0.',
    },
    {
      id: 's71b.i3',
      prompt: 'Explain why probability has no unit.',
      answer: 'Because it measures likelihood rather than a physical quantity.',
      rationale: 'It is a pure number on a fixed scale.',
    },
  ],
  reasoningApplication: [
    {
      id: 's71b.r1',
      prompt: 'Only 0 and 1 settle a case absolutely. Explain what a probability of 0.99 does and does not tell you about what will happen on one occasion.',
      expectedReasoning:
        'It says the event is expected in almost all cases, but not that it will happen this time — the remaining possibility is small, not absent. A strong answer separates a statement about likelihood from a prediction about a single occasion, and notices that only 0 and 1 remove the other possibility entirely.',
    },
  ],
  interactivePractice: [],
  summary:
    'Probability measures likelihood as a number from 0, for impossible, to 1, for certain, with larger meaning likelier. Nothing lies outside that range, which makes an out-of-range answer a reliable sign of an error.',
  nextStep:
    'Next you will find such a number by actually performing the experiment.',
  teacher: {
    objective: 'Students place events on the probability scale and interpret values.',
    prerequisiteKnowledge: ['Fractions on a number line', 'Ordering events'],
    modelLanguage: ['Where on the scale?', 'Is that value even possible?'],
    teachingNotes: [
      'Make the range check a habit from this lesson. It catches more errors in this chapter than any other single move.',
      'Press the point that 0.99 is not a prediction. Students read high probabilities as certainty.',
    ],
    quickChecks: ['What does that value mean in words?', 'In range?'],
    supportForStrugglingLearners: [
      'Draw the scale and place every event on it before discussing values.',
      'Convert fractions to decimals when comparing.',
    ],
    extension: ['Ask whether an event of probability 0 could still happen in some situations, and what the chapter assumes.'],
    materialsNeeded: ['Ruler', 'Number line'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_7_2_EXPERIMENTAL: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s7_2_experimental_lesson',
  contentArtifactVersion: 1,
  source: source('7.2', 'Measuring Probability Objectively', 5, 'ncert_iemh1_s7_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s7_1'],
    mayAssume: ['The probability scale', 'Fractions and decimals', 'Recording results in a tally'],
    mustNotIntroduce: [{ concept: 'Theoretical probability and the gambler’s fallacy', belongsToSection: 'ncert_iemh1_s7_2' }, { concept: 'Sample space and events', belongsToSection: 'ncert_iemh1_s7_3' }],
  },
  learningGoal:
    'You will estimate a probability by performing trials and counting results, and state what such an estimate does and does not establish.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write a count as a fraction of a total.', 'Convert a fraction to a decimal.', 'Keep a tally of results.'],
    ifNotReady: 'Make sure you can turn a tally into a fraction; that is the whole calculation here.',
  },
  vocabulary: [
    { term: 'trial', meaning: 'One performance of the experiment.' },
    { term: 'experimental probability', meaning: 'The fraction of trials in which the event occurred.' },
    { term: 'estimate', meaning: 'A value obtained from evidence, which may change with more evidence.' },
  ],
  explanation: [
    'Some probabilities can be found by asking what the mechanism is. Others cannot, because the mechanism is unknown or uneven — the drawing pin from the first lesson is the standing example. For those, you can still measure.',
    'Perform the experiment many times and count. The experimental probability of an event is the number of trials in which it occurred, divided by the number of trials performed. Toss the pin 200 times, see point-up 128 times, and the experimental probability of point-up is 128/200, which is 0.64.',
    'Notice what that value is: a measurement of what happened, not a statement about what must happen. It is an estimate. Repeat the 200 tosses tomorrow and you will get a different count — probably close to 128, but not equal to it.',
    'More trials generally give a more trustworthy estimate, because a single unusual run matters less when it is one of many. Ten tosses giving seven point-ups tells you very little; a thousand tosses giving 652 tells you considerably more. But no number of trials turns an estimate into an exact value.',
    'And the method works precisely where the counting method cannot. It needs no assumption that the results are equally likely — in fact the pin is useful because they are not. The experiment measures whatever the mechanism actually does, which is why it is the honest tool when the mechanism is unknown.',
  ],
  representations: ['A tally of trials converted into a fraction of the total', 'Two runs of the same experiment giving different counts'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's72a.we1',
      prompt: 'A drawing pin is tossed 200 times and lands point-up 128 times. Find the experimental probability of point-up.',
      steps: [
        { text: 'Count the trials in which the event occurred: 128.', reasoning: 'The numerator counts occurrences of the event being measured.' },
        { text: 'Divide by the total number of trials, 200.', reasoning: 'The denominator counts every trial performed, successful or not.' },
        { text: 'That gives 128/200, which is 0.64.', reasoning: 'Simplifying the fraction or converting to a decimal, both acceptable.' },
        { text: 'This value is in range, between 0 and 1.', reasoning: 'Any experimental probability must be, since the count cannot exceed the total.' },
      ],
      answer: '0.64 — an estimate from this run of trials.',
    },
    {
      id: 's72a.we2',
      prompt: 'A second run of 200 tosses gives 134 point-ups. Which estimate is right?',
      steps: [
        { text: 'The second run gives 134/200, which is 0.67.', reasoning: 'The same calculation applied to the new data.' },
        { text: 'Both values are correct records of their own runs.', reasoning: 'Neither is a wrong measurement; they measured different sets of trials.' },
        { text: 'Combining both runs gives 262 out of 400, which is 0.655.', reasoning: 'Pooling the data uses all the evidence available.' },
        { text: 'No run gives the exact value; each is an estimate.', reasoning: 'Different runs differ, which is what makes these estimates rather than facts.' },
      ],
      answer: 'Both; they are estimates from different runs, and together they give a better one.',
    },
    {
      id: 's72a.we3',
      prompt: 'Why is this method suitable for the drawing pin but unnecessary for a fair coin?',
      steps: [
        { text: 'The pin is not symmetric, so there is no way to reason out its probabilities.', reasoning: 'With an uneven mechanism, counting arguments have nothing to count equally.' },
        { text: 'A fair coin is symmetric and balanced, so its mechanism can be reasoned about directly.', reasoning: 'The next lesson does exactly that.' },
        { text: 'For the pin the experiment measures what reasoning cannot supply.', reasoning: 'It is the right tool precisely when the mechanism is unknown or uneven.' },
      ],
      answer: 'Because the pin’s mechanism cannot be reasoned about, and the coin’s can.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's72a.g1',
      prompt: 'In 50 trials an event occurs 18 times. Find its experimental probability.',
      hint: 'Occurrences over trials.',
      answer: '0.36',
      rationale: 'Eighteen of the 50 trials, which is 18/50.',
    },
    {
      id: 's72a.g2',
      prompt: 'Does a larger number of trials make the estimate exact?',
      hint: 'Does it stop changing?',
      answer: 'No, only more trustworthy.',
      rationale: 'An estimate stays an estimate however many trials are performed.',
    },
    {
      id: 's72a.g3',
      prompt: 'Does this method need the results to be equally likely?',
      hint: 'What is it measuring?',
      answer: 'No.',
      rationale: 'It measures what the mechanism actually does, whatever that is.',
    },
  ],
  independentPractice: [
    {
      id: 's72a.i1',
      prompt: 'In 400 trials an event occurs 90 times. Find its experimental probability.',
      answer: '0.225.',
      rationale: 'Ninety of the 400 trials.',
    },
    {
      id: 's72a.i2',
      prompt: 'Two runs give 30/100 and 36/100. Combine them into one estimate.',
      answer: '66/200, which is 0.33.',
      rationale: 'Pooling uses all the trials performed.',
    },
    {
      id: 's72a.i3',
      prompt: 'Explain why an experimental probability is called an estimate.',
      answer: 'Because another run of trials would give a different value.',
      rationale: 'It measures one set of trials, not the mechanism exactly.',
    },
  ],
  reasoningApplication: [
    {
      id: 's72a.r1',
      prompt: 'Two students toss the same pin, one 20 times and one 500 times, and get different estimates. Explain whose you would rely on more and why, without claiming either is exact.',
      expectedReasoning:
        'The 500-trial estimate, because a few unusual results weigh less in a larger total, so it is less affected by chance variation. A strong answer avoids saying the larger run is correct, and notes that both are estimates of the same unknown value with the larger one simply more trustworthy.',
    },
  ],
  interactivePractice: [],
  summary:
    'Experimental probability is the fraction of trials in which the event occurred — a measurement of what happened, not a statement of what must. More trials give a more trustworthy estimate but never an exact value, and the method needs no assumption of equal likelihood.',
  nextStep:
    'Next you will find a probability by reasoning about the mechanism instead, and see why the two answers differ.',
  teacher: {
    objective: 'Students compute experimental probability and treat it as an estimate.',
    prerequisiteKnowledge: ['Fractions', 'Tallies'],
    modelLanguage: ['How many trials in total?', 'Is this a measurement or a fact?'],
    teachingNotes: [
      'Run the experiment twice with the same number of trials. Two different answers settles the estimate point better than any explanation.',
      'Resist calling the larger run "the right answer"; it is the more trustworthy estimate.',
    ],
    quickChecks: ['What does the denominator count?', 'Would another run give the same?'],
    supportForStrugglingLearners: [
      'Tally in groups of five and total before dividing.',
      'Record both runs side by side before combining.',
    ],
    extension: ['Ask how many trials would be needed before an estimate felt reliable, and what that depends on.'],
    materialsNeeded: ['Drawing pins', 'Tally sheet'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_7_2_THEORETICAL: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s7_2_theoretical_lesson',
  contentArtifactVersion: 1,
  source: source('7.2', 'Measuring Probability Objectively', 5, 'ncert_iemh1_s7_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s7_2'],
    mayAssume: ['Experimental probability as an estimate', 'Randomness is not uniformity', 'Counting and fractions'],
    mustNotIntroduce: [{ concept: 'Sample space and events', belongsToSection: 'ncert_iemh1_s7_3' }, { concept: 'Tree diagrams', belongsToSection: 'ncert_iemh1_s7_4' }],
  },
  learningGoal:
    'You will compute a theoretical probability from equally likely outcomes, justify the equal-likelihood assumption before using it, and explain why experiment and theory differ.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute an experimental probability from trials.', 'Count outcomes in a simple situation.', 'Say what randomness does and does not imply.'],
    ifNotReady: 'Make sure the previous lesson is secure; this one compares its method with a different one.',
  },
  vocabulary: [
    { term: 'theoretical probability', meaning: 'The probability computed from a model of the mechanism.' },
    { term: 'equally likely', meaning: 'Outcomes that the mechanism gives no reason to favour over one another.' },
    { term: 'gambler\'s fallacy', meaning: 'The false belief that past results change the chances of future ones.' },
  ],
  explanation: [
    'Where the mechanism is known, probability can be reasoned out instead of measured. For a fair die, the six faces are identical in size and the cube is balanced, so nothing about the mechanism favours any face. Under that model the six outcomes are equally likely, and the probability of each is 1/6.',
    'The order of that reasoning is the point of this lesson. First establish that the outcomes are equally likely, and only then divide favourable by total. Doing it the other way round — counting six faces and declaring 1/6 — gives the right answer for the wrong reason, and the wrong answer as soon as the die is loaded.',
    'A spinner makes the danger visible. Three colours, three sectors, and the sectors are different sizes: red a quarter, blue a quarter, green a half. There are three outcomes, and their probabilities are 1/4, 1/4 and 1/2, not 1/3 each. Three labels did not make three equal chances.',
    'So favourable over total counts outcomes, and it is only valid when those outcomes are equally likely. The phrase "all possible outcomes" hides that condition, and a lesson that says it without checking is saying something false about most real mechanisms.',
    'Now the comparison. Toss a fair coin 100 times and you will rarely get exactly 50 heads. The theoretical probability is 1/2 and the experimental one is whatever happened. They differ because the theory describes the mechanism and the experiment records one run of it, and the gap generally narrows as trials increase without ever being guaranteed to close.',
    'That gap is also where a famous error lives. After five heads in a row, the coin is not "due" a tail. The coin has no memory, so its next toss is governed by the same mechanism as the first. Expecting otherwise is the gambler’s fallacy, and it comes from treating a long-run tendency as a rule about short runs.',
  ],
  representations: ['A fair die with its symmetry stated before any probability is computed', 'A spinner with unequal sectors: three outcomes, unequal chances'],
  visuals: [F_SPINNER],
  visualsById: { F_SPINNER },
  workedExamples: [
    {
      id: 's72b.we1',
      prompt: 'A fair die is rolled. Find the probability of an even number.',
      steps: [
        { text: 'Establish the model first: the die is fair, so its six faces are equally likely.', reasoning: 'The equal-likelihood assumption must be stated before favourable over total can be used.' },
        { text: 'List the outcomes: 1, 2, 3, 4, 5, 6 — a complete list with nothing missing.', reasoning: 'The denominator must count every outcome, or it is measuring the wrong whole.' },
        { text: 'The favourable outcomes are 2, 4 and 6, so 3 of the 6 outcomes.', reasoning: 'The numerator counts outcomes satisfying the event.' },
        { text: 'The probability is 3/6, which is 1/2.', reasoning: 'Valid because the six outcomes were established as equally likely, not because there are six of them.' },
      ],
      answer: '1/2, under the stated assumption that the die is fair.',
    },
    {
      id: 's72b.we2',
      prompt: 'A spinner has three sectors: red a quarter, blue a quarter, green a half. Find the probability of green.',
      steps: [
        { text: 'There are three outcomes, but the sectors differ in size.', reasoning: 'So the outcomes cannot be treated as equally likely, and favourable over total does not apply.' },
        { text: 'Green covers half the circle.', reasoning: 'The spinner stops at an angle, so the chance follows the share of the circle, not the count of colours.' },
        { text: 'So the probability of green is 1/2, while red and blue are 1/4 each.', reasoning: 'Three outcomes, three unequal probabilities, summing to 1.' },
        { text: 'Answering 1/3 would come from counting colours rather than modelling the mechanism.', reasoning: 'That is the error this example exists to expose.' },
      ],
      answer: '1/2 — not the 1/3 that counting three colours would suggest.',
      visualRef: 'F_SPINNER',
    },
    {
      id: 's72b.we3',
      prompt: 'A fair coin has shown heads five times. What is the probability the next toss is heads?',
      steps: [
        { text: 'The coin is fair, so each toss has two equally likely outcomes.', reasoning: 'The mechanism has not changed, and fairness is a property of the coin rather than of its history.' },
        { text: 'A coin carries no record of previous tosses.', reasoning: 'Nothing physical connects one toss to the next.' },
        { text: 'So the probability remains 1/2.', reasoning: 'The same model applies to the sixth toss as to the first.' },
        { text: 'Believing a tail is "due" is the gambler’s fallacy.', reasoning: 'It confuses a long-run tendency with a rule governing the next trial.' },
      ],
      answer: '1/2, exactly as before.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's72b.g1',
      prompt: 'Before writing favourable over total, what must you establish?',
      hint: 'What does the formula assume?',
      answer: 'That the outcomes are equally likely.',
      rationale: 'Without it the fraction counts the wrong thing.',
    },
    {
      id: 's72b.g2',
      prompt: 'A bag has 3 red and 5 blue balls, well mixed, one drawn without looking. Find P(red).',
      hint: 'Are the eight balls equally likely to be drawn?',
      answer: '3/8',
      rationale: 'Mixing and not looking is what makes the eight equally likely; then 3 of the 8 are red.',
    },
    {
      id: 's72b.g3',
      prompt: 'A spinner has four colours in sectors of different sizes. Is each probability 1/4?',
      hint: 'Does the count of colours decide?',
      answer: 'No.',
      rationale: 'The sector sizes decide, not the number of labels.',
    },
  ],
  independentPractice: [
    {
      id: 's72b.i1',
      prompt: 'A fair die is rolled. Find the probability of a number greater than 4.',
      answer: '1/3.',
      rationale: 'Two of the six equally likely faces, 5 and 6, which is 2/6.',
    },
    {
      id: 's72b.i2',
      prompt: 'A biased coin lands heads 70 times in 100 tosses. What can you say about P(heads)?',
      answer: 'About 0.7, as an estimate from the trials.',
      rationale: 'Theory does not apply, since nothing establishes the two outcomes as equal.',
    },
    {
      id: 's72b.i3',
      prompt: 'Explain why a run of five heads does not change the next toss.',
      answer: 'Because the coin has no memory and the mechanism is unchanged.',
      rationale: 'Past results do not alter a fair coin’s future behaviour.',
    },
  ],
  reasoningApplication: [
    {
      id: 's72b.r1',
      prompt: 'Two situations each have three possible outcomes. Must their probabilities match? Construct an example supporting your answer, and state what would have to be true for them to match.',
      expectedReasoning:
        'No. A fair three-sided mechanism gives 1/3 each, while the unequal spinner gives 1/4, 1/4 and 1/2. They match only when both mechanisms make their outcomes equally likely. A strong answer builds the counterexample rather than asserting it, and names equal likelihood as the condition the count of outcomes cannot supply.',
    },
  ],
  interactivePractice: [],
  summary:
    'Theoretical probability counts favourable outcomes over total — but only once the mechanism has been shown to make those outcomes equally likely. A spinner with three unequal sectors has three outcomes and no equal chances. Experiment and theory differ because one records a run and the other describes the mechanism, and a fair coin is never "due" a result.',
  nextStep:
    'Next you will name the complete list of outcomes and the subsets of it that events pick out.',
  teacher: {
    objective: 'Students justify equal likelihood before computing, and refute the gambler’s fallacy.',
    prerequisiteKnowledge: ['Experimental probability', 'Counting outcomes'],
    modelLanguage: ['What makes these outcomes equally likely?', 'Have you established it, or assumed it?'],
    teachingNotes: [
      'Require the fairness statement in writing before the fraction, every time. This is the chapter’s central habit.',
      'The unequal spinner should be met early and returned to. It is the one object that makes the error visible rather than abstract.',
      'The gambler’s fallacy is worth refuting from the mechanism — the coin has no memory — rather than by assertion.',
    ],
    quickChecks: ['What licenses favourable over total here?', 'Is the die fair, or just six-sided?'],
    supportForStrugglingLearners: [
      'Write the fairness assumption on its own line before computing.',
      'Shade spinner sectors to scale so the picture cannot mislead.',
    ],
    extension: ['Ask for a mechanism with four outcomes whose probabilities are 1/2, 1/4, 1/8, 1/8.'],
    materialsNeeded: ['A fair die', 'A spinner with unequal sectors'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_7_3: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s7_3_lesson',
  contentArtifactVersion: 1,
  source: source('7.3', 'Elements of Probability: Sample Spaces and Events', 12, 'ncert_iemh1_s7_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s7_2'],
    mayAssume: ['Theoretical probability from equally likely outcomes', 'Listing outcomes', 'Sets as collections'],
    mustNotIntroduce: [{ concept: 'Tree diagrams', belongsToSection: 'ncert_iemh1_s7_4' }],
  },
  learningGoal:
    'You will write the sample space of a random experiment, describe an event as a subset of it, and show that the choice of sample space changes what can be answered.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['List every possible result of a simple experiment.', 'Compute a probability from equally likely outcomes.', 'Say what a subset is.'],
    ifNotReady: 'Make sure you can list outcomes completely; this lesson names that list.',
  },
  vocabulary: [
    { term: 'sample space', meaning: 'The complete list of possible outcomes of a random experiment, written S.' },
    { term: 'element', meaning: 'One outcome in the sample space.' },
    { term: 'event', meaning: 'A chosen subset of the sample space.' },
  ],
  explanation: [
    'The chapter has been listing outcomes since the first lesson. This lesson gives the list its name: the sample space, written S, is the complete list of possible outcomes of a random experiment. For one roll of a die, S is {1, 2, 3, 4, 5, 6}.',
    'Complete is the demanding word. If an outcome is missing the list is not a sample space, and any probability computed from it has the wrong denominator. Checking completeness before counting is a habit worth forming now.',
    'An event is a subset of the sample space — a chosen collection of outcomes. "An even number" is the event {2, 4, 6}. "A six" is the event {6}, a subset with one element. The distinction matters: an outcome is one result, while an event may gather several, and a probability question is always about an event.',
    'Now the part that takes care. The sample space is a choice of description, not something the situation hands you. For tomorrow’s weather you might take S as {Rain, No rain}. Or you might take it as {Heavy rain, Light rain, Dry}, which is a finer description of the same situation.',
    'Those two choices answer different questions. The coarse one cannot distinguish heavy rain from light, so a question about heavy rain has no answer within it. And neither choice makes its outcomes equally likely — {Rain, No rain} has two elements and nothing whatever suggests a half each. Choosing a sample space is a modelling decision, and the number of elements it happens to have carries no information about probability.',
  ],
  representations: ['A sample space listed completely, with an event marked as a subset of it', 'Two different sample spaces for one situation, answering different questions'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's73.we1',
      prompt: 'Write the sample space for one roll of a die, and the event "a number greater than 4" as a subset.',
      steps: [
        { text: 'List every possible result: S = {1, 2, 3, 4, 5, 6}.', reasoning: 'The sample space must be complete, or every later count is wrong.' },
        { text: 'Select the outcomes satisfying the description: 5 and 6.', reasoning: 'An event is chosen from the sample space rather than described separately.' },
        { text: 'So the event is {5, 6}, a subset of S with two elements.', reasoning: 'Writing it as a subset makes the relationship explicit.' },
        { text: 'If the die is fair, the six outcomes are equally likely and the probability is 2/6.', reasoning: 'The fairness assumption is what licenses counting; it is stated, not assumed silently.' },
      ],
      answer: 'S = {1, 2, 3, 4, 5, 6}; the event is {5, 6}, with probability 1/3 for a fair die.',
    },
    {
      id: 's73.we2',
      prompt: 'Compare the sample spaces {Rain, No rain} and {Heavy rain, Light rain, Dry} for tomorrow’s weather.',
      steps: [
        { text: 'Both describe the same situation at different levels of detail.', reasoning: 'A sample space is a description, so more than one can be correct.' },
        { text: 'The first cannot answer a question about heavy rain specifically.', reasoning: 'That outcome is not an element of it, so no probability for it exists in that model.' },
        { text: 'The second can, but requires more information to use.', reasoning: 'A finer description demands finer evidence.' },
        { text: 'Neither makes its outcomes equally likely.', reasoning: 'Two elements do not give a half each, and three do not give a third each; the weather decides, not the list.' },
      ],
      answer: 'Different descriptions answering different questions, and neither is equally likely.',
    },
    {
      id: 's73.we3',
      prompt: 'A bag holds 4 red and 6 green balls, well mixed, and one is drawn without looking. Write a sample space and find P(red).',
      steps: [
        { text: 'Take S as the ten individual balls, which mixing makes equally likely to be drawn.', reasoning: 'Choosing the individual balls as outcomes is what makes the equal-likelihood assumption defensible.' },
        { text: 'The event "red" is the subset of 4 red balls.', reasoning: 'An event gathers the outcomes that satisfy it.' },
        { text: 'So the probability is 4 of the 10 outcomes, which is 4/10 = 2/5.', reasoning: 'Valid because mixing and not looking give no ball an advantage.' },
        { text: 'Taking S as {Red, Green} instead would have two elements and not equal chances.', reasoning: 'A coarser sample space would make counting elements useless here.' },
      ],
      answer: '2/5, using the ten balls as the sample space.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's73.g1',
      prompt: 'Write the sample space for one toss of a coin.',
      hint: 'Every possible result.',
      answer: '{Heads, Tails}',
      rationale: 'Two outcomes, and the list is complete.',
    },
    {
      id: 's73.g2',
      prompt: 'Is {2, 4, 6} an outcome or an event when a die is rolled?',
      hint: 'One result, or several gathered?',
      answer: 'An event.',
      rationale: 'It is a subset containing three outcomes.',
    },
    {
      id: 's73.g3',
      prompt: 'A sample space has two elements. Is each probability 1/2?',
      hint: 'Does the number of elements decide?',
      answer: 'Not necessarily.',
      rationale: 'Only the mechanism decides, as the weather example shows.',
    },
  ],
  independentPractice: [
    {
      id: 's73.i1',
      prompt: 'Write the sample space for rolling a die and the event "an odd number".',
      answer: 'S = {1,2,3,4,5,6}; the event is {1, 3, 5}.',
      rationale: 'An event is a subset of the complete list.',
    },
    {
      id: 's73.i2',
      prompt: 'A bag has 2 white and 3 black balls, well mixed. Write a useful sample space and find P(black).',
      answer: 'The five individual balls; P(black) = 3/5.',
      rationale: 'Mixing makes the five equally likely.',
    },
    {
      id: 's73.i3',
      prompt: 'Explain why a sample space must be complete.',
      answer: 'Because a missing outcome makes every denominator wrong.',
      rationale: 'The total must count all the possibilities.',
    },
  ],
  reasoningApplication: [
    {
      id: 's73.r1',
      prompt: 'One situation can have more than one correct sample space. Explain what is gained and lost by choosing a finer one, and why the number of elements never settles the probabilities.',
      expectedReasoning:
        'A finer sample space answers more detailed questions but needs more information to use, while a coarser one is easier to apply and cannot distinguish cases it has merged. The element count never settles probabilities because it is a feature of the description chosen, whereas probability is a property of the mechanism. A strong answer keeps those two things firmly apart.',
    },
  ],
  interactivePractice: [],
  summary:
    'The sample space is the complete list of possible outcomes and an event is a subset of it. The choice of sample space is a modelling decision that determines which questions can be answered — and its number of elements says nothing about how likely they are.',
  nextStep:
    'Next you will build a sample space for an experiment with two stages.',
  teacher: {
    objective: 'Students write sample spaces and events, and treat the choice as a model.',
    prerequisiteKnowledge: ['Listing outcomes', 'Theoretical probability', 'Subsets'],
    modelLanguage: ['Is the list complete?', 'Outcome or event?'],
    teachingNotes: [
      'The two weather sample spaces are the heart of the lesson: same situation, different descriptions, neither uniform.',
      'Keep outcome and event distinct in class language from the first mention; the source distinguishes them and so should we.',
    ],
    quickChecks: ['Which subset is the event?', 'Does the element count tell you anything?'],
    supportForStrugglingLearners: [
      'Write S in braces every time before selecting any event.',
      'Mark the event by circling its elements within the listed S.',
    ],
    extension: ['Ask for two sample spaces for a single situation where one can answer a question the other cannot.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_7_4: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s7_4_lesson',
  contentArtifactVersion: 1,
  source: source('7.4', 'Tree diagrams', 14, 'ncert_iemh1_s7_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s7_3'],
    mayAssume: ['Sample space and events', 'Theoretical probability from equally likely outcomes', 'Organised listing'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will enumerate the sample space of a two-stage experiment with a tree diagram and read probabilities of compound outcomes from the completed tree.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write a sample space for a one-stage experiment.', 'Compute a probability from equally likely outcomes.', 'List combinations systematically.'],
    ifNotReady: 'Make sure listing a one-stage sample space is secure; a tree organises the two-stage case.',
  },
  vocabulary: [
    { term: 'two-stage experiment', meaning: 'One carried out in two steps, such as choosing a shirt and then a snack.' },
    { term: 'tree diagram', meaning: 'A branching diagram where each complete path is one outcome.' },
    { term: 'compound outcome', meaning: 'An outcome of the whole experiment, made of a result at each stage.' },
  ],
  explanation: [
    'Some experiments happen in two steps. Choose a shirt — plain or striped — and then a snack — samosa or idli. Listing the outcomes by hand works but is easy to get wrong, and a tree diagram organises it.',
    'Draw a branch for each result of the first stage. From the end of each, draw a branch for each result of the second. Every complete path from start to finish is one outcome of the whole experiment, and the sample space is the collection of paths: plain-samosa, plain-idli, striped-samosa, striped-idli. Four outcomes.',
    'The tree guarantees completeness, which is its real value. Working systematically through every branch means no combination is forgotten, and a forgotten outcome is the error that quietly corrupts a denominator.',
    'Now the warning this diagram needs. The branches are drawn the same length and spaced evenly because that is tidy, not because the results are equally likely. If the shirt is picked at random from one plain and one striped, the two first-stage results are equally likely — but if there are three plain shirts and one striped, they are not, and the picture looks exactly the same.',
    'So the same rule holds as everywhere else in this chapter. To read a probability off a completed tree by counting paths, the compound outcomes must be equally likely, and that must be established from the mechanism. A symmetric picture is not evidence; it is a drawing convention.',
  ],
  representations: ['A two-stage tree with every complete path labelled as one outcome', 'Evenly spaced branches, with a note that spacing carries no information'],
  visuals: [F_TREE],
  visualsById: { F_TREE },
  workedExamples: [
    {
      id: 's74.we1',
      prompt: 'A shirt is chosen at random from one plain and one striped, then a snack at random from one samosa and one idli. List the sample space using a tree.',
      steps: [
        { text: 'Draw two first-stage branches, plain and striped.', reasoning: 'One branch per possible result of the first step.' },
        { text: 'From each, draw two second-stage branches, samosa and idli.', reasoning: 'The second stage is available after either first-stage result.' },
        { text: 'Read the four complete paths as the outcomes.', reasoning: 'Each path from start to end is one outcome of the whole experiment.' },
        { text: 'Since each choice is at random between two identical alternatives, the four paths are equally likely.', reasoning: 'This is established from the mechanism and is what licenses counting paths.' },
      ],
      answer: 'S has four outcomes: plain-samosa, plain-idli, striped-samosa, striped-idli.',
      visualRef: 'F_TREE',
    },
    {
      id: 's74.we2',
      prompt: 'For that experiment, find the probability of getting an idli.',
      steps: [
        { text: 'The four outcomes have been established as equally likely.', reasoning: 'Stating this before counting is what makes the next step valid.' },
        { text: 'Two of the four paths end in idli: plain-idli and striped-idli.', reasoning: 'Counting the paths satisfying the event.' },
        { text: 'So the probability is 2/4, which is 1/2.', reasoning: 'Favourable paths over total paths, valid because the paths are equally likely.' },
      ],
      answer: '1/2.',
    },
    {
      id: 's74.we3',
      prompt: 'Now suppose there are three plain shirts and one striped, picked at random. Does the tree still give 1/2 for a plain shirt?',
      steps: [
        { text: 'The tree still shows two first-stage branches, plain and striped.', reasoning: 'The diagram is unchanged, since the possible results are the same.' },
        { text: 'But four shirts are being picked from, and three of them are plain.', reasoning: 'The mechanism has changed even though the picture has not.' },
        { text: 'So P(plain) is 3 of the 4 shirts, which is 3/4, not 1/2.', reasoning: 'Counting branches would give the wrong answer here.' },
        { text: 'The branches look identical in both cases.', reasoning: 'Which is exactly why visual symmetry cannot be used as evidence of equal likelihood.' },
      ],
      answer: 'No — 3/4. The tree organises the outcomes; it does not supply their probabilities.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's74.g1',
      prompt: 'Two stages with three results each. How many complete paths?',
      hint: 'Three branches from each of three.',
      answer: 'Nine.',
      rationale: 'Each first-stage branch carries three second-stage branches.',
    },
    {
      id: 's74.g2',
      prompt: 'Why draw a tree rather than list by hand?',
      hint: 'What does working through every branch guarantee?',
      answer: 'Because it guarantees no combination is forgotten.',
      rationale: 'A missing outcome corrupts the denominator.',
    },
    {
      id: 's74.g3',
      prompt: 'Do evenly spaced branches mean equally likely results?',
      hint: 'Does the drawing know the mechanism?',
      answer: 'No.',
      rationale: 'Spacing is a drawing convention and carries no information.',
    },
  ],
  independentPractice: [
    {
      id: 's74.i1',
      prompt: 'A coin is tossed and a fair die rolled. How many outcomes, and what is P(heads and a six)?',
      answer: 'Twelve outcomes; 1/12 if the coin is fair.',
      rationale: 'Two branches each carrying six, and the twelve paths are equally likely for fair equipment.',
    },
    {
      id: 's74.i2',
      prompt: 'Draw the tree for choosing one of two routes then one of three buses, and list the outcomes.',
      answer: 'Six outcomes, one per complete path.',
      rationale: 'Two branches each carrying three.',
    },
    {
      id: 's74.i3',
      prompt: 'Explain why a completed tree does not by itself give probabilities.',
      answer: 'Because the paths need not be equally likely.',
      rationale: 'The mechanism decides, not the diagram.',
    },
  ],
  reasoningApplication: [
    {
      id: 's74.r1',
      prompt: 'A tree diagram for a two-stage experiment always looks symmetric, whatever the mechanism. Explain what the diagram does establish and what it cannot, and how you would record unequal chances on one.',
      expectedReasoning:
        'It establishes the sample space completely — every combination appears as a path — and establishes nothing about likelihood. Unequal chances would have to be written on the branches as numbers, since the geometry cannot carry them. A strong answer separates enumeration from measurement and sees that this is the same distinction the whole chapter has been drawing.',
    },
  ],
  interactivePractice: [],
  summary:
    'A tree diagram enumerates the sample space of a two-stage experiment, with each complete path one outcome, and its real value is guaranteeing that no combination is missed. Counting paths gives a probability only when the mechanism makes those paths equally likely; evenly drawn branches are a convention and prove nothing.',
  nextStep:
    'That completes the chapter: likelihood measured on a scale, found by experiment or by reasoning, organised by sample spaces and trees.',
  teacher: {
    objective: 'Students enumerate two-stage sample spaces with trees and resist reading likelihood from the picture.',
    prerequisiteKnowledge: ['Sample spaces', 'Theoretical probability'],
    modelLanguage: ['Is every path drawn?', 'What makes these paths equally likely?'],
    teachingNotes: [
      'The three-plain-shirts variant is the lesson’s point: identical diagram, different probability. Do it immediately after the symmetric case.',
      'Say explicitly that branch spacing is a convention. Students read the geometry as mathematics otherwise.',
    ],
    quickChecks: ['How many complete paths?', 'Does the picture tell you the chances?'],
    supportForStrugglingLearners: [
      'Label each path with its full outcome before counting anything.',
      'Draw the tree for a small case and check the count against a hand-written list.',
    ],
    extension: ['Ask how a tree would show a three-stage experiment, and how many paths it would have.'],
    materialsNeeded: ['Squared paper', 'Ruler'],
  },
  reviewStatus: 'authored_draft',
};

/** Chapter 7, in the book's order. Six lessons from four sections, with
 *  §7.1 and §7.2 each split in two. No merges. */
export function probabilityChapterSections(): AuthoredSection[] {
  return [
    SECTION_7_1_RANDOM,
    SECTION_7_1_SCALE,
    SECTION_7_2_EXPERIMENTAL,
    SECTION_7_2_THEORETICAL,
    SECTION_7_3,
    SECTION_7_4,
  ];
}
