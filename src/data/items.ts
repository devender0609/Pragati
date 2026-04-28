// FR.06 item bank (pre-pilot drafts).
// Every distractor is tagged with a misconception code so the teacher
// dashboard can aggregate diagnostic signal across a student's responses.
//
// IMPORTANT: These items are pre-pilot. Difficulty values are SEED estimates
// on a 1-10 scale, not calibrated IRT parameters. Do not treat outputs as
// validated scores.
//
// v0.3 additions:
//   - Bank expanded from 12 to 24 items.
//   - Items are now a discriminated union: MCQ items (kind: 'mcq') and
//     numeric-entry items (kind: 'numeric').
//   - Items can carry an optional `visual` spec (fraction bars or area
//     grids) that the assessment view renders inline above the stem.
//
// v0.4 additions:
//   - Second skill bank: FR.07 (Subtract fractions with unlike denominators).
//     20 new items (4 foundational, 12 core, 4 advanced).
//   - New misconception codes: `subtract_across` (mirror of add_across) and
//     `borrowing_error` (mishandles the borrow when subtracting mixed
//     numbers).
//   - Each Item now declares `skillId: 'FR.06' | 'FR.07'`. The adaptive
//     engine and class dashboard can scope the pool by skill; the UI can
//     also run a "mixed" session that draws from both banks.

// ---------------------------------------------------------------------------
// Misconception taxonomy
// ---------------------------------------------------------------------------
// Codes added in v0.4 for FR.07:
//   - subtract_across: subtracts numerators AND denominators (mirror of
//     add_across).
//   - borrowing_error: mishandles the borrow when subtracting mixed
//     numbers (e.g., 3 1/4 - 1 3/4 produces 2 1/2 because the student
//     "subtracted the smaller fraction from the larger").
export type MisconceptionCode =
  | 'add_across'
  | 'subtract_across'
  | 'incomplete_conversion'
  | 'product_not_lcm'
  | 'operation_confusion'
  | 'mixed_number_error'
  | 'borrowing_error'
  | 'conceptual_gap'
  | 'arithmetic_slip'
  | 'form_error'
  | 'visual_misread'
  | 'none';

export const MISCONCEPTION_LABELS: Record<MisconceptionCode, string> = {
  add_across: 'Adds numerators and denominators separately',
  subtract_across: 'Subtracts numerators and denominators separately',
  incomplete_conversion: 'Finds common denominator but does not scale numerators',
  product_not_lcm: 'Uses product of denominators instead of LCM',
  operation_confusion: 'Confuses the operation (e.g., adds when asked to subtract)',
  mixed_number_error: 'Handles whole and fractional parts incorrectly',
  borrowing_error:
    'Borrowing slip in mixed-number subtraction (subtracts smaller part from larger to avoid the borrow)',
  conceptual_gap: 'Misunderstands when fractions can be combined',
  arithmetic_slip: 'Basic arithmetic error, not a fraction misconception',
  form_error: 'Answer not in required form (e.g., not simplified or improper fractional part)',
  visual_misread: 'Misreads the fraction shown in the diagram',
  none: 'Correct answer',
};

export const MISCONCEPTION_NEXT_STEP: Record<MisconceptionCode, string> = {
  add_across:
    'Revisit the meaning of a denominator. Use fraction-bar or area models to show why 1/2 + 1/4 cannot be 2/6. Practise 3 like-denominator problems first, then bridge to unlike denominators with one common multiple.',
  subtract_across:
    'Same fix as add_across, but in the subtraction direction. Show with bars why 3/4 − 1/2 cannot be 2/2. Re-establish that the denominator names the size of the piece, and only numerators move when the denominators already match.',
  incomplete_conversion:
    'Emphasise that multiplying the denominator by k requires multiplying the numerator by the same k. Drill equivalent-fraction practice with side-by-side models before returning to addition or subtraction.',
  product_not_lcm:
    'Contrast LCM vs. product of denominators side by side. Have the student simplify an answer produced via the product method, and notice the extra work. Reinforce LCM via prime factorisation for non-coprime pairs.',
  operation_confusion:
    'Explicitly separate the rules for adding, subtracting, and multiplying fractions. Short-answer drill mixing +, −, × on like-denominator pairs first to consolidate operation identification.',
  mixed_number_error:
    'Two parallel methods: (a) whole and fractional parts separately, (b) convert to improper fractions. Let the student try both on the same problem and compare. Flag whichever method produces the mistake.',
  borrowing_error:
    'Walk through borrowing on a number line: 3 1/4 = 2 + 5/4, so 3 1/4 − 1 3/4 = (2 − 1) + (5/4 − 3/4). Practise 3-4 borrowing pairs side by side. The improper-fraction method is also a clean fallback.',
  conceptual_gap:
    'Step back from procedure and address "why a common denominator?" using models. Show that 1/2 + 1/3 (or 1/2 − 1/3) is combining unequal pieces — a common denominator makes them comparable.',
  arithmetic_slip:
    'Not a fraction-specific issue. Encourage rechecking arithmetic. Monitor for repeated pattern across items.',
  form_error:
    'Reinforce the convention: answers should be in simplest form (or as a mixed number, as specified). Practise HCF-based simplification on a few sums and improper-fraction-to-mixed-number conversion.',
  visual_misread:
    'Use side-by-side bar/area models with explicit row counts. Have the student recount the shaded vs. total cells aloud before writing the fraction. Check that they recognise pictorial equivalence (e.g., 2/4 of a bar shaded ≡ 1/2).',
  none: '',
};

// ---------------------------------------------------------------------------
// Visual support
// ---------------------------------------------------------------------------
// Two simple visual primitives that the UI can render as inline SVG:
//   - 'bars': one or more horizontal bars; each bar has a denominator (cells)
//     and a numerator (number of cells shaded), plus a label (e.g., "1/3").
//   - 'grid': one or more square grids divided rows x cols, with a count of
//     shaded cells, plus a label.
// Both intentionally limited so they're trivially correct to render and
// trivially correct to author.

export type FractionBar = {
  numerator: number;
  denominator: number;
  label: string;
};

export type AreaGrid = {
  rows: number;
  cols: number;
  shaded: number;
  label: string;
};

export type VisualSpec =
  | { kind: 'bars'; bars: FractionBar[] }
  | { kind: 'grid'; grids: AreaGrid[] };

// ---------------------------------------------------------------------------
// Item types
// ---------------------------------------------------------------------------
type BaseItem = {
  id: string;
  skillId: 'FR.06' | 'FR.07';
  skillName: string;
  difficulty: number; // 1-10 seed difficulty
  band: 'foundational' | 'core' | 'advanced';
  cognitiveType:
    | 'Procedural fluency'
    | 'Conceptual understanding'
    | 'Application / word problem'
    | 'Visual representation';
  stem: string;
  solution: string;
  estimatedTimeSec: number;
  visual?: VisualSpec;
};

export type MCQItem = BaseItem & {
  kind: 'mcq';
  options: Array<{ text: string; misconception: MisconceptionCode }>;
  correctIndex: 0 | 1 | 2 | 3;
};

export type NumericItem = BaseItem & {
  kind: 'numeric';
  // Canonical accepted forms after normalisation. We accept any string the
  // student types if it normalises into one of these.
  acceptedAnswers: string[];
  // Patterns of common wrong answers and which misconception they map to.
  // First match wins; an unmatched wrong answer is tagged 'arithmetic_slip'.
  errorPatterns: Array<{
    answers: string[];
    misconception: MisconceptionCode;
  }>;
  // Short hint about the expected form (shown next to the input box).
  inputHint: string;
};

export type Item = MCQItem | NumericItem;

// ---------------------------------------------------------------------------
// Numeric-entry helpers
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Numeric-entry parsing
// ---------------------------------------------------------------------------
// We treat the student's typed answer as a *rational number* and compare by
// mathematical equivalence, not string identity. This lets us:
//
//   - accept "5/6", "5 / 6", " 5/6 ", "5 over 6 typed by hand"
//   - accept the same value in proper, improper, or mixed-number form
//     ("19/12", "1 7/12", "1 and 7/12", "1+7/12")
//   - distinguish "value-correct but not in simplest form" (a real cognitive
//     error worth tagging as `form_error`) from "value-wrong"
//
// We deliberately do NOT accept decimal answers. The skill being tested is
// fraction arithmetic; a "0.5" response is treated as a parse miss so the
// teacher can see that the student computed in decimals rather than in
// fractions.

export type Rational = {
  // Always non-negative; sign is carried separately.
  num: number;
  // Always positive.
  den: number;
  sign: 1 | -1;
};

export function parseFraction(input: string): Rational | null {
  if (!input) return null;
  // Lowercase + collapse whitespace; replace 'and'/'+' between whole and
  // fraction with a single space.
  let s = input.trim().toLowerCase();
  if (!s) return null;
  s = s.replace(/\s+and\s+/g, ' ');
  s = s.replace(/(\d)\s*\+\s*(\d)/g, '$1 $2');
  s = s.replace(/\s+/g, ' ').trim();

  // Mixed number: "1 7/12", "-1 7/12", with any whitespace around the slash.
  const mixedMatch = s.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixedMatch) {
    const w = parseInt(mixedMatch[1], 10);
    const n = parseInt(mixedMatch[2], 10);
    const d = parseInt(mixedMatch[3], 10);
    if (d === 0) return null;
    const sign: 1 | -1 = w < 0 ? -1 : 1;
    return { num: Math.abs(w) * d + n, den: d, sign };
  }

  // Simple fraction: "5/6", "-5/6".
  const fracMatch = s.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (fracMatch) {
    const n = parseInt(fracMatch[1], 10);
    const d = parseInt(fracMatch[2], 10);
    if (d === 0) return null;
    return { num: Math.abs(n), den: d, sign: n < 0 ? -1 : 1 };
  }

  // Whole number: "3", "-3".
  const wholeMatch = s.match(/^(-?\d+)$/);
  if (wholeMatch) {
    const n = parseInt(wholeMatch[1], 10);
    return { num: Math.abs(n), den: 1, sign: n < 0 ? -1 : 1 };
  }

  return null;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

export function rationalsEqual(a: Rational, b: Rational): boolean {
  // 0 has no sign for equivalence purposes.
  const aIsZero = a.num === 0;
  const bIsZero = b.num === 0;
  if (aIsZero && bIsZero) return true;
  if (a.sign !== b.sign) return false;
  return a.num * b.den === b.num * a.den;
}

// Returns true iff the user's typed answer is in canonical "simplest" form:
//   - integer (e.g., "3")
//   - simplified proper or improper fraction with gcd(num, den) = 1
//     (both "3/4" and "19/12" qualify)
//   - simplified mixed number with proper, simplified fractional part
//     (e.g., "1 7/12") — but NOT "1 19/12" (improper part) or "1 14/24"
//     (un-reduced part).
export function isSimplifiedFractionForm(input: string): boolean {
  const parsed = parseFraction(input);
  if (!parsed) return false;

  let s = input.trim().toLowerCase();
  s = s.replace(/\s+and\s+/g, ' ');
  s = s.replace(/(\d)\s*\+\s*(\d)/g, '$1 $2');
  s = s.replace(/\s+/g, ' ').trim();

  const mixed = s.match(/^-?\d+\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const n = parseInt(mixed[1], 10);
    const d = parseInt(mixed[2], 10);
    if (d === 0) return false;
    return n < d && gcd(n, d) === 1;
  }

  const frac = s.match(/^-?(\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const n = parseInt(frac[1], 10);
    const d = parseInt(frac[2], 10);
    if (d === 0) return false;
    return gcd(n, d) === 1;
  }

  return /^-?\d+$/.test(s);
}

// ---------------------------------------------------------------------------
// Pre-pilot item bank.
//   - FR.06 (Add unlike denominators): 24 items (12 original v0.1 + 12 new
//     in v0.3). Bands: 5 foundational, 11 core, 8 advanced.
//   - FR.07 (Subtract unlike denominators): 20 items, all new in v0.4.
//     Bands: 4 foundational, 12 core, 4 advanced.
// Total bank: 44 items across 2 skills.
// ---------------------------------------------------------------------------
export const ITEMS: Item[] = [
  // ----- Original 12 (v0.1) -----
  {
    id: 'FR.06-01',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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
    kind: 'mcq',
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

  // ===== v0.3 additions =====

  // ----- Foundational (2) -----
  {
    id: 'FR.06-13',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'bars',
      bars: [
        { numerator: 1, denominator: 4, label: '1/4' },
        { numerator: 1, denominator: 8, label: '1/8' },
      ],
    },
    stem:
      'The two bars below show 1/4 and 1/8 of the same whole. What is 1/4 + 1/8?',
    options: [
      { text: '2/12', misconception: 'add_across' },
      { text: '2/8', misconception: 'incomplete_conversion' },
      { text: '3/8', misconception: 'none' },
      { text: '1/32', misconception: 'operation_confusion' },
    ],
    correctIndex: 2,
    solution:
      'LCM(4, 8) = 8. The first bar shows 1/4 = 2/8 (look: 1 of 4 cells = 2 of 8 cells of the same whole). Then 2/8 + 1/8 = 3/8.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.06-14',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Add: 1/2 + 1/3.',
    inputHint: 'Enter as a fraction, e.g., 5/6',
    acceptedAnswers: ['5/6'],
    errorPatterns: [
      { answers: ['2/5', '2/6'], misconception: 'add_across' },
      { answers: ['1/6', '1/5'], misconception: 'operation_confusion' },
      { answers: ['3/6', '2/3', '1/2'], misconception: 'incomplete_conversion' },
    ],
    solution:
      'LCM(2, 3) = 6. Convert: 1/2 = 3/6 and 1/3 = 2/6. Then 3/6 + 2/6 = 5/6.',
    estimatedTimeSec: 60,
  },

  // ----- Core (6) -----
  {
    id: 'FR.06-15',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'bars',
      bars: [
        { numerator: 1, denominator: 4, label: '1/4' },
        { numerator: 5, denominator: 12, label: '5/12' },
      ],
    },
    stem:
      'The two bars below show 1/4 and 5/12 shaded. What is the total shaded amount, in simplest form?',
    options: [
      { text: '6/16', misconception: 'add_across' },
      { text: '2/3', misconception: 'none' },
      { text: '8/24', misconception: 'product_not_lcm' },
      { text: '1/3', misconception: 'visual_misread' },
    ],
    correctIndex: 1,
    solution:
      'LCM(4, 12) = 12. Convert: 1/4 = 3/12. Then 3/12 + 5/12 = 8/12 = 2/3 in simplest form.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.06-16',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 1/6 + 1/9.',
    options: [
      { text: '2/15', misconception: 'add_across' },
      { text: '5/18', misconception: 'none' },
      { text: '15/54', misconception: 'product_not_lcm' },
      { text: '5/54', misconception: 'incomplete_conversion' },
    ],
    correctIndex: 1,
    solution:
      'LCM(6, 9) = 18. Convert: 1/6 = 3/18 and 1/9 = 2/18. Then 3/18 + 2/18 = 5/18.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.06-17',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the value of 5/6 + 3/4.',
    inputHint: 'Enter as a fraction or mixed number, e.g., 19/12 or 1 7/12',
    acceptedAnswers: ['19/12', '1 7/12'],
    errorPatterns: [
      { answers: ['8/10', '4/5'], misconception: 'add_across' },
      { answers: ['8/12', '2/3'], misconception: 'incomplete_conversion' },
      { answers: ['15/24', '15/12'], misconception: 'arithmetic_slip' },
      { answers: ['15/96', '5/32'], misconception: 'operation_confusion' },
    ],
    solution:
      'LCM(6, 4) = 12. Convert: 5/6 = 10/12 and 3/4 = 9/12. Then 10/12 + 9/12 = 19/12 = 1 7/12.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.06-18',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'grid',
      grids: [
        { rows: 1, cols: 3, shaded: 2, label: '2/3 of square A' },
        { rows: 3, cols: 4, shaded: 5, label: '5/12 of square B' },
      ],
    },
    stem:
      'Two equal-sized squares are divided into smaller pieces, as shown. The first has 2 of its 3 columns shaded; the second has 5 of its 12 small squares shaded. What is the total shaded amount, expressed as a fraction of one square?',
    options: [
      { text: '7/15', misconception: 'add_across' },
      { text: '1 1/12', misconception: 'none' },
      { text: '7/12', misconception: 'incomplete_conversion' },
      { text: '10/36', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      '2/3 = 8/12. So total = 8/12 + 5/12 = 13/12 = 1 1/12 of one square.',
    estimatedTimeSec: 100,
  },
  {
    id: 'FR.06-19',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Aanya cycled 7/10 km from home to the park, then 1/4 km from the park to the library. What total distance did she cycle?',
    options: [
      { text: '8/14 km', misconception: 'add_across' },
      { text: '19/20 km', misconception: 'none' },
      { text: '5/20 km', misconception: 'operation_confusion' },
      { text: '7/40 km', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'Total = 7/10 + 1/4. LCM(10, 4) = 20. Convert: 7/10 = 14/20 and 1/4 = 5/20. Sum = 19/20 km.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.06-20',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Add the mixed numbers: 1 3/4 + 2 1/6.',
    options: [
      { text: '3 4/10', misconception: 'add_across' },
      { text: '3 11/12', misconception: 'none' },
      { text: '2 11/12', misconception: 'mixed_number_error' },
      { text: '3 1/12', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      'Whole parts: 1 + 2 = 3. Fractional parts: 3/4 + 1/6. LCM(4, 6) = 12, so 3/4 = 9/12 and 1/6 = 2/12. 9/12 + 2/12 = 11/12. Total = 3 11/12.',
    estimatedTimeSec: 90,
  },

  // ----- Advanced (4) -----
  {
    id: 'FR.06-21',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 7,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Asha walked 1 1/4 km to her friend\'s house and then 5/8 km to the playground. What total distance did she walk?',
    options: [
      { text: '1 6/12 km', misconception: 'add_across' },
      { text: '1 7/8 km', misconception: 'none' },
      { text: '7/8 km', misconception: 'mixed_number_error' },
      { text: '1 5/12 km', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      'Whole part = 1. Fractional parts: 1/4 + 5/8. LCM(4, 8) = 8, so 1/4 = 2/8. Then 2/8 + 5/8 = 7/8. Total = 1 7/8 km.',
    estimatedTimeSec: 100,
  },
  {
    id: 'FR.06-22',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'bars',
      bars: [
        { numerator: 1, denominator: 2, label: 'Bottle A: 1/2 full' },
        { numerator: 1, denominator: 3, label: 'Bottle B: 1/3 full' },
        { numerator: 1, denominator: 6, label: 'Bottle C: 1/6 full' },
      ],
    },
    stem:
      'Three identical bottles are filled to different levels, as shown. Together, how full are they (expressed as a fraction of one bottle)?',
    options: [
      { text: '3/11', misconception: 'add_across' },
      { text: '1', misconception: 'none' },
      { text: '5/6', misconception: 'arithmetic_slip' },
      { text: '1/3', misconception: 'visual_misread' },
    ],
    correctIndex: 1,
    solution:
      'Total = 1/2 + 1/3 + 1/6. LCM(2, 3, 6) = 6. Convert: 1/2 = 3/6, 1/3 = 2/6, 1/6 = 1/6. Sum = 6/6 = 1 (one full bottle).',
    estimatedTimeSec: 120,
  },
  {
    id: 'FR.06-23',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A tailor uses 2 1/3 metres of red ribbon and 3/4 metre of blue ribbon for a single project. What is the total length of ribbon used, as a mixed number in simplest form?',
    options: [
      { text: '2 4/7 m', misconception: 'add_across' },
      { text: '3 1/12 m', misconception: 'none' },
      { text: '2 13/12 m', misconception: 'form_error' },
      { text: '2 1/12 m', misconception: 'mixed_number_error' },
    ],
    correctIndex: 1,
    solution:
      'Whole part = 2 (the blue ribbon contributes only a fractional part). Fractional parts: 1/3 + 3/4. LCM(3, 4) = 12, so 1/3 = 4/12 and 3/4 = 9/12. Sum = 13/12 = 1 1/12. Carry the 1: total = 2 + 1 + 1/12 = 3 1/12 m.',
    estimatedTimeSec: 130,
  },
  {
    id: 'FR.06-24',
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    difficulty: 9,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem:
      'Vikram studies for 1/2 hour of Maths, 3/4 hour of Science, and 1/3 hour of English. How much time does he study altogether? Enter your answer as an improper fraction or as a mixed number in simplest form.',
    inputHint: 'Enter as a fraction or mixed number, e.g., 19/12 or 1 7/12',
    acceptedAnswers: ['19/12', '1 7/12'],
    errorPatterns: [
      { answers: ['5/9', '6/9', '5/12'], misconception: 'add_across' },
      { answers: ['9/12', '3/4', '6/12', '1/2'], misconception: 'incomplete_conversion' },
      { answers: ['13/12', '1 1/12', '7/12'], misconception: 'arithmetic_slip' },
      { answers: ['1/8', '3/24'], misconception: 'operation_confusion' },
    ],
    solution:
      'LCM(2, 4, 3) = 12. Convert: 1/2 = 6/12, 3/4 = 9/12, 1/3 = 4/12. Sum = 19/12 = 1 7/12 hours.',
    estimatedTimeSec: 150,
  },

  // ===== v0.4 additions: FR.07 (Subtract fractions with unlike denominators) =====
  // 20 items spanning foundational, core, and advanced bands.
  // Distribution: 4 foundational, 12 core, 4 advanced.
  // Diversity: 3 visuals (2 bars + 1 grid), 4 numeric-entry, 5 word
  // problems, 4 mixed-number subtractions (3 require borrowing).

  // ----- Foundational (4) -----
  {
    id: 'FR.07-01',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Subtract: 3/4 − 1/2.',
    options: [
      { text: '2/2', misconception: 'subtract_across' },
      { text: '1/2', misconception: 'incomplete_conversion' },
      { text: '1/4', misconception: 'none' },
      { text: '1 1/4', misconception: 'operation_confusion' },
    ],
    correctIndex: 2,
    solution:
      'LCM(4, 2) = 4. Convert 1/2 to 2/4. Then 3/4 − 2/4 = 1/4.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.07-02',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'bars',
      bars: [
        { numerator: 1, denominator: 2, label: '1/2' },
        { numerator: 1, denominator: 4, label: '1/4' },
      ],
    },
    stem:
      'The two bars below show 1/2 and 1/4 of the same whole. What is 1/2 − 1/4?',
    options: [
      { text: '0/2', misconception: 'subtract_across' },
      { text: '1/4', misconception: 'none' },
      { text: '1/2', misconception: 'incomplete_conversion' },
      { text: '3/4', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'LCM(2, 4) = 4. The first bar shows 1/2 = 2/4 (1 of 2 cells = 2 of 4 cells of the same whole). Then 2/4 − 1/4 = 1/4.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.07-03',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the value of 2/3 − 1/2.',
    inputHint: 'Enter as a fraction, e.g., 1/6',
    acceptedAnswers: ['1/6'],
    errorPatterns: [
      { answers: ['1/1', '1'], misconception: 'subtract_across' },
      { answers: ['1/3', '1/2'], misconception: 'incomplete_conversion' },
      { answers: ['7/6', '1 1/6'], misconception: 'operation_confusion' },
    ],
    solution:
      'LCM(3, 2) = 6. Convert: 2/3 = 4/6 and 1/2 = 3/6. Then 4/6 − 3/6 = 1/6.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.07-04',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem:
      'Aarav wants to compute 5/6 − 1/3. What should he do FIRST?',
    options: [
      {
        text: 'Subtract the denominators to get 5/3.',
        misconception: 'conceptual_gap',
      },
      {
        text: 'Rewrite both fractions with a common denominator.',
        misconception: 'none',
      },
      {
        text: 'Multiply the two fractions first.',
        misconception: 'operation_confusion',
      },
      {
        text: 'Subtract 1 from 5 and 3 from 6 to get 4/3.',
        misconception: 'subtract_across',
      },
    ],
    correctIndex: 1,
    solution:
      'Fractions can be subtracted only when they have the same denominator. LCM(6, 3) = 6, so 1/3 = 2/6 and 5/6 − 2/6 = 3/6 = 1/2.',
    estimatedTimeSec: 60,
  },

  // ----- Core (12) -----
  {
    id: 'FR.07-05',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 5/6 − 1/3.',
    options: [
      { text: '4/3', misconception: 'subtract_across' },
      { text: '4/6', misconception: 'incomplete_conversion' },
      { text: '1/2', misconception: 'none' },
      { text: '7/6', misconception: 'operation_confusion' },
    ],
    correctIndex: 2,
    solution:
      'LCM(6, 3) = 6. Convert: 1/3 = 2/6. Then 5/6 − 2/6 = 3/6 = 1/2.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.07-06',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find: 7/8 − 1/2.',
    options: [
      { text: '6/6', misconception: 'subtract_across' },
      { text: '3/8', misconception: 'none' },
      { text: '6/8', misconception: 'incomplete_conversion' },
      { text: '11/8', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'LCM(8, 2) = 8. Convert: 1/2 = 4/8. Then 7/8 − 4/8 = 3/8.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.07-07',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the value of 5/6 − 3/4.',
    inputHint: 'Enter as a fraction, e.g., 1/12',
    acceptedAnswers: ['1/12'],
    errorPatterns: [
      { answers: ['2/2', '1'], misconception: 'subtract_across' },
      { answers: ['2/12', '1/6'], misconception: 'incomplete_conversion' },
      { answers: ['19/12', '1 7/12'], misconception: 'operation_confusion' },
      { answers: ['1/24', '2/24'], misconception: 'product_not_lcm' },
    ],
    solution:
      'LCM(6, 4) = 12. Convert: 5/6 = 10/12 and 3/4 = 9/12. Then 10/12 − 9/12 = 1/12.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.07-08',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'bars',
      bars: [
        { numerator: 4, denominator: 5, label: '4/5' },
        { numerator: 2, denominator: 3, label: '2/3' },
      ],
    },
    stem:
      'The two bars below show 4/5 and 2/3 of the same whole. By how much does 4/5 exceed 2/3?',
    options: [
      { text: '2/2', misconception: 'subtract_across' },
      { text: '2/15', misconception: 'none' },
      { text: '2/5', misconception: 'incomplete_conversion' },
      { text: '22/15', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'LCM(5, 3) = 15. Convert: 4/5 = 12/15 and 2/3 = 10/15. Then 12/15 − 10/15 = 2/15.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.07-09',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Simplify: 11/12 − 1/4. Express your answer in simplest form.',
    options: [
      { text: '10/8', misconception: 'subtract_across' },
      { text: '8/12', misconception: 'form_error' },
      { text: '2/3', misconception: 'none' },
      { text: '10/12', misconception: 'incomplete_conversion' },
    ],
    correctIndex: 2,
    solution:
      'LCM(12, 4) = 12. Convert: 1/4 = 3/12. Then 11/12 − 3/12 = 8/12 = 2/3 in simplest form.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.07-10',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'grid',
      grids: [
        { rows: 2, cols: 3, shaded: 5, label: '5/6 of square A' },
        { rows: 2, cols: 3, shaded: 3, label: '1/2 of square B (3 of 6 cells)' },
      ],
    },
    stem:
      'Two equal-sized squares are each divided into 6 equal cells. Square A has 5 of its 6 cells shaded; square B has 3 cells shaded (which equals 1/2 of the square). What is 5/6 − 1/2 in simplest form?',
    options: [
      { text: '4/4', misconception: 'subtract_across' },
      { text: '1/3', misconception: 'none' },
      { text: '2/3', misconception: 'incomplete_conversion' },
      { text: '4/3', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'LCM(6, 2) = 6, so 1/2 = 3/6. Then 5/6 − 3/6 = 2/6 = 1/3 in simplest form.',
    estimatedTimeSec: 100,
  },
  {
    id: 'FR.07-11',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Saanvi had 3/4 litre of juice. She drank 1/3 litre. How much juice is left?',
    options: [
      { text: '2/1 litre', misconception: 'subtract_across' },
      { text: '5/12 litre', misconception: 'none' },
      { text: '2/4 litre', misconception: 'incomplete_conversion' },
      { text: '1 1/12 litres', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'Juice left = 3/4 − 1/3. LCM(4, 3) = 12. Convert: 3/4 = 9/12 and 1/3 = 4/12. Then 9/12 − 4/12 = 5/12 litre.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.07-12',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 9/10 − 2/5.',
    options: [
      { text: '7/5', misconception: 'subtract_across' },
      { text: '7/10', misconception: 'incomplete_conversion' },
      { text: '1/2', misconception: 'none' },
      { text: '13/10', misconception: 'operation_confusion' },
    ],
    correctIndex: 2,
    solution:
      'LCM(10, 5) = 10. Convert: 2/5 = 4/10. Then 9/10 − 4/10 = 5/10 = 1/2.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.07-13',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find: 5/6 − 1/4.',
    options: [
      { text: '4/2', misconception: 'subtract_across' },
      { text: '7/12', misconception: 'none' },
      { text: '14/24', misconception: 'product_not_lcm' },
      { text: '13/12', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'LCM(6, 4) = 12. Convert: 5/6 = 10/12 and 1/4 = 3/12. Then 10/12 − 3/12 = 7/12.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.07-14',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 7/12 − 1/4. Express your answer in simplest form.',
    options: [
      { text: '6/8', misconception: 'subtract_across' },
      { text: '4/12', misconception: 'form_error' },
      { text: '1/3', misconception: 'none' },
      { text: '6/12', misconception: 'incomplete_conversion' },
    ],
    correctIndex: 2,
    solution:
      'LCM(12, 4) = 12. Convert: 1/4 = 3/12. Then 7/12 − 3/12 = 4/12 = 1/3 in simplest form.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.07-15',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A bottle holds 7/8 litre of water. After Vivaan drinks 1/3 litre, how much water is left in the bottle?',
    options: [
      { text: '6/5 litre', misconception: 'subtract_across' },
      { text: '13/24 litre', misconception: 'none' },
      { text: '6/8 litre', misconception: 'incomplete_conversion' },
      { text: '1 5/24 litres', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'Water left = 7/8 − 1/3. LCM(8, 3) = 24. Convert: 7/8 = 21/24 and 1/3 = 8/24. Then 21/24 − 8/24 = 13/24 litre.',
    estimatedTimeSec: 100,
  },
  {
    id: 'FR.07-16',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem:
      'Ishaan has 1 whole pizza. He eats 5/8 of it. How much pizza is left? Enter your answer as a fraction in simplest form.',
    inputHint: 'Enter as a fraction, e.g., 3/8',
    acceptedAnswers: ['3/8'],
    errorPatterns: [
      { answers: ['4/7'], misconception: 'subtract_across' },
      { answers: ['5/8', '1', '8/8'], misconception: 'conceptual_gap' },
      { answers: ['1 5/8', '13/8'], misconception: 'operation_confusion' },
    ],
    solution:
      'Rewrite 1 as 8/8. Then 8/8 − 5/8 = 3/8. So 3/8 of the pizza is left.',
    estimatedTimeSec: 100,
  },

  // ----- Advanced (4) -----
  {
    id: 'FR.07-17',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 7,
    band: 'advanced',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem:
      'Subtract the mixed numbers: 3 1/4 − 1 1/2.',
    options: [
      { text: '2 1/4', misconception: 'borrowing_error' },
      { text: '1 3/4', misconception: 'none' },
      { text: '4 3/4', misconception: 'operation_confusion' },
      { text: '2 1/2', misconception: 'mixed_number_error' },
    ],
    correctIndex: 1,
    solution:
      'LCM(4, 2) = 4, so 1/2 = 2/4. Now compare fractional parts: 1/4 < 2/4, so borrow 1 = 4/4 from the whole: 3 1/4 = 2 5/4. Then 2 5/4 − 1 2/4 = 1 3/4.',
    estimatedTimeSec: 120,
  },
  {
    id: 'FR.07-18',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem:
      'Subtract: 4 1/3 − 2 5/6. Give your answer as a mixed number in simplest form.',
    options: [
      { text: '2 1/2', misconception: 'borrowing_error' },
      { text: '1 1/2', misconception: 'none' },
      { text: '2 1/3', misconception: 'mixed_number_error' },
      { text: '7 1/6', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'LCM(3, 6) = 6, so 1/3 = 2/6. Now 4 1/3 = 4 2/6 and 2 5/6 stays as is. Since 2/6 < 5/6, borrow: 4 2/6 = 3 8/6. Then 3 8/6 − 2 5/6 = 1 3/6 = 1 1/2.',
    estimatedTimeSec: 150,
  },
  {
    id: 'FR.07-19',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A 5-metre roll of ribbon is used for a school decoration. After cutting off 2 3/8 metres, how much ribbon is left?',
    options: [
      { text: '3 3/8 m', misconception: 'borrowing_error' },
      { text: '2 5/8 m', misconception: 'none' },
      { text: '2 3/8 m', misconception: 'mixed_number_error' },
      { text: '7 3/8 m', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      'Rewrite 5 as 4 + 8/8. Then 5 − 2 3/8 = 4 8/8 − 2 3/8 = 2 5/8 metres.',
    estimatedTimeSec: 150,
  },
  {
    id: 'FR.07-20',
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    difficulty: 9,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem:
      'A water tank holds 5 1/4 litres. After watering the plants, only 1 5/6 litres remain. How much water was used? Enter your answer as a mixed number in simplest form.',
    inputHint: 'Enter as a fraction or mixed number, e.g., 3 5/12',
    acceptedAnswers: ['3 5/12', '41/12'],
    errorPatterns: [
      { answers: ['4 7/12', '55/12'], misconception: 'borrowing_error' },
      { answers: ['4 1/4', '17/4'], misconception: 'mixed_number_error' },
      { answers: ['7 1/12', '85/12'], misconception: 'operation_confusion' },
      { answers: ['3 7/12', '43/12'], misconception: 'arithmetic_slip' },
    ],
    solution:
      'Used = 5 1/4 − 1 5/6. LCM(4, 6) = 12, so 1/4 = 3/12 and 5/6 = 10/12. Now 5 3/12 − 1 10/12. Since 3/12 < 10/12, borrow: 5 3/12 = 4 15/12. Then 4 15/12 − 1 10/12 = 3 5/12 litres.',
    estimatedTimeSec: 200,
  },
];

// ---------------------------------------------------------------------------
// Validation helpers (used by the UI)
// ---------------------------------------------------------------------------

// Evaluate a numeric-entry response. Returns whether the answer is correct
// and the misconception code to record.
//
// Logic:
//   1. Parse the user's input as a rational. If parsing fails, the answer
//      is wrong and tagged 'arithmetic_slip' (covers blanks, decimals,
//      garbage text, malformed fractions).
//   2. Parse the item's first acceptedAnswer as the canonical value. All
//      acceptedAnswer entries are expected to be mathematically equivalent.
//   3. If the user's value equals the canonical value:
//        a. If the typed form is in simplest form, mark correct.
//        b. Otherwise (e.g., "10/12" instead of "5/6", or "1 14/24" instead
//           of "1 7/12"), mark incorrect with misconception 'form_error'.
//   4. If the user's value does NOT equal the canonical value, walk the
//      item's errorPatterns by *value* (not string) and return the matching
//      misconception. Fallback: 'arithmetic_slip'.
export function evaluateNumericAnswer(
  item: NumericItem,
  input: string
): { correct: boolean; misconception: MisconceptionCode } {
  const userValue = parseFraction(input);
  if (!userValue) {
    return { correct: false, misconception: 'arithmetic_slip' };
  }

  const canonical = parseFraction(item.acceptedAnswers[0]);
  if (!canonical) {
    // Bank misconfiguration: the canonical answer didn't parse. Treat as
    // a slip rather than crashing.
    return { correct: false, misconception: 'arithmetic_slip' };
  }

  if (rationalsEqual(userValue, canonical)) {
    if (isSimplifiedFractionForm(input)) {
      return { correct: true, misconception: 'none' };
    }
    return { correct: false, misconception: 'form_error' };
  }

  for (const pattern of item.errorPatterns) {
    for (const ans of pattern.answers) {
      const patternValue = parseFraction(ans);
      if (patternValue && rationalsEqual(userValue, patternValue)) {
        return { correct: false, misconception: pattern.misconception };
      }
    }
  }

  return { correct: false, misconception: 'arithmetic_slip' };
}

// Backwards-compat wrappers so any caller still on the old API keeps
// working. Prefer `evaluateNumericAnswer` for new code — it returns the
// misconception code in the same pass and handles form_error properly.
export function checkNumericAnswer(item: NumericItem, input: string): boolean {
  return evaluateNumericAnswer(item, input).correct;
}

export function tagNumericError(
  item: NumericItem,
  input: string
): MisconceptionCode {
  const result = evaluateNumericAnswer(item, input);
  return result.correct ? 'none' : result.misconception;
}
