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
  | 'reads_position_as_value';

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
];
