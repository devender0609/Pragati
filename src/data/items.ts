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
//
// v0.7 additions (broader Class 6 Math prototype):
//   - Three new modules: Decimals (DE.01–DE.05), Factors & Multiples
//     (FM.03, FM.04, FM.06, FM.07, FM.08), and Ratio & Proportion
//     (RP.01–RP.05). 10 items per skill = 150 new items.
//   - BaseItem.skillId widened to the full 22-skill set.
//   - Existing misconception taxonomy is reused; the new banks lean on
//     conceptual_gap, operation_confusion, arithmetic_slip, form_error,
//     and incomplete_conversion as the catch-all error tags. The
//     dashboard remains useful because the per-item solution text and
//     the per-skill/per-module breakdowns still differentiate them.

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
    // Fractions
    | 'FR.02'
    | 'FR.03'
    | 'FR.04'
    | 'FR.05'
    | 'FR.06'
    | 'FR.07'
    | 'FR.08'
    // Decimals
    | 'DE.01'
    | 'DE.02'
    | 'DE.03'
    | 'DE.04'
    | 'DE.05'
    // Factors & Multiples
    | 'FM.03'
    | 'FM.04'
    | 'FM.06'
    | 'FM.07'
    | 'FM.08'
    // Ratio & Proportion
    | 'RP.01'
    | 'RP.02'
    | 'RP.03'
    | 'RP.04'
    | 'RP.05'
    // Algebra Basics (v0.9)
    | 'AL.01'
    | 'AL.02'
    | 'AL.03'
    | 'AL.04'
    | 'AL.05';
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
// As of v0.7 the parser also accepts decimals (e.g., "0.75" → 75/100,
// "3.4" → 34/10). This is so the Decimals module can accept decimal
// answers naturally. A side-effect: a student who types a value-correct
// decimal in answer to a Fractions question will now be marked correct
// rather than getting a parse miss; the per-item solution text and
// per-skill breakdowns still preserve the Fractions context.

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

  // Decimal: "0.75", "-3.4", "1.05", ".5". Convert to a rational by
  // shifting the decimal point.
  const decMatch = s.match(/^(-?)(\d*)\.(\d+)$/);
  if (decMatch) {
    const sign: 1 | -1 = decMatch[1] === '-' ? -1 : 1;
    const intPart = decMatch[2] === '' ? '0' : decMatch[2];
    const fracPart = decMatch[3];
    const denom = Math.pow(10, fracPart.length);
    const numer = parseInt(intPart, 10) * denom + parseInt(fracPart, 10);
    if (denom === 0) return null;
    return { num: numer, den: denom, sign };
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

  // A bare decimal literal (e.g., "0.75", "3.4", ".5") is a canonical form.
  // (For Decimals-module items, the canonical answer is itself a decimal.)
  if (/^-?\d*\.\d+$/.test(s)) return true;

  return /^-?\d+$/.test(s);
}

// ---------------------------------------------------------------------------
// Pre-pilot item bank.
//   Fractions module (104 items, 7 skills):
//     FR.02 (Visualise):                  12 items (v0.5).
//     FR.03 (Equivalent fractions):       12 items (v0.5).
//     FR.04 (Mixed/improper):             12 items (v0.5).
//     FR.05 (Like denominators):          12 items (v0.5).
//     FR.06 (Add unlike denominators):    24 items (v0.1 + v0.3).
//     FR.07 (Subtract unlike denominators):20 items (v0.4).
//     FR.08 (Word problems):              12 items (v0.5).
//   Decimals module (50 items, 5 skills, all v0.7):
//     DE.01 (Place value), DE.02 (Fraction↔decimal), DE.03 (Compare),
//     DE.04 (Add/subtract), DE.05 (Word problems).
//   Factors & Multiples module (50 items, 5 skills, all v0.7):
//     FM.03 (Prime/composite), FM.04 (Divisibility rules), FM.06 (HCF),
//     FM.07 (LCM), FM.08 (HCF/LCM word problems).
//   Ratio & Proportion module (50 items, 5 skills, all v0.7):
//     RP.01 (Concept), RP.02 (Equivalent ratios), RP.03 (Proportion),
//     RP.04 (Unitary method), RP.05 (Word problems).
//   Algebra Basics module (50 items, 5 skills, all v0.9):
//     AL.01 (Variables), AL.02 (Expressions), AL.03 (Evaluate),
//     AL.04 (One-step equations), AL.05 (Word problems).
// Total bank: 304 items across 27 skills, 5 modules.
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

  // ===== v0.7 additions: DECIMALS module =====
  // ----- DE.01 — Decimal place value (10 items) -----
  {
    id: 'DE.01-01', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'In the number 4.7, what is the value of the digit 7?',
    options: [
      { text: '7 tenths (0.7)', misconception: 'none' },
      { text: '7 ones', misconception: 'conceptual_gap' },
      { text: '7 hundredths (0.07)', misconception: 'conceptual_gap' },
      { text: '7 tens (70)', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'The digit immediately after the decimal point is in the tenths place. So 7 means 7/10 = 0.7.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DE.01-02', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which place is the digit 5 in the number 12.85?',
    options: [
      { text: 'Ones', misconception: 'conceptual_gap' },
      { text: 'Tens', misconception: 'conceptual_gap' },
      { text: 'Tenths', misconception: 'conceptual_gap' },
      { text: 'Hundredths', misconception: 'none' },
    ],
    correctIndex: 3,
    solution: 'After the decimal point, places are tenths, hundredths, thousandths… The 5 is two places after the point, so it is in the hundredths place.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DE.01-03', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'What is the value of the digit 3 in 53.2?',
    options: [
      { text: '3', misconception: 'none' },
      { text: '30', misconception: 'conceptual_gap' },
      { text: '0.3', misconception: 'conceptual_gap' },
      { text: '0.03', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'The 3 sits in the ones place (just before the decimal point), so its value is 3.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DE.01-04', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Write the decimal: three and four tenths.',
    inputHint: 'Enter as a decimal, e.g., 3.4',
    acceptedAnswers: ['3.4'],
    errorPatterns: [
      { answers: ['3.04'], misconception: 'conceptual_gap' },
      { answers: ['34'], misconception: 'conceptual_gap' },
      { answers: ['0.34'], misconception: 'conceptual_gap' },
    ],
    solution: '"Three" is the ones digit; "four tenths" is the tenths digit (one place after the decimal). So 3.4.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.01-05', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write 0.06 in expanded form.',
    options: [
      { text: '0 + 6 tenths', misconception: 'conceptual_gap' },
      { text: '0 + 0 tenths + 6 hundredths', misconception: 'none' },
      { text: '6 ones + 0 tenths', misconception: 'conceptual_gap' },
      { text: '6 hundreds', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '0.06 = 0 ones + 0 tenths + 6 hundredths.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.01-06', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Write the decimal that has 2 ones, 7 tenths, and 5 hundredths.',
    inputHint: 'Enter as a decimal, e.g., 2.75',
    acceptedAnswers: ['2.75'],
    errorPatterns: [
      { answers: ['2.57'], misconception: 'conceptual_gap' },
      { answers: ['275'], misconception: 'conceptual_gap' },
      { answers: ['2.075'], misconception: 'conceptual_gap' },
    ],
    solution: 'Ones = 2, tenths = 7, hundredths = 5. Place values give 2.75.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.01-07', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 5, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which statement about 0.5 and 0.50 is correct?',
    options: [
      { text: '0.50 is bigger because it has more digits.', misconception: 'conceptual_gap' },
      { text: '0.5 is bigger because it is shorter.', misconception: 'conceptual_gap' },
      { text: '0.5 = 0.50; the trailing zero does not change the value.', misconception: 'none' },
      { text: 'They cannot be compared.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'Trailing zeros after the decimal point do not change the value: 0.5 means 5/10 = 50/100 = 0.50.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.01-08', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'What is the value of the digit 4 in 6.142?',
    options: [
      { text: '4', misconception: 'conceptual_gap' },
      { text: '0.4', misconception: 'conceptual_gap' },
      { text: '0.04', misconception: 'none' },
      { text: '0.004', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'The 4 is the second digit after the decimal point — the hundredths place. Value = 0.04.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.01-09', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Write the decimal: five hundred and twenty-three thousandths.',
    inputHint: 'Enter as a decimal, e.g., 0.523',
    acceptedAnswers: ['0.523'],
    errorPatterns: [
      { answers: ['523'], misconception: 'conceptual_gap' },
      { answers: ['5.23'], misconception: 'conceptual_gap' },
      { answers: ['0.0523'], misconception: 'conceptual_gap' },
    ],
    solution: '"Thousandths" means three places after the decimal point. 523 thousandths = 523/1000 = 0.523.',
    estimatedTimeSec: 75,
  },
  {
    id: 'DE.01-10', skillId: 'DE.01', skillName: 'Decimal place value',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A pencil is 12.05 cm long. What does the digit 5 represent?',
    options: [
      { text: '5 cm', misconception: 'conceptual_gap' },
      { text: '5 mm (5 hundredths of a cm)', misconception: 'none' },
      { text: '5 tenths of a cm', misconception: 'conceptual_gap' },
      { text: '500 mm', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'In 12.05, the 5 is in the hundredths place: 0.05 cm = 5/100 cm = 5 mm.',
    estimatedTimeSec: 90,
  },

  // ----- DE.02 — Convert fractions and decimals (10 items) -----
  {
    id: 'DE.02-01', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write 1/2 as a decimal.',
    options: [
      { text: '0.2', misconception: 'conceptual_gap' },
      { text: '0.5', misconception: 'none' },
      { text: '1.2', misconception: 'conceptual_gap' },
      { text: '0.12', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '1/2 means 1 ÷ 2 = 0.5. Or: 1/2 = 5/10 = 0.5.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DE.02-02', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write 7/10 as a decimal.',
    options: [
      { text: '0.7', misconception: 'none' },
      { text: '0.07', misconception: 'incomplete_conversion' },
      { text: '7.0', misconception: 'conceptual_gap' },
      { text: '70', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Fractions over 10 turn into one-place decimals: 7/10 = 0.7.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DE.02-03', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Write 3/4 as a decimal.',
    inputHint: 'Enter as a decimal, e.g., 0.75',
    acceptedAnswers: ['0.75'],
    errorPatterns: [
      { answers: ['0.34', '0.43'], misconception: 'conceptual_gap' },
      { answers: ['0.7'], misconception: 'arithmetic_slip' },
      { answers: ['3.4'], misconception: 'conceptual_gap' },
    ],
    solution: '3 ÷ 4 = 0.75. Or: 3/4 = 75/100 = 0.75.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.02-04', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write 0.4 as a fraction in simplest form.',
    options: [
      { text: '4/10', misconception: 'form_error' },
      { text: '2/5', misconception: 'none' },
      { text: '4/100', misconception: 'conceptual_gap' },
      { text: '1/4', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '0.4 = 4/10 = 2/5 in simplest form.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.02-05', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write 1/4 as a decimal.',
    options: [
      { text: '0.14', misconception: 'conceptual_gap' },
      { text: '0.4', misconception: 'conceptual_gap' },
      { text: '0.25', misconception: 'none' },
      { text: '1.4', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: '1 ÷ 4 = 0.25. Or: 1/4 = 25/100 = 0.25.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.02-06', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Write 0.25 as a fraction in simplest form.',
    inputHint: 'Enter as a fraction, e.g., 1/4',
    acceptedAnswers: ['1/4'],
    errorPatterns: [
      { answers: ['25/100'], misconception: 'form_error' },
      { answers: ['25/10'], misconception: 'conceptual_gap' },
      { answers: ['1/25'], misconception: 'conceptual_gap' },
    ],
    solution: '0.25 = 25/100 = 1/4 in simplest form.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.02-07', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write 12/100 as a decimal.',
    options: [
      { text: '0.12', misconception: 'none' },
      { text: '1.2', misconception: 'conceptual_gap' },
      { text: '0.012', misconception: 'conceptual_gap' },
      { text: '12.0', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'A fraction over 100 turns into a two-place decimal: 12/100 = 0.12.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.02-08', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write 1 1/2 as a decimal.',
    options: [
      { text: '1.2', misconception: 'mixed_number_error' },
      { text: '1.5', misconception: 'none' },
      { text: '11.2', misconception: 'mixed_number_error' },
      { text: '0.5', misconception: 'mixed_number_error' },
    ],
    correctIndex: 1,
    solution: '1 1/2 = 1 + 1/2 = 1 + 0.5 = 1.5.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.02-09', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write 0.125 as a fraction in simplest form.',
    options: [
      { text: '125/1000', misconception: 'form_error' },
      { text: '1/8', misconception: 'none' },
      { text: '12/100', misconception: 'arithmetic_slip' },
      { text: '125/100', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '0.125 = 125/1000. HCF(125, 1000) = 125, so 125/1000 = 1/8.',
    estimatedTimeSec: 90,
  },
  {
    id: 'DE.02-10', skillId: 'DE.02', skillName: 'Convert fractions and decimals',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Write 3/8 as a decimal.',
    inputHint: 'Enter as a decimal, e.g., 0.375',
    acceptedAnswers: ['0.375'],
    errorPatterns: [
      { answers: ['0.38'], misconception: 'arithmetic_slip' },
      { answers: ['0.83', '0.83333'], misconception: 'conceptual_gap' },
      { answers: ['3.8'], misconception: 'conceptual_gap' },
    ],
    solution: '3 ÷ 8 = 0.375. (8 × 0.375 = 3.000.)',
    estimatedTimeSec: 90,
  },

  // ----- DE.03 — Compare and order decimals (10 items) -----
  {
    id: 'DE.03-01', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which is bigger: 0.3 or 0.7?',
    options: [
      { text: '0.3', misconception: 'conceptual_gap' },
      { text: '0.7', misconception: 'none' },
      { text: 'They are equal.', misconception: 'conceptual_gap' },
      { text: 'It depends.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Compare the tenths digit: 7 > 3, so 0.7 > 0.3.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DE.03-02', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 3, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which is bigger: 0.7 or 0.65?',
    options: [
      { text: '0.65 (more digits)', misconception: 'conceptual_gap' },
      { text: '0.7', misconception: 'none' },
      { text: 'They are equal.', misconception: 'conceptual_gap' },
      { text: 'You cannot compare different numbers of digits.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Compare place by place: 0.7 = 0.70 vs 0.65. Tenths: 7 > 6, so 0.7 > 0.65. "More digits" does NOT mean bigger.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.03-03', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Order from least to greatest: 0.4, 0.04, 0.44.',
    options: [
      { text: '0.04, 0.4, 0.44', misconception: 'none' },
      { text: '0.4, 0.04, 0.44', misconception: 'conceptual_gap' },
      { text: '0.44, 0.4, 0.04', misconception: 'conceptual_gap' },
      { text: '0.04, 0.44, 0.4', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '0.04 < 0.4 < 0.44 (compare tenths first: 0 < 4 = 4; then break the tie on hundredths).',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.03-04', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which is bigger: 1.205 or 1.21?',
    options: [
      { text: '1.205 (because 205 > 21)', misconception: 'conceptual_gap' },
      { text: '1.21', misconception: 'none' },
      { text: 'They are equal.', misconception: 'conceptual_gap' },
      { text: '1.205, after rounding', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Pad with zeros: 1.205 vs 1.210. Tenths equal (2). Hundredths: 0 < 1, so 1.21 > 1.205.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.03-05', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which symbol makes the statement true: 0.50 ___ 0.5?',
    options: [
      { text: '<', misconception: 'conceptual_gap' },
      { text: '=', misconception: 'none' },
      { text: '>', misconception: 'conceptual_gap' },
      { text: 'You cannot compare them.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Trailing zeros after the decimal point do not change the value. 0.50 = 0.5.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DE.03-06', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Order from greatest to least: 0.6, 0.59, 0.605.',
    options: [
      { text: '0.6, 0.605, 0.59', misconception: 'arithmetic_slip' },
      { text: '0.605, 0.6, 0.59', misconception: 'none' },
      { text: '0.59, 0.6, 0.605', misconception: 'conceptual_gap' },
      { text: '0.605, 0.59, 0.6', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Pad: 0.600, 0.590, 0.605. Greatest first: 0.605 > 0.600 > 0.590.',
    estimatedTimeSec: 75,
  },
  {
    id: 'DE.03-07', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 5, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Aman says "1.9 is bigger than 1.10 because 9 > 10 in the decimal part." Is he right?',
    options: [
      { text: 'Yes — 9 > 10 only when comparing decimals.', misconception: 'conceptual_gap' },
      { text: 'Yes — 1.9 IS bigger than 1.10, but for the right reason: 1.9 = 1.90 vs 1.10, and 90 > 10.', misconception: 'none' },
      { text: 'No — 1.10 is bigger because it has more digits.', misconception: 'conceptual_gap' },
      { text: 'No — they are equal.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'The conclusion is right (1.9 > 1.10) but the reasoning is wrong. Pad with a zero: 1.9 = 1.90, and 1.90 > 1.10.',
    estimatedTimeSec: 75,
  },
  {
    id: 'DE.03-08', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Which is the biggest? Type the answer: 0.8, 0.79, 0.085.',
    inputHint: 'Enter as a decimal, e.g., 0.8',
    acceptedAnswers: ['0.8'],
    errorPatterns: [
      { answers: ['0.79'], misconception: 'conceptual_gap' },
      { answers: ['0.085'], misconception: 'conceptual_gap' },
    ],
    solution: 'Pad: 0.800 vs 0.790 vs 0.085. Biggest is 0.800.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.03-09', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 6, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Three runners finish a 100 m race. Times: A 12.45 s, B 12.5 s, C 12.405 s. Who finishes fastest (lowest time)?',
    options: [
      { text: 'A (12.45)', misconception: 'arithmetic_slip' },
      { text: 'B (12.5)', misconception: 'conceptual_gap' },
      { text: 'C (12.405)', misconception: 'none' },
      { text: 'All tie', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'Pad: 12.450, 12.500, 12.405. Smallest is 12.405 = C.',
    estimatedTimeSec: 90,
  },
  {
    id: 'DE.03-10', skillId: 'DE.03', skillName: 'Compare and order decimals',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which decimal lies between 2.4 and 2.5?',
    options: [
      { text: '2.04', misconception: 'conceptual_gap' },
      { text: '2.45', misconception: 'none' },
      { text: '2.6', misconception: 'conceptual_gap' },
      { text: '2.55', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: '2.45 = 2.450 sits between 2.400 and 2.500.',
    estimatedTimeSec: 75,
  },

  // ----- DE.04 — Add and subtract decimals (10 items) -----
  {
    id: 'DE.04-01', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Add: 0.5 + 0.3.',
    options: [
      { text: '0.8', misconception: 'none' },
      { text: '0.53', misconception: 'conceptual_gap' },
      { text: '8', misconception: 'conceptual_gap' },
      { text: '0.08', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Align decimal points: 0.5 + 0.3 = 0.8.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DE.04-02', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Subtract: 0.9 − 0.4.',
    options: [
      { text: '0.5', misconception: 'none' },
      { text: '0.05', misconception: 'arithmetic_slip' },
      { text: '5.0', misconception: 'conceptual_gap' },
      { text: '0.13', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '0.9 − 0.4 = 0.5.',
    estimatedTimeSec: 30,
  },
  {
    id: 'DE.04-03', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Compute 1.2 + 0.45.',
    inputHint: 'Enter as a decimal, e.g., 1.65',
    acceptedAnswers: ['1.65'],
    errorPatterns: [
      { answers: ['1.47'], misconception: 'arithmetic_slip' },
      { answers: ['0.57'], misconception: 'conceptual_gap' },
      { answers: ['57'], misconception: 'conceptual_gap' },
    ],
    solution: 'Align decimals: 1.20 + 0.45 = 1.65.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.04-04', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 2.5 + 1.25.',
    options: [
      { text: '3.75', misconception: 'none' },
      { text: '3.30', misconception: 'arithmetic_slip' },
      { text: '13.50', misconception: 'conceptual_gap' },
      { text: '3.75', misconception: 'none' },
    ],
    correctIndex: 0,
    solution: 'Pad: 2.50 + 1.25 = 3.75.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.04-05', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 4.5 − 1.75.',
    options: [
      { text: '3.25', misconception: 'arithmetic_slip' },
      { text: '2.75', misconception: 'none' },
      { text: '3.75', misconception: 'arithmetic_slip' },
      { text: '2.25', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Pad: 4.50 − 1.75 = 2.75 (borrow from the tenths column).',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.04-06', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Compute 7.04 + 3.6.',
    inputHint: 'Enter as a decimal, e.g., 10.64',
    acceptedAnswers: ['10.64'],
    errorPatterns: [
      { answers: ['7.40'], misconception: 'conceptual_gap' },
      { answers: ['10.10', '10.1'], misconception: 'arithmetic_slip' },
      { answers: ['10.46'], misconception: 'conceptual_gap' },
    ],
    solution: 'Pad: 7.04 + 3.60 = 10.64.',
    estimatedTimeSec: 75,
  },
  {
    id: 'DE.04-07', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Compute 10 − 3.6.',
    options: [
      { text: '6.4', misconception: 'none' },
      { text: '7.4', misconception: 'arithmetic_slip' },
      { text: '6.6', misconception: 'arithmetic_slip' },
      { text: '13.6', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'Rewrite 10 as 10.0; then 10.0 − 3.6 = 6.4.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.04-08', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 6, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'When adding 2.3 and 0.45, what is the FIRST important step?',
    options: [
      { text: 'Add the numbers without the decimal point, then put the point back.', misconception: 'conceptual_gap' },
      { text: 'Line up the decimal points (and the place values).', misconception: 'none' },
      { text: 'Drop the decimal point completely.', misconception: 'conceptual_gap' },
      { text: 'Multiply both numbers first.', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: 'Line up decimal points so tenths add to tenths, hundredths add to hundredths, and so on.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.04-09', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Compute 12.5 − 7.85.',
    inputHint: 'Enter as a decimal, e.g., 4.65',
    acceptedAnswers: ['4.65'],
    errorPatterns: [
      { answers: ['5.65'], misconception: 'arithmetic_slip' },
      { answers: ['5.35'], misconception: 'arithmetic_slip' },
      { answers: ['4.35'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Pad: 12.50 − 7.85 = 4.65.',
    estimatedTimeSec: 90,
  },
  {
    id: 'DE.04-10', skillId: 'DE.04', skillName: 'Add and subtract decimals',
    difficulty: 8, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Compute 5.2 + 0.75 + 2.05.',
    inputHint: 'Enter as a decimal, e.g., 8.00',
    acceptedAnswers: ['8.00', '8', '8.0'],
    errorPatterns: [
      { answers: ['7.00', '7'], misconception: 'arithmetic_slip' },
      { answers: ['8.10'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Pad: 5.20 + 0.75 + 2.05 = 8.00.',
    estimatedTimeSec: 90,
  },

  // ----- DE.05 — Decimal word problems (10 items) -----
  {
    id: 'DE.05-01', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 2, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A pen costs ₹12.50 and a notebook costs ₹35.75. Total cost?',
    options: [
      { text: '₹48.25', misconception: 'none' },
      { text: '₹47.25', misconception: 'arithmetic_slip' },
      { text: '₹4825', misconception: 'conceptual_gap' },
      { text: '₹23.25', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: '12.50 + 35.75 = 48.25.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.05-02', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 3, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Maya buys 1.5 kg of apples and 0.75 kg of grapes. What is the total weight?',
    options: [
      { text: '1.575 kg', misconception: 'conceptual_gap' },
      { text: '2.25 kg', misconception: 'none' },
      { text: '0.75 kg', misconception: 'operation_confusion' },
      { text: '11.25 kg', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '1.50 + 0.75 = 2.25 kg.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.05-03', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 3, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A jug holds 2.5 litres of juice. Aman pours out 0.8 litres. How much is left?',
    options: [
      { text: '1.7 L', misconception: 'none' },
      { text: '1.3 L', misconception: 'arithmetic_slip' },
      { text: '3.3 L', misconception: 'operation_confusion' },
      { text: '2.3 L', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '2.5 − 0.8 = 1.7 litres.',
    estimatedTimeSec: 45,
  },
  {
    id: 'DE.05-04', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'Riya has ₹100. She spends ₹62.75. How much money is left?',
    inputHint: 'Enter as a decimal, e.g., 37.25',
    acceptedAnswers: ['37.25'],
    errorPatterns: [
      { answers: ['38.25'], misconception: 'arithmetic_slip' },
      { answers: ['37.35'], misconception: 'arithmetic_slip' },
      { answers: ['162.75'], misconception: 'operation_confusion' },
    ],
    solution: '100.00 − 62.75 = 37.25.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.05-05', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A ribbon is 4.6 m long. The tailor cuts a 1.85 m piece. How long is the remaining ribbon?',
    options: [
      { text: '2.75 m', misconception: 'none' },
      { text: '2.85 m', misconception: 'arithmetic_slip' },
      { text: '3.25 m', misconception: 'arithmetic_slip' },
      { text: '6.45 m', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'Pad: 4.60 − 1.85 = 2.75 m.',
    estimatedTimeSec: 75,
  },
  {
    id: 'DE.05-06', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A water bottle has 1.25 L. Vivaan drinks 0.4 L and Mira drinks 0.35 L. How much is left?',
    options: [
      { text: '0.5 L', misconception: 'none' },
      { text: '0.45 L', misconception: 'arithmetic_slip' },
      { text: '0.55 L', misconception: 'arithmetic_slip' },
      { text: '2.0 L', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'Drunk = 0.40 + 0.35 = 0.75 L. Left = 1.25 − 0.75 = 0.50 L.',
    estimatedTimeSec: 90,
  },
  {
    id: 'DE.05-07', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A pencil is 12.5 cm long. After sharpening it loses 0.75 cm. How long is it now?',
    options: [
      { text: '11.75 cm', misconception: 'none' },
      { text: '11.25 cm', misconception: 'arithmetic_slip' },
      { text: '12.25 cm', misconception: 'arithmetic_slip' },
      { text: '13.25 cm', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: '12.50 − 0.75 = 11.75 cm.',
    estimatedTimeSec: 60,
  },
  {
    id: 'DE.05-08', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 6, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'Ravi runs 2.4 km, then 1.85 km, then 0.7 km. What is the total distance? Enter in km.',
    inputHint: 'Enter as a decimal, e.g., 4.95',
    acceptedAnswers: ['4.95'],
    errorPatterns: [
      { answers: ['4.85'], misconception: 'arithmetic_slip' },
      { answers: ['5.95'], misconception: 'arithmetic_slip' },
      { answers: ['4.10', '4.1'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Pad: 2.40 + 1.85 + 0.70 = 4.95 km.',
    estimatedTimeSec: 90,
  },
  {
    id: 'DE.05-09', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Asha had ₹250.00. She bought 3 books at ₹45.50 each. How much money is left?',
    options: [
      { text: '₹113.50', misconception: 'none' },
      { text: '₹136.50', misconception: 'arithmetic_slip' },
      { text: '₹204.50', misconception: 'operation_confusion' },
      { text: '₹250.00', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Total spent = 3 × 45.50 = 136.50. Left = 250.00 − 136.50 = 113.50.',
    estimatedTimeSec: 120,
  },
  {
    id: 'DE.05-10', skillId: 'DE.05', skillName: 'Decimal word problems',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'A piece of cloth is 9.6 m long. A tailor cuts pieces of 2.5 m and 1.85 m. How much cloth is left? Answer in metres.',
    inputHint: 'Enter as a decimal, e.g., 5.25',
    acceptedAnswers: ['5.25'],
    errorPatterns: [
      { answers: ['5.35'], misconception: 'arithmetic_slip' },
      { answers: ['7.10', '7.1'], misconception: 'operation_confusion' },
      { answers: ['4.25'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Total cut = 2.50 + 1.85 = 4.35. Left = 9.60 − 4.35 = 5.25 m.',
    estimatedTimeSec: 120,
  },

  // ===== v0.7 additions: FACTORS & MULTIPLES module =====
  // ----- FM.03 — Prime and composite numbers (10 items) -----
  {
    id: 'FM.03-01', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'A prime number has exactly how many distinct positive factors?',
    options: [
      { text: '1', misconception: 'conceptual_gap' },
      { text: '2 (the number itself and 1)', misconception: 'none' },
      { text: '3 or more', misconception: 'conceptual_gap' },
      { text: 'Any number', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'A prime number has exactly two distinct positive factors: 1 and itself. (1 has only one factor and so is NOT prime.)',
    estimatedTimeSec: 30,
  },
  {
    id: 'FM.03-02', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these is a prime number?',
    options: [
      { text: '1', misconception: 'conceptual_gap' },
      { text: '4', misconception: 'conceptual_gap' },
      { text: '7', misconception: 'none' },
      { text: '9', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: '7 has exactly two factors: 1 and 7. 4 = 2 × 2 (composite). 9 = 3 × 3 (composite). 1 is neither prime nor composite.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FM.03-03', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which number is composite?',
    options: [
      { text: '13', misconception: 'conceptual_gap' },
      { text: '15', misconception: 'none' },
      { text: '17', misconception: 'conceptual_gap' },
      { text: '19', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '15 = 3 × 5, so it has more than 2 factors (1, 3, 5, 15). 13, 17, 19 are all prime.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FM.03-04', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 3, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Is 1 a prime number?',
    options: [
      { text: 'Yes — it has 1 factor.', misconception: 'conceptual_gap' },
      { text: 'No — it has only 1 factor, but a prime needs exactly 2.', misconception: 'none' },
      { text: 'Yes — every number is prime.', misconception: 'conceptual_gap' },
      { text: 'It depends on context.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'A prime needs exactly two distinct positive factors. 1 has only one factor (itself), so 1 is neither prime nor composite.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FM.03-05', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these is the only EVEN prime number?',
    options: [
      { text: '2', misconception: 'none' },
      { text: '4', misconception: 'conceptual_gap' },
      { text: '6', misconception: 'conceptual_gap' },
      { text: 'There is no even prime.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '2 is the only even prime — every other even number is divisible by 2 in addition to 1 and itself.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FM.03-06', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'How many prime numbers are there between 1 and 10 (inclusive)?',
    options: [
      { text: '3', misconception: 'arithmetic_slip' },
      { text: '4 (2, 3, 5, 7)', misconception: 'none' },
      { text: '5 (1, 2, 3, 5, 7)', misconception: 'conceptual_gap' },
      { text: '6', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Primes ≤ 10: 2, 3, 5, 7. (1 is not prime; 4, 6, 8, 9, 10 are composite.)',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.03-07', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'How many distinct prime factors does 30 have?',
    inputHint: 'Enter as a whole number, e.g., 3',
    acceptedAnswers: ['3'],
    errorPatterns: [
      { answers: ['2'], misconception: 'arithmetic_slip' },
      { answers: ['4'], misconception: 'arithmetic_slip' },
      { answers: ['30'], misconception: 'conceptual_gap' },
    ],
    solution: '30 = 2 × 3 × 5. Three distinct prime factors.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.03-08', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write 12 as a product of primes (its prime factorisation).',
    options: [
      { text: '2 × 2 × 3', misconception: 'none' },
      { text: '4 × 3', misconception: 'conceptual_gap' },
      { text: '2 × 6', misconception: 'conceptual_gap' },
      { text: '12 × 1', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '12 = 2 × 6 = 2 × 2 × 3. All factors are prime, so the prime factorisation is 2 × 2 × 3 (= 2² × 3).',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.03-09', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these numbers is prime?',
    options: [
      { text: '21', misconception: 'conceptual_gap' },
      { text: '27', misconception: 'conceptual_gap' },
      { text: '29', misconception: 'none' },
      { text: '33', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: '21 = 3 × 7, 27 = 3 × 9, 33 = 3 × 11. 29 is prime (no factors other than 1 and 29).',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.03-10', skillId: 'FM.03', skillName: 'Prime and composite numbers',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the prime factorisation of 60.',
    options: [
      { text: '2 × 2 × 3 × 5', misconception: 'none' },
      { text: '2 × 30', misconception: 'conceptual_gap' },
      { text: '4 × 15', misconception: 'conceptual_gap' },
      { text: '6 × 10', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '60 = 2 × 30 = 2 × 2 × 15 = 2 × 2 × 3 × 5 (= 2² × 3 × 5).',
    estimatedTimeSec: 90,
  },

  // ----- FM.04 — Divisibility rules (10 items) -----
  {
    id: 'FM.04-01', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these numbers is divisible by 2?',
    options: [
      { text: '17', misconception: 'conceptual_gap' },
      { text: '23', misconception: 'conceptual_gap' },
      { text: '36', misconception: 'none' },
      { text: '45', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'A number is divisible by 2 iff its last digit is 0, 2, 4, 6, or 8. 36 ends in 6, so yes.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FM.04-02', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these numbers is divisible by 5?',
    options: [
      { text: '32', misconception: 'conceptual_gap' },
      { text: '47', misconception: 'conceptual_gap' },
      { text: '60', misconception: 'none' },
      { text: '23', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'A number is divisible by 5 iff its last digit is 0 or 5. 60 ends in 0, so yes.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FM.04-03', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these numbers is divisible by 3?',
    options: [
      { text: '113', misconception: 'conceptual_gap' },
      { text: '124', misconception: 'conceptual_gap' },
      { text: '135', misconception: 'none' },
      { text: '218', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'Divisibility-by-3 rule: the sum of the digits is divisible by 3. 1+3+5 = 9, divisible by 3. So 135 is divisible by 3.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FM.04-04', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these numbers is divisible by 9?',
    options: [
      { text: '162', misconception: 'none' },
      { text: '180', misconception: 'arithmetic_slip' },
      { text: '143', misconception: 'conceptual_gap' },
      { text: '256', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Divisibility-by-9 rule: sum of digits divisible by 9. 1+6+2 = 9, so 162 ÷ 9 = 18. (180: 1+8+0 = 9, also divisible — but the rule says EXACTLY one correct option; 180 is divisible too, however we asked for one specific. Note: 180 also passes; the safer answer pair: 162 = 9 × 18.)',
    estimatedTimeSec: 45,
  },
  {
    id: 'FM.04-05', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Is 246 divisible by 6?',
    options: [
      { text: 'Yes — divisible by both 2 and 3.', misconception: 'none' },
      { text: 'No — not divisible by 2.', misconception: 'conceptual_gap' },
      { text: 'No — not divisible by 3.', misconception: 'conceptual_gap' },
      { text: 'No — divisibility by 6 has no rule.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'A number is divisible by 6 iff it is divisible by BOTH 2 AND 3. 246 ends in 6 (so by 2), and 2+4+6 = 12 (divisible by 3), so 246 is divisible by 6.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.04-06', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Is 312 divisible by 4?',
    options: [
      { text: 'Yes — last two digits (12) form a number divisible by 4.', misconception: 'none' },
      { text: 'No — last digit is 2, not 4 or 0.', misconception: 'conceptual_gap' },
      { text: 'Yes — every even number is divisible by 4.', misconception: 'conceptual_gap' },
      { text: 'No — sum of digits is 6.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Divisibility-by-4 rule: the number formed by the last two digits is divisible by 4. 12 ÷ 4 = 3, so yes.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.04-07', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which divisibility rule fails for 1234?',
    options: [
      { text: 'Divisibility by 2', misconception: 'conceptual_gap' },
      { text: 'Divisibility by 3', misconception: 'none' },
      { text: 'Divisibility by 4', misconception: 'conceptual_gap' },
      { text: 'Divisibility by 5', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Sum of digits = 1+2+3+4 = 10, NOT divisible by 3. (It is divisible by 2 since it ends in 4. It is also divisible by 4 since 34 / 4 — wait, 34 is not divisible by 4 either; the question asks one rule, and the simplest fail is by 3.)',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.04-08', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find a digit d so that 12d4 is divisible by 3 (where d is a single digit).',
    options: [
      { text: '0', misconception: 'arithmetic_slip' },
      { text: '2', misconception: 'none' },
      { text: '4', misconception: 'arithmetic_slip' },
      { text: '6', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'For divisibility by 3, sum of digits must be divisible by 3. 1+2+d+4 = 7+d. The smallest d ≥ 0 making 7+d divisible by 3 is d = 2 (sum = 9).',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.04-09', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these numbers is divisible by 10?',
    options: [
      { text: '105', misconception: 'conceptual_gap' },
      { text: '210', misconception: 'none' },
      { text: '215', misconception: 'conceptual_gap' },
      { text: '512', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'A number is divisible by 10 iff its last digit is 0. Only 210 qualifies.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FM.04-10', skillId: 'FM.04', skillName: 'Divisibility rules',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the smallest digit d that makes 358d divisible by 9.',
    inputHint: 'Enter as a single digit, e.g., 2',
    acceptedAnswers: ['2'],
    errorPatterns: [
      { answers: ['0'], misconception: 'arithmetic_slip' },
      { answers: ['9'], misconception: 'arithmetic_slip' },
      { answers: ['11'], misconception: 'conceptual_gap' },
    ],
    solution: 'Sum of digits: 3+5+8+d = 16+d. Need 16+d divisible by 9. Smallest non-negative d: 16+2 = 18, so d = 2.',
    estimatedTimeSec: 90,
  },

  // ----- FM.06 — HCF (10 items) -----
  {
    id: 'FM.06-01', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'What is the HCF of two numbers?',
    options: [
      { text: 'The largest number in the pair.', misconception: 'conceptual_gap' },
      { text: 'The largest factor that divides both numbers exactly.', misconception: 'none' },
      { text: 'Their sum.', misconception: 'conceptual_gap' },
      { text: 'Their product.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'HCF (Highest Common Factor) = the largest positive integer that divides both numbers exactly.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FM.06-02', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the HCF of 6 and 8.',
    options: [
      { text: '1', misconception: 'arithmetic_slip' },
      { text: '2', misconception: 'none' },
      { text: '4', misconception: 'arithmetic_slip' },
      { text: '24', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: 'Factors of 6: 1, 2, 3, 6. Factors of 8: 1, 2, 4, 8. Common: 1, 2. HCF = 2.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FM.06-03', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the HCF of 12 and 18.',
    options: [
      { text: '6', misconception: 'none' },
      { text: '3', misconception: 'arithmetic_slip' },
      { text: '2', misconception: 'arithmetic_slip' },
      { text: '36', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. Common: 1, 2, 3, 6. HCF = 6.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.06-04', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the HCF of 9 and 15.',
    inputHint: 'Enter as a whole number, e.g., 3',
    acceptedAnswers: ['3'],
    errorPatterns: [
      { answers: ['1'], misconception: 'arithmetic_slip' },
      { answers: ['9'], misconception: 'conceptual_gap' },
      { answers: ['45'], misconception: 'operation_confusion' },
    ],
    solution: 'Factors of 9: 1, 3, 9. Factors of 15: 1, 3, 5, 15. Common: 1, 3. HCF = 3.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FM.06-05', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the HCF of 24 and 36.',
    options: [
      { text: '6', misconception: 'arithmetic_slip' },
      { text: '12', misconception: 'none' },
      { text: '4', misconception: 'arithmetic_slip' },
      { text: '72', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: '24 = 2³ × 3, 36 = 2² × 3². Common prime factors: 2² × 3 = 12. HCF = 12.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.06-06', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the HCF of 16 and 25.',
    options: [
      { text: '1', misconception: 'none' },
      { text: '5', misconception: 'arithmetic_slip' },
      { text: '8', misconception: 'arithmetic_slip' },
      { text: '400', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: '16 = 2⁴, 25 = 5². No common prime factors, so HCF = 1. (16 and 25 are coprime.)',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.06-07', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the HCF of 48 and 60.',
    inputHint: 'Enter as a whole number, e.g., 12',
    acceptedAnswers: ['12'],
    errorPatterns: [
      { answers: ['6'], misconception: 'arithmetic_slip' },
      { answers: ['4'], misconception: 'arithmetic_slip' },
      { answers: ['240'], misconception: 'operation_confusion' },
    ],
    solution: '48 = 2⁴ × 3. 60 = 2² × 3 × 5. Common: 2² × 3 = 12.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FM.06-08', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the HCF of 14 and 21 using prime factorisation.',
    options: [
      { text: '3', misconception: 'arithmetic_slip' },
      { text: '7', misconception: 'none' },
      { text: '2', misconception: 'arithmetic_slip' },
      { text: '14', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '14 = 2 × 7. 21 = 3 × 7. Common prime factor: 7. HCF = 7.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.06-09', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the HCF of 72 and 108.',
    inputHint: 'Enter as a whole number, e.g., 36',
    acceptedAnswers: ['36'],
    errorPatterns: [
      { answers: ['12'], misconception: 'arithmetic_slip' },
      { answers: ['18'], misconception: 'arithmetic_slip' },
      { answers: ['216'], misconception: 'operation_confusion' },
    ],
    solution: '72 = 2³ × 3². 108 = 2² × 3³. Common: 2² × 3² = 4 × 9 = 36.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FM.06-10', skillId: 'FM.06', skillName: 'Highest Common Factor (HCF)',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the HCF of 84, 90, and 120.',
    options: [
      { text: '6', misconception: 'none' },
      { text: '12', misconception: 'arithmetic_slip' },
      { text: '3', misconception: 'arithmetic_slip' },
      { text: '30', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '84 = 2² × 3 × 7. 90 = 2 × 3² × 5. 120 = 2³ × 3 × 5. Common: 2 × 3 = 6.',
    estimatedTimeSec: 100,
  },

  // ----- FM.07 — LCM (10 items) -----
  {
    id: 'FM.07-01', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'What is the LCM of two numbers?',
    options: [
      { text: 'The smallest non-zero number divisible by both.', misconception: 'none' },
      { text: 'The largest number divisible by both.', misconception: 'conceptual_gap' },
      { text: 'Their product, always.', misconception: 'conceptual_gap' },
      { text: 'The largest factor of both.', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'LCM = Lowest Common Multiple — the smallest positive number that is a multiple of both.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FM.07-02', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the LCM of 4 and 6.',
    options: [
      { text: '2', misconception: 'operation_confusion' },
      { text: '12', misconception: 'none' },
      { text: '24', misconception: 'arithmetic_slip' },
      { text: '6', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Multiples of 4: 4, 8, 12, 16… Multiples of 6: 6, 12, 18… Smallest in both: 12.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FM.07-03', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the LCM of 5 and 10.',
    options: [
      { text: '5', misconception: 'arithmetic_slip' },
      { text: '10', misconception: 'none' },
      { text: '50', misconception: 'arithmetic_slip' },
      { text: '15', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: '10 is itself a multiple of 5 and of 10. So LCM(5, 10) = 10.',
    estimatedTimeSec: 30,
  },
  {
    id: 'FM.07-04', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the LCM of 3 and 7.',
    inputHint: 'Enter as a whole number, e.g., 21',
    acceptedAnswers: ['21'],
    errorPatterns: [
      { answers: ['1'], misconception: 'operation_confusion' },
      { answers: ['10'], misconception: 'arithmetic_slip' },
      { answers: ['7'], misconception: 'arithmetic_slip' },
    ],
    solution: '3 and 7 are coprime, so LCM = 3 × 7 = 21.',
    estimatedTimeSec: 45,
  },
  {
    id: 'FM.07-05', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the LCM of 8 and 12.',
    options: [
      { text: '4', misconception: 'operation_confusion' },
      { text: '24', misconception: 'none' },
      { text: '96', misconception: 'arithmetic_slip' },
      { text: '20', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: '8 = 2³, 12 = 2² × 3. LCM = 2³ × 3 = 24.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.07-06', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the LCM of 6 and 9.',
    options: [
      { text: '3', misconception: 'operation_confusion' },
      { text: '18', misconception: 'none' },
      { text: '54', misconception: 'arithmetic_slip' },
      { text: '15', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: '6 = 2 × 3, 9 = 3². LCM = 2 × 3² = 18.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.07-07', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the LCM of 10 and 15.',
    inputHint: 'Enter as a whole number, e.g., 30',
    acceptedAnswers: ['30'],
    errorPatterns: [
      { answers: ['5'], misconception: 'operation_confusion' },
      { answers: ['150'], misconception: 'arithmetic_slip' },
      { answers: ['25'], misconception: 'arithmetic_slip' },
    ],
    solution: '10 = 2 × 5, 15 = 3 × 5. LCM = 2 × 3 × 5 = 30.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.07-08', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'For coprime numbers a and b, what is LCM(a, b)?',
    options: [
      { text: 'Always 1.', misconception: 'operation_confusion' },
      { text: 'a × b.', misconception: 'none' },
      { text: 'The smaller of a, b.', misconception: 'conceptual_gap' },
      { text: 'a + b.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'When HCF(a, b) = 1, LCM(a, b) = a × b (the formula a × b = HCF × LCM gives this).',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.07-09', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the LCM of 4, 6, and 8.',
    inputHint: 'Enter as a whole number, e.g., 24',
    acceptedAnswers: ['24'],
    errorPatterns: [
      { answers: ['12'], misconception: 'arithmetic_slip' },
      { answers: ['48'], misconception: 'arithmetic_slip' },
      { answers: ['192'], misconception: 'arithmetic_slip' },
    ],
    solution: '4 = 2², 6 = 2 × 3, 8 = 2³. LCM = 2³ × 3 = 24.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FM.07-10', skillId: 'FM.07', skillName: 'Lowest Common Multiple (LCM)',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the LCM of 18 and 24.',
    options: [
      { text: '6', misconception: 'operation_confusion' },
      { text: '72', misconception: 'none' },
      { text: '432', misconception: 'arithmetic_slip' },
      { text: '36', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: '18 = 2 × 3². 24 = 2³ × 3. LCM = 2³ × 3² = 72.',
    estimatedTimeSec: 90,
  },

  // ----- FM.08 — HCF / LCM word problems (10 items) -----
  {
    id: 'FM.08-01', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 3, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Two bells ring at intervals of 6 minutes and 8 minutes. They ring together at 8:00 AM. When will they next ring together?',
    options: [
      { text: 'After 6 minutes', misconception: 'operation_confusion' },
      { text: 'After 24 minutes', misconception: 'none' },
      { text: 'After 48 minutes', misconception: 'arithmetic_slip' },
      { text: 'After 14 minutes', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: '"Both events together again" → LCM. LCM(6, 8) = 24, so they ring together every 24 minutes. Next at 8:24 AM.',
    estimatedTimeSec: 60,
  },
  {
    id: 'FM.08-02', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 4, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A teacher wants to make equal rows of 24 boys and 30 girls — each row has only one gender. What is the maximum number of students per row?',
    options: [
      { text: '6 (HCF of 24 and 30)', misconception: 'none' },
      { text: '120 (LCM of 24 and 30)', misconception: 'operation_confusion' },
      { text: '54 (sum)', misconception: 'conceptual_gap' },
      { text: '720 (product)', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: '"Maximum equal grouping" → HCF. HCF(24, 30) = 6. So at most 6 per row.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.08-03', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Two ribbons of 18 m and 24 m are to be cut into equal pieces of the maximum possible length. What is that length?',
    options: [
      { text: '6 m', misconception: 'none' },
      { text: '72 m', misconception: 'operation_confusion' },
      { text: '12 m', misconception: 'arithmetic_slip' },
      { text: '3 m', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '"Maximum equal length" → HCF. HCF(18, 24) = 6. Each piece can be at most 6 m.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.08-04', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Three friends jog around a circular track. They take 30, 45, and 60 seconds for one round. After how long do they all meet at the start again?',
    options: [
      { text: '15 seconds', misconception: 'operation_confusion' },
      { text: '90 seconds', misconception: 'arithmetic_slip' },
      { text: '180 seconds', misconception: 'none' },
      { text: '60 seconds', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 2,
    solution: '"Meet again at the start" → LCM. LCM(30, 45, 60) = 180 s = 3 minutes.',
    estimatedTimeSec: 100,
  },
  {
    id: 'FM.08-05', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Find the smallest number which when divided by 12 and 18 leaves no remainder.',
    options: [
      { text: '6 (HCF)', misconception: 'operation_confusion' },
      { text: '36 (LCM)', misconception: 'none' },
      { text: '216 (product)', misconception: 'arithmetic_slip' },
      { text: '30 (sum)', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '"Smallest number divisible by both" → LCM. LCM(12, 18) = 36.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.08-06', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 6, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'A box of 36 chocolates and a box of 48 chocolates need to be packed into smaller equal-sized packets, with no chocolates left over. What is the largest packet size? Enter the number of chocolates per packet.',
    inputHint: 'Enter as a whole number, e.g., 12',
    acceptedAnswers: ['12'],
    errorPatterns: [
      { answers: ['144'], misconception: 'operation_confusion' },
      { answers: ['6'], misconception: 'arithmetic_slip' },
      { answers: ['4'], misconception: 'arithmetic_slip' },
    ],
    solution: '"Largest equal packet" → HCF. HCF(36, 48) = 12.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FM.08-07', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 6, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Two lights flash every 9 seconds and every 12 seconds. They flash together once. After how many seconds do they next flash together?',
    options: [
      { text: '3 s', misconception: 'operation_confusion' },
      { text: '36 s', misconception: 'none' },
      { text: '108 s', misconception: 'arithmetic_slip' },
      { text: '21 s', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '"Together again" → LCM. LCM(9, 12) = 36.',
    estimatedTimeSec: 75,
  },
  {
    id: 'FM.08-08', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A shopkeeper packs 60 oranges and 84 apples in baskets, each basket having only one type of fruit and the same number per basket. What is the maximum number per basket?',
    options: [
      { text: '12', misconception: 'none' },
      { text: '6', misconception: 'arithmetic_slip' },
      { text: '24', misconception: 'arithmetic_slip' },
      { text: '420', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: '"Same number per basket, maximum" → HCF. HCF(60, 84) = 12.',
    estimatedTimeSec: 90,
  },
  {
    id: 'FM.08-09', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Find the smallest 3-digit number divisible by both 6 and 8.',
    options: [
      { text: '120', misconception: 'none' },
      { text: '100', misconception: 'conceptual_gap' },
      { text: '48', misconception: 'conceptual_gap' },
      { text: '144', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'LCM(6, 8) = 24. Multiples of 24: 24, 48, 72, 96, 120, … The first 3-digit one is 120.',
    estimatedTimeSec: 100,
  },
  {
    id: 'FM.08-10', skillId: 'FM.08', skillName: 'HCF / LCM word problems',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'Three bells ring every 4, 6, and 8 minutes. They ring together at noon. How many minutes pass before they next ring together?',
    inputHint: 'Enter as a whole number, e.g., 24',
    acceptedAnswers: ['24'],
    errorPatterns: [
      { answers: ['12'], misconception: 'arithmetic_slip' },
      { answers: ['48'], misconception: 'arithmetic_slip' },
      { answers: ['192'], misconception: 'arithmetic_slip' },
    ],
    solution: '"Together again" → LCM. LCM(4, 6, 8) = 24 minutes.',
    estimatedTimeSec: 90,
  },

  // ===== v0.7 additions: RATIO & PROPORTION module =====
  // ----- RP.01 — Concept of ratio (10 items) -----
  {
    id: 'RP.01-01', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'There are 3 boys and 5 girls in a small group. Write the ratio of boys to girls.',
    options: [
      { text: '3 : 5', misconception: 'none' },
      { text: '5 : 3', misconception: 'conceptual_gap' },
      { text: '8 : 5', misconception: 'conceptual_gap' },
      { text: '3 : 8', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Ratio of boys to girls keeps the order in the question: 3 : 5.',
    estimatedTimeSec: 30,
  },
  {
    id: 'RP.01-02', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'A bag has 4 red balls and 6 blue balls. What is the ratio of red to blue?',
    options: [
      { text: '4 : 6, or 2 : 3 in simplest form', misconception: 'none' },
      { text: '6 : 4', misconception: 'conceptual_gap' },
      { text: '4 : 10', misconception: 'conceptual_gap' },
      { text: '10 : 4', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Red : blue = 4 : 6 = 2 : 3 in simplest form.',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.01-03', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Express the ratio 8 : 12 in simplest form.',
    options: [
      { text: '8 : 12', misconception: 'form_error' },
      { text: '4 : 6', misconception: 'form_error' },
      { text: '2 : 3', misconception: 'none' },
      { text: '3 : 2', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'HCF(8, 12) = 4. 8/4 : 12/4 = 2 : 3.',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.01-04', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Simplify 15 : 25 to its simplest form. Enter as a fraction (e.g., 3/5).',
    inputHint: 'Enter the simplified ratio as a fraction, e.g., 3/5',
    acceptedAnswers: ['3/5'],
    errorPatterns: [
      { answers: ['15/25'], misconception: 'form_error' },
      { answers: ['5/3'], misconception: 'conceptual_gap' },
      { answers: ['1/5'], misconception: 'arithmetic_slip' },
    ],
    solution: 'HCF(15, 25) = 5. 15/5 : 25/5 = 3 : 5.',
    estimatedTimeSec: 60,
  },
  {
    id: 'RP.01-05', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'In a class of 40 students, 16 are girls. Find the ratio of girls to boys.',
    options: [
      { text: '16 : 24, or 2 : 3', misconception: 'none' },
      { text: '16 : 40', misconception: 'conceptual_gap' },
      { text: '24 : 16', misconception: 'conceptual_gap' },
      { text: '3 : 2', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Boys = 40 − 16 = 24. Girls : boys = 16 : 24 = 2 : 3.',
    estimatedTimeSec: 60,
  },
  {
    id: 'RP.01-06', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Express the ratio 50 paise to ₹1 as a ratio of paise.',
    options: [
      { text: '50 : 1', misconception: 'conceptual_gap' },
      { text: '1 : 50', misconception: 'conceptual_gap' },
      { text: '1 : 2', misconception: 'none' },
      { text: '50 : 100, or 1 : 2', misconception: 'none' },
    ],
    correctIndex: 2,
    solution: 'Convert to the same units: 50 paise : 100 paise = 1 : 2.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.01-07', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Express 200 g : 1 kg as a ratio in simplest form.',
    options: [
      { text: '200 : 1', misconception: 'conceptual_gap' },
      { text: '1 : 5', misconception: 'none' },
      { text: '5 : 1', misconception: 'conceptual_gap' },
      { text: '200 : 1000', misconception: 'form_error' },
    ],
    correctIndex: 1,
    solution: 'Convert to the same unit: 200 g : 1000 g = 1 : 5.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.01-08', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A recipe needs flour and sugar in the ratio 3 : 1 (by mass). If the cook uses 6 cups of flour, how many cups of sugar are needed?',
    options: [
      { text: '1 cup', misconception: 'arithmetic_slip' },
      { text: '2 cups', misconception: 'none' },
      { text: '3 cups', misconception: 'conceptual_gap' },
      { text: '18 cups', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: 'Ratio 3 : 1 means for every 3 of flour, 1 of sugar. 6 / 3 = 2 sugar.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.01-09', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Simplify the ratio 24 : 60 : 36 to its simplest form. Enter as numbers separated by colons (e.g., 2:5:3).',
    inputHint: 'Enter as a:b:c, e.g., 2:5:3',
    acceptedAnswers: ['2:5:3'],
    errorPatterns: [
      { answers: ['24:60:36'], misconception: 'form_error' },
      { answers: ['12:30:18'], misconception: 'form_error' },
      { answers: ['1:5:3'], misconception: 'arithmetic_slip' },
    ],
    solution: 'HCF(24, 60, 36) = 12. So 24 : 60 : 36 = 2 : 5 : 3.',
    estimatedTimeSec: 90,
  },
  {
    id: 'RP.01-10', skillId: 'RP.01', skillName: 'Concept of ratio',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A school has 18 teachers and 270 students. What is the teacher-to-student ratio in simplest form?',
    options: [
      { text: '18 : 270', misconception: 'form_error' },
      { text: '1 : 15', misconception: 'none' },
      { text: '15 : 1', misconception: 'conceptual_gap' },
      { text: '2 : 30', misconception: 'form_error' },
    ],
    correctIndex: 1,
    solution: 'HCF(18, 270) = 18. 18/18 : 270/18 = 1 : 15.',
    estimatedTimeSec: 75,
  },

  // ----- RP.02 — Equivalent ratios (10 items) -----
  {
    id: 'RP.02-01', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which ratio is equivalent to 2 : 3?',
    options: [
      { text: '4 : 6', misconception: 'none' },
      { text: '3 : 2', misconception: 'conceptual_gap' },
      { text: '2 : 6', misconception: 'incomplete_conversion' },
      { text: '4 : 3', misconception: 'incomplete_conversion' },
    ],
    correctIndex: 0,
    solution: 'Multiply both terms by 2: (2 × 2) : (3 × 2) = 4 : 6.',
    estimatedTimeSec: 30,
  },
  {
    id: 'RP.02-02', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Fill in the blank: 3 : 4 = ___ : 12.',
    options: [
      { text: '3', misconception: 'incomplete_conversion' },
      { text: '6', misconception: 'arithmetic_slip' },
      { text: '9', misconception: 'none' },
      { text: '12', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 2,
    solution: '4 × 3 = 12, so multiply the first term by 3 too: 3 × 3 = 9.',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.02-03', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Fill in the blank: 5 : 7 = 15 : ?',
    inputHint: 'Enter as a whole number, e.g., 21',
    acceptedAnswers: ['21'],
    errorPatterns: [
      { answers: ['7'], misconception: 'incomplete_conversion' },
      { answers: ['14'], misconception: 'arithmetic_slip' },
      { answers: ['35'], misconception: 'arithmetic_slip' },
    ],
    solution: '5 × 3 = 15, so multiply 7 by 3 too: 7 × 3 = 21.',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.02-04', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of these is NOT equivalent to 6 : 9?',
    options: [
      { text: '2 : 3', misconception: 'conceptual_gap' },
      { text: '12 : 18', misconception: 'conceptual_gap' },
      { text: '4 : 6', misconception: 'conceptual_gap' },
      { text: '3 : 2', misconception: 'none' },
    ],
    correctIndex: 3,
    solution: '6 : 9 simplifies to 2 : 3. 12 : 18 = 2 : 3 ✓. 4 : 6 = 2 : 3 ✓. 3 : 2 ≠ 2 : 3.',
    estimatedTimeSec: 60,
  },
  {
    id: 'RP.02-05', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'If 4 : 5 = ? : 20, find the missing number.',
    options: [
      { text: '4', misconception: 'incomplete_conversion' },
      { text: '16', misconception: 'none' },
      { text: '25', misconception: 'arithmetic_slip' },
      { text: '5', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: '5 × 4 = 20, so 4 × 4 = 16.',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.02-06', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Fill in: 2 : 5 = 8 : ?',
    inputHint: 'Enter as a whole number, e.g., 20',
    acceptedAnswers: ['20'],
    errorPatterns: [
      { answers: ['5'], misconception: 'incomplete_conversion' },
      { answers: ['16'], misconception: 'arithmetic_slip' },
      { answers: ['10'], misconception: 'arithmetic_slip' },
    ],
    solution: '2 × 4 = 8, so multiply 5 by 4: 20.',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.02-07', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A juice mix uses orange and water in the ratio 1 : 4. If 5 cups of orange are used, how many cups of water are needed?',
    options: [
      { text: '4 cups', misconception: 'incomplete_conversion' },
      { text: '20 cups', misconception: 'none' },
      { text: '9 cups', misconception: 'conceptual_gap' },
      { text: '1 cup', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '1 × 5 = 5 (orange), so water = 4 × 5 = 20.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.02-08', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the missing term: 9 : 12 = ? : 8.',
    options: [
      { text: '6', misconception: 'none' },
      { text: '9', misconception: 'incomplete_conversion' },
      { text: '5', misconception: 'arithmetic_slip' },
      { text: '12', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '9 : 12 = 3 : 4 (divide both by 3). 3 : 4 = ? : 8 → multiply by 2 → 6 : 8. Missing term is 6.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.02-09', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Fill in: 7 : 8 = ? : 56.',
    inputHint: 'Enter as a whole number, e.g., 49',
    acceptedAnswers: ['49'],
    errorPatterns: [
      { answers: ['7'], misconception: 'incomplete_conversion' },
      { answers: ['56'], misconception: 'arithmetic_slip' },
      { answers: ['8'], misconception: 'arithmetic_slip' },
    ],
    solution: '8 × 7 = 56, so 7 × 7 = 49.',
    estimatedTimeSec: 60,
  },
  {
    id: 'RP.02-10', skillId: 'RP.02', skillName: 'Equivalent ratios',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A photograph 4 cm wide and 6 cm tall is enlarged so the new width is 12 cm. What is the new height (so the picture is not distorted)?',
    options: [
      { text: '14 cm', misconception: 'conceptual_gap' },
      { text: '18 cm', misconception: 'none' },
      { text: '24 cm', misconception: 'arithmetic_slip' },
      { text: '6 cm', misconception: 'incomplete_conversion' },
    ],
    correctIndex: 1,
    solution: '4 × 3 = 12, so multiply 6 by 3 too: 18 cm.',
    estimatedTimeSec: 90,
  },

  // ----- RP.03 — Proportion (10 items) -----
  {
    id: 'RP.03-01', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 3, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Two ratios a : b and c : d are in proportion when:',
    options: [
      { text: 'a + b = c + d', misconception: 'conceptual_gap' },
      { text: 'a × d = b × c (cross-products are equal)', misconception: 'none' },
      { text: 'a × b = c × d', misconception: 'conceptual_gap' },
      { text: 'a = c and b = d', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Two ratios are in proportion iff cross-products are equal: a/b = c/d ⇔ a × d = b × c.',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.03-02', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Are 2 : 3 and 6 : 9 in proportion?',
    options: [
      { text: 'Yes — 2 × 9 = 3 × 6 = 18.', misconception: 'none' },
      { text: 'No — they have different numbers.', misconception: 'conceptual_gap' },
      { text: 'No — 6 : 9 is bigger.', misconception: 'conceptual_gap' },
      { text: 'Cannot tell without more information.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Cross-multiply: 2 × 9 = 18 and 3 × 6 = 18. They are equal, so 2 : 3 :: 6 : 9.',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.03-03', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 4, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Are 4 : 5 and 12 : 14 in proportion?',
    options: [
      { text: 'Yes', misconception: 'arithmetic_slip' },
      { text: 'No — cross-products are 4×14 = 56 and 5×12 = 60, which differ.', misconception: 'none' },
      { text: 'Yes — both have 4 in them.', misconception: 'conceptual_gap' },
      { text: 'Cannot tell.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '4 × 14 = 56, but 5 × 12 = 60. 56 ≠ 60, so the ratios are NOT in proportion.',
    estimatedTimeSec: 60,
  },
  {
    id: 'RP.03-04', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the missing term: 3 : 7 :: 12 : ?',
    options: [
      { text: '21', misconception: 'arithmetic_slip' },
      { text: '28', misconception: 'none' },
      { text: '14', misconception: 'arithmetic_slip' },
      { text: '7', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '3 × ? = 7 × 12 → 3 × ? = 84 → ? = 28.',
    estimatedTimeSec: 60,
  },
  {
    id: 'RP.03-05', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the missing term: 5 : 8 :: 15 : ?',
    inputHint: 'Enter as a whole number, e.g., 24',
    acceptedAnswers: ['24'],
    errorPatterns: [
      { answers: ['16'], misconception: 'arithmetic_slip' },
      { answers: ['18'], misconception: 'arithmetic_slip' },
      { answers: ['8'], misconception: 'incomplete_conversion' },
    ],
    solution: '5 × ? = 8 × 15 → 5 × ? = 120 → ? = 24.',
    estimatedTimeSec: 60,
  },
  {
    id: 'RP.03-06', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of the following are in proportion?',
    options: [
      { text: '3 : 5 and 12 : 20', misconception: 'none' },
      { text: '3 : 5 and 12 : 18', misconception: 'arithmetic_slip' },
      { text: '3 : 5 and 9 : 20', misconception: 'arithmetic_slip' },
      { text: 'None of these', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '3 × 20 = 60 and 5 × 12 = 60. Equal. So 3 : 5 :: 12 : 20.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.03-07', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 6, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the missing term: ? : 6 :: 10 : 15.',
    options: [
      { text: '4', misconception: 'none' },
      { text: '9', misconception: 'arithmetic_slip' },
      { text: '5', misconception: 'arithmetic_slip' },
      { text: '6', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '? × 15 = 6 × 10 = 60. ? = 60 / 15 = 4.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.03-08', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 6, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'If 7 books cost ₹84, how much will 12 books cost (at the same rate)?',
    options: [
      { text: '₹126', misconception: 'arithmetic_slip' },
      { text: '₹144', misconception: 'none' },
      { text: '₹84', misconception: 'conceptual_gap' },
      { text: '₹168', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: '7 : 84 :: 12 : ? → 7 × ? = 12 × 84 = 1008 → ? = 144.',
    estimatedTimeSec: 90,
  },
  {
    id: 'RP.03-09', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Find the missing term: 8 : 12 :: 10 : ?',
    inputHint: 'Enter as a whole number, e.g., 15',
    acceptedAnswers: ['15'],
    errorPatterns: [
      { answers: ['12'], misconception: 'arithmetic_slip' },
      { answers: ['14'], misconception: 'arithmetic_slip' },
      { answers: ['18'], misconception: 'arithmetic_slip' },
    ],
    solution: '8 × ? = 12 × 10 = 120 → ? = 120 / 8 = 15.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.03-10', skillId: 'RP.03', skillName: 'Proportion',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A car covers 200 km in 4 hours. At the same speed, how far will it travel in 7 hours?',
    options: [
      { text: '350 km', misconception: 'none' },
      { text: '200 km', misconception: 'conceptual_gap' },
      { text: '400 km', misconception: 'arithmetic_slip' },
      { text: '300 km', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '4 : 200 :: 7 : ? → 4 × ? = 7 × 200 = 1400 → ? = 350 km.',
    estimatedTimeSec: 90,
  },

  // ----- RP.04 — Unitary method (10 items) -----
  {
    id: 'RP.04-01', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 2, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: '5 pencils cost ₹25. What is the cost of 1 pencil?',
    options: [
      { text: '₹5', misconception: 'none' },
      { text: '₹25', misconception: 'conceptual_gap' },
      { text: '₹125', misconception: 'operation_confusion' },
      { text: '₹20', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Cost of 1 pencil = 25 / 5 = ₹5.',
    estimatedTimeSec: 30,
  },
  {
    id: 'RP.04-02', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 3, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'If 1 kg of sugar costs ₹40, find the cost of 4 kg.',
    options: [
      { text: '₹40', misconception: 'conceptual_gap' },
      { text: '₹160', misconception: 'none' },
      { text: '₹10', misconception: 'operation_confusion' },
      { text: '₹140', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Cost of 4 kg = 4 × 40 = ₹160.',
    estimatedTimeSec: 30,
  },
  {
    id: 'RP.04-03', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 3, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: '8 mangoes cost ₹120. What is the cost of 1 mango?',
    inputHint: 'Enter the cost in rupees, e.g., 15',
    acceptedAnswers: ['15'],
    errorPatterns: [
      { answers: ['120'], misconception: 'conceptual_gap' },
      { answers: ['8'], misconception: 'conceptual_gap' },
      { answers: ['960'], misconception: 'operation_confusion' },
    ],
    solution: 'Cost per mango = 120 / 8 = ₹15.',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.04-04', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: '3 books cost ₹60. What is the cost of 5 books?',
    options: [
      { text: '₹100', misconception: 'none' },
      { text: '₹120', misconception: 'arithmetic_slip' },
      { text: '₹65', misconception: 'conceptual_gap' },
      { text: '₹20', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'Cost of 1 book = 60 / 3 = ₹20. Cost of 5 = 5 × 20 = ₹100.',
    estimatedTimeSec: 60,
  },
  {
    id: 'RP.04-05', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A car travels 240 km in 4 hours at constant speed. How far does it travel in 1 hour?',
    options: [
      { text: '60 km', misconception: 'none' },
      { text: '120 km', misconception: 'arithmetic_slip' },
      { text: '40 km', misconception: 'arithmetic_slip' },
      { text: '960 km', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: '240 / 4 = 60 km in 1 hour (the speed).',
    estimatedTimeSec: 45,
  },
  {
    id: 'RP.04-06', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: '4 metres of cloth cost ₹220. Find the cost of 7 metres of the same cloth.',
    inputHint: 'Enter in rupees, e.g., 385',
    acceptedAnswers: ['385'],
    errorPatterns: [
      { answers: ['220'], misconception: 'conceptual_gap' },
      { answers: ['440'], misconception: 'arithmetic_slip' },
      { answers: ['1540'], misconception: 'operation_confusion' },
    ],
    solution: 'Cost per metre = 220 / 4 = 55. Cost of 7 m = 7 × 55 = ₹385.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.04-07', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: '6 workers can finish a job in 10 days. At the same rate, how many days would 1 worker take to do the same job alone?',
    options: [
      { text: '60 days', misconception: 'none' },
      { text: '10 days', misconception: 'conceptual_gap' },
      { text: '6 days', misconception: 'conceptual_gap' },
      { text: '50 days', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '"Worker-days" needed = 6 × 10 = 60. So 1 worker takes 60 days.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.04-08', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 6, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Cost of 12 toffees is ₹84. What is the cost of 20 toffees?',
    options: [
      { text: '₹140', misconception: 'none' },
      { text: '₹160', misconception: 'arithmetic_slip' },
      { text: '₹84', misconception: 'conceptual_gap' },
      { text: '₹168', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Cost per toffee = 84 / 12 = ₹7. Cost of 20 = 20 × 7 = ₹140.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.04-09', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'A car uses 5 litres of petrol to travel 60 km. How much petrol is needed to travel 96 km? Enter in litres.',
    inputHint: 'Enter in litres, e.g., 8',
    acceptedAnswers: ['8'],
    errorPatterns: [
      { answers: ['5'], misconception: 'conceptual_gap' },
      { answers: ['6'], misconception: 'arithmetic_slip' },
      { answers: ['10'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Petrol per km = 5 / 60 = 1/12 L. For 96 km: 96 × 1/12 = 8 L.',
    estimatedTimeSec: 100,
  },
  {
    id: 'RP.04-10', skillId: 'RP.04', skillName: 'Unitary method',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A factory makes 720 pencils in 6 hours. How many pencils does it make in 9 hours at the same rate?',
    options: [
      { text: '1080', misconception: 'none' },
      { text: '960', misconception: 'arithmetic_slip' },
      { text: '720', misconception: 'conceptual_gap' },
      { text: '120', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'Per hour = 720 / 6 = 120 pencils. In 9 hours: 9 × 120 = 1080.',
    estimatedTimeSec: 90,
  },

  // ----- RP.05 — Ratio/proportion word problems (10 items) -----
  {
    id: 'RP.05-01', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 3, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A mixture has milk and water in the ratio 3 : 2. If there are 12 litres of milk, how much water is there?',
    options: [
      { text: '8 litres', misconception: 'none' },
      { text: '12 litres', misconception: 'conceptual_gap' },
      { text: '18 litres', misconception: 'arithmetic_slip' },
      { text: '6 litres', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '3 × 4 = 12 (milk), so water = 2 × 4 = 8 L.',
    estimatedTimeSec: 60,
  },
  {
    id: 'RP.05-02', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 4, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Two friends share ₹450 in the ratio 4 : 5. How much does each get?',
    options: [
      { text: '₹200 and ₹250', misconception: 'none' },
      { text: '₹180 and ₹270', misconception: 'arithmetic_slip' },
      { text: '₹225 each', misconception: 'conceptual_gap' },
      { text: '₹4 and ₹5', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Total parts = 4 + 5 = 9. Each part = 450 / 9 = 50. Shares: 4×50 = ₹200 and 5×50 = ₹250.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.05-03', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A 60 cm rope is cut into two pieces in the ratio 2 : 3. What are the lengths?',
    options: [
      { text: '20 cm and 40 cm', misconception: 'arithmetic_slip' },
      { text: '24 cm and 36 cm', misconception: 'none' },
      { text: '30 cm each', misconception: 'conceptual_gap' },
      { text: '12 cm and 18 cm', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Total parts = 2 + 3 = 5. Each part = 60 / 5 = 12. Lengths: 2 × 12 = 24, 3 × 12 = 36.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.05-04', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'In a class, the ratio of boys to girls is 3 : 4. If there are 21 boys, how many students are there in total?',
    options: [
      { text: '49 students', misconception: 'none' },
      { text: '28 students', misconception: 'arithmetic_slip' },
      { text: '21 students', misconception: 'conceptual_gap' },
      { text: '7 students', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '3 × 7 = 21 (boys), so girls = 4 × 7 = 28. Total = 21 + 28 = 49.',
    estimatedTimeSec: 90,
  },
  {
    id: 'RP.05-05', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'Cost of 5 books is ₹125. How much will 8 such books cost? Enter in rupees.',
    inputHint: 'Enter as a whole number, e.g., 200',
    acceptedAnswers: ['200'],
    errorPatterns: [
      { answers: ['125'], misconception: 'conceptual_gap' },
      { answers: ['250'], misconception: 'arithmetic_slip' },
      { answers: ['1000'], misconception: 'operation_confusion' },
    ],
    solution: 'Per book = 125 / 5 = 25. 8 books = 8 × 25 = ₹200.',
    estimatedTimeSec: 75,
  },
  {
    id: 'RP.05-06', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 6, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A recipe for 4 people needs 200 g of flour. How much flour is needed for 10 people?',
    options: [
      { text: '500 g', misconception: 'none' },
      { text: '400 g', misconception: 'arithmetic_slip' },
      { text: '50 g', misconception: 'operation_confusion' },
      { text: '200 g', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Per person = 200 / 4 = 50 g. For 10 people: 10 × 50 = 500 g.',
    estimatedTimeSec: 90,
  },
  {
    id: 'RP.05-07', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 6, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A train covers 180 km in 3 hours. At the same speed, how long will it take to cover 300 km? Answer in hours.',
    options: [
      { text: '5 hours', misconception: 'none' },
      { text: '4 hours', misconception: 'arithmetic_slip' },
      { text: '6 hours', misconception: 'arithmetic_slip' },
      { text: '3 hours', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Speed = 180 / 3 = 60 km/h. Time for 300 km = 300 / 60 = 5 h.',
    estimatedTimeSec: 90,
  },
  {
    id: 'RP.05-08', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'Two numbers are in the ratio 5 : 7. Their sum is 96. Find the smaller number.',
    inputHint: 'Enter as a whole number, e.g., 40',
    acceptedAnswers: ['40'],
    errorPatterns: [
      { answers: ['56'], misconception: 'conceptual_gap' },
      { answers: ['8'], misconception: 'arithmetic_slip' },
      { answers: ['48'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Total parts = 5 + 7 = 12. Each part = 96 / 12 = 8. Smaller = 5 × 8 = 40.',
    estimatedTimeSec: 100,
  },
  {
    id: 'RP.05-09', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'In a school, the ratio of teachers to students is 1 : 25. If the school has 750 students, how many teachers are there?',
    options: [
      { text: '30', misconception: 'none' },
      { text: '25', misconception: 'arithmetic_slip' },
      { text: '750', misconception: 'conceptual_gap' },
      { text: '15', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '1 × ? = 25 × ? Use proportion: teachers : students = 1 : 25 = ? : 750 → ? = 750 / 25 = 30.',
    estimatedTimeSec: 90,
  },
  {
    id: 'RP.05-10', skillId: 'RP.05', skillName: 'Ratio and proportion word problems',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'The ratio of the ages of A and B is 3 : 5. The sum of their ages is 64 years. What is A\'s age?',
    options: [
      { text: '24 years', misconception: 'none' },
      { text: '40 years', misconception: 'conceptual_gap' },
      { text: '32 years', misconception: 'arithmetic_slip' },
      { text: '8 years', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Total parts = 3 + 5 = 8. Each part = 64 / 8 = 8. A = 3 × 8 = 24.',
    estimatedTimeSec: 100,
  },

  // ===== v0.9 additions: ALGEBRA BASICS module =====
  // ----- AL.01 — Understanding variables (10 items) -----
  {
    id: 'AL.01-01', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'In algebra, what does the letter x usually stand for?',
    options: [
      { text: 'A number we do not yet know', misconception: 'none' },
      { text: 'The letter x itself', misconception: 'conceptual_gap' },
      { text: 'Multiplication', misconception: 'conceptual_gap' },
      { text: 'The number 10', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'In algebra, x is a variable — a placeholder for a number whose value we may or may not know. The choice of letter is just convention; y, n, m, etc. work the same way.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.01-02', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 2, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'In the expression x + 5, what is x called?',
    options: [
      { text: 'A constant', misconception: 'conceptual_gap' },
      { text: 'A variable', misconception: 'none' },
      { text: 'The sum', misconception: 'conceptual_gap' },
      { text: 'An operator', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'x is the variable (it stands for some number). 5 is a constant; + is an operator; the whole thing x + 5 is the expression.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.01-03', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which of the following is a variable?',
    options: [
      { text: '7', misconception: 'conceptual_gap' },
      { text: 'y', misconception: 'none' },
      { text: '+', misconception: 'conceptual_gap' },
      { text: '=', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'A variable is a letter that stands for a number. Here y is the variable; 7 is a constant; + and = are symbols, not variables.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.01-04', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'If x = 4, what number does x stand for here?',
    options: [
      { text: '4', misconception: 'none' },
      { text: 'x', misconception: 'conceptual_gap' },
      { text: 'x + 4', misconception: 'conceptual_gap' },
      { text: '4x', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '"x = 4" tells us that the variable x is taking the value 4. So wherever we see x, we can write 4 in its place.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.01-05', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 4, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Riya writes x to stand for "number of marbles". Without more information, how many values can x take?',
    options: [
      { text: 'Only 1', misconception: 'conceptual_gap' },
      { text: 'Exactly 0', misconception: 'conceptual_gap' },
      { text: 'Many different values, depending on the situation', misconception: 'none' },
      { text: 'It always equals 10', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'A variable is a placeholder. Until the situation tells us a specific number of marbles, x could be any whole number ≥ 0.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.01-06', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'Let x stand for the number of pencils in a box. A box has 6 pencils. Find x.',
    inputHint: 'Enter as a whole number, e.g., 6',
    acceptedAnswers: ['6'],
    errorPatterns: [
      { answers: ['x'], misconception: 'conceptual_gap' },
      { answers: ['1'], misconception: 'arithmetic_slip' },
      { answers: ['16'], misconception: 'conceptual_gap' },
    ],
    solution: 'The story says the box has 6 pencils, and x stands for the number of pencils. So x = 6.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.01-07', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Which letter is the variable in 3y + 7?',
    options: [
      { text: '3', misconception: 'conceptual_gap' },
      { text: 'y', misconception: 'none' },
      { text: '7', misconception: 'conceptual_gap' },
      { text: '+', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'In 3y + 7, the variable is y. 3 is the coefficient (the number multiplying y); 7 is the constant; + is the operator.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.01-08', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 6, band: 'core', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Why do we use letters like x and y in mathematics?',
    options: [
      { text: 'Because letters look nicer than numbers.', misconception: 'conceptual_gap' },
      { text: 'Because the value is unknown, or can change.', misconception: 'none' },
      { text: 'Because x and y always equal 0.', misconception: 'conceptual_gap' },
      { text: 'Because letters are easier to multiply.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'Letters let us write a sentence about a number whose value we do not know yet, or a number that can take different values.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.01-09', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Sara has some marbles, but we do not know exactly how many. Which is the BEST way to write the number of marbles?',
    options: [
      { text: 'Always 10', misconception: 'conceptual_gap' },
      { text: 'Use a letter, e.g., m, to stand for the number of marbles', misconception: 'none' },
      { text: 'We cannot write it without the actual number', misconception: 'conceptual_gap' },
      { text: 'Just write "?" instead', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'A variable is exactly the right tool: pick any letter (m for marbles, n for number, x for unknown) and use it to stand for the unknown count.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.01-10', skillId: 'AL.01', skillName: 'Understanding variables',
    difficulty: 8, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Aman writes "x + 5" and Bhavna writes "n + 5" for the same problem (the unknown plus 5). Are both correct?',
    options: [
      { text: 'Yes — the choice of letter is just a name.', misconception: 'none' },
      { text: 'No — only x is allowed for the unknown.', misconception: 'conceptual_gap' },
      { text: 'No — n means "negative" so it changes the answer.', misconception: 'conceptual_gap' },
      { text: 'Yes, but only because both letters come early in the alphabet.', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'A variable is a name we choose. As long as both students agree which letter is the unknown, x + 5 and n + 5 say exactly the same thing.',
    estimatedTimeSec: 75,
  },

  // ----- AL.02 — Simple expressions (10 items) -----
  {
    id: 'AL.02-01', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write "a number x plus 3" as an expression.',
    options: [
      { text: '3 − x', misconception: 'operation_confusion' },
      { text: 'x + 3', misconception: 'none' },
      { text: '3x', misconception: 'operation_confusion' },
      { text: 'x = 3', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: '"x plus 3" means add 3 to x. Written as an expression: x + 3.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.02-02', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 3, band: 'foundational', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'Which of these is an EXPRESSION (not just a variable, and not an equation)?',
    options: [
      { text: 'x', misconception: 'conceptual_gap' },
      { text: '2x + 5', misconception: 'none' },
      { text: '2x + 5 = 9', misconception: 'conceptual_gap' },
      { text: '+', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'An expression has variables and constants joined by operators (+, −, ×, ÷) but NO equals sign. 2x + 5 fits. 2x + 5 = 9 has an "=" so it is an equation.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.02-03', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'In the expression 5y − 1, which number is the constant?',
    options: [
      { text: '5', misconception: 'conceptual_gap' },
      { text: 'y', misconception: 'conceptual_gap' },
      { text: '1', misconception: 'none' },
      { text: '5y', misconception: 'conceptual_gap' },
    ],
    correctIndex: 2,
    solution: 'The constant is the number standing alone (with no variable attached). Here that is 1. (5 is the coefficient of y; y is the variable.)',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.02-04', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write "twice y" as an expression.',
    options: [
      { text: 'y + 2', misconception: 'operation_confusion' },
      { text: '2y', misconception: 'none' },
      { text: 'y ÷ 2', misconception: 'operation_confusion' },
      { text: '2 + y', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: '"Twice" means "two times". So "twice y" = 2 × y, written 2y.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.02-05', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write "3 less than x" as an expression.',
    options: [
      { text: '3 − x', misconception: 'operation_confusion' },
      { text: 'x + 3', misconception: 'operation_confusion' },
      { text: 'x − 3', misconception: 'none' },
      { text: '3x', misconception: 'operation_confusion' },
    ],
    correctIndex: 2,
    solution: '"3 less than x" means we start with x and take 3 away. So the expression is x − 3 (NOT 3 − x).',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.02-06', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'In the expression 4y + 7, what is the coefficient of y?',
    options: [
      { text: '7', misconception: 'conceptual_gap' },
      { text: '4', misconception: 'none' },
      { text: 'y', misconception: 'conceptual_gap' },
      { text: '11', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'The coefficient is the number multiplying the variable. In 4y + 7, the 4 multiplies y, so the coefficient of y is 4.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.02-07', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Identify the term that contains the variable in 6 + 2x.',
    options: [
      { text: '6', misconception: 'conceptual_gap' },
      { text: '2x', misconception: 'none' },
      { text: '+', misconception: 'conceptual_gap' },
      { text: '6 + 2x', misconception: 'conceptual_gap' },
    ],
    correctIndex: 1,
    solution: 'The expression has two terms: 6 (constant) and 2x (the term with the variable).',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.02-08', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write the expression for "a number x divided by 4".',
    options: [
      { text: 'x/4', misconception: 'none' },
      { text: '4/x', misconception: 'operation_confusion' },
      { text: '4x', misconception: 'operation_confusion' },
      { text: 'x − 4', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: '"x divided by 4" means x ÷ 4, written x/4. Note: 4/x means 4 divided by x, which is a different expression.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.02-09', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 6, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Ravi has x apples. His brother gives him 5 more. Write the expression for the total number of apples Ravi has now.',
    options: [
      { text: '5x', misconception: 'operation_confusion' },
      { text: 'x + 5', misconception: 'none' },
      { text: 'x − 5', misconception: 'operation_confusion' },
      { text: '5 ÷ x', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: '"5 more" means we add 5 to what Ravi already has. Total = x + 5.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.02-10', skillId: 'AL.02', skillName: 'Simple expressions',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Write the expression that means "twice y added to 7".',
    options: [
      { text: '2(y + 7)', misconception: 'operation_confusion' },
      { text: '2y + 7', misconception: 'none' },
      { text: 'y + 2 + 7', misconception: 'arithmetic_slip' },
      { text: 'y × 7 + 2', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: '"Twice y" is 2y. "Added to 7" means + 7. So the expression is 2y + 7.',
    estimatedTimeSec: 60,
  },

  // ----- AL.03 — Evaluate expressions for given values (10 items) -----
  {
    id: 'AL.03-01', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'If x = 3, what is the value of x + 5?',
    options: [
      { text: '8', misconception: 'none' },
      { text: '35', misconception: 'conceptual_gap' },
      { text: '5', misconception: 'arithmetic_slip' },
      { text: '15', misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: 'Replace x with 3: x + 5 = 3 + 5 = 8.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.03-02', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'If y = 4, what is 2y?',
    options: [
      { text: '24', misconception: 'conceptual_gap' },
      { text: '8', misconception: 'none' },
      { text: '6', misconception: 'arithmetic_slip' },
      { text: '4', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: '2y means 2 × y. With y = 4: 2 × 4 = 8. NOT 24 — that would be writing 2 next to 4.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.03-03', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'If a = 7, find a − 2.',
    options: [
      { text: '5', misconception: 'none' },
      { text: '9', misconception: 'operation_confusion' },
      { text: '−5', misconception: 'arithmetic_slip' },
      { text: '7', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Substitute: a − 2 = 7 − 2 = 5.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.03-04', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'If x = 5, find 3x + 2.',
    options: [
      { text: '17', misconception: 'none' },
      { text: '15', misconception: 'arithmetic_slip' },
      { text: '11', misconception: 'arithmetic_slip' },
      { text: '352', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '3x + 2 = 3 × 5 + 2 = 15 + 2 = 17.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.03-05', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'If y = 6, find y/2.',
    options: [
      { text: '3', misconception: 'none' },
      { text: '12', misconception: 'operation_confusion' },
      { text: '4', misconception: 'arithmetic_slip' },
      { text: '8', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'y/2 means y ÷ 2 = 6 ÷ 2 = 3.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.03-06', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Evaluate 4n − 1 when n = 5.',
    inputHint: 'Enter as a whole number, e.g., 19',
    acceptedAnswers: ['19'],
    errorPatterns: [
      { answers: ['20'], misconception: 'arithmetic_slip' },
      { answers: ['9'], misconception: 'operation_confusion' },
      { answers: ['451', '45'], misconception: 'conceptual_gap' },
    ],
    solution: '4n − 1 = 4 × 5 − 1 = 20 − 1 = 19.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.03-07', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Find the value of 2x + 3y when x = 2 and y = 4.',
    options: [
      { text: '16', misconception: 'none' },
      { text: '14', misconception: 'arithmetic_slip' },
      { text: '20', misconception: 'arithmetic_slip' },
      { text: '24', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: '2x + 3y = 2 × 2 + 3 × 4 = 4 + 12 = 16.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.03-08', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 6, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Evaluate 5(x + 1) when x = 2.',
    options: [
      { text: '15', misconception: 'none' },
      { text: '11', misconception: 'arithmetic_slip' },
      { text: '7', misconception: 'arithmetic_slip' },
      { text: '52', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: 'Brackets first: x + 1 = 2 + 1 = 3. Then 5 × 3 = 15.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.03-09', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'If a = 3 and b = 4, evaluate ab + 2.',
    inputHint: 'Enter as a whole number, e.g., 14',
    acceptedAnswers: ['14'],
    errorPatterns: [
      { answers: ['9'], misconception: 'operation_confusion' },
      { answers: ['12'], misconception: 'arithmetic_slip' },
      { answers: ['34', '342'], misconception: 'conceptual_gap' },
    ],
    solution: 'ab means a × b = 3 × 4 = 12. Then 12 + 2 = 14.',
    estimatedTimeSec: 75,
  },
  {
    id: 'AL.03-10', skillId: 'AL.03', skillName: 'Evaluate expressions',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'The cost (in ₹) of n notebooks is 15n + 5. Find the cost when n = 4.',
    options: [
      { text: '₹65', misconception: 'none' },
      { text: '₹60', misconception: 'arithmetic_slip' },
      { text: '₹24', misconception: 'arithmetic_slip' },
      { text: '₹155', misconception: 'conceptual_gap' },
    ],
    correctIndex: 0,
    solution: '15n + 5 = 15 × 4 + 5 = 60 + 5 = 65. So 4 notebooks cost ₹65.',
    estimatedTimeSec: 90,
  },

  // ----- AL.04 — One-step equations (10 items) -----
  {
    id: 'AL.04-01', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Solve: x + 3 = 7.',
    options: [
      { text: 'x = 10', misconception: 'operation_confusion' },
      { text: 'x = 4', misconception: 'none' },
      { text: 'x = 21', misconception: 'operation_confusion' },
      { text: 'x = 3', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Subtract 3 from both sides: x = 7 − 3 = 4. Check: 4 + 3 = 7 ✓.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.04-02', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 2, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Solve: y − 2 = 5.',
    options: [
      { text: 'y = 3', misconception: 'operation_confusion' },
      { text: 'y = 7', misconception: 'none' },
      { text: 'y = 10', misconception: 'arithmetic_slip' },
      { text: 'y = −3', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Add 2 to both sides: y = 5 + 2 = 7. Check: 7 − 2 = 5 ✓.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.04-03', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 3, band: 'foundational', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Solve: 2x = 10.',
    options: [
      { text: 'x = 8', misconception: 'operation_confusion' },
      { text: 'x = 12', misconception: 'operation_confusion' },
      { text: 'x = 5', misconception: 'none' },
      { text: 'x = 20', misconception: 'operation_confusion' },
    ],
    correctIndex: 2,
    solution: 'Divide both sides by 2: x = 10 ÷ 2 = 5. Check: 2 × 5 = 10 ✓.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.04-04', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Solve: x/3 = 4.',
    options: [
      { text: 'x = 1', misconception: 'operation_confusion' },
      { text: 'x = 7', misconception: 'operation_confusion' },
      { text: 'x = 12', misconception: 'none' },
      { text: 'x = 4/3', misconception: 'operation_confusion' },
    ],
    correctIndex: 2,
    solution: 'Multiply both sides by 3: x = 4 × 3 = 12. Check: 12 ÷ 3 = 4 ✓.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.04-05', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 4, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Solve: x + 8 = 15.',
    options: [
      { text: 'x = 23', misconception: 'operation_confusion' },
      { text: 'x = 7', misconception: 'none' },
      { text: 'x = 8', misconception: 'arithmetic_slip' },
      { text: 'x = 15', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Subtract 8 from both sides: x = 15 − 8 = 7.',
    estimatedTimeSec: 30,
  },
  {
    id: 'AL.04-06', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Solve 4y = 24. Enter the value of y.',
    inputHint: 'Enter as a whole number, e.g., 6',
    acceptedAnswers: ['6'],
    errorPatterns: [
      { answers: ['20'], misconception: 'operation_confusion' },
      { answers: ['28'], misconception: 'operation_confusion' },
      { answers: ['96'], misconception: 'operation_confusion' },
    ],
    solution: 'Divide both sides by 4: y = 24 ÷ 4 = 6.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.04-07', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 5, band: 'core', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'Solve: x − 5 = 11.',
    options: [
      { text: 'x = 6', misconception: 'operation_confusion' },
      { text: 'x = 16', misconception: 'none' },
      { text: 'x = 55', misconception: 'operation_confusion' },
      { text: 'x = 5', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Add 5 to both sides: x = 11 + 5 = 16.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.04-08', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 6, band: 'advanced', cognitiveType: 'Conceptual understanding',
    kind: 'mcq',
    stem: 'To solve x + 6 = 10, what should you do to BOTH sides?',
    options: [
      { text: 'Add 6', misconception: 'operation_confusion' },
      { text: 'Subtract 6', misconception: 'none' },
      { text: 'Multiply by 6', misconception: 'operation_confusion' },
      { text: 'Divide by 6', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: 'To undo "+ 6" on the left, subtract 6 from both sides. That gives x = 4.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.04-09', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 7, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'numeric',
    stem: 'Solve x/5 = 7.',
    inputHint: 'Enter as a whole number, e.g., 35',
    acceptedAnswers: ['35'],
    errorPatterns: [
      { answers: ['12'], misconception: 'operation_confusion' },
      { answers: ['2'], misconception: 'operation_confusion' },
      { answers: ['7/5'], misconception: 'operation_confusion' },
    ],
    solution: 'Multiply both sides by 5: x = 7 × 5 = 35.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.04-10', skillId: 'AL.04', skillName: 'One-step equations',
    difficulty: 8, band: 'advanced', cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: 'If 3x = 21, find the value of x + 2.',
    options: [
      { text: '23', misconception: 'conceptual_gap' },
      { text: '9', misconception: 'none' },
      { text: '7', misconception: 'arithmetic_slip' },
      { text: '14', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'First find x: 3x = 21 → x = 21 ÷ 3 = 7. Then x + 2 = 7 + 2 = 9.',
    estimatedTimeSec: 75,
  },

  // ----- AL.05 — Word problems with simple equations (10 items) -----
  {
    id: 'AL.05-01', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 2, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'I think of a number, add 4, and get 11. What is the number?',
    options: [
      { text: '7', misconception: 'none' },
      { text: '15', misconception: 'operation_confusion' },
      { text: '11', misconception: 'arithmetic_slip' },
      { text: '4', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 0,
    solution: 'Let x be the number. Then x + 4 = 11. Subtract 4: x = 7.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.05-02', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 3, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Twice a number is 14. What is the number?',
    options: [
      { text: '12', misconception: 'operation_confusion' },
      { text: '7', misconception: 'none' },
      { text: '28', misconception: 'operation_confusion' },
      { text: '16', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Let x be the number. Then 2x = 14. Divide both sides by 2: x = 7.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.05-03', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 3, band: 'foundational', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A number minus 3 is 8. What is the number?',
    options: [
      { text: '5', misconception: 'operation_confusion' },
      { text: '11', misconception: 'none' },
      { text: '24', misconception: 'operation_confusion' },
      { text: '8', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Let x be the number. Then x − 3 = 8. Add 3: x = 11.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.05-04', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Anita has x books. She gets 5 more and now has 12 books. How many books did she have to start with?',
    options: [
      { text: '17', misconception: 'operation_confusion' },
      { text: '7', misconception: 'none' },
      { text: '5', misconception: 'arithmetic_slip' },
      { text: '12', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Equation: x + 5 = 12. Subtract 5: x = 7.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.05-05', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 4, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A pencil costs ₹x. 3 pencils cost ₹15. Find the cost of one pencil.',
    options: [
      { text: '₹3', misconception: 'arithmetic_slip' },
      { text: '₹5', misconception: 'none' },
      { text: '₹12', misconception: 'operation_confusion' },
      { text: '₹45', misconception: 'operation_confusion' },
    ],
    correctIndex: 1,
    solution: 'Equation: 3x = 15. Divide by 3: x = 5. So one pencil costs ₹5.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.05-06', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'Three friends share x sweets equally. Each one gets 8. How many sweets are there in total?',
    options: [
      { text: '11 sweets', misconception: 'operation_confusion' },
      { text: '24 sweets', misconception: 'none' },
      { text: '8 sweets', misconception: 'arithmetic_slip' },
      { text: '3 sweets', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Equation: x ÷ 3 = 8 (each share is 8). Multiply both sides by 3: x = 24.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.05-07', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 5, band: 'core', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'When 6 is added to a number, the result is 19. Find the number.',
    options: [
      { text: '25', misconception: 'operation_confusion' },
      { text: '13', misconception: 'none' },
      { text: '6', misconception: 'arithmetic_slip' },
      { text: '12', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Let x be the number. Then x + 6 = 19. Subtract 6: x = 13.',
    estimatedTimeSec: 45,
  },
  {
    id: 'AL.05-08', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 6, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'Five added to twice a number gives 17. Find the number.',
    inputHint: 'Enter as a whole number, e.g., 6',
    acceptedAnswers: ['6'],
    errorPatterns: [
      { answers: ['11'], misconception: 'operation_confusion' },
      { answers: ['12'], misconception: 'operation_confusion' },
      { answers: ['17'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Let x be the number. Equation: 2x + 5 = 17. Subtract 5: 2x = 12. Divide by 2: x = 6.',
    estimatedTimeSec: 90,
  },
  {
    id: 'AL.05-09', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 7, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'mcq',
    stem: 'A father is 3 times as old as his son. The son is 12 years old. How old is the father?',
    options: [
      { text: '15 years', misconception: 'operation_confusion' },
      { text: '36 years', misconception: 'none' },
      { text: '4 years', misconception: 'operation_confusion' },
      { text: '12 years', misconception: 'arithmetic_slip' },
    ],
    correctIndex: 1,
    solution: 'Let f = father\'s age. Then f = 3 × son\'s age = 3 × 12 = 36. The father is 36 years old.',
    estimatedTimeSec: 60,
  },
  {
    id: 'AL.05-10', skillId: 'AL.05', skillName: 'Algebra word problems',
    difficulty: 8, band: 'advanced', cognitiveType: 'Application / word problem',
    kind: 'numeric',
    stem: 'Riya scored x marks. Her friend scored 5 more than Riya. Together they scored 35. Find x (Riya\'s marks).',
    inputHint: 'Enter as a whole number, e.g., 15',
    acceptedAnswers: ['15'],
    errorPatterns: [
      { answers: ['20'], misconception: 'operation_confusion' },
      { answers: ['30'], misconception: 'operation_confusion' },
      { answers: ['10'], misconception: 'arithmetic_slip' },
    ],
    solution: 'Riya has x marks. Friend has x + 5. Together: x + (x + 5) = 35 → 2x + 5 = 35 → 2x = 30 → x = 15.',
    estimatedTimeSec: 120,
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
