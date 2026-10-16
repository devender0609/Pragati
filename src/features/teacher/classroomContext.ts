// v0.53 §10 — Teacher classroom context.
//
// THE DEFECT
//
// TeacherShell defaulted `teacherClassroomId` to null, which renders as
// "All local data (aggregate)". v0.50 §8 had already decided aggregate
// must be an explicit secondary choice, and v0.52's screenshot review
// found it still defaulting. A teacher with one class was being shown a
// device-wide aggregate labelled as their working context.
//
// Selection rules, in order:
//   0 classrooms  -> null, with an empty state (nothing to aggregate).
//   1 classroom   -> select it. There is no ambiguity to resolve.
//   many          -> the most recently used, if that is recorded and
//                    still valid; otherwise null WITH `mustChoose`, so
//                    the UI asks rather than silently aggregating.

export type ClassroomOption = { id: string; name: string };

export type ClassroomContextResolution = {
  selectedClassroomId: string | null;
  /** True when the teacher must actively pick before figures are shown. */
  mustChoose: boolean;
  /** True when aggregate was chosen deliberately, not fallen into. */
  isExplicitAggregate: boolean;
  reason:
    | 'no_classrooms'
    | 'single_classroom_auto'
    | 'restored_recent'
    | 'awaiting_choice'
    | 'explicit_aggregate';
};

export const AGGREGATE_SENTINEL = '__aggregate__';

export function resolveClassroomContext(args: {
  classrooms: ClassroomOption[];
  /** Persisted choice. `AGGREGATE_SENTINEL` means aggregate was picked. */
  storedSelection?: string | null;
}): ClassroomContextResolution {
  const { classrooms, storedSelection } = args;

  if (classrooms.length === 0) {
    return {
      selectedClassroomId: null,
      mustChoose: false,
      isExplicitAggregate: false,
      reason: 'no_classrooms',
    };
  }

  // An explicit aggregate choice is honoured — it is a real choice.
  if (storedSelection === AGGREGATE_SENTINEL) {
    return {
      selectedClassroomId: null,
      mustChoose: false,
      isExplicitAggregate: true,
      reason: 'explicit_aggregate',
    };
  }

  // A stored classroom that still exists wins.
  if (storedSelection && classrooms.some((c) => c.id === storedSelection)) {
    return {
      selectedClassroomId: storedSelection,
      mustChoose: false,
      isExplicitAggregate: false,
      reason: 'restored_recent',
    };
  }

  if (classrooms.length === 1) {
    return {
      selectedClassroomId: classrooms[0].id,
      mustChoose: false,
      isExplicitAggregate: false,
      reason: 'single_classroom_auto',
    };
  }

  // Several classrooms and no usable stored choice: ask. Do NOT
  // silently aggregate unrelated classes.
  return {
    selectedClassroomId: null,
    mustChoose: true,
    isExplicitAggregate: false,
    reason: 'awaiting_choice',
  };
}

const STORAGE_KEY = 'pragati.teacher_classroom.v1';

export function loadStoredClassroomSelection(): string | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Persisted so the choice survives tab switches AND reloads. */
export function storeClassroomSelection(id: string | null): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, id ?? AGGREGATE_SENTINEL);
  } catch {
    /* storage unavailable; selection is then per-session only */
  }
}

/** What the chrome shows as the current context. */
export function contextLabel(
  r: ClassroomContextResolution,
  classrooms: ClassroomOption[]
): string {
  if (r.isExplicitAggregate) return 'All local data (aggregate)';
  if (r.mustChoose) return 'Choose a class';
  if (r.reason === 'no_classrooms') return 'No classes yet';
  const c = classrooms.find((x) => x.id === r.selectedClassroomId);
  return c?.name ?? 'Choose a class';
}
