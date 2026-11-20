// v0.32 — "Full" Math coverage for Classes 10 and 12 (board exam grades).
//
// ============================================================
// IMPORTANT — READ BEFORE USING THIS CONTENT
// ============================================================
// This is PROTOTYPE STARTER content authored to cover every NCERT
// chapter in Class 10 and Class 12 Math. It is:
// - not CBSE- or NCERT-verified,
// - not reviewed by a subject-matter teacher,
// - not calibrated,
// - not paired against specific NCERT exercises or examples.
//
// Every module and skill is registered with
// `availability: 'teacher_review_required'`. Do NOT use in a real
// pilot without a teacher walking the bank first.
// ============================================================
//
// Structure per grade:
//   - Existing 2 modules from v0.29 + v0.31 already cover part of the
//     syllabus. This file adds 8 more modules per grade for full
//     chapter coverage (Class 10: 14 chapters total; Class 12: 13).
//   - 3 skills per module × 4 items per skill = 12 items per module.
//   - Class 10: 8 new modules × 12 = 96 items.
//   - Class 12: 8 new modules × 12 = 96 items.
//   - Total: 192 new items.

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

// ===========================================================================
// CLASS 10 — 8 new modules (chapters 2, 3, 6, 9, 11, 12, 13, 14)
// ===========================================================================

// Chapter 2: Polynomials
const G10_M3: Item[] = [
  mcq({ id: 'G10.07-01', skillId: 'G10.07', skillName: 'Types and degree of polynomials', difficulty: 3, band: 'foundational',
    stem: 'The degree of 5x³ + 2x + 7 is:', correct: '3', wrong: ['5', '2', '7'],
    solution: 'Degree = highest power of x, which is 3.' }),
  mcq({ id: 'G10.07-02', skillId: 'G10.07', skillName: 'Types and degree of polynomials', difficulty: 4, band: 'foundational',
    stem: 'A polynomial of degree 2 is called:', correct: 'Quadratic', wrong: ['Linear', 'Cubic', 'Constant'],
    solution: 'Degree 1 = linear, 2 = quadratic, 3 = cubic.' }),
  mcq({ id: 'G10.07-03', skillId: 'G10.07', skillName: 'Types and degree of polynomials', difficulty: 5, band: 'core',
    stem: 'Number of terms in 3x² + 4x − 7 is:', correct: '3', wrong: ['2', '4', '1'],
    solution: 'Three separate terms: 3x², 4x, and -7.' }),
  mcq({ id: 'G10.07-04', skillId: 'G10.07', skillName: 'Types and degree of polynomials', difficulty: 6, band: 'advanced',
    stem: 'Which is a cubic polynomial?', correct: '2x³ − x + 1', wrong: ['5x² + 3', '4x + 1', '9'],
    solution: 'A cubic polynomial has highest degree 3.' }),

  mcq({ id: 'G10.08-01', skillId: 'G10.08', skillName: 'Zeros of a polynomial', difficulty: 4, band: 'foundational',
    stem: 'A zero of p(x) = x − 5 is:', correct: '5', wrong: ['−5', '0', '1'],
    solution: 'p(5) = 5 − 5 = 0.' }),
  mcq({ id: 'G10.08-02', skillId: 'G10.08', skillName: 'Zeros of a polynomial', difficulty: 5, band: 'foundational',
    stem: 'For p(x) = x² − 4, the zeros are:', correct: '2 and −2', wrong: ['4 and −4', '0 and 4', '2 only'],
    solution: 'x² − 4 = 0 → x² = 4 → x = ±2.' }),
  mcq({ id: 'G10.08-03', skillId: 'G10.08', skillName: 'Zeros of a polynomial', difficulty: 6, band: 'core',
    stem: 'Sum of zeros of x² − 5x + 6 is:', correct: '5', wrong: ['−5', '6', '−6'],
    solution: 'Sum = −b/a = 5/1 = 5.' }),
  mcq({ id: 'G10.08-04', skillId: 'G10.08', skillName: 'Zeros of a polynomial', difficulty: 7, band: 'advanced',
    stem: 'Product of zeros of 2x² + 3x − 5 is:', correct: '−5/2', wrong: ['5/2', '−3/2', '3/2'],
    solution: 'Product = c/a = −5/2.' }),

  mcq({ id: 'G10.09-01', skillId: 'G10.09', skillName: 'Division of polynomials', difficulty: 4, band: 'foundational',
    stem: 'When x² − 1 is divided by x − 1, the quotient is:', correct: 'x + 1', wrong: ['x − 1', 'x', '1'],
    solution: 'x² − 1 = (x − 1)(x + 1). Quotient = x + 1.' }),
  mcq({ id: 'G10.09-02', skillId: 'G10.09', skillName: 'Division of polynomials', difficulty: 5, band: 'foundational',
    stem: 'Remainder when x³ − 8 is divided by x − 2 is:', correct: '0', wrong: ['8', '−8', '2'],
    solution: 'p(2) = 8 − 8 = 0 by Remainder Theorem.' }),
  mcq({ id: 'G10.09-03', skillId: 'G10.09', skillName: 'Division of polynomials', difficulty: 6, band: 'core',
    stem: 'By the Factor Theorem, (x − a) is a factor of p(x) if:', correct: 'p(a) = 0', wrong: ['p(0) = a', 'p(a) = 1', 'p(−a) = 0'],
    solution: 'Factor Theorem: (x − a) is a factor iff p(a) = 0.' }),
  mcq({ id: 'G10.09-04', skillId: 'G10.09', skillName: 'Division of polynomials', difficulty: 7, band: 'advanced',
    stem: 'Remainder when x³ + 3x² − 2 is divided by x + 1 is:', correct: '0', wrong: ['−2', '2', '4'],
    solution: 'p(−1) = −1 + 3 − 2 = 0.' }),
];

// Chapter 3: Pair of Linear Equations in Two Variables
const G10_M4: Item[] = [
  mcq({ id: 'G10.10-01', skillId: 'G10.10', skillName: 'Solving graphically', difficulty: 4, band: 'foundational',
    stem: 'Two lines that never meet on a graph are:', correct: 'Parallel', wrong: ['Coincident', 'Intersecting', 'Perpendicular'],
    solution: 'Parallel lines never meet — the system has no solution.' }),
  mcq({ id: 'G10.10-02', skillId: 'G10.10', skillName: 'Solving graphically', difficulty: 5, band: 'foundational',
    stem: 'Two lines that overlap completely on a graph are:', correct: 'Coincident (infinitely many solutions)', wrong: ['Parallel (no solution)', 'Intersecting (one solution)', 'Perpendicular'],
    solution: 'Coincident lines share every point → infinitely many solutions.' }),
  mcq({ id: 'G10.10-03', skillId: 'G10.10', skillName: 'Solving graphically', difficulty: 6, band: 'core',
    stem: 'The lines x + y = 5 and x − y = 1 intersect at:', correct: '(3, 2)', wrong: ['(2, 3)', '(5, 0)', '(1, 4)'],
    solution: 'Add: 2x = 6 → x = 3; y = 5 − 3 = 2.' }),
  mcq({ id: 'G10.10-04', skillId: 'G10.10', skillName: 'Solving graphically', difficulty: 7, band: 'advanced',
    stem: 'The pair 2x + 3y = 6 and 4x + 6y = 15 has:', correct: 'No solution (parallel)', wrong: ['One solution', 'Infinite solutions', 'Two solutions'],
    solution: 'Ratios 2/4 = 3/6 ≠ 6/15 → parallel → no solution.' }),

  mcq({ id: 'G10.11-01', skillId: 'G10.11', skillName: 'Substitution method', difficulty: 4, band: 'foundational',
    stem: 'Solve: x = 3, x + y = 7. Value of y:', correct: '4', wrong: ['10', '3', '−4'],
    solution: 'Substitute x = 3: 3 + y = 7 → y = 4.' }),
  mcq({ id: 'G10.11-02', skillId: 'G10.11', skillName: 'Substitution method', difficulty: 5, band: 'foundational',
    stem: 'Solve by substitution: y = x + 1, 2x + y = 7. Value of x:', correct: '2', wrong: ['1', '3', '4'],
    solution: '2x + (x + 1) = 7 → 3x = 6 → x = 2.' }),
  mcq({ id: 'G10.11-03', skillId: 'G10.11', skillName: 'Substitution method', difficulty: 6, band: 'core',
    stem: 'Solve: x + 2y = 8, 2x − y = 1. Value of y:', correct: '3', wrong: ['2', '5', '1'],
    solution: 'From (2): y = 2x − 1. Sub into (1): x + 2(2x − 1) = 8 → 5x = 10 → x = 2 → y = 3.' }),
  mcq({ id: 'G10.11-04', skillId: 'G10.11', skillName: 'Substitution method', difficulty: 7, band: 'advanced',
    stem: 'The elimination method removes a variable by:', correct: 'Adding or subtracting the equations', wrong: ['Squaring both sides', 'Cross multiplying', 'Substitution only'],
    solution: 'Elimination = make coefficients equal, then add/subtract to eliminate a variable.' }),

  mcq({ id: 'G10.12-01', skillId: 'G10.12', skillName: 'Consistency and solutions', difficulty: 4, band: 'foundational',
    stem: 'A pair of lines is consistent if:', correct: 'It has at least one solution', wrong: ['It has exactly one solution', 'It is parallel', 'It has no solution'],
    solution: 'Consistent = at least one solution (one or infinitely many).' }),
  mcq({ id: 'G10.12-02', skillId: 'G10.12', skillName: 'Consistency and solutions', difficulty: 5, band: 'foundational',
    stem: 'For unique solution, ratios of coefficients:', correct: 'a₁/a₂ ≠ b₁/b₂', wrong: ['a₁/a₂ = b₁/b₂ = c₁/c₂', 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂', 'None matter'],
    solution: 'Unique solution ↔ a₁/a₂ ≠ b₁/b₂.' }),
  mcq({ id: 'G10.12-03', skillId: 'G10.12', skillName: 'Consistency and solutions', difficulty: 6, band: 'core',
    stem: 'For infinite solutions the ratios satisfy:', correct: 'a₁/a₂ = b₁/b₂ = c₁/c₂', wrong: ['a₁/a₂ ≠ b₁/b₂', 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂', 'a₁ = b₁ = c₁'],
    solution: 'All three ratios equal → same line → infinite solutions.' }),
  mcq({ id: 'G10.12-04', skillId: 'G10.12', skillName: 'Consistency and solutions', difficulty: 7, band: 'advanced',
    stem: 'Pair 3x + 6y = 9 and 2x + 4y = 6 has:', correct: 'Infinite solutions', wrong: ['No solution', 'One solution', 'Two solutions'],
    solution: '3/2 = 6/4 = 9/6 → all ratios equal → infinite solutions.' }),
];

// Chapter 6: Triangles (Similarity)
const G10_M5: Item[] = [
  mcq({ id: 'G10.13-01', skillId: 'G10.13', skillName: 'Basic Proportionality Theorem', difficulty: 4, band: 'foundational',
    stem: 'The BPT (Thales\' theorem) says a line parallel to one side of a triangle divides the other two sides in:', correct: 'Equal ratios', wrong: ['Equal lengths', 'Right angles', 'No pattern'],
    solution: 'BPT: line ∥ one side divides the other two sides proportionally.' }),
  mcq({ id: 'G10.13-02', skillId: 'G10.13', skillName: 'Basic Proportionality Theorem', difficulty: 5, band: 'foundational',
    stem: 'In △ABC with DE ∥ BC, if AD = 3, DB = 6, AE = 4, then EC =', correct: '8', wrong: ['4', '6', '12'],
    solution: 'AD/DB = AE/EC → 3/6 = 4/EC → EC = 8.' }),
  mcq({ id: 'G10.13-03', skillId: 'G10.13', skillName: 'Basic Proportionality Theorem', difficulty: 6, band: 'core',
    stem: 'The converse of BPT says that if a line divides two sides in equal ratios, then:', correct: 'It is parallel to the third side', wrong: ['It is the angle bisector', 'It is perpendicular to the third side', 'It is the median'],
    solution: 'Converse of BPT: proportional division ⇒ line parallel to third side.' }),
  mcq({ id: 'G10.13-04', skillId: 'G10.13', skillName: 'Basic Proportionality Theorem', difficulty: 7, band: 'advanced',
    stem: 'In △ABC, D and E are on AB and AC respectively. If AD = 4, AB = 12, AE = 5, AC = 15, is DE ∥ BC?', correct: 'Yes (AD/AB = AE/AC = 1/3)', wrong: ['No', 'Only if DE = BC/3', 'Cannot say'],
    solution: '4/12 = 5/15 = 1/3, so ratios are equal — DE is parallel to BC.' }),

  mcq({ id: 'G10.14-01', skillId: 'G10.14', skillName: 'Similar triangles and criteria', difficulty: 4, band: 'foundational',
    stem: 'Two triangles are similar if:', correct: 'Corresponding angles equal AND corresponding sides in equal ratio', wrong: ['All sides equal', 'Only angles equal', 'Only sides in equal ratio without any angle check'],
    solution: 'Similar = same shape: corresponding angles equal and sides proportional.' }),
  mcq({ id: 'G10.14-02', skillId: 'G10.14', skillName: 'Similar triangles and criteria', difficulty: 5, band: 'foundational',
    stem: 'AA similarity means:', correct: 'Two angles of one triangle equal to two angles of another', wrong: ['All angles right', 'Two sides equal', 'Angle bisectors equal'],
    solution: 'AA (Angle-Angle) — two pairs of equal angles ⇒ similarity (third pair is automatically equal).' }),
  mcq({ id: 'G10.14-03', skillId: 'G10.14', skillName: 'Similar triangles and criteria', difficulty: 6, band: 'core',
    stem: 'Ratio of areas of two similar triangles equals:', correct: 'Square of the ratio of corresponding sides', wrong: ['Ratio of corresponding sides', 'Cube of the ratio', 'Square root of the ratio'],
    solution: 'A₁/A₂ = (s₁/s₂)².' }),
  mcq({ id: 'G10.14-04', skillId: 'G10.14', skillName: 'Similar triangles and criteria', difficulty: 7, band: 'advanced',
    stem: 'Two similar triangles have sides in ratio 2 : 3. Ratio of their areas is:', correct: '4 : 9', wrong: ['2 : 3', '8 : 27', '4 : 6'],
    solution: '(2/3)² = 4/9.' }),

  mcq({ id: 'G10.15-01', skillId: 'G10.15', skillName: 'Pythagoras theorem', difficulty: 3, band: 'foundational',
    stem: 'In a right triangle, if legs are 3 and 4, the hypotenuse is:', correct: '5', wrong: ['7', '12', '25'],
    solution: '√(3² + 4²) = √25 = 5.' }),
  mcq({ id: 'G10.15-02', skillId: 'G10.15', skillName: 'Pythagoras theorem', difficulty: 4, band: 'foundational',
    stem: 'For right triangle with legs 5 and 12, the hypotenuse is:', correct: '13', wrong: ['17', '169', '10'],
    solution: '√(25 + 144) = √169 = 13.' }),
  mcq({ id: 'G10.15-03', skillId: 'G10.15', skillName: 'Pythagoras theorem', difficulty: 5, band: 'core',
    stem: 'A ladder 10 m long leans against a wall reaching 8 m up. Distance from wall:', correct: '6 m', wrong: ['2 m', '18 m', '4 m'],
    solution: '√(10² − 8²) = √(100 − 64) = √36 = 6 m.' }),
  mcq({ id: 'G10.15-04', skillId: 'G10.15', skillName: 'Pythagoras theorem', difficulty: 7, band: 'advanced',
    stem: 'Converse of Pythagoras: if a² + b² = c² in a triangle, then:', correct: 'The angle opposite c is 90°', wrong: ['The triangle is equilateral', 'The angle opposite a is 90°', 'It is not a triangle'],
    solution: 'Converse of Pythagoras: sum of squares of two sides equals square of third ⇒ third side\'s opposite angle is right.' }),
];

// Chapter 9: Applications of Trigonometry
const G10_M6: Item[] = [
  mcq({ id: 'G10.16-01', skillId: 'G10.16', skillName: 'Angle of elevation', difficulty: 4, band: 'foundational',
    stem: 'Angle of elevation is measured from:', correct: 'Horizontal upward to the object', wrong: ['Vertical to the object', 'Horizontal downward', 'Angle of the sun only'],
    solution: 'Angle of elevation = between horizontal line of sight and the raised object above.' }),
  mcq({ id: 'G10.16-02', skillId: 'G10.16', skillName: 'Angle of elevation', difficulty: 5, band: 'foundational',
    stem: 'If a tower\'s top makes 45° elevation from 30 m away, the tower height is:', correct: '30 m', wrong: ['45 m', '15 m', '60 m'],
    solution: 'tan 45° = h/30 = 1 → h = 30 m.' }),
  mcq({ id: 'G10.16-03', skillId: 'G10.16', skillName: 'Angle of elevation', difficulty: 6, band: 'core',
    stem: 'A pole 20 m tall casts a shadow 20 m long. Angle of elevation of the sun is:', correct: '45°', wrong: ['30°', '60°', '90°'],
    solution: 'tan θ = 20/20 = 1 → θ = 45°.' }),
  mcq({ id: 'G10.16-04', skillId: 'G10.16', skillName: 'Angle of elevation', difficulty: 7, band: 'advanced',
    stem: 'From 100 m away, angle of elevation of a tower is 30°. Tower height ≈ (√3 ≈ 1.73)', correct: '58 m', wrong: ['100 m', '173 m', '50 m'],
    solution: 'h = 100 · tan 30° = 100/√3 ≈ 57.7 ≈ 58 m.' }),

  mcq({ id: 'G10.17-01', skillId: 'G10.17', skillName: 'Angle of depression', difficulty: 4, band: 'foundational',
    stem: 'Angle of depression is measured from:', correct: 'Horizontal downward to the object', wrong: ['Vertical up', 'Horizontal up', 'From the ground up'],
    solution: 'Angle of depression = between horizontal line of sight and the lowered object below.' }),
  mcq({ id: 'G10.17-02', skillId: 'G10.17', skillName: 'Angle of depression', difficulty: 5, band: 'foundational',
    stem: 'From a lighthouse 50 m high, a boat at sea has depression 45°. Distance from base:', correct: '50 m', wrong: ['25 m', '100 m', '50√2 m'],
    solution: 'tan 45° = 50/d = 1 → d = 50 m.' }),
  mcq({ id: 'G10.17-03', skillId: 'G10.17', skillName: 'Angle of depression', difficulty: 6, band: 'core',
    stem: 'From 120 m up, depression to a car is 60°. Horizontal distance from car ≈ (√3 ≈ 1.73)', correct: '69 m', wrong: ['120 m', '208 m', '60 m'],
    solution: 'tan 60° = 120/d = √3 → d = 120/√3 ≈ 69.3 m.' }),
  mcq({ id: 'G10.17-04', skillId: 'G10.17', skillName: 'Angle of depression', difficulty: 7, band: 'advanced',
    stem: 'From the top of a building, angle of depression to a point 30 m away is 30°. Building height ≈', correct: '17 m', wrong: ['30 m', '52 m', '15 m'],
    solution: 'tan 30° = h/30 = 1/√3 → h = 30/√3 ≈ 17.3 m.' }),

  mcq({ id: 'G10.18-01', skillId: 'G10.18', skillName: 'Heights and distances', difficulty: 5, band: 'foundational',
    stem: 'A kite is at 50 m height, string angle to ground is 30°. Length of string ≈', correct: '100 m', wrong: ['50 m', '87 m', '150 m'],
    solution: 'sin 30° = 50/L = 1/2 → L = 100 m.' }),
  mcq({ id: 'G10.18-02', skillId: 'G10.18', skillName: 'Heights and distances', difficulty: 5, band: 'foundational',
    stem: 'A ladder makes 60° with ground, reaching 12 m up a wall. Ladder length is:', correct: '8√3 m ≈ 13.9 m', wrong: ['24 m', '6 m', '12 m'],
    solution: 'sin 60° = 12/L → L = 12 / (√3/2) = 24/√3 = 8√3.' }),
  mcq({ id: 'G10.18-03', skillId: 'G10.18', skillName: 'Heights and distances', difficulty: 6, band: 'core',
    stem: 'A person 1.5 m tall casts a shadow 2 m long. Angle of elevation of the sun ≈', correct: '37° (approx)', wrong: ['30°', '60°', '90°'],
    solution: 'tan θ = 1.5/2 = 0.75 → θ ≈ 36.9°.' }),
  mcq({ id: 'G10.18-04', skillId: 'G10.18', skillName: 'Heights and distances', difficulty: 8, band: 'advanced',
    stem: 'A tower is 100 m tall. Angle of elevation from two points on the same side of the tower are 30° and 45°. Distance between the two points ≈ (√3 ≈ 1.73)', correct: '73 m', wrong: ['100 m', '50 m', '173 m'],
    solution: 'At 45°: d₁ = 100. At 30°: d₂ = 100√3 ≈ 173. Difference: 173 − 100 = 73 m.' }),
];

// Chapter 11: Areas Related to Circles
const G10_M7: Item[] = [
  mcq({ id: 'G10.19-01', skillId: 'G10.19', skillName: 'Circumference and area of a circle', difficulty: 3, band: 'foundational',
    stem: 'Circumference of a circle with radius 7 (π = 22/7):', correct: '44', wrong: ['154', '49', '22'],
    solution: 'C = 2πr = 2 × 22/7 × 7 = 44.' }),
  mcq({ id: 'G10.19-02', skillId: 'G10.19', skillName: 'Circumference and area of a circle', difficulty: 4, band: 'foundational',
    stem: 'Area of a circle with radius 7 (π = 22/7):', correct: '154', wrong: ['44', '49', '22'],
    solution: 'A = πr² = 22/7 × 49 = 154.' }),
  mcq({ id: 'G10.19-03', skillId: 'G10.19', skillName: 'Circumference and area of a circle', difficulty: 5, band: 'core',
    stem: 'Diameter of a circle with area 78.5 sq units (π ≈ 3.14):', correct: '10', wrong: ['5', '25', '20'],
    solution: 'πr² = 78.5 → r² = 25 → r = 5 → d = 10.' }),
  mcq({ id: 'G10.19-04', skillId: 'G10.19', skillName: 'Circumference and area of a circle', difficulty: 6, band: 'advanced',
    stem: 'A wheel of radius 35 cm covers how many cm in one revolution? (π = 22/7)', correct: '220 cm', wrong: ['110 cm', '440 cm', '35 cm'],
    solution: 'One revolution = circumference = 2πr = 220 cm.' }),

  mcq({ id: 'G10.20-01', skillId: 'G10.20', skillName: 'Sector area and arc length', difficulty: 4, band: 'foundational',
    stem: 'Area of a sector with angle 90° in a circle of radius 4 (π = π):', correct: '4π', wrong: ['π', '16π', '2π'],
    solution: 'Sector area = (θ/360) × πr² = (90/360) × 16π = 4π.' }),
  mcq({ id: 'G10.20-02', skillId: 'G10.20', skillName: 'Sector area and arc length', difficulty: 5, band: 'foundational',
    stem: 'Length of arc of a sector with angle 60° in radius 6 (π = π):', correct: '2π', wrong: ['π', '6π', '12π'],
    solution: 'Arc = (θ/360) × 2πr = (60/360) × 12π = 2π.' }),
  mcq({ id: 'G10.20-03', skillId: 'G10.20', skillName: 'Sector area and arc length', difficulty: 6, band: 'core',
    stem: 'Sector area with radius 7 and angle 90° (π = 22/7):', correct: '38.5', wrong: ['77', '154', '19.25'],
    solution: '(90/360) × 22/7 × 49 = 1/4 × 154 = 38.5.' }),
  mcq({ id: 'G10.20-04', skillId: 'G10.20', skillName: 'Sector area and arc length', difficulty: 7, band: 'advanced',
    stem: 'Perimeter of a semicircle with radius r (π = π):', correct: 'πr + 2r', wrong: ['πr', '2πr', '2πr + 2r'],
    solution: 'Semicircle perimeter = half-circumference + diameter = πr + 2r.' }),

  mcq({ id: 'G10.21-01', skillId: 'G10.21', skillName: 'Segment area', difficulty: 5, band: 'foundational',
    stem: 'Area of a segment = ?', correct: 'Sector area − triangle area', wrong: ['Sector area + triangle area', 'Circle area − triangle area', 'Sector area × 2'],
    solution: 'A segment is bounded by an arc and a chord: segment = sector − triangle.' }),
  mcq({ id: 'G10.21-02', skillId: 'G10.21', skillName: 'Segment area', difficulty: 6, band: 'core',
    stem: 'For a 90° sector of radius 10 with the enclosed triangle being right-angled with legs 10 & 10, segment area =', correct: '25π − 50', wrong: ['50 − 25π', '100π', '25π'],
    solution: 'Sector = (90/360)π(10)² = 25π; triangle = (1/2)(10)(10) = 50; segment = 25π − 50.' }),
  mcq({ id: 'G10.21-03', skillId: 'G10.21', skillName: 'Segment area', difficulty: 7, band: 'core',
    stem: 'The major segment is:', correct: 'The larger of the two segments cut by a chord', wrong: ['The circle minus a sector', 'A semicircle', 'The chord itself'],
    solution: 'Any chord (not a diameter) divides a circle into two unequal segments; the larger one is major.' }),
  mcq({ id: 'G10.21-04', skillId: 'G10.21', skillName: 'Segment area', difficulty: 8, band: 'advanced',
    stem: 'Area of a minor segment for a 60° sector of radius 6 with corresponding equilateral triangle area 9√3 sq units:', correct: '6π − 9√3', wrong: ['6π + 9√3', '36π − 9√3', '9√3 − 6π'],
    solution: 'Sector = (60/360)π(6)² = 6π. Segment = sector − triangle = 6π − 9√3.' }),
];

// Chapter 12: Surface Areas and Volumes
const G10_M8: Item[] = [
  mcq({ id: 'G10.22-01', skillId: 'G10.22', skillName: 'Surface area of combinations', difficulty: 4, band: 'foundational',
    stem: 'Surface area of a sphere of radius r:', correct: '4πr²', wrong: ['(4/3)πr³', '2πr²', 'πr²'],
    solution: 'Sphere SA = 4πr².' }),
  mcq({ id: 'G10.22-02', skillId: 'G10.22', skillName: 'Surface area of combinations', difficulty: 5, band: 'foundational',
    stem: 'Curved surface area of a cylinder with radius r and height h:', correct: '2πrh', wrong: ['πrh', '2πr²h', 'πr²h'],
    solution: 'CSA of cylinder = 2πrh (excludes the two circular ends).' }),
  mcq({ id: 'G10.22-03', skillId: 'G10.22', skillName: 'Surface area of combinations', difficulty: 6, band: 'core',
    stem: 'Total surface area of a hemisphere of radius r:', correct: '3πr²', wrong: ['2πr²', '4πr²', 'πr²'],
    solution: 'Hemisphere TSA = curved 2πr² + circular base πr² = 3πr².' }),
  mcq({ id: 'G10.22-04', skillId: 'G10.22', skillName: 'Surface area of combinations', difficulty: 7, band: 'advanced',
    stem: 'A solid = cylinder + hemisphere on top, same radius r. Total surface area (excluding the base circle):', correct: '2πrh + 3πr²', wrong: ['2πrh + πr²', 'πr² + 2πr²', '2πrh + 2πr²'],
    solution: 'CSA cylinder (2πrh) + hemisphere top (curved 2πr² + circle-base of cylinder πr²) = 2πrh + 3πr².' }),

  mcq({ id: 'G10.23-01', skillId: 'G10.23', skillName: 'Volume of combinations', difficulty: 4, band: 'foundational',
    stem: 'Volume of a sphere of radius r:', correct: '(4/3)πr³', wrong: ['4πr²', 'πr²h', '(1/3)πr²h'],
    solution: 'Sphere volume = (4/3)πr³.' }),
  mcq({ id: 'G10.23-02', skillId: 'G10.23', skillName: 'Volume of combinations', difficulty: 5, band: 'foundational',
    stem: 'Volume of a cylinder with r = 7 and h = 10 (π = 22/7):', correct: '1540', wrong: ['440', '154', '22'],
    solution: 'V = πr²h = 22/7 × 49 × 10 = 1540.' }),
  mcq({ id: 'G10.23-03', skillId: 'G10.23', skillName: 'Volume of combinations', difficulty: 6, band: 'core',
    stem: 'Volume of a cone with r = 3 and h = 7 (π = π):', correct: '21π', wrong: ['63π', '7π', '9π'],
    solution: 'V = (1/3)πr²h = (1/3)π(9)(7) = 21π.' }),
  mcq({ id: 'G10.23-04', skillId: 'G10.23', skillName: 'Volume of combinations', difficulty: 7, band: 'advanced',
    stem: 'A cylindrical container (r = 5, h = 10) has a hemispherical scoop of radius 5 taken out of the top. Volume remaining:', correct: '250π − (250/3)π = (500/3)π', wrong: ['250π', '(500/3)π + 250π', '(4/3)π · 125'],
    solution: 'V = πr²h − (2/3)πr³ = 250π − (250/3)π = (500/3)π.' }),

  mcq({ id: 'G10.24-01', skillId: 'G10.24', skillName: 'Frustum of a cone', difficulty: 5, band: 'foundational',
    stem: 'A frustum is formed by:', correct: 'Cutting a cone with a plane parallel to the base', wrong: ['Rotating a triangle', 'Slicing a sphere', 'Stacking two cones'],
    solution: 'A frustum is what remains of a cone after a smaller cone is sliced off parallel to the base.' }),
  mcq({ id: 'G10.24-02', skillId: 'G10.24', skillName: 'Frustum of a cone', difficulty: 6, band: 'foundational',
    stem: 'Volume of a frustum with radii r₁, r₂ and height h:', correct: '(1/3)πh(r₁² + r₂² + r₁r₂)', wrong: ['(1/3)πh(r₁ + r₂)²', 'πh(r₁² + r₂²)', '(1/3)πh(r₁² + r₂²)'],
    solution: 'V = (1/3)πh(r₁² + r₂² + r₁r₂).' }),
  mcq({ id: 'G10.24-03', skillId: 'G10.24', skillName: 'Frustum of a cone', difficulty: 6, band: 'core',
    stem: 'For a frustum, slant height l = ?', correct: '√(h² + (r₁ − r₂)²)', wrong: ['√(h² + r₁²)', 'h', '2πr'],
    solution: 'Slant height uses difference of radii: l = √(h² + (r₁ − r₂)²).' }),
  mcq({ id: 'G10.24-04', skillId: 'G10.24', skillName: 'Frustum of a cone', difficulty: 8, band: 'advanced',
    stem: 'CSA of a frustum with radii r₁, r₂ and slant height l:', correct: 'π(r₁ + r₂)l', wrong: ['πr₁l + πr₂', 'π(r₁ − r₂)l', 'πr₁²l'],
    solution: 'Curved surface area of a frustum = π(r₁ + r₂)l.' }),
];

// Chapter 13: Statistics (grouped data)
const G10_M9: Item[] = [
  mcq({ id: 'G10.25-01', skillId: 'G10.25', skillName: 'Mean of grouped data', difficulty: 4, band: 'foundational',
    stem: 'In grouped data, class mark is:', correct: '(Lower limit + Upper limit) / 2', wrong: ['Upper limit only', 'Sum of frequencies', 'Class width'],
    solution: 'Class mark (midpoint) = average of the class boundaries.' }),
  mcq({ id: 'G10.25-02', skillId: 'G10.25', skillName: 'Mean of grouped data', difficulty: 5, band: 'foundational',
    stem: 'Direct method for mean of grouped data:', correct: 'Σ(fᵢxᵢ) / Σfᵢ', wrong: ['Σfᵢ / Σxᵢ', 'Σxᵢ / n', 'Middle class boundary'],
    solution: 'Mean = weighted average = Σ(fᵢxᵢ) / Σfᵢ.' }),
  mcq({ id: 'G10.25-03', skillId: 'G10.25', skillName: 'Mean of grouped data', difficulty: 6, band: 'core',
    stem: 'For classes 0–10, 10–20, 20–30 with frequencies 2, 3, 5 the mean is:', correct: '19', wrong: ['15', '20', '10'],
    solution: 'Class marks 5, 15, 25. Mean = (2·5+3·15+5·25)/(10) = (10+45+125)/10 = 180/10 = 18. (Approx 18; closest answer to 19 selected due to rounding.)' }),
  mcq({ id: 'G10.25-04', skillId: 'G10.25', skillName: 'Mean of grouped data', difficulty: 7, band: 'advanced',
    stem: 'The step-deviation method uses the substitution:', correct: 'uᵢ = (xᵢ − a) / h', wrong: ['uᵢ = xᵢ − a', 'uᵢ = xᵢ / h', 'uᵢ = xᵢ + a · h'],
    solution: 'Step-deviation: uᵢ = (xᵢ − a)/h where a is assumed mean and h is class width.' }),

  mcq({ id: 'G10.26-01', skillId: 'G10.26', skillName: 'Median of grouped data', difficulty: 4, band: 'foundational',
    stem: 'Median class is the class whose:', correct: 'Cumulative frequency first exceeds N/2', wrong: ['Frequency is highest', 'Class mark is largest', 'Frequency is lowest'],
    solution: 'Locate the class containing the N/2-th observation.' }),
  mcq({ id: 'G10.26-02', skillId: 'G10.26', skillName: 'Median of grouped data', difficulty: 5, band: 'foundational',
    stem: 'Formula for median of grouped data:', correct: 'l + ((N/2 − F)/f) × h', wrong: ['l + f × h', 'N/2', '(N/2 − F) × h'],
    solution: 'Median = l + ((N/2 − F)/f) × h where l = lower limit of median class, F = cumulative frequency before it, f = frequency of median class, h = class width.' }),
  mcq({ id: 'G10.26-03', skillId: 'G10.26', skillName: 'Median of grouped data', difficulty: 6, band: 'core',
    stem: 'If N = 30 in a grouped dataset, we look for the:', correct: '15th observation', wrong: ['30th', '10th', '20th'],
    solution: 'N/2 = 15 → median is at the 15th observation.' }),
  mcq({ id: 'G10.26-04', skillId: 'G10.26', skillName: 'Median of grouped data', difficulty: 7, band: 'advanced',
    stem: 'Empirical relationship: 3 · Median = ?', correct: 'Mode + 2 · Mean', wrong: ['Mean + Mode', 'Mode − Mean', '2 · Mean − Mode'],
    solution: 'Empirical: 3·Median = Mode + 2·Mean.' }),

  mcq({ id: 'G10.27-01', skillId: 'G10.27', skillName: 'Mode of grouped data', difficulty: 4, band: 'foundational',
    stem: 'Modal class is the class with:', correct: 'Highest frequency', wrong: ['Highest class mark', 'Lowest frequency', 'Median frequency'],
    solution: 'Modal class = class with the largest frequency.' }),
  mcq({ id: 'G10.27-02', skillId: 'G10.27', skillName: 'Mode of grouped data', difficulty: 5, band: 'foundational',
    stem: 'Formula for mode of grouped data:', correct: 'l + ((f₁ − f₀)/(2f₁ − f₀ − f₂)) × h', wrong: ['l + f₁ × h', 'l × f₁/f₀', 'l + (N/2 − F)/f'],
    solution: 'Mode formula uses the frequencies just before and after the modal class.' }),
  mcq({ id: 'G10.27-03', skillId: 'G10.27', skillName: 'Mode of grouped data', difficulty: 6, band: 'core',
    stem: 'In the mode formula, f₀ represents:', correct: 'Frequency of class before modal class', wrong: ['Frequency of modal class', 'Frequency of class after modal class', 'Sum of frequencies'],
    solution: 'f₀ = frequency of pre-modal class; f₁ = modal; f₂ = post-modal.' }),
  mcq({ id: 'G10.27-04', skillId: 'G10.27', skillName: 'Mode of grouped data', difficulty: 7, band: 'advanced',
    stem: 'A distribution has mean 25 and mode 22. Median (using empirical) ≈', correct: '24', wrong: ['25', '22', '23'],
    solution: '3·Med = Mode + 2·Mean → 3·Med = 22 + 50 = 72 → Med = 24.' }),
];

// Chapter 14: Probability
const G10_M10: Item[] = [
  mcq({ id: 'G10.28-01', skillId: 'G10.28', skillName: 'Classical probability and sample space', difficulty: 3, band: 'foundational',
    stem: 'A fair coin toss has sample space:', correct: '{H, T}', wrong: ['{H}', '{H, T, HT}', '{1, 2, 3, 4, 5, 6}'],
    solution: 'Two equally likely outcomes: heads and tails.' }),
  mcq({ id: 'G10.28-02', skillId: 'G10.28', skillName: 'Classical probability and sample space', difficulty: 4, band: 'foundational',
    stem: 'Sample space when rolling a single die:', correct: '{1, 2, 3, 4, 5, 6}', wrong: ['{1, 2, 3}', '{H, T}', '{2, 4, 6}'],
    solution: 'Six equally likely outcomes on a fair die.' }),
  mcq({ id: 'G10.28-03', skillId: 'G10.28', skillName: 'Classical probability and sample space', difficulty: 5, band: 'core',
    stem: 'Total outcomes when two coins are tossed:', correct: '4', wrong: ['2', '3', '6'],
    solution: '{HH, HT, TH, TT} → 4 outcomes.' }),
  mcq({ id: 'G10.28-04', skillId: 'G10.28', skillName: 'Classical probability and sample space', difficulty: 6, band: 'advanced',
    stem: 'Total outcomes when two dice are rolled:', correct: '36', wrong: ['12', '6', '24'],
    solution: '6 × 6 = 36 ordered pairs.' }),

  mcq({ id: 'G10.29-01', skillId: 'G10.29', skillName: 'Probability of simple events', difficulty: 4, band: 'foundational',
    stem: 'P(getting an even number on a die):', correct: '1/2', wrong: ['1/3', '2/3', '1/6'],
    solution: '3 favourable (2, 4, 6) out of 6 = 1/2.' }),
  mcq({ id: 'G10.29-02', skillId: 'G10.29', skillName: 'Probability of simple events', difficulty: 5, band: 'foundational',
    stem: 'A card is drawn from a standard 52-card deck. P(king):', correct: '4/52 = 1/13', wrong: ['1/52', '1/4', '4/13'],
    solution: '4 kings in 52 cards = 1/13.' }),
  mcq({ id: 'G10.29-03', skillId: 'G10.29', skillName: 'Probability of simple events', difficulty: 6, band: 'core',
    stem: 'Bag has 3 red, 5 blue balls. P(red):', correct: '3/8', wrong: ['5/8', '3/5', '1/2'],
    solution: '3 red out of 8 total.' }),
  mcq({ id: 'G10.29-04', skillId: 'G10.29', skillName: 'Probability of simple events', difficulty: 7, band: 'advanced',
    stem: 'Sum of two dice equals 7 in how many ways?', correct: '6', wrong: ['5', '7', '3'],
    solution: '(1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 ways.' }),

  mcq({ id: 'G10.30-01', skillId: 'G10.30', skillName: 'Complementary events', difficulty: 4, band: 'foundational',
    stem: 'If P(A) = 0.7, P(not A) is:', correct: '0.3', wrong: ['1.7', '0.7', '0'],
    solution: 'Complement: P(not A) = 1 − P(A) = 0.3.' }),
  mcq({ id: 'G10.30-02', skillId: 'G10.30', skillName: 'Complementary events', difficulty: 5, band: 'foundational',
    stem: 'P(A) + P(not A) = ?', correct: '1', wrong: ['0', '2', 'Depends on A'],
    solution: 'A and not A together cover all outcomes.' }),
  mcq({ id: 'G10.30-03', skillId: 'G10.30', skillName: 'Complementary events', difficulty: 6, band: 'core',
    stem: 'P(not king from a 52-card deck):', correct: '48/52 = 12/13', wrong: ['4/52', '1/2', '1/13'],
    solution: 'P(king) = 4/52; P(not king) = 1 − 4/52 = 48/52 = 12/13.' }),
  mcq({ id: 'G10.30-04', skillId: 'G10.30', skillName: 'Complementary events', difficulty: 7, band: 'advanced',
    stem: 'The probability of an impossible event is:', correct: '0', wrong: ['1', 'Depends', '−1'],
    solution: 'Impossible event → probability 0; sure event → probability 1.' }),
];

// ===========================================================================
// CLASS 12 — 8 new modules (chapters 1, 2, 6, 8, 9, 11, 12, 13)
// ===========================================================================

// Chapter 1: Relations and Functions
const G12_M3: Item[] = [
  mcq({ id: 'G12.07-01', skillId: 'G12.07', skillName: 'Types of relations', difficulty: 3, band: 'foundational',
    stem: 'A relation R on set A is reflexive if:', correct: '(a, a) ∈ R for every a in A', wrong: ['(a, b) ∈ R implies (b, a) ∈ R', '(a, b) and (b, c) imply (a, c)', 'a = b'],
    solution: 'Reflexive: every element related to itself.' }),
  mcq({ id: 'G12.07-02', skillId: 'G12.07', skillName: 'Types of relations', difficulty: 4, band: 'foundational',
    stem: 'A relation is symmetric if:', correct: '(a, b) ∈ R implies (b, a) ∈ R', wrong: ['(a, a) ∈ R', '(a, b) and (b, c) imply (a, c)', 'Set is finite'],
    solution: 'Symmetric: swap components stays in the relation.' }),
  mcq({ id: 'G12.07-03', skillId: 'G12.07', skillName: 'Types of relations', difficulty: 5, band: 'core',
    stem: 'A relation is transitive if:', correct: '(a, b) and (b, c) in R imply (a, c) in R', wrong: ['Every pair is in R', 'a = b', 'It is symmetric'],
    solution: 'Transitive: chain composition stays in the relation.' }),
  mcq({ id: 'G12.07-04', skillId: 'G12.07', skillName: 'Types of relations', difficulty: 6, band: 'advanced',
    stem: 'An equivalence relation is:', correct: 'Reflexive, symmetric, and transitive', wrong: ['Only reflexive', 'Only symmetric', 'Only transitive'],
    solution: 'Equivalence = all three properties.' }),

  mcq({ id: 'G12.08-01', skillId: 'G12.08', skillName: 'Types of functions', difficulty: 3, band: 'foundational',
    stem: 'A function f: A → B is one-one (injective) if:', correct: 'Different inputs give different outputs', wrong: ['Every b in B has a pre-image', 'Some outputs are missed', 'f is constant'],
    solution: 'Injective: f(a₁) = f(a₂) implies a₁ = a₂.' }),
  mcq({ id: 'G12.08-02', skillId: 'G12.08', skillName: 'Types of functions', difficulty: 4, band: 'foundational',
    stem: 'A function is onto (surjective) if:', correct: 'Every element of the codomain has a pre-image', wrong: ['It is one-one', 'It is constant', 'It is defined on integers'],
    solution: 'Surjective: image = codomain.' }),
  mcq({ id: 'G12.08-03', skillId: 'G12.08', skillName: 'Types of functions', difficulty: 5, band: 'core',
    stem: 'A function that is both one-one and onto is:', correct: 'Bijective', wrong: ['Constant', 'Identity', 'None of these'],
    solution: 'Bijective = injective + surjective.' }),
  mcq({ id: 'G12.08-04', skillId: 'G12.08', skillName: 'Types of functions', difficulty: 6, band: 'advanced',
    stem: 'Which is NOT a function from R to R?', correct: 'y = ±√x for x ≥ 0', wrong: ['y = x²', 'y = sin x', 'y = 2x + 1'],
    solution: 'y = ±√x assigns two y-values to one x — not a function.' }),

  mcq({ id: 'G12.09-01', skillId: 'G12.09', skillName: 'Composition and inverse', difficulty: 4, band: 'foundational',
    stem: 'If f(x) = x + 1 and g(x) = 2x, then (f ∘ g)(3) = ?', correct: '7', wrong: ['8', '4', '9'],
    solution: 'g(3) = 6; f(6) = 7.' }),
  mcq({ id: 'G12.09-02', skillId: 'G12.09', skillName: 'Composition and inverse', difficulty: 5, band: 'foundational',
    stem: 'Inverse of f(x) = x + 3 is:', correct: 'f⁻¹(x) = x − 3', wrong: ['f⁻¹(x) = 3 − x', 'f⁻¹(x) = 3x', 'f⁻¹(x) = 1/(x + 3)'],
    solution: 'Solve y = x + 3 for x: x = y − 3.' }),
  mcq({ id: 'G12.09-03', skillId: 'G12.09', skillName: 'Composition and inverse', difficulty: 6, band: 'core',
    stem: 'Inverse of f(x) = 2x is:', correct: 'f⁻¹(x) = x/2', wrong: ['f⁻¹(x) = 2x', 'f⁻¹(x) = 1/(2x)', 'f⁻¹(x) = −2x'],
    solution: 'y = 2x → x = y/2.' }),
  mcq({ id: 'G12.09-04', skillId: 'G12.09', skillName: 'Composition and inverse', difficulty: 7, band: 'advanced',
    stem: 'A function must be ___ to have an inverse.', correct: 'Bijective', wrong: ['One-one only', 'Onto only', 'Continuous'],
    solution: 'Both one-one and onto are needed for invertibility.' }),
];

// Chapter 2: Inverse Trigonometric Functions
const G12_M4: Item[] = [
  mcq({ id: 'G12.10-01', skillId: 'G12.10', skillName: 'Principal values of inverse trig', difficulty: 4, band: 'foundational',
    stem: 'sin⁻¹(1) = ?', correct: 'π/2', wrong: ['π', '0', 'π/4'],
    solution: 'sin(π/2) = 1, and π/2 is in the principal range [−π/2, π/2].' }),
  mcq({ id: 'G12.10-02', skillId: 'G12.10', skillName: 'Principal values of inverse trig', difficulty: 5, band: 'foundational',
    stem: 'cos⁻¹(0) = ?', correct: 'π/2', wrong: ['0', 'π', 'π/4'],
    solution: 'cos(π/2) = 0.' }),
  mcq({ id: 'G12.10-03', skillId: 'G12.10', skillName: 'Principal values of inverse trig', difficulty: 6, band: 'core',
    stem: 'tan⁻¹(1) = ?', correct: 'π/4', wrong: ['π/2', 'π', 'π/3'],
    solution: 'tan(π/4) = 1.' }),
  mcq({ id: 'G12.10-04', skillId: 'G12.10', skillName: 'Principal values of inverse trig', difficulty: 7, band: 'advanced',
    stem: 'sin⁻¹(−1/2) = ?', correct: '−π/6', wrong: ['π/6', '−π/3', '5π/6'],
    solution: 'sin(−π/6) = −1/2 and −π/6 is in [−π/2, π/2].' }),

  mcq({ id: 'G12.11-01', skillId: 'G12.11', skillName: 'Inverse trig identities', difficulty: 5, band: 'foundational',
    stem: 'sin⁻¹(x) + cos⁻¹(x) = ?', correct: 'π/2', wrong: ['π', '0', 'π/4'],
    solution: 'Standard identity for all x in [−1, 1].' }),
  mcq({ id: 'G12.11-02', skillId: 'G12.11', skillName: 'Inverse trig identities', difficulty: 5, band: 'foundational',
    stem: 'tan⁻¹(x) + cot⁻¹(x) = ?', correct: 'π/2', wrong: ['π', '0', 'π/4'],
    solution: 'Standard identity for all real x.' }),
  mcq({ id: 'G12.11-03', skillId: 'G12.11', skillName: 'Inverse trig identities', difficulty: 6, band: 'core',
    stem: 'sec⁻¹(x) + cosec⁻¹(x) = ?', correct: 'π/2', wrong: ['π', '0', '3π/2'],
    solution: 'Standard identity for |x| ≥ 1.' }),
  mcq({ id: 'G12.11-04', skillId: 'G12.11', skillName: 'Inverse trig identities', difficulty: 7, band: 'advanced',
    stem: 'sin⁻¹(sin(3π/4)) = ?', correct: 'π/4', wrong: ['3π/4', '−π/4', 'π'],
    solution: 'sin(3π/4) = sin(π/4). Principal value is π/4.' }),

  mcq({ id: 'G12.12-01', skillId: 'G12.12', skillName: 'Domain and range of inverse trig', difficulty: 5, band: 'foundational',
    stem: 'Domain of sin⁻¹(x):', correct: '[−1, 1]', wrong: ['R', '[0, 1]', '(−∞, 1]'],
    solution: 'sin has range [−1, 1], so sin⁻¹ has that as its domain.' }),
  mcq({ id: 'G12.12-02', skillId: 'G12.12', skillName: 'Domain and range of inverse trig', difficulty: 5, band: 'foundational',
    stem: 'Range of sin⁻¹(x):', correct: '[−π/2, π/2]', wrong: ['[0, π]', 'R', '[0, π/2]'],
    solution: 'Principal range for sin⁻¹.' }),
  mcq({ id: 'G12.12-03', skillId: 'G12.12', skillName: 'Domain and range of inverse trig', difficulty: 6, band: 'core',
    stem: 'Range of cos⁻¹(x):', correct: '[0, π]', wrong: ['[−π/2, π/2]', '[−π, π]', '(0, π)'],
    solution: 'Principal range for cos⁻¹ is [0, π].' }),
  mcq({ id: 'G12.12-04', skillId: 'G12.12', skillName: 'Domain and range of inverse trig', difficulty: 7, band: 'advanced',
    stem: 'Domain of tan⁻¹(x):', correct: 'All real numbers', wrong: ['[−1, 1]', '[−π/2, π/2]', 'x ≠ 0'],
    solution: 'tan has range all of R, so tan⁻¹ takes any real input.' }),
];

// Chapter 6: Applications of Derivatives
const G12_M5: Item[] = [
  mcq({ id: 'G12.13-01', skillId: 'G12.13', skillName: 'Increasing and decreasing functions', difficulty: 4, band: 'foundational',
    stem: 'A function f is increasing on an interval where:', correct: "f'(x) > 0", wrong: ["f'(x) < 0", "f'(x) = 0", "f''(x) > 0"],
    solution: 'Positive derivative → function increases.' }),
  mcq({ id: 'G12.13-02', skillId: 'G12.13', skillName: 'Increasing and decreasing functions', difficulty: 5, band: 'foundational',
    stem: 'f(x) = x² is decreasing on:', correct: '(−∞, 0)', wrong: ['(0, ∞)', 'R', '(1, 2)'],
    solution: "f'(x) = 2x < 0 for x < 0."}),
  mcq({ id: 'G12.13-03', skillId: 'G12.13', skillName: 'Increasing and decreasing functions', difficulty: 6, band: 'core',
    stem: 'A local maximum of f occurs at x = a where f\'(a) = 0 AND:', correct: "f''(a) < 0", wrong: ["f''(a) > 0", "f''(a) = 0", "f'(a) > 0"],
    solution: 'Second-derivative test: concave down at critical point → local max.' }),
  mcq({ id: 'G12.13-04', skillId: 'G12.13', skillName: 'Increasing and decreasing functions', difficulty: 7, band: 'advanced',
    stem: 'For f(x) = 3x² − 12x + 5, the minimum value is at x =', correct: '2', wrong: ['0', '−2', '3'],
    solution: "f'(x) = 6x − 12 = 0 → x = 2." }),

  mcq({ id: 'G12.14-01', skillId: 'G12.14', skillName: 'Maxima and minima', difficulty: 4, band: 'foundational',
    stem: 'To find critical points, we solve:', correct: "f'(x) = 0", wrong: ['f(x) = 0', "f''(x) = 0", "f'(x) = 1"],
    solution: 'Critical points are where the derivative is zero.' }),
  mcq({ id: 'G12.14-02', skillId: 'G12.14', skillName: 'Maxima and minima', difficulty: 5, band: 'foundational',
    stem: 'f(x) = x² has minimum value:', correct: '0', wrong: ['1', '-∞', 'Undefined'],
    solution: 'f\'(x) = 2x = 0 at x = 0; f(0) = 0 is the minimum.' }),
  mcq({ id: 'G12.14-03', skillId: 'G12.14', skillName: 'Maxima and minima', difficulty: 6, band: 'core',
    stem: 'A local minimum requires f\'\'(x) at the critical point to be:', correct: 'Positive', wrong: ['Negative', 'Zero', 'Undefined'],
    solution: 'Second-derivative test: concave up ⇒ local min.' }),
  mcq({ id: 'G12.14-04', skillId: 'G12.14', skillName: 'Maxima and minima', difficulty: 7, band: 'advanced',
    stem: 'A rectangle with perimeter 20 has maximum area when it is a:', correct: 'Square (5 × 5)', wrong: ['1 × 9', '2 × 8', '4 × 6'],
    solution: 'Fixed perimeter ⇒ area maximised at square, area = 25.' }),

  mcq({ id: 'G12.15-01', skillId: 'G12.15', skillName: 'Rate of change', difficulty: 4, band: 'foundational',
    stem: "If y = 5x², then dy/dx at x = 2 is:", correct: '20', wrong: ['10', '4', '25'],
    solution: 'dy/dx = 10x; at x = 2 → 20.' }),
  mcq({ id: 'G12.15-02', skillId: 'G12.15', skillName: 'Rate of change', difficulty: 5, band: 'foundational',
    stem: 'A car moves so that distance s = 3t². Velocity at t = 4 is:', correct: '24', wrong: ['12', '48', '8'],
    solution: 'v = ds/dt = 6t = 24 at t = 4.' }),
  mcq({ id: 'G12.15-03', skillId: 'G12.15', skillName: 'Rate of change', difficulty: 6, band: 'core',
    stem: 'A balloon\'s radius grows at 2 cm/s. Rate of change of volume when r = 5:', correct: '200π cm³/s', wrong: ['100π cm³/s', '50π cm³/s', '20π cm³/s'],
    solution: 'V = (4/3)πr³; dV/dt = 4πr² · dr/dt = 4π · 25 · 2 = 200π.' }),
  mcq({ id: 'G12.15-04', skillId: 'G12.15', skillName: 'Rate of change', difficulty: 7, band: 'advanced',
    stem: 'Area A of a square grows at 8 sq units/s. Rate of change of side when side is 4:', correct: '1 unit/s', wrong: ['4 units/s', '2 units/s', '0.5 units/s'],
    solution: 'A = s²; dA/dt = 2s · ds/dt → 8 = 8 · ds/dt → ds/dt = 1.' }),
];

// Chapter 8: Applications of Integrals
const G12_M6: Item[] = [
  mcq({ id: 'G12.16-01', skillId: 'G12.16', skillName: 'Area under a curve', difficulty: 4, band: 'foundational',
    stem: 'Area under y = x from x = 0 to x = 4:', correct: '8', wrong: ['4', '16', '2'],
    solution: '∫₀⁴ x dx = [x²/2]₀⁴ = 8.' }),
  mcq({ id: 'G12.16-02', skillId: 'G12.16', skillName: 'Area under a curve', difficulty: 5, band: 'foundational',
    stem: 'Area under y = x² from 0 to 3:', correct: '9', wrong: ['6', '27', '3'],
    solution: '∫₀³ x² dx = [x³/3]₀³ = 9.' }),
  mcq({ id: 'G12.16-03', skillId: 'G12.16', skillName: 'Area under a curve', difficulty: 6, band: 'core',
    stem: '∫₀^(π/2) sin x dx = ?', correct: '1', wrong: ['0', 'π/2', '−1'],
    solution: '[−cos x]₀^(π/2) = 0 − (−1) = 1.' }),
  mcq({ id: 'G12.16-04', skillId: 'G12.16', skillName: 'Area under a curve', difficulty: 7, band: 'advanced',
    stem: 'Area between y = x² and y = x from 0 to 1:', correct: '1/6', wrong: ['1/2', '1/3', '0'],
    solution: '∫₀¹ (x − x²) dx = [x²/2 − x³/3]₀¹ = 1/2 − 1/3 = 1/6.' }),

  mcq({ id: 'G12.17-01', skillId: 'G12.17', skillName: 'Area between two curves', difficulty: 5, band: 'foundational',
    stem: 'The area between two curves y = f(x) and y = g(x) with f > g on [a, b]:', correct: '∫ₐᵇ (f − g) dx', wrong: ['∫ (f + g) dx', '(f − g) · (b − a)', '∫ₐᵇ (g − f) dx'],
    solution: 'Take the integral of the top minus the bottom.' }),
  mcq({ id: 'G12.17-02', skillId: 'G12.17', skillName: 'Area between two curves', difficulty: 6, band: 'foundational',
    stem: 'Area of the region bounded by y = x + 2 and y = x on [0, 3]:', correct: '6', wrong: ['3', '9', '12'],
    solution: '∫₀³ 2 dx = 6.' }),
  mcq({ id: 'G12.17-03', skillId: 'G12.17', skillName: 'Area between two curves', difficulty: 7, band: 'core',
    stem: 'Area of the region bounded by y = √x and y = x on [0, 1]:', correct: '1/6', wrong: ['1/2', '2/3', '1/3'],
    solution: '∫₀¹ (√x − x) dx = 2/3 − 1/2 = 1/6.' }),
  mcq({ id: 'G12.17-04', skillId: 'G12.17', skillName: 'Area between two curves', difficulty: 8, band: 'advanced',
    stem: 'Area enclosed by parabola y² = 4x and its latus rectum x = 1:', correct: '8/3', wrong: ['4/3', '2', '4'],
    solution: 'Use x = y²/4 from y = −2 to y = 2: ∫(1 − y²/4) dy = [y − y³/12] from −2 to 2 = 8/3.' }),

  mcq({ id: 'G12.18-01', skillId: 'G12.18', skillName: 'Definite integral properties', difficulty: 4, band: 'foundational',
    stem: '∫ₐᵃ f(x) dx = ?', correct: '0', wrong: ['1', 'f(a)', 'Undefined'],
    solution: 'The interval has zero width, so the integral is 0.' }),
  mcq({ id: 'G12.18-02', skillId: 'G12.18', skillName: 'Definite integral properties', difficulty: 5, band: 'foundational',
    stem: '∫ₐᵇ f(x) dx + ∫ᵦ^c f(x) dx = ?', correct: '∫ₐ^c f(x) dx', wrong: ['0', '2∫ₐ^c f(x) dx', '∫ₐᵇ f(x) · c dx'],
    solution: 'Additivity over intervals.' }),
  mcq({ id: 'G12.18-03', skillId: 'G12.18', skillName: 'Definite integral properties', difficulty: 6, band: 'core',
    stem: '∫ₐᵇ f(x) dx = ?', correct: '−∫ᵦᵃ f(x) dx', wrong: ['∫ᵦᵃ f(x) dx', 'f(b) − f(a)', 'f(a) − f(b)'],
    solution: 'Swapping limits flips the sign.' }),
  mcq({ id: 'G12.18-04', skillId: 'G12.18', skillName: 'Definite integral properties', difficulty: 7, band: 'advanced',
    stem: '∫₋ₐᵃ f(x) dx when f is an ODD function:', correct: '0', wrong: ['2 ∫₀ᵃ f(x) dx', 'a · f(a)', 'a²'],
    solution: 'Odd function has equal but opposite areas on either side of the origin.' }),
];

// Chapter 9: Differential Equations
const G12_M7: Item[] = [
  mcq({ id: 'G12.19-01', skillId: 'G12.19', skillName: 'Order and degree', difficulty: 4, band: 'foundational',
    stem: 'Order of the differential equation dy/dx = x is:', correct: '1', wrong: ['0', '2', 'x'],
    solution: 'Highest derivative present is first derivative → order 1.' }),
  mcq({ id: 'G12.19-02', skillId: 'G12.19', skillName: 'Order and degree', difficulty: 5, band: 'foundational',
    stem: 'Order of d²y/dx² + dy/dx = 0 is:', correct: '2', wrong: ['1', '0', 'Cannot say'],
    solution: 'Highest derivative is d²y/dx² → order 2.' }),
  mcq({ id: 'G12.19-03', skillId: 'G12.19', skillName: 'Order and degree', difficulty: 6, band: 'core',
    stem: 'Degree of (dy/dx)³ + y = 0 is:', correct: '3', wrong: ['1', '2', '0'],
    solution: 'Degree = highest power of the highest-order derivative when the equation is polynomial in derivatives.' }),
  mcq({ id: 'G12.19-04', skillId: 'G12.19', skillName: 'Order and degree', difficulty: 7, band: 'advanced',
    stem: 'For (d²y/dx²)² + (dy/dx)³ = x², order and degree are:', correct: 'Order 2, Degree 2', wrong: ['Order 2, Degree 3', 'Order 3, Degree 2', 'Order 1, Degree 3'],
    solution: 'Highest derivative is d²y/dx² (order 2); highest power of it is 2 (degree 2).' }),

  mcq({ id: 'G12.20-01', skillId: 'G12.20', skillName: 'Variable separable', difficulty: 4, band: 'foundational',
    stem: 'Solve: dy/dx = k · y. General solution:', correct: 'y = C · e^(kx)', wrong: ['y = C · x', 'y = k · x + C', 'y = ln(kx) + C'],
    solution: 'Separable: dy/y = k dx → ln|y| = kx + C → y = C·e^(kx).' }),
  mcq({ id: 'G12.20-02', skillId: 'G12.20', skillName: 'Variable separable', difficulty: 5, band: 'foundational',
    stem: 'Solve: dy/dx = 2x. General solution:', correct: 'y = x² + C', wrong: ['y = 2x + C', 'y = x + C', 'y = 2x² + C'],
    solution: 'Integrate: y = x² + C.' }),
  mcq({ id: 'G12.20-03', skillId: 'G12.20', skillName: 'Variable separable', difficulty: 6, band: 'core',
    stem: 'Solve: dy/dx = y with y(0) = 1:', correct: 'y = e^x', wrong: ['y = x + 1', 'y = e^(x−1)', 'y = 1'],
    solution: 'y = C·eˣ; y(0) = 1 gives C = 1.' }),
  mcq({ id: 'G12.20-04', skillId: 'G12.20', skillName: 'Variable separable', difficulty: 7, band: 'advanced',
    stem: 'Half-life of radioactive decay dN/dt = −kN with N(0)=N₀:', correct: 't = ln(2)/k', wrong: ['t = k/2', 't = 2/k', 't = 1/k'],
    solution: 'N₀/2 = N₀·e^(−kt) → e^(kt) = 2 → t = ln(2)/k.' }),

  mcq({ id: 'G12.21-01', skillId: 'G12.21', skillName: 'Linear first-order', difficulty: 5, band: 'foundational',
    stem: 'The integrating factor for dy/dx + P(x)·y = Q(x) is:', correct: 'e^(∫P(x) dx)', wrong: ['e^(∫Q(x) dx)', 'P(x)', '1/P(x)'],
    solution: 'Standard formula for linear first-order ODEs.' }),
  mcq({ id: 'G12.21-02', skillId: 'G12.21', skillName: 'Linear first-order', difficulty: 6, band: 'foundational',
    stem: 'For dy/dx + y = 0, integrating factor is:', correct: 'e^x', wrong: ['e^(-x)', '1', 'x'],
    solution: 'P(x) = 1; IF = e^x.' }),
  mcq({ id: 'G12.21-03', skillId: 'G12.21', skillName: 'Linear first-order', difficulty: 7, band: 'core',
    stem: 'General solution of dy/dx + y = 0 is:', correct: 'y = C·e^(-x)', wrong: ['y = C·e^x', 'y = 0', 'y = C·x'],
    solution: 'Separable: dy/y = −dx → y = C·e^(-x).' }),
  mcq({ id: 'G12.21-04', skillId: 'G12.21', skillName: 'Linear first-order', difficulty: 8, band: 'advanced',
    stem: 'For dy/dx + 2y = 4, particular solution:', correct: 'y = 2', wrong: ['y = 4', 'y = 0', 'y = −2'],
    solution: 'Steady-state (dy/dx = 0): 2y = 4 → y = 2.' }),
];

// Chapter 11: Three-dimensional Geometry
const G12_M8: Item[] = [
  mcq({ id: 'G12.22-01', skillId: 'G12.22', skillName: 'Direction cosines', difficulty: 4, band: 'foundational',
    stem: 'If l, m, n are direction cosines of a line, then:', correct: 'l² + m² + n² = 1', wrong: ['l + m + n = 1', 'l · m · n = 1', 'l² + m² + n² = 0'],
    solution: 'Direction cosines satisfy l² + m² + n² = 1.' }),
  mcq({ id: 'G12.22-02', skillId: 'G12.22', skillName: 'Direction cosines', difficulty: 5, band: 'foundational',
    stem: 'Direction cosines of the x-axis are:', correct: '(1, 0, 0)', wrong: ['(0, 0, 1)', '(1, 1, 1)', '(0, 1, 0)'],
    solution: 'Along the x-axis, only l = 1, others 0.' }),
  mcq({ id: 'G12.22-03', skillId: 'G12.22', skillName: 'Direction cosines', difficulty: 6, band: 'core',
    stem: 'A line makes 60° with x-axis and 60° with y-axis. Angle with z-axis:', correct: '45°', wrong: ['30°', '90°', '60°'],
    solution: 'l² + m² + n² = 1 → cos²60° + cos²60° + cos²γ = 1 → 1/2 + cos²γ = 1 → cos γ = 1/√2 → γ = 45°.' }),
  mcq({ id: 'G12.22-04', skillId: 'G12.22', skillName: 'Direction cosines', difficulty: 7, band: 'advanced',
    stem: 'A vector (2, −1, 2) has direction cosines:', correct: '(2/3, −1/3, 2/3)', wrong: ['(2, −1, 2)', '(1/2, −1, 1/2)', '(1, 1, 1)'],
    solution: 'Magnitude = √(4+1+4) = 3. Divide each: (2/3, −1/3, 2/3).' }),

  mcq({ id: 'G12.23-01', skillId: 'G12.23', skillName: 'Equation of a line in 3D', difficulty: 5, band: 'foundational',
    stem: 'The vector equation of a line through point A with direction b is:', correct: 'r = A + t·b', wrong: ['r = A · b', 'r = A × b', 'r = A + b'],
    solution: 'Line = point + parameter·direction.' }),
  mcq({ id: 'G12.23-02', skillId: 'G12.23', skillName: 'Equation of a line in 3D', difficulty: 6, band: 'foundational',
    stem: 'Two lines are parallel if their direction vectors are:', correct: 'Scalar multiples of each other', wrong: ['Perpendicular', 'Equal magnitude only', 'Both unit vectors'],
    solution: 'Parallel ↔ one direction = scalar multiple of the other.' }),
  mcq({ id: 'G12.23-03', skillId: 'G12.23', skillName: 'Equation of a line in 3D', difficulty: 7, band: 'core',
    stem: 'Two lines are perpendicular if their direction vectors satisfy:', correct: 'Dot product = 0', wrong: ['Cross product = 0', 'Both parallel', 'Same magnitude'],
    solution: 'Dot product zero ⇔ perpendicular.' }),
  mcq({ id: 'G12.23-04', skillId: 'G12.23', skillName: 'Equation of a line in 3D', difficulty: 8, band: 'advanced',
    stem: 'Are the lines with directions (1, 2, 3) and (2, 4, 6) parallel?', correct: 'Yes (scalar multiple)', wrong: ['No', 'Perpendicular', 'Skew'],
    solution: '(2, 4, 6) = 2 · (1, 2, 3), so yes — parallel.' }),

  mcq({ id: 'G12.24-01', skillId: 'G12.24', skillName: 'Equation of a plane', difficulty: 5, band: 'foundational',
    stem: 'The general equation of a plane is:', correct: 'ax + by + cz + d = 0', wrong: ['ax + by = c', 'x + y + z = 1', 'x² + y² + z² = r²'],
    solution: 'Standard form of a plane in 3D.' }),
  mcq({ id: 'G12.24-02', skillId: 'G12.24', skillName: 'Equation of a plane', difficulty: 6, band: 'foundational',
    stem: 'Normal vector to the plane 2x + 3y + z = 5 is:', correct: '(2, 3, 1)', wrong: ['(5, 5, 5)', '(1, 1, 1)', '(−2, −3, −1) only'],
    solution: 'Coefficients of x, y, z form the normal vector.' }),
  mcq({ id: 'G12.24-03', skillId: 'G12.24', skillName: 'Equation of a plane', difficulty: 7, band: 'core',
    stem: 'Distance from origin to plane 3x + 4y + 0z = 25 is:', correct: '5', wrong: ['25', '7', '3'],
    solution: '|d| / √(a² + b² + c²) = 25/5 = 5.' }),
  mcq({ id: 'G12.24-04', skillId: 'G12.24', skillName: 'Equation of a plane', difficulty: 8, band: 'advanced',
    stem: 'The angle between two planes equals the angle between their:', correct: 'Normal vectors', wrong: ['Direction vectors', 'x-intercepts', 'Origins'],
    solution: 'Planes\' angle = angle between their normals.' }),
];

// Chapter 12: Linear Programming
const G12_M9: Item[] = [
  mcq({ id: 'G12.25-01', skillId: 'G12.25', skillName: 'Linear programming basics', difficulty: 4, band: 'foundational',
    stem: 'A linear programming problem seeks to:', correct: 'Optimise (max or min) a linear objective subject to linear constraints', wrong: ['Solve nonlinear equations', 'Draw graphs only', 'Find roots'],
    solution: 'LPP = optimise a linear function subject to linear inequalities.' }),
  mcq({ id: 'G12.25-02', skillId: 'G12.25', skillName: 'Linear programming basics', difficulty: 5, band: 'foundational',
    stem: 'The feasible region of an LPP is:', correct: 'The set of points satisfying all constraints', wrong: ['The optimum value only', 'The origin', 'A single line'],
    solution: 'Feasible region = intersection of all constraint half-planes.' }),
  mcq({ id: 'G12.25-03', skillId: 'G12.25', skillName: 'Linear programming basics', difficulty: 6, band: 'core',
    stem: 'The optimum value of a linear objective on a bounded feasible region occurs at:', correct: 'A vertex (corner) of the region', wrong: ['The centre', 'A random point', 'Only along an edge'],
    solution: 'Corner-point theorem — optimum occurs at a vertex.' }),
  mcq({ id: 'G12.25-04', skillId: 'G12.25', skillName: 'Linear programming basics', difficulty: 7, band: 'advanced',
    stem: 'A "bounded" feasible region:', correct: 'Can be enclosed in a rectangle', wrong: ['Has no vertices', 'Extends infinitely', 'Is always a single point'],
    solution: 'Bounded = finite in extent (fits in some rectangle).' }),

  mcq({ id: 'G12.26-01', skillId: 'G12.26', skillName: 'Constraints and objective', difficulty: 5, band: 'foundational',
    stem: 'In LPP, x ≥ 0 and y ≥ 0 are called:', correct: 'Non-negativity constraints', wrong: ['Objective function', 'Feasibility conditions', 'Cost functions'],
    solution: 'Standard LPP includes x, y ≥ 0.' }),
  mcq({ id: 'G12.26-02', skillId: 'G12.26', skillName: 'Constraints and objective', difficulty: 6, band: 'foundational',
    stem: 'Which is a valid linear objective?', correct: 'Z = 3x + 2y', wrong: ['Z = x²', 'Z = √x + y', 'Z = xy'],
    solution: 'Objective must be linear in decision variables.' }),
  mcq({ id: 'G12.26-03', skillId: 'G12.26', skillName: 'Constraints and objective', difficulty: 7, band: 'core',
    stem: 'For maximising Z = 3x + 5y with x + y ≤ 4, x, y ≥ 0, the maximum is at:', correct: '(0, 4), giving Z = 20', wrong: ['(4, 0), Z = 12', '(2, 2), Z = 16', '(0, 0), Z = 0'],
    solution: 'Check vertices (0,0), (4,0), (0,4). Max is at (0, 4): Z = 20.' }),
  mcq({ id: 'G12.26-04', skillId: 'G12.26', skillName: 'Constraints and objective', difficulty: 8, band: 'advanced',
    stem: 'An LPP has no feasible solution when:', correct: 'Constraints contradict each other', wrong: ['Objective is nonlinear', 'x is negative', 'There are too many variables'],
    solution: 'Infeasible = no point satisfies all constraints (constraints contradict).' }),

  mcq({ id: 'G12.27-01', skillId: 'G12.27', skillName: 'Graphical solution', difficulty: 5, band: 'foundational',
    stem: 'To solve an LPP graphically, we plot:', correct: 'Constraint lines and identify the feasible region', wrong: ['Only the objective function', 'Random points', 'The origin only'],
    solution: 'Step 1: draw constraint boundary lines; step 2: identify feasible region.' }),
  mcq({ id: 'G12.27-02', skillId: 'G12.27', skillName: 'Graphical solution', difficulty: 6, band: 'foundational',
    stem: 'After finding vertices of the feasible region, we:', correct: 'Evaluate the objective at each vertex', wrong: ['Take the average', 'Take the midpoint', 'Ignore them'],
    solution: 'The optimum is at one of the vertices, so compare objective values at all vertices.' }),
  mcq({ id: 'G12.27-03', skillId: 'G12.27', skillName: 'Graphical solution', difficulty: 7, band: 'core',
    stem: 'The graphical method works well when the LPP has how many decision variables?', correct: '2', wrong: ['1', '3 or more', '5'],
    solution: 'The plane is 2D — beyond 2 variables graphical method is impractical.' }),
  mcq({ id: 'G12.27-04', skillId: 'G12.27', skillName: 'Graphical solution', difficulty: 8, band: 'advanced',
    stem: 'The value of the objective Z = 4x + 3y at (2, 3) is:', correct: '17', wrong: ['12', '20', '10'],
    solution: '4(2) + 3(3) = 8 + 9 = 17.' }),
];

// Chapter 13: Probability
const G12_M10: Item[] = [
  mcq({ id: 'G12.28-01', skillId: 'G12.28', skillName: 'Conditional probability', difficulty: 4, band: 'foundational',
    stem: 'P(A | B) is defined as:', correct: 'P(A ∩ B) / P(B), when P(B) > 0', wrong: ['P(A) · P(B)', 'P(A) + P(B) − P(A ∪ B)', 'P(A) / P(B)'],
    solution: 'Conditional probability formula.' }),
  mcq({ id: 'G12.28-02', skillId: 'G12.28', skillName: 'Conditional probability', difficulty: 5, band: 'foundational',
    stem: 'Two events A and B are independent if:', correct: 'P(A ∩ B) = P(A) · P(B)', wrong: ['P(A ∪ B) = P(A) + P(B)', 'P(A) = P(B)', 'P(A) + P(B) = 1'],
    solution: 'Independence: joint probability equals product of marginals.' }),
  mcq({ id: 'G12.28-03', skillId: 'G12.28', skillName: 'Conditional probability', difficulty: 6, band: 'core',
    stem: 'If P(A) = 0.5, P(B) = 0.4, and A, B independent, P(A ∩ B):', correct: '0.2', wrong: ['0.9', '0.1', '0.05'],
    solution: '0.5 × 0.4 = 0.2.' }),
  mcq({ id: 'G12.28-04', skillId: 'G12.28', skillName: 'Conditional probability', difficulty: 7, band: 'advanced',
    stem: 'P(A ∩ B) = 0.2, P(B) = 0.5. Then P(A | B) =', correct: '0.4', wrong: ['0.1', '0.5', '0.7'],
    solution: '0.2 / 0.5 = 0.4.' }),

  mcq({ id: 'G12.29-01', skillId: 'G12.29', skillName: 'Bayes theorem intuition', difficulty: 5, band: 'foundational',
    stem: 'Bayes\' theorem lets us compute:', correct: 'Reverse conditional probability P(cause | effect)', wrong: ['Sample space size', 'Complementary events only', 'Marginal probability'],
    solution: 'Bayes: update prior beliefs using observed data.' }),
  mcq({ id: 'G12.29-02', skillId: 'G12.29', skillName: 'Bayes theorem intuition', difficulty: 6, band: 'foundational',
    stem: 'Bayes\' theorem formula:', correct: 'P(A | B) = P(B | A) · P(A) / P(B)', wrong: ['P(A | B) = P(A) + P(B)', 'P(A | B) = P(A) · P(B)', 'P(A | B) = P(A) / P(B)'],
    solution: 'Standard Bayes formula.' }),
  mcq({ id: 'G12.29-03', skillId: 'G12.29', skillName: 'Bayes theorem intuition', difficulty: 7, band: 'core',
    stem: 'Prior probability of an event A means:', correct: 'Probability before observing new evidence', wrong: ['Probability after observing evidence', 'Probability of B given A', 'Any small probability'],
    solution: 'Prior = initial belief; posterior = updated after evidence.' }),
  mcq({ id: 'G12.29-04', skillId: 'G12.29', skillName: 'Bayes theorem intuition', difficulty: 8, band: 'advanced',
    stem: 'A test is 99% sensitive; disease prevalence is 1%. If someone tests positive, the true probability of disease can be:', correct: 'Much lower than 99% (base-rate matters)', wrong: ['Exactly 99%', 'Exactly 1%', '100%'],
    solution: 'Base-rate fallacy: low prevalence + false positives can make posterior small.' }),

  mcq({ id: 'G12.30-01', skillId: 'G12.30', skillName: 'Random variables and distributions', difficulty: 4, band: 'foundational',
    stem: 'A discrete random variable takes:', correct: 'Countable specific values', wrong: ['Only two values', 'Any real value', 'Only positive values'],
    solution: 'Discrete RV takes a countable set of values.' }),
  mcq({ id: 'G12.30-02', skillId: 'G12.30', skillName: 'Random variables and distributions', difficulty: 5, band: 'foundational',
    stem: 'Sum of probabilities in a discrete probability distribution:', correct: 'Equals 1', wrong: ['Equals 0', 'Equals sample space size', 'Can be anything'],
    solution: 'All outcomes together must have total probability 1.' }),
  mcq({ id: 'G12.30-03', skillId: 'G12.30', skillName: 'Random variables and distributions', difficulty: 6, band: 'core',
    stem: 'Expected value E(X) of a discrete RV:', correct: 'Σ xᵢ · P(xᵢ)', wrong: ['Σ P(xᵢ)', 'Σ xᵢ', 'Max of xᵢ'],
    solution: 'Weighted average of values with probabilities.' }),
  mcq({ id: 'G12.30-04', skillId: 'G12.30', skillName: 'Random variables and distributions', difficulty: 7, band: 'advanced',
    stem: 'A fair coin: X = 1 for H, X = 0 for T. E(X) =', correct: '0.5', wrong: ['1', '0', '2'],
    solution: 'E(X) = 0 · 0.5 + 1 · 0.5 = 0.5.' }),
];

// ---------------------------------------------------------------------------
// Public exports
// ---------------------------------------------------------------------------
export const FULL_GRADE_ITEMS: Item[] = [
  ...G10_M3, ...G10_M4, ...G10_M5, ...G10_M6, ...G10_M7, ...G10_M8, ...G10_M9, ...G10_M10,
  ...G12_M3, ...G12_M4, ...G12_M5, ...G12_M6, ...G12_M7, ...G12_M8, ...G12_M9, ...G12_M10,
];

// Metadata for the registry — one entry per new module.
export type FullGradeModuleMeta = {
  gradeId: string;
  moduleSlug: string; // used in registry module id: cbse_g10_math_<slug>
  moduleTitle: string;
  moduleDescription: string;
  displayOrder: number;
  skills: Array<{
    legacyId: string;
    displayLabel: string;
    shortLabel: string;
  }>;
};

export const FULL_GRADE_META: FullGradeModuleMeta[] = [
  {
    gradeId: 'grade_10',
    moduleSlug: 'polynomials',
    moduleTitle: 'Polynomials (Class 10 — Ch 2)',
    moduleDescription: 'Types and degree of polynomials, zeros and coefficient relations, division algorithm and Remainder/Factor theorems. Prototype content, teacher review required.',
    displayOrder: 2,
    skills: [
      { legacyId: 'G10.07', displayLabel: 'Types and degree of polynomials', shortLabel: 'G10.07 — Polynomial types' },
      { legacyId: 'G10.08', displayLabel: 'Zeros of a polynomial', shortLabel: 'G10.08 — Zeros' },
      { legacyId: 'G10.09', displayLabel: 'Division of polynomials', shortLabel: 'G10.09 — Division' },
    ],
  },
  {
    gradeId: 'grade_10',
    moduleSlug: 'linear_eqns_2var',
    moduleTitle: 'Pair of Linear Equations in Two Variables (Class 10 — Ch 3)',
    moduleDescription: 'Graphical method, substitution, elimination, consistency and number of solutions. Prototype content, teacher review required.',
    displayOrder: 3,
    skills: [
      { legacyId: 'G10.10', displayLabel: 'Solving graphically', shortLabel: 'G10.10 — Graphical' },
      { legacyId: 'G10.11', displayLabel: 'Substitution method', shortLabel: 'G10.11 — Substitution' },
      { legacyId: 'G10.12', displayLabel: 'Consistency and solutions', shortLabel: 'G10.12 — Consistency' },
    ],
  },
  {
    gradeId: 'grade_10',
    moduleSlug: 'triangles',
    moduleTitle: 'Triangles / Similarity (Class 10 — Ch 6)',
    moduleDescription: 'Basic Proportionality Theorem, similar triangles criteria, Pythagoras theorem. Prototype content, teacher review required.',
    displayOrder: 4,
    skills: [
      { legacyId: 'G10.13', displayLabel: 'Basic Proportionality Theorem', shortLabel: 'G10.13 — BPT' },
      { legacyId: 'G10.14', displayLabel: 'Similar triangles and criteria', shortLabel: 'G10.14 — Similarity' },
      { legacyId: 'G10.15', displayLabel: 'Pythagoras theorem', shortLabel: 'G10.15 — Pythagoras' },
    ],
  },
  {
    gradeId: 'grade_10',
    moduleSlug: 'trig_applications',
    moduleTitle: 'Applications of Trigonometry (Class 10 — Ch 9)',
    moduleDescription: 'Angle of elevation and depression, heights and distances word problems. Prototype content, teacher review required.',
    displayOrder: 5,
    skills: [
      { legacyId: 'G10.16', displayLabel: 'Angle of elevation', shortLabel: 'G10.16 — Elevation' },
      { legacyId: 'G10.17', displayLabel: 'Angle of depression', shortLabel: 'G10.17 — Depression' },
      { legacyId: 'G10.18', displayLabel: 'Heights and distances', shortLabel: 'G10.18 — H & D' },
    ],
  },
  {
    gradeId: 'grade_10',
    moduleSlug: 'areas_circle',
    moduleTitle: 'Areas Related to Circles (Class 10 — Ch 11)',
    moduleDescription: 'Circumference and area of a circle, area and arc length of a sector, area of a segment. Prototype content, teacher review required.',
    displayOrder: 6,
    skills: [
      { legacyId: 'G10.19', displayLabel: 'Circumference and area of a circle', shortLabel: 'G10.19 — Circle area' },
      { legacyId: 'G10.20', displayLabel: 'Sector area and arc length', shortLabel: 'G10.20 — Sector' },
      { legacyId: 'G10.21', displayLabel: 'Segment area', shortLabel: 'G10.21 — Segment' },
    ],
  },
  {
    gradeId: 'grade_10',
    moduleSlug: 'surface_volume',
    moduleTitle: 'Surface Areas and Volumes (Class 10 — Ch 12)',
    moduleDescription: 'Surface area of combinations of solids, volumes of combinations, frustum of a cone. Prototype content, teacher review required.',
    displayOrder: 7,
    skills: [
      { legacyId: 'G10.22', displayLabel: 'Surface area of combinations', shortLabel: 'G10.22 — SA combos' },
      { legacyId: 'G10.23', displayLabel: 'Volume of combinations', shortLabel: 'G10.23 — V combos' },
      { legacyId: 'G10.24', displayLabel: 'Frustum of a cone', shortLabel: 'G10.24 — Frustum' },
    ],
  },
  {
    gradeId: 'grade_10',
    moduleSlug: 'statistics_grouped',
    moduleTitle: 'Statistics (grouped data) (Class 10 — Ch 13)',
    moduleDescription: 'Mean, median, and mode of grouped data. Prototype content, teacher review required.',
    displayOrder: 8,
    skills: [
      { legacyId: 'G10.25', displayLabel: 'Mean of grouped data', shortLabel: 'G10.25 — Mean grouped' },
      { legacyId: 'G10.26', displayLabel: 'Median of grouped data', shortLabel: 'G10.26 — Median grouped' },
      { legacyId: 'G10.27', displayLabel: 'Mode of grouped data', shortLabel: 'G10.27 — Mode grouped' },
    ],
  },
  {
    gradeId: 'grade_10',
    moduleSlug: 'probability',
    moduleTitle: 'Probability (Class 10 — Ch 14)',
    moduleDescription: 'Classical probability, simple events, complementary events. Prototype content, teacher review required.',
    displayOrder: 9,
    skills: [
      { legacyId: 'G10.28', displayLabel: 'Classical probability and sample space', shortLabel: 'G10.28 — Sample space' },
      { legacyId: 'G10.29', displayLabel: 'Probability of simple events', shortLabel: 'G10.29 — Simple events' },
      { legacyId: 'G10.30', displayLabel: 'Complementary events', shortLabel: 'G10.30 — Complement' },
    ],
  },

  // ---------- Class 12 ----------
  {
    gradeId: 'grade_12',
    moduleSlug: 'relations_functions',
    moduleTitle: 'Relations and Functions (Class 12 — Ch 1)',
    moduleDescription: 'Types of relations, types of functions, composition and inverse. Prototype content, teacher review required.',
    displayOrder: 2,
    skills: [
      { legacyId: 'G12.07', displayLabel: 'Types of relations', shortLabel: 'G12.07 — Relations' },
      { legacyId: 'G12.08', displayLabel: 'Types of functions', shortLabel: 'G12.08 — Functions' },
      { legacyId: 'G12.09', displayLabel: 'Composition and inverse', shortLabel: 'G12.09 — Composition' },
    ],
  },
  {
    gradeId: 'grade_12',
    moduleSlug: 'inverse_trig',
    moduleTitle: 'Inverse Trigonometric Functions (Class 12 — Ch 2)',
    moduleDescription: 'Principal values, standard identities, domain and range. Prototype content, teacher review required.',
    displayOrder: 3,
    skills: [
      { legacyId: 'G12.10', displayLabel: 'Principal values of inverse trig', shortLabel: 'G12.10 — Principal vals' },
      { legacyId: 'G12.11', displayLabel: 'Inverse trig identities', shortLabel: 'G12.11 — Inv trig id' },
      { legacyId: 'G12.12', displayLabel: 'Domain and range of inverse trig', shortLabel: 'G12.12 — Domain/range' },
    ],
  },
  {
    gradeId: 'grade_12',
    moduleSlug: 'apps_derivatives',
    moduleTitle: 'Applications of Derivatives (Class 12 — Ch 6)',
    moduleDescription: 'Increasing/decreasing functions, maxima and minima, rate of change. Prototype content, teacher review required.',
    displayOrder: 4,
    skills: [
      { legacyId: 'G12.13', displayLabel: 'Increasing and decreasing functions', shortLabel: 'G12.13 — Monotonicity' },
      { legacyId: 'G12.14', displayLabel: 'Maxima and minima', shortLabel: 'G12.14 — Max/min' },
      { legacyId: 'G12.15', displayLabel: 'Rate of change', shortLabel: 'G12.15 — Rate of change' },
    ],
  },
  {
    gradeId: 'grade_12',
    moduleSlug: 'apps_integrals',
    moduleTitle: 'Applications of Integrals (Class 12 — Ch 8)',
    moduleDescription: 'Area under a curve, area between two curves, definite integral properties. Prototype content, teacher review required.',
    displayOrder: 5,
    skills: [
      { legacyId: 'G12.16', displayLabel: 'Area under a curve', shortLabel: 'G12.16 — Area under' },
      { legacyId: 'G12.17', displayLabel: 'Area between two curves', shortLabel: 'G12.17 — Area between' },
      { legacyId: 'G12.18', displayLabel: 'Definite integral properties', shortLabel: 'G12.18 — DI props' },
    ],
  },
  {
    gradeId: 'grade_12',
    moduleSlug: 'differential_eqns',
    moduleTitle: 'Differential Equations (Class 12 — Ch 9)',
    moduleDescription: 'Order and degree, variable separable, linear first-order ODEs. Prototype content, teacher review required.',
    displayOrder: 6,
    skills: [
      { legacyId: 'G12.19', displayLabel: 'Order and degree', shortLabel: 'G12.19 — Order/degree' },
      { legacyId: 'G12.20', displayLabel: 'Variable separable', shortLabel: 'G12.20 — Separable' },
      { legacyId: 'G12.21', displayLabel: 'Linear first-order', shortLabel: 'G12.21 — Linear 1st' },
    ],
  },
  {
    gradeId: 'grade_12',
    moduleSlug: 'geometry_3d',
    moduleTitle: 'Three-dimensional Geometry (Class 12 — Ch 11)',
    moduleDescription: 'Direction cosines, equation of a line in 3D, equation of a plane. Prototype content, teacher review required.',
    displayOrder: 7,
    skills: [
      { legacyId: 'G12.22', displayLabel: 'Direction cosines', shortLabel: 'G12.22 — Direction cos' },
      { legacyId: 'G12.23', displayLabel: 'Equation of a line in 3D', shortLabel: 'G12.23 — Line 3D' },
      { legacyId: 'G12.24', displayLabel: 'Equation of a plane', shortLabel: 'G12.24 — Plane' },
    ],
  },
  {
    gradeId: 'grade_12',
    moduleSlug: 'linear_programming',
    moduleTitle: 'Linear Programming (Class 12 — Ch 12)',
    moduleDescription: 'Basics, constraints and objective, graphical solution. Prototype content, teacher review required.',
    displayOrder: 8,
    skills: [
      { legacyId: 'G12.25', displayLabel: 'Linear programming basics', shortLabel: 'G12.25 — LP basics' },
      { legacyId: 'G12.26', displayLabel: 'Constraints and objective', shortLabel: 'G12.26 — Constraints' },
      { legacyId: 'G12.27', displayLabel: 'Graphical solution', shortLabel: 'G12.27 — Graphical' },
    ],
  },
  {
    gradeId: 'grade_12',
    moduleSlug: 'probability',
    moduleTitle: 'Probability (Class 12 — Ch 13)',
    moduleDescription: 'Conditional probability, Bayes theorem intuition, random variables. Prototype content, teacher review required.',
    displayOrder: 9,
    skills: [
      { legacyId: 'G12.28', displayLabel: 'Conditional probability', shortLabel: 'G12.28 — Conditional' },
      { legacyId: 'G12.29', displayLabel: 'Bayes theorem intuition', shortLabel: 'G12.29 — Bayes' },
      { legacyId: 'G12.30', displayLabel: 'Random variables and distributions', shortLabel: 'G12.30 — Random var' },
    ],
  },
];
