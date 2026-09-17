// ===========================================================================
// v0.82 §B — INTERACTIVE PRACTICE FOR NUMBER PLAY.
//
// v0.81 reported all three Number Play sections as `incomplete_draft`,
// every one missing interactive practice. This closes that gap — and
// the gap was real, not a checkbox: without an item aligned to the
// section id, nothing in the product can offer a student practice for
// that section, no matter how good the written lesson is.
//
// WHAT DECIDED THE FORMAT
//
// The mathematics, not the renderer.
//
//   §3.1 is about what a number means in context. There is nothing to
//        manipulate — the work is choosing an interpretation — so these
//        are multiple choice, and the distractors are the interpretations
//        a student actually makes.
//
//   §3.2 is about applying a strict definition across neighbours. A
//        student must decide about a PARTICULAR cell, so the prompts name
//        a cell and ask a yes/no question with a reason attached, rather
//        than asking for a list. Selecting cells in a live grid is the
//        better long-term interaction and needs a `select_cells_in_grid`
//        format that does not exist; specified at the end of this file
//        rather than half-built here.
//
//   §3.3 is about reading distance on a line, which the existing
//        `select_point_on_number_line` format renders and judges exactly.
//        So §3.3's items are the real thing rather than a description of
//        it.
//
// DIAGNOSIS IS ATTACHED ONLY WHERE THE ANSWER ADMITS ONE READING. A
// distractor gets `chapterMisconceptionId` when no other route produces
// it; otherwise it carries nothing and the student receives neutral
// corrective guidance. That is the §7.4 rule, applied to a new chapter.
// ===========================================================================

import type { InstructionalItem } from './instructionalInteraction';

const S31 = 'ncert_gp_c6_s3_1';
const S32 = 'ncert_gp_c6_s3_2';
const S33 = 'ncert_gp_c6_s3_3';

const whole = (n: number) => ({ numerator: n, denominator: 1 });

export const SECTION_3_1_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's31.p1',
    use: 'instructional_practice',
    officialSectionId: S31,
    format: 'multiple_choice',
    prompt:
      'Plants stand in a row with heights 30, 52, 41, 60, 35 cm. What number does the 41 cm plant report?',
    choices: [
      { id: 'a', text: '2', misconceptionId: null },
      {
        id: 'b',
        text: '3',
        misconceptionId: null,
        // Three is only reachable by counting every taller plant in the
        // row rather than the two beside it.
        chapterMisconceptionId: 'counts_all_taller_not_adjacent',
      },
      { id: 'c', text: '0', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback: 'Yes. Both neighbours, 52 and 60, are taller than 41.',
    neutralIncorrectFeedback:
      'Name its two neighbours first, then check each one against 41.',
  },
  {
    itemId: 's31.p2',
    use: 'instructional_practice',
    officialSectionId: S31,
    format: 'multiple_choice',
    prompt: 'Could a row of four plants report 2, 0, 0, 1?',
    choices: [
      { id: 'a', text: 'No — the first position is at an end', misconceptionId: null },
      {
        id: 'b',
        text: 'Yes',
        misconceptionId: null,
        chapterMisconceptionId: 'end_position_given_two_neighbours',
      },
      { id: 'c', text: 'Only if the plants are all the same height', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Right. An end position has one neighbour, so it can never report 2.',
    neutralIncorrectFeedback:
      'How many positions are next to the very first plant in a row?',
  },
  {
    itemId: 's31.p3',
    use: 'instructional_practice',
    officialSectionId: S31,
    format: 'multiple_choice',
    prompt: 'In any row of plants of different heights, what does the tallest plant report?',
    choices: [
      { id: 'a', text: '0', misconceptionId: null },
      { id: 'b', text: '2', misconceptionId: null },
      { id: 'c', text: 'It depends where it stands', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Yes — nothing beside it can be taller, wherever it stands.',
    neutralIncorrectFeedback:
      'Could anything next to the tallest plant be taller than it?',
  },
];

export const SECTION_3_2_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's32.p1',
    use: 'instructional_practice',
    officialSectionId: S32,
    format: 'multiple_choice',
    prompt:
      'In the row 626, 4188, 5353, 2126, is 4188 a supercell?',
    choices: [
      {
        id: 'a',
        text: 'No — 5353 on its right is larger',
        misconceptionId: null,
      },
      {
        id: 'b',
        text: 'Yes — it is larger than 626',
        misconceptionId: null,
        // Beating one neighbour and stopping is the whole error, and no
        // other reasoning reaches "yes" on this cell.
        chapterMisconceptionId: 'supercell_needs_only_one_bigger_neighbour',
      },
      { id: 'c', text: 'No — it is not the largest number in the row', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Yes. It beats the neighbour on one side and loses on the other, and a supercell must beat every neighbour.',
    neutralIncorrectFeedback:
      'List both neighbours of 4188, then check it against each one.',
  },
  {
    itemId: 's32.p2',
    use: 'instructional_practice',
    officialSectionId: S32,
    format: 'multiple_choice',
    prompt: 'In the row 340, 910, 910, 275, how many supercells are there?',
    choices: [
      { id: 'a', text: 'None', misconceptionId: null },
      {
        id: 'b',
        text: 'Two — both 910s',
        misconceptionId: null,
        chapterMisconceptionId: 'tie_counts_as_larger',
      },
      { id: 'c', text: 'One — the first 910', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Right. Each 910 has a neighbour equal to it, and equal is not larger.',
    neutralIncorrectFeedback:
      'Compare each 910 with the cell beside it. Is it larger than that cell, or the same?',
  },
  {
    itemId: 's32.p3',
    use: 'instructional_practice',
    officialSectionId: S32,
    format: 'multiple_choice',
    prompt: 'In the row 88, 12, 90, 7, which cells are supercells?',
    choices: [
      { id: 'a', text: '88 and 90', misconceptionId: null },
      {
        id: 'b',
        text: 'Only 90',
        misconceptionId: null,
        // Taking the row maximum and stopping. 88 beats its only
        // neighbour, so missing it has one cause.
        chapterMisconceptionId: 'largest_in_the_row_is_the_only_supercell',
      },
      { id: 'c', text: 'All except 7', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Yes. 88 beats its only neighbour, and 90 beats both of its own.',
    neutralIncorrectFeedback:
      'Check every cell, including the ones at the ends. An end cell has just one neighbour to beat.',
  },
];

export const SECTION_3_3_PRACTICE: InstructionalItem[] = [
  {
    itemId: 's33.p1',
    use: 'instructional_practice',
    officialSectionId: S33,
    format: 'select_point_on_number_line',
    prompt:
      'This line runs from 1000 to 10,000 in nine equal intervals. Tap the tick for 4000.',
    min: whole(1000),
    max: whole(10000),
    partitions: 9,
    correctTickIndex: 3,
    labelTicks: false,
    correctFeedback: 'Yes. Each interval is 1000, so three steps on from 1000.',
    neutralIncorrectFeedback:
      'Work out the span, share it between the nine intervals, then count on from the left end.',
  },
  {
    itemId: 's33.p2',
    use: 'instructional_practice',
    officialSectionId: S33,
    format: 'select_point_on_number_line',
    prompt:
      'This line runs from 15,070 to 15,080 in ten equal intervals. Tap the tick for 15,077.',
    min: whole(15070),
    max: whole(15080),
    partitions: 10,
    correctTickIndex: 7,
    labelTicks: false,
    correctFeedback: 'Correct. Here each interval is worth just 1.',
    neutralIncorrectFeedback:
      'The window is only 10 wide. What is one interval worth on this line?',
  },
  {
    itemId: 's33.p3',
    use: 'instructional_practice',
    officialSectionId: S33,
    format: 'multiple_choice',
    prompt:
      'A line has 86,000 at the left end and 88,000 at the right, divided into eight equal intervals. What is one interval worth?',
    choices: [
      { id: 'a', text: '250', misconceptionId: null },
      {
        id: 'b',
        text: '1000',
        misconceptionId: null,
        // Expecting a round thousand rather than dividing the span.
        chapterMisconceptionId: 'assumes_ticks_step_by_one',
      },
      { id: 'c', text: '2000', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback: 'Yes. A span of 2000 shared between eight intervals is 250.',
    neutralIncorrectFeedback:
      'Subtract to find the span, then divide by the number of intervals.',
  },
  {
    itemId: 's33.p4',
    use: 'instructional_practice',
    officialSectionId: S33,
    format: 'multiple_choice',
    prompt: 'Does every number line start at 0?',
    choices: [
      { id: 'a', text: 'No — read the number at the left end', misconceptionId: null },
      {
        id: 'b',
        text: 'Yes',
        misconceptionId: null,
        chapterMisconceptionId: 'assumes_line_starts_at_zero',
      },
      { id: 'c', text: 'Only when the numbers are large', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Right. A window can start anywhere — 15,070, or 86,000.',
    neutralIncorrectFeedback:
      'Look back at the line running from 15,070 to 15,080. Where does it begin?',
  },
];

/**
 * v0.82 — WHAT §3.2 SHOULD EVENTUALLY HAVE, AND WHY IT IS NOT HERE.
 *
 * The right interaction for supercells is selecting cells in a live
 * grid: the student marks what they believe are supercells and the
 * product judges the SET, which is closer to the mathematics than three
 * separate yes/no questions about cells someone else chose.
 *
 * That needs a `select_cells_in_grid` interaction format —
 * `NumberGridSpec` plus a selected-coordinate set, judged against
 * `supercellsFor()`. The spec and the computation already exist; the
 * format, the judge and the renderer's selection affordance do not.
 *
 * It is written here as a requirement rather than half-built, for the
 * same reason `PlaceValueSpec` was specified and not built in v0.81:
 * the multiple-choice items above teach the definition correctly today,
 * and shipping a broken selection surface would teach it worse.
 */
export const SECTION_3_2_INTERACTION_REQUIREMENT = {
  format: 'select_cells_in_grid',
  needs: [
    'a NumberGridSpec to display',
    'a set of selected [row, column] coordinates as the response',
    'judgement against supercellsFor(), comparing sets rather than counts',
    'partial-credit feedback: named cells missed, and named cells wrongly included',
    'keyboard selection and an accessible announcement of each cell’s state',
  ],
  blockedBy: 'interaction format, judge and renderer affordance do not exist',
} as const;
