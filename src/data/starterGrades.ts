// v0.29 — Starter Math content for Classes 1–5 and 8–12.
//
// ============================================================
// IMPORTANT — READ BEFORE USING THIS CONTENT
// ============================================================
// This file contains PROTOTYPE STARTER items so every one of the
// 12 grades in Pragati has SOMETHING to assess. It is not
// - not CBSE- or NCERT-verified,
// - not reviewed by a subject-matter teacher,
// - not calibrated,
// - not sequenced against any specific chapter or textbook.
//
// All modules and skills authored here are registered with
// `availability: 'teacher_review_required'`. The teacher-facing
// item review workflow shows every one of these items with a
// "needs teacher review" flag. Do NOT ship these items to real
// students in a pilot without a teacher walking the bank.
// ============================================================
//
// Structure (matches the Class 7 starter pattern from v0.23):
//   - 1 mathematics module per grade
//   - 3 skills per module
//   - 4 items per skill (2 foundational, 1 core, 1 advanced)
//   - 12 items × 10 grades = 120 items total
//
// Misconception tags reuse the existing taxonomy
// (conceptual_gap, arithmetic_slip, operation_confusion, form_error)
// so the diagnostic roll-up still works. Distractors are picked to
// look plausible, but the misconception mapping is a heuristic
// approximation — real distractor design needs teacher input.

import type { Item } from './items';

// Convenience — every item in this file uses the same shared shape.
// Cognitive type defaults to Procedural fluency (safest default for
// prototype items — no visual, no application context).
function mcq(args: {
  id: string;
  skillId: Item['skillId'];
  skillName: string;
  difficulty: number;
  band: 'foundational' | 'core' | 'advanced';
  stem: string;
  correct: string;
  wrong: [string, string, string];
  solution: string;
  estimatedTimeSec?: number;
}): Item {
  return {
    id: args.id,
    skillId: args.skillId,
    skillName: args.skillName,
    difficulty: args.difficulty,
    band: args.band,
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: args.stem,
    options: [
      { text: args.correct, misconception: 'none' },
      { text: args.wrong[0], misconception: 'conceptual_gap' },
      { text: args.wrong[1], misconception: 'arithmetic_slip' },
      { text: args.wrong[2], misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: args.solution,
    estimatedTimeSec: args.estimatedTimeSec ?? 30,
  } as Item;
}

// ---------------------------------------------------------------------------
// Class 1 — Numbers and Addition Basics (12 items)
// ---------------------------------------------------------------------------
const CLASS1: Item[] = [
  mcq({ id: 'G1.01-01', skillId: 'G1.01', skillName: 'Counting up to 20', difficulty: 1, band: 'foundational',
    stem: 'How many stars? ★ ★ ★ ★', correct: '4', wrong: ['3', '5', '8'],
    solution: 'Count each star one at a time: 1, 2, 3, 4.' }),
  mcq({ id: 'G1.01-02', skillId: 'G1.01', skillName: 'Counting up to 20', difficulty: 2, band: 'foundational',
    stem: 'What number comes just after 12?', correct: '13', wrong: ['11', '14', '20'],
    solution: 'Counting up: 12, then 13.' }),
  mcq({ id: 'G1.01-03', skillId: 'G1.01', skillName: 'Counting up to 20', difficulty: 3, band: 'core',
    stem: 'Which is the biggest number?', correct: '17', wrong: ['9', '15', '11'],
    solution: 'Compare: 17 is the largest.' }),
  mcq({ id: 'G1.01-04', skillId: 'G1.01', skillName: 'Counting up to 20', difficulty: 5, band: 'advanced',
    stem: 'Count backwards from 15. What comes third?', correct: '13', wrong: ['12', '14', '11'],
    solution: '15 → 14 → 13. The third number is 13.' }),

  mcq({ id: 'G1.02-01', skillId: 'G1.02', skillName: 'Single-digit addition', difficulty: 1, band: 'foundational',
    stem: '2 + 3 = ?', correct: '5', wrong: ['4', '6', '1'],
    solution: 'Count on: 2, then 3 more → 5.' }),
  mcq({ id: 'G1.02-02', skillId: 'G1.02', skillName: 'Single-digit addition', difficulty: 2, band: 'foundational',
    stem: '4 + 5 = ?', correct: '9', wrong: ['8', '10', '1'],
    solution: '4 + 5 = 9.' }),
  mcq({ id: 'G1.02-03', skillId: 'G1.02', skillName: 'Single-digit addition', difficulty: 4, band: 'core',
    stem: '7 + 8 = ?', correct: '15', wrong: ['14', '16', '1'],
    solution: '7 + 8 = 15.' }),
  mcq({ id: 'G1.02-04', skillId: 'G1.02', skillName: 'Single-digit addition', difficulty: 5, band: 'advanced',
    stem: 'Three friends bring 4, 3, and 2 apples. How many apples in total?', correct: '9', wrong: ['8', '10', '5'],
    solution: '4 + 3 + 2 = 9.' }),

  mcq({ id: 'G1.03-01', skillId: 'G1.03', skillName: 'Single-digit subtraction', difficulty: 1, band: 'foundational',
    stem: '5 − 2 = ?', correct: '3', wrong: ['2', '4', '7'],
    solution: 'Start at 5, take away 2 → 3.' }),
  mcq({ id: 'G1.03-02', skillId: 'G1.03', skillName: 'Single-digit subtraction', difficulty: 2, band: 'foundational',
    stem: '9 − 4 = ?', correct: '5', wrong: ['4', '6', '13'],
    solution: '9 − 4 = 5.' }),
  mcq({ id: 'G1.03-03', skillId: 'G1.03', skillName: 'Single-digit subtraction', difficulty: 4, band: 'core',
    stem: '8 − 6 = ?', correct: '2', wrong: ['1', '3', '14'],
    solution: '8 − 6 = 2.' }),
  mcq({ id: 'G1.03-04', skillId: 'G1.03', skillName: 'Single-digit subtraction', difficulty: 5, band: 'advanced',
    stem: 'Anu had 10 sweets. She gave 4 to her brother. How many are left?', correct: '6', wrong: ['4', '5', '14'],
    solution: '10 − 4 = 6.' }),
];

// ---------------------------------------------------------------------------
// Class 2 — Place Value and Two-Digit Arithmetic (12 items)
// ---------------------------------------------------------------------------
const CLASS2: Item[] = [
  mcq({ id: 'G2.01-01', skillId: 'G2.01', skillName: 'Place value up to 99', difficulty: 2, band: 'foundational',
    stem: 'In the number 47, what does the 4 mean?', correct: '4 tens', wrong: ['4 ones', '40 tens', '4 hundreds'],
    solution: '47 = 4 tens + 7 ones.' }),
  mcq({ id: 'G2.01-02', skillId: 'G2.01', skillName: 'Place value up to 99', difficulty: 3, band: 'foundational',
    stem: 'How do we write "sixty-three"?', correct: '63', wrong: ['36', '603', '6.3'],
    solution: 'Sixty-three = 6 tens + 3 ones = 63.' }),
  mcq({ id: 'G2.01-03', skillId: 'G2.01', skillName: 'Place value up to 99', difficulty: 4, band: 'core',
    stem: 'Which is larger, 58 or 85?', correct: '85', wrong: ['58', 'They are equal', 'Neither is larger'],
    solution: '85 has 8 tens vs 58 with 5 tens.' }),
  mcq({ id: 'G2.01-04', skillId: 'G2.01', skillName: 'Place value up to 99', difficulty: 6, band: 'advanced',
    stem: 'What is 10 less than 42?', correct: '32', wrong: ['52', '41', '43'],
    solution: '42 − 10 = 32.' }),

  mcq({ id: 'G2.02-01', skillId: 'G2.02', skillName: 'Two-digit addition', difficulty: 2, band: 'foundational',
    stem: '24 + 15 = ?', correct: '39', wrong: ['29', '49', '9'],
    solution: '20 + 10 = 30; 4 + 5 = 9; total = 39.' }),
  mcq({ id: 'G2.02-02', skillId: 'G2.02', skillName: 'Two-digit addition', difficulty: 3, band: 'foundational',
    stem: '36 + 28 = ?', correct: '64', wrong: ['54', '65', '514'],
    solution: '36 + 28: 6+8=14 (write 4, carry 1); 3+2+1=6; answer 64.' }),
  mcq({ id: 'G2.02-03', skillId: 'G2.02', skillName: 'Two-digit addition', difficulty: 5, band: 'core',
    stem: '57 + 26 = ?', correct: '83', wrong: ['73', '84', '723'],
    solution: '7+6=13 (write 3, carry 1); 5+2+1=8; answer 83.' }),
  mcq({ id: 'G2.02-04', skillId: 'G2.02', skillName: 'Two-digit addition', difficulty: 6, band: 'advanced',
    stem: 'A shop sold 47 pens on Monday and 38 on Tuesday. Total?', correct: '85', wrong: ['75', '86', '9'],
    solution: '47 + 38 = 85.' }),

  mcq({ id: 'G2.03-01', skillId: 'G2.03', skillName: 'Two-digit subtraction', difficulty: 2, band: 'foundational',
    stem: '48 − 15 = ?', correct: '33', wrong: ['43', '23', '63'],
    solution: '48 − 15: 8−5=3; 4−1=3; answer 33.' }),
  mcq({ id: 'G2.03-02', skillId: 'G2.03', skillName: 'Two-digit subtraction', difficulty: 3, band: 'foundational',
    stem: '62 − 27 = ?', correct: '35', wrong: ['45', '25', '89'],
    solution: '62 − 27 needs borrowing: 12−7=5; (6−1)−2 = 3; answer 35.' }),
  mcq({ id: 'G2.03-03', skillId: 'G2.03', skillName: 'Two-digit subtraction', difficulty: 5, band: 'core',
    stem: '84 − 39 = ?', correct: '45', wrong: ['55', '44', '46'],
    solution: '84 − 39: 14−9=5, (8−1)−3=4; answer 45.' }),
  mcq({ id: 'G2.03-04', skillId: 'G2.03', skillName: 'Two-digit subtraction', difficulty: 6, band: 'advanced',
    stem: 'A bus has 60 seats. 24 are empty. How many are taken?', correct: '36', wrong: ['84', '46', '26'],
    solution: '60 − 24 = 36.' }),
];

// ---------------------------------------------------------------------------
// Class 3 — Multiplication, Division, Three-digit Place Value (12 items)
// ---------------------------------------------------------------------------
const CLASS3: Item[] = [
  mcq({ id: 'G3.01-01', skillId: 'G3.01', skillName: 'Multiplication tables 2–5', difficulty: 2, band: 'foundational',
    stem: '3 × 4 = ?', correct: '12', wrong: ['7', '9', '16'],
    solution: '3 × 4 = 12.' }),
  mcq({ id: 'G3.01-02', skillId: 'G3.01', skillName: 'Multiplication tables 2–5', difficulty: 3, band: 'foundational',
    stem: '5 × 6 = ?', correct: '30', wrong: ['25', '35', '11'],
    solution: '5 × 6 = 30.' }),
  mcq({ id: 'G3.01-03', skillId: 'G3.01', skillName: 'Multiplication tables 2–5', difficulty: 5, band: 'core',
    stem: '4 × 8 = ?', correct: '32', wrong: ['24', '36', '12'],
    solution: '4 × 8 = 32.' }),
  mcq({ id: 'G3.01-04', skillId: 'G3.01', skillName: 'Multiplication tables 2–5', difficulty: 6, band: 'advanced',
    stem: 'There are 5 boxes with 7 balls each. How many balls in total?', correct: '35', wrong: ['12', '30', '75'],
    solution: '5 × 7 = 35.' }),

  mcq({ id: 'G3.02-01', skillId: 'G3.02', skillName: 'Simple division', difficulty: 2, band: 'foundational',
    stem: '12 ÷ 3 = ?', correct: '4', wrong: ['3', '5', '9'],
    solution: '3 × 4 = 12, so 12 ÷ 3 = 4.' }),
  mcq({ id: 'G3.02-02', skillId: 'G3.02', skillName: 'Simple division', difficulty: 3, band: 'foundational',
    stem: '20 ÷ 4 = ?', correct: '5', wrong: ['4', '6', '16'],
    solution: '4 × 5 = 20.' }),
  mcq({ id: 'G3.02-03', skillId: 'G3.02', skillName: 'Simple division', difficulty: 5, band: 'core',
    stem: '36 ÷ 6 = ?', correct: '6', wrong: ['5', '7', '30'],
    solution: '6 × 6 = 36.' }),
  mcq({ id: 'G3.02-04', skillId: 'G3.02', skillName: 'Simple division', difficulty: 6, band: 'advanced',
    stem: '24 chocolates shared equally between 4 friends. How many each?', correct: '6', wrong: ['4', '8', '20'],
    solution: '24 ÷ 4 = 6.' }),

  mcq({ id: 'G3.03-01', skillId: 'G3.03', skillName: 'Three-digit place value', difficulty: 3, band: 'foundational',
    stem: 'What does the 4 in 345 mean?', correct: '4 tens', wrong: ['4 ones', '4 hundreds', '400'],
    solution: '345 = 3 hundreds + 4 tens + 5 ones.' }),
  mcq({ id: 'G3.03-02', skillId: 'G3.03', skillName: 'Three-digit place value', difficulty: 4, band: 'foundational',
    stem: 'Write "two hundred forty-six" as a number.', correct: '246', wrong: ['642', '2046', '20046'],
    solution: '246 = 2 hundreds + 4 tens + 6 ones.' }),
  mcq({ id: 'G3.03-03', skillId: 'G3.03', skillName: 'Three-digit place value', difficulty: 5, band: 'core',
    stem: 'Which is largest: 405, 450, 504?', correct: '504', wrong: ['405', '450', 'All equal'],
    solution: '504 has 5 hundreds, the others have 4.' }),
  mcq({ id: 'G3.03-04', skillId: 'G3.03', skillName: 'Three-digit place value', difficulty: 6, band: 'advanced',
    stem: 'What is 100 more than 289?', correct: '389', wrong: ['189', '299', '290'],
    solution: '289 + 100 = 389.' }),
];

// ---------------------------------------------------------------------------
// Class 4 — Fractions, Measurement, Multi-digit Multiplication (12 items)
// ---------------------------------------------------------------------------
const CLASS4: Item[] = [
  mcq({ id: 'G4.01-01', skillId: 'G4.01', skillName: 'Fractions introduction', difficulty: 2, band: 'foundational',
    stem: 'What fraction is shaded? [3 of 4 equal parts shaded]', correct: '3/4', wrong: ['1/4', '4/3', '3'],
    solution: '3 shaded out of 4 total → 3/4.' }),
  mcq({ id: 'G4.01-02', skillId: 'G4.01', skillName: 'Fractions introduction', difficulty: 3, band: 'foundational',
    stem: 'Which fraction is bigger: 1/2 or 1/3?', correct: '1/2', wrong: ['1/3', 'They are equal', '1/6'],
    solution: 'A bigger denominator with the same numerator = smaller fraction. 1/2 > 1/3.' }),
  mcq({ id: 'G4.01-03', skillId: 'G4.01', skillName: 'Fractions introduction', difficulty: 5, band: 'core',
    stem: 'How many quarters (1/4) make one whole?', correct: '4', wrong: ['2', '3', '8'],
    solution: '1/4 + 1/4 + 1/4 + 1/4 = 1.' }),
  mcq({ id: 'G4.01-04', skillId: 'G4.01', skillName: 'Fractions introduction', difficulty: 6, band: 'advanced',
    stem: 'A pizza has 8 equal slices. Ravi eats 3. What fraction is left?', correct: '5/8', wrong: ['3/8', '5/3', '1/8'],
    solution: 'Ate 3/8, so 8/8 − 3/8 = 5/8 left.' }),

  mcq({ id: 'G4.02-01', skillId: 'G4.02', skillName: 'Length and weight basics', difficulty: 2, band: 'foundational',
    stem: 'How many centimetres in 1 metre?', correct: '100', wrong: ['10', '1000', '1'],
    solution: '1 m = 100 cm.' }),
  mcq({ id: 'G4.02-02', skillId: 'G4.02', skillName: 'Length and weight basics', difficulty: 3, band: 'foundational',
    stem: 'How many grams in 1 kilogram?', correct: '1000', wrong: ['100', '10', '10000'],
    solution: '1 kg = 1000 g.' }),
  mcq({ id: 'G4.02-03', skillId: 'G4.02', skillName: 'Length and weight basics', difficulty: 5, band: 'core',
    stem: 'A rope is 3 m 40 cm long. That is how many cm?', correct: '340 cm', wrong: ['34 cm', '3040 cm', '304 cm'],
    solution: '3 m = 300 cm, plus 40 cm = 340 cm.' }),
  mcq({ id: 'G4.02-04', skillId: 'G4.02', skillName: 'Length and weight basics', difficulty: 6, band: 'advanced',
    stem: 'Two bags weigh 2 kg 500 g and 1 kg 750 g. Total in grams?', correct: '4250 g', wrong: ['3250 g', '4.25 g', '4250 kg'],
    solution: '2500 + 1750 = 4250 g.' }),

  mcq({ id: 'G4.03-01', skillId: 'G4.03', skillName: 'Multi-digit multiplication', difficulty: 3, band: 'foundational',
    stem: '23 × 4 = ?', correct: '92', wrong: ['82', '94', '27'],
    solution: '23 × 4: 20×4=80; 3×4=12; total 92.' }),
  mcq({ id: 'G4.03-02', skillId: 'G4.03', skillName: 'Multi-digit multiplication', difficulty: 4, band: 'foundational',
    stem: '35 × 3 = ?', correct: '105', wrong: ['95', '115', '35'],
    solution: '30×3=90; 5×3=15; total 105.' }),
  mcq({ id: 'G4.03-03', skillId: 'G4.03', skillName: 'Multi-digit multiplication', difficulty: 6, band: 'core',
    stem: '47 × 6 = ?', correct: '282', wrong: ['272', '292', '246'],
    solution: '40×6=240; 7×6=42; 240+42=282.' }),
  mcq({ id: 'G4.03-04', skillId: 'G4.03', skillName: 'Multi-digit multiplication', difficulty: 7, band: 'advanced',
    stem: 'A book has 148 pages. How many pages in 5 books?', correct: '740', wrong: ['540', '840', '148'],
    solution: '148 × 5 = 740.' }),
];

// ---------------------------------------------------------------------------
// Class 5 — Decimals, Percentage, Long Division (12 items)
// ---------------------------------------------------------------------------
const CLASS5: Item[] = [
  mcq({ id: 'G5.01-01', skillId: 'G5.01', skillName: 'Decimal place value', difficulty: 3, band: 'foundational',
    stem: 'What does the 5 in 12.53 mean?', correct: '5 tenths', wrong: ['5 hundredths', '5 units', '50 tenths'],
    solution: '12.53 = 12 + 5/10 + 3/100.' }),
  mcq({ id: 'G5.01-02', skillId: 'G5.01', skillName: 'Decimal place value', difficulty: 4, band: 'foundational',
    stem: 'Which is larger: 0.7 or 0.65?', correct: '0.7', wrong: ['0.65', 'They are equal', 'Neither'],
    solution: '0.7 = 0.70 > 0.65.' }),
  mcq({ id: 'G5.01-03', skillId: 'G5.01', skillName: 'Decimal place value', difficulty: 5, band: 'core',
    stem: 'Write "three and four tenths" as a decimal.', correct: '3.4', wrong: ['3.04', '34', '0.34'],
    solution: '3 + 4/10 = 3.4.' }),
  mcq({ id: 'G5.01-04', skillId: 'G5.01', skillName: 'Decimal place value', difficulty: 6, band: 'advanced',
    stem: 'Round 5.68 to the nearest whole number.', correct: '6', wrong: ['5', '5.7', '57'],
    solution: '0.68 ≥ 0.5, so round up to 6.' }),

  mcq({ id: 'G5.02-01', skillId: 'G5.02', skillName: 'Percentage introduction', difficulty: 3, band: 'foundational',
    stem: 'What is 50% of 40?', correct: '20', wrong: ['4', '10', '50'],
    solution: '50% = half. Half of 40 = 20.' }),
  mcq({ id: 'G5.02-02', skillId: 'G5.02', skillName: 'Percentage introduction', difficulty: 4, band: 'foundational',
    stem: 'What is 25% of 80?', correct: '20', wrong: ['25', '40', '4'],
    solution: '25% = 1/4. 80 ÷ 4 = 20.' }),
  mcq({ id: 'G5.02-03', skillId: 'G5.02', skillName: 'Percentage introduction', difficulty: 5, band: 'core',
    stem: '10% of 250 = ?', correct: '25', wrong: ['10', '50', '2.5'],
    solution: '10% = 1/10. 250/10 = 25.' }),
  mcq({ id: 'G5.02-04', skillId: 'G5.02', skillName: 'Percentage introduction', difficulty: 7, band: 'advanced',
    stem: '20% of 150 = ?', correct: '30', wrong: ['20', '25', '75'],
    solution: '10% = 15; 20% = 2 × 15 = 30.' }),

  mcq({ id: 'G5.03-01', skillId: 'G5.03', skillName: 'Long division', difficulty: 3, band: 'foundational',
    stem: '48 ÷ 4 = ?', correct: '12', wrong: ['11', '8', '44'],
    solution: '4 × 12 = 48.' }),
  mcq({ id: 'G5.03-02', skillId: 'G5.03', skillName: 'Long division', difficulty: 4, band: 'foundational',
    stem: '96 ÷ 8 = ?', correct: '12', wrong: ['11', '13', '96'],
    solution: '8 × 12 = 96.' }),
  mcq({ id: 'G5.03-03', skillId: 'G5.03', skillName: 'Long division', difficulty: 6, band: 'core',
    stem: '144 ÷ 12 = ?', correct: '12', wrong: ['11', '13', '132'],
    solution: '12 × 12 = 144.' }),
  mcq({ id: 'G5.03-04', skillId: 'G5.03', skillName: 'Long division', difficulty: 7, band: 'advanced',
    stem: '378 ÷ 6 = ?', correct: '63', wrong: ['53', '72', '384'],
    solution: '6 × 63 = 378.' }),
];

// ---------------------------------------------------------------------------
// Class 8 — Rational Numbers, Linear Equations, Squares/Cubes (12 items)
// ---------------------------------------------------------------------------
const CLASS8: Item[] = [
  mcq({ id: 'G8.01-01', skillId: 'G8.01', skillName: 'Rational number operations', difficulty: 3, band: 'foundational',
    stem: '(-2/3) + (5/3) = ?', correct: '1', wrong: ['-1', '7/3', '-7/3'],
    solution: 'Same denominator: (-2+5)/3 = 3/3 = 1.' }),
  mcq({ id: 'G8.01-02', skillId: 'G8.01', skillName: 'Rational number operations', difficulty: 4, band: 'foundational',
    stem: '1/2 × 4/5 = ?', correct: '2/5', wrong: ['4/10', '5/8', '2/10'],
    solution: '1×4=4; 2×5=10; 4/10 = 2/5.' }),
  mcq({ id: 'G8.01-03', skillId: 'G8.01', skillName: 'Rational number operations', difficulty: 6, band: 'core',
    stem: '(-3/4) − (-1/2) = ?', correct: '-1/4', wrong: ['-5/4', '1/4', '-3/2'],
    solution: '(-3/4) + 1/2 = -3/4 + 2/4 = -1/4.' }),
  mcq({ id: 'G8.01-04', skillId: 'G8.01', skillName: 'Rational number operations', difficulty: 7, band: 'advanced',
    stem: '(2/3) ÷ (4/9) = ?', correct: '3/2', wrong: ['8/27', '2/3', '4/9'],
    solution: '2/3 × 9/4 = 18/12 = 3/2.' }),

  mcq({ id: 'G8.02-01', skillId: 'G8.02', skillName: 'Linear equations in one variable', difficulty: 3, band: 'foundational',
    stem: 'Solve: x + 5 = 12', correct: '7', wrong: ['17', '5', '-7'],
    solution: 'x = 12 − 5 = 7.' }),
  mcq({ id: 'G8.02-02', skillId: 'G8.02', skillName: 'Linear equations in one variable', difficulty: 4, band: 'foundational',
    stem: 'Solve: 2x = 14', correct: '7', wrong: ['28', '12', '16'],
    solution: 'x = 14 / 2 = 7.' }),
  mcq({ id: 'G8.02-03', skillId: 'G8.02', skillName: 'Linear equations in one variable', difficulty: 6, band: 'core',
    stem: 'Solve: 3x − 4 = 11', correct: '5', wrong: ['15', '7', '3'],
    solution: '3x = 15; x = 5.' }),
  mcq({ id: 'G8.02-04', skillId: 'G8.02', skillName: 'Linear equations in one variable', difficulty: 7, band: 'advanced',
    stem: 'Solve: 2(x + 3) = 20', correct: '7', wrong: ['10', '13', '5'],
    solution: 'x + 3 = 10; x = 7.' }),

  mcq({ id: 'G8.03-01', skillId: 'G8.03', skillName: 'Squares and cubes', difficulty: 3, band: 'foundational',
    stem: '5² = ?', correct: '25', wrong: ['10', '20', '125'],
    solution: '5 × 5 = 25.' }),
  mcq({ id: 'G8.03-02', skillId: 'G8.03', skillName: 'Squares and cubes', difficulty: 4, band: 'foundational',
    stem: '3³ = ?', correct: '27', wrong: ['9', '6', '81'],
    solution: '3 × 3 × 3 = 27.' }),
  mcq({ id: 'G8.03-03', skillId: 'G8.03', skillName: 'Squares and cubes', difficulty: 6, band: 'core',
    stem: '√144 = ?', correct: '12', wrong: ['14', '72', '11'],
    solution: '12 × 12 = 144.' }),
  mcq({ id: 'G8.03-04', skillId: 'G8.03', skillName: 'Squares and cubes', difficulty: 7, band: 'advanced',
    stem: '∛64 = ?', correct: '4', wrong: ['8', '16', '3'],
    solution: '4 × 4 × 4 = 64.' }),
];

// ---------------------------------------------------------------------------
// Class 9 — Number Systems, Polynomials, Coordinate Geometry (12 items)
// ---------------------------------------------------------------------------
const CLASS9: Item[] = [
  mcq({ id: 'G9.01-01', skillId: 'G9.01', skillName: 'Real number classification', difficulty: 3, band: 'foundational',
    stem: 'Which of these is a natural number?', correct: '5', wrong: ['-3', '0', '1/2'],
    solution: 'Natural numbers are 1, 2, 3, …' }),
  mcq({ id: 'G9.01-02', skillId: 'G9.01', skillName: 'Real number classification', difficulty: 4, band: 'foundational',
    stem: 'Which is an irrational number?', correct: '√2', wrong: ['3/4', '0.25', '-7'],
    solution: '√2 cannot be written as p/q.' }),
  mcq({ id: 'G9.01-03', skillId: 'G9.01', skillName: 'Real number classification', difficulty: 6, band: 'core',
    stem: '0.6̄ (repeating 6) as a fraction is:', correct: '2/3', wrong: ['3/5', '6/10', '1/6'],
    solution: 'Let x = 0.666…; 10x − x = 6, x = 6/9 = 2/3.' }),
  mcq({ id: 'G9.01-04', skillId: 'G9.01', skillName: 'Real number classification', difficulty: 7, band: 'advanced',
    stem: 'Between two rational numbers, how many rationals are there?', correct: 'Infinitely many', wrong: ['0', '1', '10'],
    solution: 'The rationals are dense — you can always find another one in between.' }),

  mcq({ id: 'G9.02-01', skillId: 'G9.02', skillName: 'Polynomial arithmetic', difficulty: 3, band: 'foundational',
    stem: 'The degree of 3x² + 5x + 2 is:', correct: '2', wrong: ['3', '5', '1'],
    solution: 'Highest power of x is 2.' }),
  mcq({ id: 'G9.02-02', skillId: 'G9.02', skillName: 'Polynomial arithmetic', difficulty: 4, band: 'foundational',
    stem: '(2x + 3) + (x + 5) = ?', correct: '3x + 8', wrong: ['3x + 15', 'x + 8', '2x + 8'],
    solution: 'Combine like terms: 2x+x=3x; 3+5=8.' }),
  mcq({ id: 'G9.02-03', skillId: 'G9.02', skillName: 'Polynomial arithmetic', difficulty: 6, band: 'core',
    stem: '(x + 2)(x + 3) = ?', correct: 'x² + 5x + 6', wrong: ['x² + 6', '2x + 5', 'x² + 6x + 5'],
    solution: 'FOIL: x² + 3x + 2x + 6 = x² + 5x + 6.' }),
  mcq({ id: 'G9.02-04', skillId: 'G9.02', skillName: 'Polynomial arithmetic', difficulty: 7, band: 'advanced',
    stem: 'p(x) = x² − 4. p(2) = ?', correct: '0', wrong: ['4', '-4', '8'],
    solution: '2² − 4 = 4 − 4 = 0.' }),

  mcq({ id: 'G9.03-01', skillId: 'G9.03', skillName: 'Coordinate geometry basics', difficulty: 3, band: 'foundational',
    stem: 'The point (3, -2) lies in which quadrant?', correct: 'IV', wrong: ['I', 'II', 'III'],
    solution: 'x positive, y negative → fourth quadrant.' }),
  mcq({ id: 'G9.03-02', skillId: 'G9.03', skillName: 'Coordinate geometry basics', difficulty: 4, band: 'foundational',
    stem: 'The origin has coordinates:', correct: '(0, 0)', wrong: ['(1, 1)', '(0, 1)', '(-1, -1)'],
    solution: 'Origin = intersection of axes = (0, 0).' }),
  mcq({ id: 'G9.03-03', skillId: 'G9.03', skillName: 'Coordinate geometry basics', difficulty: 6, band: 'core',
    stem: 'Distance from origin to (3, 4) is:', correct: '5', wrong: ['7', '4', '25'],
    solution: '√(3² + 4²) = √25 = 5.' }),
  mcq({ id: 'G9.03-04', skillId: 'G9.03', skillName: 'Coordinate geometry basics', difficulty: 7, band: 'advanced',
    stem: 'Midpoint of (2, 4) and (6, 8) is:', correct: '(4, 6)', wrong: ['(8, 12)', '(3, 5)', '(4, 12)'],
    solution: '((2+6)/2, (4+8)/2) = (4, 6).' }),
];

// ---------------------------------------------------------------------------
// Class 10 — Real Numbers HCF/LCM, Quadratics, Basic Trig (12 items)
// ---------------------------------------------------------------------------
const CLASS10: Item[] = [
  mcq({ id: 'G10.01-01', skillId: 'G10.01', skillName: 'Real numbers HCF/LCM', difficulty: 3, band: 'foundational',
    stem: 'HCF of 12 and 18 is:', correct: '6', wrong: ['3', '12', '36'],
    solution: 'Factors of 12: 1,2,3,4,6,12. Of 18: 1,2,3,6,9,18. Highest common = 6.' }),
  mcq({ id: 'G10.01-02', skillId: 'G10.01', skillName: 'Real numbers HCF/LCM', difficulty: 4, band: 'foundational',
    stem: 'LCM of 4 and 6 is:', correct: '12', wrong: ['24', '6', '2'],
    solution: '4 = 2²; 6 = 2×3; LCM = 2²×3 = 12.' }),
  mcq({ id: 'G10.01-03', skillId: 'G10.01', skillName: 'Real numbers HCF/LCM', difficulty: 6, band: 'core',
    stem: 'HCF × LCM of 8 and 12 = ?', correct: '96', wrong: ['20', '8', '12'],
    solution: 'HCF × LCM = product: 8 × 12 = 96.' }),
  mcq({ id: 'G10.01-04', skillId: 'G10.01', skillName: 'Real numbers HCF/LCM', difficulty: 7, band: 'advanced',
    stem: 'Prove-check style: is √2 rational?', correct: 'No — √2 is irrational', wrong: ['Yes, √2 = 1.414', 'Yes = 2/1', 'Depends'],
    solution: '√2 cannot be written as p/q with p, q coprime integers.' }),

  mcq({ id: 'G10.02-01', skillId: 'G10.02', skillName: 'Quadratic equations', difficulty: 3, band: 'foundational',
    stem: 'x² − 9 = 0. x = ?', correct: '±3', wrong: ['3', '9', '-9'],
    solution: 'x² = 9; x = ±3.' }),
  mcq({ id: 'G10.02-02', skillId: 'G10.02', skillName: 'Quadratic equations', difficulty: 4, band: 'foundational',
    stem: 'Discriminant of x² + 4x + 4 = 0 is:', correct: '0', wrong: ['16', '4', '-16'],
    solution: 'b²−4ac = 16 − 16 = 0.' }),
  mcq({ id: 'G10.02-03', skillId: 'G10.02', skillName: 'Quadratic equations', difficulty: 6, band: 'core',
    stem: 'x² − 5x + 6 = 0. Roots?', correct: '2 and 3', wrong: ['-2 and -3', '1 and 6', '5 and 6'],
    solution: '(x−2)(x−3) = 0.' }),
  mcq({ id: 'G10.02-04', skillId: 'G10.02', skillName: 'Quadratic equations', difficulty: 7, band: 'advanced',
    stem: 'Sum of roots of 2x² − 8x + 6 = 0 is:', correct: '4', wrong: ['3', '-4', '-3'],
    solution: 'Sum = −b/a = 8/2 = 4.' }),

  mcq({ id: 'G10.03-01', skillId: 'G10.03', skillName: 'Basic trigonometry', difficulty: 3, band: 'foundational',
    stem: 'sin 30° = ?', correct: '1/2', wrong: ['1/√2', '√3/2', '1'],
    solution: 'Standard value: sin 30° = 1/2.' }),
  mcq({ id: 'G10.03-02', skillId: 'G10.03', skillName: 'Basic trigonometry', difficulty: 4, band: 'foundational',
    stem: 'cos 60° = ?', correct: '1/2', wrong: ['√3/2', '1', '1/√2'],
    solution: 'Standard value: cos 60° = 1/2.' }),
  mcq({ id: 'G10.03-03', skillId: 'G10.03', skillName: 'Basic trigonometry', difficulty: 6, band: 'core',
    stem: 'tan 45° = ?', correct: '1', wrong: ['0', '√3', '1/√3'],
    solution: 'tan 45° = sin/cos = 1.' }),
  mcq({ id: 'G10.03-04', skillId: 'G10.03', skillName: 'Basic trigonometry', difficulty: 7, band: 'advanced',
    stem: 'sin²30° + cos²30° = ?', correct: '1', wrong: ['0', '1/2', '3/4'],
    solution: 'Pythagorean identity: sin²θ + cos²θ = 1.' }),
];

// ---------------------------------------------------------------------------
// Class 11 — Sets, Functions, Trigonometry (12 items)
// ---------------------------------------------------------------------------
const CLASS11: Item[] = [
  mcq({ id: 'G11.01-01', skillId: 'G11.01', skillName: 'Sets and operations', difficulty: 3, band: 'foundational',
    stem: 'A = {1,2,3}, B = {3,4,5}. A ∪ B = ?', correct: '{1,2,3,4,5}', wrong: ['{3}', '{1,2}', '{4,5}'],
    solution: 'Union collects all elements from both sets.' }),
  mcq({ id: 'G11.01-02', skillId: 'G11.01', skillName: 'Sets and operations', difficulty: 4, band: 'foundational',
    stem: 'A = {1,2,3}, B = {3,4,5}. A ∩ B = ?', correct: '{3}', wrong: ['{1,2,3,4,5}', '{}', '{1,2}'],
    solution: 'Intersection collects elements present in both.' }),
  mcq({ id: 'G11.01-03', skillId: 'G11.01', skillName: 'Sets and operations', difficulty: 6, band: 'core',
    stem: 'A set of 3 elements has how many subsets?', correct: '8', wrong: ['6', '3', '9'],
    solution: '2^3 = 8 subsets (including empty set and the set itself).' }),
  mcq({ id: 'G11.01-04', skillId: 'G11.01', skillName: 'Sets and operations', difficulty: 7, band: 'advanced',
    stem: 'If |A|=10, |B|=15, |A∩B|=5, then |A∪B|=?', correct: '20', wrong: ['25', '15', '10'],
    solution: '|A∪B| = |A| + |B| − |A∩B| = 10+15−5 = 20.' }),

  mcq({ id: 'G11.02-01', skillId: 'G11.02', skillName: 'Functions basics', difficulty: 3, band: 'foundational',
    stem: 'f(x) = 2x + 1. f(3) = ?', correct: '7', wrong: ['6', '5', '9'],
    solution: '2(3) + 1 = 7.' }),
  mcq({ id: 'G11.02-02', skillId: 'G11.02', skillName: 'Functions basics', difficulty: 4, band: 'foundational',
    stem: 'f(x) = x². f(-3) = ?', correct: '9', wrong: ['-9', '6', '-6'],
    solution: '(-3)² = 9.' }),
  mcq({ id: 'G11.02-03', skillId: 'G11.02', skillName: 'Functions basics', difficulty: 6, band: 'core',
    stem: 'Domain of f(x) = 1/x is:', correct: 'All real numbers except 0', wrong: ['All real numbers', 'Positive numbers only', 'All integers'],
    solution: 'Division by zero undefined, so x ≠ 0.' }),
  mcq({ id: 'G11.02-04', skillId: 'G11.02', skillName: 'Functions basics', difficulty: 7, band: 'advanced',
    stem: 'f(x) = x + 2, g(x) = 3x. (f ∘ g)(1) = ?', correct: '5', wrong: ['9', '3', '6'],
    solution: 'g(1)=3; f(3) = 3+2 = 5.' }),

  mcq({ id: 'G11.03-01', skillId: 'G11.03', skillName: 'Trigonometric identities', difficulty: 4, band: 'foundational',
    stem: 'sin²θ + cos²θ = ?', correct: '1', wrong: ['0', '2', 'sin θ · cos θ'],
    solution: 'Pythagorean identity.' }),
  mcq({ id: 'G11.03-02', skillId: 'G11.03', skillName: 'Trigonometric identities', difficulty: 5, band: 'foundational',
    stem: 'sin(π/2) = ?', correct: '1', wrong: ['0', '-1', '1/2'],
    solution: 'π/2 = 90°; sin 90° = 1.' }),
  mcq({ id: 'G11.03-03', skillId: 'G11.03', skillName: 'Trigonometric identities', difficulty: 6, band: 'core',
    stem: '1 + tan²θ = ?', correct: 'sec²θ', wrong: ['cos²θ', 'sin²θ', 'csc²θ'],
    solution: 'Divide sin²+cos²=1 by cos²θ.' }),
  mcq({ id: 'G11.03-04', skillId: 'G11.03', skillName: 'Trigonometric identities', difficulty: 8, band: 'advanced',
    stem: 'sin(2x) = ?', correct: '2 sin x cos x', wrong: ['2 sin x', 'sin x + cos x', 'cos²x − sin²x'],
    solution: 'Double-angle identity: sin(2x) = 2 sin x cos x.' }),
];

// ---------------------------------------------------------------------------
// Class 12 — Matrices, Derivatives, Integrals (12 items)
// ---------------------------------------------------------------------------
const CLASS12: Item[] = [
  mcq({ id: 'G12.01-01', skillId: 'G12.01', skillName: 'Matrix operations', difficulty: 3, band: 'foundational',
    stem: 'Order of a matrix with 2 rows and 3 columns is:', correct: '2 × 3', wrong: ['3 × 2', '5', '6'],
    solution: 'Order = rows × columns.' }),
  mcq({ id: 'G12.01-02', skillId: 'G12.01', skillName: 'Matrix operations', difficulty: 4, band: 'foundational',
    stem: 'A 3×3 identity matrix has how many 1s on its diagonal?', correct: '3', wrong: ['1', '9', '6'],
    solution: 'Identity matrix has 1s on the main diagonal only.' }),
  mcq({ id: 'G12.01-03', skillId: 'G12.01', skillName: 'Matrix operations', difficulty: 6, band: 'core',
    stem: 'Determinant of [[2,3],[1,4]] is:', correct: '5', wrong: ['8', '11', '-5'],
    solution: 'ad − bc = 2(4) − 3(1) = 8 − 3 = 5.' }),
  mcq({ id: 'G12.01-04', skillId: 'G12.01', skillName: 'Matrix operations', difficulty: 7, band: 'advanced',
    stem: 'Is [[1,2],[2,4]] invertible?', correct: 'No — determinant is 0', wrong: ['Yes', 'Depends on multiplication', 'Only if squared'],
    solution: 'det = 1(4) − 2(2) = 0; matrix is singular.' }),

  mcq({ id: 'G12.02-01', skillId: 'G12.02', skillName: 'Derivatives basics', difficulty: 3, band: 'foundational',
    stem: 'd/dx (x²) = ?', correct: '2x', wrong: ['x', 'x²', '2'],
    solution: 'Power rule: d/dx x^n = n·x^(n-1).' }),
  mcq({ id: 'G12.02-02', skillId: 'G12.02', skillName: 'Derivatives basics', difficulty: 4, band: 'foundational',
    stem: 'd/dx (5) = ?', correct: '0', wrong: ['5', '1', '5x'],
    solution: 'Derivative of a constant is 0.' }),
  mcq({ id: 'G12.02-03', skillId: 'G12.02', skillName: 'Derivatives basics', difficulty: 6, band: 'core',
    stem: 'd/dx (sin x) = ?', correct: 'cos x', wrong: ['-cos x', 'sin x', '-sin x'],
    solution: 'Standard derivative.' }),
  mcq({ id: 'G12.02-04', skillId: 'G12.02', skillName: 'Derivatives basics', difficulty: 7, band: 'advanced',
    stem: 'd/dx (3x² + 2x + 1) = ?', correct: '6x + 2', wrong: ['3x + 2', '6x² + 2', '3x² + 2'],
    solution: 'Term by term: 6x + 2 + 0.' }),

  mcq({ id: 'G12.03-01', skillId: 'G12.03', skillName: 'Definite integrals', difficulty: 3, band: 'foundational',
    stem: '∫ 1 dx from 0 to 5 = ?', correct: '5', wrong: ['0', '1', '25'],
    solution: 'Area of a rectangle of height 1 and width 5.' }),
  mcq({ id: 'G12.03-02', skillId: 'G12.03', skillName: 'Definite integrals', difficulty: 4, band: 'foundational',
    stem: '∫ 2x dx from 0 to 3 = ?', correct: '9', wrong: ['6', '3', '18'],
    solution: '[x²] from 0 to 3 = 9 − 0.' }),
  mcq({ id: 'G12.03-03', skillId: 'G12.03', skillName: 'Definite integrals', difficulty: 6, band: 'core',
    stem: '∫ x² dx from 0 to 2 = ?', correct: '8/3', wrong: ['4', '2', '8'],
    solution: '[x³/3] from 0 to 2 = 8/3.' }),
  mcq({ id: 'G12.03-04', skillId: 'G12.03', skillName: 'Definite integrals', difficulty: 7, band: 'advanced',
    stem: '∫ cos x dx from 0 to π/2 = ?', correct: '1', wrong: ['0', 'π/2', '-1'],
    solution: '[sin x] from 0 to π/2 = 1 − 0 = 1.' }),
];

// ---------------------------------------------------------------------------
// v0.31 — Module 2 for each starter grade (12 items each = 120 total).
// Same prototype status as module 1. Chapter coverage per grade in the
// module title / description below. Every item is teacher_review_required.
// ---------------------------------------------------------------------------
const CLASS1_M2: Item[] = [
  mcq({ id: 'G1.04-01', skillId: 'G1.04', skillName: 'Recognise 2D shapes', difficulty: 1, band: 'foundational',
    stem: 'A shape with 3 straight sides is called a:', correct: 'Triangle', wrong: ['Square', 'Circle', 'Rectangle'],
    solution: 'A triangle has exactly 3 straight sides.' }),
  mcq({ id: 'G1.04-02', skillId: 'G1.04', skillName: 'Recognise 2D shapes', difficulty: 2, band: 'foundational',
    stem: 'A shape with 4 equal sides is a:', correct: 'Square', wrong: ['Rectangle', 'Triangle', 'Circle'],
    solution: 'A square has 4 sides of equal length.' }),
  mcq({ id: 'G1.04-03', skillId: 'G1.04', skillName: 'Recognise 2D shapes', difficulty: 4, band: 'core',
    stem: 'A round shape with no corners is a:', correct: 'Circle', wrong: ['Triangle', 'Square', 'Rectangle'],
    solution: 'Only a circle has no corners.' }),
  mcq({ id: 'G1.04-04', skillId: 'G1.04', skillName: 'Recognise 2D shapes', difficulty: 5, band: 'advanced',
    stem: 'A door is closest in shape to a:', correct: 'Rectangle', wrong: ['Circle', 'Triangle', 'Square'],
    solution: 'A door is a tall four-sided shape with opposite sides equal — a rectangle.' }),

  mcq({ id: 'G1.05-01', skillId: 'G1.05', skillName: 'Compare lengths', difficulty: 1, band: 'foundational',
    stem: 'Which is longer: a pencil or a bus?', correct: 'A bus', wrong: ['A pencil', 'Both same', 'Cannot say'],
    solution: 'A bus is much longer than a pencil.' }),
  mcq({ id: 'G1.05-02', skillId: 'G1.05', skillName: 'Compare lengths', difficulty: 2, band: 'foundational',
    stem: 'Which is shorter: a snake 100 cm long or a rope 200 cm long?', correct: 'The snake', wrong: ['The rope', 'Both same', 'Cannot say'],
    solution: '100 < 200, so the snake is shorter.' }),
  mcq({ id: 'G1.05-03', skillId: 'G1.05', skillName: 'Compare lengths', difficulty: 4, band: 'core',
    stem: 'Order from shortest to longest: ant, cat, cow.', correct: 'Ant, cat, cow', wrong: ['Cow, cat, ant', 'Cat, ant, cow', 'Ant, cow, cat'],
    solution: 'An ant is smallest, then a cat, then a cow.' }),
  mcq({ id: 'G1.05-04', skillId: 'G1.05', skillName: 'Compare lengths', difficulty: 5, band: 'advanced',
    stem: 'A ribbon is 15 cm and another is 20 cm. What is the difference?', correct: '5 cm', wrong: ['35 cm', '25 cm', '3 cm'],
    solution: '20 − 15 = 5 cm.' }),

  mcq({ id: 'G1.06-01', skillId: 'G1.06', skillName: 'Indian coins', difficulty: 1, band: 'foundational',
    stem: 'Which of these is an Indian coin?', correct: '₹1', wrong: ['$1', '€1', '¥1'],
    solution: '₹ (rupee) is India\'s currency symbol.' }),
  mcq({ id: 'G1.06-02', skillId: 'G1.06', skillName: 'Indian coins', difficulty: 2, band: 'foundational',
    stem: '₹2 + ₹5 = ?', correct: '₹7', wrong: ['₹3', '₹10', '₹25'],
    solution: '2 + 5 = 7 rupees.' }),
  mcq({ id: 'G1.06-03', skillId: 'G1.06', skillName: 'Indian coins', difficulty: 4, band: 'core',
    stem: 'How many ₹2 coins make ₹10?', correct: '5', wrong: ['2', '10', '20'],
    solution: '5 × 2 = 10 rupees.' }),
  mcq({ id: 'G1.06-04', skillId: 'G1.06', skillName: 'Indian coins', difficulty: 5, band: 'advanced',
    stem: 'You have ₹20. A toy costs ₹15. How much money is left?', correct: '₹5', wrong: ['₹35', '₹15', '₹25'],
    solution: '20 − 15 = 5 rupees.' }),
];

const CLASS2_M2: Item[] = [
  mcq({ id: 'G2.04-01', skillId: 'G2.04', skillName: 'Repeated addition (tables of 2 & 3)', difficulty: 2, band: 'foundational',
    stem: '2 + 2 + 2 = ?', correct: '6', wrong: ['4', '8', '3'],
    solution: 'Three 2s make 6. Same as 3 × 2.' }),
  mcq({ id: 'G2.04-02', skillId: 'G2.04', skillName: 'Repeated addition (tables of 2 & 3)', difficulty: 3, band: 'foundational',
    stem: '3 × 4 = ?', correct: '12', wrong: ['7', '9', '15'],
    solution: '3 + 3 + 3 + 3 = 12.' }),
  mcq({ id: 'G2.04-03', skillId: 'G2.04', skillName: 'Repeated addition (tables of 2 & 3)', difficulty: 4, band: 'core',
    stem: '2 × 7 = ?', correct: '14', wrong: ['9', '12', '16'],
    solution: '2 taken 7 times = 14.' }),
  mcq({ id: 'G2.04-04', skillId: 'G2.04', skillName: 'Repeated addition (tables of 2 & 3)', difficulty: 5, band: 'advanced',
    stem: 'Five packets of 3 laddoos each. Total laddoos?', correct: '15', wrong: ['8', '10', '35'],
    solution: '5 × 3 = 15.' }),

  mcq({ id: 'G2.05-01', skillId: 'G2.05', skillName: 'Rupees and paise', difficulty: 2, band: 'foundational',
    stem: '100 paise = how many rupees?', correct: '₹1', wrong: ['₹10', '₹100', '₹1000'],
    solution: '100 paise = 1 rupee.' }),
  mcq({ id: 'G2.05-02', skillId: 'G2.05', skillName: 'Rupees and paise', difficulty: 3, band: 'foundational',
    stem: '₹5 = how many paise?', correct: '500', wrong: ['50', '5000', '5'],
    solution: '1 rupee = 100 paise, so 5 × 100 = 500 paise.' }),
  mcq({ id: 'G2.05-03', skillId: 'G2.05', skillName: 'Rupees and paise', difficulty: 4, band: 'core',
    stem: '₹10 + ₹15 = ?', correct: '₹25', wrong: ['₹5', '₹150', '₹1015'],
    solution: '10 + 15 = 25.' }),
  mcq({ id: 'G2.05-04', skillId: 'G2.05', skillName: 'Rupees and paise', difficulty: 6, band: 'advanced',
    stem: 'A pencil is ₹8 and an eraser ₹3. Total for 2 pencils and 1 eraser?', correct: '₹19', wrong: ['₹11', '₹14', '₹23'],
    solution: '2 × 8 = 16; 16 + 3 = 19 rupees.' }),

  mcq({ id: 'G2.06-01', skillId: 'G2.06', skillName: 'Reading clocks', difficulty: 2, band: 'foundational',
    stem: 'How many minutes make one hour?', correct: '60', wrong: ['30', '12', '100'],
    solution: '1 hour = 60 minutes.' }),
  mcq({ id: 'G2.06-02', skillId: 'G2.06', skillName: 'Reading clocks', difficulty: 3, band: 'foundational',
    stem: 'How many hours in one day?', correct: '24', wrong: ['12', '60', '365'],
    solution: '1 day = 24 hours.' }),
  mcq({ id: 'G2.06-03', skillId: 'G2.06', skillName: 'Reading clocks', difficulty: 4, band: 'core',
    stem: 'The hour hand is on 3 and the minute hand on 12. What is the time?', correct: '3:00', wrong: ['12:15', '3:12', '12:03'],
    solution: 'Minute hand on 12 = zero minutes; hour hand on 3 = 3 o\'clock.' }),
  mcq({ id: 'G2.06-04', skillId: 'G2.06', skillName: 'Reading clocks', difficulty: 6, band: 'advanced',
    stem: 'Half past 4 means:', correct: '4:30', wrong: ['4:15', '4:45', '5:00'],
    solution: '"Half past" means 30 minutes past the hour.' }),
];

const CLASS3_M2: Item[] = [
  mcq({ id: 'G3.04-01', skillId: 'G3.04', skillName: 'Halves, thirds and quarters', difficulty: 2, band: 'foundational',
    stem: 'One half of 10 is:', correct: '5', wrong: ['2', '10', '20'],
    solution: 'Half means divide by 2. 10 ÷ 2 = 5.' }),
  mcq({ id: 'G3.04-02', skillId: 'G3.04', skillName: 'Halves, thirds and quarters', difficulty: 3, band: 'foundational',
    stem: 'One quarter of 20 is:', correct: '5', wrong: ['2', '10', '80'],
    solution: 'Quarter = 1/4. 20 ÷ 4 = 5.' }),
  mcq({ id: 'G3.04-03', skillId: 'G3.04', skillName: 'Halves, thirds and quarters', difficulty: 5, band: 'core',
    stem: 'One third of 15 is:', correct: '5', wrong: ['3', '12', '45'],
    solution: 'Third = 1/3. 15 ÷ 3 = 5.' }),
  mcq({ id: 'G3.04-04', skillId: 'G3.04', skillName: 'Halves, thirds and quarters', difficulty: 6, band: 'advanced',
    stem: 'Which is bigger: 1/2 or 1/4?', correct: '1/2', wrong: ['1/4', 'Same', 'Neither'],
    solution: 'Halving into fewer pieces makes each bigger.' }),

  mcq({ id: 'G3.05-01', skillId: 'G3.05', skillName: '3-digit addition with regrouping', difficulty: 3, band: 'foundational',
    stem: '243 + 158 = ?', correct: '401', wrong: ['391', '411', '85'],
    solution: '3+8=11 (write 1, carry 1); 4+5+1=10 (write 0, carry 1); 2+1+1=4; answer 401.' }),
  mcq({ id: 'G3.05-02', skillId: 'G3.05', skillName: '3-digit addition with regrouping', difficulty: 4, band: 'foundational',
    stem: '376 + 245 = ?', correct: '621', wrong: ['511', '631', '520'],
    solution: '6+5=11 (write 1, carry 1); 7+4+1=12 (write 2, carry 1); 3+2+1=6; answer 621.' }),
  mcq({ id: 'G3.05-03', skillId: 'G3.05', skillName: '3-digit addition with regrouping', difficulty: 5, band: 'core',
    stem: '509 + 288 = ?', correct: '797', wrong: ['887', '707', '221'],
    solution: '509 + 288 = 797.' }),
  mcq({ id: 'G3.05-04', skillId: 'G3.05', skillName: '3-digit addition with regrouping', difficulty: 6, band: 'advanced',
    stem: 'A shop sold 458 pens on Monday and 275 on Tuesday. Total?', correct: '733', wrong: ['633', '183', '723'],
    solution: '458 + 275 = 733.' }),

  mcq({ id: 'G3.06-01', skillId: 'G3.06', skillName: 'Length in meters', difficulty: 2, band: 'foundational',
    stem: 'How many centimetres are in 1 metre?', correct: '100', wrong: ['10', '1000', '1'],
    solution: '1 m = 100 cm.' }),
  mcq({ id: 'G3.06-02', skillId: 'G3.06', skillName: 'Length in meters', difficulty: 3, band: 'foundational',
    stem: '3 m = how many cm?', correct: '300', wrong: ['30', '3000', '3'],
    solution: '3 × 100 = 300 cm.' }),
  mcq({ id: 'G3.06-03', skillId: 'G3.06', skillName: 'Length in meters', difficulty: 5, band: 'core',
    stem: '250 cm = ?', correct: '2 m 50 cm', wrong: ['25 m', '2.5 cm', '250 m'],
    solution: '250 cm = 200 cm + 50 cm = 2 m 50 cm.' }),
  mcq({ id: 'G3.06-04', skillId: 'G3.06', skillName: 'Length in meters', difficulty: 6, band: 'advanced',
    stem: 'A pole is 4 m 20 cm tall. In cm?', correct: '420 cm', wrong: ['42 cm', '4200 cm', '4020 cm'],
    solution: '4 m = 400 cm; +20 cm = 420 cm.' }),
];

const CLASS4_M2: Item[] = [
  mcq({ id: 'G4.04-01', skillId: 'G4.04', skillName: 'Numbers up to a lakh', difficulty: 3, band: 'foundational',
    stem: 'One lakh in digits is:', correct: '1,00,000', wrong: ['10,000', '1,000', '10,00,000'],
    solution: '1 lakh = 1,00,000 (100 thousand).' }),
  mcq({ id: 'G4.04-02', skillId: 'G4.04', skillName: 'Numbers up to a lakh', difficulty: 4, band: 'foundational',
    stem: 'Which is larger: 45,678 or 54,678?', correct: '54,678', wrong: ['45,678', 'They are equal', 'Cannot say'],
    solution: 'Compare left-most digits: 5 > 4.' }),
  mcq({ id: 'G4.04-03', skillId: 'G4.04', skillName: 'Numbers up to a lakh', difficulty: 5, band: 'core',
    stem: 'The place value of 7 in 47,231 is:', correct: '7,000', wrong: ['700', '7', '70,000'],
    solution: '7 is in the thousands place.' }),
  mcq({ id: 'G4.04-04', skillId: 'G4.04', skillName: 'Numbers up to a lakh', difficulty: 6, band: 'advanced',
    stem: 'What is 10,000 more than 65,432?', correct: '75,432', wrong: ['66,432', '65,442', '55,432'],
    solution: '65,432 + 10,000 = 75,432.' }),

  mcq({ id: 'G4.05-01', skillId: 'G4.05', skillName: 'Division with remainders', difficulty: 3, band: 'foundational',
    stem: '17 ÷ 5 gives quotient and remainder:', correct: 'Q = 3, R = 2', wrong: ['Q = 2, R = 3', 'Q = 3, R = 0', 'Q = 4, R = 1'],
    solution: '5 × 3 = 15; 17 − 15 = 2.' }),
  mcq({ id: 'G4.05-02', skillId: 'G4.05', skillName: 'Division with remainders', difficulty: 4, band: 'foundational',
    stem: '25 ÷ 4 leaves remainder:', correct: '1', wrong: ['0', '2', '4'],
    solution: '4 × 6 = 24; 25 − 24 = 1.' }),
  mcq({ id: 'G4.05-03', skillId: 'G4.05', skillName: 'Division with remainders', difficulty: 5, band: 'core',
    stem: 'When 42 mangoes are shared equally among 5 children, how many are left over?', correct: '2', wrong: ['0', '5', '8'],
    solution: '5 × 8 = 40; 42 − 40 = 2 remaining.' }),
  mcq({ id: 'G4.05-04', skillId: 'G4.05', skillName: 'Division with remainders', difficulty: 6, band: 'advanced',
    stem: '99 ÷ 8 gives quotient:', correct: '12', wrong: ['11', '13', '10'],
    solution: '8 × 12 = 96; 99 − 96 = 3 remainder; quotient 12.' }),

  mcq({ id: 'G4.06-01', skillId: 'G4.06', skillName: 'Tenths and hundredths', difficulty: 3, band: 'foundational',
    stem: '1 tenth written as a decimal is:', correct: '0.1', wrong: ['1.0', '10', '0.01'],
    solution: 'One tenth = 1/10 = 0.1.' }),
  mcq({ id: 'G4.06-02', skillId: 'G4.06', skillName: 'Tenths and hundredths', difficulty: 4, band: 'foundational',
    stem: '7 hundredths as a decimal is:', correct: '0.07', wrong: ['0.7', '7', '7.0'],
    solution: 'One hundredth = 1/100 = 0.01; 7 × 0.01 = 0.07.' }),
  mcq({ id: 'G4.06-03', skillId: 'G4.06', skillName: 'Tenths and hundredths', difficulty: 5, band: 'core',
    stem: 'Which is greater, 0.3 or 0.25?', correct: '0.3', wrong: ['0.25', 'Same', 'Cannot compare'],
    solution: '0.3 = 0.30 > 0.25.' }),
  mcq({ id: 'G4.06-04', skillId: 'G4.06', skillName: 'Tenths and hundredths', difficulty: 6, band: 'advanced',
    stem: '3/10 in decimal form:', correct: '0.3', wrong: ['0.03', '3.0', '3.10'],
    solution: '3 tenths = 0.3.' }),
];

const CLASS5_M2: Item[] = [
  mcq({ id: 'G5.04-01', skillId: 'G5.04', skillName: 'Fractions with unlike denominators', difficulty: 3, band: 'foundational',
    stem: '1/2 + 1/4 = ?', correct: '3/4', wrong: ['2/6', '1/6', '1/8'],
    solution: '1/2 = 2/4; 2/4 + 1/4 = 3/4.' }),
  mcq({ id: 'G5.04-02', skillId: 'G5.04', skillName: 'Fractions with unlike denominators', difficulty: 4, band: 'foundational',
    stem: '2/3 − 1/6 = ?', correct: '1/2', wrong: ['1/3', '1/6', '3/9'],
    solution: '2/3 = 4/6; 4/6 − 1/6 = 3/6 = 1/2.' }),
  mcq({ id: 'G5.04-03', skillId: 'G5.04', skillName: 'Fractions with unlike denominators', difficulty: 6, band: 'core',
    stem: '1/3 + 1/4 = ?', correct: '7/12', wrong: ['2/7', '2/12', '1/12'],
    solution: 'LCM = 12; 4/12 + 3/12 = 7/12.' }),
  mcq({ id: 'G5.04-04', skillId: 'G5.04', skillName: 'Fractions with unlike denominators', difficulty: 7, band: 'advanced',
    stem: '3/4 − 1/3 = ?', correct: '5/12', wrong: ['2/1', '2/12', '4/7'],
    solution: 'LCM = 12; 9/12 − 4/12 = 5/12.' }),

  mcq({ id: 'G5.05-01', skillId: 'G5.05', skillName: 'Perimeter and area of a rectangle', difficulty: 3, band: 'foundational',
    stem: 'Perimeter of a rectangle 4 cm × 3 cm is:', correct: '14 cm', wrong: ['12 cm', '7 cm', '10 cm'],
    solution: '2 × (4 + 3) = 14 cm.' }),
  mcq({ id: 'G5.05-02', skillId: 'G5.05', skillName: 'Perimeter and area of a rectangle', difficulty: 4, band: 'foundational',
    stem: 'Area of a rectangle 5 cm × 6 cm is:', correct: '30 sq cm', wrong: ['11 sq cm', '22 sq cm', '56 sq cm'],
    solution: 'Length × breadth = 5 × 6 = 30 sq cm.' }),
  mcq({ id: 'G5.05-03', skillId: 'G5.05', skillName: 'Perimeter and area of a rectangle', difficulty: 6, band: 'core',
    stem: 'A square of side 7 cm has area:', correct: '49 sq cm', wrong: ['14 sq cm', '28 sq cm', '77 sq cm'],
    solution: 'side × side = 7 × 7 = 49 sq cm.' }),
  mcq({ id: 'G5.05-04', skillId: 'G5.05', skillName: 'Perimeter and area of a rectangle', difficulty: 7, band: 'advanced',
    stem: 'A garden 10 m × 8 m needs fencing. How many metres of fencing?', correct: '36 m', wrong: ['80 m', '18 m', '40 m'],
    solution: 'Perimeter = 2 × (10 + 8) = 36 m.' }),

  mcq({ id: 'G5.06-01', skillId: 'G5.06', skillName: 'Reading bar graphs', difficulty: 3, band: 'foundational',
    stem: 'On a bar graph, taller bars mean:', correct: 'Larger values', wrong: ['Smaller values', 'Older values', 'No difference'],
    solution: 'Bar height directly represents the value.' }),
  mcq({ id: 'G5.06-02', skillId: 'G5.06', skillName: 'Reading bar graphs', difficulty: 4, band: 'foundational',
    stem: 'A bar graph shows: Mon 10, Tue 15, Wed 12. Total?', correct: '37', wrong: ['22', '25', '40'],
    solution: '10 + 15 + 12 = 37.' }),
  mcq({ id: 'G5.06-03', skillId: 'G5.06', skillName: 'Reading bar graphs', difficulty: 5, band: 'core',
    stem: 'A bar graph shows sales: Jan 20, Feb 35, Mar 25. Highest month?', correct: 'February', wrong: ['January', 'March', 'All equal'],
    solution: 'Feb = 35 is the largest.' }),
  mcq({ id: 'G5.06-04', skillId: 'G5.06', skillName: 'Reading bar graphs', difficulty: 7, band: 'advanced',
    stem: 'A bar graph shows rainfall (mm): Week 1 = 20, Week 2 = 30, Week 3 = 40, Week 4 = 10. Difference between highest and lowest?', correct: '30 mm', wrong: ['20 mm', '50 mm', '40 mm'],
    solution: '40 − 10 = 30 mm.' }),
];

const CLASS8_M2: Item[] = [
  mcq({ id: 'G8.04-01', skillId: 'G8.04', skillName: 'Area of triangles and parallelograms', difficulty: 3, band: 'foundational',
    stem: 'Area of a triangle with base 8 and height 5 is:', correct: '20', wrong: ['40', '13', '80'],
    solution: 'Area = (1/2) × base × height = (1/2) × 8 × 5 = 20.' }),
  mcq({ id: 'G8.04-02', skillId: 'G8.04', skillName: 'Area of triangles and parallelograms', difficulty: 4, band: 'foundational',
    stem: 'Area of a parallelogram with base 6 and height 4 is:', correct: '24', wrong: ['10', '12', '48'],
    solution: 'Area = base × height = 6 × 4 = 24.' }),
  mcq({ id: 'G8.04-03', skillId: 'G8.04', skillName: 'Area of triangles and parallelograms', difficulty: 5, band: 'core',
    stem: 'Volume of a cuboid 3 × 4 × 5 is:', correct: '60', wrong: ['12', '47', '80'],
    solution: 'Volume = l × b × h = 3 × 4 × 5 = 60 cubic units.' }),
  mcq({ id: 'G8.04-04', skillId: 'G8.04', skillName: 'Area of triangles and parallelograms', difficulty: 7, band: 'advanced',
    stem: 'A triangle has base 10 cm and height 12 cm. Area?', correct: '60 sq cm', wrong: ['120 sq cm', '22 sq cm', '30 sq cm'],
    solution: '(1/2) × 10 × 12 = 60 sq cm.' }),

  mcq({ id: 'G8.05-01', skillId: 'G8.05', skillName: 'Bar graphs and pie charts', difficulty: 3, band: 'foundational',
    stem: 'A pie chart represents parts of:', correct: 'A whole', wrong: ['Time only', 'Length', 'Weight'],
    solution: 'Pie charts show fractions of a total.' }),
  mcq({ id: 'G8.05-02', skillId: 'G8.05', skillName: 'Bar graphs and pie charts', difficulty: 4, band: 'foundational',
    stem: 'The full circle in a pie chart represents:', correct: '360°', wrong: ['180°', '100°', '90°'],
    solution: 'A full circle = 360°.' }),
  mcq({ id: 'G8.05-03', skillId: 'G8.05', skillName: 'Bar graphs and pie charts', difficulty: 5, band: 'core',
    stem: 'If 25% of a pie chart is red, its angle is:', correct: '90°', wrong: ['25°', '180°', '360°'],
    solution: '25% of 360° = 90°.' }),
  mcq({ id: 'G8.05-04', skillId: 'G8.05', skillName: 'Bar graphs and pie charts', difficulty: 7, band: 'advanced',
    stem: 'A pie chart has 4 sectors of angles 90°, 90°, 60°, 120°. Do they add to a full circle?', correct: 'Yes — sum is 360°', wrong: ['No — sum is 300°', 'No — sum is 400°', 'Cannot say'],
    solution: '90 + 90 + 60 + 120 = 360°.' }),

  mcq({ id: 'G8.06-01', skillId: 'G8.06', skillName: 'Algebraic identities', difficulty: 3, band: 'foundational',
    stem: '(a + b)² = ?', correct: 'a² + 2ab + b²', wrong: ['a² + b²', 'a² − b²', '2a + 2b'],
    solution: 'Standard identity: (a + b)² = a² + 2ab + b².' }),
  mcq({ id: 'G8.06-02', skillId: 'G8.06', skillName: 'Algebraic identities', difficulty: 4, band: 'foundational',
    stem: '(a − b)² = ?', correct: 'a² − 2ab + b²', wrong: ['a² − b²', 'a² + 2ab − b²', 'a − b'],
    solution: 'Standard identity: (a − b)² = a² − 2ab + b².' }),
  mcq({ id: 'G8.06-03', skillId: 'G8.06', skillName: 'Algebraic identities', difficulty: 5, band: 'core',
    stem: '(a + b)(a − b) = ?', correct: 'a² − b²', wrong: ['a² + b²', 'a² − 2ab + b²', '2ab'],
    solution: 'Difference of squares: (a+b)(a−b) = a² − b².' }),
  mcq({ id: 'G8.06-04', skillId: 'G8.06', skillName: 'Algebraic identities', difficulty: 7, band: 'advanced',
    stem: 'Use (a+b)² to find 102². Answer:', correct: '10,404', wrong: ['10,004', '10,400', '10,204'],
    solution: '102² = (100+2)² = 10,000 + 400 + 4 = 10,404.' }),
];

const CLASS9_M2: Item[] = [
  mcq({ id: 'G9.04-01', skillId: 'G9.04', skillName: 'Linear equations in two variables', difficulty: 3, band: 'foundational',
    stem: 'For x + y = 5, is (2, 3) a solution?', correct: 'Yes', wrong: ['No', 'Only if x = 0', 'Only if y = 0'],
    solution: '2 + 3 = 5. Yes.' }),
  mcq({ id: 'G9.04-02', skillId: 'G9.04', skillName: 'Linear equations in two variables', difficulty: 4, band: 'foundational',
    stem: 'How many solutions does x + y = 4 have (x, y real)?', correct: 'Infinitely many', wrong: ['0', '1', 'Exactly 4'],
    solution: 'A line has infinitely many points.' }),
  mcq({ id: 'G9.04-03', skillId: 'G9.04', skillName: 'Linear equations in two variables', difficulty: 5, band: 'core',
    stem: 'The line 2x + y = 6 crosses the y-axis at:', correct: '(0, 6)', wrong: ['(6, 0)', '(0, 3)', '(3, 0)'],
    solution: 'Set x = 0: y = 6.' }),
  mcq({ id: 'G9.04-04', skillId: 'G9.04', skillName: 'Linear equations in two variables', difficulty: 7, band: 'advanced',
    stem: 'The line 3x − y = 9 crosses the x-axis at:', correct: '(3, 0)', wrong: ['(0, 3)', '(9, 0)', '(0, −9)'],
    solution: 'Set y = 0: 3x = 9, x = 3.' }),

  mcq({ id: 'G9.05-01', skillId: 'G9.05', skillName: 'Congruence of triangles', difficulty: 3, band: 'foundational',
    stem: 'Two triangles are congruent if:', correct: 'All sides and angles are equal', wrong: ['Only angles equal', 'Only sides equal', 'They have equal area'],
    solution: 'Congruence needs all corresponding sides and angles equal.' }),
  mcq({ id: 'G9.05-02', skillId: 'G9.05', skillName: 'Congruence of triangles', difficulty: 4, band: 'foundational',
    stem: 'SSS congruence stands for:', correct: 'Side-Side-Side', wrong: ['Same-Small-Shape', 'Side-Sum-Set', 'Square-Same-Set'],
    solution: 'SSS = three sides equal implies congruence.' }),
  mcq({ id: 'G9.05-03', skillId: 'G9.05', skillName: 'Congruence of triangles', difficulty: 5, band: 'core',
    stem: 'Which is NOT a valid congruence rule?', correct: 'AAA (Angle-Angle-Angle)', wrong: ['SSS', 'SAS', 'ASA'],
    solution: 'AAA gives similarity, not congruence.' }),
  mcq({ id: 'G9.05-04', skillId: 'G9.05', skillName: 'Congruence of triangles', difficulty: 7, band: 'advanced',
    stem: 'In an isosceles triangle, angles opposite the two equal sides are:', correct: 'Equal', wrong: ['Complementary', 'Supplementary', 'Right angles'],
    solution: 'Isosceles triangle property: angles opposite equal sides are equal.' }),

  mcq({ id: 'G9.06-01', skillId: 'G9.06', skillName: 'Mean, median, mode (ungrouped)', difficulty: 3, band: 'foundational',
    stem: 'Mean of 4, 5, 6, 7, 8 is:', correct: '6', wrong: ['5', '7', '30'],
    solution: '(4+5+6+7+8)/5 = 30/5 = 6.' }),
  mcq({ id: 'G9.06-02', skillId: 'G9.06', skillName: 'Mean, median, mode (ungrouped)', difficulty: 4, band: 'foundational',
    stem: 'Median of 3, 5, 7, 9, 11 is:', correct: '7', wrong: ['5', '9', '35'],
    solution: 'Middle value of the sorted list = 7.' }),
  mcq({ id: 'G9.06-03', skillId: 'G9.06', skillName: 'Mean, median, mode (ungrouped)', difficulty: 5, band: 'core',
    stem: 'Mode of 2, 4, 4, 6, 8, 4, 10 is:', correct: '4', wrong: ['2', '6', '10'],
    solution: '4 appears three times, more than any other.' }),
  mcq({ id: 'G9.06-04', skillId: 'G9.06', skillName: 'Mean, median, mode (ungrouped)', difficulty: 7, band: 'advanced',
    stem: 'Median of 6, 4, 8, 2 is:', correct: '5', wrong: ['4', '6', '8'],
    solution: 'Sort: 2, 4, 6, 8. Even count → average middle two: (4+6)/2 = 5.' }),
];

const CLASS10_M2: Item[] = [
  mcq({ id: 'G10.04-01', skillId: 'G10.04', skillName: 'Distance and section formulae', difficulty: 3, band: 'foundational',
    stem: 'Distance between (0,0) and (3,4) is:', correct: '5', wrong: ['7', '12', '25'],
    solution: '√(3² + 4²) = √25 = 5.' }),
  mcq({ id: 'G10.04-02', skillId: 'G10.04', skillName: 'Distance and section formulae', difficulty: 4, band: 'foundational',
    stem: 'Midpoint of (2,3) and (8,7) is:', correct: '(5, 5)', wrong: ['(10, 10)', '(3, 2)', '(6, 4)'],
    solution: '((2+8)/2, (3+7)/2) = (5, 5).' }),
  mcq({ id: 'G10.04-03', skillId: 'G10.04', skillName: 'Distance and section formulae', difficulty: 5, band: 'core',
    stem: 'Distance between (1, 2) and (4, 6) is:', correct: '5', wrong: ['7', '3', '25'],
    solution: '√((4−1)² + (6−2)²) = √(9+16) = √25 = 5.' }),
  mcq({ id: 'G10.04-04', skillId: 'G10.04', skillName: 'Distance and section formulae', difficulty: 7, band: 'advanced',
    stem: 'Point dividing (0,0)–(10,0) in ratio 3:2 internally is:', correct: '(6, 0)', wrong: ['(4, 0)', '(3, 0)', '(5, 0)'],
    solution: 'Section formula: x = (3·10 + 2·0)/(3+2) = 30/5 = 6.' }),

  mcq({ id: 'G10.05-01', skillId: 'G10.05', skillName: 'Arithmetic progressions', difficulty: 3, band: 'foundational',
    stem: 'The AP 3, 7, 11, 15, … has common difference:', correct: '4', wrong: ['3', '7', '11'],
    solution: '7 − 3 = 4; 11 − 7 = 4. Common difference d = 4.' }),
  mcq({ id: 'G10.05-02', skillId: 'G10.05', skillName: 'Arithmetic progressions', difficulty: 4, band: 'foundational',
    stem: 'First term 5, common difference 3. Third term is:', correct: '11', wrong: ['8', '14', '15'],
    solution: 'a₃ = a + 2d = 5 + 6 = 11.' }),
  mcq({ id: 'G10.05-03', skillId: 'G10.05', skillName: 'Arithmetic progressions', difficulty: 6, band: 'core',
    stem: 'Sum of first 10 natural numbers is:', correct: '55', wrong: ['45', '50', '100'],
    solution: 'S = n(n+1)/2 = 10·11/2 = 55.' }),
  mcq({ id: 'G10.05-04', skillId: 'G10.05', skillName: 'Arithmetic progressions', difficulty: 7, band: 'advanced',
    stem: 'nth term of 2, 5, 8, 11, … is:', correct: '3n − 1', wrong: ['2n + 3', 'n + 2', '3n + 2'],
    solution: 'a = 2, d = 3. aₙ = 2 + (n−1)·3 = 3n − 1.' }),

  mcq({ id: 'G10.06-01', skillId: 'G10.06', skillName: 'Tangent to a circle', difficulty: 3, band: 'foundational',
    stem: 'A tangent to a circle touches it at how many points?', correct: '1', wrong: ['0', '2', 'Infinitely many'],
    solution: 'By definition, a tangent touches at exactly one point.' }),
  mcq({ id: 'G10.06-02', skillId: 'G10.06', skillName: 'Tangent to a circle', difficulty: 4, band: 'foundational',
    stem: 'The angle between a tangent and the radius at the point of contact is:', correct: '90°', wrong: ['0°', '45°', '180°'],
    solution: 'Tangent ⊥ radius at point of contact.' }),
  mcq({ id: 'G10.06-03', skillId: 'G10.06', skillName: 'Tangent to a circle', difficulty: 5, band: 'core',
    stem: 'From an external point, how many tangents can be drawn to a circle?', correct: '2', wrong: ['1', '0', 'Infinitely many'],
    solution: 'Exactly 2 tangents from a point outside the circle.' }),
  mcq({ id: 'G10.06-04', skillId: 'G10.06', skillName: 'Tangent to a circle', difficulty: 7, band: 'advanced',
    stem: 'Two tangents from an external point to a circle are:', correct: 'Equal in length', wrong: ['Perpendicular', 'Different lengths', 'Both diameters'],
    solution: 'Tangents from a common external point are equal in length.' }),
];

const CLASS11_M2: Item[] = [
  mcq({ id: 'G11.04-01', skillId: 'G11.04', skillName: 'Complex numbers', difficulty: 3, band: 'foundational',
    stem: 'i² = ?', correct: '−1', wrong: ['1', '0', 'i'],
    solution: 'By definition, i² = −1.' }),
  mcq({ id: 'G11.04-02', skillId: 'G11.04', skillName: 'Complex numbers', difficulty: 4, band: 'foundational',
    stem: '(2 + 3i) + (1 + 4i) = ?', correct: '3 + 7i', wrong: ['3 + 12i', '3i + 7', '2 + 12i'],
    solution: 'Add real and imaginary parts separately.' }),
  mcq({ id: 'G11.04-03', skillId: 'G11.04', skillName: 'Complex numbers', difficulty: 5, band: 'core',
    stem: 'Modulus of 3 + 4i is:', correct: '5', wrong: ['7', '25', '3'],
    solution: '|a + bi| = √(a² + b²) = √25 = 5.' }),
  mcq({ id: 'G11.04-04', skillId: 'G11.04', skillName: 'Complex numbers', difficulty: 7, band: 'advanced',
    stem: 'i^4 = ?', correct: '1', wrong: ['−1', 'i', '−i'],
    solution: 'i^4 = (i²)² = (−1)² = 1.' }),

  mcq({ id: 'G11.05-01', skillId: 'G11.05', skillName: 'Geometric progression sum', difficulty: 3, band: 'foundational',
    stem: 'Common ratio of 2, 6, 18, 54 is:', correct: '3', wrong: ['2', '4', '6'],
    solution: '6/2 = 3; 18/6 = 3.' }),
  mcq({ id: 'G11.05-02', skillId: 'G11.05', skillName: 'Geometric progression sum', difficulty: 4, band: 'foundational',
    stem: '3rd term of a GP with a = 2, r = 3:', correct: '18', wrong: ['6', '9', '54'],
    solution: 'aₙ = a·r^(n−1) = 2·9 = 18.' }),
  mcq({ id: 'G11.05-03', skillId: 'G11.05', skillName: 'Geometric progression sum', difficulty: 6, band: 'core',
    stem: 'Sum of 1, 2, 4, 8, 16 (r=2) is:', correct: '31', wrong: ['32', '30', '16'],
    solution: 'S = a(r^n − 1)/(r − 1) = 1·(32−1)/1 = 31.' }),
  mcq({ id: 'G11.05-04', skillId: 'G11.05', skillName: 'Geometric progression sum', difficulty: 7, band: 'advanced',
    stem: 'Sum to infinity of 1 + 1/2 + 1/4 + … is:', correct: '2', wrong: ['1', '∞', '3/2'],
    solution: 'For |r| < 1: S∞ = a/(1−r) = 1/(1/2) = 2.' }),

  mcq({ id: 'G11.06-01', skillId: 'G11.06', skillName: 'Slope and equation of a line', difficulty: 3, band: 'foundational',
    stem: 'Slope of the line joining (0,0) and (2,6) is:', correct: '3', wrong: ['1/3', '6', '2'],
    solution: 'Slope = (6−0)/(2−0) = 3.' }),
  mcq({ id: 'G11.06-02', skillId: 'G11.06', skillName: 'Slope and equation of a line', difficulty: 4, band: 'foundational',
    stem: 'Slope of a horizontal line is:', correct: '0', wrong: ['1', 'undefined', '−1'],
    solution: 'A horizontal line has no rise, so slope = 0.' }),
  mcq({ id: 'G11.06-03', skillId: 'G11.06', skillName: 'Slope and equation of a line', difficulty: 5, band: 'core',
    stem: 'Equation of a line with slope 2 through (0, 3):', correct: 'y = 2x + 3', wrong: ['y = 3x + 2', 'y = 2x − 3', 'y = x + 2'],
    solution: 'y = mx + c with m = 2 and c = 3.' }),
  mcq({ id: 'G11.06-04', skillId: 'G11.06', skillName: 'Slope and equation of a line', difficulty: 7, band: 'advanced',
    stem: 'Two lines are perpendicular if their slopes multiply to:', correct: '−1', wrong: ['0', '1', 'undefined'],
    solution: 'For perpendicular lines (with defined slopes), m₁ · m₂ = −1.' }),
];

const CLASS12_M2: Item[] = [
  mcq({ id: 'G12.04-01', skillId: 'G12.04', skillName: 'Determinants (2×2 and 3×3)', difficulty: 3, band: 'foundational',
    stem: 'det [[3,4],[1,2]] = ?', correct: '2', wrong: ['10', '−2', '11'],
    solution: 'ad − bc = 3·2 − 4·1 = 6 − 4 = 2.' }),
  mcq({ id: 'G12.04-02', skillId: 'G12.04', skillName: 'Determinants (2×2 and 3×3)', difficulty: 4, band: 'foundational',
    stem: 'det [[1,0,0],[0,1,0],[0,0,1]] = ?', correct: '1', wrong: ['0', '3', '−1'],
    solution: 'Determinant of the identity matrix is 1.' }),
  mcq({ id: 'G12.04-03', skillId: 'G12.04', skillName: 'Determinants (2×2 and 3×3)', difficulty: 6, band: 'core',
    stem: 'If det(A) = 0, then matrix A is:', correct: 'Singular (non-invertible)', wrong: ['Invertible', 'Orthogonal', 'Identity'],
    solution: 'A determinant of zero indicates a singular matrix.' }),
  mcq({ id: 'G12.04-04', skillId: 'G12.04', skillName: 'Determinants (2×2 and 3×3)', difficulty: 7, band: 'advanced',
    stem: 'det [[a,b],[c,d]] = 10. det [[c,d],[a,b]] = ?', correct: '−10', wrong: ['10', '0', '20'],
    solution: 'Row-swap changes the sign of the determinant.' }),

  mcq({ id: 'G12.05-01', skillId: 'G12.05', skillName: 'Chain rule for derivatives', difficulty: 3, band: 'foundational',
    stem: 'd/dx (sin(2x)) = ?', correct: '2 cos(2x)', wrong: ['cos(2x)', '−2 cos(2x)', '2 sin(2x)'],
    solution: 'Chain rule: d/dx sin(u) = cos(u)·du/dx; here du/dx = 2.' }),
  mcq({ id: 'G12.05-02', skillId: 'G12.05', skillName: 'Chain rule for derivatives', difficulty: 4, band: 'foundational',
    stem: 'd/dx ((3x + 1)²) = ?', correct: '6(3x + 1)', wrong: ['2(3x + 1)', '6x + 1', '3(3x + 1)²'],
    solution: '2(3x+1)·3 = 6(3x+1).' }),
  mcq({ id: 'G12.05-03', skillId: 'G12.05', skillName: 'Chain rule for derivatives', difficulty: 6, band: 'core',
    stem: 'd/dx (e^(2x)) = ?', correct: '2 e^(2x)', wrong: ['e^(2x)', '2x·e^(2x−1)', 'e^(2x)/2'],
    solution: 'd/dx e^u = e^u · du/dx = e^(2x) · 2.' }),
  mcq({ id: 'G12.05-04', skillId: 'G12.05', skillName: 'Chain rule for derivatives', difficulty: 7, band: 'advanced',
    stem: 'd/dx (ln(x² + 1)) = ?', correct: '2x / (x² + 1)', wrong: ['1 / (x² + 1)', '2x', '(x² + 1)/2x'],
    solution: 'd/dx ln(u) = (1/u)·du/dx = 2x / (x² + 1).' }),

  mcq({ id: 'G12.06-01', skillId: 'G12.06', skillName: 'Dot product of vectors', difficulty: 3, band: 'foundational',
    stem: '(2, 3) · (4, 1) = ?', correct: '11', wrong: ['8', '3', '14'],
    solution: '2·4 + 3·1 = 8 + 3 = 11.' }),
  mcq({ id: 'G12.06-02', skillId: 'G12.06', skillName: 'Dot product of vectors', difficulty: 4, band: 'foundational',
    stem: 'Dot product of perpendicular vectors is:', correct: '0', wrong: ['1', '−1', 'Undefined'],
    solution: 'Perpendicular ⇒ cos 90° = 0 ⇒ dot = 0.' }),
  mcq({ id: 'G12.06-03', skillId: 'G12.06', skillName: 'Dot product of vectors', difficulty: 6, band: 'core',
    stem: '(1, 2, 3) · (4, −5, 6) = ?', correct: '12', wrong: ['−12', '3', '32'],
    solution: '1·4 + 2·(−5) + 3·6 = 4 − 10 + 18 = 12.' }),
  mcq({ id: 'G12.06-04', skillId: 'G12.06', skillName: 'Dot product of vectors', difficulty: 7, band: 'advanced',
    stem: 'Angle between (1, 0) and (0, 1) is:', correct: '90°', wrong: ['0°', '45°', '180°'],
    solution: 'Dot product = 0 ⇒ vectors are perpendicular.' }),
];

// Public export — spread into ITEMS.
export const STARTER_GRADE_ITEMS: Item[] = [
  ...CLASS1, ...CLASS1_M2,
  ...CLASS2, ...CLASS2_M2,
  ...CLASS3, ...CLASS3_M2,
  ...CLASS4, ...CLASS4_M2,
  ...CLASS5, ...CLASS5_M2,
  ...CLASS8, ...CLASS8_M2,
  ...CLASS9, ...CLASS9_M2,
  ...CLASS10, ...CLASS10_M2,
  ...CLASS11, ...CLASS11_M2,
  ...CLASS12, ...CLASS12_M2,
];

// Also export a per-grade map for the registry — keeps registration code
// short and lets the validator confirm each grade has its expected count.
export const STARTER_ITEMS_BY_GRADE: Record<string, Item[]> = {
  grade_01: CLASS1,
  grade_02: CLASS2,
  grade_03: CLASS3,
  grade_04: CLASS4,
  grade_05: CLASS5,
  grade_08: CLASS8,
  grade_09: CLASS9,
  grade_10: CLASS10,
  grade_11: CLASS11,
  grade_12: CLASS12,
};

// Descriptive metadata for each grade — used by the registry to build
// modules, skills, and blueprints.
export type StarterGradeMeta = {
  gradeId: string;
  moduleTitle: string;
  moduleDescription: string;
  skills: Array<{
    legacyId: string;
    displayLabel: string;
    shortLabel: string;
  }>;
};

export const STARTER_GRADE_META: StarterGradeMeta[] = [
  {
    gradeId: 'grade_01',
    moduleTitle: 'Numbers and Addition (Class 1 — starter)',
    moduleDescription: 'Counting up to 20, single-digit addition, single-digit subtraction. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G1.01', displayLabel: 'Counting up to 20', shortLabel: 'G1.01 — Counting' },
      { legacyId: 'G1.02', displayLabel: 'Single-digit addition', shortLabel: 'G1.02 — Add 1-digit' },
      { legacyId: 'G1.03', displayLabel: 'Single-digit subtraction', shortLabel: 'G1.03 — Sub 1-digit' },
    ],
  },
  {
    gradeId: 'grade_02',
    moduleTitle: 'Place Value and Two-Digit Arithmetic (Class 2 — starter)',
    moduleDescription: 'Place value up to 99, two-digit addition and subtraction. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G2.01', displayLabel: 'Place value up to 99', shortLabel: 'G2.01 — Place value' },
      { legacyId: 'G2.02', displayLabel: 'Two-digit addition', shortLabel: 'G2.02 — Add 2-digit' },
      { legacyId: 'G2.03', displayLabel: 'Two-digit subtraction', shortLabel: 'G2.03 — Sub 2-digit' },
    ],
  },
  {
    gradeId: 'grade_03',
    moduleTitle: 'Multiplication, Division and Three-Digit Numbers (Class 3 — starter)',
    moduleDescription: 'Multiplication tables 2–5, simple division, three-digit place value. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G3.01', displayLabel: 'Multiplication tables 2–5', shortLabel: 'G3.01 — Times tables' },
      { legacyId: 'G3.02', displayLabel: 'Simple division', shortLabel: 'G3.02 — Division' },
      { legacyId: 'G3.03', displayLabel: 'Three-digit place value', shortLabel: 'G3.03 — 3-digit place' },
    ],
  },
  {
    gradeId: 'grade_04',
    moduleTitle: 'Fractions, Measurement, Multi-digit Multiplication (Class 4 — starter)',
    moduleDescription: 'Introduction to fractions, length/weight, multi-digit multiplication. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G4.01', displayLabel: 'Fractions introduction', shortLabel: 'G4.01 — Fractions' },
      { legacyId: 'G4.02', displayLabel: 'Length and weight basics', shortLabel: 'G4.02 — Measurement' },
      { legacyId: 'G4.03', displayLabel: 'Multi-digit multiplication', shortLabel: 'G4.03 — × multi-digit' },
    ],
  },
  {
    gradeId: 'grade_05',
    moduleTitle: 'Decimals, Percentage, Long Division (Class 5 — starter)',
    moduleDescription: 'Decimal place value, percentage introduction, long division. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G5.01', displayLabel: 'Decimal place value', shortLabel: 'G5.01 — Decimals' },
      { legacyId: 'G5.02', displayLabel: 'Percentage introduction', shortLabel: 'G5.02 — Percent' },
      { legacyId: 'G5.03', displayLabel: 'Long division', shortLabel: 'G5.03 — Long division' },
    ],
  },
  {
    gradeId: 'grade_08',
    moduleTitle: 'Rational Numbers, Linear Equations, Squares & Cubes (Class 8 — starter)',
    moduleDescription: 'Operations on rational numbers, one-variable linear equations, squares/cubes and roots. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G8.01', displayLabel: 'Rational number operations', shortLabel: 'G8.01 — Rationals' },
      { legacyId: 'G8.02', displayLabel: 'Linear equations in one variable', shortLabel: 'G8.02 — Linear eqns' },
      { legacyId: 'G8.03', displayLabel: 'Squares and cubes', shortLabel: 'G8.03 — Squares/cubes' },
    ],
  },
  {
    gradeId: 'grade_09',
    moduleTitle: 'Number Systems, Polynomials, Coordinate Geometry (Class 9 — starter)',
    moduleDescription: 'Real number classification, polynomial arithmetic, coordinate geometry basics. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G9.01', displayLabel: 'Real number classification', shortLabel: 'G9.01 — Real numbers' },
      { legacyId: 'G9.02', displayLabel: 'Polynomial arithmetic', shortLabel: 'G9.02 — Polynomials' },
      { legacyId: 'G9.03', displayLabel: 'Coordinate geometry basics', shortLabel: 'G9.03 — Coord geometry' },
    ],
  },
  {
    gradeId: 'grade_10',
    moduleTitle: 'Real Numbers HCF/LCM, Quadratics, Basic Trigonometry (Class 10 — starter)',
    moduleDescription: 'HCF/LCM basics, quadratic equations, standard-angle trigonometry. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G10.01', displayLabel: 'Real numbers HCF/LCM', shortLabel: 'G10.01 — HCF/LCM' },
      { legacyId: 'G10.02', displayLabel: 'Quadratic equations', shortLabel: 'G10.02 — Quadratics' },
      { legacyId: 'G10.03', displayLabel: 'Basic trigonometry', shortLabel: 'G10.03 — Trig basics' },
    ],
  },
  {
    gradeId: 'grade_11',
    moduleTitle: 'Sets, Functions, Trigonometry (Class 11 — starter)',
    moduleDescription: 'Sets and set operations, functions basics, trigonometric identities. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G11.01', displayLabel: 'Sets and operations', shortLabel: 'G11.01 — Sets' },
      { legacyId: 'G11.02', displayLabel: 'Functions basics', shortLabel: 'G11.02 — Functions' },
      { legacyId: 'G11.03', displayLabel: 'Trigonometric identities', shortLabel: 'G11.03 — Trig identities' },
    ],
  },
  {
    gradeId: 'grade_12',
    moduleTitle: 'Matrices, Derivatives, Integrals (Class 12 — starter)',
    moduleDescription: 'Matrix basics, derivatives of standard functions, definite integrals. Prototype starter content, teacher review required.',
    skills: [
      { legacyId: 'G12.01', displayLabel: 'Matrix operations', shortLabel: 'G12.01 — Matrices' },
      { legacyId: 'G12.02', displayLabel: 'Derivatives basics', shortLabel: 'G12.02 — Derivatives' },
      { legacyId: 'G12.03', displayLabel: 'Definite integrals', shortLabel: 'G12.03 — Integrals' },
    ],
  },
];

// v0.31 — Module 2 metadata per starter grade. Same shape as
// STARTER_GRADE_META; registered as an additional module under the
// same gradeId. Each module has its own legacy module id suffix
// (`_m2`) so registry ids stay unique.
export const STARTER_GRADE_META_M2: StarterGradeMeta[] = [
  {
    gradeId: 'grade_01',
    moduleTitle: 'Shapes, Measurement & Money (Class 1 — module 2, starter)',
    moduleDescription: '2D shape recognition, length comparison, Indian coins. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G1.04', displayLabel: 'Recognise 2D shapes', shortLabel: 'G1.04 — 2D shapes' },
      { legacyId: 'G1.05', displayLabel: 'Compare lengths', shortLabel: 'G1.05 — Length compare' },
      { legacyId: 'G1.06', displayLabel: 'Indian coins', shortLabel: 'G1.06 — Coins' },
    ],
  },
  {
    gradeId: 'grade_02',
    moduleTitle: 'Multiplication basics, Money, Time (Class 2 — module 2, starter)',
    moduleDescription: 'Repeated addition and tables 2–3, rupees and paise, reading clocks. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G2.04', displayLabel: 'Repeated addition (tables of 2 & 3)', shortLabel: 'G2.04 — Tables 2/3' },
      { legacyId: 'G2.05', displayLabel: 'Rupees and paise', shortLabel: 'G2.05 — Rupees/paise' },
      { legacyId: 'G2.06', displayLabel: 'Reading clocks', shortLabel: 'G2.06 — Clocks' },
    ],
  },
  {
    gradeId: 'grade_03',
    moduleTitle: 'Fractions, Multi-digit Arithmetic, Measurement (Class 3 — module 2, starter)',
    moduleDescription: 'Halves, thirds and quarters; 3-digit addition with regrouping; length in metres. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G3.04', displayLabel: 'Halves, thirds and quarters', shortLabel: 'G3.04 — Fractions' },
      { legacyId: 'G3.05', displayLabel: '3-digit addition with regrouping', shortLabel: 'G3.05 — 3-digit add' },
      { legacyId: 'G3.06', displayLabel: 'Length in meters', shortLabel: 'G3.06 — Length m' },
    ],
  },
  {
    gradeId: 'grade_04',
    moduleTitle: 'Large Numbers, Division, Decimals intro (Class 4 — module 2, starter)',
    moduleDescription: 'Numbers up to a lakh, division with remainders, tenths and hundredths. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G4.04', displayLabel: 'Numbers up to a lakh', shortLabel: 'G4.04 — Lakhs' },
      { legacyId: 'G4.05', displayLabel: 'Division with remainders', shortLabel: 'G4.05 — Division' },
      { legacyId: 'G4.06', displayLabel: 'Tenths and hundredths', shortLabel: 'G4.06 — Decimals' },
    ],
  },
  {
    gradeId: 'grade_05',
    moduleTitle: 'Fractions, Geometry, Data (Class 5 — module 2, starter)',
    moduleDescription: 'Add/subtract fractions with unlike denominators, perimeter/area of rectangle, reading bar graphs. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G5.04', displayLabel: 'Fractions with unlike denominators', shortLabel: 'G5.04 — Unlike frac' },
      { legacyId: 'G5.05', displayLabel: 'Perimeter and area of a rectangle', shortLabel: 'G5.05 — Perimeter/area' },
      { legacyId: 'G5.06', displayLabel: 'Reading bar graphs', shortLabel: 'G5.06 — Bar graphs' },
    ],
  },
  {
    gradeId: 'grade_08',
    moduleTitle: 'Mensuration, Data Handling, Identities (Class 8 — module 2, starter)',
    moduleDescription: 'Area of triangles and parallelograms, bar graphs and pie charts, algebraic identities. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G8.04', displayLabel: 'Area of triangles and parallelograms', shortLabel: 'G8.04 — Area △/▱' },
      { legacyId: 'G8.05', displayLabel: 'Bar graphs and pie charts', shortLabel: 'G8.05 — Pie charts' },
      { legacyId: 'G8.06', displayLabel: 'Algebraic identities', shortLabel: 'G8.06 — Identities' },
    ],
  },
  {
    gradeId: 'grade_09',
    moduleTitle: 'Linear Eqns in 2 Var, Triangles, Statistics (Class 9 — module 2, starter)',
    moduleDescription: 'Solutions of two-variable linear equations, congruence of triangles, mean/median/mode of ungrouped data. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G9.04', displayLabel: 'Linear equations in two variables', shortLabel: 'G9.04 — LE 2-var' },
      { legacyId: 'G9.05', displayLabel: 'Congruence of triangles', shortLabel: 'G9.05 — Congruence' },
      { legacyId: 'G9.06', displayLabel: 'Mean, median, mode (ungrouped)', shortLabel: 'G9.06 — Mean/med/mode' },
    ],
  },
  {
    gradeId: 'grade_10',
    moduleTitle: 'Coordinate Geometry, AP, Circles (Class 10 — module 2, starter)',
    moduleDescription: 'Distance and section formulae, nth term and sum of an AP, tangent-to-circle properties. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G10.04', displayLabel: 'Distance and section formulae', shortLabel: 'G10.04 — Distance/section' },
      { legacyId: 'G10.05', displayLabel: 'Arithmetic progressions', shortLabel: 'G10.05 — AP' },
      { legacyId: 'G10.06', displayLabel: 'Tangent to a circle', shortLabel: 'G10.06 — Tangent' },
    ],
  },
  {
    gradeId: 'grade_11',
    moduleTitle: 'Complex Numbers, Sequences, Straight Lines (Class 11 — module 2, starter)',
    moduleDescription: 'Imaginary unit and modulus, GP sum formula, slope and equation of a line. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G11.04', displayLabel: 'Complex numbers', shortLabel: 'G11.04 — Complex' },
      { legacyId: 'G11.05', displayLabel: 'Geometric progression sum', shortLabel: 'G11.05 — GP sum' },
      { legacyId: 'G11.06', displayLabel: 'Slope and equation of a line', shortLabel: 'G11.06 — Line slope' },
    ],
  },
  {
    gradeId: 'grade_12',
    moduleTitle: 'Determinants, Continuity, Vectors (Class 12 — module 2, starter)',
    moduleDescription: '2×2 and 3×3 determinants, chain rule for derivatives, dot product of vectors. Prototype content, teacher review required.',
    skills: [
      { legacyId: 'G12.04', displayLabel: 'Determinants (2×2 and 3×3)', shortLabel: 'G12.04 — Determinants' },
      { legacyId: 'G12.05', displayLabel: 'Chain rule for derivatives', shortLabel: 'G12.05 — Chain rule' },
      { legacyId: 'G12.06', displayLabel: 'Dot product of vectors', shortLabel: 'G12.06 — Dot product' },
    ],
  },
];
