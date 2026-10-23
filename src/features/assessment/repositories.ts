// v0.60 §7 + §12 + §13 — Repository abstraction for formal assessment.
//
// WHY THIS MATTERS BEYOND TIDINESS
//
// v0.59 depended on localStorage directly. That made browser storage
// the architectural contract, and browser storage cannot support what
// formal assessment eventually needs: authentication, centralisation,
// audit, and access across devices. A student who sits a field test on
// a shared classroom tablet and returns to a different one currently
// loses the sitting.
//
// The App now depends on these interfaces. Swapping in a server-backed
// implementation becomes a constructor change rather than a rewrite.
//
// localStorage adapters are PROTOTYPE ONLY and are not production-ready.

import type { FormalGrowthAssignment } from './formalAssignmentStore';
import type { FormalSessionState } from './formalSessionRunner';
import type { ExposureLog, ItemExposureRecord } from './itemUse';

export const STORAGE_MATURITY_NOTE =
  'The localStorage adapters are a single-device prototype. Formal assessment data must eventually be authenticated, centralised, auditable, and available across devices; browser storage satisfies none of these.';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export type FormalAssignmentRepository = {
  create(a: FormalGrowthAssignment): void;
  byClassroom(classroomId: string): FormalGrowthAssignment[];
  byId(assignmentId: string): FormalGrowthAssignment | null;
  liveForStudent(studentId: string, now: number): FormalGrowthAssignment | null;
  cancel(assignmentId: string): void;
  all(): FormalGrowthAssignment[];
};

export type FormalSessionRepository = {
  save(state: FormalSessionState): void;
  get(sessionId: string): FormalSessionState | null;
  /** §10 — assignment-aware, so a stale session from an expired or
   *  cancelled assignment can never surface as "Continue". */
  activeForStudentAndAssignment(
    studentId: string,
    assignmentId: string
  ): FormalSessionState | null;
  activeForStudentInLiveAssignments(
    studentId: string,
    liveAssignmentIds: string[]
  ): FormalSessionState | null;
  forAssignment(assignmentId: string): FormalSessionState[];
  all(): FormalSessionState[];
};

export type ExposureRepository = {
  load(): ExposureLog;
  get(itemId: string): ItemExposureRecord | null;
  save(log: ExposureLog): void;
};

// §13 — audit events.
export type AuditEventType =
  | 'assignment_created'
  | 'assignment_cancelled'
  | 'session_started'
  | 'session_paused'
  | 'session_resumed'
  | 'session_abandoned'
  | 'session_completed';

export type AuditEvent = {
  eventId: string;
  timestamp: number;
  actorType: 'teacher' | 'student' | 'system';
  actorId: string | null;
  assignmentId: string | null;
  sessionId: string | null;
  eventType: AuditEventType;
  /** Small, non-secure context only. NEVER item content or responses. */
  detail?: string;
};

export type AssessmentAuditRepository = {
  record(event: AuditEvent): void;
  forAssignment(assignmentId: string): AuditEvent[];
  all(): AuditEvent[];
};

/** Guard: an audit event must not carry secure content. */
export function auditEventIsSafe(e: AuditEvent): boolean {
  // JSON.stringify escapes inner quotes (\"stem\"), so matching on
  // `"stem"` alone missed a detail string containing serialised item
  // content. Match the bare keys instead.
  const json = JSON.stringify(e);
  return !/stem|choices|correctIndex|responseValue|explanation/i.test(json);
}

// ---------------------------------------------------------------------------
// In-memory adapters (tests, fixtures)
// ---------------------------------------------------------------------------

export function createMemoryAssignmentRepository(
  seed: FormalGrowthAssignment[] = []
): FormalAssignmentRepository {
  let rows = [...seed];
  const live = (a: FormalGrowthAssignment, now: number) =>
    a.status !== 'cancelled' && now >= a.opensAt && now <= a.closesAt;
  return {
    create(a) {
      rows = [...rows.filter((x) => x.assignmentId !== a.assignmentId), a];
    },
    byClassroom: (id) => rows.filter((a) => a.classroomId === id),
    byId: (id) => rows.find((a) => a.assignmentId === id) ?? null,
    liveForStudent(studentId, now) {
      return (
        rows.find(
          (a) =>
            live(a, now) &&
            // §9 — the FROZEN roster decides, not current membership.
            (a.assignedStudentIds ?? []).includes(studentId)
        ) ?? null
      );
    },
    cancel(id) {
      rows = rows.map((a) =>
        a.assignmentId === id ? { ...a, status: 'cancelled' as const } : a
      );
    },
    all: () => rows,
  };
}

export function createMemorySessionRepository(
  seed: FormalSessionState[] = []
): FormalSessionRepository {
  let rows = [...seed];
  const open = (s: FormalSessionState) =>
    s.status === 'in_progress' || s.status === 'not_started';
  return {
    save(state) {
      rows = [...rows.filter((s) => s.sessionId !== state.sessionId), state];
    },
    get: (id) => rows.find((s) => s.sessionId === id) ?? null,
    activeForStudentAndAssignment: (studentId, assignmentId) =>
      rows.find(
        (s) => s.studentId === studentId && s.assignmentId === assignmentId && open(s)
      ) ?? null,
    activeForStudentInLiveAssignments: (studentId, liveIds) =>
      rows
        .filter(
          (s) =>
            s.studentId === studentId &&
            open(s) &&
            liveIds.includes(s.assignmentId)
        )
        .sort((a, b) => b.lastActivityAt - a.lastActivityAt)[0] ?? null,
    forAssignment: (id) => rows.filter((s) => s.assignmentId === id),
    all: () => rows,
  };
}

export function createMemoryExposureRepository(
  seed: ExposureLog = {}
): ExposureRepository {
  let log: ExposureLog = { ...seed };
  return {
    load: () => ({ ...log }),
    get: (itemId) => log[itemId] ?? null,
    save(next) {
      log = { ...next };
    },
  };
}

export function createMemoryAuditRepository(): AssessmentAuditRepository {
  const rows: AuditEvent[] = [];
  return {
    record(e) {
      if (!auditEventIsSafe(e)) {
        throw new Error('Refusing to record an audit event containing secure content.');
      }
      rows.push(e);
    },
    forAssignment: (id) => rows.filter((e) => e.assignmentId === id),
    all: () => rows,
  };
}

// ---------------------------------------------------------------------------
// localStorage adapters (prototype)
// ---------------------------------------------------------------------------

function readKey<T>(key: string): T[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeKey<T>(key: string, rows: T[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(rows));
  } catch {
    /* storage unavailable */
  }
}

const EXPOSURE_KEY = 'pragati.item_exposure.v1';
const AUDIT_KEY = 'pragati.assessment_audit.v1';

export const localExposureRepository: ExposureRepository = {
  load() {
    const rows = readKey<ItemExposureRecord>(EXPOSURE_KEY);
    return Object.fromEntries(rows.map((r) => [r.itemId, r]));
  },
  get(itemId) {
    return this.load()[itemId] ?? null;
  },
  save(log) {
    writeKey(EXPOSURE_KEY, Object.values(log));
  },
};

export const localAuditRepository: AssessmentAuditRepository = {
  record(e) {
    if (!auditEventIsSafe(e)) {
      throw new Error('Refusing to record an audit event containing secure content.');
    }
    writeKey(AUDIT_KEY, [...readKey<AuditEvent>(AUDIT_KEY), e]);
  },
  forAssignment: (id) =>
    readKey<AuditEvent>(AUDIT_KEY).filter((e) => e.assignmentId === id),
  all: () => readKey<AuditEvent>(AUDIT_KEY),
};
