// Learning materials for the Class 6 Fractions Module.
//
// As of v0.6, every skill page carries:
//   - intro:           1-2 sentence summary of what the skill is.
//   - reteach:         a numbered re-teach lesson (3-6 steps).
//   - visualExplanation: one inline visual + caption + step-by-step
//                      reading of that visual.
//   - workedExamples:  2 fully-worked problems per skill (foundational +
//                      core/advanced), each with numbered steps and a
//                      final answer.
//   - commonMistakes:  3 specific student errors per skill, each with a
//                      "what it looks like / why students do it / how to
//                      fix it" trio.
//   - practice:        5 hand-picked item IDs from src/data/items.ts,
//                      ordered easy → hard. Surfaced as a guided strip.
//   - teacherNote:     one classroom-intervention note for the teacher.
//   - parentNote:      one parent-friendly home-practice tip.
//
// These are content drafts for the prototype, NOT a published curriculum.
// They should be reviewed by a CBSE Class 6 math teacher before any real
// student sees them.

import type { VisualSpec } from './items';
import type { SkillId } from '../types';

export type LessonStep = string;

export type LessonVisual = {
  caption: string;
  visual: VisualSpec;
  // Step-by-step reading of the visual ("count the cells", "now identify
  // shaded", etc.). Renders as a numbered list under the picture.
  readingSteps: string[];
};

export type WorkedExample = {
  // The problem statement (what the student would see).
  problem: string;
  // Numbered step-by-step solution. Be concrete — show arithmetic.
  steps: string[];
  // The final answer, in the form a student would write.
  answer: string;
};

export type CommonMistake = {
  // Short pattern label.
  pattern: string;
  // What the wrong answer looks like ("e.g., 1/2 + 1/4 = 2/6").
  example: string;
  // Why students do this — the underlying misunderstanding.
  why: string;
  // How to fix or re-teach it.
  fix: string;
};

export type Lesson = {
  skillId: SkillId;
  intro: string;
  reteach: {
    title: string;
    steps: LessonStep[];
  };
  visualExplanation: LessonVisual;
  workedExamples: WorkedExample[];
  commonMistakes: CommonMistake[];
  practice: string[]; // item IDs
  teacherNote: string;
  parentNote: string;
};

export const LESSONS: Record<SkillId, Lesson> = {
  // -------------------------------------------------------------------------
  // FR.02 — Represent fractions visually
  // -------------------------------------------------------------------------
  'FR.02': {
    skillId: 'FR.02',
    intro:
      'A fraction names a part of one whole that has been split into equal pieces. The bottom number (denominator) is the number of equal pieces; the top number (numerator) is how many of those pieces you mean.',
    reteach: {
      title: 'Reteach: reading a fraction from a picture',
      steps: [
        'Find the whole. It is the full bar, the full square, or the full strip — not just the shaded part.',
        'Count the total number of EQUAL pieces in the whole. Write that number as the denominator (the bottom).',
        'Count the shaded pieces. Write that number as the numerator (the top).',
        'Read the fraction aloud as "numerator out of denominator". For example, 3 out of 5 is written 3/5.',
        'Sanity check: 0/denominator means nothing is shaded; numerator/denominator (where they match) means everything is shaded — i.e., 1.',
      ],
    },
    visualExplanation: {
      caption:
        'A bar split into 5 equal parts with 3 of them shaded. The fraction shaded is 3/5.',
      visual: {
        kind: 'bars',
        bars: [{ numerator: 3, denominator: 5, label: '3/5' }],
      },
      readingSteps: [
        'The whole is the full bar — including the unshaded parts.',
        'Count cells in the bar: 1, 2, 3, 4, 5. So the denominator is 5.',
        'Count shaded cells: 1, 2, 3. So the numerator is 3.',
        'Write the fraction: 3/5. Read aloud: "three-fifths".',
      ],
    },
    workedExamples: [
      {
        problem:
          'A square is divided into a 2×4 grid of 8 equal cells. 5 are shaded. Write the fraction shaded.',
        steps: [
          'Identify the whole: the entire square.',
          'Count total equal cells: 2 × 4 = 8. This is the denominator.',
          'Count shaded cells: 5. This is the numerator.',
        ],
        answer: '5/8',
      },
      {
        problem:
          'A pizza is cut into 8 equal slices. Aarav eats 3 slices and Bhavna eats 2 slices. What fraction of the pizza was eaten in total?',
        steps: [
          'Total equal pieces in the whole pizza: 8 (so the denominator is 8).',
          'Slices eaten in total: 3 + 2 = 5 (so the numerator is 5).',
          'Write the fraction: 5/8 of the pizza.',
        ],
        answer: '5/8',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Counting only the shaded pieces',
        example: 'Says "3" instead of writing 3/5 when 3 of 5 cells are shaded.',
        why: 'The student treats the picture like a counting question. They forget that a fraction also needs the size of the whole.',
        fix: 'Insist on naming both numbers: total equal pieces first, then shaded. Have the student point and count both, out loud.',
      },
      {
        pattern: 'Including unequal slices',
        example:
          'Calls a circle "1/4 shaded" when the circle is split into 4 unequal slices and 1 is shaded.',
        why: 'The student counts pieces but does not check whether they are equal. Fractions assume the whole is split into equal parts.',
        fix: 'Re-anchor with a ruler: pieces have to be the same size. If they are not, the fraction is meaningless until the whole is re-divided into equal parts.',
      },
      {
        pattern: 'Flipping the fraction',
        example: 'Writes 5/3 when 3 of 5 cells are shaded.',
        why: 'The student writes the bigger number on top out of habit ("bigger numerator looks more like an answer"). They confuse the role of numerator and denominator.',
        fix: 'Use the language "out of": 3 OUT OF 5. The "out of" number is always the denominator (bottom).',
      },
    ],
    practice: ['FR.02-01', 'FR.02-04', 'FR.02-05', 'FR.02-08', 'FR.02-12'],
    teacherNote:
      'For students who only count shaded cells, slow down on the "count the total" step. Have them point to each cell and say its number out loud before they write the fraction. Re-do the same picture twice — once for total, once for shaded.',
    parentNote:
      'Cut a roti into equal pieces with your child. Ask "how many pieces in total" and "how many are left" before they say a fraction. Insist that the pieces look equal — that is exactly what the denominator promises.',
  },

  // -------------------------------------------------------------------------
  // FR.03 — Equivalent fractions
  // -------------------------------------------------------------------------
  'FR.03': {
    skillId: 'FR.03',
    intro:
      'Two fractions are equivalent if they show the same amount of the same whole. You can build an equivalent fraction by multiplying the top and bottom by the same non-zero number, or simplify one by dividing both by their highest common factor (HCF).',
    reteach: {
      title: 'Reteach: making and simplifying equivalent fractions',
      steps: [
        'To go from a small denominator to a bigger one: pick a multiplier k. Multiply BOTH numerator and denominator by k.',
        'To go from a big denominator to a smaller one (simplify): find HCF(numerator, denominator). Divide BOTH by it.',
        'Always check: did you change top AND bottom by the same factor? If you only changed one, the fraction is no longer equivalent.',
        'If the question asks for "simplest form", keep dividing until the HCF of top and bottom is 1.',
      ],
    },
    visualExplanation: {
      caption:
        'Two equal bars: 1/2 of the first is shaded, 2/4 of the second. The shaded length is identical, so 1/2 = 2/4.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 1, denominator: 2, label: '1/2' },
          { numerator: 2, denominator: 4, label: '2/4' },
        ],
      },
      readingSteps: [
        'Both bars are the same length — they are the same whole.',
        'Top bar: 1 of 2 equal pieces is shaded. Bottom bar: 2 of 4 equal pieces are shaded.',
        'Compare the shaded lengths: they are exactly the same.',
        'So 1/2 and 2/4 represent the same amount — they are equivalent fractions.',
      ],
    },
    workedExamples: [
      {
        problem: 'Fill in the blank: 2/3 = ?/12.',
        steps: [
          'Look at the denominator: it has changed from 3 to 12.',
          'Find the multiplier: 12 ÷ 3 = 4.',
          'Multiply the numerator by the same multiplier: 2 × 4 = 8.',
          'So 2/3 = 8/12.',
        ],
        answer: '8',
      },
      {
        problem: 'Simplify 18/24 to its simplest form.',
        steps: [
          'Find the HCF of 18 and 24. Factors of 18: 1, 2, 3, 6, 9, 18. Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. HCF = 6.',
          'Divide both numerator and denominator by 6: 18 ÷ 6 = 3, 24 ÷ 6 = 4.',
          'Check: HCF(3, 4) = 1, so the fraction is now in simplest form.',
        ],
        answer: '3/4',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Multiplying only the numerator (or only the denominator)',
        example:
          'Says 2/3 = 2/12 (denominator multiplied by 4 but numerator left as 2).',
        why: 'The student remembers "make the denominator 12" but forgets the equivalence rule: whatever you do to the bottom, you must do to the top.',
        fix: 'Say it out loud as a slogan: "k over k equals 1". Multiplying by k/k changes nothing because it is multiplying by 1. Practise "I multiplied the bottom by 4, so I must multiply the top by 4 too."',
      },
      {
        pattern: 'Stopping before simplest form',
        example: 'Writes 18/24 = 9/12 and stops.',
        why:
          'The student divided by some common factor (here, 2) but did not check whether more factors are still shared. 9/12 still has HCF 3.',
        fix: 'Keep dividing until HCF(top, bottom) = 1. A safe rule: try the biggest common factor first (the HCF), then you only divide once.',
      },
      {
        pattern: 'Treating "different denominators" as automatically different fractions',
        example: 'Says 4/6 ≠ 2/3 because "the denominators are different."',
        why: 'The student looks at the symbols and stops. They have not checked whether one simplifies to the other.',
        fix:
          'Always simplify both fractions to simplest form first; if they match, they are equivalent. Use the bar visual: 4/6 of a bar IS the same length as 2/3 of the same bar.',
      },
    ],
    practice: ['FR.03-01', 'FR.03-05', 'FR.03-06', 'FR.03-09', 'FR.03-12'],
    teacherNote:
      'When a student says "2/3 = 2/12", say "good — you found the new denominator. Now what number did you multiply the bottom by?" Lead them to do the same to the top. The fix is almost always the question "what did you multiply by?", not a re-teach of the whole topic.',
    parentNote:
      'Use a recipe at home. If a recipe says "1/2 cup" and your child only has a 1/4-cup measure, ask them to figure out how many 1/4-cups make 1/2 cup. That is the equivalent-fraction idea in disguise.',
  },

  // -------------------------------------------------------------------------
  // FR.04 — Mixed numbers and improper fractions
  // -------------------------------------------------------------------------
  'FR.04': {
    skillId: 'FR.04',
    intro:
      'A mixed number is one or more wholes plus a proper fraction (e.g., 2 1/4). An improper fraction has a numerator that is at least as big as the denominator (e.g., 9/4). They are two ways of writing the same value.',
    reteach: {
      title: 'Reteach: mixed ↔ improper fractions',
      steps: [
        'Mixed → improper: numerator = (whole × denominator) + numerator. Denominator stays the same.',
        'Improper → mixed: divide numerator by denominator. The quotient is the whole part; the remainder becomes the new numerator over the same denominator.',
        'Check with a picture: 2 1/4 is "two full wholes and a quarter". 9/4 is "nine quarter-pieces". They are the same total amount.',
        'Watch out for the second step in mixed → improper. After the multiplication, you still have to ADD the original numerator before writing the new top.',
      ],
    },
    visualExplanation: {
      caption:
        'One full bar plus 1/4 of a second equal bar. Together they show 1 1/4 (= 5/4).',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 4, denominator: 4, label: 'Whole' },
          { numerator: 1, denominator: 4, label: '1/4' },
        ],
      },
      readingSteps: [
        'The first bar is fully shaded — that is one whole, or 4/4.',
        'The second bar of the same size has 1 of 4 cells shaded — that is 1/4.',
        'Combined: 4/4 + 1/4 = 5/4 quarter-pieces of the whole.',
        'As a mixed number, 5/4 is 1 whole + 1/4 = 1 1/4.',
      ],
    },
    workedExamples: [
      {
        problem: 'Convert 2 3/4 to an improper fraction.',
        steps: [
          'Multiply the whole part by the denominator: 2 × 4 = 8.',
          'Add the original numerator: 8 + 3 = 11.',
          'Write that over the same denominator: 11/4.',
        ],
        answer: '11/4',
      },
      {
        problem: 'Convert 17/4 to a mixed number.',
        steps: [
          'Divide 17 by 4: 17 ÷ 4 = 4 remainder 1.',
          'Quotient is the whole part: 4.',
          'Remainder is the new numerator over the same denominator: 1/4.',
          'Combine: 4 1/4.',
        ],
        answer: '4 1/4',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Forgetting to add the numerator',
        example: 'Says 2 3/4 = 8/4 (multiplied 2 × 4 but did not add the 3).',
        why: 'The student remembers "multiply" but not the second step. The mental picture is incomplete.',
        fix:
          'Re-anchor with bars: 2 wholes are 8/4, and the leftover 3/4 is on top of that, so the total is 8/4 + 3/4 = 11/4. The "+ numerator" step is exactly the leftover piece.',
      },
      {
        pattern: 'Concatenating digits instead of converting',
        example: 'Says 5 1/2 = 51/2.',
        why: 'The student treats the mixed number as if the whole and numerator were two digits of one number.',
        fix: 'Slow down: a mixed number is a SUM (whole + fraction). Always rewrite as 5 + 1/2 first. Then convert: (5 × 2 + 1)/2 = 11/2.',
      },
      {
        pattern: 'Wrong remainder when going improper → mixed',
        example: 'Says 11/3 = 2 5/3 (used quotient 2 with the wrong remainder).',
        why:
          'The student remembers to divide but mishandles the remainder, often putting the dividend digits back as the new numerator.',
        fix:
          'Walk through the long division explicitly: 11 ÷ 3 = 3 with remainder 2 (because 3 × 3 = 9, and 11 − 9 = 2). The remainder MUST be smaller than the denominator.',
      },
    ],
    practice: ['FR.04-01', 'FR.04-02', 'FR.04-05', 'FR.04-06', 'FR.04-11'],
    teacherNote:
      'Test with a quick "say the steps" exercise: ask the student to convert 3 2/5 out loud, naming each step ("3 times 5 is 15, plus 2 is 17, over 5"). The verbal walk often surfaces the missed step before the written work does.',
    parentNote:
      'When you have 1-and-a-bit of something at home (1 and a half rotis, 2 and a quarter cups), ask your child to write it as an improper fraction. The kitchen is the easiest fraction lab in the house.',
  },

  // -------------------------------------------------------------------------
  // FR.05 — Add and subtract with like denominators
  // -------------------------------------------------------------------------
  'FR.05': {
    skillId: 'FR.05',
    intro:
      'When two fractions already have the SAME denominator (their pieces are the same size), adding or subtracting them is just adding or subtracting the numerators. The denominator does not change.',
    reteach: {
      title: 'Reteach: add/subtract with like denominators',
      steps: [
        'Check that the denominators match. If they do not, this is a different lesson — see FR.06 / FR.07.',
        'Add or subtract the NUMERATORS only. Keep the same denominator.',
        'Simplify the answer if possible (FR.03). Convert to a mixed number if it is improper (FR.04).',
        'Why doesn\'t the denominator change? Because the SIZE of each piece does not change — only the NUMBER of pieces does.',
      ],
    },
    visualExplanation: {
      caption:
        'Two equal bars, each split into fifths: 2/5 + 1/5 = 3/5. The piece-size is the same, so we just count pieces.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 2, denominator: 5, label: '2/5' },
          { numerator: 1, denominator: 5, label: '1/5' },
        ],
      },
      readingSteps: [
        'Each cell is one-fifth of the same whole.',
        'Top bar: 2 fifths shaded. Bottom bar: 1 fifth shaded.',
        'Combined: 2 fifths + 1 fifth = 3 fifths.',
        'The denominator stays as 5 because the piece-size never changed.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute 5/8 + 3/8.',
        steps: [
          'Denominators are both 8 — they already match.',
          'Add the numerators: 5 + 3 = 8.',
          'Keep the denominator: 8/8.',
          'Simplify: 8/8 = 1.',
        ],
        answer: '1',
      },
      {
        problem: 'A bottle holds 9/10 litre of juice. Aanya pours 4/10 litre into a glass and 2/10 litre into a second glass. How much juice is left in the bottle?',
        steps: [
          'Total poured out: 4/10 + 2/10 = 6/10.',
          'Subtract from the bottle: 9/10 − 6/10 = 3/10.',
          'Already in simplest form because HCF(3, 10) = 1.',
        ],
        answer: '3/10 litre',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Adding the denominators too',
        example: 'Says 1/4 + 2/4 = 3/8.',
        why: 'The student treats the fraction like an ordered pair and adds it component-by-component.',
        fix:
          'Re-anchor with the size-of-piece argument: the denominator labels piece-size; the pieces here are quarters, so the answer is in quarters too. Only the COUNT (numerator) changes when we add.',
      },
      {
        pattern: 'Leaving the answer unsimplified',
        example: 'Says 9/12 − 3/12 = 6/12, and stops.',
        why: 'The student does the arithmetic right but does not check the simplest-form requirement.',
        fix:
          'Treat "simplify" as the final step of every fraction problem. After computing, find HCF(top, bottom). If it is 1, you are done; otherwise divide.',
      },
      {
        pattern: 'Mixing up addition and subtraction',
        example: 'Says 9/10 − 6/10 = 15/10 in a "left over" word problem.',
        why: 'The student picks the wrong operation because the word problem is not parsed carefully.',
        fix:
          'Read the question twice and underline the question word ("left", "in total", "more"). "Left" → subtract. "In total" → add.',
      },
    ],
    practice: ['FR.05-01', 'FR.05-02', 'FR.05-05', 'FR.05-06', 'FR.05-12'],
    teacherNote:
      'The "add across" error is the load-bearing one here. Spend time on the bar picture before the symbolic rule. Once a student really sees that 1/4 + 2/4 = 3/4 (not 3/8) on the picture, the rule becomes obvious.',
    parentNote:
      'Drawing or splitting a chocolate bar is the cleanest model. "I had 2 of 8 squares, you ate 1 of 8 squares — how many of the 8 squares are left?" The bar itself is the whole, and the squares are eighths.',
  },

  // -------------------------------------------------------------------------
  // FR.06 — Add fractions with unlike denominators
  // -------------------------------------------------------------------------
  'FR.06': {
    skillId: 'FR.06',
    intro:
      'When two fractions have DIFFERENT denominators, you cannot add their numerators directly. You first rewrite both fractions over a common denominator (the LCM of the two denominators is the cleanest choice), then add the numerators.',
    reteach: {
      title: 'Reteach: add fractions with unlike denominators',
      steps: [
        'Find the LCM of the two denominators. (For coprime denominators that is just their product.)',
        'Rewrite each fraction with the LCM as the new denominator. Multiply numerator AND denominator by the same factor — that is the FR.03 equivalence rule.',
        'Add the numerators. Keep the LCM denominator.',
        'Simplify (FR.03) and convert to a mixed number if needed (FR.04).',
      ],
    },
    visualExplanation: {
      caption:
        'Two same-sized bars: 1/4 and 1/8 of the same whole. Rewrite 1/4 as 2/8, then 2/8 + 1/8 = 3/8.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 1, denominator: 4, label: '1/4' },
          { numerator: 1, denominator: 8, label: '1/8' },
        ],
      },
      readingSteps: [
        'The two pieces are different sizes — quarters and eighths.',
        'Rewrite the quarter as eighths: 1/4 of the same bar is the same area as 2/8.',
        'Now both fractions are over 8. Add the numerators: 2 + 1 = 3.',
        'Total = 3/8 of the whole.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute 1/3 + 1/4.',
        steps: [
          'Find the LCM of 3 and 4. Multiples of 3: 3, 6, 9, 12, 15. Multiples of 4: 4, 8, 12. LCM = 12.',
          'Rewrite 1/3 with denominator 12: multiply top and bottom by 4 → 4/12.',
          'Rewrite 1/4 with denominator 12: multiply top and bottom by 3 → 3/12.',
          'Add the numerators: 4/12 + 3/12 = 7/12.',
          'HCF(7, 12) = 1, so 7/12 is already in simplest form.',
        ],
        answer: '7/12',
      },
      {
        problem: 'Add the mixed numbers: 1 3/4 + 2 1/6.',
        steps: [
          'Add the whole parts: 1 + 2 = 3.',
          'Find LCM(4, 6) = 12. Rewrite 3/4 = 9/12 and 1/6 = 2/12.',
          'Add the fractional parts: 9/12 + 2/12 = 11/12.',
          'Combine: 3 + 11/12 = 3 11/12.',
        ],
        answer: '3 11/12',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Adding across (no common denominator)',
        example: 'Says 1/4 + 1/8 = 2/12.',
        why: 'The student treats the fraction as an ordered pair, adding component-by-component — the FR.05 mistake repeated for unlike denominators.',
        fix:
          'You cannot add quarters and eighths directly because the pieces are different sizes. Always rewrite both fractions over a common denominator (the LCM) first.',
      },
      {
        pattern: 'Using the LCM but not scaling the numerator',
        example: 'Says 1/3 + 1/4 = 1/12 + 1/12 = 2/12.',
        why: 'The student knows to find the LCM but forgets the FR.03 step: when the denominator changes, the numerator must change by the same factor.',
        fix:
          'Always do equivalence as a pair: "I multiplied the bottom by k, so I must multiply the top by k too." Practise alongside FR.03.',
      },
      {
        pattern: 'Using the product instead of the LCM',
        example: 'Says 5/6 + 3/4 = 20/24 + 18/24 = 38/24.',
        why:
          'The student multiplies denominators instead of finding LCM, then has to simplify a much bigger fraction at the end (and often forgets to).',
        fix:
          'Show the LCM path side by side: LCM(6, 4) = 12, so 5/6 + 3/4 = 10/12 + 9/12 = 19/12. The numbers stay smaller and the answer is already nearly in simplest form.',
      },
    ],
    practice: ['FR.06-01', 'FR.06-04', 'FR.06-15', 'FR.06-17', 'FR.06-21'],
    teacherNote:
      'Watch for the "add across" error first; if it is present, FR.05 is not yet stable. If LCM is the issue, FM.07 (LCM) is the prerequisite to revisit. The "incomplete conversion" error usually means FR.03 is not yet solid.',
    parentNote:
      'Half a cup of milk plus a quarter cup. How much in total? Have your child explain how they would describe the total in cups, and use that to introduce the common-denominator idea.',
  },

  // -------------------------------------------------------------------------
  // FR.07 — Subtract fractions with unlike denominators
  // -------------------------------------------------------------------------
  'FR.07': {
    skillId: 'FR.07',
    intro:
      'Subtraction with unlike denominators uses the same first step as addition: rewrite both fractions over a common denominator. Then subtract the numerators. For mixed numbers, you sometimes need to BORROW from the whole part — the same idea as borrowing in column subtraction.',
    reteach: {
      title: 'Reteach: subtract fractions with unlike denominators',
      steps: [
        'Rewrite both fractions over the LCM of the two denominators.',
        'Subtract the numerators. Keep the LCM denominator.',
        'Simplify and / or convert to a mixed number as needed.',
        'For mixed numbers: if the second fractional part is bigger than the first, borrow 1 from the whole part. 1 = denominator/denominator. Add it to the first fractional part, then subtract.',
      ],
    },
    visualExplanation: {
      caption:
        '3/4 of a bar minus 1/2 of the same bar. Rewriting 1/2 as 2/4 makes both quarters; 3/4 − 2/4 = 1/4.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 3, denominator: 4, label: '3/4' },
          { numerator: 1, denominator: 2, label: '1/2' },
        ],
      },
      readingSteps: [
        'Pieces of different sizes cannot be subtracted directly.',
        'Rewrite 1/2 of the same bar in quarters: that is 2/4.',
        'Now both fractions are in quarters: 3 quarters − 2 quarters.',
        'The answer is 1 quarter, i.e., 1/4 of the whole.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute 5/6 − 3/4.',
        steps: [
          'Find LCM(6, 4) = 12.',
          'Rewrite 5/6 = 10/12 and 3/4 = 9/12 (multiply each pair top-and-bottom by the same factor).',
          'Subtract the numerators: 10/12 − 9/12 = 1/12.',
          'HCF(1, 12) = 1, so already in simplest form.',
        ],
        answer: '1/12',
      },
      {
        problem: 'Subtract the mixed numbers: 3 1/4 − 1 1/2.',
        steps: [
          'Common denominator: LCM(4, 2) = 4. So 1/2 = 2/4. Now 3 1/4 − 1 2/4.',
          'Compare fractional parts: 1/4 < 2/4, so we need to borrow.',
          'Borrow 1 from the whole: 1 = 4/4. So 3 1/4 = 2 + 4/4 + 1/4 = 2 5/4.',
          'Now subtract: 2 5/4 − 1 2/4 = (2 − 1) and (5/4 − 2/4) = 1 3/4.',
        ],
        answer: '1 3/4',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Subtracting across (no common denominator)',
        example: 'Says 3/4 − 1/2 = 2/2 = 1.',
        why: 'The student mirrors the FR.06 "add across" mistake in the subtraction direction, treating the fraction as an ordered pair.',
        fix:
          'Rewrite both fractions over a common denominator first. 3/4 − 1/2 = 3/4 − 2/4 = 1/4 once the pieces are the same size.',
      },
      {
        pattern: 'Avoiding the borrow on mixed numbers',
        example: 'Says 3 1/4 − 1 3/4 = 2 1/2 (subtracted the smaller from the larger to avoid borrowing).',
        why:
          'The student knows borrowing is hard and quietly swaps the order of the fractional parts to dodge it.',
        fix:
          'Re-anchor: 1 = denominator/denominator. So 3 1/4 = 2 + 4/4 + 1/4 = 2 5/4. Now 5/4 − 3/4 = 2/4 and the whole is 2 − 1 = 1, giving 1 2/4 = 1 1/2.',
      },
      {
        pattern: 'Confusing add and subtract',
        example: 'Says 7/8 − 1/2 = 11/8 (added instead of subtracting).',
        why: 'The student is fluent with FR.06 (addition) and pattern-matches the unlike-denominator setup to addition.',
        fix:
          'Read the operation symbol out loud before doing the arithmetic. Underline the − in the problem. Treat operation identification as a separate step.',
      },
    ],
    practice: ['FR.07-01', 'FR.07-05', 'FR.07-09', 'FR.07-17', 'FR.07-19'],
    teacherNote:
      'Borrowing trips many students. The mental picture to install is "1 = 4/4". If the student insists on subtracting smaller-from-larger fractional parts (the "borrowing_error" pattern), walk through 3 1/4 = 2 + 1 + 1/4 = 2 + 5/4 explicitly, with bars.',
    parentNote:
      'Pour out half a glass from a three-quarters-full glass. How much is left? Have your child describe what happened in fractions, and write it down step by step.',
  },

  // -------------------------------------------------------------------------
  // FR.08 — Fraction word problems
  // -------------------------------------------------------------------------
  'FR.08': {
    skillId: 'FR.08',
    intro:
      'A fraction word problem dresses fraction arithmetic in a story. The hardest part is usually picking the right operation; the actual maths is FR.05 / FR.06 / FR.07 once you know what to do.',
    reteach: {
      title: 'Reteach: solving a fraction word problem',
      steps: [
        'Read the problem twice. Underline the two fractions and the question.',
        'Decide the operation. "Total / altogether / in all" → add. "Left / how much more / difference" → subtract.',
        'Write the calculation, with units. Then carry it out using FR.05 / FR.06 / FR.07.',
        'Simplify the answer (FR.03). Convert to a mixed number where natural (FR.04).',
        'Sanity check: does the size of the answer make sense in the story? Right units?',
      ],
    },
    visualExplanation: {
      caption:
        'A glass starts 7/8 full. 1/3 of a glass is drunk. How much remains? Subtract: 7/8 − 1/3 = 21/24 − 8/24 = 13/24 of a glass.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 7, denominator: 8, label: '7/8 full' },
          { numerator: 1, denominator: 3, label: '1/3 drunk' },
        ],
      },
      readingSteps: [
        '"How much remains" tells you to subtract.',
        'Top bar shows the starting amount (7/8 of the glass). Bottom bar shows the amount drunk (1/3 of the glass).',
        'The arithmetic step is FR.07 with LCM 24: 7/8 = 21/24 and 1/3 = 8/24.',
        'Final: 21/24 − 8/24 = 13/24 of the glass.',
      ],
    },
    workedExamples: [
      {
        problem:
          'Anita drinks 1/4 litre of milk in the morning and 1/2 litre in the evening. How much does she drink in all?',
        steps: [
          '"In all" → add.',
          'LCM(4, 2) = 4. Rewrite 1/2 = 2/4.',
          'Add: 1/4 + 2/4 = 3/4 litre.',
          'Sanity check: 3/4 of a litre is less than a full litre, which fits the story.',
        ],
        answer: '3/4 litre',
      },
      {
        problem:
          'Karan finished 1/3 of his project on Monday, 1/4 on Tuesday, and 1/6 on Wednesday. How much of the project is left?',
        steps: [
          '"How much is left" → subtract from the whole (1).',
          'Add what he did: 1/3 + 1/4 + 1/6. LCM(3, 4, 6) = 12.',
          'Convert: 1/3 = 4/12, 1/4 = 3/12, 1/6 = 2/12. Sum = 9/12.',
          'Left = 1 − 9/12 = 12/12 − 9/12 = 3/12 = 1/4 of the project.',
        ],
        answer: '1/4',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Picking the wrong operation',
        example:
          'For "how much is left after Karan eats 5/8 of a pizza", says 5/8 + something instead of 1 − 5/8.',
        why:
          'The student arithmetic is fine, but the question word ("left") was not noticed — they reach for the operation that feels familiar.',
        fix:
          'Slow down on the SECOND sentence of the problem. Underline the question word. Restate the question in your own words ("how much pizza is left") before writing any arithmetic.',
      },
      {
        pattern: 'Missing the units',
        example: 'Solves 3/4 + 1/2 and writes "5/4" with no unit when the problem was about ribbon length in metres.',
        why: 'The student switches into "fraction mode" and forgets the story.',
        fix:
          'Always write the units in the final answer ("5/4 metres", "13/24 litre"). It anchors the maths back in the situation and helps catch arithmetic that does not make sense.',
      },
      {
        pattern: 'Forgetting to subtract from the whole',
        example: 'For "how much of the cake is left after eating 5/8", says 5/8 instead of 3/8.',
        why:
          'The student computes the part that was used and stops, instead of subtracting it from the whole.',
        fix:
          'When "how much is left" is the question, the calculation is ALWAYS (whole) − (used). Write 1 − ____ first; then fill in the used amount.',
      },
    ],
    practice: ['FR.08-01', 'FR.08-04', 'FR.08-05', 'FR.08-08', 'FR.08-12'],
    teacherNote:
      'When students pick the wrong operation, slow down on the second sentence of the problem. "What is the question actually asking?" Often a one-line restatement in the student\'s own words ("how much is left", "how much in total") fixes the operation choice.',
    parentNote:
      'Make up small story problems with everyday quantities ("1/2 a litre, plus 1/4 a litre"). Ask "what is this asking us to find?" before doing any arithmetic. Practising the question-recognition step is often more useful than the arithmetic itself.',
  },

  // -------------------------------------------------------------------------
  // DECIMALS module (v0.7)
  // -------------------------------------------------------------------------
  'DE.01': {
    skillId: 'DE.01',
    intro:
      'A decimal is a way of writing fractions whose denominator is a power of 10 (10, 100, 1000…). The places after the decimal point are tenths, hundredths, thousandths…',
    reteach: {
      title: 'Reteach: decimal place value',
      steps: [
        'Read the digits BEFORE the decimal point as a normal whole number.',
        'After the decimal point, the first place is tenths (1/10), the second is hundredths (1/100), the third is thousandths (1/1000).',
        'The VALUE of a digit = the digit × the place. Example: in 3.45, the 4 is in the tenths place, value = 4 × 1/10 = 0.4.',
        'Trailing zeros after the decimal point do NOT change the value: 0.5 = 0.50 = 0.500.',
      ],
    },
    visualExplanation: {
      caption:
        'A grid of 10 equal cells with 7 shaded shows 7/10 = 0.7. Each cell is one tenth.',
      visual: {
        kind: 'grid',
        grids: [{ rows: 1, cols: 10, shaded: 7, label: '7/10 = 0.7' }],
      },
      readingSteps: [
        '10 equal cells in the strip — each cell is one tenth (1/10) of the whole.',
        '7 cells shaded → 7 tenths.',
        'As a fraction: 7/10. As a decimal: 0.7.',
        'Note: 0.7 and 0.70 both mean 7 tenths — adding a zero on the right of a decimal does not change its value.',
      ],
    },
    workedExamples: [
      {
        problem: 'What is the value of the digit 8 in 5.083?',
        steps: [
          'Find the position of the digit 8: it is two places after the decimal point.',
          'Two places after the point is the hundredths place.',
          'Value = 8 × 1/100 = 0.08.',
        ],
        answer: '0.08',
      },
      {
        problem: 'Write the decimal that has 4 ones, 0 tenths, and 9 hundredths.',
        steps: [
          'Ones digit: 4.',
          'Tenths digit: 0 (between point and the 9).',
          'Hundredths digit: 9.',
          'Decimal: 4.09.',
        ],
        answer: '4.09',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Reading 0.05 as "five tenths"',
        example: 'Says 0.05 = 5/10 = 1/2.',
        why: 'The student counts only the non-zero digit and ignores the leading 0 between point and digit.',
        fix: 'Always count places explicitly: "0 then 5 — the 5 is in the second place after the point — that is hundredths." 0.05 = 5/100.',
      },
      {
        pattern: 'Length-based comparison',
        example: 'Says 0.50 > 0.5 because it is "longer".',
        why: 'Treats the decimal like a string of digits rather than a place-value number.',
        fix: 'Pad with zeros: 0.5 = 0.50. They name the same number of tenths/hundredths so they are equal.',
      },
      {
        pattern: 'Concatenating digits',
        example: 'Writes "three and four tenths" as 34 or 0.34.',
        why: 'Treats the words as labels for a single multi-digit number.',
        fix: 'Build the decimal piece by piece: ones digit (3), then a point, then tenths digit (4). Result: 3.4.',
      },
    ],
    practice: ['DE.01-01', 'DE.01-04', 'DE.01-06', 'DE.01-08', 'DE.01-10'],
    teacherNote:
      'A place-value chart is the single most useful manipulative here. Have the student physically write the digits into Tens / Ones / Tenths / Hundredths boxes before they read the value of any digit.',
    parentNote:
      'Money is the easiest place-value model: ₹3.45 is 3 rupees, 4 ten-paise, 5 paise. Practise reading prices on receipts together.',
  },

  'DE.02': {
    skillId: 'DE.02',
    intro:
      'Many fractions can be rewritten as decimals (and back) by using denominators that are powers of 10. The most common ones to memorise: 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75, 1/10 = 0.1, 1/100 = 0.01.',
    reteach: {
      title: 'Reteach: convert between fractions and decimals',
      steps: [
        'Fraction → decimal: rewrite the fraction with denominator 10, 100, or 1000 if possible (FR.03), then read off as a decimal. Or do the division top ÷ bottom.',
        'Decimal → fraction: read the place value (tenths / hundredths / thousandths), write that as the denominator, then simplify (FR.03).',
        'Memorise these: 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75, 1/5 = 0.2, 1/8 = 0.125.',
      ],
    },
    visualExplanation: {
      caption:
        'A bar split into 4 equal parts with 3 shaded shows 3/4. The same bar split into 100 equal hundredths would have 75 shaded, i.e., 0.75.',
      visual: {
        kind: 'bars',
        bars: [{ numerator: 3, denominator: 4, label: '3/4' }],
      },
      readingSteps: [
        'Bar split into 4 equal parts; 3 are shaded → fraction shaded is 3/4.',
        'Each quarter = 25 hundredths, so 3/4 = 75/100.',
        'Read 75/100 as a decimal: 0.75.',
        'So 3/4 and 0.75 represent exactly the same amount.',
      ],
    },
    workedExamples: [
      {
        problem: 'Convert 3/5 to a decimal.',
        steps: [
          'Make the denominator 10: multiply top and bottom by 2 → 6/10.',
          'Read off as a decimal: 6/10 = 0.6.',
        ],
        answer: '0.6',
      },
      {
        problem: 'Convert 0.45 to a fraction in simplest form.',
        steps: [
          'Two places after the decimal → denominator is 100. So 0.45 = 45/100.',
          'Simplify: HCF(45, 100) = 5. 45/100 = 9/20.',
        ],
        answer: '9/20',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Writing the digits as a fraction without place value',
        example: 'Says 0.45 = 45/10.',
        why: 'The student reads the digits but does not check the place of the LAST digit.',
        fix: 'Last digit is in the hundredths place ⇒ denominator is 100. 0.45 = 45/100.',
      },
      {
        pattern: 'Stopping conversion before simplest form',
        example: 'Writes 0.4 = 4/10 and stops.',
        why: 'Decimal-to-fraction was done; FR.03 simplification step skipped.',
        fix: '4/10 = 2/5. Always finish with the simplification step (or state "already in simplest form").',
      },
      {
        pattern: 'Random conversion',
        example: 'Says 1/4 = 0.14.',
        why: 'Student concatenates the digits "1" and "4" to make a decimal instead of doing 1 ÷ 4.',
        fix: 'Do the division: 1 ÷ 4 = 0.25. Or rewrite 1/4 as 25/100 = 0.25.',
      },
    ],
    practice: ['DE.02-01', 'DE.02-03', 'DE.02-05', 'DE.02-06', 'DE.02-10'],
    teacherNote:
      'The fastest fix for "1/4 = 0.14" is to ask the student to do 1 ÷ 4 by long division. The result is 0.25 and the moment of discovery is more memorable than a lecture.',
    parentNote:
      'When a price label says "75 paise" or "0.75 kg", ask your child to write it as both a fraction and a decimal. The kitchen and the corner shop are good practice grounds.',
  },

  'DE.03': {
    skillId: 'DE.03',
    intro:
      'To compare decimals, line them up by place value (or pad them to the same number of decimal places) and compare digit by digit, left to right.',
    reteach: {
      title: 'Reteach: compare and order decimals',
      steps: [
        'Pad the decimals so they all have the same number of places after the point. (Trailing zeros do not change the value.)',
        'Compare digit by digit, starting from the LEFT (highest place value).',
        'The first difference decides which number is bigger.',
        'For ordering 3+ numbers, repeat pairwise — pad first, then sort.',
      ],
    },
    visualExplanation: {
      caption:
        'Two number-line marks: 0.7 sits to the right of 0.65 because 0.70 > 0.65 (compare tenths first).',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 7, denominator: 10, label: '0.7 (= 0.70)' },
          { numerator: 65, denominator: 100, label: '0.65' },
        ],
      },
      readingSteps: [
        'Pad 0.7 to 0.70 so both decimals have two places.',
        'Compare tenths (left-most decimal place): 7 > 6.',
        'So 0.70 > 0.65, i.e., 0.7 > 0.65.',
        '"More digits ≠ bigger". The PLACE of each digit is what matters.',
      ],
    },
    workedExamples: [
      {
        problem: 'Which is bigger: 1.205 or 1.21?',
        steps: [
          'Pad: 1.205 vs 1.210.',
          'Ones: 1 = 1. Tenths: 2 = 2.',
          'Hundredths: 0 < 1. Decision made: 1.21 is bigger.',
        ],
        answer: '1.21',
      },
      {
        problem: 'Order from least to greatest: 0.4, 0.04, 0.44.',
        steps: [
          'Pad to 2 decimal places: 0.40, 0.04, 0.44.',
          'Compare tenths: 4, 0, 4. Smallest tenths digit is 0 → 0.04 first.',
          'Tie-break the other two on hundredths: 0.40 < 0.44.',
        ],
        answer: '0.04 < 0.4 < 0.44',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Length bias',
        example: 'Says 0.65 > 0.7 because it has more digits.',
        why: 'Treats decimals like whole numbers ("the longer number is bigger").',
        fix: 'Pad with zeros first: 0.7 = 0.70. Now compare 0.70 vs 0.65 — 0.70 wins on the tenths digit.',
      },
      {
        pattern: 'Comparing decimal portions as whole numbers',
        example: 'Says 1.9 > 1.10 because "9 > 10" — wait, that is wrong, but the student says 1.10 > 1.9 because "10 > 9".',
        why: 'Reads the part after the decimal as if it were an integer, ignoring place value.',
        fix: 'Pad: 1.9 = 1.90. Now 1.90 vs 1.10 — 90 > 10, so 1.9 > 1.10.',
      },
      {
        pattern: 'Confusing order direction',
        example: 'When asked "least to greatest" gives the order in greatest-to-least.',
        why: 'Reads the question quickly and reverses the direction.',
        fix: 'Re-read the question and underline "least to greatest" or "greatest to least" before sorting.',
      },
    ],
    practice: ['DE.03-01', 'DE.03-03', 'DE.03-05', 'DE.03-06', 'DE.03-09'],
    teacherNote:
      'Padding with zeros is the single highest-leverage move. Insist on it for every comparison until it becomes automatic.',
    parentNote:
      'When shopping, compare prices like ₹0.95 vs ₹0.90 with your child. Ask which is bigger and how they decided.',
  },

  'DE.04': {
    skillId: 'DE.04',
    intro:
      'To add or subtract decimals, line up the decimal points so place values match. Then add or subtract column by column, just like with whole numbers.',
    reteach: {
      title: 'Reteach: add and subtract decimals',
      steps: [
        'Line up the decimal points so tenths add to tenths, hundredths to hundredths, etc.',
        'If one number has fewer decimal places, pad with zeros so both have the same.',
        'Add or subtract column by column, carrying or borrowing as for whole numbers.',
        'Place the decimal point in the answer directly under the others.',
      ],
    },
    visualExplanation: {
      caption:
        'Adding 0.5 + 0.3 on a tenths grid: 5 tenths shaded plus 3 more tenths makes 8 tenths.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 5, denominator: 10, label: '0.5' },
          { numerator: 3, denominator: 10, label: '0.3' },
        ],
      },
      readingSteps: [
        'Each strip shows tenths.',
        'First strip: 5 of 10 shaded (0.5).',
        'Second strip: 3 of 10 shaded (0.3).',
        'Combine: 5 + 3 = 8 tenths shaded → 0.8.',
      ],
    },
    workedExamples: [
      {
        problem: 'Compute 7.04 + 3.6.',
        steps: [
          'Pad to the same number of places: 7.04 + 3.60.',
          'Add column by column from the right: hundredths 4+0 = 4; tenths 0+6 = 6; ones 7+3 = 10 (write 0, carry 1); tens 0+0+1 = 1.',
          'Place the decimal point: 10.64.',
        ],
        answer: '10.64',
      },
      {
        problem: 'Compute 12.5 − 7.85.',
        steps: [
          'Pad: 12.50 − 7.85.',
          'Hundredths: 0 − 5 needs borrowing → borrow from tenths.',
          'Tenths: now 4 − 8 needs another borrow from ones, etc.',
          'Final: 4.65.',
        ],
        answer: '4.65',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Right-aligning instead of decimal-aligning',
        example: 'Adds 2.3 + 0.45 by writing 2.3 over 0.45 right-aligned, getting 0.68.',
        why: 'Treats the numbers like whole numbers and aligns the right edges.',
        fix: 'Align the DECIMAL POINTS, not the right edges. Pad the shorter number with a zero (2.30) so both numbers have the same number of decimal places.',
      },
      {
        pattern: 'Forgetting the decimal point in the answer',
        example: 'Adds 2.3 + 1.4 and writes the answer as 37.',
        why: 'Treated the operation as an integer addition (23 + 14) and forgot to put the point back.',
        fix: 'Place the decimal point in the answer DIRECTLY under the points in the operands. The answer is 3.7.',
      },
      {
        pattern: 'Subtracting smaller-from-larger by digit',
        example: 'For 4.5 − 1.75 says "4.5 − 1.75 = 3.25" by doing 5 − 7 backwards as 7 − 5 = 2.',
        why: 'Avoids borrowing by swapping digits.',
        fix: 'When the top digit is smaller than the bottom one, borrow 1 from the next place. Pad first: 4.50 − 1.75. Borrow tenths from ones, then borrow hundredths from tenths.',
      },
    ],
    practice: ['DE.04-01', 'DE.04-04', 'DE.04-06', 'DE.04-07', 'DE.04-09'],
    teacherNote:
      'Insist on a vertical layout with the decimal points aligned. The single most common mistake is right-aligning. Once the column layout is in place, the arithmetic is just whole-number arithmetic.',
    parentNote:
      'Use shopping receipts or bills. "If we paid ₹100 and the total is ₹83.75, how much change?" Have your child write the subtraction in columns first.',
  },

  'DE.05': {
    skillId: 'DE.05',
    intro:
      'Decimal word problems wrap decimal arithmetic (DE.04) in a story. The hardest part is usually picking the right operation and the right units; the arithmetic is straightforward once those are decided.',
    reteach: {
      title: 'Reteach: solving a decimal word problem',
      steps: [
        'Read the question twice. Underline what is being asked.',
        'Identify the numbers and their units (rupees, kg, m, L).',
        'Decide the operation. "Total / in all" → add. "Left / how much more / change" → subtract.',
        'Set up the calculation in column form (DE.04). Pad with zeros if needed.',
        'Write the answer with the units. Sanity-check that it makes sense in the story.',
      ],
    },
    visualExplanation: {
      caption:
        'A bottle starts with 1.25 L of juice. After pouring out 0.5 L, 0.75 L is left.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 125, denominator: 100, label: '1.25 L (start)' },
          { numerator: 50, denominator: 100, label: '0.5 L poured out' },
        ],
      },
      readingSteps: [
        '"How much is left" → subtract.',
        'Pad: 1.25 − 0.50.',
        'Compute: 1.25 − 0.50 = 0.75.',
        'Answer with units: 0.75 L of juice left.',
      ],
    },
    workedExamples: [
      {
        problem: 'Riya has ₹100. She spends ₹62.75. How much money is left?',
        steps: [
          '"How much is left" → subtraction.',
          'Pad: 100.00 − 62.75.',
          'Compute by borrowing column-by-column: 37.25.',
          'Answer with units: ₹37.25.',
        ],
        answer: '₹37.25',
      },
      {
        problem: 'Asha had ₹250. She bought 3 books at ₹45.50 each. How much is left?',
        steps: [
          'Total spent on books = 3 × 45.50 = 136.50.',
          'Left = 250.00 − 136.50.',
          'Compute: 113.50.',
          'Answer with units: ₹113.50.',
        ],
        answer: '₹113.50',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Wrong operation',
        example: 'For "how much change?" adds instead of subtracting.',
        why: 'Did not parse the question word.',
        fix: 'Underline the question word ("change", "left", "more", "in all"). "Change / left / more" → subtract. "In all / total" → add.',
      },
      {
        pattern: 'Mixing units',
        example: 'Adds 250 grams to 1.5 kg without converting first.',
        why: 'Treats the two numbers as if they were the same quantity.',
        fix: 'Convert to the same unit first. 1.5 kg = 1500 g; 1500 + 250 = 1750 g = 1.75 kg.',
      },
      {
        pattern: 'Dropping the units',
        example: 'Solves the arithmetic and writes the answer as a bare number.',
        why: 'Switches into "calculation mode" and forgets the story.',
        fix: 'Always finish with units in the answer (₹, kg, L, m). It anchors the maths back in the situation.',
      },
    ],
    practice: ['DE.05-01', 'DE.05-04', 'DE.05-06', 'DE.05-09', 'DE.05-10'],
    teacherNote:
      'When a student picks the wrong operation, slow down on the SECOND sentence of the problem. Often a one-line restatement in the student\'s own words ("how much money is left?") fixes the operation choice.',
    parentNote:
      'Use bills, receipts, or planning a small shopping trip. "Here is ₹500 — what can we buy and how much will be left?" The currency makes the problem real and the units obvious.',
  },

  // -------------------------------------------------------------------------
  // FACTORS & MULTIPLES module (v0.7)
  // -------------------------------------------------------------------------
  'FM.03': {
    skillId: 'FM.03',
    intro:
      'A prime number has exactly two distinct positive factors: 1 and itself. A composite number has more than two factors. 1 has only one factor and is neither prime nor composite.',
    reteach: {
      title: 'Reteach: prime and composite numbers',
      steps: [
        'List the positive factors of the number (the integers that divide it exactly).',
        'Count: exactly 2 factors → prime. More than 2 → composite. Exactly 1 → neither (only 1).',
        'Shortcut: if the number is divisible by any prime ≤ √n, it is composite.',
        'For prime factorisation, keep dividing by primes (2, 3, 5, 7, 11…) until the quotient is 1.',
      ],
    },
    visualExplanation: {
      caption:
        'A "factor tree" for 12: 12 = 2 × 6 = 2 × 2 × 3. The leaves (2, 2, 3) are all prime — that is the prime factorisation.',
      visual: {
        kind: 'grid',
        grids: [{ rows: 2, cols: 2, shaded: 4, label: '12 = 2² × 3 (factor tree)' }],
      },
      readingSteps: [
        'Start with 12 at the top.',
        'Split into a factor pair: 12 = 2 × 6. The 2 is prime — it is a leaf.',
        'Split the non-prime branch: 6 = 2 × 3. Both are prime — leaves.',
        'Read all the leaves: 2, 2, 3. Prime factorisation = 2 × 2 × 3 = 2² × 3.',
      ],
    },
    workedExamples: [
      {
        problem: 'Is 21 prime or composite? Justify.',
        steps: [
          'Try small primes: 21 ÷ 2 → not exact (21 is odd). 21 ÷ 3 = 7 exact!',
          'So 3 is a factor of 21.',
          'Factors of 21: 1, 3, 7, 21 — more than 2 factors.',
          'Therefore 21 is composite.',
        ],
        answer: 'Composite (21 = 3 × 7)',
      },
      {
        problem: 'Find the prime factorisation of 60.',
        steps: [
          '60 ÷ 2 = 30. Write 2.',
          '30 ÷ 2 = 15. Write another 2.',
          '15 ÷ 3 = 5. Write 3.',
          '5 is prime. Write 5.',
          'Multiply the leaves: 2 × 2 × 3 × 5 = 60. So 60 = 2² × 3 × 5.',
        ],
        answer: '2² × 3 × 5',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Calling 1 prime',
        example: 'Lists 1 as a prime number.',
        why: 'Reasons "1 has 1 as a factor and itself as a factor" — but those are the same number.',
        fix: 'A prime needs exactly TWO DISTINCT factors. 1 only has one factor (itself). So 1 is neither prime nor composite.',
      },
      {
        pattern: 'Calling odd numbers prime',
        example: 'Says 9 is prime because it is odd.',
        why: 'Confuses "odd" with "no even factors", which is not the same as "prime".',
        fix: 'Check: 9 = 3 × 3. So 9 has factors 1, 3, 9 — three factors → composite.',
      },
      {
        pattern: 'Stopping factorisation early',
        example: 'Writes 12 = 4 × 3 and calls that the prime factorisation.',
        why: 'Forgets that 4 is not prime.',
        fix: 'Split EVERY non-prime factor until all leaves are prime. 4 = 2 × 2, so 12 = 2 × 2 × 3.',
      },
    ],
    practice: ['FM.03-01', 'FM.03-02', 'FM.03-04', 'FM.03-08', 'FM.03-10'],
    teacherNote:
      'A factor-tree drawing on the board makes the difference between "factor" and "prime factor" visible. Insist that the leaves are circled and the prime factorisation is read off the leaves.',
    parentNote:
      'Play "find a factor" with everyday numbers (the date, your house number, ages). For each number: prime or composite? If composite, write it as a product of two factors.',
  },

  'FM.04': {
    skillId: 'FM.04',
    intro:
      'Divisibility rules let you check whether a number is divisible by 2, 3, 4, 5, 6, 9, or 10 without actually dividing. They are quick mental checks based on the digits.',
    reteach: {
      title: 'Reteach: divisibility rules',
      steps: [
        'By 2: last digit is 0, 2, 4, 6, or 8.',
        'By 3: sum of digits is divisible by 3.',
        'By 4: number formed by the LAST TWO digits is divisible by 4.',
        'By 5: last digit is 0 or 5.',
        'By 6: divisible by BOTH 2 AND 3.',
        'By 9: sum of digits is divisible by 9.',
        'By 10: last digit is 0.',
      ],
    },
    visualExplanation: {
      caption:
        'Number 135: is it divisible by 3? Sum of digits = 1+3+5 = 9, divisible by 3, so YES.',
      visual: {
        kind: 'grid',
        grids: [{ rows: 1, cols: 3, shaded: 3, label: '1 + 3 + 5 = 9 ✓' }],
      },
      readingSteps: [
        'The digits of 135 are 1, 3, and 5.',
        'Add them up: 1 + 3 + 5 = 9.',
        '9 is divisible by 3.',
        'Therefore 135 is divisible by 3. (Indeed 135 ÷ 3 = 45.)',
      ],
    },
    workedExamples: [
      {
        problem: 'Is 246 divisible by 6?',
        steps: [
          'By 6 = by 2 AND by 3.',
          'Divisible by 2? Last digit is 6 ✓.',
          'Divisible by 3? Sum of digits = 2+4+6 = 12, which is divisible by 3 ✓.',
          'Both rules pass, so 246 is divisible by 6.',
        ],
        answer: 'Yes',
      },
      {
        problem: 'Find the smallest digit d that makes 358d divisible by 9.',
        steps: [
          'Sum of digits = 3 + 5 + 8 + d = 16 + d.',
          'Need 16 + d divisible by 9. The next multiple of 9 ≥ 16 is 18.',
          '18 − 16 = 2, so d = 2.',
        ],
        answer: '2',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Mixing up the rules',
        example: 'Uses the digit-sum rule to test for divisibility by 4.',
        why: 'Memorised "look at the digits" but forgot which rule applies to which divisor.',
        fix: 'Make a small reference table and use it. By 3 and 9 → digit sum. By 2 and 5 and 10 → last digit. By 4 → last TWO digits.',
      },
      {
        pattern: 'Checking only one part of the by-6 rule',
        example: 'Says 33 is divisible by 6 because the digit-sum rule passes (3+3 = 6).',
        why: 'Stops after the by-3 check.',
        fix: 'By 6 needs BOTH by 2 AND by 3. 33 is odd, so by-2 fails — 33 is NOT divisible by 6.',
      },
      {
        pattern: 'Forgetting the divisibility result',
        example: 'After finding the digit-sum, divides the digit-sum by 3 to find "the answer" and writes that.',
        why: 'Treats the divisibility check as a calculation that produces the quotient.',
        fix: 'The rule only tells you YES or NO. To get the quotient you still need long division (or multiplication-table memory).',
      },
    ],
    practice: ['FM.04-01', 'FM.04-03', 'FM.04-05', 'FM.04-06', 'FM.04-10'],
    teacherNote:
      'Make a reference card with the rules. Use it the first few times, then ask the student to recite from memory. Six divisors × one rule each is well within the typical Class-6 working memory.',
    parentNote:
      'Look at car number plates or shop signs together. Pick a rule ("divisible by 3?") and check the digit sum. It turns waiting time into practice.',
  },

  'FM.06': {
    skillId: 'FM.06',
    intro:
      'The Highest Common Factor (HCF) of two or more numbers is the largest positive integer that divides all of them exactly. Two methods: (a) list factors and pick the largest common one; (b) prime factorisation, then take the LOWEST power of each shared prime.',
    reteach: {
      title: 'Reteach: HCF',
      steps: [
        'Method 1 (small numbers): list all factors of each number, find the common ones, take the largest.',
        'Method 2 (any size): write each number as a product of primes (FM.03). Take each shared prime to the LOWEST power that appears.',
        'Multiply the results to get the HCF.',
        'Sanity check: HCF must divide both numbers exactly.',
      ],
    },
    visualExplanation: {
      caption:
        'Prime factorisations of 24 = 2³ × 3 and 36 = 2² × 3². Shared primes 2 and 3 — take the lowest power: 2² × 3 = 12. So HCF(24, 36) = 12.',
      visual: {
        kind: 'grid',
        grids: [{ rows: 2, cols: 6, shaded: 12, label: 'HCF(24, 36) = 12' }],
      },
      readingSteps: [
        'Write each number as a product of primes: 24 = 2 × 2 × 2 × 3 and 36 = 2 × 2 × 3 × 3.',
        'Identify the shared primes: 2 and 3.',
        'Take the lowest power of each shared prime: 2² (since 24 has 2³ and 36 has 2²) and 3¹ (since 24 has 3¹ and 36 has 3²).',
        'Multiply: 2² × 3 = 4 × 3 = 12. So HCF(24, 36) = 12.',
      ],
    },
    workedExamples: [
      {
        problem: 'Find the HCF of 12 and 18 by listing factors.',
        steps: [
          'Factors of 12: 1, 2, 3, 4, 6, 12.',
          'Factors of 18: 1, 2, 3, 6, 9, 18.',
          'Common factors: 1, 2, 3, 6.',
          'Largest = 6. HCF = 6.',
        ],
        answer: '6',
      },
      {
        problem: 'Find the HCF of 48 and 60 by prime factorisation.',
        steps: [
          '48 = 2 × 2 × 2 × 2 × 3 = 2⁴ × 3.',
          '60 = 2 × 2 × 3 × 5 = 2² × 3 × 5.',
          'Shared primes: 2 (lowest power 2²) and 3 (power 1).',
          'HCF = 2² × 3 = 4 × 3 = 12.',
        ],
        answer: '12',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Returning the LCM instead of the HCF',
        example: 'For HCF(6, 8) writes 24 (which is the LCM).',
        why: 'Confuses "highest" and "largest", thinks "biggest number divisible by both".',
        fix: 'HCF DIVIDES both numbers; LCM is DIVISIBLE BY both. Memorise one direction at a time.',
      },
      {
        pattern: 'Returning a common factor that isn\'t the highest',
        example: 'For HCF(12, 18) writes 3 (which is common but not the highest).',
        why: 'Stops at the first common factor found instead of checking for larger ones.',
        fix: 'List ALL common factors, then pick the largest. Or use prime factorisation to get it directly.',
      },
      {
        pattern: 'Taking the wrong power in prime factorisation',
        example: 'For HCF(24, 36) takes 2³ × 3² = 72.',
        why: 'Takes the highest power of each shared prime instead of the lowest.',
        fix: 'For HCF: LOWEST power of each shared prime. For LCM: HIGHEST power. Slogan: "HCF picks the smaller, LCM picks the bigger."',
      },
    ],
    practice: ['FM.06-01', 'FM.06-02', 'FM.06-05', 'FM.06-07', 'FM.06-10'],
    teacherNote:
      'When the student returns the LCM by mistake, ask "does your answer DIVIDE both numbers?" That single question often catches the swap.',
    parentNote:
      'When sharing into equal groups (e.g., 12 sweets and 18 chocolates into baskets, equal of each per basket), the largest possible group size IS the HCF. That is the most natural setting to introduce it.',
  },

  'FM.07': {
    skillId: 'FM.07',
    intro:
      'The Lowest Common Multiple (LCM) of two or more numbers is the smallest positive integer that is a multiple of all of them. Two methods: list multiples; or prime factorisation, taking the HIGHEST power of each prime that appears.',
    reteach: {
      title: 'Reteach: LCM',
      steps: [
        'Method 1 (small numbers): list multiples of each number until you find a common one. The first one is the LCM.',
        'Method 2 (any size): write each number as a product of primes. Take each prime to the HIGHEST power that appears in any of the numbers.',
        'Multiply the results to get the LCM.',
        'Sanity check: LCM must be divisible by every input number.',
      ],
    },
    visualExplanation: {
      caption:
        'Multiples of 4: 4, 8, 12… Multiples of 6: 6, 12… The first common multiple is 12 = LCM(4, 6).',
      visual: {
        kind: 'grid',
        grids: [{ rows: 2, cols: 6, shaded: 12, label: 'LCM(4, 6) = 12' }],
      },
      readingSteps: [
        'List multiples of 4: 4, 8, 12, 16, 20, 24…',
        'List multiples of 6: 6, 12, 18, 24…',
        'The smallest number that appears in BOTH lists is 12.',
        'So LCM(4, 6) = 12.',
      ],
    },
    workedExamples: [
      {
        problem: 'Find the LCM of 6 and 9 by prime factorisation.',
        steps: [
          '6 = 2 × 3.',
          '9 = 3 × 3 = 3².',
          'Primes appearing: 2 (highest power 2¹) and 3 (highest power 3²).',
          'LCM = 2 × 3² = 2 × 9 = 18.',
        ],
        answer: '18',
      },
      {
        problem: 'Find the LCM of 4, 6, and 8.',
        steps: [
          '4 = 2².',
          '6 = 2 × 3.',
          '8 = 2³.',
          'Primes appearing: 2 (highest power 2³) and 3 (highest power 3¹).',
          'LCM = 2³ × 3 = 8 × 3 = 24.',
        ],
        answer: '24',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Returning the HCF instead of the LCM',
        example: 'For LCM(4, 6) writes 2 (which is HCF(4, 6)).',
        why: 'Confuses "lowest" and "smallest", thinks "smallest factor of both".',
        fix: 'LCM is a MULTIPLE — bigger than or equal to both numbers. HCF is a FACTOR — smaller than or equal to both.',
      },
      {
        pattern: 'Just multiplying the numbers',
        example: 'For LCM(4, 6) writes 24 (= 4 × 6) instead of 12.',
        why: 'Reaches for the product without checking for shared factors.',
        fix: 'a × b = HCF × LCM. So LCM = a × b / HCF. With shared factors, the LCM is SMALLER than the product.',
      },
      {
        pattern: 'Taking the wrong power in prime factorisation',
        example: 'For LCM(6, 9) takes 2¹ × 3¹ = 6.',
        why: 'Takes the lowest power of each prime instead of the highest.',
        fix: 'For LCM: HIGHEST power of each prime that appears. Slogan: "HCF picks the smaller, LCM picks the bigger."',
      },
    ],
    practice: ['FM.07-01', 'FM.07-02', 'FM.07-05', 'FM.07-07', 'FM.07-09'],
    teacherNote:
      'When the student returns the HCF by mistake, ask "is your answer DIVISIBLE by both numbers?" That single check almost always catches the swap.',
    parentNote:
      'Use traffic lights or alarm clocks: two events repeat at different intervals, when do they next happen together? That is exactly an LCM problem.',
  },

  'FM.08': {
    skillId: 'FM.08',
    intro:
      'HCF/LCM word problems wrap the two operations in a story. The crucial step is choosing the right operation: HCF for "biggest equal grouping" / "greatest common", LCM for "next time together" / "smallest common multiple".',
    reteach: {
      title: 'Reteach: HCF / LCM word problems',
      steps: [
        'Read the question and underline the cue word.',
        '"Maximum equal groups / greatest common length / largest packets" → HCF.',
        '"Next time together / smallest number divisible by all / next meeting" → LCM.',
        'Compute the HCF or LCM (FM.06 or FM.07).',
        'Write the answer with units. Sanity check that it makes sense in the story.',
      ],
    },
    visualExplanation: {
      caption:
        'Two bells ring every 6 and 8 minutes. They next ring together after LCM(6, 8) = 24 minutes.',
      visual: {
        kind: 'grid',
        grids: [{ rows: 2, cols: 12, shaded: 24, label: 'Bells ring together every 24 minutes' }],
      },
      readingSteps: [
        '"Together again" tells you to find when both events happen at the same time.',
        'For "the next common time", the answer is the smallest number that is a multiple of both intervals.',
        'That is the LCM.',
        'LCM(6, 8) = 24, so the bells next ring together after 24 minutes.',
      ],
    },
    workedExamples: [
      {
        problem: 'A teacher wants to make equal rows of 24 boys and 30 girls — each row has only one gender. What is the maximum number of students per row?',
        steps: [
          '"Maximum equal grouping" → HCF.',
          'HCF(24, 30): 24 = 2³ × 3, 30 = 2 × 3 × 5. Lowest powers of shared primes: 2¹ × 3¹ = 6.',
          'So at most 6 students per row.',
        ],
        answer: '6 students per row',
      },
      {
        problem: 'Three bells ring every 4, 6, and 8 minutes. They ring together at noon. After how many minutes do they next ring together?',
        steps: [
          '"Next time together" → LCM.',
          'LCM(4, 6, 8) by prime factorisation: 4 = 2², 6 = 2 × 3, 8 = 2³. Highest powers: 2³ × 3¹ = 24.',
          'They next ring together after 24 minutes.',
        ],
        answer: '24 minutes',
      },
    ],
    commonMistakes: [
      {
        pattern: 'HCF / LCM swap',
        example: 'For "maximum equal-size baskets" computes the LCM instead of the HCF.',
        why: 'Did not parse the cue word, or confuses the two operations.',
        fix: 'Underline the cue word. "Maximum equal" → HCF. "Next together / smallest common" → LCM.',
      },
      {
        pattern: 'Multiplying the numbers',
        example: 'For LCM(8, 12) writes 96 (= 8 × 12) instead of 24.',
        why: 'Reaches for the product as a fallback.',
        fix: 'Use prime factorisation: take the HIGHEST power of each prime. With shared factors, the LCM is smaller than the product.',
      },
      {
        pattern: 'Forgetting the units in the answer',
        example: 'For "next time the bells ring together?" writes "24" instead of "24 minutes" or "12:24 PM".',
        why: 'Switches into "calculation mode" and forgets the story.',
        fix: 'Always finish with units in the answer. It anchors the maths back in the situation.',
      },
    ],
    practice: ['FM.08-01', 'FM.08-02', 'FM.08-04', 'FM.08-06', 'FM.08-09'],
    teacherNote:
      'Practise cue-word identification before any arithmetic. Give 5 problems and ask only "HCF or LCM?" — no calculation. Once that step is solid, the arithmetic step usually follows.',
    parentNote:
      'Real bells, traffic lights, or birthday cycles are great LCM contexts. "If your two cousins visit every 6 and 8 weeks, when do they next come together?"',
  },

  // -------------------------------------------------------------------------
  // RATIO & PROPORTION module (v0.7)
  // -------------------------------------------------------------------------
  'RP.01': {
    skillId: 'RP.01',
    intro:
      'A ratio compares two quantities of the same kind. Written a : b, it means "a parts of one to b parts of the other". Ratios are read in order, and they can be simplified using HCF, just like fractions.',
    reteach: {
      title: 'Reteach: ratio concept',
      steps: [
        'A ratio compares two like quantities (girls to boys, red to blue, kg to kg). Both quantities must be in the same unit.',
        'Write the ratio in the order asked: "girls to boys" → girls first.',
        'Simplify by dividing both terms by their HCF, the same way you simplify a fraction.',
        'Convert different units to a common unit before writing the ratio.',
      ],
    },
    visualExplanation: {
      caption:
        'A bar split into 5 parts shaded 2:3 shows the ratio of red to blue. 2 of 5 parts are red, 3 are blue.',
      visual: {
        kind: 'bars',
        bars: [{ numerator: 2, denominator: 5, label: '2 of 5 parts (red)' }],
      },
      readingSteps: [
        'The whole bar is split into 5 equal parts.',
        '2 parts are shaded (red), 3 are unshaded (blue).',
        'Ratio of red to blue is 2 : 3.',
        'Equivalent forms: 2 : 3 = 4 : 6 = 6 : 9, etc.',
      ],
    },
    workedExamples: [
      {
        problem: 'In a class of 40 students, 16 are girls. Find the ratio of girls to boys.',
        steps: [
          'Boys = 40 − 16 = 24.',
          'Ratio girls : boys = 16 : 24.',
          'Simplify: HCF(16, 24) = 8. 16/8 : 24/8 = 2 : 3.',
        ],
        answer: '2 : 3',
      },
      {
        problem: 'Express the ratio 200 g : 1 kg in simplest form.',
        steps: [
          'Convert to the same unit. 1 kg = 1000 g.',
          'Now 200 g : 1000 g = 200 : 1000.',
          'Simplify: HCF(200, 1000) = 200. So 200/200 : 1000/200 = 1 : 5.',
        ],
        answer: '1 : 5',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Reversing the order',
        example: 'For "ratio of boys to girls" with 3 boys and 5 girls, writes 5 : 3.',
        why: 'Reads "boys to girls" but writes the larger number first by habit.',
        fix: 'Always check: the FIRST quantity in the question is the FIRST term of the ratio. "Boys to girls" → boys first.',
      },
      {
        pattern: 'Not converting units',
        example: 'Writes 50 paise : ₹1 as 50 : 1.',
        why: 'Forgets that the two quantities must be in the same unit.',
        fix: 'Convert first: 50 paise : 100 paise = 50 : 100 = 1 : 2.',
      },
      {
        pattern: 'Stopping before simplest form',
        example: 'Writes 8 : 12 and stops, instead of simplifying to 2 : 3.',
        why: 'Treats the un-simplified ratio as the final answer.',
        fix: 'Always simplify by HCF as the final step. Same rule as fractions (FR.03).',
      },
    ],
    practice: ['RP.01-01', 'RP.01-03', 'RP.01-05', 'RP.01-07', 'RP.01-10'],
    teacherNote:
      'The unit-mismatch error and the order-reversal error are by far the most common. Drill "what comes first in the question?" and "what is the unit?" before any arithmetic.',
    parentNote:
      'Cooking is the natural ratio context. "We need flour and sugar in 3 parts to 1 part. If we use 6 cups of flour, how much sugar?" The ratio 3 : 1 is right there.',
  },

  'RP.02': {
    skillId: 'RP.02',
    intro:
      'Two ratios are equivalent if they represent the same comparison. You can build an equivalent ratio by multiplying both terms by the same non-zero number, or simplify one by dividing both terms by their HCF.',
    reteach: {
      title: 'Reteach: equivalent ratios',
      steps: [
        'To go from a small term to a bigger one: pick a multiplier k. Multiply BOTH terms by k.',
        'To simplify: divide both terms by their HCF (FR.03 / RP.01).',
        'Whatever you do to the FIRST term, you must do to the SECOND term too.',
        'Sanity check: simplified versions of equivalent ratios should match.',
      ],
    },
    visualExplanation: {
      caption:
        'A bar showing 2 : 3 (2 of 5 parts) is the same comparison as 4 : 6 (4 of 10 parts) and 6 : 9 (6 of 15 parts).',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 2, denominator: 5, label: '2 : 3 (2 of 5)' },
          { numerator: 4, denominator: 10, label: '4 : 6 (4 of 10)' },
        ],
      },
      readingSteps: [
        'Top bar: 2 of 5 parts shaded → ratio 2 : 3.',
        'Bottom bar: 4 of 10 parts shaded → ratio 4 : 6.',
        'Both bars show the same shaded fraction (2/5 = 4/10).',
        'So 2 : 3 = 4 : 6 — equivalent ratios.',
      ],
    },
    workedExamples: [
      {
        problem: 'Fill in the blank: 3 : 4 = ___ : 12.',
        steps: [
          'Look at the second term: 4 → 12. Multiplier k = 12 / 4 = 3.',
          'Multiply the first term by the same k: 3 × 3 = 9.',
          'So 3 : 4 = 9 : 12.',
        ],
        answer: '9',
      },
      {
        problem: 'Find the missing term: 9 : 12 = ? : 8.',
        steps: [
          'First simplify 9 : 12 by HCF(9, 12) = 3 → 3 : 4.',
          'Now 3 : 4 = ? : 8. Multiplier k = 8 / 4 = 2.',
          'Multiply the first term: 3 × 2 = 6.',
        ],
        answer: '6',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Multiplying only one term',
        example: 'Says 3 : 4 = 3 : 12 (multiplied second term by 3 but left first term as 3).',
        why: 'Forgets that both terms must change by the same multiplier.',
        fix: 'Slogan: "k for k". Whatever you multiply the bottom by, multiply the top by the same number. Same rule as FR.03.',
      },
      {
        pattern: 'Adding instead of multiplying',
        example: 'Says 2 : 3 = 4 : 5 (added 2 to each term).',
        why: 'Treats equivalence as "increase both by the same amount".',
        fix: 'Equivalent ratios use the same MULTIPLIER, not the same difference. 2 + 2 : 3 + 2 = 4 : 5 is NOT the same as 2 : 3.',
      },
      {
        pattern: 'Not simplifying first',
        example: 'For 9 : 12 = ? : 8, jumps straight to cross-multiplication and gets a fractional answer.',
        why: 'Misses the chance to simplify the given ratio first.',
        fix: 'Simplify the given ratio (9 : 12 = 3 : 4) before solving. The arithmetic stays in whole numbers.',
      },
    ],
    practice: ['RP.02-01', 'RP.02-02', 'RP.02-04', 'RP.02-08', 'RP.02-10'],
    teacherNote:
      'The "multiplied only one term" error is the same misconception as FR.03 incomplete_conversion. Practise FR.03 alongside if it shows up.',
    parentNote:
      'Use scaling-up recipes: "this recipe is for 4 people, scale it up for 8 people". Both ingredient amounts double — that is the equivalent-ratio idea in action.',
  },

  'RP.03': {
    skillId: 'RP.03',
    intro:
      'Two ratios a : b and c : d are in proportion when a / b = c / d. The cleanest test is cross-multiplication: a × d = b × c. Proportion is what lets us solve "if 3 books cost ₹60, how much do 5 cost?"',
    reteach: {
      title: 'Reteach: proportion',
      steps: [
        'Set up the proportion: a : b :: c : d (read "a is to b as c is to d").',
        'Cross-multiply: a × d should equal b × c.',
        'For a missing term: write the proportion, then solve a × d = b × c for the unknown.',
        'Sanity check: simplify both ratios and compare.',
      ],
    },
    visualExplanation: {
      caption:
        '3 : 5 :: 6 : 10 — cross-products: 3 × 10 = 30 and 5 × 6 = 30. Equal, so the ratios are in proportion.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 3, denominator: 5, label: '3 : 5' },
          { numerator: 6, denominator: 10, label: '6 : 10' },
        ],
      },
      readingSteps: [
        'Two ratios: 3 : 5 and 6 : 10.',
        'Cross-multiply: 3 × 10 = 30 and 5 × 6 = 30.',
        'The cross-products are equal.',
        'So 3 : 5 :: 6 : 10 — they are in proportion.',
      ],
    },
    workedExamples: [
      {
        problem: 'Find the missing term: 3 : 7 :: 12 : ?',
        steps: [
          'Cross-multiply: 3 × ? = 7 × 12 = 84.',
          '? = 84 / 3 = 28.',
          'Check: 3 × 28 = 84 and 7 × 12 = 84 ✓.',
        ],
        answer: '28',
      },
      {
        problem: 'A car covers 200 km in 4 hours. At the same speed, how far in 7 hours?',
        steps: [
          'Set up proportion: 4 : 200 :: 7 : ?',
          'Cross-multiply: 4 × ? = 7 × 200 = 1400.',
          '? = 1400 / 4 = 350 km.',
        ],
        answer: '350 km',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Multiplying instead of cross-multiplying',
        example: 'For 3 : 7 :: 12 : ? computes 3 × 7 × 12 instead of cross-products.',
        why: 'Sees four numbers and reaches for any combination.',
        fix: 'Set up the proportion clearly with :: in the middle. Cross-multiply along the diagonals: a × d and b × c.',
      },
      {
        pattern: 'Wrong cross-product pairing',
        example: 'For 4 : 200 :: 7 : ? computes 4 × 7 = 28 instead of 4 × ? and 200 × 7.',
        why: 'Pairs the wrong numbers in the cross-multiplication.',
        fix: 'Draw the proportion as a 2×2 box. The diagonals are the cross-products.',
      },
      {
        pattern: 'Using the wrong setup for a word problem',
        example: 'For "if 3 books cost ₹60, how much do 5 cost?", writes 3 : 5 :: 60 : ?',
        why: 'Mixes up which quantities are in proportion.',
        fix: 'Match the units: books with books and cost with cost. So 3 : 60 :: 5 : ? OR books / cost = books / cost.',
      },
    ],
    practice: ['RP.03-01', 'RP.03-02', 'RP.03-04', 'RP.03-08', 'RP.03-10'],
    teacherNote:
      'The 2×2 box layout for proportion makes the cross-product visible. Insist on this layout the first few times. Once it is internalised, the student can drop it.',
    parentNote:
      'Anything where "more of one thing means more of another at a fixed rate" is a proportion. Petrol and distance, time and work, recipe scaling. Make up small examples around the house.',
  },

  'RP.04': {
    skillId: 'RP.04',
    intro:
      'The unitary method: first find the value for ONE unit, then multiply by the number of units you need. It is the cleanest way to solve direct-proportion word problems without setting up the formal proportion.',
    reteach: {
      title: 'Reteach: unitary method',
      steps: [
        'Find the value for 1 unit. Use division: total ÷ number of units.',
        'Multiply that 1-unit value by the new number of units.',
        'Write the answer with units (rupees, km, kg…).',
        'Sanity check: more units → more total (for direct proportion). Fewer → less.',
      ],
    },
    visualExplanation: {
      caption:
        'If 5 pencils cost ₹25, then 1 pencil costs ₹5. So 8 pencils cost 8 × ₹5 = ₹40.',
      visual: {
        kind: 'grid',
        grids: [{ rows: 1, cols: 5, shaded: 5, label: '5 pencils → ₹25 → ₹5 each' }],
      },
      readingSteps: [
        '5 pencils cost ₹25 in total.',
        'Divide to find the cost per pencil: 25 / 5 = ₹5.',
        'For any number of pencils, multiply by ₹5 each.',
        'Example: 8 pencils → 8 × ₹5 = ₹40.',
      ],
    },
    workedExamples: [
      {
        problem: '4 metres of cloth cost ₹220. Find the cost of 7 metres.',
        steps: [
          'Cost per metre = 220 / 4 = ₹55.',
          'Cost of 7 m = 7 × 55 = ₹385.',
        ],
        answer: '₹385',
      },
      {
        problem: 'A car uses 5 litres of petrol to travel 60 km. How much petrol is needed for 96 km?',
        steps: [
          'Petrol per km = 5 / 60 = 1/12 L.',
          'For 96 km: 96 × 1/12 = 8 L.',
        ],
        answer: '8 litres',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Skipping the unit-value step',
        example: 'For "5 pencils cost ₹25, how much do 8 cost?" jumps to 8 × 25 or 25 + 8.',
        why: 'Reaches for any operation without setting up the per-unit step.',
        fix: 'Always do "per 1 unit" first by division, even if it feels obvious. Then multiply.',
      },
      {
        pattern: 'Multiplying when you should divide',
        example: 'For "5 pencils cost ₹25" computes 5 × 25 = 125 as the per-pencil cost.',
        why: 'Picks the wrong operation in the per-unit step.',
        fix: '"Per 1 unit" always uses DIVISION (total ÷ number of units). After that, multiplication.',
      },
      {
        pattern: 'Inverse-proportion confusion',
        example: 'For "6 workers finish in 10 days, how long for 1 worker?", writes 10 / 6.',
        why: 'Treats "more workers → fewer days" the same as "more pencils → more cost".',
        fix: 'For inverse proportion (more workers ⇒ FEWER days), the per-1 step uses MULTIPLICATION: total work = 6 × 10 = 60 worker-days. So 1 worker takes 60 days.',
      },
    ],
    practice: ['RP.04-01', 'RP.04-04', 'RP.04-06', 'RP.04-09', 'RP.04-10'],
    teacherNote:
      'For the inverse-proportion case (workers, taps, time), set up "worker-days" (or whatever unit) explicitly. The product is constant; the per-unit step is multiplication, not division.',
    parentNote:
      'The unitary method is the silent backbone of every shopping decision: "if 1 kg costs ₹40, how much for 250 g?" Practise this kind of thinking aloud with your child.',
  },

  'RP.05': {
    skillId: 'RP.05',
    intro:
      'Ratio and proportion word problems combine RP.01–RP.04 in a story. The hardest step is usually problem identification: is this asking for a ratio, an equivalent ratio, a proportion missing-term, or a unitary-method calculation?',
    reteach: {
      title: 'Reteach: solving a ratio / proportion word problem',
      steps: [
        'Read the question twice. Underline what is being asked.',
        'Identify which RP-step the problem needs: write a ratio? find an equivalent? find a missing term in a proportion? use unitary method?',
        'Set up the calculation explicitly with units.',
        'Carry it out, then write the answer with units.',
      ],
    },
    visualExplanation: {
      caption:
        'Sharing ₹450 in the ratio 4 : 5 → split into 9 equal parts → each part = 50 → shares ₹200 and ₹250.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 4, denominator: 9, label: 'Friend A: 4 of 9 parts' },
          { numerator: 5, denominator: 9, label: 'Friend B: 5 of 9 parts' },
        ],
      },
      readingSteps: [
        '"Share in ratio 4 : 5" means split into 4 + 5 = 9 equal parts.',
        'Each part = total ÷ 9 = 450 / 9 = 50.',
        'A gets 4 × 50 = ₹200; B gets 5 × 50 = ₹250.',
        'Check: 200 + 250 = 450 ✓.',
      ],
    },
    workedExamples: [
      {
        problem: 'In a class, the ratio of boys to girls is 3 : 4. If there are 21 boys, how many students are there in total?',
        steps: [
          'Equivalent ratio: 3 × 7 = 21 (boys), so multiplier k = 7.',
          'Girls = 4 × 7 = 28.',
          'Total = 21 + 28 = 49.',
        ],
        answer: '49 students',
      },
      {
        problem: 'Two numbers are in the ratio 5 : 7. Their sum is 96. Find the smaller number.',
        steps: [
          'Total parts = 5 + 7 = 12.',
          'Each part = 96 / 12 = 8.',
          'Smaller = 5 × 8 = 40.',
        ],
        answer: '40',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Treating "share in ratio" as splitting equally',
        example: 'For "share ₹450 in ratio 4 : 5" gives ₹225 each.',
        why: 'Ignores the ratio and just halves the total.',
        fix: 'Split into TOTAL PARTS = 4 + 5 = 9. Each part = total / 9. Then multiply by 4 and 5 to get the two shares.',
      },
      {
        pattern: 'Treating one ratio term as the whole',
        example: 'For "ratio of girls to total is 16 : 40" then "girls : boys = 16 : 40".',
        why: 'Confuses "girls : boys" with "girls : total".',
        fix: 'Boys = total − girls. Then write girls : boys, NOT girls : total.',
      },
      {
        pattern: 'Multiplier confusion',
        example: 'For "ratio 3 : 4, 21 boys, how many girls?", divides 21 by 4 instead of finding k = 21/3 = 7.',
        why: 'Picks the wrong term to find the multiplier from.',
        fix: 'k comes from the term that matches the known quantity. 21 boys correspond to the "3" term, so k = 21 / 3 = 7. Then girls = 4 × k = 28.',
      },
    ],
    practice: ['RP.05-02', 'RP.05-04', 'RP.05-05', 'RP.05-08', 'RP.05-10'],
    teacherNote:
      'For "share in ratio" problems, draw the bar split into total-parts. The visual prevents the equal-split mistake.',
    parentNote:
      'Sharing snacks or money in proportion to age is a natural everyday context: "share these 12 chocolates in the ratio 1 : 2 between your two cousins." Have your child explain how they decided who gets how much.',
  },
};

export const lessonFor = (skill: SkillId): Lesson => LESSONS[skill];
