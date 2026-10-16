// ===========================================================================
// v0.79 §2 — NUMBER PLAY MISCONCEPTIONS.
//
// Chapter 3 of Ganita Prakash. Same record shape as the Fractions
// registry, and the same rule: `diagnosticSignal` is null unless a
// response format can genuinely betray the error. A misconception that
// cannot be inferred from an answer is surfaced through teaching, never
// guessed at from a wrong option.
//
// These are the errors this chapter's mathematics actually produces —
// not a generic list. Number Play is about reading information out of
// numbers and comparing them in context, so its characteristic errors
// are about COMPARISON and CONTEXT rather than about arithmetic.
// ===========================================================================

export type NumberPlayMisconceptionId =
  // v0.82.1 — the previous four described errors in a lesson that
  // taught the wrong mathematics. These are the errors the SOURCE's
  // mathematics actually produces: counting the wrong things, or
  // forgetting that an end position has one neighbour.
  | 'counts_all_taller_not_adjacent'
  | 'counts_shorter_neighbours'
  | 'end_position_given_two_neighbours'
  | 'reads_code_as_height'
  // §3.2 — all four are errors about the DEFINITION, not about
  // comparing numbers. Students can compare 4188 and 5353 perfectly well
  // and still get every supercell wrong.
  | 'supercell_needs_only_one_bigger_neighbour'
  | 'tie_counts_as_larger'
  | 'neighbourhood_assumed_not_stated'
  | 'largest_in_the_row_is_the_only_supercell'
  // §3.3 — errors about reading DISTANCE from a line, not about the
  // numbers themselves.
  | 'assumes_line_starts_at_zero'
  | 'assumes_ticks_step_by_one'
  | 'ignores_scale_reads_picture'
  | 'places_by_digit_appearance';

export type NumberPlayMisconceptionRecord = {
  id: NumberPlayMisconceptionId;
  description: string;
  sections: string[];
  diagnosticSignal: string | null;
  feedback: string;
  teacherNote: string;
};

export const NUMBER_PLAY_MISCONCEPTIONS: NumberPlayMisconceptionRecord[] = [
  {
    id: 'supercell_needs_only_one_bigger_neighbour',
    description:
      'Calls a cell a supercell because it beats one neighbour, without checking the other.',
    sections: ['ncert_gp_c6_s3_2'],
    diagnosticSignal:
      'Selects a cell that beats exactly one of its two neighbours and loses to the other.',
    feedback:
      'It beats the neighbour on one side. What about the other side? A supercell has to beat every neighbour.',
    teacherNote:
      'Make them list the neighbours out loud before comparing. The error is skipping the list, not misreading the numbers.',
  },
  {
    id: 'tie_counts_as_larger',
    description:
      'Treats a cell equal to its neighbour as larger than it, so a tie produces a supercell.',
    sections: ['ncert_gp_c6_s3_2'],
    diagnosticSignal:
      'Selects a cell whose neighbour holds the same value.',
    feedback:
      'Those two are equal. Equal is not larger — so neither one is a supercell.',
    teacherNote:
      'This is the single most useful case in the section. Students scanning for "the big one" stop comparing; a tie forces them back to the definition.',
  },
  {
    id: 'neighbourhood_assumed_not_stated',
    description:
      'Answers a grid question without establishing which cells count as neighbours, usually by silently including or excluding diagonals.',
    sections: ['ncert_gp_c6_s3_2'],
    // A single answer cannot show which rule the student used unless the
    // two rules disagree on that grid. Diagnosing it needs the
    // reasoning, not the selection.
    diagnosticSignal: null,
    feedback:
      'Before you hunt, say which cells count as neighbours. The answer can change depending on the rule.',
    teacherNote:
      'Ask the class to decide the rule before you give it. The question is mathematically real and the discussion is the lesson.',
  },
  {
    id: 'largest_in_the_row_is_the_only_supercell',
    description:
      'Assumes there is exactly one supercell per row, and that it must be the largest number.',
    sections: ['ncert_gp_c6_s3_2'],
    diagnosticSignal:
      'Selects only the row maximum when a smaller cell also beats both of its own neighbours.',
    feedback:
      'A smaller number can still beat both of its own neighbours. How many supercells does this row really have?',
    teacherNote:
      'Give a row with two clear peaks. It also sets up the reasoning task: two supercells can never sit next to each other.',
  },
  {
    id: 'counts_all_taller_not_adjacent',
    description:
      'Counts every taller object anywhere in the row rather than only the ones directly beside this position.',
    sections: ['ncert_gp_c6_s3_1'],
    diagnosticSignal:
      'Reports a number larger than 2 for a middle position, which only the whole-row count can produce.',
    feedback:
      'Only the positions directly next to this one count. How many of those two are taller?',
    teacherNote:
      'Cover the rest of the row with a hand. The error disappears when the distant objects are out of sight.',
  },
  {
    id: 'counts_shorter_neighbours',
    description:
      'Counts the neighbours that are SHORTER instead of taller, so the code comes out reversed.',
    sections: ['ncert_gp_c6_s3_1'],
    // A reversed count is not distinguishable from a careless one on a
    // single position; it shows in a whole row, which a single response
    // does not give us.
    diagnosticSignal: null,
    feedback:
      'Check which way round you are counting: this number reports the TALLER neighbours.',
    teacherNote:
      'Ask for the whole row rather than one position. A consistent reversal is obvious across five answers and invisible in one.',
  },
  {
    id: 'end_position_given_two_neighbours',
    description:
      'Treats a position at either end of the row as though it had a neighbour on both sides.',
    sections: ['ncert_gp_c6_s3_1'],
    diagnosticSignal:
      'Reports 2 for an end position, or accepts a proposed code that begins or ends with 2.',
    feedback:
      'This one is at the end of the row. How many positions are actually next to it?',
    teacherNote:
      'Two facts carry most of this section: an end has one neighbour, and the tallest reports 0. Most impossibility arguments come from one of them.',
  },
  {
    id: 'reads_code_as_height',
    description:
      'Reads the reported number as a height or a rank rather than as a count of taller neighbours.',
    sections: ['ncert_gp_c6_s3_1'],
    diagnosticSignal: null,
    feedback:
      'That number is not how tall it is, and not its place in the line. It counts something.',
    teacherNote:
      'Show two very different rows that produce the same code. Nothing else makes the point as quickly.',
  },
  {
    id: 'assumes_line_starts_at_zero',
    description:
      'Assumes the left end of any number line is 0, and reads or places numbers accordingly.',
    sections: ['ncert_gp_c6_s3_3'],
    diagnosticSignal:
      'Reads a tick as though the window began at 0 when the stated left end is not 0.',
    feedback:
      'Look at the number written at the left end of this line. It does not start at 0.',
    teacherNote:
      'Every line in this section should be drawn with a non-zero start at least once before students work alone.',
  },
  {
    id: 'assumes_ticks_step_by_one',
    description:
      'Assumes consecutive ticks differ by 1 regardless of the window and the number of intervals.',
    sections: ['ncert_gp_c6_s3_3'],
    diagnosticSignal:
      'Counts ticks as units on a line whose interval is not 1.',
    feedback:
      'Work out the span first, then share it between the intervals. One step here is not 1.',
    teacherNote:
      'The 86,000-to-88,000 window with a step of 250 exists for this error. Students expect round thousands.',
  },
  {
    id: 'ignores_scale_reads_picture',
    description:
      'Judges magnitude from how the line looks on the page rather than from its labelled scale.',
    sections: ['ncert_gp_c6_s3_3'],
    diagnosticSignal: null,
    feedback:
      'Two lines drawn the same width can show completely different numbers. What do the ends say?',
    teacherNote:
      'Draw a 0-to-10 line and an 86,000-to-88,000 line at identical width, side by side. The image does the teaching.',
  },
  {
    id: 'places_by_digit_appearance',
    description:
      'Places a number by how its digits look — length or leading digit — rather than by its magnitude relative to the window.',
    sections: ['ncert_gp_c6_s3_3'],
    diagnosticSignal: null,
    feedback:
      'Compare this number with the tick values, not with how the digits look written down.',
    teacherNote:
      'Pair numbers such as 15,073 and 15,037 so that leading digits give no help.',
  },
];
