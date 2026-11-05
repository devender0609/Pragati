// ===========================================================================
// v0.84.0 checkpoint 41 — CLASS 9 CHAPTER 9: PROPOSITIONS AND THEIR CONVERSES.
//
// This chapter prints no numbered section headings at all. Every other
// authored lesson in the repository names an official section; these two
// cannot, because the book does not provide one.
//
// So they are the first segment-backed lessons: `sourceKind` is
// 'source_segment', the canonical Pragati source segments are named, and
// `officialSectionId` and `sectionNumber` are left empty — which the
// validator requires, so no invented section number can ride along beside
// the segments.
//
// Segment 3 (Exercise Set 9.1 and the chapter summary) stays dispositioned
// PRACTICE and gets no Learn lesson. Covering every segment with a lesson
// would be tidier and would misdescribe the chapter.
//
// Mathematically the chapter does not introduce reasoning — Class 8 already
// proves things. What is new is the language for talking about a statement
// and its converse as two separate claims.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';

export const CONVERSES_CHAPTER_ID = 'ncert_iemh2_ch09';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part II)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh2dd.zip';
const INSPECTED = '2026-10-07';

/**
 * Segment-backed provenance. No section id, no section number — the book
 * prints neither, and the validator rejects a lesson that claims either.
 */
const segmentSource = (segmentIds: string[], sourceLabel: string, startPage: number) => ({
  officialChapterId: CONVERSES_CHAPTER_ID,
  sourceKind: 'source_segment' as const,
  officialSectionId: '',
  sectionNumber: '',
  sourceSegmentIds: segmentIds,
  sourceLabel,
  exactTitle: 'Propositions and their Converses',
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

export const SECTION_9_SEG1: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_ch09_seg1_lesson',
  contentArtifactVersion: 1,
  source: segmentSource(['pragati_srcseg_g09_ch09_seg1'], 'pages 1–2 of the chapter', 1),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Statements that are true or false', 'Class 8 work with proofs and justification', 'Properties of isosceles triangles'],
    mustNotIntroduce: [{ concept: 'Implication and converses of theorems', belongsToSection: '' }],
  },
  learningGoal:
    'You will distinguish a proposition from its converse and establish that a single counterexample refutes a universal claim.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Say whether a mathematical statement is true or false.', 'State a property of an isosceles triangle.', 'Give an example that fits a description.'],
    ifNotReady: 'You have justified claims before; this lesson gives that work precise language.',
  },
  vocabulary: [
    { term: 'proposition', meaning: 'A statement that is either true or false.' },
    { term: 'converse', meaning: 'The statement obtained by swapping the two halves of an "if, then" claim.' },
    { term: 'counterexample', meaning: 'One case satisfying the "if" half and failing the "then" half, which refutes the claim.' },
  ],
  explanation: [
    'You have been proving things since Class 8, so reasoning is not new. What is new here is a precise way to talk about the statements being reasoned about.',
    'Take a claim: if a triangle has two equal sides, then it has two equal angles. That is a proposition — a statement that is either true or false — and this one is true.',
    'Swap its two halves and you get a different statement: if a triangle has two equal angles, then it has two equal sides. That is the converse, and it happens to be true as well.',
    'But the two being true is two facts, not one. Each had to be established in its own right, and knowing the first tells you nothing about the second. Treating a statement and its converse as the same claim is the error this chapter exists to prevent.',
    'Here is a pair that settles it. If a number ends in 0, then it is divisible by 5 — true, since any number ending in 0 is a multiple of 10 and so of 5. Its converse: if a number is divisible by 5, then it ends in 0. That is false, and 35 shows it: 35 is divisible by 5 and ends in 5.',
    'That single number did the whole job. A universal claim says something about every case, so one case where it fails is enough to bring it down. This is a genuine asymmetry: refuting a universal claim takes one counterexample, while establishing one takes an argument covering every case. Any number of confirming examples — 10, 20, 30, 40 all end in 0 — proves nothing.',
  ],
  representations: ['A proposition and its converse written one above the other with their halves marked', 'A single counterexample set against a universal claim'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's9a.we1',
      prompt: 'Write the converse of "if a quadrilateral is a square, then it has four right angles", and decide whether each is true.',
      steps: [
        { text: 'The statement’s halves are "it is a square" and "it has four right angles".', reasoning: 'Identifying the two halves is what makes the swap possible.' },
        { text: 'The converse swaps them: if a quadrilateral has four right angles, then it is a square.', reasoning: 'The converse is formed mechanically, before any question of truth arises.' },
        { text: 'The original is true, since every square has four right angles by definition.', reasoning: 'Establishing one direction says nothing yet about the other.' },
        { text: 'The converse is false: a rectangle 6 cm by 3 cm has four right angles and is not a square.', reasoning: 'One counterexample is enough, since the converse claims this for every such quadrilateral.' },
      ],
      answer: 'Converse: if it has four right angles, then it is a square. Original true, converse false.',
    },
    {
      id: 's9a.we2',
      prompt: 'Is "if a number is divisible by 6, then it is divisible by 3" true? Is its converse?',
      steps: [
        { text: 'Any multiple of 6 is 6 times something, which is 3 times twice that. So the statement is true.', reasoning: 'An argument covering every case is what a universal claim needs.' },
        { text: 'The converse is: if a number is divisible by 3, then it is divisible by 6.', reasoning: 'Swapping the halves gives a different claim.' },
        { text: 'Take 9. It is divisible by 3 and not by 6.', reasoning: 'A single case satisfying the first half and failing the second refutes the whole claim.' },
        { text: 'So the statement is true and its converse is false.', reasoning: 'Two separate verdicts, reached by two separate pieces of work.' },
      ],
      answer: 'The statement is true; the converse is false, as 9 shows.',
    },
    {
      id: 's9a.we3',
      prompt: 'A student checks that 10, 20, 30 and 40 are all divisible by 5 and concludes that every multiple of 5 ends in 0. What is wrong?',
      steps: [
        { text: 'All four examples do satisfy the claim.', reasoning: 'The evidence is genuine as far as it goes.' },
        { text: 'But the claim is about every multiple of 5, not about four of them.', reasoning: 'A universal claim is not established by any number of confirming cases.' },
        { text: 'And 35 is a multiple of 5 that ends in 5.', reasoning: 'One counterexample refutes it outright.' },
        { text: 'So the examples were not merely insufficient — the claim is false.', reasoning: 'Confirming cases can coexist with a counterexample, which is why they prove nothing.' },
      ],
      answer: 'Confirming examples never establish a universal claim, and here 35 refutes it.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's9a.g1',
      prompt: 'Write the converse of "if it is raining, then the ground is wet".',
      hint: 'Swap the two halves.',
      answer: 'If the ground is wet, then it is raining.',
      rationale: 'The converse is formed before truth is considered.',
    },
    {
      id: 's9a.g2',
      prompt: 'How many counterexamples are needed to refute a universal claim?',
      hint: 'What does "every" require?',
      answer: 'One.',
      rationale: 'A single failing case is enough.',
    },
    {
      id: 's9a.g3',
      prompt: 'Does a true statement make its converse true?',
      hint: 'Are they the same claim?',
      answer: 'No.',
      rationale: 'They are two separate claims, each needing its own justification.',
    },
  ],
  independentPractice: [
    {
      id: 's9a.i1',
      prompt: 'Write the converse of "if a number ends in 2, then it is even", and say whether each is true.',
      answer: 'Original true; converse false, as 4 shows.',
      rationale: 'Four is even and does not end in 2.',
    },
    {
      id: 's9a.i2',
      prompt: 'Give a counterexample to "every multiple of 4 is a multiple of 8".',
      answer: '12, or any multiple of 4 that is not a multiple of 8.',
      rationale: 'One failing case refutes the claim.',
    },
    {
      id: 's9a.i3',
      prompt: 'Explain why twenty confirming examples do not prove a universal claim.',
      answer: 'Because the claim covers every case, and twenty is not every case.',
      rationale: 'A counterexample may still be waiting.',
    },
  ],
  reasoningApplication: [
    {
      id: 's9a.r1',
      prompt: 'Construct a proposition whose converse is false, and one where both are true. Explain what makes the second kind different and what it took to know it.',
      expectedReasoning:
        'Any definition-based pair where one side is broader works for the first, such as squares and right angles. For the second, both directions must be argued separately — the isosceles pair is an example, and knowing it required two arguments rather than one. A strong answer notices that the second kind is not more natural, merely more established, and resists treating both-true as the default.',
    },
  ],
  interactivePractice: [],
  summary:
    'A proposition and its converse are two separate claims, and the truth of one establishes nothing about the other. A single counterexample refutes a universal claim, while confirming examples, however many, establish nothing.',
  nextStep:
    'Next you will apply this to real theorems and meet the implication notation that goes with it.',
  teacher: {
    objective: 'Students distinguish a proposition from its converse and use counterexamples.',
    prerequisiteKnowledge: ['Statements and their truth', 'Class 8 proof work'],
    modelLanguage: ['Which claim are you testing?', 'Is that one case or every case?'],
    teachingNotes: [
      'Do not open as a first encounter with reasoning. Class 8 proves things; this chapter names the statements.',
      'The divisible-by-5 pair is the clearest asymmetry in the lesson: same numbers, one direction true, one false.',
      'Make the asymmetry explicit — one case refutes, no number of cases establishes.',
    ],
    quickChecks: ['What are the two halves?', 'Would one example settle it?'],
    supportForStrugglingLearners: [
      'Write the two halves in separate boxes before swapping.',
      'Hunt deliberately for a counterexample before trying to argue a claim is true.',
    ],
    extension: ['Ask for a pair where the converse is true and the original false.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_9_SEG2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh2_ch09_seg2_lesson',
  contentArtifactVersion: 1,
  source: segmentSource(['pragati_srcseg_g09_ch09_seg2'], 'pages 3–5 of the chapter', 3),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Propositions, converses and counterexamples', 'The Pythagoras relation from earlier work', 'Odd and even numbers'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will write "if X then Y" as "X implies Y", and show that a theorem and its converse are different statements each needing its own justification.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Form the converse of a statement.', 'Refute a universal claim with a counterexample.', 'State the Pythagoras relation for a right triangle.'],
    ifNotReady: 'Make sure the previous lesson is secure; this one applies it to theorems you already know.',
  },
  vocabulary: [
    { term: 'implies', meaning: 'A shorter way of writing "if, then": X implies Y.' },
    { term: 'hypothesis', meaning: 'The X half — what is assumed.' },
    { term: 'conclusion', meaning: 'The Y half — what is claimed to follow.' },
  ],
  explanation: [
    '"If X, then Y" is written more briefly as "X implies Y". Nothing changes mathematically; the X half is called the hypothesis and the Y half the conclusion, and the converse swaps them to give "Y implies X".',
    'Having names for the halves makes the swap easy to perform and easy to check. It is also what makes it obvious that the converse is a different statement: a claim that something follows from X is not a claim that it leads back to X.',
    'Now a theorem you know. The Baudhayana-Pythagoras theorem says: if a triangle has a right angle, then the square on its longest side equals the sum of the squares on the other two. In the new notation, right angle implies the square relation.',
    'Its converse swaps the halves: if the square on the longest side equals the sum of the squares on the other two, then the triangle has a right angle. This is also true, and it is genuinely useful — it is what lets you check a corner is square by measuring three lengths, with sides 9, 12 and 15 giving 81 + 144 = 225.',
    'Both being true is the point to be careful about. They are two theorems, proved separately, and the second does not come free with the first. Builders rely on the converse, and anyone who assumed it followed automatically from the theorem would be relying on something unestablished.',
    'A quick odd-and-even pair shows how fast the other case appears. If a number is even, then its square is even — true, since an even number is 2k and its square is 4k squared. The converse, if a square is even then the number is even, is also true. But change it slightly: if a number is divisible by 4, then its square is divisible by 4 is true, while the converse fails at 2, whose square 4 is divisible by 4 though 2 is not. Small changes to a statement change what its converse is worth, so each converse has to be examined on its own.',
  ],
  representations: ['A statement written as X implies Y, with hypothesis and conclusion labelled', 'A theorem and its converse set side by side, each marked as separately established'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's9b.we1',
      prompt: 'Write "if a triangle has a right angle, then the square on its longest side equals the sum of the squares on the other two" in implication form, and give its converse.',
      steps: [
        { text: 'The hypothesis is "the triangle has a right angle"; the conclusion is the square relation.', reasoning: 'Naming the halves is what makes the rewriting and the swap mechanical.' },
        { text: 'In implication form: right angle implies the square relation.', reasoning: 'The notation is shorthand; the mathematics is unchanged.' },
        { text: 'The converse swaps them: the square relation implies a right angle.', reasoning: 'A different statement, which must now be judged on its own.' },
        { text: 'Both are true, and each was established separately.', reasoning: 'Neither follows from the other merely by being its converse.' },
      ],
      answer: 'Right angle implies the square relation; the converse is the square relation implies a right angle, and both are true.',
    },
    {
      id: 's9b.we2',
      prompt: 'A carpenter measures a corner’s sides as 9, 12 and 15 units. Which statement is being used, and is the corner square?',
      steps: [
        { text: 'The measurements are the square relation: 81 + 144 = 225, and 15 squared is 225.', reasoning: 'The hypothesis being checked is about the lengths, not about the angle.' },
        { text: 'Concluding a right angle from lengths uses the converse, not the theorem.', reasoning: 'The theorem goes from angle to lengths; this goes the other way.' },
        { text: 'The converse is true, so the corner is square.', reasoning: 'The conclusion is sound because that direction was separately established.' },
        { text: 'Had only the theorem been established, this check would rest on nothing.', reasoning: 'Which is why the converse being a separate theorem matters practically.' },
      ],
      answer: 'The converse, and the corner is square.',
    },
    {
      id: 's9b.we3',
      prompt: 'Is "if a number is divisible by 4, then its square is divisible by 4" true? Is its converse?',
      steps: [
        { text: 'A number divisible by 4 is 4k, whose square is 16k squared — divisible by 4.', reasoning: 'An argument covering every case, so the statement is true.' },
        { text: 'The converse: if a number’s square is divisible by 4, then the number is divisible by 4.', reasoning: 'The halves swapped, giving a separate claim.' },
        { text: 'Take 2. Its square is 4, which is divisible by 4, but 2 is not.', reasoning: 'One counterexample settles it.' },
        { text: 'So the statement is true and the converse false, unlike the even-number pair.', reasoning: 'A small change to the statement changed the verdict on its converse entirely.' },
      ],
      answer: 'The statement is true; the converse is false, as 2 shows.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's9b.g1',
      prompt: 'In "X implies Y", which half is the hypothesis?',
      hint: 'Which is assumed?',
      answer: 'X.',
      rationale: 'The hypothesis is what is assumed; Y is the conclusion.',
    },
    {
      id: 's9b.g2',
      prompt: 'Does the Pythagoras converse follow automatically from the theorem?',
      hint: 'Is a converse ever free?',
      answer: 'No.',
      rationale: 'It is a separate theorem, separately established.',
    },
    {
      id: 's9b.g3',
      prompt: 'Write the converse of "right angle implies the square relation".',
      hint: 'Swap the halves.',
      answer: 'The square relation implies a right angle.',
      rationale: 'Hypothesis and conclusion exchange places.',
    },
  ],
  independentPractice: [
    {
      id: 's9b.i1',
      prompt: 'Write "if a number is a multiple of 10, then it is even" in implication form and give its converse.',
      answer: 'Multiple of 10 implies even; converse: even implies multiple of 10, which is false at 4.',
      rationale: 'One counterexample refutes it.',
    },
    {
      id: 's9b.i2',
      prompt: 'Sides measure 7, 24 and 25. Is the corner square, and which statement did you use?',
      answer: 'Yes, using the converse.',
      rationale: '49 + 576 = 625, which is 25 squared.',
    },
    {
      id: 's9b.i3',
      prompt: 'Explain why the carpenter’s check needs the converse rather than the theorem.',
      answer: 'Because it argues from lengths to an angle.',
      rationale: 'The theorem argues the other way.',
    },
  ],
  reasoningApplication: [
    {
      id: 's9b.r1',
      prompt: 'The even-number pair had both directions true, and the divisible-by-4 pair did not. Explain what you would have to do to know which case a new statement falls into, and why inspection is not enough.',
      expectedReasoning:
        'Each direction has to be settled on its own — an argument covering every case to establish it, or a single counterexample to refute it — and nothing about the statement’s appearance predicts which. The two pairs here look almost identical and behave differently, which is exactly why inspection fails. A strong answer treats the converse as a fresh question every time.',
    },
  ],
  interactivePractice: [],
  summary:
    'Writing "if X then Y" as "X implies Y" names the hypothesis and conclusion and makes the swap easy to perform. A theorem and its converse are separate statements: the Baudhayana-Pythagoras theorem and its converse are both true and were established separately, while a small change to a statement can leave its converse false.',
  nextStep:
    'That completes the chapter: statements, their converses, and what it takes to settle each.',
  teacher: {
    objective: 'Students use implication form and judge converses of real theorems.',
    prerequisiteKnowledge: ['Propositions and converses', 'The Pythagoras relation'],
    modelLanguage: ['Which direction is being used?', 'Has that direction been established?'],
    teachingNotes: [
      'The carpenter example is the one students remember: it is the converse, not the theorem, that does practical work.',
      'The two near-identical odd/even pairs with different verdicts are worth doing together — they defeat judging a converse by eye.',
    ],
    quickChecks: ['Hypothesis or conclusion?', 'Theorem or converse?'],
    supportForStrugglingLearners: [
      'Label the two halves before swapping them.',
      'Check a claimed converse against a small counterexample before trying to argue it.',
    ],
    extension: ['Ask whether a statement and its converse can both be false.'],
    materialsNeeded: ['Ruler', 'Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

/** Chapter 9, in the book's order. Two segment-backed lessons; the third
 *  source segment stays dispositioned PRACTICE and gets no lesson. */
export function conversesChapterSections(): AuthoredSection[] {
  return [SECTION_9_SEG1, SECTION_9_SEG2];
}
