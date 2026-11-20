// ===========================================================================
// v0.84.0-c10.11 checkpoint 65 — CLASS 10 PROBABILITY.
//
// FORMALISATION. The source model records it as such, and the frozen Class 9
// record backs it: six lessons already covering randomness, the scale,
// experimental and theoretical probability, sample spaces, events as
// subsets, and tree diagrams. These lessons formalise the classical
// definition and apply it carefully; they do not introduce probability.
//
// Every probability is derived from one Experiment and one Event. No count,
// complement or fraction is typed where it can be computed.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §14.1
// (folio 202). §14.2 is REVIEW and earns no unit. CBSE constraint:
// classical definition, simple problems only.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  approxDecimal, complement, eventSize, formatRational, probability,
  sampleSpaceSize, type Event, type Experiment,
} from './sampleSpace';

export const PROBABILITY_C10_CHAPTER_ID = 'ncert_jemh1_ch14';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = () => ({
  officialChapterId: PROBABILITY_C10_CHAPTER_ID,
  officialSectionId: 'ncert_jemh1_s14_1',
  sectionNumber: '14.1',
  exactTitle: 'Probability \u2014 A Theoretical Approach',
  startPage: 202, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

// --- the canonical experiments ---------------------------------------------

export const DIE: Experiment = {
  id: 'die',
  description: 'a fair die is rolled once',
  outcomes: ['1', '2', '3', '4', '5', '6'],
  equallyLikely: 'the die is modelled as fair \u2014 a cube balanced so that no face is favoured \u2014 so its six faces are treated as equally likely',
};

export const COIN2: Experiment = {
  id: 'two_coins',
  description: 'two fair coins are tossed, a first and a second',
  outcomes: ['HH', 'HT', 'TH', 'TT'],
  equallyLikely: 'each coin is modelled as fair and the two are distinguished as first and second, so all four ordered results are treated as equally likely',
};

const PAIRS: string[] = [];
for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) PAIRS.push(`(${a},${b})`);
export const DICE2: Experiment = {
  id: 'two_dice',
  description: 'two fair dice, a red one and a blue one, are rolled together',
  outcomes: PAIRS,
  equallyLikely: 'both dice are modelled as fair and the two are distinguishable by colour, so all 36 ordered pairs are treated as equally likely',
};

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const DECK: string[] = [];
for (const s of SUITS) for (const r of RANKS) DECK.push(`${r} of ${s}`);
export const CARD: Experiment = {
  id: 'card',
  description: 'one card is drawn from a well-shuffled standard deck of 52 cards, with no jokers',
  outcomes: DECK,
  equallyLikely: 'the deck is modelled as well shuffled, so each of the 52 cards is treated as equally likely to be drawn',
};

/** 5 red, 3 white, 2 green, individually identified so each is one outcome. */
const MARBLE_LIST = [
  ...Array.from({ length: 5 }, (_, i) => `red ${i + 1}`),
  ...Array.from({ length: 3 }, (_, i) => `white ${i + 1}`),
  ...Array.from({ length: 2 }, (_, i) => `green ${i + 1}`),
];
export const MARBLES: Experiment = {
  id: 'marbles',
  description: 'one marble is drawn from a bag holding 5 red, 3 white and 2 green marbles',
  outcomes: MARBLE_LIST,
  equallyLikely: 'the marbles are modelled as identical apart from colour and thoroughly mixed, so each of the ten is treated as equally likely to be drawn',
};

/** An experiment whose outcomes are NOT established as equally likely. */
export const SPINNER: Experiment = {
  id: 'uneven_spinner',
  description: 'a spinner whose face is divided into one large red sector and one small blue sector',
  outcomes: ['red', 'blue'],
  equallyLikely: null,
};

export const CANONICAL_EXPERIMENTS = [DIE, COIN2, DICE2, CARD, MARBLES, SPINNER];

const ev = (id: string, exp: Experiment, description: string, outcomes: string[]): Event =>
  ({ id, experimentId: exp.id, description, outcomes });

export const E_EVEN = ev('even', DIE, 'the number is even', ['2', '4', '6']);
export const E_MORE_THAN_4 = ev('gt4', DIE, 'the number is greater than 4', ['5', '6']);
export const E_SEVEN = ev('seven', DIE, 'the number is 7', []);
export const E_UNDER_7 = ev('under7', DIE, 'the number is less than 7', DIE.outcomes);
export const E_ONE_HEAD = ev('one_head', COIN2, 'exactly one head appears', ['HT', 'TH']);
export const E_SUM7 = ev('sum7', DICE2, 'the sum is 7', PAIRS.filter((p) => { const [a, b] = p.slice(1, -1).split(',').map(Number); return a + b === 7; }));
export const E_SUM2 = ev('sum2', DICE2, 'the sum is 2', ['(1,1)']);
export const E_RED_CARD = ev('red_card', CARD, 'the card is red', DECK.filter((c) => c.includes('hearts') || c.includes('diamonds')));
export const E_KING = ev('king', CARD, 'the card is a king', DECK.filter((c) => c.startsWith('K ')));
export const E_RED_MARBLE = ev('red_marble', MARBLES, 'the marble is red', MARBLE_LIST.filter((m) => m.startsWith('red')));
export const E_NOT_WHITE = ev('not_white', MARBLES, 'the marble is not white', MARBLE_LIST.filter((m) => !m.startsWith('white')));
/** Disjoint from E_EVEN but does NOT cover the sample space. */
export const E_ONE_OR_THREE = ev('one_three', DIE, 'the number is 1 or 3', ['1', '3']);

export const CANONICAL_EVENTS: Array<[Experiment, Event]> = [
  [DIE, E_EVEN], [DIE, E_MORE_THAN_4], [DIE, E_SEVEN], [DIE, E_UNDER_7], [DIE, E_ONE_OR_THREE],
  [COIN2, E_ONE_HEAD], [DICE2, E_SUM7], [DICE2, E_SUM2],
  [CARD, E_RED_CARD], [CARD, E_KING], [MARBLES, E_RED_MARBLE], [MARBLES, E_NOT_WHITE],
];

const P = (exp: Experiment, e: Event) => formatRational(probability(exp, e));
const PC = (exp: Experiment, e: Event) => formatRational(probability(exp, complement(exp, e)));
const N = (e: Event) => eventSize(e);

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_14_1A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s14_1_classical_definition_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Sample space and events as subsets, from Class IX', 'Theoretical probability from equally likely outcomes, from Class IX', 'Fractions in lowest terms'],
    mustNotIntroduce: [
      { concept: 'The 0-to-1 range and impossible/sure events', belongsToSection: 'ncert_jemh1_s14_1b' },
      { concept: 'Complementary events', belongsToSection: 'ncert_jemh1_s14_1c' },
    ],
  },
  learningGoal:
    'You will state the classical probability of an event as favourable outcomes over equally likely outcomes, and justify that the outcomes are equally likely before using it.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write the sample space of a simple experiment.', 'Describe an event as a subset of the sample space.', 'Simplify a fraction.'],
    ifNotReady: 'Revise probability from Class IX. You wrote sample spaces and computed theoretical probabilities there; this lesson states the rule precisely.',
  },
  vocabulary: [
    { term: 'outcome', meaning: 'One possible result of an experiment, as fine-grained as the experiment distinguishes.' },
    { term: 'sample space', meaning: 'The set S of all outcomes of the experiment.' },
    { term: 'event', meaning: 'A subset of the sample space \u2014 a collection of outcomes described by some condition.' },
    { term: 'favourable outcome', meaning: 'An outcome belonging to the event in question.' },
    { term: 'equally likely', meaning: 'An assumption that no outcome is favoured over another, which must be justified by the experiment rather than counted off.' },
    { term: 'probability', meaning: 'For equally likely outcomes, the number of favourable outcomes divided by the total number of outcomes.' },
  ],
  explanation: [
    'You wrote sample spaces and computed theoretical probabilities in Class IX. Class 10 formalises that into a single rule and applies it systematically, so the first job is to state the rule and the condition it needs.',
    'The rule is this. When an experiment has finitely many outcomes and those outcomes are EQUALLY LIKELY, the probability of an event E is the number of favourable outcomes divided by the total number of outcomes: P(E) = n(E) / n(S).',
    'The condition is not decoration. Favourable-over-total is valid only under the equal-likelihood assumption, and that assumption cannot be read off from how many outcomes there are.',
    'It would be wrong to say that because a spinner has two labels, red and blue, each has probability one half. If the red sector covers most of the face, the two outcomes are not equally likely, and counting labels would give an answer that the spinner does not obey. The number of names for things tells you nothing about their chances.',
    'So every calculation begins by saying WHY the outcomes may be treated as equally likely. A fair die is modelled as a cube balanced so no face is favoured. A well-shuffled deck is modelled so each card is as likely as any other. These are statements about a mathematical model, not measurements of a physical object \u2014 no real coin is exactly fair, and the model does not claim otherwise.',
    `With the assumption in place the arithmetic is short. For ${DIE.description}, S has ${sampleSpaceSize(DIE)} outcomes. The event "${E_EVEN.description}" contains ${N(E_EVEN)} of them, so P = ${N(E_EVEN)}/${sampleSpaceSize(DIE)} = ${P(DIE, E_EVEN)}.`,
    'One more thing decides the answer before any counting: what the experiment treats as a single outcome. Get that wrong and the denominator is wrong, and the next lessons return to it repeatedly.',
  ],
  representations: ['A sample space listed as a set, with the favourable outcomes marked'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's141a.we1',
      prompt: `${DIE.description.charAt(0).toUpperCase() + DIE.description.slice(1)}. Find the probability that ${E_EVEN.description}.`,
      steps: [
        { text: `The experiment is rolling one die, and S = {${DIE.outcomes.join(', ')}}, so n(S) = ${sampleSpaceSize(DIE)}.`, reasoning: 'The sample space has to be settled first, because it is the denominator and everything else is counted against it.' },
        { text: 'The outcomes may be treated as equally likely because the die is modelled as fair, with no face favoured.', reasoning: 'This is the condition that makes favourable-over-total valid, and stating it is part of the calculation rather than a preliminary.' },
        { text: `The event is {${E_EVEN.outcomes.join(', ')}}, so n(E) = ${N(E_EVEN)}.`, reasoning: 'The favourable outcomes are listed rather than counted in the head, so the count cannot drift from the set.' },
        { text: `P(E) = ${N(E_EVEN)}/${sampleSpaceSize(DIE)} = ${P(DIE, E_EVEN)}.`, reasoning: 'The fraction is reduced, and it answers the question asked about this event on this sample space.' },
      ],
      answer: `P = ${P(DIE, E_EVEN)}.`,
    },
    {
      id: 's141a.we2',
      prompt: `${COIN2.description.charAt(0).toUpperCase() + COIN2.description.slice(1)}. Find the probability that ${E_ONE_HEAD.description}.`,
      steps: [
        { text: `The two coins are distinguished as first and second, so S = {${COIN2.outcomes.join(', ')}} and n(S) = ${sampleSpaceSize(COIN2)}.`, reasoning: 'HT and TH are different results of the experiment, so collapsing them would describe a different experiment from the one performed.' },
        { text: 'Both coins are modelled as fair, so all four ordered results are treated as equally likely.', reasoning: 'The assumption is about these four elementary outcomes, which is what licenses dividing by 4.' },
        { text: `Exactly one head happens in {${E_ONE_HEAD.outcomes.join(', ')}}, so n(E) = ${N(E_ONE_HEAD)}.`, reasoning: 'Both orders qualify, since the condition asks for one head without saying which coin shows it.' },
        { text: `P(E) = ${N(E_ONE_HEAD)}/${sampleSpaceSize(COIN2)} = ${P(COIN2, E_ONE_HEAD)}.`, reasoning: 'Treating "one head" as a single outcome among three would have given 1/3, which is not what the experiment does.' },
      ],
      answer: `P = ${P(COIN2, E_ONE_HEAD)}.`,
    },
    {
      id: 's141a.we3',
      prompt: `A spinner is divided into one large red sector and one small blue sector. A student says P(red) = 1/2 because there are two colours. What is wrong?`,
      steps: [
        { text: 'There are indeed two outcomes, red and blue.', reasoning: 'The sample space is correct, so the error is not in listing what can happen.' },
        { text: 'But nothing has established that the two are equally likely.', reasoning: 'The sectors differ in size, so the spinner favours one outcome over the other.' },
        { text: 'Favourable-over-total requires equal likelihood, and here the condition fails.', reasoning: 'The rule is not a universal formula; it is a consequence of the assumption, and without the assumption it has no force.' },
        { text: 'So no probability follows from the labels alone; the sector sizes would be needed.', reasoning: 'Counting names is not measuring chances, which is exactly the gap the equal-likelihood condition closes.' },
      ],
      answer: 'The two outcomes are not equally likely, so the rule does not apply.',
    },
  ],
  guidedPractice: [
    { id: 's141a.g1', prompt: `A fair die is rolled. Find P(${E_MORE_THAN_4.description}).`, hint: 'List the favourable outcomes.', answer: `${P(DIE, E_MORE_THAN_4)}.`, rationale: `The favourable outcomes are {${E_MORE_THAN_4.outcomes.join(', ')}}, so n(E) = ${N(E_MORE_THAN_4)} and P = ${N(E_MORE_THAN_4)}/${sampleSpaceSize(DIE)} = ${P(DIE, E_MORE_THAN_4)}.` },
    { id: 's141a.g2', prompt: 'Two fair coins are tossed. Why is P(two heads) not 1/3?', hint: 'How many elementary outcomes are there?', answer: 'Because there are four equally likely outcomes, not three.', rationale: 'S = {HH, HT, TH, TT}. Two heads happens in one of them, so P = 1/4. Grouping HT and TH as one result changes the denominator to something the experiment does not have.' },
    { id: 's141a.g3', prompt: 'A bag has marbles of two colours. Can you conclude each colour has probability 1/2?', hint: 'What would you need to know?', answer: 'No.', rationale: 'The number of colours says nothing about how many marbles of each there are. Equal likelihood applies to the individual marbles, not to the colour names.' },
  ],
  independentPractice: [
    { id: 's141a.i1', prompt: `A fair die is rolled. Find P(the number is at most 2).`, answer: '1/3.', rationale: 'The favourable outcomes are {1, 2}, so P = 2/6 = 1/3 on a sample space of six equally likely faces.' },
    { id: 's141a.i2', prompt: `${MARBLES.description.charAt(0).toUpperCase() + MARBLES.description.slice(1)}. Find P(${E_RED_MARBLE.description}).`, answer: `${P(MARBLES, E_RED_MARBLE)}.`, rationale: `Each of the ${sampleSpaceSize(MARBLES)} marbles is equally likely to be drawn, and ${N(E_RED_MARBLE)} of them are red, so P = ${N(E_RED_MARBLE)}/${sampleSpaceSize(MARBLES)} = ${P(MARBLES, E_RED_MARBLE)}.` },
    { id: 's141a.i3', prompt: 'Why must a calculation say why the outcomes are equally likely?', answer: 'Because favourable-over-total is only valid under that assumption.', rationale: 'Without it the rule can be applied to an experiment that does not satisfy it, giving an answer the experiment will not obey.' },
    { id: 's141a.i4', prompt: 'Two spinners carry the same four labels, but one has four equal sectors and the other does not. Can label counting determine the probabilities on both?', answer: 'No \u2014 only on the one with equal sectors.', rationale: 'Identical labels do not make identical models. The equal-sector spinner satisfies the assumption; the other does not, and counting labels would misdescribe it.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's141a.td1',
      prompt: 'Why can we not say that two possible outcomes must each have probability one half?',
      expectedReasoning:
        'Because the number of outcomes counts NAMES, and probability is about chances. Two outcomes are each one half only when the experiment makes them equally likely, which is an extra fact about the experiment and not a consequence of there being two of them. A spinner with one large and one small sector has exactly two outcomes and nothing like equal chances. The count fixes the denominator once equal likelihood holds; it cannot establish that it holds.',
    },
    {
      id: 's141a.td2',
      prompt: 'Two coins are tossed. Why does treating "one head and one tail" as a single outcome give the wrong answer?',
      expectedReasoning:
        'Because the experiment distinguishes the coins, so HT and TH are two different results, and the equal-likelihood assumption applies to the four ordered results rather than to three verbal descriptions. Grouping them gives a sample space of three items that are not equally likely \u2014 "one of each" happens twice as often as either double \u2014 so dividing by 3 misdescribes the experiment. The assumption and the sample space have to be about the same things, which is why the elementary outcomes have to be as fine as the experiment itself.',
    },
  ],
  summary:
    `For an experiment with finitely many EQUALLY LIKELY outcomes, P(E) = n(E) / n(S). The condition is not decoration: the number of outcomes cannot establish that they are equally likely, so a spinner with two unequal sectors has two outcomes and nothing like two equal chances. Every calculation states why the model treats its outcomes as equally likely, and the outcomes must be as fine as the experiment distinguishes \u2014 for two coins that is ${COIN2.outcomes.join(', ')}, giving P(exactly one head) = ${P(COIN2, E_ONE_HEAD)}.`,
  nextStep: 'Next you will see why every probability lies between 0 and 1.',
  teacher: teacher(
    'Students state the classical rule and justify the equal-likelihood condition before applying it.',
    ['Sample spaces and events (Class IX)', 'Theoretical probability (Class IX)'],
    ['Why are these equally likely?', 'How fine are the outcomes?', 'Counting labels is not measuring chances.'],
    [
      'Students did this in Class IX, so the time belongs on the condition rather than on the rule.',
      'The spinner example is the anchor. Two outcomes with visibly unequal chances is the cleanest refutation of label counting.',
      'Keep saying "modelled as fair". Students who hear "a coin is fair" as a fact about metal will be puzzled later.',
    ],
    ['Ask why two outcomes does not give one half.', 'Ask what S is for two coins.'],
    ['Have the student write S as a listed set and tick the favourable outcomes before writing any fraction.'],
    ['Ask what extra information the uneven spinner would need.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_14_1B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s14_1_range_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s14_1'],
    mayAssume: ['The classical rule and the equal-likelihood condition', 'The 0-to-1 scale met in Class IX'],
    mustNotIntroduce: [{ concept: 'Complementary events', belongsToSection: 'ncert_jemh1_s14_1c' }],
  },
  learningGoal:
    'You will establish that every probability lies between 0 and 1, and identify impossible and sure events as the two ends.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute P(E) = n(E) / n(S).', 'Say what it means for an event to be a subset of S.', 'Compare two fractions.'],
    ifNotReady: 'Revise the previous lesson. The argument here is about the size of an event compared with the sample space.',
  },
  vocabulary: [
    { term: 'impossible event', meaning: 'An event containing no outcomes, whose probability is 0.' },
    { term: 'sure event', meaning: 'An event containing every outcome of the sample space, whose probability is 1.' },
  ],
  explanation: [
    'You placed events on the 0-to-1 scale in Class IX. Class 10 derives the two ends from the classical rule rather than describing them.',
    'An event is a subset of the sample space, so it cannot contain fewer than no outcomes and cannot contain more than all of them: 0 \u2264 n(E) \u2264 n(S).',
    'Dividing through by n(S), which is positive, gives 0 \u2264 n(E)/n(S) \u2264 1 \u2014 that is, 0 \u2264 P(E) \u2264 1. The range is not a rule to remember; it follows from an event being a subset.',
    `The lower end is reached when the event contains no outcomes at all. Rolling a fair die, "${E_SEVEN.description}" is such an event: no face shows 7, so n(E) = ${N(E_SEVEN)} and P = ${P(DIE, E_SEVEN)}. An event like this is called an IMPOSSIBLE event.`,
    `The upper end is reached when the event contains every outcome. "${E_UNDER_7.description}" holds for all ${sampleSpaceSize(DIE)} faces, so P = ${P(DIE, E_UNDER_7)}. Such an event is called a SURE event.`,
    'These two words are precise and should not be stretched. Impossible means the event contains no outcomes, not that it is very unlikely. An event with probability 1/1000 has a positive probability \u2014 it contains an outcome, it can occur, and calling it impossible would be false.',
    `The same care applies at the other end. Probability 1 means the event contains the whole sample space, not that it is merely very likely. "${E_SUM7.description}" with two dice has probability ${P(DICE2, E_SUM7)}, which is the largest of any sum, but the event leaves out ${sampleSpaceSize(DICE2) - N(E_SUM7)} of the 36 outcomes and is nowhere near sure.`,
    'So a probability tells you where an event sits between those ends, and only the ends themselves carry the words impossible and sure.',
  ],
  representations: ['The 0-to-1 scale with an impossible, an ordinary and a sure event placed on it'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's141b.we1',
      prompt: 'Show that every probability of an event lies between 0 and 1.',
      steps: [
        { text: 'An event E is a subset of the sample space S.', reasoning: 'That is what an event is, so every property below follows from the definition rather than from an extra assumption.' },
        { text: 'A subset contains at least no outcomes and at most all of them: 0 \u2264 n(E) \u2264 n(S).', reasoning: 'A set cannot have a negative number of members, and a subset cannot have more members than the set it sits inside.' },
        { text: 'Divide through by n(S), which is positive: 0 \u2264 n(E)/n(S) \u2264 1.', reasoning: 'Dividing an inequality by a positive number preserves its direction, so the chain stays valid.' },
        { text: 'So 0 \u2264 P(E) \u2264 1 for every event.', reasoning: 'The bound is a consequence of E being a subset, which is why no event can ever fall outside it.' },
      ],
      answer: '0 \u2264 P(E) \u2264 1, because an event is a subset of the sample space.',
    },
    {
      id: 's141b.we2',
      prompt: `A fair die is rolled. Find P(${E_SEVEN.description}) and P(${E_UNDER_7.description}), and name each event.`,
      steps: [
        { text: `No face of the die shows 7, so the event "${E_SEVEN.description}" contains no outcomes and n(E) = ${N(E_SEVEN)}.`, reasoning: 'The event is still a perfectly good subset of S; it simply happens to be the empty one.' },
        { text: `P = ${N(E_SEVEN)}/${sampleSpaceSize(DIE)} = ${P(DIE, E_SEVEN)}, so this is an impossible event.`, reasoning: 'Zero favourable outcomes gives zero probability, which is the lower end of the range just derived.' },
        { text: `Every face is less than 7, so "${E_UNDER_7.description}" contains all ${sampleSpaceSize(DIE)} outcomes.`, reasoning: 'The condition is satisfied by each outcome in turn, so the event is the whole sample space.' },
        { text: `P = ${sampleSpaceSize(DIE)}/${sampleSpaceSize(DIE)} = ${P(DIE, E_UNDER_7)}, so this is a sure event.`, reasoning: 'The event coincides with S, which is the only way probability 1 arises in this model.' },
      ],
      answer: `P = ${P(DIE, E_SEVEN)} (impossible) and P = ${P(DIE, E_UNDER_7)} (sure).`,
    },
    {
      id: 's141b.we3',
      prompt: `Two fair dice are rolled. A student calls "${E_SUM2.description}" impossible because it almost never happens. Is that right?`,
      steps: [
        { text: `The event contains the single outcome ${E_SUM2.outcomes[0]}, so n(E) = ${N(E_SUM2)}.`, reasoning: 'Both dice showing 1 is a genuine outcome of the experiment, so the event is not empty.' },
        { text: `P = ${N(E_SUM2)}/${sampleSpaceSize(DICE2)} = ${P(DICE2, E_SUM2)}, which is small but positive.`, reasoning: 'A positive probability means the event can occur, however rarely.' },
        { text: 'An impossible event contains NO outcomes; this one contains one.', reasoning: 'The word is defined by the set being empty, not by the number being small.' },
        { text: `So the event is unlikely, not impossible \u2014 about ${approxDecimal(probability(DICE2, E_SUM2), 3)} as a decimal, rounded.`, reasoning: 'Keeping the two words apart matters because only one of them says the event cannot happen at all.' },
      ],
      answer: `No \u2014 P = ${P(DICE2, E_SUM2)}, which is small but not zero.`,
    },
  ],
  guidedPractice: [
    { id: 's141b.g1', prompt: 'A fair die is rolled. What is P(the number is between 1 and 6 inclusive)?', hint: 'How many faces satisfy it?', answer: '1.', rationale: 'Every one of the six faces satisfies the condition, so the event is the whole sample space and this is a sure event.' },
    { id: 's141b.g2', prompt: 'Can an event have probability 1.2?', hint: 'Compare n(E) with n(S).', answer: 'No.', rationale: 'That would need n(E) > n(S), and an event is a subset of S so it cannot have more outcomes than S has.' },
    { id: 's141b.g3', prompt: 'An event has probability 1/500. Is it impossible?', hint: 'How many outcomes does it contain?', answer: 'No, just unlikely.', rationale: 'A positive probability means the event contains at least one outcome and can occur. Impossible is reserved for the empty event.' },
  ],
  independentPractice: [
    { id: 's141b.i1', prompt: `Draw one card from a standard deck. What is P(the card is from one of the four suits)?`, answer: '1.', rationale: 'Every card belongs to a suit, so the event is the whole sample space of 52 cards \u2014 a sure event.' },
    { id: 's141b.i2', prompt: 'Why does the range 0 to 1 not need to be memorised separately?', answer: 'Because it follows from an event being a subset of S.', rationale: '0 \u2264 n(E) \u2264 n(S), and dividing by the positive n(S) gives the bound directly.' },
    { id: 's141b.i3', prompt: `Two fair dice are rolled. Is P(${E_SUM7.description}) = ${P(DICE2, E_SUM7)} a sure event because 7 is the commonest sum?`, answer: 'No.', rationale: `The event contains ${N(E_SUM7)} of the ${sampleSpaceSize(DICE2)} outcomes, so it leaves most of them out. Being the most likely sum is not the same as being certain.` },
    { id: 's141b.i4', prompt: 'A bag contains only red marbles. What is P(drawing a blue marble)?', answer: '0.', rationale: 'No outcome of the experiment is a blue marble, so the event is empty and the probability is 0 \u2014 genuinely impossible, not merely unlikely.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's141b.td1',
      prompt: 'Why is an event with a tiny probability not impossible, and why does the distinction matter?',
      expectedReasoning:
        'Because impossible is defined by the event being empty, not by its probability being small. An event with probability 1/36 contains an outcome, so the experiment can produce it, and over enough rolls it will. Treating small as impossible would mean predicting that something which does happen cannot, and it would also break the range argument: 0 is reached only by the empty event, so if small probabilities counted as impossible the value 0 would stop meaning anything definite.',
    },
    {
      id: 's141b.td2',
      prompt: 'Someone changes the sample space from 6 outcomes to 36 but leaves the favourable count at 3. What goes wrong?',
      expectedReasoning:
        'The two numbers now describe different experiments, so the fraction describes neither. The favourable count is a count of outcomes WITHIN a particular sample space, and changing the sample space changes which outcomes exist and therefore how many are favourable. Rolling one die, "even" has 3 favourable outcomes out of 6; rolling two, the ordered pairs are different objects entirely and "even" would have to be recounted among them. A probability is a relationship between an event and its own sample space, and neither half can be moved without the other.',
    },
  ],
  summary:
    `An event is a subset of S, so 0 \u2264 n(E) \u2264 n(S), and dividing by the positive n(S) gives 0 \u2264 P(E) \u2264 1 \u2014 derived, not remembered. The lower end is the IMPOSSIBLE event, containing no outcomes; the upper is the SURE event, containing all of them. Neither word stretches: an event of probability ${P(DICE2, E_SUM2)} is unlikely but can occur, and the commonest sum with two dice has probability ${P(DICE2, E_SUM7)}, far from sure.`,
  nextStep: 'Next you will use the fact that an event and its complement together make up the whole sample space.',
  teacher: teacher(
    'Students derive the 0-to-1 range from subset size and identify the two ends precisely.',
    ['The classical rule', 'Events as subsets'],
    ['How many outcomes, compared with all of them?', 'Empty, or just small?', 'Could it happen at all?'],
    [
      'Derive the range rather than stating it; the subset argument is two lines and makes the ends meaningful.',
      'The impossible-versus-unlikely distinction is the one students lose first. Keep returning to whether the event contains an outcome.',
      'The sum-7 example guards the other end: most likely is not sure.',
    ],
    ['Ask whether probability 1/500 means impossible.', 'Ask why 1.2 cannot be a probability.'],
    ['Have the student say how many outcomes the event contains before judging either word.'],
    ['Ask what kind of event has probability exactly 1/2 on a six-outcome space.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_14_1C: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s14_1_complement_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s14_1'],
    mayAssume: ['The classical rule', 'The 0-to-1 range', 'Impossible and sure events'],
    mustNotIntroduce: [{ concept: 'Addition or multiplication rules for arbitrary events', belongsToSection: 'outside_current_scope' }],
  },
  learningGoal:
    'You will use complementary events, understanding P(not E) = 1 \u2212 P(E) as a consequence of E and its complement partitioning the sample space.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compute P(E) for a listed event.', 'List the outcomes of S that are not in E.', 'Subtract fractions from 1.'],
    ifNotReady: 'Revise the two previous lessons. The complement is built from the sample space and the event together.',
  },
  vocabulary: [
    { term: 'complementary event', meaning: 'The event "not E", consisting of exactly those outcomes of S that are not in E.' },
    { term: 'partition', meaning: 'A split of the sample space into pieces that overlap nowhere and together cover everything.' },
  ],
  explanation: [
    'For an event E there is a second event made of everything else: the outcomes of S that are not in E. This is the COMPLEMENT of E, written "not E".',
    'The complement is not a separate thing to be listed by hand. It is determined entirely by S and E, so changing the event changes its complement at the same time.',
    'Two facts follow immediately. Nothing can be both in E and not in E, so the two events share no outcome. And every outcome of S is either in E or not, so together they cover the whole sample space. The two events PARTITION S.',
    'That partition is the reason for the arithmetic. Since the two events share nothing and cover everything, their favourable counts add to n(S): n(E) + n(not E) = n(S). Dividing by n(S) gives P(E) + P(not E) = 1, that is, P(not E) = 1 \u2212 P(E).',
    `Check it on a die. For "${E_EVEN.description}" the favourable outcomes are {${E_EVEN.outcomes.join(', ')}} and the complement is {${complement(DIE, E_EVEN).outcomes.join(', ')}}. The counts are ${N(E_EVEN)} and ${N(complement(DIE, E_EVEN))}, which add to ${sampleSpaceSize(DIE)}, and the probabilities ${P(DIE, E_EVEN)} and ${PC(DIE, E_EVEN)} add to 1.`,
    'Being two events, or being disjoint, is not enough to make a pair complementary. Both conditions are needed together.',
    `Rolling a die, "${E_EVEN.description}" and "${E_ONE_OR_THREE.description}" share no outcome, yet they are not complementary: between them they miss 5 entirely, so they do not cover S. Their probabilities are ${P(DIE, E_EVEN)} and ${P(DIE, E_ONE_OR_THREE)}, adding to ${formatRational({ num: 5, den: 6 })} rather than 1 \u2014 and that shortfall is exactly the outcome they leave out.`,
    'So the complement rule is useful when "not E" is easier to count than E, but it is a consequence of the partition rather than a subtraction trick, and it applies only to a genuine complement on the same sample space.',
  ],
  representations: ['A sample space split into an event and its complement, with no overlap and nothing left over'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's141c.we1',
      prompt: 'Explain why P(not E) = 1 \u2212 P(E).',
      steps: [
        { text: 'The complement of E consists of the outcomes of S that are not in E.', reasoning: 'It is defined from S and E together, so it is fixed as soon as those two are.' },
        { text: 'No outcome lies in both E and not E.', reasoning: 'An outcome either belongs to E or it does not, and the complement collects exactly the ones that do not.' },
        { text: 'Every outcome of S lies in one of them, so together they cover S.', reasoning: 'There is no third possibility, which is what makes the pair a partition rather than merely two events.' },
        { text: 'Hence n(E) + n(not E) = n(S).', reasoning: 'Counting S by splitting it into two non-overlapping parts counts every outcome exactly once.' },
        { text: 'Dividing by n(S): P(E) + P(not E) = 1, so P(not E) = 1 \u2212 P(E).', reasoning: 'The subtraction is a consequence of the partition, which is why it is safe to use without re-listing the outcomes.' },
      ],
      answer: 'Because E and its complement partition S, so their counts add to n(S).',
    },
    {
      id: 's141c.we2',
      prompt: `${MARBLES.description.charAt(0).toUpperCase() + MARBLES.description.slice(1)}. Find P(${E_NOT_WHITE.description}) using the complement.`,
      steps: [
        { text: `The complement of "${E_NOT_WHITE.description}" is "the marble is white".`, reasoning: 'Reversing the condition gives exactly the outcomes left out, and white is easier to count directly.' },
        { text: `There are ${N(complement(MARBLES, E_NOT_WHITE))} white marbles out of ${sampleSpaceSize(MARBLES)}, so P(white) = ${PC(MARBLES, E_NOT_WHITE)}.`, reasoning: 'Each marble is equally likely, so the classical rule applies on the same sample space as before.' },
        { text: `So P(not white) = 1 \u2212 ${PC(MARBLES, E_NOT_WHITE)} = ${P(MARBLES, E_NOT_WHITE)}.`, reasoning: 'The two events partition the bag, so subtracting from 1 is valid without listing the seven non-white marbles.' },
        { text: `Checking directly: ${N(E_NOT_WHITE)} marbles are not white, and ${N(E_NOT_WHITE)}/${sampleSpaceSize(MARBLES)} = ${P(MARBLES, E_NOT_WHITE)}.`, reasoning: 'The direct count agrees, confirming that the complement was taken on the right sample space.' },
      ],
      answer: `P = ${P(MARBLES, E_NOT_WHITE)}.`,
    },
    {
      id: 's141c.we3',
      prompt: `A die is rolled. A student says "${E_EVEN.description}" and "${E_ONE_OR_THREE.description}" are complementary because they cannot both happen. Is that right?`,
      steps: [
        { text: 'They are indeed disjoint: no number is both even and equal to 1 or 3.', reasoning: 'So the first of the two conditions for being complements is satisfied.' },
        { text: `But their union is {${[...E_EVEN.outcomes, ...E_ONE_OR_THREE.outcomes].sort().join(', ')}}, which leaves out 5.`, reasoning: 'Covering the whole sample space is the second condition, and it fails here on a single outcome.' },
        { text: `Their probabilities add to ${formatRational({ num: 5, den: 6 })}, not 1.`, reasoning: 'The shortfall of 1/6 is exactly the one outcome the pair omits, so the arithmetic records the gap.' },
        { text: `The true complement of "${E_EVEN.description}" is {${complement(DIE, E_EVEN).outcomes.join(', ')}}.`, reasoning: `It contains every outcome not in the event, including 5, and its probability is ${PC(DIE, E_EVEN)}.` },
      ],
      answer: 'No \u2014 they are disjoint but do not cover S, so they are not complementary.',
    },
  ],
  guidedPractice: [
    { id: 's141c.g1', prompt: `A fair die is rolled. Use the complement to find P(the number is not 6).`, hint: 'What is the complement?', answer: '5/6.', rationale: 'P(6) = 1/6, and "not 6" is its complement on the same sample space, so P = 1 \u2212 1/6 = 5/6.' },
    { id: 's141c.g2', prompt: `Two fair dice are rolled. Find P(${E_SUM7.description} does not happen).`, hint: 'Subtract from 1.', answer: `${PC(DICE2, E_SUM7)}.`, rationale: `P(sum 7) = ${P(DICE2, E_SUM7)}, so the complement has probability 1 \u2212 ${P(DICE2, E_SUM7)} = ${PC(DICE2, E_SUM7)}. Listing all ${sampleSpaceSize(DICE2) - N(E_SUM7)} other pairs would give the same answer with more work.` },
    { id: 's141c.g3', prompt: 'Are "the card is a heart" and "the card is a spade" complementary?', hint: 'Do they cover the deck?', answer: 'No.', rationale: 'They are disjoint, but diamonds and clubs belong to neither, so the pair does not cover the sample space.' },
  ],
  independentPractice: [
    { id: 's141c.i1', prompt: `Draw a card from a standard deck. Use the complement to find P(the card is not a king).`, answer: `${PC(CARD, E_KING)}.`, rationale: `There are ${N(E_KING)} kings, so P(king) = ${P(CARD, E_KING)} and the complement has probability 1 \u2212 ${P(CARD, E_KING)} = ${PC(CARD, E_KING)}.` },
    { id: 's141c.i2', prompt: 'Why must a complement be taken on the same sample space as the event?', answer: 'Because it is defined as the outcomes of that sample space not in the event.', rationale: 'Changing the sample space changes which outcomes exist, so "everything else" would mean something different and the two would no longer partition anything.' },
    { id: 's141c.i3', prompt: 'Two events are disjoint and their probabilities add to 0.9. Are they complementary?', answer: 'No.', rationale: 'Complements must cover the whole sample space, so their probabilities add to exactly 1. The missing 0.1 belongs to outcomes in neither event.' },
    { id: 's141c.i4', prompt: 'When is using the complement the easier route?', answer: 'When "not E" has fewer outcomes to count than E.', rationale: 'The two give the same answer, so the choice is purely about which count is shorter \u2014 as with "not a king" among 52 cards.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's141c.td1',
      prompt: 'Why is "not E" different from simply choosing another event that cannot happen at the same time as E?',
      expectedReasoning:
        'Because being disjoint is only half of what a complement requires. The complement must also leave nothing out: every outcome of S must be in E or in not E. Two disjoint events can easily miss outcomes between them \u2014 "even" and "1 or 3" on a die miss 5 \u2014 and then their probabilities add to less than 1, so the subtraction rule fails. The complement is the unique event that both avoids E entirely and covers everything else, which is why it is computed from S and E rather than chosen.',
    },
    {
      id: 's141c.td2',
      prompt: 'Why does a complement calculation use the same sample space as the original event?',
      expectedReasoning:
        'Because the complement is defined as the outcomes of THAT sample space which are not in E, so it has no meaning apart from it. If the sample space changed, "everything else" would refer to a different collection of outcomes, the two events would no longer partition anything, and n(E) + n(not E) would not equal n(S). The rule P(not E) = 1 \u2212 P(E) depends on the counts adding to the same total, and that total is the size of the one shared sample space.',
    },
  ],
  summary:
    `The complement of E is everything in S that is not in E, determined by S and E together rather than listed by hand. The two share no outcome and cover all of S, so n(E) + n(not E) = n(S) and therefore P(not E) = 1 \u2212 P(E). Disjoint is not enough: "${E_EVEN.description}" and "${E_ONE_OR_THREE.description}" overlap nowhere yet miss 5, so their probabilities add to ${formatRational({ num: 5, den: 6 })} and they are not complements.`,
  nextStep: 'Next you will apply all of this to coins, dice, cards and marbles, where listing the outcomes carefully is the work.',
  teacher: teacher(
    'Students derive the complement rule from the partition and test whether a pair is genuinely complementary.',
    ['The classical rule', 'The 0-to-1 range'],
    ['Does the pair cover everything?', 'What is left over?', 'Same sample space?'],
    [
      'Teach the partition first and the subtraction second; students who meet it as a trick apply it to any two disjoint events.',
      'The even / 1-or-3 example is the one that makes the second condition visible, because the gap is a single outcome.',
      'Keep addition and multiplication rules for general events out; the scope is complements only.',
    ],
    ['Ask whether hearts and spades are complementary.', 'Ask what the complement of "not white" is.'],
    ['Have the student list the leftover outcomes before deciding whether a pair is complementary.'],
    ['Ask when the complement route saves work and when it does not.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_14_1D: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s14_1_applications_lesson',
  contentArtifactVersion: 1,
  source: source(),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s14_1'],
    mayAssume: ['The classical rule', 'Complementary events', 'Standard deck facts as stated'],
    mustNotIntroduce: [
      { concept: 'Conditional probability and independence', belongsToSection: 'outside_current_scope' },
      { concept: 'Addition and multiplication theorems', belongsToSection: 'outside_current_scope' },
    ],
  },
  learningGoal:
    'You will find probabilities for coins, dice, cards and marbles by listing the outcome set carefully, so the denominator matches the experiment.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Apply P(E) = n(E) / n(S).', 'Use a complement.', 'Say what makes two outcomes different.'],
    ifNotReady: 'Revise the earlier lessons in this chapter. The arithmetic here is the same; the care is in the listing.',
  },
  vocabulary: [
    { term: 'elementary outcome', meaning: 'An outcome the experiment cannot split further \u2014 as fine as the experiment distinguishes.' },
    { term: 'ordered pair', meaning: 'A result recorded as (first, second), where the order carries information.' },
  ],
  explanation: [
    'Every calculation in this chapter uses the same rule. What varies is the experiment, and almost every mistake is a mistake about the sample space rather than about the arithmetic.',
    'The question to ask is always the same: what does this experiment treat as one outcome?',
    `For two distinguishable dice, each result records both faces, so the outcomes are ordered pairs: (1,2) and (2,1) are different results. There are ${sampleSpaceSize(DICE2)} of them, and all ${sampleSpaceSize(DICE2)} are equally likely.`,
    `The sums are not. "${E_SUM7.description}" happens in ${N(E_SUM7)} of those pairs \u2014 ${E_SUM7.outcomes.join(', ')} \u2014 giving P = ${P(DICE2, E_SUM7)}. "${E_SUM2.description}" happens only for ${E_SUM2.outcomes[0]}, giving P = ${P(DICE2, E_SUM2)}.`,
    'So the eleven sums from 2 to 12 are not equally likely, and treating them as a sample space of eleven equal outcomes would give every one of them the probability 1/11, which is wrong for all eleven. The equally likely outcomes are the ordered pairs; the sums are events built from them.',
    `For cards, the deck facts needed are these: ${sampleSpaceSize(CARD)} cards, 4 suits of 13, two red suits and two black, and 4 cards of each rank. No jokers. Each card is one outcome, so P(red) = ${N(E_RED_CARD)}/${sampleSpaceSize(CARD)} = ${P(CARD, E_RED_CARD)} and P(king) = ${N(E_KING)}/${sampleSpaceSize(CARD)} = ${P(CARD, E_KING)}.`,
    `For marbles the outcomes are the individual marbles, not the colours. A bag of 5 red, 3 white and 2 green has ${sampleSpaceSize(MARBLES)} outcomes, not three. Each marble is equally likely when they are identical apart from colour and thoroughly mixed; the three colour names are not.`,
    'That is the thread running through all four contexts. The outcomes are the physical things the experiment can distinguish, and the colours, sums and ranks are events assembled from them.',
  ],
  representations: ['An ordered-pair grid for two dice, with one sum marked across it'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's141d.we1',
      prompt: `${DICE2.description.charAt(0).toUpperCase() + DICE2.description.slice(1)}. Find P(${E_SUM7.description}) and P(${E_SUM2.description}).`,
      steps: [
        { text: `The dice are distinguishable, so each outcome records both faces as an ordered pair; n(S) = ${sampleSpaceSize(DICE2)}.`, reasoning: 'Six possibilities for the red die combine with six for the blue, and the colour makes (1,2) a different result from (2,1).' },
        { text: 'Both dice are modelled as fair, so all 36 ordered pairs are equally likely.', reasoning: 'The assumption attaches to the pairs, which is what allows dividing by 36.' },
        { text: `Sum 7 occurs for ${E_SUM7.outcomes.join(', ')} \u2014 ${N(E_SUM7)} pairs \u2014 so P = ${N(E_SUM7)}/${sampleSpaceSize(DICE2)} = ${P(DICE2, E_SUM7)}.`, reasoning: 'Listing the pairs rather than reasoning about the sum keeps the count tied to the sample space.' },
        { text: `Sum 2 occurs only for ${E_SUM2.outcomes[0]}, so P = ${P(DICE2, E_SUM2)}.`, reasoning: `Six pairs against one is why the sums cannot be equally likely, even though both are single values of the total.` },
      ],
      answer: `P(sum 7) = ${P(DICE2, E_SUM7)} and P(sum 2) = ${P(DICE2, E_SUM2)}.`,
    },
    {
      id: 's141d.we2',
      prompt: `${CARD.description.charAt(0).toUpperCase() + CARD.description.slice(1)}. Find P(${E_KING.description}) and P(the card is not a king).`,
      steps: [
        { text: `Each card is one outcome, so n(S) = ${sampleSpaceSize(CARD)}, and the deck is modelled as well shuffled.`, reasoning: 'The shuffling assumption is what makes the 52 cards equally likely to be drawn.' },
        { text: `There are 4 cards of each rank, so the kings are ${N(E_KING)} outcomes.`, reasoning: 'One king per suit across four suits, which is a deck fact rather than something derived.' },
        { text: `P(king) = ${N(E_KING)}/${sampleSpaceSize(CARD)} = ${P(CARD, E_KING)}.`, reasoning: 'The fraction reduces, and both numbers refer to the same 52-card sample space.' },
        { text: `"Not a king" is the complement, so P = 1 \u2212 ${P(CARD, E_KING)} = ${PC(CARD, E_KING)}.`, reasoning: `Counting the ${sampleSpaceSize(CARD) - N(E_KING)} non-kings directly gives the same answer with more work, which is when the complement is worth using.` },
      ],
      answer: `P(king) = ${P(CARD, E_KING)} and P(not a king) = ${PC(CARD, E_KING)}.`,
    },
    {
      id: 's141d.we3',
      prompt: `A student says the sums 2 to 12 from two dice are eleven outcomes, so each has probability 1/11. What is wrong?`,
      steps: [
        { text: 'The eleven sums are real possibilities, so the list itself is not the error.', reasoning: 'Every one of them can occur, so none can be dismissed as impossible.' },
        { text: 'But they are not equally likely, and the rule needs that condition.', reasoning: 'Favourable-over-total applies only to equally likely outcomes, and nothing here establishes it for sums.' },
        { text: `Sum 7 arises from ${N(E_SUM7)} ordered pairs while sum 2 arises from ${N(E_SUM2)}.`, reasoning: 'Six ways against one, so the two sums cannot have the same chance however they are labelled.' },
        { text: `The equally likely outcomes are the ${sampleSpaceSize(DICE2)} ordered pairs; the sums are events built from them.`, reasoning: 'Counting the pairs within each sum gives the right probabilities, and they differ from each other as they should.' },
      ],
      answer: 'The sums are not equally likely \u2014 they are events made of different numbers of ordered pairs.',
    },
  ],
  guidedPractice: [
    { id: 's141d.g1', prompt: `${COIN2.description.charAt(0).toUpperCase() + COIN2.description.slice(1)}. Find P(at least one head).`, hint: 'Which of the four outcomes qualify?', answer: '3/4.', rationale: 'HH, HT and TH all contain a head, so 3 of the 4 equally likely outcomes qualify. The complement, TT, has probability 1/4.' },
    { id: 's141d.g2', prompt: `A card is drawn. Find P(the card is a red king).`, hint: 'How many kings are red?', answer: '1/26.', rationale: 'Two kings are red, one in hearts and one in diamonds, so P = 2/52 = 1/26.' },
    { id: 's141d.g3', prompt: `${MARBLES.description.charAt(0).toUpperCase() + MARBLES.description.slice(1)}. Find P(the marble is green).`, hint: 'Count marbles, not colours.', answer: '1/5.', rationale: `There are 2 green marbles among ${sampleSpaceSize(MARBLES)}, so P = 2/10 = 1/5. Answering 1/3 would count the three colour names as outcomes.` },
    { id: 's141d.g4', prompt: 'Two dice are rolled. Find P(the sum is 3).', hint: 'List the ordered pairs.', answer: '1/18.', rationale: 'The pairs are (1,2) and (2,1), so P = 2/36 = 1/18. The two orders are different outcomes of this experiment.' },
  ],
  independentPractice: [
    { id: 's141d.i1', prompt: 'Two fair coins are tossed. Find P(no head).', answer: '1/4.', rationale: 'Only TT has no head, out of the four equally likely ordered outcomes.' },
    { id: 's141d.i2', prompt: 'A card is drawn. Find P(the card is a heart).', answer: '1/4.', rationale: 'One suit of 13 among 52 cards, so P = 13/52 = 1/4.' },
    { id: 's141d.i3', prompt: `${MARBLES.description.charAt(0).toUpperCase() + MARBLES.description.slice(1)}. Find P(${E_NOT_WHITE.description}).`, answer: `${P(MARBLES, E_NOT_WHITE)}.`, rationale: `Three marbles are white, so P(white) = 3/10 and the complement is 1 \u2212 3/10 = ${P(MARBLES, E_NOT_WHITE)}.` },
    { id: 's141d.i4', prompt: 'Why are two dice recorded as ordered pairs rather than by their total?', answer: 'Because the experiment distinguishes the dice, and the totals are not equally likely.', rationale: 'Each die shows a face, so a result names both. The totals are events assembled from varying numbers of pairs, so they cannot serve as equally likely outcomes.' },
    { id: 's141d.i5', prompt: 'A bag holds 4 blue and 6 yellow counters, identical apart from colour. Find P(blue), and say what the outcomes are.', answer: '2/5, and the outcomes are the ten individual counters.', rationale: '4 of the 10 counters are blue, so P = 4/10 = 2/5. The two colour names are not the outcomes.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's141d.td1',
      prompt: 'Why are the sums 2 to 12 from two dice not equally likely, and what are the equally likely outcomes instead?',
      expectedReasoning:
        'Because each sum is an event built from ordered pairs, and different sums are built from different numbers of them. Sum 7 comes from six pairs and sum 2 from one, so they cannot share a probability. The equally likely outcomes are the 36 ordered pairs, which is where the fairness assumption belongs: each die is modelled as fair and the dice are distinguishable, so every pair has the same chance. Probabilities of sums are then found by counting how many pairs produce each one, which gives 6/36 and 1/36 rather than 1/11 for both.',
    },
    {
      id: 's141d.td2',
      prompt: 'Across coins, dice, cards and marbles, what single question decides the sample space?',
      expectedReasoning:
        'What does the experiment treat as one outcome? For two coins it is the ordered result, so HT and TH are separate. For two dice it is the ordered pair, so (1,2) and (2,1) are separate. For a deck it is the individual card, not the suit or the rank. For a bag it is the individual marble, not the colour. In each case the answer is the physical thing the experiment can distinguish, and the groupings people naturally name \u2014 sums, colours, suits \u2014 are events assembled from those outcomes. Getting this wrong changes the denominator, so no amount of correct arithmetic afterwards can recover the right answer.',
    },
  ],
  summary:
    `The rule does not change across contexts; the sample space does. Two distinguishable dice give ${sampleSpaceSize(DICE2)} equally likely ORDERED PAIRS, so sums are events built from them \u2014 ${N(E_SUM7)} pairs give sum 7 and ${N(E_SUM2)} gives sum 2, which is why the eleven sums are not equally likely. A deck gives ${sampleSpaceSize(CARD)} equally likely cards, and a bag gives one outcome per marble, not per colour. Ask what the experiment treats as one outcome, and the denominator follows.`,
  nextStep: 'The chapter summary recapitulates the classical definition, the range and complementary events.',
  teacher: teacher(
    'Students list outcome sets correctly across four contexts and resist grouping outcomes into unequal categories.',
    ['The classical rule', 'Complements'],
    ['What counts as one outcome here?', 'Are those really equally likely?', 'Count the things, not the names.'],
    [
      'The dice-sum misconception is the highest-value item in the chapter; the pair counts make it concrete in a way that argument does not.',
      'Insist on individual marbles and individual cards. Colour and suit are events, and students who blur this get a denominator of 3 or 4.',
      'Stay with single draws. Conditional probability and independence are outside this scope, and a second draw invites both.',
    ],
    ['Ask why sum 7 is likelier than sum 2.', 'Ask what the outcomes are for a bag of marbles.'],
    ['Have the student write n(S) and say what one outcome is before counting anything favourable.'],
    ['Ask which sum with two dice is least likely, and why there are two of them.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_PROBABILITY_SECTIONS: AuthoredSection[] = [
  C10_SECTION_14_1A, C10_SECTION_14_1B, C10_SECTION_14_1C, C10_SECTION_14_1D,
];
