// v0.49 §3 — Session purpose.
//
// Before this file, every student-launched session was the same thing
// under different button labels. `SessionPurpose` is the single value
// that distinguishes them, and it is persisted on the Session record
// so reporting can tell a low-stakes practice run apart from a
// chapter check after the fact.
//
// Persisted as `Session.sessionPurpose` (optional — every legacy
// session on disk simply has no purpose recorded, and readers must
// treat that as 'unknown' rather than assuming either mode).

export type SessionPurpose =
  /** Low-stakes. Smaller sample. Hints allowed before submitting. */
  | 'practice'
  /** Chapter-level check. Full sample across required skills. No
   *  instructional hint before an answer is submitted. */
  | 'chapter_check'
  /** A single-skill practice run launched from a concept card. */
  | 'concept_practice';

export const SESSION_PURPOSE_LABELS: Record<SessionPurpose, string> = {
  practice: 'Mixed practice',
  chapter_check: 'Chapter check',
  concept_practice: 'Concept practice',
};

/** Student-facing one-liner. Deliberately free of assessment jargon. */
export const SESSION_PURPOSE_BLURBS: Record<SessionPurpose, string> = {
  practice: 'A short practice set. You can ask for a hint.',
  chapter_check: 'A check across the whole chapter. No hints this time.',
  concept_practice: 'Practice on one idea. You can ask for a hint.',
};

/** Hints are instructional support. They belong in practice, never in
 *  a check — otherwise the check does not measure what it claims to. */
export function hintsAllowed(purpose: SessionPurpose): boolean {
  return purpose !== 'chapter_check';
}

/** Read the purpose off a stored session. Legacy sessions predate the
 *  field; we return null rather than guessing which mode they were. */
export function purposeOf(session: {
  sessionPurpose?: string;
}): SessionPurpose | null {
  const p = session.sessionPurpose;
  if (p === 'practice' || p === 'chapter_check' || p === 'concept_practice') {
    return p;
  }
  return null;
}
