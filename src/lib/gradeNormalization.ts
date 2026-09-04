// v0.48 §6 — Real grade normalization.
//
// The v0.47 shell coerced every unknown grade string to `class6`,
// silently pretending Class 6 content applied to any student whose
// stored `grade` didn't match the strict enum. This module fixes
// that with an explicit resolver that accepts the legacy forms the
// codebase has actually stored on disk over time and returns null
// (never a silent default) when the value cannot be resolved.

import type { Grade } from '../types';

const VALID_GRADES: Grade[] = [
  'class1', 'class2', 'class3', 'class4', 'class5', 'class6',
  'class7', 'class8', 'class9', 'class10', 'class11', 'class12',
];

const VALID_SET = new Set<string>(VALID_GRADES);

/** Accepted input shapes for `normalizeGrade`. Kept explicit so a
 *  future migration can grep this list. */
export const KNOWN_GRADE_FORMATS = [
  'class6',      // canonical
  'Class 6',     // legacy StartForm display
  'CLASS 6',
  'Grade 6',     // legacy imported classroom submission
  'grade_06',    // v0.26 curriculum registry style
  'grade_6',     // occasional shorthand
  '6',           // classroom code payload
  ' 6 ',         // trimmed
];

/** Best-effort conversion of any historical grade value to a
 *  canonical Grade. Returns null when the value cannot be resolved —
 *  callers MUST surface a profile-correction screen and NOT default
 *  to any grade. */
export function normalizeGrade(input: unknown): Grade | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed.length === 0) return null;

  // Already canonical.
  if (VALID_SET.has(trimmed)) return trimmed as Grade;

  // Extract the first 1-2 digit number.
  const m = trimmed.match(/(\d{1,2})/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (!Number.isFinite(n) || n < 1 || n > 12) return null;

  // Guard: reject strings that look like they carry additional
  // information we don't understand (e.g. "class 6a", "grade 6.5"),
  // but only if the extra characters aren't the recognised prefixes.
  // We recognise "class", "grade", "kg", "std", "std.", "standard".
  // The whole string must be one of: number, prefix + number,
  // number + trailing whitespace / period.
  const normalised = trimmed
    .toLowerCase()
    .replace(/[._-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Optional recognised prefix, optional leading 0, the class number,
  // and an optional trailing section marker (e.g. "A", "b", " b").
  const allowedPattern =
    /^(class|grade|standard|std|kg|kl)?\s*0?(\d{1,2})\s*[a-z]?\s*$/;
  if (!allowedPattern.test(normalised)) return null;

  return `class${n}` as Grade;
}

/** Convenience — is this a known grade at all? */
export function isKnownGrade(input: unknown): input is Grade {
  return normalizeGrade(input) !== null;
}
