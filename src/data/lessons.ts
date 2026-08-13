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
import { ITEMS } from './items';
import { synthesizeLesson } from './lessonSynthesis';

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
  // v0.17: optional rich materials layered on top of the base lesson. When
  // present, the Learn view and the per-student Learning Path can render a
  // guided mini-lesson, visual walkthrough, misconception-coded reteach,
  // teacher small-group activity, independent practice set, exit ticket,
  // parent home-practice script, and printable worksheet text. Authored
  // per-skill in RICH_BY_SKILL and stitched in by lessonFor(skill).
  rich?: RichLessonMaterials;
};

// ---------------------------------------------------------------------------
// v0.17: Richer learning materials (optional, layered on top of Lesson)
// ---------------------------------------------------------------------------
// All eight sub-fields are optional so we can ship exemplar content for a
// handful of skills now and extend the rest later without breaking types.
//
//   miniLesson          — short narrative the student reads (3-6 sentences),
//                          written one notch slower than the reteach.
//   visualWalkthrough   — ordered list of "observe → notice → conclude"
//                          captions for the in-page visual.
//   misconceptionReteach — keyed by MisconceptionCode (free string here so
//                          new misconceptions don't widen this type), a
//                          one-paragraph reteach targeted at that
//                          specific wrong-thinking pattern.
//   teacherActivity     — a 10-15 minute small-group routine.
//   independentPractice — 3-6 practice items as plain prompt/answer pairs.
//   exitTicket          — 2-3 quick check questions for end of lesson.
//   parentHomePractice  — a short script the parent can run at home.
//   printableWorksheet  — plain text the teacher can paste into a doc.

export type RichLessonMaterials = {
  miniLesson?: string;
  visualWalkthrough?: string[];
  misconceptionReteach?: Record<string, string>;
  teacherActivity?: {
    title: string;
    timeMinutes: number;
    materials: string[];
    steps: string[];
  };
  independentPractice?: Array<{ prompt: string; answer: string }>;
  exitTicket?: Array<{ prompt: string; answer: string }>;
  parentHomePractice?: { intro: string; activity: string };
  printableWorksheet?: string;
};

// v0.23: spread Class 7 starter lessons in at build time. Authored in
// src/data/class7.ts so the Class 6 lessons stay untouched.
import { CLASS7_LESSONS } from './class7';

export const LESSONS: Record<SkillId, Lesson> = {
  ...CLASS7_LESSONS,
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

  // -------------------------------------------------------------------------
  // ALGEBRA BASICS module (v0.9)
  // -------------------------------------------------------------------------
  'AL.01': {
    skillId: 'AL.01',
    intro:
      'A variable is a letter (like x or y) that stands for a number. The number can be unknown, or can change depending on the situation. The letter is just a name we choose; the maths is the same whether we use x, y, n, or m.',
    reteach: {
      title: 'Reteach: variables as unknowns',
      steps: [
        'Read the symbol as a number, not as a letter. "x" means "some number we will call x".',
        'A variable can stand for one specific (but unknown) number, OR for any number, depending on the question.',
        'Different letters can be used for different unknowns. The choice is up to us.',
        'When the question gives us a value (e.g., x = 4), we can REPLACE the letter with that number wherever it appears.',
      ],
    },
    visualExplanation: {
      caption:
        'A bar with the label "x" reminds us that the bar stands for some number — even though we have not written what number yet.',
      visual: {
        kind: 'bars',
        bars: [{ numerator: 1, denominator: 1, label: 'x (some number)' }],
      },
      readingSteps: [
        'The bar represents one quantity called x.',
        'We have not said what x is yet. It could be 5, 10, or any number.',
        'When the problem tells us a value (e.g., x = 4), the bar then represents that value.',
        'The point of the picture: x is a placeholder for a number, not a different kind of object.',
      ],
    },
    workedExamples: [
      {
        problem: 'In the expression 3y + 2, what is the variable?',
        steps: [
          'Look for the LETTER. The numbers (3 and 2) are constants; the + is an operator.',
          'The letter is y.',
          'So y is the variable. (3 is the coefficient of y; 2 is the constant.)',
        ],
        answer: 'y',
      },
      {
        problem: 'A box has m mangoes. The shopkeeper says it has 12 mangoes. What is m?',
        steps: [
          'm is the variable for the number of mangoes in the box.',
          'The shopkeeper tells us the actual number is 12.',
          'So m = 12.',
        ],
        answer: '12',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Treating the letter as just a letter',
        example: 'Says "x is a letter, not a number" and refuses to compute.',
        why: 'Has not yet made the jump from arithmetic (numbers only) to algebra (numbers + named placeholders).',
        fix: 'Read the letter aloud as "some number". When a value is given, replace the letter with the number on paper.',
      },
      {
        pattern: 'Insisting the unknown must be x',
        example: 'Marks "n + 5" as wrong because it should be "x + 5".',
        why: 'Treats x as the only valid letter for unknowns.',
        fix: 'The choice of letter is just a name. n + 5 and x + 5 say exactly the same thing if we agreed n and x both stand for the unknown.',
      },
      {
        pattern: 'Believing a variable always equals zero',
        example: 'Says x must be 0 because nothing is written.',
        why: 'Confuses "value not stated" with "value is zero".',
        fix: 'Without more information, a variable can be ANY number. We only know its value when the problem (or an equation we solve) tells us.',
      },
    ],
    practice: ['AL.01-01', 'AL.01-03', 'AL.01-06', 'AL.01-07', 'AL.01-10'],
    teacherNote:
      'When a student stalls because "x is a letter", give a concrete example: "Imagine you have x rupees. If I say x = 50, how many rupees do you have?" Repeat with two or three different values until the student feels comfortable substituting.',
    parentNote:
      'Pick a small object (apples, pencils, marbles). Hold some in your hand and say "I have x of these — that\'s a number we don\'t know yet." Show the actual count and write x = (the number). The kitchen and pencil case are the easiest places to practise.',
  },

  'AL.02': {
    skillId: 'AL.02',
    intro:
      'An expression mixes variables (x, y, …) with numbers using +, −, ×, ÷. It does NOT contain an "=". An expression by itself has no answer — it represents some quantity. Once we know the value of the variable(s), we can EVALUATE the expression to get a number.',
    reteach: {
      title: 'Reteach: writing simple expressions',
      steps: [
        'Identify the variable in the question (e.g., "a number" → use x).',
        'Translate each English word/phrase to a maths symbol: "plus" → +, "minus" → −, "times" / "of" → ×, "divided by" → ÷.',
        'Be careful with order: "3 less than x" = x − 3, NOT 3 − x.',
        'Write the final expression. It should have variables, constants, and operators — but NO "=".',
      ],
    },
    visualExplanation: {
      caption:
        'A bar of length x with another small bar of length 3 added on the end shows the expression x + 3.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 1, denominator: 1, label: 'x' },
          { numerator: 1, denominator: 3, label: '3 (added)' },
        ],
      },
      readingSteps: [
        'The first bar is x — some number.',
        'We add a small extra of size 3.',
        'The total length represents x + 3.',
        'Note: there is no "=" anywhere — just a description of "x then add 3".',
      ],
    },
    workedExamples: [
      {
        problem: 'Write "twice y, plus 7" as an expression.',
        steps: [
          '"Twice y" means 2 × y, which we write as 2y.',
          '"Plus 7" means + 7.',
          'Putting them together: 2y + 7.',
        ],
        answer: '2y + 7',
      },
      {
        problem: 'Ravi has x apples. His brother gives him 5 more. Write the total as an expression.',
        steps: [
          'Start with what Ravi already has: x.',
          '"5 more" → add 5.',
          'Total = x + 5.',
        ],
        answer: 'x + 5',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Order swap on "less than"',
        example: 'Writes "3 less than x" as 3 − x.',
        why: 'Reads the words in left-to-right order.',
        fix: '"Less than" reverses the order. "3 less than x" means we start with x and take 3 away → x − 3. Re-read as "x, less 3".',
      },
      {
        pattern: 'Confusing an expression with an equation',
        example: 'Writes the answer as "x + 5 = 12" when only an expression was asked.',
        why: 'Adds an "=" by habit because most maths sums had one.',
        fix: 'An expression has NO "=". If the question asks for an expression, stop after the right-hand side.',
      },
      {
        pattern: 'Mixing operations',
        example: 'Writes "twice y" as y + 2.',
        why: 'Confuses "twice" (which means × 2) with "plus 2".',
        fix: 'Memorise: "twice" → multiply by 2. "Plus 2" → + 2. They are different.',
      },
    ],
    practice: ['AL.02-01', 'AL.02-04', 'AL.02-05', 'AL.02-08', 'AL.02-09'],
    teacherNote:
      'The hardest moment for many students is "3 less than x". Drill the phrase pattern before drilling the symbols. "3 less than x" → "x, less 3" → x − 3. Once this re-reading habit is in place, the rest of word→symbol translation is much easier.',
    parentNote:
      'Make up tiny word problems at home: "I have x rupees. I spend 10. Write that as an expression." Start with situations the child cares about (saving for a toy, sharing snacks).',
  },

  'AL.03': {
    skillId: 'AL.03',
    intro:
      'To EVALUATE an expression for a given value, we replace the variable with that value (substitution) and then compute the resulting arithmetic. For 3x with x = 4: replace x with 4, getting 3 × 4 = 12.',
    reteach: {
      title: 'Reteach: evaluating expressions',
      steps: [
        'Read the expression and find the variable(s).',
        'Substitute each variable with the given value, KEEPING any × or ÷ that was implied.',
        'In particular: 3x with x = 4 becomes 3 × 4 = 12 (NOT 34).',
        'Carry out the arithmetic, following the order of operations: brackets first, then × and ÷, then + and −.',
        'Write the final number — that is the value of the expression at this value of x.',
      ],
    },
    visualExplanation: {
      caption:
        'For the expression 3x with x = 4: replace x with 4 and multiply. 3 × 4 = 12.',
      visual: {
        kind: 'grid',
        grids: [
          { rows: 3, cols: 4, shaded: 12, label: '3 × 4 = 12 (3 rows of x = 4)' },
        ],
      },
      readingSteps: [
        'The grid has 3 rows and 4 columns.',
        '3 stands for the coefficient (3 of something).',
        '4 stands for the value of x.',
        '3 × 4 = 12 cells in total — that is the value of 3x when x = 4.',
      ],
    },
    workedExamples: [
      {
        problem: 'If x = 5, find 3x + 2.',
        steps: [
          'Substitute: 3x + 2 = 3 × 5 + 2.',
          'Multiply first: 3 × 5 = 15.',
          'Then add: 15 + 2 = 17.',
        ],
        answer: '17',
      },
      {
        problem: 'Find the value of 2x + 3y when x = 2 and y = 4.',
        steps: [
          'Substitute both variables: 2 × 2 + 3 × 4.',
          'Multiply first (each term): 4 + 12.',
          'Add: 16.',
        ],
        answer: '16',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Concatenating instead of multiplying',
        example: 'For 2x with x = 4, writes 24 (the digit 2 next to the digit 4).',
        why: 'Reads "2x" as a single two-character symbol, not as "2 times x".',
        fix: 'Always rewrite "2x" as "2 × x" when substituting. With x = 4: 2 × 4 = 8.',
      },
      {
        pattern: 'Wrong order of operations',
        example: 'For 5(x + 1) with x = 2, writes 5 × x + 1 = 10 + 1 = 11.',
        why: 'Skipped the brackets.',
        fix: 'Brackets first. (x + 1) = (2 + 1) = 3. Then 5 × 3 = 15.',
      },
      {
        pattern: 'Missing one variable in two-variable evaluation',
        example: 'For 2x + 3y with x = 2 and y = 4, only substitutes x and writes 4 + 3y.',
        why: 'Lost track of the second variable.',
        fix: 'Substitute ALL variables before doing arithmetic. Underline each variable in the expression and tick it off as you replace.',
      },
    ],
    practice: ['AL.03-01', 'AL.03-04', 'AL.03-06', 'AL.03-08', 'AL.03-10'],
    teacherNote:
      'When the student writes "23" for "2x with x = 3", do not just say "wrong". Ask "what does 2x mean?" and write 2 × x in front of them. The fix is almost always re-establishing that 2x is multiplication, not concatenation.',
    parentNote:
      'Use shopping or recipes. "If one apple costs ₹15 and we buy x apples, the cost is 15x. If x = 4, what is the cost?" Practising in real contexts builds the substitute-and-multiply habit.',
  },

  'AL.04': {
    skillId: 'AL.04',
    intro:
      'A one-step equation has a variable on one side and a number on the other, joined by ONE arithmetic operation: x + 5 = 9, x − 3 = 4, 2x = 10, x ÷ 4 = 2. To solve, do the OPPOSITE operation to BOTH sides so the variable is left alone.',
    reteach: {
      title: 'Reteach: solving one-step equations',
      steps: [
        'Identify the operation that is being done to the variable: + a, − a, × a, or ÷ a.',
        'Apply the OPPOSITE operation to BOTH sides:',
        '  • + a  →  subtract a from both sides.',
        '  • − a  →  add a to both sides.',
        '  • × a  →  divide both sides by a.',
        '  • ÷ a  →  multiply both sides by a.',
        'Simplify to get x = (some number).',
        'Always CHECK by substituting back into the original equation.',
      ],
    },
    visualExplanation: {
      caption:
        'A balance: left pan holds x + 3, right pan holds 7. Take 3 away from BOTH pans → left has x, right has 4. So x = 4.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 4, denominator: 7, label: 'Left: x + 3 (= 7)' },
          { numerator: 4, denominator: 7, label: 'Right: 7' },
        ],
      },
      readingSteps: [
        'Both sides are equal — that is what the "=" sign means.',
        'If we take the same amount from BOTH sides, they stay equal.',
        'Take 3 from each side: left becomes x, right becomes 4.',
        'So x = 4. Check: 4 + 3 = 7 ✓.',
      ],
    },
    workedExamples: [
      {
        problem: 'Solve x + 3 = 7.',
        steps: [
          'The operation on x is "+ 3". The opposite is "− 3".',
          'Subtract 3 from both sides: x + 3 − 3 = 7 − 3.',
          'Simplify: x = 4.',
          'Check: 4 + 3 = 7 ✓.',
        ],
        answer: 'x = 4',
      },
      {
        problem: 'Solve 2x = 10.',
        steps: [
          'The operation on x is "× 2". The opposite is "÷ 2".',
          'Divide both sides by 2: 2x ÷ 2 = 10 ÷ 2.',
          'Simplify: x = 5.',
          'Check: 2 × 5 = 10 ✓.',
        ],
        answer: 'x = 5',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Doing the same operation instead of the opposite',
        example: 'For x + 3 = 7, ADDS 3 to both sides → x + 6 = 10 (still has x + 6 on the left).',
        why: 'Misremembers the rule as "do the same thing".',
        fix: 'The rule is: do the OPPOSITE of the operation on x. To undo "+ 3", we subtract 3.',
      },
      {
        pattern: 'Multiplying both sides instead of dividing',
        example: 'For 2x = 10, multiplies both sides by 2 → 4x = 20.',
        why: 'Saw the 2 and reached for multiplication.',
        fix: '"2x" already has × 2 on x. To undo it, DIVIDE both sides by 2. Result: x = 5.',
      },
      {
        pattern: 'Doing the operation to only one side',
        example: 'For x + 3 = 7, subtracts 3 from the left only → x = 7.',
        why: 'Forgets that the equation must stay balanced.',
        fix: 'Whatever you do to one side, do it to the OTHER side too. That is what keeps the equality true.',
      },
    ],
    practice: ['AL.04-01', 'AL.04-03', 'AL.04-04', 'AL.04-08', 'AL.04-09'],
    teacherNote:
      'Drawing a balance scale (or actually using a balance) is the most reliable way to install the "do it to both sides" rule. Once the picture is internalised, the symbolic step becomes natural.',
    parentNote:
      'Use a real balance, even a simple seesaw of paper. "If both sides are equal and we take 3 candies from one side, what must we do to the other to keep it equal?" The picture transfers to algebra without any extra work.',
  },

  'AL.05': {
    skillId: 'AL.05',
    intro:
      'An algebra word problem turns a story into a one-step (sometimes two-step) equation. The hardest step is usually the translation: "Let x be …", then write the equation, THEN solve it using AL.04 methods.',
    reteach: {
      title: 'Reteach: turning a word problem into an equation',
      steps: [
        'Read the problem twice. Underline what is being asked.',
        'Decide what x will stand for, and write it down: "Let x = …".',
        'Translate the English sentence into an equation. Look for + (added, more, increased), − (less, fewer, decreased), × (twice, of, times), ÷ (shared, divided).',
        'Solve the equation (AL.04) for x.',
        'Read the question again. Make sure the answer is in the right units, and that the value makes sense.',
      ],
    },
    visualExplanation: {
      caption:
        'Anita has x books. She gets 5 more. Now she has 12. Picture: a bar of length x and an extra of length 5 together = 12.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 7, denominator: 12, label: 'x books (start)' },
          { numerator: 5, denominator: 12, label: '5 more (gets)' },
        ],
      },
      readingSteps: [
        'The first bar is what Anita started with: x.',
        'The second is what she added: 5.',
        'Together they reach 12. So x + 5 = 12.',
        'Solve: subtract 5 from both sides → x = 7.',
      ],
    },
    workedExamples: [
      {
        problem: 'I think of a number, add 4, and get 11. What is the number?',
        steps: [
          'Let x = the number.',
          'Translate: "the number plus 4 = 11" → x + 4 = 11.',
          'Solve: subtract 4 from both sides → x = 7.',
          'Check: 7 + 4 = 11 ✓.',
        ],
        answer: 'x = 7',
      },
      {
        problem: 'Five added to twice a number gives 17. Find the number.',
        steps: [
          'Let x = the number.',
          'Translate: "twice the number" = 2x. "5 added to" = + 5. So 2x + 5 = 17.',
          'Subtract 5 from both sides: 2x = 12.',
          'Divide both sides by 2: x = 6.',
          'Check: 2 × 6 + 5 = 17 ✓.',
        ],
        answer: 'x = 6',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Picking the wrong operation',
        example: 'For "Anita has x books, gets 5 more, now has 12", writes x − 5 = 12.',
        why: 'Did not parse the words; reached for any operation.',
        fix: '"5 more" → ADD 5. Always read the operation word and write the matching symbol BEFORE solving.',
      },
      {
        pattern: 'Forgetting to define x',
        example: 'Writes the equation first without saying what x stands for, then forgets which quantity is which.',
        why: 'Skipped the "Let x = …" step.',
        fix: 'ALWAYS write "Let x = (the unknown thing)" first. It is the most useful 6 words in algebra.',
      },
      {
        pattern: 'Solving for the wrong quantity',
        example: 'Solves the equation correctly but writes the answer as x + 5 instead of x.',
        why: 'Lost track of what was being asked.',
        fix: 'Re-read the QUESTION at the end. If the question asked for "the number", give x. If it asked for the friend\'s score, give x + 5.',
      },
    ],
    practice: ['AL.05-01', 'AL.05-04', 'AL.05-05', 'AL.05-08', 'AL.05-10'],
    teacherNote:
      'When students struggle, slow down on translation, not arithmetic. Give 4–5 problems and ask only for the equation (no solving). Once equations are reliable, the AL.04 step is easy.',
    parentNote:
      'Make up everyday word problems: "I had some chocolates. I gave 3 away and have 5 left. How many did I have?" Ask your child to write "Let x be …" and the equation BEFORE solving.',
  },

  // ===========================================================================
  // Geometry Basics module (v0.16) — 7 lessons
  // ===========================================================================
  // The visualExplanation field requires a fraction-bar or area-grid visual.
  // Geometry concepts are not naturally fraction-bars, so for these lessons
  // we use a one-cell bar as a neutral "marker" image and describe the
  // geometric idea in the caption + readingSteps. The bar is purely a
  // placeholder so the lesson page renders without re-engineering the
  // visual primitive system.

  'GB.01': {
    skillId: 'GB.01',
    intro:
      'A point shows position (no size). A line goes on without end in both directions. A line segment is a straight piece between two endpoints. A ray starts at one endpoint and goes on without end in one direction.',
    reteach: {
      title: 'Reteach: telling apart point, line, segment, ray',
      steps: [
        'A POINT is a dot. It marks a position. It has no length, width, or thickness. We name a point with a capital letter (e.g., A).',
        'A LINE is straight and has NO endpoints. It extends without end in BOTH directions. We name a line by any two points on it (line AB) and draw arrows on both ends.',
        'A LINE SEGMENT is straight and has TWO endpoints. We name it by its endpoints (segment AB or segment BA — order does not matter for segments).',
        'A RAY has ONE endpoint and extends without end in ONE direction. We name it starting from its endpoint (ray AB starts at A and passes through B). Order matters for rays: ray AB ≠ ray BA.',
        'Sanity check: how many endpoints? Line = 0, ray = 1, segment = 2.',
      ],
    },
    visualExplanation: {
      caption:
        'Below is a placeholder marker. The geometry idea: a single dot would be a POINT; a straight piece between two dots would be a SEGMENT; if one side keeps going forever it becomes a RAY; and if both sides keep going forever it becomes a LINE.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'On paper, draw a dot and label it A. That is a point.',
        'Draw a second dot B. The straight piece from A to B (with both endpoints) is segment AB.',
        'Now extend the drawing past B with an arrow. You now have ray AB (one endpoint at A, no end past B).',
        'Now extend it past A as well, with arrows on both sides. You now have line AB (no endpoints at all).',
      ],
    },
    workedExamples: [
      {
        problem: 'Look at three named objects on a page: a dot labelled P; a straight strip with both endpoints labelled C and D; and a straight strip starting at E with an arrow at the other end. Name each object using correct notation.',
        steps: [
          'The dot P is a POINT. Name: P.',
          'The strip with both endpoints labelled is a LINE SEGMENT. Name: segment CD (or segment DC).',
          'The strip with one endpoint and an arrow is a RAY. Name: ray E… and the second letter is the point the arrow goes through (e.g., ray EF).',
        ],
        answer: 'P (point), segment CD, ray EF.',
      },
      {
        problem: 'Three distinct points A, B, C lie on the same straight line, with B between A and C. Name two distinct rays in the figure that have B as their endpoint.',
        steps: [
          'A ray has its starting letter at the endpoint. The endpoint we want is B.',
          'Ray BA starts at B and passes through A.',
          'Ray BC starts at B and passes through C.',
          'These two rays point in opposite directions and together form line AC (also called line BA or line BC).',
        ],
        answer: 'ray BA and ray BC.',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Confusing a ray with a segment',
        example: '"Ray AB has length 6 cm" — but a ray has no defined length because one end goes on forever.',
        why: 'Students treat any straight line piece on the page as a "ruler" and assume it has a measurement.',
        fix: 'Reinforce that only segments (two endpoints) have a length. Rays and lines extend without end. Have the student count endpoints first: 0 → line, 1 → ray, 2 → segment.',
      },
      {
        pattern: 'Treating ray AB and ray BA as the same',
        example: '"Ray AB is the same as ray BA."',
        why: 'Students apply the segment rule (order doesn\'t matter) to rays.',
        fix: 'Explain: the FIRST letter is always the endpoint. Ray AB starts at A; ray BA starts at B. They point in opposite directions and are different rays.',
      },
      {
        pattern: 'Drawing a line without arrows',
        example: 'Drawing a straight strip with no arrows and calling it "line AB" instead of "segment AB".',
        why: 'Students forget that the visual symbol of a line is "arrows on both ends" and the symbol of a segment is "endpoints, no arrows".',
        fix: 'Insist on the convention: lines get arrows on BOTH ends, rays get arrow on ONE end, segments get no arrows. Practise drawing all three from the same two letters.',
      },
    ],
    practice: ['GB.01-01', 'GB.01-02', 'GB.01-03', 'GB.01-08', 'GB.01-09'],
    teacherNote:
      'A 5-minute drill: write A, B, C on the board and ask students to write down everything they can name (segment AB, ray AB, ray BA, line AC, points A, B, C…). Builds notation fluency fast.',
    parentNote:
      'Around the house, point at things and ask: "Is this more like a line, a ray, or a segment?" The edge of a ruler is a segment. A laser beam from a torch is a ray. A taut string between two posts is a segment.',
  },

  'GB.02': {
    skillId: 'GB.02',
    intro:
      'Two lines in the same flat surface (plane) are PARALLEL if they never meet, INTERSECTING if they meet at exactly one point, and PERPENDICULAR if they intersect at a right angle (90°).',
    reteach: {
      title: 'Reteach: classifying a pair of lines',
      steps: [
        'PARALLEL lines: lay a ruler flat. The two long edges of the ruler are parallel — they stay the same distance apart and never meet, no matter how far you imagine them extended.',
        'INTERSECTING lines: any two distinct lines that meet at a single point. Most pairs of intersecting lines are not perpendicular.',
        'PERPENDICULAR lines: a SPECIAL case of intersecting lines where the angle at the meeting point is exactly 90° (a right angle). Every perpendicular pair is intersecting; most intersecting pairs are not perpendicular.',
        'Quick test: extend the lines mentally. If they will EVER meet, they are intersecting. If they meet at 90°, they are perpendicular. If they would never meet, they are parallel.',
        'CONCURRENT lines (3 or more): lines that all pass through the same single point. Used for triangle medians, etc.',
      ],
    },
    visualExplanation: {
      caption:
        'Below is a placeholder marker. The geometry idea: two horizontal ruled lines on a notebook page are parallel; the margin line crossing them is intersecting (and, on most ruled pages, perpendicular).',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'On notebook paper, look at any two horizontal ruled lines. They never meet. They are parallel.',
        'The vertical margin line crosses each ruled line once. It intersects each of them.',
        'The angle between the margin and each ruled line is 90°. So the margin is perpendicular to every ruled line.',
        'There is no pair of ruled lines that meet on the page. Their relationship is parallel.',
      ],
    },
    workedExamples: [
      {
        problem: 'A rectangle ABCD has sides AB, BC, CD, DA in order. Which pair of sides is parallel? Which pair is perpendicular?',
        steps: [
          'In a rectangle, OPPOSITE sides are parallel. Opposite to AB is CD; opposite to BC is DA.',
          'So AB ∥ CD and BC ∥ DA.',
          'In a rectangle, ADJACENT sides meet at right angles. So AB ⊥ BC, and AB ⊥ DA.',
        ],
        answer: 'AB ∥ CD (and BC ∥ DA). AB ⊥ BC (and any adjacent pair).',
      },
      {
        problem: 'Two parallel lines are crossed by a third line. How many points of intersection are there in total?',
        steps: [
          'The third line crosses the first parallel line at one point.',
          'The third line crosses the second parallel line at another point.',
          'The two parallel lines never meet each other.',
          'So total intersection points = 1 + 1 + 0 = 2.',
        ],
        answer: '2 intersection points.',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Calling perpendicular "parallel"',
        example: '"The two arms of the letter L are parallel."',
        why: 'Students notice that the two arms are both straight and use "parallel" as a generic label for any two straight lines.',
        fix: 'Re-anchor: parallel = NEVER MEET. The two arms of L meet at the corner, so they are not parallel. They meet at 90°, so they are perpendicular.',
      },
      {
        pattern: '"Parallel" must be horizontal',
        example: 'Saying that two slanted strokes that never meet are not parallel because "they\'re not flat".',
        why: 'Students associate the idea of parallel lines with horizontal ruled lines they see most often.',
        fix: 'Show that parallel lines can be tilted at any angle, as long as they never meet. The two slanted bars of an A near the bottom are also parallel.',
      },
      {
        pattern: 'Counting all crossings as "perpendicular"',
        example: '"Two lines meet at a point, so they are perpendicular."',
        why: 'Students forget that perpendicular requires the SPECIFIC 90° angle.',
        fix: 'Two distinct lines that meet at a point are intersecting. They are perpendicular only when the angle at the meeting point is exactly 90°. Use a corner of a paper as a 90° check.',
      },
    ],
    practice: ['GB.02-01', 'GB.02-02', 'GB.02-03', 'GB.02-06', 'GB.02-10'],
    teacherNote:
      'Hand out a printed page with several pairs of lines (some parallel, some intersecting, some perpendicular). Ask students to label each pair. Catches mistake #1 quickly.',
    parentNote:
      'Walk around the home and play "find a pair": opposite edges of a door (parallel), the corner of a tile (perpendicular), the two ends of a pair of scissors (intersecting). Talk through which is which.',
  },

  'GB.03': {
    skillId: 'GB.03',
    intro:
      'Angles are classified by their size: acute (< 90°), right (= 90°), obtuse (> 90° and < 180°), straight (= 180°), and reflex (> 180° and < 360°). A complete (or full) angle is exactly 360°.',
    reteach: {
      title: 'Reteach: naming an angle by its size',
      steps: [
        'Think of a 90° angle as the corner of a paper. It is the reference for everything else.',
        'ACUTE angle: smaller than the corner of a paper (less than 90°). Examples: 30°, 60°, 89°.',
        'RIGHT angle: exactly the corner of a paper (90°).',
        'OBTUSE angle: bigger than the corner of a paper but less than a straight line (between 90° and 180°). Examples: 100°, 135°, 179°.',
        'STRAIGHT angle: exactly a straight line (180°).',
        'REFLEX angle: bigger than a straight line but less than a complete turn (between 180° and 360°). A complete (or full) angle is exactly 360°.',
      ],
    },
    visualExplanation: {
      caption:
        'Below is a placeholder marker. The geometry idea: imagine a clock face. 12-to-3 is a right angle (90°). 12-to-1 is acute (30°). 12-to-5 is obtuse (about 150°). 12-to-6 is straight (180°). 12-to-7 around the long way back to 12 is reflex (about 210°).',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Picture the minute hand at 12. Move the hour hand to 3. The angle between is 90° — a right angle.',
        'Move the hour hand to 1. The angle is now 30° — acute.',
        'Move it to 5. The angle is now 150° — obtuse.',
        'Move it to 6. The angle is now 180° — straight.',
        'Now go the LONG way around (the reflex side). 360° − any acute angle gives a reflex angle.',
      ],
    },
    workedExamples: [
      {
        problem: 'Classify each of these angles: (a) 35°, (b) 90°, (c) 145°, (d) 180°, (e) 270°.',
        steps: [
          '(a) 35° is between 0° and 90° → acute.',
          '(b) 90° is exactly 90° → right.',
          '(c) 145° is between 90° and 180° → obtuse.',
          '(d) 180° is exactly 180° → straight.',
          '(e) 270° is between 180° and 360° → reflex.',
        ],
        answer: '(a) acute, (b) right, (c) obtuse, (d) straight, (e) reflex.',
      },
      {
        problem: 'Two rays meet at a point. The smaller angle between them is 70°. What is the reflex angle on the other side?',
        steps: [
          'A full turn around a point is 360°.',
          'The two angles around the point (the smaller one and the reflex one) add up to 360°.',
          'So the reflex angle = 360° − 70° = 290°.',
        ],
        answer: '290°.',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Confusing acute with obtuse',
        example: 'Calling a 120° angle "acute".',
        why: 'Students remember the names but not which name goes with which size.',
        fix: 'Use the corner of a paper as a 90° reference. If the angle FITS INSIDE the corner, it is acute. If the angle is BIGGER than the corner, it is obtuse.',
      },
      {
        pattern: 'Forgetting straight and reflex',
        example: 'Calling a 200° angle "obtuse".',
        why: 'Students stop the classification at obtuse and don\'t learn straight / reflex.',
        fix: 'Drill the full list of five names with examples of each. Make a number-line poster: 0 — 90 — 180 — 360, with the names in their ranges.',
      },
      {
        pattern: 'Thinking 0° and 360° are different angle types',
        example: '"A 360° angle and a 0° angle look the same — which one is right?"',
        why: 'Students think a complete turn is something else (e.g., reflex).',
        fix: 'Explain: a 360° complete (or full) angle takes you all the way around back to the starting ray. 0° has no opening at all. They look the same on paper but mean different things.',
      },
    ],
    practice: ['GB.03-01', 'GB.03-02', 'GB.03-03', 'GB.03-07', 'GB.03-10'],
    teacherNote:
      'Hand out 10 angles drawn at random sizes; ask students to label each with both the type AND a quick estimate of the size. Builds the size-name link.',
    parentNote:
      'Open and close a pair of scissors slowly. Ask your child to name the angle the blades make at each stage: closed (acute), about to be right, opening past right into obtuse, fully open into a straight line.',
  },

  'GB.04': {
    skillId: 'GB.04',
    intro:
      'A protractor measures angles in degrees. Place its centre on the vertex, line up the zero with one arm, then read the size at the other arm using the scale that started at 0°.',
    reteach: {
      title: 'Reteach: measuring an angle with a protractor in three steps',
      steps: [
        'STEP 1 — Centre on vertex. Place the centre dot of the protractor exactly on the vertex (corner) of the angle.',
        'STEP 2 — Zero on arm. Rotate the protractor until the 0° line on the protractor lies exactly along ONE of the two arms of the angle.',
        'STEP 3 — Read the other arm. Look at where the OTHER arm crosses the protractor scale, and read the number using the scale that started at 0° on your aligned arm. The protractor has TWO scales (inner and outer); pick the one that began at 0°.',
        'TO DRAW an angle of x°: place centre on the chosen vertex, line up the zero with your starting ray, mark a small dot at x° on the scale, then draw a ray from the vertex through the dot.',
        'Sanity check: if the angle LOOKS acute (less than 90°), the reading must be less than 90°. If you read a number greater than 90°, you almost certainly read the wrong scale.',
      ],
    },
    visualExplanation: {
      caption:
        'Below is a placeholder marker. The geometry idea: every protractor has a centre dot and a flat baseline marked 0°. Both scales (one going 0°→180° clockwise, the other 0°→180° anti-clockwise) make it possible to measure no matter which way the angle opens.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Look at a real protractor: find the centre mark and the long horizontal 0°-to-180° baseline.',
        'Put the centre on the vertex. Rotate so one arm runs along the baseline at 0°.',
        'Trace the OTHER arm from the centre outward to the curve of the protractor.',
        'Read the number on the SAME scale that started at 0° on the arm you aligned.',
      ],
    },
    workedExamples: [
      {
        problem: 'A student aligns the bottom arm of an acute angle with the protractor zero. The other arm crosses near the 50° mark on the inner scale and near the 130° mark on the outer scale. What is the size of the angle?',
        steps: [
          'The angle LOOKS acute, so the reading must be less than 90°.',
          '130° is bigger than 90°, so it cannot be the answer here.',
          '50° is less than 90° and matches the picture.',
          'Therefore the angle is 50°.',
        ],
        answer: '50°.',
      },
      {
        problem: 'Two angles on a straight line add to 180°. One angle is 65°. What is the other?',
        steps: [
          'Angles on one side of a straight line always sum to 180°.',
          'Other angle = 180° − 65°.',
          'Other angle = 115°.',
        ],
        answer: '115°.',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Reading the wrong scale',
        example: 'Reading 130° instead of 50° for an angle that clearly looks less than 90°.',
        why: 'The student reads the scale that did NOT start at 0° on the aligned arm.',
        fix: 'Always do a SANITY CHECK before writing the number: is the angle clearly acute or obtuse? If acute, the reading must be < 90°. If obtuse, the reading must be > 90°. Pick the scale that gives a reading consistent with the picture.',
      },
      {
        pattern: 'Centre off the vertex',
        example: 'The student measures and gets a number, but the centre dot was a little to the side of the vertex.',
        why: 'In a hurry; or the protractor is slipping on the page.',
        fix: 'Hold the protractor with one hand, line it up carefully, then read with the other hand. The centre dot must sit exactly on the vertex.',
      },
      {
        pattern: 'Counting from a non-zero mark',
        example: 'Aligning the arm with the 10° mark instead of 0°, then reading the number at the second arm.',
        why: 'The student is in a hurry and mistakes 10° for the start of the scale.',
        fix: 'Always START at 0°. The 0° line is a special longer line on most protractors and is on the flat baseline. If you started at 10° by mistake, your reading will be 10° too much.',
      },
    ],
    practice: ['GB.04-01', 'GB.04-02', 'GB.04-04', 'GB.04-07', 'GB.04-10'],
    teacherNote:
      'Pair students up: one draws an angle, the other measures it. They swap and check each other\'s reading. The "sanity check" rule (acute < 90°, obtuse > 90°) is the single biggest reliability gain.',
    parentNote:
      'Use a tea cup\'s handle or a half-open book and ask "is this angle acute or obtuse?" before any measuring. The estimate-first habit catches scale-reading mistakes.',
  },

  'GB.05': {
    skillId: 'GB.05',
    intro:
      'Triangles can be classified TWO ways: by the lengths of their sides (scalene / isosceles / equilateral) AND by their angles (acute / right / obtuse). Every triangle has both classifications.',
    reteach: {
      title: 'Reteach: classifying a triangle by sides and by angles',
      steps: [
        'BY SIDES: scalene = all 3 sides different; isosceles = at least 2 sides equal; equilateral = all 3 sides equal.',
        'BY ANGLES: acute-angled = all 3 angles less than 90°; right-angled = exactly one angle is 90°; obtuse-angled = exactly one angle is greater than 90°.',
        'A triangle has TWO classifications. For example, an "isosceles right triangle" has two equal sides AND one 90° angle.',
        'Useful fact 1: angles in any triangle sum to 180°. Use this to find a missing angle.',
        'Useful fact 2: a triangle can have at most ONE right angle and at most ONE obtuse angle (because the angles sum to 180°). It cannot have two right angles.',
        'Useful fact 3: an equilateral triangle has 3 equal angles, each 180° ÷ 3 = 60°.',
      ],
    },
    visualExplanation: {
      caption:
        'Below is a placeholder marker. The geometry idea: imagine three triangles drawn on a page — an equilateral one (all three sides the same length, all three angles 60°), an isosceles right triangle (two equal short sides meeting at 90°), and a scalene obtuse triangle (all three sides different, one angle wider than 90°).',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Sketch a triangle with all sides marked equal — that is equilateral. Each angle = 60° → also acute.',
        'Sketch a right triangle with two equal short sides — that is isosceles AND right.',
        'Sketch a triangle with three different side lengths and one angle clearly bigger than 90° — that is scalene AND obtuse.',
        'Notice every triangle gets two labels: one by sides, one by angles.',
      ],
    },
    workedExamples: [
      {
        problem: 'A triangle has angles 50° and 60°. Find the third angle and classify the triangle by its angles.',
        steps: [
          'Third angle = 180° − 50° − 60° = 70°.',
          'All three angles (50°, 60°, 70°) are less than 90°.',
          'So the triangle is acute-angled.',
        ],
        answer: 'Third angle = 70°. Acute-angled triangle.',
      },
      {
        problem: 'A right-angled triangle is also isosceles. Find the other two angles.',
        steps: [
          'The right angle is 90°. The other two angles sum to 180° − 90° = 90°.',
          'In an isosceles right triangle the two non-right angles are equal.',
          'So each of the other two angles = 90° ÷ 2 = 45°.',
        ],
        answer: '45° and 45°.',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Giving only one classification',
        example: 'A 60–60–60 triangle is "equilateral" — but the question also asks "and what type by angles?"',
        why: 'Students think one label is enough.',
        fix: 'Always ask BOTH: "What is the side classification?" AND "What is the angle classification?" Most triangles get both labels (e.g., scalene right, isosceles obtuse).',
      },
      {
        pattern: 'Trying to make a triangle with two right angles',
        example: 'Drawing two 90° angles at two corners and "the third one will be whatever it is".',
        why: 'Students forget the angle-sum fact.',
        fix: 'Re-anchor: the three angles MUST sum to 180°. 90 + 90 = 180 already, so the third angle would have to be 0° — impossible.',
      },
      {
        pattern: 'Mixing up isosceles and scalene',
        example: 'A 4-5-6 cm triangle: "All sides look different but two are close to each other, so isosceles."',
        why: 'Students approximate instead of comparing exact lengths.',
        fix: 'Isosceles means EXACTLY two equal sides. 4, 5, 6 are all different → scalene. Re-establish the definitions before any classification.',
      },
    ],
    practice: ['GB.05-01', 'GB.05-04', 'GB.05-05', 'GB.05-08', 'GB.05-10'],
    teacherNote:
      'Hand out 8–10 triangles drawn with side lengths and one angle marked. Ask the class to write BOTH the side classification and the angle classification for each. Reinforces the "two labels" idea.',
    parentNote:
      'Cut three triangles from coloured paper: one equilateral, one isosceles, one scalene. Ask your child which one is which by counting equal sides. Then look at the angles together.',
  },

  'GB.06': {
    skillId: 'GB.06',
    intro:
      'A quadrilateral is a closed figure with 4 sides. Common quadrilaterals are the square, rectangle, parallelogram, rhombus, and trapezium. Each has its own pattern of equal sides, parallel sides, and right angles.',
    reteach: {
      title: 'Reteach: properties of common quadrilaterals',
      steps: [
        'SQUARE: 4 equal sides, 4 right angles. Both pairs of opposite sides are parallel.',
        'RECTANGLE: 4 right angles. Opposite sides are equal and parallel (length / breadth). Every square is also a rectangle.',
        'PARALLELOGRAM: both pairs of opposite sides are parallel AND equal. Opposite angles are equal. Every rectangle is also a parallelogram.',
        'RHOMBUS: 4 equal sides. Both pairs of opposite sides are parallel. Angles are usually NOT 90° (when they are, the rhombus is also a square).',
        'TRAPEZIUM: EXACTLY ONE pair of parallel sides. The other two sides are not parallel.',
        'Useful fact: in ANY quadrilateral, the four angles sum to 360°.',
      ],
    },
    visualExplanation: {
      caption:
        'Below is a placeholder marker. The geometry idea: picture five drawings — a square, a rectangle, a parallelogram tilted to one side, a rhombus (all sides equal but not a right angle), and a trapezium (only one pair of parallel sides). Naming them comes from counting equal sides, parallel sides, and right angles.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'For a candidate shape, count the number of right angles (0 / 4).',
        'Count the number of pairs of parallel sides (0 / 1 / 2).',
        'Count which sides are equal in length (none / two pairs equal / all four equal).',
        'Match the answers to the table: square (4 equal, 2 parallel pairs, 4 right), rectangle (2 parallel pairs, 4 right), parallelogram (2 parallel pairs), rhombus (4 equal, 2 parallel pairs), trapezium (1 parallel pair).',
      ],
    },
    workedExamples: [
      {
        problem: 'A quadrilateral has all four angles equal to 90° and opposite sides equal but not all four sides equal. Name the quadrilateral.',
        steps: [
          '4 right angles → square or rectangle.',
          'Opposite sides equal but not all four equal → length ≠ breadth.',
          'Therefore: rectangle.',
        ],
        answer: 'Rectangle.',
      },
      {
        problem: 'In a quadrilateral, three angles are 80°, 95°, and 100°. Find the fourth angle.',
        steps: [
          'Angles in any quadrilateral sum to 360°.',
          'Sum of three given angles = 80 + 95 + 100 = 275°.',
          'Fourth angle = 360° − 275° = 85°.',
        ],
        answer: '85°.',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Treating square and rectangle as separate',
        example: '"A square is a square, a rectangle is a rectangle — they\'re different."',
        why: 'Students see them as two different shapes rather than recognising the hierarchy.',
        fix: 'Explain: a square IS a rectangle (4 right angles, opposite sides equal — extra rule: all 4 sides equal). A square is a special rectangle. Similarly, a square is a special rhombus.',
      },
      {
        pattern: 'Treating a rhombus as a square',
        example: '"A rhombus has 4 equal sides, so it is a square."',
        why: 'Students remember "4 equal sides" but forget the angle requirement.',
        fix: 'A square needs BOTH 4 equal sides AND 4 right angles. A rhombus has 4 equal sides but its angles are usually not 90°. (When they are, it is also a square.)',
      },
      {
        pattern: 'Confusing trapezium with parallelogram',
        example: '"A trapezium has both pairs of parallel sides."',
        why: 'Students remember "parallel" without remembering the count.',
        fix: 'Trapezium = EXACTLY ONE pair of parallel sides. Parallelogram = TWO pairs of parallel sides. The count is the difference.',
      },
    ],
    practice: ['GB.06-01', 'GB.06-04', 'GB.06-05', 'GB.06-08', 'GB.06-10'],
    teacherNote:
      'Build a 5-row property table on the board (square / rectangle / parallelogram / rhombus / trapezium) with three columns (sides equal? sides parallel? right angles?). Have students fill it in from memory, then check.',
    parentNote:
      'Look around at floor tiles, windows, posters. Ask: "Square or rectangle? How can you tell?" The fastest test is to ask "are all four sides the same length?"',
  },

  'GB.07': {
    skillId: 'GB.07',
    intro:
      'A circle has special parts: the centre, a radius (segment from centre to a point on the circle), a diameter (chord through the centre — the longest chord), a chord (any segment with both endpoints on the circle), and an arc (a piece of the circle itself). Diameter = 2 × radius.',
    reteach: {
      title: 'Reteach: parts of a circle',
      steps: [
        'CENTRE: the fixed point inside the circle. Every point on the circle is the same distance from it.',
        'RADIUS: a segment from the centre to ANY point on the circle. All radii of the same circle have equal length. Plural: radii.',
        'DIAMETER: a chord that passes through the centre. The longest chord of a circle. Diameter = 2 × radius.',
        'CHORD: a segment with BOTH endpoints on the circle. The diameter is a special chord that also passes through the centre.',
        'ARC: a piece of the circle itself (the curve), between two points on the circle. (Compare with chord, which is the straight segment between the same two points.)',
      ],
    },
    visualExplanation: {
      caption:
        'Below is a placeholder marker. The geometry idea: imagine a circle with the centre O marked. Draw a segment from O to any point on the circle — that is a radius. Extend it across to the opposite side — you now have a diameter. Now pick two other points on the circle and join them with a segment that does NOT go through O — that is a chord. The curved piece between the two points is an arc.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Mark the centre with a dot and label it O.',
        'Pick any point on the circle and label it A. Segment OA is a radius.',
        'Extend OA through O to the opposite side of the circle to point B. Segment AB passes through O — that is a diameter. Length(AB) = 2 × Length(OA).',
        'Pick two other points P and Q on the circle. Segment PQ (not through O) is a chord.',
        'The curve from P to Q along the circle is an arc.',
      ],
    },
    workedExamples: [
      {
        problem: 'A circle has radius 6 cm. Find the diameter.',
        steps: [
          'Diameter = 2 × radius.',
          'Diameter = 2 × 6.',
          'Diameter = 12 cm.',
        ],
        answer: '12 cm.',
      },
      {
        problem: 'A circular garden has diameter 18 m. A path runs from the centre to the edge. How long is the path?',
        steps: [
          'A path from the centre to the edge of a circle is a radius.',
          'Radius = diameter ÷ 2.',
          'Radius = 18 ÷ 2 = 9 m. The path is 9 m long.',
        ],
        answer: '9 m.',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Confusing radius with diameter',
        example: '"Radius 8 cm, so diameter is 4 cm."',
        why: 'Students remember the words but mix up which is double and which is half.',
        fix: 'Re-anchor: the DIAMETER is the LONGER one (it goes ALL the way across). Diameter = 2 × radius. Radius = diameter ÷ 2. The longer name (D-I-A-M-E-T-E-R) maps to the longer length.',
      },
      {
        pattern: 'Thinking every chord goes through the centre',
        example: 'Drawing a "chord" that passes through the centre and calling it a chord (as if it were not also a diameter).',
        why: 'Students don\'t realise the diameter is a SPECIAL chord.',
        fix: 'A chord with BOTH endpoints on the circle is a chord. If it also passes through the centre, it is the special chord called the diameter — and it is the LONGEST chord. Most chords do not go through the centre.',
      },
      {
        pattern: 'Mixing up arc and chord',
        example: 'Calling the curved piece between two points "the chord".',
        why: 'Students use the word chord for whatever joins two points on the circle.',
        fix: 'CHORD = the STRAIGHT segment. ARC = the CURVED piece (along the circle itself). Same two points; two different paths between them.',
      },
    ],
    practice: ['GB.07-01', 'GB.07-02', 'GB.07-03', 'GB.07-06', 'GB.07-10'],
    teacherNote:
      'Hand out a circle drawn on plain paper, with the centre marked. Ask students to label one example each of: a radius, a diameter, a chord (not the diameter), and an arc. Builds part-naming fluency in 5 minutes.',
    parentNote:
      'Look at the wheel of a toy car or a bicycle. The spoke is a radius. The line from one tyre to the opposite tyre across the centre is the diameter. Ask: "If the spoke is 10 cm, how long is the diameter?"',
  },

  // -------------------------------------------------------------------------
  // GB.08 — Symmetry: lines of symmetry in plane figures (v0.18)
  // -------------------------------------------------------------------------
  'GB.08': {
    skillId: 'GB.08',
    intro:
      'A figure has a LINE of symmetry when folding the figure along that line makes the two halves match exactly. Common shapes have predictable counts: a square has 4, a non-square rectangle has 2, an equilateral triangle has 3, and a circle has infinitely many.',
    reteach: {
      title: 'Reteach: finding lines of symmetry',
      steps: [
        'A line of symmetry is sometimes called a mirror line: one side is the mirror image of the other.',
        'Test by folding: imagine folding the figure along the line. If the two halves coincide exactly, the line is a line of symmetry.',
        'A SQUARE has 4 lines of symmetry: the two diagonals and the two lines joining the midpoints of opposite sides.',
        'A NON-SQUARE RECTANGLE has only 2 lines of symmetry (the lines joining midpoints of opposite sides). Its diagonals are NOT lines of symmetry — folding along a diagonal does not make the halves match.',
        'An EQUILATERAL TRIANGLE has 3 lines of symmetry, one through each vertex to the midpoint of the opposite side.',
        'A REGULAR POLYGON with n sides has exactly n lines of symmetry.',
        'A CIRCLE has infinitely many lines of symmetry — every line through the centre is one.',
      ],
    },
    visualExplanation: {
      caption:
        'Below is a placeholder marker. The geometry idea: imagine a square ABCD on paper. The two diagonals AC and BD are lines of symmetry. The two segments joining the midpoints of opposite sides — one horizontal, one vertical — are also lines of symmetry. Total: 4 lines.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Draw a square and label the corners A (top-left), B (top-right), C (bottom-right), D (bottom-left).',
        'Draw the diagonal AC. Fold along it — the half ABC maps onto the half ACD. So AC is a line of symmetry.',
        'Draw the diagonal BD. Fold along it — the half ABD maps onto the half BCD. So BD is a line of symmetry too.',
        'Mark the midpoint of AB and the midpoint of CD; join them. Folding along that vertical line maps the left half onto the right. Line of symmetry #3.',
        'Mark the midpoint of AD and the midpoint of BC; join them. Folding along that horizontal line maps the top half onto the bottom. Line of symmetry #4.',
      ],
    },
    workedExamples: [
      {
        problem: 'How many lines of symmetry does an EQUILATERAL TRIANGLE have?',
        steps: [
          'An equilateral triangle has all three sides equal and all three angles equal (60°).',
          'For each vertex, draw a line from that vertex to the midpoint of the opposite side.',
          'Folding along any of these three lines makes the two halves of the triangle coincide.',
          'There are 3 vertices, so there are 3 lines of symmetry.',
        ],
        answer: '3 lines of symmetry.',
      },
      {
        problem: 'A non-square rectangle is shown. How many lines of symmetry does it have?',
        steps: [
          'A rectangle has 4 right angles and opposite sides equal.',
          'Test the two lines joining midpoints of opposite sides — folding along either makes the halves coincide. That gives 2 lines of symmetry.',
          'Test the two diagonals — folding along a diagonal of a non-square rectangle does NOT make the halves coincide (one half overshoots the other). So the diagonals are not lines of symmetry.',
          'Total: 2 lines of symmetry.',
        ],
        answer: '2 lines of symmetry.',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Claiming a rectangle has 4 lines of symmetry like a square',
        example: 'Saying a 3 × 6 rectangle has 4 lines of symmetry (the 2 midpoint lines AND the 2 diagonals).',
        why: 'Students remember "rectangle = 4 sides" and over-generalise from the square case, where 4 IS correct.',
        fix: 'Cut a rectangle of paper. Fold along a diagonal — the corners do NOT meet. Then fold along a midpoint line — they DO meet. Only the midpoint folds work, so only 2 lines of symmetry.',
      },
      {
        pattern: 'Claiming a parallelogram has lines of symmetry along its diagonals',
        example: 'Saying a leaning parallelogram has 2 lines of symmetry (its diagonals).',
        why: 'Students see two long lines that pass through the shape and assume both must be symmetry lines.',
        fix: 'Cut out a parallelogram (not a rectangle, not a rhombus) and try folding it along a diagonal — the halves do not match. A general parallelogram has 0 lines of symmetry, even though it does have rotational symmetry (a different idea).',
      },
      {
        pattern: 'Forgetting that a circle has INFINITELY many lines of symmetry',
        example: 'Saying a circle has 1 (or 2, or 4) lines of symmetry.',
        why: 'Students try to count discrete lines as they would for a polygon.',
        fix: 'For a circle, ANY straight line through the centre is a line of symmetry — and there are infinitely many such lines. The right answer is "infinitely many".',
      },
    ],
    practice: ['GB.08-01', 'GB.08-02', 'GB.08-03', 'GB.08-05', 'GB.08-08'],
    teacherNote:
      'Hand out paper cut-outs (square, rectangle, equilateral triangle, isosceles triangle, parallelogram, regular hexagon). Students fold each one in turn and count the lines of symmetry physically. Builds an intuition that "symmetry means folding lines up", not "diagonal lines look symmetrical".',
    parentNote:
      'Look around the house for symmetry: door frames (2 lines), the front of a fridge (often 1 vertical line), the face of a clock (lots of lines through the centre, but the numerals break most of them). Ask: "If I folded this along that line, would the two halves match?"',
  },

  // -------------------------------------------------------------------------
  // GB.09 — Coordinate basics: axes, origin, plotting points (v0.18)
  // -------------------------------------------------------------------------
  'GB.09': {
    skillId: 'GB.09',
    intro:
      'A coordinate plane has two perpendicular number lines — the horizontal x-axis and the vertical y-axis — meeting at the origin (0, 0). A point is named by an ordered pair (x, y): x is how far across, y is how far up. Order matters: (3, 5) and (5, 3) are different points.',
    reteach: {
      title: 'Reteach: reading and plotting points in the first quadrant',
      steps: [
        'Draw two perpendicular number lines. The horizontal one is the x-AXIS. The vertical one is the y-AXIS. They cross at the ORIGIN, labelled O, with coordinates (0, 0).',
        'A POINT is named by an ORDERED PAIR (x, y). The first number, x, is the x-coordinate (how far ACROSS). The second number, y, is the y-coordinate (how far UP). Order matters.',
        'To PLOT (4, 3): start at the origin, move 4 units to the right along the x-axis, then 3 units up parallel to the y-axis. Mark the point.',
        'To READ a point off the grid: drop a vertical line down to the x-axis to find x, then drop a horizontal line across to the y-axis to find y. Write the pair (x, y).',
        'A point on the x-AXIS has y = 0 (e.g., (5, 0)). A point on the y-AXIS has x = 0 (e.g., (0, 7)). The origin (0, 0) is on BOTH axes.',
      ],
    },
    visualExplanation: {
      caption:
        'Below is a placeholder marker. The geometry idea: a coordinate plane in the first quadrant, with the x-axis numbered 0, 1, 2, 3, 4, 5 to the right and the y-axis numbered 0, 1, 2, 3, 4, 5 upward. The origin is at the bottom-left where the two axes meet. Plot the point (2, 3): from O, go 2 right, then 3 up.',
      visual: { kind: 'bars', bars: [{ numerator: 1, denominator: 1, label: 'placeholder' }] },
      readingSteps: [
        'Draw a horizontal arrow pointing right and label it the x-axis. Number the units 0, 1, 2, 3, 4, 5.',
        'Draw a vertical arrow pointing up from the same starting point and label it the y-axis. Number the units 0, 1, 2, 3, 4, 5.',
        'The point where the two axes cross is the ORIGIN, O = (0, 0).',
        'To plot (2, 3): from O, move 2 units to the right along the x-axis, then 3 units up parallel to the y-axis. Mark the point with a dot.',
        'Notice that (3, 2) would be at a different location: 3 right, 2 up — a separate dot. Order matters.',
      ],
    },
    workedExamples: [
      {
        problem: 'A point lies on the x-axis, 6 units to the right of the origin. Write its coordinates.',
        steps: [
          'Any point on the x-axis has y-coordinate 0.',
          'The point is 6 units to the right of the origin, so its x-coordinate is 6.',
          'Coordinates: (6, 0).',
        ],
        answer: '(6, 0).',
      },
      {
        problem: 'Three corners of a rectangle are at (1, 1), (5, 1), and (5, 4). Find the coordinates of the fourth corner.',
        steps: [
          'The corners (1, 1) and (5, 1) share y = 1, so they are on the bottom edge.',
          'The corners (5, 1) and (5, 4) share x = 5, so they are on the right edge.',
          'For a rectangle, the fourth corner must sit directly above (1, 1) at the same height as (5, 4). So x = 1 and y = 4.',
          'Coordinates: (1, 4).',
        ],
        answer: '(1, 4).',
      },
    ],
    commonMistakes: [
      {
        pattern: 'Swapping x and y when reading or plotting a point',
        example: 'Plotting (3, 5) by going 5 right and 3 up instead of 3 right and 5 up.',
        why: 'Students remember that "one number is across and one is up" but forget which comes first.',
        fix: 'Memorise the order: x first (across), y second (up). A good mnemonic is "x is across the X" and "y goes up to the sky". Practise plotting (3, 5) and (5, 3) on the same grid to see they are DIFFERENT points.',
      },
      {
        pattern: 'Thinking points on the axes are "not really points" or have no coordinates',
        example: 'Saying a point on the x-axis has no y-coordinate, or guessing y = 1.',
        why: 'Students see the axis as separate from the grid.',
        fix: 'A point on the x-axis has y-coordinate 0 (it is at height 0). A point on the y-axis has x-coordinate 0 (it is right above the origin). The origin (0, 0) is the one point on BOTH axes.',
      },
      {
        pattern: 'Adding coordinates to find distance, e.g. distance from (0, 0) to (3, 0) = 3 + 0 = 3 (works) but then from (2, 3) to (2, 8) = 2 + 8 = 10 (wrong)',
        example: 'Saying the distance between (2, 3) and (2, 8) is 11 (2 + 3 + 2 + 8), or 10, or 6.',
        why: 'Students apply a half-remembered "add the coordinates" idea without checking it makes sense.',
        fix: 'When two points share an x-coordinate, they are on the same vertical line. The distance between them is the DIFFERENCE of their y-coordinates: 8 − 3 = 5. Same idea for two points on the same horizontal line — subtract the x-coordinates.',
      },
    ],
    practice: ['GB.09-01', 'GB.09-02', 'GB.09-05', 'GB.09-07', 'GB.09-08'],
    teacherNote:
      'Tape a large grid on the floor with masking tape, with axes numbered 0 to 6. Call out coordinates and have a student walk to the point. Then have students call coordinates for landmarks they place (a book, a chair) on the grid. Builds the "ordered pair" intuition physically.',
    parentNote:
      'Treat a chessboard or a graph-paper page as a coordinate grid. Pick a square together using "(2 across, 3 up)" language. Then swap to "(3 across, 2 up)" and notice it is a different square. Order really does matter.',
  },
};

// ---------------------------------------------------------------------------
// v0.17: Rich materials authored for a handful of representative skills.
// ---------------------------------------------------------------------------
// Coverage today: FR.06, DE.01, FM.07, GB.03. The other 30 skills still
// render the base Lesson; they can be extended at any time by adding an
// entry here without touching any UI.

export const RICH_BY_SKILL: Partial<Record<SkillId, RichLessonMaterials>> = {
  // -------------------------------------------------------------------------
  // FR.06 — Add fractions with unlike denominators
  // -------------------------------------------------------------------------
  'FR.06': {
    miniLesson:
      'To add two fractions you need pieces of the SAME size. When the denominators are different, the pieces are different sizes — so first we rewrite each fraction with a common denominator. The simplest choice is the smallest number that BOTH denominators divide into. Once both fractions sit on the same denominator, the addition is just numerator + numerator. Finally we check whether the answer can be simplified.',
    visualWalkthrough: [
      'Look at the two strips: one is split into halves (1/2 shaded), the other into thirds (1/3 shaded). The pieces are NOT the same size — that is exactly why we cannot add them as they are.',
      'Rebuild BOTH strips using sixths (1/2 = 3/6 and 1/3 = 2/6). Now every piece is the same size.',
      'Slide the shaded pieces together: 3/6 + 2/6 = 5/6. The denominator stays at 6 because the piece size did not change.',
      'Sanity check: 5/6 is less than 1 whole, which matches the picture — there is still 1/6 unshaded.',
    ],
    misconceptionReteach: {
      add_across:
        'A very common mistake is to add the numerators AND the denominators, e.g. 1/2 + 1/3 = 2/5. That breaks the meaning: the denominator names the piece size, and the piece size does not change just because you add. Re-draw both fractions on a single common-denominator strip — the picture makes it obvious that the denominator stays the same.',
      incomplete_conversion:
        'Some students rewrite only ONE fraction, e.g. 1/2 + 1/3 → 3/6 + 1/3. The two fractions still have different denominators, so they still cannot be added. Always rewrite BOTH fractions on the common denominator before adding.',
      wrong_common_denominator:
        'Students sometimes pick a common multiple that is not the smallest, e.g. 12 for 1/2 + 1/3 instead of 6. This still works numerically (1/2 + 1/3 = 6/12 + 4/12 = 10/12 = 5/6) but the final simplify step is required. Encourage finding the LCM, but accept any common multiple as long as the answer is simplified.',
    },
    teacherActivity: {
      title: 'Fraction strips on the table',
      timeMinutes: 12,
      materials: [
        'Pre-cut paper strips (or printed grid) for halves, thirds, fourths, sixths',
        'Pencils and a sheet for each student to record their work',
      ],
      steps: [
        'Hand each pair a half-strip and a third-strip. Ask: "Can you put them side by side to add 1/2 + 1/3 directly?"',
        'When the pair notices the pieces are different sizes, hand them sixths strips. Ask: "How many sixths in 1/2? How many sixths in 1/3?"',
        'Have them combine the sixths: 3/6 + 2/6 = 5/6. Record it on paper as "1/2 + 1/3 = 3/6 + 2/6 = 5/6".',
        'Repeat with 1/4 + 1/3 (use twelfths). Have students explain in their own words why we need a common denominator.',
        'Close with a quick exit prompt: "What goes wrong if we just add 1/4 + 1/3 = 2/7? Show me with the strips."',
      ],
    },
    independentPractice: [
      { prompt: '1/2 + 1/4 = ?', answer: '3/4' },
      { prompt: '1/3 + 1/6 = ?', answer: '1/2' },
      { prompt: '2/3 + 1/4 = ?', answer: '11/12' },
    ],
    exitTicket: [
      { prompt: 'Rewrite 1/2 + 1/3 with a common denominator, then add.', answer: '3/6 + 2/6 = 5/6' },
      { prompt: 'Why is 1/2 + 1/3 NOT equal to 2/5?', answer: 'Because the denominators name different piece sizes; you have to rewrite both fractions on the same denominator before adding.' },
    ],
    parentHomePractice: {
      intro:
        'A fraction-friendly snack works well for this skill. The goal is to make "same-size pieces" a physical, visible idea before any pencil work.',
      activity:
        'Take a roti or a chapati and cut it into 6 equal pieces. Ask: "If I eat 1/2 of the chapati, how many pieces is that?" (3.) "If I eat 1/3, how many pieces?" (2.) "Together I ate 3 + 2 = 5 pieces out of 6 — so 1/2 + 1/3 = 5/6." Repeat with a different cake or fruit cut into 12 pieces for 1/4 + 1/3.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFR.06 — Add fractions with unlike denominators\n\nFor each problem, rewrite both fractions with a common denominator, add, then simplify if possible.\n\n1) 1/2 + 1/4 =\n\n2) 1/3 + 1/6 =\n\n3) 2/3 + 1/4 =\n\n4) 1/2 + 2/5 =\n\n5) 3/4 + 1/6 =\n\n6) Word problem: Asha ate 1/2 of a chocolate bar and Ravi ate 1/3 of the same bar. How much did they eat together?\n\nShow your working in the space provided. Circle your final answer.',
  },

  // -------------------------------------------------------------------------
  // DE.01 — Decimal place value
  // -------------------------------------------------------------------------
  'DE.01': {
    miniLesson:
      'A decimal point is the boundary between the whole-number part and the part that is less than 1. Each place to the LEFT of the decimal point is 10 times bigger than the one to its right (ones, tens, hundreds, …) and each place to the RIGHT of the decimal point is 10 times SMALLER (tenths, hundredths, thousandths). So 0.7 means "7 tenths", which is the same as 7/10, and 0.07 means "7 hundredths" = 7/100. Reading the place name aloud is the single most useful habit for this skill.',
    visualWalkthrough: [
      'Look at the place-value chart. Find the decimal point — it does not have a value itself, it is just the boundary.',
      'Find the digit "7" in the tenths place. The tenths place is the FIRST place to the right of the decimal point.',
      'Read it aloud as "seven tenths", which is 7/10 or 0.7.',
      'Compare to "7" in the hundredths place. That is "seven hundredths" = 7/100 = 0.07 — ten times smaller than 0.7, even though the digit is the same.',
    ],
    misconceptionReteach: {
      treat_decimals_as_whole:
        'Students sometimes read 0.7 as "zero point seven" and treat the 7 as if it were the digit 7 in a whole number — comparing 0.7 vs 0.65 and saying "65 is bigger than 7, so 0.65 > 0.7". Re-anchor on the place names: 0.7 = 7 tenths = 70 hundredths, and 70 hundredths IS bigger than 65 hundredths. Force the student to say the place name out loud.',
      decimal_place_confusion:
        'Confusing tenths with tens. The TENTHS place is to the RIGHT of the decimal point and is SMALLER than 1. The TENS place is to the LEFT and is bigger than 1. Mnemonic: "tenths is a tiny piece; tens is a big pile."',
      ignore_leading_zero:
        'Reading 0.07 as 0.7 because the leading zero feels like it doesn\'t matter. Every digit between the decimal point and a non-zero digit DOES matter — that zero is keeping the 7 in the hundredths place. Use a place-value chart and physically point at the column for the 7.',
    },
    teacherActivity: {
      title: 'Tenths and hundredths place-value chart',
      timeMinutes: 10,
      materials: [
        'A large place-value chart printed for each pair, with columns: hundreds | tens | ones | . | tenths | hundredths | thousandths',
        'Digit cards 0–9 (one set per pair)',
      ],
      steps: [
        'Read aloud: "Place the digit 7 in the tenths column and zeros everywhere else. What number have you made?" (0.7)',
        '"Now move the 7 to the hundredths column and put zeros everywhere else. What number have you made?" (0.07)',
        'Ask each pair: "Which number is bigger, 0.7 or 0.07? How can you tell?"',
        'Have one student in each pair place a number; the other reads it aloud using place-value names ("three ones and four tenths and two hundredths").',
        'Close: write 0.25 and 0.250 on the board and ask "are these the same number? Why?" (Yes — adding trailing zeros after the last non-zero decimal digit does not change the value.)',
      ],
    },
    independentPractice: [
      { prompt: 'Write the value of the digit 4 in 23.45.', answer: '4 tenths (4/10 or 0.4)' },
      { prompt: 'Write 0.06 in words.', answer: 'Six hundredths' },
      { prompt: 'Which is bigger, 0.3 or 0.29?', answer: '0.3 (because 0.3 = 30 hundredths, and 30 > 29)' },
    ],
    exitTicket: [
      { prompt: 'In 5.74, what does the 7 mean?', answer: '7 tenths (i.e., 7/10).' },
      { prompt: 'Write "three and eight hundredths" as a decimal.', answer: '3.08' },
    ],
    parentHomePractice: {
      intro:
        'Money is the most natural place-value chart your child already knows — every rupee has 100 paise, so each paisa is one hundredth of a rupee.',
      activity:
        'Show your child ₹2.50 and ₹2.05. Ask: "Which one is more money? How do you know?" Then ask the same about ₹0.7 (70 paise) vs ₹0.07 (7 paise). The amounts being clearly different in real money helps the place-value idea click.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nDE.01 — Decimal place value\n\nA) Write the value of the underlined digit.\n\n1) 5._4_6  →  ________ (place name) = ________\n\n2) 12.0_7_  →  ________ (place name) = ________\n\n3) 0._3_5  →  ________ (place name) = ________\n\nB) Write each as a decimal.\n\n4) Six and four tenths  →  ______________\n\n5) Three hundredths     →  ______________\n\n6) Twenty and seven hundredths  →  ______________\n\nC) Compare with <, >, or =.\n\n7) 0.7 ___ 0.07\n\n8) 0.25 ___ 0.250\n\n9) 1.4 ___ 1.40',
  },

  // -------------------------------------------------------------------------
  // FM.07 — Lowest Common Multiple
  // -------------------------------------------------------------------------
  'FM.07': {
    miniLesson:
      'The Lowest Common Multiple (LCM) of two numbers is the SMALLEST number that BOTH of them divide into without remainder. One reliable way to find it is to list multiples of each number and find the first number that appears in both lists. A faster way is the prime-factorisation method: write each number as a product of primes, then take the HIGHEST power of every prime that appears in EITHER number.',
    visualWalkthrough: [
      'Look at the two lists of multiples: 4 → 4, 8, 12, 16, 20, 24, … and 6 → 6, 12, 18, 24, 30, …',
      'Underline the numbers that appear in BOTH lists: 12, 24, 36, …',
      'The SMALLEST one of those is the LCM. So LCM(4, 6) = 12.',
      'Cross-check with prime factors: 4 = 2 × 2 and 6 = 2 × 3. Take the highest power of every prime: 2² × 3 = 12. Same answer.',
    ],
    misconceptionReteach: {
      product_not_lcm:
        'A common mistake is to say "LCM(4, 6) = 24, because 4 × 6 = 24". Multiplying the numbers always gives a COMMON multiple, but not necessarily the LOWEST one. If the two numbers share a factor, the LCM is smaller than the product. Re-anchor by listing multiples — students see for themselves that 12 appears in both lists before 24 does.',
      hcf_lcm_swap:
        'Some students compute the HCF (the BIGGEST factor that divides BOTH numbers) when the question asks for the LCM. Use the headlines: "HCF = Highest Common FACTOR (a number that divides into both)" vs "LCM = Lowest Common MULTIPLE (a number that both divide into)". HCF is small and DIVIDES; LCM is bigger and IS DIVIDED.',
      missing_prime:
        'In the prime-factorisation method, students sometimes forget to include a prime that only appears in ONE of the numbers. For LCM(4, 9) = 2² × 3² = 36, students who only kept 2² (because 3 wasn\'t in the first number) get 4. The rule is: include EVERY prime that appears in EITHER number, taking the highest power of each.',
    },
    teacherActivity: {
      title: 'Hopscotch on the number line',
      timeMinutes: 12,
      materials: [
        'A chalk-drawn number line 1–40 on the floor (or a printed strip)',
        'Two students per game (one per number)',
      ],
      steps: [
        'Pick two small numbers, say 4 and 6. One student hops in multiples of 4 (lands on 4, 8, 12, …). The other hops in multiples of 6 (lands on 6, 12, 18, …).',
        'Ask the class to call out the first number BOTH students land on. That is the LCM.',
        'Repeat with 3 and 5 (no common factor → LCM = 15), and with 6 and 9 (share a factor → LCM = 18, not 54).',
        'Now do the same problems with prime factorisation on the board, and compare answers — they always match.',
        'Close with: "Why is LCM(6, 9) less than 6 × 9? Because 6 and 9 share the factor 3, so you don\'t need to include it twice."',
      ],
    },
    independentPractice: [
      { prompt: 'Find LCM(8, 12).', answer: '24' },
      { prompt: 'Find LCM(5, 7).', answer: '35' },
      { prompt: 'Find LCM(6, 9).', answer: '18' },
    ],
    exitTicket: [
      { prompt: 'Find LCM(4, 10) by listing multiples.', answer: '20 (multiples of 4: 4, 8, 12, 16, 20…; multiples of 10: 10, 20…; first common = 20)' },
      { prompt: 'A bus comes every 12 minutes and a tram comes every 18 minutes. They both leave at 9:00 a.m. When will they next leave together?', answer: 'At 9:36 a.m. (LCM of 12 and 18 = 36 minutes).' },
    ],
    parentHomePractice: {
      intro:
        'LCM shows up naturally in scheduling and lining up.',
      activity:
        'Set up a kitchen rhythm: "I stir the dal every 6 minutes and add a pinch of salt every 8 minutes. If I do both at 7:00 p.m., when will I next do both at the same time?" (After 24 minutes — that\'s LCM(6, 8) = 24.) Try other pairs (5 and 7, 4 and 10).',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFM.07 — Lowest Common Multiple (LCM)\n\nA) List the first six multiples of each number, then find the LCM.\n\n1) 3 and 4. Multiples of 3: ___________________. Multiples of 4: ___________________. LCM = ______\n\n2) 6 and 9. Multiples of 6: ___________________. Multiples of 9: ___________________. LCM = ______\n\nB) Use prime factorisation.\n\n3) LCM(8, 12) = ______\n\n4) LCM(5, 6) = ______\n\n5) LCM(10, 15) = ______\n\nC) Word problem.\n\n6) A clock chimes every 15 minutes. A door bell rings every 20 minutes. Both go off at noon. When do they next go off together?  ______________',
  },

  // -------------------------------------------------------------------------
  // GB.03 — Types of angles
  // -------------------------------------------------------------------------
  'GB.03': {
    miniLesson:
      'Angles are classified by their measure in degrees. An ACUTE angle is between 0° and 90° (smaller than a square corner). A RIGHT angle is exactly 90° (a square corner). An OBTUSE angle is between 90° and 180° (bigger than a square corner but less than a straight line). A STRAIGHT angle is exactly 180° (a flat line). A REFLEX angle is between 180° and 360° (bigger than a straight line). Practise eyeballing each kind before you ever measure one.',
    visualWalkthrough: [
      'Hold up the corner of a book or a notebook. That corner is exactly 90° — a RIGHT angle. It is your reference.',
      'Now open the two hands of a pair of scissors a little. The angle is SMALLER than the book corner — that\'s ACUTE.',
      'Open the scissors past the book-corner mark, but not all the way flat. The angle is BIGGER than the book corner but smaller than a flat line — that\'s OBTUSE.',
      'Lay the scissors flat in a straight line — exactly 180°. That\'s a STRAIGHT angle.',
      'Now rotate one blade PAST flat, so the opening is more than half a circle but not yet all the way around. That huge angle is a REFLEX angle.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Some students decide on the angle type by the LENGTH of the arms instead of the OPENING between them. The size of the angle has nothing to do with how long you draw the rays. Re-draw the same 60° angle with very short rays and again with very long rays — the angle is the same. Cover the rays with your finger and look only at the gap at the vertex.',
      right_vs_acute:
        'Students sometimes call any small-looking angle "acute" and any angle that looks square-ish "right". Train them to ALWAYS check against a reference 90° corner (the corner of a book, a piece of paper, a setsquare). If the angle is even a hair smaller than the corner, it is acute, not right.',
      obtuse_vs_reflex:
        'Students confuse obtuse (between 90° and 180°) with reflex (between 180° and 360°). Use the straight line as the boundary: if the angle hasn\'t opened past flat, it can\'t be reflex.',
    },
    teacherActivity: {
      title: 'Sort the angles',
      timeMinutes: 10,
      materials: [
        '15 printed angle cards in mixed orientations (some acute, some right, some obtuse, some straight, two reflex)',
        'Five labelled trays on the desk: ACUTE, RIGHT, OBTUSE, STRAIGHT, REFLEX',
      ],
      steps: [
        'Hand each pair the deck of 15 cards. They must sort every card into one of the five trays.',
        'After 4 minutes, swap trays with another pair and check each other\'s work. Disagreements get measured with a protractor.',
        'Bring the class back together and discuss any "tough" cards — usually the right-vs-acute ones that look close.',
        'Quick whiteboard: draw an angle, hide one of its rays with your hand, ask the class to call out the type from just looking at the gap.',
        'Close with: "If I tell you an angle is 95°, what type is it?" (Obtuse — just past 90°.)',
      ],
    },
    independentPractice: [
      { prompt: 'Classify a 45° angle.', answer: 'Acute' },
      { prompt: 'Classify a 110° angle.', answer: 'Obtuse' },
      { prompt: 'Classify a 270° angle.', answer: 'Reflex' },
    ],
    exitTicket: [
      { prompt: 'What is the difference between an obtuse angle and a reflex angle?', answer: 'An obtuse angle is between 90° and 180°; a reflex angle is between 180° and 360°.' },
      { prompt: 'Give one example from the classroom of a right angle.', answer: 'Any corner of the door, window, book, or desk.' },
    ],
    parentHomePractice: {
      intro:
        'Angles are everywhere at home — your child just needs the vocabulary.',
      activity:
        'Walk around the kitchen and the living room together. Ask your child to point out: 3 right angles (corners of tables, doors, windows), 2 acute angles (the small angle on a pair of open scissors, the angle on a slice of pizza), 2 obtuse angles (the angle of a half-open laptop screen, the angle of a sofa back).',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nGB.03 — Types of angles\n\nA) Classify each angle as acute / right / obtuse / straight / reflex.\n\n1) 30°  → ________\n\n2) 90°  → ________\n\n3) 145° → ________\n\n4) 180° → ________\n\n5) 210° → ________\n\n6) 75°  → ________\n\nB) Short answer.\n\n7) Sketch an obtuse angle and label it with an approximate measure.\n\n8) Sketch a reflex angle and label it with an approximate measure.\n\n9) Why is the size of an angle not affected by the length of its arms?  ________________________________',
  },

  // -------------------------------------------------------------------------
  // v0.19: rich materials for the remaining 32 skills. Concise but real.
  // Each entry is content-draft only — requires CBSE teacher review.
  // -------------------------------------------------------------------------

  // ===== Fractions (FR.02, FR.03, FR.04, FR.05, FR.07, FR.08) ==============
  'FR.02': {
    miniLesson:
      'A fraction names equal-sized parts of a whole. The bottom number (denominator) tells how many equal pieces the whole is split into; the top number (numerator) tells how many of those pieces are taken. So 3/4 of a bar means: split the bar into 4 equal pieces and take 3 of them. The key word is EQUAL — unequal pieces do not give a valid fraction.',
    visualWalkthrough: [
      'Look at the bar and count the total number of equal pieces — that is the denominator.',
      'Count the shaded pieces — that is the numerator.',
      'Write the fraction as numerator/denominator, e.g. 3/4.',
      'Check: are all the pieces the same size? If not, the picture is not showing a fraction at all.',
    ],
    misconceptionReteach: {
      visual_misread:
        'Students sometimes count the shaded pieces but forget to check the total, or vice versa. Always count BOTH: the total equal pieces (denominator) and the shaded pieces (numerator). Point at each in turn and say the place out loud.',
      unequal_parts:
        'A bar cut into unequal pieces does not show a fraction. Redraw the picture with equal-width cells before naming the fraction.',
    },
    teacherActivity: {
      title: 'Folded-paper fractions',
      timeMinutes: 10,
      materials: ['One strip of paper per student', 'Crayons or markers'],
      steps: [
        'Hand each student a paper strip. Have them fold it in half, then in half again — 4 equal sections.',
        'Ask them to shade 3 of the 4 sections. "What fraction did you shade?" (3/4)',
        'Refold to 8 sections; ask "shade 5 of them" → 5/8. Discuss why 5/8 is bigger or smaller than 3/4.',
        'Close: have them sketch a bar cut into 5 equal pieces with 2 shaded, label it 2/5.',
      ],
    },
    independentPractice: [
      { prompt: 'A bar is cut into 8 equal pieces and 3 are shaded. What fraction is shaded?', answer: '3/8' },
      { prompt: 'Draw a rectangle showing 2/5.', answer: 'Rectangle cut into 5 equal columns with 2 of them shaded.' },
      { prompt: 'What fraction of a clock face is the section from 12 to 3?', answer: '3/12 = 1/4' },
    ],
    exitTicket: [
      { prompt: 'In the fraction 5/7, what does the 5 mean? What does the 7 mean?', answer: '5 = number of equal pieces taken (numerator); 7 = total equal pieces in the whole (denominator).' },
      { prompt: 'Why must the pieces be EQUAL?', answer: 'Because the denominator names a piece size; if pieces are unequal, the fraction has no clear meaning.' },
    ],
    parentHomePractice: {
      intro: 'Mealtime is a natural fraction lab.',
      activity: 'Cut a roti or pizza into 6 equal pieces. Ask: "If we eat 4 pieces, what fraction is gone? What fraction is left?" (4/6 gone, 2/6 left.) Repeat with a different number of pieces.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFR.02 — Represent fractions visually\n\n1) A pizza is cut into 8 equal slices. 3 are eaten. What fraction is eaten? __________\n\n2) Draw a bar split into 5 equal parts. Shade 3.\n\n3) Draw a circle split into 4 equal quarters. Shade 1.\n\n4) Write the fraction shown by 6 shaded squares out of 10. __________\n\n5) Why do the pieces have to be the same size?\n___________________________________________________',
  },

  'FR.03': {
    miniLesson:
      'Two fractions are EQUIVALENT when they name the same amount, even if the numbers look different. The rule is simple: multiply BOTH the numerator and the denominator by the same non-zero number, and the value stays the same. So 1/2 = 2/4 = 3/6 = 4/8. Dividing both parts by their HCF gives the SIMPLEST form.',
    visualWalkthrough: [
      'Draw a bar split in half with one half shaded. The fraction shaded is 1/2.',
      'Split each of those halves into two — now there are 4 pieces, and 2 of them are shaded.',
      'The shaded amount has not changed, but you now read it as 2/4. So 1/2 = 2/4.',
      'Repeat by splitting once more: 4/8 of the bar is shaded — same amount, different name.',
    ],
    misconceptionReteach: {
      incomplete_conversion:
        'Multiplying only the denominator (or only the numerator) by k breaks equivalence: 1/2 is NOT equal to 1/4 or to 2/2. To stay equivalent, multiply BOTH parts by the SAME number.',
      form_error:
        'Forgetting to simplify the final answer. After every operation, divide numerator and denominator by their HCF until they share no common factor other than 1.',
    },
    teacherActivity: {
      title: 'Equivalent-fraction ladder',
      timeMinutes: 10,
      materials: ['Lined paper for each student'],
      steps: [
        'Write 1/2 at the top of the paper.',
        'Have students write 5 equivalent fractions by multiplying top AND bottom by 2, 3, 4, 5, 6 in turn.',
        'Now flip: start with 12/18 and have them simplify all the way to lowest terms (2/3).',
        'Compare answers in pairs. Anyone who got something different than their partner: re-check by multiplying back.',
      ],
    },
    independentPractice: [
      { prompt: 'Fill the blank: 3/4 = ?/12', answer: '9 (multiply top and bottom by 3)' },
      { prompt: 'Simplify 18/24 to lowest terms.', answer: '3/4 (divide both by 6)' },
      { prompt: 'Are 2/3 and 8/12 equivalent?', answer: 'Yes (multiply 2/3 by 4/4).' },
    ],
    exitTicket: [
      { prompt: 'Write three fractions equivalent to 2/5.', answer: '4/10, 6/15, 8/20 (any equivalent works)' },
      { prompt: 'Simplify 20/30.', answer: '2/3' },
    ],
    parentHomePractice: {
      intro: 'Money is a clean equivalence demonstration.',
      activity: 'Show that ₹50 out of ₹100 is the same as ₹1 out of ₹2 — both are half. Ask: "What about ₹25 out of ₹50? Still half?" Yes, because 25/50 = 1/2.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFR.03 — Equivalent fractions\n\nA) Fill in the missing numbers.\n\n1) 1/2 = __/8\n2) 2/3 = __/12\n3) 3/5 = __/20\n4) 7/__ = 21/27\n\nB) Simplify to lowest terms.\n\n5) 6/8 = ____\n6) 10/15 = ____\n7) 16/24 = ____\n\nC) Short answer.\n\n8) Explain in your own words why 3/4 = 9/12.\n____________________________________________',
  },

  'FR.04': {
    miniLesson:
      'A MIXED NUMBER has a whole part and a fractional part, like 2 3/4. An IMPROPER FRACTION has a numerator at least as big as the denominator, like 11/4. They name the same amount: 11/4 = 2 3/4. Convert mixed → improper by multiplying the whole by the denominator and adding the numerator. Convert improper → mixed by dividing numerator by denominator; the quotient is the whole part, the remainder is the new numerator.',
    visualWalkthrough: [
      'Draw 2 whole bars of 4 pieces each (so 8 pieces in all), all shaded.',
      'Draw a third bar of 4 pieces, with 3 shaded.',
      'Count all shaded pieces: 8 + 3 = 11, each piece is 1/4 of a bar. So the picture shows 11/4.',
      'It also shows 2 whole bars and 3/4 of another — that is the mixed number 2 3/4.',
    ],
    misconceptionReteach: {
      mixed_number_error:
        'Students sometimes "add" 2 + 3/4 by writing 5/4 (adding 2 + 3 in the numerator) or 2 3/4 → 234 (ignoring the fraction structure). Walk back to the picture: 2 3/4 is TWO wholes PLUS three-quarters. Use the formula whole × denominator + numerator only AFTER the picture makes sense.',
    },
    teacherActivity: {
      title: 'Bars and stacks',
      timeMinutes: 12,
      materials: ['Paper strips cut into 4 equal pieces (one strip per student, several strips per pair)'],
      steps: [
        'Hand each pair 3 strips, each cut into 4 quarters. Ask them to lay out 2 whole strips + 3 quarters from the third.',
        '"How many quarters in total?" (11) "So what improper fraction does this show?" (11/4)',
        '"What mixed number is that?" (2 and 3/4)',
        'Repeat with 5 thirds (1 and 2/3) and 9 halves (4 and 1/2).',
      ],
    },
    independentPractice: [
      { prompt: 'Convert 17/5 to a mixed number.', answer: '3 2/5' },
      { prompt: 'Convert 4 1/3 to an improper fraction.', answer: '13/3' },
      { prompt: 'Which is bigger, 11/4 or 2 1/2?', answer: '11/4 (= 2 3/4 > 2 1/2)' },
    ],
    exitTicket: [
      { prompt: 'Convert 2 3/5 to an improper fraction.', answer: '13/5' },
      { prompt: 'Convert 22/7 to a mixed number.', answer: '3 1/7' },
    ],
    parentHomePractice: {
      intro: 'Cooking measurements are full of mixed numbers.',
      activity: 'Show 2 1/2 cups of flour using a measuring cup. Ask: "How many half-cups is that?" (5 half-cups = 5/2.) Repeat with 1 3/4 cups of water.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFR.04 — Mixed numbers and improper fractions\n\nA) Convert each improper fraction to a mixed number.\n\n1) 9/4 = ____\n2) 17/3 = ____\n3) 25/6 = ____\n\nB) Convert each mixed number to an improper fraction.\n\n4) 2 1/3 = ____\n5) 3 4/5 = ____\n6) 5 1/2 = ____\n\nC) Compare. Write >, <, or =.\n\n7) 11/4 ___ 2 1/2\n8) 13/5 ___ 2 3/5\n9) 9/2 ___ 4 1/2',
  },

  'FR.05': {
    miniLesson:
      'When two fractions have the SAME denominator, adding or subtracting them is just adding or subtracting the numerators. The denominator does not change because the piece size is the same. So 3/8 + 2/8 = 5/8 and 5/8 − 1/8 = 4/8 = 1/2. Always simplify the answer if possible.',
    visualWalkthrough: [
      'Draw a bar split into 8 equal eighths.',
      'Shade 3 eighths in one colour, then 2 more eighths in a second colour.',
      'Count shaded: 3 + 2 = 5 eighths shaded, so 3/8 + 2/8 = 5/8.',
      'For subtraction, start with 5/8 shaded and cross out 1/8. Four eighths remain: 5/8 − 1/8 = 4/8 = 1/2.',
    ],
    misconceptionReteach: {
      add_across:
        'Even with like denominators, students sometimes change the denominator (3/8 + 2/8 = 5/16). Anchor: the denominator names the piece SIZE — adding more pieces of the same size never changes the size, only the count.',
      form_error:
        'Final answers should be in simplest form. After adding, check if numerator and denominator share a factor.',
    },
    teacherActivity: {
      title: 'Counting eighths',
      timeMinutes: 8,
      materials: ['Paper strips cut into 8 equal pieces (one per pair)'],
      steps: [
        'Each pair lays the 8 pieces out. Take 3 → "this is 3/8". Add 2 more → "now 5/8".',
        'Take 5 pieces, remove 1 → "5/8 − 1/8 = 4/8 = 1/2".',
        'Have them write 4 sums and 4 differences on paper, all with like denominators.',
      ],
    },
    independentPractice: [
      { prompt: '3/7 + 2/7 = ?', answer: '5/7' },
      { prompt: '7/10 − 3/10 = ?', answer: '4/10 = 2/5' },
      { prompt: '5/6 + 5/6 = ?', answer: '10/6 = 5/3 = 1 2/3' },
    ],
    exitTicket: [
      { prompt: '4/9 + 2/9 = ?', answer: '6/9 = 2/3' },
      { prompt: '11/12 − 5/12 = ?', answer: '6/12 = 1/2' },
    ],
    parentHomePractice: {
      intro: 'Slice a fruit into equal pieces and combine.',
      activity: 'Cut an orange into 8 equal segments. Eat 3 — that is 3/8. Eat 2 more — that is another 2/8. How much has been eaten in all? (5/8.) How much is left? (3/8.)',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFR.05 — Add and subtract with like denominators\n\n1) 2/5 + 1/5 = ____\n2) 3/8 + 5/8 = ____\n3) 7/9 − 2/9 = ____\n4) 5/6 + 5/6 = ____\n5) 11/12 − 7/12 = ____\n\nWord problem.\n\n6) Asha had 7/10 of a chocolate bar. She gave 3/10 to her brother. How much is left? ____',
  },

  'FR.07': {
    miniLesson:
      'To subtract two fractions with different denominators, first rewrite BOTH fractions on a common denominator (the LCM works best). Then subtract the numerators; the denominator stays the same. Simplify at the end. The reasoning is identical to addition — you cannot subtract pieces of different sizes.',
    visualWalkthrough: [
      'Look at 3/4 and 1/3 — different denominators, different piece sizes.',
      'Find the LCM of 4 and 3: it is 12. Rewrite 3/4 = 9/12 and 1/3 = 4/12.',
      'Now both fractions are in twelfths. Subtract numerators: 9/12 − 4/12 = 5/12.',
      'Check whether 5/12 simplifies. HCF(5, 12) = 1, so 5/12 is already in lowest terms.',
    ],
    misconceptionReteach: {
      subtract_across:
        'Subtracting numerators AND denominators (3/4 − 1/3 = 2/1) is wrong for the same reason as adding across. The denominator names the piece size and must match before you can combine.',
      borrowing_error:
        'When subtracting mixed numbers like 3 1/4 − 1 3/4, students sometimes "subtract the smaller from the larger" inside the fraction to avoid borrowing. Walk through the borrow on the number line: 3 1/4 = 2 + 5/4, so the answer is (2 − 1) + (5/4 − 3/4) = 1 + 2/4 = 1 1/2.',
    },
    teacherActivity: {
      title: 'Common-denominator card-match',
      timeMinutes: 10,
      materials: ['Cards with fraction pairs printed on them (e.g., 3/4 and 1/3)'],
      steps: [
        'Give each pair 5 cards with two fractions each.',
        'They must (a) find the LCM, (b) rewrite both fractions, (c) subtract.',
        'Walk around and prompt: "Same piece size yet? OK, subtract."',
        'Close: spotlight one card on the board and walk through it with the class.',
      ],
    },
    independentPractice: [
      { prompt: '3/4 − 1/3 = ?', answer: '9/12 − 4/12 = 5/12' },
      { prompt: '5/6 − 1/2 = ?', answer: '5/6 − 3/6 = 2/6 = 1/3' },
      { prompt: '2 1/4 − 1 1/2 = ?', answer: '9/4 − 6/4 = 3/4' },
    ],
    exitTicket: [
      { prompt: '7/8 − 1/4 = ?', answer: '7/8 − 2/8 = 5/8' },
      { prompt: 'Why is 3/4 − 1/3 NOT equal to 2/1?', answer: 'Because the denominators name different piece sizes; you must rewrite both fractions with the same denominator before subtracting.' },
    ],
    parentHomePractice: {
      intro: 'A glass of liquid is a friendly subtraction model.',
      activity: 'Fill a glass to 3/4 with water. Pour out 1/3 of a full glass. Discuss: how much remains? Use a measuring cup if you have one.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFR.07 — Subtract fractions with unlike denominators\n\nFor each, rewrite both fractions with a common denominator, then subtract.\n\n1) 1/2 − 1/4 = ____\n2) 2/3 − 1/6 = ____\n3) 5/6 − 1/2 = ____\n4) 3/4 − 1/3 = ____\n5) 2 1/4 − 1 1/2 = ____\n\nWord problem.\n\n6) A jug holds 3/4 L of milk. After pouring 1/3 L into a glass, how much is left in the jug? ____',
  },

  'FR.08': {
    miniLesson:
      'Fraction word problems hide an arithmetic operation inside a story. The skill is to read carefully, decide which operation the story is asking for (combine → add, take away → subtract, compare → subtract, share equally → divide), and then carry out the fraction arithmetic you already know.',
    visualWalkthrough: [
      'Read the problem TWICE before writing anything.',
      'Underline the numbers and the fraction units (cups, kg, hours).',
      'Decide the operation. "Together" / "in all" → add; "left" / "remaining" / "more than" → subtract.',
      'Carry out the arithmetic with a common denominator if needed. Simplify the final answer.',
    ],
    misconceptionReteach: {
      operation_confusion:
        'The word "left" almost always signals subtraction. The word "together" almost always signals addition. Practise reading problems aloud and circling the cue word before doing any arithmetic.',
      conceptual_gap:
        'For multi-step problems, do the steps in order. Find the total first, then take away. Never try to combine all numbers in one calculation.',
    },
    teacherActivity: {
      title: 'Cue-word sort',
      timeMinutes: 12,
      materials: ['10 word-problem cards, each with one fraction operation hidden inside'],
      steps: [
        'Pairs sort the cards into three piles: addition, subtraction, mixed (more than one step).',
        'For each card, they underline the cue word that signalled the operation.',
        'Whole class shares: any disagreements? Discuss why.',
      ],
    },
    independentPractice: [
      { prompt: 'Asha drank 1/4 L of juice and Ravi drank 1/3 L. How much did they drink together?', answer: '3/12 + 4/12 = 7/12 L' },
      { prompt: 'A pole is 3/4 m tall. After breaking off 1/6 m from the top, how tall is it?', answer: '9/12 − 2/12 = 7/12 m' },
      { prompt: 'Of a 2/3 kg cake, Asha ate 1/4 kg. How much is left?', answer: '8/12 − 3/12 = 5/12 kg' },
    ],
    exitTicket: [
      { prompt: 'A glass holds 1/2 L. After drinking 1/8 L, how much is left?', answer: '4/8 − 1/8 = 3/8 L' },
      { prompt: 'What cue word in the problem above told you to subtract?', answer: '"After drinking" (or "left").' },
    ],
    parentHomePractice: {
      intro: 'Daily routines are full of fraction stories.',
      activity: 'Ask your child: "If you spent 3/4 hour on math homework and 1/2 hour on reading, how long did you spend on homework in total?" Then: "If dinner was at 7:30 and you took 3/4 of an hour to finish, what time did you finish?"',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFR.08 — Fraction word problems\n\nRead carefully, circle the cue word, decide the operation, and solve.\n\n1) Asha drank 2/5 L of juice and Ravi drank 1/4 L. How much did they drink together?\n\n2) A piece of ribbon is 7/8 m long. After cutting off 1/4 m, how much is left?\n\n3) A jug holds 2/3 L of milk. After pouring out 1/2 L into a glass, how much remains?\n\n4) Asha studied for 3/4 hour and Ravi studied for 5/6 hour. Who studied longer, and by how much?',
  },

  // ===== Decimals (DE.02–DE.05) ============================================
  'DE.02': {
    miniLesson:
      'A decimal like 0.7 is just a shorter way of writing 7/10. Decimals and fractions with denominators 10, 100, 1000 convert in both directions: 0.07 = 7/100, 3/4 = 0.75 (because 3/4 = 75/100). For "hard" fractions like 1/3, the decimal does not terminate — write 0.333… or just round.',
    visualWalkthrough: [
      'Read the decimal aloud using place names: 0.07 = "seven hundredths".',
      'Write the fraction with that denominator: 7/100.',
      'Simplify if possible: 0.25 = 25/100 = 1/4.',
      'Going the other way, scale the denominator to 10, 100, or 1000: 3/4 = 75/100 = 0.75.',
    ],
    misconceptionReteach: {
      incomplete_conversion:
        'Students sometimes write 1/4 = 0.4 by reading "1 over 4" as "point 4". The correct method is to make the denominator a power of 10: 1/4 = 25/100 = 0.25.',
      decimal_place_confusion:
        '0.5 and 0.05 are not the same. 0.5 = 5 tenths = 1/2. 0.05 = 5 hundredths = 1/20. Always say the place name aloud.',
    },
    teacherActivity: {
      title: 'Match the cards',
      timeMinutes: 10,
      materials: ['Cards with fractions on one side and decimals on the other'],
      steps: [
        'Pairs match each fraction card with its decimal card.',
        'For "hard" pairs (1/3 → 0.333…), they write the recurring decimal in their notebook.',
        'Close: write 0.6 on the board and ask "What fraction is this in lowest terms?" (3/5)',
      ],
    },
    independentPractice: [
      { prompt: 'Convert 0.4 to a fraction in lowest terms.', answer: '2/5' },
      { prompt: 'Convert 7/20 to a decimal.', answer: '0.35' },
      { prompt: 'Convert 0.125 to a fraction in lowest terms.', answer: '1/8' },
    ],
    exitTicket: [
      { prompt: 'Write 3/4 as a decimal.', answer: '0.75' },
      { prompt: 'Write 0.6 as a fraction in lowest terms.', answer: '3/5' },
    ],
    parentHomePractice: {
      intro: 'Money is the easiest decimal–fraction context.',
      activity: '₹0.50 is the same as half a rupee — that is 1/2. ₹0.25 is one-quarter (1/4). Ask: "What is ₹0.75 as a fraction of a rupee?" (3/4.)',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nDE.02 — Convert fractions and decimals\n\nA) Decimal → fraction (lowest terms).\n1) 0.5 = ____\n2) 0.25 = ____\n3) 0.8 = ____\n4) 0.04 = ____\n\nB) Fraction → decimal.\n5) 1/4 = ____\n6) 3/5 = ____\n7) 7/10 = ____\n8) 3/8 = ____',
  },

  'DE.03': {
    miniLesson:
      'To compare two decimals, line them up by the decimal point and compare digit by digit from left to right. The first place where they differ decides which is larger. Padding shorter decimals with trailing zeros makes the comparison easier — 0.5 = 0.50, so 0.5 vs 0.45 is the same as 50 hundredths vs 45 hundredths.',
    visualWalkthrough: [
      'Write both numbers under each other with decimal points aligned.',
      'Add trailing zeros so both have the same number of decimal places.',
      'Compare digit by digit from the LEFT until they differ.',
      'The number with the bigger digit in that place is the larger number.',
    ],
    misconceptionReteach: {
      treat_decimals_as_whole:
        'Many students compare 0.45 vs 0.5 as if "45 > 5", concluding 0.45 is larger. Re-anchor on tenths/hundredths: 0.5 = 50 hundredths, 0.45 = 45 hundredths, so 0.5 > 0.45.',
      ignore_leading_zero:
        '0.07 is smaller than 0.7 because 0.07 has zero tenths and 0.7 has seven tenths.',
    },
    teacherActivity: {
      title: 'Order the cards',
      timeMinutes: 10,
      materials: ['8 cards with decimals like 0.5, 0.45, 0.6, 0.55, 0.7, 0.07, 0.75, 0.5 — different but close'],
      steps: [
        'Pairs lay all 8 cards on the desk and order them smallest → largest.',
        'They must verbalise why one card beats another.',
        'Take a photo or write the final order on paper.',
        'Whole-class check.',
      ],
    },
    independentPractice: [
      { prompt: 'Which is bigger, 0.6 or 0.59?', answer: '0.6 (= 0.60 > 0.59)' },
      { prompt: 'Order from smallest: 0.7, 0.07, 0.77, 0.707.', answer: '0.07 < 0.7 < 0.707 < 0.77' },
      { prompt: 'Is 0.4 equal to 0.40?', answer: 'Yes — trailing zeros after the last non-zero decimal digit do not change the value.' },
    ],
    exitTicket: [
      { prompt: 'Which is bigger, 0.305 or 0.35?', answer: '0.35 (= 0.350 > 0.305)' },
      { prompt: 'Order from smallest: 0.2, 0.02, 0.22, 0.202.', answer: '0.02 < 0.2 < 0.202 < 0.22' },
    ],
    parentHomePractice: {
      intro: 'Sports times and prices are perfect for decimal comparison.',
      activity: 'Compare two cricket batting averages, two race times, or two grocery prices. Ask: "Which is smaller? How much smaller?" Encourage your child to line them up vertically.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nDE.03 — Compare and order decimals\n\nA) Fill in >, <, or =.\n1) 0.5 ___ 0.45\n2) 0.07 ___ 0.7\n3) 0.300 ___ 0.3\n4) 0.62 ___ 0.620\n\nB) Order from smallest to largest.\n5) 0.4, 0.04, 0.44, 0.404 → ____, ____, ____, ____\n6) 1.5, 1.05, 1.50, 1.55 → ____, ____, ____, ____',
  },

  'DE.04': {
    miniLesson:
      'To add or subtract decimals, line up the decimal points and pad with trailing zeros so both numbers have the same number of decimal places. Then add or subtract as you would whole numbers, carrying or borrowing as needed. The decimal point in the answer goes directly below the aligned decimal points.',
    visualWalkthrough: [
      'Write both numbers vertically with decimal points aligned.',
      'Pad with trailing zeros: 2.7 + 1.45 → 2.70 + 1.45.',
      'Add column by column from the right, carrying as usual.',
      'Place the decimal point in the answer directly below the aligned points.',
    ],
    misconceptionReteach: {
      decimal_place_confusion:
        'Lining numbers up by their right edge (as for whole numbers) is wrong for decimals. Always align by the decimal point. Adding 2.7 + 1.45 with right-edge alignment gives nonsense — use the columns.',
      arithmetic_slip:
        'A common slip is forgetting to carry when the column adds to 10 or more. Mark the carry above the next column.',
    },
    teacherActivity: {
      title: 'Decimal-column race',
      timeMinutes: 12,
      materials: ['Worksheet with 8 sums + 8 differences'],
      steps: [
        'Each student tackles the worksheet individually, lining up columns carefully.',
        'After 6 minutes, swap with a partner and mark.',
        'Discuss the two most common errors found.',
      ],
    },
    independentPractice: [
      { prompt: '2.7 + 1.45 = ?', answer: '4.15' },
      { prompt: '8.3 − 2.55 = ?', answer: '5.75' },
      { prompt: '1.06 + 0.94 = ?', answer: '2.00' },
    ],
    exitTicket: [
      { prompt: '3.45 + 1.6 = ?', answer: '5.05' },
      { prompt: '7.2 − 4.35 = ?', answer: '2.85' },
    ],
    parentHomePractice: {
      intro: 'Receipts are everyday decimal arithmetic.',
      activity: 'Buy two items at a shop. Add the prices on paper before the shopkeeper rings them up. Compare. Then ask: "How much change from ₹100?"',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nDE.04 — Add and subtract decimals\n\nLine up the decimal points before computing.\n\n1) 2.4 + 1.7 = ____\n2) 3.05 + 4.9 = ____\n3) 6.75 − 2.4 = ____\n4) 10 − 3.65 = ____\n5) 0.8 + 0.45 + 1.2 = ____\n\nWord problem.\n6) A roll of cloth is 5.6 m long. After 2.85 m is cut off, how much is left? ____',
  },

  'DE.05': {
    miniLesson:
      'Decimal word problems work the same way as fraction word problems: read carefully, decide the operation from the story, and use decimal arithmetic. Money problems are everywhere — totals, change, balances — and they are ALL decimal problems in disguise.',
    visualWalkthrough: [
      'Underline the numbers and the units (₹, kg, L, m).',
      'Decide the operation. "Total" → add; "left" / "change" → subtract.',
      'Line up the decimal points and compute.',
      'Re-read the question. Did you answer what was asked? In the right units?',
    ],
    misconceptionReteach: {
      operation_confusion:
        'Money problems with "change" mean subtraction from the amount given, not the price. Read the question once more before computing.',
    },
    teacherActivity: {
      title: 'Shop counter role-play',
      timeMinutes: 12,
      materials: ['Pretend shop with 6 items, each priced in decimal rupees'],
      steps: [
        'One student plays shopkeeper, another customer. Customer buys two items.',
        'Both must compute the total and the change, separately, then compare.',
        'Swap roles. Repeat with a different pair of items.',
      ],
    },
    independentPractice: [
      { prompt: 'A pen costs ₹12.50 and a notebook ₹35.75. Find the total.', answer: '₹48.25' },
      { prompt: 'A child gives ₹100 for items worth ₹73.40. How much change?', answer: '₹26.60' },
      { prompt: 'A bottle holds 1.5 L. After pouring out 0.65 L, how much is left?', answer: '0.85 L' },
    ],
    exitTicket: [
      { prompt: 'A bag of rice weighs 2.4 kg and a bag of dal weighs 1.85 kg. Total weight?', answer: '4.25 kg' },
      { prompt: 'A jug holds 2 L. After 0.75 L is poured out, how much remains?', answer: '1.25 L' },
    ],
    parentHomePractice: {
      intro: 'Make a small grocery list and total it.',
      activity: 'List 4 items with decimal prices. Have your child add them on paper, then compute the change from a round amount like ₹500. Double-check at the shop.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nDE.05 — Decimal word problems\n\n1) Asha buys items for ₹18.50, ₹22.75, and ₹9.40. Total spent?\n\n2) If she gives ₹100, how much change does she get?\n\n3) A tank holds 50 L of water. After 12.75 L is used, how much remains?\n\n4) A piece of cloth is 3.5 m long. After 1.85 m is cut, how much is left?\n\n5) A car travels 45.6 km on Monday and 38.75 km on Tuesday. Total distance?',
  },

  // ===== Factors & Multiples (FM.03, FM.04, FM.06, FM.08) ==================
  'FM.03': {
    miniLesson:
      'A PRIME number has exactly two factors: 1 and itself. A COMPOSITE number has more than two factors. The number 1 is neither prime nor composite (it has only one factor — itself). The first few primes are 2, 3, 5, 7, 11, 13. Note that 2 is the only EVEN prime; every other prime is odd.',
    visualWalkthrough: [
      'Pick a number, say 12. List ALL its factors: 1, 2, 3, 4, 6, 12. Six factors — so 12 is composite.',
      'Pick 7. Its only factors are 1 and 7. Two factors — so 7 is prime.',
      'Pick 1. Its only factor is 1. Just one factor — so 1 is NEITHER prime nor composite.',
      'Edge case: 2 has factors 1 and 2 only, so 2 is prime — and it is the only even prime.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Treating 1 as prime is the most common error. The definition requires EXACTLY two factors; 1 has only one. So 1 is special — it belongs to neither category.',
    },
    teacherActivity: {
      title: 'Sieve of Eratosthenes',
      timeMinutes: 12,
      materials: ['A 10×10 grid with numbers 1–100 printed', 'Pencils'],
      steps: [
        'Cross out 1.',
        'Circle 2; cross out every multiple of 2 after that.',
        'Circle the next uncrossed number (3); cross out its multiples.',
        'Continue with 5 and 7. Every uncrossed number that remains is prime.',
        'Whole class: count the primes from 1 to 50.',
      ],
    },
    independentPractice: [
      { prompt: 'Is 29 prime or composite?', answer: 'Prime (only factors are 1 and 29).' },
      { prompt: 'Is 39 prime or composite?', answer: 'Composite (3 × 13 = 39).' },
      { prompt: 'List all primes between 20 and 40.', answer: '23, 29, 31, 37' },
    ],
    exitTicket: [
      { prompt: 'Why is 1 not prime?', answer: 'A prime must have exactly two factors; 1 has only one.' },
      { prompt: 'Why is 2 the only even prime?', answer: 'Every other even number is divisible by 2 (besides 1 and itself), so it has more than two factors.' },
    ],
    parentHomePractice: {
      intro: 'Primes show up on house numbers and dates.',
      activity: 'Walk down the street and look at house numbers. Which are prime? Try birthdays: which family birthdays land on prime dates?',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFM.03 — Prime and composite numbers\n\nA) Classify each number as prime, composite, or neither.\n1) 11 ____   2) 25 ____   3) 1 ____   4) 41 ____   5) 100 ____\n\nB) List all primes between 1 and 50.\n____________________________________________________\n\nC) Short answer.\n6) Why is 2 the only even prime? __________________________________',
  },

  'FM.04': {
    miniLesson:
      'A divisibility RULE tells you whether one number divides another without actually doing the division. Class 6 rules: a number is divisible by 2 if its last digit is even; by 3 if its DIGIT SUM is divisible by 3; by 4 if its last two digits form a number divisible by 4; by 5 if its last digit is 0 or 5; by 6 if it is divisible by BOTH 2 and 3; by 9 if its digit sum is divisible by 9; by 10 if its last digit is 0.',
    visualWalkthrough: [
      'Take 1,236. Last digit 6 — divisible by 2. ✓',
      'Digit sum: 1 + 2 + 3 + 6 = 12, divisible by 3. ✓ (And by both 2 and 3 → divisible by 6 too.)',
      'Last two digits 36 — divisible by 4. ✓',
      'Last digit 6, not 0 or 5, so not divisible by 5 or 10.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Students sometimes confuse the 3 rule and the 9 rule. Both use digit sums: divisible by 3 if digit sum ÷ 3 is exact; divisible by 9 if digit sum ÷ 9 is exact. (Note: every number divisible by 9 is also divisible by 3.)',
    },
    teacherActivity: {
      title: 'Divisibility checklist',
      timeMinutes: 10,
      materials: ['Worksheet with 8 four-digit numbers'],
      steps: [
        'For each number, students tick the rules (2, 3, 4, 5, 6, 9, 10) that apply.',
        'They verify ONE of their answers by actually dividing.',
        'Discuss: "Why does the 3 rule work?" (Sum of digits modulo 3 equals the number modulo 3.)',
      ],
    },
    independentPractice: [
      { prompt: 'Is 132 divisible by 4?', answer: 'Yes (last two digits 32; 32 ÷ 4 = 8).' },
      { prompt: 'Is 1,008 divisible by 9?', answer: 'Yes (digit sum 1 + 0 + 0 + 8 = 9; 9 ÷ 9 = 1).' },
      { prompt: 'Is 246 divisible by 6?', answer: 'Yes (divisible by 2: last digit 6; divisible by 3: digit sum 12).' },
    ],
    exitTicket: [
      { prompt: 'Is 4,725 divisible by 5? By 9? By 3?', answer: 'By 5: yes (last digit 5). By 9: yes (digit sum 18). By 3: yes (18 ÷ 3 = 6).' },
      { prompt: 'Why does the rule for 6 require BOTH the rule for 2 AND the rule for 3?', answer: 'Because 6 = 2 × 3, and divisibility by 2 and 3 (coprime) together implies divisibility by their product.' },
    ],
    parentHomePractice: {
      intro: 'Apply rules to phone numbers, vehicle plate numbers, or grocery totals.',
      activity: 'Pick the last 4 digits of any phone number. Quickly test divisibility by 2, 3, 5, and 9. No long division allowed!',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFM.04 — Divisibility rules\n\nFor each number, tick the rules that apply: ☐2 ☐3 ☐4 ☐5 ☐6 ☐9 ☐10\n\n1) 246    ☐2 ☐3 ☐4 ☐5 ☐6 ☐9 ☐10\n2) 1,008  ☐2 ☐3 ☐4 ☐5 ☐6 ☐9 ☐10\n3) 4,725  ☐2 ☐3 ☐4 ☐5 ☐6 ☐9 ☐10\n4) 5,000  ☐2 ☐3 ☐4 ☐5 ☐6 ☐9 ☐10\n\nShort answer.\n5) Write a 3-digit number divisible by 9 but not by 2. ________',
  },

  'FM.06': {
    miniLesson:
      'The HIGHEST COMMON FACTOR (HCF) of two or more numbers is the largest number that divides ALL of them exactly. The most reliable method is PRIME FACTORISATION: factor each number into primes, then multiply the COMMON primes (using the smaller power of each shared prime).',
    visualWalkthrough: [
      'Factor each number into primes: 12 = 2 × 2 × 3, 18 = 2 × 3 × 3.',
      'List the COMMON primes: 2 (appearing once in 18) and 3 (appearing once in 12).',
      'Multiply the smaller power of each: 2 × 3 = 6. So HCF(12, 18) = 6.',
      'Check: 6 divides both 12 and 18, and no bigger number does.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Students sometimes use the LARGER power of a shared prime — that gives the LCM, not the HCF. Rule: HCF uses the SMALLER power; LCM uses the LARGER.',
    },
    teacherActivity: {
      title: 'Factor-tree relay',
      timeMinutes: 12,
      materials: ['Blank A4 sheets for factor trees'],
      steps: [
        'Pairs build factor trees for 36 and 60. (36 = 2² × 3², 60 = 2² × 3 × 5.)',
        'Identify shared primes with smaller powers: 2² and 3. HCF = 4 × 3 = 12.',
        'Repeat for 24 and 36. (HCF = 12.)',
        'Whole class verifies: does 12 actually divide both?',
      ],
    },
    independentPractice: [
      { prompt: 'HCF(12, 18) = ?', answer: '6' },
      { prompt: 'HCF(24, 36) = ?', answer: '12' },
      { prompt: 'HCF(8, 15) = ?', answer: '1 (no shared prime factors)' },
    ],
    exitTicket: [
      { prompt: 'HCF(20, 30) = ?', answer: '10' },
      { prompt: 'Two numbers have HCF 1. What is special about them?', answer: 'They are co-prime — they share no prime factor.' },
    ],
    parentHomePractice: {
      intro: 'HCF appears whenever you "share equally".',
      activity: 'If you have 18 chocolates and 24 biscuits to put into identical gift bags with nothing left over, how many bags can you make? (HCF(18, 24) = 6 bags.)',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFM.06 — Highest Common Factor\n\nUse prime factorisation. Show your tree.\n\n1) HCF(8, 12) = ____\n2) HCF(15, 25) = ____\n3) HCF(24, 36) = ____\n4) HCF(16, 24, 40) = ____\n\nWord problem.\n5) 36 apples and 48 oranges are packed into identical boxes with no fruit left over. What is the largest number of boxes? ____',
  },

  'FM.08': {
    miniLesson:
      'HCF and LCM word problems hide a "share equally" or "happen together again" structure. HCF is for largest equal groups / longest equal lengths. LCM is for the next time two events coincide / smallest amount that fits both.',
    visualWalkthrough: [
      'Read the problem and ask: "Is this about splitting into the LARGEST equal groups (HCF) or about the NEXT time two cycles align (LCM)?"',
      'Pull out the relevant numbers and find HCF or LCM using prime factorisation.',
      'State the answer in the units the problem asked for.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Students sometimes find HCF when they need LCM, or vice versa. Heuristic: "largest equal groups" or "cut into longest equal pieces" → HCF; "next time they meet again" or "smallest box that holds both packs" → LCM.',
    },
    teacherActivity: {
      title: 'HCF or LCM?',
      timeMinutes: 12,
      materials: ['Worksheet with 6 word problems'],
      steps: [
        'For each problem, students decide HCF or LCM BEFORE computing.',
        'Then they solve.',
        'Pair-share answers and reasoning.',
      ],
    },
    independentPractice: [
      { prompt: 'Two bells ring every 6 and 9 minutes. They ring together at 8 am. When do they next ring together?', answer: 'LCM(6, 9) = 18 → 8:18 am' },
      { prompt: '24 apples and 36 oranges go into identical baskets with nothing left over. Largest number of baskets?', answer: 'HCF(24, 36) = 12 baskets' },
      { prompt: 'The smallest length of ribbon that can be cut exactly into 8 cm AND 12 cm pieces?', answer: 'LCM(8, 12) = 24 cm' },
    ],
    exitTicket: [
      { prompt: 'Two friends jog around a track in 4 and 6 minutes. They start together. When do they meet next at the start?', answer: 'LCM(4, 6) = 12 minutes' },
      { prompt: '15 pens and 25 pencils into identical packs. Largest number of packs?', answer: 'HCF(15, 25) = 5 packs' },
    ],
    parentHomePractice: {
      intro: 'Schedule problems use LCM.',
      activity: 'If your child cleans their room every 3 days and waters the plants every 5 days, on which day do BOTH chores fall on the same day? (LCM = 15 days.)',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nFM.08 — HCF / LCM word problems\n\nFor each, decide HCF or LCM, then solve.\n\n1) Bells ring every 8 and 12 minutes. They ring together at 9 am. When next? ____\n\n2) 48 toffees and 60 chocolates into identical bags. Largest number of bags? ____\n\n3) Ribbons of 9 m and 12 m. Largest length of equal pieces that uses both fully? ____\n\n4) Two trains depart every 15 and 25 minutes. They depart together at 6 am. Next? ____',
  },

  // ===== Ratio & Proportion (RP.01–RP.05) ==================================
  'RP.01': {
    miniLesson:
      'A RATIO compares two quantities of the SAME unit. It is written a : b ("a to b") and read like a fraction a/b. Order matters: 3 : 2 and 2 : 3 are different ratios. Always simplify a ratio by dividing both terms by their HCF.',
    visualWalkthrough: [
      'Look at 3 boys and 5 girls. The ratio of boys to girls is 3 : 5.',
      'The ratio of girls to boys is 5 : 3 (opposite order).',
      'The ratio of boys to total students is 3 : (3 + 5) = 3 : 8.',
      'Simplify ratios by dividing both terms by HCF: 12 : 18 = 2 : 3.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Students sometimes write the ratio of part-to-whole when the question asks part-to-part, or vice versa. Always re-read the question and underline what is being compared.',
      form_error:
        'Final ratios should be in simplest form: divide both terms by their HCF.',
    },
    teacherActivity: {
      title: 'Classroom ratios',
      timeMinutes: 8,
      materials: ['None'],
      steps: [
        'Count students wearing a particular colour. Write the ratio of that colour to the rest.',
        'Count boys to girls in the class. Write and simplify.',
        'Find a ratio that is already in simplest form.',
      ],
    },
    independentPractice: [
      { prompt: 'Simplify 18 : 24.', answer: '3 : 4' },
      { prompt: 'In a basket of 12 apples and 8 oranges, find apples : oranges.', answer: '12 : 8 = 3 : 2' },
      { prompt: 'Find boys : total in a class of 14 boys and 16 girls.', answer: '14 : 30 = 7 : 15' },
    ],
    exitTicket: [
      { prompt: 'What is the ratio of 50 minutes to 1 hour?', answer: '50 : 60 = 5 : 6' },
      { prompt: 'Why is 3 : 5 different from 5 : 3?', answer: 'Order matters in a ratio — they describe opposite comparisons.' },
    ],
    parentHomePractice: {
      intro: 'Recipes are ratio practice.',
      activity: 'A poha recipe uses 2 cups poha to 1 cup vegetables. Ask: "What is the ratio of poha to vegetables? What about vegetables to total?" Then double the recipe — does the ratio change? (No.)',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nRP.01 — Concept of ratio\n\nA) Simplify.\n1) 8 : 12 = ____\n2) 15 : 25 = ____\n3) 20 : 50 = ____\n\nB) Find the ratio.\n4) 4 boys, 6 girls — boys : girls = ____\n5) 30 minutes : 2 hours = ____\n6) 250 g : 1 kg = ____',
  },

  'RP.02': {
    miniLesson:
      'Two ratios are EQUIVALENT when they describe the same relationship — like equivalent fractions. Multiply (or divide) BOTH terms by the same non-zero number and you get an equivalent ratio. So 2 : 3 = 4 : 6 = 6 : 9.',
    visualWalkthrough: [
      'Write a ratio: 2 : 3.',
      'Multiply both terms by 2: 4 : 6. Same comparison, different numbers.',
      'Multiply both terms by 5: 10 : 15. Still the same comparison.',
      'Divide 18 : 27 by HCF 9: 2 : 3 — same family.',
    ],
    misconceptionReteach: {
      incomplete_conversion:
        'Multiplying only one term breaks equivalence: 2 : 3 is NOT equivalent to 4 : 3.',
    },
    teacherActivity: {
      title: 'Ratio ladders',
      timeMinutes: 10,
      materials: ['Lined paper'],
      steps: [
        'Start with 2 : 5. Write 5 equivalent ratios going down.',
        'Start with 24 : 36. Simplify going up to the simplest equivalent.',
        'Pair-check.',
      ],
    },
    independentPractice: [
      { prompt: 'Find a ratio equivalent to 3 : 5 with first term 12.', answer: '12 : 20' },
      { prompt: 'Are 6 : 9 and 2 : 3 equivalent?', answer: 'Yes (divide both terms of 6 : 9 by 3).' },
      { prompt: 'Simplify 20 : 30.', answer: '2 : 3' },
    ],
    exitTicket: [
      { prompt: 'Fill the blank: 4 : 7 = __ : 21', answer: '12' },
      { prompt: 'Simplify 25 : 40.', answer: '5 : 8' },
    ],
    parentHomePractice: {
      intro: 'Scaling a recipe is equivalent-ratio practice.',
      activity: 'A dosa batter recipe: 3 cups rice to 1 cup dal. To make a batch for 6 people instead of 2, you need 9 cups rice to 3 cups dal — the SAME ratio 3 : 1.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nRP.02 — Equivalent ratios\n\nA) Fill in the missing terms.\n1) 2 : 3 = __ : 12\n2) 5 : 4 = 25 : __\n3) 6 : 9 = __ : 3\n\nB) Are these pairs equivalent? Yes/No.\n4) 4 : 6 and 6 : 9 → ____\n5) 3 : 8 and 6 : 15 → ____\n\nC) Simplify.\n6) 18 : 30 = ____',
  },

  'RP.03': {
    miniLesson:
      'A PROPORTION is a statement that two ratios are equal: a : b :: c : d, read "a is to b as c is to d". The cross products are equal: a × d = b × c. The OUTER terms (a and d) are EXTREMES; the INNER terms (b and c) are MEANS. Product of means = product of extremes.',
    visualWalkthrough: [
      'Write 2 : 3 :: 4 : 6.',
      'Multiply the means: 3 × 4 = 12.',
      'Multiply the extremes: 2 × 6 = 12.',
      'They are equal, confirming the proportion.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Students sometimes test proportions by checking if numbers "look related" rather than multiplying. Always check by product of means = product of extremes.',
    },
    teacherActivity: {
      title: 'Proportion check',
      timeMinutes: 10,
      materials: ['Worksheet with 8 ratio pairs'],
      steps: [
        'For each pair, students check whether it forms a proportion using cross-products.',
        'They mark P (proportion) or NP (not).',
        'Discuss any disputed answers.',
      ],
    },
    independentPractice: [
      { prompt: 'Are 4 : 6 and 6 : 9 in proportion?', answer: 'Yes (4 × 9 = 36, 6 × 6 = 36).' },
      { prompt: 'Find x: 3 : 5 :: x : 20.', answer: 'x = 12 (5x = 60).' },
      { prompt: 'Are 2 : 3 and 6 : 8 in proportion?', answer: 'No (2 × 8 = 16, 3 × 6 = 18).' },
    ],
    exitTicket: [
      { prompt: 'Find x: 4 : 5 :: 12 : x.', answer: 'x = 15' },
      { prompt: 'Are 5 : 6 and 15 : 18 in proportion?', answer: 'Yes (5 × 18 = 90, 6 × 15 = 90).' },
    ],
    parentHomePractice: {
      intro: 'Maps and models use proportion.',
      activity: 'On a map, 1 cm represents 5 km. So 1 : 5 is the scale ratio. Then 4 cm on the map represents 20 km — that\'s a proportion 1 : 5 :: 4 : 20.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nRP.03 — Proportion\n\nA) Check if each pair forms a proportion.\n1) 2 : 3 and 4 : 6 → ____\n2) 5 : 8 and 10 : 14 → ____\n3) 4 : 9 and 8 : 18 → ____\n\nB) Find the missing term.\n4) 3 : 4 :: 12 : __\n5) __ : 5 :: 16 : 20\n6) 7 : 11 :: 28 : __',
  },

  'RP.04': {
    miniLesson:
      'The UNITARY METHOD is a problem-solving strategy: first find the value of ONE unit, then scale up to the required number of units. If 6 pens cost ₹48, then ONE pen costs ₹48 ÷ 6 = ₹8, and 10 pens cost 10 × ₹8 = ₹80.',
    visualWalkthrough: [
      'Read the problem and find the rate: a given quantity → a given cost or value.',
      'Divide to find the value for ONE unit.',
      'Multiply by the required number of units.',
      'Re-read the question — answer in the asked units.',
    ],
    misconceptionReteach: {
      operation_confusion:
        'Students sometimes multiply when they should divide. The first step is ALWAYS to find the per-unit value (divide), then scale to the required total (multiply).',
    },
    teacherActivity: {
      title: 'Per-unit drills',
      timeMinutes: 10,
      materials: ['Worksheet with 6 unitary-method problems'],
      steps: [
        'For each problem, students write BOTH steps explicitly: "Step 1: cost of 1 = …; Step 2: cost of N = …".',
        'Pair-share answers.',
      ],
    },
    independentPractice: [
      { prompt: 'If 4 books cost ₹120, what do 7 books cost?', answer: '₹30 each × 7 = ₹210' },
      { prompt: 'A car travels 240 km in 4 hours. How far in 7 hours at the same speed?', answer: '60 km/h × 7 = 420 km' },
      { prompt: 'If 5 kg of rice costs ₹250, what does 3 kg cost?', answer: '₹50/kg × 3 = ₹150' },
    ],
    exitTicket: [
      { prompt: 'If 3 notebooks cost ₹75, what do 8 notebooks cost?', answer: '₹25 × 8 = ₹200' },
      { prompt: 'A worker earns ₹1,800 in 6 days. How much in 10 days?', answer: '₹300/day × 10 = ₹3,000' },
    ],
    parentHomePractice: {
      intro: 'Shopping prices are unitary-method practice.',
      activity: 'At the shop, a packet of biscuits costs ₹30 for 5. Ask: "What would 8 cost? What about 12?"',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nRP.04 — Unitary method\n\nShow both steps for each problem.\n\n1) 6 erasers cost ₹30. Cost of 10?\n2) A car covers 180 km in 3 hours. How far in 5 hours?\n3) 4 dozen bananas cost ₹240. Cost of 7 dozen?\n4) 8 oranges cost ₹64. Cost of 5 oranges?\n5) A typist types 600 words in 15 minutes. Words in 1 hour?',
  },

  'RP.05': {
    miniLesson:
      'Ratio and proportion word problems combine the ideas of part-to-part, part-to-whole, equivalent ratios, and the unitary method. The most useful first move is to set up a clear ratio or proportion statement before computing.',
    visualWalkthrough: [
      'Read carefully. Identify the two quantities being compared.',
      'Write the ratio in the order the problem describes.',
      'If the problem gives one new number, set up a proportion to find the missing term.',
      'State the answer in the right units.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'When a problem gives a TOTAL and a ratio, students sometimes forget to add the parts of the ratio first. To split 50 in the ratio 2 : 3, the total parts are 2 + 3 = 5, so one share is 50 ÷ 5 × 2 = 20 and the other is 30.',
    },
    teacherActivity: {
      title: 'Share-out',
      timeMinutes: 12,
      materials: ['Coloured counters'],
      steps: [
        'Give pairs 25 counters. "Share these in the ratio 2 : 3 between two students."',
        'They compute: total parts 2 + 3 = 5, each part = 5 counters, shares are 10 and 15.',
        'Repeat with 40 counters in ratio 3 : 5.',
      ],
    },
    independentPractice: [
      { prompt: 'Divide ₹100 in the ratio 2 : 3.', answer: '₹40 and ₹60' },
      { prompt: 'In a class, the ratio of boys to girls is 3 : 4 and there are 28 students. How many girls?', answer: 'Total parts 7; one part = 4 students; girls = 4 × 4 = 16' },
      { prompt: 'A recipe uses sugar and flour in the ratio 1 : 3. With 600 g of flour, how much sugar?', answer: '200 g' },
    ],
    exitTicket: [
      { prompt: 'Divide ₹450 between Asha and Ravi in the ratio 4 : 5.', answer: '₹200 and ₹250' },
      { prompt: 'In a 30-day month, the ratio of sunny to rainy days is 2 : 3. How many sunny days?', answer: '12 sunny, 18 rainy' },
    ],
    parentHomePractice: {
      intro: 'Splitting things fairly is a ratio activity.',
      activity: 'Split 24 sweets between two children in the ratio 3 : 5. (9 and 15.) Then in ratio 1 : 2. (8 and 16.) Talk about why the totals are still 24.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nRP.05 — Ratio and proportion word problems\n\n1) Divide ₹240 in the ratio 2 : 3 : 5. ____, ____, ____\n\n2) In a class of 36, the ratio of boys to girls is 5 : 4. How many boys?\n\n3) A recipe needs sugar : flour in ratio 1 : 4. For 800 g flour, how much sugar?\n\n4) Map scale: 1 cm = 8 km. A road on the map is 7.5 cm. How long in reality?',
  },

  // ===== Algebra Basics (AL.01–AL.05) ======================================
  'AL.01': {
    miniLesson:
      'A VARIABLE is a letter that stands for an unknown number. It works exactly like a number: it can be added, subtracted, multiplied, or divided. We usually pick letters like x, y, n, or sometimes the first letter of the quantity (h for height).',
    visualWalkthrough: [
      'Think of a number you don\'t know yet. Call it x.',
      'If you add 3 to it, you write x + 3.',
      'If you double it, you write 2x (the multiplication sign is hidden).',
      'When the actual number is revealed (say x = 4), substitute: x + 3 = 4 + 3 = 7.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Students sometimes treat x as ALWAYS equal to 1 (because "one x"). x is a placeholder for ANY number; only the problem will tell you which one.',
    },
    teacherActivity: {
      title: 'Mystery boxes',
      timeMinutes: 10,
      materials: ['A sheet with 5 mystery boxes (use a square instead of x)'],
      steps: [
        'Write: "Box + 5 = 12. What is in the box?" Students answer 7.',
        'Replace box with x. Same problem, same answer.',
        'Repeat with "2 × Box = 14" → x = 7.',
        'Discuss: the letter is just a name for the mystery number.',
      ],
    },
    independentPractice: [
      { prompt: 'If x = 6, what is x + 4?', answer: '10' },
      { prompt: 'Write "5 more than y".', answer: 'y + 5' },
      { prompt: 'Write "twice n".', answer: '2n' },
    ],
    exitTicket: [
      { prompt: 'If x = 9, what is 3x?', answer: '27' },
      { prompt: 'Why do we use letters in algebra?', answer: 'To stand for unknown numbers, so we can describe relationships that work for many values.' },
    ],
    parentHomePractice: {
      intro: 'Variables describe everyday rules.',
      activity: 'If 1 pen costs ₹p, then 3 pens cost 3p. If 1 kg of rice costs ₹r, then 5 kg cost 5r. Have your child write 3 such "rules" for things at home.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nAL.01 — Understanding variables\n\nA) Fill in the value.\n1) If x = 5, then x + 3 = ____\n2) If y = 7, then 2y = ____\n3) If n = 4, then n − 1 = ____\n\nB) Write the algebraic expression.\n4) 8 more than k → ____\n5) Half of t → ____\n6) Three times m minus 2 → ____',
  },

  'AL.02': {
    miniLesson:
      'An algebraic EXPRESSION combines numbers, variables, and operations. "5 more than x" is x + 5. "Twice y" is 2y. "Three less than four times n" is 4n − 3. The order of operations (BODMAS / PEMDAS) still applies.',
    visualWalkthrough: [
      'Translate the English word for word: "twice" → 2 ×, "more than" → +, "less than" → −.',
      'When you see "less than X", X comes LAST: "5 less than y" is y − 5, not 5 − y.',
      'Multiplication is usually written without × when one factor is a variable: 3n means 3 × n.',
      'Use brackets for grouped operations: "twice the sum of x and 4" = 2(x + 4).',
    ],
    misconceptionReteach: {
      conceptual_gap:
        '"5 less than y" trips students up. The correct form is y − 5, not 5 − y. Underline the order in the English before translating.',
    },
    teacherActivity: {
      title: 'Translate it',
      timeMinutes: 10,
      materials: ['Cards with English phrases on one side and algebraic expressions on the other'],
      steps: [
        'Pairs match each English phrase to its expression.',
        'For "5 less than y", they must explicitly say "subtract 5 FROM y".',
        'Whole-class share.',
      ],
    },
    independentPractice: [
      { prompt: 'Write "7 less than 3x".', answer: '3x − 7' },
      { prompt: 'Write "half of (x + 6)".', answer: '(x + 6) / 2' },
      { prompt: 'Write "the sum of 2a and 5".', answer: '2a + 5' },
    ],
    exitTicket: [
      { prompt: 'Write "4 more than twice n".', answer: '2n + 4' },
      { prompt: 'Why is "5 less than y" written y − 5 and not 5 − y?', answer: '"Less than" subtracts FROM y; the y must come first.' },
    ],
    parentHomePractice: {
      intro: 'Algebraic expressions describe everyday quantities.',
      activity: '"If you start with ₹100 and spend ₹x, what do you have left?" (100 − x). "If chocolate costs ₹c and you buy 6, what do you spend?" (6c).',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nAL.02 — Simple expressions\n\nWrite an expression for each phrase.\n\n1) 5 more than x → ____\n2) Twice m → ____\n3) 3 less than n → ____\n4) Half of t → ____\n5) The sum of a and b → ____\n6) Three times (x plus 2) → ____\n7) 10 reduced by k → ____\n8) p divided by 4 → ____',
  },

  'AL.03': {
    miniLesson:
      'To EVALUATE an expression at a given value of the variable, substitute the number for the variable everywhere it appears, then compute using BODMAS. So 2x + 5 at x = 3 is 2 × 3 + 5 = 6 + 5 = 11. Multiplication before addition, brackets first.',
    visualWalkthrough: [
      'Identify the variable and the given value.',
      'Replace EVERY occurrence of the variable with the value (write the value in brackets to keep signs clear).',
      'Apply BODMAS: brackets, orders, division/multiplication, addition/subtraction.',
      'Double-check the final arithmetic.',
    ],
    misconceptionReteach: {
      arithmetic_slip:
        'Doing addition before multiplication: 2x + 5 at x = 3 is NOT (2 + 3 + 5) = 10. Always multiply 2 × 3 first, then add 5.',
    },
    teacherActivity: {
      title: 'Substitution drill',
      timeMinutes: 10,
      materials: ['Worksheet with 8 expressions to evaluate at different x values'],
      steps: [
        'Each student substitutes and evaluates 8 expressions.',
        'Pair-check.',
        'Spotlight the trickiest one — usually one with brackets.',
      ],
    },
    independentPractice: [
      { prompt: 'Evaluate 3x − 1 at x = 4.', answer: '3 × 4 − 1 = 11' },
      { prompt: 'Evaluate 2(y + 5) at y = 3.', answer: '2 × 8 = 16' },
      { prompt: 'Evaluate x/2 + 7 at x = 10.', answer: '5 + 7 = 12' },
    ],
    exitTicket: [
      { prompt: 'Evaluate 4x + 3 at x = 5.', answer: '23' },
      { prompt: 'Evaluate 2(x − 1) at x = 7.', answer: '12' },
    ],
    parentHomePractice: {
      intro: 'Phone-bill formulas use evaluation.',
      activity: '"My phone plan is ₹50 + ₹0.50 × number of extra minutes. If I use 30 extra minutes, what is the bill?" (50 + 0.5 × 30 = ₹65.)',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nAL.03 — Evaluate expressions\n\nA) Evaluate each at the given value.\n1) 2x + 7 at x = 5 → ____\n2) 4n − 3 at n = 6 → ____\n3) 3(y + 2) at y = 4 → ____\n4) x/3 − 1 at x = 12 → ____\n5) 5p − p at p = 7 → ____',
  },

  'AL.04': {
    miniLesson:
      'A ONE-STEP equation has the variable on one side and can be solved by one inverse operation. To solve x + 5 = 12, subtract 5 from both sides. To solve 3x = 21, divide both sides by 3. The golden rule: do the SAME operation to BOTH sides.',
    visualWalkthrough: [
      'Identify what is being done to the variable: added, subtracted, multiplied, divided.',
      'Apply the INVERSE operation to BOTH sides.',
      'The variable should be alone on one side.',
      'Check the answer by substituting back.',
    ],
    misconceptionReteach: {
      operation_confusion:
        'Doing the operation only to one side breaks the equation. x + 5 = 12 does NOT give x = 12 − 5 by removing "+ 5" alone; you are subtracting 5 from BOTH sides. Same rule for multiplication and division.',
    },
    teacherActivity: {
      title: 'Balance scales',
      timeMinutes: 10,
      materials: ['Sketch of a two-pan balance for each pair'],
      steps: [
        'Draw x + 3 = 8. Imagine x and 3 weights on one pan, 8 weights on the other.',
        'Remove 3 from EACH pan to keep the balance: x = 5.',
        'Repeat with 2x = 10: divide each pan by 2 → x = 5.',
      ],
    },
    independentPractice: [
      { prompt: 'Solve x + 7 = 15.', answer: 'x = 8' },
      { prompt: 'Solve 4y = 36.', answer: 'y = 9' },
      { prompt: 'Solve n / 5 = 3.', answer: 'n = 15' },
    ],
    exitTicket: [
      { prompt: 'Solve x − 9 = 4.', answer: 'x = 13' },
      { prompt: 'Solve 6p = 42.', answer: 'p = 7' },
    ],
    parentHomePractice: {
      intro: 'Treat real questions as one-step equations.',
      activity: '"I had ₹x. After spending ₹40, I have ₹60 left. What did I start with?" (x − 40 = 60 → x = 100.)',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nAL.04 — One-step equations\n\nSolve each. Check by substitution.\n\n1) x + 6 = 14 → x = ____\n2) y − 5 = 10 → y = ____\n3) 3n = 24 → n = ____\n4) p / 4 = 6 → p = ____\n5) 8 + k = 20 → k = ____',
  },

  'AL.05': {
    miniLesson:
      'Algebra word problems are one-step equations hidden inside a story. The skill: let the unknown be a letter, write an equation that describes the story, solve, and re-read to make sure the answer fits.',
    visualWalkthrough: [
      'Read the problem and underline the unknown — call it x.',
      'Translate the story into an equation. "5 more than x is 12" → x + 5 = 12.',
      'Solve the equation.',
      'Write the answer in a complete sentence with units.',
    ],
    misconceptionReteach: {
      operation_confusion:
        'Translating "5 less than x is 12" as 5 − x = 12 is a common slip. The correct equation is x − 5 = 12 (x is reduced by 5).',
    },
    teacherActivity: {
      title: 'Story → equation',
      timeMinutes: 12,
      materials: ['Worksheet with 6 short problems'],
      steps: [
        'For each story, students write the equation BEFORE solving.',
        'Pair-share the equations; resolve disagreements first.',
        'Then solve.',
      ],
    },
    independentPractice: [
      { prompt: 'Asha has x notebooks. After buying 4 more, she has 11. How many did she start with?', answer: 'x + 4 = 11 → x = 7' },
      { prompt: 'Three times a number is 24. What is the number?', answer: '3x = 24 → x = 8' },
      { prompt: 'After giving away 6 mangoes, Ravi has 9. How many did he have?', answer: 'x − 6 = 9 → x = 15' },
    ],
    exitTicket: [
      { prompt: 'A number plus 7 equals 20. Find the number.', answer: 'x + 7 = 20 → x = 13' },
      { prompt: 'Half of a number is 9. Find the number.', answer: 'x/2 = 9 → x = 18' },
    ],
    parentHomePractice: {
      intro: 'Daily life is full of one-step equations.',
      activity: '"I am thinking of a number. When I add 8, I get 22. What is my number?" (x + 8 = 22 → x = 14.) Take turns making up the puzzles.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nAL.05 — Algebra word problems\n\nLet the unknown be x. Write an equation and solve.\n\n1) A number plus 13 is 25. ____\n\n2) Twice a number is 18. ____\n\n3) A number reduced by 9 is 14. ____\n\n4) One-fifth of a number is 7. ____\n\n5) Asha had some sweets. She gave away 5 and has 12 left. How many did she start with? ____',
  },

  // ===== Geometry Basics (GB.01, GB.02, GB.04, GB.05, GB.06, GB.07, GB.08, GB.09) =====
  'GB.01': {
    miniLesson:
      'A POINT has no size — just a position. A LINE extends in both directions forever. A LINE SEGMENT is the part of a line between two endpoints. A RAY starts at one point and goes on forever in one direction. Notation: line AB ↔, segment AB, ray AB→.',
    visualWalkthrough: [
      'Mark two dots and label them A and B.',
      'Draw a straight line through them with arrows on both ends — that is line AB.',
      'Draw the same straight figure WITHOUT arrows, just between A and B — segment AB.',
      'Now draw an arrow starting at A and pointing past B — that is ray AB.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Students sometimes call a segment a line. Lines extend forever in both directions; segments stop at endpoints. The arrow-marks distinguish them.',
    },
    teacherActivity: {
      title: 'Object hunt',
      timeMinutes: 8,
      materials: ['None'],
      steps: [
        'Walk around the classroom. Find: (a) a line segment (edge of book), (b) a ray (laser pointer beam), (c) a line (chalkboard ruler line that "could go on").',
        'Discuss why each is what it is.',
      ],
    },
    independentPractice: [
      { prompt: 'A ruler with arrows on both ends represents which figure?', answer: 'A line.' },
      { prompt: 'The edge of a book represents which figure?', answer: 'A line segment.' },
      { prompt: 'A torch shining away from you represents which figure?', answer: 'A ray.' },
    ],
    exitTicket: [
      { prompt: 'Difference between a line and a line segment?', answer: 'A line extends without end in both directions; a segment has two endpoints.' },
      { prompt: 'Difference between a ray and a line?', answer: 'A ray has ONE endpoint and extends without end in only one direction; a line has none.' },
    ],
    parentHomePractice: {
      intro: 'Geometry vocabulary is most easily learned by pointing.',
      activity: 'At home, ask: "Find me 3 line segments." (Edge of a table, side of a book, the rim of a glass\'s straight section.) Then 1 ray (a torchlight beam).',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nGB.01 — Points, lines, line segments, rays\n\nLabel each figure as line, segment, or ray.\n\n1) ↔——A——B——↔        ____\n2) ●A————●B           ____\n3) ●A————→            ____\n\nShort answer.\n4) How is a ray different from a line? ____________________________________\n5) Draw segment PQ, ray PQ, and line PQ side by side.',
  },

  'GB.02': {
    miniLesson:
      'Two lines in the same plane are either PARALLEL (they never meet, no matter how far you extend them) or INTERSECTING (they meet at exactly one point). PERPENDICULAR lines are a special kind of intersecting — they meet at a 90° angle. Three or more lines that meet at the same point are CONCURRENT.',
    visualWalkthrough: [
      'Draw two horizontal lines, one above the other. They never meet — parallel.',
      'Draw two lines that cross at one point — intersecting.',
      'Make the intersecting lines meet at exactly 90° — perpendicular.',
      'Now draw three lines all meeting at the same point — concurrent.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Two lines that LOOK close but eventually meet are NOT parallel. The defining test: extend them as far as needed; if they ever meet, they are intersecting.',
    },
    teacherActivity: {
      title: 'Classroom hunt',
      timeMinutes: 10,
      materials: ['None'],
      steps: [
        'Find: 2 parallel lines (top and bottom of a door), 2 perpendicular lines (side and bottom of a window), 2 intersecting non-perpendicular lines (X on a name tag).',
        'Discuss: what makes parallel lines parallel? (Never meet, when extended.)',
      ],
    },
    independentPractice: [
      { prompt: 'Are the edges of a railway track parallel or intersecting?', answer: 'Parallel.' },
      { prompt: 'Two roads meeting at a T-junction at 90° — what kind of lines?', answer: 'Perpendicular (a special intersecting case).' },
      { prompt: 'Can two lines be both parallel AND intersecting?', answer: 'No — parallel means they never meet.' },
    ],
    exitTicket: [
      { prompt: 'What does perpendicular mean?', answer: 'Intersecting at a 90° angle.' },
      { prompt: 'Sketch two concurrent lines.', answer: 'Two (or more) lines all meeting at one point.' },
    ],
    parentHomePractice: {
      intro: 'Look for parallel, perpendicular, and intersecting lines at home.',
      activity: 'Doorframe: 2 parallel pairs (top–bottom and left–right) and 4 perpendicular pairs (each corner). Floor tile patterns are another rich source.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nGB.02 — Parallel and intersecting lines\n\nClassify each pair as parallel, intersecting, or perpendicular.\n\n1) Top and bottom edges of a book → ____\n2) The two diagonals of a square → ____\n3) The two long edges of a ruler → ____\n4) A vertical wall and the floor → ____\n\nShort answer.\n5) Sketch two intersecting lines that are NOT perpendicular.',
  },

  'GB.04': {
    miniLesson:
      'A PROTRACTOR measures angles. To measure: place the centre of the protractor on the vertex, align the baseline with one arm of the angle, and read off the degree mark where the other arm crosses the scale. To DRAW an angle of given size, reverse the steps: mark a baseline, place the protractor, find the right degree mark, and join.',
    visualWalkthrough: [
      'Place the protractor centre on the vertex of the angle.',
      'Rotate so the 0° line lines up with one arm of the angle.',
      'Read off where the other arm meets the scale — that is the angle in degrees.',
      'When drawing an angle, use the same setup but mark the new arm at the target degree first, then join to the vertex.',
    ],
    misconceptionReteach: {
      arithmetic_slip:
        'A protractor has TWO scales: 0–180° starting from the left and 0–180° starting from the right. Use the scale that starts at 0° on the arm you aligned with.',
    },
    teacherActivity: {
      title: 'Measure-draw-measure',
      timeMinutes: 12,
      materials: ['Protractors (one per student)'],
      steps: [
        'Teacher draws 5 angles on the board. Students measure each.',
        'Pair-check.',
        'Then students draw angles of 30°, 75°, 120°, 145° on their own paper.',
        'Swap and measure each other\'s.',
      ],
    },
    independentPractice: [
      { prompt: 'How would you measure a 60° angle with a protractor?', answer: 'Place centre on vertex, align baseline with one arm, read where the other arm meets the scale starting from 0°.' },
      { prompt: 'Why are there two scales on a protractor?', answer: 'So you can measure from either direction (left-to-right or right-to-left) without rotating the protractor.' },
      { prompt: 'Draw a 95° angle. What type is it?', answer: 'Obtuse.' },
    ],
    exitTicket: [
      { prompt: 'A protractor reads 110° on the lower scale and 70° on the upper scale at the same arm. Which is the angle?', answer: 'Depends on which arm you aligned with 0°. Read the scale starting from the arm aligned at 0°.' },
      { prompt: 'What is the angle of a clock\'s hands at 3:00?', answer: '90° (a right angle).' },
    ],
    parentHomePractice: {
      intro: 'A protractor is a fun home-measure tool.',
      activity: 'Open a book at different positions. Measure the angle between the two halves. Try a fully open book (180°) and a slightly open book (~10°).',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nGB.04 — Measuring and drawing angles\n\nA) Measure each angle (drawn separately on this sheet).\n1) Angle A → ____°\n2) Angle B → ____°\n3) Angle C → ____°\n\nB) Draw angles of:\n4) 45°\n5) 110°\n6) 165°\n\nShort answer.\n7) What is the difference between an acute angle and an obtuse angle? ____________',
  },

  'GB.05': {
    miniLesson:
      'A TRIANGLE is classified two ways. By SIDES: equilateral (all 3 equal), isosceles (exactly 2 equal), scalene (all different). By ANGLES: acute (all 3 angles less than 90°), right (one angle exactly 90°), obtuse (one angle greater than 90°). Every triangle has BOTH a side classification and an angle classification.',
    visualWalkthrough: [
      'Look at the triangle. Measure or estimate the three side lengths.',
      'If all three are equal: equilateral. If exactly two: isosceles. If all different: scalene.',
      'Now look at the three angles. If all under 90°: acute. If one is exactly 90°: right. If one is over 90°: obtuse.',
      'State both classifications: e.g., "isosceles right triangle".',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Students sometimes give only one classification ("It\'s a right triangle"). Always give BOTH side and angle classifications.',
    },
    teacherActivity: {
      title: 'Triangle sort',
      timeMinutes: 10,
      materials: ['Cut-out triangles of various shapes (5 per pair)'],
      steps: [
        'Pairs sort triangles into a 2D grid: rows = scalene/isosceles/equilateral, columns = acute/right/obtuse.',
        'Discuss which cells are impossible. (An equilateral triangle must be acute — all angles are 60°.)',
      ],
    },
    independentPractice: [
      { prompt: 'A triangle has sides 5, 5, 8. What is its side classification?', answer: 'Isosceles.' },
      { prompt: 'A triangle has angles 90°, 45°, 45°. Full classification?', answer: 'Isosceles right triangle.' },
      { prompt: 'A triangle has angles 60°, 60°, 60°. Side classification?', answer: 'Equilateral.' },
    ],
    exitTicket: [
      { prompt: 'A triangle has sides 7, 9, 12 and angles 35°, 60°, 85°. Full classification?', answer: 'Scalene acute triangle.' },
      { prompt: 'Can a triangle be both equilateral and right-angled?', answer: 'No — an equilateral triangle has all angles 60°, none is 90°.' },
    ],
    parentHomePractice: {
      intro: 'Look for triangles in road signs and architecture.',
      activity: 'A "Yield" sign is an equilateral triangle. A roof gable is often isosceles. Help your child name a triangle by both its sides and its angles.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nGB.05 — Triangles: classify by sides and angles\n\nFor each, give BOTH classifications.\n\n1) sides 6, 6, 6 → ____ + ____\n2) sides 5, 5, 8; angles include 90° → ____ + ____\n3) sides 4, 7, 9; all angles under 90° → ____ + ____\n4) angles 30°, 60°, 90°; all sides different → ____ + ____\n\nShort answer.\n5) Can a right triangle ever be equilateral? Why? ________________________',
  },

  'GB.06': {
    miniLesson:
      'QUADRILATERALS are 4-sided polygons. Class 6 names: SQUARE (4 equal sides, 4 right angles), RECTANGLE (opposite sides equal, 4 right angles), PARALLELOGRAM (opposite sides parallel and equal), RHOMBUS (4 equal sides, opposite sides parallel), TRAPEZIUM (exactly one pair of parallel sides). Every square is also a rectangle, a parallelogram, and a rhombus.',
    visualWalkthrough: [
      'Check sides: how many pairs are equal? How many pairs are parallel?',
      'Check angles: are there 4 right angles, or none?',
      'Use the most specific name that applies.',
      'Remember: a square is a special rectangle (all sides equal) AND a special rhombus (all angles right).',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Students sometimes think "rectangle" and "square" are exclusive. A square IS a rectangle (it has 4 right angles) AND a rhombus (it has 4 equal sides). The category is nested, not separate.',
    },
    teacherActivity: {
      title: 'Quadrilateral Venn',
      timeMinutes: 12,
      materials: ['Three overlapping circles drawn on paper labelled "all sides equal", "all angles right", "opposite sides parallel"'],
      steps: [
        'Pairs place each shape (square, rectangle, parallelogram, rhombus, trapezium) in the right region.',
        'Discuss why the square sits in the centre.',
      ],
    },
    independentPractice: [
      { prompt: 'A quadrilateral has 4 right angles and opposite sides equal. Most specific name?', answer: 'Rectangle (a square if all 4 sides equal).' },
      { prompt: 'A quadrilateral has exactly one pair of parallel sides. Name?', answer: 'Trapezium.' },
      { prompt: 'Is every rhombus a parallelogram?', answer: 'Yes — its opposite sides are parallel.' },
    ],
    exitTicket: [
      { prompt: 'Is every rectangle a square?', answer: 'No — a square requires all 4 sides equal; rectangles only need opposite sides equal.' },
      { prompt: 'Name two properties of a rhombus.', answer: 'All 4 sides equal; opposite sides parallel.' },
    ],
    parentHomePractice: {
      intro: 'Floor tiles, windows, and books are quadrilateral textbooks.',
      activity: 'Find a square, a non-square rectangle, and a parallelogram in the house. Discuss why each name fits.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nGB.06 — Quadrilaterals: basic properties\n\nName each. Give the most specific name.\n\n1) 4 equal sides, 4 right angles → ____\n2) 4 right angles, opposite sides equal (not all sides equal) → ____\n3) Opposite sides equal and parallel, no right angles → ____\n4) 4 equal sides, opposite sides parallel, NO right angles → ____\n5) Exactly one pair of parallel sides → ____',
  },

  'GB.07': {
    miniLesson:
      'A CIRCLE has a CENTRE (one fixed point inside), a RADIUS (segment from centre to any point on the circle — all radii are equal), a DIAMETER (chord through the centre, the longest chord; diameter = 2 × radius), a CHORD (any segment with BOTH endpoints on the circle), and an ARC (a piece of the circle itself between two points).',
    visualWalkthrough: [
      'Mark the centre O of a circle.',
      'Draw segment OA from centre to a point A on the circle — radius.',
      'Extend OA through O to B on the opposite side — segment AB is a diameter.',
      'Mark two more points P and Q on the circle. Draw segment PQ (not through O) — chord.',
      'The curve from P to Q along the circle is an arc.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Confusing radius and diameter. Mnemonic: DIAMETER is the LONGER word for the LONGER length. Diameter = 2 × radius. Radius = diameter ÷ 2.',
    },
    teacherActivity: {
      title: 'Label the circle',
      timeMinutes: 10,
      materials: ['Sheet with a circle and centre marked'],
      steps: [
        'Students label one radius, one diameter, one chord (not a diameter), and one arc.',
        'Measure the radius and the diameter; check the 2 × relationship.',
      ],
    },
    independentPractice: [
      { prompt: 'A circle has radius 5 cm. What is the diameter?', answer: '10 cm.' },
      { prompt: 'A circle has diameter 18 cm. What is the radius?', answer: '9 cm.' },
      { prompt: 'Is every diameter a chord?', answer: 'Yes — a diameter is the special chord that passes through the centre.' },
    ],
    exitTicket: [
      { prompt: 'Difference between chord and arc?', answer: 'A chord is a straight segment between two points on the circle; an arc is the curved piece between the same two points along the circle.' },
      { prompt: 'Why is the diameter the longest chord?', answer: 'Because it passes through the centre; any chord not through the centre is shorter.' },
    ],
    parentHomePractice: {
      intro: 'Wheels, plates, and bottle caps are circles.',
      activity: 'Trace around a plate on paper. Mark the centre (eye-ball it). Draw a radius, a diameter, and a chord. Measure each.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nGB.07 — Circles\n\n1) A circle has radius 7 cm. Diameter = ____ cm.\n2) A circle has diameter 14 cm. Radius = ____ cm.\n3) Mark on a sketched circle: centre, one radius, one diameter, one chord that is NOT a diameter, one arc.\n4) Is every chord a diameter? Why or why not? ____________________________________\n5) Is every diameter a chord? Why or why not? ____________________________________',
  },

  'GB.08': {
    miniLesson:
      'A LINE OF SYMMETRY is a "fold line": fold the figure along it and the two halves match exactly. Counts you should know: square = 4, non-square rectangle = 2, equilateral triangle = 3, regular hexagon = 6 (a regular n-gon has n), circle = infinitely many, general parallelogram = 0.',
    visualWalkthrough: [
      'Pick a candidate line.',
      'Imagine folding the figure along it.',
      'If the two halves coincide exactly, the line is a line of symmetry. Otherwise it is not.',
      'Tally all such fold lines.',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Diagonals of a non-square rectangle are NOT lines of symmetry — folding along them does not align the halves. Always test by fold.',
    },
    teacherActivity: {
      title: 'Cut and fold',
      timeMinutes: 10,
      materials: ['Paper cut-outs of square, rectangle, equilateral triangle, isosceles triangle, parallelogram, regular hexagon'],
      steps: [
        'For each shape, students fold along candidate lines and count the lines of symmetry.',
        'Record their tallies and discuss surprises (the parallelogram has 0).',
      ],
    },
    independentPractice: [
      { prompt: 'How many lines of symmetry does a square have?', answer: '4' },
      { prompt: 'How many lines of symmetry does a non-square rectangle have?', answer: '2' },
      { prompt: 'How many lines of symmetry does a general parallelogram have?', answer: '0' },
    ],
    exitTicket: [
      { prompt: 'How many lines of symmetry does the letter H have?', answer: '2 (vertical and horizontal).' },
      { prompt: 'How many lines of symmetry does a circle have?', answer: 'Infinitely many — every line through the centre.' },
    ],
    parentHomePractice: {
      intro: 'Fold a leaf or a paper figure.',
      activity: 'Take a leaf. Fold it lengthways — do the halves match? Some leaves (peepal) are nearly symmetric; some (mango) are not. Discuss why.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nGB.08 — Symmetry\n\nCount the lines of symmetry.\n\n1) Square → ____\n2) Equilateral triangle → ____\n3) Non-square rectangle → ____\n4) Letter H → ____\n5) Letter A → ____\n6) Circle → ____\n7) Regular hexagon → ____\n8) General parallelogram → ____',
  },

  'GB.09': {
    miniLesson:
      'A COORDINATE PLANE has two perpendicular number lines — the horizontal X-AXIS and the vertical Y-AXIS — meeting at the ORIGIN (0, 0). A POINT is named by an ordered pair (x, y): x is how far ACROSS (right) and y is how far UP. Order matters: (3, 5) and (5, 3) are different points.',
    visualWalkthrough: [
      'Draw a horizontal arrow right (x-axis) and a vertical arrow up (y-axis) meeting at one point.',
      'The meeting point is the origin (0, 0).',
      'To plot (3, 5): from the origin, go 3 right then 5 up. Mark the point.',
      'To read a marked point, drop perpendiculars to each axis; the readings are (x, y).',
    ],
    misconceptionReteach: {
      conceptual_gap:
        'Swapping x and y is the most common slip. Always go ACROSS first, then UP. Mnemonic: "x is across, y goes up to the sky."',
    },
    teacherActivity: {
      title: 'Floor grid',
      timeMinutes: 10,
      materials: ['Masking tape on the floor to make a 6×6 grid'],
      steps: [
        'Call out coordinates: "Walk to (2, 3)." Student moves.',
        'Place objects at coordinates and have students name them.',
        'Discuss: what coordinates do points on the x-axis share? (y = 0.)',
      ],
    },
    independentPractice: [
      { prompt: 'A point is 4 right and 7 up from the origin. Its coordinates?', answer: '(4, 7)' },
      { prompt: 'What is the y-coordinate of every point on the x-axis?', answer: '0' },
      { prompt: 'Plot (2, 5) and (5, 2). Are they the same point?', answer: 'No — different locations.' },
    ],
    exitTicket: [
      { prompt: 'Coordinates of the origin?', answer: '(0, 0)' },
      { prompt: 'A point on the y-axis is 6 up from the origin. Coordinates?', answer: '(0, 6)' },
    ],
    parentHomePractice: {
      intro: 'A chessboard is a coordinate plane.',
      activity: 'Label rows 1–8 and columns A–H on a chessboard. Pick a piece. Read its coordinates as (column, row). Compare with the official chess notation.',
    },
    printableWorksheet:
      'Name: ______________________  Class: _________  Date: ___________\n\nGB.09 — Coordinate basics\n\nA) Write the coordinates.\n1) Origin → ____\n2) 5 right, 3 up → ____\n3) On the x-axis, 7 right → ____\n\nB) State the distance.\n4) Between (2, 3) and (2, 9) → ____\n5) Between (4, 1) and (10, 1) → ____\n\nC) Short answer.\n6) Are (3, 7) and (7, 3) the same point? Why? ________________________________',
  },
};

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

// v0.34 → v0.35 — every skill now has a Lesson. If no hand-authored
// entry exists, synthesizeLesson() derives one from the skill's item
// bank (worked examples from the items, common mistakes from
// misconception codes on distractors). Callers can once again assume
// the return value is defined.
export const lessonFor = (skill: SkillId): Lesson => {
  const base = LESSONS[skill];
  const rich = RICH_BY_SKILL[skill];
  if (base) {
    return rich ? { ...base, rich } : base;
  }
  // Synthesise from the item bank. Import lazily to keep the module
  // graph clean.
  const skillItems = ITEMS.filter((it) => it.skillId === skill);
  const skillName =
    skillItems[0]?.skillName ?? `Skill ${skill}`;
  return synthesizeLesson(skill, skillName, skillItems);
};

export const skillHasRichMaterials = (skill: SkillId): boolean =>
  RICH_BY_SKILL[skill] !== undefined;
