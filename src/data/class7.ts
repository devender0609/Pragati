// v0.23: Class 7 Math Starter content (3 modules × 3 skills × 8 items = 72 items).
//
// IMPORTANT: this is starter content for a prototype, NOT a published
// curriculum. Every item, lesson, and alignment row carries
// `alignmentConfidence: 'needs_teacher_review'` so the teacher dashboard
// surfaces them as such — CBSE/NCERT-informed prototype, teacher review
// required, pre-pilot.

import type { Item } from './items';
import type { Lesson } from './lessons';
import type { SkillAlignment, SkillId } from '../types';

// ---------------------------------------------------------------------------
// Items (72)
// ---------------------------------------------------------------------------
//
// Each module has 3 skills × 8 items = 24 items, distributed roughly:
//   - 2 foundational (difficulty 2-3)
//   - 4 core (difficulty 4-6)
//   - 2 advanced (difficulty 7-8)
//
// Misconception codes are reused from the existing Class 6 taxonomy
// (operation_confusion, conceptual_gap, arithmetic_slip, form_error)
// so the per-distractor diagnostic still rolls up correctly.

export const CLASS7_ITEMS: Item[] = [
  // =========================================================================
  // IR.01 — Add and subtract integers
  // =========================================================================
  {
    id: 'IR.01-01', skillId: 'IR.01', skillName: 'Add and subtract integers',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: (-3) + 5', inputHint: 'Enter a whole number (use - for negative).',
    acceptedAnswers: ['2'],
    errorPatterns: [
      { answers: ['-2'], misconception: 'operation_confusion' },
      { answers: ['8'], misconception: 'operation_confusion' },
      { answers: ['-8'], misconception: 'conceptual_gap' },
    ],
    solution: 'Adding a positive to a negative is the same as subtracting their magnitudes and keeping the sign of the larger magnitude. |5| > |-3|, so the answer is +(5−3) = +2.',
    estimatedTimeSec: 25,
  },
  {
    id: 'IR.01-02', skillId: 'IR.01', skillName: 'Add and subtract integers',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: (-7) + (-4)', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-11'],
    errorPatterns: [
      { answers: ['11'], misconception: 'conceptual_gap' },
      { answers: ['-3'], misconception: 'operation_confusion' },
      { answers: ['3'], misconception: 'operation_confusion' },
    ],
    solution: 'Two negatives add together: -7 + -4 = -(7 + 4) = -11.',
    estimatedTimeSec: 25,
  },
  {
    id: 'IR.01-03', skillId: 'IR.01', skillName: 'Add and subtract integers',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 6 - (-9)', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['15'],
    errorPatterns: [
      { answers: ['-3'], misconception: 'operation_confusion' },
      { answers: ['-15'], misconception: 'conceptual_gap' },
      { answers: ['3'], misconception: 'operation_confusion' },
    ],
    solution: 'Subtracting a negative is the same as adding the positive: 6 - (-9) = 6 + 9 = 15.',
    estimatedTimeSec: 30,
  },
  {
    id: 'IR.01-04', skillId: 'IR.01', skillName: 'Add and subtract integers',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which expression equals -2?',
    options: [
      { text: '(-5) + 3', misconception: 'none' },
      { text: '(-5) - 3', misconception: 'operation_confusion' },
      { text: '5 - 3', misconception: 'conceptual_gap' },
      { text: '5 + (-3)', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '(-5) + 3 = -(5-3) = -2. The other options compute to -8, +2, +2 respectively.',
    estimatedTimeSec: 35,
  },
  {
    id: 'IR.01-05', skillId: 'IR.01', skillName: 'Add and subtract integers',
    difficulty: 5, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'Compute: (-12) - (-5) + 3', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-4'],
    errorPatterns: [
      { answers: ['-20'], misconception: 'operation_confusion' },
      { answers: ['4'], misconception: 'arithmetic_slip' },
      { answers: ['-10'], misconception: 'operation_confusion' },
    ],
    solution: 'Left to right: -12 - (-5) = -12 + 5 = -7, then -7 + 3 = -4.',
    estimatedTimeSec: 45,
  },
  {
    id: 'IR.01-06', skillId: 'IR.01', skillName: 'Add and subtract integers',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A diver is at -18 m (18 m below sea level). She rises 11 m, then descends 4 m. What is her new depth, as a signed integer?',
    inputHint: 'Enter a signed integer (negative = below sea level).',
    acceptedAnswers: ['-11'],
    errorPatterns: [
      { answers: ['11'], misconception: 'conceptual_gap' },
      { answers: ['-3'], misconception: 'arithmetic_slip' },
      { answers: ['-25'], misconception: 'operation_confusion' },
    ],
    solution: 'Start at -18. Rise 11: -18 + 11 = -7. Descend 4: -7 - 4 = -11.',
    estimatedTimeSec: 50,
  },
  {
    id: 'IR.01-07', skillId: 'IR.01', skillName: 'Add and subtract integers',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'The temperature in Shimla was -3°C at 6 am. By noon it had risen 9°C. By 8 pm it had fallen 12°C. What was the temperature at 8 pm?',
    inputHint: 'Enter a signed integer (temperature in °C).',
    acceptedAnswers: ['-6'],
    errorPatterns: [
      { answers: ['6'], misconception: 'conceptual_gap' },
      { answers: ['-24'], misconception: 'operation_confusion' },
      { answers: ['18'], misconception: 'arithmetic_slip' },
    ],
    solution: 'At 6 am: -3. At noon: -3 + 9 = 6. At 8 pm: 6 - 12 = -6.',
    estimatedTimeSec: 60,
  },
  {
    id: 'IR.01-08', skillId: 'IR.01', skillName: 'Add and subtract integers',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which statement about subtracting integers is TRUE?',
    options: [
      { text: 'Subtracting a negative always gives a smaller result.', misconception: 'conceptual_gap' },
      { text: 'a - b is always negative when b > 0.', misconception: 'conceptual_gap' },
      { text: 'a - b = a + (-b), for all integers a, b.', misconception: 'none' },
      { text: 'a - b = b - a, for all integers a, b.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'Subtraction is defined as adding the additive inverse: a - b = a + (-b). This is the foundational rule for integer subtraction.',
    estimatedTimeSec: 60,
  },

  // =========================================================================
  // IR.02 — Multiply and divide integers
  // =========================================================================
  {
    id: 'IR.02-01', skillId: 'IR.02', skillName: 'Multiply and divide integers',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: (-4) × 3', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-12'],
    errorPatterns: [
      { answers: ['12'], misconception: 'conceptual_gap' },
      { answers: ['-7'], misconception: 'operation_confusion' },
      { answers: ['7'], misconception: 'operation_confusion' },
    ],
    solution: 'Negative × positive = negative. |-4| × |3| = 12, so the answer is -12.',
    estimatedTimeSec: 25,
  },
  {
    id: 'IR.02-02', skillId: 'IR.02', skillName: 'Multiply and divide integers',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: (-5) × (-6)', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['30'],
    errorPatterns: [
      { answers: ['-30'], misconception: 'conceptual_gap' },
      { answers: ['-11'], misconception: 'operation_confusion' },
      { answers: ['11'], misconception: 'operation_confusion' },
    ],
    solution: 'Negative × negative = positive. 5 × 6 = 30, so the answer is +30.',
    estimatedTimeSec: 25,
  },
  {
    id: 'IR.02-03', skillId: 'IR.02', skillName: 'Multiply and divide integers',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 36 ÷ (-9)', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-4'],
    errorPatterns: [
      { answers: ['4'], misconception: 'conceptual_gap' },
      { answers: ['-3'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Positive ÷ negative = negative. 36 ÷ 9 = 4, so the answer is -4.',
    estimatedTimeSec: 25,
  },
  {
    id: 'IR.02-04', skillId: 'IR.02', skillName: 'Multiply and divide integers',
    difficulty: 4, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which product is POSITIVE?',
    options: [
      { text: '(-2) × (-3) × (-4)', misconception: 'conceptual_gap' },
      { text: '(-2) × 3 × 4', misconception: 'conceptual_gap' },
      { text: '(-2) × (-3) × 4', misconception: 'none' },
      { text: '2 × (-3) × 4', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'An EVEN number of negative factors gives a positive product. Option C has two negatives → positive. The others have 3, 1, 1 negatives respectively.',
    estimatedTimeSec: 45,
  },
  {
    id: 'IR.02-05', skillId: 'IR.02', skillName: 'Multiply and divide integers',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: (-8) × (-3) ÷ 4', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['6'],
    errorPatterns: [
      { answers: ['-6'], misconception: 'conceptual_gap' },
      { answers: ['-2'], misconception: 'operation_confusion' },
    ],
    solution: 'Left to right: -8 × -3 = 24 (negative × negative = positive), then 24 ÷ 4 = 6.',
    estimatedTimeSec: 40,
  },
  {
    id: 'IR.02-06', skillId: 'IR.02', skillName: 'Multiply and divide integers',
    difficulty: 6, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A submarine descends 5 m every minute. What is its depth, as a signed integer, after 7 minutes (starting at sea level)?',
    inputHint: 'Enter a signed integer (negative = below sea level).',
    acceptedAnswers: ['-35'],
    errorPatterns: [
      { answers: ['35'], misconception: 'conceptual_gap' },
      { answers: ['-12'], misconception: 'operation_confusion' },
    ],
    solution: 'Each minute the depth changes by -5 m. After 7 minutes: 7 × (-5) = -35.',
    estimatedTimeSec: 45,
  },
  {
    id: 'IR.02-07', skillId: 'IR.02', skillName: 'Multiply and divide integers',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'For non-zero integers a and b, when is (-a) ÷ (-b) NEGATIVE?',
    options: [
      { text: 'Always — two negatives make a negative.', misconception: 'conceptual_gap' },
      { text: 'Never — negative ÷ negative = positive.', misconception: 'none' },
      { text: 'Only when |a| > |b|.', misconception: 'conceptual_gap' },
      { text: 'Only when a = b.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '(-a) ÷ (-b) = (a ÷ b) by the sign rule for division. Two negatives in a quotient always give a positive (when neither is zero).',
    estimatedTimeSec: 60,
  },
  {
    id: 'IR.02-08', skillId: 'IR.02', skillName: 'Multiply and divide integers',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A company loses ₹240 each week. If the loss continues for 6 weeks, what is the total change in the bank balance, as a signed integer in rupees?',
    inputHint: 'Enter a signed integer (negative = loss).',
    acceptedAnswers: ['-1440'],
    errorPatterns: [
      { answers: ['1440'], misconception: 'conceptual_gap' },
      { answers: ['-246'], misconception: 'operation_confusion' },
    ],
    solution: 'Loss is negative: each week is -240. Six weeks → 6 × (-240) = -1440.',
    estimatedTimeSec: 50,
  },

  // =========================================================================
  // IR.03 — Introduction to rational numbers
  // =========================================================================
  {
    id: 'IR.03-01', skillId: 'IR.03', skillName: 'Introduction to rational numbers',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'A rational number is a number that can be written as p/q where:',
    options: [
      { text: 'p and q are any numbers.', misconception: 'conceptual_gap' },
      { text: 'p is an integer and q is a non-zero integer.', misconception: 'none' },
      { text: 'p and q are positive integers.', misconception: 'conceptual_gap' },
      { text: 'p and q are decimals.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'A rational number is any number expressible as p/q with p ∈ ℤ and q ∈ ℤ, q ≠ 0. So -3/4, 5/1, and 0/2 are all rational; 1/0 is not.',
    estimatedTimeSec: 35,
  },
  {
    id: 'IR.03-02', skillId: 'IR.03', skillName: 'Introduction to rational numbers',
    difficulty: 3, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which of these is NOT a rational number?',
    options: [
      { text: '-7', misconception: 'conceptual_gap' },
      { text: '0', misconception: 'conceptual_gap' },
      { text: '0.5', misconception: 'conceptual_gap' },
      { text: '5 ÷ 0', misconception: 'none' },
    ],
    correctIndex: 3,
    solution: 'Division by zero is undefined, so 5/0 is not a rational number (nor any kind of number). The other three can all be written as p/q with q ≠ 0: -7/1, 0/1, 1/2.',
    estimatedTimeSec: 35,
  },
  {
    id: 'IR.03-03', skillId: 'IR.03', skillName: 'Introduction to rational numbers',
    difficulty: 4, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'Write -2/5 in standard form (denominator positive, lowest terms). What is the numerator?',
    inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-2'],
    errorPatterns: [
      { answers: ['2'], misconception: 'conceptual_gap' },
      { answers: ['-5'], misconception: 'operation_confusion' },
    ],
    solution: '-2/5 is already in standard form: the denominator is positive and HCF(2, 5) = 1. So the numerator is -2.',
    estimatedTimeSec: 35,
  },
  {
    id: 'IR.03-04', skillId: 'IR.03', skillName: 'Introduction to rational numbers',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which is greater?',
    options: [
      { text: '-3/4', misconception: 'conceptual_gap' },
      { text: '-2/3', misconception: 'none' },
      { text: 'Both are equal.', misconception: 'conceptual_gap' },
      { text: 'Cannot be compared.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Common denominator 12: -3/4 = -9/12, -2/3 = -8/12. On the number line, -8/12 lies to the right of -9/12, so -2/3 > -3/4.',
    estimatedTimeSec: 45,
  },
  {
    id: 'IR.03-05', skillId: 'IR.03', skillName: 'Introduction to rational numbers',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 1/2 + (-1/3). Give the answer as a fraction in lowest terms.',
    inputHint: 'Enter a fraction like 1/6 or a mixed number.',
    acceptedAnswers: ['1/6'],
    errorPatterns: [
      { answers: ['-1/6'], misconception: 'operation_confusion' },
      { answers: ['0/6'], misconception: 'arithmetic_slip' },
      { answers: ['5/6'], misconception: 'operation_confusion' },
    ],
    solution: 'Common denominator 6: 1/2 = 3/6 and -1/3 = -2/6. Sum: 3/6 + (-2/6) = 1/6.',
    estimatedTimeSec: 45,
  },
  {
    id: 'IR.03-06', skillId: 'IR.03', skillName: 'Introduction to rational numbers',
    difficulty: 6, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'How many rational numbers lie strictly between 1/4 and 1/3?',
    options: [
      { text: 'Exactly 0.', misconception: 'conceptual_gap' },
      { text: 'Exactly 1.', misconception: 'conceptual_gap' },
      { text: 'Exactly 11 (the difference of denominators).', misconception: 'conceptual_gap' },
      { text: 'Infinitely many.', misconception: 'none' },
    ],
    correctIndex: 3,
    solution: 'Between any two distinct rational numbers there are infinitely many other rationals (the rationals are dense). For example, the average (7/24) is between them; halving again gives another, and so on.',
    estimatedTimeSec: 60,
  },
  {
    id: 'IR.03-07', skillId: 'IR.03', skillName: 'Introduction to rational numbers',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: -3/4 - (-1/2). Give the answer as a fraction in lowest terms.',
    inputHint: 'Enter a fraction like -1/4 (use - for negative).',
    acceptedAnswers: ['-1/4'],
    errorPatterns: [
      { answers: ['1/4'], misconception: 'conceptual_gap' },
      { answers: ['-5/4'], misconception: 'operation_confusion' },
    ],
    solution: '-3/4 - (-1/2) = -3/4 + 1/2 = -3/4 + 2/4 = -1/4.',
    estimatedTimeSec: 55,
  },
  {
    id: 'IR.03-08', skillId: 'IR.03', skillName: 'Introduction to rational numbers',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A point P on the number line is at 2/3. Another point Q is at -1/4. What is the distance (always non-negative) between P and Q, as a fraction in lowest terms?',
    inputHint: 'Enter a fraction like 11/12.',
    acceptedAnswers: ['11/12'],
    errorPatterns: [
      { answers: ['-11/12'], misconception: 'conceptual_gap' },
      { answers: ['5/12'], misconception: 'operation_confusion' },
    ],
    solution: 'Distance = |2/3 - (-1/4)| = |2/3 + 1/4| = |8/12 + 3/12| = 11/12.',
    estimatedTimeSec: 60,
  },

  // =========================================================================
  // FE.01 — Multiply and divide fractions
  // =========================================================================
  {
    id: 'FE.01-01', skillId: 'FE.01', skillName: 'Multiply and divide fractions',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 2/3 × 4. Give the answer as a fraction or mixed number in lowest terms.',
    inputHint: 'Enter as 8/3 or 2 2/3.',
    acceptedAnswers: ['8/3', '2 2/3'],
    errorPatterns: [
      { answers: ['2/12'], misconception: 'operation_confusion' },
      { answers: ['6/3'], misconception: 'arithmetic_slip' },
    ],
    solution: 'A whole number times a fraction multiplies the numerator only: 2/3 × 4 = (2 × 4)/3 = 8/3 = 2 2/3.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FE.01-02', skillId: 'FE.01', skillName: 'Multiply and divide fractions',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 1/2 × 3/4. Give the answer as a fraction in lowest terms.',
    inputHint: 'Enter as 3/8.',
    acceptedAnswers: ['3/8'],
    errorPatterns: [
      { answers: ['4/6'], misconception: 'operation_confusion' },
      { answers: ['1/8'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Multiply numerators and denominators: (1 × 3)/(2 × 4) = 3/8. HCF(3, 8) = 1, so it is already in lowest terms.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FE.01-03', skillId: 'FE.01', skillName: 'Multiply and divide fractions',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 2/3 ÷ 4/5. Give the answer as a fraction in lowest terms.',
    inputHint: 'Enter as 5/6.',
    acceptedAnswers: ['5/6'],
    errorPatterns: [
      { answers: ['8/15'], misconception: 'operation_confusion' },
      { answers: ['10/12'], misconception: 'form_error' },
    ],
    solution: 'Dividing by a fraction = multiplying by its reciprocal: 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.',
    estimatedTimeSec: 40,
  },
  {
    id: 'FE.01-04', skillId: 'FE.01', skillName: 'Multiply and divide fractions',
    difficulty: 5, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which expression is equivalent to 3/4 ÷ 2?',
    options: [
      { text: '3/4 × 2', misconception: 'operation_confusion' },
      { text: '3/4 × 1/2', misconception: 'none' },
      { text: '3 × 2/4', misconception: 'conceptual_gap' },
      { text: '6/4', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Dividing by 2 is the same as multiplying by its reciprocal 1/2. So 3/4 ÷ 2 = 3/4 × 1/2 = 3/8.',
    estimatedTimeSec: 40,
  },
  {
    id: 'FE.01-05', skillId: 'FE.01', skillName: 'Multiply and divide fractions',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A glass holds 1/4 L of water. How many glasses can be filled from a 3 L jug?',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['12'],
    errorPatterns: [
      { answers: ['3'], misconception: 'operation_confusion' },
      { answers: ['4'], misconception: 'operation_confusion' },
    ],
    solution: '3 ÷ 1/4 = 3 × 4/1 = 12. The jug fills 12 glasses.',
    estimatedTimeSec: 40,
  },
  {
    id: 'FE.01-06', skillId: 'FE.01', skillName: 'Multiply and divide fractions',
    difficulty: 6, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 2 1/3 × 3/7. Give the answer as a fraction or mixed number in lowest terms.',
    inputHint: 'Enter as 1.',
    acceptedAnswers: ['1', '1/1', '7/7'],
    errorPatterns: [
      { answers: ['6/21'], misconception: 'form_error' },
      { answers: ['2/7'], misconception: 'operation_confusion' },
    ],
    solution: 'Convert the mixed number first: 2 1/3 = 7/3. Then 7/3 × 3/7 = 21/21 = 1.',
    estimatedTimeSec: 50,
  },
  {
    id: 'FE.01-07', skillId: 'FE.01', skillName: 'Multiply and divide fractions',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A recipe needs 2/3 cup of sugar for one cake. How many cups are needed for 5 cakes? Give the answer as a fraction or mixed number in lowest terms.',
    inputHint: 'Enter as 10/3 or 3 1/3.',
    acceptedAnswers: ['10/3', '3 1/3'],
    errorPatterns: [
      { answers: ['2/15'], misconception: 'operation_confusion' },
      { answers: ['7/3'], misconception: 'arithmetic_slip' },
    ],
    solution: '2/3 × 5 = 10/3 = 3 1/3 cups.',
    estimatedTimeSec: 50,
  },
  {
    id: 'FE.01-08', skillId: 'FE.01', skillName: 'Multiply and divide fractions',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A 9 1/2 m ribbon is cut into pieces 1 1/4 m long. How many full pieces can be cut?',
    inputHint: 'Enter a whole number (do not count partial pieces).',
    acceptedAnswers: ['7'],
    errorPatterns: [
      { answers: ['8'], misconception: 'arithmetic_slip' },
      { answers: ['12'], misconception: 'operation_confusion' },
    ],
    solution: '9 1/2 ÷ 1 1/4 = 19/2 ÷ 5/4 = 19/2 × 4/5 = 76/10 = 7.6. The integer part is 7 full pieces (0.6 of a piece is left over).',
    estimatedTimeSec: 70,
  },

  // =========================================================================
  // FE.02 — Decimals: multiply and divide by powers of 10
  // =========================================================================
  {
    id: 'FE.02-01', skillId: 'FE.02', skillName: 'Multiply and divide by powers of 10',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 4.7 × 10. Give a decimal answer.',
    inputHint: 'Enter as 47 or 47.0.',
    acceptedAnswers: ['47', '47.0'],
    errorPatterns: [
      { answers: ['4.70'], misconception: 'conceptual_gap' },
      { answers: ['0.47'], misconception: 'operation_confusion' },
    ],
    solution: 'Multiplying a decimal by 10 shifts the decimal point one place to the right: 4.7 → 47.',
    estimatedTimeSec: 20,
  },
  {
    id: 'FE.02-02', skillId: 'FE.02', skillName: 'Multiply and divide by powers of 10',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 0.36 × 100.', inputHint: 'Enter a number (decimal or integer).',
    acceptedAnswers: ['36', '36.0'],
    errorPatterns: [
      { answers: ['0.036'], misconception: 'operation_confusion' },
      { answers: ['3.6'], misconception: 'conceptual_gap' },
    ],
    solution: '× 100 shifts the decimal two places to the right: 0.36 → 36.',
    estimatedTimeSec: 25,
  },
  {
    id: 'FE.02-03', skillId: 'FE.02', skillName: 'Multiply and divide by powers of 10',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 5.2 ÷ 10.', inputHint: 'Enter a decimal.',
    acceptedAnswers: ['0.52'],
    errorPatterns: [
      { answers: ['52'], misconception: 'operation_confusion' },
      { answers: ['5.02'], misconception: 'conceptual_gap' },
    ],
    solution: 'Dividing a decimal by 10 shifts the decimal point one place to the LEFT: 5.2 → 0.52.',
    estimatedTimeSec: 25,
  },
  {
    id: 'FE.02-04', skillId: 'FE.02', skillName: 'Multiply and divide by powers of 10',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 0.045 × 1000.', inputHint: 'Enter a number (decimal or integer).',
    acceptedAnswers: ['45', '45.0'],
    errorPatterns: [
      { answers: ['450'], misconception: 'arithmetic_slip' },
      { answers: ['4.5'], misconception: 'operation_confusion' },
    ],
    solution: '× 1000 shifts the decimal THREE places to the right: 0.045 → 45.',
    estimatedTimeSec: 35,
  },
  {
    id: 'FE.02-05', skillId: 'FE.02', skillName: 'Multiply and divide by powers of 10',
    difficulty: 5, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'What is 70 ÷ 1000?',
    options: [
      { text: '70000', misconception: 'operation_confusion' },
      { text: '7', misconception: 'arithmetic_slip' },
      { text: '0.07', misconception: 'none' },
      { text: '0.7', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 2,
    solution: '÷ 1000 shifts the decimal three places left. 70 → 70.0 → 0.070 → 0.07.',
    estimatedTimeSec: 40,
  },
  {
    id: 'FE.02-06', skillId: 'FE.02', skillName: 'Multiply and divide by powers of 10',
    difficulty: 6, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A wire is 2.4 m long. If 100 such wires are joined end-to-end, what is the total length in metres?',
    inputHint: 'Enter a decimal or whole number.',
    acceptedAnswers: ['240', '240.0'],
    errorPatterns: [
      { answers: ['24'], misconception: 'arithmetic_slip' },
      { answers: ['0.024'], misconception: 'operation_confusion' },
    ],
    solution: '2.4 × 100 = 240 m.',
    estimatedTimeSec: 40,
  },
  {
    id: 'FE.02-07', skillId: 'FE.02', skillName: 'Multiply and divide by powers of 10',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 1.25 × 10000.', inputHint: 'Enter a whole number.',
    acceptedAnswers: ['12500', '12500.0'],
    errorPatterns: [
      { answers: ['1250'], misconception: 'arithmetic_slip' },
      { answers: ['125000'], misconception: 'arithmetic_slip' },
    ],
    solution: '× 10000 shifts the decimal four places right: 1.25 → 12500.',
    estimatedTimeSec: 35,
  },
  {
    id: 'FE.02-08', skillId: 'FE.02', skillName: 'Multiply and divide by powers of 10',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A box of 1000 paper clips weighs 850 g. What is the weight of ONE paper clip, in grams (decimal)?',
    inputHint: 'Enter a decimal like 0.85.',
    acceptedAnswers: ['0.85'],
    errorPatterns: [
      { answers: ['8.5'], misconception: 'operation_confusion' },
      { answers: ['0.085'], misconception: 'arithmetic_slip' },
    ],
    solution: '850 ÷ 1000 = 0.85 g per paper clip.',
    estimatedTimeSec: 50,
  },

  // =========================================================================
  // FE.03 — Decimal arithmetic to thousandths
  // =========================================================================
  {
    id: 'FE.03-01', skillId: 'FE.03', skillName: 'Decimal arithmetic to thousandths',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 1.234 + 0.5. Give the decimal answer.',
    inputHint: 'Enter a decimal.',
    acceptedAnswers: ['1.734'],
    errorPatterns: [
      { answers: ['1.239'], misconception: 'arithmetic_slip' },
      { answers: ['1.284'], misconception: 'conceptual_gap' },
    ],
    solution: 'Line up the decimal points (pad 0.5 to 0.500): 1.234 + 0.500 = 1.734.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FE.03-02', skillId: 'FE.03', skillName: 'Decimal arithmetic to thousandths',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 2.345 - 1.06. Give the decimal answer.',
    inputHint: 'Enter a decimal.',
    acceptedAnswers: ['1.285'],
    errorPatterns: [
      { answers: ['1.295'], misconception: 'arithmetic_slip' },
      { answers: ['1.275'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Pad 1.06 to 1.060: 2.345 - 1.060 = 1.285.',
    estimatedTimeSec: 35,
  },
  {
    id: 'FE.03-03', skillId: 'FE.03', skillName: 'Decimal arithmetic to thousandths',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 0.4 × 0.3.', inputHint: 'Enter a decimal.',
    acceptedAnswers: ['0.12'],
    errorPatterns: [
      { answers: ['1.2'], misconception: 'conceptual_gap' },
      { answers: ['0.012'], misconception: 'arithmetic_slip' },
      { answers: ['0.7'], misconception: 'operation_confusion' },
    ],
    solution: 'Ignore decimals, multiply: 4 × 3 = 12. The factors have 1 + 1 = 2 decimal places, so the product has 2 decimal places: 0.12.',
    estimatedTimeSec: 35,
  },
  {
    id: 'FE.03-04', skillId: 'FE.03', skillName: 'Decimal arithmetic to thousandths',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 0.125 × 8.', inputHint: 'Enter a number (decimal or whole).',
    acceptedAnswers: ['1', '1.0', '1.000'],
    errorPatterns: [
      { answers: ['0.1'], misconception: 'arithmetic_slip' },
      { answers: ['10'], misconception: 'conceptual_gap' },
    ],
    solution: '125 × 8 = 1000. 0.125 has 3 decimal places, so the product = 1.000 = 1.',
    estimatedTimeSec: 35,
  },
  {
    id: 'FE.03-05', skillId: 'FE.03', skillName: 'Decimal arithmetic to thousandths',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Compute: 2.4 ÷ 0.6.', inputHint: 'Enter a whole number or decimal.',
    acceptedAnswers: ['4', '4.0'],
    errorPatterns: [
      { answers: ['0.4'], misconception: 'operation_confusion' },
      { answers: ['40'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Multiply both by 10 to clear the decimal in the divisor: 2.4 ÷ 0.6 = 24 ÷ 6 = 4.',
    estimatedTimeSec: 40,
  },
  {
    id: 'FE.03-06', skillId: 'FE.03', skillName: 'Decimal arithmetic to thousandths',
    difficulty: 6, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A 1.250 kg bag of sugar is divided into 5 equal portions. How much does each portion weigh, in kg (decimal)?',
    inputHint: 'Enter a decimal.',
    acceptedAnswers: ['0.25', '0.250'],
    errorPatterns: [
      { answers: ['0.5'], misconception: 'arithmetic_slip' },
      { answers: ['2.5'], misconception: 'operation_confusion' },
    ],
    solution: '1.250 ÷ 5 = 0.250 kg per portion.',
    estimatedTimeSec: 40,
  },
  {
    id: 'FE.03-07', skillId: 'FE.03', skillName: 'Decimal arithmetic to thousandths',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'Asha buys items costing ₹14.75, ₹8.50, and ₹22.125. What is the total, in rupees?',
    inputHint: 'Enter a decimal like 45.375.',
    acceptedAnswers: ['45.375'],
    errorPatterns: [
      { answers: ['45.075'], misconception: 'arithmetic_slip' },
      { answers: ['44.375'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Line up decimal points (pad ₹14.75 → 14.750 and ₹8.50 → 8.500): 14.750 + 8.500 + 22.125 = 45.375.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FE.03-08', skillId: 'FE.03', skillName: 'Decimal arithmetic to thousandths',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A car uses 0.075 L of petrol per km. How much petrol is needed for 16 km, in litres (decimal)?',
    inputHint: 'Enter a decimal like 1.2.',
    acceptedAnswers: ['1.2', '1.20', '1.200'],
    errorPatterns: [
      { answers: ['0.12'], misconception: 'arithmetic_slip' },
      { answers: ['12'], misconception: 'conceptual_gap' },
    ],
    solution: '0.075 × 16 = 1.200 = 1.2 L. (75 × 16 = 1200; with 3 decimal places, the product is 1.200.)',
    estimatedTimeSec: 55,
  },

  // =========================================================================
  // AE.01 — Combine like terms
  // =========================================================================
  {
    id: 'AE.01-01', skillId: 'AE.01', skillName: 'Combine like terms',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Simplify: 3x + 5x',
    options: [
      { text: '8x²', misconception: 'conceptual_gap' },
      { text: '8x', misconception: 'none' },
      { text: '15x', misconception: 'operation_confusion' },
      { text: '8', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Like terms (both in x) add their coefficients: 3x + 5x = (3+5)x = 8x.',
    estimatedTimeSec: 25,
  },
  {
    id: 'AE.01-02', skillId: 'AE.01', skillName: 'Combine like terms',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Simplify: 7y - 2y',
    options: [
      { text: '5', misconception: 'conceptual_gap' },
      { text: '5y', misconception: 'none' },
      { text: '5y²', misconception: 'conceptual_gap' },
      { text: '9y', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: '(7 - 2)y = 5y. The variable is unchanged because we are subtracting like terms.',
    estimatedTimeSec: 25,
  },
  {
    id: 'AE.01-03', skillId: 'AE.01', skillName: 'Combine like terms',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Simplify: 4a + 3b + 2a - b',
    options: [
      { text: '6a + 2b', misconception: 'none' },
      { text: '8ab', misconception: 'conceptual_gap' },
      { text: '6a + 4b', misconception: 'arithmetic_slip' },
      { text: '5a + 2b', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Group a-terms: 4a + 2a = 6a. Group b-terms: 3b - b = 2b. Final: 6a + 2b.',
    estimatedTimeSec: 40,
  },
  {
    id: 'AE.01-04', skillId: 'AE.01', skillName: 'Combine like terms',
    difficulty: 4, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which of these is NOT a pair of like terms?',
    options: [
      { text: '3x and -5x', misconception: 'conceptual_gap' },
      { text: '2ab and 7ab', misconception: 'conceptual_gap' },
      { text: '4y² and -y²', misconception: 'conceptual_gap' },
      { text: '5x and 5x²', misconception: 'none' },
    ],
    correctIndex: 3,
    solution: 'Like terms must have the SAME variable AND the SAME exponent. 5x and 5x² differ in exponent, so they are NOT like terms.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AE.01-05', skillId: 'AE.01', skillName: 'Combine like terms',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Simplify: 5x - 3 + 2x + 7',
    options: [
      { text: '7x + 4', misconception: 'none' },
      { text: '7x - 4', misconception: 'arithmetic_slip' },
      { text: '11x', misconception: 'conceptual_gap' },
      { text: '7x + 10', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'x-terms: 5x + 2x = 7x. Constants: -3 + 7 = +4. Final: 7x + 4.',
    estimatedTimeSec: 35,
  },
  {
    id: 'AE.01-06', skillId: 'AE.01', skillName: 'Combine like terms',
    difficulty: 6, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Simplify: 6x + 2y - 3x - 5y + x',
    options: [
      { text: '4x - 3y', misconception: 'none' },
      { text: '10x + 7y', misconception: 'operation_confusion' },
      { text: '4x + 3y', misconception: 'arithmetic_slip' },
      { text: '4x - 7y', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'x-terms: 6x - 3x + x = 4x. y-terms: 2y - 5y = -3y. Final: 4x - 3y.',
    estimatedTimeSec: 50,
  },
  {
    id: 'AE.01-07', skillId: 'AE.01', skillName: 'Combine like terms',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Simplify: 3(x + 4) + 2x',
    options: [
      { text: '5x + 4', misconception: 'arithmetic_slip' },
      { text: '5x + 12', misconception: 'none' },
      { text: '3x + 14', misconception: 'arithmetic_slip' },
      { text: '6x + 8', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Distribute: 3(x + 4) = 3x + 12. Then add 2x: 3x + 12 + 2x = 5x + 12.',
    estimatedTimeSec: 50,
  },
  {
    id: 'AE.01-08', skillId: 'AE.01', skillName: 'Combine like terms',
    difficulty: 8, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Simplify: 4(2x - 1) - (x + 3)',
    options: [
      { text: '7x - 7', misconception: 'none' },
      { text: '7x + 1', misconception: 'arithmetic_slip' },
      { text: '9x - 4', misconception: 'arithmetic_slip' },
      { text: '7x - 1', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Distribute: 4(2x - 1) = 8x - 4. Distribute the leading minus: -(x + 3) = -x - 3. Combine: 8x - 4 - x - 3 = 7x - 7.',
    estimatedTimeSec: 70,
  },

  // =========================================================================
  // AE.02 — Evaluate expressions with negatives
  // =========================================================================
  {
    id: 'AE.02-01', skillId: 'AE.02', skillName: 'Evaluate expressions with negatives',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'If x = -3, find: 2x', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-6'],
    errorPatterns: [
      { answers: ['6'], misconception: 'conceptual_gap' },
      { answers: ['-1'], misconception: 'operation_confusion' },
    ],
    solution: '2 × (-3) = -6. Positive × negative = negative.',
    estimatedTimeSec: 25,
  },
  {
    id: 'AE.02-02', skillId: 'AE.02', skillName: 'Evaluate expressions with negatives',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'If x = -4, find: x + 7', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['3'],
    errorPatterns: [
      { answers: ['-3'], misconception: 'operation_confusion' },
      { answers: ['11'], misconception: 'conceptual_gap' },
      { answers: ['-11'], misconception: 'operation_confusion' },
    ],
    solution: '-4 + 7 = +3. The positive 7 is larger, so the sign is positive.',
    estimatedTimeSec: 25,
  },
  {
    id: 'AE.02-03', skillId: 'AE.02', skillName: 'Evaluate expressions with negatives',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'If x = -2, find: 3x + 5', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-1'],
    errorPatterns: [
      { answers: ['11'], misconception: 'conceptual_gap' },
      { answers: ['1'], misconception: 'arithmetic_slip' },
      { answers: ['-11'], misconception: 'arithmetic_slip' },
    ],
    solution: '3 × (-2) + 5 = -6 + 5 = -1.',
    estimatedTimeSec: 35,
  },
  {
    id: 'AE.02-04', skillId: 'AE.02', skillName: 'Evaluate expressions with negatives',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'If y = -1, find: 4(y - 2)', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-12'],
    errorPatterns: [
      { answers: ['-4'], misconception: 'arithmetic_slip' },
      { answers: ['12'], misconception: 'conceptual_gap' },
    ],
    solution: 'Brackets first: y - 2 = -1 - 2 = -3. Then 4 × (-3) = -12.',
    estimatedTimeSec: 40,
  },
  {
    id: 'AE.02-05', skillId: 'AE.02', skillName: 'Evaluate expressions with negatives',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'If a = -3 and b = 5, find: 2a + b', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-1'],
    errorPatterns: [
      { answers: ['1'], misconception: 'arithmetic_slip' },
      { answers: ['11'], misconception: 'conceptual_gap' },
    ],
    solution: '2 × (-3) + 5 = -6 + 5 = -1.',
    estimatedTimeSec: 35,
  },
  {
    id: 'AE.02-06', skillId: 'AE.02', skillName: 'Evaluate expressions with negatives',
    difficulty: 6, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'If x = -5, find: -x', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['5'],
    errorPatterns: [
      { answers: ['-5'], misconception: 'conceptual_gap' },
      { answers: ['0'], misconception: 'arithmetic_slip' },
    ],
    solution: '-x means the additive inverse of x. The inverse of -5 is +5.',
    estimatedTimeSec: 35,
  },
  {
    id: 'AE.02-07', skillId: 'AE.02', skillName: 'Evaluate expressions with negatives',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'If x = -4, find: x² + 3x', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['4'],
    errorPatterns: [
      { answers: ['-4'], misconception: 'arithmetic_slip' },
      { answers: ['-28'], misconception: 'conceptual_gap' },
      { answers: ['28'], misconception: 'operation_confusion' },
    ],
    solution: 'x² = (-4)² = 16 (negative squared is positive). 3x = 3 × (-4) = -12. Sum: 16 + (-12) = 4.',
    estimatedTimeSec: 50,
  },
  {
    id: 'AE.02-08', skillId: 'AE.02', skillName: 'Evaluate expressions with negatives',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A submarine\'s depth is modelled by d = -3t - 2 (t = time in minutes; negative depth means below sea level). What is the depth at t = 4 minutes?',
    inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-14'],
    errorPatterns: [
      { answers: ['14'], misconception: 'conceptual_gap' },
      { answers: ['10'], misconception: 'arithmetic_slip' },
      { answers: ['-10'], misconception: 'arithmetic_slip' },
    ],
    solution: 'd = -3(4) - 2 = -12 - 2 = -14. The submarine is 14 m below sea level.',
    estimatedTimeSec: 50,
  },

  // =========================================================================
  // AE.03 — Two-step equations
  // =========================================================================
  {
    id: 'AE.03-01', skillId: 'AE.03', skillName: 'Two-step equations',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Solve for x: 2x + 3 = 11', inputHint: 'Enter a number.',
    acceptedAnswers: ['4'],
    errorPatterns: [
      { answers: ['7'], misconception: 'operation_confusion' },
      { answers: ['28'], misconception: 'operation_confusion' },
    ],
    solution: 'Subtract 3 from both sides: 2x = 8. Divide by 2: x = 4.',
    estimatedTimeSec: 35,
  },
  {
    id: 'AE.03-02', skillId: 'AE.03', skillName: 'Two-step equations',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Solve for y: 3y - 5 = 16', inputHint: 'Enter a number.',
    acceptedAnswers: ['7'],
    errorPatterns: [
      { answers: ['11'], misconception: 'operation_confusion' },
      { answers: ['63'], misconception: 'operation_confusion' },
    ],
    solution: 'Add 5 to both sides: 3y = 21. Divide by 3: y = 7.',
    estimatedTimeSec: 35,
  },
  {
    id: 'AE.03-03', skillId: 'AE.03', skillName: 'Two-step equations',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Solve for n: n/4 + 1 = 5', inputHint: 'Enter a number.',
    acceptedAnswers: ['16'],
    errorPatterns: [
      { answers: ['4'], misconception: 'arithmetic_slip' },
      { answers: ['24'], misconception: 'operation_confusion' },
    ],
    solution: 'Subtract 1: n/4 = 4. Multiply by 4: n = 16.',
    estimatedTimeSec: 40,
  },
  {
    id: 'AE.03-04', skillId: 'AE.03', skillName: 'Two-step equations',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Solve for x: 4x - 7 = 9', inputHint: 'Enter a number.',
    acceptedAnswers: ['4'],
    errorPatterns: [
      { answers: ['16'], misconception: 'operation_confusion' },
      { answers: ['0.5'], misconception: 'operation_confusion' },
    ],
    solution: 'Add 7: 4x = 16. Divide by 4: x = 4.',
    estimatedTimeSec: 35,
  },
  {
    id: 'AE.03-05', skillId: 'AE.03', skillName: 'Two-step equations',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Solve for x: 2x + 5 = -3', inputHint: 'Enter a signed integer.',
    acceptedAnswers: ['-4'],
    errorPatterns: [
      { answers: ['-1'], misconception: 'arithmetic_slip' },
      { answers: ['4'], misconception: 'conceptual_gap' },
    ],
    solution: 'Subtract 5: 2x = -8. Divide by 2: x = -4.',
    estimatedTimeSec: 40,
  },
  {
    id: 'AE.03-06', skillId: 'AE.03', skillName: 'Two-step equations',
    difficulty: 6, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A taxi charges ₹50 plus ₹15 per kilometre. If the bill is ₹185, how many kilometres did the taxi cover?',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['9'],
    errorPatterns: [
      { answers: ['12'], misconception: 'operation_confusion' },
      { answers: ['15'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Let k = kilometres. Equation: 15k + 50 = 185. Subtract 50: 15k = 135. Divide: k = 9.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AE.03-07', skillId: 'AE.03', skillName: 'Two-step equations',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Solve for x: (x - 5) / 3 = 4', inputHint: 'Enter a number.',
    acceptedAnswers: ['17'],
    errorPatterns: [
      { answers: ['7'], misconception: 'operation_confusion' },
      { answers: ['12'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Multiply both sides by 3: x - 5 = 12. Add 5: x = 17.',
    estimatedTimeSec: 50,
  },
  {
    id: 'AE.03-08', skillId: 'AE.03', skillName: 'Two-step equations',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'Asha thinks of a number. She doubles it and subtracts 7, getting 19. What was the original number?',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['13'],
    errorPatterns: [
      { answers: ['12'], misconception: 'arithmetic_slip' },
      { answers: ['6'], misconception: 'operation_confusion' },
    ],
    solution: 'Let n be the number. 2n - 7 = 19. Add 7: 2n = 26. Divide: n = 13.',
    estimatedTimeSec: 60,
  },

  // =========================================================================
  // v0.25 — Class 7 deepening
  // =========================================================================
  // LA.01 — Complementary, supplementary, and vertically opposite angles
  // =========================================================================
  {
    id: 'LA.01-01', skillId: 'LA.01', skillName: 'Complementary, supplementary, and vertically opposite angles',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Two angles are COMPLEMENTARY when their measures add up to:',
    options: [
      { text: '90°', misconception: 'none' },
      { text: '180°', misconception: 'conceptual_gap' },
      { text: '360°', misconception: 'conceptual_gap' },
      { text: '45°', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'By definition, two angles are complementary when they sum to 90°. Supplementary angles sum to 180°.',
    estimatedTimeSec: 25,
  },
  {
    id: 'LA.01-02', skillId: 'LA.01', skillName: 'Complementary, supplementary, and vertically opposite angles',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'The complement of an angle is 35°. What is the angle, in degrees?',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['55'],
    errorPatterns: [
      { answers: ['145'], misconception: 'conceptual_gap' },
      { answers: ['325'], misconception: 'conceptual_gap' },
      { answers: ['45'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Complement means together they sum to 90°. 90 − 35 = 55°.',
    estimatedTimeSec: 30,
  },
  {
    id: 'LA.01-03', skillId: 'LA.01', skillName: 'Complementary, supplementary, and vertically opposite angles',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'The supplement of an angle is 112°. What is the angle, in degrees?',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['68'],
    errorPatterns: [
      { answers: ['22'], misconception: 'conceptual_gap' },
      { answers: ['248'], misconception: 'conceptual_gap' },
      { answers: ['78'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Supplement means together they sum to 180°. 180 − 112 = 68°.',
    estimatedTimeSec: 30,
  },
  {
    id: 'LA.01-04', skillId: 'LA.01', skillName: 'Complementary, supplementary, and vertically opposite angles',
    difficulty: 4, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Two lines intersect, forming four angles. One of the angles measures 73°. What does the VERTICALLY OPPOSITE angle measure?',
    options: [
      { text: '73°', misconception: 'none' },
      { text: '107°', misconception: 'conceptual_gap' },
      { text: '17°', misconception: 'conceptual_gap' },
      { text: '180°', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'Vertically opposite angles (formed by two intersecting lines) are equal. So the opposite angle also measures 73°.',
    estimatedTimeSec: 35,
  },
  {
    id: 'LA.01-05', skillId: 'LA.01', skillName: 'Complementary, supplementary, and vertically opposite angles',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Two angles form a linear pair. One measures 64°. What does the other measure, in degrees?',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['116'],
    errorPatterns: [
      { answers: ['26'], misconception: 'conceptual_gap' },
      { answers: ['296'], misconception: 'conceptual_gap' },
      { answers: ['64'], misconception: 'conceptual_gap' },
    ],
    solution: 'A linear pair sums to 180° (the angles together form a straight line). 180 − 64 = 116°.',
    estimatedTimeSec: 35,
  },
  {
    id: 'LA.01-06', skillId: 'LA.01', skillName: 'Complementary, supplementary, and vertically opposite angles',
    difficulty: 5, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'An angle is twice its complement. What is the angle?',
    options: [
      { text: '60°', misconception: 'none' },
      { text: '30°', misconception: 'operation_confusion' },
      { text: '45°', misconception: 'conceptual_gap' },
      { text: '120°', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Let the angle be x; its complement is 90 − x. The condition x = 2(90 − x) gives x = 180 − 2x, so 3x = 180, x = 60°.',
    estimatedTimeSec: 50,
  },
  {
    id: 'LA.01-07', skillId: 'LA.01', skillName: 'Complementary, supplementary, and vertically opposite angles',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'Two angles are supplementary, and one is 30° more than three times the other. What is the smaller angle, in degrees?',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['37.5', '37.50'],
    errorPatterns: [
      { answers: ['142.5'], misconception: 'conceptual_gap' },
      { answers: ['52.5'], misconception: 'arithmetic_slip' },
      { answers: ['37'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Let the smaller angle be x. The other is 3x + 30. Together: x + (3x + 30) = 180, so 4x = 150, x = 37.5°.',
    estimatedTimeSec: 65,
  },
  {
    id: 'LA.01-08', skillId: 'LA.01', skillName: 'Complementary, supplementary, and vertically opposite angles',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'Two lines meet at a point. The four angles formed are in the ratio 1 : 2 : 1 : 2. What is the smallest angle, in degrees?',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['60'],
    errorPatterns: [
      { answers: ['120'], misconception: 'conceptual_gap' },
      { answers: ['30'], misconception: 'arithmetic_slip' },
      { answers: ['90'], misconception: 'conceptual_gap' },
    ],
    solution: 'The four angles around a point sum to 360°. Ratio 1+2+1+2 = 6 parts. One part = 360÷6 = 60°. Smallest angle = 60°.',
    estimatedTimeSec: 65,
  },

  // =========================================================================
  // LA.02 — Angles on parallel lines cut by a transversal
  // =========================================================================
  {
    id: 'LA.02-01', skillId: 'LA.02', skillName: 'Angles on parallel lines cut by a transversal',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Two parallel lines are cut by a transversal. Two angles in the SAME relative position at each intersection are called:',
    options: [
      { text: 'Corresponding angles', misconception: 'none' },
      { text: 'Alternate angles', misconception: 'conceptual_gap' },
      { text: 'Co-interior angles', misconception: 'conceptual_gap' },
      { text: 'Vertically opposite angles', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Corresponding angles are in the same relative position (e.g., both above-left). On parallel lines, they are equal.',
    estimatedTimeSec: 30,
  },
  {
    id: 'LA.02-02', skillId: 'LA.02', skillName: 'Angles on parallel lines cut by a transversal',
    difficulty: 3, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'When two parallel lines are cut by a transversal, ALTERNATE INTERIOR angles are:',
    options: [
      { text: 'Equal', misconception: 'none' },
      { text: 'Supplementary (sum to 180°)', misconception: 'conceptual_gap' },
      { text: 'Complementary (sum to 90°)', misconception: 'conceptual_gap' },
      { text: 'Not related', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'On parallel lines, alternate interior angles (on opposite sides of the transversal, between the two parallel lines) are equal.',
    estimatedTimeSec: 30,
  },
  {
    id: 'LA.02-03', skillId: 'LA.02', skillName: 'Angles on parallel lines cut by a transversal',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Lines L₁ ∥ L₂ are cut by a transversal. One angle at the first intersection is 65°. What is the CORRESPONDING angle at the second intersection, in degrees?',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['65'],
    errorPatterns: [
      { answers: ['115'], misconception: 'conceptual_gap' },
      { answers: ['25'], misconception: 'conceptual_gap' },
      { answers: ['90'], misconception: 'conceptual_gap' },
    ],
    solution: 'On parallel lines, corresponding angles are equal. The corresponding angle is 65°.',
    estimatedTimeSec: 35,
  },
  {
    id: 'LA.02-04', skillId: 'LA.02', skillName: 'Angles on parallel lines cut by a transversal',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'L₁ ∥ L₂. A transversal makes an angle of 110° on one parallel line. What is the CO-INTERIOR (same-side interior) angle on the other parallel line, in degrees?',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['70'],
    errorPatterns: [
      { answers: ['110'], misconception: 'conceptual_gap' },
      { answers: ['250'], misconception: 'conceptual_gap' },
      { answers: ['20'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Co-interior angles (same-side interior) are SUPPLEMENTARY on parallel lines: 180 − 110 = 70°.',
    estimatedTimeSec: 40,
  },
  {
    id: 'LA.02-05', skillId: 'LA.02', skillName: 'Angles on parallel lines cut by a transversal',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'L₁ ∥ L₂ are cut by a transversal. One alternate exterior angle is 47°. What is its alternate exterior pair, in degrees?',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['47'],
    errorPatterns: [
      { answers: ['133'], misconception: 'conceptual_gap' },
      { answers: ['43'], misconception: 'conceptual_gap' },
      { answers: ['90'], misconception: 'conceptual_gap' },
    ],
    solution: 'Alternate exterior angles are equal on parallel lines. The pair is 47°.',
    estimatedTimeSec: 40,
  },
  {
    id: 'LA.02-06', skillId: 'LA.02', skillName: 'Angles on parallel lines cut by a transversal',
    difficulty: 6, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'L₁ ∥ L₂. A transversal makes an angle x with L₁ and 3x with L₂ — and these two angles are CO-INTERIOR. Find x, in degrees.',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['45'],
    errorPatterns: [
      { answers: ['60'], misconception: 'arithmetic_slip' },
      { answers: ['135'], misconception: 'conceptual_gap' },
      { answers: ['90'], misconception: 'conceptual_gap' },
    ],
    solution: 'Co-interior angles are supplementary: x + 3x = 180, so 4x = 180, x = 45°.',
    estimatedTimeSec: 55,
  },
  {
    id: 'LA.02-07', skillId: 'LA.02', skillName: 'Angles on parallel lines cut by a transversal',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Two parallel lines are cut by a transversal. One of the eight angles formed is 130°. Which of the following CANNOT appear among the other seven angles?',
    options: [
      { text: '40°', misconception: 'none' },
      { text: '50°', misconception: 'conceptual_gap' },
      { text: '130°', misconception: 'conceptual_gap' },
      { text: '180°', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'The eight angles are either 130° (corresponding/alternate/vertical pairs) or 180 − 130 = 50° (linear pair / co-interior). 40° is not among them.',
    estimatedTimeSec: 70,
  },
  {
    id: 'LA.02-08', skillId: 'LA.02', skillName: 'Angles on parallel lines cut by a transversal',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'L₁ ∥ L₂. A transversal makes corresponding angles (2x + 10)° and (3x − 20)° with L₁ and L₂ respectively. Find x.',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['30'],
    errorPatterns: [
      { answers: ['10'], misconception: 'arithmetic_slip' },
      { answers: ['50'], misconception: 'arithmetic_slip' },
      { answers: ['6'], misconception: 'operation_confusion' },
    ],
    solution: 'Corresponding angles on parallel lines are equal: 2x + 10 = 3x − 20. Subtract 2x: 10 = x − 20. Add 20: x = 30.',
    estimatedTimeSec: 70,
  },

  // =========================================================================
  // LA.03 — Angle sum property of a triangle
  // =========================================================================
  {
    id: 'LA.03-01', skillId: 'LA.03', skillName: 'Angle sum property of a triangle',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'The three interior angles of any triangle add up to:',
    options: [
      { text: '180°', misconception: 'none' },
      { text: '360°', misconception: 'conceptual_gap' },
      { text: '90°', misconception: 'conceptual_gap' },
      { text: '270°', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Angle sum property: the three interior angles of any triangle add up to 180°.',
    estimatedTimeSec: 25,
  },
  {
    id: 'LA.03-02', skillId: 'LA.03', skillName: 'Angle sum property of a triangle',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Two angles of a triangle are 50° and 60°. Find the third angle, in degrees.',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['70'],
    errorPatterns: [
      { answers: ['110'], misconception: 'conceptual_gap' },
      { answers: ['250'], misconception: 'conceptual_gap' },
      { answers: ['60'], misconception: 'arithmetic_slip' },
    ],
    solution: '180 − (50 + 60) = 180 − 110 = 70°.',
    estimatedTimeSec: 30,
  },
  {
    id: 'LA.03-03', skillId: 'LA.03', skillName: 'Angle sum property of a triangle',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'A right-angled triangle has one acute angle of 35°. Find the other acute angle, in degrees.',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['55'],
    errorPatterns: [
      { answers: ['145'], misconception: 'conceptual_gap' },
      { answers: ['45'], misconception: 'arithmetic_slip' },
      { answers: ['35'], misconception: 'arithmetic_slip' },
    ],
    solution: 'The two acute angles in a right triangle are complementary: 90 − 35 = 55°.',
    estimatedTimeSec: 30,
  },
  {
    id: 'LA.03-04', skillId: 'LA.03', skillName: 'Angle sum property of a triangle',
    difficulty: 5, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'In an isosceles triangle, the angle between the two equal sides is 40°. What does each of the other two equal angles measure, in degrees?',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['70'],
    errorPatterns: [
      { answers: ['140'], misconception: 'conceptual_gap' },
      { answers: ['80'], misconception: 'arithmetic_slip' },
      { answers: ['40'], misconception: 'conceptual_gap' },
    ],
    solution: 'Isosceles → the two angles opposite the equal sides are equal. Sum: 180 − 40 = 140°. Each = 140 ÷ 2 = 70°.',
    estimatedTimeSec: 45,
  },
  {
    id: 'LA.03-05', skillId: 'LA.03', skillName: 'Angle sum property of a triangle',
    difficulty: 5, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'In a triangle, the angles are in the ratio 1 : 2 : 3. What KIND of triangle is it?',
    options: [
      { text: 'Right-angled', misconception: 'none' },
      { text: 'Acute-angled', misconception: 'conceptual_gap' },
      { text: 'Obtuse-angled', misconception: 'conceptual_gap' },
      { text: 'Equilateral', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Ratio 1:2:3 → 6 parts = 180°, one part = 30°. Angles: 30°, 60°, 90°. The 90° makes it right-angled.',
    estimatedTimeSec: 50,
  },
  {
    id: 'LA.03-06', skillId: 'LA.03', skillName: 'Angle sum property of a triangle',
    difficulty: 6, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'The exterior angle of a triangle is 130°. One of the two interior opposite angles is 65°. Find the other interior opposite angle, in degrees.',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['65'],
    errorPatterns: [
      { answers: ['50'], misconception: 'conceptual_gap' },
      { answers: ['195'], misconception: 'conceptual_gap' },
      { answers: ['115'], misconception: 'conceptual_gap' },
    ],
    solution: 'Exterior angle = sum of the two interior opposite angles. 130 = 65 + ?, so ? = 65°.',
    estimatedTimeSec: 50,
  },
  {
    id: 'LA.03-07', skillId: 'LA.03', skillName: 'Angle sum property of a triangle',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'In a triangle, one angle is twice another, and the third is 20° more than the smaller of these. Find the smallest angle, in degrees.',
    inputHint: 'Enter a whole number of degrees.',
    acceptedAnswers: ['40'],
    errorPatterns: [
      { answers: ['60'], misconception: 'arithmetic_slip' },
      { answers: ['80'], misconception: 'operation_confusion' },
      { answers: ['30'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Let smallest = x. Other two are 2x and x + 20. Sum: x + 2x + (x + 20) = 180, so 4x = 160, x = 40°.',
    estimatedTimeSec: 65,
  },
  {
    id: 'LA.03-08', skillId: 'LA.03', skillName: 'Angle sum property of a triangle',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'A triangle has angles 3x, 4x, and 5x. What is the LARGEST angle?',
    options: [
      { text: '75°', misconception: 'none' },
      { text: '60°', misconception: 'conceptual_gap' },
      { text: '90°', misconception: 'conceptual_gap' },
      { text: '45°', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '3x + 4x + 5x = 180, so 12x = 180, x = 15. Largest = 5x = 75°.',
    estimatedTimeSec: 60,
  },

  // =========================================================================
  // CQ.01 — Convert between fractions, decimals, and percentages
  // =========================================================================
  {
    id: 'CQ.01-01', skillId: 'CQ.01', skillName: 'Convert between fractions, decimals, and percentages',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these is equal to 25%?',
    options: [
      { text: '1/4', misconception: 'none' },
      { text: '1/25', misconception: 'conceptual_gap' },
      { text: '25', misconception: 'conceptual_gap' },
      { text: '2.5', misconception: 'form_error' },
    ],
    correctIndex: 0,
    solution: '25% = 25/100 = 1/4 (in lowest terms). It also equals 0.25.',
    estimatedTimeSec: 25,
  },
  {
    id: 'CQ.01-02', skillId: 'CQ.01', skillName: 'Convert between fractions, decimals, and percentages',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Convert 60% to a decimal.',
    inputHint: 'Enter a decimal (e.g., 0.6).',
    acceptedAnswers: ['0.6', '0.60', '.6'],
    errorPatterns: [
      { answers: ['6'], misconception: 'form_error' },
      { answers: ['60'], misconception: 'form_error' },
      { answers: ['0.06'], misconception: 'form_error' },
    ],
    solution: 'To convert percent to decimal, divide by 100 (shift decimal two places LEFT): 60% = 60/100 = 0.60.',
    estimatedTimeSec: 30,
  },
  {
    id: 'CQ.01-03', skillId: 'CQ.01', skillName: 'Convert between fractions, decimals, and percentages',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Convert 3/5 to a percentage. (Enter the number only — no % sign.)',
    inputHint: 'Enter a number.',
    acceptedAnswers: ['60'],
    errorPatterns: [
      { answers: ['0.6'], misconception: 'form_error' },
      { answers: ['6'], misconception: 'form_error' },
      { answers: ['35'], misconception: 'conceptual_gap' },
    ],
    solution: '3/5 = 6/10 = 60/100 = 60%. Or 3 ÷ 5 = 0.6, then × 100 = 60%.',
    estimatedTimeSec: 30,
  },
  {
    id: 'CQ.01-04', skillId: 'CQ.01', skillName: 'Convert between fractions, decimals, and percentages',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Convert 0.45 to a percentage. (Enter the number only — no % sign.)',
    inputHint: 'Enter a number.',
    acceptedAnswers: ['45'],
    errorPatterns: [
      { answers: ['4.5'], misconception: 'form_error' },
      { answers: ['0.45'], misconception: 'form_error' },
      { answers: ['450'], misconception: 'form_error' },
    ],
    solution: 'To convert decimal to percent, multiply by 100 (shift two places RIGHT): 0.45 × 100 = 45%.',
    estimatedTimeSec: 25,
  },
  {
    id: 'CQ.01-05', skillId: 'CQ.01', skillName: 'Convert between fractions, decimals, and percentages',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Convert 7/8 to a percentage. (Enter the number only — round to one decimal place if needed.)',
    inputHint: 'Enter a number.',
    acceptedAnswers: ['87.5', '87.50'],
    errorPatterns: [
      { answers: ['78'], misconception: 'conceptual_gap' },
      { answers: ['0.875'], misconception: 'form_error' },
      { answers: ['87'], misconception: 'arithmetic_slip' },
    ],
    solution: '7 ÷ 8 = 0.875. Multiply by 100 → 87.5%.',
    estimatedTimeSec: 40,
  },
  {
    id: 'CQ.01-06', skillId: 'CQ.01', skillName: 'Convert between fractions, decimals, and percentages',
    difficulty: 5, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which of these is the LARGEST?',
    options: [
      { text: '0.8', misconception: 'none' },
      { text: '3/4', misconception: 'conceptual_gap' },
      { text: '70%', misconception: 'conceptual_gap' },
      { text: '7/10', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Convert all to decimals: 0.8; 3/4 = 0.75; 70% = 0.70; 7/10 = 0.70. The largest is 0.8.',
    estimatedTimeSec: 45,
  },
  {
    id: 'CQ.01-07', skillId: 'CQ.01', skillName: 'Convert between fractions, decimals, and percentages',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Convert 1/3 to a percentage, rounded to ONE decimal place. (Enter the number only — no % sign.)',
    inputHint: 'Enter a number with one decimal place.',
    acceptedAnswers: ['33.3'],
    errorPatterns: [
      { answers: ['33'], misconception: 'arithmetic_slip' },
      { answers: ['0.33'], misconception: 'form_error' },
      { answers: ['13'], misconception: 'conceptual_gap' },
    ],
    solution: '1 ÷ 3 = 0.333… ≈ 0.333. Multiply by 100 → 33.3% (to one decimal place).',
    estimatedTimeSec: 50,
  },
  {
    id: 'CQ.01-08', skillId: 'CQ.01', skillName: 'Convert between fractions, decimals, and percentages',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Put these values in INCREASING order: 0.6, 5/8, 65%, 11/20.',
    options: [
      { text: '11/20 < 0.6 < 5/8 < 65%', misconception: 'none' },
      { text: '0.6 < 11/20 < 5/8 < 65%', misconception: 'conceptual_gap' },
      { text: '65% < 5/8 < 0.6 < 11/20', misconception: 'conceptual_gap' },
      { text: '5/8 < 11/20 < 0.6 < 65%', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Convert all: 0.6 = 0.60; 5/8 = 0.625; 65% = 0.65; 11/20 = 0.55. Ascending: 0.55 < 0.60 < 0.625 < 0.65 → 11/20 < 0.6 < 5/8 < 65%.',
    estimatedTimeSec: 65,
  },

  // =========================================================================
  // CQ.02 — Percentage of a quantity / percent change
  // =========================================================================
  {
    id: 'CQ.02-01', skillId: 'CQ.02', skillName: 'Percentage of a quantity and percent change',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find 10% of 200.',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['20'],
    errorPatterns: [
      { answers: ['2'], misconception: 'form_error' },
      { answers: ['200'], misconception: 'conceptual_gap' },
      { answers: ['10'], misconception: 'conceptual_gap' },
    ],
    solution: '10% of 200 = (10/100) × 200 = 20.',
    estimatedTimeSec: 25,
  },
  {
    id: 'CQ.02-02', skillId: 'CQ.02', skillName: 'Percentage of a quantity and percent change',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find 25% of 80.',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['20'],
    errorPatterns: [
      { answers: ['25'], misconception: 'conceptual_gap' },
      { answers: ['2'], misconception: 'form_error' },
      { answers: ['200'], misconception: 'form_error' },
    ],
    solution: '25% = 1/4. (1/4) × 80 = 20.',
    estimatedTimeSec: 25,
  },
  {
    id: 'CQ.02-03', skillId: 'CQ.02', skillName: 'Percentage of a quantity and percent change',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find 15% of 240.',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['36'],
    errorPatterns: [
      { answers: ['16'], misconception: 'arithmetic_slip' },
      { answers: ['24'], misconception: 'arithmetic_slip' },
      { answers: ['360'], misconception: 'form_error' },
    ],
    solution: '15% = 10% + 5%. 10% of 240 = 24; 5% of 240 = 12; total = 36.',
    estimatedTimeSec: 35,
  },
  {
    id: 'CQ.02-04', skillId: 'CQ.02', skillName: 'Percentage of a quantity and percent change',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'In a class of 40 students, 35% wear glasses. How many students wear glasses?',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['14'],
    errorPatterns: [
      { answers: ['35'], misconception: 'conceptual_gap' },
      { answers: ['26'], misconception: 'conceptual_gap' },
      { answers: ['4'], misconception: 'arithmetic_slip' },
    ],
    solution: '35% of 40 = (35/100) × 40 = 14 students.',
    estimatedTimeSec: 40,
  },
  {
    id: 'CQ.02-05', skillId: 'CQ.02', skillName: 'Percentage of a quantity and percent change',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A shirt that cost ₹500 is now ₹400. What is the percent DECREASE in price?',
    inputHint: 'Enter a whole-number percent (no % sign).',
    acceptedAnswers: ['20'],
    errorPatterns: [
      { answers: ['25'], misconception: 'conceptual_gap' },
      { answers: ['100'], misconception: 'conceptual_gap' },
      { answers: ['80'], misconception: 'conceptual_gap' },
    ],
    solution: 'Decrease = 500 − 400 = 100. Percent decrease = (100 / 500) × 100 = 20%.',
    estimatedTimeSec: 45,
  },
  {
    id: 'CQ.02-06', skillId: 'CQ.02', skillName: 'Percentage of a quantity and percent change',
    difficulty: 6, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A library had 250 books. The collection grew by 20% over the year. How many books are there now?',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['300'],
    errorPatterns: [
      { answers: ['50'], misconception: 'conceptual_gap' },
      { answers: ['270'], misconception: 'arithmetic_slip' },
      { answers: ['200'], misconception: 'conceptual_gap' },
    ],
    solution: '20% of 250 = 50. New total = 250 + 50 = 300.',
    estimatedTimeSec: 45,
  },
  {
    id: 'CQ.02-07', skillId: 'CQ.02', skillName: 'Percentage of a quantity and percent change',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'After a 12% pay rise, Rohit earns ₹28,000 per month. What was his salary BEFORE the rise, in rupees?',
    inputHint: 'Enter a whole number of rupees.',
    acceptedAnswers: ['25000'],
    errorPatterns: [
      { answers: ['24640'], misconception: 'operation_confusion' },
      { answers: ['16000'], misconception: 'operation_confusion' },
      { answers: ['28012'], misconception: 'conceptual_gap' },
    ],
    solution: 'Let original = x. After rise: 1.12x = 28000. x = 28000 / 1.12 = 25000.',
    estimatedTimeSec: 65,
  },
  {
    id: 'CQ.02-08', skillId: 'CQ.02', skillName: 'Percentage of a quantity and percent change',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'A price first rises by 20% and then falls by 20%. What is the OVERALL percent change from the original price? (Enter a signed integer; negative = decrease.)',
    inputHint: 'Enter a signed whole-number percent.',
    acceptedAnswers: ['-4'],
    errorPatterns: [
      { answers: ['0'], misconception: 'conceptual_gap' },
      { answers: ['4'], misconception: 'form_error' },
      { answers: ['-20'], misconception: 'conceptual_gap' },
    ],
    solution: 'Start with 100. +20% → 120. Then −20% of 120 = 24, so 120 − 24 = 96. Net change = 96 − 100 = −4, i.e. a 4% decrease.',
    estimatedTimeSec: 70,
  },

  // =========================================================================
  // CQ.03 — Simple interest and profit / loss
  // =========================================================================
  {
    id: 'CQ.03-01', skillId: 'CQ.03', skillName: 'Simple interest and profit / loss in context',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'The formula for SIMPLE INTEREST (SI) is:',
    options: [
      { text: 'SI = (P × R × T) / 100', misconception: 'none' },
      { text: 'SI = P × R × T', misconception: 'form_error' },
      { text: 'SI = P + R + T', misconception: 'conceptual_gap' },
      { text: 'SI = P / (R × T)', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'Simple interest = (Principal × Rate × Time) / 100, where R is in % per year and T in years.',
    estimatedTimeSec: 25,
  },
  {
    id: 'CQ.03-02', skillId: 'CQ.03', skillName: 'Simple interest and profit / loss in context',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find the simple interest on ₹1,000 at 5% per year for 2 years, in rupees.',
    inputHint: 'Enter a whole number of rupees.',
    acceptedAnswers: ['100'],
    errorPatterns: [
      { answers: ['10'], misconception: 'form_error' },
      { answers: ['1000'], misconception: 'conceptual_gap' },
      { answers: ['50'], misconception: 'arithmetic_slip' },
    ],
    solution: 'SI = (1000 × 5 × 2) / 100 = 10000 / 100 = ₹100.',
    estimatedTimeSec: 30,
  },
  {
    id: 'CQ.03-03', skillId: 'CQ.03', skillName: 'Simple interest and profit / loss in context',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find the simple interest on ₹2,500 at 8% per year for 3 years, in rupees.',
    inputHint: 'Enter a whole number of rupees.',
    acceptedAnswers: ['600'],
    errorPatterns: [
      { answers: ['200'], misconception: 'arithmetic_slip' },
      { answers: ['60'], misconception: 'form_error' },
      { answers: ['6000'], misconception: 'form_error' },
    ],
    solution: 'SI = (2500 × 8 × 3) / 100 = 60000 / 100 = ₹600.',
    estimatedTimeSec: 35,
  },
  {
    id: 'CQ.03-04', skillId: 'CQ.03', skillName: 'Simple interest and profit / loss in context',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A shopkeeper buys a bag for ₹400 and sells it for ₹500. Find the PROFIT PERCENT.',
    inputHint: 'Enter a whole-number percent (no % sign).',
    acceptedAnswers: ['25'],
    errorPatterns: [
      { answers: ['20'], misconception: 'conceptual_gap' },
      { answers: ['100'], misconception: 'conceptual_gap' },
      { answers: ['125'], misconception: 'conceptual_gap' },
    ],
    solution: 'Profit = 500 − 400 = 100. Profit % = (Profit / Cost Price) × 100 = (100 / 400) × 100 = 25%.',
    estimatedTimeSec: 45,
  },
  {
    id: 'CQ.03-05', skillId: 'CQ.03', skillName: 'Simple interest and profit / loss in context',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'A trader buys rice for ₹50/kg and sells it for ₹45/kg. Find the LOSS PERCENT.',
    inputHint: 'Enter a whole-number percent (no % sign).',
    acceptedAnswers: ['10'],
    errorPatterns: [
      { answers: ['5'], misconception: 'conceptual_gap' },
      { answers: ['11'], misconception: 'conceptual_gap' },
      { answers: ['50'], misconception: 'conceptual_gap' },
    ],
    solution: 'Loss = 50 − 45 = 5. Loss % = (Loss / Cost Price) × 100 = (5 / 50) × 100 = 10%.',
    estimatedTimeSec: 45,
  },
  {
    id: 'CQ.03-06', skillId: 'CQ.03', skillName: 'Simple interest and profit / loss in context',
    difficulty: 6, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric', stem: 'Meera borrows ₹5,000 from her uncle at 6% per year. How much in TOTAL (principal + simple interest) must she repay after 4 years, in rupees?',
    inputHint: 'Enter a whole number of rupees.',
    acceptedAnswers: ['6200'],
    errorPatterns: [
      { answers: ['1200'], misconception: 'conceptual_gap' },
      { answers: ['5300'], misconception: 'arithmetic_slip' },
      { answers: ['6000'], misconception: 'arithmetic_slip' },
    ],
    solution: 'SI = (5000 × 6 × 4) / 100 = 1200. Total = Principal + SI = 5000 + 1200 = ₹6,200.',
    estimatedTimeSec: 55,
  },
  {
    id: 'CQ.03-07', skillId: 'CQ.03', skillName: 'Simple interest and profit / loss in context',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'A book is sold at a 20% profit for ₹360. What was the COST PRICE, in rupees?',
    inputHint: 'Enter a whole number of rupees.',
    acceptedAnswers: ['300'],
    errorPatterns: [
      { answers: ['288'], misconception: 'operation_confusion' },
      { answers: ['72'], misconception: 'conceptual_gap' },
      { answers: ['432'], misconception: 'operation_confusion' },
    ],
    solution: 'SP = CP × (1 + 20/100) = 1.2 × CP. So 1.2 × CP = 360 → CP = 360 / 1.2 = ₹300.',
    estimatedTimeSec: 65,
  },
  {
    id: 'CQ.03-08', skillId: 'CQ.03', skillName: 'Simple interest and profit / loss in context',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'At what annual simple-interest RATE will ₹4,000 earn ₹600 in interest over 3 years? (Enter a whole-number percent — no % sign.)',
    inputHint: 'Enter a whole-number percent.',
    acceptedAnswers: ['5'],
    errorPatterns: [
      { answers: ['15'], misconception: 'arithmetic_slip' },
      { answers: ['50'], misconception: 'form_error' },
      { answers: ['200'], misconception: 'operation_confusion' },
    ],
    solution: 'SI = (P × R × T) / 100 → 600 = (4000 × R × 3) / 100 = 120R. So R = 600 / 120 = 5%.',
    estimatedTimeSec: 60,
  },

  // =========================================================================
  // DH.01 — Read pictographs, bar graphs, and double-bar graphs
  // =========================================================================
  {
    id: 'DH.01-01', skillId: 'DH.01', skillName: 'Read pictographs, bar graphs, and double-bar graphs',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'In a PICTOGRAPH, one icon usually represents:',
    options: [
      { text: 'A fixed number of units (the "scale")', misconception: 'none' },
      { text: 'Exactly one unit', misconception: 'conceptual_gap' },
      { text: 'A percent', misconception: 'conceptual_gap' },
      { text: 'A category label', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'A pictograph uses an icon to stand for a fixed quantity (e.g., "1 book = 10 readers"). That quantity is the scale.',
    estimatedTimeSec: 25,
  },
  {
    id: 'DH.01-02', skillId: 'DH.01', skillName: 'Read pictographs, bar graphs, and double-bar graphs',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'In a pictograph, one ★ stands for 5 students. A class shows ★★★★ for "loves cricket". How many students love cricket?',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['20'],
    errorPatterns: [
      { answers: ['4'], misconception: 'conceptual_gap' },
      { answers: ['9'], misconception: 'operation_confusion' },
      { answers: ['25'], misconception: 'arithmetic_slip' },
    ],
    solution: '4 stars × 5 students each = 20 students.',
    estimatedTimeSec: 25,
  },
  {
    id: 'DH.01-03', skillId: 'DH.01', skillName: 'Read pictographs, bar graphs, and double-bar graphs',
    difficulty: 4, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'A bar graph shows: Mon = 12, Tue = 8, Wed = 15, Thu = 9, Fri = 11. On which day were the FEWEST visitors recorded?',
    options: [
      { text: 'Tuesday', misconception: 'none' },
      { text: 'Thursday', misconception: 'arithmetic_slip' },
      { text: 'Monday', misconception: 'conceptual_gap' },
      { text: 'Friday', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Smallest value is 8, on Tuesday.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DH.01-04', skillId: 'DH.01', skillName: 'Read pictographs, bar graphs, and double-bar graphs',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Bar graph (books sold): Mon 12, Tue 8, Wed 15, Thu 9, Fri 11. What is the TOTAL number of books sold from Monday to Friday?',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['55'],
    errorPatterns: [
      { answers: ['45'], misconception: 'arithmetic_slip' },
      { answers: ['65'], misconception: 'arithmetic_slip' },
      { answers: ['15'], misconception: 'conceptual_gap' },
    ],
    solution: '12 + 8 + 15 + 9 + 11 = 55.',
    estimatedTimeSec: 35,
  },
  {
    id: 'DH.01-05', skillId: 'DH.01', skillName: 'Read pictographs, bar graphs, and double-bar graphs',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'A double-bar graph compares boys and girls scoring full marks in 4 tests. Boys: 6, 8, 7, 9. Girls: 5, 9, 8, 10. In which test number is the girls\' bar TALLER than the boys\' bar by exactly 1? (Enter the earliest such test number.)',
    inputHint: 'Enter a test number (1, 2, 3, or 4).',
    acceptedAnswers: ['2'],
    errorPatterns: [
      { answers: ['4'], misconception: 'arithmetic_slip' },
      { answers: ['1'], misconception: 'arithmetic_slip' },
      { answers: ['3'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Differences (girls − boys): −1, +1, +1, +1. The earliest test where girls exceed boys by 1 is test 2.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DH.01-06', skillId: 'DH.01', skillName: 'Read pictographs, bar graphs, and double-bar graphs',
    difficulty: 6, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'A double-bar graph compares spending (₹ thousand) on Books and Toys for 3 children. Books: 4, 6, 5. Toys: 2, 3, 4. What is the TOTAL spending on books and toys across all 3 children, in ₹ thousand?',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['24'],
    errorPatterns: [
      { answers: ['15'], misconception: 'arithmetic_slip' },
      { answers: ['9'], misconception: 'conceptual_gap' },
      { answers: ['22'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Books total = 4+6+5 = 15. Toys total = 2+3+4 = 9. Grand total = 15+9 = 24 (₹ thousand).',
    estimatedTimeSec: 50,
  },
  {
    id: 'DH.01-07', skillId: 'DH.01', skillName: 'Read pictographs, bar graphs, and double-bar graphs',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'In a pictograph, 1 icon = 8 mangoes. A village shows 6½ icons. How many mangoes does this represent?',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['52'],
    errorPatterns: [
      { answers: ['48'], misconception: 'arithmetic_slip' },
      { answers: ['56'], misconception: 'arithmetic_slip' },
      { answers: ['65'], misconception: 'conceptual_gap' },
    ],
    solution: '6.5 × 8 = 52. The half icon represents half of 8 = 4, so 6×8 + 4 = 48 + 4 = 52.',
    estimatedTimeSec: 50,
  },
  {
    id: 'DH.01-08', skillId: 'DH.01', skillName: 'Read pictographs, bar graphs, and double-bar graphs',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'A bar graph shows rainfall (mm) in 4 weeks: 30, 40, 50, 60. Which statement is TRUE?',
    options: [
      { text: 'Rainfall in Week 4 is twice that of Week 1.', misconception: 'none' },
      { text: 'The total rainfall is 100 mm.', misconception: 'arithmetic_slip' },
      { text: 'Rainfall in Week 1 is twice that of Week 4.', misconception: 'operation_confusion' },
      { text: 'Average weekly rainfall is 50 mm.', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Week 4 = 60 mm, Week 1 = 30 mm. 60 = 2 × 30, so Week 4 is twice Week 1. Total = 180 mm. Mean = 45 mm.',
    estimatedTimeSec: 55,
  },

  // =========================================================================
  // DH.02 — Mean, median, mode
  // =========================================================================
  {
    id: 'DH.02-01', skillId: 'DH.02', skillName: 'Mean, median, and mode of small datasets',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find the MEAN of: 4, 6, 8.',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['6'],
    errorPatterns: [
      { answers: ['18'], misconception: 'conceptual_gap' },
      { answers: ['8'], misconception: 'conceptual_gap' },
      { answers: ['4'], misconception: 'conceptual_gap' },
    ],
    solution: 'Mean = (4 + 6 + 8) / 3 = 18 / 3 = 6.',
    estimatedTimeSec: 25,
  },
  {
    id: 'DH.02-02', skillId: 'DH.02', skillName: 'Mean, median, and mode of small datasets',
    difficulty: 3, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'The MODE of a dataset is:',
    options: [
      { text: 'The value that appears most often', misconception: 'none' },
      { text: 'The middle value when ordered', misconception: 'conceptual_gap' },
      { text: 'The sum divided by the count', misconception: 'conceptual_gap' },
      { text: 'The range', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Mode = value with the highest frequency. (Median is the middle value; mean is the sum÷count.)',
    estimatedTimeSec: 25,
  },
  {
    id: 'DH.02-03', skillId: 'DH.02', skillName: 'Mean, median, and mode of small datasets',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find the MEDIAN of: 7, 3, 9, 5, 11.',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['7'],
    errorPatterns: [
      { answers: ['9'], misconception: 'conceptual_gap' },
      { answers: ['5'], misconception: 'conceptual_gap' },
      { answers: ['8'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Sort: 3, 5, 7, 9, 11. Middle (3rd) value = 7.',
    estimatedTimeSec: 35,
  },
  {
    id: 'DH.02-04', skillId: 'DH.02', skillName: 'Mean, median, and mode of small datasets',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find the MODE of: 4, 7, 4, 2, 7, 4, 9.',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['4'],
    errorPatterns: [
      { answers: ['7'], misconception: 'conceptual_gap' },
      { answers: ['37'], misconception: 'conceptual_gap' },
      { answers: ['5'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Frequency: 4 appears 3 times, 7 twice, others once. Mode = 4.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DH.02-05', skillId: 'DH.02', skillName: 'Mean, median, and mode of small datasets',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find the MEAN of the marks: 12, 15, 11, 14, 18.',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['14'],
    errorPatterns: [
      { answers: ['15'], misconception: 'arithmetic_slip' },
      { answers: ['70'], misconception: 'conceptual_gap' },
      { answers: ['13'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Sum = 12+15+11+14+18 = 70. Mean = 70 / 5 = 14.',
    estimatedTimeSec: 35,
  },
  {
    id: 'DH.02-06', skillId: 'DH.02', skillName: 'Mean, median, and mode of small datasets',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric', stem: 'Find the MEDIAN of: 6, 8, 4, 10, 12, 2. (Note: 6 values — median is the mean of the two middle values.)',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['7'],
    errorPatterns: [
      { answers: ['8'], misconception: 'conceptual_gap' },
      { answers: ['6'], misconception: 'conceptual_gap' },
      { answers: ['9'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Sort: 2, 4, 6, 8, 10, 12. Two middle values: 6 and 8. Median = (6+8)/2 = 7.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DH.02-07', skillId: 'DH.02', skillName: 'Mean, median, and mode of small datasets',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'numeric', stem: 'The mean of five numbers is 20. Four of them are 18, 22, 19, 21. Find the fifth number.',
    inputHint: 'Enter a whole number.',
    acceptedAnswers: ['20'],
    errorPatterns: [
      { answers: ['80'], misconception: 'conceptual_gap' },
      { answers: ['100'], misconception: 'conceptual_gap' },
      { answers: ['19'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Sum of all five = 5 × 20 = 100. Sum of given four = 18+22+19+21 = 80. Fifth = 100 − 80 = 20.',
    estimatedTimeSec: 55,
  },
  {
    id: 'DH.02-08', skillId: 'DH.02', skillName: 'Mean, median, and mode of small datasets',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'A dataset is: 5, 5, 7, 9, 12, 15. Which statement is TRUE?',
    options: [
      { text: 'Mean > Median > Mode', misconception: 'none' },
      { text: 'Mode > Median > Mean', misconception: 'conceptual_gap' },
      { text: 'Mean = Median = Mode', misconception: 'conceptual_gap' },
      { text: 'Mean < Median < Mode', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Mean = (5+5+7+9+12+15)/6 = 53/6 ≈ 8.83. Median = (7+9)/2 = 8. Mode = 5. So Mean (≈8.83) > Median (8) > Mode (5).',
    estimatedTimeSec: 60,
  },

  // =========================================================================
  // DH.03 — Basic probability
  // =========================================================================
  {
    id: 'DH.03-01', skillId: 'DH.03', skillName: 'Basic probability of equally likely outcomes',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'A fair coin is tossed once. What is the probability of getting HEADS?',
    options: [
      { text: '1/2', misconception: 'none' },
      { text: '1', misconception: 'conceptual_gap' },
      { text: '0', misconception: 'conceptual_gap' },
      { text: '2', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'A fair coin has 2 equally likely outcomes (H, T); only 1 is favourable. P(H) = 1/2.',
    estimatedTimeSec: 25,
  },
  {
    id: 'DH.03-02', skillId: 'DH.03', skillName: 'Basic probability of equally likely outcomes',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'A fair six-sided die is rolled. What is the probability of getting a 4?',
    options: [
      { text: '1/6', misconception: 'none' },
      { text: '1/3', misconception: 'conceptual_gap' },
      { text: '1/4', misconception: 'conceptual_gap' },
      { text: '4/6', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '6 equally likely outcomes; 1 is favourable. P(4) = 1/6.',
    estimatedTimeSec: 25,
  },
  {
    id: 'DH.03-03', skillId: 'DH.03', skillName: 'Basic probability of equally likely outcomes',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'A fair six-sided die is rolled. What is the probability of getting an EVEN number?',
    options: [
      { text: '1/2', misconception: 'none' },
      { text: '1/3', misconception: 'conceptual_gap' },
      { text: '2/3', misconception: 'conceptual_gap' },
      { text: '1/6', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Even outcomes: 2, 4, 6 → 3 favourable / 6 total = 1/2.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DH.03-04', skillId: 'DH.03', skillName: 'Basic probability of equally likely outcomes',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A bag contains 3 red, 4 green, and 5 blue marbles, all the same size. One marble is drawn at random. What is the probability that it is GREEN?',
    options: [
      { text: '1/3', misconception: 'none' },
      { text: '4/3', misconception: 'form_error' },
      { text: '1/4', misconception: 'conceptual_gap' },
      { text: '4/12', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Total marbles = 12. Green = 4. P(green) = 4/12 = 1/3.',
    estimatedTimeSec: 35,
  },
  {
    id: 'DH.03-05', skillId: 'DH.03', skillName: 'Basic probability of equally likely outcomes',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A spinner has 8 equal sectors numbered 1–8. What is the probability of the pointer landing on a NUMBER GREATER THAN 5?',
    options: [
      { text: '3/8', misconception: 'none' },
      { text: '5/8', misconception: 'conceptual_gap' },
      { text: '1/2', misconception: 'conceptual_gap' },
      { text: '4/8', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Greater than 5: {6, 7, 8} → 3 favourable / 8 total = 3/8.',
    estimatedTimeSec: 35,
  },
  {
    id: 'DH.03-06', skillId: 'DH.03', skillName: 'Basic probability of equally likely outcomes',
    difficulty: 6, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'The probability of an EVENT is always:',
    options: [
      { text: 'Between 0 and 1 (inclusive)', misconception: 'none' },
      { text: 'Always greater than 1', misconception: 'conceptual_gap' },
      { text: 'A negative number is allowed', misconception: 'conceptual_gap' },
      { text: 'Exactly 1/2', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Probability is a number from 0 (impossible) to 1 (certain). It can never be negative or greater than 1.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DH.03-07', skillId: 'DH.03', skillName: 'Basic probability of equally likely outcomes',
    difficulty: 7, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'A fair die is rolled. What is the probability of getting a PRIME number?',
    options: [
      { text: '1/2', misconception: 'none' },
      { text: '1/3', misconception: 'conceptual_gap' },
      { text: '2/3', misconception: 'conceptual_gap' },
      { text: '1/6', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Primes among 1–6: {2, 3, 5} → 3 favourable / 6 total = 1/2. (1 is not prime.)',
    estimatedTimeSec: 45,
  },
  {
    id: 'DH.03-08', skillId: 'DH.03', skillName: 'Basic probability of equally likely outcomes',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'A bag has 10 balls: 7 white and 3 black. The probability of drawing a WHITE ball is 7/10. What is the probability of drawing a ball that is NOT WHITE?',
    options: [
      { text: '3/10', misconception: 'none' },
      { text: '7/10', misconception: 'conceptual_gap' },
      { text: '1/10', misconception: 'conceptual_gap' },
      { text: '10/3', misconception: 'form_error' },
    ],
    correctIndex: 0,
    solution: 'P(not white) = 1 − P(white) = 1 − 7/10 = 3/10. Or directly: 3 black / 10 total.',
    estimatedTimeSec: 50,
  },
];

// ---------------------------------------------------------------------------
// Lessons (9)
// ---------------------------------------------------------------------------
// Concise lesson scaffolds for each Class 7 starter skill. Same Lesson
// shape as Class 6; rich materials are omitted for the starter (the
// lessonFor() helper falls back to the base Lesson when no rich entry
// exists).

export const CLASS7_LESSONS: Record<SkillId, Lesson> = {
  'IR.01': {
    skillId: 'IR.01',
    intro:
      'An integer is a whole number, positive, negative, or zero. Adding and subtracting integers follows sign rules: same signs add and keep the sign; different signs subtract magnitudes and keep the sign of the larger magnitude. Subtracting is the same as adding the additive inverse: a - b = a + (-b).',
    reteach: {
      title: 'Reteach: integer addition and subtraction',
      steps: [
        'SAME SIGNS: add magnitudes and keep the common sign. -7 + -4 = -(7+4) = -11.',
        'DIFFERENT SIGNS: subtract magnitudes and keep the sign of the larger one. -3 + 5 = +(5-3) = +2.',
        'SUBTRACTING A NEGATIVE flips the sign: 6 - (-9) = 6 + 9 = 15.',
        'For multi-step expressions, work left to right, applying these rules at each step.',
      ],
    },
    visualExplanation: {
      caption: 'Placeholder marker. Picture a horizontal number line marked from -10 to +10. Adding a positive moves right; adding a negative (or subtracting a positive) moves left.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Mark 0 in the middle of the line. Positive numbers to the right, negatives to the left.',
        'For -3 + 5: start at -3 (3 steps left of 0). Add 5 → move 5 steps right → land at +2.',
        'For 6 - (-9): start at 6. Subtracting -9 is the same as moving RIGHT 9 → land at +15.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute: (-12) - (-5) + 3',
        steps: [
          'Rewrite subtractions: -12 + 5 + 3.',
          'Left to right: -12 + 5 = -7.',
          'Then -7 + 3 = -4.',
        ],
        answer: '-4',
      },
      {
        problem: 'A diver at -18 m rises 11 m, then descends 4 m. What is the new depth?',
        steps: [
          'Start at -18. Rise 11: -18 + 11 = -7.',
          'Descend 4: -7 - 4 = -11.',
        ],
        answer: '-11 m',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Forgetting that subtracting a negative is the same as adding',
        example: '6 - (-9) → 6 - 9 = -3.',
        why: 'Students see two minus signs and treat them as one subtraction.',
        fix: 'Read aloud: "minus a negative equals plus". Rewrite 6 - (-9) as 6 + 9 before computing.',
      },
      {
        pattern: 'Sign confusion with mixed-sign addition',
        example: '-3 + 5 → -8 (added without considering signs).',
        why: 'Reflex of adding magnitudes without checking signs.',
        fix: 'When signs differ, subtract magnitudes and take the sign of the bigger one.',
      },
    ],
    practice: ['IR.01-01', 'IR.01-03', 'IR.01-04', 'IR.01-06', 'IR.01-08'],
    teacherNote:
      'Spend 10 minutes at a number line on the board. Have students physically point to "start" then walk the operations one step at a time. This anchors the sign rules.',
    parentNote:
      'Use temperature changes to practise: "It was -2°C this morning and warmed up by 7°C — what is it now?" (5°C.) Real contexts make the sign rules feel obvious.',
  },

  'IR.02': {
    skillId: 'IR.02',
    intro:
      'The sign rule for multiplication and division: SAME signs → POSITIVE result, DIFFERENT signs → NEGATIVE result. (Negative × negative = positive; negative ÷ positive = negative.) For a product of several integers, count negatives: an even count gives positive, an odd count gives negative.',
    reteach: {
      title: 'Reteach: integer multiplication and division',
      steps: [
        'Compute the unsigned product (multiply or divide the magnitudes).',
        'Apply the sign rule: same signs → +, different signs → −.',
        'For 3+ factors: count negatives. EVEN → positive; ODD → negative.',
        'Division uses the same sign rule as multiplication.',
      ],
    },
    visualExplanation: {
      caption: 'Placeholder marker. Imagine grouping objects: -4 × 3 means "3 groups of taking 4 away", giving -12.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Compute the unsigned product: 4 × 3 = 12.',
        'Both signs are different (negative × positive), so the result is negative: -12.',
        'For -4 × -3: signs are the same, so the result is positive: 12.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute: (-8) × (-3) ÷ 4',
        steps: [
          'Left to right: -8 × -3 = 24 (two negatives → positive).',
          '24 ÷ 4 = 6.',
        ],
        answer: '6',
      },
      {
        problem: 'A submarine descends 5 m every minute. Depth after 7 minutes?',
        steps: [
          'Each minute: -5 m of depth.',
          'After 7 minutes: 7 × (-5) = -35 m.',
        ],
        answer: '-35 m',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Forgetting that negative × negative = positive',
        example: '-5 × -6 = -30.',
        why: 'Students apply "two negatives is more negative" by analogy with addition.',
        fix: 'Drill the sign rule: same signs always give positive in multiplication/division.',
      },
    ],
    practice: ['IR.02-01', 'IR.02-02', 'IR.02-04', 'IR.02-06', 'IR.02-08'],
    teacherNote:
      'A small sign-rule poster on the wall (×: ++ = +, -- = +, +- = -, -+ = -) reduces revisit time in subsequent lessons.',
    parentNote:
      'Money examples land well: "If you lose ₹50 every week for 4 weeks, your balance changes by 4 × (-50) = -200." Same maths, intuitive context.',
  },

  'IR.03': {
    skillId: 'IR.03',
    intro:
      'A RATIONAL NUMBER is any number expressible as p/q where p is an integer and q is a non-zero integer. This includes all integers (n = n/1), all proper and improper fractions, and all terminating decimals. Two rational numbers can always be compared by rewriting them with a common denominator.',
    reteach: {
      title: 'Reteach: rational numbers',
      steps: [
        'Recognise p/q form: 3 = 3/1, -2/5, 0/7, and 1.5 = 3/2 are all rational.',
        'Standard form: positive denominator, lowest terms.',
        'Compare by finding a common denominator and looking at the numerators on the number line.',
        'Between ANY two distinct rationals lie INFINITELY many more.',
        'Add/subtract rationals like fractions: common denominator, then combine numerators.',
      ],
    },
    visualExplanation: {
      caption: 'Placeholder marker. Picture a number line with integers marked; rationals fill the line densely between them.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Mark -1, 0, 1 on the line.',
        'Between 0 and 1, mark 1/2, 1/3, 1/4 — they get closer to 0 as the denominator grows.',
        'Negative rationals mirror across 0: -1/2 is the same distance from 0 as +1/2, on the LEFT.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute: 1/2 + (-1/3)',
        steps: [
          'Common denominator 6: 1/2 = 3/6, -1/3 = -2/6.',
          'Add numerators: 3 + (-2) = 1.',
          'Result: 1/6.',
        ],
        answer: '1/6',
      },
      {
        problem: 'Distance between 2/3 and -1/4 on the number line.',
        steps: [
          'Distance = |2/3 - (-1/4)| = |2/3 + 1/4|.',
          'Common denominator 12: 8/12 + 3/12 = 11/12.',
        ],
        answer: '11/12',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Comparing -3/4 and -2/3 by ignoring signs',
        example: '"3/4 > 2/3, so -3/4 > -2/3"',
        why: 'Treats negative fractions like positive ones.',
        fix: 'On the number line, the more negative number is FURTHER LEFT. -3/4 is to the LEFT of -2/3, so -3/4 < -2/3.',
      },
    ],
    practice: ['IR.03-01', 'IR.03-02', 'IR.03-04', 'IR.03-05', 'IR.03-08'],
    teacherNote:
      'Start with a "what counts as a rational number?" sorting activity — give 12 cards and have students sort into rational vs not. The 5/0 trap reveals the q ≠ 0 condition.',
    parentNote:
      'Cooking is full of rational numbers: 1/2 cup, 3/4 cup, 1 1/2 cups. Combining recipes is fraction arithmetic in disguise.',
  },

  'FE.01': {
    skillId: 'FE.01',
    intro:
      'To MULTIPLY two fractions, multiply numerators together and denominators together: a/b × c/d = (a·c)/(b·d). Simplify before or after. To DIVIDE by a fraction, multiply by its RECIPROCAL: a/b ÷ c/d = a/b × d/c. Convert mixed numbers to improper fractions first.',
    reteach: {
      title: 'Reteach: multiply and divide fractions',
      steps: [
        'For multiplication: write each as a/b form; multiply tops, multiply bottoms; simplify.',
        'For division: flip the divisor (its reciprocal), then multiply.',
        'For mixed numbers: convert to improper first, then apply the rule.',
        'For "fraction of a number": "of" means multiply. "Half of 10" = 1/2 × 10 = 5.',
      ],
    },
    visualExplanation: {
      caption: 'Placeholder marker. Multiplying fractions = taking a fraction OF a fraction, area-model. 1/2 × 3/4 = the 3/4 of half a unit square = 3/8 of the whole.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Draw a unit square. Shade half of it horizontally.',
        'Now shade three-quarters of the shaded half vertically.',
        'The double-shaded area is 3 out of 8 little rectangles → 3/8.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute: 2/3 ÷ 4/5',
        steps: [
          'Flip the divisor: 4/5 → 5/4.',
          'Multiply: 2/3 × 5/4 = 10/12.',
          'Simplify: HCF(10,12) = 2 → 5/6.',
        ],
        answer: '5/6',
      },
      {
        problem: 'A 9 1/2 m ribbon is cut into 1 1/4 m pieces. How many full pieces?',
        steps: [
          'Improper: 9 1/2 = 19/2, 1 1/4 = 5/4.',
          'Divide: 19/2 ÷ 5/4 = 19/2 × 4/5 = 76/10 = 7.6.',
          'Integer part = 7 full pieces.',
        ],
        answer: '7',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Cross-multiplying when multiplying fractions',
        example: '1/2 × 3/4 → 4/6 (multiplied across).',
        why: 'Cross-multiplication is for comparing equivalences, not for products.',
        fix: 'Multiplication is straight across: top × top, bottom × bottom. Cross-multiply only when asked to compare or solve a proportion.',
      },
      {
        pattern: 'Forgetting to flip when dividing',
        example: '2/3 ÷ 4/5 → 8/15.',
        why: 'Reflex of "multiply across" carries over to division.',
        fix: 'Mantra: "Keep, change, flip." Keep the first fraction, change ÷ to ×, flip the second.',
      },
    ],
    practice: ['FE.01-01', 'FE.01-03', 'FE.01-04', 'FE.01-05', 'FE.01-08'],
    teacherNote:
      'Hand pairs of students a recipe halved or doubled — they have to multiply each ingredient by 1/2 or 2 and check the totals.',
    parentNote:
      '"Half of half a pizza" is a quarter — that\'s 1/2 × 1/2 = 1/4. Fraction multiplication at the dinner table is friendly territory.',
  },

  'FE.02': {
    skillId: 'FE.02',
    intro:
      'Multiplying a decimal by a power of 10 shifts the decimal point to the RIGHT by that many places. Dividing by a power of 10 shifts it to the LEFT. So 4.7 × 100 = 470 and 4.7 ÷ 100 = 0.047.',
    reteach: {
      title: 'Reteach: × and ÷ by powers of 10',
      steps: [
        'For × 10ⁿ: move the decimal point n places to the RIGHT.',
        'For ÷ 10ⁿ: move the decimal point n places to the LEFT.',
        'Pad with zeros when needed (0.045 × 1000 → move 3 right → 45.).',
        'Pad with leading zeros when needed (3 ÷ 100 → 0.03).',
      ],
    },
    visualExplanation: {
      caption: 'Placeholder marker. Picture a place-value chart. Multiplying by 10 shifts every digit one column LEFT (place value grows by ×10), but the digits do not move — the decimal point moves RIGHT.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Write 4.7 in the chart: 4 in ones, 7 in tenths.',
        'Multiply by 10: each digit moves up one place value. 4 → tens, 7 → ones. So 4.7 × 10 = 47.',
        'Divide by 10: each digit moves down one place value. 4 → tenths, 7 → hundredths. So 4.7 ÷ 10 = 0.47.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute: 0.045 × 1000',
        steps: [
          'Move the decimal point 3 places to the RIGHT.',
          '0.045 → 0.45 → 4.5 → 45.',
        ],
        answer: '45',
      },
      {
        problem: 'A box of 1000 paper clips weighs 850 g. Weight per clip?',
        steps: [
          '850 ÷ 1000: move decimal 3 places to the LEFT.',
          '850. → 85.0 → 8.50 → 0.850 g per clip.',
        ],
        answer: '0.85 g',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Adding zeros instead of shifting the decimal',
        example: '0.36 × 100 → 0.36000.',
        why: 'Students treat × 100 as "append zeros" without considering the decimal point.',
        fix: 'Always SHIFT the decimal point; only pad zeros to fill empty places.',
      },
    ],
    practice: ['FE.02-01', 'FE.02-03', 'FE.02-04', 'FE.02-06', 'FE.02-08'],
    teacherNote:
      'A 30-second "shift drill": call out a number and a power of 10, students raise their hand to indicate left/right shift count. Pacy and high-yield.',
    parentNote:
      'Currency conversion is a great context: 1 USD = 80 INR → 1 paisa = 1/100 INR. Multiplying/dividing by 100 is everywhere when handling money.',
  },

  'FE.03': {
    skillId: 'FE.03',
    intro:
      'Decimal arithmetic to the thousandths place uses the same column rules as for tenths and hundredths: line up the decimal point, pad with trailing zeros to equal length, then add/subtract column by column. For multiplication, count total decimal places in the factors. For division, scale both numbers so the divisor is whole, then divide as usual.',
    reteach: {
      title: 'Reteach: decimals to thousandths',
      steps: [
        'ADDITION/SUBTRACTION: pad each decimal to the same number of decimal places, then line up the decimal points.',
        'MULTIPLICATION: ignore decimals, multiply, then place the decimal point — total decimal places = sum of decimal places in the factors.',
        'DIVISION: multiply both by the same power of 10 to make the divisor a whole number, then divide as usual.',
        'Check by estimation: 0.4 × 0.3 ≈ 0.12, not 1.2.',
      ],
    },
    visualExplanation: {
      caption: 'Placeholder marker. A place-value chart with ones, tenths, hundredths, thousandths makes column-aligned addition obvious.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Write 1.234 in the chart: 1 in ones, 2 in tenths, 3 in hundredths, 4 in thousandths.',
        'Add 0.500: 0 ones, 5 tenths, 0 hundredths, 0 thousandths.',
        'Add column by column: 4 + 0 = 4, 3 + 0 = 3, 2 + 5 = 7, 1 + 0 = 1. Result: 1.734.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute: 0.4 × 0.3',
        steps: [
          'Multiply ignoring decimals: 4 × 3 = 12.',
          'Total decimal places: 1 + 1 = 2.',
          'Place the decimal point: 0.12.',
        ],
        answer: '0.12',
      },
      {
        problem: 'A 1.250 kg bag is shared into 5 equal portions. Each weight?',
        steps: [
          '1.250 ÷ 5 = 0.250.',
        ],
        answer: '0.25 kg',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Right-aligning instead of decimal-aligning',
        example: 'Adding 1.234 + 0.5 → 1.239 (right-aligned).',
        why: 'Reflex from whole-number addition.',
        fix: 'Always line up the DECIMAL POINTS, not the right edges.',
      },
      {
        pattern: 'Forgetting decimal-place count when multiplying',
        example: '0.4 × 0.3 → 1.2 (wrong by factor of 10).',
        why: 'Students apply the digits-only product without re-placing the decimal point.',
        fix: 'Always estimate: 0.4 (about half) × 0.3 (about a third) should be small — about 0.12, not 1.2.',
      },
    ],
    practice: ['FE.03-01', 'FE.03-03', 'FE.03-05', 'FE.03-06', 'FE.03-08'],
    teacherNote:
      'A 5-minute estimation round before any decimal calculation: students predict whether the answer is bigger than, smaller than, or about equal to one of the factors. Saves many sign / place errors.',
    parentNote:
      'A grocery bill is a thousandths-arithmetic playground. Estimate the total, then add up to check.',
  },

  'AE.01': {
    skillId: 'AE.01',
    intro:
      'LIKE TERMS share the same variable and the same exponent on that variable. Only like terms can be combined into a single term, by adding or subtracting their coefficients. 3x + 5x = 8x; 5x and 5x² are NOT like terms.',
    reteach: {
      title: 'Reteach: combining like terms',
      steps: [
        'Identify the terms in the expression (separated by + or -).',
        'Group like terms (same variable, same exponent).',
        'Add or subtract the coefficients within each group.',
        'Constants combine with other constants.',
        'For expressions with brackets, DISTRIBUTE first.',
      ],
    },
    visualExplanation: {
      caption: 'Placeholder marker. Like terms are "the same kind of thing". You can add apples to apples; you cannot add apples to oranges.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        '3x means "3 x-things". 5x means "5 more x-things". Together: 8 x-things = 8x.',
        '3x + 4y: x-things and y-things are different kinds — you cannot combine them.',
        '5x and 5x² are also different kinds: x = "x-things", x² = "x-squared things".',
      ],
    },
    workedExamples: [
      {
        problem: 'Simplify: 6x + 2y - 3x - 5y + x',
        steps: [
          'x-terms: 6x - 3x + x = (6 - 3 + 1)x = 4x.',
          'y-terms: 2y - 5y = (2 - 5)y = -3y.',
          'Combine: 4x - 3y.',
        ],
        answer: '4x - 3y',
      },
      {
        problem: 'Simplify: 4(2x - 1) - (x + 3)',
        steps: [
          'Distribute the 4: 8x - 4.',
          'Distribute the leading minus: -x - 3.',
          'Combine: (8x - x) + (-4 - 3) = 7x - 7.',
        ],
        answer: '7x - 7',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Adding unlike terms',
        example: '3x + 4y → 7xy.',
        why: 'Treats + as if it always combines into a single term.',
        fix: 'Only LIKE terms combine. If the variables or exponents differ, leave them separate.',
      },
    ],
    practice: ['AE.01-01', 'AE.01-03', 'AE.01-05', 'AE.01-06', 'AE.01-08'],
    teacherNote:
      'Coloured pencils help: have students underline each variable type with a different colour, then combine within colour.',
    parentNote:
      'Shopping carts are a like-terms metaphor: 3 apples + 5 apples = 8 apples; 3 apples + 2 oranges stays 3 apples + 2 oranges.',
  },

  'AE.02': {
    skillId: 'AE.02',
    intro:
      'Evaluating an expression at a value means substituting the value for the variable EVERYWHERE it appears, then computing with BODMAS / sign rules. Pay close attention to signs: -x for x = -5 is +5; (-3)² is +9 but -3² is -9.',
    reteach: {
      title: 'Reteach: evaluating with negatives',
      steps: [
        'Substitute the value for the variable everywhere it appears.',
        'Wrap the substituted value in BRACKETS to keep its sign clear.',
        'Apply BODMAS: brackets → orders → ÷/× → +/−.',
        'Special care: (-3)² = +9 because the bracket squares both the sign and the digit; -3² = -9 because the minus is applied AFTER squaring.',
      ],
    },
    visualExplanation: {
      caption: 'Placeholder marker. Substitution is "find-and-replace": every occurrence of x becomes the given value.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'For 3x + 5 at x = -2: rewrite as 3(-2) + 5.',
        'Multiply first: 3(-2) = -6.',
        'Add: -6 + 5 = -1.',
      ],
    },
    workedExamples: [
      {
        problem: 'If x = -4, find x² + 3x.',
        steps: [
          'x² = (-4)² = 16. (Bracket the negative before squaring.)',
          '3x = 3 × (-4) = -12.',
          'Sum: 16 + (-12) = 4.',
        ],
        answer: '4',
      },
      {
        problem: 'If y = -1, find 4(y - 2).',
        steps: [
          'Brackets first: y - 2 = -1 - 2 = -3.',
          'Multiply: 4 × -3 = -12.',
        ],
        answer: '-12',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Squaring a negative without brackets',
        example: '(-4)² → -16.',
        why: 'Students forget that the negative is part of x and must be squared too.',
        fix: 'Always write (-4)² with the bracket explicit. The bracket squares both the sign and the digit.',
      },
    ],
    practice: ['AE.02-01', 'AE.02-03', 'AE.02-04', 'AE.02-07', 'AE.02-08'],
    teacherNote:
      'A "substitute and slow down" worksheet: students must show the substituted expression with brackets BEFORE simplifying. Almost all sign errors disappear.',
    parentNote:
      'A formula like F = 9C/5 + 32 (Fahrenheit from Celsius) is great practice. Try C = -10 → F = -14. Sign rules in everyday life.',
  },

  'AE.03': {
    skillId: 'AE.03',
    intro:
      'A TWO-STEP equation needs two inverse operations to isolate the variable. Pattern: ax + b = c → first subtract b from both sides, then divide by a. The order matters: undo addition/subtraction first, then multiplication/division.',
    reteach: {
      title: 'Reteach: solving two-step equations',
      steps: [
        'Identify the variable term (e.g., 2x in 2x + 3 = 11).',
        'UNDO the addition or subtraction first to isolate the variable term.',
        'UNDO the multiplication or division next.',
        'Whatever you do to one side, do to the OTHER side.',
        'Verify by substituting back.',
      ],
    },
    visualExplanation: {
      caption: 'Placeholder marker. A balance scale: keep it balanced by doing the same operation on both pans.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Draw 2x + 3 on the left pan and 11 on the right pan; they balance.',
        'Remove 3 from BOTH pans: 2x on the left, 8 on the right; still balanced.',
        'Halve BOTH pans (divide by 2): x on the left, 4 on the right. So x = 4.',
      ],
    },
    workedExamples: [
      {
        problem: 'Solve for x: 4x - 7 = 9',
        steps: [
          'Add 7 to both sides: 4x = 16.',
          'Divide both sides by 4: x = 4.',
          'Check: 4(4) - 7 = 16 - 7 = 9. ✓',
        ],
        answer: 'x = 4',
      },
      {
        problem: 'A taxi charges ₹50 plus ₹15/km. Bill is ₹185. How many km?',
        steps: [
          'Set up: 15k + 50 = 185.',
          'Subtract 50: 15k = 135.',
          'Divide by 15: k = 9 km.',
        ],
        answer: '9 km',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Doing the operations in the wrong order',
        example: '2x + 3 = 11 → divide first: x + 3 = 5.5 → x = 2.5.',
        why: 'Students apply the inverse for the variable\'s coefficient before clearing the constant.',
        fix: 'Always isolate the variable TERM first (clear the constant), then isolate the variable itself.',
      },
    ],
    practice: ['AE.03-01', 'AE.03-03', 'AE.03-05', 'AE.03-06', 'AE.03-08'],
    teacherNote:
      'A two-step-equation race in pairs: each pair gets 10 cards, swaps after solving 5, and checks each other\'s work. Builds fluency and catches common slips.',
    parentNote:
      'Phone-bill equations and recipe-scaling are great real-world two-steppers. Pose puzzles: "I doubled my number and added 5, getting 17. What was it?"',
  },

  // v0.25 — Class 7 deepening lessons
  'LA.01': {
    skillId: 'LA.01',
    intro:
      'Two angles are COMPLEMENTARY if they add to 90° and SUPPLEMENTARY if they add to 180°. When two lines cross, the angles opposite each other (the "vertically opposite" pair) are equal, and any two angles on a straight line form a linear pair that sums to 180°.',
    reteach: {
      title: 'Reteach: angle pairs at a point',
      steps: [
        'COMPLEMENTARY: two angles together make a right angle (90°). To find the complement, do 90 − given.',
        'SUPPLEMENTARY: two angles together make a straight angle (180°). Find a supplement by doing 180 − given.',
        'LINEAR PAIR: any two adjacent angles on a straight line are supplementary (sum 180°).',
        'VERTICALLY OPPOSITE: when two lines cross, opposite angles are equal.',
      ],
    },
    workedExamples: [
      {
        problem: 'An angle is twice its complement. Find the angle.',
        steps: [
          'Let the angle be x. Its complement is 90 − x.',
          'Condition: x = 2(90 − x) → x = 180 − 2x.',
          '3x = 180, so x = 60°.',
        ],
        answer: '60°',
      },
      {
        problem: 'Two lines meet, forming angles in ratio 1:2:1:2. Find the smallest angle.',
        steps: [
          'Angles around a point sum to 360°.',
          '1+2+1+2 = 6 parts. One part = 360 ÷ 6 = 60°.',
        ],
        answer: '60°',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Confusing complementary and supplementary',
        example: 'Asked for the supplement of 35°, students reply 55°.',
        why: 'They reach for 90 − instead of 180 −.',
        fix: 'Tag: Complement = Corner (90°); Supplement = Straight (180°). Both start with C/S.',
      },
      {
        pattern: 'Thinking vertically opposite angles are supplementary',
        example: 'When two lines cross and one angle is 73°, students give the opposite as 107°.',
        why: 'They mix up "linear pair" (adjacent on a line) with "vertically opposite" (across the X).',
        fix: 'Draw the X. Mark equal opposite pairs in matching colours.',
      },
    ],
    practice: ['LA.01-01', 'LA.01-03', 'LA.01-04', 'LA.01-06', 'LA.01-08'],
    teacherNote:
      'Use a single board sketch with two intersecting lines and label all four angles. Have students mark complementary, supplementary, linear pair, and vertically opposite relationships in colour.',
    parentNote:
      'Practice with real objects: where two paths cross, where a book leans against a wall. Estimate first, then verify with a protractor.',
  },

  'LA.02': {
    skillId: 'LA.02',
    intro:
      'When two parallel lines are cut by a transversal, eight angles are formed. Corresponding angles (same relative position) are equal. Alternate interior angles (opposite sides of the transversal, between the parallels) are equal. Co-interior angles (same side, between the parallels) are SUPPLEMENTARY — they add to 180°.',
    reteach: {
      title: 'Reteach: transversal across parallel lines',
      steps: [
        'Draw two parallel lines and one transversal. Mark all 8 angles.',
        'CORRESPONDING angles → EQUAL.',
        'ALTERNATE INTERIOR angles → EQUAL (Z-pattern).',
        'CO-INTERIOR angles → SUPPLEMENTARY, sum 180° (C-pattern).',
        'Use these relationships to find any unknown angle from a single known angle.',
      ],
    },
    workedExamples: [
      {
        problem: 'L₁ ∥ L₂. A transversal makes 65° at the first intersection. Find the corresponding angle at the second intersection.',
        steps: [
          'Corresponding angles on parallel lines are equal.',
          'So the corresponding angle = 65°.',
        ],
        answer: '65°',
      },
      {
        problem: 'L₁ ∥ L₂. Corresponding angles are (2x+10)° and (3x−20)°. Find x.',
        steps: [
          'Set them equal: 2x + 10 = 3x − 20.',
          'Subtract 2x: 10 = x − 20.',
          'Add 20: x = 30.',
        ],
        answer: '30',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Treating co-interior angles as equal',
        example: 'For co-interior angles 110° and y°, students answer y = 110.',
        why: 'They blur "co-interior" with "alternate".',
        fix: 'Use the C-shape mnemonic: C is for Co-interior, "Closed angle sum" → 180°. Z-shape is for Alternate (equal).',
      },
      {
        pattern: 'Applying parallel-line rules when lines are NOT parallel',
        example: 'Students assume corresponding angles are equal in a generic diagram.',
        why: 'They forget that the rules require the parallel condition.',
        fix: 'Check for parallel markers (matching arrows) before applying.',
      },
    ],
    practice: ['LA.02-01', 'LA.02-03', 'LA.02-04', 'LA.02-06', 'LA.02-08'],
    teacherNote:
      'Use a strip of paper as a transversal across two parallel rulers. Move it and ask students to predict which pairs change together. The kinaesthetic step locks in the relationships.',
    parentNote:
      'Look around — railway tracks crossed by a road, lines on graph paper. Each crossing shows the same eight angles in action.',
  },

  'LA.03': {
    skillId: 'LA.03',
    intro:
      'The three interior angles of any triangle always sum to 180°. A useful consequence is the EXTERIOR-ANGLE PROPERTY: an exterior angle of a triangle equals the sum of the two non-adjacent (interior opposite) angles.',
    reteach: {
      title: 'Reteach: triangle angle sums',
      steps: [
        'ANGLE SUM: a + b + c = 180° for the three interior angles of any triangle.',
        'EXTERIOR ANGLE = sum of the two interior opposite angles.',
        'In a RIGHT triangle, the two non-right angles are complementary (sum 90°).',
        'In an ISOSCELES triangle, the angles opposite the equal sides are equal.',
      ],
    },
    workedExamples: [
      {
        problem: 'Angles 50° and 60° are given. Find the third angle.',
        steps: [
          'Sum to 180°: third = 180 − (50 + 60) = 70°.',
        ],
        answer: '70°',
      },
      {
        problem: 'Angles in ratio 3:4:5. Find the largest angle.',
        steps: [
          '3 + 4 + 5 = 12 parts = 180°. One part = 15°.',
          'Largest = 5 × 15 = 75°.',
        ],
        answer: '75°',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Forgetting the angle sum is 180° (not 360°)',
        example: 'Given 50° and 60°, students answer 250°.',
        why: 'They mix the triangle (180°) with a quadrilateral (360°) or full turn (360°).',
        fix: 'Anchor: "Tri-angle = 180°. Quadri-lateral = 360°." Tear the corners off a paper triangle to see they fit on a straight line.',
      },
      {
        pattern: 'Equating exterior angle to one (not sum) of interior opposites',
        example: 'Given exterior 130°, one interior opposite 65°, students answer 130° − 65° instead of 65°.',
        why: 'They forget the property and reach for "subtract from 180°".',
        fix: 'State and use the exact rule: exterior = sum of two interior opposite angles.',
      },
    ],
    practice: ['LA.03-01', 'LA.03-03', 'LA.03-04', 'LA.03-06', 'LA.03-08'],
    teacherNote:
      'Have students tear off the three corners of a paper triangle and arrange them along a straight line. The visual proof of "sum = 180°" is unforgettable.',
    parentNote:
      'Triangles are everywhere — roof trusses, sandwich slices, the sail of a boat. Pick one, estimate the three angles, and check they sum to 180°.',
  },

  'CQ.01': {
    skillId: 'CQ.01',
    intro:
      'A percentage is just a fraction with denominator 100. Move smoothly between FRACTION, DECIMAL, and PERCENTAGE: divide the fraction to get a decimal; multiply by 100 to get a percent; divide a percent by 100 to recover the decimal.',
    reteach: {
      title: 'Reteach: F ↔ D ↔ %',
      steps: [
        'FRACTION → DECIMAL: divide numerator by denominator.',
        'DECIMAL → PERCENT: multiply by 100 (shift decimal two places RIGHT).',
        'PERCENT → DECIMAL: divide by 100 (shift two places LEFT).',
        'PERCENT → FRACTION: write as /100 and simplify.',
      ],
    },
    workedExamples: [
      {
        problem: 'Convert 7/8 to a percentage.',
        steps: [
          '7 ÷ 8 = 0.875.',
          '0.875 × 100 = 87.5%.',
        ],
        answer: '87.5%',
      },
      {
        problem: 'Order 0.6, 5/8, 65%, 11/20 from smallest to largest.',
        steps: [
          'Convert each to a decimal: 0.6, 0.625, 0.65, 0.55.',
          'Sort: 0.55 < 0.6 < 0.625 < 0.65.',
          'Therefore 11/20 < 0.6 < 5/8 < 65%.',
        ],
        answer: '11/20, 0.6, 5/8, 65%',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Shifting the decimal the wrong way',
        example: '60% written as 6 or 6.0 instead of 0.6.',
        why: 'They forget direction: to remove the % sign you divide by 100 (shift LEFT).',
        fix: 'Mnemonic: "% out → / by 100 (shift left)". Always say it aloud during conversion.',
      },
      {
        pattern: 'Treating denominators as always 100',
        example: '3/5 = 3%.',
        why: 'They confuse "per cent" (per hundred) with raw numerator.',
        fix: 'Rewrite 3/5 = 60/100 = 60% explicitly.',
      },
    ],
    practice: ['CQ.01-02', 'CQ.01-03', 'CQ.01-04', 'CQ.01-06', 'CQ.01-08'],
    teacherNote:
      'A 3-column board (Fraction | Decimal | Percent) with 12 rows works wonders. Fill in any one column per row and have students complete the other two.',
    parentNote:
      'Shop receipts, sale boards, and battery indicators are full of conversions. Ask: "If a shirt is 25% off ₹800, what is the new price?"',
  },

  'CQ.02': {
    skillId: 'CQ.02',
    intro:
      'To find a PERCENT OF a quantity, convert the percent to a fraction or decimal and multiply. PERCENT CHANGE = (change / original) × 100. Reverse questions ("after a 12% rise, the new amount is X — find the original") need a single equation: 1.12 × original = X.',
    reteach: {
      title: 'Reteach: percent of, percent change, and reverse',
      steps: [
        'PERCENT OF: p% of A = (p/100) × A.',
        'PERCENT INCREASE: new = original × (1 + p/100).',
        'PERCENT DECREASE: new = original × (1 − p/100).',
        'REVERSE: divide the new value by the multiplier to recover the original.',
      ],
    },
    workedExamples: [
      {
        problem: 'After a 12% pay rise, Rohit earns ₹28,000. What was his earlier salary?',
        steps: [
          'New = 1.12 × original.',
          '28000 = 1.12 × original.',
          'original = 28000 ÷ 1.12 = 25000.',
        ],
        answer: '₹25,000',
      },
      {
        problem: 'A price first rises by 20% and then falls by 20%. What is the net change?',
        steps: [
          'Start at 100. After +20%: 120. After −20% of 120: 120 − 24 = 96.',
          'Net change = 96 − 100 = −4, i.e. a 4% decrease.',
        ],
        answer: '4% decrease',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Assuming "up p%, then down p%" returns to the original',
        example: 'Up 20%, then down 20% → back to 100.',
        why: 'They forget the second percent is taken from a larger base.',
        fix: 'Always compute step by step on the actual base; expect a net DECREASE.',
      },
      {
        pattern: 'Using the new value as the base in percent change',
        example: 'Price falls from ₹500 to ₹400; students compute 100/400 × 100 = 25%.',
        why: 'They mix up old base with new base.',
        fix: 'Rule: divide by the ORIGINAL, never the new value.',
      },
    ],
    practice: ['CQ.02-02', 'CQ.02-04', 'CQ.02-05', 'CQ.02-07', 'CQ.02-08'],
    teacherNote:
      'A sale-tag activity: hand each pair a "before" and "after" price; ask for the percent change. Then run the reverse: give percent change + "after"; ask for "before".',
    parentNote:
      'Discount adverts are a great prompt. "30% off ₹1200 — what do you pay?" The arithmetic becomes routine quickly.',
  },

  'CQ.03': {
    skillId: 'CQ.03',
    intro:
      'SIMPLE INTEREST is the interest on a fixed principal at a yearly rate over a number of years: SI = (P × R × T) / 100. In trade, PROFIT % = (Profit / Cost Price) × 100 and LOSS % = (Loss / Cost Price) × 100. Profit and loss percent are ALWAYS expressed with respect to the cost price.',
    reteach: {
      title: 'Reteach: SI and profit/loss',
      steps: [
        'SIMPLE INTEREST: SI = (P × R × T) / 100. R is the annual percent rate, T is years.',
        'AMOUNT (total repayable) = P + SI.',
        'PROFIT % = (SP − CP) / CP × 100, when SP > CP.',
        'LOSS % = (CP − SP) / CP × 100, when CP > SP.',
      ],
    },
    workedExamples: [
      {
        problem: 'Find SI on ₹2,500 at 8% per year for 3 years.',
        steps: [
          'SI = (2500 × 8 × 3) / 100.',
          '= 60000 / 100 = ₹600.',
        ],
        answer: '₹600',
      },
      {
        problem: 'A book is sold for ₹360 at a 20% profit. Find the cost price.',
        steps: [
          'SP = CP × (1 + 20/100) = 1.2 × CP.',
          '1.2 × CP = 360.',
          'CP = 360 / 1.2 = ₹300.',
        ],
        answer: '₹300',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Computing profit % using SP as the base',
        example: 'CP ₹400, SP ₹500 → 100/500 × 100 = 20%.',
        why: 'They divide by the wrong base.',
        fix: 'Rule: divide by COST PRICE, not selling price.',
      },
      {
        pattern: 'Forgetting to add principal in "total to repay"',
        example: 'For ₹5,000 at 6% × 4 years, students answer ₹1,200 instead of ₹6,200.',
        why: 'They report SI as the total.',
        fix: 'Always read the question: "interest" vs "amount" vs "total repayable".',
      },
    ],
    practice: ['CQ.03-02', 'CQ.03-04', 'CQ.03-05', 'CQ.03-06', 'CQ.03-08'],
    teacherNote:
      'Make a real-world worksheet: a savings deposit + a small-shop pricing table. Students compute SI for one and profit/loss percent for the other and reflect on what is fair.',
    parentNote:
      'Bank account statements and small purchases at the market are great real contexts. Even a chocolate bought wholesale and sold to a sibling at "+10%" makes the formula click.',
  },

  'DH.01': {
    skillId: 'DH.01',
    intro:
      'PICTOGRAPHS use icons (each standing for a fixed number — the SCALE) to compare categories. BAR GRAPHS use parallel bars whose heights show frequency. DOUBLE-BAR GRAPHS compare two related datasets side by side (e.g., boys vs girls, this year vs last year).',
    reteach: {
      title: 'Reteach: reading graphs',
      steps: [
        'PICTOGRAPH: identify the icon scale (e.g., 1 ★ = 5 students), then multiply.',
        'BAR GRAPH: each bar height = the value for that category. Read off the y-axis.',
        'DOUBLE-BAR GRAPH: two bars per category. Compare heights to find differences.',
        'Always read the title, axis labels, and legend BEFORE drawing conclusions.',
      ],
    },
    workedExamples: [
      {
        problem: 'A pictograph uses 1 ★ = 8 mangoes. A village shows 6½ stars. How many mangoes?',
        steps: [
          'Each ★ = 8. A half-star = 4.',
          '6 × 8 + 4 = 48 + 4 = 52.',
        ],
        answer: '52',
      },
      {
        problem: 'Bar graph (visitors): Mon 12, Tue 8, Wed 15, Thu 9, Fri 11. Total visitors?',
        steps: [
          'Add: 12 + 8 + 15 + 9 + 11.',
          '= 55.',
        ],
        answer: '55',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Ignoring the pictograph scale',
        example: 'Pupils count 4 stars and answer "4" when 1 ★ = 5.',
        why: 'They overlook the legend.',
        fix: 'Before computing, circle the scale ("1 icon = ?") in the legend.',
      },
      {
        pattern: 'Misreading bar heights against a non-1 scale',
        example: 'A y-axis in tens (10, 20, 30…); students read a 25-bar as 2.5.',
        why: 'They miss the axis scaling.',
        fix: 'Always state the unit aloud — "this axis is in TENS".',
      },
    ],
    practice: ['DH.01-02', 'DH.01-03', 'DH.01-04', 'DH.01-06', 'DH.01-07'],
    teacherNote:
      'Build a class double-bar graph (boys/girls) for any quick survey. Students draw it themselves, then swap and read each other\'s charts.',
    parentNote:
      'Newspapers and cricket score apps are full of bar graphs. Pick one, decode the axis units, and see how quickly the story is clear.',
  },

  'DH.02': {
    skillId: 'DH.02',
    intro:
      'The MEAN is the arithmetic average (sum ÷ count). The MEDIAN is the middle value when the data is sorted (for an even count, average the two middle values). The MODE is the value that appears most often. Use all three to summarise the "centre" of a dataset from different angles.',
    reteach: {
      title: 'Reteach: mean, median, and mode',
      steps: [
        'MEAN: add all values, divide by the number of values.',
        'MEDIAN: sort ascending. Odd count → middle value. Even count → average the two middle values.',
        'MODE: the value with the highest frequency. A dataset may have one mode, multiple modes, or none.',
        'Check using a small known dataset before applying to bigger ones.',
      ],
    },
    workedExamples: [
      {
        problem: 'Find the mean of 12, 15, 11, 14, 18.',
        steps: [
          'Sum = 12 + 15 + 11 + 14 + 18 = 70.',
          'Count = 5.',
          'Mean = 70 / 5 = 14.',
        ],
        answer: '14',
      },
      {
        problem: 'Find the median of 6, 8, 4, 10, 12, 2.',
        steps: [
          'Sort: 2, 4, 6, 8, 10, 12.',
          'Even count (6 values): average the 3rd and 4th values.',
          'Median = (6 + 8) / 2 = 7.',
        ],
        answer: '7',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Forgetting to SORT before taking the median',
        example: 'Median of 7, 3, 9, 5, 11 reported as 9 (the middle of the unsorted list).',
        why: 'They take the middle position without sorting first.',
        fix: 'Step 1 is ALWAYS to sort ascending.',
      },
      {
        pattern: 'Reporting frequency instead of the mode value',
        example: 'Mode of {4,7,4,2,7,4,9} reported as 3 (because 4 appears 3 times).',
        why: 'They confuse "most frequent" with "how many times".',
        fix: 'Mode = the VALUE itself; here, 4.',
      },
    ],
    practice: ['DH.02-01', 'DH.02-03', 'DH.02-05', 'DH.02-07', 'DH.02-08'],
    teacherNote:
      'Have students collect a small dataset from the class — heights, daily reading minutes, number of siblings — and compute mean/median/mode together. Real data makes the comparison meaningful.',
    parentNote:
      'Cricket batting averages, exam marks, daily temperatures — choose any 5–7 numbers and find all three measures. Discuss which one tells the most useful story.',
  },

  'DH.03': {
    skillId: 'DH.03',
    intro:
      'When outcomes are EQUALLY LIKELY, the probability of an event is (favourable outcomes) / (total outcomes). Probabilities always lie between 0 (impossible) and 1 (certain). P(not A) = 1 − P(A).',
    reteach: {
      title: 'Reteach: simple probability',
      steps: [
        'List all equally likely outcomes (the SAMPLE SPACE).',
        'Identify favourable outcomes for the event.',
        'P(event) = favourable / total.',
        'For the complement: P(not A) = 1 − P(A).',
      ],
    },
    workedExamples: [
      {
        problem: 'A bag has 3 red, 4 green, and 5 blue marbles. P(green)?',
        steps: [
          'Total = 3 + 4 + 5 = 12.',
          'Favourable (green) = 4.',
          'P(green) = 4/12 = 1/3.',
        ],
        answer: '1/3',
      },
      {
        problem: 'A fair die is rolled. P(prime)?',
        steps: [
          'Sample space: 1, 2, 3, 4, 5, 6.',
          'Primes: 2, 3, 5. (1 is NOT prime.)',
          'P(prime) = 3/6 = 1/2.',
        ],
        answer: '1/2',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Counting 1 as prime',
        example: 'P(prime) on a die reported as 4/6 = 2/3.',
        why: 'Students mis-remember the definition (1 is divisible only by itself, but the rule excludes 1).',
        fix: 'Memorise: primes are 2, 3, 5, 7, 11… (1 is excluded by definition.)',
      },
      {
        pattern: 'Reporting probability greater than 1',
        example: 'P(green) reported as 4/3 from 4 green out of 12.',
        why: 'They invert numerator and denominator.',
        fix: 'Probability is always between 0 and 1. Estimate first; reject any answer outside that range.',
      },
    ],
    practice: ['DH.03-02', 'DH.03-04', 'DH.03-05', 'DH.03-07', 'DH.03-08'],
    teacherNote:
      'A bag of coloured chits is the cheapest probability lab. Predict before each draw, count after a class\'s worth of draws, and compare empirical vs theoretical probabilities.',
    parentNote:
      'Card games, dice games, and weather forecasts are full of probability talk. Ask: "What is the chance of …?" and check by listing equally likely cases.',
  },
} as Partial<Record<SkillId, Lesson>> as Record<SkillId, Lesson>;

// ---------------------------------------------------------------------------
// Alignment metadata (9)
// ---------------------------------------------------------------------------
// All 9 alignment rows carry alignmentConfidence: 'needs_teacher_review'
// so the Alignment Review screen surfaces them as starter content.
// (Per-item alignment overrides aren't needed — the starter items inherit
// the skill-level alignment.)

export const CLASS7_ALIGNMENT: Record<SkillId, SkillAlignment> = {
  'IR.01': {
    skillId: 'IR.01',
    skillName: 'Add and subtract integers',
    moduleId: 'c7_integers',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Integers chapter: addition and subtraction with sign rules, number-line representation.',
    learningOutcome:
      'Adds and subtracts integers fluently using sign rules and the additive-inverse identity (a - b = a + (-b)).',
    competencyStatement:
      'Computes signed sums and differences of integers; explains why subtracting a negative is the same as adding the positive.',
    prerequisiteSkills: ['FR.05'],
    cognitiveFocus: 'procedural',
  },
  'IR.02': {
    skillId: 'IR.02',
    skillName: 'Multiply and divide integers',
    moduleId: 'c7_integers',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Integers chapter: multiplication and division sign rules; multi-factor products.',
    learningOutcome:
      'Multiplies and divides integers using the sign rule (same → +, different → −) and applies the even/odd-count rule for multi-factor products.',
    competencyStatement:
      'Computes signed products and quotients; explains the even-/odd-count rule for multiple negatives.',
    prerequisiteSkills: ['IR.01'],
    cognitiveFocus: 'procedural',
  },
  'IR.03': {
    skillId: 'IR.03',
    skillName: 'Introduction to rational numbers',
    moduleId: 'c7_integers',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Rational Numbers chapter: definition (p/q with q ≠ 0), standard form, comparison and ordering, density.',
    learningOutcome:
      'Recognises rational numbers in p/q form, compares and orders them on a number line, and performs basic addition / subtraction across signs.',
    competencyStatement:
      'Identifies, compares, and operates on rational numbers; recognises that infinitely many rationals lie between any two distinct rationals.',
    prerequisiteSkills: ['FR.03', 'IR.01'],
    cognitiveFocus: 'conceptual',
  },
  'FE.01': {
    skillId: 'FE.01',
    skillName: 'Multiply and divide fractions',
    moduleId: 'c7_fractions_ext',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Fractions and Decimals chapter: multiplication of fractions (including by whole numbers and mixed numbers); division by reciprocal.',
    learningOutcome:
      'Multiplies and divides fractions and mixed numbers; applies the "keep, change, flip" rule and converts mixed↔improper as needed.',
    competencyStatement:
      'Computes fraction products and quotients in lowest terms; solves "fraction of a quantity" and unit-rate word problems.',
    prerequisiteSkills: ['FR.04', 'FR.06'],
    cognitiveFocus: 'procedural',
  },
  'FE.02': {
    skillId: 'FE.02',
    skillName: 'Multiply and divide by powers of 10',
    moduleId: 'c7_fractions_ext',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Fractions and Decimals chapter: place-value shifts when multiplying/dividing by 10, 100, 1000.',
    learningOutcome:
      'Multiplies and divides decimals by powers of 10 by shifting the decimal point; pads with zeros correctly.',
    competencyStatement:
      'Applies place-value shift rules for ×/÷ by 10, 100, 1000 across positive and negative powers.',
    prerequisiteSkills: ['DE.01'],
    cognitiveFocus: 'procedural',
  },
  'FE.03': {
    skillId: 'FE.03',
    skillName: 'Decimal arithmetic to thousandths',
    moduleId: 'c7_fractions_ext',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Fractions and Decimals chapter: addition, subtraction, multiplication, and division of decimals up to thousandths.',
    learningOutcome:
      'Performs decimal arithmetic to the thousandths place: column-aligned add/subtract; decimal-place counting for multiplication; scaling for division.',
    competencyStatement:
      'Computes decimal sums, differences, products, and quotients reliably; applies estimation as a sanity check.',
    prerequisiteSkills: ['DE.04', 'FE.02'],
    cognitiveFocus: 'procedural',
  },
  'AE.01': {
    skillId: 'AE.01',
    skillName: 'Combine like terms',
    moduleId: 'c7_algebra_ext',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Algebraic Expressions chapter: like terms, simplification, distribution over brackets.',
    learningOutcome:
      'Identifies like terms; simplifies algebraic expressions by combining coefficients; applies distribution over brackets.',
    competencyStatement:
      'Combines like terms and distributes single-term factors over brackets to simplify expressions.',
    prerequisiteSkills: ['AL.02'],
    cognitiveFocus: 'procedural',
  },
  'AE.02': {
    skillId: 'AE.02',
    skillName: 'Evaluate expressions with negatives',
    moduleId: 'c7_algebra_ext',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Algebraic Expressions chapter: substitution for the variable, BODMAS, signed arithmetic.',
    learningOutcome:
      'Substitutes positive and negative values for variables and applies BODMAS with sign rules to evaluate expressions.',
    competencyStatement:
      'Evaluates algebraic expressions at signed values; distinguishes (-3)² from -3².',
    prerequisiteSkills: ['AL.03', 'IR.02'],
    cognitiveFocus: 'procedural',
  },
  'AE.03': {
    skillId: 'AE.03',
    skillName: 'Two-step equations',
    moduleId: 'c7_algebra_ext',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Simple Equations chapter: two-step linear equations of the form ax + b = c.',
    learningOutcome:
      'Solves two-step linear equations by first undoing addition/subtraction and then division/multiplication; verifies by substitution.',
    competencyStatement:
      'Solves ax + b = c (and variants with division) and translates simple word problems into two-step equations.',
    prerequisiteSkills: ['AL.04', 'AE.01'],
    cognitiveFocus: 'procedural',
  },

  // v0.25 — Class 7 deepening alignment
  'LA.01': {
    skillId: 'LA.01',
    skillName: 'Complementary, supplementary, and vertically opposite angles',
    moduleId: 'c7_lines_angles',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Lines and Angles chapter: complementary and supplementary angles, vertically opposite angles, linear pair.',
    learningOutcome:
      'Identifies complementary, supplementary, linear-pair, and vertically opposite angles and computes missing angle measures in each pair.',
    competencyStatement:
      'Applies angle-pair relationships at a point and on intersecting lines to solve numerical and reasoning problems.',
    prerequisiteSkills: ['GB.03', 'GB.04'],
    cognitiveFocus: 'conceptual',
  },
  'LA.02': {
    skillId: 'LA.02',
    skillName: 'Angles on parallel lines cut by a transversal',
    moduleId: 'c7_lines_angles',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Lines and Angles chapter: corresponding, alternate (interior and exterior), and co-interior angle relationships on parallel lines cut by a transversal.',
    learningOutcome:
      'Identifies corresponding, alternate, and co-interior angle pairs on parallel lines cut by a transversal and uses their equality / supplementarity to find unknown angles.',
    competencyStatement:
      'Reasons about angles on parallel lines and solves linear equations arising from these relationships.',
    prerequisiteSkills: ['GB.02', 'LA.01'],
    cognitiveFocus: 'reasoning',
  },
  'LA.03': {
    skillId: 'LA.03',
    skillName: 'Angle sum property of a triangle',
    moduleId: 'c7_lines_angles',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — The Triangle and its Properties chapter: angle sum property (180°) and the exterior angle property.',
    learningOutcome:
      'Applies the triangle angle-sum property and the exterior-angle property to compute missing angles and classify triangles.',
    competencyStatement:
      'Solves triangle-angle problems including ratio, isosceles, right-angle, and exterior-angle reasoning.',
    prerequisiteSkills: ['GB.05', 'LA.01'],
    cognitiveFocus: 'reasoning',
  },
  'CQ.01': {
    skillId: 'CQ.01',
    skillName: 'Convert between fractions, decimals, and percentages',
    moduleId: 'c7_comparing_quantities',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Comparing Quantities chapter: equivalence of fractions, decimals, and percentages.',
    learningOutcome:
      'Converts smoothly between fractions, decimals, and percentages and compares quantities across these forms.',
    competencyStatement:
      'Recognises a percentage as a fraction over 100; converts between F, D, and % and orders mixed-form quantities.',
    prerequisiteSkills: ['FR.03', 'DE.02'],
    cognitiveFocus: 'procedural',
  },
  'CQ.02': {
    skillId: 'CQ.02',
    skillName: 'Percentage of a quantity and percent change',
    moduleId: 'c7_comparing_quantities',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Comparing Quantities chapter: finding a percent of a quantity; percent increase and decrease; reverse problems.',
    learningOutcome:
      'Finds a percent of a given quantity, computes percent change (increase or decrease), and solves reverse problems given the final amount.',
    competencyStatement:
      'Applies percent-of and percent-change operators in everyday contexts including discounts, pay rises, and population growth.',
    prerequisiteSkills: ['CQ.01', 'RP.04'],
    cognitiveFocus: 'application',
  },
  'CQ.03': {
    skillId: 'CQ.03',
    skillName: 'Simple interest and profit / loss in context',
    moduleId: 'c7_comparing_quantities',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Comparing Quantities chapter: simple interest formula and profit/loss percent.',
    learningOutcome:
      'Applies SI = (P × R × T)/100 and the profit/loss percent formulas in everyday financial contexts and reverse problems.',
    competencyStatement:
      'Solves SI, total-amount, profit/loss, and reverse profit-cost-price problems with correct base (CP) for percent.',
    prerequisiteSkills: ['CQ.02'],
    cognitiveFocus: 'application',
  },
  'DH.01': {
    skillId: 'DH.01',
    skillName: 'Read pictographs, bar graphs, and double-bar graphs',
    moduleId: 'c7_data_handling',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Data Handling chapter: pictographs, bar graphs, double-bar graphs.',
    learningOutcome:
      'Reads and interprets pictographs (with a scale), bar graphs, and double-bar graphs; identifies trends and compares categories.',
    competencyStatement:
      'Extracts totals, differences, maxima, and comparisons from pictographs, bar graphs, and double-bar graphs.',
    prerequisiteSkills: ['FR.05'],
    cognitiveFocus: 'application',
  },
  'DH.02': {
    skillId: 'DH.02',
    skillName: 'Mean, median, and mode of small datasets',
    moduleId: 'c7_data_handling',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Data Handling chapter: arithmetic mean, median, and mode of small datasets.',
    learningOutcome:
      'Computes the mean, median, and mode of small (≤ 10 value) datasets and interprets their relative meaning.',
    competencyStatement:
      'Selects an appropriate measure of central tendency given a question and dataset.',
    prerequisiteSkills: ['DE.04', 'DH.01'],
    cognitiveFocus: 'procedural',
  },
  'DH.03': {
    skillId: 'DH.03',
    skillName: 'Basic probability of equally likely outcomes',
    moduleId: 'c7_data_handling',
    chapterReference:
      'NCERT / Ganita Prakash Class 7 — Data Handling chapter (probability strand): equally likely outcomes, P(event) = favourable / total.',
    learningOutcome:
      'Computes basic probabilities under the equally-likely-outcomes model for coins, dice, spinners, and simple draws; uses P(not A) = 1 − P(A).',
    competencyStatement:
      'Lists sample spaces and computes probabilities of simple events and their complements.',
    prerequisiteSkills: ['FR.03'],
    cognitiveFocus: 'conceptual',
  },
} as Partial<Record<SkillId, SkillAlignment>> as Record<SkillId, SkillAlignment>;
