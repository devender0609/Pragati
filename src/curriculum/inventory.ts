// v0.47 D — Derived chapter-readiness inventory.
//
// Computes chapter-level readiness from actual content, not from a
// manually assigned flag. Fixes the v0.46 gap where CHAPTER_CATALOGUE
// rows carried a `contentStatus` string that could drift from reality.
//
// Rules (deliberately strict — do NOT let synthesised lessons or a
// prototype-item bank inflate readiness):
//
//   no_content              → 0 skills mapped OR 0 items.
//   shell                   → skills exist but no items AND no lessons.
//   assessment_prototype    → items exist but 0 hand-authored lessons.
//   lesson_prototype        → hand-authored lessons exist but < min items.
//   partial_prototype       → items + some (< all) hand-authored lessons.
//   prototype_ready_review  → items ≥ min per skill AND every skill has
//                             a hand-authored lesson AND ≥ 1 worked
//                             example per authored lesson AND blueprint
//                             available. Nothing beyond this is auto-
//                             assigned; it requires a human upgrade via
//                             teacher approvals (below).
//   teacher_reviewed        → ≥ APPROVAL_THRESHOLD of items teacher-
//                             approved (via v0.43 itemApprovals).
//   pilot_ready             → same + pilot flag set (manual gate).
//   published               → manual gate.

import { approvedItemIds } from '../lib/itemApprovals';
import { ITEMS } from '../data/items';
import { getBlueprints } from './registry';
import type { OfficialChapterRecord } from './officialChapters';
import {
  buildContentMapping,
  staticMappingFor,
  type PragatiContentMapping,
  type StaticMappingRow,
} from './contentMapping';

export type DerivedStatus =
  | 'no_content'
  | 'shell'
  | 'assessment_prototype'
  | 'lesson_prototype'
  | 'partial_prototype'
  | 'prototype_ready_review'
  | 'teacher_reviewed'
  | 'pilot_ready'
  | 'published';

/** v0.50 §5 — what a CHILD sees. The authoring vocabulary below
 *  ('prototype', 'ready for review', 'shell') describes Pragati's
 *  build state and is meaningless — and slightly alarming — to a
 *  student. These labels describe what the student can DO instead.
 *
 *  DERIVED_STATUS_LABEL is retained unchanged for Teacher Resources
 *  and Admin & Research, which genuinely need the build state. */
export const STUDENT_STATUS_LABEL: Record<DerivedStatus, string> = {
  no_content: 'Coming soon',
  shell: 'Coming soon',
  assessment_prototype: 'Practice available',
  lesson_prototype: 'Lessons available',
  partial_prototype: 'Ready to learn',
  prototype_ready_review: 'Ready to learn',
  teacher_reviewed: 'Ready to learn',
  pilot_ready: 'Ready to learn',
  published: 'Ready to learn',
};

export const DERIVED_STATUS_LABEL: Record<DerivedStatus, string> = {
  no_content: 'No content',
  shell: 'Shell only',
  assessment_prototype: 'Assessment prototype',
  lesson_prototype: 'Lesson prototype',
  partial_prototype: 'Partial prototype',
  prototype_ready_review: 'Prototype — ready for review',
  teacher_reviewed: 'Teacher reviewed',
  pilot_ready: 'Pilot-ready',
  published: 'Published',
};

/** Minimum items per skill required to graduate past
 *  `assessment_prototype` / `lesson_prototype`. Deliberately modest
 *  because chapters can be small; tune per grade later. */
export const MIN_ITEMS_PER_SKILL = 3;
/** Fraction of items in the chapter that must be teacher-approved
 *  to reach `teacher_reviewed`. Matches v0.43 default. */
export const APPROVAL_THRESHOLD = 0.75;

/** v0.48 §7 — measurements that Pragati has NOT yet computed are
 *  represented explicitly as `'not_measured'` rather than a silent 0.
 *  The readiness function ignores `'not_measured'` values so a chapter
 *  cannot become prototype-ready on placeholder counts. */
export type Measurement<T = number> = T | 'not_measured';

export type ChapterInventory = {
  officialChapterId: string;
  mapping: PragatiContentMapping;

  // --- Measured counts (real values from actual content) ---
  registeredSkillCount: number;
  itemsPerSkill: Record<string, number>;
  totalItemCount: number;
  handAuthoredLessonCount: number;
  synthesisedLessonCount: number;
  workedExampleCount: number;
  teacherApprovedItemCount: number;
  approvalRatio: number;

  /** v0.48 §7: derived from the registry, not from itemCount. */
  blueprintAvailable: boolean;
  /** v0.48 §7: the actual registered blueprint IDs for this chapter's
   *  mapped modules. Empty when none is registered. */
  registeredBlueprintIds: string[];

  // --- Not-yet-measured counts (explicit) ---
  /** Number of hand-authored visual assets. Not yet indexed. */
  visualCount: Measurement<number>;
  guidedPracticeItemCount: Measurement<number>;
  independentPracticeItemCount: Measurement<number>;
  unresolvedValidationErrors: Measurement<number>;

  status: DerivedStatus;
  /** Human-readable reasons the status is what it is (used by the
   *  coverage UI tooltip). */
  reasons: string[];
};

/** Manual gates — filled by future config. For v0.47 we always return
 *  false so no chapter can auto-claim pilot_ready or published. */
function isPilotReady(_officialChapterId: string): boolean {
  return false;
}
function isPublished(_officialChapterId: string): boolean {
  return false;
}

/** v0.48 §1 — pure function form. Takes an explicit staticRow so
 *  callers (in particular the shell's synthetic-legacy path) don't
 *  need to mutate STATIC_MAPPING at render time. */
export function inventoryChapterWith(
  official: OfficialChapterRecord,
  staticRow: StaticMappingRow | undefined
): ChapterInventory {
  const mapping = buildContentMapping(official, staticRow);

  const itemsPerSkill: Record<string, number> = {};
  for (const s of mapping.skillIds) {
    itemsPerSkill[s] = ITEMS.filter((it) => it.skillId === s).length;
  }
  const totalItemCount = Object.values(itemsPerSkill).reduce(
    (a, b) => a + b,
    0
  );

  const approved = new Set(approvedItemIds());
  const teacherApprovedItemCount = ITEMS.filter(
    (it) =>
      mapping.skillIds.includes(it.skillId as never) && approved.has(it.id)
  ).length;
  const approvalRatio =
    totalItemCount === 0 ? 0 : teacherApprovedItemCount / totalItemCount;

  // v0.48 §7 — real blueprint availability, not itemCount > 0.
  // A blueprint counts as available if it targets at least one of
  // this chapter's mapped legacy modules.
  const gradeIdForRegistry = gradeToRegistryGrade(official.grade);
  const registeredBlueprintIds: string[] = [];
  if (gradeIdForRegistry) {
    const all = getBlueprints(gradeIdForRegistry, 'mathematics');
    for (const bp of all) {
      const touchesChapter = (bp.moduleIds ?? []).some((mid) =>
        mapping.legacyModuleIds.some((legacy) => mid.endsWith(`_${legacy}`))
      );
      if (touchesChapter) registeredBlueprintIds.push(bp.id);
    }
  }
  const blueprintAvailable = registeredBlueprintIds.length > 0;

  const reasons: string[] = [];

  // --- derive status ---
  let status: DerivedStatus;

  if (mapping.skillIds.length === 0) {
    status = 'no_content';
    reasons.push('No Pragati module maps to this chapter.');
  } else if (totalItemCount === 0 && mapping.handAuthoredLessonCount === 0) {
    status = 'shell';
    reasons.push('Skills registered but no items and no authored lessons.');
  } else if (
    totalItemCount > 0 &&
    mapping.handAuthoredLessonCount === 0
  ) {
    status = 'assessment_prototype';
    reasons.push('Items exist but no hand-authored lessons.');
  } else if (
    totalItemCount === 0 &&
    mapping.handAuthoredLessonCount > 0
  ) {
    status = 'lesson_prototype';
    reasons.push('Hand-authored lessons exist but no assessment items.');
  } else {
    // Both items and lessons exist. Decide between partial and ready.
    const everySkillHasLesson =
      mapping.handAuthoredLessonCount === mapping.skillIds.length;
    const everySkillHasMinItems = Object.values(itemsPerSkill).every(
      (n) => n >= MIN_ITEMS_PER_SKILL
    );
    const everyLessonHasWorkedExample =
      mapping.handAuthoredLessonCount > 0 &&
      mapping.workedExampleCount >= mapping.handAuthoredLessonCount;

    if (!everySkillHasLesson || !everySkillHasMinItems || !everyLessonHasWorkedExample) {
      status = 'partial_prototype';
      if (!everySkillHasLesson) {
        reasons.push(
          `${mapping.skillIds.length - mapping.handAuthoredLessonCount} of ${mapping.skillIds.length} skills have no hand-authored lesson (synthesised fallback does not count).`
        );
      }
      if (!everySkillHasMinItems) {
        const short = Object.entries(itemsPerSkill).filter(
          ([, n]) => n < MIN_ITEMS_PER_SKILL
        );
        reasons.push(
          `${short.length} skill(s) have fewer than ${MIN_ITEMS_PER_SKILL} items.`
        );
      }
      if (!everyLessonHasWorkedExample) {
        reasons.push(
          'At least one authored lesson has no worked example.'
        );
      }
    } else if (!blueprintAvailable) {
      status = 'partial_prototype';
      reasons.push('No blueprint registered for the mapped modules.');
    } else {
      status = 'prototype_ready_review';
      reasons.push(
        `All ${mapping.skillIds.length} skills have hand-authored lessons and ≥ ${MIN_ITEMS_PER_SKILL} items.`
      );
    }
  }

  // Teacher-approval / pilot / published upgrades layered on top.
  if (status === 'prototype_ready_review' && approvalRatio >= APPROVAL_THRESHOLD) {
    status = 'teacher_reviewed';
    reasons.push(
      `${teacherApprovedItemCount}/${totalItemCount} items teacher-approved (≥ ${Math.round(APPROVAL_THRESHOLD * 100)}%).`
    );
  }
  if (status === 'teacher_reviewed' && isPilotReady(official.officialChapterId)) {
    status = 'pilot_ready';
  }
  if (status === 'pilot_ready' && isPublished(official.officialChapterId)) {
    status = 'published';
  }

  return {
    officialChapterId: official.officialChapterId,
    mapping,
    registeredSkillCount: mapping.skillIds.length,
    itemsPerSkill,
    totalItemCount,
    handAuthoredLessonCount: mapping.handAuthoredLessonCount,
    synthesisedLessonCount: mapping.synthesisedLessonCount,
    workedExampleCount: mapping.workedExampleCount,
    teacherApprovedItemCount,
    approvalRatio,
    blueprintAvailable,
    registeredBlueprintIds,
    // v0.48 §7 — represent unmeasured values explicitly.
    visualCount: 'not_measured',
    guidedPracticeItemCount: 'not_measured',
    independentPracticeItemCount: 'not_measured',
    unresolvedValidationErrors: 'not_measured',
    status,
    reasons,
  };
}

/** Convenience wrapper — kept for callers that don't care about the
 *  static-row plumbing. */
export function inventoryChapter(
  official: OfficialChapterRecord
): ChapterInventory {
  return inventoryChapterWith(
    official,
    staticMappingFor(official.officialChapterId)
  );
}

// GradeId in the registry uses `grade_01..grade_12`; the app's
// `Grade` uses `class1..class12`. Convert without inventing values.
function gradeToRegistryGrade(g: OfficialChapterRecord['grade']): string {
  const n = parseInt(g.replace('class', ''), 10);
  if (!Number.isFinite(n) || n < 1 || n > 12) return '';
  return `grade_${String(n).padStart(2, '0')}`;
}

/** True if a student can meaningfully launch practice / assessment
 *  for this chapter (guards against zero-item launches). */
export function canLaunchAssessment(inventory: ChapterInventory): boolean {
  return inventory.totalItemCount > 0 && inventory.blueprintAvailable;
}
