// ===========================================================================
// v0.84.0 checkpoint 42 — CLASS 9 CHAPTER 3: THE WORLD OF NUMBERS.
//
// The last ordinary authoring wave, and a deliberately incomplete chapter.
// §3.1, the chapter's opening historical pages, stays unauthored under
// `historical_material_lesson_vs_context`. That is a human curriculum
// decision about how historical material should function instructionally,
// not a gap in the evidence, and nothing here resolves it: its mathematics
// is not borrowed into §3.2 to make the chapter look finished.
//
// Eight lessons from six sections, with §3.4, §3.5 and §3.6 each split.
//
// Progression care: Class 8 already met non-terminating decimals and root 2.
// What Class 9 adds is the contradiction PROOF, so no lesson here says
// irrationality or reasoning is new.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import type { GeometryFigureSpec } from './visualSpecification';

export const NUMBERS_CHAPTER_ID = 'ncert_iemh1_ch03';

const BOOK = 'Ganita Manjari, Textbook of Mathematics for Grade 9 (Part I)';
const SRC = 'https://ncert.nic.in/textbook/pdf/iemh1dd.zip';
const INSPECTED = '2026-10-07';

const source = (
  sectionNumber: string,
  exactTitle: string,
  startPage: number,
  officialSectionId: string
) => ({
  officialChapterId: NUMBERS_CHAPTER_ID,
  officialSectionId,
  sectionNumber,
  exactTitle,
  startPage,
  textbook: BOOK,
  sourceReference: SRC,
  inspectionDate: INSPECTED,
});

const P = (id: string, x: number, y: number, label: string) => ({ id, x, y, label });

// Root 2 built on the number line as a real length, not a marked estimate:
// the hypotenuse of a unit right triangle swung down to the line.
const F_ROOT2: GeometryFigureSpec = {
  type: 'geometry_figure',
  purpose: 'show_construction',
  status: 'concept_specific',
  points: [
    P('o', 40, 150, '0'),
    P('a', 140, 150, '1'),
    P('b', 140, 50, 'B'),
    P('r', 181, 150, 'root 2'),
    P('two', 240, 150, '2'),
  ],
  segments: [
    { from: 'o', to: 'two' },
    { from: 'a', to: 'b', mark: 'single_tick', label: 'unit' },
    { from: 'o', to: 'a', mark: 'single_tick', label: 'unit' },
    { from: 'o', to: 'b', label: 'hypotenuse' },
  ],
  angleMarks: [{ at: 'a', from: 'o', to: 'b', right: true }],
  arcs: [],
  caption: 'The hypotenuse of a unit right triangle, swung down onto the line.',
  altText:
    'A number line marked 0, 1 and 2. A unit segment is drawn upward from the point 1, at a right angle to the line, reaching the point B. The segment from 0 to B is the hypotenuse of a right triangle with both legs of length one unit, so by the Pythagoras relation it measures the square root of 2. An arc centred at 0 swings that hypotenuse down onto the line, landing between 1 and 2 at the exact point root 2.',
};

export const SECTION_3_2: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s3_2_lesson',
  // v0.84.0 checkpoint 43 — version 2. Version 1 passed alignment at
  // checkpoint 42 without the §3.1 context, so the change is recorded
  // rather than made silently.
  contentArtifactVersion: 2,
  revisionHistory: [
    {
      version: 2,
      at: 'v0.84.0 checkpoint 43',
      reason:
        'Human policy decision on historical_material_lesson_vs_context: CONTEXTUAL_MERGE. §3.1 has complete source evidence but establishes no independently assessable mathematical objective, so its material attaches here rather than becoming a standalone lesson.',
      changed: [
        'added the opening historical context drawn from §3.1',
        'added ncert_iemh1_s3_1 to additionalOfficialSectionIds',
        'no change to the §3.2 mathematics, worked examples, practice or assessment',
      ],
    },
  ],
  source: {
    ...source('3.2', 'The Revolution of Śhūnya: When Nothing Became Something', 3, 'ncert_iemh1_s3_2'),
    // §3.1 is carried here as context under the resolved policy. It stays
    // in provenance, so the official section is still accounted for.
    additionalOfficialSectionIds: ['ncert_iemh1_s3_1'],
  },
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: [],
    mayAssume: ['Place value', 'Whole numbers and their arithmetic', 'Reading a numeral with a zero in it'],
    mustNotIntroduce: [{ concept: 'Integers and signed arithmetic', belongsToSection: 'ncert_iemh1_s3_3' }, { concept: 'Rational numbers', belongsToSection: 'ncert_iemh1_s3_4' }],
  },
  learningGoal:
    'You will distinguish zero as a placeholder from zero as a number, and state the arithmetic rules that govern it, including why division by zero is left undefined.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Read a numeral such as 305 and say what each digit contributes.', 'Add and multiply whole numbers.', 'Say what a placeholder does in place-value notation.'],
    ifNotReady: 'No special preparation; you have been writing zero since primary school.',
  },
  vocabulary: [
    { term: 'placeholder', meaning: 'A mark holding an empty place so the other digits keep their value.' },
    { term: 'zero as a number', meaning: 'A quantity that can be added, subtracted and multiplied like any other.' },
    { term: 'undefined', meaning: 'Given no value, because no value would be consistent.' },
  ],
  explanation: [
    'Long before anyone wrote a numeral, people needed to keep track of quantities \u2014 how many animals in a herd, how many days since a flood. The oldest surviving records of counting are notches cut into bone, one mark for one thing, and they are tens of thousands of years old. Counting was invented because it was needed, and the evidence of that need survives in the marks themselves.',
  'Tallying works and it does not scale. A hundred notches are no easier to read than a hundred animals, so systems grew that grouped marks and gave positions meaning. That is where the digit you are about to meet earns its place \u2014 because a system built on position needs a way to say that a position is empty.',
  'Write 305 and the middle digit does real work: it keeps the 3 in the hundreds place. Remove it and you have 35, a different number entirely. That is zero as a placeholder — a mark that holds an empty position.',
    'Being a placeholder is not the same as being a number. A placeholder is part of how a numeral is written; a number is something you can add to, subtract from and multiply by. Several systems used a placeholder for centuries without ever treating it as a quantity.',
    'Brahmagupta set out rules that treat it as a quantity. Adding zero to a number leaves it unchanged. Subtracting zero leaves it unchanged. Multiplying any number by zero gives zero. Those are rules about a number, not about notation, and they are what make zero a number.',
    'Division is where it stops. Ask what 7 divided by 0 should be: a number which, multiplied by 0, gives 7. But everything multiplied by 0 gives 0, never 7, so no such number exists. Division by zero is left undefined — not because nobody has worked it out, but because no value could be consistent with the other rules.',
    'Zero divided by zero fails differently and is worth separating. Here every number works: 5 times 0 is 0, and 1 times 0 is 0, and so is 0 times 0. A quotient is supposed to be one specific number, and anything that could be anything is no answer at all. One case has no candidate; the other has too many.',
  ],
  representations: ['The same digits written with and without the placeholder', 'Brahmagupta’s rules listed as statements about a number'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's32.we1',
      prompt: 'Explain what the zero does in 4075, and what the numeral becomes without it.',
      steps: [
        { text: 'The digits are 4, 0, 7 and 5 in the thousands, hundreds, tens and units places.', reasoning: 'Place value is what gives each digit its contribution.' },
        { text: 'The zero holds the hundreds place empty.', reasoning: 'Without a mark there, the places to its left would slide right and change value.' },
        { text: 'Removing it leaves 475, which is a different number.', reasoning: 'So the placeholder is doing real work in the notation, not decorating it.' },
      ],
      answer: 'It holds the hundreds place; without it the numeral reads 475.',
    },
    {
      id: 's32.we2',
      prompt: 'Why is 7 divided by 0 left undefined?',
      steps: [
        { text: 'A quotient of 7 by 0 would be a number which, multiplied by 0, gives 7.', reasoning: 'That is what division means: the quotient recovers the dividend when multiplied back.' },
        { text: 'But every number multiplied by 0 gives 0.', reasoning: 'This is one of the rules that makes zero a number, so it cannot be set aside here.' },
        { text: 'No number gives 7, so there is no candidate at all.', reasoning: 'The expression is left undefined because defining it would contradict the multiplication rule.' },
      ],
      answer: 'Because no number multiplied by 0 gives 7, so there is no candidate.',
    },
    {
      id: 's32.we3',
      prompt: 'How does 0 divided by 0 fail differently?',
      steps: [
        { text: 'Here the quotient would be a number which, multiplied by 0, gives 0.', reasoning: 'Same definition of division, different dividend.' },
        { text: 'Every number satisfies that: 5, 1 and 0 all work.', reasoning: 'The problem is not that nothing works but that everything does.' },
        { text: 'A quotient must be one specific number, so this is no answer.', reasoning: 'One case has no candidate; this one has too many, and both are left undefined.' },
      ],
      answer: 'Every number qualifies, so no single quotient exists — undefined for the opposite reason.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's32.g1',
      prompt: 'What does the zero do in 507?',
      hint: 'Which place would otherwise shift?',
      answer: 'Holds the tens place.',
      rationale: 'Without it the numeral would read 57.',
    },
    {
      id: 's32.g2',
      prompt: 'What is 13 times 0?',
      hint: 'Brahmagupta’s multiplication rule.',
      answer: '0',
      rationale: 'Any number times zero is zero.',
    },
    {
      id: 's32.g3',
      prompt: 'Is zero a placeholder, a number, or both?',
      hint: 'Which roles has it been given?',
      answer: 'Both.',
      rationale: 'It holds a place in notation and behaves as a quantity in arithmetic.',
    },
  ],
  independentPractice: [
    {
      id: 's32.i1',
      prompt: 'State what adding zero to a number does, and what multiplying by zero does.',
      answer: 'Adding leaves it unchanged; multiplying gives zero.',
      rationale: 'These are rules about zero as a quantity.',
    },
    {
      id: 's32.i2',
      prompt: 'Explain in one sentence why division by zero is undefined.',
      answer: 'Because no number multiplied by zero gives a non-zero result.',
      rationale: 'There is no candidate quotient.',
    },
    {
      id: 's32.i3',
      prompt: 'Which is different, 0 divided by 5 or 5 divided by 0? Say why.',
      answer: '0 divided by 5 is 0; 5 divided by 0 is undefined.',
      rationale: 'Zero as a dividend is fine; zero as a divisor is not.',
    },
  ],
  reasoningApplication: [
    {
      id: 's32.r1',
      prompt: 'Zero was used as a placeholder long before it was treated as a number. Explain what had to be settled before it could count as a number, and why division had to be excluded.',
      expectedReasoning:
        'Rules for how it behaves under addition, subtraction and multiplication had to be stated, since being a number means taking part in arithmetic rather than merely marking a position. Division had to be excluded because no consistent value exists — none at all for a non-zero dividend, and every value for zero itself. A strong answer treats the exclusion as forced by the other rules rather than as a convention.',
    },
  ],
  interactivePractice: [],
  summary:
    'Zero holds an empty place in notation and is also a number with its own arithmetic: adding or subtracting it changes nothing, multiplying by it gives zero. Division by zero is undefined because no value could be consistent — none exists for a non-zero dividend, and every value qualifies for zero itself.',
  nextStep:
    'Next you will extend the number system in the other direction, below zero.',
  teacher: {
    objective: 'Students separate zero the placeholder from zero the number and justify the division exclusion.',
    prerequisiteKnowledge: ['Place value', 'Whole number arithmetic'],
    modelLanguage: ['Placeholder or quantity?', 'Why is there no candidate?'],
    teachingNotes: [
      'Ask for 7 divided by 0 before explaining. The usual answer is "infinity" or "zero", and both are worth taking apart.',
      'Keep the two division failures distinct; students merge them and lose the reason either is undefined.',
    ],
    quickChecks: ['Which role of zero is this?', 'What would the quotient have to satisfy?'],
    supportForStrugglingLearners: [
      'Write the division as a multiplication question before answering.',
      'Strike out the zero in a numeral to see what the value becomes.',
    ],
    extension: ['Ask whether any other number has to be excluded as a divisor.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_3_3: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s3_3_lesson',
  contentArtifactVersion: 1,
  source: source('3.3', 'Integers: Expanding the Horizon', 5, 'ncert_iemh1_s3_3'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s3_2'],
    mayAssume: ['Zero as a number', 'Subtraction of whole numbers', 'Class 8 work with negative numbers'],
    mustNotIntroduce: [{ concept: 'Rational numbers', belongsToSection: 'ncert_iemh1_s3_4' }],
  },
  learningGoal:
    'You will extend the number system to the integers and justify the rules for adding and multiplying signed numbers rather than memorising them.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Subtract one whole number from another.', 'Place a number on a number line.', 'State what zero contributes to a sum.'],
    ifNotReady: 'You have met negative numbers before; this lesson asks why their rules are what they are.',
  },
  vocabulary: [
    { term: 'integer', meaning: 'A whole number, positive, negative or zero.' },
    { term: 'opposite', meaning: 'The number the same distance from zero on the other side.' },
    { term: 'justification', meaning: 'A reason the rule must be this way, rather than a statement that it is.' },
  ],
  explanation: [
    'Ask what 3 − 5 means and whole numbers have no answer. Rather than declare it impossible, the number system is extended: numbers below zero are admitted, and every whole number gains an opposite. Together with zero these are the integers.',
    'Brahmagupta described them with fortunes and debts, and the picture is still useful. A debt of 5 added to a fortune of 3 leaves a debt of 2, which is 3 + (−5) = −2. Subtracting a debt is being relieved of it, which leaves you better off: 3 − (−5) = 8.',
    'The product rules deserve more than a slogan. Positive times positive is positive, and positive times negative is negative — three debts of 5 is a debt of 15. Those are readable straight from the picture.',
    'Negative times negative is where the picture runs out, and the rule follows from insisting the arithmetic stay consistent. Look at 5 × (−3) + (−5) × (−3). Factor out the −3 and the bracket is 5 + (−5), which is 0, so the whole expression is 0. The first term is −15. So the second must be +15, because nothing else added to −15 gives 0.',
    'That is the justification. Negative times negative is positive not because somebody decided it, but because any other value would break the distributive law that already governs the numbers you started with. The extension was made to keep the old rules working, so the new rules are whatever that demands.',
  ],
  representations: ['A number line extended through zero with opposites paired', 'The distributive argument laid out line by line'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's33.we1',
      prompt: 'Compute 3 + (−5) and 3 − (−5), with a reason for each.',
      steps: [
        { text: 'Adding −5 to 3 is adding a debt of 5 to a fortune of 3.', reasoning: 'The fortune-and-debt picture makes the direction of the change concrete.' },
        { text: 'The debt exceeds the fortune by 2, so the result is −2.', reasoning: 'What remains is a debt, which is a number below zero.' },
        { text: 'Subtracting −5 is being relieved of a debt of 5, which leaves you better off.', reasoning: 'Subtracting an opposite moves in the opposite direction to adding it.' },
        { text: 'So 3 − (−5) = 8.', reasoning: 'Consistent with subtraction being the reverse of addition.' },
      ],
      answer: '−2 and 8.',
    },
    {
      id: 's33.we2',
      prompt: 'Show that (−5) × (−3) must be 15.',
      steps: [
        { text: 'Consider 5 × (−3) + (−5) × (−3), and factor out the −3.', reasoning: 'Factoring uses the distributive law, which already held before the extension.' },
        { text: 'The bracket is 5 + (−5) = 0, so the whole expression is 0 times −3, which is 0.', reasoning: 'Zero multiplied by anything is zero, from the previous lesson.' },
        { text: 'The first term 5 × (−3) is −15.', reasoning: 'A positive times a negative, which the debt picture settles.' },
        { text: 'So the second term must be +15, since −15 + 15 = 0.', reasoning: 'Nothing else added to −15 gives 0, so the value is forced.' },
      ],
      answer: '15 — forced by the distributive law, not chosen.',
    },
    {
      id: 's33.we3',
      prompt: 'Why was the number system extended rather than declaring 3 − 5 impossible?',
      steps: [
        { text: 'Within whole numbers, 3 − 5 genuinely has no answer.', reasoning: 'So something had to change for the subtraction to mean anything.' },
        { text: 'Admitting numbers below zero lets every subtraction be carried out.', reasoning: 'The extension is made to remove the obstruction.' },
        { text: 'But it is only useful if the old arithmetic still works on the old numbers.', reasoning: 'Which is why the new rules are forced rather than free.' },
      ],
      answer: 'To make subtraction always possible, while keeping the existing arithmetic intact.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's33.g1',
      prompt: 'What is −7 + 4?',
      hint: 'A debt of 7 against a fortune of 4.',
      answer: '−3',
      rationale: 'The debt exceeds the fortune by 3.',
    },
    {
      id: 's33.g2',
      prompt: 'What is (−6) × (−4)?',
      hint: 'Negative times negative.',
      answer: '24',
      rationale: 'Positive, by the distributive argument.',
    },
    {
      id: 's33.g3',
      prompt: 'What is the opposite of −9?',
      hint: 'Same distance from zero, other side.',
      answer: '9',
      rationale: 'Opposites sum to zero.',
    },
  ],
  independentPractice: [
    {
      id: 's33.i1',
      prompt: 'Compute −8 − (−3).',
      answer: '−5.',
      rationale: 'Subtracting a debt of 3 improves a debt of 8 to a debt of 5.',
    },
    {
      id: 's33.i2',
      prompt: 'Compute (−7) × 5 and (−7) × (−5).',
      answer: '−35 and 35.',
      rationale: 'Positive times negative is negative; negative times negative is positive.',
    },
    {
      id: 's33.i3',
      prompt: 'Explain why the negative-times-negative rule is not a convention.',
      answer: 'Because any other value would break the distributive law.',
      rationale: 'It is forced by the arithmetic already in place.',
    },
  ],
  reasoningApplication: [
    {
      id: 's33.r1',
      prompt: 'Suppose someone insisted that (−5) × (−3) should be −15. Trace what else would have to change, and explain what that tells you about the rule.',
      expectedReasoning:
        'The distributive argument would give −15 + (−15) = 0, which is false, so either distributivity or the rule that zero times anything is zero would have to go — and both govern the whole numbers the extension was built to preserve. A strong answer sees that the rule is not independently choosable, because changing it breaks arithmetic that predates it.',
    },
  ],
  interactivePractice: [],
  summary:
    'The integers extend the whole numbers so every subtraction has an answer. The sign rules are not conventions: negative times negative must be positive, because any other value would break the distributive law the original numbers already obeyed.',
  nextStep:
    'Next you will fill the spaces between the integers.',
  teacher: {
    objective: 'Students justify signed arithmetic rather than recalling sign rules.',
    prerequisiteKnowledge: ['Negative numbers', 'Subtraction'],
    modelLanguage: ['Why must the rule be this?', 'What would break otherwise?'],
    teachingNotes: [
      'The distributive argument is short and should be written out in full. "Two negatives make a positive" is a slogan students already have and cannot defend.',
      'Debt and fortune carries the sums but not the products; say where it stops rather than stretching it.',
    ],
    quickChecks: ['Fortune or debt?', 'What is forced here?'],
    supportForStrugglingLearners: [
      'Lay the distributive argument out one line per step.',
      'Mark opposites in pairs on a number line.',
    ],
    extension: ['Ask what would happen to the sign rules if zero times something were not zero.'],
    materialsNeeded: ['Number line', 'Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_3_4_ARITH: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s3_4_arith_lesson',
  contentArtifactVersion: 1,
  source: source('3.4', 'Filling the Spaces: Fractions and Rational Numbers', 6, 'ncert_iemh1_s3_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s3_3'],
    mayAssume: ['Integers and signed arithmetic', 'Equivalent fractions', 'Lowest terms'],
    mustNotIntroduce: [{ concept: 'Rationals on the number line, and density', belongsToSection: 'ncert_iemh1_s3_4' }, { concept: 'Irrational numbers', belongsToSection: 'ncert_iemh1_s3_5' }],
  },
  learningGoal:
    'You will define a rational number as p/q with q not zero, recognise that one rational has many fraction names, and operate with rationals including signs.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Add and multiply fractions.', 'Reduce a fraction to lowest terms.', 'Apply the sign rules for integers.'],
    ifNotReady: 'Make sure fraction arithmetic is fluent; this lesson names what those fractions are.',
  },
  vocabulary: [
    { term: 'rational number', meaning: 'A number expressible as p/q with p and q integers and q not zero.' },
    { term: 'lowest terms', meaning: 'The form where numerator and denominator share no factor above 1.' },
    { term: 'equivalent fractions', meaning: 'Different fraction names for the same number.' },
  ],
  explanation: [
    'Integers leave gaps. Between 2 and 3 there is nothing, yet half of five is plainly a number. Filling those gaps gives the rational numbers: anything expressible as p over q, with p and q integers and q not zero.',
    'The exclusion of zero is not a special case to remember. It is the previous lesson’s result — division by zero has no consistent value, so a denominator of zero names nothing.',
    'One rational has many fraction names. 2/4, 3/6 and 50/100 are the same number written differently, since multiplying numerator and denominator by the same non-zero integer changes the name and not the value. Lowest terms picks one name out of the infinitely many, which is why it is the standard form.',
    'Arithmetic runs as before, with the integer sign rules now applying to numerators and denominators. Adding needs a common denominator; multiplying works across; dividing multiplies by the reciprocal.',
    'A negative sign can sit in three places and mean one thing: −3/4, (−3)/4 and 3/(−4) are all the same number. That follows from the sign rules rather than being a separate convention — a negative numerator over a positive denominator, or the reverse, both give a negative quotient.',
    'Every integer is itself rational, since 5 is 5/1. So this is a genuine extension: nothing from before is lost, and the gaps between the integers are now populated.',
  ],
  representations: ['One rational written under several fraction names', 'A negative sign moved between numerator, denominator and front'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's34a.we1',
      prompt: 'Show that 6/8 and 15/20 are the same rational number.',
      steps: [
        { text: 'Reduce 6/8: both share a factor of 2, giving 3/4.', reasoning: 'Dividing numerator and denominator by a common factor changes the name, not the value.' },
        { text: 'Reduce 15/20: both share a factor of 5, giving 3/4.', reasoning: 'The same reduction applied to the second name.' },
        { text: 'Both reach 3/4 in lowest terms, so they are the same number.', reasoning: 'Lowest terms is a single standard name, which is what makes this comparison decisive.' },
      ],
      answer: 'The same number; both are 3/4.',
    },
    {
      id: 's34a.we2',
      prompt: 'Compute (−2)/3 + 5/6.',
      steps: [
        { text: 'The common denominator is 6, so (−2)/3 becomes (−4)/6.', reasoning: 'Multiplying numerator and denominator by 2 gives an equivalent fraction with the needed denominator.' },
        { text: 'Add the numerators: −4 + 5 = 1, over 6.', reasoning: 'Addition with a common denominator adds numerators, and the integer sign rules handle the signs.' },
        { text: 'The result is 1/6, already in lowest terms.', reasoning: 'Numerator and denominator share no factor above 1.' },
      ],
      answer: '1/6.',
    },
    {
      id: 's34a.we3',
      prompt: 'Are −3/4, (−3)/4 and 3/(−4) the same number?',
      steps: [
        { text: '(−3)/4 is a negative divided by a positive, which is negative.', reasoning: 'The integer sign rules apply to the quotient.' },
        { text: '3/(−4) is a positive divided by a negative, which is also negative.', reasoning: 'Same rules, other arrangement.' },
        { text: 'Both have size 3/4, so both equal −3/4.', reasoning: 'The sign is a property of the number, not of where it is written.' },
      ],
      answer: 'All three are the same number.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's34a.g1',
      prompt: 'Write 18/24 in lowest terms.',
      hint: 'What factor do they share?',
      answer: '3/4',
      rationale: 'Both divide by 6.',
    },
    {
      id: 's34a.g2',
      prompt: 'Why must q not be zero in p/q?',
      hint: 'What did the last lesson settle?',
      answer: 'Because division by zero has no value.',
      rationale: 'A zero denominator names nothing.',
    },
    {
      id: 's34a.g3',
      prompt: 'Is 7 a rational number?',
      hint: 'Can it be written as p/q?',
      answer: 'Yes.',
      rationale: 'It is 7/1.',
    },
  ],
  independentPractice: [
    {
      id: 's34a.i1',
      prompt: 'Compute 3/5 + (−1)/2.',
      answer: '1/10.',
      rationale: 'Common denominator 10: 6/10 added to −5/10.',
    },
    {
      id: 's34a.i2',
      prompt: 'Compute (−2)/7 times 14/3.',
      answer: '−4/3.',
      rationale: 'Multiply across and reduce; the sign is negative.',
    },
    {
      id: 's34a.i3',
      prompt: 'Give three fraction names for the number 2/3.',
      answer: '4/6, 6/9 and 10/15, among infinitely many.',
      rationale: 'Multiplying both parts by the same non-zero integer.',
    },
  ],
  reasoningApplication: [
    {
      id: 's34a.r1',
      prompt: 'Every rational has infinitely many fraction names but only one in lowest terms. Explain why that single form matters, and what would be awkward without it.',
      expectedReasoning:
        'It gives each rational one standard name, so two numbers can be compared by reducing both rather than by hunting for a shared name. Without it, deciding whether two fractions are equal would need a search rather than a calculation. A strong answer connects the standard form to decidability, and notices the proof in §3.5 relies on being able to assume lowest terms.',
    },
  ],
  interactivePractice: [],
  summary:
    'A rational number is p/q with integers p and q and q not zero, and each one has infinitely many fraction names with a single lowest-terms form. Arithmetic follows the fraction rules with integer signs, and every integer is rational, so nothing is lost by the extension.',
  nextStep:
    'Next you will place these numbers on the line and find how densely they sit.',
  teacher: {
    objective: 'Students define rationals and operate with them, including signs.',
    prerequisiteKnowledge: ['Fractions', 'Integer signs'],
    modelLanguage: ['Is that in lowest terms?', 'Why can q not be zero?'],
    teachingNotes: [
      'Tie the q-not-zero condition back to the division argument rather than stating it as a rule to recall.',
      'The three placements of the negative sign are worth doing explicitly; students treat them as three conventions.',
    ],
    quickChecks: ['Same number or different?', 'Where does the sign belong?'],
    supportForStrugglingLearners: [
      'Reduce both fractions before comparing them.',
      'Write the common denominator on its own line before adding.',
    ],
    extension: ['Ask whether every fraction name of a rational can be found from its lowest-terms form.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_3_4_DENSITY: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s3_4_density_lesson',
  contentArtifactVersion: 1,
  source: source('3.4', 'Filling the Spaces: Fractions and Rational Numbers', 6, 'ncert_iemh1_s3_4'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s3_4'],
    mayAssume: ['Rational numbers and their arithmetic', 'The number line', 'Absolute value as distance'],
    mustNotIntroduce: [{ concept: 'Irrational numbers', belongsToSection: 'ncert_iemh1_s3_5' }],
  },
  learningGoal:
    'You will place rationals on the number line, measure the distance between two as the absolute value of their difference, and establish that between any two rationals lies another.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Compare two rational numbers.', 'Find the average of two numbers.', 'Mark a fraction on a number line.'],
    ifNotReady: 'Make sure rational arithmetic is secure; density is argued with an average.',
  },
  vocabulary: [
    { term: 'density', meaning: 'The property that between any two rationals there is another rational.' },
    { term: 'distance', meaning: 'How far apart two numbers are, written |a − b|.' },
    { term: 'midpoint', meaning: 'The average of two numbers, lying halfway between them.' },
  ],
  explanation: [
    'Place rationals on the line by dividing the unit. Thirds split each unit into three, sevenths into seven. Every rational has a place, and the line starts to look crowded.',
    'Distance between two numbers is |a − b|, the size of their difference with the sign discarded. From 2 to 5 is |2 − 5| = 3, and from 5 to 2 is |5 − 2| = 3 as well. Distance has no direction, which is exactly why the absolute value is there.',
    'Now the striking property. Take any two different rationals and average them. The average is a rational, because adding two rationals and halving gives a rational, and it lies strictly between them. So between any two rationals there is another.',
    'That argument does not stop. Average again with one of the originals and you get a third, and again a fourth, without end. Between any two rationals, however close, lie infinitely many more. There is no "next" rational after a given one, which is unlike the integers where 5 is plainly followed by 6.',
    'It is tempting to conclude the rationals fill the line completely. They do not, and that is the next lesson’s business. Being dense means having no gaps between any two of them that you can name with rationals — it does not mean leaving no points unoccupied. Those are different claims, and the difference is the whole of §3.5.',
  ],
  representations: ['A unit divided into thirds and sevenths, with both marked', 'Repeated averaging producing more rationals between two close ones'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's34b.we1',
      prompt: 'Find the distance between −3/4 and 5/4.',
      steps: [
        { text: 'Distance is the absolute value of the difference.', reasoning: 'The sign is discarded because distance has no direction.' },
        { text: 'The difference is −3/4 − 5/4 = −8/4 = −2.', reasoning: 'Subtracting with a common denominator, keeping the integer sign rules.' },
        { text: 'Its absolute value is 2.', reasoning: 'Taking it the other way gives 5/4 − (−3/4) = 2 as well, which is the point of the absolute value.' },
      ],
      answer: '2.',
    },
    {
      id: 's34b.we2',
      prompt: 'Find a rational between 3/7 and 4/7.',
      steps: [
        { text: 'Average the two: add them and halve.', reasoning: 'The average of two rationals is rational and lies strictly between them.' },
        { text: '3/7 + 4/7 = 7/7 = 1, and half of 1 is 1/2.', reasoning: 'Both steps stay inside the rationals, which is what the argument needs.' },
        { text: 'Check: 3/7 is about 0.43, 1/2 is 0.5, and 4/7 is about 0.57.', reasoning: 'The value does sit between the two, confirming the construction.' },
      ],
      answer: '1/2, and averaging again gives infinitely many more.',
    },
    {
      id: 's34b.we3',
      prompt: 'Is there a rational immediately after 1/2, with none between?',
      steps: [
        { text: 'Suppose some rational r were the next one after 1/2.', reasoning: 'Assume the claim and see what follows.' },
        { text: 'Average 1/2 and r. The result is rational and lies strictly between them.', reasoning: 'The averaging argument applies to any two different rationals.' },
        { text: 'So r was not the next one after all.', reasoning: 'The assumption produces a rational it said could not exist, so no next rational exists.' },
      ],
      answer: 'No. Averaging always produces one in between, so there is no next rational.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's34b.g1',
      prompt: 'Find the distance between 1/3 and 5/3.',
      hint: 'Absolute value of the difference.',
      answer: '4/3',
      rationale: 'The difference is −4/3 or 4/3 depending on order; the size is the same.',
    },
    {
      id: 's34b.g2',
      prompt: 'Find a rational between 1/5 and 2/5.',
      hint: 'Average them.',
      answer: '3/10',
      rationale: 'Their sum is 3/5, halved.',
    },
    {
      id: 's34b.g3',
      prompt: 'How many rationals lie between 0 and 1/100?',
      hint: 'Can the averaging stop?',
      answer: 'Infinitely many.',
      rationale: 'Averaging repeats without end.',
    },
  ],
  independentPractice: [
    {
      id: 's34b.i1',
      prompt: 'Find the distance between −2/5 and 3/5.',
      answer: '1.',
      rationale: 'The difference has size 5/5.',
    },
    {
      id: 's34b.i2',
      prompt: 'Find two rationals between 1/4 and 1/3.',
      answer: '7/24 and then the average of 1/4 and 7/24, among infinitely many.',
      rationale: 'Averaging, then averaging again.',
    },
    {
      id: 's34b.i3',
      prompt: 'Explain why there is no rational immediately after 2/3.',
      answer: 'Because averaging it with any candidate gives one in between.',
      rationale: 'No candidate survives the argument.',
    },
  ],
  reasoningApplication: [
    {
      id: 's34b.r1',
      prompt: 'The rationals are dense, yet the next lesson shows they do not fill the line. Explain how both can be true, in your own words.',
      expectedReasoning:
        'Density says that between any two rationals you name there is another, which is a statement about pairs of rationals. Filling the line would mean every point is rational, which is a statement about all points — and a point can fail to be rational while still having rationals arbitrarily close on both sides. A strong answer keeps the two statements apart rather than treating density as completeness.',
    },
  ],
  interactivePractice: [],
  summary:
    'Rationals sit on the number line with distance |a − b|, and averaging two of them always gives another strictly between, so between any two lie infinitely many and there is no next rational. Being dense is not the same as filling the line.',
  nextStep:
    'Next you will meet a point on the line that no rational occupies.',
  teacher: {
    objective: 'Students use distance and establish density by averaging.',
    prerequisiteKnowledge: ['Rational arithmetic', 'The number line'],
    modelLanguage: ['Does your number lie strictly between?', 'Dense, or complete?'],
    teachingNotes: [
      'The density-is-not-completeness distinction is the most important sentence in this lesson and sets up §3.5. Say it, then say it again next lesson.',
      'Repeat the averaging three or four times on the board; the inexhaustibility is more convincing seen than asserted.',
    ],
    quickChecks: ['What is between them?', 'Can the averaging ever stop?'],
    supportForStrugglingLearners: [
      'Compute the average as a fraction before converting to a decimal.',
      'Mark each new number on a widening sketch of the interval.',
    ],
    extension: ['Ask how many rationals lie between two numbers that differ by one millionth.'],
    materialsNeeded: ['Number line', 'Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_3_5_PROOF: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s3_5_proof_lesson',
  contentArtifactVersion: 1,
  source: source('3.5', 'Irrational Numbers', 13, 'ncert_iemh1_s3_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s3_4'],
    mayAssume: ['Rational numbers in lowest terms', 'Even and odd numbers', 'Class 8 work with root 2 and non-terminating decimals'],
    mustNotIntroduce: [{ concept: 'Constructing irrational lengths, and pi', belongsToSection: 'ncert_iemh1_s3_5' }, { concept: 'Terminating and repeating decimals', belongsToSection: 'ncert_iemh1_s3_6' }],
  },
  learningGoal:
    'You will follow and reconstruct the proof by contradiction that root 2 cannot be written as a fraction, and distinguish that proof from evidence.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Write a rational in lowest terms.', 'Say what makes a number even.', 'Square a fraction.'],
    ifNotReady: 'You met root 2 in Class 8 and saw its decimal never settle; this lesson proves why it never can.',
  },
  vocabulary: [
    { term: 'irrational', meaning: 'Not expressible as p/q with integers p and q.' },
    { term: 'proof by contradiction', meaning: 'Assuming a claim, deriving an impossibility, and concluding the claim is false.' },
    { term: 'evidence', meaning: 'Observations consistent with a claim, which do not establish it.' },
  ],
  explanation: [
    'You have met root 2 before, and you have seen its decimal run on without settling into a pattern. That was evidence. A thousand digits with no repetition is suggestive and proves nothing — a pattern could begin at the next digit, or the millionth.',
    'What Class 9 adds is a proof, and the method is the thing worth learning. To show root 2 is not a fraction, assume it is and show that assumption cannot survive.',
    'Suppose root 2 = p/q with p and q integers sharing no common factor — in lowest terms, which we may always assume because every rational has such a form. Square both sides: 2 = p²/q², so p² = 2q².',
    'Then p² is even, being twice something. An odd number squared is odd, so p must be even, say p = 2k. Substituting, 4k² = 2q², so q² = 2k² and q is even by the same argument.',
    'But p and q were in lowest terms, sharing no common factor — and both have turned out even, so both are divisible by 2. That is a flat contradiction. The assumption that root 2 is a fraction leads to an impossibility, so root 2 is not a fraction. It is irrational.',
    'Notice the shape, because it is reusable: assume, derive, contradict, conclude. And notice what the proof settles that no amount of decimal expansion could. The decimal evidence said "no pattern so far"; the proof says "no fraction, ever". Those are different claims, and only one of them is established by looking.',
  ],
  representations: ['The four stages of the argument laid out as assumption, consequence, contradiction, conclusion', 'Decimal evidence beside the proof, with what each establishes'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's35a.we1',
      prompt: 'Why may the proof assume p and q share no common factor?',
      steps: [
        { text: 'Every rational can be written in lowest terms by cancelling common factors.', reasoning: 'This was established with equivalent fractions, so it costs nothing to assume.' },
        { text: 'So if root 2 were rational at all, it would have such a form.', reasoning: 'The assumption loses no cases, which is what makes it legitimate.' },
        { text: 'That shared-factor-free form is exactly what the contradiction attacks.', reasoning: 'Without it there would be nothing to contradict at the end.' },
      ],
      answer: 'Because every rational has a lowest-terms form, so assuming it excludes nothing.',
    },
    {
      id: 's35a.we2',
      prompt: 'Why does p² being even force p to be even?',
      steps: [
        { text: 'Suppose instead that p were odd, say p = 2m + 1.', reasoning: 'Testing the alternative is what rules it out.' },
        { text: 'Then p² = 4m² + 4m + 1, which is one more than a multiple of 4 and so odd.', reasoning: 'Squaring an odd number cannot produce an even result.' },
        { text: 'So an even p² cannot come from an odd p, and p must be even.', reasoning: 'The step is a small proof in its own right, not an appeal to intuition.' },
      ],
      answer: 'Because an odd number squared is odd, so an even square needs an even root.',
    },
    {
      id: 's35a.we3',
      prompt: 'A student computes root 2 to 500 decimal places, finds no repetition, and says this proves irrationality. What is wrong?',
      steps: [
        { text: 'The computation is evidence: 500 places with no repeating block.', reasoning: 'The observation is genuine as far as it goes.' },
        { text: 'But a repeating block could begin after the 500th place, or the millionth.', reasoning: 'No finite computation rules out a pattern further along.' },
        { text: 'The proof settles it because it needs no digits at all.', reasoning: 'It argues from the definition of a rational rather than from observation.' },
      ],
      answer: 'Evidence of no pattern so far is not proof of no pattern ever; only the argument settles it.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's35a.g1',
      prompt: 'What is assumed at the start of the proof?',
      hint: 'What is being shown false?',
      answer: 'That root 2 equals p/q in lowest terms.',
      rationale: 'The assumption is what the contradiction destroys.',
    },
    {
      id: 's35a.g2',
      prompt: 'What contradiction is reached?',
      hint: 'What was assumed about p and q?',
      answer: 'That p and q are both even, despite being in lowest terms.',
      rationale: 'Lowest terms means no shared factor.',
    },
    {
      id: 's35a.g3',
      prompt: 'Does a non-repeating decimal expansion prove irrationality?',
      hint: 'Could a pattern start later?',
      answer: 'Not by itself.',
      rationale: 'Only finitely many digits have been seen.',
    },
  ],
  independentPractice: [
    {
      id: 's35a.i1',
      prompt: 'State the four stages of the argument in order.',
      answer: 'Assumption, consequence, contradiction, conclusion.',
      rationale: 'The shape is reusable beyond this proof.',
    },
    {
      id: 's35a.i2',
      prompt: 'In the proof, why is q shown to be even?',
      answer: 'Because q² = 2k² makes q² even, and an even square needs an even root.',
      rationale: 'The same step as for p, applied again.',
    },
    {
      id: 's35a.i3',
      prompt: 'Explain the difference between evidence and proof here.',
      answer: 'Evidence reports what has been seen; proof establishes what must hold.',
      rationale: 'One is finite observation, the other an argument.',
    },
  ],
  reasoningApplication: [
    {
      id: 's35a.r1',
      prompt: 'The same argument can be run for root 3. Identify which step would need changing, and explain why it would not work at all for root 4.',
      expectedReasoning:
        'The evenness step becomes a divisibility-by-3 step: p² divisible by 3 forces p divisible by 3. For root 4 the argument collapses because root 4 is 2, which is 2/1 — there is no contradiction to reach, and that is correct, since the claim being proved would be false. A strong answer notices the proof must fail for rational cases or it would prove something untrue.',
    },
  ],
  interactivePractice: [],
  summary:
    'Assuming root 2 = p/q in lowest terms forces both p and q to be even, contradicting lowest terms — so root 2 is not a fraction. The shape is assumption, consequence, contradiction, conclusion, and it settles what no amount of decimal expansion could.',
  nextStep:
    'Next you will construct that length exactly on the number line.',
  teacher: {
    objective: 'Students reconstruct the contradiction proof and separate proof from evidence.',
    prerequisiteKnowledge: ['Lowest terms', 'Odd and even'],
    modelLanguage: ['What is assumed?', 'What exactly is contradicted?'],
    teachingNotes: [
      'Students have met root 2 in Class 8. Do not present irrationality as new; the PROOF is what is new here.',
      'Make them state the assumption aloud before any algebra. A contradiction proof collapses into symbol-pushing otherwise.',
      'The 500-decimal-places example is worth running; it is the commonest wrong justification students offer.',
    ],
    quickChecks: ['Which stage are you at?', 'Evidence or proof?'],
    supportForStrugglingLearners: [
      'Write the four stage names down the margin and fill each in.',
      'Prove the odd-squared-is-odd step separately before using it.',
    ],
    extension: ['Ask which step changes if the proof is run for root 5.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_3_5_CONSTRUCT: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s3_5_construct_lesson',
  contentArtifactVersion: 1,
  source: source('3.5', 'Irrational Numbers', 13, 'ncert_iemh1_s3_5'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s3_5'],
    mayAssume: ['The irrationality of root 2', 'The Pythagoras relation', 'Constructions with compasses'],
    mustNotIntroduce: [{ concept: 'Terminating and repeating decimals', belongsToSection: 'ncert_iemh1_s3_6' }],
  },
  learningGoal:
    'You will construct an irrational length exactly on the number line, and meet pi as a second irrational with no best fractional value.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Construct a perpendicular with compasses.', 'State the Pythagoras relation.', 'Say what makes a number irrational.'],
    ifNotReady: 'Make sure the previous lesson is secure; this one places the number it discussed.',
  },
  vocabulary: [
    { term: 'construction', meaning: 'Producing a length exactly with compasses and straight edge, rather than measuring it.' },
    { term: 'exact value', meaning: 'A value stated without approximation.' },
    { term: 'approximation', meaning: 'A nearby value, written with a "nearly equal" sign rather than an equals sign.' },
  ],
  explanation: [
    'Root 2 is not a fraction, so no rational point on the line is it. Yet it has a definite place, and that place can be constructed exactly.',
    'Draw the number line and erect a unit perpendicular at the point 1. The segment from 0 to the top of that perpendicular is the hypotenuse of a right triangle with both legs one unit, so by the Pythagoras relation its length squared is 1 + 1 = 2. Its length is root 2 exactly.',
    'Swing that hypotenuse down onto the line with compasses and it lands between 1 and 2. That landing point is root 2 — not an estimate placed by eye, but a length transferred without approximation. Nothing was rounded anywhere in the construction.',
    'This is worth separating from the decimal. Writing root 2 ≈ 1.414 is an approximation and should carry the "nearly equal" sign, because 1.414 squared is 1.999396, not 2. The construction gives the exact point; the decimal never does, however many places you take.',
    'Pi is a second irrational, and a familiar one: you met it as the constant ratio of circumference to diameter. It too is not a fraction, so 22/7 and 355/113 are approximations with no best one among them — a closer fraction always exists.',
    'So the line has points no rational occupies, and the rationals, dense as they are, do not fill it. Density was never completeness. The irrationals sit in the gaps that density could not see, and together with the rationals they make up the real numbers.',
  ],
  representations: ['The unit right triangle with its hypotenuse swung onto the line', 'The exact constructed point beside its decimal approximation'],
  visuals: [F_ROOT2],
  visualsById: { F_ROOT2 },
  workedExamples: [
    {
      id: 's35b.we1',
      prompt: 'Construct root 2 on the number line and explain why the point is exact.',
      steps: [
        { text: 'Mark 0 and 1, and erect a perpendicular of one unit at the point 1.', reasoning: 'Both lengths are the unit already on the line, so nothing is measured or estimated.' },
        { text: 'The segment from 0 to the top has length squared 1 + 1 = 2, by the Pythagoras relation.', reasoning: 'The relation gives the length exactly, with no rounding anywhere.' },
        { text: 'Swing that segment down onto the line with compasses.', reasoning: 'Compasses transfer a length exactly, which is why this is a construction rather than a measurement.' },
        { text: 'The landing point, between 1 and 2, is root 2.', reasoning: 'The point is determined by the construction, not placed by eye.' },
      ],
      answer: 'The point is exact because every step transfers a length rather than approximating one.',
      visualRef: 'F_ROOT2',
    },
    {
      id: 's35b.we2',
      prompt: 'Is it correct to write root 2 = 1.414?',
      steps: [
        { text: 'Square 1.414 and you get 1.999396.', reasoning: 'Checking whether the claimed equality holds.' },
        { text: 'That is not 2, so the two are not equal.', reasoning: 'An equals sign asserts exact equality, which fails here.' },
        { text: 'Write root 2 ≈ 1.414, or keep the symbol for an exact answer.', reasoning: 'The approximation sign states what is true; the symbol states it exactly.' },
      ],
      answer: 'No. It is approximately 1.414; the equals sign would be false.',
    },
    {
      id: 's35b.we3',
      prompt: 'Why does the existence of root 2 on the line show the rationals do not fill it?',
      steps: [
        { text: 'The construction produces a definite point on the line.', reasoning: 'It is a location, not a notion — it can be marked.' },
        { text: 'The previous lesson proved no fraction equals root 2.', reasoning: 'So no rational number sits at that point.' },
        { text: 'So a point of the line is occupied by no rational.', reasoning: 'Density said rationals lie between any two rationals; it never said every point was one.' },
      ],
      answer: 'Because a constructible point of the line is occupied by no rational number.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's35b.g1',
      prompt: 'What is the length of the hypotenuse of a right triangle with both legs 1 unit?',
      hint: 'Pythagoras.',
      answer: 'root 2',
      rationale: 'Its square is 1 + 1.',
    },
    {
      id: 's35b.g2',
      prompt: 'Should you write pi = 3.14?',
      hint: 'Is that exact?',
      answer: 'No, pi is approximately 3.14.',
      rationale: 'Pi is irrational, so no decimal is exact.',
    },
    {
      id: 's35b.g3',
      prompt: 'Do the rationals fill the number line?',
      hint: 'Is root 2 rational?',
      answer: 'No.',
      rationale: 'Irrational points lie between them.',
    },
  ],
  independentPractice: [
    {
      id: 's35b.i1',
      prompt: 'Describe how to construct a length of root 2 on the number line.',
      answer: 'Erect a unit perpendicular at 1 and swing the hypotenuse from 0 down to the line.',
      rationale: 'Every step transfers an exact length.',
    },
    {
      id: 's35b.i2',
      prompt: 'Write an exact value and an approximate value for the diagonal of a unit square.',
      answer: 'Exactly root 2; approximately 1.414.',
      rationale: 'One keeps the symbol, the other rounds.',
    },
    {
      id: 's35b.i3',
      prompt: 'Name two irrational numbers you have met.',
      answer: 'Root 2 and pi.',
      rationale: 'Neither is expressible as a fraction.',
    },
  ],
  reasoningApplication: [
    {
      id: 's35b.r1',
      prompt: 'The construction gives root 2 exactly while no decimal does. Explain what the construction has that the decimal lacks, and whether a longer decimal would ever close the gap.',
      expectedReasoning:
        'The construction transfers a length determined by the Pythagoras relation, so nothing is rounded at any stage, while every decimal truncates an expansion that never terminates. A longer decimal gets closer and never arrives, because arriving would make the number rational. A strong answer ties the permanence of the gap to the irrationality proof rather than to practical precision.',
    },
  ],
  interactivePractice: [],
  summary:
    'An irrational length can be constructed exactly on the number line by swinging the hypotenuse of a unit right triangle, so root 2 has a definite place no rational occupies. Pi is a second irrational, and decimals for either are approximations, never equalities — so the dense rationals do not fill the line.',
  nextStep:
    'Next you will see which numbers give terminating or repeating decimals, and which never settle.',
  teacher: {
    objective: 'Students construct an irrational length and keep exact and approximate values apart.',
    prerequisiteKnowledge: ['Pythagoras', 'Constructions', 'Irrationality'],
    modelLanguage: ['Exact or approximate?', 'What makes the point exact?'],
    teachingNotes: [
      'Do the construction with compasses, not by marking 1.41 on a ruler. The whole point is that nothing is measured.',
      'Insist on the approximation sign in writing. Students write equals and lose the distinction the lesson is about.',
    ],
    quickChecks: ['Which sign belongs here?', 'Did any step round anything?'],
    supportForStrugglingLearners: [
      'Construct on squared paper with the unit clearly fixed first.',
      'Write exact answers with the symbol, approximations with the nearly-equal sign.',
    ],
    extension: ['Ask how to construct root 3 on the line.'],
    materialsNeeded: ['Compasses', 'Ruler', 'Squared paper'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_3_6_DECIMALS: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s3_6_decimals_lesson',
  contentArtifactVersion: 1,
  source: source('3.6', 'Real Numbers: Decimals and Cyclic Patterns', 17, 'ncert_iemh1_s3_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s3_5'],
    mayAssume: ['Rational numbers as p/q', 'Long division', 'Irrational numbers and their decimals'],
    mustNotIntroduce: [{ concept: 'Cyclic numbers and non-repeating decimals', belongsToSection: 'ncert_iemh1_s3_6' }],
  },
  learningGoal:
    'You will connect rational numbers to terminating or repeating decimals, explain the repetition through long-division remainders, and convert a repeating decimal back to p/q.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Divide one whole number by another by long division.', 'Write a fraction as a decimal.', 'Solve a simple linear equation.'],
    ifNotReady: 'Make sure long division is fluent; the explanation of repetition comes straight from its remainders.',
  },
  vocabulary: [
    { term: 'terminating decimal', meaning: 'One that stops, such as 0.75.' },
    { term: 'repeating decimal', meaning: 'One where a block of digits recurs for ever, such as 0.272727...' },
    { term: 'remainder', meaning: 'What is left at each stage of a long division.' },
  ],
  explanation: [
    'Divide 3 by 4 and the decimal stops at 0.75. Divide 3 by 11 and it runs on as 0.272727..., repeating the block 27 for ever. Both come from rationals, and between them they cover every case.',
    'Why it must be one or the other comes from the long division itself. Dividing by 11, the only possible remainders are 0 through 10 — eleven values. If a remainder is ever 0 the division stops. If not, after at most eleven steps some remainder must repeat, because there are only so many to go round.',
    'Once a remainder repeats, everything after it repeats too: the same remainder produces the same next digit and the same next remainder, for ever. The repeating block can be no longer than q − 1 digits, and for 1/11 it is 2.',
    'So every rational gives a decimal that terminates or repeats. There is no third behaviour available, and that is a consequence of there being finitely many possible remainders rather than an observation about examples.',
    'The conversion back works by exploiting the repetition. Let x = 0.272727... The block has length 2, so multiply by 100: 100x = 27.272727... Subtract the first from the second and the infinite tails cancel exactly, leaving 99x = 27, so x = 27/99 = 3/11.',
    'That subtraction is the whole trick, and it works because the tails are identical. Multiplying by the right power of ten — ten to the length of the block — is what lines them up.',
  ],
  representations: ['A long division with its remainders listed until one repeats', 'The multiply-and-subtract conversion with the tails cancelling'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's36a.we1',
      prompt: 'Convert 0.272727... to a fraction.',
      steps: [
        { text: 'Let x = 0.272727..., with a repeating block of length 2.', reasoning: 'Naming the number lets it be operated on.' },
        { text: 'Multiply by 100, since the block has length 2: 100x = 27.272727...', reasoning: 'The power of ten matches the block length, which is what aligns the tails.' },
        { text: 'Subtract: 100x − x = 27.272727... − 0.272727..., and the tails cancel exactly.', reasoning: 'The two tails are identical, which is why the infinite part disappears.' },
        { text: 'So 99x = 27, giving x = 27/99 = 3/11.', reasoning: 'Reducing to lowest terms gives the standard name.' },
      ],
      answer: '3/11.',
    },
    {
      id: 's36a.we2',
      prompt: 'Why must the decimal for 1/7 repeat within six digits?',
      steps: [
        { text: 'Dividing by 7, the possible remainders are 0 through 6.', reasoning: 'There are only seven values a remainder can take.' },
        { text: 'If a remainder is 0 the division terminates, which it does not here.', reasoning: 'So the remainders run among the six non-zero values.' },
        { text: 'Among six values, one must repeat within six steps.', reasoning: 'There are more steps than available values, so a repeat is forced.' },
        { text: 'Once a remainder repeats, the digits after it repeat too.', reasoning: 'The same remainder always produces the same next digit and next remainder.' },
      ],
      answer: 'Because only six non-zero remainders exist, so one must recur within six steps.',
    },
    {
      id: 's36a.we3',
      prompt: 'Convert 0.5222... — where only the 2 repeats — to a fraction.',
      steps: [
        { text: 'Let x = 0.5222... The repeating part starts after one non-repeating digit.', reasoning: 'The method must first shift past the non-repeating part.' },
        { text: 'Multiply by 10 to move past it: 10x = 5.222...', reasoning: 'Now the repetition begins immediately after the point.' },
        { text: 'Multiply by 10 again for the block of length 1: 100x = 52.222...', reasoning: 'One more factor of ten per repeating digit.' },
        { text: 'Subtract: 90x = 47, so x = 47/90.', reasoning: 'The identical tails cancel, as before.' },
      ],
      answer: '47/90.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's36a.g1',
      prompt: 'Does 3/8 give a terminating or repeating decimal?',
      hint: 'Divide and see.',
      answer: 'Terminating, 0.375.',
      rationale: 'The division reaches a remainder of 0.',
    },
    {
      id: 's36a.g2',
      prompt: 'What are the possible remainders when dividing by 9?',
      hint: 'How many values below 9?',
      answer: '0 through 8.',
      rationale: 'Nine values, so a repeat is forced within nine steps.',
    },
    {
      id: 's36a.g3',
      prompt: 'Convert 0.333... to a fraction.',
      hint: 'Multiply by 10 and subtract.',
      answer: '1/3',
      rationale: '9x = 3.',
    },
  ],
  independentPractice: [
    {
      id: 's36a.i1',
      prompt: 'Convert 0.818181... to a fraction.',
      answer: '9/11.',
      rationale: 'Multiply by 100; 99x = 81.',
    },
    {
      id: 's36a.i2',
      prompt: 'Explain why every rational gives a terminating or repeating decimal.',
      answer: 'Because only finitely many remainders are possible, so one must repeat or reach zero.',
      rationale: 'There is no third behaviour available.',
    },
    {
      id: 's36a.i3',
      prompt: 'Convert 0.1666... to a fraction.',
      answer: '1/6.',
      rationale: 'Shift past the non-repeating 1, then subtract.',
    },
  ],
  reasoningApplication: [
    {
      id: 's36a.r1',
      prompt: 'The repeating block for 1/7 has length 6, and for 1/11 it has length 2. Explain what sets an upper limit on the block length, and whether that limit is always reached.',
      expectedReasoning:
        'The limit is q − 1, since there are only that many non-zero remainders before one must recur. It is not always reached: 1/11 could have had a block of up to 10 and has 2, because a remainder recurred early. A strong answer separates the bound forced by counting from the actual length, which depends on the particular divisor.',
    },
  ],
  interactivePractice: [],
  summary:
    'Every rational gives a decimal that terminates or repeats, because a long division has only finitely many possible remainders and must either reach zero or repeat one. Multiplying by ten to the power of the block length and subtracting cancels the identical tails and recovers p/q.',
  nextStep:
    'Next you will look at the repeating block more closely, and at decimals that never repeat at all.',
  teacher: {
    objective: 'Students connect rationals to decimal behaviour and convert back.',
    prerequisiteKnowledge: ['Long division', 'Linear equations'],
    modelLanguage: ['How many remainders are possible?', 'What is the block length?'],
    teachingNotes: [
      'Run a long division and list the remainders in a column until one recurs. The forced repetition is then visible rather than asserted.',
      'The non-repeating-prefix case is where students slip; do 0.5222... explicitly.',
    ],
    quickChecks: ['Which power of ten?', 'Do the tails line up?'],
    supportForStrugglingLearners: [
      'List remainders down a column beside the division.',
      'Count the repeating block before choosing the multiplier.',
    ],
    extension: ['Ask which denominators give terminating decimals, and why.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

export const SECTION_3_6_CYCLIC: AuthoredSection = {
  contentArtifactId: 'ncert_iemh1_s3_6_cyclic_lesson',
  contentArtifactVersion: 1,
  source: source('3.6', 'Real Numbers: Decimals and Cyclic Patterns', 17, 'ncert_iemh1_s3_6'),
  competencyCandidates: [],
  competencyMappingStatus: 'competency_mapping_pending',
  sequence: {
    prerequisiteSectionIds: ['ncert_iemh1_s3_6'],
    mayAssume: ['Terminating and repeating decimals', 'The irrationality of root 2', 'Multiplying a whole number'],
    mustNotIntroduce: [],
  },
  learningGoal:
    'You will explore the cyclic behaviour of a repeating block and contrast it with decimals that never repeat, completing the real number line.',
  priorKnowledgeCheck: {
    prompt: 'Before you start, check that you can:',
    checks: ['Convert a fraction to a repeating decimal.', 'Multiply a six-digit number by a single digit.', 'Say what makes a number irrational.'],
    ifNotReady: 'Make sure the previous lesson is secure; this one looks closely at the blocks it produced.',
  },
  vocabulary: [
    { term: 'cyclic number', meaning: 'One whose multiples are rotations of its own digits.' },
    { term: 'non-repeating decimal', meaning: 'One that never settles into a recurring block.' },
    { term: 'real numbers', meaning: 'The rationals and irrationals together, filling the line.' },
  ],
  explanation: [
    'The repeating block of 1/7 is 142857, and it behaves remarkably. Multiply it by 2 and you get 285714 — the same six digits, rotated. By 3 gives 428571. By 4, 5 and 6 give further rotations, every time.',
    'The reason is in the long division. Computing 2/7, 3/7 and the rest produces the same cycle of remainders as 1/7, entered at a different point. Each fraction starts the same loop somewhere else around it, so the digits come out rotated rather than rearranged.',
    'That pattern is a property of the number 7 rather than a coincidence of digits, and not every denominator does it. It is worth exploring and it is not the chapter’s main point.',
    'The main point is the contrast. A repeating decimal, however long its block, eventually settles into a loop. The decimal for root 2 does not — and from the proof in §3.5 you know it cannot, because a repeating decimal can always be converted back to p/q by the multiply-and-subtract method, and root 2 is not p/q.',
    'That gives a clean two-way test rather than a guess. A number is rational exactly when its decimal terminates or repeats; irrational exactly when it does not. Non-terminating alone is not enough — 1/3 goes on for ever and is perfectly rational. The question is whether it repeats.',
    'Put the two kinds together and the line is complete. Rationals fill in densely but leave points uncovered; irrationals occupy those points. Together they are the real numbers, and every point on the line is one of them.',
  ],
  representations: ['The six rotations of 142857 beside their fractions', 'A repeating decimal and a non-repeating one set against each other'],
  visuals: [],
  visualsById: {  },
  workedExamples: [
    {
      id: 's36b.we1',
      prompt: 'Compute 2 times 142857 and 3 times 142857, and say what you notice.',
      steps: [
        { text: '2 times 142857 is 285714.', reasoning: 'The same six digits in a different order.' },
        { text: '3 times 142857 is 428571.', reasoning: 'Again the same digits, rotated to a different starting point.' },
        { text: 'Both are rotations of the original block, and both are the repeating blocks of 2/7 and 3/7.', reasoning: 'The long division for each enters the same remainder cycle at a different point.' },
      ],
      answer: 'Both are rotations of 142857, matching the blocks of 2/7 and 3/7.',
    },
    {
      id: 's36b.we2',
      prompt: 'Is 0.101001000100001... rational, where the gaps of zeros keep growing?',
      steps: [
        { text: 'The digits follow a describable rule, so there is a pattern of a kind.', reasoning: 'A rule is not the same as a repeating block.' },
        { text: 'But no fixed block recurs, since each gap of zeros is longer than the last.', reasoning: 'Repetition requires one block that comes round again unchanged.' },
        { text: 'So the decimal neither terminates nor repeats, and the number is irrational.', reasoning: 'The two-way test settles it without needing a contradiction proof.' },
      ],
      answer: 'Irrational — it has a rule but no repeating block.',
    },
    {
      id: 's36b.we3',
      prompt: 'A student says any non-terminating decimal is irrational. Give a counterexample and correct the statement.',
      steps: [
        { text: 'Take 1/3 = 0.333..., which is non-terminating.', reasoning: 'A single case is enough to refute a universal claim.' },
        { text: 'It is plainly rational, being 1/3.', reasoning: 'So non-terminating does not imply irrational.' },
        { text: 'The correct test is whether it terminates or repeats.', reasoning: 'Repeating matters; merely going on for ever does not.' },
      ],
      answer: '1/3 refutes it. Irrational means non-terminating AND non-repeating.',
    },
  ],
  misconceptionIds: [],
  guidedPractice: [
    {
      id: 's36b.g1',
      prompt: 'What is the repeating block of 1/7?',
      hint: 'Divide and read the cycle.',
      answer: '142857',
      rationale: 'Six digits, the maximum for a denominator of 7.',
    },
    {
      id: 's36b.g2',
      prompt: 'Is 0.4545... rational?',
      hint: 'Does a block repeat?',
      answer: 'Yes.',
      rationale: 'A repeating block converts back to a fraction.',
    },
    {
      id: 's36b.g3',
      prompt: 'What are the real numbers?',
      hint: 'Which two kinds together?',
      answer: 'The rationals and irrationals together.',
      rationale: 'Between them they fill the line.',
    },
  ],
  independentPractice: [
    {
      id: 's36b.i1',
      prompt: 'Compute 4 times 142857 and say which fraction has that block.',
      answer: '571428, the block of 4/7.',
      rationale: 'A rotation of the same cycle.',
    },
    {
      id: 's36b.i2',
      prompt: 'Classify 0.121212... and 0.1213141516... and justify each.',
      answer: 'The first is rational; the second is irrational.',
      rationale: 'One repeats a block; the other never does.',
    },
    {
      id: 's36b.i3',
      prompt: 'State the two-way test for rationality from a decimal.',
      answer: 'Rational exactly when it terminates or repeats; irrational otherwise.',
      rationale: 'Non-terminating alone is not enough.',
    },
  ],
  reasoningApplication: [
    {
      id: 's36b.r1',
      prompt: 'Both 0.333... and the decimal for root 2 go on for ever, yet one is rational. Explain what distinguishes them, and why the distinction is not merely about how far you have looked.',
      expectedReasoning:
        'One settles into a repeating block, which the multiply-and-subtract method converts back to a fraction; the other never does, and the §3.5 proof shows it never can. The distinction is not about looking further because the proof covers every digit at once, while inspection only ever covers finitely many. A strong answer ties the test back to the conversion method rather than treating it as a classification rule.',
    },
  ],
  interactivePractice: [],
  summary:
    'The repeating block of 1/7 rotates through its multiples because each fraction enters the same remainder cycle at a different point. A number is rational exactly when its decimal terminates or repeats — non-terminating alone is not enough — and the rationals with the irrationals together are the real numbers, filling the line.',
  nextStep:
    'That completes the chapter’s authored units.',
  teacher: {
    objective: 'Students explore cyclic blocks and apply the two-way rationality test.',
    prerequisiteKnowledge: ['Repeating decimals', 'Irrationality'],
    modelLanguage: ['Does a block repeat?', 'Rule, or repetition?'],
    teachingNotes: [
      'The 1/7 rotations are a genuine delight and should be computed by hand once, but keep them subordinate to the contrast they set up.',
      'The non-terminating-equals-irrational error is extremely common. Meet it head on with 1/3.',
    ],
    quickChecks: ['Which test applies?', 'Has a block actually recurred?'],
    supportForStrugglingLearners: [
      'Compute the multiples of 142857 by hand before comparing them.',
      'Underline the repeating block before classifying.',
    ],
    extension: ['Ask which denominators produce a full-length cycle like 7 does.'],
    materialsNeeded: ['Exercise book'],
  },
  reviewStatus: 'authored_draft',
};

/** Chapter 3, in the book's order — EIGHT lessons from nine units.
 *
 *  §3.1 is deliberately absent. Its unit remains READY in structure and
 *  blocked by `historical_material_lesson_vs_context`, and its mathematics
 *  is not absorbed into §3.2 to make the chapter look complete. */
export function numbersChapterSections(): AuthoredSection[] {
  return [
    SECTION_3_2,
    SECTION_3_3,
    SECTION_3_4_ARITH,
    SECTION_3_4_DENSITY,
    SECTION_3_5_PROOF,
    SECTION_3_5_CONSTRUCT,
    SECTION_3_6_DECIMALS,
    SECTION_3_6_CYCLIC,
  ];
}
