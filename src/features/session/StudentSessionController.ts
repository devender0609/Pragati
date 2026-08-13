// v0.49 §3 + §12 — StudentSessionController.
//
// Turns a ChapterBlueprint + a SessionPurpose into a ready-to-run
// Session plus its item pool. Extracted from App.tsx so the launch
// rules are testable without mounting the app, and so App.tsx's
// launcher shrinks to "call this, then set state".
//
// This is the seam where §3's requirement lands: the returned Session
// carries blueprintId, blueprintVersion, purpose, sampledSkillIds, and
// the chapter/module id, so a stored session can be audited later.

import type { Item } from '../../data/items';
import type { Session, Student } from '../../types';
import type { ChapterBlueprint } from '../../curriculum/chapterBlueprints';
import {
  buildChapterSessionPlan,
  type ChapterSessionPlan,
} from './chapterSessionBuilder';
import type { SessionPurpose } from './sessionPurpose';

export type StartChapterSessionArgs = {
  student: Student;
  blueprint: ChapterBlueprint;
  purpose: SessionPurpose;
  items: Item[];
  priorAttemptedIds?: string[];
  /** ms epoch; injected so tests are deterministic. */
  now?: number;
  /** Injected id generator; injected so tests are deterministic. */
  newId: () => string;
  /** Optional pilot / classroom context stamped onto the session. */
  pilotId?: string;
  classroomId?: string;
  academicYear?: string;
  /** The legacy SkillMode value. Kept because every existing report,
   *  scoring path, and stored record keys off `Session.skillId`. */
  legacySkillMode: Session['skillId'];
};

export type StartChapterSessionResult =
  | { ok: true; session: Session; pool: Item[]; plan: ChapterSessionPlan }
  | { ok: false; reason: string };

/** Minimum items we are willing to administer. Below this the session
 *  is not worth starting and the caller must show the reason instead
 *  of opening an empty or near-empty assessment. */
export const MIN_ADMINISTRABLE_ITEMS = 1;

export function startChapterSession(
  args: StartChapterSessionArgs
): StartChapterSessionResult {
  const {
    student, blueprint, purpose, items, priorAttemptedIds = [],
    now = Date.now(), newId, pilotId, classroomId, academicYear,
    legacySkillMode,
  } = args;

  const plan = buildChapterSessionPlan({
    blueprint,
    purpose,
    items,
    priorAttemptedIds,
  });

  // §11 zero-item protection. One guard, one message, no partial start.
  if (plan.pool.length < MIN_ADMINISTRABLE_ITEMS) {
    return {
      ok: false,
      reason:
        'This chapter has no questions ready yet. Try another chapter, or ask your teacher.',
    };
  }

  const session: Session = {
    id: newId(),
    studentId: student.id,
    studentSnapshot: {
      name: student.name,
      grade: student.grade,
      school: student.school,
      ...(student.curriculumId ? { curriculumId: student.curriculumId } : {}),
      ...(student.gradeId ? { gradeId: student.gradeId } : {}),
      ...(student.subjectId ? { subjectId: student.subjectId } : {}),
      ...(academicYear ? { academicYear } : {}),
    },
    window: 'practice',
    skillId: legacySkillMode,
    startedAt: now,
    completedAt: null,
    responses: [],
    finalAbility: 5,
    ...(pilotId ? { pilotId } : {}),
    // v0.49 chapter-session snapshot.
    sessionPurpose: purpose,
    chapterBlueprintId: plan.blueprintId,
    chapterBlueprintVersion: plan.blueprintVersion,
    sampledSkillIds: plan.sampledSkillIds,
    chapterId: plan.chapterId,
    chapterModuleId: plan.moduleId,
    ...(classroomId ? { classroomId } : {}),
    ...(academicYear ? { academicYear } : {}),
  };

  return { ok: true, session, pool: plan.pool, plan };
}
