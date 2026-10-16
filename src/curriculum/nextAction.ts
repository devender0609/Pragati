// v0.72 §15 — ONE SOURCE OF TRUTH FOR "WHAT DO I DO NEXT?"
//
// THE PROBLEM THIS CLOSES
//
// Four student surfaces each answered this question with their own
// logic — Home, the Fractions landing, Practice and Progress — and they
// disagreed. v0.71.1 shipped two visible consequences:
//
//   The Fractions landing said "START NEXT · 7.2 Fractional Units as
//   Parts of a Whole" while §7.2's own row said Coming soon.
//
//   Progress said "Start: 7.2 ..." above "0 parts started", pointing at
//   an official section with no published lesson.
//
// Both were TRUE of what would open — legacy related practice — and
// FALSE about what the label promised. A student tapping "7.2
// Fractional Units as Parts of a Whole" expects §7.2 of their textbook.
//
// THE FIX
//
// One selector. It returns the KIND of activity explicitly, so a caller
// cannot render a legacy practice activity under an official section
// title without deliberately ignoring the field that says otherwise.
// The student-facing label is computed HERE, from the kind, so no
// screen invents its own wording.

import { sectionsForChapter } from './officialSections';
import { OFFICIAL_CHAPTERS } from './officialChapters';
import {
  openableSectionTarget,
  legacyPracticeName,
} from './sectionRouting';
import { sectionProgressForChapter } from './sectionProgress';
import type { Session } from '../types';

export type NextActionKind =
  /** A reviewed, published official-section lesson. None exist yet. */
  | 'official_learn'
  /** Published official-section practice. None exist yet. */
  | 'official_practice'
  /** A legacy skill activity: real, related, NOT this section's lesson. */
  | 'related_legacy_practice'
  /** Work set by a teacher. */
  | 'teacher_assignment'
  /** Nothing is available. A correct answer, not a failure. */
  | 'none';

export type NextAction = {
  kind: NextActionKind;
  officialChapterId: string | null;
  /**
   * Set ONLY for official_* kinds.
   *
   * Deliberately null for `related_legacy_practice`, even though the
   * route is reached through a section id: the activity is not that
   * section's content, and exposing the id here is what let two screens
   * label a legacy activity with an official section title.
   */
  officialSectionId: string | null;
  /** The route argument the caller passes to its open handler. */
  activityId: string | null;
  /** Student-facing. Computed here so no screen writes its own. */
  label: string;
  /** The verb. "Continue" only where there is real unfinished work. */
  verb: 'Start' | 'Continue' | null;
  /** One line explaining what this actually is, where that is not obvious. */
  qualifier: string | null;
};

export const NO_ACTION: NextAction = {
  kind: 'none',
  officialChapterId: null,
  officialSectionId: null,
  activityId: null,
  label: 'Nothing to open yet',
  verb: null,
  qualifier: null,
};

/**
 * The next action for a chapter.
 *
 * Order of preference: unfinished official work, then new official work,
 * then related legacy practice. Official content always outranks legacy
 * content — but since no official section is published, today this
 * always returns `related_legacy_practice` or `none`, and it says so.
 */
export function nextActionForChapter(
  officialChapterId: string,
  sessions: Session[]
): NextAction {
  const sections = sectionsForChapter(officialChapterId);
  if (sections.length === 0) return NO_ACTION;

  const progress = sectionProgressForChapter(officialChapterId, sessions);
  const stateOf = (id: string) =>
    progress.find((p) => p.officialSectionId === id)?.state ?? 'not_started';

  const official = sections
    .map((s) => ({ s, t: openableSectionTarget(s.officialSectionId) }))
    .filter((x) => x.t?.provenance === 'official_section_content');

  // Official work, resumed then started.
  const resumable = official.find((x) => stateOf(x.s.officialSectionId) === 'in_progress');
  const startable = official.find((x) => stateOf(x.s.officialSectionId) === 'not_started');
  const pick = resumable ?? startable;
  if (pick) {
    return {
      kind: 'official_learn',
      officialChapterId,
      officialSectionId: pick.s.officialSectionId,
      activityId: pick.s.officialSectionId,
      label: `${pick.s.sectionNumber} ${pick.s.exactTitle}`,
      verb: resumable ? 'Continue' : 'Start',
      qualifier: null,
    };
  }

  // Related legacy practice. Named for what it is.
  const legacy = sections
    .map((s) => ({ s, t: openableSectionTarget(s.officialSectionId) }))
    .find((x) => x.t?.kind === 'legacy_skill_lesson');
  if (legacy?.t?.skillId) {
    return {
      kind: 'related_legacy_practice',
      officialChapterId,
      // NOT the section id. This activity is not that section's content,
      // and carrying the id here is exactly how it came to be labelled
      // with an official section title on two screens.
      officialSectionId: null,
      activityId: legacy.s.officialSectionId,
      label: legacyPracticeName(legacy.t.skillId),
      verb: 'Start',
      qualifier: 'Related practice — not a chapter lesson',
    };
  }

  return { ...NO_ACTION, officialChapterId };
}

/**
 * True when a label may name an official textbook section.
 *
 * A guard for tests and for callers: only official kinds have earned
 * the right to put a section number in front of a student.
 */
export function mayUseOfficialSectionLabel(a: NextAction): boolean {
  return a.kind === 'official_learn' || a.kind === 'official_practice';
}

/** Human-readable chapter title, for surfaces that show context. */
export function chapterTitleFor(officialChapterId: string): string | null {
  return (
    OFFICIAL_CHAPTERS.find((c) => c.officialChapterId === officialChapterId)
      ?.officialTitle ?? null
  );
}
