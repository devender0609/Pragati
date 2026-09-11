// v0.68 §2 — THE §7.4 MISCONCEPTION MAP, EXTRACTED VERBATIM.
//
// WHY THIS FILE EXISTS
//
// v0.67 could not attach the correct misconception IDs to two §7.7 and
// §7.8 distractors, because the interaction layer's `MisconceptionId`
// enum held only the four values §7.4 uses, and extending that enum
// would have changed the frozen fingerprint `a1a3ff57`.
//
// The unification in v0.68 needs a resolver that can read BOTH the
// §7.4 map and the chapter registry. If the resolver lived alongside
// `judge()` in `instructionalInteraction.ts`, that module would import
// the resolver and the resolver would import it back.
//
// So the §7.4 map moves here, BYTE-FOR-BYTE. Nothing about its content,
// its key order, or its values changes — `instructionalInteraction.ts`
// re-exports both the type and the object, so every existing import
// site and the fingerprint payload see exactly what they saw before.
//
// DO NOT ADD ENTRIES TO THIS MAP. It is inside the §7.4 fingerprint
// payload (`contentArtifact.ts` includes it deliberately, because
// Package B item X6 asks about the wording a student sees after a wrong
// answer). New chapter misconceptions belong in
// `fractionsMisconceptions.ts` and reach items through
// `misconceptionResolver.ts`.

/** Documented student errors. Feedback maps to these, never to guesses
 *  about intent the response format cannot support. */
export type MisconceptionId =
  | 'counts_ticks_not_spaces'
  | 'believes_fraction_under_one'
  | 'unequal_parts'
  | 'bigger_denominator_bigger_fraction';

/** Student-facing wording. Never "Wrong." — each names the actual
 *  mathematical error and what to do instead. */
export const MISCONCEPTION_FEEDBACK: Record<MisconceptionId, string> = {
  counts_ticks_not_spaces:
    'Count the spaces you move, not the marks. Starting at 0 is not a move yet.',
  believes_fraction_under_one:
    'A fraction can go past 1. Four fourths already make 1, so five fourths is longer.',
  unequal_parts:
    'The parts have to be exactly equal, or the fraction is not what it says it is.',
  bigger_denominator_bigger_fraction:
    'More parts means each part is smaller. Eighths are thinner than fourths.',
};

export const SECTION_7_4_MISCONCEPTION_IDS = Object.keys(
  MISCONCEPTION_FEEDBACK
) as MisconceptionId[];
