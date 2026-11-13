// ===========================================================================
// v0.84.0 checkpoint 40 — CLASS 9 CHAPTER 11: ALGORITHMS.
//
// Not an architecture pilot. The risk is the one checkpoint 39 met in a
// different costume: a lesson can count correctly on one input and conclude
// something the evidence does not support. "Method A took fewer steps, so
// it is faster" is arithmetically perfect and mathematically unjustified.
//
// So every comparison in this chapter names its input and its counting
// rule, and the chapter's own counterexample — a pair where the subtraction
// method takes 35 steps and the division method 2 — is the thing that makes
// the general claim defensible rather than assumed.
//
// No Big-O, no asymptotics, no pseudocode. The source counts steps
// informally and so does Pragati.
//
// One split (§11.3). All numbers are Pragati's own.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

export const ALGORITHMS_CHAPTER_ID = 'ncert_iemh2_ch11';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part II)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh2dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: ALGORITHMS_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

export const SECTION_11_1: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s11_1_lesson',
  contentArtifactVersion: 1,
  source: source('11.1', 'Adding Numbers', 1, 'ncert_iemh2_s11_1'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Column addition', 'Place value', 'Counting'],
    mustNotIntroduce: [{ concept: 'Finding the gcd from divisor lists', belongsToSection: 'ncert_iemh2_s11_2' }, { concept: 'Improving an algorithm', belongsToSection: 'ncert_iemh2_s11_3' }],
  },
  learningGoal:
    'You will write column addition as a precise procedure, and compare its effort with counting under a stated measure of work.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Add two numbers by columns with carrying.', 'Say what place value means.', 'Count a collection of objects.'],
    ifNotReady: 'No special preparation; you have been using the procedure for years without writing it down.',
  },
  vocabulary: [
    { term: 'algorithm', meaning: 'A precise procedure: what it takes in, what it repeats, when it stops, what it gives out.' },
    { term: 'cost measure', meaning: 'What is being counted when two procedures are compared.' },
    { term: 'trace', meaning: 'One run of a procedure on a particular input.' },
  ],
  explanation: [
    'There are two ways to find 3847 + 2156. You could lay out 3847 dots and 2156 dots and count the lot. Or you could add in columns, right to left, carrying where a column passes nine.',
    'Both give 6003. Both are correct. But one takes four column additions and the other takes six thousand and three counts, and that difference is what this chapter is about: a method is a mathematical object in its own right, and can be judged separately from the answer it produces.',
    'Write the column method out precisely and it becomes an algorithm. Input: two whole numbers. Repeat: add the digits in the current column, together with any carry; write the units digit; carry the tens. Stop: when no columns and no carry remain. Output: the digits written, read as a number.',
    'Each of those four parts matters. Without a stated input the procedure does not know what it applies to; without a stopping condition it is not a procedure at all, just an instruction to keep going. "Keep adding until you are done" is not an algorithm.',
    'Now the comparison, carefully. Counting dots takes about as many steps as the size of the number. Column addition takes about as many steps as the number of digits. Adding two four-digit numbers takes four column steps; adding two eight-digit numbers takes eight. The counting method would take tens of millions.',
    'Say precisely what has been compared, because that discipline is the whole chapter. Under the rule "one step is one column addition or one count", column addition takes four steps for this input and counting takes 6003. That is a statement about these numbers and this counting rule — and it is the honest form of the claim.',
  ],
  representations: ['The four parts of an algorithm named on the column method', 'Step counts for the two methods on the same input, with the rule stated'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's111.we1',
      prompt: 'Write column addition as an algorithm with its four parts named.',
      steps: [
        { text: 'Input: two whole numbers, written one above the other with places aligned.', reasoning: 'Naming the input says what the procedure applies to; aligned places are what make column-wise work meaningful.' },
        { text: 'Repeat: add the digits in the current column plus any carry, write the units digit, carry the tens.', reasoning: 'The repeated action is the body of the procedure, and it is the same every column.' },
        { text: 'Stop: when there are no columns left and no carry outstanding.', reasoning: 'A stopping condition is what makes this a procedure rather than an open instruction.' },
        { text: 'Output: the digits written, read right to left as the sum.', reasoning: 'Naming the output says where the answer is to be found.' },
      ],
      answer: 'Input, repeated action, stopping condition, output — all four stated.',
    },
    {
      id: 's111.we2',
      prompt: 'For 3847 + 2156, how many steps does each method take under the rule that one step is one column addition or one count?',
      steps: [
        { text: 'Column addition works through four columns: units, tens, hundreds, thousands.', reasoning: 'Each column is one step under the stated rule.' },
        { text: 'Counting dots would require counting all 6003 of them one at a time.', reasoning: 'Each dot is one step under the same rule, which is what makes the comparison fair.' },
        { text: 'So on this input, under this counting rule, the methods take 4 steps and 6003 steps.', reasoning: 'Both the input and the rule are named, because the counts mean nothing without them.' },
        { text: 'Both methods give 6003, so the difference is in effort, not in correctness.', reasoning: 'Correctness and cost are separate properties and are being judged separately.' },
      ],
      answer: 'On this input, under this counting rule: 4 steps against 6003.',
    },
    {
      id: 's111.we3',
      prompt: 'Two eight-digit numbers are added. What happens to each method’s step count?',
      steps: [
        { text: 'Column addition works through eight columns, so it takes 8 steps.', reasoning: 'Its cost follows the number of digits, which has doubled.' },
        { text: 'Counting follows the size of the sum, which is now in the tens of millions.', reasoning: 'Its cost follows the value, which has grown enormously.' },
        { text: 'Doubling the digits doubles one cost and multiplies the other ten-thousandfold.', reasoning: 'The two methods respond to a bigger input in completely different ways.' },
      ],
      answer: 'Column addition goes from 4 steps to 8; counting goes from thousands to tens of millions.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's111.g1',
      prompt: 'What are the four parts of an algorithm?',
      hint: 'Think about what comes in, what repeats, when it ends, what comes out.',
      answer: 'Input, repeated action, stopping condition, output.',
      rationale: 'All four are needed for a precise procedure.',
    },
    {
      id: 's111.g2',
      prompt: 'Is "keep adding until you are done" an algorithm?',
      hint: 'Does it say when to stop?',
      answer: 'No.',
      rationale: 'It has no stopping condition that can be checked.',
    },
    {
      id: 's111.g3',
      prompt: 'Adding two six-digit numbers by columns. How many column steps?',
      hint: 'One per column.',
      answer: 'Six.',
      rationale: 'The cost follows the number of digits.',
    },
  ],
  independentPractice: [
    {
      id: 's111.i1',
      prompt: 'Write the stopping condition for column addition in one sentence.',
      answer: 'When no columns and no carry remain.',
      rationale: 'It must be checkable at each stage.',
    },
    {
      id: 's111.i2',
      prompt: 'Under the rule that one step is one column addition, how many steps for 5291 + 3408?',
      answer: 'Four.',
      rationale: 'Four columns, whatever the digits happen to be.',
    },
    {
      id: 's111.i3',
      prompt: 'Explain why two methods giving the same answer can still differ.',
      answer: 'Because correctness and effort are separate properties of a method.',
      rationale: 'One is about the output, the other about the work.',
    },
  ],
  reasoningApplication: [
    {
      id: 's111.r1',
      prompt: 'Column addition and counting both give the right sum. Explain what is actually being compared when one is called better, and why the answer itself cannot settle it.',
      expectedReasoning:
        'What is compared is the work each takes under a stated measure, not the result, since the results are identical. The answer cannot settle it because both methods are correct, so any judgement between them must be about cost and must say what is being counted. A strong answer names correctness and cost as separate properties and insists the measure be stated.',
    },
  ],
  interactivePractice: [],
  summary:
    'An algorithm is a procedure with a named input, a repeated action, a stopping condition and an output. Two correct methods can differ enormously in work, and comparing them means naming what is being counted and on which input.',
  nextStep:
    'Next you will meet a problem with more than one method, and start judging between them.',
  teacher: {
    objective: 'Students write a familiar procedure as an algorithm and compare cost under a stated measure.',
    prerequisiteKnowledge: ['Column addition', 'Place value'],
    modelLanguage: ['What is the stopping condition?', 'Counting what, exactly?'],
    teachingNotes: [
      'The dots comparison is worth doing aloud: students have never considered that their own addition method is a choice.',
      'Insist on the counting rule being stated before any two numbers are compared. It is the habit the whole chapter needs.',
    ],
    quickChecks: ['Which of the four parts is missing?', 'Steps counted how?'],
    supportForStrugglingLearners: [
      'Write the four parts as four labelled lines before tracing anything.',
      'State the counting rule on its own line before comparing.',
    ],
    extension: ['Ask how many column steps adding three numbers at once would take.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_11_2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s11_2_lesson',
  contentArtifactVersion: 1,
  source: source('11.2', 'Greatest Common Divisor', 3, 'ncert_iemh2_s11_2'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s11_1'],
    mayAssume: ['Algorithms and their four parts', 'Divisors and divisibility', 'Comparing lists'],
    mustNotIntroduce: [{ concept: 'Improving an algorithm', belongsToSection: 'ncert_iemh2_s11_3' }, { concept: 'Euclid’s algorithm', belongsToSection: 'ncert_iemh2_s11_3' }],
  },
  learningGoal:
    'You will compute the gcd of two numbers by listing all divisors of each and taking the largest common entry, and state the cost of doing so.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Test whether one number divides another.', 'List the divisors of a small number.', 'Compare two lists for common entries.'],
    ifNotReady: 'Make sure you can find divisors by testing candidates; that is the inner procedure here.',
  },
  vocabulary: [
    { term: 'divisor', meaning: 'A number that divides another exactly, leaving no remainder.' },
    { term: 'greatest common divisor', meaning: 'The largest number dividing both of two numbers, written gcd.' },
    { term: 'list', meaning: 'An ordered collection the procedure builds and then works on.' },
  ],
  explanation: [
    'The greatest common divisor of two numbers is the largest number that divides both exactly. The most direct way to find it is to do exactly what the name says: list the divisors of each, find the ones in both lists, and take the largest.',
    'Finding one number’s divisors is itself a procedure. Input: a whole number n. Repeat: test each candidate from 1 up to n, keeping it if it divides n exactly. Stop: after testing n. Output: the list kept.',
    'For 84 that gives 1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84. For 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. The entries in both are 1, 2, 3, 4, 6 and 12, and the largest is 12. So gcd(84, 36) = 12.',
    'The whole gcd method is then two procedures joined: build a divisor list for each number, then compare. The lists are what the algorithm works on, and each one has to be complete — a missing divisor could be the answer.',
    'Now its cost, stated carefully. Under the rule that one step is one divisibility test, finding the divisors of 84 takes 84 tests and of 36 takes 36, so this method takes 120 tests for this pair before any comparing begins. That number depends on the size of the numbers, not on how complicated their divisors are.',
    'Notice one thing that will matter later: divisors come in pairs. Since 4 divides 84 and 84 ÷ 4 = 21, the divisor 4 arrives with 21 attached. Every divisor below the square root pairs with one above it, which is a hint that testing all the way to 84 is doing more work than necessary.',
  ],
  representations: ['Two divisor lists written out with their common entries marked', 'The candidate tests counted, one per number from 1 upward'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's112.we1',
      prompt: 'Find gcd(84, 36) by listing divisors.',
      steps: [
        { text: 'List the divisors of 84 by testing 1 to 84: 1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84.', reasoning: 'Every candidate is tested, so the list is complete; a missing entry could be the answer.' },
        { text: 'List the divisors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.', reasoning: 'The same procedure applied to the second number.' },
        { text: 'The entries in both lists are 1, 2, 3, 4, 6, 12.', reasoning: 'Comparing the two complete lists gives the common divisors.' },
        { text: 'The largest is 12, so gcd(84, 36) = 12.', reasoning: 'Checking: 84 = 12 times 7 and 36 = 12 times 3, so 12 divides both.' },
      ],
      answer: '12.',
    },
    {
      id: 's112.we2',
      prompt: 'How many divisibility tests did that take, under the rule that one step is one test?',
      steps: [
        { text: 'Finding the divisors of 84 tested every candidate from 1 to 84: 84 tests.', reasoning: 'The procedure tests all the way up, whatever the number turns out to divide into.' },
        { text: 'Finding the divisors of 36 took 36 tests.', reasoning: 'The same procedure on the smaller number.' },
        { text: 'So on this pair, under this counting rule, 120 tests were needed.', reasoning: 'Naming the pair and the rule is what makes the number mean anything.' },
        { text: 'The comparison of the two lists is extra work on top.', reasoning: 'The cost quoted covers the building of the lists only, which must be said.' },
      ],
      answer: '120 tests for this pair, under this counting rule.',
    },
    {
      id: 's112.we3',
      prompt: 'Find gcd(60, 45) the same way, and say what the cost would be.',
      steps: [
        { text: 'Divisors of 60: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60.', reasoning: 'Testing every candidate from 1 to 60.' },
        { text: 'Divisors of 45: 1, 3, 5, 9, 15, 45.', reasoning: 'Testing every candidate from 1 to 45.' },
        { text: 'Common: 1, 3, 5, 15. The largest is 15.', reasoning: 'So gcd(60, 45) = 15, and 60 = 15 times 4 while 45 = 15 times 3.' },
        { text: 'The cost is 60 + 45 = 105 tests for this pair.', reasoning: 'It follows the sizes of the numbers, not the size of the answer.' },
      ],
      answer: 'gcd(60, 45) = 15, at 105 tests for this pair.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's112.g1',
      prompt: 'What is gcd(12, 18)?',
      hint: 'List the divisors of each.',
      answer: '6',
      rationale: 'Common divisors are 1, 2, 3, 6; the largest is 6.',
    },
    {
      id: 's112.g2',
      prompt: 'Why must each divisor list be complete?',
      hint: 'What if an entry were missing?',
      answer: 'Because a missing divisor could be the answer.',
      rationale: 'An incomplete list can give too small a gcd.',
    },
    {
      id: 's112.g3',
      prompt: 'Under the one-test-per-candidate rule, how many tests to list the divisors of 30?',
      hint: 'One per candidate from 1 to 30.',
      answer: '30',
      rationale: 'The procedure tests all the way up to the number.',
    },
  ],
  independentPractice: [
    {
      id: 's112.i1',
      prompt: 'Find gcd(48, 18) by listing divisors.',
      answer: '6.',
      rationale: 'Common divisors 1, 2, 3, 6.',
    },
    {
      id: 's112.i2',
      prompt: 'How many tests does the method take for the pair 50 and 20, under the one-test-per-candidate rule?',
      answer: '70.',
      rationale: 'Fifty tests then twenty.',
    },
    {
      id: 's112.i3',
      prompt: 'Explain why divisors come in pairs.',
      answer: 'Because if d divides n then n divided by d is also a divisor.',
      rationale: 'Each divisor below the square root has a partner above it.',
    },
  ],
  reasoningApplication: [
    {
      id: 's112.r1',
      prompt: 'This method tests every candidate up to each number. Using the fact that divisors come in pairs, explain roughly how far you would really need to test, and what that would save.',
      expectedReasoning:
        'Testing up to the square root suffices, since any divisor above it arrives paired with one below that has already been found. For 84 that means testing to 9 rather than 84. A strong answer explains why the pairing makes the upper tests redundant rather than just asserting the square-root rule.',
    },
  ],
  interactivePractice: [],
  summary:
    'The gcd can be found by listing every divisor of each number and taking the largest common entry. The method is two procedures joined, each list must be complete, and its cost — one test per candidate up to each number — follows the sizes of the numbers.',
  nextStep:
    'Next you will improve this method and judge whether the improvement is real.',
  teacher: {
    objective: 'Students execute the divisor-list gcd method and state its cost.',
    prerequisiteKnowledge: ['Divisibility', 'Divisors'],
    modelLanguage: ['Is the list complete?', 'Tests counted how?'],
    teachingNotes: [
      'Have students write the full lists at least once. The tedium is the lesson: it motivates every improvement that follows.',
      'The divisor-pairing observation is planted here deliberately and is used in the next lesson. Do not skip it.',
    ],
    quickChecks: ['Which entries are in both?', 'How many tests did that take?'],
    supportForStrugglingLearners: [
      'Test candidates in order and tick each divisor found.',
      'Write both lists above one another to spot common entries.',
    ],
    extension: ['Ask for the gcd of two numbers whose only common divisor is 1.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_11_3_IMPROVE: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s11_3_improve_lesson',
  contentArtifactVersion: 1,
  source: source('11.3', 'Data Structures', 7, 'ncert_iemh2_s11_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s11_2'],
    mayAssume: ['The divisor-list gcd method and its cost', 'Divisors come in pairs', 'Algorithms and their four parts'],
    mustNotIntroduce: [{ concept: 'Euclid’s algorithm', belongsToSection: 'ncert_iemh2_s11_3' }],
  },
  learningGoal:
    'You will improve the divisor-list method, check that each version is still correct, and compare their costs under one stated counting rule.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find a gcd by listing divisors.', 'Count divisibility tests for a given pair.', 'Say what makes an algorithm precise.'],
    ifNotReady: 'Make sure the divisor-list method and its cost are fluent; this lesson changes it and asks whether the change helped.',
  },
  vocabulary: [
    { term: 'version', meaning: 'One form of an algorithm, to be compared with another form of the same method.' },
    { term: 'running value', meaning: 'A value the procedure keeps and updates as it goes, rather than computing at the end.' },
    { term: 'correctness', meaning: 'Whether the procedure still gives the right answer after being changed.' },
  ],
  explanation: [
    'The divisor-list method works, and it does more than it needs to. Improving it means changing the procedure and then asking two separate questions: is it still correct, and does it cost less?',
    'Keeping those questions apart is the point of this lesson. A change that halves the work and sometimes gives the wrong answer is not an improvement. Correctness first, cost second.',
    'The first change: one pass instead of two. Rather than building both lists and then comparing, test each candidate against both numbers at once and keep only the ones that divide both. The common divisors come out directly and no comparing stage is needed.',
    'Is it still correct? Yes — a number is a common divisor exactly when it divides both, which is what the single test checks. Does it cost less? Under the rule that one step is one divisibility test, finding gcd(84, 36) this way tests candidates 1 to 36 against both numbers. The old method took 120 tests on this pair; the new one takes 72. Testing stops at 36 because nothing above the smaller number can divide it.',
    'The second change: keep a running value instead of a list. Each time a common divisor is found, overwrite the one remembered. When testing ends, the remembered value is the largest common divisor found, so the list was never needed.',
    'This one leaves the test count unchanged — still 72 on this pair — and saves the storing of the list instead. That is worth noticing: a change can improve one cost and not another, which means the measure has to be named before anything is called better. Judged by divisibility tests, the second change is not an improvement at all.',
  ],
  representations: ['Three versions of the method side by side with what each changed', 'The same pair traced through each version with its tests counted'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's113a.we1',
      prompt: 'Trace the single-pass version on 84 and 36.',
      steps: [
        { text: 'Test each candidate from 1 upward against both numbers at once.', reasoning: 'One test per candidate instead of two separate list-building passes.' },
        { text: 'Keep 1, 2, 3, 4, 6 and 12, which divide both.', reasoning: 'These are the common divisors, obtained directly without a comparison stage.' },
        { text: 'Stop at 36, since no number above 36 divides 36.', reasoning: 'The smaller number bounds the search, which is why the cost fell.' },
        { text: 'The largest kept is 12, so gcd(84, 36) = 12.', reasoning: 'The same answer as the two-list version, so correctness survived the change.' },
      ],
      answer: '12, found in one pass.',
    },
    {
      id: 's113a.we2',
      prompt: 'Compare the two versions on that pair under the one-test-per-candidate rule.',
      steps: [
        { text: 'The two-list version tested 1 to 84, then 1 to 36: 120 tests.', reasoning: 'Each list was built separately, so each number was tested in full.' },
        { text: 'The single-pass version tested 1 to 36 against both: 72 tests.', reasoning: 'Two numbers tested per candidate, over a shorter range.' },
        { text: 'So on this pair, under this counting rule, 72 against 120.', reasoning: 'Both the pair and the rule are named, since the counts mean nothing without them.' },
        { text: 'Both gave 12, so the saving is in work rather than in answer.', reasoning: 'Correctness and cost are judged separately, as always.' },
      ],
      answer: 'On this pair, under this counting rule: 72 tests against 120.',
    },
    {
      id: 's113a.we3',
      prompt: 'Does keeping a running value instead of a list reduce the number of tests?',
      steps: [
        { text: 'The running-value version tests exactly the same candidates as before.', reasoning: 'Changing what is stored does not change what is tested.' },
        { text: 'So it still takes 72 tests on this pair.', reasoning: 'The count is unchanged under this counting rule.' },
        { text: 'What it saves is the storing of the list of common divisors.', reasoning: 'A different cost entirely, and one this rule does not measure.' },
        { text: 'Judged by divisibility tests, it is not an improvement.', reasoning: 'Which is why the measure must be named before a change is called better.' },
      ],
      answer: 'No — it saves storage, not tests. Under this rule it is not an improvement.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's113a.g1',
      prompt: 'Why does the single-pass version stop at the smaller number?',
      hint: 'Can anything above 36 divide 36?',
      answer: 'Because nothing larger can divide the smaller number.',
      rationale: 'So testing further would be wasted work.',
    },
    {
      id: 's113a.g2',
      prompt: 'A change halves the work but sometimes gives a wrong answer. Is it an improvement?',
      hint: 'Which question comes first?',
      answer: 'No.',
      rationale: 'Correctness must survive a change before cost is even considered.',
    },
    {
      id: 's113a.g3',
      prompt: 'Under the one-test-per-candidate rule, how many tests does the single-pass version take on 50 and 20?',
      hint: 'Test 1 to 20 against both.',
      answer: '20',
      rationale: 'Each candidate is one test against both numbers.',
    },
  ],
  independentPractice: [
    {
      id: 's113a.i1',
      prompt: 'Trace the single-pass version on 48 and 18 and give the gcd.',
      answer: '6, testing candidates 1 to 18.',
      rationale: 'Common divisors 1, 2, 3, 6.',
    },
    {
      id: 's113a.i2',
      prompt: 'How many tests does the single-pass version take on 84 and 36, under the one-test-per-candidate rule?',
      answer: '72.',
      rationale: 'Candidates 1 to 36, tested against both numbers.',
    },
    {
      id: 's113a.i3',
      prompt: 'Explain why a change can improve one cost and not another.',
      answer: 'Because different measures count different work.',
      rationale: 'Storage and tests are separate costs.',
    },
  ],
  reasoningApplication: [
    {
      id: 's113a.r1',
      prompt: 'Two versions of a method give the same answers and one keeps a list while the other keeps a single value. Explain what would have to be measured for either to count as better, and whether such a comparison could ever come out both ways.',
      expectedReasoning:
        'It depends entirely on the measure: by divisibility tests they are equal, by storage the running value wins, and a different measure could favour the list — for instance if all the common divisors were wanted rather than the largest. A comparison can certainly come out both ways under different measures, which is why naming the measure is part of the claim rather than a formality.',
    },
  ],
  interactivePractice: [],
  summary:
    'Improving an algorithm means changing it and then asking separately whether it is still correct and whether it costs less. The single-pass version halves the tests on this pair; keeping a running value saves storage and changes no test count at all — so what counts as an improvement depends on which cost is being measured.',
  nextStep:
    'Next you will meet a method that is not an improvement of this one but a different idea altogether.',
  teacher: {
    objective: 'Students improve an algorithm and judge correctness and cost separately.',
    prerequisiteKnowledge: ['Divisor-list gcd', 'Counting tests'],
    modelLanguage: ['Is it still correct?', 'Cheaper by which measure?'],
    teachingNotes: [
      'Ask "still correct?" before "cheaper?" every single time. Students judge changes by speed alone otherwise.',
      'The running-value change is deliberately not an improvement under the test measure. That is the lesson, not a trick.',
    ],
    quickChecks: ['What exactly changed?', 'Which cost did it change?'],
    supportForStrugglingLearners: [
      'Tabulate version, answer and test count in three columns.',
      'Trace the same pair through each version so only the method varies.',
    ],
    extension: ['Ask which version you would want if you needed all the common divisors, not just the largest.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_11_3_EUCLID: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_s11_3_euclid_lesson',
  contentArtifactVersion: 1,
  source: source('11.3', 'Data Structures', 7, 'ncert_iemh2_s11_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh2_s11_3'],
    mayAssume: ['The divisor-list gcd method and its versions', 'Judging correctness separately from cost', 'Division with remainder'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will follow Euclid’s subtraction algorithm and its division refinement, and judge their costs across inputs chosen to reveal where each behaves badly.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Find a gcd by any method.', 'Divide with remainder.', 'Count iterations under a stated rule.'],
    ifNotReady: 'Make sure division with remainder is fluent; the refinement replaces repeated subtraction with it.',
  },
  vocabulary: [
    { term: 'Euclid\'s algorithm', meaning: 'A gcd method that repeatedly replaces the larger number using the smaller.' },
    { term: 'iteration', meaning: 'One pass through the repeated step of a procedure.' },
    { term: 'input dependence', meaning: 'Behaviour that changes with the particular numbers given.' },
  ],
  explanation: [
    'Euclid’s method is not an improved divisor list. It is a different idea, resting on one fact: if a number divides both a and b, it also divides their difference. So gcd(a, b) and gcd(a − b, b) are the same, and the pair can be replaced by a smaller pair without changing the answer.',
    'That gives the algorithm. Input: two whole numbers. Repeat: subtract the smaller from the larger. Stop: when the two are equal. Output: that common value, which is the gcd. The numbers shrink at every step, which is why the procedure ends.',
    'Trace it on 48 and 18. Subtract: 30 and 18, then 12 and 18, then 12 and 6, then 6 and 6. Equal, so the gcd is 6 — four subtractions, and no divisor list anywhere.',
    'Now a pair chosen to expose a weakness. On 100 and 3, subtracting 3 repeatedly takes 33 steps just to get down near 3, and the full trace takes 35 subtractions to reach the answer 1. The method is still correct; it is simply doing one small step at a time across a large gap.',
    'The refinement is to notice that those 33 subtractions are a division. Replace repeated subtraction by one division with remainder: 100 = 33 times 3, remainder 1. Then replace the pair by the smaller number and the remainder, and repeat until the remainder is 0. On 100 and 3 that takes 2 divisions rather than 35 subtractions.',
    'State the comparison exactly. On the pair 100 and 3, counting one subtraction or one division as one step, the subtraction form took 35 steps and the division form took 2. On the pair 48 and 18, the same rule gives 4 against 3 — much closer. So the gap between the methods depends on the input, and one example would have told you very little about the other.',
    'That is why a single example cannot settle an efficiency claim. These examples show the division form never doing worse and sometimes doing enormously better, which is good evidence and is not a proof. The honest statement is about the inputs tested and the rule used, and that statement is worth more than a confident one that goes beyond the evidence.',
  ],
  representations: ['The subtraction trace on 48 and 18, four steps to equal numbers', 'The same two methods on 100 and 3, where the traces diverge sharply'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's113b.we1',
      prompt: 'Trace Euclid’s subtraction algorithm on 48 and 18.',
      steps: [
        { text: 'Subtract the smaller from the larger: 48 − 18 = 30, giving 30 and 18.', reasoning: 'Replacing the larger by the difference leaves the gcd unchanged, since any common divisor divides the difference.' },
        { text: '30 − 18 = 12, giving 12 and 18.', reasoning: 'The same step repeated; the pair is getting smaller.' },
        { text: '18 − 12 = 6, giving 12 and 6.', reasoning: 'Now the smaller of the pair has changed, which is fine — the rule is about larger and smaller, not position.' },
        { text: '12 − 6 = 6, giving 6 and 6. They are equal, so stop.', reasoning: 'The stopping condition is met, and the common value is the gcd.' },
      ],
      answer: '6, in four subtractions.',
    },
    {
      id: 's113b.we2',
      prompt: 'Trace both forms on 100 and 3 and compare them.',
      steps: [
        { text: 'The subtraction form takes 100 down by threes: 97, 94, 91 and so on.', reasoning: 'Each step removes only 3, so a large gap takes many steps.' },
        { text: 'It reaches equal numbers after 35 subtractions, giving gcd 1.', reasoning: 'Correct, but slow — the method is doing one small step at a time.' },
        { text: 'The division form instead does 100 = 33 times 3 remainder 1, then 3 = 3 times 1 remainder 0.', reasoning: 'One division replaces the 33 repeated subtractions it stood for.' },
        { text: 'That is 2 divisions, giving gcd 1 — the same answer.', reasoning: 'On this pair, under the rule that one subtraction or one division is one step: 35 against 2.' },
      ],
      answer: 'Both give 1. On this pair, under this counting rule: 35 steps against 2.',
    },
    {
      id: 's113b.we3',
      prompt: 'On 48 and 18 the counts were 4 and 3. Does the 100-and-3 result mean the division form is always faster?',
      steps: [
        { text: 'On 48 and 18 the two forms took 4 steps and 3 steps — nearly the same.', reasoning: 'The large gap seen on the other pair does not appear here.' },
        { text: 'On 100 and 3 they took 35 and 2 — enormously different.', reasoning: 'So the size of the difference depends on the particular numbers.' },
        { text: 'Two examples show the division form never doing worse here, which is evidence rather than proof.', reasoning: 'Examples can reveal behaviour; they cannot establish what happens for every pair.' },
        { text: 'The defensible claim names the pairs tested and the counting rule used.', reasoning: 'Anything stronger would be asserting more than has been shown.' },
      ],
      answer: 'No. Across the pairs tested here the division form never did worse, but that does not settle every pair.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's113b.g1',
      prompt: 'What is the stopping condition of the subtraction form?',
      hint: 'When do you stop subtracting?',
      answer: 'When the two numbers are equal.',
      rationale: 'That equal value is the gcd.',
    },
    {
      id: 's113b.g2',
      prompt: 'Why can the larger be replaced by the difference?',
      hint: 'What does a common divisor of both also divide?',
      answer: 'Because any common divisor also divides the difference.',
      rationale: 'So the gcd is unchanged by the replacement.',
    },
    {
      id: 's113b.g3',
      prompt: 'On 100 and 3, how many subtractions does the subtraction form take?',
      hint: 'Count the trace.',
      answer: '35',
      rationale: 'Each step removes only 3 from a large gap.',
    },
  ],
  independentPractice: [
    {
      id: 's113b.i1',
      prompt: 'Trace the subtraction form on 60 and 45 and give the number of steps.',
      answer: 'gcd 15, in three subtractions.',
      rationale: '60-45=15, then 45-15=30, then 30-15=15.',
    },
    {
      id: 's113b.i2',
      prompt: 'Use the division form on 91 and 7 and count the divisions.',
      answer: 'gcd 7, in one division.',
      rationale: '91 = 13 times 7 remainder 0.',
    },
    {
      id: 's113b.i3',
      prompt: 'Explain why one example cannot show that a method is always faster.',
      answer: 'Because the comparison can change with the input.',
      rationale: 'The 48-and-18 and 100-and-3 pairs behave very differently.',
    },
  ],
  reasoningApplication: [
    {
      id: 's113b.r1',
      prompt: 'Find a pair of numbers where the subtraction form takes only one step, and a pair where it takes very many, and explain what your two pairs show about efficiency claims.',
      expectedReasoning:
        'Any pair where one is double the other, such as 30 and 15, finishes in one subtraction; any pair with a large number and a small one, such as 200 and 3, takes many. The two show that the method’s cost depends on the relationship between the inputs rather than on the method alone, so a claim about efficiency must say which inputs it covers. A strong answer constructs both pairs deliberately rather than searching at random.',
    },
  ],
  interactivePractice: [],
  summary:
    'Euclid’s algorithm replaces the larger number using the smaller, stopping when the two are equal. On a pair with a large gap the subtraction form takes many steps where the division form takes two, so the difference between them depends on the input — and the examples here are evidence about the pairs tested, not a proof about every pair.',
  nextStep:
    'That completes the chapter: procedures written precisely, improved deliberately, and compared honestly.',
  teacher: {
    objective: 'Students trace both forms of Euclid’s algorithm and scope their efficiency claims.',
    prerequisiteKnowledge: ['Division with remainder', 'Judging correctness and cost'],
    modelLanguage: ['Which pair, and which counting rule?', 'Does this example settle every pair?'],
    teachingNotes: [
      'Trace 100 and 3 by subtraction on the board in full. The tedium is the argument for the refinement.',
      'Set the two pairs side by side — 4 against 3, and 35 against 2 — so the input dependence is seen rather than stated.',
      'Press back on "always faster" answers by asking which pairs were actually tested.',
    ],
    quickChecks: ['What stops the procedure?', 'Which inputs does your claim cover?'],
    supportForStrugglingLearners: [
      'Write each pair on a new line so the shrinking is visible.',
      'Record the step count beside each trace before comparing.',
    ],
    extension: ['Ask for a pair where the division form takes exactly three divisions.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

/** Chapter 11, in the book's order. Four lessons from three sections, with
 *  §11.3 split into improving the divisor method and Euclid's algorithm. */
export function algorithmsChapterSections(): AuthoredSection[] {
  return [SECTION_11_1, SECTION_11_2, SECTION_11_3_IMPROVE, SECTION_11_3_EUCLID];
}
