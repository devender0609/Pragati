// All localStorage access for Pragati lives here so we have one place to
// reason about keys, schema versions, and the "never overwrite a session"
// invariant.
//
// Schema:
//   pragati.students.v1         -> Student[]
//   pragati.sessions.v1         -> Session[]   (one flat list across all students)
//   pragati.app_mode.v1         -> AppMode      (v0.8)
//   pragati.item_reviews.v1     -> ItemReview[] (v0.8, keyed by itemId)
//   pragati.pilots.v1           -> PilotMetadata[] (v0.8, archive of all pilots)
//   pragati.session_feedback.v1 -> SessionFeedback[] (v0.8, keyed by sessionId)
//
// Rules:
//   - saveSession() APPENDS by default. It only overwrites when an existing
//     session with the same id is being updated (e.g. an in-flight save
//     during a single attempt). It never overwrites a different session.
//   - All reads tolerate missing or malformed data and degrade to [].
//   - All writes swallow quota / private-mode errors so the UI keeps working.

import type {
  AppMode,
  ItemReview,
  ItemReviewStatus,
  PilotMetadata,
  Session,
  SessionFeedback,
  Student,
} from '../types';
export type { Session, Student };

const STUDENTS_KEY = 'pragati.students.v1';
const SESSIONS_KEY = 'pragati.sessions.v1';
const APP_MODE_KEY = 'pragati.app_mode.v1';
const ITEM_REVIEWS_KEY = 'pragati.item_reviews.v1';
const PILOTS_KEY = 'pragati.pilots.v1';
const SESSION_FEEDBACK_KEY = 'pragati.session_feedback.v1';

// Tiny id helper. crypto.randomUUID() exists in all current browsers we
// care about; we still keep a fallback so this doesn't crash anywhere odd.
export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const safeRead = <T>(key: string): T[] => {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as T[];
  } catch {
    return [];
  }
};

const safeWrite = (key: string, value: unknown): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private-mode errors */
  }
};

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------
export function loadStudents(): Student[] {
  return safeRead<Student>(STUDENTS_KEY);
}

export function saveStudent(student: Student): void {
  const students = loadStudents();
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    students[idx] = student;
  } else {
    students.push(student);
  }
  safeWrite(STUDENTS_KEY, students);
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
  return safeRead<Session>(SESSIONS_KEY);
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
  safeWrite(SESSIONS_KEY, sessions);
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
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STUDENTS_KEY);
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(APP_MODE_KEY);
    localStorage.removeItem(ITEM_REVIEWS_KEY);
    localStorage.removeItem(PILOTS_KEY);
    localStorage.removeItem(SESSION_FEEDBACK_KEY);
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Delete a student
// ---------------------------------------------------------------------------
// Removes the student record AND every session that belonged to them. This
// is destructive; the UI must confirm before calling. Per-session feedback
// for the deleted student's sessions is also cleaned up.
export function deleteStudent(studentId: string): void {
  const remainingStudents = loadStudents().filter((s) => s.id !== studentId);
  const removedSessionIds = new Set(
    loadSessions()
      .filter((s) => s.studentId === studentId)
      .map((s) => s.id)
  );
  const remainingSessions = loadSessions().filter(
    (s) => s.studentId !== studentId
  );
  const remainingFeedback = loadSessionFeedback().filter(
    (f) => !removedSessionIds.has(f.sessionId)
  );
  safeWrite(STUDENTS_KEY, remainingStudents);
  safeWrite(SESSIONS_KEY, remainingSessions);
  safeWrite(SESSION_FEEDBACK_KEY, remainingFeedback);
}

// ---------------------------------------------------------------------------
// App mode (v0.8)
// ---------------------------------------------------------------------------
export function loadAppMode(): AppMode {
  try {
    if (typeof localStorage === 'undefined') return 'student';
    const raw = localStorage.getItem(APP_MODE_KEY);
    if (raw === 'teacher' || raw === 'student') return raw;
    return 'student';
  } catch {
    return 'student';
  }
}

export function saveAppMode(mode: AppMode): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(APP_MODE_KEY, mode);
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Item reviews (v0.8)
// ---------------------------------------------------------------------------
// One per item id. saveItemReview UPSERTs by itemId.
export function loadItemReviews(): ItemReview[] {
  return safeRead<ItemReview>(ITEM_REVIEWS_KEY);
}

export function saveItemReview(review: ItemReview): void {
  const all = loadItemReviews();
  const idx = all.findIndex((r) => r.itemId === review.itemId);
  if (idx >= 0) {
    all[idx] = review;
  } else {
    all.push(review);
  }
  safeWrite(ITEM_REVIEWS_KEY, all);
}

export function getItemReview(itemId: string): ItemReview | null {
  return loadItemReviews().find((r) => r.itemId === itemId) ?? null;
}

// Convenience: build an empty (not_reviewed) review for an item.
export function newItemReview(itemId: string): ItemReview {
  return {
    itemId,
    status: 'not_reviewed',
    correctAnswerVerified: null,
    wordingClear: null,
    gradeAppropriate: null,
    visualHelpful: null,
    difficultyRating: null,
    ambiguityConcern: null,
    comments: '',
    reviewedAt: 0,
  };
}

// Aggregate counts by review status, used for the Item Review header.
export function reviewStatusCounts(
  reviews: ItemReview[]
): Record<ItemReviewStatus, number> {
  const out: Record<ItemReviewStatus, number> = {
    not_reviewed: 0,
    needs_revision: 0,
    approved: 0,
  };
  for (const r of reviews) {
    out[r.status] += 1;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Pilots (v0.8)
// ---------------------------------------------------------------------------
// At most one pilot can be `active` at a time; activating a new one
// deactivates any others. Saved sessions read the active pilot to set
// `Session.pilotId`.
export function loadPilots(): PilotMetadata[] {
  return safeRead<PilotMetadata>(PILOTS_KEY);
}

export function getActivePilot(): PilotMetadata | null {
  return loadPilots().find((p) => p.active) ?? null;
}

export function savePilot(pilot: PilotMetadata): void {
  const all = loadPilots();
  const idx = all.findIndex((p) => p.id === pilot.id);
  if (pilot.active) {
    // Deactivate any currently-active pilots.
    for (const p of all) p.active = false;
  }
  if (idx >= 0) {
    all[idx] = pilot;
  } else {
    all.push(pilot);
  }
  safeWrite(PILOTS_KEY, all);
}

export function endActivePilot(): void {
  const all = loadPilots();
  for (const p of all) {
    if (p.active) p.active = false;
  }
  safeWrite(PILOTS_KEY, all);
}

// ---------------------------------------------------------------------------
// Session feedback (v0.8)
// ---------------------------------------------------------------------------
export function loadSessionFeedback(): SessionFeedback[] {
  return safeRead<SessionFeedback>(SESSION_FEEDBACK_KEY);
}

export function saveSessionFeedback(feedback: SessionFeedback): void {
  const all = loadSessionFeedback();
  const idx = all.findIndex((f) => f.sessionId === feedback.sessionId);
  if (idx >= 0) {
    all[idx] = feedback;
  } else {
    all.push(feedback);
  }
  safeWrite(SESSION_FEEDBACK_KEY, all);
}

export function getSessionFeedback(sessionId: string): SessionFeedback | null {
  return loadSessionFeedback().find((f) => f.sessionId === sessionId) ?? null;
}

// ---------------------------------------------------------------------------
// Export everything (for future calibration work)
// ---------------------------------------------------------------------------
// Returns a JSON-serialisable bundle of every artifact on this device. The
// shape is intentionally simple so a downstream calibration pipeline (R /
// Python) can consume it directly.
//
// schemaVersion bumps:
//   1 → v0.3+ (students + sessions only)
//   2 → v0.8 (adds itemReviews, pilots, sessionFeedback, teachingPlan,
//             itemQualityFlags). Older bundles still parse — they just
//             lack the v2 fields.
export type ExportBundle = {
  exportedAt: string;       // ISO timestamp
  app: 'pragati';
  schemaVersion: 2;
  students: Student[];
  sessions: Session[];
  itemReviews: ItemReview[];
  pilots: PilotMetadata[];
  sessionFeedback: SessionFeedback[];
  // The two summaries below are computed snapshots, not stored state.
  // Caller passes them in so the export bundle reflects the SAME plan and
  // flags the teacher is looking at on screen.
  teachingPlanSummary?: unknown;
  itemQualityFlags?: unknown;
};

export function buildExportBundle(extras?: {
  teachingPlanSummary?: unknown;
  itemQualityFlags?: unknown;
}): ExportBundle {
  return {
    exportedAt: new Date().toISOString(),
    app: 'pragati',
    schemaVersion: 2,
    students: loadStudents(),
    sessions: loadSessions(),
    itemReviews: loadItemReviews(),
    pilots: loadPilots(),
    sessionFeedback: loadSessionFeedback(),
    teachingPlanSummary: extras?.teachingPlanSummary,
    itemQualityFlags: extras?.itemQualityFlags,
  };
}

export function exportAllAsJSON(extras?: {
  teachingPlanSummary?: unknown;
  itemQualityFlags?: unknown;
}): string {
  return JSON.stringify(buildExportBundle(extras), null, 2);
}
