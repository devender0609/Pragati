// v0.35 — "Full" Math coverage for Class 11 (senior secondary).
//
// PROTOTYPE STARTER content. Not CBSE- or NCERT-verified, not reviewed
// by a subject-matter teacher, not calibrated. All modules and skills
// registered as `teacher_review_required`.
//
// Structure:
//   - Existing 2 modules from v0.29 + v0.31 (Sets, Functions, Trig
//     identities, Complex, GP sum, Line slope)
//   - This file adds 8 more modules × 3 skills × 4 items = 96 items
//     covering the remaining Class 11 NCERT chapters:
//       Ch 2  Relations & Functions ext
//       Ch 3  Trigonometric Functions
//       Ch 6  Linear Inequalities
//       Ch 7  Permutations and Combinations
//       Ch 8  Binomial Theorem
//       Ch 11 Conic Sections
//       Ch 13 Limits and Derivatives
//       Ch 16 Probability

import type { Item } from './items';

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
    estimatedTimeSec: args.estimatedTimeSec ?? 45,
  } as Item;
}

// Chapter 2: Relations and Functions extended
const G11_M3: Item[] = [
  mcq({ id: 'G11.07-01', skillId: 'G11.07', skillName: 'Cartesian product of sets', difficulty: 3, band: 'foundational',
    stem: 'A = {1,2}, B = {3,4}. A × B has how many elements?', correct: '4', wrong: ['2', '6', '8'],
    solution: '|A × B| = |A| × |B| = 2 × 2 = 4.' }),
  mcq({ id: 'G11.07-02', skillId: 'G11.07', skillName: 'Cartesian product of sets', difficulty: 4, band: 'foundational',
    stem: 'A = {a}, B = {1, 2, 3}. A × B = ?', correct: '{(a,1), (a,2), (a,3)}', wrong: ['{a, 1, 2, 3}', '{(1,a), (2,a), (3,a)}', '{}'],
    solution: 'Ordered pairs (a in A, b in B).' }),
  mcq({ id: 'G11.07-03', skillId: 'G11.07', skillName: 'Cartesian product of sets', difficulty: 6, band: 'core',
    stem: 'If |A × B| = 12 and |A| = 3, then |B| =', correct: '4', wrong: ['9', '12', '36'],
    solution: '|A| × |B| = 12; 3 × |B| = 12; |B| = 4.' }),
  mcq({ id: 'G11.07-04', skillId: 'G11.07', skillName: 'Cartesian product of sets', difficulty: 7, band: 'advanced',
    stem: 'A × B = B × A holds when:', correct: 'A = B', wrong: ['|A| = |B|', 'Always', 'Never'],
    solution: 'Cartesian product is not commutative unless the sets are equal.' }),

  mcq({ id: 'G11.08-01', skillId: 'G11.08', skillName: 'Relations vs functions', difficulty: 3, band: 'foundational',
    stem: 'A function assigns:', correct: 'Exactly one output to each input', wrong: ['One or more outputs per input', 'One input per output', 'No specific rule'],
    solution: 'Each input has exactly one output (functionality condition).' }),
  mcq({ id: 'G11.08-02', skillId: 'G11.08', skillName: 'Relations vs functions', difficulty: 4, band: 'foundational',
    stem: 'Is {(1,2), (2,3), (1,4)} a function?', correct: 'No — input 1 maps to two outputs', wrong: ['Yes', 'Only for x = 2', 'Depends on domain'],
    solution: 'Input 1 has outputs 2 AND 4 — violates the functionality condition.' }),
  mcq({ id: 'G11.08-03', skillId: 'G11.08', skillName: 'Relations vs functions', difficulty: 6, band: 'core',
    stem: 'Domain of f(x) = √x is:', correct: 'x ≥ 0 (all non-negative reals)', wrong: ['All reals', 'x > 0', 'x ≠ 0'],
    solution: 'Real square root requires non-negative argument.' }),
  mcq({ id: 'G11.08-04', skillId: 'G11.08', skillName: 'Relations vs functions', difficulty: 7, band: 'advanced',
    stem: 'Range of f(x) = x² for x in R is:', correct: '[0, ∞)', wrong: ['(-∞, ∞)', '(0, ∞)', '(-∞, 0]'],
    solution: 'x² is always ≥ 0 and takes every non-negative value.' }),

  mcq({ id: 'G11.09-01', skillId: 'G11.09', skillName: 'Composition of functions', difficulty: 4, band: 'foundational',
    stem: 'f(x) = x + 1, g(x) = 2x. (f ∘ g)(3) = ?', correct: '7', wrong: ['8', '4', '6'],
    solution: 'g(3) = 6; f(6) = 7.' }),
  mcq({ id: 'G11.09-02', skillId: 'G11.09', skillName: 'Composition of functions', difficulty: 5, band: 'foundational',
    stem: 'f(x) = 2x, g(x) = x + 1. (g ∘ f)(2) = ?', correct: '5', wrong: ['6', '4', '3'],
    solution: 'f(2) = 4; g(4) = 4 + 1 = 5.' }),
  mcq({ id: 'G11.09-03', skillId: 'G11.09', skillName: 'Composition of functions', difficulty: 6, band: 'core',
    stem: 'In general, (f ∘ g)(x) and (g ∘ f)(x):', correct: 'Are usually different', wrong: ['Are always the same', 'Are always inverses', 'Always equal x'],
    solution: 'Composition is not commutative in general.' }),
  mcq({ id: 'G11.09-04', skillId: 'G11.09', skillName: 'Composition of functions', difficulty: 7, band: 'advanced',
    stem: 'For f(x) = 3x + 1, f⁻¹(x) = ?', correct: '(x − 1)/3', wrong: ['3x − 1', '(1 − x)/3', '1/(3x + 1)'],
    solution: 'Solve y = 3x + 1 for x → x = (y − 1)/3.' }),
];

// Chapter 3: Trigonometric Functions
const G11_M4: Item[] = [
  mcq({ id: 'G11.10-01', skillId: 'G11.10', skillName: 'Radian and degree measure', difficulty: 3, band: 'foundational',
    stem: '180° in radians:', correct: 'π', wrong: ['π/2', '2π', '180'],
    solution: 'π radians = 180°.' }),
  mcq({ id: 'G11.10-02', skillId: 'G11.10', skillName: 'Radian and degree measure', difficulty: 4, band: 'foundational',
    stem: '90° in radians:', correct: 'π/2', wrong: ['π', 'π/4', '2π'],
    solution: '90° = (π/180)·90 = π/2.' }),
  mcq({ id: 'G11.10-03', skillId: 'G11.10', skillName: 'Radian and degree measure', difficulty: 6, band: 'core',
    stem: 'π/3 radians in degrees:', correct: '60°', wrong: ['30°', '45°', '90°'],
    solution: '(180/π)·(π/3) = 60°.' }),
  mcq({ id: 'G11.10-04', skillId: 'G11.10', skillName: 'Radian and degree measure', difficulty: 7, band: 'advanced',
    stem: 'Arc length s = ?', correct: 'r · θ (with θ in radians)', wrong: ['r · θ (with θ in degrees)', 'r + θ', 'r / θ'],
    solution: 'Standard arc-length formula requires θ in radians.' }),

  mcq({ id: 'G11.11-01', skillId: 'G11.11', skillName: 'Trigonometric function values', difficulty: 3, band: 'foundational',
    stem: 'sin(π/6) = ?', correct: '1/2', wrong: ['√3/2', '1/√2', '1'],
    solution: 'Standard value at 30°.' }),
  mcq({ id: 'G11.11-02', skillId: 'G11.11', skillName: 'Trigonometric function values', difficulty: 4, band: 'foundational',
    stem: 'cos(π/4) = ?', correct: '1/√2', wrong: ['1/2', '√3/2', '1'],
    solution: 'Standard value at 45°.' }),
  mcq({ id: 'G11.11-03', skillId: 'G11.11', skillName: 'Trigonometric function values', difficulty: 6, band: 'core',
    stem: 'tan(π/3) = ?', correct: '√3', wrong: ['1', '1/√3', '√2'],
    solution: 'tan(60°) = sin/cos = (√3/2)/(1/2) = √3.' }),
  mcq({ id: 'G11.11-04', skillId: 'G11.11', skillName: 'Trigonometric function values', difficulty: 7, band: 'advanced',
    stem: 'sin(π) = ?', correct: '0', wrong: ['1', '-1', '1/2'],
    solution: 'sin(180°) = 0.' }),

  mcq({ id: 'G11.12-01', skillId: 'G11.12', skillName: 'Sum and difference formulas', difficulty: 5, band: 'foundational',
    stem: 'sin(A + B) = ?', correct: 'sin A cos B + cos A sin B', wrong: ['sin A + sin B', 'sin A cos B - cos A sin B', 'cos A cos B'],
    solution: 'Standard sum formula for sine.' }),
  mcq({ id: 'G11.12-02', skillId: 'G11.12', skillName: 'Sum and difference formulas', difficulty: 5, band: 'foundational',
    stem: 'cos(A + B) = ?', correct: 'cos A cos B − sin A sin B', wrong: ['cos A cos B + sin A sin B', 'cos A + cos B', 'sin A cos B + cos A sin B'],
    solution: 'Standard sum formula for cosine.' }),
  mcq({ id: 'G11.12-03', skillId: 'G11.12', skillName: 'Sum and difference formulas', difficulty: 6, band: 'core',
    stem: 'sin(2A) = ?', correct: '2 sin A cos A', wrong: ['2 sin A', 'sin²A − cos²A', 'sin A + cos A'],
    solution: 'Double-angle identity: sin 2A = 2 sin A cos A.' }),
  mcq({ id: 'G11.12-04', skillId: 'G11.12', skillName: 'Sum and difference formulas', difficulty: 8, band: 'advanced',
    stem: 'cos(2A) = ?', correct: 'cos²A − sin²A (or 2cos²A − 1 or 1 − 2sin²A)', wrong: ['2 cos A', 'sin²A + cos²A', 'cos²A + sin²A'],
    solution: 'Three equivalent double-angle forms.' }),
];

// Chapter 6: Linear Inequalities
const G11_M5: Item[] = [
  mcq({ id: 'G11.13-01', skillId: 'G11.13', skillName: 'Solving linear inequalities in one variable', difficulty: 3, band: 'foundational',
    stem: 'Solve: x + 5 > 8', correct: 'x > 3', wrong: ['x > 13', 'x < 3', 'x = 3'],
    solution: 'Subtract 5 from both sides: x > 3.' }),
  mcq({ id: 'G11.13-02', skillId: 'G11.13', skillName: 'Solving linear inequalities in one variable', difficulty: 4, band: 'foundational',
    stem: 'Solve: 2x ≤ 10', correct: 'x ≤ 5', wrong: ['x ≥ 5', 'x ≤ 20', 'x < 5'],
    solution: 'Divide by 2 (positive, so inequality direction stays): x ≤ 5.' }),
  mcq({ id: 'G11.13-03', skillId: 'G11.13', skillName: 'Solving linear inequalities in one variable', difficulty: 6, band: 'core',
    stem: 'Solve: −3x > 12', correct: 'x < −4', wrong: ['x > −4', 'x > 4', 'x < 4'],
    solution: 'Divide by −3 (negative — flip inequality): x < −4.' }),
  mcq({ id: 'G11.13-04', skillId: 'G11.13', skillName: 'Solving linear inequalities in one variable', difficulty: 7, band: 'advanced',
    stem: 'When multiplying an inequality by a negative number, the inequality sign:', correct: 'Flips direction', wrong: ['Stays the same', 'Becomes equality', 'Disappears'],
    solution: 'Rule: negative multiplier ⇒ flip.' }),

  mcq({ id: 'G11.14-01', skillId: 'G11.14', skillName: 'Graphing solutions of inequalities', difficulty: 4, band: 'foundational',
    stem: 'The solution x ≥ 2 on a number line uses:', correct: 'A filled circle at 2 with shading to the right', wrong: ['An open circle at 2 with shading right', 'A filled circle at 2 with shading left', 'Just the point 2'],
    solution: '≥ uses a filled circle (inclusive) with shading in the ≥ direction.' }),
  mcq({ id: 'G11.14-02', skillId: 'G11.14', skillName: 'Graphing solutions of inequalities', difficulty: 5, band: 'foundational',
    stem: 'x < 3 uses:', correct: 'An open circle at 3 with shading to the left', wrong: ['A filled circle at 3', 'Two open circles', 'Just the point 3'],
    solution: '< is strict, uses open circle; shade toward smaller values.' }),
  mcq({ id: 'G11.14-03', skillId: 'G11.14', skillName: 'Graphing solutions of inequalities', difficulty: 7, band: 'core',
    stem: 'The compound inequality 1 < x ≤ 4 graphs as:', correct: 'Open circle at 1, filled circle at 4, shaded between', wrong: ['Two open circles', 'Two filled circles', 'Only two isolated points'],
    solution: '< is open, ≤ is filled; the region in between is shaded.' }),
  mcq({ id: 'G11.14-04', skillId: 'G11.14', skillName: 'Graphing solutions of inequalities', difficulty: 8, band: 'advanced',
    stem: 'For 2x + y ≤ 6 in the plane, the solution is:', correct: 'The line 2x + y = 6 plus the half-plane below/left', wrong: ['Just the line', 'The half-plane above/right', 'A single point'],
    solution: 'A linear inequality in two variables defines a half-plane (test the origin to find which side).' }),

  mcq({ id: 'G11.15-01', skillId: 'G11.15', skillName: 'Word problems with inequalities', difficulty: 5, band: 'foundational',
    stem: 'A student needs at least 40 to pass. They have 25. What must they score more (x)?', correct: 'x ≥ 15', wrong: ['x > 15', 'x ≤ 15', 'x = 15'],
    solution: '25 + x ≥ 40 → x ≥ 15.' }),
  mcq({ id: 'G11.15-02', skillId: 'G11.15', skillName: 'Word problems with inequalities', difficulty: 6, band: 'foundational',
    stem: 'A car uses at most 8 L per 100 km. For 250 km, fuel use x satisfies:', correct: 'x ≤ 20', wrong: ['x ≥ 20', 'x < 8', 'x ≥ 8'],
    solution: '(8/100)·250 = 20; use is at most 20 L.' }),
  mcq({ id: 'G11.15-03', skillId: 'G11.15', skillName: 'Word problems with inequalities', difficulty: 7, band: 'core',
    stem: 'A rectangle has length twice its width. If perimeter ≤ 30, width w satisfies:', correct: 'w ≤ 5', wrong: ['w ≤ 10', 'w ≤ 15', 'w ≥ 5'],
    solution: 'Perimeter = 6w ≤ 30 → w ≤ 5.' }),
  mcq({ id: 'G11.15-04', skillId: 'G11.15', skillName: 'Word problems with inequalities', difficulty: 8, band: 'advanced',
    stem: 'A pen costs ₹8; a notebook ₹12. Total spending on p pens and n notebooks is at most ₹100:', correct: '8p + 12n ≤ 100', wrong: ['8p + 12n = 100', '8p + 12n ≥ 100', 'p + n ≤ 100'],
    solution: 'Set up the inequality directly.' }),
];

// Chapter 7: Permutations and Combinations
const G11_M6: Item[] = [
  mcq({ id: 'G11.16-01', skillId: 'G11.16', skillName: 'Counting principle', difficulty: 3, band: 'foundational',
    stem: 'You have 3 shirts and 4 trousers. Total outfits:', correct: '12', wrong: ['7', '9', '16'],
    solution: 'Multiplication principle: 3 × 4 = 12.' }),
  mcq({ id: 'G11.16-02', skillId: 'G11.16', skillName: 'Counting principle', difficulty: 4, band: 'foundational',
    stem: 'How many 2-digit numbers can be formed from digits 1–5 (with repetition)?', correct: '25', wrong: ['10', '20', '30'],
    solution: '5 choices for each of 2 places: 5 × 5 = 25.' }),
  mcq({ id: 'G11.16-03', skillId: 'G11.16', skillName: 'Counting principle', difficulty: 6, band: 'core',
    stem: '3-letter code using letters A–D, no repetition:', correct: '24', wrong: ['12', '64', '81'],
    solution: '4 × 3 × 2 = 24.' }),
  mcq({ id: 'G11.16-04', skillId: 'G11.16', skillName: 'Counting principle', difficulty: 7, band: 'advanced',
    stem: 'Number of ways to seat 5 people in a row:', correct: '120', wrong: ['25', '60', '720'],
    solution: '5! = 120.' }),

  mcq({ id: 'G11.17-01', skillId: 'G11.17', skillName: 'Permutations', difficulty: 4, band: 'foundational',
    stem: 'P(5, 2) = ?', correct: '20', wrong: ['10', '25', '60'],
    solution: '5! / (5−2)! = 5 · 4 = 20.' }),
  mcq({ id: 'G11.17-02', skillId: 'G11.17', skillName: 'Permutations', difficulty: 5, band: 'foundational',
    stem: 'Number of arrangements of letters in "MATH":', correct: '24', wrong: ['4', '12', '16'],
    solution: '4! = 24 (all letters distinct).' }),
  mcq({ id: 'G11.17-03', skillId: 'G11.17', skillName: 'Permutations', difficulty: 6, band: 'core',
    stem: 'Arrangements of letters in "MOOD" (repeated O):', correct: '12', wrong: ['24', '6', '4'],
    solution: '4! / 2! = 12 (divide by repeated Os).' }),
  mcq({ id: 'G11.17-04', skillId: 'G11.17', skillName: 'Permutations', difficulty: 8, band: 'advanced',
    stem: 'Number of arrangements of "MISSISSIPPI":', correct: '11! / (4! · 4! · 2!)', wrong: ['11!', '4! · 4! · 2!', '10!'],
    solution: '11 letters; 4 I, 4 S, 2 P, 1 M. Divide by factorial of each repeat.' }),

  mcq({ id: 'G11.18-01', skillId: 'G11.18', skillName: 'Combinations', difficulty: 4, band: 'foundational',
    stem: 'C(5, 2) = ?', correct: '10', wrong: ['20', '25', '5'],
    solution: '5! / (2! · 3!) = 10.' }),
  mcq({ id: 'G11.18-02', skillId: 'G11.18', skillName: 'Combinations', difficulty: 5, band: 'foundational',
    stem: 'Committee of 3 from 6 people:', correct: '20', wrong: ['6', '18', '120'],
    solution: 'C(6, 3) = 20.' }),
  mcq({ id: 'G11.18-03', skillId: 'G11.18', skillName: 'Combinations', difficulty: 6, band: 'core',
    stem: 'C(n, 0) = ?', correct: '1', wrong: ['0', 'n', 'n!'],
    solution: 'By convention 0! = 1, so C(n, 0) = n! / (0! · n!) = 1.' }),
  mcq({ id: 'G11.18-04', skillId: 'G11.18', skillName: 'Combinations', difficulty: 8, band: 'advanced',
    stem: 'C(n, r) = C(n, n − r) because:', correct: 'Choosing r to include = choosing n − r to leave out', wrong: ['Random coincidence', 'Only for small r', 'Factorials cancel'],
    solution: 'Combinatorial identity — same result by symmetric selection.' }),
];

// Chapter 8: Binomial Theorem
const G11_M7: Item[] = [
  mcq({ id: 'G11.19-01', skillId: 'G11.19', skillName: 'Binomial expansion', difficulty: 4, band: 'foundational',
    stem: '(a + b)² = ?', correct: 'a² + 2ab + b²', wrong: ['a² + b²', 'a² − 2ab + b²', '(a + b)²'],
    solution: 'Standard square identity.' }),
  mcq({ id: 'G11.19-02', skillId: 'G11.19', skillName: 'Binomial expansion', difficulty: 5, band: 'foundational',
    stem: '(a + b)³ = ?', correct: 'a³ + 3a²b + 3ab² + b³', wrong: ['a³ + b³', 'a³ + 3ab + b³', '3(a + b)'],
    solution: 'Cube expansion by binomial theorem.' }),
  mcq({ id: 'G11.19-03', skillId: 'G11.19', skillName: 'Binomial expansion', difficulty: 7, band: 'core',
    stem: 'Number of terms in (a + b)ⁿ:', correct: 'n + 1', wrong: ['n', '2n', 'n²'],
    solution: 'Powers of b run from 0 to n → n + 1 terms.' }),
  mcq({ id: 'G11.19-04', skillId: 'G11.19', skillName: 'Binomial expansion', difficulty: 8, band: 'advanced',
    stem: 'Coefficient of a²b² in (a + b)⁴:', correct: '6', wrong: ['4', '8', '12'],
    solution: 'C(4, 2) = 6.' }),

  mcq({ id: 'G11.20-01', skillId: 'G11.20', skillName: 'General term', difficulty: 5, band: 'foundational',
    stem: 'General term T_(r+1) in (a + b)ⁿ:', correct: 'C(n, r) a^(n−r) b^r', wrong: ['C(n, r) a^r b^(n−r)', 'C(r, n) a b', 'n · r · a^r'],
    solution: 'Standard binomial general-term formula.' }),
  mcq({ id: 'G11.20-02', skillId: 'G11.20', skillName: 'General term', difficulty: 6, band: 'foundational',
    stem: 'T₃ (third term) in (x + 1)⁴:', correct: '6x²', wrong: ['4x²', '4x³', 'x²'],
    solution: 'T₃ = C(4, 2) x² · 1² = 6x².' }),
  mcq({ id: 'G11.20-03', skillId: 'G11.20', skillName: 'General term', difficulty: 7, band: 'core',
    stem: 'Middle term of (a + b)⁶:', correct: 'T₄ = 20 a³b³', wrong: ['T₃', 'T₅', 'There is no middle term'],
    solution: 'For n = 6 (even), middle term = (n/2 + 1) = T₄ = C(6,3) a³b³ = 20a³b³.' }),
  mcq({ id: 'G11.20-04', skillId: 'G11.20', skillName: 'General term', difficulty: 8, band: 'advanced',
    stem: 'Sum of coefficients in (a + b)ⁿ, evaluated at a = b = 1:', correct: '2ⁿ', wrong: ['n', '2n', 'n²'],
    solution: 'Put a = b = 1: (1 + 1)ⁿ = 2ⁿ.' }),

  mcq({ id: 'G11.21-01', skillId: 'G11.21', skillName: "Pascal's triangle", difficulty: 4, band: 'foundational',
    stem: "Row 4 of Pascal's triangle (n = 4):", correct: '1, 4, 6, 4, 1', wrong: ['1, 3, 3, 1', '1, 4, 4, 1', '1, 5, 10, 10, 5, 1'],
    solution: 'Row 4 has 5 entries = C(4, 0..4).' }),
  mcq({ id: 'G11.21-02', skillId: 'G11.21', skillName: "Pascal's triangle", difficulty: 5, band: 'foundational',
    stem: 'Each interior entry in Pascal\'s triangle is:', correct: 'Sum of the two entries directly above it', wrong: ['Product of the two above', 'Half the sum above', 'Just 1'],
    solution: "Pascal's recurrence: C(n, r) = C(n−1, r−1) + C(n−1, r)." }),
  mcq({ id: 'G11.21-03', skillId: 'G11.21', skillName: "Pascal's triangle", difficulty: 6, band: 'core',
    stem: 'C(5, 2) equals which entry in row 5?', correct: 'The third entry (10)', wrong: ['The second entry', 'The last entry', 'Not present'],
    solution: 'Row 5: 1, 5, 10, 10, 5, 1. Third entry = 10 = C(5, 2).' }),
  mcq({ id: 'G11.21-04', skillId: 'G11.21', skillName: "Pascal's triangle", difficulty: 7, band: 'advanced',
    stem: 'Sum of the entries in row n of Pascal\'s triangle:', correct: '2ⁿ', wrong: ['n', 'n²', '2n'],
    solution: 'Total = ΣC(n, r) = 2ⁿ.' }),
];

// Chapter 11: Conic Sections
const G11_M8: Item[] = [
  mcq({ id: 'G11.22-01', skillId: 'G11.22', skillName: 'Circle equations', difficulty: 4, band: 'foundational',
    stem: 'Standard equation of a circle centred at origin, radius r:', correct: 'x² + y² = r²', wrong: ['x + y = r', 'x² + y² = r', '(x + y)² = r²'],
    solution: 'Standard circle equation.' }),
  mcq({ id: 'G11.22-02', skillId: 'G11.22', skillName: 'Circle equations', difficulty: 5, band: 'foundational',
    stem: 'Circle centred at (h, k) with radius r:', correct: '(x − h)² + (y − k)² = r²', wrong: ['(x + h)² + (y + k)² = r²', 'x² + y² = h + k + r', '(x − h)(y − k) = r'],
    solution: 'General centre-radius form.' }),
  mcq({ id: 'G11.22-03', skillId: 'G11.22', skillName: 'Circle equations', difficulty: 6, band: 'core',
    stem: 'Radius of x² + y² = 25:', correct: '5', wrong: ['25', '√25', 'Nothing (not a circle)'],
    solution: 'r² = 25 → r = 5.' }),
  mcq({ id: 'G11.22-04', skillId: 'G11.22', skillName: 'Circle equations', difficulty: 7, band: 'advanced',
    stem: 'Centre of (x − 3)² + (y + 4)² = 9:', correct: '(3, −4)', wrong: ['(−3, 4)', '(3, 4)', '(9, 9)'],
    solution: 'Read directly from the form (x − h)² + (y − k)² = r²: (h, k) = (3, −4).' }),

  mcq({ id: 'G11.23-01', skillId: 'G11.23', skillName: 'Parabola', difficulty: 4, band: 'foundational',
    stem: 'Standard equation of a parabola opening to the right:', correct: 'y² = 4ax', wrong: ['x² = 4ay', 'y = x²', 'x² + y² = a²'],
    solution: 'y² = 4ax opens right (positive a).' }),
  mcq({ id: 'G11.23-02', skillId: 'G11.23', skillName: 'Parabola', difficulty: 5, band: 'foundational',
    stem: 'For y² = 4ax, the focus is at:', correct: '(a, 0)', wrong: ['(0, a)', '(0, 0)', '(2a, 0)'],
    solution: 'Focus is at distance a from vertex along the axis.' }),
  mcq({ id: 'G11.23-03', skillId: 'G11.23', skillName: 'Parabola', difficulty: 6, band: 'core',
    stem: 'For y² = 16x, value of a:', correct: '4', wrong: ['16', '8', '2'],
    solution: '4a = 16 → a = 4.' }),
  mcq({ id: 'G11.23-04', skillId: 'G11.23', skillName: 'Parabola', difficulty: 8, band: 'advanced',
    stem: 'Directrix of y² = 4ax:', correct: 'x = −a', wrong: ['x = a', 'y = a', 'y = −a'],
    solution: 'Directrix is perpendicular to axis at distance a on opposite side of focus.' }),

  mcq({ id: 'G11.24-01', skillId: 'G11.24', skillName: 'Ellipse and hyperbola basics', difficulty: 5, band: 'foundational',
    stem: 'Standard equation of an ellipse:', correct: 'x²/a² + y²/b² = 1', wrong: ['x²/a² − y²/b² = 1', 'x² + y² = a² + b²', 'x²·y² = ab'],
    solution: 'Standard ellipse in Cartesian form.' }),
  mcq({ id: 'G11.24-02', skillId: 'G11.24', skillName: 'Ellipse and hyperbola basics', difficulty: 6, band: 'foundational',
    stem: 'Standard equation of a hyperbola:', correct: 'x²/a² − y²/b² = 1', wrong: ['x²/a² + y²/b² = 1', 'x² + y² = 0', 'x²·y² = 1'],
    solution: 'Difference of squares form.' }),
  mcq({ id: 'G11.24-03', skillId: 'G11.24', skillName: 'Ellipse and hyperbola basics', difficulty: 7, band: 'core',
    stem: 'An ellipse with a = b becomes a:', correct: 'Circle', wrong: ['Straight line', 'Parabola', 'Point'],
    solution: 'Equal semi-major and semi-minor axes → circle.' }),
  mcq({ id: 'G11.24-04', skillId: 'G11.24', skillName: 'Ellipse and hyperbola basics', difficulty: 8, band: 'advanced',
    stem: 'Sum of distances from any point on an ellipse to the two foci is:', correct: 'Constant, equal to 2a', wrong: ['Variable', '2b', 'a + b'],
    solution: 'Definition of an ellipse: sum of focal distances = 2a.' }),
];

// Chapter 13: Limits and Derivatives
const G11_M9: Item[] = [
  mcq({ id: 'G11.25-01', skillId: 'G11.25', skillName: 'Concept of limit', difficulty: 4, band: 'foundational',
    stem: 'lim_(x→2) (x + 3) = ?', correct: '5', wrong: ['0', 'Does not exist', '2'],
    solution: 'Direct substitution: 2 + 3 = 5.' }),
  mcq({ id: 'G11.25-02', skillId: 'G11.25', skillName: 'Concept of limit', difficulty: 5, band: 'foundational',
    stem: 'lim_(x→0) sin(x)/x = ?', correct: '1', wrong: ['0', 'Does not exist', 'x'],
    solution: 'Classic limit.' }),
  mcq({ id: 'G11.25-03', skillId: 'G11.25', skillName: 'Concept of limit', difficulty: 6, band: 'core',
    stem: 'lim_(x→2) (x² − 4)/(x − 2) = ?', correct: '4', wrong: ['0', '2', 'Undefined'],
    solution: 'Factor: (x + 2)(x − 2)/(x − 2) = x + 2 → 4 as x → 2.' }),
  mcq({ id: 'G11.25-04', skillId: 'G11.25', skillName: 'Concept of limit', difficulty: 8, band: 'advanced',
    stem: 'lim_(x→∞) (1 + 1/x)^x = ?', correct: 'e', wrong: ['1', '∞', '2'],
    solution: 'Definition of e.' }),

  mcq({ id: 'G11.26-01', skillId: 'G11.26', skillName: 'Derivative as a limit', difficulty: 5, band: 'foundational',
    stem: 'Definition of derivative:', correct: "f'(x) = lim_(h→0) [f(x + h) − f(x)] / h", wrong: ["f'(x) = f(x) / x", "f'(x) = f(x + 1) − f(x)", "f'(x) = ∫f(x) dx"],
    solution: 'Standard first-principles definition.' }),
  mcq({ id: 'G11.26-02', skillId: 'G11.26', skillName: 'Derivative as a limit', difficulty: 6, band: 'foundational',
    stem: 'd/dx (x²) using first principles:', correct: '2x', wrong: ['x', '2', 'x²'],
    solution: 'lim_(h→0) [(x + h)² − x²]/h = lim [2xh + h²]/h = 2x + h → 2x.' }),
  mcq({ id: 'G11.26-03', skillId: 'G11.26', skillName: 'Derivative as a limit', difficulty: 7, band: 'core',
    stem: 'd/dx (constant c) = ?', correct: '0', wrong: ['c', '1', 'x'],
    solution: 'Rate of change of a constant is 0.' }),
  mcq({ id: 'G11.26-04', skillId: 'G11.26', skillName: 'Derivative as a limit', difficulty: 8, band: 'advanced',
    stem: 'd/dx (sin x) = ?', correct: 'cos x', wrong: ['-cos x', 'sin x', 'tan x'],
    solution: 'Standard derivative from first principles using sin(x + h) expansion.' }),

  mcq({ id: 'G11.27-01', skillId: 'G11.27', skillName: 'Derivative rules', difficulty: 4, band: 'foundational',
    stem: 'd/dx (x^n) = ?', correct: 'n · x^(n−1)', wrong: ['x^(n−1)', 'n · x^n', 'x^n / n'],
    solution: 'Power rule.' }),
  mcq({ id: 'G11.27-02', skillId: 'G11.27', skillName: 'Derivative rules', difficulty: 5, band: 'foundational',
    stem: 'd/dx (5x³) = ?', correct: '15x²', wrong: ['5x²', '15x³', '3x²'],
    solution: '5 · 3x² = 15x².' }),
  mcq({ id: 'G11.27-03', skillId: 'G11.27', skillName: 'Derivative rules', difficulty: 6, band: 'core',
    stem: 'd/dx (2x² + 3x + 1) = ?', correct: '4x + 3', wrong: ['2x + 3', '4x + 3 + 1', '2x'],
    solution: 'Term by term: 4x + 3 + 0.' }),
  mcq({ id: 'G11.27-04', skillId: 'G11.27', skillName: 'Derivative rules', difficulty: 7, band: 'advanced',
    stem: 'd/dx (uv) — product rule:', correct: "u'v + uv'", wrong: ["u'v'", 'uv', "u' + v'"],
    solution: 'Product rule.' }),
];

// Chapter 16: Probability
const G11_M10: Item[] = [
  mcq({ id: 'G11.28-01', skillId: 'G11.28', skillName: 'Axiomatic probability', difficulty: 4, band: 'foundational',
    stem: 'The probability of any event is:', correct: 'Between 0 and 1 inclusive', wrong: ['Between -1 and 1', 'Always positive', 'Any real number'],
    solution: 'Axiom: 0 ≤ P(E) ≤ 1.' }),
  mcq({ id: 'G11.28-02', skillId: 'G11.28', skillName: 'Axiomatic probability', difficulty: 5, band: 'foundational',
    stem: 'The probability of the sample space is:', correct: '1', wrong: ['0', 'Depends on the size', '0.5'],
    solution: 'P(Ω) = 1 (certain event).' }),
  mcq({ id: 'G11.28-03', skillId: 'G11.28', skillName: 'Axiomatic probability', difficulty: 6, band: 'core',
    stem: 'Two events A, B are mutually exclusive if:', correct: 'A ∩ B = ∅', wrong: ['A ∪ B = ∅', 'P(A) = P(B)', 'They are independent'],
    solution: 'Mutually exclusive ↔ empty intersection.' }),
  mcq({ id: 'G11.28-04', skillId: 'G11.28', skillName: 'Axiomatic probability', difficulty: 7, band: 'advanced',
    stem: 'For mutually exclusive A, B: P(A ∪ B) = ?', correct: 'P(A) + P(B)', wrong: ['P(A) · P(B)', 'P(A) + P(B) − P(A ∩ B)', '1 − P(A) − P(B)'],
    solution: 'Additivity for mutually exclusive events.' }),

  mcq({ id: 'G11.29-01', skillId: 'G11.29', skillName: 'Addition rule of probability', difficulty: 5, band: 'foundational',
    stem: 'General addition rule: P(A ∪ B) = ?', correct: 'P(A) + P(B) − P(A ∩ B)', wrong: ['P(A) + P(B)', 'P(A) · P(B)', 'P(A) − P(B)'],
    solution: 'Inclusion-exclusion for two events.' }),
  mcq({ id: 'G11.29-02', skillId: 'G11.29', skillName: 'Addition rule of probability', difficulty: 6, band: 'foundational',
    stem: 'P(A) = 0.6, P(B) = 0.3, P(A ∩ B) = 0.1. P(A ∪ B) = ?', correct: '0.8', wrong: ['0.9', '0.4', '0.7'],
    solution: '0.6 + 0.3 − 0.1 = 0.8.' }),
  mcq({ id: 'G11.29-03', skillId: 'G11.29', skillName: 'Addition rule of probability', difficulty: 7, band: 'core',
    stem: 'Complementary probability: P(not A) = ?', correct: '1 − P(A)', wrong: ['P(A) − 1', '−P(A)', '1'],
    solution: 'Sum of P(A) and P(not A) is 1.' }),
  mcq({ id: 'G11.29-04', skillId: 'G11.29', skillName: 'Addition rule of probability', difficulty: 8, band: 'advanced',
    stem: 'A card is drawn from a standard deck. P(King or Heart):', correct: '16/52 = 4/13', wrong: ['17/52', '13/52', '4/52'],
    solution: '4 kings + 13 hearts − 1 king of hearts = 16.' }),

  mcq({ id: 'G11.30-01', skillId: 'G11.30', skillName: 'Sample spaces and events', difficulty: 4, band: 'foundational',
    stem: 'Sample space when two dice are rolled:', correct: '36 ordered pairs', wrong: ['12', '6', '11'],
    solution: '6 × 6 = 36.' }),
  mcq({ id: 'G11.30-02', skillId: 'G11.30', skillName: 'Sample spaces and events', difficulty: 5, band: 'foundational',
    stem: 'An event is:', correct: 'A subset of the sample space', wrong: ['A single outcome only', 'A probability value', 'A random number'],
    solution: 'Event = any subset of the sample space.' }),
  mcq({ id: 'G11.30-03', skillId: 'G11.30', skillName: 'Sample spaces and events', difficulty: 6, band: 'core',
    stem: 'For two dice, P(sum = 7):', correct: '6/36 = 1/6', wrong: ['5/36', '7/36', '1/36'],
    solution: '6 combinations sum to 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1).' }),
  mcq({ id: 'G11.30-04', skillId: 'G11.30', skillName: 'Sample spaces and events', difficulty: 8, band: 'advanced',
    stem: 'P(at least one head) when 3 coins are tossed:', correct: '7/8', wrong: ['1/8', '3/8', '1/2'],
    solution: 'P(none) = P(TTT) = 1/8. P(at least one) = 1 − 1/8 = 7/8.' }),
];

// ---------------------------------------------------------------------------
// Public exports
// ---------------------------------------------------------------------------
export const FULL_GRADE_ITEMS_G11: Item[] = [
  ...G11_M3, ...G11_M4, ...G11_M5, ...G11_M6, ...G11_M7, ...G11_M8, ...G11_M9, ...G11_M10,
];

export type FullGradeModuleMetaG11 = {
  gradeId: string;
  moduleSlug: string;
  moduleTitle: string;
  moduleDescription: string;
  displayOrder: number;
  skills: Array<{ legacyId: string; displayLabel: string; shortLabel: string }>;
};

export const FULL_GRADE_META_G11: FullGradeModuleMetaG11[] = [
  { gradeId: 'grade_11', moduleSlug: 'relations_functions_ext', moduleTitle: 'Relations and Functions extended (Class 11 · Ch 2)', moduleDescription: 'Cartesian product, relations vs functions, composition. Prototype content, teacher review required.', displayOrder: 2,
    skills: [{ legacyId: 'G11.07', displayLabel: 'Cartesian product of sets', shortLabel: 'G11.07 — Cartesian ×' },
             { legacyId: 'G11.08', displayLabel: 'Relations vs functions', shortLabel: 'G11.08 — Relations/fns' },
             { legacyId: 'G11.09', displayLabel: 'Composition of functions', shortLabel: 'G11.09 — Composition' }] },
  { gradeId: 'grade_11', moduleSlug: 'trig_functions', moduleTitle: 'Trigonometric Functions (Class 11 · Ch 3)', moduleDescription: 'Radian/degree, standard values, sum/difference and double-angle formulas. Prototype content, teacher review required.', displayOrder: 3,
    skills: [{ legacyId: 'G11.10', displayLabel: 'Radian and degree measure', shortLabel: 'G11.10 — Radian/deg' },
             { legacyId: 'G11.11', displayLabel: 'Trigonometric function values', shortLabel: 'G11.11 — Trig values' },
             { legacyId: 'G11.12', displayLabel: 'Sum and difference formulas', shortLabel: 'G11.12 — Sum/diff' }] },
  { gradeId: 'grade_11', moduleSlug: 'linear_inequalities', moduleTitle: 'Linear Inequalities (Class 11 · Ch 6)', moduleDescription: 'Solving inequalities, graphing solutions, word problems. Prototype content, teacher review required.', displayOrder: 4,
    skills: [{ legacyId: 'G11.13', displayLabel: 'Solving linear inequalities in one variable', shortLabel: 'G11.13 — Inequalities' },
             { legacyId: 'G11.14', displayLabel: 'Graphing solutions of inequalities', shortLabel: 'G11.14 — Graphing' },
             { legacyId: 'G11.15', displayLabel: 'Word problems with inequalities', shortLabel: 'G11.15 — Word problems' }] },
  { gradeId: 'grade_11', moduleSlug: 'permutations_combinations', moduleTitle: 'Permutations and Combinations (Class 11 · Ch 7)', moduleDescription: 'Counting principle, permutations, combinations. Prototype content, teacher review required.', displayOrder: 5,
    skills: [{ legacyId: 'G11.16', displayLabel: 'Counting principle', shortLabel: 'G11.16 — Counting' },
             { legacyId: 'G11.17', displayLabel: 'Permutations', shortLabel: 'G11.17 — Permutations' },
             { legacyId: 'G11.18', displayLabel: 'Combinations', shortLabel: 'G11.18 — Combinations' }] },
  { gradeId: 'grade_11', moduleSlug: 'binomial_theorem', moduleTitle: 'Binomial Theorem (Class 11 · Ch 8)', moduleDescription: "Binomial expansion, general term, Pascal's triangle. Prototype content, teacher review required.", displayOrder: 6,
    skills: [{ legacyId: 'G11.19', displayLabel: 'Binomial expansion', shortLabel: 'G11.19 — Binomial exp' },
             { legacyId: 'G11.20', displayLabel: 'General term', shortLabel: 'G11.20 — General term' },
             { legacyId: 'G11.21', displayLabel: "Pascal's triangle", shortLabel: "G11.21 — Pascal's" }] },
  { gradeId: 'grade_11', moduleSlug: 'conic_sections', moduleTitle: 'Conic Sections (Class 11 · Ch 11)', moduleDescription: 'Circle equations, parabola, ellipse and hyperbola basics. Prototype content, teacher review required.', displayOrder: 7,
    skills: [{ legacyId: 'G11.22', displayLabel: 'Circle equations', shortLabel: 'G11.22 — Circles' },
             { legacyId: 'G11.23', displayLabel: 'Parabola', shortLabel: 'G11.23 — Parabola' },
             { legacyId: 'G11.24', displayLabel: 'Ellipse and hyperbola basics', shortLabel: 'G11.24 — Ellipse/hyp' }] },
  { gradeId: 'grade_11', moduleSlug: 'limits_derivatives', moduleTitle: 'Limits and Derivatives (Class 11 · Ch 13)', moduleDescription: 'Concept of limit, derivative as a limit, derivative rules. Prototype content, teacher review required.', displayOrder: 8,
    skills: [{ legacyId: 'G11.25', displayLabel: 'Concept of limit', shortLabel: 'G11.25 — Limits' },
             { legacyId: 'G11.26', displayLabel: 'Derivative as a limit', shortLabel: 'G11.26 — Derivative' },
             { legacyId: 'G11.27', displayLabel: 'Derivative rules', shortLabel: 'G11.27 — Rules' }] },
  { gradeId: 'grade_11', moduleSlug: 'probability', moduleTitle: 'Probability (Class 11 · Ch 16)', moduleDescription: 'Axiomatic probability, addition rule, sample spaces and events. Prototype content, teacher review required.', displayOrder: 9,
    skills: [{ legacyId: 'G11.28', displayLabel: 'Axiomatic probability', shortLabel: 'G11.28 — Axiomatic' },
             { legacyId: 'G11.29', displayLabel: 'Addition rule of probability', shortLabel: 'G11.29 — Addition rule' },
             { legacyId: 'G11.30', displayLabel: 'Sample spaces and events', shortLabel: 'G11.30 — Sample space' }] },
];
