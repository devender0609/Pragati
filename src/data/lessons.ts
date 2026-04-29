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
};

export const lessonFor = (skill: SkillId): Lesson => LESSONS[skill];
