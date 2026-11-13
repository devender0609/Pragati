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
  | { ok: false; reason: string; readiness?: ChapterCheckReadiness };

export type ChapterCheckReadiness = {
  ready: boolean;
  reason: string;
  /** Required skills with no eligible item at all. */
  missingRequiredSkillIds: string[];
  /** Distinct required skills the pool can actually sample. */
  coveredSkillCount: number;
  requiredSkillCount: number;
  administrableItemCount: number;
  requestedItemCount: number;
};

/** Student-facing message when a chapter check cannot run. Deliberately
 *  identical regardless of which condition failed — a child does not
 *  need to know which skill's item bank is thin. */
export const CHAPTER_CHECK_NOT_READY =
  "Chapter check isn't ready yet. You can keep practising this chapter.";

/**
 * §4 — decide whether a chapter check may launch.
 *
 * Conditions, all required:
 *   - every required skill has at least one eligible item;
 *   - the pool samples every required skill;
 *   - the pool reaches targetItemCount, OR the blueprint declares an
 *     explicit `minimumItemCount` and the pool reaches that.
 */
export function chapterCheckReadiness(
  plan: ChapterSessionPlan,
  blueprint: ChapterBlueprint
): ChapterCheckReadiness {
  const requiredSkillCount = blueprint.requiredSkillIds.length;
  const coveredSkillCount = blueprint.requiredSkillIds.filter((s) =>
    plan.sampledSkillIds.includes(s)
  ).length;
  const floor = blueprint.minimumItemCount ?? plan.requestedItemCount;

  const base = {
    missingRequiredSkillIds: plan.missingRequiredSkillIds,
    coveredSkillCount,
    requiredSkillCount,
    administrableItemCount: plan.pool.length,
    requestedItemCount: plan.requestedItemCount,
  };

  if (plan.missingRequiredSkillIds.length > 0) {
    return { ...base, ready: false, reason: CHAPTER_CHECK_NOT_READY };
  }
  if (coveredSkillCount < requiredSkillCount) {
    return { ...base, ready: false, reason: CHAPTER_CHECK_NOT_READY };
  }
  if (plan.pool.length < floor) {
    return { ...base, ready: false, reason: CHAPTER_CHECK_NOT_READY };
  }
  return { ...base, ready: true, reason: '' };
}

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

  // v0.50 §4 — chapter-check readiness. A check is a claim about the
  // WHOLE chapter, so it may not launch on a partial item bank. v0.49
  // would happily administer a "chapter check" that sampled two of
  // seven required skills; the resulting session then looked like a
  // full check in every report.
  //
  // Practice is deliberately exempt: partial coverage is fine when the
  // session does not claim chapter-level coverage.
  if (purpose === 'chapter_check') {
    const readiness = chapterCheckReadiness(plan, blueprint);
    if (!readiness.ready) {
      return { ok: false, reason: readiness.reason, readiness };
    }
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
    // v0.50 §1 — resume state, written at creation so a session is
    // resumable from the very first question.
    lifecycle: 'in_progress',
    lastActivityAt: now,
    resumePoolItemIds: plan.pool.map((i) => i.id),
    resumeCurrentIndex: 0,
    resumeAbility: 5,
    resumeAttemptedIds: [],
    resumeChapterId: plan.chapterId,
    // v0.50 §4 — coverage audit fields.
    requestedItemCount: plan.requestedItemCount,
    administeredItemCount: 0,
    ...(plan.missingRequiredSkillIds.length > 0
      ? { missingRequiredSkillIdsAtLaunch: plan.missingRequiredSkillIds }
      : {}),
  };

  return { ok: true, session, pool: plan.pool, plan };
}
