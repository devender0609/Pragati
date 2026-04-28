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
//
// v0.5 additions (full Class 6 Fractions Module):
//   - Five more skill banks:
//       FR.02 (Represent fractions visually)         — 12 items
//       FR.03 (Equivalent fractions)                 — 12 items
//       FR.04 (Mixed numbers and improper fractions) — 12 items
//       FR.05 (Add/subtract with like denominators)  — 12 items
//       FR.08 (Fraction word problems)               — 12 items
//   - BaseItem.skillId widened to all 7 fraction skills.
//   - All existing misconception codes are reused; no new codes needed
//     because the FR.02–FR.05/FR.08 errors are well-described by the
//     existing taxonomy (visual_misread, incomplete_conversion,
//     mixed_number_error, add_across, operation_confusion, etc.).

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
  skillId:
    | 'FR.02'
    | 'FR.03'
    | 'FR.04'
    | 'FR.05'
    | 'FR.06'
    | 'FR.07'
    | 'FR.08';
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
//   - FR.02 (Visualise):                  12 items, all new in v0.5.
//   - FR.03 (Equivalent fractions):       12 items, all new in v0.5.
//   - FR.04 (Mixed/improper):             12 items, all new in v0.5.
//   - FR.05 (Like denominators):          12 items, all new in v0.5.
//   - FR.06 (Add unlike denominators):    24 items (v0.1 + v0.3).
//   - FR.07 (Subtract unlike denominators):20 items (v0.4).
//   - FR.08 (Word problems):              12 items, all new in v0.5.
// Total bank: 104 items across 7 skills (Class 6 Fractions Module).
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

  // ===== v0.5 additions: FR.02 (Represent fractions visually) =====
  // 12 items: 4 foundational, 5 core, 3 advanced. Includes 6 visual items.
  {
    id: 'FR.02-01',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 1,
    band: 'foundational',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 4, label: 'Bar A' }] },
    stem: 'What fraction of the bar is shaded?',
    options: [
      { text: '1/4', misconception: 'none' },
      { text: '1/3', misconception: 'visual_misread' },
      { text: '4/1', misconception: 'visual_misread' },
      { text: '3/4', misconception: 'visual_misread' },
    ],
    correctIndex: 0,
    solution:
      'The bar is split into 4 equal cells (denominator = 4) and 1 cell is shaded (numerator = 1). The fraction shaded is 1/4.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FR.02-02',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: { kind: 'grid', grids: [{ rows: 1, cols: 3, shaded: 2, label: 'Square A' }] },
    stem: 'A square is divided into 3 equal columns. 2 of them are shaded. Which fraction does this show?',
    options: [
      { text: '2/3', misconception: 'none' },
      { text: '3/2', misconception: 'visual_misread' },
      { text: '1/3', misconception: 'visual_misread' },
      { text: '2/5', misconception: 'add_across' },
    ],
    correctIndex: 0,
    solution:
      'Total equal pieces = 3 (denominator). Shaded pieces = 2 (numerator). Fraction = 2/3.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FR.02-03',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem:
      'In the fraction 3/8, what does the denominator (8) tell you?',
    options: [
      { text: 'How many equal parts the whole is divided into.', misconception: 'none' },
      { text: 'How many parts are shaded.', misconception: 'conceptual_gap' },
      { text: 'How many wholes there are.', misconception: 'conceptual_gap' },
      { text: 'How many parts are unshaded.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution:
      'In any fraction a/b, the denominator b is the total number of equal parts the whole has been split into. The numerator a is how many of those parts the fraction picks out.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.02-04',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: { kind: 'bars', bars: [{ numerator: 3, denominator: 5, label: 'Bar B' }] },
    stem: 'What fraction of the bar is shaded?',
    options: [
      { text: '5/3', misconception: 'visual_misread' },
      { text: '3/5', misconception: 'none' },
      { text: '3/8', misconception: 'add_across' },
      { text: '2/5', misconception: 'visual_misread' },
    ],
    correctIndex: 1,
    solution:
      '5 equal cells in the bar (denominator). 3 are shaded (numerator). Fraction shaded = 3/5.',
    estimatedTimeSec: 40,
  },
  {
    id: 'FR.02-05',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Visual representation',
    kind: 'numeric',
    visual: { kind: 'grid', grids: [{ rows: 2, cols: 4, shaded: 5, label: 'Square C' }] },
    stem:
      'A square is divided into 8 equal cells. 5 cells are shaded. Write the fraction shaded (in any form).',
    inputHint: 'Enter as a fraction, e.g., 5/8',
    acceptedAnswers: ['5/8'],
    errorPatterns: [
      { answers: ['8/5'], misconception: 'visual_misread' },
      { answers: ['5/3', '3/5'], misconception: 'visual_misread' },
      { answers: ['5/13', '5/16'], misconception: 'add_across' },
    ],
    solution:
      'Denominator = total equal cells = 8. Numerator = shaded cells = 5. Fraction shaded = 5/8.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.02-06',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem:
      'A circle is split into 4 unequal slices. 1 slice is shaded. Which fraction CORRECTLY describes the shaded part?',
    options: [
      { text: '1/4 of the circle.', misconception: 'conceptual_gap' },
      {
        text: 'You cannot use a single fraction here, because the slices are not equal.',
        misconception: 'none',
      },
      { text: '1/3, since one out of the other three is shaded.', misconception: 'visual_misread' },
      { text: 'The shaded slice is always 1/2.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution:
      'A fraction a/b assumes the whole is split into b EQUAL parts. If the slices are not equal, "1/4" is meaningless — you would need to measure the actual area first.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.02-07',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'bars',
      bars: [
        { numerator: 2, denominator: 4, label: 'Bar X' },
        { numerator: 1, denominator: 2, label: 'Bar Y' },
      ],
    },
    stem: 'Two equal bars are shown, both with the same length. Bar X shows 2/4 shaded; Bar Y shows 1/2 shaded. Which statement is true?',
    options: [
      { text: 'Bar X has more shaded than Bar Y.', misconception: 'visual_misread' },
      { text: 'Bar Y has more shaded than Bar X.', misconception: 'visual_misread' },
      { text: 'They show the same amount because 2/4 = 1/2.', misconception: 'none' },
      { text: 'The fractions cannot be compared.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution:
      '2 of 4 equal cells is the same area as 1 of 2 equal cells of the same whole. So 2/4 and 1/2 represent the same amount — they are equivalent fractions.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.02-08',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: { kind: 'grid', grids: [{ rows: 3, cols: 4, shaded: 7, label: 'Big square' }] },
    stem: 'A big square is split into a 3×4 grid of 12 equal cells. 7 are shaded. What fraction is shaded?',
    options: [
      { text: '7/12', misconception: 'none' },
      { text: '12/7', misconception: 'visual_misread' },
      { text: '5/12', misconception: 'visual_misread' },
      { text: '7/19', misconception: 'add_across' },
    ],
    correctIndex: 0,
    solution:
      'Total cells = 3 × 4 = 12. Shaded = 7. Fraction = 7/12.',
    estimatedTimeSec: 50,
  },
  {
    id: 'FR.02-09',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem:
      'Riya says "1/3 is bigger than 1/4 because 4 is bigger than 3." Is she right?',
    options: [
      { text: 'Yes, the bigger denominator means a bigger fraction.', misconception: 'conceptual_gap' },
      { text: 'No. 1/3 IS bigger than 1/4, but the reason is that the whole is split into FEWER pieces, so each piece is bigger.', misconception: 'none' },
      { text: 'No. 1/4 is bigger than 1/3 because 4 > 3.', misconception: 'conceptual_gap' },
      { text: 'You cannot compare them without a calculator.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution:
      'Both fractions take 1 part. 1/3 splits the whole into 3 equal parts (each 1/3 of the whole). 1/4 splits it into 4 equal parts (each smaller). So 1/3 > 1/4.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.02-10',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A pizza is cut into 8 equal slices. Aarav eats 3 slices and Bhavna eats 2 slices. What fraction of the pizza was eaten in all?',
    options: [
      { text: '5/8', misconception: 'none' },
      { text: '5/16', misconception: 'add_across' },
      { text: '3/8', misconception: 'visual_misread' },
      { text: '8/5', misconception: 'visual_misread' },
    ],
    correctIndex: 0,
    solution:
      'Slices eaten = 3 + 2 = 5 out of 8 equal slices. Fraction eaten = 5/8.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.02-11',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 7,
    band: 'advanced',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    stem:
      'On a number line from 0 to 1 split into 5 equal parts, where does 3/5 sit?',
    options: [
      { text: 'At the third tick after 0 (3 of 5 parts of the way to 1).', misconception: 'none' },
      { text: 'At the second tick after 0.', misconception: 'visual_misread' },
      { text: 'Past 1, because 3 is more than 1.', misconception: 'conceptual_gap' },
      { text: 'At the very first tick after 0.', misconception: 'visual_misread' },
    ],
    correctIndex: 0,
    solution:
      'The line from 0 to 1 has 5 equal parts. 3/5 means 3 of those 5 parts, so the third tick after 0.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.02-12',
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A rectangular field is divided into 10 equal plots. 4 plots are used for tomatoes and 3 for chillies. What fraction of the field is NOT yet used?',
    options: [
      { text: '7/10', misconception: 'operation_confusion' },
      { text: '3/10', misconception: 'none' },
      { text: '1/10', misconception: 'arithmetic_slip' },
      { text: '4/10', misconception: 'visual_misread' },
    ],
    correctIndex: 1,
    solution:
      'Used = 4 + 3 = 7 plots out of 10. Not used = 10 − 7 = 3. Fraction = 3/10.',
    estimatedTimeSec: 90,
  },

  // ===== v0.5 additions: FR.03 (Equivalent fractions) =====
  // 12 items: 4 foundational, 5 core, 3 advanced. Includes 1 visual item.
  {
    id: 'FR.03-01',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Fill in the blank: 1/2 = ?/4',
    options: [
      { text: '1', misconception: 'incomplete_conversion' },
      { text: '2', misconception: 'none' },
      { text: '4', misconception: 'arithmetic_slip' },
      { text: '8', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      'Multiply both top and bottom of 1/2 by 2: (1×2)/(2×2) = 2/4. So the missing numerator is 2.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FR.03-02',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'bars',
      bars: [
        { numerator: 1, denominator: 2, label: 'Bar A: 1/2' },
        { numerator: 2, denominator: 4, label: 'Bar B: 2/4' },
      ],
    },
    stem: 'The two equal bars below are shaded as shown. What does this picture tell us about 1/2 and 2/4?',
    options: [
      { text: '1/2 is bigger than 2/4.', misconception: 'visual_misread' },
      { text: '2/4 is bigger than 1/2.', misconception: 'visual_misread' },
      { text: '1/2 and 2/4 are equivalent — they shade the same amount.', misconception: 'none' },
      { text: 'They cannot be compared because the denominators differ.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution:
      'Both bars shade the same area of the same whole. So 1/2 = 2/4 — they are equivalent fractions.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.03-03',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Fill in the blank: 2/3 = ?/6',
    options: [
      { text: '2', misconception: 'incomplete_conversion' },
      { text: '3', misconception: 'arithmetic_slip' },
      { text: '4', misconception: 'none' },
      { text: '6', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 2,
    solution:
      'Denominator multiplied by 2 (3 → 6), so multiply numerator by the same: 2 × 2 = 4. Hence 2/3 = 4/6.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FR.03-04',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem:
      'Why is multiplying both the top and bottom of a fraction by the same non-zero number safe?',
    options: [
      { text: 'Because it changes both equally and so the value stays the same.', misconception: 'none' },
      { text: 'Because multiplying always makes the fraction bigger.', misconception: 'conceptual_gap' },
      { text: 'Because the denominator gets bigger and the value goes down.', misconception: 'conceptual_gap' },
      { text: 'It is not safe — it changes the fraction.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution:
      'Multiplying both numerator and denominator by the same k means we are multiplying the fraction by k/k = 1. Multiplying by 1 leaves the value unchanged.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.03-05',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Fill in the blank: 3/4 = ?/12',
    options: [
      { text: '3', misconception: 'incomplete_conversion' },
      { text: '6', misconception: 'arithmetic_slip' },
      { text: '9', misconception: 'none' },
      { text: '12', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 2,
    solution:
      '4 × 3 = 12, so multiply the numerator by 3: 3 × 3 = 9. Hence 3/4 = 9/12.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.03-06',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Simplify 4/6 to its simplest form.',
    inputHint: 'Enter as a fraction, e.g., 2/3',
    acceptedAnswers: ['2/3'],
    errorPatterns: [
      { answers: ['4/6'], misconception: 'form_error' },
      { answers: ['2/4', '1/3', '3/2'], misconception: 'incomplete_conversion' },
    ],
    solution:
      'HCF(4, 6) = 2. Divide both by 2: (4÷2)/(6÷2) = 2/3.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.03-07',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which fraction is equivalent to 5/10?',
    options: [
      { text: '1/2', misconception: 'none' },
      { text: '5/2', misconception: 'incomplete_conversion' },
      { text: '2/5', misconception: 'visual_misread' },
      { text: '10/5', misconception: 'visual_misread' },
    ],
    correctIndex: 0,
    solution:
      'Divide both by HCF(5, 10) = 5: 5/10 = (5÷5)/(10÷5) = 1/2.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.03-08',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Simplify 12/16 to its simplest form.',
    options: [
      { text: '6/8', misconception: 'form_error' },
      { text: '3/4', misconception: 'none' },
      { text: '4/3', misconception: 'visual_misread' },
      { text: '12/16', misconception: 'form_error' },
    ],
    correctIndex: 1,
    solution:
      'HCF(12, 16) = 4. Divide both by 4: 12/16 = 3/4.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.03-09',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of the following is NOT equivalent to 2/3?',
    options: [
      { text: '4/6', misconception: 'none' },
      { text: '6/9', misconception: 'none' },
      { text: '8/12', misconception: 'none' },
      { text: '3/4', misconception: 'incomplete_conversion' },
    ],
    correctIndex: 3,
    solution:
      '4/6, 6/9 and 8/12 all reduce to 2/3 by dividing top and bottom by 2, 3, and 4 respectively. 3/4 reduces to 3/4 — it is not equivalent to 2/3.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.03-10',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Out of 20 marbles, Lakshmi has 8 blue ones. What fraction is blue, in simplest form?',
    options: [
      { text: '8/20', misconception: 'form_error' },
      { text: '4/10', misconception: 'form_error' },
      { text: '2/5', misconception: 'none' },
      { text: '5/2', misconception: 'visual_misread' },
    ],
    correctIndex: 2,
    solution:
      '8/20 = (8÷4)/(20÷4) = 2/5. Simplest form is 2/5.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.03-11',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 7,
    band: 'advanced',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Simplify 18/24 to its simplest form.',
    inputHint: 'Enter as a fraction, e.g., 3/4',
    acceptedAnswers: ['3/4'],
    errorPatterns: [
      { answers: ['9/12', '6/8'], misconception: 'form_error' },
      { answers: ['18/24'], misconception: 'form_error' },
      { answers: ['4/3'], misconception: 'visual_misread' },
    ],
    solution:
      'HCF(18, 24) = 6. Divide both by 6: 18/24 = 3/4.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.03-12',
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the equivalent fraction of 5/6 with denominator 36.',
    options: [
      { text: '5/36', misconception: 'incomplete_conversion' },
      { text: '30/36', misconception: 'none' },
      { text: '36/30', misconception: 'visual_misread' },
      { text: '11/36', misconception: 'add_across' },
    ],
    correctIndex: 1,
    solution:
      '36 ÷ 6 = 6. Multiply numerator by 6: 5 × 6 = 30. So 5/6 = 30/36.',
    estimatedTimeSec: 90,
  },

  // ===== v0.5 additions: FR.04 (Mixed numbers and improper fractions) =====
  // 12 items: 4 foundational, 5 core, 3 advanced. Includes 1 visual item.
  {
    id: 'FR.04-01',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Convert the mixed number 1 1/2 to an improper fraction.',
    options: [
      { text: '1/2', misconception: 'mixed_number_error' },
      { text: '2/2', misconception: 'mixed_number_error' },
      { text: '3/2', misconception: 'none' },
      { text: '11/2', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution:
      '1 1/2 = (1 × 2 + 1)/2 = 3/2. (Multiply whole part by denominator, add numerator.)',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.04-02',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Convert the improper fraction 7/2 to a mixed number.',
    options: [
      { text: '3 1/2', misconception: 'none' },
      { text: '2 3/2', misconception: 'mixed_number_error' },
      { text: '1 7/2', misconception: 'conceptual_gap' },
      { text: '3 1/7', misconception: 'visual_misread' },
    ],
    correctIndex: 0,
    solution:
      '7 ÷ 2 = 3 remainder 1. So 7/2 = 3 1/2.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.04-03',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'bars',
      bars: [
        { numerator: 4, denominator: 4, label: 'Bar 1' },
        { numerator: 1, denominator: 4, label: 'Bar 2' },
      ],
    },
    stem:
      'The picture shows one fully shaded bar and a second bar of the same size with 1/4 shaded. As a mixed number, how much is shaded altogether?',
    options: [
      { text: '5/4', misconception: 'form_error' },
      { text: '1 1/4', misconception: 'none' },
      { text: '1 4/4', misconception: 'mixed_number_error' },
      { text: '4 1/4', misconception: 'mixed_number_error' },
    ],
    correctIndex: 1,
    solution:
      'One whole + 1/4 of another whole = 1 1/4. As an improper fraction this is 5/4.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.04-04',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem:
      'Which statement about an improper fraction (numerator ≥ denominator) is correct?',
    options: [
      { text: 'It is always less than 1.', misconception: 'conceptual_gap' },
      { text: 'It is at least 1.', misconception: 'none' },
      { text: 'It cannot be written as a mixed number.', misconception: 'conceptual_gap' },
      { text: 'It always equals exactly 1.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution:
      'An improper fraction has numerator ≥ denominator, so it represents one or more wholes — i.e., a value ≥ 1. It can always be rewritten as a whole number plus a proper fraction (a mixed number).',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.04-05',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Convert the mixed number 2 3/4 to an improper fraction.',
    options: [
      { text: '11/4', misconception: 'none' },
      { text: '5/4', misconception: 'mixed_number_error' },
      { text: '23/4', misconception: 'conceptual_gap' },
      { text: '8/4', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution:
      '2 3/4 = (2 × 4 + 3)/4 = (8 + 3)/4 = 11/4.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.04-06',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Convert the improper fraction 11/3 to a mixed number.',
    inputHint: 'Enter as a mixed number, e.g., 3 2/3',
    acceptedAnswers: ['3 2/3'],
    errorPatterns: [
      { answers: ['3 1/3'], misconception: 'arithmetic_slip' },
      { answers: ['2 3/3', '2 5/3'], misconception: 'mixed_number_error' },
      { answers: ['11/3'], misconception: 'form_error' },
    ],
    solution:
      '11 ÷ 3 = 3 remainder 2. So 11/3 = 3 2/3.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.04-07',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Convert 3 2/5 to an improper fraction.',
    options: [
      { text: '32/5', misconception: 'conceptual_gap' },
      { text: '17/5', misconception: 'none' },
      { text: '11/5', misconception: 'mixed_number_error' },
      { text: '5/17', misconception: 'visual_misread' },
    ],
    correctIndex: 1,
    solution:
      '3 2/5 = (3 × 5 + 2)/5 = (15 + 2)/5 = 17/5.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.04-08',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Convert 17/4 to a mixed number in simplest form.',
    inputHint: 'Enter as a mixed number, e.g., 4 1/4',
    acceptedAnswers: ['4 1/4'],
    errorPatterns: [
      { answers: ['3 5/4'], misconception: 'mixed_number_error' },
      { answers: ['4 4/1', '1 4/4'], misconception: 'mixed_number_error' },
      { answers: ['17/4'], misconception: 'form_error' },
    ],
    solution:
      '17 ÷ 4 = 4 remainder 1. So 17/4 = 4 1/4.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.04-09',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which of the following equals 5 1/2?',
    options: [
      { text: '11/2', misconception: 'none' },
      { text: '6/2', misconception: 'mixed_number_error' },
      { text: '5/2', misconception: 'conceptual_gap' },
      { text: '51/2', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution:
      '5 1/2 = (5 × 2 + 1)/2 = 11/2.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.04-10',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Sahil cuts each chapati into 4 equal pieces. He has 9 pieces. As a mixed number of full chapatis, how many does he have?',
    options: [
      { text: '2 1/4', misconception: 'none' },
      { text: '2 4/9', misconception: 'mixed_number_error' },
      { text: '9/4', misconception: 'form_error' },
      { text: '4 1/2', misconception: 'visual_misread' },
    ],
    correctIndex: 0,
    solution:
      '9 ÷ 4 = 2 remainder 1, so 9/4 = 2 1/4 chapatis.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.04-11',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 7,
    band: 'advanced',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Convert 4 5/6 to an improper fraction.',
    options: [
      { text: '29/6', misconception: 'none' },
      { text: '24/6', misconception: 'mixed_number_error' },
      { text: '9/6', misconception: 'mixed_number_error' },
      { text: '45/6', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution:
      '4 5/6 = (4 × 6 + 5)/6 = (24 + 5)/6 = 29/6.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.04-12',
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem:
      'Each glass holds 1/3 litre of milk. Asha has 2 1/3 litres of milk. How many full glasses can she fill, and how many additional thirds will be left over? (Enter the answer as a single improper fraction of glasses, e.g., 7/1, where the numerator is the number of one-third-glasses worth of milk.)',
    inputHint: 'Enter as a fraction, e.g., 7/1',
    acceptedAnswers: ['7/1', '7'],
    errorPatterns: [
      { answers: ['2 1/3'], misconception: 'conceptual_gap' },
      { answers: ['7/3'], misconception: 'mixed_number_error' },
      { answers: ['6/1', '6'], misconception: 'arithmetic_slip' },
    ],
    solution:
      '2 1/3 = 7/3 litres. Each glass is 1/3 litre, so the number of (1/3)-litre glasses she can fill is 7 (i.e., 7/1).',
    estimatedTimeSec: 120,
  },

  // ===== v0.5 additions: FR.05 (Add and subtract with like denominators) =====
  // 12 items: 4 foundational, 5 core, 3 advanced. Includes 1 visual item.
  {
    id: 'FR.05-01',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Add: 1/4 + 2/4',
    options: [
      { text: '3/8', misconception: 'add_across' },
      { text: '3/4', misconception: 'none' },
      { text: '2/4', misconception: 'arithmetic_slip' },
      { text: '1/2', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      'Denominators already match. Add the numerators only: 1 + 2 = 3. Keep the denominator: 3/4.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FR.05-02',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Subtract: 3/5 − 1/5',
    options: [
      { text: '2/0', misconception: 'subtract_across' },
      { text: '2/5', misconception: 'none' },
      { text: '4/5', misconception: 'operation_confusion' },
      { text: '1/5', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      'Denominators match. Subtract the numerators only: 3 − 1 = 2. Keep the denominator: 2/5.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FR.05-03',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Visual representation',
    kind: 'mcq',
    visual: {
      kind: 'bars',
      bars: [
        { numerator: 2, denominator: 5, label: 'Bar A: 2/5' },
        { numerator: 1, denominator: 5, label: 'Bar B: 1/5' },
      ],
    },
    stem: 'The two bars below show 2/5 and 1/5 of the same whole. What is the total shaded amount?',
    options: [
      { text: '3/10', misconception: 'add_across' },
      { text: '3/5', misconception: 'none' },
      { text: '2/5', misconception: 'arithmetic_slip' },
      { text: '1/5', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      'Denominators are the same, so the cells are the same size. Total shaded cells = 2 + 1 = 3 out of 5 cells of the same whole. So 2/5 + 1/5 = 3/5.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.05-04',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem:
      'When you add two fractions that already have the same denominator, why does the denominator stay the same?',
    options: [
      { text: 'Because the size of each piece does not change — only how many pieces you have.', misconception: 'none' },
      { text: 'Because you should add denominators too.', misconception: 'add_across' },
      { text: 'Because the denominator is always 1.', misconception: 'conceptual_gap' },
      { text: 'You should subtract denominators when adding.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution:
      'The denominator labels the size of each equal piece. Adding more pieces of the same size keeps the size the same; only the count (the numerator) changes.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.05-05',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 5/8 + 3/8.',
    options: [
      { text: '8/16', misconception: 'add_across' },
      { text: '1', misconception: 'none' },
      { text: '8/8', misconception: 'form_error' },
      { text: '15/8', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      '5/8 + 3/8 = (5 + 3)/8 = 8/8 = 1.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.05-06',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Compute 7/10 − 3/10. Give your answer in simplest form.',
    inputHint: 'Enter as a fraction, e.g., 2/5',
    acceptedAnswers: ['2/5'],
    errorPatterns: [
      { answers: ['4/10'], misconception: 'form_error' },
      { answers: ['4/0'], misconception: 'subtract_across' },
      { answers: ['10/10', '1'], misconception: 'operation_confusion' },
    ],
    solution:
      '7/10 − 3/10 = 4/10 = 2/5 in simplest form.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.05-07',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 5/6 − 2/6 in simplest form.',
    options: [
      { text: '3/0', misconception: 'subtract_across' },
      { text: '1/2', misconception: 'none' },
      { text: '3/6', misconception: 'form_error' },
      { text: '7/6', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      '5/6 − 2/6 = 3/6 = 1/2 in simplest form.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.05-08',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 2/3 + 2/3. Give your answer as a mixed number in simplest form.',
    options: [
      { text: '4/6', misconception: 'add_across' },
      { text: '4/3', misconception: 'form_error' },
      { text: '1 1/3', misconception: 'none' },
      { text: '1 1/6', misconception: 'mixed_number_error' },
    ],
    correctIndex: 2,
    solution:
      '2/3 + 2/3 = 4/3 = 1 1/3.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.05-09',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Out of an 8-slice pizza, Vivaan eats 3 slices and Mira eats 2. What fraction of the pizza is left?',
    options: [
      { text: '5/8', misconception: 'operation_confusion' },
      { text: '3/8', misconception: 'none' },
      { text: '5/16', misconception: 'add_across' },
      { text: '8/8', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      'Eaten = 3/8 + 2/8 = 5/8. Left = 8/8 − 5/8 = 3/8.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.05-10',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Compute 9/12 − 3/12. Give your answer in simplest form.',
    inputHint: 'Enter as a fraction, e.g., 1/2',
    acceptedAnswers: ['1/2'],
    errorPatterns: [
      { answers: ['6/12'], misconception: 'form_error' },
      { answers: ['6/0'], misconception: 'subtract_across' },
      { answers: ['12/12', '1'], misconception: 'operation_confusion' },
      { answers: ['3/4'], misconception: 'arithmetic_slip' },
    ],
    solution:
      '9/12 − 3/12 = 6/12 = 1/2 in simplest form.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FR.05-11',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 7,
    band: 'advanced',
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 1 2/5 + 1/5.',
    options: [
      { text: '1 3/5', misconception: 'none' },
      { text: '1 3/10', misconception: 'add_across' },
      { text: '2 3/5', misconception: 'mixed_number_error' },
      { text: '2/5', misconception: 'mixed_number_error' },
    ],
    correctIndex: 0,
    solution:
      'Whole = 1, fractional = 2/5 + 1/5 = 3/5. Total = 1 3/5.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.05-12',
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A bottle holds 9/10 litre of juice. Aanya pours out 4/10 litre into a glass and 2/10 litre into a second glass. How much juice is left in the bottle?',
    options: [
      { text: '6/10 litre', misconception: 'arithmetic_slip' },
      { text: '3/10 litre', misconception: 'none' },
      { text: '15/10 litre', misconception: 'operation_confusion' },
      { text: '6/30 litre', misconception: 'add_across' },
    ],
    correctIndex: 1,
    solution:
      'Poured out = 4/10 + 2/10 = 6/10. Left = 9/10 − 6/10 = 3/10 litre.',
    estimatedTimeSec: 90,
  },

  // ===== v0.5 additions: FR.08 (Fraction word problems) =====
  // 12 items: 4 foundational, 5 core, 3 advanced. All word problems.
  {
    id: 'FR.08-01',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 2,
    band: 'foundational',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A ribbon is 1/2 metre long. Another ribbon is 1/2 metre long. What is the total length when joined end to end?',
    options: [
      { text: '1 metre', misconception: 'none' },
      { text: '1/4 metre', misconception: 'operation_confusion' },
      { text: '2/4 metre', misconception: 'add_across' },
      { text: '2/2 metre', misconception: 'form_error' },
    ],
    correctIndex: 0,
    solution:
      '1/2 + 1/2 = 2/2 = 1. Total = 1 metre.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FR.08-02',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Jaya has 3/4 of a chocolate bar. She eats 1/4 of the bar. How much is left?',
    options: [
      { text: '4/4', misconception: 'operation_confusion' },
      { text: '1/2', misconception: 'none' },
      { text: '2/0', misconception: 'subtract_across' },
      { text: '1/4', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution:
      '3/4 − 1/4 = 2/4 = 1/2 of the bar.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.08-03',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A jug holds 1/3 litre of water. A second jug holds 1/3 litre. Together, do the two jugs hold less than, equal to, or more than 1 litre?',
    options: [
      { text: 'Less than 1 litre.', misconception: 'none' },
      { text: 'Exactly 1 litre.', misconception: 'arithmetic_slip' },
      { text: 'More than 1 litre.', misconception: 'conceptual_gap' },
      { text: 'You cannot tell without more information.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution:
      '1/3 + 1/3 = 2/3 of a litre, which is less than 1 litre.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.08-04',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 3,
    band: 'foundational',
    cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem:
      'Rohan walks 3/4 km to school and his friend walks 1/4 km. The question asks: "How much further does Rohan walk?" Which operation should you use?',
    options: [
      { text: 'Add: 3/4 + 1/4.', misconception: 'operation_confusion' },
      { text: 'Subtract: 3/4 − 1/4.', misconception: 'none' },
      { text: 'Multiply: 3/4 × 1/4.', misconception: 'operation_confusion' },
      { text: 'Divide: 3/4 ÷ 1/4.', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      '"How much further" asks for the difference, so subtract: 3/4 − 1/4 = 1/2 km.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FR.08-05',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 4,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Anita drinks 1/4 litre of milk in the morning and 1/2 litre in the evening. How much milk does she drink in all?',
    options: [
      { text: '2/6 litre', misconception: 'add_across' },
      { text: '3/4 litre', misconception: 'none' },
      { text: '2/4 litre', misconception: 'incomplete_conversion' },
      { text: '1/4 litre', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      '1/4 + 1/2 = 1/4 + 2/4 = 3/4 litre.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FR.08-06',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A piece of cloth is 2 1/2 metres long. The tailor uses 1 1/4 metres for a shirt. How much cloth is left?',
    options: [
      { text: '1 1/4 m', misconception: 'none' },
      { text: '1 3/4 m', misconception: 'operation_confusion' },
      { text: '1 1/2 m', misconception: 'mixed_number_error' },
      { text: '3 3/4 m', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution:
      '2 1/2 − 1 1/4 = 2 2/4 − 1 1/4 = 1 1/4 m.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.08-07',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem:
      'Aman ate 2/8 of a cake and his sister ate 3/8. What fraction of the cake is left? Give your answer in simplest form.',
    inputHint: 'Enter as a fraction, e.g., 3/8',
    acceptedAnswers: ['3/8'],
    errorPatterns: [
      { answers: ['5/8'], misconception: 'operation_confusion' },
      { answers: ['1/8'], misconception: 'arithmetic_slip' },
      { answers: ['5/16'], misconception: 'add_across' },
    ],
    solution:
      'Eaten = 2/8 + 3/8 = 5/8. Left = 8/8 − 5/8 = 3/8.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.08-08',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 5,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Ravi spent 1/3 of his pocket money on a comic book and 1/4 on stickers. What fraction of his pocket money is left?',
    options: [
      { text: '5/12', misconception: 'none' },
      { text: '7/12', misconception: 'operation_confusion' },
      { text: '2/7', misconception: 'add_across' },
      { text: '1/2', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution:
      'Spent = 1/3 + 1/4. LCM(3, 4) = 12. So 1/3 = 4/12 and 1/4 = 3/12. Spent = 7/12. Left = 12/12 − 7/12 = 5/12.',
    estimatedTimeSec: 100,
  },
  {
    id: 'FR.08-09',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'A water tank is 2/3 full. Another 1/6 of the tank is filled with water from a pipe. What fraction of the tank is now filled?',
    options: [
      { text: '3/9', misconception: 'add_across' },
      { text: '5/6', misconception: 'none' },
      { text: '1/2', misconception: 'arithmetic_slip' },
      { text: '1/3', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution:
      '2/3 + 1/6 = 4/6 + 1/6 = 5/6.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.08-10',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 6,
    band: 'core',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Geeta scored 7/10 in a Maths test and 4/5 in a Science test. By how much did her Science score exceed her Maths score?',
    options: [
      { text: '3/5', misconception: 'incomplete_conversion' },
      { text: '1/10', misconception: 'none' },
      { text: '11/10', misconception: 'operation_confusion' },
      { text: '3/0', misconception: 'subtract_across' },
    ],
    correctIndex: 1,
    solution:
      '4/5 = 8/10. Difference = 8/10 − 7/10 = 1/10.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FR.08-11',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 7,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem:
      'Karan finished 1/3 of his project on Monday, 1/4 on Tuesday, and 1/6 on Wednesday. How much of the project is left to do?',
    options: [
      { text: '3/13', misconception: 'add_across' },
      { text: '3/4', misconception: 'arithmetic_slip' },
      { text: '1/4', misconception: 'none' },
      { text: '7/12', misconception: 'operation_confusion' },
    ],
    correctIndex: 2,
    solution:
      'Done = 1/3 + 1/4 + 1/6. LCM(3,4,6) = 12. So 1/3 = 4/12, 1/4 = 3/12, 1/6 = 2/12. Sum = 9/12. Left = 12/12 − 9/12 = 3/12 = 1/4.',
    estimatedTimeSec: 120,
  },
  {
    id: 'FR.08-12',
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    difficulty: 8,
    band: 'advanced',
    cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem:
      'A jug contains 3 1/2 litres of juice. Two friends drink 1 1/4 litres in total. How much juice is left? Give your answer as a mixed number in simplest form.',
    inputHint: 'Enter as a mixed number, e.g., 2 1/4',
    acceptedAnswers: ['2 1/4', '9/4'],
    errorPatterns: [
      { answers: ['2 1/2'], misconception: 'arithmetic_slip' },
      { answers: ['4 3/4'], misconception: 'operation_confusion' },
      { answers: ['1 1/4'], misconception: 'mixed_number_error' },
    ],
    solution:
      '3 1/2 − 1 1/4 = 3 2/4 − 1 1/4 = 2 1/4 litres left.',
    estimatedTimeSec: 150,
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
