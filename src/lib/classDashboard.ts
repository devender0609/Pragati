// Class-level aggregator. Pure functions over the localStorage records so
// the teacher dashboard can render a single roll-up across every student
// without re-doing the work in the component.
//
// Everything here is read-only. We never write to storage from this module.
//
// Notes on language:
//   - "average accuracy" is the unweighted mean of per-response correctness
//     across every completed session. It is NOT a calibrated proficiency.
//   - "most difficult items" sorts by the actual proportion of students who
//     got the item wrong; sample sizes can be very small in a pilot, so the
//     UI surfaces the attempt count alongside the rate.
//
// v0.4: an optional skill filter scopes the aggregate to a single skill
// bank by:
//   - dropping responses to items that aren't in that bank, AND
//   - dropping sessions whose mode disagrees with the selected skill
//     (so a student in a mixed session is still partially reflected via
//     their matching responses, but a single-skill session for a
//     different skill does not contaminate the view).
// The default ('all') reproduces the v0.3 behaviour exactly.
//
// v0.7: the filter accepts a ModuleId too — `module:fractions`,
// `module:decimals`, etc. — which scopes by the module of the item /
// session rather than a single skill.

import {
  ITEMS,
  MISCONCEPTION_LABELS,
  type Item,
  type MisconceptionCode,
} from '../data/items';
import {
  MODULE_FOR_SKILL,
  moduleForSkillMode,
  type ModuleId,
  type Session,
  type SkillId,
  type Student,
} from '../types';

export type ClassSkillFilter =
  | { kind: 'all' }
  | { kind: 'skill'; skillId: SkillId }
  | { kind: 'module'; moduleId: ModuleId };

// Convenience constructors so call-sites don't have to remember the shape.
export const filterAll = (): ClassSkillFilter => ({ kind: 'all' });
export const filterSkill = (s: SkillId): ClassSkillFilter => ({
  kind: 'skill',
  skillId: s,
});
export const filterModule = (m: ModuleId): ClassSkillFilter => ({
  kind: 'module',
  moduleId: m,
});

// Encode/decode a filter as a string for use in select dropdowns.
//   'all'       → all
//   skill ID    → that skill
//   'module:fractions' etc.
export const filterToValue = (f: ClassSkillFilter): string => {
  if (f.kind === 'all') return 'all';
  if (f.kind === 'skill') return f.skillId;
  return `module:${f.moduleId}`;
};

export const filterFromValue = (v: string): ClassSkillFilter => {
  if (v === 'all') return filterAll();
  if (v.startsWith('module:')) {
    return filterModule(v.slice('module:'.length) as ModuleId);
  }
  return filterSkill(v as SkillId);
};

export type ClassMisconceptionRow = {
  code: MisconceptionCode;
  label: string;
  occurrences: number;            // total response-level hits across the class
  studentCount: number;           // unique students who hit this at least once
  students: Array<{ studentId: string; name: string; count: number }>;
};

export type ClassHardestItem = {
  itemId: string;
  stem: string;
  band: 'foundational' | 'core' | 'advanced';
  difficulty: number;
  attempts: number;
  correct: number;
  accuracy: number;               // 0..1
  avgTimeSec: number;
};

export type ClassAggregate = {
  totalStudents: number;
  studentsWithSessions: number;
  totalSessions: number;
  totalResponses: number;
  averageAccuracy: number;        // 0..1; over completed responses
  averageTimeSecPerItem: number;  // seconds per response
  misconceptionRows: ClassMisconceptionRow[];
  hardestItems: ClassHardestItem[];
  skillFilter: ClassSkillFilter;
};

export function buildClassAggregate(
  students: Student[],
  sessions: Session[],
  items: Item[] = ITEMS,
  skillFilter: ClassSkillFilter = filterAll()
): ClassAggregate {
  const itemsById = new Map(items.map((i) => [i.id, i]));

  // Item-level: does this response's item belong to the filter?
  const matchesSkill = (itemId: string): boolean => {
    if (skillFilter.kind === 'all') return true;
    const it = itemsById.get(itemId);
    if (!it) return false;
    if (skillFilter.kind === 'skill') {
      return it.skillId === skillFilter.skillId;
    }
    // module
    return MODULE_FOR_SKILL[it.skillId] === skillFilter.moduleId;
  };

  // Session-level: should this session be eligible at all?
  // - 'all' mode → always include
  // - skill filter → include if session is that skill, OR a mixed session
  //   that may contain responses to it (full-mixed or that skill's module).
  // - module filter → include if the session's mode is that module's mixed,
  //   that module's full-mixed, or any single skill in that module, plus
  //   the across-everything 'mixed'.
  const sessionMatchesSkill = (s: Session): boolean => {
    if (skillFilter.kind === 'all') return true;
    if (s.skillId === 'mixed') return true;
    const sessionModule = moduleForSkillMode(s.skillId);
    if (skillFilter.kind === 'skill') {
      // single-skill session, only matches if the skill matches; any
      // mixed-within-module session matches if the skill is in that module
      if (s.skillId === skillFilter.skillId) return true;
      if (sessionModule === MODULE_FOR_SKILL[skillFilter.skillId]) return true;
      return false;
    }
    // module filter: include any session whose module is the chosen module
    return sessionModule === skillFilter.moduleId;
  };

  const completed = sessions.filter(
    (s) => s.completedAt !== null && sessionMatchesSkill(s)
  );

  const studentById = new Map(students.map((s) => [s.id, s]));
  const studentIdsWithSessions = new Set(completed.map((s) => s.studentId));

  // Flatten every response with its student id for downstream aggregation.
  // When a skill filter is active, responses to items outside the selected
  // skill are dropped here.
  type Flat = { studentId: string } & Session['responses'][number];
  const flat: Flat[] = [];
  for (const session of completed) {
    for (const r of session.responses) {
      if (!matchesSkill(r.itemId)) continue;
      flat.push({ studentId: session.studentId, ...r });
    }
  }

  const totalResponses = flat.length;
  const totalCorrect = flat.filter((r) => r.correct).length;
  const totalTimeMs = flat.reduce((sum, r) => sum + r.timeMs, 0);

  const averageAccuracy = totalResponses === 0 ? 0 : totalCorrect / totalResponses;
  const averageTimeSecPerItem =
    totalResponses === 0 ? 0 : Math.round(totalTimeMs / totalResponses / 1000);

  // ---------------------------------------------------------------------
  // Misconception distribution
  // ---------------------------------------------------------------------
  // For each non-'none' misconception, count occurrences and the unique set
  // of students who triggered it.
  type MisAccum = {
    occurrences: number;
    perStudent: Map<string, number>;
  };
  const misMap = new Map<MisconceptionCode, MisAccum>();
  for (const r of flat) {
    if (r.correct) continue;
    const code = r.misconceptionTriggered;
    if (code === 'none') continue;
    const entry = misMap.get(code) ?? {
      occurrences: 0,
      perStudent: new Map<string, number>(),
    };
    entry.occurrences += 1;
    entry.perStudent.set(
      r.studentId,
      (entry.perStudent.get(r.studentId) ?? 0) + 1
    );
    misMap.set(code, entry);
  }

  const misconceptionRows: ClassMisconceptionRow[] = Array.from(misMap.entries())
    .map(([code, entry]) => {
      const studentList = Array.from(entry.perStudent.entries())
        .map(([studentId, count]) => ({
          studentId,
          name: studentById.get(studentId)?.name ?? '(unknown)',
          count,
        }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      return {
        code,
        label: MISCONCEPTION_LABELS[code],
        occurrences: entry.occurrences,
        studentCount: studentList.length,
        students: studentList,
      };
    })
    .sort(
      (a, b) =>
        b.occurrences - a.occurrences || b.studentCount - a.studentCount
    );

  // ---------------------------------------------------------------------
  // Hardest items
  // ---------------------------------------------------------------------
  // Per item: total attempts across the class, accuracy, average time.
  // Sort by accuracy ascending; tie-break by attempts descending so a
  // 0/4 item ranks above a 0/1 item.
  type ItemAccum = {
    item: Item;
    attempts: number;
    correct: number;
    timeMs: number;
  };
  const itemAccum = new Map<string, ItemAccum>();
  for (const r of flat) {
    const item = itemsById.get(r.itemId);
    if (!item) continue; // an item was removed from the bank since the response
    const entry = itemAccum.get(r.itemId) ?? {
      item,
      attempts: 0,
      correct: 0,
      timeMs: 0,
    };
    entry.attempts += 1;
    if (r.correct) entry.correct += 1;
    entry.timeMs += r.timeMs;
    itemAccum.set(r.itemId, entry);
  }

  const hardestItems: ClassHardestItem[] = Array.from(itemAccum.values())
    .map((e) => ({
      itemId: e.item.id,
      stem: e.item.stem,
      band: e.item.band,
      difficulty: e.item.difficulty,
      attempts: e.attempts,
      correct: e.correct,
      accuracy: e.attempts === 0 ? 0 : e.correct / e.attempts,
      avgTimeSec: e.attempts === 0 ? 0 : Math.round(e.timeMs / e.attempts / 1000),
    }))
    .sort(
      (a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts
    );

  return {
    totalStudents: students.length,
    studentsWithSessions: studentIdsWithSessions.size,
    totalSessions: completed.length,
    totalResponses,
    averageAccuracy,
    averageTimeSecPerItem,
    misconceptionRows,
    hardestItems,
    skillFilter,
  };
}
