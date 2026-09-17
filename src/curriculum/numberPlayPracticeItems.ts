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
      'Asha made 3 mistakes in her test. Bhavna made 8. Who did better on mistakes?',
    choices: [
      { id: 'a', text: 'Asha', misconceptionId: null },
      {
        id: 'b',
        text: 'Bhavna, because 8 is bigger',
        misconceptionId: null,
        // The stated reason is the error itself: choosing the larger
        // number on an item where more is worse admits no other reading.
        chapterMisconceptionId: 'bigger_number_always_better',
      },
      { id: 'c', text: 'They did the same', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Yes. Fewer mistakes is the better result, so here the smaller number wins.',
    neutralIncorrectFeedback:
      'Ask what the number counts before comparing. These are mistakes, so fewer is better.',
  },
  {
    itemId: 's31.p2',
    use: 'instructional_practice',
    officialSectionId: S31,
    format: 'multiple_choice',
    prompt: 'A scoreboard shows just the number 7. What does it tell you?',
    choices: [
      {
        id: 'a',
        text: 'Not much yet — you need to know what the 7 counts',
        misconceptionId: null,
      },
      { id: 'b', text: 'That the team is winning', misconceptionId: null },
      { id: 'c', text: 'That seven players are on the field', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Right. Seven runs, seven wickets and seven overs are three different pieces of news.',
    neutralIncorrectFeedback:
      'The number is real, but what it counts has not been said. Which would you need to ask?',
  },
  {
    itemId: 's31.p3',
    use: 'instructional_practice',
    officialSectionId: S31,
    format: 'multiple_choice',
    prompt:
      'Class A has 20 students and 4 absences. Class B has 50 students and 6 absences. Does the bigger number of absences settle which class attended better?',
    choices: [
      {
        id: 'a',
        text: 'No — the classes are different sizes',
        misconceptionId: null,
      },
      {
        id: 'b',
        text: 'Yes — 6 is more than 4, so Class B attended worse',
        misconceptionId: null,
        chapterMisconceptionId: 'compares_across_different_wholes',
      },
      { id: 'c', text: 'Yes — Class B is bigger, so it attended better', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Exactly. Two counts taken from groups of different sizes are not directly comparable.',
    neutralIncorrectFeedback:
      'Both counts are real, but they came from groups of different sizes. What would make the comparison fair?',
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
    prompt: 'This line runs from 0 to 100 in steps of 10. Tap where 30 belongs.',
    min: whole(0),
    max: whole(100),
    partitions: 10,
    correctTickIndex: 3,
    labelTicks: false,
    correctFeedback: 'Yes — three jumps of ten from 0.',
    neutralIncorrectFeedback:
      'Each interval is 10. Count the jumps from 0 rather than looking for a label.',
  },
  {
    itemId: 's33.p2',
    use: 'instructional_practice',
    officialSectionId: S33,
    format: 'select_point_on_number_line',
    prompt: 'Same line, 0 to 100 in tens. Tap where 80 belongs.',
    min: whole(0),
    max: whole(100),
    partitions: 10,
    correctTickIndex: 8,
    labelTicks: false,
    correctFeedback: 'Correct. Eight jumps of ten, well to the right of the middle.',
    neutralIncorrectFeedback:
      'Find the middle first — that is 50 — then count on in tens.',
  },
  {
    itemId: 's33.p3',
    use: 'instructional_practice',
    officialSectionId: S33,
    format: 'multiple_choice',
    prompt:
      '10, 20 and 60 are written next to each other in a table. On a number line, are the gaps between them equal?',
    choices: [
      { id: 'a', text: 'No — the second gap is much bigger', misconceptionId: null },
      {
        id: 'b',
        text: 'Yes — they are next to each other in the table',
        misconceptionId: null,
        chapterMisconceptionId: 'list_order_means_even_spacing',
      },
      { id: 'c', text: 'Yes — every number line has equal gaps', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback:
      'Right. 10 to 20 is a jump of 10; 20 to 60 is a jump of 40.',
    neutralIncorrectFeedback:
      'Work out each gap by subtracting. Are the two answers the same?',
  },
  {
    itemId: 's33.p4',
    use: 'instructional_practice',
    officialSectionId: S33,
    format: 'multiple_choice',
    prompt: 'What comes next in 5, 10, 20, 40?',
    choices: [
      { id: 'a', text: '80', misconceptionId: null },
      {
        id: 'b',
        text: '45',
        misconceptionId: null,
        // Adding the FIRST step to the last term. Only one route gets
        // to 45 here.
        chapterMisconceptionId: 'step_assumed_constant',
      },
      { id: 'c', text: '60', misconceptionId: null },
    ],
    correctChoiceId: 'a',
    correctFeedback: 'Yes. The step doubles each time, so the gaps widen.',
    neutralIncorrectFeedback:
      'Write the gap between each pair: 5, 10, 20. Is the step staying the same?',
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
