// v0.48 §4 + §5 — per-student data isolation.
//
// Every metric surfaced to a student MUST be filtered by that student's
// stable `id`, never by display name. Two students may share a name;
// two devices may reuse names across resets. The correct join key is
// Session.studentId (present since v0.11).
//
// This module wraps the raw loadSessions() call with student-scoped
// helpers and adds pure `findContinueTarget()` and
// `recentActivityForStudent()` selectors used by the shell.

import { loadSessions } from '../../lib/storage';
import { computeSkillProgress } from '../../lib/progression';
import { ITEMS } from '../../data/items';
import { MODULE_FOR_SKILL, MODULE_GRADE, type Grade, type ModuleId, type Session, type SkillId } from '../../types';
import { resolveChapter, type ResolvedChapter } from '../../curriculum/chapterResolver';
import { OFFICIAL_CHAPTERS } from '../../curriculum/officialChapters';
import { staticMappingFor } from '../../curriculum/contentMapping';
import { canLaunchAssessment } from '../../curriculum/inventory';

/** All sessions belonging to a specific student (by ID) and, when
 *  supplied, only completed ones. Never leaks other students. */
export function sessionsForStudent(
  studentId: string,
  { completedOnly = false }: { completedOnly?: boolean } = {}
): Session[] {
  const all = loadSessions();
  return all.filter(
    (s) =>
      s.studentId === studentId &&
      (!completedOnly || Boolean(s.completedAt))
  );
}

/** Filtered variant used by tests to inject sessions directly. */
export function sessionsForStudentIn(
  sessions: Session[],
  studentId: string,
  { completedOnly = false }: { completedOnly?: boolean } = {}
): Session[] {
  return sessions.filter(
    (s) =>
      s.studentId === studentId &&
      (!completedOnly || Boolean(s.completedAt))
  );
}

/** Per-student skill progress. Never mixes students. */
export function progressForStudent(studentId: string) {
  return computeSkillProgress(sessionsForStudent(studentId), ITEMS);
}

export type ContinueTarget = {
  resolved: ResolvedChapter;
  skillId: SkillId | null;
  isResume: boolean;
};

/** v0.48 §5 — the true continue-learning target for a student.
 *
 * Rules (all applied in order):
 *  1. Ignore sessions belonging to any other student ID.
 *  2. Ignore sessions whose skill's module belongs to a different grade
 *     than the student's (defensive — should not happen but guards
 *     against corrupted data).
 *  3. If the most-recent completed session's skill maps to a chapter
 *     that resolves AND can launch, that chapter is the target
 *     (isResume = true).
 *  4. Otherwise, pick the first launchable chapter for the student's
 *     grade in a deterministic order (Fractions first when it applies).
 *     isResume = false — the UI shows "Start learning".
 *  5. If nothing at all is launchable, return null. */
export function findContinueTarget(
  studentId: string,
  studentGrade: Grade,
  {
    sessions = loadSessions(),
    launchableChapterIds,
  }: {
    sessions?: Session[];
    launchableChapterIds?: string[];
  } = {}
): ContinueTarget | null {
  // Only completed sessions for THIS student.
  const mine = sessionsForStudentIn(sessions, studentId, {
    completedOnly: true,
  });

  // Sort newest → oldest.
  const sorted = [...mine].sort(
    (a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)
  );

  for (const s of sorted) {
    // Session.skillId is a SkillMode (union of SkillId | 'mixed' |
    // mixed_module). We only handle real SkillId values for now — a
    // mixed session doesn't point at a single chapter.
    const skill = s.skillId as SkillId;
    if (!(skill in MODULE_FOR_SKILL)) continue;
    const modId = MODULE_FOR_SKILL[skill];
    if (!modId) continue;

    // Cross-grade guard: only if the skill's module belongs to this
    // student's grade.
    if (MODULE_GRADE[modId] !== studentGrade) continue;

    // Try to resolve as a legacy-module chapter first, then as an
    // official chapter if there is one.
    const officialForModule = OFFICIAL_CHAPTERS.find(
      (c) =>
        c.grade === studentGrade &&
        !!staticMappingFor(c.officialChapterId)?.legacyModuleIds.includes(modId)
    );
    const chapterId = officialForModule
      ? `official:${officialForModule.officialChapterId}`
      : `legacy:${modId}`;
    const resolved = resolveChapter(chapterId);
    if (!resolved) continue;
    if (!canLaunchAssessment(resolved.inventory)) continue;
    if (
      launchableChapterIds &&
      !launchableChapterIds.includes(resolved.chapterId)
    ) {
      continue;
    }
    return { resolved, skillId: skill, isResume: true };
  }

  // Fallback: first launchable chapter, if any.
  const fallbackIds = launchableChapterIds ?? [];
  for (const cid of fallbackIds) {
    const resolved = resolveChapter(cid);
    if (resolved && canLaunchAssessment(resolved.inventory)) {
      return { resolved, skillId: null, isResume: false };
    }
  }
  return null;
}

/** Human-friendly recent-activity rows for the Progress tab. */
export function recentActivityForStudent(
  studentId: string,
  { limit = 5 }: { limit?: number } = {}
) {
  return sessionsForStudent(studentId, { completedOnly: true })
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
    .slice(0, limit);
}

// Convenience re-exports so callers only import from one file.
export { MODULE_FOR_SKILL };
export type { Session, SkillId, Grade, ModuleId };
