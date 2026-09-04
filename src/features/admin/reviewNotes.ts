// v0.68 §12 — REVIEWER DRAFT NOTES.
//
// WHAT THIS IS
//
// Somewhere for a person walking the chapter in Admin to write down
// what they noticed, per section, so an internal or educator walkthrough
// does not depend on a separate document and a good memory.
//
// WHAT THIS IS EMPHATICALLY NOT
//
// Educator-review evidence. These notes are LOCAL and DRAFT. They do
// not touch `educatorReview.ts`, they do not feed `publicationGate.ts`,
// and no quantity of them can move a section out of `authored_draft`.
// That separation is the whole design: the moment internal notes could
// count as review, "we reviewed it" would mean "someone on the team
// clicked through it", and the frozen §7.4 packages would stop being
// the only route to a genuine sign-off.
//
// Package B approval state is deliberately NOT reused. It is versioned
// against a content fingerprint and carries an external reviewer's
// identity; borrowing that machinery for scratch notes would make the
// two indistinguishable in storage.
//
// Storage is localStorage, and losing it is acceptable — a draft note
// that mattered belongs in the real review instrument.

export type ReviewNoteCategory =
  | 'mathematical'
  | 'curriculum_sequence'
  | 'visual'
  | 'feedback_misconception'
  | 'age_readability'
  | 'other';

export const REVIEW_NOTE_CATEGORY_LABEL: Record<ReviewNoteCategory, string> = {
  mathematical: 'Mathematical issue',
  curriculum_sequence: 'Curriculum / sequence issue',
  visual: 'Visual issue',
  feedback_misconception: 'Feedback / misconception issue',
  age_readability: 'Age / readability issue',
  other: 'Other',
};

export const REVIEW_NOTE_CATEGORIES = Object.keys(
  REVIEW_NOTE_CATEGORY_LABEL
) as ReviewNoteCategory[];

export type ReviewNote = {
  id: string;
  officialSectionId: string;
  category: ReviewNoteCategory;
  text: string;
  createdAt: string;
  /** Fixed. Present in the record so an export cannot be mistaken for
   *  educator-review evidence downstream. */
  status: 'internal_draft_note';
};

const KEY = 'pragati.v068.reviewNotes';

function read(): ReviewNote[] {
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ReviewNote[]) : [];
  } catch {
    // A corrupt draft store must never break the reviewer preview.
    return [];
  }
}

function write(notes: ReviewNote[]): void {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(notes));
  } catch {
    /* best effort — see the note on losing drafts above */
  }
}

export function allReviewNotes(): ReviewNote[] {
  return read();
}

export function reviewNotesFor(officialSectionId: string): ReviewNote[] {
  return read().filter((n) => n.officialSectionId === officialSectionId);
}

export function addReviewNote(
  officialSectionId: string,
  category: ReviewNoteCategory,
  text: string
): ReviewNote | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const note: ReviewNote = {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    officialSectionId,
    category,
    text: trimmed,
    createdAt: new Date().toISOString(),
    status: 'internal_draft_note',
  };
  write([...read(), note]);
  return note;
}

export function deleteReviewNote(id: string): void {
  write(read().filter((n) => n.id !== id));
}

export function reviewNoteCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const n of read()) {
    counts[n.officialSectionId] = (counts[n.officialSectionId] ?? 0) + 1;
  }
  return counts;
}

/**
 * Export for pasting into a real review response.
 *
 * The header states what the file is not. An exported artefact travels
 * without its context, and the one thing it must carry is that these
 * are scratch notes.
 */
export function exportReviewNotes(): string {
  const notes = read();
  const header = [
    'PRAGATI — INTERNAL DRAFT REVIEW NOTES',
    '',
    'These are informal notes taken during an internal walkthrough of Chapter 7.',
    'They are NOT educator-review evidence and do not authorise publication of',
    'any section. The formal review route remains the §7.4 Package A and',
    'Package B handoffs.',
    '',
    `Exported: ${new Date().toISOString()}`,
    `Notes: ${notes.length}`,
    '',
  ].join('\n');

  if (notes.length === 0) return `${header}(no notes recorded)\n`;

  const bySection = new Map<string, ReviewNote[]>();
  for (const n of notes) {
    bySection.set(n.officialSectionId, [...(bySection.get(n.officialSectionId) ?? []), n]);
  }

  const body = Array.from(bySection.entries())
    .map(([sectionId, list]) =>
      [
        `## ${sectionId}`,
        ...list.map(
          (n) => `- [${REVIEW_NOTE_CATEGORY_LABEL[n.category]}] ${n.text}`
        ),
      ].join('\n')
    )
    .join('\n\n');

  return `${header}${body}\n`;
}
