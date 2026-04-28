// Learning materials for the Class 6 Fractions Module (v0.5).
//
// For each skill, we author:
//   - intro:           1-2 sentence summary of what the skill is.
//   - reteach:         a short, numbered re-teach lesson (3-6 steps).
//   - visual:          one inline visual (FractionBar or AreaGrid spec)
//                      plus a caption and explanation.
//   - practice:        5 item IDs from src/data/items.ts, ordered easy → hard,
//                      surfaced as a guided practice strip.
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
  explanation: string;
};

export type Lesson = {
  skillId: SkillId;
  intro: string;
  reteach: {
    title: string;
    steps: LessonStep[];
  };
  visualExplanation: LessonVisual;
  practice: string[]; // item IDs
  teacherNote: string;
  parentNote: string;
};

export const LESSONS: Record<SkillId, Lesson> = {
  'FR.02': {
    skillId: 'FR.02',
    intro:
      'A fraction names a part of one whole that has been split into equal pieces. The bottom number (denominator) tells you how many equal pieces; the top number (numerator) tells you how many of those pieces you are talking about.',
    reteach: {
      title: 'Reteach: reading a fraction from a picture',
      steps: [
        'Find the whole. It is the full bar, the full square, or the full strip — not part of it.',
        'Count the total number of EQUAL pieces in the whole. Write that number as the denominator.',
        'Count the shaded pieces. Write that number as the numerator.',
        'Read it aloud: "numerator out of denominator". For example, 3 out of 5 is written 3/5.',
        'Sanity check: if no piece is shaded, the fraction is 0/denominator (i.e., 0). If every piece is shaded, the fraction equals 1.',
      ],
    },
    visualExplanation: {
      caption:
        'A bar split into 5 equal parts with 3 of them shaded shows the fraction 3/5.',
      visual: {
        kind: 'bars',
        bars: [{ numerator: 3, denominator: 5, label: '3/5' }],
      },
      explanation:
        'The whole is the full bar. It has 5 equal pieces (denominator), and 3 are shaded (numerator). So the shaded portion is 3/5 of the whole.',
    },
    practice: ['FR.02-01', 'FR.02-04', 'FR.02-05', 'FR.02-08', 'FR.02-12'],
    teacherNote:
      'Students who only count shaded cells often forget the denominator must be the TOTAL number of equal cells. Slow-down strategy: have the student point to and count "total cells" first, then "shaded cells", out loud, before writing the fraction.',
    parentNote:
      'Cut a chapati or roti into equal pieces with your child. Ask them to write a fraction for "what we have left" or "what we have eaten". Insist that the pieces look equal — that is the whole point of the denominator.',
  },

  'FR.03': {
    skillId: 'FR.03',
    intro:
      'Two fractions are equivalent if they show the same amount of the same whole. You can build an equivalent fraction by multiplying the top and bottom by the same non-zero number, or simplify one by dividing the top and bottom by their highest common factor (HCF).',
    reteach: {
      title: 'Reteach: making and simplifying equivalent fractions',
      steps: [
        'To go FROM small denominator TO big: pick a multiplier k. Multiply BOTH numerator and denominator by k.',
        'To go FROM big denominator TO small (simplify): find HCF(numerator, denominator). Divide BOTH by it.',
        'Always check: did you change top AND bottom by the same factor? If you only changed one, the fraction is no longer equivalent.',
        'Worked example: 2/3 → ?/12. Denominator 3 × 4 = 12, so numerator 2 × 4 = 8. Answer: 8/12.',
        'Worked example: 8/12 → simplest form. HCF(8, 12) = 4. So 8/12 = 2/3.',
      ],
    },
    visualExplanation: {
      caption:
        'Two equal bars: 1/2 of the first is shaded, and 2/4 of the second. The shaded length is identical — so 1/2 = 2/4.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 1, denominator: 2, label: '1/2' },
          { numerator: 2, denominator: 4, label: '2/4' },
        ],
      },
      explanation:
        'Both bars have the same length (the same whole). The first has 1 of 2 equal pieces shaded; the second has 2 of 4 equal pieces shaded. The shaded amount is identical, so 1/2 and 2/4 are equivalent.',
    },
    practice: ['FR.03-01', 'FR.03-05', 'FR.03-06', 'FR.03-09', 'FR.03-12'],
    teacherNote:
      'The most common slip is multiplying only the numerator OR only the denominator. Use a "k/k = 1" reminder: multiplying by k/k is multiplying by 1, so the value cannot change. Whatever you do to the top, do to the bottom.',
    parentNote:
      'Use a recipe at home. If a recipe says "1/2 cup" and your child only has a 1/4-cup measure, ask them to figure out how many 1/4-cups make 1/2 cup. That is the equivalent-fraction idea in disguise.',
  },

  'FR.04': {
    skillId: 'FR.04',
    intro:
      'A mixed number is one or more wholes plus a proper fraction (e.g., 2 1/4). An improper fraction has a numerator that is at least as big as the denominator (e.g., 9/4). They are two ways of writing the same value.',
    reteach: {
      title: 'Reteach: mixed ↔ improper fractions',
      steps: [
        'Mixed → improper: numerator = (whole × denominator) + numerator. Denominator stays the same. Example: 2 1/4 = (2 × 4 + 1)/4 = 9/4.',
        'Improper → mixed: divide numerator by denominator. The quotient is the whole part; the remainder becomes the new numerator over the same denominator. Example: 11/3 = 3 remainder 2, so 11/3 = 3 2/3.',
        'Always check the picture: 2 1/4 means 2 full wholes plus another quarter. Improper 9/4 means 9 quarter-pieces, which is also 2 wholes and 1 quarter. Same amount.',
        'A common slip is to forget the "+ numerator" step in mixed → improper. Saying it aloud helps: "two whole-fours, plus the extra one".',
      ],
    },
    visualExplanation: {
      caption:
        'Two same-sized bars: the first is fully shaded (one whole), the second has 1/4 shaded. Together they show 1 1/4 (= 5/4).',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 4, denominator: 4, label: 'Whole' },
          { numerator: 1, denominator: 4, label: '1/4' },
        ],
      },
      explanation:
        'A whole is 4/4 of itself. Adding another 1/4 of the same whole gives 4/4 + 1/4 = 5/4. As a mixed number that is 1 1/4.',
    },
    practice: ['FR.04-01', 'FR.04-02', 'FR.04-05', 'FR.04-06', 'FR.04-11'],
    teacherNote:
      'When a student writes 2 1/4 = (2 + 1)/4 = 3/4, the picture in their head is "stick the numbers next to each other". Re-anchor with bars: 2 wholes are not 2/4, they are 8/4. Then add the 1/4 to get 9/4.',
    parentNote:
      'When you have 1 and a bit of something at home (1 and a half rotis, 2 and a quarter cups), ask your child to write it as an improper fraction. The kitchen is the easiest fraction lab in the house.',
  },

  'FR.05': {
    skillId: 'FR.05',
    intro:
      'When two fractions already have the SAME denominator (their pieces are the same size), adding or subtracting them is just adding or subtracting the numerators. The denominator does not change.',
    reteach: {
      title: 'Reteach: add/subtract with like denominators',
      steps: [
        'Check that the denominators match. If they do not, this is not a like-denominator problem — go to FR.06 / FR.07.',
        'Add or subtract the NUMERATORS only. Keep the same denominator.',
        'Simplify the answer if possible (FR.03). Convert to a mixed number if it is improper (FR.04).',
        'Worked example: 5/8 + 3/8 = (5+3)/8 = 8/8 = 1. Worked example: 7/10 − 3/10 = 4/10 = 2/5.',
        'Why doesn\'t the denominator change? Because the SIZE of each piece does not change — only the NUMBER of pieces does.',
      ],
    },
    visualExplanation: {
      caption:
        'Two equal bars, each split into fifths: 2/5 + 1/5 = 3/5. The piece-size is the same so we just count pieces.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 2, denominator: 5, label: '2/5' },
          { numerator: 1, denominator: 5, label: '1/5' },
        ],
      },
      explanation:
        'Each cell is one-fifth of the same whole. Combining them: 2 fifths + 1 fifth = 3 fifths. The denominator stays as 5 because the piece-size has not changed.',
    },
    practice: ['FR.05-01', 'FR.05-02', 'FR.05-05', 'FR.05-06', 'FR.05-12'],
    teacherNote:
      'The most common error here is "adding across" — 1/4 + 2/4 = 3/8. The fix is the size-of-piece argument: the denominator labels piece-size; if both pieces are quarters, the answer is in quarters too.',
    parentNote:
      'Drawing or splitting a chocolate bar is the cleanest model. "I had 2 of 8 squares, you ate 1 of 8 squares — how many of the 8 squares are left?" The bar itself is the whole, and the squares are eighths.',
  },

  'FR.06': {
    skillId: 'FR.06',
    intro:
      'When two fractions have DIFFERENT denominators, you cannot add their numerators directly. You first rewrite both fractions over a common denominator (the LCM of the two denominators is the cleanest choice), then add the numerators.',
    reteach: {
      title: 'Reteach: add fractions with unlike denominators',
      steps: [
        'Find the LCM of the two denominators. (For coprime denominators that is just their product.)',
        'Rewrite each fraction with the LCM as the new denominator. Multiply numerator AND denominator by the same factor (FR.03).',
        'Add the numerators. Keep the LCM denominator.',
        'Simplify (FR.03) and convert to a mixed number if needed (FR.04).',
        'Worked example: 1/3 + 1/4. LCM(3,4) = 12. So 1/3 = 4/12 and 1/4 = 3/12. Sum = 7/12.',
      ],
    },
    visualExplanation: {
      caption:
        'Two same-sized bars: 1/4 and 1/8 of the same whole. To combine them, both are rewritten over 8: 1/4 becomes 2/8, then 2/8 + 1/8 = 3/8.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 1, denominator: 4, label: '1/4' },
          { numerator: 1, denominator: 8, label: '1/8' },
        ],
      },
      explanation:
        'You cannot add 1/4 and 1/8 directly because the pieces are different sizes. Rewriting 1/4 as 2/8 makes both into eighths; then we just count: 2 eighths + 1 eighth = 3 eighths.',
    },
    practice: ['FR.06-01', 'FR.06-04', 'FR.06-15', 'FR.06-17', 'FR.06-21'],
    teacherNote:
      'Watch for "add across" (1/4 + 1/8 = 2/12). Re-anchor with the bar picture and the LCM step. If the student knows LCM but forgets to scale the numerator, that is "incomplete conversion" — practise FR.03 alongside.',
    parentNote:
      'Half a cup of milk plus a quarter cup. How much in total? Have your child explain how they would describe the total in cups, and use that to introduce the common-denominator idea.',
  },

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
        'Worked example: 3 1/4 − 1 1/2. LCM(4,2)=4 → 3 1/4 − 1 2/4. Borrow: 3 1/4 = 2 5/4. Then 2 5/4 − 1 2/4 = 1 3/4.',
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
      explanation:
        'Pieces of different sizes cannot be subtracted directly. Rewriting 1/2 as 2/4 makes both fractions into quarters: 3 quarters − 2 quarters = 1 quarter.',
    },
    practice: ['FR.07-01', 'FR.07-05', 'FR.07-09', 'FR.07-17', 'FR.07-19'],
    teacherNote:
      'Borrowing trips many students. The mental picture to install is "1 = 4/4". If the student insists on subtracting smaller-from-larger fractional parts (the "borrowing_error" pattern), walk through 3 1/4 = 2 + 1 + 1/4 = 2 + 5/4 explicitly, with bars.',
    parentNote:
      'Pour out half a glass from a three-quarters-full glass. How much is left? Make the student describe what happened in fractions, and write it down step by step.',
  },

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
        'Sanity check the answer against the story. Does it have the right size? Right units?',
      ],
    },
    visualExplanation: {
      caption:
        'A glass starts 7/8 full and 1/3 of a glass is drunk. How much remains? Subtract: 7/8 − 1/3 = 21/24 − 8/24 = 13/24 of a glass.',
      visual: {
        kind: 'bars',
        bars: [
          { numerator: 7, denominator: 8, label: '7/8 full' },
          { numerator: 1, denominator: 3, label: '1/3 drunk' },
        ],
      },
      explanation:
        '"How much is left" tells you to subtract. The arithmetic is an FR.07 problem. The picture above shows the starting amount (top) and the amount drunk (bottom) on the same whole.',
    },
    practice: ['FR.08-01', 'FR.08-04', 'FR.08-05', 'FR.08-08', 'FR.08-12'],
    teacherNote:
      'When students pick the wrong operation, slow down on the second sentence of the problem. "What is the question actually asking?" Often a one-line restatement in the student\'s own words ("how much is left", "how much in total") fixes the operation choice.',
    parentNote:
      'Make up small story problems with everyday quantities ("1/2 a litre, plus 1/4 a litre"). Ask "what is this asking us to find?" before doing any arithmetic. Practising the question-recognition step is often more useful than the arithmetic itself.',
  },
};

export const lessonFor = (skill: SkillId): Lesson => LESSONS[skill];
