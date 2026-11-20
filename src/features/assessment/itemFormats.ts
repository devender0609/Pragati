// v0.51 §14/§9 — Item format architecture.
//
// THREE FORMATS ARE IMPLEMENTED. The rest are declared so the type
// system and authoring tools can reference them, and so adding one is
// a matter of writing a scorer rather than reworking the renderer.
//
// THE RULE THAT MATTERS: an unimplemented format FAILS SAFELY. It is
// never scored as incorrect, never scored as correct, and never
// silently skipped. `scoreResponse` returns an explicit
// `unsupported_format` outcome, because a fake score on a format
// nobody has built is worse than an error — it enters the data as if
// it meant something.

import type { ItemFormat } from './itemSpecification';

export type ScoreOutcome =
  | { status: 'scored'; correct: boolean; score: number }
  | { status: 'unsupported_format'; format: ItemFormat; reason: string }
  | { status: 'invalid_response'; reason: string };

export type SingleSelectResponse = { kind: 'single_select'; chosenIndex: number };
export type NumericResponse = { kind: 'numeric_entry'; raw: string };
export type FractionResponse = { kind: 'fraction_entry'; numerator: string; denominator: string };

export type ItemResponse =
  | SingleSelectResponse
  | NumericResponse
  | FractionResponse
  | { kind: 'unsupported'; format: ItemFormat };

// ---------------------------------------------------------------------------
// Scorers
// ---------------------------------------------------------------------------

export function scoreSingleSelect(
  response: SingleSelectResponse,
  correctIndex: number
): ScoreOutcome {
  if (!Number.isInteger(response.chosenIndex) || response.chosenIndex < 0) {
    return { status: 'invalid_response', reason: 'No option selected.' };
  }
  const correct = response.chosenIndex === correctIndex;
  return { status: 'scored', correct, score: correct ? 1 : 0 };
}

/** Parse a numeric entry. Accepts integers, decimals, and a leading
 *  sign. Rejects anything else rather than coercing — `Number('')` is
 *  0, which would score a blank as an answer. */
export function parseNumeric(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function scoreNumeric(
  response: NumericResponse,
  correctValue: number,
  tolerance = 0
): ScoreOutcome {
  const parsed = parseNumeric(response.raw);
  if (parsed === null) {
    return { status: 'invalid_response', reason: 'Enter a number.' };
  }
  const correct = Math.abs(parsed - correctValue) <= tolerance;
  return { status: 'scored', correct, score: correct ? 1 : 0 };
}

export type FractionValue = { numerator: number; denominator: number };

export function parseFraction(
  numerator: string,
  denominator: string
): FractionValue | null {
  const n = parseNumeric(numerator);
  const d = parseNumeric(denominator);
  if (n === null || d === null) return null;
  if (!Number.isInteger(n) || !Number.isInteger(d)) return null;
  // A zero denominator is not a fraction. Returning null keeps the
  // division out of the scorer entirely.
  if (d === 0) return null;
  return { numerator: n, denominator: d };
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function simplifyFraction(f: FractionValue): FractionValue {
  const g = gcd(f.numerator, f.denominator);
  const sign = f.denominator < 0 ? -1 : 1;
  return {
    numerator: (f.numerator / g) * sign,
    denominator: Math.abs(f.denominator / g),
  };
}

export function fractionsEqual(a: FractionValue, b: FractionValue): boolean {
  // Cross-multiplication: exact, and avoids floating-point comparison.
  return a.numerator * b.denominator === b.numerator * a.denominator;
}

/**
 * Score a fraction entry.
 *
 * `requireLowestTerms` exists because "is 2/4 correct?" depends on what
 * the item asked. The specification decides; the scorer does not guess.
 */
export function scoreFraction(
  response: FractionResponse,
  correct: FractionValue,
  { requireLowestTerms = false }: { requireLowestTerms?: boolean } = {}
): ScoreOutcome {
  const parsed = parseFraction(response.numerator, response.denominator);
  if (parsed === null) {
    return {
      status: 'invalid_response',
      reason: 'Enter a whole number on top and a non-zero whole number underneath.',
    };
  }
  if (!fractionsEqual(parsed, correct)) {
    return { status: 'scored', correct: false, score: 0 };
  }
  if (requireLowestTerms) {
    const simplified = simplifyFraction(parsed);
    const isLowest =
      simplified.numerator === parsed.numerator &&
      simplified.denominator === parsed.denominator;
    return { status: 'scored', correct: isLowest, score: isLowest ? 1 : 0 };
  }
  return { status: 'scored', correct: true, score: 1 };
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

export type ScoringKey =
  | { format: 'single_select'; correctIndex: number }
  | { format: 'numeric_entry'; correctValue: number; tolerance?: number }
  | { format: 'fraction_entry'; correct: FractionValue; requireLowestTerms?: boolean }
  | { format: Exclude<ItemFormat, 'single_select' | 'numeric_entry' | 'fraction_entry'> };

/**
 * Score any response.
 *
 * The default branch is the important one: an unimplemented format
 * returns `unsupported_format`, never a boolean. Callers must handle
 * it explicitly, which is what stops an unscored response entering the
 * data as a wrong answer.
 */
export function scoreResponse(
  response: ItemResponse,
  key: ScoringKey
): ScoreOutcome {
  switch (key.format) {
    case 'single_select':
      return response.kind === 'single_select'
        ? scoreSingleSelect(response, key.correctIndex)
        : { status: 'invalid_response', reason: 'Response does not match the item format.' };
    case 'numeric_entry':
      return response.kind === 'numeric_entry'
        ? scoreNumeric(response, key.correctValue, key.tolerance ?? 0)
        : { status: 'invalid_response', reason: 'Response does not match the item format.' };
    case 'fraction_entry':
      return response.kind === 'fraction_entry'
        ? scoreFraction(response, key.correct, {
            requireLowestTerms: key.requireLowestTerms ?? false,
          })
        : { status: 'invalid_response', reason: 'Response does not match the item format.' };
    default:
      return {
        status: 'unsupported_format',
        format: key.format,
        reason: `No scorer exists for '${key.format}'. Items in this format cannot be administered or scored, and must not be counted as incorrect.`,
      };
  }
}

/** Whether a response outcome may enter the response record. An
 *  unsupported or invalid outcome must not. */
export function isRecordable(outcome: ScoreOutcome): boolean {
  return outcome.status === 'scored';
}
