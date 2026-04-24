// FR.06 item bank (pre-pilot drafts).
// Every MCQ option is tagged with a misconception code so the teacher
// dashboard can aggregate diagnostic signal across a student's responses.
//
// IMPORTANT: These items are pre-pilot. Difficulty values are SEED estimates
// on a 1-10 scale, not calibrated IRT parameters. Do not treat outputs as
// validated scores.

export type MisconceptionCode =
  | 'add_across'
  | 'incomplete_conversion'
  | 'product_not_lcm'
  | 'operation_confusion'
  | 'mixed_number_error'
  | 'conceptual_gap'
  | 'arithmetic_slip'
  | 'form_error'
  | 'none';

export const MISCONCEPTION_LABELS: Record<MisconceptionCode, string> = {
  add_across: 'Adds numerators and denominators separately',
  incomplete_conversion: 'Finds common denominator but does not scale numerators',
  product_not_lcm: 'Uses product of denominators instead of LCM',
  operation_confusion: 'Confuses addition with another operation',
  mixed_number_error: 'Handles whole and fractional parts incorrectly',
  conceptual_gap: 'Misunderstands when fractions can be added',
  arithmetic_slip: 'Basic arithmetic error, not a fraction misconception',
  form_error: 'Answer not in required form (e.g., not simplified)',
  none: 'Correct answer',
};

export const MISCONCEPTION_NEXT_STEP: Record<MisconceptionCode, string> = {
  add_across:
    'Revisit the meaning of a denominator. Use fraction-bar or area models to show why 1/2 + 1/4 cannot be 2/6. Practice 3 like-denominator problems first, then bridge to unlike denominators with one common multiple.',
  incomplete_conversion:
    'Emphasize that multiplying the denominator by k requires multiplying the numerator by the same k. Drill equivalent-fraction practice with side-by-side models before returning to addition.',
  product_not_lcm:
    'Contrast LCM vs. product of denominators side by side. Have the student simplify an answer produced via the product method, and notice the extra work. Reinforce LCM via prime factorization for non-coprime pairs.',
  operation_confusion:
    'Explicitly separate the rules for adding vs. multiplying fractions. Short-answer drill mixing +, -, x on like-denominator pairs first to consolidate operation identification.',
  mixed_number_error:
    'Two parallel methods: (a) whole and fractional parts separately, (b) convert to improper fractions. Let the student try both on the same problem and compare. Flag whichever method produces the mistake.',
  conceptual_gap:
    'Step back from procedure and address "why a common denominator?" using models. Show that 1/2 + 1/3 is adding unequal pieces - common denominator makes them comparable.',
  arithmetic_slip:
    'Not a fraction-specific issue. Encourage rechecking arithmetic. Monitor for repeated pattern across items.',
  form_error:
    'Reinforce the convention: answers should be in simplest form (or as a mixed number, as specified). Practice HCF-based simplification on a few sums.',
  none: '',
};

export type Item = {
  id: string;
  skillId: 'FR.06';
  skillName: string;
  difficulty: number; // 1-10 seed difficulty
  band: 'foundational' | 'core' | 'advanced';
  cognitiveType:
    | 'Procedural fluency'
    | 'Conceptual understanding'
    | 'Application / word problem';
  stem: string;
  options: Array<{ text: string; misconception: MisconceptionCode }>;
  correctIndex: 0 | 1 | 2 | 3;
  solution: string;
  estimatedTimeSec: number;
};

// The 12 pre-pilot items for FR.06.
export const ITEMS: Item[] = [
  {
    id: 'FR.06-01',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    stem: 'Add: 1/2 + 1/4',
    options: [
      { text: '2/6', misconception: 'add_across' },
      { text: '2/4', misconception: 'incomplete_conversion' },
      { text: '3/4', misconception: 'none' },
      { text: '1/8', misconception: 'operation_confusion' },
    ],
    correctIndex: 2,
    solution:
      'LCM of 2 and 4 is 4. Convert 1/2 to 2/4. Then 2/4 + 1/4 = 3/4.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.06-02',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Conceptual understanding',
    stem:
      'Ravi wants to add 1/3 + 1/6. What should he do FIRST before adding the numerators?',
    options: [
      {
        text: 'Add the denominators to get a new denominator.',
        misconception: 'conceptual_gap',
      },
      {
        text: 'Convert both fractions so they have the same denominator.',
        misconception: 'none',
      },
      { text: 'Multiply the two fractions.', misconception: 'operation_confusion' },
      { text: 'Simplify 1/6 to its lowest form.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution:
      'Fractions can be added only when they have the same denominator. LCM(3, 6) = 6, so 1/3 becomes 2/6 and then 2/6 + 1/6 = 3/6 = 1/2.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.06-03',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    stem: 'Find the value of 2/3 + 1/6.',
    options: [
      { text: '3/9', misconception: 'add_across' },
      { text: '3/6', misconception: 'incomplete_conversion' },
      { text: '5/6', misconception: 'none' },
      { text: '5/9', misconception: 'add_across' },
    ],
    correctIndex: 2,
    solution:
      'LCM(3, 6) = 6. Convert 2/3 = 4/6. Then 4/6 + 1/6 = 5/6, already in simplest form.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.06-04',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    stem: 'Compute 1/3 + 1/4.',
    options: [
      { text: '2/7', misconception: 'add_across' },
      { text: '7/12', misconception: 'none' },
      { text: '2/12', misconception: 'incomplete_conversion' },
      { text: '1/12', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'LCM(3, 4) = 12. Convert: 1/3 = 4/12 and 1/4 = 3/12. Then 4/12 + 3/12 = 7/12.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.06-05',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    stem: 'Find the sum: 2/5 + 1/3.',
    options: [
      { text: '3/8', misconception: 'add_across' },
      { text: '3/15', misconception: 'incomplete_conversion' },
      { text: '11/15', misconception: 'none' },
      { text: '2/15', misconception: 'incomplete_conversion' },
    ],
    correctIndex: 2,
    solution:
      'LCM(5, 3) = 15. Convert: 2/5 = 6/15 and 1/3 = 5/15. Then 6/15 + 5/15 = 11/15.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.06-06',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    stem: 'Simplify: 3/8 + 5/12. Express your answer in simplest form.',
    options: [
      { text: '8/20', misconception: 'add_across' },
      { text: '19/24', misconception: 'none' },
      { text: '76/96', misconception: 'product_not_lcm' },
      { text: '2/5', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      'LCM(8, 12) = 24. Convert: 3/8 = 9/24 and 5/12 = 10/24. Then 9/24 + 10/24 = 19/24 (already in simplest form since HCF(19,24)=1).',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.06-07',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Conceptual understanding',
    stem:
      'Which of the following statements about adding 2/3 and 1/4 is correct?',
    options: [
      {
        text: 'Since 3 and 4 are different numbers, the two fractions cannot be added.',
        misconception: 'conceptual_gap',
      },
      {
        text: 'The sum is 3/7, because we add the numerators and the denominators.',
        misconception: 'add_across',
      },
      {
        text:
          'We first rewrite both fractions with the common denominator 12, and then add the numerators.',
        misconception: 'none',
      },
      {
        text: 'The sum is always 1, because 2/3 and 1/4 are both less than 1.',
        misconception: 'conceptual_gap',
      },
    ],
    correctIndex: 2,
    solution:
      'Find LCM(3, 4) = 12. Then 2/3 = 8/12 and 1/4 = 3/12, so 8/12 + 3/12 = 11/12.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.06-08',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    stem: 'Add the mixed numbers: 2 1/2 + 1 1/3.',
    options: [
      { text: '3 2/5', misconception: 'add_across' },
      { text: '3 5/6', misconception: 'none' },
      { text: '2 5/6', misconception: 'mixed_number_error' },
      { text: '3 1/6', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      'Whole parts: 2 + 1 = 3. Fractional parts: 1/2 + 1/3. LCM(2,3)=6, so 1/2 = 3/6 and 1/3 = 2/6, giving 5/6. Total = 3 5/6.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.06-09',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 7,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    stem:
      'Ananya drank 1/4 litre of milk in the morning and 2/3 litre of milk in the evening. How much milk did she drink in all that day?',
    options: [
      { text: '3/7 litre', misconception: 'add_across' },
      { text: '3/12 litre', misconception: 'incomplete_conversion' },
      { text: '11/12 litre', misconception: 'none' },
      { text: '1 1/12 litres', misconception: 'form_error' },
    ],
    correctIndex: 2,
    solution:
      'Total = 1/4 + 2/3. LCM(4,3) = 12. Convert: 1/4 = 3/12 and 2/3 = 8/12. Sum = 11/12 litre.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.06-10',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 7,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    stem:
      'Rohan ran 1 1/2 km on Monday and 2 1/4 km on Tuesday. What is the total distance he ran on these two days?',
    options: [
      { text: '3 3/4 km', misconception: 'none' },
      { text: '3 2/6 km', misconception: 'add_across' },
      { text: '3 1/4 km', misconception: 'arithmetic_slip' },
      { text: '2 3/4 km', misconception: 'mixed_number_error' },
    ],
    correctIndex: 0,
    solution:
      'Whole parts: 1 + 2 = 3. Fractional parts: 1/2 + 1/4. LCM(2,4)=4, so 1/2 = 2/4, giving 2/4 + 1/4 = 3/4. Total = 3 3/4 km.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.06-11',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    stem:
      'A jug holds 3/5 litre of orange juice. Priya pours in 1/4 litre more from a bottle, and then her younger brother adds another 1/10 litre. How much juice is in the jug now?',
    options: [
      { text: '5/19 litre', misconception: 'add_across' },
      { text: '9/10 litre', misconception: 'incomplete_conversion' },
      { text: '19/20 litre', misconception: 'none' },
      { text: '1 1/20 litres', misconception: 'form_error' },
    ],
    correctIndex: 2,
    solution:
      'Total = 3/5 + 1/4 + 1/10. LCM(5,4,10) = 20. Convert: 3/5 = 12/20, 1/4 = 5/20, 1/10 = 2/20. Sum = 19/20 litre.',
    estimatedTimeSec: 120,
  },
  {
    id: 'FR.06-12',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 9,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    stem:
      "Meera walked 2 3/4 km from her home to school. After school, she walked 1 2/3 km to her grandmother's house, and then 1/2 km to a nearby shop. What is the total distance Meera walked that day? Give your answer as a mixed number in its simplest form.",
    options: [
      { text: '4 11/12 km', misconception: 'none' },
      { text: '4 6/9 km', misconception: 'add_across' },
      { text: '5 km', misconception: 'arithmetic_slip' },
      { text: '3 11/12 km', misconception: 'mixed_number_error' },
    ],
    correctIndex: 0,
    solution:
      '2 3/4 = 11/4, 1 2/3 = 5/3. LCM(4,3,2)=12. So 11/4 = 33/12, 5/3 = 20/12, 1/2 = 6/12. Sum = 59/12 = 4 11/12 km.',
    estimatedTimeSec: 150,
  },
];
