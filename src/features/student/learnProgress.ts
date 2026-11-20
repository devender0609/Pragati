// ===========================================================================
// v0.84.0-rc.2 checkpoint 45 — LEARN PROGRESS, BY ARTIFACT.
//
// `sectionProgressForChapter()` already exists and counts practice sessions.
// It is the wrong instrument here: finishing a lesson is not finishing an
// assessment, and Class 9 has no item bank at all, so reusing it would
// report zero forever.
//
// So Learn progress is tracked by `contentArtifactId` — the lesson's real
// identity — and by nothing else. Not by official section, which several
// lessons share; not by chapter; not by inferring completion from a
// session that never happened.
//
// Completion is explicit. A lesson counts as complete when the student
// finishes its last stage, not when they open it.
// ===========================================================================

const KEY = 'pragati.learnProgress.v1';

type Store = Record<string, { completed: string[]; last?: string }>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    // A corrupt or unavailable store must not break the lesson. Progress is
    // a convenience; losing it is survivable, and crashing is not.
    return {};
  }
}

function write(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* storage full or blocked — the lesson still works */
  }
}

/** Artifact ids this student has completed. Scoped per student. */
export function completedLessons(studentId: string): string[] {
  return read()[studentId]?.completed ?? [];
}

export function isLessonComplete(studentId: string, contentArtifactId: string): boolean {
  return completedLessons(studentId).includes(contentArtifactId);
}

export function markLessonComplete(studentId: string, contentArtifactId: string): void {
  const store = read();
  const entry = store[studentId] ?? { completed: [] };
  if (!entry.completed.includes(contentArtifactId)) {
    entry.completed = [...entry.completed, contentArtifactId];
  }
  entry.last = contentArtifactId;
  store[studentId] = entry;
  write(store);
}

/** The lesson most recently opened, for a truthful Continue. */
export function noteLessonOpened(studentId: string, contentArtifactId: string): void {
  const store = read();
  const entry = store[studentId] ?? { completed: [] };
  entry.last = contentArtifactId;
  store[studentId] = entry;
  write(store);
}

export function lastOpenedLesson(studentId: string): string | null {
  return read()[studentId]?.last ?? null;
}

/**
 * Completed out of total, for a set of artifact ids. The denominator is
 * always the number of ACTUAL lessons passed in — never a unit count, so a
 * contextually covered unit cannot create a slot that can never be filled.
 */
export function learnProgressFor(
  studentId: string,
  contentArtifactIds: string[]
): { done: number; total: number; complete: boolean } {
  const done = completedLessons(studentId);
  const hit = contentArtifactIds.filter((id) => done.includes(id)).length;
  return {
    done: hit,
    total: contentArtifactIds.length,
    complete: contentArtifactIds.length > 0 && hit === contentArtifactIds.length,
  };
}
