// v0.62 §9/§10 — INSTRUCTIONAL PRACTICE FOR SECTION 7.4.
//
// Every item declares the official section it serves, so nothing here
// depends on the module-name inference `itemAlignment.ts` forbids.
//
// Formats were chosen per item by what the mathematics needs, not for
// variety: the number-line placements exist because the competency is
// about placement, and a multiple-choice list of fraction names cannot
// assess it.
//
// Reading load: every stem is under the Classes 6-8 limit of 25 words.
// Asserted by test, not by inspection.

import type { InstructionalItem } from './instructionalInteraction';

const S74 = 'ncert_gp_c6_s7_4';
const f = (n: number, d: number) => ({ numerator: n, denominator: d });

export const SECTION_7_4_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's74.p1',
    use: 'instructional_practice',
    officialSectionId: S74,
    format: 'select_point_on_number_line',
    prompt: 'Tap where 3/4 belongs.',
    min: f(0, 1),
    max: f(1, 1),
    partitions: 4,
    correctTickIndex: 3,
    labelTicks: false,
    correctFeedback: 'Yes. Three spaces of one-fourth each, counted from 0.',
    neutralIncorrectFeedback:
      'The bottom number says cut into 4 equal parts. Count 3 of them from 0.',
  },
  {
    itemId: 's74.p2',
    use: 'instructional_practice',
    officialSectionId: S74,
    format: 'select_point_on_number_line',
    prompt: 'Tap where 2/5 belongs.',
    min: f(0, 1),
    max: f(1, 1),
    partitions: 5,
    correctTickIndex: 2,
    labelTicks: false,
    correctFeedback: 'Correct. Two spaces of one-fifth from 0.',
    neutralIncorrectFeedback:
      'Cut 0 to 1 into 5 equal parts, then count 2 spaces.',
  },
  {
    itemId: 's74.p3',
    use: 'instructional_practice',
    officialSectionId: S74,
    // Beyond 1 — the section's hardest idea, and the reason the line
    // runs to 2 rather than stopping at the whole.
    format: 'select_point_on_number_line',
    prompt: 'This line runs from 0 to 2. Tap where 5/4 belongs.',
    min: f(0, 1),
    max: f(2, 1),
    partitions: 8,
    correctTickIndex: 5,
    labelTicks: false,
    correctFeedback: 'Yes. Four fourths reach 1, and one more fourth goes past it.',
    neutralIncorrectFeedback:
      'Each space is one-fourth. Count 5 of them from 0 — you will pass 1.',
  },
  {
    itemId: 's74.p4',
    use: 'instructional_practice',
    officialSectionId: S74,
    format: 'numeric_entry',
    prompt:
      'A line from 0 to 1 is cut into 6 equal parts. Which fraction is the 4th tick?',
    correctValue: f(4, 6),
    // 2/3 is the same point, and this section teaches exactly that.
    acceptEquivalent: true,
    correctFeedback: 'Correct. 4/6 — and 2/3 names the same point.',
    neutralIncorrectFeedback:
      'Six equal parts means each is one-sixth. Count the spaces from 0.',
  },
  {
    itemId: 's74.p5',
    use: 'instructional_practice',
    officialSectionId: S74,
    format: 'multiple_choice',
    prompt: 'On a line from 0 to 1 cut into fourths, where is 1/4?',
    choices: [
      {
        id: 'a',
        text: 'The first mark after 0',
        misconceptionId: null,
      },
      {
        id: 'b',
        text: 'The mark at 0 itself',
        // The format DOES distinguish this: choosing the zero mark is
        // the counting-ticks error, not a random miss.
        misconceptionId: 'counts_ticks_not_spaces',
      },
      { id: 'c', text: 'The mark at 1', misconceptionId: null },
      {
        id: 'd',
        text: 'It cannot be shown, because 1/4 is less than 1',
        misconceptionId: 'believes_fraction_under_one',
      },
    ],
    correctChoiceId: 'a',
    correctFeedback: 'Yes. One space of one-fourth, measured from 0.',
    neutralIncorrectFeedback:
      '1/4 is one space along, when 0 to 1 is cut into 4 equal parts.',
  },
  {
    itemId: 's74.p6',
    use: 'instructional_practice',
    officialSectionId: S74,
    format: 'fraction_strip_selection',
    prompt: 'Which strip shows the same length as 1/2?',
    strips: [
      { denominator: 3, shadedCount: 1 },
      { denominator: 4, shadedCount: 2 },
      { denominator: 5, shadedCount: 3 },
    ],
    targetValue: f(1, 2),
    correctFeedback: 'Correct. 2/4 reaches exactly the same point as 1/2.',
    neutralIncorrectFeedback:
      'Look at where the shading ends, not how many pieces there are.',
  },
];

export const SECTION_7_4_FORMAT_COUNTS = SECTION_7_4_PRACTICE.reduce(
  (acc, i) => {
    acc[i.format] = (acc[i.format] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);
