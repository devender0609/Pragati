// v0.67 §10 — THE FRACTIONS MISCONCEPTION REGISTRY.
//
// WHY THIS IS A NEW FILE RATHER THAN AN ADDITION TO
// `MISCONCEPTION_FEEDBACK`
//
// That map is part of the §7.4 semantic fingerprint (contentArtifact.ts
// includes it, deliberately, because item X6 asks about the wording a
// student sees after a wrong answer). Adding entries to it would change
// the fingerprint of frozen review candidate S74-v1-A1A3FF and
// invalidate a review that may already be underway.
//
// So the chapter-wide registry lives here. §7.4 keeps its four
// misconceptions through the original map; the other eight sections use
// this one. They will be unified when §7.4 is migrated to the authored
// schema as a new artifact version.
//
// THE RULE ON DIAGNOSIS
//
// A misconception may only be attached to a response when the response
// FORMAT can actually distinguish it. Choosing "1/4" from four options
// tells you the student chose 1/4 — not why. A distractor authored to
// represent a specific error can carry that inference; a merely wrong
// answer gets neutral corrective guidance instead.

export type FractionsMisconceptionId =
  | 'more_parts_means_bigger'
  | 'compare_numerators_only'
  | 'unequal_parts_still_count'
  | 'different_shape_cannot_be_equal'
  | 'add_numerators_and_denominators'
  | 'parts_count_vs_part_size'
  | 'whole_not_the_same'
  | 'mixed_number_is_multiplication'
  | 'equivalent_means_identical_picture';

export type MisconceptionRecord = {
  id: FractionsMisconceptionId;
  description: string;
  /** Official sections where this error actually shows up. */
  sections: string[];
  /** How a response can betray it — only where the format supports the
   *  inference. Null means it cannot be diagnosed from a response alone
   *  and must be surfaced through teaching instead. */
  diagnosticSignal: string | null;
  /** Student-facing. Addresses the thinking, never "Wrong." */
  feedback: string;
  teacherNote: string;
};

export const FRACTIONS_MISCONCEPTIONS: MisconceptionRecord[] = [
  {
    id: 'more_parts_means_bigger',
    description:
      'Believing a larger denominator makes a larger fraction, because the number is bigger.',
    sections: ['ncert_gp_c6_s7_1', 'ncert_gp_c6_s7_7'],
    diagnosticSignal:
      'Chooses 1/9 over 1/5, or orders unit fractions by denominator ascending.',
    feedback:
      'Share one roti among more people and each share gets smaller. More parts means each part is smaller, so 1/9 is less than 1/5.',
    teacherNote:
      'The textbook opens the chapter with exactly this exchange between Beni and Arvin. Use sharing language before any symbol comparison.',
  },
  {
    id: 'compare_numerators_only',
    description:
      'Comparing two fractions by numerator alone, ignoring the denominator.',
    sections: ['ncert_gp_c6_s7_7'],
    diagnosticSignal:
      'Chooses 3/8 over 2/3 because 3 > 2.',
    feedback:
      'The top number counts the parts; the bottom number tells you how big each part is. You need both to compare.',
    teacherNote:
      'Pair with a same-numerator example (2/3 vs 2/5) so neither number can be read alone.',
  },
  {
    id: 'unequal_parts_still_count',
    description:
      'Treating any division of a whole as fractional parts, even when the parts differ in size.',
    sections: ['ncert_gp_c6_s7_1', 'ncert_gp_c6_s7_2'],
    diagnosticSignal:
      'Names a shaded region of an unequally divided shape as a fraction of the whole.',
    feedback:
      'The parts have to be exactly equal. If one piece is bigger than another, they are not fourths.',
    teacherNote:
      'Show a deliberately uneven partition and ask "is this one-fourth?" before correcting it.',
  },
  {
    id: 'different_shape_cannot_be_equal',
    description:
      'Believing two fractions cannot be equal if their diagrams look different.',
    sections: ['ncert_gp_c6_s7_6'],
    diagnosticSignal:
      'Rejects 1/2 = 2/4 when shown a strip against a circle.',
    feedback:
      'The picture can look different and still cover the same amount of the whole. Check how much is shaded, not how many pieces.',
    teacherNote:
      'Use the same whole in two partitions before mixing shapes; changing both at once hides the point.',
  },
  {
    id: 'add_numerators_and_denominators',
    description:
      'Adding numerators and denominators separately: 1/2 + 1/3 = 2/5.',
    sections: ['ncert_gp_c6_s7_8'],
    diagnosticSignal:
      'Answers 2/5 for 1/2 + 1/3, or 2/8 for 1/4 + 1/4.',
    feedback:
      'You can only add the counts when the parts are the same size. Make the parts match first, then add how many.',
    teacherNote:
      'The 1/4 + 1/4 case is useful: the wrong method gives 2/8, which is visibly smaller than one of the pieces being added.',
  },
  {
    id: 'parts_count_vs_part_size',
    description:
      'Confusing how many parts there are with how big each part is.',
    sections: ['ncert_gp_c6_s7_1', 'ncert_gp_c6_s7_2', 'ncert_gp_c6_s7_3'],
    diagnosticSignal: null,
    feedback:
      'The bottom number is not a count of what you have — it tells you how many equal parts the whole was cut into.',
    teacherNote:
      'Hard to diagnose from a single answer; surface it by asking the student to say what each number means aloud.',
  },
  {
    id: 'whole_not_the_same',
    description:
      'Comparing fractions of different wholes as though they were comparable.',
    sections: ['ncert_gp_c6_s7_2', 'ncert_gp_c6_s7_7'],
    diagnosticSignal:
      'Asserts 1/2 of a small roti equals 1/2 of a large one in quantity.',
    feedback:
      'Halves of different wholes are different amounts. Fractions can only be compared when the whole is the same.',
    teacherNote:
      'Worth stating explicitly in every comparison task; the textbook assumes the same whole throughout.',
  },
  {
    id: 'mixed_number_is_multiplication',
    description:
      'Reading 2¾ as two multiplied by three-fourths rather than two wholes and three-fourths.',
    sections: ['ncert_gp_c6_s7_5'],
    diagnosticSignal: 'Converts 2¾ to 6/4.',
    feedback:
      'Writing them side by side means "two whole ones and three-fourths more", not two times three-fourths.',
    teacherNote:
      'Read mixed numbers aloud with "and" every time until the habit sticks.',
  },
  {
    id: 'equivalent_means_identical_picture',
    description:
      'Believing equivalent fractions must have the same number of shaded pieces.',
    sections: ['ncert_gp_c6_s7_6'],
    diagnosticSignal: 'Rejects 2/4 = 3/6 because the counts differ.',
    feedback:
      'The number of pieces changes, and so does their size. What stays the same is how much of the whole is covered.',
    teacherNote:
      'Stack strips so the shaded ends align; the equal endpoint is the argument.',
  },
];

const BY_ID = new Map(FRACTIONS_MISCONCEPTIONS.map((m) => [m.id, m]));

export function fractionsMisconception(
  id: FractionsMisconceptionId
): MisconceptionRecord {
  const m = BY_ID.get(id);
  if (!m) throw new Error(`unknown misconception '${id}'`);
  return m;
}

export function misconceptionsForSection(
  officialSectionId: string
): MisconceptionRecord[] {
  return FRACTIONS_MISCONCEPTIONS.filter((m) =>
    m.sections.includes(officialSectionId)
  );
}

/** Misconceptions that cannot be inferred from a response alone. Listed
 *  so authoring does not attach them to distractors. */
export function nonDiagnosableMisconceptions(): MisconceptionRecord[] {
  return FRACTIONS_MISCONCEPTIONS.filter((m) => m.diagnosticSignal === null);
}
