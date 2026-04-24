// All localStorage access for Pragati lives here so we have one place to
// reason about keys, schema versions, and the "never overwrite a session"
// invariant.
//
// Schema:
//   pragati.students.v1  -> Student[]
//   pragati.sessions.v1  -> Session[]   (one flat list across all students)
//
// Rules:
//   - saveSession() APPENDS by default. It only overwrites when an existing
//     session with the same id is being updated (e.g. an in-flight save
//     during a single attempt). It never overwrites a different session.
//   - All reads tolerate missing or malformed data and degrade to [].
//   - All writes swallow quota / private-mode errors so the UI keeps working.

import type { Session, Student } from '../types';

const STUDENTS_KEY = 'pragati.students.v1';
const SESSIONS_KEY = 'pragati.sessions.v1';

// Tiny id helper. crypto.randomUUID() exists in all current browsers we
// care about; we still keep a fallback so this doesn't crash anywhere odd.
export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------
export function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Student[];
  } catch {
    return [];
  }
}

export function saveStudent(student: Student): void {
  const students = loadStudents();
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    students[idx] = student;
  } else {
    students.push(student);
  }
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

// Look up an existing student by name + grade + school (case-insensitive).
// If none exists, create and persist a new one. Returns the student record.
//
// We match on (name, grade, school) so that two different "Aarav" students
// in different grades or different schools get separate records.
export function findOrCreateStudent(
  name: string,
  grade: string,
  school?: string
): Student {
  const trimmedName = name.trim();
  const trimmedGrade = grade.trim();
  const trimmedSchool = school?.trim() || undefined;

  const students = loadStudents();
  const existing = students.find(
    (s) =>
      s.name.toLowerCase() === trimmedName.toLowerCase() &&
      s.grade === trimmedGrade &&
      (s.school || '').toLowerCase() === (trimmedSchool || '').toLowerCase()
  );
  if (existing) return existing;

  const created: Student = {
    id: generateId(),
    name: trimmedName,
    grade: trimmedGrade,
    school: trimmedSchool,
    createdAt: Date.now(),
  };
  saveStudent(created);
  return created;
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------
export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Session[];
  } catch {
    return [];
  }
}

// APPEND a session. If a session with the same id already exists (e.g. we're
// updating an in-flight session during a single attempt), it is replaced;
// otherwise the session is appended. We never overwrite a *different*
// session belonging to the same student.
export function saveSession(session: Session): void {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.push(session);
  }
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function getSessionsForStudent(studentId: string): Session[] {
  return loadSessions()
    .filter((s) => s.studentId === studentId)
    .sort((a, b) => a.startedAt - b.startedAt);
}

export function getCompletedSessionsForStudent(studentId: string): Session[] {
  return getSessionsForStudent(studentId).filter((s) => s.completedAt !== null);
}

// Dev / debug helper. Not wired to a button by default; expose if/when needed.
export function clearAll(): void {
  try {
    localStorage.removeItem(STUDENTS_KEY);
    localStorage.removeItem(SESSIONS_KEY);
  } catch {
    /* ignore */
  }
}
