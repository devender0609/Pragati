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
  | 'bigger_number_always_better'
  | 'number_without_its_unit'
  | 'compares_across_different_wholes'
  | 'reads_position_as_value'
  // §3.2 — all four are errors about the DEFINITION, not about
  // comparing numbers. Students can compare 4188 and 5353 perfectly well
  // and still get every supercell wrong.
  | 'supercell_needs_only_one_bigger_neighbour'
  | 'tie_counts_as_larger'
  | 'neighbourhood_assumed_not_stated'
  | 'largest_in_the_row_is_the_only_supercell';

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
    id: 'bigger_number_always_better',
    description:
      'Treats a larger number as automatically the better or preferred one, regardless of what is being counted.',
    sections: ['ncert_gp_c6_s3_1'],
    // A student choosing the larger number is not evidence on its own:
    // in most questions the larger number IS the right answer. Only an
    // item where "more" is worse — mistakes, absences, cost — separates
    // the two, and this section has such items.
    diagnosticSignal:
      'Chooses the larger number on an item where more of the quantity is worse (mistakes made, days absent).',
    feedback:
      'A bigger number is not always better news. It depends what is being counted — more runs is good, more mistakes is not.',
    teacherNote:
      'Ask what the number counts before asking which is bigger. Students who answer fast are usually comparing digits, not meaning.',
  },
  {
    id: 'number_without_its_unit',
    description:
      'Reports or compares a bare number and drops what it was counting, so the number stops meaning anything.',
    sections: ['ncert_gp_c6_s3_1'],
    diagnosticSignal: null,
    feedback:
      'A number on its own does not tell you much. Say what it counts: 12 what?',
    teacherNote:
      'Insist on the noun every time — "12 students", not "12". This is the habit the whole chapter rests on, and it is cheap to build here and expensive to repair later.',
  },
  {
    id: 'compares_across_different_wholes',
    description:
      'Compares two counts taken from groups of different sizes as though they were directly comparable.',
    sections: ['ncert_gp_c6_s3_1'],
    diagnosticSignal:
      'Declares the larger raw count the winner when the two groups are stated to be different sizes.',
    feedback:
      'Both counts came from groups of different sizes, so the bigger count does not settle it. What would make this a fair comparison?',
    teacherNote:
      'This is the seed of proportional reasoning and it appears here in a form students can argue about without any fractions. Let them argue.',
  },
  {
    id: 'reads_position_as_value',
    description:
      'Reads where a number sits in a list or table as a claim about its size, rather than reading the number itself.',
    sections: ['ncert_gp_c6_s3_1'],
    diagnosticSignal: null,
    feedback:
      'Being first in the list does not make it the largest. Read the numbers, not the order they are written in.',
    teacherNote:
      'Show the same data in two different orders and ask whether anything changed. Nothing did, and that surprises them.',
  },
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
];
