// Teaching plan (v0.8).
//
// A pure function that turns the device's session history + students into
// a small actionable plan for the next lesson:
//   - top 3 weakest skills across the class
//   - top 3 misconceptions across the class
//   - suggested small groups (students grouped by their personal weakest
//     skill)
//   - recommended reteach skill (the weakest of the weakest)
//   - recommended practice item IDs (from the lessons.practice array of
//     each top-weak skill)
//   - students needing support (any student with at least one weak skill
//     in their device-wide progression)
//
// All thresholds are conservative prototype heuristics. The output is
// surfaced on the Teaching Plan page; it is not a calibrated diagnostic.

import { ITEMS } from '../data/items';
import { LESSONS } from '../data/lessons';
import {
  MISCONCEPTION_LABELS,
  type Item,
  type MisconceptionCode,
} from '../data/items';
import {
  computeSkillProgress,
  type SkillProgress,
} from './progression';
import {
  MODULE_FOR_SKILL,
  SKILL_IDS_ORDERED,
  SKILL_LABELS,
  type ModuleId,
  type Session,
  type SkillId,
  type Student,
} from '../types';

const TOP_N_SKILLS = 3;
const TOP_N_MISCONCEPTIONS = 3;
const WEAK_ACCURACY_THRESHOLD = 0.7;
const MIN_ATTEMPTS_FOR_WEAKNESS = 3;

export type WeakSkill = {
  skillId: SkillId;
  module: ModuleId;
  attempted: number;
  correct: number;
  accuracy: number;
  studentsAffected: number;
};

export type ClassMisconception = {
  code: MisconceptionCode;
  label: string;
  occurrences: number;
  studentsAffected: number;
  // Item IDs where this misconception was triggered, deduped.
  itemIds: string[];
};

export type SmallGroup = {
  // Skill the group should focus on.
  skillId: SkillId;
  studentIds: string[];
  studentNames: string[];
};

export type StudentNeedingSupport = {
  studentId: string;
  name: string;
  // Skills this student is currently weak on (per device-wide progression).
  weakSkills: SkillId[];
  // Most recent session date (ms epoch) — for sorting.
  lastSessionAt: number | null;
};

export type TeachingPlan = {
  generatedAt: number;
  totalCompletedSessions: number;
  totalStudentsWithSessions: number;
  weakestSkills: WeakSkill[];
  topMisconceptions: ClassMisconception[];
  suggestedGroups: SmallGroup[];
  reteachSkill: SkillId | null;       // null when there is no clear focus
  recommendedPracticeItems: string[]; // IDs from lessons.practice arrays
  studentsNeedingSupport: StudentNeedingSupport[];
};

// Compute a class-wide per-skill aggregate (across all students), used to
// pick the weakest skills.
type SkillAcc = {
  attempted: number;
  correct: number;
  studentSet: Set<string>;
};

const findWeakSkillsForStudent = (
  progress: Record<SkillId, SkillProgress>
): SkillId[] => {
  const out: SkillId[] = [];
  for (const s of SKILL_IDS_ORDERED) {
    const p = progress[s];
    // "Weak" for the per-student grouping = enough attempts to judge AND
    // accuracy below the threshold. (We don't include 'not_started' here
    // because not having tried is not the same as struggling.)
    if (
      p.attempted >= MIN_ATTEMPTS_FOR_WEAKNESS &&
      p.accuracy < WEAK_ACCURACY_THRESHOLD
    ) {
      out.push(s);
    }
  }
  return out;
};

export function buildTeachingPlan(
  students: Student[],
  sessions: Session[],
  items: Item[] = ITEMS
): TeachingPlan {
  const itemSkillById = new Map(items.map((it) => [it.id, it.skillId]));

  // ---------------------------------------------------------------------
  // Class-wide per-skill aggregate
  // ---------------------------------------------------------------------
  const perSkill = {} as Record<SkillId, SkillAcc>;
  for (const s of SKILL_IDS_ORDERED) {
    perSkill[s] = { attempted: 0, correct: 0, studentSet: new Set() };
  }
  let totalCompleted = 0;
  const studentsWithSessions = new Set<string>();
  for (const s of sessions) {
    if (s.completedAt === null) continue;
    totalCompleted += 1;
    studentsWithSessions.add(s.studentId);
    for (const r of s.responses) {
      const skill = itemSkillById.get(r.itemId);
      if (!skill) continue;
      const acc = perSkill[skill];
      acc.attempted += 1;
      if (r.correct) acc.correct += 1;
      acc.studentSet.add(s.studentId);
    }
  }

  // ---------------------------------------------------------------------
  // Top weakest skills across the class
  // ---------------------------------------------------------------------
  const weakCandidates: WeakSkill[] = SKILL_IDS_ORDERED.map((s) => {
    const a = perSkill[s];
    return {
      skillId: s,
      module: MODULE_FOR_SKILL[s],
      attempted: a.attempted,
      correct: a.correct,
      accuracy: a.attempted === 0 ? 0 : a.correct / a.attempted,
      studentsAffected: a.studentSet.size,
    };
  })
    .filter((w) => w.attempted >= MIN_ATTEMPTS_FOR_WEAKNESS)
    .sort((a, b) => {
      // Worst accuracy first; tie-break by attempts (more attempts = more
      // confident the weakness is real).
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      return b.attempted - a.attempted;
    });
  const weakestSkills = weakCandidates.slice(0, TOP_N_SKILLS);

  // ---------------------------------------------------------------------
  // Top misconceptions across the class
  // ---------------------------------------------------------------------
  type MisAcc = {
    occurrences: number;
    studentSet: Set<string>;
    itemSet: Set<string>;
  };
  const misMap = new Map<MisconceptionCode, MisAcc>();
  for (const s of sessions) {
    if (s.completedAt === null) continue;
    for (const r of s.responses) {
      if (r.correct) continue;
      if (r.misconceptionTriggered === 'none') continue;
      const entry = misMap.get(r.misconceptionTriggered) ?? {
        occurrences: 0,
        studentSet: new Set<string>(),
        itemSet: new Set<string>(),
      };
      entry.occurrences += 1;
      entry.studentSet.add(s.studentId);
      entry.itemSet.add(r.itemId);
      misMap.set(r.misconceptionTriggered, entry);
    }
  }
  const topMisconceptions: ClassMisconception[] = Array.from(misMap.entries())
    .map(([code, entry]) => ({
      code,
      label: MISCONCEPTION_LABELS[code],
      occurrences: entry.occurrences,
      studentsAffected: entry.studentSet.size,
      itemIds: Array.from(entry.itemSet).sort(),
    }))
    .sort(
      (a, b) =>
        b.occurrences - a.occurrences || b.studentsAffected - a.studentsAffected
    )
    .slice(0, TOP_N_MISCONCEPTIONS);

  // ---------------------------------------------------------------------
  // Suggested small groups
  // ---------------------------------------------------------------------
  // For each student with completed sessions, find their device-wide
  // weakest skills. Group students by the FIRST weak skill in
  // SKILL_IDS_ORDERED order (so the group is anchored by the earliest
  // curriculum-order skill they're stuck on). Skills with only one
  // student aren't shown as a "group".
  const studentById = new Map(students.map((s) => [s.id, s]));
  const groupByFocus = new Map<SkillId, { ids: Set<string>; names: string[] }>();
  for (const studentId of studentsWithSessions) {
    const studentSessions = sessions.filter(
      (sess) => sess.studentId === studentId && sess.completedAt !== null
    );
    const progress = computeSkillProgress(studentSessions, items);
    const weak = findWeakSkillsForStudent(progress);
    if (weak.length === 0) continue;
    const focus = weak[0];
    const entry = groupByFocus.get(focus) ?? {
      ids: new Set<string>(),
      names: [],
    };
    if (!entry.ids.has(studentId)) {
      entry.ids.add(studentId);
      entry.names.push(studentById.get(studentId)?.name ?? '(unknown)');
    }
    groupByFocus.set(focus, entry);
  }
  const suggestedGroups: SmallGroup[] = SKILL_IDS_ORDERED.flatMap((s) => {
    const entry = groupByFocus.get(s);
    if (!entry || entry.ids.size < 2) return [];
    return [
      {
        skillId: s,
        studentIds: Array.from(entry.ids),
        studentNames: [...entry.names].sort((a, b) => a.localeCompare(b)),
      },
    ];
  });

  // ---------------------------------------------------------------------
  // Reteach skill + recommended practice items
  // ---------------------------------------------------------------------
  const reteachSkill = weakestSkills[0]?.skillId ?? null;

  // Up to 6 practice item IDs: take 3 from each of the top 2 weak skills
  // (or 6 from the only weak skill if there is one).
  const recommendedPracticeItems: string[] = [];
  const skillsForPractice = weakestSkills.slice(0, 2);
  if (skillsForPractice.length === 1) {
    const lesson = LESSONS[skillsForPractice[0].skillId];
    recommendedPracticeItems.push(...lesson.practice.slice(0, 6));
  } else {
    for (const w of skillsForPractice) {
      const lesson = LESSONS[w.skillId];
      recommendedPracticeItems.push(...lesson.practice.slice(0, 3));
    }
  }

  // ---------------------------------------------------------------------
  // Students needing support
  // ---------------------------------------------------------------------
  const studentsNeedingSupport: StudentNeedingSupport[] = [];
  for (const student of students) {
    const studentSessions = sessions.filter(
      (sess) => sess.studentId === student.id && sess.completedAt !== null
    );
    if (studentSessions.length === 0) continue;
    const progress = computeSkillProgress(studentSessions, items);
    const weak = findWeakSkillsForStudent(progress);
    if (weak.length === 0) continue;
    const lastSessionAt = studentSessions
      .map((s) => s.completedAt ?? 0)
      .reduce((a, b) => Math.max(a, b), 0);
    studentsNeedingSupport.push({
      studentId: student.id,
      name: student.name,
      weakSkills: weak,
      lastSessionAt,
    });
  }
  studentsNeedingSupport.sort(
    (a, b) =>
      b.weakSkills.length - a.weakSkills.length ||
      (b.lastSessionAt ?? 0) - (a.lastSessionAt ?? 0) ||
      a.name.localeCompare(b.name)
  );

  return {
    generatedAt: Date.now(),
    totalCompletedSessions: totalCompleted,
    totalStudentsWithSessions: studentsWithSessions.size,
    weakestSkills,
    topMisconceptions,
    suggestedGroups,
    reteachSkill,
    recommendedPracticeItems,
    studentsNeedingSupport,
  };
}

// Convenience: a short human-readable label for the weakestSkills row.
export const labelWeakSkill = (w: WeakSkill): string =>
  `${w.skillId} — ${SKILL_LABELS[w.skillId]} (${Math.round(
    w.accuracy * 100
  )}% over ${w.attempted} attempts, ${w.studentsAffected} student${w.studentsAffected === 1 ? '' : 's'})`;
