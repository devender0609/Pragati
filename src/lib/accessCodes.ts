// v0.20: cloud-ready classroom access codes — multi-device workflow.
//
// Design upgrade vs v0.19:
//   - The `accessCodes/{code}` Firestore doc is the ONE document a student
//     device can read without being signed in. It now carries everything the
//     student needs to participate: classroom name, active assignment
//     summaries (safe subset), revoked flag, expiresAt, createdAt. No
//     teacher PII beyond the public classroom name.
//   - Students never write to teacher-owned paths. Instead, every assigned
//     submission goes to `accessCodes/{code}/submissions/{sessionId}`, a
//     subcollection under the public code doc. Anyone with the code can
//     create submissions; only the teacher can read them all.
//   - Teacher-side syncAll() imports submissions (in lib/sync.ts) on each
//     sync, deduping by sessionId and writing them into the teacher's
//     `teachers/{uid}/sessions/{id}` records.
//   - Local-demo mode still works: codes resolve against on-device
//     classrooms, assignments are read from localStorage, "submissions" are
//     just normal localStorage sessions.

import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { currentTeacher, getFirebase, isFirebaseEnabled } from './firebase';
import { loadClassrooms, saveClassroom } from './classroomStore';
import {
  findOrCreateStudent,
  generateId,
  getActiveAssignments,
  loadAssignments,
  loadSessions,
  saveSession,
  saveStudent,
} from './storage';
import { gradeDisplayLabel } from '../curriculum';
import { upsertClassroom, upsertStudent } from './cloudStore';
import type { Classroom } from './cloudStore';
import type {
  AssessmentAssignment,
  AssignmentSize,
  AssignmentTargetKind,
  Session,
  SkillMode,
} from '../types';

// ---------------------------------------------------------------------------
// Local persistence
// ---------------------------------------------------------------------------

const STUDENT_JOIN_KEY = 'pragati.student_join.v1';
// v0.20: cache of the active classroom assignment summaries that came
// from the cloud accessCodes doc. Keyed under the student-join key.
const CLOUD_ASSIGNMENTS_KEY = 'pragati.cloud_assignments.v1';
// v0.20: per-teacher cache of the most recent "submissions imported"
// timestamp + count. Surfaced in the Classrooms view.
const TEACHER_IMPORT_STATUS_KEY = 'pragati.teacher_import_status.v1';

// v0.26 — best-effort grade label for a student joining via access code
// or for a submission imported from a classroom code. Uses the classroom's
// own gradeId when the classroom carries one (new in v0.26), falls back
// to the legacy default 'Class 6' when the classroom is from an older
// device and has no grade context.
export function classroomLabelForEnrollment(
  classroom: Classroom | undefined | null
): string {
  if (classroom?.gradeId) {
    return gradeDisplayLabel(classroom.gradeId);
  }
  return 'Class 6';
}

export type StudentJoinState = {
  classroomId: string;
  classroomName: string;
  teacherUid: string | null;
  studentId: string;
  studentName: string;
  joinedAt: number;
};

export function loadStudentJoinState(): StudentJoinState | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STUDENT_JOIN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.classroomId === 'string' &&
      typeof parsed.studentId === 'string' &&
      typeof parsed.studentName === 'string'
    ) {
      return parsed as StudentJoinState;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function saveStudentJoinState(state: StudentJoinState): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STUDENT_JOIN_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function clearStudentJoinState(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STUDENT_JOIN_KEY);
    localStorage.removeItem(CLOUD_ASSIGNMENTS_KEY);
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// v0.22: per-teacher "reviewed imported sessions" tracker
// ---------------------------------------------------------------------------
// Stored as a flat sessionId → reviewedAt map under
// `pragati.imported_reviewed.v1`. No PII — just ids and timestamps.

const IMPORTED_REVIEWED_KEY = 'pragati.imported_reviewed.v1';

export function loadReviewedImports(): Record<string, number> {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(IMPORTED_REVIEWED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, number>;
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function markImportReviewed(sessionId: string, reviewed: boolean): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const map = loadReviewedImports();
    if (reviewed) {
      map[sessionId] = Date.now();
    } else {
      delete map[sessionId];
    }
    localStorage.setItem(IMPORTED_REVIEWED_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function isImportReviewed(sessionId: string): boolean {
  return loadReviewedImports()[sessionId] !== undefined;
}

// ---------------------------------------------------------------------------
// v0.22: access-code expiry defaults + status classifier
// ---------------------------------------------------------------------------

// Default code TTL: 30 days from generation. Teachers can override or
// disable via the AccessCodeMeta UI in ClassroomsView.
export const DEFAULT_CODE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type CodeStatus = 'active' | 'expired' | 'revoked' | 'none';

export function classifyCode(
  classroom: Pick<
    Classroom,
    'accessCode' | 'accessCodeExpiresAt' | 'accessCodeRevoked'
  >
): CodeStatus {
  if (!classroom.accessCode) return 'none';
  if (classroom.accessCodeRevoked) return 'revoked';
  if (
    typeof classroom.accessCodeExpiresAt === 'number' &&
    classroom.accessCodeExpiresAt < Date.now()
  ) {
    return 'expired';
  }
  return 'active';
}

// ---------------------------------------------------------------------------
// v0.22: client-side submission validation
// ---------------------------------------------------------------------------
// Limits mirror the field validators in the README's Firestore rules
// example so the client catches malformed payloads BEFORE the cloud write.

export const MAX_STUDENT_NAME_LEN = 80;
export const MAX_RESPONSES = 50;
export const MAX_RESPONSE_CHOSEN_TEXT_LEN = 200;
export const MAX_SUBMISSION_BYTES = 200 * 1024;
// v0.23: widened to accept `mixed_c7_*` (digit + letter + underscore).
const SKILL_MODE_PATTERN = /^(?:mixed|mixed_[a-z0-9_]+|[A-Z]{2}\.[0-9]{2})$/;

type SubmissionValidatable = {
  sessionId: string;
  assignmentId?: string;
  classroomId: string;
  studentName: string;
  skillMode: string;
  completedAt: number;
  responses: ReadonlyArray<unknown>;
};

/**
 * Returns null when valid; otherwise a short human-readable reason that
 * the UI can surface as "Saved locally only — invalid submission payload".
 */
export function validateSubmissionShape(payload: SubmissionValidatable): string | null {
  if (!payload.sessionId || typeof payload.sessionId !== 'string') return 'missing sessionId';
  if (!payload.assignmentId || typeof payload.assignmentId !== 'string') return 'missing assignmentId';
  if (!payload.classroomId || typeof payload.classroomId !== 'string') return 'missing classroomId';
  if (!payload.studentName || typeof payload.studentName !== 'string') return 'missing studentName';
  if (payload.studentName.length > MAX_STUDENT_NAME_LEN) {
    return `studentName too long (max ${MAX_STUDENT_NAME_LEN} chars)`;
  }
  if (!payload.skillMode || !SKILL_MODE_PATTERN.test(payload.skillMode)) {
    return `invalid skillMode "${payload.skillMode}"`;
  }
  if (typeof payload.completedAt !== 'number' || payload.completedAt <= 0) {
    return 'missing or invalid completedAt';
  }
  if (!Array.isArray(payload.responses) || payload.responses.length === 0) {
    return 'responses array is empty';
  }
  if (payload.responses.length > MAX_RESPONSES) {
    return `too many responses (got ${payload.responses.length}, max ${MAX_RESPONSES})`;
  }
  for (const r of payload.responses) {
    if (r && typeof r === 'object' && 'chosenText' in r) {
      const txt = (r as { chosenText?: unknown }).chosenText;
      if (typeof txt === 'string' && txt.length > MAX_RESPONSE_CHOSEN_TEXT_LEN) {
        return `a response's chosenText is too long (max ${MAX_RESPONSE_CHOSEN_TEXT_LEN} chars)`;
      }
    }
  }
  try {
    const bytes = new TextEncoder().encode(JSON.stringify(payload)).byteLength;
    if (bytes > MAX_SUBMISSION_BYTES) {
      return `submission too large (${Math.round(bytes / 1024)} KB > ${Math.round(MAX_SUBMISSION_BYTES / 1024)} KB)`;
    }
  } catch {
    /* serialization error → caller will fail at write time anyway */
  }
  return null;
}

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const NUMS = '23456789';

export function generateAccessCode(): string {
  const pick = (set: string, n: number) =>
    Array.from({ length: n }, () => set.charAt(Math.floor(Math.random() * set.length))).join('');
  return `${pick(ALPHA, 3)}-${pick(ALPHA + NUMS, 4)}`;
}

export function normaliseCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, '');
}

// ---------------------------------------------------------------------------
// v0.20: safe assignment summary (public-readable subset)
// ---------------------------------------------------------------------------

export type AssignmentSummary = {
  assignmentId: string;
  title: string;
  skillMode: SkillMode;
  itemCount: AssignmentSize;
  kind?: 'assessment' | 'practice';
  teacherNote: string;
  dueDateMs?: number;
  targetKind?: AssignmentTargetKind;
  // No `pilotId`, no teacher-only fields.
};

export function toAssignmentSummary(a: AssessmentAssignment): AssignmentSummary {
  return {
    assignmentId: a.id,
    title: a.title,
    skillMode: a.skillMode,
    itemCount: a.itemCount,
    ...(a.kind ? { kind: a.kind } : {}),
    teacherNote: a.teacherNote,
    ...(typeof a.dueDateMs === 'number' ? { dueDateMs: a.dueDateMs } : {}),
    ...(a.target ? { targetKind: a.target.kind } : {}),
  };
}

// ---------------------------------------------------------------------------
// v0.20: extended access-code record
// ---------------------------------------------------------------------------

export type AccessCodeRecord = {
  code: string;
  teacherUid: string;
  classroomId: string;
  classroomName: string;
  createdAt: number;
  updatedAt: number;
  revoked: boolean;
  expiresAt?: number;
  // The active assignments published for this classroom. Empty when the
  // classroom has no active classroom-bound assignment.
  activeAssignments: AssignmentSummary[];
};

// ---------------------------------------------------------------------------
// v0.20: student-side cache of cloud assignment summaries (one set per
// joined classroom, keyed by code)
// ---------------------------------------------------------------------------

type CachedAssignmentBundle = {
  code: string;
  classroomId: string;
  fetchedAt: number;
  revoked: boolean;
  expiresAt?: number;
  assignments: AssignmentSummary[];
};

export function loadCloudClassroomAssignments(): CachedAssignmentBundle | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(CLOUD_ASSIGNMENTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.code === 'string' &&
      typeof parsed.classroomId === 'string' &&
      Array.isArray(parsed.assignments)
    ) {
      return parsed as CachedAssignmentBundle;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function saveCloudClassroomAssignments(b: CachedAssignmentBundle): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(CLOUD_ASSIGNMENTS_KEY, JSON.stringify(b));
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// v0.20: tracking which sessions have been submitted to the cloud, so the
// Student home can show a "Submitted" badge per assignment.
// ---------------------------------------------------------------------------

const SUBMITTED_SESSIONS_KEY = 'pragati.submitted_sessions.v1';

export function loadSubmittedSessionIds(): Set<string> {
  try {
    if (typeof localStorage === 'undefined') return new Set();
    const raw = localStorage.getItem(SUBMITTED_SESSIONS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter((x) => typeof x === 'string'));
  } catch {
    /* ignore */
  }
  return new Set();
}

function markSessionSubmitted(sessionId: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const set = loadSubmittedSessionIds();
    set.add(sessionId);
    localStorage.setItem(SUBMITTED_SESSIONS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Teacher side: attach a code to a classroom; publish active assignments
// ---------------------------------------------------------------------------

function activeAssignmentsForClassroom(classroomId: string): AssignmentSummary[] {
  return getActiveAssignments()
    .filter((a) => a.classroomId === classroomId)
    .map(toAssignmentSummary);
}

export async function assignAccessCodeToClassroom(
  classroom: Classroom,
  code: string,
  // v0.22: optional explicit expiry. `undefined` → default 30-day TTL;
  // `null` → no expiry (the code is valid until revoked).
  expiresAt?: number | null
): Promise<{ classroom: Classroom; mirroredToCloud: boolean }> {
  const normalized = normaliseCode(code);
  const resolvedExpiry =
    expiresAt === null
      ? undefined
      : typeof expiresAt === 'number'
        ? expiresAt
        : Date.now() + DEFAULT_CODE_TTL_MS;
  const updated: Classroom & {
    accessCode?: string;
    accessCodeExpiresAt?: number;
    accessCodeRevoked?: boolean;
  } = {
    ...classroom,
    accessCode: normalized,
    accessCodeExpiresAt: resolvedExpiry,
    accessCodeRevoked: false,
    updatedAt: Date.now(),
  };
  saveClassroom(updated);

  let mirroredToCloud = false;
  if (isFirebaseEnabled() && currentTeacher()) {
    try {
      await upsertClassroom(updated);
      const s = getFirebase();
      const teacher = currentTeacher();
      if (s.kind === 'enabled' && teacher) {
        const record: AccessCodeRecord = {
          code: normalized,
          teacherUid: teacher.uid,
          classroomId: updated.id,
          classroomName: updated.name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          revoked: false,
          ...(resolvedExpiry !== undefined ? { expiresAt: resolvedExpiry } : {}),
          activeAssignments: activeAssignmentsForClassroom(updated.id),
        };
        await setDoc(doc(s.db, 'accessCodes', normalized), record, { merge: true });
        mirroredToCloud = true;
      }
    } catch {
      // Non-fatal — local classroom still carries the code.
    }
  }
  return { classroom: updated, mirroredToCloud };
}

/**
 * v0.22: change just the `expiresAt` field on a classroom's code mirror.
 * Pass `null` to clear the expiry (code never expires). Local mirror is
 * updated even when Firebase is unavailable.
 */
export async function setAccessCodeExpiry(
  classroomId: string,
  expiresAt: number | null
): Promise<{ ok: boolean; reason?: string }> {
  const classroom = loadClassrooms().find((c) => c.id === classroomId);
  if (!classroom) return { ok: false, reason: 'classroom_not_found' };
  const code = (classroom as Classroom & { accessCode?: string }).accessCode;
  if (!code) return { ok: false, reason: 'no_code' };
  // v0.23: locally, build the next record WITHOUT the
  // accessCodeExpiresAt field when expiresAt is null. The previous
  // version set the field to `undefined`, but `saveClassroom` JSON-
  // serialises the object which strips undefined — so this was actually
  // OK locally, but the explicit omit pattern makes the intent clear.
  const localNext = { ...classroom, updatedAt: Date.now() } as Classroom & {
    accessCode?: string;
    accessCodeExpiresAt?: number;
    accessCodeRevoked?: boolean;
  };
  if (expiresAt === null) {
    delete localNext.accessCodeExpiresAt;
  } else {
    localNext.accessCodeExpiresAt = expiresAt;
  }
  saveClassroom(localNext);
  if (!isFirebaseEnabled() || !currentTeacher()) return { ok: true };
  const s = getFirebase();
  if (s.kind !== 'enabled') return { ok: true };
  try {
    // v0.23 bug fix: with merge, writing { updatedAt } alone leaves the
    // existing `expiresAt` field in Firestore untouched, so "Never
    // expire" never actually cleared the cloud expiry. Use
    // deleteField() to remove the field explicitly.
    await setDoc(
      doc(s.db, 'accessCodes', code),
      expiresAt === null
        ? { expiresAt: deleteField(), updatedAt: Date.now() }
        : { expiresAt, updatedAt: Date.now() },
      { merge: true }
    );
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, reason: msg };
  }
}

/**
 * v0.20: re-publish the access-code mirror with the current active
 * assignments for a classroom. Call this whenever the teacher creates,
 * edits, deactivates, or deletes an assignment bound to a classroom that
 * has an access code. Safe to call even when no code is set or Firebase
 * is unavailable — both are no-ops.
 *
 * v0.23 BUG FIXES:
 *   1) REVOKED REACTIVATION: previously this function always wrote
 *      `revoked: false`, which silently un-revoked a revoked code on
 *      any subsequent assignment edit. v0.23 now refuses the publish
 *      with `reason: 'code_revoked'` so the UI can prompt the teacher
 *      to regenerate.
 *   2) EXPIRY DROP / RESET: previously this function did not write
 *      `expiresAt`, so v0.20 behaviour silently dropped the field on
 *      merge if the local cache had drifted. v0.23 explicitly preserves
 *      the classroom's `accessCodeExpiresAt` (or sends `deleteField()`
 *      if the teacher chose "Never expire").
 */
export async function publishClassroomAssignmentsToCode(classroomId: string): Promise<{
  ok: boolean;
  code?: string;
  count?: number;
  reason?: string;
}> {
  const classroom = loadClassrooms().find((c) => c.id === classroomId);
  if (!classroom) return { ok: false, reason: 'classroom_not_found' };
  const code = (classroom as Classroom & { accessCode?: string }).accessCode;
  if (!code) return { ok: false, reason: 'no_code' };
  if ((classroom as Classroom & { accessCodeRevoked?: boolean }).accessCodeRevoked === true) {
    // v0.23 fix #1 — never silently un-revoke a code.
    return { ok: false, reason: 'code_revoked' };
  }
  if (!isFirebaseEnabled()) return { ok: false, reason: 'local_only' };
  const teacher = currentTeacher();
  if (!teacher) return { ok: false, reason: 'not_signed_in' };

  const s = getFirebase();
  if (s.kind !== 'enabled') return { ok: false, reason: 'firebase_not_enabled' };
  try {
    const summaries = activeAssignmentsForClassroom(classroomId);
    const expiry = (classroom as Classroom & { accessCodeExpiresAt?: number }).accessCodeExpiresAt;
    // v0.23 fix #3 — explicitly preserve the local expiresAt and
    // revoked state so a republish never silently mutates them.
    await setDoc(
      doc(s.db, 'accessCodes', code),
      {
        code,
        teacherUid: teacher.uid,
        classroomId,
        classroomName: classroom.name,
        updatedAt: Date.now(),
        revoked: false,
        activeAssignments: summaries,
        // expiresAt: present → write the number; absent → deleteField()
        // so a stale Firestore expiry does not linger.
        expiresAt: typeof expiry === 'number' ? expiry : deleteField(),
      },
      { merge: true }
    );
    return { ok: true, code, count: summaries.length };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, reason: msg };
  }
}

/**
 * v0.20: when an assignment is saved, find its classroom (if any) and
 * re-publish that classroom's code mirror. No-op if assignment isn't
 * bound to a classroom or no code is set.
 *
 * v0.23: returns the publish result so the AssignmentForm caller can
 * surface a friendly "code revoked" alert. Older callers that don't
 * await the value are still safe (Promise is discarded).
 */
export async function publishAssignmentChange(
  assignment: AssessmentAssignment
): Promise<{ ok: boolean; reason?: string; code?: string; count?: number } | null> {
  if (!assignment.classroomId) return null;
  return publishClassroomAssignmentsToCode(assignment.classroomId);
}

export async function revokeAccessCode(code: string): Promise<void> {
  const normalized = normaliseCode(code);
  const s = getFirebase();
  if (s.kind === 'enabled' && currentTeacher()) {
    try {
      // Soft-revoke: mark the mirror as revoked so students see it as
      // closed. We do NOT delete the doc — that would orphan the
      // submissions subcollection. A hard cleanup is for v0.21.
      await setDoc(
        doc(s.db, 'accessCodes', normalized),
        { revoked: true, updatedAt: Date.now(), activeAssignments: [] },
        { merge: true }
      );
    } catch {
      // Fall back to delete if patch fails.
      try {
        await deleteDoc(doc(s.db, 'accessCodes', normalized));
      } catch {
        /* ignore */
      }
    }
  }
  // v0.22: soft-revoke locally — keep the code on the classroom so the
  // teacher UI can still show "Revoked: MAP-7B3K" and allow regeneration,
  // but mark accessCodeRevoked so classifyCode() returns 'revoked'.
  for (const c of loadClassrooms()) {
    if ((c as Classroom & { accessCode?: string }).accessCode === normalized) {
      const updated: Classroom & {
        accessCode?: string;
        accessCodeRevoked?: boolean;
      } = {
        ...c,
        accessCodeRevoked: true,
        updatedAt: Date.now(),
      };
      saveClassroom(updated);
    }
  }
}

// ---------------------------------------------------------------------------
// Student side: resolve code, join, pull active assignments
// ---------------------------------------------------------------------------

export type ResolvedCode = {
  classroomId: string;
  classroomName: string;
  teacherUid: string | null;
  source: 'cloud' | 'local';
  revoked: boolean;
  expiresAt?: number;
  activeAssignments: AssignmentSummary[];
};

export async function resolveAccessCode(
  code: string
): Promise<ResolvedCode | null> {
  const normalized = normaliseCode(code);

  // Cloud lookup first.
  const s = getFirebase();
  if (s.kind === 'enabled') {
    try {
      const snap = await getDoc(doc(s.db, 'accessCodes', normalized));
      if (snap.exists()) {
        const data = snap.data() as AccessCodeRecord;
        return {
          classroomId: data.classroomId,
          classroomName: data.classroomName,
          teacherUid: data.teacherUid,
          source: 'cloud',
          revoked: Boolean(data.revoked),
          ...(typeof data.expiresAt === 'number' ? { expiresAt: data.expiresAt } : {}),
          activeAssignments: Array.isArray(data.activeAssignments)
            ? data.activeAssignments
            : [],
        };
      }
    } catch {
      // Fall through to local lookup.
    }
  }

  // Local fallback: read the classroom + its active local assignments.
  for (const c of loadClassrooms()) {
    if ((c as Classroom & { accessCode?: string }).accessCode === normalized) {
      const localAssignments = loadAssignments()
        .filter((a) => a.active && a.classroomId === c.id)
        .map(toAssignmentSummary);
      return {
        classroomId: c.id,
        classroomName: c.name,
        teacherUid: c.teacherUid ?? null,
        source: 'local',
        revoked: false,
        activeAssignments: localAssignments,
      };
    }
  }
  return null;
}

export async function joinClassroomWithCode(input: {
  code: string;
  studentName: string;
}): Promise<StudentJoinState> {
  const resolved = await resolveAccessCode(input.code);
  if (!resolved) {
    throw new Error('That code did not match any classroom.');
  }
  if (resolved.revoked) {
    throw new Error('This classroom code has been closed by the teacher.');
  }
  if (typeof resolved.expiresAt === 'number' && resolved.expiresAt < Date.now()) {
    throw new Error('This classroom code has expired.');
  }
  const name = input.studentName.trim();
  if (!name) {
    throw new Error('Please enter your name.');
  }

  // v0.26 — Use the classroom's own grade if it carries one; only fall
  // back to the historical 'Class 6' default when the classroom record
  // has no grade context (i.e. legacy classrooms created before v0.26).
  const classroomForGrade = loadClassrooms().find(
    (c) => c.id === resolved.classroomId
  );
  const gradeLabel = classroomLabelForEnrollment(classroomForGrade);
  // Create the local student record.
  const student = findOrCreateStudent(name, gradeLabel);
  if (classroomForGrade) {
    // Persist curriculum context on the student record when we have it.
    // findOrCreateStudent doesn't accept these fields yet — we patch
    // in-memory and write via saveStudent to keep the change small.
    if (
      classroomForGrade.curriculumId ||
      classroomForGrade.gradeId ||
      classroomForGrade.subjectId ||
      classroomForGrade.academicYear
    ) {
      const patched = {
        ...student,
        curriculumId: student.curriculumId ?? classroomForGrade.curriculumId,
        gradeId: student.gradeId ?? classroomForGrade.gradeId,
        subjectId: student.subjectId ?? classroomForGrade.subjectId,
        academicYear: student.academicYear ?? classroomForGrade.academicYear,
        primaryClassroomId: student.primaryClassroomId ?? classroomForGrade.id,
      };
      try {
        saveStudent(patched);
        Object.assign(student, patched);
      } catch {
        /* non-fatal */
      }
    }
  }

  // Best-effort: mirror to the teacher's cloud student roster. In practice
  // production Firestore rules will REJECT this for an unauthenticated
  // device. We swallow the error — the teacher's syncAll() will reconstruct
  // the student record from the submission payload when they next sync.
  if (isFirebaseEnabled()) {
    try {
      await upsertStudent(student);
    } catch {
      /* ignore — submissions carry the student record */
    }
  }

  // Update local classroom membership (best-effort cloud mirror).
  const classrooms = loadClassrooms();
  const cls = classrooms.find((c) => c.id === resolved.classroomId);
  if (cls && !cls.studentIds.includes(student.id)) {
    const updated: Classroom = {
      ...cls,
      studentIds: [...cls.studentIds, student.id],
      updatedAt: Date.now(),
    };
    saveClassroom(updated);
    if (isFirebaseEnabled()) {
      try {
        await upsertClassroom(updated);
      } catch {
        /* ignore */
      }
    }
  } else if (!cls && resolved.source === 'cloud') {
    const stub: Classroom = {
      id: resolved.classroomId,
      teacherUid: resolved.teacherUid ?? 'unknown',
      name: resolved.classroomName,
      notes: '',
      studentIds: [student.id],
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveClassroom(stub);
  }

  const state: StudentJoinState = {
    classroomId: resolved.classroomId,
    classroomName: resolved.classroomName,
    teacherUid: resolved.teacherUid,
    studentId: student.id,
    studentName: name,
    joinedAt: Date.now(),
  };
  saveStudentJoinState(state);

  // Persist the assignment summaries so the StudentHome can render them
  // immediately, even without a network round trip.
  saveCloudClassroomAssignments({
    code: normaliseCode(input.code),
    classroomId: resolved.classroomId,
    fetchedAt: Date.now(),
    revoked: resolved.revoked,
    ...(typeof resolved.expiresAt === 'number' ? { expiresAt: resolved.expiresAt } : {}),
    assignments: resolved.activeAssignments,
  });

  return state;
}

/**
 * v0.20: refresh the cached assignment bundle from the cloud (or local
 * classroom store in demo mode). Safe to call without a join state — it
 * just no-ops then.
 */
export async function refreshCloudClassroomAssignments(): Promise<boolean> {
  const join = loadStudentJoinState();
  if (!join) return false;
  const cached = loadCloudClassroomAssignments();
  const code = cached?.code;
  if (!code) {
    // We have a join state but no cached bundle — try to refetch via the
    // local classroom (which may carry the accessCode).
    const cls = loadClassrooms().find((c) => c.id === join.classroomId);
    const localCode = (cls as Classroom & { accessCode?: string } | undefined)?.accessCode;
    if (!localCode) return false;
    return refreshCloudClassroomAssignmentsByCode(localCode, join.classroomId);
  }
  return refreshCloudClassroomAssignmentsByCode(code, join.classroomId);
}

async function refreshCloudClassroomAssignmentsByCode(
  code: string,
  classroomId: string
): Promise<boolean> {
  const resolved = await resolveAccessCode(code);
  if (!resolved) return false;
  saveCloudClassroomAssignments({
    code: normaliseCode(code),
    classroomId,
    fetchedAt: Date.now(),
    revoked: resolved.revoked,
    ...(typeof resolved.expiresAt === 'number' ? { expiresAt: resolved.expiresAt } : {}),
    assignments: resolved.activeAssignments,
  });
  return true;
}

// ---------------------------------------------------------------------------
// v0.20: student → cloud submission
// ---------------------------------------------------------------------------

export type CloudSubmissionRecord = {
  sessionId: string;
  assignmentId: string;
  classroomId: string;
  studentLocalId: string;
  studentName: string;
  skillMode: SkillMode;
  startedAt: number;
  completedAt: number;
  finalAbility: number;
  accuracy: number; // 0..1
  responses: Session['responses'];
  // Per-misconception counts (across this session).
  misconceptionCounts: Record<string, number>;
  submittedAt: number;
};

// v0.21: structured submission status for the StudentHome / Results UI.
// 'submitted'      — Firestore write succeeded; teacher will see it on sync.
// 'local_only'     — by design: no join state OR no code OR local-demo
//                    mode. The session is saved locally and that is enough.
// 'failed'         — we attempted a cloud write but it errored (network,
//                    permission, etc.). The caller can Retry.
// 'not_applicable' — the session was not assignment-bound, so there is
//                    nothing to submit.
export type SubmissionState =
  | { state: 'submitted'; at: number }
  | { state: 'local_only'; reason: string }
  | { state: 'failed'; reason: string }
  | { state: 'not_applicable' };

const SUBMISSION_STATE_KEY = 'pragati.submission_state.v1';

type SubmissionStateMap = Record<string, SubmissionState>;

function loadSubmissionStateMap(): SubmissionStateMap {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(SUBMISSION_STATE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as SubmissionStateMap;
  } catch {
    /* ignore */
  }
  return {};
}

function writeSubmissionState(sessionId: string, status: SubmissionState): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const map = loadSubmissionStateMap();
    map[sessionId] = status;
    localStorage.setItem(SUBMISSION_STATE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function getSubmissionState(sessionId: string): SubmissionState | null {
  const map = loadSubmissionStateMap();
  return map[sessionId] ?? null;
}

/**
 * Write a completed session to `accessCodes/{code}/submissions/{sessionId}`.
 * Safe to call without a join state or without an assignmentId — both
 * paths are no-ops then. The local session is unaffected. Returns a
 * structured SubmissionState (also persisted to localStorage at
 * `pragati.submission_state.v1`) so the caller can render the status
 * pill on the Results screen and offer a Retry button.
 */
export async function submitStudentSession(session: Session): Promise<SubmissionState> {
  // Only assignment-bound sessions get submitted.
  if (!session.assignmentId) {
    const status: SubmissionState = { state: 'not_applicable' };
    writeSubmissionState(session.id, status);
    return status;
  }
  const join = loadStudentJoinState();
  if (!join) {
    const status: SubmissionState = { state: 'local_only', reason: 'You are not joined to a classroom.' };
    writeSubmissionState(session.id, status);
    return status;
  }
  const cached = loadCloudClassroomAssignments();
  const code = cached?.code;
  if (!code) {
    const status: SubmissionState = { state: 'local_only', reason: 'No classroom code in the local cache.' };
    writeSubmissionState(session.id, status);
    return status;
  }
  if (!isFirebaseEnabled()) {
    const status: SubmissionState = { state: 'local_only', reason: 'Local demo mode — nothing to submit.' };
    writeSubmissionState(session.id, status);
    return status;
  }
  if (!session.completedAt) {
    const status: SubmissionState = { state: 'failed', reason: 'Session is not marked completed.' };
    writeSubmissionState(session.id, status);
    return status;
  }

  // v0.22: client-side payload validation. Anything malformed becomes
  // local-only — the local session is preserved either way.
  const validationError = validateSubmissionShape({
    sessionId: session.id,
    assignmentId: session.assignmentId,
    classroomId: join.classroomId,
    studentName: join.studentName,
    skillMode: session.skillId,
    completedAt: session.completedAt,
    responses: session.responses,
  });
  if (validationError) {
    const status: SubmissionState = {
      state: 'local_only',
      reason: `Invalid submission payload: ${validationError}.`,
    };
    writeSubmissionState(session.id, status);
    return status;
  }

  const correct = session.responses.filter((r) => r.correct).length;
  const accuracy =
    session.responses.length === 0 ? 0 : correct / session.responses.length;
  const misconceptionCounts: Record<string, number> = {};
  for (const r of session.responses) {
    if (r.correct || r.misconceptionTriggered === 'none') continue;
    misconceptionCounts[r.misconceptionTriggered] =
      (misconceptionCounts[r.misconceptionTriggered] ?? 0) + 1;
  }

  const submission: CloudSubmissionRecord = {
    sessionId: session.id,
    assignmentId: session.assignmentId,
    classroomId: join.classroomId,
    studentLocalId: join.studentId,
    studentName: join.studentName,
    skillMode: session.skillId,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    finalAbility: session.finalAbility,
    accuracy,
    responses: session.responses,
    misconceptionCounts,
    submittedAt: Date.now(),
  };

  const s = getFirebase();
  if (s.kind !== 'enabled') {
    const status: SubmissionState = { state: 'local_only', reason: 'Firebase is not enabled.' };
    writeSubmissionState(session.id, status);
    return status;
  }
  try {
    await setDoc(
      doc(s.db, 'accessCodes', code, 'submissions', session.id),
      submission,
      { merge: true }
    );
    markSessionSubmitted(session.id);
    const status: SubmissionState = { state: 'submitted', at: Date.now() };
    writeSubmissionState(session.id, status);
    return status;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const status: SubmissionState = { state: 'failed', reason: msg };
    writeSubmissionState(session.id, status);
    return status;
  }
}

/**
 * v0.21: re-attempt the cloud submission for a session that previously
 * failed. Looks up the session by id in localStorage and re-runs
 * submitStudentSession(). Returns the new SubmissionState.
 */
export async function retrySubmitStudentSession(sessionId: string): Promise<SubmissionState> {
  const session = loadSessions().find((s) => s.id === sessionId);
  if (!session) return { state: 'failed', reason: 'Session not found locally.' };
  return submitStudentSession(session);
}

// ---------------------------------------------------------------------------
// v0.20: teacher imports submissions from each of their code subcollections
// ---------------------------------------------------------------------------

export type ImportSummary = {
  imported: number;
  skippedDuplicates: number;
  conflicts: number;
  errors: number;
  perCode: Array<{ code: string; imported: number; skipped: number; errors: number }>;
};

export type TeacherImportStatus = {
  lastImportedAt: number;
  lastSummary: ImportSummary;
};

export function loadTeacherImportStatus(): TeacherImportStatus | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(TEACHER_IMPORT_STATUS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.lastImportedAt === 'number') return parsed as TeacherImportStatus;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveTeacherImportStatus(status: TeacherImportStatus): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(TEACHER_IMPORT_STATUS_KEY, JSON.stringify(status));
  } catch {
    /* ignore */
  }
}

/**
 * Walk every classroom this teacher owns with an `accessCode`, read its
 * submissions subcollection, and merge any new sessions into the local
 * store. Deduplicated by sessionId. Never deletes local records.
 */
export async function importStudentSubmissions(): Promise<ImportSummary> {
  const summary: ImportSummary = {
    imported: 0,
    skippedDuplicates: 0,
    conflicts: 0,
    errors: 0,
    perCode: [],
  };
  if (!isFirebaseEnabled() || !currentTeacher()) return summary;
  const s = getFirebase();
  if (s.kind !== 'enabled') return summary;

  // Snapshot local session ids once so the dedupe check is O(1) per row.
  const existingIds = new Set(loadSessions().map((x) => x.id));

  const teacherClassrooms = loadClassrooms().filter(
    (c) =>
      !c.archived &&
      typeof (c as Classroom & { accessCode?: string }).accessCode === 'string'
  );

  for (const c of teacherClassrooms) {
    const code = (c as Classroom & { accessCode?: string }).accessCode!;
    const perCode = { code, imported: 0, skipped: 0, errors: 0 };
    try {
      const snap = await getDocs(
        collection(s.db, 'accessCodes', code, 'submissions')
      );
      for (const docSnap of snap.docs) {
        try {
          const sub = docSnap.data() as CloudSubmissionRecord;
          if (existingIds.has(sub.sessionId)) {
            summary.skippedDuplicates += 1;
            perCode.skipped += 1;
            continue;
          }
          // v0.21 — IMPORTANT: the submission's `studentLocalId` is the
          // STUDENT device's local id, which has nothing to do with the
          // teacher's local roster ids. Resolve (or create) the matching
          // teacher-side Student record FIRST, then use THAT id on the
          // reconstructed session so the dashboards link correctly.
          // v0.26 — Use the owning classroom's grade if available.
          const enrollmentLabel = classroomLabelForEnrollment(c);
          const teacherStudent = findOrCreateStudent(sub.studentName, enrollmentLabel);
          const session: Session = {
            id: sub.sessionId,
            studentId: teacherStudent.id,
            studentSnapshot: {
              name: sub.studentName,
              grade: enrollmentLabel,
              ...(c.curriculumId ? { curriculumId: c.curriculumId } : {}),
              ...(c.gradeId ? { gradeId: c.gradeId } : {}),
              ...(c.subjectId ? { subjectId: c.subjectId } : {}),
              ...(c.academicYear ? { academicYear: c.academicYear } : {}),
            },
            window: 'practice',
            skillId: sub.skillMode,
            startedAt: sub.startedAt,
            completedAt: sub.completedAt,
            responses: sub.responses,
            finalAbility: sub.finalAbility,
            assignmentId: sub.assignmentId,
            // v0.21: keep the student-device id for traceability and
            // mark the session as imported via this code.
            externalStudentLocalId: sub.studentLocalId,
            importedFromCode: code,
            importedAt: Date.now(),
          };
          saveSession(session);
          existingIds.add(sub.sessionId);
          summary.imported += 1;
          perCode.imported += 1;
        } catch {
          summary.errors += 1;
          perCode.errors += 1;
        }
      }
    } catch {
      summary.errors += 1;
      perCode.errors += 1;
    }
    summary.perCode.push(perCode);
  }

  saveTeacherImportStatus({
    lastImportedAt: Date.now(),
    lastSummary: summary,
  });
  return summary;
}

// ---------------------------------------------------------------------------
// Local-only convenience for in-classroom testing (no cloud)
// ---------------------------------------------------------------------------

export function generateLocalAccessCodeForClassroom(classroomId: string): string {
  const code = generateAccessCode();
  const classrooms = loadClassrooms();
  const idx = classrooms.findIndex((c) => c.id === classroomId);
  if (idx < 0) {
    const stub: Classroom & { accessCode?: string } = {
      id: classroomId,
      teacherUid: 'local-demo',
      name: 'Untitled classroom',
      notes: '',
      studentIds: [],
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      accessCode: code,
    };
    saveClassroom(stub);
    return code;
  }
  const updated: Classroom & { accessCode?: string } = {
    ...classrooms[idx],
    accessCode: code,
    updatedAt: Date.now(),
  };
  saveClassroom(updated);
  return code;
}

// Re-export generateId for callers that don't want another import.
export { generateId };
