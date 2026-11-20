// ===========================================================================
// v0.84.0-c10.10 checkpoint 64 — CLASS 10 ARITHMETIC PROGRESSIONS.
//
// The frozen Class 9 record shows students already derived a + (n-1)d and
// already derived the pairing sum and extended it to any AP. So these
// lessons formalise and extend; they do not introduce, and
// `auditNoveltyClaims` enforces that.
//
// What Class 10 genuinely adds: the systematic treatment, finite APs with a
// last term l, a term counted from the end, the second sum form n/2(a + l),
// and contextual totals.
//
// Every displayed term, position and sum is derived from ONE
// `ArithmeticProgression` per example.
//
// Source: NCERT Mathematics, Textbook for Class X (Reprint 2026-27), §5.2
// (folio 51), §5.3 (folio 56) and §5.4 (folio 63). §5.1 and §5.5 are REVIEW
// and earn no units.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import {
  directSum, firstTerms, formatRational, lastTerm, positionOf, sum, sumWithLast,
  term, termFromEnd, type ArithmeticProgression,
} from './arithmeticProgression';

export const AP_CHAPTER_ID = 'ncert_jemh1_ch05';

const BOOK = 'Mathematics, Textbook for Class X (Reprint 2026-27)';
const SRC = 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip';
const INSPECTED = '2026-10-16';

const source = (sectionNumber: string, exactTitle: string, startPage: number, officialSectionId: string) => ({
  officialChapterId: AP_CHAPTER_ID, officialSectionId, sectionNumber, exactTitle,
  startPage, textbook: BOOK, sourceReference: SRC, inspectionDate: INSPECTED,
});

/**
 * What the frozen Class 9 record actually shows, recorded here so an author
 * can see it before writing an opening sentence.
 */
export const CLASS_9_PRIOR = {
  source: 'src/curriculum/sequencesSections.ts (Class 9 Chapter 8, frozen)',
  alreadyCovered: [
    'a sequence as an ordered list, and referring to a term by its position',
    'an explicit rule in n, and deciding whether a given number is a term',
    'naming an arithmetic progression by its constant difference',
    'deriving the nth term as a + (n \u2212 1)d',
    'deriving the pairing sum and extending it to any arithmetic progression',
  ],
  genuinelyNewInClass10: [
    'a finite AP with a named last term l',
    'a term counted from the end',
    'the second sum form n/2(a + l), and choosing between the two',
    'contextual totals where the choice between a term and a sum is the work',
  ],
};

// --- the canonical progressions --------------------------------------------

/** An increasing AP. */
export const AP_UP: ArithmeticProgression = { id: 'ap_up', a: 5, d: 3 };
/** A decreasing AP — d is negative, not an absolute difference. */
export const AP_DOWN: ArithmeticProgression = { id: 'ap_down', a: 10, d: -3 };
/** A constant AP, d = 0. */
export const AP_FLAT: ArithmeticProgression = { id: 'ap_flat', a: 5, d: 0 };
/** A finite AP with a last term. */
export const AP_FINITE: ArithmeticProgression = { id: 'ap_finite', a: 7, d: 4, length: 12 };
/** Seats per row — the contrast between one row and all the rows. */
export const AP_SEATS: ArithmeticProgression = { id: 'ap_seats', a: 18, d: 2, length: 20, meaning: 'seats in a row' };
/** Savings per month, decreasing. */
export const AP_SAVINGS: ArithmeticProgression = { id: 'ap_savings', a: 900, d: -50, length: 12, meaning: 'rupees saved in a month' };

export const CANONICAL_APS = [AP_UP, AP_DOWN, AP_FLAT, AP_FINITE, AP_SEATS, AP_SAVINGS];

const T = (ap: ArithmeticProgression, k: number) => firstTerms(ap, k).join(', ');
const S = (ap: ArithmeticProgression, n: number) => formatRational(sum(ap, n));

const teacher = (objective: string, prereq: string[], lang: string[], notes: string[], checks: string[], support: string[], ext: string[]) => ({
  objective, prerequisiteKnowledge: prereq, modelLanguage: lang, teachingNotes: notes,
  quickChecks: checks, supportForStrugglingLearners: support, extension: ext, materialsNeeded: [],
});

export const C10_SECTION_5_2A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s5_2_identify_ap_lesson',
  contentArtifactVersion: 1,
  source: source('5.2', 'Arithmetic Progressions', 51, 'ncert_jemh1_s5_2'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Sequences and terms by position from Class IX', 'Arithmetic progressions named by their constant difference in Class IX', 'Signed subtraction'],
    mustNotIntroduce: [
      { concept: 'The nth-term formula', belongsToSection: 'ncert_jemh1_s5_3' },
      { concept: 'The sum of the first n terms', belongsToSection: 'ncert_jemh1_s5_4' },
    ],
  },
  learningGoal:
    'You will test whether a list of numbers is an arithmetic progression, and state its first term and common difference with the correct sign.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Refer to a term of a sequence by its position.', 'Subtract two numbers keeping the sign.', 'Say what a constant difference means.'],
    ifNotReady: 'Revise sequences from Class IX. You named arithmetic progressions there; this lesson makes the test systematic.',
  },
  vocabulary: [
    { term: 'arithmetic progression', meaning: 'A sequence in which the difference between consecutive terms is constant.' },
    { term: 'first term', meaning: 'The term in position 1, written a.' },
    { term: 'common difference', meaning: 'The constant d = a\u2082 \u2212 a\u2081 = a\u2083 \u2212 a\u2082 and so on, taken in that order so its sign is meaningful.' },
    { term: 'consecutive terms', meaning: 'Terms next to each other in the list.' },
  ],
  explanation: [
    'You named arithmetic progressions in Class IX and worked with their constant difference. Class 10 formalises that into a systematic theory, and the first step is a test you can apply to any list.',
    'A sequence is an arithmetic progression when the difference between consecutive terms is constant. To test a list, subtract each term from the one after it and check that every answer is the same.',
    'The ORDER of that subtraction matters, and this is the first place things go wrong. The common difference is d = a\u2082 \u2212 a\u2081, the later term minus the earlier one. For 10, 7, 4, 1 that gives 7 \u2212 10 = \u22123, so d = \u22123 \u2014 not 3.',
    'Using the size of the gap and ignoring the sign would make 10, 7, 4 and 4, 7, 10 look identical, and they are different progressions going in opposite directions.',
    'So an AP need not increase. With d negative it decreases, and with d = 0 every term is the same: 5, 5, 5, 5 is an arithmetic progression whose common difference is 0. Requiring d to be non-zero would exclude it for no reason.',
    `Once a and d are known, the whole progression follows: start at a and keep adding d. From a = ${AP_UP.a} and d = ${AP_UP.d} the terms are ${T(AP_UP, 5)}, and from a = ${AP_DOWN.a} with d = ${AP_DOWN.d} they are ${T(AP_DOWN, 5)}.`,
    'Checking only one difference is not enough. In 2, 5, 8, 12 the first two differences are 3 and 3, and the third is 4 \u2014 so it is not an AP, and stopping early would have missed it. Every consecutive pair has to be checked.',
  ],
  representations: ['A list of terms with the difference between each consecutive pair shown'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's52a.we1',
      prompt: `Is ${T(AP_UP, 5)} an arithmetic progression? If so, give a and d.`,
      steps: [
        { text: 'Subtract each term from the one after it, in that order.', reasoning: 'Taking the later term minus the earlier one is what makes the sign of the answer meaningful.' },
        { text: `${firstTerms(AP_UP, 5)[1]} \u2212 ${firstTerms(AP_UP, 5)[0]} = ${AP_UP.d}, ${firstTerms(AP_UP, 5)[2]} \u2212 ${firstTerms(AP_UP, 5)[1]} = ${AP_UP.d}, and the remaining differences are also ${AP_UP.d}.`, reasoning: 'All four differences must be checked, not just the first, since a list can agree at the start and diverge later.' },
        { text: `Every difference is the same, so it is an AP with a = ${AP_UP.a} and d = ${AP_UP.d}.`, reasoning: 'The first term is simply the term in position 1, and d is the shared value of the differences.' },
      ],
      answer: `Yes \u2014 a = ${AP_UP.a}, d = ${AP_UP.d}.`,
    },
    {
      id: 's52a.we2',
      prompt: `Is ${T(AP_DOWN, 5)} an arithmetic progression? Give d with its sign.`,
      steps: [
        { text: `${firstTerms(AP_DOWN, 5)[1]} \u2212 ${firstTerms(AP_DOWN, 5)[0]} = ${AP_DOWN.d}.`, reasoning: 'The later term is smaller, so the difference is negative \u2014 that sign is information, not an inconvenience.' },
        { text: `The remaining differences are also ${AP_DOWN.d}.`, reasoning: 'A decreasing list can still have a constant difference, which is exactly what makes it an AP.' },
        { text: `So it is an AP with a = ${AP_DOWN.a} and d = ${AP_DOWN.d}.`, reasoning: 'Writing d = 3 here would describe a different progression, one that climbs away from 10 instead of falling.' },
      ],
      answer: `Yes \u2014 a = ${AP_DOWN.a}, d = ${AP_DOWN.d}.`,
    },
    {
      id: 's52a.we3',
      prompt: 'Is 2, 5, 8, 12 an arithmetic progression?',
      steps: [
        { text: '5 \u2212 2 = 3 and 8 \u2212 5 = 3, so the first two differences agree.', reasoning: 'At this point the list looks like an AP, which is why stopping here would give the wrong answer.' },
        { text: '12 \u2212 8 = 4, which is different.', reasoning: 'One disagreeing difference is enough: the definition requires every consecutive difference to be the same.' },
        { text: 'So it is not an arithmetic progression.', reasoning: 'There is no single d, so no first term and common difference can describe the list.' },
      ],
      answer: 'No \u2014 the last difference is 4 while the others are 3.',
    },
  ],
  guidedPractice: [
    { id: 's52a.g1', prompt: 'Find d for 20, 14, 8, 2.', hint: 'Later term minus earlier.', answer: '\u22126.', rationale: '14 \u2212 20 = \u22126, and the remaining differences are also \u22126. Writing 6 would describe an increasing progression instead.' },
    { id: 's52a.g2', prompt: `Is ${T(AP_FLAT, 4)} an arithmetic progression?`, hint: 'What is each difference?', answer: 'Yes, with d = 0.', rationale: 'Every consecutive difference is 0, which is constant. Nothing in the definition requires d to be non-zero.' },
    { id: 's52a.g3', prompt: 'Is 1, 4, 9, 16 an arithmetic progression?', hint: 'Check all three differences.', answer: 'No.', rationale: 'The differences are 3, 5 and 7, which are not constant. The list has a pattern, but not a constant-difference one.' },
  ],
  independentPractice: [
    { id: 's52a.i1', prompt: 'Write the first four terms of the AP with a = \u22124 and d = 7.', answer: '\u22124, 3, 10, 17.', rationale: 'Start at the first term and add d each time; a negative first term is no obstacle.' },
    { id: 's52a.i2', prompt: 'Why is the order of subtraction important when finding d?', answer: 'Because the sign tells you whether the AP increases or decreases.', rationale: 'Later minus earlier gives a negative d for a decreasing AP; using the size alone would lose that distinction entirely.' },
    { id: 's52a.i3', prompt: 'A student checks only the first difference of 3, 7, 11, 14 and says it is an AP. What is wrong?', answer: 'The last difference is 3, not 4, so it is not an AP.', rationale: 'The differences are 4, 4 and 3. Every consecutive pair must be checked, since a list can agree at the start.' },
    { id: 's52a.i4', prompt: 'Can an arithmetic progression have all its terms equal?', answer: 'Yes, when d = 0.', rationale: 'A constant difference of 0 satisfies the definition, giving a sequence such as 5, 5, 5, 5.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's52a.td1',
      prompt: 'Why must the common difference carry a sign, rather than being the size of the gap between terms?',
      expectedReasoning:
        'Because the sign records direction, and two progressions can have the same gap while going opposite ways. 10, 7, 4, 1 and 1, 4, 7, 10 both have gaps of 3, but one falls and one rises; only a signed d of \u22123 and +3 distinguishes them. Every later formula uses d as a signed quantity too, so dropping the sign would not merely lose information here \u2014 it would give wrong terms and wrong sums downstream.',
    },
    {
      id: 's52a.td2',
      prompt: 'Why is checking one difference not enough to conclude a list is an AP?',
      expectedReasoning:
        'Because the definition is a claim about EVERY consecutive pair, and a list can satisfy it at the start and fail later. In 2, 5, 8, 12 the first two differences are both 3, so a check that stops early would call it an AP; the third difference is 4 and it is not. One matching difference shows only that the first three terms are consistent with an AP, which is a much weaker statement than the definition makes.',
    },
  ],
  summary:
    `A sequence is an arithmetic progression when the difference between consecutive terms is constant. Find d as the later term minus the earlier one, so its SIGN is meaningful: ${T(AP_DOWN, 4)} has d = ${AP_DOWN.d}, not 3. An AP may increase, decrease, or stay constant with d = 0. Check every consecutive difference, not just the first.`,
  nextStep: 'Next you will formalise the rule for the term in any position.',
  teacher: teacher(
    'Students test a list for the AP property and state a and d with the correct sign.',
    ['Sequences and terms by position (Class IX)', 'Arithmetic progressions named in Class IX'],
    ['Later minus earlier \u2014 always that order.', 'Check every difference, not the first.', 'Can an AP go down? Can it stand still?'],
    [
      'Students met APs in Class IX, so this lesson should move briskly through the definition and spend its time on the sign and on checking every pair.',
      'The 2, 5, 8, 12 example earns its place because it agrees at the start; a list that fails immediately teaches nothing about why the check must continue.',
      'Include d = 0 explicitly. Students who learn "goes up by the same amount" will reject constant sequences.',
    ],
    ['Ask for d in 20, 14, 8.', 'Ask whether 5, 5, 5 is an AP.'],
    ['Have the student write each difference under the gap it comes from before judging the list.'],
    ['Ask what a list with differences 3, 3, 3, 4 tells you about where the pattern breaks.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_5_3A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s5_3_nth_term_lesson',
  contentArtifactVersion: 1,
  source: source('5.3', 'nth Term of an AP', 56, 'ncert_jemh1_s5_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s5_2'],
    mayAssume: ['Identifying a and d', 'The nth term a + (n \u2212 1)d derived in Class IX', 'Solving a linear equation'],
    mustNotIntroduce: [{ concept: 'The sum of the first n terms', belongsToSection: 'ncert_jemh1_s5_4' }],
  },
  learningGoal:
    'You will re-derive the nth term a + (n \u2212 1)d from the structure of an AP, use it to find any term, and decide whether a given value occurs as a term.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['State a and d for a given AP.', 'Substitute into a formula with brackets.', 'Solve an equation such as 5 + 3(n \u2212 1) = 74.'],
    ifNotReady: 'Revise the previous lesson. The formula here is built from a and d, so those must be secure.',
  },
  vocabulary: [
    { term: 'nth term', meaning: 'The term in position n, written a\u2099 and given by a + (n \u2212 1)d.' },
    { term: 'position', meaning: 'Which place a term occupies \u2014 a whole number n \u2265 1, not the value of the term.' },
    { term: 'term of an AP', meaning: 'A value that actually occurs in the progression, at some whole-number position.' },
  ],
  explanation: [
    'You derived a + (n \u2212 1)d in Class IX. Class 10 re-derives it so the reason is in front of you, because every later result depends on the (n \u2212 1) being right.',
    'Build the terms. The first term is a. The second is a + d \u2014 one step of d has been taken. The third is a + 2d, the fourth a + 3d. The pattern is that reaching position n takes n \u2212 1 steps, because the first term takes none.',
    'So a\u2099 = a + (n \u2212 1)d. The simplest check on the formula is also the most useful: at n = 1 it gives a + 0 \u00d7 d = a, the first term, which is what it must give.',
    'That check catches the classic error. Writing a + nd instead gives a + d at n = 1 \u2014 the SECOND term \u2014 so every answer comes out one place too far along. The formula is not wrong by a little; it answers a different question.',
    `Using it: for the AP with a = ${AP_UP.a} and d = ${AP_UP.d}, the 10th term is ${AP_UP.a} + 9 \u00d7 ${AP_UP.d} = ${term(AP_UP, 10)}. The 9 is n \u2212 1, not n.`,
    'The formula also runs backwards. Asked WHICH term a value is, set the value equal to a + (n \u2212 1)d and solve for n \u2014 and the answer is a position, not another value.',
    `But solving is not the end. A position must be a whole number and at least 1. For a = ${AP_UP.a}, d = ${AP_UP.d}, the value 74 gives n = ${formatRational(positionOf(AP_UP, 74)!)}, a genuine position. The value 73 gives n = ${formatRational(positionOf(AP_UP, 73)!)}, which is not a whole number \u2014 so 73 is simply not a term of this AP, and rounding it to 24 would claim a term that does not exist.`,
  ],
  representations: ['A term-position table showing how many steps of d each position takes'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's53a.we1',
      prompt: 'Derive the formula for the nth term of an AP with first term a and common difference d.',
      steps: [
        { text: 'The first term is a, with no step of d taken yet.', reasoning: 'This is the base of the pattern, and it is what makes the exponent of steps one less than the position.' },
        { text: 'The second term is a + d, the third a + 2d, the fourth a + 3d.', reasoning: 'Each new term adds one more d, because the common difference is what separates consecutive terms.' },
        { text: 'In each case the number of d\u2019s is one less than the position.', reasoning: 'Position 4 has 3 steps, position 3 has 2 \u2014 the first term uses none, so the count always lags the position by one.' },
        { text: 'So a\u2099 = a + (n \u2212 1)d.', reasoning: 'Generalising the observed count gives the formula, rather than asking it to be remembered.' },
        { text: 'Check at n = 1: a + (1 \u2212 1)d = a + 0 = a.', reasoning: 'The formula returns the first term, which is the simplest test it must pass and the one that catches a + nd.' },
      ],
      answer: 'a\u2099 = a + (n \u2212 1)d, and it returns a at n = 1.',
    },
    {
      id: 's53a.we2',
      prompt: `Find the 10th and 25th terms of the AP ${T(AP_UP, 4)}, ...`,
      steps: [
        { text: `a = ${AP_UP.a} and d = ${AP_UP.d}.`, reasoning: 'Both come from the previous lesson\u2019s test; the difference is positive here so the progression climbs.' },
        { text: `a\u2081\u2080 = ${AP_UP.a} + (10 \u2212 1) \u00d7 ${AP_UP.d} = ${AP_UP.a} + 9 \u00d7 ${AP_UP.d} = ${term(AP_UP, 10)}.`, reasoning: 'The multiplier is 9, not 10 \u2014 nine steps are needed to move from the first term to the tenth.' },
        { text: `a\u2082\u2085 = ${AP_UP.a} + 24 \u00d7 ${AP_UP.d} = ${term(AP_UP, 25)}.`, reasoning: 'The same reasoning at a larger position, where an off-by-one would be harder to spot by listing terms.' },
      ],
      answer: `a\u2081\u2080 = ${term(AP_UP, 10)} and a\u2082\u2085 = ${term(AP_UP, 25)}.`,
    },
    {
      id: 's53a.we3',
      prompt: `For the same AP, is 74 a term? Is 73?`,
      steps: [
        { text: `Set 74 = ${AP_UP.a} + (n \u2212 1) \u00d7 ${AP_UP.d}, so ${AP_UP.d}(n \u2212 1) = 69 and n \u2212 1 = 23.`, reasoning: 'Solving for n answers "which term", so the unknown being found is a position rather than a value.' },
        { text: `n = ${formatRational(positionOf(AP_UP, 74)!)}, a whole number at least 1, so 74 is the ${formatRational(positionOf(AP_UP, 74)!)}th term.`, reasoning: 'Both conditions are checked: a position must be whole and must be at least 1.' },
        { text: `Now 73: ${AP_UP.d}(n \u2212 1) = 68, so n \u2212 1 = 68/3 and n = ${formatRational(positionOf(AP_UP, 73)!)}.`, reasoning: '68 is not divisible by 3, so the position comes out as a fraction.' },
        { text: `${formatRational(positionOf(AP_UP, 73)!)} is not a whole number, so 73 is not a term of this AP.`, reasoning: 'Rounding to 24 would name a position whose term is 74, not 73 \u2014 the rounding would change the answer rather than tidy it.' },
      ],
      answer: `74 is the ${formatRational(positionOf(AP_UP, 74)!)}th term; 73 is not a term.`,
    },
  ],
  guidedPractice: [
    { id: 's53a.g1', prompt: `Find the 15th term of the AP with a = ${AP_DOWN.a} and d = ${AP_DOWN.d}.`, hint: 'How many steps from the first term?', answer: `${term(AP_DOWN, 15)}.`, rationale: `${AP_DOWN.a} + 14 \u00d7 (${AP_DOWN.d}) = ${term(AP_DOWN, 15)}. The negative d makes the terms fall below zero, which is fine for a number sequence.` },
    { id: 's53a.g2', prompt: 'Why must the formula give a when n = 1?', hint: 'How many steps have been taken?', answer: 'Because the first term needs no steps of d.', rationale: '(1 \u2212 1)d = 0, so the formula returns a. A formula failing this test is answering about the wrong position.' },
    { id: 's53a.g3', prompt: `Is 100 a term of the AP with a = ${AP_UP.a} and d = ${AP_UP.d}?`, hint: 'Solve for n and check it is a whole number.', answer: `No \u2014 n = ${formatRational(positionOf(AP_UP, 100)!)}.`, rationale: '95 is not divisible by 3, so the position is not a whole number and 100 does not occur.' },
  ],
  independentPractice: [
    { id: 's53a.i1', prompt: `Find the 20th term of the AP with a = ${AP_FINITE.a} and d = ${AP_FINITE.d}.`, answer: `${7 + 19 * 4}.`, rationale: '7 + 19 \u00d7 4 = 83. The multiplier is 19, one less than the position.' },
    { id: 's53a.i2', prompt: 'A student uses a + nd and gets 8 for the first term of the AP 5, 8, 11. What went wrong?', answer: 'The formula gave the second term: it should be a + (n \u2212 1)d.', rationale: 'At n = 1, a + nd gives 5 + 3 = 8, which is a\u2082. Every answer comes out one position too far along.' },
    { id: 's53a.i3', prompt: 'Solving for n gives 13/2. Is the value a term?', answer: 'No.', rationale: 'A position must be a whole number. 13/2 is not, so the value falls between two terms and does not occur.' },
    { id: 's53a.i4', prompt: 'The question asks which term 41 is. A student answers 41. What was misunderstood?', answer: 'The question asks for a position, not a value.', rationale: 'The answer should be a whole number n such that a\u2099 = 41, which is a place in the list rather than the number sitting there.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's53a.td1',
      prompt: 'Why is a + nd off by one, and what is the quickest way to catch the error?',
      expectedReasoning:
        'Because reaching position n takes n \u2212 1 steps of d, not n \u2014 the first term takes none. Using a + nd adds one step too many, so it returns the term after the one asked for, at every position. The quickest check is to put n = 1: the correct formula gives a + 0 = a, the first term, while a + nd gives a + d, the second. That single substitution settles it without listing any terms, and it works whatever a and d are.',
    },
    {
      id: 's53a.td2',
      prompt: 'When checking whether a value belongs to an AP, why must n be a positive whole number, and why is rounding it wrong?',
      expectedReasoning:
        'Because n counts positions in a list, and there is no term between the sixth and the seventh. A fractional n means the value falls in the gap between two terms rather than landing on one, so it is not a term at all. Rounding would substitute a nearby position whose term is a different number \u2014 for the AP starting 5 with d = 3, rounding n = 71/3 up to 24 names the term 74, which is not the value asked about. The rounding would not approximate the answer; it would change the question.',
    },
  ],
  summary:
    `Reaching position n takes n \u2212 1 steps of d, so a\u2099 = a + (n \u2212 1)d \u2014 a formula you derived in Class IX and re-derive here. The check that matters: at n = 1 it must return a, which is exactly what a + nd fails. Running it backwards finds a POSITION, and a value is a term only when that position is a whole number at least 1: for a = ${AP_UP.a}, d = ${AP_UP.d}, 74 is the ${formatRational(positionOf(AP_UP, 74)!)}th term while 73 is no term at all.`,
  nextStep: 'Next you will solve for a missing first term, difference or position, including terms counted from the end.',
  teacher: teacher(
    'Students re-derive the nth term, apply it, and decide membership by checking the position is a whole number.',
    ['a and d from a list', 'Solving linear equations'],
    ['How many steps from the first term?', 'Put n = 1 \u2014 does it give a?', 'Is that a position or a value?'],
    [
      'Students derived this in Class IX, so the derivation should be brisk and the n = 1 check should be the thing that sticks.',
      'The membership example with 73 is the one to dwell on. A fractional position is not an inconvenience to round away; it is the answer.',
      'Watch for a position being reported as a value, which the "which term is 41" item is built to expose.',
    ],
    ['Ask what a + nd gives at n = 1.', 'Ask what n = 13/2 means about the value.'],
    ['Have the student write the multiplier as (n \u2212 1) explicitly before putting a number in.'],
    ['Ask which values between two consecutive terms could ever be terms.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_5_3B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s5_3_missing_parts_lesson',
  contentArtifactVersion: 1,
  source: source('5.3', 'nth Term of an AP', 56, 'ncert_jemh1_s5_3'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s5_3'],
    mayAssume: ['The nth-term formula', 'Solving a pair of simple equations'],
    mustNotIntroduce: [{ concept: 'The sum of the first n terms', belongsToSection: 'ncert_jemh1_s5_4' }],
  },
  learningGoal:
    'You will find a missing first term, common difference or position from information about an AP, and find a term counted from the end of a finite one.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Use a\u2099 = a + (n \u2212 1)d.', 'Solve two equations in two unknowns.', 'Say what the last term of a finite list means.'],
    ifNotReady: 'Revise the nth-term lesson. Everything here is that one formula, used where a different quantity is unknown.',
  },
  vocabulary: [
    { term: 'last term', meaning: 'The final term of a finite AP, often written l.' },
    { term: 'finite AP', meaning: 'An AP with a stated number of terms, so it has both a first and a last term.' },
    { term: 'term from the end', meaning: 'A term counted backwards from the last one \u2014 the kth from the end sits at position (number of terms) \u2212 k + 1.' },
  ],
  explanation: [
    'The formula a\u2099 = a + (n \u2212 1)d links four quantities. Given any three, the fourth follows, so the same formula answers a family of questions rather than only "what is the nth term".',
    'If two terms are given, two equations result and both a and d can be found. Knowing a\u2087 = 26 and a\u2081\u2080 = 38 gives a + 6d = 26 and a + 9d = 38; subtracting removes a and leaves 3d = 12, so d = 4 and then a = 2.',
    'Subtracting is worth noticing. Two positions n and m give a difference of (n \u2212 m)d, so d can always be recovered from two known terms without finding a first \u2014 and that is often the quicker route.',
    'A finite AP has a last term as well as a first, written l. With a, d and the number of terms known, l is simply the term at the final position.',
    `For the AP ${T(AP_FINITE, 4)}, ... with ${AP_FINITE.length} terms, l = a\u2081\u2082 = ${AP_FINITE.a} + 11 \u00d7 ${AP_FINITE.d} = ${lastTerm(AP_FINITE)}.`,
    `Counting from the end is new here, and the arithmetic is a position calculation. The kth term from the end sits at position (number of terms) \u2212 k + 1: the 1st from the end is the last, at position ${AP_FINITE.length}, and the 3rd from the end is at position ${AP_FINITE.length! - 3 + 1}, giving ${termFromEnd(AP_FINITE, 3)}.`,
    'The +1 there has the same origin as the \u2212 1 in the main formula. The last term is the 1st from the end, not the 0th, so counting backwards also lags by one.',
  ],
  representations: ['A finite AP with positions numbered from both ends'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's53b.we1',
      prompt: 'In an AP the 7th term is 26 and the 10th term is 38. Find a and d.',
      steps: [
        { text: 'Write both as equations: a + 6d = 26 and a + 9d = 38.', reasoning: 'Each uses n \u2212 1 as the multiplier, so the 7th term carries 6d and the 10th carries 9d.' },
        { text: 'Subtract the first from the second: 3d = 12.', reasoning: 'Subtracting eliminates a, and the 3 is the gap between the positions 10 and 7 \u2014 not an accident.' },
        { text: 'So d = 4, and substituting into a + 6(4) = 26 gives a = 2.', reasoning: 'Either original equation serves; using one and checking in the other confirms both values.' },
        { text: 'Check: a\u2081\u2080 = 2 + 9 \u00d7 4 = 38.', reasoning: 'Verifying in the equation NOT used to find a catches a slip in either step.' },
      ],
      answer: 'a = 2 and d = 4.',
    },
    {
      id: 's53b.we2',
      prompt: `The AP ${T(AP_FINITE, 4)}, ... has ${AP_FINITE.length} terms. Find its last term and its 3rd term from the end.`,
      steps: [
        { text: `a = ${AP_FINITE.a}, d = ${AP_FINITE.d}, and there are ${AP_FINITE.length} terms.`, reasoning: 'A finite AP needs its length stated; without it there is no last term to find.' },
        { text: `The last term is at position ${AP_FINITE.length}: l = ${AP_FINITE.a} + 11 \u00d7 ${AP_FINITE.d} = ${lastTerm(AP_FINITE)}.`, reasoning: 'The multiplier is 11, one less than 12, by the same rule as always.' },
        { text: `The 3rd term from the end sits at position ${AP_FINITE.length} \u2212 3 + 1 = ${AP_FINITE.length! - 3 + 1}.`, reasoning: 'The last term is the 1st from the end, so the +1 keeps the count from slipping by one.' },
        { text: `That term is ${AP_FINITE.a} + ${AP_FINITE.length! - 3} \u00d7 ${AP_FINITE.d} = ${termFromEnd(AP_FINITE, 3)}.`, reasoning: `Position ${AP_FINITE.length! - 3 + 1} takes ${AP_FINITE.length! - 3} steps, and the result sits two places before the last term, as it should.` },
      ],
      answer: `l = ${lastTerm(AP_FINITE)}, and the 3rd from the end is ${termFromEnd(AP_FINITE, 3)}.`,
    },
    {
      id: 's53b.we3',
      prompt: 'An AP starts at 4 with d = 6. Which term is 100, and is 101?',
      steps: [
        { text: 'Set 100 = 4 + (n \u2212 1) \u00d7 6, so 6(n \u2212 1) = 96 and n \u2212 1 = 16.', reasoning: 'Solving for n answers "which term", and the unknown found is a position.' },
        { text: 'n = 17, a whole number at least 1, so 100 is the 17th term.', reasoning: 'Both membership conditions hold, so the value genuinely occurs in the progression.' },
        { text: 'For 101: 6(n \u2212 1) = 97, so n \u2212 1 = 97/6.', reasoning: '97 is not divisible by 6, so no whole number of steps lands on 101.' },
        { text: 'n is not a whole number, so 101 is not a term.', reasoning: 'It falls between the 17th term 100 and the 18th term 106, and nothing in the progression sits there.' },
      ],
      answer: '100 is the 17th term; 101 is not a term.',
    },
  ],
  guidedPractice: [
    { id: 's53b.g1', prompt: 'The 4th term of an AP is 11 and the 9th is 26. Find d.', hint: 'Subtract the two equations.', answer: 'd = 3.', rationale: 'The positions differ by 5, so 5d = 26 \u2212 11 = 15 and d = 3. The first term is not needed to find d.' },
    { id: 's53b.g2', prompt: `An AP has ${AP_SEATS.length} terms with a = ${AP_SEATS.a} and d = ${AP_SEATS.d}. What is its last term?`, hint: 'Which position is last?', answer: `${lastTerm(AP_SEATS)}.`, rationale: `The last position is ${AP_SEATS.length}, so l = ${AP_SEATS.a} + 19 \u00d7 ${AP_SEATS.d} = ${lastTerm(AP_SEATS)}.` },
    { id: 's53b.g3', prompt: 'In a 30-term AP, which position is the 5th term from the end?', hint: 'The last is the 1st from the end.', answer: 'Position 26.', rationale: '30 \u2212 5 + 1 = 26. Without the +1 you would get 25, which is the 6th from the end.' },
  ],
  independentPractice: [
    { id: 's53b.i1', prompt: 'The 3rd term of an AP is 5 and the 8th is 20. Find a and d.', answer: 'a = \u22121 and d = 3.', rationale: '5d = 15 gives d = 3, then a + 2(3) = 5 gives a = \u22121. Checking: a\u2088 = \u22121 + 21 = 20.' },
    { id: 's53b.i2', prompt: `For the AP with a = ${AP_FINITE.a}, d = ${AP_FINITE.d} and ${AP_FINITE.length} terms, find the 2nd term from the end.`, answer: `${termFromEnd(AP_FINITE, 2)}.`, rationale: `Position ${AP_FINITE.length} \u2212 2 + 1 = ${AP_FINITE.length! - 1}, so the term is ${AP_FINITE.a} + ${AP_FINITE.length! - 2} \u00d7 ${AP_FINITE.d} = ${termFromEnd(AP_FINITE, 2)}.` },
    { id: 's53b.i3', prompt: 'Why can d be found from two terms without knowing a?', answer: 'Because subtracting the two equations eliminates a.', rationale: 'Two positions n and m give a difference of (n \u2212 m)d, so d follows from the gap in values divided by the gap in positions.' },
    { id: 's53b.i4', prompt: 'A student says the 1st term from the end is at position (number of terms) \u2212 1. What is wrong?', answer: 'The 1st from the end IS the last term, at the final position.', rationale: 'Counting backwards starts at 1, not 0, so the formula is length \u2212 k + 1 and gives the final position when k = 1.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's53b.td1',
      prompt: 'Why does subtracting two term equations give the common difference directly, and what does the resulting number mean?',
      expectedReasoning:
        'Both equations contain a once, so subtracting removes it and leaves only the d terms. What remains is (n \u2212 m)d, where n \u2212 m is the gap between the two positions \u2014 so the difference in VALUES equals the gap in POSITIONS times d. Dividing gives d as the change per single step. It also explains why the method needs two terms and not one: a single term cannot separate the contribution of a from the contribution of d.',
    },
    {
      id: 's53b.td2',
      prompt: 'Counting from the end uses length \u2212 k + 1. Where does the +1 come from, and what does it have in common with the \u2212 1 in a + (n \u2212 1)d?',
      expectedReasoning:
        'Both come from counting starting at 1 rather than 0. Going forwards, the first term has taken no steps, so position n carries n \u2212 1 of them. Going backwards, the last term is the 1st from the end rather than the 0th, so the kth from the end is k \u2212 1 places before the last \u2014 which puts it at length \u2212 (k \u2212 1), that is length \u2212 k + 1. The same off-by-one risk appears in both directions, and the same fix: check the k = 1 case and confirm it gives the last term.',
    },
  ],
  summary:
    `The nth-term formula links a, d, n and a\u2099: given any three, the fourth follows. Two known terms give two equations, and SUBTRACTING them removes a and leaves (gap in positions) \u00d7 d. A finite AP also has a last term l, and the kth term from the end sits at position length \u2212 k + 1 \u2014 the +1 because the last term is the 1st from the end, the same counting-from-one that puts n \u2212 1 in the main formula.`,
  nextStep: 'Next you will add up the terms rather than find them one at a time.',
  teacher: teacher(
    'Students solve for a missing a, d or n, and handle terms counted from the end of a finite AP.',
    ['The nth-term formula', 'Simultaneous equations'],
    ['Subtract \u2014 what disappears?', 'Is the 1st from the end the last, or the one before it?', 'Whole number position, or no term at all?'],
    [
      'The subtraction route is worth naming as a method, not just a step: students who always solve for a first do more work and make more errors.',
      'Counting from the end is the genuinely new procedure in this chapter; the k = 1 check is the analogue of the n = 1 check and deserves the same emphasis.',
      'Membership still requires a whole-number position; the 101 example keeps that live.',
    ],
    ['Ask which position the 5th from the end is in a 30-term AP.', 'Ask why two terms are needed to find d.'],
    ['Have the student write both term equations in full before subtracting anything.'],
    ['Ask what happens when the two given terms are adjacent.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_5_4A: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s5_4_sum_derivation_lesson',
  contentArtifactVersion: 1,
  source: source('5.4', 'Sum of First n Terms of an AP', 63, 'ncert_jemh1_s5_4'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s5_3'],
    mayAssume: ['The nth-term formula', 'The pairing sum derived in Class IX', 'Expanding and simplifying'],
    mustNotIntroduce: [{ concept: 'Contextual totals', belongsToSection: 'ncert_jemh1_s5_4b' }],
  },
  learningGoal:
    'You will derive the sum of the first n terms of an AP by reversing and adding, in both the n/2[2a + (n \u2212 1)d] and n/2(a + l) forms, and choose between them.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write the nth term as a + (n \u2212 1)d.', 'Write the last term of a finite AP.', 'Simplify an expression such as n(2a + (n \u2212 1)d)/2.'],
    ifNotReady: 'Revise the nth-term lesson. The sum is built from the terms, so the term formula must be secure first.',
  },
  vocabulary: [
    { term: 'sum of first n terms', meaning: 'The total S\u2099 = a\u2081 + a\u2082 + ... + a\u2099.' },
    { term: 'reversing and adding', meaning: 'Writing the sum forwards and backwards and adding the two rows term by term.' },
  ],
  explanation: [
    'In Class IX you derived the sum of the first n natural numbers by pairing from the two ends, and extended that method to an AP. Class 10 formalises the same idea into a formula you can apply directly, and gives it a second form.',
    'Write the sum forwards: S\u2099 = a + (a + d) + (a + 2d) + ... + l, where l is the last term.',
    'Write it backwards underneath: S\u2099 = l + (l \u2212 d) + (l \u2212 2d) + ... + a. It is the same total, added in the opposite order.',
    'Now add the two rows COLUMN by column. The first column gives a + l. The second gives (a + d) + (l \u2212 d) = a + l \u2014 the d\u2019s cancel. The third gives (a + 2d) + (l \u2212 2d) = a + l, and so on: every column gives the same total a + l, because whatever one row gains the other loses.',
    'There are n columns, so 2S\u2099 = n(a + l), giving S\u2099 = n/2 (a + l).',
    'Note what the derivation actually does. It adds two rows of n terms, so it does not require the terms to be physically paired off two at a time, and it works just as well when n is odd. The cancellation is between the two ROWS, not between terms within one row.',
    'The second form comes from substituting l = a + (n \u2212 1)d: S\u2099 = n/2 (a + a + (n \u2212 1)d) = n/2 [2a + (n \u2212 1)d]. The two forms are the same statement, so they always agree.',
    `Which to use depends on what is known. With a, d and n, use n/2 [2a + (n \u2212 1)d]. With a, l and n \u2014 a finite AP whose last term is given \u2014 n/2 (a + l) is shorter. For the AP ${T(AP_FINITE, 4)}, ... with ${AP_FINITE.length} terms, the first form gives ${S(AP_FINITE, AP_FINITE.length!)} and the second gives ${formatRational(sumWithLast(AP_FINITE.a, lastTerm(AP_FINITE)!, AP_FINITE.length!))} \u2014 the same number, as they must.`,
  ],
  representations: ['The sum written forwards and backwards with the columns added'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's54a.we1',
      prompt: 'Derive S\u2099 = n/2 (a + l) by reversing and adding.',
      steps: [
        { text: 'Write S\u2099 = a + (a + d) + (a + 2d) + ... + l.', reasoning: 'Each term is the previous one plus d, so the row runs from the first term up to the last.' },
        { text: 'Write the same sum backwards: S\u2099 = l + (l \u2212 d) + (l \u2212 2d) + ... + a.', reasoning: 'Reordering an addition does not change its total, so this row equals the first.' },
        { text: 'Add the rows column by column: a + l, then (a + d) + (l \u2212 d) = a + l, then (a + 2d) + (l \u2212 2d) = a + l.', reasoning: 'Each column has one row gaining exactly what the other loses, so every column collapses to the same total.' },
        { text: 'There are n columns, so 2S\u2099 = n(a + l).', reasoning: 'The left side is two copies of the sum, because both rows were the same total.' },
        { text: 'Divide by 2: S\u2099 = n/2 (a + l).', reasoning: 'The halving undoes the doubling introduced by writing the sum twice.' },
      ],
      answer: 'S\u2099 = n/2 (a + l).',
    },
    {
      id: 's54a.we2',
      prompt: 'Turn that into the form using a, d and n.',
      steps: [
        { text: 'The last term of the first n terms is l = a + (n \u2212 1)d.', reasoning: 'The last of the first n terms sits at position n, so the nth-term formula gives it directly.' },
        { text: 'Substitute: S\u2099 = n/2 (a + a + (n \u2212 1)d).', reasoning: 'Replacing l removes the need to know the last term separately.' },
        { text: 'So S\u2099 = n/2 [2a + (n \u2212 1)d].', reasoning: 'The two a\u2019s combine, leaving a formula in a, d and n only.' },
        { text: 'The (n \u2212 1) here is the same one as in the term formula.', reasoning: 'It arrived by substitution rather than independently, so an error in the term formula would propagate straight into the sum.' },
      ],
      answer: 'S\u2099 = n/2 [2a + (n \u2212 1)d].',
    },
    {
      id: 's54a.we3',
      prompt: `Find the sum of the first 10 terms of the AP ${T(AP_UP, 4)}, ... and check by adding directly.`,
      steps: [
        { text: `a = ${AP_UP.a}, d = ${AP_UP.d}, n = 10.`, reasoning: 'All three are known and no last term is given, so the 2a form is the natural choice.' },
        { text: `S\u2081\u2080 = 10/2 [2(${AP_UP.a}) + 9 \u00d7 ${AP_UP.d}] = 5[${2 * AP_UP.a} + ${9 * AP_UP.d}] = 5 \u00d7 ${2 * AP_UP.a + 9 * AP_UP.d}.`, reasoning: 'The multiplier is 9, being n \u2212 1, exactly as in the term formula.' },
        { text: `So S\u2081\u2080 = ${S(AP_UP, 10)}.`, reasoning: 'A single arithmetic result, which can now be tested against a method that uses no formula at all.' },
        { text: `Adding the ten terms ${T(AP_UP, 10)} directly gives ${directSum(AP_UP, 10)}.`, reasoning: 'Direct addition is independent of the derivation, so agreement is real evidence rather than a restatement.' },
      ],
      answer: `S\u2081\u2080 = ${S(AP_UP, 10)}, confirmed by direct addition.`,
    },
  ],
  guidedPractice: [
    { id: 's54a.g1', prompt: `Find the sum of the first 12 terms of the AP with a = ${AP_FINITE.a} and d = ${AP_FINITE.d}.`, hint: 'Use the 2a form.', answer: `${S(AP_FINITE, 12)}.`, rationale: `12/2 [14 + 11 \u00d7 4] = 6 \u00d7 58 = ${S(AP_FINITE, 12)}. Direct addition of the twelve terms gives the same total.` },
    { id: 's54a.g2', prompt: 'An AP has 20 terms, first term 3 and last term 60. Find the sum.', hint: 'Which form uses l?', answer: '630.', rationale: '20/2 (3 + 60) = 10 \u00d7 63 = 630. The a + l form is shorter here because d was never needed.' },
    { id: 's54a.g3', prompt: 'Why does the derivation work when n is odd?', hint: 'What is being added \u2014 terms, or rows?', answer: 'Because two rows are added, not terms paired within one row.', rationale: 'Every column gets one entry from each row regardless of whether n is odd or even, so all n columns give a + l either way.' },
  ],
  independentPractice: [
    { id: 's54a.i1', prompt: `Find the sum of the first 15 terms of the AP with a = ${AP_DOWN.a} and d = ${AP_DOWN.d}.`, answer: `${S(AP_DOWN, 15)}.`, rationale: `15/2 [20 + 14 \u00d7 (\u22123)] = 15/2 \u00d7 (\u221222) = ${S(AP_DOWN, 15)}. A negative total is expected once the terms go below zero.` },
    { id: 's54a.i2', prompt: 'Show that the two sum forms agree for a = 2, d = 5, n = 6.', answer: 'Both give 87.', rationale: 'l = 2 + 25 = 27, so n/2(a + l) = 3(29) = 87, and n/2[2a + 5d] = 3[4 + 25] = 87.' },
    { id: 's54a.i3', prompt: 'When is n/2 (a + l) the better form to use?', answer: 'When the last term is given but d is not.', rationale: 'It avoids finding d first. With a, d and n known instead, the 2a form avoids finding l.' },
    { id: 's54a.i4', prompt: 'In the column-addition step, why does every column give the same total?', answer: 'Because one row gains a d wherever the other loses one.', rationale: 'Moving one place right adds d in the forward row and subtracts d in the reversed row, so the column total is unchanged at a + l.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's54a.td1',
      prompt: 'The derivation is often described as "pairing". Why is it more accurate to say two rows are added, and why does that matter?',
      expectedReasoning:
        'Because what is actually added is the forward row and the reversed row, column by column \u2014 the sum is written twice and the two copies combined. Describing it as pairing terms within a single list suggests the terms must come in twos, which would raise a question about odd n and about a middle term with no partner. No such question arises: with two rows there are always exactly n columns and every column has one entry from each row, whatever n is. The halving at the end is what removes the second copy.',
    },
    {
      id: 's54a.td2',
      prompt: 'The two sum formulas look different. Why can they never disagree?',
      expectedReasoning:
        'Because the second is obtained from the first by substituting l = a + (n \u2212 1)d, which is an identity for an AP rather than a new assumption. So they are the same expression written with different quantities visible, and any numerical disagreement would mean an arithmetic slip rather than a real difference. Which one to use is purely a question of what is known: a, d and n point to the 2a form, and a, l and n to the a + l form.',
    },
  ],
  summary:
    `Writing S\u2099 forwards and backwards and adding COLUMN by column makes every column total a + l, because one row gains each d the other loses. With n columns, 2S\u2099 = n(a + l), so S\u2099 = n/2 (a + l). Substituting l = a + (n \u2212 1)d gives S\u2099 = n/2 [2a + (n \u2212 1)d]. Two rows are added, not terms paired inside one, so odd n needs no special treatment. The forms are the same statement \u2014 choose by what is known.`,
  nextStep: 'Next you will decide, from a situation, whether it asks for one term or for a total.',
  teacher: teacher(
    'Students derive both sum forms by reversing and adding, and choose between them by what is known.',
    ['The nth-term formula', 'The Class IX pairing sum'],
    ['Add the two rows, column by column.', 'What cancels, and why?', 'Do you know l, or do you know d?'],
    [
      'Students derived the pairing sum in Class IX, so the derivation is a reminder with a formula attached rather than a first encounter.',
      'Insist on "two rows" over "pairing". The odd-n worry comes entirely from the pairing picture and disappears with the row picture.',
      'The direct-addition check in the third example is worth doing in full; it is the only step that is independent of the derivation.',
    ],
    ['Ask why odd n causes no trouble.', 'Ask which form to use when l is given.'],
    ['Have the student write out both rows and the first three column totals before generalising.'],
    ['Ask what the column total a + l equals when n = 1.'],
  ),
  reviewStatus: 'authored_draft',
};

export const C10_SECTION_5_4B: AuthoredSection = {
  contentArtifactId: 'ncert_jemh1_s5_4_applications_lesson',
  contentArtifactVersion: 1,
  source: source('5.4', 'Sum of First n Terms of an AP', 63, 'ncert_jemh1_s5_4'),
  competencyCandidates: [], competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_jemh1_s5_4'],
    mayAssume: ['The nth-term formula', 'Both sum formulas'],
    mustNotIntroduce: [{ concept: 'Geometric progressions', belongsToSection: 'outside_this_chapter' }],
  },
  learningGoal:
    'You will model a situation as an AP and decide whether it asks for a single term or for a cumulative total.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find a\u2099 for given a, d and n.', 'Find S\u2099 for given a, d and n.', 'Say what the terms of an AP are counting in a situation.'],
    ifNotReady: 'Revise the two previous lessons. The modelling here is the new part; the formulas are not.',
  },
  vocabulary: [
    { term: 'cumulative total', meaning: 'The running total of all terms up to a position \u2014 what S\u2099 gives.' },
    { term: 'model', meaning: 'To describe a situation by a mathematical object, here by a first term and a common difference.' },
  ],
  explanation: [
    'A situation becomes an AP when some quantity changes by the same amount each step. The work is in three parts: find a, find d, and decide what is being asked.',
    'That last part is where most errors live, and it has only two answers. A question about ONE step wants a term. A question about everything up to a step wants a sum.',
    `Take ${AP_SEATS.meaning}: the front row has ${AP_SEATS.a} seats and each row behind has ${AP_SEATS.d} more, for ${AP_SEATS.length} rows. "How many seats in the 20th row?" is a term: a\u2082\u2080 = ${AP_SEATS.a} + 19 \u00d7 ${AP_SEATS.d} = ${term(AP_SEATS, 20)}.`,
    `"How many seats in the first 20 rows altogether?" is the same AP and the same numbers, but a sum: S\u2082\u2080 = ${S(AP_SEATS, 20)}. The two answers are not close to each other, and nothing in the arithmetic warns you if the wrong one was chosen \u2014 only the words of the question do.`,
    'A useful test: does the answer describe a single row, month or stage, or does it describe all of them together? "In the nth" is a term; "in the first n" or "in total" is a sum.',
    `Decreasing situations work the same way, with d negative. Saving ${AP_SAVINGS.a} rupees in the first month and ${Math.abs(AP_SAVINGS.d)} less each month gives d = ${AP_SAVINGS.d}: the ${AP_SAVINGS.length}th month\u2019s saving is ${term(AP_SAVINGS, AP_SAVINGS.length!)} and the ${AP_SAVINGS.length}-month total is ${S(AP_SAVINGS, AP_SAVINGS.length!)}.`,
    'Check that the answer makes sense in the situation. A count of seats cannot be negative or fractional, and a decreasing quantity may stop being meaningful before the sequence does \u2014 the mathematics will happily continue past the point where the situation does not.',
    'Finally, keep the finite part separate from the rule. A progression may be written with dots to show the rule continues, while the question asks about only a stated number of terms. The dots describe the pattern; the question sets the range.',
  ],
  representations: ['A situation table pairing each position with its term and its running total'],
  visuals: [], visualsById: {},
  workedExamples: [
    {
      id: 's54b.we1',
      prompt: `A hall has ${AP_SEATS.length} rows. The first row has ${AP_SEATS.a} seats and each later row has ${AP_SEATS.d} more. How many seats are in the 20th row?`,
      steps: [
        { text: `a = ${AP_SEATS.a} and d = ${AP_SEATS.d}, with the terms counting ${AP_SEATS.meaning}.`, reasoning: 'Naming what the terms count keeps the answer interpretable at the end.' },
        { text: 'The question asks about ONE row, so this is a term.', reasoning: 'It names a single position rather than a range, so no adding is involved.' },
        { text: `a\u2082\u2080 = ${AP_SEATS.a} + 19 \u00d7 ${AP_SEATS.d} = ${term(AP_SEATS, 20)}.`, reasoning: 'The multiplier is 19 because nineteen rows separate the first from the twentieth.' },
        { text: `So the 20th row has ${term(AP_SEATS, 20)} seats.`, reasoning: 'A whole positive number, which is what a seat count has to be.' },
      ],
      answer: `${term(AP_SEATS, 20)} seats.`,
    },
    {
      id: 's54b.we2',
      prompt: 'For the same hall, how many seats are there altogether?',
      steps: [
        { text: 'The same AP, but the question now covers all the rows together.', reasoning: 'Nothing about a or d changes; only the quantity being asked for does.' },
        { text: `So this is a sum: S\u2082\u2080 = 20/2 [2(${AP_SEATS.a}) + 19 \u00d7 ${AP_SEATS.d}].`, reasoning: 'The 2a form fits because a, d and n are known and the last term was not given.' },
        { text: `= 10[${2 * AP_SEATS.a} + ${19 * AP_SEATS.d}] = 10 \u00d7 ${2 * AP_SEATS.a + 19 * AP_SEATS.d} = ${S(AP_SEATS, 20)}.`, reasoning: 'Arithmetic in the same pattern as the derivation, with n \u2212 1 = 19 again.' },
        { text: `The hall has ${S(AP_SEATS, 20)} seats, against ${term(AP_SEATS, 20)} in the last row alone.`, reasoning: 'Setting the two answers side by side shows that choosing the wrong object is not a small error.' },
      ],
      answer: `${S(AP_SEATS, 20)} seats in total.`,
    },
    {
      id: 's54b.we3',
      prompt: `Someone saves ${AP_SAVINGS.a} rupees in the first month and ${Math.abs(AP_SAVINGS.d)} rupees less each month after. How much is saved in the ${AP_SAVINGS.length}th month, and how much over the ${AP_SAVINGS.length} months?`,
      steps: [
        { text: `a = ${AP_SAVINGS.a} and d = ${AP_SAVINGS.d}, negative because the amount falls each month.`, reasoning: 'Less each month means the later term is smaller, so later minus earlier is negative.' },
        { text: `The ${AP_SAVINGS.length}th month is a term: a\u2081\u2082 = ${AP_SAVINGS.a} + 11 \u00d7 (${AP_SAVINGS.d}) = ${term(AP_SAVINGS, 12)}.`, reasoning: 'One month named, so one term \u2014 and the result is still positive, so the saving is meaningful.' },
        { text: `The total is a sum: S\u2081\u2082 = 12/2 [2(${AP_SAVINGS.a}) + 11 \u00d7 (${AP_SAVINGS.d})] = 6 \u00d7 ${2 * AP_SAVINGS.a + 11 * AP_SAVINGS.d} = ${S(AP_SAVINGS, 12)}.`, reasoning: 'Over the whole period, so every month\u2019s saving is added.' },
        { text: `Both make sense: the monthly amount stays positive across all ${AP_SAVINGS.length} months.`, reasoning: 'Had a term gone negative, the model would have stopped describing a saving before the AP stopped.' },
      ],
      answer: `${term(AP_SAVINGS, 12)} rupees in the ${AP_SAVINGS.length}th month; ${S(AP_SAVINGS, 12)} rupees in total.`,
    },
  ],
  guidedPractice: [
    { id: 's54b.g1', prompt: 'A worker is paid 200 in week 1 and 25 more each week. What is the pay in week 10?', hint: 'One week, or all of them?', answer: '425.', rationale: '200 + 9 \u00d7 25 = 425. One week is named, so this is a term.' },
    { id: 's54b.g2', prompt: 'For the same worker, what is the total pay over 10 weeks?', hint: 'Which object does "total" ask for?', answer: '3125.', rationale: '10/2 [400 + 9 \u00d7 25] = 5 \u00d7 625 = 3125. The same AP, but the question covers every week.' },
    { id: 's54b.g3', prompt: 'How can you tell a term question from a sum question?', hint: 'Look at the words, not the numbers.', answer: 'A term names one stage; a sum covers a range.', rationale: '"In the nth" is a term, while "in the first n" or "altogether" is a sum. The numbers in the question look identical either way.' },
  ],
  independentPractice: [
    { id: 's54b.i1', prompt: `In the hall above, how many seats are in the first 5 rows?`, answer: `${S(AP_SEATS, 5)}.`, rationale: `5/2 [36 + 4 \u00d7 2] = 5/2 \u00d7 44 = ${S(AP_SEATS, 5)}, a sum because a range of rows is covered.` },
    { id: 's54b.i2', prompt: 'A pile has 30 logs in the bottom row and 2 fewer in each row above. How many in the 8th row?', answer: '16.', rationale: '30 + 7 \u00d7 (\u22122) = 16. One row named, so a term, and d is negative because the rows shrink upward.' },
    { id: 's54b.i3', prompt: 'A student computes S\u2082\u2080 when asked for the seats in the 20th row. Why is this not a small error?', answer: 'It answers a different question entirely.', rationale: `The row holds ${term(AP_SEATS, 20)} seats while the hall holds ${S(AP_SEATS, 20)}. One is a stage, the other everything up to it.` },
    { id: 's54b.i4', prompt: 'A decreasing AP models a saving. Why check whether the terms stay positive?', answer: 'Because a negative saving does not describe the situation.', rationale: 'The sequence continues past where the situation stops making sense, so the range of positions worth using has to be checked against the context.' },
  ],
  misconceptionIds: [], interactivePractice: [],
  reasoningApplication: [
    {
      id: 's54b.td1',
      prompt: 'Two questions use the same AP, the same a, d and n \u2014 yet one needs a\u2099 and the other S\u2099. What in the wording decides it, and why can the arithmetic not warn you?',
      expectedReasoning:
        'The decision comes from whether the question is about one stage or about a range of them. "How many seats in the 20th row" isolates a single position; "how many in the first 20 rows" accumulates all of them. The arithmetic cannot help because both calculations run perfectly on the same inputs and both produce a plausible positive number \u2014 for the hall, 56 against 740. Nothing is undefined, nothing overflows, no step fails. Only re-reading the question catches it, which is why identifying what is being asked belongs before any substitution.',
    },
    {
      id: 's54b.td2',
      prompt: 'A progression written with dots continues indefinitely, yet an application uses only a few terms. How should each be described?',
      expectedReasoning:
        'The dots describe the RULE \u2014 the constant difference goes on being true however far the list is extended. The application supplies a RANGE, usually from the situation: twenty rows, twelve months. These are different claims and should not be merged. Saying a hall has infinitely many rows because the AP continues confuses a pattern with a physical limit; conversely, saying the rule stops at row 20 misdescribes the mathematics. The rule is endless, the question is finite, and the sum applies only to the stated number of terms.',
    },
  ],
  summary:
    `Model a situation by finding a and d, then decide WHICH object the question asks for: one stage is a term, a range of stages is a sum. For the ${AP_SEATS.length}-row hall the 20th row holds ${term(AP_SEATS, 20)} seats while the first 20 rows hold ${S(AP_SEATS, 20)} \u2014 same AP, same numbers, different question. Decreasing situations give negative d, and the terms should be checked against the situation, since the sequence continues past where the context stops making sense.`,
  nextStep: 'The chapter summary recapitulates the AP definition, the nth term and both sum formulas.',
  teacher: teacher(
    'Students model contexts as APs and distinguish a single term from a cumulative total.',
    ['The nth-term formula', 'Both sum formulas'],
    ['One stage, or all of them?', 'What do the terms count?', 'Does the answer make sense here?'],
    [
      'The seats contrast is the centre of this lesson. Running both questions on identical numbers is what makes the distinction concrete.',
      'Ask students to name what the terms count before any calculation; it makes the final interpretation almost automatic.',
      'Include a decreasing context so students do not come to believe an AP always grows.',
    ],
    ['Ask whether "in the first 10 weeks" is a term or a sum.', 'Ask what the terms count in a given problem.'],
    ['Have the student underline the words that set the range before choosing a formula.'],
    ['Ask at which month a decreasing saving would stop being meaningful.'],
  ),
  reviewStatus: 'authored_draft',
};

export const CLASS10_AP_SECTIONS: AuthoredSection[] = [
  C10_SECTION_5_2A, C10_SECTION_5_3A, C10_SECTION_5_3B, C10_SECTION_5_4A, C10_SECTION_5_4B,
];
