// v0.59 §6 — Formal session persistence.
//
// A field-test sitting must survive a refresh, an accidental close, and
// a return the next day. v0.58 built the session RUNNER but kept state
// in memory, so any of those lost the sitting — and a lost sitting in a
// formal assessment is worse than a lost practice set: the student has
// already been exposed to secure items that cannot be re-administered
// cleanly.
//
// Item IDs only. Never stems, prompts, or answers — secure content must
// not sit in ordinary browser storage.

import type { FormalSessionState } from './formalSessionRunner';

const STORAGE_KEY = 'pragati.formal_sessions.v1';

export type FormalSessionStore = {
  save(state: FormalSessionState): void;
  get(sessionId: string): FormalSessionState | null;
  activeForStudent(studentId: string): FormalSessionState | null;
  forAssignment(assignmentId: string): FormalSessionState[];
  all(): FormalSessionState[];
};

function read(): FormalSessionState[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FormalSessionState[]) : [];
  } catch {
    return [];
  }
}

function write(rows: FormalSessionState[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* storage unavailable — the sitting continues in memory */
  }
}

/** Guard: a stored session must never carry item content. */
export function containsSecureContent(state: FormalSessionState): boolean {
  const json = JSON.stringify(state);
  return /"stem"|"prompt"|"choices"|"correctIndex"|"explanation"/.test(json);
}

export const localFormalSessionStore: FormalSessionStore = {
  save(state) {
    if (containsSecureContent(state)) {
      throw new Error(
        'Refusing to persist a formal session containing secure item content.'
      );
    }
    write([...read().filter((s) => s.sessionId !== state.sessionId), state]);
  },
  get(sessionId) {
    return read().find((s) => s.sessionId === sessionId) ?? null;
  },
  activeForStudent(studentId) {
    return (
      read()
        .filter(
          (s) =>
            s.studentId === studentId &&
            (s.status === 'in_progress' || s.status === 'not_started')
        )
        .sort((a, b) => b.lastActivityAt - a.lastActivityAt)[0] ?? null
    );
  },
  forAssignment(assignmentId) {
    return read().filter((s) => s.assignmentId === assignmentId);
  },
  all: read,
};

/** In-memory store for tests and fixtures. */
export function createInMemorySessionStore(): FormalSessionStore {
  let rows: FormalSessionState[] = [];
  return {
    save(state) {
      rows = [...rows.filter((s) => s.sessionId !== state.sessionId), state];
    },
    get: (id) => rows.find((s) => s.sessionId === id) ?? null,
    activeForStudent: (studentId) =>
      rows
        .filter(
          (s) =>
            s.studentId === studentId &&
            (s.status === 'in_progress' || s.status === 'not_started')
        )
        .sort((a, b) => b.lastActivityAt - a.lastActivityAt)[0] ?? null,
    forAssignment: (id) => rows.filter((s) => s.assignmentId === id),
    all: () => rows,
  };
}
